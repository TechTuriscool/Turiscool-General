import { Router } from 'express';
import { updateContacts } from '../controllers/wasapi-hubspot-controller.js';
import { DataDB } from '../controllers/conversaciones-whatsapp.js';

const router = Router();
// Rutas para los Usarios

router.post('/update-contacts', updateContacts);
router.get('/recoger-conversaciones', DataDB);

export default router;