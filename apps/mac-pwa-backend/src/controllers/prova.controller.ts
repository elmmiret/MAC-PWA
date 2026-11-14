import type { Request, Response } from 'express';
import type {
    CreateProvaDTO,
    DeleteProvasDTO,
} from 'shared';
import { ProvaService } from '../services/prova.service.js';

export class ProvaController {
    private service: ProvaService;

    constructor() {
        this.service = new ProvaService();
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            res.status(201).json(await this.service.create(req.body as CreateProvaDTO));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json(await this.service.getAll());
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteMany(req: Request, res: Response): Promise<void> {
        try {
            await this.service.deleteMany(req.body as DeleteProvasDTO);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
