import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-en/001-taiwan-company-establishment-basics.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('taiwan-company-establishment-basics', 'en');
const aliasPost = getColumnPost('company-basics', 'en');

const title =
  'Setting Up a Company in Taiwan: Subsidiaries, Branches, Representative Offices, Procedures, and Work Permits';
const entityFaqAnswer =
  'A Taiwan subsidiary (limited company or company limited by shares) is a separate legal entity under Taiwan law. A Taiwan branch of a foreign company is not a separate legal entity; it operates in Taiwan as part of the foreign company. A representative office may not conduct profit-making business in Taiwan; its activities are limited to liaison work and legal acts on behalf of the foreign company. Liability, tax treatment, licensing requirements, and eligibility for government procurement must be evaluated based on the chosen structure and the circumstances.';
const residenceFaqAnswer =
  'Forming a company does not by itself confer work authorization or residence status. A foreign national who will manage or operate a business in Taiwan must meet the applicable work-permit requirements concerning the proposed role, the investment relationship, and the employer’s business performance, and must separately apply for an Alien Resident Certificate (ARC) appropriate to the purpose of residence after obtaining the work permit.';
const capitalFaqAnswer =
  'Taiwan does not impose a generally applicable statutory minimum capital requirement for company formation. Industry-specific laws may require separate capital or security deposits, and a bank may independently review the business plan and transaction risks. For a foreign manager’s work permit, a company or branch established for less than one year generally must meet at least one of four employer thresholds (paid-in capital or Taiwan working capital of at least NT$500,000, or specified revenue, import-export, or agency-commission levels), unless the same employer hires more than one person through this route, in which case the general standards apply instead.';

// The FAQ answers are no longer copied into the body; the body states the same rules in its own paragraphs.
const residenceBodyParagraph =
  'Forming a company does not by itself confer work authorization or residence status. Work-permit review may consider the applicant’s duties and qualifications, role in the company, investment relationship, the employer’s business performance, and the submitted materials as a whole. Even after a work permit is granted, an ARC must be applied for separately in accordance with the purpose of residence, and the validity period and renewal requirements of each authorization must be confirmed from the relevant disposition and the law in effect at the time.';
const capitalIntroParagraph =
  'Taiwan does not impose a generally applicable statutory minimum capital requirement for company formation. Industry-specific laws may require separate capital or security deposits, and a bank may independently review the business plan and transaction risks. The foreign-manager work-permit category for a foreign-invested business covers, among others, the manager (經理人) of a company in which overseas Chinese or foreign investors collectively hold more than one-third of the issued shares or total capital, the manager of a Taiwan branch of a foreign company, and the representative of a representative office. A representative office established for at least one year must have a record of activities in Taiwan. This requirement is waived if it has been established for less than one year.';
const newEmployerThresholds = `For a company or branch established for less than one year, the employer generally must satisfy at least one of the following:

- Paid-in capital or Taiwan working capital of at least NT$500,000
- Revenue of at least NT$3 million
- Import-export performance of at least US$500,000
- Agency commissions of at least US$200,000`;
const establishedEmployerThresholds = `For a company or branch established for at least one year, the employer generally must satisfy at least one of the following, measured by the most recent year in Taiwan or the average of the preceding three years:

- Revenue of at least NT$3 million
- Import-export performance of at least US$500,000
- Agency commissions of at least US$200,000`;
const article38Paragraph =
  'Special approval may be available where the business makes a substantial contribution to Taiwan’s economic development or special circumstances exist. The figures above are employer-qualification requirements for a foreign manager’s work permit, not a universally applicable minimum capital requirement for company formation. Satisfying the thresholds above also does not result in the automatic issuance of a work permit. If the same employer hires more than one person through this route, the foreign national’s, the employer’s, and other qualifications must meet the general requirements in Chapter 2 instead (Qualifications and Criteria Standards for Foreigners Undertaking Jobs under Article 46, Paragraph 1, Subparagraphs 1 to 6 of the Employment Service Act, Article 38(2)).';

const faq = [
  {
    q: 'What is the difference between a subsidiary, branch, and representative office when establishing a business in Taiwan?',
    a: entityFaqAnswer,
  },
  {
    q: 'Does forming a company automatically qualify me for a Taiwan work permit or residence?',
    a: residenceFaqAnswer,
  },
  {
    q: 'Is minimum capital required for a work permit and Alien Resident Certificate (ARC)?',
    a: capitalFaqAnswer,
  },
];

