const CONFIG = require('../config');

function buildSchemaScript(article) {
    const url = `${CONFIG.SITE_URL}/${article.slug}`;
    const imageUrl = article.coverImage || CONFIG.DEFAULT_OG_IMAGE;

    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": `${CONFIG.SITE_URL}/#editorial-team`,
                "name": "Ban Biên tập Sống Khỏe Mỗi Ngày",
                "url": `${CONFIG.SITE_URL}/gioi-thieu/ban-bien-tap.html`
            },
            {
                "@type": "Organization",
                "@id": `${CONFIG.SITE_URL}/#organization`,
                "name": CONFIG.DEFAULT_TITLE,
                "url": CONFIG.SITE_URL,
                "logo": {
                    "@type": "ImageObject",
                    "url": CONFIG.DEFAULT_OG_IMAGE
                }
            },
            {
                "@type": "WebSite",
                "@id": `${CONFIG.SITE_URL}/#website`,
                "url": CONFIG.SITE_URL,
                "name": CONFIG.DEFAULT_TITLE,
                "publisher": { "@id": `${CONFIG.SITE_URL}/#organization` }
            },
            {
                "@type": "MedicalWebPage",
                "@id": `${url}#webpage`,
                "url": url,
                "name": article.title,
                "isPartOf": { "@id": `${CONFIG.SITE_URL}/#website` },
                "about": { "@id": `${CONFIG.SITE_URL}/#organization` }
            },
            {
                "@type": "Article",
                "@id": `${url}#article`,
                "isPartOf": { "@id": `${url}#webpage` },
                "mainEntityOfPage": { "@id": `${url}#webpage` },
                "author": {
                    "@id": `${CONFIG.SITE_URL}/#editorial-team`
                },
                "headline": article.title,
                "description": article.excerpt || CONFIG.DEFAULT_DESCRIPTION,
                "image": imageUrl ? {
                    "@type": "ImageObject",
                    "url": imageUrl
                } : undefined,
                "datePublished": article.dates.published,
                "dateModified": article.dates.modified,
                "publisher": {
                    "@id": `${CONFIG.SITE_URL}/#organization`
                },
                "articleSection": article.category.name,
                "inLanguage": "vi-VN"
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${url}#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Trang Chủ",
                        "item": CONFIG.SITE_URL
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Blog",
                        "item": `${CONFIG.SITE_URL}/blog`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": article.category.name,
                        "item": `${CONFIG.SITE_URL}/${article.category.slug}`
                    },
                    {
                        "@type": "ListItem",
                        "position": 4,
                        "name": article.title,
                        "item": url
                    }
                ]
            }
        ]
    };

    return `<script type="application/ld+json" class="skmd-schema-graph">${JSON.stringify(schema)}</script>`;
}

module.exports = {
    buildSchemaScript
};
