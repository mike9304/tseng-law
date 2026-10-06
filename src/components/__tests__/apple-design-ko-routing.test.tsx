import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { ReactElement } from 'react';
import {
  AboutLegacyPageBody,
  ContactLegacyPageBody,
  LawyersLegacyPageBody,
  PricingLegacyPageBody,
  ServicesLegacyPageBody,
  VideosLegacyPageBody,
} from '@/app/[locale]/(legacy)/legacy-page-bodies';
import ZhHantFaqShell from '@/components/zh-hant-faq/ZhHantFaqShell';
import ZhHantColumnsShell from '@/components/zh-hant-columns/ZhHantColumnsShell';
import { appleDesignRootProps, isAppleDesignLocale } from '@/lib/apple-design-locales';

/**
 * ko joined the zh-hant Apple pages on 2026-10-06. Each shared page body renders `id="ko-<page>" data-ko-design` for
 * ko and keeps `id="zh-hant-<page>" data-zh-hant-design` for zh-hant; the ko output never links into /zh-hant/.
 */
const PAGES: ReadonlyArray<[string, (locale: 'ko' | 'zh-hant') => ReactElement]> = [
  ['about', (locale) => <AboutLegacyPageBody locale={locale} />],
  ['services', (locale) => <ServicesLegacyPageBody locale={locale} />],
  ['contact', (locale) => <ContactLegacyPageBody locale={locale} />],
  ['lawyers', (locale) => <LawyersLegacyPageBody locale={locale} />],
  ['pricing', (locale) => <PricingLegacyPageBody locale={locale} />],
  ['videos', (locale) => <VideosLegacyPageBody locale={locale} columnCount={3} />],
  ['faq', (locale) => <ZhHantFaqShell locale={locale}><p>FAQ</p></ZhHantFaqShell>],
  ['columns', (locale) => <ZhHantColumnsShell locale={locale}><p>COLUMNS</p></ZhHantColumnsShell>],
];

describe('Apple design roots for ko and zh-hant', () => {
  it('knows exactly the two Apple-system locales', () => {
    expect(['ko', 'zh-hant', 'en', 'ja', 'vi', null].map((locale) => isAppleDesignLocale(locale))).toEqual([
      true, true, false, false, false, false,
    ]);
    expect(appleDesignRootProps('ko', 'column', 'issue')).toEqual({ id: 'ko-column', 'data-ko-design': 'issue' });
    expect(appleDesignRootProps('zh-hant', 'column', 'issue')).toEqual({ id: 'zh-hant-column', 'data-zh-hant-design': 'issue' });
  });

  it.each(PAGES)('renders the %s page on its locale root', (page, render) => {
    const zh = renderToStaticMarkup(render('zh-hant'));
    expect(zh).toContain(`id="zh-hant-${page}"`);
    expect(zh).toContain(`data-zh-hant-design="${page}"`);
    expect(zh).not.toContain('data-ko-design');

    const ko = renderToStaticMarkup(render('ko'));
    expect(ko).toContain(`id="ko-${page}"`);
    expect(ko).toContain(`data-ko-design="${page}"`);
    expect(ko).not.toContain('data-zh-hant-design');
    expect(ko).not.toContain('id="zh-hant-');
    expect(ko).not.toMatch(/href="\/zh-hant\//);
    expect(ko.match(new RegExp(`id="ko-${page}"`, 'g'))).toHaveLength(1);
  });
});
