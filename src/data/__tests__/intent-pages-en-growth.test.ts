import { describe, expect, it } from 'vitest';
import { getIntentPage, intentPageSlugs, intentPages } from '../intent-pages';

const KOREAN_LITIGATION_COLUMNS = [
  'taiwan-gym-injury-lawsuit',
  'taiwan-traffic-accident-procedure',
  'taiwan-divorce-lawsuit-qna',
  'taiwan-inheritance-custody-analysis',
] as const;

describe('EN intent pages growth copy', () => {
  it('preserves other locales and Korean case column links', () => {
    expect(intentPages.ko['taiwan-lawyer'].title).toBe(
      '대만변호사 | 한국어 상담·소송·법인설립 지원',
    );
    expect(intentPages['zh-hant']['taiwan-lawyer'].title).toBe('台灣律師指南');
    expect(intentPages.ja['taiwan-lawyer'].title).toBe(
      '台湾弁護士｜日本語で相談できる台北の法律事務所',
    );
    expect(intentPages.ko['taiwan-lawyer'].heroPoints[0]).toContain('한국 고객');
    expect(intentPages.ko['taiwan-litigation-lawyer'].columnSlugs).toEqual([
      ...KOREAN_LITIGATION_COLUMNS,
    ]);
    expect(intentPages.en['taiwan-litigation-lawyer'].columnSlugs).toEqual([
      ...KOREAN_LITIGATION_COLUMNS,
    ]);
    expect(intentPages.en['taiwan-company-setup-lawyer'].columnSlugs).toEqual(
      intentPages.ko['taiwan-company-setup-lawyer'].columnSlugs,
    );
  });

  it('states confirmed English availability and assistance without prohibited claims', () => {
    const blob = JSON.stringify({
      lawyer: intentPages.en['taiwan-lawyer'],
      setup: intentPages.en['taiwan-company-setup-lawyer'],
      litigation: intentPages.en['taiwan-litigation-lawyer'],
    });

    expect(blob).toMatch(/English-speaking attorneys/i);
    expect(blob).toMatch(/residence-permit assistance/i);
    expect(blob).toMatch(/tax-accounting assistance/i);
    expect(blob).not.toMatch(/tax-accounting coordination/i);
    expect(blob).not.toMatch(/substitute for a licensed/i);
    expect(blob).not.toMatch(/filing in the firm/i);
    expect(blob).not.toMatch(/CPA license|certified public accountant/i);
    expect(blob).not.toMatch(/US law|U\.S\. law|American bar|licensed in the United States/i);
    expect(blob).not.toMatch(/citizenship is not required|do not send citizenship/i);
    expect(blob).not.toMatch(/we do not quote a timeline/i);
    expect(intentPages.en['taiwan-lawyer'].serviceSlugs).toEqual([
      'investment',
      'civil',
      'family',
    ]);
    const faqText = [
      ...intentPages.en['taiwan-lawyer'].faq,
      ...intentPages.en['taiwan-company-setup-lawyer'].faq,
      ...intentPages.en['taiwan-litigation-lawyer'].faq,
    ]
      .map((item) => item.answer)
      .join('\n');
    expect(faqText).not.toMatch(/https:\/\//);
  });

  it('keeps already published EN fee figures unchanged when still stated', () => {
    const lawyerFaq = intentPages.en['taiwan-lawyer'].faq.map((item) => item.answer).join('\n');
    const litigationFaq = intentPages.en['taiwan-litigation-lawyer'].faq
      .map((item) => item.answer)
      .join('\n');

    expect(lawyerFaq).toContain('NT$3,000 per hour');
    expect(lawyerFaq).toContain('NT$50,000');
    expect(litigationFaq).toContain('NT$3,000 per hour');
  });

  it('frames company setup for overseas parents and treats official pages as references', () => {
    const page = getIntentPage('en', 'taiwan-company-setup-lawyer');
    expect(page).toBeDefined();
    const blob = [
      page!.description,
      ...page!.heroPoints,
      ...page!.idealFor,
      ...page!.faq.map((item) => `${item.question}\n${item.answer}`),
    ].join('\n');

    expect(blob).toMatch(/overseas/i);
    expect(blob).not.toMatch(/only Korean|Korean headquarters only/i);
    expect(blob).toMatch(/reference/i);
    expect(blob).not.toMatch(/https:\/\//);
    expect(page!.serviceSlugs).toEqual(['investment', 'ip', 'labor']);
  });

  it('exposes the existing EN intent slugs without inventing routes', () => {
    expect([...intentPageSlugs]).toEqual([
      'taiwan-lawyer',
      'taiwan-company-setup-lawyer',
      'taiwan-litigation-lawyer',
    ]);
    for (const slug of intentPageSlugs) {
      expect(getIntentPage('en', slug)?.slug).toBe(slug);
    }
  });
});
