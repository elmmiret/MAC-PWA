import { Categoria, TCategoria, DiesSetmana } from '@prisma/client';

export interface ICategoriaService {
    getAll(): Promise<Categoria[]>;
    getById(id: string): Promise<Categoria | null>;
    //createCategoria(data: CreateCategoriaDTO): Promise<Categoria>;
    //updateCategoria(data: UpdateCategoriaDTO): Promise<Categoria>;
    deleteCategories(id: string[]): Promise<void>;
}