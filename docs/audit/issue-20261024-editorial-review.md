# ISSUE-20261024 — editorial and source-review audit

Prepared 2026-10-24 (Asia/Seoul) for eight short issue-board posts in KO, JA, EN and VI. Scope is drafting, local source/editorial review and package validation. The operator's separate Claude Code review still gates shipping. No staging, commit, push, build, browser-rendering or deployment result is claimed.

Rules applied: the lane `RULES.md`; repository `AGENTS.md`, `docs/columns/EDITORIAL-VOICE.md` and `FRONTMATTER.md`; shared `SENTENCE-VARIETY-RULE.md`, `LESSONS.md` and `COLUMN-VOICE-RULE.md`; and the tseng-law-editorial review criteria. The previous October 2 rejection report was read for citation accuracy, dates, qualification preservation in FAQs, overbroad summaries, internal-note leaks and unnatural checklist prose. Current user instructions govern public authorship and retire automatic Fable gates.

Four locale authors were followed by four independent locale reviewers and four fresh independent final reviewers. They are model-based reviews; no human-native, attorney or Claude Code certification is asserted. Detailed opened-source records, author changes, reviewer findings and repair rechecks are retained in `/Users/son7/tseng-air-1011/lanes/issues/20261024/work/`. The source ledger is `../SOURCES.md` relative to that work directory. Root read the actual final openings, review reports and validation outputs.

## Frozen review versions

At the original batch freeze, all eight versions received locale PASS and independent final PASS. EN06 and VI07 have superseding repair addenda in their locale reports; earlier REQUEST_CHANGES entries remain as review history. The ko-01 row and opening below now reflect its Claude Code round-1 repair; its superseding checks are recorded in the addendum at the end. Other rows preserve the original batch review versions and do not certify subsequent concurrent repairs.

| Piece | Article | SHA-256 | Locale / final |
|---|---|---|---|
| ko-01 | `src/content/issues/ko/ISSUE-20261024-01-taiwan-seoul-illustration-fair-typhoon-booth-fee.md` | `c1422d65d1fe6db74521cc6b347ef0d00238dfb975c421c9be24e8d32e6a4a0e` | R1 PASS / PASS; Claude Code re-review pending |
| ko-02 | `src/content/issues/ko/ISSUE-20261024-02-taiwan-typhoon-house-tax-damage-area-relief.md` | `4e531ae2be96732612fa2162e74a2de5c9d28101507b4feff4e05ec8c5d58f22` | PASS / PASS |
| ja-03 | `src/content/issues/ja/ISSUE-20261024-03-taiwan-chiikawa-cargo-customs-declarations.md` | `81f94ead96ea4f2f1330998d02849c79f607c938cad3107cc5b61147b98c468d` | PASS / PASS |
| ja-04 | `src/content/issues/ja/ISSUE-20261024-04-taiwan-medical-advertising-social-media-fertility-event.md` | `d0334a638f4312db64977414663536ca40699e08a13a4f2eb02f1a9aeaf807ba` | PASS / PASS |
| en-05 | `src/content/issues/en/ISSUE-20261024-05-taiwan-tisa-tax-deduction-proposal-foreign-residents.md` | `9740be243e0084896dfe145d7da2b7c7b3af1473a026315e38722f89345251cc` | PASS / PASS |
| en-06 | `src/content/issues/en/ISSUE-20261024-06-taiwan-typhoon-champi-insurance-notice-payment.md` | `360d389ebcc86253d87d42198e2001aae414e09b142b9504f351772a9c85e9d9` | PASS / PASS |
| vi-07 | `src/content/issues/vi/ISSUE-20261024-07-taiwan-outdoor-worker-heat-protection.md` | `0a43663b56f795a0d0cd040d2f6f11476c093c9b66747363e80dd202e027ae38` | PASS / PASS |
| vi-08 | `src/content/issues/vi/ISSUE-20261024-08-taiwan-prepaid-sim-transfer-online-romance.md` | `710581341d1653c097c40b436677383a883704ea2b24f33a444a02199ebf71fa` | PASS / PASS |

## Actual first two prose paragraphs and deletion tests

The following are the reviewed paragraphs, with link labels preserved and link destinations omitted for readability. The ko-01 quotation is updated for round 1; the other quotations retain the original freeze. Headings and image captions are not counted as prose paragraphs. The detailed sentence-level tests are in the locale reports and the ko-01 addendum.

### ko-01

