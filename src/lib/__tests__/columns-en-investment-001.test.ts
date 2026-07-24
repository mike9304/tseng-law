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
  'No. Forming a company does not by itself confer work authorization or residence status. A foreign national who will manage or operate a business in Taiwan must meet the applicable work-permit requirements, including requirements relating to the proposed role, the investment relationship, and the employer’s business performance. After obtaining the work permit, the individual must separately apply for an Alien Resident Certificate (ARC) appropriate to the purpose of residence.';
const capitalFaqAnswer =
  'Taiwan does not impose a generally applicable statutory minimum capital requirement for company formation. Industry-specific capital requirements, the reasonableness of the business plan, bank review, and employer-qualification rules for work permits must be assessed separately. The foreign-manager work-permit category for a foreign-invested business covers, among others, the manager (經理人) of a company in which overseas Chinese or foreign investors collectively hold more than one-third of the issued shares or total capital, the manager of a Taiwan branch of a foreign company, and the representative of a representative office. For a company or branch established for less than one year, the employer generally must satisfy at least one of the following: paid-in capital or Taiwan working capital of at least NT$500,000; revenue of at least NT$3 million; import-export performance of at least US$500,000; or agency commissions of at least US$200,000. For a company or branch established for at least one year, the employer generally must satisfy at least one of the following, measured by the most recent year in Taiwan or the average of the preceding three years: revenue of at least NT$3 million; import-export performance of at least US$500,000; or agency commissions of at least US$200,000. A representative office established for at least one year must have a record of activities in Taiwan; this requirement is waived if it has been established for less than one year. Special approval may be available where the business makes a substantial contribution to Taiwan’s economic development or special circumstances exist.';

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
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=10&pcode=G0340080',
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
  `[Taiwan Laws & Regulations Database — General Business Tax Rate](${officialSources[5]})`,
  `[Taiwan Tax Portal — Business Tax Filing Cycle](${officialSources[6]})`,
  `[Taiwan Tax Portal — Profit-Seeking Enterprise Income Tax Rate](${officialSources[7]})`,
  `[Taiwan Tax Portal — Taxation of Dividends Paid to Foreign Nationals](${officialSources[8]})`,
  `[Taiwan National Immigration Agency — Permanent Residence Guidance](${officialSources[9]})`,
  `[Taipei City — Advance Inquiry for Business Premises](${officialSources[10]})`,
];

const imagePaths = [
  '../images/001-taiwan-company-establishment-basics/featured-01.jpg',
  '../images/001-taiwan-company-establishment-basics/img-01.jpg',
  '../images/001-taiwan-company-establishment-basics/img-02.jpg',
  '../images/001-taiwan-company-establishment-basics/img-03.jpg',
  '../images/001-taiwan-company-establishment-basics/img-04.jpg',
];

const internalLinks = [
  '[Taiwan Investment and Company Formation Services](/en/services#investment)',
  '[Wei Tseng’s Profile](/en/lawyers/wei-tseng)',
  '[Contact Our Office](/en/contact)',
];

const taxParagraph =
  'Taiwan’s general business tax rate is 5%, and returns are generally filed every two months. The general profit-seeking enterprise income tax rate is 20%, although actual liability depends on taxable income and the applicable rules. Under Taiwan domestic law, dividends paid to a nonresident are generally subject to withholding at 21%. Dividends that qualify for the Taiwan–Korea Income Tax Agreement are subject to a maximum source-country rate of 10%. The applicable filing and withholding treatment depends on the taxpayer’s residence status, beneficial ownership, the character of the income, and the documents required to claim treaty benefits.';
