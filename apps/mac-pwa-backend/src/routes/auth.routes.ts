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

export default router;
