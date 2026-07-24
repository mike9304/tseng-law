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
    q: '韓国から台湾会社の準備口座へ資本金を送金するとき、何を確認すべきですか？',
    a: '韓国居住者による台湾法人への出資は、韓国の外国為替制度上、海外直接投資の申告等が必要となる場合があります。資本金を送金する前に、申告先、指定外国為替銀行、申告時期、送金名義、必要書類および送金方法を利用銀行へ確認してください。本人来店、代理申請、オンライン手続の可否をすべての銀行について一律に断定することはできません。',
  },
  {
    q: '台湾で保有する台湾ドルを会社の準備口座へ払い込めますか？',
    a: '承認された投資内容、資金の取得経緯、送金・払込方法および利用銀行の確認が必要です。台湾ドルで保有する資金を用いる場合は、適法な取得と資金の流れを示す資料を求められることがありますが、必要資料は給与、配当、事業所得その他の資金源と個別案件により異なります。国外から送金する場合も、資金源資料が常に不要とは限りません。',
  },
  {
    q: '会社準備口座は、いつ正式な会社口座へ切り替えられますか？',
    a: '会社登記後、銀行が求める登記書類、代表権・本人確認資料その他の必要書類を提出し、銀行の確認を経て切替手続を行います。切替時期、会社責任者（代表者）本人の来店要否、追加資料および資金を利用できる時点は銀行と案件により異なるため、会社設立前に利用銀行へ確認してください。',
  },
  {
    q: '正式口座への切替後、すぐにオンラインバンキングを利用できますか？',
    a: 'オンラインバンキング、モバイルバンキング、送金限度額および認証方法は銀行の商品・審査・設定により異なります。台湾の携帯電話番号や利用実績を一律の要件とせず、申込時期、必要機器、代表者の本人確認、権限設定および利用開始日を選択した銀行に確認してください。',
  },
  {
    q: '台湾会社が韓国人を雇用するとき、どの就業許可要件を確認しますか？',
    a: '韓国人を含む外国人が台湾で就労するには、予定する職務に対応する就業許可の区分と要件を満たす必要があります。台湾の制度上「一般僑外投資事業主管」と呼ばれる管理職区分で申請する場合でも、「最初の1名は無制限」ではありません。対象となる役職・出資関係、外国人本人の資格、雇用主の資本額・売上高等の要件および申請書類を確認し、就労開始前に許可を取得してください。',
  },
];

