import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-zh/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost(
  'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
  'zh-hant',
);

function extractBodyContracts(content: string) {
  return Array.from(
    content.matchAll(/^## \d+\. (.+)\n\n([^\n]+)$/gm),
    (match) => ({
      heading: match[1],
      answer: match[2],
    }),
  );
}

function extractPublicVisibleText(content: string) {
  return content
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^---$/gm, '')
    .replace(/[“”‘’*_`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const title =
  '進入台灣化粧品市場：進口主體、產品登錄、PIF 的建立與保存及廣告規範';

const faq = [
  {
    q: '在台灣銷售化粧品，是否一定要設立子公司或分公司？',
    a: '不一定。若由台灣進口業者（包括同時擔任銷售代理商者）負責進口及銷售，外國品牌可以不另設台灣子公司或分公司。若品牌要自行在台灣經營，台灣子公司與外國公司在台分公司的設立或登記、責任及稅務架構不同；僑外投資核准及公司或分公司登記所需時間，也會依個案及補件情形而異。應先確定商業模式，以及由誰擔任化粧品製造或輸入業者並承擔法定責任。',
  },
  {
    q: 'PIF 是什麼？與向 TFDA 辦理產品登錄是同一程序嗎？',
    a: '不是。產品登錄是化粧品製造或輸入業者透過 TFDA 化粧品產品登錄平台辦理的獨立程序。PIF 是彙整產品品質、安全、成分、功能、製造方法、試驗結果及安全性評估等資料的產品資訊檔案，由化粧品製造或輸入業者建立、更新並保存；PIF 本身無須事前提交 TFDA。自 2026 年 7 月 1 日起，其餘化粧品也納入 PIF 制度，原則上所有化粧品均受規範；僅免辦理工廠登記之化粧品製造場所生產的固態手工香皂例外。',
  },
  {
    q: '化粧品廣告應注意哪些表現？',
    a: '化粧品廣告不能只看個別用詞，而須就品名、文字敘述、圖案、符號、影像、聲音及其他訊息的相互關聯，依整體表現綜合判斷。不得有虛偽、誇大或醫療效能，例如宣稱治療痘痘、抗發炎或殺菌，均應特別審慎。行政罰鍰方面，虛偽或誇大廣告為新臺幣 4 萬元以上 20 萬元以下；涉及醫療效能者為新臺幣 60 萬元以上 500 萬元以下。網紅或評論者的貼文如依內容及商業脈絡實質上屬於廣告，也應按同一標準檢視。',
  },
];

const bodyContracts = [
  {
    heading: '進入台灣市場的方式與進口主體',
    answer: faq[0].a,
  },
  {
    heading: '產品登錄與 PIF 是不同制度',
    answer: faq[1].a,
  },
  {
    heading: '標示、宣傳及廣告規範',
    answer: faq[2].a,
  },
];

const officialSources = [
  'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030013',
  'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030097',
  'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030098',
  'https://www.fda.gov.tw/tc/newsContent.aspx?cid=3&id=30612',
  'https://www.fda.gov.tw/tc/newsContent.aspx?cid=3&id=30614',
  'https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f639179794512621908&iid=13384',
  'https://www.fda.gov.tw/TC/siteContent.aspx?sid=3435',
  'https://www.fda.gov.tw/TC/site.aspx?sid=12523',
  'https://law.moj.gov.tw/LawClass/LawAll.aspx?PCODE=L0030099',
  'https://law.moj.gov.tw/LawClass/LawGetFile.ashx?FileId=0000249593&lan=C',
  'https://www.mohw.gov.tw/cp-4256-48110-1.html',
  'https://investtaiwan.nat.gov.tw/showPage?lang=jpn&search=InvestmentStatus01',
  'https://mnscdn.moea.gov.tw/Mns/dir/content/Content.aspx?menu_id=42879',
];

const disclaimer =
  '本文僅供一般法律資訊與教育參考，不構成就任何個案提供的法律意見，亦不保證取得許可、完成登錄、得以銷售或在特定期間內完成程序。進入市場前，仍應依產品資料、進口架構、標示與廣告內容，以及主管機關最新法規與實務，就個案另行確認。';

describe('Traditional Chinese investment column 011 — cosmetics registration, PIF, and advertising', () => {
  it('publishes the contracted metadata, H1, and exactly three FAQs', () => {
    expect(parsed.data.title).toBe(title);
    expect(parsed.data.url).toBe(
      'https://www.wei-wei-lawyer.com/post/taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
    );
    expect(parsed.data.lastmod).toBe('2026-07-25');
    expect(parsed.data.date_display).toBe('2026年2月4日');
    expect(parsed.data.read_time).toBe('10分鐘閱讀');
    expect(parsed.data.categories).toEqual(['台灣公司設立']);
    expect(parsed.data.featured_image).toBe(
      '../images/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide/featured-01.jpg',
    );
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(parsed.data.faq).toEqual(faq);
    expect(parsed.data.faq).toHaveLength(3);

    expect(post?.slug).toBe(
      'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
    );
    expect(post?.title).toBe(title);
    expect(post?.date).toBe('2026-07-25');
    expect(post?.dateDisplay).toBe('2026年2月4日');
    expect(post?.readTime).toBe('10分鐘閱讀');
    expect(post?.category).toBe('formation');
    expect(post?.categoryLabel).toBe('公司設立');
    expect(post?.featuredImage).toBe(
      '/images/blog/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide/featured-01.jpg',
    );
    expect(post?.faq).toEqual(faq);
  });

  it('keeps each numbered H2 immediate answer identical to its FAQ answer', () => {
    expect(extractBodyContracts(raw)).toEqual(bodyContracts);
    expect(extractBodyContracts(parsed.content)).toEqual(bodyContracts);
    expect(extractBodyContracts(post?.content ?? '')).toEqual(bodyContracts);
  });

  it('uses exactly the contracted numbered sections and fixed subsections', () => {
    expect(
      Array.from(
        parsed.content.matchAll(/^## (\d+)\. (.+)$/gm),
        (match) => [match[1], match[2]],
      ),
    ).toEqual([
      ['1', '進入台灣市場的方式與進口主體'],
      ['2', '產品登錄與 PIF 是不同制度'],
      ['3', '標示、宣傳及廣告規範'],
    ]);
    expect(
      Array.from(
        parsed.content.matchAll(/^### (.+)$/gm),
        (match) => match[1],
      ),
    ).toEqual([
      '委由台灣進口業者處理',
      '由品牌自行在台灣經營',
      '產品登錄的時點與效期',
      'PIF 的內容與分階段施行',
      'PIF 的更新與保存',
      '查核、限期改正與行政處分',
      '依整體表現綜合判斷',
      '網紅、評論者與銷售夥伴',
      '上市前的確認順序',
      '官方資料',
    ]);
  });

  it('distinguishes the importer, subsidiary, branch, current agency, and statutory actor', () => {
    const requiredPhrases = [
      '由台灣進口業者或同時擔任銷售代理商的業者負責進口及銷售時，外國品牌可以採取不另設自有子公司或分公司的架構。',
      '不能只看代理、經銷、總代理等契約名稱，就認定誰承擔化粧品法規上的義務。',
      '最新資料的管理，以及契約終止時的移交',
      '廣告的事前檢視與修改權限',
      '必要時配合產品回收',
      '子公司是依台灣法律成立的獨立法人',
      '分公司則是外國公司本體在台灣登記的營業據點',
      '法人格、本公司責任、會計與稅務處理、盈餘移轉、代表權限',
      '經濟部投資審議司',
      '不宜以固定天數安排上市',
      '化粧品製造或輸入業者',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('separates product registration from PIF and locks timing, platform, and validity', () => {
    const requiredPhrases = [
      '產品登錄是化粧品製造或輸入業者透過 TFDA 化粧品產品登錄平台辦理的獨立程序。',
      '化粧品產品登錄在 TFDA 化粧品產品登錄平台辦理',
      '供應、販賣、贈送、公開陳列或提供消費者試用以前，即應完成產品登錄',
      '產品登錄的效期為三年。',
      '效期屆滿前三個月內辦理展延',
      '不代表 PIF 所需資料已全部齊備',
      '也不是產品標示或廣告合法的判斷',
      '應分別作為獨立的法令遵循項目管理',
      'PIF 本身無須事前提交 TFDA',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks the 16 PIF categories, full phase-in, narrow soap exception, and retained responsibility', () => {
    const requiredPhrases = [
      '將所需資料分為 16 個類別',
      '產品與製造業者的基本資料、標籤等佐證資料',
      '自 2026 年 7 月 1 日起，其餘化粧品亦納入適用，原則上所有化粧品均應遵守',
      '免辦理工廠登記的製造場所製造的固態手工香皂',
      '不足以單獨構成例外',
      '包括安全性評估在內的 PIF 業務，可以由具備所需資格與能力的第三人協助',
      '能相互傳遞變更資訊與最新簽署資料的機制',
      '化粧品製造或輸入業者的法律責任仍然維持',
      '即使利用第三人的撰寫協助或資料保存服務',
      '原製造者、試驗機構、安全性評估人員與台灣端業者',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('distinguishes Article 7 duration from Article 8 and Act Article 7 address', () => {
    const requiredPhrases = [
      '原料或配方、製造方法、製造場所、包含標籤在內的標示、宣稱功能或安全性資訊有變更時',
      '消費者申訴、不良反應案例、新的試驗結果是否影響既有評估',
      '依《化粧品產品資訊檔案管理辦法》第 7 條，PIF 應自產品最後上市日之次日起至少保存五年',
      '保存場所則依同辦法第 8 條，為《化粧品衛生安全管理法》第 7 條第 1 項第 7 款所定之化粧品製造或輸入業者標示地址',
      '規定期間的條文與規定場所的條文，應區分管理',
      '即使原製造者保有原本，或使用安全的電子或雲端儲存',
      '製造或輸入業者仍須能取用完整資料',
      '應訂定存取權限、備份、版本管理、檔案格式與負責人',
      '迅速檢索、提出資料',
      '與銷售夥伴或服務提供者的契約結束後',
      '法定保存期間內繼續維持',
      '宜在契約中處理移交對象、方式與存取權限是否存續',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('qualifies inspection notice and distinguishes false data, correction, and statutory measures', () => {
    const requiredPhrases = [
      '原則上應於查核日七日前通知',
      '符合相關規定所定法定例外情形時，得不經事前通知逕行查核',
      '在產品登錄申報虛偽資訊，或在 PIF 記載虛偽資訊',
      '新臺幣 1 萬元以上 100 萬元以下行政罰鍰',
      'PIF 資料不完整時，通常由主管機關命限期改正',
      '未於期限內改正時，才生罰鍰問題',
      '回收或銷毀並非所有 PIF 資料不齊時自動伴隨的措施',
      '應區分產品安全性、違規內容、改正情形與各措施適用的法定要件，分別判斷',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks the overall-presentation test, medical examples, fine ranges, and influencer qualification', () => {
    const requiredPhrases = [
      '品名、文句、圖像、符號、聲音、前後脈絡，以及消費者所得的整體印象',
      '治療痘痘、具有抗發炎效果或殺菌作用',
      '虛偽、誇大廣告的行政罰鍰為新臺幣 4 萬元以上 20 萬元以下',
      '涉及醫療效能的行政罰鍰為新臺幣 60 萬元以上 500 萬元以下',
      '網紅、評論者或銷售夥伴的貼文，也可能依內容與商業脈絡被認定實質上為廣告',
      '報酬給付、提供產品、銷售連結、品牌的發文指示、反覆合作',
      '並非所有個人貼文都自動成為品牌廣告',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('keeps the six-step premarket order', () => {
    const readinessSection =
      parsed.content
        .split('### 上市前的確認順序')[1]
        ?.split('### 官方資料')[0] ?? '';
    const sequence = [
      '決定直接設立台灣子公司、分公司，或委由台灣進口業者負責進口及銷售',
      '確認承擔化粧品製造或輸入業者法律責任的主體',
      '在供應、販賣、贈送、公開陳列或提供消費者試用前，完成產品登錄',
      '依產品別建立 PIF',
      '依整體表現標準檢視標籤',
      '建立應對查核與改正要求',
    ];
    const positions = sequence.map((step) => readinessSection.indexOf(step));

    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(Array.from(readinessSection.matchAll(/^\d+\. /gm))).toHaveLength(6);
  });

  it('uses all 13 official URLs once and only the three contracted internal links in order', () => {
    const actualOfficialSources = Array.from(
      parsed.content.matchAll(/\[[^\]]+\]\((https:\/\/[^)]+)\)/g),
      (match) => match[1],
    );
    expect(actualOfficialSources).toEqual(officialSources);

    for (const source of officialSources) {
      expect(raw.split(source)).toHaveLength(2);
    }
    expect(raw).toContain(
      '[TFDA：PIF 撰寫指引](https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f639179794512621908&iid=13384)',
    );
    expect(raw).toContain(
      '[化粧品廣告認定準則官方附表](https://law.moj.gov.tw/LawClass/LawGetFile.ashx?FileId=0000249593&lan=C)',
    );
    expect(raw).toContain(
      '[衛生福利部化粧品廣告規範公告](https://www.mohw.gov.tw/cp-4256-48110-1.html)',
    );

    const internalLinks = Array.from(
      raw.matchAll(/\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[0],
    );
    expect(internalLinks).toEqual([
      '[台灣公司設立基礎](/zh-hant/columns/taiwan-company-establishment-basics)',
      '[台灣投資及公司設立服務](/zh-hant/services#investment)',
      '[曾雋崴律師簡介](/zh-hant/lawyers/wei-tseng)',
    ]);
  });

  it('preserves exactly two images and ends with the contracted disclaimer and author', () => {
    expect(
      Array.from(
        parsed.content.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g),
        (match) => ({ alt: match[1], path: match[2] }),
      ),
    ).toEqual([
      {
        alt: '台灣化粧品市場進入所需的產品資料與法規檢視',
        path: '../images/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide/featured-01.jpg',
      },
      {
        alt: '',
        path: '../images/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide/img-01.jpg',
      },
    ]);
    expect(raw.trimEnd()).toMatch(
      new RegExp(`${disclaimer}\\n\\n\\*\\*曾雋崴律師（Wei Tseng）\\*\\*$`),
    );
    expect(parsed.content.match(/\p{Script=Han}/gu)?.length ?? 0).toBeGreaterThan(
      2_500,
    );
    expect(raw.length).toBeGreaterThan(6_000);
    expect(post?.content.length).toBeGreaterThan(5_000);
  });

  it('derives read_time from the exact visible Han count at 400 characters per minute', () => {
    const visibleText = extractPublicVisibleText(parsed.content);
    const hanCount = visibleText.match(/\p{Script=Han}/gu)?.length ?? 0;
    const calculatedMinutes = Math.ceil(hanCount / 400);

    expect(hanCount).toBe(3_765);
    expect(calculatedMinutes).toBe(10);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}分鐘閱讀`);
    expect(post?.readTime).toBe(`${calculatedMinutes}分鐘閱讀`);
  });

  it('removes prohibited PIF claims, stale actors, promises, locale leakage, and unsafe characters', () => {
    const forbiddenLiterals = [
      'PIF登錄',
      'PIF 登錄',
      '登錄PIF',
      'PIF 上傳',
      'PIF 核准',
      'PIF 認證',
      '代辦登錄',
      '證明市場銷售資格',
      '產品登錄者',
      '國內負責人',
      '投資審議委員會',
      '投資審查委員會',
      '投審會',
      '一般約需三個月',
      '罰金',
      '消費力',
      '客戶對話',
      '快速進軍',
      '品牌掌控',
      '完善代理合約',
      '身分證兼健康檢查報告',
      '行銷避雷',
      '繳學費',
      '快速回覆',
      '曾俊瑋',
      '登록',
      '/ko/',
      '/ja/',
      '/en/',
      '\uFEFF',
      '\u00A0',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(raw).not.toContain(forbidden);
    }
    expect(raw).not.toMatch(/PIF[^。\n]*(?:上傳|核准|認證)/);
    expect(raw).not.toMatch(
      /(?:手工香皂|手工皂)[^。\n]*(?:全部|所有|一律)[^。\n]*(?:例外|排除)/,
    );
    expect(raw).not.toMatch(
      /(?:全部|所有)網紅[^。\n]*貼文[^。\n]*(?:自動|一律|必然)[^。\n]*廣告/,
    );
    expect(raw).not.toMatch(
      /PIF[^。\n]*(?:缺漏|不完整)[^。\n]*(?:全部|所有|一律|自動|必然)[^。\n]*(?:下架|回收|銷毀)/,
    );
    expect(raw).not.toMatch(/[\uac00-\ud7af]/);
    expect(raw).not.toMatch(/[\u3040-\u30ff]/);
    expect(raw).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it('resolves the canonical and cosmetics-market-entry alias slugs in Traditional Chinese', () => {
    expect(post?.slug).toBe(
      'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
    );
    expect(getColumnPost('cosmetics-market-entry', 'zh-hant')?.slug).toBe(
      'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
    );
  });
});
