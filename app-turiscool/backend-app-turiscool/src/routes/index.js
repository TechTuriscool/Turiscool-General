import express from 'express';
import course from './course-router.js';
import user from './user-router.js';
import progress from './progress-router.js';
import assessments from './assessment-router.js';
import firmafy from './firmafy-router.js';
import unsuspend from './unsuspend-router.js';

const router = express.Router();

router.use('/courses', course);
router.use('/users', user);
router.use('/unsuspend', unsuspend);
router.use('/progress', progress);
router.use('/assessments', assessments);
router.use('/firmafy', firmafy);

export default router;