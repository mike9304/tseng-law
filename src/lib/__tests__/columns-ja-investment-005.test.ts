import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/005-taiwan-company-establishment-advanced-2.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('taiwan-company-establishment-advanced-2', 'ja');

const retainedLocalizedLinks = [
  '/ja/columns/taiwan-company-establishment-basics',
  '/ja/columns/taiwan-company-establishment-advanced-1',
  'https://ezworktaiwan.wda.gov.tw/cp.aspx?n=A88DC323EF7C85FF',
  '/ja/services#investment',
  '/ja/columns/taiwan-company-establishment-advanced-1',
  '/ja/contact',
];

const canonicalQuestions = [
  '1. 韓国から台湾会社の準備口座へ資本金を送金する際、注意すべき点は何ですか？',
  '2. 会社の資本金を払い込む際、本人名義の台湾の口座から台湾ドルを台湾会社の準備口座へ送金できますか？',
  '3. 資本金が会社の準備口座へ入金された後、いつ正式口座へ切り替えることができますか？',
  '4. 会社の準備口座を正式口座へ切り替えた後、すぐにインターネットバンキングを利用できますか？',
  '5. 会社は韓国人を従業員として雇用できますか',
];

function markdownToVisibleJapanese(content: string) {
  return content
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^ {0,3}(?:[-*_]\s*){3,}$/gm, ' ')
    .replace(/^ {0,3}(?:#{1,6}\s*|>\s*|[-+*]\s+|\d+[.)]\s+)/gm, '')
    .replace(/[*_~`]/g, '')
    .replace(/\\([\\`*_[\]{}()#+\-.!>])/g, '$1')
    .replace(/\s+/g, '');
}

describe('Japanese column 005 — Korean-canonical mirror', () => {
  it('preserves the canonical frontmatter semantics and localized title', () => {
    expect(parsed.data).toEqual({
      title: '台湾会社設立―応用編2',
      url: 'https://www.wei-wei-lawyer.com/post/taiwan-company-establishment-advanced-2',
      lastmod: '2026-07-24',
      date_display: '2025年9月13日',
      read_time: '約2分',
      categories: ['台湾会社設立'],
      featured_image:
        '../images/005-taiwan-company-establishment-advanced-2/featured-01.jpg',
    });
    expect(post?.slug).toBe('taiwan-company-establishment-advanced-2');
    expect(post?.title).toBe(parsed.data.title);
    expect(post?.date).toBe('2026-07-24');
    expect(post?.dateDisplay).toBe('2025年9月13日');
    expect(post?.readTime).toBe('約2分');
    expect(post?.categoryLabel).toBe('台湾会社設立');
    expect(post?.faq).toBeUndefined();
  });

  it('keeps the source heading, two images, and five questions in canonical order', () => {
    expect(raw).toContain('# 台湾会社設立―応用編2');
    for (const imagePath of [
      '../images/005-taiwan-company-establishment-advanced-2/featured-01.jpg',
      '../images/005-taiwan-company-establishment-advanced-2/img-01.jpg',
    ]) {
      expect(raw).toContain(imagePath);
    }
    expect(post?.featuredImage).toBe(
      '/images/blog/005-taiwan-company-establishment-advanced-2/featured-01.jpg',
    );

    const positions = canonicalQuestions.map((question) => raw.indexOf(question));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(raw.match(/^\*\*\d+\. .+\*\*$/gm)).toHaveLength(5);
    expect(raw).not.toMatch(/^## /m);
  });

  it('faithfully restores the Korean capital-remittance statements', () => {
    const requiredPhrases = [
      '投資家**本人**が韓国の銀行窓口を直接訪れ、本人名義の口座から送金することを求めています。',
      'インターネットバンキングや、韓国にいる親族・知人による代理送金はできません。',
      '韓国籍の方が外国法人を設立し、またはその持分を取得した場合は、「海外直接投資申告」を行わなければなりません。',
      '申告は台湾法人への資本金送金時までに受理されている必要があり',
      '未申告の場合は外国為替管理法違反として制裁を受ける可能性があります。',
      '資本金を送金する前に、韓国の主取引銀行へご相談ください。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('faithfully restores the source-of-funds examples and Korean-bank exception', () => {
    const requiredPhrases = [
      '台湾で取得した台湾ドルの資金源を証明する書類を提出する必要があります。',
      '給与所得に関する源泉徴収票の写し（薪資所得的扣繳憑單影本）',
      '配当金および利益に関する源泉徴収票の写し（股息和紅利的扣繳憑單影本）',
      '韓国の銀行口座から送金する場合は、資金源に関する書類を添付する必要はありません。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('faithfully restores the account-conversion and internet-banking conditions', () => {
    const requiredPhrases = [
      '法人登記書類を受け取った後、',
      '会社責任者が銀行へ出向き、会社の準備口座を正式口座へ切り替えることができます。',
      '各銀行の内部規定は異なるため',
      '通常は少なくとも携帯電話番号が必要です。',
      '会社設立後の口座利用期間が6か月以上であることなど、追加要件',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('faithfully restores the two-tier Korean-employee rule and official reference', () => {
    const requiredPhrases = [
      '1人目の従業員には制限なし',
      '一般僑外投資事業主管業務（一般僑外投資事業主管工作）',
      '2人目以降の従業員には制限あり',
      '従業員の関連する学歴および職歴、平均給与に関する雇用基準',
      '会社の資本金および売上高に関する基準',
      '「専門性または技術性を要する業務」（專門性或技術性工作）に準じて取り扱われます。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expect(raw).toContain(
      '台湾労働部ウェブサイト参照：<https://ezworktaiwan.wda.gov.tw/cp.aspx?n=A88DC323EF7C85FF>',
    );
  });

  it('preserves exactly the six retained localized URLs and no source-absent links', () => {
    const urls = Array.from(
      raw.matchAll(/(?:(?<!!)\[[^\]]+\]\(([^)]+)\)|<(https?:\/\/[^>]+)>)/g),
      (match) => match[1] ?? match[2],
    );
    expect(urls).toEqual(retainedLocalizedLinks);
  });

  it('removes the source-absent legal expansion and keeps the identity safe', () => {
    const forbiddenPhrases = [
      '指定外国為替銀行',
      'マネー・ローンダリング対策',
      '投資総額の確認（審定）',
      '実質的支配者',
      '台湾法上の「経理人」',
      '払込済資本金または台湾における運転資金が50万新台湾ドル以上',
      '本稿は一般的な制度を整理する教育目的',
      '## 公式資料',
      '曾俊瑋',
    ];

    for (const phrase of forbiddenPhrases) {
      expect(raw).not.toContain(phrase);
      expect(post?.content).not.toContain(phrase);
    }
    expect(raw).not.toMatch(/[\uac00-\ud7af]/);
    expect(parsed.data.title).not.toMatch(/[\uac00-\ud7af]/);
    expect(post?.content).not.toMatch(/[\uac00-\ud7af]/);
  });

  it('keeps read time aligned with the Japanese visible-character rule', () => {
    const visibleCharacters = markdownToVisibleJapanese(parsed.content).length;
    const minutes = Math.max(1, Math.ceil(visibleCharacters / 800));

    expect(visibleCharacters).toBeGreaterThanOrEqual(800);
    expect(visibleCharacters).toBeLessThan(1_600);
    expect(parsed.data.read_time).toBe(`約${minutes}分`);
  });

  it('resolves both the canonical and alias slugs in Japanese', () => {
    expect(post?.slug).toBe('taiwan-company-establishment-advanced-2');
    expect(getColumnPost('company-advanced-2', 'ja')?.slug).toBe(
      'taiwan-company-establishment-advanced-2',
    );
  });
});
