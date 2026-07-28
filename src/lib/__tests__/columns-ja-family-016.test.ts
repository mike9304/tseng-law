import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/016-taiwan-inheritance-custody-analysis.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('taiwan-inheritance-custody-analysis', 'ja');
const aliasPost = getColumnPost('inheritance-custody', 'ja');

const title = '台湾の相続と親権：遺された家族のための法律ガイド';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-inheritance-custody-analysis';
const featuredImage =
  '../images/016-taiwan-inheritance-custody-analysis/featured-generic.webp';
const faq1Answer =
  '台湾民法第1138条および第1144条によれば、生存配偶者は適用される順位の相続人と共同相続し、直系卑属が法定相続人の第1順位です。有効な遺言がなく、関係する相続人が生存配偶者と子2人だけであり、相続放棄、相続欠格、代襲相続その他結論を左右する事情がない場合、3人は通常、それぞれ3分の1の法定相続分を有します。これは規則を説明するための仮定であり、実際の相続事件について結論を示すものではありません。';
const faq2Answer =
  '同じではありません。台湾民法第1030条の1に基づく夫婦残余財産差額分配請求権は、法定要件を満たす場合に生存配偶者が別個に主張し得る権利であり、相続とは分けて検討・計算しなければなりません。婚姻中に取得した財産がすべて当然に計算対象となるわけではなく、生存配偶者が相続財産の半分を必ず取得するわけでもありません。夫婦財産制、各財産の取得原因と時期、債務および法定除外項目を個別事情に即して確認する必要があります。';
const faq3Answer =
  '台湾民法第1089条によれば、父母の一方が未成年の子に対する権利を行使できないときは、原則として他方がこれを行使し、父母が共同で義務を負担できないときは、能力のある一方がこれを負担します。したがって、生存する父又は母が親権を保持し、これと異なる内容の裁判所の判断がない場合、その者が通常、未成年の子に対する権利を引き続き行使し、義務を負担します。ただし、既存の裁判、親権の制限・停止事由、利益相反、渉外要素および子の最善の利益など、具体的事情によっては裁判所の関与が必要です。';
const faq4Answer =
  'できません。台湾民法第1087条および第1088条によれば、未成年の子が相続によって取得した財産は子の特有財産であり、父母または後見人がその財産の所有者になるわけではありません。管理、使用、収益、法定代理および処分は子の利益のために行われなければならず、利益相反または重要な処分については特別代理人の選任や裁判所の関与が必要となることがあります。父母の管理権を、子の相続財産を制限なく一方的に使用できる権限と解してはなりません。';
