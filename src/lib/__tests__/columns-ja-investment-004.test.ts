import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/004-taiwan-company-subsidiary-vs-branch.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('taiwan-company-subsidiary-vs-branch', 'ja');

const legalFormAnswer =
  '支店は外国会社の一部であり、支店自体に株主は存在しません。第三者と台湾事業へ共同出資したい場合は、台湾子会社を設立して株主構成を定める方法等を検討します。責任、議決権、資金調達、許認可および税務は、出資関係と事業計画に応じて確認する必要があります。';
const taxAnswer =
  '子会社と支店はいずれも、一般に営業税5％および営利事業所得税20％の対象となります。台湾子会社が国外の親会社へ配当する場合、国内法上の源泉徴収率は21％ですが、台湾・韓国所得税協定の適用要件を満たすと上限10％です。外国会社の台湾支店の税引後利益を本店へ送金することは配当ではなく、原則として追加の源泉徴収はありません。総機構が台湾国外にある事業者は、未分配利益に対する5％の追加課税の申告対象外です。';
const listingAnswer =
  '支店は独立した発行会社ではないため、台湾で上場主体にはなれません。子会社の上場には、会社法および証券取引所の所定要件を満たす必要があります。税制優遇は組織形態だけで一律に決まるものではありません。産業創新条例第10条の1の投資税額控除等について、対象投資、申請期限、控除方法、重複適用および税額上限を個別に確認する必要があります。';
const legalIdentityParagraph =
  '台湾会社法第1条は、同法に基づいて組織・登記・設立され、営利を目的とする法人を会社と定めています。これに基づき設立された台湾子会社は、外国の親会社とは別の台湾法人です。子会社は自己の名義で事務所を賃借し、取引契約や労働契約を締結し、財産を取得し、訴訟の当事者となることができます。契約から生じる債権・債務も原則として子会社に帰属します。親会社が経営方針を定めたり役員を選任したりしても、両社の法人格が直ちに一つになるわけではありません。';
const branchShareholderParagraph =
  '支店は外国会社の一部であり、支店自体に株主は存在しません。第三者と台湾事業へ共同出資したい場合は、台湾子会社を設立して株主構成を定める方法等を検討する必要があります。責任、議決権、資金調達、許認可および税務は、出資関係と事業計画に応じて確認する必要があります。';
const limitedLiabilityParagraph =
  '子会社に適用される責任の範囲は、実際に選択した会社形態と行為に基づいて判断します。たとえば有限公司の株主は、会社法第99条第1項に基づき、原則として出資額を限度に会社に対する責任を負います。しかし第99条第2項は、株主が法人格を濫用して会社が特定の債務を弁済することが困難になり、その濫用が重大である場合に、必要な範囲で責任を負う場合があるという例外を定めています。別途、株主や親会社が保証を提供したり、直接不法行為に関与したりした場合には、その保証や行為に基づく責任も検討する必要があります。したがって、有限責任の原則は重要な出発点ですが、どのような状況でも責任が出資額で終わるという保証ではありません。';
const branchRegistrationParagraph =
  '外国会社が自己の名義で台湾で営業しようとする場合は、支店に関する会社法の規定に従わなければなりません。会社法第371条によれば、外国会社は支店登記をせずに外国会社名義で台湾で営業することはできません。第372条に基づき、外国会社は台湾支店の営業に充てる資金を割り当て、台湾責任者を指定しなければなりません。この資金は台湾営業のための本店資金であり、支店の株式や持分ではありません。責任者の指定も、支店を独立した会社に変える手続ではなく、台湾で外国会社の業務を行い責任関係を明確にする仕組みです。';
const jointVentureTermsParagraph =
  '第三者と台湾事業を共にする計画であれば、出資比率だけを定めるのでは不十分です。議決権、取締役の選任、重要事項の同意権、追加出資、資金不足時の措置、知的財産の使用、利益分配、競業制限、持分譲渡、デッドロックおよび事業終了を併せて定める必要があります。台湾子会社に共同出資する方式は、これらの関係を会社の株主構成の中で設計できるという利点があります。ただし、特定プロジェクトの契約上の共同事業、別の特別目的構造等、他の適法な方法もあり得るため、子会社だけがすべての共同事業の唯一の解決策だと断定することはできません。';
