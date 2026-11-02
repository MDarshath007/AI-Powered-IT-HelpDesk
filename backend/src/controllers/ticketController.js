import { db } from '../config/database.js';

// Allowed enum values for ticket priority and status
const VALID_PRIORITIES = ['low', 'medium', 'high'];
const VALID_STATUSES = ['open', 'in_progress', 'resolved'];

/**
 * GET /api/tickets
 * Retrieve all support tickets.
 * Supports optional query filtering by status, priority, or category.
 */
export const getAllTickets = (req, res, next) => {
  try {
    const { status, priority, category } = req.query;

    const conditions = [];
    const params = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status.toLowerCase());
    }

    if (priority) {
      conditions.push('priority = ?');
      params.push(priority.toLowerCase());
    }

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM tickets ${whereClause} ORDER BY created_at DESC, id DESC`;

    const tickets = db.prepare(sql).all(...params);

    return res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tickets/:id
 * Retrieve a single ticket by its ID.
 */
export const getTicketById = (req, res, next) => {
  try {
    const ticketId = Number(req.params.id);

    if (!Number.isInteger(ticketId) || ticketId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ticket ID. Ticket ID must be a positive integer.',
      });
    }

    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `Ticket not found with id ${ticketId}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tickets
 * Create a new support ticket.
 * Required fields: title, description, category, priority
 * Optional field: status (defaults to 'open')
 */
export const createTicket = (req, res, next) => {
  try {
    const { title, description, category, priority, status } = req.body;

    // Validate title
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Field "title" is required and cannot be empty.',
      });
    }

    // Validate description
    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Field "description" is required and cannot be empty.',
      });
    }

    // Validate category
    if (!category || typeof category !== 'string' || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Field "category" is required and cannot be empty.',
      });
    }

    // Validate priority
    if (!priority || typeof priority !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Field "priority" is required. Allowed values: low, medium, high.',
      });
    }

    const normalizedPriority = priority.trim().toLowerCase();
    if (!VALID_PRIORITIES.includes(normalizedPriority)) {
      return res.status(400).json({
        success: false,
        message: `Invalid priority "${priority}". Allowed values: ${VALID_PRIORITIES.join(', ')}.`,
      });
    }

    // Validate status (optional, defaults to 'open')
    let normalizedStatus = 'open';
    if (status !== undefined) {
      if (typeof status !== 'string') {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}.`,
        });
      }
      normalizedStatus = status.trim().toLowerCase();
      if (!VALID_STATUSES.includes(normalizedStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status "${status}". Allowed values: ${VALID_STATUSES.join(', ')}.`,
        });
      }
    }

    // Insert new ticket using parameterized query
    const insertStmt = db.prepare(`
      INSERT INTO tickets (title, description, category, priority, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    const result = insertStmt.run(
      title.trim(),
      description.trim(),
      category.trim(),
      normalizedPriority,
      normalizedStatus
    );

    // Fetch the newly created record
    const createdTicket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(result.lastInsertRowid);

    return res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: createdTicket,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/tickets/:id
 * Update status for an existing ticket.
 * Required field in body: status ('open', 'in_progress', 'resolved')
 */
export const updateTicketStatus = (req, res, next) => {
  try {
    const ticketId = Number(req.params.id);

    if (!Number.isInteger(ticketId) || ticketId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ticket ID. Ticket ID must be a positive integer.',
      });
    }

    const { status } = req.body;

    if (!status || typeof status !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Field "status" is required. Allowed values: open, in_progress, resolved.',
      });
    }

    const normalizedStatus = status.trim().toLowerCase();
    if (!VALID_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status "${status}". Allowed values: ${VALID_STATUSES.join(', ')}.`,
      });
    }

    // Check if the ticket exists
    const existingTicket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId);
    if (!existingTicket) {
      return res.status(404).json({
        success: false,
        message: `Ticket not found with id ${ticketId}`,
      });
    }

    // Update ticket status and updated_at timestamp
    const updateStmt = db.prepare(`
      UPDATE tickets
      SET status = ?, updated_at = datetime('now')
      WHERE id = ?
    `);

    updateStmt.run(normalizedStatus, ticketId);

    const updatedTicket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId);

    return res.status(200).json({
      success: true,
      message: 'Ticket status updated successfully',
      data: updatedTicket,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/tickets/:id
 * Delete a ticket by its ID.
 */
export const deleteTicket = (req, res, next) => {
  try {
    const ticketId = Number(req.params.id);

    if (!Number.isInteger(ticketId) || ticketId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ticket ID. Ticket ID must be a positive integer.',
      });
    }

    // Check if ticket exists before deleting
    const existingTicket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId);
    if (!existingTicket) {
      return res.status(404).json({
        success: false,
        message: `Ticket not found with id ${ticketId}`,
      });
    }

    // Delete ticket using parameterized query
    db.prepare('DELETE FROM tickets WHERE id = ?').run(ticketId);

    return res.status(200).json({
      success: true,
      message: `Ticket with id ${ticketId} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
