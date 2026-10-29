export interface RegisterUsuariDTO {
    emailPrincipal: string;
    nom?: string;
    cognom1?: string;
    cognom2?: string;
}

export interface LoginUsuariDTO {
    emailPrincipal: string;
    password: string;
}

export interface GoogleLoginDTO {
    firebaseToken: string;
}

export interface LoginResponseDTO {
    idToken: string;
    refreshToken?: string;
    expiresIn?: string;
    localId: string;
    usuariId: string;
}

export interface OperacioUsuariResponseDTO {
    message: string;
    usuariId?: string;
}

export interface UpdatePerfilDTO {
    nom: string;
    cognom1: string;
    cognom2: string;
}

// ARREGLAR
// Torna tots els atributs d'un Usuari
export interface UsuariResponseDTO {
    id: string;
    firebaseUid: string | null;
    emailPrincipal: string;
    nom: string | null;
    cognom1: string | null;
    cognom2: string | null;
    perfilCompletat: boolean;
}
