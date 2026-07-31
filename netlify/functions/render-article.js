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
      HTML_TEMPLATE_PATH: path.join(__dirname, "../../chi-tiet-bai-viet.html")
    };
    module2.exports = CONFIG2;
  }
});

// netlify/functions/render-article/utils/helpers.js
var require_helpers = __commonJS({
  "netlify/functions/render-article/utils/helpers.js"(exports2, module2) {
    function skmdCatSlug(cat) {
      if (!cat) return "tin-tuc";
      const c = cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (c.includes("kienthuc") || c.includes("kien thuc")) return "kien-thuc-can-biet";
      if (c.includes("tri")) return "tri";
      if (c.includes("thai")) return "dinh-chi-thai";
      if (c.includes("quydau") || c.includes("quy dau")) return "bao-quy-dau";
      return "tin-tuc";
    }
    function skmdCatName(cat) {
      if (!cat) return "S\u1EE9c Kh\u1ECFe";
      if (cat === "KienThuc" || cat.toLowerCase().includes("kienthuc") || cat.toLowerCase().includes("kien thuc")) return "Ki\u1EBFn th\u1EE9c c\u1EA7n bi\u1EBFt";
      if (cat === "DinhChiThai" || cat.toLowerCase().includes("thai")) return "\u0110\xECnh ch\u1EC9 thai";
      if (cat === "Tri" || cat.toLowerCase().includes("tri")) return "B\u1EC7nh Tr\u0129";
      if (cat === "BaoQuyDau" || cat.toLowerCase().includes("quy dau") || cat.toLowerCase().includes("quydau")) return "Bao quy \u0111\u1EA7u";
      return "S\u1EE9c Kh\u1ECFe";
    }
    function normalizeSlug(slug) {
      if (!slug) return "";
      return slug.toLowerCase().trim().replace(/\/+$/, "");
    }
    function escapeHtml(unsafe) {
      if (!unsafe) return "";
      return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
    module2.exports = {
      skmdCatSlug,
      skmdCatName,
      normalizeSlug,
      escapeHtml
    };
  }
});

// netlify/functions/render-article/middleware/validator.js
var require_validator = __commonJS({
  "netlify/functions/render-article/middleware/validator.js"(exports2, module2) {
    var { normalizeSlug } = require_helpers();
    function validateSlug2(event) {
      const pathParts = event.path.split("/").filter(Boolean);
      let rawSlug = pathParts.pop();
      const cleanSlug = normalizeSlug(rawSlug);
      if (!cleanSlug) {
        throw new Error("ValidationError: Missing or invalid slug");
      }
      return cleanSlug;
    }
    module2.exports = {
      validateSlug: validateSlug2
    };
  }
});

// netlify/functions/render-article/middleware/logger.js
var require_logger = __commonJS({
  "netlify/functions/render-article/middleware/logger.js"(exports2, module2) {
    function logInfo2(payload) {
      const logEntry = {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        level: "INFO",
        ...payload
      };
      console.log(JSON.stringify(logEntry));
    }
    function logError2(payload) {
      const logEntry = {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        level: "ERROR",
        ...payload
      };
      console.error(JSON.stringify(logEntry));
    }
    module2.exports = {
      logInfo: logInfo2,
      logError: logError2
    };
  }
});

// netlify/functions/render-article/providers/hygraph.js
var require_hygraph = __commonJS({
  "netlify/functions/render-article/providers/hygraph.js"(exports2, module2) {
    var CONFIG2 = require_config();
    async function fetchWithTimeout(resource, options = {}) {
      const { timeout = CONFIG2.TIMEOUT_MS } = options;
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      try {
        const response = await fetch(resource, {
          ...options,
          signal: controller.signal
        });
        clearTimeout(id);
        return response;
      } catch (error) {
        clearTimeout(id);
        throw error;
      }
    }
    async function fetchHygraphWithRetry(query, variables = {}, retries = CONFIG2.RETRY_LIMIT) {
      let attempt = 0;
      while (attempt <= retries) {
        try {
          const response = await fetchWithTimeout(CONFIG2.HYGRAPH_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({ query, variables })
          });
          if (!response.ok) {
            throw new Error(`Hygraph API returned HTTP ${response.status}`);
          }
          const json = await response.json();
          if (json.errors) {
            throw new Error(`GraphQL Error: ${json.errors.map((e) => e.message).join(", ")}`);
          }
          return json.data;
        } catch (error) {
          attempt++;
          if (attempt > retries) {
            throw error;
          }
          const delay = Math.pow(2, attempt - 1) * 500;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    async function fetchArticle2(slug) {
      const QUERY = `
    query getArticle($slug: String!) {
        baiViets(where: {slug: $slug}, first: 1) {
            id
            title
            slug
            danhmuc
            createdAt
            updatedAt
            tomtat
            noiDung {
                html
            }
            tacGia
            anh {
                url
            }
        }
    }
    `;
      const data = await fetchHygraphWithRetry(QUERY, { slug });
      return data.baiViets && data.baiViets.length > 0 ? data.baiViets[0] : null;
    }
    module2.exports = {
      fetchArticle: fetchArticle2
    };
  }
});

// netlify/functions/render-article/normalizers/article.js
var require_article = __commonJS({
  "netlify/functions/render-article/normalizers/article.js"(exports2, module2) {
    var CONFIG2 = require_config();
    var { skmdCatSlug, skmdCatName } = require_helpers();
    function normalizeArticle2(rawData) {
      if (!rawData) return null;
      const catSlug = skmdCatSlug(rawData.danhmuc);
      const catName = skmdCatName(rawData.danhmuc);
      const title = rawData.title || CONFIG2.DEFAULT_TITLE;
      const excerpt = rawData.tomtat || CONFIG2.DEFAULT_DESCRIPTION;
      const author = rawData.tacGia || "Ban Bi\xEAn T\u1EADp";
      const imageUrl = rawData.anh && rawData.anh.url ? rawData.anh.url : CONFIG2.DEFAULT_OG_IMAGE;
      const contentHtml = rawData.noiDung && rawData.noiDung.html ? rawData.noiDung.html : "";
      const publishedAt = rawData.createdAt ? new Date(rawData.createdAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
      const modifiedAt = rawData.updatedAt ? new Date(rawData.updatedAt).toISOString() : publishedAt;
      const fullUrl = `${CONFIG2.SITE_URL}/${catSlug}/${rawData.slug}`;
      return {
        id: rawData.slug,
        slug: rawData.slug,
        title,
        excerpt,
        contentHtml,
        author,
        imageUrl,
        publishedAt,
        modifiedAt,
        category: {
          slug: catSlug,
          name: catName,
          url: `${CONFIG2.SITE_URL}/${catSlug}`
        },
        url: fullUrl,
        raw: rawData
        // Preserve raw data for hydration
      };
    }
    module2.exports = {
      normalizeArticle: normalizeArticle2
    };
  }
});

// netlify/functions/render-article/builders/seo.js
var require_seo = __commonJS({
  "netlify/functions/render-article/builders/seo.js"(exports2, module2) {
    var CONFIG2 = require_config();
    var { escapeHtml } = require_helpers();
    function buildSeoHead2(article) {
      const title = escapeHtml(`${article.title}${CONFIG2.TITLE_SUFFIX}`);
      const description = escapeHtml(article.excerpt);
      const url = escapeHtml(article.url);
      const imageUrl = escapeHtml(article.imageUrl);
      return `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${url}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    
    <!-- Open Graph -->
    <meta property="og:locale" content="vi_VN" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:site_name" content="${escapeHtml(CONFIG2.DEFAULT_TITLE)}" />
    <meta property="article:published_time" content="${article.publishedAt}" />
    <meta property="article:modified_time" content="${article.modifiedAt}" />
    <meta property="og:image" content="${imageUrl}" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    `;
    }
    module2.exports = {
      buildSeoHead: buildSeoHead2
    };
  }
});

// netlify/functions/render-article/builders/schema.js
var require_schema = __commonJS({
  "netlify/functions/render-article/builders/schema.js"(exports2, module2) {
    var CONFIG2 = require_config();
    function buildSchemaGraph(article) {
      const domain = CONFIG2.SITE_URL;
      const authorId = `${domain}/chuyen-gia/${article.author.toLowerCase().replace(/\s+/g, "-")}`;
      return {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${domain}/#organization`,
            "name": CONFIG2.DEFAULT_TITLE,
            "url": domain,
            "logo": {
              "@type": "ImageObject",
              "url": CONFIG2.DEFAULT_OG_IMAGE
            }
          },
          {
            "@type": "WebSite",
            "@id": `${domain}/#website`,
            "url": domain,
            "name": CONFIG2.DEFAULT_TITLE,
            "publisher": {
              "@id": `${domain}/#organization`
            }
          },
          {
            "@type": "ImageObject",
            "@id": `${article.url}#primaryimage`,
            "url": article.imageUrl
          },
          {
            "@type": "WebPage",
            "@id": `${article.url}#webpage`,
            "url": article.url,
            "name": article.title,
            "isPartOf": {
              "@id": `${domain}/#website`
            },
            "primaryImageOfPage": {
              "@id": `${article.url}#primaryimage`
            },
            "datePublished": article.publishedAt,
            "dateModified": article.modifiedAt,
            "description": article.excerpt,
            "breadcrumb": {
              "@id": `${article.url}#breadcrumb`
            }
          },
          {
            "@type": "BreadcrumbList",
            "@id": `${article.url}#breadcrumb`,
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Trang ch\u1EE7",
                "item": domain
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": `${domain}/blog`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": article.category.name,
                "item": article.category.url
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": article.title,
                "item": article.url
              }
            ]
          },
          {
            "@type": "Article",
            "@id": `${article.url}#article`,
            "isPartOf": {
              "@id": `${article.url}#webpage`
            },
            "author": {
              "@type": "Person",
              "name": article.author,
              "@id": authorId
            },
            "publisher": {
              "@id": `${domain}/#organization`
            },
            "headline": article.title,
            "datePublished": article.publishedAt,
            "dateModified": article.modifiedAt,
            "mainEntityOfPage": {
              "@id": `${article.url}#webpage`
            },
            "image": {
              "@id": `${article.url}#primaryimage`
            }
          }
        ]
      };
    }
    function buildSchemaScript2(article) {
      const schema = buildSchemaGraph(article);
      return `<script id="skmd-schema-graph" type="application/ld+json">${JSON.stringify(schema)}</script>`;
    }
    module2.exports = {
      buildSchemaScript: buildSchemaScript2
    };
  }
});

