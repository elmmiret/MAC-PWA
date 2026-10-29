import { Usuari } from '@prisma/client';
import 'dotenv/config';
import { UsuariRepository } from '../repositories/usuari.repository';
import { firebaseAdmin } from '../config/firebase';
import {
    GoogleLoginDTO,
    LoginResponseDTO,
    LoginUsuariDTO,
    OperacioUsuariResponseDTO,
    RegisterUsuariDTO,
    TUsuari,
    UpdatePerfilDTO,
    UsuariResponseDTO,
} from 'shared';
import { IUsuariService } from '../interfaces/usuari.interface';

export class UsuariService implements IUsuariService {
    private repository: UsuariRepository;

    constructor() {
        this.repository = new UsuariRepository();
    }

    private mapToUsuariResponseDTO(usuari: Usuari): UsuariResponseDTO {
        return {
            id: usuari.id,
            firebaseUid: usuari.firebaseUid,
            emailPrincipal: usuari.emailPrincipal,
            nom: usuari.nom,
            cognom1: usuari.cognom1,
            cognom2: usuari.cognom2,
            tipus: usuari.tipus as TUsuari,
            perfilCompletat: usuari.perfilCompletat
        };
    }

    private mapToLoginResponseDTO(
        idToken: string,
        refreshToken: string | undefined,
        expiresIn: string | undefined,
        localId: string,
        usuariId: string
    ): LoginResponseDTO {
        return {
            idToken,
            refreshToken,
            expiresIn,
            localId,
            usuariId,
        };
    }

    private mapToOperacioUsuariResponseDTO(message: string, usuariId?: string): OperacioUsuariResponseDTO {
        return {
            message,
            usuariId,
        };
    }

    async registrarUsuari(dto: RegisterUsuariDTO): Promise<UsuariResponseDTO> {
        // Crear usuari a Firebase Auth
        const firebaseUser = await firebaseAdmin.auth().createUser({
            email: dto.emailPrincipal,
            password: dto.password,
            displayName: `${dto.nom} ${dto.cognom1}`
        });

        // Guardar usuari a PostgreSQL amb el rol indicat (o NO_SOCI per defecte si no s'indica)
        const usuariDB = await this.repository.create({
            firebaseUid: firebaseUser.uid,
            emailPrincipal: dto.emailPrincipal,
            nom: dto.nom,
            cognom1: dto.cognom1,
            cognom2: dto.cognom2 || null,
            tipus: (dto.tipus ?? TUsuari.NO_SOCI) as TUsuari,
            perfilCompletat: false
        });

        return this.mapToUsuariResponseDTO(usuariDB);
    }

    async iniciarSessio(dto: LoginUsuariDTO): Promise<LoginResponseDTO> {
        const apiKey = process.env.FIREBASE_WEB_API_KEY;

        if (!apiKey) {
            throw new Error('FIREBASE_WEB_API_KEY no està definida.');
        }

        const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: dto.emailPrincipal,
                    password: dto.password,
                    returnSecureToken: true,
                }),
            },
        );

        const result = await response.json() as {
            idToken?: string;
            refreshToken?: string;
            expiresIn?: string;
            localId?: string;
            error?: { message?: string };
        };

        if (!response.ok || !result.idToken) {
            throw new Error(result.error?.message ?? 'No s\'ha pogut iniciar sessió.');
        }

        if (!result.localId) {
            throw new Error('Firebase no ha retornat un identificador d\'usuari.');
        }

        const usuari = await this.repository.findByFirebaseUid(result.localId);

        if (!usuari) {
            throw new Error('L\'usuari autenticat no existeix a la base de dades.');
        }

        return this.mapToLoginResponseDTO(
            result.idToken,
            result.refreshToken,
            result.expiresIn,
            result.localId,
            usuari.id,
        );
    }

    async iniciarSessioGoogle(dto: GoogleLoginDTO): Promise<UsuariResponseDTO> {
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(dto.firebaseToken);
        const provider = decodedToken.firebase?.sign_in_provider;

        if (provider !== 'google.com') {
            throw new Error('El token no correspon a un inici de sessió amb Google.');
        }

        if (!decodedToken.email) {
            throw new Error('El token de Google no conté un correu electrònic vàlid.');
        }

        const existingUser = await this.repository.findByFirebaseUid(decodedToken.uid);
        if (existingUser) {
            return this.mapToUsuariResponseDTO(existingUser);
        }

        const nameParts = (decodedToken.name ?? '').trim().split(/\s+/).filter(Boolean);
        const usuariDB = await this.repository.create({
            firebaseUid: decodedToken.uid,
            emailPrincipal: decodedToken.email,
            nom: nameParts[0] ?? null,
            cognom1: nameParts.slice(1).join(' ') || null,
            tipus: TUsuari.NO_SOCI,
            perfilCompletat: false,
        });

        return this.mapToUsuariResponseDTO(usuariDB);
    }

    async completarPerfil(firebaseUid: string, dto: UpdatePerfilDTO): Promise<UsuariResponseDTO> {
        const usuariExistent = await this.repository.findByFirebaseUid(firebaseUid);
        if (!usuariExistent) {
            throw new Error("L'usuari no existeix a la base de dades.");
        }

        const usuariActualitzat = await this.repository.updateProfile(usuariExistent.id, {
            nom: dto.nom,
            cognom1: dto.cognom1,
            cognom2: dto.cognom2
        });

        return this.mapToUsuariResponseDTO(usuariActualitzat);
    }

    async obtenirUsuariPerId(id: string): Promise<UsuariResponseDTO> {
        const usuariDB = await this.repository.findById(id);
        if (!usuariDB) {
            throw new Error("L'usuari no existeix.");
        }
        return this.mapToUsuariResponseDTO(usuariDB);
    }

    async obtenirUsuariPerFirebaseId(firebaseId: string): Promise<UsuariResponseDTO> {
        const usuariDB = await this.repository.findByFirebaseUid(firebaseId);
        if(!usuariDB) {
            throw new Error("L'usuair no existeix.");
        }
        return this.mapToUsuariResponseDTO(usuariDB);
    }

    async tancarSessio(firebaseUid: string): Promise<OperacioUsuariResponseDTO> {
        await firebaseAdmin.auth().revokeRefreshTokens(firebaseUid);

        return this.mapToOperacioUsuariResponseDTO('Sessió tancada correctament.');
    }

    async eliminarUsuari(targetId: string, actorFirebaseUid: string): Promise<OperacioUsuariResponseDTO> {
        const actor = await this.repository.findByFirebaseUid(actorFirebaseUid);
        const target = await this.repository.findById(targetId);

        if (!actor) {
            throw new Error('L\'usuari autenticat no existeix.');
        }

        if (!target) {
            throw new Error('L\'usuari que es vol eliminar no existeix.');
        }

        const isOwner = actor.id === target.id;
        const isAdmin = actor.tipus === TUsuari.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new Error('Només pots eliminar el teu propi usuari.');
        }

        await firebaseAdmin.auth().deleteUser(target.firebaseUid);
        await this.repository.deleteById(target.id);

        return this.mapToOperacioUsuariResponseDTO(
            'Usuari eliminat correctament.',
            target.id,
        );
    }
}
