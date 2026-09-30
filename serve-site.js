/* Статик-сервер для site/ (главная Кристалис). Без зависимостей.
   Запуск: node serve-site.js  →  http://localhost:5055
   Cache-Control: no-store — чтобы правки css/js подхватывались сразу. */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'site');
const PORT = process.env.PORT || 5055;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.map': 'application/json; charset=utf-8',
};

const server = http.createServer((req, res) => {
  try {
    let rel = decodeURIComponent(req.url.split('?')[0]);
    if (rel === '/' || rel === '') rel = '/index.html';

    // защита от выхода за пределы ROOT
    const filePath = path.join(ROOT, path.normalize(rel));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403).end('Forbidden');
      return;
    }

    fs.stat(filePath, (err, st) => {
      let target = filePath;
      if (!err && st.isDirectory()) target = path.join(filePath, 'index.html');

      fs.readFile(target, (e, data) => {
        if (e) {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end('<h1>404</h1><p>Not found: ' + rel + '</p>');
          return;
        }
        const type = MIME[path.extname(target).toLowerCase()] || 'application/octet-stream';
        // Range — без него браузер не даёт перематывать видео (currentTime), а маскот перематывает look курсором
        const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
        if (m) {
          const size = data.length;
          let start = m[1] === '' ? size - +m[2] : +m[1];
          let end = m[1] !== '' && m[2] !== '' ? Math.min(+m[2], size - 1) : size - 1;
          if (start > end || start < 0) { res.writeHead(416, { 'Content-Range': 'bytes */' + size }).end(); return; }
          res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${size}`,
            'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1, 'Cache-Control': 'no-store' });
          res.end(data.subarray(start, end + 1));
          return;
        }
        res.writeHead(200, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store' });
        res.end(data);
      });
    });
  } catch (err) {
    res.writeHead(500).end('Server error');
  }
});

server.listen(PORT, () => {
  console.log('site → http://localhost:' + PORT + '  (root: ' + ROOT + ')');
});
