# C4 fix1 notes — voice pass

Statute text used: `research/C4-statutes.md` (民法 §179–§182, 全國法規資料庫, checked 2026-10-14). No judgment file is cited. No article number, amount, date, link, or hypothetical label was dropped. Frontmatter keys, slug, and `featured_image` are unchanged. FAQ answers are unchanged; they already answer a reader question, including the caution that a mistaken transfer is not fully recoverable in every case.

Lint `OK` and `variety_metrics.py check` FAIL 0 on all four files after the edits. The ko/ja WARN (about 96% 합니다 / です・ます endings) is the register, not a mix of 해라체 or だ・である.

## ko

- Title `계좌를 잘못 눌러 보낸…` → `대만에서 계좌를 잘못 지정한 송금, 수취인의 반환 범위` (H1 matched). Summary `계좌를 잘못 보낸 돈` → `잘못 지정한 계좌로 보낸 돈`. Opening stays the confirmation scene, not a 가령 formula.
- `지급 당시… 사라진 문장은` → `지급할 때는 법률상 원인이 있었지만 나중에 사라진 경우도 제179조에 해당합니다.` The earlier `마찬가지입니다` sentence said the same rule, so it was not repeated. The example is still the no-cause-from-the-start limb.
- Confirmation mapped in three sentences. Kept `법률상 원인의 부존재` and `급부의 원인인 계약`. The suggested `함께 살펴야 합니다` would have dropped the third element of §179.
- `세 조각` → `세 요건을 같은 수령인에 관해 따져야 합니다.`
- `의무를 두는 자리가 그곳` → `제179조는 이익을 받은 사람에게 반환 의무를 둡니다.`
- `그 계약은 이 조의 밖` → `협력업체와의 계약은 제179조와 별도로 살펴야 합니다.`
- `가액까지 항상 남는 구조` → `가액 상환 책임도 언제나 유지되는 것은 아닙니다.` The previous sentence now says return of the benefit and repayment of value when return is impossible, matching §181 `不能返還` (the `형체` gloss is not in the article; same fix as the en/zh calque).
- `제179조와 제181조로 돌아갑니다` → `이때의 반환은 제179조와 제181조에 따릅니다.` Same calque the en note flagged in the other languages.
- MONOTONY, unprompted rebuttal: removed `전액이 돌아온다고 적힌 문장도 … 없습니다` and `처음부터 원인이 없는 송금만 이 조의 대상은 아닙니다.` The next sentences already state the rules: a later-disappeared cause is still §179, and another item of §180 bars the claim or §181 and §182 reduce the amount. FAQ 2 still says a full return of every mistaken transfer cannot be assumed.
- MONOTONY, formula close: last paragraph now uses this confirmation’s destination account and the living-expenses reply.

## ja

- Title → `台湾で振込先を間違えた場合の返還範囲` (H1 matched). Summary `口座を誤って送ったお金も、この要件で見ます` → `振込先を間違えて送ったお金についても、この要件に照らして判断します.`
- Opening `使ってしまえば返さなくてよい、という一文は…ありません` used the same “the statute does not contain that sentence” device as the flagged full-recovery line. Replaced with the direct limit: spending alone is not the §182 exemption; the amount still turns on knowledge and whether the benefit remains. That reader question is FAQ 1. Opening type stays a limit on spending, not `例えば…とします`.
- `入金の確認に印字された受取口座` → `振込明細に記載された振込先口座`. The same record is called `振込明細` later in the section, so the earlier `確認` stand-ins for that record were aligned. `入金の時刻` / `受取口座` as data fields stay.
- `あとから消えた文は` → `給付時には法律上の原因があっても、後にその原因がなくなった場合も含まれます.` Not doubled with the old `同様です` sentence.
- The three elements are separate sentences. Kept `法律上の原因の不存在` and `給付の原因となる契約`. Suggested wording stopped before naming the third element. `三つが一人に揃います` → `三つの要件は、同じ受領人について判断します.`
- `義務を置く場所` → `第179条が返還義務を課すのは、利益を受けた人です.`
- `第179条と第181条に戻ります` → `この場合の返還は、第179条と第181条に従って判断します.`
- `日付は二筋です` → `確認すべき時点は、入金時と、受領人が法律上の原因がないことを知った時です.` `事情` was expanded so the object of knowledge stays `法律上の原因がないこと`.
- `形がなくなったあとの価額` → return of the benefit itself, and repayment of value when return is impossible (§181 proviso). Same calque as en/zh; `形` is not in the article.
- MONOTONY: removed `全額戻ると書いた文も…ありません` and `初めから原因がない振込だけが対象、という限定`. Affirmative sentences remain: later loss of a cause is still §179; another item of §180 bars the claim, or §181 and §182 reduce the amount.
- Contact → `振込明細と相手の返信を…宛てにお送りください.`
- MONOTONY close: last paragraph lines up this transfer’s statement and the living-expenses reply, then who received the benefit, what remains, and when they knew.
- `会社も個人も同じです`, `両方です`, and `桁が違います` are short restatements of the sentence each follows (wording does not sort senders; both §182 I conditions; the digits do not match). They do not add a rule. Needed for length variation (cv was 0.434).

