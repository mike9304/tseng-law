import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  CONSULTATION_EMAIL,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import type { SiteLocale } from '@/lib/locales';
import { landingContent } from '@/app/[locale]/korean-lawyer-in-taiwan/content';

const root = process.cwd();
const pagePaths = [
  'src/app/[locale]/services/[slug]/page.tsx',
  'src/app/[locale]/columns/[slug]/page.tsx',
  'src/app/[locale]/lawyers/[slug]/page.tsx',
  'src/app/[locale]/korean-lawyer-in-taiwan/page.tsx',
  'src/app/[locale]/guides/taiwan-company-setup/page.tsx',
  'src/app/[locale]/not-found.tsx',
] as const;

describe('residual public consultation CTAs', () => {
  it('uses the exact verified public email in every localized mailto template', () => {
    expect(CONSULTATION_EMAIL).toBe('wei@hoveringlaw.com.tw');

    for (const locale of ['ko', 'zh-hant', 'en', 'ja'] as const satisfies readonly SiteLocale[]) {
      expect(getConsultationPublicMailto(locale)).toMatch(
        /^mailto:wei@hoveringlaw\.com\.tw\?subject=.+&body=.+$/,
      );
    }
  });

  it.each(pagePaths)('%s sends its consultation CTA to the localized public mailto', (pagePath) => {
    const source = readFileSync(path.join(root, pagePath), 'utf8');

    expect(source).toContain('CONSULTATION_EMAIL');
    expect(source).toContain('getConsultationPublicMailto');
    expect(source).toContain('href={getConsultationPublicMailto(locale)}');
    expect(source).toContain('aria-label=');
    expect(source).not.toContain('tel:');
    expect(source).not.toMatch(/kakaotalk|kakao|line\.me/i);
  });

  it('keeps the English Korean-lawyer landing consultation surface email-only', () => {
    const content = landingContent.en;
    const consultationFaq = content.faq.find(
      (item) => item.q === 'How do I request a consultation?',
    );
    const consultationSurface = JSON.stringify({
      office: content.office,
      consultationFaq,
      ctaTitle: content.ctaTitle,
      ctaText: content.ctaText,
      ctaButton: content.ctaButton,
    });

    expect(consultationSurface).toContain('wei@hoveringlaw.com.tw');
    expect([...new Set(consultationSurface.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi))]).toEqual([
      'wei@hoveringlaw.com.tw',
    ]);
    expect(consultationFaq?.a).toContain('email at wei@hoveringlaw.com.tw');
    expect(consultationSurface).not.toContain('010-2992-9304');
    expect(consultationSurface).not.toMatch(/\b(?:phone|call)\b/i);
  });
});
