import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-en/002-withdraw-capital-taiwan-company.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('withdraw-capital-taiwan-company', 'en');

const title =
  'Closing a Taiwan Company: What Happens to Capital and Company Assets?';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/withdraw-capital-taiwan-company';
const featuredImage =
  '../images/002-withdraw-capital-taiwan-company/featured-01.png';
const inlineImage =
  '../images/002-withdraw-capital-taiwan-company/img-01.png';

const exitFaqAnswer =
  'A company that will permanently cease operations generally should register its dissolution, complete liquidation, discharge its debts and tax obligations, and only then distribute its remaining assets to shareholders. If the company will continue, it may consider a lawful capital reduction appropriate to its company form. Ordinary business expenses, lawful dividends, and repayment of genuine company debt are separate legal and tax categories and require their own authority, documentation, accounting, and tax treatment.';
const resolutionFaqAnswer =
  'Dissolution of a limited company requires approval by shareholders holding at least two-thirds of all voting rights. Dissolution of a company limited by shares ordinarily requires a meeting attended by shareholders representing at least two-thirds of all outstanding shares and approval by a majority of the voting rights represented at the meeting. If a company with publicly issued shares does not meet that attendance threshold, it may instead act at a meeting attended by shareholders representing a majority of all outstanding shares if at least two-thirds of the voting rights represented at the meeting approve. Any higher quorum or voting threshold in the articles of incorporation controls. The dissolution change registration generally must be filed within 15 days after dissolution.';
const suspensionFaqAnswer =
  'A company suspending business for at least one month must apply for business-suspension registration before the suspension begins or within 15 days after it begins, and each suspension period may not exceed one year. Suspension does not eliminate the company or automatically eliminate its tax-filing obligations; a profit-seeking enterprise that suspends business during the year still must file its annual income tax return. Other obligations depend on the company’s assets, employees, contracts, licenses, and tax profile.';

const faq = [
  {
    q: 'Can a Taiwan company return money to its shareholders without dissolution and liquidation?',
    a: exitFaqAnswer,
  },
  {
    q: 'What approval and filing requirements apply when a Taiwan company dissolves?',
    a: resolutionFaqAnswer,
  },
  {
    q: 'Can a Taiwan company suspend business instead of dissolving immediately?',
    a: suspensionFaqAnswer,
  },
];

const article9Paragraph =
  'Article 9 of Taiwan’s Company Act applies when share subscription payments or capital contributions owed to a company were not actually paid but were represented as fully paid in the incorporation filing, or when paid-in amounts were returned to shareholders or shareholders were allowed to withdraw them after incorporation. The responsible person may be punished by imprisonment for up to five years or detention and may also be fined from NT$500,000 to NT$2.5 million. Article 9 is not a general criminal prohibition on every lawful use of company funds.';
const article90Paragraph =
  'Under Article 90 of the Company Act, a liquidator may not distribute company assets to shareholders before all company liabilities have been discharged. A liquidator who violates that rule may be sentenced to imprisonment for up to one year or detention and may also be fined up to NT$60,000.';
const article89Paragraph =
  'Liquidation following dissolution is not limited to companies whose assets exceed their liabilities. Under Article 89 of the Company Act, if the aggregate value of the company’s assets is insufficient to satisfy its liabilities, the liquidator must file an application for a declaration of bankruptcy. Whether ordinary liquidation may continue requires a fact-specific review of the company’s assets, liabilities, ability to pay debts as they mature, collateral, tax liabilities, and creditor body.';

const h2s = [
  '1. Company Assets, Paid-In Capital, and Shareholder Funds Are Different',
  '2. Permanently Closing a Taiwan Company',
  '3. When Liabilities Exceed Assets or the Company Cannot Pay Its Debts',
  '4. Returning Capital While the Company Continues: Capital Reduction',
  '5. Temporarily Suspending Business Instead of Closing',
  'Official Sources',
  'Related Services',
];

