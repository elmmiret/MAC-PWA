import {
    GoogleLoginDTO,
    LoginResponseDTO,
    LoginUsuariDTO,
    OperacioUsuariResponseDTO,
    RegisterUsuariDTO,
    UpdatePerfilDTO,
    UsuariResponseDTO,
} from 'shared';

export interface IUsuariService {
    registrarUsuari(dto: RegisterUsuariDTO): Promise<UsuariResponseDTO>;
    iniciarSessio(dto: LoginUsuariDTO): Promise<LoginResponseDTO>;
    iniciarSessioGoogle(dto: GoogleLoginDTO): Promise<UsuariResponseDTO>;
    completarPerfil(firebaseUid: string, dto: UpdatePerfilDTO): Promise<UsuariResponseDTO>;
    obtenirUsuariPerId(id: string): Promise<UsuariResponseDTO>;
    obtenirUsuariPerFirebaseId(firebaseUid: string): Promise<UsuariResponseDTO>;
    tancarSessio(firebaseUid: string): Promise<OperacioUsuariResponseDTO>;
    eliminarUsuari(targetId: string, actorFirebaseUid: string, actorIsAdmin: boolean): Promise<OperacioUsuariResponseDTO>;
}
