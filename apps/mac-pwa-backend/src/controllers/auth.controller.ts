import { Request, Response } from 'express';
import { UsuariService } from '../services/usuari.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { GoogleLoginDTO, RegisterUsuariDTO } from 'shared';

export class AuthController {
    private service: UsuariService;

    constructor() {
        this.service = new UsuariService();
    }

    async register(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
        const dto = req.body as RegisterUsuariDTO;

        if (!dto.emailPrincipal) {
            res.status(400).json({ message: 'El correu electrònic és obligatori.' });
            return;
        }

        const usuariDto = await this.service.registrarUsuari(dto);
        
        res.status(201).json({
            message: 'Pre-registre creat correctament a PostgreSQL. L\'usuari podrà accedir amb Google.',
            usuari: usuariDto
        });
        } catch (error: any) {
        res.status(400).json({ message: error.message });
        }
    }

    async google(req: Request<{}, {}, GoogleLoginDTO>, res: Response): Promise<void> {
        try {
            const { firebaseToken } = req.body;

            if (!firebaseToken) {
                res.status(400).json({ message: 'El firebaseToken és obligatori.' });
                return;
            }

            const usuari = await this.service.iniciarSessioGoogle({ firebaseToken });
            res.status(200).json(usuari);
        } catch (error: any) {
            res.status(401).json({ message: error.message });
        }
    }

    async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const firebaseUid = req.user?.uid;

            if (!firebaseUid) {
                res.status(401).json({ message: 'Usuari no autenticat.' });
                return;
            }

            const result = await this.service.tancarSessio(firebaseUid);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

}
