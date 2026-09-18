# Fable review response — semiconductor hub (2026-09-16)

Reviewer file: `docs/marketing/FABLE-REVIEW-2026-09-16.md` (HEAD at review: `dd5eac87`).
This file records what was changed after that review. No deploy, no push.

## Disposition

| Band | Item | Action |
|---|---|---|
| 치명 | none | — |
| 높음 | H1 12 test files / 19 tests red vs BASE | Fixed. Re-pinned the same-locale related links, counts, hashes, footer row, and JA intro order. Reworded EN hub “line up” / “finish line” so the Kakao/LINE guard stays intact. |
| 높음 | H2 attorney gate on G6–G8 | Code-side option (b): stripped installation / after-sales / warranty / “rep office cannot trade” in all four hub locales. Replaced with published company-setup wording (entity compare, bank delay). Titles and “supplier” naming remain `[NEW][attorney-review-required]`. |
| 중간 | M1 EN 008 body + JA/EN 008 FAQ | Fixed. Korea is now a labeled comparison, not the default reader. |
| 중간 | M2 hub inbound from company-setup | Not done. HUB-SEO-REVIEW P2; wait for attorney sign-off. |
| 낮음 | L1 lastmod 2026-09-06 | Not done. Constant is shared across all EN/JA static routes. |
| 낮음 | L2 shared family-dispute CTA | Not done. Template chrome; P3. |
| 낮음 | L3 five-key hreflang pin | Added for the hub slug. |
| 낮음 | L4 snapshot script | Added four hub URLs. |
| 낮음 | L5 labeled Korea-origin examples | Accepted trade-off. Unchanged. |
| 낮음 | L6 sitemap.test.ts TS2322 | Fixed. Mock fns now return typed records; CI typecheck is green on this branch. |

## Verification

- `npx vitest run` on the 12 H1 files + semiconductor + Fable-specified suite: 18 files / 207 tests pass.
- `npx tsc --noEmit`: exit 0.
- Full `npx vitest run` (= `npm run test:unit`): **1133 files / 8690 tests pass**, 14 skipped, **1 fail** — `src/lib/builder/security/__tests__/qa-runtime-attestation.test.ts` (“canonical audit root must be an existing real directory”). Fable already classified this as a macOS TMPDIR / builder-infra failure present on BASE, not this diff. The 12 H1 files from this branch are green.

## Still no-ship until

Attorney initials HUB-COPY §3–§6 (titles, supplier naming, KO/JA national HQ). G6–G8 unpublished operating-model claims are no longer in `intent-pages.ts`.
