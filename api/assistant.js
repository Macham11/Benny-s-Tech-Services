// "Ask Benny's Assistant" chat box, powered by the Claude API.
// The secret key stays here on the server (ANTHROPIC_API_KEY on Vercel).
// If the key is not set, the chat box simply does not appear on the site.
const { supabase, sendJson } = require('./_lib');

const MODEL = 'claude-haiku-5-5';

const BUSINESS_FACTS = [
  "Business: Benny's Tech Services, tagline \"Your Trusted Digital Partner\".",
  'Location: Jos, Plateau State, Nigeria (no street address is published).',
  'CEO: Macham Bwehbensen Peter. CAC registration: 9278046.',
  'Phones/WhatsApp: 09039953015 and 08126406643. Email: machambwehb@gmail.com.',
  'It is a freelance and cyber cafe business.'
].join('\n');

module.exports = async function (req, res) {
  const key = process.env.ANTHROPIC_API_KEY;

  // The website asks this first, to know whether to show the chat box
  if (req.method === 'GET') return sendJson(res, 200, { enabled: Boolean(key) });
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
  if (!key) return sendJson(res, 503, { error: 'not_configured' });

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }

  let messages = Array.isArray(body.messages) ? body.messages : [];
  messages = messages
    .filter(function (m) {
      return m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string';
    })
    .map(function (m) { return { role: m.role, content: m.content.slice(0, 500) }; })
    .slice(-6);
  while (messages.length && messages[0].role !== 'user') messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return sendJson(res, 400, { error: 'Please type a question.' });
  }

  // Add the live service list so answers match the website
  let serviceList = '';
  try {
    const rows = await supabase('services?select=title&active=eq.true&order=id.asc');
    serviceList = rows.map(function (r) { return r.title; }).join(', ');
  } catch (e) { /* fine, we still answer from the facts above */ }

  const system =
    "You are Benny's Assistant, the helper on the Benny's Tech Services website.\n" +
    'Use ONLY the facts below. Never invent prices, opening hours, addresses, deadlines, ' +
    'exam rules or promises. If you do not know something, say so and ask the person to chat ' +
    'on WhatsApp (09039953015). Answer in short, simple English.\n\n' +
    BUSINESS_FACTS +
    (serviceList ? '\nServices listed on the website: ' + serviceList + '.' : '');

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 400, system: system, messages: messages })
    });
    if (!response.ok) throw new Error('Claude API error ' + response.status);
    const data = await response.json();
    const reply = (data.content || [])
      .filter(function (block) { return block.type === 'text'; })
      .map(function (block) { return block.text; })
      .join('\n')
      .trim();
    sendJson(res, 200, { reply: reply || 'Please chat with us on WhatsApp.' });
  } catch (error) {
    sendJson(res, 500, { error: 'The assistant is not available right now.' });
  }
};
