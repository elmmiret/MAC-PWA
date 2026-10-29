import { Prisma, Usuari } from '@prisma/client';
import { prisma } from '../config/prisma';

export class UsuariRepository {
    async findByFirebaseUid(firebaseUid: string): Promise<Usuari | null> {
        return await prisma.usuari.findUnique({
            where: { firebaseUid }
        });
    }

    async findByEmail(emailPrincipal: string): Promise<Usuari | null> {
        return await prisma.usuari.findUnique({
            where: { emailPrincipal }
        });
    }

    async findById(id: string): Promise<Usuari | null> {
        return await prisma.usuari.findUnique({
            where: { id }
        });
    }

    async deleteById(id: string): Promise<Usuari> {
        return await prisma.usuari.delete({
            where: { id }
        });
    }

    // Crear usuaris
    async create(data: Prisma.UsuariCreateInput): Promise<Usuari> {
        return await prisma.usuari.create({
            data
        });
    }

    async updateFirebaseUid(id: string, firebaseUid: string): Promise<Usuari> {
        return await prisma.usuari.update({
            where: { id },
            data: { firebaseUid }
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
