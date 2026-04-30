import express from 'express';
import { 
  createTicket, 
  getMyTickets, 
  getAllTickets 
} from '../controllers/ticketController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Admin-only route (Ispe admin middleware laga hai)
router.route('/all').get(protect, admin, getAllTickets);

// Standard protected routes (Ispe koi admin middleware nahi hai)
router.route('/').post(protect, createTicket).get(protect, getMyTickets);

export default router;