const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets directly (CSS, Images, etc.)
app.use(express.static(__dirname));

// Route handlers for Vercel Rewrites
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get(['/blog', '/kien-thuc-can-biet', '/tri', '/dinh-chi-thai', '/bao-quy-dau'], (req, res) => {
    res.sendFile(path.join(__dirname, 'blog.html'));
});

app.get('/gioi-thieu', (req, res) => {
    res.sendFile(path.join(__dirname, 'gioi-thieu.html'));
});

app.get('/dieu-khoan-su-dung', (req, res) => {
    res.sendFile(path.join(__dirname, 'dieu-khoan-su-dung.html'));
});

app.get('/chinh-sach-bao-mat', (req, res) => {
    res.sendFile(path.join(__dirname, 'chinh-sach-bao-mat.html'));
});

app.get('/mien-tru-trach-nhiem', (req, res) => {
    res.sendFile(path.join(__dirname, 'mien-tru-trach-nhiem.html'));
});

// Sitemap API
app.get('/sitemap.xml', async (req, res) => {
    try {
        const sitemapHandler = require('./api/sitemap');
        await sitemapHandler(req, res);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
});

// Asset Proxy for Hygraph Images (Rewrite)
app.get('/image/:id/:filename', (req, res) => {
    const { id } = req.params;
    res.redirect(`https://ap-south-1.graphassets.com/cmrezpqjy0epy06pp7qgqcua7/${id}`);
});

// Dynamic Article Routing (Must be last)
app.get('/:slug', async (req, res, next) => {
    const slug = req.params.slug;
    // Bỏ qua các file tĩnh bị lỗi không tìm thấy (ví dụ: .css, .js, .png)
    if (slug.includes('.')) {
        return next();
    }
    
    try {
        req.query.slug = slug; // Giả lập query cho handler
        const articleHandler = require('./api/render-article');
        await articleHandler(req, res);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    console.log(`Bạn có thể xem các bài viết tại http://localhost:${PORT}/<slug-bai-viet>`);
});