const headquartersControlParagraph =
  '支店方式では、支店運営に関する最終的な法的主体は外国会社です。本店は、台湾責任者が締結できる契約の範囲、銀行取引権限、人事権、報告体系、予算承認および内部統制を具体的に定める必要があります。反対に子会社を選択した場合は、定款と機関構成、株主間の権限配分、子会社と親会社間のサービス・貸付・ライセンス契約を区別して文書化しなければなりません。名称よりも、実際の権限と取引の流れが法的構造に合っているかが重要です。';
const regulatedBusinessParagraph =
  '許認可も法人格だけで結論を出すことはできません。業種別の規定が申請主体、最低資本、専門人材、事業場、外国人投資審査または責任者の資格を別途定めることがあるためです。子会社や支店の登記が可能であるという事実と、特定の規制事業を営むことができるという事実は同一ではありません。予定する事業活動を細分化し、各活動の契約当事者と許可名義を先に確認する必要があります。';
const section1Heading = '## 1. 法人格と出資構造';
const section2Heading = '## 2. 税務と利益送金';
const comparisonTableHeader = '| 比較項目 | 台湾子会社 | 外国会社の台湾支店 |';
const comparisonTableRows = [
  '| 法的地位 | 台湾法に基づき設立された独立法人 | 外国本店の一部であり、別個の法人格を有しない |',
  '| 出資・株主構成 | 会社形態に応じて株主と出資関係を定める | 独自の株式・持分・株主構成がない |',
  '| 第三者との共同投資 | 定款、株主構成、株主間契約等で設計可能 | 支店自体への持分出資は不可能であり、別の適法な共同事業構造を検討 |',
  '| 責任主体 | 契約と債務は原則として子会社に帰属 | 支店の契約と債務は外国会社に帰属 |',
  '| 主要な意思決定と運営統制 | 株主総会、取締役等、選択した会社形態の機関と内部規定による | 外国本店の意思決定体系と台湾責任者の権限による |',
];
const section1ProseParagraphs = [
  branchShareholderParagraph,
  legalIdentityParagraph,
  limitedLiabilityParagraph,
  branchRegistrationParagraph,
  jointVentureTermsParagraph,
  headquartersControlParagraph,
  regulatedBusinessParagraph,
];

const extractSection1 = (text: string): string => {
  const start = text.indexOf(section1Heading);
  const end = text.indexOf(section2Heading);
  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return text.slice(start, end);
};
const treatyEligibilityParagraph =
  'この違いだけを見て、子会社の税負担が常に大きいと結論づけることはできません。課税所得、繰越欠損金、費用の帰属、留保する利益、資金調達方法、利子その他の支払、利益送金の時期、租税協定の適用資格および親会社所在地の税制を総合して比較する必要があります。協定税率を利用する場合には、居住者証明書や受益者の確認など、適用要件と手続も確認します。';
const lossQualification =
  '台湾支店の損益は外国本店との関係で処理されますが、韓国側で損失をどのように扱えるかは、韓国税法、会計基準、外国税額控除その他の制度により異なります。台湾支店を選べば韓国親会社の税負担が必ず減るとはいえません。';
const transferPricingParagraph =
  '移転価格や本支店間の費用配賦には、根拠資料が必要です。契約、請求、会計処理および資金移動の実態を一致させ、台湾と本店所在地の双方で申告上の扱いを確認してください。';
const branchObligationParagraph =
  '支店は外国会社とは別の法人ではないため、台湾支店の債務は外国会社の債務となります。支店責任者が外国会社名義で適法に締結した賃貸借、売買、役務、雇用、借入などの契約から発生した義務は、原則として外国本店が負担します。台湾での営業に損失が生じた場合や、支店の資産だけでは債務を弁済できない場合であっても、法的な主体である外国会社の責任が支店に割り当てた資金だけに限定されるわけではありません。';
const subsidiaryObligationParagraph =
  '台湾子会社は独立した法人であるため、子会社が締結した契約と負担した債務は原則として子会社に帰属します。有限公司の株主は会社法第99条の原則に基づき出資額を限度として責任を負い、股份有限公司の株主は適用される会社形態の規定に基づき引き受けた株式の範囲で責任を負うのが基本です。この違いは、高リスク事業、長期契約、多数の従業員や消費者を相手とする事業において、重要な検討要素となり得ます。';
