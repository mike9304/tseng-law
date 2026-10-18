import { describe, expect, it } from 'vitest';
import type { Locale } from '@/lib/locales';
import { CONSULTATION_EMAIL } from '@/lib/consultation/public-contact';
import { createPricingPageDecomposedNodes } from '../decompose-page-pricing';
import { createAttorneyProfileSectionNodes } from '../decompose-page-shared';

const expectedTemplateCopy: Record<Locale, { subject: string; body: string }> = {
  ko: {
    subject: '[tseng-law.com 상담문의] 대만 법률 및 기업 업무 상담',
    body: '안녕하세요\n\n이름:\n\n',
  },
  'zh-hant': {
    subject: '【tseng-law.com 法律諮詢】台灣法律及企業服務諮詢',
    body: '您好\n\n姓名：\n\n',
  },
  en: {
    subject: '[tseng-law.com Consultation] Taiwan Legal and Corporate Services',
    body: 'Hello,\n\nName:\n\n',
  },
};

function expectLocalizedConsultationMailto(href: string, locale: Locale): void {
  const parsed = new URL(href);

  expect(parsed.protocol).toBe('mailto:');
  expect(parsed.pathname).toBe(CONSULTATION_EMAIL);
  expect(parsed.searchParams.get('subject')).toBe(expectedTemplateCopy[locale].subject);
  expect(parsed.searchParams.get('body')?.startsWith(expectedTemplateCopy[locale].body)).toBe(true);
  expect(href).toContain(encodeURIComponent(expectedTemplateCopy[locale].subject));
  expect(href).toContain(encodeURIComponent(expectedTemplateCopy[locale].body));
  expect(href).not.toMatch(/\/contact|010-2992-9304|kakao|line\.me/i);
}

describe('decomposed consultation CTAs', () => {
  it.each(Object.keys(expectedTemplateCopy) as Locale[])(
    'routes the %s pricing CTA to Attorney Tseng email',
    (locale) => {
      const nodes = createPricingPageDecomposedNodes(0, locale, 0);
      const cta = nodes
        .find((node) => node.id === 'page-pricing-cta');

      expect(cta?.kind).toBe('button');
      if (cta?.kind !== 'button') return;
      expectLocalizedConsultationMailto(cta.content.href, locale);
      expect(JSON.stringify(nodes)).not.toMatch(/010-2992-9304|kakao(?:talk)?|line\.me|카카오톡|라인/i);
    },
  );

  it.each(Object.keys(expectedTemplateCopy) as Locale[])(
    'routes every %s lawyer-card consultation CTA to Attorney Tseng email',
    (locale) => {
      const nodes = createAttorneyProfileSectionNodes('attorney-grid', 0, locale, 0).nodes;
      const buttons = nodes
        .filter((node) => node.kind === 'button' && node.id.endsWith('-consult-button'));

      expect(buttons.length).toBeGreaterThan(0);
      for (const button of buttons) {
        expect(button.kind).toBe('button');
        if (button.kind !== 'button') continue;
        expectLocalizedConsultationMailto(button.content.href, locale);
      }
      expect(JSON.stringify(nodes)).not.toMatch(/010-2992-9304|kakao(?:talk)?|line\.me|카카오톡|라인/i);
    },
  );
});
