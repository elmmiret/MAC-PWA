import { Usuari } from '@prisma/client';
import { UsuariRepository } from '../repositories/usuari.repository';
import { firebaseAdmin } from '../config/firebase';
import { SyncUsuariDTO, UsuariResponseDTO, TUsuari } from 'shared'

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
            cognom2: usuari.cognom2 || '',
            tipus: usuari.tipus as TUsuari
        };
    }

    async sincronitzarUsuari(dto: SyncUsuariDTO): Promise<UsuariResponseDTO> {
        // Validar token de Firebase
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(dto.firebaseToken);
        const { uid, email } = decodedToken;

        // Comprovar que l'email principal (obligatori) existeix al token
        if (!email) {
            throw new Error('El token de Firebase no conté un correu electrònic vàlid i obligatori.');
        }

        // Upsert a la base de dades
        const usuariDB = await this.repository.upsertByFirebaseUid({
            firebaseUid: uid,
            email,
            nom: dto.nom,
            cognom1: dto.cognom1,
            cognom2: dto.cognom2,
        });

        return this.mapToDTO(usuariDB);
    }
}