const disclaimer =
  'This article is an educational overview of Taiwan company formation and related rules. It is not legal or tax advice for any specific matter. The required procedures and outcomes may vary depending on the investment structure, business activities, the applicant’s nationality and immigration status, and current agency practice. Before making an investment, entering into a contract, or employing personnel, confirm the current official guidance and the facts of your matter.';

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
    expect(parsed.data.lastmod).toBe('2026-07-25');
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
    expect(post?.date).toBe('2026-07-25');
    expect(post?.dateDisplay).toBe('September 13, 2025');
    expect(post?.category).toBe('formation');
    expect(post?.categoryLabel).toBe('Company Setup');
    expect(post?.featuredImage).toBe(
      '/images/blog/001-taiwan-company-establishment-basics/featured-01.jpg',
    );
    expect(post?.faq).toEqual(faq);
  });

  it('repeats each FAQ answer verbatim as the first paragraph after its heading', () => {
    const headingAnswers = [
      [
        '## 1. Choosing a Taiwan Presence: Subsidiary, Branch, or Representative Office',
        entityFaqAnswer,
      ],
      [
        '### Company Formation, Work Authorization, and Residence',
        residenceFaqAnswer,
      ],
      [
        '### Company Capital and Work Permits for Foreign Managers',
        capitalFaqAnswer,
      ],
    ];

    for (const [heading, answer] of headingAnswers) {
      expect(firstParagraphAfter(parsed.content, heading)).toBe(answer);
      expect(firstParagraphAfter(post?.content ?? '', heading)).toBe(answer);
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
      'Related Services',
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
    expect(processSection).toContain('It is not a universal checklist');
    for (const qualification of [
      'entity form',
      'amount and structure of the investment',
      'industry',
      'scope of agency review',
      'bank’s procedures',
      'requested corrections',
      'whether the investor is an individual or an entity',
      'entity’s jurisdiction of organization',
    ]) {
      expect(processSection).toContain(qualification);
    }
  });

  it('states the entity, treaty, PE, licensing, premises, work, and residence qualifications', () => {
    const requiredPhrases = [
      'The branch has no shareholders of its own',
      'the foreign head office bears the branch’s obligations',
      'It cannot make ordinary sales or provide paid services in Taiwan.',
      'The agreement entered into force on December 27, 2023, and applies from January 1, 2024.',
      'maximum source-country rate for dividends, interest, and royalties is 10%',
      'fixed facilities such as a place of management, branch, or office',
      'lasting more than six months',
      'more than 183 aggregate days in any 12-month period',
      'repeatedly exercises authority to conclude contracts',
      'neither PE status nor source-country taxation of business profits can be reduced to a count of service days',
      'Registered business activities describe what appears in the company-registration record; they do not independently grant permission to operate.',
      'prohibited or restricted industries',
      'professional qualifications',
      'land-use zoning, building and occupancy rules, lease restrictions',
      'advance inquiry for business premises (營業場所預先查詢)',
      'This procedure is specific to Taipei City',
      'A student may invest in or form a company in Taiwan',
      'do not authorize work or management under the student’s current immigration status',
      'thresholds above are employer qualifications for that work permit, not general minimum capital',
      'Meeting one financial threshold does not guarantee approval',
      'A qualifying spouse and minor children do not receive residence automatically.',
      'separately apply for dependent residence',
      'five consecutive years of lawful residence in Taiwan and at least 183 days of residence in each year',
      'conduct, assets or skills',
      'Certain foreign professionals may be subject to different calculation rules.',
      'Five years of holding a work permit or ARC does not automatically confer permanent residence',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks every foreign-manager threshold and the complete tax qualification', () => {
    expect(raw).toContain(taxParagraph);
    expect(post?.content).toContain(taxParagraph);

    for (const phrase of [
      'more than one-third of the issued shares or total capital',
      'paid-in capital or Taiwan working capital of at least NT$500,000',
      'revenue of at least NT$3 million',
      'import-export performance of at least US$500,000',
      'agency commissions of at least US$200,000',
      'the most recent year in Taiwan or the average of the preceding three years',
      'A representative office established for at least one year must have a record of activities in Taiwan',
      'waived if it has been established for less than one year',
      'substantial contribution to Taiwan’s economic development',
      'foreign manager (經理人)',
      'general business tax rate is 5%',
      'filed every two months',
      'profit-seeking enterprise income tax rate is 20%',
      'dividends paid to a nonresident are generally subject to withholding at 21%',
      'maximum source-country rate of 10%',
      'taxpayer’s residence status, beneficial ownership, the character of the income',
      'certificate of residence and any forms or supporting documents',
    ]) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses all eleven official links once and exactly the three English internal links', () => {
    expect(
      parsed.content
        .split('## Official Sources\n\n')[1]
        ?.split('\n\n## Related Services')[0]
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
    expect(bodyInternalLinks).toEqual(internalLinks);
    for (const link of internalLinks) {
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
      parsed.content.indexOf('Entering Taiwan is not a single filing exercise.'),
    );
    expect(parsed.content.indexOf(imagePaths[1])).toBeLessThan(
      parsed.content.indexOf('Entering Taiwan is not a single filing exercise.'),
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

  it('ends with the related services, horizontal rule, disclaimer, and author', () => {
    const relatedSection =
      parsed.content
        .split('## Related Services\n\n')[1]
        ?.split(`\n\n---\n\n${disclaimer}`)[0] ?? '';
    expect(relatedSection.trim().split('\n')).toEqual(
      internalLinks.map((link) => `- ${link}`),
    );
    expect(parsed.content).toContain(disclaimer);
    expect(parsed.content.trimEnd()).toMatch(
      new RegExp(
        `${disclaimer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n\\*\\*Wei Tseng \\(曾雋崴\\), Taiwan Attorney\\*\\*$`,
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

    expect(visibleWords).toBe(2_915);
    expect(visibleWords).toBeGreaterThan(2_000);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes} min read`);
    expect(post?.readTime).toBe(`${calculatedMinutes} min read`);
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
