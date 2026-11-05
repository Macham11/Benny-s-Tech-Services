// POST /api/enquiry -> saves a customer enquiry in Supabase
const { supabase, sendJson } = require('./_lib');

function clean(value, max) {
  return String(value || '').trim().slice(0, max);
}

module.exports = async function (req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }

  // Hidden "website" field: real people leave it empty, spam bots fill it
  if (body.website) return sendJson(res, 200, { ok: true });

  const row = {
    name: clean(body.name, 100),
    phone: clean(body.phone, 30),
    service: clean(body.service, 150),
    message: clean(body.message, 1000)
  };

  if (!row.service && !row.message) {
    return sendJson(res, 400, { error: 'Please tell us what you need.' });
  }
  if (row.phone && !/^[0-9+()\s-]{7,20}$/.test(row.phone)) {
    return sendJson(res, 400, { error: 'Please enter a valid phone number.' });
  }

  try {
    await supabase('enquiries', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: row
    });
    sendJson(res, 201, { ok: true });
  } catch (error) {
    sendJson(res, 500, { error: 'Could not save your enquiry. Please use WhatsApp.' });
  }
};
