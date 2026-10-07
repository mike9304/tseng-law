# First expansion batch: release preflight — 2026-10-08

Decision by primary Codex: ready for the scoped publication of 40 new criminal-law articles, seven existing-text corrections, and native discovery improvements. This is a pre-publication record; production verification follows separately. The broad five-audience coverage goal remains active.

## Exact scope

[Candidate 3](first40-release-candidate-3.json) binds 68 source/content/test files. Its SHA256 is `0e09b8e27485175b24050193ba5f6d517258767d7686f53a97603327caffa467`. All 67 candidate-2 hashes remain unchanged; the only final addition is truthful general English-article navigation copy. Primary independently rechecked all 68 after tests/build/browser verification.

New articles: EN405–412, ZH413–420, KO421–428, JA429–436, VI437–444, eight per locale. Original 401–404 remain. Existing EN355 receives current drug/CBD corrections and the criminal board tag. KO064 receives current bank-warning/refund corrections but retains its original classification until the shared-language versions are reviewed. Five 403 source lists now include their existing inline official prosecutor explanation.

Expected board membership after release: KO12, ZH12, EN13, JA12, VI12; total61 =20 previously published +40new +1existing reclassification. The task-created publication total is60, not61. No draft or unreviewed batch2 article is included.

## Independent decisions

Three separate actual GPT-6 Astra max reviewers read the native articles and issued their own scoped decisions without reading each other's reports. Their exact reports and hash evidence are retained under [reviews](reviews), indexed by [evidence-index.json](evidence-index.json).

- [A final content/source/editorial decision](reviews/astra-a/first40-final-review.md) and [candidate3 copy/hash addendum](reviews/astra-a/first40-candidate3-addendum.md).
- [B full review and candidate3 decision](reviews/astra-b/first-batch-24-review.md), including visible search versus JSON-LD and English archive-copy corrections.
- [C final review](reviews/astra-c/FINAL-REVIEW-CANDIDATE2.md) and [candidate3 addendum](reviews/astra-c/CANDIDATE3-ADDENDUM.md).

No human lawyer/native-speaker certification, guaranteed ranking, or whole-corpus approval is implied. Current Codex has final release authority under the user's October1 instruction.

## Executed technical gates

- Full `npm run qa`: exit0; typecheck, lint, 1,410 test files /14,088 passing tests,14 skipped,1 todo, and route mutation-guard audit. Initial nine failing assertions were repaired and101 focused tests passed before this final full run.
- After the final English prompt-only change,15 existing language-link tests passed. No article, law, source, routing, or href behavior changed after the full QA run.
- Clean production build from the final source in previously absent `.next-criminal-release-2`: exit0. Existing unrelated ContactEditorial CSS autoprefixer warning remains; no suppressed type or lint errors.
- [Dev browser run](browser-dev-results.json): exit0,10 board flows,49 article body reads,10 native archive flows,0 browser errors.
- [Final built-server browser run](browser-built-results.json): exit0 at2026-10-07T19:06:47Z,10 board flows,59 desktop/mobile article reads covering all47 changed texts,10 archive flows,2 English hint navigation/dismissal checks,52 required sitemap URLs present,0 browser errors. Every rendered body block and authored hyperlink matched the reviewed Markdown; native canonical/FAQ language, real hero images, native-only new-article alternates, noindex absence and horizontal overflow checked.
- Real browser clicks covered search, empty result, reset, article entry and return to the native board, archive topic filters and exact searches. The in-app Browser runtime had no browser endpoint; standalone Playwright was used after the documented availability check.
- Primary directly inspected full-page KO mobile board, VI mobile article and ZH desktop board, then final-resolution390px KO board/VI article/JA article viewports and1440px EN board. Text, search controls, native links and responsive wrapping were legible; no clipped content or horizontal overflow observed. Neutral fallback hero is the actual existing image asset, without invented captions.
- `git diff --check` passes. Generated `next-env.d.ts` / `tsconfig.json` dist-path changes were restored and excluded.

## Broad builder smoke: known failure, not a PASS

`NEXT_DIST_DIR=.next-criminal-release SMOKE_PORT=4658 npm run test:builder-smoke` exited1 at the existing `tests/builder-editor/admin-builder.playwright.ts:440` assertion requiring the retired `hero-search-bar overlap` string. The isolated harness reached ready attestation and its teardown proved unchanged canonical runtime/audit checksums. The remainder of the builder editing smoke did not execute.

The identical baseline mismatch was already documented before this expansion in [the prior release preflight](../criminal-20261007/preflight.md) and [its independent scope review](../criminal-20261007/reviews/smoke-scope-astra-a.md). The current source still has the newer KO home renderer, while the untouched test expects old markup. No smoke assertion was removed or weakened to obtain a pass. This does not certify builder-editor publication or external provider integrations. The complete relevant criminal-board/article flow was separately exercised above.

## Content and remaining work

[Root revision ledger](root-revision-ledger.md), [KO064 legal audit](root-ko064-review.md) and five writer editorial ledgers preserve actual sentence changes, reasons and legal meaning. Shared supported-language variety checks report zero FAIL; Vietnamese received manual section5 review, not an unsupported automated PASS. Original author/image provenance is retained and no decorative bold introduced.

[COVERAGE-STANDARD](coverage-standard.md) remains the broad acceptance floor. Batch2, untranslated legacy corrections, further criminal procedure/offense families and shared-topic reclassification remain open. This batch is useful publication progress, not evidence that almost every search is covered.
