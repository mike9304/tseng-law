import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-en/005-taiwan-company-establishment-advanced-2.md',
);
const sourcePath = path.join(
  process.cwd(),
  'src/content/columns/005-taiwan-company-establishment-advanced-2.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const sourceRaw = fs.readFileSync(sourcePath, 'utf8');
const parsed = matter(raw);
const sourceParsed = matter(sourceRaw);
const post = getColumnPost(
  'taiwan-company-establishment-advanced-2',
  'en',
);

const title =
  'Taiwan Company Formation: Capital Remittance, Banking, and Foreign Hiring';
const questions = [
  "1. What should I keep in mind when remitting capital from Korea to a Taiwan company's preparatory account?",
  "2. When paying in the company's capital, can I transfer New Taiwan dollars from my own Taiwan account to the company's preparatory account?",
  "3. After the capital has been deposited into the company's preparatory account, when can the account be converted into a formal account?",
  "4. Can I use online banking immediately after the company's preparatory account is converted into a formal account?",
  '5. Can the company employ Korean nationals?',
];
const answerParagraphs = [
  [
    "Korean banks generally require the investor **personally** to visit a bank in Korea and remit the funds from the investor's own account.",
    "Remitting the funds through online banking or through a relative or acquaintance in Korea on the investor's behalf is not permitted.",
    'In addition, under Korea\'s foreign exchange laws, a Korean national who establishes or acquires an equity interest in a foreign company must file an "overseas direct investment report." The report must be filed when the capital is remitted to the Taiwan company, and failure to file may result in sanctions for violating foreign exchange laws.',
    'Before remitting the capital, please consult the Korean bank with which you normally do business.',
  ],
  [
    'Yes, but you must submit documents showing the source of the New Taiwan dollar funds acquired in Taiwan.',
    'For example, if the funds are salary income earned in Taiwan, you must submit a copy of the withholding statement for that salary income (薪資所得的扣繳憑單影本).',
    'If the funds are dividends or profits from an investment in a Taiwan business, you must submit a copy of the withholding statement for those dividends or profits (股息和紅利的扣繳憑單影本).',
    'If the funds are remitted from a Korean bank account, no source-of-funds documents need to be attached.',
  ],
  [
    'Generally, the company registration documents must first be issued.',
    "The company's responsible person may then visit the bank to convert the preparatory account into a formal account.",
    'However, because each bank has different internal rules, if you need to use the capital urgently, it is advisable to ask the bank in advance.',
  ],
  [
    'Requirements vary by bank, but generally at least a mobile phone number is required.',
    'Some banks may impose additional requirements, such as requiring the account to have been in use for at least six months after the company was established.',
  ],
  [
    'A. No restriction applies to the first employee: Manager of a General Overseas Chinese or Foreign Invested Business (一般僑外投資事業主管工作).',
    'B. Restrictions apply from the second employee onward: when employing more than one foreign national, the employee\'s relevant education and work experience, the average-salary requirement, and the company\'s capital and revenue requirements are handled in accordance with the standards for "specialized or technical work" (專門性或技術性工作).',
    'See the Taiwan Ministry of Labor website: <https://ezworktaiwan.wda.gov.tw/cp.aspx?n=A88DC323EF7C85FF>',
  ],
];

function sectionAfterQuestion(
  content: string,
  question: string,
  nextQuestion?: string,
) {
  const after = content.split(`**${question}**\n\n`)[1] ?? '';
  return nextQuestion
    ? after.split(`\n\n**${nextQuestion}**`)[0]
    : after.split('\n\nPlease contact us')[0];
}

function extractLinkTargets(content: string) {
  return [
    ...Array.from(
      content.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g),
      (match) => match[1],
    ),
    ...Array.from(
      content.matchAll(/<(https?:\/\/[^>]+)>/g),
      (match) => match[1],
    ),
  ].sort();
}

