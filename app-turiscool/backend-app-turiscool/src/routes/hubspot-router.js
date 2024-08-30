import { Router } from 'express';
import { getUsers, deleteUser, updateUser} from '../controllers/hubspot-controller.js';

const router = Router();
// Rutas para los cursos

router.get('/users', getUsers);
router.delete('/users/:contactId', deleteUser);
router.patch('/users/:contactId', updateUser);

export default router;