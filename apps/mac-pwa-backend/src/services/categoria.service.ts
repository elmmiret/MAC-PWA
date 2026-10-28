import { Categoria, TCategoria } from '@prisma/client';
import { ICategoriaService } from '../interfaces/categoria.interface';
import { CategoriaRepository } from '../repositories/categoria.repository';

export class CategoriaService implements ICategoriaService {
    private repository: CategoriaRepository;

    constructor() {
        this.repository= new CategoriaRepository();
    }

    async getAll(): Promise<Categoria[]> {
        return await this.repository.findAll();
    }

    async getById(id: string): Promise<Categoria | null> {
        const categoria = await this.repository.findById(id);
        if (!categoria) throw new Error('Categoria not found');
        return categoria;
    }

    async getByTipus(tipus: TCategoria): Promise<Categoria[]> {
        return await this.repository.findByTipus(tipus);
    }

    // async createCategoria(data: CreateCategoriaDTO): Promise<Categoria> {

    // }

    // async updateCategoria(data: UpdateCategoriaDTO): Promise<Categoria> {
    //     const categoria = await this.getById(data.id);

    // }

    async deleteCategories(id: string[]): Promise<void> {
        for (const categoriaId of id) {
            await this.getById(categoriaId); // Check if the category exists
            await this.repository.deleteCategoria(categoriaId);
        }
    }
}
