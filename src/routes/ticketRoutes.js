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
import { body } from 'express-validator';

const router = express.Router();

// @route   /api/tickets
router.route('/')
  .get(protect, getMyTickets)
  .post(
    protect, 
    [
      // Professional validation rules
      body('subject', 'Subject must be at least 10 characters long').isLength({ min: 10 }),
      body('description', 'Description is required').not().isEmpty(),
    ], 
    createTicket
  );

// @route   /api/tickets/all
// Admin-only route to see all tickets
router.route('/all').get(protect, admin, getAllTickets);

// @route   /api/tickets/:id
// Routes for specific tickets using ID
router.route('/:id')
  .put(protect, admin, updateTicket) // Only Admin can update status/priority
  .delete(protect, deleteTicket);    // User can delete their own ticket

export default router;