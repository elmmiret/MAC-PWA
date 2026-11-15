import type {
    CreateRankingDTO,
    RankingResponseDTO,
    UpdateRankingDTO,
} from 'shared';

export interface IRankingService {
    create(dto: CreateRankingDTO): Promise<RankingResponseDTO>;
    getAll(): Promise<RankingResponseDTO[]>;
    getById(id: string): Promise<RankingResponseDTO>;
    update(id: string, dto: UpdateRankingDTO): Promise<RankingResponseDTO>;
    delete(id: string): Promise<void>;
}
