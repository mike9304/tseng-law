import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
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

import FAQAccordion from '@/components/FAQAccordion';
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
    const metadata = await generateMetadata({ params: { locale: 'ja' } });

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

  it('renders the complete Japanese FAQ surface and schema without published, member, or FAQ-engine calls', async () => {
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
    mocks.generateFAQSchema.mockReturnValue(japaneseSchema);

    const element = await FaqPage({ params: { locale: 'ja' } });

    expect(React.isValidElement<{ children?: React.ReactNode }>(element)).toBe(true);
    if (!React.isValidElement<{ children?: React.ReactNode }>(element)) {
      throw new Error('Expected the Japanese FAQ route to return a React element');
    }

    const children = React.Children.toArray(element.props.children);
    const header = children.find((child) => React.isValidElement(child) && child.type === PageHeader);
    const accordion = children.find((child) => React.isValidElement(child) && child.type === FAQAccordion);
    const jsonLd = children.find((child) => React.isValidElement(child) && child.type === JsonLd);

    expect(React.isValidElement<React.ComponentProps<typeof PageHeader>>(header)).toBe(true);
    expect(React.isValidElement<React.ComponentProps<typeof FAQAccordion>>(accordion)).toBe(true);
    expect(React.isValidElement<React.ComponentProps<typeof JsonLd>>(jsonLd)).toBe(true);
    if (
      !React.isValidElement<React.ComponentProps<typeof PageHeader>>(header)
      || !React.isValidElement<React.ComponentProps<typeof FAQAccordion>>(accordion)
      || !React.isValidElement<React.ComponentProps<typeof JsonLd>>(jsonLd)
    ) {
      throw new Error('Expected Japanese PageHeader, FAQAccordion, and JsonLd elements');
    }

    expect(mocks.generateFAQSchema).toHaveBeenCalledOnce();
    expect(mocks.generateFAQSchema).toHaveBeenCalledWith(faqContent.ja);
    expect(jsonLd.props.data).toBe(japaneseSchema);
    expect(header.props).toMatchObject({
      locale: 'ja',
      ...pageCopy.ja.faq,
    });
    expect(accordion.props.locale).toBe('ja');
    expect(accordion.props.items).toEqual(faqContent.ja);
    expect(accordion.props.items.map((item) => item.question)).toEqual(
      faqContent.ja.map((item) => item.question),
    );

    const accordionHtml = renderToStaticMarkup(accordion);
    expect(accordionHtml).toContain('>FAQ<');
    expect(accordionHtml).toContain('>よくある質問<');
    for (const item of faqContent.ja) {
      expect(accordionHtml).toContain(item.question);
    }

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
    expect(mocks.listFaqCategories).not.toHaveBeenCalled();
    expect(mocks.listFaqItems).not.toHaveBeenCalled();
    expect(mocks.faqItemsToSchemaItems).not.toHaveBeenCalled();
  });

  it('keeps the established Korean builder metadata and FAQ engine calls', async () => {
    await generateMetadata({ params: { locale: 'ko' } });
    await FaqPage({ params: { locale: 'ko' } });

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
