import { describe, expect, it } from 'vitest';

import { siteContent } from '@/data/site-content';
import { getColumnPost } from '@/lib/columns';

const japaneseServices = siteContent.ja.services;

const expectedRelatedSlugs = [
  [
    'taiwan-company-establishment-basics',
    'taiwan-company-subsidiary-vs-branch',
    'taiwan-company-establishment-advanced-1',
    'taiwan-company-establishment-advanced-2',
    'taiwan-company-setup-pitch-location',
    'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
    'taiwan-logistics-business-setup',
    'withdraw-capital-taiwan-company',
  ],
  [
    'taiwan-gym-injury-lawsuit',
    'taiwan-traffic-accident-procedure',
    'taiwan-overtaking-accident-liability',
  ],
  [
    'taiwan-divorce-lawsuit-qna',
    'taiwan-inheritance-custody-analysis',
  ],
  [
    'taiwan-labor-severance-law',
    'taiwan-voluntary-resignation-severance',
    'taiwan-mandatory-employment-period',
  ],
  [],
  [],
];

describe('Japanese services-list copy', () => {
  it('preserves the six-item structure, routes, detail counts, and related slugs', () => {
    expect(japaneseServices.items.map((item) => item.title)).toEqual([
      '投資・会社設立',
      '民事訴訟・損害賠償',
      '家事事件',
      '労働・雇用',
      '刑事事件',
      '知財・金融紛争',
    ]);
    expect(japaneseServices.items.map((item) => item.href)).toEqual([
      '/ja/services#investment',
      '/ja/services#civil',
      '/ja/services#family',
      '/ja/services#labor',
      '/ja/services#criminal',
      '/ja/services#ip',
    ]);
    expect(japaneseServices.items.map((item) => item.details?.length)).toEqual([
      6, 5, 5, 4, 4, 4,
    ]);

    const japaneseRelatedSlugs = japaneseServices.items.map((item) =>
      (item.relatedColumns ?? []).map((column) => column.slug),
    );
    const koreanRelatedSlugs = siteContent.ko.services.items.map((item) =>
      (item.relatedColumns ?? []).map((column) => column.slug),
    );

    expect(japaneseRelatedSlugs).toEqual(expectedRelatedSlugs);
    expect(japaneseRelatedSlugs).toEqual(koreanRelatedSlugs);
    expect(japaneseRelatedSlugs.flat()).toHaveLength(16);
  });

  it('uses the approved complete Japanese legal copy', () => {
    expect(japaneseServices.description).toBe(
      '台湾における投資、訴訟、法務顧問業務を総合的に支援します。',
    );
    expect(japaneseServices.items.map((item) => item.description)).toEqual([
      '韓国企業の台湾進出に際し、台湾子会社・台湾支店・代表者事務所等の組織形態の選定から、必要に応じた経済部投資審議司への投資申請、投資資金の送金・投資額審定、銀行口座の開設、営業場所の適法性確認まで一貫して支援します。化粧品の製品登録・PIF作成保存、自動車貨物運送業等の業種別許認可、解散・清算等による残余財産・投資資金回収の法的手続についてもご案内します。',
      '契約紛争、損害賠償、消費者被害など、民事事件全般に対応します。韓国人留学生のジム負傷事件では、一審で157万新台湾ドルの損害賠償を認める判決を得た実績があり、外国人依頼者による台湾での訴訟手続を日本語で一貫して支援します。',
      '離婚、財産分与、親権、相続などの家事事件に対応します。台湾を含む国際結婚に伴う協議離婚・調停離婚・裁判離婚の手続、外国人配偶者に関する戸政手続、法定相続順位および残余財産差額分配請求について、戦略的に支援します。',
      '台湾法上の解雇、退職金（資遣費）、労働契約をめぐる紛争に対応します。退職金（資遣費）の算定（新制では勤続1年につき平均賃金0.5か月分、上限6か月分）、雇用主の違法行為等を理由に労働者側から契約を終了した場合の請求可否、最低勤務期間条項の有効性について、実務に即して助言します。',
      '台湾の刑事手続における捜査対応、被疑者・被告人の弁護、被害者代理、弁護人接見に対応します。資本金の不正な払戻しや無許可営業など、法令・規制違反に伴う刑事責任を事前に検討し、防御方針を策定します。',
      '商標・特許・著作権などの知的財産権の保護と、金融・投資関連の紛争に対応します。台湾進出時の先行商標調査、ブランド保護戦略の策定、金融商品・投資契約に関する紛争の事実関係分析および訴訟を支援します。',
    ]);
    expect(japaneseServices.items.map((item) => item.details)).toEqual([
      [
        '台湾子会社（有限公司・股份有限公司）、台湾支店、代表者事務所の比較',
        '経済部投資審議司への投資申請・投資額審定（該当する場合）',
        '投資資金の送金、会社設立準備口座の開設・正式口座への切替え',
        '事業所の土地使用分区・用途適合性の事前確認',
        '化粧品の製品登録・PIF作成保存、自動車貨物運送業等の業種別許認可',
        '解散・清算、減資等による残余財産・投資資金回収の法的手続',
      ],
      [
        '人身損害・物的損害の賠償請求',
        '契約違反・商事紛争の代理',
        '消費者被害の救済および事業者を相手方とする訴訟',
        '交通事故の過失割合分析および損害賠償請求',
        '外国人依頼者向けの日本語による訴訟対応支援',
      ],
      [
        '協議離婚：2名以上の証人の署名と戸政事務所での離婚登記',
        '離婚調停・裁判手続きの代理',
        '親権（監護権）の指定および面会交流',
        '台湾相続法上の配偶者・子の法定相続分の算定',
        '残余財産差額分配請求',
      ],
      [
        '退職金（資遣費）の算定（新制では勤続1年につき平均賃金0.5か月分、上限6か月分）',
        '雇用主の違法行為等を理由に労働者側から契約を終了した場合の退職金（資遣費）請求',
        '最低勤務期間条項の有効性審査',
        '台湾進出企業向けの労働法アドバイス',
      ],
      [
        '捜査段階における弁護人接見・法的助言',
        '被害者代理および告訴・告発手続',
        '法令・規制違反に伴う刑事リスクの事前評価',
        '外国人被疑者・被告人向けの日本語による手続支援',
      ],
      [
        '台湾における先行商標調査・登録申請支援',
        '特許権・著作権侵害紛争への対応',
        '金融商品・投資契約に関する訴訟',
        'ブランド・デザインの保護戦略に関する助言',
      ],
    ]);
  });

  it('contains the critical legal anchors and rejects stale or misleading wording', () => {
    const copy = JSON.stringify(japaneseServices);

    for (const anchor of [
      '経済部投資審議司',
      '土地使用分区',
      '一審',
      '157万新台湾ドル',
      '戸政事務所',
      '残余財産差額分配請求',
      '資遣費',
      '新制',
      '最低勤務期間',
      '被疑者・被告人',
      '先行商標調査',
    ]) {
      expect(copy).toContain(anchor);
    }

    expect(copy).not.toMatch(
      /投資審議委員会|投審会|最低服務期間|多言語訴訟支援|日本語通訳支援/,
    );

    const investmentCopy = JSON.stringify(japaneseServices.items[0]);
    for (const stalePhrase of [
      '子会社・支店・有限会社',
      '化粧品PIFや物流許認可',
      '解散・清算による適法な資本回収',
    ]) {
      expect(investmentCopy).not.toContain(stalePhrase);
    }
  });

  it('resolves every related slug through the Japanese column corpus', () => {
    for (const slug of expectedRelatedSlugs.flat()) {
      expect(getColumnPost(slug, 'ja'), slug).toBeDefined();
    }
  });

  it('uses the exact corrected titles for the audited related articles', () => {
    const titlesBySlug = new Map(
      japaneseServices.items
        .flatMap((item) => item.relatedColumns ?? [])
        .map((column) => [column.slug, column.title]),
    );

    expect(titlesBySlug.get('taiwan-logistics-business-setup')).toBe(
      '台湾で物流業を経営する方法',
    );
    expect(titlesBySlug.get('taiwan-divorce-lawsuit-qna')).toBe(
      '台湾の離婚手続Q&A：調停・訴訟・財産分与・子ども',
    );
    expect(titlesBySlug.get('taiwan-inheritance-custody-analysis')).toBe(
      '台湾の相続と親権：遺された家族のための法律ガイド',
    );
    expect(titlesBySlug.get('taiwan-voluntary-resignation-severance')).toBe(
      '労働者側からの契約終了時に退職金（資遣費）を請求できる例外',
    );
    expect(titlesBySlug.get('taiwan-mandatory-employment-period')).toBe(
      '台湾の最低勤務期間条項：有効性・研修費用・返還義務',
    );
  });

  it('preserves representative Korean, Traditional Chinese, and English copy', () => {
    expect(siteContent.ko.services.description).toBe(
      '대만 내 투자, 소송, 자문 전반을 구조화하여 제공합니다.',
    );
    expect(siteContent['zh-hant'].services.description).toBe(
      '涵蓋在台投資、訴訟與法律顧問全流程。',
    );
    expect(siteContent.en.services.description).toBe(
      'Structured support for investment, litigation, and advisory matters in Taiwan.',
    );
    expect(siteContent.ko.services.items[0]?.description).toContain(
      '한국 기업의 대만 진출',
    );
    expect(siteContent['zh-hant'].services.items[0]?.description).toContain(
      '全程協助韓國企業落地台灣',
    );
    expect(siteContent.en.services.items[0]?.description).toBe(
      'End-to-end support from entity structuring to approvals, banking, permits, and launch.',
    );
  });
});
