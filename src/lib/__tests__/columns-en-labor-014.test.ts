import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";
import { getColumnPost } from "@/lib/columns";

const columnPath = path.join(
  process.cwd(),
  "src/content/columns-en/014-taiwan-mandatory-employment-period.md",
);
const raw = fs.readFileSync(columnPath, "utf8");
const parsed = matter(raw);
const canonicalSlug = "taiwan-mandatory-employment-period";
const post = getColumnPost(canonicalSlug, "en");
const aliasPost = getColumnPost("mandatory-employment", "en");

const title =
  "Taiwan Minimum Service Period Clauses: Validity, Training Costs, and Contractual Penalties";
const sourceUrl =
  "https://www.wei-wei-lawyer.com/post/taiwan-mandatory-employment-period";
const featuredImage =
  "../images/014-taiwan-mandatory-employment-period/featured-01.jpg";
const bodyImage = `![An illustration explaining minimum service periods in employment contracts and the repayment of costs](${featuredImage})`;
const faq1Answer =
  "No. Under Article 15-1 of Taiwan's Labor Standards Act, a minimum-service-period clause may satisfy the statutory requirements if the employer either provides professional skills training and bears the cost or provides reasonable compensation in return for the worker's commitment to the minimum service period. Both requirements need not be met, but even where one is met, the clause must not exceed a reasonable scope in light of all the circumstances, including the duration and cost of the training, the possibility of replacing the worker, and the amount and scope of the compensation.";
const faq2Answer =
  "According to Taiwan's Ministry of Labor guidance dated June 5, 2026, the costs of routine education, ordinary on-the-job training, training that helps new hires adapt to their work, and training that employers are legally required to provide cannot serve as the basis for a minimum-service-period clause or a claim for a penalty or reimbursement. The name of the training is not decisive; its specific curriculum, professional or technical content, duration, the costs actually borne by the employer, and supporting evidence must be examined.";
const faq3Answer =
  "Not necessarily. If a signing bonus, retention bonus, or other prepaid benefit was provided as reasonable compensation for a minimum-service-period clause, that purpose must have been clearly disclosed to the worker. Taiwan's Ministry of Labor guidance dated June 5, 2026 explains that when a worker leaves before the period expires, repayment must be calculated in proportion to the unserved period and the employer must not demand full repayment. The actual outcome requires a review of the payment's purpose, the terms of the agreement, the period already served, and the reason employment ended.";
const faq4Answer =
  "Article 15-1, paragraph 4 of Taiwan's Labor Standards Act provides that when an employment contract ends before the minimum service period for a reason not attributable to the worker, the worker is not liable for breaching the minimum-service-period agreement or for reimbursing training costs. The reason employment ended and the attribution of responsibility must be determined from specific evidence, including dismissal notices, resignation communications, and records of alleged violations of working conditions.";
const faq = [
  {
    q: "Is a minimum-service-period clause in a Taiwan employment contract automatically void?",
    a: faq1Answer,
  },
  {
    q: "Does new-hire training or legally required training qualify as professional skills training?",
    a: faq2Answer,
  },
  {
    q: "Must a worker repay a signing bonus or retention bonus in full after leaving early?",
    a: faq3Answer,
  },
  {
    q: "Must a worker repay training costs if the contract ends early for a reason not attributable to the worker?",
    a: faq4Answer,
  },
];
const headings = [
  "1. When a Minimum-Service-Period Clause Can Be Enforceable",
  "2. First Statutory Basis: Employer-Funded Professional Skills Training",
  "3. Second Statutory Basis: Reasonable Compensation",
  "4. Reasonable Scope and the Four Statutory Factors",
  "5. Training That Cannot Support the Clause",
  "6. Bonuses, Repayment, and Early Departure",
  "7. When Employment Ends for a Reason Not Attributable to the Worker",
  "8. Resignation Notice Is a Separate Question",
  "9. Records Each Side Needs Beyond the Contract",
  "10. Official Sources",
  "11. Related Guidance",
];
const officialLinks = [
  "[Taiwan Labor Standards Act, Article 15-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=15-1&pcode=N0030001)",
  "[Taiwan Labor Standards Act, Article 15](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=15&pcode=N0030001)",
  "[Taiwan Labor Standards Act, Article 16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=16&pcode=N0030001)",
  "[Taiwan Ministry of Labor Letter No. 勞動關2字第1150141814號 (June 5, 2026)](https://laws.mol.gov.tw/FLAW/FLAWDOC03.aspx?datatype=etype&N2=1150141814&cnt=1&now=1&lnabndn=1&recordno=1)",
];
const officialUrls = officialLinks.map(
  (link) => link.match(/\((https?:\/\/[^)]+)\)$/)?.[1] ?? "",
);
const internalLinks = [
  "[Taiwan Labor and Employment Law Services](/en/services/labor)",
  "[Voluntary Resignation and Severance Pay Exceptions](/en/columns/taiwan-voluntary-resignation-severance)",
  "[Contact Us](/en/contact)",
];
const internalTargets = [
  "/en/services/labor",
  "/en/columns/taiwan-voluntary-resignation-severance",
  "/en/contact",
];
const disclaimer =
  "This article is educational material that explains, in general terms, minimum-service-period clauses in Taiwan, the repayment of training costs and prepaid benefits, and resignation notice. It is not legal advice on any individual employment matter. The enforceability of a clause and the scope of liability may vary depending on the contract type and wording, the training actually provided and its cost, the purpose and disclosure of compensation, the period served, the reason employment ended, and the available evidence. Before giving notice of resignation, making a wage deduction, entering into a repayment agreement, or responding to a dispute, consult the latest official sources and consider the specific circumstances.";