const officialLinks = [
  '[Taiwan Laws & Regulations Database — Company Act](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080001)',
  '[Taiwan Ministry of Economic Affairs — Company Registration Regulations](https://law.moea.gov.tw/LawContent.aspx?id=FL011312)',
  '[Taiwan Ministry of Finance Tax Portal — Final and Liquidation Returns and Business Suspension](https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/profit-seeking-enterprise-income-tax/liquidation-procedure/x6mOPan)',
  '[Taiwan Ministry of Economic Affairs — Business Suspension Filing Deadline](https://serv.gcis.nat.gov.tw/crm/faqAction.do?id=659&method=faqDetlDetl)',
];
const internalLinks = [
  '[Taiwan Investment and Company Formation Services](/en/services#investment)',
  '[Taiwan Company Formation Basics](/en/columns/taiwan-company-establishment-basics)',
  '[Contact Our Office](/en/contact)',
];
const disclaimer =
  'This article provides general legal and tax information about closing a Taiwan company and handling company assets. It is educational material, not legal or tax advice for any specific matter. The appropriate dissolution, liquidation, capital-reduction, business-suspension, and tax-filing procedures depend on the company form, articles of incorporation, financial condition, creditors, foreign-investment structure, and particular transactions. Confirm the current rules and facts before adopting a resolution, transferring funds, or distributing company assets.';
const author = '**Wei Tseng (曾雋崴), Taiwan Attorney**';

function countOccurrences(value: string, needle: string) {
  return value.split(needle).length - 1;
}

