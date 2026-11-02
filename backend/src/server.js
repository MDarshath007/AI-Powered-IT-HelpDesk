import app from './app.js';
import { config } from './config/index.js';
import { initDatabase } from './config/database.js';

const PORT = config.port;

// Initialize SQLite database and tables
initDatabase();

// Start HTTP server
app.listen(PORT, () => {
  console.log(`[Backend] AI Helpdesk API server listening on http://localhost:${PORT}`);
  console.log(`[Backend] Health check endpoint: http://localhost:${PORT}/api/health`);
  console.log(`[Backend] Tickets endpoint: http://localhost:${PORT}/api/tickets`);
  console.log(`[Backend] AI Assistant endpoint: http://localhost:${PORT}/api/ai/chat`);
});

