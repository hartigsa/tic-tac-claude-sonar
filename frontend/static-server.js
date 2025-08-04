import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the root directory for static files - serve from current directory
const STATIC_ROOT = __dirname;

// Debug: Log the serving directory and its contents
console.log('Static server starting...');
console.log('Serving from:', STATIC_ROOT);
console.log('__dirname:', __dirname);

try {
  const files = fs.readdirSync(STATIC_ROOT);
  console.log('Files in STATIC_ROOT:', files);
  
  // Check for key files
  const hasIndex = fs.existsSync(path.join(STATIC_ROOT, 'index.html'));
  const hasCSS = fs.existsSync(path.join(STATIC_ROOT, 'css'));
  const hasJS = fs.existsSync(path.join(STATIC_ROOT, 'js'));
  
  console.log('Key files check:');
  console.log('- index.html:', hasIndex);
  console.log('- css/ directory:', hasCSS);
  console.log('- js/ directory:', hasJS);
} catch (err) {
  console.error('Error reading STATIC_ROOT:', err.message);
}

// Whitelist of allowed file extensions for security
const ALLOWED_EXTENSIONS = new Set(['.html', '.js', '.css', '.json', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg']);

function sanitizeFilePath(requestUrl) {
  try {
    // Parse and normalize the URL
    const parsedUrl = url.parse(requestUrl);
    let pathname = parsedUrl.pathname || '/';
    
    console.log('Original pathname:', pathname);
    
    // Default to index.html for root requests
    if (pathname === '/') {
      pathname = '/index.html';
    }
    
    // Remove query parameters and fragments
    pathname = pathname.split('?')[0].split('#')[0];
    
    console.log('Processed pathname:', pathname);
    
    // Normalize the path to prevent directory traversal
    const normalizedPath = path.normalize(pathname);
    
    console.log('Normalized path:', normalizedPath);
    
    // Check for directory traversal attempts
    console.log('Checking for ".." in:', normalizedPath, '-> contains "..":', normalizedPath.includes('..'));
    if (normalizedPath.includes('..')) {
      console.log('Directory traversal detected:', normalizedPath);
      return null;
    }
    console.log('Path passed traversal check');
    
    // Remove leading slash to make it relative
    const relativePath = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;
    console.log('Relative path:', relativePath);
    
    // Construct the full file path using relative path
    const fullPath = path.join(STATIC_ROOT, relativePath);
    
    console.log('Full path:', fullPath);
    
    // Ensure the resolved path is still within STATIC_ROOT
    const resolvedPath = path.resolve(fullPath);
    const resolvedRoot = path.resolve(STATIC_ROOT);
    
    console.log('Resolved path:', resolvedPath);
    console.log('Resolved root:', resolvedRoot);
    
    if (!resolvedPath.startsWith(resolvedRoot)) {
      console.log('Path outside root detected');
      return null;
    }
    
    // Check if file extension is allowed
    const ext = path.extname(resolvedPath).toLowerCase();
    console.log('File extension:', ext);
    
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      console.log('Extension not allowed:', ext);
      return null;
    }
    
    console.log('Final sanitized path:', resolvedPath);
    return resolvedPath;
  } catch (error) {
    console.log('Sanitization error:', error.message);
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
  
  console.log('Request:', req.url, '-> sanitized path:', filePath);
  
  if (!filePath) {
    console.log('Bad request for URL:', req.url);
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