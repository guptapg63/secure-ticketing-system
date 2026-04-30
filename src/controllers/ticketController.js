import Ticket from '../models/Ticket.js';

/**
 * @desc    Create a new support ticket
 * @route   POST /api/tickets
 * @access  Private
 */
export const createTicket = async (req, res) => {
  const { subject, description, priority } = req.body;

  try {
    if (!subject || !description) {
      return res.status(400).json({ message: 'Subject and description are required' });
    }

    const ticket = await Ticket.create({
      user: req.user._id, 
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
    const tickets = await Ticket.find({ user: req.user._id });
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
    // Fetch all tickets and populate the user details (name and email)
    const tickets = await Ticket.find({}).populate('user', 'name email');
    res.json(tickets);
  } catch (error) {
    console.error(`Error in getAllTickets: ${error.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};