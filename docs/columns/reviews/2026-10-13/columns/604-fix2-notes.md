# C4 fix2 notes

Review: `reviews/C4/final-astra-r1.md` (FIX). Drafts rewritten in place. Frontmatter keys, slug, and `featured_image` path are unchanged. No bold, phone, street address, lawyer-review claim, or party names. Contact remains one firm-and-email sentence.

Lint after this pass (`lint.py … <lang> taiwan-tenant-early-lease-termination-notice-penalty`):

- ko OK, 3497 chars
- ja OK, 4312 chars
- en OK, 1598 words (summary still 160; seoTitle still 39)
- zh-hant OK, 2685 chars

Variety (`variety_metrics.py check`): 0 FAIL on all four. KO/JA ending-share WARNs only (합니다체 / です・ます). Contrast 0. No paragraph-opening word three times. No stock hypothetical opener (가령 / 例えば…とします / Suppose / 假設). Labels kept: 가상의 사례입니다 / 架空の例です / an invented example / 虛構情境.

## L1 — ZH dispatch vs notice

Changed. 「三十日前送出」 is gone. Point 18 is 終止前三十日檢附事證、書面通知出租人. Civil Code Article 95, paragraph 1, main clause (到達, not 寄出) and point 20's narrow first-mailing presumption are in the same column, in all four languages. EN says a declaration not made in conversation, not "face to face."

## L2 — repair access

Changed in all four. Beside Civil Code 429 and Act 8 IV, point 9 paragraph 3 is stated: reasonable advance notice, and no refusal without a justifiable reason. Point 9 paragraph 1 still excludes tenant-fault damage, another agreement, and custom.

## L3 — JA leak ending

Changed. The closing leak finishes on Act 11 I item 2 and point 18's unmet-repair item: 30-day written notice with evidence, no compensation. The urgent-notice exception stays limited to an urgent safety or health defect. Point 14 is named as 別の道 (at-will termination), not as a condition of that statutory ending.

## L4 — shorter-notice clauses void

Changed by deletion only. The categorical sentence (any standard clause allowing shorter notice is void) is gone in all four. It is not replaced with a claim that those clauses are valid. Point 14's one-month rule and CPA 17's general rules (a clause that breaks the announcement is void; omitted mandatory terms still form the contract) stay, unjoined.

## L5 — subletting

Changed. For the residential leases this column covers, Act 9 I written consent covers all or part. Point 8 still requires consent to sublet, lend, otherwise let someone use all or part, or assign, and a written consent stating scope, period, and termination grounds when subletting is allowed. Article 443's partial-house proviso is kept and is not a waiver of that written consent. The "本文不判斷 / we do not decide which prevails" line is gone. A replacement tenant does not end the remaining term.

## L6 — ZH set-off source

Changed. The penalty set-off and shortfall are point 14 paragraph 3. The deposit is the sum in point 5 paragraph 1. Same attribution in KO, JA, and EN.

## L7 — 「才」 and who must give notice

Changed. ZH heading and summary no longer say the lease ends only at expiry (期限屆滿時消滅). The calendar-period proviso (week / half-month / month, last day of that period) is limited to the landlord in JA and ZH as well as KO and EN. Tenant notice under the checkbox and the Act is kept in the next sentence.

EN does not add a separate sentence that "each statute states its own notice rule." The heir paragraph already states both regimes: Act 11 III (30-day written notice with evidence) and Civil Code 452 using 450 III. A third sentence would have pushed the English file over 1,600 words.

## C1 — inline links

Changed. Points 8, 9, 14, 15, 18, and 20, the 2025-04-18 amendment (Executive Yuan page), the PDF on the urgent-exception quotation, and the statutes used in the body are linked at the claim. The source lists match.

## C2 — Article 443 in the source list

Changed. Article 443 is in the KO, JA, and EN source lists (ZH already had it). Article 95 and mail-regulations Article 34 are in all four lists.

## C3 — urgent-exception quotation

Changed in all four. Exact quote: 「但前項第三款前段其情況危急者，得不先期通知。」 Local explanation: prior notice may be skipped only for the first part of item 3, a safety or health defect, and only when that situation is urgent. Not every repair dispute. Heirs' notice period and method follow the preceding paragraph.

## C4 — 存證信函

