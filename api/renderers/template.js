const path = require('path');
const fs = require('fs');
const CONFIG = require('../config');

// In-memory cache for the template during warm lambda execution
let cachedTemplate = null;

function getTemplate() {
    if (cachedTemplate) return cachedTemplate;
    try {
        cachedTemplate = fs.readFileSync(path.join(__dirname, '../../chi-tiet-bai-viet.html'), 'utf8');
        return cachedTemplate;
    } catch (err) {
        console.error("Template loading failed", err);
        throw new Error("Template loading failed");
    }
}

function formatDate(dateString) {
    if (!dateString) return 'Hôm nay';
    const d = new Date(dateString);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function calculateReadTime(html) {
    if (!html) return 1;
    const text = html.replace(/<[^>]*>?/gm, '');
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return minutes > 0 ? minutes : 1;
}

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

function rewriteImageUrls(html) {
    if (!html) return '';
    return html.replace(/<img([^>]*)src="https:\/\/([a-z0-9\-]+)\.graphassets\.com\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)"([^>]*)>/gi, (match, p1, region, envId, assetId, p2) => {
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
}

function renderBreadcrumb(article) {
    const url = `${CONFIG.SITE_URL}/${article.slug}`;
    const catUrl = `${CONFIG.SITE_URL}/${article.category.slug}`;
    return `
<nav aria-label="Breadcrumb" class="skmd-breadcrumb" style="justify-content: center; margin-bottom: 12px; gap: 8px;">
    <ol style="list-style:none; padding:0; margin:0; display:flex; gap:8px;">
        <li style="display:flex; align-items:center; gap:8px;"><a href="${CONFIG.SITE_URL}">Trang Chủ</a> <span>&bull;</span></li>
        <li style="display:flex; align-items:center; gap:8px;"><a href="${CONFIG.SITE_URL}/blog">Blog</a> <span>&bull;</span></li>
        <li style="display:flex; align-items:center; gap:8px;"><a href="${catUrl}">${article.category.name}</a> <span>&bull;</span></li>
        <li style="display:flex; align-items:center;"><span id="skmd-cat-badge" style="color:var(--color-primary-dark); font-weight:700;" aria-current="page">${article.title}</span></li>
    </ol>
</nav>
    `;
}

function renderRelatedArticles(relatedList) {
    if (!relatedList || relatedList.length === 0) return '';
    let html = '';
    relatedList.forEach(p => {
        let img = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop';
        if (p.anh && p.anh.url) {
            img = rewriteImageUrls(`<img src="${p.anh.url}" alt="${p.title}" />`).match(/src="([^"]+)"/)[1];
        }
        html += `
<a href="/${p.slug}" class="skmd-sidebar-related-item" style="display:flex; gap:12px; text-decoration:none; transition: opacity 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1">
    <div style="flex-shrink:0; width:80px; height:60px; border-radius:6px; overflow:hidden; position:relative; border: 1px solid var(--color-border);">
        <img src="${img}" alt="${p.title}" loading="lazy" style="width:100%; height:100%; object-fit:cover;" />
    </div>
    <div style="display:flex; flex-direction:column; justify-content:center;">
        <h4 style="font-size:0.85rem; font-weight:700; color:var(--color-text-main); margin-bottom:4px; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${p.title}</h4>
        <span style="font-size:0.75rem; color:var(--color-text-muted);"><i class="ri-time-line"></i> ${formatDate(p.createdAt)}</span>
    </div>
</a>`;
    });
    return html;
}

/**
 * Injects SEO, Schema, and Content into the HTML template
 */
function renderHtml(article, seoHeadStr, schemaScriptStr, rawRelated) {
    let html = getTemplate();

    // Remove existing title if any
    html = html.replace(/<title>.*?<\/title>/gi, '');

    const injectionBlock = `
    ${seoHeadStr}
    ${schemaScriptStr}
    `;

    // Inject inside <head>
    html = html.replace('</head>', injectionBlock + '\n</head>');

    // Replace placeholders
    const safeTitle = article.title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeExcerpt = (article.excerpt || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    html = html.replace('{{ARTICLE_TITLE}}', () => safeTitle);
    html = html.replace('{{ARTICLE_EXCERPT}}', () => safeExcerpt);
    html = html.replace('{{READ_TIME}}', () => calculateReadTime(article.contentHtml));
    html = html.replace('{{ARTICLE_ISO_DATE}}', () => article.dates.modified || article.dates.published);
    html = html.replace('{{ARTICLE_FORMATTED_DATE}}', () => formatDate(article.dates.modified || article.dates.published));
    
    html = html.replace('{{BREADCRUMB_HTML}}', () => renderBreadcrumb(article));
    html = html.replace('{{RELATED_ARTICLES_HTML}}', () => renderRelatedArticles(rawRelated));
    
    let thumbHtml = '';
    if (article.coverImage) {
        let cleanImg = rewriteImageUrls(`<img src="${article.coverImage}" class="skmd-article-hero__img" alt="${safeTitle}" />`);
        thumbHtml = `${cleanImg}<div class="skmd-article-hero__caption">Ảnh minh họa chuẩn y khoa</div>`;
    }
    html = html.replace('{{ARTICLE_THUMB_HTML}}', () => thumbHtml);

    let finalContent = rewriteImageUrls(article.contentHtml || '');
    html = html.replace('{{ARTICLE_CONTENT}}', () => finalContent);

    return html;
}

module.exports = {
    renderHtml
};
