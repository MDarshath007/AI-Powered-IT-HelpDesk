import { generateAIResponse, isGroqConfigured } from '../services/aiService.js';
import { config } from '../config/index.js';

/**
 * GET /api/ai/status
 * Check if the AI Assistant is configured and ready.
 */
export const getAIStatus = (req, res) => {
  return res.status(200).json({
    success: true,
    configured: isGroqConfigured(),
    model: config.groqModel || 'openai/gpt-oss-120b',
  });
};

/**
 * POST /api/ai/chat
 * Handle incoming conversational queries from the frontend.
 * Body: { message: string, conversation?: Array<{role: string, content: string}> }
 */
export const handleAIChat = async (req, res, next) => {
  try {
    const { message, conversation } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Field "message" is required and cannot be empty.',
      });
    }

    if (!isGroqConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'GROQ_API_KEY_MISSING',
        message:
          'Groq API key is not configured. Please add GROQ_API_KEY in backend/.env to enable the AI Helpdesk Assistant.',
      });
    }

    const { reply, model, usage } = await generateAIResponse(
      Array.isArray(conversation) ? conversation : [],
      message
    );

    return res.status(200).json({
      success: true,
      reply,
      model,
      usage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Handle Groq specific error statuses
    if (error.status === 401 || error.message?.includes('API key')) {
      return res.status(401).json({
        success: false,
        error: 'INVALID_API_KEY',
        message: 'The provided GROQ_API_KEY is invalid or expired. Please check backend/.env.',
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Groq API rate limit reached. Please wait a moment before asking another question.',
      });
    }

    next(error);
  }
};
