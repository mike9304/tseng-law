import { describe, expect, it } from 'vitest';

import {
  getJapaneseServiceDetail,
  japaneseServiceDetailSlugs,
  japaneseServiceDetails,
} from '@/data/service-details-ja';
import { getServiceArea } from '@/data/service-details';
import { getColumnPost } from '@/lib/columns';

const expectedInvestment = {
  title: '台湾投資・会社設立',
  subtitle: '韓国企業の台湾進出を、組織形態の選定から設立・許認可まで一貫支援',
  intro:
    '昊鼎国際法律事務所は、韓国企業の台湾進出に際し、台湾子会社・台湾支店・代表者事務所等の組織形態の選定、必要に応じた経済部投資審議司への投資申請、投資資金の送金・投資額審定、会社・支店等の登記、銀行口座開設、営業場所の適法性確認および業種別許認可を支援します。',
  keyPoints: [
    '外国企業の台湾進出拠点は、一般に、台湾子会社（有限公司または股份有限公司）、外国会社の台湾支店、代表者事務所に区分されます。子会社と支店は営利活動が可能ですが、代表者事務所は法律行為および連絡業務に限られます。法人格、責任、税務、投資・登記手続および政府調達への参加資格は、組織形態と個別の招標文書に応じて確認する必要があります。',
    '台湾子会社の設立では、通常、会社名・営業項目の予備審査、投資許可、国外からの投資資金送金、投資額審定、会社設立登記および税籍登記を行い、必要に応じて輸出入、工場または業種別の許認可手続を追加します。手続数と所要期間は、組織形態、投資額、業種、審査内容、銀行対応および書類補正の有無により異なります。',
    '外国投資事業の外国籍主管に関する就業許可では、華僑または外国人が保有する当該事業の株式または出資額の合計が、その株式総数または資本総額の3分の1を超える会社の経理人、外国会社の台湾支店の経理人、代表者事務所の代表者等が対象となります。このうち、会社または支店の雇用主が設立1年未満の場合は、実収資本額または台湾における運転資金50万新台湾ドル以上、売上高300万新台湾ドル以上、輸出入実績50万米ドル以上、または代理手数料20万米ドル以上のいずれかが原則です。設立1年以上の場合は、台湾における直近1年または直近3年平均について、売上高300万新台湾ドル以上、輸出入実績50万米ドル以上、または代理手数料20万米ドル以上のいずれかが原則です。代表者事務所は、設立1年以上であれば台湾における業務実績が必要です（設立1年未満は免除）。国内経済の発展に実質的な貢献がある場合または事情が特殊な場合には、特別認定の余地もあります。',
    '投資許可後は、許可内容に従って国外から台湾へ投資資金を送金し、台湾側で投資額の審定を受けます。韓国における海外直接投資申告、送金名義、本人来店の要否、インターネットバンキングまたは代理手続の可否は、韓国法および利用する送金銀行の最新取扱いを個別に確認してください。',
    '台北市で会社・商業（支店および分支機構を含む）の設立、所在地移転、または営業項目追加の登記を申請する場合は、「営業場所事前照会」システムにより、営業場所と営業項目が土地使用分区および建築管理規定に適合するか事前審査を受け、適合結果を登記申請に添付する必要があります。',
    '2026年7月1日以降、工場登記を免除された製造場所で生産される固形手作り石けんを除き、一定規模の化粧品製造・輸入業者は、対象製品の供給・販売等の前に製品登録を完了し、PIF（化粧品製品情報ファイル）を作成・保存しなければなりません。PIF自体を登録する制度ではありません。虚偽・誇大な表示・宣伝・広告には4万～20万新台湾ドル、医療効能を標榜する場合には60万～500万新台湾ドルの過料が科され得ます。',
    '最低資本額2,500万新台湾ドルおよび全新貨車20両以上という基準は、一般的な物流業全体ではなく、「自動車貨物運送業」を新規に籌設する場合の原則的な基準です。規定に適合する車両、停車場その他の設備も必要です。引越専業、金門・連江地域、個人小貨車貨運業等には別基準または例外があります。既存事業者の買収には投資・会社・運輸関係の許認可確認が必要であり、免許を有する事業者への配送委託は、自社が自動車貨物運送業を営むこととは区別されます。',
    '会社を恒久的に終了する場合は、解散登記を行い、合併・分割・破産による解散を除き、清算手続を経る必要があります。会社法第9条の5年以下の有期刑等は、未払込の株金を払込済みと表示した場合、または払込後に会社責任者が株金を株主へ返還し、もしくは株主による回収を許した場合に適用されるものであり、通常の適法な会社資金の使用一般を指すものではありません。債務・税務を処理した後に分配されるのは「資本金」そのものではなく残余財産です。',
  ],
};

