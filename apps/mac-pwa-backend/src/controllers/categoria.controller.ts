import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import type { CreateCategoriaDTO, SetCategoriaDTO, UpdateCategoriaDTO } from 'shared';
import { CategoriaService } from '../services/categoria.service.js';
import { getRouteParam } from '../utils/route-params.js';

export class CategoriaController {
    private service: CategoriaService;

    constructor() {
        this.service = new CategoriaService();
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.service.create(req.body as CreateCategoriaDTO);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.service.getById(getRouteParam(req.params.id));
            res.status(200).json(result);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async getByType(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.service.getByType(getRouteParam(req.params.type));
            res.status(200).json(result);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async getCurrent(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const firebaseUid = req.user?.uid;

            if (!firebaseUid) {
                res.status(401).json({ message: 'Usuari no autenticat.' });
                return;
            }

            const result = await this.service.getCurrentCategoria(firebaseUid);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async updateAnyNaixementOficials(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.service.updateAnyNaixementOficials();
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async assignCategoriesToUsers(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.service.assignCategoriesToUsers();
            res.status(200).json({ message: 'Categories assignades correctament.', ...result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.service.update(
                getRouteParam(req.params.id),
                req.body as UpdateCategoriaDTO,
            );
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async setUsers(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.service.setUsers(
                getRouteParam(req.params.id),
                req.body as SetCategoriaDTO,
            );
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async unsetUsers(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.service.unsetUsers(
                getRouteParam(req.params.id),
                req.body as SetCategoriaDTO,
            );
            res.status(200).json(result);
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
