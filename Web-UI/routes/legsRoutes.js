import express from 'express';
const router = express.Router();

import { checkTestUser } from '../middleware/userPermissions.js'
import { createLeg, deleteLeg, getAllLegs, getLeg, updateLeg, showStats } from '../controllers/legsController.js';

router.route('/').post(checkTestUser, createLeg).get(getAllLegs);
// need to put the :id one last
router.route('/stats').get(showStats);
router.route('/:id').delete(checkTestUser, deleteLeg).patch(checkTestUser, updateLeg).get(getLeg);

export default router;
