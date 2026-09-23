import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Children, createElement, isValidElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import HeroSearch, { heroQuickMenus } from '@/components/HeroSearch';
import ServicesBento from '@/components/ServicesBento';
import HomeAttorneySplit from '@/components/HomeAttorneySplit';
import HomeStatsSection from '@/components/HomeStatsSection';
import HomeCaseResultsSplit from '@/components/HomeCaseResultsSplit';
import InsightsArchiveSection from '@/components/InsightsArchiveSection';
import FAQAccordion from '@/components/FAQAccordion';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import HomeContactCta from '@/components/HomeContactCta';
import TaiwanHeritageInterlude from '@/components/TaiwanHeritageInterlude';
import Reveal from '@/components/Reveal';
import EnAcquisitionGuideLinks from '@/components/EnAcquisitionGuideLinks';
import { LegacyHomePageBody } from '@/app/[locale]/(legacy)/home-legacy';
import {
  homeAttorneyTextSurfaceIds,
  homeHeroButtonSurfaceIds,
  homeHeroTextSurfaceIds,
  homeResultsTextSurfaceIds,
} from '@/lib/builder/registry';
import { BuilderSurfaceProvider } from '@/lib/builder/surface-context';
import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import { getAttorneyProfilePath } from '@/data/attorney-profiles';
import { teamContent } from '@/data/team-members';
import { siteContent } from '@/data/site-content';
import type { FAQItem } from '@/data/faq-content';
import type { SiteLocale } from '@/lib/locales';

const locales = ['ko', 'zh-hant', 'en', 'ja'] as const satisfies readonly SiteLocale[];

const emailConsultationCtaLabels: Record<SiteLocale, string> = {
  ko: '이메일 상담 신청',
  'zh-hant': '申請電子郵件諮詢',
  en: 'Request an Email Consultation',
  ja: 'メール相談を申し込む',
};

const columnCtaLabels: Record<SiteLocale, string> = {
  ko: '호정칼럼 보기',
  'zh-hant': '查看專欄內容',
  en: 'View Insights',
  ja: 'コラムを見る',
};

function headingText(html: string) {
  return html.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/)?.[1].replace(/<[^>]*>/g, '');
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, '&');
}