Paragraph 1:

> 한국 작가가 160명 넘게 참여하는 서일페 인 타이베이(SIF in Taipei)가 태풍으로 휴장 일정을 알렸습니다. 행사 소개 기사에 실린 원래 일정은 10월 23일부터 26일까지 나흘입니다. 주최 측은 10월 22일 공지에서 다음 날인 23일 하루 전시를 쉬겠다고 했습니다. 23일 추가 공지에서는 24일도 휴장한다고 밝혔습니다.

Paragraph 2:

> 추가 공지는 태풍으로 입장권을 취소하는 관람객에게 수수료 없이 전액 환불하겠다고 안내했습니다. 환불 절차는 예매처에 따릅니다. 부스 참가비도 전액 환불일까요? 공지에는 부스 참가비에 관한 약속이 없습니다.

The opening identifies more than 160 Korean exhibitors and the event's Korean name, the original four-day schedule, the October 22 notice announcing October 23 closure, and the October 23 notice adding October 24 closure. Each sentence adds a separate fact. The second paragraph preserves ticket-refund scope, platform procedure, the exhibitor's refund question and the absence of any booth-fee promise in the notices. Deleting these loses facts or the concrete contract problem; retain.

### ko-02

Paragraph 1:

> 대만 주택세의 재해 감면은 건물 전체에서 훼손된 면적이 차지하는 비율을 봅니다. 중앙사는 10월 22일 재정부가 태풍과 호우 피해 납세자의 세금 감면 신청을 지원한다고 보도했습니다. 주택세도 안내 대상에 들어갑니다.

Paragraph 2:

> 주택세조례 제15조 제1항 제7호는 중대한 재해로 훼손된 면적이 건물 전체의 50% 이상이고, 수리해야 사용할 수 있는 사유 건물을 대상으로 합니다. 이때 주택세가 면제됩니다.

The opening identifies whole-building damaged area and the dated multi-tax news. The next prose paragraph supplies the cumulative 50-percent, repair-before-use and private-building conditions and the exemption effect. Generic relevance/preview language was removed before freeze; retain the remaining facts and conditions.

### ja-03

Paragraph 1:

> 「家庭用品」と申告されたコンテナから、知的財産権侵害が疑われる「ちいかわ」などの箸置きが見つかったと、フォーカス台湾が10月22日に報じました。検査自体は7月15日です。台湾の保安警察第三総隊が今回その結果を公表し、事件を高雄税関へ移送したという内容です。

Paragraph 2:

> 台湾法人の仕入伝票に「雑貨」としか書かれていなければ、日本本社の担当者は、個々の商品と申告内容を照合できるでしょうか。

The first paragraph preserves the declared goods, suspected infringement, July inspection versus October announcement and referral. The second asks a specific item-matching question for Japanese headquarters. A generic market-relevance preview was replaced; retain the final concrete question.

### ja-04

Paragraph 1:

> 交流会の案内に体外受精の紹介を添えたら、医療広告になるのでしょうか。中央社の10月23日付記事は、高雄市衛生局が、生殖医療に関するSNS動画を投稿した人物に20万台湾ドルの過料を科したと伝えています。処分は前日に行われました。

Paragraph 2:

> 動画はファン交流会への参加を呼びかけ、生殖補助医療に触れる説明や体外受精を表すタグを含んでいたという内容です。投稿者は医師ではありません。医療機関にも当たらず、当局は違法な医療広告と判断しました。

The first paragraph supplies a specific invitation/medical-advertising question, reported amount and publication/disposition dates. The second supplies the content and advertiser-status facts behind the reported decision. A generic relevance sentence was removed; retain the factual opening.

### en-05

Paragraph 1:

> NT$24,000 is the proposed annual ceiling for a TISA contribution deduction in Taiwan. Legislation is still required. CNA reported on October 22 that the Cabinet had endorsed tax incentives for the Taiwan Individual Savings Account and asked regulators to prepare an amendment.

Paragraph 2:

> Under the Financial Supervisory Commission’s outline, the proposed allowance would cover contributions invested in selected TISA funds, up to the annual limit for each taxpayer, spouse and dependent minor child. It would reduce income used to calculate tax. The announced amount is not a promise of an equivalent tax refund.

The opening supplies the proposed ceiling, pending-law status and dated Cabinet news. The second supplies selected funds, covered family categories and deduction-versus-refund meaning. Each sentence has a factual or conditional role; retain.

