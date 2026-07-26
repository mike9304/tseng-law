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

const title = '台湾の最低勤務期間条項：有効性・研修費用・返還義務';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-mandatory-employment-period';
const featuredImage =
  '../images/014-taiwan-mandatory-employment-period/featured-01.jpg';
const bodyImage = `![台湾の最低勤務期間条項と研修費用の返還を検討する場面を表す画像](${featuredImage})`;
const faq1Answer =
  'いいえ。台湾労働基準法第15条の1によれば、使用者が労働者に専門技術研修を実施してその費用を負担する場合、または労働者が最低勤務期間を遵守することへの合理的な補償を提供する場合には、条項を設けるための法定要件を満たす可能性があります。二つの要件を同時に満たす必要はありません。ただし、いずれか一方を満たしても、研修の期間・費用、同一または類似の職務に就く労働者の補充可能性、補償の額・範囲その他の事情を総合し、条項が合理的な範囲を超えないかを別途判断する必要があります。';
const faq2Answer =
  'できません。台湾労働部の2026年6月5日付行政解釈・通達によれば、定例研修、一般的な職務研修、新入社員が業務や職場に慣れるための研修、および法令上使用者に実施が義務付けられた研修の費用は、最低勤務期間条項、違約金または費用返還請求の根拠にできません。ただし、社内で行われる研修がすべて当然に除外されるわけではありません。名称だけで判断せず、内容の専門性・技術性、期間、使用者が実際に負担した費用およびその証拠を確認する必要があります。';
const faq3Answer =
  'その給付が最低勤務期間条項を支える合理的な補償として支払われた場合、全額返還を求めることはできません。入社一時金、勤続奨励金その他の前払給付については、その目的を労働者に明確に伝えておく必要があります。台湾労働部の2026年6月5日付行政解釈・通達によれば、期間満了前に退職した場合の返還額を未履行期間に応じて按分しなければならないとされています。実際の返還義務は、給付の目的、契約内容、既に勤務した期間および契約終了の理由を併せて検討して判断します。';
const faq4Answer =
  '必要ありません。台湾労働基準法第15条の1第4項は、労働者の責めに帰すことのできない事由により最低勤務期間の満了前に労働契約が終了したとき、労働者は最低勤務期間条項の違反責任も研修費用の返還責任も負わないと定めています。ただし、契約終了の実際の理由と帰責性は、解雇通知、退職の意思表示、労働条件の変更に関する資料その他の具体的な証拠に基づいて判断する必要があります。';
const faq = [
  {
    q: '台湾の労働契約に定める最低勤務期間条項は、一律に無効ですか？',
    a: faq1Answer,
  },
  {
    q: '一般的な入社時研修や法令上義務付けられた研修を、最低勤務期間条項の根拠にできますか？',
    a: faq2Answer,
  },
  {
    q: '使用者は、期間満了前に退職した労働者へ、入社一時金や勤続奨励金の全額返還を求めることができますか？',
    a: faq3Answer,
  },
  {
    q: '労働者の責めに帰すことのできない事由で労働契約が早期に終了した場合も、研修費用を返還する必要がありますか？',
    a: faq4Answer,
  },
];
const headings = [
  '1. 最低勤務期間条項はいつ有効となり得るか',
  '2. 第一の法定要件：専門技術研修と費用負担',
  '3. 第二の法定要件：合理的な補償',
  '4. 合理的な範囲と四つの考慮要素',
  '5. 条項の根拠にできない研修',
  '6. 奨励金の返還と期間満了前の退職',
  '7. 労働者の責めに帰すことのできない事由による契約終了',
  '8. 退職の予告は別の問題',
  '9. 使用者・労働者の確認事項',
  '10. 公式資料',
  '11. 関連情報',
];
const officialLinks = [
  '[台湾全国法規資料庫：労働基準法第15条の1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=15-1&pcode=N0030001)',
  '[台湾全国法規資料庫：労働基準法第15条](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=15&pcode=N0030001)',
  '[台湾全国法規資料庫：労働基準法第16条](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=16&pcode=N0030001)',
  '[台湾労働部：2026年6月5日付行政解釈・通達（勞動關2字第1150141814號）](https://laws.mol.gov.tw/FLAW/FLAWDOC03.aspx?cnt=926&datatype=etype&edate=99991231&lnabndn=1&now=1&recordno=10&sdate=20180000)',
];
const officialUrls = officialLinks.map(
  (link) => link.match(/\((https?:\/\/[^)]+)\)$/)?.[1] ?? '',
);
const internalLinks = [
  '[台湾労働法サービス](/ja/services/labor)',
  '[労働者側から契約を終了した場合の退職金（資遣費）](/ja/columns/taiwan-voluntary-resignation-severance)',
  '[お問い合わせ](/ja/contact)',
];
const internalTargets = [
  '/ja/services/labor',
  '/ja/columns/taiwan-voluntary-resignation-severance',
  '/ja/contact',
];
const disclaimer =
  '本稿は、台湾の最低勤務期間条項、研修費用および前払給付の返還ならびに退職の予告について、一般的な教育情報を提供するものです。個別の労働事件に関する法的助言ではありません。条項の有効性および責任の範囲は、労働契約の種類・文言、実際の研修内容・費用、補償の目的・説明、実際に勤務した期間、契約終了の理由および関係資料によって異なります。退職の意思表示、賃金からの控除、返還合意または紛争対応を行う前に、最新の公式資料と個別事情を確認してください。';
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
read_time: "約18分"
categories:
  - "台湾法律情報"
