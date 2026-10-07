# Final review r1 — ja-002-withdraw-capital-taiwan-company

Reviewer: Claude Fable 5.1 (final gate, did not write the draft). Date: 2026-10-06.

## Verdict

PASS. No blocking issue. No edits applied to draft.md.

## Scope checked

- Read in full: orig.md, draft.md, guard.txt, notes.md, tests.patch (3 test files), tests.txt, vitest-1.log (tail), SENTENCE-VARIETY-RULE.md (all, incl. sections 5–6), rules/COLUMN-VOICE-RULE.md, LESSONS.md. Also item.sh and tests.sh, to see what a reviewer edit triggers.
- Not read: `~/agent-library/knowledge/editorial-voice.md` — the file COLUMN-VOICE-RULE.md names as the canonical voice rule does not exist at that path on this machine. The voice check below uses COLUMN-VOICE-RULE.md and SENTENCE-VARIETY-RULE.md only.
- Commands run:
  - `variety_metrics.py check draft.md --lang ja` → `sentences=150 mean=44.0 cv=0.472 short=0.14 run3=0.061 opener_rep=0.196 cite_end=0.013 cite_para=0.109 contrast=2 caveat=3 q=2`, 0 FAIL, 1 WARN (96% です・ます endings).
  - `guard.py orig.md draft.md ja withdraw-capital-taiwan-company --today 2026-10-06` → `GUARD: PASS` (length 9295 → 8406, 90%).
  - Own script: front matter line diff, link list, sources/related block, signature, article numbers and figures, headings and image lines, sentence endings, SHA-256 of the first 2,666 bytes.
- Law was not re-verified online. The fact check is original versus rewrite. Remarks on the original's law are from memory and are marked as such.

## Front matter, H1, images

- Front matter: 15 lines, only two differ — `lastmod "2026-09-10" → "2026-10-06"` and `read_time "約14分" → "約13分"`. Title, url, date_display, categories, featured_image and all three FAQ entries are byte-identical.
- H1 and both image lines unchanged. Headings 2–5, 公式資料 and 関連案内 unchanged. Heading 1 changed from 「会社財産と株主の出資金は区別しなければなりません」 to 「会社財産と株主の出資金の区別」 (imperative to noun phrase; allowed, and the test marker is updated).
- All 9 links identical and in the same order. The 公式資料 and 関連案内 blocks are byte-identical. Signature line identical.

## Fact table

Numbers and articles in the body: 第9条, 第90条, 第89条, 第113条, 第316条, 登記規則第4条, 第3条第1項但書, 5年, 50万–250万, 1年 (刑), 6万, 3分の2 (×3 in step 2), 過半数, 15日 (解散登記, 変更登記, 休業登記), 45日, 30日, 1か月, 1年 (休業). All present, each attached to the same claim as in the original. The counts that fell (3分の2 6→3, 15日 4→3) fell only because the paragraph repeating FAQ 2 at the top of section 2 was removed.

### Introduction

| Original point | In the rewrite | Status |
|---|---|---|
| Ending a Taiwan company raises first whether paid-in capital can go straight to the shareholder's account | P1, as fact plus reader question | preserved (「台湾で設立した会社」 → 「台湾の会社」, no legal content lost) |
| Contribution becomes company property once in the company account; belongs to the company, not the shareholder personally | P2 | preserved |
| Same even for a 100% shareholder and for a sole director | P2, two sentences | preserved |
| Past contribution alone gives no right to withdraw deposits or assets | P2 last sentence | preserved |
| Seven asset types handled under the company's rights and obligations | P3 | preserved, all seven listed |
| Genuine company debt to a shareholder: existence and repayment basis confirmed by contract, remittance record, books, resolution etc. | P3 | preserved |
| Five outflows (解散・清算, 減資, 通常の事業費用, 利益を前提とする配当, 実際に負っている借入債務の返済) are treated differently in law and tax; resolution, creditor protection, vouchers, accounting, withholding and filing differ | P4 | preserved, all qualifiers kept |
| Stopping business does not end legal personality or filing duties | P5 | preserved |
| Permanent end: 解散登記 and 清算 as one sequence; contracts, claims, debts, taxes, residual property | P5, merged with section 1 overview | preserved, 原則として kept |
| 休業 possible when resumption is left open; does not extinguish legal personality | P5 | preserved |
| Preview sentence 「本稿では…区分して説明します」 | removed | acceptable, no legal content |
| Order and documents vary with 会社の形態, 定款, 財務状態, 債権者, 許認可, 労働関係, 外国人投資, 送金構造; judge at each stage on current materials | moved to the closing note | preserved, all eight factors and 「各段階で現在の資料に基づいて判断」 kept |

