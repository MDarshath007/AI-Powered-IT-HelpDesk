/**
 * Controller to handle application health status check
 */
export const getHealthStatus = (req, res) => {
  return res.status(200).json({
    status: 'ok',
    message: 'AI Helpdesk Backend API is running successfully',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
};