const author = "Wei Tseng (曾雋崴), Taiwan Attorney";
const exactEnding = `- ${internalLinks[2]}

---

${disclaimer}

${author}`;

function firstParagraphAfter(content: string, heading: string) {
  return content.split(`${heading}\n\n`)[1]?.split("\n\n")[0];
}

function sectionBody(content: string, heading: string) {
  const sectionStart = content.indexOf(`## ${heading}`);
  const nextSection = content.indexOf("\n## ", sectionStart + 1);
  return content.slice(
    sectionStart,
    nextSection === -1 ? content.length : nextSection,
  );
}

function extractPublicText(content: string) {
  return content
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/^---$/gm, "")
    .replace(/[“”‘’*_`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

describe("English labor column 014 — minimum-service-period clauses", () => {
  it("publishes the exact complete frontmatter and four ordered FAQs", () => {
    expect(parsed.data).toEqual({
      title,
      seoTitle: "Taiwan Minimum Service Period Clauses",
      url: sourceUrl,
      lastmod: "2026-10-12",
      date_display: "September 13, 2025",
      read_time: "19 min read",
      categories: ["Taiwan Legal Information"],
      featured_image: featuredImage,
      summary:
        'A Taiwan minimum service period clause is not automatically valid. It needs funded professional training or reasonable compensation, plus a statutory review.',
      faq,
    });
    expect(parsed.data.faq).toHaveLength(4);
    expect(parsed.data.url).toBe(sourceUrl);
  });

  it("uses exactly one H1 matching the canonical title", () => {
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
  });

  it("opens the body with the exact H1, blank lines, and contracted image", () => {
    expect(parsed.content.startsWith(`\n# ${title}\n\n${bodyImage}\n\n`)).toBe(
      true,
    );
  });

  it("uses only the contracted body image and preserves renderer image removal", () => {
    const bodyImages = Array.from(
      parsed.content.matchAll(/!\[[^\]]*\]\([^)]+\)/g),
      (match) => match[0],
    );

    expect(bodyImages).toEqual([bodyImage]);
    expect(raw.split(featuredImage)).toHaveLength(3);
    expect(raw).not.toContain("img-01.jpg");
    expect(post?.featuredImage).toBe(
      "/images/blog/014-taiwan-mandatory-employment-period/featured-01.jpg",
    );
    expect(post?.content).not.toMatch(/!\[[^\]]*\]\([^)]+\)/);
  });

  it("uses exactly the eleven contracted H2s and two ordered checklist H3s", () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(headings);
    expect(
      Array.from(parsed.content.matchAll(/^### (.+)$/gm), (match) => match[1]),
    ).toEqual(["The Employer's File", "The Worker's File"]);
  });

  it("carries each FAQ answer's legal facts in its assigned H2 first paragraph", () => {
    const assignments: [string, string, string[]][] = [
      [
        `## ${headings[0]}`,
        faq1Answer,
        [
          "Is a minimum-service-period clause automatically void? No.",
          "Article 15-1 of Taiwan's Labor Standards Act sets the test, and its paragraph 1 provides two alternative statutory grounds.",
          "The first is that the employer provides the worker with professional skills training and bears the cost.",
          "The second is that the employer provides reasonable compensation in return for the worker's commitment to the minimum service period.",
          "With either one, a clause may satisfy the statutory requirements. Both need not be met.",
        ],
      ],
      [
        `## ${headings[4]}`,
        faq2Answer,
        [
          "Under the Ministry of Labor's guidance dated June 5, 2026, some training costs cannot serve as the basis for a minimum-service-period clause or a claim for a penalty or reimbursement.",
          "routine education conducted regularly, ordinary on-the-job training, training that helps new hires adapt to their work and familiarizes them with the work environment and procedures, and training that employers are required by law to provide",
        ],
      ],
      [
        `## ${headings[5]}`,
        faq3Answer,
        [
          "Not necessarily.",
          "If a signing bonus, retention bonus, or other prepaid benefit was provided as reasonable compensation for a minimum-service-period clause, that purpose must have been clearly disclosed to the worker.",
          "the Ministry of Labor's June 5, 2026 guidance explains that repayment must be calculated in proportion to the unserved period. The employer must not demand full repayment.",
          "The actual outcome requires a review of the payment's purpose, the terms of the agreement, the period already served, and the reason employment ended.",
        ],
      ],
      [
        `## ${headings[6]}`,
        faq4Answer,
        [
          "Article 15-1, paragraph 4 of Taiwan's Labor Standards Act covers an employment contract that ends before the minimum service period for a reason not attributable to the worker.",
          "The worker is then not liable for breaching the minimum-service-period agreement or for reimbursing training costs.",
          "The reason employment ended and the attribution of responsibility must be determined from specific evidence, including dismissal notices, resignation communications, and records of alleged violations of working conditions.",
        ],
      ],
    ];

    for (const [heading, answer, phrases] of assignments) {
      const sourceFirst = firstParagraphAfter(parsed.content, heading);
      const renderedFirst = firstParagraphAfter(post?.content ?? "", heading);

      expect(sourceFirst).toBeDefined();
      expect(renderedFirst).toBe(sourceFirst);
      for (const phrase of phrases) expect(sourceFirst).toContain(phrase);
      expect(raw).toContain(answer);
    }
    expect(sectionBody(parsed.content, headings[4])).toContain(
      "What the training is called is not decisive. Its specific curriculum, professional or technical content, duration, the costs actually borne by the employer, and supporting evidence must be examined.",
    );
  });

  it("locks the introduction and its four review questions in order", () => {
    const introduction = parsed.content.slice(
      parsed.content.indexOf(bodyImage) + bodyImage.length,
      parsed.content.indexOf(`## ${headings[0]}`),
    );
    const orderedQuestions = [
      "1. Does the clause itself satisfy the statutory requirements of Article 15-1?",
      "2. Are the agreed period and the worker's burden within a reasonable scope?",
      "3. To whom is the reason for ending the employment contract attributable?",
      "4. How should the resignation notice and the scope of repayment be determined?",
    ];
    let previousIndex = -1;

    expect(introduction).toContain(
      "A signed minimum-service-period clause does not, by its existence alone, establish that it is enforceable. Nor does it establish the amount repayable. In a Taiwan employment contract, the clause sets out a worker's commitment to remain employed for a specified period. It also sets out whether the worker must repay training costs, a signing bonus, or a retention bonus after leaving early, and whether the employer may seek a separate contractual penalty. Whatever label the contract uses, the statutory requirements and the actual circumstances of the payment, training, and termination must be examined step by step.",
    );
    for (const question of orderedQuestions) {
      const index = introduction.indexOf(question);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    expect(introduction).toContain(
      "One contract may address all four, yet different statutory provisions and evidence apply to each. Each point should therefore be examined independently: the enforceability of the clause, when the notice of resignation takes effect, whether the worker must repay a prepaid benefit or training costs, and whether any separate loss actually occurred.",
    );
  });

  it("separates the alternative threshold bases, scope review, and voidness rule", () => {
    const section = sectionBody(parsed.content, headings[0]);
    const requiredPhrases = [
      "its paragraph 1 provides two alternative statutory grounds.",
      "The first is that the employer provides the worker with professional skills training and bears the cost",
      "The second is that the employer provides reasonable compensation in return for the worker's commitment to the minimum service period",
      "The question is which ground actually exists, not what name the contract gives it.",
      "With either one, a clause may satisfy the statutory requirements. Both need not be met.",
      "Merely writing a ground into the contract does not automatically make the entire clause enforceable.",
      "paragraph 2 requires a separate review of whether the agreed period and the scope of liability are reasonable",
      "Paragraph 3 states the consequence. A clause that violates the statutory requirements in paragraph 1 or the reasonableness standard in paragraph 2 is void.",
      "A worker's signature may help establish that an agreement exists. It cannot replace the statutory requirements.",
      "The investment or compensation actually provided, and the reason for selecting that period, must also be examined",
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it("locks every professional-skills-training proof item and qualification", () => {
    const section = sectionBody(parsed.content, headings[1]);
    const requiredPhrases = [
      "the employer must actually provide professional skills training to the worker and bear its cost",
      "The evidence must connect the subject of the training, the professional or technical skills required for the role, the specific duration, completion, and actual expenditure.",
      "outside instructor fees, tuition paid to a training provider, and charges for materials or equipment",
      "the basis for calculating any internal costs claimed by the employer",
      "how it differed from ordinary supervision or handover",
      "Estimated or uniformly allocated amounts alone do not prove the employer's actual expenditure.",
      "Course outlines, training schedules, attendance records, assessment results, completion certificates, invoices, and receipts",
      "The agreement between the employer and the training provider, payment vouchers, and refund terms",
      "If the worker paid part of the cost directly or a third party provided support, determine who ultimately bore each cost.",
      "Where the training occurred and who delivered it do not, by themselves, draw the line between ordinary workplace familiarization and professional skills training.",
      "Internal training should therefore not be excluded across the board",
      "How the service period relates to the investment in training must also be explained.",
      "Whether the worker actually performed the relevant work after training, and how long the worker had already served",
    ];

    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it("locks reasonable-compensation purpose, disclosure, timing, vesting, and formula", () => {
    const section = sectionBody(parsed.content, headings[2]);
    const requiredPhrases = [
      "Reasonable compensation for the service commitment is the second ground.",
      "It must have a purpose and structure distinct from ordinary wages or other compensation already due for work performed.",
      "Describing a payment on a pay statement as a signing bonus, retention bonus, or prepaid benefit does not by itself determine its legal character.",
      "Start with the payment's purpose.",
      "part of the ordinary wage terms offered for recruitment, consideration for a commitment to remain for a particular period, or compensation for achieving performance targets",
      "payment date, amount, vesting date, connection to the service period, grounds for repayment, and repayment formula",
      "The Ministry of Labor's June 5, 2026 guidance",
      "that role must be clearly disclosed",
      "An employer's later reinterpretation of the payment's purpose, or reclassification of part of the worker's wages as compensation, cannot readily substitute for the disclosure made when the contract was signed.",
      "Reasonableness is not determined by the amount alone.",
      "The existence of compensation does not permit a service period of any length or repayment liability in any amount without limitation.",
      "how much the worker actually received after tax and deductions",
    ];

    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it("locks all four statutory scope factors and individualized proportionality", () => {
    const section = sectionBody(parsed.content, headings[3]);
    const orderedFactors = [
      "1. The duration and cost of the professional skills training",
      "2. The possibility of replacing the worker with someone in the same or a similar role",
      "3. The amount and scope of the compensation",
      "4. Other circumstances affecting reasonableness",
    ];
    let previousIndex = -1;

    for (const factor of orderedFactors) {
      const index = section.indexOf(factor);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    for (const phrase of [
      "itemized evidence, the amount attributable to the individual worker, the skills the training provided, and the portion of the investment already recovered",
      "Replaceability, the second factor, is not determined solely by the employer's assertion that hiring is difficult.",
      "whether workers are available for the same or a similar role, what qualifications and level of proficiency are required, the usual time needed to fill the position",
      "Compensation, the third factor, is a matter of scope as well as amount.",
      "whether service already completed is reflected if the employment ends early",
      "Other circumstances make up the fourth factor. They may include the circumstances in which the agreement was made, the nature of the work, what was explained to the parties, the actual period served, and the reason employment ended",
      "the relevant circumstances are not limited to them",
      "there must be a reasonable relationship of proportionality among the agreed period, the employer's actual investment, the difficulty of replacement, the compensation received by the worker, and the repayment burden",
      "The outcome of another case should not simply be applied",
    ]) {
      expect(section).toContain(phrase);
    }
  });

  it("locks all four excluded training categories and mixed-program separation", () => {
    const section = sectionBody(parsed.content, headings[4]);
    const requiredPhrases = [
      "Four kinds of training are covered: routine education conducted regularly, ordinary on-the-job training, training that helps new hires adapt to their work and familiarizes them with the work environment and procedures, and training that employers are required by law to provide.",
      "The guidance, Ministry of Labor Letter No. 勞動關2字第1150141814號, addresses each kind separately.",
      "Its costs therefore cannot be converted into the basis for a service obligation or a sanction for early termination",
      "explanations of work rules, introductions to the organization and its systems, ordinary handovers, and basic safety procedures",
      "Ordinary recruitment, management, or handover costs that the employer would normally bear cannot be relabeled as a separate investment subject to reimbursement.",
      "Training is not always excluded merely because it was conducted in-house.",
      "Each component's subject, duration, cost, and status as legally required training should then be examined separately",
      "review the training materials' detailed table of contents and the actual operating records. The cover alone is not enough.",
      "supported by evidence matching the amount claimed as training costs",
    ];

    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it("locks prepaid-benefit disclosure, proportional repayment, and separate claims", () => {
    const section = sectionBody(parsed.content, headings[5]);
    const requiredPhrases = [
      "Disclosure should not be made for the first time after a dispute arises following payment.",
      "which payment compensates for the minimum service commitment, the full length of the agreed period, when the payment vests, and the formula used to settle repayment if employment ends early",
      "the agreed start and end dates, the actual dates worked, and the base amount used to calculate repayment",
      "A fixed amount that takes no account of the period already served",
      "If payment was made in installments or vests in stages, calculate separately the period to which each installment corresponds.",
      "Any repayment analysis should proceed in order through the enforceability of the clause, the legal character of the payment, the period already served, the reason employment ended, and the repayment formula.",
      "Full-repayment provisions, fixed contractual penalties unrelated to actual loss, and unilateral deductions from wages are three issues. They should not be treated as one.",
      "Neither the amount stated in the employer's demand nor the worker's payment of part of that amount resolves the remaining legal issues.",
      "Reimbursement of training costs must also be distinguished from repayment of a prepaid benefit.",
      "check whether any cost has been counted twice",
    ];

    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it("locks paragraph 4 protection and evidence-based attribution without a closed list", () => {
    const section = sectionBody(parsed.content, headings[6]);
    const requiredPhrases = [
      "Article 15-1, paragraph 4 of Taiwan's Labor Standards Act covers an employment contract that ends before the minimum service period for a reason not attributable to the worker. The worker is then not liable for breaching the minimum-service-period agreement or for reimbursing training costs.",
      "The reason employment ended and the attribution of responsibility must be determined from specific evidence, including dismissal notices, resignation communications, and records of alleged violations of working conditions.",
      "Early termination alone does not establish a breach by the worker.",
      "Determine who made which statement, the legal ground on which the contract ended, and to which party the circumstances that actually brought about the termination are attributable.",
      "a dismissal notice, resignation letter, mutual termination agreement, email and messenger records, materials concerning changes to working conditions, and attendance and work records",
      "The actual course of events, the legal ground for termination, and the related evidence must be considered together",
      "Dismissal, mutual termination, and alleged violations of working conditions are examples of circumstances to review, not an exhaustive list",
      "The label in a document may not match the actual facts.",
      "attribution must be addressed before calculating any amount",
      "the legal character and basis of each claim should be reviewed separately",
    ];

    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it("separates resignation from liability and locks Articles 15 and 16 notice rules", () => {
    const section = sectionBody(parsed.content, headings[7]);
    const orderedRules = [
      "Minimum-service-period clauses do not physically or legally prevent a worker from resigning.",
      "A notice of resignation and the notice period concern when the employment relationship ends",
      "the enforceability of the clause and liability for repayment concern whether termination gives rise to financial liability",
      "When a worker terminates an indefinite-term employment contract, Article 15 of Taiwan's Labor Standards Act applies the notice periods in Article 16, paragraph 1.",
      "Article 16 itself governs termination by an employer. Its notice periods apply to a worker's resignation through Article 15.",
      "1. 10 days for at least three months but less than one year of continuous service",
      "2. 20 days for at least one year but less than three years of continuous service",
      "3. 30 days for at least three years of continuous service",
      "Fixed-term employment contracts for a specific task follow a separate rule under Article 15 if they exceed three years.",
      "After completing three years of service, the worker may terminate the contract by giving the employer 30 days' notice.",
      "This rule must be distinguished from the notice periods based on continuous service that apply to indefinite-term employment contracts.",
    ];
    let previousIndex = -1;

    for (const rule of orderedRules) {
      const index = section.indexOf(rule);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    expect(section).toContain(
      "Where continuous service is less than three months, another type of fixed-term contract is involved, or a statutory ground for immediate termination is asserted, the applicable provisions and facts must be examined individually.",
    );
    expect(section).toContain(
      "The legal conclusion cannot be predetermined merely because the contract states a longer notice period or the employer demands an immediate handover.",
    );
    expect(section).toContain(
      "Keep four matters apart: when the resignation takes effect, whether the minimum-service-period clause is enforceable, whether training costs or prepaid benefits must be repaid, and whether any separate loss is claimed",
    );
  });

  it("locks both evidence checklists and every contracted issue separation", () => {
    const section = sectionBody(parsed.content, headings[8]);
    const employerItems = [
      "Start by identifying the statutory ground: professional skills training provided at the employer's cost, or reasonable compensation for the service commitment.",
      "Next, distinguish general education, routine education, legally required training, and professional skills training based on each course's actual content, duration, and purpose.",
      "Preserve course outlines, schedules, completion records, invoices, receipts, and records showing who bore the cost. Record the grounds for external and internal costs separately.",
      "On the compensation side, clearly link in writing the purpose of the compensation, the payment date, amount, vesting conditions, disclosures made to the worker, and the formula for repayment based on the unserved period.",
      "Document the basis for setting the service period, the possibility of replacing the worker with someone in the same or a similar role, and the relationship between the employer's operational needs and its actual investment.",
      "Review whether the agreed period and repayment amount are proportionate to the scope of the training costs or compensation, and account for the period already served.",
      "Determine the cause of termination and the attribution of responsibility individually. Only then calculate the actual termination date and the served and unserved periods.",
      "Before making a wage deduction or demanding repayment, compare the contract, payment records, pay statements, the parties' communications, demand letters, and deduction records to review the legal basis and procedure.",
    ];
    const workerItems = [
      "Gather the original signed employment contract and amendments, recruitment materials, training materials, course outlines, schedules, and completion records.",
      "Determine the training's professional or technical content, whether it was general familiarization or legally required training, the amounts shown on invoices and receipts, and who actually bore each cost.",
      "For prepaid benefits such as signing and retention bonuses, obtain payment records, disclosures about their purpose as compensation, payment dates, vesting conditions, and repayment formulas.",
      "Record separately the basis for the service period, the period already served, the remaining period, and the employer's claimed ability to replace the worker.",
      "Preserve resignation notices, dismissal notices, or mutual termination agreements, as well as proof of delivery such as email and messenger records.",
      "Arrange the actual reason and circumstances of termination chronologically. Then review them together with the employer's repayment demand, pay statements, the parties' communications, and deduction records.",
      "Review separately the clause's enforceability, the notice and timing of resignation, repayment of training costs and prepaid benefits, and any separately alleged loss.",
      "Do not admit liability solely because the contract was signed or the employer demanded a particular amount. Examine the evidence corresponding to Article 15-1's statutory requirements, reasonableness, attribution of termination, and proportional repayment formula.",
    ];
    let previousIndex = -1;

    for (const item of [...employerItems, ...workerItems]) {
      const index = section.indexOf(item);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    for (const phrase of [
      "review the contract together with the chronological records of training, payments, service, and termination",
      "A table can help keep the issues separate. It would show how much of the agreed period was served and remains unserved",
      "Even with a standard-form contract, do not mechanically apply the same period and amount to every role and worker.",
      "Design the clause to reflect the actual investment in training, the compensation, and replaceability, and clearly explain the payment's purpose and the proportional repayment formula before the contract is signed.",
      "Dates worth marking in the chronology are the date the contract was signed, the start and end dates of training, each payment date, the first and last days of work, and the date each notice was delivered",
      "Then seek additional materials through the appropriate procedures as needed",
    ]) {
      expect(section).toContain(phrase);
    }
  });

  it("uses only the four official links and URLs in their contracted order", () => {
    const externalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((https?:\/\/[^)]+)\)/g),
      (match) => match[1],
    );
    const allExternalUrls = parsed.content.match(/https?:\/\/[^\s)]+/g) ?? [];
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

  it("uses only the three exact English internal links in their contracted order", () => {
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

  it("locks the final related link, disclaimer, and canonical author at EOF", () => {
    expect(raw.trimEnd().slice(raw.lastIndexOf(`- ${internalLinks[2]}`))).toBe(
      exactEnding,
    );
    expect(parsed.content.trimEnd().endsWith(exactEnding)).toBe(true);
    expect(raw.trimEnd().endsWith(author)).toBe(true);
  });

  it("removes every forbidden legacy claim, figure, script, and locale leak", () => {
    const visibleText = extractPublicText(parsed.content);
    const forbiddenLiterals = [
      "Taiwan Mandatory Minimum Service Period Clauses",
      "almost always illegal",
      "almost always void",
      "The answer: it is almost always illegal.",
      "all three of the following requirements",
      "all three requirements must be met",
      "If even one of these is not met",
      "reasonable and necessary",
      "clearly illegal",
      "highly likely to be illegal",
      "do not worry too much",
      "representative lawful example",
      "airline pilot",
      "NT$5 million",
      "twenty-year",
      "20-year",
      "NT$183",
      "NT$27,470",
      "10,030 won",
      "2,096,270 won",
      "Ordinary overtime pay, travel expenses, and the like are not recognized.",
      "mandatory employment period",
      "mandatory service period",
      "the worker cannot resign",
      "the worker may not resign",
      "penalty repayment",
      "return money",
      "compensation money",
      "human-power replacement",
      "responsibility attribution",
      "binding precedent",
      "court decision",
      "new Article 15-1 rule",
      "contact us today",
      "leave a comment",
      "direct message",
      "our client",
      "/ko/",
      "/zh-hant/",
      "/ja/",
      "\uFEFF",
      "\u00A0",
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
      "勞動關2字第1150141814號",
      "勞動關2字第1150141814號",
      "曾雋崴",
    ]);
  });

  it("freezes the exact visible word count and read time", () => {
    const publicText = extractPublicText(parsed.content);
    const visibleWordCount =
      publicText.match(/\b[A-Za-z]+(?:['’-][A-Za-z]+)*\b/g)?.length ?? 0;
    const calculatedMinutes = Math.ceil(visibleWordCount / 200);

    expect(visibleWordCount).toBeGreaterThanOrEqual(1_800);
    expect(visibleWordCount).toBe(3_691);
    expect(calculatedMinutes).toBe(19);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes} min read`);
    expect(post?.readTime).toBe(`${calculatedMinutes} min read`);
  });

  it("exposes source-matching metadata, FAQ, image, and renderer content", () => {
    expect(parsed.data.url).toBe(sourceUrl);
    expect(post).toMatchObject({
      slug: canonicalSlug,
      title,
      date: "2026-10-12",
      dateDisplay: "September 13, 2025",
      readTime: "19 min read",
      category: "legal",
      categoryLabel: "Legal Information",
      featuredImage:
        "/images/blog/014-taiwan-mandatory-employment-period/featured-01.jpg",
      faq,
    });

    const expectedRendererContent = parsed.content
      .replace(/\(\.\.\/images\/([^)]+)\)/g, "(/images/blog/$1)")
      .trimStart()
      .replace(/^#\s+.+\n*/, "")
      .replace(/^\s*!\[[^\]]*\]\([^)]+\)\s*\n*/, "")
      .trim();
    expect(post?.content).toBe(expectedRendererContent);
    expect(post?.content).toContain(`## ${headings[0]}`);
    expect(post?.content).toContain(`## ${headings.at(-1)}`);
  });

  it("resolves the canonical and mandatory-employment aliases to one English post", () => {
    expect(post).toBeDefined();
    expect(aliasPost).toBeDefined();
    expect(aliasPost?.slug).toBe(canonicalSlug);
    expect(aliasPost).toEqual(post);
  });
});
