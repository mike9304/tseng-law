import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const articlePath = path.join(
  process.cwd(),
  'src/content/columns-en/006-taiwan-massage-history-law.md',
);

describe('English massage column 006 — fine amounts', () => {
  it('maps each fine to Mr. Lin and the two employees unambiguously', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      'Under the law at the time, Mr. Lin was fined NT$40,000, while the two employees were fined NT$10,000 and NT$20,000, respectively.',
    );
    expect(raw).not.toContain('were each fined NT$40,000');
  });

  it('describes barriers and occupational limits in natural English', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      'In Taiwan, people with visual impairments face barriers in many aspects of life, including personal development, daily activities, learning, and education, and can pursue only a very limited range of occupations.',
    );
    expect(raw).not.toContain('barriers in growth');
  });
});
