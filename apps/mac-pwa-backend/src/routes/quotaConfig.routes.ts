import { RequestHandler, Router } from 'express';
import { QuotaConfigController } from '../controllers/quotaConfig.controller.ts';
import { isAdmin, verifyFirebaseToken } from '../middlewares/auth.middleware.ts';

const router = Router();
const controller = new QuotaConfigController();
const adminOnly: RequestHandler[] = [verifyFirebaseToken, isAdmin];

/**
 * @swagger
 * /api/quotaConfigs/create:
 *   post:
 *     summary: Crea una QuotaConfig
 *     tags: [QuotaConfig]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateQuotaConfigDTO' }
 *     responses:
 *       201: { description: QuotaConfig creada }
 */
router.post('/create', ...adminOnly, (req, res) => controller.create(req, res));

/**
 * @swagger
 * /api/quotaConfigs/delete:
 *   delete:
 *     summary: Elimina varies QuotaConfig sense pagaments relacionats
 *     tags: [QuotaConfig]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/DeleteQuotaConfigsDTO' }
 *     responses:
 *       204: { description: QuotaConfig eliminadas }
 */
router.delete('/delete', ...adminOnly, (req, res) => controller.deleteMany(req, res));

/**
 * @swagger
 * /api/quotaConfigs/edit/{id}:
 *   patch:
 *     summary: Edita el nom o les temporades d'una QuotaConfig
 *     tags: [QuotaConfig]
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
 *           schema: { $ref: '#/components/schemas/UpdateQuotaConfigDTO' }
 *     responses:
 *       200: { description: QuotaConfig actualitzada }
 */
router.patch('/edit/:id', ...adminOnly, (req, res) => controller.update(req, res));

/**
 * @swagger
 * /api/quotaConfigs/activate/{id}:
 *   patch:
 *     summary: Activa una QuotaConfig i desactiva l'altra del mateix tipus i categoria
 *     tags: [QuotaConfig]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: QuotaConfig activada }
 */
router.patch('/activate/:id', ...adminOnly, (req, res) => controller.activate(req, res));

/**
 * @swagger
 * /api/quotaConfigs/byId/{id}:
 *   get:
 *     summary: Obté una QuotaConfig pel seu id
 *     tags: [QuotaConfig]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: QuotaConfig trobada }
 */
router.get('/byId/:id', ...adminOnly, (req, res) => controller.getById(req, res));

/**
 * @swagger
 * /api/quotaConfigs/byName/{nom}:
 *   get:
 *     summary: Obté una QuotaConfig pel seu nom
 *     tags: [QuotaConfig]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: nom
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: QuotaConfig trobada }
 */
router.get('/byName/:nom', ...adminOnly, (req, res) => controller.getByName(req, res));

/**
 * @swagger
 * /api/quotaConfigs/byType/{type}:
 *   get:
 *     summary: Obté les QuotaConfig d'un tipus
 *     tags: [QuotaConfig]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema: { type: string, enum: [LLICENCIA, ACTIVITAT, COMPETICIO, SOCI] }
 *     responses:
 *       200: { description: Llista de QuotaConfig }
 */
router.get('/byType/:type', ...adminOnly, (req, res) => controller.getByType(req, res));

export default router;
