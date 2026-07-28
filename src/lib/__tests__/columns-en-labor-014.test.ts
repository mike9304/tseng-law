import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-en/014-taiwan-mandatory-employment-period.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const canonicalSlug = 'taiwan-mandatory-employment-period';
const post = getColumnPost(canonicalSlug, 'en');
const aliasPost = getColumnPost('mandatory-employment', 'en');

const title =
  'Taiwan Minimum Service Period Clauses: Validity, Training Costs, and Repayment';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-mandatory-employment-period';
const featuredImage =
  '../images/014-taiwan-mandatory-employment-period/featured-01.jpg';
const bodyImage = `![Workers carrying baskets across a salt field at sunset](${featuredImage})`;
const faq1Answer =
  "No. Under Article 15-1 of Taiwan's Labor Standards Act, a clause may satisfy the statutory threshold if the employer either provides professional skills training at its own expense or provides reasonable compensation for the worker's commitment to the minimum service period. The two grounds are alternatives, not cumulative requirements. Even if one exists, the period and burden must remain within a reasonable scope under the four statutory factors.";
const faq2Answer =
  "No. The Ministry of Labor's June 5, 2026 letter states that routine education, ordinary on-the-job training, new-hire familiarization, and training the employer is legally required to provide cannot support a minimum service period clause or a claim for a penalty or reimbursement. The course title is not decisive; its content, professional or technical character, duration, actual cost borne by the employer, and supporting records must be examined.";
const faq3Answer =
  "No. If a signing bonus, retention bonus, or other prepaid benefit serves as the reasonable compensation supporting the clause, the employer must clearly disclose that purpose. Under the Ministry of Labor's June 5, 2026 letter, repayment after departure before the period ends must be calculated in proportion to the unserved portion, rather than as automatic full repayment. The payment's purpose, terms, service already completed, and reason employment ended still require individual review.";
const faq4Answer =
  "Under Article 15-1, paragraph 4, if the employment contract ends before the minimum service period for a reason not attributable to the worker, the worker is not responsible for breaching the minimum service period agreement or reimbursing training expenses. The actual reason for termination and attribution must be determined from the governing legal ground, the notices, the parties' communications, changes in working conditions, and other evidence.";
const faq = [
  {
    q: 'Is a minimum-service-period clause in Taiwan automatically void?',
    a: faq1Answer,
  },
  {
    q: 'Does ordinary onboarding or legally required training support a minimum-service-period clause?',
    a: faq2Answer,
  },
  {
    q: 'Can an employer demand full repayment of a signing or retention bonus?',
    a: faq3Answer,
  },
  {
    q: 'What if employment ends early for a reason not attributable to the worker?',
    a: faq4Answer,
  },
];
const headings = [
  '1. Short Answer: When Can a Minimum-Service-Period Clause Be Enforceable?',
  '2. First Statutory Basis: Employer-Funded Professional Skills Training',
  '3. Second Statutory Basis: Reasonable Compensation',
  '4. Reasonable Scope and the Four Statutory Factors',
  '5. Training That Cannot Support the Clause',
  '6. Bonuses, Repayment, and Early Departure',
  '7. When Employment Ends for a Reason Not Attributable to the Worker',
  '8. Resignation Notice Is a Separate Question',
  '9. Employer and Worker Review Checklists',
  '10. Official Sources',
  '11. Related Guidance',
];
const officialLinks = [
  '[Taiwan Labor Standards Act, Article 15-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=15-1&pcode=N0030001)',
  '[Taiwan Labor Standards Act, Article 15](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=15&pcode=N0030001)',
  '[Taiwan Labor Standards Act, Article 16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=16&pcode=N0030001)',
  '[Taiwan Ministry of Labor Letter No. 勞動關2字第1150141814號 (June 5, 2026)](https://laws.mol.gov.tw/FLAW/FLAWDOC03.aspx?cnt=926&datatype=etype&edate=99991231&lnabndn=1&now=1&recordno=10&sdate=20180000)',
];
const officialUrls = officialLinks.map(
  (link) => link.match(/\((https?:\/\/[^)]+)\)$/)?.[1] ?? '',
);
const internalLinks = [
  '[Taiwan Labor and Employment Law Services](/en/services/labor)',
  '[Voluntary Resignation and Severance Pay Exceptions](/en/columns/taiwan-voluntary-resignation-severance)',
  '[Contact Us](/en/contact)',
];
const internalTargets = [
  '/en/services/labor',
  '/en/columns/taiwan-voluntary-resignation-severance',
  '/en/contact',
];
const disclaimer =
  'This article is provided for general legal information and educational purposes only. It explains Taiwan minimum service period clauses, the repayment of training costs and prepaid benefits, and resignation notice requirements; it is not legal advice for any particular employment matter. Enforceability and liability may vary with the contract type and wording, the training actually provided and its documented cost, the purpose and disclosure of any compensation, the period already served, the reason employment ended, and the available evidence. Before resigning, making a wage deduction, signing a repayment agreement, or responding to a dispute, check the latest official sources and obtain advice based on the specific facts.';
