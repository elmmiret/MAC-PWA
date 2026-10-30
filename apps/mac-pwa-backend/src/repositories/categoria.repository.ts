import { Prisma, TCategoria } from '@prisma/client';
import { prisma } from '../config/prisma';

const categoryInclude = {
    usuaris: true,
    rankings: true,
    quotaConfigs: true,
} satisfies Prisma.CategoriaInclude;

export type CategoriaWithRelations = Prisma.CategoriaGetPayload<{
    include: typeof categoryInclude;
}>;

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

    async update(id: string, data: Prisma.CategoriaUpdateInput): Promise<CategoriaWithRelations> {
        return prisma.categoria.update({
            where: { id },
            data,
            include: categoryInclude,
        });
    }

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

    async delete(id: string): Promise<void> {
        await prisma.categoria.delete({ where: { id } });
    }
}
