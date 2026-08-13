import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { buildSearchIndex } from '@/lib/builder/search/index-builder';
import type { SearchDoc, SearchIndex } from '@/lib/builder/search/types';

const mocks = vi.hoisted(() => ({
  loadSearchIndex: vi.fn(),
}));

vi.mock('@/lib/builder/search/index-storage', () => ({
  loadSearchIndex: mocks.loadSearchIndex,
}));

import SearchPage, { generateMetadata } from '../page';

const docs: SearchDoc[] = [
  {
    id: 'blog:ja:taiwan-company-establishment-basics',
    kind: 'blog',
    locale: 'ja',
    title: '台湾会社設立の基本',
    url: '/ja/columns/taiwan-company-establishment-basics',
    summary: '台湾での会社設立の流れを解説します。',
    body: '台湾での会社設立の手順と留意点をまとめました。',
  },
  {
    id: 'blog:ko:company-setup',
    kind: 'blog',
    locale: 'ko',
    title: '대만 회사 설립 기본',
    url: '/ko/columns/company-setup',
    summary: '대만 회사 설립 절차를 안내합니다.',
    body: '대만에서 회사를 설립하는 절차와 유의점을 정리했습니다.',
  },
  {
    id: 'blog:zh-hant:company-setup',
    kind: 'blog',
    locale: 'zh-hant',
    title: '台灣公司設立基礎',
    url: '/zh-hant/columns/company-setup',
    summary: '說明台灣公司設立流程。',
    body: '整理在台灣設立公司的流程與注意事項。',
  },
  {
    id: 'blog:en:company-setup',
    kind: 'blog',
    locale: 'en',
    title: 'Taiwan Company Setup Basics',
    url: '/en/columns/company-setup',
    summary: 'How to set up a company in Taiwan.',
    body: 'A guide to the company setup process in Taiwan.',
  },
];

const fixtureIndex: SearchIndex = buildSearchIndex(docs);

async function renderSearch(locale: string, q: string): Promise<string> {
  return renderToStaticMarkup(
    await SearchPage({
      params: Promise.resolve({ locale: locale as never }),
      searchParams: Promise.resolve({ q }),
    }),
  );
}

describe('/ja/search localization', () => {
  beforeEach(() => {
    mocks.loadSearchIndex.mockResolvedValue(fixtureIndex);
  });

  it('generates Japanese metadata with noindex preserved', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: 'ja' as never }) });

    expect(String(metadata.title)).toContain('検索結果');
    expect(String(metadata.description)).toContain('必要な情報を素早く見つける');
    expect(metadata.robots).toMatchObject({ index: false });
  });

  it('renders the ja search page fully in Japanese with /ja/ result links', async () => {
    const html = await renderSearch('ja', '会社');

    // Japanese title, search UI, and total count.
    expect(html).toContain('検索結果');
    expect(html).toContain('どのようにお手伝いできますか？');
    expect(html).toContain('全 1 件');
    expect(html).toContain('すべて');
    expect(html).toContain('コラム');
    expect(html).toContain('おすすめ');
    // Result card links stay under /ja/.
    expect(html).toContain('href="/ja/columns/taiwan-company-establishment-basics"');
    expect(html).toContain('台湾会社設立の基本');
    // No Korean UI copy leaks onto the ja surface.
    expect(html).not.toContain('총 1건');
    expect(html).not.toContain('어떻게 도와드릴까요?');
    expect(html).not.toContain('>추천<');
    // No cross-locale result links.
    expect(html).not.toContain('href="/ko/columns/');
    expect(html).not.toContain('href="/zh-hant/columns/');
    expect(html).not.toContain('href="/en/columns/');
  });

  it('renders the ja empty state in Japanese', async () => {
    const html = await renderSearch('ja', 'zzzznohit');

    expect(html).toContain('検索結果が見つかりませんでした。');
    expect(html).not.toContain('검색 결과가 없습니다.');
  });

  it.each([
    { locale: 'ko', q: '회사', title: '검색 결과', total: '총 1건', url: '/ko/columns/company-setup' },
    { locale: 'zh-hant', q: '公司', title: '搜尋結果', total: '共 1 筆', url: '/zh-hant/columns/company-setup' },
    { locale: 'en', q: 'company', title: 'Search Results', total: 'Total 1', url: '/en/columns/company-setup' },
  ])('keeps the /%s/search render unchanged', async ({ locale, q, title, total, url }) => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: locale as never }) });
    expect(String(metadata.title)).toContain(title);

    const html = await renderSearch(locale, q);
    expect(html).toContain(title);
    expect(html).toContain(total);
    expect(html).toContain(`href="${url}"`);
  });
});