const officialSources = [
  'https://law.moea.gov.tw/EngLawContent.aspx?id=10484&lan=E',
  'https://mnscdn.moea.gov.tw/Mns/dir/content/Content.aspx?menu_id=42885',
  'https://gcis.nat.gov.tw/mainNew/English/index.jsp',
  'https://ws.wda.gov.tw/Download.ashx?n=VGhlIERpcmVjdG9yIG9yIE1hbmFnZXIgb2YgYW4gQXBwcm92ZWQgQnVzaW5lc3MgSW52ZXN0ZWQgb3IgRXN0YWJsaXNoZWQgYnkgT3ZlcnNlYXMgQ2hpbmVzZSBvciBGb3JlaWduZXIocykoU09QIE1hbnVhbCkucGRm&u=LzAwMS9VcGxvYWQvMzIxL3JlbGZpbGUvMC8yNTE1LzUzMWMyZTM0LTI1NmYtNGI5MC1iMzAzLTEzNWI4MTQxYTk5MC5wZGY%3D',
  'https://www.mof.gov.tw/eng/singlehtml/f48d641f159a4866b1d31c0916fbcc71?cntId=e1e57a4211474ff9b5d63a83b30dcf10',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340080&flno=10',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340028&flno=3',
  'https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/business-tax/collection-prcedure/oVL9pwM',
  'https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/profit-seeking-enterprise-income-tax/file-payment/62nOrYR',
  'https://www.etax.nat.gov.tw/etwmain/alien-tax-service/alien-tax-faq/KK9Y76o',
  'https://www.immigration.gov.tw/5475/5478/141465/141808/411648/cp_news',
  'https://www.businesslocationinfo.gov.taipei/BLBQS/Home/Notice',
];

const officialSourceLinks = [
  `[Taiwan MOEA — Foreign-Investment Law (English)](${officialSources[0]})`,
  `[Taiwan MOEA — Foreign-Investment Procedures](${officialSources[1]})`,
  `[Taiwan MOEA Administration of Commerce — Company and Business Registration](${officialSources[2]})`,
  `[Taiwan Workforce Development Agency — Work Permit Manual for Managers of Foreign-Invested Businesses](${officialSources[3]})`,
  `[Taiwan Ministry of Finance — Taiwan–Korea Income Tax Agreement](${officialSources[4]})`,
  `[Value-added and Non-value-added Business Tax Act, Article 10 (statutory range 5%-10%; the applied rate is set by the Executive Yuan)](${officialSources[5]})`,
  `[Standards of Withholding Rates for Various Incomes, Article 3 (withholding on dividends)](${officialSources[6]})`,
  `[Taiwan Tax Portal — Business Tax Filing Cycle](${officialSources[7]})`,
  `[Taiwan Tax Portal — Profit-Seeking Enterprise Income Tax Rate](${officialSources[8]})`,
  `[Taiwan Tax Portal — Taxation of Dividends Paid to Foreign Nationals](${officialSources[9]})`,
  `[Taiwan National Immigration Agency — Permanent Residence Guidance](${officialSources[10]})`,
  `[Taipei City — Advance Inquiry for Business Premises](${officialSources[11]})`,
];

const imagePaths = [
  '../images/001-taiwan-company-establishment-basics/featured-01.jpg',
  '../images/001-taiwan-company-establishment-basics/img-01.jpg',
  '../images/001-taiwan-company-establishment-basics/img-02.jpg',
  '../images/001-taiwan-company-establishment-basics/img-03.jpg',
  '../images/001-taiwan-company-establishment-basics/img-04.jpg',
];

const inlineColumnLinks = [
  '[When comparing organizational forms](/en/columns/taiwan-company-subsidiary-vs-branch)',
  '[advance inquiry for business premises](/en/columns/taiwan-company-setup-pitch-location)',
  '[permanent residence](/en/columns/taiwan-permanent-residence-aprc)',
];
const internalLinks = [
  '[Taiwan Investment and Company Formation Services](/en/services/investment)',
  '[Wei Tseng’s Profile](/en/lawyers/wei-tseng)',
  '[Contact Our Office](/en/contact)',
];
const relatedServicesParagraph =
  '[Taiwan Investment and Company Formation Services](/en/services/investment) describes the scope of our related services, and [Wei Tseng’s Profile](/en/lawyers/wei-tseng) provides information about the responsible attorney’s experience and languages. For advice on a specific matter, please use [Contact Our Office](/en/contact).';

