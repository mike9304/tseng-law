import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/012-taiwan-overtaking-accident-liability.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const canonicalSlug = 'taiwan-overtaking-accident-liability';
const post = getColumnPost(canonicalSlug, 'ja');
const aliasPost = getColumnPost('overtaking-accident', 'ja');

const title = '台湾の追い越し事故、責任はどう判断されるか';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-overtaking-accident-liability';
const officialUrl =
  'https://laws.gov.taipei/Law/LawSearch/LawArticleContent/FL012455';
const supplementaryUrl = 'https://gonews.com.tw/car/daily/21934/';
const featuredImage =
  '../images/012-taiwan-overtaking-accident-liability/featured-01.jpg';
const incidentImage =
  '../images/012-taiwan-overtaking-accident-liability/img-01.jpg';
const featuredAlt =
  '台湾での追い越し事故の責任判断と安全な追い越し手順を説明する画像';
const incidentAlt =
  '山道でオートバイと前方2台の自動車が関与した追い越し衝突の模式図';
const officialLabel = '台湾の「道路交通安全規則」第101条';
const supplementaryLabel = '追い越し法規と手順の図解';
const headings = [
  '道路交通安全規則第101条が定める追い越しの要件',
  '当事務所が扱った匿名の事故事例',
  '追い越し事故の責任を判断するときに確認すべき点',
] as const;
const internalLinks = [
  {
    label: '台湾訴訟弁護士ガイド',
    href: '/ja/taiwan-litigation-lawyer',
  },
  {
    label: '韓国語対応の台湾弁護士',
    href: '/ja/korean-lawyer-in-taiwan',
  },
  {
    label: '台湾交通事故の処理手続',
    href: '/ja/columns/taiwan-traffic-accident-procedure',
  },
] as const;
const disclaimer =
  '本稿は、台湾の追い越し規則および追い越し事故後の責任判断に関する一般的な法律情報であり、個別事案に対する法律意見や結果の保証ではありません。実際の過失・責任は、事故地点、車両の動き、速度、合図、証拠、鑑定結果および現行法規により異なり得るため、具体的な事案は関連資料に照らして個別に検討する必要があります。';

const EXPECTED_VISIBLE_JAPANESE = 1_857;
const EXPECTED_VISIBLE_KANA = 928;
const EXPECTED_READ_MINUTES = 4;
const EXPECTED_SOURCE_SHA256 =
  '825e700f1a5c33ac4676c62fbfc416259f391b353216ed59000d9421433642ca';

const article101Groups = [
  '曲線、急勾配、狭橋、トンネル、交差点を示す標識が設けられた区間、ならびに鉄道の踏切や道路工事区間では、追い越しは禁止されます。',
  '学校や病院の標識がある場所、その他の追い越し禁止の標識や標線がある場所、対向車が接近しているとき、前方に二台以上の車両が連続して走行しているときにも、追い越しはできません。',
  '同一車道の前車を追い越そうとする後続車は、まず警音器を短く二回鳴らすか、前照灯を一回点滅させなければなりません。',
  '前車に進路を譲るよう強いるために、警音器や前照灯を繰り返し用いることは許されません。',
  '追い越しを始めてよいのは、前車が減速して路側へ寄るか、手信号または右方向指示器で進路を譲る意思を示した後に限られます。',
  '追い越し側は左方向指示器を出し、前車の左側を少なくとも〇・五メートルの間隔を保って通過し、安全な車間を確保したうえで右方向指示器を出し、元の進路へ戻ります。',
  '同一車道で後続車が合図をし、前車が進路を譲るという手順は、第101条が別に定める禁止条件を覆して追い越しを許す根拠にはなりません。',
] as const;

