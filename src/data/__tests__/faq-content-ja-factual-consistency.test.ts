import { createHash } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { faqContent } from '@/data/faq-content';

const expectedJapaneseFaq = [
  {
    question: '台湾での会社設立はどのような手続きで進みますか？',
    answer:
      '外国投資による台湾子会社では、一般に①会社の中国語名称・営業項目の予備審査、②該当する外国投資許可、③設立準備口座の開設と国外からの資金送金、④資本額の確認・投資額審定、⑤会社設立登記、⑥税籍登記、⑦口座の正式切替えを行います。業種別許認可、投資者の属性、銀行審査などにより順序や追加書類は変わるため、これはすべての案件に共通する固定的な順序ではありません。',
  },
  {
    question: '台湾子会社と台湾支店（分公司）は、どのように選べばよいですか？',
    answer:
      '台湾子会社は台湾法上の独立法人で、株主は原則として出資額を限度に責任を負います。台湾支店（分公司）は外国会社の一部で独立法人格を持たず、支店の債務は外国会社の債務となり、台湾での営業に用いる資金を本店から割り当て、その資金を台湾での営業にのみ使用する必要があります。税務、利益送金、共同出資、資金調達、許認可、撤退方法まで比較して選びます。',
  },
  {
    question: '会社設立後、資本金はどのように回収できますか？',
    answer:
      '払込済みの資本金を株主が自由に引き出すことはできません。会社を存続させる場合は、会社形態に応じた減資、適法な配当、実在する借入金の返済など、それぞれの法的・税務上の要件を確認します。持分譲渡による退出は、会社からの資本金返還とは別です。事業を恒久的に終了する場合は、原則として解散・清算を行い、債務と租税を処理した後の残余財産を株主へ分配し、外国投資・送金・銀行手続を別途確認します。',
  },
  {
    question: '専用オフィスがなくても台湾で会社を設立できますか？',
    answer:
      '会社登記には本店所在地が必要で、賃貸借契約書、所有者の使用同意書など、その住所を使用できることを示す資料が求められます。シェアオフィス等を利用できる場合もありますが、登記住所を借りただけで全ての事業を行えるわけではありません。土地使用分区、建築・消防、賃貸条件および業種別の実際の営業場所要件を事前に確認してください。台北市では対象となる登記について営業場所事前照会も必要です。',
  },
  {
    question: '台湾で従業員との労働契約を終了する場合、退職金（資遣費）は必ず必要ですか？',
    answer:
      '必ずではありません。雇用主が労働基準法第11条、第13条但書または第20条等に基づいて契約を終了する場合や、労働者が同法第14条の法定事由に基づいて契約を終了する場合は、資遣費が必要となります。一方、同法第12条の懲戒解雇では原則として資遣費は不要で、通常の自己都合退職も直ちに資遣費の対象にはなりません。終了理由、予告、支払期限および新旧退職金制度の適用を個別に確認してください。',
  },
  {
    question: '最低勤務期間（台湾法上の「最低服務年限」）の合意は有効ですか？',
    answer:
      '雇用主が専門技術訓練を行って費用を負担した場合、または勤務継続のための合理的な補償を提供した場合に限り、最低勤務期間を定めることができます。さらに、訓練の期間・費用、同種人材の代替可能性、補償の金額・範囲その他の事情から合理的な範囲内でなければならず、要件に反する合意は無効です。労働者の責めに帰すことのできない理由で期間満了前に契約が終了した場合、違約責任や訓練費返還責任は負いません。',
  },
  {
    question: '台湾で交通事故が起きたら、まず何をすべきですか？',
    answer:
      '安全の確保と負傷者の救護を優先し、警察へ通報して、法令に従って車両位置・現場痕跡・写真・映像・相手方情報を保全してください。負傷がある場合は医療機関を受診し、診断書や費用資料も保管します。警察資料は所定の時期に申請して取得し、保険会社への通知、事故鑑定、示談または訴訟は事故状況に応じて検討します。これらは常に一律の順序で進むわけではありません。',
  },
  {
    question: '台湾のジムや施設でけがをした場合、損害賠償を請求できますか？',
    answer:
      '施設が提供するサービスが合理的に期待される安全性を欠き、その欠陥または管理上の過失によって負傷・損害が生じた場合、消費者保護法や民法に基づく賠償請求を検討できます。責任の成否は、安全性の欠如・過失、因果関係、損害の立証などにより決まります。CCTV、現場写真、診断書、領収書、利用規約、当日の連絡記録を早めに保全してください。',
  },
  {
    question: '韓国人が台湾で離婚するには、どのような手続きが必要ですか？',
    answer:
      '台湾法が適用される合意離婚は、書面で行い、2名以上の証人が署名し、戸政機関で離婚登記をする必要があります。裁判による離婚は、原則として裁判前に家事調停を経ます。韓国・台湾間の国際離婚では、台湾で手続できるか、どの法が適用されるか、両地域での届出・承認、財産分与、未成年の子の親権・扶養を個別に確認してください。',
  },
  {
    question: '台湾で未成年の子の親権・監護はどのように決まりますか？',
    answer:
      '台湾の裁判所は子の最善の利益を基準に、子の年齢・健康・意思・人格発達上の必要、父母の職業・健康・経済状況・養育の意思、親子関係、他方の親の関与を妨げる行為の有無など一切の事情を考慮します。経済力だけで決まるものではありません。国際案件では、準拠法、管轄、外国判決の承認・執行なども個別に確認します。',
  },
  {
    question: '台湾で刑事事件に関与した場合、どうすればよいですか？',
    answer:
      '被疑者（台湾法上の「犯罪嫌疑人」）は捜査段階から弁護人を選任できます。警察・検察の取調べ前には、被疑事実と罪名、黙秘できること、弁護人を選任できること、有利な証拠の調査を求められることが告知されます。言語が通じない場合は通訳の対象となります。出国・出海の制限（台湾法上の「限制出境・出海」）や勾留（同「羈押」）は、外国人であるだけで自動的に行われるものではなく、法定要件と個別の処分を要するため、早い段階で事実と証拠を整理してください。',
  },
  {
    question: '相談はどのような方式で行われますか？',
    answer:
      '台北事務所での対面相談またはビデオ通話による相談に対応しており、韓国語・中国語・日本語で相談できます。一般法律相談は事前予約制で、現在の料金案内では1時間単位です。まずお問い合わせページから案件の概要と主な資料を送り、日程、相談方法、担当言語および費用をご確認ください。連絡はKakaoTalk、メールまたは電話から行えます。',
  },
  {
    question: '物流・化粧品などの規制業種でも台湾で会社を設立できますか？',
    answer:
      '会社を設立できるかと、当該事業を開始できるかは別に確認します。「物流」は広い概念で、倉庫・梱包・取次ぎなどと、自ら報酬を受けて貨物自動車で運送する「自動車貨物運送業」（汽車貨運業）では規制が異なります。自動車貨物運送業には、道路運送を所管する機関（公路主管機関）による設立準備許可（籌設許可）・営業免許等が必要です。化粧品は、対象となる製造・輸入業者が供給等の開始前に製品登録を行い、対象製品のPIFを作成・更新して法定の住所に保存します。PIFは当局へ登録・届出するものではありません。',
  },
] as const;

