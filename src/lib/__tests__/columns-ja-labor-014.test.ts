import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/014-taiwan-mandatory-employment-period.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const canonicalSlug = 'taiwan-mandatory-employment-period';
const post = getColumnPost(canonicalSlug, 'ja');
const aliasPost = getColumnPost('mandatory-employment', 'ja');

const title = '台湾の最低勤務期間条項：効力・研修費・違約金の判断基準';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-mandatory-employment-period';
const featuredImage =
  '../images/014-taiwan-mandatory-employment-period/featured-01.jpg';
const bodyImage = `![労働契約の最低勤務期間と費用返還の問題を説明する画像](${featuredImage})`;
const faq1Answer =
  'いいえ。台湾労働基準法第15条の1によれば、使用者が専門技術研修を実施して費用を負担した場合、または労働者が最低勤務期間を遵守するよう合理的な補償を提供した場合には、最低勤務期間条項の法定要件を満たす可能性があります。二つの要件を両方とも満たす必要はありませんが、いずれか一方を満たしていても、研修の期間と費用、代替人員の確保可能性、補償の額と範囲など、諸事情に照らして条項が合理的な範囲を超えてはなりません。';
const faq2Answer =
  '台湾労働部の2026年6月5日付指針によれば、定例研修、一般的な職務研修、新入社員の業務適応研修、および法令上実施しなければならない義務研修の費用は、最低勤務期間条項や違約金・費用返還請求の根拠にすることができません。研修の名称だけでなく、具体的な課程、専門的・技術的な内容、期間、使用者が実際に負担した費用とその証拠を確認する必要があります。';
const faq3Answer =
  '常に全額を返還するわけではありません。入社一時金、勤続奨励金その他の前払給付が最低勤務期間条項の合理的な補償として支払われた場合は、その目的が労働者に明確に告知されていなければなりません。台湾労働部の2026年6月5日付指針は、期間満了前に退職した場合の返還額を未履行期間に応じて計算し、全額返還を求めてはならないと説明しています。実際の結論は、支給目的、条項の内容、既に勤務した期間および契約終了の理由を併せて検討する必要があります。';
const faq4Answer =
  '台湾労働基準法第15条の1第4項は、労働者の責めに帰すことのできない事由により最低勤務期間の満了前に労働契約が終了した場合、労働者は最低勤務期間条項の違反責任も研修費の返還責任も負わないと定めています。ただし、契約終了の理由と帰責性は、解雇通知、退職の意思表示、労働条件違反に関する資料など、具体的な証拠に基づいて判断する必要があります。';
const faq = [
  {
    q: '台湾の労働契約における最低勤務期間条項は、自動的に無効となりますか？',
    a: faq1Answer,
  },
  {
    q: '新入社員研修や法令上義務付けられた研修も、専門技術研修に該当しますか？',
    a: faq2Answer,
  },
  {
    q: '期間満了前に退職すると、入社一時金や勤続奨励金を全額返還しなければなりませんか？',
    a: faq3Answer,
  },
  {
    q: '労働者の責めに帰すことのできない事由で契約が早期に終了しても、研修費を返還しなければなりませんか？',
    a: faq4Answer,
  },
];
const headings = [
  '最低勤務期間条項が有効になる条件',
  '研修を根拠にする場合',
  '補償を根拠にする場合',
  '合理性を測る四つの要素',
  '根拠にならない研修',
  '奨励金の返還と期間満了前の退職',
  '労働者の責めに帰すことのできない事由による契約終了',
  '退職予告と契約が終わる時期',
  '契約書のほかに必要な資料',
  '関連情報',
  '公式資料',
];
const relatedHeading = headings[9];
const officialHeading = headings[10];
const officialLinks = [
  '[台湾全国法規資料庫：労働基準法第15条の1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=15-1&pcode=N0030001)',
  '[台湾全国法規資料庫：労働基準法第15条](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=15&pcode=N0030001)',
  '[台湾全国法規資料庫：労働基準法第16条](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=16&pcode=N0030001)',
  '[台湾労働部：2026年6月5日付最低勤務期間・違約金返還指針](https://laws.mol.gov.tw/FLAW/FLAWDOC03.aspx?cnt=926&datatype=etype&edate=99991231&lnabndn=1&now=1&recordno=10&sdate=20180000)',
];
const officialUrls = officialLinks.map(
  (link) => link.match(/\((https?:\/\/[^)]+)\)$/)?.[1] ?? '',
);
const internalLinks = [
  '[台湾労働法サービス](/ja/services/labor)',
  '[自己都合退職と退職金（資遣費）の例外に関する案内](/ja/columns/taiwan-voluntary-resignation-severance)',
  '[お問い合わせ](/ja/contact)',
];
const internalTargets = [
  '/ja/services/labor',
  '/ja/columns/taiwan-voluntary-resignation-severance',
  '/ja/contact',
];
const disclaimer =
  '本稿は、台湾の最低勤務期間条項、研修費と前払給付の返還、退職予告を一般的に説明する教育目的の資料で、個別の労働事件に関する法的助言ではありません。契約の種類と文言、実際の研修と費用、補償の目的と告知、勤務期間、契約終了の原因、証拠によって、条項の効力と責任の範囲は異なることがあります。退職の意思表示、賃金からの控除、返還の合意、紛争への対応に進む前に、最新の公式資料と個別の事情を確認してください。';
