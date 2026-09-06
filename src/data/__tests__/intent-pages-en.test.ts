import { describe, expect, it } from 'vitest';

import { getIntentPage, intentPageSlugs } from '@/data/intent-pages';

describe('English intent pages audience', () => {
  it('retargets the general page to overseas clients and English consultation', () => {
    const page = getIntentPage('en', 'taiwan-lawyer');

    expect(page?.title).toBe('Taiwan Lawyer for Litigation, Company Setup & Business Advice');
    expect(page?.description).toMatch(/overseas companies and individuals/i);
    expect(page?.description).toMatch(/consultations in English/i);
    expect(page?.keywords).toContain('Taiwan lawyer for overseas clients');
    expect(page?.keywords).not.toContain('Taiwan lawyer for Korean clients');
    expect(page?.searchTerms).not.toContain('Taiwan lawyer for Korean clients');
    expect(page?.heroPoints[0]).toMatch(/overseas and international clients/i);
  });

  it('scopes company setup to overseas businesses, entity work, and operating contracts', () => {
    const page = getIntentPage('en', 'taiwan-company-setup-lawyer');

    expect(page?.title).toBe('Taiwan Company Setup Lawyer for Overseas Businesses');
    expect(page?.description).toMatch(/entity choice, investment approval, registration, and operating contracts/i);
    expect(page?.heroPoints[0]).toMatch(/operating contracts/i);
    expect(JSON.stringify(page)).not.toMatch(/Korean parent|Korean client/i);
  });

  it('leads litigation with contract disputes and unpaid invoices while keeping other paths', () => {
    const page = getIntentPage('en', 'taiwan-litigation-lawyer');

    expect(page?.title).toBe('Taiwan Litigation Lawyer for Contract Disputes & Civil Claims');
    expect(page?.description).toMatch(/contract disputes/i);
    expect(page?.description).toMatch(/unpaid invoices/i);
    expect(page?.heroPoints[0]).toMatch(/contract disputes/i);
    expect(page?.heroPoints[0]).toMatch(/unpaid invoices/i);
    expect(page?.serviceSlugs).toEqual(['civil', 'criminal', 'family']);
    expect(page?.faq.some((item) => /criminal/i.test(`${item.question} ${item.answer}`))).toBe(true);
    expect(page?.faq[0]?.question).toMatch(/overseas/i);
    expect(page?.faq[0]?.question).not.toMatch(/Korea/i);
  });

  it.each(intentPageSlugs)('separates a brief first email from later documents on %s', (slug) => {
    const page = getIntentPage('en', slug);

    expect(page?.prepareChecklist[0]).toMatch(/Brief initial summary/i);
    expect(page?.prepareChecklist.slice(1).join(' ')).toMatch(/Organize for later/i);
    expect(page?.prepareChecklist[0]).not.toMatch(/passport|medical records|bank account/i);
  });

  it.each(intentPageSlugs)('does not claim U.S. or Japan qualifications, wins, or free advice on %s', (slug) => {
    const serialized = JSON.stringify(getIntentPage('en', slug));

    expect(serialized).not.toMatch(
      /U\.S\. licen[sc]e|US attorney|Japanese attorney license|guaranteed win|free advice|dominant/i,
    );
  });

  it('keeps Korean and Traditional Chinese titles unchanged', () => {
    expect(getIntentPage('ko', 'taiwan-lawyer')?.title).toBe(
      '대만변호사 | 한국어 상담·소송·법인설립 지원',
    );
    expect(getIntentPage('ko', 'taiwan-company-setup-lawyer')?.title).toBe(
      '대만 법인설립·회사설립 변호사 | 절차·비용·기간',
    );
    expect(getIntentPage('ko', 'taiwan-litigation-lawyer')?.title).toBe(
      '대만 소송 변호사 | 민사·형사·노동 한국어 대응',
    );
    expect(getIntentPage('zh-hant', 'taiwan-lawyer')?.title).toBe('台灣律師指南');
    expect(getIntentPage('zh-hant', 'taiwan-company-setup-lawyer')?.title).toBe(
      '台灣公司設立律師指南',
    );
    expect(getIntentPage('zh-hant', 'taiwan-litigation-lawyer')?.title).toBe(
      '台灣訴訟律師指南',
    );
  });
});
