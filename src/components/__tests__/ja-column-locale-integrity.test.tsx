import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import AttorneyAuthorityCard from '@/components/AttorneyAuthorityCard';
import HomeAttorneySplit from '@/components/HomeAttorneySplit';
import InsightsArchiveSection from '@/components/InsightsArchiveSection';
import { attorneyProfiles } from '@/data/attorney-profiles';
import { teamContent } from '@/data/team-members';
import {
  buildArticleJsonLd,
  buildCollectionPageJsonLd,
  buildFaqJsonLd,
} from '@/lib/seo';

const japaneseProfile = attorneyProfiles.ja['wei-tseng'];
const japaneseLead = teamContent.ja.members[0];
const samplePost = {
  slug: 'taiwan-company-establishment-basics',
  title: '台湾会社設立の基本',
  date: '2026-07-24',
  dateDisplay: '2026年7月24日',
  readTime: '5分',
  categoryLabel: '台湾会社設立',
  featuredImage: '/images/placeholder-article-hero.jpg',
  summary: '台湾で会社を設立する際の基本事項を解説します。',
};

const forbiddenJapaneseFallbacks = [
  '/en/lawyers/wei-tseng',
  '/en/contact',
  '/en/taiwan-company-setup-lawyer',
  '/en/taiwan-lawyer',
  'Attorney Wei Tseng',
  'Hovering official profile',
  'Personal profile website',
  'Taiwan Attorney · Managing Attorney',
  'Taiwan Company Setup',
  'Core Practice Areas',
];

