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
const factSpecificParagraph =
  'そのほかの民事上・刑事上・税務上の責任は、資金移動の目的、権限、証憑、会計処理および当事者の関係などの具体的な事実によって異なります。特定の取引があったという理由だけで背任罪などが当然に成立すると断定することはできず、逆に内部承認があったという理由だけですべての責任が除外されると考えることもできません。決議書、契約書、税額の計算・申告資料、銀行取引明細および帳簿が互いに一致しているかを、取引ごとに確認しなければなりません。';
const staleCondensedFactParagraph =
  'このほかに民事上、刑事上または税務上の問題が生じるかどうかは、資金移動の目的、権限、証憑、会計処理、会社と株主との関係等の具体的な事実により異なります。';

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
    for (const paragraph of [
      article9Paragraph,
      article90Paragraph,
      factSpecificParagraph,
    ]) {
      expect(raw).toContain(paragraph);
      expect(post?.content).toContain(paragraph);
    }

    expect(post?.content).toContain(
      '会社財産は会社に帰属し、株主の個人財産ではありません。',
    );
    expect(raw).not.toContain(staleCondensedFactParagraph);
    expect(post?.content).not.toContain(staleCondensedFactParagraph);
  });

  it('covers vote thresholds, registration, tax filings, and the qualified exit process', () => {
    const sectionStart = '## 会社を恒久的に終了する手続';
    const sectionEnd = '## 債務超過や支払不能の場合';
    const extractExitProcessSection = (source: string): string => {
      const start = source.indexOf(sectionStart);
      const end = source.indexOf(sectionEnd, start);
      expect(start).toBeGreaterThanOrEqual(0);
      expect(end).toBeGreaterThan(start);
      return source.slice(start, end);
    };

    const rawSection = extractExitProcessSection(raw);
    const contentSection = extractExitProcessSection(post?.content ?? '');

    // The full translation keeps exactly seven numbered steps in this section.
    expect(rawSection.match(/^\d+\. \*\*/gm)).toHaveLength(7);
    expect(contentSection.match(/^\d+\. \*\*/gm)).toHaveLength(7);

    const requiredPhrases = [
      // 解散と清算の区別、解散登記だけでは債務は消えない
      '解散は、会社の通常の営業を終えて清算段階へ移行するための法律上の手続であり、清算は、その後に会社に残された事務と財産関係を整理する手続です。',
      '解散登記を終えただけで、すべての債務が消滅したり、会社財産が自動的に株主の財産に変わったりするわけではありません。',
      // 終了前の実査と外国人投資・銀行・外国為替資料
      '1. **終了前に現況を調査します。**',
      '投資構造と株主の送金経路、資金の国外移転に必要な銀行・外国為替資料も併せて確認します。',
      // 会社法第113条・第316条と議決定足数
      '有限公司は、会社法第113条に基づき、株主の議決権の3分の2以上の同意が必要です。',
      '股份有限公司は、会社法第316条に基づき、原則として発行済株式総数の3分の2以上を代表する株主が出席し、出席株主の議決権の過半数で決議します。',
      '公開発行会社でその出席要件に達しない場合は、発行済株式総数の過半数を代表する株主が出席し、出席株主の議決権の3分の2以上で決議できます。',
      // 公司登記辦法第4条、15日
      '会社登記規則（公司登記辦法）第4条に基づき、会社の登記事項に変更があった場合、変更後15日以内に変更登記を申請するのが原則です。',
      '解散後15日以内に、会社形態と解散原因に応じた解散の変更登記を準備します。',
      // 当期決算申告45日と発文日の翌日起算
      '主管機関の解散承認日から45日以内に当期の決算申告を行います。',
      '期間は主管機関の承認公文の発送日（発文日）の翌日から計算します。',
      // 清算人・裁判所・財産目録・貸借対照表・債権者保護
      '定款または株主の決議に基づいて清算人を選任するか、法定清算人を確認した上で、必要な事項を裁判所に届け出ます。',
      '清算人は財産目録と貸借対照表を作成し、会社の現務を終結させ、まだ回収していない債権を回収し、資産の保全・換価の方法を定めます。',
      '債務と税金を弁済し、必要な通知、公告および債権者保護の手続を進めます。',
      // 残余財産と払込資本金の区別、外国株主への送金・両替
      '債務と税金をすべて処理した後に残る残余財産だけを、適用される規定、定款および持分関係に従って株主に分配できます。',
      '残余財産は払込資本金と同じ概念ではないため、株主が当初払い込んだ金額がそのまま返還されることを前提にしてはいけません。',
      '外国株主への送金書類および両替手続も、分配前に確認します。',
      // 清算所得30日、清算終結報告、口座閉鎖・文書保存・法人格消滅
      '清算終了日から30日以内に清算所得を申告し、裁判所に必要な清算終結の報告をします。',
      '銀行口座の閉鎖、印鑑と文書の保管、税務・会計帳簿の法定保存',
      '清算終了の法的効果と法人格の消滅時点',
      // 合併・分割・破産の例外と複雑な事件
      '合併・分割・破産による解散は、通常、清算手続が免除され得ます。',
      '未解決の訴訟、長期債権、不動産、担保、従業員、滞納税額または複雑な外国人投資構造があれば、追加の手続が必要になることがあります。',
      // 特殊関係者への資産移転・債権免除
      '特殊関係者へ資産を移転したり債権を免除したりする取引は、会社と債権者に及ぼす影響を別途検討する必要があります。',
    ];

    for (const phrase of requiredPhrases) {
      expect(rawSection).toContain(phrase);
      expect(contentSection).toContain(phrase);
    }
  });

  it('covers insolvency, lawful capital reduction, and suspension without overpromising', () => {
    const sectionStart = '## 債務超過や支払不能の場合';
    const sectionEnd = '## 会社を存続させる場合の減資';
    const extractInsolvencySection = (source: string): string => {
      const start = source.indexOf(sectionStart);
      const end = source.indexOf(sectionEnd, start);
      expect(start).toBeGreaterThanOrEqual(0);
      expect(end).toBeGreaterThan(start);
      return source.slice(start, end);
    };

    const rawSection = extractInsolvencySection(raw);
    const contentSection = extractInsolvencySection(post?.content ?? '');

    // The full translation keeps exactly six paragraphs in this section.
    const countParagraphs = (section: string): number =>
      section
        .split(/\n\s*\n/)
        .filter((block) => block.trim() !== '' && !block.startsWith('## ')).length;
    expect(countParagraphs(rawSection)).toBe(6);
    expect(countParagraphs(contentSection)).toBe(6);

    const sectionPhrases = [
      // 会社法第89条と直ちに破産宣告の申立て
      insolvencyParagraph,
      // 決算日以後の債務・保証債務・訴訟上の請求・従業員関係の金額・税務調査の可能性・実際の処分価値
      '最近の財務諸表だけでなく、決算日以後に発生した債務、保証債務、訴訟上の請求、従業員関係の金額、税務調査の可能性、資産の実際の処分価値を反映しなければなりません。',
      // 債務超過と支払不能の異なる定義
      '債務超過は一般に資産と負債を比較する財務状態の問題であり、支払不能は弁済期に到来した債務を支払えるかどうかに関する問題です。',
      // 即時の現金化可能性・担保・一時的な現金不足の区別
      'すぐに現金化できない場合や担保が設定されている場合には、弁済能力は異なる評価を受けることがあります。',
      '一時的な現金不足だけですべての場合に同じ手続が適用されると断定することもできません。',
      // 特定の債権者・株主への先払いの危険、担保権・租税債権・賃金の優先関係、支払の根拠と時期の記録
      '特定の債権者や株主にのみ先に支払うと、他の債権者の利益と手続上の公平を害するおそれがあります。',
      '担保権、租税債権、賃金など債権の種類と優先関係は、適用される各法令に従って確認し、すでに行われた支払についても根拠と時期を記録しなければなりません。',
      // 旧版の案内の単純な算式の排除、実際の資料・回収可能性・売却費用・現実的な価値
      '旧版の案内に見られる単純な算式や複数の要件だけで破産申立ての可否を決めてはいけません。',
      '会社が保有する債権の回収可能性と資産の売却費用も、名目金額ではなく現実的な価値で検討しなければなりません。',
      // 新規の貸付け・増資・債務免除・債権者との合意の会計・税務上の効果と他の債権者の権利
      '新規の貸付け、増資、債務免除または債権者との合意は、それぞれ異なる会計・税務上の結果をもたらすことがあります。',
      'これらの措置がすでに生じた支払不能の問題を解消するかどうか、他の債権者の権利を侵害しないかどうか、およびその後に通常清算を続けられるかどうかを併せて判断しなければなりません。',
    ];

    for (const phrase of sectionPhrases) {
      expect(rawSection).toContain(phrase);
      expect(contentSection).toContain(phrase);
    }

    const requiredPhrases = [
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
