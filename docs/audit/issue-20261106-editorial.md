# ISSUE-20261106 editorial and verification record

Date: 2026-11-06 (Asia/Seoul). Branch: `air/issues-20261106`. Baseline HEAD: `e2b0a8ec8340634fceb1625aa2c4d137e9d3d977`.

Eight distinct original issue articles, two each for Korea, Japan, English-speaking readers and Vietnam. This record concerns local preparation. Separate AI locale and final-source reviews passed at the hashes below. They do not constitute the operator’s required Claude Code review, human/native-speaker or lawyer review, publication or deployment approval. No staging, commit, push or canonical-checkout edit was performed.

The table and batch evidence below preserve the initial snapshot. The KO01 round-1 repair record at the end supersedes its original manuscript hash and review status; earlier external source/review records were not rewritten by this bounded repair.

## Frozen manuscripts

| Piece | File | Narrative length | SHA-256 |
| --- | --- | ---: | --- |
| ko-01 | `src/content/issues/ko/ISSUE-20261106-01-taiwan-hsr-delay-refund-onward-flight-loss.md` | 969 | `737bdd523ee05d7a364c4787f980b6be5dadba6165c4b4a08b0cec6b9b738ab5` |
| ko-02 | `src/content/issues/ko/ISSUE-20261106-02-taiwan-referral-cashback-multilevel-marketing-filing.md` | 1100 | `759ee70993b3edb628936fb4f58c663b378a48318264c89bfa2161d0b505a486` |
| ja-03 | `src/content/issues/ja/ISSUE-20261106-03-taiwan-japanese-retail-qr-code-product-labels.md` | 902 | `8d8cd93648a843bd679b4b381b02c297265838fd340b942934579631c9124afb` |
| ja-04 | `src/content/issues/ja/ISSUE-20261106-04-taiwan-rail-inspection-false-business-electronic-records.md` | 931 | `7bcf2bd43cac3cfd88720f4c4862294111f2bd544128a5bbd31b2fef293ed977` |
| en-05 | `src/content/issues/en/ISSUE-20261106-05-taiwan-sinopac-unauthorized-bank-transfer-consumer-complaint.md` | 506 | `8f26bad0ff13fbe809bb16524c9c5615fca639dfe72b5ac847ce7822fea368cb` |
| en-06 | `src/content/issues/en/ISSUE-20261106-06-taiwan-investor-meeting-material-information-trading-ban.md` | 513 | `3b41c5eee3e602b44f83c376fe28bb071fcc66692820e2829448422dadedddea` |
| vi-07 | `src/content/issues/vi/ISSUE-20261106-07-taiwan-police-roadside-identity-check-three-hours.md` | 526 | `6243395ed650c221308957e68764c495a5f4c1b5344978dea9c16b667883da51` |
| vi-08 | `src/content/issues/vi/ISSUE-20261106-08-taiwan-dengue-student-health-investigation-school-housing.md` | 517 | `7e14de891b968fb9f7baa247d96a59516751868a423fba1f755e321090c9e4b7` |

Korean counts include normalized spaces; Japanese counts exclude whitespace; English and Vietnamese counts use whitespace units. YAML, headings, link destinations, sources and information footers are excluded. Vietnamese units are an editorial length measure, not linguistic equivalence to English words.

## Opening review and deletion tests

### ko-01

