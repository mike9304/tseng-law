import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-zh/017-taiwan-logistics-business-setup.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('taiwan-logistics-business-setup', 'zh-hant');

function extractBodySections(content: string) {
  return Array.from(
    content.matchAll(/^## \d+\. (.+)\n\n([^\n]+)$/gm),
    (match) => ({
      heading: match[1],
      a: match[2],
    }),
  );
}

function extractPublicText(content: string) {
  return content
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^---$/gm, '')
    .replace(/[「」『』“”‘’*_`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const faq = [
  {
    q: '在台灣經營物流相關業務，一律都需要取得「汽車貨運業」許可嗎？',
    a: '不一定。「物流」是範圍廣泛的實務用語，是否需要許可，不能只看公司名稱或登記的營業項目。公司如收取報酬，使用貨運汽車運送他人貨物，可能構成汽車貨運業；但倉儲、包裝、物流系統營運、以貨主身分交運自有貨物或運送承攬等業務，仍應依契約關係、運送責任、報酬內容及車輛實際營運方式個案判斷。',
  },
  {
    q: '新設一般汽車貨運業的資本額、車輛門檻與主要程序為何？',
    a: '一般汽車貨運業原則上最低資本額為新臺幣2,500萬元，並須備有20輛以上全新貨運汽車。專營搬家業務者的標準為新臺幣1,000萬元及8輛以上新車；在金門、馬祖地區營業者為新臺幣1,000萬元及5輛以上新車，並受核准營業區域限制。個人經營小貨車運輸業另有範圍狹窄的制度，包含設籍於管轄區域、持有小型車職業駕駛執照，以及使用本人所有、車齡2年以內的小貨車1輛等要件。外國人投資、依《公路法》第35條報請交通部核准、籌設許可、公司或商業登記、車輛與設施設置、營業執照及加入同業公會等程序，均應分別確認。',
  },
  {
    q: '收購已取得許可的公司，就會自動取得汽車貨運業營業執照嗎？',
    a: '不會。股權收購不等於取得或移轉營業執照；標的公司仍以同一法人身分存續，並繼續作為許可主體持有原執照。若採營業讓與或資產讓與，出讓公司的執照也不會當然移轉給受讓人。應查核營業執照的效力與核准範圍、車輛與營業用牌照、停車設施、同業公會資格、違規及欠繳款項、保險、擔保與契約中的控制權變更條款，並辦理外國人投資及公路主管機關所要求的核准或變更程序。',
  },
  {
    q: '將實際運送委託給持有許可的台灣業者後，委託公司就一定不需要汽車貨運業許可或工作許可嗎？',
    a: '不能一概而論。應視委託方究竟只是貨主或運送承攬人，或是在運送契約中自行以運送人身分收取報酬而定。應查核受託方的營業執照及營業用車輛，並確保契約角色與實際營運一致，以避免借牌或無照運送。外國人即使僅具股東或投資人身分，也不因此取得在臺工作資格；實際從事工作或經營管理者，應在開始工作前另行確認工作許可及居留資格。',
  },
];

const bodySections = [
  {
    heading: '物流業務與「汽車貨運業」的範圍',
    a: faq[0].a,
  },
  {
    heading: '新設汽車貨運業',
    a: faq[1].a,
  },
  {
    heading: '收購既有業者',
    a: faq[2].a,
  },
  {
    heading: '委外運輸與外國人工作許可',
    a: faq[3].a,
  },
];

describe('Traditional Chinese investment column 017 — logistics and motor freight', () => {
  it('publishes the contracted frontmatter and exactly four exact FAQs', () => {
    expect(parsed.data.title).toBe(
      '台灣物流業與「汽車貨運業」許可：新設、收購與委外',
    );
    expect(parsed.data.url).toBe(
      'https://www.wei-wei-lawyer.com/post/taiwan-logistics-business-setup',
    );
    expect(parsed.data.lastmod).toBe('2026-07-25');
    expect(parsed.data.date_display).toBe('2025年9月13日');
    expect(parsed.data.read_time).toBe('10分鐘閱讀');
    expect(parsed.data.categories).toEqual(['台灣公司設立']);
    expect(parsed.data.featured_image).toBe(
      '../images/017-taiwan-logistics-business-setup/featured-01.jpg',
    );
    expect(parsed.content).toContain(
      '# 台灣物流業與「汽車貨運業」許可：新設、收購與委外',
    );
    expect(parsed.data.faq).toHaveLength(4);
    expect(parsed.data.faq).toEqual(faq);

    expect(post?.slug).toBe('taiwan-logistics-business-setup');
    expect(post?.title).toBe(parsed.data.title);
    expect(post?.date).toBe('2026-07-25');
    expect(post?.dateDisplay).toBe('2025年9月13日');
    expect(post?.readTime).toBe('10分鐘閱讀');
    expect(post?.category).toBe('formation');
    expect(post?.categoryLabel).toBe('公司設立');
    expect(post?.faq).toEqual(faq);
  });

  it('keeps the four ordered body headings and immediate answers aligned with the FAQs', () => {
    expect(extractBodySections(raw)).toEqual(bodySections);
    expect(extractBodySections(post?.content ?? '')).toEqual(bodySections);
  });

  it('distinguishes broad logistics services from regulated carriage', () => {
    const requiredPhrases = [
      '倉儲、包裝、物流資訊系統、運送承攬、自有商品出貨',
      '收取運費後以貨運汽車運送他人貨物',
      '費用如何收取、貨損或事故由誰負責、誰決定派車',
      '誰與貨主成立運送契約，誰向客戶收取運費或物流服務費',
      '車輛、營業用牌照、駕駛、派車與實際行駛由誰管理',
      '《公路法》第3條所定中央公路主管機關為交通部',
      '交通部公路局及所屬機關提供',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('states every threshold, narrow exception, and the exact plate restriction', () => {
    const requiredPhrases = [
      '最低資本額新臺幣2,500萬元及全新貨運汽車20輛以上',
      '最低資本額新臺幣1,000萬元及全新貨運汽車8輛以上',
      '最低資本額新臺幣1,000萬元及全新貨運汽車5輛以上',
      '營業範圍受核准區域限制',
      '在管轄區域設有戶籍、持有小型車職業駕駛執照',
      '本人所有、車齡2年以內的小貨車1輛',
      '不是外國法人進入台灣汽車貨運業時通常可以採用的途徑',
      '新設汽車運輸業者獲發的營業用車輛牌照，自發照日起一年內，不得辦理繳銷或車輛登記上的過戶轉讓。',
      '不能籠統認定每一業者都必須自行承租專用停車場',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('states Article 35, the current agency, qualified routes, and the ordered setup flow', () => {
    const requiredPhrases = [
      '《公路法》第35條',
      '非中華民國國民或法人',
      '中央公路主管機關（即交通部）核准',
      '經濟部投資審議司',
      '並非所有外國投資均適用同一申請窗口或程序',
      '投資上市、上櫃公司有價證券',
      '外國公司在臺設立分公司',
      '科學園區或產業園區主管機關',
      '中國大陸投資',
      '《公路法》第35條所定的交通部核准',
    ];
    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }

    const setupSection = parsed.content.slice(
      parsed.content.indexOf('### 新設程序的主要順序'),
      parsed.content.indexOf('## 3.'),
    );
    const sequence = [
      '確認業務實質',
      '外國人投資程序',
      '汽車貨運業籌設許可',
      '完成公司或商業登記',
      '申請營業執照',
    ];
    const positions = sequence.map((step) => setupSection.indexOf(step));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('covers facilities, representative documents, and qualified timing', () => {
    const requiredPhrases = [
      '所有權或合法使用權證明',
      '公司章程、股東名簿、停車設施核准資料',
      '維修契約、購車證明及車輛清冊',
      '對照公路局最新書表與檢核資料',
      '原則上應在6個月內完成籌備',
      '延長期間最長為6個月',
      '原則上應於1個月內開業，並檢附所屬同業公會核發之有效會員證影本，向管轄公路主管機關報備',
      '無法保證整體流程在固定期間內完成',
      '不等於新設汽車貨運業全部階段所需時間',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('distinguishes share acquisition, asset transfer, diligence, and Article 23 changes', () => {
    const requiredPhrases = [
      '匯入臺灣的交易款項屬股權收購價款，並非標的公司的增資款',
      '經濟部投資審議司的事前核准',
      '匯款後的投資額審定',
      '出讓公司的營業執照也不會當然由受讓人承受',
      '《汽車運輸業管理規則》第23條',
      '汽車運輸業如有營業讓與，或組織、名稱、地址、負責人、資本或資產、停車設施等事項變更',
      '核准業別、營業區域、附款及尚未完成的變更',
      '行政處分、稅捐、規費、罰鍰或其他欠繳款項',
      '擔保權、租賃或融資',
      '重要契約及控制權變更條款',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('qualifies outsourcing risks and separates investment, work, and residence', () => {
    const requiredPhrases = [
      '將實際運送委託給持有汽車貨運業許可的台灣業者',
      '只是貨主或運送承攬人，還是自行以運送人名義與客戶締約並收取運費',
      '以避免借牌營運或由無照業者實際運送',
      '服務水準、貨物滅失、毀損或遲延、事故與保險、再委託、個人資料與物流資料',
      '契約終止後的資料、貨物及客戶服務移交預作安排',
      '股東或投資人，不表示同時取得在台工作或居留資格',
      '在開始工作前，依實際職務確認是否須取得工作許可',
      '可能遭處罰鍰並被限令出國',
      '原則上可能適用3年的禁止入國期間',
      '免予禁止入國或縮短期間的情形',
      '不能將第三人的檢舉與特定處分結果直接畫上等號',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses every official source and only the three contracted Chinese internal links', () => {
    const officialSources = [
      'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040001',
      'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040004',
      'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040003',
      'https://www.thb.gov.tw/cp.aspx?n=392',
      'https://www.thb.gov.tw/cp.aspx?n=507',
      'https://cyi2.thb.gov.tw/cp.aspx?n=1962',
      'https://www.thb.gov.tw/cl.aspx?n=259',
      'https://www.thb.gov.tw/cp.aspx?n=356',
      'https://www.mvdis.gov.tw/webMvdisLaw/Download.aspx?ID=22746&type=Law',
      'https://law.moea.gov.tw/LawContent.aspx?id=FL011158&media=print',
      'https://mnscdn.moea.gov.tw/Mns/dir/content/Content.aspx?menu_id=42885',
      'https://www.moea.gov.tw/Mns/dir/investment/wHandDirApply_File.ashx?file_id=49',
      'https://laws.mol.gov.tw/FLAW/FLAWDOC01.aspx?flno=43&id=FL015128',
      'https://laws.mol.gov.tw/flaw/FLAWDOC01.aspx?flno=68&id=FL015128',
      'https://www.immigration.gov.tw/5475/5478/141478/141482/148796/cp',
    ];
    const officialLinks = Array.from(
      raw.matchAll(/\[[^\]]+\]\((https:\/\/[^)]+)\)/g),
      (match) => match[1],
    );
    expect(officialLinks).toEqual(officialSources);
    for (const source of officialSources) {
      expect(raw).toContain(source);
    }

    const internalLinks = Array.from(
      raw.matchAll(/\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[0],
    );
    expect(internalLinks).toEqual([
      '[台灣投資及公司設立服務](/zh-hant/services#investment)',
      '[曾雋崴律師簡介](/zh-hant/lawyers/wei-tseng)',
      '[聯絡我們](/zh-hant/contact)',
    ]);
  });

  it('preserves identity, both image paths, substantial Chinese copy, and both slugs', () => {
    expect(raw).toContain('曾雋崴律師（Wei Tseng）');
    expect(raw).not.toContain('曾俊瑋');
    for (const imagePath of [
      '../images/017-taiwan-logistics-business-setup/featured-01.jpg',
      '../images/017-taiwan-logistics-business-setup/img-01.jpg',
    ]) {
      expect(raw).toContain(imagePath);
    }
    expect(post?.featuredImage).toBe(
      '/images/blog/017-taiwan-logistics-business-setup/featured-01.jpg',
    );

    const han = /\p{Script=Han}/gu;
    expect(raw.match(han)?.length ?? 0).toBeGreaterThan(4_000);
    expect(raw.length).toBeGreaterThan(6_000);
    expect(post?.content.length).toBeGreaterThan(5_000);
    expect(getColumnPost('logistics-business', 'zh-hant')?.slug).toBe(
      'taiwan-logistics-business-setup',
    );
  });

  it('derives the reading-time label from the exact visible Traditional Chinese character count', () => {
    const publicText = extractPublicText(post?.content ?? '');
    const traditionalChineseCharacterCount =
      publicText.match(/\p{Script=Han}/gu)?.length ?? 0;
    const traditionalChineseCharactersPerMinute = 400;
    const calculatedMinutes = Math.ceil(
      traditionalChineseCharacterCount /
        traditionalChineseCharactersPerMinute,
    );

    expect(traditionalChineseCharacterCount).toBe(3_730);
    expect(calculatedMinutes).toBe(10);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}分鐘閱讀`);
    expect(post?.readTime).toBe(`${calculatedMinutes}分鐘閱讀`);
  });

  it('removes every forbidden claim, wrong-locale link, and wrong identity', () => {
    const forbiddenLiterals = [
      'Coupang',
      '經濟部投資審議委員會',
      '所有外國人投資都必須',
      '持有一年不得處分',
      '不必煩惱如何取得',
      '投資最少、風險最小',
      '成功取得',
      '協助媒合',
      '公司會計',
      '\u696d\u7a2e\u6838\u51c6',
      '/ko/',
      '/ja/',
      '/en/',
      '曾俊瑋',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(raw).not.toContain(forbidden);
    }
    expect(raw).not.toMatch(/被檢舉[^。\n]*三年/);
    expect(raw).not.toMatch(/營業執照[^。\n]*(?:自動|當然)移轉給買方/);
  });
});
