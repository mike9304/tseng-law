import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LegacyHomePageBody } from '@/app/[locale]/(legacy)/home-legacy';
import { ServicesLegacyPageBody } from '@/app/[locale]/(legacy)/legacy-page-bodies';
import CinematicRouteShell from '@/components/CinematicRouteShell';
import type { SiteLocale } from '@/lib/locales';

const EN_ACQUISITION_HREFS = [
  '/en/taiwan-company-setup-lawyer',
  '/en/taiwan-litigation-lawyer',
  '/en/services/labor',
  '/en/taiwan-semiconductor-supplier-legal',
  '/en/taiwan-lawyer',
] as const;

const EN_ACQUISITION_LABELS = [
  'Set up a Taiwan entity',
  'Contracts, disputes &amp; litigation',
  'Employment &amp; labor issues',
  'Semiconductor &amp; equipment suppliers',
  'English-speaking Taiwan lawyer in Taipei',
] as const;

const JA_ENTRY_HREFS = [
  '/ja/taiwan-company-setup-lawyer',
  '/ja/taiwan-litigation-lawyer',
  '/ja/services/labor',
  '/ja/guides/taiwan-company-setup',
  '/ja/taiwan-semiconductor-supplier-legal',
  '/ja/taiwan-lawyer',
] as const;

const JA_ENTRY_LABELS = [
  '台湾での会社設立・進出',
  '契約・紛争・訴訟',
  '労務・雇用',
  '台湾会社設立ガイド',
  '半導体素材・装置サプライヤーの方へ',
  '日本語で相談できる台湾弁護士',
] as const;

const EN_HEADING = 'For overseas companies and international clients';
const JA_HEADING = '日系企業・在台日本人の方へ';

const OTHER_LOCALES = ['ko', 'zh-hant'] as const satisfies readonly SiteLocale[];

const navigation = vi.hoisted(() => ({
  pathname: '/en/columns',
  replace: vi.fn(),
}));

vi.mock('next/navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/navigation')>();
  return {
    ...actual,
    usePathname: () => navigation.pathname,
    useRouter: () => ({ replace: navigation.replace }),
    useSearchParams: () => null,
    redirect: vi.fn(),
  };
});

const builderMocks = vi.hoisted(() => ({
  resolvePublishedSitePage: vi.fn(async () => null),
  getAllColumnPostsIncludingBlob: vi.fn(async () => []),
  readBuilderDynamicTemplatePublishedBlockVisibility: vi.fn(async () => ({
    visibleBlockIds: ['columns.list.hero', 'columns.list.repeater', 'columns.list.seo'],
  })),
}));

vi.mock('@/lib/builder/site/public-page', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/site/public-page')>();
  return {
    ...actual,
    resolvePublishedSitePage: builderMocks.resolvePublishedSitePage,
  };
});

vi.mock('@/lib/consultation/columns-blob-reader', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/consultation/columns-blob-reader')>();
  return {
    ...actual,
    getAllColumnPostsIncludingBlob: builderMocks.getAllColumnPostsIncludingBlob,
  };
});

vi.mock('@/lib/builder/dynamic-template-drafts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/dynamic-template-drafts')>();
  return {
    ...actual,
    readBuilderDynamicTemplatePublishedBlockVisibility:
      builderMocks.readBuilderDynamicTemplatePublishedBlockVisibility,
  };
});

import ColumnsPage from '@/app/[locale]/columns/page';

function renderInMain(node: Parameters<typeof renderToStaticMarkup>[0]) {
  return renderToStaticMarkup(
    <CinematicRouteShell locale="en" header={null} footer={null} scrollTop={null}>
      {node}
    </CinematicRouteShell>,
  );
}

function mainInner(html: string): string {
  const match = html.match(/<main\b[^>]*>[\s\S]*<\/main>/);
  expect(match).not.toBeNull();
  return match![0];
}

function entryBlock(html: string, variant: 'full' | 'compact'): string {
  const main = mainInner(html);
  const match = main.match(
    new RegExp(`<section[^>]*data-overseas-entry="${variant}"[^>]*>[\\s\\S]*?</section>`),
  );
  expect(match, `expected ${variant} overseas entry block in <main>`).not.toBeNull();
  return match![0];
}

function expectEntryBlock(
  html: string,
  variant: 'full' | 'compact',
  heading: string,
  hrefs: readonly string[],
  labels: readonly string[],
) {
  const block = entryBlock(html, variant);
  expect(block).toContain(heading);
  for (const href of hrefs) {
    expect(block).toContain(`href="${href}"`);
  }
  for (const label of labels) {
    expect(block).toContain(label);
  }
  // One link per item: whole-card / whole-row links, never nested anchors.
  expect(block.match(/<a\b/g)?.length).toBe(hrefs.length);
  expect(block).not.toMatch(/<a\b[^>]*>(?:(?!<\/a>)[\s\S])*<a\b/);
}

