import { Router } from 'express';
import { UsuariController } from '../controllers/usuari.controller';

const router = Router();
const usuariController = new UsuariController();

router.post('/sync', (req, res) => usuariController.sync(req, res));

export default router;