import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-en/004-taiwan-company-subsidiary-vs-branch.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('taiwan-company-subsidiary-vs-branch', 'en');
const aliasPost = getColumnPost('subsidiary-vs-branch', 'en');

const title =
  'Entering the Taiwan Market: Key Differences Between a Subsidiary and a Branch';
const featuredImage =
  '../images/004-taiwan-company-subsidiary-vs-branch/featured-01.jpg';
const inlineImage =
  '../images/004-taiwan-company-subsidiary-vs-branch/img-01.jpg';
const faq1Answer =
  'A Taiwan branch is part of the foreign company and has no shareholders of its own. If the business will have third-party co-investors, it may consider a Taiwan subsidiary with an appropriate shareholder structure or another lawful arrangement. Liability, voting rights, financing, licensing, and tax treatment must be evaluated based on the ownership arrangement and business plan.';
const faq2Answer =
  'A subsidiary and a branch that conduct taxable business in Taiwan generally must address 5% business tax and 20% profit-seeking enterprise income tax, although actual liability depends on taxable income, transaction type, and allowable deductions. Under Taiwan domestic law, a Taiwan subsidiary’s dividend to a foreign parent is subject to 21% withholding; when the Taiwan–Korea Income Tax Agreement and its procedures apply, the source-territory rate is capped at 10%. A Taiwan branch’s remittance of after-tax branch profits to its foreign head office is not a dividend and generally does not trigger separate dividend withholding. A profit-seeking enterprise whose head office is outside Taiwan is exempt from filing the undistributed-earnings return and from the related 5% additional tax.';
const faq3Answer =
  'A branch is not an independent issuer and cannot itself be listed in Taiwan. A Taiwan subsidiary must still satisfy the Company Act and the applicable exchange’s requirements to pursue a listing. Tax incentives do not apply solely because of the chosen organizational form. Eligibility for an investment credit under Article 10-1 of the Statute for Industrial Innovation depends on the taxpayer, qualifying investment, filing deadline, credit method, anti-duplication rules, and applicable tax limits.';
const disclaimer =
  'This article provides general legal and tax information about the differences between a Taiwan subsidiary and a Taiwan branch of a foreign company. It is educational material, not legal or tax advice for any specific matter. The applicable laws and tax treatment may vary depending on the jurisdictions of the investor, foreign parent, and foreign head office; the business activities; the transactions and cash flows; treaty eligibility; and current agency practice. Confirm the current official guidance and the facts of your matter before forming or funding an entity, entering into a contract, declaring a dividend, or making an outbound remittance.';
const author = '**Wei Tseng (曾雋崴), Taiwan Attorney**';

const faq = [
  {
    q: 'Can Taiwanese individuals or Taiwan entities participate as shareholders in a Taiwan branch?',
    a: faq1Answer,
  },
  {
    q: 'How do the tax consequences of a Taiwan subsidiary and a Taiwan branch differ?',
    a: faq2Answer,
  },
  {
    q: 'If a business plans to list in Taiwan or claim an investment tax credit, should it use a subsidiary or a branch?',
    a: faq3Answer,
  },
];

