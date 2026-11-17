import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { ColumnPost } from '@/lib/columns';

const corpus = vi.hoisted(() => ({ posts: {} as Record<string, ColumnPost[]> }));
vi.mock('@/lib/columns', () => ({ getAllColumnPosts: (locale: string) => corpus.posts[locale] ?? [] }));
vi.mock('next/navigation', () => ({ notFound: () => { throw Error('NOT_FOUND'); } }));

import Page, { generateMetadata, generateStaticParams } from '../page';

function posts(topic: string, count: number): ColumnPost[] {
  return Array.from({ length: count }, (_, i) => ({
    slug: `${topic}-${i}`, title: `${topic} article ${i}`, topic, date: '2026-11-06',
  } as ColumnPost));
}
corpus.posts = {
  ko: [...posts('family', 7), ...posts('tax', 1)],
  'zh-hant': posts('family', 1), en: posts('family', 5), vi: posts('tax', 1),
};
const params = (locale: string, topic: string) => ({ params: Promise.resolve({ locale, topic }) });

describe('crawlable column topic archives', () => {
  it('generates only real nonempty language/topic pages, without query pagination', () => {
    expect(generateStaticParams()).toEqual([
      { locale: 'ko', topic: 'tax' }, { locale: 'ko', topic: 'family' },
      { locale: 'zh-hant', topic: 'family' }, { locale: 'en', topic: 'family' }, { locale: 'vi', topic: 'tax' },
    ]);
  });
  it('renders every matching article href in initial HTML, including articles beyond the preview', async () => {
    const html = renderToStaticMarkup(await Page(params('ko', 'family')));
    for (let i = 0; i < 7; i++) expect(html).toContain(`href="/ko/columns/family-${i}"`);
    expect(html).not.toContain('href="/ko/columns/tax-0"');
    expect(html).toContain('href="/ko/columns"');
  });
  it('uses a self canonical and only existing topic-language alternates', async () => {
    const meta = await generateMetadata(params('ko', 'family'));
    expect(meta.alternates?.canonical).toBe('https://tseng-law.com/ko/columns/topics/family');
    expect(meta.alternates?.languages).toEqual({
      ko: 'https://tseng-law.com/ko/columns/topics/family',
      'zh-Hant': 'https://tseng-law.com/zh-hant/columns/topics/family',
      en: 'https://tseng-law.com/en/columns/topics/family',
      'x-default': 'https://tseng-law.com/en/columns/topics/family',
    });
    const tax = await generateMetadata(params('vi', 'tax'));
    expect(tax.alternates?.languages).not.toHaveProperty('en');
    expect(tax.alternates?.languages?.['x-default']).toBe('https://tseng-law.com/ko/columns/topics/tax');
  });
  it('rejects empty topics and unsupported locales instead of publishing fallback content', async () => {
    await expect(Page(params('ja', 'family'))).rejects.toThrow('NOT_FOUND');
    await expect(Page(params('de', 'family'))).rejects.toThrow('NOT_FOUND');
    await expect(generateMetadata(params('ko', 'missing'))).rejects.toThrow('NOT_FOUND');
  });
});