function firstParagraphAfter(content: string, heading: string) {
  return content.split(`${heading}\n\n`)[1]?.split('\n\n')[0];
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
    .replace(/[“”*_`]/g, ' ');

  return (
    visibleText.match(/[A-Za-z0-9]+(?:[.’'-][A-Za-z0-9]+)*/g)?.length ?? 0
  );
}

describe('English investment column 002 — closing a Taiwan company', () => {
  it('publishes the exact metadata, H1, images, and three contracted FAQs', () => {
    expect(parsed.data.title).toBe(title);
    expect(parsed.data.url).toBe(sourceUrl);
    expect(parsed.data.lastmod).toBe('2026-07-25');
    expect(parsed.data.date_display).toBe('September 13, 2025');
    expect(parsed.data.categories).toEqual(['Taiwan Company Formation']);
    expect(parsed.data.featured_image).toBe(featuredImage);
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(parsed.data.faq).toEqual(faq);
    expect(parsed.data.faq).toHaveLength(3);

    expect(post).toBeTruthy();
    expect(post?.slug).toBe('withdraw-capital-taiwan-company');
    expect(post?.title).toBe(title);
    expect(post?.date).toBe('2026-07-25');
    expect(post?.dateDisplay).toBe('September 13, 2025');
    expect(post?.category).toBe('formation');
    expect(post?.categoryLabel).toBe('Company Setup');
    expect(post?.featuredImage).toBe(
      '/images/blog/002-withdraw-capital-taiwan-company/featured-01.png',
    );
    expect(post?.faq).toEqual(faq);

    expect(
      Array.from(
        parsed.content.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g),
        (match) => ({ alt: match[1], src: match[2] }),
      ),
    ).toEqual([
      {
        alt: 'Closing a Taiwan company and accounting for its capital, liabilities, and residual assets',
        src: featuredImage,
      },
      { alt: '', src: inlineImage },
    ]);
    expect(countOccurrences(raw, featuredImage)).toBe(2);
    expect(countOccurrences(raw, inlineImage)).toBe(1);
  });

  it('repeats each FAQ answer verbatim as the first paragraph after its H2', () => {
    const headingAnswers = [
      [`## ${h2s[0]}`, exitFaqAnswer],
      [`## ${h2s[1]}`, resolutionFaqAnswer],
      [`## ${h2s[4]}`, suspensionFaqAnswer],
    ];

    for (const [heading, answer] of headingAnswers) {
      expect(firstParagraphAfter(parsed.content, heading)).toBe(answer);
      expect(firstParagraphAfter(post?.content ?? '', heading)).toBe(answer);
    }
  });

  it('uses exactly the seven contracted H2 sections in order', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(h2s);
  });

  it('states the company-property distinctions and exact statutory safeguards', () => {
    for (const phrase of [
      'Its assets belong to the company, not to its shareholders.',
      'does not give the shareholder a continuing right to withdraw company cash, equipment, receivables, or other assets at will',
      'Paid-in capital or capital contributions',
      'Lawful business expenses',
      'Dividends distribute earnings',
      'Repayment of genuine company debt',
      'A capital reduction changes the registered capital structure.',
      'distribution of residual assets after liabilities have been handled',
      article9Paragraph,
      article90Paragraph,
      'Any other civil, criminal, director-duty, accounting, or tax consequence depends on the payment’s purpose, authority, documentation, accounting treatment, and particular facts.',
    ]) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expect(countOccurrences(parsed.content, article9Paragraph)).toBe(1);
    expect(countOccurrences(parsed.content, article90Paragraph)).toBe(1);
  });

  it('locks the company-form voting rules and qualified permanent-closing sequence', () => {
    for (const phrase of [
      'Company Act Article 113 requires a limited company to obtain approval from shareholders holding at least two-thirds of all voting rights.',
      'Under Company Act Article 316, a company limited by shares ordinarily acts at a meeting attended by shareholders representing at least two-thirds of all outstanding shares, with approval by a majority of the voting rights represented at that meeting.',
      'attendance representing a majority of outstanding shares and approval by at least two-thirds of the voting rights represented',
      'The articles of incorporation may impose a higher quorum or voting requirement, which controls.',
      'Review contracts, employees, permits, company assets, debts, taxes, litigation, bank accounts, foreign-investment approvals, and remittance records.',
      'Under Article 4 of the Company Registration Regulations (公司登記辦法), the company generally must apply for dissolution change registration within 15 days after dissolution.',
      'current-period final income tax return within 45 days after the competent authority approves the dissolution',
      'uses the approval document’s issuance date and begins counting from the following day',
      'Select or confirm the liquidator',
      'make the required court filing',
      'inventory of property and balance sheet',
      'concluding pending business, collecting claims, realizing property when necessary, discharging debts and taxes',
      'creditor procedures',
      'Only residual assets remaining after liabilities and taxes have been handled may be distributed',
      'File the liquidation-income return within 30 days after liquidation ends',
      'liquidation-completion report to the court',
      'Company Act Article 24',
      'dissolution caused by consolidation or merger, split-up, or bankruptcy may not follow ordinary liquidation',
      'No fixed liquidation duration can be promised',
    ]) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('explains insolvency without the obsolete property-and-creditor shortcut', () => {
    expect(raw).toContain(article89Paragraph);
    expect(post?.content).toContain(article89Paragraph);
    expect(countOccurrences(parsed.content, article89Paragraph)).toBe(1);

    for (const phrase of [
      'Balance-sheet insolvency compares the value of assets with total liabilities.',
      'Inability to pay debts as they mature concerns payment performance',
      'Liquidity asks whether assets can be converted into usable funds',
      'Book value is not necessarily realizable value.',
      'Security interests and priority claims',
      'Employee claims, tax liabilities, litigation, arbitration, guarantees, and contingent obligations',
      'review current books, bank records, claims, liabilities, security interests, taxes, creditor treatment, and reliable asset valuations before any shareholder distribution',
      'the stale shortcut that bankruptcy requires both property available for liquidation and multiple creditors',
    ]) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('separates capital reduction, expenses, dividends, and genuine debt', () => {
    for (const phrase of [
      'If the company will continue operating but wishes to return part of its capital, a lawful capital reduction may be considered.',
      'A capital reduction is not an informal shareholder withdrawal, and it is not always available.',
      'company-form-specific resolution, creditor-protection measures, capital verification and accounting, foreign-investment filings, tax and withholding analysis, remittance review, and change registration',
      'Lawful business expenses require a genuine company purpose',
      'Dividends must be supported by distributable earnings and the required corporate action.',
      'Cash in a bank account alone does not establish distributable earnings.',
      'Repayment of a genuine shareholder loan or other company debt requires an actual debtor-creditor relationship.',
      'contract, original transfer, commercial terms, approvals, maturity, interest, invoices, repayment records, and accounting history',
      'withholding, tax reporting',
    ]) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('qualifies business suspension timing, tax filings, and continuing duties', () => {
    expect(firstParagraphAfter(parsed.content, `## ${h2s[4]}`)).toBe(
      suspensionFaqAnswer,
    );
    for (const phrase of [
      'Business suspension preserves the company’s legal existence.',
      'it is not a substitute for dissolution and liquidation',
      'registered address, responsible person, articles of incorporation, or capital may still require change registration',
      'Vehicles and real property may create taxes and carrying costs',
      'contracts may continue unless amended or terminated',
      'Employee status and labor obligations',
      'Industry licenses',
      'Bank accounts',
      'reliable record retention',
      'maintain an address and responsible contact',
      'whether it will resume business, seek another lawful suspension period where available, or move to permanent closure',
    ]) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses exactly the four official links and three English links once and in order', () => {
    const officialSection =
      parsed.content
        .split('## Official Sources\n\n')[1]
        ?.split('\n\n## Related Services')[0]
        ?.trim()
        .split('\n') ?? [];
    expect(officialSection).toEqual(officialLinks.map((link) => `- ${link}`));

    const relatedSection =
      parsed.content
        .split('## Related Services\n\n')[1]
        ?.split(`\n\n---\n\n${disclaimer}`)[0]
        ?.trim()
        .split('\n') ?? [];
    expect(relatedSection).toEqual(internalLinks.map((link) => `- ${link}`));

    const markdownLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g),
      (match) => match[0],
    );
    expect(markdownLinks).toEqual([...officialLinks, ...internalLinks]);
    for (const link of [...officialLinks, ...internalLinks]) {
      expect(countOccurrences(raw, link)).toBe(1);
    }
  });

  it('ends with the exact disclaimer and author, with nothing after the author', () => {
    expect(parsed.content).toContain(`\n\n---\n\n${disclaimer}\n\n${author}`);
    expect(parsed.content.trimEnd()).toMatch(
      new RegExp(
        `${disclaimer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n${author.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
      ),
    );
    expect(post?.content).toContain(disclaimer);
    expect(post?.content.trimEnd()).toMatch(
      /\*\*Wei Tseng \(曾雋崴\), Taiwan Attorney\*\*$/,
    );
  });

  it('locks the exact visible-word count and 200-wpm read-time formula', () => {
    const visibleWords = countVisibleEnglishWords(parsed.content);
    const calculatedMinutes = Math.ceil(visibleWords / 200);

    expect(visibleWords).toBe(3_081);
    expect(visibleWords).toBeGreaterThanOrEqual(1_800);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes} min read`);
    expect(post?.readTime).toBe(`${calculatedMinutes} min read`);
  });

  it('removes stale claims, unsafe promises, locale leakage, and hidden characters', () => {
    const forbiddenStrings = [
      'How Can You Recover Capital When You No Longer Want to Operate a Company Established in Taiwan?',
      '1 min read',
      'remaining assets (capital)',
      'residual assets (capital)',
      'directly back to Korea',
      'Company Registration Act Article 4',
      'renewable upon expiry',
      'next period will not require a tax return',
      'DM me',
      'contact me for',
      'response within',
      'guaranteed approval',
      'guaranteed remittance',
      '曾俊瑋',
      '/ko/',
      '/ja/',
      '/zh-hant/',
      '\uFEFF',
      '\u00A0',
      '\u200B',
    ];
    for (const forbidden of forbiddenStrings) {
      expect(raw).not.toContain(forbidden);
    }

    expect(raw).not.toMatch(/[\uac00-\ud7af\u3040-\u30ff]/);
    expect(raw).not.toMatch(
      /liquidation (?:is|may be) (?:available|permitted) only (?:if|when) assets exceed liabilities/i,
    );
    expect(raw).not.toMatch(
      /breach of trust (?:automatically|always|necessarily) applies/i,
    );
    expect(raw).not.toMatch(
      /dissolution (?:registration )?(?:automatically )?cancels every/i,
    );
    expect(raw).not.toMatch(
      /suspension (?:automatically )?eliminates all (?:future |next-period )?tax filings/i,
    );
    expect(raw).not.toMatch(
      /(?:approval|outcome|remittance|liquidation duration)[^.]*guarantee/i,
    );
  });
});
