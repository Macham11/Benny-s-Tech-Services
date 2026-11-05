// /robots.txt (made automatically)
const { siteBase } = require('./_lib');

module.exports = function (req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ' + siteBase(req) + '/sitemap.xml\n');
};