const requiredCaseFacts = [
  '当事務所が扱った匿名の一件では、オートバイ運転者Aが同乗者Bを乗せ、山道を走行していました。',
  '前方には乗用車が二台あり、先頭の1号車は低速で進行していたため、2号車とオートバイも遅い速度で続いていました。',
  'Aは前方の二台をまとめて追い越そうとし、対向車線に入って加速しました。',
  '方向指示器を出してから一秒未満で対向車線に入りました。',
  'オートバイには十分な制動の余裕がなく、2号車と衝突しました。',
  'Bは頭部に重傷を負い、現場で死亡しました。Aは意識を失い、病院へ搬送されました。',
  'AとBの家族は当初、2号車の急な対向車線への進入が衝突の主因だと考えていました。',
  '事案は訴訟に至り、事故鑑定が複数回行われました。',
  'それらの鑑定では、本件の主たる事故原因はAにあると判断されました。',
  'この鑑定結果は当該事案に限られ',
  '連続して走行する前方二台を一度に追い越そうとしたこと、対向車線に進入したこと、選択した速度では制動の余裕が不足していたこと、所定の合図を行わなかったこと、2号車の動き、道路・車線の配置、その他の証拠です。',
  '所定の合図を一度欠いただけで、常に過失が定まるわけではありません。',
  '第101条に従ったこと自体が事故回避を保証するわけでも、後の鑑定や訴訟の結論をあらかじめ決めるわけでもありません。',
] as const;

function countOccurrences(value: string, needle: string) {
  return value.split(needle).length - 1;
}

/**
 * Independently testable visible-text extractor for Japanese column read-time:
 * keep image alts and link labels, drop markdown chrome, then count Han + kana.
 */
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

function countVisibleJapanese(content: string) {
  const publicText = extractPublicText(content);
  return (
    publicText.match(
      /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu,
    )?.length ?? 0
  );
}

function countVisibleKana(content: string) {
  const publicText = extractPublicText(content);
  return (
    publicText.match(/[\p{Script=Hiragana}\p{Script=Katakana}]/gu)?.length ?? 0
  );
}

