export interface CreateAtletaRankingDTO {
    usuariId: string;
    rankingId: string;
    localitatMarca: string;
    dataMarca: string;
    marca: string;
}

export interface UpdateAtletaRankingDTO {
    localitatMarca?: string;
    dataMarca?: string;
    marca?: string;
}

export interface AtletaRankingResponseDTO {
    id: string;
    localitatMarca: string;
    dataMarca: string;
    marca: string;
    usuariId: string;
    rankingId: string;
    createdAt: string;
    updatedAt: string;
}
