import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

// Initialize Express application
const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/tickets', ticketRoutes);

// Catch-all 404 for undefined routes
app.use(notFoundHandler);

// Central error handler
app.use(errorHandler);

export default app;
