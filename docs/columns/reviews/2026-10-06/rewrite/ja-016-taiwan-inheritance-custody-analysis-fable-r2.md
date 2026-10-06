# Final review r2 — ja-016 taiwan-inheritance-custody-analysis (Claude Fable 5.1, 2026-10-06)

## Verdict

PASS — publishable as the live replacement. No legal point is lost, shifted, overstated or added; the r1 blocking issue (read_time and the loosened read-time assertion) is fixed in both draft.md and tests.patch; the variety tool reports 0 FAIL and no rule-5 item is unmet. I made no edits to draft.md.

## Scope checked

- Read in full: orig.md, draft.md, guard.txt, notes.md (including "fix round review-1"), tests.patch, review-r1.md, tests.txt, log, meta, claude-tests1.log, the tail of vitest-1.log, SENTENCE-VARIETY-RULE.md (all sections), rules/COLUMN-VOICE-RULE.md, LESSONS.md. I compared original and rewrite myself, paragraph by paragraph; the r1 table was read afterwards as a cross-check, not reused.
- Commands run in this round:
  - `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check draft.md --lang ja` → `sentences=161 mean=44.1 cv=0.49 short=0.161 run3=0.044 opener_rep=0.146 cite_end=0.025 cite_para=0.25 contrast=0 caveat=2 q=0`, 0 FAIL, 1 WARN (94% です・ます endings; inherent to the register).
  - `python3 /Users/son7/tseng-rewrite-1006/guard.py orig.md draft.md ja taiwan-inheritance-custody-analysis --today 2026-10-06` → `NOTE length 8324 -> 7838 (94%)`, `GUARD: PASS` (the three tolerated lint notes are pre-existing in the original).
  - sha256 (python hashlib) of draft.md = `638c64743c0e80aaa25ee0ddff7a7c4a3add6473519d80508d19454817c7e247` — equal to the hash pinned in tests.patch. orig.md = `710280c6…48b4` — equal to the patch's old pin.
  - Line-by-line comparison of lines 1–24 (front matter, H1, image): only line 4 (lastmod) and line 6 (read_time) differ.
  - Counts of article numbers, periods, dates and fractions in the body, orig → draft (see "Numbers and citations").
- Limits: I did not re-run vitest; tests.txt and vitest-1.log (14:50, after the fix round) record `Test Files 91 passed (91)`, `Tests 1124 passed`, with `columns-ja-family-016.test.ts (17 tests)` passing on the file whose hash equals draft.md. Japanese naturalness is a model's reading, not a native speaker's or a lawyer's review. Statutes were compared original ↔ rewrite; they were not re-verified against law.moj.gov.tw in this round (no network use).

## Front matter

Identical to the original except `lastmod: "2026-07-25" → "2026-10-06"` and `read_time: "約16分" → "約15分"`. The repo test derives read time as ceil(visible characters / 500); 7,353 → 15, so 約15分 is the correct value. title, url, date_display, categories, featured_image, the four FAQ q/a pairs, the H1 and the image line are byte-identical.

## Numbers and citations (body, orig → draft)

