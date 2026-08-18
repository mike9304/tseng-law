import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  buildPublishedSitePageMetadata: vi.fn(),
  checkAccess: vi.fn(),
  emitPublicPageRenderHook: vi.fn(),
  faqItemsToSchemaItems: vi.fn(),
  FaqPublicExplorer: vi.fn(),
  generateFAQSchema: vi.fn(),
  getCurrentSiteMember: vi.fn(),
  listFaqCategories: vi.fn(),
  listFaqItems: vi.fn(),
  PublishedSitePageView: vi.fn(),
  redirect: vi.fn(),
  resolvePublishedSitePage: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: mocks.redirect,
}));

vi.mock('@/components/faq/FaqPublicExplorer', () => ({
  default: mocks.FaqPublicExplorer,
}));

vi.mock('@/lib/builder/site/public-page', () => ({
  buildPublishedSitePageMetadata: mocks.buildPublishedSitePageMetadata,
  PublishedSitePageView: mocks.PublishedSitePageView,
  resolvePublishedSitePage: mocks.resolvePublishedSitePage,
}));

vi.mock('@/lib/builder/apps/lifecycle-emitters', () => ({
  emitPublicPageRenderHook: mocks.emitPublicPageRenderHook,
}));

vi.mock('@/lib/builder/faq/faq-engine', () => ({
  faqItemsToSchemaItems: mocks.faqItemsToSchemaItems,
  listFaqCategories: mocks.listFaqCategories,
  listFaqItems: mocks.listFaqItems,
}));

vi.mock('@/lib/builder/seo/schema-org', () => ({
  generateFAQSchema: mocks.generateFAQSchema,
}));

vi.mock('@/lib/builder/members/current-member', () => ({
  getCurrentSiteMember: mocks.getCurrentSiteMember,
}));

vi.mock('@/lib/builder/members/members-engine', () => ({
  checkAccess: mocks.checkAccess,
}));

import JsonLd from '@/components/JsonLd';
import PageHeader from '@/components/PageHeader';
import { faqContent } from '@/data/faq-content';
import { pageCopy } from '@/data/page-copy';
import FaqPage, { generateMetadata } from '../page';

