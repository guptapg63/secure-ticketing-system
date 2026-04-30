import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

// 1. Import the custom error handling middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

const app = express();

// Standard middleware for security and parsing
app.use(helmet());
app.use(cors());
app.use(express.json());

// Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// Base route (Health Check)
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Secure Ticketing System API is active' });
});

// ----------------------------------------------------
// 2. ERROR HANDLING MIDDLEWARE
// Note: These must ALWAYS be the last middleware used, 
// strictly after all standard routes are defined.
// ----------------------------------------------------
app.use(notFound);       // Catches requests to invalid URLs (404)
app.use(errorHandler);   // Formats all server/logic errors into clean JSON

export default app;