import { Prisma, TCategoria, TSexe } from '@prisma/client';
import type {
    CreateRankingDTO,
    RankingResponseDTO,
    UpdateRankingDTO,
} from 'shared';
import type { IRankingService } from '../interfaces/ranking.interface.js';
import {
    CategoriaRepository,
    COMPETITIVE_CATEGORIES_ORDER,
} from '../repositories/categoria.repository.js';
import { ProvaRepository } from '../repositories/prova.repository.js';
import { RankingRepository, type RankingWithRelations } from '../repositories/ranking.repository.js';

export class RankingService implements IRankingService {
    private repository: RankingRepository;
    private categoriaRepository: CategoriaRepository;
    private provaRepository: ProvaRepository;

    constructor() {
        this.repository = new RankingRepository();
        this.categoriaRepository = new CategoriaRepository();
        this.provaRepository = new ProvaRepository();
    }

    private mapToDTO(ranking: RankingWithRelations): RankingResponseDTO {
        return {
            id: ranking.id,
            nom: ranking.nom,
            sexe: ranking.sexe,
            categoriaId: ranking.categoria.id,
            provaId: ranking.prova.id,
            atletaRankingIds: ranking.atletaRankings.map((ar) => ar.id),
            createdAt: ranking.createdAt.toISOString(),
            updatedAt: ranking.updatedAt.toISOString(),
        };
    }

    private parseSexe(value: string): TSexe {
        if (!Object.values(TSexe).includes(value as TSexe)) {
            throw new Error(`Sexe invàlid: ${value}. Valors permesos: M, F.`);
        }
        return value as TSexe;
    }

    private isCompetitiveCategory(tipus: TCategoria): boolean {
        return COMPETITIVE_CATEGORIES_ORDER.includes(tipus);
    }

    private async validateCreate(dto: CreateRankingDTO): Promise<{ sexe: TSexe; categoriaTipus: TCategoria }> {
        if (!dto.nom?.trim()) {
            throw new Error('El nom del ranking és obligatori.');
        }
        if (!dto.categoriaId?.trim()) {
            throw new Error('La categoria és obligatòria.');
        }
        if (!dto.provaId?.trim()) {
            throw new Error('La prova és obligatòria.');
        }

        const sexe = this.parseSexe(dto.sexe);

        const categoria = await this.categoriaRepository.findById(dto.categoriaId);
        if (!categoria) {
            throw new Error('La categoria no existeix.');
        }
        if (!this.isCompetitiveCategory(categoria.tipus)) {
            throw new Error('Només les categories competitives poden tenir rankings.');
        }

        const prova = await this.provaRepository.findById(dto.provaId);
        if (!prova) {
            throw new Error('La prova no existeix.');
        }

        // RT2: la categoria no pot tenir més rankings que el total de proves.
        const totalProves = await this.provaRepository.count();
        const rankingsCategoria = await this.repository.countByCategoria(dto.categoriaId);
        if (rankingsCategoria >= totalProves) {
            throw new Error('La categoria ja té el màxim de rankings permesos.');
        }

        // RT6: màxim 2 rankings per (categoria, prova, sexe).
        const existing = await this.repository.findByCategoriaProvaSexe(dto.categoriaId, dto.provaId, sexe);
        if (existing.length >= 2) {
            throw new Error('Ja existeixen dos rankings per a aquesta combinació de categoria, prova i sexe.');
        }

        return { sexe, categoriaTipus: categoria.tipus };
    }

    async create(dto: CreateRankingDTO): Promise<RankingResponseDTO> {
        const { sexe } = await this.validateCreate(dto);

        const input: Prisma.RankingCreateInput = {
            nom: dto.nom.trim(),
            sexe,
            categoria: { connect: { id: dto.categoriaId } },
            prova: { connect: { id: dto.provaId } },
        };

        return this.mapToDTO(await this.repository.create(input));
    }

    async getAll(): Promise<RankingResponseDTO[]> {
        const rankings = await this.repository.findAll();
        return rankings.map((r) => this.mapToDTO(r));
    }

    async getById(id: string): Promise<RankingResponseDTO> {
        const ranking = await this.repository.findById(id);
        if (!ranking) {
            throw new Error('Ranking no trobat.');
        }
        return this.mapToDTO(ranking);
    }

    async update(id: string, dto: UpdateRankingDTO): Promise<RankingResponseDTO> {
        if (dto.nom === undefined || !dto.nom.trim()) {
            throw new Error('El nom és obligatori.');
        }

        await this.getById(id);
        return this.mapToDTO(await this.repository.update(id, { nom: dto.nom.trim() }));
    }

    async delete(id: string): Promise<void> {
        await this.getById(id);
        await this.repository.delete(id);
    }
}
