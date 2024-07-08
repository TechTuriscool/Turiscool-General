import { Router } from 'express';
import { obtainResponses } from '../controllers/assessments-controller.js';

const router = Router();
// Rutas para los cursos

router.get('/:id/responses', obtainResponses);

export default router;