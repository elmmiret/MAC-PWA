import { Prisma, type Usuari } from '@prisma/client';
import { prisma } from '../config/prisma.js';

const userInclude = {
    pagaments: { select: { id: true } },
} satisfies Prisma.UsuariInclude;

export type UsuariWithPayments = Prisma.UsuariGetPayload<{
    include: typeof userInclude;
}>;

export class UsuariRepository {
    async findAll(): Promise<UsuariWithPayments[]> {
        return await prisma.usuari.findMany({
            orderBy: { emailPrincipal: 'asc' },
            include: userInclude,
        });
    }

    async findByFirebaseUid(firebaseUid: string): Promise<UsuariWithPayments | null> {
        return await prisma.usuari.findUnique({
            where: { firebaseUid },
            include: userInclude,
        });
    }

    async findByEmail(emailPrincipal: string): Promise<UsuariWithPayments | null> {
        return await prisma.usuari.findUnique({
            where: { emailPrincipal },
            include: userInclude,
        });
    }

    async findById(id: string): Promise<UsuariWithPayments | null> {
        return await prisma.usuari.findUnique({
            where: { id },
            include: userInclude,
        });
    }

    async deleteById(id: string): Promise<Usuari> {
        return await prisma.usuari.delete({
            where: { id }
        });
    }

    // Crear usuaris
    async create(data: Prisma.UsuariCreateInput): Promise<UsuariWithPayments> {
        return await prisma.usuari.create({
            data,
            include: userInclude,
        });
    }

    async updateFirebaseUid(id: string, firebaseUid: string): Promise<UsuariWithPayments> {
        return await prisma.usuari.update({
            where: { id },
            data: { firebaseUid }
            , include: userInclude,
        });
    }

    async setEntrenador(id: string, entrenador: boolean): Promise<UsuariWithPayments> {
        return await prisma.usuari.update({
            where: { id },
            data: { entrenador },
            include: userInclude,
        });
    }

    async setFamiliar(familiarId: string, usuariIds: string[]): Promise<void> {
        await prisma.$transaction(async (transaction) => {
            const familiar = await transaction.usuari.findUnique({
                where: { id: familiarId },
                select: { id: true, usuariFamiliarId: true },
            });

            if (!familiar) throw new Error('L\'usuari familiar no existeix.');
            if (usuariIds.includes(familiarId)) {
                throw new Error('Un usuari no pot ser el seu propi familiar.');
            }
            if (familiar.usuariFamiliarId && usuariIds.includes(familiar.usuariFamiliarId)) {
                throw new Error('No es pot crear una relació familiar circular.');
            }

            const users = await transaction.usuari.findMany({
                where: { id: { in: usuariIds } },
                select: { id: true },
            });

            if (users.length !== usuariIds.length) {
                throw new Error('Un o més usuaris no existeixen.');
            }

            await transaction.usuari.updateMany({
                where: { id: { in: usuariIds } },
                data: { usuariFamiliarId: familiarId },
            });
        });
    }

    // Actualitzar perfil d'un Usuari
    // AFEGIR 
    async updateById(userId: string, data: Prisma.UsuariUpdateInput): Promise<UsuariWithPayments> {
        return await prisma.usuari.update({
            where: { id: userId },
            data,
            include: userInclude,
        });
    }

    async findUsersForCategoriaAssignment(): Promise<{ id: string; dataNaixement: Date }[]> {
        return await prisma.usuari.findMany({
            select: { id: true, dataNaixement: true },
        });
    }

    async updateCategoriaIds(updates: { id: string; categoriaId: string | null }[]): Promise<void> {
        if (updates.length === 0) return;

        await prisma.$transaction(
            updates.map((update) =>
                prisma.usuari.update({
                    where: { id: update.id },
                    data: { categoriaId: update.categoriaId },
                }),
            ),
        );
    }
}
