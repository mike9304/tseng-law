import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";
import { getColumnPost } from "@/lib/columns";

const columnPath = path.join(
  process.cwd(),
  "src/content/columns-ja/016-taiwan-inheritance-custody-analysis.md",
);
const raw = fs.readFileSync(columnPath, "utf8");
const parsed = matter(raw);
const post = getColumnPost("taiwan-inheritance-custody-analysis", "ja");
const aliasPost = getColumnPost("inheritance-custody", "ja");

const title = "台湾の相続と親権：遺された家族のための法律ガイド";
const sourceUrl =
  "https://www.wei-wei-lawyer.com/post/taiwan-inheritance-custody-analysis";
const featuredImage =
  "../images/016-taiwan-inheritance-custody-analysis/featured-generic.webp";
const faq1Answer =
  "台湾民法第1138条および第1144条によれば、生存配偶者は適用される順位の相続人と共同相続し、直系卑属は法定相続人の第1順位です。有効な遺言がなく、関係する相続人が生存配偶者と子2人だけであり、相続放棄、相続欠格、代襲相続その他結論を左右する事情がない場合、3人は通常、それぞれ3分の1ずつ相続します。これは説明のための仮定にすぎず、特定の相続事件について結論を示すものではありません。";
const faq2Answer =
  "同じではありません。台湾民法第1030条の1に基づく夫婦残余財産差額分配請求権は、法定要件を満たす場合に生存配偶者が別個に主張できる権利であり、法定相続分とは区別して計算しなければなりません。婚姻中に取得したすべての財産が当然に計算対象となるわけではなく、生存配偶者が相続財産の半分を必ず取得するわけでもありません。夫婦財産制、各財産の取得原因と時期、債務および法定除外項目を確認した上で、個別に判断する必要があります。";
const faq3Answer =
  "台湾民法第1089条により、父母の一方が未成年の子に対する権利を行使し義務を負担できないときは、他方がこれを行うのが原則です。したがって、生存する父又は母が親権を保持し、これに反する裁判所の判断がない場合、その者が通常、引き続き親権上の権利を行使し義務を負担します。ただし、既存の裁判、親権の制限・停止事由、渉外要素、子の最善の利益などの具体的事情によっては、裁判所の関与が必要となる場合があります。";
const faq4Answer =
  "できません。台湾民法第1087条および第1088条によれば、未成年者が相続によって取得した財産は子の特有財産であり、父母または後見人がその財産の実質的な所有者になるわけではありません。管理、使用、収益、法定代理および処分は子の利益のために行われなければならず、利益相反または重要な処分については、特別代理人の選任や裁判所の関与が問題となる場合があります。父母が子の相続財産を制限なく一方的に使用できると考えてはなりません。";