const author = '曾雋崴弁護士（Wei Tseng）';
const exactEnding = `- ${officialLinks[3]}

---

${disclaimer}

${author}`;
const expectedFrontmatter = `---
title: "${title}"
url: "${sourceUrl}"
lastmod: "2026-10-06"
date_display: "2025年9月13日"
read_time: "約16分"
categories:
  - "台湾法律情報"
featured_image: "${featuredImage}"
faq:
  - q: "台湾の労働契約における最低勤務期間条項は、自動的に無効となりますか？"
    a: "${faq1Answer}"
  - q: "新入社員研修や法令上義務付けられた研修も、専門技術研修に該当しますか？"
    a: "${faq2Answer}"
  - q: "期間満了前に退職すると、入社一時金や勤続奨励金を全額返還しなければなりませんか？"
    a: "${faq3Answer}"
  - q: "労働者の責めに帰すことのできない事由で契約が早期に終了しても、研修費を返還しなければなりませんか？"
    a: "${faq4Answer}"
---
`;

function sectionBody(content: string, heading: string) {
  const sectionStart = content.indexOf(`## ${heading}`);
  const nextSection = content.indexOf('\n## ', sectionStart + 1);
  return content.slice(
    sectionStart,
    nextSection === -1 ? content.length : nextSection,
  );
}

