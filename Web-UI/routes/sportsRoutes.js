import express from 'express';
const router = express.Router();

import { checkTestUser } from '../middleware/userPermissions.js'
import { createSport, deleteSport, getAllSports, updateSport, getSport } from '../controllers/sportsController.js';

router.route('/').post(checkTestUser, createSport).get(getAllSports);
// need to put the :id one last
router.route('/:id').delete(checkTestUser, deleteSport).patch(checkTestUser, updateSport).get(getSport);

export default router;
