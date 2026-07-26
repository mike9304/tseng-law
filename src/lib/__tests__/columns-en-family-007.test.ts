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
const faq3Answer =
  'Civil Code Article 1052 paragraph 2 allows a petition where another serious cause makes continuation of the marriage difficult, but its proviso provides that if that cause is attributable to one spouse, only the other spouse may petition. That proviso remains in the current statutory text. Constitutional Court Judgment 112-Hsien-Pan-4 did not repeal it. The Court held the restriction is generally constitutional, yet unconstitutional to the extent that, without considering whether a serious cause arose or continued for a considerable period, it completely deprives the solely responsible spouse of any opportunity to divorce and is manifestly harsh. Outcome turns on the court’s application of that reasoning to the facts, not on an absolute bar or an automatic right to divorce.';
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
const filingDocumentsParagraph =
  'Who may apply, whether filing through an agent is permitted, and which proof of identity, household-registration records, written divorce instrument, and other documents must be prepared should be determined by reference to the Ministry of the Interior’s household-registration guidance for divorce registration in force at the time of filing and confirmed with the competent household-registration office. Depending on the type of document and where it was prepared, a document prepared outside Taiwan may require authentication by a Taiwan overseas mission or another competent authority. If the official guidance so requires, an authenticated or notarized Chinese translation must also be submitted. No single fixed checklist applies unchanged to every cross-border case.';
const filingDocumentsPrefixMarker =
  '3. **Household registration.** Registration with the household-registration authority is constitutive for this path. Without registration, the private writing does not complete a Taiwan mutual-consent divorce.';
const courtResultsSubsectionHeading =
  '### Court results and Household Registration Act Articles 48 and 48-2';
const courtResultsFirstParagraph =
  'When a Taiwan divorce judgment becomes final or court mediation or settlement ends the marriage, either party may, in principle, apply for divorce registration with the household-registration authority. Registration of the court result is governed by the Household Registration Act rather than Article 1050’s constitutive sequence for mutual-consent divorce.';
const frozenBeforeFilingDocumentsSha256 =
  '07e7dcdcbd12687fd57000836158cac2cf8c9ed2e20a50f5c47b46f18b325d74';
const frozenCourtResultsSubsectionSha256 =
  '57a46fe6c1e4aaa72b0690a97575ef79779125ecf483a7ecc4912bc1003a7559';
const frozenSection3OnwardSha256 =
  '4a5a9a946af97bc0d5836ec787f5a69405b865a942b41d2eb6207d1f432c1d84';
const frozenSection4OutsideArticle1052IntroSha256 =
  '8da1e5106649d305bd65795acaf2e17107673964de900c66f748c53bc8660219';
const frozenSection5OnwardSha256 =
  '62b854f3c28768bd9d2954970b4b2c4bdee1df78100330f314065bea845a0fe8';
const frozenSection1OnwardSha256 =
  '54139ed595523142e0aca225eb50f9a0b3fa2eb24074cf55e8e34ed49480f970';