const officialLinks = [
  '[Laws & Regulations Database — Company Act](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080001)',
  '[Laws & Regulations Database — Article 10 of the Value-Added and Non-Value-Added Business Tax Act](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=10&pcode=G0340080)',
  '[Laws & Regulations Database — Income Tax Act](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=G0340003)',
  '[Ministry of Finance eTax Portal — Withholding on Profit Income](https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/individual-income-tax/withheld-rule/rule/3AmWR0R)',
  '[Ministry of Finance Laws and Regulations Database — Taxation of Profits of a Taiwan Branch of a Foreign Company](https://law-out.mof.gov.tw/LawContent.aspx?id=GL002917)',
  '[Ministry of Finance eTax Portal — Exemption from the Undistributed-Earnings Return](https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/profit-seeking-enterprise-income-tax/undistributed-surplus-earnings/om7pAeL)',
  '[Ministry of Finance — Entry into Force and Application of the Taiwan–Korea Income Tax Agreement](https://www.mof.gov.tw/singlehtml/384fb3077bb349ea973e7fc6f13b6974?cntId=127fffb302f24987b0bbf1eff78ff9c9)',
  '[Laws & Regulations Database — Article 10-1 of the Statute for Industrial Innovation](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=10-1&pcode=J0040051)',
  '[Taiwan Stock Exchange — Domestic Company Listing Standards](https://www.twse.com.tw/zh/listed/method/standars.html)',
  '[Invest Taiwan — Foreign-Company Branch Investment and Registration Procedures](https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus01?lang=eng&menuNum=7&search=InvestmentStatus01)',
];
const internalLinks = [
  '[Taiwan Investment and Company Formation Services](/en/services#investment)',
  '[Taiwan Company Formation Basics](/en/columns/taiwan-company-establishment-basics)',
  '[Contact Our Office](/en/contact)',
];

const listingParagraph =
  'A branch is not an independent issuer and cannot itself be listed in Taiwan. A Taiwan subsidiary does not qualify for listing merely because it exists or is organized as a company limited by shares. The issuer must satisfy the requirements of the applicable market, including requirements concerning operating history, capital, profitability, share distribution, corporate governance, internal controls, audit, and disclosure.';
const articleTenOneParagraph =
  'Article 10-1 of the Statute for Industrial Innovation applies from January 1, 2025, through December 31, 2029. Subject to its statutory conditions and approval process, a company or limited partnership with qualifying expenditures totaling NT$1 million or more but NT$2 billion or less in the same taxable year may elect a credit for qualifying new, own-use smart machinery; 5G systems; cybersecurity products or services; AI products or services; and energy-saving or carbon-reduction hardware, software, technology, or technical services. The taxpayer may elect up to 5% of the expenditure against tax payable for the current year or up to 3% against tax payable in each of three years beginning with the current year. The annual Article 10-1 credit may not exceed 30% of the current year’s profit-seeking enterprise income tax; the combined-credit limit and restrictions on duplicate benefits require separate review.';
const treatyParagraph =
  'The Taiwan–Korea Income Tax Agreement was signed on November 17, 2021, entered into force on December 27, 2023, and applies from January 1, 2024. Its source-territory ceilings for qualifying dividends, interest, and royalties are each 10%, subject to the Agreement’s residence, beneficial-owner, documentation, and procedural requirements. Business profits are generally exempt in the other territory if the enterprise has no permanent establishment there. A permanent establishment may arise from a fixed place such as a place of management, branch, or office; a construction project lasting more than six months; services performed for more than 183 aggregate days in any 12-month period; or a dependent agent that habitually exercises authority to conclude contracts. A Taiwan branch ordinarily is a fixed-place permanent establishment, so its Taiwan business profits are not automatically exempt.';
const branchExitParagraph =
  'Under Article 378 of the Company Act, a foreign company that no longer intends to conduct business in Taiwan must apply to cancel its branch registration, and cancellation does not discharge liabilities or debts incurred before cancellation. Article 379 separately authorizes official cancellation in specified circumstances and provides that cancellation does not affect creditors’ rights or the foreign company’s obligations. If all of the foreign company’s Taiwan branches have been revoked or canceled, Article 380 requires liquidation of the claims and debts arising from its Taiwan business, and the foreign company remains liable for outstanding debts.';

function firstParagraphAfter(content: string, heading: string) {
  return content.split(`${heading}\n\n`)[1]?.split('\n\n')[0];
}

