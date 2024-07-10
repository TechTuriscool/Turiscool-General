import { Router } from 'express';
import getData from '../controllers/firmafy-controller.js';

const router = Router();
// Rutas para los cursos

router.get('/', async (req, res) => {
    try {
        const data = await getData();
        res.send(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

export default router;