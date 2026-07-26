import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/002-withdraw-capital-taiwan-company.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('withdraw-capital-taiwan-company', 'ja');

const exitFaqAnswer =
  '会社を恒久的に終了する場合は、原則として解散登記と清算を行い、債務・税務を処理した後の残余財産を株主へ分配します。会社を存続させたまま出資を返還する場合は、会社形態に応じた減資その他の適法な手続を検討します。通常の事業経費、配当、借入金の返済等は、それぞれの法的・税務上の根拠と手続を確認する必要があります。';
const resolutionFaqAnswer =
  '有限公司の解散には株主の議決権の3分の2以上の同意が必要です。股份有限公司では、原則として発行済株式総数の3分の2以上を代表する株主が出席し、出席株主の議決権の過半数で決議します。公開発行会社で前記の出席数に達しない場合は、発行済株式総数の過半数を代表する株主が出席し、出席株主の議決権の3分の2以上で決議できます。定款により、より高い要件が定められている場合があります。解散登記は解散後15日以内に申請します。';
const suspensionFaqAnswer =
  '1か月以上休業する会社は、休業前または休業開始後15日以内に休業登記を申請し、1回の休業期間は最長1年です。ただし、休業した年度も年度の所得税申告が必要であり、税務申告が一律に不要になるわけではありません。税目、保有資産、従業員その他の事情に応じた義務を個別に確認してください。';
const article9Paragraph =
  '会社法（公司法）第9条は、会社が受け取るべき払込金（股款）について、実際には払い込まれていないのに全額払込済みと表示した場合、または登記後に払込金を株主へ返還し、もしくは株主による回収を許した場合について、5年以下の有期刑、拘留または50万以上250万新台湾ドル以下の罰金を定めています。通常の適法な会社資金の使用一般を処罰する規定ではありません。';
const article90Paragraph =
  '清算人が会社の債務を弁済する前に会社財産を株主へ分配した場合、会社法第90条により、1年以下の有期刑、拘留または6万新台湾ドル以下の罰金が科され得ます。';
const insolvencyParagraph =
  '解散後の清算は、会社の資産が負債を上回る場合だけに限られるものではありません。会社法第89条によれば、会社財産が債務を弁済するのに不足するとき、清算人は直ちに破産宣告を申し立てなければなりません。債務超過、支払不能、担保、租税債務および債権者数を確認し、通常清算を続けられるかを個別に判断します。';
const suspensionChangeParagraph =
  '休業中も、所在地、責任者、定款、資本額等に変更があれば、必要な変更登記を行います。車両や建物等を保有している場合は、地方税その他の負担も別途確認してください。恒久的に事業を終了する場合、休業は解散・清算の代わりにはなりません。';

