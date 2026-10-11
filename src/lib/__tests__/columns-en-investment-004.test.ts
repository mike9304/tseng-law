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
const faq1Lead =
  'Can a Taiwanese individual or a Taiwan entity become a shareholder in a Taiwan branch? Neither can.';
const disclaimer =
  'This article is educational material that explains the general differences between a Taiwan subsidiary and a branch of a foreign company. It is not legal or tax advice for any specific matter. The applicable laws and tax treatment may vary according to the locations of the investor and head office, the nature of the business, transactions and cash flows, eligibility under the Agreement, and current practice of the competent authorities. Before establishing or funding an entity, entering into a contract, declaring a dividend, or making a remittance, the latest official materials and the circumstances of the particular matter should be checked.';
const author = 'Wei Tseng (曾雋崴), Taiwan Attorney';

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
  '[Laws & Regulations Database — Article 10 of the Value-Added and Non-Value-Added Business Tax Act](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340080&flno=10)',
  '[Laws & Regulations Database — Article 3 of the Standards of Withholding Rates for Various Incomes](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340028&flno=3)',
  '[Laws & Regulations Database — Article 4 of the Standards of Withholding Rates for Various Incomes](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340028&flno=4)',
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
  '[Taiwan Investment and Company Formation Services](/en/services/investment)',
  '[Taiwan Company Formation Basics](/en/columns/taiwan-company-establishment-basics)',
  '[Contact Our Office](/en/contact)',
];

const listingParagraph =
  'Existence alone does not make a Taiwan subsidiary eligible for listing. To be listed, it must satisfy the applicable requirements of the Company Act and the stock exchange. A listing plan first requires an eligible form of issuer and compliance with the standards of the applicable Taiwan Stock Exchange market. All applicable requirements must be prepared for, including operating history, capital, profitability, share distribution, corporate governance, internal controls, audit, and disclosure. Industry rules, foreign-investment restrictions, group reorganization, and shareholder composition may also affect the listing plan.';
const articleTenOneParagraph =
  'Current Article 10-1 of the Statute for Industrial Innovation applies to certain investments made from January 1, 2025, through December 31, 2029. A company or limited partnership that invests at least NT$1 million and no more than NT$2 billion in the same taxable year may consider claiming the credit, subject to the statutory requirements and approval process. The investor must acquire the qualifying assets for its own use. Whether they are new and actually used must also be verified.';
const treatyParagraph =
  'Signed on November 17, 2021, the Taiwan–Korea Income Tax Agreement entered into force on December 27, 2023. It has applied since January 1, 2024. The Agreement coordinates double taxation of residents of the two territories. It does not automatically exempt all Taiwan-source income. The type of income, beneficial ownership, residence, effective connection to a permanent establishment, and domestic procedures must each be considered.';
