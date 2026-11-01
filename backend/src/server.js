import app from './app.js';
import { config } from './config/index.js';

const PORT = config.port;

// Start HTTP server
app.listen(PORT, () => {
  console.log(`[Backend] AI Helpdesk API server listening on http://localhost:${PORT}`);
  console.log(`[Backend] Health check endpoint: http://localhost:${PORT}/api/health`);
});
