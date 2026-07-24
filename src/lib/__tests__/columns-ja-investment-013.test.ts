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

function extractBodyFaq(content: string) {
  return Array.from(
    content.matchAll(/^## \d+\. (.+)\n\n([^\n]+)$/gm),
    (match) => ({
      q: match[1],
      a: match[2],
    }),
  );
}

const faq = [
  {
    q: '登記住所が未確定の段階では、どのように準備すべきですか？',
    a: '外国投資申請と会社登記では、求められる所在地情報・書類が異なります。申請時点では最新の申請様式と審査案内を確認し、会社登記までに賃貸借契約書、建物資料、所有者の同意その他の必要書類を準備します。予定地で営業項目を行えるかも、土地使用分区、建築管理および業種別許認可の観点から事前に確認してください。',
  },
  {
    q: '台湾の居留証がなくても、会社口座の開設を相談できますか？',
    a: '銀行ごとに本人確認と口座開設に必要な資料が異なります。居留証がない場合に旅券、統一証号に関する資料その他の代替書類で相談できるかを含め、受理の可否と必要書類は口座開設前に銀行へ確認してください。会社準備口座と正式口座でも手続が異なり得ます。',
  },
  {
    q: '学歴・職歴と予定する事業の分野が異なっていても申請できますか？',
    a: '学歴・職歴は事実に基づいて記載し、担当する職務、事業計画、資金、専門知識および事業を実行できる体制との関係を具体的に説明します。経歴の分野が異なることだけで結論が決まるとは限りませんが、虚偽または誇張した経歴を記載してはいけません。補足資料や説明が必要かは個別案件に応じて確認してください。',
  },
  {
    q: '会社設立や就業許可を見込んで賃貸借契約を結ぶときの注意点は何ですか？',
    a: '会社設立、銀行手続、就業許可および居留の全工程に一律の処理期間はありません。契約開始日、内装期間、賃料免除、保証、追加保証金および公証の要否は、物件、当事者の合意および個別事情に応じて交渉します。許認可や営業場所の適合性を確認し、手続が遅れた場合の負担も契約前に検討してください。',
  },
  {
    q: '一般のオフィスを飲食業などの営業場所として使えますか？',
    a: '使用の可否は、営業項目、土地使用分区、建物の用途、賃貸借条件および業種別許認可により異なります。一般のオフィスであることだけを理由に飲食業等を行えるとは限りません。台北市では対象となる会社・商業登記について営業場所事前照会制度が運用されているため、契約前に所在地と営業項目の適合性を確認してください。銀行の本人確認・口座審査はこれとは別の手続です。',
  },
];

describe('Japanese investment column 013 — company-setup practice Q&A', () => {
  it('publishes the contracted frontmatter and exactly five exact FAQs', () => {
    expect(parsed.data.title).toBe('台湾会社設立：住所・銀行口座・審査の実務Q&A');
    expect(parsed.data.url).toBe(
      'https://www.wei-wei-lawyer.com/post/taiwan-company-establishment-advanced-1',
    );
    expect(parsed.data.lastmod).toBe('2026-07-24');
    expect(parsed.data.date_display).toBe('2025年9月13日');
    expect(parsed.data.read_time).toBe('約6分');
    expect(parsed.data.categories).toEqual(['台湾会社設立']);
    expect(parsed.data.faq).toHaveLength(5);
    expect(parsed.data.faq).toEqual(faq);

    expect(post?.slug).toBe('taiwan-company-establishment-advanced-1');
    expect(post?.title).toBe(parsed.data.title);
    expect(post?.date).toBe('2026-07-24');
    expect(post?.dateDisplay).toBe('2025年9月13日');
    expect(post?.readTime).toBe('約6分');
    expect(post?.faq).toEqual(faq);
  });

  it('keeps the five body questions aligned with the FAQ contract', () => {
    expect(extractBodyFaq(raw)).toEqual(faq);
    expect(extractBodyFaq(post?.content ?? '')).toEqual(faq);
  });

  it('states the current agency and qualified Article 9 investment sequence', () => {
    const agencyParagraph =
      '投資計画、投資申請者に関する情報、資金の出所と用途、予定する事業活動、出資方法および提出書類の内容が確認されます。';
    const article9Paragraph =
      '外国人投資条例（Statute for Investment by Foreign Nationals）第9条は、承認された投資額を所定の期間内に全額送金し、その送金について所管機関に報告して審査を受けたうえ、投資の実行後に投資総額の確認（審定）を申請することを求めています。実際に適用される期限、送金方法、報告書類および確認申請に必要な書類は、個別の承認内容と最新の案内で確認してください。';
    const requiredPhrases = [
      '経済部投資審議司（Department of Investment Review, MOEA）',
      agencyParagraph,
      'すべての案件に同じ資料が求められるわけではありません。',
      '外国投資申請と会社登記は、所在地に関する確認の段階と書類が同一ではありません。',
      article9Paragraph,
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }

    const sequence = ['全額送金', '所管機関に報告', '審査を受けたうえ', '投資の実行後', '確認（審定）を申請'];
    const positions = sequence.map((step) => article9Paragraph.indexOf(step));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('qualifies bank documents, truthful history, and the WDA processing target', () => {
    const requiredPhrases = [
      '必要書類と確認方法は、銀行、支店、会社形態、申請者の在留状況、代表者、予定する取引および個別案件によって異なります。',
      'これらの資料があればどの銀行でも受理するという意味ではなく',
      '会社準備口座と、会社登記後の正式な会社口座',
      '学歴・職歴は事実に基づいて記載し',
      '虚偽または誇張した経歴を記載してはいけません。',
      '投資申請で事業計画を説明していても、就業許可における職務内容、申請者本人の資格、雇用主側の要件および添付書類の要件を満たしたことにはなりません。',
      '書類が完備した専門職の就業許可申請について、オンライン申請は7営業日、書面申請は12営業日という処理目標',
      '会社設立、銀行手続または居留申請を含む総期間ではありません。',
      '補正に要する時間や他機関での手続も含まれない',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('separates location-law checks, prior inquiry, and bank review', () => {
    const requiredPhrases = [
      '土地使用分区、建物の用途、賃貸人の権限と賃貸借条件、会社・商業登記、業種別許認可',
      '台北市の営業場所事前照会',
      '台湾全域に同じ名称と手続で適用される制度という意味ではありません。',
      '銀行が行う本人確認、口座開設資料の審査および取引目的の確認',
      '行政機関が行う土地使用、建築、会社・商業登記および営業許可の審査は別の手続です。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses safe Japanese links and preserves the identity and both images', () => {
    const internalLinks = Array.from(
      raw.matchAll(/\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[0],
    );

    expect(internalLinks).toEqual([
      '[台湾会社設立の基礎](/ja/columns/taiwan-company-establishment-basics)',
      '[台湾投資・会社設立サービス](/ja/services#investment)',
      '[台湾会社設立の基礎](/ja/columns/taiwan-company-establishment-basics)',
      '[お問い合わせ](/ja/contact)',
    ]);
    expect(internalLinks.every((link) => link.includes('](/ja/'))).toBe(true);
    expect(raw).toContain('曾雋崴');
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

  it('removes every forbidden claim, stale term, unsafe link, and Hangul', () => {
    const forbiddenLiterals = [
      '投資審議委員会',
      '投資審議委員會',
      '投資審査委員会',
      '投審会',
      '海外勢力',
      '投資承認後1年以内',
      '約3か月',
      '約1か月',
      '逃亡',
      '資金洗浄の事例が非常に多い',
      '審査委員を説得',
      '非常に厳格というわけではありません',
      '外国人は店舗を借りにくく',
      '家主は外国人への賃貸を嫌',
      '通常2か月分',
      '必ず実地調査',
      '当日発行',
      '非常に混雑',
      'コメントやご連絡',
      '/ko/',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(raw).not.toContain(forbidden);
    }
    expect(raw).not.toMatch(/口座[^。\n]*(?:必ず|保証)[^。\n]*(?:開設|発行)/);
    expect(raw).not.toMatch(/[\uac00-\ud7af]/);
    expect(parsed.data.title).not.toMatch(/[\uac00-\ud7af]/);
    expect(post?.content).not.toMatch(/[\uac00-\ud7af]/);
  });

  it('contains substantial Japanese content and resolves the alias slug', () => {
    const kana = /[\u3040-\u30ff]/g;

    expect(raw.match(kana)?.length ?? 0).toBeGreaterThan(1_000);
    expect(raw.length).toBeGreaterThan(6_000);
    expect(post?.content.length).toBeGreaterThan(4_500);
    expect(getColumnPost('company-advanced-1', 'ja')?.slug).toBe(
      'taiwan-company-establishment-advanced-1',
    );
  });
});
