export enum Tusuari {
    ADMIN = 'ADMIN',
    SOCI = 'SOCI',
    NO_SOCI = 'NO_SOCI'
}

export interface SyncUsuariDTO {
    firebaseToken: string;
}

// arreglar
// Atributs primordials per a crear un nou Usuari (després ja podrà afegir els demés)
export interface CreateUsuariDTO {
    firebaseToken: string;
    nom?: string;
    tipus?: Tusuari; // Per defecte serà NO_SOCI
}

// arreglar
// Torna tots els atributs d'un Usuari
export interface UsuariResponseDTO {
    id: string;
    firebaseUid: string;
    tipus: string;
    nom: string;
    congnom1: string;
    congnom2: string;
    emailsContacte: string[];
    telefonsContacte: string[];
    dataNaixement: Date;
    sexe: string;
    adreca: string;
    codiPostal: string;
    poblacio: string;

    dataAlta?: Date;
    dataBaixa?: Date;
    dataUltimaModificacio?: Date;
}