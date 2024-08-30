import { Router } from 'express';
import { getData } from '../controllers/filtrar-fundae-controller.js';

const router = Router();
// Rutas para los cursos

router.get('/getData', getData);

export default router;