import { Router } from 'express';
import { obtainUsers, obtainUserById, obtainUsersPerCourse } from '../controllers/user-controller.js';
import { obtainProgressByCourse } from '../controllers/progress-controller.js';

const router = Router();
// Rutas para los Usarios

router.get('/', obtainUsers);
router.get('/:id', obtainUserById);
router.get('/:id/courses', obtainUsersPerCourse);
router.get('/:userID/courses/:courseID/progress', obtainProgressByCourse);


export default router;