import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const articlePath = path.join(
  process.cwd(),
  'src/content/columns-ja/006-taiwan-massage-history-law.md',
);

describe('Japanese massage column 006 — traditional barbershop service', () => {
  it('opens with a natural nostalgic question about old-fashioned barbershops', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      '皆さまは、台湾の昔ながらの理髪店を覚えていらっしゃいますか？',
    );
    expect(raw).not.toContain('理髪店の時代を経験した');
    expect(raw).not.toContain('昔ながらの伝統的な理髪店');
  });

  it('describes the shampoo-and-massage feature in natural Japanese', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      'さらに、座ったままシャンプーをしてもらいながら、頭皮や肩、首のマッサージも受けられるのが大きな特徴でした。',
    );
    expect(raw).not.toContain('重要なのは');
    expect(raw).not.toContain('シャンプーを受けながら');
  });

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

  it('uses a natural conversational aside for the age joke', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain('（年齢がバレてしまったでしょうか？）');
    expect(raw).not.toContain('つい年齢を明かしてしまったでしょうか');
  });

  it('describes sexual harassment and indecent conduct without overcharging the offense', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      '施術中のセクシャルハラスメントやわいせつ行為は後を絶ちません。',
    );
    expect(raw).not.toContain('セクシャルハラスメントや性的暴行');
    expect(raw).not.toContain('わいせつ行為の事件');
  });

  it('describes streets lined with massage shops without a literal compound', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      '台湾には、さまざまなマッサージ店が軒を連ねる通りが多くあります。',
    );
    expect(raw).not.toContain('マッサージ通り');
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

  it('describes the occupational-rights debate without calqued phrasing', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      'こうした視覚障害者と非視覚障害者の職業上の権利をめぐる論争のなかで、多くの反対意見が出ました。',
    );
    expect(raw).not.toContain('議論の過程では');
  });

  it('states the gradually emerging occupational-rights concern naturally', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      '次第に、視覚障害者の権利だけを保護する一方で、非視覚障害者の職業上の権利を過度に制限しているという意見が提起されるようになりました。',
    );
    expect(raw).not.toContain('非視覚障害者の職業の権利');
  });

  it('uses standard statutory-penalty phrasing for the Korea sentences', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      '韓国の「医療法」により3年以下の懲役に処されることがあります。',
    );
    expect(raw).toContain(
      '非視覚障害者がマッサージ業を経営する場合は、5年以下の懲役に処されることがあります。',
    );
    expect(raw).not.toContain('最高で3年以下');
    expect(raw).not.toContain('最高で5年以下');
    expect(raw).toContain('3年以下');
    expect(raw).toContain('5年以下');
  });

  it('advises speaking up about discomfort or something feeling wrong during a massage', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      '台湾でマッサージを受けているときに、不快感や違和感を覚えたら、',
    );
    expect(raw).not.toContain('マッサージの過程に');
    expect(raw).toContain('不快感');
    expect(raw).toContain('違和感');
    expect(raw).toContain(
      'すぐに伝えたり中止を求めたりして、自分を守るべきです。',
    );
  });

  it('states the cross-country rights-balance conclusion naturally', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      'これにより、各国がさまざまな集団の権益を保護するために、それぞれ異なるアプローチを取っていることがわかります。',
    );
    expect(raw).toContain(
      '立法者は利益の衝突を解決するため、より均衡のとれた解決策を見つけようと努力しています。',
    );
    expect(raw).not.toContain('互いに異なるアプローチ');
    expect(raw).not.toContain('相対的に均衡のとれた解決策');
  });
});
