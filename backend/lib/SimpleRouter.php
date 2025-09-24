<?php

class SimpleRouter {
    private $routes = [];
    private $basePath = '';
    private $staticPaths = [];
    private $corsConfig = [
        'enabled' => false,
        'origins' => ['*'],
        'methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        'headers' => ['Content-Type', 'Authorization'],
        'credentials' => false,
        'maxAge' => 86400
    ];
    
    public function __construct($basePath = '') {
        $this->basePath = rtrim($basePath, '/');
    }
    
    // Enable CORS with optional configuration
    public function enableCORS($config = []) {
        $this->corsConfig['enabled'] = true;
        $this->corsConfig = array_merge($this->corsConfig, $config);
    }
    
    // Simple CORS enable with wildcard
    public function allowCrossOrigin($origins = '*', $credentials = false) {
        $this->enableCORS([
            'origins' => is_array($origins) ? $origins : [$origins],
            'credentials' => $credentials
        ]);
    }
    
    public function get($pattern, $callback) {
        $this->addRoute('GET', $pattern, $callback);
    }
    
    public function post($pattern, $callback) {
        $this->addRoute('POST', $pattern, $callback);
    }
    
    public function put($pattern, $callback) {
        $this->addRoute('PUT', $pattern, $callback);
    }
    
    public function delete($pattern, $callback) {
        $this->addRoute('DELETE', $pattern, $callback);
    }
    
    public function options($pattern, $callback = null) {
        if ($callback === null) {
            // Auto-handle OPTIONS for CORS preflight
            $callback = function() { return ['message' => 'OK']; };
        }
        $this->addRoute('OPTIONS', $pattern, $callback);
    }
    
    // Add static file serving
    public function addStatic($urlPath, $filePath) {
        $this->staticPaths[$urlPath] = rtrim($filePath, '/');
    }
    
    private function addRoute($method, $pattern, $callback) {
        $this->routes[] = [
            'method' => $method,
            'pattern' => $pattern,
            'callback' => $callback
        ];
    }
    
    private function setCORSHeaders() {
        if (!$this->corsConfig['enabled']) {
            return;
        }
        
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $requestMethod = $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] ?? '';
        $requestHeaders = $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'] ?? '';
        
        // Handle origin
        if (in_array('*', $this->corsConfig['origins'])) {
            header('Access-Control-Allow-Origin: *');
        } elseif (in_array($origin, $this->corsConfig['origins'])) {
            header('Access-Control-Allow-Origin: ' . $origin);
            if ($this->corsConfig['credentials']) {
                header('Access-Control-Allow-Credentials: true');
            }
        }
        
        // Handle preflight requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            header('Access-Control-Allow-Methods: ' . implode(', ', $this->corsConfig['methods']));
            header('Access-Control-Allow-Headers: ' . implode(', ', $this->corsConfig['headers']));
            header('Access-Control-Max-Age: ' . $this->corsConfig['maxAge']);
            
            if ($requestHeaders) {
                header('Access-Control-Allow-Headers: ' . $requestHeaders);
            }
        }
        
        // Always expose headers if needed
        header('Access-Control-Expose-Headers: Content-Type, Authorization');
    }
    
    private function parsePattern($pattern) {
        $regex = preg_replace('/\{([^}]+)\}/', '(?P<$1>[^/]+)', $pattern);
        return '#^' . $regex . '$#';
    }
    
    private function getCurrentPath() {
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $path = substr($path, strlen($this->basePath));
        return $path === '' ? '/' : $path;
    }
    
    private function serveStaticFile($path) {
        foreach ($this->staticPaths as $urlPath => $filePath) {
            if (strpos($path, $urlPath) === 0) {
                $file = $filePath . substr($path, strlen($urlPath));
                
                $realBase = realpath($filePath);
                $realFile = realpath($file);
                
                if ($realFile === false || strpos($realFile, $realBase) !== 0) {
                    return false;
                }
                
                if (file_exists($file) && is_file($file)) {
                    $this->sendFile($file);
                    return true;
                }
            }
        }
        return false;
    }
    
    private function sendFile($filePath) {
        $mimeTypes = [
            'html' => 'text/html',
            'css'  => 'text/css',
            'js'   => 'application/javascript',
            'json' => 'application/json',
            'png'  => 'image/png',
            'jpg'  => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif'  => 'image/gif',
            'svg'  => 'image/svg+xml',
            'pdf'  => 'application/pdf',
            'txt'  => 'text/plain'
        ];
        
        $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';
        
        header('Content-Type: ' . $mimeType);
        header('Content-Length: ' . filesize($filePath));
        readfile($filePath);
    }
    
    public function dispatch() {
        // Set CORS headers first
        $this->setCORSHeaders();
        
        // Handle OPTIONS preflight requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS' && $this->corsConfig['enabled']) {
            http_response_code(200);
            exit;
        }
        
        $method = $_SERVER['REQUEST_METHOD'];
        $path = $this->getCurrentPath();
        
        // Serve static files
        if ($this->serveStaticFile($path)) {
            return;
        }
        
        // Handle routes
        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }
            
            $patternRegex = $this->parsePattern($route['pattern']);
            
            if (preg_match($patternRegex, $path, $matches)) {
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                $result = call_user_func($route['callback'], ...array_values($params));
                $this->sendResponse($result);
                return;
            }
        }
        
        // No route found
        $this->sendResponse([
            'error' => 'Route not found',
            'path' => $path,
            'method' => $method
        ], 404);
    }
    
    private function sendResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        
        if (is_string($data) && substr($data, 0, 1) === '<') {
            header('Content-Type: text/html');
            echo $data;
        } elseif (is_array($data) || is_object($data)) {
            header('Content-Type: application/json');
            echo json_encode($data, JSON_PRETTY_PRINT);
        } else {
            header('Content-Type: text/plain');
            echo $data;
        }
    }
}
