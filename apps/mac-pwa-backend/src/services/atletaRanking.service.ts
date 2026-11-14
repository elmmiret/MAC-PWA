import { Prisma, TCategoria } from '@prisma/client';
import type {
    AtletaRankingResponseDTO,
    CreateAtletaRankingDTO,
    UpdateAtletaRankingDTO,
} from 'shared';
import type { IAtletaRankingService } from '../interfaces/atletaRanking.interface.js';
import {
    CategoriaRepository,
    COMPETITIVE_CATEGORIES_ORDER,
} from '../repositories/categoria.repository.js';
import {
    AtletaRankingRepository,
    type AtletaRankingWithRelations,
} from '../repositories/atletaRanking.repository.js';
import { RankingRepository } from '../repositories/ranking.repository.js';
import { UsuariRepository } from '../repositories/usuari.repository.js';

export class AtletaRankingService implements IAtletaRankingService {
    private repository: AtletaRankingRepository;
    private rankingRepository: RankingRepository;
    private usuariRepository: UsuariRepository;
    private categoriaRepository: CategoriaRepository;

    constructor() {
        this.repository = new AtletaRankingRepository();
        this.rankingRepository = new RankingRepository();
        this.usuariRepository = new UsuariRepository();
        this.categoriaRepository = new CategoriaRepository();
    }

    private mapToDTO(atletaRanking: AtletaRankingWithRelations): AtletaRankingResponseDTO {
        return {
            id: atletaRanking.id,
            localitatMarca: atletaRanking.localitatMarca,
            dataMarca: atletaRanking.dataMarca.toISOString(),
            marca: atletaRanking.marca,
            usuariId: atletaRanking.usuari.id,
            rankingId: atletaRanking.ranking.id,
            createdAt: atletaRanking.createdAt.toISOString(),
            updatedAt: atletaRanking.updatedAt.toISOString(),
        };
    }

    private parseDate(value: string): Date {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            throw new Error('La data de la marca no té un format vàlid.');
        }
        return date;
    }

    private isCompetitiveCategory(tipus: TCategoria): boolean {
        return COMPETITIVE_CATEGORIES_ORDER.includes(tipus);
    }

    private getCategoryIndex(tipus: TCategoria): number {
        const index = COMPETITIVE_CATEGORIES_ORDER.indexOf(tipus);
        if (index === -1) {
            throw new Error('La categoria no és competitiva.');
        }
        return index;
    }

    private async validateCreate(dto: CreateAtletaRankingDTO): Promise<void> {
        if (!dto.usuariId?.trim()) {
            throw new Error('L\'usuari és obligatori.');
        }
        if (!dto.rankingId?.trim()) {
            throw new Error('El ranking és obligatori.');
        }
        if (!dto.localitatMarca?.trim()) {
            throw new Error('La localitat de la marca és obligatòria.');
        }
        if (!dto.dataMarca?.trim()) {
            throw new Error('La data de la marca és obligatòria.');
        }
        if (!dto.marca?.trim()) {
            throw new Error('La marca és obligatòria.');
        }

        const ranking = await this.rankingRepository.findById(dto.rankingId);
        if (!ranking) {
            throw new Error('El ranking no existeix.');
        }

        const usuari = await this.usuariRepository.findById(dto.usuariId);
        if (!usuari) {
            throw new Error('L\'usuari no existeix.');
        }

        // RT3: l'usuari ha de pertànyer a una categoria competitiva.
        if (!usuari.categoriaId) {
            throw new Error('L\'usuari no té cap categoria assignada.');
        }
        const categoriaUsuari = await this.categoriaRepository.findById(usuari.categoriaId);
        if (!categoriaUsuari) {
            throw new Error('La categoria de l\'usuari no existeix.');
        }
        if (!this.isCompetitiveCategory(categoriaUsuari.tipus)) {
            throw new Error('L\'usuari pertany a una categoria exclosa dels rankings.');
        }

        // RT4: el sexe de l'usuari ha de coincidir amb el del ranking.
        if (!usuari.sexe) {
            throw new Error('L\'usuari no té sexe assignat.');
        }
        if (usuari.sexe !== ranking.sexe) {
            throw new Error('El sexe de l\'usuari no coincideix amb el del ranking.');
        }

        // RT5: el ranking ha de ser de la mateixa categoria o d'una inferior.
        const usuariIndex = this.getCategoryIndex(categoriaUsuari.tipus);
        const rankingIndex = this.getCategoryIndex(ranking.categoria.tipus);
        if (rankingIndex > usuariIndex) {
            throw new Error('L\'usuari no pot participar en un ranking d\'una categoria superior.');
        }

        const alreadyExists = await this.repository.existsByUsuariAndRanking(dto.usuariId, dto.rankingId);
        if (alreadyExists) {
            throw new Error('L\'usuari ja està inscrit en aquest ranking.');
        }
    }

    async create(dto: CreateAtletaRankingDTO): Promise<AtletaRankingResponseDTO> {
        await this.validateCreate(dto);

        const input: Prisma.AtletaRankingCreateInput = {
            localitatMarca: dto.localitatMarca.trim(),
            dataMarca: this.parseDate(dto.dataMarca),
            marca: dto.marca.trim(),
            usuari: { connect: { id: dto.usuariId } },
            ranking: { connect: { id: dto.rankingId } },
        };

        return this.mapToDTO(await this.repository.create(input));
    }

    async getByRankingId(rankingId: string): Promise<AtletaRankingResponseDTO[]> {
        const atletes = await this.repository.findByRankingId(rankingId);
        return atletes.map((atleta) => this.mapToDTO(atleta));
    }

    async update(id: string, dto: UpdateAtletaRankingDTO): Promise<AtletaRankingResponseDTO> {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new Error('AtletaRanking no trobat.');
        }

        const data: Prisma.AtletaRankingUpdateInput = {};
        if (dto.localitatMarca !== undefined) {
            if (!dto.localitatMarca.trim()) {
                throw new Error('La localitat de la marca no pot estar buida.');
            }
            data.localitatMarca = dto.localitatMarca.trim();
        }
        if (dto.dataMarca !== undefined) {
            data.dataMarca = this.parseDate(dto.dataMarca);
        }
        if (dto.marca !== undefined) {
            if (!dto.marca.trim()) {
                throw new Error('La marca no pot estar buida.');
            }
            data.marca = dto.marca.trim();
        }

        return this.mapToDTO(await this.repository.update(id, data));
    }

    async delete(id: string): Promise<void> {
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new Error('AtletaRanking no trobat.');
        }
        await this.repository.delete(id);
    }
}
