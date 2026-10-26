// Node 24; reads R and frozen research, writes only this batch's lv-* checks.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';

const B = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const R = '/Users/son7/Projects/tseng-law-all-locales-20261025';
const C = path.join(B, 'checks');
const targetDir = path.join(B, 'src/content/columns-lv');
const require = createRequire(path.join(R, 'package.json'));
const matter = require('gray-matter');
const {auditBatch} = await import(pathToFileURL(path.join(R, 'docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs')));
const hash = raw => createHash('sha256').update(raw).digest('hex');
const freeze = JSON.parse(fs.readFileSync(path.join(B, '../batch06/research/source-freeze.json'), 'utf8'));
const auditFile = path.join(R, 'docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs');
if (hash(fs.readFileSync(auditFile)) !== '3926a274bf544fed7e34339aa8b2636d41a4be79c0aaff898f46fc65595faf4b') throw new Error('Root audit SHA changed');
const sources = freeze.canonical_rows.map(row => ({...row, filename: path.basename(row.canonical_path), source: path.join(B, '../batch06/research', row.current_snapshot)}));
const files = fs.readdirSync(targetDir).filter(name => name.endsWith('.md')).sort();
if (files.length !== 6 || files.some(name => !sources.some(row => row.filename === name))) throw new Error('Expected the exact six assigned LV filenames');
for (const source of sources) if (hash(fs.readFileSync(source.source)) !== source.current_sha256) throw new Error(`Source SHA changed: ${source.filename}`);

const union = fs.mkdtempSync(path.join(C, 'lv-audit-context-'));
const reports = [];
try {
  for (const name of fs.readdirSync(path.join(R, 'src/content'))) {
    if (name.startsWith('columns') && name !== 'columns-lv') fs.symlinkSync(path.join(R, 'src/content', name), path.join(union, name));
  }
  fs.mkdirSync(path.join(union, 'columns-lv'));
  for (const name of fs.readdirSync(path.join(R, 'src/content/columns-lv'))) {
    if (!files.includes(name)) fs.symlinkSync(path.join(R, 'src/content/columns-lv', name), path.join(union, 'columns-lv', name));
  }
  for (const name of files) fs.symlinkSync(path.join(targetDir, name), path.join(union, 'columns-lv', name));
  for (const sourceLocale of ['en', 'zh-hant']) {
    const selected = sources.filter(row => ['921'].includes(row.filename.slice(0, 3)) && row.current_snapshot.startsWith(sourceLocale === 'en' ? 'canonical-snapshots/en-' : 'canonical-snapshots/zh-'));
    if (!selected.length) continue;
    const aliasDir = path.join(union, '_accepted-snapshots', sourceLocale);
    fs.mkdirSync(aliasDir, {recursive: true});
    const sourceMap = {};
    for (const source of selected) {
      // Preserve the runtime filename while reading the frozen snapshot bytes.
      const alias = path.join(aliasDir, source.filename);
      fs.symlinkSync(source.source, alias);
      sourceMap[`lv:${source.filename.replace(/^\d+-/, '').replace(/\.md$/, '')}`] = alias;
    }
    const report = await auditBatch({repoRoot: R, contentRoot: union, files: selected.map(row => path.join(union, 'columns-lv', row.filename)), sourceLocale, sourceMap, publicationDate: '2026-10-26'});
    report.auditContext = {method: 'Read-only R content symlink union, six local LV drafts, accepted snapshot aliases with exact original filenames.',frozenSources: selected.map(row => ({filename: row.filename, snapshot: row.source, sha256: row.current_sha256}))};
    reports.push(report);
  }
} finally {
  fs.rmSync(union, {recursive: true, force: true});
}
const compactReports = reports.map(report => ({...report, files: report.files.map(row => ({...row, reviews: row.reviews.map(item => ({code: item.code, status: item.status, message: item.message, ...('sourceOnly' in item ? {sourceOnly: item.sourceOnly, targetOnly: item.targetOnly, spelledOutNumerals: item.spelledOutNumerals} : {})}))}))}));
// Keep actual mandatory review flags and numeric deltas; full source/target text remains in SHA-bound files.
fs.writeFileSync(path.join(C, 'lv-content-audit-author-r2.json'), JSON.stringify(compactReports, null, 2) + '\n');

