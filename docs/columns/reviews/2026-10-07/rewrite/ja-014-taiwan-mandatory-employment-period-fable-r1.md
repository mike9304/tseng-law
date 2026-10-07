# Final review r1 — ja-014-taiwan-mandatory-employment-period (Claude Fable 5.1, 2026-10-06)

VERDICT: PASS (with four tiny reviewer edits, listed in section 7; tests.patch must be re-synced because of them, see section 6)

## 1. Scope checked

- Read in full: orig.md, draft.md, guard.txt, notes.md, tests.patch, tests.txt, claude-tests1.log, log, SENTENCE-VARIETY-RULE.md (all, incl. sections 5–6), rules/COLUMN-VOICE-RULE.md, rules/brief-EDITORIAL-VOICE.md, LESSONS.md, guard.py, lint.py, item.sh.
- `~/agent-library/knowledge/editorial-voice.md` is outside this session's readable directories (Read returned "File does not exist"). I used the lane copy `rules/brief-EDITORIAL-VOICE.md` instead.
- Compared orig and draft paragraph by paragraph, all sections including front matter, lists, links, disclaimer, signature.
- Commands run (after my edits):
  - `python3 guard.py orig.md draft.md ja taiwan-mandatory-employment-period --today 2026-10-06` → `GUARD: PASS` (length 8801 -> 8122, 92%; monotony 36.5 -> 10.2; contrast 11 -> 0; questions 0 -> 3; tolerated pre-existing lint: contact email missing).
  - `python3 variety_metrics.py check draft.md --lang ja` → no FAIL. `sentences=191 cv=0.464 short=0.126 run3=0.09 cite_end=0.0 contrast=0 caveat=3 q=3`; one WARN (89% です・ます endings, which is the required register).
- Not done: I did not open law.moj.gov.tw or laws.mol.gov.tw. The law itself was not re-verified (see section 8). Japanese naturalness is my own reading as a model, not a native-speaker or lawyer review.

## 2. Front matter, H1, image

Line-by-line comparison of lines 1–24: only `lastmod` ("2026-07-25" → "2026-10-06") and `read_time` ("約17分" → "約16分") differ. Title, url, date_display, categories, featured_image, all four FAQ q/a, H1 and the image line are byte-identical. read_time 16 matches the test's own formula (ceil(visible Japanese chars / 500)).

## 3. Fact preservation, section by section

Format: original point → place in rewrite → result.

### Intro
- Clause = promise to work a set period, plus whether training cost / sign-on bonus / retention bonus must be returned and whether a separate penalty can be claimed → P1 sentences 2–3 → preserved.
- A signed text alone does not fix validity or the repayment amount → 「答えは、署名の有無だけでは決まりません。条項の効力も返還額も…」 → preserved.
- Look at statutory requirements and the actual payment / training / termination history, not the contract label → 「法定要件と、実際の支給・研修・契約終了の経緯を順に確かめて…契約書上の名称は、決め手になりません。」 → preserved.
- Four questions (Art. 15-1 requirements; reasonable period and burden; attribution of termination; notice and repayment scope) → list, same order; item 3 「労働契約終了」 → 「契約終了」 → preserved.
- Same contract, different provisions and evidence; examine validity, effective time of resignation, repayment liability, actual separate damage separately → P3 → preserved.
- Added: opening reader question 「署名した最低勤務期間条項は、そのまま有効なのでしょうか？」 and 「一つの条項に、四つの問題が重なっています。」. No new fact; the second replaces 「次の四つの問題を混同しないことが重要です」.

