# FINAL REVIEW r1 — zh-hant-004-taiwan-company-subsidiary-vs-branch (Claude Fable 5.1, 2026-10-12)

VERDICT: PASS

## Scope checked

- Read in full: orig.md, draft.md, guard.txt, notes.md, tests.patch (17,840 bytes, non-empty), vitest-1.log, tests.txt, log; SENTENCE-VARIETY-RULE.md sections 2, 5 and 6; COLUMN-VOICE-RULE.md; LESSONS.md (skimmed, Top 25).
- Ran: guard.py (GUARD: PASS, length 8844 → 8534, 96%); variety_metrics.py check --lang zh-hant (OK, 205 sentences, cv 0.49, short 0.117, run3 0.039, opener_rep 0.109, cite_end 0.01, contrast 1, caveat 0, q 2).
- Recomputed the visible Han count of the final draft with the test's own extraction logic: 7,610, matching the value pinned in tests.patch.
- Did not re-verify the original's law from scratch; no network used.

## Front matter, H1, images

- Front matter identical to the original except lastmod "2026-10-06" → "2026-10-12". read_time stays "20分鐘閱讀" (7,610 / 400 → ceil 20, as the test derives it). title, url, date_display, categories, featured_image, all three FAQ q/a: byte-identical.
- H1, featured image line and inline image line (position between the intro paragraph and section 1) unchanged.
- No bold, no emoji, no inline links added or removed. 官方資料 (11 entries, same URLs and labels), 相關資訊 (3 links), closing rule, signature line 曾雋崴律師（Wei Tseng）: identical.

## Structure change (accepted)

Original section "7. 應選擇何種形式" contained choice paragraphs, then the exit paragraphs (第378/379/380條, subsidiary dissolution), then the experts paragraph. The rewrite splits it: "7. 退場：廢止登記與清算" (exit paragraphs, same order) and "8. 該選哪一種形式" (choice paragraphs, list, scenarios, restructuring, experts). Sections 1–6 headings unchanged. No paragraph was dropped by the split; the column still ends on the same "check after setup" sentence. tests.patch re-anchors the heading list and the 8-item list locator accordingly.

## Fact preservation, claim by claim

Intro
- Two forms commonly evaluated; both are ways to set up a Taiwan base; differences in contract party, debtor, third-party investment, profit-transfer procedure; comparing only setup convenience risks unforeseen liability/tax; judge over the whole business period → draft ¶1 → preserved. (One word restored by me, see tiny edits.)
- Subsidiary = independent legal person under Taiwan law, parent may be shareholder, separate rights/obligations subject; branch = part of the foreign company, no legal personality; "分支機構" naming note → draft ¶2 → preserved.
- Factors (行業、投資人組成、契約結構、許可、僱用人數、資金籌措、盈餘運用與回收、引進夥伴或上市、停止營業計畫); Korean parent must also check Korean accounting, tax, foreign-investment procedure → draft ¶3 → preserved.

Section 1 法人格與出資結構
- FAQ1 repeat (branch has no shareholders; to co-invest, evaluate a subsidiary and shareholder composition; 責任、表決權、資金籌措、許可與稅務 per 出資關係與事業計畫) → draft first paragraph (question + "不能。分公司是外國公司的一部分，本身沒有股東。") plus the first sentence of the paragraph after the table → preserved, relocated.
- 《公司法》第1條 definition; subsidiary distinct from parent; may lease, contract, employ, acquire property, be a litigation party; claims/debts belong to subsidiary 原則上; parent setting policy / appointing directors does not merge personalities → draft ¶ after the question → preserved, 原則上 kept.
- Liability depends on company type and conduct; 有限公司 shareholders limited to contribution 原則上 (第99條第1項); 第99條第2項 exception quoted verbatim; guarantee or tort participation adds liability; limited liability is a starting point, not a guarantee in every case → preserved. Article attached to the same claims; citation moved to end-parenthesis for 第1項 only.
- 第371條 no branch registration → may not do business in the foreign company's name; 第372條 allocate operating funds and designate a responsible person in Taiwan; funds are head-office funds, not branch shares/contribution; designation does not make the branch independent, it executes business and clarifies responsibility → preserved.
- Comparison table: all cells identical; header "比較項目" → "比較事項" (not a fact).
- JV paragraph: deciding only the ratio is not enough; full list of 11 items to agree; may be arranged within shareholder structure; other lawful forms (project-based contractual JV, SPV) so a subsidiary is not the only answer → preserved.
- Branch: ultimate legal subject is the foreign company; head office should fix contracting scope, bank authority, HR, reporting, budget approval, internal control; subsidiary: articles and organs, shareholder power allocation, parent–subsidiary service/loan/licence contracts, documented; substance over name → preserved.
- Licences: legal personality alone does not decide; industry rules on applicant, minimum capital, professionals, premises, foreign-investment review, responsible-person qualifications; registrability ≠ licensed business; break down activities, confirm contract party and licence holder → preserved.

