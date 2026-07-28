import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-zh/005-taiwan-company-establishment-advanced-2.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost(
  'taiwan-company-establishment-advanced-2',
  'zh-hant',
);

const title = '台灣公司設立：資本金匯款、銀行帳戶與外國人聘僱實務Q&A';
const headings = [
  '1. 從韓國向台灣公司的籌備處帳戶匯出資本金時，應確認什麼？',
  '2. 可以將在台灣持有的新臺幣存入公司的籌備處帳戶嗎？',
  '3. 公司籌備處帳戶何時可以轉換為正式的公司帳戶？',
  '4. 轉換為正式帳戶後，可以立即使用網路銀行嗎？',
  '5. 台灣公司聘僱韓國人時，應確認哪些工作許可要件？',
  '進行程序前的確認',
  '官方資料',
  '相關服務',
];
const officialUrls = [
  'https://www.bok.or.kr/eng/main/contents.do?menuNo=400191',
  'https://www.bok.or.kr/eng/main/contents.do?menuNo=400189',
  'https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus01?lang=eng&menuNum=7&search=InvestmentStatus01',
  'https://investtaiwan.nat.gov.tw/faqQContent?lang=eng&search=94',
  'https://investtaiwan.nat.gov.tw/eBook/BravoTaiwan/2024ebook_en/files/basic-html/page55.html',
  'https://ezworktaiwan.wda.gov.tw/cp.aspx?n=A88DC323EF7C85FF',
];
const internalTargets = [
  '/zh-hant/columns/taiwan-company-establishment-basics',
  '/zh-hant/columns/taiwan-company-establishment-advanced-1',
  '/zh-hant/services#investment',
  '/zh-hant/columns/taiwan-company-establishment-advanced-1',
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

describe('Traditional Chinese investment column 005 — corrected capital, banking, and hiring guidance', () => {
  it('publishes the corrected metadata and exactly five FAQs', () => {
    expect(parsed.data).toMatchObject({
      title,
      url: 'https://www.wei-wei-lawyer.com/post/taiwan-company-establishment-advanced-2',
      lastmod: '2026-07-27',
      date_display: '2025年9月13日',
      read_time: '10分鐘閱讀',
      categories: ['台灣公司設立'],
      featured_image:
        '../images/005-taiwan-company-establishment-advanced-2/featured-01.jpg',
    });
    expect(parsed.data.faq).toHaveLength(5);
    expect(post).toMatchObject({
      slug: 'taiwan-company-establishment-advanced-2',
      title,
      date: '2026-07-27',
      dateDisplay: '2025年9月13日',
      readTime: '10分鐘閱讀',
      categoryLabel: '公司設立',
      faq: parsed.data.faq,
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
    for (const [index, faq] of parsed.data.faq.entries()) {
      expect(faq.q).toBe(headings[index].replace(/^\d+\. /, ''));
      expect(firstParagraphAfter(parsed.content, headings[index])).toBe(faq.a);
      expect(firstParagraphAfter(post?.content ?? '', headings[index])).toBe(
        faq.a,
      );
      expect(raw.split(faq.a)).toHaveLength(3);
    }
  });

  it('preserves the complete corrected section shape', () => {
    const expectedParagraphs = [5, 5, 4, 4, 8];
    for (let index = 0; index < 5; index += 1) {
      expect(
        paragraphCount(
          section(parsed.content, headings[index], headings[index + 1]),
        ),
      ).toBe(expectedParagraphs[index]);
    }
    expect(
      parsed.content.match(
        /^- (?:實收資本額|營業額|進出口實績|代理佣金)/gm,
      ),
    ).toHaveLength(4);
  });

  it('locks the canonical Korea-side reporting, remittance order, and bank channels', () => {
    const required = [
      '韓國銀行要求投資人本人親自前往銀行，並從本人帳戶匯款',
      '網路銀行或由韓國親友代為匯款均不可行',
      '必須辦理「海外直接投資申報」',
      '申報必須於匯出台灣法人資本金時獲受理',
      '未申報可能因違反外匯管理法規而受制裁',
      '匯出資本金前，請向往來銀行確認申報受理機關、指定外匯銀行、申報時點、匯款名義、應備文件及匯款方式',
      '海外直接投資交易須透過指定外匯銀行辦理',
      '海外直接投資申報為必須，並須在匯出台灣法人資本金時獲受理',
      '韓國銀行一般要求投資人本人親自到行，以本人帳戶辦理匯款',
      '海外直接投資申報必須在匯出資本金時獲受理',
      '由於可能須先經文件審查、補正或指定銀行確認，應事先確認申報與匯款的順序，並與台灣方面的投資核准及繳款期限調整時程',
      '請勿一概預測具體措施，而應在匯款前確認最新制度與個別交易內容',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks Taiwan-dollar evidence and the Korean-bank remittance exemption', () => {
    const required = [
      '需確認核准的投資內容、資金取得經過、匯款或存入方式及往來銀行的要求',
      '使用在台灣取得的新臺幣時，須提交資金來源證明文件',
      '薪資所得扣繳憑單影本',
      '股息和紅利扣繳憑單影本',
      '從韓國銀行帳戶匯款時，無須附上資金來源相關文件',
      '存入須與核准的投資額、出資方式、投資人與匯款人及最新的投資程序指引相符',
      '若核准內容係以外幣自國外匯入為前提',
      '薪資明細、扣繳相關資料、股利決議與支付紀錄、契約書、請款單、納稅資料或帳戶明細',
      '若從韓國銀行帳戶匯款，無須附上資金來源相關文件',
      '請將銀行要求的資料、投資核准文件及實際資金移動紀錄相互對應保存',
      '須申報投資款已匯入，再辦理投資額審定',
      '最終能完成申報與審定程序的方式設計資金流程',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('keeps account conversion and electronic banking bank-specific', () => {
    const required = [
      '籌備處帳戶不會自動變更為正式帳戶',
      '公司負責人（代表人）與實質受益人的身分確認資料',
      '是否接受代理人提出',
      '資金可提領的時點，未必是同一天',
      '與開始使用網路銀行及行動銀行，未必是同一程序',
      '將經辦人員與核決人員分離的機制',
      '無法作為所有銀行共通的條件來說明',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks the first-employee rule and second-employee managerial thresholds', () => {
    const required = [
      '就「一般僑外投資事業主管工作」而言，第一位員工不受限制',
      '自第二位員工起有限制',
      '並不會僅因具有外國國籍，就產生不受限制的聘僱名額',
      '台灣法所稱的公司或分公司「經理人」',
      '合計持有超過股份總數或資本總額三分之一',
      '第一位外國人不受學歷、經歷、平均薪資及雇主資本額、營業額標準限制',
      '自第二位外國人起，其相關學歷與經歷、平均薪資，以及雇主的資本額與營業額，均依專門性或技術性工作的標準辦理',
      '自第二位外國人起，雇主方面須符合現行資格標準之一',
      '實收資本額或在台營運資金達新臺幣50萬元以上',
      '營業額達新臺幣300萬元以上',
      '進出口實績達美金50萬元以上',
      '代理佣金達美金20萬元以上',
      '以最近一年或前三年平均計算',
      '代表人辦事處與特別認定案件另有標準',
      '與實際職務相對應的工作許可類別',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses exactly the corrected images, official sources, and zh-Hant links', () => {
    const imagePaths = Array.from(
      raw.matchAll(/(?:featured_image: "|!\[[^\]]*\]\()([^"\n)]+\.jpg)/g),
      (match) => match[1],
    );
    expect([...new Set(imagePaths)]).toEqual([
      '../images/005-taiwan-company-establishment-advanced-2/featured-01.jpg',
      '../images/005-taiwan-company-establishment-advanced-2/img-01.jpg',
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

  it('removes stale claims, locale leakage, and wrong identity', () => {
    const forbidden = [
      '可能需要辦理海外直接投資申報等程序',
      '本人親自到行、代理申請或線上程序是否可行，無法就所有銀行一概而論',
      '由代理人申請而獲准的情形',
      '部分程序在線上辦理的情形',
      '不應假設申報會在匯出資本金的同時當然受理',
      '自國外匯款時，仍可能需要提出資金來源資料',
      '即使是自國外匯款，仍可能需要提出資金來源資料',
      '不會僅因匯款來源是韓國的銀行就免除證明',
      '也不能因此將第一位外國人視為不受限制',
      '第一位外國人所放寬的，僅為專門性或技術性工作的學歷、經歷及平均薪資標準',
      '職位與出資關係、雇主資格、申請及工作許可仍為必要',
      '一般至少需要手機號碼',
      '使用期間須滿6個月以上',
      '曾俊瑋',
      '/ko/',
      '/ja/',
      '/en/',
      '台湾',
      '账户',
      '网络',
      '员工',
      '雇佣',
      '许可',
      '资本',
      '营业额',
      '万美元',
      '人民币',
      '受領',
      '追加',
      '實態',
      '投資形態',
      '也未必不需要',
      '新台幣',
    ];
    for (const phrase of forbidden) {
      expect(raw).not.toContain(phrase);
    }
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

    expect(visibleHanCount).toBe(3_628);
    expect(calculatedMinutes).toBe(10);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}分鐘閱讀`);
    expect(post?.readTime).toBe(`${calculatedMinutes}分鐘閱讀`);
    expect(getColumnPost('company-advanced-2', 'zh-hant')?.slug).toBe(
      'taiwan-company-establishment-advanced-2',
    );
  });
});