const faq = [
  {
    q: '遺言がなく、相続人が生存配偶者と子2人だけである場合、法定相続分はどのように計算されますか？',
    a: faq1Answer,
  },
  {
    q: '生存配偶者の夫婦残余財産差額分配請求権は、相続権や法定相続分と同じですか？',
    a: faq2Answer,
  },
  {
    q: '父母の一方が死亡した場合、生存する父又は母の親権上の権利義務はどうなりますか？',
    a: faq3Answer,
  },
  {
    q: '生存する父又は母は、未成年の子が相続した財産を自由に使用できますか？',
    a: faq4Answer,
  },
];
const headings = [
  '1. 法定相続人と法定相続分',
  '2. 遺言と相続財産の確定',
  '3. 生存配偶者の夫婦残余財産差額分配請求権',
  '4. 相続債務と相続放棄',
  '5. 生存する父又は母の親権上の権利義務',
  '6. 未成年後見人の指定と裁判所の関与',
  '7. 未成年者の相続財産の保護',
  '8. 渉外家族の準拠法と手続',
  '9. 実務準備チェックリスト',
  '10. 公式資料',
  '11. 関連サービス',
];
const officialLinks = [
  '[台湾全国法規資料庫：民法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000001)',
  '[台湾法務部法規検索システム：民法（英語版）](https://mojlaw.moj.gov.tw/ENG/LawContentE.aspx?LSID=FL001351)',
  '[台湾全国法規資料庫：渉外民事法律適用法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000007)',
  '[台湾司法院：未成年者の後見人選任申立書](https://www.judicial.gov.tw/tw/cp-1369-4219-da7e1-1.html)',
  '[台湾財政部税務ポータル：相続案件の申請手続（必要書類を含む）](https://www.etax.nat.gov.tw/etwmain/tax-info/house-land-transfer-taxtation-calculation-area/inheritance/file-process)',
];
const officialUrls = officialLinks.map(
  (link) => link.match(/\((https?:\/\/[^)]+)\)$/)?.[1] ?? '',
);
const internalLinks = [
  '[台湾家事訴訟サービス](/ja/services/family)',
  '[台湾訴訟弁護士ガイド](/ja/taiwan-litigation-lawyer)',
  '[お問い合わせ](/ja/contact)',
];
const checklistStarts = [
  '1. 死亡記録、親族関係、戸籍資料および既存の裁判所の判断を確認します。',
  '2. 財産、債務、権利名義、保険受取人、信託および生前移転を特定します。',
  '3. 遺言の方式、有効性、内容および遺留分を確認します。',
  '4. 法定相続分と夫婦残余財産差額分配請求権を分けて計算します。',
  '5. 未成年者の財産の帰属と代理権限を確認し、利益相反を特定します。',
  '6. 裁判所、税務、戸籍および財産登記の手続と期限を確認します。',
];
const exactDeadlineStatement =
  '台湾財政部税務ポータルの「相続案件の申請手続（必要書類を含む）」は、2026年6月25日に更新されています。同ページは、相続財産目録の提出および相続放棄に関する裁判所手続について一般的な3か月の期間を、相続税申告について一般的な6か月の期間を案内しています。ただし、起算日、延長、例外および管轄は個別事案ごとに確認する必要があり、この一般情報を個別案件の期限計算に用いてはなりません。';
const exactEnding = `---

本稿は、台湾の相続法、夫婦財産制、親権上の権利義務および未成年後見制度について、一般的な教育情報を提供するものです。個別の相続事件または家事事件に関する法的助言ではありません。適用法、手続および結果は、相続人の範囲、遺言の有無・内容、財産と債務、夫婦財産制、既存の裁判所の判断ならびに渉外要素により異なり得ます。相続放棄や税務申告の期限を計算し、または財産を処分する前に、最新の公式資料と個別事情を確認してください。

**曾雋崴弁護士（Wei Tseng）**`;
const expectedFrontmatter = `---
title: "台湾の相続と親権：遺された家族のための法律ガイド"
url: "https://www.wei-wei-lawyer.com/post/taiwan-inheritance-custody-analysis"
lastmod: "2026-07-25"
date_display: "2025年9月13日"
read_time: "約17分"
categories:
  - "台湾法律情報"
featured_image: "../images/016-taiwan-inheritance-custody-analysis/featured-generic.webp"
faq:
  - q: "遺言がなく、相続人が生存配偶者と子2人だけである場合、法定相続分はどのように計算されますか？"
    a: "台湾民法第1138条および第1144条によれば、生存配偶者は適用される順位の相続人と共同相続し、直系卑属が法定相続人の第1順位です。有効な遺言がなく、関係する相続人が生存配偶者と子2人だけであり、相続放棄、相続欠格、代襲相続その他結論を左右する事情がない場合、3人は通常、それぞれ3分の1の法定相続分を有します。これは規則を説明するための仮定であり、実際の相続事件について結論を示すものではありません。"
  - q: "生存配偶者の夫婦残余財産差額分配請求権は、相続権や法定相続分と同じですか？"
    a: "同じではありません。台湾民法第1030条の1に基づく夫婦残余財産差額分配請求権は、法定要件を満たす場合に生存配偶者が別個に主張し得る権利であり、相続とは分けて検討・計算しなければなりません。婚姻中に取得した財産がすべて当然に計算対象となるわけではなく、生存配偶者が相続財産の半分を必ず取得するわけでもありません。夫婦財産制、各財産の取得原因と時期、債務および法定除外項目を個別事情に即して確認する必要があります。"
  - q: "父母の一方が死亡した場合、生存する父又は母の親権上の権利義務はどうなりますか？"
    a: "台湾民法第1089条によれば、父母の一方が未成年の子に対する権利を行使できないときは、原則として他方がこれを行使し、父母が共同で義務を負担できないときは、能力のある一方がこれを負担します。したがって、生存する父又は母が親権を保持し、これと異なる内容の裁判所の判断がない場合、その者が通常、未成年の子に対する権利を引き続き行使し、義務を負担します。ただし、既存の裁判、親権の制限・停止事由、利益相反、渉外要素および子の最善の利益など、具体的事情によっては裁判所の関与が必要です。"
  - q: "生存する父又は母は、未成年の子が相続した財産を自由に使用できますか？"
    a: "できません。台湾民法第1087条および第1088条によれば、未成年の子が相続によって取得した財産は子の特有財産であり、父母または後見人がその財産の所有者になるわけではありません。管理、使用、収益、法定代理および処分は子の利益のために行われなければならず、利益相反または重要な処分については特別代理人の選任や裁判所の関与が必要となることがあります。父母の管理権を、子の相続財産を制限なく一方的に使用できる権限と解してはなりません。"
---
`;