describe('Japanese column locale integrity', () => {
  it('renders the Japanese attorney profile, public labels, and internal routes', () => {
    const html = renderToStaticMarkup(<AttorneyAuthorityCard locale="ja" />);

    expect(html).toContain(japaneseProfile.name);
    expect(html).toContain(japaneseProfile.role);
    expect(html).toContain(japaneseProfile.summary[0]);
    expect(html).toContain('主な対応分野');
    expect(html).toContain('公開プロフィールとチャンネル');
    expect(html).toContain('昊鼎公式弁護士プロフィール');
    expect(html).toContain('個人プロフィールサイト');
    expect(html).toContain('href="/ja/lawyers/wei-tseng"');
    expect(html).toContain('href="mailto:wei@hoveringlaw.com.tw?subject=');

    for (const practiceArea of japaneseProfile.practiceAreas.slice(0, 4)) {
      expect(html).toContain(practiceArea);
    }
    for (const forbidden of forbiddenJapaneseFallbacks) {
      expect(html).not.toContain(forbidden);
    }
  });

  it('renders Japanese team data and attorney profile route on the home attorney split', () => {
    const html = renderToStaticMarkup(<HomeAttorneySplit locale="ja" />);

    expect(html).toContain(japaneseLead.name);
    expect(html).toContain(japaneseLead.role);
    expect(html).toContain(japaneseLead.intro[0]);
    expect(html).toContain(japaneseLead.intro[1]);
    expect(html).toContain('href="/ja/lawyers/wei-tseng"');
    expect(html).not.toContain('Attorney Wei Tseng');
    expect(html).not.toContain('/en/lawyers/wei-tseng');
  });

  it('links the Japanese reviewed-by byline to the Japanese attorney profile', () => {
    const html = renderToStaticMarkup(
      <InsightsArchiveSection locale="ja" posts={[samplePost]} />,
    );

    expect(html).toContain('曾雋崴弁護士監修');
    expect(html).toContain('href="/ja/lawyers/wei-tseng"');
    expect(html).not.toContain('/en/lawyers/wei-tseng');
    expect(html).not.toContain('Reviewed by Wei Tseng');
  });

  it('emits Japanese Article, FAQ, and CollectionPage structured data', () => {
    const article = buildArticleJsonLd({
      locale: 'ja',
      title: samplePost.title,
      description: samplePost.summary,
      path: `/ja/columns/${samplePost.slug}`,
      authorName: japaneseProfile.name,
      authorUrl: '/ja/lawyers/wei-tseng',
    });
    const faq = buildFaqJsonLd(
      [{ q: '相談は日本語でできますか？', a: 'はい、日本語でご相談いただけます。' }],
      'ja',
    );
    const collection = buildCollectionPageJsonLd({
      locale: 'ja',
      path: '/ja/columns',
      name: '台湾法律コラム',
      description: '日本語で台湾法務を解説するコラムです。',
      items: [{
        name: `${samplePost.title} · 曾雋崴弁護士`,
        path: `/ja/columns/${samplePost.slug}`,
        description: samplePost.summary,
      }],
    });

    expect(article).toMatchObject({
      inLanguage: 'ja',
      publisher: { name: '昊鼎国際法律事務所' },
      author: {
        name: '曾雋崴弁護士',
        url: 'https://tseng-law.com/ja/lawyers/wei-tseng',
      },
    });
    expect(faq).toMatchObject({
      '@type': 'FAQPage',
      inLanguage: 'ja',
    });
    expect(collection).toMatchObject({
      '@type': 'CollectionPage',
      inLanguage: 'ja',
      name: '台湾法律コラム',
      description: '日本語で台湾法務を解説するコラムです。',
      mainEntity: {
        itemListElement: [{
          name: '台湾会社設立の基本 · 曾雋崴弁護士',
          url: 'https://tseng-law.com/ja/columns/taiwan-company-establishment-basics',
          description: samplePost.summary,
        }],
      },
    });
  });

  it('keeps public locale calls direct while preserving builder-only locale boundaries', () => {
    const detailSource = readFileSync(
      new URL('../../app/[locale]/columns/[slug]/page.tsx', import.meta.url),
      'utf8',
    );
    const listSource = readFileSync(
      new URL('../../app/[locale]/columns/page.tsx', import.meta.url),
      'utf8',
    );

    expect(detailSource).toContain('const authorProfilePath = getAttorneyProfilePath(locale);');
    expect(detailSource).toContain('buildBreadcrumbJsonLd(locale,');
    expect(detailSource).toContain('const faqJsonLd = showFaq ? buildFaqJsonLd(faqItems, locale) : null;');
    expect(detailSource).toContain('href={getConsultationPublicMailto(locale)}');
    expect(detailSource).toContain("locale === 'ja' ? 'ホーム' : 'Home'");
    expect(detailSource).not.toContain('const linkLocale');
    expect(detailSource).not.toContain('getAttorneyProfilePath(toBuilderLocale(locale))');
    expect(detailSource).not.toContain('buildBreadcrumbJsonLd(toBuilderLocale(locale)');
    expect(detailSource).not.toContain('buildFaqJsonLd(faqItems, toBuilderLocale(locale))');
    expect(detailSource).not.toContain('locale: toBuilderLocale(locale),');
    expect(detailSource).toContain("'columns.item-template',\n    toBuilderLocale(locale)");
    expect(detailSource).toContain('resolveTypography(\n    toBuilderLocale(locale),');

    expect(listSource).toContain('buildBreadcrumbJsonLd(locale,');
    expect(listSource).toContain('locale,\n              path: `/${locale}/columns`,');
    expect(listSource).toContain("locale === 'ja' ? 'ホーム' : 'Home'");
    expect(listSource).not.toContain('buildBreadcrumbJsonLd(toBuilderLocale(locale)');
    expect(listSource).not.toContain('locale: toBuilderLocale(locale),');
    expect(listSource).toContain("'columns.list-template',\n    toBuilderLocale(locale)");
  });

  it('contains the exact public-safe Japanese guide labels and routes', () => {
    const detailSource = readFileSync(
      new URL('../../app/[locale]/columns/[slug]/page.tsx', import.meta.url),
      'utf8',
    );

    const expectedJapaneseGuides = [
      "{ href: '/ja/services#investment', label: '台湾投資・会社設立' }",
      "{ href: '/ja/services#civil', label: '台湾の民事紛争' }",
      "{ href: '/ja/services', label: '取扱業務' }",
      "{ href: '/ja/lawyers/wei-tseng', label: '曾雋崴弁護士' }",
    ];

    for (const guide of expectedJapaneseGuides) {
      expect(detailSource).toContain(guide);
    }
    expect(detailSource.match(
      /\{ href: '\/ja\/lawyers\/wei-tseng', label: '曾雋崴弁護士' \}/g,
    )).toHaveLength(3);
  });

  it('keeps the authority-card copy inside its desktop grid track', () => {
    const css = readFileSync(
      new URL('../../app/globals.css', import.meta.url),
      'utf8',
    );

    expect(css).toMatch(
      /\.authority-card-copy\s*\{[^}]*min-width:\s*0;/s,
    );
    expect(css).toMatch(
      /\.authority-card-name,\s*\.authority-card-role,\s*\.authority-card-summary\s*\{[^}]*min-width:\s*0;[^}]*word-break:\s*normal;[^}]*overflow-wrap:\s*anywhere;/s,
    );
  });
});
