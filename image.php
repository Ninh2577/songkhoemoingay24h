<?php
// Script proxy hình ảnh cho Localhost (XAMPP) bằng Asset ID
if (isset($_GET['id'])) {
    $id = preg_replace('/[^a-zA-Z0-9]/', '', $_GET['id']);
    $url = "https://ap-south-1.graphassets.com/cmrezpqjy0epy06pp7qgqcua7/" . $id;
    
    // Lấy Content-Type thật từ Hygraph
    $headers = @get_headers($url, 1);
    $contentType = isset($headers['Content-Type']) ? $headers['Content-Type'] : (isset($headers['content-type']) ? $headers['content-type'] : 'image/jpeg');
    
    if (is_array($contentType)) {
        $contentType = end($contentType);
    }
    
    header("Content-Type: " . $contentType);
    header("Cache-Control: public, max-age=86400");
    readfile($url);
    exit;
}
header("HTTP/1.0 404 Not Found");
echo "Image not found.";
?>
