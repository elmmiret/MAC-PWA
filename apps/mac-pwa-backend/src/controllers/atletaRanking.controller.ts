import type { Request, Response } from 'express';
import type {
    CreateAtletaRankingDTO,
    UpdateAtletaRankingDTO,
} from 'shared';
import { AtletaRankingService } from '../services/atletaRanking.service.js';
import { getRouteParam } from '../utils/route-params.js';

export class AtletaRankingController {
    private service: AtletaRankingService;

    constructor() {
        this.service = new AtletaRankingService();
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            res.status(201).json(await this.service.create(req.body as CreateAtletaRankingDTO));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getByRankingId(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json(await this.service.getByRankingId(getRouteParam(req.params.rankingId)));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json(await this.service.update(
                getRouteParam(req.params.id),
                req.body as UpdateAtletaRankingDTO,
            ));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            await this.service.delete(getRouteParam(req.params.id));
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
