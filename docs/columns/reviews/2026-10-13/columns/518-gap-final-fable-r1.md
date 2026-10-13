# G4 final review r1 (Claude Fable 5.1) — recovering-unpaid-invoices-from-taiwan-customers

Reviewed 2026-10-06 KST. Files: drafts/G4/{ko,ja,en,zh-hant}.md, images/G4.webp.

## Verdict

PASS. All four languages are publishable as they now stand (two minor wording edits applied by me, listed below). Image OK. No major issue remains.

## Scope checked

- Briefs and rules read in full: brief-BATCH.md, brief-EDITORIAL-VOICE.md, COLUMN-VOICE-RULE.md, SENTENCE-VARIETY-RULE.md, LESSONS.md, topics/G4.md. THREADS-VIRAL-BRIEF used as style reference only.
- Earlier notes read: reviews/G4/check-grok.md, reviews/G4/fix1-notes.md, drafts/G4/facts.md (not relied on).
- Sources re-fetched by me from law.moj.gov.tw on 2026-10-06 (LawAll pages parsed per article with fetch-law.py into /tmp/g4-final-law.md; single-article pages for 民法 130 and 民事訴訟法 526 also opened with WebFetch):
  - 民法 125, 127, 128, 129, 130, 144 (pcode B0000001)
  - 涉外民事法律適用法 20, 36 (B0000007); official English title confirmed on law.moj.gov.tw/ENG ("Act Governing the Choice of Law in Civil Matters Involving Foreign Elements")
  - 民事訴訟法 96, 508, 509, 510, 511, 513, 515, 516, 518, 519, 520, 521, 522, 523, 524, 526, 527, 529 (B0010001)
  - 強制執行法 4, 5, 6, 19, 45, 75, 115 (B0010004)
  - 中華郵政 存證信函 page (the full URL cited in the columns) — passage 「各類國內掛號信函交寄時，以內容完全相同之副本留存郵局備作證據者，稱為存證信函。…郵局對存證信函之証明，以其正副本之內容相同為限。」 confirmed.
- Amendment status: 民法 single-article page carries the "not yet in force" banner; the page states it concerns 第1223條 only (修正公布 115-08-17, in force six months after promulgation). Arts. 127–130 unaffected. 民事訴訟法 沿革 page: latest entry 112-11-29 (arts. 77-1 … 486), none of the cited articles; nothing later. 強制執行法 last amended 108-05-29; 涉外民事法律適用法 99-05-26.
- Every fetched article text is identical to research/G4-statutes.md Parts 2 / 2b.
- Internal link targets confirmed to exist in the repo: src/content/columns-ja/035-taiwan-unpaid-invoice-debt-collection.md, src/content/columns-en/030-enforce-foreign-judgment-in-taiwan.md, src/content/columns-zh/044-taiwan-payment-order-provisional-attachment.md. ja 035 does cover governing law and limitation (art. 36, art. 20(3)), so the ja pointer sentence is true. G4 does not contradict 035 or 044 (arts. 515, 516, 519, 521, 526, 529 stated the same way).
- Tools: lint.py OK for all four after my edits (ko 1,399; ja 1,398; zh-hant 1,394 characters; en 798 words). variety_metrics.py check: no FAIL and no WARN in any language.

## MUST VERIFY

topics/G4.md has no "## MUST VERIFY" section. There is no item to report.

## 1. Law and facts — claim by claim (all four languages)

Each line: claim → official text → result.