const faq = [
  {
    q: "遺言がなく、相続人が生存配偶者と子2人だけである場合、法定相続分はどのように計算されますか？",
    a: faq1Answer,
  },
  {
    q: "生存配偶者の夫婦残余財産差額分配請求権は、法定相続分と同じ権利ですか？",
    a: faq2Answer,
  },
  {
    q: "父母の一方が死亡した場合、生存する父又は母の親権はどうなりますか？",
    a: faq3Answer,
  },
  {
    q: "生存する父又は母は、未成年の子が相続した財産を自由に使用できますか？",
    a: faq4Answer,
  },
];
const headings = [
  "1. 法定相続人と法定相続分",
  "2. 遺言と相続財産の確定",
  "3. 生存配偶者の夫婦残余財産差額分配請求権",
  "4. 相続債務と相続放棄",
  "5. 生存する父又は母の親権上の権利義務",
  "6. 未成年後見人の指定と裁判所の関与",
  "7. 未成年者の相続財産の保護",
  "8. 渉外家族の準拠法と手続",
  "9. 資料収集と手続の順序",
  "10. 公式資料",
  "11. 関連サービス",
];
const officialLinks = [
  "[台湾全国法規資料庫：民法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000001)",
  "[台湾法務部法規検索システム：民法（英語版）](https://mojlaw.moj.gov.tw/ENG/LawContentE.aspx?LSID=FL001351)",
  "[台湾全国法規資料庫：渉外民事法律適用法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000007)",
  "[台湾司法院：未成年者の後見人選任申立書](https://www.judicial.gov.tw/tw/cp-1369-4219-da7e1-1.html)",
  "[台湾財政部税務ポータル：相続案件の申請手続（必要書類を含む）](https://www.etax.nat.gov.tw/etwmain/tax-info/house-land-transfer-taxtation-calculation-area/inheritance/file-process)",
];
const officialUrls = officialLinks.map(
  (link) => link.match(/\((https?:\/\/[^)]+)\)$/)?.[1] ?? "",
);
const internalLinks = [
  "[台湾家事訴訟サービス](/ja/services/family)",
  "[台湾訴訟弁護士ガイド](/ja/taiwan-litigation-lawyer)",
  "[お問い合わせ](/ja/contact)",
];
const checklistStarts = [
  "1. 死亡診断書と死亡届に関する資料、家族関係と台湾の戸籍資料、婚姻・離婚・養子縁組の記録、既存の裁判所の判断を確認します。",
  "2. 不動産、預金、投資資産、事業持分、動産、債権を調査し、融資、保証、税金、契約上の債務も併せて整理します。",
  "3. 遺言の原本と作成方式、遺言能力、証人または公証の要件、遺言執行者、遺贈の内容を確認します。",
  "4. 法定相続分と夫婦残余財産差額分配請求権を分けて計算します。",
  "5. 未成年者に帰属する財産を特定し、法定代理権、父母または後見人による管理の範囲、利益相反、特別代理人の必要性を確認します。",
  "6. 裁判所における相続放棄・財産目録・後見・特別代理人の手続、税務機関への相続税申告、戸籍上の届出、財産登記の手続を機関ごとに分けます。",
];
const exactDeadlineStatement =
  "台湾財政部税務ポータルの相続案件の申請手続に関する案内は、2026年6月25日に更新されています。この案内は、財産目録の提出と相続放棄に関する裁判所手続について3か月、相続税申告について6か月という期間を示しています。どちらも一般的な期間です。起算点、延長、例外、管轄は事案ごとに確認が必要で、この案内を個別の期限計算に用いてはなりません。";
const exactOfficialNote =
  "公式法令ページでは、条文の改正日と施行日を確認します。英語版は補助資料です。日本語の説明と原文の条文を照合するために使います。司法院の書式と税務ポータルの案内が示すのは一般的な準備の方向性で、個別案件の管轄と提出要件は、受付機関の最新の案内で別途確認しなければなりません。";
const exactEnding = `---

本稿は、台湾の相続、夫婦財産制、親権、未成年後見を一般的に説明する教育目的の資料で、個別の相続事件や家事事件に関する法的助言ではありません。相続人の範囲、遺言、財産と債務、夫婦財産制、既存の裁判所の判断、渉外要素によって適用法も手続も結果も異なる場合があるため、相続放棄の3か月や相続税申告の一般的な6か月といった期限を計算する前に、また財産を処分する前に、最新の公式資料と個別事情を確認してください。

曾雋崴弁護士（Wei Tseng）`;
const expectedFrontmatter = `---
title: "台湾の相続と親権：遺された家族のための法律ガイド"
url: "https://www.wei-wei-lawyer.com/post/taiwan-inheritance-custody-analysis"
lastmod: "2026-10-06"
date_display: "2025年9月13日"
read_time: "約15分"
categories:
  - "台湾法律情報"
featured_image: "../images/016-taiwan-inheritance-custody-analysis/featured-generic.webp"
faq:
  - q: "遺言がなく、相続人が生存配偶者と子2人だけである場合、法定相続分はどのように計算されますか？"
    a: "台湾民法第1138条および第1144条によれば、生存配偶者は適用される順位の相続人と共同相続し、直系卑属は法定相続人の第1順位です。有効な遺言がなく、関係する相続人が生存配偶者と子2人だけであり、相続放棄、相続欠格、代襲相続その他結論を左右する事情がない場合、3人は通常、それぞれ3分の1ずつ相続します。これは説明のための仮定にすぎず、特定の相続事件について結論を示すものではありません。"
  - q: "生存配偶者の夫婦残余財産差額分配請求権は、法定相続分と同じ権利ですか？"
    a: "同じではありません。台湾民法第1030条の1に基づく夫婦残余財産差額分配請求権は、法定要件を満たす場合に生存配偶者が別個に主張できる権利であり、法定相続分とは区別して計算しなければなりません。婚姻中に取得したすべての財産が当然に計算対象となるわけではなく、生存配偶者が相続財産の半分を必ず取得するわけでもありません。夫婦財産制、各財産の取得原因と時期、債務および法定除外項目を確認した上で、個別に判断する必要があります。"
  - q: "父母の一方が死亡した場合、生存する父又は母の親権はどうなりますか？"
    a: "台湾民法第1089条により、父母の一方が未成年の子に対する権利を行使し義務を負担できないときは、他方がこれを行うのが原則です。したがって、生存する父又は母が親権を保持し、これに反する裁判所の判断がない場合、その者が通常、引き続き親権上の権利を行使し義務を負担します。ただし、既存の裁判、親権の制限・停止事由、渉外要素、子の最善の利益などの具体的事情によっては、裁判所の関与が必要となる場合があります。"
  - q: "生存する父又は母は、未成年の子が相続した財産を自由に使用できますか？"
    a: "できません。台湾民法第1087条および第1088条によれば、未成年者が相続によって取得した財産は子の特有財産であり、父母または後見人がその財産の実質的な所有者になるわけではありません。管理、使用、収益、法定代理および処分は子の利益のために行われなければならず、利益相反または重要な処分については、特別代理人の選任や裁判所の関与が問題となる場合があります。父母が子の相続財産を制限なく一方的に使用できると考えてはなりません。"
---
`;

