export interface CreateQuotaConfigDTO {
    nom: string;
    tipus: string;
    preuBase: number;
    categoriaId: string;
}

export interface DeleteQuotaConfigsDTO {
    ids: string[];
}

export interface UpdateQuotaConfigDTO {
    nom?: string;
    temporadesAplicada?: string[];
}

export interface QuotaConfigResponseDTO {
    id: string;
    tipus: string;
    nom: string;
    preuBase: number;
    temporadesAplicada: string[];
    activa: boolean;
    categoriaId: string;
    createdAt: string;
    updatedAt: string;
}
