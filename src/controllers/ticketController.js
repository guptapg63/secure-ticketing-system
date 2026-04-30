import Ticket from '../models/Ticket.js';
import { validationResult } from 'express-validator';

/**
 * @desc    Create a new support ticket
 * @route   POST /api/tickets
 * @access  Private
 */
export const createTicket = async (req, res) => {
  // 1. Check for validation errors from express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  const { subject, description, priority } = req.body;

  try {
    const ticket = await Ticket.create({
      user: req.user._id, // Set by protect middleware
      subject,
      description,
      priority: priority || 'Low',
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error(`Error in createTicket: ${error.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * @desc    Get tickets for the currently logged-in user
 * @route   GET /api/tickets
 * @access  Private
 */
export const getMyTickets = async (req, res) => {
  try {
    // Sort by most recent first
    const tickets = await Ticket.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    console.error(`Error in getMyTickets: ${error.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * @desc    Get all tickets across the system
 * @route   GET /api/tickets/all
 * @access  Private/Admin
 */
export const getAllTickets = async (req, res) => {
  try {
    // Populate user details to show who raised the ticket
    const tickets = await Ticket.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(tickets);
  } catch (error) {
    console.error(`Error in getAllTickets: ${error.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * @desc    Update ticket status/priority (Admin only)
 * @route   PUT /api/tickets/:id
 * @access  Private/Admin
 */
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        returnDocument: 'after', // Returns the updated doc, not the old one
        runValidators: true      // Ensures updates also follow Schema rules
      } 
    );

    res.json(updatedTicket);
  } catch (error) {
    console.error(`Error in updateTicket: ${error.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * @desc    Delete ticket (User who created it)
 * @route   DELETE /api/tickets/:id
 * @access  Private
 */
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Security Check: Only the owner of the ticket can delete it
    if (ticket.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this ticket' });
    }

    await ticket.deleteOne();
    res.json({ message: 'Ticket removed successfully' });
  } catch (error) {
    console.error(`Error in deleteTicket: ${error.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};