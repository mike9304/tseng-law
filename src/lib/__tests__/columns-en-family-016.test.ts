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
  'Under Article 1089 of Taiwan’s Civil Code, when one parent cannot exercise rights and assume duties concerning a minor child, the other parent ordinarily does so. Accordingly, if the surviving parent retains parental rights and no contrary court order exists, that parent ordinarily continues to exercise parental rights and assume parental duties. Existing orders, statutory grounds for restriction or suspension, conflicts of interest, cross-border factors, and the child’s best interests may still require judicial consideration.';
const faq4Answer =
  'No. Under Articles 1087 and 1088 of Taiwan’s Civil Code, property acquired by a minor through inheritance is the child’s separate property; the parent or guardian does not become its beneficial owner. Management, use, collection of income, legal representation, and disposition must be handled in the child’s interests. A conflict of interest or a significant disposition may require a special representative or court involvement. Parental management does not permit unrestricted unilateral use of the child’s inherited property.';
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
  'The Ministry of Finance’s Taiwan Tax Portal page “Inheritance Procedures and Required Documents” was updated on June 25, 2026. It describes general three-month periods for court procedures concerning an estate inventory and waiver of inheritance, and the general six-month period for filing an estate tax return. The starting date, extensions, exceptions, and jurisdiction must still be checked for the matter at hand; this general guidance must not be used to calculate an individual deadline.';