### en-06

Paragraph 1:

> After Taiwan issued a land warning for Typhoon Champi, financial regulators asked insurers to identify policyholders’ losses and process claims promptly under their contracts. CNA reported the request on October 22, alongside insurers’ announcements of expedited claims services and other assistance.

Paragraph 2:

> Coverage still depends on the policy. The Financial Supervisory Commission’s release says ordinary vehicle damage insurance in classes A, B and C does not cover typhoon or flood damage without the relevant additional cover. It also distinguishes basic residential typhoon and flood compensation from additional protection. Its request for faster service does not expand what every policy insures.

The structure-preview sentence was deleted. The final first paragraph retains the warning, regulator request, date and contractual limit; the second explains actual coverage distinctions. Deleting either would remove the news trigger or conditions needed before the deadline discussion.

### vi-07

Paragraph 1:

> Công ty chỉ phát nước uống, người làm ngoài trời đã được bảo vệ đủ theo luật Đài Loan chưa?

Paragraph 2:

> CNA ngày 22/10/2026 đưa tin Tổng thống Đài Loan yêu cầu tăng cường phân cấp rủi ro nhiệt, làm mát và nghỉ ngơi cho người làm việc ngoài trời. Đây là hướng hoàn thiện chính sách. Với lao động Việt Nam tại công trường hoặc làm đường, những nghĩa vụ đang có hiệu lực vẫn là căn cứ để xem cách tổ chức một ca làm.

The first paragraph tests the concrete water-only practice. The second supplies the dated policy direction, its status and the Vietnamese outdoor-worker decision. It does not announce new operative rights or invent a client; retain.

### vi-08

Paragraph 1:

> 10.000 Đài tệ là khoản tiền một người ở Bình Đông bị yêu cầu nộp để mở lại số điện thoại, theo Lai Media ngày 21/10/2026. Nhân viên ngân hàng gọi cảnh sát đến giải thích dấu hiệu lừa đảo. Ông đã bỏ ý định rút tiền.

Paragraph 2:

> Trước đó, người quen trên mạng nhờ ông đăng ký và gửi SIM trả trước. Bài báo chỉ ghi người này tự nhận là người Việt Nam, không xác minh danh tính hay quốc tịch. Căn cứ ngừng dịch vụ không được nêu.

The first paragraph supplies the reported amount, bank/police intervention and abandoned withdrawal. The second supplies the earlier SIM transfer and two explicit unknowns: actual nationality and legal suspension ground. These limits are necessary before introducing general law; retain.

## Same-language comparisons

Locale reviewers read actual first two paragraphs, headings and substantive endings, rather than only titles. The latest repository-dated general columns below are all dated October 24; their within-day order is selected by article number, not represented as verified live publication order. Prior issue-board comparisons were also retained in the detailed reports.

| Language | Latest three general columns | Observed distinction |
|---|---|---|
| KO | `src/content/columns/706-taiwan-arc-renewal-changes-reentry.md`; `705-taiwan-visa-residence-work-study-family.md`; `704-taiwan-arc-first-application.md` | The comparators open with changed residence grounds, entry-purpose questions or a 30-day deadline, then organize permission routes/documents. KO01 uses two actual notices and a contract-scope question; KO02 begins with the damage-area criterion. Their endings concern agreed services and pre-repair damage evidence, not residence procedures. |
| JA | `src/content/columns-ja/720-taiwan-supplement-health-food-advertising-rules-japanese-brands.md`; `719-taiwan-promissory-note-security-court-ruling-enforcement-japanese.md`; `718-taiwan-customer-reorganization-bankruptcy-japanese-supplier-claims.md` | The comparators use a food-claim penalty, hypothetical note security or a creditor filing period. JA03 follows an actual mixed cargo; JA04 follows a medical-service invitation. Food advertising and medical-service advertising have different actors, legal rules and publication questions. Neither issue repeats the broad remedy survey or consultation closing. |
| EN | `src/content/columns-en/706-taiwan-arc-renewal-changes-reentry.md`; `705-taiwan-visa-residence-work-study-family.md`; `704-taiwan-arc-first-application.md` | The comparators use residence changes, route comparisons or a current deadline. EN05 opens with a proposed amount and explicitly pending law; EN06 with a dated assistance request. They do not copy numbered application steps, route catalogues or card/travel endings. |
| VI | `src/content/columns-vi/706-taiwan-arc-renewal-changes-reentry.md`; `705-taiwan-visa-residence-work-study-family.md`; `704-taiwan-arc-first-application.md` | The comparators concern changed residence grounds, whether supporting documents suffice, or a 30-day application period. VI07's question concerns water-only heat protection; VI08's number is a reported scam demand. They end on workplace/carrier evidence, without repeating immigration filing or expiry reminders. |

