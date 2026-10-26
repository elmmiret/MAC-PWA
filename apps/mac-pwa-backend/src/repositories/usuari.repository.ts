import { Usuari, TUsuari } from '@prisma/client';
import { prisma } from '../config/prisma';

export class UsuariRepository {
    async findByFirebaseUid(firebaseUid: string): Promise<Usuari | null> {
        return await prisma.usuari.findUnique({
            where: { firebaseUid }
        });
    }

    async createOrUpdate(data: {
        firebaseUid: string,
        nom: string,
        congnom1: string,
        cognom2: string,
        // atributs per a crear o actualitzar Usuari
    }): Promise<Usuari> {
        return await prisma.usuari.create({
            data: {
                firebaseUid: data.firebaseUid,
                nom: data.nom,
                cognom1: data.congnom1,
                cognom2: data.cognom2,
                // demes atributs
            }
        });
    }
}