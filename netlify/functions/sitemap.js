var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// netlify/functions/render-article/config/index.js
var require_config = __commonJS({
  "netlify/functions/render-article/config/index.js"(exports2, module2) {
    var path = require("path");
    var CONFIG2 = {
      SITE_URL: "https://songkhoemoingay24h.netlify.app",
      HYGRAPH_URL: "https://ap-south-1.cdn.hygraph.com/content/cmrezpq25018t07walir17znu/master",
      DEFAULT_TITLE: "S\u1ED1ng Kh\u1ECFe M\u1ED7i Ng\xE0y",
      DEFAULT_DESCRIPTION: "C\u1EADp nh\u1EADt ki\u1EBFn th\u1EE9c y t\u1EBF, s\u1EE9c kh\u1ECFe sinh s\u1EA3n, nam khoa, ph\u1EE5 khoa, \u0111\xECnh ch\u1EC9 thai, v\xE0 b\u1EC7nh tr\u0129 uy t\xEDn, ch\xEDnh x\xE1c.",
      DEFAULT_OG_IMAGE: "https://songkhoemoingay24h.netlify.app/favicon_46ozzcminjco6vl4qpkay.svg",
      TITLE_SUFFIX: " | S\u1ED1ng Kh\u1ECFe M\u1ED7i Ng\xE0y",
      CACHE_TIME: {
        S_MAXAGE: 3600,
        // 1 hour at CDN edge
        STALE_WHILE_REVALIDATE: 86400
        // 24 hours stale allowed while revalidating
      },
      TIMEOUT_MS: 5e3,
      RETRY_LIMIT: 2,
      HTML_TEMPLATE_PATH: path.join(__dirname, "../../../../chi-tiet-bai-viet.html")
    };
    module2.exports = CONFIG2;
  }
});

// netlify/functions/sitemap.js
var CONFIG = require_config();
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
    const res = await fetch(CONFIG.HYGRAPH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: QUERY })
    });
    const json = await res.json();
    return json?.data?.baiViets || [];
  } catch (err) {
    console.error("Sitemap fetch failed", err);
    return [];
  }
}
function skmdCatSlug(cat) {
  if (!cat) return "tin-tuc";
  const c = cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (c.includes("kienthuc") || c.includes("kien thuc")) return "kien-thuc-can-biet";
  if (c.includes("tri")) return "tri";
  if (c.includes("thai")) return "dinh-chi-thai";
  if (c.includes("quydau") || c.includes("quy dau")) return "bao-quy-dau";
  return "tin-tuc";
}
exports.handler = async function(event, context) {
  const domain = CONFIG.SITE_URL;
  const posts = await fetchAllPosts();
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
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
  </url>
`;
  for (const post of posts) {
    const catSlug = skmdCatSlug(post.danhmuc);
    xml += `  <url>
`;
    xml += `    <loc>${domain}/${catSlug}/${post.slug}</loc>
`;
    if (post.updatedAt) xml += `    <lastmod>${post.updatedAt.split("T")[0]}</lastmod>
`;
    xml += `    <changefreq>weekly</changefreq>
`;
    xml += `    <priority>0.8</priority>
`;
    xml += `  </url>
`;
  }
  xml += `</urlset>`;
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
    },
    body: xml
  };
};
