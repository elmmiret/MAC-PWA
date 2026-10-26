import { Request, Response } from 'express';
import { CategoriaService } from '../services/categoria.service.ts';

export class CategoriaController {
    private service: CategoriaService;

    constructor() {
        this.service = new CategoriaService();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.service.getAll();
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // async getById(req: Request, res: Response): Promise<void> {
    //     try {
    //         const result = await this.service.getById(req.params.id);
    //         res.status(200).json(result);
    //     } catch (error: any) {
    //         res.status(404).json({ message: error.message });
    //     }
    // }

    // async createCategoria(req: Request, res: Response): Promise<void> {
    //     try {
    //         const result = await this.service.createCategoria(req.body);
    //         res.status(200).json(result);
    //     } catch (error: any) {
    //         res.status(400).json({ message: error.message });
    //     }
    // }

    // async updateCategoria(req: Request, res: Response): Promise<void> {
    //     try {
    //         const result = await this.service.updateCategoria(req.body);
    //         res.status(200).json(result);
    //     } catch (error: any) {
    //         res.status(400).json({ message: error.message });
    //     }
    // }

    async deleteCategories(req: Request, res: Response): Promise<void> {
        try {
            await this.service.deleteCategories(req.body.ids);
            res.status(200).send();
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}