### 最低勤務期間条項が有効になる条件 (orig 1)
- Art. 15-1 para. 1 sets two alternative requirements → 「法定要件は二つです。…第15条の1第1項が、どちらか一方を選べる形で定めています。」 → preserved, article and paragraph attached to the same claim.
- (a) employer provides professional-technical training and bears the cost → preserved.
- (b) employer provides reasonable compensation for keeping the minimum period → 「最低勤務期間を守らせるために、使用者が合理的な補償を提供した場合」 → preserved (matches the FAQ wording 「遵守するよう」; 「対価」 is kept in the compensation section as 「約束に対して」).
- Meeting one "may satisfy" the requirement (満たす可能性があります); both not needed → preserved, qualifier kept.
- Actual basis counts, not the contract label → preserved.
- Besides one requirement, a separate reasonableness review (para. 2: period and scope of liability; training period and cost, replaceability, amount and scope of compensation, other circumstances) → P2 → preserved.
- Formal mention of one requirement does not make the clause automatically valid → preserved.
- Clause against para. 1 or para. 2 is void under para. 3; the rule is a standard for reviewing each clause, not a blanket valid/void rule → P3 → preserved (this also carries the FAQ-1 answer "not automatically void").
- Signature shows agreement but does not replace the requirements; long period alone is not conclusive; look at investment/compensation and why the period was set → P4 → preserved.
- Cut: the verbatim FAQ-1 answer as first paragraph and the restatement in orig P3. Repetition only; every element is in P1–P3.

### 研修を根拠にする場合 (orig 2)
- Training actually provided to that worker and cost borne; plan label or estimated cost in the contract is not enough; link theme, expertise, period, completion, actual spending with documents → P1 → preserved.
- Direct costs (outside lecturer, tuition, materials/equipment) and the basis for claimed internal cost; whose time, difference from ordinary supervision/handover, basis for attributing to this worker; estimates or flat allocations alone do not prove the burden → P2 → preserved.
- Basic documents (curriculum, schedule, attendance, evaluation, certificate, invoice, receipt); contract with the institution, payment slips, refund terms; worker's own payment or third-party subsidy → who finally bore the cost → P3 → preserved.
- Boundary not decided by place or provider alone; in-house may qualify, long external course may be general onboarding; no blanket exclusion, no qualification by price/length alone → P4 → preserved after tiny edit 1 (modality restored).
- Relation between period and investment must be explainable; skill and its relation to the job; why this period; whether the worker actually did the job afterwards and how long already served → P5 → preserved. 「どのような能力を習得させるのか」 is folded into 「習得させる能力は対象職務とどう関連するのか」.

### 補償を根拠にする場合 (orig 3)
- Reasonable compensation for the promise; purpose and structure distinct from ordinary wage; payslip label does not decide legal nature → P1 → preserved.
- Purpose first (general wage term / consideration for a retention promise / performance reward) must be stated in the contract and notice documents; payment date, amount, vesting time, relation to the period, repayment events, formula understandable before contracting → P2 → preserved.
- MOL guidance of 2026年6月5日: role of retention bonus / sign-on bonus / other prepaid benefits must be clearly notified; later re-reading or re-labelling of wage "can hardly" replace notice at the time of contract → P3 → preserved (「指針は…と説明しています」 → 「指針によれば…」, attribution kept; 「困難です」 kept).
- Reasonableness not by amount alone (actual extra benefit, clear conditions, portion for time served, repayment not excessive); compensation does not permit unlimited period or liability → P4 → preserved.
- Consistency of clause and actual payment (late, instalments, conditional, net amount, separate written notice) → P5 → preserved.

