import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { japaneseServiceDetails } from '@/data/service-details-ja';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/001-taiwan-company-establishment-basics.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('taiwan-company-establishment-basics', 'ja');

const entityFaqAnswer =
  '台湾子会社（有限公司・股份有限公司）は台湾法上の独立した法人です。外国会社の台湾支店は独立した法人格を持たず、外国会社の一部として台湾で営業します。代表者事務所は営利活動を行う拠点ではなく、外国会社のための法律行為や連絡業務に限られます。責任、税務、許認可および政府調達への参加資格は、組織形態と個別案件に応じて確認する必要があります。';
const residenceFaqAnswer =
  '会社設立だけで就業許可または居留資格を取得できるわけではありません。台湾で会社を管理・運営する外国人は、職務、出資関係、雇用主の事業実績等について就業許可の要件を満たし、許可取得後にその在留目的に応じた居留証を別途申請する必要があります。';
const employerQualificationAnswer = japaneseServiceDetails.investment.keyPoints[2];

describe('Japanese investment column 001 — company-setup basics', () => {
  it('publishes the contracted frontmatter and exactly three safe FAQs', () => {
    expect(parsed.data.title).toBe('台湾での会社設立：基礎編');
    expect(parsed.data.lastmod).toBe('2026-07-24');
    expect(parsed.data.date_display).toBe('2025年9月13日');
    expect(parsed.data.read_time).toBe('約8分');
    expect(parsed.data.faq).toEqual([
      {
        q: '台湾で会社を設立するとき、子会社・支店・事務所の違いは？',
        a: entityFaqAnswer,
      },
      {
        q: '会社を設立すれば台湾のビザを取得できますか？',
        a: residenceFaqAnswer,
      },
      {
        q: '就業許可証と居留証を取得するには最低資本金が必要ですか？',
        a: employerQualificationAnswer,
      },
    ]);

    expect(post?.title).toBe('台湾での会社設立：基礎編');
    expect(post?.date).toBe('2026-07-24');
    expect(post?.dateDisplay).toBe('2025年9月13日');
    expect(post?.readTime).toBe('約8分');
    expect(post?.faq).toEqual(parsed.data.faq);

    const bodyFaq = raw
      .split('> 外国人が台湾で会社を設立するときによくある質問')[1]
      ?.split('以上が、台湾での会社設立に関する基本的な内容です。')[0];
    expect(Array.from(bodyFaq?.matchAll(/\*\*(\d+)\./g) ?? [], (match) => match[1])).toEqual(
      ['1', '2', '3', '4', '5', '6', '7', '8'],
    );
  });

  it('uses the approved entity, treaty, process, residence, and tax language', () => {
    const requiredPhrases = [
      '台湾子会社（有限公司・股份有限公司）は台湾法上の独立した法人であり、台湾で営利活動を行えます。責任、資本構成、利益分配、税務および上場の可否は会社形態と個別事情に応じて確認する必要があります。',
      '外国会社の台湾支店は独立した法人格を持たず、外国会社の一部として台湾で営業します。支店自体に株主を置く形態ではなく、本店がその債務・責任を負います。',
      '代表者事務所は台湾で営利活動を行う拠点ではなく、外国会社のための法律行為や連絡業務に限られます。販売、役務提供その他の営業活動を行う場合は、子会社または支店等の適切な形態を検討する必要があります。',
      '台湾・韓国所得税協定は2023年12月27日に発効し、2024年1月1日から適用されています。',
      '配当、利子および使用料の上限税率は10％です。',
      '協定上の恒久的施設（PE）',
      '管理場所・支店・事務所等の固定的施設',
      '6か月を超える工事',
      'いずれかの12か月間に合計183日を超える役務提供',
      '契約締結権限を反復して行使する代理人',
      '役務提供の日数だけで判断せず',
      '責任範囲、利益送金、会計・税務、許認可および政府調達への参加資格は、名称だけで判断せず、実際の事業内容、適用法令および入札関係書類を確認したうえで、各組織形態を比較してください。',
      '台湾子会社の設立では、一般に次のような主要手続を行います。手続の内容、順序および所要期間は、組織形態、投資額、業種、審査内容、銀行対応および書類補正の有無により異なります。',
      '委任状その他の外国文書の公証・認証（必要に応じて台湾の在外機関による認証）',
      '経済部投資審議司への投資申請（該当する場合）',
      '国外からの投資資金送金',
      '投資額審定',
      '会社設立登記',
      '輸出入、業種別許認可、就業許可・居留等の追加手続（該当する場合）',
      'すべての案件に共通する固定的な順序ではありません。',
      '委任状、投資申請書、会社登記書類等は、投資者の国籍、法人・個人の別、組織形態および事業内容に応じて準備します。台湾の弁護士や会計士等の専門家と必要書類や役割分担を事前に確認しておくと、手続を進めやすくなります。',
      '外国人は在学中でも投資・会社設立を申請できますが、現在の在留資格で就労または会社経営が認められるとは限りません。投資手続、就業許可および居留資格はそれぞれ確認が必要です。',
      '多くの業種で外国投資が可能ですが、禁止・制限業種、専門資格、営業場所および業種別許認可の確認が必要です。',
      residenceFaqAnswer,
      '就業許可等に基づく居留証を取得した場合、配偶者および未成年の子は、要件を満たせば依親居留を申請できます。家族の居留は自動的に付与されるものではなく、個別の申請と審査が必要です。',
      '会社設立自体について一律の法定最低資本金があるわけではありません。ただし、業種別の最低資本額、事業計画の合理性、銀行審査および就業許可上の雇用主要件は別途確認が必要です。',
      employerQualificationAnswer,
      'ここでいう基準は、外国籍主管の就業許可に関する雇用主側の要件であり、会社設立そのものについて一律に適用される最低資本金ではありません。また、当該基準を満たすだけで許可が当然に付与されるものではなく、申請者の職務や提出書類等も審査されます。',
      '一般の外国人は、原則として台湾で合法的に5年連続して居留し、各年183日以上滞在するなどの要件を満たす場合に永久居留を申請できます。外国専門人材には平均年間滞在日数等の別の計算基準があり、素行、資産・技能その他の法定要件も審査されます。就業許可または居留証を5年間保有しただけで自動的に永久居留となるわけではありません。',
      '会社設立には所在地が必要です。所在地と営業項目について、土地使用分区、建築管理、賃貸借条件および税籍登記上の適合性を事前に確認してください。台北市では、対象となる会社・商業登記について「営業場所事前照会」制度が運用されています。',
      '台湾の営業税は、一般税率が5％で、通常は2か月ごとに申告します。営利事業所得税の一般税率は20％ですが、実際の課税は課税所得と適用規定により異なります。非居住者に支払う配当の台湾国内法上の源泉徴収率は21％です。台湾・韓国所得税協定の適用要件と手続を満たす配当については、上限税率10％が適用されます。具体的な申告・源泉徴収は、居住者区分、受益者、所得の種類および協定適用書類を確認して処理する必要があります。',
      '曾雋崴弁護士は韓国語での相談に対応しています。ご相談をご希望の場合は、公式お問い合わせ窓口からご連絡ください。内容を確認のうえ、順次ご案内します。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('removes stale statistics, universal promises, old agencies, and Korean links', () => {
    const forbiddenLiterals = [
      'KOTRAのデータによると',
      '合計107社',
      '5番目に大きな貿易パートナー',
      '6番目に大きな貿易パートナー',
      '約29億ドル',
      '約17億ドル',
      '投資審議委員会',
      '投資審査委員会',
      '投審会',
      '常設機構（PE）',
      '10段階',
      '3か月',
      '招標文書',
      '台湾で会社を設立する手続きは10段階あります',
      '単独株主の場合は最低50万新台湾ドル',
      '台湾人パートナーがいる場合は最低資本金の3分の1',
      '約17万新台湾ドル',
      '2023年12月2日',
      'サービス提供期間が12か月以内で183日未満の場合',
      '外国人が台湾に183日以上居住する場合、個人所得税率は台湾人と同様に5%から始まります',
      '配偶者と未成年の子は家族として台湾に居住できます',
      '5年連続で就業許可証と居留証を取得し、毎年台湾で183日以上居住すれば',
      '迅速にお答え',
      '/ko/',
    ];

    for (const claim of forbiddenLiterals) {
      expect(raw).not.toContain(claim);
    }

    expect(raw).not.toMatch(/会社を設立すれば[^]*?a:\s*"はい。投資者/);
    expect(raw).not.toMatch(/恒久的施設でない場合[^。]*営業利益(?:が|は)免税/);
    expect(raw).not.toContain('日本語・韓国語等で台湾法務に関するご相談を受け付けています');
  });

  it('preserves the verified identity, every original image, safe JA links, and depth', () => {
    const imagePaths = [
      '../images/001-taiwan-company-establishment-basics/featured-01.jpg',
      '../images/001-taiwan-company-establishment-basics/img-01.jpg',
      '../images/001-taiwan-company-establishment-basics/img-02.jpg',
      '../images/001-taiwan-company-establishment-basics/img-03.jpg',
      '../images/001-taiwan-company-establishment-basics/img-04.jpg',
    ];

    expect(raw).toContain('曾雋崴');
    expect(raw).not.toContain('曾俊瑋');
    for (const imagePath of imagePaths) {
      expect(raw).toContain(imagePath);
    }

    expect(raw).toContain('[台湾投資・会社設立サービス](/ja/services#investment)');
    expect(raw).toContain('[台湾弁護士・曾雋崴のプロフィール](/ja/lawyers/wei-tseng)');
    expect(raw).toContain('[台湾進出・会社設立のご相談](/ja/services#investment)');
    expect(raw.length).toBeGreaterThan(5_000);
    expect(post?.content.length).toBeGreaterThan(3_500);
  });

  it('resolves both the canonical and related-column alias slugs in Japanese', () => {
    expect(post?.slug).toBe('taiwan-company-establishment-basics');
    expect(getColumnPost('company-basics', 'ja')?.slug).toBe(
      'taiwan-company-establishment-basics',
    );
  });
});
