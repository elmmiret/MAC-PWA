import {
    CategoriaResponseDTO,
    CreateCategoriaDTO,
    SetCategoriaDTO,
    UpdateCategoriaDTO,
} from 'shared';

export interface ICategoriaService {
    create(dto: CreateCategoriaDTO): Promise<CategoriaResponseDTO>;
    getById(id: string): Promise<CategoriaResponseDTO>;
    getByType(type: string): Promise<CategoriaResponseDTO>;
    update(id: string, dto: UpdateCategoriaDTO): Promise<CategoriaResponseDTO>;
    setUsers(id: string, dto: SetCategoriaDTO): Promise<CategoriaResponseDTO>;
    unsetUsers(id: string, dto: SetCategoriaDTO): Promise<CategoriaResponseDTO>;
    delete(id: string): Promise<void>;
}