- 第1138条 3 → 1, 第1144条 2 → 1 (the duplicated FAQ paragraph and the repeated "spouse co-inherits" statement were merged; each article is still attached to its claim). 第1030条の1 2 → 2, 第1148条 1 → 1, 第1174条 1 → 1, 第1089条 1 → 1, 第1091条 1 → 1, 第1093条 1 → 1, 第1094条 1 → 1, 第1094条の1 1 → 1, 第1087条 1 → 1, 第1088条 2 → 2, 第1086条 1 → 1.
- 3分の1 1 → 1; 2人 / 3人 1 → 1; 2026年6月25日 1 → 1; 3か月 2 → 3 and 6か月 1 → 2 (the extra occurrence of each is in the closing disclaimer and repeats section 4's figures).
- Qualifiers: 原則として 2 → 2, 通常 4 → 4, 場合があります 11 → 9 and ことがあります 8 → 7 (the differences are the removed duplicate FAQ paragraphs and rewordings such as こともあります / とは限りません; each hedged claim is still hedged — checked per paragraph below).
- Five official links, three related links and the signature line: identical text, URL and order.

## Fact comparison (original → rewrite)

Intro
- Six questions on a death (heirs; assets and debts; spouse's separate matrimonial-property right; who exercises parental rights and duties; need for guardianship; protecting the child's property) → P1, all six; the three child-related ones follow 「未成年の子がいれば」 (a premise the original implies) → preserved.
- Issues affect each other, but legal basis and order of analysis differ → 「どれも互いに影響し得ます。けれども、法的根拠と判断の順序は問題ごとに異なります。」 → preserved.
- Three pairs to distinguish; carrying one conclusion to another misleads on right-holder, calculation base and court procedure → P2 → preserved.
- 「一つの手続だけが始まるわけではありません」 and the preview sentence 「以下では…整理します」 → cut; neither states a legal point, and the sources remain in section 10.

1. 法定相続人と法定相続分
- Art. 1138: order of heirs other than the spouse — lineal descendants, parents, siblings, grandparents → P1 (「第1順位は直系卑属です。父母、兄弟姉妹、祖父母がこの順に続きます。」) → preserved.
- A later rank does not inherit ahead of an earlier rank, 原則として → P1, qualifier kept → preserved.
- The spouse is not a later-rank heir under 1138; under Art. 1144 the spouse co-inherits with the rank that actually applies; the share may differ by rank (場合があります) → P1 → preserved (stated once, was stated three times).
- Illustration: no valid will; only spouse + 2 children; no renunciation, disqualification, representation or other deciding facts → 3 persons 通常 1/3 each; labelled 説明のための仮定; not a conclusion on any case → P2, every condition, 通常, the label and the "no conclusion" sentence kept → preserved.
- Disqualification, valid renunciation, representation for a predeceased descendant affect the result → P3 → preserved.
- Within a rank: time of death, parentage, adoption, representation; secure family records first → P3 → preserved.
- Opening of succession ≠ immediate sole ownership of specific assets; fix scope, settle debts and costs, then partition agreement OR court procedure; abstract share vs final attribution → P4 → preserved.

2. 遺言と相続財産の確定
- A valid will can set a different distribution; form, capacity, interpretation, enforceability; reserved portion and other mandatory limits → P1 → preserved.
- A will alone does not settle every asset; a will listing only part leaves the rest to intestate rules (ことがあります) → P1 (「確定するとは限りません」, 「適用されることがあります」) → preserved.
- Fix the list and legal nature of the estate before computing shares; six asset types plus debts, guarantees, unpaid tax, funeral costs → P2, all items → preserved.
- Not on the registered or account name alone: beneficial ownership, co-ownership shares, third-party rights, security → P2 → preserved.
- Benefits with a named beneficiary may be handled differently under the contract and applicable law (場合があります) → P3 → preserved.
- Trust: structure and beneficial rights; lifetime gifts/transfers → return, hotchpot or reserved portion (ことがあります); foreign accounts/real estate: law of the situs and Taiwan's choice-of-law rules → P3 → preserved.
- Asset search also covers debts and procedural risk; seven document types aligned to a reference date; incomplete records → gap from the divisible net estate (ことがあります) → P4 → preserved.

3. 夫婦残余財産差額分配請求権
- Not the same right as the statutory share → P1 (reader's question + 「同じではありません。」) → preserved.
- Art. 1030-1: separate right of the surviving spouse when the statutory requirements are met; calculated separately from the share → P2 → preserved.
- Not all property acquired during marriage is automatically counted; the spouse does not necessarily take half → P2 (「とは限らず…とも限りません」) → preserved.
- Check the property regime, cause and time of acquisition, debts, statutory exclusions; decide case by case → P4 (夫婦財産制, 算入・除外の範囲, 債務, 取得時期と原因, 「個別に判断します」) → preserved, moved.
- Compares each spouse's post-marriage increase when the statutory regime ends; differs from the share in basis, counterparty, calculation base; if the claim stands, reflect it first, then fix what remains as the estate (問題となることがあります) → P3 → preserved.
- Exclusions (inherited or gifted property, 慰撫金 — あり得る); debts incurred during marriage; another agreed regime; valuation date → P4 → preserved.
- Art. 1030-1: the court may adjust the amount where equal division would be 著しく不公平; the factor list; name comparison or length of marriage alone cannot decide → P5, article in end parentheses on the threshold sentence; 「その際は」 links the factors to the adjustment, as in the original's context → preserved as the original states it (see Original issues 1).

4. 相続債務と相続放棄
- Art. 1148: universal succession from the opening of succession, strictly personal rights and duties excepted → P1 → preserved.
- Liability for debts limited, 原則として, to the value of the property acquired by inheritance; but inventory, notice to and payment of creditors, preservation, exceptions → P1 (「原則として、…価額までです。もっとも…」) → preserved.
- Art. 1174: within 3 months from knowing of the right to inherit, in writing, to the competent court → P2: period, starting point, form and addressee all kept → preserved.
- Saying so among relatives, or not using the property, is not a renunciation; effect on next-rank heirs and representation → P2 → preserved.
- Before disposing of estate property OR paying debts, investigate assets and liabilities; creditors, security, guarantees, ongoing contracts, tax filings; inventory and creditor procedures as needed; avoid concealment or omission from the inventory → P3 → preserved.
- Tax-portal page updated 2026年6月25日; general 3 months (inventory, renunciation court procedures) and general 6 months (estate tax return); starting point, extension, exceptions, jurisdiction case by case; not to be used for an individual deadline → P4, four sentences, 「どちらも一般的な期間です」 keeps 一般的 on both periods → preserved.
- Agencies and documents may differ per procedure; renunciation papers (court) and the estate tax return (tax office) are different procedures; deadlines can run concurrently; track starting points and evidence per procedure → P5 → preserved.

5. 生存する父又は母の親権上の権利義務
- Art. 1089: when one parent cannot exercise rights or bear duties, the other does (原則) → P1 → preserved.
- A surviving parent who holds parental rights, absent a contrary court decision, 通常 continues; ただし existing judgments, restriction/suspension grounds, foreign elements, best interests may require court involvement → P1 → preserved.
- Content of parental rights (care and education, residence, legal representation, property management); exercised for the child's personal and property interests, not the parent's; daily care vs major disposals may need different analysis → P2 → preserved.
- Check existing divorce/custody judgments and restriction or suspension; foreign judgments: recognition and effect in Taiwan, procedures abroad; conflict transactions: is ordinary legal representation enough → P3 → preserved.
- Parental rights and succession are separate; the child owns what the child inherits; the parent cannot treat it as their own share; parental status can exist where the parent is not an heir; where the parent is an heir, check conflicts more carefully → P4–P5 → preserved.

6. 未成年後見人の指定と裁判所の関与
- Art. 1091: guardianship arises where the minor has no parents OR both parents cannot exercise rights/bear duties; one parent's death alone does not start it; first check the survivor's status, existing judgments, actual ability → P1 → preserved, OR kept.
- Art. 1093: the parent who last exercises rights/bears duties may appoint a guardian by will; needs a will in statutory form AND authority to appoint; even then, commencement requirements, qualification and acceptance, report to the court and other supervision → P2 → preserved.
- No valid appointment OR the appointee cannot serve → Art. 1094 statutory order and Art. 1094-1 court selection (ことがあります); best-interests review on the four fact groups → P3 → preserved, both articles on the same claims.
- Relatives and other statutory applicants may ask the court to select or change a guardian or order other measures when statutory grounds exist; family ties alone do not make a candidate guardian; guardian ≠ parent; separate duties (scope, inventory, reporting, supervision — 場合があります) → P4 → preserved.
- Separate personal care from property management; three candidate types that may need supplementary measures; the court can decide supervision and measures → P5 → preserved.

7. 未成年者の相続財産の保護
- The surviving parent cannot freely use what the child inherited → P1 (question + 「使えません。」) → preserved.
- Arts. 1087 and 1088: inherited property is the child's 特有財産; parent or guardian does not become the beneficial owner; 特有財産 = the minor's own property → P1 → preserved.
- Management, use, income, legal representation, disposal must be for the child's benefit; Art. 1088 powers bound by that purpose → P2 → preserved.
- Deposits, real estate, shares and other rights identified as the child's and managed separately; a managing parent or guardian must not spend them on own living costs or debts → P2 → preserved.
- Conflict of interest OR major disposal → special representative or court involvement (場合があります) → P2 → preserved.
- 「父母が子の相続財産を制限なく一方的に使用できると考えてはなりません」 → not repeated in the body; the point is carried by P1's question and answer and P2's prohibition, and the sentence itself stays in FAQ 4 → restatement cut, no point lost.
- Record the type of asset, need for disposal, adequacy of price, custody and planned use of proceeds; sale of real estate, security, business investment: check other permits or court procedures → P3 → preserved.
- Co-heirs or contract counterparties → conflict (ことがあります); Art. 1086 special representative; who represents the child in partition or litigation; test = real economic conflict, not form alone → P4 → preserved.
- Guardian managing property: inventory, vouchers, separating income and expenses, reporting and supervision (ことがあります); identifiable accounts; record purpose and basis; orderly handover at the end of guardianship OR at majority → P5 → preserved.
- Trust/insurance plans: not safe on contract terms alone; six items to check; reserved portion and tax; balance present needs and future life; the manager's convenience must not prevail → P6 → preserved.

8. 渉外家族の準拠法と手続
- Do not apply domestic rules directly; six connecting facts may affect governing law and jurisdiction; different connecting factors per issue (可能性) → P1 → preserved.
- 渉外民事法律適用法 as the starting point; not always sufficient; international jurisdiction, recognition and enforcement, treaties, the other country's law; effect on property abroad to be checked at the situs → P2 → preserved.
- Foreign wills: form, substantive validity, translation/authentication, probate or execution; foreign certificates: apostille OR consular authentication AND translation (場合があります); name/passport/household-register mismatch → extra documents (ことがあります) → P3 → preserved.
- Foreign custody/guardianship judgments: final, due process, recognisable in Taiwan; child habitually resident abroad → local jurisdiction and urgent protective measures (なり得ます); order of proceedings by best interests and enforceability → P4 (「子の」 added before 親権, no change of meaning) → preserved.
- Tax: separate filing duties per country (場合があります); overlap of four items; double-taxation relief; differing FX date, valuation method, taxpayer scope → one country's return is not to be copied → P5 (「複製することはできません」 for 「複製してはなりません」; a caution, not a legal rule) → preserved.

9. 資料収集と手続の順序 (was 実務準備チェックリスト)
- Framing: a basic framework; actual filing order varies with the agency and urgency; check each deadline separately → lead paragraph → preserved.
- Items 1–6 → same six, same order, every listed element present (only および/と → 「、」 and 各〜の → 〜ごとに) → preserved.
- Record custody place and issue/reference dates; one filing scheme for electronic and paper; who holds what and who approved what; access control for the minor's personal and financial data → preserved.
- Separate urgent preservation from ordinary filings; check urgent facts first; no unauthorised disposal on grounds of urgency; one calendar for court, tax, household-register and registry procedures → preserved.

10–11 and ending
- Five official links → identical. Note under the list: check amendment and effective dates; the English version is only an aid for collating the Japanese explanation with the original text; forms and portal show the general direction; confirm jurisdiction and filing requirements with the receiving office's latest guidance → same content → preserved.
- Three related links → identical.
- Disclaimer: educational material, not legal advice on an individual case; the listed factors may change applicable law, procedure and result (場合がある); check the latest official sources and individual facts before computing deadlines OR disposing of property → two sentences, all elements present; 「相続放棄の3か月や相続税申告の一般的な6か月といった期限」 names section 4's own figures (といった keeps the list open, as など did) → preserved, nothing new.
- Signature 曾雋崴弁護士（Wei Tseng） → identical. The original has no contact line; none was added.

Additions check: no new fact, case, number, example, first-person statement, promise or sales line. The short lead-ins (「放棄には方式と期限があります。」「条件があります。」「相続債務の責任には限度があります。」「名義だけで結論は出せません。」) each summarise the sentence next to them.

Length: 8324 → 7838 characters (94%). Every cut is a duplicated statement (the four FAQ paragraphs that the page already shows from front matter, the repeated spouse rule, the repeated "not the beneficial owner"), a connector, or the preview sentence.

## Blocking issues

None.

r1 blocking issue 1 (read_time / read-time assertion) — resolved:
- draft.md front matter now reads `read_time: "約15分"`.
- tests.patch no longer touches the two computed assertions (`約${calculatedMinutes}分` for `parsed.data.read_time` and `post?.readTime` appear as unchanged context lines), sets 約15分 in `expectedFrontmatter`, the `parsed.data` object and the `post` match, and pins the sha256 of the current draft.md.

## AI voice / MONOTONY

Tool: 0 FAIL. Rule section 5:
- 2 opener — starts with what a family has to sort out after a death; no stock hypothetical formula → met. (Batch-level overlap of opening types was not checked; only this item was in scope.)
- 3 short/long — 26 very short sentences (16%); long sentences are not stacked in the body → met.
- 4 paragraph starts — no word starts three paragraphs (有効な遺言 ×2, 台湾 ×2, 未成年後見 ×2, 父母 ×2, 親権 ×2) → met.
- 5 claim(statute)→caveat — ただし ×1, もっとも ×1; most paragraphs carry no citation → met.
- 6 contrast — tool count 0 (11 in the original). What remains (the spouse is not a later-rank heir; the claim vs the share; parental rights vs succession; guardian vs parent) are the column's legal distinctions, and none rebuts a claim the reader did not make → met.
- 7 closing — the disclaimer is tied to this column's 3か月 / 6か月; no copied formula, no sales line → met.
- 8 register — です・ます throughout, no だ・である, no bold, no emoji, no first person; the checklist heading is gone → met.
- 9 nothing lost — see the fact comparison.

No MONOTONY item.

Non-blocking observations (for a later pass, not a condition of publication):
- The "there is X. It is Y." reveal comes three paragraphs running in section 4 (「相続債務の責任には限度があります。原則として…までです。」「放棄には方式と期限があります。」「…調べなければならないものがあります。積極財産と消極財産の両方です。」) and again in sections 3 and 6. It is the rewrite's most visible habit. Merging one of the section-4 instances into a plain sentence would be enough.
- 「定められます」 (sections 1 and 2) is the potential form but can be read as passive for a moment; 「定めることができます」 is clearer. Same law either way.
- なければなりません still ends 18 of 161 sentences (26 in the original). They sit on real duties, so I leave them.

## Tests verdict

PASS. tests.patch touches only `src/lib/__tests__/columns-ja-family-016.test.ts`; no .skip / .only / .todo; no assertion about another column.
- Re-anchored, fact still locked: lastmod/date; read_time 約15分 with the computed check intact; heading 9; six checklist starts and the safeguard phrases; exactDeadlineStatement (2026年6月25日, 3か月, 6か月, 一般的, not for individual deadline calculation); exactOfficialNote; exactEnding with the signature; the phrase lists for the intro, wills, Art. 1030-1, debts and renunciation (now locking 「台湾民法第1174条により…3か月以内に」 and 「（台湾民法第1148条）」 with the citation), parental rights and guardianship (Arts. 1091, 1093, 1094, 1094-1), minor's property (Art. 1086) and cross-border points; visible character counts 7353 / 3213; sha256 equal to draft.md.
- Reworked, acceptable: "repeats each FAQ answer twice and as its assigned H2 first paragraph" → "keeps each FAQ answer in the front matter and its legal facts in the assigned H2 section". The verbatim FAQ paragraph at the top of sections 1, 3, 5 and 7 was removed on purpose; the new test requires each FAQ answer exactly once (front matter) and locks the section's facts (1138/1144 and the 1/3 illustration with its label; 1030-1 with "not automatic, not necessarily half"; 1089 with 原則 / 通常 / court involvement; 1087/1088, benefit of the child, special representative or court). The `3分の1` count check is unchanged.
- Recorded run after the fix round: `Test Files 91 passed (91)`, `Tests 1124 passed (1124)`; `columns-ja-family-016.test.ts (17 tests)` passed. Not re-run by me.

## Tiny edits applied

None. draft.md is byte-identical to the file the tests were synced against (sha256 above). Any edit would have invalidated the pinned hash and character counts, and nothing found justified that.

## Original issues (not blocking; unchanged by the rewrite)

1. Art. 1030-1 wording looks outdated in the original and is carried over as published: 「著しく不公平」 corresponds to the pre-amendment 顯失公平. The r1 review checked law.moj.gov.tw on 2026-10-06 and found the current text uses 有失公平 and lets the court adjust or waive (調整或免除) the amount; the factor list in the column is also a loose paraphrase of paragraph 3. I did not re-open the statute in this round. This needs a separate fact-correction pass across all language versions of 016.
2. 「慰撫金」 is the Taiwanese statutory term; a Japanese reader would expect 慰謝料 or a gloss. As published.
3. Section 4 says 「個別の予定表」 and section 9 says 「一つの予定表」. As published.
4. Pre-existing lint notes tolerated by the guard: no contact email, last H2 is 関連サービス and not the sources section, no source-check date in the sources section.
5. The tax-portal update date 2026年6月25日 is kept as published; not re-verified.

VERDICT: PASS
