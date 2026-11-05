// /sitemap.xml (made automatically, uses your real domain)
const { supabase, siteBase } = require('./_lib');

const PAGES = ['', 'services', 'cyber-cafe', 'business-centre', 'scratch-cards',
  'training', 'news', 'about', 'contact', 'privacy-policy', 'terms-of-use'];

module.exports = async function (req, res) {
  const base = siteBase(req);
  const urls = PAGES.map(function (p) { return base + '/' + p; });
  try {
    const posts = await supabase('posts?select=slug&published=eq.true');
    (posts || []).forEach(function (p) {
      urls.push(base + '/post?slug=' + encodeURIComponent(p.slug));
    });
  } catch (error) { /* posts are optional in the sitemap */ }

  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(function (u) {
      return '  <url><loc>' + u.replace(/&/g, '&amp;') + '</loc></url>';
    }).join('\n') + '\n</urlset>';

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600');
  res.end(xml);
};
