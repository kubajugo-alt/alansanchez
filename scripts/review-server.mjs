// Local server for the animation review screen: serves the game and saves review decisions.
//   node scripts/review-server.mjs [port=8080]   then open http://localhost:8080/?review
// POST /api/approvals writes art/review/approvals.json (the live site can't: there the review
// screen downloads the file instead). Everything else is served as static files.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const port = +process.argv[2] || 8080;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.svg': 'image/svg+xml' };

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (req.method === 'POST' && url.pathname === '/api/approvals') {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 2e6) req.destroy(); });
    req.on('end', () => {
      try {
        const d = JSON.parse(body);
        fs.writeFileSync(path.join(root, 'art/review/approvals.json'), JSON.stringify(d, null, 1) + '\n');
        res.writeHead(200, { 'content-type': 'application/json' }).end('{"ok":true}');
      } catch (e) { res.writeHead(400).end('bad json'); }
    });
    return;
  }
  const file = path.join(root, decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end('not found'); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-cache' });
  fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`review server: http://localhost:${port}/?review`));