The additional prior issue comparators are KO October 22 issue 01, October 21 issue 01 and October 18 issue 07; JA October 22 issues 10/09/03; EN October 22 issues 12/11/07; VI October 22 issues 08/13/14. Full paths and specific opening/heading/ending observations are recorded in `work/review-{ko,ja,en,vi}.md`. No comparator was unavailable or invented. This comparison does not reapprove the older articles' legal content.

## Concrete revisions and preservation of meaning

| Piece / location | Change | Reason and legal effect |
|---|---|---|
| KO01 summary and contract explanation | `태풍으로 휴장한` became `태풍으로 휴장을 공지한`; already-paid sums were limited to `이미 지급한 금액 중 돌려받을 부분`. | Avoid implying firsthand observation or automatic return of every payment. The actual notices and Civil Code Article 266 full/partial impossibility conditions are retained; this is factual/legal precision. |
| KO02 summary/opening | `기준과 신청 기한을 살펴봅니다.` became the verified March 22, 2027 notice date. Deleted `중요한 기준입니다` and repeated `두 조건이 함께 필요합니다` framing. | Remove preview/repetition. Whole-building area, 30/50-percent boundaries, major disaster and repair-before-use remain explicit; the actual consequence follows separately. |
| JA03 second paragraph | Deleted `日系企業が台湾でキャラクター雑貨を仕入れる際にも、申告内容と商品の権利関係を検討する場面があります。` and its generic follow-up; replaced with the final headquarters/item-matching question quoted above. | Replace a topic preview with a specific document problem; no source fact or legal condition changed. Article 17's supplementary-document qualification was separately completed in body and FAQ from the verified statute. |
| JA04 market-relevance sentence | Deleted `台湾で日本語のクリニック紹介やイベント告知を手がける担当者にも、誰が何を宣伝しているかという問題が関わります。` | It repeated relevance without adding facts. A concrete Japanese translation/publication task remains later. Physician registered-practice limits and no-solicitation conditions are unchanged. |
| EN06 opening | Deleted `For foreign residents with Taiwan-issued policies, the announcement leaves three questions to resolve: whether the loss is covered, when notice was due and when payment must follow.` | The sentence only previewed structure. Dates, actors, insurance cover, notice/payment duties and all source links remain. |
| EN06 later transition | Deleted `Both have a role.` | The following sentence already explains the policy and announcement's distinct functions. No factual/legal loss. Reverse reconstruction reproduced the previously reviewed hash, confirming only the two deletions. |
| VI07 adverse-action exception | Replaced `Ngoại lệ đòi hỏi chủ sử dụng lao động chứng minh có lạm dụng, báo để cơ quan có thẩm quyền xác định, đồng thời đáp ứng pháp luật lao động.` with `Ngoại lệ chỉ áp dụng nếu chủ sử dụng lao động chứng minh có lạm dụng quyền dừng việc, cơ quan có thẩm quyền đã xác định việc lạm dụng đó sau khi nhận báo cáo, và việc xử lý đáp ứng pháp luật lao động.` | Substantive ambiguity corrected: mere reporting is insufficient; the competent authority must actually determine abuse. Employer proof and labor-law compliance remain cumulative. Immediate-danger, safe-retreat and reporting conditions for exercising the right are unchanged. Locale and independent final reviewers checked the corrected meaning. Reverse reconstruction reproduced the earlier hash. |
| VI08 narrative | Split the bank intervention and abandoned withdrawal; condensed the unknown-ground sentence to `Căn cứ ngừng dịch vụ không được nêu.` | Preserve actors, sequence, outcome and unknown suspension basis while reducing an overloaded sentence. No payment, verified nationality, conviction or Articles 16/18 application is invented. |

Author reports retain further bounded drafting edits. No reviewer rewrote another author's manuscript. EN05 needed no locale repair; all KO/JA pieces and VI08 passed their frozen locale versions unchanged.

## Sentence-variety section 5 and batch composition

