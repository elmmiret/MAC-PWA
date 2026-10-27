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

    // Crear usuaris
    async create(data: {
        firebaseUid: string;
        emailPrincipal: string;
        nom: string;
        cognom1: string;
        cognom2?: string | null;
        tipus: TUsuari;
        perfilCompletat: boolean;
    }): Promise<Usuari> {
        return await prisma.usuari.create({
            data
        });
    }

    // Actualitzar perfil durant onboarding
    // Afegir + atributs obligatoris, com la CATEGORIA
    async updateProfile(userId: string, data: {
        nom: string;
        cognom1: string; 
        cognom2: string;
    }): Promise<Usuari> {
        return await prisma.usuari.update({
            where: { id: userId },
            data: {
                ...data,
                perfilCompletat: true
            }
        });
    }
}
