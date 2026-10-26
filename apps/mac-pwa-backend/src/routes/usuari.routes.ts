import { Router } from 'express';
import { UsuariController } from '../controllers/usuari.controller';
import { verifyFirebaseToken } from '../middlewares/auth.middleware';

const router = Router();
const usuariController = new UsuariController();

// Ruta protegida: obliga a enviar el Bearer Token a la capçalera HTTP
router.patch('/perfil', verifyFirebaseToken, (req, res) => usuariController.updatePerfil(req, res));

router.get('/id', verifyFirebaseToken, (req, res) => usuariController.getById(req, res));


export default router;