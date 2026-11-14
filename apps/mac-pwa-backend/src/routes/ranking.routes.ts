import { type RequestHandler, Router } from 'express';
import { RankingController } from '../controllers/ranking.controller.js';
import { isAdmin, verifyFirebaseToken } from '../middlewares/auth.middleware.js';

const router = Router();
const controller = new RankingController();
const adminOnly: RequestHandler[] = [verifyFirebaseToken, isAdmin];

/**
 * @swagger
 * tags:
 *   name: Rankings
 *   description: Gestió de rankings
 */

/**
 * @swagger
 * /api/rankings:
 *   post:
 *     summary: Crea un nou ranking
 *     tags: [Rankings]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateRankingDTO' }
 *     responses:
 *       201: { description: Ranking creat }
 *       400: { description: Dades invàlides }
 */
router.post('/', ...adminOnly, (req, res) => controller.create(req, res));

/**
 * @swagger
 * /api/rankings/{id}:
 *   get:
 *     summary: Obté un ranking pel seu id
 *     tags: [Rankings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Ranking trobat
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/RankingResponseDTO' }
 *       404: { description: Ranking no trobat }
 */
router.get('/:id', ...adminOnly, (req, res) => controller.getById(req, res));

/**
 * @swagger
 * /api/rankings/{id}:
 *   patch:
 *     summary: Edita el nom d'un ranking
 *     tags: [Rankings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateRankingDTO' }
 *     responses:
 *       200: { description: Ranking actualitzat }
 *       400: { description: Dades invàlides }
 */
router.patch('/:id', ...adminOnly, (req, res) => controller.update(req, res));

/**
 * @swagger
 * /api/rankings/{id}:
 *   delete:
 *     summary: Elimina un ranking i els seus AtletaRanking associats
 *     tags: [Rankings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Ranking eliminat }
 *       400: { description: Error en l'eliminació }
 */
router.delete('/:id', ...adminOnly, (req, res) => controller.delete(req, res));

export default router;
