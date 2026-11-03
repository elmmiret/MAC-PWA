import type {
    CategoriaResponseDTO,
    CreateCategoriaDTO,
    SetCategoriaDTO,
    UpdateCategoriaDTO,
    UsuariResponseDTO,
} from 'shared';

export interface ICategoriaService {
    create(dto: CreateCategoriaDTO): Promise<CategoriaResponseDTO>;
    getById(id: string): Promise<CategoriaResponseDTO>;
    getByType(type: string): Promise<CategoriaResponseDTO>;
    getUsersByType(type: string): Promise<UsuariResponseDTO[]>;
    update(id: string, dto: UpdateCategoriaDTO): Promise<CategoriaResponseDTO>;
    setUsers(id: string, dto: SetCategoriaDTO): Promise<CategoriaResponseDTO>;
    unsetUsers(id: string, dto: SetCategoriaDTO): Promise<CategoriaResponseDTO>;
    delete(id: string): Promise<void>;
}
