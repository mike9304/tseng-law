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
const aliasPost = getColumnPost('withdraw-capital', 'en');

const title =
  'Closing a Taiwan Company: What Happens to Capital and Company Assets?';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/withdraw-capital-taiwan-company';
const featuredImage =
  '../images/002-withdraw-capital-taiwan-company/featured-01.png';
const inlineImage =
  '../images/002-withdraw-capital-taiwan-company/img-01.png';

const exitFaqAnswer =
  'To close a company permanently, as a general rule, the company registers its dissolution, completes liquidation, settles its debts and taxes, and then distributes the remaining residual assets to its shareholders. If the company will continue operating while returning capital contributions, it should consider a lawful procedure appropriate to its company form, such as a capital reduction. Ordinary business expenses, dividends, and repayment of loans actually owed by the company each require a separate legal and tax basis and procedure.';
const resolutionFaqAnswer =
  'A limited company requires the approval of shareholders holding at least two-thirds of the voting rights. A company limited by shares, as a general rule, requires the attendance of shareholders representing at least two-thirds of all issued shares and a resolution approved by a majority of the voting rights represented by the attending shareholders. If a company that has made a public offering of shares does not meet that attendance requirement, it may adopt the resolution with shareholders representing a majority of all issued shares in attendance and at least two-thirds of the voting rights represented by the attending shareholders in favor. The articles of incorporation may impose higher requirements. An application for dissolution registration must be filed within 15 days after dissolution.';
const suspensionFaqAnswer =
  'A company suspending business for at least one month must apply for business-suspension registration before the suspension or within 15 days after the suspension begins, and each suspension period may not exceed one year. However, the company must still file its annual income tax return for a year in which it suspends business, so suspension does not categorically exempt it from tax filings. Its obligations must be checked individually based on the types of tax involved, the assets it holds, its employees, and other circumstances.';

const faq = [
  {
    q: 'Must a Taiwan company be dissolved and liquidated before its funds can be returned to shareholders?',
    a: exitFaqAnswer,
  },
  {
    q: 'What approval requirements and registration deadline apply to a company dissolution?',
    a: resolutionFaqAnswer,
  },
  {
    q: 'Can a company suspend business instead of dissolving immediately?',
    a: suspensionFaqAnswer,
  },
];

const article9Paragraph =
  'Article 9 of Taiwan’s Company Act provides that when share capital payable to a company was not actually paid but was represented as fully paid, or when share capital was returned to shareholders or shareholders were permitted to recover it after registration, the violation is punishable by imprisonment for up to five years, detention, or a fine of between NT$500,000 and NT$2.5 million. This provision does not generally punish ordinary, lawful uses of company funds.';
const article90Paragraph =
  'If a liquidator distributes company property to shareholders before paying the company’s debts, Article 90 of the Company Act provides for imprisonment for up to one year, detention, or a fine of up to NT$60,000.';
const article89Paragraph =
  'Liquidation after dissolution is not a procedure available only when a company’s assets exceed its liabilities. Under Article 89 of the Company Act, if the company’s property is insufficient to pay its debts, the liquidator must immediately apply for a declaration of bankruptcy. Whether ordinary liquidation can continue should be determined individually after reviewing excess liabilities, inability to pay, security, tax debts, and the number of creditors.';

const h2s = [
  '1. Company Assets and Shareholder Contributions Must Be Distinguished',
  '2. Procedure for Permanently Closing a Company',
  '3. When Liabilities Exceed Assets or the Company Cannot Pay Its Debts',
  '4. Capital Reduction While the Company Continues',
  '5. Business Suspension When the Company Will Not Close Immediately',
  'Official Sources',
  'Related Services',
];

