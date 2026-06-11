// Servidor estático mínimo para previsualizar dist/ (built-ins de Node, sin dependencias).
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'dist');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

function sendFile(res, file) {
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'content-type': 'text/html' }); res.end('404'); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(ROOT, p);
  fs.stat(file, (err, stat) => {
    if (!err && stat.isDirectory()) { sendFile(res, path.join(file, 'index.html')); return; }
    if (!err) { sendFile(res, file); return; }
    // ruta sin barra final / sin extensión → prueba carpeta/index.html
    sendFile(res, path.join(ROOT, p, 'index.html'));
  });
}).listen(4321, () => console.log('preview on http://localhost:4321'));
