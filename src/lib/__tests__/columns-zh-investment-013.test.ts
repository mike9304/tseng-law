import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-zh/013-taiwan-company-establishment-advanced-1.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost(
  'taiwan-company-establishment-advanced-1',
  'zh-hant',
);

const title = '台灣公司設立：地址、銀行帳戶與審查實務Q&A';
const faq = [
  {
    q: '登記地址尚未確定時，應如何準備？',
    a: '外國投資申請與公司登記所要求的所在地資訊及文件並不相同。申請時應確認最新的申請表格與審查說明，並在公司登記前備妥租賃契約書、建物資料、所有權人同意及其他必要文件。預定地址能否從事預定營業項目，也應從土地使用分區、建築管理及行業別許可的角度事先確認。',
  },
  {
    q: '沒有台灣居留證，也可以向銀行洽詢開立公司帳戶嗎？',
    a: '各銀行對身分確認及開戶所需資料的要求不同。沒有居留證時，能否以護照、統一證號相關資料或其他替代文件洽辦，以及是否受理與所需文件，請在開戶前向銀行確認。籌備處帳戶與正式公司帳戶的程序也可能不同。',
  },
  {
    q: '學歷、工作經歷與預定事業領域不同，也可以提出申請嗎？',
    a: '學歷與工作經歷應依事實填寫，並具體說明其與所擔任職務、事業計畫、資金、專業知識，以及執行事業所需資源與組織安排之間的關係。經歷領域不同，不必然單憑這一點就決定審查結果，但不得填寫虛偽或誇大的經歷。是否需要補充資料或說明，請依個別案件確認。',
  },
  {
    q: '預計辦理公司設立及工作許可時，簽訂租賃契約應注意什麼？',
    a: '公司設立、銀行程序、工作許可及居留的整體流程，並沒有一律適用的處理期間。租約起始日、裝潢期間、租金減免、保證、額外押金及是否需要公證，應依租賃標的、雙方合意及個別情況協商。請確認許可及營業場所的適法性，並在簽約前考量程序延誤時的負擔。',
  },
  {
    q: '一般辦公室可以用作餐飲業等事業的營業場所嗎？',
    a: '能否使用，取決於營業項目、土地使用分區、建物用途、租賃條件及行業別許可。不能僅以一般辦公室為由，就認為可以經營餐飲業等事業。台北市針對適用案件設有公司及商業登記營業場所預先查詢機制，請在簽約前確認所在地與營業項目是否符合相關規定。銀行的身分確認及帳戶審查另屬獨立程序。',
  },
];
const headings = [
  ...faq.map(({ q }, index) => `${index + 1}. ${q}`),
  '進行程序前的確認',
  '官方資料',
  '相關服務',
];
const officialUrls = [
  'https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=J0040002',
  'https://investtaiwan.nat.gov.tw/showPage?lang=eng&search=55',
  'https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus01?lang=eng&menuNum=7&search=InvestmentStatus01',
  'https://gcis.nat.gov.tw/mainNew/English/subclassEnAction.do?method=getFile&pk=11',
  'https://ezworktaiwan.wda.gov.tw/en/News_Content.aspx?n=35C4C6202979ECD0&s=8E117BF2FD606799&sms=2D58889BB41F75D7',
];
const internalTargets = [
  '/zh-hant/columns/taiwan-company-establishment-basics',
  '/zh-hant/services#investment',
  '/zh-hant/columns/taiwan-company-establishment-basics',
  '/zh-hant/contact',
];

function firstParagraphAfter(content: string, heading: string) {
  return content.split(`## ${heading}\n\n`)[1]?.split('\n\n')[0];
}

function section(content: string, start: string, end: string) {
  return content.split(`## ${start}\n\n`)[1]?.split(`\n\n## ${end}`)[0] ?? '';
}

function paragraphCount(content: string) {
  return content
    .split(/\n\n+/)
    .filter((block) => block.trim() && !block.trim().startsWith('- ')).length;
}

