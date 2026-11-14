import type {
    AtletaRankingResponseDTO,
    CreateAtletaRankingDTO,
    UpdateAtletaRankingDTO,
} from 'shared';

export interface IAtletaRankingService {
    create(dto: CreateAtletaRankingDTO): Promise<AtletaRankingResponseDTO>;
    getByRankingId(rankingId: string): Promise<AtletaRankingResponseDTO[]>;
    update(id: string, dto: UpdateAtletaRankingDTO): Promise<AtletaRankingResponseDTO>;
    delete(id: string): Promise<void>;
}
