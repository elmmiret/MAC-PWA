export interface CreatePagamentsByCategoriesDTO {
    categoriaIds: string[];
}

export interface UpdatePagamentsEstatDTO {
    ids: string[];
}

export interface DeletePagamentsDTO {
    ids: string[];
}

export interface PagamentResponseDTO {
    id: string;
    preu: number;
    estat: string;
    dataPagament: string | null;
    dataLimit: string;
    motiu: string;
    usuariId: string;
    quotaConfigId: string;
    createdAt: string;
    updatedAt: string;
}
