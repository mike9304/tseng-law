import { describe, expect, it } from 'vitest';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';
import { DEFAULT_THEME } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';
import { buildBuilderSeoOverview } from '@/lib/builder/seo/overview';
import { getSeoOverviewCopy } from '@/lib/builder/seo/overview-copy';

const now = '2026-06-02T00:00:00.000Z';

function page(locale: Locale, overrides: Partial<BuilderPageMeta> = {}): BuilderPageMeta {
  return {
    pageId: `page-${locale}`,
    slug: 'services',
    title: { ko: '서비스', en: 'Services', 'zh-hant': '服務' },
    locale,
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    ...overrides,
  };
}

function site(locale: Locale, pages: BuilderPageMeta[], settings?: BuilderSiteDocument['settings']): BuilderSiteDocument {
  return {
    version: 1,
    siteId: `site-${locale}`,
    name: '호정국제',
    locale,
    navigation: [],
    theme: DEFAULT_THEME,
    pages,
    settings,
    createdAt: now,
    updatedAt: now,
  };
}

function canvas(locale: Locale): BuilderCanvasDocument {
  return {
    version: 1,
    locale,
    updatedAt: now,
    updatedBy: 'test',
    stageWidth: 1200,
    stageHeight: 800,
    nodes: [
      {
        id: 'h1',
        kind: 'heading',
        rect: { x: 0, y: 0, width: 100, height: 40 },
        style: {} as never,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 1,
        content: { level: 1, text: 'Services', color: '#0f172a', align: 'left' },
      },
      {
        id: 'image',
        kind: 'image',
        rect: { x: 0, y: 60, width: 200, height: 120 },
        style: {} as never,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 2,
        content: { src: 'https://example.com/image.jpg', alt: '', fit: 'cover' },
      },
    ],
  };
}

function checklistText(locale: Locale): string {
  const current = page(locale, {
    seo: {
      title: locale === 'en' ? 'Services | Tseng Law' : locale === 'zh-hant' ? '服務 | 皓正國際' : '서비스 | 호정국제',
      description: locale === 'en'
        ? 'Legal service page for Tseng Law.'
        : locale === 'zh-hant'
          ? '皓正國際法律服務頁面。'
          : '호정국제 법률 서비스 페이지입니다.',
    },
  });
  const overview = buildBuilderSeoOverview({
    site: site(locale, [current]),
    canvasesByPageId: new Map([[current.pageId, canvas(locale)]]),
  });

  return overview.checklist.flatMap((item) => [item.label, item.detail]).join(' ');
}

describe('SEO overview checklist copy', () => {
  it('returns ko checklist copy', () => {
    const copy = getSeoOverviewCopy('ko');
    const text = checklistText('ko');

    expect(copy.businessNameLabel).toBe('비즈니스 이름');
    expect(copy.keywordsMissing).toBe('최대 5개의 포커스 키워드를 설정하세요.');
    expect(text).toContain('비즈니스 이름');
    expect(text).toContain('최대 5개의 포커스 키워드를 설정하세요.');
    expect(text).toContain('1개 이미지에 대체 텍스트가 없습니다.');
    expect(text).not.toContain('Business name');
    expect(text).not.toContain('keywords configured');
  });

  it('returns zh-hant overview checklist copy without Hangul', () => {
    const text = checklistText('zh-hant');

    expect(text).toContain('商家名稱');
    expect(text).toContain('請設定最多 5 個焦點關鍵字。');
    expect(text).toContain('1 張圖片缺少 alt text。');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en overview checklist copy without CJK', () => {
    const current = page('en', {
      seo: {
        title: 'Services | Tseng Law',
        description: 'Legal service page for Tseng Law.',
      },
    });
    const overview = buildBuilderSeoOverview({
      site: site('en', [current], { seoChecklist: { keywords: ['law'] } }),
      canvasesByPageId: new Map([[current.pageId, canvas('en')]]),
    });
    const text = overview.checklist.flatMap((item) => [item.label, item.detail]).join(' ');

    expect(text).toContain('Business name');
    expect(text).toContain('1/5 keywords configured');
    expect(text).toContain('1 image(s) missing alt text');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });
});
