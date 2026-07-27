import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-zh/016-taiwan-inheritance-custody-analysis.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('taiwan-inheritance-custody-analysis', 'zh-hant');
const aliasPost = getColumnPost('inheritance-custody', 'zh-hant');

const title = '台灣繼承與親權：遺屬法律指南';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-inheritance-custody-analysis';
const featuredImage =
  '../images/016-taiwan-inheritance-custody-analysis/featured-generic.webp';
const faq1Answer =
  '依《民法》第1138條及第1144條，配偶與當順位的繼承人共同繼承，直系血親卑親屬則為第一順位繼承人。若沒有有效遺囑，相關繼承人只有配偶及二名子女，且不存在拋棄繼承、喪失繼承權、代位繼承或其他足以改變結論的情形，三人通常各有三分之一的應繼分。這只是用來說明規則的假設，並非對任何實際繼承事件所作的判斷。';
const faq2Answer =
  '不同。《民法》第1030條之1所定夫妻剩餘財產差額分配請求權，是在符合法定要件時，生存配偶得另行主張的權利，必須與繼承權及應繼分分開計算。並非婚姻關係存續中取得的所有財產都當然列入計算，生存配偶也不必然取得遺產的一半。仍應依夫妻財產制、各項財產的取得原因與時間、債務及法定不列入項目，按個案判斷。';
const faq3Answer =
  '依《民法》第1089條，父母一方不能行使對未成年子女的權利時，原則上由他方行使；父母不能共同負擔義務時，則由有能力的一方負擔。因此，若生存父母仍保有親權，且沒有內容相反的法院裁判，通常由該生存父母繼續行使、負擔對未成年子女的權利義務。惟既有裁判、親權受限制或停止的事由、涉外因素及未成年子女最佳利益等具體情形，仍可能需要法院介入。';
const faq4Answer =
  '不可以。依《民法》第1087條及第1088條，未成年子女因繼承取得的財產屬於子女的特有財產，父母或監護人不會因此成為該財產的所有權人。管理、使用、收益、法定代理及處分都必須以子女利益為依歸；如有利益衝突或重大處分，可能須選任特別代理人或由法院介入。不得將父母的管理權理解為可以不受限制地單方使用子女的繼承財產。';
const faq = [
  {
    q: '如果沒有遺囑，繼承人只有配偶及二名子女，應如何計算應繼分？',
    a: faq1Answer,
  },
  {
    q: '配偶的剩餘財產差額分配請求權，與繼承權或應繼分相同嗎？',
    a: faq2Answer,
  },
  {
    q: '父母一方死亡後，生存父母如何行使、負擔未成年子女的權利義務？',
    a: faq3Answer,
  },
  {
    q: '生存父母可以自由使用未成年子女因繼承取得的財產嗎？',
    a: faq4Answer,
  },
];
const headings = [
  '1. 法定繼承人與應繼分',
  '2. 遺囑與遺產範圍的確認',
  '3. 配偶的剩餘財產差額分配請求權',
  '4. 繼承債務與拋棄繼承',
  '5. 生存父母對未成年子女權利義務的行使與負擔',
  '6. 監護人的指定與法院介入',
  '7. 未成年子女繼承財產的保護',
  '8. 涉外家庭的準據法與程序',
  '9. 實務準備清單',
  '10. 官方資料',
  '11. 相關服務',
];
const officialLinks = [
  '[全國法規資料庫：《民法》](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000001)',
  '[法務部主管法規查詢系統：《民法》英文版](https://mojlaw.moj.gov.tw/ENG/LawContentE.aspx?LSID=FL001351)',
  '[全國法規資料庫：《涉外民事法律適用法》](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000007)',
  '[司法院：家事聲請狀—聲請選定未成年人之監護人](https://www.judicial.gov.tw/tw/cp-1369-4219-da7e1-1.html)',
  '[財政部稅務入口網：繼承案件申辦流程（含應備文件）](https://www.etax.nat.gov.tw/etwmain/tax-info/house-land-transfer-taxtation-calculation-area/inheritance/file-process)',
];
const officialUrls = officialLinks.map(
  (link) => link.match(/\((https?:\/\/[^)]+)\)$/)?.[1] ?? '',
);
const internalLinks = [
  '[台灣家事訴訟服務](/zh-hant/services/family)',
  '[台灣訴訟律師指南](/zh-hant/taiwan-litigation-lawyer)',
  '[聯絡我們](/zh-hant/contact)',
];
const disclaimer =
  '本文旨在一般性說明台灣的繼承、夫妻財產制、親權及未成年人監護制度，僅供法律資訊與教育參考，不構成對任何個別繼承或家事事件的法律意見。實際適用的法律、程序及結果，可能因繼承人範圍、遺囑、財產與債務、夫妻財產制、既有法院裁判及涉外因素而異。計算拋棄繼承、稅務申報等期限或處分財產前，仍應查核最新官方資料及個案事實。';
