import express from 'express';
const router = express.Router();

import { checkTestUser } from '../middleware/userPermissions.js'
import { createEvent, deleteEvent, getAllEvents, updateEvent, getEvent } from '../controllers/eventsController.js';

router.route('/').post(checkTestUser, createEvent).get(getAllEvents);
// need to put the :id one last
router.route('/:id').delete(checkTestUser, deleteEvent).patch(checkTestUser, updateEvent).get(getEvent);

export default router;
