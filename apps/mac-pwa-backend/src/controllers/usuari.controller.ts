import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { UsuariService } from '../services/usuari.service';
import { UpdatePerfilDTO } from 'shared';
import { getRouteParam } from '../utils/route-params';

export class UsuariController {
    private service: UsuariService;

    constructor() {
        this.service = new UsuariService();
    }


    async update(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const id = getRouteParam(req.params.id);
            const dto = req.body as UpdatePerfilDTO;

            if (!id) {
                res.status(400).json({ message: "L'identificador d'usuari és obligatori." });
                return;
            }

            if (Object.keys(dto).length === 0) {
                res.status(400).json({ message: 'Cal indicar almenys un camp per actualitzar.' });
                return;
            }

            const usuariDto = await this.service.actualitzarUsuari(id, dto);
            
            res.status(200).json({
                message: 'Usuari actualitzat correctament',
                usuari: usuariDto
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = getRouteParam(req.params.id);

            if (!userId) {
                res.status(400).json({ message: "L'identificador d'usuari és obligatori." });
                return;
            }

            const usuariDto = await this.service.obtenirUsuariPerId(userId);
            res.status(200).json(usuariDto);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async getByFirebaseUid(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const firebaseUid = getRouteParam(req.params.firebaseUid);

            if (!firebaseUid) {
                res.status(400).json({ message: 'El firebaseUid és obligatori.' });
                return;
            }

            const usuariDto = await this.service.obtenirUsuariPerFirebaseId(firebaseUid);
            res.status(200).json(usuariDto);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const usuaris = await this.service.obtenirTotsElsUsuaris();
            res.status(200).json(usuaris);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const id = getRouteParam(req.params.id);

            if (!id) {
                res.status(400).json({ message: "L'identificador d'usuari és obligatori." });
                return;
            }

            const result = await this.service.eliminarUsuari(id, req.user?.admin === true);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
