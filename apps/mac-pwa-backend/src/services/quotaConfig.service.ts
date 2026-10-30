import { Prisma, TQuota } from '@prisma/client';
import {
    CreateQuotaConfigDTO,
    DeleteQuotaConfigsDTO,
    QuotaConfigResponseDTO,
    UpdateQuotaConfigDTO,
} from 'shared';
import { IQuotaConfigService } from '../interfaces/quotaConfig.interface';
import { QuotaConfigRepository } from '../repositories/quotaConfig.repository';

export class QuotaConfigService implements IQuotaConfigService {
    private repository: QuotaConfigRepository;

    constructor() {
        this.repository = new QuotaConfigRepository();
    }

    private mapToDTO(config: Prisma.QuotaConfigGetPayload<object>): QuotaConfigResponseDTO {
        return {
            id: config.id,
            tipus: config.tipus,
            nom: config.nom,
            preuBase: config.preuBase,
            temporadesAplicada: config.temporadesAplicada,
            activa: config.activa,
            categoriaId: config.categoriaId,
            createdAt: config.createdAt.toISOString(),
            updatedAt: config.updatedAt.toISOString(),
        };
    }

    private validateSeasons(seasons: string[]): void {
        const currentYear = new Date().getFullYear();
        const unique = new Set(seasons);

        if (unique.size !== seasons.length) {
            throw new Error('No es poden repetir temporades.');
        }

        for (const season of seasons) {
            const match = /^(\d{4})-(\d{4})$/.exec(season);
            if (!match) {
                throw new Error(`Temporada invàlida: ${season}. Format esperat: YYYY-YYYY.`);
            }

            const start = Number(match[1]);
            const end = Number(match[2]);
            if (end !== start + 1) {
                throw new Error(`La temporada ${season} ha de tenir exactament un any de diferència.`);
            }

            if (end <= currentYear) {
                throw new Error(`El final de la temporada ${season} ha de ser posterior a l'any actual.`);
            }
        }
    }

    private parseType(value: string): TQuota {
        if (!Object.values(TQuota).includes(value as TQuota)) {
            throw new Error(`Tipus de quota invàlid: ${value}.`);
        }
        return value as TQuota;
    }

    async create(dto: CreateQuotaConfigDTO): Promise<QuotaConfigResponseDTO> {
        if (!dto.nom || !dto.tipus || dto.preuBase === undefined || !dto.categoriaId) {
            throw new Error('nom, tipus, preuBase i categoriaId són obligatoris.');
        }
        if (!Number.isFinite(dto.preuBase) || dto.preuBase < 0) {
            throw new Error('preuBase ha de ser un número positiu o zero.');
        }
        if (!await this.repository.categoryExists(dto.categoriaId)) {
            throw new Error('La categoria no existeix.');
        }

        const config = await this.repository.create({
            nom: dto.nom,
            tipus: this.parseType(dto.tipus),
            preuBase: dto.preuBase,
            temporadesAplicada: [],
            categoria: { connect: { id: dto.categoriaId } },
        });

        return this.mapToDTO(config);
    }

    async deleteMany(dto: DeleteQuotaConfigsDTO): Promise<void> {
        const ids = [...new Set(dto.ids ?? [])];
        if (ids.length === 0) throw new Error('Cal indicar almenys un id.');
        await this.repository.deleteMany(ids);
    }

    async update(id: string, dto: UpdateQuotaConfigDTO): Promise<QuotaConfigResponseDTO> {
        if (dto.nom === undefined && dto.temporadesAplicada === undefined) {
            throw new Error('Només es poden editar nom o temporadesAplicada.');
        }
        if (dto.nom !== undefined && !dto.nom.trim()) {
            throw new Error('El nom no pot estar buit.');
        }
        if (dto.temporadesAplicada !== undefined) {
            this.validateSeasons(dto.temporadesAplicada);
        }

        const config = await this.repository.update(id, {
            ...(dto.nom === undefined ? {} : { nom: dto.nom }),
            ...(dto.temporadesAplicada === undefined ? {} : { temporadesAplicada: dto.temporadesAplicada }),
        });
        return this.mapToDTO(config);
    }

    async activate(id: string): Promise<QuotaConfigResponseDTO> {
        return this.mapToDTO(await this.repository.activate(id));
    }

    async getById(id: string): Promise<QuotaConfigResponseDTO> {
        const config = await this.repository.findById(id);
        if (!config) throw new Error('QuotaConfig no trobada.');
        return this.mapToDTO(config);
    }

    async getByName(nom: string): Promise<QuotaConfigResponseDTO> {
        const config = await this.repository.findByName(nom);
        if (!config) throw new Error('QuotaConfig no trobada.');
        return this.mapToDTO(config);
    }

    async getByType(tipus: string): Promise<QuotaConfigResponseDTO[]> {
        const parsedType = this.parseType(tipus);
        const configs = await this.repository.findByType(parsedType);
        return configs.map((config) => this.mapToDTO(config));
    }

    async getByCategory(categoriaId: string): Promise<QuotaConfigResponseDTO[]> {
        if (!await this.repository.categoryExists(categoriaId)) {
            throw new Error('La categoria no existeix.');
        }
        const configs = await this.repository.findByCategory(categoriaId);
        return configs.map((config) => this.mapToDTO(config));
    }
}
