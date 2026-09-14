import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LegacyHomePageBody } from '@/app/[locale]/(legacy)/home-legacy';
import { ServicesLegacyPageBody } from '@/app/[locale]/(legacy)/legacy-page-bodies';
import CinematicRouteShell from '@/components/CinematicRouteShell';
import type { SiteLocale } from '@/lib/locales';

const EN_ACQUISITION_HREFS = [
  '/en/taiwan-lawyer',
  '/en/taiwan-company-setup-lawyer',
  '/en/taiwan-litigation-lawyer',
] as const;

const EN_ACQUISITION_LABELS = [
  'Taiwan lawyer',
  'Taiwan company setup lawyer',
  'Taiwan litigation lawyer',
] as const;

const OTHER_LOCALES = ['ko', 'zh-hant', 'ja'] as const satisfies readonly SiteLocale[];

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

function expectAcquisitionHub(html: string) {
  const main = mainInner(html);
  expect(main).toContain('Guides for overseas clients');
  for (const href of EN_ACQUISITION_HREFS) {
    expect(main).toContain(`href="${href}"`);
  }
  for (const label of EN_ACQUISITION_LABELS) {
    expect(main).toContain(label);
  }
}

function expectNoAcquisitionHub(html: string, locale: SiteLocale) {
  const main = mainInner(html);
  expect(main).not.toContain('Guides for overseas clients');
  for (const href of EN_ACQUISITION_HREFS) {
    expect(main).not.toContain(`href="${href}"`);
  }
  expect(main).not.toContain(`href="/${locale}/taiwan-company-setup-lawyer"`);
  expect(main).not.toContain(`href="/${locale}/taiwan-litigation-lawyer"`);
}

describe('EN acquisition guide hub in home / services / columns main (P1-5①②)', () => {
  beforeEach(() => {
    navigation.pathname = '/en/columns';
    builderMocks.resolvePublishedSitePage.mockResolvedValue(null);
    builderMocks.getAllColumnPostsIncludingBlob.mockResolvedValue([]);
  });

  it('puts the three query-style landing links inside EN home <main>', () => {
    const html = renderInMain(
      <LegacyHomePageBody locale="en" posts={[]} faqItems={[]} />,
    );
    expectAcquisitionHub(html);
  });

  it.each(OTHER_LOCALES)('does not render the EN acquisition hub on %s home', (locale) => {
    const html = renderToStaticMarkup(
      <CinematicRouteShell locale={locale} header={null} footer={null} scrollTop={null}>
        <LegacyHomePageBody locale={locale} posts={[]} faqItems={[]} />
      </CinematicRouteShell>,
    );
    expectNoAcquisitionHub(html, locale);
  });

  it('puts the three query-style landing links inside EN services <main>', () => {
    const html = renderInMain(
      <ServicesLegacyPageBody
        locale="en"
        visibleBlockIds={['service-areas.list.hero', 'service-areas.list.repeater']}
      />,
    );
    expectAcquisitionHub(html);
  });

  it.each(OTHER_LOCALES)('does not render the EN acquisition hub on %s services', (locale) => {
    const html = renderToStaticMarkup(
      <CinematicRouteShell locale={locale} header={null} footer={null} scrollTop={null}>
        <ServicesLegacyPageBody
          locale={locale}
          visibleBlockIds={['service-areas.list.hero', 'service-areas.list.repeater']}
        />
      </CinematicRouteShell>,
    );
    expectNoAcquisitionHub(html, locale);
  });

  it('puts the three query-style landing links inside EN columns list <main>', async () => {
    const page = await ColumnsPage({
      params: Promise.resolve({ locale: 'en' }),
    });
    const html = renderInMain(page);
    expectAcquisitionHub(html);
  });

  it.each(OTHER_LOCALES)(
    'does not render the EN acquisition hub on %s columns list',
    async (locale) => {
      navigation.pathname = `/${locale}/columns`;
      const page = await ColumnsPage({
        params: Promise.resolve({ locale }),
      });
      const html = renderToStaticMarkup(
        <CinematicRouteShell locale={locale} header={null} footer={null} scrollTop={null}>
          {page}
        </CinematicRouteShell>,
      );
      expectNoAcquisitionHub(html, locale);
    },
  );
});
