const CONFIG = require('./config');
const { skmdCatSlug } = require('./utils/helpers');

async function fetchAllPosts() {
  const QUERY = `
    query GetAllPosts {
      baiViets(first: 100) {
        slug
        danhmuc
        updatedAt
      }
    }
  `;

  try {
    const response = await fetch(CONFIG.HYGRAPH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY })
    });
    const json = await response.json();
    return json?.data?.baiViets || [];
  } catch (err) {
    console.error('Sitemap fetch failed', err);
    return [];
  }
}

module.exports = async function handler(req, res) {
    const domain = CONFIG.SITE_URL;
    const posts = await fetchAllPosts();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Add home and blog
    xml += `
  <url>
    <loc>${domain}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${domain}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>\n`;

    // Add posts
    for (const post of posts) {
      const catSlug = skmdCatSlug(post.danhmuc);
      xml += `  <url>\n`;
      xml += `    <loc>${domain}/${catSlug}/${post.slug}</loc>\n`;
      if (post.updatedAt) xml += `    <lastmod>${post.updatedAt.split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
    
    return res.status(200).send(xml);
}
