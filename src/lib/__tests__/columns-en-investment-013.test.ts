import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-en/013-taiwan-company-establishment-advanced-1.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost(
  'taiwan-company-establishment-advanced-1',
  'en',
);

const title =
  'Taiwan Company Formation: Practical Q&A on Addresses, Bank Accounts, and Investment Review';
const faq = [
  {
    q: 'How should I prepare if the registered address has not yet been finalized?',
    a: "A foreign investment application and company registration require different location information and documents. At the application stage, confirm the current forms and review guidance. By the time of company registration, prepare the lease agreement, building records, the owner's consent, and any other required documents. Also confirm in advance whether the planned business activities may be conducted at the proposed site under land-use zoning, building-management, and industry-specific rules.",
  },
  {
    q: 'Can I ask a bank about opening a company account without a Taiwan residence certificate?',
    a: 'Identity-verification and account-opening requirements differ from bank to bank. Before applying, ask the selected bank whether it will accept a passport, documents relating to a Taiwan unified ID number, or other substitutes when you do not have a residence certificate, and confirm every document it requires. The procedures may also differ between a company preparatory account and a formal company account.',
  },
  {
    q: 'Can I apply if my education and work experience are in a different field from the proposed business?',
    a: 'State your education and work history truthfully, and explain specifically how they relate to your proposed duties, business plan, available capital and resources, relevant expertise, and ability to carry out the business. A different field of education or experience does not by itself determine the outcome, but you must not state false or exaggerated experience. Whether additional documents or explanations are needed depends on the individual case.',
  },
  {
    q: 'What should I consider when signing a lease before company formation and a work-permit application?',
    a: "There is no single standard timeline covering company formation, banking, a work permit, and residence. The lease start date, fit-out period, rent-free arrangements, guarantees, any additional security deposit, and notarization are negotiable terms that depend on the premises, the parties' agreement, and the individual circumstances. Confirm the required permits and the legal suitability of the business location, and decide before signing how delay-related costs and other burdens will be allocated.",
  },
  {
    q: 'Can an ordinary office be used as the business premises for a restaurant or similar business?',
    a: "Whether the premises may be used depends on the business items, land-use zoning, the building's approved use, the lease terms, and industry-specific permits. An ordinary office classification alone does not establish that a restaurant or similar business may operate there. Taipei City operates a business-location prior inquiry (營業場所預先查詢) for covered company or business registration cases, so confirm before signing whether the proposed location and business items comply with the applicable rules. A bank's identity verification and account review are separate procedures.",
  },
];
const headings = [
  ...faq.map(({ q }, index) => `${index + 1}. ${q}`),
  'Before You Proceed',
  'Official Sources',
  'Related Services',
];
const officialUrls = [
  'https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=J0040002',
  'https://investtaiwan.nat.gov.tw/showPage?lang=eng&search=55',
  'https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus01?lang=eng&menuNum=7&search=InvestmentStatus01',
  'https://gcis.nat.gov.tw/mainNew/English/subclassEnAction.do?method=getFile&pk=11',
  'https://ezworktaiwan.wda.gov.tw/en/News_Content.aspx?n=35C4C6202979ECD0&s=8E117BF2FD606799&sms=2D58889BB41F75D7',
];
const internalTargets = [
  '/en/columns/taiwan-company-establishment-basics',
  '/en/services#investment',
  '/en/columns/taiwan-company-establishment-basics',
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

describe('English investment column 013 — company-setup practice Q&A', () => {
  it('publishes the corrected metadata and exactly five exact FAQs', () => {
    expect(parsed.data).toMatchObject({
      title,
      url: 'https://www.wei-wei-lawyer.com/post/taiwan-company-establishment-advanced-1',
      lastmod: '2026-07-27',
      date_display: 'September 13, 2025',
      read_time: '10 min read',
      categories: ['Taiwan Company Formation'],
      featured_image:
        '../images/013-taiwan-company-establishment-advanced-1/featured-01.jpg',
      faq,
    });
    expect(parsed.data.faq).toHaveLength(5);
    expect(post).toMatchObject({
      slug: 'taiwan-company-establishment-advanced-1',
      title,
      date: '2026-07-27',
      dateDisplay: 'September 13, 2025',
      readTime: '10 min read',
      categoryLabel: 'Company Setup',
      faq,
    });
  });

  it('uses one H1 and the eight contracted H2 sections in order', () => {
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(headings);
  });

  it('repeats every exact FAQ answer as its matching section first paragraph', () => {
    for (const [index, item] of faq.entries()) {
      expect(firstParagraphAfter(parsed.content, headings[index])).toBe(item.a);
      expect(firstParagraphAfter(post?.content ?? '', headings[index])).toBe(
        item.a,
      );
      expect(raw.split(item.a)).toHaveLength(3);
    }
  });

  it('preserves the complete corrected section shape', () => {
    const expectedParagraphs = [5, 4, 4, 5, 4];
    for (let index = 0; index < 5; index += 1) {
      expect(
        paragraphCount(
          section(parsed.content, headings[index], headings[index + 1]),
        ),
      ).toBe(expectedParagraphs[index]);
    }
    expect(
      parsed.content.match(
        /^- (?:The contract start date|Whether rent|Guarantors|Whether the contract|Whether the location|The allocation|Conditions for signage)/gm,
      ),
    ).toHaveLength(7);
  });

  it('states the current agency and qualified Article 9 sequence', () => {
    const article9Paragraph =
      'Article 9 of the Statute for Investment by Foreign Nationals requires the approved investment amount to be remitted in full within the prescribed period, the remittance to be reported to the competent authority for review, and the total investment amount to be submitted for verification after the investment is implemented. Check the individual approval and current guidance for the applicable deadline, remittance method, reporting documents, and materials required for verification.';
    const required = [
      'Department of Investment Review, MOEA (經濟部投資審議司)',
      'investment plan, information about the applicant, the source and use of funds, the proposed business activities, the method of investment, and the submitted documents',
      'Not every case requires the same materials',
      'foreign investment application and company registration deal with location information at different stages',
      article9Paragraph,
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }

    const sequence = [
      'remitted in full',
      'reported to the competent authority for review',
      'submitted for verification',
      'after the investment is implemented',
    ];
    const positions = sequence.map((step) => article9Paragraph.indexOf(step));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('qualifies bank documents, truthful experience, and work-permit review', () => {
    const required = [
      'documents relating to a Taiwan unified ID number',
      'No single checklist applies to every bank',
      'This does not mean every bank accepts these materials',
      'company preparatory account used before registration',
      'formal company account used after registration',
      'State your education and work history truthfully',
      'must not state false or exaggerated experience',
      'ability to carry out the proposed business',
      'foreign investment application and the work permit',
      "does not satisfy the work-permit requirements for the position, the applicant's qualifications, the employer, or the supporting documents",
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('limits the WDA target and keeps lease terms case-specific', () => {
    const required = [
      'complete professional work-permit application',
      'seven working days when filed online and twelve working days when filed on paper',
      'apply only to the work-permit application, not to company formation, banking, or a residence application',
      'exclude time needed for additional documents or corrections and procedures at other agencies',
      'There is no single standard timeline',
      'fit-out period, rent-free arrangements, guarantees, any additional security deposit, and notarization',
      'negotiable terms that depend on the premises',
      'conditions precedent and termination rights',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('separates location-law checks, Taipei inquiry, and bank review', () => {
    const required = [
      "land-use zoning, the building's approved use, the lessor's authority and the lease terms, company or business registration, and industry-specific permits",
      "Taipei City's business-location prior inquiry",
      'a system with the same name and procedures applies throughout Taiwan',
      'identity verification, account-opening document review, and transaction-purpose confirmation performed by a bank',
      'land-use, building, company or business registration, and industry-permit reviews performed by administrative agencies',
      "confirming the location's suitability does not mean a bank account will automatically be opened",
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses only the contracted images, official sources, and English links', () => {
    const imagePaths = Array.from(
      raw.matchAll(/(?:featured_image: "|!\[[^\]]*\]\()([^"\n)]+\.jpg)/g),
      (match) => match[1],
    );
    expect([...new Set(imagePaths)]).toEqual([
      '../images/013-taiwan-company-establishment-advanced-1/featured-01.jpg',
      '../images/013-taiwan-company-establishment-advanced-1/img-01.jpg',
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

  it('removes stale claims, translation residue, and wrong-locale content', () => {
    const forbidden = [
      'Investment Commission',
      'Investment Review Commission',
      'overseas parties',
      'within one year after investment approval',
      'takes about 3 months',
      'takes about 1 month',
      'absconding',
      'a great many money-laundering cases',
      'not extremely strict',
      'persuade the reviewers',
      'reluctant to lease to foreigners',
      'usually 2 months',
      'conduct an on-site inspection',
      'issued on the same day',
      'very crowded',
      'leave a comment',
      'route of the funds',
      'execution structure',
      'consultation based on',
      'character of the funds',
      'employer-side requirements',
      'schedule that allows for corrections',
      'acceptance of funds',
      'uniformly',
      '曾俊瑋',
      '/ko/',
      '/ja/',
      '/zh-hant/',
    ];
    for (const phrase of forbidden) {
      expect(raw).not.toContain(phrase);
    }
    expect(raw).toContain('Wei Tseng (曾雋崴), Taiwan Attorney');
    expect(raw).not.toMatch(
      /[\p{Script=Hangul}\p{Script=Hiragana}\p{Script=Katakana}]/u,
    );
    expect(raw).not.toMatch(/[\uFEFF\u00A0\u200B]/u);
    expect(raw).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it('keeps read time aligned and resolves the canonical alias', () => {
    const visibleWordCount = countVisibleEnglishWords(parsed.content);
    const calculatedMinutes = Math.ceil(visibleWordCount / 200);

    expect(visibleWordCount).toBe(1_992);
    expect(calculatedMinutes).toBe(10);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes} min read`);
    expect(post?.readTime).toBe(`${calculatedMinutes} min read`);
    expect(getColumnPost('company-advanced-1', 'en')?.slug).toBe(
      'taiwan-company-establishment-advanced-1',
    );
  });
});
