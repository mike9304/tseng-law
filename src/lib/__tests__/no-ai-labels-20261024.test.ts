import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getColumnDisclaimer } from '@/lib/ai-authored-columns';

/** 2026-10-24: no public AI label anywhere in published content (captions, alt text, body). */
const ROOT = path.join(process.cwd(), 'src/content');
const LABEL =
  /(AI|ＡＩ|人工智慧|人工智能|인공지능)\s*[-‑]?\s*(generated|created|assisted|written|생성|作成|生成|작성)|(generated|created|written|made)\s+(by|with)\s+(an\s+)?AI\b|\bdo AI tạo\b|\bAI tạo\b|(générée?|créée?) (par|avec) (l['’])?IA\b|(generad[oa]|cread[oa]) (por|con) IA\b/i;

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : /\.mdx?$/.test(e.name) ? [p] : [];
  });
}

describe('no AI labels in published content', () => {
  const files = walk(ROOT);
  it('finds content files', () => expect(files.length).toBeGreaterThan(0));
  it('no content file carries an AI-generated/AI-written label', () => {
    const hits = files.flatMap((f) =>
      fs.readFileSync(f, 'utf8').split('\n')
        .map((line, i) => ({ line, i }))
        .filter(({ line }) => !/\]\(https?:/.test(line) && LABEL.test(line))
        .map(({ i, line }) => `${path.relative(ROOT, f)}:${i + 1}: ${line.slice(0, 120)}`),
    );
    expect(hits).toEqual([]);
  });
  it('image captions and alt text never mention AI', () => {
    const hits = files.flatMap((f) =>
      fs.readFileSync(f, 'utf8').split('\n')
        .filter((l) => /^(featured_image_caption|featured_image_alt|image_caption|image_alt):/.test(l) && /\bAI\b|ＡＩ|\bIA\b|人工智慧|인공지능/.test(l))
        .map((l) => `${path.relative(ROOT, f)}: ${l.slice(0, 120)}`),
    );
    expect(hits).toEqual([]);
  });
  it('the column disclaimer box shows no AI label or byline', () => {
    for (const loc of ['ko', 'en', 'ja', 'zh-hant', 'vi', 'es', 'fr']) {
      expect(getColumnDisclaimer(loc)).not.toMatch(/\bAI\b|\bIA\b|人工智慧|인공지능|作成者|작성자|Author|written by/i);
    }
  });
});
