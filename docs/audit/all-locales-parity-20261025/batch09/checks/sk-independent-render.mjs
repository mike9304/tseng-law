import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const repo = '/Users/son7/Projects/tseng-law-all-locales-20261025';
const batch = '/Users/son7/tseng-all-language-columns-20261025/batch09';
const req = createRequire(path.join(repo, 'package.json'));
const React = req('react');
const { renderToStaticMarkup } = req('react-dom/server');
const ReactMarkdown = req('react-markdown').default;
const remarkGfm = req('remark-gfm').default;
const matter = req('gray-matter');
const sha = text => crypto.createHash('sha256').update(text).digest('hex');
const checks = JSON.parse(fs.readFileSync(path.join(batch, 'checks/sk-independent-checks.json'), 'utf8'));
const output = path.join(batch, 'checks/sk-independent-render.json');
if (fs.existsSync(output)) throw new Error('Do not replace existing review evidence');
const decode = text => text.replace(/<[^>]*>/g, '')
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
  .replace(/&#([0-9]+);/g, (_, code) => String.fromCodePoint(parseInt(code, 10)))
  .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const rows = checks.rows.map(row => {
  const raw = fs.readFileSync(row.file, 'utf8');
  if (sha(raw) !== row.sha256) throw new Error('Frozen manuscript changed');
  const initial = fs.readFileSync(path.join(batch, 'checks/sk-initial-snapshot', path.basename(row.file)), 'utf8');
  const { data, content } = matter(raw);
  const initialData = matter(initial).data;
  const html = renderToStaticMarkup(React.createElement(ReactMarkdown, { remarkPlugins: [remarkGfm], children: content }));
  const paragraphs = [...html.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(match => decode(match[1]));
  const urls = [...content.matchAll(/\]\((https?:\/\/[^\s)]+)\)/g)].map(match => match[1]);
  return { id: row.id, file: row.file, sha256: row.sha256, frontmatter: data,
    initialFrontmatterChangedKeys: [...new Set([...Object.keys(data), ...Object.keys(initialData)])].filter(key => JSON.stringify(data[key]) !== JSON.stringify(initialData[key])),
    paragraphs, html, requiredOfficialURLsMissing: row.requiredOfficialURLs.filter(url => !urls.includes(url)),
    requiredOfficialURLCount: row.requiredOfficialURLs.length,
    orderedLists: (html.match(/<ol\b/g) || []).length,
    boldMarkupFound: /\*\*|__|<strong\b|<b\b/.test(content),
    bidiControlsFound: /[\u202A-\u202E\u2066-\u2069]/u.test(raw),
    fictionalCaption: data.featured_image_caption,
    imageExists: fs.existsSync(path.join(repo, 'public', data.featured_image)),
    imageSHA: sha(fs.readFileSync(path.join(repo, 'public', data.featured_image))) };
});
if (rows.some(row => row.requiredOfficialURLsMissing.length || row.orderedLists || row.boldMarkupFound || row.bidiControlsFound || !row.imageExists)) throw new Error('Structure/render concern');
fs.writeFileSync(output, JSON.stringify({ atUTC: new Date().toISOString(), scope: 'Actual read-only ReactMarkdown/remarkGfm server render; not browser visual verification or deployment', rows }, null, 2) + '\n');
console.log(JSON.stringify({ output, sha256: sha(fs.readFileSync(output)), rows: rows.map(row => ({ id: row.id, paragraphs: row.paragraphs.length, faq: row.frontmatter.faq.length, initialFrontmatterChangedKeys: row.initialFrontmatterChangedKeys, requiredOfficialURLsMissing: row.requiredOfficialURLsMissing })) }, null, 2));
