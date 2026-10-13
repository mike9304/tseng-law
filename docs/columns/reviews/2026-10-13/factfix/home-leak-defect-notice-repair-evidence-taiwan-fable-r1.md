# review-r1 — fact-home-leak-defect-notice-repair-evidence-taiwan-1 (Claude Fable, round 1)

Review date: 2026-10-12. In scope: zh-hant only (files.tsv). Reviewer did not write the draft.

## Verdict

PASS. The single correction is supported by the current statute text, nothing else in the body changed, all eight source links are kept, factguard passes, and the full vitest suite passed on the draft without any test re-anchoring.

## Issue 1 — 民法第354條第1項 paraphrase (verify.md verdict: PARTLY)

URL opened independently (WebFetch, 2026-10-12):
https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=354

Statute sentence checked (current text as served):

> 物之出賣人對於買受人，應擔保其物依第三百七十三條之規定危險移轉於買受人時無滅失或減少其價值之瑕疵，亦無滅失或減少其通常效用或契約預定效用之瑕疵。但減少之程度，無關重要者，不得視為瑕疵。
> 出賣人並應擔保其物於危險移轉時，具有其所保證之品質。

Page notes: only the 第166-1條 施行日期 note and the 115-08-17 amendment of 第1223條; nothing touches 第354條. Text matches what verify.md quotes character for character.

English page https://law.moj.gov.tw/ENG/LawClass/LawSingle.aspx?pcode=B0000001&flno=354 returned an empty body today as well, so, as in verify.md, the verdict rests on the Chinese page only.

Verdict check: PARTLY is right.
- Wrong in the live text and correctly fixed: 「減少價值、通常用途或契約約定用途」 omitted 滅失, used 用途 for the statute's 效用, and used 約定 for the statute's 預定.
- Right and correctly left alone: 「著重於危險移轉時」 (= 危險移轉於買受人時), the proviso 「價值或效用減少的程度無關重要者，不得視為瑕疵」 (= 但減少之程度，無關重要者，不得視為瑕疵), and the 第2項 sentence on 所保證之品質.

Per-language result:
- zh-hant: draft line 47 now reads 「房屋是否已有滅失或減少其價值、通常效用或契約預定效用的瑕疵」. Each term (滅失或減少 / 價值 / 通常效用 / 契約預定效用) is the statute's own wording, paragraph attribution (第1項) is correct, no condition added or dropped. Not an over-correction: the statute's two parallel clauses are merged into one list, which is a faithful compression, not a new fact.

Neighbouring articles in the same edited paragraph were also opened to confirm the untouched sentences still hold:
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=373 → 「買賣標的物之利益及危險，自交付時起，均由買受人承受負擔，但契約另有訂定者，不在此限。」 Column sentence 「原則上以交付作為危險移轉時點，但容許契約另有約定」 is correct.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=355 → both paragraphs match the column's description (已知瑕疵不負責；重大過失不知且未保證者不負責，故意不告知除外).

## Scope (diff orig-zh-hant.md vs draft-zh-hant.md)

Two hunks only:
1. Front matter: lastmod "2026-10-04" → "2026-10-12".
2. Body line 47: the nine-character replacement described above. Link, surrounding sentences, and the rest of the paragraph are byte-identical.

Summary, title, seoTitle, headings, and the 法規依據 list are unchanged. All eight law.moj.gov.tw source links (354, 355, 356, 357, 359, 365, 366, 373) and the contact-page link are kept. No URL added or removed, so no REMOVED-URL line is needed.

issues.md's second bullet (house-format lint: no body email, final heading 法規依據) is not factual and was correctly left out of scope, consistent with triage.md (TRIAGE: FACTUAL 1).

## Language

The corrected clause reads as native Taiwan legal Chinese; 「滅失或減少其價值、通常效用或契約預定效用的瑕疵」 is standard statutory phrasing and sits naturally with the existing 「價值或效用減少的程度」 later in the same sentence (the live text had been internally inconsistent, 用途 then 效用). No translationese.

## Tests

tests.patch contains only the content diff of src/content/columns-zh/174-home-leak-defect-notice-repair-evidence-taiwan.md (lastmod + the corrected sentence). No test file is touched, no .skip/.only (grep count 0). vitest-0.log: 74 files / 994 tests passed, sync rounds 0, so no existing assertion pinned the old wording and no fact-locking assertion was weakened. Tests verdict: OK.

## Checks run by the reviewer

- `python3 factguard.py <jobdir> 2026-10-12` → `NOTE [zh-hant] body characters changed: 9 (0.3%)` / `FACTGUARD: PASS`.
- guard.txt ends with FACTGUARD: PASS.

## Blocking issues

None.

## Tiny edits by the reviewer

None. The draft was not modified.

VERDICT: PASS
