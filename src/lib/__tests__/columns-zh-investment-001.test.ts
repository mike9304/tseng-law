import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-zh/001-taiwan-company-establishment-basics.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost(
  'taiwan-company-establishment-basics',
  'zh-hant',
);

const title =
  '台灣公司設立基礎：子公司、分公司、代表人辦事處、設立程序與工作許可';
const entityFaqAnswer =
  '台灣子公司（有限公司或股份有限公司）是依台灣法成立的獨立法人。外國公司的台灣分公司不具獨立法人格，而是外國公司在台灣營業的一部分。代表人辦事處不是從事營利活動的營業據點，其活動範圍限於為外國公司從事法律行為及聯絡業務。責任、稅務、許可與政府採購參與資格，仍須依組織形式及個案情形分別確認。';
const residenceFaqAnswer =
  '僅完成公司設立，並不當然取得工作許可或居留資格。外國人如要在台灣管理或經營公司，仍須就其職務、出資關係及雇主營運實績等，符合工作許可的相關要件；取得工作許可後，還須依居留目的另行申請外僑居留證。';
const capitalFaqAnswer =
  '公司設立本身並無一體適用的法定最低資本額；但特定行業的最低資本額、事業計畫的合理性、銀行審查，以及工作許可所要求的雇主資格，仍須分別確認。僑外投資事業主管工作許可的適用對象，包括華僑或外國人持有該事業股份或出資額合計超過股份總數或資本總額三分之一之公司的經理人、外國分公司經理人，以及代表人辦事處代表人等。其中，公司或分公司設立未滿一年者，雇主原則上須符合下列條件之一：實收資本額或在臺營運資金達新臺幣50萬元以上、營業額達新臺幣300萬元以上、進出口實績總額達美金50萬元以上，或代理佣金達美金20萬元以上。設立一年以上者，則原則上須符合最近一年或前三年在臺平均營業額達新臺幣300萬元以上、平均進出口實績總額達美金50萬元以上，或平均代理佣金達美金20萬元以上其中之一。代表人辦事處設立滿一年者，須具備在臺工作實績；設立未滿一年者免除此項要求。對國內經濟發展有實質貢獻，或情況特殊者，仍可能由主管機關個案認定。';

const faq = [
  {
    q: '在台灣設立公司時，子公司、分公司與代表人辦事處有何不同？',
    a: entityFaqAnswer,
  },
  {
    q: '設立公司後，就能取得台灣的工作許可或居留資格嗎？',
    a: residenceFaqAnswer,
  },
  {
    q: '申請工作許可與居留證，是否需要最低資本額？',
    a: capitalFaqAnswer,
  },
];

const officialSources = [
  'https://law.moea.gov.tw/EngLawContent.aspx?id=10484&lan=E',
  'https://mnscdn.moea.gov.tw/Mns/dir/content/Content.aspx?menu_id=42885',
  'https://gcis.nat.gov.tw/mainNew/English/index.jsp',
  'https://ws.wda.gov.tw/Download.ashx?n=VGhlIERpcmVjdG9yIG9yIE1hbmFnZXIgb2YgYW4gQXBwcm92ZWQgQnVzaW5lc3MgSW52ZXN0ZWQgb3IgRXN0YWJsaXNoZWQgYnkgT3ZlcnNlYXMgQ2hpbmVzZSBvciBGb3JlaWduZXIocykoU09QIE1hbnVhbCkucGRm&u=LzAwMS9VcGxvYWQvMzIxL3JlbGZpbGUvMC8yNTE1LzUzMWMyZTM0LTI1NmYtNGI5MC1iMzAzLTEzNWI4MTQxYTk5MC5wZGY%3D',
  'https://www.mof.gov.tw/eng/singlehtml/f48d641f159a4866b1d31c0916fbcc71?cntId=e1e57a4211474ff9b5d63a83b30dcf10',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=10&pcode=G0340080',
  'https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/business-tax/collection-prcedure/oVL9pwM',
  'https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/profit-seeking-enterprise-income-tax/file-payment/62nOrYR',
  'https://www.etax.nat.gov.tw/etwmain/alien-tax-service/alien-tax-faq/KK9Y76o',
  'https://www.immigration.gov.tw/5475/5478/141465/141808/411648/cp_news',
  'https://www.businesslocationinfo.gov.taipei/BLBQS/Home/Notice',
];

