import { Router } from 'express';
import { CategoriaController } from '../controllers/categoria.controller.ts';
import { QuotaConfigController } from '../controllers/quotaConfig.controller.ts';
import { isAdmin, verifyFirebaseToken } from '../middlewares/auth.middleware.ts';

const router = Router();
const controller = new CategoriaController();
const quotaConfigController = new QuotaConfigController();
const adminOnly = [verifyFirebaseToken, isAdmin];

router.post('/create', ...adminOnly, (req, res) => controller.create(req, res));
router.get('/byId/:id', ...adminOnly, (req, res) => controller.getById(req, res));
router.get('/byType/:type', ...adminOnly, (req, res) => controller.getByType(req, res));
router.patch('/edit/:id', ...adminOnly, (req, res) => controller.update(req, res));
router.patch('/set/:id', ...adminOnly, (req, res) => controller.setUsers(req, res));
router.patch('/unset/:id', ...adminOnly, (req, res) => controller.unsetUsers(req, res));

/**
 * @swagger
 * /api/categories/{categoriaId}/quotaConfigs:
 *   get:
 *     summary: Obté les QuotaConfig d'una categoria
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: categoriaId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Llista de QuotaConfig de la categoria }
 */
router.get('/:categoriaId/quotaConfigs', ...adminOnly, (req, res) => quotaConfigController.getByCategory(req, res));

router.delete('/:id', ...adminOnly, (req, res) => controller.delete(req, res));

export default router;