function expectNoEntryBlock(html: string) {
  const main = mainInner(html);
  expect(main).not.toContain('data-overseas-entry');
  expect(main).not.toContain(EN_HEADING);
  expect(main).not.toContain(JA_HEADING);
  for (const href of EN_ACQUISITION_HREFS) {
    expect(main).not.toContain(`href="${href}"`);
  }
}

describe('Overseas / 日系企業 entry block in home / services / columns main (WO-G6)', () => {
  beforeEach(() => {
    navigation.pathname = '/en/columns';
    builderMocks.resolvePublishedSitePage.mockResolvedValue(null);
    builderMocks.getAllColumnPostsIncludingBlob.mockResolvedValue([]);
  });

  it('renders the full EN entry card grid inside EN home <main>', () => {
    const html = renderInMain(<LegacyHomePageBody locale="en" posts={[]} faqItems={[]} />);
    expectEntryBlock(html, 'full', EN_HEADING, EN_ACQUISITION_HREFS, EN_ACQUISITION_LABELS);
  });

  it('renders the full JA entry card grid inside JA home <main>', () => {
    const html = renderToStaticMarkup(
      <CinematicRouteShell locale="ja" header={null} footer={null} scrollTop={null}>
        <LegacyHomePageBody locale="ja" posts={[]} faqItems={[]} />
      </CinematicRouteShell>,
    );
    expectEntryBlock(html, 'full', JA_HEADING, JA_ENTRY_HREFS, JA_ENTRY_LABELS);
  });

  it('places the home block directly after the hero and before the practice section', () => {
    const html = mainInner(renderInMain(<LegacyHomePageBody locale="en" posts={[]} faqItems={[]} />));
    const blockAt = html.indexOf('data-overseas-entry="full"');
    const practiceAt = html.indexOf('id="practice"');
    expect(blockAt).toBeGreaterThan(-1);
    expect(practiceAt).toBeGreaterThan(blockAt);
  });

  it.each(OTHER_LOCALES)('does not render the entry block on %s home', (locale) => {
    const html = renderToStaticMarkup(
      <CinematicRouteShell locale={locale} header={null} footer={null} scrollTop={null}>
        <LegacyHomePageBody locale={locale} posts={[]} faqItems={[]} />
      </CinematicRouteShell>,
    );
    expectNoEntryBlock(html);
  });

  it('renders the compact EN block below the service cards on EN services', () => {
    const html = renderInMain(
      <ServicesLegacyPageBody
        locale="en"
        visibleBlockIds={['service-areas.list.hero', 'service-areas.list.repeater']}
      />,
    );
    expectEntryBlock(html, 'compact', EN_HEADING, EN_ACQUISITION_HREFS, EN_ACQUISITION_LABELS);
    const main = mainInner(html);
    expect(main.indexOf('data-overseas-entry="compact"')).toBeGreaterThan(
      main.indexOf('services-card-grid'),
    );
  });

  it('renders the compact JA block on JA services', () => {
    const html = renderToStaticMarkup(
      <CinematicRouteShell locale="ja" header={null} footer={null} scrollTop={null}>
        <ServicesLegacyPageBody locale="ja" />
      </CinematicRouteShell>,
    );
    expectEntryBlock(html, 'compact', JA_HEADING, JA_ENTRY_HREFS, JA_ENTRY_LABELS);
  });

  it.each(OTHER_LOCALES)('does not render the entry block on %s services', (locale) => {
    const html = renderToStaticMarkup(
      <CinematicRouteShell locale={locale} header={null} footer={null} scrollTop={null}>
        <ServicesLegacyPageBody
          locale={locale}
          visibleBlockIds={['service-areas.list.hero', 'service-areas.list.repeater']}
        />
      </CinematicRouteShell>,
    );
    expectNoEntryBlock(html);
  });

  it('keeps the compact EN block inside EN columns list <main>', async () => {
    const page = await ColumnsPage({
      params: Promise.resolve({ locale: 'en' }),
    });
    const html = renderInMain(page);
    expectEntryBlock(html, 'compact', EN_HEADING, EN_ACQUISITION_HREFS, EN_ACQUISITION_LABELS);
  });

  it.each(OTHER_LOCALES)('does not render the entry block on %s columns list', async (locale) => {
    navigation.pathname = `/${locale}/columns`;
    const page = await ColumnsPage({
      params: Promise.resolve({ locale }),
    });
    const html = renderToStaticMarkup(
      <CinematicRouteShell locale={locale} header={null} footer={null} scrollTop={null}>
        {page}
      </CinematicRouteShell>,
    );
    expectNoEntryBlock(html);
  });
});
