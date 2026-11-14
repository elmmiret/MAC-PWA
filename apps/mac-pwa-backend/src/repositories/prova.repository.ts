import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';

export type ProvaWithRankings = Prisma.ProvaGetPayload<{
    include: { rankings: { select: { id: true } } };
}>;

export class ProvaRepository {
    async create(data: Prisma.ProvaCreateInput): Promise<ProvaWithRankings> {
        return prisma.prova.create({
            data,
            include: { rankings: { select: { id: true } } },
        });
    }

    async findAll(): Promise<ProvaWithRankings[]> {
        return prisma.prova.findMany({
            orderBy: { nom: 'asc' },
            include: { rankings: { select: { id: true } } },
        });
    }

    async findById(id: string): Promise<ProvaWithRankings | null> {
        return prisma.prova.findUnique({
            where: { id },
            include: { rankings: { select: { id: true } } },
        });
    }

    async count(): Promise<number> {
        return prisma.prova.count();
    }

    async deleteMany(ids: string[]): Promise<void> {
        await prisma.prova.deleteMany({ where: { id: { in: ids } } });
    }
}
