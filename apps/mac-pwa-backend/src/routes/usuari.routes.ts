import { Router } from 'express';
import { UsuariController } from '../controllers/usuari.controller';
import { isAdmin, verifyFirebaseToken } from '../middlewares/auth.middleware';

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
router.patch('/update/:id', verifyFirebaseToken, isAdmin, (req, res) => usuariController.update(req, res));

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
router.get('/allUsuaris', verifyFirebaseToken, isAdmin, (req, res) => usuariController.getAll(req, res));

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
router.get('/firebase/:firebaseUid', verifyFirebaseToken, isAdmin, (req, res) => usuariController.getByFirebaseUid(req, res));

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
router.delete('/:id', verifyFirebaseToken, isAdmin, (req, res) => usuariController.delete(req, res));


export default router;
