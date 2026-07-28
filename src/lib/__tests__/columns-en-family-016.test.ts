import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-en/016-taiwan-inheritance-custody-analysis.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('taiwan-inheritance-custody-analysis', 'en');
const aliasPost = getColumnPost('inheritance-custody', 'en');

const title =
  'Taiwan Inheritance and Parental Rights: A Guide for Surviving Families';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-inheritance-custody-analysis';
const featuredImage =
  '../images/016-taiwan-inheritance-custody-analysis/featured-generic.webp';
const faq1Answer =
  'Under Articles 1138 and 1144 of Taiwan’s Civil Code, the surviving spouse inherits concurrently with the heirs in the applicable statutory rank, and descendants are first in the statutory order. If the only relevant heirs are a surviving spouse and two children, there is no valid will, and no waiver, disqualification, succession by representation, or other material fact changes the result, each would ordinarily receive a one-third share. This is a hypothetical illustration, not a conclusion about any actual estate.';
const faq2Answer =
  'No. A residual-property distribution claim under Article 1030-1 of Taiwan’s Civil Code is a separate claim that a surviving spouse may assert if the statutory requirements are met; it must be analyzed separately from inheritance. Not every asset acquired during marriage enters the calculation, and the surviving spouse does not necessarily receive half of the estate. The marital-property regime, the reason and time of acquisition of each asset, debts, and statutory exclusions must be examined on the facts.';
const faq3Answer =
  'Under Article 1089 of Taiwan’s Civil Code, when one parent cannot exercise rights and assume duties concerning a minor child, the other parent ordinarily does so. Accordingly, if the surviving parent retains parental rights and no contrary court order exists, that parent ordinarily continues to exercise parental rights and assume parental duties. Existing orders, statutory grounds for restriction or suspension, cross-border factors, the child’s best interests, and other specific circumstances may still require judicial involvement.';
const faq4Answer =
  'No. Under Articles 1087 and 1088 of Taiwan’s Civil Code, property acquired by a minor through inheritance is the child’s separate property; the parent or guardian does not become its beneficial owner. Management, use, collection of income, legal representation, and disposition must be handled in the child’s interests. A conflict of interest or a significant disposition may require a special representative or court involvement. A parent must not be understood to have unrestricted authority to use a child’s inherited property unilaterally.';
const faq = [
  {
    q: 'If there is no will and the only heirs are a surviving spouse and two children, how are the intestate shares calculated?',
    a: faq1Answer,
  },
  {
    q: 'Is a surviving spouse’s residual-property distribution claim the same as an inheritance share?',
    a: faq2Answer,
  },
  {
    q: 'What happens to parental rights and duties when one parent dies?',
    a: faq3Answer,
  },
  {
    q: 'May a surviving parent freely use property that a minor child inherits?',
    a: faq4Answer,
  },
];
const headings = [
  '1. Statutory Heirs and Intestate Shares',
  '2. Wills and Identifying the Estate',
  '3. The Surviving Spouse’s Residual-Property Claim',
  '4. Inherited Debts and Waiver of Inheritance',
  '5. The Surviving Parent’s Rights and Duties',
  '6. Guardian Designation and Court Involvement',
  '7. Protecting a Minor’s Inherited Property',
  '8. Cross-Border Family Issues',
  '9. Practical Planning Checklist',
  '10. Official Sources',
  '11. Related Services',
];
const officialLinks = [
  '[Taiwan Laws & Regulations Database — Civil Code](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000001)',
  '[Ministry of Justice Laws and Regulations Retrieving System — Civil Code in English](https://mojlaw.moj.gov.tw/ENG/LawContentE.aspx?LSID=FL001351)',
  '[Taiwan Laws & Regulations Database — Act Governing the Choice of Law in Civil Matters Involving Foreign Elements](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000007)',
  '[Judicial Yuan — Family Petition Form for Appointment of a Guardian for a Minor](https://www.judicial.gov.tw/tw/cp-1369-4219-da7e1-1.html)',
  '[Ministry of Finance Taiwan Tax Portal — Inheritance Procedures and Required Documents](https://www.etax.nat.gov.tw/etwmain/tax-info/house-land-transfer-taxtation-calculation-area/inheritance/file-process)',
];
const officialUrls = officialLinks.map(
  (link) => link.match(/\((https?:\/\/[^)]+)\)$/)?.[1] ?? '',
);
const internalLinks = [
  '[Taiwan Family Litigation Services](/en/services/family)',
  '[Taiwan Litigation Lawyer Guide](/en/taiwan-litigation-lawyer)',
  '[Contact Us](/en/contact)',
];
const exactDeadlineStatement =
  'The Ministry of Finance’s Taiwan Tax Portal guidance on procedures for inheritance matters was updated on June 25, 2026. It describes the general three-month period for court procedures concerning submission of an estate inventory and waiver of inheritance, and the general six-month period for filing an estate tax return. The starting date, extensions, exceptions, and jurisdiction must be checked in each case, and this guidance must not be used to calculate an individual deadline.';
