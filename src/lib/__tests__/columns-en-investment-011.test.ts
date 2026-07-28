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
    a: 'No. A Taiwan importer—including one that also serves as the distributor—may handle importation and sales. If the brand operates directly in Taiwan, a Taiwan subsidiary and a Taiwan branch of a foreign company differ in their formation and registration, liability, and tax structures. The time required for foreign-investment approval and company or branch registration also varies according to the particular matter and whether supplemental documents are requested. The brand should first choose its business model and identify the entity that will assume the legal responsibilities of the cosmetics manufacturer or importer.',
  },
  {
    q: 'What is a PIF, and is it the same as TFDA product registration?',
    a: 'No. Product registration is a separate procedure conducted through TFDA’s cosmetics product registration platform. A Product Information File (PIF) compiles information on a cosmetic product’s quality, safety, composition, claimed functions, manufacturing methods, test results, and safety assessment, and must be prepared, updated, and retained by the cosmetics manufacturer or importer. The PIF itself is not submitted to TFDA in advance. From July 1, 2026, the PIF requirements apply in principle to all cosmetics, except solid handmade soap manufactured at a site exempt from factory registration.',
  },
  {
    q: 'What claims require particular care in Taiwan cosmetics advertising?',
    a: 'An advertisement is assessed based on its overall presentation, including names, text, images, symbols, and sound—not its wording alone. False or exaggerated claims and claims of medical efficacy are prohibited. Claims that a cosmetic treats acne, has anti-inflammatory effects, or sterilizes require particular care. The administrative fine is NT$40,000–NT$200,000 for false or exaggerated advertising and NT$600,000–NT$5,000,000 for claims of medical efficacy. Posts by influencers and others should be reviewed under the same standards if they are advertising in substance.',
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
  '[TFDA PIF Preparation Guidelines](https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f639179794512621908&iid=13384)',
  '[TFDA Cosmetics Product Registration Resources](https://www.fda.gov.tw/TC/siteContent.aspx?sid=3435)',
  '[TFDA Product Information File Resources](https://www.fda.gov.tw/TC/site.aspx?sid=12523)',
  '[Criteria for Deceptive, Exaggerated, or Medical-Efficacy Claims in Cosmetic Labeling, Promotion, and Advertising](https://law.moj.gov.tw/LawClass/LawAll.aspx?PCODE=L0030099)',
  '[Official Appendix to the Cosmetics Advertising Criteria](https://law.moj.gov.tw/LawClass/LawGetFile.ashx?FileId=0000249593&lan=C)',
  '[Ministry of Health and Welfare Announcement on Cosmetics Advertising Regulation](https://www.mohw.gov.tw/cp-4256-48110-1.html)',
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
      read_time: '13 min read',
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
      '![Cosmetics documentation and regulatory review required to enter Taiwan’s market](../images/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide/featured-01.jpg)',
    );
    expect(parsed.content).toContain(
      '![](../images/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide/img-01.jpg)',
    );

    expect(post).toMatchObject({
      slug: canonicalSlug,
      title,
      date: '2026-07-25',
      dateDisplay: 'February 4, 2026',
      readTime: '13 min read',
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
      'If a Taiwan importer or distributor handles importation and sales',
      'The distributor may also serve as the importer, or a separate importer may participate.',
      'Contractual labels such as agent, master distributor, or distributor do not by themselves determine where legal responsibility lies.',
      'who will import the products and complete product registration',
      'who will prepare, update, and retain the PIF',
      'review labeling, maintain distribution records, receive consumer complaints and safety information',
      'respond to inspections and requests for information from the competent authorities',
      'The statutory obligations imposed on the cosmetics manufacturer or importer',
      'the permitted use of intellectual property such as trademarks and images',
      'the manufacturer’s records needed for product registration and the PIF',
      'management of updated records and their handover when the agreement ends',
      'authority to review and revise advertising in advance',
      'the scope and deadline for returning them or providing copies',
      'A subsidiary is a separate legal entity incorporated under Taiwan law',
      'a branch is registered as part of the foreign company’s head office',
      'legal personality, the head office’s liability, accounting and tax treatment, profit remittance, representative authority, and internal controls',
      'Department of Investment Review, Ministry of Economic Affairs (MOEA)',
      'obtain investment approval, remit funds, register a company or branch, open a bank account, complete tax registration, and obtain importer status',
      'the central responsible entity under cosmetics regulation is the **cosmetics manufacturer or importer**',
      'outsourcing alone does not transfer the cosmetics manufacturer’s or importer’s legal responsibility',
      'Distinguishing contractual task allocation from the responsible entity under the law',
    ];

    for (const phrase of required) {
      expect(parsed.content).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('separates notification from the PIF and locks timing, validity, changes, and limitations', () => {
    const required = [
      'Product registration is a separate procedure',
      'TFDA’s cosmetics product registration platform',
      'before supplying, selling, giving away, or publicly displaying the product, or providing it to consumers for trial use',
      'the registration timeline must also account for promotional giveaways and consumer trials',
      'Product registration is valid for three years.',
      'an extension must be applied for within the three months before the registration expires',
      'the product name, purpose, dosage form, ingredients, or manufacturing site changes',
      'what procedure is required for the particular change',
      'a procedure for reporting the prescribed registration information through the platform',
      'does not mean that all records required for the PIF are in place',
      'nor does it establish that the product’s labeling or advertising is lawful',
      'Product registration, PIF management, and labeling and advertising review should be operated as separate compliance workstreams.',
      'The PIF itself is not submitted to TFDA in advance',
    ];

    for (const phrase of required) {
      expect(parsed.content).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expect(
      countOccurrences(
        parsed.content,
        'Product registration is a separate procedure conducted through TFDA’s cosmetics product registration platform.',
      ),
    ).toBe(1);
  });

  it('locks the PIF records, 16-category rule, phase-in, narrow exception, and retained responsibility', () => {
    const pifSection = parsed.content.slice(
      parsed.content.indexOf('### What the PIF Contains and When the Rules Apply'),
      parsed.content.indexOf('### Updating and Retaining the PIF'),
    );
    const expectedParagraphs = [
      'A PIF is a collection of records designed to provide an ongoing account of a product’s quality and safety. In addition to quality, safety, composition, claimed functions, manufacturing methods, test results, and the safety assessment, supporting records such as basic information about the product and manufacturer and the label must be organized for each product. The Regulations for Cosmetic Product Information File Management organize the required records into 16 categories, so the records and signature and qualification requirements for each category must be checked according to the product type.',
      'The PIF requirements have been implemented in phases by product category. From July 1, 2026, the remaining cosmetics are also covered, so the requirements apply in principle to all cosmetics. The exception is limited to solid handmade soap manufactured at a site exempt from factory registration. A product is not exempt merely because it is handmade or called soap; both its solid form and the manufacturing site’s exemption from factory registration must be confirmed.',
      'A third party with the necessary qualifications and capabilities may assist with PIF work, including the safety assessment. Even when a third party helps prepare or retain the records, however, the cosmetics manufacturer’s or importer’s legal responsibility remains in place. The original manufacturer, testing laboratory, safety assessor, and Taiwan business should establish a system for sharing changed information and current signed records.',
    ];
    const paragraphs = pifSection
      .split(/\n\n+/)
      .filter((paragraph) => paragraph && !paragraph.startsWith('### '));

    expect(paragraphs).toEqual(expectedParagraphs);
    expect(pifSection.match(/^\d+\. /gm) ?? []).toHaveLength(0);
    expect(pifSection).toContain('required records into 16 categories');
    expect(pifSection).toContain('From July 1, 2026');
    expect(pifSection).toContain(
      'solid handmade soap manufactured at a site exempt from factory registration',
    );
    expect(pifSection).toContain(
      'the cosmetics manufacturer’s or importer’s legal responsibility remains in place',
    );
    for (const paragraph of expectedParagraphs) {
      expect(post?.content).toContain(paragraph);
    }
  });

  it('locks PIF updating, Article 7 duration, Article 8 address, and retrieval controls', () => {
    const required = [
      'an ingredient or formula, a manufacturing method or site, labeling including the label, a claimed function, or safety information changes',
      'consumer complaints, adverse events, and new test results may also affect the existing assessment',
      'Under Article 7 of the Regulations for Cosmetic Product Information File Management',
      'at least five years beginning on the day after the product was last supplied to the market',
      'Under Article 8 of the same Regulations',
      'the address of the cosmetics manufacturer or importer specified in Article 7(1)(7) of the Cosmetic Hygiene and Safety Act',
      'The provision governing the retention period and the provision governing the retention location should be distinguished in practice.',
      'the original manufacturer holds the originals or a secure electronic or cloud repository is used',
      'must be able to access the complete records',
      'Access rights, backups, version control, file formats, and responsible personnel',
      'promptly retrieved and produced at the competent authority’s request',
      'which records will be handed over, how the handover will occur, and whether access rights will survive',
      'remain available for the statutory retention period',
    ];

    for (const phrase of required) {
      expect(parsed.content).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('qualifies inspections and separates false information, correction, fines, and further measures', () => {
    const required = [
      'notify the cosmetics manufacturer or importer at least seven days before the inspection',
      'conducted without advance notice if a statutory exception under the applicable regulations applies',
      'Complete and current records should always be maintained',
      'Reporting false information in a product registration or recording false information in a PIF',
      'NT$10,000–NT$1,000,000',
      'if PIF records are incomplete, the competent authority ordinarily orders correction within a specified period',
      'an administrative fine may be imposed if the deficiency is not corrected within that period',
      'False information and a remediable documentation deficiency should not be treated as producing the same consequence.',
      'Recall or destruction does not automatically follow every deficiency in PIF documentation.',
      'The product’s safety, the nature of the violation, the status of corrective action, and the statutory requirements applicable to each measure',
      'Measures taken when a safety issue is identified should be distinguished from a request to supplement documentation',
      'the competent authority’s notice and the applicable legal provisions',
    ];

    for (const phrase of required) {
      expect(parsed.content).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks the overall-advertisement analysis, fine ranges, and commercial-partner factors', () => {
    const required = [
      'The product name, sentences, images, symbols, sound, surrounding context, and the overall impression conveyed to consumers',
      'a dominant advertising message is not necessarily cured by a disclaimer in small print',
      'both individual claims and the final advertisement as produced should be reviewed',
      'treats acne, has an anti-inflammatory effect, or sterilizes',
      'claims that associate the product with a disease',
      'before-and-after images',
      'contexts that connect an ingredient description to a therapeutic effect of the product',
      'NT$40,000–NT$200,000',
      'NT$600,000–NT$5,000,000',
      'the ranges differ by violation type',
      'Payment, free products, sales links, the brand’s posting instructions, and repeated collaborations',
      'Not every personal post automatically becomes brand advertising',
      'the relationship between the poster and the brand, the specific content, and the degree of the brand’s involvement',
      'the permitted claims and supporting records, pre-publication review, and procedures for correcting or deleting noncompliant claims',
      'Claims added in comments, oral explanations in livestreams or short videos',
      'inconsistencies among sales pages and labels',
      'Reviewed drafts, approval history, correction requests, and final published materials',
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
        sequenceSection.matchAll(/^\d+\. (.+)$/gm),
        (match) => match[1],
      ),
    ).toEqual([
      'Decide whether to establish a Taiwan subsidiary or branch or entrust importation and sales to a local importer.',
      'Identify the entity bearing the legal responsibilities of the cosmetics manufacturer or importer and the persons responsible for the contractually allocated tasks.',
      'Complete product registration before supplying, selling, giving away, or publicly displaying the product, or providing it to consumers for trial use.',
      'Prepare a PIF for each product, update it for changes, and retain it for the statutory period at the required location.',
      'Review labels, sales pages, advertising, and collaboration posts based on their overall presentation.',
      'Maintain procedures for responding to inspections and corrective requests, complaints and safety information, and any necessary follow-up measures.',
    ]);
  });

  it('uses exactly three internal links and all official sources once and in source order', () => {
    for (const link of [...officialLinks, ...internalLinks]) {
      expect(countOccurrences(parsed.content, link)).toBe(1);
      expect(post?.content).toContain(link);
    }

    const markdownLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\([^)]+\)/g),
      (match) => match[0],
    );
    expect(markdownLinks.slice(0, internalLinks.length)).toEqual(internalLinks);
    expect(markdownLinks.slice(internalLinks.length)).toEqual(officialLinks);
  });

  it('ends with the exact disclaimer and canonical author, with nothing after the author', () => {
    const exactEnding = `This article provides general educational information about the rules governing entry into Taiwan’s cosmetics market. It is not legal advice on any specific product or advertisement and does not guarantee any permit or registration, eligibility for sale, or processing time. The market-entry structure, product records, labeling and advertising content, and the competent authorities’ current practices should be confirmed for each particular matter.

**Wei Tseng (曾雋崴), Taiwan Attorney**`;

    expect(parsed.content.trimEnd().endsWith(exactEnding)).toBe(true);
    expect(post?.content.trimEnd().endsWith(exactEnding)).toBe(true);
  });

  it('freezes the exact visible word count and calculated 200-wpm read time', () => {
    const visibleWordCount = countVisibleEnglishWords(parsed.content);
    const minutes = Math.ceil(visibleWordCount / 200);

    expect(visibleWordCount).toBe(2_478);
    expect(visibleWordCount).toBeGreaterThanOrEqual(1_800);
    expect(minutes).toBe(13);
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