const taxParagraph =
  'Taiwan’s general business tax rate is 5%, and returns are generally filed every two months. The general profit-seeking enterprise income tax rate is 20%, although actual liability depends on taxable income and the applicable rules. Under Taiwan domestic law, dividends paid to a nonresident are generally subject to withholding at 21%.';
const treatyParagraph =
  'The Taiwan–Korea Income Tax Agreement entered into force on December 27, 2023, and applies from January 1, 2024. When the requirements for applying the agreement are met, the maximum source-country rate for dividends, interest, and royalties is 10% in each case. This treaty discussion applies to a Korean-related fact pattern that meets the agreement’s conditions. It is not a worldwide investor rule. The treaty’s reduced rates do not apply automatically merely because the treaty exists. The taxpayer must confirm whether it is a resident under the treaty, whether it is the beneficial owner, the legal character of the income, and the certificate of residence and application documents that must be submitted. The transaction structure, contracts, invoices, actual work, and payment flows should be kept consistent, and filing deadlines and the retention of supporting records should be reviewed separately.';
const disclaimer =
  'This article is an educational resource providing a general overview of Taiwan company formation and related rules, and it is not legal or tax advice for any specific matter. Because the required procedures and outcomes may vary with the investment structure, industry, the applicant’s nationality and immigration status, and current agency practice, confirm the latest official sources and the circumstances of the individual matter before investing, entering into a contract, or employing personnel.';

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
    visibleText.match(/[A-Za-z0-9]+(?:[.’-][A-Za-z0-9]+)*/g)?.length ?? 0
  );
}

