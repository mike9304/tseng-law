# I2 final review (Fable 5.1, round 1) — taiwan-estate-tax-2026-amendment-gifts-before-death

Date: 2026-10-05. Reviewer: Claude Fable 5.1 (final gate; did not write the column). Files: `drafts/I2/{ko,ja,en,zh-hant}.md`, `drafts/I2/facts.md` (not trusted; sources re-checked), `images/I2.webp`.

## Verdict

PASS. All four languages are publishable now. Image OK. No major issues found. One minor citation gap was fixed in all four files (details below). Lint OK for all four after the edit.

## Scope checked

1. Law and facts, per language, against `research/statutes.md` (post-2026-09-11 text of 遺產及贈與稅法 §1, 4, 6, 8, 10, 11, 12-1, 13, 15, 17, 17-1, 18, 23, 26, 29, 30, 44; 民法 §828, 1138, 1140, 1144, 1151; MOF 2026-09-11 release; MOF 2026 amounts), the official summary page of 憲法法庭113年憲判字第11號 (`judgments/cons-113-11-summary.html`), and five pages opened on law.moj.gov.tw / mof.gov.tw today because they are cited but not quoted in statutes.md:
   - 遺產及贈與稅法 §20 I (6): 「配偶相互贈與之財產」 — matches the spouse-gift statement in all four.
   - 遺產及贈與稅法 §59 I: 「本法自公布日施行」 — matches.
   - 中央法規標準法 §13: 「自公布或發布之日起算至第三日起發生效力」 — 2026-09-11 counted as day one gives 2026-09-13; all four say 9/13. Matches.
   - 民法 §1030-1 I: equal division of the difference in post-marriage remainders, excluding inheritance/other gratuitous acquisitions and 慰撫金 — matches ko/ja/en wording; zh-hant only names the claim.
   - 遺產及贈與稅法 §26 (listed by MOF as amended): current text still says written application before the deadline, 3-month limit, exception for 不可抗力/特殊事由 — all four say exactly this.
   - MOF 2026-09-11 release: confirms amended articles (6, 17-1, 23, 26, 30, 41, 51), the four amendment points, and that the release itself prints no effective date (the columns derive 9/13 from §59 + 中央法規標準法 §13, which is correct).
2. Arithmetic in every worked example (recomputed):
   - ko / zh-hant: 5,000 − (1,333 + 553 + 112 + 138 = 2,136) = 2,864 → 10% = 286.4萬. With 1,000萬 gift: 6,000 − 2,136 = 3,864 → 386.4萬; 1,000/6,000 = 1/6 → 64.4萬 donee, 322萬 heirs. Correct.
   - ja: 6,000 − (1,333 + 553 + 168 + 138 = 2,192) = 3,808 → 380.8萬. With 1,500萬 gift: 7,500 − 2,192 = 5,308 (≤ 5,621) → 530.8萬; 1/5 → 106萬1,600 donee, 424萬6,400 heirs. 4 heirs × 1/4: 3 consents = majority of heads and 3/4 of shares. Correct.
   - en: 80m − 21.36m = 58.64m → 5,621,000 + 15% × 2,430,000 = 5,985,500. With 20m gift: 100m − 21.36m = 78.64m → 5,621,000 + 15% × 22,430,000 = 8,985,500; 1/5 → 1,797,100 donee, 7,188,400 heirs. Correct.
   - Bracket constants: 5,621萬 × 10% = 562.1萬; 562.1萬 + (11,242 − 5,621)萬 × 15% = 1,405.25萬. Match the MOF figures used.
3. Cross-language consistency on law: identical on scope (§1 I, §4 III), 2026 amounts, brackets, §15 I donee classes, §6 III/IV/V, §17-1 I–III, §23 I, §26, §29, §30 I/II/III/IV/VII, §44, §8, §11 II, §20 I (6), judgment date and holding, effective date 2026-09-13. No contradictions.
4. Citations: inline links follow each claim; statute links point to the correct single-article URLs (pcode G0340072 / B0000001 / A0030133 with the right flno); the judgment link is the official cons.judicial.gov.tw summary URL given in statutes.md and the topic brief; both MOF URLs match statutes.md; sources sections list every cited source with check date 2026-10-05. Internal links verified to exist in the repo for the right language: `025-taiwan-estate-tax-foreign-decedent` (ko/ja/en/zh), `046-taiwan-marital-property-regime-international-couples` (ko), `060-taiwan-inheritance-renunciation-debt` (zh). No links to batch columns.
5. Rules: no private-party names (the summary page names the applicants; the columns do not); no bold; no phone; no street address; email-only contact, one soft paragraph before sources; `author: "legal-ai-assistant"`; no lawyer-review or native-review claim; hypotheticals marked (가령…가정합니다 / 例えば…とします / Suppose / 假設); foreign-law notes are referrals only (KR tax professional / 日本の税務署・税理士 / US tax professional), no foreign rule stated; frontmatter keys complete; en title + " | Hovering Law" > 60 so seoTitle present at 40 chars; en summary 153 chars, no forbidden characters.
6. Voice: read each file in full, plus titles, first paragraphs, headings and endings separately. Deletion test on the first two paragraphs of each version: every sentence carries a fact (figures, date of amendment, who pays, what changed), none is removable without loss.
7. Image opened.

