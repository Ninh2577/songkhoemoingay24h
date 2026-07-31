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

    // Inject at the very beginning
    html = injectionBlock + html;

    // Inject Content
    const contentToInject = `<div class="post-content" id="skmd-html-content">${article.contentHtml}</div>`;
    html = html.replace(/<div class="post-content" id="skmd-html-content">.*?<\/div>/is, contentToInject);

    return html;
}

module.exports = {
    renderHtml
};
