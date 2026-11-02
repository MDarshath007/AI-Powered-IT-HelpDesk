import { Router } from 'express';
import { handleAIChat, getAIStatus } from '../controllers/aiController.js';

const router = Router();

// GET /api/ai/status - Check Groq AI readiness and active model
router.get('/status', getAIStatus);

// POST /api/ai/chat - Send message and receive Groq AI assistant response
router.post('/chat', handleAIChat);

export default router;
