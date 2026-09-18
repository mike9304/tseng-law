import { describe, expect, it } from 'vitest';

import { faqContent } from '@/data/faq-content';
import { isEnglishNoindexPath } from '@/lib/seo-visibility';
import { getLanguageAlternates } from '@/lib/seo';

describe('/en/faq noindex policy (docs/marketing/EN-FAQ-NOINDEX-POLICY-2026-09.md)', () => {
  it('keeps English FAQ classified as noindex and omitted from hreflang', () => {
    expect(isEnglishNoindexPath('/faq')).toBe(true);
    expect(getLanguageAlternates('/faq')).not.toHaveProperty('en');
    expect(getLanguageAlternates('/faq')['x-default']).toBe('https://tseng-law.com/ko/faq');
  });

  it('keeps English FAQ copy international without lifting the index gate', () => {
    const consultation = faqContent.en.find(
      (item) => item.question === 'How are consultations conducted?',
    );
    const divorce = faqContent.en.find((item) => item.question.includes('divorce'));

    expect(consultation?.answer).toContain(
      'Consultations are available in English, Chinese, Korean, and Japanese.',
    );
    expect(divorce).toBeDefined();
    expect(JSON.stringify(faqContent.en)).not.toMatch(/Korean Clients/i);
  });
});
