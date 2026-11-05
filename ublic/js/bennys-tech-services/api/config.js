// Gives the admin page the PUBLIC Supabase settings.
// The anon key is safe to share: Row Level Security protects the data.
const { config, sendJson } = require('./_lib');

module.exports = function (req, res) {
  const cfg = config();
  if (!cfg.ok) return sendJson(res, 503, { error: 'Not configured' });
  sendJson(res, 200, { url: cfg.url, anonKey: cfg.key });
};
