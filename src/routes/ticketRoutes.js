import express from 'express';
import { createTicket, getMyTickets } from '../controllers/ticketController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth protection to both POST and GET routes
router.route('/')
  .post(protect, createTicket)
  .get(protect, getMyTickets);

export default router;