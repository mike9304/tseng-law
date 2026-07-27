import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const articlePath = path.join(
  process.cwd(),
  'src/content/columns-ja/006-taiwan-massage-history-law.md',
);

describe('Japanese massage column 006 — traditional barbershop service', () => {
  it('translates shaving as beard shaving rather than head shaving', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      '散髪だけでなく、ひげ剃りやフェイシャルケアなど、さまざまなサービスも提供していました。',
    );
    expect(raw).not.toContain('剃髪');
  });
});