### 合理性を測る四つの要素 (orig 4)
- Even with one requirement met, period and liability must stay reasonable; para. 2 gives four factors, no blanket answer by name or occupation → preserved; list identical.
- Factor 1 (actual length and cost; itemised evidence, per-worker share, skill gained, investment already recovered) → preserved.
- Factor 2 (not decided by the employer's claim of hiring difficulty; availability, qualifications, usual hiring time, objective material) → preserved.
- Factor 3 (amount and scope; when paid, vesting, correspondence to the whole period, time served reflected on early end; same label may be assessed differently) → preserved.
- Factor 4 (how the clause was concluded, nature of work, explanations, actual service, reason for termination; weight "may differ"; examples not exhaustive; examine all recorded facts) → preserved, qualifiers kept.
- Proportionality among period, investment, replacement difficulty, compensation and repayment burden; no pre-judging by occupation, no transplanting another case; design at signing and performance at termination → preserved.

### 根拠にならない研修 (orig 5)
- Guidance of 2026年6月5日: cost of routine training, general job training, new-hire orientation and legally mandatory training cannot ground the clause, a penalty or a cost-repayment claim; check curriculum, technical content, period, cost actually borne and evidence → P1 → preserved.
- 勞動關2字第1150141814號 guidance treats the four types separately; they accompany business operation or statutory duties, so their cost cannot be turned into a basis for a retention duty or a sanction (趣旨) → P2 → preserved. The four types are named once in P1; P2 keeps the two descriptive glosses (orientation to workplace and procedures; training the employer must give by law) and refers back with 「これら」. Number appears once, attached to the same claim.
- Ordinary new-hire content judged by substance; general hiring/management/handover cost cannot be relabelled as a separate investment → P3 → preserved (「できるわけではありません」 → 「できません」; same strength as the guidance statement in P1, no overstatement beyond the original's own claim).
- In-house alone is not always excluded; mixed programmes split by course (theme, hours, cost, statutory duty); the party asserting technical training must explain the difference and who paid → P4 → preserved.
- Practice: compare detailed contents and actual records; routine vs qualification/equipment training vs mandatory; actual attendance; claimed amount vs evidence → P5 → preserved.

### 奨励金の返還と期間満了前の退職 (orig 6)
- Not always full repayment; purpose must have been clearly notified; guidance of 2026年6月5日: repayment calculated by unperformed period, full repayment must not be demanded; conclusion depends on purpose, clause, time served, reason for termination → P1 → preserved.
- Notice cannot first appear after a dispute; worker must be able to know at contract time and at payment time (AND kept) which money, whole period, vesting, settlement formula → P2 → preserved.
- Proportional calculation needs start/end date, actual service days, base amount; a fixed amount ignoring time served must be examined against the guidance; instalment/vesting structures calculated per payment → P3 → preserved (「例えば」 kept).
- Order of review (validity, legal nature, time served, reason, formula); the word 「違約金」 does not fix the amount → P4 → preserved.
- Full-repayment clause, fixed penalty unrelated to loss, unilateral wage deduction are separate questions (basis, agreement, labour-law limits, lawfulness of deduction); invoice amount or partial payment does not settle the rest → P5 → preserved.
- Training-cost repayment vs prepaid-benefit repayment; check double counting → P6 → preserved.

### 労働者の責めに帰すことのできない事由による契約終了 (orig 7)
- Art. 15-1 para. 4: termination before expiry for a reason not attributable to the worker → no liability for breach of the clause and none for training cost; attribution judged on concrete evidence (dismissal notice, resignation, material on breach of working conditions) → P1 → preserved; paragraph number attached to the same rule.
- Early end alone is not a breach; who declared what, legal basis, to whom the real cause is attributable → P2 → preserved.
- Evidence list; health/work reasons not decided by wording alone → P3 → preserved.
- Dismissal, agreed termination, alleged breach are examples, not a closed list; label and facts may differ → P4 → preserved.
- Attribution before formula; if para. 4 applies neither liability can be imposed; other claims examined separately → P5 → preserved.

### 退職予告と契約が終わる時期 (orig 8)
- Clause does not physically or legally prevent resignation; notice decides when the relationship ends, the clause concerns financial liability → P1 → preserved.
- Indefinite-term contract ended by the worker: Art. 15 applies the Art. 16 para. 1 notice periods mutatis mutandis; Art. 16 is the employer-termination rule → P2 → preserved, articles attached correctly.
- 3 months to under 1 year: 10 days; 1 to under 3 years: 20 days; 3 years or more: 30 days → list identical.
- Fixed-term contract for specific work exceeding 3 years: separate rule in Art. 15; after 3 years' service, 30 days' notice; distinguish from the indefinite-term rule → P4 → preserved.
- Under 3 months, other fixed-term types, alleged immediate-termination grounds: examine individually; a longer contractual notice period or a demand for immediate handover does not decide the result → P5 → preserved after tiny edit 2 (「より長い」 restored).
- Keep content and date of the resignation notice, date the employer actually received it, communications on the last working day; split into four questions → P6 → preserved.

### 契約書のほかに必要な資料 (orig 9)
- Timeline of training, payment, service, termination material; table of performed/remaining period and cost-to-document mapping → preserved.
- Employer items 1–8 → two prose paragraphs, all eight present in the same order (basis; training types by content/period/purpose; training records with external/internal cost separated; compensation purpose/date/amount/vesting/notice/formula in writing; basis for the period, replaceability, need vs investment; proportionality and time served in settlement; termination cause and attribution before calculating dates; cross-check before deduction or demand, legal basis and procedure). Item 4's 「明確に」 restored by tiny edit 4. 「研修が根拠なら／補償が根拠なら」 are connective glosses, no new duty.
- Standard-form caution (no mechanical same period/amount; design from actual investment, compensation, replaceability; notify purpose and formula before contracting) → preserved.
- Worker items 1–8 → three prose paragraphs, all eight present in order.
- Timeline dates (contract date, training start/end, each payment date, service start/end, notice date); if the employer alone holds material, organise own material and the calculation basis first, then seek more through the necessary procedure → preserved after tiny edit 3 (「通知の伝達日」 restored).

### 関連情報 / 公式資料 / closing
- Three internal links: same labels and targets. Four official links: same labels and URLs, same order. Section order swapped (関連情報 now before 公式資料). No link lost; see section 6 for the judgment on the swap.
- Disclaimer: educational, not legal advice on an individual case; validity and liability may differ by contract type and wording, actual training and cost, purpose and notice of compensation, service period, cause of termination, evidence; check the latest official material and individual circumstances before resigning, deducting from wages, agreeing a repayment or handling a dispute → all elements present, 「異なることがあります」 kept.
- Signature 「曾雋崴弁護士（Wei Tseng）」 unchanged. No contact e-mail line in the original either; none added. No sales line added.

### Additions check
No new fact, number, case, example, first-person statement or promise. New sentences are reader questions (3), short connectives and restatements. Numbers in body: 15の1, 15, 16, paragraphs 1–4, 10/20/30 days, 3か月/1年/3年, 2026年6月5日, 1150141814 — all present and attached to the same statements.

## 4. Blocking issues

None remaining after the tiny edits in section 7.

## 5. Voice and monotony

Tool: no FAIL. Rule section 5 items:
- 2 (opener): met. First sentence is a reader question, no stock hypothetical. Other ja items in this batch open with a fact (004, 016) or fact-then-question (002), so the type is not over half.
- 3 (short sentences): met (12.6% short; e.g. 「法定要件は二つです。」「計算式はその後です。」).
- 4 (paragraph starts): met. No word starts three paragraphs apart from the 一つ目〜四つ目 enumeration.
- 5 (claim → caveat rhythm): met. ただし twice, もっとも once; most paragraphs carry no citation.
- 6 (contrast templates): met by the tool's count (0).
- 7 (ending): met. Last body paragraph ends on the timeline and the employer-held documents; no sales closing. The disclaimer is the original's, shortened.
- 8 (register): です・ます throughout, no bold, no emoji, no first person, headings are noun phrases (numbering and 「チェックリスト」 removed).

Non-blocking observations (one soft item at most, so no MONOTONY rejection):
- MONOTONY (soft): repeated negative frame — 「…だけでは決まりません／足りません／結論は出ません」 appears on about 20 lines of the body (e.g. 「契約書に「違約金」とあっても、それだけで請求額は決まりません。」). The original has the same count; each instance is a separate legal caution, so removing them would drop content. If a later pass touches this column, vary two or three of them into positive statements of what does decide the point.
- The cleft 「〜のは…です」 (「見るのは…」 twice, 「最初に確かめるのは…」, 「先に確認するのは…」) and runs of embedded questions ending in 「〜か。」 recur in about eight paragraphs each. Readable, but noticeable.
- 「勞動關2字第1150141814號の台湾労働部指針は、…も含め、これらを区別して扱っています。」 is slightly stiff; meaning is clear and the sentence is pinned by the tests, so I left it.

## 6. Not padded; tests

- Length 8801 → 8122 (92%). Cuts are the verbatim FAQ answers repeated in the body, the restated either/or paragraph in section 1, the second listing of the four training types, list numbering. No legal point removed.
- tests.patch (2 files, both specific to this column; full suite 92 files / 1189 tests passed at 16:44 before my edits): acceptable.
  - Re-anchors lastmod, read_time, headings, H3s, intro, each section's locked phrases, disclaimer, EOF block, byte lengths and SHA-256, character counts.
  - Legal locks kept with new wording: Art. 15-1 paras. 1–4, void under para. 3, 2026年6月5日 guidance (now locked in section 5 in addition to the document number), 勞動關2字第1150141814號 (count 1), 10/20/30-day list, 3-year rule, four official links and three internal links in order.
  - Test 5: the body no longer repeats FAQ answers verbatim, so it now requires each answer exactly once (front matter) and the legal facts in the H2's first paragraph. The removed structure was removed on purpose.
  - Test 15: the two `toHaveLength(8)` checks are gone because the numbered lists became prose; all 16 evidence categories are still locked in order, now per H3. Acceptable.
  - Test 18 / 16 / 17: follow the section swap. The swap is acceptable: the original failed the lane lint rule "last ## heading should be the sources section", the rewrite satisfies it, and no link or label changed. This answers the test syncer's question in claude-tests1.log.
  - No `.skip`, `.only`, `.todo`; no other column's assertions touched.
- Consequence of my edits: the pinned tail byte length / SHA-256 in `columns-ja-labor-014-intro-closing-sync.test.ts` and the counts `visibleJapaneseCount` 7,658 / `visibleKanaCount` 3,518 in `columns-ja-labor-014.test.ts` no longer match draft.md. `item.sh finish()` re-runs the test sync when draft.md is newer than `.tests-ok`; that re-sync should change only those numbers and hashes (none of the four edited phrases is pinned as text). read_time stays 約16分 (about 7,662 characters / 500).

## 7. Tiny edits applied (4)

Each restores the original's wording or modality; no fact, number, citation or structure changed. Guard re-run: PASS.
1. 研修 section P4: 「実際には一般的な導入研修だったこともあります。」 → 「実際には一般的な導入研修であることもあります。」 The past tense read like a report of past cases; the original says 「であることがあります」.
2. 退職予告 section P5: 「契約書に長い予告期間が書かれていることや」 → 「契約書により長い予告期間が書かれていることや」 (original: 「より長い予告期間」, i.e. longer than the statutory period).
3. Last body paragraph: 「通知が届いた日」 → 「通知の伝達日」 (original term; the column itself separates 伝達日 from the date the employer actually received the notice).
4. 使用者の側 P1: 「書面で結び付けておきます」 → 「書面で明確に結び付けておきます」 (original: 「書面上明確に関連付けます」).

## 8. Original issues (not blocking; unchanged by the rewrite)

- Law not re-opened in this review. From my recall, Art. 15, Art. 16 para. 1 (10/20/30 days) and Art. 15-1 paras. 1–4 read as the column states. 確認必要 if anyone relies on this note.
- The Ministry of Labor guidance (2026年6月5日, 勞動關2字第1150141814號) is taken from the original and was not verified here. The column never says in one sentence that the dated guidance and the numbered document are the same instrument (same in the original).
- The official-source link for that guidance is a list-position URL (`FLAWDOC03.aspx?cnt=926…recordno=10…`). Such URLs can point to a different record when the list changes; a stable document URL would be safer. Pinned by tests, so changing it needs a separate pass.
- No contact e-mail and no explicit source-check date in the sources section (house format of the original; tolerated by the guard).
- FAQ answer 1 starts with 「いいえ。」 in the front matter; kept as published.
