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
const jaPath = path.join(
  root,
  'src/content/columns-ja/009-taiwan-voluntary-resignation-severance.md',
);
const koRaw = fs.readFileSync(koPath, 'utf8');
const jaRaw = fs.readFileSync(jaPath, 'utf8');
const koParsed = matter(koRaw);
const jaParsed = matter(jaRaw);

const EXPECTED_JA_TITLE = '従業員が自発的に退職しても退職金を受け取れる例外';
const EXPECTED_KO_TITLE = '직원이 자발적으로 퇴사해도 퇴직금을 받을 수 있는 예외';
const EXPECTED_JA_BODY_SHA256 =
  '8c2a14d3b7f403d58d546638ede7fb5edd040df481fe7aeb225098cc8195d6f8';
const EXPECTED_VISIBLE_CHARACTER_COUNT = 1128;

function extractVisibleText(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/[*_`~]/g, '')
    .replace(/^---$/gm, '')
    .replace(/[\s\u200b]+/gu, '');
}

describe('Japanese labor column 009 mirror', () => {
  it('loads the exact Japanese and Korean article identities through the public loader', () => {
    const jaPost = getColumnPost(SLUG, 'ja');
    const koPost = getColumnPost(SLUG, 'ko');

    expect(jaPost).toBeDefined();
    expect(koPost).toBeDefined();
    expect(jaPost?.slug).toBe(SLUG);
    expect(koPost?.slug).toBe(SLUG);
    expect(jaPost?.title).toBe(EXPECTED_JA_TITLE);
    expect(koPost?.title).toBe(EXPECTED_KO_TITLE);
    expect(jaPost?.date).toBe(koPost?.date);
    expect(koParsed.data.title).toBe(EXPECTED_KO_TITLE);
    expect(koParsed.content.match(/^# .+$/gm)).toEqual([`# ${EXPECTED_KO_TITLE}`]);
    expect(jaPost?.content).toContain('第1号または第6号');
    expect(koPost?.content).toContain('제1、6항');
  });

  it('freezes the complete frontmatter, sole synchronized H1, images, and link URLs', () => {
    expect(jaParsed.data).toEqual({
      title: EXPECTED_JA_TITLE,
      url: 'https://www.wei-wei-lawyer.com/post/직원이-자발적으로-퇴사해도-퇴직금을-받을-수-있는-예외',
      lastmod: '2025-09-13',
      date_display: '2025年9月13日',
      read_time: '約2分',
      categories: ['台湾法律情報'],
      featured_image: '../images/009-taiwan-voluntary-resignation-severance/featured-01.jpeg',
    });

    expect(jaParsed.content.match(/^# .+$/gm)).toEqual([`# ${EXPECTED_JA_TITLE}`]);
    expect(
      Array.from(jaParsed.content.matchAll(/!\[[^\]]*]\(([^)]+)\)/g), (match) => match[1]),
    ).toEqual([
      '../images/009-taiwan-voluntary-resignation-severance/featured-01.jpeg',
      '../images/009-taiwan-voluntary-resignation-severance/img-01.jpeg',
    ]);
    expect(
      Array.from(jaParsed.content.matchAll(/]\((\/ko\/[^)]+)\)/g), (match) => match[1]),
    ).toEqual([
      '/ko/taiwan-litigation-lawyer',
      '/ko/korean-lawyer-in-taiwan',
      '/ko/services/labor',
    ]);
  });

  it('preserves all six exceptions in order with their exact actors and conditions', () => {
    const exceptions = Array.from(
      jaParsed.content.matchAll(/^([1-6])\. (.+)$/gm),
      (match) => `${match[1]}. ${match[2]}`,
    );

    expect(exceptions).toEqual([
      '1. 雇用主が労働契約の締結時に虚偽の意思表示をし、労働者がそれを誤信したために損害を受けるおそれがある場合',
      '2. 雇用主、雇用主の家族、雇用主の代理人が労働者に暴行を加え、または重大な侮辱となる行為をした場合',
      '3. 契約上の業務が労働者の健康に有害なおそれがあり、雇用主に改善を求めても改善されない場合',
      '4. 雇用主、雇用主の代理人、または他の労働者が法定伝染病にかかっており、一緒に働く労働者に感染させるおそれがあり、その労働者の健康に重大な危険を及ぼす場合',
      '5. 雇用主が労働契約で定めた賃金を支払わない場合、または出来高払いで賃金が算定される労働者に十分な仕事を与えない場合',
      '6. 雇用主が労働契約または労働法に違反し、労働者の権益が侵害されるおそれがある場合',
    ]);
  });

  it('locks Article 14 item 1/item 6 and the two separate 30-day starting points', () => {
    expect(jaParsed.content).toContain(
      '労働者が上記第1号または第6号の事由に基づいて労働契約を終了しようとする場合',
    );
    expect(jaParsed.content).toContain('その事由を知った日から**30日**以内に');
    expect(jaParsed.content).toContain(
      '損害が生じたことを知った日から**30日**以内に労働契約を終了しなければならない',
    );
    expect(jaParsed.content.match(/\*\*30日\*\*/g)).toHaveLength(2);
    expect(jaParsed.content).not.toMatch(/第[16]項/);
    expect(jaParsed.content).not.toContain('損害の結果を知った日');
  });

  it('freezes corrected body integrity, visible-character count, read time, and name safety', () => {
    const bodyHash = createHash('sha256').update(jaParsed.content).digest('hex');
    const visibleText = extractVisibleText(jaParsed.content);
    const visibleCharacterCount = Array.from(visibleText).length;

    expect(bodyHash).toBe(EXPECTED_JA_BODY_SHA256);
    expect(visibleCharacterCount).toBe(EXPECTED_VISIBLE_CHARACTER_COUNT);
    expect(jaParsed.data.read_time).toBe('約2分');
    expect(jaParsed.content).not.toContain('曾俊瑋');
    expect(`${jaParsed.data.title}\n${jaParsed.content}`).not.toMatch(/[\uac00-\ud7af]/);
  });
});
