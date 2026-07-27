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
  "Taiwan Company Formation: Choosing a Business Location and Taipei's Prior Inquiry";
const headings = [
  '1. In Taipei, do only certain industries need a business-location prior inquiry?',
  '2. What building documents are required for a business-location prior inquiry?',
  '3. Can a leased address, borrowed registration address, or virtual office be used as a company address?',
  '4. If the prior-inquiry result is compliant, can the business operate there immediately?',
  '5. How long does the prior inquiry take, and how long is the result valid?',
  'Official Sources',
  'Related Services',
];
const officialUrls = [
  'https://www.businesslocationinfo.gov.taipei/BLBQS/Home/Notice',
  'https://laws.gov.taipei/Law/LawSearch/LawArticleContent/FL080687',
  'https://www.gov.taipei/News_Content.aspx?n=EEC70A4186D4C828&s=E70ACC80BEEC5910&sms=87415A8B9CE81B16',
  'https://laws.gov.taipei/Law/SOPSearch/DownloadFile?sop_no=P04020118.pdf',
  'https://gcis.nat.gov.tw/F/t70044_p',
  'https://www.fda.gov.tw/tc/newsContent.aspx?id=11672',
];
const internalTargets = [
  '/en/services#investment',
  '/en/columns/taiwan-company-establishment-advanced-1',
  '/en/contact',
];