## Issues

### Minor (fixed by me)

1. All four files, paragraph on paying from the decedent's deposits (§30 VII).
   - Original: ko 「…상속인 전원의 동의가 필요합니다(재정부 보도자료).」 / ja 「財政部は、その税額を遺産で納めるには相続人全員の同意が必要だと説明しています。」 / en "the Ministry of Finance says paying that tax out of the estate needs the consent of all the heirs." / zh-hant 「財政部說明仍須經全體繼承人同意。」
   - Problem and reason: the statement that paying the donee's share out of the estate needs all heirs' consent comes from the MOF release (「受贈人申請以遺產抵繳或繳納擬制遺產稅額，應經全體繼承人同意，始得為之」), not from the statute's wording, which only excludes the donee's tax from the majority rule. Series rule 2 wants the link right after the claim; the release was linked only in the intro and sources.
   - Fix (applied): made the MOF reference an inline link to the 2026-09-11 release in all four languages. Wording otherwise unchanged.
   - Facts preserved: yes. No numbers, conditions or legal strength changed. Lint OK afterward (ko 3,498 / ja 4,396 / en 1,587 words / zh-hant 2,678).

### Noted, not changed (acceptable as published)

2. Table row 「중증 이상 장애 특별공제」 / 「重度以上の障害の特別控除」 / "Extra deduction for severe disability" / 「重度以上身心障礙特別扣除」 abbreviates §17 I (4), which also covers 精神衛生法 嚴重病人. This is the MOF's own label for the row; the omission does not make any sentence wrong. Left as is.
3. §6 IV (executor): the columns say the executor acts for "heirs and donees" (ko/ja/zh) or "heirs and donees" (en); the statute's paragraph-1 taxpayers also include legatees and the estate administrator. Simplification, not an error. Left as is.
4. ja line 48 「成年に達するまでの年数1年につき56万元」: the previous round kept this as standard Japanese tax phrasing (国税庁 No.4164 uses the same pattern). Agreed; left as is.
5. ja/en/zh-hant keep a short forward reference to the marital-property deduction ("後で述べる" / "discussed below" / "後面提到的") inside the first example. It tells the reader which deduction is being excluded from the example; not filler. Left as is.
6. en title has a comma before "and Who Pays". Readable; left as is to avoid touching title/H1 for no gain.

### Major

None.

## Minor edits applied

- ko.md: linked 「재정부 보도자료」 in the §30 VII paragraph to the MOF 2026-09-11 release.
- ja.md: linked 「財政部」 in the same sentence to the MOF release.
- en.md: linked "the Ministry of Finance says" to the MOF release.
- zh-hant.md: linked 「財政部說明」 to the MOF release.

No other text, number, citation or frontmatter value was changed.

## Lint (after edits, 2026-10-05)

`python3 lint.py drafts/I2/<lang>.md <lang> taiwan-estate-tax-2026-amendment-gifts-before-death`

| lang | result | length |
|---|---|---|
| ko | OK | 3,498 chars |
| ja | OK | 4,396 chars |
| en | OK | 1,587 words |
| zh-hant | OK | 2,678 chars |

ko is 2 characters under the 3,500 cap; any further ko addition must be offset elsewhere.

## Image verdict

OK. `images/I2.webp`: a tabletop with a cup of tea, a small potted jade plant, a plain white device and a stack of unlabelled kraft folders in soft daylight. No faces, no readable text, no logos, no flags, no identifiable documents or people. Calm and respectful; fits a column about preparing an estate-tax filing. Generic rather than topic-specific, but nothing in it conflicts with the column.

## Review limits

Native-speaker naturalness and legal accuracy were judged by a model (Fable 5.1), not by a native speaker or a lawyer. Tax-office practice after the amendment (forms, e-filing, 施行細則) was not checked; the columns do not claim anything about it.
