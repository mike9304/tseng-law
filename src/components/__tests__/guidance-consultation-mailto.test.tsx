import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import GuidancePageBody, { GuidanceContactBand } from '@/components/GuidancePageBody';
import InternationalInquiryForm from '@/components/InternationalInquiryForm';
import Footer from '@/components/Footer';
import ViPageBody from '@/components/vi-design/ViPageBody';
import ViHomeBody from '@/components/vi-design/ViHomeBody';
import GuidanceHomeBody from '@/components/GuidanceHomeBody';
import { GUIDANCE_LOCALES_4, GUIDANCE_PAGE_KEYS } from '@/lib/public-guidance';
import { GUIDANCE_CONSULTATION_EMAIL_TEMPLATES } from '@/lib/consultation/guidance-contact-templates';
import { getLocalizedConsultationMailto } from '@/lib/consultation/localized-mailto';

vi.mock('@/lib/static-site', () => ({ IS_STATIC_SITE: true }));

const examples = [
  ['vi', '[tseng-law.com Tư vấn] Vấn đề pháp lý tại Đài Loan', 'Xin chào'],
  ['ar', '[tseng-law.com استشارة] مسألة قانونية في تايوان', 'مرحبًا'],
  ['de', '[tseng-law.com Beratung] Rechtsangelegenheit in Taiwan', 'Hallo'],
  ['zh-hans', '[tseng-law.com 法律咨询] 台湾法律事务', '你好'],
] as const;

function consultationLinks(html: string): URL[] {
  return [...html.matchAll(/href="(mailto:wei@hoveringlaw\.com\.tw[^"]*)"/g)]
    .map((match) => new URL(match[1].replace(/&amp;/g, '&').replace(/&#x27;/g, "'")));
}

describe('localized guidance consultation links', () => {
  it.each(examples)('%s contact, home band, email CTA and footer open a native draft', (locale, subject, greeting) => {
    const surfaces = [
      <GuidancePageBody key="contact" locale={locale} pageKey="contact" />,
      <GuidanceContactBand key="home" locale={locale} isContact={false} />,
      <GuidanceHomeBody key="home-page" locale={locale} columns={{ sourceLocale: 'en', isOriginalLanguage: true, posts: [] }} />,
      <InternationalInquiryForm key="inquiry" locale={locale} />,
      <Footer key="footer" locale={locale} />,
      <GuidancePageBody key="team" locale={locale} pageKey="lawyers" />,
    ];
    for (const surface of surfaces) {
      const links = consultationLinks(renderToStaticMarkup(surface));
      expect(links.length, String(surface.key)).toBeGreaterThan(0);
      for (const link of links) {
        expect(link.searchParams.get('subject'), String(surface.key)).toBe(subject);
        expect(link.searchParams.get('body')?.split('\n')[0]).toBe(greeting);
        expect(link.searchParams.get('body')?.split('\n')).toHaveLength(11);
        expect(link.searchParams.get('body')).toBe(GUIDANCE_CONSULTATION_EMAIL_TEMPLATES[locale].body);
        expect(link.href).toBe(getLocalizedConsultationMailto(locale));
      }
    }
  });

  it('uses the Vietnamese draft on the dedicated home, contact, team and legal pages', () => {
    const surfaces = [
      <ViHomeBody key="home" posts={[]} />,
      ...(['contact', 'lawyers', 'privacy', 'disclaimer'] as const)
        .map((pageKey) => <ViPageBody key={pageKey} pageKey={pageKey} />),
    ];
    for (const surface of surfaces) {
      const links = consultationLinks(renderToStaticMarkup(surface));
      expect(links.length, String(surface.key)).toBeGreaterThan(0);
      for (const link of links) {
        expect(link.searchParams.get('subject')).toBe(examples[0][1]);
        expect(link.searchParams.get('body')?.split('\n')[0]).toBe('Xin chào');
        expect(link.href).toBe(getLocalizedConsultationMailto('vi'));
      }
    }
  });

  it.each(GUIDANCE_LOCALES_4)('%s uses the same draft on every guidance page and its footer', (locale) => {
    const surfaces = [
      ...GUIDANCE_PAGE_KEYS.map((pageKey) => <GuidancePageBody key={pageKey} locale={locale} pageKey={pageKey} />),
      <Footer key="footer" locale={locale} />,
    ];
    for (const surface of surfaces) {
      const links = consultationLinks(renderToStaticMarkup(surface));
      expect(links.length, String(surface.key)).toBeGreaterThan(0);
      for (const link of links) expect(link.href, String(surface.key)).toBe(getLocalizedConsultationMailto(locale));
    }
  });
});