const parentGuaranteeParagraph =
  'もっとも、子会社を設立したからといって、親会社のすべてのリスクが遮断されるわけではありません。銀行や賃貸人が親会社の保証を求める場合、親会社は保証契約に基づき責任を負うことがあります。親会社が子会社の契約を直接引き受けたり、共同当事者として署名したりした場合も同様です。会社財産と株主財産を区別しなかったり、債権者を害する目的で法人格を濫用したりすれば、会社法上の例外が問題となり得ます。責任の境界は、登記上の形式だけでなく、実際の意思決定や資金運営にも影響を受けます。';
const directorDutyParagraph =
  '取締役、管理者および台湾責任者の義務も別途確認する必要があります。故意または過失による不法行為、法令違反、虚偽申告、安全管理違反のように行為者自身の責任が成立する事案は、会社形態だけでは解決しません。労働関係、源泉徴収と税務申告、個人情報、消費者保護、環境・製品規制、業種別の許認可義務は、それぞれの法律が定める責任主体と制裁に従います。グループ会社が業務を分けて遂行する場合には、誰がどの義務を実際に担ったのかを、文書と運営が一致するようにしなければなりません。';
const contractRiskParagraph =
  '契約段階では、責任制限、損害賠償、保証、担保、準拠法および紛争解決条項を事業リスクに合わせて設計する必要があります。保険で転嫁できるリスクと、内部統制で予防すべきリスクも区別する必要があります。印鑑と電子署名の権限、支出承認、顧客確認、税額計算と申告、規制報告、事故発生時の報告体制を明確にしておけば、組織形態が提供する法的な区分を実際の運営でも維持しやすくなります。';
const riskConclusionParagraph =
  '結局、責任の比較は「子会社は安全で支店は危険である」という一文では終わらせられません。支店は外国会社が直接責任を負担する構造であることが明確であり、子会社は独立した法人格と株主の有限責任の原則が出発点となります。その上に、保証、不法行為、法人格の濫用、規制上の責任およびグループ会社間の契約を重ね合わせて、実際のリスク額と統制手段を判断しなければなりません。';
const section3Heading = '## 3. 債務と法的責任';
const section4Heading = '## 4. 資金調達と台湾での上場';
const section5Heading = '## 5. 投資税額控除';
const section3ProseParagraphs = [
  branchObligationParagraph,
  subsidiaryObligationParagraph,
  parentGuaranteeParagraph,
  directorDutyParagraph,
  contractRiskParagraph,
  riskConclusionParagraph,
];

const extractSection3 = (text: string): string => {
  const start = text.indexOf(section3Heading);
  const end = text.indexOf(section4Heading);
  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return text.slice(start, end);
};
const section4OverviewParagraph =
  '支店は独立した発行会社ではないため、台湾で上場主体となることはできません。子会社が上場するには、会社法および証券取引所の所定要件を満たす必要があります。税制優遇は組織形態だけで一律に決まるものではありません。「産業創新条例」第10条の1の投資税額控除等は、対象投資、申請期限、控除方法、重複適用および税額上限を個別に確認する必要があります。';
const branchFundingParagraph =
  '支店には独自の株式や持分がないため、これを第三者に発行して支店の株主として参加させることはできません。台湾での営業に必要な資金は、本店が割り当てた資金、本店の支援または適法な借入等で調達することができます。持分を発行できないという事実を、あらゆる形態の資金調達が不可能であるという意味にまで拡大解釈すべきではありません。借入の可能性、担保、本店の保証、銀行審査および外国為替関連資料は、取引ごとに確認する必要があります。';
const subsidiaryEquityParagraph =
  '台湾子会社は、選択した会社形態と法定手続に従い、株式の発行や出資の増額を行う仕組みを活用することができます。現地パートナーを株主として迎え入れ、追加投資家の権利や種類株式の条件を設計し、役員・従業員向けの株式報酬を検討することができます。持分譲渡による投資回収、合併や分割等の事業再編、戦略的投資の受入れが長期計画に含まれているのであれば、独立法人である子会社がその計画に適する場合があります。もっとも、各手段は会社法、投資に関する規制、定款および株主間契約の制限に従います。';
const branchListingParagraph =
  '台湾での上場は、支店と子会社の構造の違いが明確に表れる分野です。外国会社の台湾支店は独立した発行会社ではなく独自の株式もないため、支店自体が台湾証券市場の上場主体となることはできません。本店である外国会社の上場可能性と、台湾支店自体の上場可能性は、別の問題です。';
