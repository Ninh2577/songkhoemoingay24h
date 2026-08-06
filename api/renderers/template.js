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

    // Rewrite image URLs to use /asset-proxy/region/envId/assetId/fileName
    let finalHtml = article.contentHtml || '';
    function skmdSlugify(str) {
        if (!str) return '';
        str = str.replace(/^\s+|\s+$/g, '').toLowerCase();
        var from = "áàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ·/_,:;";
        var to   = "aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyy------";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }
        return str.replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    }

    finalHtml = finalHtml.replace(/<img([^>]*)src="https:\/\/([a-z0-9\-]+)\.graphassets\.com\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)"([^>]*)>/gi, (match, p1, region, envId, assetId, p2) => {
        const titleMatch = match.match(/title="([^"]+)"/i);
        const altMatch = match.match(/alt="([^"]+)"/i);
        const filename = (titleMatch && titleMatch[1]) || (altMatch && altMatch[1]) || 'image.png';
        
        let ext = '';
        let baseName = filename;
        const lastDot = baseName.lastIndexOf('.');
        if (lastDot !== -1 && lastDot > baseName.length - 6) {
            ext = baseName.substring(lastDot);
            baseName = baseName.substring(0, lastDot);
        }
        
        let cleanName = skmdSlugify(baseName);
        if (cleanName) {
            if (!ext) ext = '.jpg';
            cleanName += ext;
        } else {
            cleanName = 'image.jpg';
        }
        
        return `<img${p1}src="/image/${assetId}/${cleanName}"${p2}>`;
    });
    const contentToInject = `<article class="skmd-article-content" id="skmd-html-content">${finalHtml}</article>`;
    html = html.replace(/<article class="skmd-article-content" id="skmd-html-content">.*?<\/article>/is, contentToInject);

    return html;
}

module.exports = {
    renderHtml
};