const branchExitParagraph =
  'If the branch of a foreign company ceases operations in Taiwan, it must apply to cancel its branch registration under Article 378 of the Company Act. Debts and tax, employment, contractual, and regulatory obligations arising before the application do not disappear because an application is filed. Settlement with business counterparties, termination of employment, collection of receivables, disposal of assets, tax filings, and closure of bank accounts should be carried out in the proper sequence.';

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
      seoTitle: 'Taiwan Subsidiary vs Branch: Key Differences',
      url: 'https://www.wei-wei-lawyer.com/post/taiwan-company-subsidiary-vs-branch',
      lastmod: '2026-10-12',
      date_display: 'September 13, 2025',
      read_time: '27 min read',
      categories: ['Taiwan Company Formation'],
      featured_image: featuredImage,
      summary:
        'A Taiwan subsidiary is a separate legal entity, but a branch is part of the foreign head office. Contracts, liability, tax, and profit remittance differ.',
      faq,
    });
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(post).toMatchObject({
      slug: 'taiwan-company-subsidiary-vs-branch',
      title,
      date: '2026-10-12',
      dateDisplay: 'September 13, 2025',
      readTime: '27 min read',
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

  it('uses exactly the ten ordered H2 sections', () => {
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
      '8. Conversion and Exit Procedures',
      'Official Sources',
      'Related Services',
    ]);
  });

  it('repeats the FAQ 1 answer after its assigned H2 exactly twice and anchors the FAQ 2 and 3 facts in the body', () => {
    const heading = '## 1. Legal Personality and Ownership Structure';

    expect(firstParagraphAfter(parsed.content, heading)).toBe(
      `${faq1Lead} ${faq1Answer}`,
    );
    expect(firstParagraphAfter(post?.content ?? '', heading)).toBe(
      `${faq1Lead} ${faq1Answer}`,
    );
    expect(raw.split(faq1Answer)).toHaveLength(3);

    const faq2Lead =
      'Subsidiaries and branches are generally subject to the same two rates: 5% business tax and 20% profit-seeking enterprise income tax.';
    expect(
      firstParagraphAfter(parsed.content, '## 2. Tax and Profit Remittances'),
    ).toContain(faq2Lead);
    expect(
      firstParagraphAfter(post?.content ?? '', '## 2. Tax and Profit Remittances'),
    ).toContain(faq2Lead);

    const faq3Anchors = [
      'The branch itself cannot be listed on Taiwan’s securities market.',
      'To be listed, it must satisfy the applicable requirements of the Company Act and the stock exchange.',
      'Tax incentives are not uniformly determined by the organizational label of a Taiwan subsidiary or branch.',
      'The taxpayer’s eligibility, the actual investment, the amount, the condition and intended use of the assets, investment timing, filing deadline, approval process, credit method, tax credit limits, and restrictions on combining the credit with other benefits must all be checked.',
    ];
    for (const anchor of faq3Anchors) {
      expect(parsed.content).toContain(anchor);
      expect(post?.content).toContain(anchor);
    }
  });

  it('locks the Company Act identity, shareholder, branch-funding, and exit propositions', () => {
    const requiredPropositions = [
      'Taiwan’s Company Act defines a company in Article 1 as a corporate juristic person organized, registered, and established under the Act for the purpose of profit making.',
      'A subsidiary established under the Act is therefore a Taiwan legal entity distinct from its foreign parent.',
      'In its own name it can lease an office, enter into commercial and employment contracts, acquire property, and become a party to litigation.',
      'Take a limited company. Its shareholder is generally liable to the company only up to the amount of the shareholder’s contribution (Company Act, Article 99(1)).',
      'Article 99(2) creates an exception. When a shareholder abuses the company’s status as a juristic person',
      'If a shareholder or parent company has separately provided a guarantee or directly participated in a tort, liability arising from that guarantee or conduct must also be considered.',
      'Without registering a branch, it may not conduct business in Taiwan in the foreign company’s name (Article 371).',
      'Article 372 imposes two requirements. The foreign company must appropriate funds exclusively for the operation of its Taiwan branch and designate a responsible person in Taiwan.',
      'These are head-office funds for Taiwan operations. They are not shares or equity interests in the branch.',
      'Branch contracts and debts belong to the foreign company',
      'Part of the foreign head office, without separate legal personality',
      branchExitParagraph,
      'Where the competent authority cancels a branch registration under Article 379(1) of the Company Act, Article 379(2) provides that the cancellation does not affect creditors’ rights or the foreign company’s obligations.',
      'Article 380 of the Company Act requires liquidation of the rights and obligations arising from its Taiwan operations and branches.',
      'Dissolution and liquidation under the Company Act are the procedures a Taiwan subsidiary follows, because it is an independent legal entity. The cancellation procedure for the branch of a foreign company does not apply to it.',
      'The termination procedures and work required for the two structures should not be treated as the same.',
    ];

    for (const proposition of requiredPropositions) {
      expect(parsed.content).toContain(proposition);
      expect(post?.content).toContain(proposition);
    }
  });

  it('locks qualified business-tax, income-tax, withholding, and remittance rules', () => {
    const requiredPropositions = [
      'The general rate is 5%. The usual tax period is two months.',
      'Zero-rating, exemptions, special rates, and eligibility for input tax credits may vary according to the nature of the transaction',
      'The general rate is 20% when taxable income exceeds the statutory threshold.',
      'The tax is not simply gross revenue multiplied by 20%.',
      'Taiwan domestic law applies a 21% withholding rate to dividends paid to a foreign shareholder.',
      'the Agreement’s 10% ceiling may be considered',
      'Current practice should be checked for the residence certificate, beneficial-ownership analysis, timing of payment and filing, and any required application or refund procedure.',
      'remitting the branch’s after-tax profits to the head office is therefore distinct from paying a dividend',
      'generally incurs no additional dividend withholding at the branch level',
      'interest, royalties, service fees, payment for assets, or a payment to a third party',
      'a profit-seeking enterprise whose head office is outside Taiwan is exempt from filing the relevant undistributed-earnings return',
      'Transfer-pricing principles may apply to transactions between a subsidiary and its parent and to the allocation of expenses between a branch and its head office.',
      'foreign tax credits, dividends from a foreign subsidiary, branch income and losses, consolidated or separate accounting treatment, and foreign-exchange filings',
      'So it is not possible to conclude in advance that choosing a branch will reduce the parent company’s tax burden in Korea.',
    ];

    for (const proposition of requiredPropositions) {
      expect(parsed.content).toContain(proposition);
      expect(post?.content).toContain(proposition);
    }
  });

  it('locks liability qualifications, financing distinctions, and listing requirements', () => {
    const requiredPropositions = [
      'Under the principle in Article 99 of the Company Act, shareholders of a limited company are liable up to the amount of their contributions. Shareholders of a company limited by shares are generally liable, under the rules applicable to that company form, up to the value of the shares for which they have subscribed.',
      'If a bank or landlord requires a parent guarantee, the parent may be liable under the guarantee.',
      'The same applies if the parent directly assumes the subsidiary’s contract or signs as a joint party.',
      'A statutory exception may arise if company and shareholder property are not kept separate or if legal personality is abused in order to harm creditors.',
      'Does forming a subsidiary shield the parent company from every risk? It does not.',
      'A branch has no shares or equity interests of its own. It therefore cannot issue them to third parties and make those parties its shareholders.',
      'Funds for Taiwan operations may come from funds appropriated by the head office, support from the head office, or lawful borrowing.',
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
      'A taxpayer may consider crediting up to 5% of the investment amount against profit-seeking enterprise income tax for the current taxable year, or crediting up to 3% of the investment amount in each of three years',
      'The annual credit under Article 10-1 may not exceed 30% of the profit-seeking enterprise income tax for that year.',
      'Research and development activities have separate incentives, which may fall under Article 10 of the Statute for Industrial Innovation or other provisions.',
      'Whether a branch may apply, or a subsidiary satisfies the requirements, depends on the eligible applicant defined by the relevant laws and the actual investment relationship.',
      'Being a subsidiary does not assure the benefits. Being a branch does not mean exclusion from all tax incentives.',
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
      'Dividends, interest, and royalties each have a ceiling rate of 10% under the Agreement.',
      'Business profits are generally exempt in the other territory if an enterprise of one territory has no permanent establishment (PE) there under the Agreement.',
      'A construction site, construction, assembly, or installation project, or related supervisory activity may create a construction PE if it lasts more than six months.',
      'A service PE may arise if an enterprise provides services through employees or other personnel for more than 183 aggregate days in any twelve-month period.',
      'There is also the agency PE. It may arise from the activities of an agent who repeatedly exercises authority to conclude contracts on behalf of an enterprise.',
      'Services provided for 183 days or fewer do not establish that there is no fixed place such as a place of management or office',
      'A construction period of six months or less does not eliminate the possibility of an agency PE',
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
        ?.split('## 8. Conversion and Exit Procedures')[0] ?? '';
    const exitSection =
      parsed.content
        .split('## 8. Conversion and Exit Procedures')[1]
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
    expect(exitSection).toContain(branchExitParagraph);
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
    expect(visibleWords).toBe(5_329);
    expect(calculatedMinutes).toBe(27);
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
