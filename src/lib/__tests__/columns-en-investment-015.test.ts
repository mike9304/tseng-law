import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-en/015-taiwan-company-setup-pitch-location.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('taiwan-company-setup-pitch-location', 'en');

const title =
  'Taiwan Company Formation — Advanced Guide 3: Finding a Business Location';
const imagePaths = [
  '../images/015-taiwan-company-setup-pitch-location/featured-01.jpg',
  '../images/015-taiwan-company-setup-pitch-location/img-01.jpg',
  '../images/015-taiwan-company-setup-pitch-location/img-02.jpg',
];
const linkTargets = [
  'https://www.businesslocationinfo.gov.taipei/BLBQS/Home/Notice',
  'https://www.laws.taipei.gov.tw/Law/LawSearch/LawArticleContent/FL080687',
  '/en/guides/taiwan-company-setup',
  '/en/korean-lawyer-in-taiwan',
  '/en/taiwan-company-setup-lawyer',
];

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

function expectPhrasesInOrder(content: string, phrases: string[]) {
  const positions = phrases.map((phrase) => content.indexOf(phrase));
  expect(positions.every((position) => position >= 0)).toBe(true);
  expect(positions).toEqual([...positions].sort((a, b) => a - b));
}

describe('English investment column 015 — Taipei business-location inquiry', () => {
  it('publishes the corrected canonical metadata without invented FAQ entries', () => {
    expect(parsed.data).toEqual({
      title,
      url: 'https://www.wei-wei-lawyer.com/post/taiwan-company-setup-pitch-location',
      lastmod: '2026-07-27',
      date_display: 'September 13, 2025',
      read_time: '3 min read',
      categories: ['Taiwan Company Formation'],
      featured_image:
        '../images/015-taiwan-company-setup-pitch-location/featured-01.jpg',
    });
    expect(parsed.data.faq).toBeUndefined();
    expect(post).toMatchObject({
      slug: 'taiwan-company-setup-pitch-location',
      title,
      date: '2026-07-27',
      dateDisplay: 'September 13, 2025',
      readTime: '3 min read',
      categoryLabel: 'Company Setup',
    });
  });

  it('keeps the Korean source structure: one H1, no invented H2 sections', () => {
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual([]);
    expect(parsed.content.match(/^---$/gm)).toHaveLength(1);
  });

  it('preserves the source paragraph sequence from location screening to the Q&A', () => {
    expectPhrasesInOrder(parsed.content, [
      'Requirements vary among local governments in Taiwan',
      'the first issue is finding a business address',
      'In addition to considering market conditions',
      'another important consideration is',
      'whether the address is in an area where a restaurant business may operate',
      'Taipei City Department of Commerce',
      'check free of charge',
      'Type II Building Registration Transcript',
      'Anyone may request',
      'If it is difficult to visit a land office',
      'you may ask an acquaintance in Taiwan',
      'the city government may not accept the registration',
      'Please therefore take care',
      'Must every type of business use',
    ]);
  });

  it('accurately states the free inquiry and required building transcript', () => {
    const required = [
      'you can use the Taipei City Department of Commerce',
      '"Business Location Prior Inquiry" system',
      'You can check free of charge',
      'you must upload a "Type II Building Registration Transcript" (建物登記第二類謄本)',
      'contains detailed information about the building',
      'Anyone may request a Type II Building Registration Transcript for any address',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('retains every source-listed way to obtain help without adding a requirement', () => {
    const required = [
      'a land office (地政事務所)',
      'an acquaintance in Taiwan',
      'the landlord',
      'a real estate agent',
      'a lawyer for help',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expect(raw).not.toContain('requirement to use a particular');
  });

  it('preserves the restored conditional registration warning', () => {
    expect(raw).toContain(
      'If the inquiry result shows that restaurant use is not permitted, the city government may not accept the registration when you later apply to register the company.',
    );
    expect(post?.content).toContain(
      'the city government may not accept the registration when you later apply to register the company',
    );
    expect(raw).not.toContain('will refuse registration');
    expect(raw).not.toContain('automatically refuse registration');
  });

  it('distinguishes the general recommendation from the mandatory category', () => {
    const required = [
      'We recommend that every type of business',
      'companies commonly register multiple business items',
      'around ten items at once',
      'it is not necessary to conduct an inquiry for every business item',
      'an inquiry is **mandatory** only for a business item classified as a "business item subject to proactive inquiry"',
      'the inquiry result must be submitted to the Taipei City Government together with the company registration application',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('retains the fine warning, closing advice, and required byline', () => {
    const required = [
      'the competent authority may later impose a fine',
      'please feel free to contact a Taiwan attorney',
      'Administrative agency rules may change frequently',
      'confirm the latest regulations before registering a company',
      '**Wei Tseng (曾雋崴), Taiwan Attorney**',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses exactly the source images and localized source links', () => {
    const actualImagePaths = Array.from(
      raw.matchAll(/(?:featured_image: "|!\[[^\]]*\]\()([^"\n)]+\.jpg)/g),
      (match) => match[1],
    );
    expect([...new Set(actualImagePaths)]).toEqual(imagePaths);

    const actualLinkTargets = Array.from(
      parsed.content.matchAll(/(?:<|\]\()((?:https?:\/\/|\/en\/)[^)>]+)(?:>|\))/g),
      (match) => match[1],
    );
    expect(actualLinkTargets).toEqual(linkTargets);
    for (const target of linkTargets) {
      expect(parsed.content.split(target)).toHaveLength(2);
    }
  });

  it('removes invented legal claims and all unapproved locale leakage', () => {
    const forbidden = [
      'from January 1, 2023',
      'five calendar days',
      'eleven calendar days',
      'valid for six months',
      'up to five business items',
      'branch establishment',
      'borrowed registration address',
      'virtual office',
      'fire-safety equipment',
      'food-business registration',
      'Official Sources',
      'Related Services',
      'Later',
      '曾俊瑋',
      '/ko/',
      '/ja/',
      '/zh-hant/',
    ];
    for (const phrase of forbidden) {
      expect(raw).not.toContain(phrase);
    }

    const withoutAllowedHan = raw
      .replace(/建物登記第二類謄本/g, '')
      .replace(/地政事務所/g, '')
      .replace(/臺北市營業場所協助查詢服務作業須知/g, '')
      .replace(/主動查詢之營業項目/g, '')
      .replace(/曾雋崴/g, '');
    expect(withoutAllowedHan).not.toMatch(
      /[\p{Script=Han}\p{Script=Hangul}\p{Script=Hiragana}\p{Script=Katakana}]/u,
    );
    expect(raw).not.toMatch(/[\uFEFF\u00A0\u200B]/u);
    expect(raw).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it('keeps read time aligned and resolves the canonical alias', () => {
    const visibleWordCount = countVisibleEnglishWords(parsed.content);
    const calculatedMinutes = Math.ceil(visibleWordCount / 200);

    expect(visibleWordCount).toBe(434);
    expect(calculatedMinutes).toBe(3);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes} min read`);
    expect(post?.readTime).toBe(`${calculatedMinutes} min read`);
    expect(getColumnPost('company-location', 'en')?.slug).toBe(
      'taiwan-company-setup-pitch-location',
    );
  });
});
