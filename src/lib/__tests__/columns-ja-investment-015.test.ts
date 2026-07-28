import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const koColumnPath = path.join(
  process.cwd(),
  'src/content/columns/015-taiwan-company-setup-pitch-location.md',
);
const jaColumnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/015-taiwan-company-setup-pitch-location.md',
);
const koRaw = fs.readFileSync(koColumnPath, 'utf8');
const jaRaw = fs.readFileSync(jaColumnPath, 'utf8');
const koParsed = matter(koRaw);
const jaParsed = matter(jaRaw);
const post = getColumnPost('taiwan-company-setup-pitch-location', 'ja');

function structuralSignature(content: string) {
  return content
    .split('\n')
    .map((line) => line.replace(/\u200b/g, '').trim())
    .filter(Boolean)
    .map((line) => {
      if (line.startsWith('# ')) return 'h1';
      if (line.startsWith('![')) {
        return `image:${line.match(/\]\(([^)]+)\)/)?.[1] ?? ''}`;
      }
      if (line.startsWith('<http')) return `autolink:${line.slice(1, -1)}`;
      if (line.startsWith('**Q.')) return 'question';
      if (line === '---') return 'thematic-break';
      if (line.startsWith('> - ')) return 'quoted-list-item';
      if (line.startsWith('> ')) return 'quote';
      return 'text';
    });
}

function expectInOrder(content: string, phrases: string[]) {
  const positions = phrases.map((phrase) => content.indexOf(phrase));
  expect(positions.every((position) => position >= 0)).toBe(true);
  expect(positions).toEqual([...positions].sort((a, b) => a - b));
}

function extractNonImageTargets(content: string) {
  return Array.from(
    content.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)|<(https?:\/\/[^>]+)>/g),
    (match) => match[1] ?? match[2],
  );
}