### Section 1

| Original point | In the rewrite | Status |
|---|---|---|
| Overview paragraph (same text as FAQ 1): permanent end → 原則として解散登記と清算 → residual property to shareholders; continuing company → 減資などの適法な手続; expenses, dividends, genuine loan repayment each need their own legal and tax basis | intro P4 (last sentence) and P5 | preserved, stated once |
| 資本金 = net-asset item showing amounts paid in at incorporation or capital increase; not necessarily equal to the bank balance; does not represent all assets and debts | S1 P1 | preserved |
| On closing, check actual assets and liabilities, receivables and payables, tax, contingent liabilities, liquidation costs besides book capital | S1 P1 | preserved, all categories |
| Fix the legal nature first: expense / lawfully fixed dividend / repayment of shareholder loan / 減資 / distribution of residual property | S1 P2 | preserved, all five |
| Renaming or relabelling an account does not change the nature | S1 P2, two short sentences | preserved |
| 第9条: shown as fully paid though not paid, OR after registration returned to shareholders or shareholders allowed to take it back; 5年以下の有期刑、拘留または50万以上250万NT$以下の罰金 | S1 P3 | preserved; 「A、または B し、もしくは C」 → 「A と、B し、または C」 keeps the same grouping |
| 第9条 does not punish ordinary lawful use of company funds | S1 P4 first sentence, 第9条 named as subject | preserved |
| Do not stretch it to every payment; rent, salaries, purchases, tax are distinguished from 仮装払込 and post-registration return | S1 P4 | preserved |
| ただし: with an "expense" label, unclear use, counterparty, consideration or authority can raise separate problems under company law, tax law and accounting standards | S1 P5 | preserved |
| 第90条: liquidator distributing to shareholders before paying debts — 1年以下の有期刑、拘留またはNT$6万以下の罰金, 「科され得ます」 | S1 P6 | preserved, 第90条 in parentheses on the same sentence |
| Creditors and tax come before shareholder recovery in liquidation | S1 P6 | preserved |
| Shareholder loan claim: contract, flow of funds, interest terms, booking, repayment ranking | S1 P7 | preserved |
| Related-party dealings: terms and vouchers explainable as with an independent third party | S1 P7 | preserved |
| Other civil, criminal, tax liability depends on purpose, authority, vouchers, accounting, relationship; no automatic 背任罪; internal approval does not exclude all liability; documents must agree per transaction | S1 P8 | preserved |
| Practical: separate asset lists, separate table of claims and debts, no netting in one account, link date, purpose, approver, voucher, tax treatment per amount | S1 P9 | preserved |

### Section 2

