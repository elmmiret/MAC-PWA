import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

router.post('/sync', (req, res) => authController.sync(req, res));

export default router;