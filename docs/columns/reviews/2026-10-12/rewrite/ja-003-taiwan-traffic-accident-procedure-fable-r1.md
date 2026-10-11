# FINAL REVIEW r1 — ja-003 taiwan-traffic-accident-procedure (Claude Fable 5.1, 2026-10-12)

## Verdict

PASS. The rewrite preserves every legal statement, condition, deadline, amount, article reference and source entry of the published original, reads as natural です・ます Japanese with a far less mechanical rhythm, is the same length, and the tests.patch only re-anchors pinned wording of this column. One tiny edit applied by the reviewer (listed below); guard and variety check re-run and still PASS.

## Scope checked

- orig.md vs draft.md, full text, claim by claim (intro, Q1–Q15, three 公式資料 lists, related links).
- guard.txt (GUARD: PASS) and guard.py re-run by me before and after my edit: PASS both times (length 6418 → 6410, monotony 27.5 → 10.4, contrast 7 → 1).
- variety_metrics.py check --lang ja: sentences 143, cv 0.47, short 0.126, run3 0.021, opener_rep 0.102, cite_end 0.028, contrast 1, q 1. No FAIL. One WARN (94% desu-masu endings; the original was 93.5%; inherent to the register).
- notes.md, tests.patch, tests.txt, vitest-1.log (85 files / 1440 tests passed with the draft and patch applied in the worktree, per the harness log; I could not diff the worktree file directly from this sandbox).
- Rules: SENTENCE-VARIETY-RULE.md §5–6, COLUMN-VOICE-RULE.md, LESSONS.md (skimmed).

## Front matter, H1, images

Only `lastmod: "2026-10-06"` → `"2026-10-12"`. title, url, date_display, read_time (約11分), categories, featured_image, diagram, diagram_after unchanged. H1 and both image lines byte-identical. Q7 heading (referenced by diagram_after) unchanged.

## Fact preservation — claim by claim

Legend: ✓ preserved (same meaning), ~ reworded with same meaning, note = comment, no blocking change.

### Intro
- Secure safety → report/notify → preserve evidence → then check deadlines, fault, settlement scope: ✓ ("確認する必要があります" → "確かめます", instruction kept).
- Based on Taiwan law and public guidance; responsibility/procedure vary; no guarantee of result or amount: ✓ verbatim.
- note: "交通事故が起きたら" → "交通事故に遭ったら". Natural Japanese for being involved in an accident; not a legal shift.

### Q1 現場を離れてもよいか
- Injury/death accident: driver must immediately rescue, notify police, preserve vehicle and scene evidence: ✓ verbatim.
- Other party's informal consent or recording does not permit leaving before measures done: ~ ("だけでは" → "があっても").
- Injury accident with consent of all parties: mark positions/traces, then move vehicle out of traffic; this does not replace rescue/notification: ✓ verbatim (paragraph merged with the next, text unchanged).
- Property damage only, vehicle movable: mark, photograph/video, move promptly as a rule: ✓ verbatim.
- Leaving without necessary measures → administrative sanction, 道路交通管理処罰条例第62条 with link: ✓ verbatim.
- 刑法第185条の4: criminal liability for driver who leaves after injury/death accident; application judged case by case on circumstances and measures taken: ~ (now "刑事責任もあります（刑法第185条の4）。対象は…運転者で、実際の適用は…"). The injury/death qualifier is kept in the immediately following clause; article attached to the same claim.

### Q2 証拠の保全
- Safety first, warning triangle; 119 rescue, 110 police, 112 when 110/119 unreachable, press 0 → 110, press 9 → 119; NFA link: ✓ (link moved from bare trailing link into parentheses, same URL).
- Wide + close photos; positions, damage, markings, signals, weather; witness contacts; CCTV and dashcam preservation; party/vehicle/insurance info and medical records: ✓ verbatim.
- Own photos useful but no substitute for police handling in injury/death cases: ~ (split into two sentences).
- 交通事故当事者登録連絡票 at scene; 現場図・現場写真 after 7 days; 初期分析判断表 after 30 days; confirm with the police authority: ✓.

