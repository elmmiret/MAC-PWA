import { UsuariResponseDTO } from './usuari.dto';

export interface CreateCategoriaDTO {
    tipus: string;
    anyNaixement: number[];
    diesActivitat: string[];
    horaEntrada?: string | null;
    horaSortida?: string | null;
    detalls?: string | null;
}

export type UpdateCategoriaDTO = Partial<CreateCategoriaDTO>;

export interface SetCategoriaDTO {
    usuariIds: string[];
}

export interface CategoriaRankingDTO {
    id: string;
    nom: string;
    sexe: string;
    provaId: string;
    createdAt: string;
    updatedAt: string;
}

// Informació de la configuració 
export interface CategoriaQuotaConfigDTO {
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

export interface CategoriaResponseDTO {
    id: string;
    tipus: string;
    anyNaixement: number[];
    diesActivitat: string[];
    horaEntrada: string | null;
    horaSortida: string | null;
    detalls: string | null;
    usuaris: UsuariResponseDTO[];
    rankings: CategoriaRankingDTO[];
    quotaConfigs: CategoriaQuotaConfigDTO[];
    createdAt: string;
    updatedAt: string;
}
