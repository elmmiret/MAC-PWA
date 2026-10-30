import { Response, Request, NextFunction } from 'express';
import { firebaseAdmin } from '../config/firebase';

export interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        email?: string;
        admin?: boolean;
    };
}

export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (req.user?.admin !== true) {
        res.status(403).json({ message: 'Accés denegat. Es requereix ser administrador.' });
        return;
    }

    next();
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
