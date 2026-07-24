import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const canonicalSlug =
  'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide';
const columnPath = path.join(
  process.cwd(),
  `src/content/columns-en/011-${canonicalSlug}.md`,
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost(canonicalSlug, 'en');
const aliasPost = getColumnPost('cosmetics-market-entry', 'en');

function countOccurrences(value: string, needle: string) {
  return value.split(needle).length - 1;
}

function extractBodyContracts(content: string) {
  return Array.from(
    content.matchAll(/^(## \d+\. .+)\n\n([^\n]+)$/gm),
    (match) => ({
      heading: match[1],
      answer: match[2],
    }),
  );
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

const title =
  'Entering Taiwan’s Cosmetics Market: Importer Selection, Product Registration, PIF Preparation and Retention, and Advertising Rules';

const faq = [
  {
    q: 'Does a foreign cosmetics brand have to establish a subsidiary or branch to sell products in Taiwan?',
    a: 'No. A Taiwan importer—including one that also serves as the distributor—may handle importation and sales, so a foreign brand does not necessarily need its own Taiwan subsidiary or branch. If the brand operates directly in Taiwan, a Taiwan subsidiary and a Taiwan branch of a foreign company follow different formation or registration procedures and have different liability and tax structures. The time required for foreign-investment approval and company or branch registration depends on the matter and whether supplemental documents are requested. The brand should first choose its business model and identify the entity that will assume the statutory responsibilities of the cosmetics manufacturer or importer.',
  },
  {
    q: 'What is a PIF, and is it the same as TFDA product registration?',
    a: 'No. Cosmetic product notification—referred to here as product registration—is a separate filing completed through TFDA’s cosmetics product registration platform. A Product Information File (PIF) compiles information on the product’s quality, safety, composition, claimed functions, manufacturing methods, test results, and safety assessment. The cosmetics manufacturer or importer must prepare, update, and retain the PIF; the PIF itself is not submitted to TFDA in advance. Beginning July 1, 2026, the remaining cosmetics categories are subject to the PIF requirements, so the rules generally cover all cosmetics. The exception is limited to solid handmade soap manufactured at a site exempt from factory registration.',
  },
  {
    q: 'What claims require particular care in Taiwan cosmetics advertising?',
    a: 'Taiwan evaluates an advertisement from its overall presentation, including the product name, text, images, symbols, sound, and context—not from isolated words alone. False or exaggerated claims and claims of medical efficacy are prohibited. Claims that a cosmetic treats acne, has anti-inflammatory effects, or sterilizes are examples requiring particular care. The administrative fine is NT$40,000–NT$200,000 for false or exaggerated advertising and NT$600,000–NT$5,000,000 for claims of medical efficacy. An influencer or reviewer post should be reviewed under the same rules when its content and commercial context make it advertising; not every personal post is automatically an advertisement.',
  },
];

const bodyContracts = [
  {
    heading: '## 1. Choosing a Taiwan Market-Entry Structure and Importer',
    answer: faq[0].a,
  },
  {
    heading: '## 2. Product Registration and the PIF Are Separate Requirements',
    answer: faq[1].a,
  },
  {
    heading: '## 3. Labeling, Promotion, and Advertising Rules',
    answer: faq[2].a,
  },
];

const officialLinks = [
  '[Cosmetic Hygiene and Safety Act](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030013)',
  '[Regulations Governing Notification of Cosmetic Products](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030097)',
  '[Regulations for Cosmetic Product Information File Management](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030098)',
  '[TFDA Announcement on the Scope of Cosmetic Product Registration](https://www.fda.gov.tw/tc/newsContent.aspx?cid=3&id=30612)',
  '[TFDA Announcement on Phased PIF Implementation](https://www.fda.gov.tw/tc/newsContent.aspx?cid=3&id=30614)',
  '[TFDA PIF Frequently Asked Questions](https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f639179794512621908&iid=13384)',
  '[TFDA Cosmetics Product Registration Resources](https://www.fda.gov.tw/TC/siteContent.aspx?sid=3435)',
  '[TFDA Product Information File Resources](https://www.fda.gov.tw/TC/site.aspx?sid=12523)',
  '[Criteria for Deceptive, Exaggerated, or Medical-Efficacy Claims in Cosmetic Labeling, Promotion, and Advertising](https://law.moj.gov.tw/LawClass/LawAll.aspx?PCODE=L0030099)',
  '[Appendix 4: Claims Involving Other Medical Efficacy](https://law.moj.gov.tw/LawClass/LawGetFile.ashx?FileId=0000249593&lan=C)',
  '[Ministry of Health and Welfare: New Cosmetics Advertising Rules](https://www.mohw.gov.tw/cp-4256-48110-1.html)',
  '[Invest Taiwan Overview of Foreign Investment](https://investtaiwan.nat.gov.tw/showPage?lang=jpn&search=InvestmentStatus01)',
  '[Department of Investment Review, MOEA](https://mnscdn.moea.gov.tw/Mns/dir/content/Content.aspx?menu_id=42879)',
];

const internalLinks = [
  '[Taiwan Company Formation Basics](/en/columns/taiwan-company-establishment-basics)',
  '[Taiwan Investment and Company Formation Services](/en/services#investment)',
  '[Wei Tseng’s Profile](/en/lawyers/wei-tseng)',
];

describe('English investment column 011 — Taiwan cosmetics market entry', () => {
  it('publishes exact metadata, H1, images, and the three contracted FAQs', () => {
    expect(parsed.data).toMatchObject({
      title,
      url: 'https://www.wei-wei-lawyer.com/post/taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
      lastmod: '2026-07-25',
      date_display: 'February 4, 2026',
      read_time: '15 min read',
      categories: ['Taiwan Company Formation'],
      featured_image:
        '../images/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide/featured-01.jpg',
      faq,
    });
    expect(parsed.data.faq).toHaveLength(3);
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(parsed.content).toContain(
      '![Cosmetics documentation and market-entry planning for Taiwan](../images/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide/featured-01.jpg)',
    );
    expect(parsed.content).toContain(
      '![](../images/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide/img-01.jpg)',
    );

    expect(post).toMatchObject({
      slug: canonicalSlug,
      title,
      date: '2026-07-25',
      dateDisplay: 'February 4, 2026',
      readTime: '15 min read',
      category: 'formation',
      categoryLabel: 'Company Setup',
      featuredImage:
        '/images/blog/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide/featured-01.jpg',
      faq,
    });
  });

  it('keeps the exact numbered H2s, immediate FAQ answers, and ordered H3s', () => {
    expect(extractBodyContracts(parsed.content)).toEqual(bodyContracts);
    expect(extractBodyContracts(post?.content ?? '')).toEqual(bodyContracts);
    expect(
      Array.from(
        parsed.content.matchAll(/^### (.+)$/gm),
        (match) => match[1],
      ),
    ).toEqual([
      'Using a Taiwan Importer',
      'Operating Directly in Taiwan',
      'When Product Registration Is Required and How Long It Remains Valid',
      'What the PIF Contains and When the Rules Apply',
      'Updating and Retaining the PIF',
      'Inspections, Corrective Orders, and Administrative Penalties',
      'Evaluate the Advertisement as a Whole',
      'Influencers, Reviewers, and Sales Partners',
      'A Pre-Market Compliance Sequence',
      'Official Sources',
    ]);
  });

  it('distinguishes the importer, direct-operation entities, institution, and statutory actor', () => {
    const required = [
      'A Taiwan importer may also serve as the distributor or sales agent.',
      'a contractual label does not determine statutory responsibility',
      'who imports the product and who completes product registration',
      'prepares and retains the PIF',
      'reviews Chinese-language labeling',
      'maintains batch and distribution records',
      'receiving consumer complaints and safety reports',
      'answering requests from TFDA or another competent authority',
      'use of trademarks, photographs, and other intellectual property',
      'advertising preclearance, adverse-event reporting, recall cooperation',
      'post-termination handoff',
      'Required records must remain accessible after the commercial relationship ends.',
      'A Taiwan subsidiary is a separate Taiwan legal entity.',
      'A Taiwan branch of a foreign company is part of the foreign head office and is not a separate legal entity.',
      'Accounting, taxation, earnings remittance, representative authority, and internal controls',
      'Department of Investment Review, Ministry of Economic Affairs (MOEA)',
      'submitted documents, agency inquiries, and required supplements',
      'cosmetics manufacturer or importer',
      'it does not transfer the manufacturer’s or importer’s responsibility',
    ];

    for (const phrase of required) {
      expect(parsed.content).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('separates notification from the PIF and locks timing, validity, changes, and limitations', () => {
    const required = [
      'Cosmetic product notification—referred to here as product registration',
      'TFDA’s cosmetics product registration platform',
      'before the product is supplied, sold, given away, publicly displayed, or provided to a consumer for trial use',
      'Product registration remains valid for three years.',
      'an extension must be sought during the three months before expiration',
      'may require an amendment or a new notification',
      'it does not establish that the PIF is complete',
      'Nor does it mean that TFDA reviewed or endorsed the supporting evidence',
      'that the label satisfies every requirement',
      'that the advertising is lawful',
      'or that the product is guaranteed to be eligible for sale',
      'Assigning responsible personnel, checklists, and completion criteria separately',
      'the PIF itself is not submitted to TFDA in advance',
      'A PIF is a product-specific collection',
      'The notification process neither certifies nor endorses the PIF.',
      'trace each record to its source and applicable version',
    ];

    for (const phrase of required) {
      expect(parsed.content).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expect(
      countOccurrences(
        parsed.content,
        'Cosmetic product notification—referred to here as product registration',
      ),
    ).toBe(1);
  });

  it('locks the 16 PIF categories, phase-in, narrow exception, and retained responsibility', () => {
    const pifSection = parsed.content.slice(
      parsed.content.indexOf(
        'The governing regulation organizes the required information into exactly 16 categories:',
      ),
      parsed.content.indexOf(
        'These categories cover representative product, manufacturer',
      ),
    );
    const categories = Array.from(
      pifSection.matchAll(/^(\d+)\. (.+)$/gm),
      (match) => match[2],
    );
    expect(categories).toEqual([
      'Basic information identifying the product and its manufacturer.',
      'Documentary proof that product notification has been completed.',
      'The full names and individual concentrations of all ingredients.',
      'Packaging, container, label, and package-insert materials presented with the product.',
      'Evidence or a declaration concerning the manufacturing site’s compliance with cosmetics good manufacturing practices.',
      'Manufacturing methods and process records.',
      'Directions covering use, application area, amount, frequency, and intended population.',
      'Known adverse-effect information associated with product use.',
      'Physical and chemical properties of the finished product and individual ingredients.',
      'Toxicology information for the ingredients.',
      'Product stability test reports.',
      'Microbiological test reports.',
      'Preservative-effectiveness test reports.',
      'Evidence substantiating the product’s claimed functions.',
      'Information on packaging materials that come into contact with the product.',
      'Product safety information and the required safety-assessment conclusion and recommendations.',
    ]);
    expect(parsed.content).toContain(
      'Beginning July 1, 2026, the remaining cosmetics categories enter the regime, and the rules then generally cover all cosmetics.',
    );
    expect(parsed.content).toContain(
      'solid handmade soap manufactured at a site exempt from factory registration',
    );
    expect(parsed.content).toContain(
      'Neither the word “handmade” nor the word “soap,” standing alone, creates the exception.',
    );
    expect(parsed.content).toContain(
      'A qualified third party may assist with testing, record compilation, or safety work.',
    );
    expect(parsed.content).toContain(
      'Responsibility stays with the cosmetics manufacturer or importer.',
    );
    expect(parsed.content).toContain(
      'can be traced to reliable sources, contain the required signatures, and can be produced promptly',
    );
  });

  it('locks PIF updating, Article 7 duration, Article 8 address, and retrieval controls', () => {
    const required = [
      'ingredients, formula, manufacturing method or site, label, leaflet, claims, tests, complaints, adverse events, or safety information change',
      'when the change was evaluated',
      'Article 7 of the Regulations for Cosmetic Product Information File Management governs duration',
      'at least five years, beginning the day after the product was last supplied to the market',
      'Article 8 governs location.',
      'the manufacturer’s or importer’s address stated under Article 7(1)(7) of the Cosmetic Hygiene and Safety Act',
      'the former fixes the retention period and its starting point, while the latter fixes the required address',
      'The PIF may be stored by the original manufacturer or in an electronic or cloud system',
      'retains complete access and can promptly retrieve and produce the file',
      'access rights, backups, version control, responsible personnel, usable file formats, completeness checks',
      'Post-termination handoff',
    ];

    for (const phrase of required) {
      expect(parsed.content).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('qualifies inspections and separates false information, correction, fines, and further measures', () => {
    const required = [
      'at least seven days’ advance notice of an inspection',
      'exceptions for emergencies and public-interest needs',
      'False information in a product registration or PIF',
      'NT$10,000–NT$1,000,000',
      'ordinarily orders correction within a specified period',
      'a fine applies if the deficiency is not corrected by the deadline',
      'triggers the correction-first process rather than an immediate fine',
      'should not be characterized as a criminal offense',
      'Withdrawal, recall, confiscation, or destruction is not automatic for every documentation defect.',
      'the statutory conditions, the nature of the violation, whether the deficiency was corrected, the product’s safety risk, the authority’s findings, and the terms of its order',
      'The appropriate response should be based on the facts and applicable legal authority.',
    ];

    for (const phrase of required) {
      expect(parsed.content).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks the overall-advertisement analysis, fine ranges, and commercial-partner factors', () => {
    const required = [
      'written and spoken words, images, symbols, video, sound, surrounding context, relationships among messages, and the consumer’s overall impression',
      'examine the advertisement as finally assembled',
      'A small disclaimer does not necessarily cure a dominant headline',
      'treats acne, has anti-inflammatory effects, or sterilizes',
      'Ingredient research does not, by itself, permit a therapeutic claim for the finished product.',
      'NT$40,000–NT$200,000',
      'NT$600,000–NT$5,000,000',
      'the proposed claim, its substantiation, the final version of the advertisement, the intended channel, and the approval decision',
      'payment, free goods, affiliate links, posting instructions, editorial control, repeated collaboration',
      'not every personal post is automatically advertising',
      'Using a personal account does not avoid the rules',
      'permissible claims and the substantiation available to support them',
      'advance review, retention of approval records, and prompt correction or deletion',
      'comments, livestream statements',
      'Cross-channel consistency',
      'preserve drafts, comments, review notes',
    ];

    for (const phrase of required) {
      expect(parsed.content).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('keeps the exact six-step pre-market sequence', () => {
    const sequenceSection = parsed.content.slice(
      parsed.content.indexOf('### A Pre-Market Compliance Sequence'),
      parsed.content.indexOf('### Official Sources'),
    );
    expect(
      Array.from(
        sequenceSection.matchAll(/^\d+\. \*\*(.+)\*\*$/gm),
        (match) => match[1],
      ),
    ).toEqual([
      'Choose the import structure.',
      'Identify the entity bearing the statutory responsibilities of the cosmetics manufacturer or importer.',
      'Complete product registration before supply, sale, giveaway, public display, or consumer trial use.',
      'Prepare, update, and retain the PIF for the required period at the required address.',
      'Review labeling, promotion, advertising, and commercial-partner content.',
      'Maintain procedures for inspections, corrective orders, complaints, safety information, and required follow-up.',
    ]);
  });

  it('uses all official sources and exactly three internal links once and in order', () => {
    for (const link of [...officialLinks, ...internalLinks]) {
      expect(countOccurrences(parsed.content, link)).toBe(1);
      expect(post?.content).toContain(link);
    }

    const markdownLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\([^)]+\)/g),
      (match) => match[0],
    );
    expect(markdownLinks.slice(0, officialLinks.length)).toEqual(officialLinks);
    expect(markdownLinks.slice(officialLinks.length)).toEqual(internalLinks);
  });

  it('ends with the exact disclaimer and canonical author, with nothing after the author', () => {
    const exactEnding = `---

This article provides general educational information about entering Taiwan’s cosmetics market. It is not legal advice on any specific product or advertisement and does not guarantee any permit or approval, completion of product registration, eligibility for sale, or any processing time. The appropriate market-entry structure, product documentation, labeling and advertising content, and current agency requirements should be confirmed for the particular matter.

**Wei Tseng (曾雋崴), Taiwan Attorney**`;

    expect(parsed.content.trimEnd().endsWith(exactEnding)).toBe(true);
    expect(post?.content.trimEnd().endsWith(exactEnding)).toBe(true);
  });

  it('freezes the exact visible word count and calculated 200-wpm read time', () => {
    const visibleWordCount = countVisibleEnglishWords(parsed.content);
    const minutes = Math.ceil(visibleWordCount / 200);

    expect(visibleWordCount).toBe(2_883);
    expect(visibleWordCount).toBeGreaterThanOrEqual(1_800);
    expect(minutes).toBe(15);
    expect(parsed.data.read_time).toBe(`${minutes} min read`);
    expect(post?.readTime).toBe(`${minutes} min read`);
  });

  it('removes prohibited claims, stale terms, promotional copy, locale leakage, and hidden characters', () => {
    const prohibited = [
      'PIF registration',
      'register the PIF',
      'registration of the PIF',
      'PIF upload',
      'upload the PIF',
      'PIF approval',
      'approved PIF',
      'PIF certification',
      'certified PIF',
      'product registrant',
      'domestic responsible person',
      'Investment Commission of the Ministry of Economic Affairs',
      'about three months',
      'generally take about three months',
      'responsibility subject',
      'carry out registration',
      'make a PIF',
      'market sale qualification',
      'undertake import and sale',
      'according to the overall expression',
      'the file is established',
      'materials are inaccurate',
      'materials have omissions',
      'where medical efficacy is involved',
      'spending power',
      'client dialogue',
      'faster market entry',
      'high control',
      'long-term positioning',
      'comprehensive agency agreements',
      'ID cards and health reports',
      'marketing landmines',
      'paying tuition',
      'professional support',
      'feel free to contact',
      'contact us',
      'quick response',
      '/ko/',
      '/ja/',
      '/zh-hant/',
      '曾俊瑋',
    ];
    const lowerRaw = raw.toLowerCase();

    for (const phrase of prohibited) {
      expect(lowerRaw).not.toContain(phrase.toLowerCase());
    }
    expect(raw).not.toMatch(/[\uac00-\ud7af\u3040-\u30ff]/);
    expect(raw).not.toMatch(/[\u{1f000}-\u{1faff}]/u);
    expect(raw).not.toContain('\uFEFF');
    expect(raw).not.toContain('\u00A0');
    expect(parsed.content).not.toMatch(
      /(?:all|every) handmade soap[^.\n]{0,80}(?:is|are)[^.\n]{0,40}(?:exempt|excluded)/i,
    );
    expect(parsed.content).not.toMatch(
      /(?<!not )every personal post[^.\n]{0,40}(?:is|becomes)[^.\n]{0,40}(?:advertising|an advertisement)/i,
    );
    expect(parsed.content).not.toMatch(
      /incomplete PIF[^.\n]{0,100}(?:(?:results in|is subject to|incurs) an immediate fine|criminal fine|automatically recalled)/i,
    );
  });

  it('resolves the canonical slug and cosmetics-market-entry alias identically', () => {
    expect(post).toBeTruthy();
    expect(aliasPost).toBeTruthy();
    expect(aliasPost?.slug).toBe(canonicalSlug);
    expect(aliasPost?.title).toBe(post?.title);
    expect(aliasPost?.content).toBe(post?.content);
    expect(aliasPost?.faq).toEqual(post?.faq);
  });
});