const subsidiaryListingRequirementsParagraph =
  '台湾子会社が存在するという理由だけで上場資格が自動的に生じるわけでもありません。上場を計画するのであれば、まず上場可能な発行会社としての形態を整え、台湾証券取引所の該当市場の基準を満たさなければなりません。設立後の経過期間、資本、収益性、株式の分散、コーポレートガバナンス、内部統制、会計監査および情報開示等、適用されるすべての要件を準備する必要があります。業種や外国人投資の制限、グループ再編および株主構成も上場計画に影響を与え得ます。';
const fundingPlanParagraph =
  'したがって、現在必要な運転資金だけでなく、将来の資金の出所と回収方法を時系列で整理することが有益です。本店が全額を供給するのか、台湾や第三国の投資家を受け入れるのか、銀行借入と担保が必要か、役員・従業員向けの株式報酬を提供するか、将来の持分売却や上場を目指すかを整理すれば、適切な組織形態が明確になります。短期進出に適した組織形態と、長期的な資本市場計画に適した組織形態は同じでないことがあります。';
const section4ProseParagraphs = [
  section4OverviewParagraph,
  branchFundingParagraph,
  subsidiaryEquityParagraph,
  branchListingParagraph,
  subsidiaryListingRequirementsParagraph,
  fundingPlanParagraph,
];

const extractSection4 = (text: string): string => {
  const start = text.indexOf(section4Heading);
  const end = text.indexOf(section5Heading);
  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return text.slice(start, end);
};
const incentiveParagraph =
  '税制優遇は、子会社か支店かという名称だけで一律に決まるものではありません。現行の産業創新条例第10条の1には、一定の新品のスマート機械、5G、サイバーセキュリティ、AI製品・サービス、省エネ・脱炭素関連設備または技術への投資に関する投資税額控除があり、控除額には当年度の営利事業所得税額の30％という上限があります。対象者、投資内容、金額、申請期限、控除方法および他の優遇との関係を個別に確認してください。';
const treatyParagraph =
  '台湾・韓国所得税協定は2023年12月27日に発効し、2024年1月1日から適用されています。配当、利子および使用料の上限税率は10％です。事業利得は、相手方の地域に協定上の恒久的施設（PE）がある場合等を除き、原則として居住地側で課税されます。PEには、管理場所・支店・事務所等の固定的施設、6か月を超える工事、いずれかの12か月間に合計183日を超える役務提供、契約締結権限を反復して行使する代理人等が含まれ得ます。台湾支店は通常、台湾の固定的施設に当たるため、支店の台湾事業利得が当然に免税になるわけではありません。';
const section7Heading = '## 7. どちらを選ぶか';
const authorSignoff = '以上、台湾弁護士の曾雋崴でした。';
const section7OverviewParagraph =
  '子会社と支店のいずれか一方が、すべての台湾進出において優れているわけではありません。独立した台湾法人と現地の株主構成が必要な事業であれば子会社が適している場合があり、外国会社が台湾での営業を直接行いながら本店の統制を維持しようとする事業であれば支店形態が適している場合があります。ただし、設立が可能であるという判断と、営業・税務・撤退まで考慮したときに効率的な組織形態であるかという判断は、区別しなければなりません。';
const section7ComparisonPromptParagraph =
  '選択の前に、次の事項を文書に整理して比較することをお勧めします。';
const section7BulletItems = [
  '出資者が誰であり、議決権と重要事項の決定権をどのように配分するか',
  '外国本店または親会社が、契約上・法律上どの範囲の責任を負担するか',
  '顧客契約、雇用、知的財産、事業場および許認可をどの主体に帰属させるか',
  '売上と費用をどこで認識し、利益留保、配当または本店送金をどのように行うか',
  '投資認可、銀行口座、資金の持込み、外国為替および国外送金の資料をどのように準備するか',
  '会計帳簿、監査、移転価格文書および韓国側の申告・外国税額控除をどのように管理するか',
  '増資、現地パートナー、役員・従業員向けの株式報酬、上場、合併・再編および持分譲渡を計画しているか',
  '事業停止時の契約終了、労働関係、税務申告、資産処分および撤退手続を誰が遂行するか',
];
const section7ScenarioParagraph =
  '台湾進出の初期には、予想売上高が少なく人員と契約件数が多くなくても、将来の計画を併せて反映しなければなりません。短期間の市場検証の後に撤退する可能性、長期投資と現地パートナーの受入れの可能性、規制事業への拡張、本店の保証提供の有無を、シナリオ別に比較することができます。各シナリオで必要な資金、税引後の現金、責任リスク、文書および申告費用を表にまとめれば、名称による先入観を減らすことができます。';
