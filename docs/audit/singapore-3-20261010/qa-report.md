# Singapore publication release verification

Status: LOCAL RELEASE VERIFICATION COMPLETE. The caught SEO metadata failure was repaired and rechecked. Local production search has the explicit environment limitation described below; normal development search passed. Proceed with the scoped release and require real production search/readback before claiming publication complete.

Prepared by root from independent QA runtime logs and source-review records, 10 October 2026, Asia/Taipei. The QA agent did not author the articles or change the product implementation. Its independent mobile reviewer handles a separate viewport inspection.

## Reviewed scope

Isolated checkout: `work/sg-release/repo`, based on remote main `65a560ec9bcbcac792021b9a590c66d4b246bb71`. Scope: three English columns, three WebP hero images, five additive registration/test-fixture changes, and publication audit records. No application runtime, package manifest, lockfile, original draft, existing article or genuine embedding vector was changed.

Current manuscript SHA-256 values:

- 499: `7ba5cadc66c2cbab4a58741d9d9bf6ba25ebabdbdbd5388dff7ef708d4cd2f03`
- 500: `264409b0d0862ffdf478b060e6531b0e90f5b44841816b17a22e99063e1b3b64`
- 501: `c0b3019db90b003bf8f176a893998d9c34a730b651cf1e0e1537652c3ab0cff4`

Independent integrated review passed the preserved body/source/image content. A separate narrow review passed the two later SEO title changes; reversing exactly the one metadata line in each article restores the earlier complete file hashes. Those historical reviews remain unchanged. Source URLs are preserved in order (18/16/9) and original manuscript bodies differ only by removing the redundant leading H1.

## Gates and recorded repair

The isolated dependency install completed using bundled Node 24.19.0 and the existing lockfile. Direct Sharp 0.33.5 and nested Next Sharp 0.35.3 are both correctly locked; their different versions were initially suspected but no stale-dependency defect was established. Image encoding explicitly used nested Sharp 0.35.3. The initial suspicion is not reported as a repaired product defect.

| Gate | Observed result |
|---|---|
| `npm run typecheck` | PASS, exit 0, 123.60 seconds |
| `npm run lint` | PASS, exit 0, 29.38 seconds |
| Full unit suite, `npm run test:unit -- --maxWorkers=1 --testTimeout=20000` | Initial run: 1,409 files passed, 1 failed; 14,087 tests passed, 1 failed, 14 skipped, 1 todo. This initial run was not an all-pass result. |
| SEO failure repair | Two metadata `seoTitle` values exceeded the site's 60-character branded title limit. Only 499/501 SEO titles were shortened; body, display title, sources, images and tests were unchanged. |
| Failed SEO suite rerun with the same assertions | PASS, 6/6, exit 0, 3.58 seconds. Branded titles now 57/60/59 characters for 499/500/501. |
| `npm run security:builder-routes` | PASS, exit 0; 279 files, 273 handlers, four existing allowlisted routes. |
| `npm run test:release-config` | PASS, 9/9, exit 0. |
| Clean production build | PASS, exit 0, 178.85 seconds; fresh `.next-sg-release-qa-20261010`, build ID `TuJMYNgDQwTpT1mSM-haO`. |
| Actual local desktop/mobile rendering and navigation | PASS: desktop 78 article checks, three archive links; mobile 33 assertions, six real pointer transitions and six hash checks. Search environment exception is separated below. |
| Final source scope and generated-file restoration | PASS: 26 expected paths match actual scope, zero extra/missing/hash errors, `git diff --check` exit 0; `next-env.d.ts` and `tsconfig.json` restored byte-exact to HEAD. This report is the sole later documentation addition. |

Before the full run, the integrator's narrow run passed 136/137 assertions and an isolated rerun passed 6/7, with the existing EN/KO aggregate body-length comparison exceeding its default five-second timeout both times. In the full suite the unchanged comparison passed in 9.98 seconds with an explicit 20-second CLI timeout. This is a runtime allowance change only: no assertion, test source or repository timeout configuration was weakened. Initial failure logs are retained.

