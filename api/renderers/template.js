const path = require('path');
const fs = require('fs');
const CONFIG = require('../config');

// In-memory cache for the template during warm lambda execution
let cachedTemplate = null;

function getTemplate() {
    if (cachedTemplate) return cachedTemplate;
    try {
        // Must use path.join(__dirname) directly inside readFileSync for Vercel NFT to bundle it
        cachedTemplate = fs.readFileSync(path.join(__dirname, '../../chi-tiet-bai-viet.html'), 'utf8');
        return cachedTemplate;
    } catch (err) {
        console.error("Template loading failed", err);
        throw new Error("Template loading failed");
    }
}

/**
 * Injects SEO, Schema, and Content into the HTML template
 */
function renderHtml(article, seoHeadStr, schemaScriptStr) {
    let html = getTemplate();

    // Prepend the SEO head, schema, and hydration script at the very top.
    const safeJson = JSON.stringify(article.raw).replace(/</g, '\\u003c');
    const hydrationScript = `<script>window.__ARTICLE_DATA__ = ${safeJson};</script>`;
    
    // Remove existing title if any
    html = html.replace(/<title>.*?<\/title>/gi, '');

    const injectionBlock = `
    ${seoHeadStr}
    ${schemaScriptStr}
    ${hydrationScript}
    `;

    // Inject inside <head>
    html = html.replace('</head>', injectionBlock + '\n</head>');

    // Inject Content
    const contentToInject = `<article class="art-content" id="skmd-html-content">${article.contentHtml}</article>`;
    html = html.replace(/<article class="art-content" id="skmd-html-content">.*?<\/article>/is, contentToInject);

    return html;
}

module.exports = {
    renderHtml
};
