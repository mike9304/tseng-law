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

  it('describes the bundled service in natural Japanese', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      '一度散髪するだけで、ここまで充実したサービスを受けられたのですから、コストパフォーマンスは抜群でした。',
    );
    expect(raw).not.toContain('特級サービス');
  });

  it('introduces the constitutional-interpretation petition naturally', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      'そして、今日これほど多くのマッサージ店がある背景には、ある一件の憲法解釈の申立てが関係しているのかもしれません。',
    );
    expect(raw).not.toContain('一度の憲法解釈の申立て');
  });
});
