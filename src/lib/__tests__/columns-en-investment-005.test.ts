import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-en/005-taiwan-company-establishment-advanced-2.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost(
  'taiwan-company-establishment-advanced-2',
  'en',
);

const title =
  'Taiwan Company Formation: Capital Remittance, Banking, and Foreign Hiring';
const headings = [
  "1. What should I check before remitting capital from Korea to a Taiwan company's preparatory account?",
  "2. Can I pay New Taiwan dollars I hold in Taiwan into the company's preparatory account?",
  '3. When can the company preparatory account be converted into a formal company account?',
  '4. Can I use online banking right after converting to a formal account?',
  '5. What work-permit requirements apply when a Taiwan company hires a Korean national?',
  'Official Sources',
  'Related Services',
];
const officialUrls = [
  'https://www.bok.or.kr/eng/main/contents.do?menuNo=400191',
  'https://www.bok.or.kr/eng/main/contents.do?menuNo=400189',
  'https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus01?lang=eng&menuNum=7&search=InvestmentStatus01',
  'https://investtaiwan.nat.gov.tw/faqQContent?lang=eng&search=94',
  'https://investtaiwan.nat.gov.tw/eBook/BravoTaiwan/2024ebook_en/files/basic-html/page55.html',
  'https://ezworktaiwan.wda.gov.tw/cp.aspx?n=A88DC323EF7C85FF',
];
const internalTargets = [
  '/en/columns/taiwan-company-establishment-basics',
  '/en/columns/taiwan-company-establishment-advanced-1',
  '/en/services#investment',
  '/en/columns/taiwan-company-establishment-advanced-1',
  '/en/contact',
];

function firstParagraphAfter(content: string, heading: string) {
  return content.split(`## ${heading}\n\n`)[1]?.split('\n\n')[0];
}

function section(content: string, start: string, end: string) {
  return content.split(`## ${start}\n\n`)[1]?.split(`\n\n## ${end}`)[0] ?? '';
}

function paragraphCount(content: string) {
  return content
    .split(/\n\n+/)
    .filter((block) => block.trim() && !block.trim().startsWith('- ')).length;
}

