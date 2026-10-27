import { Usuari } from '@prisma/client';
import { UsuariRepository } from '../repositories/usuari.repository';
import { firebaseAdmin } from '../config/firebase';
import { SyncUsuariDTO, RegisterUsuariDTO, UpdatePerfilDTO, UsuariResponseDTO, TUsuari } from 'shared'

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

    async sincronitzarUsuari(dto: SyncUsuariDTO): Promise<UsuariResponseDTO> {
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(dto.firebaseToken);
        const { uid, email } = decodedToken;

        if (!email) {
            throw new Error('El token de firebase no conté un correo electrònic vàlid.');
        }

        const usuariDB = await this.repository.upsertBasicUser(uid, email);
        return this.mapToDTO(usuariDB);
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
}