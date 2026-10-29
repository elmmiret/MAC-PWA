import { Prisma, Usuari } from '@prisma/client';
import { prisma } from '../config/prisma';

export class UsuariRepository {
    async findAll(): Promise<Usuari[]> {
        return await prisma.usuari.findMany({
            orderBy: { emailPrincipal: 'asc' }
        });
    }

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

    // Actualitzar perfil d'un Usuari
    // AFEGIR 
    async updateById(userId: string, data: Prisma.UsuariUpdateInput): Promise<Usuari> {
        return await prisma.usuari.update({
            where: { id: userId },
            data
        });
    }
}
