import type { Request, Response } from 'express';
import type {
    CreateQuotaConfigDTO,
    DeleteQuotaConfigsDTO,
    UpdateQuotaConfigDTO,
} from 'shared';
import { QuotaConfigService } from '../services/quotaConfig.service.js';
import { QuotaConfigsWithPaymentsError } from '../repositories/quotaConfig.repository.js';
import { getRouteParam } from '../utils/route-params.js';

export class QuotaConfigController {
    private service: QuotaConfigService;

    constructor() {
        this.service = new QuotaConfigService();
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
            if (error instanceof QuotaConfigsWithPaymentsError) {
                res.status(409).json({
                    message: error.message,
                    quotaConfigIds: error.quotaConfigIds,
                });
                return;
            }
            res.status(400).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json(await this.service.update(
                getRouteParam(req.params.id),
                req.body as UpdateQuotaConfigDTO,
            ));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async activate(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json(await this.service.activate(getRouteParam(req.params.id)));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async addTemporades(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json(await this.service.addTemporades(
                getRouteParam(req.params.id),
                req.body,
            ));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async deactivate(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json(await this.service.deactivate(getRouteParam(req.params.id)));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json(await this.service.getById(getRouteParam(req.params.id)));
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async getByName(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json(await this.service.getByName(getRouteParam(req.params.nom)));
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async getByType(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json(await this.service.getByType(getRouteParam(req.params.type)));
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

}