describe('Japanese investment column 002 — company exit and capital return', () => {
  it('publishes the contracted frontmatter and exactly three exact FAQs', () => {
    expect(parsed.data.title).toBe('台湾会社を終了するとき、出資金はどう扱われますか？');
    expect(parsed.data.url).toBe(
      'https://www.wei-wei-lawyer.com/post/withdraw-capital-taiwan-company',
    );
    expect(parsed.data.lastmod).toBe('2026-07-24');
    expect(parsed.data.date_display).toBe('2025年9月13日');
    expect(parsed.data.read_time).toBe('約5分');
    expect(parsed.data.faq).toEqual([
      {
        q: '台湾会社の資金を株主へ戻すには、必ず解散・清算が必要ですか？',
        a: exitFaqAnswer,
      },
      {
        q: '会社解散の決議要件と登記期限はどうなっていますか？',
        a: resolutionFaqAnswer,
      },
      {
        q: 'すぐに解散せず、会社を休業させることはできますか？',
        a: suspensionFaqAnswer,
      },
    ]);

    expect(post?.slug).toBe('withdraw-capital-taiwan-company');
    expect(post?.title).toBe(parsed.data.title);
    expect(post?.date).toBe('2026-07-24');
    expect(post?.dateDisplay).toBe('2025年9月13日');
    expect(post?.readTime).toBe('約5分');
    expect(post?.faq).toEqual(parsed.data.faq);
  });

  it('preserves the source and both original images with substantial content', () => {
    const imagePaths = [
      '../images/002-withdraw-capital-taiwan-company/featured-01.png',
      '../images/002-withdraw-capital-taiwan-company/img-01.png',
    ];

    expect(raw).toContain(
      'https://www.wei-wei-lawyer.com/post/withdraw-capital-taiwan-company',
    );
    for (const imagePath of imagePaths) {
      expect(raw).toContain(imagePath);
    }
    expect(post?.featuredImage).toBe(
      '/images/blog/002-withdraw-capital-taiwan-company/featured-01.png',
    );
    expect(raw.length).toBeGreaterThan(3_500);
    expect(post?.content.length).toBeGreaterThan(2_500);
  });

  it('states the narrow Article 9 rule, Article 90 safeguard, and fact-specific consequences', () => {
    for (const paragraph of [article9Paragraph, article90Paragraph]) {
      expect(raw).toContain(paragraph);
      expect(post?.content).toContain(paragraph);
    }

    expect(post?.content).toContain(
      'このほかに民事上、刑事上または税務上の問題が生じるかどうかは、資金移動の目的、権限、証憑、会計処理、会社と株主との関係等の具体的な事実により異なります。',
    );
    expect(post?.content).toContain(
      '会社財産は会社に帰属し、株主の個人財産ではありません。',
    );
  });

  it('covers vote thresholds, registration, tax filings, and the qualified exit process', () => {
    const requiredPhrases = [
      '有限公司の解散には株主の議決権の3分の2以上の同意が必要です。',
      '発行済株式総数の3分の2以上を代表する株主が出席し、出席株主の議決権の過半数で決議します。',
      '公開発行会社で前記の出席数に達しない場合は、発行済株式総数の過半数を代表する株主が出席し、出席株主の議決権の3分の2以上で決議できます。',
      '定款により、より高い要件が定められている場合があります。',
      '会社登記規則（公司登記辦法）第4条',
      '解散登記は解散後15日以内に申請します。',
      '主管機関が解散を承認した日から45日以内に当期の決算申告を行います。',
      '清算が終了した日から30日以内に清算所得申告を行い',
      '清算人を選任または確認し、裁判所への報告を行います。',
      '財産目録と貸借対照表を作成し、現務を終結させ、債権を回収し、債務と租税を弁済し、必要な債権者保護手続を進めます。',
      '債務と租税を処理した後に残る残余財産だけを',
      '合併、分割または破産による解散では、通常の清算手続が適用されない場合があります。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('covers insolvency, lawful capital reduction, and suspension without overpromising', () => {
    const requiredPhrases = [
      insolvencyParagraph,
      '会社を終了せずに出資の一部を株主へ返す方法として、減資を検討できる場合があります。',
      '会社形態に応じた決議、債権者保護、資本額の検証と会計処理、外国投資、税務、送金および変更登記の各手続を確認する必要があります。',
      suspensionFaqAnswer,
      suspensionChangeParagraph,
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses only the contracted Japanese links and removes every stale claim', () => {
    const expectedLinks = [
      '[台湾投資・会社設立サービス](/ja/services#investment)',
      '[台湾会社設立の基礎](/ja/columns/taiwan-company-establishment-basics)',
      '[お問い合わせ](/ja/contact)',
    ];
    const actualLinks = Array.from(
      raw.matchAll(/\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => ({
        markdown: match[0],
        href: match[1],
      }),
    );

    expect(actualLinks).toEqual(
      expectedLinks.map((markdown) => ({
        markdown,
        href: markdown.match(/\(([^)]+)\)$/)?.[1],
      })),
    );
    expect(actualLinks.every(({ href }) => href.startsWith('/ja/'))).toBe(true);

    const forbiddenLiterals = [
      '残余財産（資本金）',
      '資本金（残余財産）',
      '刑法上の背任罪',
      '会社の資産が負債より大きいときのみ',
      '清算できる財産があり複数の債権者がいるという2つの要件',
      '次の期には税務申告をしなくてもよい',
      '営業停止処分',
      '会社登記法第4条',
      '直接韓国へ送金',
      '/ko/',
    ];

    for (const claim of forbiddenLiterals) {
      expect(raw).not.toContain(claim);
    }
    expect(raw).not.toMatch(/会社資金を直接持ち出すと[^]*?第9条/);
    expect(raw).not.toMatch(/貸付金(?:の)?返済/);
    expect(raw).not.toMatch(/清算は、?会社の資産が負債を上回る場合にのみ/);
    expect(raw).not.toMatch(/資産が負債を上回る場合だけ、?清算/);
    expect(raw).not.toMatch(/清算[^。]*(?:約|およそ)\s*[0-9一二三四五六七八九十]+(?:か月|年)/);
  });

  it('contains no Hangul in the Japanese title or rendered body', () => {
    const hangul = /[\uac00-\ud7af]/;

    expect(parsed.data.title).not.toMatch(hangul);
    expect(post?.title).not.toMatch(hangul);
    expect(post?.content).not.toMatch(hangul);
  });
});