const section7ConversionParagraph =
  '運営中に組織形態を変更する可能性も検討しなければなりません。支店の事業を新しい子会社へ移転したり、子会社の資産を他のグループ会社に譲渡したりする過程には、契約相手方の同意、労働関係、許認可、資産譲渡、税務および外国為替手続が伴うことがあります。最初に選択した形態を、後で簡単に名称だけ変えられるという前提を置いてはなりません。転換の可能性を考慮するのであれば、主要契約の譲渡条項や知的財産の使用権をあらかじめ設計しておくことが望まれます。';
const section7BranchClosureParagraph =
  '撤退手続もそれぞれ異なります。外国会社の台湾支店が営業を中止しようとする場合、会社法第378条に基づき支店登記の抹消を申請しなければなりません。ただし、抹消申請前に発生した債務、税務上、労働上、契約上および規制上の義務が、申請だけで消滅するわけではありません。取引先との精算、労働関係の終了、未収金の回収、資産処分、税務申告および銀行口座の整理を、順序に従って進めなければなりません。';
const section7CreditorRightsParagraph =
  '会社法第379条によれば、支店登記の抹消は、債権者の権利と外国会社の義務に影響を及ぼしません。債権者は抹消前の営業から発生した権利を引き続き行使することができ、外国会社はその義務を負担します。したがって、登記簿から支店がなくなったという事実だけで、過去の責任が終結したと判断してはなりません。紛争の可能性がある契約や保証、税務調査が行われ得る期間、記録保存義務も確認しなければなりません。';
const section7LiquidationParagraph =
  '外国会社の台湾支店がすべて抹消される場合、会社法第380条に基づき、台湾における営業と支店から発生した権利・義務を清算しなければなりません。清算後も弁済できなかった債務は、外国会社が引き続き負担します。外国本店と支店が同一の法的主体であるという原則は、進出時だけでなく撤退時にも作用します。清算担当者の選任、債権者への通知、申告および残余資金の処理も、最新の手続に合わせなければなりません。';
const section7SubsidiaryDissolutionParagraph =
  '台湾子会社は独立した法人であるため、外国会社支店の登記抹消ではなく、会社法上の解散・清算手続を踏みます。株主の決議、清算人、債権・債務の整理、税務申告および残余財産の分配など、子会社に適用される手続に従わなければなりません。親会社が台湾から撤退することを決定しても、子会社の法人格と債権者との関係を無視して資金を直ちに回収することはできません。両形態の終了手続と必要となる業務を同一のものとして扱ってはなりません。';
const section7FinalChoiceParagraph =
  '最終的な選択は、台湾と本店所在地の専門家が同一の事実関係を共有した状態で検討するのが安全です。事業計画、組織図、投資家、締結予定の契約、資金の流れ、人員配置および撤退シナリオを提供すれば、法律・税務・会計・外国為替の論点を互いに関連づけて確認することができます。設立後は、実際の運営が選択した組織形態と乖離していないかを定期的に点検しなければなりません。';
const section7ProseParagraphs = [
  section7OverviewParagraph,
  section7ComparisonPromptParagraph,
  section7ScenarioParagraph,
  section7ConversionParagraph,
  section7BranchClosureParagraph,
  section7CreditorRightsParagraph,
  section7LiquidationParagraph,
  section7SubsidiaryDissolutionParagraph,
  section7FinalChoiceParagraph,
];

const extractSection7 = (text: string): string => {
  const start = text.indexOf(section7Heading);
  const end = text.indexOf(authorSignoff);
  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return text.slice(start, end);
};

