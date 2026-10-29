import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { isAdmin, verifyFirebaseToken } from '../middlewares/auth.middleware';

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailPrincipal
 *             properties:
 *               emailPrincipal:
 *                 type: string
 *               nom:
 *                 type: string
 *               cognom1:
 *                 type: string
 *               cognom2:
 *                 type: string
 *           example:
 *             emailPrincipal: "pere@gmail.com"
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
 * /api/auth/login:
 *   post:
 *     summary: Inicia sessió i retorna un Firebase ID token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailPrincipal
 *               - password
 *             properties:
 *               emailPrincipal:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Token obtingut correctament
 *       401:
 *         description: Credencials invàlides
 */
router.post('/login', (req, res) => authController.login(req, res));

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

export default router;
