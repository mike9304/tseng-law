import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ColumnContent from '@/components/ColumnContent';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-en/007-taiwan-divorce-lawsuit-qna.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const canonicalSlug = 'taiwan-divorce-lawsuit-qna';
const post = getColumnPost(canonicalSlug, 'en');
const aliasPost = getColumnPost('divorce-qna', 'en');

const title = 'Taiwan Divorce Q&A: Mediation, Litigation, Property, and Children';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-divorce-lawsuit-qna';
const featuredImage =
  '../images/007-taiwan-divorce-lawsuit-qna/featured-01.jpg';
const bodyImage = `![Illustration of Taiwan divorce procedure and family-law consultation topics](${featuredImage})`;
const introParagraph1 =
  'In a Taiwan divorce matter, it is necessary to distinguish among the methods of ending the marriage and the related issues of updating household-registration records, the divorce’s effect abroad, matrimonial property, damages, post-divorce spousal support, decisions concerning minor children, and child support. Even where the same facts may serve as evidence for multiple claims, each right has different elements and effects, matters to be proved, and time limits.';
const introParagraph2 =
  'This is particularly important for families connected to more than one country or region, such as Korea and Taiwan, because the appropriate procedure cannot be determined solely by one spouse’s nationality or a marriage-registration record. The parties should first confirm their current center of life, the status of any existing proceedings and registrations, where relevant documents were executed, where the children reside, and where assets are located, thereby reducing unnecessary duplicative proceedings and gaps in enforcement.';
const staleGenericIntro =
  'This guide explains Taiwan divorce routes, household registration, court procedure, and judicial-divorce grounds in neutral legal terms. It is general information only. Jurisdiction, applicable law, recognition, facts, evidence, existing orders, and current official rules can change the analysis for any individual matter.';

const faq1Answer =
  'Under Civil Code Article 1050, a Taiwan mutual-consent divorce is effective only when three requirements are met together: the divorce is in writing; at least two witnesses who personally perceived and confirmed both spouses’ genuine mutual intent to divorce sign the instrument; and the divorce is registered with the household-registration authority. A signed private agreement alone does not complete the divorce, because registration is constitutive for this path. Where foreign elements are involved, parties must also examine applicable law, authentication and translation of documents, and any registration or recognition steps required in another jurisdiction. Always check the current official household-registration guide and the competent office for filing details.';
const faq2Answer =
  'No. When a court orders a party or legal representative to appear in person and that person fails to appear without just cause, Family Act Article 13 applies Civil Procedure Code Article 303 mutatis mutandis. The first fine for unjustified nonappearance may be up to NTD 30,000, and repeated sanctions may follow after further lawful notice and another unjustified failure to appear. Compulsory appearance by arrest is not available. These rules do not mean both spouses must always sit together in the same room. Whether remote participation, separate or safety arrangements, or representation is permitted depends on the court’s decision under law and the circumstances of the case.';
const responsibleSpouseParagraph =
  'The proviso to current Civil Code Article 1052, paragraph 2 provides that, where a serious cause for the breakdown of the marriage is attributable solely to one spouse, only the other spouse may, in principle, petition for divorce. However, Taiwan Constitutional Court Judgment 112-Hsien-Pan-4 held the proviso unconstitutional to the extent that it completely deprives the responsible spouse of any opportunity to divorce, without considering whether a considerable period has elapsed since the serious cause arose or whether it has continued for a considerable period, and thereby produces a manifestly harsh result in an individual case. Because the proviso remains in the statutory text, a petition by the responsible spouse should not be treated as automatically available or automatically barred; the outcome depends on how the court applies the judgment’s reasoning to the specific facts.';
const responsibleSpouseJudgmentSentence =
  'The Court held the proviso unconstitutional to the extent that it completely deprives the solely responsible spouse of any opportunity to divorce, without considering whether a considerable period has elapsed since the serious cause arose or whether it has continued for a considerable period, and thereby produces a manifestly harsh result in an individual case.';
const faq3Answer = responsibleSpouseParagraph;
const faq4Answer =
  'No single factor is conclusive. Registered title, beneficial-ownership or nominee-registration theories, source-of-funds evidence such as premarital savings used for a down payment or loan installments, gifts, loans, reimbursement or other claims, and the separate residual-property calculation under Civil Code Article 1030-1 raise different legal questions. Title in one spouse’s name does not by itself defeat every ownership, contractual, or reimbursement claim, and premarital funding does not by itself transfer title or fix the residual-property result. Parties must examine the real agreement, acquisition timing and cause, fund flows, debts, gratuitous acquisitions, and supporting records. Ownership issues and the Article 1030-1 equal-difference calculation after exclusions and possible court adjustment remain distinct inquiries.';
const faq5Answer =
  'No. Residual-property distribution under Civil Code Article 1030-1, divorce damages under Article 1056, post-divorce support under Article 1057, ongoing child support, claims arising from unmarried cohabitation that are not divorce rights, and tort or other claims against a third party are separate bases with different elements, proof, and limitation analysis. Only the Article 1030-1 residual-property claim is extinguished if not exercised within two years from knowledge of the residual-property difference and, in any event, within five years from termination of the statutory regime. That two-year and five-year rule must not be treated as a universal period for damages, post-divorce support, child support, ownership, or third-party claims. Each right’s accrual, knowledge, and limitation rule must be checked on its own terms.';
const faq6Answer =
  'Under Civil Code Articles 1055 and 1055-1, arrangements for the exercise and assumption of rights and duties regarding a minor child, and related contact or visitation, are governed by the child’s best interests. Parents may agree, but the court may decide or change an arrangement when agreement is absent, fails, or is adverse to the child. The court considers all relevant circumstances, including continuity and safety, care history, each parent’s capacity and willingness, whether a parent facilitates the child’s relationship with the other parent, the child’s views where appropriate, and reports or information from competent authorities or child-welfare professionals as the law allows. Marital fault is not a basis for punishment, and no automatic income-based or fault-based rule decides the result.';

const faq = [
  {
    q: 'What makes a Taiwan mutual-consent divorce effective?',
    a: faq1Answer,
  },
  {
    q: 'Must both spouses always appear together in court mediation?',
    a: faq2Answer,
  },
  {
    q: 'Can the spouse responsible for marital breakdown petition for judicial divorce?',
    a: faq3Answer,
  },
  {
    q: 'Does paying for a house or holding title decide ownership and residual-property distribution?',
    a: faq4Answer,
  },
  {
    q: 'Are residual-property distribution, divorce damages, and post-divorce support the same claim or subject to one five-year period?',
    a: faq5Answer,
  },
  {
    q: 'How does a Taiwan court decide issues concerning a minor child?',
    a: faq6Answer,
  },
];

const headings = [
  '1. Three Divorce Paths and First Cross-Border Checks',
  '2. Mutual-Consent Divorce and Household Registration',
  '3. Court Mediation, Litigation, Appearance, and Review',
  '4. Judicial-Divorce Grounds and the Responsible-Spouse Proviso',
  '5. Foreign Marriage, Foreign Divorce, and Taiwan Records',
  '6. House Title, Premarital Funds, and Residual-Property Distribution',
  '7. Damages, Post-Divorce Support, Unmarried Partners, and Third Parties',
  '8. Minor Children, Parental Rights, and the Best-Interests Standard',
  '9. Child Support, Contact, Enforcement, and Interim Protection',
  '10. Cross-Border Relocation with a Child',
  '11. Evidence and Practical Preparation',
  '12. Official Sources',
  '13. Related Guidance',
];

const officialLinks = [
  '[Taiwan Civil Code](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000001)',
  '[Official English Translation of the Taiwan Civil Code](https://mojlaw.moj.gov.tw/ENG/LawContentE.aspx?LSID=FL001351)',
  '[Family Act](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0010048)',
  '[Civil Procedure Code Article 303](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=303&pcode=B0010001)',
  '[Regulations Governing Family Non-Contentious Matter Interim Measures](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0010056)',
  '[Household Registration Act](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0030006)',
  '[Ministry of the Interior Divorce Registration Guide](https://www.ris.gov.tw/documents/html/2/3/1/384.html)',
  '[Act Governing the Choice of Law in Civil Matters Involving Foreign Elements](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000007)',
  '[Constitutional Court Judgment 112-Hsien-Pan-4](https://cons.judicial.gov.tw/docdata.aspx?fid=52&id=310013)',
  '[Official English Text of Constitutional Court Judgment 112-Hsien-Pan-4](https://cons.judicial.gov.tw/en/docdata.aspx?fid=5534&id=352234)',
];
const officialUrls = officialLinks.map(
  (link) => link.match(/\((https?:\/\/[^)]+)\)$/)?.[1] ?? '',
);
const internalLinks = [
  '[Taiwan Family Law Services](/en/services/family)',
  '[Taiwan Litigation Lawyer Guide](/en/taiwan-litigation-lawyer)',
  '[Contact Us](/en/contact)',
];

const disclaimer =
  'This article is general legal information only and is not legal advice. Jurisdiction, applicable law, recognition of foreign divorces or judgments, the specific facts and evidence, existing agreements or court orders, and current official rules may all change the analysis and result. Before taking action, calculate any application, review, limitation, or enforcement period from the correct triggering event for the specific right or procedure involved.';
const author = '**Wei Tseng (曾雋崴), Attorney-at-Law**';
const exactEnding = `- ${internalLinks[2]}

${disclaimer}

${author}`;

const article1052Paragraph1Heading =
  '### Article 1052 paragraph 1: ten grounds';
const staleArticle1052TranslationInstruction =
  'Civil Code Article 1052 paragraph 1 lists ten specific grounds for judicial divorce. Translate them accurately; do not expand or shrink a statutory term into a broader colloquial ground.';
const article1052Paragraph1ReaderSentence =
  'Civil Code Article 1052 paragraph 1 sets out ten grounds on which a spouse may petition for judicial divorce when any of the following applies to the other spouse:';
