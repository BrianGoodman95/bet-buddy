import express from 'express';
const router = express.Router();

import { createBet, deleteBet, getAllBets, updateBet, showStats } from '../controllers/betsController.js';

router.route('/').post(createBet).get(getAllBets);
// need to put the :id one last
router.route('/stats').get(showStats);
router.route('/:id').delete(deleteBet).patch(updateBet);

export default router;
