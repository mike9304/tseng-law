# Independent RTL code and SSR review

Verdict: PASS within the reviewed code and SSR scope. No blocking finding. This is not a fresh-build browser or deployment verdict.

Reviewer: `/root/rtl_fix_review`. Repository baseline: `25433f39bdb04cb7cae43094b28c92098754da29`. Reviewed implementation and test hashes are recorded in `manifest.json`.

## Confirmed baseline

Read the actual baseline browser result: 132 cases, 129 passed, 3 failed. UR915 desktop and mobile reverse `85-1` in the H2, body whole-law link and source whole-law link; its mobile body link also wraps. UR919 mobile preserves `22-2` order inside existing BDI but splits the identifier across lines. These facts match the baseline helper's Persian-only whole-law detection, raw headings and missing no-wrap style.

## Reviewed behavior

- `ColumnContent.tsx:75`: protected links, code and existing BDI become one separator in both text collection and traversal. This preserves subsequent offsets and prevents a heading/paragraph wrapper from bypassing a link's authority check. Custom ReactMarkdown links are recognized by `href`/HAST tag as well as a literal anchor type.
- `ColumnContent.tsx:83`: explicit Persian, Urdu, Arabic and Hebrew labels select precise identifier spans. An equal numeric range elsewhere is not selected. Unicode letter/mark/number boundaries reject embedded label fragments; the actual Hebrew `בסעיף` and `שבסעיף` forms are supported.
- `ColumnContent.tsx:122`: the original digit string is retained inside `bdi dir="ltr"` with inline `white-space:nowrap`. It is emitted by SSR and does not depend on hydration, effects, client state or browser JavaScript. The existing CSP permits inline styles.
- `ColumnContent.tsx:140`: linked identifiers still require the exact official HTTPS origin and LawSingle/LawAll path. LawSingle uses the exact normalized digit token corresponding to a syntactically valid `flno`. Larger/different numeric groups remain unchanged. URLs are never reconstructed or replaced by this helper.
- H2/H3 and paragraphs use the explicit-label path. H2 section IDs, original visible text, nested emphasis and link attributes remain intact. A linked heading is wrapped only by its official-link renderer.

## Evidence inspected

The worker's expanded regression tests are genuine SSR render tests, with literal expected source identifiers. The same test SHA ran against unchanged production (21 failed, 19 passed, exit 1) and the reviewed fix (40 passed, exit 0). I inspected the diff and test cases and independently recalculated the receipt, log and current input hashes; all matched. Tests cover all three digit families, existing Persian/Arabic LawSingle behavior, Hebrew and Urdu actual references, nested emphasis, section IDs, equal ordinary ranges, wrong/flno-mismatched/foreign URLs, code, protected offsets and duplicate wrapping.

No extra repository source changes or redundant test runs were made by this reviewer. Adjacent renderer suites and the rebuilt 72-article browser run are owned by the release worker; this review does not claim their completion.

## Scope limits

The helper wraps a complete identifier contained in one text leaf, including a whole identifier inside emphasis. It does not assemble an identifier deliberately split across multiple inline formatting nodes; this was not supported by the previous helper, and the reviewed actual UR/HE references do not use that form. This is not a new regression or a release blocker for the reviewed corpus.