describe('Japanese investment column 005 — capital, banking, and employment Q&A', () => {
  it('publishes the contracted frontmatter and exactly five exact FAQs', () => {
    expect(parsed.data.title).toBe('台湾会社設立：資本金送金・銀行・外国人雇用の実務Q&A');
    expect(parsed.data.url).toBe(
      'https://www.wei-wei-lawyer.com/post/taiwan-company-establishment-advanced-2',
    );
    expect(parsed.data.lastmod).toBe('2026-07-24');
    expect(parsed.data.date_display).toBe('2025年9月13日');
    expect(parsed.data.read_time).toBe('約6分');
    expect(parsed.data.categories).toEqual(['台湾会社設立']);
    expect(parsed.data.faq).toHaveLength(5);
    expect(parsed.data.faq).toEqual(faq);

    expect(post?.slug).toBe('taiwan-company-establishment-advanced-2');
    expect(post?.title).toBe(parsed.data.title);
    expect(post?.date).toBe('2026-07-24');
    expect(post?.dateDisplay).toBe('2025年9月13日');
    expect(post?.readTime).toBe('約6分');
    expect(post?.categoryLabel).toBe('台湾会社設立');
    expect(post?.faq).toEqual(faq);
  });

  it('keeps the five ordered body questions and first answers aligned with the FAQs', () => {
    expect(extractBodyFaq(raw)).toEqual(faq);
    expect(extractBodyFaq(post?.content ?? '')).toEqual(faq);
  });

  it('qualifies Korean reporting, designated-bank procedure, and available channels', () => {
    const requiredPhrases = [
      '海外直接投資は、資金移動を伴う資本取引です。',
      '原則として送金前に、適用される申告、確認その他の手続を終える必要があります。',
      '海外直接投資取引は、指定外国為替銀行を通じて行います。',
      '申告を受理する機関と必要書類は、取引の内容と韓国の現行制度により異なります。',
      '委任状を備えた代理人による申請が認められる場合',
      '申告と送金の順序を事前に確認',
      '是正、行政上その他の措置の対象となる可能性',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('states the qualified Taiwan investment and bank-account sequence', () => {
    const requiredPhrases = [
      '承認された投資額、出資方法、投資家・送金者および最新の投資手続案内と整合',
      '給与、配当、事業所得では、資金の取得経緯と適法性を示す資料が異なり得ます。',
      '国外からの送金であっても、資金源資料が不要とは限りません。',
      '投資資金の受領・報告',
      '投資総額の確認（審定）',
      '会社登記の完了は、登記済み会社の書類を銀行へ提示する前提',
      '口座名義、代表権・利用権限、追加審査および資金利用の開始時期',
      'オンラインバンキングとモバイルバンキング',
      '認証機器・電話番号、送金限度額、法人利用者の役割・権限',
      '利用開始の時期は、銀行と商品により異なります。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }

    const sequence = ['投資資金の受領・報告', '投資総額の確認（審定）'];
    const positions = sequence.map((step) => raw.indexOf(step));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('locks the WDA manager category, limited first-hire relaxation, and thresholds', () => {
    const requiredPhrases = [
      '外国籍であることだけを理由に、無制限の雇用枠が生じるわけではありません。',
      '台湾の制度上「一般僑外投資事業主管」と呼ばれる管理職区分',
      'この管理職区分で対象になり得るのは、台湾法上の「経理人」に当たる会社または支店の経営管理者などです。',
      '華僑または外国人投資家が合計で株式総数または資本総額の3分の1を超えて保有する会社の経営管理者',
      '外国会社の支店の経営管理者',
      '代表者事務所の代表者',
      '主管機関が認めるその他の区分',
      '最初の外国人1名について緩和されるのは、専門性・技術性業務に関する学歴・職歴および平均給与の基準です。',
      '役職・出資関係、雇用主の資格、申請および就業許可は必要',
      '2人目以降',
      '専門性・技術性業務の学歴・職歴および平均給与の基準',
      '設立から1年未満',
      '払込済資本金または台湾における運転資金が50万新台湾ドル以上',
      '売上高が300万新台湾ドル以上',
      '輸出入実績が50万米ドル以上',
      '代理手数料が20万米ドル以上',
      '設立から1年以上',
      '直近1年または直近3年間の平均',
      '代表者事務所と特別認定案件には別の基準',
      '実際の職務に該当する就業許可区分',
      '就労を開始する前に許可',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expect(raw).not.toContain('投資者');
    expect(raw).not.toContain('一般僑外投資事業の主管');
    expect(raw).not.toContain('経営責任者');
  });

  it('scopes the established-at-least-one-year thresholds to the correct paragraph', () => {
    const establishedAtLeastOneYearParagraph =
      raw.match(/^設立から1年以上の会社では、[^\n]+$/m)?.[0] ?? '';

    expect(establishedAtLeastOneYearParagraph).toContain(
      '直近1年または直近3年間の平均',
    );
    expect(establishedAtLeastOneYearParagraph).toContain(
      '売上高が300万新台湾ドル以上',
    );
    expect(establishedAtLeastOneYearParagraph).toContain(
      '輸出入実績が50万米ドル以上',
    );
    expect(establishedAtLeastOneYearParagraph).toContain(
      '代理手数料が20万米ドル以上',
    );
  });

  it('uses the required official sources and only the contracted internal links', () => {
    const officialSources = [
      'https://www.bok.or.kr/eng/main/contents.do?menuNo=400191',
      'https://www.bok.or.kr/eng/main/contents.do?menuNo=400189',
      'https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus01?lang=eng&menuNum=7&search=InvestmentStatus01',
      'https://investtaiwan.nat.gov.tw/faqQContent?lang=eng&search=94',
      'https://investtaiwan.nat.gov.tw/eBook/BravoTaiwan/2024ebook_en/files/basic-html/page55.html',
      'https://ezworktaiwan.wda.gov.tw/cp.aspx?n=A88DC323EF7C85FF',
    ];
    for (const source of officialSources) {
      expect(raw).toContain(source);
    }

    const internalLinks = Array.from(
      raw.matchAll(/\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[0],
    );
    expect(internalLinks).toEqual([
      '[台湾会社設立の基礎](/ja/columns/taiwan-company-establishment-basics)',
      '[台湾会社設立の応用編1](/ja/columns/taiwan-company-establishment-advanced-1)',
      '[台湾投資・会社設立サービス](/ja/services#investment)',
      '[台湾会社設立の応用編1](/ja/columns/taiwan-company-establishment-advanced-1)',
      '[お問い合わせ](/ja/contact)',
    ]);
  });

  it('preserves the identity and both images and contains substantial Japanese copy', () => {
    expect(raw).toContain('曾雋崴');
    expect(raw).not.toContain('曾俊瑋');
    for (const imagePath of [
      '../images/005-taiwan-company-establishment-advanced-2/featured-01.jpg',
      '../images/005-taiwan-company-establishment-advanced-2/img-01.jpg',
    ]) {
      expect(raw).toContain(imagePath);
    }
    expect(post?.featuredImage).toBe(
      '/images/blog/005-taiwan-company-establishment-advanced-2/featured-01.jpg',
    );

    const kana = /[\u3040-\u30ff]/g;
    expect(raw.match(kana)?.length ?? 0).toBeGreaterThan(1_000);
    expect(raw.length).toBeGreaterThan(6_500);
    expect(post?.content.length).toBeGreaterThan(5_000);
  });

  it('removes universal bank claims, unrestricted-employment claims, Korean links, and Hangul', () => {
    const forbiddenLiterals = [
      '本人が直接韓国の銀行に出向き',
      '代理送金はできません',
      '台湾法人の資本金送金時に申告を受け付ける必要',
      '韓国の銀行口座から送金する場合は、資金の出所に関する書類を添付する必要はありません',
      '少なくとも携帯電話番号が必要',
      '6か月以上',
      '最初の1名の従業員には制限なし',
      '/ko/',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(raw).not.toContain(forbidden);
    }
    expect(raw).not.toMatch(/インターネットバンキング[^。\n]*できません/);
    expect(raw).not.toMatch(
      /台湾で保有する台湾ドルを会社の準備口座へ払い込めますか？\n\n可能です/,
    );
    expect(raw).not.toMatch(
      /正式[^。\n]*(?:直ちに|すぐに)[^。\n]*(?:切り替えられます|利用できます)。/,
    );
    expect(raw).not.toMatch(/携帯電話番号[^。\n]*(?:必須|必要です)/);
    expect(raw).not.toMatch(/[\uac00-\ud7af]/);
    expect(parsed.data.title).not.toMatch(/[\uac00-\ud7af]/);
    expect(post?.content).not.toMatch(/[\uac00-\ud7af]/);
  });

  it('resolves both the canonical and alias slugs in Japanese', () => {
    expect(post?.slug).toBe('taiwan-company-establishment-advanced-2');
    expect(getColumnPost('company-advanced-2', 'ja')?.slug).toBe(
      'taiwan-company-establishment-advanced-2',
    );
  });
});
