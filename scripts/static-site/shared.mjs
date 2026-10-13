// Shared settings for the static-site snapshot (docs/static-site/README.md).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SITE_ORIGIN = 'https://tseng-law.com';
export const STATIC_DIST_DIR = '.next-static';
export const MAIN_LOCALES = ['ko', 'zh-hant', 'en', 'ja'];

/**
 * Paths that only work with a server (APIs, admin, member/booking/store flows, builder
 * fixtures). They are never crawled; links to them are reported, not followed.
 */
const SERVER_ONLY_PATH = new RegExp(
  [
    '^/api(?:/|$)',
    '^/_next/(?!static/)',
    '^/review(?:/|$)',
    '^/(?:[a-z]{2,3}(?:-[a-z]{2,4})?/)?(?:admin-builder|admin-consultation|builder|account|login|bookings|store|builder-fixtures|design-preview|members?)(?:/|$)',
  ].join('|'),
);

export function isServerOnlyPath(pathname) {
  return SERVER_ONLY_PATH.test(pathname);
}

/** `/` → index.html, `/ko/about` → ko/about.html (served at the extensionless URL). */
export function pageFileFor(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/') return 'index.html';
  return `${decodeURIComponent(clean.slice(1))}.html`;
}

export function hasFileExtension(pathname) {
  return /\.[a-z0-9]{1,8}$/i.test(pathname.split('/').pop() ?? '');
}

export function walkFiles(root) {
  const out = [];
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile()) out.push(full);
    }
  }
  return out;
}

const ENTITY = { '&amp;': '&', '&quot;': '"', '&#x27;': "'", '&#39;': "'", '&lt;': '<', '&gt;': '>' };

/** Same-site URL references in an HTML or CSS document, as pathnames (query/hash dropped). */
export function extractLocalRefs(text, pageUrl, base) {
  const refs = new Set();
  const add = (raw) => {
    const value = raw.trim().replace(/&(?:amp|quot|#x27|#39|lt|gt);/g, (m) => ENTITY[m]);
    // Next emits root-relative or absolute URLs; anything else (meta text, data:, mailto:) is not a ref.
    if (!/^(?:\/|https?:)/i.test(value)) return;
    let url;
    try {
      url = new URL(value, pageUrl);
    } catch {
      return;
    }
    const origin = url.origin;
    if (origin !== base && origin !== SITE_ORIGIN && origin !== 'https://www.tseng-law.com') return;
    refs.add(url.pathname);
  };
  for (const m of text.matchAll(/\s(?:href|src|poster|action|data-src|content)\s*=\s*"([^"]*)"/gi)) add(m[1]);
  for (const m of text.matchAll(/\s(?:srcset|srcSet|imagesrcset)\s*=\s*"([^"]*)"/g)) {
    for (const part of m[1].split(',')) add(part.trim().split(/\s+/)[0] ?? '');
  }
  for (const m of text.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)) add(m[2]);
  return refs;
}