Changed. "흔히 / よく使われる / common / 常拿來" is omitted. The topic's frequency claim has no official source in the fact sheet, so the accuracy note wins over that mention. What remains is 郵件處理規則 Article 34: registered letter, extra fee, Chunghwa Post's required form, identical copy left at the post office. The copy records the text posted. It does not by itself show arrival or that the termination conditions are met. JA still links the existing 存證信函 column. KO and JA now include the fee and the Chunghwa Post form, which the shorter paraphrase had dropped. No Chunghwa Post telephone number.

## C5 — JA vs the deposit column

Changed. The four Article 11 grounds and the repair-and-deduct steps are a bridge to `/ja/columns/taiwan-rental-deposit-refund-two-months`, not a second full account. The leak keeps the condition (unfit, repair needed, reasonable demand not met), the 30-day written notice, and point 18. Job loss (실직 / 失職 / job loss / 失業) is stated as not on the Article 11 list in all four, with transfer, going abroad, and leaving Taiwan. That is a reading of the list, not a case holding.

## V1 — voice

Changed where the note was right.

- KO: the recall is the subject, including in the close ("서울 발령"), with five months still left. "임대 목적을 이룰 수 없을". 행정원 核定(승인).
- JA: the next tenant does not end the remaining months; the lease continues. 応記載事項 is defined. "先に見るのは契約書の欄です" is not used.
- EN: "lease," not "flat." "The page to open is the box" is gone. The Act deems landlord and tenant a consumer relationship; omitted mandatory terms still form the contract. The Taichung example is November again (an invented example). Paragraphs starting with "The" are two (the repair-duty paragraph and the contact line), not three.
- ZH: the research-diary sentences are gone. Unauthorized early leaving and a later signed termination agreement are named. 返還時 for the joint check (point 15 / Act 12), not the ambiguous 交屋時.

All four: the dangling "依前條定之 / 앞 조문 / 前条 / the preceding article" sentence is omitted. CPA 17's void-clause rule and the incorporation of omitted mandatory terms stay. Article 16 is not opened or explained, because the topic stops at Article 17 and the cross-reference by itself explained nothing.

First paragraphs: KO keeps the point 14 quotation (it carries the 得/不得 condition). The old repeat "1년짜리 임대차에는 제1항이 적용됩니다" is the short "1년 계약도 같습니다." JA keeps the one-month-cap question. EN opens on the point 14 line, not a bare consequence. ZH opens on the quotation plus the 得/不得 condition, not an unanswered title question.

## Length cuts that do not drop a rule

KO and ZH were over the ceiling after the legal additions. Cuts are repeated wording.

- KO: "한 달 전에 알렸다면 이 점의 위약금은 없습니다" is dropped. The previous sentence still ties the penalty to ending without notice, and "상한은 통지를 빠뜨린 종료뿐입니다" stays.
- EN: the standalone "Only an ending…" sentence is merged into the point 14 paragraph as "Only an ending without that notice draws a penalty…"
- ZH: "通知滿一個月，這一點不再要求一個月" is dropped. "上限只用於未先期通知的終止" stays, next to point 14's own no-notice penalty sentence. Article 11's four grounds stay, with 難以繼續居住 kept distinct from point 18's 不能達租賃之目的. The notice-box sentence says 約定並勾了該欄 (雙方 is not repeated). 包租 (Act 5 II) stays as out of scope in one short sentence.

## Image

Not changed. `images/C4.webp` is still absent. The review's REDO is an export of the existing JPEG scene, outside this writer's draft files. No new image was generated.

## Not changed, on purpose

- No claim that every shorter-notice standard clause is valid (L4).
- No court holding invented for job loss, transfer, or leaving Taiwan.
- Civil Code articles cited are not treated as pending. The page's pending-provision note is Articles 166-1 and 1223.
- Internal links stay inside the existing same-language set: KO deposit + small claims; JA deposit + 存證信函 + small claims (no fourth); EN repair-visits + deposit + small claims; ZH deposit + small claims.
- Firm names stay as in `brief-BATCH.md`: 호정(昊鼎)국제법률사무소 / 昊鼎国際法律事務所 / Hovering International Law Firm / 昊鼎國際法律事務所, email wei@hoveringlaw.com.tw once.