describe('Japanese investment column 004 — subsidiary versus branch', () => {
  it('publishes the contracted frontmatter and exactly three FAQs', () => {
    expect(parsed.data.title).toBe('台湾進出：子会社と支店の違い');
    expect(parsed.data.url).toBe(
      'https://www.wei-wei-lawyer.com/post/taiwan-company-subsidiary-vs-branch',
    );
    expect(parsed.data.lastmod).toBe('2026-07-24');
    expect(parsed.data.date_display).toBe('2025年9月13日');
    expect(parsed.data.read_time).toBe('約7分');
    expect(parsed.data.faq).toEqual([
      {
        q: '台湾支店に台湾人や台湾法人を株主として参加させることはできますか？',
        a: legalFormAnswer,
      },
      {
        q: '台湾子会社と台湾支店では、税負担にどのような違いがありますか？',
        a: taxAnswer,
      },
      {
        q: '台湾での上場や投資税額控除は、子会社と支店のどちらで利用できますか？',
        a: listingAnswer,
      },
    ]);

    expect(post?.title).toBe('台湾進出：子会社と支店の違い');
    expect(post?.date).toBe('2026-07-24');
    expect(post?.dateDisplay).toBe('2025年9月13日');
    expect(post?.readTime).toBe('約7分');
    expect(post?.faq).toEqual(parsed.data.faq);
  });

  it('locks the exact legal, tax, liability, listing, incentive, and treaty text', () => {
    // The condensed FAQ answer is locked via the frontmatter contract; the body
    // carries the full section 1 prose instead of the FAQ wording verbatim.
    expect(raw).toContain(legalFormAnswer);

    const requiredParagraphs = [
      taxAnswer,
      legalIdentityParagraph,
      treatyEligibilityParagraph,
      lossQualification,
      transferPricingParagraph,
      ...section3ProseParagraphs,
      ...section4ProseParagraphs,
      ...section7ProseParagraphs,
      incentiveParagraph,
      treatyParagraph,
    ];

    for (const paragraph of requiredParagraphs) {
      expect(raw).toContain(paragraph);
      expect(post?.content).toContain(paragraph);
    }

    for (const peCategory of [
      '管理場所・支店・事務所等の固定的施設',
      '6か月を超える工事',
      'いずれかの12か月間に合計183日を超える役務提供',
      '契約締結権限を反復して行使する代理人',
    ]) {
      expect(treatyParagraph).toContain(peCategory);
      expect(post?.content).toContain(peCategory);
    }
  });

  it('bounds section 1 to exactly seven prose paragraphs and five comparison rows', () => {
    for (const body of [raw, post?.content ?? '']) {
      const section = extractSection1(body);
      const blocks = section
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean);

      expect(blocks[0]).toBe(section1Heading);
      const contentBlocks = blocks.slice(1);
      const proseBlocks = contentBlocks.filter((block) => !block.startsWith('|'));
      const tableBlocks = contentBlocks.filter((block) => block.startsWith('|'));

      expect(proseBlocks).toHaveLength(7);
      expect(proseBlocks).toEqual(section1ProseParagraphs);
      expect(tableBlocks).toHaveLength(1);

      const tableLines = tableBlocks[0]
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      expect(tableLines[0]).toBe(comparisonTableHeader);
      expect(tableLines[1]).toMatch(/^\|[\s|-]+\|$/u);
      const bodyRows = tableLines.slice(2);
      expect(bodyRows).toHaveLength(5);
      expect(bodyRows).toEqual(comparisonTableRows);
    }
  });

  it('locks the exact section 1 prose and comparison table in raw and published content', () => {
    for (const body of [raw, post?.content ?? '']) {
      const section = extractSection1(body);
      for (const paragraph of section1ProseParagraphs) {
        expect(section).toContain(paragraph);
      }
      expect(section).toContain(comparisonTableHeader);
      for (const row of comparisonTableRows) {
        expect(section).toContain(row);
      }
    }
  });

  it('bounds section 3 to exactly six prose paragraphs in raw and published content', () => {
    for (const body of [raw, post?.content ?? '']) {
      const section = extractSection3(body);
      const blocks = section
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean);

      expect(blocks[0]).toBe(section3Heading);
      const proseBlocks = blocks.slice(1);

      expect(proseBlocks).toHaveLength(6);
      expect(proseBlocks).toEqual(section3ProseParagraphs);

      for (const paragraph of section3ProseParagraphs) {
        expect(section).toContain(paragraph);
      }
    }
  });

  it('bounds section 4 to exactly six prose paragraphs in raw and published content', () => {
    for (const body of [raw, post?.content ?? '']) {
      const section = extractSection4(body);
      const blocks = section
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean);

      expect(blocks[0]).toBe(section4Heading);
      const proseBlocks = blocks.slice(1);

      expect(proseBlocks).toHaveLength(6);
      expect(proseBlocks).toEqual(section4ProseParagraphs);

      for (const paragraph of section4ProseParagraphs) {
        expect(section).toContain(paragraph);
      }
    }
  });

  it('bounds section 7 to nine prose paragraphs and eight bullets ending at the author sign-off', () => {
    for (const body of [raw, post?.content ?? '']) {
      expect(body).toContain(section7Heading);
      expect(body).toContain(authorSignoff);

      const section = extractSection7(body);
      const blocks = section
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean);

      expect(blocks[0]).toBe(section7Heading);
      const contentBlocks = blocks.slice(1);
      const proseBlocks = contentBlocks.filter(
        (block) => !block.startsWith('-'),
      );
      const bulletBlocks = contentBlocks.filter((block) =>
        block.startsWith('-'),
      );

      expect(proseBlocks).toHaveLength(9);
      expect(proseBlocks).toEqual(section7ProseParagraphs);
      expect(bulletBlocks).toHaveLength(1);

      const bulletLines = bulletBlocks[0]
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      expect(bulletLines).toHaveLength(8);
      expect(bulletLines).toEqual(
        section7BulletItems.map((item) => `- ${item}`),
      );

      for (const article of ['第378条', '第379条', '第380条']) {
        expect(section).toContain(article);
      }
    }
  });

  it('preserves the verified identity, source, both images, JA links, and depth', () => {
    expect(raw).toContain('曾雋崴');
    expect(raw).not.toContain('曾俊瑋');
    expect(parsed.data.url).toBe(
      'https://www.wei-wei-lawyer.com/post/taiwan-company-subsidiary-vs-branch',
    );
    for (const imagePath of [
      '../images/004-taiwan-company-subsidiary-vs-branch/featured-01.jpg',
      '../images/004-taiwan-company-subsidiary-vs-branch/img-01.jpg',
    ]) {
      expect(raw).toContain(imagePath);
    }

    expect(raw).toContain('[台湾投資・会社設立サービス](/ja/services#investment)');
    expect(raw).toContain(
      '[台湾会社設立の基礎](/ja/columns/taiwan-company-establishment-basics)',
    );
    expect(raw).toContain('[お問い合わせ](/ja/contact)');
    expect(raw.length).toBeGreaterThan(5_000);
    expect(post?.content.length).toBeGreaterThan(3_500);
  });

  it('removes stale and misleading claims, Korean links, promises, and Hangul', () => {
    const forbiddenLiterals = [
      '支店は韓国企業が100％所有',
      '他の台湾人や台湾法人は株主として参加できません',
      '付加価値税',
      '外国人所得税',
      '子会社は一般に、より高い税負担',
      '支店の設立は韓国親会社の税負担を軽減',
      '子会社にのみ',
      '革新的な研究開発支出',
      '股份有限公司形態の子会社のみが上場',
      '2023年12月2日',
      '恒久的施設（固定事業場）でない場合、営業利益は免税',
      '迅速にお答え',
      'コメントやDM',
      '投資者',
      '居住者証明や',
      '取引価格',
      '第三者から支店への出資',
      '/ko/',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(raw).not.toContain(forbidden);
    }

    expect(raw).not.toMatch(/支店[^。\n]*(?:100％所有|台湾人[^。\n]*株主として参加でき)/);
    expect(raw).not.toMatch(/子会社[^。\n]*(?:必ず|常に)[^。\n]*税負担/);
    expect(raw).not.toMatch(/(?:12か月|183日)[^。\n]*だけ[^。\n]*PE/);
    expect(raw).not.toMatch(/[\uac00-\ud7af]/);
    expect(post?.title).not.toMatch(/[\uac00-\ud7af]/);
    expect(post?.content).not.toMatch(/[\uac00-\ud7af]/);
  });

  it('resolves the canonical and related alias slugs in Japanese', () => {
    expect(post?.slug).toBe('taiwan-company-subsidiary-vs-branch');
    expect(getColumnPost('subsidiary-vs-branch', 'ja')?.slug).toBe(
      'taiwan-company-subsidiary-vs-branch',
    );
  });
});
