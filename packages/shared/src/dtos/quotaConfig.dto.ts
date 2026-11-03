import type { CategoriaResponseDTO } from './categoria.dto';

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
}

export interface AddTemporadesQuotaConfigDTO {
    temporadesAplicada: string[];
}

export interface QuotaConfigResponseDTO {
    id: string;
    tipus: string;
    nom: string;
    preuBase: number;
    temporadesAplicada: string[];
    activa: boolean;
    categoria: CategoriaResponseDTO;
    createdAt: string;
    updatedAt: string;
}