import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { isAdmin, verifyFirebaseToken } from '../middlewares/auth.middleware.js';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints d'autenticació i sincronització
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Pre-registra un nou usuari a PostgreSQL
 *     tags: [Auth]
 *     security:
 *        - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUsuariDTO'
 *           example:
 *             emailPrincipal: "pere@gmail.com"
 *             dataNaixement: "2015-06-15T00:00:00.000Z"
 *             nom: "Pere"
 *             cognom1: "Martorell"
 *             cognom2: "Atlètic"
 *     responses:
 *       201:
 *         description: Usuari registrat correctament
 *       400:
 *         description: Falten camps obligatoris o error en el registre
 */
router.post('/register', verifyFirebaseToken, isAdmin, (req, res) => authController.register(req, res));

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Inicia sessió amb Google mitjançant Firebase
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoogleLoginDTO'
 *     responses:
 *       200:
 *         description: Usuari autenticat amb Google
 *       401:
 *         description: Token de Google invàlid
 */
router.post('/google', (req, res) => authController.google(req, res));

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Tanca la sessió de l'usuari autenticat
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sessió tancada correctament
 *       401:
 *         description: Token absent o invàlid
 */
router.post('/logout', verifyFirebaseToken, (req, res) => authController.logout(req, res));

/**
 * @swagger
 * /api/auth/set-admin:
 *   post:
 *     summary: Assigna el rol d'administrador a un usuari de Firebase
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SetAdminDTO'
 *     responses:
 *       200:
 *         description: Usuari promogut a administrador
 *       400:
 *         description: firebaseUid invàlid o error de Firebase
 *       403:
 *         description: Es requereixen permisos d'administrador
 */
router.post('/set-admin', verifyFirebaseToken, isAdmin, (req, res) => authController.setAdmin(req, res));

export default router;
