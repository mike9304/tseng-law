import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { JA_KOU_BANNED, JA_KOU_NEW, JA_KOU_REUSED } from '../ja-copy';
import { SUKASHI_PAIRS } from '../sukashi-pairs';

const read = (file: string) => readFileSync(path.join(process.cwd(), file), 'utf8');

describe('ja home copy registry (CONCEPT-V2 §13, §15.4)', () => {
  it('quotes every reused string verbatim from its cited source', () => {
    for (const [key, entry] of Object.entries(JA_KOU_REUSED)) {
      expect(read(entry.source), `${key} in ${entry.source}`).toContain(entry.text);
    }
  });

  it('quotes each 透かし term and rendering verbatim on its cited line', () => {
    for (const pair of SUKASHI_PAIRS) {
      const line = read(pair.source.file).split('\n')[pair.source.line - 1] ?? '';
      expect(line, `${pair.term} @ ${pair.source.file}:${pair.source.line}`).toContain(pair.term);
      expect(line, `${pair.rendering} @ ${pair.source.file}:${pair.source.line}`).toContain(pair.rendering);
    }
  });

  it('does not use 資遣費 → 退職金 (the site uses 退職金 for two different things)', () => {
    expect(SUKASHI_PAIRS.map((pair) => pair.term)).not.toContain('資遣費');
  });

  it('keeps every new string free of banned words, digits and phone numbers', () => {
    for (const [key, text] of Object.entries(JA_KOU_NEW)) {
      for (const banned of JA_KOU_BANNED) expect(text, `${key} contains ${banned}`).not.toContain(banned);
      expect(text, `${key} digit`).not.toMatch(/[0-9０-９]/);
      expect(text, `${key} phone`).not.toMatch(/\+?\d[\d\s-]{6,}/);
    }
  });

  it('has exactly the new strings the ledger lists (9 here plus the 4 tab labels cut from existing titles)', () => {
    expect(Object.keys(JA_KOU_NEW)).toHaveLength(9);
  });
});