const exactEnding = `---

This article provides general educational information about Taiwan’s law of succession, marital-property regimes, parental rights and duties, and guardianship of minors. It is not legal advice for any particular inheritance or family matter. The applicable law, procedures, and outcome may vary with the identity of the heirs, any will, the assets and debts, the marital-property regime, existing court orders, and cross-border factors. Before calculating a deadline for waiver of inheritance or tax filing, or disposing of property, confirm the current official materials and the facts of the matter.

**Wei Tseng (曾雋崴), Taiwan Attorney**`;
const expectedFrontmatter = `---
title: "Taiwan Inheritance and Parental Rights: A Guide for Surviving Families"
url: "https://www.wei-wei-lawyer.com/post/taiwan-inheritance-custody-analysis"
lastmod: "2026-07-25"
date_display: "September 13, 2025"
read_time: "19 min read"
categories:
  - "Taiwan Legal Information"
featured_image: "../images/016-taiwan-inheritance-custody-analysis/featured-generic.webp"
faq:
  - q: "If there is no will and the only heirs are a surviving spouse and two children, how are the intestate shares calculated?"
    a: "Under Articles 1138 and 1144 of Taiwan’s Civil Code, the surviving spouse inherits concurrently with the heirs in the applicable statutory rank, and descendants are first in the statutory order. If the only relevant heirs are a surviving spouse and two children, there is no valid will, and no waiver, disqualification, succession by representation, or other material fact changes the result, each would ordinarily receive a one-third share. This is a hypothetical illustration, not a conclusion about any actual estate."
  - q: "Is a surviving spouse’s residual-property distribution claim the same as an inheritance share?"
    a: "No. A residual-property distribution claim under Article 1030-1 of Taiwan’s Civil Code is a separate claim that a surviving spouse may assert if the statutory requirements are met; it must be analyzed separately from inheritance. Not every asset acquired during marriage enters the calculation, and the surviving spouse does not necessarily receive half of the estate. The marital-property regime, the reason and time of acquisition of each asset, debts, and statutory exclusions must be examined on the facts."
  - q: "What happens to parental rights and duties when one parent dies?"
    a: "Under Article 1089 of Taiwan’s Civil Code, when one parent cannot exercise rights and assume duties concerning a minor child, the other parent ordinarily does so. Accordingly, if the surviving parent retains parental rights and no contrary court order exists, that parent ordinarily continues to exercise parental rights and assume parental duties. Existing orders, statutory grounds for restriction or suspension, cross-border factors, the child’s best interests, and other specific circumstances may still require judicial involvement."
  - q: "May a surviving parent freely use property that a minor child inherits?"
    a: "No. Under Articles 1087 and 1088 of Taiwan’s Civil Code, property acquired by a minor through inheritance is the child’s separate property; the parent or guardian does not become its beneficial owner. Management, use, collection of income, legal representation, and disposition must be handled in the child’s interests. A conflict of interest or a significant disposition may require a special representative or court involvement. A parent must not be understood to have unrestricted authority to use a child’s inherited property unilaterally."
---
`;

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
    .replace(/[“”‘’*_`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    visibleText.match(/[A-Za-z0-9]+(?:[.’'-][A-Za-z0-9]+)*/g)?.length ?? 0
  );
}

describe('English family column 016 — anonymized inheritance and parental-rights guide', () => {
  it('publishes the exact frontmatter, sole H1, and four ordered FAQs', () => {
    const closingFrontmatter = raw.indexOf('\n---\n', 4);

    expect(raw.slice(0, closingFrontmatter + 5)).toBe(expectedFrontmatter);
    expect(parsed.data).toEqual({
      title,
      url: sourceUrl,
      lastmod: '2026-07-25',
      date_display: 'September 13, 2025',
      read_time: '19 min read',
      categories: ['Taiwan Legal Information'],
      featured_image: featuredImage,
      faq,
    });
    expect(parsed.data.faq).toHaveLength(4);
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(post).toMatchObject({
      slug: 'taiwan-inheritance-custody-analysis',
      title,
      date: '2026-07-25',
      dateDisplay: 'September 13, 2025',
      readTime: '19 min read',
      category: 'legal',
      categoryLabel: 'Legal Information',
      featuredImage:
        '/images/blog/016-taiwan-inheritance-custody-analysis/featured-generic.webp',
      faq,
    });
    expect(raw.split(sourceUrl)).toHaveLength(2);
  });

  it('uses the sole contracted generic body image and no legacy image path', () => {
    const bodyImages = Array.from(
      parsed.content.matchAll(/!\[[^\]]*\]\([^)]+\)/g),
      (match) => match[0],
    );

    expect(bodyImages).toEqual([
      `![Illustration of inheritance planning in Taiwan and protection of a minor’s property](${featuredImage})`,
    ]);
    expect(raw.split(featuredImage)).toHaveLength(3);
    for (const legacyImage of [
      'featured-01.jpg',
      'img-01.jpg',
      'img-02.jpg',
      'img-03.jpg',
    ]) {
      expect(raw).not.toContain(legacyImage);
    }
  });

  it('repeats each exact FAQ answer twice and as its assigned H2 first paragraph', () => {
    const headingAnswers = [
      ['## 1. Statutory Heirs and Intestate Shares', faq1Answer],
      ['## 3. The Surviving Spouse’s Residual-Property Claim', faq2Answer],
      ['## 5. The Surviving Parent’s Rights and Duties', faq3Answer],
      ['## 7. Protecting a Minor’s Inherited Property', faq4Answer],
    ];

    for (const [heading, answer] of headingAnswers) {
      expect(firstParagraphAfter(parsed.content, heading)).toBe(answer);
      expect(firstParagraphAfter(post?.content ?? '', heading)).toBe(answer);
      expect(raw.split(answer)).toHaveLength(3);
    }
    expect(raw.match(/one-third/g)).toHaveLength(2);
  });

  it('uses exactly the eleven contracted H2 sections in order', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(headings);
  });

  it('locks the introduction, intestate order, concurrent spouse, and share limits', () => {
    const requiredPhrases = [
      'A death in the family does not set just one legal process in motion.',
      'Separate consideration must be given to who the heirs are, which assets and debts form part of the estate, whether the surviving spouse has a separate marital-property claim, who will exercise parental rights and assume parental duties concerning any minor child, whether guardianship of a minor is necessary, and how property belonging to the child will be protected.',
      'These issues may affect one another, but their legal bases and the order in which they should be analyzed are not the same.',
      'Article 1138 places statutory heirs other than the spouse in the following order: descendants, parents, siblings, and grandparents.',
      'If an heir exists in a higher rank, an heir in a lower rank generally does not inherit ahead of that person.',
      'Even within the same rank, the timing of deaths, legal parentage, adoption, and succession by representation must be checked',
      'The surviving spouse is not a lower-ranking relative within the order set by Article 1138, but inherits concurrently with the heirs in the rank that actually applies under Article 1144.',
      'The precise concurrent share may vary depending on the rank with which the spouse inherits.',
      'The opening of succession does not immediately make each heir the sole owner of a particular bank deposit or parcel of real property.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks wills, reserved portions, estate identification, and governing-law issues', () => {
    const requiredPhrases = [
      'A valid will may provide for a distribution different from intestate succession.',
      'Its form, the testator’s testamentary capacity, its interpretation and enforceability, and restrictions imposed by mandatory rules, including reserved portions, must all be examined.',
      'if the will addresses only some assets, intestate-succession rules may apply to the remainder',
      'Before calculating inheritance shares, the inventory and legal character of the estate must first be established.',
      'The relevant materials should confirm not only real property, bank deposits, securities, business interests, receivables, and personal property, but also the decedent’s debts, guarantee obligations, unpaid taxes, and funeral-related expenses.',
      'No conclusion should be based on registered or account title alone; beneficial ownership, shares in jointly titled property, third-party rights, and security interests should also be investigated.',
      'Benefits with separately designated beneficiaries, such as insurance proceeds or retirement benefits, may be treated differently from estate property depending on the contract and applicable law.',
      'Trust property requires review of the trust arrangement and beneficial interests, while lifetime gifts or transfers may raise issues of recovery, inclusion, or reserved portions.',
      'If there are foreign accounts or real property, the law of the place where the property is located and Taiwan’s choice-of-law rules must also be considered.',
      'An estate investigation is not limited to locating rights; it must also identify debts and procedural risks.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks the separate Article 1030-1 claim, exclusions, debts, and adjustment', () => {
    const requiredPhrases = [
      'This claim compares, under statutory criteria, the increase in each spouse’s property acquired during marriage when the statutory marital-property regime ends.',
      'Its legal basis, the party against whom it is asserted, and the property included in the calculation differ from those of the inheritance share arising because the surviving spouse is an heir.',
      'If the claim is established, its result may need to be reflected before the property remaining with the decedent is identified as the estate.',
      'Statutory exclusions may include property acquired by inheritance or gift and solatium, while debts incurred during marriage must also be considered.',
      'whether the spouses agreed to a different marital-property regime, when and why each asset was acquired, and the appropriate valuation date',
      'Article 1030-1 permits a court to adjust the distribution amount if an equal distribution would be manifestly unfair.',
      'The existence and amount of the claim therefore cannot be predetermined merely by comparing registered title or the length of the marriage.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks inherited-debt limits, misconduct, waiver formalities, and deadlines', () => {
    const requiredPhrases = [
      'Liability for inherited debts is generally limited to the value of the property acquired through inheritance.',
      'Conduct that may affect the statutory limitation of liability, such as concealing property or omitting it from the inventory, should also be avoided.',
      'public notice and payment to creditors',
      'Under Article 1174, an heir who wishes to waive an inheritance must make a written declaration to the court with jurisdiction within three months after learning of the right to inherit.',
      'Merely telling family members that the heir will take nothing, or refraining from using estate property, must not be treated as completing a waiver in the legally prescribed form.',
      exactDeadlineStatement,
      'Court documents for waiver of inheritance must not be confused with an estate-tax return filed with the tax authority.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expect(raw.split(exactDeadlineStatement)).toHaveLength(2);
  });

  it('locks parental rights, guardianship, appointment, and best-interests rules', () => {
    const requiredPhrases = [
      'Parental rights and duties may include the care and upbringing of a minor child, decisions about the child’s residence, legal representation, and management of the child’s property.',
      'Each authority must be exercised to protect the child’s personal and property interests, not for the parent’s own benefit.',
      'Parental rights and inheritance are legally separate issues.',
      'Under Article 1091 of Taiwan’s Civil Code, guardianship of a minor becomes relevant when the minor has no parent or when neither parent can exercise rights and assume duties concerning the child.',
      'The death of one parent alone must not be assumed to commence guardianship immediately.',
      'Under Article 1093, the parent who is last to exercise rights and assume duties concerning a minor may appoint a guardian for the minor by will.',
      'the statutory order under Article 1094 and the court-appointment rules under Article 1094-1 may apply',
      'the child’s age and ability to express views, the candidate’s relationship with and ability to care for the child, the suitability of the proposed property management, and the stability of the child’s living arrangements',
      'Relatives and other applicants authorized by law may, where statutory grounds exist, ask the court to appoint or replace a guardian or order another necessary measure.',
      'A guardian is not the same as a parent exercising parental rights and may have separate duties concerning the scope of authority, preparation of an inventory, reporting, and court supervision.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks a minor’s ownership, joint management, conflicts, records, and supervision', () => {
    const requiredPhrases = [
      'Separate property means property that belongs to the minor.',
      'Inherited bank deposits, real property, shares, and other rights should be clearly identified as the child’s property and managed separately in the child’s interests.',
      'the type of property, the need for a disposition, the adequacy of the consideration, and the plan for holding and using the proceeds',
      'For high-value or high-risk actions such as a sale of real property, creation of security, or business investment, it is also necessary to check whether permission under another law or a court procedure is required.',
      'A conflict of interest may arise where a parent and child are co-heirs of the same estate or are counterparties to a contract with each other.',
      'The special-representative system under Article 1086 should be considered',
      'whether the economic interests actually conflict',
      'rules on preparing an inventory, retaining supporting documents, separating income and expenditure, reporting to the court, and court supervision may apply',
      'A trust or insurance arrangement cannot be assumed to be safe based on the contract alone.',
      'the convenience of the property manager must not take priority over the child’s interests',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks cross-border factors, applicable regimes, and document requirements', () => {
    const requiredPhrases = [
      'The parties’ nationality, domicile and habitual residence, their center of life at the time of death, the location of property, a foreign marriage or divorce, and existing parental-rights orders may affect the governing law and jurisdiction.',
      'succession, the marital-property regime, parental rights, guardianship, and property registration may be subject to different connecting factors',
      'Taiwan’s Act Governing the Choice of Law in Civil Matters Involving Foreign Elements is the starting point for determining the governing law of a civil relationship with foreign elements.',
      'the court’s international jurisdiction, recognition and enforcement of foreign judgments, treaties, and the law of the other country must also be examined',
      'Foreign marriage and divorce certificates and parentage documents may require an apostille or consular legalization and a translation.',
      'whether the judgment is final, whether due process was observed, and whether it can be recognized in Taiwan',
      'Taiwan estate-tax filing overlaps with foreign inheritance or gift tax, foreign financial-account reporting, or real-property transfer taxes',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses the exact six-item checklist starts and adds the required practical detail', () => {
    const checklistStarts = [
      '1. Verify death certificates and death-registration records, family relationships and Taiwan household-registration records, marriage, divorce, and adoption records, and existing court orders.',
      '2. Investigate real property, bank deposits, investment assets, business interests, personal property, and receivables, while also organizing loans, guarantees, taxes, and contractual liabilities.',
      '3. Review the original will and its method of execution, testamentary capacity, witness or notarization requirements, the executor, and any legacy.',
      '4. Calculate statutory inheritance shares separately from the residual-property distribution claim.',
      '5. Identify property belonging to a minor and determine the scope of legal representation and parental or guardian management, any conflict of interest, and whether a special representative is needed.',
      '6. Separate by agency the court procedures for waiver of inheritance, an estate inventory, guardianship, and a special representative; the tax authority’s estate-tax filing; household-registration reporting; and property-registration procedures.',
    ];
    const requiredDetails = [
      'authentication, translation, and consistency in the spelling of names',
      'registered and beneficial ownership, insurance beneficiaries, trusts, jointly owned property, and records of lifetime transfers',
      'how a valid will changes the distribution and the restrictions imposed by mandatory rules, including reserved portions',
      'the calculation base, debts, exclusions, valuation date, and supporting evidence for each system',
      'keeping accounts, books, and disposition proceeds separate from an adult’s personal property',
      'Check the jurisdiction, starting date, required documents, opportunity to supplement, and availability of an extension for each procedure',
      'record where each original is kept and its issue date or reference date',
      'Access to a minor’s personal and financial information should be limited to the people and institutions that need it.',
      'urgency does not authorize a disposition by someone who lacks authority',
    ];

    let previousIndex = -1;
    for (const item of checklistStarts) {
      const index = parsed.content.indexOf(item);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    expect(parsed.content.match(/^\d+\. /gm)).toHaveLength(6);
    for (const detail of requiredDetails) {
      expect(raw).toContain(detail);
      expect(post?.content).toContain(detail);
    }
  });

  it('uses only the exact five official and three internal Markdown links', () => {
    const markdownLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g),
      (match) => match[0],
    );
    const externalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((https?:\/\/[^)]+)\)/g),
      (match) => match[1],
    );

    expect(markdownLinks).toEqual([...officialLinks, ...internalLinks]);
    expect(externalTargets).toEqual(officialUrls);
    for (const url of officialUrls) {
      expect(parsed.content.split(url)).toHaveLength(2);
    }
    for (const link of [...officialLinks, ...internalLinks]) {
      expect(raw.split(link)).toHaveLength(2);
    }
    const sourceUseCaution =
      'On the official legislation pages, check the dates of amendment and entry into force, and use the English text only as an aid when comparing this English explanation with the original provisions. The Judicial Yuan form and the Taiwan Tax Portal guidance provide general preparation guidance, but the jurisdiction and filing requirements for an individual matter should be confirmed separately against the receiving agency’s latest instructions.';
    expect(raw).toContain(sourceUseCaution);
    expect(post?.content).toContain(sourceUseCaution);
  });

  it('ends with the exact disclaimer and author and nothing else', () => {
    expect(raw.trimEnd().endsWith(exactEnding)).toBe(true);
    expect(raw.trimEnd()).toMatch(
      /facts of the matter\.\n\n\*\*Wei Tseng \(曾雋崴\), Taiwan Attorney\*\*$/,
    );
  });

  it('freezes exact visible English words, calculated read time, and SHA-256', () => {
    const visibleWordCount = countVisibleEnglishWords(parsed.content);
    const calculatedMinutes = Math.ceil(visibleWordCount / 200);
    const sourceSha256 = crypto
      .createHash('sha256')
      .update(raw)
      .digest('hex');

    expect(visibleWordCount).toBeGreaterThanOrEqual(2_000);
    expect(visibleWordCount).toBe(3_696);
    expect(calculatedMinutes).toBe(19);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes} min read`);
    expect(post?.readTime).toBe(`${calculatedMinutes} min read`);
    expect(sourceSha256).toBe(
      '4eba0a2d7d1f20abb1ce635a179c67975a452e5ba0472997f399ad2ab182b226',
    );
  });

  it('resolves the canonical and inheritance-custody alias identically', () => {
    expect(post).toBeDefined();
    expect(aliasPost).toBeDefined();
    expect(aliasPost?.slug).toBe(post?.slug);
    expect(aliasPost?.title).toBe(post?.title);
    expect(aliasPost?.content).toBe(post?.content);
    expect(aliasPost?.faq).toEqual(post?.faq);
  });

  it('removes identities, media, speculation, private detail, and overstatements', () => {
    const serialized = JSON.stringify({
      raw,
      parsedContent: parsed.content,
      postTitle: post?.title,
      postContent: post?.content,
      postFaq: post?.faq,
    });
    const forbiddenLiterals = [
      '구준엽',
      '서희원',
      '왕소비',
      '서희제',
      '具俊曄',
      '徐熙媛',
      '汪小菲',
      '徐熙娣',
      'Koo Jun-yup',
      'Barbie Hsu',
      'Wang Xiaofei',
      'Dee Hsu',
      'クー・ジュンヨプ',
      '大S',
      'SBS',
      'SBS News',
      'SBS뉴스',
      'SBS新聞',
      'SBSニュース',
      'Harlem Yu',
      'reasonable to infer',
      'Most of the estate',
      'lawsuits on two fronts',
      'opposition lawsuit',
      'the two children',
      'school transfer',
      'leave Taiwan',
      'wishes of the minor children',
      'principle of least disruption',
      'automatically becomes',
      'without any lawsuit procedure',
      'no lawsuit is required',
      'sole holder of parental rights',
      'family cannot oppose',
      'can solely manage the children’s property',
      'can freely manage the child’s property',
      'a will has no effect',
      'embezzling the estate',
      'monopolizing the estate',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(serialized).not.toContain(forbidden);
    }
    expect(serialized).not.toMatch(
      /Koo\s+Jun[-\s]?yup|Barbie\s+Hsu|Wang\s+Xiaofei|Dee\s+Hsu|Harlem\s+Yu/i,
    );
    expect(serialized).not.toMatch(
      /(?:^|[^A-Za-z])SBS(?:\s*(?:News|뉴스|新聞|ニュース))?(?:[^A-Za-z]|$)/i,
    );
    expect(raw).not.toMatch(
      /(?:estate|inheritance)[^.\n]*(?:worth|valued|value|amount)[^.\n]*(?:NT\\?\\$|TWD|USD|dollars?)\s*[\d,.]+/i,
    );
    expect(raw).not.toMatch(
      /(?:estate|property)[^.\n]*(?:mostly|most|primarily)[^.\n]*(?:premarital|pre-marital|postmarital|post-marital)[^.\n]*(?:infer|assume|likely|appears)/i,
    );
    expect(raw).not.toMatch(
      /(?:family|relative|spouse|parent|child)[^.\n]*(?:lawsuit|litigation|dispute)[^.\n]*(?:will|likely|expected|predict)/i,
    );
    expect(raw).not.toMatch(
      /(?:custody|parental rights)[^.\n]*(?:automatically|without[^.\n]*court|no[^.\n]*(?:lawsuit|court)[^.\n]*required)/i,
    );
    expect(raw).not.toMatch(
      /(?:parent|guardian)[^.\n]*(?:may|can|is free to)[^.\n]*(?:freely|unrestricted|unilaterally)[^.\n]*(?:manage|use|dispose)/i,
    );
    expect(raw).not.toMatch(
      /(?:will|testament)[^.\n]*(?:has no effect|is ineffective|is invalid)[^.\n]*(?:without|regardless|because)/i,
    );
  });

  it('contains no locale leakage, invisible text, emoji, or extra author form', () => {
    const serialized = JSON.stringify({
      raw,
      parsedContent: parsed.content,
      postTitle: post?.title,
      postContent: post?.content,
      postFaq: post?.faq,
    });
    const withoutExactAuthor = serialized.replace(/曾雋崴/g, '');

    expect(withoutExactAuthor).not.toMatch(
      /[\p{Script=Han}\p{Script=Hangul}\p{Script=Hiragana}\p{Script=Katakana}]/u,
    );
    expect(serialized).not.toMatch(/\/(?:ko|zh-hant|ja)(?:\/|["')])/);
    expect(serialized).not.toMatch(/[\uFEFF\u00A0\u200B]/u);
    expect(serialized).not.toMatch(/\p{Extended_Pictographic}/u);
    expect((raw.match(/曾雋崴/g) ?? [])).toHaveLength(1);
    expect(raw).not.toContain('曾俊瑋');
  });
});
