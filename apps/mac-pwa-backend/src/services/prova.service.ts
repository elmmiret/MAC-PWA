import { Prisma } from '@prisma/client';
import type {
    CreateProvaDTO,
    DeleteProvasDTO,
    ProvaResponseDTO,
} from 'shared';
import type { IProvaService } from '../interfaces/prova.interface.js';
import { ProvaRepository, type ProvaWithRankings } from '../repositories/prova.repository.js';

export class ProvaService implements IProvaService {
    private repository: ProvaRepository;

    constructor() {
        this.repository = new ProvaRepository();
    }

    private mapToDTO(prova: ProvaWithRankings): ProvaResponseDTO {
        return {
            id: prova.id,
            nom: prova.nom,
            createdAt: prova.createdAt.toISOString(),
            updatedAt: prova.updatedAt.toISOString(),
        };
    }

    async create(dto: CreateProvaDTO): Promise<ProvaResponseDTO> {
        if (!dto.nom?.trim()) {
            throw new Error('El nom de la prova és obligatori.');
        }

        const input: Prisma.ProvaCreateInput = { nom: dto.nom.trim() };
        return this.mapToDTO(await this.repository.create(input));
    }

    async getAll(): Promise<ProvaResponseDTO[]> {
        const provas = await this.repository.findAll();
        return provas.map((prova) => this.mapToDTO(prova));
    }

    async deleteMany(dto: DeleteProvasDTO): Promise<void> {
        const ids = [...new Set(dto.ids ?? [])];
        if (ids.length === 0) {
            throw new Error('Cal indicar almenys un id.');
        }

        await this.repository.deleteMany(ids);
    }
}
