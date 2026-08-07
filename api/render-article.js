const { getArticleBySlug } = require('./providers/hygraph');
const { normalizeArticle } = require('./normalizers/article');
const { buildSeoHead } = require('./builders/seo');
const { buildSchemaScript } = require('./builders/schema');
const { renderHtml } = require('./renderers/template');
const CONFIG = require('./config');

const fs = require('fs');
const path = require('path');

function buildErrorResponse(res, statusCode, message) {
    if (statusCode === 404) {
        try {
            const page404 = fs.readFileSync(path.join(__dirname, '../404.html'), 'utf8');
            return res.status(404).setHeader('Content-Type', 'text/html; charset=utf-8').send(page404);
        } catch(e) {
            console.error("Failed to load 404.html", e);
        }
    }
    return res.status(statusCode).send(`<h1>${statusCode} - ${message}</h1><p>Vui lòng thử lại sau.</p>`);
}

module.exports = async function handler(req, res) {
    const startTime = Date.now();
    let slug = req.query.slug;

    // Vercel rewrites might pass slug differently, or we can parse req.url
    if (!slug) {
        // e.g. /api/render-article?slug=abc or from rewrite /kien-thuc-can-biet/abc
        const parts = req.url.split('?')[0].split('/').filter(Boolean);
        slug = parts[parts.length - 1]; // last segment
    }

    if (!slug || slug === 'render-article') {
        return buildErrorResponse(res, 400, "Thiếu tham số Slug");
    }

    try {
        const rawArticle = await getArticleBySlug(slug);

        if (!rawArticle) {
            return buildErrorResponse(res, 404, "Không tìm thấy bài viết");
        }

        const article = normalizeArticle(rawArticle);
        const seoHeadStr = buildSeoHead(article);
        const schemaScriptStr = buildSchemaScript(article);
        const finalHtml = renderHtml(article, seoHeadStr, schemaScriptStr);

        const latency = Date.now() - startTime;
        console.log(JSON.stringify({
            timestamp: new Date().toISOString(),
            level: 'INFO',
            slug,
            type: 'article',
            status: 200,
            latency_ms: latency
        }));

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('X-Render-Mode', 'Vercel-SSR');
        res.setHeader('X-Latency-Ms', latency.toString());
        res.setHeader('Cache-Control', `public, max-age=0, s-maxage=${CONFIG.CACHE_TIME.S_MAXAGE}, stale-while-revalidate=${CONFIG.CACHE_TIME.STALE_WHILE_REVALIDATE}`);
        
        return res.status(200).send(finalHtml);
    } catch (error) {
        console.error("Vercel Function Crash:", error.stack);
        return res.status(503).send(`<h1>503 - Dịch vụ tạm thời gián đoạn</h1><p>Vui lòng thử lại sau.</p><pre style="background:#eee;padding:15px;overflow:auto;">${error.stack}</pre>`);
    }
}