### Q3 請求と期限
- Heading "確認すべきですか" → "がありますか": wording only; tests re-anchored.
- 刑法第284条 (linked) 過失傷害・過失致重傷; 刑法第287条 親告罪; 刑事訴訟法第237条, 原則として criminal known-date + 6 months: ✓ ("告訴には期限があります。" added as lead sentence; restates, adds no fact).
- 民法第197条: 2 years from knowing damage and obligor; 10 years from the tort: ✓ (split into two sentences, both start points kept).
- 刑事訴訟法第487条 附帯民事訴訟; 第488条 until close of oral argument in 2nd instance; not after close of 1st-instance argument before appeal: ✓ verbatim.
- Usually no separate court-fee advance, but not every outcome is free; example 無罪・免訴・不受理 + plaintiff's motion → transfer to civil division → fees under 第503条; 第504条 on transfer/procedure: ✓ (reviewer smoothed the "費用がかかる場合" sentence, see edits).
- Choice depends on interruption of prescription, defendants, evidence, insurance, jurisdiction: ✓ (reordered).

### Q4 双方過失
- Both at fault ≠ automatic 過失傷害罪; criminal liability requires each party's duty breach + causation + injury of the other: ✓ (sentence order swapped, content identical).
- 過失致死 → 刑法第276条 (linked); sentence not predictable in months; 刑法第41条 (linked) conversion to fine has requirements and exceptions: ✓ verbatim.
- 民法第217条 reduction/exemption when victim's fault contributed to occurrence or expansion; example NT$1,000,000 × 50% → NT$500,000, before other adjustments: ✓ verbatim. note: "これが過失相殺です。" added as a gloss; the original itself uses 過失相殺 for 民法第217条 in Q12, so this is a term already in the column, not a new fact.
- Appraisal/initial analysis important but not mechanically binding; court weighs all evidence: ✓.

### Q5 示談書
- Contents: date/place/parties, amount and timing, insurance, included vs reserved claims: ✓ ("記載しておくとよいでしょう" kept).
- Must define: future treatment, later-discovered injuries, delivery of documents such as diagnosis, relation of payment to withdrawal of complaint: ✓ (necessity kept via "明確に定める必要があるのは").
- 民法第736条・第737条 settlement = mutual concession contract; rights extinguished only within waived scope: ✓.
- 刑事訴訟法第238条 withdrawal before close of 1st-instance argument; no re-filing; non-親告罪 such as 過失致死 not ended by private settlement; settlement does not oblige withdrawal: ✓.
- Q1–Q5 公式資料 list (17 entries): byte-identical.

### Q6 責任認定
- 初期分析判断表 = preliminary analysis from scene materials; not a judgment; not binding; does not fix fault ratio; table/appraisal/review neither automatic nor mandatory: ✓ (split into shorter sentences).
- Eligible parties may apply for appraisal; referral by handling agency or commission by judicial organ; direct application usually within 6 months of accident; pending investigation/trial → check judicial commission procedure; 手続規定第3条 link: ✓ (link moved into the first sentence as 関連規定（…）, same URL).
- 刑事訴訟法第208条: during criminal trial parties may directly commission appraisal/review at own cost; distinct from committee application; choose by stage and addressee: ✓ (link now inline once, same URL).
- Review (覆議) via normal direct application: within 30 days from the day after receiving the opinion, with reasons; only once; cases already in judicial proceedings → transfer procedure and deadlines via the court; 手続規定第10・11条 link: ✓ (link now after the "1回に限られます" sentence, written 第10条・第11条, same URL).
- Appraisal/review opinions are evidence or reference; court evaluates whole record independently: ✓ (split paragraph).

### Q7 請求できる損害
- 民法第184条: unlawful infringement, causation, proof of damage are prerequisites; accident alone ≠ all items granted; 民法第216条 standard for actual loss and lost profits: ✓. note: lead "請求の根拠は民法第184条です。" generalises slightly; 184 is the general tort basis the original already relies on.
- 負傷 bullet: 民法第193条 medical, increased living costs (care, transport, aids), lost income from actual inability to work, reduced earning capacity; 民法第195条 non-pecuniary: ✓ ("に従い" → "に基づく").
- 死亡 bullet: 民法第192条 pre-death medical/increased costs where applicable, funeral, lost support for persons legally entitled; 民法第194条 non-pecuniary for certain relatives: ✓.
- 財産 bullet: 民法第196条 diminished value; repair cost as the standard within the proven necessary range; depreciation deducted for new parts: ✓ (split sentence).