const missingSpouseTailParagraph =
  'A police missing-person report may be important evidence, but the statute does not make it a universal mandatory precondition. A prior action demanding cohabitation is not a universal statutory precondition either. Several months away from home, without more, is not itself a divorce ground. The court examines continuity, intent, proof of life-or-death uncertainty, and whether a serious cause is established under the applicable paragraph.';
const sexualIntercourseConsequencesParagraph =
  'Whether consensual sexual intercourse with a person other than one’s spouse constitutes a ground under Article 1052, paragraph 1 must be assessed in light of the precise facts, the statutory requirements, and any applicable time limits. The existence of that conduct does not, by itself, dictate the outcomes of a petition for judicial divorce, damages under Article 1056, residual-property distribution, post-divorce spousal support under Article 1057, the exercise and assumption of rights and duties regarding a minor child, or child support. Each issue is determined under its own requirements and applicable standards, including the child’s best interests where relevant.';
const foreignEffectSubsectionHeading =
  '### Recognition, effect, and registration';
const foreignRecognitionParagraph =
  'A statement that a divorce was completed under foreign law—or a foreign divorce certificate alone—does not complete every required Taiwan procedure. Conversely, not every foreign divorce requires the same recognition proceeding or the same documents. Taiwan’s required recognition or legal-effect determination and household registration may vary with whether the instrument is a court judgment or administrative certificate, its country of issue and form, and the parties’ current household-registration status.';
const article1017SubsectionHeading =
  '### Article 1017 classifications and presumptions';
const article10301SubsectionHeading =
  '### Article 1030-1 residual-property distribution';
const article1017Paragraph =
  'Civil Code Article 1017 distinguishes premarital property from property acquired during marriage and provides that property whose time of acquisition is difficult to prove is presumed to have been acquired during marriage. This is a starting point for classification and proof in calculating the matrimonial property regime; it is not a shortcut for determining ownership irrespective of registration or defeating the other spouse’s separate claims. Transfer records, sale and purchase agreements, loan agreements and repayment records, receipts, messages between the parties, tax records, registration records, and the basis and timing of acquisition must be considered together to reveal the parties’ actual legal relationship.';
const article10301ExclusionsParagraph =
  'Inherited property and other property acquired gratuitously, as well as solatium (consolation damages), are excluded from the statutory calculation. Relevant debts and the statutory rules governing dispositions made before termination of the matrimonial property regime must also be considered. Residual-property distribution is not a crude half-and-half split of every asset acquired during marriage, and it is not the same concept as common property under a different marital regime.';
const article10301AdjustmentParagraph =
  'Where equal division of the residual difference would be manifestly unfair, the court may adjust or waive distribution after considering the statutory circumstances. Neither extramarital sexual relations nor responsibility for the breakdown of the marriage automatically bars or reduces a claim for distribution of the residual-property difference. However, specific facts falling within the statutory adjustment factors—such as the concealment or disposition of property, contributions through household labor and childcare, and the overall circumstances of the spouses’ shared life and acquisition of property—may be separately pleaded and proved. Nor should it be assumed that the calculation under Article 1030-1 changes merely because the spouses have different nationalities.';
const article1056SubsectionHeading =
  '### Article 1056, Article 1057, and child support';
const article1056Paragraph =
  '**Article 1056** provides, in cases of judicial divorce, for claims against the other spouse responsible for the divorce, distinguishing pecuniary damages from non-pecuniary damages that are available only when separate statutory conditions are met. The conduct giving rise to liability, the resulting harm, causation, and the separate requirements for non-pecuniary damages must each be supported by evidence. The mere existence of facts concerning the breakdown of the marriage neither fixes a particular amount nor substitutes for a separate property claim.';
const completeParentalRightsSubsectionHeading =
  '### Complete parental rights and duties, not “custody” as an umbrella';
const childScopeParagraph =
  'Under Taiwan law, the precise concept is the **exercise and assumption of rights and duties regarding a minor child**. It may include the child’s residence, day-to-day care, educational and medical decisions, management of the child’s property, and legal representation. Terms such as “parental rights” or “custody” may be used as shorthand for convenience, but no single term fully translates the entire set of rights and duties under Taiwan law.';
const bestInterestsSubsectionHeading =
  '### Best interests and statutory factors';
const unresolvedIssuesSubsectionHeading =
  '### Divorce while other issues remain open';
const unresolvedIssuesParagraph =
  'If the requirements of the chosen route to divorce are satisfied, the marriage itself may be dissolved first even though some property or child-related issues remain unresolved. This should not, however, be treated as a shortcut that can be recommended in every case. The preservation and settlement of unresolved property; the child’s residence, care, medical treatment, and education; the agreements or court orders needed for child support and contact; and whether interim orders are needed to ensure safety and continuity of daily life while the dispute remains pending must all be considered together.';
const childSupportFactorsParagraph =
  'Under Civil Code Article 1116-2, parents’ duty to support a minor child continues after divorce. Child support is a parent–child obligation. It is distinct from Article 1057 post-divorce support for a qualifying former spouse. Do not treat the two claims as interchangeable, and do not use the Article 1030-1 residual-property limitation period as a universal deadline for child support. The specific allocation of support should be determined from evidence of the child’s living expenses, education costs, medical expenses, and any special needs, together with each parent’s income, assets, ability to provide support, and actual share of caregiving.';
const childSupportEnforcementParagraph =
  'For child-support enforcement, the wording of the existing enforceable instrument, the payment due dates, the unpaid amount, and the payment history are important. For contact or visitation enforcement, it is important whether the method and conditions of contact are sufficiently specific. Child-support payments and compliance with contact or visitation arrangements must not be withheld or traded against each other in retaliation. To protect the child’s day-to-day welfare, each obligation and procedure should be handled independently.';
const contactEnforcementFactorsParagraph =
  'There is no automatic right to immediate physical handover, use of force, a change of parental rights and duties, or punishment of the other parent merely because contact was blocked. The sequence and method of enforcement should be determined in light of the child’s age and views, current care and protection arrangements, the emotional impact of enforcement, and the child’s safety. Interim protection may be necessary where flight risk, retention, or safety is genuinely in issue, but the form of that protection is a court decision based on the instrument and the evidence.';
const bestInterestsFactorsParagraph =
  'Under Civil Code Article 1055-1, the court considers the child’s age, sex, and health; the number of children; the child’s views and needs for personality development; each parent’s age, occupation, conduct, health, financial means, and living circumstances; each parent’s willingness and attitude toward the child’s protection and upbringing; the emotional relationship between each parent and the child; and any circumstances in which one parent has interfered with the relationship between the other parent and the child. The court may hear the child’s views in the manner prescribed by law and may take into account investigations and opinions from competent authorities or child-welfare professionals. A parent’s higher income or responsibility for the breakdown of the marriage may be only one fact among many; neither is a sole criterion for the decision or a basis for rewarding or punishing a parent.';
const filingDocumentsParagraph =
  'Who may apply, whether filing through an agent is permitted, and which proof of identity, household-registration records, written divorce instrument, and other documents must be prepared should be determined by reference to the Ministry of the Interior’s household-registration guidance for divorce registration in force at the time of filing and confirmed with the competent household-registration office. Depending on the type of document and where it was prepared, a document prepared outside Taiwan may require authentication by a Taiwan overseas mission or another competent authority. If the official guidance so requires, an authenticated or notarized Chinese translation must also be submitted. No single fixed checklist applies unchanged to every cross-border case.';
const filingDocumentsPrefixMarker =
  '3. **Household registration.** Registration with the household-registration authority is constitutive for this path. Without registration, the private writing does not complete a Taiwan mutual-consent divorce.';
const courtResultsSubsectionHeading =
  '### Court results and Household Registration Act Articles 48 and 48-2';
const courtResultsFirstParagraph =
  'When a Taiwan divorce judgment becomes final or court mediation or settlement ends the marriage, either party may, in principle, apply for divorce registration with the household-registration authority. Registration of the court result is governed by the Household Registration Act rather than Article 1050’s constitutive sequence for mutual-consent divorce.';
const courtResultsOnlineParagraph =
  'Online filing is available only within the statutory application period. The thirty-day period is the general deadline for registering the court result, not a deadline exclusive to online filing.';
const mediationSubsectionHeading =
  '### Mediation and litigation as related but distinct stages';
const mediationIntroParagraph =
  'Family matters governed by the Family Act ordinarily proceed through court mediation before adjudication. Even a matter filed directly for adjudication may be deemed an application for mediation under the Act. Because there are exceptions involving the method of service or the nature of the matter, as well as rules governing transitions between procedures, however, not every case can be described as following a single immutable sequence. Mediation may address not only the parties’ intention to divorce but also related issues involving property, children, and the manner of payment, but the court may not confirm, without modification, an agreement that is detrimental to a minor child.';
const courtMediationOutcomeParagraphMarker =
  '**Court mediation or settlement,**';
const courtMediationOutcomeParagraph =
  '**Court mediation or settlement,** once established, terminates the marriage in the manner prescribed by law and has the same effect as a final and binding judgment. **Litigation** may continue under the applicable procedure if mediation is unsuccessful; for a divorce by judgment, what matters is that the judgment becomes final and binding.';
const expectedDurationParagraph =
  'The time required to resolve a case varies depending on service of process, the number of mediation sessions, the facts and evidence in dispute, any appraisals or investigations, child-related issues, international service, and how many levels of court proceedings are involved, so no fixed completion date can be given.';
const frozenBeforeFilingDocumentsSha256 =
  '07e7dcdcbd12687fd57000836158cac2cf8c9ed2e20a50f5c47b46f18b325d74';
const frozenCourtResultsSubsectionSha256 =
  'f71e4e842814428d9238d6747631dc644ea561f861c84f363a715a17a5ef3ce5';
