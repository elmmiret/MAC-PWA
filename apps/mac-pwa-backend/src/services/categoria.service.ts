import { DiesSetmana, Prisma, TCategoria } from '@prisma/client';
import {
    CategoriaResponseDTO,
    CreateCategoriaDTO,
    SetCategoriaDTO,
    UpdateCategoriaDTO,
    UsuariResponseDTO,
} from 'shared';
import { ICategoriaService } from '../interfaces/categoria.interface';
import { CategoriaRepository, CategoriaWithRelations } from '../repositories/categoria.repository';

export class CategoriaService implements ICategoriaService {
    private repository: CategoriaRepository;

    constructor() {
        this.repository = new CategoriaRepository();
    }

    private toIso(value: Date | null): string | null {
        return value?.toISOString() ?? null;
    }

    private mapUserToDTO(user: CategoriaWithRelations['usuaris'][number]): UsuariResponseDTO {
        return {
            id: user.id,
            firebaseUid: user.firebaseUid,
            emailPrincipal: user.emailPrincipal,
            nom: user.nom,
            cognom1: user.cognom1,
            cognom2: user.cognom2,
        };
    }

    private mapToDTO(category: CategoriaWithRelations): CategoriaResponseDTO {
        return {
            id: category.id,
            tipus: category.tipus,
            anyNaixement: category.anyNaixement,
            diesActivitat: category.diesActivitat,
            horaEntrada: this.toIso(category.horaEntrada),
            horaSortida: this.toIso(category.horaSortida),
            detalls: category.detalls,
            usuaris: category.usuaris.map((user) => this.mapUserToDTO(user)),
            rankings: category.rankings.map((ranking) => ({
                id: ranking.id,
                nom: ranking.nom,
                sexe: ranking.sexe,
                provaId: ranking.provaId,
                createdAt: ranking.createdAt.toISOString(),
                updatedAt: ranking.updatedAt.toISOString(),
            })),
            quotaConfigs: category.quotaConfigs.map((quota) => ({
                id: quota.id,
                tipus: quota.tipus,
                nom: quota.nom,
                preuBase: quota.preuBase,
                temporadesAplicada: quota.temporadesAplicada,
                activa: quota.activa,
                categoriaId: quota.categoriaId,
                createdAt: quota.createdAt.toISOString(),
                updatedAt: quota.updatedAt.toISOString(),
            })),
            createdAt: category.createdAt.toISOString(),
            updatedAt: category.updatedAt.toISOString(),
        };
    }

    private mapCreateData(dto: CreateCategoriaDTO): Prisma.CategoriaCreateInput {
        return {
            tipus: dto.tipus as TCategoria,
            anyNaixement: dto.anyNaixement,
            diesActivitat: dto.diesActivitat as DiesSetmana[],
            horaEntrada: dto.horaEntrada ? new Date(dto.horaEntrada) : null,
            horaSortida: dto.horaSortida ? new Date(dto.horaSortida) : null,
            detalls: dto.detalls ?? null,
        };
    }

    private mapUpdateData(dto: UpdateCategoriaDTO): Prisma.CategoriaUpdateInput {
        const data: Prisma.CategoriaUpdateInput = {};

        if (dto.tipus !== undefined) data.tipus = dto.tipus as TCategoria;
        if (dto.anyNaixement !== undefined) data.anyNaixement = dto.anyNaixement;
        if (dto.diesActivitat !== undefined) data.diesActivitat = dto.diesActivitat as DiesSetmana[];
        if (dto.horaEntrada !== undefined) data.horaEntrada = dto.horaEntrada ? new Date(dto.horaEntrada) : null;
        if (dto.horaSortida !== undefined) data.horaSortida = dto.horaSortida ? new Date(dto.horaSortida) : null;
        if (dto.detalls !== undefined) data.detalls = dto.detalls;

        return data;
    }

    async create(dto: CreateCategoriaDTO): Promise<CategoriaResponseDTO> {
        return this.mapToDTO(await this.repository.create(this.mapCreateData(dto)));
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
        return this.mapToDTO(await this.repository.update(id, this.mapUpdateData(dto)));
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
