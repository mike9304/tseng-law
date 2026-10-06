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

// Column 275 now carries the property, damages and support sections that 007 used to hold.
const propertySlug = 'taiwan-divorce-property-damages-support';
const propertyColumnPath = path.join(
  process.cwd(),
  'src/content/columns-en/275-taiwan-divorce-property-damages-support.md',
);
const propertyRaw = fs.readFileSync(propertyColumnPath, 'utf8');
const propertyParsed = matter(propertyRaw);
const propertyPost = getColumnPost(propertySlug, 'en');
const hubHref = `/en/columns/${canonicalSlug}`;
const propertyHref = `/en/columns/${propertySlug}`;

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
  'Under Civil Code Article 1050, the parties must agree to divorce in writing, at least two witnesses must sign after confirming both parties’ genuine intent to divorce, and the divorce must be registered with the household-registration authority. A signed agreement alone does not complete the divorce. Where foreign elements are involved, the parties must separately check the applicable law, document authentication and translation requirements, and any registration required in another country or region.';
const faq2Answer =
  'No. Depending on the nature of the family matter, a Taiwan court may order a party or legal representative to appear in person. A failure to comply without just cause may result in an initial fine of up to NTD 30,000 under Family Act Article 13 and Civil Procedure Code Article 303, which applies mutatis mutandis. Whether the spouses must mediate together in the same room, or whether separate sessions, safety measures, representation, or other procedural arrangements are available, depends on the court and the circumstances of the case.';
const responsibleSpouseParagraph =
  'The proviso to current Civil Code Article 1052, paragraph 2 provides that, where a serious cause for the breakdown of the marriage is attributable solely to one spouse, only the other spouse may, in principle, petition for divorce. However, Taiwan Constitutional Court Judgment 112-Hsien-Pan-4 held the proviso unconstitutional to the extent that it completely deprives the responsible spouse of any opportunity to divorce, without considering whether a considerable period has elapsed since the serious cause arose or whether it has continued for a considerable period, and thereby produces a manifestly harsh result in an individual case. Because the proviso remains in the statutory text, a petition by the responsible spouse should not be treated as automatically available or automatically barred; the outcome depends on how the court applies the judgment’s reasoning to the specific facts.';
const responsibleSpouseJudgmentSentence =
  'The Court held the proviso unconstitutional to the extent that it completely deprives the solely responsible spouse of any opportunity to divorce, without considering whether a considerable period has elapsed since the serious cause arose or whether it has continued for a considerable period, and thereby produces a manifestly harsh result in an individual case.';
const faq3Answer = responsibleSpouseParagraph;
const faq4Answer =
  'Under Civil Code Articles 1055 and 1055-1, a Taiwan court decides the exercise and assumption of rights and duties regarding a minor child, contact or visitation, and other child-related matters according to the child’s best interests. The court considers the statutory factors and the specific evidence, including the child’s age, health, views, and developmental needs; each parent’s living circumstances, caregiving capacity, and attitude; the child’s emotional relationship with each parent; and whether either parent has interfered with the child’s relationship with the other. Neither a parent’s income nor responsibility for the breakdown of the marriage determines the outcome by itself.';
const faq = [
  {
    q: 'Does signing a divorce agreement make a mutual-consent divorce in Taiwan immediately effective?',
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
    q: 'How does a Taiwan court decide issues concerning a minor child?',
    a: faq4Answer,
  },
];
// FAQ 4 and 5 of the former six moved to column 275 together with their sections.
const propertyFaqHouseAnswer =
  'No. Registered title to a house and the source of the purchase funds are important evidence, but specific claims concerning ownership, gifts, nominee registration, loans, or unjust enrichment are distinct from distribution of the residual-property difference under Civil Code Article 1030-1. The parties must separately examine their actual agreement, the cause and timing of acquisition, fund flows, debts, whether property was acquired gratuitously, and the supporting evidence. Neither paying part of the cost with premarital funds nor registering the house in one party’s name determines every issue.';
const propertyFaqClaimsAnswer =
  'No. A claim for distribution of the residual-property difference under Civil Code Article 1030-1, damages for judicial divorce under Article 1056, hardship support for a spouse without fault under Article 1057, and child support for a minor child have different elements, calculations, and time limits. The Article 1030-1 claim is subject to a two-year period from knowledge of the residual-property difference and a five-year period from termination of the statutory matrimonial-property regime, but those periods must not be carried over to the other claims.';
const propertyFaq = [
  {
    q: 'Does paying for a house or holding title decide ownership and residual-property distribution?',
    a: propertyFaqHouseAnswer,
  },
  {
    q: 'Are residual-property distribution, divorce damages, and post-divorce support the same claim or subject to one five-year period?',
    a: propertyFaqClaimsAnswer,
  },
];

