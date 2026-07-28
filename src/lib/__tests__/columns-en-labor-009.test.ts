import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const SLUG = 'taiwan-voluntary-resignation-severance';
const root = process.cwd();
const koPath = path.join(
  root,
  'src/content/columns/009-taiwan-voluntary-resignation-severance.md',
);
const enPath = path.join(
  root,
  'src/content/columns-en/009-taiwan-voluntary-resignation-severance.md',
);
const koRaw = fs.readFileSync(koPath, 'utf8');
const enRaw = fs.readFileSync(enPath, 'utf8');
const koParsed = matter(koRaw);
const enParsed = matter(enRaw);

const EXPECTED_EN_TITLE =
  'Exceptions Where Employees Can Still Receive Severance After Voluntary Resignation';
const EXPECTED_KO_TITLE =
  '직원이 자발적으로 퇴사해도 퇴직금을 받을 수 있는 예외';
const EXPECTED_EN_BODY_SHA256 =
  '9649f8654e1c8c400737ea19497b44a0b3e29647ea9e8c13001864d4c2cae5c5';
const EXPECTED_VISIBLE_WORD_COUNT = 469;

function extractDestinations(content: string, pattern: RegExp): string[] {
  return Array.from(content.matchAll(pattern), (match) => match[1]);
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

describe('English labor column 009 mirror', () => {
  it('loads the exact English and Korean article identities through the public loader', () => {
    const enPost = getColumnPost(SLUG, 'en');
    const koPost = getColumnPost(SLUG, 'ko');

    expect(enPost).toBeDefined();
    expect(koPost).toBeDefined();
    expect(enPost?.slug).toBe(SLUG);
    expect(koPost?.slug).toBe(SLUG);
    expect(enPost?.title).toBe(EXPECTED_EN_TITLE);
    expect(koPost?.title).toBe(EXPECTED_KO_TITLE);
    expect(enPost?.date).toBe(koPost?.date);
    expect(koParsed.data.title).toBe(EXPECTED_KO_TITLE);
    expect(koParsed.content.match(/^# .+$/gm)).toEqual([
      `# ${EXPECTED_KO_TITLE}`,
    ]);
    expect(enPost?.content).toContain('either ground 1 or 6');
    expect(koPost?.content).toContain('제1、6항');
  });

  it('freezes the complete frontmatter, sole synchronized H1, images, and link URLs', () => {
    expect(enParsed.data).toEqual({
      title: EXPECTED_EN_TITLE,
      url: 'https://www.wei-wei-lawyer.com/post/직원이-자발적으로-퇴사해도-퇴직금을-받을-수-있는-예외',
      lastmod: '2025-09-13',
      date_display: 'September 13, 2025',
      read_time: '3 min read',
      categories: ['Taiwan Legal Information'],
      featured_image:
        '../images/009-taiwan-voluntary-resignation-severance/featured-01.jpeg',
    });

    expect(enParsed.content.match(/^# .+$/gm)).toEqual([
      `# ${EXPECTED_EN_TITLE}`,
    ]);
    expect(
      extractDestinations(enParsed.content, /!\[[^\]]*]\(([^)]+)\)/g),
    ).toEqual(
      extractDestinations(koParsed.content, /!\[[^\]]*]\(([^)]+)\)/g),
    );
    expect(
      extractDestinations(enParsed.content, /(?<!!)\[[^\]]+]\(([^)]+)\)/g),
    ).toEqual([
      '/en/taiwan-litigation-lawyer',
      '/en/korean-lawyer-in-taiwan',
      '/en/services/labor',
    ]);
  });

  it('preserves all six exceptions in order with their exact actors and conditions', () => {
    const exceptions = Array.from(
      enParsed.content.matchAll(/^([1-6])\. (.+)$/gm),
      (match) => `${match[1]}. ${match[2]}`,
    );

    expect(exceptions).toEqual([
      '1. Where, when entering into the labor contract, the employer makes a false representation that misleads the employee and creates a risk that the employee will suffer harm',
      '2. Where the employer, a member of the employer’s family, or the employer’s agent assaults or seriously insults the employee',
      '3. Where the work specified in the contract may harm the employee’s health and the employer fails to remedy the situation after the employee asks the employer to do so',
      '4. Where the employer, the employer’s agent, or another employee has a notifiable communicable disease that may be transmitted to employees working alongside that person and poses a serious risk to the employee’s health',
      '5. Where the employer fails to pay the wages required under the labor contract or fails to provide sufficient work to an employee paid on a piece-rate basis',
      '6. Where the employer breaches the labor contract or violates labor law, creating a risk that the employee’s rights and interests will be harmed',
    ]);
  });

  it('locks grounds 1 and 6 and the two separate 30-day starting points', () => {
    expect(enParsed.content).toContain(
      'terminate the labor contract on either ground 1 or 6 above',
    );
    expect(enParsed.content).toContain(
      'within **30 days** after becoming aware of the circumstances',
    );
    expect(enParsed.content).toContain(
      'within **30 days** after becoming aware of the resulting harm',
    );
    expect(enParsed.content.match(/\*\*30 days\*\*/g)).toHaveLength(2);
  });

  it('freezes corrected body integrity, word count, read time, and name safety', () => {
    const post = getColumnPost(SLUG, 'en');
    const bodyHash = createHash('sha256')
      .update(enParsed.content)
      .digest('hex');
    const visibleWordCount = countVisibleEnglishWords(post?.content ?? '');
    const calculatedMinutes = Math.ceil(visibleWordCount / 200);

    expect(bodyHash).toBe(EXPECTED_EN_BODY_SHA256);
    expect(visibleWordCount).toBe(EXPECTED_VISIBLE_WORD_COUNT);
    expect(calculatedMinutes).toBe(3);
    expect(enParsed.data.read_time).toBe(`${calculatedMinutes} min read`);
    expect(post?.readTime).toBe('3 min read');
    expect(enParsed.content).not.toContain('曾俊瑋');
    expect(enParsed.content).not.toMatch(/[\uac00-\ud7af]/u);
  });
});
