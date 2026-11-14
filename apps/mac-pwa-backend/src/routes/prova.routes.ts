import { type RequestHandler, Router } from 'express';
import { ProvaController } from '../controllers/prova.controller.js';
import { isAdmin, verifyFirebaseToken } from '../middlewares/auth.middleware.js';

const router = Router();
const controller = new ProvaController();
const adminOnly: RequestHandler[] = [verifyFirebaseToken, isAdmin];

/**
 * @swagger
 * tags:
 *   name: Proves
 *   description: Gestió de proves
 */

/**
 * @swagger
 * /api/provas:
 *   get:
 *     summary: Llista totes les proves
 *     tags: [Proves]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Llista de proves
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/ProvaResponseDTO' }
 */
router.get('/', ...adminOnly, (req, res) => controller.getAll(req, res));

/**
 * @swagger
 * /api/provas:
 *   post:
 *     summary: Crea una nova prova
 *     tags: [Proves]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateProvaDTO' }
 *     responses:
 *       201: { description: Prova creada }
 *       400: { description: Dades invàlides }
 */
router.post('/', ...adminOnly, (req, res) => controller.create(req, res));

/**
 * @swagger
 * /api/provas:
 *   delete:
 *     summary: Elimina diverses proves
 *     tags: [Proves]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/DeleteProvasDTO' }
 *     responses:
 *       204: { description: Proves eliminades }
 *       400: { description: Dades invàlides }
 */
router.delete('/', ...adminOnly, (req, res) => controller.deleteMany(req, res));

export default router;