const headings = [
  '1. Three Divorce Paths and First Cross-Border Checks',
  '2. Mutual-Consent Divorce and Household Registration',
  '3. Court Mediation, Litigation, Appearance, and Review',
  '4. Judicial-Divorce Grounds and the Responsible-Spouse Proviso',
  '5. Foreign Marriage, Foreign Divorce, and Taiwan Records',
  '6. House Title, Residual-Property Distribution, Damages, and Post-Divorce Support',
  '7. Minor Children, Parental Rights, and the Best-Interests Standard',
  '8. Child Support, Contact, Enforcement, and Interim Protection',
  '9. Cross-Border Relocation with a Child',
  '10. Evidence and Practical Preparation',
  '11. Official Sources',
  '12. Related Guidance',
];
const propertyHeadings = [
  '1. House Title, Premarital Funds, and Residual-Property Distribution',
  '2. Damages, Post-Divorce Support, Unmarried Partners, and Third Parties',
  '3. Official Sources',
  '4. Related Guidance',
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
// Inline column links in the hub, in order of appearance; the custody link is reused three times.
const inlineColumnLinks = [
  '[divorcing a Taiwanese spouse by agreement](/en/columns/taiwanese-spouse-divorce-agreement-registration)',
  '[getting a US divorce decree onto Taiwan’s household register](/en/columns/us-divorce-decree-recognition-taiwan)',
  '[preparing for a divorce consultation while living outside Taiwan](/en/columns/taiwanese-spouse-divorce-from-abroad)',
  '[house title, residual-property distribution, damages, and post-divorce support in a Taiwan divorce](/en/columns/taiwan-divorce-property-damages-support)',
  '[when the other parent keeps your child in Taiwan](/en/columns/us-parent-child-taken-to-taiwan-custody)',
  '[child support across borders](/en/columns/taiwan-child-support-enforcement-cross-border)',
  '[when the other parent keeps your child in Taiwan](/en/columns/us-parent-child-taken-to-taiwan-custody)',
  '[planning your child’s life across two countries](/en/columns/taiwanese-spouse-divorce-cross-border-parenting)',
  '[what a Taiwan family court can do](/en/columns/us-parent-child-taken-to-taiwan-custody)',
];
const propertyHubLink = inlineColumnLinks[3];

const disclaimer =
  'This article is educational material intended to provide a general overview of Taiwan’s legal regimes governing divorce, cross-border family matters, matrimonial property, and minor children; it is not legal advice for any specific matter.';
const propertyDisclaimer =
  'This article is educational material intended to provide a general overview of Taiwan’s legal regimes governing divorce, cross-border family matters, matrimonial property, and financial claims on divorce; it is not legal advice for any specific matter.';
const staleDisclaimer =
  'This article is general legal information only and is not legal advice. Jurisdiction, applicable law, recognition of foreign divorces or judgments, the specific facts and evidence, existing agreements or court orders, and current official rules may all change the analysis and result. Before taking action, calculate any application, review, limitation, or enforcement period from the correct triggering event for the specific right or procedure involved.';
const author = 'Wei Tseng (曾雋崴), Taiwan Attorney';
const exactEnding = `- ${internalLinks[2]}

${disclaimer}

${author}`;

const staleArticle1052TranslationInstruction =
  'Civil Code Article 1052 paragraph 1 lists ten specific grounds for judicial divorce. Translate them accurately; do not expand or shrink a statutory term into a broader colloquial ground.';
const article1052Paragraph1ReaderSentence =
  'Civil Code Article 1052 paragraph 1 sets out ten grounds on which a spouse may petition for judicial divorce when any of the following applies to the other spouse:';
const sexualIntercourseConsequencesParagraph =
  'Whether consensual sexual intercourse with a person other than one’s spouse constitutes a ground under Article 1052, paragraph 1 must be assessed in light of the precise facts, the statutory requirements, and any applicable time limits. The existence of that conduct does not, by itself, dictate the outcomes of a petition for judicial divorce, damages under Article 1056, residual-property distribution, post-divorce spousal support under Article 1057, the exercise and assumption of rights and duties regarding a minor child, or child support.';
const missingSpouseSubsectionHeading =
  '### Missing or absent spouses: no universal shortcut';
const missingSpouseTailParagraph =
  'A police missing-person report may be evidence of the spouse’s whereabouts and the passage of time, but it is not a mandatory prerequisite for every divorce claim. Nor is there a universal requirement to bring an action demanding cohabitation before alleging malicious desertion or another serious cause. Several months away from home, without more, does not establish any particular ground. The court must examine the reason for the departure, whether there was a justified reason to live separately, contact and support between the spouses, continuity, and the other specific facts.';
const foreignOverviewParagraph =
  'A foreign marriage or foreign divorce does not collapse into one universal Taiwan route. Identify, as separate questions, whether the marriage or divorce was completed abroad, whether Taiwan recognition or legal effect is sought, what Taiwan household registration is required, and what additional procedure remains necessary in another jurisdiction. Taiwan’s required recognition or legal-effect determination and household registration may vary with whether the instrument is a court judgment or administrative certificate, its country of issue and form, and the parties’ current household-registration status.';
const hubPropertySummaryParagraph =
  'Registered title to a house and the source of the purchase funds are important evidence, but specific claims concerning ownership, gifts, nominee registration, loans, or unjust enrichment are distinct from distribution of the residual-property difference under Civil Code Article 1030-1. A claim for distribution of the residual-property difference under Civil Code Article 1030-1, damages for judicial divorce under Article 1056, hardship support for a spouse without fault under Article 1057, and child support for a minor child have different elements, calculations, and time limits.';

const childScopeParagraph =
  'Under Taiwan law, the precise concept is the exercise and assumption of rights and duties regarding a minor child. It may include the child’s residence, day-to-day care, educational and medical decisions, management of the child’s property, and legal representation. Terms such as “parental rights” or “custody” may be used as shorthand for convenience, but no single term fully translates the entire set of rights and duties under Taiwan law.';
const bestInterestsSubsectionHeading =
  '### Best interests and statutory factors';
const bestInterestsFactorsParagraph =
  'Under Civil Code Article 1055-1, the court considers all circumstances in light of the child’s best interests, with particular attention to the child’s age, sex, and health; the number of children; the child’s views and needs for personality development; each parent’s age, occupation, conduct, health, financial means, and living circumstances; each parent’s willingness and attitude toward the child’s protection and upbringing; the emotional relationship between each parent and the child, or between the child and others who live with the child; any circumstances in which one parent has interfered with the relationship between the other parent and the child; and the traditional customs, culture, and values of each ethnic group. The court may hear the child’s views in the manner prescribed by law and may take into account investigations and opinions from competent authorities or child-welfare professionals. A parent’s higher income or responsibility for the breakdown of the marriage may be only one fact among many; neither is a sole criterion for the decision or a basis for rewarding or punishing a parent. A custody case over a child kept in Taiwan, including how the court weighs these factors, is covered in [when the other parent keeps your child in Taiwan](/en/columns/us-parent-child-taken-to-taiwan-custody).';
const unresolvedIssuesSubsectionHeading =
  '### Divorce while other issues remain open';
const unresolvedIssuesParagraph =
  'If the requirements of the chosen route to divorce are satisfied, the marriage itself may be dissolved first even though some property or child-related issues remain unresolved. This should not, however, be treated as a shortcut that can be recommended in every case. The preservation and settlement of unresolved property; the child’s residence, care, medical treatment, and education; the agreements or court orders needed for child support and contact; and whether interim orders are needed to ensure safety and continuity of daily life while the dispute remains pending must all be considered together.';
const childSupportParagraph =
  'Under Civil Code Article 1116-2, parents’ duty to support a minor child continues after divorce. Child support is a parent–child obligation. It is distinct from Article 1057 post-divorce support for a qualifying former spouse. The specific allocation of support should be determined from evidence of the child’s living expenses, education costs, medical expenses, and any special needs, together with each parent’s income, assets, ability to provide support, and actual share of caregiving. The part of a final child support ruling, or of a settlement reached in court, that has not yet been carried out may be changed on application to the court if, because circumstances have changed, leaving the original ruling or settlement as it stands has become clearly unfair (Family Act Article 102, paragraph 1, and Article 107, paragraph 2). Enforcing child support, including against a parent abroad, is covered in [child support across borders](/en/columns/taiwan-child-support-enforcement-cross-border).';
const familyActModificationSentence =
  'The part of a final child support ruling, or of a settlement reached in court, that has not yet been carried out may be changed on application to the court if, because circumstances have changed, leaving the original ruling or settlement as it stands has become clearly unfair (Family Act Article 102, paragraph 1, and Article 107, paragraph 2).';
const contactObstructedParagraph =
  'If contact or visitation is obstructed, the available response depends on the existing agreement or court order and on the facts. A party may seek a court determination of contact, a change of the arrangement, enforcement of an existing instrument, or an appropriate interim measure. Family Act Article 194 requires enforcement methods to be selected under the child’s best interests. Those methods may involve direct or indirect compulsion as the law and the facts allow.';
const contactEnforcementParagraph =
  'There is no automatic right to immediate physical handover, use of force, a change of parental rights and duties, or punishment of the other parent merely because contact was blocked. Child-support payments and compliance with contact or visitation arrangements must not be withheld or traded against each other in retaliation. To protect the child’s day-to-day welfare, each obligation and procedure should be handled independently. Provisional orders in a custody case, including a ban on taking the child out of Taiwan, are covered in [when the other parent keeps your child in Taiwan](/en/columns/us-parent-child-taken-to-taiwan-custody).';

const filingDocumentsParagraph =
  'Who may apply, whether filing through an agent is permitted, and which proof of identity, household-registration records, written divorce instrument, and other documents must be prepared should be determined by reference to the Ministry of the Interior’s household-registration guidance for divorce registration in force at the time of filing and confirmed with the competent household-registration office. Depending on the type of document and where it was prepared, a document prepared outside Taiwan may require authentication by a Taiwan overseas mission or another competent authority. If the official guidance so requires, an authenticated or notarized Chinese translation must also be submitted. Release clauses and filing through a representative are covered in [divorcing a Taiwanese spouse by agreement](/en/columns/taiwanese-spouse-divorce-agreement-registration).';
const filingDocumentsPrefixMarker =
  '3. Household registration. Registration with the household-registration authority is constitutive for this path. Without registration, the private writing does not complete a Taiwan mutual-consent divorce.';
const courtResultsSubsectionHeading =
  '### Court results and Household Registration Act Articles 48 and 48-2';
const courtResultsFirstParagraph =
  'When a Taiwan divorce judgment becomes final or court mediation or settlement ends the marriage, either party may, in principle, apply for divorce registration with the household-registration authority. Registration of the court result is governed by the Household Registration Act rather than Article 1050’s constitutive sequence for mutual-consent divorce.';
const courtResultsOnlineParagraph =
  'Online filing is available only within the statutory application period.';
const mediationIntroParagraph =
  'Family matters governed by the Family Act ordinarily proceed through court mediation before adjudication. Even a matter filed directly for adjudication may be deemed an application for mediation under the Act. Because there are exceptions involving the method of service or the nature of the matter, as well as rules governing transitions between procedures, however, not every case can be described as following a single immutable sequence. Mediation may address not only the parties’ intention to divorce but also related issues involving property, children, and the manner of payment, but the court may not confirm, without modification, an agreement that is detrimental to a minor child.';
const courtMediationOutcomeParagraph =
  'Court mediation or settlement, once established, terminates the marriage in the manner prescribed by law and has the same effect as a final and binding judgment. Litigation may continue under the applicable procedure if mediation is unsuccessful; for a divorce by judgment, what matters is that the judgment becomes final and binding.';
const personalAppearanceParagraphs = [
  'Family Act Article 13 applies when the court orders a party or legal representative to appear in person. Unjustified nonappearance then triggers Civil Procedure Code Article 303 mutatis mutandis: a first fine of up to NTD 30,000, possible repeated sanctions after further lawful notice, and no arrest for compulsory appearance under this rule.',
  'The order to appear personally is not the same as a universal rule that both spouses must always mediate face-to-face. Remote, separate, representative, or safety arrangements are available only if the court so decides under law and the circumstances.',
];

const evidenceItems = [
  '1. Identity, status, and addresses. Organize proof of marriage, Taiwan household-registration records, and each party’s nationality, domicile, habitual residence, and current address.',
  '2. Divorce instruments and court papers. Collect and organize by procedure any written mutual-consent divorce agreement; documentation of how the witnesses confirmed the spouses’ genuine intent to divorce; court papers; records of service; mediation and settlement records; judgments; and documents proving finality.',
  '3. Foreign marriage or divorce records. For foreign marriage and divorce records and foreign judgments or certificates, check authentication by a Taiwan overseas mission or other competent authority; the Chinese translation and whether it has been certified or notarized; and their recognition, legal effect, and registration status in Taiwan.',
  '4. Alleged divorce-ground chronology. Create a neutral timeline of the events and their timing underlying the alleged grounds for divorce. Preserve lawfully obtained communications, medical and police records, and other evidence in their original state.',
  '5. Each child’s situation. Compile information on each child’s age, health, education, residence, caregiving history and current care arrangements, views appropriate to the child’s stage of development, relationship with each parent, and safety and stability, all from the perspective of the child’s best interests.',
  '6. Support, contact, and relocation plans. Compile together any current child-related agreements and court proceedings, child-support payment records and actual expenses, the history of contact or visitation, travel documents and itineraries, and any specific plan for international relocation.',
  '7. Deadlines calculated from correct triggering events. Link every date for applications, registrations, appeals from judgments, appeals from rulings, the exercise of claims, and enforcement to its precise triggering event. The dates on which a judgment is rendered, served, or becomes final; a mediated agreement or settlement is reached; the holder of a right becomes aware of it; or the matrimonial property regime terminates are different dates.',
  '8. Privacy plan and limited disclosure. Share identification numbers, addresses, and medical, educational, or financial information concerning a spouse or child only with people and institutions that need the information and only to the extent necessary. Establish a privacy plan covering file-access permissions, methods of transmission, and disposal of copies.',
];
const evidenceProhibitionsParagraph =
  'Do not use unlawful surveillance, unauthorized access to accounts, intrusion into a mobile phone or computer, location tracking, recordings made in violation of law, or disclosure of a child’s private information as methods of gathering evidence.';
// Wording rejected in earlier rounds that must not return to the evidence section.
const staleEvidenceWording = [
  'Prepare a non-adversarial file early. The goal is accuracy, preservation of originals, and privacy-safe handling—not advantage-seeking through unlawful methods. Organize materials in at least the following nine groups.',
  'and current addresses for each spouse and child',
  'These materials frame jurisdiction, service, and registration questions.',
  'Keep originals or certified copies and note how and when each instrument was served or became final.',
  'Documents from mainland China, Hong Kong, and Macao follow distinct verification tracks',
  'materials showing gifts, nominee arrangements, reimbursements, or other theories',
  'Distinguish ownership claims from residual-property calculation inputs.',
  'preservation of original media and metadata',
  'Do not create evidence by unlawful means.',
  'views where appropriate',
  'Handle identifiers and school or medical details with privacy in mind.',
  'expense records',
  'any proposed relocation plan with supporting logistics',
  'travel or movement schedules',
  'knowledge of a residual-property difference',
  'not from a convenient or informal date.',
  'mediation or settlement is concluded',
  'the relevant person learns of the right',
  'preserve fragile evidence promptly',
  'notarial or other formal preservation',
  'Do not engage in unlawful surveillance',
  'Those acts may create separate liability and undermine legitimate claims.',
];

// Re-frozen after the 2026-10-06 hub trim (sections 6 and 8 to 10 reduced, property part moved to column 275).
const frozenBeforeFilingDocumentsSha256 =
  '170a56aefc755bbacb5e306408c09c6b9f388542656128361d88a31e366e5f68';
const frozenCourtResultsSubsectionSha256 =
  '8d510f3ab4c2b908ae222a5af79038fb82dcce258d9af9438a1147dc69318a97';
const frozenSection3OnwardSha256 =
  'aa0a3e827386fcf35ae41d4051ec3e1c673252547f41cd5f092ebe604234bf81';
const frozenSection4OutsideArticle1052IntroSha256 =
  '639f4d5147e1fd6e61075d7678a9043f3337d5dbbb14df859eb9226c1322ebd0';
const frozenSection5OnwardSha256 =
  '0212aa987a46d2b81f19649ddd92dfa354d5ddc9d310d16c815778b7aa8f4bad';
const frozenSection1OnwardSha256 =
  '27cfb4e516fd60cfcd59de469e7fb85868b69433ab189cb879d253af4f220062';
const frozenVisibleWordCount = 3_323;
const frozenSourceSha256 =
  'a860b12a22142998c8a341874e6956f962aa67e652f9f39d8e546db0f144e0a5';

function countOccurrences(value: string, needle: string) {
  return value.split(needle).length - 1;
}

function sha256(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function firstParagraphAfter(content: string, heading: string) {
  return content.split(`${heading}\n\n`)[1]?.split('\n\n')[0];
}

function paragraphsAfter(content: string, heading: string) {
  return content.split(`${heading}\n\n`)[1]?.split('\n\n') ?? [];
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
      seoTitle: 'Taiwan Divorce Q&A: Property and Children',
      url: sourceUrl,
      lastmod: '2026-10-06',
      date_display: 'September 13, 2025',
      read_time: '14 min read',
      categories: ['Taiwan Legal Information'],
      featured_image: featuredImage,
      summary:
        'A Taiwan divorce may use mutual consent, mediation, or litigation. Household registration, property division, and parental rights remain separate issues.',
      faq,
    });
    expect(parsed.data.faq).toHaveLength(4);
    expect(post).toMatchObject({
      slug: canonicalSlug,
      title,
      date: '2026-10-06',
      dateDisplay: 'September 13, 2025',
      readTime: '14 min read',
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

  it('uses exactly the twelve contracted H2 sections in order', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(headings);
  });

  it('keeps each exact FAQ answer once in the frontmatter and the loader, and moves FAQ 4 and 5 to column 275', () => {
    for (const { q, a } of faq) {
      expect(countOccurrences(raw, a), q).toBe(1);
      expect(post?.faq?.map((item) => item.a), q).toContain(a);
      expect(post?.content, q).not.toContain(a);
    }
    expect(post?.faq).toHaveLength(4);

    for (const { q, a } of propertyFaq) {
      expect(raw, q).not.toContain(q);
      expect(raw, q).not.toContain(a);
      expect(countOccurrences(propertyRaw, a), q).toBe(1);
      expect(propertyPost?.faq?.map((item) => item.a), q).toContain(a);
    }
  });

  it('locks one exact substantive proposition in its assigned section for the twenty-four surviving legacy topics', () => {
    // Legacy topic 10 (case-duration factors) was dropped from the hub on 2026-10-06 (hub trim)
    // and has no counterpart in column 007 or 275; topics marked `column: 'property'` now live
    // in column 275. Topics 2, 4, 7, 12, 17, 19, 21 and 25 are re-anchored to the sentence that
    // now carries the same proposition.
    const removedLegacyTopics = [10];
    const legacyCoverage: Array<{
      number: number;
      heading: string;
      phrase: string;
      column?: 'property';
    }> = [
      {
        number: 1,
        heading: headings[0],
        phrase:
          'Mutual-consent divorce is a private status act that becomes effective only when Civil Code Article 1050’s writing, witness, and household-registration requirements are all satisfied.',
      },
      {
        number: 2,
        heading: headings[4],
        phrase:
          'Identify, as separate questions, whether the marriage or divorce was completed abroad, whether Taiwan recognition or legal effect is sought, what Taiwan household registration is required, and what additional procedure remains necessary in another jurisdiction.',
      },
      {
        number: 3,
        heading: propertyHeadings[0],
        column: 'property',
        phrase:
          'A down payment or loan installment paid from premarital savings is relevant source-of-funds evidence. It does not by itself transfer registered title or dictate every later claim.',
      },
      {
        number: 4,
        heading: headings[2],
        phrase: personalAppearanceParagraphs[1],
      },
      {
        number: 5,
        heading: propertyHeadings[1],
        column: 'property',
        phrase:
          'Government average consumption statistics are not a binding formula that automatically sets Article 1057 support.',
      },
      {
        number: 6,
        heading: propertyHeadings[0],
        column: 'property',
        phrase:
          'Transfer records, sale and purchase agreements, loan agreements and repayment records, receipts, messages between the parties, tax records, registration records, and the basis and timing of acquisition must be considered together to reveal the parties’ actual legal relationship.',
      },
      {
        number: 7,
        heading: headings[5],
        phrase:
          'A claim for distribution of the residual-property difference under Civil Code Article 1030-1, damages for judicial divorce under Article 1056, hardship support for a spouse without fault under Article 1057, and child support for a minor child have different elements, calculations, and time limits.',
      },
      {
        number: 8,
        heading: headings[6],
        phrase: unresolvedIssuesParagraph,
      },
      {
        number: 9,
        heading: headings[1],
        phrase: filingDocumentsParagraph,
      },
      {
        number: 11,
        heading: headings[3],
        phrase: article1052Paragraph1ReaderSentence,
      },
      {
        number: 12,
        heading: headings[3],
        phrase:
          'Its proviso provides that if that cause is attributable to one spouse, only the other spouse may petition.',
      },
      {
        number: 13,
        heading: headings[2],
        phrase: mediationIntroParagraph,
      },
      {
        number: 14,
        heading: propertyHeadings[1],
        column: 'property',
        phrase:
          'Article 1057 concerns post-divorce support when a spouse without fault falls into financial hardship because of a judicial divorce.',
      },
      {
        number: 15,
        heading: propertyHeadings[1],
        column: 'property',
        phrase:
          'An unmarried couple does not obtain divorce rights, Article 1056 divorce damages, or Article 1057 post-divorce support merely because they lived together.',
      },
      {
        number: 16,
        heading: headings[6],
        phrase:
          'A signed divorce agreement does not bar later review under the best-interests standard',
      },
      {
        number: 17,
        heading: headings[7],
        phrase: familyActModificationSentence,
      },
      {
        number: 18,
        heading: headings[7],
        phrase:
          'There is no automatic right to immediate physical handover, use of force, a change of parental rights and duties, or punishment of the other parent merely because contact was blocked.',
      },
      {
        number: 19,
        heading: headings[2],
        phrase:
          'There is no single universal appeal deadline that covers every family decision.',
      },
      {
        number: 20,
        heading: propertyHeadings[0],
        column: 'property',
        phrase:
          'Neither extramarital sexual relations nor responsibility for the breakdown of the marriage automatically bars or reduces a claim for distribution of the residual-property difference.',
      },
      {
        number: 21,
        heading: headings[3],
        phrase:
          'The existence of that conduct does not, by itself, dictate the outcomes of a petition for judicial divorce, damages under Article 1056, residual-property distribution, post-divorce spousal support under Article 1057, the exercise and assumption of rights and duties regarding a minor child, or child support.',
      },
      {
        number: 22,
        heading: propertyHeadings[1],
        column: 'property',
        phrase:
          'Serious interference or insults by a third party do not automatically give rise to damages.',
      },
      {
        number: 23,
        heading: headings[3],
        phrase:
          'A police missing-person report may be evidence of the spouse’s whereabouts and the passage of time, but it is not a mandatory prerequisite for every divorce claim.',
      },
      {
        number: 24,
        heading: headings[3],
        phrase:
          'Several months away from home, without more, does not establish any particular ground.',
      },
      {
        number: 25,
        heading: headings[8],
        phrase:
          'Cross-border relocation with a minor child is not decided by Korean living costs, a single nationality, or a treaty label alone.',
      },
    ];

    expect(legacyCoverage.map(({ number }) => number)).toEqual(
      Array.from({ length: 25 }, (_, index) => index + 1).filter(
        (number) => !removedLegacyTopics.includes(number),
      ),
    );
    for (const { heading, phrase, column } of legacyCoverage) {
      const owner =
        column === 'property'
          ? { content: propertyParsed.content, loaded: propertyPost?.content }
          : { content: parsed.content, loaded: post?.content };
      expect(sectionBody(owner.content, heading)).toContain(phrase);
      expect(owner.loaded).toContain(phrase);
    }
  });

  it('locks the three paths and five separate cross-border questions', () => {
    const section = sectionBody(parsed.content, headings[0]);
    const requiredPhrases = [
      'Mutual-consent divorce is a private status act',
      'Divorce established through court mediation or settlement ends the marriage when the court mediation or settlement is established.',
      'Judicial divorce is granted by court judgment on a statutory ground under Civil Code Article 1052.',
      'whether a Taiwan court or administrative authority has jurisdiction or authority to handle the requested step;',
      'which jurisdiction’s law applies to divorce, matrimonial property, and child-related issues;',
      'whether a foreign divorce, judgment, or status act is recognized or effective in Taiwan;',
      'what Taiwan household-registration step and authenticated documents are required; and',
      'what additional registration, recognition, or enforcement step is required in another relevant jurisdiction.',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Article 1050 elements and the qualified court-result registration rule', () => {
    const section = sectionBody(parsed.content, headings[1]);
    const requiredPhrases = [
      'Article 1050 separates three requirements:',
      'Writing. The mutual-consent divorce must be in writing.',
      'A witness does not satisfy the requirement by merely adding a name to a document without confirming that intent.',
      'Registration with the household-registration authority is constitutive for this path.',
      'Without registration, the private writing does not complete a Taiwan mutual-consent divorce.',
      'thirty days from finality of the Taiwan divorce judgment or from establishment of the court mediation or settlement',
      'The date on which a judgment or record is served or received is not the common triggering date in every case.',
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

  it('preserves the statutory online window as the last paragraph of the court-results subsection', () => {
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
    expect(onlineParagraph).toBe(courtResultsOnlineParagraph);
    expect(courtResultsSubsection).toContain(
      'the general application period for registration is thirty days',
    );
    expect(raw).not.toContain('thirty days is only an online-filing period');
  });

  it('opens section 3 with the complete mediation introduction and the court-outcome paragraph', () => {
    expect(
      paragraphsAfter(parsed.content, `## ${headings[2]}`).slice(0, 3),
    ).toEqual([
      mediationIntroParagraph,
      courtMediationOutcomeParagraph,
      '### Personal appearance',
    ]);
    expect(countOccurrences(parsed.content, mediationIntroParagraph)).toBe(1);
    expect(
      countOccurrences(parsed.content, courtMediationOutcomeParagraph),
    ).toBe(1);
  });

  it('locks Family Act Article 13 and the type-specific effects and review routes', () => {
    const section = sectionBody(parsed.content, headings[2]);
    const reviewParagraph =
      'Review or appeal depends on the type of decision, how and when it was served, whether it is final, and the case’s procedural posture. A mediation or settlement record, a ruling, and a judgment are not interchangeable for that purpose. There is no single universal appeal deadline that covers every family decision.';
    const requiredPhrases = [
      mediationIntroParagraph,
      courtMediationOutcomeParagraph,
      ...personalAppearanceParagraphs,
      reviewParagraph,
      'a first fine of up to NTD 30,000',
      'no arrest for compulsory appearance under this rule',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
    expect(
      paragraphsAfter(parsed.content, '### Personal appearance').slice(0, 2),
    ).toEqual(personalAppearanceParagraphs);
    expect(
      firstParagraphAfter(parsed.content, '### Review and appeal'),
    ).toBe(reviewParagraph);
  });

  it('locks Article 1052 paragraph 1 grounds, including the 惡疾 wording, paragraph 2, and the constitutional qualification', () => {
    const section = sectionBody(parsed.content, headings[3]);
    const grounds = [
      '1. Bigamy.',
      '2. Consensual sexual intercourse with a person other than the spouse.',
      '3. Unbearable abuse by one spouse against the other.',
      '4. Abuse by one spouse against the other spouse’s lineal relative, or by one spouse’s lineal relative against the other spouse, making common life unbearable.',
      '5. Malicious desertion of the other spouse in a continuing state.',
      '6. An attempt by one spouse to kill the other.',
      '7. An incurable loathsome disease (不治之惡疾).',
      '8. A serious incurable mental illness.',
      '9. Life or death unknown for more than three years.',
      '10. A final sentence of imprisonment for more than six months for an intentional offense.',
    ];
    const requiredPhrases = [
      'Civil Code Article 1052 paragraph 1 sets out ten grounds on which a spouse may petition for judicial divorce',
      'Paragraph 2 is separate from the ten grounds.',
      'the wording of the proviso itself remained in the statute as of 2026-10-06.',
      'Although the legislative period specified by Constitutional Court Judgment 112-Hsien-Pan-4 has elapsed',
      responsibleSpouseJudgmentSentence,
      'Courts must apply the judgment’s constitutional reasoning to the facts of each case.',
      sexualIntercourseConsequencesParagraph,
      missingSpouseTailParagraph,
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
    expect(section).not.toContain('An incurable serious disease');
    expect(raw).not.toContain('An incurable serious disease');
  });

  it('keeps the responsible-spouse qualification exactly once in the FAQ and not as a body paragraph', () => {
    expect(parsed.data.faq[2]?.a).toBe(responsibleSpouseParagraph);
    expect(post?.faq?.[2]?.a).toBe(responsibleSpouseParagraph);
    expect(countOccurrences(raw, responsibleSpouseParagraph)).toBe(1);
    expect(post?.content).not.toContain(responsibleSpouseParagraph);
    expect(raw).not.toContain('generally constitutional');
  });

  it('uses the exact constitutional holding in the Paragraph 2 subsection', () => {
    const section = sectionBody(parsed.content, headings[3]);
    const subsectionStart = section.indexOf(
      '### Paragraph 2 and the responsible-spouse proviso',
    );
    const subsectionEnd = section.indexOf(
      `\n\n${missingSpouseSubsectionHeading}`,
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

  it('places the sexual-intercourse paragraph in the Paragraph 2 subsection and the missing-spouse paragraph at the Section 4 tail boundary', () => {
    const exactBoundary = `${sexualIntercourseConsequencesParagraph}\n\n${missingSpouseSubsectionHeading}\n\n${missingSpouseTailParagraph}\n\n## ${headings[4]}`;

    expect(parsed.content).toContain(exactBoundary);
    expect(
      countOccurrences(parsed.content, sexualIntercourseConsequencesParagraph),
    ).toBe(1);
    expect(countOccurrences(parsed.content, missingSpouseTailParagraph)).toBe(
      1,
    );
  });

  it('presents the Article 1052 paragraph 1 rule to readers without exposing a translation instruction or changing later text', () => {
    const section = sectionBody(parsed.content, headings[3]);
    const introMarker = `## ${headings[3]}\n\n`;
    const introStart = section.indexOf(introMarker) + introMarker.length;
    const listStart = section.indexOf('\n\n1. Bigamy.', introStart);
    const section5Start = parsed.content.indexOf(`## ${headings[4]}`);
    const section4OutsideIntro =
      section.slice(0, introStart) +
      '<ARTICLE_1052_PARAGRAPH_1_READER_SENTENCE>' +
      section.slice(listStart);

    expect(introStart).toBeGreaterThan(introMarker.length - 1);
    expect(listStart).toBeGreaterThan(introStart);
    expect(firstParagraphAfter(parsed.content, `## ${headings[3]}`)).toBe(
      article1052Paragraph1ReaderSentence,
    );
    expect(firstParagraphAfter(post?.content ?? '', `## ${headings[3]}`)).toBe(
      article1052Paragraph1ReaderSentence,
    );
    expect(section).toContain(
      `## ${headings[3]}\n\n${article1052Paragraph1ReaderSentence}\n\n1. Bigamy.`,
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

  it('locks the foreign-record separation of questions, the recognition paragraph, and regional verification', () => {
    const section = sectionBody(parsed.content, headings[4]);
    const requiredPhrases = [
      'A foreign marriage or foreign divorce does not collapse into one universal Taiwan route.',
      foreignOverviewParagraph,
      'Documents from mainland China, Hong Kong, and Macao follow verification regimes that differ from ordinary foreign authentication.',
    ];

    expect(firstParagraphAfter(parsed.content, `## ${headings[4]}`)).toBe(
      foreignOverviewParagraph,
    );
    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
    expect(section).not.toContain('public policy');
    // Authentication and translation of foreign documents stays locked in sections 2 and 10.
    expect(sectionBody(parsed.content, headings[1])).toContain(
      'a document prepared outside Taiwan may require authentication by a Taiwan overseas mission or another competent authority',
    );
    expect(sectionBody(parsed.content, headings[9])).toContain(
      'check authentication by a Taiwan overseas mission or other competent authority; the Chinese translation and whether it has been certified or notarized',
    );
  });

  it('keeps only the property, damages and support summary in the hub and links to column 275', () => {
    const section = sectionBody(parsed.content, headings[5]);

    expect(firstParagraphAfter(parsed.content, `## ${headings[5]}`)).toBe(
      `${hubPropertySummaryParagraph} Property, damages, and support claims are covered in ${propertyHubLink}.`,
    );
    expect(section).toContain(hubPropertySummaryParagraph);
    expect(propertyHubLink).toContain(`](${propertyHref})`);
    expect(countOccurrences(raw, `](${propertyHref})`)).toBe(1);
    expect(propertyPost?.slug).toBe(propertySlug);
    // Detailed Article 1017/1030-1/1056/1057 text now lives only in column 275.
    expect(parsed.content).not.toContain('Article 1017');
    expect(parsed.content).not.toContain('solatium');
    expect(parsed.content).not.toContain('manifestly unfair');
  });

  it('locks Articles 1055 and 1055-1, the full Taiwan concept, review, and unresolved issues', () => {
    const section = sectionBody(parsed.content, headings[6]);
    const requiredPhrases = [
      childScopeParagraph,
      'management of the child’s property, and legal representation',
      'Under Civil Code Article 1055, parents may agree on who will exercise and assume these rights and duties after divorce.',
      'if an agreement is adverse to the child, the court may modify it or make any necessary decision',
      'A signed divorce agreement does not bar later review under the best-interests standard',
      bestInterestsFactorsParagraph,
      'the court considers all circumstances in light of the child’s best interests',
      'the child’s age, sex, and health; the number of children; the child’s views and needs for personality development',
      'each parent’s age, occupation, conduct, health, financial means, and living circumstances',
      'each parent’s willingness and attitude toward the child’s protection and upbringing',
      'the emotional relationship between each parent and the child, or between the child and others who live with the child',
      'any circumstances in which one parent has interfered with the relationship between the other parent and the child',
      'the traditional customs, culture, and values of each ethnic group',
      'The court may hear the child’s views in the manner prescribed by law',
      'investigations and opinions from competent authorities or child-welfare professionals',
      'A parent’s higher income or responsibility for the breakdown of the marriage may be only one fact among many',
      unresolvedIssuesParagraph,
      'whether interim orders are needed to ensure safety and continuity of daily life while the dispute remains pending',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
    expect(section).not.toContain('Do not state');
  });

  it('publishes the exact scope, best-interests-factors and unresolved-issues paragraphs at their section positions', () => {
    const section7Paragraphs = paragraphsAfter(
      parsed.content,
      `## ${headings[6]}`,
    );

    expect(section7Paragraphs[0]).toBe(childScopeParagraph);
    expect(section7Paragraphs[1]).toMatch(
      /^Under Civil Code Article 1055, parents may agree/,
    );
    expect(
      firstParagraphAfter(parsed.content, bestInterestsSubsectionHeading),
    ).toBe(bestInterestsFactorsParagraph);
    expect(
      parsed.content.indexOf(
        `${unresolvedIssuesSubsectionHeading}\n\n${unresolvedIssuesParagraph}\n\n## ${headings[7]}`,
      ),
    ).toBeGreaterThan(-1);
    expect(countOccurrences(parsed.content, childScopeParagraph)).toBe(1);
    expect(countOccurrences(parsed.content, bestInterestsFactorsParagraph)).toBe(
      1,
    );
    expect(countOccurrences(parsed.content, unresolvedIssuesParagraph)).toBe(1);
  });

  it('locks Article 1116-2 support, Family Act Articles 102 and 107 modification, and Article 194 enforcement qualifications', () => {
    const section = sectionBody(parsed.content, headings[7]);
    const requiredPhrases = [
      'Under Civil Code Article 1116-2, parents’ duty to support a minor child continues after divorce.',
      'It is distinct from Article 1057 post-divorce support for a qualifying former spouse.',
      familyActModificationSentence,
      'Family Act Article 194 requires enforcement methods to be selected under the child’s best interests.',
      'Those methods may involve direct or indirect compulsion as the law and the facts allow.',
      'There is no automatic right to immediate physical handover, use of force, a change of parental rights and duties, or punishment of the other parent merely because contact was blocked.',
      'Child-support payments and compliance with contact or visitation arrangements must not be withheld or traded against each other in retaliation.',
    ];

    expect(firstParagraphAfter(parsed.content, `## ${headings[7]}`)).toBe(
      childSupportParagraph,
    );
    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
    expect(
      paragraphsAfter(parsed.content, '### Contact, visitation, and enforcement').slice(
        0,
        2,
      ),
    ).toEqual([contactObstructedParagraph, contactEnforcementParagraph]);
    // The modification rule is limited to final rulings and court settlements and is not a foreseeability test.
    expect(parsed.content).not.toMatch(/unforeseeab|foreseeable/i);
    expect(raw).not.toContain(
      'child-support modification requires an unforeseeable event',
    );
  });

  it('locks the three relocation questions, non-treaty shortcut, and no unauthorized removal', () => {
    const section = sectionBody(parsed.content, headings[8]);
    const relocationQuestions = [
      '1. Authority over residence and travel. Who has authority, under agreement or court order, to decide the child’s residence, international travel, and related daily-care arrangements?',
      '2. Consent or court order. Does the other parent consent, or is a court determination required before relocation or retention abroad?',
      '3. Passports, entry, exit, immigration, and registration. What requirements govern passport issuance and use, entry and exit, residence or immigration status, and family-status registration in Taiwan and the destination?',
    ];
    const requiredPhrases = [
      'Cross-border relocation with a minor child is not decided by Korean living costs, a single nationality, or a treaty label alone.',
      'The 1980 Hague Child Abduction Convention does not automatically govern Taiwan.',
      'Taking a child away or refusing to return the child contrary to an existing agreement or order should not be recommended',
      'identify any available urgent protective measures',
    ];

    expect(
      section.split('\n').filter((line) => /^\d+\. /.test(line)),
    ).toEqual(relocationQuestions);
    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
    expect(section).not.toContain('habitual residence');
    expect(section).not.toContain('Do not state or imply');
  });

  it('uses the exact ordered eight-category evidence checklist and privacy prohibitions', () => {
    const section = sectionBody(parsed.content, headings[9]);

    expect(
      section.split('\n').filter((line) => /^\d+\. /.test(line)),
    ).toEqual(evidenceItems);
    for (const item of evidenceItems) {
      expect(countOccurrences(section, item), item).toBe(1);
    }
    expect(section.trim().endsWith(evidenceProhibitionsParagraph)).toBe(true);
    expect(countOccurrences(section, evidenceProhibitionsParagraph)).toBe(1);
    expect(firstParagraphAfter(parsed.content, `## ${headings[9]}`)).toBe(
      evidenceItems.join('\n'),
    );
    for (const stale of staleEvidenceWording) {
      expect(section, stale).not.toContain(stale);
    }
  });

  it('uses exactly the nine inline English column links, ten official links and three English internal links once and in order', () => {
    const markdownLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g),
      (match) => match[0],
    );
    const externalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((https?:\/\/[^)]+)\)/g),
      (match) => match[1],
    );

    expect(markdownLinks).toEqual([
      ...inlineColumnLinks,
      ...officialLinks,
      ...internalLinks,
    ]);
    expect(externalTargets).toEqual(officialUrls);
    for (const url of officialUrls) {
      expect(countOccurrences(parsed.content, url)).toBe(1);
    }
    for (const link of [...officialLinks, ...internalLinks]) {
      expect(countOccurrences(raw, link)).toBe(1);
    }
    for (const link of new Set(inlineColumnLinks)) {
      expect(countOccurrences(raw, link), link).toBe(
        inlineColumnLinks.filter((candidate) => candidate === link).length,
      );
    }
    expect(parsed.content).not.toMatch(/\]\(\/(?:ko|zh-hant|ja)(?:\/|\))/);
  });

  it('links the hub to column 275 and every inline English column link resolves to a published English column', () => {
    expect(raw).toContain(`](${propertyHref})`);
    expect(propertyRaw).toContain(`](${hubHref})`);

    for (const link of inlineColumnLinks) {
      const linkedSlug = link.match(/\(\/en\/columns\/([^)]+)\)$/)?.[1] ?? '';
      expect(getColumnPost(linkedSlug, 'en'), link).toBeDefined();
    }
  });

  it('ends with the exact disclaimer and author and nothing else', () => {
    expect(raw.trimEnd().endsWith(exactEnding)).toBe(true);
    expect(raw.trimEnd()).toMatch(
      /\n\nWei Tseng \(曾雋崴\), Taiwan Attorney$/,
    );
    expect(countOccurrences(raw, disclaimer)).toBe(1);
    expect(countOccurrences(raw, author)).toBe(1);
    expect(raw).not.toContain(staleDisclaimer);
  });

  it('freezes the exact visible English word count, calculated read time, and source digest', () => {
    const visibleWordCount = countVisibleEnglishWords(parsed.content);
    // Lane policy 2026-10-06: en read_time is recalculated at about 230 words per minute.
    const calculatedMinutes = Math.round(visibleWordCount / 230);
    const sourceSha256 = crypto
      .createHash('sha256')
      .update(raw)
      .digest('hex');

    expect(visibleWordCount).toBe(frozenVisibleWordCount);
    expect(calculatedMinutes).toBe(14);
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
    expect(post?.content).toContain(`## ${headings[11]}`);
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

  it('rejects exact legacy wording, semantic overclaims, promotional copy, leaked instructions, and wrong identity in the hub and column 275', () => {
    const serialized = JSON.stringify({
      raw,
      parsedContent: parsed.content,
      postTitle: post?.title,
      postContent: post?.content,
      postFaq: post?.faq,
      propertyRaw,
      propertyParsedContent: propertyParsed.content,
      propertyPostTitle: propertyPost?.title,
      propertyPostContent: propertyPost?.content,
      propertyPostFaq: propertyPost?.faq,
    });
    const hubAndPropertyRaw = `${raw}\n${propertyRaw}`;
    const forbiddenLiterals = [
      'within 30 days from the date of receiving the judgment or mediation record',
      'from the date of receiving the judgment or mediation record',
      'handle the matter under the local law',
      'there are two ways to divorce in Taiwan',
      'First, additionally register the marriage in Taiwan and then divorce',
      'all property acquired during marriage is divided half and half',
      'divided half and half',
      'average monthly consumption expenditure',
      'both the support claim and the property-division claim must be asserted within 5 years',
      'within 5 years from the date of divorce',
      'the “party at fault” (the party responsible for the breakdown of the marriage) or',
      staleArticle1052TranslationInstruction,
      'the adulterous party cannot file a divorce lawsuit',
      'the constitutional judgment itself repealed the proviso',
      'first file a missing-person report with the police',
      'you may first petition the court to enforce the cohabitation duty and then file a divorce lawsuit',
      'child support may be claimed in line with Korea’s cost-of-living level',
      'the Hague Convention automatically applies to Taiwan',
      'Do not state',
      'Do not treat',
      'Do not promise',
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
    expect(hubAndPropertyRaw).not.toContain(
      'receipt of a judgment or mediation record starts every thirty-day period',
    );
    expect(hubAndPropertyRaw).not.toContain(
      'thirty days is only an online-filing period',
    );
    expect(hubAndPropertyRaw).not.toContain('lateness invalidates divorce');
    expect(hubAndPropertyRaw).not.toContain(
      'foreign marriage or divorce is governed only by foreign local law',
    );
    expect(hubAndPropertyRaw).not.toContain(
      'registering the marriage in Taiwan or suing in Taiwan are the only choices',
    );
    expect(hubAndPropertyRaw).not.toContain(
      'every marital asset is divided equally',
    );
    expect(hubAndPropertyRaw).not.toContain(
      'average monthly consumption determines post-divorce support',
    );
    expect(hubAndPropertyRaw).not.toContain(
      'responsible or adulterous spouse absolutely can or cannot petition',
    );
    expect(hubAndPropertyRaw).not.toContain(
      'the constitutional judgment repealed the Article 1052 paragraph 2 proviso',
    );
    expect(hubAndPropertyRaw).not.toContain(
      'a missing-person report or prior cohabitation action is always required',
    );
    expect(hubAndPropertyRaw).not.toContain(
      'several months away from home is itself a divorce ground',
    );
    expect(hubAndPropertyRaw).not.toContain(
      'Korean living costs alone determine child support',
    );
    expect(hubAndPropertyRaw).not.toContain(
      'Do not state or imply that the 1980 Hague Child Abduction Convention automatically governs Taiwan.',
    );
    expect(raw).toContain(
      'The 1980 Hague Child Abduction Convention does not automatically govern Taiwan.',
    );
    expect(raw).toContain(
      'There is no automatic right to immediate physical handover, use of force, a change of parental rights and duties, or punishment of the other parent merely because contact was blocked.',
    );
  });

  it('uses the current Article 1030-1 fairness standard and never the manifestly-unfair wording outside the constitutional holding', () => {
    expect(propertyRaw).not.toMatch(/manifestly/i);
    expect(propertyPost?.content).not.toMatch(/manifestly/i);
    expect(raw).not.toContain('manifestly unfair');
    // The only "manifestly" in the hub is the Constitutional Court holding on the Article 1052 proviso.
    for (const occurrence of raw.matchAll(/manifestly[^.;]*/g)) {
      expect(occurrence[0]).toContain('manifestly harsh result');
    }
    expect(raw).not.toMatch(/Article 1030-1[^.]*manifestly/);
  });

  it('contains no invisible characters, cross-locale routes, or visible script leakage in the hub and column 275', () => {
    for (const [name, text, content] of [
      ['007', raw, parsed.content],
      ['275', propertyRaw, propertyParsed.content],
    ] as const) {
      expect(text, name).not.toContain('﻿');
      expect(text, name).not.toContain(' ');
      expect(text, name).not.toContain('​');
      expect(text, name).not.toMatch(/\]\(\/(?:ko|zh-hant|ja)(?:\/|\))/);
      expect(content, name).not.toMatch(/[぀-ヿ]/);
      expect(content, name).not.toMatch(/[가-힯]/);
      expect(content, name).not.toMatch(
        /(?:reply promptly|お気軽にコメント|대만 이혼|台灣離婚程序)/,
      );
    }
    // Visible CJK is limited to the contracted author characters and the statutory term 不治之惡疾.
    const hubCjk = parsed.content
      .replace(author, '')
      .replace('(不治之惡疾)', '');
    expect(hubCjk).not.toMatch(/[一-鿿]/);
    expect(parsed.content).toContain('曾雋崴');
    expect(parsed.content).toContain('不治之惡疾');
    const propertyCjk = propertyParsed.content.replace(author, '');
    expect(propertyCjk).not.toMatch(/[一-鿿]/);
    expect(propertyParsed.content).toContain('曾雋崴');
  });

  it('retains title, FAQ, source URL, and complete body through loader and parse', () => {
    expect(post?.title).toBe(title);
    expect(post?.faq).toEqual(faq);
    expect(raw).toContain(sourceUrl);
    expect(post?.content).toContain(`## ${headings[0]}`);
    expect(post?.content).toContain(`## ${headings[11]}`);
    expect(post?.faq?.map((item) => item.a)).toContain(faq1Answer);
    expect(post?.faq?.map((item) => item.a)).toContain(faq4Answer);
    expect(post?.content).toContain(disclaimer);
    expect(post?.content).toContain(author);
    for (const link of officialLinks) {
      expect(post?.content).toContain(link);
    }
    for (const link of internalLinks) {
      expect(post?.content).toContain(link);
    }
    for (const link of inlineColumnLinks) {
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
    expect(html).toContain(headings[11]);
    expect(html).toContain('Article 1050 separates three requirements:');
    expect(html).toContain('Taiwan Civil Code');
    expect(
      html.includes(civilCodeUrl) || html.includes(civilCodeUrlEscaped),
    ).toBe(true);
    expect(html).toContain(propertyHref);
    expect(html).toContain('/en/contact');
    expect(html).toContain('Contact Us');
  });
});

describe('English family column 275 — property, damages and support moved out of column 007', () => {
  const propertyTitle =
    'House Title, Residual-Property Distribution, Damages, and Post-Divorce Support in a Taiwan Divorce';
  const propertyImage =
    '../images/275-taiwan-divorce-property-damages-support/featured-01.webp';
  const propertyImageAlt =
    'A single house key on a ring beside two separate stacks of blank papers on a wooden table.';
  const propertyBodyImage = `![${propertyImageAlt}](${propertyImage})`;
  const propertyInlineLinks = [
    '[Taiwan marital property division with an American spouse](/en/columns/taiwan-marital-property-division-us-assets)',
    `[${title}](${hubHref})`,
  ];
  const article1017SubsectionHeading =
    '### Article 1017 classifications and presumptions';
  const article10301SubsectionHeading =
    '### Article 1030-1 residual-property distribution';
  const unmarriedSubsectionHeading = '### Unmarried cohabitation and third parties';
  const article1017Paragraph =
    'Civil Code Article 1017 distinguishes premarital property from property acquired during marriage and provides that property that cannot be proved to be premarital or acquired during marriage is presumed to have been acquired during marriage, and that property that cannot be proved to belong to the husband or the wife is presumed to be jointly owned by the spouses. This is a starting point for classification and proof in calculating the matrimonial property regime; it is not a shortcut for determining ownership irrespective of registration or defeating the other spouse’s separate claims. Transfer records, sale and purchase agreements, loan agreements and repayment records, receipts, messages between the parties, tax records, registration records, and the basis and timing of acquisition must be considered together to reveal the parties’ actual legal relationship.';
  const article10301CalculationParagraph =
    'Under Article 1030-1, when the statutory matrimonial-property regime ends, the statutory calculation generally looks to each spouse’s net residual property composed of qualifying property acquired during marriage, after the statutory exclusions and relevant debts, then distributes the difference between those net residual amounts. The difference is generally divided equally. Inherited property and other property acquired gratuitously, as well as solatium (consolation damages), are excluded from the statutory calculation. Relevant debts and the statutory rules governing dispositions made before termination of the matrimonial property regime must also be considered. Residual-property distribution is not a crude half-and-half split of every asset acquired during marriage, and it is not the same concept as common property under a different marital regime.';
  const article10301AdjustmentParagraph =
    'Where one spouse made no contribution or cooperation toward the marital life, or there are other circumstances, and as a result equal division would be unfair, the court may adjust or waive the amount distributed. In making that decision the court must consider, among other factors, the spouses’ household labor, care and upbringing of the children, overall contribution and cooperation toward the family, the length of their shared life and of any separation, when property was acquired after marriage, and each spouse’s economic capacity.';
  const article10301FaultParagraph =
    'Neither extramarital sexual relations nor responsibility for the breakdown of the marriage automatically bars or reduces a claim for distribution of the residual-property difference. Nor should it be assumed that the calculation under Article 1030-1 changes merely because the spouses have different nationalities. Which country’s law governs the property, and how US accounts and a 401(k) fit in, are covered in [Taiwan marital property division with an American spouse](/en/columns/taiwan-marital-property-division-us-assets).';
  const article10301PeriodParagraph =
    'The claim is extinguished if it is not exercised within two years from the date on which the claimant learned that there was a residual-property difference and, in any event, within five years from termination of the statutory matrimonial-property regime. These two periods apply only to the Article 1030-1 claim; they must not be used as the periods for ownership, loan, damages, post-divorce spousal support, or child-support claims. The actual triggering date and the date on which the statutory regime terminated must be determined from the evidence in each case.';
  const article1056Paragraph =
    'Article 1056 provides, in cases of judicial divorce, for claims against the other spouse responsible for the divorce, distinguishing pecuniary damages from non-pecuniary damages that are available only when separate statutory conditions are met (paragraph 2 proviso: the claimant must be without fault). The conduct giving rise to liability, the resulting harm, causation, and the separate requirements for non-pecuniary damages must each be supported by evidence. The mere existence of facts concerning the breakdown of the marriage neither fixes a particular amount nor substitutes for a separate property claim.';
  const article1057Paragraph =
    'Article 1057 concerns post-divorce support when a spouse without fault falls into financial hardship because of a judicial divorce. The analysis must first confirm that the divorce was judicial rather than by mutual consent, that the claimant was without fault, and that the divorce actually caused the financial hardship. The scope of support must then be assessed from concrete evidence, including the claimant’s needs and financial resources. It is not residual-property distribution, child support, or a fixed penalty attached to every finding of fault. Article 1116-2 continues parents’ duty to support a minor child after divorce. Child support is distinct from Article 1057 spousal support. The amount of any support or damages award depends on the specific statutory right and the evidence. Government average consumption statistics are not a binding formula that automatically sets Article 1057 support.';

  it('publishes the exact complete frontmatter, the moved FAQ pair and the loaded identity', () => {
    expect(propertyParsed.data).toEqual({
      title: propertyTitle,
      seoTitle: 'Taiwan Divorce: Property, Damages, Support',
      summary:
        'House title, residual-property distribution, damages, and post-divorce support are separate claims with different elements, calculations, and time limits.',
      published: '2026-10-06',
      lastmod: '2026-10-06',
      date_display: 'October 6, 2026',
      read_time: '5 min read',
      categories: ['Taiwan Legal Information'],
      topic: 'family',
      featured_image: propertyImage,
      featured_image_alt: propertyImageAlt,
      featured_image_caption:
        'AI-generated fictional scene; it does not depict a real company, facility or person.',
      faq: propertyFaq,
      audience: ['en'],
    });
    expect(propertyPost).toMatchObject({
      slug: propertySlug,
      title: propertyTitle,
      readTime: '5 min read',
      category: 'legal',
      faq: propertyFaq,
      featuredImage:
        '/images/blog/275-taiwan-divorce-property-damages-support/featured-01.webp',
    });
    expect(
      fs.existsSync(
        path.join(
          process.cwd(),
          'public/images/blog/275-taiwan-divorce-property-damages-support/featured-01.webp',
        ),
      ),
    ).toBe(true);
  });

  it('keeps the read time within one minute of the visible word count at about 230 words per minute', () => {
    const visibleWordCount = countVisibleEnglishWords(propertyParsed.content);
    const minutes = Number(
      String(propertyParsed.data.read_time).match(/^(\d+) min read$/)?.[1],
    );

    expect(visibleWordCount).toBeGreaterThanOrEqual(1_000);
    expect(Math.abs(minutes - visibleWordCount / 230)).toBeLessThanOrEqual(1);
    expect(propertyPost?.readTime).toBe(propertyParsed.data.read_time);
  });

  it('uses the sole exact H1 followed immediately by the sole contracted image and the four contracted H2 sections', () => {
    expect(
      Array.from(
        propertyParsed.content.matchAll(/^# (.+)$/gm),
        (match) => match[1],
      ),
    ).toEqual([propertyTitle]);
    expect(propertyParsed.content).toMatch(
      new RegExp(
        `^\\n# ${propertyTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n${propertyBodyImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n`,
      ),
    );
    expect(
      Array.from(
        propertyParsed.content.matchAll(/!\[[^\]]*\]\([^)]+\)/g),
        (match) => match[0],
      ),
    ).toEqual([propertyBodyImage]);
    expect(propertyPost?.content).not.toMatch(/!\[[^\]]*\]\([^)]+\)/);
    expect(
      Array.from(
        propertyParsed.content.matchAll(/^## (.+)$/gm),
        (match) => match[1],
      ),
    ).toEqual(propertyHeadings);
  });

  it('separates the three house inquiries and keeps premarital funds and registration as evidence only', () => {
    const section = sectionBody(propertyParsed.content, propertyHeadings[0]);
    const requiredPhrases = [
      'Separate at least three inquiries for a house or other asset:',
      '1. Who owns the specific asset as a matter of title, beneficial ownership, or another ownership theory;',
      '2. Whether a gift, nominee-registration, loan, trust, unjust-enrichment, reimbursement, or related claim can be established from the parties’ real agreement and evidence; and',
      '3. Whether the asset or its value enters residual matrimonial-property calculation under Article 1030-1 when the statutory regime ends.',
      'A down payment or loan installment paid from premarital savings is relevant source-of-funds evidence. It does not by itself transfer registered title or dictate every later claim. Registration in one spouse’s name is important evidence of formal title, but it does not by itself resolve every contractual, beneficial, reimbursement, or matrimonial-property issue.',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
      expect(propertyPost?.content).toContain(phrase);
    }
  });

  it('publishes the exact Article 1017 classification paragraph with both statutory presumptions', () => {
    expect(
      firstParagraphAfter(propertyParsed.content, article1017SubsectionHeading),
    ).toBe(article1017Paragraph);
    expect(countOccurrences(propertyParsed.content, article1017Paragraph)).toBe(
      1,
    );
    expect(article1017Paragraph).toContain(
      'property that cannot be proved to be premarital or acquired during marriage is presumed to have been acquired during marriage',
    );
    expect(article1017Paragraph).toContain(
      'property that cannot be proved to belong to the husband or the wife is presumed to be jointly owned by the spouses',
    );
    expect(propertyRaw).not.toContain(
      'property whose time of acquisition is difficult to prove',
    );
  });

  it('publishes the exact Article 1030-1 calculation, adjustment, fault, and claim-period paragraphs with the current fairness test', () => {
    expect(
      paragraphsAfter(propertyParsed.content, article10301SubsectionHeading).slice(
        0,
        4,
      ),
    ).toEqual([
      article10301CalculationParagraph,
      article10301AdjustmentParagraph,
      article10301FaultParagraph,
      article10301PeriodParagraph,
    ]);
    expect(article10301AdjustmentParagraph).toContain(
      'and as a result equal division would be unfair, the court may adjust or waive the amount distributed',
    );
    expect(article10301AdjustmentParagraph).toContain(
      'the spouses’ household labor, care and upbringing of the children, overall contribution and cooperation toward the family, the length of their shared life and of any separation, when property was acquired after marriage, and each spouse’s economic capacity',
    );
    expect(propertyRaw).not.toContain('manifestly unfair');
    expect(propertyRaw).not.toContain('Where equal division of the residual difference');
    expect(propertyRaw).not.toContain('concealment or disposition of property');
    expect(propertyPost?.content).toContain(article10301PeriodParagraph);
    expect(propertyRaw).toContain(
      'a two-year period from knowledge of the residual-property difference and a five-year period from termination of the statutory matrimonial-property regime',
    );
  });

  it('separates Articles 1056 and 1057, child support, property, cohabitation, and third-party claims', () => {
    const section = sectionBody(propertyParsed.content, propertyHeadings[1]);
    const paragraphs = paragraphsAfter(
      propertyParsed.content,
      `## ${propertyHeadings[1]}`,
    );
    const requiredPhrases = [
      article1056Paragraph,
      article1057Paragraph,
      'Article 1116-2 continues parents’ duty to support a minor child after divorce.',
      'Child support is distinct from Article 1057 spousal support.',
      'An unmarried couple does not obtain divorce rights, Article 1056 divorce damages, or Article 1057 post-divorce support merely because they lived together. Actual co-ownership, loans, contracts, nominee registration, trusts, unjust enrichment, or torts may still raise separate claims on their own legal bases.',
      'An in-law or another relative of a spouse is not an obligor for post-divorce spousal support under Article 1057.',
      'Serious interference or insults by a third party do not automatically give rise to damages.',
      'A claim against a third party requires a separate legal basis in tort or property law and evidence of the applicable elements, such as an unlawful act, intent or negligence, damage, and causation.',
    ];

    expect(paragraphs.slice(0, 3)).toEqual([
      article1056Paragraph,
      article1057Paragraph,
      unmarriedSubsectionHeading,
    ]);
    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
      expect(propertyPost?.content).toContain(phrase);
    }
    expect(propertyRaw).not.toContain('Do not treat');
    expect(propertyRaw).not.toContain('Do not promise');
  });

  it('links back to the hub, links to its inline sources, keeps its two official links, and ends with the exact disclaimer and author', () => {
    const markdownLinks = Array.from(
      propertyParsed.content.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g),
      (match) => match[0],
    );

    expect(markdownLinks).toEqual([
      ...propertyInlineLinks,
      officialLinks[0],
      officialLinks[1],
      internalLinks[0],
      internalLinks[2],
    ]);
    expect(propertyInlineLinks[1]).toContain(`](${hubHref})`);
    expect(countOccurrences(propertyRaw, `](${hubHref})`)).toBe(1);
    expect(getColumnPost(canonicalSlug, 'en')).toBeDefined();
    for (const link of propertyInlineLinks) {
      const linkedSlug = link.match(/\(\/en\/columns\/([^)]+)\)$/)?.[1] ?? '';
      expect(getColumnPost(linkedSlug, 'en'), link).toBeDefined();
    }
    expect(propertyRaw.trimEnd().endsWith(`- ${internalLinks[2]}

${propertyDisclaimer}

${author}`)).toBe(true);
    expect(countOccurrences(propertyRaw, propertyDisclaimer)).toBe(1);
    expect(countOccurrences(propertyRaw, author)).toBe(1);
  });
});