function countVisibleEnglishWords(content: string) {
  const visibleText = content
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^---$/gm, '')
    .replace(/[“”‘’*_`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    visibleText.match(/[A-Za-z0-9]+(?:[.’'-][A-Za-z0-9]+)*/g)?.length ?? 0
  );
}

describe('English investment column 005 — corrected capital, banking, and hiring guidance', () => {
  it('publishes the corrected metadata and exactly five FAQs', () => {
    expect(parsed.data).toMatchObject({
      title,
      url: 'https://www.wei-wei-lawyer.com/post/taiwan-company-establishment-advanced-2',
      lastmod: '2026-07-27',
      date_display: 'September 13, 2025',
      read_time: '13 min read',
      categories: ['Taiwan Company Formation'],
      featured_image:
        '../images/005-taiwan-company-establishment-advanced-2/featured-01.jpg',
    });
    expect(parsed.data.faq).toHaveLength(5);
    expect(post).toMatchObject({
      slug: 'taiwan-company-establishment-advanced-2',
      title,
      date: '2026-07-27',
      dateDisplay: 'September 13, 2025',
      readTime: '13 min read',
      categoryLabel: 'Company Setup',
      faq: parsed.data.faq,
    });
  });

  it('uses one H1 and the seven contracted H2 sections in order', () => {
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(headings);
  });

  it('repeats every exact FAQ answer as its matching section first paragraph', () => {
    for (const [index, faq] of parsed.data.faq.entries()) {
      expect(faq.q).toBe(headings[index].replace(/^\d+\. /, ''));
      expect(firstParagraphAfter(parsed.content, headings[index])).toBe(faq.a);
      expect(firstParagraphAfter(post?.content ?? '', headings[index])).toBe(
        faq.a,
      );
      expect(raw.split(faq.a)).toHaveLength(3);
    }
  });

  it('preserves the complete corrected section shape', () => {
    const expectedParagraphs = [5, 5, 4, 4, 10];
    for (let index = 0; index < 5; index += 1) {
      expect(
        paragraphCount(
          section(parsed.content, headings[index], headings[index + 1]),
        ),
      ).toBe(expectedParagraphs[index]);
    }
    expect(
      parsed.content.match(
        /^- (?:Paid-in capital|Revenue|Import\/export performance|Agency commissions)/gm,
      ),
    ).toHaveLength(4);
  });

  it('qualifies Korea-side reporting and remittance procedures', () => {
    const required = [
      'may require an overseas direct investment report or similar procedure',
      'the designated foreign exchange bank',
      'It is not possible to state categorically, for all banks, whether an in-person visit, a proxy application, or an online procedure is available.',
      'as a rule the applicable report, confirmation, or other procedure must be completed before the remittance',
      'Document review, correction, or confirmation by the designated bank may be required first',
      'corrective, administrative, or other measures may apply depending on the circumstances and the applicable law',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('qualifies Taiwan-dollar payments and source-of-funds evidence', () => {
    const required = [
      'The payment must be consistent with the approved investment amount, the contribution method, the investor and remitter',
      'Pay statements, withholding documents, dividend resolutions and payment records, contracts, invoices, tax records, or account statements',
      'Source-of-funds documentation may still be required for a remittance from abroad.',
      "A bank's customer due diligence, anti-money-laundering controls, verification of the transaction's purpose, and the investment review",
      'report receipt of the invested funds and then proceed to verification of the total invested amount',
      'this reporting and verification procedure can ultimately be completed',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('keeps account conversion and electronic banking bank-specific', () => {
    const required = [
      'the preparatory account does not automatically become a formal account the moment registration is completed',
      "identity documents for the company's responsible person (representative) and beneficial owners",
      'whether submission by an agent is accepted',
      'do not necessarily fall on the same day',
      'Converting to a formal company account and starting to use online and mobile banking are not necessarily the same procedure.',
      'separate the person who enters transactions from the person who approves them',
      'cannot be described as a condition common to all banks',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('states the managerial work-permit category and employer thresholds without the stale first-hire rule', () => {
    const required = [
      'the substance of the duties, the organizational authority, the ownership relationship, and the employment contract must match the category applied for',
      'manager (經理人) under Taiwan law',
      'more than one third of the total shares or total capital',
      'Not every foreign employee is therefore eligible to be sponsored under this category.',
      'what is relaxed for the first foreign national the employer hires is only the education, work-experience, and average-salary standards',
      'Paid-in capital or working capital in Taiwan of at least TWD 500,000',
      'Revenue of at least TWD 3,000,000',
      'Import/export performance of at least USD 500,000',
      'Agency commissions of at least USD 200,000',
      'the most recent year or the average of the preceding three years',
      'Representative offices and specially recognized cases are subject to separate standards.',
      'use the work-permit category that corresponds to the actual position',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses exactly the corrected images, official sources, and safe English links', () => {
    const imagePaths = Array.from(
      raw.matchAll(/(?:featured_image: "|!\[[^\]]*\]\()([^"\n)]+\.jpg)/g),
      (match) => match[1],
    );
    expect([...new Set(imagePaths)]).toEqual([
      '../images/005-taiwan-company-establishment-advanced-2/featured-01.jpg',
      '../images/005-taiwan-company-establishment-advanced-2/img-01.jpg',
    ]);

    const externalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((https?:\/\/[^)]+)\)/g),
      (match) => match[1],
    );
    const internalLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[1],
    );
    expect(externalTargets).toEqual(officialUrls);
    expect(internalLinks).toEqual(internalTargets);
  });

  it('removes the stale absolute claims and all locale leakage', () => {
    const forbidden = [
      'Internet banking or remittance by a relative or acquaintance in Korea as a proxy is not allowed.',
      'If you remit from a Korean bank account, you do not need to attach source-of-funds documents.',
      'generally at least a mobile phone number is required',
      'at least six months after establishment',
      'No restriction for the first employee',
      'Restrictions from the second employee onward',
      'first hire is unrestricted',
      'first employee is unrestricted',
      '曾俊瑋',
      '/ko/',
      '/ja/',
      '/zh-hant/',
    ];
    for (const phrase of forbidden) {
      expect(raw).not.toContain(phrase);
    }

    const withoutAllowedHan = raw.replace(/曾雋崴|經理人/g, '');
    expect(withoutAllowedHan).not.toMatch(
      /[\p{Script=Han}\p{Script=Hangul}\p{Script=Hiragana}\p{Script=Katakana}]/u,
    );
    expect(raw).not.toMatch(/[\uFEFF\u00A0\u200B]/u);
    expect(raw).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it('keeps read time aligned and resolves the canonical alias', () => {
    const visibleWordCount = countVisibleEnglishWords(parsed.content);
    const calculatedMinutes = Math.ceil(visibleWordCount / 200);

    expect(visibleWordCount).toBe(2_598);
    expect(calculatedMinutes).toBe(13);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes} min read`);
    expect(post?.readTime).toBe(`${calculatedMinutes} min read`);
    expect(getColumnPost('company-advanced-2', 'en')?.slug).toBe(
      'taiwan-company-establishment-advanced-2',
    );
  });
});
