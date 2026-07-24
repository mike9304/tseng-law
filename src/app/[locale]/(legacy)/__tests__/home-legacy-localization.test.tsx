import { Children, isValidElement, type ReactElement } from 'react';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HeroSearch from '@/components/HeroSearch';
import HomeContactCta from '@/components/HomeContactCta';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import ScrollTopButton from '@/components/ScrollTopButton';
import { siteContent } from '@/data/site-content';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import {
  HomeLegacyPage,
  LegacyHomePageBody,
  mapColumnPostsToHomeInsights,
} from '@/app/[locale]/(legacy)/home-legacy';
import { getAllColumnPosts } from '@/lib/columns';
import type { SiteLocale } from '@/lib/locales';

const HANGUL = /[\uac00-\ud7af]/;
const SITE_URL = 'https://tseng-law.com';
const locales = ['ko', 'zh-hant', 'en', 'ja'] as const satisfies readonly SiteLocale[];

const heroLabels = {
  ko: { cta: '호정칼럼 보기', scroll: '아래로 스크롤' },
  'zh-hant': { cta: '查看專欄內容', scroll: '向下滾動' },
  en: { cta: 'View Columns', scroll: 'Scroll down' },
  ja: { cta: 'コラムを見る', scroll: '下へスクロール' },
} as const;

const scrollTopLabels = {
  ko: '상단으로 이동',
  'zh-hant': '回到頂部',
  en: 'Back to top',
  ja: 'ページ上部へ戻る',
} as const;

const contactCopy = {
  ko: {
    title: '대만 법률 이슈, 지금 바로 상담하세요.',
    description: '사업·소송·법인설립 문의를 유형별로 빠르게 연결해드립니다.',
  },
  'zh-hant': {
    title: '台灣法律議題，立即諮詢。',
    description: '依案件類型安排投資、訴訟與公司設立諮詢流程。',
  },
  en: {
    title: 'Talk to us now about your Taiwan legal issue.',
    description: 'We quickly route business, litigation, and incorporation inquiries by case type.',
  },
  ja: {
    title: '台湾の法律問題を、今すぐご相談ください。',
    description: 'ビジネス、訴訟、会社設立のご相談を案件種別に迅速に振り分けます。',
  },
} as const;

function findOfficeMapElement() {
  const body = LegacyHomePageBody({ locale: 'ja', posts: [], faqItems: [] });
  const reveal = Children.toArray(body.props.children).find((candidate) => {
    if (!isValidElement<{ children?: ReactElement }>(candidate)) return false;
    return isValidElement(candidate.props.children) && candidate.props.children.type === OfficeMapTabs;
  });

  expect(isValidElement<{ children: ReactElement<{ locale: SiteLocale }> }>(reveal)).toBe(true);
  if (!isValidElement<{ children: ReactElement<{ locale: SiteLocale }> }>(reveal)) {
    throw new Error('Japanese OfficeMapTabs composition was not found');
  }
  return reveal.props.children;
}

describe('legacy home insight localization', () => {
  it('maps EN columns without Hangul and without Date pending placeholders', () => {
    const posts = mapColumnPostsToHomeInsights(getAllColumnPosts('en'));
    expect(posts.length).toBeGreaterThan(0);
    for (const post of posts) {
      expect(HANGUL.test(post.title)).toBe(false);
      expect(HANGUL.test(post.summary)).toBe(false);
      expect(post.date).toBeTruthy();
      expect(post.dateDisplay).toBeTruthy();
      expect(post.dateDisplay).not.toMatch(/Date pending/i);
    }
  });

  it('keeps KO posts with Hangul content available', () => {
    const posts = mapColumnPostsToHomeInsights(getAllColumnPosts('ko'));
    expect(posts.some((post) => HANGUL.test(post.title))).toBe(true);
  });
});

describe('legacy home four-locale localization', () => {
  it('passes the public Japanese locale directly to OfficeMapTabs', () => {
    const officeMap = findOfficeMapElement();

    expect(officeMap.type).toBe(OfficeMapTabs);
    expect(officeMap.props.locale).toBe('ja');

    const html = renderToStaticMarkup(officeMap);
    expect(html).toContain('事務所所在地');
    expect(html).toContain('台北事務所');
    expect(html).not.toContain('Office Locations');
    expect(html).not.toContain('Korea Office');
  });

  it('uses the Japanese attorney profile and Japanese locale in Person JSON-LD', () => {
    const page = HomeLegacyPage({ locale: 'ja' });
    const jsonLdElement = Children.toArray(page.props.children)[0];

    expect(isValidElement<{ data: Record<string, unknown> }>(jsonLdElement)).toBe(true);
    if (!isValidElement<{ data: Record<string, unknown> }>(jsonLdElement)) {
      throw new Error('Japanese Person JSON-LD was not rendered');
    }

    const profile = getAttorneyProfile('ja', primaryAttorneySlug);
    expect(profile).toBeDefined();
    expect(jsonLdElement.props.data).toMatchObject({
      name: '曾雋崴弁護士',
      description: profile?.description,
      jobTitle: profile?.role,
      url: `${SITE_URL}/ja/lawyers/wei-tseng`,
      worksFor: {
        name: '昊鼎国際法律事務所',
        url: `${SITE_URL}/ja`,
      },
    });
  });

  it('does not coerce the public home locale through the builder locale adapter', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'src/app/[locale]/(legacy)/home-legacy.tsx'),
      'utf8',
    );

    expect(source).not.toContain('toBuilderLocale');
  });

  it.each(locales)('preserves exact %s hero CTA and scroll labels', (locale) => {
    const html = renderToStaticMarkup(<HeroSearch locale={locale} />);

    expect(html).toContain(heroLabels[locale].cta);
    expect(html).toContain(`aria-label="${heroLabels[locale].scroll}"`);
  });

  it.each(locales)('renders %s home contact copy from siteContent', (locale) => {
    const html = renderToStaticMarkup(<HomeContactCta locale={locale} />);

    expect(siteContent[locale].homeContactCta).toEqual(contactCopy[locale]);
    expect(html).toContain(contactCopy[locale].title);
    expect(html).toContain(contactCopy[locale].description);
  });

  it.each(locales)('preserves the exact %s scroll-top label', (locale) => {
    const html = renderToStaticMarkup(<ScrollTopButton locale={locale} />);

    expect(html).toContain(`aria-label="${scrollTopLabels[locale]}"`);
  });

  it('removes known English leakage from rendered Japanese home surfaces', () => {
    const japaneseHtml = [
      renderToStaticMarkup(<HeroSearch locale="ja" />),
      renderToStaticMarkup(<HomeContactCta locale="ja" />),
      renderToStaticMarkup(findOfficeMapElement()),
      renderToStaticMarkup(<ScrollTopButton locale="ja" />),
    ].join('');

    expect(japaneseHtml).toContain('コラムを見る');
    expect(japaneseHtml).toContain('下へスクロール');
    expect(japaneseHtml).toContain('台湾の法律問題を、今すぐご相談ください。');
    expect(japaneseHtml).toContain('ページ上部へ戻る');

    for (const fallback of [
      'View Columns',
      'Scroll down',
      'Talk to us now about your Taiwan legal issue.',
      'Office Locations',
      'Korea Office',
      'Back to top',
    ]) {
      expect(japaneseHtml).not.toContain(fallback);
    }
  });
});