### Q8 継続治療の医療費
- Keep receipts, diagnoses, records; organise medical necessity and causation per treatment: ✓.
- Supplement evidence along court schedule and within submitted claim scope; no guarantee all late materials or expanded claims are admitted: ✓ (quantifier placement changed, same meaning: not all guaranteed).
- Adding medical materials ≠ changing/increasing claim amount; adding receipts after 附帯民事訴訟 does not by itself trigger court fees: ✓.
- After transfer to civil division under 刑事訴訟法第504条, expanding beyond the pre-transfer scope → fee issue for the excess: ✓ (paragraphs merged, "ただし" → "問題になるのは移送後です。").

### Q9 介護費
- Diagnosis/medical opinion useful but not decisive; must show causation, need, actual provision, duration, reasonable amount: ✓.
- Unpaid family care may be assessed as damage depending on the case; not automatic; content, duration, usual cost level considered: ✓ (reader question inserted; both conditions "無償で" and "実際に介護" kept).
- Q6–Q10 公式資料 list (14 entries): byte-identical.

### Q10 交通費
- Organise with treatment records and link to the injury; route, dates/frequency, means, fare, necessity/reasonableness of the means matter: ✓.
- Receipts, fare records, route records, medical materials all possible evidence; taxi receipts neither the only method nor automatically sufficient: ✓ (one sentence).

