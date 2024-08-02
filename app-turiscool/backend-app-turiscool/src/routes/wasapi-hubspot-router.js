import { Router } from 'express';
import { updateContacts } from '../controllers/wasapi-hubspot-controller.js';

const router = Router();
// Rutas para los Usarios

router.post('/update-contacts', updateContacts);

export default router;