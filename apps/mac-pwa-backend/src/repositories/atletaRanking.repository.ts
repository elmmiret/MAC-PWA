import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';

const atletaRankingInclude = {
    usuari: { select: { id: true } },
    ranking: { select: { id: true } },
} satisfies Prisma.AtletaRankingInclude;

export type AtletaRankingWithRelations = Prisma.AtletaRankingGetPayload<{
    include: typeof atletaRankingInclude;
}>;

export class AtletaRankingRepository {
    async create(data: Prisma.AtletaRankingCreateInput): Promise<AtletaRankingWithRelations> {
        return prisma.atletaRanking.create({ data, include: atletaRankingInclude });
    }

    async findById(id: string): Promise<AtletaRankingWithRelations | null> {
        return prisma.atletaRanking.findUnique({ where: { id }, include: atletaRankingInclude });
    }

    async findByRankingId(rankingId: string): Promise<AtletaRankingWithRelations[]> {
        return prisma.atletaRanking.findMany({
            where: { rankingId },
            orderBy: { marca: 'asc' },
            include: atletaRankingInclude,
        });
    }

    async existsByUsuariAndRanking(usuariId: string, rankingId: string): Promise<boolean> {
        const count = await prisma.atletaRanking.count({
            where: { usuariId, rankingId },
        });
        return count > 0;
    }

    async update(id: string, data: Prisma.AtletaRankingUpdateInput): Promise<AtletaRankingWithRelations> {
        return prisma.atletaRanking.update({ where: { id }, data, include: atletaRankingInclude });
    }

    async delete(id: string): Promise<void> {
        await prisma.atletaRanking.delete({ where: { id } });
    }
}
