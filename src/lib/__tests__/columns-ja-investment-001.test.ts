import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/001-taiwan-company-establishment-basics.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('taiwan-company-establishment-basics', 'ja');
const articleTitle =
  '台湾での会社設立の基礎：子会社・支店・代表者事務所、手続と就業許可';

const entityFaqAnswer =
  '台湾子会社（有限公司・股份有限公司）は台湾法上の独立した法人です。外国会社の台湾支店は独立した法人格を持たず、外国会社の一部として台湾で営業します。代表者事務所は営利活動を行う拠点ではなく、外国会社のための法律行為や連絡業務に限られます。責任、税務、許認可および政府調達への参加資格は、組織形態と個別案件に応じて確認する必要があります。';
const residenceFaqAnswer =
  '会社設立だけで就業許可または居留資格を取得できるわけではありません。台湾で会社を管理・運営する外国人は、職務、出資関係、雇用主の事業実績等について就業許可の要件を満たし、許可取得後にその在留目的に応じた居留証を別途申請する必要があります。';
const employerQualificationAnswer =
  '外国人投資事業の外国籍経営責任者に関する就業許可は、華僑または外国人が保有する当該事業の株式または出資額の合計が、発行済株式総数または資本総額の3分の1を超える会社の経営責任者（經理人）、外国会社の台湾支店の経営責任者、代表者事務所の代表者等を対象とします。このうち、会社または支店の雇用主が設立1年未満の場合は、払込資本金または台湾における運転資金50万新台湾ドル以上、売上高300万新台湾ドル以上、輸出入実績50万米ドル以上、または代理手数料20万米ドル以上のいずれかが原則です。設立1年以上の場合は、台湾における直近1年または直近3年平均について、売上高300万新台湾ドル以上、輸出入実績50万米ドル以上、または代理手数料20万米ドル以上のいずれかが原則です。代表者事務所は、設立1年以上であれば台湾における業務実績が必要です（設立1年未満は免除）。台湾経済の発展に実質的に貢献する場合や、事情が特殊な場合には、特別認定の余地もあります。';
const section1Heading =
  '## 1. 台湾への進出形態：子会社・支店・代表者事務所';
const section2Heading = '## 2. 台湾子会社設立の主要な手続';
const section3Heading = '## 3. 業種と営業場所の事前確認';
const section4Heading = '## 4. 就業許可・居留資格・資本金';
const section5Heading = '## 5. 税金と台湾・韓国所得税協定';
const officialSourcesHeading = '## 公式資料';
const relatedGuidanceParagraph =
  '関連する業務範囲は[台湾投資・会社設立サービス](/ja/services#investment)で、担当弁護士の経歴と対応言語は[曾雋崴弁護士のプロフィール](/ja/lawyers/wei-tseng)でご確認いただけます。具体的な事案に関するお問い合わせは[ご相談・お問い合わせ](/ja/contact)をご利用ください。';
const disclaimerParagraph =
  '本稿は、台湾での会社設立および関連制度を一般的に説明するための教育目的の資料であり、個別の事案に対する法律・税務上の助言ではありません。投資構造、業種、申請者の国籍・在留資格および所管官庁の最新の実務によって必要な手続や結果が異なり得るため、投資・契約・雇用を実行する前に、最新の公式資料と個別の事情をご確認ください。';