All eight final files passed the shared checker with explicit `--lang` selection and zero FAIL. Root's four locale logs are `work/variety-{ko,ja,en,vi}.txt`. Korean/Japanese register-ending warnings were reviewed manually; consistent 합니다/です・ます forms were retained with different syntax and useful questions. The Japanese q=0 heuristic reflects sentence-final punctuation; actual questions were read. No filler was added for a passing metric.

Manual section 5 findings:

1. Actual openings are a closure notice, a damage-area criterion, a cargo finding, an advertising question, a proposed amount, an insurance-service report, a water-only workplace question and a reported scam demand. No stock imaginary-client opening occurs; no single formula dominates the batch.
2. Each article has multiple useful short sentences that carry a condition, chronology, consequence or question. Long legal conditions remain complete and are not piled into a single paragraph. Korean caption-excluded measurements independently passed too.
3. Paragraph starts vary, and no three consecutive claim/citation/caveat paragraphs or repeated generic first words were identified. Citation-free practical paragraphs explain an actual evidentiary task without inventing mandatory documents.
4. Necessary distinctions concern the real issue—ticket versus booth fees, damage area versus costs, document accuracy versus import prohibition, policy proposal versus operative law, or registration versus intent. They do not manufacture positions to refute.
5. Endings return to each article's documents, service scope, policy terms or actual conditions. A consultation pitch, contact block or imperative checklist is not imposed.
6. No bold markup, fabricated first person, internal drafting note or public author claim remains. Internal provenance is retained. Dates, sums, thresholds, exceptions, source links and fictional-image notices survive the revisions.

## Sources, images and tests

The eight original news hooks were published October 21–23. The cargo article explicitly distinguishes the July inspection from its recent announcement. At the original freeze, the fair's October 24 follow-up was checked only for contradiction; ko-01 round 1 now cites it for the remaining two days' extended hours while retaining the earlier news hook. Every piece links verified MOJ LawSingle pages. Pending legislative announcements, existing duties and reported administrative findings are distinguished. No judgment is invented or cited.

The 91APP incident and other duplicate candidates were rejected. A new VASP rule was replaced when the MOJ text did not reflect the new official rule. Three storm pieces address separate transactions and statutes, not translations. Source-retrieval methods, MOJ consolidation cutoff and effectivity limits are retained in the source ledger and reviews.

Eight built-in image-generation originals produced sixteen 1536×1024 opaque WebP/JPEG files. Root and independent reviewers inspected the actual installed WebPs. Captions identify fictional scenes; no actual flood, seized object, clinic or legally compliant worksite is implied. Alt text matches visible objects. KO/JA/EN retain their exact frontmatter caption in the body for the existing renderer; VI uses its caption renderer. Full prompts and original PNGs remain outside the repository in the lane evidence directory.

The exact requested Vitest invocation passed after the EN06/VI07 repairs: three files, 80 tests, exit 0. `work/vitest.txt` records the 15:33:15 KST run. The new batch has 17 tests; October 2 and September 30 tests were not changed. Tests verify numbering, metadata, FAQs, valid image signatures/paths, exact media metadata through the issue loader, source-link presence and exclusion from general-column lists.

`work/package-integrity.json` records all eight current manuscript hashes, 40 unique manuscript URLs, source-tail/ledger parity and 16 media hashes with no errors. Korean body counts are 962/954 characters with normalized paragraph spaces (956/948 without paragraph separators); Japanese non-whitespace body characters 1147/1091; English whitespace words 511/532; Vietnamese whitespace units 602/607. Counting excludes frontmatter, headings, captions, sources and closing disclaimers. These counts are not asserted to be linguistically interchangeable.

## Handoff boundary

The first queue entry owns this shared audit and the new test in addition to its own article/images. The eight-row queue, test command, source ledger and operator notes are external lane handoff files. Local drafting/review completion is separate from the lane's later commits, Claude Code review and deployment. No live-site success is claimed. Any subsequent article edit changes the frozen hash and requires checking its affected review scope.

## ko-01 — Claude Code round-1 repair, 2026-10-24

Scope: only the named ko-01 manuscript, `src/lib/__tests__/issue-board-20261024.test.ts` and this audit were edited. Both named images were inspected or verified and remain byte-identical. The other piece repairs in the shared worktree belong to their respective tasks. No staging, commit, push or deployment was performed in this repair.

