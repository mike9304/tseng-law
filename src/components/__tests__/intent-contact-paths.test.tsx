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

const generalIntentPageSlugs = intentPageSlugs.filter(
  (slug) => slug !== 'taiwan-semiconductor-supplier-legal',
);

describe('intent landing EN/JA contact paths', () => {
  it.each(generalIntentPageSlugs)(
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
      expect(header).toContain('Attorney Wei Tseng consults directly in English, Chinese, Korean, and Japanese.');
      expect(header).toContain('brief overview');
      expect(header).toContain('Sensitive materials only after attorney instructions');
      expect(header).not.toContain('intent-chip');
      expect(header).not.toMatch(/Book Consultation|booked|message has been sent/i);
      if (slug === 'taiwan-lawyer') {
        expect(header).toContain('href="/en/contact"');
        expect(header).toContain('Send an inquiry');
      }

      expect(html).toContain('Do not send passport or identification numbers');
      expect(cta).toContain(`href="${mailto}"`);
      expect(cta).toContain('href="/en/pricing"');
      expect(cta).toContain('Send a brief initial summary');
      expect(cta).not.toMatch(/Book Consultation|booked|message has been sent/i);
    },
  );

  it.each(generalIntentPageSlugs)(
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
      expect(header).toContain('曾雋崴弁護士に日本語で直接ご相談いただけます（中国語・英語・韓国語にも対応）。');
      expect(header).toContain('簡潔な概要');
      expect(header).toContain('機微情報は弁護士の指示後');
      expect(header).not.toContain('intent-chip');
      expect(header).not.toMatch(/Book Consultation|予約完了|送信済み/);
      if (slug === 'taiwan-lawyer') {
        expect(header).toContain('href="/ja/contact"');
        expect(header).toContain('お問い合わせを送る');
      }

      expect(html).toContain('旅券番号、身分証番号、銀行口座情報');
      expect(cta).toContain(`href="${mailto}"`);
      expect(cta).toContain('href="/ja/pricing"');
      expect(cta).toContain('簡潔な概要、期限、連絡先をお送りください');
      expect(cta).not.toMatch(/Book Consultation|予約完了|送信済み/);
    },
  );

  // ko joined the Apple system on 2026-10-06: its header carries the same email pill and pricing link as zh-hant,
  // with the ko landing labels (상담 문의 / 비용안내 보기); the EN/JA header block stays out.
  it.each(generalIntentPageSlugs)(
    'gives the ko %s header the ko email action and keyword chips, not the EN/JA header block',
    (slug) => {
      const html = renderLanding('ko', slug);
      const header = pageHeaderHtml(html);

      expect(html).toContain('id="ko-intent"');
      expect(header).toContain('intent-chip');
      expect(header).toContain(`href="${htmlHref(getConsultationPublicMailto('ko'))}"`);
      expect(header).toContain('>상담 문의</a>');
      expect(header).toContain('href="/ko/pricing"');
      expect(header).not.toContain('class="contact-email-actions"');
      expect(header).not.toContain('Email about your Taiwan matter');
      expect(header).not.toContain('台湾の法律問題をメールで相談');
    },
  );

  // zh-hant Apple pass (2026-10-03): the zh header carries its own email pill and 收費標準 link
  // (ZhHantIntentHeaderActions, existing labels), like the other zh pages; the EN/JA block stays out.
  it.each(generalIntentPageSlugs)(
    'gives the zh-hant %s header the zh email action and keyword chips, not the EN/JA header block',
    (slug) => {
      const html = renderLanding('zh-hant', slug);
      const header = pageHeaderHtml(html);

      expect(html).toContain('id="zh-hant-intent"');
      expect(header).toContain('intent-chip');
      expect(header).toContain(`href="${htmlHref(getConsultationPublicMailto('zh-hant'))}"`);
      expect(header).toContain('>電子郵件諮詢</a>');
      expect(header).toContain('href="/zh-hant/pricing"');
      expect(header).not.toContain('class="contact-email-actions"');
      expect(header).not.toContain('Email about your Taiwan matter');
      expect(header).not.toContain('台湾の法律問題をメールで相談');
    },
  );
});
