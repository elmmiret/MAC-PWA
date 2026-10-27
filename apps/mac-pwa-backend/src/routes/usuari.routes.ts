import { Router } from 'express';
import { UsuariController } from '../controllers/usuari.controller';
import { isAdmin, isSoci, verifyFirebaseToken } from '../middlewares/auth.middleware';

const router = Router();
const usuariController = new UsuariController();

/**
 * @swagger
 * tags:
 *   name: Usuaris
 *   description: Gestió de perfils d'usuari
 */

/**
 * @swagger
 * /api/usuaris/perfil:
 *   patch:
 *     summary: Completa el perfil de l'usuari (Onboarding)
 *     tags: [Usuaris]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - cognom1
 *             properties:
 *               nom:
 *                 type: string
 *               cognom1:
 *                 type: string
 *               cognom2:
 *                 type: string
 *           example:
 *             nom: "Joan"
 *             cognom1: "Garcia"
 *             cognom2: "Pérez"
 *     responses:
 *       200:
 *         description: Perfil completat correctament
 *       401:
 *         description: No autoritzat / Falta el token
 */
router.patch('/perfil', verifyFirebaseToken, (req, res) => usuariController.updatePerfil(req, res));

/**
 * @swagger
 * /api/usuaris/{id}:
 *   get:
 *     summary: Obté un usuari pel seu ID intern de PostgreSQL
 *     tags: [Usuaris]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID intern de l'usuari a la base de dades
 *     responses:
 *       200:
 *         description: Retorna les dades de l'usuari en format DTO
 *       404:
 *         description: L'usuari no existeix
 */
router.get('/:id', verifyFirebaseToken, isAdmin, (req, res) => usuariController.getById(req, res));


export default router;