function firstParagraphAfter(content: string, heading: string) {
  return content.split(`${heading}\n\n`)[1]?.split('\n\n')[0];
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

function normalizeForVariantScan(value: string) {
  return value
    .normalize('NFKC')
    .toLocaleLowerCase('ja')
    .replace(/[\s\p{P}\p{S}]+/gu, '');
}

describe('Japanese family column 016 — anonymized inheritance and parental-rights guide', () => {
  it('publishes the exact frontmatter, sole H1, and four ordered FAQs', () => {
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
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(post).toMatchObject({
      slug: 'taiwan-inheritance-custody-analysis',
      title,
      date: '2026-07-25',
      dateDisplay: '2025年9月13日',
      readTime: '約17分',
      category: 'legal',
      categoryLabel: '台湾法律情報',
      featuredImage:
        '/images/blog/016-taiwan-inheritance-custody-analysis/featured-generic.webp',
      faq,
    });
    expect(parsed.data.faq).toHaveLength(4);
    expect(raw.split(sourceUrl)).toHaveLength(2);
  });

  it('uses the sole contracted generic image and no legacy image path', () => {
    const bodyImages = Array.from(
      parsed.content.matchAll(/!\[[^\]]*\]\([^)]+\)/g),
      (match) => match[0],
    );

    expect(bodyImages).toEqual([
      `![台湾の相続計画と未成年者の財産保護を表すイラスト](${featuredImage})`,
    ]);
    expect(raw.split(featuredImage)).toHaveLength(3);
    for (const legacyImage of [
      'featured-01.jpg',
      'img-01.jpg',
      'img-02.jpg',
      'img-03.jpg',
    ]) {
      expect(raw).not.toContain(legacyImage);
    }
  });

  it('repeats each FAQ answer twice and as its assigned H2 first paragraph', () => {
    const headingAnswers = [
      ['## 1. 法定相続人と法定相続分', faq1Answer],
      ['## 3. 生存配偶者の夫婦残余財産差額分配請求権', faq2Answer],
      ['## 5. 生存する父又は母の親権上の権利義務', faq3Answer],
      ['## 7. 未成年者の相続財産の保護', faq4Answer],
    ];

    for (const [heading, answer] of headingAnswers) {
      expect(firstParagraphAfter(parsed.content, heading)).toBe(answer);
      expect(firstParagraphAfter(post?.content ?? '', heading)).toBe(answer);
      expect(raw.split(answer)).toHaveLength(3);
    }
    expect(raw.match(/3分の1/g)).toHaveLength(2);
  });

  it('uses exactly the eleven contracted H2 sections in order', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(headings);
  });

  it('locks the introduction, intestate order, concurrent spouse, and share limits', () => {
    const requiredPhrases = [
      '法定相続は誰がどの割合で相続するかを定め、相続財産と債務の調査は分配の対象を確定します。',
      '子が相続した財産の所有者は子本人であり、子を代理する者がその財産を取得するのではありません。',
      '第1順位は直系卑属、第2順位は父母、第3順位は兄弟姉妹、第4順位は祖父母です。',
      '第1144条により、その案件で実際に適用される順位の相続人と共同相続します。',
      '法律上の親子関係、認知、養子縁組の成立と終了、親等、各人の死亡の先後を確認します。',
      '法定要件を満たす代襲相続の有無も検討します。',
      '相続欠格に該当する事情があるか、相続人が適法な相続放棄をしたか',
      '法定相続分は、未分割の相続財産全体に対する法律上の割合です。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks wills, reserved portions, estate identification, and governing law', () => {
    const requiredPhrases = [
      '有効な遺言は、法定相続による分配とは異なる内容を定めることができます。',
      '遺留分その他の強行規定に服する',
      '遺言の方式と作成時の遺言能力',
      '遺言執行者の権限',
      '遺言に遺贈、分割方法の指定、信託に関する定め',
      '名義と実質的な所有関係が一致しているか',
      '受取人指定と保険契約の内容',
      '退職金、年金、雇用上の給付、死亡給付',
      '生前贈与や移転',
      'すべての財産と論点に同一の準拠法が適用されるとは限りません。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks the separate Article 1030-1 calculation, exclusions, and adjustment', () => {
    const requiredPhrases = [
      '第1030条の1は、法定夫婦財産制が終了したときの夫婦間の清算を扱う規定です。',
      '婚姻中に取得した財産から婚姻中の関係債務を控除した残額',
      '相続または贈与その他の無償取得による財産、慰撫金',
      '権利の発生原因、当事者、計算の基礎が異なります。',
      'その清算後に被相続人に帰属する財産を相続財産として確定する',
      '法定の平均分配が著しく不公平となる場合',
      '裁判所が分配額を調整し、または免除する仕組み',
      '婚姻期間が短い、財産の登記名義が一方にある、ある時期に取得されたという一つの事情だけから',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks inherited-debt limits, misconduct, waiver formalities, and deadlines', () => {
    const requiredPhrases = [
      '原則として相続により取得した財産の価額を限度とします。',
      '相続財産の重大な隠匿、財産目録への重大な虚偽記載、被相続人の債権者を害する意図での相続財産の処分',
      '財産目録の提出、債権者への公告、債権の届出、弁済、財産保全および裁判所への申立て',
      '自己のために相続が開始したことを知った時から3か月以内に、管轄裁判所へ書面を提出する必要があります。',
      '口頭で意思を伝えること、親族間の私的合意、財産を受け取らないこと、分割協議に参加しないことだけでは',
      exactDeadlineStatement,
      '裁判所への書面提出、相続税の申告、戸籍上の届出、各財産の名義変更は、異なる機関が扱う別々の手続です。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expect(raw.split(exactDeadlineStatement)).toHaveLength(2);
  });

  it('locks parental rights, guardianship, appointment, and best-interests rules', () => {
    const requiredPhrases = [
      '未成年の子に対する権利の行使と義務の負担という枠組み',
      '子の保護・教養、居所に関する判断、医療と教育に関する対応、身分関係上の手続、法定代理、子の財産管理',
      '親権上の権利義務と相続は別の制度です。',
      '台湾民法第1091条の未成年後見は、未成年者に父母がいない場合、または父母双方がその子に対する権利を行使し義務を負担できない場合',
      '父母の一方が死亡したという事実だけで未成年後見が開始するわけではありません。',
      '台湾民法第1093条により、親権上の権利義務を最後に行使・負担する父または母は、遺言で未成年後見人を指定することができます。',
      '未成年者と同居する祖父母、未成年者と同居する兄姉、未成年者と同居していない祖父母',
      '未成年者本人、一定の親族、検察官、主管機関その他の利害関係人',
      '被後見人の最善の利益です。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks minor ownership, joint management, conflicts, records, and supervision', () => {
    const requiredPhrases = [
      '相続、贈与その他の無償取得によって未成年の子が得た財産を、その子の特有財産',
      '父母による共同管理、使用および収益',
      '子の利益のためでなければその財産を処分できない',
      '預金口座、有価証券、権利証書、遺産からの分配、賃料や配当などの収益、支出、税務資料および領収書',
      '台湾民法第1086条により、父母は通常、未成年の子の法定代理人',
      '裁判所が職権または法定の申立てにより特別代理人を選任する制度',
      '財産目録、裁判所への報告、会計、処分制限、裁判所の許可または監督',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks cross-border connecting factors, jurisdiction, documents, and procedures', () => {
    const requiredPhrases = [
      '各当事者の国籍、住所、常居所、被相続人の死亡地、家族関係、財産の所在地と法的性質、外国での婚姻または離婚、既存の裁判',
      '台湾の渉外民事法律適用法',
      '国際裁判管轄',
      '準拠法となることと台湾の裁判所に国際裁判管轄があることは同義ではありません。',
      '外国裁判の承認・執行',
      '原本または認証謄本、認証、検証、公証、翻訳',
      '金融口座の届出、台湾の戸籍、不動産、車両、有価証券、会社登記',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses exactly six expanded checklist items with all evidence safeguards', () => {
    const checklistSection =
      parsed.content
        .split('## 9. 実務準備チェックリスト\n\n')[1]
        ?.split('\n\n## 10. 公式資料')[0] ?? '';
    const items = checklistSection.match(/^\d+\. .+$/gm) ?? [];

    expect(items).toHaveLength(6);
    checklistStarts.forEach((start, index) => {
      expect(items[index]).toMatch(new RegExp(`^${start.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
    });
    for (const phrase of [
      '原本・認証謄本',
      '評価基準日',
      '取引履歴',
      '受領記録',
      '領収書',
      '認証・翻訳',
      '閲覧権限を限定',
      '証拠の保管連鎖',
      '緊急保全',
    ]) {
      expect(checklistSection).toContain(phrase);
    }
  });

  it('uses only the five official and three internal links in exact order', () => {
    const bodyLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\([^)]+\)/g),
      (match) => match[0],
    );
    const officialSection =
      parsed.content
        .split('## 10. 公式資料\n\n')[1]
        ?.split('\n\n## 11. 関連サービス')[0] ?? '';
    const relatedSection =
      parsed.content
        .split('## 11. 関連サービス\n\n')[1]
        ?.split('\n\n---')[0] ?? '';

    expect(bodyLinks).toEqual([...officialLinks, ...internalLinks]);
    expect(officialSection.split('\n')).toEqual(
      officialLinks.map((link) => `- ${link}`),
    );
    expect(relatedSection.split('\n')).toEqual(
      internalLinks.map((link) => `- ${link}`),
    );
    for (const url of officialUrls) {
      expect(raw.split(url)).toHaveLength(2);
    }
  });

  it('ends with the exact disclaimer and sole correct signature', () => {
    expect(parsed.content.trimEnd().endsWith(exactEnding)).toBe(true);
    expect(raw.trimEnd().endsWith('**曾雋崴弁護士（Wei Tseng）**')).toBe(true);
    expect(raw.match(/曾雋崴/g)).toHaveLength(1);
    expect(raw).not.toContain('曾俊瑋');
  });

  it('resolves the canonical slug and inheritance-custody alias identically', () => {
    expect(post).toBeDefined();
    expect(aliasPost).toEqual(post);
    expect(post?.category).toBe('legal');
    expect(post?.categoryLabel).toBe('台湾法律情報');
  });

  it('locks the exact visible Japanese metrics, read time, and source hash', () => {
    const publicText = extractPublicText(parsed.content);
    const visibleJapaneseCount =
      publicText.match(
        /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu,
      )?.length ?? 0;
    const visibleKanaCount =
      publicText.match(/[\p{Script=Hiragana}\p{Script=Katakana}]/gu)?.length ??
      0;
    const calculatedMinutes = Math.ceil(visibleJapaneseCount / 500);

    expect(visibleJapaneseCount).toBe(8134);
    expect(visibleJapaneseCount).toBeGreaterThanOrEqual(4500);
    expect(visibleKanaCount).toBe(3461);
    expect(visibleKanaCount).toBeGreaterThanOrEqual(1500);
    expect(parsed.data.read_time).toBe(`約${calculatedMinutes}分`);
    expect(post?.readTime).toBe(`約${calculatedMinutes}分`);
    expect(crypto.createHash('sha256').update(raw).digest('hex')).toBe(
      '7bbd9f955324685454dd2c2f37911ad20a08c589c3b9763cd1b17df3669e9842',
    );
  });

  it('contains no identity, media, speculation, overstatement, or locale leakage', () => {
    const serialized = [
      raw,
      parsed.content,
      post?.title ?? '',
      post?.content ?? '',
      JSON.stringify(parsed.data.faq),
      JSON.stringify(post?.faq),
    ].join('\n');
    const forbidden = [
      '구준엽',
      '서희원',
      '왕소비',
      '서희제',
      '具俊曄',
      '徐熙媛',
      '汪小菲',
      '徐熙娣',
      'Koo Jun-yup',
      'Barbie Hsu',
      'Wang Xiaofei',
      'Dee Hsu',
      'クー・ジュンヨプ',
      '大S',
      'SBS',
      'SBSニュース',
      'Harlem Yu',
      '合理的に推測',
      '遺産の大部分',
      '反対訴訟',
      '遺産を横領',
      '遺産を独占',
      '転居',
      '転校',
      '台湾を離れ',
      '未成年の子の意思',
      '最小変動の原則',
      '自動的に',
      'いかなる訴訟手続も必要なく',
      '唯一の親権者',
      '単独親権者',
      '家族は反対できません',
      '単独で子の財産を管理',
      '遺言は効力を有しません',
      '絶対的な相続人',
      '親権者の変更訴訟',
      '監護権',
      '養育権',
      '親権を取得',
      '親権を獲得',
      '残余財産分配請求権',
      '強制相続分',
      '留保分',
      '遺書',
    ];
    const normalized = normalizeForVariantScan(serialized);

    for (const term of forbidden) {
      expect(serialized).not.toContain(term);
      expect(normalized).not.toContain(normalizeForVariantScan(term));
    }
    for (const pattern of [
      /遺産.{0,12}(?:億|万(?:円|ドル|元)|大部分|大半)/u,
      /(?:婚前|婚姻前|婚姻後).{0,20}(?:財産|資産).{0,20}(?:推測|推断|見込)/u,
      /親族.{0,20}(?:提訴|訴訟を起こ|争う)/u,
      /(?:父母|後見人).{0,20}(?:自由|無制限).{0,12}(?:使用|処分)できる/u,
      /裁判所.{0,8}(?:不要|関与しない)/u,
    ]) {
      expect(serialized).not.toMatch(pattern);
    }
    expect(serialized).not.toMatch(/[\uac00-\ud7af]/u);
    expect(serialized).not.toMatch(/[\uFEFF\u00A0\u200B]/u);
    expect(serialized).not.toMatch(/[\p{Extended_Pictographic}\uFE0F]/u);
    for (const leakage of [
      '대만 상속과 친권: 남은 가족을 위한 법률 안내',
      '台灣繼承與親權：遺屬法律指南',
      'Taiwan Inheritance and Parental Rights: A Guide for Surviving Families',
      '剩餘財產',
      '法定應繼分',
      '拋棄繼承',
    ]) {
      expect(serialized).not.toContain(leakage);
    }

    const proseWithoutAllowedEnglish = serialized
      .replace(/https?:\/\/\S+/g, '')
      .replace(/Wei Tseng/g, '');
    expect(proseWithoutAllowedEnglish).not.toMatch(
      /\b[A-Za-z]+(?:[ '-][A-Za-z]+){4,}\b/,
    );
  });
});
