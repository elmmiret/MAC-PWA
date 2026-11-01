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

    // Converteix el model Prisma en un DTO HTTP i serialitza les dates com ISO.
    // El DTO evita exposar directament l'estructura interna de Prisma.
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

    // Valida el format de les temporades abans de persistir-les. Aquesta regla
    // pertany al domini i no a Prisma, per això es manté al servei.
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

    // Converteix l'string rebut per l'API en l'enum generat per Prisma i 
    // centralitza la validació dels quatre tipus permesos.
    private parseType(value: string): TQuota {
        if (!Object.values(TQuota).includes(value as TQuota)) {
            throw new Error(`Tipus de quota invàlid: ${value}.`);
        }
        return value as TQuota;
    }

    // Converteix el DTO de creació en l'input Prisma, incloent la relació
    // amb la categoria seleccionada.
    private mapCreateDTOToPrisma(dto: CreateQuotaConfigDTO): Prisma.QuotaConfigCreateInput {
        return {
            nom: dto.nom,
            tipus: this.parseType(dto.tipus),
            preuBase: dto.preuBase,
            temporadesAplicada: [],
            categoria: { connect: { id: dto.categoriaId } },
        };
    }

    // Converteix només els camps permesos per l'endpoint PATCH en un input Prisma parcial,
    // evitant actualitzar relacions o camps protegits.
    private mapUpdateDTOToPrisma(dto: UpdateQuotaConfigDTO): Prisma.QuotaConfigUpdateInput {
        return {
            ...(dto.nom === undefined ? {} : { nom: dto.nom }),
            ...(dto.temporadesAplicada === undefined
                ? {}
                : { temporadesAplicada: dto.temporadesAplicada }),
        };
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

        const config = await this.repository.create(this.mapCreateDTOToPrisma(dto));

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

        const config = await this.repository.update(id, this.mapUpdateDTOToPrisma(dto));
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
