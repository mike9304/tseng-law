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
  'A branch is part of a foreign company and therefore has no shareholders of its own. To invest jointly with a third party in a Taiwan business, the parties should consider options such as forming a Taiwan subsidiary and determining its shareholder structure. Liability, voting rights, financing, licenses and permits, and tax treatment must be assessed in light of the investment relationship and business plan.';
const faq2Answer =
  'Subsidiaries and branches are generally subject to 5% business tax and 20% profit-seeking enterprise income tax. Under Taiwan domestic law, dividends paid by a Taiwan subsidiary to a foreign parent are subject to 21% withholding, but the ceiling is 10% if the requirements of the Taiwan–Korea Income Tax Agreement are met. A foreign company’s Taiwan branch generally incurs no additional withholding when it remits after-tax profits to its head office because the remittance is not a dividend. A profit-seeking enterprise whose head office is outside Taiwan is exempt from filing the return for the 5% additional tax on undistributed earnings.';
const faq3Answer =
  'A branch is not an independent issuer and cannot itself be listed in Taiwan. For a subsidiary to be listed, it must satisfy the applicable requirements of the Company Act and the stock exchange. Tax incentives are not determined solely by organizational form. An investment tax credit under Article 10-1 of the Statute for Industrial Innovation requires a separate review of the qualifying investment, filing deadline, credit method, restrictions on duplicate benefits, and tax credit limits.';
const disclaimer =
  'This article is educational material intended to explain the general differences between a Taiwan subsidiary and a branch of a foreign company; it is not legal or tax advice for any specific matter. The applicable laws and tax treatment may vary according to the locations of the investor and head office, the nature of the business, transactions and cash flows, eligibility under the Agreement, and current practice of the competent authorities. The latest official materials and the circumstances of the particular matter should therefore be checked before establishing or funding an entity, entering into a contract, declaring a dividend, or making a remittance.';
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
  'Nor does a Taiwan subsidiary automatically become eligible for listing merely because it exists. A listing plan first requires an eligible form of issuer and compliance with the standards of the applicable Taiwan Stock Exchange market. All applicable requirements must be prepared for, including operating history, capital, profitability, share distribution, corporate governance, internal controls, audit, and disclosure. Industry rules, foreign-investment restrictions, group reorganization, and shareholder composition may also affect the listing plan.';
const articleTenOneParagraph =
  'Current Article 10-1 of the Statute for Industrial Innovation applies to certain investments made from January 1, 2025, through December 31, 2029. A company or limited partnership that invests at least NT$1 million and no more than NT$2 billion in the same taxable year may consider claiming the credit, subject to the statutory requirements and approval process. The investor must acquire the qualifying assets for its own use, and whether they are new and actually used must also be verified.';
const treatyParagraph =
  'The Taiwan–Korea Income Tax Agreement was signed on November 17, 2021, entered into force on December 27, 2023, and has applied since January 1, 2024. The Agreement coordinates double taxation of residents of the two territories, but it does not automatically exempt all Taiwan-source income. The type of income, beneficial ownership, residence, effective connection to a permanent establishment, and domestic procedures must each be considered.';
