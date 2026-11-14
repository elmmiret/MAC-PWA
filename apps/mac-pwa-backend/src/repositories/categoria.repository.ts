import { Prisma, TCategoria } from '@prisma/client';
import { prisma } from '../config/prisma.js';

const categoryInclude = {
    usuaris: true,
    rankings: true,
    quotaConfigs: true,
} satisfies Prisma.CategoriaInclude;

// Tipus que inclou la categoria i les seves relacions, per a ser utilitzat en les consultes de Categoria.
export type CategoriaWithRelations = Prisma.CategoriaGetPayload<{
    include: typeof categoryInclude;
}>;

export const CATEGORIES_OFICIALS: TCategoria[] = [
    TCategoria.SUB_8,
    TCategoria.SUB_10,
    TCategoria.SUB_12,
    TCategoria.SUB_14,
    TCategoria.SUB_16,
    TCategoria.SUB_18,
    TCategoria.SUB_20,
    TCategoria.SUB_23,
    TCategoria.SENIOR,
    TCategoria.MASTER,
];

export const CATEGORIES_REGISTRE_AUTO: TCategoria[] = [
    TCategoria.SUB_8,
    TCategoria.SUB_10,
    TCategoria.SUB_12,
    TCategoria.SUB_14,
    TCategoria.SUB_16,
    TCategoria.SUB_18,
    TCategoria.SUB_20,
    TCategoria.SUB_23,
];

export class CategoriaRepository {
    async create(data: Prisma.CategoriaCreateInput): Promise<CategoriaWithRelations> {
        return prisma.categoria.create({ data, include: categoryInclude });
    }

    async findById(id: string): Promise<CategoriaWithRelations | null> {
        return prisma.categoria.findUnique({
            where: { id },
            include: categoryInclude,
        });
    }

    async findByType(tipus: TCategoria): Promise<CategoriaWithRelations | null> {
        return prisma.categoria.findUnique({
            where: { tipus },
            include: categoryInclude,
        });
    }

    async findOficials(): Promise<CategoriaWithRelations[]> {
        return prisma.categoria.findMany({
            where: { tipus: { in: CATEGORIES_OFICIALS } },
            include: categoryInclude,
            orderBy: { tipus: 'asc' },
        });
    }

    async findByBirthYear(year: number): Promise<CategoriaWithRelations | null> {
        return prisma.categoria.findFirst({
            where: {
                tipus: { in: CATEGORIES_REGISTRE_AUTO },
                anyNaixement: { has: year },
            },
            include: categoryInclude,
        });
    }

    async findByFirebaseUid(firebaseUid: string): Promise<CategoriaWithRelations | null> {
        return prisma.categoria.findFirst({
            where: { usuaris: { some: { firebaseUid } } },
            include: categoryInclude,
        });
    }

    async update(id: string, data: Prisma.CategoriaUpdateInput): Promise<CategoriaWithRelations> {
        return prisma.categoria.update({
            where: { id },
            data,
            include: categoryInclude,
        });
    }

    // Retorna els usuaris associats a una categoria concreta, ordenats per email principal.
    async findUsersByIds(ids: string[]): Promise<string[]> {
        const users = await prisma.usuari.findMany({
            where: { id: { in: ids } },
            select: { id: true },
        });

        return users.map(({ id }) => id);
    }

    async setUsers(categoryId: string, userIds: string[]): Promise<void> {
        await prisma.usuari.updateMany({
            where: { id: { in: userIds } },
            data: { categoriaId: categoryId },
        });
    }

    async unsetUsers(categoryId: string, userIds: string[]): Promise<void> {
        await prisma.usuari.updateMany({
            where: {
                id: { in: userIds },
                categoriaId: categoryId,
            },
            data: { categoriaId: null },
        });
    }

    async updateManyAnyNaixement(
        updates: { id: string; anyNaixement: number[] }[],
    ): Promise<CategoriaWithRelations[]> {
        return prisma.$transaction(
            updates.map((update) =>
                prisma.categoria.update({
                    where: { id: update.id },
                    data: { anyNaixement: update.anyNaixement },
                    include: categoryInclude,
                }),
            ),
        );
    }

    async delete(id: string): Promise<void> {
        await prisma.categoria.delete({ where: { id } });
    }
}
