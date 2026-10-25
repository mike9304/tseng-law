# Localized manuscript audit

`content-audit.mjs` checks explicitly selected professional-column manuscripts against an accepted source with the same full public slug. It reads files, writes an optional JSON report, and never edits articles, audience metadata, registries or deployment settings. Unselected legacy articles supply link/duplicate context only; their content is not gated or changed.

Run from the repository root with Node 24 and the repository's installed dependencies. The Homebrew Node on the current machine is broken; use the executable below.

```sh
CONTENT_AUDIT_NODE=/Users/son7/.nvm/versions/node/v24.14.1/bin/node

# Exactly the initial 18 ARC additions. Missing files remain errors.
"$CONTENT_AUDIT_NODE" docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs \
  --batch arc-first-6 \
  --json /tmp/arc-first-6-content-audit.json

# One complete language within that batch; checks the release date too.
"$CONTENT_AUDIT_NODE" docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs \
  --batch arc-first-6 --locales ru \
  --json /tmp/arc-ru-content-audit.json

# Any selected additions. Quote globs so the tool can reject a zero-match selection.
"$CONTENT_AUDIT_NODE" docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs \
  --files 'src/content/columns-nl/70[456]-*.md' \
  --source-locale en --publication-date 2026-10-25 \
  --json /tmp/arc-nl-content-audit.json

"$CONTENT_AUDIT_NODE" --test \
  docs/audit/all-locales-parity-20261025/tooling/content-audit.test.mjs
```

`--batch arc-first-6` selects the three exact 704–706 ARC filenames in `ru,ms,fil,tr,nl,zh-hans` and requires `published` and `lastmod` to be `2026-10-25`. `--locales` accepts a comma-separated subset of those six. `--files` accepts multiple literal paths or globs and has no implicit release date. There is no implicit all-files run. `--repo` changes the repository to inspect; the tool still resolves parser dependencies from its own installation.

Sources default to `en`. `--source-locale ko` or `zh-hant` changes that default. `--source-map path.json` selects a source for individual targets, keyed by repository-relative target path or `locale:full-slug`:

```json
{
  "nl:taiwan-arc-first-application": "src/content/columns/704-taiwan-arc-first-application.md"
}
```

Select only an accepted current source. A matching path, slug or SHA-256 does not prove editorial/legal approval. Consult the batch BRIEF, source-refresh evidence and final source review. The audit records source/target hashes so a later reviewer can identify the exact text checked.

## Automatic errors

The script parses YAML with `gray-matter` and Markdown with `remark-parse`/`remark-gfm`. It reads locale mappings and taxonomy from the repository, and executes only the existing pure audience, market-board and attribution helpers plus the extracted slug/category functions. It does not load CMS stores, environment files or network clients.

| Check | Automatic failure |
| --- | --- |
| Selection and identity | Missing/unsupported file, duplicate locale + full runtime slug, invalid slug, filename number leaking into the public URL, missing/ambiguous/mismatched source |
| Frontmatter | Invalid YAML; missing required text fields; invalid quoted dates; wrong selected release date; invalid categories, topic or internal author |
| Listing | Missing explicit local `audience` array or exclusion by the actual `filterMarketBoardColumns` result |
| Body | Under 500 visible letters/numbers or under 350 after exact duplicate paragraphs are removed; recognizable unfinished placeholders; body H1; body exactly copied from its source |
| Public text | Decorative `**`, `__`, `<strong>` or `<b>` outside code/quotation; an author line recognized by the actual public-attribution helper |
| Preservation | Changed topic, resolved public category, source media/diagram identity; missing/invalid FAQ or fewer FAQ entries; any removed/changed cited external URL |
| Local references | Missing local image; nonexistent language/column/issue/core route; ambiguous target full slug; nonexistent numeric `#sec-N` column anchor |

Body size is a low floor for empty/stub detection, not an adequacy or translation-quality score. URL destinations, code and images do not inflate it. The script never requires source/target sentence, paragraph, heading or H1 counts to match. FAQ count detects an obvious missing entry, but equal counts do not establish meaning preservation. Category labels may be localized; their actual runtime category identifier must remain the same.

The URL check preserves all cited external links, including sources that occur in FAQ fields. It performs no network requests and cannot establish that an official page remains current. Known source-language internal links are allowed only when the destination exists; their language labeling remains a required review item. Dynamic data routes and custom anchors require rendered-page verification instead of being declared valid from a route pattern alone.

## Required meaning and publication review

Every parsed article keeps unresolved review records. The JSON includes source and target title/summary/FAQ/caption/category data, body passages with line numbers, complete body Markdown, numeric evidence and source URLs. Reviewers must address:

1. Every legal actor, must/may distinction, AND/OR condition, eligibility requirement, exception, date basis, deadline, amount, currency and quotation. Condition-keyword highlights are incomplete hints; compare the complete text.
2. Title, summary and each FAQ's actual scope, including a condition dropped while all numbers and source links survive.
3. Numeric token differences with their surrounding passages. Raw spelling, digit scripts, grouping/decimal separators, dates, ranges and occurrence counts are preserved. `1.000` and `1,000` are not silently equated. Spelled-out numbers in 49 languages are not fully parsed; absence from the token arrays is not zero. Even an empty diff remains unresolved because equal numbers can attach to different actors or deadlines. Editorial dates/read-time metadata are shown separately from legal numbers.
4. Taiwan jurisdiction and nationality/status qualifications. Locale is never treated as nationality. Country/nationality keyword highlights are incomplete. Do not infer legal coverage from the absence of a highlighted sentence.
5. Natural public prose and actual rendered output: opening/headings/ending compared with the previous three same-language articles; public author leakage in the detail/card/metadata/JSON-LD/feed/caption/alt; a quoted bold marker's literal purpose; explicit labels on cross-language links. The existing attribution helper recognizes known lines, not every possible author sentence in 49 languages.

Record actual source phrase → target phrase → issue → edit → preserved meaning, with the checked file hashes and review evidence path. Re-run after edits. No flag in this tool approves or clears semantic review; the coordinating reviewer records that decision separately. Run the required sentence-variety/self-check workflow separately and report unsupported locales honestly.

This is a manuscript gate. It does not certify CMS overrides for core locales, rendered language, canonical/hreflang, sitemap inclusion, static export/package headroom, HTTP delivery, or the deployed commit. Those remain integration/publication checks. Inventory counts in the report are raw file counts, not completed parity counts.

## Exit status

| Exit | Meaning |
| --- | --- |
| `1` | At least one automatic error |
| `2` | Invalid invocation or runtime failure |
| `3` | Automatic checks passed; meaning review is still required |
| `0` | `--help`, or automatic checks passed with the explicit `--errors-only` option |

`--errors-only` changes only exit `3` to `0` for a narrow automated pipeline step. The JSON always retains `semanticStatus: "REVIEW_REQUIRED"` and `publicationReady: false`. A zero process status must not be recorded as publication approval.

The regression tests use temporary copies of the accepted ARC source, then remove a real work-permission condition or official citation, delete a FAQ, alter a legal number/category, introduce a nonexistent link/duplicate slug, or break YAML/audience. They do not modify the real manuscripts.