const frozenVisibleWordCount = 4_994;
const frozenSourceSha256 =
  '612af0b0fbba84c149ea309234a0f808d299805d94f3f6324b709edb5be55293';

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
      read_time: '25 min read',
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
      readTime: '25 min read',
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
        phrase:
          'Transfer records, purchase contracts, loan files, receipts, messages, tax materials, and registration histories remain important, but no single document is conclusive for every theory.',
      },
      { number: 7, heading: headings[6], phrase: faq5Answer },
      {
        number: 8,
        heading: headings[7],
        phrase:
          'That is not a recommendation to “divorce first and resolve the child later” as a universal shortcut.',
      },
      {
        number: 9,
        heading: headings[1],
        phrase: filingDocumentsParagraph,
      },
      {
        number: 10,
        heading: headings[2],
        phrase:
          'Expected duration depends on the issues joined, service, evidence, interim applications, and court workload. No fixed timetable should be treated as a legal promise.',
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
        phrase:
          'Family matters covered by the Family Act ordinarily pass through court mediation before adjudication, subject to the Act and the posture of the case.',
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
        phrase:
          'Adultery or other marital fault does not automatically strip title, defeat every ownership claim, or rewrite the statutory residual-property calculation.',
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
      'Online filing is only a channel.',
      'Any online-channel period is not the general validity rule for the divorce itself',
      'missing an online window does not reverse an effective divorce established by final judgment or by court mediation or settlement.',
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

  it('locks Family Act Article 13 and the type-specific effects and review routes', () => {
    const section = sectionBody(parsed.content, headings[2]);
    const requiredPhrases = [
      faq2Answer,
      'Family matters covered by the Family Act ordinarily pass through court mediation before adjudication',
      'That ordinary sequence is not a claim that every matter follows one immutable process.',
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
      'Whether a foreign divorce or judgment is recognized or effective in Taiwan is not the same question as whether a Taiwan household-registration office can enter a particular status record.',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Article 1017 and Article 1030-1 classification, exclusions, adjustment, and claim-specific periods', () => {
    const section = sectionBody(parsed.content, headings[5]);
    const requiredPhrases = [
      faq4Answer,
      'Separate at least three inquiries for a house or other asset:',
      'Civil Code Article 1017 addresses premarital and postmarital property classification and statutory presumptions.',
      'They are not a shortcut that alone awards title, defeats a nominee or gift theory, or completes the residual-property calculation.',
      'net residual property composed of qualifying property acquired during marriage, after the statutory exclusions and relevant debts',
      'The difference is generally divided equally.',
      'Inherited property and other property acquired gratuitously, as well as solatium (consolation damages), are excluded as the statute provides.',
      'residual-property distribution is not a crude half-and-half split of every asset acquired during marriage',
      'Where equal division of the residual difference would be manifestly unfair, the court may adjust or waive distribution',
      'Adultery or other marital fault does not automatically strip title',
      'A foreign spouse is not subject to a different statutory residual-property formula merely because of nationality.',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('separates Articles 1056 and 1057, child support, property, cohabitation, and third-party claims', () => {
    const section = sectionBody(parsed.content, headings[6]);
    const requiredPhrases = [
      faq5Answer,
      '**Article 1056** concerns damages arising from judicial divorce',
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

  it('locks Articles 1055 and 1055-1, the full Taiwan concept, review, and unresolved issues', () => {
    const section = sectionBody(parsed.content, headings[7]);
    const requiredPhrases = [
      faq6Answer,
      'Taiwan law frames the issue as the **exercise and assumption of rights and duties regarding a minor child**',
      'The everyday word “custody” may be used only as a shorthand after that complete concept is understood.',
      'A signed divorce agreement does not freeze the child’s situation against later court review',
      'Articles 1055 and 1055-1 require a best-interests analysis based on the statutory factors and the actual evidence.',
      'continuity and safety',
      'care history',
      'each parent’s life circumstances, capacity, and willingness',
      'whether a parent facilitates the child’s relationship with the other parent',
      'the child’s views where appropriate',
      'Marital fault is not a prize or punishment that awards or removes parental responsibility.',
      'That is not a recommendation to “divorce first and resolve the child later” as a universal shortcut.',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
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
      '9. **Privacy-safe handling and urgent preservation.**',
    ];

    let previousIndex = -1;
    for (const item of checklistStarts) {
      const index = section.indexOf(item);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    expect(section).toContain(
      'Keep originals or certified copies and note how and when each instrument was served or became final.',
    );
    expect(section).toContain(
      'Documents from mainland China, Hong Kong, and Macao follow distinct verification tracks',
    );
    expect(section).toContain('acquisition-source evidence');
    expect(section).toContain(
      'Do not create evidence by unlawful means.',
    );
    expect(section).toContain(
      'limit unnecessary disclosure of a child’s private information',
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
    expect(calculatedMinutes).toBe(25);
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
