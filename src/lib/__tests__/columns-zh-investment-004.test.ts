import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-zh/004-taiwan-company-subsidiary-vs-branch.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost(
  'taiwan-company-subsidiary-vs-branch',
  'zh-hant',
);
const aliasPost = getColumnPost('subsidiary-vs-branch', 'zh-hant');

const title = '進入台灣市場：子公司與分公司的差異';
const featuredImage =
  '../images/004-taiwan-company-subsidiary-vs-branch/featured-01.jpg';
const inlineImage =
  '../images/004-taiwan-company-subsidiary-vs-branch/img-01.jpg';
const faq1Answer =
  '分公司是外國公司的一部分，分公司本身並無股東。若要與第三人共同出資經營台灣事業，可評估設立台灣子公司並規劃股東結構，或採取其他合法安排。責任、表決權、資金籌措、許可及稅務，仍應依出資關係與事業計畫個別確認。';
const faq2Answer =
  '子公司與分公司在台灣從事應稅營業時，一般均須處理5%營業稅及20%營利事業所得稅，但實際稅額取決於課稅所得、交易性質與可扣除項目。台灣子公司向境外母公司分配股利時，台灣國內法的扣繳率為21%；符合台韓所得稅協定的適用要件及程序時，來源地上限稅率為10%。外國公司的台灣分公司將稅後盈餘匯回外國本公司並非分配股利，原則上無須另行扣繳股利所得稅。總機構在台灣境外的營利事業，免辦理5%未分配盈餘加徵稅額申報。';
const faq3Answer =
  '分公司不是獨立的發行公司，因此不能以分公司本身作為在台灣上市的主體。子公司如要上市，仍須符合公司法及臺灣證券交易所等適用市場的各項要件。租稅優惠也不會只因組織形式而一律適用；例如《產業創新條例》第10條之1投資抵減的適用對象、投資範圍、申請期限、抵減方式、重複適用限制及稅額上限，都應個別確認。';
const disclaimer =
  '本文僅供說明台灣子公司與外國公司分公司的一般差異及教育參考，不構成就任何個案提供的法律或稅務意見。適用的法令與稅務處理，可能因投資人及外國本公司所在地、事業內容、交易與資金流向、協定適用要件及主管機關最新實務而異；在實際辦理設立、投資、簽約、分配股利或匯款前，仍應依最新官方資料及個案情形另行確認。';
const author = '**曾雋崴律師（Wei Tseng）**';

const faq = [
  {
    q: '台灣分公司可以讓台灣自然人或台灣法人以股東身分參與嗎？',
    a: faq1Answer,
  },
  {
    q: '台灣子公司與台灣分公司的稅負有何不同？',
    a: faq2Answer,
  },
  {
    q: '若規劃在台灣上市或申請投資抵減，應選擇子公司還是分公司？',
    a: faq3Answer,
  },
];