- Two years for the price of goods supplied by a merchant or manufacturer, where Taiwan law applies (ko/ja/en/zh body, summary) → 民法 127 第8款 「商人、製造人、手工業人所供給之商品及產物之代價」, 「因二年間不行使而消滅」 → correct; conditional on Taiwan law in every version, including the summaries.
- Time runs from when the claim can be exercised → 民法 128 → correct.
- Governing law: parties' intention first, absent an express one the closest connection (ko/ja/en/zh); limitation follows the same law (ko/en/zh) → 涉外民事法律適用法 20 第1・2項, 36 → correct. "Not by that fact alone" (en) / 「不一定」 (zh) follows from art. 20.
- 存證信函 description → Chunghwa Post page → correct; ko/ja "내용증명 / 内容証明にあたる" is a gloss, not a foreign-law statement.
- Not an enforcement title → 強制執行法 4 第1項 (six items) → correct.
- Demand interrupts; no suit within six months of the demand → deemed not interrupted; equivalents of suit (payment order, mediation, arbitration, compulsory enforcement, "etc.") → 民法 129 第1・2項, 130 → correct, and the list is attributed to art. 129(2), not to art. 130. "Another reminder is not on the list" is a correct reading of the five items.
- Acknowledgment as a separate ground (ko/en/zh) → 民法 129 第1項第2款 → correct and hedged in ko ("될 수 있어").
- Provisional attachment: risk of impossible or very difficult enforcement; prima facie showing of the claim and the ground; security may supplement a short showing where the creditor offers it or the court finds it appropriate; court may require security even with a sufficient showing; no one-third figure → 民事訴訟法 522, 523 第1項, 526 第1–3項 (only ratio is the one-tenth cap in 第4項 for spouses) → correct in body and FAQ of all four.
- Art. 529: main case not pending → court must, on the debtor's application, order suit within a period; payment-order application, mediation application, start of arbitration count; otherwise the debtor may apply to revoke → 529 第1・2・4項 → correct; mandatory wording (명해야 / 命じなければ / must / 應) preserved.
- Payment order: fixed sum of money; claim to be shown prima facie; three bars (applicant's counter-performance outstanding, service abroad, service by public notice) → 508 第1項, 511 第2項, 509 → correct.
- Three months from issue without service → order loses effect; 20 days from service to object without reasons; lawful objection → order ineffective to that extent, application treated as suit or mediation application; no objection → may serve as enforcement title; debtor may sue for a declaration of non-existence and seek a stay against security → 515 第1項, 516 第1項, 519 第1項, 521 第1・3項 → correct.
- Security for costs: no domicile, office and place of business in Taiwan; on the defendant's application the court must order it; not for the undisputed part or where the plaintiff has sufficient assets in Taiwan → 96 第1・2項 → correct.
- Enforcement needs its own application; movables, real property, money owed by third parties (ko/en/zh); court may order the creditor to report assets or investigate itself (en/zh) → 強制執行法 5, 45, 75, 115, 19 第1項 → correct.
- Arithmetic: none in the text. No amounts, fees, statistics, durations or judgments are stated.
- Cross-language: no contradiction. Differences are omissions for length only (ja has no art. 36 / acknowledgment / arts. 19, 45, 75, 115 and points to ja 035; ko has no art. 19).

## 2. Citations

- Every legal claim has an inline law.moj.gov.tw single-article link with the right pcode and flno; unnamed article numbers always follow the last-named statute, so none is ambiguous.
- No judgment is cited, so no research/judgments file is needed.
- Sources sections list every source used in that language's body, with the check date in the page's date format (확인일 / 確認日 / Checked / 查核日期: 2026-10-06).
- Internal links: ja 1, en 1, zh-hant 1, ko 0; all exist in that language.

## 3. Rules

No private-party names, invented cases, statistics or attributed quotes; no first person; no bold, emoji, phone number or street address; contact is one sentence with the firm name and the email, asking for a non-confidential outline; author legal-ai-assistant; no lawyer-review or native-review claim; no foreign-law statement beyond the ko/ja gloss of 存證信函. Frontmatter complete; en seoTitle 38 characters and needed (title + " | Hovering Law" exceeds 60); en summary within 150–160 characters; two FAQ items per language, consistent with the body. The ja/en/zh openings are generic reader-situation scenes (an unpaid line on the receivables list, an email saying payment is "being arranged"), not stories about an identifiable person or company, so no hypothetical label is required.

## 4. Voice and sentence variety

- ko: number opening (「2년입니다.」), 합니다체 throughout, no 해라체. ja: です・ます throughout, no 体言止め in the body; headings are noun phrases. en: plain and active; headings state the column's own periods. zh-hant: Taiwan usage (簽收, 脫產, 催款, 繫屬, 釋明), no mainland terms, no 官腔 stacking.
- Titles are specific and not imperative or checklist-style. Headings carry the column's own facts (6개월, 3개월과 20일, etc.).
- Self-check items 2–7: no stock hypothetical opener; at least four very short sentences per language; no word opens three paragraphs; no three consecutive claim-(statute)-caveat paragraphs and at least one citation-free paragraph in each; contrast templates ko 2, others 0; the last paragraph ends on "no assets, no payment", not a copied disclaimer. All met.
- Observation, not a FAIL: four paragraphs in each language end on a "not on the list / not in the article" beat (not an enforcement title; a second reminder is not on the list; no one-third figure; overseas creditor is not one of the bars). Each carries a distinct legal point and the checker's contrast count stays within the limit, so I left them. A later editor could vary one if the column is touched again.

## Issues

1. en, limitation paragraph
   - Original: "Only the claims Article 127 lists get two years."
   - Problem & reason: read literally it says no other claim in Taiwan law has a two-year period, which the cited article does not say (it only lists the claims its own two years cover). ko (「2년은 제127조가 열거한 청구권에만」) and zh (「這2年只適用於…」) already tie the statement to art. 127's period.
   - Fix (applied): "Article 127's two years cover only the claims it lists."
   - Facts preserved: two years, Article 127, the limit to listed claims. Minor wording only.

2. ko, 가압류 paragraph
   - Original: 「청구와 그 사유를 소명해야 합니다.」
   - Problem & reason: 「그 사유」 can be read as "the reason for the claim". Art. 526(1) requires a showing of 請求 and 假扣押之原因; the ko FAQ already says 「청구와 가압류 사유」.
   - Fix (applied): 「청구와 가압류 사유를 소명해야 합니다.」
   - Facts preserved: the two things to be shown under art. 526(1); citation unchanged. Minor wording only.

No major issue found.

## Minor edits applied

- en.md: "Only the claims Article 127 lists get two years." → "Article 127's two years cover only the claims it lists." (lint OK, 798 words)
- ko.md: 「청구와 그 사유를」 → 「청구와 가압류 사유를」 (lint OK, 1,399 characters)
- ja.md, zh-hant.md: not edited.

Remaining room after edits: ko 1 character, ja 2, zh-hant 6, en 2 words. Any later addition needs an equal cut.

## Image verdict

OK. images/G4.webp shows one unmarked cardboard carton on an empty concrete loading-bay floor with daylight from an open door. No people, faces, text, logos, flags, labels or readable documents; nothing that depicts or recreates an identifiable case. It fits "the shipment arrived, the payment did not".

## Verification limits

- I checked the law against the official database text as of 2026-10-06 (compilation cutoff shown by MOJ: 民國115年09月24日). I did not check court practice on the amount of attachment security; the columns make no statement about practice, only that art. 526 contains no one-third figure.
- Voice in ko, ja and zh-hant was judged by a model, not by a native-speaker reviewer or a lawyer.

VERDICT: PASS
