import { type RequestHandler, Router } from 'express';
import { PagamentController } from '../controllers/pagament.controller.js';
import { isAdmin, verifyFirebaseToken } from '../middlewares/auth.middleware.js';

const router = Router();
const controller = new PagamentController();
const adminOnly: RequestHandler[] = [verifyFirebaseToken, isAdmin];

/**
 * @swagger
 * /api/pagaments/byCategories/{type}:
 *   post:
 *     summary: Crea pagaments per cada usuari de les categories indicades
 *     tags: [Pagaments]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema: { type: string, enum: [LLICENCIA, ACTIVITAT, COMPETICIO, SOCI] }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreatePagamentsByCategoriesDTO' }
 *     responses:
 *       201: { description: Pagaments creats }
 *       400: { description: Dades invàlides o QuotaConfig activa absent }
 */
router.post('/byCategories/:type', ...adminOnly, (req, res) => controller.createByCategories(req, res));

/**
 * @swagger
 * /api/pagaments/paid:
 *   patch:
 *     summary: Marca com a PAGAT els pagaments indicats (només si estan PENDENTS)
 *     tags: [Pagaments]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdatePagamentsEstatDTO' }
 *     responses:
 *       200: { description: Pagaments actualitzats }
 */
router.patch('/paid', ...adminOnly, (req, res) => controller.markPaid(req, res));

/**
 * @swagger
 * /api/pagaments/canceled:
 *   patch:
 *     summary: Marca com a CANCELAT els pagaments indicats (només si estan PENDENTS)
 *     tags: [Pagaments]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdatePagamentsEstatDTO' }
 *     responses:
 *       200: { description: Pagaments actualitzats }
 */
router.patch('/canceled', ...adminOnly, (req, res) => controller.markCanceled(req, res));

/**
 * @swagger
 * /api/pagaments:
 *   delete:
 *     summary: Elimina els pagaments indicats
 *     tags: [Pagaments]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/DeletePagamentsDTO' }
 *     responses:
 *       200: { description: Pagaments eliminats }
 */
router.delete('/', ...adminOnly, (req, res) => controller.deleteMany(req, res));

/**
 * @swagger
 * /api/pagaments/{ususariId}:
 *   get:
 *     summary: Obté els pagaments d'un usuari amb la informació completa
 *     tags: [Pagaments]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: ususariId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Llista de pagaments }
 */
router.get('/:ususariId', ...adminOnly, (req, res) => controller.getByUsuariId(req, res));

export default router;