## en

- Dropped the title-echo question. First sentence is the reviewer’s result line: the transfer went to a Taiwan account whose holder was owed nothing. Among the English drafts this is not the statute opening (C1), the “alone does not” opening (C2), or the “If an issuer…” opening (C3). C3 in other languages also starts from a result; the voice note required this sentence.
- `sent … toward` → `sent … to`. Confirmation sentence is the reviewer’s account-number wording. `(an invented example)` is inside the debt/contract sentence; the standalone disclaimer is gone.
- `The second sentence covers…` → `Article 179 also applies if the payment had a legal cause that later ceased to exist.` Not doubled with the old “same duty applies” sentence. The wire is still the first situation.
- `meet in one person` → the benefit, the loss, and the lack of legal cause must concern the same recipient.
- `The contract sits outside it` → the collaborator’s contract is considered separately from the claim under Article 179.
- Item 1 / item 2 split. Kept “a debtor paying, in order to discharge it, a debt that has not yet matured.” The shorter suggestion dropped `債務人` and `因清償`.
- `no form left` → Article 181’s two paths: return the benefit, or repay value when return is impossible.
- `places the duty` / `goes back` → the duty is on the person who received the benefit; Articles 179 and 181 still govern the return when paragraph 1 does not apply.
- MONOTONY: removed `Nor do Article 179 and Article 180 say…` and `not the only pattern the article describes.` What remains: a later-ceased cause is still Article 179; another item may bar the claim; Articles 181 and 182 can reduce the amount returned.
- MONOTONY close: last paragraph is this confirmation, the living-expenses reply, who received the benefit, what remains, and when they learned there was no legal cause.

## zh-hant

- Title → `匯錯帳戶後，收款人應返還多少` (H1 matched). Opening stays the §179 quotation, not `假設`.
- `這個戶名，貿易商對他` → `貿易商與該帳戶的名義人沒有債務或契約關係（虛構情境）。` Where `戶名` meant the person, the body now says `名義人`. `戶名` remains only for the name printed on the record.
- Three elements in separate sentences. Kept `這就是沒有法律上原因`. The suggestion stopped before that identification. `落在同一個人身上` → `這三個要件都要就同一名受領人判斷.`
- `放在一開始就沒有原因的一邊` → `上面的匯款案例，從一開始就欠缺法律上原因.`
- `把返還義務放在這裡` → `第179條規定，由受有利益的人負返還義務.`
- Heading → `原受利益、衍生利益與不能返還時的價額`. The following sentence does not open on `第181條` (opener cap). It still says Article 181 separates return of the original benefit from repayment of value when return is impossible.
- `形體已經沒有` → that same §181 distinction. `價額不會每次都留下` stays.
- `日期有兩條線` → record the credit time and the time the recipient knew there was no legal cause, as two times.
- `認識的起點` → `不能單憑回覆到達的日期，就認定對方在那一天才知道沒有法律上原因.`
- `返還回到` → `這時仍依第179條和第181條返還.`
- MONOTONY: removed `也沒有寫，每一筆匯錯都會全額回來.` Replaced with the direct limit: another item of §180 excludes the claim, and §181 and §182 can shrink the amount. `沒有寫另一份契約的債務會…消滅` stays; it is the sourced limit of §179, not a strawman about full recovery.
- MONOTONY close: last paragraph puts this transfer’s statement and the living-expenses reply next to who received the benefit, whether it remains, and when they knew there was no legal cause.

## Self-check (SENTENCE-VARIETY-RULE §5)

1. Variety FAIL 0 on ko, ja, en, zh-hant.
2. No `가령` / `例えば…とします` / `Suppose` / `假設` opening. Ko scene, ja spending-limit, en result, zh statute quotation.
3. Short sentences are above the 8% floor in each file (ko 9.6%, ja 14.9%, en 13.6%, zh 15.7%), so more than two very short sentences.
4. No opener over the paragraph cap (checker `top_opener_n`).
5. No `다만` / `ただし` / `However` / `但` sentence run. Citation-free paragraphs remain (scene, bank route, dates).
6. Contrast-template count 0. The “the article does not write that every transfer comes back in full” rebuttals are gone; the limits are stated as what §180–§182 do.
7. Last paragraph is this transfer’s record and reply, not a shared disclaimer or a sales line. Email stays in the preceding paragraph.
8. Ko 합니다체, ja です・ます. No bold, no invented first person, no checklist headings.
9. §179 both limbs, §180 four items and the recipient-only exception on item 4, §181 further gains and value, §182 both paragraphs (no rate, no transfer-date accrual), bank contact as a practical route only, hypothetical labels, check date 2026-10-14, and the four single-article links are still in each language.
