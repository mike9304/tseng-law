# Final review r1 — ko-004-taiwan-company-subsidiary-vs-branch

Reviewer: Claude Fable 5.1 (AI review; not a native-speaker or lawyer review). Date: 2026-10-06.

## Verdict

PASS — publishable as the live replacement, with the two tiny edits listed below already applied to draft.md. No blocking issue. Six small wording drifts are recorded as non-blocking notes.

## Scope checked

- Read in full: orig.md, draft.md, guard.txt, notes.md, tests.patch, tests.txt, vitest-1.log, p-write.txt, p-tests1.txt, log; SENTENCE-VARIETY-RULE.md (all), COLUMN-VOICE-RULE.md, EDITORIAL-VOICE.md (tseng-lanes-shared/rules copy; ~/agent-library/knowledge/editorial-voice.md does not exist at that path on this machine), LESSONS.md.
- Read the pinned test file in the worktree (/Users/son7/Projects/tseng-law-rewrite-1006-w2/src/lib/__tests__/columns-ko-investment-004.test.ts) to see what tests.patch changes and how the eojeol count is computed.
- Commands run (after my edits):
  - `python3 /Users/son7/tseng-rewrite-1006/guard.py …/orig.md …/draft.md ko taiwan-company-subsidiary-vs-branch --today 2026-10-06` → `GUARD: PASS` (length 10536 → 9823, 93%; monotony 42.0 → 14.2; cv 0.323 → 0.466; short 0.005 → 0.139; contrast 6 → 1; questions 0 → 4).
  - `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check …/draft.md --lang ko` → no FAIL; one WARN (97% of sentences end in 니다. — 합니다체).
  - Script comparison: front matter + H1 + image lines differ only in lastmod and read_time; both tables byte-identical (14 rows); everything from "## 공식 자료" to the signature byte-identical (10 source links, 3 related links, disclaimer, signature); 8 list items in both; no bold, no emoji, no 해라체 endings.
  - Eojeol count with the test's own formula: 2958 before and after my edits (the patched test pins 2958 and 17분). Every Korean literal added by tests.patch is still present in the edited draft.