const imagePaths = [
  '../images/001-taiwan-company-establishment-basics/featured-01.jpg',
  '../images/001-taiwan-company-establishment-basics/img-01.jpg',
  '../images/001-taiwan-company-establishment-basics/img-02.jpg',
  '../images/001-taiwan-company-establishment-basics/img-03.jpg',
  '../images/001-taiwan-company-establishment-basics/img-04.jpg',
];

const disclaimer =
  '本文僅供一般法律資訊與教育參考，不構成就任何個案提供的法律或稅務意見。所需程序及結果可能因投資架構、行業、申請人的國籍與居留身分，以及主管機關最新實務而異；進行投資、簽約或聘僱前，仍應依最新官方資料及個案情形另行確認。';
const taxParagraph =
  '台灣營業稅的一般稅率為5%，通常每兩個月申報一次。營利事業所得稅的一般稅率為20%，但實際課稅仍取決於課稅所得及適用規定。依台灣國內法，向非居住者支付股利的扣繳率為21%；符合台韓所得稅協定適用要件及程序的股利，來源地課稅上限為10%。辦理申報與扣繳時，仍須確認納稅義務人的協定居住者身分、受益所有人、所得性質及協定適用文件。';

function firstParagraphAfter(content: string, heading: string) {
  return content.split(`${heading}\n\n`)[1]?.split('\n\n')[0];
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

describe('Traditional Chinese investment column 001 — company-establishment basics', () => {
  it('publishes the contracted frontmatter, H1, and exactly three FAQs', () => {
    expect(parsed.data.title).toBe(title);
    expect(parsed.data.url).toBe(
      'https://www.wei-wei-lawyer.com/post/taiwan-company-establishment-basics',
    );
    expect(parsed.data.lastmod).toBe('2026-07-25');
    expect(parsed.data.date_display).toBe('2025年9月13日');
    expect(parsed.data.categories).toEqual(['台灣公司設立']);
    expect(parsed.data.featured_image).toBe(imagePaths[0]);
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(parsed.data.faq).toEqual(faq);
    expect(parsed.data.faq).toHaveLength(3);

    expect(post?.slug).toBe('taiwan-company-establishment-basics');
    expect(post?.title).toBe(title);
    expect(post?.date).toBe('2026-07-25');
    expect(post?.dateDisplay).toBe('2025年9月13日');
    expect(post?.category).toBe('formation');
    expect(post?.categoryLabel).toBe('公司設立');
    expect(post?.featuredImage).toBe(
      '/images/blog/001-taiwan-company-establishment-basics/featured-01.jpg',
    );
    expect(post?.faq).toEqual(faq);
  });

  it('keeps each FAQ answer identical to its contracted first body paragraph', () => {
    const headingAnswers = [
      [
        '## 1. 進入台灣市場的組織形式：子公司、分公司與代表人辦事處',
        entityFaqAnswer,
      ],
      ['### 公司設立與工作許可、居留資格', residenceFaqAnswer],
      [
        '### 公司資本額與僑外投資事業主管工作許可',
        capitalFaqAnswer,
      ],
    ];

    for (const [heading, answer] of headingAnswers) {
      expect(firstParagraphAfter(parsed.content, heading)).toBe(answer);
      expect(firstParagraphAfter(post?.content ?? '', heading)).toBe(answer);
    }
  });

  it('uses the five fixed numbered sections and two fixed work-permit subsections', () => {
    expect(
      Array.from(
        parsed.content.matchAll(/^## (\d+)\. (.+)$/gm),
        (match) => [match[1], match[2]],
      ),
    ).toEqual([
      ['1', '進入台灣市場的組織形式：子公司、分公司與代表人辦事處'],
      ['2', '設立台灣子公司的主要程序'],
      ['3', '營業項目與營業場所的事前確認'],
      ['4', '工作許可、居留資格與資本額'],
      ['5', '稅務與台韓所得稅協定'],
    ]);
    expect(
      Array.from(
        parsed.content.matchAll(/^### (.+)$/gm),
        (match) => match[1],
      ),
    ).toEqual([
      '公司設立與工作許可、居留資格',
      '公司資本額與僑外投資事業主管工作許可',
    ]);
    expect(Array.from(parsed.content.matchAll(/^## /gm))).toHaveLength(7);
  });

  it('keeps the ten-item establishment process as a qualified overview', () => {
    const processSection = parsed.content
      .split('## 2. 設立台灣子公司的主要程序')[1]
      ?.split('## 3. 營業項目與營業場所的事前確認')[0] ?? '';
    expect(
      Array.from(processSection.matchAll(/^(\d+)\. (.+)$/gm), (match) => [
        match[1],
        match[2],
      ]),
    ).toEqual([
      ['1', '公司名稱及所營事業預查'],
      [
        '2',
        '委任書等外國文件的公、認證，以及必要時的駐外館處驗證',
      ],
      ['3', '向經濟部投資審議司提出投資申請（適用時）'],
      ['4', '開立公司籌備處帳戶'],
      ['5', '從國外匯入投資款'],
      ['6', '投資額審定'],
      ['7', '公司設立登記'],
      ['8', '稅籍登記'],
      ['9', '將籌備處帳戶轉為正式帳戶'],
      [
        '10',
        '出進口廠商登記、行業許可、工作許可及居留等後續程序（適用時）',
      ],
    ]);
    expect(processSection).toContain(
      '並非所有案件均適用相同的固定順序或期間',
    );
    expect(processSection).toContain(
      '組織形式、投資額、行業、審查內容、銀行程序及補件',
    );
    expect(processSection).toContain(
      '投資人的國籍及自然人或法人身分',
    );
  });

  it('states the entity, treaty, PE, workplace, residence, and tax qualifications', () => {
    expect(raw).toContain(taxParagraph);
    expect(post?.content).toContain(taxParagraph);

    const requiredPhrases = [
      '台灣子公司（有限公司、股份有限公司）是與外國母公司分開的獨立法人',
      '分公司本身不另設股東',
      '由外國公司承擔分公司的債務與責任',
      '不得在台灣從事銷售、提供服務等一般營利活動',
      '不得僅憑組織名稱判斷',
      '台韓所得稅協定於2023年12月27日生效，自2024年1月1日起適用',
      '股利、利息及權利金的來源地課稅上限稅率均為10%',
      '管理處所、分公司、辦事處等固定場所',
      '超過六個月的工程',
      '任一十二個月期間合計超過183日的服務',
      '經常行使締結契約權限的代理人',
      '不能只看183日',
      '外國人可以投資許多行業',
      '不表示公司可以立即開始營業',
      '土地使用分區、建築管理、租賃條件及稅籍登記',
      '臺北市設有適用於公司或商業登記案件的「營業場所預先查詢」機制',
      '學生可以申請投資及公司設立',
      '不表示其現有居留身分允許在台灣工作或經營公司',
      '是工作許可所要求的雇主資格，不是公司設立的一般最低資本額',
      '符合上述數額，也不代表工作許可必然核發',
      '配偶及未成年子女仍須符合條件，另行申請依親居留',
      '不會因主申請人取得居留證而自動取得',
      '連續合法居留五年，且每年居住183日以上',
      '外國專業人才可能適用不同的居留期間計算方式',
      '品行、財產或技能等其他法定要件',
      '持有工作許可或居留證滿五年，不等於自動取得永久居留',
      '台灣營業稅的一般稅率為5%，通常每兩個月申報一次。',
      '營利事業所得稅的一般稅率為20%',
      '向非居住者支付股利的扣繳率為21%',
      '符合台韓所得稅協定適用要件及程序的股利，來源地課稅上限為10%',
      '協定居住者身分、受益所有人、所得性質及協定適用文件',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('keeps the approved native-Taiwanese legal phrasing from final review', () => {
    const approvedPhrases = [
      '各類型均有其構成要件，其中固定場所、工程及代理人等類型的認定，可能與服務日數無關。',
      '開立公司籌備處帳戶及匯入投資款時，銀行可能會依認識客戶、實質受益人辨識及資金來源審查等程序，要求提供相關資料。若匯款人、匯款目的、投資核准內容與入帳帳戶彼此不符，可能需要補充說明或補件。投資款匯入後，尚須辦理投資額審定，再完成公司設立登記與稅籍登記，最後依銀行要求將籌備處帳戶轉為正式帳戶。',
      '醫療器材、酒類、旅行業、營建或專業服務等可能涉及主管機關許可、登記或資格的領域，應以實際提供的商品與服務及交易結構為基準，檢討適用規定。',
      '簽訂租約前，應依預定地址及實際營業內容，確認土地使用分區、建築管理、租賃條件及稅籍登記等事項是否符合需求與相關規定。若建物用途或管理規約不符合實際業務，或未能取得必要的出租人同意，登記後仍可能須變更場所或補辦其他程序。',
      '臺北市設有適用於公司或商業登記案件的「營業場所預先查詢」機制，申請人可在提出登記前，就預定場所與營業項目辦理查詢。但查詢結果並不表示其他許可或專門法規上的要件已一併符合。在其他地區設址時，應確認當地地方政府與管轄機關的程序，並在簽訂長期租約或投資設備前，先以書面確認場所的適格性。',
      '公司設立的申請人、公司股東、實際在台灣執行業務的人與居留申請人，可能是同一人，但法律上應分別以觀。投資核准審查資本的投入，工作許可審查外國人的業務執行，居留證則審查居留目的與期間，三者的審查目的各自不同。',
      '上述數額是工作許可所要求的雇主資格，不是公司設立的一般最低資本額。行業法規可能另定資本額或保證金要求，銀行亦可能就事業計畫與交易風險獨立審查。此外，即使符合上述數額，也不代表工作許可必然核發，申請人的實際職務、經歷與提出文件等其他要件仍會一併審查。',
      '外國專業人才可能適用不同的居留期間計算方式，部分居留期間也可能不計入申請永久居留所需的年限。',
      '營業稅與營利事業所得稅的課稅對象與申報方式不同，應區分對銷售額課徵的稅與對課稅所得課徵的稅。向境外股東或關係企業支付股利、利息、權利金或服務費時，應事先檢討給付的性質、收款人的地位、國內法上的扣繳規定，以及所得稅協定適用的可能性。',
      '協定上的限制稅率，不會僅因協定存在即自動適用。應確認納稅義務人是否為協定上的居住者、是否為受益所有人、所得的法律性質，以及應提出的居住者證明與申請文件。',
      '檢討營業利潤的課稅權時，應檢視前述四種常設機構類型，分析是否構成常設機構及相關營業利潤的歸屬。除服務日數外，亦應一併確認固定場所、工程期間、代理人締結契約權限及實際活動。',
    ];

    for (const phrase of approvedPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses all eleven official sources and exactly the three contracted internal links', () => {
    for (const source of officialSources) {
      expect(raw).toContain(source);
    }
    expect(
      Array.from(raw.matchAll(/https?:\/\/[^)"\s]+/g), (match) => match[0]),
    ).toEqual([
      'https://www.wei-wei-lawyer.com/post/taiwan-company-establishment-basics',
      ...officialSources,
    ]);

    expect(
      Array.from(
        raw.matchAll(/\[[^\]]+\]\((\/[^)]+)\)/g),
        (match) => match[0],
      ),
    ).toEqual([
      '[台灣投資及公司設立服務](/zh-hant/services#investment)',
      '[曾雋崴律師簡介](/zh-hant/lawyers/wei-tseng)',
      '[聯絡我們](/zh-hant/contact)',
    ]);
  });

  it('preserves exactly five images in their contracted positions', () => {
    const markdownImages = Array.from(
      parsed.content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g),
      (match) => match[1],
    );
    expect(markdownImages).toEqual(imagePaths);
    expect(
      parsed.content.indexOf(imagePaths[0]),
    ).toBeLessThan(parsed.content.indexOf('台灣市場'));
    expect(
      parsed.content.indexOf(imagePaths[1]),
    ).toBeLessThan(parsed.content.indexOf('台灣市場'));
    expect(parsed.content.indexOf(imagePaths[2])).toBeGreaterThan(
      parsed.content.indexOf(
        '## 1. 進入台灣市場的組織形式：子公司、分公司與代表人辦事處',
      ),
    );
    expect(parsed.content.indexOf(imagePaths[2])).toBeLessThan(
      parsed.content.indexOf('## 2. 設立台灣子公司的主要程序'),
    );
    expect(parsed.content.indexOf(imagePaths[3])).toBeGreaterThan(
      parsed.content.indexOf('## 2. 設立台灣子公司的主要程序'),
    );
    expect(parsed.content.indexOf(imagePaths[3])).toBeLessThan(
      parsed.content.indexOf('## 3. 營業項目與營業場所的事前確認'),
    );
    expect(parsed.content.indexOf(imagePaths[4])).toBeGreaterThan(
      parsed.content.indexOf('## 4. 工作許可、居留資格與資本額'),
    );
    expect(parsed.content.indexOf(imagePaths[4])).toBeLessThan(
      parsed.content.indexOf('## 5. 稅務與台韓所得稅協定'),
    );
  });

  it('ends with the three services, horizontal rule, disclaimer, and canonical author', () => {
    expect(raw).toContain(disclaimer);
    expect(raw.trimEnd()).toMatch(
      new RegExp(
        `${disclaimer}\\n\\n\\*\\*曾雋崴律師\\（Wei Tseng\\）\\*\\*$`,
      ),
    );
    const relatedSection =
      parsed.content.split('## 相關服務\n\n')[1]?.split(`\n\n---\n\n${disclaimer}`)[0]
      ?? '';
    expect(
      Array.from(
        relatedSection.matchAll(/\[[^\]]+\]\((\/[^)]+)\)/g),
        (match) => match[0],
      ),
    ).toEqual([
      '[台灣投資及公司設立服務](/zh-hant/services#investment)',
      '[曾雋崴律師簡介](/zh-hant/lawyers/wei-tseng)',
      '[聯絡我們](/zh-hant/contact)',
    ]);
  });

  it('derives read_time from the exact visible Han-character count at 400 per minute', () => {
    const publicText = extractPublicVisibleText(parsed.content);
    const visibleHanCount = publicText.match(/\p{Script=Han}/gu)?.length ?? 0;
    const calculatedMinutes = Math.ceil(visibleHanCount / 400);

    expect(visibleHanCount).toBe(4_321);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}分鐘閱讀`);
    expect(post?.readTime).toBe(`${calculatedMinutes}分鐘閱讀`);
  });

  it('resolves the canonical and alias slugs in Traditional Chinese', () => {
    expect(post?.slug).toBe('taiwan-company-establishment-basics');
    expect(getColumnPost('company-basics', 'zh-hant')?.slug).toBe(
      'taiwan-company-establishment-basics',
    );
  });

  it('removes stale claims, unsafe promises, wrong locales, and foreign-script leakage', () => {
    const forbiddenLiterals = [
      'KOTRA',
      '107家',
      '第五大貿易夥伴',
      '第六大貿易夥伴',
      '29億',
      '17億',
      '日本料理',
      '醬油蟹',
      '韓國咖啡廳',
      '韓服',
      '😁',
      '投資審議委員會',
      '投資審查委員會',
      '投審會',
      '共有10個步驟',
      '3個月',
      '三個月',
      '1元新台幣',
      '1元新臺幣',
      '單一股東',
      '台灣合夥人',
      '約17萬',
      '韓國企業100%持有',
      '2023年12月2日',
      '就業許可',
      '曾俊瑋',
      '留言',
      '私訊',
      '快速回覆',
      '/ko/',
      '/ja/',
      '/en/',
      '\uFEFF',
      '\u00A0',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(raw).not.toContain(forbidden);
    }
    expect(raw).not.toMatch(/183日[^.。\n]*(?:免稅|不課稅)/);
    expect(raw).not.toMatch(/公司設立[^.。\n]*(?:簽證|工作許可|居留)[^.。\n]*(?:自動|即可取得)/);
    expect(raw).not.toMatch(/家屬[^.。\n]*自動[^.。\n]*居留/);
    expect(raw).not.toMatch(
      /五年[^.。\n]*(?:即可|便可|就能|得以)自動[^.。\n]*永久居留/,
    );
    expect(raw).not.toMatch(/居留證[^.。\n]*工作許可[^.。\n]*(?:相同|一樣).*期間/);
    expect(raw).not.toMatch(/非居住者[^.。\n]*183日[^.。\n]*5%/);
    expect(raw).not.toMatch(/[\uAC00-\uD7A3]/);
    expect(raw).not.toMatch(/[\u3040-\u30FF]/);
  });
});
