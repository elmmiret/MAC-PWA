import { Usuari, TUsuari } from '@prisma/client';
import { UsuariRepository } from '../repositories/usuari.repository';
import { firebaseAdmin } from '../config/firebase';
import { CreateUsuariDTO } from '../../../../packages/shared/src';

export class UsuariService {
    private repository: UsuariRepository;

    constructor() {
        this.repository = new UsuariRepository();
    }

    async registrarUsuari(dto: CreateUsuariDTO): Promise<Usuari> {
        try {
            // Verificar el token de Firebase enviat pel client
            const decodedToken = await firebaseAdmin.auth().verifyIdToken(dto.firebaseToken);
            const { uid, email, name} = decodedToken;

            if (!email) {
                throw new Error('El token de Firebase no conté nu correu electrònic vàlid.');
            }

            // Comprovar si ja existeix a la base de dades
            const usuariExistent = await this.repository.findByFirebaseUid(uid);
            if (usuariExistent) {
                throw new Error('Aquest usuari ja està registrar a la base de dades.');
            }

            // Crear l'usuari nou fent servir les dades del DTO i de Firebase
            const nouUsuari = await this.repository.create({
                firebaseUid: uid,
                // atributs de creacio del dto
            });

            return nouUsuari;
        } catch (error: any) {
            throw new Error(`Error en el registre de l'usuari ${error.message}`);
        }
    }
}