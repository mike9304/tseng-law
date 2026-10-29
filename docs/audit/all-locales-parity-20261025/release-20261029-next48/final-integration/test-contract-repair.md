# Next48 test-contract correction

The assigned six failures are resolved. Exactly three existing test files changed; their 98 tests passed with the original default timeouts, and ESLint `--max-warnings=0` exited 0. This is a bounded rerun, not a claim that the earlier full 13-suite run passed.

## Contract and evidence

- Publication dates: the four core-locale display tests applied the original case publication date to new translations. The existing reviewed translation fixture now matches the exact locale and filename before applying October 26. KO6, JA6, EN4 and ZH-HANT2 are translations; original EN915/916 and ZH-HANT918–921 retain October 25. All 24 source frontmatters and their hashes are recorded in `before-and-contract.json`; numeric-prefix-wide redating was not introduced.
- Category parity: cases 915, 916, 918, 919, 920 and 921 now have four core-language versions. English 915/916 no longer count as native-only because Korean counterparts exist; EN918–921 are new English counterparts. The shared English corpus rises from 143 to 149, and all six parse as `legal`: formation 9, legal 139, case 1. Existing per-locale category equality assertions remain intact.
- Sitemap: the original case fixture already counted the 16 source articles, but the expectation omitted the 18 new core translations. The translation fixture is filtered to exclude guidance locales, whose files are already counted from disk. Both expectation sums gain KO6 + JA6 + EN4 + ZH-HANT2; before/after are 3223/3214 and the nine excluded English noindex routes remain nine. Exact reconstructed URLs and retained actual-loader receipt bindings are in `sitemap-investigation.json` and `.md`.

## Actual verification

- Original retained run: 13 suites / 490 tests, 481 passed and 9 failed, exit 1. This assignment owns six failures; the other three metadata failures are handled by root. Original log SHA256: d790d981d0e36aa785ae58259b729c9ce6c83b65704a5c5eacb17f262462b59a.
- Rerun: 3 suites / 98 tests passed, exit 0, Vitest duration 9.63 seconds. Date 12, category 49, sitemap 37. Exact command, PID, timestamps and input hashes: `run-command.json`; output: `tests.log`.
- ESLint: same Node 24.14.1, only the three changed files, `--max-warnings=0`, exit 0; `eslint-command.json` and `eslint.log`.
- Scoped `git diff --check` exit 0. Exact changes: `test-contract.patch`.
- All 2,499 professional source files stayed byte-identical during the test run; related fixtures/runtime inputs also stayed unchanged. No manuscript, runtime, shared fixture, timeout or assertion weakening was made by this correction. No extra loader, build, network action or deployment was performed.
