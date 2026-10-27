import { Usuari } from '@prisma/client';
import 'dotenv/config';
import { UsuariRepository } from '../repositories/usuari.repository';
import { firebaseAdmin } from '../config/firebase';
import { RegisterUsuariDTO, UpdatePerfilDTO, UsuariResponseDTO, TUsuari } from 'shared'
import { IUsuariService } from '../interfaces/usuari.interface';

export class UsuariService {
    private repository: UsuariRepository;

    constructor() {
        this.repository = new UsuariRepository();
    }

    private mapToDTO(usuari: Usuari): UsuariResponseDTO {
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
            tipus: dto.tipus || TUsuari.NO_SOCI,    // Si no s'especifica, assigna NO_SOCI
            perfilCompletat: false
        });

        return this.mapToDTO(usuariDB);
    }

    async iniciarSessio(email: string, password: string) {
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
                    email,
                    password,
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

        return {
            idToken: result.idToken,
            refreshToken: result.refreshToken,
            expiresIn: result.expiresIn,
            localId: result.localId,
        };
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

        return this.mapToDTO(usuariActualitzat);
    }

    async obtenirUsuariPerId(id: string): Promise<UsuariResponseDTO> {
        const usuariDB = await this.repository.findById(id);
        if (!usuariDB) {
            throw new Error("L'usuari no existeix.");
        }
        return this.mapToDTO(usuariDB);
    }

    async obtenirUsuariPerFirebaseId(firebaseId: string): Promise<UsuariResponseDTO> {
        const usuariDB = await this.repository.findByFirebaseUid(firebaseId);
        if(!usuariDB) {
            throw new Error("L'usuair no existeix.");
        }
        return this.mapToDTO(usuariDB);
    }
}
