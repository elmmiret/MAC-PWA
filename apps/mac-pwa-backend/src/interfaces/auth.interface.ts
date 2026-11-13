import type {
    GoogleLoginDTO,
    OperacioUsuariResponseDTO,
    RegisterUsuariDTO,
    SetAdminDTO,
    UsuariResponseDTO,
} from 'shared';

export interface IAuthService {
    registrarUsuari(dto: RegisterUsuariDTO): Promise<UsuariResponseDTO>;
    iniciarSessioGoogle(dto: GoogleLoginDTO): Promise<UsuariResponseDTO>;
    tancarSessio(firebaseUid: string): Promise<OperacioUsuariResponseDTO>;
    setAdmin(dto: SetAdminDTO): Promise<void>;
}
