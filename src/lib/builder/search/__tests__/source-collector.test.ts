import { describe, expect, it, vi } from 'vitest';
import type { Locale } from '@/lib/locales';
import { collectAllSearchDocs } from '@/lib/builder/search/source-collector';
import { listPages } from '@/lib/builder/site/persistence';
import { listBlogPosts } from '@/lib/builder/blog/column-adapter';
import { listPortfolioSearchDocs } from '@/lib/builder/portfolio/portfolio-engine';

vi.mock('@/lib/builder/site/persistence', () => ({
  listPages: vi.fn(async () => []),
  readPageCanvas: vi.fn(async () => null),
}));

const mockedListPages = vi.mocked(listPages);

vi.mock('@/lib/builder/blog/column-adapter', () => ({
  listBlogPosts: vi.fn(async (locale: Locale) => (
    locale === 'ko'
      ? [
          {
            postId: 'blog-f44-post',
            slug: 'blog-f44-post',
            locale,
            title: 'F44 블로그 검색 글',
            excerpt: '블로그 공개 검색 위젯 검증',
            bodyHtml: '<p>대만 법률 검색 본문</p>',
            bodyMarkdown: '대만 법률 검색 본문',
            category: 'labor-law',
            tags: ['f44'],
            readingTimeMinutes: 2,
            publishedAt: '2026-05-20T00:00:00.000Z',
            updatedAt: '2026-05-20T00:00:00.000Z',
            featured: false,
            author: { name: 'F44 Author', title: 'Editor' },
          },
        ]
      : []
  )),
}));

vi.mock('@/lib/builder/portfolio/portfolio-engine', () => ({
  listPortfolioSearchDocs: vi.fn(async (locale: Locale) => (
    locale === 'ko'
      ? [
          {
            id: 'portfolio:ko:f49-project',
            kind: 'portfolio',
            locale,
            title: 'F49 포트폴리오 검색 사례',
            url: '/ko/portfolio/f49-project',
            summary: '포트폴리오 공개 검색 검증',
            body: '대만 회사 설립 포트폴리오 본문',
            publishedAt: '2026-05-20',
            tags: ['f49'],
          },
        ]
      : []
  )),
}));

describe('search source collector', () => {
  it('includes published blog posts as blog search docs', async () => {
    const docs = await collectAllSearchDocs('default');
    const blogDoc = docs.find((doc) => doc.id === 'blog:ko:blog-f44-post');
    const faqDoc = docs.find((doc) => doc.id === 'faq:ko:seed-ko-1');
    const portfolioDoc = docs.find((doc) => doc.id === 'portfolio:ko:f49-project');

    expect(listBlogPosts).toHaveBeenCalledWith('ko');
    expect(listPortfolioSearchDocs).toHaveBeenCalledWith('ko');
    expect(blogDoc).toMatchObject({
      kind: 'blog',
      locale: 'ko',
      title: 'F44 블로그 검색 글',
      url: '/ko/columns/blog-f44-post',
      tags: ['f44'],
    });
    expect(blogDoc?.body).toContain('대만 법률 검색 본문');
    expect(blogDoc?.body).toContain('F44 Author');
    expect(faqDoc).toMatchObject({
      kind: 'faq',
      locale: 'ko',
      url: expect.stringContaining('/ko/faq?category=company-setup'),
    });
    expect(faqDoc?.body).toContain('대만 법인설립');
    expect(portfolioDoc).toMatchObject({
      kind: 'portfolio',
      locale: 'ko',
      title: 'F49 포트폴리오 검색 사례',
      url: '/ko/portfolio/f49-project',
      tags: ['f49'],
    });
    expect(portfolioDoc?.body).toContain('대만 회사 설립 포트폴리오 본문');
  });

  it('uses locale-specific page SEO descriptions in page search docs', async () => {
    mockedListPages.mockImplementation(async (_siteId, locale) => (
      locale === 'en'
        ? [
            {
              pageId: 'page-en-1',
              slug: 'about',
              title: { ko: '소개', en: 'About', 'zh-hant': '關於' },
              locale,
              seo: {
                title: 'About us',
                description: 'English page summary',
                localizedOverrides: {
                  en: {
                    description: 'Localized English page summary',
                  },
                },
              },
              createdAt: '2026-05-20T00:00:00.000Z',
              updatedAt: '2026-05-20T00:00:00.000Z',
              publishedAt: '2026-05-20T00:00:00.000Z',
            },
          ]
        : []
    ));

    const docs = await collectAllSearchDocs('default');
    const pageDoc = docs.find((doc) => doc.id === 'page:en:page-en-1');

    expect(pageDoc).toMatchObject({
      kind: 'page',
      locale: 'en',
      title: 'About',
      summary: 'Localized English page summary',
    });
  });

  it('excludes internal sandbox/QA/probe pages from page search docs but keeps real pages', async () => {
    mockedListPages.mockImplementation(async (_siteId, locale) => (
      locale === 'ko'
        ? [
            {
              pageId: 'real-about',
              slug: 'about',
              title: { ko: '소개', en: 'About', 'zh-hant': '關於' },
              locale,
              createdAt: '2026-05-20T00:00:00.000Z',
              updatedAt: '2026-05-20T00:00:00.000Z',
              publishedAt: '2026-05-20T00:00:00.000Z',
            },
            {
              pageId: 'leak-animation',
              slug: 'public-animation-mqzrfcqb',
              title: { ko: 'Public animation', en: 'Public animation', 'zh-hant': 'Public animation' },
              locale,
              createdAt: '2026-05-20T00:00:00.000Z',
              updatedAt: '2026-05-20T00:00:00.000Z',
              publishedAt: '2026-05-20T00:00:00.000Z',
            },
            {
              pageId: 'leak-template',
              slug: 'visual-template-pet-home-mqzemq7q',
              title: { ko: 'Visual template pet-home', en: 'Visual template pet-home', 'zh-hant': 'Visual template pet-home' },
              locale,
              createdAt: '2026-05-20T00:00:00.000Z',
              updatedAt: '2026-05-20T00:00:00.000Z',
              publishedAt: '2026-05-20T00:00:00.000Z',
            },
            {
              pageId: 'leak-preview',
              slug: 'custom-preview-mr0kw8u4',
              title: { ko: 'Custom preview', en: 'Custom preview', 'zh-hant': 'Custom preview' },
              locale,
              createdAt: '2026-05-20T00:00:00.000Z',
              updatedAt: '2026-05-20T00:00:00.000Z',
              publishedAt: '2026-05-20T00:00:00.000Z',
            },
          ]
        : []
    ));

    const docs = await collectAllSearchDocs('default');
    const pageDocs = docs.filter((doc) => doc.kind === 'page');

    expect(pageDocs.map((doc) => doc.id)).toEqual(['page:ko:real-about']);
    expect(pageDocs.find((doc) => doc.id === 'page:ko:leak-animation')).toBeUndefined();
    expect(pageDocs.find((doc) => doc.id === 'page:ko:leak-template')).toBeUndefined();
    expect(pageDocs.find((doc) => doc.id === 'page:ko:leak-preview')).toBeUndefined();
  });
});
