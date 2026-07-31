const helpers = require('../utils/helpers');

/**
 * Normalizes raw Hygraph article data into a clean, unified object
 */
function normalizeArticle(raw) {
    if (!raw) return null;

    // Fallbacks
    const title = raw.title || 'Bài Viết';
    const slug = raw.slug || 'bai-viet';
    const excerpt = raw.tomtat || '';
    const catName = helpers.skmdCatName(raw.danhmuc);
    const catSlug = helpers.skmdCatSlug(raw.danhmuc);
    
    // Dates
    const pubDate = raw.createdAt || new Date().toISOString();
    const modDate = raw.updatedAt || pubDate;
    
    // Image and Author
    const coverImage = raw.anh?.url || null; // Will fallback to default in SEO builder
    const authorName = raw.tacGia || 'Ban Biên Tập';

    // Content
    const contentHtml = raw.noiDung?.html || '<p>Nội dung đang được cập nhật...</p>';

    return {
        id: raw.id,
        title,
        slug,
        excerpt,
        category: {
            name: catName,
            slug: catSlug
        },
        dates: {
            published: pubDate,
            modified: modDate
        },
        coverImage,
        authorName,
        contentHtml,
        raw // keep raw for hydration if needed
    };
}

module.exports = {
    normalizeArticle
};