- Not done: I did not re-run vitest (the worktree is outside this session's working directories); my two edits keep the eojeol count and touch no pinned phrase, so vitest-1.log (92 files, 1192 tests passed) should still hold. I did not re-verify the original's law from scratch; two source checks I did make are under "Original issues".

## Front matter

Identical except `lastmod: "2026-07-25" → "2026-10-06"` and `read_time: "18분 분량" → "17분 분량"` (ceil(2958/180) = 17). Title, url, date_display, categories, featured_image, three FAQ questions and answers, H1, both image lines: unchanged.

## Fact comparison, section by section

"=" preserved with the same meaning; "~" preserved with a wording drift noted below; "moved" = same content, new position.

### Intro

| Original point | In the rewrite | Status |
| --- | --- | --- |
| Foreign companies doing continuing business in Taiwan often consider a subsidiary or a branch | P1, sentence 3 | = |
| Both set up a business base; they differ in contract party, who bears debts, third-party equity, procedure for moving profit abroad | P1: contract party pulled out as the opening question; the other three in sentence 4 | = |
| Comparing only set-up convenience can lead to unexpected liability or tax problems; judge over the whole business period | P1, last two sentences | = |
| Subsidiary = independent legal person under Taiwan law; foreign parent may be shareholder; separate subject of rights and duties | P2 | = |
| Branch = part of the foreign head office, no separate legal personality | P2 | = |
| 지사 / 지점 terminology note | P2 | = |
| Suitability depends on 9 listed factors (업종 … 사업중단 계획) | P3, all 9 present | = |
| A Korean parent must also look at Korean accounting, tax and outbound-investment procedure | P3 | = |
| "아래에서는 … 순서로 비교합니다" | removed (preview sentence, no fact) | cut, acceptable |
| — | New sentence: "원칙적으로 자회사를 세웠다면 자회사이고, 지점을 두었다면 외국 본점입니다." | not a new fact: same content as the original table row "책임 주체" and §3 P1–P2; 원칙적으로 kept |

### 1. 법인격과 출자 구조

| Original point | In the rewrite | Status |
| --- | --- | --- |
| Branch has no shareholders of its own because it is part of the foreign company | P1 (question + "넣을 수 없습니다" + reason) | = (matches table "지분 출자는 불가능" and §4 P1) |
| For joint investment with a third party, consider setting up a subsidiary "등" | P1, "방법 등을 검토합니다" | = |
| 책임·의결권·자금조달·인허가·세무 to be confirmed according to equity relations and business plan | P1, "…에 따라 달라집니다" | ~ note 6 |
| 회사법 제1조 definition of a company | P2 | = ("대만 회사법" → "회사법", note 4) |
| Subsidiary leases, contracts, employs, acquires property, can be a party to litigation in its own name | P2 | = |
| Contract claims and debts belong 원칙적으로 to the subsidiary; parent's management control does not merge the two personalities | P2 | = |
| Scope of liability depends on the company form actually chosen and on conduct | P3 | = |
| 유한회사 shareholder: 제99조 제1항, 원칙적으로 limited to capital contribution | P3 | = |
| 제99조 제2항 exception: abuse of legal personality AND company hard-pressed to pay a specific debt AND abuse serious → liable to the necessary extent ("할 수 있는") | P3, same three conditions, "질 수 있다고 정합니다" | = |
| Guarantee or direct involvement in a tort → liability under that guarantee/act also to be examined | P3 | = |
| Limited liability is a starting point, not a guarantee that liability always ends at the contribution | P3 | = ("중요한 출발점" → "출발점일 뿐", note 5) |
| Foreign company doing business in its own name must follow the branch provisions | P4 | = |
| 제371조: no business in Taiwan under the foreign company's name without branch registration | P4 | = |
| 제372조: must allocate funds dedicated to the branch's business AND appoint a responsible person in Taiwan | P4 ("해야 합니다" kept) | = |
| Those funds are head-office funds, not shares or equity of the branch; appointing the responsible person does not make the branch an independent company | P4 | = |
| Table (5 rows) | identical | = |
| With a third party, the ratio alone is not enough: 11 listed matters | P5, all 11 present | = |
| Joint investment in a subsidiary lets these be designed inside the shareholder structure; other lawful structures may exist; subsidiary is not the only solution | P5 | = |
| Branch: final legal subject is the foreign company; head office should define 6 listed matters | P6, all 6 present | = |
| Subsidiary: document 정관·기관구성, allocation of powers among shareholders, and service / loan / licence contracts with the parent separately | P6 | = |
| Actual powers and transaction flow matter more than the name | P6 | = |
| Licences are not decided by legal personality; sector rules may set applicant, minimum capital, staff, premises, foreign-investment review or responsible-person qualifications | P7 | = |
| Being able to register ≠ being able to run a regulated business; break activities down and check contract party and licence holder for each | P7 | = |

### 2. 세무와 이익 송금

| Original point | In the rewrite | Status |
| --- | --- | --- |
| Lead paragraph = FAQ 2 answer verbatim (5% / 20% 일반적으로; 21% domestic, 10% treaty cap if requirements met; branch remittance not a dividend, 원칙적으로 no further withholding; head office outside Taiwan excluded from 5% surtax filing) | Lead shortened to two sentences; every other element is in P4–P6 and the table; the FAQ answer itself stays in the front matter and is rendered on the page | = (repetition cut); new sentence "차이는 이익 송금에서 납니다", note 1 |
| 영업세: indirect tax on supplies in Taiwan; general rate 5%; 통상 two-month periods; zero rate / exemption / special rates / input credit depend on the transaction; 5% alone does not mean equal tax paid | P2 | = |
| 영리사업소득세: on taxable income; 20% general rate when taxable income exceeds the statutory threshold; not 20% of revenue; six listed adjustments; same revenue and rate can still give different results | P3 | = |
| Table (5 rows) | identical | = |
| Subsidiary distributing after-tax profit to foreign parent: company and shareholder are different legal subjects | P4 sentence 1 | ~ note 3 ("세후 이익" dropped here) |
| Domestic withholding on dividends to foreign shareholders 21% | P4 | = |
| Treaty cap 10% may be considered if parent is a Korean resident AND covered by the treaty AND beneficial owner, etc. | P4 | = |
| Treaty rate is not automatic; check residence certificate, beneficial-owner test, payment/filing timing, application or refund procedure against current practice | P4 | = |
| Branch profit is part of the head office's profit, not profit distributed by a separate company | P5 | = |
| Remitting after-tax branch profit after filing and paying income tax is distinct from a dividend; 원칙적으로 no further dividend withholding at branch level | P5 | = |
| Not all head-office/branch payments are treated alike; interest, royalties, service fees, asset prices, third-party payments judged separately | P5 | = |
| Subsidiary retaining profit: 5% surtax under 소득세법 제66조의9 may apply | P6 (citation moved to end parenthesis, still on the same claim) | = |
| Per 재정부 guidance, an enterprise whose head office is outside Taiwan is excluded from that filing; this does not mean the branch is untaxed or that all documentation duties disappear | P6 | = |
| Look at how profit is made and used rather than the rate table; subsidiary computes 5 items in its own books | P7 | = |
| Result may differ with reinvestment needs, dividend timing, shareholder loans or royalties | P7, "결과가 달라집니다" | ~ note 2 |
| Branch separates Taiwan-attributable income/cost, keeps a basis for allocating head-office common costs; accounting and tax attribution of internal dealings | P7 | = |
| Transfer-pricing principle may apply to both; 6 items must be consistent; payment by head office or an amount in an intra-group contract is not enough; keep supporting material | P8 | = |
| Korean side: 5 listed matters; treatment of early branch losses depends on Korean tax law and accounting standards ("달라질 수 있습니다"); cannot conclude in advance that a branch lowers the Korean parent's tax; compare in one worksheet | P9 | = |

### 3. 채무와 법적 책임

| Original point | In the rewrite | Status |
| --- | --- | --- |
| Branch debts are the foreign company's debts | P1 (question + answer) | = |
| Obligations from contracts lawfully concluded by the branch's responsible person in the foreign company's name (5 contract types) are 원칙적으로 borne by the head office | P1 | = |
| Liability is not limited to the funds allocated to the branch, even with losses or insufficient branch assets | P1 | = |
| Subsidiary contracts and debts belong 원칙적으로 to the subsidiary | P2 | = |
| 유한회사 shareholder: within capital contribution under 제99조; 주식회사 shareholder: within subscribed shares under the applicable rules | P2 (citation in end parenthesis) | = |
| This difference can matter for high-risk, long-term, many-employee/consumer businesses | P2 | = |
| A subsidiary does not block all parent risk; parent guarantee demanded by bank or landlord; parent assuming or co-signing the contract | P3 | = (my edit removed the added word "대표적인") |
| Commingling assets or abusing legal personality to harm creditors → company-law exception may be in issue | P3 | = |
| Boundary of liability also depends on actual decision-making and fund management | P3 | = |
| Duties of directors, managers and the Taiwan responsible person are separate; personal liability for torts, violations, false filings, safety breaches | P4 | = |
| 6 regulatory areas follow each statute's own responsible party and sanctions; align documents and operation when group companies split work | P4 | = |
| Contract stage: 6 clause types; insurance vs internal control; 6 control items | P5 | = |
| Recap paragraph ("자회사는 안전하고 지점은 위험하다 … 한 문장으로 끝낼 수 없습니다 …") | removed | acceptable: branch direct liability (P1), limited liability as starting point (P2, §1 P3), guarantee / tort / abuse / regulatory liability / group contracts (P3–P4) are all stated above; "책임 노출" comparison remains in §7 scenario paragraph. No separate legal point lost. |

### 4. 자금조달과 대만 상장

| Original point | In the rewrite | Status |
| --- | --- | --- |
| Lead paragraph = FAQ 3 answer verbatim | removed as a paragraph: sentence 1 → P3; sentence 2 → P4 ("자회사가 상장하려면 회사법과 증권거래소의 소정 요건을 충족해야 하고"); sentences 3–4 → §5 P1, P4 | moved, = |
| Branch has no shares to issue to third parties; funds from allocated funds, head-office support, lawful borrowing "등" | P1 | = |
| No equity issuance ≠ no financing at all; borrowing, collateral, head-office guarantee, bank review, FX documents checked per transaction | P1 | = |
| Subsidiary may issue shares or increase capital according to the chosen form and statutory procedure; local partner, later investors' rights, classes of shares, employee equity | P2 | = |
| Exit by share transfer, merger/division, strategic investment → subsidiary may fit; each tool subject to 회사법, investment regulation, 정관, shareholders' agreement | P2 | = |
| Branch cannot be a listing entity (no independent issuer, no shares); listing of the foreign company itself is a different question | P3 | = |
| A subsidiary does not automatically qualify; needs a listable issuer form and the TWSE market's criteria; 8 listed requirements; sector / foreign-investment limits, group restructuring, shareholder make-up may affect the plan | P4 | = |
| Map future sources and recovery of funds over time (5 questions); short-term and long-term structures may differ | P5 | = |

### 5. 투자세액공제 (heading → "투자세액공제와 조직 형태")

| Original point | In the rewrite | Status |
| --- | --- | --- |
| Tax benefits are not decided by the organisational form alone; 10 listed items to check | P1, all present | = |
| A tax credit differs from computing taxable income and is not a deduction of the whole spend from tax payable | P1 | = |
| 「산업혁신조례」 제10조의1: investments from 2025-01-01 to 2029-12-31 | P2 (split into two sentences) | = |
| NT$1 million to NT$2 billion in the same tax year; 회사 또는 유한합자; statutory requirements and approval | P2 | = |
| Acquired for own use; new-asset status and actual use | P2 | = |
| Eligible fields (smart machinery, 5G, cybersecurity, AI, energy-saving / carbon-reduction hardware, software, technology or technical services) | P3, identical list | = |
| Not approved automatically; 7 document types checked against statutory scope and procedure | P3 | = |
| Up to 5% of the year's investment against that year's income tax, OR up to 3% each year for 3 years | P4 | = |
| Annual credit under 제10조의1 capped at 30% of that year's 영리사업소득세액 | P4 (citation in end parenthesis) | = |
| Combined cap and overlap limits when used with other credits; 30% does not mean automatic refund of 30% of R&D spend | P4 (+ "30%의 기준은 소득세액입니다", a restatement of the cap) | = |
| R&D may fall under 제10조 "등"; confusing 제10조 and 제10조의1 → wrong expense, timing, cap; three things to settle before investing | P5 | = |
| Eligibility of branch or subsidiary judged by the statutory applicant and the actual investment relationship; no guarantee for a subsidiary, no blanket exclusion of a branch; check at the planning stage | P6 | = |

### 6. 대만–한국 소득세협정과 고정사업장(PE)

| Original point | In the rewrite | Status |
| --- | --- | --- |
| Signed 2021-11-17, in force 2023-12-27, applicable from 2024-01-01 | P1 (two sentences) | = |
| Adjusts double taxation; does not automatically exempt all Taiwan-source income; 5 things to check | P1 | = |
| Dividends, interest, royalties: cap 10% each; recipient must be resident of the other territory AND beneficial owner, etc.; residence certificate and application / filing or refund procedure | P2 | = |
| Conduit company or effective connection with a Taiwan PE → separate analysis may be needed | P2 | = |
| Business profits 원칙적으로 exempt in the other territory without a PE; with a PE, profits attributable to it may be taxed; first PE, then attribution | P3 | = |
| PE may include a fixed place; management office, branch, office: period of use, right of disposal, activity | P4 | = |
| A registered branch 통상 is a fixed-place PE, so branch business profits are not automatically exempt | P4 | = |
| Construction PE: over 6 months; service PE: more than 183 days in total in any 12-month period through employees or other personnel; agency PE: repeated exercise of authority to conclude contracts | P5 ("문제될 / 성립할 / 해당할 수 있습니다" kept) | = |
| Tests are separate (183 days ≠ no fixed place; 6 months ≠ no agency PE); 6 facts to check | P6 | = |
| A subsidiary is not automatically the parent's PE; but repeated contract-concluding for the parent or the parent doing its own business at the subsidiary's premises needs separate review; registration and treaty nexus judged separately | P7 | = |
| When preparing treaty application, secure actual performance records, not only contracts and invoices; 7 record types help PE and attribution analysis | P8, "협정을 적용받으려면 … 자료가 필요합니다" | = (slightly firmer framing, same content) |
| Manage both territories' filing calendars so domestic filings and TP documents are not missed | P8, "관리하는 편이 안전합니다" | = (advice, no statutory duty cited in the original) |

### 7. 어떤 형태를 선택할 것인가 (heading → "형태를 고르는 기준과 철수 절차")

| Original point | In the rewrite | Status |
| --- | --- | --- |
| Neither form is superior for all cases; subsidiary may fit when an independent Taiwan entity and local shareholders are needed; branch may fit for direct operation under head-office control | P1 ("맞을 수 있습니다" covers both) | = |
| "Can be set up" and "efficient through operation, tax and exit" are different judgments | P1 | = |
| 8-item comparison list | 8 items, same content, same order | = |
| Early stage: reflect future plans even with small revenue, staff, contracts; 4 scenarios; table of funds, after-tax cash, liability exposure, document and filing cost | P3 after the list | = |
| Changing structure later: counterparty consent, employment, licences, asset transfer, tax, FX may follow ("수 있습니다"); do not assume a simple rename; design assignment clauses and IP licences first | P4 | = |
| Branch exit: 제378조, must apply for cancellation of branch registration; prior debts, tax, labour, contract and regulatory duties do not disappear; 6 wind-down steps in order | P5 | = |
| 제379조: cancellation does not affect creditors' rights or the foreign company's obligations; creditors keep rights from pre-cancellation business; do not treat past liability as ended; check disputed contracts and guarantees, tax-audit period, record retention | P6 | = |
| 제380조: when all branches are cancelled, rights and duties from Taiwan business and the branch must be liquidated; unpaid debts remain with the foreign company; same-entity principle applies at exit too; liquidator, creditor notice, filings, residual funds per current procedure | P7 (subject "외국회사는" made explicit; consistent with the next sentence) | = |
| Subsidiary: dissolution and liquidation under 회사법, not branch deregistration; 5 steps; parent cannot pull funds ignoring legal personality and creditors; the two exit procedures are not the same | P8 (now the last body paragraph) | = |
| Final choice best reviewed by Taiwan and home-country professionals on the same facts; 7 inputs; legal / tax / accounting / FX issues linked | P2 after the list | moved, = |
| After set-up, check regularly that actual operation still matches the chosen structure | last sentence of P4 | moved, = |

### Sources, related links, disclaimer, signature

Byte-identical to the original (10 official links in the same order, 3 internal links, disclaimer paragraph, "증준외 변호사(曾雋崴, Wei Tseng)"). No contact line exists in the original; none was added.

## Blocking issues

None.

## Non-blocking notes (wording drifts; fix only if a later round touches this file)

1. Original §2 lead (FAQ 2 answer) → rewrite "영업세 5%와 영리사업소득세 20%는 일반적으로 자회사와 지점 모두에 적용됩니다. 차이는 이익 송금에서 납니다." → the second sentence is a new summary and is narrower than the section: the 5% surtax difference arises when profit is retained, and P3 says results can differ even at the same rate. All of that is still stated in the table and P3–P6, so no legal point is lost. Suggested wording if revised: "차이는 이익을 본점이나 모회사로 보낼 때와 유보할 때 납니다." (this paragraph is pinned as `section2Opening` in tests.patch, so the test literal would have to change with it).
2. "…에 따라 결과가 달라질 수 있습니다" → "…에 따라 결과가 달라집니다" (§2 P7). Hedge dropped on a practical, non-statutory sentence. Suggested: restore "달라질 수 있습니다".
3. "대만 자회사가 세후 이익을 국외 모회사에 배당하면 자회사와 주주는 서로 다른 법적 주체입니다" → "배당을 주고받는 자회사와 주주는 서로 다른 법적 주체입니다" (§2 P4). "세후 이익" is no longer said for the subsidiary dividend (it remains for the branch remittance and in the table's 배당 row context). Suggested: "세후 이익을 배당하는 자회사와 주주는 …".
4. "대만 회사법 제1조" → "회사법 제1조" (§1 P2). The body no longer says "대만 회사법" anywhere; the context (previous paragraph "대만법에 따라 설립", sources list "대만 법무부 법령정보 — 회사법") makes it clear, and the original also wrote plain "회사법" for every later article.
5. "유한책임 원칙은 중요한 출발점이지만" → "유한책임은 출발점일 뿐입니다" (§1 P3). Tone slightly more dismissive of limited liability; the rule itself (제99조 제1항, 원칙적으로) is stated two sentences earlier.
6. "…출자관계와 사업계획에 따라 확인해야 합니다" → "…에 따라 달라집니다" (§1 P1). The FAQ answer in the front matter keeps the original wording.

Also noted, no change needed: "대만 지점의 초기 손실을 본점과 어떻게 처리할지는" (§2 P9) is a little loose compared with "본점과 어떤 관계에서 처리되는지는"; the sentence still ties the treatment to Korean tax law and accounting standards with "달라질 수 있습니다".

## AI voice / MONOTONY

Tool: no FAIL. Section 5 items 2–7: all met.

- Item 2: opening is a reader question, not a hypothetical formula. The other 004 item in today's batch (ja-004) opens with a fact statement, so the types do not collide.
- Item 3: 32 very short sentences out of 231; no run of long sentences.
- Item 4: no paragraph-opening word appears three times (max 2: 계약 / 자회사는 / 지점이 / 대만).
- Item 5: no three consecutive "claim (article) → 다만" paragraphs; "다만" opens one sentence in the whole piece; most paragraphs carry no citation.
- Item 6: contrast frames 6 → 1 by the tool. "~이 아닙니다 / 아니라" forms fall from 29 to 20; the ones left are the original's legal qualifications.
- Item 7: last body paragraph is the subsidiary dissolution paragraph, ending on "두 형태의 종료절차와 소요업무는 같지 않습니다." The disclaimer after the sources is the original's and had to be kept.
- Item 8: 합니다체 throughout, no bold, no first person, headings are noun phrases. "해야 합니다" 41 → 3, kept on the statutory duties (제372조, 제378조, 제380조) plus "따라야 합니다" for the branch provisions.

Non-blocking MONOTONY observations (one unmet reading impression each, not a section-5 failure):

- MONOTONY: signpost sentences — "예외도 있습니다." / "제372조는 두 가지를 정합니다." / "다른 길도 있을 수 있습니다." / "여기서 협정이 변수가 됩니다." / "지점은 사정이 다릅니다." / "한국 쪽 확인 사항도 있습니다." / "순서가 있습니다." / "사실관계에 따라 갈립니다." / "투자 전에 세 가지를 구분합니다." / "구조 전환 가능성도 봅니다." — about ten short sentences only announce the next one. Direction: in a later pass, merge half of them into the sentence they introduce.
- MONOTONY: self-answered questions — "계약 당사자는 누구일까요?" (intro P1), "어느 쪽이 더 적절할까요?" (intro P3), "대만인이나 대만 법인을 지점의 주주로 넣을 수 있을까요?" (§1 P1) — three of the first four body paragraphs open with a question that is answered at once. Direction: turn the intro P3 question into a statement.
- "수 있습니다" appears 33 times (original 32). These are the original's legal hedges and were correctly kept; not counted against the rewrite.
- Subjectless plain-present advice ("확인합니다", "점검합니다", "나눕니다") replaces most advisory "해야 합니다". It reads as procedural Korean and keeps the directive sense.

Length: body 10536 → 9823 characters (93%), 3199 → 2958 eojeol. Cuts: the preview sentence, three lead paragraphs that repeated the FAQ answers word for word (the FAQ is rendered as its own section on the page by ColumnDetailView.tsx), and the §3 recap paragraph. No padding.

## Tests verdict

tests.patch: acceptable.

- One file only: src/lib/__tests__/columns-ko-investment-004.test.ts. No .skip / .only / .todo, no other column touched, 13 tests before and after.
- lastmod and read_time literals, the two renamed H2 headings, and the eojeol count (3199 → 2958, 18 → 17 minutes) re-anchored to the new text.
- Company-law, tax, financing / listing / tax-credit and treaty phrase lists: each old phrase is replaced by the new sentence carrying the same fact and number (제1조, 제99조 제1항·제2항, 제371조, 제372조, 제378조–제380조; 5%, 20%, 21%, 10%, 제66조의9; dates 2021-11-17 / 2023-12-27 / 2024-01-01; 6개월, 183일 / 12개월; 100만–20억 대만달러, 5% / 3% / 3년 / 30%). None dropped.
- The test "repeats each exact FAQ answer as the first paragraph after its assigned H2" is replaced by one that pins the new first paragraph under H2 1, 2 and 4 and requires each FAQ answer to appear exactly once (front matter). The structure it locked (FAQ answer duplicated in the body) was removed on purpose. The facts that only the duplicated FAQ 3 paragraph used to lock are now locked by four added phrases (branch cannot be a listing entity; subsidiary must meet 회사법 and exchange requirements; tax benefits not decided by form; 제10조의1 scope sentence). Minor: the new test title says "its answer paragraph", but the §4 opening is the financing paragraph, not the FAQ 3 answer; the assertion itself is exact.
- The nine `nativeReviewCorrections` strings are re-anchored one for one.
- After my two edits every Korean literal in the patch is still found in draft.md and the eojeol count is still 2958.

## Tiny edits applied to draft.md

1. §6 P5: "고정시설 밖에도 협정은" → "고정시설 외에도 협정은" (unnatural word; restores the original's "외에도").
2. §3 P3: "대표적인 경우가 보증입니다." → "보증이 그런 경우입니다." (removes "대표적인", a ranking the original does not make; 3 eojeol → 3 eojeol).

Guard re-run after the edits: GUARD: PASS (output above). Variety check: no FAIL.

## Original issues (not blocking; unchanged by the rewrite)

1. Sources list entry "대만 법무부 법령정보 — 영업세법 제10조" links to `LawSingle.aspx?pcode=G0340028&flno=3`. I opened it: the page is 各類所得扣繳率標準 第3條 (the 21% withholding on dividends to non-residents), not the business tax act. The label is wrong, and the 5% business-tax rate has no matching link. The link text and URL are pinned by the test's `officialLinks`, so correcting it needs a separate change with a test update.
2. 회사법 제379조: I opened the article. Paragraph 1 lets the authority cancel a branch registration ex officio or on an interested party's application in three listed cases; paragraph 2 says that cancellation does not affect creditors' rights or the foreign company's obligations. The column (original and rewrite alike) states the paragraph 2 effect for branch deregistration in general. The conclusion for voluntary cancellation under 제378조 is 확인 필요 against that article's own text, which I did not open.
3. The rewriter's other doubts stand as written in notes.md: amounts, dates and remaining article numbers were not re-verified in this review; the sources section has no check date and the column has no contact email (pre-existing lint items tolerated by the guard).
