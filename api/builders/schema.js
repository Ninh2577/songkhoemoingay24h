const CONFIG = require('../config');

function buildSchemaScript(article) {
    const url = `${CONFIG.SITE_URL}/${article.slug}`;
    const imageUrl = article.coverImage || CONFIG.DEFAULT_OG_IMAGE;

    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                "@id": `${url}#article`,
                "isPartOf": { "@id": `${url}#webpage` },
                "author": {
                    "@type": "Person",
                    "name": article.authorName
                },
                "headline": article.title,
                "description": article.excerpt || CONFIG.DEFAULT_DESCRIPTION,
                "image": imageUrl,
                "datePublished": article.dates.published,
                "dateModified": article.dates.modified,
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": `${url}#webpage`
                },
                "publisher": {
                    "@type": "Organization",
                    "@id": `${CONFIG.SITE_URL}/#organization`,
                    "name": CONFIG.DEFAULT_TITLE,
                    "logo": {
                        "@type": "ImageObject",
                        "url": CONFIG.DEFAULT_OG_IMAGE
                    }
                }
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${url}#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Trang chủ",
                        "item": CONFIG.SITE_URL
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": article.category.name,
                        "item": `${CONFIG.SITE_URL}/${article.category.slug}`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
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
