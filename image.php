<?php
// Script proxy hình ảnh tổng quát dành cho Localhost (XAMPP)
if (isset($_GET['host']) && isset($_GET['path'])) {
    $host = preg_replace('/[^a-zA-Z0-9\.\-]/', '', $_GET['host']);
    $path = $_GET['path'];
    
    $url = "https://{$host}/{$path}";
    
    $headers = @get_headers($url, 1);
    $contentType = isset($headers['Content-Type']) ? $headers['Content-Type'] : (isset($headers['content-type']) ? $headers['content-type'] : 'image/jpeg');
    if (is_array($contentType)) $contentType = end($contentType);
    
    header("Content-Type: " . $contentType);
    header("Cache-Control: public, max-age=86400");
    readfile($url);
    exit;
}
header("HTTP/1.0 404 Not Found");
echo "Image not found.";
?>
