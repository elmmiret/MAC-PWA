import { type RequestHandler, Router } from 'express';
import { AtletaRankingController } from '../controllers/atletaRanking.controller.js';
import { isAdmin, verifyFirebaseToken } from '../middlewares/auth.middleware.js';

const router = Router();
const controller = new AtletaRankingController();
const adminOnly: RequestHandler[] = [verifyFirebaseToken, isAdmin];

/**
 * @swagger
 * tags:
 *   name: AtletaRankings
 *   description: Gestió d'atletes dins de rankings
 */

/**
 * @swagger
 * /api/atletaRankings:
 *   post:
 *     summary: Afegeix un usuari a un ranking
 *     tags: [AtletaRankings]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateAtletaRankingDTO' }
 *     responses:
 *       201: { description: AtletaRanking creat }
 *       400: { description: Dades invàlides }
 */
router.post('/', ...adminOnly, (req, res) => controller.create(req, res));

/**
 * @swagger
 * /api/atletaRankings/ranking/{rankingId}:
 *   get:
 *     summary: Llista els AtletaRanking d'un ranking
 *     tags: [AtletaRankings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: rankingId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Llista d'AtletaRanking
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/AtletaRankingResponseDTO' }
 *       400: { description: Error en la consulta }
 */
router.get('/ranking/:rankingId', ...adminOnly, (req, res) => controller.getByRankingId(req, res));

/**
 * @swagger
 * /api/atletaRankings/{id}:
 *   patch:
 *     summary: Edita un AtletaRanking
 *     tags: [AtletaRankings]
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
 *           schema: { $ref: '#/components/schemas/UpdateAtletaRankingDTO' }
 *     responses:
 *       200: { description: AtletaRanking actualitzat }
 *       400: { description: Dades invàlides }
 */
router.patch('/:id', ...adminOnly, (req, res) => controller.update(req, res));

/**
 * @swagger
 * /api/atletaRankings/{id}:
 *   delete:
 *     summary: Elimina un AtletaRanking
 *     tags: [AtletaRankings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: AtletaRanking eliminat }
 *       400: { description: Error en l'eliminació }
 */
router.delete('/:id', ...adminOnly, (req, res) => controller.delete(req, res));

export default router;