The original manuscript hash `13c8ee05af626eddd258f0af86b93bb08b2da43d13250fdd101cc13b87579e40` was reproduced before editing. The repaired hash is `c1422d65d1fe6db74521cc6b347ef0d00238dfb975c421c9be24e8d32e6a4a0e`. Original external author/review/manifest files still describe the earlier freeze; this addendum supersedes them only for ko-01. Those external files are outside the authorized edit scope.

### Finding disposition and meaning preservation

| Finding | Applied change | Reason and preserved meaning |
|---|---|---|
| MINOR 1, shared test | Renamed `EXPECTED` to `ALLOWED_NUMBERS`; copied the October 22 present-file validation pattern with duplicate-ID checking and `ALLOWED_NUMBERS[locale] ?? []`; removed exact locale-array equality and the mandatory eight-file count. | Separately approved pieces can arrive in any subset. Unknown or duplicate IDs still fail. Current allocated numbers remain unchanged; a later publication renumber must update the allowlist with the assigned number. |
| MINOR 2, notice date | `주최 측은 10월 22일 다음 날 전시를 쉬겠다고 공지했습니다.` became `주최 측은 10월 22일 공지에서 다음 날인 23일 하루 전시를 쉬겠다고 했습니다.` with the notice link on `10월 22일 공지`. | Clearly distinguishes the announcement date from the one-day closure. The separate October 23 notice/October 24 closure remains. |
| MINOR 3 and NIT 4, event framing | `한국 작가들도 참여하는 서일페 타이베이` became `한국 작가가 160명 넘게 참여하는 서일페 인 타이베이(SIF in Taipei)`. | Removes incidental-participation framing; the count is supported by Walkerland's event listing and the Korean event name by the organizer announcement reported in Seoul Shinmun. No claim of observed attendance or a new booth-refund entitlement. |
| NIT 5, image caption | Prefixed the in-body caption with `대표 이미지는`. | Connects the remote caption to the representative image. The exact frontmatter caption remains contained in the body; fictional-scene and non-documentary limits are unchanged. |
| NIT 6, later notice | Added one sentence attributing the remaining two days' extended visiting hours to the October 24 notice, with the same URL in the source list. | Supports the discussion of remaining services without treating extended hours as agreed compensation or a promised booth-fee refund. |
| NIT 7, source description | `보도에 소개된 원래 일정` became `행사 소개 기사에 실린 원래 일정`. | Accurately identifies the event listing. October 23–26 and the original four-day duration remain. |
| NIT 8, summary | `부스 참가비는 참가계약을 따로 봅니다.` became `부스 참가비는 참가계약에 따라 따로 판단합니다.` | Completes the sentence naturally; Taiwan-law applicability, actual impossibility and responsibility conditions remain. |
| Sentence-variety repair | Split `참가계약에서도 태풍의 발생뿐 아니라, 주최 측이 계약상 약속한 일을 실제로 이행할 수 없었는지가 문제됩니다.` into `태풍의 발생만으로는 부족합니다. 참가계약에서도 주최 측이 약속한 일을 실제로 이행할 수 없었는지가 문제됩니다.` | Gives the insufficiency of a typhoon alone a short sentence and preserves the requirement of actual inability to perform the promised contractual service. The preceding Article 225 no-fault condition is unchanged. |

All review findings were supported; no rebuttal file was warranted or created.

### Fresh source verification

