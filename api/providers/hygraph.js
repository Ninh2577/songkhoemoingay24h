const CONFIG = require('../config');

// A generic wrapper around fetch to handle timeouts and exponential backoff retries
async function fetchWithRetry(url, options = {}, retries = CONFIG.RETRY_LIMIT) {
    const timeout = options.timeout || CONFIG.TIMEOUT_MS;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const fetchOptions = {
        ...options,
        signal: controller.signal
    };

    try {
        const response = await fetch(url, fetchOptions);
        clearTimeout(id);
        
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} body: ${errText}`);
        }
        
        return await response.json();
    } catch (error) {
        clearTimeout(id);
        
        const isTimeout = error.name === 'AbortError';
        const errorMessage = isTimeout ? 'Request timeout' : error.message;

        if (retries > 0) {
            const delay = (CONFIG.RETRY_LIMIT - retries + 1) * 500; // 500ms, 1000ms...
            console.warn(`Fetch failed (${errorMessage}). Retrying in ${delay}ms... (${retries} retries left)`);
            await new Promise(res => setTimeout(res, delay));
            return fetchWithRetry(url, options, retries - 1);
        }

        throw new Error(errorMessage);
    }
}

/**
 * Fetches an article by its slug from Hygraph
 */
async function getArticleBySlug(slug) {
    const QUERY = `
        query GetArticle($slug: String!) {
            baiViets(where: { slug: $slug }, first: 1) {
                id
                title
                slug
                tomtat
                danhmuc
                anh { url fileName }
                tacGia
                createdBy { name }
                createdAt
                updatedAt
                noiDung { html }
            }
        }
    `;

    const body = JSON.stringify({
        query: QUERY,
        variables: { slug }
    });

    const data = await fetchWithRetry(CONFIG.HYGRAPH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
    });

    if (data.errors) {
        console.error("Hygraph GraphQL Errors:", JSON.stringify(data.errors));
        throw new Error("GraphQL Error from Hygraph");
    }

    return data.data?.baiViets?.[0] || null;
}

module.exports = {
    getArticleBySlug
};