const frozenSection3OnwardSha256 =
  'd027e9377d6f60b13c5bce29a5b76074906c9ec3d215e6b8aa17d2d51b099929';
const frozenSection4OutsideArticle1052IntroSha256 =
  '2ee68328f7e10ad0bbb1cde3593fe519967bf1672dba3d044b72bba2d2310813';
const frozenSection5OnwardSha256 =
  'b5da4108481baacdba8f5c9b7979e773d48fa3a3aabd95d350dec5770d9bb0c3';
const frozenSection1OnwardSha256 =
  'a63542d3d166d2faf977f62be5fd88ea183ab041497a285579260f5141a0e51c';
const frozenVisibleWordCount = 5_644;
const frozenSourceSha256 =
  '782d3da70d6d405f3608e8be0e27e5412f226338d09c26b49d2674b949e26210';

function countOccurrences(value: string, needle: string) {
  return value.split(needle).length - 1;
}

function sha256(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function firstParagraphAfter(content: string, heading: string) {
  return content.split(`${heading}\n\n`)[1]?.split('\n\n')[0];
}

function sectionBody(content: string, heading: string) {
  const sectionStart = content.indexOf(`## ${heading}`);
  const nextSection = content.indexOf('\n## ', sectionStart + 1);
  return content.slice(
    sectionStart,
    nextSection === -1 ? content.length : nextSection,
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
    .replace(/[“”‘’*_`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    visibleText.match(/[A-Za-z0-9]+(?:[.’'-][A-Za-z0-9]+)*/g)?.length ?? 0
  );
}

describe('English family column 007 — Taiwan divorce procedure Q&A', () => {
  it('publishes the exact complete frontmatter and loaded article identity', () => {
    expect(parsed.data).toEqual({
      title,
      url: sourceUrl,
      lastmod: '2026-07-25',
      date_display: 'September 13, 2025',
      read_time: '29 min read',
      categories: ['Taiwan Legal Information'],
      featured_image: featuredImage,
      faq,
    });
    expect(parsed.data.faq).toHaveLength(6);
    expect(post).toMatchObject({
      slug: canonicalSlug,
      title,
      date: '2026-07-25',
      dateDisplay: 'September 13, 2025',
      readTime: '29 min read',
      category: 'legal',
      categoryLabel: 'Legal Information',
      featuredImage:
        '/images/blog/007-taiwan-divorce-lawsuit-qna/featured-01.jpg',
      faq,
    });
    expect(parsed.data.url).toBe(sourceUrl);
    expect(raw).toContain(sourceUrl);
    expect(post?.title).toBe(title);
    expect(post?.faq).toEqual(faq);
    expect(post?.content).toContain(`## ${headings[0]}`);
    expect(post?.content).toContain(disclaimer);
  });

  it('uses the sole exact H1 followed immediately by the sole contracted image', () => {
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(parsed.content).toMatch(
      new RegExp(
        `^\\n# ${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n${bodyImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n`,
      ),
    );
    expect(
      Array.from(
        parsed.content.matchAll(/!\[[^\]]*\]\([^)]+\)/g),
        (match) => match[0],
      ),
    ).toEqual([bodyImage]);
    expect(countOccurrences(raw, featuredImage)).toBe(2);
    expect(post?.content).not.toMatch(/!\[[^\]]*\]\([^)]+\)/);
    expect(raw).not.toContain('img-01.jpg');
  });

  it('translates the complete two-paragraph Korean introduction and freezes section 1 onward', () => {
    const introStart =
      parsed.content.indexOf(`${bodyImage}\n\n`) + `${bodyImage}\n\n`.length;
    const firstSectionMarker = `## ${headings[0]}`;
    const firstSectionStart = parsed.content.indexOf(
      firstSectionMarker,
      introStart,
    );
    const intro = parsed.content.slice(0, firstSectionStart).slice(introStart);
    const section1Onward = parsed.content.slice(firstSectionStart);

    expect(introStart).toBeGreaterThan(`${bodyImage}\n\n`.length - 1);
    expect(firstSectionStart).toBeGreaterThan(introStart);
    expect(intro.trim().split('\n\n')).toEqual([
      introParagraph1,
      introParagraph2,
    ]);
    expect(countOccurrences(raw, introParagraph1)).toBe(1);
    expect(countOccurrences(raw, introParagraph2)).toBe(1);
    expect(raw).not.toContain(staleGenericIntro);
    expect(sha256(section1Onward)).toBe(frozenSection1OnwardSha256);
  });

  it('uses exactly the thirteen contracted H2 sections in order', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(headings);
  });

  it('repeats each exact FAQ answer twice and starts its assigned section with it', () => {
    const assignments = [
      [`## ${headings[1]}`, faq1Answer],
      [`## ${headings[2]}`, faq2Answer],
      [`## ${headings[3]}`, faq3Answer],
      [`## ${headings[5]}`, faq4Answer],
      [`## ${headings[6]}`, faq5Answer],
      [`## ${headings[7]}`, faq6Answer],
    ];

    for (const [heading, answer] of assignments) {
      expect(firstParagraphAfter(parsed.content, heading)).toBe(answer);
      expect(firstParagraphAfter(post?.content ?? '', heading)).toBe(answer);
      expect(countOccurrences(raw, answer)).toBe(2);
    }
  });

  it('locks one exact substantive proposition in its assigned section for all twenty-five legacy topics', () => {
    const legacyCoverage = [
      {
        number: 1,
        heading: headings[0],
        phrase:
          '**Mutual-consent divorce** is a private status act that becomes effective only when Civil Code Article 1050’s writing, witness, and household-registration requirements are all satisfied.',
      },
      {
        number: 2,
        heading: headings[4],
        phrase:
          'Completing a divorce under foreign local law does not, by itself, complete Taiwan household registration or prove Taiwan recognition.',
      },
      {
        number: 3,
        heading: headings[5],
        phrase:
          'A down payment or loan installment paid from premarital savings is relevant source-of-funds evidence. It does not by itself transfer registered title or dictate every later claim.',
      },
      { number: 4, heading: headings[2], phrase: faq2Answer },
      {
        number: 5,
        heading: headings[6],
        phrase:
          'Government average consumption statistics are not a binding formula that automatically sets Article 1057 support.',
      },
      {
        number: 6,
        heading: headings[5],
        phrase: article1017Paragraph,
      },
      { number: 7, heading: headings[6], phrase: faq5Answer },
      {
        number: 8,
        heading: headings[7],
        phrase: unresolvedIssuesParagraph,
      },
      {
        number: 9,
        heading: headings[1],
        phrase: filingDocumentsParagraph,
      },
      {
        number: 10,
        heading: headings[2],
        phrase: expectedDurationParagraph,
      },
      {
        number: 11,
        heading: headings[3],
        phrase: article1052Paragraph1ReaderSentence,
      },
      { number: 12, heading: headings[3], phrase: faq3Answer },
      {
        number: 13,
        heading: headings[2],
        phrase: mediationIntroParagraph,
      },
      {
        number: 14,
        heading: headings[6],
        phrase:
          '**Article 1057** concerns post-divorce support for a spouse without fault who falls into financial hardship because of judicial divorce.',
      },
      {
        number: 15,
        heading: headings[6],
        phrase:
          'An unmarried couple does not obtain divorce rights, Article 1056 divorce damages, or Article 1057 post-divorce support merely because they lived together.',
      },
      {
        number: 16,
        heading: headings[7],
        phrase:
          'A signed divorce agreement does not freeze the child’s situation against later court review when the statutory conditions for decision or change are met.',
      },
      {
        number: 17,
        heading: headings[8],
        phrase:
          'unforeseeability is not the sole legal threshold.',
      },
      {
        number: 18,
        heading: headings[8],
        phrase:
          'There is no automatic right to immediate physical handover, use of force, a change of parental rights and duties, or punishment of the other parent merely because contact was blocked.',
      },
      {
        number: 19,
        heading: headings[2],
        phrase:
          'There is no single universal appeal deadline that covers every family decision. Calculate the correct route and period from the instrument actually issued before acting.',
      },
      {
        number: 20,
        heading: headings[5],
        phrase: article10301AdjustmentParagraph,
      },
      {
        number: 21,
        heading: headings[3],
        phrase:
          'Do not state that an at-fault spouse can never petition, can always petition, or that adultery alone automatically grants or bars divorce.',
      },
      {
        number: 22,
        heading: headings[6],
        phrase:
          'Serious interference or insults do not automatically create Article 1057 liability or divorce damages against a third party.',
      },
      {
        number: 23,
        heading: headings[3],
        phrase:
          'A police missing-person report may be important evidence, but the statute does not make it a universal mandatory precondition.',
      },
      {
        number: 24,
        heading: headings[3],
        phrase:
          'Several months away from home, without more, is not itself a divorce ground.',
      },
      {
        number: 25,
        heading: headings[9],
        phrase:
          'Agreement that a child will live in Korea does not by itself fix support at Korean cost-of-living levels.',
      },
    ];

    expect(legacyCoverage.map(({ number }) => number)).toEqual(
      Array.from({ length: 25 }, (_, index) => index + 1),
    );
    for (const { heading, phrase } of legacyCoverage) {
      expect(sectionBody(parsed.content, heading)).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks the three paths and five separate cross-border questions', () => {
    const section = sectionBody(parsed.content, headings[0]);
    const requiredPhrases = [
      '**Mutual-consent divorce** is a private status act',
      '**Divorce established through court mediation or settlement** ends the marriage when the court mediation or settlement is established.',
      '**Judicial divorce** is granted by court judgment on a statutory ground under Civil Code Article 1052.',
      'whether a Taiwan court or administrative authority has jurisdiction or authority to handle the requested step;',
      'which jurisdiction’s law applies to divorce, matrimonial property, and child-related issues;',
      'whether a foreign divorce, judgment, or status act is recognized or effective in Taiwan;',
      'what Taiwan household-registration step and authenticated documents are required; and',
      'what additional registration, recognition, or enforcement step is required in another relevant jurisdiction.',
      'Nationality alone, place of marriage registration alone, or application of one country’s local law alone does not resolve all five questions.',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Article 1050 elements and the qualified court-result registration rule', () => {
    const section = sectionBody(parsed.content, headings[1]);
    const requiredPhrases = [
      faq1Answer,
      'Article 1050 separates three requirements:',
      '**Writing.** The mutual-consent divorce must be in writing.',
      'Signatures are not a purely formal later add-on by persons who never confirmed that intent.',
      'Registration with the household-registration authority is constitutive for this path.',
      'Without registration, the private writing does not complete a Taiwan mutual-consent divorce.',
      '**thirty days from finality of the Taiwan divorce judgment or from establishment of the court mediation or settlement**',
      'The period does not run from mere receipt of a judgment or mediation record if finality or establishment has not yet occurred.',
      'A late application must still be accepted.',
      'Lateness does not undo an already effective court divorce.',
      'the household-registration office registers the result directly under Article 48-2.',
      'If no party applies after written demand, and the statutory conditions are met, the household-registration office registers the result directly under Article 48-2.',
      courtResultsOnlineParagraph,
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('translates the filing-document paragraph exactly without adding photographs and freezes both boundaries', () => {
    const prefixMarkerStart = parsed.content.indexOf(filingDocumentsPrefixMarker);
    const paragraphStart =
      prefixMarkerStart + filingDocumentsPrefixMarker.length + 2;
    const courtResultsStart = parsed.content.indexOf(
      courtResultsSubsectionHeading,
      paragraphStart,
    );
    const section3Start = parsed.content.indexOf(`## ${headings[2]}`);
    const paragraph = parsed.content.slice(
      paragraphStart,
      courtResultsStart - 2,
    );

    expect(prefixMarkerStart).toBeGreaterThan(-1);
    expect(courtResultsStart).toBeGreaterThan(paragraphStart);
    expect(section3Start).toBeGreaterThan(courtResultsStart);
    expect(paragraph).toBe(filingDocumentsParagraph);
    expect(countOccurrences(parsed.content, filingDocumentsParagraph)).toBe(1);
    expect(sectionBody(parsed.content, headings[1])).not.toMatch(
      /\bphotographs?\b/i,
    );
    expect(sha256(parsed.content.slice(0, paragraphStart))).toBe(
      frozenBeforeFilingDocumentsSha256,
    );
    expect(
      sha256(parsed.content.slice(courtResultsStart, section3Start)),
    ).toBe(frozenCourtResultsSubsectionSha256);
    expect(sha256(parsed.content.slice(section3Start))).toBe(
      frozenSection3OnwardSha256,
    );
  });

  it('restores either party’s right to register a final Taiwan court divorce result', () => {
    expect(
      firstParagraphAfter(parsed.content, courtResultsSubsectionHeading),
    ).toBe(courtResultsFirstParagraph);
  });

  it('preserves the statutory online window without turning thirty days into an online-only deadline', () => {
    const courtResultsStart = parsed.content.indexOf(
      courtResultsSubsectionHeading,
    );
    const section3Start = parsed.content.indexOf(`## ${headings[2]}`);
    const courtResultsSubsection = parsed.content.slice(
      courtResultsStart,
      section3Start,
    );
    const onlineParagraph =
      courtResultsSubsection.trimEnd().split('\n\n').at(-1) ?? '';

    expect(courtResultsStart).toBeGreaterThan(-1);
    expect(section3Start).toBeGreaterThan(courtResultsStart);
    expect(
      firstParagraphAfter(parsed.content, courtResultsSubsectionHeading),
    ).toBe(courtResultsFirstParagraph);
    expect(sha256(courtResultsSubsection)).toBe(
      frozenCourtResultsSubsectionSha256,
    );
    expect(onlineParagraph).toBe(courtResultsOnlineParagraph);
  });

  it('restores the complete mediation-stage introduction before the court-outcome paragraph', () => {
    const section3IntroStart = parsed.content.indexOf(faq2Answer);
    const mediationHeadingStart = parsed.content.indexOf(
      mediationSubsectionHeading,
      section3IntroStart + faq2Answer.length,
    );
    const paragraphStart =
      mediationHeadingStart + mediationSubsectionHeading.length + 2;
    const courtOutcomeStart = parsed.content.indexOf(
      `\n\n${courtMediationOutcomeParagraphMarker}`,
      paragraphStart,
    );
    const paragraph = parsed.content.slice(paragraphStart, courtOutcomeStart);

    expect(section3IntroStart).toBeGreaterThan(-1);
    expect(mediationHeadingStart).toBe(
      section3IntroStart + faq2Answer.length + 2,
    );
    expect(courtOutcomeStart).toBeGreaterThan(paragraphStart);
    expect(paragraph).toBe(mediationIntroParagraph);
  });

  it('restores the three legal effects of established mediation or settlement before the duration guidance', () => {
    const courtOutcomeStart = parsed.content.indexOf(
      courtMediationOutcomeParagraphMarker,
    );
    const durationStart = parsed.content.indexOf(
      `\n\n${expectedDurationParagraph}`,
      courtOutcomeStart,
    );
    const paragraph = parsed.content.slice(courtOutcomeStart, durationStart);

    expect(courtOutcomeStart).toBeGreaterThan(-1);
    expect(durationStart).toBeGreaterThan(courtOutcomeStart);
    expect(paragraph).toBe(courtMediationOutcomeParagraph);
  });

  it('restores every case-duration factor before the personal-appearance guidance', () => {
    const mediationEffectStart = parsed.content.indexOf(
      courtMediationOutcomeParagraph,
    );
    const durationStart =
      mediationEffectStart + courtMediationOutcomeParagraph.length + 2;
    const personalAppearanceStart = parsed.content.indexOf(
      '\n\n### Personal appearance',
      durationStart,
    );
    const paragraph = parsed.content.slice(
      durationStart,
      personalAppearanceStart,
    );

    expect(mediationEffectStart).toBeGreaterThan(-1);
    expect(personalAppearanceStart).toBeGreaterThan(durationStart);
    expect(paragraph).toBe(expectedDurationParagraph);
  });

  it('locks Family Act Article 13 and the type-specific effects and review routes', () => {
    const section = sectionBody(parsed.content, headings[2]);
    const requiredPhrases = [
      faq2Answer,
      mediationIntroParagraph,
      'Family Act Article 13 applies when the court orders a party or legal representative to appear in person.',
      'a first fine of up to NTD 30,000',
      'no arrest for compulsory appearance under this rule',
      'Remote, separate, representative, or safety arrangements are available only if the court so decides under law and the circumstances.',
      'A mediation or settlement record, a ruling, and a judgment are not interchangeable for that purpose.',
      'There is no single universal appeal deadline that covers every family decision.',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Article 1052 paragraph 1 grounds, paragraph 2, and the constitutional qualification', () => {
    const section = sectionBody(parsed.content, headings[3]);
    const grounds = [
      '1. **Bigamy.**',
      '2. **Consensual sexual intercourse with a person other than the spouse.**',
      '3. **Unbearable abuse by one spouse against the other.**',
      '4. **Abuse by one spouse against the other spouse’s lineal relative, or by one spouse’s lineal relative against the other spouse, making common life unbearable.**',
      '5. **Malicious desertion of the other spouse in a continuing state.**',
      '6. **An attempt by one spouse to kill the other.**',
      '7. **An incurable serious disease.**',
      '8. **A serious incurable mental illness.**',
      '9. **Life or death unknown for more than three years.**',
      '10. **A final sentence of imprisonment for more than six months for an intentional offense.**',
    ];
    const requiredPhrases = [
      faq3Answer,
      'It is a medical and legal criterion, not a moral label or a judgment of character.',
      'Paragraph 2 is separate from the ten grounds.',
      'That proviso remains in the current statutory text as of 2026-07-25.',
      'Constitutional Court Judgment 112-Hsien-Pan-4 did not delete it',
      'Which considerations apply depends on the ground:',
      'the paragraph 2 proviso and Judgment 112-Hsien-Pan-4 concern petitions based on another serious cause under paragraph 2, not a freestanding rewrite of every paragraph 1 ground.',
      'A police missing-person report may be important evidence, but the statute does not make it a universal mandatory precondition.',
      'A prior action demanding cohabitation is not a universal statutory precondition either.',
      'Several months away from home, without more, is not itself a divorce ground.',
      'either a spouse abuses the other spouse’s lineal relative, or a lineal relative of one spouse abuses the other spouse',
      'The two-year legislative period has elapsed without replacement of the current text, so courts apply the judgment’s reasoning in such paragraph 2 cases.',
    ];

    let previousIndex = -1;
    for (const ground of grounds) {
      const index = section.indexOf(ground);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('publishes the exact constitutional qualification as the first Section 4 paragraph', () => {
    const section = sectionBody(parsed.content, headings[3]);
    const paragraphEnd = section.indexOf(
      `\n\n${article1052Paragraph1Heading}`,
    );
    const paragraph = section.slice(
      `## ${headings[3]}\n\n`.length,
      paragraphEnd,
    );

    expect(paragraphEnd).toBeGreaterThan(-1);
    expect(paragraph).toBe(responsibleSpouseParagraph);
    expect(parsed.data.faq[2]?.a).toBe(responsibleSpouseParagraph);
    expect(post?.faq?.[2]?.a).toBe(responsibleSpouseParagraph);
    expect(countOccurrences(parsed.content, responsibleSpouseParagraph)).toBe(
      1,
    );
    expect(countOccurrences(raw, responsibleSpouseParagraph)).toBe(2);
    expect(
      countOccurrences(post?.content ?? '', responsibleSpouseParagraph),
    ).toBe(1);
    expect(
      countOccurrences(
        JSON.stringify({ faq: post?.faq, content: post?.content }),
        responsibleSpouseParagraph,
      ),
    ).toBe(2);
    expect(paragraph).not.toContain('generally constitutional');
  });

  it('uses the exact constitutional holding in the Paragraph 2 subsection', () => {
    const section = sectionBody(parsed.content, headings[3]);
    const subsectionStart = section.indexOf(
      '### Paragraph 2 and the responsible-spouse proviso',
    );
    const subsectionEnd = section.indexOf(
      '\n\n### Missing or absent spouses: no universal shortcut',
      subsectionStart,
    );
    const subsection = section.slice(subsectionStart, subsectionEnd);

    expect(subsectionStart).toBeGreaterThan(-1);
    expect(subsectionEnd).toBeGreaterThan(subsectionStart);
    expect(
      countOccurrences(subsection, responsibleSpouseJudgmentSentence),
    ).toBe(1);
    expect(raw).not.toContain('generally constitutional');
  });

  it('restores the sexual-intercourse consequences paragraph at the exact Section 4 tail boundary', () => {
    const exactBoundary = `${missingSpouseTailParagraph}\n\n${sexualIntercourseConsequencesParagraph}\n\n## ${headings[4]}`;

    expect(parsed.content).toContain(exactBoundary);
    expect(
      countOccurrences(parsed.content, sexualIntercourseConsequencesParagraph),
    ).toBe(1);
  });

  it('presents the Article 1052 paragraph 1 rule to readers without exposing a translation instruction or changing later text', () => {
    const section = sectionBody(parsed.content, headings[3]);
    const introMarker = `${article1052Paragraph1Heading}\n\n`;
    const introStart = section.indexOf(introMarker) + introMarker.length;
    const listStart = section.indexOf('\n\n1. **Bigamy.**', introStart);
    const section5Start = parsed.content.indexOf(`## ${headings[4]}`);
    const section4OutsideIntro =
      section.slice(0, introStart) +
      '<ARTICLE_1052_PARAGRAPH_1_READER_SENTENCE>' +
      section.slice(listStart);

    expect(introStart).toBeGreaterThan(introMarker.length - 1);
    expect(listStart).toBeGreaterThan(introStart);
    expect(firstParagraphAfter(parsed.content, article1052Paragraph1Heading)).toBe(
      article1052Paragraph1ReaderSentence,
    );
    expect(
      firstParagraphAfter(post?.content ?? '', article1052Paragraph1Heading),
    ).toBe(article1052Paragraph1ReaderSentence);
    expect(section).toContain(
      `${article1052Paragraph1Heading}\n\n${article1052Paragraph1ReaderSentence}\n\n1. **Bigamy.**`,
    );
    expect(countOccurrences(raw, article1052Paragraph1ReaderSentence)).toBe(1);
    expect(raw).not.toContain(staleArticle1052TranslationInstruction);
    expect(sha256(section4OutsideIntro)).toBe(
      frozenSection4OutsideArticle1052IntroSha256,
    );
    expect(section5Start).toBeGreaterThan(-1);
    expect(sha256(parsed.content.slice(section5Start))).toBe(
      frozenSection5OnwardSha256,
    );
  });

  it('locks foreign-record connecting factors, authentication, translation, and regional verification', () => {
    const section = sectionBody(parsed.content, headings[4]);
    const requiredPhrases = [
      'A foreign marriage or foreign divorce does not collapse into one universal Taiwan route.',
      'There is no fixed rule that parties must first re-register a foreign marriage in Taiwan or must always sue only in Taiwan.',
      'Completing a divorce under foreign local law does not, by itself, complete Taiwan household registration or prove Taiwan recognition.',
      'authentication by a Taiwan overseas mission or another authorized channel, together with a Chinese translation authenticated or notarized',
      'Documents from mainland China, Hong Kong, and Macao follow verification regimes that differ from ordinary foreign authentication.',
      foreignRecognitionParagraph,
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('publishes the exact foreign-divorce effect paragraph at the Section 5 tail without adding public policy', () => {
    const subsectionMarker = `${foreignEffectSubsectionHeading}\n\n`;
    const subsectionStart = parsed.content.indexOf(subsectionMarker);
    const paragraphStart = subsectionStart + subsectionMarker.length;
    const section6Start = parsed.content.indexOf(
      `\n\n## ${headings[5]}`,
      paragraphStart,
    );
    const section = sectionBody(parsed.content, headings[4]);

    expect(subsectionStart).toBeGreaterThan(-1);
    expect(section6Start).toBeGreaterThan(paragraphStart);
    expect(parsed.content.slice(paragraphStart, section6Start)).toBe(
      foreignRecognitionParagraph,
    );
    expect(section).not.toContain('public policy');
  });

  it('locks Article 1017 and Article 1030-1 classification, exclusions, adjustment, and claim-specific periods', () => {
    const section = sectionBody(parsed.content, headings[5]);
    const requiredPhrases = [
      faq4Answer,
      'Separate at least three inquiries for a house or other asset:',
      article1017Paragraph,
      'net residual property composed of qualifying property acquired during marriage, after the statutory exclusions and relevant debts',
      'The difference is generally divided equally.',
      article10301ExclusionsParagraph,
      'Residual-property distribution is not a crude half-and-half split of every asset acquired during marriage',
      'Where equal division of the residual difference would be manifestly unfair, the court may adjust or waive distribution',
      article10301AdjustmentParagraph,
      'Nor should it be assumed that the calculation under Article 1030-1 changes merely because the spouses have different nationalities.',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('publishes the exact Article 1017 classification-and-presumption paragraph', () => {
    const subsectionMarker = `${article1017SubsectionHeading}\n\n`;
    const subsectionStart = parsed.content.indexOf(subsectionMarker);
    const paragraphStart = subsectionStart + subsectionMarker.length;
    const nextSubsectionStart = parsed.content.indexOf(
      `\n\n${article10301SubsectionHeading}`,
      paragraphStart,
    );

    expect(subsectionStart).toBeGreaterThan(-1);
    expect(nextSubsectionStart).toBeGreaterThan(paragraphStart);
    expect(parsed.content.slice(paragraphStart, nextSubsectionStart)).toBe(
      article1017Paragraph,
    );
    expect(article1017Paragraph).toContain(
      'property whose time of acquisition is difficult to prove is presumed to have been acquired during marriage',
    );
  });

  it('publishes the exact Article 1030-1 exclusions-and-pre-termination-dispositions paragraph', () => {
    const calculationParagraphMarker =
      `${article10301SubsectionHeading}\n\nUnder Article 1030-1,`;
    const calculationParagraphStart = parsed.content.indexOf(
      calculationParagraphMarker,
    );
    const targetParagraphStart =
      parsed.content.indexOf(
        '\n\n',
        calculationParagraphStart + calculationParagraphMarker.length,
      ) + 2;
    const adjustmentParagraphStart = parsed.content.indexOf(
      '\n\nWhere equal division',
      targetParagraphStart,
    );

    expect(calculationParagraphStart).toBeGreaterThan(-1);
    expect(targetParagraphStart).toBeGreaterThan(
      calculationParagraphStart + calculationParagraphMarker.length,
    );
    expect(adjustmentParagraphStart).toBeGreaterThan(targetParagraphStart);
    expect(
      parsed.content.slice(targetParagraphStart, adjustmentParagraphStart),
    ).toBe(article10301ExclusionsParagraph);
  });

  it('publishes the exact Article 1030-1 adjustment-factors paragraph', () => {
    const subsectionStart = parsed.content.indexOf(
      article10301SubsectionHeading,
    );
    const paragraphStart =
      parsed.content.indexOf(
        '\n\nWhere equal division',
        subsectionStart + article10301SubsectionHeading.length,
      ) + 2;
    const section7Start = parsed.content.indexOf(
      `\n\n## ${headings[6]}`,
      paragraphStart,
    );

    expect(subsectionStart).toBeGreaterThan(-1);
    expect(paragraphStart).toBeGreaterThan(
      subsectionStart + article10301SubsectionHeading.length,
    );
    expect(section7Start).toBeGreaterThan(paragraphStart);
    expect(parsed.content.slice(paragraphStart, section7Start)).toBe(
      article10301AdjustmentParagraph,
    );
  });

  it('separates Articles 1056 and 1057, child support, property, cohabitation, and third-party claims', () => {
    const section = sectionBody(parsed.content, headings[6]);
    const requiredPhrases = [
      faq5Answer,
      article1056Paragraph,
      '**Article 1057** concerns post-divorce support for a spouse without fault who falls into financial hardship because of judicial divorce.',
      '**Article 1116-2** continues parents’ duty to support a minor child after divorce.',
      'Child support is distinct from Article 1057 spousal support.',
      'Government average consumption statistics are not a binding formula that automatically sets Article 1057 support.',
      'An unmarried couple does not obtain divorce rights, Article 1056 divorce damages, or Article 1057 post-divorce support merely because they lived together.',
      'Claims against an in-law or another third party require a separate legal foundation',
      'That two-year and five-year rule must not be treated as a universal period for damages, post-divorce support, child support, ownership, or third-party claims.',
      'within two years from knowledge of the residual-property difference',
      'within five years from termination of the statutory regime',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('publishes the exact Article 1056 pecuniary-and-non-pecuniary damages paragraph', () => {
    const subsectionMarker = `${article1056SubsectionHeading}\n\n`;
    const subsectionStart = parsed.content.indexOf(subsectionMarker);
    const paragraphStart = subsectionStart + subsectionMarker.length;
    const article1057Start = parsed.content.indexOf(
      '\n\n**Article 1057**',
      paragraphStart,
    );

    expect(subsectionStart).toBeGreaterThan(-1);
    expect(article1057Start).toBeGreaterThan(paragraphStart);
    expect(parsed.content.slice(paragraphStart, article1057Start)).toBe(
      article1056Paragraph,
    );
  });

  it('publishes the exact complete parental-rights-and-duties scope paragraph', () => {
    const subsectionMarker = `${completeParentalRightsSubsectionHeading}\n\n`;
    const subsectionStart = parsed.content.indexOf(subsectionMarker);
    const paragraphStart = subsectionStart + subsectionMarker.length;
    const agreementStart = parsed.content.indexOf(
      '\n\nParents may agree on the arrangement.',
      paragraphStart,
    );

    expect(subsectionStart).toBeGreaterThan(-1);
    expect(agreementStart).toBeGreaterThan(paragraphStart);
    expect(parsed.content.slice(paragraphStart, agreementStart)).toBe(
      childScopeParagraph,
    );
  });

  it('publishes the exact best-interests-and-statutory-factors paragraph', () => {
    const subsectionMarker = `${bestInterestsSubsectionHeading}\n\n`;
    const subsectionStart = parsed.content.indexOf(subsectionMarker);
    const paragraphStart = subsectionStart + subsectionMarker.length;
    const nextSubsectionStart = parsed.content.indexOf(
      `\n\n${unresolvedIssuesSubsectionHeading}`,
      paragraphStart,
    );

    expect(subsectionStart).toBeGreaterThan(-1);
    expect(nextSubsectionStart).toBeGreaterThan(paragraphStart);
    expect(parsed.content.slice(paragraphStart, nextSubsectionStart)).toBe(
      bestInterestsFactorsParagraph,
    );
  });

  it('publishes the exact unresolved-property-and-child-issues paragraph', () => {
    const subsectionMarker = `${unresolvedIssuesSubsectionHeading}\n\n`;
    const subsectionStart = parsed.content.indexOf(subsectionMarker);
    const paragraphStart = subsectionStart + subsectionMarker.length;
    const section9Start = parsed.content.indexOf(
      `\n\n## ${headings[8]}`,
      paragraphStart,
    );

    expect(subsectionStart).toBeGreaterThan(-1);
    expect(section9Start).toBeGreaterThan(paragraphStart);
    expect(parsed.content.slice(paragraphStart, section9Start)).toBe(
      unresolvedIssuesParagraph,
    );
  });

  it('locks Articles 1055 and 1055-1, the full Taiwan concept, review, and unresolved issues', () => {
    const section = sectionBody(parsed.content, headings[7]);
    const requiredPhrases = [
      faq6Answer,
      childScopeParagraph,
      'management of the child’s property, and legal representation',
      'A signed divorce agreement does not freeze the child’s situation against later court review',
      bestInterestsFactorsParagraph,
      'the child’s age, sex, and health; the number of children; the child’s views and needs for personality development',
      'each parent’s age, occupation, conduct, health, financial means, and living circumstances',
      'each parent’s willingness and attitude toward the child’s protection and upbringing',
      'any circumstances in which one parent has interfered with the relationship between the other parent and the child',
      'The court may hear the child’s views in the manner prescribed by law',
      'investigations and opinions from competent authorities or child-welfare professionals',
      'A parent’s higher income or responsibility for the breakdown of the marriage may be only one fact among many',
      'whether interim orders are needed to ensure safety and continuity of daily life while the dispute remains pending',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('publishes the exact child-support allocation factors before modification guidance', () => {
    const sectionMarker = `## ${headings[8]}\n\n`;
    const sectionStart = parsed.content.indexOf(sectionMarker);
    const paragraphStart = sectionStart + sectionMarker.length;
    const modificationStart = parsed.content.indexOf(
      '\n\n### Modification of child support',
      paragraphStart,
    );

    expect(sectionStart).toBeGreaterThan(-1);
    expect(modificationStart).toBeGreaterThan(paragraphStart);
    expect(parsed.content.slice(paragraphStart, modificationStart)).toBe(
      childSupportFactorsParagraph,
    );
    expect(
      countOccurrences(parsed.content, childSupportFactorsParagraph),
    ).toBe(1);
  });

  it('publishes the exact child-focused contact-enforcement factors between the adjacent enforcement paragraphs', () => {
    const precedingParagraph =
      'If contact or visitation is obstructed, the available response depends on the existing agreement or court order and on the facts. A party may seek a court determination of contact, a change of the arrangement, enforcement of an existing instrument, or an appropriate interim measure. Family Act Article 194 requires enforcement methods to be selected under the child’s best interests. Those methods may involve direct or indirect compulsion as the law and the facts allow.';
    const precedingMarker = `${precedingParagraph}\n\n`;
    const followingMarker = `\n\n${childSupportEnforcementParagraph}`;
    const precedingStart = parsed.content.indexOf(precedingMarker);
    const paragraphStart = precedingStart + precedingMarker.length;
    const followingStart = parsed.content.indexOf(
      followingMarker,
      paragraphStart,
    );

    expect(precedingStart).toBeGreaterThan(-1);
    expect(followingStart).toBeGreaterThan(paragraphStart);
    expect(parsed.content.slice(paragraphStart, followingStart)).toBe(
      contactEnforcementFactorsParagraph,
    );
    expect(
      countOccurrences(parsed.content, contactEnforcementFactorsParagraph),
    ).toBe(1);
    expect(
      parsed.content.slice(precedingStart, precedingStart + precedingParagraph.length),
    ).toBe(precedingParagraph);
    expect(
      parsed.content.slice(
        followingStart + 2,
        followingStart + 2 + childSupportEnforcementParagraph.length,
      ),
    ).toBe(childSupportEnforcementParagraph);
  });

  it('publishes the exact independent child-support and contact enforcement paragraph', () => {
    const precedingMarker =
      'Interim protection may be necessary where flight risk, retention, or safety is genuinely in issue, but the form of that protection is a court decision based on the instrument and the evidence.\n\n';
    const followingMarker = '\n\n### Evidence for support and contact disputes';
    const precedingStart = parsed.content.indexOf(precedingMarker);
    const paragraphStart = precedingStart + precedingMarker.length;
    const followingStart = parsed.content.indexOf(
      followingMarker,
      paragraphStart,
    );

    expect(precedingStart).toBeGreaterThan(-1);
    expect(followingStart).toBeGreaterThan(paragraphStart);
    expect(parsed.content.slice(paragraphStart, followingStart)).toBe(
      childSupportEnforcementParagraph,
    );
    expect(
      countOccurrences(parsed.content, childSupportEnforcementParagraph),
    ).toBe(1);
  });

  it('locks Article 1116-2 support and Family Act Article 194 contact and enforcement qualifications', () => {
    const section = sectionBody(parsed.content, headings[8]);
    const requiredPhrases = [
      'Under Civil Code Article 1116-2, parents’ duty to support a minor child continues after divorce.',
      'It is distinct from Article 1057 post-divorce support for a qualifying former spouse.',
      'unforeseeability is not the sole legal threshold.',
      'the child’s current needs, both parents’ resources and circumstances, the existing agreement or order, and the child’s best interests',
      'Family Act Article 194 requires enforcement methods to be selected under the child’s best interests.',
      'Those methods may involve direct or indirect compulsion as the law and the facts allow.',
      'There is no automatic right to immediate physical handover, use of force, a change of parental rights and duties, or punishment of the other parent merely because contact was blocked.',
      'Preserve, at a minimum, the current order or agreement, attempted-contact records, school and medical schedules, expense and payment history',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks the seven relocation questions, non-treaty shortcut, and no unauthorized removal', () => {
    const section = sectionBody(parsed.content, headings[9]);
    const requiredPhrases = [
      'Cross-border relocation with a minor child is not decided by Korean living costs, a single nationality, or a treaty label alone.',
      '**Authority over residence and travel.**',
      '**Consent or court order.**',
      '**Best interests and continuing contact.**',
      '**Passports, entry, exit, immigration, and registration.**',
      '**Recognition and enforcement.**',
      '**Actual expenses and both parents’ resources.**',
      '**Urgent protection.**',
      'Agreement that a child will live in Korea does not by itself fix support at Korean cost-of-living levels.',
      'Do not state or imply that the 1980 Hague Child Abduction Convention automatically governs Taiwan.',
      'Cross-border removal and return questions require advice and analysis in every relevant jurisdiction',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('publishes the exact authority-over-residence relocation item without habitual-residence wording', () => {
    const section = sectionBody(parsed.content, headings[9]);
    const expectedItem =
      '1. **Authority over residence and travel.** Who has authority, under agreement or court order, to decide the child’s residence, international travel, and related daily-care arrangements?';
    const itemStart = section.indexOf('1. **Authority over residence and travel.**');
    const nextItemStart = section.indexOf(
      '\n2. **Consent or court order.**',
      itemStart,
    );

    expect(itemStart).toBeGreaterThan(-1);
    expect(nextItemStart).toBeGreaterThan(itemStart);
    expect(section.slice(itemStart, nextItemStart)).toBe(expectedItem);
    expect(section).not.toContain('habitual residence');
  });

  it('publishes the exact best-interests and continuing-contact relocation item', () => {
    const section = sectionBody(parsed.content, headings[9]);
    const expectedItem =
      '3. **Best interests and continuing contact.** How would relocation affect continuity, safety, schooling, health care, and ongoing contact or visitation with the other parent? A workable plan should address the frequency of contact, stays during school holidays, travel costs, and handover locations.';
    const itemStart = section.indexOf(
      '3. **Best interests and continuing contact.**',
    );
    const nextItemStart = section.indexOf(
      '\n4. **Passports, entry, exit, immigration, and registration.**',
      itemStart,
    );

    expect(itemStart).toBeGreaterThan(-1);
    expect(nextItemStart).toBeGreaterThan(itemStart);
    expect(section.slice(itemStart, nextItemStart)).toBe(expectedItem);
    expect(countOccurrences(section, expectedItem)).toBe(1);
  });

  it('publishes the exact non-adversarial evidence-organization introduction', () => {
    const section = sectionBody(parsed.content, headings[10]);
    const expectedIntro =
      'Organize the materials not as a collection intended to pressure the other party, but as records that accurately explain jurisdiction, procedure, the facts, and the child’s needs. Preparing the following nine categories so that both the chronology of the case and the source of each original document are clear can reduce the risk of confusing different claims and deadlines.';
    const introStart = `## ${headings[10]}\n\n`.length;
    const firstItemStart = section.indexOf(
      '\n\n1. **Identity, status, and addresses.**',
    );

    expect(firstItemStart).toBeGreaterThan(-1);
    expect(section.slice(introStart, firstItemStart)).toBe(expectedIntro);
    expect(countOccurrences(section, expectedIntro)).toBe(1);
    expect(section).not.toContain(
      'Prepare a non-adversarial file early. The goal is accuracy, preservation of originals, and privacy-safe handling—not advantage-seeking through unlawful methods. Organize materials in at least the following nine groups.',
    );
  });

  it('publishes the exact identity, status, and address evidence item', () => {
    const section = sectionBody(parsed.content, headings[10]);
    const expectedItem =
      '1. **Identity, status, and addresses.** Organize proof of marriage, Taiwan household-registration records, and each party’s nationality, domicile, habitual residence, and current address. Note any discrepancy between the information shown in the documents and where each party actually lives now or the address at which each party can be served.';
    const itemStart = section.indexOf(
      '1. **Identity, status, and addresses.**',
    );
    const nextItemStart = section.indexOf(
      '\n2. **Divorce instruments and court papers.**',
      itemStart,
    );

    expect(itemStart).toBeGreaterThan(-1);
    expect(nextItemStart).toBeGreaterThan(itemStart);
    expect(section.slice(itemStart, nextItemStart)).toBe(expectedItem);
    expect(countOccurrences(section, expectedItem)).toBe(1);
    expect(section).not.toContain(
      'and current addresses for each spouse and child',
    );
    expect(section).not.toContain(
      'These materials frame jurisdiction, service, and registration questions.',
    );
  });

  it('publishes the exact divorce instruments and court papers evidence item', () => {
    const section = sectionBody(parsed.content, headings[10]);
    const expectedItem =
      '2. **Divorce instruments and court papers.** Collect and organize by procedure any written mutual-consent divorce agreement; documentation of how the witnesses confirmed the spouses’ genuine intent to divorce; court papers; records of service; mediation and settlement records; judgments; and documents proving finality.';
    const itemStart = section.indexOf(
      '2. **Divorce instruments and court papers.**',
    );
    const nextItemStart = section.indexOf(
      '\n3. **Foreign marriage or divorce records.**',
      itemStart,
    );

    expect(itemStart).toBeGreaterThan(-1);
    expect(nextItemStart).toBeGreaterThan(itemStart);
    expect(section.slice(itemStart, nextItemStart)).toBe(expectedItem);
    expect(countOccurrences(section, expectedItem)).toBe(1);
    expect(section).not.toContain(
      'Keep originals or certified copies and note how and when each instrument was served or became final.',
    );
  });

  it('publishes the exact foreign marriage or divorce records evidence item', () => {
    const section = sectionBody(parsed.content, headings[10]);
    const expectedItem =
      '3. **Foreign marriage or divorce records.** For foreign marriage and divorce records and foreign judgments or certificates, check authentication by a Taiwan overseas mission or other competent authority; the Chinese translation and whether it has been certified or notarized; and their recognition, legal effect, and registration status in Taiwan.';
    const itemStart = section.indexOf(
      '3. **Foreign marriage or divorce records.**',
    );
    const nextItemStart = section.indexOf(
      '\n4. **Matrimonial property and debts.**',
      itemStart,
    );

    expect(itemStart).toBeGreaterThan(-1);
    expect(nextItemStart).toBeGreaterThan(itemStart);
    expect(section.slice(itemStart, nextItemStart)).toBe(expectedItem);
    expect(countOccurrences(section, expectedItem)).toBe(1);
    expect(section).not.toContain(
      'Documents from mainland China, Hong Kong, and Macao follow distinct verification tracks',
    );
  });

  it('publishes the exact matrimonial property and debts evidence item', () => {
    const section = sectionBody(parsed.content, headings[10]);
    const expectedItem =
      '4. **Matrimonial property and debts.** Identify the applicable matrimonial-property agreement and property regime. Link every asset and debt—and, where applicable, its registered titleholder and the source and timing of acquisition—to a complete inventory together with records of fund transfers, dispositions, loans, repayments, taxes, and valuations.';
    const itemStart = section.indexOf(
      '4. **Matrimonial property and debts.**',
    );
    const nextItemStart = section.indexOf(
      '\n5. **Alleged divorce-ground chronology.**',
      itemStart,
    );

    expect(itemStart).toBeGreaterThan(-1);
    expect(nextItemStart).toBeGreaterThan(itemStart);
    expect(section.slice(itemStart, nextItemStart)).toBe(expectedItem);
    expect(countOccurrences(section, expectedItem)).toBe(1);
    expect(section).not.toContain(
      'materials showing gifts, nominee arrangements, reimbursements, or other theories',
    );
    expect(section).not.toContain(
      'Distinguish ownership claims from residual-property calculation inputs.',
    );
  });

  it('publishes the exact alleged divorce-ground chronology evidence item', () => {
    const section = sectionBody(parsed.content, headings[10]);
    const expectedItem =
      '5. **Alleged divorce-ground chronology.** Create a neutral timeline of the events and their timing underlying the alleged grounds for divorce. Preserve lawfully obtained communications, medical and police records, and other evidence in their original state. Distinguish speculation from directly verified facts.';
    const itemStart = section.indexOf(
      '5. **Alleged divorce-ground chronology.**',
    );
    const nextItemStart = section.indexOf(
      '\n6. **Each child’s situation.**',
      itemStart,
    );

    expect(itemStart).toBeGreaterThan(-1);
    expect(nextItemStart).toBeGreaterThan(itemStart);
    const item = section.slice(itemStart, nextItemStart);
    expect(item).toBe(expectedItem);
    expect(countOccurrences(section, expectedItem)).toBe(1);
    expect(item).not.toContain('preservation of original media and metadata');
    expect(item).not.toContain('Do not create evidence by unlawful means.');
  });

  it('publishes the exact each child’s situation evidence item', () => {
    const section = sectionBody(parsed.content, headings[10]);
    const expectedItem =
      '6. **Each child’s situation.** Compile information on each child’s age, health, education, residence, caregiving history and current care arrangements, views appropriate to the child’s stage of development, relationship with each parent, and safety and stability, all from the perspective of the child’s best interests.';
    const itemStart = section.indexOf('6. **Each child’s situation.**');
    const nextItemStart = section.indexOf(
      '\n7. **Support, contact, and relocation plans.**',
      itemStart,
    );

    expect(itemStart).toBeGreaterThan(-1);
    expect(nextItemStart).toBeGreaterThan(itemStart);
    const item = section.slice(itemStart, nextItemStart);
    expect(item).toBe(expectedItem);
    expect(countOccurrences(section, expectedItem)).toBe(1);
    expect(item).not.toContain('views where appropriate');
    expect(item).not.toContain(
      'Handle identifiers and school or medical details with privacy in mind.',
    );
  });

  it('publishes the exact support, contact, and relocation plans evidence item', () => {
    const section = sectionBody(parsed.content, headings[10]);
    const expectedItem =
      '7. **Support, contact, and relocation plans.** Compile together any current child-related agreements and court proceedings, child-support payment records and actual expenses, the history of contact or visitation, travel documents and itineraries, and any specific plan for international relocation.';
    const itemStart = section.indexOf(
      '7. **Support, contact, and relocation plans.**',
    );
    const nextItemStart = section.indexOf(
      '\n8. **Deadlines calculated from correct triggering events.**',
      itemStart,
    );

    expect(itemStart).toBeGreaterThan(-1);
    expect(nextItemStart).toBeGreaterThan(itemStart);
    const item = section.slice(itemStart, nextItemStart);
    expect(item).toBe(expectedItem);
    expect(countOccurrences(section, expectedItem)).toBe(1);
    expect(item).not.toContain('expense records');
    expect(item).not.toContain(
      'any proposed relocation plan with supporting logistics',
    );
    expect(item).not.toContain('travel or movement schedules');
  });

  it('publishes the exact limited-disclosure privacy plan as evidence item nine', () => {
    const section = sectionBody(parsed.content, headings[10]);
    const expectedItem =
      '9. **Privacy plan and limited disclosure.** Share identification numbers, addresses, and medical, educational, or financial information concerning a spouse or child only with people and institutions that need the information and only to the extent necessary. Establish a privacy plan covering file-access permissions, methods of transmission, and disposal of copies.';
    const itemStart = section.indexOf(
      '9. **Privacy plan and limited disclosure.**',
    );
    const prohibitionsStart = section.indexOf('\n\nDo not engage', itemStart);

    expect(itemStart).toBeGreaterThan(-1);
    expect(prohibitionsStart).toBeGreaterThan(itemStart);
    expect(section.slice(itemStart, prohibitionsStart)).toBe(expectedItem);
    expect(countOccurrences(section, expectedItem)).toBe(1);
    expect(section).not.toContain('preserve fragile evidence promptly');
    expect(section).not.toContain('notarial or other formal preservation');
  });

  it('uses the exact ordered nine-category evidence checklist and privacy prohibitions', () => {
    const section = sectionBody(parsed.content, headings[10]);
    const checklistStarts = [
      '1. **Identity, status, and addresses.**',
      '2. **Divorce instruments and court papers.**',
      '3. **Foreign marriage or divorce records.**',
      '4. **Matrimonial property and debts.**',
      '5. **Alleged divorce-ground chronology.**',
      '6. **Each child’s situation.**',
      '7. **Support, contact, and relocation plans.**',
      '8. **Deadlines calculated from correct triggering events.**',
      '9. **Privacy plan and limited disclosure.**',
    ];

    let previousIndex = -1;
    for (const item of checklistStarts) {
      const index = section.indexOf(item);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    expect(section).toContain(
      'documentation of how the witnesses confirmed the spouses’ genuine intent to divorce',
    );
    expect(section).toContain(
      'Collect and organize by procedure',
    );
    expect(section).toContain(
      'Taiwan overseas mission or other competent authority',
    );
    expect(section).toContain(
      'certified or notarized',
    );
    expect(section).toContain(
      'recognition, legal effect, and registration status in Taiwan',
    );
    expect(section).toContain('source and timing of acquisition');
    expect(section).toContain('complete inventory');
    expect(section).toContain('dispositions');
    expect(section).toContain('repayments');
    expect(section).toContain(
      'Create a neutral timeline of the events and their timing underlying the alleged grounds for divorce.',
    );
    expect(section).toContain(
      'Preserve lawfully obtained communications, medical and police records, and other evidence in their original state.',
    );
    expect(section).toContain(
      'Distinguish speculation from directly verified facts.',
    );
    expect(section).toContain(
      'caregiving history and current care arrangements',
    );
    expect(section).toContain(
      'all from the perspective of the child’s best interests.',
    );
    expect(section).toContain(
      'child-support payment records and actual expenses',
    );
    expect(section).toContain(
      'travel documents and itineraries, and any specific plan for international relocation.',
    );
    expect(section).toContain(
      'only with people and institutions that need the information and only to the extent necessary',
    );
    expect(section).toContain(
      'not from a convenient or informal date.',
    );
    expect(section).toContain(
      'Do not engage in unlawful surveillance, unauthorized account or device access, tracking, unlawful recording, retaliation, asset concealment, or removal of a child contrary to an agreement or court order.',
    );
  });

  it('uses exactly the ten official and three English internal body links once and in order', () => {
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
      expect(countOccurrences(parsed.content, url)).toBe(1);
    }
    for (const link of [...officialLinks, ...internalLinks]) {
      expect(countOccurrences(raw, link)).toBe(1);
    }
    expect(parsed.content).not.toMatch(/\]\(\/(?:ko|zh-hant|ja)(?:\/|\))/);
  });

  it('ends with the exact disclaimer and author and nothing else', () => {
    expect(raw.trimEnd().endsWith(exactEnding)).toBe(true);
    expect(raw.trimEnd()).toMatch(
      /specific right or procedure involved\.\n\n\*\*Wei Tseng \(曾雋崴\), Attorney-at-Law\*\*$/,
    );
    expect(countOccurrences(raw, disclaimer)).toBe(1);
    expect(countOccurrences(raw, author)).toBe(1);
  });

  it('freezes the exact visible English word count, calculated read time, and source digest', () => {
    const visibleWordCount = countVisibleEnglishWords(parsed.content);
    const calculatedMinutes = Math.ceil(visibleWordCount / 200);
    const sourceSha256 = crypto
      .createHash('sha256')
      .update(raw)
      .digest('hex');

    expect(visibleWordCount).toBe(frozenVisibleWordCount);
    expect(calculatedMinutes).toBe(29);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes} min read`);
    expect(post?.readTime).toBe(`${calculatedMinutes} min read`);
    expect(sourceSha256).toBe(frozenSourceSha256);
  });

  it('resolves the canonical and legacy alias to the identical complete English article', () => {
    expect(post).toBeDefined();
    expect(aliasPost).toBeDefined();
    expect(aliasPost?.slug).toBe(canonicalSlug);
    expect(aliasPost?.title).toBe(title);
    expect(aliasPost?.content).toBe(post?.content);
    expect(aliasPost?.faq).toEqual(faq);
    expect(post?.content).toContain(`## ${headings[0]}`);
    expect(post?.content).toContain(`## ${headings[12]}`);
    expect(post?.content).toContain(disclaimer);
    expect(post?.content).toContain(author);
    expect(post?.content).not.toContain(`# ${title}`);
    expect(post?.content).not.toContain(bodyImage);
    expect(post?.category).toBe('legal');
    expect(post?.featuredImage).toBe(
      '/images/blog/007-taiwan-divorce-lawsuit-qna/featured-01.jpg',
    );
    expect(aliasPost?.category).toBe(post?.category);
    expect(aliasPost?.featuredImage).toBe(post?.featuredImage);
  });

  it('rejects exact legacy wording, semantic overclaims, promotional copy, and wrong identity', () => {
    const serialized = JSON.stringify({
      raw,
      parsedContent: parsed.content,
      postTitle: post?.title,
      postContent: post?.content,
      postFaq: post?.faq,
    });
    const forbiddenLiterals = [
      'within 30 days from the date of receiving the judgment or mediation record',
      'from the date of receiving the judgment or mediation record',
      'handle the matter under the local law',
      'there are two ways to divorce in Taiwan',
      'First, additionally register the marriage in Taiwan and then divorce',
      'all property acquired during marriage is divided half and half',
      'divided half and half',
      'average monthly consumption expenditure',
      'both the support claim and the property-division claim must be asserted within **5 years**',
      'within **5 years** from the date of divorce',
      'the “party at fault” (the party responsible for the breakdown of the marriage) or',
      staleArticle1052TranslationInstruction,
      'the adulterous party cannot file a divorce lawsuit',
      'the constitutional judgment itself repealed the proviso',
      'first file a missing-person report with the police',
      'you may first petition the court to enforce the cohabitation duty and then file a divorce lawsuit',
      'child support may be claimed in line with Korea’s cost-of-living level',
      'the Hague Convention automatically applies to Taiwan',
      'reply promptly',
      'leave a comment',
      'DM',
      '曾俊瑋',
      'img-01.jpg',
      '댓글',
      '私訊',
      'お気軽にコメント',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(serialized).not.toContain(forbidden);
    }
    expect(raw).not.toContain(
      'receipt of a judgment or mediation record starts every thirty-day period',
    );
    expect(raw).not.toContain(
      'thirty days is only an online-filing period',
    );
    expect(raw).not.toContain('lateness invalidates divorce');
    expect(raw).not.toContain(
      'foreign marriage or divorce is governed only by foreign local law',
    );
    expect(raw).not.toContain(
      'registering the marriage in Taiwan or suing in Taiwan are the only choices',
    );
    expect(raw).not.toContain('every marital asset is divided equally');
    expect(raw).not.toContain(
      'average monthly consumption determines post-divorce support',
    );
    expect(raw).not.toContain(
      'responsible or adulterous spouse absolutely can or cannot petition',
    );
    expect(raw).not.toContain(
      'the constitutional judgment repealed the Article 1052 paragraph 2 proviso',
    );
    expect(raw).not.toContain(
      'a missing-person report or prior cohabitation action is always required',
    );
    expect(raw).not.toContain(
      'several months away from home is itself a divorce ground',
    );
    expect(raw).not.toContain(
      'child-support modification requires an unforeseeable event',
    );
    expect(raw).not.toContain(
      'Korean living costs alone determine child support',
    );
    expect(raw).toContain(
      'Do not state or imply that the 1980 Hague Child Abduction Convention automatically governs Taiwan.',
    );
    expect(raw).toContain(
      'There is no automatic right to immediate physical handover, use of force, a change of parental rights and duties, or punishment of the other parent merely because contact was blocked.',
    );
  });

  it('contains no invisible characters, cross-locale routes, or visible script leakage', () => {
    expect(raw).not.toContain('\uFEFF');
    expect(raw).not.toContain('\u00A0');
    expect(raw).not.toContain('\u200B');
    expect(raw).not.toMatch(/\]\(\/(?:ko|zh-hant|ja)(?:\/|\))/);
    expect(parsed.content).not.toMatch(/[\u3040-\u30ff]/);
    expect(parsed.content).not.toMatch(/[\uac00-\ud7af]/);
    // Visible CJK except the exact contracted attorney characters in the author line.
    const contentWithoutAuthor = parsed.content.replace(author, '');
    expect(contentWithoutAuthor).not.toMatch(/[\u4e00-\u9fff]/);
    expect(parsed.content).toContain('曾雋崴');
    expect(parsed.content).not.toMatch(
      /(?:reply promptly|お気軽にコメント|대만 이혼|台灣離婚程序)/,
    );
  });

  it('retains title, FAQ, source URL, and complete body through loader and parse', () => {
    expect(post?.title).toBe(title);
    expect(post?.faq).toEqual(faq);
    expect(raw).toContain(sourceUrl);
    expect(post?.content).toContain(`## ${headings[0]}`);
    expect(post?.content).toContain(`## ${headings[12]}`);
    expect(post?.content).toContain(faq1Answer);
    expect(post?.content).toContain(faq6Answer);
    expect(post?.content).toContain(disclaimer);
    expect(post?.content).toContain(author);
    for (const link of officialLinks) {
      expect(post?.content).toContain(link);
    }
    for (const link of internalLinks) {
      expect(post?.content).toContain(link);
    }
  });

  it('retains representative visible output through ColumnContent server render', () => {
    const html = renderToStaticMarkup(
      createElement(ColumnContent, { content: post?.content ?? '' }),
    );
    const civilCodeUrl =
      'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000001';
    const civilCodeUrlEscaped = civilCodeUrl.replace(/&/g, '&amp;');

    expect(html).toContain(headings[0]);
    expect(html).toContain(headings[12]);
    expect(html).toContain(faq1Answer);
    expect(html).toContain('Taiwan Civil Code');
    expect(
      html.includes(civilCodeUrl) || html.includes(civilCodeUrlEscaped),
    ).toBe(true);
    expect(html).toContain('/en/contact');
    expect(html).toContain('Contact Us');
  });
});