const urls = text => new Set([...text.matchAll(/https?:\/\/[^\s)<>"\]]+/g)].map(match => match[0]));
const rows = files.filter(filename => ['921'].includes(filename.slice(0, 3))).map(filename => {
  const source = sources.find(row => row.filename === filename);
  const absolute = path.join(targetDir, filename);
  const raw = fs.readFileSync(absolute);
  const {data, content} = matter(raw.toString());
  const canonical = matter(fs.readFileSync(source.source, 'utf8'));
  const errors = [];
  const check = (condition, label) => { if (!condition) errors.push(label); };
  const id = filename.slice(0, 3);
  check(data.published === '2026-10-26' && data.lastmod === '2026-10-26', 'publication/lastmod');
  check(data.date_display === '2026. gada 26. oktobris', 'Latvian display date');
  check(JSON.stringify(data.audience) === '["lv"]', 'explicit lv audience');
  check(data.author === 'legal-ai-assistant', 'internal author');
  check(data.topic === (id === '919' ? 'labor' : id === '916' ? 'company' : 'litigation'), 'required topic');
  check(data.featured_image === canonical.data.featured_image && fs.existsSync(path.join(R, 'public', data.featured_image)), 'same existing source image');
  check(data.featured_image_caption === 'Izdomāta aina', 'exact fictional caption');
  for (const key of ['title', 'summary', 'read_time', 'featured_image_alt']) check(typeof data[key] === 'string' && data[key].trim().length > 0, `nonempty ${key}`);
  if (canonical.data.seoTitle) check(typeof data.seoTitle === 'string' && data.seoTitle.length > 0, 'localized seoTitle retained');
  check(Array.isArray(data.categories) && data.categories.length > 0 && Array.isArray(data.tags) && data.tags.length > 0, 'categories and tags');
  check(data.faq?.length === (id === '915' ? 2 : 3) && data.faq.every(item => typeof item.q === 'string' && item.q.trim() && typeof item.a === 'string' && item.a.trim()), 'source FAQ count and nonempty pairs');
  check(!/[\u200b\u200c\u200d\u202a-\u202e\u2066-\u2069]/u.test(raw.toString()), 'no invisible/bidi controls');
  check(!/^# /m.test(content), 'no body H1');
  check(!/\*\*|__|<(?:strong|b)(?:\s|>)/i.test(content), 'no decorative bold');
  const [prose, footer] = content.split('## Oficiālie avoti');
  check(Boolean(footer), 'Latvian official source list');
  const all = urls(content), inline = urls(prose), end = urls(footer ?? '');
  const missingSource = [...urls(canonical.content)].filter(url => !all.has(url) || !end.has(url));
  const missingFooter = [...inline].filter(url => !end.has(url));
  check(missingSource.length === 0, 'all canonical official URLs retained in final list');
  check(missingFooter.length === 0, 'all inline official URLs also in final list');
  check(content.includes('2026. gada 25. oktobrī') && content.includes('26. oktobrī'), 'case/current-text check dates');
  return {file: absolute, sha256: hash(raw), bytes: raw.length, source: source.source, sourceSHA256: source.current_sha256, faqCount: data.faq.length, officialURLs: [...all], missingSource, missingFooter, errors};
});
const errors = reports.reduce((total, report) => total + report.errors, 0) + rows.reduce((total, row) => total + row.errors.length, 0);
const result = {checkedAt: new Date().toISOString(), node: process.version, scope: 'Structural and actual repository visibility checks. No browser/public rendering, human native-language approval or legal approval is asserted.', errors, auditErrors: reports.reduce((total, report) => total + report.errors, 0), automatedStatus: errors ? 'FAIL' : 'PASS', semanticStatus: 'REVIEW_REQUIRED', publicationReady: false, requiredSemanticItems: reports.reduce((total, report) => total + report.reviewItems, 0), visibleUnderRuntimeFilter: reports.flatMap(report => report.files).filter(row => row.board.visible).length, rows};
if (!Number.isInteger(result.requiredSemanticItems) || result.requiredSemanticItems !== reports.flatMap(report => report.files).reduce((total, row) => total + row.reviews.length, 0)) throw new Error('Review-count report contract mismatch');
fs.writeFileSync(path.join(C, 'lv-structure-author-r2.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({automatedStatus: result.automatedStatus, errors, requiredSemanticItems: result.requiredSemanticItems, visibleUnderRuntimeFilter: result.visibleUnderRuntimeFilter, rows: rows.map(({file, sha256, faqCount, officialURLs, errors}) => ({file, sha256, faqCount, officialURLs: officialURLs.length, errors}))}, null, 2));
for (const report of reports) for (const row of report.files) for (const error of row.errors) console.error(row.file, error.code, error.message);
process.exitCode = errors ? 1 : 0;