describe('English investment column 001 — company-formation basics', () => {
  it('publishes the exact metadata, H1, and three contracted FAQs', () => {
    expect(parsed.data.title).toBe(title);
    expect(parsed.data.url).toBe(
      'https://www.wei-wei-lawyer.com/post/taiwan-company-establishment-basics',
    );
    expect(parsed.data.lastmod).toBe('2026-10-06');
    expect(parsed.data.date_display).toBe('September 13, 2025');
    expect(parsed.data.categories).toEqual(['Taiwan Company Formation']);
    expect(parsed.data.featured_image).toBe(imagePaths[0]);
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(parsed.data.faq).toEqual(faq);
    expect(parsed.data.faq).toHaveLength(3);

    expect(post).toBeTruthy();
    expect(post?.slug).toBe('taiwan-company-establishment-basics');
    expect(post?.title).toBe(title);
    expect(post?.date).toBe('2026-10-06');
    expect(post?.dateDisplay).toBe('September 13, 2025');
    expect(post?.category).toBe('formation');
    expect(post?.categoryLabel).toBe('Company Setup');
    expect(post?.featuredImage).toBe(
      '/images/blog/001-taiwan-company-establishment-basics/featured-01.jpg',
    );
    expect(post?.faq).toEqual(faq);
  });

  it('keeps each FAQ answer in the front matter only, with its rules stated in the body', () => {
    for (const answer of [entityFaqAnswer, residenceFaqAnswer, capitalFaqAnswer]) {
      expect(parsed.content).not.toContain(answer);
      expect(post?.content ?? '').not.toContain(answer);
    }

    for (const content of [parsed.content, post?.content ?? '']) {
      expect(
        firstParagraphAfter(
          content,
          '### Company Formation, Work Authorization, and Residence',
        ),
      ).toBe(residenceBodyParagraph);
      expect(
        firstParagraphAfter(
          content,
          '### Company Capital and Work Permits for Foreign Managers',
        ),
      ).toBe(capitalIntroParagraph);
      expect(content).toContain(newEmployerThresholds);
      expect(content).toContain(establishedEmployerThresholds);
      expect(content.split('\n\n')).toContain(article38Paragraph);
    }
  });

  it('uses exactly the five numbered H2s and two contracted section-four H3s', () => {
    expect(
      Array.from(
        parsed.content.matchAll(/^## (\d+)\. (.+)$/gm),
        (match) => [match[1], match[2]],
      ),
    ).toEqual([
      [
        '1',
        'Choosing a Taiwan Presence: Subsidiary, Branch, or Representative Office',
      ],
      ['2', 'Key Steps in Forming a Taiwan Subsidiary'],
      ['3', 'Checking Business Activities and Premises Before Formation'],
      ['4', 'Work Permits, Residence, and Capital'],
      ['5', 'Taxes and the Taiwan–Korea Income Tax Agreement'],
    ]);
    expect(
      Array.from(
        parsed.content.matchAll(/^### (.+)$/gm),
        (match) => match[1],
      ),
    ).toEqual([
      'Company Formation, Work Authorization, and Residence',
      'Company Capital and Work Permits for Foreign Managers',
    ]);
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual([
      '1. Choosing a Taiwan Presence: Subsidiary, Branch, or Representative Office',
      '2. Key Steps in Forming a Taiwan Subsidiary',
      '3. Checking Business Activities and Premises Before Formation',
      '4. Work Permits, Residence, and Capital',
      '5. Taxes and the Taiwan–Korea Income Tax Agreement',
      'Official Sources',
    ]);
  });

  it('keeps the qualified ten-step formation overview complete and ordered', () => {
    const processSection = parsed.content
      .split('## 2. Key Steps in Forming a Taiwan Subsidiary')[1]
      ?.split(
        '## 3. Checking Business Activities and Premises Before Formation',
      )[0] ?? '';
    expect(
      Array.from(processSection.matchAll(/^(\d+)\. (.+)$/gm), (match) => [
        match[1],
        match[2],
      ]),
    ).toEqual([
      [
        '1',
        'Preliminary review and reservation of the company’s Chinese name and registered business activities',
      ],
      [
        '2',
        'Notarization or authentication of foreign documents, including powers of attorney, and Taiwan overseas-office authentication where required',
      ],
      [
        '3',
        'Foreign-investment application to the Department of Investment Review, Ministry of Economic Affairs (MOEA), where applicable',
      ],
      ['4', 'Opening a preparatory bank account'],
      ['5', 'Remittance of foreign investment funds'],
      ['6', 'Investment amount verification (投資額審定)'],
      ['7', 'Company registration'],
      ['8', 'Tax registration'],
      [
        '9',
        'Conversion of the preparatory account into a regular company account',
      ],
      [
        '10',
        'Additional import-export, industry-license, work-permit, or residence procedures, where applicable',
      ],
    ]);
    expect(processSection).toContain(
      'The order, necessity, and duration of the procedures vary with the organizational form, investment amount, industry, substance of the review, progress of the bank’s procedures, and any requested corrections.',
    );
    for (const qualification of [
      'organizational form',
      'investment amount',
      'industry',
      'substance of the review',
      'progress of the bank’s procedures',
      'requested corrections',
      'order, necessity, and duration of the procedures',
      'time required to complete these follow-up procedures',
    ]) {
      expect(processSection).toContain(qualification);
    }
  });

  it('states the entity, treaty, PE, licensing, premises, work, and residence qualifications', () => {
    const requiredPhrases = [
      'A branch has no shareholders of its own',
      'the head office bears the branch’s debts and liabilities',
      'It may not engage in business activities such as selling goods or providing services in Taiwan.',
      'The Taiwan–Korea Income Tax Agreement entered into force on December 27, 2023, and applies from January 1, 2024.',
      'maximum source-country rate for dividends, interest, and royalties is 10%',
      'fixed facilities such as a place of management, branch, or office',
      'lasting more than six months',
      'more than 183 aggregate days in any 12-month period',
      'repeatedly exercises authority to conclude contracts',
      'should not be determined from the 183-day figure alone',
      'Passing that review does not mean that a separate license required for the business has already been obtained or that operations may begin immediately at the proposed premises.',
      'prohibited or restricted industries',
      'professional qualifications',
      'land-use classification, building regulations, lease terms, and suitability for tax registration',
      '[advance inquiry for business premises](/en/columns/taiwan-company-setup-pitch-location) (營業場所預先查詢)',
      'For premises in another locality, the company should confirm the procedures of the relevant local government and competent authority',
      'Students may also apply to invest and form a company.',
      'current immigration status permits employment or company management in Taiwan',
      'figures above are employer-qualification requirements for a foreign manager’s work permit, not a universally applicable minimum capital requirement',
      'does not result in the automatic issuance of a work permit',
      'The spouse and minor children of a foreign national who has obtained an ARC',
      'separately apply for dependent residence if they meet the applicable requirements',
      'lawfully resided in Taiwan for five consecutive years and for at least 183 days in each year',
      'conduct, assets or skills',
      'Different calculation rules may apply to foreign professionals and others',
      'If the same employer hires more than one person through this route, the foreign national’s, the employer’s, and other qualifications must meet the general requirements in Chapter 2 instead',
      'Article 38(2)',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks every foreign-manager threshold and the complete tax qualification', () => {
    for (const paragraph of [taxParagraph, treatyParagraph]) {
      expect(parsed.content.split('\n\n')).toContain(paragraph);
      expect(post?.content.split('\n\n')).toContain(paragraph);
    }
    // The treaty facts are stated once.
    expect(countOccurrences(parsed.content, 'December 27, 2023')).toBe(1);
    expect(countOccurrences(parsed.content, 'permanent establishment (PE)')).toBe(1);

    for (const phrase of [
      'more than one-third of the issued shares or total capital',
      'Paid-in capital or Taiwan working capital of at least NT$500,000',
      'Revenue of at least NT$3 million',
      'Import-export performance of at least US$500,000',
      'Agency commissions of at least US$200,000',
      'the most recent year in Taiwan or the average of the preceding three years',
      'A representative office established for at least one year must have a record of activities in Taiwan',
      'waived if it has been established for less than one year',
      'substantial contribution to Taiwan’s economic development',
      'manager (經理人)',
      'general business tax rate is 5%',
      'filed every two months',
      'profit-seeking enterprise income tax rate is 20%',
      'dividends paid to a nonresident are generally subject to withholding at 21%',
      'maximum source-country rate for dividends, interest, and royalties is 10% in each case',
      'whether it is the beneficial owner, the legal character of the income',
      'certificate of residence and application documents that must be submitted',
    ]) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses all twelve official links once and exactly the six English internal links', () => {
    expect(
      parsed.content
        .split('## Official Sources\n\n')[1]
        ?.split(`\n\n${relatedServicesParagraph}`)[0]
        ?.trim()
        .split('\n'),
    ).toEqual(officialSourceLinks.map((link) => `- ${link}`));
    for (const source of officialSources) {
      expect(countOccurrences(raw, source)).toBe(1);
    }

    const bodyInternalLinks = Array.from(
      parsed.content.matchAll(/\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[0],
    );
    expect(bodyInternalLinks).toEqual([...inlineColumnLinks, ...internalLinks]);
    for (const link of [...inlineColumnLinks, ...internalLinks]) {
      expect(post?.content).toContain(link);
    }
  });

  it('preserves exactly five images in their contracted positions', () => {
    expect(
      Array.from(
        parsed.content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g),
        (match) => match[1],
      ),
    ).toEqual(imagePaths);
    expect(parsed.content.indexOf(imagePaths[0])).toBeLessThan(
      parsed.content.indexOf(
        'Completing company registration does not mean that investment-fund verification',
      ),
    );
    expect(parsed.content.indexOf(imagePaths[1])).toBeLessThan(
      parsed.content.indexOf(
        'Completing company registration does not mean that investment-fund verification',
      ),
    );
    expect(parsed.content.indexOf(imagePaths[2])).toBeGreaterThan(
      parsed.content.indexOf('## 1. Choosing a Taiwan Presence'),
    );
    expect(parsed.content.indexOf(imagePaths[2])).toBeLessThan(
      parsed.content.indexOf('## 2. Key Steps'),
    );
    expect(parsed.content.indexOf(imagePaths[3])).toBeGreaterThan(
      parsed.content.indexOf('## 2. Key Steps'),
    );
    expect(parsed.content.indexOf(imagePaths[3])).toBeLessThan(
      parsed.content.indexOf('## 3. Checking Business Activities'),
    );
    expect(parsed.content.indexOf(imagePaths[4])).toBeGreaterThan(
      parsed.content.indexOf('## 4. Work Permits'),
    );
    expect(parsed.content.indexOf(imagePaths[4])).toBeLessThan(
      parsed.content.indexOf('## 5. Taxes'),
    );
  });

  it('ends with the source-mirrored related-services paragraph, disclaimer, and author', () => {
    expect(parsed.content).toContain(relatedServicesParagraph);
    for (const link of internalLinks) {
      expect(relatedServicesParagraph).toContain(link);
    }
    expect(parsed.content).not.toContain('## Related Services');
    expect(parsed.content).toContain(disclaimer);
    expect(parsed.content.trimEnd()).toMatch(
      new RegExp(
        `${relatedServicesParagraph.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n${disclaimer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\nWei Tseng \\(曾雋崴\\), Taiwan Attorney$`,
      ),
    );
    expect(post?.content).toContain(disclaimer);
    expect(post?.content.trimEnd()).toMatch(
      /Wei Tseng \(曾雋崴\), Taiwan Attorney$/,
    );
  });

  it('locks the exact visible-word count and the lane-set read_time', () => {
    const visibleWords = countVisibleEnglishWords(parsed.content);
    // read_time follows audit-split POLICY v1 (2026-10-06: about 230 words/min over the prose before
    // "Official Sources"), not the former ceil(all visible words / 200); re-set it together with the counts below.
    const proseWords = countVisibleEnglishWords(
      parsed.content.split('## Official Sources')[0],
    );

    expect(visibleWords).toBe(2_365);
    expect(proseWords).toBe(2_138);
    expect(visibleWords).toBeGreaterThan(2_000);
    expect(parsed.data.read_time).toBe('9 min read');
    expect(post?.readTime).toBe('9 min read');
  });

  it('resolves the canonical and alias slugs to the same complete English post', () => {
    expect(post?.slug).toBe('taiwan-company-establishment-basics');
    expect(aliasPost?.slug).toBe('taiwan-company-establishment-basics');
    expect(aliasPost?.title).toBe(post?.title);
    expect(aliasPost?.content).toBe(post?.content);
    expect(post?.content.length).toBeGreaterThan(12_000);
  });

  it('contains no stale claims, unsafe promises, locale leakage, or invisible spaces', () => {
    const forbiddenStrings = [
      'KOTRA',
      '107 companies',
      'fifth-largest trading partner',
      'sixth-largest trading partner',
      'US$2.9 billion',
      'US$1.7 billion',
      'soy sauce crab',
      'café',
      'hanbok',
      '😁',
      'Investment Commission',
      'Investment Review Commission',
      'There are 10 steps',
      'three months',
      'TWD 1 is possible',
      'sole shareholder must invest',
      'Taiwanese partner',
      'must be 100% owned by the Korean parent',
      'December 2, 2023',
      'same validity period',
      'starts at 5%',
      'prompt reply',
      '曾俊瑋',
      '/ko/',
      '/ja/',
      '/zh-hant/',
      'business capacity',
      'business items',
      'capital audit',
      'residence qualification',
      'legal acts and contact work',
      'foreign nationality responsible person',
      'Laws & Regulations Database — General Business Tax Rate',
      '\uFEFF',
      '\u00A0',
    ];

    for (const phrase of forbiddenStrings) {
      expect(raw.toLowerCase()).not.toContain(phrase.toLowerCase());
    }
    expect(raw).not.toMatch(/\bcomments?\b/i);
    expect(raw).not.toMatch(/\bDMs?\b/i);
    expect(raw).not.toMatch(
      /(?:fewer|less) than 183[^.\n]*(?:eliminat|exempt|no permanent establishment)/i,
    );
    for (const affirmativeClaim of [
      'Forming a company automatically grants',
      'Company formation automatically grants',
      'Company registration automatically grants',
      'Forming a company produces a visa',
      'Forming a company confers residence',
      'Five years of holding a work permit or ARC automatically',
    ]) {
      expect(raw).not.toContain(affirmativeClaim);
    }
    expect(raw).not.toMatch(
      /(?:work permit|ARC)[^.\n]*(?:always|necessarily)[^.\n]*(?:same|identical)[^.\n]*(?:term|period)/i,
    );
    expect(raw).not.toMatch(/[\uac00-\ud7af]/u);
    expect(raw).not.toMatch(/[\u3040-\u30ff]/u);
  });
});
