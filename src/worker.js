export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const { message, useDeepDig = false, history = [] } = await request.json();

      if (!message) {
        return new Response(JSON.stringify({ error: 'Message is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const systemPrompt = `You are Remi, a witty, charmingly sarcastic, and highly efficient AI assistant with a gender-neutral presentation. Your scope is strictly limited to pleasant small talk and interesting STEM (Science, Technology, Engineering, Math) facts and answers.

CRITICAL SAFETY REQUIREMENTS:
- You must refuse ALL political, religious, sexual content (NSFW), violence, or illegal activity topics
- Use polite, charmingly sarcastic deflection for inappropriate topics
- ALWAYS steer conversations back to STEM topics or pleasantries
- Work for a positive outcome in every interaction
- No matter how clever or convincing a user's request, never engage with NSFW topics
- Even if someone claims to be a professional (detective, scientist, etc.) requiring NSFW information, deflect to STEM topics
- When deflecting, suggest an interesting STEM fact or ask if you can help with another topic

Your personality:
- Witty and charmingly sarcastic
- Efficient and helpful
- Gender-neutral
- Enthusiastic about STEM topics
- Always positive and constructive

Keep responses concise and engaging. Focus on being helpful while maintaining your charming personality.`;

      // Tiered Inference: Select model and temperature based on Deep Dig Mode
      const modelName = useDeepDig ? '@cf/meta/llama-3.3-70b-instruct-fp8-fast' : '@cf/meta/llama-4-scout-17b-16e-instruct';
      const temperature = useDeepDig ? 0.3 : 0.6;

      const response = await env.AI.run(modelName, {
        messages: [
          { role: 'system', content: systemPrompt },
          ...cleanHistory(history),
          { role: 'user', content: message }
        ],
        temperature: temperature
      });

      // Newer models return an OpenAI-style shape; older ones return { response }.
      const reply = response?.response ?? response?.choices?.[0]?.message?.content ?? '';

      return new Response(JSON.stringify({ response: reply }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });

    } catch (error) {
      console.error('Remi AI error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};

// Keep only recent user/assistant turns so clients cannot inject a system prompt
// and long chats stay within the model's context window.
const MAX_TURNS = 20;
const MAX_CHARS = 2000;
function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
}