const officialLinks = [
  '[全國法規資料庫—公司法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080001)',
  '[全國法規資料庫—加值型及非加值型營業稅法第10條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=10&pcode=G0340080)',
  '[全國法規資料庫—所得稅法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=G0340003)',
  '[財政部稅務入口網—營利所得扣繳說明](https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/individual-income-tax/withheld-rule/rule/3AmWR0R)',
  '[財政部主管法規查詢系統—外商在我國境內分公司之盈餘課稅釋疑](https://law-out.mof.gov.tw/LawContent.aspx?id=GL002917)',
  '[財政部稅務入口網—免辦未分配盈餘申報之營利事業](https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/profit-seeking-enterprise-income-tax/undistributed-surplus-earnings/om7pAeL)',
  '[財政部—台韓所得稅協定生效及適用說明](https://www.mof.gov.tw/singlehtml/384fb3077bb349ea973e7fc6f13b6974?cntId=127fffb302f24987b0bbf1eff78ff9c9)',
  '[全國法規資料庫—產業創新條例第10條之1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=10-1&pcode=J0040051)',
  '[臺灣證券交易所—國內公司申請上市標準](https://www.twse.com.tw/zh/listed/method/standars.html)',
  '[投資台灣入口網—外國公司分公司投資及登記程序](https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus01?lang=eng&menuNum=7&search=InvestmentStatus01)',
];
const internalLinks = [
  '[台灣投資及公司設立服務](/zh-hant/services#investment)',
  '[台灣公司設立基礎](/zh-hant/columns/taiwan-company-establishment-basics)',
  '[聯絡我們](/zh-hant/contact)',
];

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
    .replace(/[「」『』“”‘’*_`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

describe('Traditional Chinese investment column 004 — subsidiary versus branch', () => {
  it('publishes the exact frontmatter, H1, and three FAQs', () => {
    expect(parsed.data).toEqual({
      title,
      url: 'https://www.wei-wei-lawyer.com/post/taiwan-company-subsidiary-vs-branch',
      lastmod: '2026-07-25',
      date_display: '2025年9月13日',
      read_time: '20分鐘閱讀',
      categories: ['台灣公司設立'],
      featured_image: featuredImage,
      faq,
    });
    expect(parsed.data.faq).toHaveLength(3);
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);

    expect(post).toMatchObject({
      slug: 'taiwan-company-subsidiary-vs-branch',
      title,
      date: '2026-07-25',
      dateDisplay: '2025年9月13日',
      readTime: '20分鐘閱讀',
      category: 'formation',
      categoryLabel: '公司設立',
      featuredImage:
        '/images/blog/004-taiwan-company-subsidiary-vs-branch/featured-01.jpg',
      faq,
    });
  });

  it('preserves exactly the two contracted images and their positions', () => {
    expect(
      Array.from(
        parsed.content.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g),
        (match) => ({ alt: match[1], path: match[2] }),
      ),
    ).toEqual([
      {
        alt: '台灣子公司與外國公司分公司的比較示意圖',
        path: featuredImage,
      },
      { alt: '', path: inlineImage },
    ]);
    expect(parsed.content.trimStart()).toMatch(
      new RegExp(
        `^# ${title}\\n\\n!\\[台灣子公司與外國公司分公司的比較示意圖\\]\\(${featuredImage.replace(/\./g, '\\.')}\\)`,
      ),
    );
    expect(parsed.content.indexOf(inlineImage)).toBeGreaterThan(
      parsed.content.indexOf('外國本公司（總公司）'),
    );
    expect(parsed.content.indexOf(inlineImage)).toBeLessThan(
      parsed.content.indexOf('## 1. 法人格與出資結構'),
    );
    expect(raw.split(featuredImage)).toHaveLength(3);
    expect(raw.split(inlineImage)).toHaveLength(2);
  });

  it('repeats each FAQ answer as the first paragraph after its assigned H2', () => {
    const headingAnswers = [
      ['## 1. 法人格與出資結構', faq1Answer],
      ['## 2. 稅務與盈餘匯回', faq2Answer],
      ['## 4. 資金籌措與在台灣上市', faq3Answer],
    ];

    for (const [heading, answer] of headingAnswers) {
      expect(firstParagraphAfter(parsed.content, heading)).toBe(answer);
      expect(firstParagraphAfter(post?.content ?? '', heading)).toBe(answer);
      expect(raw.split(answer)).toHaveLength(3);
    }
  });

  it('uses exactly the nine ordered H2 sections', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual([
      '1. 法人格與出資結構',
      '2. 稅務與盈餘匯回',
      '3. 債務與法律責任',
      '4. 資金籌措與在台灣上市',
      '5. 投資抵減',
      '6. 台韓所得稅協定與常設機構（PE）',
      '7. 如何選擇適合的組織形式',
      '官方資料',
      '相關資訊',
    ]);
  });

  it('locks the Company Act identity, capital, and branch-exit rules', () => {
    const requiredPhrases = [
      '《公司法》第1條所稱公司，是以營利為目的，依該法組織、登記、成立的社團法人。',
      '台灣子公司，與外國母公司是不同的權利義務主體',
      '有限公司股東依《公司法》第99條第1項，原則上以其出資額為限對公司負責。',
      '同條第2項規定，股東濫用公司法人地位',
      '《公司法》第371條規定，外國公司未辦理分公司登記，不得以外國公司名義在台灣經營業務',
      '第372條則要求外國公司專撥分公司營業所用資金，並指定代表為在台灣境內的負責人。',
      '該筆專撥營業所用資金是外國公司配置給台灣營運使用的資金，本身不形成股權性資本',
      '分公司債務就是外國公司債務',
      '《公司法》第378條規定',
      '廢止以前的責任或債務不因此消滅',
      '第379條進一步規定',
      '不影響債權人權利及外國公司義務',
      '依《公司法》第380條',
      '尚未清償的債務仍由外國公司負責',
      '台灣子公司則以自身法人身分依公司法及其他適用法令辦理解散及清算',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expect(parsed.content.indexOf('外國本公司（總公司）')).toBe(
      parsed.content.indexOf('外國本公司'),
    );
  });

  it('locks qualified tax rates, remittance, and undistributed-earnings rules', () => {
    const requiredPhrases = [
      '營業稅（加值型及非加值型營業稅）的一般稅率為5%，通常以每兩個月為一期申報。',
      '外銷或特定跨境服務可能涉及零稅率，法定項目可能免稅，部分行業另有特別稅率，進項稅額能否扣抵也會影響實際應納稅額。',
      '營利事業所得稅的一般稅率為20%，適用於課稅所得超過法定門檻的情形，並不是直接按營業收入總額乘以20%。',
      '台灣國內法的扣繳率為21%',
      '股利的來源地上限稅率可為10%',
      '居住者證明',
      '受益所有人',
      '稅後分公司盈餘匯回外國本公司',
      '原則上不另扣繳股利所得稅',
      '利息、權利金、服務費、資產價款或代第三人付款',
      '未分配盈餘加徵5%營利事業所得稅',
      '總機構在台灣境外的營利事業免辦該未分配盈餘申報',
      '移轉訂價',
      '外國稅額扣抵',
      '不能用台灣稅制直接代替韓國分析',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expect(raw).toContain('| 營業稅 |');
    expect(raw).toContain('| 未分配盈餘 |');
  });

  it('qualifies liability, financing, listing, and investment-credit claims', () => {
    const requiredPhrases = [
      '有限公司股東通常以出資額為責任上限；股份有限公司股東通常就其所認股份對公司負責。',
      '母公司保證或安慰函的效力、董事與負責人的忠實及注意義務、法人格濫用、共同侵權、違反勞動或稅務法令、未取得行業許可，以及集團公司共同簽署契約',
      '子公司不是隔絕一切風險的工具',
      '不能發行分公司股權讓外部投資人加入',
      '這不表示分公司不能取得任何資金',
      '台灣子公司若有上市計畫，也不會只因改為股份有限公司就自動取得上市資格。',
      '設立及營運年限、實收資本額、獲利能力或市值及營收標準、股權分散、公司治理、董事與獨立董事配置、內部控制、會計師查核及資訊揭露',
      '2025年1月1日至2029年12月31日',
      '同一課稅年度內合計達新臺幣一百萬元以上、二十億元以下',
      '全新智慧機械、5G系統、資通安全產品或服務、AI產品或服務，以及節能減碳相關全新硬體、軟體、技術或技術服務',
      '支出金額5%限度內抵減當年度應納營利事業所得稅額',
      '支出金額3%限度內，自當年度起三年內抵減各年度應納營利事業所得稅額',
      '不超過當年度應納營利事業所得稅額30%為限',
      '第10條的研究發展支出投資抵減，與第10條之1',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks treaty dates, rates, and the distinct PE tests', () => {
    const requiredPhrases = [
      '台韓所得稅協定於2021年11月17日簽署，於2023年12月27日生效，自2024年1月1日起適用。',
      '股利、利息及權利金在來源地的上限稅率各為10%。',
      '營業利潤方面，一方企業未透過設於另一方的常設機構（PE）從事營業時，其營業利潤原則上僅由該一方課稅。',
      '固定場所可能包括管理處所、分支機構或辦事處',
      '持續超過六個月時，可能構成工程常設機構',
      '在任何十二個月期間持續或合計超過183日時，可能構成服務常設機構',
      '經常行使締結契約的權限時，可能構成代理人常設機構',
      '外國公司的台灣分公司通常具有固定營業場所',
      '分公司歸屬台灣的營業利潤不會因台韓所得稅協定而當然免稅',
      '台灣子公司與境外母公司是不同法人，子公司存在也不當然表示母公司在台灣構成常設機構',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('keeps every contracted selection and exit checklist topic', () => {
    const checklistPhrases = [
      '**投資人與治理**',
      '**責任配置**',
      '**營運資產與許可**',
      '**收入及盈餘流向**',
      '**投資與銀行程序**',
      '**會計與跨境稅務**',
      '**後續資本計畫**',
      '**暫停與結束**',
    ];
    const section =
      parsed.content
        .split('## 7. 如何選擇適合的組織形式')[1]
        ?.split('## 官方資料')[0] ?? '';

    expect(Array.from(section.matchAll(/^- \*\*/gm))).toHaveLength(8);
    for (const phrase of checklistPhrases) {
      expect(section).toContain(phrase);
    }
  });

  it('uses each exact official and internal link once in the required order', () => {
    const markdownLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g),
      (match) => match[0],
    );

    expect(markdownLinks).toEqual([...officialLinks, ...internalLinks]);
    for (const link of [...officialLinks, ...internalLinks]) {
      expect(raw.split(link)).toHaveLength(2);
    }
  });

  it('ends with the exact disclaimer and author, with nothing after it', () => {
    expect(parsed.content).toContain(`---\n\n${disclaimer}\n\n${author}`);
    expect(raw.trimEnd()).toBe(
      `${raw.slice(0, raw.indexOf(disclaimer))}${disclaimer}\n\n${author}`,
    );
  });

  it('freezes the exact visible Han count and formula-derived read time', () => {
    const publicText = extractPublicVisibleText(parsed.content);
    const visibleHanCount =
      publicText.match(/\p{Script=Han}/gu)?.length ?? 0;
    const calculatedMinutes = Math.ceil(visibleHanCount / 400);

    expect(visibleHanCount).toBeGreaterThanOrEqual(5_000);
    expect(visibleHanCount).toBe(7_947);
    expect(calculatedMinutes).toBe(20);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}分鐘閱讀`);
    expect(post?.readTime).toBe(`${calculatedMinutes}分鐘閱讀`);
  });

  it('resolves the canonical and alias slugs to identical content', () => {
    expect(aliasPost).toBeDefined();
    expect(aliasPost?.slug).toBe(post?.slug);
    expect(aliasPost?.title).toBe(post?.title);
    expect(aliasPost?.content).toBe(post?.content);
    expect(aliasPost?.faq).toEqual(post?.faq);
  });

  it('removes forbidden claims, locale leakage, and hidden characters', () => {
    const forbiddenLiterals = [
      '台灣公司設立 子公司 VS 分公司',
      '韓國企業100%持有',
      '共同投資一定設立子公司',
      '共同投資只能設立子公司',
      '子公司與分公司的實際稅負相同',
      '外國人所得稅',
      '二十億元未滿',
      '低於二十億元',
      '少於二十億元',
      '未滿二十億元',
      'less than',
      '2023年12月2日',
      '留言',
      '私訊',
      '快速回覆',
      '支店',
      '本店',
      '株主',
      '許認可',
      '投資稅額控除',
      '曾俊瑋',
      '/ko/',
      '/ja/',
      '/en/',
      '台湾',
      '与',
      '税',
      '应',
      '为',
      '额',
      '权',
      '义务',
      '股东',
      '营业',
      '投资',
      '适用',
      '独立',
      '资料',
      '发',
      '办',
      '缴',
      '\uFEFF',
      '\u00A0',
      '\u200B',
      '\u200C',
      '\u200D',
      '\u2060',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(raw).not.toContain(forbidden);
    }
    expect(raw).not.toMatch(/\p{Script=Hangul}/u);
    expect(raw).not.toMatch(/[\u3040-\u30ff]/u);
    expect(raw).not.toMatch(
      /(?:台灣子公司|分公司)[^。\n]*(?:一律|必然|保證)[^。\n]*(?:節稅|免稅|上市|核准)/,
    );
    expect(raw).not.toMatch(
      /台灣子公司[^。\n]*(?:隔絕|阻斷|免除)[^。\n]*(?:一切|所有)[^。\n]*(?:風險|責任)/,
    );
    expect(raw).not.toMatch(
      /(?:183日|183天)[^。\n]*(?:唯一|一律|所有)[^。\n]*(?:常設機構|PE)/,
    );

    const proseWithoutAllowedTerms = extractPublicVisibleText(parsed.content)
      .replace(/Wei Tseng/g, '')
      .replace(/\b(?:PE|AI)\b/g, '')
      .replace(/5G/g, '');
    expect(proseWithoutAllowedTerms).not.toMatch(/[A-Za-z]/);
  });
});
