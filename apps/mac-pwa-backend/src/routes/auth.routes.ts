import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

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
 * /api/auth/sync:
 *   post:
 *     summary: Sincronitza l'usuari amb Firebase i la base de dades relacional
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firebaseToken
 *             properties:
 *               firebaseToken:
 *                 type: string
 *                 description: Token JWT obtingut en iniciar sessió a Firebase
 *           example:
 *             firebaseToken: "eyJhbGciOiJSUzI1NiIs..."
 *     responses:
 *       200:
 *         description: Sincronització completada correctament
 *       401:
 *         description: Token invàlid o no autoritzat
 */
router.post('/sync', (req, res) => authController.sync(req, res));

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nou usuari (o Administrador) a Firebase i PostgreSQL
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
 *               - nom
 *               - cognom1
 *             properties:
 *               emailPrincipal:
 *                 type: string
 *               password:
 *                 type: string
 *               nom:
 *                 type: string
 *               cognom1:
 *                 type: string
 *               cognom2:
 *                 type: string
 *               tipus:
 *                 type: string
 *                 enum: [ADMIN, SOCI, NO_SOCI]
 *           example:
 *             emailPrincipal: "admin@martorell.cat"
 *             password: "PasswordSegur123"
 *             nom: "Pere"
 *             cognom1: "Martorell"
 *             cognom2: "Atlètic"
 *             tipus: "ADMIN"
 *     responses:
 *       201:
 *         description: Usuari administrador registrat correctament
 *       400:
 *         description: Falten camps obligatoris o error en el registre
 */
router.post('/register', (req, res) => authController.register(req, res));

export default router;