const officialLinks = [
  '[Taiwan Company Act](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080001)',
  '[Taiwan Ministry of Economic Affairs Company Registration Regulations](https://law.moea.gov.tw/LawContent.aspx?id=FL011312)',
  '[Taiwan Ministry of Finance Guidance on Final Returns, Liquidation Returns, and Business Suspension](https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/profit-seeking-enterprise-income-tax/liquidation-procedure/x6mOPan)',
  '[Taiwan Ministry of Economic Affairs Guidance on the Business-Suspension Filing Deadline](https://serv.gcis.nat.gov.tw/crm/faqAction.do?id=659&method=faqDetlDetl)',
];
const internalLinks = [
  '[Taiwan Investment and Company Formation Services](/en/services#investment)',
  '[Taiwan Company Formation Basics](/en/columns/taiwan-company-establishment-basics)',
  '[Contact Our Office](/en/contact)',
];
const disclaimer =
  'This article provides general legal information and educational material about closing a Taiwan company and handling company property; it is not legal advice for any specific matter. The appropriate dissolution, liquidation, capital-reduction, and business-suspension procedures and tax filings may vary with the company form, articles of incorporation, financial condition, creditors, foreign investment, and individual transactions, so the particular matter should be reviewed separately before any resolution is adopted or funds are transferred.';
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
        alt: 'Closing a Taiwan company and identifying its company property and residual assets',
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
      'Company property belongs to the company, not to the shareholders personally.',
      'A shareholder therefore cannot freely withdraw company deposits or assets merely because that shareholder contributed capital in the past.',
      'Capital is an equity item representing the amount paid by shareholders when a company is incorporated or increases its capital.',
      'The applicable requirements differ depending on whether the transaction is a payment for goods or services incurred by the company, a dividend that has already been lawfully declared, repayment of money lent to the company by a shareholder, a capital reduction, or a distribution of residual assets after liquidation.',
      article9Paragraph,
      article90Paragraph,
      'The provision should not be extended to every payment from a company account.',
      'payments of rent, wages, amounts owed to suppliers, or taxes for actual business operations must be distinguished from falsely representing unpaid share capital as paid or returning share capital after registration',
      'separate issues may arise under company law, tax law, and accounting standards if its actual use, counterparty, consideration, or decision-making authority is unclear',
      'In liquidation, creditors and taxes take priority over a shareholder’s recovery of an investment.',
      'Even when a shareholder asserts a loan claim against the company, the actual loan agreement, flow of funds, interest terms, accounting treatment, and order of repayment must be checked.',
      'Other civil, criminal, and tax liabilities depend on the specific facts, including the purpose and authority for the transfer, the supporting evidence, its accounting treatment, and the relationship between the parties.',
      'The existence of a particular transaction does not necessarily establish breach of trust or another offense, while internal approval alone does not necessarily exclude all liability.',
      'Combining personal expenses paid with a company card, company expenses advanced by a responsible person, amounts borrowed by the company from a shareholder, and amounts withdrawn from the company by a shareholder into one netted account can obscure the basis for each transaction.',
    ]) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expect(countOccurrences(parsed.content, article9Paragraph)).toBe(1);
    expect(countOccurrences(parsed.content, article90Paragraph)).toBe(1);
  });

  it('locks the company-form voting rules and qualified permanent-closing sequence', () => {
    for (const phrase of [
      'Under Article 113 of the Company Act, a limited company requires the approval of shareholders holding at least two-thirds of the voting rights.',
      'Under Article 316 of the Company Act, a company limited by shares, as a general rule, requires the attendance of shareholders representing at least two-thirds of all issued shares and a resolution approved by a majority of the voting rights represented by the attending shareholders.',
      'with shareholders representing a majority of all issued shares in attendance and at least two-thirds of the voting rights represented by the attending shareholders in favor',
      'If the articles of incorporation impose higher requirements for the number of shares represented or voting rights, those requirements must also be followed.',
      'List its ongoing contracts, employees, leases, permits and licenses, assets, debts, guarantees, taxes, litigation and enforcement proceedings, and bank accounts.',
      'Under Article 4 of the Company Registration Regulations (公司登記辦法), as a general rule, a company must apply for change registration within 15 days after a registered matter changes.',
      'dissolution change registration appropriate to the company form and cause of dissolution should be prepared within 15 days after dissolution',
      'the current-period final return must be filed within 45 days after the competent authority approves the dissolution',
      'the period begins on the day after the competent authority sends the approval document, that is, the day after its date of issuance',
      'After appointing a liquidator under the articles of incorporation or a shareholder resolution, or confirming the statutory liquidator, report the required matters to the court.',
      'The liquidator prepares an inventory of property and a balance sheet, concludes the company’s existing affairs, collects outstanding claims, and determines how assets will be preserved and realized.',
      'notices, announcements, and creditor-protection procedures',
      'Only residual assets remaining after all debts and taxes have been settled may be distributed to shareholders',
      'Residual assets are not the same concept as paid-in capital',
      'File the liquidation-income return within 30 days after the liquidation ends',
      'make the required liquidation-completion report to the court',
      'Dissolution resulting from a merger, split-up, or bankruptcy may be exempt from ordinary liquidation procedures.',
      'The time needed for liquidation varies with these facts, so decisions should not be based on an assumed fixed period.',
      'a transfer of assets to a related party or a waiver of claims requires a separate review of its effect on the company and its creditors',
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
      'The books, claims and debts, security, and unpaid taxes must be checked before considering shareholder distributions.',
      'debts incurred after the financial-statement date, guarantee obligations, litigation claims, employee-related amounts, the possibility of a tax audit, and the actual disposal value of assets',
      'Excess liabilities generally concern the company’s financial position as determined by comparing assets with liabilities, while inability to pay concerns whether debts can be paid when they become due.',
      'Even if the books show substantial assets, the company’s ability to pay may be assessed differently if those assets cannot be converted immediately into cash or are subject to security.',
      'a temporary cash shortage alone does not necessarily mean that the same procedure applies in every case',
      'paying only a particular creditor or shareholder first may prejudice other creditors’ interests and procedural fairness',
      'security interests, tax claims, and wages',
      'Whether a bankruptcy application is required should not be decided using only a simplistic formula or multiple conditions found in outdated guidance.',
      'The collectability of the company’s claims and the costs of selling its assets should also be assessed at realistic values rather than nominal amounts.',
      'A new loan, capital increase, debt waiver, and agreement with creditors can each produce different accounting and tax consequences.',
    ]) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('separates capital reduction, expenses, dividends, and genuine debt', () => {
    for (const phrase of [
      'a capital reduction may be considered as a lawful way to return part of the shareholders’ contributions while continuing the company',
      'A capital reduction, however, is not an informal means for shareholders to take company deposits whenever they wish, and it is not always available.',
      'The resolution appropriate to the company form, creditor protection, capital verification and accounting treatment, foreign-investment matters, taxes, remittance, and change registration must all be checked.',
      'Even if the company has cash, it must be able to continue operating after paying wages, taxes, supplier invoices, loans, guarantees, and anticipated operating expenses.',
      'the investment approval or reported information, shareholder register, change in capital, foreign-exchange records, and bank remittance documents should be consistent',
      'The taxation of amounts received by shareholders in a capital reduction is not determined merely by labeling them a return of contributed principal.',
      'If a shareholder or director is the supplier, the need for the transaction, its price, approval of the conflict of interest, and the requirements for recognizing the expense should be checked additionally.',
      'Cash in the company’s account does not by itself establish distributable profits',
      'Repayment of a loan actually owed by the company is likewise a separate transaction.',
      'retroactively relabeling a capital contribution as a loan should be avoided',
      'the legal character and tax treatment of each transaction should be recorded separately',
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
      'Business suspension allows a company to stop operating for a period while retaining its legal personality.',
      'it does not extinguish the company or settle all existing rights and obligations',
      'changes to registered matters such as the business address, responsible person, articles of incorporation, or capital require the necessary change registration',
      'The company should maintain an address and a responsible person who can receive mail and agency notices',
      'separate expenses such as local taxes, management fees, and insurance premiums may continue',
      'If a shareholder personally uses or stores an asset, the respective rights of the company and the individual and responsibility for the expenses should be documented separately.',
      'Continuing obligations relating to contracts, employees, permits and licenses, bank accounts, and record retention should also be checked.',
      'establish a system to retain accounting books and supporting evidence for the statutory period',
      'Business-suspension registration alone should not be understood as eliminating all tax filings.',
      'The fact that the company has no actual sales is not the same as a conclusion that it has no filing obligation for a particular tax',
      'decide whether to resume business, consider whether it qualifies for a further suspension, or move to permanent closure',
      'business suspension is not a substitute for dissolution and liquidation',
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
    expect(officialSection).toEqual(
      officialLinks.map((link, index) => `${index + 1}. ${link}`),
    );

    const relatedSection =
      parsed.content
        .split('## Related Services\n\n')[1]
        ?.split(`\n\n---\n\n${disclaimer}`)[0]
        ?.trim()
        .split('\n') ?? [];
    expect(relatedSection).toEqual(
      internalLinks.map((link, index) => `${index + 1}. ${link}`),
    );

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

    expect(visibleWords).toBe(4_290);
    expect(visibleWords).toBeGreaterThanOrEqual(1_800);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes} min read`);
    expect(post?.readTime).toBe(`${calculatedMinutes} min read`);
  });

  it('resolves the withdraw-capital alias to the complete canonical post', () => {
    expect(aliasPost?.slug).toBe('withdraw-capital-taiwan-company');
    expect(aliasPost?.title).toBe(post?.title);
    expect(aliasPost?.content).toBe(post?.content);
    expect(aliasPost?.faq).toEqual(post?.faq);
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
