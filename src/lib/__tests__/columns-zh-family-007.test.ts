import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-zh/007-taiwan-divorce-lawsuit-qna.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const canonicalSlug = 'taiwan-divorce-lawsuit-qna';
const post = getColumnPost(canonicalSlug, 'zh-hant');
const aliasPost = getColumnPost('divorce-qna', 'zh-hant');

const title = '台灣離婚程序 Q&A：調解、訴訟、財產分配與子女';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-divorce-lawsuit-qna';
const featuredImage =
  '../images/007-taiwan-divorce-lawsuit-qna/featured-01.jpg';
const bodyImage = `![台灣離婚程序與涉外家事法律問題示意圖](${featuredImage})`;
const faq1Answer =
  '依民法第1050條，兩願離婚須以書面為之，並有二人以上證人於親見或親聞雙方確有離婚真意後簽名，且向戶政機關辦理離婚登記，始生效力。僅簽署協議書並不使離婚完成；如有涉外因素，尚須另行確認準據法、文書認證與翻譯，以及在其他國家或地區之申報等事宜。';
const faq2Answer =
  '並非必然如此。法院處理家事事件時，得命當事人或法定代理人本人到場，或依事件之性質以適當方法命其陳述或訊問；無正當理由而不從到場命令者，依家事事件法第13條準用民事訴訟法第303條，初次得處新臺幣三萬元以下罰鍰，但不得拘提。惟是否必須於同一空間共同調解，以及分離、安全、代理或其他程序上措施是否可行，仍應依法院及個案情形確認。';
const nonKoreanFaq3Addition = '該但書限制原則上合憲；但';
// The holding as it reads in the section 4 body; FAQ 3 repeats it after the connective 惟.
const constitutionalHoldingSentence =
  '憲法法庭112年憲判字第4號認為，未考量該重大事由是否已發生或持續相當期間，即完全剝奪唯一有責配偶之離婚機會，致個案顯然過苛者，於此範圍內違憲。';
const faq3Answer =
  `現行民法第1052條第2項規定，有前項以外之重大事由，難以維持婚姻者，夫妻之一方得請求離婚；其但書規定，該事由應由夫妻之一方負責者，僅他方得請求離婚。惟${constitutionalHoldingSentence}條文本身仍在，故不得一概謂有責配偶絕對可以或絕對不可以請求，而應視法院如何適用該判決意旨及具體事實。`;
const paragraph2Sentence =
  '現行民法第1052條第2項規定，有前項以外之重大事由，難以維持婚姻者，夫妻之一方得請求離婚；其但書規定，該事由應由夫妻之一方負責者，僅他方得請求離婚。';