// netlify/functions/render-article/renderers/template.js
var require_template = __commonJS({
  "netlify/functions/render-article/renderers/template.js"(exports2, module2) {
    var fs = require("fs");
    var CONFIG2 = require_config();
    var cachedTemplate = null;
    function getTemplate() {
      if (cachedTemplate) return cachedTemplate;
      try {
        cachedTemplate = fs.readFileSync(CONFIG2.HTML_TEMPLATE_PATH, "utf8");
        return cachedTemplate;
      } catch (err) {
        console.error("Error loading HTML template:", err);
        throw new Error("Template loading failed");
      }
    }
    function renderHtml2(article, seoHeadStr, schemaScriptStr) {
      let html = getTemplate();
      const safeJson = JSON.stringify(article.raw).replace(/</g, "\\u003c");
      const hydrationScript = `<script>window.__ARTICLE_DATA__ = ${safeJson};</script>`;
      html = html.replace(/<title>.*?<\/title>/gi, "");
      const injectionBlock = `
    ${seoHeadStr}
    ${schemaScriptStr}
    ${hydrationScript}
    `;
      html = injectionBlock + html;
      const contentToInject = `<div class="post-content" id="skmd-html-content">${article.contentHtml}</div>`;
      html = html.replace(/<div class="post-content" id="skmd-html-content">.*?<\/div>/is, contentToInject);
      return html;
    }
    module2.exports = {
      renderHtml: renderHtml2
    };
  }
});

