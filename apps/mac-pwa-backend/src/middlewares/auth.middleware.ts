import { Response, Request, NextFunction } from 'express';
import { firebaseAdmin } from '../config/firebase';

/**
 * Middleware per comprovar si l'usuari té permisos d'Administrador.
 */

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
    try {
        // En el futur, això vindrà d'un token JWT o d'una sessió decodificada (ex: req.user.tipus)
        // De moment, per a proves, es pot comprovar amb un header personalitzat o al cos.

        const userTipus = req.headers['x-user-tipus'] || req.body.tipusUsuari;

        if (userTipus === 'Admin' || userTipus === 'ADMIN') {
            next(); // L'usuari és administrador, permet continuar
        } else {
            res.status(403).json({
                message: 'Accés denegat. Aquesta acció requereix permisos d\'Administrador.'
            });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error intern al validar els permisos.' });
    }
}

export interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        email?: string;
    };
}

export const verifyFirebaseToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Accés no autoritzat. Falta el token d\'autenticació.'});
            return;
        }

        const token = authHeader.split('Bearer ')[1];

        // Verificació del token amb Firebase Admin SDK
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

        // Adjuntar les dades de l'usuari a la request per utilitzar-les al controlador
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email
        };

        next();
    } catch (error: any) {
        res.status(403).json({ message: 'Token invàlid o caducat.', error: error.message });
    }
};