Section 2 稅務與盈餘匯回
- FAQ2 repeat (5% VAT and 20% CIT generally apply; 21% domestic withholding on dividends to a foreign parent; 10% treaty cap when requirements met; branch remittance is not a dividend, 原則上 no additional withholding; head office outside Taiwan not subject to the 5% undistributed-surplus surtax filing) → draft lead keeps 5%/20%; 21%/10% in the dividend paragraph and table; no-extra-withholding in the remittance paragraph (as question + "原則上不用") and table; undistributed-surplus point in its paragraph and table → preserved, with every qualifier (一般, 原則上, 符合…要件時).
- VAT: indirect tax on sales of goods/services in Taiwan; 5%; bi-monthly filing 通常; zero-rate, exemption, special rates, input-credit vary by transaction; both must evaluate; 5% does not mean equal actual tax → preserved.
- CIT: on taxable income; 20% above the statutory threshold; not 20% of revenue; recognition, expenses, depreciation, loss deduction, credits, transfer-pricing adjustments; same revenue and rate may still give different results → preserved.
- Tax table: all cells identical; header "稅務項目" → "稅務事項".
- Dividend paragraph: separate subjects; 21% under domestic law; parent must be Korean resident, treaty-covered, beneficial owner etc. to evaluate the 10% cap; not automatic merely because recipient is in Korea; confirm residency certificate, beneficial-owner judgment, payment/filing timing, application or refund procedure per latest practice → preserved.
- Branch remittance: profit is part of the foreign company's profit, not another company's profit distributed to a shareholder; after CIT, remittance differs from a dividend, 原則上 no separate dividend withholding at branch level; interest, royalties, service fees, asset prices, payments to third parties judged individually → preserved.
- Undistributed surplus: subsidiary may face 5% surtax under 《所得稅法》第66條之9; per 財政部, head office outside Taiwan not subject to filing; this neither exempts the branch's Taiwan business from tax nor removes voucher obligations tied to remittance → preserved ("照樣課稅" = "不表示…不被課稅").
- Process over rate table; subsidiary's own books; reinvestment needs, dividend timing, shareholder loans/royalties change the result; branch must split Taiwan-attributable income/expenses and found head-office cost allocation; internal transactions' accounting and tax attribution evaluated → preserved.
- Transfer pricing may apply to parent–subsidiary transactions and head-office–branch cost allocation; documents and conduct consistent; head-office payment ≠ deductible branch expense; group contract amount ≠ automatic subsidiary expense; keep arm's-length evidence → preserved.
- Korea side: foreign tax credit, foreign-subsidiary dividends, branch income/losses, consolidated vs separate accounting, FX reporting; treatment of initial branch losses depends on Korean tax/accounting; cannot presume a branch lowers the Korean parent's tax; one comparison table → preserved.

Section 3 債務與法律責任
- Branch not a separate person; branch debts are the foreign company's; obligations from lease, sale, service, employment or loan contracts lawfully signed by the branch responsible person in the foreign company's name are borne by the foreign company 原則上; losses or insufficient branch assets do not cap liability at allocated funds → preserved (split into two paragraphs).
- Subsidiary: its contracts and debts are its own 原則上; 有限公司 shareholders per 第99條 principle within contribution; 股份有限公司 shareholders within subscribed shares; "this is the principle"; matters for high-risk, long-term, many-worker/consumer businesses → preserved.
- Subsidiary does not block all parent risk: guarantees to banks/landlords, parent assuming contracts or co-signing, commingling or abuse of personality to harm creditors → Company Act exception issues; boundary set by actual decisions and fund use, not only registration form → preserved.
- Directors, managers, Taiwan responsible person: personal liability for intentional/negligent torts, violations, false filings, safety breaches cannot be solved by company form; labour, withholding/tax, personal data, consumer, environment/product, licences follow each statute's subject and sanction; group division of labour must match documents → preserved.
- Contract stage clauses (責任限制、損害賠償、保證、擔保、準據法與爭議解決); insurable vs internally controlled risk; seal/e-signature authority, expense approval, customer verification, tax calculation and filing, regulatory reporting, incident reporting → preserved.
- "子公司安全、分公司危險" cannot summarise; guarantees, torts, abuse of personality, regulatory liability, group contracts determine actual exposure and controls → preserved. The original's middle sentence (branch = foreign company directly liable; subsidiary = independent person + limited-liability starting point) is dropped here as a restatement; both halves are stated in this section's first and third paragraphs. Acceptable.

