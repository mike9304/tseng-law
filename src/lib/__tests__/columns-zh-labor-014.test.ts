import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-zh/014-taiwan-mandatory-employment-period.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const canonicalSlug = 'taiwan-mandatory-employment-period';
const post = getColumnPost(canonicalSlug, 'zh-hant');
const aliasPost = getColumnPost('mandatory-employment', 'zh-hant');

const title = '台灣最低服務年限約定：效力、培訓費用與違約金判斷';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-mandatory-employment-period';
const featuredImage =
  '../images/014-taiwan-mandatory-employment-period/featured-01.jpg';
const bodyImage = `![台灣勞動契約最低服務年限與費用返還判斷示意圖](${featuredImage})`;
const faq1Answer =
  '不是。依《勞動基準法》第15條之1，雇主為勞工進行專業技術培訓並負擔其費用，或為使勞工遵守最低服務年限約定而提供合理補償時，約定才可能具備法定基礎。兩者不必同時具備；即使符合其中一項，仍須綜合培訓期間及成本、人力替補可能性、補償額度及範圍等因素，確認約定未逾合理範圍。';
const faq2Answer =
  '不能。依勞動部2026年6月5日函釋，例行教育訓練、一般在職訓練、新進人員熟悉工作環境與流程的訓練，以及法令要求雇主辦理的訓練，其費用均不得作為約定最低服務年限，或請求違約金、返還費用的依據。判斷時不能只看課程名稱，仍須查明課程內容、專業或技術性、期間、雇主實際負擔的成本及相關憑證。';
const faq3Answer =
  '不可以一概要求全額返還。簽約金、留任獎金或其他預付性給付如作為最低服務年限約定的合理補償，雇主必須向勞工清楚說明該給付的目的。依勞動部2026年6月5日函釋，勞工在期間屆滿前離職時，返還金額應按尚未履行期間的比例計算，不得要求全額返還；個案仍須一併檢視給付目的、約定內容、已服務期間及契約終止原因。';
const faq4Answer =
  '不必。依《勞動基準法》第15條之1第4項，勞動契約於最低服務年限屆滿前終止，如該契約之終止不可歸責於勞工，勞工不負違反最低服務年限約定或返還訓練費用之責任。不過，契約終止的實際原因及責任歸屬，仍應依解僱通知、離職意思表示、勞動條件變動資料及其他具體證據判斷。';
const faq = [
  {
    q: '台灣勞動契約中的最低服務年限約定，是否一律無效？',
    a: faq1Answer,
  },
  {
    q: '一般到職訓練或法定必辦的教育訓練，能否作為最低服務年限約定的依據？',
    a: faq2Answer,
  },
  {
    q: '提前離職時，雇主可以要求全額返還簽約金或留任獎金嗎？',
    a: faq3Answer,
  },
  {
    q: '勞動契約若因不可歸責於勞工之事由提前終止，仍須返還訓練費用嗎？',
    a: faq4Answer,
  },
];
const headings = [
  '1. 最低服務年限約定何時可能有效',
  '2. 第一項法定基礎：專業技術培訓與費用負擔',
  '3. 第二項法定基礎：合理補償',
  '4. 合理範圍與四項法定審酌因素',
  '5. 不得作為約定依據的教育訓練',
  '6. 獎金返還與提前離職',
  '7. 因不可歸責於勞工之事由終止勞動契約',
  '8. 離職預告是另一個問題',
  '9. 雇主與勞工檢核表',
  '10. 官方資料',
  '11. 相關資訊',
];
const officialLinks = [
  '[全國法規資料庫：《勞動基準法》第15條之1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=15-1&pcode=N0030001)',
  '[全國法規資料庫：《勞動基準法》第15條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=15&pcode=N0030001)',
  '[全國法規資料庫：《勞動基準法》第16條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=16&pcode=N0030001)',
  '[勞動部：勞動關2字第1150141814號函（2026年6月5日）](https://laws.mol.gov.tw/FLAW/FLAWDOC03.aspx?cnt=926&datatype=etype&edate=99991231&lnabndn=1&now=1&recordno=10&sdate=20180000)',
];
const officialUrls = officialLinks.map(
  (link) => link.match(/\((https?:\/\/[^)]+)\)$/)?.[1] ?? '',
);
const internalLinks = [
  '[台灣勞動法服務](/zh-hant/services/labor)',
  '[自願離職與資遣費例外說明](/zh-hant/columns/taiwan-voluntary-resignation-severance)',
  '[聯絡我們](/zh-hant/contact)',
];
const internalTargets = [
  '/zh-hant/services/labor',
  '/zh-hant/columns/taiwan-voluntary-resignation-severance',
  '/zh-hant/contact',
];
const disclaimer =
  '本文僅供一般法律資訊與教育用途，旨在說明台灣最低服務年限約定、培訓費用及預付性給付的返還，以及離職預告等問題，不構成針對任何個別勞動事件的法律意見。約定的效力與責任範圍，可能因契約類型與條款、實際培訓內容與成本、補償的目的與告知、已服務期間、契約終止原因及相關證據而異。作成離職意思表示、扣發工資、簽署返還協議或處理爭議前，仍應查核最新官方資料並確認個案具體事實。';