const branchExitParagraph =
  'If the branch of a foreign company ceases operations in Taiwan, it must apply to cancel its branch registration under Article 378 of the Company Act. Debts and tax, employment, contractual, and regulatory obligations arising before the application do not, however, disappear merely because an application is filed. Settlement with business counterparties, termination of employment, collection of receivables, disposal of assets, tax filings, and closure of bank accounts should be carried out in the proper sequence.';

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
      read_time: '28 min read',
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
      readTime: '28 min read',
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
      parsed.content.indexOf('entire life cycle of the business into account.'),
    );
    expect(parsed.content.indexOf(inlineImage)).toBeLessThan(
      parsed.content.indexOf('A Taiwan subsidiary is an independent legal entity'),
    );
    expect(raw.split(featuredImage)).toHaveLength(3);
    expect(raw.split(inlineImage)).toHaveLength(2);
  });

  it('uses exactly the nine ordered H2 sections', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual([
      '1. Legal Personality and Ownership Structure',
      '2. Tax and Profit Remittances',
      '3. Debts and Legal Liability',
      '4. Financing and Listing in Taiwan',
      '5. Investment Tax Credits',
      '6. The Taiwan–Korea Income Tax Agreement and Permanent Establishments (PEs)',
      '7. Choosing a Structure',
      'Official Sources',
      'Related Services',
    ]);
  });

  it('repeats every exact FAQ answer first after its assigned H2 and exactly twice', () => {
    const headingAnswers = [
      ['## 1. Legal Personality and Ownership Structure', faq1Answer],
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
      'Article 1 of Taiwan’s Company Act defines a company as a corporate juristic person organized, registered, and established under the Act for the purpose of profit making.',
      'A Taiwan subsidiary established under the Act is therefore a Taiwan legal entity distinct from its foreign parent.',
      'The subsidiary can lease an office, enter into commercial and employment contracts, acquire property, and become a party to litigation in its own name.',
      'under Article 99(1) of the Company Act, the shareholder of a limited company is generally liable to the company only up to the amount of the shareholder’s contribution',
      'Article 99(2), however, creates an exception when a shareholder abuses the company’s status as a juristic person',
      'If a shareholder or parent company has separately provided a guarantee or directly participated in a tort, liability arising from that guarantee or conduct must also be considered.',
      'Under Article 371 of the Company Act, a foreign company may not conduct business in Taiwan in the foreign company’s name without registering a branch.',
      'Article 372 requires the foreign company to appropriate funds exclusively for the operation of its Taiwan branch and to designate a responsible person in Taiwan.',
      'These are head-office funds for Taiwan operations, not shares or equity interests in the branch.',
      'Branch contracts and debts belong to the foreign company',
      'Part of the foreign head office, without separate legal personality',
      branchExitParagraph,
      'Under Article 379 of the Company Act, cancellation of a branch registration does not affect creditors’ rights or the foreign company’s obligations.',
      'Article 380 of the Company Act requires liquidation of the rights and obligations arising from its Taiwan operations and branches.',
      'Because a Taiwan subsidiary is an independent legal entity, it follows the dissolution and liquidation procedures under the Company Act rather than the cancellation procedure for the branch of a foreign company.',
      'The termination procedures and work required for the two structures should not be treated as the same.',
    ];

    for (const proposition of requiredPropositions) {
      expect(parsed.content).toContain(proposition);
      expect(post?.content).toContain(proposition);
    }
  });

  it('locks qualified business-tax, income-tax, withholding, and remittance rules', () => {
    const requiredPropositions = [
      'The general rate is 5%, and the usual tax period is two months.',
      'zero-rating, exemptions, special rates, and eligibility for input tax credits may vary according to the nature of the transaction',
      'The general rate is 20% when taxable income exceeds the statutory threshold.',
      'It is not a tax calculated by simply multiplying gross revenue by 20%',
      'Under Taiwan domestic law, dividends paid to a foreign shareholder are subject to a 21% withholding rate.',
      'the Agreement’s 10% ceiling may be considered',
      'Current practice should be checked for the residence certificate, beneficial-ownership analysis, timing of payment and filing, and any required application or refund procedure.',
      'remitting the branch’s after-tax profits to the head office is distinct from paying a dividend',
      'generally incurs no additional dividend withholding at the branch level',
      'interest, royalties, service fees, payment for assets, or a payment to a third party',
      'a profit-seeking enterprise whose head office is outside Taiwan is exempt from filing the relevant undistributed-earnings return',
      'Transfer-pricing principles may apply to transactions between a subsidiary and its parent and to the allocation of expenses between a branch and its head office.',
      'foreign tax credits, dividends from a foreign subsidiary, branch income and losses, consolidated or separate accounting treatment, and foreign-exchange filings',
      'It is therefore not possible to conclude in advance that choosing a branch will reduce the parent company’s tax burden in Korea.',
    ];

    for (const proposition of requiredPropositions) {
      expect(parsed.content).toContain(proposition);
      expect(post?.content).toContain(proposition);
    }
  });

  it('locks liability qualifications, financing distinctions, and listing requirements', () => {
    const requiredPropositions = [
      'Under the principle in Article 99 of the Company Act, shareholders of a limited company are liable up to the amount of their contributions, while shareholders of a company limited by shares are generally liable, under the rules applicable to that company form, up to the value of the shares for which they have subscribed.',
      'If a bank or landlord requires a parent guarantee, the parent may be liable under the guarantee.',
      'The same applies if the parent directly assumes the subsidiary’s contract or signs as a joint party.',
      'A statutory exception may arise if company and shareholder property are not kept separate or if legal personality is abused in order to harm creditors.',
      'Forming a subsidiary does not, however, shield the parent company from every risk.',
      'A branch has no shares or equity interests of its own and therefore cannot issue them to third parties to make those parties shareholders of the branch.',
      'Funds needed for Taiwan operations may be obtained through funds appropriated by the head office, support from the head office, or lawful borrowing.',
      'Depending on the company form selected and the statutory procedures, a Taiwan subsidiary may use structures involving the issuance of shares or an increase in capital contributions.',
      'Each method remains subject to the Company Act, investment regulation, the articles of incorporation, and restrictions in shareholder agreements.',
      listingParagraph,
      'All applicable requirements must be prepared for, including operating history, capital, profitability, share distribution, corporate governance, internal controls, audit, and disclosure.',
      'Industry rules, foreign-investment restrictions, group reorganization, and shareholder composition may also affect the listing plan.',
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
      'Qualifying fields include new smart machinery, 5G systems, cybersecurity products or services, artificial-intelligence products or services, and hardware, software, technology, or technical services related to energy conservation or carbon reduction.',
      'a taxpayer may consider crediting up to 5% of the investment amount against profit-seeking enterprise income tax for the current taxable year, or crediting up to 3% of the investment amount in each of three years',
      'The annual credit under Article 10-1 may not exceed 30% of the profit-seeking enterprise income tax for that year.',
      'Separate incentives for research and development activities may fall under Article 10 of the Statute for Industrial Innovation or other provisions.',
      'Whether a branch may apply or a subsidiary satisfies the requirements depends on the eligible applicant defined by the relevant laws and the actual investment relationship.',
      'Benefits are not assured merely because the investor is a subsidiary, nor can it be assumed that a branch is excluded from all tax incentives merely because it is a branch.',
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
      'Under the Agreement, the ceiling rates for dividends, interest, and royalties are each 10%.',
      'Business profits are generally exempt in the other territory if an enterprise of one territory has no permanent establishment (PE) there under the Agreement.',
      'A construction site, construction, assembly, or installation project, or related supervisory activity may create a construction PE if it lasts more than six months.',
      'A service PE may arise if an enterprise provides services through employees or other personnel for more than 183 aggregate days in any twelve-month period.',
      'The activities of an agent who repeatedly exercises authority to conclude contracts on behalf of an enterprise may also constitute an agency PE.',
      'The fact that services are provided for 183 days or fewer does not establish that there is no fixed place such as a place of management or office',
      'a construction period of six months or less does not eliminate the possibility of an agency PE',
      'the mere fact that it is the subsidiary of a foreign parent does not immediately make it the parent’s permanent establishment in Taiwan',
      'Corporate registration and the nexus for taxation under the Agreement are each assessed under their own requirements.',
    ];
    for (const proposition of requiredPropositions) {
      expect(parsed.content).toContain(proposition);
      expect(post?.content).toContain(proposition);
    }
  });

  it('keeps every required selection, implementation, and exit-planning topic', () => {
    const selectionSection =
      parsed.content
        .split('## 7. Choosing a Structure')[1]
        ?.split('## Official Sources')[0] ?? '';
    const checklistLabels = [
      'who the investors will be',
      'the extent to which the foreign head office or parent company',
      'which entity will hold customer contracts',
      'where revenue and expenses will be recognized',
      'how to prepare materials for investment approval',
      'how to manage accounting records',
      'whether capital increases, local partners',
      'who will handle termination of contracts',
    ];
    const requiredPlanningTerms = [
      'voting rights and authority over key matters',
      'contractual and legal liability',
      'employment relationships, intellectual property, business premises, and licenses and permits',
      'retained earnings, dividends, or head-office remittances',
      'bank accounts, inward remittances, foreign exchange, and outbound remittances',
      'audits, transfer-pricing documentation, Korean filings, and foreign tax credits',
      'employee equity compensation, a listing, mergers or reorganizations, and equity transfers',
      'employment matters, tax filings, asset disposal, and exit procedures',
    ];

    expect(Array.from(selectionSection.matchAll(/^- /gm))).toHaveLength(8);
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
    expect(visibleWords).toBe(5_493);
    expect(calculatedMinutes).toBe(28);
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
    expect(raw).not.toContain('曾俊瑋');
    expect(raw.replace(author, '')).not.toMatch(/\p{Script=Han}/u);
    expect(raw).not.toMatch(/[\u202A-\u202E\u2066-\u2069]/u);
  });
});