- [Walkerland event listing](https://www.walkerland.com.tw/subject/view/425413): displayed publication time October 22, 2026, 17:30; more than 160 Korean illustrators; originally October 23–26 at Huashan 1914 East 2. The current listing also reflects the two closures and revised hours. It is an event roundup, not a judicial or official legal report.
- Organizer notices dated [October 22](https://sifintaipei.com.tw/news/ef388ef2-1378-4ade-8a85-78b025dbaf6a), [October 23](https://sifintaipei.com.tw/news/6e5f9b3f-cd0e-42bf-88bb-f0c44f90406b) and [October 24](https://sifintaipei.com.tw/news/a1afdd18-f7cc-4b64-8d39-cf97d338e39f) were opened independently. The October 22 page returned HTTP 200 through a direct HTTPS retrieval after the web tool timed out. They respectively announce October 23 closure, add October 24 closure/full ticket refunds without a handling fee under the ticket platform process, and extend October 25 hours to 10:00–20:00 and October 26 hours to 10:00–19:30. None specifies booth-fee repayment or exhibitor compensation.
- [Seoul Shinmun's organizer-announcement report](https://m.seoul.co.kr/news/economy/2026/05/15/20260515500084), whose displayed publication date is May 18, 2026, supports the Korean name `서일페 인 타이베이`. Its earlier proposed 200-team scale is not substituted for Walkerland's later creator count.
- [Civil Code Article 225](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=225), [Article 266](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=266) and [history/effectivity](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001) were opened. Article 225 paragraph 1 retains non-attributability to the debtor and actual impossibility. Article 266 retains non-attributability to both parties, full versus proportional counter-performance relief, and recovery under unjust-enrichment rules. The database's pending-effectivity notes concern Articles 166-1 and 1223, not these two provisions; the displayed consolidation cutoff is October 16, 2026. No individual exhibitor contract or judicial outcome was verified or asserted.

### Checks on the repaired version

- Fresh Vitest run at 15:57:14 KST: `./node_modules/.bin/vitest run src/lib/__tests__/issue-board-20261024.test.ts src/lib/__tests__/issue-board-20261002.test.ts src/lib/__tests__/issue-board-20260930.test.ts --no-cache --configLoader runner` — 3 files, 80 tests PASS, exit 0; October 24 contributes 17 tests. Older tests were not edited.
- Scoped lint: `./node_modules/.bin/eslint src/lib/__tests__/issue-board-20261024.test.ts` — exit 0, no findings.
- The actual updated ID-validation callback and allowlist were extracted with the TypeScript parser and evaluated in memory: ko-01 alone, an empty batch, partial markets and the complete current batch pass; duplicate IDs, unallocated IDs and a wrong-locale ID fail as intended. Seven checks passed without moving articles or writing fixture files.
- Shared checker: `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/issues/ko/ISSUE-20261024-01-taiwan-seoul-illustration-fair-typhoon-booth-fee.md --lang ko` — zero FAIL; 24 sentences, length CV 0.450, short share 0.125, same-length runs 0.045, repeated paragraph starts 0, sentence-end citation share 0, contrast/caveat counts 0, one reader question. One nonblocking warning reports the expected 합니다체 ending concentration; varied syntax and the question were checked manually. Excluding the caption gives 22 sentences, CV 0.456 and short share 0.136. The first provisional repair had CV 0.430 and was corrected before this freeze.
- Body length is 1,050 characters including spaces and single paragraph separators, excluding frontmatter, headings, image caption, sources and closing disclaimer. The original batch counts above remain historical. All six body source URLs occur in the source list; all original URLs remain. FAQ text, legal conditions, dates, internal author metadata and the image disclosure are preserved.
- Manual section 5: factual event opening; three useful very short sentences; no consecutive long sentences or repeated paragraph opener; no repeated claim/citation/caveat template; one concrete ticket-versus-booth question; no manufactured contrast; ending tied to contracted services and date-specific notices; consistent 합니다체, no bold, fabricated first person or imperative checklist. The creator count and original date range are retained because they are substantive review corrections, rather than deleting facts to satisfy a numeric-opening preference.
- The actual openings, headings and substantive endings of Korean columns 706, 705 and 704 listed above were reread. Their residence-change, entry-route and first-ARC topics use different openings and procedural headings; ko-01 remains a dated-notice/contract-performance article ending on the promised services. This compares available repository versions, not verified live ordering or the older articles' legal merits.
- Image hashes remain WebP `758aaabd9d14452b1712140a1fd820376c11ff8074aa2cc23c9c4fc231c6a624` and JPEG `1a22c88283754d3533bfc9403bc061a06eb0afc1ac6c60441b763d79e2024b1a`. The JPEG was visually inspected: empty booth, table, boxes and rain on the glass; no visible text, logo or face. `git diff --check` passed.

Independent nonauthor reviewers `ko01_r1_locale` (`tseng-editor-ko`) and `ko01_r1_final` (`tseng-editor-final`) both returned PASS on the repaired SHA above, with no unresolved MAJOR/MINOR. They independently read the actual article, source material, image and three Korean comparators; both reproduced the zero-FAIL variety check. The final reviewer reopened all three organizer notices successfully over HTTPS, checked current MOJ text/history and the Korean event name, and confirmed the test/audit repair scope. The final reviewer relied on root's recorded Vitest result rather than claiming a separate run. Neither reviewer wrote any files; their findings were returned in the repair session and recorded here by root. These are model-based editorial reviews, not attorney/native-speaker certification or Claude Code approval.

This is a bounded local repair record; Claude Code re-review, publication numbering and release remain separate operator work. No build, browser-rendering or live-site claim is made.