### Q11 逸失収入
- Must prove inability to work (full/partial) during treatment/recovery due to the injury and actual income loss; diagnosis/rest advice important start but not enough: ✓ ("それだけで請求が認められるわけではありません" → "それだけでは十分ではありません", same effect).
- Records: medical, attendance/leave, salary and tax, employer confirmation; self-employed: sales, transactions, tax filings: ✓.
- Continued work / unchanged salary relevant to recovery-period lost income; earning-capacity loss not automatically decided by that fact alone, nor judged on that fact alone; dealt with in Q12: ✓ both propositions kept (test's approved paragraph updated verbatim).

### Q12 労働能力低下
- Distinct from Q11 actual income loss; 民法第193条・第216条; causation, lasting impairment, occupation/ability, expected income, working period: ✓ verbatim.
- Unchanged salary does not exclude the claim; disability rate or current salary alone does not mechanically fix the amount: ✓ ("決まる" → "算定される").
- Medical appraisal useful when impairment genuinely disputed, not required in every case; 民法第217条 過失相殺 and other adjustments: ✓.
- Lump sum → interim-interest deduction may apply; 司法院 Hoffmann calculator is only an aid, not legally mandated, no guaranteed result; 民法第193条 periodic payments with security on application: ✓.

### Q13 慰謝料
- 民法第195条 unlawful infringement of body/health as prerequisite; court fixes a reasonable amount: ✓.
- Factors: injury/treatment, lasting effects, suffering and life impact, age and status, social/economic circumstances, parties' evidence; no fixed range predicts outcome: ✓ (および → と/そして).

### Q14 使用者責任
- 民法第188条 employee's unlawful damage in execution of duties; working hours alone ≠ job-relatedness: ✓ ("根拠は民法第188条です。" lead added, restates).
- Claim against employer and employee jointly; employer's defence of due care in selection/supervision or unavoidability; recourse against employee: ✓ verbatim (test-locked paragraph unchanged).
- If employer proves the defence → 民法第188条第2項 relief: on victim's application court may order full or partial compensation considering both parties' economic situations: ✓ ("前述の" → "この").
- Civil defendants vs criminal liability distinct; 刑法第284条 judged per natural person's own breach and causation: ✓.

### Q15 自動車保険
- Heading reworded to a two-part question ("…があり、どの資料で確認しますか？"); the body answers it (保険証券と約款). No fact added.
- 強制汽車責任保險法第6条 duty on owner in principle, on user/manager where provided; no-fault statutory benefits for injured/killed; check scope of covered passengers / third parties outside the vehicle; 第28条 no payment where accident caused by victim's or other claimant's intent or criminal act: ✓.
- Single-vehicle driver excluded from own vehicle's compulsory cover in principle; multi-vehicle: may claim from other vehicles' insurers: ✓ ("ただし" dropped, condition kept).
- Benefit standard amended 2026-05-29, applies to accidents on/after 2026-07-01; medical NT$200,000; disability 15 grades NT$80,000–NT$3,000,000; death NT$3,000,000; combined cap per victim per accident NT$3,200,000; earlier accidents may fall under the old standard: ✓ (split into short sentences, all digits identical).
- Voluntary covers (third-party liability bodily/property, driver injury, own damage) depend on policy terms: insured, limits, deductibles, exclusions, fault; check policy and terms; insurer scope, documents, notice deadlines: ✓ verbatim.
- Q11–Q15 公式資料 list (13 entries): byte-identical. Related links (3): byte-identical.

### Additions audit
No new law, example, case, number, first-person story, promise or sales line. Three lead-in sentences ("告訴には期限があります。", "請求の根拠は民法第184条です。", "根拠は民法第188条です。") and one gloss ("これが過失相殺です。") restate content the original already contains. One reader question in Q9 restates the original's own condition.

## Blocking issues

None.

## MONOTONY items

None blocking. Rule §5 self-check: (1) tool FAIL 0; (2) opening is a plain factual instruction, no 例えば…とします formula; (3) very short sentences present ("告訴には期限があります。", "不法行為の時からは10年です。", "これが過失相殺です。", "覆議は1回に限られます（…）。"); (4) paragraph openers: no word opens three paragraphs; (5) "ただし" now once, "もっとも" once, many citation-free paragraphs (Q2, Q8–Q11); (6) contrast template count 1; (7) last paragraph ends on this column's own facts, no stock disclaimer or sales close (the original has no contact line; house format tolerated by the guard); (8) です・ます throughout, no bold, no emoji, Q headings are reader questions as in the original.

Residual observation (not blocking): the Q15 heading "どのような給付・補償があり、どの資料で確認しますか？" is slightly heavier than the rest of the Q headings; acceptable, and locked by tests.patch.

## Length / padding

6418 → 6410 characters (guard count). Cuts were only duplicated connectives ("ただし", "点に注意が必要です", "また") and sentence splits; no legal point removed.

## Tests verdict

tests.patch: OK. Only src/lib/__tests__/columns-ja-traffic-003.test.ts. Changes: q3Heading, q15Heading, lastmod re-anchored; approvedQ11EarningCapacityParagraph replaced with the new verbatim paragraph (stale variant kept as a negative check); Q4, Q6 ×2, Q8, Q9, Q10 regexes widened with one extra alternative each, still requiring the same subject, article and conclusion; Q11 two regexes re-anchored to the new wording, and the dropped standalone "Q12で別途検討します" assertion is still covered by the new second regex and the exact-paragraph match. No .skip/.only, no other column touched. vitest-1.log: 85 files, 1440 tests passed. I could not diff the worktree column file from this sandbox; the pass is taken from the harness log and tests.txt (sync rounds 1, PASS).

## Tiny edits applied by reviewer

1. Q3, costs paragraph: "費用がかかる場合もあります。" → "それでも、費用がかかる場合はあります。" (smoother link to the preceding "予納は不要です"; no change to meaning, article or number). Guard re-run: PASS (length 6410, monotony 10.4). Variety re-run: no FAIL, same WARN as before. The Q3 test regex (line 546: 通常…別途…裁判費用…予納…不要) is unaffected.

## Original issues (not blocking)

- 民事庭 (Q3) vs 民事部 (Q8) for the same civil division; consistent within each section, left as published.
- Regulation named "車両事故鑑定・覆議の手続規定" in the body but "車両事故鑑定・覆議規則" in the source list; insurance act "強制汽車責任保險法" in body vs "強制自動車責任保険法" in list. Both as in the original.
- 刑事訴訟法第208条 is linked inline in Q6 but absent from the Q6–Q10 公式資料 list (as in the original).
- No contact line/email in this column (pre-existing house format, tolerated by guard).
- The 2026-05-29 / 2026-07-01 benefit-standard figures were not re-verified against the FSC source in this review (no network); unchanged from the published text.
