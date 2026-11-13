import type {
    GoogleLoginDTO,
    MeUsuariResponseDTO,
    OperacioUsuariResponseDTO,
    RegisterUsuariDTO,
    SetFamiliarDTO,
    UpdatePerfilDTO,
    UsuariResponseDTO,
} from 'shared';

export interface IUsuariService {
    registrarUsuari(dto: RegisterUsuariDTO): Promise<UsuariResponseDTO>;
    iniciarSessioGoogle(dto: GoogleLoginDTO): Promise<UsuariResponseDTO>;
    actualitzarUsuari(id: string, dto: UpdatePerfilDTO): Promise<UsuariResponseDTO>;
    obtenirUsuariPerId(id: string): Promise<UsuariResponseDTO>;
    obtenirUsuariPerFirebaseId(firebaseUid: string): Promise<UsuariResponseDTO>;
    obtenirUsuariAutenticat(firebaseUid: string): Promise<MeUsuariResponseDTO>;
    obtenirTotsElsUsuaris(): Promise<UsuariResponseDTO[]>;
    tancarSessio(firebaseUid: string): Promise<OperacioUsuariResponseDTO>;
    setEntrenador(id: string, entrenador: boolean): Promise<UsuariResponseDTO>;
    setFamiliar(familiarId: string, dto: SetFamiliarDTO): Promise<OperacioUsuariResponseDTO>;
    eliminarUsuari(targetId: string, actorIsAdmin: boolean): Promise<OperacioUsuariResponseDTO>;
}
