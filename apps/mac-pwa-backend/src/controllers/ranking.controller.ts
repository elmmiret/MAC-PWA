import type { Request, Response } from 'express';
import type {
    CreateRankingDTO,
    UpdateRankingDTO,
} from 'shared';
import { RankingService } from '../services/ranking.service.js';
import { getRouteParam } from '../utils/route-params.js';

export class RankingController {
    private service: RankingService;

    constructor() {
        this.service = new RankingService();
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            res.status(201).json(await this.service.create(req.body as CreateRankingDTO));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json(await this.service.getAll());
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

    async update(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json(await this.service.update(
                getRouteParam(req.params.id),
                req.body as UpdateRankingDTO,
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
