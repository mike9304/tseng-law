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
const featuredImageAlt = '比較台灣子公司與外國公司分公司的代表圖片';
const faq1Answer =
  '分公司是外國公司的一部分，因此分公司本身不存在股東。若要與第三人共同出資經營台灣事業，應評估設立台灣子公司並決定股東組成等方法。責任、表決權、資金籌措、許可與稅務，應依出資關係與事業計畫確認。';
const faq2Answer =
  '子公司與分公司一般適用5%營業稅與20%營利事業所得稅。台灣子公司向國外母公司分配股利時，台灣國內法上的扣繳率為21%，但符合台韓所得稅協定的適用要件時，上限稅率為10%。外國公司的台灣分公司將稅後盈餘匯回本公司，並非分配股利，因此原則上無須追加扣繳。本公司在台灣境外的營利事業，不屬於未分配盈餘加徵5%稅額的申報對象。';
const faq3Answer =
  '分公司不是獨立的發行公司，因此不能成為在台灣上市的主體。子公司若要上市，應符合公司法與證券交易所規定的要件。租稅優惠不會僅因組織形式而一律決定。《產業創新條例》第10條之1的投資抵減等，應個別確認適用對象投資、申請期限、抵減方式、重複適用與稅額上限。';
const disclaimer =
  '本文為說明台灣子公司與外國公司分公司一般差異的教育目的資料，並非就個別案件提供的法律、稅務諮詢。適用的法令與稅務處理，可能因投資人與本公司所在地、事業內容、交易與資金流向、協定適用要件及主管機關最新實務而不同；執行設立、投資、簽約、分配股利或匯款前，請確認最新官方資料與個別情形。';
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
        alt: featuredImageAlt,
        path: featuredImage,
      },
      { alt: '', path: inlineImage },
    ]);
    expect(parsed.content.trimStart()).toMatch(
      new RegExp(
        `^# ${title}\\n\\n!\\[${featuredImageAlt}\\]\\(${featuredImage.replace(/\./g, '\\.')}\\)`,
      ),
    );
    expect(parsed.content.indexOf(inlineImage)).toBeGreaterThan(
      parsed.content.indexOf('由誰成為契約當事人'),
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
      '7. 應選擇何種形式',
      '官方資料',
      '相關資訊',
    ]);
  });

  it('locks the Company Act identity, capital, and branch-exit rules', () => {
    const requiredPhrases = [
      '台灣《公司法》第1條將依公司法組織、登記、設立，並以營利為目的的法人，規定為公司。',
      '依此設立的台灣子公司，是與外國母公司區別的台灣法人。',
      '有限公司股東依《公司法》第99條第1項，原則上以其出資額為限對公司負責。',
      '股東濫用法人格，致公司難以清償特定債務，且其濫用情節重大時，得於必要範圍內負責',
      '依《公司法》第371條，外國公司未辦理分公司登記，不得以外國公司名義在台灣營業。',
      '依第372條，外國公司應專撥其台灣分公司營業所用資金，並指定在台灣境內的負責人。',
      '該資金是供台灣營業的本公司資金，而非分公司的股份或出資額。',
      '台灣分公司的債務就是外國公司的債務',
      '《公司法》第378條申請廢止分公司登記',
      '不會僅因申請而消失',
      '依《公司法》第379條，分公司登記的廢止，不影響債權人權利與外國公司義務。',
      '依《公司法》第380條，應清算在台灣營業與分公司所生的權利義務。',
      '清算後仍未清償的債務，由外國公司繼續負擔。',
      '台灣子公司是獨立法人，因此不採外國公司分公司的廢止登記，而是依公司法上解散及清算程序。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expect(parsed.content.indexOf('外國本公司的一部分')).toBe(
      parsed.content.indexOf('外國本公司'),
    );
  });

  it('locks qualified tax rates, remittance, and undistributed-earnings rules', () => {
    const requiredPhrases = [
      '營業稅是對在台灣銷售貨物或勞務的交易適用的間接稅。一般稅率為5%，通常以每二個月為一期申報。',
      '但零稅率、免稅、特別稅率或進項稅額扣抵與否，可能因交易性質而不同。',
      '課稅所得超過法定基準金額時，一般稅率為20%。',
      '這不是對營業額直接乘以20%的稅',
      '台灣國內法上的扣繳率為21%',
      '協定上的上限稅率10%',
      '居住者證明',
      '受益所有人',
      '將稅後分公司盈餘匯回本公司的行為與股利有別',
      '在分公司階段原則上無追加股利扣繳',
      '利息、權利金、服務對價、資產價款或對第三人的支付',
      '未分配盈餘加徵5%稅額',
      '本公司在台灣境外的營利事業，不屬於該未分配盈餘申報對象',
      '移轉訂價',
      '外國稅額扣抵',
      '不能預先斷定選擇分公司即可減少韓國母公司的稅負',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expect(raw).toContain('| 營業稅 |');
    expect(raw).toContain('| 未分配盈餘加徵稅額 |');
  });

  it('qualifies liability, financing, listing, and investment-credit claims', () => {
    const requiredPhrases = [
      '有限公司股東依《公司法》第99條的原則，在出資額限度內負責；股份有限公司股東，依所適用公司種類的規定，在所認購股份範圍內負責',
      '責任的界線不僅受登記形式影響，也受實際決策與資金運用影響。',
      '責任比較不能以「子公司安全、分公司危險」一句話作結',
      '分公司沒有自己的股份或股權，因此不能發行給第三人',
      '不應將不能發行股權的事實，擴大解釋為一切形式的資金籌措都不可能',
      '也不是僅因存在台灣子公司，就自動取得上市資格。',
      '設立期間、資本、獲利能力、股權分散、公司治理、內部控制、會計查核與資訊揭露',
      '2025年1月1日至2029年12月31日',
      '同一課稅年度投資新臺幣一百萬元以上二十億元以下的公司或有限合夥',
      '全新的智慧機械、5G系統、資通安全產品或服務、人工智慧產品或服務，以及節能減碳相關硬體、軟體、技術或技術服務',
      '在該年度投資額最高5%內，自該課稅年度的營利事業所得稅額抵減',
      '將投資額最高3%，在三年內每年抵減',
      '以該年度營利事業所得稅額的30%為限',
      '第10條的研究發展相關抵減與第10條之1',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks treaty dates, rates, and the distinct PE tests', () => {
    const requiredPhrases = [
      '台韓所得稅協定於2021年11月17日簽署，2023年12月27日生效，自2024年1月1日起適用。',
      '協定上股利、利息與權利金的上限稅率各為10%。',
      '一方地區的企業未在他方地區設有協定上常設機構（PE）時，原則上在他方地區免稅。',
      '管理處所、分公司、辦事處等固定設施',
      '超過六個月時，可能發生工程常設機構問題',
      '在任何十二個月期間合計超過183日提供勞務時，可能成立勞務常設機構',
      '反覆行使締結契約權限的代理人活動，也可能構成代理人常設機構',
      '在台灣辦理正式分公司登記的外國公司營業據點，通常屬於台灣的固定設施常設機構',
      '不能認為分公司的台灣營業利潤當然免稅',
      '不會僅因是外國母公司的子公司，即直接成為母公司的台灣常設機構',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('keeps every contracted selection and exit checklist topic', () => {
    const checklistPhrases = [
      '出資人是誰，表決權與重大事項決定權如何分配',
      '外國本公司或母公司在契約上、法律上負擔何種範圍的責任',
      '客戶契約、僱用、智慧財產、營業場所與許可歸屬哪一主體',
      '營業額與費用在何處認列，盈餘保留、股利分配或匯回本公司如何處理',
      '投資核准、銀行帳戶、資金匯入、外匯與對外匯款資料如何準備',
      '會計帳簿、查核、移轉訂價文件與韓國端申報、外國稅額扣抵如何管理',
      '是否計畫增資、本地夥伴、員工股權獎酬、上市、合併重整與股權移轉',
      '停止營業時，契約終止、勞動關係、稅務申報、資產處分與退場程序由誰執行',
    ];
    const section =
      parsed.content
        .split('## 7. 應選擇何種形式')[1]
        ?.split('## 官方資料')[0] ?? '';

    expect(Array.from(section.matchAll(/^- /gm))).toHaveLength(8);
    expect(Array.from(section.matchAll(/^- \*\*/gm))).toHaveLength(0);
    for (const phrase of checklistPhrases) {
      expect(section).toContain(`- ${phrase}`);
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
    expect(visibleHanCount).toBe(7_912);
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
