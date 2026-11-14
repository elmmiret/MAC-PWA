export interface CreateRankingDTO {
    nom: string;
    sexe: string;
    categoriaId: string;
    provaId: string;
}

export interface UpdateRankingDTO {
    nom?: string;
}

export interface RankingResponseDTO {
    id: string;
    nom: string;
    sexe: string;
    categoriaId: string;
    provaId: string;
    atletaRankingIds: string[];
    createdAt: string;
    updatedAt: string;
}