| Original point | In the rewrite | Status |
|---|---|---|
| Top paragraph (same text as FAQ 2): 有限公司 3分の2以上の同意; 股份有限公司 原則として 3分の2出席・過半数; 公開発行会社 過半数出席・3分の2以上; articles may set higher; registration within 15 days of dissolution | step 2 (all thresholds, 原則として, articles) and step 3 first sentence (15日) | preserved, stated once |
| 解散 = move to liquidation stage; 清算 = settling remaining affairs and property | S2 P1 | preserved |
| Registration of dissolution alone does not extinguish debts or turn company property into shareholder property | S2 P1 | preserved |
| Distributable property can be judged only after the liquidator investigates, protects creditors, settles debts and tax | S2 P1 | preserved |
| The order is a general checking frame; authorities, documents, notices, tax, court reports depend on company type, cause, facts | S2 P2 | preserved |
| Step 1: documents to secure; items to list; foreign-investment structure, remittance route, bank and FX materials; termination costs, labour, disposal limits, enforcement of security before the resolution | step 1 | preserved, every list item |
| Step 2: 第113条 (有限公司), 第316条 (股份有限公司, 原則として), 公開発行 alternative, higher requirements in articles must also be followed, convening, voting, minutes, conflicts of interest | step 2 | preserved; 第113条 and 第316条 on the right company types |
| Step 3: 登記規則（公司登記辦法）第4条 — change registration within 15 days of the change as the principle; prepare dissolution registration; attachments per current forms and authority; registration, tax clean-up, business-tax steps, licence cancellation are separate | step 3 | preserved |
| Step 4: 営利事業所得税 — current-period final return within 45 days of the authority's approval date; official guidance counts from the day after the dispatch date (発文日) of the approval letter; period, meaning of approval date, counting method and actual reference date to be confirmed; items to book before filing | step 4, sentences reordered | preserved, start point and both caveats kept |
| Step 5: liquidator by articles or shareholders' resolution, or statutory liquidator; report to court; inventory and balance sheet; wind up current business; collect claims; preserve and realise assets; pay debts and tax; notices, public notice, creditor protection; order of labour, secured, tax, general debts per law and facts | step 5 | preserved |
| Step 6: reflect collectability, disposal costs, tax, litigation risk, liquidation costs; only what remains after all debts and tax may be distributed, per rules, articles, shareholding; residual property ≠ paid-in capital; tax nature, attribution, remittance documents, currency exchange | step 6 | preserved |
| Step 7: liquidation income return within 30 days of the end of liquidation; report to court; books and vouchers agree; bank account, seals, statutory retention, licences and contracts; legal effect and time of extinction to be confirmed | step 7 | preserved |
| Not every company follows the same documents and order; merger, division, bankruptcy — liquidation 「通常、免除され得ます」; voluntary dissolution may need more steps (seven circumstances); do not assume a fixed period | post-list P1 | preserved, 通常 and 得ます kept |
| Asset disposal around dissolution: counterparty, price, interests, approvals, tax; related-party transfers and debt waivers; manage from receipt to books to tax filing | post-list P2 | preserved |

### Section 3

| Original point | In the rewrite | Status |
|---|---|---|
| Liquidation is not limited to solvent companies | P1 | preserved |
| 第89条: when company property is insufficient to pay debts, the liquidator must immediately petition for bankruptcy | P1, 第89条 in the next short sentence | preserved, 直ちに and the duty form kept |
| Check 債務超過, 支払不能, 担保, 租税債務, 債権者数; judge case by case | P1 | preserved |
| Do not compute the shareholders' share first when finances are unclear; six items to reflect beyond recent statements | P2 | preserved |
| 債務超過 (一般に) versus 支払不能; illiquid or encumbered assets; temporary cash shortage does not decide the procedure | P3 | preserved, 一般に kept |
| Liquidator must consider company-law duties on learning of insufficiency; preferential payment harms other creditors; priorities per each law; record basis and timing of payments made | P4 | preserved |
| Do not decide on the old guidance's simple formula; judge on actual materials (four questions); realistic value | P5 | preserved |
| New money or debt adjustment: document method and effect; different accounting and tax results; three questions judged together | P6 | preserved |

### Section 4

| Original point | In the rewrite | Status |
|---|---|---|
| 減資 as a lawful way to return part of the contribution while continuing; not an informal withdrawal; not always possible; check finances, form, purpose, articles, effect on creditors first | P1 | preserved |
| 減資 is a company-law procedure changing capital; a transfer plus a book entry does not complete it; eight items to confirm; requirements differ by company type and structure (「異なり得ます」) | P2 | preserved (議決定足数 → 決議要件, same sense) |
| Source of the refund; cash alone is not enough; must still pay six items and continue business; directors' judgment if creditor protection weakens | P3 | preserved |
| Foreign shareholders: consistency of approval or report, register and capital, FX and bank materials; remittance needs more than the resolution; exchange differences booked | P4 | preserved |
| Tax on the amount received is not decided by the label 払込元本; five items to check; withholding, filing, foreign tax paid, treaty | P5 (question) and P6 | preserved |
| Ordinary expenses differ from 減資; basis is contract, statement, tax voucher, payment approval; shareholder or director as supplier needs extra checks | P7 lead and P8 | preserved |
| Dividends are distinct from 減資 and post-liquidation distribution; presuppose distributable profit, financial materials, resolution; payment, withholding, filing 「伴うことがあります」; cash ≠ distributable profit; check 欠損金, 法定積立金, 未処分利益剰余金 | P9 | preserved |
| Repayment of a genuine loan is a separate transaction; six items; withholding on interest, related-party issues; no after-the-fact relabelling of contribution as loan | P7 lead and P10 | preserved |
| Each of the four needs its own basis (contract, resolution, voucher, withholding etc.) | P7 second sentence | preserved |
| Record legal nature and tax treatment separately even for same-day payments to the same shareholder; keep in the board or shareholder decision record that operations and debt payment remain possible | P11 | preserved |

