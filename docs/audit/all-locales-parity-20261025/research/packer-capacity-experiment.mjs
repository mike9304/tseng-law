// Read-only, offline capacity experiment. It never invokes packSite, build, push or deploy.
// Inputs are public HTML captures, the current repository's fonts and a historical static build.
// Run with Node 24: node <this-file> [capture-directory] [historical-static-directory]
// JSON is written only to stdout; redirect it to an audit result if desired.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';

const root = process.argv[2] || '/private/tmp/tseng-packer-experiment-20261025';
const historicalStatic = process.argv[3] || '/Users/son7/Projects/tseng-law-traffic-scenes-20261014/.next-static/static';
const baseline = 'ef3b24e73d84968eea08ea9d58e991ccbbf83fa8';
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const json = (value) => Buffer.from(JSON.stringify(value));
const gzip = (b) => zlib.gzipSync(b, { level: 9 });
const brotli = (b, quality = 9) => zlib.brotliCompressSync(b, {
  params: { [zlib.constants.BROTLI_PARAM_QUALITY]: quality },
});
const equal = (a, b, label) => { if (!a.equals(b)) throw new Error(`Round-trip failed: ${label}`); };
const captures = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const input = captures.map((entry) => {
  if (!entry.path || entry.error) throw new Error('Incomplete public capture manifest');
  const bytes = fs.readFileSync(entry.path);
  if (sha(bytes) !== entry.sha256) throw new Error(`Input changed: ${entry.path}`);
  return { ...entry, bytes };
});
const localeCounts = new Map();
for (const item of input) localeCounts.set(item.locale, (localeCounts.get(item.locale) || 0) + 1);
if (localeCounts.size !== 49 || [...localeCounts.values()].some((n) => n !== 3)) {
  throw new Error('Expected three exploratory source-size quantile samples in each of 49 locales');
}

const pageRows = input.map((entry) => {
  const gz = gzip(entry.bytes), br9 = brotli(entry.bytes), br11 = brotli(entry.bytes, 11);
  equal(zlib.gunzipSync(gz), entry.bytes, 'gzip page');
  equal(zlib.brotliDecompressSync(br9), entry.bytes, 'brotli9 page');
  equal(zlib.brotliDecompressSync(br11), entry.bytes, 'brotli11 page');
  return { locale: entry.locale, source: entry.source, url: entry.url, sha256: entry.sha256,
    raw: entry.bytes.length, gzip9: gz.length, br9: br9.length, br11: br11.length };
});
const pageTotals = pageRows.reduce((acc, row) => {
  for (const key of ['raw', 'gzip9', 'br9', 'br11']) acc[key] += row[key];
  return acc;
}, { raw: 0, gzip9: 0, br9: 0, br11: 0 });

// Deterministic Gear-style content-defined boundaries, not a production codec specification.
// Cuts end after an ASCII byte so a valid UTF-8 input is never split inside a code point.
// The exact byte comparison rejects lossy decoding of any unexpected input.
const gear = Array.from({ length: 256 }, (_, i) => crypto.createHash('sha256')
  .update(Buffer.from([i])).digest().readUInt32LE(0));
function chunks(bytes, nominal) {
  let start = 0, rolling = 0;
  const result = [];
  for (let i = 0; i < bytes.length; i += 1) {
    rolling = ((rolling << 1) + gear[bytes[i]]) >>> 0;
    const length = i + 1 - start;
    if (length >= nominal / 4 && bytes[i] < 128
      && ((rolling & (nominal - 1)) === 0 || length >= nominal * 4)) {
      result.push(bytes.subarray(start, i + 1).toString('utf8'));
      start = i + 1;
      rolling = 0;
    }
  }
  if (start < bytes.length) result.push(bytes.subarray(start).toString('utf8'));
  equal(Buffer.from(result.join('')), bytes, 'chunk boundaries');
  return result;
}
const timing = (values) => ({ meanMs: values.reduce((a, b) => a + b, 0) / values.length,
  p95Ms: [...values].sort((a, b) => a - b)[Math.floor(values.length * 0.95)] });
