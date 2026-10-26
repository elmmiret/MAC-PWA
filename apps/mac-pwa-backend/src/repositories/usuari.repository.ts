import { Usuari, TUsuari } from '@prisma/client';
import { prisma } from '../config/prisma';

export class UsuariRepository {
    async findByFirebaseUid(firebaseUid: string): Promise<Usuari | null> {
        return await prisma.usuari.findUnique({
            where: { firebaseUid }
        });
    }

    async findById(id: string): Promise<Usuari | null> {
        return await prisma.usuari.findUnique({
            where: { id }
        });
    }

    async upsertByFirebaseUid(data: {
        firebaseUid: string;
        email: string;
        nom?: string;
        cognom1?: string;
        cognom2?: string;
    }): Promise<Usuari> {
        return await prisma.usuari.upsert({
            where: { firebaseUid: data.firebaseUid },
            update: { 
                emailPrincipal: data.email,
                ...(data.nom && { nom: data.nom }),
                ...(data.cognom1 && { cognom1: data.cognom1 }),
                ...(data.cognom2 && { cognom2: data.cognom2 }),
             },
            // falten atributs que son obligatoris (per això surt vermell)
            // tambe cambiar que es obligatori i que no per a crear un Usuari
            create: {
                firebaseUid: data.firebaseUid,
                emailPrincipal: data.email,
                nom: data.nom || '',
                cognom1: data.cognom1 || '',
                cognom2: data.cognom2 || '',
                tipus: TUsuari.NO_SOCI  // tipus per defecte en registrar-se
            }
        });
    }
}