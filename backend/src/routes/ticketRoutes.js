import { Router } from 'express';
import {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicketStatus,
  deleteTicket,
} from '../controllers/ticketController.js';

const router = Router();

// Retrieve all tickets
router.get('/', getAllTickets);

// Retrieve a single ticket by id
router.get('/:id', getTicketById);

// Create a new ticket
router.post('/', createTicket);

// Update ticket status
router.patch('/:id', updateTicketStatus);

// Delete a ticket
router.delete('/:id', deleteTicket);

export default router;
