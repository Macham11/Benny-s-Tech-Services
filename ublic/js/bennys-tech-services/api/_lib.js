// Shared helpers for all backend functions.
// Files starting with "_" are NOT public endpoints on Vercel.

function config() {
  const url = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const key = process.env.SUPABASE_ANON_KEY || '';
  return { url: url, key: key, ok: Boolean(url && key) };
}

// Talk to the Supabase database (REST). Uses only the public "anon" key,
// so Row Level Security in Supabase decides what is allowed.
async function supabase(path, options) {
  const cfg = config();
  if (!cfg.ok) throw new Error('Supabase is not configured');
  options = options || {};
  const response = await fetch(cfg.url + '/rest/v1/' + path, {
    method: options.method || 'GET',
    headers: Object.assign(
      {
        apikey: cfg.key,
        Authorization: 'Bearer ' + cfg.key,
        'Content-Type': 'application/json'
      },
      options.headers || {}
    ),
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  if (!response.ok) throw new Error('Supabase error ' + response.status);
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function sendJson(res, status, data, cache) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (cache) res.setHeader('Cache-Control', cache);
  res.end(JSON.stringify(data));
}

function siteBase(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return proto + '://' + host;
}

module.exports = { config, supabase, sendJson, siteBase };
