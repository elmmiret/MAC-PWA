export interface CreateProvaDTO {
    nom: string;
}

export interface DeleteProvasDTO {
    ids: string[];
}

export interface ProvaResponseDTO {
    id: string;
    nom: string;
    createdAt: string;
    updatedAt: string;
}
