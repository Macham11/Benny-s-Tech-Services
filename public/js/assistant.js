// "Ask Benny's Assistant" chat box.
// It only appears when ANTHROPIC_API_KEY is set on Vercel.
(async function () {
  try {
    const check = await fetch('/api/assistant');
    if (!check.ok) return;
    const info = await check.json();
    if (!info.enabled) return;
  } catch (error) { return; }

  const history = [];

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'assistant-button';
  button.textContent = "Ask Benny's Assistant";

  const panel = document.createElement('div');
  panel.className = 'assistant-panel';
  panel.hidden = true;

  const head = document.createElement('div');
  head.className = 'assistant-head';
  head.textContent = "Benny's Assistant";
  const close = document.createElement('button');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close chat');
  close.textContent = '\u00d7';
  head.appendChild(close);

  const log = document.createElement('div');
  log.className = 'assistant-log';

  const form = document.createElement('form');
  form.className = 'assistant-form';
  const input = document.createElement('input');
  input.type = 'text';
  input.maxLength = 500;
  input.placeholder = 'Type your question';
  input.setAttribute('aria-label', 'Your question');
  const send = document.createElement('button');
  send.type = 'submit';
  send.textContent = 'Send';
  form.append(input, send);

  panel.append(head, log, form);
  document.body.append(button, panel);

  function addMessage(text, who) {
    const p = document.createElement('p');
    p.className = 'msg ' + who;
    p.textContent = text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    return p;
  }

  addMessage('Hello! Ask me about our services. For prices, please chat with us on WhatsApp.', 'bot');

  button.addEventListener('click', function () {
    panel.hidden = !panel.hidden;
    if (!panel.hidden) input.focus();
  });
  close.addEventListener('click', function () { panel.hidden = true; });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMessage(text, 'me');
    history.push({ role: 'user', content: text });
    const waiting = addMessage('Typing...', 'bot');
    send.disabled = true;
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error');
      waiting.textContent = data.reply;
      history.push({ role: 'assistant', content: data.reply });
    } catch (error) {
      waiting.textContent = 'Sorry, I am not available right now. Please chat with us on WhatsApp.';
      history.pop();
    }
    send.disabled = false;
    log.scrollTop = log.scrollHeight;
  });
})();