const dictionaryCases = [];
for (const nominal of [64, 128, 256, 512, 1024, 2048, 4096]) {
  const all = input.map((entry) => chunks(entry.bytes, nominal));
  const occurrences = new Map();
  for (const list of all) for (const piece of new Set(list)) {
    occurrences.set(piece, (occurrences.get(piece) || 0) + 1);
  }
  // Count different pages, not repeated occurrences within one page.
  const dictionary = [...occurrences].filter(([, n]) => n >= 2).map(([piece]) => piece);
  const ids = new Map(dictionary.map((piece, i) => [piece, i]));
  const dictionaryBytes = json(dictionary), dictionaryGzip = gzip(dictionaryBytes), dictionaryBr = brotli(dictionaryBytes);
  const gzipTimes = [], brTimes = [];
  const rows = all.map((list, i) => {
    const encoded = list.map((piece) => ids.has(piece) ? ids.get(piece) : piece);
    const bytes = json(encoded), gz = gzip(bytes), br = brotli(bytes);
    for (const [blob, decode, times] of [[gz, zlib.gunzipSync, gzipTimes], [br, zlib.brotliDecompressSync, brTimes]]) {
      const start = performance.now();
      const rebuilt = Buffer.from(JSON.parse(decode(blob)).map((value) => typeof value === 'number' ? dictionary[value] : value).join(''));
      times.push(performance.now() - start);
      equal(rebuilt, input[i].bytes, `dictionary page ${i}`);
    }
    return { locale: input[i].locale, source: input[i].source, pieces: encoded.length,
      references: encoded.filter((value) => typeof value === 'number').length,
      jsonBytes: bytes.length, gzip9: gz.length, br9: br.length };
  });
  const pageGzip = rows.reduce((n, row) => n + row.gzip9, 0), pageBr = rows.reduce((n, row) => n + row.br9, 0);
  const startGzip = performance.now();
  equal(json(JSON.parse(zlib.gunzipSync(dictionaryGzip))), dictionaryBytes, 'shared gzip dictionary');
  const coldDictionaryGzipMs = performance.now() - startGzip;
  const startBr = performance.now();
  equal(json(JSON.parse(zlib.brotliDecompressSync(dictionaryBr))), dictionaryBytes, 'shared brotli dictionary');
  const coldDictionaryBrMs = performance.now() - startBr;
  dictionaryCases.push({ nominalChunkBytes: nominal, dictionaryEntries: dictionary.length,
    dictionaryRaw: dictionaryBytes.length, dictionaryGzip: dictionaryGzip.length, dictionaryBr9: dictionaryBr.length,
    pageGzip, pageBr9: pageBr, totalGzip: pageGzip + dictionaryGzip.length, totalBr9: pageBr + dictionaryBr.length,
    roundTripPages: input.length, projectedProfessionalGzip: pageGzip / 3 * 286 + dictionaryGzip.length,
    projectedProfessionalBr9: pageBr / 3 * 286 + dictionaryBr.length,
    nodeOnlyDecodeTiming: { warmGzip: timing(gzipTimes), warmBr: timing(brTimes), coldDictionaryGzipMs, coldDictionaryBrMs }, rows });
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory()
    ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
}
const assetRoots = ['public/fonts', historicalStatic], assets = {};
for (const directory of assetRoots) for (const file of walk(directory)) {
  const extension = path.extname(file);
  if (!['.woff2', '.js', '.css', '.txt', '.md'].includes(extension)) continue;
  const bytes = fs.readFileSync(file), quality = extension === '.woff2' ? 4 : 9;
  const gz = gzip(bytes), br = brotli(bytes, quality);
  equal(zlib.gunzipSync(gz), bytes, 'gzip asset');
  equal(zlib.brotliDecompressSync(br), bytes, 'brotli asset');
  const group = assets[extension] ||= { files: 0, raw: 0, gzip9: 0, brotli: 0, brotliQuality: quality };
  group.files++; group.raw += bytes.length; group.gzip9 += gz.length; group.brotli += br.length;
}