function canonicalContent(content: string) {
  const fixedImages = content.replace(
    /\(\.\.\/images\/([^)]+)\)/g,
    '(/images/blog/$1)',
  );
  const withoutLeadingDuplicates = fixedImages
    .trimStart()
    .replace(/^#\s+.+\n*/, '')
    .replace(/^\s*!\[[^\]]*\]\([^)]+\)\s*\n*/, '')
    .trimStart();

  return withoutLeadingDuplicates
    .replace(/\n?\s*!\[[^\]]*\]\([^)]+\)\s*\n?/g, '\n\n')
    .trim();
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
    .replace(/[“”*_`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    visibleText.match(/[A-Za-z0-9]+(?:[.’'-][A-Za-z0-9]+)*/g)?.length ?? 0
  );
}

describe('English investment column 004 — subsidiary versus branch', () => {
  it('publishes the complete exact frontmatter and canonical post contract', () => {
    expect(parsed.data).toEqual({
      title,
      url: 'https://www.wei-wei-lawyer.com/post/taiwan-company-subsidiary-vs-branch',
      lastmod: '2026-07-25',
      date_display: 'September 13, 2025',
      read_time: '18 min read',
      categories: ['Taiwan Company Formation'],
      featured_image: featuredImage,
      faq,
    });
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(post).toMatchObject({
      slug: 'taiwan-company-subsidiary-vs-branch',
      title,
      date: '2026-07-25',
      dateDisplay: 'September 13, 2025',
      readTime: '18 min read',
      category: 'formation',
      categoryLabel: 'Company Setup',
      featuredImage:
        '/images/blog/004-taiwan-company-subsidiary-vs-branch/featured-01.jpg',
      faq,
    });
    expect(post?.content).toBe(canonicalContent(parsed.content));
  });

  it('resolves the canonical and alias slugs to identical content', () => {
    expect(post).toBeDefined();
    expect(aliasPost).toBeDefined();
    expect(aliasPost?.slug).toBe(post?.slug);
    expect(aliasPost?.title).toBe(post?.title);
    expect(aliasPost?.date).toBe(post?.date);
    expect(aliasPost?.readTime).toBe(post?.readTime);
    expect(aliasPost?.content).toBe(post?.content);
    expect(aliasPost?.faq).toEqual(post?.faq);
  });

  it('preserves exactly the two contracted images, alts, paths, counts, and positions', () => {
    expect(
      Array.from(
        parsed.content.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g),
        (match) => ({ alt: match[1], path: match[2] }),
      ),
    ).toEqual([
      {
        alt: 'Taiwan subsidiary and foreign-company branch comparison',
        path: featuredImage,
      },
      { alt: '', path: inlineImage },
    ]);
    expect(parsed.content.trimStart()).toMatch(
      new RegExp(
        `^# ${title}\\n\\n!\\[Taiwan subsidiary and foreign-company branch comparison\\]\\(${featuredImage.replace(/\./g, '\\.')}\\)`,
      ),
    );
    expect(parsed.content.indexOf(inlineImage)).toBeGreaterThan(
      parsed.content.indexOf('The comparison should begin with one set of facts.'),
    );
    expect(parsed.content.indexOf(inlineImage)).toBeLessThan(
      parsed.content.indexOf('## 1. Legal Personality and Ownership'),
    );
    expect(raw.split(featuredImage)).toHaveLength(3);
    expect(raw.split(inlineImage)).toHaveLength(2);
  });

  it('uses exactly the nine ordered H2 sections', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual([
      '1. Legal Personality and Ownership',
      '2. Tax and Profit Remittances',
      '3. Debts and Legal Liability',
      '4. Financing and Listing in Taiwan',
      '5. Article 10-1 Investment Tax Credits',
      '6. The Taiwan–Korea Income Tax Agreement and Permanent Establishments',
      '7. Choosing a Structure and Planning an Exit',
      'Official Sources',
      'Related Services',
    ]);
  });

  it('repeats every exact FAQ answer first after its assigned H2 and exactly twice', () => {
    const headingAnswers = [
      ['## 1. Legal Personality and Ownership', faq1Answer],
      ['## 2. Tax and Profit Remittances', faq2Answer],
      ['## 4. Financing and Listing in Taiwan', faq3Answer],
    ];

    for (const [heading, answer] of headingAnswers) {
      expect(firstParagraphAfter(parsed.content, heading)).toBe(answer);
      expect(firstParagraphAfter(post?.content ?? '', heading)).toBe(answer);
      expect(raw.split(answer)).toHaveLength(3);
    }
  });

  it('locks the Company Act identity, shareholder, branch-funding, and exit propositions', () => {
    const requiredPropositions = [
      'Article 1 of the Company Act defines a company organized, registered, and incorporated under that Act as a corporate juristic person for profit.',
      'A Taiwan subsidiary formed under the Act therefore has a legal identity separate from its foreign parent, and each has its own rights and obligations.',
      'The subsidiary can own property, employ staff, contract with customers and suppliers, and bring or defend proceedings in its own name.',
      'Under Article 99(1), a shareholder of a limited company is generally liable to the company to the extent of that shareholder’s contribution.',
      'Article 99(2) addresses serious abuse',
      'Limited liability also does not eliminate liability arising from a guarantee, a contract signed in another capacity, a tort, director or officer duties, regulatory law, or another applicable cause of action.',
      'Under Article 371, a foreign company that has not registered a branch may not conduct business in Taiwan in the foreign company’s name.',
      'Article 372 requires the foreign company to appropriate funds exclusively for the branch’s business and to designate a representative who serves as the responsible person in Taiwan.',
      'Those appropriated branch operating funds remain funds of the foreign company; they are not share capital or equity in a separate entity.',
      'every branch obligation is an obligation of the foreign company',
      'does not give the branch a separate legal identity or create a limited-liability silo',
      branchExitParagraph,
      'A Taiwan subsidiary ends its business through the applicable dissolution and liquidation procedures in its own legal identity.',
      'Branch-registration cancellation and subsidiary liquidation should not be collapsed into one generic closure checklist.',
    ];

    for (const proposition of requiredPropositions) {
      expect(parsed.content).toContain(proposition);
      expect(post?.content).toContain(proposition);
    }
  });

  it('locks qualified business-tax, income-tax, withholding, and remittance rules', () => {
    const requiredPropositions = [
      'Taiwan’s general business-tax rate is 5% for taxable sales under the general system.',
      'Zero-rating, exemptions, special rates, the availability of input-tax credits, and the character and place of a supply can alter the treatment.',
      'The general profit-seeking enterprise income-tax rate is 20% when taxable income exceeds the statutory threshold.',
      'It applies to taxable income, not gross revenue.',
      'Under Taiwan domestic law, a dividend paid by a Taiwan subsidiary to a foreign parent is subject to 21% withholding.',
      'the source-territory ceiling for a qualifying dividend is 10%',
      'confirm residence evidence, beneficial-owner status, payment character, supporting documents, and the correct filing or refund procedure',
      'a remittance of those after-tax branch profits to the foreign head office is an internal movement within the foreign company rather than a dividend',
      'It therefore generally does not attract a separate dividend withholding tax.',
      'Interest, royalties, service fees, asset consideration, and third-party payments are different payment types',
      'A profit-seeking enterprise whose head office is outside Taiwan is exempt from filing the undistributed-earnings return and from that related 5% additional tax.',
      'Transfer pricing may apply to related-party dealings, while branch accounts require defensible allocation of head-office and common costs.',
      'Foreign tax credits, the foreign jurisdiction’s tax and accounting treatment',
      'A branch is not inherently tax-favored, and a Taiwan subsidiary does not inherently create a higher or lower total burden.',
    ];

    for (const proposition of requiredPropositions) {
      expect(parsed.content).toContain(proposition);
      expect(post?.content).toContain(proposition);
    }
  });

  it('locks liability qualifications, financing distinctions, and listing requirements', () => {
    const requiredPropositions = [
      'Shareholders of a limited company are generally liable to the company only to the extent of their contributions, while shareholders of a company limited by shares are generally liable to the company only for full payment of the shares for which they have subscribed, subject in each case to applicable exceptions.',
      'Guarantees and comfort letters can expose a foreign parent according to their wording and governing law.',
      'A director, officer, employee, shareholder, or group company may incur separate liability through a contract, breach of duty, or participation in a joint tort.',
      'Serious abuse of juristic personality, labor and tax violations, licensing failures, and group contracts may also create exposure outside the ordinary shareholder rule.',
      'A Taiwan subsidiary is not a device that isolates every risk.',
      'A branch cannot issue branch equity to third-party investors because it has no equity interests to issue.',
      'It may receive appropriately characterized funds from the foreign head office or obtain lawful financing, subject to any applicable investment-approval, banking, foreign-exchange, tax, and documentation requirements.',
      'A Taiwan subsidiary can be used to structure local or third-party participation.',
      'Its capital, shareholder, governance, incentive, transfer, and financing arrangements remain subject to the Company Act',
      listingParagraph,
      'The detailed standards may differ by market, board, and industry',
      'the proposed issuer’s assets, contracts, employees, functions, related-party transactions, financial record, and disclosure readiness must support the listing plan',
    ];

    for (const proposition of requiredPropositions) {
      expect(parsed.content).toContain(proposition);
      expect(post?.content).toContain(proposition);
    }
  });

  it('locks the exact Article 10-1 rule and its eligibility qualifications', () => {
    expect(parsed.content).toContain(articleTenOneParagraph);
    expect(post?.content).toContain(articleTenOneParagraph);

    const requiredPropositions = [
      'Eligibility depends on the taxpayer, compliance history, the nature and amount of qualifying expenditure, the new and own-use requirements, timely filing and approval, supporting records, and any later change in use.',
      'Article 10 research and development credits are distinct from Article 10-1 investment credits.',
      'The law’s definition of the applicant, the identity that incurs the expenditure and uses the investment, and every substantive and procedural condition must be checked.',
      'a Taiwan subsidiary qualifies automatically or that a Taiwan branch is automatically excluded',
    ];
    for (const proposition of requiredPropositions) {
      expect(parsed.content).toContain(proposition);
      expect(post?.content).toContain(proposition);
    }
  });

  it('locks the exact treaty paragraph and distinct PE factual tests', () => {
    expect(parsed.content).toContain(treatyParagraph);
    expect(post?.content).toContain(treatyParagraph);

    const requiredPropositions = [
      'Permanent establishment (PE) is a treaty concept, and its tests address different factual connections.',
      'A services project lasting fewer than 184 aggregate days does not rule out a fixed-place PE',
      'a short construction project does not decide whether a dependent-agent PE exists',
      'The existence of a Taiwan subsidiary does not by itself establish or prevent a foreign parent’s PE in Taiwan.',
      'Employee activity, access to premises, contract negotiation and authority, the functions performed, assets used, risks assumed, and the attribution of profit may require separate analysis.',
    ];
    for (const proposition of requiredPropositions) {
      expect(parsed.content).toContain(proposition);
      expect(post?.content).toContain(proposition);
    }
  });

  it('keeps every required selection, implementation, and exit-planning topic', () => {
    const selectionSection =
      parsed.content
        .split('## 7. Choosing a Structure and Planning an Exit')[1]
        ?.split('## Official Sources')[0] ?? '';
    const checklistLabels = [
      '**Investors and governance:**',
      '**Liability allocation:**',
      '**Operations and assets:**',
      '**Revenue and returns:**',
      '**Investment and banking:**',
      '**Accounting and reporting:**',
      '**Future transactions:**',
      '**Suspension and exit:**',
    ];
    const requiredPlanningTerms = [
      'organization chart, contract list, funds-flow diagram, and financial forecast',
      'guarantees from the foreign parent',
      'customer and supplier contracts, employees, intellectual property, premises, data, assets, and licenses',
      'revenue, costs, cross-border charges, retained earnings, dividends, and branch-profit remittances',
      'investment approval, bank-account opening, inward remittance, any capital increase, the appropriation of branch operating funds, and later outbound remittance',
      'maintain books, obtain any required audit, prepare transfer-pricing support, and complete group reporting',
      'future financing, local participation, employee incentives, restructuring, a share or business sale, and listing',
      'branch-registration cancellation, subsidiary dissolution and liquidation, creditor claims, employee matters, tax filings, asset disposal, bank closure, and record retention',
    ];

    expect(Array.from(selectionSection.matchAll(/^- \*\*/gm))).toHaveLength(8);
    for (const phrase of [...checklistLabels, ...requiredPlanningTerms]) {
      expect(selectionSection).toContain(phrase);
    }
    expect(selectionSection).toContain(branchExitParagraph);
  });

  it('uses only the exact official and internal links once and in order', () => {
    const markdownLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g),
      (match) => match[0],
    );

    expect(markdownLinks).toEqual([...officialLinks, ...internalLinks]);
    for (const link of [...officialLinks, ...internalLinks]) {
      expect(raw.split(link)).toHaveLength(2);
      const url = link.slice(link.indexOf('](') + 2, -1);
      expect(raw.split(url)).toHaveLength(2);
    }
  });

  it('ends with the exact disclaimer and author and nothing else', () => {
    const exactEnding = `---\n\n${disclaimer}\n\n${author}`;
    expect(parsed.content).toContain(exactEnding);
    expect(parsed.content.trimEnd().endsWith(exactEnding)).toBe(true);
    expect(raw.trimEnd().endsWith(exactEnding)).toBe(true);
    expect(raw.trimEnd().endsWith(author)).toBe(true);
  });

  it('freezes the exact visible-word count and formula-derived read time', () => {
    const visibleWords = countVisibleEnglishWords(parsed.content);
    const calculatedMinutes = Math.ceil(visibleWords / 200);

    expect(visibleWords).toBeGreaterThanOrEqual(1_800);
    expect(visibleWords).toBe(3_592);
    expect(calculatedMinutes).toBe(18);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes} min read`);
    expect(post?.readTime).toBe(`${calculatedMinutes} min read`);
  });

  it('rejects stale claims, hidden characters, locale leakage, timelines, and legacy copy', () => {
    const forbiddenLiterals = [
      'representative office',
      'November 2, 2023',
      'December 2, 2023',
      '2023年12月2日',
      'less than NT$2 billion',
      'under NT$2 billion',
      'only subsidiaries',
      'branches cannot claim',
      'always tax',
      'guaranteed',
      'takes 7 days',
      'contact us by comment or direct message',
      'Wei-Wei Lawyer',
      '100% owned by the Korean company',
      'Korean parent',
      'Foreigner income tax',
      'best choice',
      'fastest',
      '/ko/',
      '/ja/',
      '/zh-hant/',
      '\uFEFF',
      '\u00A0',
      '\u200B',
      '\u200C',
      '\u200D',
      '\u2060',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(raw.toLowerCase()).not.toContain(forbidden.toLowerCase());
    }
    expect(raw).not.toMatch(/takes?\s+\d+\s+(?:business\s+)?(?:days?|weeks?|months?)/i);
    expect(raw).not.toMatch(/\b(?:always|never)\s+(?:liable|taxed|exempt)\b/i);
    expect(raw).not.toMatch(/(?:subsidiary|branch)\s+(?:guarantees?|ensures?)\b/i);
    expect(raw).not.toMatch(/[\p{Script=Hangul}\p{Script=Hiragana}\p{Script=Katakana}]/u);
    expect(raw.replace(author, '')).not.toMatch(/\p{Script=Han}/u);
    expect(raw).not.toMatch(/[\u202A-\u202E\u2066-\u2069]/u);
  });
});
