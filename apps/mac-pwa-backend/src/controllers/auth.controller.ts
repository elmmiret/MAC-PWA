import { Request, Response } from 'express';
import { UsuariService } from '../services/usuari.service';
import { SyncUsuariDTO, RegisterUsuariDTO } from 'shared';

export class AuthController {
    private service: UsuariService;

    constructor() {
        this.service = new UsuariService();
    }

    async register(req: Request<{}, {}, RegisterUsuariDTO>, res: Response): Promise<void> {
        try {
        const dto = req.body;

        if (!dto.emailPrincipal || !dto.password || !dto.nom || !dto.cognom1) {
            res.status(400).json({ message: 'Falten camps obligatoris (email, password, nom, cognom1).' });
            return;
        }

        const usuariDto = await this.service.registrarUsuari(dto);
        
        res.status(201).json({
            message: 'Usuari administrador registrat correctament a Firebase i PostgreSQL',
            usuari: usuariDto
        });
        } catch (error: any) {
        res.status(400).json({ message: error.message });
        }
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