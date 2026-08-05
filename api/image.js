const CONFIG = require('./config');

module.exports = async (req, res) => {
    let filename = req.query.filename;
    if (!filename) return res.status(400).send('Filename required');

    // Decode filename in case of spaces/URL encoding
    filename = decodeURIComponent(filename);

    const QUERY = `
        query GetAsset($fileName: String!) {
            assets(where: { fileName: $fileName }, first: 1) {
                url
                mimeType
            }
        }
    `;

    try {
        const response = await fetch(CONFIG.HYGRAPH_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: QUERY, variables: { fileName: filename } })
        });
        
        const data = await response.json();
        const assetUrl = data.data?.assets?.[0]?.url;
        const mimeType = data.data?.assets?.[0]?.mimeType || 'image/jpeg';
        
        if (assetUrl) {
            // Set Cache-Control for Vercel Edge Network
            res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400');
            res.setHeader('Content-Type', mimeType);
            
            // Fetch the actual image from Hygraph
            const imgRes = await fetch(assetUrl);
            
            if (!imgRes.ok) {
                return res.status(404).send('Image fetch failed');
            }
            
            const buffer = await imgRes.arrayBuffer();
            res.send(Buffer.from(buffer));
        } else {
            res.status(404).send('Image not found in Hygraph: ' + filename);
        }
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
};
