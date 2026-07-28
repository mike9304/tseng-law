import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-zh/015-taiwan-company-setup-pitch-location.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('taiwan-company-setup-pitch-location', 'zh-hant');

const title = '台灣公司設立：營業場所選擇與台北市預先查詢';
const headings = [
  '1. 在台北市，只有特定行業才需要辦理營業場所預先查詢嗎？',
  '2. 辦理營業場所預先查詢需要哪些建物資料？',
  '3. 租賃地址、借址登記或虛擬辦公室可以作為公司地址嗎？',
  '4. 預先查詢結果符合規定，就可以立即在該處營業嗎？',
  '5. 預先查詢的處理時間與結果有效期間是多久？',
  '官方資料',
  '相關服務',
];
const officialUrls = [
  'https://www.businesslocationinfo.gov.taipei/BLBQS/Home/Notice',
  'https://laws.gov.taipei/Law/LawSearch/LawArticleContent/FL080687',
  'https://www.gov.taipei/News_Content.aspx?n=EEC70A4186D4C828&s=E70ACC80BEEC5910&sms=87415A8B9CE81B16',
  'https://laws.gov.taipei/Law/SOPSearch/DownloadFile?sop_no=P04020118.pdf',
  'https://gcis.nat.gov.tw/F/t70044_p',
  'https://www.fda.gov.tw/tc/newsContent.aspx?id=11672',
];
const internalTargets = [
  '/zh-hant/services#investment',
  '/zh-hant/columns/taiwan-company-establishment-advanced-1',
  '/zh-hant/contact',
];

function firstParagraphAfter(content: string, heading: string) {
  return content.split(`## ${heading}\n\n`)[1]?.split('\n\n')[0];
}

