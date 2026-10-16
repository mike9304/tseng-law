# ISSUE-20261016 local editorial review

Date: 2026-10-16, Asia/Seoul. Scope: eight issue-board manuscripts, eight generated scenes in WebP/JPEG, and the batch test. Prepared in air/issues-20261016.

Status: the original batch received local source, independent AI locale and independent AI final review. The operator's subsequent ko-01 FAIL superseded its original PASS; the ko-01 R1 correction and current review status are recorded below. This is not the operator's Claude Code shipping PASS, a human/native-speaker/lawyer certification, or a publication claim. No commit or push was performed by the drafting team or during this repair.

## Reviewed versions

| Piece | Current SHA-256 | Locale report | Final report |
| --- | --- | --- | --- |
| ko-01 | `3dca8749772e6518c30b7e52e7ed46b03f46d0463085cf75e4029e5d963aba98` | R1 locale recheck below — PASS | R1 independent AI final recheck below — PASS; Claude re-review pending |
| ko-02 | `bd7ad5ad09b1cd1ae20a719228dba02ed73979ad5dc55ca95a18b6b0d4654a55` | work/review-ko.md — PASS | work/final-ko-ja.md — PASS |
| ja-03 | `31b6cc0344bfaafdc823847991b7ca90e0f33b539036b8dcfee50dd804a6c9af` | work/review-ja.md — PASS | work/final-ko-ja.md — PASS |
| ja-04 | `96e8419877fe07f799b34002e25872ee4c269231746d390f5e4d50c25431e408` | work/review-ja.md — PASS | work/final-ko-ja.md — PASS |
| en-05 | `26cfd641504940d324b1191f1b5a6034accb900559c81394a4a8871fb1eaee85` | work/review-en.md — PASS | work/final-en-vi.md — PASS |
| en-06 | `72983a9c5c91f58ee325d78bdf4debf8c346e737d0bc694819888abc5594e892` | work/review-en.md — PASS | work/final-en-vi.md — PASS |
| vi-07 | `26b66d348a07902a196007510f3f8ab23c01534495d0b3bf8b373e555bf3b00e` | work/review-vi.md — PASS | work/final-en-vi.md — PASS |
| vi-08 | `70d1b3776d9829790c9bbb4416922015efd35757d5f24a08b476078917546abf` | work/review-vi.md — PASS | work/final-en-vi.md — PASS |

Original reports and source/media/browser evidence are outside the repo at /Users/son7/tseng-air-1011/lanes/issues/20261016/. Research, writing, locale review and final review used separate AI roles. The original final reports identify their reviewed files and hashes; the new ko-01 R1 evidence is recorded in this file.

## ko-01 R1 correction after Claude Code FAIL

Checked on 2026-10-16. All five findings were accepted, including the four NITs; no rebuttal was needed. The original ko-01 hash `fd9df5cd020526bbb77f8ffe3f3dbb424faa2769875c2348696d005b19d8a051` and its earlier PASS reports do not certify this revision.

Live source checks:

- [MOJ Civil Code Article 654](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=654), paragraph 1: 「旅客運送人對於旅客因運送所受之傷害及運送之遲到應負責任。但因旅客之過失，或其傷害係因不可抗力所致者，不在此限。」 Paragraph 2: 「運送之遲到係因不可抗力所致者，旅客運送人之責任，除另有交易習慣者外，以旅客因遲到而增加支出之必要費用為限。」 The injury exemption for force majeure does not exempt delay; paragraph 2 limits force-majeure delay liability to necessary additional expenses unless another trade usage applies.
- [Article 231(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=231): 「債務人遲延者，債權人得請求其賠償因遲延而生之損害。」 Retained for causal delay loss within Article 654's scope. [Article 230](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=230) was also opened; its general exemption has been removed from the article because it obscured the special passenger-carriage rule. MOJ's pending-effect notices concern Articles 166-1 and 1223, not these provisions.
- [Consumer Protection Act Article 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0170001&flno=43): 「企業經營者對於消費者之申訴，應於申訴之日起十五日內妥適處理之。」 The complaint channels, subsequent complaint to the local consumer-protection officer and distinction from a guaranteed refund/payment deadline remain unchanged.
- [CNA, October 15 at 14:34](https://www.cna.com.tw/news/ahel/202610150152.aspx) expressly reports unannounced cancellations, no service-reduction application, and the Taipei Motor Vehicles Office's announced NT$9,000–90,000 fine range. The no-warning wording now links here and identifies 公路局 台北區監理所.
- [CNA, October 15 at 19:30, updated 20:19](https://www.cna.com.tw/news/ahel/202610150322.aspx) supplies the October 14-to-noon October 15 total of 65, Hsinchu/Yilan services, driver shortage, apology and planned coach support. The first paragraph now says 「15일 정오까지」. No individual passenger's damages or outcome is inferred from either report.

Changed sentences and meaning:

| Before | R1 correction and reason | Meaning |
| --- | --- | --- |
| 「회사에 책임을 돌릴 수 없는 사유로 운행하지 못했다면 지체 책임을 지지 않습니다」; FAQ 2 relied on Articles 230/231. | Rebuilt the legal paragraph and FAQ 2 around Article 654(1)/(2): passenger-caused delay exception, force-majeure necessary-expense limit and trade-usage proviso; Article 231(1) addresses causal loss. References now cite Article 654 instead of 230. | Substantive correction: restores passenger protection omitted by the general-rule analysis. Driver shortage is not asserted to establish force majeure or an adjudicated liability finding. |
| Summary: 「결행 원인과 실제 추가 비용에 따라 청구 가능성이 달라집니다」 | Cause affects the recoverable scope; actual additional expenditure affects the amount claimed. | Substantive correction consistent with the new legal section and FAQ. |
| 「15일 낮까지」; no-warning wording beside the evening report; 「공로국」 alone. | 「15일 정오까지」; no-warning wording moved to the afternoon report; 「공로국(公路局) 타이베이구 감리소(台北區監理所)」. | Preserves and makes the report's time, source and speaker precise. The 65 trips and announced maximum NT$90,000 remain unchanged. |
| Test required all eight files and two per assigned locale together. | Validate every present piece against its assigned locale and ID, require at least one piece and retain global ID/slug uniqueness and every per-piece content/media/loader assertion. | Allows separate piece integration without accepting empty coverage, duplicate IDs or IDs in the wrong market. |

R1 checks:

- Independent AI Korean reviewer `/root/ko01_locale_review` did not author the repair and returned PASS on the current hash after reopening the MOJ provisions and both CNA reports. This is an AI language/source review, not a human or operator shipping approval.
- Independent AI final reviewer `/root/ko01_final_review`, also not an author, returned PASS on the same article hash after reopening the MOJ provisions, law history/commencement records and both CNA reports. The reviewer confirmed the special-rule priority, exceptions, expense limit, attribution, test assertions and audit accuracy with no remaining material findings. Test execution counts below were supplied by root; the reviewer statically inspected the test and did not repeat its execution, media, browser/build or production checks. The operator's Claude Code re-review remains pending.
- `./node_modules/.bin/vitest run src/lib/__tests__/issue-board-20261016.test.ts --no-cache`: 34 tests passed. The same suite with an in-memory `fs.readdirSync` filter exposing only ko-01 from the October 16 batch passed 6 tests; no article was moved, removed or edited for this simulation.
- Scoped ESLint with `--no-cache --max-warnings=0` and `git diff --check` passed. Body prose is 1,336 characters including spaces, excluding headings, reference list and Markdown link destinations.
- Both ko-01 image renditions are byte-identical to HEAD. WebP SHA-256: `b0422dbe882eb0e5b7f7d54e1a85e80f952de0d300df38933299253478d803ce`; JPEG: `ca727dc28bc903428babb5ceea0cfa77ed998f1739a2913ffc3253d9d1fe7846`. Alt text, caption and generated-image notice are unchanged.
- The earlier batch browser evidence below belongs to the original drafts. This bounded correction has not rerun browser/full-build or production checks and makes no deployment claim. No commit or push.

## First two paragraphs and recent same-locale comparison

These are the final first two prose paragraphs; an intervening heading is omitted here. Full sentence-level deletion tests and specific comparison findings are retained in the external draft/review reports.

### ko comparators

- `src/content/issues/ko/ISSUE-20261015-01-taiwan-kia-overseas-safety-rating-advertising.md`
- `src/content/issues/ko/ISSUE-20261015-02-taiwan-motorcycle-plate-angle-proposal-current-rules.md`
- `src/content/issues/ko/ISSUE-20261014-01-taiwan-cafe-no-ice-surcharge-price-disclosure.md`

#### ko-01

File: `src/content/issues/ko/ISSUE-20261016-01-taiwan-kuo-kuang-bus-cancellation-passenger-delay-claim.md`.

> 10월 14일부터 15일 정오까지 대만 국광버스(國光客運) 65편이 운행하지 않았다고 [중앙통신사(CNA)가 15일 보도했습니다](https://www.cna.com.tw/news/ahel/202610150322.aspx). 신주·이란 방면 등 일부 노선에서 발생한 결행입니다. 회사는 운전기사 부족을 이유로 들며 사과하고 임시 차량 투입을 추진했습니다.

> 이미 표를 산 한국인 여행객이 다른 버스나 택시로 갈아탔다면, 승차권 대금 외에 추가 교통비가 문제 될 수 있습니다. [예고 없는 결행을 다룬 오후 보도](https://www.cna.com.tw/news/ahel/202610150152.aspx)에서 공로국(公路局) 타이베이구 감리소(台北區監理所)는 최대 9만 대만달러의 과태료를 부과할 방침이라고 밝혔습니다. 감편 신청 없이 예정된 운행을 빠뜨렸다는 설명입니다. 이 과태료는 사업자에 대한 행정 제재이며, 승객의 손해배상액을 정한 결정은 아닙니다.

Retained the dated cancelled-service report, paid-ticket passenger scenario and distinction between an announced administrative fine and passenger damages. The issue is delay and additional transport expense, rather than advertising or price disclosure.

R1 independent Korean deletion check retained all seven sentences: the first paragraph separately supplies the interval/count/source, affected routes, and the company's explanation/apology/response; the second supplies the paid-ticket replacement-travel scenario, named enforcement authority/maximum fine, absent reduction application, and the administrative-fine/passenger-compensation distinction. Removing any sentence loses a fact or necessary context. The three comparators above were reread: the Kia article concerns advertising evidence despite a shared fine/compensation distinction; the motorcycle article separates proposals from current law; the cafe article compares promised and delivered service. Ko-01's headings address recoverable transport costs and complaint timing, and its ending distinguishes fare return from additional-expense compensation. No repeated checklist or promotional ending was introduced.

#### ko-02

File: `src/content/issues/ko/ISSUE-20261016-02-taiwan-nicotine-free-e-cigarette-entry-ban.md`.

> [건강의료망은 10월 14일](https://www.healthnews.com.tw/article/70014) 과일향 전자담배와 청소년 대상 마케팅을 다루며, 대만의 현행 전자담배 금지도 설명했습니다. 한국에서 쓰던 무니코틴 전자담배를 가져오는 여행자도 이 규정의 적용을 받습니다.

> 대만 [담배위해방지법 제3조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=L0070021&flno=3)는 담배 원료 이외의 재료나 담배 원료의 물리적 형태를 바꾼 재료로 만들어 담배 사용을 흉내 낼 수 있게 한 제품을 ‘유사 담배제품’으로 규정합니다. 니코틴이 없는 제품도 명시적으로 포함합니다. 판매자가 붙인 ‘무니코틴’ 표시만으로 이 범주에서 벗어나지는 않습니다. 제품의 재료와 구조, 작동 방식이 판단의 대상입니다.

Retained the recent product report and existing-law distinction, followed by the nicotine-free statutory definition. This concerns import/use rather than a proposed possession offense or narcotics.

### ja comparators

- `src/content/issues/ja/ISSUE-20261015-03-taiwan-pork-rice-ball-quarantine-declaration-japanese.md`
- `src/content/issues/ja/ISSUE-20261015-04-taiwan-public-procurement-software-origin-declarations-japanese.md`
- `src/content/issues/ja/ISSUE-20261014-04-taiwan-permit-application-delay-remedy-japanese.md`

#### ja-03

File: `src/content/issues/ja/ISSUE-20261016-03-taiwan-forklift-road-permit-japanese-factories.md`.

> 台中でフォークリフトが道路を走る動画がSNSに投稿され、警察が無許可走行の取締りについて説明しました。[中央社の2026年10月15日の報道](https://www.cna.com.tw/news/asoc/202610150199.aspx)によると、市警察第六分局は、条件を満たす機械でも所定の手続を経て臨時通行証を取得する必要があるとしています。

> 台湾の工場や倉庫を管理する日本企業が、近くの別棟へフォークリフトを移す場合も、公道に出るなら道路走行の要件が関わります。自社で日常的に使っている機械であることや、移動先が近いことだけでは、走行を認める根拠になりません。

Retained the road-use video and dated police response, followed by the Japanese factory public-road transfer scenario. Distance and ordinary ownership do not establish permission; this differs from the prior permit-delay topic.

#### ja-04

File: `src/content/issues/ja/ISSUE-20261016-04-taiwan-ceatec-sale-by-sample-quality-japanese.md`.

> 台湾エクセレンスが初出展したCEATEC 2026には、受賞企業13社の24製品が集まりました。[マイナビTECH+の10月14日付レポート](https://news.mynavi.jp/techplus/article/20261014-5126304/)は、13日の開幕に合わせた式典と、産業用機器などの展示を紹介しています。報道されたのは製品紹介の場であり、出展企業の品質不良や紛争が報じられたわけではありません。

> 日本の調達担当者が展示をきっかけに台湾の供給元へ機器を発注する場合、展示機を品質の基準にするのかが契約上の論点になります。台湾法が適用される物品売買では、見本に従って売買する合意に、民法が特別な品質保証の効果を与えています。ただし、売主が台湾企業であることだけで台湾法の適用が決まるわけではありません。台湾の[涉外民事法律適用法第20条](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20)は、当事者の法律選択を原則とし、有効な明示の選択がなければ最も密接な関係のある法律によると定めています。

Retained the exhibition facts and absence of a reported defect dispute, followed by the Japanese buyer, sample-quality agreement and governing-law condition. This differs from MOU, software-origin and acceptance-testing topics.

### en comparators

- `src/content/issues/en/ISSUE-20261015-05-taiwan-food-imports-overseas-recall-labeling.md`
- `src/content/issues/en/ISSUE-20261015-06-taiwan-hiring-public-judgments-criminal-record-data.md`
- `src/content/issues/en/ISSUE-20261014-06-taiwan-financial-agentic-ai-consultation-data-use.md`

#### en-05

File: `src/content/issues/en/ISSUE-20261016-05-taiwan-3m-private-placement-share-resale-restrictions.md`.

> Genius Electronic Optical plans to issue new common shares to 3M United Kingdom Limited as part of an optical-communications partnership, [CNA reported on October 15, 2026](https://www.cna.com.tw/news/afe/202610150092.aspx). The proposed subscription is worth approximately NT$4.81 billion and would give the 3M group a roughly 4.68% stake after completion. The report describes a board resolution to sign the subscription agreement and says customary closing conditions remain. It does not report completed share delivery.

> [Securities and Exchange Act Article 43-8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0400001&flno=43-8) restricts resale by subscribers and purchasers, subject to listed exceptions. One route permits transfers after one year and before three years from delivery to specified qualified buyers, subject to regulatory holding-period and quantity limits. Other exceptions include transfers by operation of law, limited small private transfers and regulator-approved transactions. The statute also permits resale once three years have elapsed from delivery.

Deleted the generic investor-exit setup paragraph. The first paragraph retains proposed transaction/closing conditions; the next prose paragraph now gives the delivery-based resale clock and exceptions. No reported fact or legal condition was lost.

#### en-06

File: `src/content/issues/en/ISSUE-20261016-06-taiwan-shares-offshore-collateral-pledge-creation.md`.

> Standard Chartered announced a Taiwan-securities collateral arrangement with J.P. Morgan on October 15, 2026, [CNA reported](https://www.cna.com.tw/news/afe/202610150121.aspx). The bank described a service through which international institutional investors could use Taiwan holdings to support offshore financing and derivatives while the securities remain within Taiwan's custody system. The announcement comes after [TWSE amendments effective March 30, 2026](https://twse-regulation.twse.com.tw/TW/law/DAT01.aspx?FLCODE=FL100919) added specific rules for pledged collateral.

> The offshore agreement may identify the debt or derivatives obligations being secured, but a treasury team still needs evidence of the Taiwan pledge entry. A completed book-entry operation records delivery of securities as a pledge. Listing shares in a collateral schedule does not establish that this local operation has occurred.

Retained the bank announcement and earlier commencement, followed by the distinction between an offshore obligation description and a completed Taiwan pledge entry. A generic audience bridge was removed in author review. This differs from employee-shareholding trusts and bank-AI topics.

### vi comparators

- `src/content/issues/vi/ISSUE-20261015-07-taiwan-pension-nine-percent-proposal-employer-contribution.md`
- `src/content/issues/vi/ISSUE-20261015-08-taiwan-unemployed-parents-student-living-assistance.md`
- `src/content/issues/vi/ISSUE-20261014-08-taiwan-national-day-work-holiday-pay.md`

#### vi-07

File: `src/content/issues/vi/ISSUE-20261016-07-taiwan-migrant-side-job-work-permit-penalty-proposal.md`.

> Theo [bản tin CNA đăng trên UDN ngày 15/10/2026](https://udn.com/news/story/7238/9816261), Chính phủ Đài Loan đang cân nhắc tăng mức phạt chủ thuê lao động trái phép. Nội dung được thảo luận bao gồm cả người đang làm việc hợp pháp nhưng tự nhận thêm việc ngoài phạm vi cho phép. Đây mới là hướng xem xét sửa luật, chưa phải mức phạt mới có hiệu lực.

> Với người Việt làm việc theo giấy phép do một chủ sử dụng lao động xin, việc vẫn giữ công việc chính không đồng nghĩa được tự do nhận việc nơi khác vào ngày nghỉ. Giới hạn nằm ở người sử dụng lao động và công việc được phép, không chỉ ở thời hạn ghi trên giấy.

Retained the dated proposal/current-penalty distinction and employer-specific second-job scenario. This differs from pension, holiday-pay and overstay coverage. The spouse exemption prevents a nationality-wide rule.

#### vi-08

File: `src/content/issues/vi/ISSUE-20261016-08-taiwan-vietnam-remittance-license-cash-exchange-robbery.md`.

> Hai người chăm sóc mang quốc tịch Việt Nam bị mất tổng cộng 220.000 Đài tệ tại các cuộc hẹn đổi tiền hồi tháng 7, theo cáo buộc được [CNA đưa tin ngày 15/10/2026](https://www.cna.com.tw/news/asoc/202610150150.aspx). Viện kiểm sát Gia Nghĩa đã truy tố một người đàn ông về hành vi cướp liên quan đến các cuộc hẹn này. Bản tin nói về việc truy tố, chưa phải bản án kết tội.

> [Điều 29 Luật Ngân hàng Đài Loan (銀行法)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=29&pcode=G0380001) cấm tổ chức, cá nhân không phải ngân hàng kinh doanh dịch vụ chuyển tiền trong và ngoài nước, trừ trường hợp pháp luật cho phép. Điều này điều chỉnh bên kinh doanh dịch vụ; không thể chỉ từ đó kết luận khách gửi tiền đã phạm tội.

Retained the indictment, alleged July events and total loss, followed by the operator-focused Banking Act rule. A generic exchange-rate bridge was deleted in author review. This is licensed wage remittance, not a generic robbery-recovery checklist.

## Changed wording and legal meaning

| Piece | Before | Repair and reason | Meaning |
| --- | --- | --- | --- |
| ja-03 | 「適法な自動車修理事業者が発行した4か月以内の整備記録や検査合格証明」 | 「適法な自動車修理事業者が発行した4か月以内の整備記録と、所定の機関による検査合格証明」 separates document issuers. | Article 83-1 issuer ambiguity corrected; eligibility, distance, timing and penalties preserved. |
| en-05 | Paragraph beginning “A foreign corporate investor negotiating this type of subscription…” | Deleted as repetitive generic setup. | News facts, periods, exceptions and substantive commercial analysis preserved. |
| en-05 | Company must “respond to reasonable requests” | Company must provide the specified information on reasonable requests from Article 43-6(1)(2) persons before completion. | Substantive duty-strength clarification: merely responding is insufficient. |
| en-06 | General Article 30-3 realization routes; then broadly described pledgee “applications” | Removed general routes and specified applications for book-entry operations concerning received collateral under TWSE Article 18-1. | Substantive scope clarification; no general restriction on every possible application or offshore enforcement guarantee. |
| vi-07 | “chủ cũ đã đồng ý” | “chủ hiện tại đã đồng ý” identifies the still-current employer. | Meaning-preserving clarification of the second-job scenario. |

The original batch's repaired passages were rechecked by independent locale reviewers and received independent final review. Author reports retain those drafting changes. The subsequent ko-01 FAIL and R1 correction supersede its original review; use the R1 status above for its current hash. Separate operator Claude shipping review remains required.

## Sources, media and checks

- Every piece begins with an opened October 14 or 15 news report and links to verified MOJ LawSingle articles. External SOURCES.md maps URLs to claims and records source-version limits. No judgment or case number was invented; vi-08 concerns an indictment.
- Eight different fictional scenes were generated with the built-in image tool, without text, logos or identifiable people. WebP and JPEG renditions share the same original. Prompts, original/output hashes and dimensions are in work/media-manifest.json. Root inspected each scene and the contact sheet. Generated-media notices are preserved; ko/ja/en have a short body notice because their current renderer does not display the caption field.
- Required Vitest command ran the new 20261016 suite plus 20261002 and 20260930: 3 files, 97 tests passed (34 new, 17 October 2, 46 September 30). Final log: work/tests-final.log. Earlier test files are unchanged.
- Actual Chrome preview: all eight article URLs at 390px and 1653px; expected headings, loaded 1536px hero sources, three FAQs, law links and no horizontal document overflow. All four indexes contain two new locale-specific links. Existing ja/en index CSS hides card-image nodes; this is not a failed article hero load. Root inspected all mobile layouts and representative desktop layouts; screenshots/DOM records are in work/.
- Preview-generated tsconfig.json and next-env.d.ts changes were restored to saved baseline bytes after stopping the owned dev server. No renderer, existing article, prior test or deployment setting is included in this batch.
- Local draft readiness does not establish production/static build success, deployment, public readback or operator Claude approval.