featured_image: "${featuredImage}"
faq:
  - q: "台湾の労働契約に定める最低勤務期間条項は、一律に無効ですか？"
    a: "${faq1Answer}"
  - q: "一般的な入社時研修や法令上義務付けられた研修を、最低勤務期間条項の根拠にできますか？"
    a: "${faq2Answer}"
  - q: "使用者は、期間満了前に退職した労働者へ、入社一時金や勤続奨励金の全額返還を求めることができますか？"
    a: "${faq3Answer}"
  - q: "労働者の責めに帰すことのできない事由で労働契約が早期に終了した場合も、研修費用を返還する必要がありますか？"
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
      read_time: '約18分',
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

  it('6. locks the introduction, four review questions, and sole native-term provenance', () => {
    const introduction = parsed.content.slice(
      parsed.content.indexOf(bodyImage) + bodyImage.length,
      parsed.content.indexOf(`## ${headings[0]}`),
    );
    const orderedQuestions = [
      '1. 労働基準法第15条の1に定める法定要件を満たすか',
      '2. 勤務期間と労働者の負担が合理的な範囲内にあるか',
      '3. 契約終了の理由が労働者に帰責できるか',
      '4. 退職の予告と返還のルールをどのように適用するか',
    ];

    expect(introduction).toContain(
      'この最低勤務期間（台湾法上の「最低服務年限」）については、契約書に署名したという一事だけで、条項の有効性や労働者が負担すべき金額が決まるわけではありません。',
    );
    expect(introduction).toContain(
      '専門技術研修に要した費用、最低勤務期間の遵守を支える入社一時金や勤続奨励金その他の前払給付、固定違約金、退職の予告、さらに別途主張される損害は、それぞれ根拠と判断方法が異なり得る問題です。',
    );
    orderedPresence(introduction, orderedQuestions);
    expect(parsed.content.split('最低服務年限')).toHaveLength(2);
  });

  it('7. separates alternative statutory bases, scope review, and paragraph 3 voidness', () => {
    const section = sectionBody(parsed.content, headings[0]);
    const requiredPhrases = [
      '労働基準法第15条の1第1項が定める法定要件は、次の二つのうち、少なくとも一方を満たすという選択的な仕組みです。',
      '1. 使用者が労働者に専門技術研修を実施し、その費用を負担すること',
      '2. 労働者が最低勤務期間を遵守することについて、使用者が合理的な補償を提供すること',
      '専門技術研修と合理的な補償は、常に両方をそろえなければならない累積的な要件ではありません。',
      '第1項の要件を満たすかという問題と、条項が合理的な範囲内にあるかという問題も別です。',
      '専門技術研修または合理的な補償が存在しても、どのような勤務期間や金銭的負担も許されるわけではありません。',
      '第15条の1第3項によれば、第1項の法定要件または第2項の合理性基準に反する最低勤務期間条項は無効です。',
      '特定の職種に属する条項が一律に有効または無効であるという結論は導けません。',
      '署名の有無だけでも、期間の長短だけでもなく、条項ごとに法定要件、合理性、合意時の説明および裏付け資料を検討します。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('8. locks all professional-technical-training proof items and qualifications', () => {
    const section = sectionBody(parsed.content, headings[1]);
    const requiredPhrases = [
      '使用者は、労働者にその研修を実際に実施し、関連費用を負担したことを示す必要があります。',
      '研修の科目、目的および習得する技能',
      '内容の専門性・技術性を示すカリキュラムや到達目標',
      '実施日、期間、出席、修了、試験および認定の記録',
      '使用した教材、講師の担当内容および専用機器の利用記録',
      '請求書、領収書、支払記録、返金および助成に関する資料',
      '返金や助成を反映した後の最終的な費用負担者と実質負担額',
      '社内費用を主張する場合の費目、算定方法および基礎資料',
      '通常の業務指導、入社時研修および引継ぎとの具体的な相違',
      '証明された投資額と定めようとする勤務期間との関係',
      '研修名が専門的に見えること、概算の総額が示されていること、金額が高額であること、社外で実施されたこと、または研修が長期間にわたることは、いずれも単独では法定要件を満たす証拠になりません。',
      '社内研修も、その実施場所だけを理由に一律に除外されるものではありません。',
      '全体を一つの名称でまとめず、科目、時間、法令上の必要性、参加状況、費用を区分します。',
    ];

    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it('9. locks reasonable-compensation purpose, disclosure, timing, vesting, and formula', () => {
    const section = sectionBody(parsed.content, headings[2]);
    const requiredPhrases = [
      'その給付が通常の賃金その他の労務提供への対価とどのように区別され、最低勤務期間を遵守することとどのように結び付くのかを明らかにします。',
      '給付の実際の目的、金額、支払日、権利確定条件、事前の説明内容、勤務期間との関係、契約終了時の取扱いおよび返還計算式',
      '入社一時金、勤続奨励金、前払給付という呼称は、給付の性質を検討する手掛かりにはなっても、それだけで合理的な補償と認める根拠にはなりません。',
      '賃金、時間外手当、各種手当または旅費と記載された給付についても、名称だけを根拠に、あらゆる事実関係で合理的な補償になり得ないと断定することは適切ではありません。',
      'その役割は契約締結時または支給前に労働者へ明確に説明されている必要があります。',
      '台湾労働部の2026年6月5日付行政解釈・通達も、入社一時金、勤続奨励金その他の前払給付について、その給付が最低勤務期間の遵守に対する補償であることを明確に伝えるよう求めています。',
      '紛争発生後に、当初そのように説明されていなかった給付を、最低勤務期間条項を支える補償として事後的に扱うべきではありません。',
      '給付がどの勤務期間に対応するか、いつ権利が確定するか、早期終了時に何を基礎として返還額を計算するか',
      '合理的な補償の額が大きいという事情だけで、任意の勤務期間や返還負担が正当化されるわけではありません。',
    ];

    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it('10. locks four exact scope factors and individualized proportionality', () => {
    const section = sectionBody(parsed.content, headings[3]);
    const orderedFactors = [
      '1. 専門技術研修の期間および費用',
      '2. 同一または類似の職務に就く労働者の補充可能性',
      '3. 使用者が提供した補償の額および範囲',
      '4. 最低勤務期間の合理性に影響するその他の事情',
    ];

    orderedPresence(section, orderedFactors);
    for (const phrase of [
      '支出が当該専門技術研修に帰属すること、使用者が最終的に負担したこと、返金や助成が反映されていることを確認します。',
      '使用者が単に「採用が難しい」と述べるだけで決まるものではありません。',
      '同一または類似の職務について、必要とされる技能、社内での配置や育成、採用活動、実際の補充状況など、確認可能な事実に基づいて検討します。',
      '支給時期、支給対象、権利確定条件、最低勤務期間のどの部分に対応するか、返還の対象と計算方法',
      '第四の要素は限定列挙ではありません。',
      '条項の合意に至った経緯、業務の性質、当事者に説明された内容、労働者が既に勤務した期間、契約終了の理由、残る負担の内容',
      '勤務期間、証明された投資、補充可能性、労働者が受けた利益、既に勤務した期間および残る負担の比例性を見ます。',
      '別の職種や別の事件で示された結論を、そのまま当該条項に適用することはできません。',
    ]) {
      expect(section).toContain(phrase);
    }
  });

  it('11. locks excluded training, mixed programs, and Ministry attribution', () => {
    const section = sectionBody(parsed.content, headings[4]);
    const orderedCategories = [
      '- 定例研修',
      '- 一般的な職務研修',
      '- 新入社員が業務や職場に慣れるための研修',
      '- 法令上使用者に実施が義務付けられた研修',
    ];

    orderedPresence(section, orderedCategories);
    for (const phrase of [
      '台湾労働部の行政解釈・通達（勞動關2字第1150141814號）が、最低勤務期間条項、違約金または費用返還請求の根拠にできない研修として挙げている',
      '当該通達によれば、その費用を最低勤務期間条項、違約金または費用返還請求の根拠とすることはできません。',
      'この取扱いは台湾労働部が示した行政解釈・通達に基づくものであり、法改正や裁判例として説明すべきものではありません。',
      '社内で実施したという理由だけで、独立した専門技術研修まで当然に除外することも適切ではありません。',
      'カリキュラム、時間、法的根拠、参加状況および費用を部分ごとに分けます。',
      '全体の費用を一括して返還対象とするのではなく',
    ]) {
      expect(section).toContain(phrase);
    }
  });

  it('12. locks prepaid-benefit disclosure, proportional repayment, and separate claims', () => {
    const section = sectionBody(parsed.content, headings[5]);
    const requiredPhrases = [
      'どの給付が勤務継続を支えるものかを事前に特定しなければなりません。',
      '最低勤務期間の起算日と満了日、給付の支払日、権利確定時期、期間満了前に契約が終了した場合の計算方法',
      '最終勤務日、既に勤務した期間、未履行期間、返還計算の基礎となる給付額',
      '台湾労働部の2026年6月5日付行政解釈・通達が示す按分ルールは、最低勤務期間条項を支える合理的な補償として支払われた入社一時金、勤続奨励金その他の前払給付を対象とします。',
      '既に勤務した期間を無視して全額返還を求めるのではなく、未履行期間に応じて按分します。',
      'すべての金銭請求に同じ計算を機械的に用いるのではなく',
      '最初に最低勤務期間条項の有効性を確認し、次に給付の法的性質を特定し、その後、既に勤務した期間と契約終了の理由を整理して、返還計算式を適用する',
      '契約に「違約金」と記載されていることや、支払請求書が作成されたことだけで、請求額が法的に確定するわけではありません。',
      '専門技術研修費用の返還、合理的な補償としての前払給付の返還、固定違約金、別途主張される損害、賃金からの控除は、それぞれ分けて検討します。',
      '同じ支出や給付を複数の名目で重ねて請求していないか',
      '請求書や給与からの控除記録が存在しても、それだけで金額の法的な妥当性が確定するものではありません。',
    ];

    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it('13. locks paragraph 4 protection and evidence-based attribution without a closed list', () => {
    const section = sectionBody(parsed.content, headings[6]);
    const requiredPhrases = [
      faq4Answer,
      '期間満了前に労働契約が終了したという事実だけで、労働者による条項違反を認定することはできません。',
      '誰が、いつ、どのような意思表示をし、それがいつ相手方に到達したか',
      '通知に記載された理由と実際の終了理由',
      '解雇通知、退職の意思表示、合意終了文書、電子メールやメッセージ、職務・賃金の変更資料、出勤記録、業務指示、当事者間の協議記録',
      '文書の名称が「退職届」「合意書」などとなっていても、その名称だけで帰責性を判断するのではなく',
      '労働者の責めに帰すことのできない事由を限定する一覧ではありません。',
      '形式上は労働者から退職の意思表示が出されていても、そのことだけで常に労働者へ帰責できると決めるべきではありません。',
      '第15条の1第4項が直接定める効果は、労働者が最低勤務期間条項に違反した責任と、研修費用を返還する責任を負わないことです。',
      '前払給付、固定違約金またはその他の請求が別に主張される場合には、それぞれの法的性質と契約上の根拠を改めて分析します。',
    ];

    for (const phrase of requiredPhrases) expect(section).toContain(phrase);
  });

  it('14. separates resignation and locks Articles 15 and 16 notice rules', () => {
    const section = sectionBody(parsed.content, headings[7]);
    const orderedRules = [
      '最低勤務期間条項は、労働者が退職の意思表示をすること自体を妨げるものではありません。',
      '- 退職の意思表示の効力と時期',
      '- 最低勤務期間条項の有効性',
      '- 研修費用または前払給付の返還',
      '- 別途主張される損害',
      '労働者が期間の定めのない労働契約を終了させる場合、労働基準法第15条により、第16条第1項の予告期間が準用されます。',
      '1. 継続勤務3か月以上1年未満：10日前',
      '2. 継続勤務1年以上3年未満：20日前',
      '3. 継続勤務3年以上：30日前',
      '第16条自体は、使用者が一定の法定事由により労働契約を終了するときの予告を定める条文です。',
      '期間の定めのない労働契約を労働者が終了させる場面では、第15条が第16条第1項の期間を準用する',
      '特定の事業の完了を目的とする有期労働契約（台湾法上の「特定性定期契約」）の契約期間が3年を超える場合、第15条は、3年が経過した後、労働者が30日前に予告して契約を終了できる',
      '継続勤務が3か月未満の場合、その他の有期労働契約の場合、または予告を要しないと主張される法定事由がある場合',
      '契約の種類、終了の法的根拠、具体的な事実、意思表示の方法と到達日、その証拠を個別に確認します。',
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
    const employerItems = employerSection.match(/^- .+$/gm) ?? [];
    const workerItems = workerSection.match(/^- .+$/gm) ?? [];
    const orderedCoverage = [
      '署名済み労働契約、最低勤務期間条項、変更契約',
      'カリキュラム、日程、期間、出席、修了、試験、認定、教材、講師および機器',
      '請求書、領収書、支払記録、返金、助成',
      '定例研修、入社時研修、法令上義務付けられた研修、一般的な職務研修、専門技術研修',
      '入社一時金、勤続奨励金その他の前払給付の目的、金額、支払日、権利確定条件、返還計算式',
      '最低勤務期間をその長さに定めた根拠',
      '同一または類似の職務に就く労働者の補充可能性',
      '一定の勤務期間や返還額をすべての労働者に流用せず',
      '退職、解雇または合意終了の通知、到達証拠、実際の終了理由、帰責性',
      '給与記録、当事者間の通信、請求書および控除記録',
      '条項の有効性、退職の予告、研修費用の返還、前払給付の返還、固定違約金、その他の損害、賃金からの控除',
      '同じ費用や給付の二重計上',
      '署名した労働契約、最低勤務期間条項、変更契約、説明資料',
      '使用者が示す請求書、領収書、支払記録、返金、助成および最終負担者',
      '最低勤務期間の起算日、満了日、その長さを定めた根拠、既に勤務した期間および未履行期間',
      '退職の意思表示、解雇通知または合意終了文書',
      '送付方法、送付日、到達日',
      '実際の終了理由と帰責性',
      '使用者が示す費用の根拠と計算式',
      '退職の意思表示の効力と時期、条項の有効性、研修費用または前払給付の返還、別途主張される損害',
      '契約に署名したことや請求を受けたことだけで責任と金額が確定したと考えず',
    ];

    expect(employerItems).toHaveLength(14);
    expect(workerItems).toHaveLength(14);
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

  it('19. allows only the five contracted Chinese provenance strings in their contexts', () => {
    const provenance = [
      {
        value: '最低服務年限',
        count: 1,
        context: '最低勤務期間（台湾法上の「最低服務年限」）',
      },
      {
        value: '特定性定期契約',
        count: 1,
        context:
          '特定の事業の完了を目的とする有期労働契約（台湾法上の「特定性定期契約」）',
      },
      {
        value: '勞動關2字第1150141814號',
        count: 2,
        context: '台湾労働部の行政解釈・通達（勞動關2字第1150141814號）',
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

    expect(visibleJapaneseCount).toBe(8_594);
    expect(visibleJapaneseCount).toBeGreaterThanOrEqual(4_500);
    expect(visibleKanaCount).toBe(3_656);
    expect(visibleKanaCount).toBeGreaterThanOrEqual(1_800);
    expect(calculatedMinutes).toBe(18);
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
      readTime: '約18分',
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
