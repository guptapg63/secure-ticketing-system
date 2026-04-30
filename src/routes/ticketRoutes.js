import express from 'express';
import { 
  createTicket, 
  getMyTickets, 
  getAllTickets,
  updateTicket,
  deleteTicket
} from '../controllers/ticketController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Admin-only route to see all tickets
router.route('/all').get(protect, admin, getAllTickets);

// Routes for specific tickets using ID
router.route('/:id')
  .put(protect, admin, updateTicket) // Only Admin can update status/priority
  .delete(protect, deleteTicket);    // User can delete their own ticket

// Standard routes
router.route('/')
  .post(protect, createTicket)
  .get(protect, getMyTickets);

export default router;