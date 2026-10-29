import {
    GoogleLoginDTO,
    OperacioUsuariResponseDTO,
    RegisterUsuariDTO,
    UpdatePerfilDTO,
    UsuariResponseDTO,
} from 'shared';

export interface IUsuariService {
    registrarUsuari(dto: RegisterUsuariDTO): Promise<UsuariResponseDTO>;
    iniciarSessioGoogle(dto: GoogleLoginDTO): Promise<UsuariResponseDTO>;
    actualitzarUsuari(id: string, dto: UpdatePerfilDTO): Promise<UsuariResponseDTO>;
    obtenirUsuariPerId(id: string): Promise<UsuariResponseDTO>;
    obtenirUsuariPerFirebaseId(firebaseUid: string): Promise<UsuariResponseDTO>;
    obtenirTotsElsUsuaris(): Promise<UsuariResponseDTO[]>;
    tancarSessio(firebaseUid: string): Promise<OperacioUsuariResponseDTO>;
    eliminarUsuari(targetId: string, actorIsAdmin: boolean): Promise<OperacioUsuariResponseDTO>;
}
