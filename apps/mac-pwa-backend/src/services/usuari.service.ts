import { Prisma, TDocument, TSexe, Usuari } from '@prisma/client';
import 'dotenv/config';
import { UsuariRepository } from '../repositories/usuari.repository';
import { firebaseAdmin } from '../config/firebase';
import {
    GoogleLoginDTO,
    OperacioUsuariResponseDTO,
    RegisterUsuariDTO,
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
        };
    }

    private mapToOperacioUsuariResponseDTO(message: string, usuariId?: string): OperacioUsuariResponseDTO {
        return {
            message,
            usuariId,
        };
    }

    async registrarUsuari(dto: RegisterUsuariDTO): Promise<UsuariResponseDTO> {
        const existingUser = await this.repository.findByEmail(dto.emailPrincipal);
        if (existingUser) {
            throw new Error('Ja existeix un usuari amb aquest correu electrònic.');
        }

        // Crea un pre-registre, Google assignarà el firebaseUid en el primer accés.
        const usuariDB = await this.repository.create({
            firebaseUid: null,
            emailPrincipal: dto.emailPrincipal,
            nom: dto.nom ?? null,
            cognom1: dto.cognom1 ?? null,
            cognom2: dto.cognom2 || null
        });

        return this.mapToUsuariResponseDTO(usuariDB);
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

        const existingByFirebaseUid = await this.repository.findByFirebaseUid(decodedToken.uid);
        if (existingByFirebaseUid) {
            return this.mapToUsuariResponseDTO(existingByFirebaseUid);
        }

        const preRegisteredUser = await this.repository.findByEmail(decodedToken.email);
        if (!preRegisteredUser) {
            throw new Error('Aquest correu no ha estat pre-registrat per un administrador.');
        }

        const usuariDB = await this.repository.updateFirebaseUid(
            preRegisteredUser.id,
            decodedToken.uid,
        );

        return this.mapToUsuariResponseDTO(usuariDB);
    }

    async actualitzarUsuari(id: string, dto: UpdatePerfilDTO): Promise<UsuariResponseDTO> {
        const usuariExistent = await this.repository.findById(id);
        if (!usuariExistent) {
            throw new Error("L'usuari no existeix a la base de dades.");
        }

        const data: Prisma.UsuariUpdateInput = {
            ...dto,
            sexe: dto.sexe as TSexe | null | undefined,
            tipusDocument: dto.tipusDocument as TDocument | null | undefined,
            tipusDocumentTutor: dto.tipusDocumentTutor as TDocument | null | undefined,
        };

        const usuariActualitzat = await this.repository.updateById(id, data);

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

    async obtenirTotsElsUsuaris(): Promise<UsuariResponseDTO[]> {
        const adminUids = new Set<string>();
        let pageToken: string | undefined;

        do {
            const page = await firebaseAdmin.auth().listUsers(1000, pageToken);
            for (const firebaseUser of page.users) {
                if (firebaseUser.customClaims?.admin === true) {
                    adminUids.add(firebaseUser.uid);
                }
            }
            pageToken = page.pageToken;
        } while (pageToken);

        const usuaris = await this.repository.findAll();
        return usuaris
            .filter((usuari) => !usuari.firebaseUid || !adminUids.has(usuari.firebaseUid))
            .map((usuari) => this.mapToUsuariResponseDTO(usuari));
    }

    async tancarSessio(firebaseUid: string): Promise<OperacioUsuariResponseDTO> {
        await firebaseAdmin.auth().revokeRefreshTokens(firebaseUid);

        return this.mapToOperacioUsuariResponseDTO('Sessió tancada correctament.');
    }

    async eliminarUsuari(targetId: string, actorIsAdmin: boolean): Promise<OperacioUsuariResponseDTO> {
        const target = await this.repository.findById(targetId);

        if (!actorIsAdmin) {
            throw new Error('Només els administradors poden eliminar usuaris.');
        }

        if (!target) {
            throw new Error('L\'usuari que es vol eliminar no existeix.');
        }

        if (target.firebaseUid) {
            await firebaseAdmin.auth().deleteUser(target.firebaseUid);
        }
        await this.repository.deleteById(target.id);

        return this.mapToOperacioUsuariResponseDTO(
            'Usuari eliminat correctament.',
            target.id,
        );
    }
}
