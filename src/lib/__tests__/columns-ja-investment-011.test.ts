import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost(
  'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
  'ja',
);

function extractBodyContracts(content: string) {
  return Array.from(
    content.matchAll(/^## \d+\. (.+)\n\n([^\n]+)$/gm),
    (match) => ({
      heading: match[1],
      answer: match[2],
    }),
  );
}

const faq = [
  {
    q: '台湾で化粧品を販売するには、自社の台湾法人または支店が必須ですか？',
    a: '必須とは限りません。台湾の輸入業者（販売代理店を兼ねる場合を含みます）に輸入・販売を委ねる方法もあります。自社で台湾事業を運営する場合は、台湾子会社と外国会社の支店で設立・登記、責任、税務等の仕組みが異なり、外国投資の許可や会社・支店の登記に要する期間も案件と補正の有無により変わります。事業モデルと化粧品製造・輸入業者としての責任主体を先に決めてください。',
  },
  {
    q: 'PIFとは何ですか。TFDAへの製品登録と同じ手続ですか？',
    a: '同じではありません。製品登録はTFDAの化粧品製品登録プラットフォームで行う別の手続です。PIFは品質、安全性、組成、機能、製造方法、試験結果、安全性評価等の資料をまとめ、化粧品製造・輸入業者が作成・更新・保存するファイルであり、PIF自体はTFDAへの事前提出を要する制度ではありません。2026年7月1日から原則として全化粧品がPIF制度の対象となり、工場登記を免除される製造場所で製造する固形手作り石けんには例外があります。',
  },
  {
    q: '化粧品広告では、どのような表示に注意が必要ですか？',
    a: '広告は文言だけでなく、名称、文字、画像、記号、音声その他の全体的な表現から判断されます。虚偽・誇大表示や医療的効能の標榜は禁止され、例えばニキビの治療、抗炎症、殺菌等の医療的な訴求には特に注意が必要です。違反時の過料は、虚偽・誇大広告が4万～20万新台湾ドル、医療的効能の標榜が60万～500万新台湾ドルです。インフルエンサー等の投稿も、実質が広告であれば同じ基準を前提に確認してください。',
  },
];

const bodyContracts = [
  {
    heading: '台湾での進出形態と輸入者の選択',
    answer: faq[0].a,
  },
  {
    heading: '製品登録とPIFは別の制度',
    answer: faq[1].a,
  },
  {
    heading: '表示・宣伝・広告の規制',
    answer: faq[2].a,
  },
];

describe('Japanese investment column 011 — cosmetics registration, PIF, and advertising', () => {
  it('publishes the contracted frontmatter and exactly three exact FAQs', () => {
    expect(parsed.data.title).toBe(
      '台湾化粧品市場への進出：会社・支店の選択から製品登録、PIF作成・保存、広告規制まで',
    );
    expect(parsed.data.url).toBe(
      'https://www.wei-wei-lawyer.com/post/taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
    );
    expect(parsed.data.lastmod).toBe('2026-07-24');
    expect(parsed.data.date_display).toBe('2026年2月4日');
    expect(parsed.data.read_time).toBe('約6分');
    expect(parsed.data.categories).toEqual(['台湾会社設立']);
    expect(parsed.data.featured_image).toBe(
      '../images/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide/featured-01.jpg',
    );
    expect(parsed.data.faq).toHaveLength(3);
    expect(parsed.data.faq).toEqual(faq);

    expect(post?.slug).toBe(
      'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
    );
    expect(post?.title).toBe(parsed.data.title);
    expect(post?.date).toBe('2026-07-24');
    expect(post?.dateDisplay).toBe('2026年2月4日');
    expect(post?.readTime).toBe('約6分');
    expect(post?.categoryLabel).toBe('台湾会社設立');
    expect(post?.faq).toEqual(faq);
  });

  it('keeps the three ordered body headings and immediate answers aligned with the FAQs', () => {
    expect(extractBodyContracts(raw)).toEqual(bodyContracts);
    expect(extractBodyContracts(post?.content ?? '')).toEqual(bodyContracts);
  });

  it('separates importer choice, subsidiary, branch, and the current investment agency', () => {
    const requiredPhrases = [
      '台湾の輸入業者または販売代理店が輸入・販売を担う形であれば、外国ブランドが自社の台湾子会社または支店を設けない構成も考えられます。',
      '台湾子会社と外国会社の支店は同じ制度ではありません。',
      '経済部投資審議司',
      '一律の日数を前提とせず',
      '化粧品製造・輸入業者',
      '法令上の担当と契約上の担当',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('keeps product registration distinct from PIF and states its timing and validity', () => {
    const requiredPhrases = [
      '製品登録はTFDAの化粧品製品登録プラットフォームで行う別の手続です。',
      '供給、販売、贈与、公開陳列または消費者への試用提供前',
      '登録の有効期間は3年です。',
      '有効期間満了前3か月以内に延長を申請',
      '登録完了という事実だけで、PIFに必要な裏付け資料が揃っていることや、表示・広告が適法であることまで確認されたわけではありません。',
      'PIF自体はTFDAへの事前提出を要する制度ではありません。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('states the PIF contents, full phase-in, limited soap exception, and retained responsibility', () => {
    const requiredPhrases = [
      '品質、安全性、組成、標榜する機能、製造方法、試験結果および安全性評価',
      '必要情報を16の区分に分けています。',
      '2026年7月1日から残る化粧品も対象に含まれ、原則としてすべての化粧品に適用',
      '工場登記を免除される製造場所で製造される固形手作り石けん',
      '「手作り」または「石けん」という名称だけで一律に例外となるわけではなく',
      '必要な資格・能力を備えた第三者の支援',
      '外部委託によって化粧品製造・輸入業者の法的責任がなくなるわけではありません。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('locks the five-year retention start, address, and qualified retrieval methods', () => {
    const requiredPhrases = [
      '市場に最後に供給した日の翌日から最低5年間',
      '「化粧品製品情報ファイル管理弁法」第7条',
      '化粧品製造・輸入業者の表示住所',
      '原製造業者が保有する原本を利用する場合や、安全な電子保存またはクラウド保存を利用する場合',
      '完全な資料を管理し、主管機関の求めに応じて速やかに検索・提示できる状態',
      'アクセス権限、バックアップ、版管理',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('qualifies inspections and distinguishes false information, correction, and recall', () => {
    const requiredPhrases = [
      '原則として検査日の7日前までに通知',
      '法定の例外に該当する場合は、その事前通知を経ずに検査',
      '製品登録で虚偽の情報を申告した場合や、PIFに虚偽の情報を記載した場合',
      '1万～100万新台湾ドルの過料',
      '主管機関が期限を定めて是正を命じ、その期限内に是正しないときに過料',
      '回収や廃棄は、すべての資料不備について当然に生じるものではありません。',
      '製品の安全性、違反の内容、是正状況その他の法定要件',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('states the overall-advertising test, medical examples, exact fines, and influencer qualification', () => {
    const requiredPhrases = [
      '商品名称、文章、画像、記号、音声、前後関係、消費者が受ける全体的な印象',
      'ニキビの治療、抗炎症効果または殺菌作用',
      '虚偽・誇大広告に対する行政上の過料は4万～20万新台湾ドル',
      '医療的効能の標榜に対する過料は60万～500万新台湾ドル',
      '実質的に広告と判断される場合があります。',
      'すべての個人的な投稿が自動的にブランドの広告となるわけではありません。',
      '発信者との関係、投稿内容およびブランド側の関与',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses every official source and only the contracted Japanese internal links', () => {
    const officialSources = [
      'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030013',
      'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030097',
      'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030098',
      'https://www.fda.gov.tw/tc/newsContent.aspx?cid=3&id=30612',
      'https://www.fda.gov.tw/tc/newsContent.aspx?cid=3&id=30614',
      'https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f639179794512621908&iid=13384',
      'https://www.fda.gov.tw/TC/siteContent.aspx?sid=3435',
      'https://www.fda.gov.tw/TC/site.aspx?sid=12523',
      'https://law.moj.gov.tw/LawClass/LawAll.aspx?PCODE=L0030099',
      'https://law.moj.gov.tw/LawClass/LawGetFile.ashx?FileId=0000249593&lan=C',
      'https://www.mohw.gov.tw/cp-4256-48110-1.html',
      'https://investtaiwan.nat.gov.tw/showPage?lang=jpn&search=InvestmentStatus01',
      'https://mnscdn.moea.gov.tw/Mns/dir/content/Content.aspx?menu_id=42879',
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
      '[台湾投資・会社設立サービス](/ja/services#investment)',
      '[曾雋崴弁護士の紹介](/ja/lawyers/wei-tseng)',
    ]);
  });

  it('preserves both images, the correct identity, and substantial Japanese copy', () => {
    for (const imagePath of [
      '../images/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide/featured-01.jpg',
      '../images/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide/img-01.jpg',
    ]) {
      expect(raw).toContain(imagePath);
    }
    expect(post?.featuredImage).toBe(
      '/images/blog/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide/featured-01.jpg',
    );
    expect(raw).toContain('曾雋崴');
    expect(raw).not.toContain('曾俊瑋');

    const kana = /[\u3040-\u30ff]/g;
    expect(raw.match(kana)?.length ?? 0).toBeGreaterThan(1_200);
    expect(raw.length).toBeGreaterThan(6_500);
    expect(post?.content.length).toBeGreaterThan(5_500);
  });

  it('removes stale actors, prohibited PIF claims, unsafe links, and Hangul', () => {
    const forbiddenLiterals = [
      'PIF登録',
      'PIFを登録',
      'PIFの登録',
      '市場販売資格を証明',
      '製品登録者',
      '国内責任者',
      '投資審議委員会',
      '約3か月',
      '罰金',
      '/ko/',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(raw).not.toContain(forbidden);
    }
    expect(raw).not.toMatch(/PIF[^。\n]*(?:アップロード|承認|認証)/);
    expect(raw).not.toMatch(
      /(?:手作り石けん|手作り石鹸)[^。\n]*(?:すべて|一律)[^。\n]*(?:対象外|例外)/,
    );
    expect(raw).not.toMatch(
      /(?:インフルエンサー|個人)[^。\n]*(?:すべて|必ず|自動的)[^。\n]*広告(?:です|となります)/,
    );
    expect(raw).not.toMatch(
      /PIF[^。\n]*(?:不備|欠落)[^。\n]*(?:すべて|必ず|自動的)[^。\n]*(?:回収|廃棄)/,
    );
    expect(raw).not.toMatch(/[\uac00-\ud7af]/);
    expect(parsed.data.title).not.toMatch(/[\uac00-\ud7af]/);
    expect(post?.content).not.toMatch(/[\uac00-\ud7af]/);
  });

  it('resolves canonical and alias slugs in Japanese', () => {
    expect(post?.slug).toBe(
      'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
    );
    expect(getColumnPost('cosmetics-market-entry', 'ja')?.slug).toBe(
      'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
    );
  });
});