### Section 5

| Original point | In the rewrite | Status |
|---|---|---|
| Suspension of one month or more: registration before suspension or within 15 days from the start date | P1 | preserved |
| Exception: already reported and 核備 with the tax authority under the business tax law — registration not needed (第3条第1項但書) | P1 | preserved; law name written 「会社登記規則」 instead of 「会社登記弁法」 (same law, same article; see non-blocking notes) |
| One suspension period may not exceed one year | P1 「最長1年です」 | preserved (same wording as FAQ 3) |
| Annual income tax final return still due for the suspension year; filings not uniformly waived; duties by tax type, assets, employees etc. checked individually | P2 | preserved, stated once (original stated it twice) |
| Other filings or payments may remain; no sales ≠ no filing duty; check registration status and filing items | P2 | preserved |
| 休業 keeps legal personality; no extinction, no wholesale settlement; set start and planned end dates; check company registration and business-tax notification | P3 | preserved |
| Change registration still required during suspension; keep address and responsible person; do not leave the register inaccurate | P4 | preserved, duty form kept |
| Held assets: local tax, management fees, insurance; storage, depreciation, lease, disposal; personal use by a shareholder documented | P5 | preserved |
| Contracts, employees, licences, bank accounts, book retention; decisions before suspension; person in charge; statutory retention | P6 | preserved |
| Before the period ends: resume, re-examine suspension, or move to permanent end; 復業登記; 休業 is no substitute for 解散・清算 | P7 | preserved |
| Long suspension complicates later closing; periodic checks; consider closing when resumption is no longer possible | P8 | preserved |

### Sources, related links, closing note, signature

| Original point | In the rewrite | Status |
|---|---|---|
| 公式資料 1–4 | identical | preserved |
| 関連案内 1–3 | identical | preserved |
| General legal information and educational material, not a legal opinion on a specific case | closing note, first sentence identical | preserved |
| Procedures and tax filing vary by 会社形態, 定款, 財務状態, 債権者, 外国人投資, 個別の取引; confirm the individual case before any resolution or transfer | closing note | preserved; the list is now the union of the intro list and the closing list, with 「異なることがあります」 kept |
| Contact line | none in the original, none added | unchanged |
| 曾雋崴弁護士（Wei Tseng） | identical | preserved |

### Additions

No new fact, example, case, number, first-person story, promise or sales line. The added text is connective only: 「罰則もあります。」「清算人にも罰則があります。」「ただし、例外があります。」「会社法第89条の定めです。」「現金があるだけでは足りません。」「判断の基礎は実際の資料です。」「会社の存続が前提です。」 and two reader questions built from the original's own content.

## Blocking issues

None.

## AI voice / MONOTONY

No MONOTONY item. Tool: 0 FAIL. Section 5 items 2–9:

- Item 2 (opener): fact plus reader question, no stock hypothetical opener. Met.
- Item 3 (short sentences): 14% of sentences are very short; long list sentences are broken up by short ones. Met.
- Item 4 (paragraph openers): 51 body paragraphs; no word opens three in a row; 「会社」 opens 3 of 51, within the long-text allowance the tool applies. Met.
- Item 5: no run of three "claim (statute) → ただし" paragraphs; most paragraphs carry no citation. 「ただし、」 opens 4 sentences (limit 4). Met.
- Item 6 (contrast frames): 7 → 2. Met.
- Item 7 (ending): the last body paragraph ends on this column's own point (when resumption is no longer possible, choose the closing procedure). The note after the rule is the required disclaimer, now carrying this column's own factors. Met.
- Item 8: です・ます throughout, no だ・である sentence, no bold, no emoji, no imperative or checklist heading. 「必要があります」 3 (limit 3), 「ことができます」 0. Met.
- Item 9: nothing lost (tables above). Met.

Read as Japanese: the preview sentence, the three FAQ-duplicate lead paragraphs, 「結局…」 and both 「〜ことが重要です」 are gone; 「なければなりません」 fell from 46 to 24 and what remains sits mostly on real duties. It reads as a practitioner's procedural note. Remaining weak points, none blocking, are listed below.

## Length

9295 → 8406 characters (90%). Every cut is a repetition: the FAQ-duplicate paragraphs at the top of sections 1, 2 and 5, the preview sentence, the 「結局」 summary, the second statement of the suspension-year tax return. No legal point was cut.

