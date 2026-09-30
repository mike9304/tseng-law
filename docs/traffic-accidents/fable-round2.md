# Fable 5.1 — editorial round 2

Model identity verified from CLI modelUsage: `claude-fable-5-1`, firstParty. Public copy only, no tools, no external-source browsing by reviewer.

**Verdict: REQUEST_CHANGES** — narrow, with two one-line text fixes left; all five prior blockers are resolved in the copy you pasted.

This is an AI review of the pasted text only. I did not browse, open any source, or run anything, and it is not attorney approval.

## Prior blockers

| # | Item | Status |
|---|---|---|
| 1 | 003 Q3, Article 503 (acquittal / barring prosecution / declining to entertain, fees on plaintiff-requested transfer) | Resolved in KO, ZH, EN, JA |
| 2 | 012 "any single factor" | Resolved in all four |
| 3 | 012 firm-handled assertions | Resolved; headings and bodies attribute the case to the original article only |
| 4 | Insurance figures (200k / 80k–3m / 3m / 3.2m, tied to accident date) | Consistent across all four and with your quoted snippets; I cannot confirm the 2026 amendment myself, so this rests on your FSC check |
| 5 | ZH Q6 conditional; JA Q5 「取り下げた者は再び告訴できません」 | Resolved |

The Article 62 "must move" wording is also correct in all four languages.

## Remaining blockers

1. **ZH 003 Q15, boundary date.** 「2026-07-01 以前發生的事故，可能適用先前標準」 contradicts the preceding clause, because 以前 includes the date itself in Taiwan legal usage. As written, a 1 July accident falls under both standards. Change it to 「2026-07-01 前發生的事故」 or 「2026-06-30 以前」.

2. **EN 003 Q5, complaint withdrawal.** "A withdrawn complaint cannot be refiled" has the same overbreadth that was fixed in JA Q5. Article 238 bars only the person who withdrew, which EN Q18 already states correctly. Suggested: "The person who withdraws cannot file a complaint again."
   - KO Q5 (「취하한 뒤에는 다시 고소할 수 없습니다」) and ZH Q5 (「撤回後不得再行告訴」) drop the subject in the same way. Align them with their own Q18 wording in the same pass.

Once these edits are made, I see no other text blocker, and I don't need another full round.

## Non-blocking, fix if cheap

- **Q6 citation mismatch (all languages):** the inline link cites Articles 10 and 11 for the 30-day, one-time review, but the Q6–Q10 source list cites Articles 11–15. Confirm which article carries the review rule and make the two agree.
- **Q15 effective-date wording:** your §9 snippet shows the amendment takes effect on 1 July 2026. "Applies to accidents occurring on or after" is the natural reading but goes a step beyond the snippet; confirm it or soften it.
- **EN 003 Q2:** "from day 7 / from day 30" reads slightly earlier than "after seven / thirty days" in EN 049 and the other languages. Use "after".
- **ZH and JA Q1:** 「雙方」/「双方」 should be 「當事人均同意」/「当事者全員」; the statute covers multi-party accidents, and KO and EN already say "all parties".
- **EN 003 Q19:** "Traffic Act Article 62" should use the full statute name, as in 049.
- **Terminology drift:**
  - JA Q3 says 民事庭 but Q8 says 民事部.
  - JA Q15 body uses 強制汽車責任保險法 but the source list uses 強制自動車責任保険法.
  - KO uses both 절차 규정 and 규칙 for the same appraisal rules.
  - ZH Q15 「新臺幣 TWD」 is redundant.
- **049 categories:** ZH, EN and JA use 「法律資訊」/"Legal information"/「法律情報」, while 003 and 012 use the "Taiwan …" form. Check this doesn't split category filtering.
- **FSC benefit-standard link:** it carries a stray `&kw=1200` search parameter; your verified URL has none.

## Not certified by me

- **Runtime and rendering:** tests, build, lint, browser checks, the byline "Updated" display, hub link localization, and that `#sec-3` lands on Q3 in all four locales.
- **Live sources:** the FSC, MOJ, NPA and judicial pages.
- **Release gates:** the full suite with the one timed-out search test, plus build, lint and browser checks, still need a clean re-run on the final commit.