const faq = [
  {
    q: '台灣兩願離婚只要簽署協議書就立刻生效嗎？',
    a: faq1Answer,
  },
  {
    q: '台灣法院的離婚調解，夫妻是否必須一起出庭？',
    a: faq2Answer,
  },
  {
    q: '對婚姻破綻應負責任的配偶，能否在台灣請求裁判離婚？',
    a: faq3Answer,
  },
];
// FAQ 4 to 6 of the former six were dropped from the hub on 2026-10-06 together with their sections;
// the linked zh columns carry those topics.
const droppedFaqQuestions = [
  '以婚前資金支付房價，或以一方名義登記，是否就決定所有權與財產分配？',
  '剩餘財產分配、離婚損害賠償、離婚後贍養費與子女扶養費是同一請求嗎？',
  '台灣法院以何種標準判斷未成年子女相關事項？',
];
const headings = [
  '1. 台灣離婚的三條路徑與涉外事件的首要確認事項',
  '2. 兩願離婚要件與戶政機關登記',
  '3. 法院調解、訴訟、到場與不服救濟',
  '4. 裁判離婚事由與有責配偶限制',
  '5. 外國婚姻、外國離婚與台灣戶籍',
  '6. 房屋名義、婚前資金與剩餘財產分配',
  '7. 離婚損害賠償、離婚後贍養費、未婚同居與第三人',
  '8. 未成年子女權利義務之行使或負擔與子女最佳利益',
  '9. 扶養費、會面交往、強制執行與暫時處分',
  '10. 攜同子女之跨境遷居',
  '11. 證據與實務準備',
  '12. 官方資料',
  '13. 相關指引',
];
const officialLinks = [
  '[全國法規資料庫：民法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000001)',
  '[法務部：民法英文版](https://mojlaw.moj.gov.tw/ENG/LawContentE.aspx?LSID=FL001351)',
  '[全國法規資料庫：家事事件法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0010048)',
  '[全國法規資料庫：民事訴訟法第303條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=303&pcode=B0010001)',
  '[全國法規資料庫：家事非訟事件暫時處分類型及方法辦法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0010056)',
  '[全國法規資料庫：戶籍法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0030006)',
  '[內政部戶政司：離婚登記說明](https://www.ris.gov.tw/documents/html/2/3/1/384.html)',
  '[全國法規資料庫：涉外民事法律適用法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000007)',
  '[憲法法庭112年憲判字第4號判決](https://cons.judicial.gov.tw/docdata.aspx?fid=52&id=310013)',
  '[憲法法庭112年憲判字第4號判決英文版](https://cons.judicial.gov.tw/en/docdata.aspx?fid=5534&id=352234)',
];
const officialUrls = officialLinks.map(
  (link) => link.match(/\((https?:\/\/[^)]+)\)$/)?.[1] ?? '',
);
const internalLinks = [
  '[台灣家事法律服務](/zh-hant/services/family)',
  '[台灣訴訟律師指南](/zh-hant/taiwan-litigation-lawyer)',
  '[聯絡諮詢](/zh-hant/contact)',
];
// The hub now sends the dropped detail to these existing zh-hant columns, one lead paragraph per section.
const hubColumnLinks = [
  {
    heading: headings[1],
    link: '[簽離婚協議書前：證人、財產拋棄與未登記的效力](/zh-hant/columns/divorce-agreement-terms-before-signing)',
  },
  {
    heading: headings[3],
    link: '[分居多年仍離不了婚？民法第1052條與有責配偶的離婚請求](/zh-hant/columns/judicial-divorce-grounds-civil-code-1052)',
  },
  {
    heading: headings[5],
    link: '[離婚時剩餘財產分配怎麼算？婚前存款、房貸與轉出款項的差別](/zh-hant/columns/remaining-property-distribution-calculation)',
  },
  {
    heading: headings[5],
    link: '[配偶的錢在海外，離婚時如何請求剩餘財產分配？](/zh-hant/columns/remaining-property-distribution-overseas-assets)',
  },
  {
    heading: headings[5],
    link: '[跨國夫妻的財產，適用哪一國法律？](/zh-hant/columns/taiwan-marital-property-regime-international-couples)',
  },
  {
    heading: headings[6],
    link: '[離婚後的贍養費與損害賠償：第1057條和第1056條的不同門檻](/zh-hant/columns/alimony-after-divorce-civil-code-1057)',
  },
  {
    heading: headings[6],
    link: '[配偶外遇求償：法院怎麼看證據、慰撫金與蒐證界線](/zh-hant/columns/spouse-affair-evidence-damages-taiwan)',
  },
  {
    heading: headings[7],
    link: '[離婚爭監護權，法院靠什麼認定子女最佳利益：社工訪視、家事調查官與孩子的聲音](/zh-hant/columns/child-custody-best-interests-social-worker-report)',
  },
  {
    heading: headings[8],
    link: '[離婚後子女扶養費怎麼算：生活支出、父母分擔與逾期給付](/zh-hant/columns/child-support-calculation-taiwan-court)',
  },
  {
    heading: headings[8],
    link: '[對方不讓看小孩，法院能做什麼：履行勸告、怠金與改定監護權的門檻](/zh-hant/columns/change-custody-visitation-refusal)',
  },
  {
    heading: headings[8],
    link: '[離婚還沒判，孩子九月要開學：家事暫時處分能先定什麼](/zh-hant/columns/provisional-order-during-divorce-custody-support)',
  },
  {
    heading: headings[8],
    link: '[子女扶養費的跨國執行：對方在國外，或手上是外國裁判](/zh-hant/columns/taiwan-child-support-enforcement-cross-border)',
  },
  {
    heading: headings[9],
    link: '[與台灣配偶離婚後想帶孩子住海外：親職計畫要能實行](/zh-hant/columns/taiwanese-spouse-divorce-cross-border-parenting)',
  },
  {
    heading: headings[9],
    link: '[怕孩子被帶出國不回來：海牙公約用不上，禁止出境的裁定一准一駁](/zh-hant/columns/child-taken-abroad-taiwan-parent-remedies)',
  },
];
const inlineColumnLinks = hubColumnLinks.map(({ link }) => link);
const disclaimer =
  '本文係供教育用途，旨在一般性說明台灣的離婚、涉外家事、夫妻財產及未成年子女制度，並非針對個別案件的法律意見。';
const staleDisclaimer =
  '本文僅供一般法律資訊參考，不構成個案法律意見。管轄、準據法、外國裁判或身分行為之承認、具體事實、證據、既有協議或裁判及最新官方規定，均可能影響結論；採取行動前，應依正確起算事由個別計算申請、救濟、時效與執行期間。';
const author = '曾雋崴律師（Wei Tseng）';
const exactEnding = `- ${internalLinks[2]}

---

${disclaimer}

${author}`;
const evidenceItems = [
  '1. 婚姻證明與台灣戶籍資料，以及各當事人國籍、住所、經常居所與現在住址。',
  '2. 書面離婚協議與證人確認離婚真意之經過、法院文件、送達紀錄、調解筆錄、和解筆錄、判決及確定證明等，依程序分別彙整。',
  '3. 外國婚姻或離婚紀錄、外國裁判或證明書、台灣駐外館處或其他有權機關之認證、中文譯本及其認證或公證情形，以及在台灣之承認、效力與登記狀態。',
  '4. 以中立年表整理所主張離婚事由之事件與時間，並將合法取得之通訊、醫療或警察資料及其他證據以原本狀態保存。',
  '5. 各子女之年齡、健康、教育、居住、過去與現在之照護經過、與其發展程度相稱之意願、與各父母之關係，以及安全與穩定相關資料，均自子女最佳利益觀點準備。',
  '6. 現行子女相關協議或裁判、扶養費給付與實際費用、會面交往經過、旅行文件、移動行程，以及具體跨境遷居計畫。',
  '7. 將申請、登記、上訴、抗告、請求權行使與執行之全部日期，各自連結至正確起算事由。判決之宣示、送達與確定，調解或和解之成立，知悉權利之日與法定財產制消滅日，不得混用。',
  '8. 配偶與子女之身分識別資料、地址、醫療、教育與金融資料，僅於必要範圍提供必要之人或機關，並就檔案存取權限、傳輸方式與複本銷毀建立隱私保護安排。',
];
const evidenceProhibitionSentence =
  '不得以違法監視、侵入帳號或裝置、追蹤、違反法律之錄音，或公開子女隱私，作為蒐證方法。';