const author = '**曾雋崴律師（Wei Tseng）**';
const exactEnding = `- ${internalLinks[2]}

---

${disclaimer}

${author}`;

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

describe('Traditional Chinese labor column 014 — minimum-service-period clauses', () => {
  it('publishes the exact complete frontmatter, sole H1, image, and ordered FAQs', () => {
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
    expect(parsed.data.faq).toHaveLength(4);
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(parsed.content).toMatch(
      new RegExp(
        `^\\n# ${title}\\n\\n${bodyImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n`,
      ),
    );
  });

  it('uses only the contracted featured body image and removes the legacy stack', () => {
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

  it('uses exactly the eleven contracted H2s and two ordered checklist H3s', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(headings);
    expect(
      Array.from(parsed.content.matchAll(/^### (.+)$/gm), (match) => match[1]),
    ).toEqual(['雇主應確認的事項', '勞工應確認的事項']);
  });

  it('repeats each FAQ answer exactly twice and as its assigned section first paragraph', () => {
    const assignments = [
      ['## 1. 最低服務年限約定何時可能有效', faq1Answer],
      ['## 5. 不得作為約定依據的教育訓練', faq2Answer],
      ['## 6. 獎金返還與提前離職', faq3Answer],
      ['## 7. 因不可歸責於勞工之事由終止勞動契約', faq4Answer],
    ];

    for (const [heading, answer] of assignments) {
      expect(firstParagraphAfter(parsed.content, heading)).toBe(answer);
      expect(firstParagraphAfter(post?.content ?? '', heading)).toBe(answer);
      expect(raw.split(answer)).toHaveLength(3);
    }
  });

  it('locks the introduction four-question analysis and rejects signature-only conclusions', () => {
    const introduction = parsed.content.slice(
      parsed.content.indexOf(bodyImage) + bodyImage.length,
      parsed.content.indexOf(`## ${headings[0]}`),
    );
    const orderedQuestions = [
      '1. 是否具備第15條之1的法定基礎',
      '2. 約定期間與勞工負擔是否在合理範圍',
      '3. 契約終止是否可歸責於勞工',
      '4. 離職預告與返還範圍如何判斷',
    ];
    let previousIndex = -1;

    expect(introduction).toContain(
      '條款雖經雙方簽名，仍不能單憑簽名判定其效力，也不能因此直接確定返還項目及金額。',
    );
    expect(introduction).toContain(
      '培訓、簽約金或留任獎金，約定勞工在一定期間內任職，並在提前離開時要求返還款項或支付違約金',
    );
    for (const question of orderedQuestions) {
      const index = introduction.indexOf(question);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
  });

  it('separates alternative statutory bases, reasonableness, and invalidity', () => {
    const section = sectionBody(parsed.content, headings[0]);
    const requiredPhrases = [
      '第15條之1第1項規定兩項擇一的法定基礎：第一，雇主實際為勞工進行專業技術培訓並負擔費用；第二，雇主為使勞工履行最低服務年限約定而提供合理補償。個案至少須符合其中一項，不能只靠「雙方同意」、「公司制度」或契約標題補足法定基礎。',
      '第15條之1要求兩項法定基礎擇一具備，並另行接受合理性審查。這不表示專業技術培訓與合理補償必須同時提供，也不表示只要契約形式上記載其中一項，整份約定就當然有效。',
      '第2項的合理範圍審查',
      '並非第三個與培訓、補償並列的門檻',
      '違反第1項法定基礎或第2項合理性標準者，依第3項規定，其約定無效。',
      '因此，結論既不是所有最低服務年限條款一律有效，也不是一律無效。簽名可作為雙方曾有書面約定的證據，卻不能取代法律要件及事實證明。審閱時應先辨認雇主主張的是哪一項法定基礎，再核對相關給付、培訓與證明文件。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks professional-training proof and reasonable-compensation disclosure', () => {
    const trainingSection = sectionBody(parsed.content, headings[1]);
    const compensationSection = sectionBody(parsed.content, headings[2]);
    const trainingPhrases = [
      '雇主是否為該名勞工實際進行專業技術培訓，並確實負擔相關費用',
      '課綱、教材、教學方式、操作項目、測驗及結業標準',
      '開課與結束日期、每日時數、出席表、請假紀錄、作業、評量、證照或完成證明',
      '外部機構的學費、講師費、教材、設備使用及測驗費',
      '契約、發票、收據、匯款或會計資料相互勾稽',
      '內部課程不會只因在公司內舉辦就當然被排除，外部高價課程也不會只因價格或期間而當然符合要件。',
      '一般工作交接及專業技術課程，應按課程與時數分開整理',
    ];
    const compensationPhrases = [
      '另一項法定基礎，是雇主為使勞工遵守最低服務年限約定而提供合理補償。',
      '補償必須能與勞工原本因提供勞務應取得的工資及其他給付區分',
      '簽約金、留任獎金或預付性給付都只是常見名稱，不會因名稱本身自動成為合理補償。',
      '給付目的、金額、支付日期、歸屬條件、服務期間、提前終止時的處理及返還公式',
      '雇主應清楚向勞工揭示其作用',
      '補償不能使任何長度的服務期間或任何返還金額當然有效',
    ];

    for (const phrase of trainingPhrases) {
      expect(trainingSection).toContain(phrase);
    }
    for (const phrase of compensationPhrases) {
      expect(compensationSection).toContain(phrase);
    }
  });

  it('locks all four statutory factors and the individualized proportionality review', () => {
    const section = sectionBody(parsed.content, headings[3]);
    const orderedFactors = [
      '1. 雇主進行專業技術培訓的期間及成本',
      '2. 相同或類似職務勞工的人力替補可能性',
      '3. 雇主提供補償的額度及範圍',
      '4. 其他影響最低服務年限合理性的事項',
    ];
    let previousIndex = -1;

    for (const factor of orderedFactors) {
      const index = section.indexOf(factor);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    for (const phrase of [
      '費用項目、支付時間、個別勞工的分攤方式及培訓完成程度',
      '若主張的成本包含例行管理、法定訓練或與該名勞工無關的支出，應先予區分；無法歸屬於該名勞工的金額，不應納入約定期間合理性的判斷。',
      '工作內容、所需資格、人才來源、內部調度、實際招募經過及交接安排',
      '完成部分服務後取得多少權益，以及提前終止時須返還多少',
      '第四項因素可能包括約定經過、工作性質、向當事人說明的內容、實際任職期間及契約終止原因等各種影響合理性的情形。各因素的重要性會隨個案而異，應考量的事項也不限於上述例子，因此必須完整檢視紀錄中的相關事實。',
      '最後應綜合比較各項因素：服務期間是否與專業技術投資相稱、替補難度是否有資料支持、補償是否足以對應勞工承諾，以及返還公式是否反映已履行部分。不能因某一項因素存在，就忽略其他明顯失衡之處；也不應因職業類別相同，就把別件契約的期間或結果直接套用於本案。',
      '個案審查仍應以最終可由證據證明的事實為準。',
    ]) {
      expect(section).toContain(phrase);
    }
  });

  it('locks excluded routine training and the 2026 Ministry guidance', () => {
    const section = sectionBody(parsed.content, headings[4]);
    const requiredPhrases = [
      '勞動部勞動關2字第1150141814號函',
      '例行教育訓練、一般在職訓練、新進人員熟悉工作環境與流程的訓練，以及法令要求雇主辦理的訓練',
      '不得作為約定最低服務年限，或請求違約金、返還費用的依據',
      '雇主不能僅把這些項目記載為「培訓費」，就轉化成限制勞工任職或要求返還的法定基礎。',
      '所有公司內部課程均可不經調查就排除',
      '此時應取得完整課綱、逐日時間表、授課與出席紀錄、法令依據及支出憑證，分別確認各部分的性質與成本，不能僅憑課程總名稱一概認定。',
      '課程使用許多專業術語、設有考試或期間較長，也不能因此直接認定符合專業技術培訓要件。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks clear disclosure, proportional repayment, and separate claims', () => {
    const section = sectionBody(parsed.content, headings[5]);
    const requiredPhrases = [
      '哪一筆給付是最低服務年限約定的合理補償、約定期間何時起算及屆滿、服務多久可以取得多少權益',
      '約定期間起算日與屆滿日、各筆給付日、實際到職日與最後工作日，以及已服務與尚未履行的期間',
      '函釋要求按比例計算，正是為了避免忽略勞工已履行的服務期間。',
      '返還問題應依序確認約定效力、給付款項的法律性質、已服務期間、契約終止原因及返還計算方式，不能只因契約使用「違約金」一詞，就認定請求金額已經確定。',
      '專業技術培訓費用的返還、作為合理補償的預付性給付返還、固定違約金，以及雇主另行主張的損害，屬於不同請求。',
      '檢查同一筆成本是否重複計入不同請求',
      '工資扣款也不應被當成單純的算術步驟',
      '這些資料有助於區分已支付的給付、返還請求與實際扣款。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('locks protection for non-attributable termination and evidence-based attribution', () => {
    const section = sectionBody(parsed.content, headings[6]);
    const requiredPhrases = [
      '條文關注的並非契約是否在最低服務年限屆滿前終止，而是終止原因能否歸責於勞工。',
      '誰先作成終止意思表示、通知何時送達、通知所載理由為何',
      '解僱通知、離職書面、電子郵件、通訊訊息、合意終止文件、出勤與工作紀錄、職務或薪資變動資料',
      '不能只憑文件名稱判斷',
      '解僱、合意終止、勞動條件違反主張等只是需要檢視的情形，並不是不可歸責於勞工事由的封閉清單。',
      '不能只因勞工未任職至約定期間屆滿，就略過歸責分析而直接計算訓練費用。',
      '若另有預付性給付或其他損害請求，仍應分辨其法律性質與契約內容，不能把不同款項都改稱訓練費用，也不能僅憑同一終止事實，就一概認定所有請求是否成立。',
    ];

    for (const phrase of requiredPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('distinguishes resignation, notice, clause validity, repayment, and loss claims', () => {
    const section = sectionBody(parsed.content, headings[7]);
    const orderedRules = [
      '《勞動基準法》第15條準用第16條第1項的預告期間',
      '1. 繼續工作3個月以上未滿1年：10日前',
      '2. 繼續工作1年以上未滿3年：20日前',
      '3. 繼續工作3年以上：30日前',
      '特定性定期契約期限超過3年者',
      '勞工於屆滿3年後得終止契約，但應於30日前預告雇主',
    ];
    let previousIndex = -1;

    for (const rule of orderedRules) {
      const index = section.indexOf(rule);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
    for (const phrase of [
      '最低服務年限約定不會使勞工喪失終止勞動契約的權利。',
      '第16條本身規範雇主終止契約時的預告期間；勞工終止不定期契約時，則依第15條準用同一預告期間。',
      '不應與不定期契約依年資分成三段的預告期間混為一談',
      '繼續工作未滿3個月、其他定期契約，或勞工主張有法定得不經預告終止契約之事由時，不得逕行套用上述期間',
      '分別列明離職效力、預告期間、條款效力、返還責任與其他損害賠償請求',
    ]) {
      expect(section).toContain(phrase);
    }
  });

  it('locks both evidence checklists and their required ordered coverage', () => {
    const section = sectionBody(parsed.content, headings[8]);
    const employerItems = [
      '1. 先確認法定要件：雇主是否已為勞工提供專業技術培訓並負擔其費用，或已就遵守最低服務年限的承諾提供合理補償。',
      '2. 整理培訓課綱、教材、日期、時數、出席、評量及完成資料，並以發票、收據、付款與會計紀錄確認實際金額及負擔人',
      '3. 按課程區分例行教育、一般在職或到職訓練、法令要求辦理的訓練，以及符合要件的專業技術培訓',
      '4. 說明簽約金、留任獎金或其他預付性給付的目的，保存告知文件、支付日期、金額、歸屬條件及按未履行期間計算的返還公式',
      '5. 記錄約定服務期間的決定依據，說明其與實際培訓成本或補償的關聯',
      '相同或類似職務的人力替補可能性',
      '6. 在提出請求前計算勞工已任職與尚未履行期間',
      '7. 保存離職、解僱或合意終止的通知、原始通訊及送達證明',
      '8. 核對薪資明細、付款資料、雙方通訊、請求書與扣款紀錄，分別評估約定效力、離職預告、各類返還及另行損害主張',
    ];
    const workerItems = [
      '1. 保存已簽署的勞動契約、修正文件、獎金辦法及到職時取得的說明',
      '2. 收集培訓課程、日期、出席與完成資料、教材、發票及收據',
      '3. 對照課程實際內容，區分一般到職或在職訓練、法定必辦訓練與專業技術培訓，不因課程名稱或雇主提出的總額，便直接認定課程性質。',
      '4. 核對簽約金、留任獎金或預付性給付的目的與告知、支付日、實際入帳額、歸屬條件及返還公式',
      '5. 記錄約定服務期間如何決定、自己已任職及尚未履行多久',
      '6. 保存離職意思表示、解僱或合意終止通知及送達證明',
      '7. 保留薪資明細、付款紀錄、雇主請求書、協商文件及任何扣款紀錄',
      '8. 將條款效力、離職意思表示與預告、培訓費用或預付性給付返還，以及其他損害主張分開檢視，不因已簽名或收到付款請求，就認定責任已經確定。',
    ];
    let previousIndex = -1;

    for (const item of [...employerItems, ...workerItems]) {
      const index = section.indexOf(item);
      expect(index).toBeGreaterThan(previousIndex);
      previousIndex = index;
    }
  });

  it('uses only the four official and three ZH-Hant internal links in exact order', () => {
    const markdownLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g),
      (match) => match[0],
    );
    const externalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((https?:\/\/[^)]+)\)/g),
      (match) => match[1],
    );
    const markdownInternalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[1],
    );
    const allExternalUrls =
      parsed.content.match(/https?:\/\/[^\s)]+/g) ?? [];
    const allLocalePaths =
      parsed.content.match(/\/(?:ko|zh-hant|en|ja)(?:\/[^\s)]*)?/g) ?? [];

    expect(markdownLinks).toEqual([...officialLinks, ...internalLinks]);
    expect(externalTargets).toEqual(officialUrls);
    expect(markdownInternalTargets).toEqual(internalTargets);
    expect(allExternalUrls).toEqual(officialUrls);
    expect(allLocalePaths).toEqual(internalTargets);
    for (const url of officialUrls) {
      expect(parsed.content.split(url)).toHaveLength(2);
    }
    for (const link of [...officialLinks, ...internalLinks]) {
      expect(raw.split(link)).toHaveLength(2);
    }
  });

  it('locks the final related link, disclaimer, and canonical author at EOF', () => {
    expect(raw.trimEnd().slice(raw.lastIndexOf(`- ${internalLinks[2]}`))).toBe(
      exactEnding,
    );
    expect(parsed.content.trimEnd().endsWith(exactEnding)).toBe(true);
    expect(raw.trimEnd().endsWith(author)).toBe(true);
  });

  it('freezes the exact visible Han count, calculated read time, and source digest', () => {
    const publicText = extractPublicText(parsed.content);
    const visibleHanCount =
      publicText.match(/[\u3400-\u4DBF\u4E00-\u9FFF]/g)?.length ?? 0;
    const calculatedMinutes = Math.ceil(visibleHanCount / 400);
    const sourceSha256 = crypto
      .createHash('sha256')
      .update(raw)
      .digest('hex');

    expect(visibleHanCount).toBeGreaterThanOrEqual(3_200);
    expect(visibleHanCount).toBe(6_374);
    expect(calculatedMinutes).toBe(16);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}分鐘閱讀`);
    expect(post?.readTime).toBe(`${calculatedMinutes}分鐘閱讀`);
    expect(sourceSha256).toBe(
      '71458ca78e9a375683d5b41bcc5209c943f1b071f0a4b14a8faea596b1485e70',
    );
  });

  it('exposes source metadata, FAQ, image, and complete renderer-facing content', () => {
    expect(post).toMatchObject({
      slug: canonicalSlug,
      title,
      date: '2026-07-25',
      dateDisplay: '2025年9月13日',
      readTime: '16分鐘閱讀',
      category: 'legal',
      categoryLabel: '法律資訊',
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
  });

  it('resolves the canonical and mandatory-employment aliases to one ZH-Hant post', () => {
    expect(post).toBeDefined();
    expect(aliasPost).toBeDefined();
    expect(aliasPost?.slug).toBe(canonicalSlug);
    expect(aliasPost?.title).toBe(post?.title);
    expect(aliasPost?.date).toBe(post?.date);
    expect(aliasPost?.featuredImage).toBe(post?.featuredImage);
    expect(aliasPost?.faq).toEqual(post?.faq);
    expect(aliasPost?.content).toBe(post?.content);
  });

  it('removes forbidden legacy claims, figures, scripts, simplified terms, and wrong locales', () => {
    const forbiddenLiterals = [
      '幾乎都是違法的',
      '幾乎都是無效的',
      '必須同時滿足以下三個要件',
      '只要其中任何一項未能滿足',
      '183元新台幣',
      '27,470元新台幣',
      '10,030韓元',
      '2,096,270韓元',
      '500萬元新台幣',
      '20年的服務年限',
      '機師',
      '不必太擔心',
      '很大機率是違法的',
      '一般的加班費或出差費等不會被認定',
      '員工不能離職',
      '簽名就一定有效',
      '劳动',
      '合同',
      '培训',
      '费用',
      '补偿',
      '员工',
      '离职',
      '无效',
      '/ko/',
      '/en/',
      '/ja/',
      '\uFEFF',
      '\u00A0',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(raw).not.toContain(forbidden);
    }
    expect(raw).not.toMatch(
      /[\p{Script=Hangul}\p{Script=Hiragana}\p{Script=Katakana}]/u,
    );
    expect(raw).not.toMatch(
      /(?:三個|3個|三項|3項)[^。.\n]*(?:要件|條件)[^。.\n]*(?:同時|全部|都要)/,
    );
    expect(raw).not.toMatch(/(?:幾乎|很大機率)[^。.\n]*(?:違法|無效)/);
    expect(raw).not.toMatch(
      /(?:^|[。！]\s*)所有最低服務年限條款(?:均|都|一律)(?:有效|無效)/m,
    );
    expect(raw).not.toMatch(
      /最低服務年限(?![^。.\n]*不是)[^。.\n]*(?:禁止|不能|不得)[^。.\n]*離職/,
    );
    const visibleLatinWords =
      extractPublicText(parsed.content).match(/[A-Za-z]+/g) ?? [];
    expect(visibleLatinWords).toEqual(['Wei', 'Tseng']);
  });
});