function headingEntries(html: string, tag: 'h2' | 'h3' | 'h4', className?: string) {
  const classSelector = className ? `[^>]*class="[^"]*${className}[^"]*"` : '';
  return [...html.matchAll(new RegExp(`<${tag}${classSelector}[^>]*>([\\s\\S]*?)</${tag}>`, 'g'))].map(
    (match) => ({
      inner: match[1],
      text: decodeEntities(match[1].replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')),
    }),
  );
}

function headingHasNowrapUnit(inner: string, unit: string) {
  return new RegExp(`white-space:nowrap[^>]*>${unit}<`).test(inner);
}

function koreaBlock(html: string) {
  const start = html.lastIndexOf('<div class="office-korea">');
  return start >= 0 ? html.slice(start) : '';
}

function officeMapHrefs(html: string) {
  return [...html.matchAll(/class="button office-map-link" href="([^"]+)"/g)].map((match) => match[1]);
}

function officeTelHrefs(html: string) {
  return [...html.matchAll(/class="link-underline phone-number" href="(tel:[^"]+)"/g)].map((match) => match[1]);
}

function serviceTitles(html: string): string[] {
  return [...html.matchAll(/<h[23] class="services-detail-title">([\s\S]*?)<\/h[23]>/g)].map(
    (match) => decodeEntities(match[1].replace(/<[^>]+>/g, '')),
  );
}

function serviceSummaryParagraphs(html: string): string[] {
  return [...html.matchAll(/<p class="[^"]*services-card-summary[^"]*">([\s\S]*?)<\/p>/g)].map(
    (match) => decodeEntities(match[1].replace(/<[^>]+>/g, '')),
  );
}

function revealChild(node: unknown) {
  if (!isValidElement<{ children?: unknown }>(node)) return null;
  return node.props.children ?? null;
}

function elementType(node: unknown) {
  return isValidElement(node) ? node.type : null;
}

describe('home editorial presentation opt-in', () => {
  it('keeps the default hero email-first contract without services or columns CTAs', () => {
    for (const locale of locales) {
      const html = renderToStaticMarkup(createElement(HeroSearch, { locale }));
      const mailto = getConsultationPublicMailto(locale).replace(/&/g, '&amp;');

      expect(html).toContain('data-tone="dark"');
      expect(html).toContain('hero-search-bar overlap');
      expect(html).toContain(emailConsultationCtaLabels[locale]);
      expect(html).toContain(`href="${mailto}"`);
      // WO-X3b (EN-09 · J10): services and columns are left to the header nav.
      expect(html).not.toContain(`href="/${locale}/columns"`);
      expect(html).not.toContain(columnCtaLabels[locale]);
      expect(html).not.toContain(`href="/${locale}/services"`);
      expect(html.indexOf(emailConsultationCtaLabels[locale])).toBeLessThan(
        html.indexOf('en-home-path-button'),
      );
      expect(html.indexOf('hero-media')).toBeLessThan(html.indexOf('hero-copy'));
      expect(html).toContain(`action="/${locale}/search"`);
      expect(html).toMatch(/name="q"/);
      expect(html).not.toContain(getAttorneyProfilePath(locale));
    }
  });

  it('opts into editorial copy-first media, separate CTAs, and in-flow search', () => {
    const html = renderToStaticMarkup(
      createElement(HeroSearch, { locale: 'ko', presentation: 'editorial' }),
    );

    expect(html).toContain('data-tone="light"');
    expect(html).toContain('data-presentation="editorial"');
    expect(html.indexOf('hero-copy')).toBeLessThan(html.indexOf('hero-media'));
    expect(html.indexOf('hero-media')).toBeLessThan(html.indexOf('hero-search'));
    expect(html).not.toContain('hero-search-bar overlap');
    expect(html).toContain('이메일 상담 신청');
    // WO-X3b: no services / columns CTAs inside the hero any more.
    expect(html).not.toContain('href="/ko/services"');
    expect(html).not.toContain('호정칼럼 보기');
  });

  it.each(locales)('uses separate %s email and q GET destinations without services/columns CTAs', (locale) => {
    const html = renderToStaticMarkup(
      createElement(HeroSearch, { locale, presentation: 'editorial' }),
    );
    const mailto = getConsultationPublicMailto(locale).replace(/&/g, '&amp;');
    const services = heroQuickMenus[locale].find((item) => item.href === `/${locale}/services`);
    const lead = teamContent[locale].members[0];

    // The quick menu (shown on search focus) still offers services.
    expect(services).toBeDefined();
    expect(html).toContain(emailConsultationCtaLabels[locale]);
    expect(html).toContain(`href="${mailto}"`);
    // WO-X3b (EN-09 · J10): services and columns CTAs left the hero.
    expect(html).not.toContain(`href="/${locale}/services"`);
    expect(html).not.toContain(`href="/${locale}/columns"`);
    expect(html).not.toContain(`data-builder-surface-key="${homeHeroButtonSurfaceIds[0]}"`);
    expect(html).toContain(`action="/${locale}/search"`);
    expect(html).toMatch(/method="get"/);
    expect(html).toMatch(/name="q"/);
    expect(html).toContain(`href="${getAttorneyProfilePath(locale)}"`);
    expect(html).toContain(lead.name);
    expect(html).toContain(lead.role);
    expect(html).toContain(siteContent[locale].hero.searchPlaceholder);
  });

  it('preserves authored and intentionally empty hero title overrides in editorial mode', () => {
    const customTitle = renderToStaticMarkup(
      <BuilderSurfaceProvider
        nodeId="home-hero"
        mode="published"
        overrides={{ [homeHeroTextSurfaceIds[1]]: '編集した日本語のタイトル。' }}
        selectedSurfaceKey={null}
      >
        <HeroSearch locale="ja" presentation="editorial" />
      </BuilderSurfaceProvider>,
    );
    expect(headingText(customTitle)).toBe('編集した日本語のタイトル。');
    expect(customTitle).not.toContain('分かりやすく。');

    const emptyTitle = renderToStaticMarkup(
      <BuilderSurfaceProvider
        nodeId="home-hero"
        mode="published"
        overrides={{ [homeHeroTextSurfaceIds[1]]: '' }}
        selectedSurfaceKey={null}
      >
        <HeroSearch locale="ja" presentation="editorial" />
      </BuilderSurfaceProvider>,
    );
    expect(headingText(emptyTitle)).toBe('');
    expect(emptyTitle).not.toContain('分かりやすく。');

    // WO-X3b: the hero no longer renders the columns link, so a stored
    // `columns-link` override has nothing to label.
    const customColumns = renderToStaticMarkup(
      <BuilderSurfaceProvider
        nodeId="home-hero"
        mode="published"
        overrides={{ [homeHeroButtonSurfaceIds[0]]: 'Custom Columns Label' }}
        selectedSurfaceKey={null}
      >
        <HeroSearch locale="en" presentation="editorial" />
      </BuilderSurfaceProvider>,
    );
    expect(customColumns).not.toContain('Custom Columns Label');
    expect(customColumns).not.toContain('href="/en/columns"');
    expect(customColumns).not.toContain('href="/en/services"');
  });

  it('renders the Japanese offer title (J11) in editorial mode', () => {
    const html = renderToStaticMarkup(
      createElement(HeroSearch, { locale: 'ja', presentation: 'editorial', headingLevel: 2 }),
    );
    // WO-X3 (J11): phrase breaking comes from the ja `word-break: auto-phrase` heading rule.
    expect(headingText(html)).toBe('台湾の会社設立・労務・紛争を、日本語で。');
    expect(html).toContain('<h2');
    expect(html).not.toContain('分かりやすく。');
    // Phrase grouping keeps 労務 (and every other phrase) on one line.
    for (const phrase of ['台湾の会社設立・', '労務・', '紛争を、', '日本語で。']) {
      expect(html).toContain(`<span style="display:inline-block;max-width:100%">${phrase}</span>`);
    }
    expect(html).toContain('<wbr');
  });

  it('keeps a reachable scrollHref affordance', () => {
    const html = renderToStaticMarkup(
      createElement(HeroSearch, {
        locale: 'zh-hant',
        presentation: 'editorial',
        scrollHref: '#faq',
      }),
    );
    expect(html).toContain('href="#faq"');
    expect(html).toContain('aria-label="向下滾動"');
  });
});

describe('legacy home editorial portrait frame', () => {
  it('hides the inset ::before/::after frame on the about portrait', () => {
    const css = readFileSync(
      join(process.cwd(), 'src/components/HomeEditorial.module.css'),
      'utf8',
    );
    expect(css).toContain('.root :global(#about) :global(.split-image--portrait)::before,');
    expect(css).toContain('.root :global(#about) :global(.split-image--portrait)::after {');
    expect(css).toContain('content: none !important;');
  });
});

describe('ServicesBento editorial full descriptions', () => {
  it('renders all six authored descriptions only when editorial is opted in', () => {
    for (const locale of locales) {
      const items = siteContent[locale].services.items;
      expect(items).toHaveLength(6);

      const editorial = renderToStaticMarkup(
        createElement(ServicesBento, { locale, presentation: 'editorial' }),
      );
      const standard = renderToStaticMarkup(createElement(ServicesBento, { locale }));
      const editorialSummaries = serviceSummaryParagraphs(editorial);
      const standardSummaries = serviceSummaryParagraphs(standard);

      expect(serviceTitles(editorial)).toEqual(items.map((item) => item.title));
      expect(serviceTitles(standard)).toEqual(items.map((item) => item.title));
      expect(editorialSummaries).toEqual(items.map((item) => item.description));
      expect(standardSummaries).toHaveLength(6);

      items.forEach((item, index) => {
        const rendered = standardSummaries[index];
        expect(rendered).toBeTruthy();
        expect(rendered.includes('\n')).toBe(false);
        if (item.description.includes('\n') || item.description.length > 120) {
          expect(rendered).not.toBe(item.description);
        }
      });
    }
  });
});

describe('legacy home editorial composition', () => {
  it('wraps retained sections in editorial order with Insights after Stats', () => {
    const posts = [
      {
        slug: 'sample',
        title: 'Sample insight',
        date: '2024-01-01',
        dateDisplay: '2024-01-01',
        readTime: '3 min',
        categoryLabel: 'News',
        featuredImage: '/images/example.webp',
        summary: 'Summary',
      },
    ];
    const faqItems = [{ question: 'Q', answer: 'A' } as FAQItem];
    const body = LegacyHomePageBody({ locale: 'ja', posts, faqItems });
    const allChildren = Children.toArray(body.props.children);

    // WO-G6: the JA 日系企業 entry block sits directly after the hero.
    expect(allChildren).toHaveLength(11);
    expect(elementType(allChildren[1])).toBe(Reveal);
    expect(elementType(revealChild(allChildren[1]))).toBe(EnAcquisitionGuideLinks);
    expect(
      (revealChild(allChildren[1]) as ReactElement<{ locale: SiteLocale; variant?: string }>).props,
    ).toMatchObject({ locale: 'ja', variant: 'full' });
    const children = allChildren.filter((_, index) => index !== 1);

    expect(children).toHaveLength(10);
    expect(elementType(children[0])).toBe(HeroSearch);
    expect((children[0] as ReactElement<{ presentation?: string; locale: SiteLocale }>).props.presentation).toBe(
      'editorial',
    );
    expect((children[0] as ReactElement<{ locale: SiteLocale }>).props.locale).toBe('ja');

    expect(elementType(children[1])).toBe(Reveal);
    expect(elementType(revealChild(children[1]))).toBe(ServicesBento);
    expect(
      (revealChild(children[1]) as ReactElement<{ presentation?: string; id?: string; variant?: string }>).props,
    ).toMatchObject({
      presentation: 'editorial',
      id: 'practice',
      variant: 'default',
    });

    expect(elementType(children[2])).toBe(TaiwanHeritageInterlude);
    expect(elementType(revealChild(children[3]))).toBe(HomeAttorneySplit);
    expect(
      (revealChild(children[3]) as ReactElement<{ presentation?: string }>).props.presentation,
    ).toBe('editorial');
    expect(elementType(revealChild(children[4]))).toBe(HomeCaseResultsSplit);
    expect(
      (revealChild(children[4]) as ReactElement<{ presentation?: string }>).props.presentation,
    ).toBe('editorial');
    expect(elementType(revealChild(children[5]))).toBe(HomeStatsSection);
    expect(elementType(revealChild(children[6]))).toBe(InsightsArchiveSection);
    expect(
      (revealChild(children[6]) as ReactElement<{ posts: unknown; locale: SiteLocale; presentation?: string }>).props.posts,
    ).toBe(posts);
    expect(
      (revealChild(children[6]) as ReactElement<{ presentation?: string }>).props.presentation,
    ).toBe('editorial');
    expect(elementType(revealChild(children[7]))).toBe(FAQAccordion);
    expect(
      (revealChild(children[7]) as ReactElement<{ items: FAQItem[]; id?: string; sectionClassName?: string }>).props,
    ).toMatchObject({
      items: faqItems,
      id: 'faq',
      sectionClassName: 'section section--gray',
    });
    expect(elementType(revealChild(children[8]))).toBe(OfficeMapTabs);
    expect(
      (revealChild(children[8]) as ReactElement<{ id?: string; sectionClassName?: string }>).props,
    ).toMatchObject({
      id: 'offices',
      sectionClassName: 'section section--light',
      presentation: 'editorial',
    });
    expect(elementType(revealChild(children[9]))).toBe(HomeContactCta);
  });
});

describe('editorial heading unit grouping', () => {
  it('protects designated JA case units in the heading while default headings stay ungrouped', () => {
    const editorial = renderToStaticMarkup(
      createElement(HomeCaseResultsSplit, { locale: 'ja', presentation: 'editorial' }),
    );
    const standard = renderToStaticMarkup(createElement(HomeCaseResultsSplit, { locale: 'ja' }));
    const english = renderToStaticMarkup(
      createElement(HomeCaseResultsSplit, { locale: 'en', presentation: 'editorial' }),
    );
    // The legacy heading retains a break after each source line, including the final line.
    // WO-X1 (EN-03/J01): nationality-neutral case headlines.
    const jaTitle = 'ジムでの負傷事故 —\n一審NT$157万判決、控訴審で和解\n';
    const enTitle = 'Gym Injury Claim —\nTWD 1.57M First-Instance Ruling, Settled on Appeal\n';
    const editorialHeading = headingEntries(editorial, 'h2', 'home-results-title')[0];
    const standardHeading = headingEntries(standard, 'h2', 'home-results-title')[0];
    const englishHeading = headingEntries(english, 'h2', 'home-results-title')[0];

    expect(editorialHeading.text).toBe(jaTitle);
    expect(standardHeading.text).toBe(jaTitle);
    expect(englishHeading.text).toBe(enTitle);
    expect(headingHasNowrapUnit(editorialHeading.inner, '控訴審')).toBe(true);
    expect(headingHasNowrapUnit(editorialHeading.inner, '和解')).toBe(true);
    expect(headingHasNowrapUnit(editorialHeading.inner, '一審')).toBe(false);
    expect(headingHasNowrapUnit(standardHeading.inner, '控訴審')).toBe(false);
    expect(headingHasNowrapUnit(englishHeading.inner, '控訴審')).toBe(false);
    expect(editorial).toContain('損害賠償を請求した事例');
    expect(standard).toContain('損害賠償を請求した事例');
  });

  it('protects designated About units only in JA and ZH editorial headings', () => {
    const jaEditorial = renderToStaticMarkup(
      createElement(HomeAttorneySplit, { locale: 'ja', presentation: 'editorial' }),
    );
    const zhEditorial = renderToStaticMarkup(
      createElement(HomeAttorneySplit, { locale: 'zh-hant', presentation: 'editorial' }),
    );
    const jaDefault = renderToStaticMarkup(createElement(HomeAttorneySplit, { locale: 'ja' }));
    const koEditorial = renderToStaticMarkup(
      createElement(HomeAttorneySplit, { locale: 'ko', presentation: 'editorial' }),
    );
    const jaHeading = headingEntries(jaEditorial, 'h2', 'split-title')[0];
    const zhHeading = headingEntries(zhEditorial, 'h2', 'split-title')[0];
    const jaDefaultHeading = headingEntries(jaDefault, 'h2', 'split-title')[0];
    const koHeading = headingEntries(koEditorial, 'h2', 'split-title')[0];

    expect(jaHeading.text).toBe('曾雋崴弁護士 — 日本語で相談できる台湾法務パートナー');
    expect(zhHeading.text).toBe('曾雋崴律師，在地與跨境客戶的台灣法律夥伴');
    expect(jaDefaultHeading.text).toBe(jaHeading.text);
    expect(headingHasNowrapUnit(jaHeading.inner, '相談')).toBe(true);
    expect(headingHasNowrapUnit(zhHeading.inner, '韓國')).toBe(false);
    expect(headingHasNowrapUnit(jaDefaultHeading.inner, '相談')).toBe(false);
    expect(headingHasNowrapUnit(koHeading.inner, '相談')).toBe(false);
  });

  it('keeps custom and empty heading overrides ungrouped while original body copy remains', () => {
    const customCase = renderToStaticMarkup(
      <BuilderSurfaceProvider
        nodeId="home-results"
        mode="published"
        overrides={{ [homeResultsTextSurfaceIds[1]]: 'カスタム和解見出し' }}
        selectedSurfaceKey={null}
      >
        <HomeCaseResultsSplit locale="ja" presentation="editorial" />
      </BuilderSurfaceProvider>,
    );
    const customCaseHeading = headingEntries(customCase, 'h2', 'home-results-title')[0];
    expect(customCaseHeading.text).toBe('カスタム和解見出し');
    expect(headingHasNowrapUnit(customCaseHeading.inner, '和解')).toBe(false);
    expect(customCase).toContain('損害賠償を請求した事例');
    expect(customCase).toContain('控訴審で当事者間の和解');

    const emptyCase = renderToStaticMarkup(
      <BuilderSurfaceProvider
        nodeId="home-results"
        mode="published"
        overrides={{ [homeResultsTextSurfaceIds[1]]: '' }}
        selectedSurfaceKey={null}
      >
        <HomeCaseResultsSplit locale="ja" presentation="editorial" />
      </BuilderSurfaceProvider>,
    );
    expect(headingEntries(emptyCase, 'h2', 'home-results-title')[0].text).toBe('');
    expect(emptyCase).toContain('損害賠償を請求した事例');
    expect(emptyCase).toContain('控訴審で当事者間の和解');

    const customAbout = renderToStaticMarkup(
      <BuilderSurfaceProvider
        nodeId="home-attorney"
        mode="published"
        overrides={{ [homeAttorneyTextSurfaceIds[1]]: '相談テスト' }}
        selectedSurfaceKey={null}
      >
        <HomeAttorneySplit locale="ja" presentation="editorial" />
      </BuilderSurfaceProvider>,
    );
    const customAboutHeading = headingEntries(customAbout, 'h2', 'split-title')[0];
    expect(customAboutHeading.text).toBe('相談テスト');
    expect(headingHasNowrapUnit(customAboutHeading.inner, '相談')).toBe(false);

    const emptyAbout = renderToStaticMarkup(
      <BuilderSurfaceProvider
        nodeId="home-attorney"
        mode="published"
        overrides={{ [homeAttorneyTextSurfaceIds[1]]: '' }}
        selectedSurfaceKey={null}
      >
        <HomeAttorneySplit locale="ja" presentation="editorial" />
      </BuilderSurfaceProvider>,
    );
    expect(headingEntries(emptyAbout, 'h2', 'split-title')[0].text).toBe('');
    expect(emptyAbout).toContain('弁護士プロフィールを見る');
  });
});

describe('editorial insights archive behavior', () => {
  const insightPosts = [
    {
      slug: 'one',
      title: '支店の選択と財産',
      date: '2024-05-01',
      dateDisplay: '2024-05-01',
      readTime: '4 min',
      categoryLabel: 'Cat-A',
      featuredImage: '/images/a.webp',
      summary: 'Summary one',
    },
    {
      slug: 'two',
      title: 'Second post',
      date: '2024-04-01',
      dateDisplay: '2024-04-01',
      readTime: '3 min',
      categoryLabel: 'Cat-B',
      featuredImage: '/images/b.webp',
      summary: 'Summary two',
    },
    {
      slug: 'three',
      title: '進口程序說明',
      date: '2024-03-01',
      dateDisplay: '2024-03-01',
      readTime: '2 min',
      categoryLabel: 'Cat-C',
      featuredImage: '/images/c.webp',
      summary: 'Summary three',
    },
    {
      slug: 'four',
      title: 'Fourth post',
      date: '2024-02-01',
      dateDisplay: '2024-02-01',
      readTime: '5 min',
      categoryLabel: 'Cat-D',
      featuredImage: '/images/d.webp',
      summary: 'Summary four',
    },
    {
      slug: 'five',
      title: 'Fifth post',
      date: '2024-01-01',
      dateDisplay: '2024-01-01',
      readTime: '6 min',
      categoryLabel: 'Cat-E',
      featuredImage: '/images/e.webp',
      summary: 'Summary five',
    },
  ];

  it('keeps pagination, full summaries, destinations, and one category label per list card', () => {
    const editorial = renderToStaticMarkup(
      createElement(InsightsArchiveSection, {
        locale: 'ja',
        posts: insightPosts,
        presentation: 'editorial',
      }),
    );
    const standard = renderToStaticMarkup(
      createElement(InsightsArchiveSection, { locale: 'ja', posts: insightPosts }),
    );
    const featured = headingEntries(editorial, 'h3', 'insights-featured-title')[0];
    const listHeadings = headingEntries(editorial, 'h4', 'insights-list-title');
    const standardFeatured = headingEntries(standard, 'h3', 'insights-featured-title')[0];
    const listCards = [...editorial.matchAll(/<article class="insights-list-item">([\s\S]*?)<\/article>/g)].map(
      (match) => match[1],
    );

    expect(featured.text).toBe('支店の選択と財産');
    expect(standardFeatured.text).toBe('支店の選択と財産');
    expect(headingHasNowrapUnit(featured.inner, '支店')).toBe(true);
    expect(headingHasNowrapUnit(featured.inner, '選択')).toBe(true);
    expect(headingHasNowrapUnit(featured.inner, '財産')).toBe(true);
    expect(headingHasNowrapUnit(standardFeatured.inner, '選択')).toBe(false);
    expect(listHeadings.map((heading) => heading.text)).toEqual([
      'Second post',
      '進口程序說明',
      'Fourth post',
    ]);
    expect(editorial).toContain('href="/ja/columns/one"');
    expect(editorial).toContain('href="/ja/columns/two"');
    expect(editorial).toContain('href="/ja/columns"');
    expect(editorial).toContain('Summary one');
    expect(editorial).toContain('Summary two');
    expect(editorial).toContain('Summary four');
    expect(editorial).toContain('1 / 2');
    expect(listCards).toHaveLength(3);
    expect(listCards[0].split('Cat-B').length - 1).toBe(1);
    expect(listCards[1].split('Cat-C').length - 1).toBe(1);
    expect(listCards[2].split('Cat-D').length - 1).toBe(1);
    expect(editorial).not.toContain('insights-category-badge--compact');
    expect(standard).toContain('insights-category-badge--compact');
  });

  it('protects ZH insight title units only in the matching editorial heading', () => {
    const editorial = renderToStaticMarkup(
      createElement(InsightsArchiveSection, {
        locale: 'zh-hant',
        posts: insightPosts,
        presentation: 'editorial',
      }),
    );
    const standard = renderToStaticMarkup(
      createElement(InsightsArchiveSection, { locale: 'zh-hant', posts: insightPosts }),
    );
    const editorialImport = headingEntries(editorial, 'h4', 'insights-list-title').find(
      (heading) => heading.text === '進口程序說明',
    );
    const standardImport = headingEntries(standard, 'h4', 'insights-list-title').find(
      (heading) => heading.text === '進口程序說明',
    );
    const featured = headingEntries(editorial, 'h3', 'insights-featured-title')[0];

    expect(editorialImport?.text).toBe('進口程序說明');
    expect(standardImport?.text).toBe('進口程序說明');
    expect(headingHasNowrapUnit(editorialImport?.inner ?? '', '進口')).toBe(true);
    expect(headingHasNowrapUnit(standardImport?.inner ?? '', '進口')).toBe(false);
    expect(featured.text).toBe('支店の選択と財産');
    expect(headingHasNowrapUnit(featured.inner, '進口')).toBe(false);
    expect(headingHasNowrapUnit(featured.inner, '選択')).toBe(false);
  });
});

describe('editorial office presentation', () => {
  // WO-X1 (J02/EN-03): EN/JA reduce the Korea office to one text line, so the
  // card contract below is checked on zh-hant, which keeps the card.
  it('keeps unique Korea label and one address/NAVER action in both presentations (WO-DS1 F: default is a single card too)', () => {
    const editorial = renderToStaticMarkup(
      createElement(OfficeMapTabs, { locale: 'zh-hant', presentation: 'editorial' }),
    );
    const standard = renderToStaticMarkup(createElement(OfficeMapTabs, { locale: 'zh-hant' }));
    const editorialKorea = koreaBlock(editorial);
    const standardKorea = koreaBlock(standard);
    const standardKoreaHeadings = headingEntries(standardKorea, 'h3', 'office-korea-title');
    const editorialKoreaHeadings = headingEntries(editorialKorea, 'h3', 'office-korea-title');
    const koreaTitle = standardKoreaHeadings[0]?.text ?? '';
    const elementTexts = (html: string, pattern: RegExp) =>
      [...html.matchAll(pattern)].map((match) => decodeEntities(match[1].replace(/<[^>]+>/g, '')));
    const standardStrongTitles = elementTexts(standardKorea, /<strong\b[^>]*>([\s\S]*?)<\/strong>/g);
    const editorialStrongTitles = elementTexts(editorialKorea, /<strong\b[^>]*>([\s\S]*?)<\/strong>/g);
    const standardCardCopy = elementTexts(standardKorea, /<p class="card-copy">([\s\S]*?)<\/p>/g);
    const editorialCardCopy = elementTexts(editorialKorea, /<p class="card-copy">([\s\S]*?)<\/p>/g);
    const standardPlainSpans = elementTexts(standardKorea, /<span>([\s\S]*?)<\/span>/g);
    const editorialPlainSpans = elementTexts(editorialKorea, /<span>([\s\S]*?)<\/span>/g);
    const koreaAddress = standardCardCopy[0];

    expect(editorial.match(/role="tab"/g)?.length).toBe(standard.match(/role="tab"/g)?.length);
    expect((editorial.match(/role="tab"/g) ?? []).length).toBeGreaterThanOrEqual(4);
    expect(editorial).toContain('台北');
    expect(editorial).toContain('office-gallery');
    expect(standardKorea).toContain('韓國辦公室地址');
    expect(editorialKorea).toContain('韓國辦公室地址');
    expect(koreaTitle).toBeTruthy();
    expect(standardKoreaHeadings).toHaveLength(1);
    expect(editorialKoreaHeadings).toHaveLength(1);
    expect(editorialKoreaHeadings[0].text).toBe(koreaTitle);
    expect(standardStrongTitles).not.toContain(koreaTitle);
    expect(editorialStrongTitles).not.toContain(koreaTitle);
    expect(koreaAddress).toBeTruthy();
    expect(editorialCardCopy).toEqual(standardCardCopy);
    expect(editorialCardCopy.filter((text) => text === koreaAddress)).toHaveLength(1);
    expect(standardCardCopy.filter((text) => text === koreaAddress)).toHaveLength(1);
    expect(standardPlainSpans).not.toContain(koreaAddress);
    expect(editorialPlainSpans).not.toContain(koreaAddress);
    expect(standardKorea).not.toContain('office-map-wrap--naver');
    expect(editorialKorea).not.toContain('office-map-wrap--naver');
    expect((standardKorea.match(/office-map-fallback-link/g) ?? []).length).toBe(0);
    expect((standardKorea.match(/office-map-fallback-kicker/g) ?? []).length).toBe(1);
    expect((standardKorea.match(/class="card office-card/g) ?? []).length).toBe(1);
    expect((editorialKorea.match(/office-map-fallback-link/g) ?? []).length).toBe(0);
    expect((editorialKorea.match(/office-map-link/g) ?? []).length).toBe(1);
    expect((standardKorea.match(/office-map-link/g) ?? []).length).toBe(1);
    expect(officeMapHrefs(standard)).toHaveLength(2);
    expect(officeMapHrefs(editorial)).toEqual(officeMapHrefs(standard));
    expect(officeTelHrefs(standard).length).toBeGreaterThan(0);
    expect(officeTelHrefs(editorial)).toEqual(officeTelHrefs(standard));
    expect(standard).toMatch(/office-map-fallback-kicker[\s\S]*?<strong>/);
    expect(editorial).not.toMatch(/office-map-fallback-kicker[\s\S]*?<strong>/);
    if (standard.includes('<iframe')) {
      expect(editorial).toContain('<iframe');
      expect(editorial).toContain('no-referrer-when-downgrade');
    }
  });

  it('preserves custom and empty office header SurfaceText in editorial mode', () => {
    const custom = renderToStaticMarkup(
      <BuilderSurfaceProvider
        nodeId="home-offices"
        mode="published"
        overrides={{ headline: 'カスタム事務所' }}
        selectedSurfaceKey={null}
      >
        <OfficeMapTabs locale="ja" presentation="editorial" />
      </BuilderSurfaceProvider>,
    );
    expect(headingEntries(custom, 'h2', 'section-title')[0].text).toBe('カスタム事務所');
    expect(custom).toContain('台北事務所');

    const empty = renderToStaticMarkup(
      <BuilderSurfaceProvider
        nodeId="home-offices"
        mode="published"
        overrides={{ headline: '', 'section-label': '' }}
        selectedSurfaceKey={null}
      >
        <OfficeMapTabs locale="ja" presentation="editorial" />
      </BuilderSurfaceProvider>,
    );
    expect(headingEntries(empty, 'h2', 'section-title')[0].text).toBe('');
    expect(empty).not.toContain('OFFICES');
    expect(empty).toContain('台北事務所');
    // WO-X1 (J02): JA shows the Korea office as a single address line.
    expect(koreaBlock(empty)).toBe('');
    expect(empty).toContain('data-office-korea-compact');
    expect(empty).toContain('韓国事務所：');
    expect(empty).not.toContain('tel:+82');
  });
});