Section 4 資金籌措與在台灣上市
- FAQ3 repeat → listing claims in the listing paragraphs; "符合公司法與證券交易所規定的要件" merged into the subsidiary-listing paragraph ("符合公司法的要件，以及臺灣證券交易所相應市場的標準"); tax-incentive claims in section 5 → preserved.
- Branch has no shares, cannot issue to third parties; funding via head-office allocation, support or lawful borrowing; "cannot issue equity" must not be read as "no financing at all"; borrowing, collateral, head-office guarantee, bank review, FX documents per transaction → preserved.
- Subsidiary may issue shares / increase capital per type and procedure; local partner, later-investor rights, preferred shares, employee equity; exit by share transfer, merger/split, strategic investor → subsidiary may fit; limits of Company Act, investment rules, articles, shareholder agreements → preserved.
- Branch cannot be a listing subject (not an independent issuer, no shares); the foreign company's own listing is a different question → preserved (framing sentence dropped).
- Subsidiary not automatically eligible; needs issuer form and TWSE market standards; full list of requirements; industry/foreign-investment limits, group restructuring, shareholder composition may affect → preserved.
- Sequence future funding and recovery; five questions; short-term vs long-term structures may differ → preserved.

Section 5 投資抵減
- Incentives not decided by organisation name; full checklist (納稅義務人資格 … 重複限制); credit distinct from taxable-income computation, not a full deduction of spend from tax payable → preserved; merged with the former last paragraph (applicant and actual investment relationship decide; subsidiary status no guarantee, branch status no automatic exclusion) → preserved.
- 《產業創新條例》第10條之1: investments 2025年1月1日至2029年12月31日; same tax year NT$一百萬元以上二十億元以下; company or limited partnership; statutory requirements and approval; self-use; brand new and actual use → preserved.
- Fields (智慧機械、5G系統、資通安全、人工智慧、節能減碳 hardware/software/technology/services); no automatic approval; document checks → preserved.
- Choose one method, no change once chosen; 5% of spend against current-year CIT, or 3% of spend over three years from the current year; annual cap 30% of that year's CIT under 第10條之1; combined with other credits confirm total cap and duplication; "30%" is not a 30% R&D refund → preserved.
- R&D under 第10條 etc.; confusing 第10條 with 第10條之1 misjudges spend, timing, caps; evaluate before investing (which article, authority and schedule, combinability); restructuring after signing/acquiring may miss deadlines or voucher requirements; confirm at planning stage → preserved.

Section 6 台韓所得稅協定與常設機構（PE）
- Signed 2021年11月17日, in force 2023年12月27日, applies from 2024年1月1日; relieves double taxation of residents of both areas; no automatic exemption; items to confirm → preserved.
- 10% caps on dividends, interest, royalties; recipient must be a resident of the other area and beneficial owner; residency certificate; application/filing/refund; conduit companies or PE-connected income need separate analysis → preserved.
- Business profits: no treaty PE → 原則上 exempt in the other area; PE → attributable profits taxable; test PE first, then attribution → preserved.
- Fixed-place PE (管理處所、分公司、辦事處); duration, disposal power, activities; a registered branch 通常 is a fixed-place PE, so branch profits are not automatically exempt → preserved.
- Construction/installation/supervision over 六個月; services over 183日 in any 十二個月 period; dependent agent habitually concluding contracts; each test covers different activities; ≤183 days does not negate a fixed place; ≤6 months does not negate an agent PE; full list to confirm → preserved (two paragraphs merged, nothing lost).
- Subsidiary not a PE merely by being a subsidiary; evaluate if it habitually exercises contracting authority for the parent or the parent does its own business at the subsidiary's premises; registration and treaty nexus judged separately → preserved ("子公司與常設機構也不是相同概念" dropped as restatement; carried by the next sentence).
- Keep execution records (days, premises, decisions, contract negotiation and signing, cost bearing, deliverables, fund flows); manage both filing schedules; avoid missing domestic procedures or TP documentation → preserved.

