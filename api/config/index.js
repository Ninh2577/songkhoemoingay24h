const path = require('path');

const CONFIG = {
    SITE_URL: 'https://songkhoemoingay24h.vercel.app',
    HYGRAPH_URL: 'https://ap-south-1.cdn.hygraph.com/content/cmrezpq25018t07walir17znu/master',
    DEFAULT_TITLE: 'Sống Khỏe Mỗi Ngày 24h',
    DEFAULT_DESCRIPTION: 'Cập nhật kiến thức y tế, sức khỏe sinh sản, nam khoa, phụ khoa, đình chỉ thai, và bệnh trĩ uy tín, chính xác.',
    SITE_LOGO: 'https://songkhoemoingay24h.vercel.app/favicon_46ozzcminjco6vl4qpkay.svg',
    DEFAULT_OG_IMAGE: 'https://songkhoemoingay24h.vercel.app/favicon_46ozzcminjco6vl4qpkay.svg',
    TITLE_SUFFIX: ' | Sống Khỏe Mỗi Ngày 24h',
    CACHE_TIME: {
        S_MAXAGE: 3600, // 1 hour at CDN edge
        STALE_WHILE_REVALIDATE: 86400, // 24 hours stale allowed while revalidating
    },
    TIMEOUT_MS: 5000,
    RETRY_LIMIT: 2,
    HTML_TEMPLATE_PATH: path.join(__dirname, '../../chi-tiet-bai-viet.html')
};

module.exports = CONFIG;
