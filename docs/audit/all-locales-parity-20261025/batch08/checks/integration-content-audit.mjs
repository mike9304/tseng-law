import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { auditBatch } from '/Users/son7/Projects/tseng-law-all-locales-20261025/docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs';
const R = '/Users/son7/Projects/tseng-law-all-locales-20261025';
const B = '/Users/son7/tseng-all-language-columns-20261025/batch08';
const require = createRequire(path.join(R, 'package.json'));
const matter = require('gray-matter');
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const write = (name, value) => fs.writeFileSync(path.join(B, 'checks', name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const frozen = JSON.parse(fs.readFileSync(path.join(B, 'checks/integration-readiness-manifest.json')));
const dates = { fi: '26. lokakuuta 2026', hr: '26. listopada 2026.', hu: '2026. október 26.', is: '26. október 2026', km: '26 តុលា 2026', lv: '2026. gada 26. oktobris', mn: '2026 оны 10 дугаар сарын 26' };
const captions = { fi: 'Kuvitteellinen kohtaus', hr: 'Izmišljena scena', hu: 'Kitalált jelenet', is: 'Skálduð mynd', km: 'ឈុតឆាកប្រឌិត', lv: 'Izdomāta aina', mn: 'Зохиомол дүр зураг' };
const englishContactMarker = { fi: 'englanninkielis', hr: 'na engleskom', hu: 'angol nyelvű', is: 'ensku', km: 'ភាសាអង់គ្លេស', lv: 'angļu valodā', mn: 'англи хэл' };
const urls = (text) => [...new Set([...text.matchAll(/https?:\/\/[^\s<>)"\]]+/g)].map(([url]) => url).filter(url => !new URL(url).hostname.endsWith('tseng-law.com')))].sort();
const metadata = [];
for (const row of frozen.files) {
  const errors = [];
  const filename = path.basename(row.destination);
  const id = filename.slice(0, 3);
  const text = fs.readFileSync(row.destination, 'utf8');
  const sourceText = fs.readFileSync(row.canonical_path, 'utf8');
  const { data } = matter(text);
  const check = (ok, message) => { if (!ok) errors.push(message); };
  check(sha(row.destination) === row.sha256 && sha(row.path) === row.sha256, 'copy/freeze SHA mismatch');
  check(sha(row.canonical_path) === row.canonical_sha256, 'canonical SHA mismatch');
  check(data.published === '2026-10-26' && data.lastmod === '2026-10-26', 'publication/lastmod');
  check(data.date_display === dates[row.locale], 'localized display date');
  check(JSON.stringify(data.audience) === JSON.stringify([row.locale]), 'own-language audience');
  check(data.author === 'legal-ai-assistant', 'internal author');
  check(data.topic === (id === '916' ? 'company' : id === '919' ? 'labor' : 'litigation'), 'topic');
  check(data.featured_image === `/images/columns/${id}-case-trends-20261025.webp`, 'original image');
  check(data.featured_image_caption === captions[row.locale], 'fictional scene caption');
  check(typeof data.featured_image_alt === 'string' && !!data.featured_image_alt.trim(), 'localized image alt');
  check(Array.isArray(data.faq) && data.faq.length === row.faq_count_expected && data.faq.every(x => x.q?.trim() && x.a?.trim()), 'FAQ completeness/count');
  check(!!data.title?.trim() && !!data.summary?.trim() && !!data.read_time?.trim(), 'title/summary/read time');
  const contactLabels = [...text.matchAll(/\[([^\]]+)\]\(\/en\/contact\)/g)].map(match => match[1]);
  check((id === '915' || id === '916') ? contactLabels.length === 1 && contactLabels.every(label => label.toLowerCase().includes(englishContactMarker[row.locale])) : contactLabels.length === 0, 'English contact destination explicitly labeled');
  const targetURLs = urls(text), sourceURLs = urls(sourceText);
  check(JSON.stringify(targetURLs) === JSON.stringify(sourceURLs), 'exact source external URL set');
  check(matter(sourceText).data.published === '2026-10-25', 'original publication date preserved');
  metadata.push({ file: row.destination, sha256: sha(row.destination), locale: row.locale, topic: data.topic,
    published: data.published, lastmod: data.lastmod, dateDisplay: data.date_display, audience: data.audience,
    image: data.featured_image, caption: data.featured_image_caption, faqCount: data.faq?.length,
    canonical: row.canonical_path, sourceURLs, targetURLs, englishContactLabels: contactLabels, errors });
}
const reports = [];
for (const sourceLocale of ['en', 'zh-hant']) {
  const selected = frozen.files.filter(row => sourceLocale === 'en' ? /\/(915|916)-/.test(row.destination) : !/\/(915|916)-/.test(row.destination));
  const sourceMap = Object.fromEntries(selected.map(row => [path.relative(R, row.destination), row.canonical_path]));
  reports.push(await auditBatch({ repoRoot: R, files: selected.map(row => row.destination), sourceLocale, sourceMap, publicationDate: '2026-10-26' }));
}
const output = { at: new Date().toISOString(), auditor: { path: path.join(R, 'docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs'), sha256: sha(path.join(R, 'docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs')) },
  selectedFiles: frozen.files.length, errors: reports.reduce((n, r) => n + r.errors, 0), reviewItems: reports.reduce((n, r) => n + r.reviewItems, 0), semanticStatus: 'REVIEW_REQUIRED', publicationReady: false, reports };
const meta = { at: new Date().toISOString(), selectedFiles: metadata.length, errors: metadata.reduce((n, r) => n + r.errors.length, 0), faqTotal: metadata.reduce((n, r) => n + r.faqCount, 0), files: metadata };
write('integration-content-audit.json', output);
write('integration-metadata.json', meta);
console.log(JSON.stringify({ files: output.selectedFiles, errors: output.errors, reviewItems: output.reviewItems, metadataErrors: meta.errors, faqTotal: meta.faqTotal,
  errorRows: [...metadata.filter(r => r.errors.length), ...reports.flatMap(r => r.files.filter(f => f.errors.length))] }, null, 2));
process.exitCode = output.errors || meta.errors ? 1 : 0;
