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
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const old = JSON.parse(fs.readFileSync(path.join(batch, 'checks/sl-render-metadata-r2.json'), 'utf8'));
const out = path.join(batch, 'checks/sl-render-metadata-review-r2.json');
if (fs.existsSync(out)) throw new Error('Evidence already exists');
const decode = text => text.replace(/<[^>]*>/g, '')
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
  .replace(/&#([0-9]+);/g, (_, code) => String.fromCodePoint(parseInt(code, 10)))
  .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const rows = old.rows.map(previous => {
  const raw = fs.readFileSync(previous.path, 'utf8');
  if (!['916', '920'].includes(String(previous.id))) {
    if (sha(raw) !== previous.sha256) throw new Error('Unchanged source differs');
    return { ...previous, renderExecution: 'Reused exact unchanged source SHA from original render' };
  }
  const { data, content } = matter(raw);
  const initial = matter(fs.readFileSync(path.join(batch, 'checks/sl-initial-snapshot', path.basename(previous.path)), 'utf8')).data;
  const html = renderToStaticMarkup(React.createElement(ReactMarkdown, { remarkPlugins: [remarkGfm], children: content }));
  const renderedParagraphs = [...html.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(match => decode(match[1]));
  const urlSequence = [...content.matchAll(/\]\((https?:\/\/[^\s)]+)\)/g)].map(match => match[1]);
  const officialUniqueURLs = [...new Set(urlSequence)];
  const sourceBytes = fs.readFileSync(previous.sourcePath);
  if (sha(sourceBytes) !== previous.sourceSHA) throw new Error('Frozen source changed');
  const sourceURLMissing = previous.officialUniqueURLs.filter(url => !officialUniqueURLs.includes(url));
  const frontmatterChangedKeys = [...new Set([...Object.keys(initial), ...Object.keys(data)])]
    .filter(key => JSON.stringify(initial[key]) !== JSON.stringify(data[key]));
  return { ...previous, sha256: sha(raw), frontmatter: data, frontmatterChangedKeys,
    faqUnchanged: JSON.stringify(initial.faq) === JSON.stringify(data.faq),
    renderedParagraphs, html, orderedListCount: (html.match(/<ol\b/g) || []).length,
    tableCount: (html.match(/<table\b/g) || []).length,
    officialUniqueURLs, sourceURLMissing,
    boldMarkupFound: /\*\*|__|<strong\b|<b\b/.test(content),
    renderExecution: 'Actual ReactMarkdown and remarkGfm server render of changed source; not a browser/build/deployment' };
});
if (rows.some(row => row.sourceURLMissing.length || row.orderedListCount || row.boldMarkupFound)) throw new Error('Render or source integrity concern');
fs.writeFileSync(out, JSON.stringify({ at: new Date().toISOString(), scope: 'Changed 916/920 rendered; other four reused by exact SHA; author and independent R1 evidence preserved', rows }, null, 2) + '\n');
console.log(JSON.stringify({ output: out, sha256: sha(fs.readFileSync(out)), rows: rows.map(row => ({ id: row.id, paragraphs: row.renderedParagraphs.length, frontmatterChangedKeys: row.frontmatterChangedKeys, sourceURLMissing: row.sourceURLMissing })) }, null, 2));
