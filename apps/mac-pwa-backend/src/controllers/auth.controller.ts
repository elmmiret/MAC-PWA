import { Request, Response } from 'express';
import { UsuariService } from '../services/usuari.service';
import { SyncUsuariDTO } from 'shared';

export class AuthController {
    private service: UsuariService;

    constructor() {
        this.service = new UsuariService();
    }

    async sync(req: Request<{}, {}, SyncUsuariDTO>, res: Response): Promise<void> {
        try {
            const { firebaseToken } = req.body;
            if (!firebaseToken) {
                res.status(400).json({ message: 'El camp firebaseToken és obligatori.' });
                return;
            }
            
            const usuariDto = await this.service.sincronitzarUsuari({ firebaseToken });

            res.status(200).json({
                message: 'Sincronització completada correctament',
                usuari: usuariDto
            });
        } catch (error: any) {
            res.status(401).json({ message: error.message });
        }
    }
}