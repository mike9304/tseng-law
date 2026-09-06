import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import IntentLandingPage from '@/components/IntentLandingPage';
import { intentPageSlugs } from '@/data/intent-pages';
import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import type { SiteLocale } from '@/lib/locales';

function renderLanding(locale: SiteLocale, slug: (typeof intentPageSlugs)[number]): string {
  return renderToStaticMarkup(<IntentLandingPage locale={locale} slug={slug} />);
}

function htmlHref(href: string): string {
  return href.replace(/&/g, '&amp;');
}

function pageHeaderHtml(html: string): string {
  const header = html.match(/<section\b[^>]*class="(?:[^"]*\s)?page-header(?:\s[^"]*)?"[^>]*>[\s\S]*?<\/section>/)?.[0];
  expect(header).toBeDefined();
  return header!;
}

function bottomCtaHtml(html: string): string {
  const opening = html.match(/<div\b[^>]*class="(?:[^"]*\s)?intent-cta-card(?:\s[^"]*)?"[^>]*>/);
  expect(opening).not.toBeNull();
  return html.slice(opening!.index);
}

describe('intent landing EN/JA contact paths', () => {
  it.each(intentPageSlugs)(
    'puts the official EN mailto, same-locale fees link, and initial-information warning in the page header for %s',
    (slug) => {
      const html = renderLanding('en', slug);
      const header = pageHeaderHtml(html);
      const cta = bottomCtaHtml(html);
      const mailto = htmlHref(getConsultationPublicMailto('en'));

      expect(header).toContain(`href="${mailto}"`);
      expect(header).toContain('Email about your Taiwan matter');
      expect(header).toContain('href="/en/pricing"');
      expect(header).toContain('Fees and scope');
      expect(header).toContain('Consultations in English, Japanese, and Korean');
      expect(header).toContain('brief overview');
      expect(header).toContain('Sensitive materials only after attorney instructions');
      expect(header).not.toContain('intent-chip');
      expect(header).not.toMatch(/Book Consultation|booked|message has been sent/i);

      expect(html).toContain('Do not send passport or identification numbers');
      expect(cta).toContain(`href="${mailto}"`);
      expect(cta).toContain('href="/en/pricing"');
      expect(cta).toContain('Email a brief initial summary');
      expect(cta).not.toMatch(/Book Consultation|booked|message has been sent/i);
    },
  );

  it.each(intentPageSlugs)(
    'puts the official JA mailto, same-locale fees link, and initial-information warning in the page header for %s',
    (slug) => {
      const html = renderLanding('ja', slug);
      const header = pageHeaderHtml(html);
      const cta = bottomCtaHtml(html);
      const mailto = htmlHref(getConsultationPublicMailto('ja'));

      expect(header).toContain(`href="${mailto}"`);
      expect(header).toContain('台湾の法律問題をメールで相談');
      expect(header).toContain('href="/ja/pricing"');
      expect(header).toContain('費用・対応範囲');
      expect(header).toContain('英語・日本語・韓国語');
      expect(header).toContain('簡潔な概要');
      expect(header).toContain('機微情報は弁護士の指示後');
      expect(header).not.toContain('intent-chip');
      expect(header).not.toMatch(/Book Consultation|予約完了|送信済み/);

      expect(html).toContain('旅券番号、身分証番号、銀行口座情報');
      expect(cta).toContain(`href="${mailto}"`);
      expect(cta).toContain('href="/ja/pricing"');
      expect(cta).toContain('簡潔な概要、期限、連絡先をメールでお送りください');
      expect(cta).not.toMatch(/Book Consultation|予約完了|送信済み/);
    },
  );

  it.each(['ko', 'zh-hant'] as const)(
    'keeps the %s page header as keyword chips without the EN/JA header contact actions',
    (locale) => {
      const html = renderLanding(locale, 'taiwan-lawyer');
      const header = pageHeaderHtml(html);

      expect(header).toContain('intent-chip');
      expect(header).not.toContain(htmlHref(getConsultationPublicMailto(locale)));
      expect(header).not.toContain('Email about your Taiwan matter');
      expect(header).not.toContain('台湾の法律問題をメールで相談');
      expect(header).not.toContain(`href="/${locale}/pricing"`);
    },
  );
});