function visibleCharacterCount(content: string) {
  return content
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<https?:\/\/[^>]+>/g, '')
    .replace(/[#>*_`\-]/g, '')
    .replace(/\s/g, '').length;
}

describe('Japanese investment column 015 — faithful Korean-source mirror', () => {
  it('publishes the corrected title and preserves the contracted metadata', () => {
    expect(jaParsed.data.title).toBe(
      '台湾会社設立―応用編3：営業場所を探す',
    );
    expect(jaParsed.data.url).toBe(
      'https://www.wei-wei-lawyer.com/post/taiwan-company-setup-pitch-location',
    );
    expect(jaParsed.data.lastmod).toBe('2026-07-24');
    expect(jaParsed.data.date_display).toBe('2025年9月13日');
    expect(jaParsed.data.read_time).toBe('約2分');
    expect(jaParsed.data.categories).toEqual(['台湾会社設立']);
    expect(jaParsed.data.featured_image).toBe(
      '../images/015-taiwan-company-setup-pitch-location/featured-01.jpg',
    );
    expect(jaParsed.data.faq).toBeUndefined();

    expect(post?.slug).toBe('taiwan-company-setup-pitch-location');
    expect(post?.title).toBe(jaParsed.data.title);
    expect(post?.date).toBe('2026-07-24');
    expect(post?.dateDisplay).toBe('2025年9月13日');
    expect(post?.readTime).toBe('約2分');
    expect(post?.categoryLabel).toBe('台湾会社設立');
    expect(post?.faq).toBeUndefined();
    expect(post?.featuredImage).toBe(
      '/images/blog/015-taiwan-company-setup-pitch-location/featured-01.jpg',
    );
  });

  it('matches the Korean source block structure and body-title placement', () => {
    expect(structuralSignature(jaParsed.content)).toEqual(
      structuralSignature(koParsed.content),
    );
    expect(jaParsed.content).toContain(
      `# ${jaParsed.data.title as string}\n`,
    );
    expect(jaParsed.content).not.toContain('## ');
  });

  it('faithfully covers the Taipei restaurant example and location check', () => {
    const requiredPhrases = [
      '台湾では地方政府ごとに要件が異なり、以下では台北市で飲食店を開業する場合を例に説明します。',
      '飲食業を始める際、最初の問題は営業所在地を探すことです。',
      '市場の状況を考慮することに加え、',
      'もう一つ重要な点は、',
      'その所在地が「飲食店業」を営むことのできる地域にあるかどうかです。',
      '台北市商業処の「営業場所事前照会」システムを利用できます。',
      '希望する所在地で「飲食店業」を営めるかどうかを無料で照会できます。',
    ];

    for (const phrase of requiredPhrases) {
      expect(jaRaw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expectInOrder(jaParsed.content, requiredPhrases);
  });

  it('preserves the building-transcript steps, helpers, and registration warning', () => {
    const requiredPhrases = [
      '営業所在地の「建物登記第二類謄本」（対象建物の詳細情報が記載されています）をアップロードする必要があります。',
      '誰でも地政事務所で、任意の所在地に関する「建物登記第二類謄本」を申請できます。',
      '台湾在住の知人、家主、不動産仲介業者または弁護士に協力を求めることができます。',
      '照会の結果、飲食店業を営めないとされた場合、後に会社登記を行う際、市政府で登記できない可能性があります。',
      'そのため、十分にご注意ください。',
    ];

    for (const phrase of requiredPhrases) {
      expect(jaRaw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expectInOrder(jaParsed.content, requiredPhrases);
  });

  it('keeps the source question, recommendation, ten-item example, and exception', () => {
    const requiredPhrases = [
      '**Q. すべての業種について、「営業場所事前照会」システムで営業の可否を照会する必要がありますか？**',
      'すべての業種について、必ず「営業場所事前照会」システムで営業の可否を確認することをお勧めします。',
      '一度に10項目ほど登録したい場合も少なくありません。',
      '実際には会社登記の際にすべての業種を照会する必要はありません。',
      '「自発的照会対象業種」（主動查詢之營業項目）に該当する業種の場合に限り、**必ず**照会を行ったうえで、',
      'その照会結果を台北市政府へ併せて提出しなければなりません。',
      '後に管轄機関から罰金を科される可能性もあります。',
    ];

    for (const phrase of requiredPhrases) {
      expect(jaRaw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expectInOrder(jaParsed.content, requiredPhrases);
  });

  it('preserves exactly the source image paths and link targets', () => {
    const imagePaths = Array.from(
      jaRaw.matchAll(/(?:featured_image: "|!\[[^\]]*\]\()([^"\n)]+\.jpg)/g),
      (match) => match[1],
    );
    expect([...new Set(imagePaths)]).toEqual([
      '../images/015-taiwan-company-setup-pitch-location/featured-01.jpg',
      '../images/015-taiwan-company-setup-pitch-location/img-01.jpg',
      '../images/015-taiwan-company-setup-pitch-location/img-02.jpg',
    ]);
    expect(extractNonImageTargets(jaParsed.content)).toEqual([
      'https://www.businesslocationinfo.gov.taipei/BLBQS/Home/Notice',
      'https://www.laws.taipei.gov.tw/Law/LawSearch/LawArticleContent/FL080687',
      '/ko/guides/taiwan-company-setup',
      '/ko/korean-lawyer-in-taiwan',
      '/ko/taiwan-company-setup-lawyer',
    ]);
  });

  it('preserves the closing advice and all three related-article entries', () => {
    const requiredPhrases = [
      '以上、ご不明な点がありましたら、いつでも台湾の弁護士にお問い合わせください。',
      '行政機関の規則は頻繁に変更される可能性があるため、会社登記の前に最新の規定をご確認ください。',
      '> 関連記事：',
      '[台湾会社設立総合ガイド―手続・費用・法人形態を徹底解説](/ko/guides/taiwan-company-setup)',
      '[韓国語対応可能な台湾の弁護士](/ko/korean-lawyer-in-taiwan)',
      '[台湾法人設立・会社設立に関する弁護士のご案内](/ko/taiwan-company-setup-lawyer)',
    ];

    for (const phrase of requiredPhrases) {
      expect(jaRaw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expectInOrder(jaParsed.content, requiredPhrases);
  });

  it('removes the prior version’s unsupported sections, rules, and links', () => {
    const forbiddenLiterals = [
      'faq:',
      '2023年1月1日',
      '発行後3か月以内',
      '最大5項目',
      '5日（暦日）',
      '11日（暦日）',
      '6か月間有効',
      '借址登記',
      'バーチャルオフィス',
      '食品事業者登録',
      '住宅として使用する部分が全体の5分の3を超え',
      '事務所として使用する部分が5分の2未満',
      'https://www.gov.taipei/',
      'https://gcis.nat.gov.tw/',
      'https://www.fda.gov.tw/',
      '/ja/',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(jaRaw).not.toContain(forbidden);
      expect(post?.content).not.toContain(forbidden);
    }
    expect(jaRaw).not.toMatch(
      /不適合[^。\n]*(?:必ず|常に|一律)[^。\n]*登記[^。\n]*(?:拒否|できない)/,
    );
    expect(jaRaw).not.toMatch(
      /事前照会[^。\n]*(?:だけ|のみ)[^。\n]*営業(?:できます|できる)/,
    );
    expect(jaRaw).not.toMatch(
      /(?:弁護士|知人)[^。\n]*(?:必須|必要です|依頼しなければ)/,
    );
    expect(jaRaw).not.toMatch(
      /(?:バーチャルオフィス|借址登記)[^。\n]*(?:なら|は)[^。\n]*(?:合法|営業できます|使用できます)/,
    );
    expect(jaRaw).not.toMatch(
      /(?:5日|11日)[^。\n]*(?:必ず|保証)[^。\n]*(?:完了|処理)/,
    );
  });

  it('contains only Japanese-visible prose, with no wrong attorney identity', () => {
    const kana = /[\u3040-\u30ff]/g;
    const visibleJapaneseCount = visibleCharacterCount(jaParsed.content);
    const calculatedMinutes = Math.ceil(visibleJapaneseCount / 500);

    expect(jaRaw).not.toMatch(/[\uac00-\ud7af]/);
    expect(jaParsed.data.title).not.toMatch(/[\uac00-\ud7af]/);
    expect(post?.content).not.toMatch(/[\uac00-\ud7af]/);
    expect(jaRaw).not.toContain('曾俊瑋');
    expect(jaRaw.match(kana)?.length ?? 0).toBeGreaterThan(400);
    expect(visibleJapaneseCount).toBe(990);
    expect(jaParsed.data.read_time).toBe(`約${calculatedMinutes}分`);
  });

  it('resolves both canonical and alias slugs without changing the article', () => {
    expect(post?.slug).toBe('taiwan-company-setup-pitch-location');
    expect(getColumnPost('company-location', 'ja')?.slug).toBe(
      'taiwan-company-setup-pitch-location',
    );
    expect(getColumnPost('company-location', 'ja')?.content).toBe(
      post?.content,
    );
  });
});
