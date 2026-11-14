import type {
    MeUsuariResponseDTO,
    OperacioUsuariResponseDTO,
    SetFamiliarDTO,
    UpdateUsuariDTO,
    UsuariResponseDTO,
} from 'shared';

export interface IUsuariService {
    actualitzarUsuari(id: string, dto: UpdateUsuariDTO): Promise<UsuariResponseDTO>;
    obtenirUsuariPerId(id: string): Promise<UsuariResponseDTO>;
    obtenirUsuariPerFirebaseId(firebaseUid: string): Promise<UsuariResponseDTO>;
    obtenirUsuariAutenticat(firebaseUid: string): Promise<MeUsuariResponseDTO>;
    obtenirTotsElsUsuaris(): Promise<UsuariResponseDTO[]>;
    setEntrenador(id: string, entrenador: boolean): Promise<UsuariResponseDTO>;
    setFamiliar(familiarId: string, dto: SetFamiliarDTO): Promise<OperacioUsuariResponseDTO>;
    eliminarUsuari(targetId: string, actorIsAdmin: boolean): Promise<OperacioUsuariResponseDTO>;
}