const author = '**曾雋崴律師（Wei Tseng）**';

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

describe('Traditional Chinese family column 016 — inheritance and parental-rights guide', () => {
  it('publishes the exact frontmatter, sole H1, and four ordered FAQs', () => {
    expect(parsed.data).toEqual({
      title,
      url: sourceUrl,
      lastmod: '2026-07-25',
      date_display: '2025年9月13日',
      read_time: '16分鐘閱讀',
      categories: ['台灣法律資訊'],
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
      readTime: '16分鐘閱讀',
      category: 'legal',
      categoryLabel: '法律資訊',
      featuredImage:
        '/images/blog/016-taiwan-inheritance-custody-analysis/featured-generic.webp',
      faq,
    });
  });

  it('uses only the contracted generic image and removes every legacy image path', () => {
    const bodyImages = Array.from(
      parsed.content.matchAll(/!\[[^\]]*\]\([^)]+\)/g),
      (match) => match[0],
    );

    expect(bodyImages).toEqual([
      `![台灣繼承規劃與未成年子女財產保護示意圖](${featuredImage})`,
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

  it('repeats every FAQ answer exactly twice and as the assigned H2 first paragraph', () => {
    const headingAnswers = [
      ['## 1. 法定繼承人與應繼分', faq1Answer],
      ['## 3. 配偶的剩餘財產差額分配請求權', faq2Answer],
      ['## 5. 生存父母對未成年子女權利義務的行使與負擔', faq3Answer],
      ['## 7. 未成年子女繼承財產的保護', faq4Answer],
    ];

    for (const [heading, answer] of headingAnswers) {
      expect(firstParagraphAfter(parsed.content, heading)).toBe(answer);
      expect(firstParagraphAfter(post?.content ?? '', heading)).toBe(answer);
      expect(raw.split(answer)).toHaveLength(3);
    }
    expect(raw.match(/三分之一/g)).toHaveLength(2);
  });

  it('uses exactly the eleven contracted H2 sections in order', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(headings);
  });

  it('locks the intestate, will, estate-identification, and spouse-claim rules', () => {
    const requiredPhrases = [
      '依序為直系血親卑親屬、父母、兄弟姊妹及祖父母',
      '依第1144條與實際取得繼承權的該順位親屬共同繼承',
      '是否發生代位繼承',
      '法定方式、遺囑能力、特留分與其他強行規定限制',
      '實質所有關係、共同持有比例、質權或抵押權',
      '保險金須檢查受益人指定與契約條款',
      '退休或撫卹給付須查其法源與領取順序',
      '信託財產則須釐清信託財產的權利歸屬、受益權內容及委託人死亡後的處理安排',
      '權利基礎及計算標的均不相同',
      '因繼承或其他無償取得的財產、慰撫金等法定不列入項目',
      '平均分配顯失公平時，法院得依婚姻共同生活及協力情形等因素調整或免除分配額',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks inherited-debt limits, waiver formalities, and qualified official deadlines', () => {
    const exactDeadlineStatement =
      '財政部稅務入口網的「繼承案件申辦流程（含應備文件）」於2026年6月25日更新，內容說明陳報遺產清冊與拋棄繼承之法院程序的一般三個月期間，以及遺產稅申報的一般六個月期間。惟起算點、延長、例外及管轄仍應依個案確認，不得據此直接計算個別案件的期限。';
    const requiredPhrases = [
      '對被繼承人債務的責任，原則上以因繼承所得遺產為限',
      '隱匿遺產、在遺產清冊為虛偽記載或有其他法定不當行為',
      '向法院陳報清冊、聲請公示催告',
      '知悉得繼承之時起三個月內，以書面向法院為之',
      '口頭告知親屬、不參與遺產分配、簽署私人協議或未取走財物，都不等於完成法定拋棄程序',
      exactDeadlineStatement,
      '法院、稅務、戶籍及財產登記是彼此不同的程序',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expect(raw.split(exactDeadlineStatement)).toHaveLength(2);
  });

  it('locks surviving-parent, guardianship, and court-involvement safeguards', () => {
    const requiredPhrases = [
      '保護教養、住所安排、醫療與教育決定、身分行為協力、法定代理及財產管理',
      '親權與繼承是不同制度',
      '未成年人無父母，或父母均不能行使、負擔對其權利義務時才開始適用',
      '父母一方死亡而另一方仍可依法行使親權，通常不是直接啟動監護的充分理由',
      '得以遺囑指定監護人',
      '第1094條第一項的法定順序確定監護人',
      '第1094條之1',
      '法院選定或改定監護人時，則應依第1094條之1，以受監護人的最佳利益為準',
      '法律規定的聲請權人',
      '不能把行使親權的父母與監護人視為相同身分',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks ownership, conflicts, special representation, and supervision of a minor’s property', () => {
    const requiredPhrases = [
      '特有財產，重點在於財產歸未成年子女本人所有',
      '避免與父母、監護人或其他家屬的財產混同',
      '依第1088條，未成年子女的特有財產由父母共同管理，父母並有使用、收益之權；但非為子女利益，不得處分',
      '依第1086條評估向法院聲請選任特別代理人',
      '財產清冊開具、報告義務、處分限制及法院監督的規定',
      '不能取代對管轄、期限、法定代理或緊急保全的個案判斷',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks cross-border connecting factors and the six ordered checklist starts', () => {
    const requiredPhrases = [
      '國籍、住所、慣常居所、死亡時生活重心、財產所在地、外國婚姻或離婚、既有親權裁判',
      '《涉外民事法律適用法》',
      '國際管轄、外國裁判的承認及執行、相關條約',
      '認證、驗證、翻譯或公證',
      '遺產稅、所得稅、贈與稅、帳戶申報、不動產移轉與公司股權登記',
    ];
    const checklistStarts = [
      '1. 確認死亡證明、死亡登記、親屬關係、戶籍資料及既有法院裁判。',
      '2. 盤點財產、債務、登記名義、保險受益人、信託及生前財產移轉。',
      '3. 檢查遺囑的法定方式、效力、執行內容及特留分。',
      '4. 分別計算應繼分與夫妻剩餘財產差額分配請求權。',
      '5. 確認未成年子女財產的歸屬、法定代理及利益衝突。',
      '6. 分別確認法院、稅務、戶籍登記及財產登記程序與各項期限。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    let previousIndex = -1;
    for (const item of checklistStarts) {
      const index = parsed.content.indexOf(item);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
  });

  it('uses only the five official and three internal Markdown links, once each and in order', () => {
    const markdownLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g),
      (match) => match[0],
    );
    const externalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((https?:\/\/[^)]+)\)/g),
      (match) => match[1],
    );

    expect(markdownLinks).toEqual([...officialLinks, ...internalLinks]);
    expect(externalTargets).toEqual(officialUrls);
    for (const url of officialUrls) {
      expect(parsed.content.split(url)).toHaveLength(2);
    }
    for (const link of [...officialLinks, ...internalLinks]) {
      expect(raw.split(link)).toHaveLength(2);
    }
    const sourceUseCaution =
      '使用上述官方資料時，請先至全國法規資料庫等官方立法頁面確認法規的修正日期與施行日期；所列英文版《民法》條文僅供輔助參考，引用時應與官方中文原文逐條核對。司法院家事聲請狀範本及財政部稅務入口網頁僅屬一般準備指引，實際管轄機關、申請程序及應備文件，仍應以各受理機關最新公告的說明為準。';
    expect(raw).toContain(sourceUseCaution);
    expect(post?.content).toContain(sourceUseCaution);
  });

  it('ends with the exact disclaimer and author and nothing else', () => {
    expect(raw.trimEnd()).toBe(
      `${raw.slice(0, raw.indexOf(disclaimer))}${disclaimer}\n\n${author}`,
    );
    expect(raw.trimEnd()).toMatch(
      /個案事實。\n\n\*\*曾雋崴律師（Wei Tseng）\*\*$/,
    );
  });

  it('freezes the exact visible Han count, calculated read time, and source digest', () => {
    const publicText = extractPublicText(parsed.content);
    const visibleHanCount =
      publicText.match(/\p{Script=Han}/gu)?.length ?? 0;
    const calculatedMinutes = Math.ceil(visibleHanCount / 400);
    const sourceSha256 = crypto
      .createHash('sha256')
      .update(raw)
      .digest('hex');

    expect(visibleHanCount).toBeGreaterThanOrEqual(4_500);
    expect(visibleHanCount).toBe(6_395);
    expect(calculatedMinutes).toBe(16);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}分鐘閱讀`);
    expect(post?.readTime).toBe(`${calculatedMinutes}分鐘閱讀`);
    expect(sourceSha256).toBe(
      '2f9f651b80fa69669147473a8397f28060292dabb2576322b1d7884c7da564ba',
    );
  });

  it('resolves the canonical and legacy alias slugs to identical ZH-Hant content', () => {
    expect(post).toBeDefined();
    expect(aliasPost).toBeDefined();
    expect(aliasPost?.slug).toBe(post?.slug);
    expect(aliasPost?.title).toBe(post?.title);
    expect(aliasPost?.content).toBe(post?.content);
    expect(aliasPost?.faq).toEqual(post?.faq);
  });

  it('removes identities, media, speculation, private details, and legal overstatements', () => {
    const serialized = JSON.stringify({
      raw,
      parsedContent: parsed.content,
      postTitle: post?.title,
      postContent: post?.content,
      postFaq: post?.faq,
    });
    const forbiddenLiterals = [
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
      'SBS News',
      'SBS新聞',
      'SBSニュース',
      'Harlem Yu',
      '合理推測',
      '遺產大部分應為婚前財產',
      '未來將有兩方面的訴訟',
      '反對訴訟',
      '侵占遺產',
      '獨占遺產',
      '兩名子女',
      '兩個孩子',
      '搬家',
      '轉學',
      '離開台灣',
      '未成年子女之意願',
      '最小變動原則',
      '自動成為',
      '無須任何訴訟程序',
      '不需要訴訟',
      '法院不必介入',
      '唯一親權人',
      '單獨親權人',
      '家屬無法反對',
      '無法提起反對訴訟',
      '可以單獨管理子女的財產',
      '遺囑不具效力',
      '遺囑無效',
      '絕對繼承人',
      '監護權',
      '撫養權',
      '放棄繼承',
      '強制繼承分',
      '保留份',
      '剩餘財產分配請求權',
      '殘餘財產',
      '倖存配偶',
      '倖存父母',
      '取得親權',
      '獲得親權',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(serialized).not.toContain(forbidden);
    }
    expect(serialized).not.toMatch(
      /具[\s·-]*俊曄|徐[\s·-]*熙媛|汪[\s·-]*小菲|徐[\s·-]*熙娣/u,
    );
    expect(serialized).not.toMatch(
      /Koo\s+Jun[-\s]?yup|Barbie\s+Hsu|Wang\s+Xiaofei|Dee\s+Hsu|Harlem\s+Yu/i,
    );
    expect(serialized).not.toMatch(
      /(?:^|[^A-Za-z])SBS(?:\s*News|新聞|ニュース)?(?:[^A-Za-z]|$)/i,
    );
    expect(raw).not.toMatch(
      /(?:遺產|遺產總額|遺產價值)[^。.\n]*(?:約\s*)?\d[\d,.]*\s*(?:億|萬|元|美元|新台幣)/,
    );
    expect(raw).not.toMatch(
      /遺產[^。.\n]*(?:大部分|婚前|婚後)[^。.\n]*(?:推測|推斷|應為|估計)/,
    );
    expect(raw).not.toMatch(
      /(?:家屬|親屬|配偶|父母|子女)[^。.\n]*(?:訴訟|爭訟|爭議)[^。.\n]*(?:預測|預計|必然|一定會)/,
    );
    expect(raw).not.toMatch(
      /(?:親權|監護人)[^。.\n]*(?:自動|無須[^。.\n]*法院|法院[^。.\n]*不必介入)/,
    );
    expect(raw).not.toMatch(/遺囑[^。.\n]*(?:不具效力|無效)/);
    expect(raw).not.toMatch(
      /(?:父母|監護人)[^。.\n]*(?:子女|未成年人)[^。.\n]*(?:財產|遺產)[^。.\n]*(?:自由|任意|不受限制|單獨)[^。.\n]*(?:管理|使用|處分)(?:。|$)/,
    );
  });

  it('contains no locale leakage, simplified high-signal characters, invisible text, emoji, or wrong author', () => {
    expect(raw).not.toMatch(/[\p{Script=Hangul}\p{Script=Hiragana}\p{Script=Katakana}]/u);
    expect(raw).not.toMatch(/[后发里个这从还当该会无产权应对开关过时国学术业书门见长东丝]/u);
    expect(raw).not.toMatch(/\]\(\/(?:ko|ja|en)(?:\/|\))/);
    expect(raw).not.toContain('대만 상속과 친권: 남은 가족을 위한 법률 안내');
    expect(raw).not.toContain(
      'Taiwan Inheritance and Parental Rights: A Guide for Surviving Families',
    );
    expect(raw).not.toContain(
      '台湾の相続と親権：遺された家族のための法律ガイド',
    );
    expect(raw).not.toMatch(/[\uFEFF\u00A0\u200B]/u);
    expect(raw).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(raw).not.toContain('曾俊瑋');
  });
});