const untouchedLocaleHashes = {
  ko: '2dc44723fac9451b002a0e04564453951cd508581fb375806277ecd6f8016c93',
  'zh-hant': '01fe893af3d34bc3e2edcd1ac94ec903df2c29a715f8e11825dfcba47175dd4f',
  en: '0107771e2445146b36c8cf59bf7e9fe93abac4e909e3ccb24fb014314e010cc5',
} as const;

const forbiddenRegressions = [
  '①投資許可の申請 → ②会社名',
  '支社（分公司）',
  '商業用登記住所',
  '解雇時には資遣費の支払いが原則',
  '自発的な退職であっても',
  '義務在職約定',
  '事故報告書を受け取り',
  '養育権・親権',
  '子の常居所地',
  '外国人の場合、出国禁止',
  'Zoom/Google Meet',
  '物流業は運送業許可',
  'PIF登録',
  'PIF届出',
  'PIF承認',
  'FDA届出',
] as const;

describe('Japanese public FAQ factual consistency', () => {
  it('matches the ordered 13-entry Japanese FAQ contract exactly', () => {
    expect(faqContent.ja).toEqual(expectedJapaneseFaq);
  });

  it('keeps the Korean, Traditional Chinese, and English FAQ data byte-stable', () => {
    for (const [locale, expectedHash] of Object.entries(untouchedLocaleHashes)) {
      const digest = createHash('sha256')
        .update(JSON.stringify(faqContent[locale as keyof typeof untouchedLocaleHashes]))
        .digest('hex');

      expect(digest, `${locale} FAQ content changed`).toBe(expectedHash);
    }
  });

  it('preserves the required legal and regulatory distinctions', () => {
    const answers = faqContent.ja.map(({ answer }) => answer);

    expect(answers[0]).toContain('①会社の中国語名称・営業項目の予備審査');
    expect(answers[0]).toContain('すべての案件に共通する固定的な順序ではありません');
    expect(answers[1]).toContain('独立法人格を持たず');
    expect(answers[1]).toContain('支店の債務は外国会社の債務');
    expect(answers[1]).toContain('その資金を台湾での営業にのみ使用する必要があります');
    expect(answers[2]).toContain('持分譲渡による退出は、会社からの資本金返還とは別');
    expect(answers[2]).toContain('解散・清算');
    expect(answers[3]).toContain('登記住所を借りただけで全ての事業を行えるわけではありません');
    expect(answers[3]).toContain('営業場所事前照会');
    expect(answers[4]).toContain('雇用主が労働基準法第11条');
    expect(answers[4]).toContain('労働者が同法第14条');
    expect(answers[4]).toContain('第12条の懲戒解雇では原則として資遣費は不要');
    expect(answers[4]).toContain('通常の自己都合退職も直ちに資遣費の対象にはなりません');
    expect(answers[5]).toContain('専門技術訓練');
    expect(answers[5]).toContain('合理的な補償');
    expect(answers[5]).toContain('最低勤務期間を定めることができます');
    expect(answers[5]).toContain('要件に反する合意は無効');
    expect(answers[5]).toContain('労働者の責めに帰すことのできない理由');
    expect(answers[6]).toContain('安全の確保と負傷者の救護を優先');
    expect(answers[6]).toContain('所定の時期に申請して取得');
    expect(answers[6]).toContain('常に一律の順序で進むわけではありません');
    expect(answers[7]).toContain('合理的に期待される安全性');
    expect(answers[7]).toContain('因果関係');
    expect(answers[8]).toContain('書面で行い');
    expect(answers[8]).toContain('2名以上の証人が署名');
    expect(answers[8]).toContain('戸政機関で離婚登記');
    expect(answers[9]).toContain('子の最善の利益');
    expect(answers[9]).toContain('経済力だけで決まるものではありません');
    expect(answers[9]).toContain('外国判決の承認・執行');
    expect(answers[10]).toContain('被疑者（台湾法上の「犯罪嫌疑人」）');
    expect(answers[10]).toContain('出国・出海の制限（台湾法上の「限制出境・出海」）');
    expect(answers[10]).toContain('勾留（同「羈押」）');
    expect(answers[10]).toContain('外国人であるだけで自動的に行われるものではなく');
    expect(answers[10]).toContain('法定要件と個別の処分');
    expect(answers[11]).toContain('ビデオ通話');
    expect(answers[11]).toContain('現在の料金案内では1時間単位');
    expect(answers[12]).toContain('倉庫・梱包・取次ぎなど');
    expect(answers[12]).toContain('「自動車貨物運送業」（汽車貨運業）');
    expect(answers[12]).toContain('道路運送を所管する機関（公路主管機関）');
    expect(answers[12]).toContain('設立準備許可（籌設許可）・営業免許等が必要');
    expect(answers[12]).toContain('PIFは当局へ登録・届出するものではありません');
  });

  it('contains substantial unique Japanese entries without Hangul or forbidden regressions', () => {
    expect(faqContent.ja).toHaveLength(13);

    const questions = faqContent.ja.map(({ question }) => question);
    expect(new Set(questions).size).toBe(13);

    const serialized = JSON.stringify(faqContent.ja);
    expect(serialized).not.toMatch(/[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/u);

    for (const { question, answer } of faqContent.ja) {
      expect(question).toMatch(/[\u3040-\u30ff]/u);
      expect(answer.length).toBeGreaterThanOrEqual(100);
      expect(answer).toMatch(/[\u3040-\u30ff]/u);
    }

    for (const forbidden of forbiddenRegressions) {
      expect(serialized).not.toContain(forbidden);
    }
  });
});
