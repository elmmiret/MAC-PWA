import { Router } from 'express';
import { CategoriaController } from '../controllers/categoria.controller.ts';

const router = Router();
const controller = new CategoriaController();

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: Obtenir totes les categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Llista de totes les categories
 *   post:
 *     summary: Crear una nova categoria
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipus:
 *                 type: string
 *                 example: SUB16
 *               anyNaixement:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [2010, 2011]
 *     responses:
 *       201:
 *         description: Categoria creada correctament
 */
router.get('/categories', (req, res) => controller.getAll(req, res));
//router.post('/categories', (req, res) => controller.createCategoria(req, res));

export default router;