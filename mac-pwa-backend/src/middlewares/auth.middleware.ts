import { Response, Request, NextFunction } from 'express';

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