function firstParagraphAfter(content: string, heading: string) {
  return content.split(`## ${heading}\n\n`)[1]?.split('\n\n')[0];
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

describe('English investment column 015 — Taipei business-location inquiry', () => {
  it('publishes the corrected metadata and exactly five FAQs', () => {
    expect(parsed.data).toMatchObject({
      title,
      url: 'https://www.wei-wei-lawyer.com/post/taiwan-company-setup-pitch-location',
      lastmod: '2026-07-27',
      date_display: 'September 13, 2025',
      read_time: '11 min read',
      categories: ['Taiwan Company Formation'],
      featured_image:
        '../images/015-taiwan-company-setup-pitch-location/featured-01.jpg',
    });
    expect(parsed.data.faq).toHaveLength(5);
    expect(post).toMatchObject({
      slug: 'taiwan-company-setup-pitch-location',
      title,
      date: '2026-07-27',
      dateDisplay: 'September 13, 2025',
      readTime: '11 min read',
      categoryLabel: 'Company Setup',
      faq: parsed.data.faq,
    });
  });

  it('uses one H1 and the seven contracted H2 sections in order', () => {
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(headings);
  });

  it('repeats every exact FAQ answer as its matching section first paragraph', () => {
    for (const [index, faq] of parsed.data.faq.entries()) {
      expect(faq.q).toBe(headings[index].replace(/^\d+\. /, ''));
      expect(firstParagraphAfter(parsed.content, headings[index])).toBe(faq.a);
      expect(firstParagraphAfter(post?.content ?? '', headings[index])).toBe(
        faq.a,
      );
      expect(raw.split(faq.a)).toHaveLength(3);
    }
  });

  it('states the comprehensive 2023 review and exact five-step sequence', () => {
    const required = [
      'from January 1, 2023',
      'establish a company or business (including a branch or branch establishment), change its registered location, or add business items',
      'comprehensively reviews the business location and business items before accepting a company or business registration',
      'attach that result to the relevant registration application',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }

    const sequence = [
      '1. Identify the exact address, floor, and scope to be used and the planned business items.',
      '2. Obtain the current building registration materials and other required documents.',
      '3. Apply for the business-location prior inquiry and undergo review of the combination of location and business items.',
      '4. Attach a compliant inquiry result to the registration application to establish a company or business, change its registered location, or add business items.',
      '5. Separately complete industry-specific permits, fire and health preparations, interior work, and any other requirements for starting operations.',
    ];
    const positions = sequence.map((step) => raw.indexOf(step));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('covers supplementation, incompatible results, item limit, and fallback', () => {
    const required = [
      'sends a guidance letter asking the applicant to supplement the result',
      'the registration process continues after supplementation',
      'finds some business items noncompliant',
      'changing the business location or removing a noncompliant item',
      'may include up to five business items',
      'select their principal business items for review',
      'case-linked proactive inquiry (隨案主動查詢)',
      'including restaurants and other food-service items',
      'Taipei City Department of Commerce initiates an inquiry in connection with the registration case',
      'does not revive the former view that only listed industries require a prior inquiry',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('requires current building records, official channels, and use ratios', () => {
    const required = [
      'building registration transcript (including a Type II transcript) issued within the last three months, or the building ownership certificate',
      'Taipei City land-office counters and convenience workstations',
      "government's electronic transcript system",
      'There is no across-the-board requirement to use a particular acquaintance or lawyer',
      'primarily residential with ancillary office use',
      'residential use exceeding three-fifths of the whole',
      'office use below two-fifths',
      'land-use zoning certification',
      'Document supplementation will be required',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('separates address-use authority, actual use, and site suitability', () => {
    const required = [
      "owner's consent to use the property together with proof of ownership",
      "authority to use the address as the company's location",
      'does not confirm that the site complies with land-use zoning, building, fire, or health rules for every business item',
      'borrowed registration address',
      'virtual office',
      'inappropriate to decide that an arrangement can never be used solely',
      'business is actually conducted at a place separate from the registered address',
      'does not satisfy the requirements of a separate actual place of business',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('limits inquiry scope and keeps separate operating requirements', () => {
    const required = [
      "does not approve the lessor's authority or lease terms, or satisfy fire-safety, health, environmental, signage, food-business registration, industry-specific permitting",
      'It does not validate the lease or approve',
      'fire-safety equipment, smoke exhaust and drainage, waste, noise, signage installation',
      'food sanitation management, food-business registration, requirements for personnel and equipment',
      'result already obtained may not be usable as is',
      'each have a different purpose and review scope',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('states non-guaranteed timing targets and six-month validity', () => {
    const required = [
      'five calendar days for ordinary cases and eleven calendar days for cases requiring consultation with external agencies',
      'These targets do not guarantee a completion date',
      'administrative processing targets in calendar days, not business days',
      'requests for additional documents, responses from other agencies, case volume',
      'valid for six months from the review completion date',
      'The six-month validity period runs from the review completion date',
      'do not rely on the old result',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses only the contracted images, sources, and English links', () => {
    const imagePaths = Array.from(
      raw.matchAll(/(?:featured_image: "|!\[[^\]]*\]\()([^"\n)]+\.jpg)/g),
      (match) => match[1],
    );
    expect([...new Set(imagePaths)]).toEqual([
      '../images/015-taiwan-company-setup-pitch-location/featured-01.jpg',
      '../images/015-taiwan-company-setup-pitch-location/img-01.jpg',
    ]);

    const externalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((https?:\/\/[^)]+)\)/g),
      (match) => match[1],
    );
    const internalLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[1],
    );
    expect([...new Set(externalTargets)].sort()).toEqual(
      [...officialUrls].sort(),
    );
    expect([...new Set(internalLinks)]).toEqual(internalTargets);
    for (const target of [...officialUrls, ...internalTargets]) {
      expect(parsed.content.split(target)).toHaveLength(3);
    }
  });

  it('removes stale claims and all unapproved locale leakage', () => {
    const forbidden = [
      'only business items that fall under',
      'must be inquired into in advance',
      'the city government may refuse registration',
      'Later',
      'img-02.jpg',
      'www.laws.taipei.gov.tw',
      '曾俊瑋',
      '/ko/',
      '/ja/',
      '/zh-hant/',
      'does not immediately reach a uniform conclusion',
      'comprehensively permits the validity of the lease',
      'organizes the current',
      'document supplements',
      'valid compliant result',
    ];
    for (const phrase of forbidden) {
      expect(raw).not.toContain(phrase);
    }

    const withoutAllowedHan = raw
      .replace(/營業場所預先查詢/g, '')
      .replace(/隨案主動查詢/g, '')
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

    expect(visibleWordCount).toBe(2_115);
    expect(calculatedMinutes).toBe(11);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes} min read`);
    expect(post?.readTime).toBe(`${calculatedMinutes} min read`);
    expect(getColumnPost('company-location', 'en')?.slug).toBe(
      'taiwan-company-setup-pitch-location',
    );
  });
});
