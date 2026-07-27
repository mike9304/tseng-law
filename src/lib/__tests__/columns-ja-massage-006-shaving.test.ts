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

  it('describes the barbershops as a shared cultural memory naturally', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      'こうした台湾式の理髪店は、多くの台湾人の心に、独特の文化的な記憶として残っています。',
    );
    expect(raw).not.toContain('この台湾式理髪店');
    expect(raw).not.toContain('多くの台湾の人々');
  });

  it('introduces the constitutional-interpretation petition naturally', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      'そして、今日これほど多くのマッサージ店がある背景には、ある一件の憲法解釈の申立てが関係しているのかもしれません。',
    );
    expect(raw).not.toContain('一度の憲法解釈の申立て');
  });

  it('uses Japanese currency units and preserves each fine amount', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      '当時の法律に基づき、林氏には4万新台湾ドル、2名の従業員にはそれぞれ1万新台湾ドルと2万新台湾ドルの罰金が科されました。',
    );
    expect(raw).not.toContain('万元');
  });

  it('describes barriers faced by visually impaired people naturally', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      '台湾では、視覚障害者は成長過程や日常生活、学習、教育など、さまざまな場面で多くの障壁に直面しており、従事できる職業も非常に限られています。',
    );
    expect(raw).not.toContain('多くの面で障害があり');
  });

  it('preserves protection, employment opportunities, and the right to livelihood', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      'したがって当時の立法者は、社会的に弱い立場に置かれていた視覚障害者を保護し、その就業機会と生存権を保障するための法律を制定したのです。',
    );
    expect(raw).not.toContain('弱者である視覚障害者');
    expect(raw).not.toContain('視覚障害者に仕事と生存権');
  });
});
