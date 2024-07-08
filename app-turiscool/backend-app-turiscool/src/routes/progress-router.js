import { Router } from 'express';
import { obtainProgressById } from '../controllers/progress-controller.js'; 

const router = Router();
// Rutas para los cursos

router.get('/:id', obtainProgressById);

export default router;