const authorLine = '**曾雋崴弁護士（Wei Tseng）**';
const publicText = parsed.content
  .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  .replace(/^#{1,6}\s+/gm, '')
  .replace(/^>\s?/gm, '')
  .replace(/^[-*+]\s+/gm, '')
  .replace(/^\d+\.\s+/gm, '')
  .replace(/^---$/gm, '')
  .replace(/[「」『』“”‘’*_`]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
const visibleJapaneseCount =
  publicText.match(
    /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu,
  )?.length ?? 0;
const calculatedReadMinutes = Math.ceil(visibleJapaneseCount / 500);
const officialSourceUrls = [
  'https://law.moea.gov.tw/EngLawContent.aspx?id=10484&lan=E',
  'https://mnscdn.moea.gov.tw/Mns/dir/content/Content.aspx?menu_id=42885',
  'https://gcis.nat.gov.tw/mainNew/English/index.jsp',
  'https://ws.wda.gov.tw/Download.ashx?n=VGhlIERpcmVjdG9yIG9yIE1hbmFnZXIgb2YgYW4gQXBwcm92ZWQgQnVzaW5lc3MgSW52ZXN0ZWQgb3IgRXN0YWJsaXNoZWQgYnkgT3ZlcnNlYXMgQ2hpbmVzZSBvciBGb3JlaWduZXIocykoU09QIE1hbnVhbCkucGRm&u=LzAwMS9VcGxvYWQvMzIxL3JlbGZpbGUvMC8yNTE1LzUzMWMyZTM0LTI1NmYtNGI5MC1iMzAzLTEzNWI4MTQxYTk5MC5wZGY%3D',
  'https://www.mof.gov.tw/eng/singlehtml/f48d641f159a4866b1d31c0916fbcc71?cntId=e1e57a4211474ff9b5d63a83b30dcf10',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=10&pcode=G0340080',
  'https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/business-tax/collection-prcedure/oVL9pwM',
  'https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/profit-seeking-enterprise-income-tax/file-payment/62nOrYR',
  'https://www.etax.nat.gov.tw/etwmain/alien-tax-service/alien-tax-faq/KK9Y76o',
  'https://www.immigration.gov.tw/5475/5478/141465/141808/411648/cp_news',
  'https://www.businesslocationinfo.gov.taipei/BLBQS/Home/Notice',
];
const officialSourceLinks = [
  `[台湾経済部 外国人投資関連法規（英語版）](${officialSourceUrls[0]})`,
  `[台湾経済部 投資業務案内](${officialSourceUrls[1]})`,
  `[台湾経済部商業発展署 会社・商業登記案内](${officialSourceUrls[2]})`,
  `[外国人投資事業の経営責任者に関する就業許可業務手引き](${officialSourceUrls[3]})`,
  `[台湾財政部 台湾・韓国所得税協定案内](${officialSourceUrls[4]})`,
  `[非居住者への配当源泉徴収率に関する規定](${officialSourceUrls[5]})`,
  `[台湾営業税の申告周期案内](${officialSourceUrls[6]})`,
  `[台湾営利事業所得税の税率案内](${officialSourceUrls[7]})`,
  `[外国人への配当所得の課税案内](${officialSourceUrls[8]})`,
  `[台湾内政部移民署 永久居留案内](${officialSourceUrls[9]})`,
  `[台北市営業場所事前照会案内](${officialSourceUrls[10]})`,
];
const section1Paragraphs = [
  entityFaqAnswer,
  '台湾子会社（有限公司・股份有限公司）は、親会社とは別個の法人格を有し、自己の名義で契約を締結して、権利義務の主体となります。有限公司と股份有限公司のいずれを選択するかは、出資持分または株式の構成、機関設計、意思決定の仕組みおよび資金調達計画を踏まえて検討する必要があります。ただし、子会社が独立した法人であっても、すべての責任が常に子会社のみに限定されるとは限りません。保証、担保、親会社との契約、取締役の責任など、個々の法律関係も併せて確認する必要があります。',
  '外国会社の台湾支店は、外国本店が台湾で営業するための組織です。支店自体に株主を置く組織ではなく、別個の法人ではない本店の一部であるため、本店が支店の債務と責任を負います。本店と台湾支店との間の資金移動、利益送金、会計処理および税務上の取扱いは、子会社からの配当と同じ仕組みであると考えるべきではありません。',
  '代表者事務所は、市場調査、連絡、交渉の支援や外国会社のための法律行為など、許容される範囲内で活動する拠点です。台湾で販売や役務提供などの営業活動を行うことはできません。実際の業務が受注、代金の受領、反復的なサービス提供へと拡大するのであれば、代表者事務所という名称だけを見るのではなく、子会社または支店が必要かどうかを改めて検討する必要があります。',
  '組織形態を比較するときには、責任の範囲だけでなく、資本構成、利益の分配と送金、税務、業種別の許認可、雇用関係および政府調達への参加要件を併せて確認する必要があります。特定の入札や許認可で台湾法人、資本金、実績または登録の要件が求められる場合には、組織の名称だけで参加の可否を断定せず、該当する法令と公告を確認する必要があります。',
  '台湾・韓国所得税協定は2023年12月27日に発効し、2024年1月1日から適用されています。協定の適用要件を満たす場合、配当・利子・使用料に関する源泉地国の上限税率はそれぞれ10％です。事業利得は、相手方の地域に協定上の恒久的施設（PE）がある場合等を除き、原則として居住地側で課税されますが、事業の実際の遂行形態をまず確認する必要があります。',
  '協定上の恒久的施設には、管理場所・支店・事務所等の固定的施設、6か月を超える工事、いずれかの12か月間に合計183日を超える役務提供、契約締結権限を反復して行使する代理人が含まれ得ます。この4つの類型はそれぞれ適用条件が異なり、固定された場所や代理人の活動があれば、役務提供の日数とは別個に検討が必要です。したがって、183日という数字だけで恒久的施設の成立や事業利得の課税の可否を判断すべきではありません。',
];
const extractSection1 = (body: string): string => {
  const start = body.indexOf(section1Heading);
  const end = body.indexOf(section2Heading, start);
  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return body.slice(start, end);
};
const section2ProseParagraphs = [
  '台湾子会社の設立は、一般に会社の中国語名称と営業項目の予備審査から始まり、外国人投資の審査、口座開設と送金、投資額の審査確定、会社設立登記および税籍登記へと続きます。下記のリストは全体の流れを理解するための概要であり、すべての場合に同じように適用される固定的な順序や期間を意味するものではありません。',
  '会社の中国語名称と営業項目の予備審査は、使用する名称と予定する事業を登記前に確認する段階です。予備審査を通過したという事実は、その業種に必要な別途の許可をすでに受けていることや、予定する場所で直ちに営業できることを意味するものではありません。外国人投資の申請が必要な場合には、投資者、投資額、出資対象および事業計画を審査資料と一致させる必要があります。',
  '委任状、法人の存続証明、代表権を確認する書類など、外国で作成された文書は、発行地と書類の性質に応じて、公証・認証または台湾の在外機関による認証が必要となる場合があります。翻訳文、署名権者および法人名の表記が申請書と一致しているかも確認する必要があります。投資者の国籍や個人・法人の別によって準備書類が異なる場合があるため、書類を取得する前に有効期間と認証の経路を整理しておく方が効率的です。',
  '準備口座の開設と投資資金の送金の段階では、銀行が顧客確認手続の一環として実質的所有者と資金の出所を確認する場合があります。送金者、送金目的、投資承認の内容と入金口座が互いに食い違う場合、追加の説明や補正が必要となることがあります。送金後は、実際の投資額に対する審査確定（投資額審定）を経たうえで会社設立登記と税籍登記を進め、銀行の手続に従って準備口座を正式口座に切替えます。',
  '手続の順序・必要性・期間は、組織形態、投資額、業種、審査内容、銀行手続の進行状況および補正の有無によって異なります。輸出入登録、工場・製品・専門業種に関する許可、外国人の就業許可および居留の申請のように、会社設立後に進める手続もあります。契約締結日や営業開始日を定める際には、会社登記だけでなく、これらの後続手続の完了時期まで考慮する必要があります。',
];
const section2Steps = [
  '1. 会社の中国語名称および営業項目の予備審査',
  '2. 委任状その他の外国文書の公証・認証（必要に応じて台湾の在外機関による認証）',
  '3. 経済部投資審議司への投資申請（該当する場合）',
  '4. 会社設立用の準備口座開設',
  '5. 国外からの投資資金送金',
  '6. 投資額審定',
  '7. 会社設立登記',
  '8. 税籍登記',
  '9. 準備口座から正式口座への切替え',
  '10. 輸出入、業種別許認可、就業許可・居留等の追加手続（該当する場合）',
];
const extractSection2 = (body: string): string => {
  const start = body.indexOf(section2Heading);
  const end = body.indexOf(section3Heading, start);
  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return body.slice(start, end);
};
const section3Paragraphs = [
  '多くの業種で外国投資は可能ですが、禁止・制限業種、専門資格、営業場所の制限および業種別の許認可は別途確認する必要があります。医療機器、酒類、旅行、建設、専門サービスのように、監督官庁の許可・登録または資格が問題となり得る分野では、実際に提供する商品・サービスや取引の構造を基準に、適用される規定を検討する必要があります。',
  '会社登記に営業項目を記載できるという事実だけで、その営業を直ちに開始できるわけではありません。会社名と営業項目の予備審査、会社設立登記、税籍登記、業種別の許認可は、それぞれ目的が異なります。オンライン販売とオフライン店舗、輸入と国内流通、直接サービスと仲介サービスのように運営方式が異なれば、必要な登録や責任も異なり得ます。',
  '会社の所在地は、単なる郵便物の受取先ではなく、登記、税務および実際の営業の基礎となります。賃貸借契約を締結する前に、予定する住所と営業項目について、土地使用分区、建築管理、賃貸借条件および税籍登記上の適合性を確認する必要があります。建物の用途や管理規約が実際の事業に合わない場合、または必要な賃貸人の同意を得られない場合には、登記後であっても場所の変更や追加手続が必要となることがあります。',
  '台北市では、適用対象となる会社・商業登記について、営業場所事前照会（營業場所預先查詢）制度を運用しています。ただし、この照会結果だけで他の許認可や専門法令上の要件まで満たされるわけではありません。他の地域に所在地を置く場合には、当該地方政府および所管官庁の手続を確認し、長期の賃貸借契約を締結したり施設に投資したりする前に、場所の適合性を書面で確認しておくとよいでしょう。',
];
const extractSection3 = (body: string): string => {
  const start = body.indexOf(section3Heading);
  const end = body.indexOf(section4Heading, start);
  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return body.slice(start, end);
};
const section4Headings = [
  '### 会社設立と就業許可・居留資格',
  '### 会社の資本金と外国籍経営責任者の就業許可',
];
const section4Paragraphs = [
  '会社設立の申請者、会社の株主、台湾で実際に業務を行う者および居留の申請者は、同一であっても、法的には区別して考える必要があります。投資の承認は資本の流入を、就業許可は外国人の業務遂行を、居留証は在留目的と期間を、それぞれ審査するためです。',
  residenceFaqAnswer,
  '学生であっても投資・会社設立を申請することができます。しかし、投資者や株主になったという事実は、現在の在留資格で台湾での就労や会社経営が認められていることを意味しません。実際に契約を締結し、従業員を指揮し、または日常的な経営業務を担当するのであれば、業務を開始する前に就業許可の対象と要件を確認する必要があります。',
  '就業許可の審査では、申請者の職務と資格、会社で担当する役割、投資関係、雇用主の事業実績および提出資料を総合的に確認することがあります。就業許可を取得した後も、居留証は在留目的に応じて別途申請し、各許可の有効期間と更新要件についても、当該処分と当時の法令を基準に確認する必要があります。',
  '会社設立自体について一律の法定最低資本金があるわけではありません。ただし、業種別の最低資本額、事業計画の合理性、銀行審査および就業許可上の雇用主要件は別途確認が必要です。外国人投資事業の外国籍経営責任者に関する就業許可は、華僑または外国人が保有する当該事業の株式または出資額の合計が、発行済株式総数または資本総額の3分の1を超える会社の経営責任者（經理人）、外国会社の台湾支店の経営責任者、代表者事務所の代表者等を対象とします。このうち、会社または支店の雇用主が設立1年未満の場合は、払込資本金または台湾における運転資金50万新台湾ドル以上、売上高300万新台湾ドル以上、輸出入実績50万米ドル以上、または代理手数料20万米ドル以上のいずれかが原則です。設立1年以上の場合は、台湾における直近1年または直近3年平均について、売上高300万新台湾ドル以上、輸出入実績50万米ドル以上、または代理手数料20万米ドル以上のいずれかが原則です。代表者事務所は、設立1年以上であれば台湾における業務実績が必要です（設立1年未満は免除）。台湾経済の発展に実質的に貢献する場合や、事情が特殊な場合には、特別認定の余地もあります。',
  '上記の数値は、会社設立に一律に適用される最低資本金ではなく、外国籍経営責任者の就業許可のための雇用主要件です。業種別の法令により別途資本金や保証金が求められる場合があり、銀行は事業計画と取引リスクを独自に審査することがあります。また、上記の基準を満たしても就業許可が自動的に発行されるわけではありません。申請者の実際の職務、経歴および提出書類など、他の要件も併せて審査されます。',
  '就業許可等に基づく居留証を取得した外国人の配偶者および未成年の子は、要件を満たして依親居留を別途申請することができます。婚姻関係や親子関係、扶養および在留目的などを証明する書類が必要となる場合があり、家族の居留資格が自動的に付与されるわけではありません。',
  '一般の外国人が永久居留を申請するには、原則として台湾で5年連続して合法的に居留し、各年183日以上滞在するなどの要件を満たす必要があります。外国専門人材等には別の算定基準が適用される場合があり、素行、資産・技能等の他の法定要件も審査されます。永久居留の要件算定で除外される滞在期間や申請時点の要件についても個別に確認する必要があり、就業許可や居留証を5年間保有したという事実だけで永久居留が自動的に認められるわけではありません。',
];
const extractSection4 = (body: string): string => {
  const start = body.indexOf(section4Heading);
  const end = body.indexOf(section5Heading, start);
  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return body.slice(start, end);
};
const section5Paragraphs = [
  '台湾の営業税は、一般税率が5％で、通常は2か月ごとに申告します。営利事業所得税の一般税率は20％ですが、実際の課税は課税所得と適用規定により異なります。非居住者に支払う配当の台湾国内法上の源泉徴収率は21％です。台湾・韓国所得税協定の適用要件と手続を満たす配当については、上限税率10％が適用されます。具体的な申告・源泉徴収は、居住者区分、受益所有者、所得の種類および協定適用書類を確認して処理する必要があります。',
  '営業税と営利事業所得税は、課税対象と申告方法が異なるため、売上に適用される税金と課税所得に適用される税金を区別する必要があります。国外の株主や関係会社に配当、利子、使用料または役務対価を支払う際には、支払の性質と受取人の地位、国内法上の源泉徴収規定および所得税協定の適用可能性を事前に検討する必要があります。',
  '台湾・韓国所得税協定は2023年12月27日に発効し、2024年1月1日から適用されており、要件を満たす利子と使用料についても源泉地国の上限税率10％が適用されます。事業利得の課税権を検討する際には、前述した恒久的施設の四つの類型をすべて確認する必要があります。役務提供日数だけでなく、固定的施設、工事期間、代理人の契約締結権限および実際の活動も併せて確認しなければなりません。',
  '協定上の制限税率は、協定が存在するという事実だけで自動的に適用されるものではありません。納税者が協定上の居住者に該当するか、受益所有者に該当するか、所得の法的性質は何か、また、提出すべき居住者証明書や申請書類は何かを確認する必要があります。取引構造と契約書、請求書、実際の業務および代金の流れが互いに一致するよう管理し、申告期限と証憑の保管も別途点検しなければなりません。',
];
const extractSection5 = (body: string): string => {
  const start = body.indexOf(section5Heading);
  const end = body.indexOf(officialSourcesHeading, start);
  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return body.slice(start, end);
};

describe('Japanese investment column 001 — company-setup basics', () => {
  it('publishes the contracted frontmatter and exactly three safe FAQs', () => {
    expect(parsed.data.title).toBe(articleTitle);
    expect(parsed.data.lastmod).toBe('2026-07-25');
    expect(parsed.data.date_display).toBe('2025年9月13日');
    expect(visibleJapaneseCount).toBe(5_847);
    expect(calculatedReadMinutes).toBe(12);
    expect(parsed.data.read_time).toBe(`約${calculatedReadMinutes}分`);
    expect(parsed.data.faq).toEqual([
      {
        q: '台湾で会社を設立する際、子会社・支店・代表者事務所はどのように異なりますか？',
        a: entityFaqAnswer,
      },
      {
        q: '会社を設立すれば、台湾の就業許可や居留資格を取得できますか？',
        a: residenceFaqAnswer,
      },
      {
        q: '就業許可と居留証を取得するには最低資本金が必要ですか？',
        a:
          '会社設立自体について一律の法定最低資本金があるわけではありません。ただし、業種別の最低資本額、事業計画の合理性、銀行審査および就業許可上の雇用主要件は別途確認が必要です。' +
          employerQualificationAnswer,
      },
    ]);

    expect(parsed.content).toContain(`# ${articleTitle}`);
    expect(post?.title).toBe(articleTitle);
    expect(post?.date).toBe('2026-07-25');
    expect(post?.dateDisplay).toBe('2025年9月13日');
    expect(post?.readTime).toBe(`約${calculatedReadMinutes}分`);
    expect(post?.faq).toEqual(parsed.data.faq);

    expect(raw).not.toContain(
      '> 外国人が台湾で会社を設立するときによくある質問',
    );
    expect(raw).not.toContain(
      '**8. 台湾の主な会社関係税率はどうなっていますか？**',
    );
  });

  it('uses the approved entity, treaty, process, residence, and tax language', () => {
    const requiredPhrases = [
      '台湾子会社（有限公司・股份有限公司）は、親会社とは別個の法人格を有し、自己の名義で契約を締結して、権利義務の主体となります。有限公司と股份有限公司のいずれを選択するかは、出資持分または株式の構成、機関設計、意思決定の仕組みおよび資金調達計画を踏まえて検討する必要があります。ただし、子会社が独立した法人であっても、すべての責任が常に子会社のみに限定されるとは限りません。保証、担保、親会社との契約、取締役の責任など、個々の法律関係も併せて確認する必要があります。',
      '外国会社の台湾支店は、外国本店が台湾で営業するための組織です。支店自体に株主を置く組織ではなく、別個の法人ではない本店の一部であるため、本店が支店の債務と責任を負います。',
      section1Paragraphs[3],
      '台湾・韓国所得税協定は2023年12月27日に発効し、2024年1月1日から適用されています。',
      '配当・利子・使用料に関する源泉地国の上限税率はそれぞれ10％です。',
      '協定上の恒久的施設（PE）',
      '管理場所・支店・事務所等の固定的施設',
      '6か月を超える工事',
      'いずれかの12か月間に合計183日を超える役務提供',
      '契約締結権限を反復して行使する代理人',
      '183日という数字だけで恒久的施設の成立や事業利得の課税の可否を判断すべきではありません。',
      section1Paragraphs[4],
      ...section2ProseParagraphs,
      '委任状その他の外国文書の公証・認証（必要に応じて台湾の在外機関による認証）',
      '経済部投資審議司への投資申請（該当する場合）',
      '国外からの投資資金送金',
      '投資額審定',
      '会社設立登記',
      '輸出入、業種別許認可、就業許可・居留等の追加手続（該当する場合）',
      ...section4Paragraphs,
      ...section3Paragraphs,
      ...section5Paragraphs,
      residenceFaqAnswer,
      '会社設立自体について一律の法定最低資本金があるわけではありません。ただし、業種別の最低資本額、事業計画の合理性、銀行審査および就業許可上の雇用主要件は別途確認が必要です。',
      employerQualificationAnswer,
      relatedGuidanceParagraph,
      disclaimerParagraph,
      authorLine,
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('bounds section 1 to seven source-ordered paragraphs and its image', () => {
    for (const body of [raw, post?.content ?? '']) {
      const section = extractSection1(body);
      const blocks = section
        .split(/\n{2,}/u)
        .map((block) => block.trim())
        .filter(Boolean);
      const prose = blocks.filter(
        (block) => !block.startsWith('#') && !block.startsWith('!['),
      );

      expect(blocks[0]).toBe(section1Heading);
      expect(prose).toEqual(section1Paragraphs);
      expect(prose).toHaveLength(7);
      for (const marker of [
        '台湾子会社（有限公司・股份有限公司）',
        '外国会社の台湾支店',
        '代表者事務所',
        '資本構成',
        '雇用関係',
        '政府調達への参加要件',
        '管理場所・支店・事務所等の固定的施設',
        '6か月を超える工事',
        '合計183日を超える役務提供',
        '契約締結権限を反復して行使する代理人',
        '183日という数字だけで',
      ]) {
        expect(section).toContain(marker);
      }
    }

    const rawSection = extractSection1(raw);
    const imageLine =
      '![](../images/001-taiwan-company-establishment-basics/img-02.jpg)';
    expect(rawSection.split(imageLine)).toHaveLength(2);
    expect(rawSection.indexOf(section1Paragraphs[6])).toBeLessThan(
      rawSection.indexOf(imageLine),
    );
  });

  it('bounds section 2 to five prose paragraphs, ten steps, and its image', () => {
    for (const body of [raw, post?.content ?? '']) {
      const section = extractSection2(body);
      const blocks = section
        .split(/\n{2,}/u)
        .map((block) => block.trim())
        .filter(Boolean);
      const prose = blocks.filter(
        (block) =>
          !block.startsWith('#') &&
          !block.startsWith('![') &&
          !/^\d+\.\s/u.test(block),
      );
      const steps = blocks.filter((block) => /^\d+\.\s/u.test(block));

      expect(blocks[0]).toBe(section2Heading);
      expect(prose).toEqual(section2ProseParagraphs);
      expect(prose).toHaveLength(5);
      expect(steps).toEqual(section2Steps);
      expect(steps).toHaveLength(10);

      for (const marker of [
        '投資者、投資額、出資対象および事業計画',
        '法人の存続証明',
        '署名権者',
        '有効期間と認証の経路',
        '実質的所有者と資金の出所',
        '投資額審定',
        '工場・製品・専門業種に関する許可',
        '契約締結日や営業開始日',
      ]) {
        expect(section).toContain(marker);
      }
    }

    const rawSection = extractSection2(raw);
    const imageLine =
      '![](../images/001-taiwan-company-establishment-basics/img-03.jpg)';
    expect(rawSection.split(imageLine)).toHaveLength(2);
    expect(rawSection.indexOf(section2ProseParagraphs[4])).toBeLessThan(
      rawSection.indexOf(imageLine),
    );
  });

  it('bounds section 3 to four source-ordered industry and location paragraphs', () => {
    for (const body of [raw, post?.content ?? '']) {
      const section = extractSection3(body);
      const blocks = section
        .split(/\n{2,}/u)
        .map((block) => block.trim())
        .filter(Boolean);
      const prose = blocks.filter(
        (block) => !block.startsWith('#') && !block.startsWith('!['),
      );

      expect(blocks[0]).toBe(section3Heading);
      expect(prose).toEqual(section3Paragraphs);
      expect(prose).toHaveLength(4);

      for (const marker of [
        '禁止・制限業種',
        '監督官庁の許可・登録または資格',
        'オンライン販売とオフライン店舗',
        '輸入と国内流通',
        '直接サービスと仲介サービス',
        '土地使用分区',
        '賃貸人の同意',
        '営業場所事前照会（營業場所預先查詢）',
        '場所の適合性を書面で確認',
      ]) {
        expect(section).toContain(marker);
      }
    }
  });

  it('bounds section 4 to two H3s and eight source-ordered status paragraphs', () => {
    for (const body of [raw, post?.content ?? '']) {
      const section = extractSection4(body);
      const blocks = section
        .split(/\n{2,}/u)
        .map((block) => block.trim())
        .filter(Boolean);
      const prose = blocks.filter(
        (block) => !block.startsWith('#') && !block.startsWith('!['),
      );

      expect(blocks[0]).toBe(section4Heading);
      expect(blocks.filter((block) => block.startsWith('### '))).toEqual(
        section4Headings,
      );
      expect(prose).toEqual(section4Paragraphs);
      expect(prose).toHaveLength(8);

      for (const marker of [
        '資本の流入',
        '従業員を指揮',
        '有効期間と更新要件',
        '資本総額の3分の1',
        '50万新台湾ドル',
        '300万新台湾ドル',
        '50万米ドル',
        '20万米ドル',
        '業種別の法令により別途資本金や保証金',
        '婚姻関係や親子関係',
        '5年連続',
        '各年183日以上',
      ]) {
        expect(section).toContain(marker);
      }
    }

    const rawSection = extractSection4(raw);
    const imageLine =
      '![](../images/001-taiwan-company-establishment-basics/img-04.jpg)';
    expect(rawSection.split(imageLine)).toHaveLength(2);
    expect(rawSection.indexOf(section4Paragraphs[7])).toBeLessThan(
      rawSection.indexOf(imageLine),
    );
  });

  it('bounds section 5 to four source-ordered tax and treaty paragraphs', () => {
    for (const body of [raw, post?.content ?? '']) {
      const section = extractSection5(body);
      const blocks = section
        .split(/\n{2,}/u)
        .map((block) => block.trim())
        .filter(Boolean);
      const prose = blocks.filter((block) => !block.startsWith('#'));

      expect(blocks[0]).toBe(section5Heading);
      expect(prose).toEqual(section5Paragraphs);
      expect(prose).toHaveLength(4);

      for (const marker of [
        '一般税率が5％',
        '一般税率は20％',
        '源泉徴収率は21％',
        '上限税率10％',
        '配当、利子、使用料または役務対価',
        '2023年12月27日',
        '2024年1月1日',
        '恒久的施設の四つの類型',
        '代理人の契約締結権限',
        '受益所有者',
        '居住者証明書',
        '申告期限と証憑の保管',
      ]) {
        expect(section).toContain(marker);
      }
    }
  });

  it('uses all eleven official links once and exactly three localized internal links', () => {
    const officialSourceSection = parsed.content
      .split(`${officialSourcesHeading}\n\n`)[1]
      ?.split(`\n\n${relatedGuidanceParagraph}`)[0];

    expect(officialSourceSection?.trim().split('\n')).toEqual(
      officialSourceLinks.map((link) => `- ${link}`),
    );
    for (const source of officialSourceUrls) {
      expect(raw.split(source)).toHaveLength(2);
    }

    const internalLinks = Array.from(
      parsed.content.matchAll(/\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[0],
    );
    expect(internalLinks).toEqual([
      '[台湾投資・会社設立サービス](/ja/services#investment)',
      '[曾雋崴弁護士のプロフィール](/ja/lawyers/wei-tseng)',
      '[ご相談・お問い合わせ](/ja/contact)',
    ]);
    expect(parsed.content).toContain(disclaimerParagraph);
    expect(parsed.content.trimEnd().endsWith(authorLine)).toBe(true);
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
      '以上が、台湾での会社設立に関する基本的な内容です。',
      '以上、台湾弁護士の曾雋崴でした。',
      '> 関連リンク:',
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

    expect(raw).toContain(
      '[台湾投資・会社設立サービス](/ja/services#investment)',
    );
    expect(raw).toContain(
      '[曾雋崴弁護士のプロフィール](/ja/lawyers/wei-tseng)',
    );
    expect(raw).toContain('[ご相談・お問い合わせ](/ja/contact)');
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