// netlify/functions/render-article/index.js
var CONFIG = require_config();
var { validateSlug } = require_validator();
var { logInfo, logError } = require_logger();
var { fetchArticle } = require_hygraph();
var { normalizeArticle } = require_article();
var { buildSeoHead } = require_seo();
var { buildSchemaScript } = require_schema();
var { renderHtml } = require_template();
if (!CONFIG.HYGRAPH_URL) {
  throw new Error("FATAL: HYGRAPH_URL config is missing");
}
function buildResponse(statusCode, body, extraHeaders = {}) {
  const headers = {
    "Content-Type": "text/html; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Render-Mode": "SSR",
    ...extraHeaders
  };
  if (statusCode === 200) {
    headers["Cache-Control"] = `public, max-age=0, s-maxage=${CONFIG.CACHE_TIME.S_MAXAGE}, stale-while-revalidate=${CONFIG.CACHE_TIME.STALE_WHILE_REVALIDATE}`;
  } else {
    headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
  }
  return {
    statusCode,
    headers,
    body
  };
}
exports.handler = async function(event, context) {
  const startTime = Date.now();
  let slug = "";
  try {
    if (event.path === "/health" || event.path === "/.netlify/functions/render-article/health") {
      return {
        statusCode: 200,
        body: "OK",
        headers: { "Content-Type": "text/plain" }
      };
    }
    slug = validateSlug(event);
    const rawArticle = await fetchArticle(slug);
    if (!rawArticle) {
      logInfo({ slug, type: "article", status: 404, latency_ms: Date.now() - startTime });
      return buildResponse(404, "<h1>404 - Kh\xF4ng t\xECm th\u1EA5y b\xE0i vi\u1EBFt</h1><p>B\xE0i vi\u1EBFt b\u1EA1n y\xEAu c\u1EA7u kh\xF4ng t\u1ED3n t\u1EA1i.</p>");
    }
    const article = normalizeArticle(rawArticle);
    const seoHeadHtml = buildSeoHead(article);
    const schemaScriptHtml = buildSchemaScript(article);
    const finalHtml = renderHtml(article, seoHeadHtml, schemaScriptHtml);
    const latency = Date.now() - startTime;
    logInfo({ slug, type: "article", status: 200, latency_ms: latency, cache_status: "MISS" });
    return buildResponse(200, finalHtml, { "X-Latency-Ms": latency.toString() });
  } catch (error) {
    const latency = Date.now() - startTime;
    logError({ slug, type: "article", status: 503, error: error.message, stack: error.stack, latency_ms: latency });
    if (error.message.includes("ValidationError")) {
      return buildResponse(400, "<h1>400 - Y\xEAu c\u1EA7u kh\xF4ng h\u1EE3p l\u1EC7</h1>");
    }
    return buildResponse(503, "<h1>503 - D\u1ECBch v\u1EE5 t\u1EA1m th\u1EDDi gi\xE1n \u0111o\u1EA1n</h1><p>Vui l\xF2ng th\u1EED l\u1EA1i sau.</p>");
  }
};
