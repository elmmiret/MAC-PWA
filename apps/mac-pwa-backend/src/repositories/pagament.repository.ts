import { Prisma, TEstat, TQuota } from '@prisma/client';
import { prisma } from '../config/prisma.js';

const pagamentInclude = {
    usuari: { select: { id: true } },
    quotaConfig: { select: { id: true } },
} satisfies Prisma.PagamentInclude;

export type PagamentWithRelations = Prisma.PagamentGetPayload<{
    include: typeof pagamentInclude;
}>;

export type CategoryWithUsersAndConfig = {
    id: string;
    tipus: string;
    usuaris: { id: string }[];
    quotaConfigs: { id: string; preuBase: number }[];
};

export class PagamentRepository {
    async findCategoriesWithUsersAndConfigs(
        categoriaIds: string[],
        tipus: TQuota,
    ): Promise<CategoryWithUsersAndConfig[]> {
        return prisma.categoria.findMany({
            where: { id: { in: categoriaIds } },
            select: {
                id: true,
                tipus: true,
                usuaris: { select: { id: true } },
                quotaConfigs: {
                    where: { tipus, activa: true },
                    select: { id: true, preuBase: true },
                },
            },
        });
    }

    async createMany(data: Prisma.PagamentCreateManyInput[]): Promise<PagamentWithRelations[]> {
        return prisma.pagament.createManyAndReturn({
            data,
            include: pagamentInclude,
        });
    }

    async findByIds(ids: string[]): Promise<{ id: string; estat: TEstat }[]> {
        return prisma.pagament.findMany({
            where: { id: { in: ids } },
            select: { id: true, estat: true },
        });
    }

    async updateEstatOnlyPendent(ids: string[], estat: TEstat): Promise<number> {
        const result = await prisma.pagament.updateMany({
            where: { id: { in: ids }, estat: TEstat.PENDENT },
            data: { estat },
        });
        return result.count;
    }

    async deleteMany(ids: string[]): Promise<number> {
        const result = await prisma.pagament.deleteMany({
            where: { id: { in: ids } },
        });
        return result.count;
    }

    async findByUsuariId(usuariId: string): Promise<PagamentWithRelations[]> {
        return prisma.pagament.findMany({
            where: { usuariId },
            include: pagamentInclude,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findByFirebaseUid(firebaseUid: string): Promise<PagamentWithRelations[]> {
        return prisma.pagament.findMany({
            where: { usuari: { firebaseUid } },
            include: pagamentInclude,
            orderBy: { createdAt: 'desc' },
        });
    }
}