describe('Traditional Chinese investment column 015 — Taipei business-location inquiry', () => {
  it('publishes the corrected metadata and exactly five FAQs', () => {
    expect(parsed.data).toMatchObject({
      title,
      url: 'https://www.wei-wei-lawyer.com/post/taiwan-company-setup-pitch-location',
      lastmod: '2026-07-27',
      date_display: '2025年9月13日',
      read_time: '9分鐘閱讀',
      categories: ['台灣公司設立'],
      featured_image:
        '../images/015-taiwan-company-setup-pitch-location/featured-01.jpg',
    });
    expect(parsed.data.faq).toHaveLength(5);
    expect(post).toMatchObject({
      slug: 'taiwan-company-setup-pitch-location',
      title,
      date: '2026-07-27',
      dateDisplay: '2025年9月13日',
      readTime: '9分鐘閱讀',
      categoryLabel: '公司設立',
      faq: parsed.data.faq,
    });
  });

  it('uses one H1 and the seven contracted H2 sections in order', () => {
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

  it('states the comprehensive 2023 review and exact five-step portal sequence', () => {
    const required = [
      '自2023年1月1日起',
      '公司及商業（含分公司及分支機構）之設立、所在地變更或增列營業項目登記',
      '受理公司及商業登記前，全面確認營業場所與營業項目是否符合規定',
      '檢附於相關登記申請',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }

    const sequence = [
      '1. 確認將使用的正確地址、樓層、範圍及預定營業項目。',
      '2. 取得最新的建物登記資料及其他應備文件。',
      '3. 申請營業場所預先查詢，就地址與營業項目的組合接受審查。',
      '4. 將符合規定的查詢結果，檢附於公司及商業之設立、所在地變更或增列營業項目登記申請。',
      '5. 另行完成行業別許可、消防與衛生準備、裝修及其他開始營業要件。',
    ];
    const positions = sequence.map((step) => raw.indexOf(step));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('covers supplementation, incompatible results, item limit, and fallback', () => {
    const required = [
      '主管機關會以輔導函通知申請人補充結果',
      '於補充後續行登記程序',
      '評估變更營業場所',
      '將不符合規定的營業項目自登記申請中移除',
      '一次查詢申請可受理的營業項目最多五項',
      '應選擇主要營業項目作為審查對象',
      '隨案主動查詢',
      '包含餐廳及其他餐飲服務在內的特定營業項目',
      '由台北市商業處隨登記案件主動啟動查詢的補充機制',
      '第五點清單並非恢復「僅清單所列行業才需要預先查詢」的舊有觀念',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('requires current building records, official channels, and use ratios', () => {
    const required = [
      '申請日前三個月內核發的建物登記謄本（含第二類）或建物所有權狀',
      '台北市各地政事務所或便民工作站等窗口',
      '政府的電子謄本系統',
      '無須一律透過特定熟人或律師辦理',
      '以住宅為主兼作辦公室',
      '住宅使用部分超過總面積五分之三',
      '辦公室使用部分未達五分之二',
      '土地使用分區證明等補充資料',
      '都需要補正，並影響預定時程',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('separates address-use authority, actual use, and site suitability', () => {
    const required = [
      '租賃契約書影本，或所有權人使用同意書及所有權證明資料',
      '使用該地址作為公司所在地的權限',
      '不代表已確認該場所對任何營業項目在土地使用分區、建築、消防或衛生上均屬合法',
      '借址登記',
      '虛擬辦公室',
      '即認定一律不得使用，同樣不適當',
      '登記地址以外的地點實際營業',
      '僅備齊登記地址的相關資料，並不代表已滿足另一實際營業場所的要件',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('limits inquiry scope and keeps separate operating requirements', () => {
    const required = [
      '不代表出租人權限、租賃條件、消防、衛生、環境、招牌、食品業者登錄、行業別許可及其他要件均已獲核准',
      '並非全面核准租賃契約的效力',
      '消防安全設備、排煙排水、廢棄物、噪音、招牌設置',
      '食品衛生管理、食品業者登錄、從業人員與設備相關要件、營業型態別許可',
      '未必能沿用已取得的結果',
      '各有不同的目的和審查範圍',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('states non-guaranteed timing targets and six-month validity', () => {
    const required = [
      '一般案件5日（曆日）、需函詢外部機關案件11日（曆日）的處理目標',
      '並非完成日期的保證',
      '均非工作日，而是以曆日計算的行政處理目標',
      '實際天數可能因申請文件的補正、其他機關的回覆、案件數量、物件或營業項目的複雜程度而變動',
      '查詢結果自審查完成日起六個月內有效',
      '以審查完成日為起算點',
      '逾有效期間或查詢內容有變更',
    ];
    for (const phrase of required) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses only the contracted images, sources, and zh-Hant links', () => {
    const imagePaths = Array.from(
      raw.matchAll(/(?:featured_image: "|!\[[^\]]*\]\()([^"\n)]+\.jpg)/g),
      (match) => match[1],
    );
    expect([...new Set(imagePaths)]).toEqual([
      '../images/015-taiwan-company-setup-pitch-location/featured-01.jpg',
      '../images/015-taiwan-company-setup-pitch-location/img-01.jpg',
    ]);

    const externalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((https?:\/\/[^)]+)\)/g),
      (match) => match[1],
    );
    const internalLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[1],
    );
    expect([...new Set(externalTargets)].sort()).toEqual(
      [...officialUrls].sort(),
    );
    expect([...new Set(internalLinks)]).toEqual(internalTargets);
    for (const target of [...officialUrls, ...internalTargets]) {
      expect(parsed.content.split(target)).toHaveLength(3);
    }
  });

  it('removes stale rules, locale leakage, and wrong identity', () => {
    const forbidden = [
      '僅當屬於主動查詢之營業項目時才必須先行查詢',
      '公司登記時不需要查詢所有營業項目',
      '後で',
      '之後',
      'img-02.jpg',
      'www.laws.taipei.gov.tw',
      '受領',
      '追加',
      '實態',
      '投資形態',
      '曾俊瑋',
      '/ko/',
      '/ja/',
      '/en/',
      '台湾',
      '查询',
      '账户',
      '网络',
      '许可',
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

    expect(visibleHanCount).toBe(3_314);
    expect(calculatedMinutes).toBe(9);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}分鐘閱讀`);
    expect(post?.readTime).toBe(`${calculatedMinutes}分鐘閱讀`);
    expect(getColumnPost('company-location', 'zh-hant')?.slug).toBe(
      'taiwan-company-setup-pitch-location',
    );
  });
});
