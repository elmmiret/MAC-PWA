export interface RegisterUsuariDTO {
    emailPrincipal: string;
    nom?: string;
    cognom1?: string;
    cognom2?: string;
}

export interface GoogleLoginDTO {
    firebaseToken: string;
}

export interface OperacioUsuariResponseDTO {
    message: string;
    usuariId?: string;
}

export interface SetFamiliarDTO {
    usuariIds: string[];
}

export interface UpdatePerfilDTO {
    emailPrincipal?: string;
    emailSecundari?: string | null;
    telefonPrincipal?: string | null;
    telefonSecundari?: string | null;
    nom?: string | null;
    cognom1?: string | null;
    cognom2?: string | null;
    sexe?: 'M' | 'F' | null;
    dataNaixement?: string | null;
    LocalitatNaixement?: string | null;
    numeroLlicencia?: string | null;
    adreca?: string | null;
    codiPostal?: string | null;
    poblacio?: string | null;
    tipusDocument?: 'DNI' | 'NIF' | null;
    numeroDocument?: string | null;
    nomTutor?: string | null;
    tipusDocumentTutor?: 'DNI' | 'NIF' | null;
    numeroDocumentTutor?: string | null;
    numAbPatronat?: number | null;
    dataInscripcio?: string | null;
    dataBaixa?: string | null;
    dataAltaProva?: string | null;
    iban?: string | null;
}

// Retorna les dades bàsiques d'un Usuari
// AFEGIR ATRIBUTS QUE FALTEN (id Categoria, ids Pagaments, ids AtletaRanking)
export interface UsuariResponseDTO {
    id: string;
    firebaseUid: string | null;
    entrenador: boolean;
    usuariFamiliarId: string | null;
    emailPrincipal: string;
    imatgePerfil: string | null;
    emailSecundari: string | null;
    telefonPrincipal: string | null;
    telefonSecundari: string | null;
    nom: string | null;
    cognom1: string | null;
    cognom2: string | null;
    sexe: string | null;
    dataNaixement: string | null;
    LocalitatNaixement: string | null;
    numeroLlicencia: string | null;
    adreca: string | null;
    codiPostal: string | null;
    poblacio: string | null;
    tipusDocument: string | null;
    numeroDocument: string | null;
    nomTutor: string | null;
    tipusDocumentTutor: string | null;
    numeroDocumentTutor: string | null;
    numAbPatronat: number | null;
    dataInscripcio: string | null;
    dataBaixa: string | null;
    dataAltaProva: string | null;
    iban: string | null;
    categoriaId: string | null;
    pagamentIds: string[];
    createdAt: string;
    updatedAt: string;
}
