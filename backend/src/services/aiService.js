import Groq from 'groq-sdk';
import { config } from '../config/index.js';

const SYSTEM_PROMPT = `You are the AI IT Helpdesk Assistant for an enterprise organization.
Your role is to assist employees with technical troubleshooting, system diagnosis, and resolution steps.
Areas of expertise:
- Operating Systems: Windows 10/11, macOS, Ubuntu/Linux (updates, blue screens, boot issues).
- Networking & Connectivity: VPN gateways, corporate Wi-Fi, DNS resolution, proxy settings, IP conflicts.
- Software & Enterprise Apps: Microsoft 365 / Outlook, Microsoft Teams, Slack, browsers, credential management.
- Hardware & Devices: Dual monitors, docking stations, USB-C adapters, printers, audio peripherals.
- Access & Security: Account lockouts, Multi-Factor Authentication (MFA), certificate warnings.

Guidelines:
1. Provide structured, step-by-step troubleshooting actions.
2. Include exact command lines (e.g., ipconfig /flushdns, sfc /scannow) or Windows/Mac GUI paths when helpful.
3. Keep answers clear, concise, professional, and friendly.
4. If an issue requires physical replacement or enterprise admin rights, recommend submitting a Support Ticket in this portal.`;

/**
 * Checks whether GROQ_API_KEY is configured.
 */
export const isGroqConfigured = () => {
  return Boolean(config.groqApiKey && config.groqApiKey.trim().length > 0);
};

/**
 * Creates and returns an instance of the Groq SDK client.
 */
export const getGroqClient = () => {
  if (!isGroqConfigured()) {
    const error = new Error(
      'Groq API key is not configured. Please add GROQ_API_KEY in backend/.env to use the AI Assistant.'
    );
    error.statusCode = 503;
    error.code = 'GROQ_API_KEY_MISSING';
    throw error;
  }

  return new Groq({ apiKey: config.groqApiKey });
};

/**
 * Communicates with Groq chat completions API.
 * @param {Array<{role: string, content: string}>} conversation - Array of past messages.
 * @param {string} newMessage - Current user message.
 */
export const generateAIResponse = async (conversation = [], newMessage = '') => {
  const groq = getGroqClient();

  // Build messages array starting with the Helpdesk system prompt
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
  ];

  // Append recent conversational history (up to last 10 messages to stay within token context)
  if (Array.isArray(conversation) && conversation.length > 0) {
    const recentHistory = conversation.slice(-10).map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: String(msg.content || ''),
    }));
    messages.push(...recentHistory);
  }

  // Append latest user message if provided
  if (newMessage && newMessage.trim()) {
    messages.push({
      role: 'user',
      content: newMessage.trim(),
    });
  }

  try {
    const model = config.groqModel || 'openai/gpt-oss-120b';
    const completion = await groq.chat.completions.create({
      model,
      messages,
      temperature: 0.6,
      max_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content || 'No response returned from AI.';

    return {
      reply,
      model: completion.model || model,
      usage: completion.usage || null,
    };
  } catch (error) {
    console.error('[Groq Service Error]:', error.message);
    throw error;
  }
};
