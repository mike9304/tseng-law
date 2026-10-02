#!/usr/bin/env node
// Read-only source/sitemap inventory. This never publishes or marks visual QA passed.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import matter from 'gray-matter';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const at = arg.indexOf('=');
  if (at < 0) throw new Error('Use --name=value arguments');
  return [arg.slice(2, at), arg.slice(at + 1)];
}));
const repo = process.cwd();
const ref = args.ref || 'HEAD';
const out = path.resolve(args.out || '.omo/column-videos');
const sitemapPath = args.sitemap;
if (!sitemapPath) throw new Error('--sitemap=<downloaded live sitemap.xml> is required');
const git = (...argv) => execFileSync('git', argv, { cwd: repo, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
const commit = git('rev-parse', ref).trim();
const readSource = (file) => git('show', `${commit}:${file}`);
const files = git('ls-tree', '-r', '--name-only', commit, 'src/content').trim().split('\n');
const localeSource = readSource('src/lib/column-locales.ts');
const directoryLocale = new Map([...localeSource.matchAll(/(?:'([^']+)'|([a-z-]+)):\s*'(src\/content\/columns[^']*)'/g)]
  .map((match) => [match[3], match[1] || match[2]]));
const trafficSource = readSource('src/lib/traffic-collection.ts');
const legacyBlock = trafficSource.split('LEGACY_TRAFFIC_SUBJECT_BY_SLUG')[1]?.split('};')[0] || '';
const trafficSlugs = new Set([...legacyBlock.matchAll(/'([^']+)':\s*'(?:procedure|evidence|liability|compensation)'/g)].map((m) => m[1]));
const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replaceAll('&amp;', '&'));
const live = new Map();
for (const url of urls) {
  const match = new URL(url).pathname.match(/^\/([^/]+)\/columns\/(issues\/)?([^/]+)$/);
  if (!match || (!match[2] && match[3] === 'issues')) continue;
  live.set(`${match[1]}/${match[2] ? 'issue' : 'column'}/${decodeURIComponent(match[3])}`, url);
}
if (!live.size) throw new Error('No article URLs in sitemap; refusing to replace inventory');
const priorPath = path.join(out, 'inventory.json');
const prior = fs.existsSync(priorPath) ? JSON.parse(fs.readFileSync(priorPath, 'utf8')) : null;
const priorRows = new Map((prior?.articles || []).map((row) => [row.key, row]));
const sources = new Map();
for (const file of files) {
  if (!file.endsWith('.md')) continue;
  const issue = file.match(/^src\/content\/issues\/([^/]+)\/ISSUE-\d{8}-\d+-(.+)\.md$/);
  const locale = issue?.[1] || directoryLocale.get(path.posix.dirname(file));
  if (!locale) continue;
  const slug = issue?.[2] || path.posix.basename(file).replace(/^\d+-/, '').replace(/\.md$/, '');
  const source = issue ? 'issue' : 'column';
  const raw = readSource(file);
  const { data, content } = matter(raw);
  const key = `${locale}/${source}/${slug}`;
  if (sources.has(key)) throw new Error(`Duplicate source for ${key}`);
  const tags = Array.isArray(data.tags) ? data.tags : [];
  sources.set(key, {
    key, locale, source, slug, file, title: String(data.title || ''),
    summary: String(data.summary || ''), sourceSha256: crypto.createHash('sha256').update(raw).digest('hex'),
    modified: String(data.lastmod || ''), published: String(data.published || ''),
    traffic: tags.some((tag) => String(tag).startsWith('traffic-')) || (source === 'column' && trafficSlugs.has(slug)),
    diagram: data.diagram ?? data.diagram_video ?? null,
    bodyVideoCandidate: /<(?:iframe|video)\b|youtube\.com\/(?:embed|watch)|youtu\.be\//i.test(content),
    aiAuthor: data.author === 'legal-ai-assistant',
  });
}
const articles = [...live].map(([key, url]) => {
  const [locale, source, slug] = key.split('/');
  const item = sources.get(key) || { key, locale, source, slug, file: null, sourceSha256: null, traffic: false };
  const old = priorRows.get(key);
  const sourceChanged = Boolean(old && item.sourceSha256 !== old.sourceSha256);
  return { ...item, url, listedInLiveSitemap: true,
    firstSeen: old?.firstSeen || new Date().toISOString(),
    changedSincePreviousScan: sourceChanged,
    needsLiveContentReview: !item.file,
    // No generated-video claim follows from a diagram, source link or title.
    videoWorkflow: sourceChanged ? 'needs-source-review' : (old?.videoWorkflow || 'needs-topic-review'),
    videoReview: old?.videoReview || null,
  };
}).sort((a, b) => Number(b.traffic) - Number(a.traffic) || (b.modified || '').localeCompare(a.modified || '') || a.key.localeCompare(b.key));
const groups = new Map();
for (const row of articles) {
  const key = `${row.source}/${row.slug}`;
  const group = groups.get(key) || { key, source: row.source, slug: row.slug, traffic: false, locales: [], urls: [], titles: {} };
  group.traffic ||= row.traffic;
  group.locales.push(row.locale); group.urls.push(row.url);
  if (row.title) group.titles[row.locale] = row.title;
  groups.set(key, group);
}
const counts = {
  publishedArticleUrls: articles.length, distinctArticleSlugs: groups.size,
  locales: new Set(articles.map((row) => row.locale)).size,
  trafficUrls: articles.filter((row) => row.traffic).length,
  trafficSlugs: [...groups.values()].filter((row) => row.traffic).length,
  withoutLocalSource: articles.filter((row) => !row.file).length,
  newUrls: articles.filter((row) => !priorRows.has(row.key)).length,
  changedSources: articles.filter((row) => row.changedSincePreviousScan).length,
};
const inventory = { generatedAt: new Date().toISOString(), commit, sitemapPath: path.resolve(sitemapPath), counts,
  limits: ['Sitemap presence is discovery evidence, not playback or publication QA.', 'CMS overlays and source-less URLs require rendered-page review.', 'Shared slugs across languages still need per-locale topic and disclosure review.'],
  articles, groups: [...groups.values()] };
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(`${priorPath}.tmp`, JSON.stringify(inventory, null, 2) + '\n');
fs.renameSync(`${priorPath}.tmp`, priorPath);
const lines = ['# 칼럼 영상 제작 목록', '', `확인: ${inventory.generatedAt}`, `소스: ${commit}`, '',
  `공개 sitemap: ${counts.publishedArticleUrls}개 언어별 페이지 / ${counts.distinctArticleSlugs}개 고유 글 / ${counts.locales}개 언어.`,
  `교통사고: ${counts.trafficUrls}개 페이지 / ${counts.trafficSlugs}개 고유 글. 로컬 원문 미대응: ${counts.withoutLocalSource}개.`, '',
  '목록 수집은 영상 제작·검수·게시 완료를 뜻하지 않는다. 원문 내용과 실제 공개 페이지를 확인한 뒤 제작한다.', '',
  '| 글 | 언어 | 주제 | 다음 단계 |', '|---|---|---|---|'];
for (const group of groups.values()) {
  const title = group.titles.ko || group.titles.en || group.titles['zh-hant'] || Object.values(group.titles)[0] || group.slug;
  lines.push(`| [${title.replaceAll('|', '\\|')}](${group.urls[0]}) | ${group.locales.join(', ')} | ${group.traffic ? '교통사고' : '기타 칼럼'} | 내용 확인·영상 제작 |`);
}
fs.writeFileSync(path.join(out, 'BACKLOG.md'), lines.join('\n') + '\n');
console.log(JSON.stringify({ commit, ...counts, inventory: priorPath }, null, 2));
