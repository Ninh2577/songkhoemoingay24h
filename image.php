<?php
// Script proxy hình ảnh cho Localhost (XAMPP) mô phỏng api/image.js
if (isset($_GET['id'])) {
    $id = preg_replace('/[^a-zA-Z0-9]/', '', $_GET['id']);
    $url = "https://ap-south-1.graphassets.com/cmrezpqjy0epy06pp7qgqcua7/{$id}";
    
    $headers = @get_headers($url, 1);
    $contentType = isset($headers['Content-Type']) ? $headers['Content-Type'] : (isset($headers['content-type']) ? $headers['content-type'] : 'image/jpeg');
    if (is_array($contentType)) $contentType = end($contentType);
    
    header("Content-Type: " . $contentType);
    header("Cache-Control: public, max-age=86400");
    
    $imgCh = curl_init($url);
    curl_setopt($imgCh, CURLOPT_RETURNTRANSFER, false); // Output directly
    curl_setopt($imgCh, CURLOPT_SSL_VERIFYPEER, false);
    curl_exec($imgCh);
    curl_close($imgCh);
    exit;
}

// Hỗ trợ URL cũ (asset-proxy) cho cache
if (isset($_GET['host']) && isset($_GET['path'])) {
    $host = preg_replace('/[^a-zA-Z0-9\.\-]/', '', $_GET['host']);
    $path = $_GET['path'];
    $url = "https://{$host}/{$path}";
    $headers = @get_headers($url, 1);
    $contentType = isset($headers['Content-Type']) ? $headers['Content-Type'] : (isset($headers['content-type']) ? $headers['content-type'] : 'image/jpeg');
    if (is_array($contentType)) $contentType = end($contentType);
    header("Content-Type: " . $contentType);
    header("Cache-Control: public, max-age=86400");
    
    $imgCh = curl_init($url);
    curl_setopt($imgCh, CURLOPT_RETURNTRANSFER, false);
    curl_setopt($imgCh, CURLOPT_SSL_VERIFYPEER, false);
    curl_exec($imgCh);
    curl_close($imgCh);
    exit;
}

header("HTTP/1.0 404 Not Found");
echo "Image not found.";
?>
