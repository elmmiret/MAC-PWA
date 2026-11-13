import { TEstat, TQuota } from '@prisma/client';
import type {
    CreatePagamentsByCategoriesDTO,
    DeletePagamentsDTO,
    MePagamentResponseDTO,
    PagamentResponseDTO,
    UpdatePagamentsEstatDTO,
} from 'shared';
import type { IPagamentService } from '../interfaces/pagament.interface.js';
import { PagamentRepository, type PagamentWithRelations } from '../repositories/pagament.repository.js';
import { UsuariRepository } from '../repositories/usuari.repository.js';

export class PagamentService implements IPagamentService {
    private pagamentRepository: PagamentRepository;
    private usuariRepository: UsuariRepository;

    constructor() {
        this.pagamentRepository = new PagamentRepository();
        this.usuariRepository = new UsuariRepository();
    }

    private parseType(value: string): TQuota {
        if (!Object.values(TQuota).includes(value as TQuota)) {
            throw new Error(`Tipus de quota invàlid: ${value}.`);
        }
        return value as TQuota;
    }

    private computeDataLimit(): Date {
        const limit = new Date();
        limit.setMonth(limit.getMonth() + 2);
        return limit;
    }

    private formatMotiu(tipus: TQuota, categoriaTipus: string, data: Date): string {
        const dataStr = data.toLocaleDateString('ca-ES');
        return `Pagament de la quota '${tipus}', categoria '${categoriaTipus}', generada el dia '${dataStr}'`;
    }

    private async computePreu(preuBase: number, id: string): Promise<number> {
        let discount = 0;
        const usuariData = await this.usuariRepository.findById(id);
        if (!usuariData) {
            throw new Error(`Usuari no trobat: ${id}`);
        }

        // Aplicar descompte si és entrenador
        if(usuariData.entrenador) discount += 0.3;
        // Aplicar descompte si té un familiar associat
        if(usuariData.usuariFamiliarId) discount += 0.1;

        const finalPrice = preuBase * (1 - discount);
        return Math.round(finalPrice * 100) / 100;
    }

    private mapToDTO(pagament: PagamentWithRelations): PagamentResponseDTO {
        return {
            id: pagament.id,
            preu: pagament.preu,
            estat: pagament.estat,
            dataPagament: pagament.dataPagament?.toISOString() ?? null,
            dataLimit: pagament.dataLimit.toISOString(),
            motiu: pagament.motiu,
            usuariId: pagament.usuari.id,
            quotaConfigId: pagament.quotaConfig.id,
            createdAt: pagament.createdAt.toISOString(),
            updatedAt: pagament.updatedAt.toISOString(),
        };
    }

    private mapToMeDTO(pagament: PagamentWithRelations): MePagamentResponseDTO {
        return {
            preu: pagament.preu,
            estat: pagament.estat,
            dataPagament: pagament.dataPagament?.toISOString() ?? null,
            dataLimit: pagament.dataLimit.toISOString(),
            motiu: pagament.motiu,
        };
    }

    async createByCategories(
        type: string,
        dto: CreatePagamentsByCategoriesDTO,
    ): Promise<PagamentResponseDTO[]> {
        const tipus = this.parseType(type);
        const categoriaIds = [...new Set(dto.categoriaIds ?? [])];

        if (categoriaIds.length === 0) {
            throw new Error('Cal indicar almenys una categoria.');
        }

        const categories = await this.pagamentRepository.findCategoriesWithUsersAndConfigs(categoriaIds, tipus);
        const foundIds = new Set(categories.map((c) => c.id));
        const missingIds = categoriaIds.filter((id) => !foundIds.has(id));
        if (missingIds.length > 0) {
            throw new Error(`Categoria/s no trobada/s: ${missingIds.join(', ')}.`);
        }

        const now = new Date();
        const dataLimit = this.computeDataLimit();
        const createInputs: { usuariId: string; quotaConfigId: string; preu: number; dataLimit: Date; motiu: string }[] = [];

        for (const categoria of categories) {
            const activeConfig = categoria.quotaConfigs[0];
            if (!activeConfig) {
                throw new Error(
                    `La categoria '${categoria.tipus}' no té una QuotaConfig de tipus '${tipus}' activa o configurada.`,
                );
            }

            const motiu = this.formatMotiu(tipus, categoria.tipus, now);
            for (const usuari of categoria.usuaris) {
                createInputs.push({
                    usuariId: usuari.id,
                    quotaConfigId: activeConfig.id,
                    preu: await this.computePreu(activeConfig.preuBase, usuari.id),
                    dataLimit,
                    motiu,
                });
            }
        }

        if (createInputs.length === 0) {
            throw new Error('No hi ha usuaris associats a les categories indicades.');
        }

        const pagaments = await this.pagamentRepository.createMany(createInputs);
        return pagaments.map((p) => this.mapToDTO(p));
    }

    async markPaid(dto: UpdatePagamentsEstatDTO): Promise<number> {
        const ids = [...new Set(dto.ids ?? [])];
        if (ids.length === 0) throw new Error('Cal indicar almenys un pagament.');
        return this.pagamentRepository.updateEstatOnlyPendent(ids, TEstat.PAGAT);
    }

    async markCanceled(dto: UpdatePagamentsEstatDTO): Promise<number> {
        const ids = [...new Set(dto.ids ?? [])];
        if (ids.length === 0) throw new Error('Cal indicar almenys un pagament.');
        return this.pagamentRepository.updateEstatOnlyPendent(ids, TEstat.CANCELAT);
    }

    async deleteMany(dto: DeletePagamentsDTO): Promise<number> {
        const ids = [...new Set(dto.ids ?? [])];
        if (ids.length === 0) throw new Error('Cal indicar almenys un pagament.');
        return this.pagamentRepository.deleteMany(ids);
    }

    async getByUsuariId(usuariId: string): Promise<PagamentResponseDTO[]> {
        const pagaments = await this.pagamentRepository.findByUsuariId(usuariId);
        return pagaments.map((p) => this.mapToDTO(p));
    }

    async getCurrentPagaments(firebaseUid: string): Promise<MePagamentResponseDTO[]> {
        const pagaments = await this.pagamentRepository.findByFirebaseUid(firebaseUid);
        return pagaments.map((p) => this.mapToMeDTO(p));
    }
}
