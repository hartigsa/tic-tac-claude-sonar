const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Define the root directory for static files
const STATIC_ROOT = path.join(__dirname, 'dist');

// Whitelist of allowed file extensions for security
const ALLOWED_EXTENSIONS = new Set(['.html', '.js', '.css', '.json', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg']);

function sanitizeFilePath(requestUrl) {
  try {
    // Parse and normalize the URL
    const parsedUrl = url.parse(requestUrl);
    let pathname = parsedUrl.pathname || '/';
    
    // Default to index.html for root requests
    if (pathname === '/') {
      pathname = '/index.html';
    }
    
    // Remove query parameters and fragments
    pathname = pathname.split('?')[0].split('#')[0];
    
    // Normalize the path to prevent directory traversal
    const normalizedPath = path.normalize(pathname);
    
    // Check for directory traversal attempts
    if (normalizedPath.includes('..') || path.isAbsolute(normalizedPath)) {
      return null;
    }
    
    // Construct the full file path
    const fullPath = path.join(STATIC_ROOT, normalizedPath);
    
    // Ensure the resolved path is still within STATIC_ROOT
    const resolvedPath = path.resolve(fullPath);
    const resolvedRoot = path.resolve(STATIC_ROOT);
    
    if (!resolvedPath.startsWith(resolvedRoot)) {
      return null;
    }
    
    // Check if file extension is allowed
    const ext = path.extname(resolvedPath).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return null;
    }
    
    return resolvedPath;
  } catch (error) {
    return null;
  }
}

const server = http.createServer((req, res) => {
  // Enable CORS for development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Only allow GET requests for static files
  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
    return;
  }

  const filePath = sanitizeFilePath(req.url);
  
  if (!filePath) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request');
    return;
  }
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    // For SPA routing, fallback to index.html
    const indexPath = path.join(STATIC_ROOT, 'index.html');
    if (fs.existsSync(indexPath)) {
      const ext = '.html';
      const contentType = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.ico': 'image/x-icon',
        '.svg': 'image/svg+xml'
      }[ext] || 'application/octet-stream';
      
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(indexPath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
    return;
  }
  
  // Serve the file
  const ext = path.extname(filePath).toLowerCase();
  const contentType = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml'
  }[ext] || 'application/octet-stream';
  
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

const port = process.env.PORT || 5173;
server.listen(port, '0.0.0.0', () => {
  console.log(`Static server running on port ${port}`);
});