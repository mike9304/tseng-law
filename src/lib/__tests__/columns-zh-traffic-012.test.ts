import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-zh/012-taiwan-overtaking-accident-liability.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const canonicalSlug = 'taiwan-overtaking-accident-liability';
const post = getColumnPost(canonicalSlug, 'zh-hant');
const aliasPost = getColumnPost('overtaking-accident', 'zh-hant');

const title = '台灣超車事故的責任如何判斷？';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-overtaking-accident-liability';
const officialUrl =
  'https://laws.gov.taipei/Law/LawSearch/LawArticleContent/FL012455';
const supplementaryUrl = 'https://gonews.com.tw/car/daily/21934/';
const featuredImage =
  '../images/012-taiwan-overtaking-accident-liability/featured-01.jpg';
const incidentImage =
  '../images/012-taiwan-overtaking-accident-liability/img-01.jpg';
const featuredAlt = '說明台灣超車事故責任判斷與安全超車程序的圖片';
const incidentAlt = '顯示山路上機車與前方兩輛汽車超車路徑的事故示意圖';
const officialLabel = '臺灣《道路交通安全規則》第101條';
const supplementaryLabel = '超車法規與步驟圖解';
const headings = [
  '道路交通安全規則第101條的超車要件',
  '本所處理的匿名事故案例',
  '判斷超車事故責任時應確認的事項',
] as const;
const internalLinks = [
  {
    label: '台灣訴訟律師指南',
    href: '/zh-hant/taiwan-litigation-lawyer',
  },
  {
    label: '台灣韓語律師服務',
    href: '/zh-hant/korean-lawyer-in-taiwan',
  },
  {
    label: '台灣交通事故處理程序',
    href: '/zh-hant/columns/taiwan-traffic-accident-procedure',
  },
] as const;
const disclaimer =
  '本文僅提供台灣超車規則與事故責任判斷的一般法律資訊，不構成特定案件的法律意見或結果保證。實際責任可能因事故地點、車輛動態、速度、燈號、證據、鑑定結果及現行法規而異，具體案件仍應依相關資料個別分析。';

const EXPECTED_VISIBLE_HAN = 1_141;

function countOccurrences(value: string, needle: string) {
  return value.split(needle).length - 1;
}

/**
 * Independently testable visible-text extractor for Traditional Chinese
 * read-time: keep image alts and link labels, drop markdown chrome, then count
 * Han characters at 400 per minute (ceil).
 */
