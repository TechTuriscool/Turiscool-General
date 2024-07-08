import { Router } from 'express';
import { obtainCourses, obtainCourse, obtainContent, obtainUsersPerCourse } from '../controllers/course-controller.js';

const router = Router();
// Rutas para los cursos

router.get('/', obtainCourses);
router.get('/:id/contents', obtainContent);
router.get('/:id', obtainCourse);
router.get('/:id/users', obtainUsersPerCourse);

export default router;