## Tests verdict

tests.patch: acceptable.

- Touches only the three test files of this column (`columns-ja-investment-002.test.ts`, `…-002-intro-sync.test.ts`, `…-002-capital-paragraph-sync.test.ts`). No `.skip`, `.only`, `.todo`, `xit`; it()/test() blocks +0 −0. vitest-1.log: 89 files, 1108 tests passed, run after the draft's last modification.
- `immutablePrefixSha256`: I computed SHA-256 of the first 2,666 bytes of draft.md = `93378af0…a02611`, equal to the patched value. The prefix ends right after the featured image line, so it still locks the whole front matter, the H1 and the image line.
- lastmod and read_time expectations follow the front matter. The FAQ answers are still asserted verbatim.
- Legal facts stay locked in the new wording: 第9条 scope and penalty string, 第90条 penalty, 第89条 paragraph, 第113条, 第316条, 登記規則第4条 with both 15-day sentences, 45日 and the 発文日 counting rule, 30日, the suspension rule (15日, 第3条第1項但書, 最長1年, annual return), creditor and tax priority, the loan-proof list, the reduction and suspension phrase lists.
- Relocated assertions follow structure that was moved on purpose: the overview paragraph (section 1 → introduction, now four pinned sentences), the variation factors (introduction → closing note, all eight factors still asserted), the roadmap concepts 会社財産 and 破産申立て (now asserted against the introduction and the whole file, since the preview sentence listing them was removed).
- Section 4 paragraph count 9 → 11 matches the draft.
- A few regexes gained alternatives (「一致しません」, 「数字」, 「に加えて」) or lost a leading 「会社」 or 「実際」. Each still requires the same fact in the same paragraph.

## Tiny edits applied

None. item.sh re-runs tests.sh when draft.md is newer than `.tests-ok`, and tests.sh resets the worktree first, which would discard this reviewed tests.patch and have it regenerated without review. Nothing below justified that.

## Non-blocking notes on the rewrite

1. Closing note: the original said 「適切な解散・清算・減資・休業の手続と税務申告は…異なることがある」; the rewrite says 「解散、清算、減資、休業の順序、書類、税務申告は…」. The word 手続 is gone and the factor list is the union of two original lists. The reader's instruction (confirm the individual case before any resolution or transfer) is unchanged. If the file is touched again, 「…休業の手続、順序、書類、税務申告は」 restores the word; the patched regex still matches.
2. Intro P4 calls 解散・清算 one of the 「別々の取引」. The original said 「それぞれ異なる取扱いとなります」. Loose wording, same meaning; the sentence is pinned by the patched test.
3. 「確認します」 rose from 5 to 13 as 「確認しなければなりません」 was softened. Not a rule item and far better than the original's 46 obligation endings, but it is the next repetition a reader would notice.
4. Body section 5 now writes 「会社登記規則第3条第1項但書」, matching step 3 and the source list; FAQ 3 in the locked front matter still says 「会社登記弁法」. The original already had this split between step 3 and section 5.

## Original issues (not blocking, not made worse)

From memory of the statutes, not re-verified online — confirmation needed before any correction:

1. 第9条 and 第90条 are rendered 「有期刑、拘留または…罰金」. The statute reads 有期徒刑、拘役或科或併科…罰金: 拘役 is not Japanese 拘留, and the fine may be imposed together with the custodial penalty, so 「または」 understates it. The wording is pinned by tests and also appears in other language versions, so it needs a coordinated fact fix.
2. 第9条 punishes the company's responsible person (公司負責人); the column does not say who is punished.
3. 第89条 and 第90条 sit in the chapter on 無限公司 and reach 有限公司 and 股份有限公司 by reference; the column cites them directly.
4. The 45-day and 30-day tax deadlines carry no statute citation (所得税法第75条, from memory); only the tax-guidance link supports them.
5. 「核備」 is left as a Chinese term in the body and FAQ 3; 「有期刑」 is not a standard Japanese rendering either.
6. FAQ 3 says 「休業開始後15日以内」 while the body says 「休業開始日から15日以内」; the law name differs between FAQ 3 and the source list (note 4 above).
7. 「旧版の案内」 refers to an earlier version of this column that the reader cannot see.
8. Lint items inherited from the original: no contact email in the body, no source-check date in the sources section, last `##` heading is 関連案内.

VERDICT: PASS