function extractVisibleText(content: string) {
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

function countVisibleHan(content: string) {
  const visibleText = extractVisibleText(content);
  return visibleText.match(/[\u3400-\u4DBF\u4E00-\u9FFF]/g)?.length ?? 0;
}

describe('Traditional Chinese traffic column 012 — overtaking accident liability', () => {
  it('publishes the exact frontmatter, sole H1, dates, category, and featured image', () => {
    expect(parsed.data).toEqual({
      title,
      url: sourceUrl,
      lastmod: '2026-07-26',
      date_display: '2025年9月13日',
      read_time: '3分鐘閱讀',
      categories: ['台灣法律資訊'],
      featured_image: featuredImage,
    });
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(raw).toContain(
      `# ${title}\n\n![${featuredAlt}](${featuredImage})`,
    );
    expect(countOccurrences(raw, sourceUrl)).toBe(1);
    expect(countOccurrences(raw, featuredImage)).toBe(2);
  });

  it('derives read_time from the exact visible Han count at 400 characters per minute', () => {
    const visibleHanCount = countVisibleHan(parsed.content);
    const calculatedMinutes = Math.ceil(visibleHanCount / 400);

    expect(visibleHanCount).toBe(EXPECTED_VISIBLE_HAN);
    expect(calculatedMinutes).toBe(3);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}分鐘閱讀`);
    expect(post?.readTime).toBe(`${calculatedMinutes}分鐘閱讀`);
  });

  it('uses the three contracted H2 headings in the required order', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual([...headings]);
    expect(parsed.content.indexOf(`## ${headings[0]}`)).toBeLessThan(
      parsed.content.indexOf(`## ${headings[1]}`),
    );
    expect(parsed.content.indexOf(`## ${headings[1]}`)).toBeLessThan(
      parsed.content.indexOf(`## ${headings[2]}`),
    );
  });

  it('states every current Article 101 proposition with the official regulation URL once', () => {
    expect(countOccurrences(raw, officialUrl)).toBe(1);
    expect(raw).toContain(`[${officialLabel}](${officialUrl})`);
    expect(post?.content).toContain(`(${officialUrl})`);

    const article101Groups = [
      '行經設有彎道、陡坡、狹橋、隧道、交岔路口標誌之路段，或鐵路平交道、道路施工地段，不得超車。',
      '在設有學校、醫院標誌，或其他禁止超車標誌、標線之處所或地段，對面有來車交會，或前行車連貫二輛以上時，也不得超車。',
      '欲超越同一車道之前車時，後行車須先按鳴喇叭二單響，或變換燈光一次；不得連續密集按鳴喇叭或變換燈光，迫使前車允讓。',
      '須俟前行車減速靠邊，或以手勢或亮右方向燈表示允讓後，後行車始得超越。',
      '超越時應顯示左方向燈，並於前車左側保持半公尺以上之間隔超過；行至安全距離後，再顯示右方向燈駛入原行路線。',
      '上述同一車道的警示與允讓程序，並非授權在禁止超車的地點或條件下超車。',
    ];
    for (const group of article101Groups) {
      expect(raw).toContain(group);
      expect(post?.content).toContain(group);
    }
  });

  it('keeps the anonymized matter fact-specific and rejects a universal one-signal fault rule', () => {
    const requiredCaseFacts = [
      '本所處理的一件匿名案件中，機車駕駛人A載著乘客B行駛於山路。',
      '前方有兩輛小客車，最前面的1號車行駛緩慢，因此2號車與機車也以較慢速度行進。',
      'A試圖一次超越前方兩車，駛入對向車道並加速。',
      '開啟方向燈後不到一秒即駛入對向車道。',
      '機車欠缺煞車餘裕，因而與2號車碰撞。',
      'B頭部受重傷，當場死亡；A失去意識，被送往醫院。',
      'A與B的家屬起初認為，2號車急速變換車道是碰撞的主要原因。',
      '案件進入訴訟，過程中並進行多次事故鑑定。',
      '依該等鑑定結果，A被認定為本件碰撞的主要肇因。',
      '該結論僅限於本件事實。',
      '鑑定綜合考量：A試圖超越連續行駛的前方兩車、駛入對向車道、車速使煞車餘裕不足、未為規定之喇叭或燈光示意、2號車的車道動態、道路與車道配置，以及其他既有證據。',
      '並不表示漏做一次規定示意就必然決定過失歸屬。',
    ];
    for (const fact of requiredCaseFacts) {
      expect(raw).toContain(fact);
      expect(post?.content).toContain(fact);
    }

    expect(raw).not.toContain('前車同意');
    expect(raw).not.toContain('前車的同意');
    expect(raw).not.toContain('必須取得同意');
    expect(raw).toContain('表示允讓');
    expect(raw).toContain('表示讓行');
  });

  it('uses the contracted featured and incident images with exact alts and drops the legacy graphic', () => {
    const imageBlocks = Array.from(
      parsed.content.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g),
      (match) => ({ alt: match[1], src: match[2] }),
    );
    expect(imageBlocks).toEqual([
      { alt: featuredAlt, src: featuredImage },
      { alt: incidentAlt, src: incidentImage },
    ]);
    expect(countOccurrences(raw, incidentImage)).toBe(1);
    expect(raw).not.toContain('img-02.jpg');
    expect(raw).not.toContain('中文版');
    expect(raw).not.toContain('翻譯成了中文');
    expect(raw).not.toContain('把新聞中的超車規定圖解翻譯');
  });

  it('preserves the secondary reading link and the three ZH-Hant internal links once each in order', () => {
    expect(countOccurrences(raw, supplementaryUrl)).toBe(1);
    expect(raw).toContain(`[${supplementaryLabel}](${supplementaryUrl})`);
    expect(raw).toContain('次級資料');
    expect(raw).toContain('現行官方規定');
    expect(post?.content).toContain(`(${supplementaryUrl})`);

    const markdownInternalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[1],
    );
    expect(markdownInternalTargets).toEqual(
      internalLinks.map(({ href }) => href),
    );
    for (const { label, href } of internalLinks) {
      expect(countOccurrences(raw, href)).toBe(1);
      expect(raw).toContain(`[${label}](${href})`);
      expect(post?.content).toContain(`(${href})`);
    }
  });

  it('loads the accepted slug and title through the canonical and overtaking-accident alias loaders', () => {
    expect(post).toMatchObject({
      slug: canonicalSlug,
      title,
      date: '2026-07-26',
      dateDisplay: '2025年9月13日',
      readTime: '3分鐘閱讀',
      category: 'legal',
      categoryLabel: '法律資訊',
      featuredImage:
        '/images/blog/012-taiwan-overtaking-accident-liability/featured-01.jpg',
    });
    expect(post?.faq).toBeUndefined();

    expect(aliasPost).toBeDefined();
    expect(aliasPost?.slug).toBe(canonicalSlug);
    expect(aliasPost?.title).toBe(title);
    expect(aliasPost?.date).toBe(post?.date);
    expect(aliasPost?.content).toBe(post?.content);
  });

  it('ends with the exact non-promissory disclaimer and removes former unsafe copy', () => {
    expect(raw.trimEnd().endsWith(disclaimer)).toBe(true);
    expect(countOccurrences(raw, disclaimer)).toBe(1);
    expect(post?.content).toContain(disclaimer);

    const forbiddenLegacyClaims = [
      '龜速',
      '投保了高額保險',
      '經濟上沒有遭受太大損失',
      '永遠壓在他的心頭',
      '也能避免承擔過重的事故責任',
      '我把新聞中的超車規定圖解翻譯成了中文版',
      '大家超車時請務必小心',
      'img-02.jpg',
      '不能從右側超車',
      '不能在雙黃線處超車',
      '\u200B',
      '\uFEFF',
      '\u00A0',
    ];
    for (const claim of forbiddenLegacyClaims) {
      expect(raw).not.toContain(claim);
    }
    expect(raw).not.toMatch(/[\p{Script=Hangul}]/u);
    expect(raw).not.toMatch(/(?:必須|務必).*(?:避免|保證).*(?:責任|事故)/);
  });
});
