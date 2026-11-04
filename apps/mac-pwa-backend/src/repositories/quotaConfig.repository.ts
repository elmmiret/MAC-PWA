import { Prisma, TQuota } from '@prisma/client';
import { prisma } from '../config/prisma.js';

const quotaConfigInclude = {
    categoria: { select: { id: true } },
} satisfies Prisma.QuotaConfigInclude;

// Tipus que inclou la categoria i les seves relacions, per a ser utilitzat en les consultes de QuotaConfig.
export type QuotaConfigWithCategory = Prisma.QuotaConfigGetPayload<{
    include: typeof quotaConfigInclude;
}>;

// Classe d'error personalitzada per a indicar que algunes QuotaConfig tenen pagaments relacionats.
export class QuotaConfigsWithPaymentsError extends Error {
    constructor(public readonly quotaConfigIds: string[]) {
        super('Algunes QuotaConfig tenen pagaments relacionats.');
        this.name = 'QuotaConfigsWithPaymentsError';
    }
}

export class QuotaConfigRepository {
    async create(data: Prisma.QuotaConfigCreateInput): Promise<QuotaConfigWithCategory> {
        return prisma.quotaConfig.create({ data, include: quotaConfigInclude });
    }

    async findById(id: string): Promise<QuotaConfigWithCategory | null> {
        return prisma.quotaConfig.findUnique({ where: { id }, include: quotaConfigInclude });
    }

    async findByName(nom: string): Promise<QuotaConfigWithCategory | null> {
        return prisma.quotaConfig.findUnique({ where: { nom }, include: quotaConfigInclude });
    }

    async findByType(tipus: TQuota): Promise<QuotaConfigWithCategory[]> {
        return prisma.quotaConfig.findMany({
            where: { tipus },
            orderBy: { nom: 'asc' },
            include: quotaConfigInclude,
        });
    }

    async categoryExists(categoriaId: string): Promise<boolean> {
        const category = await prisma.categoria.findUnique({
            where: { id: categoriaId },
            select: { id: true },
        });
        return Boolean(category);
    }

    async update(id: string, data: Prisma.QuotaConfigUpdateInput): Promise<QuotaConfigWithCategory> {
        return prisma.quotaConfig.update({ where: { id }, data, include: quotaConfigInclude });
    }

    async deleteMany(ids: string[]): Promise<void> {
        await prisma.$transaction(async (transaction) => {
            const configs = await transaction.quotaConfig.findMany({
                where: { id: { in: ids } },
                select: {
                    id: true,
                    _count: { select: { pagaments: true } },
                },
            });

            const withPayments = configs
                .filter((config) => config._count.pagaments > 0)
                .map((config) => config.id);
            if (withPayments.length > 0) {
                throw new QuotaConfigsWithPaymentsError(withPayments);
            }

            await transaction.quotaConfig.deleteMany({ where: { id: { in: ids } } });
        });
    }

    async activate(id: string): Promise<QuotaConfigWithCategory> {
        return prisma.$transaction(async (transaction) => {
            const target = await transaction.quotaConfig.findUnique({ where: { id } });
            if (!target) throw new Error('QuotaConfig no trobada.');

            await transaction.quotaConfig.updateMany({
                where: {
                    categoriaId: target.categoriaId,
                    tipus: target.tipus,
                    id: { not: target.id },
                    activa: true,
                },
                data: { activa: false },
            });

            return transaction.quotaConfig.update({
                where: { id: target.id },
                data: { activa: true },
                include: quotaConfigInclude,
            });
        });
    }

    async deactivate(id: string): Promise<QuotaConfigWithCategory> {
        return prisma.quotaConfig.update({
            where: { id },
            data: { activa: false },
            include: quotaConfigInclude,
        });
    }

    async addTemporades(id: string, temporadesAplicada: string[]): Promise<QuotaConfigWithCategory> {
        return prisma.$transaction(async (transaction) => {
            const target = await transaction.quotaConfig.findUnique({ where: { id } });
            if (!target) throw new Error('QuotaConfig no trobada.');

            return transaction.quotaConfig.update({
                where: { id },
                data: {
                    temporadesAplicada: {
                        set: [...target.temporadesAplicada, ...temporadesAplicada],
                    },
                },
                include: quotaConfigInclude,
            });
        });
    }
}