// Re-frozen after the 2026-10-06 hub trim (sections 6 to 10 reduced to lead sentences plus links).
const frozenVisibleHanCount = 4_829;
const frozenSourceSha256 =
  '6bd706204b872e3dadd6b08ba0adddf654bafd1bf9dc9a5ef361e1c64c55719a';
const frozenSection4TailSha256 =
  '50ca1218b8183e84f8f4bdda1761ec0d7a58e50da5d28d331c8fa328c903d628';
const frozenSection5OnwardSha256 =
  '60c1e51538278aa15c90395c8ab570577f4a6f3956fbdabbdfb1652abcdeed6f';
const frozenSection9OnwardLength = 6_112;
const frozenSection9OnwardSha256 =
  '52972da0d2f7e58e18051b0ca70e1cd628653624f7e64bfc79a268308c97be3c';

function countOccurrences(value: string, needle: string) {
  return value.split(needle).length - 1;
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

describe('Traditional Chinese family column 007 — Taiwan divorce procedure Q&A', () => {
  it('publishes the exact complete frontmatter and loaded article identity', () => {
    expect(parsed.data).toEqual({
      title,
      url: sourceUrl,
      lastmod: '2026-10-06',
      date_display: '2025年9月13日',
      read_time: '10分鐘閱讀',
      categories: ['台灣法律資訊'],
      featured_image: featuredImage,
      faq,
    });
    expect(parsed.data.faq).toHaveLength(3);
    expect(post).toMatchObject({
      slug: canonicalSlug,
      title,
      date: '2026-10-06',
      dateDisplay: '2025年9月13日',
      readTime: '10分鐘閱讀',
      category: 'legal',
      categoryLabel: '法律資訊',
      featuredImage:
        '/images/blog/007-taiwan-divorce-lawsuit-qna/featured-01.jpg',
      faq,
    });
    expect(parsed.data.url).toBe(sourceUrl);
    expect(raw).toContain(sourceUrl);
    expect(post?.title).toBe(title);
    expect(post?.faq).toEqual(faq);
    expect(post?.content).toContain(`## ${headings[0]}`);
    expect(post?.content).toContain(disclaimer);
  });

  it('uses the sole exact H1 followed immediately by the sole contracted image', () => {
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(parsed.content).toMatch(
      new RegExp(
        `^\\n# ${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n${bodyImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n`,
      ),
    );
    expect(
      Array.from(
        parsed.content.matchAll(/!\[[^\]]*\]\([^)]+\)/g),
        (match) => match[0],
      ),
    ).toEqual([bodyImage]);
    expect(countOccurrences(raw, featuredImage)).toBe(2);
    expect(post?.content).not.toMatch(/!\[[^\]]*\]\([^)]+\)/);
    expect(raw).not.toContain('img-01.jpg');
  });

  it('uses exactly the thirteen contracted H2 sections in order', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(headings);
  });

  it('keeps each exact FAQ answer once in the frontmatter and the loader and not in the body, and drops FAQ 4 to 6', () => {
    for (const { q, a } of faq) {
      expect(countOccurrences(raw, a), q).toBe(1);
      expect(post?.faq?.map((item) => item.a), q).toContain(a);
      expect(post?.content, q).not.toContain(a);
    }
    expect(post?.faq).toHaveLength(3);

    for (const question of droppedFaqQuestions) {
      expect(raw, question).not.toContain(question);
      expect(post?.faq?.map((item) => item.q), question).not.toContain(
        question,
      );
    }
  });

  it('keeps only the source constitutional holding in both the FAQ 3 and section 4 copies and freezes everything after the section 4 lead', () => {
    const section4 = sectionBody(parsed.content, headings[3]);
    const section4Blocks = section4.split('\n\n');
    const section4Tail = section4Blocks.slice(2).join('\n\n');
    const section5Start = parsed.content.indexOf(`## ${headings[4]}`);
    const section5Onward = parsed.content.slice(section5Start);

    expect(countOccurrences(raw, nonKoreanFaq3Addition)).toBe(0);
    expect(countOccurrences(raw, constitutionalHoldingSentence)).toBe(2);
    expect(countOccurrences(section4, constitutionalHoldingSentence)).toBe(1);
    expect(section4Blocks[1]).toBe(
      '民法第1052條第1項列舉十款裁判離婚事由，夫妻之一方有下列情形之一者，他方得向法院請求離婚：',
    );
    expect(
      crypto.createHash('sha256').update(section4Tail).digest('hex'),
    ).toBe(frozenSection4TailSha256);
    expect(
      crypto.createHash('sha256').update(section5Onward).digest('hex'),
    ).toBe(frozenSection5OnwardSha256);
  });

  it('locks one exact substantive proposition in its assigned section for the eighteen surviving legacy topics', () => {
    // Legacy topics 5, 6, 10, 14, 16, 20 and 25 were dropped from the hub on 2026-10-06 (hub trim);
    // the linked zh columns carry them. Topics 2, 4, 7, 12, 17 and 21 are re-anchored to the sentence
    // that now carries the same proposition.
    const removedLegacyTopics = [5, 6, 10, 14, 16, 20, 25];
    const legacyCoverage = [
      {
        number: 1,
        heading: headings[0],
        phrase:
          '第一，當事人具備書面、證人與戶政機關登記要件的兩願離婚。',
      },
      {
        number: 2,
        heading: headings[4],
        phrase:
          '若身分行為或裁判已於外國成立，應先確認其在台灣之效力與承認可能性；若程序尚未開始，則應比較管轄、準據法，以及可預期之登記與執行效果。',
      },
      {
        number: 3,
        heading: headings[5],
        phrase:
          '以婚前儲蓄支付頭期款或貸款分期，並不當然使登記名義移轉；以一方名義登記，亦不當然終結全部契約、受益、償還或夫妻財產爭議。',
      },
      {
        number: 4,
        heading: headings[2],
        phrase:
          '分離場所、視訊方式、僅代理人到場或安全措施是否於特定事件中獲准，亦不能預先承諾，而應將情形陳明法院並確認程序指示。',
      },
      {
        number: 7,
        heading: headings[6],
        phrase:
          '民法第1030條之1之剩餘財產差額分配請求權、第1056條裁判離婚之損害賠償、第1057條對無過失配偶之贍養費，以及未成年子女之扶養費，其發生要件、計算與期間均不相同。',
      },
      {
        number: 8,
        heading: headings[2],
        phrase:
          '惟不得將「先離婚、子女事項日後再處理」視為一切事件皆可採用之普遍捷徑。',
      },
      {
        number: 9,
        heading: headings[1],
        phrase:
          '申請人、得否代理、身分證明與戶籍資料、離婚書面等實際準備文件，應以申請當時內政部戶政司離婚登記說明及管轄戶政事務所之確認為準。',
      },
      {
        number: 11,
        heading: headings[3],
        phrase:
          '民法第1052條第1項列舉十款裁判離婚事由，夫妻之一方有下列情形之一者，他方得向法院請求離婚：',
      },
      { number: 12, heading: headings[3], phrase: paragraph2Sentence },
      {
        number: 13,
        heading: headings[2],
        phrase:
          '家事事件法所定之家事事件，原則上於裁判前應經法院調解。',
      },
      {
        number: 15,
        heading: headings[6],
        phrase:
          '未結婚而同居之當事人，不因共同生活之事實，即取得離婚或配偶贍養等婚姻上權利。',
      },
      {
        number: 17,
        heading: headings[8],
        phrase:
          '子女扶養費之確定裁判或成立之和解，如其內容尚未實現，因情事變更，依原裁判或和解內容顯失公平者，法院得依聲請人或相對人聲請變更（家事事件法第102條第1項、第107條第2項）。',
      },
      {
        number: 18,
        heading: headings[8],
        phrase:
          '會面交往受阻時，應依既有協議或裁判之內容與執行可能性、受阻經過、子女之意願、安全與生活作息，檢討得否向法院聲請酌定、改定、執行或適當之暫時處分。',
      },
      {
        number: 19,
        heading: headings[2],
        phrase:
          '屬判決之上訴、裁定之抗告，或另就調解、和解之成立或效力爭執，路徑與期間均不相同。',
      },
      {
        number: 21,
        heading: headings[3],
        phrase:
          '但書文義本身並未自現行條文刪除；法院仍應於個案適用該判決之意旨。',
      },
      {
        number: 22,
        heading: headings[6],
        phrase:
          '姻親或其他第三人，並非第1057條所定離婚後贍養費之義務人。',
      },
      {
        number: 23,
        heading: headings[3],
        phrase:
          '警察失蹤報案得作為證明行蹤與經過之證據，但並非全部離婚請求之普遍法定前提。',
      },
      {
        number: 24,
        heading: headings[3],
        phrase:
          '僅離家數月一事，本身亦不當然構成任一離婚事由；尚應檢視離家原因、有無正當分居事由、聯繫與扶養、狀態是否繼續等具體事實。',
      },
    ];

    expect(legacyCoverage.map(({ number }) => number)).toEqual(
      Array.from({ length: 25 }, (_, index) => index + 1).filter(
        (number) => !removedLegacyTopics.includes(number),
      ),
    );
    for (const { heading, phrase } of legacyCoverage) {
      expect(sectionBody(parsed.content, heading)).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks the three paths and five separate cross-border questions', () => {
    const section = sectionBody(parsed.content, headings[0]);
    const requiredPhrases = [
      '第二，於法院成立調解或和解，依調解筆錄或和解筆錄使婚姻關係消滅的法院調解或和解離婚。',
      '第三，主張並證明法定離婚事由，由法院以判決准許的裁判離婚。',
      '台灣法院或行政機關是否具有管轄或處理權限；離婚、夫妻財產與子女問題應適用何地法律為準據法；外國離婚或裁判在台灣是否獲承認或具何種效力；台灣戶籍登記需要何種程序與經認證之文書；其他相關國家或地區是否另須申報、承認或執行。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Article 1050 elements and the qualified court-result registration rule', () => {
    const section = sectionBody(parsed.content, headings[1]);
    const requiredPhrases = [
      '書面作成、二人以上證人簽名，以及向戶政機關辦理離婚登記，各屬獨立要件。',
      '證人並非僅在既成文件上補列姓名之人，而須於親見或親聞雙方確有離婚真意後簽名。',
      '仍不因此單獨發生台灣兩願離婚之身分效力。',
      '外國作成之文書，依文書種類與作成地，可能須經台灣駐外館處或其他有權機關認證；官方說明要求時，尚應併附經認證或公證之中文譯本。',
      '台灣法院離婚判決確定，或法院調解、和解成立而使婚姻關係消滅時，原則上任一方得向戶政機關申請離婚登記。',
      '依戶籍法第48條，一般申請期間自判決確定或調解、和解成立之日起三十日。',
      '判決書或筆錄之送達、收受日，並非全部事件共通之起算點。',
      '逾期申請，戶政事務所仍應受理；書面催告後仍無人申請者，符合要件時，戶政事務所應依第48條之2逕為登記。',
      '申請期間經過之事實，並不使已生效之離婚失其效力。',
      '線上申辦僅限於法定申請期間內利用。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
    expect(section).not.toContain('30日只是線上申辦期間');
  });

  it('locks Family Act Article 13, the type-specific effects and review routes, and the open-issues check', () => {
    const section = sectionBody(parsed.content, headings[2]);
    const requiredPhrases = [
      '家事事件法第13條之制裁，僅於法院命當事人或法定代理人本人到場時始有適用。',
      '準用民事訴訟法第303條，初次得處新臺幣三萬元以下罰鍰，但不得據此拘提。',
      '其後法院再度合法通知，仍無正當理由不到場者，得連續處罰。',
      '分離場所、視訊方式、僅代理人到場或安全措施是否於特定事件中獲准，亦不能預先承諾',
      '調解或和解成立時，婚姻關係依法律所定方式消滅，並發生與確定裁判相同之效力。',
      '以判決准許之離婚，以判決確定為關鍵。',
      '應確認送達日、是否確定及程序上地位後，依該類型計算期間',
      '應一併檢視：未決財產如何保全與結算；子女居所、照護、醫療與教育需要何種協議或法院決定；扶養費與會面交往如何安排；以及爭執期間是否需要暫時處分以維護安全與生活連續性。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks Article 1052 paragraph 1 grounds, paragraph 2, the constitutional qualification, and the link to the dedicated grounds column', () => {
    const section = sectionBody(parsed.content, headings[3]);
    const grounds = [
      '1. 重婚。',
      '2. 與配偶以外之人合意性交。',
      '3. 夫妻之一方對他方為不堪同居之虐待。',
      '4. 夫妻之一方對他方之直系親屬為虐待，或夫妻一方之直系親屬對他方為虐待，致不堪為共同生活。',
      '5. 夫妻之一方以惡意遺棄他方在繼續狀態中。',
      '6. 夫妻之一方意圖殺害他方。',
      '7. 有不治之惡疾。',
      '8. 有重大不治之精神病。',
      '9. 生死不明已逾三年。',
      '10. 因故意犯罪，經判處有期徒刑逾六個月確定。',
    ];
    const requiredPhrases = [
      paragraph2Sentence,
      constitutionalHoldingSentence,
      '截至2026年10月6日，但書文義本身並未自現行條文刪除；法院仍應於個案適用該判決之意旨。',
      '生死不明已逾三年之第1項事由、惡意遺棄在繼續狀態中之第1項事由，以及其他重大事由致難以維持婚姻之第2項事由，彼此不同。',
      '亦無「必須先請求履行同居義務，始得主張惡意遺棄或其他重大事由」之普遍要件。',
      hubColumnLinks[1].link,
    ];

    let previousIndex = -1;
    for (const ground of grounds) {
      const index = section.indexOf(ground);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks foreign-record connecting factors and regional verification', () => {
    const section = sectionBody(parsed.content, headings[4]);
    const requiredPhrases = [
      '不能僅以「先在台灣補登婚姻」或「在台灣提起離婚訴訟」二途概括。',
      '宜分別確認當事人各國籍、住所與經常居所、婚姻或離婚作成之地點與方式、現行台灣戶籍與外國家庭關係紀錄，以及既有外國判決、調解筆錄或離婚證明之有無。',
      '他方是否曾受合法送達並有防禦機會等程序公正事項',
      '應具體特定在台灣所欲達成者究為婚姻關係消滅、戶籍變更、財產判斷或執行中之何種效果。',
      '在中國大陸作成之文書，與在香港、澳門作成之文書，各有別於一般外國文書之驗證規則',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('keeps the house-title three layers and the claim separations in the hub and sends the detail to the linked columns', () => {
    const section6 = sectionBody(parsed.content, headings[5]);
    const section7 = sectionBody(parsed.content, headings[6]);
    const section6Phrases = [
      '房屋登記名義與購屋資金來源雖屬重要證據，但所有權、贈與、借名登記、借貸、不當得利等個別請求，與民法第1030條之1之剩餘財產差額分配，係不同問題。',
      '房屋爭議宜分三層處理。',
      '第一，依登記與取得原因，確認特定財產之所有權歸屬。',
      '第二，依實際合意與資金提供性質，判斷贈與、借名登記、借貸、信託、不當得利、費用償還或其他契約上請求是否成立。',
      '第三，另行判斷該財產或其價值與相關債務，是否進入法定財產制消滅時之剩餘財產差額分配計算。',
    ];
    const section7Phrases = [
      '未結婚而同居之當事人，不因共同生活之事實，即取得離婚或配偶贍養等婚姻上權利。',
      '惟若有實際共有財產、借貸、契約、借名登記、信託、不當得利或侵權行為，仍得作為與婚姻有無無關之財產或債權關係分析。',
      '姻親或其他第三人，並非第1057條所定離婚後贍養費之義務人。僅主張第三人曾嚴重干涉或侮辱，亦不當然成立損害賠償。',
    ];

    for (const phrase of section6Phrases) {
      expect(section6).toContain(phrase);
    }
    for (const phrase of section7Phrases) {
      expect(section7).toContain(phrase);
    }
    // Article 1017/1030-1 detail now lives only in the linked columns; the hub states no adjustment test.
    expect(parsed.content).not.toContain('民法第1017條');
    expect(raw).not.toMatch(/1030條之1[^。\n]*顯失公平/);
  });

  it('keeps the full Taiwan parental-rights concept and the best-interests pointer in section 8', () => {
    const section = sectionBody(parsed.content, headings[7]);
    const requiredPhrases = [
      '台灣法上之完整概念為「未成年子女權利義務之行使或負擔」',
      '為敘述方便，或可簡稱「監護權」或「親權」，但不得將該簡稱誤認為已完整涵蓋台灣法上全部權利與義務。',
      '較高所得或婚姻破綻責任，至多僅為諸多事實之一，不能單獨作為決定標準或獎懲手段。',
      '法院依民法第1055條、第1055條之1酌定時的判斷因素',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
    expect(section).not.toContain('情事變更並非唯一法定門檻');
    expect(section).not.toContain('未盡保護教養義務');
    expect(section).not.toContain('對未成年子女有不利情事');
  });

  it('freezes section 9 onward as the section 8 to section 9 boundary and keeps the Family Act modification limited to judgments and court settlements', () => {
    const section8Start = parsed.content.indexOf(`## ${headings[7]}`);
    const section9Start = parsed.content.indexOf(`## ${headings[8]}`);
    const immutableSection9Onward = parsed.content.slice(section9Start);

    expect(section8Start).toBeGreaterThanOrEqual(0);
    expect(section9Start).toBeGreaterThan(section8Start);
    expect(Buffer.byteLength(immutableSection9Onward, 'utf8')).toBe(
      frozenSection9OnwardLength,
    );
    expect(
      crypto.createHash('sha256').update(immutableSection9Onward).digest('hex'),
    ).toBe(frozenSection9OnwardSha256);
    expect(sectionBody(parsed.content, headings[8])).toContain(
      '子女扶養費之確定裁判或成立之和解，如其內容尚未實現，因情事變更，依原裁判或和解內容顯失公平者，法院得依聲請人或相對人聲請變更（家事事件法第102條第1項、第107條第2項）。',
    );
  });

  it('locks Article 1116-2 support and Family Act Article 194 contact and enforcement qualifications', () => {
    const section = sectionBody(parsed.content, headings[8]);
    const requiredPhrases = [
      '依民法第1116條之2，父母對未成年子女之扶養義務，於離婚後仍繼續存在。',
      '會面交往受阻時，應依既有協議或裁判之內容與執行可能性、受阻經過、子女之意願、安全與生活作息，檢討得否向法院聲請酌定、改定、執行或適當之暫時處分。',
      '依家事事件法第194條執行時，方法仍應依子女最佳利益選擇，個案上可能涉及直接強制或間接強制。',
      '會面交往受阻一事，並不保證立即交付子女、使用強制力、改定權利義務之行使負擔，或處罰他方。',
      '既有執行名義之文義、給付期日、未給付金額與給付明細',
      '扶養費給付與會面交往履行，不得互為報復式交換條件，而應各自依義務與程序處理，以維護子女生活。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks the relocation authority check, non-treaty shortcut, and no unauthorized removal', () => {
    const section = sectionBody(parsed.content, headings[9]);
    const requiredPhrases = [
      '何人有權決定子女之居所與旅行；他方是否同意，或是否已有可適用之法院命令。',
      '不得預設1980年海牙兒童擄拐公約當然適用於台灣。',
      '亦不宜在違反既有協議或命令之情形下帶走或不送回子女',
      '移動前應確認合法同意、裁判及緊急保護途徑。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('uses the exact ordered eight-category evidence checklist and privacy prohibition', () => {
    const section = sectionBody(parsed.content, headings[10]);

    expect(
      section.split('\n').filter((line) => /^\d+\. /.test(line)),
    ).toEqual(evidenceItems);
    for (const item of evidenceItems) {
      expect(countOccurrences(section, item), item).toBe(1);
    }
    expect(section.trim().endsWith(evidenceProhibitionSentence)).toBe(true);
    expect(countOccurrences(section, evidenceProhibitionSentence)).toBe(1);
  });

  it('uses exactly the fourteen inline zh-hant column links, ten official links and three ZH-Hant internal links once and in order', () => {
    const markdownLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g),
      (match) => match[0],
    );
    const externalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((https?:\/\/[^)]+)\)/g),
      (match) => match[1],
    );

    expect(markdownLinks).toEqual([
      ...inlineColumnLinks,
      ...officialLinks,
      ...internalLinks,
    ]);
    expect(externalTargets).toEqual(officialUrls);
    for (const url of officialUrls) {
      expect(countOccurrences(parsed.content, url)).toBe(1);
    }
    for (const link of [
      ...inlineColumnLinks,
      ...officialLinks,
      ...internalLinks,
    ]) {
      expect(countOccurrences(raw, link)).toBe(1);
    }
    expect(parsed.content).not.toMatch(/\]\(\/(?:ko|en|ja)(?:\/|\))/);
  });

  it('places each dedicated-column link in its assigned section and every link resolves to a published zh-hant column', () => {
    for (const { heading, link } of hubColumnLinks) {
      expect(sectionBody(parsed.content, heading), link).toContain(link);
      const linkedSlug =
        link.match(/\(\/zh-hant\/columns\/([^)]+)\)$/)?.[1] ?? '';
      expect(getColumnPost(linkedSlug, 'zh-hant'), link).toBeDefined();
    }
    expect(
      hubColumnLinks.map(({ link }) => link.match(/\(\/zh-hant\/columns\/([^)]+)\)$/)?.[1]),
    ).toEqual([
      'divorce-agreement-terms-before-signing',
      'judicial-divorce-grounds-civil-code-1052',
      'remaining-property-distribution-calculation',
      'remaining-property-distribution-overseas-assets',
      'taiwan-marital-property-regime-international-couples',
      'alimony-after-divorce-civil-code-1057',
      'spouse-affair-evidence-damages-taiwan',
      'child-custody-best-interests-social-worker-report',
      'child-support-calculation-taiwan-court',
      'change-custody-visitation-refusal',
      'provisional-order-during-divorce-custody-support',
      'taiwan-child-support-enforcement-cross-border',
      'taiwanese-spouse-divorce-cross-border-parenting',
      'child-taken-abroad-taiwan-parent-remedies',
    ]);
  });

  it('ends with the exact disclaimer and author and nothing else', () => {
    expect(raw.trimEnd().endsWith(exactEnding)).toBe(true);
    expect(raw.trimEnd()).toMatch(
      /並非針對個別案件的法律意見。\n\n曾雋崴律師（Wei Tseng）$/,
    );
    expect(countOccurrences(raw, disclaimer)).toBe(1);
    expect(countOccurrences(raw, staleDisclaimer)).toBe(0);
    expect(countOccurrences(raw, author)).toBe(1);
  });

  it('freezes the exact visible Han count, calculated read time, and source digest', () => {
    const publicText = extractPublicText(parsed.content);
    const visibleHanCount =
      publicText.match(/\p{Script=Han}/gu)?.length ?? 0;
    // Lane policy 2026-10-06: zh read_time is recalculated at about 500 characters per minute.
    const calculatedMinutes = Math.round(visibleHanCount / 500);
    const sourceSha256 = crypto
      .createHash('sha256')
      .update(raw)
      .digest('hex');

    expect(visibleHanCount).toBe(frozenVisibleHanCount);
    expect(calculatedMinutes).toBe(10);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}分鐘閱讀`);
    expect(post?.readTime).toBe(`${calculatedMinutes}分鐘閱讀`);
    expect(sourceSha256).toBe(frozenSourceSha256);
  });

  it('resolves the canonical and legacy alias to the identical complete ZH-Hant article', () => {
    expect(post).toBeDefined();
    expect(aliasPost).toBeDefined();
    expect(aliasPost?.slug).toBe(canonicalSlug);
    expect(aliasPost?.title).toBe(title);
    expect(aliasPost?.content).toBe(post?.content);
    expect(aliasPost?.faq).toEqual(faq);
    expect(post?.content).toContain(`## ${headings[0]}`);
    expect(post?.content).toContain(`## ${headings[12]}`);
    expect(post?.content).toContain(disclaimer);
    expect(post?.content).toContain(author);
    expect(post?.content).not.toContain(`# ${title}`);
    expect(post?.content).not.toContain(bodyImage);
  });

  it('rejects exact legacy wording, semantic overclaims, promotional copy, and wrong identity', () => {
    const serialized = JSON.stringify({
      raw,
      parsedContent: parsed.content,
      postTitle: post?.title,
      postContent: post?.content,
      postFaq: post?.faq,
    });
    const forbiddenLiterals = [
      '收到判決書或調解筆錄之日起',
      '須在收到判決書或調解筆錄之日起',
      '外國結婚且希望在國外離婚，則依當地法律處理即可',
      '則依當地法律處理即可',
      '要在台灣離婚有兩種方式',
      '先在台灣補辦結婚登記後再辦理離婚',
      '婚姻財產一律對半',
      '平均每月消費支出作為判斷標準',
      '贍養費和剩餘財產分配請求權都必須在離婚之日起5年內提出',
      '離婚之日起5年內提出',
      '有過錯的一方一般不能提起離婚訴訟',
      '外遇的一方目前仍無法提起離婚訴訟',
      '憲法法庭已刪除第1052條第2項但書',
      '須先向警察局報失蹤',
      '可以先向法院聲請履行同居義務，之後再提起離婚訴訟',
      '可以按照韓國的物價水準請求撫養費',
      '可以按照韓國的物價水準',
      '私訊',
      '留言',
      'DM',
      '曾俊瑋',
      'img-01.jpg',
      '此為法條所定疾病用語，並非對品德或性格之評價。',
      '準用民事訴訟法第303條，得處新臺幣三萬元以下罰鍰',
      '子女的經常居所',
      '댓글',
      'reply promptly',
      'お気軽にコメント',
      '歡迎隨時留言',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(serialized).not.toContain(forbidden);
    }
    expect(raw).not.toContain('婚姻財產一律對半');
    expect(raw).not.toContain('婚後財產全部平均分配');
    expect(raw).not.toContain('婚前資金當然決定所有權');
    expect(raw).not.toContain('登記名義當然決定所有權');
    expect(raw).not.toContain('收到判決書或調解筆錄之日起30日');
    expect(raw).not.toContain('30日只是線上申辦期間');
    expect(raw).not.toContain('逾期使離婚失效');
    expect(raw).not.toContain('逾期使已生效的離婚失效');
    expect(raw).not.toContain('有責配偶絕對不得請求');
    expect(raw).not.toContain('有責配偶絕對可以請求');
    expect(raw).not.toContain('有責配偶永遠不得請求');
    expect(raw).not.toContain('外遇一方絕對不得請求離婚');
    expect(raw).not.toContain('外遇的一方目前仍無法提起離婚');
    expect(raw).not.toContain('有過錯的一方無權');
    expect(raw).not.toContain('憲法判決已刪除第1052條第2項但書');
    expect(raw).not.toContain('憲法法庭已刪除第1052條第2項但書');
    expect(raw).not.toContain('須先向警察局報失蹤');
    expect(raw).not.toContain(
      '可以先向法院聲請履行同居義務，之後再提起離婚訴訟',
    );
    expect(raw).not.toContain(
      '先向法院聲請履行同居義務，之後再提起離婚訴訟',
    );
    expect(raw).not.toContain('失蹤報案為普遍前提');
    expect(raw).toContain(
      '亦無「必須先請求履行同居義務，始得主張惡意遺棄或其他重大事由」之普遍要件。',
    );
    expect(raw).not.toContain('離家數月本身就是離婚事由');
    expect(raw).not.toContain('扶養費變更必須有不可預見事件');
    expect(raw).not.toContain('扶養費變更必須有無法預見');
    expect(raw).not.toContain('會面交往受阻當然允許用強');
    expect(raw).not.toContain('阻撓會面交往當然允許');
    expect(raw).not.toContain('無法探視子女時，可以向法院聲請強制執行。');
    expect(raw).not.toContain('可以按照韓國的物價水準請求');
    expect(raw).not.toContain('韓國生活費本身決定子女扶養費');
    expect(raw).not.toContain('韓國生活費水準逕成為扶養費');
    expect(raw).not.toContain('海牙兒童擄拐公約當然適用台灣');
    expect(raw).not.toContain('海牙公約自動適用於台灣');
    expect(raw).not.toContain('律師保證勝訴');
    expect(raw).not.toContain('本所確保所有權利');
    expect(raw).toContain(
      '會面交往受阻一事，並不保證立即交付子女、使用強制力、改定權利義務之行使負擔，或處罰他方。',
    );
  });

  it('contains no invisible characters, cross-locale routes, or visible script leakage', () => {
    expect(raw).not.toContain('﻿');
    expect(raw).not.toContain(' ');
    expect(raw).not.toContain('​');
    expect(raw).not.toMatch(/\]\(\/(?:ko|en|ja)(?:\/|\))/);
    expect(parsed.content).not.toMatch(/[぀-ヿ]/);
    expect(parsed.content).not.toMatch(/[가-힯]/);
    expect(parsed.content).not.toMatch(
      /(?:reply promptly|お気軽にコメント|Taiwan Divorce Q&A|대만 이혼)/,
    );
  });
});