function sectionAfter(content: string, heading: string) {
  return content.split(`${heading}\n\n`)[1]?.split("\n\n## ")[0] ?? "";
}

function extractPublicText(content: string) {
  return content
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/^---$/gm, "")
    .replace(/[「」『』“”‘’*_`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeForVariantScan(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("ja")
    .replace(/[\s\p{P}\p{S}]+/gu, "");
}

describe("Japanese family column 016 — anonymized inheritance and parental-rights guide", () => {
  it("publishes the exact frontmatter, sole H1, and four ordered FAQs", () => {
    const closingFrontmatter = raw.indexOf("\n---\n", 4);

    expect(raw.slice(0, closingFrontmatter + 5)).toBe(expectedFrontmatter);
    expect(parsed.data).toEqual({
      title,
      url: sourceUrl,
      lastmod: "2026-10-06",
      date_display: "2025年9月13日",
      read_time: "約15分",
      categories: ["台湾法律情報"],
      featured_image: featuredImage,
      faq,
    });
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(post).toMatchObject({
      slug: "taiwan-inheritance-custody-analysis",
      title,
      date: "2026-10-06",
      dateDisplay: "2025年9月13日",
      readTime: "約15分",
      category: "legal",
      categoryLabel: "台湾法律情報",
      featuredImage:
        "/images/blog/016-taiwan-inheritance-custody-analysis/featured-generic.webp",
      faq,
    });
    expect(parsed.data.faq).toHaveLength(4);
    expect(raw.split(sourceUrl)).toHaveLength(2);
  });

  it("uses the sole contracted generic image and no legacy image path", () => {
    const bodyImages = Array.from(
      parsed.content.matchAll(/!\[[^\]]*\]\([^)]+\)/g),
      (match) => match[0],
    );

    expect(bodyImages).toEqual([
      `![台湾の相続計画と未成年者の財産保護を表すイラスト](${featuredImage})`,
    ]);
    expect(raw.split(featuredImage)).toHaveLength(3);
    for (const legacyImage of [
      "featured-01.jpg",
      "img-01.jpg",
      "img-02.jpg",
      "img-03.jpg",
    ]) {
      expect(raw).not.toContain(legacyImage);
    }
  });

  it("keeps each FAQ answer in the front matter and its legal facts in the assigned H2 section", () => {
    const headingFacts: [string, string, string[]][] = [
      [
        "## 1. 法定相続人と法定相続分",
        faq1Answer,
        [
          "台湾民法第1138条が定めています。",
          "第1順位は直系卑属です。",
          "第1144条により、その案件で実際に適用される順位の相続人と共同で相続し",
          "有効な遺言がなく、関係する相続人は生存配偶者と子2人だけで、相続放棄、相続欠格、代襲相続その他結論を左右する事情もない場合を考えます。3人は通常、3分の1ずつ相続します。",
          "これは説明のための仮定にすぎません。特定の相続事件について結論を示す趣旨ではありません。",
        ],
      ],
      [
        "## 3. 生存配偶者の夫婦残余財産差額分配請求権",
        faq2Answer,
        [
          "同じ権利なのでしょうか。同じではありません。",
          "台湾民法第1030条の1に基づくこの請求権は、法定要件を満たす場合に生存配偶者が別個に主張できる権利で、法定相続分とは区別して計算しなければなりません。",
          "婚姻中に取得した財産がすべて当然に計算対象になるとは限らず、生存配偶者が相続財産の半分を必ず取得するとも限りません。",
          "夫婦財産制と、民法が定める算入・除外の範囲を確認します。",
          "婚姻中に生じた債務も考慮します。",
          "いずれも資料に基づき、個別に判断します。",
        ],
      ],
      [
        "## 5. 生存する父又は母の親権上の権利義務",
        faq3Answer,
        [
          "父母の一方が未成年の子に対する権利を行使し義務を負担できないときは、他方がこれを行うのが原則です（台湾民法第1089条）。",
          "生存する父又は母が親権を保持し、これに反する裁判所の判断がなければ、通常はその人が引き続き親権上の権利を行使し、義務を負担します。",
          "既存の裁判、親権の制限・停止事由、渉外要素、子の最善の利益などの具体的事情によっては、裁判所の関与が必要になる場合があります。",
        ],
      ],
      [
        "## 7. 未成年者の相続財産の保護",
        faq4Answer,
        [
          "生存する父又は母は、未成年の子が相続した財産を自由に使えるのでしょうか。使えません。",
          "台湾民法第1087条と第1088条によれば、未成年者が相続によって取得した財産は子の特有財産で、父母や後見人がその財産の実質的な所有者になるわけではありません。",
          "管理、使用、収益、法定代理、処分は、いずれも子の利益のために行わなければなりません。",
          "利益相反や重要な処分については、特別代理人の選任や裁判所の関与が問題になる場合があります。",
        ],
      ],
    ];

    for (const [heading, answer, facts] of headingFacts) {
      expect(raw.split(answer)).toHaveLength(2);
      for (const content of [parsed.content, post?.content ?? ""]) {
        const section = sectionAfter(content, heading);

        expect(section).not.toBe("");
        for (const fact of facts) {
          expect(section).toContain(fact);
        }
      }
    }
    expect(raw.match(/3分の1/g)).toHaveLength(2);
  });

  it("uses exactly the eleven contracted H2 sections in order", () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(headings);
  });

  it("locks the introduction, intestate order, concurrent spouse, and share limits", () => {
    const requiredPhrases = [
      "相続人は誰か、どの財産と債務が相続の対象か",
      "法定相続分と夫婦残余財産差額分配請求権、親権と未成年後見、法定代理権と財産の所有権",
      "第1順位は直系卑属です。父母、兄弟姉妹、祖父母がこの順に続きます。",
      "実際に適用される順位の相続人と共同で相続し",
      "死亡時期、親子関係、養子縁組関係、代襲相続の有無",
      "相続欠格事由があるか、適法な相続放棄があったか",
      "遺産分割協議または裁判手続",
      "抽象的な法定相続分と、特定の財産の最終的な帰属",
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it("locks wills, reserved portions, estate identification, and governing law", () => {
    const requiredPhrases = [
      "有効な遺言は、法定相続と違う分配方法を定められます。",
      "遺言の方式、遺言能力、解釈、執行可能性",
      "遺留分をはじめとする強行規定による制限",
      "一部の財産しか記載されていない遺言では",
      "被相続人の債務、保証責任、未納税金、葬儀関連費用",
      "実質的な所有関係、共有名義の持分、第三者の権利、担保設定",
      "保険金や退職給付",
      "信託契約の構造と受益権",
      "生前贈与や財産移転",
      "所在地の法律と台湾の準拠法規則",
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it("locks the separate Article 1030-1 calculation, exclusions, and adjustment", () => {
    const requiredPhrases = [
      "法定夫婦財産制が終了したとき",
      "夫婦それぞれの婚姻後の財産増加",
      "発生根拠、相手方、計算対象が異なります。",
      "被相続人に残る財産を相続財産として確定する",
      "相続や贈与によって取得した財産、慰撫金",
      "夫婦が別の財産制を合意していたか",
      "均等分配の結果が著しく不公平となるときです（第1030条の1）",
      "婚姻期間、家事労働と子の養育、経済的貢献、職業上の事情、財産の取得と管理の状況",
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it("locks inherited-debt limits, misconduct, waiver formalities, and deadlines", () => {
    const requiredPhrases = [
      "一身専属的な権利義務は除かれます（台湾民法第1148条）。",
      "原則として、相続によって取得した財産の価額までです。",
      "台湾民法第1174条により、相続放棄を希望する相続人は、相続権を知った時から3か月以内に",
      "親族の間で受け取らないと述べただけ、あるいは財産を使用しなかっただけで",
      "積極財産と消極財産の両方",
      "財産を隠匿する行為や財産目録から漏らす行為",
      exactDeadlineStatement,
      "相続放棄の書類は裁判所に提出し、相続税は税務機関に申告します。",
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expect(raw.split(exactDeadlineStatement)).toHaveLength(2);
  });

  it("locks parental rights, guardianship, appointment, and best-interests rules", () => {
    const requiredPhrases = [
      "未成年の子の保護・教養、居所に関する決定、法定代理、財産管理",
      "父母個人の利益のためには使えません。",
      "親権と相続は、法的に別個の問題です。",
      "父母双方が親権上の権利を行使し義務を負担できない場合です（台湾民法第1091条）",
      "父母の一方が死亡したというだけで、直ちに未成年後見が開始するとは断定できません",
      "第1093条は、最後に親権上の権利を行使し義務を負担する父または母が、遺言で未成年後見人を指定できると定めています。",
      "第1094条の法定順位と、第1094条の1の裁判所による選任",
      "候補者との関係と養育能力、財産管理の適切性、生活の安定性",
      "身上保護と財産管理の役割",
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it("locks minor ownership, joint management, conflicts, records, and supervision", () => {
    const requiredPhrases = [
      "特有財産は未成年者本人の財産です。",
      "自分の生活費や債務の弁済に使用してはなりません。",
      "処分代金の保管方法と使用計画",
      "台湾民法第1086条の特別代理人制度",
      "誰が子を代理して遺産分割協議や訴訟行為",
      "経済的利益が実際に対立するか",
      "財産目録の作成、証拠書類の保管、収入と支出の分離、裁判所への報告と監督",
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it("locks cross-border connecting factors, jurisdiction, documents, and procedures", () => {
    const requiredPhrases = [
      "当事者の国籍、住所と常居所、死亡当時の生活の本拠、財産の所在地",
      "台湾の「渉外民事法律適用法」",
      "国際裁判管轄",
      "外国裁判の承認と執行",
      "アポスティーユまたは領事確認と翻訳文",
      "子が他国に常居所を有するなら",
      "国外金融口座の届出、不動産移転税",
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it("uses exactly six source-aligned checklist items with all safeguards", () => {
    const checklistSection =
      parsed.content
        .split("## 9. 資料収集と手続の順序\n\n")[1]
        ?.split("\n\n## 10. 公式資料")[0] ?? "";
    const items = checklistSection.match(/^\d+\. .+$/gm) ?? [];

    expect(items).toHaveLength(6);
    checklistStarts.forEach((start, index) => {
      expect(items[index]).toMatch(
        new RegExp(`^${start.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`),
      );
    });
    for (const phrase of [
      "死亡診断書と死亡届",
      "婚姻・離婚・養子縁組",
      "認証、翻訳、氏名表記の一致",
      "名義と実質的な所有関係",
      "遺言執行者、遺贈の内容",
      "評価基準日、証拠書類",
      "補正の可否、延長の有無",
      "受領証と写し",
      "原本の保管場所と発行日・基準日",
      "アクセス権限を管理",
      "緊急性を理由に権限のない処分",
    ]) {
      expect(checklistSection).toContain(phrase);
    }
  });

  it("uses only the five official and three internal links in exact order", () => {
    const bodyLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\([^)]+\)/g),
      (match) => match[0],
    );
    const officialSection =
      parsed.content
        .split("## 10. 公式資料\n\n")[1]
        ?.split("\n\n## 11. 関連サービス")[0] ?? "";
    const relatedSection =
      parsed.content.split("## 11. 関連サービス\n\n")[1]?.split("\n\n---")[0] ??
      "";

    expect(bodyLinks).toEqual([...officialLinks, ...internalLinks]);
    expect(officialSection).toBe(
      `${officialLinks.map((link) => `- ${link}`).join("\n")}\n\n${exactOfficialNote}`,
    );
    expect(relatedSection.split("\n")).toEqual(
      internalLinks.map((link) => `- ${link}`),
    );
    for (const url of officialUrls) {
      expect(raw.split(url)).toHaveLength(2);
    }
  });

  it("ends with the exact disclaimer and sole correct signature", () => {
    expect(parsed.content.trimEnd().endsWith(exactEnding)).toBe(true);
    expect(raw.trimEnd().endsWith("曾雋崴弁護士（Wei Tseng）")).toBe(true);
    expect(raw.match(/曾雋崴/g)).toHaveLength(1);
    expect(raw).not.toContain("曾俊瑋");
  });

  it("resolves the canonical slug and inheritance-custody alias identically", () => {
    expect(post).toBeDefined();
    expect(aliasPost).toEqual(post);
    expect(post?.category).toBe("legal");
    expect(post?.categoryLabel).toBe("台湾法律情報");
  });

  it("locks the exact visible Japanese metrics, read time, and source hash", () => {
    const publicText = extractPublicText(parsed.content);
    const visibleJapaneseCount =
      publicText.match(
        /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu,
      )?.length ?? 0;
    const visibleKanaCount =
      publicText.match(/[\p{Script=Hiragana}\p{Script=Katakana}]/gu)?.length ??
      0;
    const calculatedMinutes = Math.ceil(visibleJapaneseCount / 500);

    expect(visibleJapaneseCount).toBe(7353);
    expect(visibleJapaneseCount).toBeGreaterThanOrEqual(4500);
    expect(visibleKanaCount).toBe(3213);
    expect(visibleKanaCount).toBeGreaterThanOrEqual(1500);
    expect(parsed.data.read_time).toBe(`約${calculatedMinutes}分`);
    expect(post?.readTime).toBe(`約${calculatedMinutes}分`);
    expect(crypto.createHash("sha256").update(raw).digest("hex")).toBe(
      "638c64743c0e80aaa25ee0ddff7a7c4a3add6473519d80508d19454817c7e247",
    );
  });

  it("contains no identity, media, speculation, overstatement, or locale leakage", () => {
    const serialized = [
      raw,
      parsed.content,
      post?.title ?? "",
      post?.content ?? "",
      JSON.stringify(parsed.data.faq),
      JSON.stringify(post?.faq),
    ].join("\n");
    const forbidden = [
      "구준엽",
      "서희원",
      "왕소비",
      "서희제",
      "具俊曄",
      "徐熙媛",
      "汪小菲",
      "徐熙娣",
      "Koo Jun-yup",
      "Barbie Hsu",
      "Wang Xiaofei",
      "Dee Hsu",
      "クー・ジュンヨプ",
      "大S",
      "SBS",
      "SBSニュース",
      "Harlem Yu",
      "合理的に推測",
      "遺産の大部分",
      "反対訴訟",
      "遺産を横領",
      "遺産を独占",
      "転居",
      "転校",
      "台湾を離れ",
      "未成年の子の意思",
      "最小変動の原則",
      "自動的に",
      "いかなる訴訟手続も必要なく",
      "唯一の親権者",
      "単独親権者",
      "家族は反対できません",
      "単独で子の財産を管理",
      "遺言は効力を有しません",
      "絶対的な相続人",
      "親権者の変更訴訟",
      "監護権",
      "養育権",
      "親権を取得",
      "親権を獲得",
      "残余財産分配請求権",
      "強制相続分",
      "留保分",
      "遺書",
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
      "대만 상속과 친권: 남은 가족을 위한 법률 안내",
      "台灣繼承與親權：遺屬法律指南",
      "Taiwan Inheritance and Parental Rights: A Guide for Surviving Families",
      "剩餘財產",
      "法定應繼分",
      "拋棄繼承",
    ]) {
      expect(serialized).not.toContain(leakage);
    }

    const proseWithoutAllowedEnglish = serialized
      .replace(/https?:\/\/\S+/g, "")
      .replace(/Wei Tseng/g, "");
    expect(proseWithoutAllowedEnglish).not.toMatch(
      /\b[A-Za-z]+(?:[ '-][A-Za-z]+){4,}\b/,
    );
  });
});
