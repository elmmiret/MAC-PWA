import { Request, Response } from 'express';
import { UsuariService } from '../services/usuari.service';
import { RegisterUsuariDTO } from 'shared';

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

    async login(
        req: Request<{}, {}, { emailPrincipal: string; password: string }>,
        res: Response,
    ): Promise<void> {
        try {
            const { emailPrincipal, password } = req.body;

            if (!emailPrincipal || !password) {
                res.status(400).json({ message: 'Email i password són obligatoris.' });
                return;
            }

            const token = await this.service.iniciarSessio(emailPrincipal, password);
            res.status(200).json(token);
        } catch (error: any) {
            res.status(401).json({ message: error.message });
        }
    }

}