describe('Japanese traffic column 012 — overtaking accident liability', () => {
  it('publishes the exact frontmatter, sole H1, dates, category, and featured image', () => {
    expect(parsed.data).toEqual({
      title,
      url: sourceUrl,
      lastmod: '2026-07-26',
      date_display: '2025年9月13日',
      read_time: `約${EXPECTED_READ_MINUTES}分`,
      categories: ['台湾法律情報'],
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

  it('freezes exact visible Japanese count, kana count, read time, and source SHA-256', () => {
    const visibleJapaneseCount = countVisibleJapanese(parsed.content);
    const visibleKanaCount = countVisibleKana(parsed.content);
    const calculatedMinutes = Math.ceil(visibleJapaneseCount / 500);
    const sourceSha = crypto.createHash('sha256').update(raw).digest('hex');

    expect(visibleJapaneseCount).toBe(EXPECTED_VISIBLE_JAPANESE);
    expect(visibleJapaneseCount).toBeGreaterThanOrEqual(1_500);
    expect(visibleKanaCount).toBe(EXPECTED_VISIBLE_KANA);
    expect(visibleKanaCount).toBeGreaterThanOrEqual(600);
    expect(calculatedMinutes).toBe(EXPECTED_READ_MINUTES);
    expect(parsed.data.read_time).toBe(`約${calculatedMinutes}分`);
    expect(post?.readTime).toBe(`約${calculatedMinutes}分`);
    expect(sourceSha).toBe(EXPECTED_SOURCE_SHA256);
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

  it('states every Article 101 proposition group with the official regulation URL once', () => {
    expect(countOccurrences(raw, officialUrl)).toBe(1);
    expect(raw).toContain(`[${officialLabel}](${officialUrl})`);
    expect(post?.content).toContain(`(${officialUrl})`);
    expect(article101Groups).toHaveLength(7);

    for (const group of article101Groups) {
      expect(raw).toContain(group);
      expect(post?.content).toContain(group);
      expect(countOccurrences(raw, group)).toBe(1);
    }
  });

  it('keeps the anonymized matter fact-specific with multi-factor appraisal limits', () => {
    for (const fact of requiredCaseFacts) {
      expect(raw).toContain(fact);
      expect(post?.content).toContain(fact);
    }

    expect(raw).toContain('この鑑定結果は当該事案に限られ');
    expect(raw).toContain(
      '所定の合図を一度欠いただけで、常に過失が定まるわけではありません。',
    );
    expect(raw).toContain(
      '第101条に従ったこと自体が事故回避を保証するわけでも、後の鑑定や訴訟の結論をあらかじめ決めるわけでもありません。',
    );
    expect(raw).not.toContain('前の車の同意');
    expect(raw).not.toContain('前車の同意');
    expect(raw).not.toContain('同意を得てから');
  });

  it('uses the contracted featured and incident images with exact alts and drops img-02', () => {
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
    expect(raw).not.toContain('韓国語版に翻訳');
    expect(raw).not.toContain('韓国語版');
    expect(raw).not.toContain('ニュースにある追い越し規定の画像');

    const incidentSection = parsed.content.slice(
      parsed.content.indexOf(`## ${headings[1]}`),
      parsed.content.indexOf(`## ${headings[2]}`),
    );
    expect(incidentSection).toContain(
      `![${incidentAlt}](${incidentImage})`,
    );
  });

  it('preserves the secondary reading link and the three Japanese internal links once each', () => {
    expect(countOccurrences(raw, supplementaryUrl)).toBe(1);
    expect(raw).toContain(`[${supplementaryLabel}](${supplementaryUrl})`);
    expect(raw).toContain('二次資料');
    expect(raw).toContain('現行の公式規定を優先');
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

    expect(raw).not.toContain('/ko/');
    expect(raw).not.toContain('/zh-hant/');
    expect(raw).not.toContain('/en/');
  });

  it('loads the accepted slug and title through the canonical and overtaking-accident alias loaders', () => {
    expect(post).toMatchObject({
      slug: canonicalSlug,
      title,
      date: '2026-07-26',
      dateDisplay: '2025年9月13日',
      readTime: `約${EXPECTED_READ_MINUTES}分`,
      category: 'legal',
      categoryLabel: '台湾法律情報',
      featuredImage:
        '/images/blog/012-taiwan-overtaking-accident-liability/featured-01.jpg',
    });
    expect(post?.faq).toBeUndefined();

    expect(aliasPost).toBeDefined();
    expect(aliasPost?.slug).toBe(canonicalSlug);
    expect(aliasPost?.title).toBe(title);
    expect(aliasPost?.date).toBe(post?.date);
    expect(aliasPost?.dateDisplay).toBe(post?.dateDisplay);
    expect(aliasPost?.readTime).toBe(post?.readTime);
    expect(aliasPost?.category).toBe(post?.category);
    expect(aliasPost?.categoryLabel).toBe(post?.categoryLabel);
    expect(aliasPost?.featuredImage).toBe(post?.featuredImage);
    expect(aliasPost?.content).toBe(post?.content);
  });

  it('ends with the exact related-link block and non-promissory disclaimer', () => {
    const relatedBlock = `> 関連リンク:
> - [台湾訴訟弁護士ガイド](/ja/taiwan-litigation-lawyer)
> - [韓国語対応の台湾弁護士](/ja/korean-lawyer-in-taiwan)
> - [台湾交通事故の処理手続](/ja/columns/taiwan-traffic-accident-procedure)

${disclaimer}`;

    expect(raw).toContain(relatedBlock);
    expect(raw.trimEnd().endsWith(disclaimer)).toBe(true);
    expect(countOccurrences(raw, disclaimer)).toBe(1);
    expect(post?.content).toContain(disclaimer);

    const afterDisclaimer = raw.trimEnd().slice(
      raw.trimEnd().lastIndexOf(disclaimer) + disclaimer.length,
    );
    expect(afterDisclaimer).toBe('');
  });

  it('removes all prohibited legacy claims, Hangul, invisible characters, and WIP markers', () => {
    const forbiddenLegacyClaims = [
      '責任は誰に？？？',
      '？？？',
      '先日私が扱った事件',
      '前の車の同意',
      '前車の同意',
      '保険を厚く',
      '経済的な大きな被害',
      '後遺症',
      '永遠に苦しめる',
      '過大な事故責任',
      '圖解超車法規和步驟',
      '韓国語版に翻訳',
      'img-02.jpg',
      '右側から追い越せない',
      '二重の黄色線',
      'TODO',
      'FIXME',
      'WIP',
      'TBD',
      '\u200B',
      '\uFEFF',
      '\u00A0',
    ];
    for (const claim of forbiddenLegacyClaims) {
      expect(raw).not.toContain(claim);
    }
    expect(raw).not.toMatch(/[\p{Script=Hangul}]/u);
    expect(raw).not.toMatch(/過大な.*責任を避ける/);
    expect(raw).not.toContain('過大な事故責任を避けることができます');
    // Non-guarantee phrasing is required; promissory "guarantee of outcome" is not.
    expect(raw).toContain('結果の保証ではありません');
    expect(raw).toContain('事故回避を保証するわけでも');
    expect(raw).toContain('訴訟結果を保証するものでもありません');
    expect(raw).not.toMatch(/結果を保証します/);
    expect(raw).not.toMatch(/責任を回避できます/);
  });
});
