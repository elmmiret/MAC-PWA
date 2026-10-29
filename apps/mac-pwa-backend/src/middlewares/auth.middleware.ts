import { Response, Request, NextFunction } from 'express';
import { firebaseAdmin } from '../config/firebase';
import { UsuariService } from '../services/usuari.service';

export interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        email?: string;
        admin?: boolean;
    };
}

const usuariService = new UsuariService();

export const isAdmin = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): void => {
    if (req.user?.admin !== true) {
        res.status(403).json({
            message: 'Accés denegat. Es requereix el rol ADMIN.',
        });
        return;
    }

    next();
};

export const canDeleteUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const firebaseUid = req.user?.uid;
        const targetId = req.params.id;

        if (!firebaseUid) {
            res.status(401).json({ message: 'Usuari no autenticat.' });
            return;
        }

        if (!targetId) {
            res.status(400).json({ message: 'L identificador d\'usuari és obligatori.' });
            return;
        }

        if (req.user?.admin === true) {
            next();
            return;
        }

        const actor = await usuariService.obtenirUsuariPerFirebaseId(firebaseUid);
        if (actor.id !== targetId) {
            res.status(403).json({ message: 'Només pots eliminar el teu propi usuari.' });
            return;
        }

        next();
    } catch (error) {
        res.status(403).json({ message: 'No s\'ha pogut validar l\'usuari autenticat.' });
    }
};

export const verifyFirebaseToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Accés no autoritzat. Falta el token d\'autenticació.' });
            return;
        }

        const token = authHeader.slice('Bearer '.length).trim();
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token, true);

        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            admin: decodedToken.admin === true,
        };

        next();
    } catch (error: any) {
        res.status(403).json({ message: 'Token invàlid o caducat.', error: error.message });
    }
};
