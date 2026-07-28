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
  '1. 最低勤務期間条項はいつ有効となるか',
  '2. 第一の法定要件：専門技術研修と費用負担',
  '3. 第二の法定要件：合理的な補償',
  '4. 合理的な範囲と四つの審査要素',
  '5. 条項の根拠にできない研修',
  '6. 奨励金の返還と期間満了前の退職',
  '7. 労働者の責めに帰すことのできない事由による契約終了',
  '8. 退職予告は別の問題',
  '9. 使用者・労働者チェックリスト',
  '10. 公式資料',
  '11. 関連情報',
];
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
  '本稿は、台湾の最低勤務期間条項、研修費と前払給付の返還および退職予告について一般的に説明するための教育目的の資料であり、個別の労働事件に関する法的助言ではありません。契約の種類と文言、実際の研修と費用、補償の目的と告知、勤務期間、契約終了の原因および証拠により、条項の効力と責任の範囲は異なることがあります。退職の意思表示、賃金からの控除、返還合意または紛争対応を行う前に、最新の公式資料と個別事情を確認してください。';
const author = '**曾雋崴弁護士（Wei Tseng）**';
const exactEnding = `- ${internalLinks[2]}

---

${disclaimer}

${author}`;
const expectedFrontmatter = `---
title: "${title}"
url: "${sourceUrl}"
lastmod: "2026-07-25"
date_display: "2025年9月13日"
read_time: "約17分"
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

function firstParagraphAfter(content: string, heading: string) {
  return content.split(`${heading}\n\n`)[1]?.split('\n\n')[0];
}

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
      lastmod: '2026-07-25',
      date_display: '2025年9月13日',
      read_time: '約17分',
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
    ).toEqual(['使用者が確認する事項', '労働者が確認する事項']);
  });

  it('5. repeats each FAQ answer twice and as its assigned H2 first paragraph', () => {
    const assignments = [
      [`## ${headings[0]}`, faq1Answer],
      [`## ${headings[4]}`, faq2Answer],
      [`## ${headings[5]}`, faq3Answer],
      [`## ${headings[6]}`, faq4Answer],
    ];

    for (const [heading, answer] of assignments) {
      expect(firstParagraphAfter(parsed.content, heading)).toBe(answer);
      expect(firstParagraphAfter(post?.content ?? '', heading)).toBe(answer);
      expect(raw.split(answer)).toHaveLength(3);
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
      '3. 労働契約終了の理由がどちらの当事者に帰属するか',
      '4. 退職予告と返還の範囲をどのように判断するか',
    ];

    expect(introduction).toContain(
      '台湾の労働契約における最低勤務期間条項は、一定期間勤務するという約束に加え、期間満了前に退職した場合に研修費・入社一時金・勤続奨励金を返還する義務があるか、別途違約金を請求できるかを定める形で用いられます。',
    );
    expect(introduction).toContain(
      '契約書上の名称よりも、法定要件と実際の支給・研修・契約終了の経緯を段階的に確認する必要があります。',
    );
    orderedPresence(introduction, orderedQuestions);
    expect(introduction).toContain(
      '同じ契約書にこの四つの問題が記載されていても、適用される条文と必要な証拠は異なります。',
    );
    expect(parsed.content).not.toContain('最低服務年限');
  });

  it('7. separates alternative statutory bases, scope review, and paragraph 3 voidness', () => {
    const section = sectionBody(parsed.content, headings[0]);
    const requiredPhrases = [
      '第15条の1第1項は、二つの法定要件を選択的に定めています。',
      '一つ目は、使用者が労働者に専門技術研修を提供し、その費用を負担した場合です。',
      '二つ目は、最低勤務期間を遵守する対価として合理的な補償を提供した場合です。',
      '第15条の1は、二つの法定要件のうち一つを満たすことに加え、別途合理性を審査することを求めています。',
      'どちらか一つを形式的に記載しておけば条項全体が自動的に有効になるという意味でもありません。',
      '第1項の法定要件または第2項の合理性基準に反する条項は、第3項により無効です。',
      'すべての最低勤務期間条項を初めから一律に有効または無効と判断する規定ではありません。',
      '労働者が契約書に署名したという事情は、合意の存在を確認する資料にはなり得ますが、法定要件に代わるものではありません。',
      'どのような投資や補償があり、なぜその期間を定めたのかを確認する必要があります。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('8. locks all professional-technical-training proof items and qualifications', () => {
    const section = sectionBody(parsed.content, headings[1]);
    const requiredPhrases = [
      '使用者が当該労働者に専門技術研修を実際に提供し、その費用を負担しなければなりません。',
      '研修のテーマ、職務に必要な専門性・技術性、具体的な期間、修了の有無および実際の費用支出',
      '外部講師料、教育機関の受講料、教材・機器使用料',
      '使用者が主張する内部費用の算定根拠',
      '通常の監督や業務の引継ぎとどのように異なるか',
      '推定額や一律に配賦された金額だけで、実際の負担が証明されるわけではありません。',
      '課程表、研修日程、出席簿、評価結果、修了証、請求書および領収書',
      '使用者と教育機関との間の契約、支払伝票、返金条件',
      '最終的に誰が費用を負担したかも区別する必要があります。',
      '社内研修でも具体的な専門的・技術的内容と相当な投資が証明されることがあり',
      '高額・長期の研修であるというだけで法定要件を満たすと認めたりしてはなりません。',
      '条項の期間と研修への投資との関係も説明できなければなりません。',
      '既にどの程度勤務したかも、負担の範囲を判断する資料となります。',
    ];

    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it('9. locks reasonable-compensation purpose, disclosure, timing, vesting, and formula', () => {
    const section = sectionBody(parsed.content, headings[2]);
    const requiredPhrases = [
      '労働者が最低勤務期間を遵守するという約束に対し、使用者が合理的な補償を提供する場合です。',
      '通常の賃金や本来支払うべき労務の対価とは異なる目的と仕組み',
      '支払明細に入社一時金、勤続奨励金または前払給付と記載されているというだけで、その法的性質が決まるわけではありません。',
      '採用のための一般的な賃金条件なのか、特定期間の勤続約束の対価なのか、成果達成に対する報酬なのか',
      '支給日、金額、権利確定時期、勤続期間との関係、返還事由および計算式',
      'その役割を明確に告知しなければならないと説明しています。',
      '賃金の一部を補償として再分類したりする方法では、契約当時の告知に代えることは困難です。',
      '既に勤務した期間に対応する部分がどのように帰属するか、返還の範囲が過大でないか',
      'どのような長さの勤続期間やどのような額の返還責任も無制限に許されるわけではありません。',
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
      '項目別の証拠と労働者ごとの帰属額、研修によって得られた能力、既に回収された投資部分',
      '使用者が採用の困難さを主張するだけで決まるものではありません。',
      '必要な資格と熟練度は何か、通常の採用期間はどの程度か',
      'いつ支給され、どのような条件で労働者の権利として確定するか',
      '考慮すべき事情も上記の例に限定されません。',
      '条項を締結した経緯、業務の性質、当事者に説明された内容、実際の勤務期間、契約終了の理由',
      '使用者の実際の投資、代替人員確保の難易度、労働者が受けた補償および返還負担の間には、納得できる比例関係が必要です。',
      '別の事件の結論をそのまま適用したりしてはなりません。',
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
      '台湾労働部の勞動關2字第1150141814號指針',
      'その費用を勤続義務や期間満了前の終了に対する制裁の根拠へ転換することはできないという趣旨です。',
      '使用者が本来負担すべき一般的な採用・管理費用や引継ぎ費用',
      '研修が社内で実施されたというだけで常に除外されるわけでもありません。',
      '課程ごとのテーマ、時間、費用および法定義務に該当するかを分けて確認',
      '請求額が研修費の証拠と一致するかを確認する必要があります。',
    ]) {
      expect(section).toContain(phrase);
    }
  });

  it('12. locks prepaid-benefit disclosure, proportional repayment, and separate claims', () => {
    const section = sectionBody(parsed.content, headings[5]);
    const requiredPhrases = [
      '告知は、支給後に紛争が生じてから初めて示すものであってはなりません。',
      '条項の全期間はどの程度か、いつ労働者の権利として確定するか',
      '条項の開始日と終了日、実際の勤務日、返還額算定の基礎額',
      '既に履行した期間を全く反映しない固定額',
      '分割支給や段階的な権利確定の仕組み',
      '条項の効力、支給された金銭の法的性質、既に勤務した期間、契約終了の理由および返還の計算式',
      '契約書に「違約金」という表現があるというだけで請求額が確定するわけではありません。',
      '全額返還条項、実際の損失と関係のない固定違約金、賃金から一方的に控除する方法',
      'それぞれの法的根拠、合意内容、労働法上の制限および控除の適法性',
      '研修費の返還と前払給付の返還も区別しなければなりません。',
      '費用が重複して計算されていないか、各項目の証拠を個別に照合',
    ];

    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it('13. locks paragraph 4 protection and evidence-based attribution without a closed list', () => {
    const section = sectionBody(parsed.content, headings[6]);
    const requiredPhrases = [
      faq4Answer,
      '労働関係が最低勤務期間の満了前に終了したという事実だけで、労働者による違反を認定することはできません。',
      '誰がどのような意思表示をしたか、契約が終了した法的根拠は何か',
      '終了を生じさせた実際の事情がどちらの当事者に帰属するか',
      '解雇通知書、退職届、合意終了文書、電子メールとメッセージの記録、労働条件の変更に関する資料、出勤・業務記録',
      '健康上または業務上の事情が言及されている場合',
      '労働者の責めに帰すことのできない事由を限定的に列挙したものではありません。',
      '文書に記載された名称と実際の事実が一致しないこともあります。',
      '最低勤務期間条項の違反責任と研修費の返還責任を労働者に負わせることができない',
      '各請求の法的性質と根拠を区別して検討します。',
    ];

    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it('14. separates resignation and locks Articles 15 and 16 notice rules', () => {
    const section = sectionBody(parsed.content, headings[7]);
    const orderedRules = [
      '最低勤務期間条項は、労働者の退職を物理的または法的に妨げる仕組みではありません。',
      '退職の意思表示と予告期間は、労働関係がいつ終了するかという問題',
      '最低勤務期間条項の効力と費用返還責任は、契約終了に伴う財産上の責任があるかを扱う問題',
      '期間の定めのない労働契約を労働者が終了する場合は、台湾労働基準法第15条により、第16条第1項の予告期間が準用されます。',
      '第16条は使用者による契約終了に関する規定',
      '1. 3か月以上1年未満の場合は10日前',
      '2. 1年以上3年未満の場合は20日前',
      '3. 3年以上の場合は30日前',
      '特定の業務を目的とする有期労働契約の契約期間が3年を超える場合',
      '労働者は3年間勤務した後、30日前までに使用者へ予告して契約を終了することができます。',
      '継続勤務期間が3か月未満の場合、その他の種類の有期契約の場合、法令上の即時終了事由が主張されている場合',
      '退職の意思表示の内容と伝達日、使用者が実際に受領した日、最終勤務日に関する当事者間の通信',
      '研修費や前払給付の返還、別途主張される損害を四つの問題に分ければ',
    ];

    orderedPresence(section, orderedRules);
  });

  it('15. locks both checklists and every contracted evidence category', () => {
    const section = sectionBody(parsed.content, headings[8]);
    const employerSection =
      section
        .split('### 使用者が確認する事項\n\n')[1]
        ?.split('\n\n### 労働者が確認する事項')[0] ?? '';
    const workerSection =
      section.split('### 労働者が確認する事項\n\n')[1] ?? '';
    const employerItems = employerSection.match(/^\d+\. .+$/gm) ?? [];
    const workerItems = workerSection.match(/^\d+\. .+$/gm) ?? [];
    const orderedCoverage = [
      '専門技術研修を提供して費用を負担したのか、または勤続の約束に対する合理的な補償を提供したのか',
      '一般研修・定例研修・法定義務研修と専門技術研修',
      '課程表、日程、修了記録、請求書、領収書および費用負担者',
      '補償の目的、支給日、金額、権利確定条件、労働者への告知および未履行期間に応じた返還計算式',
      '同一または類似の職務に就く人員の代替可能性',
      '既に勤務した期間を精算に反映',
      '実際の終了日、履行期間および未履行期間',
      '契約書、支給資料、給与明細、当事者間の通信、請求書および控除記録',
      '署名した労働契約書と変更合意書の原本',
      '一般的な適応研修または法定義務研修に該当するか',
      '入社一時金・勤続奨励金などの前払給付',
      '既に勤務した期間、残りの期間および使用者が主張する代替人員の確保可能性',
      '退職通知、解雇通知または合意終了文書',
      '実際の契約終了の原因と経緯を時系列で整理',
      '最低勤務期間条項の効力、退職の意思表示と予告、研修費・前払給付の返還、別途主張される損害',
      '署名したことや使用者から一定額を請求されたという事実だけで責任を認めず',
    ];

    expect(employerItems).toHaveLength(8);
    expect(workerItems).toHaveLength(8);
    orderedPresence(section, orderedCoverage);
  });

  it('16. uses only four exact official links and URLs in contracted order', () => {
    const officialSection = sectionBody(parsed.content, headings[9]);
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
    const relatedSection = sectionBody(parsed.content, headings[10]);
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

  it('18. locks the last related link, disclaimer, and author at exact EOF', () => {
    expect(raw.trimEnd().slice(raw.lastIndexOf(`- ${internalLinks[2]}`))).toBe(
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
        context: '台湾労働部の勞動關2字第1150141814號指針',
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

    expect(visibleJapaneseCount).toBe(8_330);
    expect(visibleJapaneseCount).toBeGreaterThanOrEqual(4_500);
    expect(visibleKanaCount).toBe(3_773);
    expect(visibleKanaCount).toBeGreaterThanOrEqual(1_800);
    expect(calculatedMinutes).toBe(17);
    expect(parsed.data.read_time).toBe(`約${calculatedMinutes}分`);
    expect(post?.readTime).toBe(`約${calculatedMinutes}分`);
  });

  it('22. exposes source-matching metadata, FAQ, image, and renderer content', () => {
    expect(parsed.data.url).toBe(sourceUrl);
    expect(post).toMatchObject({
      slug: canonicalSlug,
      title,
      date: '2026-07-25',
      dateDisplay: '2025年9月13日',
      readTime: '約17分',
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
