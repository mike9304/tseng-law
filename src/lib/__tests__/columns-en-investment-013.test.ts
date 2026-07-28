import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-en/013-taiwan-company-establishment-advanced-1.md',
);
const embeddingPath = path.join(
  process.cwd(),
  'src/content/column-embeddings.json',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost(
  'taiwan-company-establishment-advanced-1',
  'en',
);

const title = 'Taiwan Company Formation — Advanced Guide 1';
const questions = [
  '1. I want to form a company, but I have not yet found a registered office address. Can I still proceed?',
  '2. Can I open a company bank account without a Taiwan residence certificate?',
  "3. I heard that I must provide my education and work history for the investment-plan review. I am worried that my background may not match the company's proposed line of business.",
  '4. What should I consider when leasing a registered office address, such as a restaurant storefront?',
  '5. Can I lease ordinary commercial office space when forming a company?',
];
const internalTargets = [
  '/en/guides/taiwan-company-setup',
  '/en/korean-lawyer-in-taiwan',
  '/en/taiwan-company-setup-lawyer',
];

function numberedSections(content: string) {
  const matches = Array.from(
    content.matchAll(/^\*\*(\d+\..+)\*\*$/gm),
  );

  return matches.map((match, index) =>
    content
      .slice(
        match.index,
        matches[index + 1]?.index ??
          content.indexOf('\n\n---', match.index),
      )
      .trim(),
  );
}

function paragraphCount(content: string) {
  return content
    .split(/\n\n+/)
    .filter((block) => block.trim()).length;
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

describe('English investment column 013 — source-faithful company Q&A', () => {
  it('preserves fixed metadata and removes the source-absent FAQ expansion', () => {
    expect(parsed.data).toMatchObject({
      title,
      url: 'https://www.wei-wei-lawyer.com/post/taiwan-company-establishment-advanced-1',
      lastmod: '2026-07-27',
      date_display: 'September 13, 2025',
      read_time: '4 min read',
      categories: ['Taiwan Company Formation'],
      featured_image:
        '../images/013-taiwan-company-establishment-advanced-1/featured-01.jpg',
    });
    expect(parsed.data.faq).toBeUndefined();
    expect(post).toMatchObject({
      slug: 'taiwan-company-establishment-advanced-1',
      title,
      date: '2026-07-27',
      dateDisplay: 'September 13, 2025',
      readTime: '4 min read',
      categoryLabel: 'Company Setup',
    });
  });

  it('uses one H1, no source-absent H2s, and all five questions in order', () => {
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

  it('faithfully translates the four-paragraph introduction', () => {
    const required = [
      'successfully established companies in Taiwan and obtained work visas and residence certificates',
      'questions that many people ask during the company formation process',
      'please also see this more detailed advanced guide',
      'I hope the Q&A below will help anyone considering forming a company in Taiwan',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('preserves the complete five-section paragraph shape', () => {
    const sections = numberedSections(parsed.content);
    expect(sections).toHaveLength(5);
    expect(sections.map(paragraphCount)).toEqual([16, 6, 6, 10, 9]);
    expect(paragraphCount(parsed.content)).toBe(57);
  });

  it('keeps every source claim about the address and investment review', () => {
    const required = [
      "Taiwan's Investment Commission for review",
      'capital will actually be used for investment',
      'foreign parties are not bringing funds into Taiwan under another pretext',
      "does not need to state the company's exact address",
      'naming the area is sufficient (for example, Taipei City)',
      'review the lease and inspect the company\'s address in person',
      'opened accounts and then disappeared',
      'opening a bank account was the most difficult part of the process',
      'many money-laundering cases',
      'prepare the investment plan while looking for a registered office address',
      'within one year after investment approval',
      'open a preparatory company account, and remit the capital',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('keeps the residence-certificate and immigration-office guidance', () => {
    const required = [
      'Can I open a company bank account without a Taiwan residence certificate?',
      'Banks generally require two forms of identification',
      'National Immigration Agency',
      'Basic Information Form of Uniform ID Number',
      '統一證號基本資料表',
      'issued on the same day',
      'arrive early and take a number',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('keeps the education and work-history guidance without embellishment', () => {
    const required = [
      'review committee under the Ministry of Economic Affairs',
      'review is not overly strict',
      'a range of work experience, including part-time jobs',
      'enough detail to persuade the reviewers',
      'discuss this point fully with a Taiwan attorney',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('keeps all source numbers and lease recommendations', () => {
    const required = [
      'about **three months**',
      'about **one additional month**',
      'set the lease start date as late as possible',
      '**fit-out period**',
      'This is a rent-free period',
      "usually two months' rent",
      'reluctant to lease to foreign nationals',
      'looking for business premises early',
      'notarizing the lease or paying an additional security deposit',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('keeps the restaurant and commercial-office distinction', () => {
    const required = [
      "It depends on the company's business items",
      'registered business item is food and beverage service',
      'opening a bank account will be very difficult',
      'city government will also require the registered address',
      'area where a restaurant may operate',
      'company registration may not be possible',
      'such as advertising or wholesale',
      'Please confirm this before signing the lease',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses only the contracted images and links and excludes invented material', () => {
    const imagePaths = Array.from(
      raw.matchAll(/(?:featured_image: "|!\[[^\]]*\]\()([^"\n)]+\.jpg)/g),
      (match) => match[1],
    );
    expect([...new Set(imagePaths)]).toEqual([
      '../images/013-taiwan-company-establishment-advanced-1/featured-01.jpg',
      '../images/013-taiwan-company-establishment-advanced-1/img-01.jpg',
    ]);

    const externalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((https?:\/\/[^)]+)\)/g),
      (match) => match[1],
    );
    const internalLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[1],
    );
    expect(externalTargets).toEqual([
      'https://www.wei-wei-lawyer.com/post/%EB%8C%80%EB%A7%8C-%ED%9A%8C%EC%82%AC%EC%84%A4%EB%A6%BD-%EA%B8%B0%EC%B4%88%ED%8E%B8',
    ]);
    expect(internalLinks).toEqual(internalTargets);

    const forbidden = [
      'Department of Investment Review',
      'Article 9 of the Statute for Investment by Foreign Nationals',
      'land-use zoning',
      'building-management',
      'Workforce Development Agency',
      'seven working days',
      'conditions precedent',
      'Before You Proceed',
      'Official Sources',
      'Related Services',
      'Not every case requires the same materials',
      '曾俊瑋',
      '/ko/',
      '/ja/',
      '/zh-hant/',
    ];
    for (const phrase of forbidden) {
      expect(raw).not.toContain(phrase);
    }
    expect(raw).toContain('Wei Tseng (曾雋崴), Taiwan Attorney');
    expect(raw).not.toMatch(
      /[\p{Script=Hangul}\p{Script=Hiragana}\p{Script=Katakana}]/u,
    );
    expect(raw).not.toMatch(/[\uFEFF\u00A0\u200B]/u);
  });

  it('aligns the title embedding, read time, and canonical alias', () => {
    const visibleWordCount = countVisibleEnglishWords(parsed.content);
    const calculatedMinutes = Math.ceil(visibleWordCount / 200);
    const embeddingData = JSON.parse(
      fs.readFileSync(embeddingPath, 'utf8'),
    ) as {
      embeddings: Array<{
        slug: string;
        locale: string;
        title: string;
      }>;
    };
    const embedding = embeddingData.embeddings.find(
      (item) =>
        item.slug === 'taiwan-company-establishment-advanced-1' &&
        item.locale === 'en',
    );

    expect(visibleWordCount).toBe(761);
    expect(calculatedMinutes).toBe(4);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes} min read`);
    expect(post?.readTime).toBe(`${calculatedMinutes} min read`);
    expect(embedding?.title).toBe(title);
    expect(getColumnPost('company-advanced-1', 'en')?.slug).toBe(
      'taiwan-company-establishment-advanced-1',
    );
  });
});
