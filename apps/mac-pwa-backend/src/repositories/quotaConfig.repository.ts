import { Prisma, QuotaConfig, TQuota } from '@prisma/client';
import { prisma } from '../config/prisma';

export class QuotaConfigRepository {
    async create(data: Prisma.QuotaConfigCreateInput): Promise<QuotaConfig> {
        return prisma.quotaConfig.create({ data });
    }

    async findById(id: string): Promise<QuotaConfig | null> {
        return prisma.quotaConfig.findUnique({ where: { id } });
    }

    async findByName(nom: string): Promise<QuotaConfig | null> {
        return prisma.quotaConfig.findUnique({ where: { nom } });
    }

    async findByType(tipus: TQuota): Promise<QuotaConfig[]> {
        return prisma.quotaConfig.findMany({
            where: { tipus },
            orderBy: { nom: 'asc' },
        });
    }

    async findByCategory(categoriaId: string): Promise<QuotaConfig[]> {
        return prisma.quotaConfig.findMany({
            where: { categoriaId },
            orderBy: [{ tipus: 'asc' }, { nom: 'asc' }],
        });
    }

    async categoryExists(categoriaId: string): Promise<boolean> {
        const category = await prisma.categoria.findUnique({
            where: { id: categoriaId },
            select: { id: true },
        });
        return Boolean(category);
    }

    async update(id: string, data: Prisma.QuotaConfigUpdateInput): Promise<QuotaConfig> {
        return prisma.quotaConfig.update({ where: { id }, data });
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

            const withPayments = configs.find((config) => config._count.pagaments > 0);
            if (withPayments) {
                throw new Error(`La QuotaConfig ${withPayments.id} té pagaments relacionats.`);
            }

            await transaction.quotaConfig.deleteMany({ where: { id: { in: ids } } });
        });
    }

    async activate(id: string): Promise<QuotaConfig> {
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
            });
        });
    }
}
