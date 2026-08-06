<?php
// Script proxy hình ảnh cho Localhost (XAMPP) mô phỏng api/image.js
if (isset($_GET['filename'])) {
    $filename = urldecode($_GET['filename']);
    $hygraphUrl = 'https://ap-south-1.cdn.hygraph.com/content/cmrezpq25018t07walir17znu/master';
    
    $query = 'query GetAsset($fileName: String!) { assets(where: { fileName: $fileName }, first: 1) { url mimeType } }';
    $postData = json_encode(['query' => $query, 'variables' => ['fileName' => $filename]]);
    
    $ch = curl_init($hygraphUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    if ($response) {
        $data = json_decode($response, true);
        if (isset($data['data']['assets'][0]['url'])) {
            $assetUrl = $data['data']['assets'][0]['url'];
            $mimeType = isset($data['data']['assets'][0]['mimeType']) ? $data['data']['assets'][0]['mimeType'] : 'image/jpeg';
            
            header("Content-Type: " . $mimeType);
            header("Cache-Control: public, max-age=86400");
            
            $imgCh = curl_init($assetUrl);
            curl_setopt($imgCh, CURLOPT_RETURNTRANSFER, false); // Output directly
            curl_setopt($imgCh, CURLOPT_SSL_VERIFYPEER, false);
            curl_exec($imgCh);
            curl_close($imgCh);
            exit;
        }
    }
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