const universalProcessPattern =
  /(?:約\s*)?10(?:個の)?(?:ステップ|段階)|(?:約\s*)?3(?:か月|ヶ月)/;
const singleShareholderCapitalPattern =
  /(?:1人|一人|単一|単独)株主.{0,80}最低資本/;
const bankRestrictionPattern =
  /本人(?:が|による|の).{0,60}銀行.{0,60}(?:訪問|来店|出向).{0,30}(?:求め|必要|必須)|(?:オンライン|インターネットバンキング|代理(?:送金|手続)?).{0,30}(?:不可|できない|できません)/;
const pifRegistrationPattern =
  /PIF(?:自体)?(?:の)?(?:登録|を登録).{0,24}(?:必須|義務|必要|完了|しなければ|求められ)/;
const pifNounCompoundPattern = /PIF登録/;
const cosmeticsAdOverreachPattern =
  /(?:広告(?:の)?違反|虚偽・?誇大)(?:(?!医療効能)[^。]){0,100}500万新台湾ドル/;
const logisticsOverreachPattern =
  /(?:物流業(?:(?!ではなく)[^。]){0,120}(?:2,?500万新台湾ドル|20(?:両|台))|(?:2,?500万新台湾ドル|20(?:両|台))(?:(?!ではなく)[^。]){0,120}物流業(?!(?:全体)?ではなく))/;
const companyFundsOverreachPattern =
  /(?:会社資金|会社の(?:資金|預金)).{0,60}(?:引出|引き出|持ち出).{0,60}(?:5年|有期刑)/;
const capitalDistributionPattern = /資本金.{0,30}(?:返還|分配|回収)/;

const prohibitedProbeCases: Array<{ pattern: RegExp; copy: string }> = [
  { pattern: universalProcessPattern, copy: '10段階で完了します。' },
  { pattern: universalProcessPattern, copy: '約 3か月で完了します。' },
  { pattern: singleShareholderCapitalPattern, copy: '単独株主には最低資本金が必要です。' },
  { pattern: bankRestrictionPattern, copy: '本人による銀行訪問が必須です。' },
  {
    pattern: bankRestrictionPattern,
    copy: '本人が直接韓国の銀行に出向き、窓口手続を求めます。',
  },
  { pattern: bankRestrictionPattern, copy: '代理送金はできません。' },
  { pattern: pifRegistrationPattern, copy: 'PIFを登録する必要があります。' },
  { pattern: pifNounCompoundPattern, copy: 'PIF登録まで必要です。' },
  {
    pattern: cosmeticsAdOverreachPattern,
    copy: '化粧品広告の違反には一律500万新台湾ドルの過料が科されます。',
  },
  {
    pattern: logisticsOverreachPattern,
    copy: '物流業には最低資本額2,500万新台湾ドルが必要です。',
  },
  {
    pattern: logisticsOverreachPattern,
    copy: '最低資本額2,500万新台湾ドルと貨車20台が物流業の要件です。',
  },
  {
    pattern: companyFundsOverreachPattern,
    copy: '会社の預金を引き出すと5年以下の有期刑となります。',
  },
  {
    pattern: companyFundsOverreachPattern,
    copy: '会社資金を直接持ち出すと、5年以下の有期刑となります。',
  },
  { pattern: capitalDistributionPattern, copy: '清算後に資本金を回収します。' },
];