const exactEnding = `---

This article provides general educational information about Taiwan’s law of succession, marital-property regimes, parental rights and duties, and guardianship of minors. It is not legal advice for any particular inheritance or family matter. The applicable law, procedures, and outcome may vary with the identity of the heirs, any will, the assets and debts, the marital-property regime, existing court orders, and cross-border factors. Before calculating a deadline for waiver of inheritance or tax filing, or disposing of property, confirm the current official materials and the facts of the matter.

**Wei Tseng (曾雋崴), Taiwan Attorney**`;
const expectedFrontmatter = `---
title: "Taiwan Inheritance and Parental Rights: A Guide for Surviving Families"
url: "https://www.wei-wei-lawyer.com/post/taiwan-inheritance-custody-analysis"
lastmod: "2026-07-25"
date_display: "September 13, 2025"
read_time: "18 min read"
categories:
  - "Taiwan Legal Information"
featured_image: "../images/016-taiwan-inheritance-custody-analysis/featured-generic.webp"
faq:
  - q: "If there is no will and the only heirs are a surviving spouse and two children, how are the intestate shares calculated?"
    a: "Under Articles 1138 and 1144 of Taiwan’s Civil Code, the surviving spouse inherits concurrently with the heirs in the applicable statutory rank, and descendants are first in the statutory order. If the only relevant heirs are a surviving spouse and two children, there is no valid will, and no waiver, disqualification, succession by representation, or other material fact changes the result, each would ordinarily receive a one-third share. This is a hypothetical illustration, not a conclusion about any actual estate."
  - q: "Is a surviving spouse’s residual-property distribution claim the same as an inheritance share?"
    a: "No. A residual-property distribution claim under Article 1030-1 of Taiwan’s Civil Code is a separate claim that a surviving spouse may assert if the statutory requirements are met; it must be analyzed separately from inheritance. Not every asset acquired during marriage enters the calculation, and the surviving spouse does not necessarily receive half of the estate. The marital-property regime, the reason and time of acquisition of each asset, debts, and statutory exclusions must be examined on the facts."
  - q: "What happens to parental rights and duties when one parent dies?"
    a: "Under Article 1089 of Taiwan’s Civil Code, when one parent cannot exercise rights and assume duties concerning a minor child, the other parent ordinarily does so. Accordingly, if the surviving parent retains parental rights and no contrary court order exists, that parent ordinarily continues to exercise parental rights and assume parental duties. Existing orders, statutory grounds for restriction or suspension, conflicts of interest, cross-border factors, and the child’s best interests may still require judicial consideration."
  - q: "May a surviving parent freely use property that a minor child inherits?"
    a: "No. Under Articles 1087 and 1088 of Taiwan’s Civil Code, property acquired by a minor through inheritance is the child’s separate property; the parent or guardian does not become its beneficial owner. Management, use, collection of income, legal representation, and disposition must be handled in the child’s interests. A conflict of interest or a significant disposition may require a special representative or court involvement. Parental management does not permit unrestricted unilateral use of the child’s inherited property."
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
      read_time: '18 min read',
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
      readTime: '18 min read',
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
      'Intestate succession identifies heirs and inheritance shares when no effective will controls the distribution.',
      'Estate administration identifies what the decedent owned, what debts and expenses must be addressed, and what remains for distribution.',
      'The child owns that property, while a parent, guardian, legal representative, special representative, or court may have a defined role in protecting or administering it.',
      'Article 1138 places relatives other than the spouse in four ranks: descendants, parents, siblings, and grandparents.',
      'Article 1144 then determines the surviving spouse’s concurrent share according to the rank involved.',
      'Relevant questions include legal parentage, adoption, the degree of relationship, and the order of death.',
      'A descendant may take through succession by representation if the statutory conditions are met.',
      'An apparent heir may be affected by disqualification or may complete a waiver of inheritance.',
      'An inheritance share is an undivided legal proportion, not an automatic assignment of a particular bank account, parcel of land, security, or personal item.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks wills, reserved portions, estate identification, and governing-law issues', () => {
    const requiredPhrases = [
      'A valid will may alter the distribution that would otherwise follow intestate succession.',
      'A will that disposes of only part of the estate may leave the remainder that the will does not address to be distributed under the intestate-succession rules.',
      'the authority of any executor',
      'The will may create a legacy, direct a method of partition, or establish another arrangement, but it remains subject to reserved portions and other mandatory rules.',
      'Legal title and beneficial ownership may differ; co-ownership proportions, nominee arrangements, liens, mortgages, and third-party claims require separate attention.',
      'Insurance proceeds require review of beneficiary designations and policy terms.',
      'Retirement, pension, employment, and death benefits may follow the governing statute, plan, or contract.',
      'Trust property requires examination of title, beneficial interests, the trust instrument, and the effect of the settlor’s or beneficiary’s death.',
      'Lifetime gifts and transfers may affect ownership, tax, reserved-portion, collation, or avoidance questions.',
      'The governing law may not be uniform across every issue or asset.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks the separate Article 1030-1 claim, exclusions, debts, and adjustment', () => {
    const requiredPhrases = [
      'Article 1030-1 concerns dissolution of the statutory marital-property regime.',
      'it compares the remainder of property acquired by each spouse during marriage after deducting relevant marital debts',
      'The statutory calculation excludes property acquired through inheritance or gift and excludes solatium.',
      'The right, the calculation base, and the parties to the claim differ from the rules of succession.',
      'resolve any qualifying residual-property distribution claim, and only then identify the property that belongs to the decedent’s estate',
      'Article 1030-1 permits a court to adjust or waive the distribution amount when an equal division would be manifestly unfair',
      'No entitlement can be inferred from the length of the marriage, registered title, or the date of acquisition alone.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks inherited-debt limits, misconduct, waiver formalities, and deadlines', () => {
    const requiredPhrases = [
      'It generally limits the heir’s liability for the decedent’s debts to the value of property acquired from the estate.',
      'An heir may lose the benefit of limited liability for conduct such as gross concealment of estate property, gross falsification of the inventory, or disposition intended to defraud the decedent’s creditors.',
      'public notice to creditors',
      'Under Article 1174, an heir who chooses waiver of inheritance must make a written declaration to the court within three months after learning of the right to inherit.',
      'An oral statement, a private family agreement, failure to collect property, or non-participation in discussions does not complete the statutory court procedure.',
      exactDeadlineStatement,
      'Court filings, estate-tax filings, household-registration steps, and property-registration work are separate procedures administered by different institutions.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expect(raw.split(exactDeadlineStatement)).toHaveLength(2);
  });

  it('locks parental rights, guardianship, appointment, and best-interests rules', () => {
    const requiredPhrases = [
      'The correct legal frame is the exercise of parental rights and assumption of parental duties, not an automatic custody award.',
      'daily care and upbringing; decisions about residence, medical care, and education; handling civil-status matters; legal representation; and management of the child’s property',
      'Parental rights do not determine inheritance.',
      'Article 1091 makes guardianship of a minor relevant when the minor has no parent or when both parents cannot exercise rights and assume duties concerning the child.',
      'The death of one parent does not by itself commence guardianship if the other parent can lawfully continue to act.',
      'Under Article 1093, a parent who is exercising rights and assuming duties concerning a minor may appoint a guardian by will.',
      'Article 1094 provides a statutory order for determining a guardian:',
      'grandparents living in the same household as the minor, older siblings living in the same household as the minor, and grandparents not living in that household',
      'Article 1094-1 requires the court to use the ward’s best interests when selecting or changing a guardian.',
      'Potential applicants include the minor, qualifying relatives, the public prosecutor, the competent authority, and other interested persons within the statutory framework.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks a minor’s ownership, joint management, conflicts, records, and supervision', () => {
    const requiredPhrases = [
      'Article 1087 identifies property acquired by a minor through inheritance, gift, or another gratuitous title as the minor’s separate property.',
      'Article 1088 provides for joint parental management and recognizes rights of use and collection of income, while prohibiting disposition except for the child’s interests.',
      'Accounts, securities, title documents, distributions, income, expenses, tax records, and supporting receipts should identify the child’s ownership.',
      'Personal and estate funds should not be commingled with the minor’s property.',
      'Parents are ordinarily the legal representatives of their minor child under Article 1086.',
      'When a parent’s interest conflicts with the child’s interest, however, the parent cannot provide neutral representation for that transaction or proceeding.',
      'The court may appoint a special representative on its own initiative or on an authorized application.',
      'additional guardianship rules may govern preparation of an inventory, reporting, accounts, restrictions on disposition, and court supervision',
      'A trust or insurance arrangement is not automatically safe merely because it exists.',
      'The convenience of the person managing the property must not take priority over the child’s interests.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks cross-border factors, applicable regimes, and document requirements', () => {
    const requiredPhrases = [
      'nationality, domicile, habitual residence, place of death, and family status',
      'the location and legal character of each asset; a foreign marriage or divorce; an existing parental-rights order',
      'The Act Governing the Choice of Law in Civil Matters Involving Foreign Elements is a necessary starting point, together with any other applicable domestic statute, treaty, procedural rule, or foreign legal regime.',
      'International jurisdiction must be analyzed separately from governing law.',
      'A foreign judgment or order may require recognition and enforcement before it can be relied upon in Taiwan.',
      'Foreign wills, probate grants, death certificates, marriage or divorce records, birth or adoption records, and powers of attorney may require certified copies, authentication, verification, notarization, or translation.',
      'estate, inheritance, gift, or income tax; any available rules for adjusting, relieving, or crediting overlapping tax burdens',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses the exact six-item checklist starts and adds the required practical detail', () => {
    const checklistStarts = [
      '1. Verify death records, family relationships, household-registration records, and existing court orders.',
      '2. Identify assets, debts, title, insurance beneficiaries, trusts, and lifetime transfers.',
      '3. Review the will’s form, validity, operative provisions, and reserved portions.',
      '4. Calculate intestate shares separately from any residual-property distribution claim.',
      '5. Determine ownership and representation of a minor’s property and identify conflicts of interest.',
      '6. Confirm the applicable court, tax, household-registration, and property-registration procedures and deadlines.',
    ];
    const requiredDetails = [
      'original or certified death and status documents',
      'relevant valuation dates',
      'Preserve property, transaction histories, receipts, and digital records',
      'the chain of custody',
      'authentication and an accurate translation',
      'retain receipts for every use of funds',
      'proof of receipt',
      'Preserve private family records securely',
      'Seek urgent preservation measures',
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
      "When using these sources, verify amendment and effective dates on the official legislation pages. Treat the linked English Civil Code text as an auxiliary reference and check it against the official original. Treat the Judicial Yuan form and the Taiwan Tax Portal page as general preparation guidance, and confirm jurisdiction and filing requirements against the receiving agency's latest instructions.";
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
    expect(visibleWordCount).toBe(3_519);
    expect(calculatedMinutes).toBe(18);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes} min read`);
    expect(post?.readTime).toBe(`${calculatedMinutes} min read`);
    expect(sourceSha256).toBe(
      '6d7f243be0e1cc87ccc35d4c402b90cf9d5d9f84f47125edff9f69b6504cfcce',
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
