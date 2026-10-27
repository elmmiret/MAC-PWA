import { Response, Request, NextFunction, RequestHandler } from 'express';
import { TUsuari } from '@prisma/client';
import { firebaseAdmin } from '../config/firebase';
import { UsuariRepository } from '../repositories/usuari.repository';

/**
 * Middleware per comprovar si l'usuari té permisos d'Administrador.
 */

export interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        email?: string;
    };
}

const usuariRepository = new UsuariRepository();

const requireRole = (role: TUsuari, roleName: string): RequestHandler => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const firebaseUid = req.user?.uid;

            if (!firebaseUid) {
                res.status(401).json({ message: 'Usuari no autenticat.' });
                return;
            }

            const usuari = await usuariRepository.findByFirebaseUid(firebaseUid);

            if (!usuari || usuari.tipus !== role) {
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
