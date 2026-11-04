import { DiesSetmana, Prisma, TCategoria } from '@prisma/client';
import type {
    CategoriaResponseDTO,
    CreateCategoriaDTO,
    SetCategoriaDTO,
    UpdateCategoriaDTO,
} from 'shared';
import type { ICategoriaService } from '../interfaces/categoria.interface.js';
import { CategoriaRepository, type CategoriaWithRelations } from '../repositories/categoria.repository.js';

export class CategoriaService implements ICategoriaService {
    private repository: CategoriaRepository;

    constructor() {
        this.repository = new CategoriaRepository();
    }

    // Converteix un valor Date a una cadena de temps en format HH:mm:ss,
    // o retorna null si el valor és null.
    private toTime(value: Date | null): string | null {
        return value?.toISOString().slice(11, 19) ?? null;
    }

    private parseTime(value: string | null | undefined): Date | null {
        if (value === null || value === undefined) return null;
        // Valida el format de temps abans de convertir-lo a Date. El format esperat és HH:mm:ss.
        if (!/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(value)) {
            throw new Error(`Hora invàlida: ${value}. Format esperat: HH:mm:ss.`);
        }

        const [hours, minutes, rawSeconds] = value.split(':');
        const seconds = rawSeconds === undefined ? 0 : Number(rawSeconds);
        // Converteix la cadena de temps a un objecte Date amb hora UTC, evitant problemes de zona horària.
        return new Date(Date.UTC(1970, 0, 1, Number(hours), Number(minutes), seconds));
    }

    // Converteix el model Prisma amb relacions en un DTO HTTP, serialitzant dates i
    // adaptant enums i relacions a identificadors.
    private mapToDTO(category: CategoriaWithRelations): CategoriaResponseDTO {
        return {
            id: category.id,
            tipus: category.tipus,
            anyNaixement: category.anyNaixement,
            diesActivitat: category.diesActivitat,
            horaEntrada: this.toTime(category.horaEntrada),
            horaSortida: this.toTime(category.horaSortida),
            detalls: category.detalls,
            usuaris: category.usuaris.map((user) => user.id),
            rankings: category.rankings.map((ranking) => ranking.id),
            quotaConfigs: category.quotaConfigs.map((quota) => quota.id),
            createdAt: category.createdAt.toISOString(),
            updatedAt: category.updatedAt.toISOString(),
        };
    }

    // Converteix el DTO rebut per HTTP en l'input Prisma de creació. 
    // Aquí s'adapten especialment enums, dates i valors nuls.
    private mapCreateDTOToPrisma(dto: CreateCategoriaDTO): Prisma.CategoriaCreateInput {
        return {
            tipus: dto.tipus as TCategoria,
            anyNaixement: dto.anyNaixement,
            diesActivitat: dto.diesActivitat as DiesSetmana[],
            horaEntrada: this.parseTime(dto.horaEntrada),
            horaSortida: this.parseTime(dto.horaSortida),
            detalls: dto.detalls ?? null,
        };
    }

    // Construeix un input Prisma parcial per a que el PATCH només modifiqui els camps
    // enviats i no sobreescrigui accidentalment la resta de la categoria.
    private mapUpdateDTOToPrisma(dto: UpdateCategoriaDTO): Prisma.CategoriaUpdateInput {
        const data: Prisma.CategoriaUpdateInput = {};

        if (dto.tipus !== undefined) data.tipus = dto.tipus as TCategoria;
        if (dto.anyNaixement !== undefined) data.anyNaixement = dto.anyNaixement;
        if (dto.diesActivitat !== undefined) data.diesActivitat = dto.diesActivitat as DiesSetmana[];
        if (dto.horaEntrada !== undefined) data.horaEntrada = this.parseTime(dto.horaEntrada);
        if (dto.horaSortida !== undefined) data.horaSortida = this.parseTime(dto.horaSortida);
        if (dto.detalls !== undefined) data.detalls = dto.detalls;

        return data;
    }

    async create(dto: CreateCategoriaDTO): Promise<CategoriaResponseDTO> {
        return this.mapToDTO(await this.repository.create(this.mapCreateDTOToPrisma(dto)));
    }

    async getById(id: string): Promise<CategoriaResponseDTO> {
        const category = await this.repository.findById(id);
        if (!category) throw new Error('Categoria no trobada.');
        return this.mapToDTO(category);
    }

    async getByType(type: string): Promise<CategoriaResponseDTO> {
        const category = await this.repository.findByType(type as TCategoria);
        if (!category) throw new Error('Categoria no trobada.');
        return this.mapToDTO(category);
    }

    async update(id: string, dto: UpdateCategoriaDTO): Promise<CategoriaResponseDTO> {
        await this.getById(id);
        return this.mapToDTO(await this.repository.update(id, this.mapUpdateDTOToPrisma(dto)));
    }

    private async updateUsers(id: string, userIds: string[], set: boolean): Promise<CategoriaResponseDTO> {
        await this.getById(id);

        if (!Array.isArray(userIds) || userIds.length === 0) {
            throw new Error('Cal indicar almenys un usuari.');
        }

        const uniqueIds = [...new Set(userIds)];
        const existingIds = await this.repository.findUsersByIds(uniqueIds);
        if (existingIds.length !== uniqueIds.length) {
            throw new Error('Un o més usuaris no existeixen.');
        }

        if (set) {
            await this.repository.setUsers(id, uniqueIds);
        } else {
            await this.repository.unsetUsers(id, uniqueIds);
        }

        return this.getById(id);
    }

    async setUsers(id: string, dto: SetCategoriaDTO): Promise<CategoriaResponseDTO> {
        return this.updateUsers(id, dto.usuariIds, true);
    }

    async unsetUsers(id: string, dto: SetCategoriaDTO): Promise<CategoriaResponseDTO> {
        return this.updateUsers(id, dto.usuariIds, false);
    }

    async delete(id: string): Promise<void> {
        await this.getById(id);
        await this.repository.delete(id);
    }
}
