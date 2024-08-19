import { Router } from 'express';
import { getUsers, deleteUser} from '../controllers/hubspot-controller.js';

const router = Router();
// Rutas para los cursos

router.get('/users', getUsers);
router.delete('/users/:contactId', deleteUser);

export default router;