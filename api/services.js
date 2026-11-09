// GET /api/services  -> list of active services
const { supabase, sendJson } = require('./_lib');

module.exports = async function (req, res) {
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
  try {
    const rows = await supabase(
      'services?select=id,title,category,section,description,trending&active=eq.true&order=id.asc'
    );
    sendJson(res, 200, rows, 's-maxage=60, stale-while-revalidate=300');
  } catch (error) {
    sendJson(res, 500, { error: 'Could not load services' });
  }
};
