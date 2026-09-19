import { describe, expect, it } from 'vitest';
import {
  FIRM_POSTAL_ADDRESS,
  FIRM_REPRESENTATIVE_PHONE,
  renderConsultationAcknowledgement,
} from '@/lib/email/consultation-acknowledgement';
import { CONSULTATION_EMAIL } from '@/lib/consultation/public-contact';
import { siteLocales, type SiteLocale } from '@/lib/locales';

const LOCALES = [...siteLocales] as SiteLocale[];

/**
 * Wording bans come from the regulation gate in
 * docs/marketing/EMAIL-SEQUENCE-WELCOME-REENGAGE-2026-09-17.md §1/§7:
 * no outcome or win-rate claims, no free-consultation offer, no response-time
 * promise, and no advertisement framing on a transactional message.
 */
const FORBIDDEN = [
  /무료/, /승소/, /보장/, /최고/, /유일/, /24시간 내/, /영업일 내/,
  /免費/, /勝訴/, /保證/,
  /無料/, /勝訴を保証/,
  /\bfree consultation\b/i, /\bguarantee/i, /\bwithin 24 hours\b/i, /\bsuccess rate\b/i,
];

describe('F0 consultation acknowledgement copy', () => {
  it('renders every public site locale with the reference number in subject and body', () => {
    for (const locale of LOCALES) {
      const out = renderConsultationAcknowledgement({ locale, intakeId: 'HC-ABC12345' });
      expect(out.subject, locale).toContain('HC-ABC12345');
      expect(out.text, locale).toContain('HC-ABC12345');
      expect(out.html, locale).toContain('HC-ABC12345');
      expect(out.text.trim().length, locale).toBeGreaterThan(80);
    }
  });

  it('carries the display duty items: firm, attorney, address, representative phone, email', () => {
    for (const locale of LOCALES) {
      const { text, html } = renderConsultationAcknowledgement({ locale, intakeId: 'HC-1' });
      for (const body of [text, html]) {
        expect(body, locale).toContain('曾雋崴');
        expect(body, locale).toContain(FIRM_POSTAL_ADDRESS);
        expect(body, locale).toContain(FIRM_REPRESENTATIVE_PHONE);
        expect(body, locale).toContain(CONSULTATION_EMAIL);
      }
    }
  });

  it('labels the representative phone as the Taichung office so it is not read as Taipei', () => {
    const ko = renderConsultationAcknowledgement({ locale: 'ko', intakeId: 'HC-1' });
    expect(ko.text).toContain('대표 전화(타이중 사무소)');
    const en = renderConsultationAcknowledgement({ locale: 'en', intakeId: 'HC-1' });
    expect(en.text).toContain('Main phone (Taichung office)');
  });

  it('stays transactional: no advertisement prefix, no promises, no promotion', () => {
    for (const locale of LOCALES) {
      const { subject, text, html } = renderConsultationAcknowledgement({
        locale,
        intakeId: 'HC-1',
        categoryLabel: 'X',
        languageLabel: 'Y',
      });
      expect(subject.startsWith('(광고)'), locale).toBe(false);
      expect(subject, locale).not.toContain('廣告');
      for (const pattern of FORBIDDEN) {
        expect(text, `${locale} text / ${pattern}`).not.toMatch(pattern);
        expect(html, `${locale} html / ${pattern}`).not.toMatch(pattern);
      }
    }
  });

  it('includes optional rows only when provided', () => {
    const bare = renderConsultationAcknowledgement({ locale: 'ko', intakeId: 'HC-1' });
    expect(bare.text).not.toContain('문의 유형');
    expect(bare.text).not.toContain('상담 언어');

    const full = renderConsultationAcknowledgement({
      locale: 'ko',
      intakeId: 'HC-1',
      categoryLabel: '회사설립',
      languageLabel: '한국어',
    });
    expect(full.text).toContain('문의 유형: 회사설립');
    expect(full.text).toContain('상담 언어: 한국어');
  });

  it('escapes HTML in interpolated values', () => {
    const out = renderConsultationAcknowledgement({
      locale: 'en',
      intakeId: 'HC-1',
      categoryLabel: '<script>alert(1)</script>',
    });
    expect(out.html).not.toContain('<script>alert(1)</script>');
    expect(out.html).toContain('&lt;script&gt;');
  });
});