Section 7 (new) 退場：廢止登記與清算
- 第378條 application to cancel branch registration; obligations before the application do not vanish; settlement sequence → preserved.
- 第379條第1項 authority cancels; 同條第2項 creditors' rights and the foreign company's obligations unaffected; creditors may continue; disappearance from the register does not end past liability; disputed contracts/guarantees, audit period, record retention → preserved.
- 第380條 full cancellation → liquidate Taiwan rights/obligations; unpaid debts remain with the foreign company; same-subject principle at entry and exit; liquidator, creditor notice, filing, remaining funds per latest procedure → preserved.
- Subsidiary: Company Act dissolution and liquidation, not branch cancellation; shareholder resolution, liquidator, debt settlement, tax filing, distribution; parent cannot ignore personality and creditors and pull funds; the two processes and workloads differ → preserved.

Section 8 (new) 該選哪一種形式
- No form fits every case; subsidiary vs branch suitability; "can establish" vs efficiency across operations, tax, exit → preserved.
- 8-item comparison list → identical.
- Reflect later plans even with small initial scale; scenario comparison; table of funds, after-tax cash, liability, document/filing cost → preserved.
- Mid-life restructuring (branch → new subsidiary, subsidiary assets → group company) with consents, labour, licences, asset transfer, tax, FX; not a simple rename; design transfer clauses and IP rights → preserved.
- Experts in both places share the same facts; items to provide; periodic check after setup → preserved; column ends on this sentence as before.

Sources, related links, disclaimer, signature
- 官方資料 11 entries and 相關資訊 3 links: identical. Disclaimer: same content (educational, not case-specific legal/tax advice; variation by 投資人與本公司所在地、事業內容、交易與資金流向、協定適用要件、主管機關最新實務; confirm before 設立、投資、簽約、分配股利或匯款), lightly reworded. Signature identical.

Nothing added: no new facts, examples, cases, numbers, first-person stories, promises or sales lines. The two reader questions are taken from FAQ1 and FAQ2.

## Blocking issues

None.

## MONOTONY items

None at blocking level. Section 5 self-check: tool FAIL 0; opener is a factual statement, not a stock hypothetical; very short sentences present ("不能。", "原則上不用。", "這是原則。"); paragraph-start words within limits (tool opener_rep 0.109); no three consecutive claim→caveat paragraphs and several citation-free paragraphs; contrast templates 1; last body paragraph ends on the column's own advice; no bold, no invented first person, no checklist headings. Register is Taiwan usage (沒辦、兩回事、走的是、擋下來), with statutory 應/須/不得 kept where the statute speaks.

Minor, non-blocking: "分歧在後面：盈餘怎麼離開台灣，以及盈餘留著不分配時怎麼課。" is a short preview sentence. It is one line and the section delivers both points, so left as is.

## Tests verdict

OK. tests.patch touches only src/lib/__tests__/columns-zh-investment-004.test.ts. It updates lastmod/date to 2026-10-12, the inline-image anchor phrase, the FAQ-echo test (now checks FAQ1/FAQ2 leads as first paragraphs, FAQ3's listing paragraph inside section 4 and the credit lead inside section 5, and that each FAQ answer appears exactly once in the raw file), the ten-heading list, the section-8 list locator, and every pinned phrase for 第1/99/371/372/378/379/380條, 5%/20%/21%/10%, 第66條之9 5%, 2025–2029 window, NT$1M–2B, 5%/3% methods, 30% cap, 第10條 vs 第10條之1, treaty dates, 10% caps, PE tests, and the Han count (7,953 → 7,610, verified against the final draft). Every assertion that locked a legal fact, number or citation still locks it under the new wording. No .skip/.only; no other column's test changed. vitest-1.log: 80 files, 1,096 tests passed, including columns-zh-investment-004 (14 tests).

## Tiny edits applied (by this reviewer)

1. Intro, first sentence: "最常評估的是兩種形式" → "經常評估的是兩種形式". The original said 經常 (often); 最常 (most often) overstated it. Character count kept equal so the pinned Han count (7,610) is unchanged. Guard re-run: GUARD: PASS. Variety re-run: OK.

## Original issues (not blocking)

- TWSE source URL ends in "standars.html" (sic) in both original and rewrite; worth a link check before or after publication.
- The column has no contact e-mail and no source-check date; the guard reports these as pre-existing house-format tolerances.
- Other language versions of this column still use the original single "7. 應選擇何種形式"-style section; heading structure now differs across languages (facts, numbers and citations do not).
