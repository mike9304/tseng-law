// Serves out/ the way the static host does: `/a/b` → a/b.html, exact files, _redirects (exact,
// `:placeholder` and trailing `*` rules), nearest 404.html with status 404. For local checks only.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf', '.pdf': 'application/pdf',
};

function loadRedirects(root) {
  const file = path.join(root, '_redirects');
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map((line) => {
    const [from, to, status] = line.trim().split(/\s+/);
    const names = [];
    const source = from.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/:([A-Za-z]+)/g, (_, name) => {
      names.push(name);
      return '([^/]+)';
    }).replace(/\*$/, '(.*)');
    return { re: new RegExp(`^${source}$`), names, splat: from.endsWith('*'), to, status: Number(status) || 301 };
  });
}

export function startStaticServer({ root, port }) {
  const redirects = loadRedirects(root);
  const isFile = (p) => fs.existsSync(p) && fs.statSync(p).isFile();
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://local');
    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }
    for (const rule of redirects) {
      const m = url.pathname.match(rule.re);
      if (!m) continue;
      let to = rule.to;
      rule.names.forEach((name, i) => { to = to.replace(`:${name}`, m[i + 1]); });
      if (rule.splat) to = to.replace(':splat', m[m.length - 1]);
      res.writeHead(rule.status, { location: to }).end();
      return;
    }
    const clean = path.normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, '');
    const candidates = [path.join(root, clean), path.join(root, `${clean.replace(/\/+$/, '') || '/index'}.html`), path.join(root, clean, 'index.html')];
    const hit = candidates.find((c) => c.startsWith(root) && isFile(c));
    if (hit) {
      res.writeHead(200, { 'content-type': TYPES[path.extname(hit).toLowerCase()] ?? 'application/octet-stream' });
      fs.createReadStream(hit).pipe(res);
      return;
    }
    let dir = path.dirname(path.join(root, clean));
    while (dir.startsWith(root)) {
      const notFound = path.join(dir, '404.html');
      if (isFile(notFound)) {
        res.writeHead(404, { 'content-type': TYPES['.html'] });
        fs.createReadStream(notFound).pipe(res);
        return;
      }
      if (dir === root) break;
      dir = path.dirname(dir);
    }
    res.writeHead(404).end();
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = path.resolve(process.argv[2] ?? 'out');
  const port = Number(process.argv[3] ?? 4620);
  await startStaticServer({ root, port });
  console.log(`serving ${root} on http://127.0.0.1:${port}`);
}
