/**
 * Converts category name to URL-friendly slug
 */
function skmdCatSlug(cat) {
    if (!cat) return 'tin-tuc';
    const c = cat.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (c.includes('kienthuc') || c.includes('kien thuc')) return 'kien-thuc-can-biet';
    if (c.includes('tri')) return 'tri';
    if (c.includes('thai')) return 'dinh-chi-thai';
    if (c.includes('quydau') || c.includes('quy dau')) return 'bao-quy-dau';
    return 'tin-tuc';
}

/**
 * Returns readable category name
 */
function skmdCatName(cat) {
    if (!cat) return 'Sức Khỏe';
    if (cat === 'KienThuc' || cat.toLowerCase().includes('kienthuc') || cat.toLowerCase().includes('kien thuc')) return 'Kiến thức cần biết';
    if (cat === 'DinhChiThai' || cat.toLowerCase().includes('thai')) return 'Đình chỉ thai';
    if (cat === 'Tri' || cat.toLowerCase().includes('tri')) return 'Bệnh Trĩ';
    if (cat === 'BaoQuyDau' || cat.toLowerCase().includes('quy dau') || cat.toLowerCase().includes('quydau')) return 'Bao quy đầu';
    return 'Sức Khỏe';
}

/**
 * Normalizes a URL slug (lowercase, trim)
 */
function normalizeSlug(slug) {
    if (!slug) return '';
    return slug.toLowerCase().trim().replace(/\/+$/, '');
}

/**
 * Escapes HTML characters to prevent XSS
 */
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

module.exports = {
    skmdCatSlug,
    skmdCatName,
    normalizeSlug,
    escapeHtml
};
