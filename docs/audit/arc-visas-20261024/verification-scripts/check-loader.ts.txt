import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getAllColumnPosts, fileBackedColumnAlternateLocales } from '../repo/src/lib/columns';
import { collectColumnSitemapRecords } from '../repo/src/lib/column-locales';
import { filterMarketBoardColumns } from '../repo/src/data/market-column-curation';

const root = '/Users/son7/tseng-arc-visas-20261024';
const locales = ['ko','en','ja','vi','zh-hant','th','id','hi','fr','de','it','es','pt','ar'];
const slugs = ['taiwan-arc-first-application','taiwan-visa-residence-work-study-family','taiwan-arc-renewal-changes-reentry'];
const errors: string[] = [];
const found: object[] = [];
const sitemap = collectColumnSitemapRecords({ postsForLocale: locale => getAllColumnPosts(locale) });
for (const locale of locales) {
  const posts = getAllColumnPosts(locale as never);
  for (const [i, slug] of slugs.entries()) {
    const matches = posts.filter(post => post.slug === slug);
    if (matches.length !== 1) {errors.push(`${locale}/${slug}: found ${matches.length}`);continue;}
    const p = matches[0];
    if (p.columnNumber !== 704+i || p.topic !== 'visa' || p.publicationDate !== '2026-10-24') errors.push(`${locale}/${slug}: number/topic/date`);
    if (!p.aiAuthored || !p.audience?.includes(locale as never) || p.faq?.length !== 3) errors.push(`${locale}/${slug}: provenance/audience/FAQ`);
    if (!p.title || !p.summary || !p.seoTitle || p.content.length < 1000) errors.push(`${locale}/${slug}: incomplete authored text`);
    if (!filterMarketBoardColumns(locale, posts).some(post => post.slug === slug)) errors.push(`${locale}/${slug}: absent from current market board`);
    const row = sitemap.find(x => x.locale === locale && x.path === `/columns/${slug}`);
    if (!row || row.alternateLocales.length !== locales.length) errors.push(`${locale}/${slug}: sitemap/alternates`);
    const alts = [...fileBackedColumnAlternateLocales(slug)].sort();
    if (JSON.stringify(alts) !== JSON.stringify([...locales].sort())) errors.push(`${locale}/${slug}: alternate-language set`);
    found.push({locale,slug,title:p.title,columnNumber:p.columnNumber,topic:p.topic,date:p.publicationDate,alternateLocales:alts});
  }
}
const baseline = JSON.parse(fs.readFileSync(path.join(root,'work/corpus-baseline.json'),'utf8'));
const upstream = JSON.parse(fs.readFileSync(path.join(root,'work/corpus-upstream-baseline.json'),'utf8'));
for (const item of [...baseline, ...upstream.articles]) {
  const file=path.join(root,'repo',item.path);
  const actual=fs.existsSync(file)?crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'):null;
  if (actual !== item.sha256) errors.push(`existing article changed: ${item.path}`);
}
fs.mkdirSync(path.join(root,'work/checks'),{recursive:true});
fs.writeFileSync(path.join(root,'work/checks/loader-audit.json'),JSON.stringify({checkedAt:new Date().toISOString(),expected:42,actual:found.length,preserved:baseline.length,preservedUpstream:upstream.articles.length,upstreamCommit:upstream.commit,errors,found},null,2)+'\n');
console.log(JSON.stringify({articles:found.length,preservedInitialArticles:baseline.length,preservedUpstreamArticles:upstream.articles.length,errors:errors.length}));
for(const error of errors)console.error(error);
process.exitCode=errors.length?1:0;