The full suite's substantive failure was diagnosed and repaired through the minimal two-field change above. Only the failing suite and affected source/hash/title invariants were repeated, followed by the remaining gates; the entire 590.83-second unit run was not repeated after this metadata-only repair. Existing tests cover the unchanged remainder. This report preserves that distinction.

An initial source-check helper incorrectly compared an adjacent blank line after H1 removal. Its failed output is retained as `qa/source-check.json`; the corrected comparison is `qa/source-check-verified.json`, followed by current `qa/source-check-postrepair.json`. This was verification-tool correction, not a manuscript change.

Independent scope evaluator found all reviewed hashes aligned, all 436 prior pending-embedding entries preserved with exactly three additions and no duplicates, no unrelated runtime edit, and no weakened test expectation. It correctly left contract closure pending build and rendered checks.

## Build, browser and final scope

The successful clean build used a previously absent, isolated `.next-sg-release-qa-20261010` directory. Existing CSS Autoprefixer advisory warnings are retained in the build log; those files were not changed. The shared Chrome automation profile was occupied, so QA used isolated Playwright browser contexts without closing or modifying the user's shared browser or existing services.

Desktop checks at 1440 × 1000 passed 26 assertions for each of the three articles: HTTP response, exact rendered body and ordered links, single display H1, date, visible generated-image caption, image decoding/alt text and exact asset bytes, no horizontal overflow, canonical/title/description/OG/Twitter/indexability, Article structured data without false authorship, disclaimer/contact/footer and no body bold markup. All three archive links were present. Browser console events were empty. The separate mobile reviewer checked 390 × 844 rendering, image crops, readable text, sources/disclaimers/footer, six actual pointer navigation transitions and unchanged source/asset hashes. Screenshots were visually inspected by the independent reviewers. Root additionally viewed desktop 499 hero and 500 body/table, and mobile 500/501 title-image screens; no blocking visual issue was found.

The local production-mode search endpoint returned HTTP 503 `rate_limit_unavailable` because the isolated checkout lacks the shared rate-limit configuration. `desktop/desktop-results.json` deliberately retains `passed:false` for that environment-limited combined run; it is not relabelled as fully green. Without changing any guard or configuration, the normal development-mode search returned HTTP 200 and all three actual article slugs, while the development article render had zero console warnings/errors and zero runtime errors. The real production search must still be checked after deployment. This scoped release does not purport to validate missing local external-service configuration.

Both owned local servers and their browser contexts were closed after checks. `local-server-teardown.json` records no listeners at the two owned ports, 45731/45732. The integrator then restored only the generated `next-env.d.ts` and `tsconfig.json` differences; the independent verifier confirmed both byte-exact to HEAD and all 26 frozen files matched the actual scope, with no extra paths, missing paths, hash errors or whitespace errors (`qa/final-scope-check.json`). Archive this report as one exact documentation-only addition, then refresh the final release freeze without changing any reviewed source or asset.

## Evidence and limits

Raw evidence is under `work/sg-release/qa/`: `gate-results.json`, `unit.log`, `seo-repair-test.json`, `seo-repair-test.log`, `remaining-gate-results.json`, `source-check-postrepair.json`, and build/browser records as completed. Initial narrow logs remain outside that directory as `integration-narrow-tests.log` and `integration-en-rerun.log`. Editorial evidence is `integrated-final-review.md` and `seo-title-repair-review.md`; the final integration freeze records exact release paths and hashes.

Studio SSH was unavailable. Studio reservations or ship-lock state were not verified. The applicable new-column release policy uses fresh origin/number/slug checks and a fast-forward-only scoped push; the separate legacy existing-column audit lane's lock rule is not treated as a global publishing requirement. A fresh origin check remains necessary immediately before push.

No deployment, public-screen verification, actual contact submission, email delivery, external provider test, paid API embedding or human attorney/native-speaker certification is claimed here.
