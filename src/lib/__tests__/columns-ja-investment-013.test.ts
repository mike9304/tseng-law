import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/013-taiwan-company-establishment-advanced-1.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('taiwan-company-establishment-advanced-1', 'ja');

const questions = [
  '1. 会社を設立したいのですが、まだ会社の登記住所が見つかっていません。設立は可能でしょうか？',
  '2. 台湾の居留証がなくても、銀行で会社口座を開設できますか？',
  '3. 投資計画の審査では学歴と職歴を記載する必要があると聞きました。私の学歴や職歴が、設立しようとしている会社の業種と合わないのではないかと心配です。',
  '4. 会社の登記住所（例：飲食店の店舗）を借りる際に、注意すべき点はありますか？',
  '5. 会社設立時に商業スペースを借りることはできますか？',
];

describe('Japanese investment column 013 — Korean-source mirror', () => {
  it('preserves the contracted frontmatter while restoring the source title', () => {
    expect(parsed.data.title).toBe('台湾会社設立―応用編―1');
    expect(parsed.data.url).toBe(
      'https://www.wei-wei-lawyer.com/post/taiwan-company-establishment-advanced-1',
    );
    expect(parsed.data.lastmod).toBe('2026-07-24');
    expect(parsed.data.date_display).toBe('2025年9月13日');
    expect(parsed.data.read_time).toBe('約4分');
    expect(parsed.data.categories).toEqual(['台湾会社設立']);
    expect(parsed.data.featured_image).toBe(
      '../images/013-taiwan-company-establishment-advanced-1/featured-01.jpg',
    );
    expect(parsed.data.faq).toBeUndefined();

    expect(post?.slug).toBe('taiwan-company-establishment-advanced-1');
    expect(post?.title).toBe(parsed.data.title);
    expect(post?.date).toBe('2026-07-24');
    expect(post?.dateDisplay).toBe('2025年9月13日');
    expect(post?.readTime).toBe('約4分');
    expect(post?.faq).toBeUndefined();
  });

  it('keeps exactly five source-ordered questions in the original bold structure', () => {
    const bodyQuestions = Array.from(
      raw.matchAll(/^\*\*(\d+\.[^\n]+)\*\*$/gm),
      (match) => match[1],
    );

    expect(bodyQuestions).toEqual(questions);
    expect(post?.content.match(/^## /gm)).toBeNull();
    expect(raw.match(/^# /gm)).toHaveLength(1);
    expect(raw).toContain('**アドバイス**：');
  });

  it('restores the complete address and investment-review answer without added law', () => {
    const requiredPhrases = [
      '経済部投資審議司に投資計画書を提出し、審査を受けなければなりません。',
      'その資本金が実際に投資目的で使用されるのか、',
      '海外勢力が別の名目で資金を流入させるものではないか',
      '地域のみの記載でも構いません（例：台北市）。',
      '多くの銀行が賃貸借契約書を確認し、会社の所在地を実地調査します。',
      '口座開設後に行方をくらます外国人が多いため',
      '口座開設は最も難しい手続だとおっしゃっていましたが、私も同感です。',
      '台湾ではマネーロンダリングの事例が非常に多いため',
      '投資計画書の作成と会社の登記住所探しを同時に進めることです。',
      '投資承認後1年以内に資本金を送金するよう定めているため',
      '銀行で会社準備口座を開設し、資本金を送金するまでに十分な時間があります。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('restores every source statement about identity documents and career review', () => {
    const requiredPhrases = [
      '台湾の居留証がなくても、銀行で会社口座を開設できますか？',
      '一般に、銀行では二つの身分証明書を求められますが、',
      '台湾の移民署で「**基本資料表**（統一證號基本資料表）」を申請',
      '当日中に発行してもらえますが、',
      '移民署は非常に混雑するため、早めに行って整理券をお取りください。',
      '経済部の審議委員会では投資家の経歴を審査しますが、',
      'それほど厳格ではありません。',
      'アルバイトを含むさまざまな職歴に言及することができ、',
      '審査委員を説得できるよう、詳しく説明すればよいでしょう。',
      '台湾の弁護士と十分にご相談ください。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('restores every source condition for lease timing and landlord negotiations', () => {
    const requiredPhrases = [
      '会社設立には約**3か月**、就労許可証と居留証の取得にも約**1か月**',
      '契約開始日はできるだけ遅く設定してください。',
      '家主が借主に「**内装期間**」を設けることがよくあります。',
      'これは賃料が免除される期間ですので、交渉してみてください。',
      '台湾の保証金は比較的少ない（通常2か月分）',
      '家主は外国人に貸すことをためらう傾向があります。',
      '営業場所は早い段階から探し始めることをお勧めします。',
      '賃貸借契約書の公証や追加保証金の提供を提案することもできます。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('preserves the source conditions and sequence for commercial space', () => {
    const requiredPhrases = [
      '会社の営業項目によって異なります。',
      '営業項目が飲食業であるにもかかわらず商業スペースを借りようとする場合、銀行口座の開設は非常に難しいでしょう。',
      '銀行は賃貸借契約書を確認し、会社の所在地を実地調査します。',
      '飲食店を営業できる区域内に登記住所がなければならず、',
      '商業スペースの場合は会社登記ができません。',
      '広告業や卸売業など、商業スペースで営むことのできる営業項目',
      '契約を締結する前に、あらかじめ確認してください。',
    ];

    const positions = requiredPhrases.map((phrase) => raw.indexOf(phrase));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));

    for (const phrase of requiredPhrases) {
      expect(post?.content).toContain(phrase);
    }
  });

  it('preserves every source URL, both images, and the prohibited-name guard', () => {
    const links = Array.from(
      raw.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g),
      (match) => match[1],
    );

    expect(links).toEqual([
      'https://www.wei-wei-lawyer.com/post/%EB%8C%80%EB%A7%8C-%ED%9A%8C%EC%82%AC%EC%84%A4%EB%A6%BD-%EA%B8%B0%EC%B4%88%ED%8E%B8',
      '/ko/guides/taiwan-company-setup',
      '/ko/korean-lawyer-in-taiwan',
      '/ko/taiwan-company-setup-lawyer',
    ]);
    expect(raw).not.toContain('曾俊瑋');

    for (const imagePath of [
      '../images/013-taiwan-company-establishment-advanced-1/featured-01.jpg',
      '../images/013-taiwan-company-establishment-advanced-1/img-01.jpg',
    ]) {
      expect(raw).toContain(imagePath);
    }
    expect(post?.featuredImage).toBe(
      '/images/blog/013-taiwan-company-establishment-advanced-1/featured-01.jpg',
    );
  });

  it('excludes the previous unsourced rewrite and contains substantial Japanese text', () => {
    const unsourcedLiterals = [
      '外国人投資条例（Statute for Investment by Foreign Nationals）第9条',
      '労働部労働力発展署（WDA）',
      'オンライン申請は7営業日、書面申請は12営業日',
      '台北市の営業場所事前照会',
      '## 手続を進める前の確認',
      '### 公式資料',
      '本記事は一般的な制度を説明する教育目的の情報です。',
      '/ja/columns/taiwan-company-establishment-basics',
    ];

    for (const literal of unsourcedLiterals) {
      expect(raw).not.toContain(literal);
    }
    expect(raw).not.toMatch(/[\uac00-\ud7af]/);
    expect(parsed.data.title).not.toMatch(/[\uac00-\ud7af]/);
    expect(post?.content).not.toMatch(/[\uac00-\ud7af]/);

    const kana = /[\u3040-\u30ff]/g;
    expect(raw.match(kana)?.length ?? 0).toBeGreaterThan(500);
    expect(raw.length).toBeGreaterThan(2_500);
    expect(raw.length).toBeLessThan(3_200);
    expect(post?.content.length).toBeGreaterThan(2_000);
    expect(post?.content.length).toBeLessThan(2_700);
    expect(getColumnPost('company-advanced-1', 'ja')?.slug).toBe(
      'taiwan-company-establishment-advanced-1',
    );
  });

  it('locks the visible-Japanese count and derives read time at 500 characters per minute', () => {
    const visibleJapaneseCount = (
      parsed.content.match(
        /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}々〆ヵヶー]/gu,
      ) ?? []
    ).length;
    const visibleKanaCount = (
      parsed.content.match(/[\p{Script=Hiragana}\p{Script=Katakana}ー]/gu) ?? []
    ).length;
    const calculatedMinutes = Math.ceil(visibleJapaneseCount / 500);

    expect(visibleJapaneseCount).toBe(1_700);
    expect(visibleKanaCount).toBe(894);
    expect(calculatedMinutes).toBe(4);
    expect(parsed.data.read_time).toBe(`約${calculatedMinutes}分`);
    expect(post?.readTime).toBe(`約${calculatedMinutes}分`);
  });
});
