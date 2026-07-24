import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/017-taiwan-logistics-business-setup.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('taiwan-logistics-business-setup', 'ja');

function extractBodySections(content: string) {
  return Array.from(
    content.matchAll(/^## \d+\. (.+)\n\n([^\n]+)$/gm),
    (match) => ({
      heading: match[1],
      a: match[2],
    }),
  );
}

const faq = [
  {
    q: '台湾で物流関連事業を行うと、必ず「汽車貨運業」の許可が必要ですか？',
    a: '必ずしもそうではありません。「物流」は広い実務用語であり、会社名や登記上の営業項目だけで許可の要否は決まりません。自社が報酬を得て貨物自動車で他人の貨物を運送する場合は「汽車貨運業」に該当し得ますが、倉庫、梱包、システム運営、荷主としての発送、運送取次等は、契約関係、運送責任、報酬の内容および車両運行の実態に基づく個別判断が必要です。',
  },
  {
    q: '一般の汽車貨運業を新設するための資本額・車両要件と手続は何ですか？',
    a: '一般の汽車貨運業は、最低資本金2,500万新台湾ドルと新車の貨物自動車20両以上が原則です。ただし、引越運送に限定する事業は1,000万新台湾ドル・8両以上、金門・馬祖地区の事業は1,000万新台湾ドル・5両以上とされ、後者には営業地域の制限があります。個人経営の小型貨物運送には、本人所有の小型貨物自動車1両、車齢2年以内、小型車の職業運転免許、所轄区域内の戸籍等を要する別の狭い例外があります。外国投資、交通部の承認、籌設、会社・商業登記、車両・施設の準備、営業免許、公会加入等を分けて確認してください。',
  },
  {
    q: '許可を持つ会社を買収すれば、汽車貨運業の免許も自動的に取得できますか？',
    a: '株式取得では免許を取得・移転するのではなく、許可主体である対象会社が免許を保持したまま存続します。事業・資産の譲受では、対象会社の免許が譲受人へ当然に移転することはありません。営業免許の有効性と業種範囲、車両・営業用ナンバープレート、駐車施設、公会加入、違反・未納、保険、担保、契約上の変更条項等を確認し、外国投資承認と必要な公路主管機関の承認・変更手続を行ってください。',
  },
  {
    q: '許可を持つ台湾業者に実運送を委託すれば、自社には許可も就業許可も不要ですか？',
    a: '一律には判断できません。委託元が荷主・取次人なのか、自ら運送契約上の運送人として報酬を受けるのかで評価が変わります。相手方の営業免許と営業用車両を確認し、免許の名義貸しや無許可運送にならないよう、契約上の役割と実際の運用を一致させてください。また、株主・投資家であることだけで台湾での就労権が生じるわけではなく、実際に就労・経営管理を行う外国人は、業務開始前に就業許可の要否と在留資格を別途確認する必要があります。',
  },
];

const bodySections = [
  {
    heading: '物流事業と「汽車貨運業」の範囲',
    a: faq[0].a,
  },
  {
    heading: '汽車貨運業を新設する場合',
    a: faq[1].a,
  },
  {
    heading: '既存事業者を買収する場合',
    a: faq[2].a,
  },
  {
    heading: '輸配送を委託する場合と外国人の就労',
    a: faq[3].a,
  },
];

describe('Japanese investment column 017 — logistics and motor freight', () => {
  it('publishes the contracted frontmatter and exactly four exact FAQs', () => {
    expect(parsed.data.title).toBe(
      '台湾の物流事業と「汽車貨運業」許可：新設・買収・委託',
    );
    expect(parsed.data.url).toBe(
      'https://www.wei-wei-lawyer.com/post/taiwan-logistics-business-setup',
    );
    expect(parsed.data.lastmod).toBe('2026-07-24');
    expect(parsed.data.date_display).toBe('2025年9月13日');
    expect(parsed.data.read_time).toBe('約8分');
    expect(parsed.data.categories).toEqual(['台湾会社設立']);
    expect(parsed.data.featured_image).toBe(
      '../images/017-taiwan-logistics-business-setup/featured-01.jpg',
    );
    expect(parsed.data.faq).toHaveLength(4);
    expect(parsed.data.faq).toEqual(faq);

    expect(post?.slug).toBe('taiwan-logistics-business-setup');
    expect(post?.title).toBe(parsed.data.title);
    expect(post?.date).toBe('2026-07-24');
    expect(post?.dateDisplay).toBe('2025年9月13日');
    expect(post?.readTime).toBe('約8分');
    expect(post?.categoryLabel).toBe('台湾会社設立');
    expect(post?.faq).toEqual(faq);
  });

  it('keeps the four ordered body questions and immediate answers aligned with the FAQs', () => {
    expect(extractBodySections(raw)).toEqual(bodySections);
    expect(extractBodySections(post?.content ?? '')).toEqual(bodySections);
  });

  it('distinguishes broad logistics services from regulated carriage', () => {
    const requiredPhrases = [
      '倉庫保管、梱包、物流システム、運送取次、自社商品の発送',
      '報酬を得て他人の貨物を自動車で運送する事業',
      '契約、報酬、運送責任、車両運行',
      '誰が荷主との運送契約を締結し、誰が運賃または物流報酬を受けるか',
      '誰が車両、営業用ナンバープレート、運転者、配車および運行を管理するか',
      '交通部です。',
      '交通部公路局とその所管機関の最新案内',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('states all corporate thresholds, alternatives, and the exact plate restriction', () => {
    const requiredPhrases = [
      '最低資本金2,500万新台湾ドルと新車20両以上',
      '最低資本金1,000万新台湾ドルと新車8両以上',
      '最低資本金1,000万新台湾ドルと新車5両以上',
      '許可された地域に応じた営業範囲の制限',
      '所轄区域内に戸籍を有し、小型車の職業運転免許を持ち',
      '本人が所有する車齢2年以内の小型貨物自動車1両',
      '一般の外国法人が汽車貨運業へ参入するときの通常経路ではありません。',
      '新設事業者に交付された営業用ナンバープレート（車両牌照）は、交付日から1年間、返納による抹消（繳銷）または車両登録上の名義変更・譲渡（過戶轉讓）を行うことができません。',
      'この規制は、営業用ナンバープレートの返納による抹消と、車両登録上の名義変更・譲渡を対象とするものです。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('states Article 35, current agency, qualified investment routes, and the ordered setup flow', () => {
    const requiredPhrases = [
      '公路法第35条',
      '中央公路主管機関である交通部の承認を先に得なければなりません。',
      '経済部投資審議司',
      '外国投資がすべて同一の窓口・手順になるわけではありません。',
      '上場・店頭有価証券への投資',
      '外国会社の支店',
      '科学園区・産業園区等の所管機関',
      '中国大陸からの投資',
    ];
    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }

    const setupSection = parsed.content.slice(
      parsed.content.indexOf('### 新設手続の順序'),
      parsed.content.indexOf('## 3.'),
    );
    const sequence = [
      '事業範囲を確定',
      '外国投資承認',
      '設立準備許可（籌設許可）を申請',
      '会社・商業登記',
      '営業免許を申請',
    ];
    const positions = sequence.map((step) => setupSection.indexOf(step));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('covers facilities, representative documents, and qualified timing', () => {
    const requiredPhrases = [
      '所有権または使用権を示す資料',
      '自社専用の駐車場を賃借しなければならないと一律に説明することはできません。',
      '会社定款、株主名簿、駐車施設の承認資料',
      '整備契約、車両購入証明と車両一覧',
      '現行チェックリスト',
      '原則として6か月以内',
      '追加で最長6か月',
      '原則として1か月以内に営業を開始し、公会加入証明を届け出ます。',
      '全工程の完了時期は保証できません。',
      '汽車貨運業の新設全体に要する期間を意味しません。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('distinguishes share acquisition, asset transfer, diligence, and Article 23 changes', () => {
    const requiredPhrases = [
      '送金額は株式の買収代金',
      '経済部の事前承認',
      '送金後の投資額の審定',
      '事業または資産を他の法人が譲り受けても、売主の営業免許が譲受人へ当然に承継されるわけではありません。',
      '汽車運輸業管理規則第23条',
      '事業の譲渡、組織、名称、住所、責任者、資本・資産および駐車施設等の変更',
      '営業免許の有効性、許可された業種・地域・条件',
      '行政処分、税金・料金・罰鍰その他の未納',
      '保険、担保権、リースおよび融資',
      '重要契約と支配権変更条項',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('qualifies outsourcing risks and separates investment, work, and residence', () => {
    const requiredPhrases = [
      '荷主または物流サービス会社が、許可を持つ台湾の汽車貨運業者へ実運送を委託',
      '委託元が単なる荷主または取次人なのか、自ら運送契約上の運送人となって運賃を受けるのか',
      '営業免許の名義貸しや、無許可事業者による実運送を認めてはいけません。',
      '許可事業者への依存、サービス水準、貨物の滅失・毀損・遅延、保険、個人情報・物流データ、再委託、補償',
      '契約終了時のデータ・貨物・顧客対応の引継ぎ',
      '投資家になっても、それだけで台湾における就労権または在留資格を取得するわけではありません。',
      '業務開始前に実際の職務に対応する就業許可の要否',
      '行政上の罰鍰や出国措置が適用される可能性',
      '原則3年の入国禁止期間',
      '同作業規定に定める免除または期間短縮の条件',
      '単に第三者から通報があったという事実だけで機械的に結論が決まるものではなく',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses every official source and only the three safe Japanese internal links', () => {
    const officialSources = [
      'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040001',
      'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040004',
      'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040003',
      'https://www.thb.gov.tw/cp.aspx?n=392',
      'https://www.thb.gov.tw/cp.aspx?n=507',
      'https://cyi2.thb.gov.tw/cp.aspx?n=1962',
      'https://www.thb.gov.tw/cl.aspx?n=259',
      'https://www.thb.gov.tw/cp.aspx?n=356',
      'https://www.mvdis.gov.tw/webMvdisLaw/Download.aspx?ID=22746&type=Law',
      'https://law.moea.gov.tw/LawContent.aspx?id=FL011158&media=print',
      'https://mnscdn.moea.gov.tw/Mns/dir/content/Content.aspx?menu_id=42885',
      'https://www.moea.gov.tw/Mns/dir/investment/wHandDirApply_File.ashx?file_id=49',
      'https://laws.mol.gov.tw/FLAW/FLAWDOC01.aspx?flno=43&id=FL015128',
      'https://laws.mol.gov.tw/flaw/FLAWDOC01.aspx?flno=68&id=FL015128',
      'https://www.immigration.gov.tw/5475/5478/141478/141482/148796/cp',
    ];
    for (const source of officialSources) {
      expect(raw).toContain(source);
    }

    const internalLinks = Array.from(
      raw.matchAll(/\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[0],
    );
    expect(internalLinks).toEqual([
      '[台湾投資・会社設立サービス](/ja/services#investment)',
      '[曾雋崴弁護士のプロフィール](/ja/lawyers/wei-tseng)',
      '[お問い合わせ](/ja/contact)',
    ]);
  });

  it('preserves identity, both image paths, substantial copy, and both slugs', () => {
    expect(raw).toContain('曾雋崴（Wei Tseng）');
    expect(raw).not.toContain('曾俊瑋');
    for (const imagePath of [
      '../images/017-taiwan-logistics-business-setup/featured-01.jpg',
      '../images/017-taiwan-logistics-business-setup/img-01.jpg',
    ]) {
      expect(raw).toContain(imagePath);
    }
    expect(post?.featuredImage).toBe(
      '/images/blog/017-taiwan-logistics-business-setup/featured-01.jpg',
    );

    const kana = /[\u3040-\u30ff]/g;
    expect(raw.match(kana)?.length ?? 0).toBeGreaterThan(1_200);
    expect(raw.length).toBeGreaterThan(7_500);
    expect(post?.content.length).toBeGreaterThan(5_500);
    expect(getColumnPost('logistics-business', 'ja')?.slug).toBe(
      'taiwan-logistics-business-setup',
    );
  });

  it('removes every forbidden claim, unsafe link, wrong identity, and Hangul', () => {
    const forbiddenLiterals = [
      '物流会社を設立するには、「自動車貨物運送業」',
      'すべての外国人投資',
      '投資審議委員会',
      '20台を購入し、1年間保有',
      '1年間保有しなければならず',
      'ライセンス取得の悩みがありません',
      '取消しまたは移転',
      '資本金を送金する',
      '取得するのが安全',
      '通報された場合、3年間',
      '投資が最も少なくリスクが最も小さい',
      '物量委託',
      'クーパンの物量',
      '完璧な契約',
      '会社の体質',
      '市場を飲み込む',
      '/ko/',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(raw).not.toContain(forbidden);
    }
    expect(raw).not.toMatch(/1年間.*処分できません/);
    expect(raw).not.toMatch(/[\uac00-\ud7af]/);
    expect(parsed.data.title).not.toMatch(/[\uac00-\ud7af]/);
    expect(post?.content).not.toMatch(/[\uac00-\ud7af]/);
  });
});