describe('WO-I18N-P01 Japanese FAQ page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.buildPublishedSitePageMetadata.mockResolvedValue(null);
    mocks.faqItemsToSchemaItems.mockReturnValue([]);
    mocks.generateFAQSchema.mockReturnValue({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [],
    });
    mocks.listFaqCategories.mockReturnValue([]);
    mocks.listFaqItems.mockResolvedValue([]);
    mocks.resolvePublishedSitePage.mockResolvedValue(null);
  });

  it('builds Japanese metadata with the Japanese canonical, locale, and all indexable public alternates', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: 'ja' }) });

    expect(metadata.title).toBe(pageCopy.ja.faq.title);
    expect(metadata.description).toBe(pageCopy.ja.faq.description);
    expect(new URL(String(metadata.alternates?.canonical)).pathname).toBe('/ja/faq');
    expect(metadata.other?.['content-language']).toBe('ja');
    expect(metadata.openGraph).toMatchObject({
      locale: 'ja_JP',
      title: pageCopy.ja.faq.title,
      description: pageCopy.ja.faq.description,
    });

    const languages = metadata.alternates?.languages as Record<string, string>;
    // WO#3: /en/faq is robots-noindex, so en must not be advertised in
    // faq hreflang alternates (previously sent a contradictory signal).
    expect(languages).not.toHaveProperty('en');
    expect(Object.fromEntries(
      ['ko', 'zh-Hant', 'ja'].map((language) => [
        language,
        new URL(String(languages[language])).pathname,
      ]),
    )).toEqual({
      ko: '/ko/faq',
      'zh-Hant': '/zh-hant/faq',
      ja: '/ja/faq',
    });
    expect(mocks.buildPublishedSitePageMetadata).not.toHaveBeenCalled();
  });

  it('renders the Japanese FAQ through the public explorer with the FAQ engine and schema', async () => {
    const japaneseSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqContent.ja.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };
    const jaItems = faqContent.ja.map((item, index) => ({
      faqId: `seed-ja-${index + 1}`,
      slug: `ja-${index + 1}`,
      locale: 'ja' as const,
      question: item.question,
      answer: item.answer,
      categoryId: 'consultation',
      tags: [],
      status: 'published' as const,
      sortOrder: (index + 1) * 10,
      schemaEnabled: true,
      createdAt: '2026-05-20T00:00:00.000Z',
      updatedAt: '2026-05-20T00:00:00.000Z',
    }));
    mocks.listFaqItems.mockResolvedValue(jaItems);
    mocks.faqItemsToSchemaItems.mockReturnValue(faqContent.ja);
    mocks.generateFAQSchema.mockReturnValue(japaneseSchema);

    const element = await FaqPage({ params: Promise.resolve({ locale: 'ja' }) });

    expect(React.isValidElement<{ children?: React.ReactNode }>(element)).toBe(true);
    if (!React.isValidElement<{ children?: React.ReactNode }>(element)) {
      throw new Error('Expected the Japanese FAQ route to return a React element');
    }

    const children = React.Children.toArray(element.props.children);
    const header = children.find((child) => React.isValidElement(child) && child.type === PageHeader);
    const explorer = children.find((child) => React.isValidElement(child) && child.type === mocks.FaqPublicExplorer);
    const jsonLd = children.find((child) => React.isValidElement(child) && child.type === JsonLd);

    expect(React.isValidElement<React.ComponentProps<typeof PageHeader>>(header)).toBe(true);
    expect(React.isValidElement(explorer)).toBe(true);
    expect(React.isValidElement<React.ComponentProps<typeof JsonLd>>(jsonLd)).toBe(true);
    if (
      !React.isValidElement<React.ComponentProps<typeof PageHeader>>(header)
      || !React.isValidElement<{
        locale: string;
        categories: unknown;
        items: unknown;
        initialCategory?: string;
        initialQuery?: string;
      }>(explorer)
      || !React.isValidElement<React.ComponentProps<typeof JsonLd>>(jsonLd)
    ) {
      throw new Error('Expected Japanese PageHeader, FaqPublicExplorer, and JsonLd elements');
    }

    expect(header.props).toMatchObject({
      locale: 'ja',
      ...pageCopy.ja.faq,
    });
    expect(explorer.props.locale).toBe('ja');
    expect(explorer.props.items).toEqual(jaItems);
    expect(explorer.props.items).toHaveLength(faqContent.ja.length);

    expect(mocks.listFaqCategories).toHaveBeenCalledOnce();
    expect(mocks.listFaqItems).toHaveBeenCalledWith({
      locale: 'ja',
      status: 'published',
      categoryId: undefined,
      q: undefined,
    });
    expect(mocks.faqItemsToSchemaItems).toHaveBeenCalledWith(jaItems);
    expect(mocks.generateFAQSchema).toHaveBeenCalledOnce();
    expect(mocks.generateFAQSchema).toHaveBeenCalledWith(faqContent.ja);
    expect(jsonLd.props.data).toBe(japaneseSchema);

    const schema = jsonLd.props.data as {
      '@type': string;
      mainEntity: Array<{
        name: string;
        acceptedAnswer: { text: string };
      }>;
    };
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(faqContent.ja.length);
    expect(schema.mainEntity.map((entity) => ({
      question: entity.name,
      answer: entity.acceptedAnswer.text,
    }))).toEqual(faqContent.ja);

    expect(mocks.resolvePublishedSitePage).not.toHaveBeenCalled();
    expect(mocks.getCurrentSiteMember).not.toHaveBeenCalled();
    expect(mocks.checkAccess).not.toHaveBeenCalled();
    expect(mocks.emitPublicPageRenderHook).not.toHaveBeenCalled();
  });

  it('keeps the established Korean builder metadata and FAQ engine calls', async () => {
    await generateMetadata({ params: Promise.resolve({ locale: 'ko' }) });
    await FaqPage({ params: Promise.resolve({ locale: 'ko' }) });

    expect(mocks.buildPublishedSitePageMetadata).toHaveBeenCalledWith('ko', 'faq');
    expect(mocks.resolvePublishedSitePage).toHaveBeenCalledWith('ko', 'faq');
    expect(mocks.listFaqCategories).toHaveBeenCalledOnce();
    expect(mocks.listFaqItems).toHaveBeenCalledWith({
      locale: 'ko',
      status: 'published',
      categoryId: undefined,
      q: undefined,
    });
    expect(mocks.faqItemsToSchemaItems).toHaveBeenCalledWith([]);
  });
});