function extractPublicText(content: string) {
  return content
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^---$/gm, '')
    .replace(/[「」『』“”‘’*_`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function orderedPresence(content: string, values: string[]) {
  let previousIndex = -1;
  for (const value of values) {
    const index = content.indexOf(value);
    expect(index).toBeGreaterThan(previousIndex);
    previousIndex = index;
  }
}

describe('Japanese labor column 014 — minimum-service-period clauses', () => {
  it('1. publishes the exact complete frontmatter and four ordered FAQs', () => {
    const closingFrontmatter = raw.indexOf('\n---\n', 4);

    expect(raw.slice(0, closingFrontmatter + 5)).toBe(expectedFrontmatter);
    expect(parsed.data).toEqual({
      title,
      url: sourceUrl,
      lastmod: '2026-10-06',
      date_display: '2025年9月13日',
      read_time: '約16分',
      categories: ['台湾法律情報'],
      featured_image: featuredImage,
      faq,
    });
    expect(parsed.data.faq).toHaveLength(4);
    expect(parsed.data.url).toBe(sourceUrl);
  });

  it('2. uses one canonical H1 and the exact opening image sequence', () => {
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(parsed.content.startsWith(`\n# ${title}\n\n${bodyImage}\n\n`)).toBe(
      true,
    );
  });

  it('3. uses one body image and preserves renderer image handling', () => {
    const bodyImages = Array.from(
      parsed.content.matchAll(/!\[[^\]]*\]\([^)]+\)/g),
      (match) => match[0],
    );

    expect(bodyImages).toEqual([bodyImage]);
    expect(raw.split(featuredImage)).toHaveLength(3);
    expect(raw).not.toContain('img-01.jpg');
    expect(post?.featuredImage).toBe(
      '/images/blog/014-taiwan-mandatory-employment-period/featured-01.jpg',
    );
    expect(post?.content).not.toMatch(/!\[[^\]]*\]\([^)]+\)/);
  });

  it('4. uses exactly eleven ordered H2s and two ordered H3s', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(headings);
    expect(
      Array.from(parsed.content.matchAll(/^### (.+)$/gm), (match) => match[1]),
    ).toEqual(['使用者の側', '労働者の側']);
  });

  it('5. keeps each FAQ answer in the front matter and carries its legal facts in the assigned H2', () => {
    const assignments: Array<[string, string, string[]]> = [
      [
        headings[0],
        faq1Answer,
        [
          '台湾労働基準法第15条の1第1項が、どちらか一方を選べる形で定めています。',
          'どちらか一方を満たせば、条項は法定要件を満たす可能性があります。両方そろえる必要はありません。',
          '第2項に基づき、条項の期間と責任の範囲が合理的かどうかを、研修の期間と費用、代替人員の確保可能性、補償の額と範囲などの諸事情に照らして判断します。',
        ],
      ],
      [
        headings[4],
        faq2Answer,
        [
          '2026年6月5日付の台湾労働部指針によれば、定例研修、一般的な職務研修、新入社員の業務適応研修、法令上実施しなければならない義務研修の費用は、最低勤務期間条項や違約金・費用返還請求の根拠にできません。',
          '研修の名称だけでなく、具体的な課程、専門的・技術的な内容、期間、使用者が実際に負担した費用とその証拠まで確認します。',
        ],
      ],
      [
        headings[5],
        faq3Answer,
        [
          '常に全額とは限りません。',
          '入社一時金、勤続奨励金その他の前払給付が最低勤務期間条項の合理的な補償として支払われた場合は、その目的が労働者に明確に告知されていなければなりません。',
          '2026年6月5日付の台湾労働部指針は、期間満了前に退職した場合の返還額を未履行期間に応じて計算し、全額の返還を求めてはならないと説明しています。',
          '結論を出すには、支給目的、条項の内容、すでに勤務した期間、契約終了の理由を併せて検討します。',
        ],
      ],
      [
        headings[6],
        faq4Answer,
        [
          '台湾労働基準法第15条の1第4項は、労働契約が最低勤務期間の満了前に終了した場合について定めています。',
          '終了が労働者の責めに帰すことのできない事由によるときは、労働者は最低勤務期間条項の違反責任も研修費の返還責任も負いません。',
          'ただし、契約終了の理由と帰責性は、解雇通知、退職の意思表示、労働条件違反に関する資料など、具体的な証拠に基づいて判断します。',
        ],
      ],
    ];

    for (const [heading, answer, bodyFacts] of assignments) {
      const section = sectionBody(parsed.content, heading);

      expect(raw).toContain(answer);
      for (const fact of bodyFacts) {
        expect(section).toContain(fact);
        expect(sectionBody(post?.content ?? '', heading)).toContain(fact);
      }
    }
  });

  it('6. locks the source-matching introduction and four review questions', () => {
    const introduction = parsed.content.slice(
      parsed.content.indexOf(bodyImage) + bodyImage.length,
      parsed.content.indexOf(`## ${headings[0]}`),
    );
    const orderedQuestions = [
      '1. 条項自体が第15条の1の法定要件を満たすか',
      '2. 条項の期間と労働者の負担が合理的な範囲内にあるか',
      '3. 契約終了の理由がどちらの当事者に帰属するか',
      '4. 退職予告と返還の範囲をどのように判断するか',
    ];

    expect(introduction).toContain(
      '署名した最低勤務期間条項は、そのまま有効なのでしょうか？',
    );
    expect(introduction).toContain(
      '台湾の労働契約では、期間満了前に辞めたとき、研修費・入社一時金・勤続奨励金を返す義務があるのか、別に違約金を請求できるのかも、同じ条項で定める形が使われます。',
    );
    expect(introduction).toContain(
      '条項の効力も返還額も、法定要件と、実際の支給・研修・契約終了の経緯を順に確かめて、はじめて見えてきます。契約書上の名称は、決め手になりません。',
    );
    expect(introduction).toContain('一つの条項に、四つの問題が重なっています。');
    orderedPresence(introduction, orderedQuestions);
    expect(introduction).toContain(
      '同じ契約書に並んでいても、適用される条文も必要な証拠も問題ごとに違います。',
    );
    expect(parsed.content).not.toContain('最低服務年限');
  });

  it('7. separates alternative statutory bases, scope review, and paragraph 3 voidness', () => {
    const section = sectionBody(parsed.content, headings[0]);
    const requiredPhrases = [
      '台湾労働基準法第15条の1第1項が、どちらか一方を選べる形で定めています。',
      '一つは、使用者が専門技術研修を行い、その費用を負担した場合です。',
      'もう一つは、最低勤務期間を守らせるために、使用者が合理的な補償を提供した場合です。',
      '要件を一つ満たしても、そこで終わりません。第15条の1は、あわせて合理性の審査を求めています。',
      '要件の一つを契約書に形式的に書き込んだだけで、条項全体が自動的に有効になることもありません。',
      '第1項の要件か第2項の合理性の基準に反する条項は、第3項により無効です。',
      'すべての最低勤務期間条項を最初から一律に有効、または無効と決める規定ではありません。',
      '署名は、合意があったことを示す資料にはなり得ます。法定要件の代わりにはなりません。',
      '見るのは、どんな投資や補償があり、なぜその期間にしたのか、です。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('8. locks all professional-technical-training proof items and qualifications', () => {
    const section = sectionBody(parsed.content, headings[1]);
    const requiredPhrases = [
      '使用者が当該労働者に専門技術研修を実際に提供し、費用を負担していなければなりません。',
      'テーマ、職務に必要な専門性・技術性、具体的な期間、修了の有無、実際の費用の支出',
      '外部講師料、教育機関の受講料、教材・機器の使用料',
      '使用者が主張する内部費用の算定根拠',
      '通常の監督や業務の引継ぎと何が違うのか',
      '推定額や一律に配賦した金額だけでは、実際の負担を証明したことになりません。',
      '課程表、研修日程、出席簿、評価結果、修了証、請求書、領収書',
      '使用者と教育機関の契約、支払伝票、返金条件',
      '最終的に誰が負担したのかも区別します。',
      '社内研修でも、専門的・技術的な内容と相当な投資が証明されることがあります。',
      '高額・長期というだけで法定要件を満たすと認めることも、してはなりません。',
      '条項の期間と研修への投資の関係も、説明できなければなりません。',
      'すでにどれだけ勤務したかも、負担の範囲を判断する資料になります。',
    ];

    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it('9. locks reasonable-compensation purpose, disclosure, timing, vesting, and formula', () => {
    const section = sectionBody(parsed.content, headings[2]);
    const requiredPhrases = [
      '最低勤務期間を守るという約束に対して、使用者が合理的な補償を提供することです。',
      '通常の賃金や本来支払うべき労務の対価とは別の目的と仕組み',
      '支払明細に入社一時金、勤続奨励金、前払給付と書かれていても、法的性質はそれで決まりません。',
      '採用のための一般的な賃金条件なのか。特定期間の勤続の約束に対する対価なのか。成果を達成した報酬なのか。',
      '支給日、金額、権利が確定する時期、勤続期間との関係、返還事由、計算式',
      'その役割を明確に告知しなければなりません。',
      '賃金の一部を補償に分類し直したりしても、契約当時の告知に代えるのは困難です。',
      'すでに勤務した期間に対応する部分はどう帰属するのか、返還の範囲は過大でないか。',
      'どんな長さの勤続期間も、どんな額の返還責任も、無制限に許されるわけではありません。',
    ];

    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it('10. locks four exact scope factors and individualized proportionality', () => {
    const section = sectionBody(parsed.content, headings[3]);
    const orderedFactors = [
      '1. 専門技術研修の期間と費用',
      '2. 同一または類似の職務に就く労働者の代替可能性',
      '3. 補償の額と範囲',
      '4. その他、合理性に影響する事情',
    ];

    orderedPresence(section, orderedFactors);
    for (const phrase of [
      '項目別の証拠、労働者ごとの帰属額、研修で得た能力、すでに回収された投資部分',
      '採用が難しいという使用者の主張だけでは決まりません。',
      '必要な資格と熟練度は何か、通常の採用期間はどのくらいか',
      'いつ支給され、どんな条件で労働者の権利として確定するのか',
      '考慮すべき事情も、ここに挙げた例に限りません。',
      '条項を結んだ経緯、業務の性質、当事者に説明された内容、実際の勤務期間、契約終了の理由',
      '条項の期間、使用者の実際の投資、代替人員を確保する難しさ、労働者が受けた補償、返還の負担の間には、納得できる比例関係が必要です。',
      '別の事件の結論をそのまま当てはめることもできません。',
    ]) {
      expect(section).toContain(phrase);
    }
  });

  it('11. locks excluded training, mixed programs, and Ministry attribution', () => {
    const section = sectionBody(parsed.content, headings[4]);
    const orderedCategories = [
      '定例研修',
      '一般的な職務研修',
      '新入社員の業務適応研修',
      '法令上実施しなければならない義務研修',
    ];

    orderedPresence(section, orderedCategories);
    for (const phrase of [
      '2026年6月5日付の台湾労働部指針によれば',
      '最低勤務期間条項や違約金・費用返還請求の根拠にできません。',
      '勞動關2字第1150141814號の台湾労働部指針',
      'その費用を、勤続義務や期間満了前の終了に対する制裁の根拠へ転換することはできない、という趣旨です。',
      '使用者が本来負担すべき一般的な採用・管理費用や引継ぎ費用',
      'もっとも、社内で実施したというだけで常に除外されるわけでもありません。',
      '課程ごとに、テーマ、時間、費用、法定義務に当たるかどうかを分けて確認します。',
      '請求額は研修費の証拠と合っているか。',
    ]) {
      expect(section).toContain(phrase);
    }
  });

  it('12. locks prepaid-benefit disclosure, proportional repayment, and separate claims', () => {
    const section = sectionBody(parsed.content, headings[5]);
    const requiredPhrases = [
      '告知は、紛争が起きてから初めて示しても間に合いません。',
      '条項の全期間はどのくらいか、いつ権利として確定するのか',
      '条項の開始日と終了日、実際の勤務日、返還額を算定する基礎額',
      'すでに履行した期間をまったく反映しない固定額',
      '分割支給や段階的な権利確定の仕組み',
      '条項の効力、支給された金銭の法的性質、すでに勤務した期間、契約終了の理由、返還の計算式',
      '契約書に「違約金」とあっても、それだけで請求額は決まりません。',
      '全額返還条項、実際の損失と関係のない固定違約金、賃金からの一方的な控除',
      '法的根拠、合意の内容、労働法上の制限、控除の適法性',
      '研修費の返還と前払給付の返還も、区別して考えます。',
      '費用が重複して計算されていないか、項目ごとの証拠を照らし合わせます。',
    ];

    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it('13. locks paragraph 4 protection and evidence-based attribution without a closed list', () => {
    const section = sectionBody(parsed.content, headings[6]);
    const requiredPhrases = [
      '台湾労働基準法第15条の1第4項は、労働契約が最低勤務期間の満了前に終了した場合について定めています。',
      '終了が労働者の責めに帰すことのできない事由によるときは、労働者は最低勤務期間条項の違反責任も研修費の返還責任も負いません。',
      'ただし、契約終了の理由と帰責性は、解雇通知、退職の意思表示、労働条件違反に関する資料など、具体的な証拠に基づいて判断します。',
      '最低勤務期間の途中で関係が終わったという事実だけでは、労働者の違反は認定できません。',
      '誰がどんな意思表示をしたのか、契約が終了した法的根拠は何か',
      '終了を生じさせた実際の事情はどちらの当事者に帰属するのか',
      '解雇通知書、退職届、合意終了の文書、電子メールやメッセージの記録、労働条件の変更に関する資料、出勤・業務記録',
      '健康上や業務上の事情が書かれていても',
      '責めに帰すことのできない事由を、これらに限って列挙したものではないのです。',
      '書面の名称と実際の事実が食い違うこともあります。',
      '最低勤務期間条項の違反責任も研修費の返還責任も、労働者に負わせることはできません。',
      '請求ごとに法的性質と根拠を分けて検討します。',
    ];

    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it('14. separates resignation and locks Articles 15 and 16 notice rules', () => {
    const section = sectionBody(parsed.content, headings[7]);
    const orderedRules = [
      '最低勤務期間条項は、労働者の退職を物理的にも法的にも妨げる仕組みではありません。',
      '退職の意思表示と予告期間が決めるのは、労働関係がいつ終わるかです。',
      '条項の効力と費用の返還責任が扱うのは、終了に伴う財産上の責任があるかどうかです。',
      '期間の定めのない労働契約を労働者が終了する場合は、台湾労働基準法第15条により、第16条第1項の予告期間が準用されます。',
      '第16条は使用者による契約終了の規定です',
      '1. 3か月以上1年未満の場合は10日前',
      '2. 1年以上3年未満の場合は20日前',
      '3. 3年以上の場合は30日前',
      '特定の業務を目的とする有期労働契約で、契約期間が3年を超える場合',
      '労働者は3年間勤務した後、30日前までに使用者へ予告して契約を終了できます。',
      '継続勤務期間が3か月未満の場合、その他の種類の有期契約の場合、法令上の即時終了事由が主張されている場合',
      '退職の意思表示の内容と伝達日、使用者が実際に受け取った日、最終勤務日に関するやり取り',
      '研修費や前払給付の返還、別途主張される損害は、四つに分けて考えます。',
    ];

    orderedPresence(section, orderedRules);
  });

  it('15. locks both evidence blocks and every contracted evidence category', () => {
    const section = sectionBody(parsed.content, headings[8]);
    const employerSection =
      section
        .split('### 使用者の側\n\n')[1]
        ?.split('\n\n### 労働者の側')[0] ?? '';
    const workerSection = section.split('### 労働者の側\n\n')[1] ?? '';
    const employerCoverage = [
      '専門技術研修を提供して費用を負担したのか、勤続の約束に対する合理的な補償を提供したのか',
      '一般研修・定例研修・法定義務研修と専門技術研修',
      '課程表、日程、修了記録、請求書、領収書、費用負担者の資料',
      '目的、支給日、金額、権利確定条件、労働者への告知、未履行期間に応じた返還の計算式',
      '同一または類似の職務に就く人員の代替可能性',
      'すでに勤務した期間は精算に反映します。',
      '実際の終了日、履行期間、未履行期間',
      '契約書、支給資料、給与明細、当事者間の通信、請求書、控除記録',
    ];
    const workerCoverage = [
      '署名した労働契約書と変更合意書の原本',
      '一般的な適応研修や法定義務研修に当たらないか',
      '入社一時金や勤続奨励金などの前払給付',
      '条項の期間の算定根拠、すでに勤務した期間、残りの期間、使用者が主張する代替人員の確保可能性',
      '退職通知、解雇通知、合意終了の文書',
      '契約終了の原因と経緯は時系列で整理',
      '条項の効力、退職の意思表示と予告、研修費・前払給付の返還、別途主張される損害',
      '署名したことや、使用者から一定額を請求されたことだけで、責任を認めてはいけません。',
    ];

    expect(employerSection).not.toBe('');
    expect(workerSection).not.toBe('');
    orderedPresence(employerSection, employerCoverage);
    orderedPresence(workerSection, workerCoverage);
  });

  it('16. uses only four exact official links and URLs in contracted order', () => {
    const officialSection = sectionBody(parsed.content, officialHeading);
    const externalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((https?:\/\/[^)]+)\)/g),
      (match) => match[1],
    );
    const allExternalUrls =
      parsed.content.match(/https?:\/\/[^\s)]+/g) ?? [];

    expect(
      Array.from(
        officialSection.matchAll(/(?<!!)\[[^\]]+\]\([^)]+\)/g),
        (match) => match[0],
      ),
    ).toEqual(officialLinks);
    expect(externalTargets).toEqual(officialUrls);
    expect(allExternalUrls).toEqual(officialUrls);
    for (const url of officialUrls) {
      expect(parsed.content.split(url)).toHaveLength(2);
    }
    for (const link of officialLinks) expect(raw.split(link)).toHaveLength(2);
  });

  it('17. uses only three exact Japanese internal links in contracted order', () => {
    const relatedSection = sectionBody(parsed.content, relatedHeading);
    const markdownInternalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[1],
    );
    const allLocalePaths =
      parsed.content.match(/\/(?:ko|zh-hant|en|ja)(?:\/[^\s)]*)?/g) ?? [];

    expect(
      Array.from(
        relatedSection.matchAll(/(?<!!)\[[^\]]+\]\([^)]+\)/g),
        (match) => match[0],
      ),
    ).toEqual(internalLinks);
    expect(markdownInternalTargets).toEqual(internalTargets);
    expect(allLocalePaths).toEqual(internalTargets);
    for (const link of internalLinks) expect(raw.split(link)).toHaveLength(2);
  });

  it('18. locks the last official link, disclaimer, and author at exact EOF', () => {
    expect(raw.trimEnd().slice(raw.lastIndexOf(`- ${officialLinks[3]}`))).toBe(
      exactEnding,
    );
    expect(parsed.content.trimEnd().endsWith(exactEnding)).toBe(true);
    expect(raw.trimEnd().endsWith(author)).toBe(true);
  });

  it('19. allows only the three source-backed Chinese provenance strings in their contexts', () => {
    const provenance = [
      {
        value: '勞動關2字第1150141814號',
        count: 1,
        context: '勞動關2字第1150141814號の台湾労働部指針',
      },
      {
        value: '曾雋崴',
        count: 1,
        context: author,
      },
      {
        value: '資遣費',
        count: 1,
        context: internalLinks[1],
      },
    ];

    for (const { value, count, context } of provenance) {
      expect(raw.split(value)).toHaveLength(count + 1);
      expect(raw).toContain(context);
    }
    for (const forbiddenChineseTerm of [
      '最低服務年限',
      '特定性定期契約',
      '雇主',
      '勞工',
      '專業技術培訓',
      '合理補償',
      '人力替補可能性',
      '預付性給付',
      '不可歸責',
    ]) {
      expect(raw).not.toContain(forbiddenChineseTerm);
    }
  });

  it('20. removes legacy claims, wrong scripts, invisible characters, emoji, and locale leaks', () => {
    const visibleText = extractPublicText(parsed.content);
    const forbiddenLiterals = [
      '台湾 強制雇用期間 最低勤務期間',
      '台湾の義務在職期間約定の問題',
      '義務在職',
      'ほぼ違法',
      'ほぼ無効',
      '高い確率で違法',
      '三要件をすべて',
      '一要件でも欠ければ',
      '署名だけで条項が有効',
      '台湾2024年最低賃金',
      'NT$183',
      'NT$27,470',
      '10,030ウォン',
      '2,096,270ウォン',
      '183新台湾ドル',
      '27,470新台湾ドル',
      '1万30ウォン',
      '209万6,270ウォン',
      '500万台湾ドル',
      'NT$5 million',
      '500万新台湾ドル',
      '20年勤務',
      'パイロット',
      '一般的な時間外手当や出張費などは認められません',
      '前回',
      '今日は',
      'お話し',
      '心配',
      '心配しすぎないでください',
      '必ず成功',
      '結果を保証',
      'コメントしてください',
      'DMしてください',
      '秘密の依頼者',
      '/ko/',
      '/zh-hant/',
      '/en/',
      '\uFEFF',
      '\u00A0',
      '\u200B',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(visibleText).not.toContain(forbidden);
      expect(raw).not.toContain(forbidden);
    }
    expect(visibleText).not.toMatch(/[\p{Script=Hangul}]/u);
    expect(visibleText).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(visibleText).not.toMatch(
      /(?:三|3)つ?の(?:法定)?(?:要件|条件)[^。.\n]*(?:すべて|同時|全部)/,
    );
    expect(visibleText).not.toMatch(
      /(?:一|1)つ?の(?:要件|条件)[^。.\n]*(?:欠け|満たさ)[^。.\n]*(?:違法|無効)/,
    );
    expect(visibleText).not.toMatch(
      /(?:合理性|必要性)[^。.\n]*(?:第三|3番目)[^。.\n]*(?:要件|条件)/,
    );
    expect(visibleText).not.toMatch(
      /最低勤務期間条項[^。.\n]*(?:退職|辞職)[^。.\n]*(?:禁止|妨害|できない)/,
    );
    expect(visibleText).not.toMatch(
      /(?:賃金|時間外手当|旅費|各種手当|奨励金|社内研修)[^。.\n]*(?:絶対|一律|いかなる事実関係でも)[^。.\n]*(?:なり得ない|認められない)/,
    );
    expect(visibleText).not.toMatch(
      /(?:労働部|行政解釈・通達)[^。.\n]*(?:拘束力ある先例|法規命令)/,
    );
    expect(visibleText).not.toMatch(
      /(?:労働部|行政解釈・通達)[^。.\n]*(?:法律|法改正|裁判例|判例)(?:です|である|として扱)/,
    );
    expect(visibleText).not.toMatch(
      /(?:\b[A-Za-z]+(?:['’-][A-Za-z]+)?\b[\s,;:()–—-]*){5}/,
    );
  });

  it('21. freezes exact visible Japanese and kana counts and derived read time', () => {
    const publicText = extractPublicText(parsed.content);
    const visibleJapaneseCount =
      publicText.match(
        /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu,
      )?.length ?? 0;
    const visibleKanaCount =
      publicText.match(
        /[\p{Script=Hiragana}\p{Script=Katakana}]/gu,
      )?.length ?? 0;
    const calculatedMinutes = Math.ceil(visibleJapaneseCount / 500);

    expect(visibleJapaneseCount).toBe(7_662);
    expect(visibleJapaneseCount).toBeGreaterThanOrEqual(4_500);
    expect(visibleKanaCount).toBe(3_519);
    expect(visibleKanaCount).toBeGreaterThanOrEqual(1_800);
    expect(calculatedMinutes).toBe(16);
    expect(parsed.data.read_time).toBe(`約${calculatedMinutes}分`);
    expect(post?.readTime).toBe(`約${calculatedMinutes}分`);
  });

  it('22. exposes source-matching metadata, FAQ, image, and renderer content', () => {
    expect(parsed.data.url).toBe(sourceUrl);
    expect(post).toMatchObject({
      slug: canonicalSlug,
      title,
      date: '2026-10-06',
      dateDisplay: '2025年9月13日',
      readTime: '約16分',
      category: 'legal',
      categoryLabel: '台湾法律情報',
      featuredImage:
        '/images/blog/014-taiwan-mandatory-employment-period/featured-01.jpg',
      faq,
    });

    const expectedRendererContent = parsed.content
      .replace(/\(\.\.\/images\/([^)]+)\)/g, '(/images/blog/$1)')
      .trimStart()
      .replace(/^#\s+.+\n*/, '')
      .replace(/^\s*!\[[^\]]*\]\([^)]+\)\s*\n*/, '')
      .trim();
    expect(post?.content).toBe(expectedRendererContent);
    expect(post?.content).toContain(`## ${headings[0]}`);
    expect(post?.content).toContain(`## ${headings.at(-1)}`);
    expect(post?.faq).toEqual(faq);
  });

  it('23. resolves canonical and mandatory-employment aliases to one Japanese post', () => {
    expect(post).toBeDefined();
    expect(aliasPost).toBeDefined();
    expect(aliasPost?.slug).toBe(canonicalSlug);
    expect(aliasPost).toEqual(post);
  });

  it('24. is a dedicated directly addressable Japanese column 014 regression suite', () => {
    expect(columnPath).toBe(
      path.join(
        process.cwd(),
        'src/content/columns-ja/014-taiwan-mandatory-employment-period.md',
      ),
    );
    expect(fs.existsSync(columnPath)).toBe(true);
    expect(parsed.data.title).toBe(title);
  });
});
