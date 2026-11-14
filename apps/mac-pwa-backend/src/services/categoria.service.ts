import { DiesSetmana, Prisma, TCategoria } from '@prisma/client';
import type {
    CategoriaResponseDTO,
    CreateCategoriaDTO,
    MeCategoriaResponseDTO,
    SetCategoriaDTO,
    UpdateCategoriaDTO,
} from 'shared';
import type { ICategoriaService } from '../interfaces/categoria.interface.js';
import {
    CategoriaRepository,
    CATEGORIES_OFICIALS,
    type CategoriaWithRelations,
} from '../repositories/categoria.repository.js';
import { UsuariRepository } from '../repositories/usuari.repository.js';

export class CategoriaService implements ICategoriaService {
    private repository: CategoriaRepository;
    private usuariRepository: UsuariRepository;

    constructor() {
        this.repository = new CategoriaRepository();
        this.usuariRepository = new UsuariRepository();
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

    private mapToMeDTO(category: CategoriaWithRelations): MeCategoriaResponseDTO {
        return {
            tipus: category.tipus,
            anyNaixement: category.anyNaixement,
            diesActivitat: category.diesActivitat,
            horaEntrada: this.toTime(category.horaEntrada),
            horaSortida: this.toTime(category.horaSortida),
            detalls: category.detalls,
        };
    }

    // Calcula els anys de naixement que corresponen a una categoria oficial
    // segons l'any en curs. Retorna array buit per a categories no oficials.
    private computeAnyNaixement(tipus: TCategoria): number[] {
        const currentYear = new Date().getFullYear();

        switch (tipus) {
            case TCategoria.SUB_8:
                return [currentYear - 7, currentYear - 6];
            case TCategoria.SUB_10:
                return [currentYear - 9, currentYear - 8];
            case TCategoria.SUB_12:
                return [currentYear - 11, currentYear - 10];
            case TCategoria.SUB_14:
                return [currentYear - 13, currentYear - 12];
            case TCategoria.SUB_16:
                return [currentYear - 15, currentYear - 14];
            case TCategoria.SUB_18:
                return [currentYear - 17, currentYear - 16];
            case TCategoria.SUB_20:
                return [currentYear - 19, currentYear - 18];
            case TCategoria.SUB_23:
                return [currentYear - 22, currentYear - 21, currentYear - 20];
            case TCategoria.SENIOR:
                return Array.from({ length: 12 }, (_, i) => currentYear - 34 + i);
            case TCategoria.MASTER:
                return Array.from({ length: 66 }, (_, i) => currentYear - 100 + i);
            default:
                return [];
        }
    }

    private arraysEqual(a: number[], b: number[]): boolean {
        return a.length === b.length && a.every((value, index) => value === b[index]);
    }

    // Converteix el DTO rebut per HTTP en l'input Prisma de creació. 
    // Aquí s'adapten especialment enums, dates i valors nuls.
    private mapCreateDTOToPrisma(dto: CreateCategoriaDTO): Prisma.CategoriaCreateInput {
        return {
            tipus: dto.tipus as TCategoria,
            anyNaixement: [],
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
        if (dto.diesActivitat !== undefined) data.diesActivitat = dto.diesActivitat as DiesSetmana[];
        if (dto.horaEntrada !== undefined) data.horaEntrada = this.parseTime(dto.horaEntrada);
        if (dto.horaSortida !== undefined) data.horaSortida = this.parseTime(dto.horaSortida);
        if (dto.detalls !== undefined) data.detalls = dto.detalls;

        return data;
    }

    async create(dto: CreateCategoriaDTO): Promise<CategoriaResponseDTO> {
        const input = this.mapCreateDTOToPrisma(dto);
        const tipus = dto.tipus as TCategoria;

        if (CATEGORIES_OFICIALS.includes(tipus)) {
            input.anyNaixement = this.computeAnyNaixement(tipus);
        }

        return this.mapToDTO(await this.repository.create(input));
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

    async getCurrentCategoria(firebaseUid: string): Promise<MeCategoriaResponseDTO> {
        const category = await this.repository.findByFirebaseUid(firebaseUid);
        if (!category) throw new Error('Categoria no trobada.');
        return this.mapToMeDTO(category);
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

    async updateAnyNaixementOficials(): Promise<{ updated: boolean; message: string; categories: CategoriaResponseDTO[] }> {
        const categories = await this.repository.findOficials();
        if (categories.length === 0) {
            return { updated: false, message: 'No hi ha categories oficials.', categories: [] };
        }

        const firstCategory = categories[0]!;
        const firstComputed = this.computeAnyNaixement(firstCategory.tipus);
        if (this.arraysEqual(firstCategory.anyNaixement, firstComputed)) {
            return {
                updated: false,
                message: 'Les categories ja tenen els anys de naixement correctes.',
                categories: [],
            };
        }

        const updates = categories.map((category) => ({
            id: category.id,
            anyNaixement: this.computeAnyNaixement(category.tipus),
        }));

        const updated = await this.repository.updateManyAnyNaixement(updates);
        return {
            updated: true,
            message: 'Categories oficials actualitzades correctament.',
            categories: updated.map((category) => this.mapToDTO(category)),
        };
    }

    async assignCategoriesToUsers(): Promise<{ updated: number }> {
        const categories = await this.repository.findOficials();
        const users = await this.usuariRepository.findUsersForCategoriaAssignment();

        const updates: { id: string; categoriaId: string | null }[] = [];
        for (const user of users) {
            const birthYear = user.dataNaixement.getFullYear();
            const category = categories.find((c) => c.anyNaixement.includes(birthYear));
            updates.push({ id: user.id, categoriaId: category?.id ?? null });
        }

        await this.usuariRepository.updateCategoriaIds(updates);
        return { updated: updates.length };
    }
}
