import mongoose from 'mongoose';

/**
 * @desc Ticket Schema linking to the User who created it
 */
const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Establishes relationship with the User collection
    },
    subject: {
      type: String,
      required: [true, 'Please add a subject for the ticket'],
    },
    description: {
      type: String,
      required: [true, 'Please enter a description'],
    },
    priority: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low',
    },
    status: {
      type: String,
      required: true,
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
      default: 'Open', // Default status for any newly created ticket
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;