<?php
// Script proxy hình ảnh động dành cho Localhost (XAMPP)
if (isset($_GET['id']) && isset($_GET['region']) && isset($_GET['env'])) {
    $region = preg_replace('/[^a-zA-Z0-9\-]/', '', $_GET['region']);
    $env = preg_replace('/[^a-zA-Z0-9]/', '', $_GET['env']);
    $id = preg_replace('/[^a-zA-Z0-9]/', '', $_GET['id']);
    
    $url = "https://{$region}.graphassets.com/{$env}/{$id}";
    
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
