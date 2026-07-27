import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const filename = '010-taiwan-gym-injury-lawsuit.md';
const englishPath = path.join(
  process.cwd(),
  'src/content/columns-en',
  filename,
);
const koreanPath = path.join(process.cwd(), 'src/content/columns', filename);
const raw = fs.readFileSync(englishPath, 'utf8');
const koreanRaw = fs.readFileSync(koreanPath, 'utf8');
const parsed = matter(raw);
const korean = matter(koreanRaw);
const post = getColumnPost('taiwan-gym-injury-lawsuit', 'en');

const title =
  'Taiwan Gym Injury Claims: Case Study, Deadlines, Evidence, and Damages';
const sectionHeadings = [
  '1. What legal procedures may be considered after a gym injury in Taiwan?',
  '2. What time limits apply to a criminal complaint and a civil damages claim?',
  '3. What evidence should be preserved, and how, immediately after an accident?',
  '4. What categories of damages may be claimed against a gym?',
  '5. Can compensation still be disputed even if the gym has liability insurance?',
];

function extractDestinations(
  content: string,
  pattern: RegExp,
): string[] {
  return Array.from(content.matchAll(pattern), (match) => match[1]);
}

function extractSection(content: string, index: number): string {
  const heading = `## ${sectionHeadings[index]}`;
  const nextHeading =
    index + 1 < sectionHeadings.length
      ? `## ${sectionHeadings[index + 1]}`
      : '\n\n---\n\n> See also:';
  const start = content.indexOf(heading);
  const end = content.indexOf(nextHeading, start + heading.length);

  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return content.slice(start, end);
}

function countVisibleEnglishWords(content: string): number {
  const visibleText = content
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/[“”*_`]/g, ' ');

  return (
    visibleText.match(/[A-Za-z0-9]+(?:[.’-][A-Za-z0-9]+)*/g)?.length ?? 0
  );
}

describe('English litigation column 010 — gym injury damages', () => {
  it('publishes the contracted metadata, sole H1, and five ordered H2 sections', () => {
    expect(parsed.data).toEqual({
      title,
      url: 'https://www.wei-wei-lawyer.com/post/taiwan-gym-injury-lawsuit',
      lastmod: '2026-07-25',
      date_display: 'September 13, 2025',
      read_time: '10 min read',
      categories: ['Case Study Analysis'],
      featured_image:
        '../images/010-taiwan-gym-injury-lawsuit/featured-01.jpg',
    });
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(sectionHeadings);
    expect(post?.title).toBe(title);
    expect(post?.readTime).toBe('10 min read');
  });

  it('preserves all source images and link destinations in source order', () => {
    const imagePattern = /!\[[^\]]*\]\(([^)]+)\)/g;
    const linkPattern = /(?<!!)\[[^\]]+\]\(([^)]+)\)/g;
    const expectedLinks = extractDestinations(
      korean.content,
      linkPattern,
    ).map((destination) => destination.replace(/^\/ko\//, '/en/'));

    expect(extractDestinations(parsed.content, imagePattern)).toEqual(
      extractDestinations(korean.content, imagePattern),
    );
    expect(extractDestinations(parsed.content, linkPattern)).toEqual(
      expectedLinks,
    );
    expect(extractDestinations(parsed.content, imagePattern)).toHaveLength(11);
    expect(expectedLinks).toHaveLength(17);
  });

  it('keeps the exact source section structure and seven damage items', () => {
    const expectedProseCounts = [3, 3, 3, 1, 4];

    sectionHeadings.forEach((_, index) => {
      const section = extractSection(parsed.content, index);
      const blocks = section
        .split(/\n{2,}/u)
        .map((block) => block.trim())
        .filter(Boolean);
      const prose = blocks.filter(
        (block) =>
          !block.startsWith('## ') && !/^\d+\.\s/u.test(block),
      );

      expect(prose).toHaveLength(expectedProseCounts[index]);
    });

    const damageSection = extractSection(parsed.content, 3);
    expect(
      Array.from(
        damageSection.matchAll(/^(\d+)\. \*\*([^*]+)\*\*:/gm),
        (match) => `${match[1]}. ${match[2]}`,
      ),
    ).toEqual([
      '1. Medical expenses',
      '2. Caregiving or nursing costs',
      '3. Transportation expenses',
      '4. Loss of earning capacity',
      '5. Lost earnings during recovery',
      '6. Non-pecuniary damages',
      '7. Punitive damages',
    ]);
  });

  it('preserves the judgment, appeal caveat, evidence limits, and damages qualifications', () => {
    for (const phrase of [
      'January 24, 2022',
      '109 Consumer No. 7',
      'TWD 1,579,589',
      'together with the interest stated in the judgment',
      'does not disclose the outcome of the appeal or any settlement amount',
      'this article does not independently establish the facts they describe',
      'does not automatically draw an adverse inference',
      'Reporting does not guarantee that the police or prosecutors will secure the CCTV',
      'An impairment rating alone does not fix the amount of compensation',
      'does not by itself establish the legal liability of the gym or trainer',
      'they are not procedures that must all be pursued in every case',
    ]) {
      expect(parsed.content).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('removes stale framing, Korean copy, and invisible spacer characters', () => {
    for (const stale of [
      'Hello. I am Attorney Wei Tseng',
      'Here I will answer several frequently asked questions',
      'That concludes this summary of frequently asked questions and answers',
      '**1. What legal routes may be available',
      '**5. If a gym has liability insurance',
    ]) {
      expect(parsed.content).not.toContain(stale);
    }

    expect(parsed.content).not.toMatch(/[\uac00-\ud7af]/u);
    expect(parsed.content).not.toMatch(/[\u200b\ufeff\u00a0]/u);
  });

  it('derives the final read time at 200 words per minute and resolves the alias', () => {
    const visibleWords = countVisibleEnglishWords(post?.content ?? '');
    const calculatedMinutes = Math.ceil(visibleWords / 200);

    expect(visibleWords).toBe(1_963);
    expect(calculatedMinutes).toBe(10);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes} min read`);
    expect(getColumnPost('gym-injury-lawsuit', 'en')?.slug).toBe(
      'taiwan-gym-injury-lawsuit',
    );
  });
});