describe('Japanese investment service-detail content', () => {
  it('preserves the reviewed title, subtitle, intro, and eight ordered points exactly', () => {
    expect(getJapaneseServiceDetail('investment')).toEqual(expectedInvestment);
    expect(getJapaneseServiceDetail('investment')?.keyPoints).toHaveLength(8);
  });

  it('keeps the partial source isolated until all six services are ready', () => {
    expect(japaneseServiceDetailSlugs).toEqual([
      'investment',
      'civil',
      'family',
      'labor',
      'criminal',
      'ip',
    ]);
    expect(Object.keys(japaneseServiceDetails)).toEqual([
      'investment',
      'civil',
      'family',
      'labor',
      'criminal',
    ]);

    for (const slug of [
      'ip',
      'unknown',
      '__proto__',
      'constructor',
    ]) {
      expect(getJapaneseServiceDetail(slug)).toBeUndefined();
    }
  });

  it('preserves all eight investment column relationships and resolves them in Japanese', () => {
    const investment = getServiceArea('investment');

    expect(investment?.columnSlugs).toEqual([
      'taiwan-company-establishment-basics',
      'taiwan-company-subsidiary-vs-branch',
      'taiwan-company-establishment-advanced-1',
      'taiwan-company-establishment-advanced-2',
      'taiwan-company-setup-pitch-location',
      'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
      'taiwan-logistics-business-setup',
      'withdraw-capital-taiwan-company',
    ]);

    for (const slug of investment?.columnSlugs ?? []) {
      expect(getColumnPost(slug, 'ja'), slug).toBeDefined();
    }
  });

  it('retains the official terms and qualified numerical thresholds', () => {
    const serialized = JSON.stringify(getJapaneseServiceDetail('investment'));

    for (const required of [
      '経済部投資審議司',
      '投資額審定',
      '華僑',
      '外国会社の台湾支店',
      '代表者事務所',
      '台湾における業務実績',
      '3分の1',
      '50万新台湾ドル以上',
      '300万新台湾ドル以上',
      '50万米ドル以上',
      '20万米ドル以上',
      '営業場所事前照会',
      '2026年7月1日以降',
      'PIF（化粧品製品情報ファイル）を作成・保存',
      'PIF自体を登録する制度ではありません',
      '4万～20万新台湾ドル',
      '60万～500万新台湾ドル',
      '自動車貨物運送業',
      '最低資本額2,500万新台湾ドル',
      '全新貨車20両以上',
      '一般的な物流業全体ではなく',
      '会社法第9条',
      '残余財産',
    ]) {
      expect(serialized).toContain(required);
    }
  });

  it('excludes stale, overbroad, fallback, and wrong-identity copy', () => {
    const serialized = JSON.stringify(getJapaneseServiceDetail('investment'));

    expect(serialized).not.toMatch(/投資審議委員会|投審会/);
    expect(serialized).not.toMatch(universalProcessPattern);
    expect(serialized).not.toMatch(singleShareholderCapitalPattern);
    expect(serialized).not.toMatch(bankRestrictionPattern);
    expect(serialized).not.toMatch(pifRegistrationPattern);
    expect(serialized).not.toMatch(pifNounCompoundPattern);
    expect(serialized).not.toMatch(cosmeticsAdOverreachPattern);
    expect(serialized).not.toMatch(logisticsOverreachPattern);
    expect(serialized).not.toMatch(companyFundsOverreachPattern);
    expect(serialized).not.toMatch(capitalDistributionPattern);

    expect(serialized).not.toMatch(/[\u3131-\u318e\uac00-\ud7a3]/u);
    expect(serialized).not.toMatch(
      /Hovering supports Korean businesses|End-to-end legal support|Investment & Company Setup/i,
    );
    expect(serialized).not.toMatch(
      /曾俊瑋|Tseng Jun-Wei|Tseng Junwei|법무법인 호정|昊鼎國際法律事務所/,
    );
  });

  it('catches representative evasions while allowing the reviewed qualifiers', () => {
    for (const { pattern, copy } of prohibitedProbeCases) {
      expect(copy, copy).toMatch(pattern);
    }

    expect('PIF自体を登録する制度ではありません').not.toMatch(
      pifRegistrationPattern,
    );
    expect('PIF自体を登録する制度ではありません').not.toMatch(
      pifNounCompoundPattern,
    );
    expect(expectedInvestment.keyPoints[6]).not.toMatch(logisticsOverreachPattern);
  });
});
