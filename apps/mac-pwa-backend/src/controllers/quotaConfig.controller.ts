import { Request, Response } from 'express';
import {
    CreateQuotaConfigDTO,
    DeleteQuotaConfigsDTO,
    UpdateQuotaConfigDTO,
} from 'shared';
import { QuotaConfigService } from '../services/quotaConfig.service.ts';

export class QuotaConfigController {
    private service: QuotaConfigService;

    constructor() {
        this.service = new QuotaConfigService();
    }

    private param(value: string | string[]): string {
        return Array.isArray(value) ? value[0] : value;
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            res.status(201).json(await this.service.create(req.body as CreateQuotaConfigDTO));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteMany(req: Request, res: Response): Promise<void> {
        try {
            await this.service.deleteMany(req.body as DeleteQuotaConfigsDTO);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json(await this.service.update(
                this.param(req.params.id),
                req.body as UpdateQuotaConfigDTO,
            ));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async activate(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json(await this.service.activate(this.param(req.params.id)));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json(await this.service.getById(this.param(req.params.id)));
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async getByName(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json(await this.service.getByName(this.param(req.params.nom)));
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async getByType(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json(await this.service.getByType(this.param(req.params.type)));
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async getByCategory(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json(await this.service.getByCategory(this.param(req.params.categoriaId)));
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }
}
