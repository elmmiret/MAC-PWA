import { Router } from 'express';
import { UsuariController } from '../controllers/usuari.controller.js';
import { isAdmin, verifyFirebaseToken } from '../middlewares/auth.middleware.js';

const router = Router();
const usuariController = new UsuariController();
const adminOnly = [verifyFirebaseToken, isAdmin];
const authenticated = [verifyFirebaseToken];

/**
 * @swagger
 * tags:
 *   name: Usuaris
 *   description: Gestió de perfils d'usuari
 */

/**
 * @swagger
 * /api/usuaris/update/{id}:
 *   patch:
 *     summary: Actualitza les dades d'un usuari
 *     tags: [Usuaris]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID intern de l'usuari a PostgreSQL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUsuariDTO'
 *     responses:
 *       200:
 *         description: Usuari actualitzat correctament
 *       403:
 *         description: Es requereixen permisos d'administrador
 */
router.patch('/update/:id', ...adminOnly, (req, res) => usuariController.update(req, res));

/**
 * @swagger
 * /api/usuaris/allUsuaris:
 *   get:
 *     summary: Obté tots els usuaris no administradors
 *     tags: [Usuaris]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Llista d'usuaris en format UsuariResponseDTO
 *       403:
 *         description: Es requereixen permisos d'administrador
 */
router.get('/allUsuaris', ...adminOnly, (req, res) => usuariController.getAll(req, res));

/**
 * @swagger
 * /api/usuaris/setEntrenador/{id}:
 *   patch:
 *     summary: Marca un usuari com a entrenador
 *     tags: [Usuaris]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Usuari marcat com a entrenador }
 */
router.patch('/setEntrenador/:id', ...adminOnly, (req, res) => usuariController.setEntrenador(req, res));

/**
 * @swagger
 * /api/usuaris/unsetEntrenador/{id}:
 *   patch:
 *     summary: Desmarca un usuari com a entrenador
 *     tags: [Usuaris]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Usuari desmarcat com a entrenador }
 */
router.patch('/unsetEntrenador/:id', ...adminOnly, (req, res) => usuariController.unsetEntrenador(req, res));

/**
 * @swagger
 * /api/usuaris/setFamiliar/{id}:
 *   patch:
 *     summary: Assigna un usuari familiar a diversos usuaris
 *     tags: [Usuaris]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Usuari que serà el familiar comú
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [usuariIds]
 *             properties:
 *               usuariIds:
 *                 type: array
 *                 minItems: 1
 *                 items: { type: string }
 *     responses:
 *       200: { description: Familiar assignat correctament }
 *       400: { description: Relació circular o usuaris inexistents }
 */
router.patch('/setFamiliar/:id', ...adminOnly, (req, res) => usuariController.setFamiliar(req, res));

/**
 * @swagger
 * /api/usuaris/me:
 *   get:
 *     summary: Obté les dades de l'usuari autenticat
 *     tags: [Usuaris]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retorna les dades de l'usuari autenticat sense camps interns
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeUsuariResponseDTO'
 *       401:
 *         description: Usuari no autenticat
 */
router.get('/me', ...authenticated, (req, res) => usuariController.getCurrent(req, res));

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
router.get('/:id',  ...adminOnly, (req, res) => usuariController.getById(req, res));

/**
 * @swagger
 * /api/usuaris/firebase/{firebaseUid}:
 *   get:
 *     summary: Obté un usuari pel seu Firebase UID
 *     tags: [Usuaris]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: firebaseUid
 *         required: true
 *         schema:
 *           type: string
 *         description: UID de l'usuari a Firebase Authentication
 *     responses:
 *       200:
 *         description: Retorna l'usuari en format UsuariResponseDTO
 *       404:
 *         description: L'usuari no existeix
 */
router.get('/firebase/:firebaseUid',  ...adminOnly, (req, res) => usuariController.getByFirebaseUid(req, res));

/**
 * @swagger
 * /api/usuaris/{id}:
 *   delete:
 *     summary: Elimina un usuari. Només accessible per administradors
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
 *         description: Usuari eliminat correctament
 *       403:
 *         description: L'usuari no té permisos
 */
router.delete('/:id',  ...adminOnly, (req, res) => usuariController.delete(req, res));


export default router;
