import express from 'express';
const router = express.Router();

import { checkTestUser } from '../middleware/userPermissions.js'
import { createBet, deleteBet, getAllBets, getBet, updateBet, showStats } from '../controllers/betsController.js';

router.route('/').post(checkTestUser, createBet).get(getAllBets);
// need to put the :id one last
router.route('/stats').get(showStats);
router.route('/:id').delete(checkTestUser, deleteBet).patch(checkTestUser, updateBet).get(getBet);

export default router;
