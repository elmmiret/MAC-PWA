import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { UsuariService } from '../services/usuari.service';
import { UpdatePerfilDTO } from 'shared';

export class UsuariController {
    private service: UsuariService;

    constructor() {
        this.service = new UsuariService();
    }


    async updatePerfil(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            // S'obté el UID de manera segura a través del token validat pel middleware
            const firebaseUid = req.user?.uid;
            const { nom, cognom1, cognom2 } = req.body as UpdatePerfilDTO;

            if (!firebaseUid) {
                res.status(401).json({ message: 'Usuari no autenticat.' });
                return;
            }

            if (!nom || !cognom1) {
                res.status(400).json({ message: 'Els camps nom i primer cognom són obligatoris.' });
                return;
            }

            const usuariDto = await this.service.completarPerfil(firebaseUid, { nom, cognom1, cognom2 });
            
            res.status(200).json({
                message: 'Perfil completat correctament',
                usuari: usuariDto
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const userId = Array.isArray(id) ? id[0] : id;

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
            const { firebaseUid } = req.params;

            if (!firebaseUid || Array.isArray(firebaseUid)) {
                res.status(400).json({ message: 'El firebaseUid és obligatori.' });
                return;
            }

            const usuariDto = await this.service.obtenirUsuariPerFirebaseId(firebaseUid);
            res.status(200).json(usuariDto);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const firebaseUid = req.user?.uid;
            const { id } = req.params;

            if (!firebaseUid) {
                res.status(401).json({ message: 'Usuari no autenticat.' });
                return;
            }

            if (!id || Array.isArray(id)) {
                res.status(400).json({ message: "L'identificador d'usuari és obligatori." });
                return;
            }

            const result = await this.service.eliminarUsuari(id, firebaseUid);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
