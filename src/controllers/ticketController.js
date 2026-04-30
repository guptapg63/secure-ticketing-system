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

/**
 * @desc    Update ticket (Admin only)
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
      { new: true } // Returns the updated document
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