// Synthetic size model only: these translated articles do not yet exist.
// Keep every 50-entry alternate cluster while splitting by locale.
const locales = [...localeCounts.keys()].sort();
const sourcePaths = execFileSync('git', ['ls-tree', '-r', '--name-only', baseline, '--', 'src/content/columns-zh'], { encoding: 'utf8' }).trim().split('\n');
const slugs = sourcePaths.filter((p) => p.endsWith('.md')).map((p) => path.basename(p, '.md').replace(/^\d+-/, ''));
if (slugs.length !== 286) throw new Error('Synthetic catalogue source changed');
const header = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
const tag = (locale) => ({ 'zh-hant': 'zh-Hant', 'zh-hans': 'zh-Hans' }[locale] || locale);
const url = (locale, slug) => `https://tseng-law.com/${locale}/columns/${slug}`;
function sitemapRow(locale, slug) {
  const alternate = [...locales.map((other) => `<xhtml:link rel="alternate" hreflang="${tag(other)}" href="${url(other, slug)}" />\n`),
    `<xhtml:link rel="alternate" hreflang="x-default" href="${url('ko', slug)}" />\n`].join('');
  return `<url>\n<loc>${url(locale, slug)}</loc>\n${alternate}<lastmod>2026-10-25T00:00:00.000Z</lastmod>\n<priority>0.8</priority>\n</url>\n`;
}
const localeSitemaps = locales.map((locale) => Buffer.from(header + slugs.map((slug) => sitemapRow(locale, slug)).join('') + '</urlset>\n'));
const singleSitemap = Buffer.from(header + locales.flatMap((locale) => slugs.map((slug) => sitemapRow(locale, slug))).join('') + '</urlset>\n');
const currentXml = fs.readFileSync(path.join(root, 'sitemap.xml'));
const sitemap = { syntheticOnly: true, urls: 14014, alternatesPerRow: 50,
  singleXml: singleSitemap.length, singleGzip9: gzip(singleSitemap).length,
  perLocaleFiles: localeSitemaps.length, perLocaleMaxXml: Math.max(...localeSitemaps.map((b) => b.length)),
  perLocaleSumXml: localeSitemaps.reduce((n, b) => n + b.length, 0),
  perLocaleSumGzip9: localeSitemaps.reduce((n, b) => n + gzip(b).length, 0),
  currentXml: currentXml.length, currentXmlGzip9: gzip(currentXml).length };

// Sensitivity check: fit the dictionary on each locale's first two source-size quantiles,
// then encode its third (75th-percentile) page without adding any of its chunks.
// This is deliberately not a random holdout or a full-target prediction.
const training = [], heldOut = [], seenLocales = new Map();
for (const entry of input) {
  const seen = seenLocales.get(entry.locale) || 0;
  (seen < 2 ? training : heldOut).push(entry);
  seenLocales.set(entry.locale, seen + 1);
}
const trainingOccurrences = new Map();
for (const entry of training) for (const piece of new Set(chunks(entry.bytes, 64))) {
  trainingOccurrences.set(piece, (trainingOccurrences.get(piece) || 0) + 1);
}
const frozenDictionary = [...trainingOccurrences].filter(([, n]) => n >= 2).map(([piece]) => piece);
const frozenIds = new Map(frozenDictionary.map((piece, i) => [piece, i]));
const frozenBytes = brotli(json(frozenDictionary));
const heldOutRows = heldOut.map((entry) => {
  const encoded = chunks(entry.bytes, 64).map((piece) => frozenIds.has(piece) ? frozenIds.get(piece) : piece);
  const blob = brotli(json(encoded));
  equal(Buffer.from(JSON.parse(zlib.brotliDecompressSync(blob)).map((value) => typeof value === 'number'
    ? frozenDictionary[value] : value).join('')), entry.bytes, 'held-out dictionary page');
  return { locale: entry.locale, source: entry.source, br9: blob.length };
});
const heldOutSensitivity = { trainingPages: training.length, heldOutPages: heldOut.length,
  dictionaryBr9: frozenBytes.length, pageBr9: heldOutRows.reduce((n, row) => n + row.br9, 0),
  description: 'Fixed dictionary from q25/q50; held-out q75 pages, not random. No future dictionary growth credit.',
  rows: heldOutRows };
console.log(JSON.stringify({ runtime: process.versions, baseline, inputDirectory: root,
  captureManifestSha256: sha(fs.readFileSync(path.join(root, 'manifest.json'))),
  pageTotals, pageRows, dictionaryCases, assetRoots, assets, sitemap, heldOutSensitivity,
  limitations: 'Exploratory samples and synthetic URLs are not a full-target build or deployment. Node timings are not Worker CPU measurements. No hosting settings changed.' }, null, 2));
