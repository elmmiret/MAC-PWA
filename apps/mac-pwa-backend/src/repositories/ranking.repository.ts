import { Prisma, TSexe } from '@prisma/client';
import { prisma } from '../config/prisma.js';

const rankingInclude = {
    prova: { select: { id: true } },
    categoria: { select: { id: true, tipus: true } },
    atletaRankings: { select: { id: true } },
} satisfies Prisma.RankingInclude;

export type RankingWithRelations = Prisma.RankingGetPayload<{
    include: typeof rankingInclude;
}>;

export class RankingRepository {
    async create(data: Prisma.RankingCreateInput): Promise<RankingWithRelations> {
        return prisma.ranking.create({ data, include: rankingInclude });
    }

    async findById(id: string): Promise<RankingWithRelations | null> {
        return prisma.ranking.findUnique({ where: { id }, include: rankingInclude });
    }

    async findByCategoriaProvaSexe(
        categoriaId: string,
        provaId: string,
        sexe: TSexe,
    ): Promise<RankingWithRelations[]> {
        return prisma.ranking.findMany({
            where: { categoriaId, provaId, sexe },
            include: rankingInclude,
        });
    }

    async countByCategoria(categoriaId: string): Promise<number> {
        return prisma.ranking.count({ where: { categoriaId } });
    }

    async update(id: string, data: Prisma.RankingUpdateInput): Promise<RankingWithRelations> {
        return prisma.ranking.update({ where: { id }, data, include: rankingInclude });
    }

    async delete(id: string): Promise<void> {
        await prisma.$transaction(async (transaction) => {
            const ranking = await transaction.ranking.findUnique({ where: { id } });
            if (!ranking) throw new Error('Ranking no trobat.');

            await transaction.atletaRanking.deleteMany({ where: { rankingId: id } });
            await transaction.ranking.delete({ where: { id } });
        });
    }
}
