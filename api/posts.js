// GET /api/posts            -> all published news posts
// GET /api/posts?slug=abc   -> one post
const { supabase, sendJson } = require('./_lib');

module.exports = async function (req, res) {
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
  try {
    let query = 'posts?select=id,title,slug,content,created_at&published=eq.true&order=created_at.desc';
    const slug = req.query && req.query.slug;
    if (slug) {
      if (!/^[a-z0-9-]+$/.test(slug)) return sendJson(res, 400, { error: 'Bad slug' });
      query += '&slug=eq.' + encodeURIComponent(slug);
    }
    const rows = await supabase(query);
    sendJson(res, 200, rows, 's-maxage=60, stale-while-revalidate=300');
  } catch (error) {
    sendJson(res, 500, { error: 'Could not load posts' });
  }
};