const author = '**Wei Tseng (曾雋崴), Taiwan Attorney**';
const exactEnding = `- ${internalLinks[2]}

---

${disclaimer}

${author}`;

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

function extractPublicText(content: string) {
  return content
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
}

describe('English labor column 014 — minimum-service-period clauses', () => {
  it('publishes the exact complete frontmatter and four ordered FAQs', () => {
    expect(parsed.data).toEqual({
      title,
      url: sourceUrl,
      lastmod: '2026-07-25',
      date_display: 'September 13, 2025',
      read_time: '12 min read',
      categories: ['Taiwan Legal Information'],
      featured_image: featuredImage,
      faq,
    });
    expect(parsed.data.faq).toHaveLength(4);
    expect(parsed.data.url).toBe(sourceUrl);
  });

  it('uses exactly one H1 matching the canonical title', () => {
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
  });

  it('opens the body with the exact H1, blank lines, and contracted image', () => {
    expect(parsed.content.startsWith(`\n# ${title}\n\n${bodyImage}\n\n`)).toBe(
      true,
    );
  });

  it('uses only the contracted body image and preserves renderer image removal', () => {
    const bodyImages = Array.from(
      parsed.content.matchAll(/!\[[^\]]*\]\([^)]+\)/g),
      (match) => match[0],
    );

    expect(bodyImages).toEqual([bodyImage]);
    expect(raw.split(featuredImage)).toHaveLength(3);
    expect(raw).not.toContain('img-01.jpg');
    expect(post?.featuredImage).toBe(
      '/images/blog/014-taiwan-mandatory-employment-period/featured-01.jpg',
    );
    expect(post?.content).not.toMatch(/!\[[^\]]*\]\([^)]+\)/);
  });

  it('uses exactly the eleven contracted H2s and two ordered checklist H3s', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(headings);
    expect(
      Array.from(parsed.content.matchAll(/^### (.+)$/gm), (match) => match[1]),
    ).toEqual(['Employer Checklist', 'Worker Checklist']);
  });

  it('repeats each FAQ answer twice and as its assigned H2 first paragraph', () => {
    const assignments = [
      [`## ${headings[0]}`, faq1Answer],
      [`## ${headings[4]}`, faq2Answer],
      [`## ${headings[5]}`, faq3Answer],
      [`## ${headings[6]}`, faq4Answer],
    ];

    for (const [heading, answer] of assignments) {
      expect(firstParagraphAfter(parsed.content, heading)).toBe(answer);
      expect(firstParagraphAfter(post?.content ?? '', heading)).toBe(answer);
      expect(raw.split(answer)).toHaveLength(3);
    }
  });

  it('locks the introduction and its four review questions in order', () => {
    const introduction = parsed.content.slice(
      parsed.content.indexOf(bodyImage) + bodyImage.length,
      parsed.content.indexOf(`## ${headings[0]}`),
    );
    const orderedQuestions = [
      '1. Does the clause have a statutory basis under Article 15-1?',
      "2. Are the service period and the worker's burden within a reasonable scope?",
      '3. Is the reason employment ended attributable to the worker?',
      '4. What notice and repayment rules apply?',
    ];
    let previousIndex = -1;

    expect(introduction).toContain(
      'A minimum-service-period clause can raise distinct questions about reimbursement of training expenses, repayment of a signing bonus, retention bonus, or other prepaid benefit, payment of a contractual penalty, resignation notice, and any separately alleged loss. Signing the contract does not itself establish enforceability or the amount owed.',
    );
    for (const question of orderedQuestions) {
      const index = introduction.indexOf(question);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
  });

  it('separates the alternative threshold bases, scope review, and voidness rule', () => {
    const section = sectionBody(parsed.content, headings[0]);
    const requiredPhrases = [
      'Article 15-1 paragraph 1 supplies two alternative threshold bases:',
      '1. The employer provides professional skills training and bears its cost.',
      "2. The employer provides reasonable compensation for the worker's commitment to the minimum service period.",
      'Article 15-1 provides two alternative statutory bases and then requires a separate reasonableness review. It does not require professional skills training and reasonable compensation in every case, and merely naming either one in the contract does not make the clause enforceable.',
      'Paragraph 2 separately asks whether the agreed period and burden remain within a reasonable scope under four statutory factors. It is not a third threshold basis.',
      "Under paragraph 3, an agreement that fails paragraph 1's threshold or paragraph 2's reasonable-scope review is void.",
      'A signature does not replace this analysis, but length alone does not decide it either.',
      'without converting a fact-specific review into an occupation-wide result',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks every professional-skills-training proof item and qualification', () => {
    const section = sectionBody(parsed.content, headings[1]);
    const requiredPhrases = [
      'The employer must actually provide professional skills training to the worker and bear the relevant cost.',
      'the training subject, skill objective, and professional or technical character',
      'dates, duration, attendance, completion, testing, and certification records',
      'curriculum, materials, instructors, and equipment',
      'invoices, receipts, payment records, refunds, subsidies, and who ultimately bore the cost',
      'the calculation and worker-specific allocation of any claimed internal cost',
      'how the course differs from ordinary supervision, onboarding, familiarization, and handover',
      "the relationship between the documented investment, the worker's benefit, and the proposed service period",
      'A professional-sounding name, estimated lump sum, high price, external provider, certificate, or long duration is not proof by itself.',
      'Internally delivered instruction is not automatically excluded.',
      'separated by content, time, legal necessity, participation, and cost',
    ];

    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it('locks reasonable-compensation purpose, disclosure, timing, vesting, and formula', () => {
    const section = sectionBody(parsed.content, headings[2]);
    const requiredPhrases = [
      "the payment must have a clear relationship to the worker's service commitment that is supported by evidence",
      'actual purpose, amount, payment date, vesting, disclosure, connection to the service period, terms applicable if employment ends early, and repayment formula',
      'A label such as "signing bonus," "retention bonus," or "prepaid benefit" does not by itself establish reasonable compensation; review the payment\'s actual purpose, amount, timing, vesting, disclosure, and connection to the service commitment.',
      "Under the Ministry of Labor's June 5, 2026 administrative guidance",
      'must clearly disclose that role',
      'An unexplained payment should not be reclassified after a dispute begins.',
      'Do not assume that a payment can never qualify merely because it is described as wages, overtime pay, an allowance, a travel expense, or a bonus.',
      'no bonus amount validates any service period or repayment burden',
    ];

    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it('locks all four statutory scope factors and individualized proportionality', () => {
    const section = sectionBody(parsed.content, headings[3]);
    const orderedFactors = [
      '1. The duration and cost of the professional skills training provided by the employer',
      '2. The possibility of replacing the worker with someone in the same or a similar role',
      '3. The amount and scope of the compensation provided by the employer',
      '4. Other circumstances affecting the reasonableness of the minimum service period',
    ];
    let previousIndex = -1;

    for (const factor of orderedFactors) {
      const index = section.indexOf(factor);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    for (const phrase of [
      'cost must be documented, attributable to the worker, and net of refunds or subsidies',
      'Replaceability requires evidence about the same or a similar role, actual skill requirements, staffing process, availability, and replacement time rather than a bare claim of hiring difficulty.',
      'Compensation evidence must identify its amount, timing, vesting, scope, and treatment of service already completed.',
      'The fourth factor may include how the agreement was made, the nature of the work, what the parties were told, the time already served, and the reason employment ended. These are examples, not a closed list, and the weight of each factor depends on the evidence in the individual case.',
      "The service period, documented investment, replaceability, worker's benefit, completed service, and remaining burden must remain proportionate.",
      'A qualifying threshold basis does not validate any length or repayment amount',
      'another occupation or arising in another case does not determine the outcome here',
    ]) {
      expect(section).toContain(phrase);
    }
  });

  it('locks all four excluded training categories and mixed-program separation', () => {
    const section = sectionBody(parsed.content, headings[4]);
    const requiredPhrases = [
      'Ministry of Labor Letter No. 勞動關2字第1150141814號 provides administrative guidance',
      'routine education, ordinary on-the-job training, new-hire familiarization with the workplace or procedures, and training that the employer is legally required to provide',
      'cannot support a minimum-service-period clause or a claim for a penalty or reimbursement',
      "examine each component's curriculum, time, legal basis, participation, and cost",
      'Do not classify the entire program by its title, the fact that its components were delivered together, or the fact that it was conducted in-house.',
      'prevents routine recruitment, management, and handover expenses from being included in a demand for reimbursement of training expenses',
    ];

    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it('locks prepaid-benefit disclosure, proportional repayment, and separate claims', () => {
    const section = sectionBody(parsed.content, headings[5]);
    const requiredPhrases = [
      'which payment supports the commitment, the agreed start and end dates, the payment and vesting dates, and the formula that applies if employment ends early',
      'actual last day worked, time served, unserved time, and repayment base',
      "Under the Ministry's administrative guidance, repayment of a prepaid benefit after early departure must reflect the unserved portion.",
      'A formula cannot disregard service already completed by automatically demanding the full payment',
      'The repayment analysis should proceed in this order: enforceability of the clause, the legal character of the payment, time already served, the reason employment ended, and the repayment formula. The word "penalty" in a contract does not by itself establish the amount owed.',
      'Reimbursement of documented professional skills training expenses, repayment of a prepaid benefit, payment of a fixed contractual penalty, a claim for other loss or damages, and a wage deduction are separate issues with distinct legal and contractual bases.',
      'Check for double counting across invoices, payment records, the demand, and the calculation.',
      'A demand or deduction record proves only that an amount was claimed or withheld, not that it was owed.',
    ];

    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it('locks paragraph 4 protection and evidence-based attribution without a closed list', () => {
    const section = sectionBody(parsed.content, headings[6]);
    const requiredPhrases = [
      faq4Answer,
      'The fact that employment ended early does not, by itself, establish that the worker breached the agreement.',
      'who communicated what, when any notice was delivered, the stated and actual grounds for ending employment, changes in working conditions, attendance and work records, and any later agreement or explanation',
      'dismissal notices, resignation communications, agreed-termination documents, email and message history, changes in duties or pay, and other evidence',
      'A document title alone does not decide attribution.',
      'Dismissal, agreed termination, and an alleged breach of working conditions are examples of matters to investigate, not a closed list of reasons not attributable to the worker.',
      'attribution comes before calculation',
      'Analyze any prepaid benefit or other claim separately based on its legal character and contractual basis rather than recharacterizing every payment as a training expense.',
    ];

    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it('separates resignation from liability and locks Articles 15 and 16 notice rules', () => {
    const section = sectionBody(parsed.content, headings[7]);
    const orderedRules = [
      'A minimum-service-period clause does not deprive a worker of the ability to resign.',
      'the effectiveness and timing of the resignation',
      'the enforceability of the minimum-service-period clause',
      'reimbursement of training expenses or repayment of a prepaid benefit',
      'any separately alleged loss',
      'For a worker terminating an indefinite-term contract, Article 15 applies the notice periods in Article 16 paragraph 1:',
      '1. At least 3 months but less than 1 year of continuous service: 10 days',
      '2. At least 1 year but less than 3 years of continuous service: 20 days',
      '3. At least 3 years of continuous service: 30 days',
      'Article 16 itself addresses termination by an employer.',
      "Those notice periods apply to a worker's resignation from an indefinite-term contract because Article 15 incorporates them by reference.",
      "For a specific fixed-term contract longer than three years, Article 15 separately allows the worker to terminate after completing three years by giving the employer 30 days' notice.",
    ];
    let previousIndex = -1;

    for (const rule of orderedRules) {
      const index = section.indexOf(rule);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    expect(section).toContain(
      'Do not mechanically assign one of these periods to service under three months, another fixed-term contract, or an alleged statutory ground for termination without notice.',
    );
    expect(section).toContain(
      'Review the contract type, legal ground, facts, delivery method, delivery date, and evidence.',
    );
  });

  it('locks both evidence checklists and every contracted issue separation', () => {
    const section = sectionBody(parsed.content, headings[8]);
    const employerItems = [
      '1. Identify whether the clause relies on employer-funded professional skills training, reasonable compensation, or both; use the basis actually provided.',
      '2. Preserve the signed contract, clause, amendments, explanations, and delivery records.',
      '3. Record curriculum, dates, duration, attendance, completion, invoices, receipts, payment records, and who ultimately bore each cost.',
      '4. Separate routine, onboarding, legally required, ordinary on-the-job, and professional skills training by content, time, legal basis, participation, and cost.',
      "5. For any signing bonus, retention bonus, or other prepaid benefit, document its purpose, advance disclosure, payment date, amount, vesting, connection to the service commitment, and proportional repayment formula.",
      '6. Document the individualized basis for the service period and evidence about replacing a worker in the same or a similar role; do not reuse a fixed period and amount.',
      '7. Establish service completed, the unserved portion, notices and delivery evidence, and the actual reason employment ended.',
      '8. Review payroll, communications, demand letters, and deduction records; separate enforceability, resignation notice, reimbursement, benefit repayment, penalty, damages, wage deduction, and other loss, and check for double counting. Neither a signature nor a demand decides the case.',
    ];
    const workerItems = [
      '1. Preserve the signed contract, clause, amendments, offer materials, explanations, and delivery records.',
      '2. Collect curriculum, dates, duration, attendance, completion, invoices, receipts, payment records, and evidence of who bore each cost.',
      "3. Classify each training component as routine, onboarding-related, legally required, ordinary on-the-job, or professional skills training, and compare those classifications with the employer's evidence.",
      "4. Preserve evidence of each prepaid benefit's purpose, disclosure, payment date, amount, vesting, connection to the service period, and repayment formula.",
      '5. Ask for the basis for the service period and evidence about replacement in the same or a similar role.',
      '6. Build a chronology of training and payments, service completed, the unserved portion, notices, delivery evidence, and the actual reason employment ended.',
      '7. Retain resignation, dismissal, or agreed-termination notices, payroll, communications, demand letters, and deduction records; check every figure and formula.',
      "8. Separate enforceability, resignation notice, attribution, training reimbursement, benefit repayment, penalty, damages, wage deduction, and other loss. Check the employer's evidence and arithmetic; neither a signature nor a demand decides the case.",
    ];
    let previousIndex = -1;

    for (const item of [...employerItems, ...workerItems]) {
      const index = section.indexOf(item);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
  });

  it('uses only the four official links and URLs in their contracted order', () => {
    const externalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((https?:\/\/[^)]+)\)/g),
      (match) => match[1],
    );
    const allExternalUrls =
      parsed.content.match(/https?:\/\/[^\s)]+/g) ?? [];
    const officialSection = sectionBody(parsed.content, headings[9]);

    expect(
      Array.from(
        officialSection.matchAll(/(?<!!)\[[^\]]+\]\([^)]+\)/g),
        (match) => match[0],
      ),
    ).toEqual(officialLinks);
    expect(externalTargets).toEqual(officialUrls);
    expect(allExternalUrls).toEqual(officialUrls);
    for (const url of officialUrls) {
      expect(parsed.content.split(url)).toHaveLength(2);
    }
    for (const link of officialLinks) expect(raw.split(link)).toHaveLength(2);
  });

  it('uses only the three exact English internal links in their contracted order', () => {
    const markdownInternalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[1],
    );
    const allLocalePaths =
      parsed.content.match(/\/(?:ko|zh-hant|en|ja)(?:\/[^\s)]*)?/g) ?? [];
    const relatedSection = sectionBody(parsed.content, headings[10]);

    expect(
      Array.from(
        relatedSection.matchAll(/(?<!!)\[[^\]]+\]\([^)]+\)/g),
        (match) => match[0],
      ),
    ).toEqual(internalLinks);
    expect(markdownInternalTargets).toEqual(internalTargets);
    expect(allLocalePaths).toEqual(internalTargets);
    for (const link of internalLinks) expect(raw.split(link)).toHaveLength(2);
  });

  it('locks the final related link, disclaimer, and canonical author at EOF', () => {
    expect(raw.trimEnd().slice(raw.lastIndexOf(`- ${internalLinks[2]}`))).toBe(
      exactEnding,
    );
    expect(parsed.content.trimEnd().endsWith(exactEnding)).toBe(true);
    expect(raw.trimEnd().endsWith(author)).toBe(true);
  });

  it('removes every forbidden legacy claim, figure, script, and locale leak', () => {
    const visibleText = extractPublicText(parsed.content);
    const forbiddenLiterals = [
      'Taiwan Mandatory Minimum Service Period Clauses',
      'almost always illegal',
      'almost always void',
      'The answer: it is almost always illegal.',
      'all three of the following requirements',
      'all three requirements must be met',
      'If even one of these is not met',
      'reasonable and necessary',
      'clearly illegal',
      'highly likely to be illegal',
      'do not worry too much',
      'representative lawful example',
      'airline pilot',
      'NT$5 million',
      'twenty-year',
      '20-year',
      'NT$183',
      'NT$27,470',
      '10,030 won',
      '2,096,270 won',
      'Ordinary overtime pay, travel expenses, and the like are not recognized.',
      'mandatory employment period',
      'mandatory service period',
      'the worker cannot resign',
      'the worker may not resign',
      'penalty repayment',
      'return money',
      'compensation money',
      'human-power replacement',
      'responsibility attribution',
      'binding precedent',
      'court decision',
      'new Article 15-1 rule',
      'contact us today',
      'leave a comment',
      'direct message',
      'our client',
      '/ko/',
      '/zh-hant/',
      '/ja/',
      '\uFEFF',
      '\u00A0',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(visibleText.toLowerCase()).not.toContain(forbidden.toLowerCase());
    }
    expect(visibleText).not.toMatch(/\bpilots?\b/i);
    expect(visibleText).not.toMatch(
      /all (?:wages|overtime|travel expenses|allowances|bonuses|internal courses)[^.]*can never qualify/i,
    );
    expect(visibleText).not.toMatch(
      /Ministry(?: of Labor)? letter[^.]*\b(?:statute|regulation|amendment|binding precedent|court decision)\b/i,
    );
    expect(visibleText).not.toMatch(
      /[\p{Script=Hangul}\p{Script=Hiragana}\p{Script=Katakana}]/u,
    );
    const hanStrings = Array.from(
      parsed.content.matchAll(
        /[\u3400-\u4dbf\u4e00-\u9fff][0-9\u3400-\u4dbf\u4e00-\u9fff]*/g,
      ),
      (match) => match[0],
    );
    expect(hanStrings).toEqual([
      '勞動關2字第1150141814號',
      '勞動關2字第1150141814號',
      '曾雋崴',
    ]);
  });

  it('freezes the exact visible word count and read time', () => {
    const publicText = extractPublicText(parsed.content);
    const visibleWordCount =
      publicText.match(/\b[A-Za-z]+(?:['’-][A-Za-z]+)*\b/g)?.length ?? 0;
    const calculatedMinutes = Math.ceil(visibleWordCount / 200);

    expect(visibleWordCount).toBeGreaterThanOrEqual(1_800);
    expect(visibleWordCount).toBe(2_351);
    expect(calculatedMinutes).toBe(12);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes} min read`);
    expect(post?.readTime).toBe(`${calculatedMinutes} min read`);
  });

  it('exposes source-matching metadata, FAQ, image, and renderer content', () => {
    expect(parsed.data.url).toBe(sourceUrl);
    expect(post).toMatchObject({
      slug: canonicalSlug,
      title,
      date: '2026-07-25',
      dateDisplay: 'September 13, 2025',
      readTime: '12 min read',
      category: 'legal',
      categoryLabel: 'Legal Information',
      featuredImage:
        '/images/blog/014-taiwan-mandatory-employment-period/featured-01.jpg',
      faq,
    });

    const expectedRendererContent = parsed.content
      .replace(/\(\.\.\/images\/([^)]+)\)/g, '(/images/blog/$1)')
      .trimStart()
      .replace(/^#\s+.+\n*/, '')
      .replace(/^\s*!\[[^\]]*\]\([^)]+\)\s*\n*/, '')
      .trim();
    expect(post?.content).toBe(expectedRendererContent);
    expect(post?.content).toContain(`## ${headings[0]}`);
    expect(post?.content).toContain(`## ${headings.at(-1)}`);
  });

  it('resolves the canonical and mandatory-employment aliases to one English post', () => {
    expect(post).toBeDefined();
    expect(aliasPost).toBeDefined();
    expect(aliasPost?.slug).toBe(canonicalSlug);
    expect(aliasPost).toEqual(post);
  });
});