> 대만 고속철도 판차오역의 분기기 신호 이상으로 11월 5일 일부 열차가 지연됐습니다. [연합보의 당일 보도](https://udn.com/news/story/7266/9858728)는 회사가 평균 지연을 30분 이내로 예상했다며, 이후 복구 소식도 전했습니다. 개별 열차의 실제 지연시간은 따로 봅니다.

> 한국행 항공편에 맞춰 공항으로 가던 승객이라면 열차표 외에 새 항공권 비용도 문제입니다. 어디까지 청구할 수 있을까요?

The first paragraph supplies the dated signal fault, the attributed average-delay estimate and its difference from actual arrival delay. The second identifies the Korean onward-flight expense and asks the recovery question. Removing those factual or reader-scope sentences loses context; there is no generic article preview.

### ko-02

> 캐시백을 내세운 쇼핑몰에도 대만 다단계판매법이 적용될까요? 공평교역위원회는 [11월 4일 발표](https://www.ftc.gov.tw/internet/main/doc/docDetail.aspx?uid=126&docid=18521&mid=126)에서 쇼핑몰 ‘XTurn’ 운영사의 다단계판매 사전 신고 누락을 제재했다고 밝혔습니다. 과태료는 10만 대만달러입니다.

> 위원회가 주목한 것은 회원 등급과 보상 방식입니다. 회원이 일정 조건을 채우면 상위 등급으로 올라가고, 간접 소개 수당과 팀 실적에 따른 수당 등이 여러 단계에 걸쳐 지급되는 구조였다고 설명했습니다. 한국 온라인 판매자가 대만 시장에서 추천 보상을 설계할 때도 이 지점이 법적 쟁점이 됩니다.

The opening asks whether a cashback shop falls within the MLM regime, then gives the actual sanction and amount. The next paragraph supplies the hierarchy/reward facts and Korean seller application. The reviewer recorded its initial attribution sentence as an optional economy-of-expression NIT; it was not represented as a legal defect.

### ja-03

> 日本の雑貨ブランド3COINSが、台湾で2店目を開きました。[NOWnewsの報道](https://www.nownews.com/amp/news/6889367)によると、出店先は台北の誠品生活南西で、カードの収納用品や展示用ラックなども並びました。開業日は11月5日です。報道に表示違反の指摘はありません。

> 台湾で雑貨を扱う日本企業が、日本向けの包装を生かし、QRコードの先に中国語の説明を置く場合、それだけで足りるのでしょうか。商品の表示は、読む内容だけでなく、どこに置くかも法律で定められています。

The opening supplies the second Taiwan store, location, reported products and opening date, while expressly avoiding a compliance allegation. The next paragraph poses the package/QR question and physical-location issue. The generic summary preview was deleted; dates, product scope and exceptions remain.

### ja-04

> 台湾高速鉄道（高鉄）で、雲林区間の夜間巡回点検の記録に虚偽の記載が見つかりました。[中央社の報道](https://www.cna.com.tw/news/ahel/202611040162.aspx)では、同社が社用車の位置情報と作業記録の食い違いを調べ、関係する従業員8人が退職したと説明しています。

> 会社は、再検査の結果が安全基準を満たしたとも説明しました。判決の報道ではありません。事故が起きていなければ、虚偽の記録は社内処分だけで終わるのでしょうか。

The two paragraphs distinguish reported record discrepancies and employee departures from the company safety statement and the absence of a conviction report. The reader question asks whether absence of an accident ends the issue. The review clarified the person whose liability is assessed, preserving knowledge and potential-harm conditions.

### en-05

> If a Taiwan bank rejects a complaint about an unauthorized transfer, when can the customer seek an outside review? [CNA reported on November 4](https://focustaiwan.tw/society/202611040022) that Bank SinoPac said it had reimbursed all customers affected by the previous day’s unauthorized transactions. The bank attributed the incident to a breach involving suppliers of its mobile banking system. It also said it had found no evidence of a customer-data leak.

> For a resident whose own disputed debit remains unresolved, the relevant dates are when the bank received the complaint and when its answer reached the customer.

The question identifies an unresolved unauthorized-debit complaint; the attributed news describes this bank’s reimbursement and investigation claims. The next paragraph isolates complaint receipt and response receipt as the relevant dates for a different unresolved account. Neither paragraph invents an affected foreign customer.

### en-06

> For investors meeting a Taiwan-listed company, the statutory trading restriction can continue for [18 hours after material information is publicly disclosed](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0400001&flno=157-1).

> On November 4, the Taiwan Stock Exchange and Bloomberg signed a cooperation agreement aimed at improving Taiwan companies’ international visibility and foreign investors’ understanding of their businesses, [CNA reported](https://focustaiwan.tw/business/202611040019). The planned program includes tools for investor-relations teams to identify and engage potential investors. Research coverage remains subject to Bloomberg Intelligence’s own criteria.

The legal-rule opening states the post-disclosure waiting period. The next paragraph supplies the dated MOU, investor-contact purpose and research-coverage qualification. The body retains the statutory recipient, actual-knowledge, precision, materiality, securities and disclosure conditions; the news is not called an amendment or misconduct.

### vi-07

> Ba lao động Việt Nam được cảnh sát Cao Hùng chuyển cho Sở Di dân sau một lần dừng ô tô, theo [Liên hợp báo ngày 5 tháng 11 năm 2026](https://udn.com/news/story/7320/9858796). Bản tin dẫn thông tin cảnh sát: xe bất ngờ tăng tốc khi gặp xe tuần tra, một người chạy khỏi xe sau khi bị chặn. Cảnh sát xác định cả ba thuộc diện lao động mất liên lạc.

> Người đi cùng xe cũng có thể bị hỏi giấy tờ. Vậy lúc nào việc kiểm tra danh tính có thể chuyển từ bên đường về đồn?

The opening supplies the reported stop, police account and immigration referral without private identifiers. The following paragraph turns to a passenger’s identity check and conditional station transfer. Repairs clarify the modifier on inability to verify, without changing stop grounds, the clock or notification duties.

### vi-08

> Nếu mắc sốt xuất huyết ở Đài Loan, sinh viên có mất chỗ học hoặc chỗ ở không? [Tự do Thời báo ngày 30 tháng 10 năm 2026](https://health.ltn.com.tw/article/breakingnews/5623912) đưa tin Cao Hùng ghi nhận thêm ba trường hợp nhiễm bệnh ở nước ngoài, trong đó có một sinh viên Việt Nam. [Thông báo của Sở Y tế Cao Hùng](https://health.kcg.gov.tw/News_Content.aspx?n=A354A5298C8A4AA8&s=CBE6B25C23682914&sms=26BD5515159837CE) cho biết lực lượng phòng dịch đã điều tra dịch tễ, mở rộng lấy mẫu máu những người tiếp xúc và xử lý nơi muỗi sinh sản.

> Thông báo kêu gọi trường học và nơi thực tập hỗ trợ theo dõi sức khỏe, tiếp cận khám chữa bệnh. Bản tin không nói sinh viên này bị buộc thôi học hay rời chỗ ở.

The opening identifies the schooling/housing question and the actual imported-case news; the next paragraph distinguishes requested institutional support from any reported expulsion or eviction. No such treatment is invented. The FAQ grammar repair preserves both patient protection and the competent-authority exception.

Batch opening mix: four concrete news/event openings (KO01, JA03, JA04, VI07), three news-linked reader questions (KO02, EN05, VI08), and one statutory-rule opening (EN06). No stock invented-scenario opener; no single type exceeds half of the batch.

## Three recent same-language comparators

Repository publication metadata was used, with reverse filename for same-day ties. Filename dates alone are insufficient because some earlier IDs have later publication dates. Live publication order was not independently observed. Review reports record the concrete differences in openings, headings and endings.

### ko

- `src/content/issues/ko/ISSUE-20261105-02-kl-18-extraterritorial-fraud-korean.md` — 2026-11-05: 외국에서 사기 사건으로 처벌받아도 대만에서 다시 재판받을 수 있나요?
- `src/content/issues/ko/ISSUE-20261103-10-taiwan-proxy-surgery-investigation-informed-consent.md` — 2026-11-05: 대만에서 대리수술이 의심되면 동의서와 의료진 자격을 어떻게 확인하나요?
- `src/content/issues/ko/ISSUE-20261103-01-ruifang-taxi-japanese-passenger-compensation-korean.md` — 2026-11-05: 대만 택시에서 다치면 어느 보험사와 누구에게 배상을 청구하나요?

### ja

- `src/content/issues/ja/ISSUE-20261105-43-hukou-factory-neighbor-damage.md` — 2026-11-05: 台湾の日系工場の火災で近隣の窓が割れたら、修理費はどう請求できますか
- `src/content/issues/ja/ISSUE-20261103-02-ruifang-taxi-japanese-passenger-compensation-japanese.md` — 2026-11-05: 台湾のタクシーでけがをしたら、誰に保険や賠償を請求できますか？
- `src/content/issues/ja/ISSUE-20261103-87-taiwan-stock-lending-fee-tax-japanese-residents.md` — 2026-11-03: 台湾株を貸して受け取る借券費用、税金はどう扱われるのか

### en

- `src/content/issues/en/ISSUE-20261105-42-taiwan-factory-injury-medical-form.md` — 2026-11-05: Injured at a Taiwan factory and still waiting for the employer's medical form?
- `src/content/issues/en/ISSUE-20261105-01-family-office-outside-kaohsiung-english.md` — 2026-11-05: What should a Taiwan bank’s family-office agreement cover?
- `src/content/issues/en/ISSUE-20261103-88-heirs-transfer-taiwan-listed-shares-deceased-relative.md` — 2026-11-03: A relative died holding Taiwan-listed shares. How do the heirs get them out?

### vi

- `src/content/issues/vi/ISSUE-20261105-41-vietnamese-skilled-worker-permanent-residence.md` — 2026-11-05: Người Việt chuyển sang diện nhân lực kỹ thuật xin thường trú: năm nào được tính, giấy tờ nào chứng minh tự lập?
- `src/content/issues/vi/ISSUE-20261105-02-kl-18-extraterritorial-fraud-vietnamese.md` — 2026-11-05: Đã bị xét xử về lừa đảo ở nước ngoài, có thể bị xử tiếp tại Đài Loan không?
- `src/content/issues/vi/ISSUE-20261105-01-family-office-outside-kaohsiung-vietnamese.md` — 2026-11-05: Hợp đồng tư vấn gia sản với ngân hàng Đài Loan cần ghi những gì?

The new endings stay with itinerary evidence, commission calculations, actual package labels, record/version evidence, disputed bank entries, investor-meeting timestamps, identity-check chronology and public-health notices. They do not copy the comparison articles’ consultation endings. All legal obligations, exceptions, dates and source attribution were preserved during voice edits.

## Bounded repairs and meaning preservation

| Piece | Original issue | Repair | Preserved meaning |
| --- | --- | --- | --- |
| KO02 | Alt described a dark laptop screen though the laptop was closed. | `꺼진 화면의 노트북` → `닫힌 노트북`. | Image accuracy only; article untouched. |
| JA03 | Summary preview and unclear Article 11 sentence subject. | Removed the preview; made Article 11 the grammatical subject. | Chinese-primary rule, permitted foreign-language supplementation and exceptions retained. |
| JA04 | Summary preview and ambiguity about who was assessing liability. | Direct legal summary; `担当する人も` → `担当する人についても`. | Knowledge, business-document connection, potential harm and no-conviction boundary retained. |
| VI07 | `rõ ràng` could modify documents instead of inability to verify identity. | Reordered three sentence spans in summary, FAQ and body. | Conditional station transfer, three hours from stop, resistance and notification rules retained. |
| VI08 | Nonparallel exclusion/prohibition wording in FAQ3. | Made schooling/residence exclusion and other unfair treatment parallel. | Competent-authority disease-control exception unchanged. |

Authors independently reconstructed the pre-repair hashes by reversing only requested substitutions for JA/VI. Reviewers then read the final versions. Optional NITs were not treated as additional repair requirements. English had no required locale repair.

## Checks, media and evidence limits

- Requested three Vitest files: 80/80 tests pass. The two older batch tests remain unchanged.
- All eight full sentence-variety checks: zero FAIL. KO/JA register-percentage advisories were manually examined; consistent 합니다/です・ます was retained.
- Section 5 manual checks cover short sentences, varied paragraph starts, citation rhythm, bounded contrast, specific endings and preservation of legal strength.
- Eight separately generated fictional editorial scenes; 16 WebP/JPEG assets, each 1536×1024, decoded and visually matched to alt text. No identifiable people, readable text or logos. Source PNGs, exact prompts and asset hashes are retained externally.
- The current issue detail component renders frontmatter captions for every locale. Media notices are in that field without duplicate body captions; internal author metadata is retained without public writer attribution.
- All 57 cited URLs are reconciled to the external source ledger. All article news predates November 6; no judgment is cited. MOJ displayed an October 30 consolidation cutoff; histories/commencement were checked separately. Direct HTTPS fallback and the Article 6 cached-page cross-check are documented.
- No full build, browser/device QA, public readback, deployment, or Claude Code shipping verdict is claimed.

External evidence directory: `/Users/son7/tseng-air-1011/lanes/issues/20261106/work`. Reports: `review-ko.md`, `review-ja.md`, `review-en.md`, `review-vi.md`, `final-ko-ja.md`, `final-en-vi.md`; author/research records, `image-generation.json`, `verification.json`, `variety.txt` and `tests-final.log`. The lane-level `SOURCES.md` lists each source and the exact proposition it supports.

## KO01 round-1 repair — 2026-11-06

Scope: the supplied MAJOR finding at manuscript line 43. Repair baseline HEAD: `c4756789796896715ba3115ba55fac8e094a61f6`. Only the KO01 manuscript and this audit record were edited by the repairer. The paired images and batch test file were retained unchanged. No staging, commit, push or deployment was performed by the repairer; the shared worktree HEAD advanced independently during verification.

Original manuscript SHA-256: `737bdd523ee05d7a364c4787f980b6be5dadba6165c4b4a08b0cec6b9b738ab5`.
Repaired manuscript SHA-256: `7504bb07b343ae7fe38078e5d071d555e28801bae8795445047ef2ffeedae25f`. Narrative length: 1,065 characters, using the convention above.

Original sentence, with link markup omitted:

> 민법상 지연책임을 묻는다면 제230조의 귀책사유와 제231조의 지연으로 생긴 손해라는 요건을 따져야 합니다.

Replacement, with link markup omitted:

> 여객운송의 지연책임에는 민법 제654조의 별도 규정이 있고, 철도 지연에는 철로법 제46조가 우선 적용됩니다. 회사에 귀책사유가 없다는 이유만으로 배상책임이 모두 사라지는 것은 아닙니다. 추가 항공권 비용은 민법 제231조 제1항에 따라 지연 때문에 생긴 손해인지 따져야 합니다.

This is a substantive legal-scope correction. The original sentence improperly presented the general Article 230 attribution requirement without the passenger-carriage regime. [Civil Code Article 654](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=654) separately addresses passenger delay, and [Railway Act Article 46](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0030001&flno=46) supplies the railway-specific rules, including necessary additional expenses for force-majeure delay and claims above the compensation schedule under other laws. [Article 231(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=231) supports the delay-loss inquiry; the existing [Article 216](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=216) explanation and the denial of automatic airfare reimbursement remain verbatim. Article 654 is linked both inline and in the reference list; both Article 230 citations were removed. No rebuttal was warranted.

The repairer personally reopened the MOJ provisions and all three cited law histories. MOJ displayed a 2026-10-30 consolidation cutoff; the Civil Code's pending Articles 166-1 and 1223 do not affect these provisions. The [Railway Transportation Regulations Article 21](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0030004) was verified in the official full text after a single-article tool error. The [THSRC current-version landing page](https://www.thsrc.com.tw/ArticleContent/7de57796-db08-4d94-b183-bd62618859db) still identifies the 2026-03-30 contract; its Articles 8 and 28 support the preserved arrival-time, refund-rate and ticket-category statements. The [November 5 UDN report](https://udn.com/news/story/7266/9858728), including its 11:20 restoration update, was opened and independently read through direct HTTPS. No news claim or refund threshold was changed.

Verification and review:

- Exact replacement comparison against the repair baseline passed: only manuscript lines 43 and 53 changed. Frontmatter, FAQ, the Article 216 explanation, the opening, the evidence paragraph, and every source other than the requested Article 230-to-654 substitution were preserved.
- The variety checker required explicit `--lang ko`; the initial language-autodetection error was not counted as a pass. The successful run measured 24 sentences, CV 0.453, short sentences 16.7%, and zero FAIL. The 96% 합니다체-ending advisory was manually considered; sentence lengths and structures vary without changing the register.
- Section 5 self-check completed: short sentences remain, paragraph starts and citation placement vary, the opening gives dated news and distinguishes estimated average delay from individual arrival delay, and the ending stays with itinerary and expense evidence. The three Korean comparator files listed above were reread for their openings, headings and endings; no new stock introduction or consultation ending was introduced. Their live publication order was not rechecked.
- Cache-free programmatic Vitest: `issue-board-20261106.test.ts` passed 17/17. The additional `no-ai-labels-20261024.test.ts` passed 2/4 and failed 2/4 on existing EN05/EN06 and VI07/VI08 image captions. Each reported caption is identical to the repair baseline; none is in KO01 or this repair's editable scope. Combined result: 19 passed, 2 failed. The KO01 markup, metadata and caption checks passed. The global guard is not claimed green.
- A separate `tseng-editor-final` agent, which did not author the repair, returned PASS for the amended paragraph, source pairing and affected conclusions at the repaired hash above. It independently checked the MOJ provisions/history and Korean wording. This is a bounded AI readback, not a new Claude Code, human or lawyer review or a whole-batch approval.
- Both media hashes and the existing batch-test hash match the repair baseline. Scoped `git diff --check` passed. No build, browser/device QA or publication was performed; the repaired manuscript is returned for the requested review process.
