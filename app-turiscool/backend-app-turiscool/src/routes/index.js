import express from 'express';
import course from './course-router.js';
import user from './user-router.js';
import progress from './progress-router.js';
import assessments from './assessment-router.js';

const router = express.Router();

router.use('/courses', course);
router.use('/users', user);
router.use('/progress', progress);
router.use('/assessments', assessments);

export default router;