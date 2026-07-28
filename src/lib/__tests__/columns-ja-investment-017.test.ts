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
    q: '台湾で物流関連事業を行う場合、必ず汽車貨運業の許可を受けなければなりませんか？',
    a: '必ずしもそうではありません。「物流」は幅広い実務用語であるため、会社名や会社登記上の営業項目だけで許可の要否が決まるわけではありません。会社が対価を受け取り、貨物自動車で他人の貨物を運送する場合は、汽車貨運業に該当する可能性があります。一方、倉庫保管、梱包、システム運営、荷主としての発送、運送取次などについては、契約関係、運送責任、報酬の内容および車両運行の実態に基づき、個別に判断する必要があります。',
  },
  {
    q: '一般の汽車貨運業を新設する場合、資本金・車両の要件と手続はどのようになっていますか？',
    a: '一般の汽車貨運業は、最低資本金2,500万新台湾ドルと新車の貨物自動車20両以上が原則です。ただし、引越運送のみを専門とする事業は1,000万新台湾ドルと8両以上、金門・連江（馬祖）地区で営む事業は1,000万新台湾ドルと5両以上が基準となり、後者には営業地域の制限が伴います。個人が営む小型貨物自動車運送業には、本人所有の小型貨物自動車1両、車齢2年以内、小型車の職業運転免許、所轄区域内の戸籍などを要件とする、別の限定的な例外があります。外国投資、交通部の承認、設立準備許可（籌設許可）、会社・商業登記、車両・施設の準備、営業免許、業種別組合（同業公会）への加入をそれぞれ区別して確認する必要があります。',
  },
  {
    q: '許可を保有する会社を買収すれば、汽車貨運業の営業免許も自動的に取得できますか？',
    a: 'いいえ。株式取得の場合、免許を取得したり譲り受けたりするのではなく、許可の主体である対象会社が同一法人として存続し、引き続き免許を保有します。事業・資産の譲受の場合、対象会社の免許が譲受人に当然に移転することはありません。営業免許の有効性と許可業種の範囲、車両・営業用ナンバープレート、駐車施設、業種別組合への加入、違反・未納、保険、担保、契約上の支配権変更条項などを確認し、外国投資の承認および必要な公路主管機関の承認・変更手続を行う必要があります。',
  },
  {
    q: '許可を保有する台湾事業者に実際の運送を委託すれば、自社には汽車貨運業の許可も就業許可も必要ありませんか？',
    a: '一律に判断することはできません。委託者が荷主または運送取次人なのか、それとも運送契約上の運送人として自ら直接対価を受け取るのかによって、判断は異なります。相手方の営業免許と営業用車両を確認し、免許の名義貸しや無許可運送とならないよう、契約上の役割と実際の運営を一致させる必要があります。また、株主・投資家であるという理由だけで台湾で働く権利が生じるわけではありません。実際に勤務し、または経営管理を行う外国人は、業務を開始する前に、就業許可の要否と在留資格を別途確認する必要があります。',
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
      '対価を受け取り他人の貨物を自動車で運送する事業',
      '契約、報酬、運送責任および車両運行',
      '誰が荷主と運送契約を締結し、誰が運賃または物流サービスの対価を受け取るのか',
      '誰が車両、営業用ナンバープレート、運転者、配車および運行を管理するか',
      '交通部です。',
      '交通部公路局およびその所属機関が担当するため、最新の指針',
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
      '所轄区域内に戸籍を有し、小型車の職業運転免許を保有し',
      '本人所有で車齢2年以内の小型貨物自動車1両',
      '外国法人が汽車貨運業へ参入する際に利用する一般的な経路ではありません。',
      '新設の汽車運輸事業者に交付された営業用車両ナンバープレート（車輛牌照）は、交付日から1年間、返納に伴う抹消（繳銷）または車両登録上の名義移転・譲渡（過戶轉讓）を行うことができません。',
      'この制限は、営業用車両ナンバープレートの返納に伴う抹消と、車両登録上の名義移転・譲渡を対象としています。',
      '廃車、車両の代替をはじめとするその他の取扱いについては、公路主管機関の現行規定に従って別途確認する必要があります。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('states Article 35, current agency, qualified investment routes, and the ordered setup flow', () => {
    const requiredPhrases = [
      '「公路法」第35条',
      '外国人または外国法人が台湾で汽車貨運業に投資し、これを経営する場合',
      '中央主管機関である交通部の承認を先に得なければなりません。',
      '経済部投資審議司',
      'すべての外国投資が同一の窓口と手続に従うわけではありません。',
      '上場・店頭有価証券への投資',
      '外国会社の支店',
      '科学園区・産業園区の所管機関',
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
      '外国投資の承認',
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
      '所有権または使用権を証明する資料',
      '自社専用の駐車場を必ず賃借しなければならないと一律に断定することはできません。',
      '会社定款、株主名簿、駐車施設の承認資料',
      '整備契約、車両購入証明および車両一覧',
      '現行チェックリスト',
      '原則として6か月以内',
      '追加で最長6か月',
      '原則として1か月以内に営業を開始し、該当する業種の同業公会が発行した有効な会員証の写しを添付して、所管の公路主管機関に届け出ます。',
      '全手続の完了時期を保証することはできません。',
      '汽車貨運業の新設全体に要する期間を意味するものではありません。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('distinguishes share acquisition, asset transfer, diligence, and Article 23 changes', () => {
    const requiredPhrases = [
      '株式取得に伴う送金額は、資本金ではなく、株式譲受代金です。',
      '経済部の事前承認',
      '送金後の投資額審定',
      '他の法人が事業または資産を譲り受けても、譲渡人の営業免許が譲受人に当然に承継されるわけではありません。',
      '「汽車運輸業管理規則」第23条',
      '事業譲渡、組織、名称、住所、責任者、資本・資産および駐車施設などの変更',
      '関係書類を整え、所管の公路主管機関の承認を受ける必要があります。',
      '営業免許の有効性、許可された業種・地域・条件',
      '行政処分、税金・手数料・罰鍰などの未納の有無',
      '証拠書類および原資料を所管機関の記録と照合し、実質的に確認する必要があります。',
      '保険、担保権、リースおよび金融',
      '重要契約と支配権変更条項',
      '価格調整、損害賠償、引渡し、運転資金、車両と契約の移転方法',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('qualifies outsourcing risks and separates investment, work, and residence', () => {
    const requiredPhrases = [
      '荷主または物流サービス会社が、許可を保有する台湾の汽車貨運業者に実際の運送を委託',
      '委託者が単なる荷主または運送取次人なのか、それとも自ら運送契約上の運送人となって運賃を受け取るのか',
      '営業免許の名義貸しや、無許可事業者による実際の運送を認めてはなりません。',
      '初期固定投資が少なくなる可能性',
      '許可事業者への依存度、サービス水準、貨物の滅失・毀損・遅延、保険、個人情報・物流データ、再委託、損害賠償',
      '契約終了時におけるデータ・貨物・顧客対応の引継手続',
      '投資家になっても、その事実だけで台湾で働く権利または在留資格を得るわけではありません。',
      '業務を開始する前に、実際の職務に応じた就業許可が必要かどうか',
      '行政上の罰鍰および出国措置が適用される可能性',
      '一般に3年の入国禁止期間',
      '同じ指針に定める免除または期間短縮の要件',
      '単に第三者から通報があったという事実だけで結果が機械的に決まるものではなく',
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
    expect(raw).toContain('曾雋崴弁護士（Wei Tseng）');
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
