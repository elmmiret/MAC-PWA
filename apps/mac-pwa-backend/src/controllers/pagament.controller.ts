import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import type {
    CreatePagamentsByCategoriesDTO,
    DeletePagamentsDTO,
    UpdatePagamentsEstatDTO,
} from 'shared';
import { PagamentService } from '../services/pagament.service.js';
import { getRouteParam } from '../utils/route-params.js';

export class PagamentController {
    private service: PagamentService;

    constructor() {
        this.service = new PagamentService();
    }

    async createByCategories(req: Request, res: Response): Promise<void> {
        try {
            const type = getRouteParam(req.params.type);
            const result = await this.service.createByCategories(
                type,
                req.body as CreatePagamentsByCategoriesDTO,
            );
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async markPaid(req: Request, res: Response): Promise<void> {
        try {
            const count = await this.service.markPaid(req.body as UpdatePagamentsEstatDTO);
            res.status(200).json({ updated: count });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async markCanceled(req: Request, res: Response): Promise<void> {
        try {
            const count = await this.service.markCanceled(req.body as UpdatePagamentsEstatDTO);
            res.status(200).json({ updated: count });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteMany(req: Request, res: Response): Promise<void> {
        try {
            const count = await this.service.deleteMany(req.body as DeletePagamentsDTO);
            res.status(200).json({ deleted: count });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getByUsuariId(req: Request, res: Response): Promise<void> {
        try {
            const usuariId = getRouteParam(req.params.ususariId);
            res.status(200).json(await this.service.getByUsuariId(usuariId));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getCurrent(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const firebaseUid = req.user?.uid;

            if (!firebaseUid) {
                res.status(401).json({ message: 'Usuari no autenticat.' });
                return;
            }

            res.status(200).json(await this.service.getCurrentPagaments(firebaseUid));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
