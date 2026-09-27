import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { expect, test } from '@playwright/test';
import { publicDocumentLanguage } from '@/lib/public-guidance';

const root = path.resolve(__dirname, '../..');
// The attested QA harness binds canonical URLs to its own loopback origin.
const baseUrl = process.env.BASE_URL;
const directories = {
  ko: 'columns', ja: 'columns-ja', en: 'columns-en', vi: 'columns-vi',
  id: 'columns-id', th: 'columns-th', fil: 'columns-fil',
  'zh-hant': 'columns-zh', 'zh-hans': 'columns-zh-hans',
} as const;
const slugs = [
  'taiwanese-spouse-divorce-agreement-registration',
  'taiwanese-spouse-divorce-from-abroad',
  'taiwanese-spouse-divorce-cross-border-parenting',
];

for (const [localeValue, directory] of Object.entries(directories)) {
  const locale = localeValue as keyof typeof directories;
  for (const [index, slug] of slugs.entries()) {
    test(`${locale}/${slug}: native body, FAQ, Article, nine alternates and contact`, async ({ page }, testInfo) => {
      const file = `${String(index + 19).padStart(3, '0')}-${slug}.md`;
      const { data } = matter(fs.readFileSync(path.join(root, 'src/content', directory, file), 'utf8'));
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.setViewportSize(index === 2 ? { width: 390, height: 844 } : { width: 1440, height: 1000 });
      const response = await page.goto(`/${locale}/columns/${slug}`, { waitUntil: 'networkidle' });
      expect(response?.status()).toBe(200);
      const skip = page.locator('a.cinematic-opening__scroll').first();
      if (await skip.isVisible().catch(() => false)) await skip.click();
      await expect(page.locator('html')).toHaveAttribute('lang', publicDocumentLanguage(locale));
      await expect(page.locator('h1.blog-hero-title')).toHaveText(data.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', data.summary);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${baseUrl}/${locale}/columns/${slug}`);
      const alternates = await page.locator('link[rel="alternate"][hreflang]').evaluateAll(elements => elements.map(el => ({lang:el.getAttribute('hreflang'),href:el.getAttribute('href')})));
      for (const authoredLocale of Object.keys(directories) as Array<keyof typeof directories>) {
        expect(alternates).toContainEqual({lang:publicDocumentLanguage(authoredLocale),href:`${baseUrl}/${authoredLocale}/columns/${slug}`});
      }
      expect(alternates.filter(row => row.lang !== 'x-default')).toHaveLength(9);
      const schema = await page.locator('script[type="application/ld+json"]').evaluateAll(elements => elements.flatMap(el => {
        const value = JSON.parse(el.textContent ?? '{}');
        return Array.isArray(value) ? value : value['@graph'] ?? [value];
      }));
      const article = schema.find(value => value['@type'] === 'Article');
      expect(article?.headline).toBe(data.title);
      expect(article?.datePublished).toBe('2026-09-27');
      expect(article?.author?.['@type']).toBe('Person');
      expect(article?.author?.['@id']).toContain('#person');
      const faq = schema.find(value => value['@type'] === 'FAQPage');
      expect(faq?.mainEntity).toHaveLength(data.faq.length);
      for (const entry of data.faq) await expect(page.getByText(entry.q, { exact: true })).toBeVisible();
      await expect(page.locator('a[href="mailto:wei@hoveringlaw.com.tw"]').first()).toBeAttached();
      await expect(page.locator(`a[href="/${locale}/columns/taiwan-divorce-lawsuit-qna"]`).first()).toBeAttached();
      await page.locator('h1.blog-hero-title').scrollIntoViewIfNeeded();
      if (index === 0 || index === 2) await page.screenshot({ path:testInfo.outputPath(`${locale}-${index === 2 ? 'mobile' : 'desktop'}.png`), fullPage:true });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
      expect(errors).toEqual([]);
    });
  }
}

test('sitemap lists all 27 authored divorce URLs', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const xml = await response.text();
  for (const locale of Object.keys(directories)) {
    for (const slug of slugs) expect(xml).toContain(`<loc>${baseUrl}/${locale}/columns/${slug}</loc>`);
  }
});
