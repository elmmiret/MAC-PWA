import { Response, Request, NextFunction, RequestHandler } from 'express';
import { TUsuari } from 'shared';
import { firebaseAdmin } from '../config/firebase';
import { UsuariService } from '../services/usuari.service';

/**
 * Middleware per comprovar si l'usuari té permisos d'Administrador.
 */

export interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        email?: string;
    };
}

const usuariService = new UsuariService();

const requireRole = (role: TUsuari, roleName: string): RequestHandler => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const firebaseUid = req.user?.uid;

            if (!firebaseUid) {
                res.status(401).json({ message: 'Usuari no autenticat.' });
                return;
            }

            const usuari = await usuariService.obtenirUsuariPerFirebaseId(firebaseUid);

            if (usuari.tipus !== role) {
                res.status(403).json({
                    message: `Accés denegat. Es requereix el rol ${roleName}.`,
                });
                return;
            }

            next();
        } catch (error) {
            res.status(500).json({ message: 'Error intern al validar els permisos.' });
        }
    };
};

export const isAdmin = requireRole(TUsuari.ADMIN, 'ADMIN');
export const isSoci = requireRole(TUsuari.SOCI, 'SOCI');

export const canDeleteUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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

        const actor = await usuariService.obtenirUsuariPerFirebaseId(firebaseUid);

        if (actor.tipus !== TUsuari.ADMIN && actor.id !== targetId) {
            res.status(403).json({
                message: 'Només pots eliminar el teu propi usuari.',
            });
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Error intern al validar els permisos.' });
    }
};

export const verifyFirebaseToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Accés no autoritzat. Falta el token d\'autenticació.'});
            return;
        }

        const token = authHeader.split('Bearer ')[1];

        // Verificació del token amb Firebase Admin SDK
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token, true);

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