function extractImageTargets(content: string) {
  return Array.from(
    content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g),
    (match) => match[1],
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

describe('English investment column 005 — faithful Korean-source translation', () => {
  it('preserves the contracted metadata and removes the invented FAQ frontmatter', () => {
    expect(parsed.data).toMatchObject({
      title,
      url: 'https://www.wei-wei-lawyer.com/post/taiwan-company-establishment-advanced-2',
      lastmod: '2026-07-27',
      date_display: 'September 13, 2025',
      read_time: '3 min read',
      categories: ['Taiwan Company Formation'],
      featured_image:
        '../images/005-taiwan-company-establishment-advanced-2/featured-01.jpg',
    });
    expect(parsed.data.faq).toBeUndefined();
    expect(post).toMatchObject({
      slug: 'taiwan-company-establishment-advanced-2',
      title,
      date: '2026-07-27',
      dateDisplay: 'September 13, 2025',
      readTime: '3 min read',
      categoryLabel: 'Company Setup',
    });
  });

  it('uses one H1, no invented H2 sections, and exactly five bold Q&A prompts', () => {
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(parsed.content).not.toMatch(/^## /m);
    expect(
      Array.from(
        parsed.content.matchAll(/^\*\*(\d+\..+)\*\*$/gm),
        (match) => match[1],
      ),
    ).toEqual(questions);
  });

  it('preserves every translated answer paragraph in its Korean-source order', () => {
    for (const [index, question] of questions.entries()) {
      const section = sectionAfterQuestion(
        parsed.content,
        question,
        questions[index + 1],
      );
      const paragraphs = section.split('\n\n').filter(Boolean);
      expect(paragraphs).toEqual(answerParagraphs[index]);
      expect(post?.content).toContain(`**${question}**`);
    }
  });

  it('mirrors the Korean source image and link targets exactly', () => {
    expect(extractImageTargets(parsed.content)).toEqual(
      extractImageTargets(sourceParsed.content),
    );
    expect(extractLinkTargets(parsed.content)).toEqual(
      extractLinkTargets(sourceParsed.content),
    );
  });

  it('restores the Korean-source capital-remittance requirements without additions', () => {
    const required = [
      'require the investor **personally** to visit a bank in Korea',
      "through a relative or acquaintance in Korea on the investor's behalf is not permitted",
      'must file an "overseas direct investment report."',
      'The report must be filed when the capital is remitted to the Taiwan company',
      'failure to file may result in sanctions for violating foreign exchange laws',
      'consult the Korean bank with which you normally do business',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('restores the Korean-source Taiwan-dollar evidence examples', () => {
    const required = [
      'documents showing the source of the New Taiwan dollar funds acquired in Taiwan',
      'salary income (薪資所得的扣繳憑單影本)',
      'dividends or profits (股息和紅利的扣繳憑單影本)',
      'no source-of-funds documents need to be attached',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('keeps account conversion and online-banking conditions faithful to the source', () => {
    const required = [
      'company registration documents must first be issued',
      "company's responsible person may then visit the bank",
      'each bank has different internal rules',
      'generally at least a mobile phone number is required',
      'at least six months after the company was established',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('restores the source distinction between the first and later foreign employees', () => {
    const required = [
      'No restriction applies to the first employee',
      '一般僑外投資事業主管工作',
      'Restrictions apply from the second employee onward',
      "employee's relevant education and work experience",
      "company's capital and revenue requirements",
      '專門性或技術性工作',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('removes every unsupported legal expansion and official-source section', () => {
    const forbidden = [
      'It is not possible to state categorically',
      'designated foreign exchange bank',
      'customer due diligence',
      'anti-money-laundering controls',
      'more than one third of the total shares or total capital',
      'Paid-in capital or working capital in Taiwan of at least TWD 500,000',
      'Import/export performance of at least USD 500,000',
      'Representative offices and specially recognized cases',
      '## Official Sources',
      '## Related Services',
    ];
    for (const phrase of forbidden) {
      expect(raw).not.toContain(phrase);
    }
  });

  it('uses the required byline and contains no accidental locale leakage', () => {
    expect(raw).toContain('Wei Tseng (曾雋崴), Taiwan Attorney');
    expect(raw).not.toContain('曾俊瑋');

    const withoutAllowedHan = raw.replace(
      /曾雋崴|薪資所得的扣繳憑單影本|股息和紅利的扣繳憑單影本|一般僑外投資事業主管工作|專門性或技術性工作/g,
      '',
    );
    expect(withoutAllowedHan).not.toMatch(
      /[\p{Script=Han}\p{Script=Hangul}\p{Script=Hiragana}\p{Script=Katakana}]/u,
    );
    expect(raw).not.toMatch(/[\uFEFF\u00A0\u200B]/u);
    expect(raw).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it('keeps read time aligned and resolves the canonical alias', () => {
    const visibleWordCount = countVisibleEnglishWords(parsed.content);
    const calculatedMinutes = Math.ceil(visibleWordCount / 200);

    expect(visibleWordCount).toBe(546);
    expect(calculatedMinutes).toBe(3);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes} min read`);
    expect(post?.readTime).toBe(`${calculatedMinutes} min read`);
    expect(getColumnPost('company-advanced-2', 'en')?.slug).toBe(
      'taiwan-company-establishment-advanced-2',
    );
  });
});
