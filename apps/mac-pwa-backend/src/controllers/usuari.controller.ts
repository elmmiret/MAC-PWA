import { Request, Response } from 'express';
import { UsuariService } from '../services/usuari.service';
import { SyncUsuariDTO } from 'shared';

export class UsuariController {
    private service: UsuariService;

    constructor() {
        this.service = new UsuariService();
    }

    async sync(req: Request<{}, {}, SyncUsuariDTO>, res: Response): Promise<void> {
        try {
            const dto = req.body;
            
            if (!dto.firebaseToken) {
                res.status(400).json({ message: 'El camp firebaseToken és obligatori' });
                return;
            }

            const usuariDto = await this.service.sincronitzarUsuari(dto);

            res.status(201).json({
                message: 'Usuari registrar correctament',
                usuari: usuariDto
            });
        } catch (error: any) {
            res.status(401).json({ message: error.message });
        }
    }
}