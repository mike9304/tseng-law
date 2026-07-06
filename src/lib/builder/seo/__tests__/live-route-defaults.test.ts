import { describe, expect, it } from 'vitest';
import type { BuilderPageMeta } from '@/lib/builder/site/types';
import { buildHreflangAlternates } from '@/lib/builder/seo/hreflang';
import { buildPageSeo } from '@/lib/builder/seo/seo-model';

const now = '2026-07-06T00:00:00.000Z';

function makePage(overrides: Partial<BuilderPageMeta> = {}): BuilderPageMeta {
  return {
    pageId: 'page-1',
    slug: 'services',
    title: { ko: '업무분야', 'zh-hant': '服務領域', en: 'Practice Areas' },
    locale: 'ko',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    ...overrides,
  };
}

describe('live route SEO defaults', () => {
  it('uses live home SEO copy before generic builder templates', () => {
    const home = makePage({
      pageId: 'home-ko',
      slug: '',
      isHomePage: true,
      title: { ko: '홈', 'zh-hant': '首頁', en: 'Home' },
    });

    const seo = buildPageSeo(home, 'https://tseng-law.com', 'ko', [home]);

    expect(seo.title).toBe('대만 변호사·대만 소송·대만 회사설립');
    expect(seo.description).toBe(
      '대만 회사설립, 대만 소송, 대만 투자 법률 자문을 한국어와 일본어로 안내하는 법무법인 호정 공식 사이트입니다.',
    );
    expect(seo.ogTitle).toBe(seo.title);
    expect(seo.ogDescription).toBe(seo.description);
    expect(seo.twitterTitle).toBe(seo.title);
    expect(seo.twitterDescription).toBe(seo.description);
  });

  it('uses live route descriptions for standard published pages without explicit SEO', () => {
    const services = makePage();

    const seo = buildPageSeo(services, 'https://tseng-law.com', 'ko', [services]);

    expect(seo.title).toBe('업무분야');
    expect(seo.description).toBe('대만 투자, 소송, 자문 전반을 구조화하여 제공합니다.');
    expect(seo.ogDescription).toBe(seo.description);
    expect(seo.twitterDescription).toBe(seo.description);
  });

  it('keeps explicit page SEO above live route defaults', () => {
    const services = makePage({
      seo: {
        title: 'Custom services title',
        description: 'Custom services description',
      },
    });

    const seo = buildPageSeo(services, 'https://tseng-law.com', 'ko', [services]);

    expect(seo.title).toBe('Custom services title');
    expect(seo.description).toBe('Custom services description');
  });

  it('advertises all locale alternates for public columns and videos routes', () => {
    const videosZh = makePage({
      pageId: 'videos-zh',
      slug: 'videos',
      locale: 'zh-hant',
      title: { ko: '미디어', 'zh-hant': '影音', en: 'Videos' },
    });

    const alternates = buildHreflangAlternates(videosZh, 'https://tseng-law.com', [videosZh]);

    expect(alternates.map((entry) => entry.hreflang)).toEqual(
      expect.arrayContaining(['ko', 'zh-Hant', 'en', 'x-default']),
    );
    expect(alternates.find((entry) => entry.hreflang === 'ko')?.href).toBe(
      'https://tseng-law.com/ko/videos',
    );
    expect(alternates.find((entry) => entry.hreflang === 'en')?.href).toBe(
      'https://tseng-law.com/en/videos',
    );
    expect(alternates.find((entry) => entry.hreflang === 'x-default')?.href).toBe(
      'https://tseng-law.com/ko/videos',
    );
  });
});
