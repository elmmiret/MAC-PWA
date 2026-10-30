import { Router } from 'express';
import { CategoriaController } from '../controllers/categoria.controller.ts';
import { QuotaConfigController } from '../controllers/quotaConfig.controller.ts';
import { isAdmin, verifyFirebaseToken } from '../middlewares/auth.middleware.ts';

const router = Router();
const controller = new CategoriaController();
const quotaConfigController = new QuotaConfigController();
const adminOnly = [verifyFirebaseToken, isAdmin];

/**
 * @swagger
 * /api/categories/create:
 *   post:
 *     summary: Crea una categoria
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateCategoriaDTO' }
 *     responses:
 *       201: { description: Categoria creada correctament }
 *       400: { description: Dades invalides }
 */
router.post('/create', ...adminOnly, (req, res) => controller.create(req, res));

/**
 * @swagger
 * /api/categories/byId/{id}:
 *   get:
 *     summary: Obté una categoria pel seu id PostgreSQL
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Categoria trobada }
 *       404: { description: Categoria no trobada }
 */
router.get('/byId/:id', ...adminOnly, (req, res) => controller.getById(req, res));

/**
 * @swagger
 * /api/categories/byType/{type}:
 *   get:
 *     summary: Obté una categoria pel seu TCategoria
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Categoria trobada }
 *       404: { description: Categoria no trobada }
 */
router.get('/byType/:type', ...adminOnly, (req, res) => controller.getByType(req, res));

/**
 * @swagger
 * /api/categories/edit/{id}:
 *   patch:
 *     summary: Edita una categoria
 *     tags: [Categories]
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
 *           schema: { $ref: '#/components/schemas/UpdateCategoriaDTO' }
 *     responses:
 *       200: { description: Categoria actualitzada correctament }
 */
router.patch('/edit/:id', ...adminOnly, (req, res) => controller.update(req, res));

/**
 * @swagger
 * /api/categories/set/{id}:
 *   patch:
 *     summary: Assigna usuaris a una categoria
 *     tags: [Categories]
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
 *           schema: { $ref: '#/components/schemas/SetCategoriaDTO' }
 *     responses:
 *       200: { description: Usuaris assignats correctament }
 */
router.patch('/set/:id', ...adminOnly, (req, res) => controller.setUsers(req, res));

/**
 * @swagger
 * /api/categories/unset/{id}:
 *   patch:
 *     summary: Desassigna usuaris d'una categoria
 *     tags: [Categories]
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
 *           schema: { $ref: '#/components/schemas/SetCategoriaDTO' }
 *     responses:
 *       200: { description: Usuaris desassignats correctament }
 */
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

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Elimina una categoria
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Categoria eliminada correctament }
 */
router.delete('/:id', ...adminOnly, (req, res) => controller.delete(req, res));

export default router;