describe('Traditional Chinese investment column 013 — company-setup practice Q&A', () => {
  it('publishes the corrected metadata and exactly five exact FAQs', () => {
    expect(parsed.data).toMatchObject({
      title,
      url: 'https://www.wei-wei-lawyer.com/post/taiwan-company-establishment-advanced-1',
      lastmod: '2026-07-27',
      date_display: '2025年9月13日',
      read_time: '8分鐘閱讀',
      categories: ['台灣公司設立'],
      featured_image:
        '../images/013-taiwan-company-establishment-advanced-1/featured-01.jpg',
      faq,
    });
    expect(parsed.data.faq).toHaveLength(5);
    expect(post).toMatchObject({
      slug: 'taiwan-company-establishment-advanced-1',
      title,
      date: '2026-07-27',
      dateDisplay: '2025年9月13日',
      readTime: '8分鐘閱讀',
      categoryLabel: '公司設立',
      faq,
    });
  });

  it('uses one H1 and the eight contracted H2 sections in order', () => {
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(headings);
  });

  it('repeats every exact FAQ answer as its matching section first paragraph', () => {
    for (const [index, item] of faq.entries()) {
      expect(firstParagraphAfter(parsed.content, headings[index])).toBe(item.a);
      expect(firstParagraphAfter(post?.content ?? '', headings[index])).toBe(
        item.a,
      );
      expect(raw.split(item.a)).toHaveLength(3);
    }
  });

  it('preserves the complete corrected section shape', () => {
    const expectedParagraphs = [5, 4, 4, 5, 4];
    for (let index = 0; index < 5; index += 1) {
      expect(
        paragraphCount(
          section(parsed.content, headings[index], headings[index + 1]),
        ),
      ).toBe(expectedParagraphs[index]);
    }
    expect(
      parsed.content.match(
        /^- (?:租約起始日|裝潢期間|保證人|是否將契約書|所在地可否|未能取得許可|招牌)/gm,
      ),
    ).toHaveLength(7);
  });

  it('states the current agency and qualified Article 9 sequence', () => {
    const article9Paragraph =
      '外國人投資條例（Statute for Investment by Foreign Nationals）第9條要求，經核准的投資額應於規定期間內全額匯入，並就該匯款向主管機關申報接受審查，再於投資實施後申請投資總額的審定。實際適用的期限、匯款方式、申報文件及審定申請所需文件，請依個別核准內容與最新說明確認。';
    const required = [
      '經濟部投資審議司（Department of Investment Review, MOEA）',
      '投資計畫、投資申請人相關資訊、資金來源與用途、預定事業活動、出資方式及所提出文件的內容',
      '並非所有案件都要求相同資料',
      '外國投資申請與公司登記，在所在地確認的階段與文件上並不相同',
      article9Paragraph,
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }

    const sequence = ['全額匯入', '申報接受審查', '投資實施後', '投資總額的審定'];
    const positions = sequence.map((step) => article9Paragraph.indexOf(step));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('qualifies bank documents, truthful experience, and work-permit review', () => {
    const required = [
      '能否以護照、統一證號相關資料或其他替代文件洽辦',
      '並沒有一份共通清單可以直接適用於所有銀行',
      '這並不表示備有這些文件任何銀行都會受理',
      '籌備處帳戶，與公司登記後的正式公司帳戶',
      '學歷與工作經歷應依事實填寫',
      '執行事業所需資源與組織安排',
      '不得填寫虛偽或誇大的經歷',
      '外國投資申請，與公司設立後外國人在台灣工作所需的工作許可，是不同的程序',
      '也不表示已符合工作許可所要求的職務內容、申請人本人的資格、雇主資格及附件文件要件',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('limits the WDA target and keeps lease terms case-specific', () => {
    const required = [
      '文件完備的專業人士工作許可申請',
      '線上申請的處理目標為7個工作天、書面申請為12個工作天',
      '不是包含公司設立、銀行程序或居留申請在內的總期間',
      '不包含補正所需時間及其他機關的程序',
      '並沒有一律適用的處理期間',
      '租約起始日、裝潢期間、租金減免、保證、額外押金及是否需要公證',
      '應依租賃標的、雙方合意及個別情況協商',
      '約定停止條件或解除條件等安排',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('separates location-law checks, Taipei inquiry, and bank review', () => {
    const required = [
      '土地使用分區、建物用途、出租人權限與租賃條件、公司及商業登記、行業別許可',
      '台北市的營業場所預先查詢',
      '全台灣都適用相同名稱與程序的制度',
      '銀行進行的身分確認、開戶資料審查及交易目的確認',
      '行政機關進行的土地使用、建築、公司及商業登記與營業許可審查',
      '即使確認所在地符合相關規定，也不表示銀行帳戶當然可以開立',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses only the contracted images, official sources, and zh-Hant links', () => {
    const imagePaths = Array.from(
      raw.matchAll(/(?:featured_image: "|!\[[^\]]*\]\()([^"\n)]+\.jpg)/g),
      (match) => match[1],
    );
    expect([...new Set(imagePaths)]).toEqual([
      '../images/013-taiwan-company-establishment-advanced-1/featured-01.jpg',
      '../images/013-taiwan-company-establishment-advanced-1/img-01.jpg',
    ]);

    const externalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((https?:\/\/[^)]+)\)/g),
      (match) => match[1],
    );
    const internalLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[1],
    );
    expect(externalTargets).toEqual(officialUrls);
    expect(internalLinks).toEqual(internalTargets);
  });

  it('removes stale claims, translation residue, and wrong-locale content', () => {
    const forbidden = [
      '投資審議委員會',
      '經濟部審議委員會',
      '海外勢力',
      '投資核准後1年內',
      '公司設立約需3個月',
      '取得工作許可證和居留證也約需1個月',
      '開戶後就跑掉',
      '台灣洗錢案件非常多',
      '審查並非非常嚴格',
      '說服審查委員',
      '房東通常不太願意租給外國人',
      '通常為2個月',
      '一定',
      '所有人同意',
      '適配性',
      '資金路徑',
      '執行體制',
      '受領',
      '追加',
      '實態',
      '投資形態',
      '所在地遷移',
      '曾俊瑋',
      '/ko/',
      '/ja/',
      '台湾',
      '查询',
      '账户',
      '许可',
    ];
    for (const phrase of forbidden) {
      expect(raw).not.toContain(phrase);
    }
    expect(raw).not.toMatch(/\]\(\/en\//);
    expect(raw).toContain('曾雋崴律師（Wei Tseng）');
    expect(raw).not.toMatch(
      /[\p{Script=Hangul}\p{Script=Hiragana}\p{Script=Katakana}]/u,
    );
    expect(raw).not.toMatch(/[\uFEFF\u00A0\u200B]/u);
    expect(raw).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it('keeps read time aligned and resolves the canonical alias', () => {
    const visibleHanCount =
      parsed.content.match(/\p{Script=Han}/gu)?.length ?? 0;
    const calculatedMinutes = Math.ceil(visibleHanCount / 400);

    expect(visibleHanCount).toBe(3_062);
    expect(calculatedMinutes).toBe(8);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}分鐘閱讀`);
    expect(post?.readTime).toBe(`${calculatedMinutes}分鐘閱讀`);
    expect(getColumnPost('company-advanced-1', 'zh-hant')?.slug).toBe(
      'taiwan-company-establishment-advanced-1',
    );
  });
});
