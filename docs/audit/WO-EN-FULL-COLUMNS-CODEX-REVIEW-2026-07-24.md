# WO-EN-FULL-COLUMNS — Codex Final Review

> Review date: 2026-07-24 KST  
> Plan: `docs/audit/WO-EN-FULL-COLUMNS-PLAN-2026-07-24.md`  
> Reviewed repository: `/Users/son7/Projects/tseng-law`  
> Reviewed branch / HEAD: `main` / `ad77d5fca9521ee06c471b0378763dea7ce73ae4`  
> Verdict: **REQUEST_CHANGES**

## Executive verdict

The corpus-level delivery is substantially present: all 17 English files exist with exact KO filename/slug parity, the loader returns 17 English posts, no Hangul occurs outside two preserved source URL fields, and the old three-section generated stub is absent.

The implementation is not approvable against the plan, however. One article names the wrong spouse and heir throughout a legal inheritance analysis; the SEO changes index unrelated/noncanonical English column records; English FAQ rendering remains disabled; the loader still has the prohibited Korean/archive fallback; the sitemap regression test fails; and several required content/test contracts are missing or violated.

## Blocking findings

### 1. P0 — Article 016 identifies the wrong spouse and legal heir

`src/content/columns-en/016-taiwan-inheritance-custody-analysis.md` translates Korean `구준엽` (Koo Jun-yup / DJ Koo) as **Harlem Yu**, a different person.

This error appears in the public title/H1 and throughout the inheritance analysis, including:

- line 2: article title;
- line 12: H1;
- line 60: named spouse and one-third heir;
- lines 66, 82–94: residual-property analysis;
- line 108: testamentary parental-rights example;
- lines 164 and 170: succession to pending litigation.

This is not a stylistic romanization issue. It changes the identity of a party, spouse, heir, and potential litigant in a legal article. Article 016 must be rejected and re-reviewed against the Korean source before indexability can be enabled.

### 2. P0 — Indexability is fail-open for unrelated English columns

The plan permits indexing only the 17 canonical file-backed English translations.

Instead, `src/app/[locale]/columns/[slug]/page.tsx:60-80` falls back to Blob/builder-aware records and then unconditionally sets:

```ts
noindex: false
alternateLocales: ['ko', 'zh-hant', 'en']
```

Therefore an unrelated English Blob/builder column without a canonical file translation is indexable and advertises a completed English alternate.

`src/app/sitemap.ts:59-68` also removes the column-detail rule from `isEnglishNoindexPath()`. This leaves unrelated builder entries such as `/en/columns/client-alert` in the sitemap. The existing sitemap regression test confirms the failure: only 8 of 9 English noindex fixtures are removed.

The planned file-backed predicate, such as `isFullEnglishColumnTranslationSlug(slug)`, does not exist. It must be implemented and applied in both metadata and sitemap behavior so the policy fails closed.

### 3. P1 — English FAQ HTML and FAQPage JSON-LD are still disabled

The five EN FAQ arrays load successfully, but `src/app/[locale]/columns/[slug]/page.tsx:118-124` still restricts rendering to Korean and Traditional Chinese:

```ts
const showFaq = faqItems.length > 0 && (locale === 'ko' || locale === 'zh-hant');
```

As a result, the five translated English FAQs are not rendered and do not produce `FAQPage` JSON-LD. The stale comment still describes English as a Korean-frontmatter overlay. The plan required a content-based rule (`faqItems.length > 0`) for all locales.

### 4. P1 — The loader does not implement the planned fail-closed English source boundary

`src/lib/columns.ts:61-68` uses `fs.existsSync()` and falls back to the Korean directory when the EN or ZH directory is missing. The plan explicitly requires a supported locale to map directly to its own directory and fail visibly rather than leak Korean content.

The old English overlay machinery also remains:

- `insightsArchive` import at line 5;
- `REAL_SLUG_TO_INSIGHT_ID` at lines 154–156;
- `toEnglishDateDisplay()` and `toEnglishReadTime()` at lines 158–168;
- the archive overlay/fallback branch at lines 198–218.

Only `buildEnglishColumnContent()` was removed. The plan required removal of the entire English archive overlay/fallback path.

### 5. P1 — Required tests are missing or materially weaker than the plan

Missing:

- `src/app/[locale]/columns/[slug]/__tests__/metadata.test.ts`;
- `tests/builder-editor/en-columns-full-content.playwright.ts`.

`src/app/__tests__/sitemap.test.ts` was not updated for the new 17 EN detail entries and currently fails.

The new `src/lib/__tests__/columns-en-content.test.ts` passes, but it omits major required assertions:

- no frontmatter parsing/parity for `url`, `lastmod`, and `featured_image`;
- no controlled-category vocabulary check;
- no `read_time` recalculation check;
- no required/extra frontmatter field check;
- no zero-Hangul check for summary/category/date/read-time;
- no assertion that the other 12 files lack FAQ;
- no FAQ order/content check;
- a 35% raw-content length floor instead of the planned 75% normalized floor;
- no structure-signature comparison or reviewed exceptions;
- no internal locale-link checks;
- no file-backed translation predicate test.

The passing test therefore does not establish the plan's content-integrity gate.

### 6. P1 — Nine `read_time` values do not match the required 200 words/minute calculation

The calculation below uses the loader-equivalent rendered body boundary (lead H1 and images removed), strips Markdown/URLs, counts English word tokens, and rounds up at 200 words/minute.

| File | Words | Required | Declared |
| --- | ---: | ---: | ---: |
| `001` | 1,213 | 7 min | 3 min |
| `002` | 614 | 4 min | 1 min |
| `003` | 2,613 | 14 min | 8 min |
| `004` | 774 | 4 min | 5 min |
| `009` | 478 | 3 min | 2 min |
| `010` | 1,053 | 6 min | 3 min |
| `011` | 765 | 4 min | 3 min |
| `013` | 783 | 4 min | 3 min |
| `016` | 1,314 | 7 min | 6 min |

The other eight files match the stated formula.

### 7. P2 — Five frontmatter categories violate the controlled vocabulary

The plan permits exactly:

- `Taiwan Company Formation`;
- `Taiwan Legal Information`;
- `Case Analysis`.

The following files use other values:

- `001`, `002`, `011`: `Company Setup`;
- `003`: `Legal Information`;
- `010`: `Case Study Analysis`.

There is also a latent parser issue: `categoryFromString()` does not recognize the required exact value `Case Analysis`. Correcting file 010 to the controlled vocabulary without correcting the parser would misclassify it as `legal`.

## Verified passing evidence

Independent static checks established:

- KO Markdown files: 17;
- EN Markdown files: 17;
- sorted basenames: exact match;
- loaded EN posts: 17;
- Hangul outside `url` fields: 0 hits;
- preserved source URLs containing Hangul: two (`008`, `009`);
- complete old stub fingerprint (`Overview` + `Key Focus Areas` + `Consultation`): 0 files;
- `Date pending`: 0 hits;
- `/ko/`, `/zh-hant/`, and `/ja/` internal targets in EN Markdown: 0 hits;
- required frontmatter fields present: 17/17;
- unexpected workflow/public frontmatter fields: 0;
- exact KO/EN equality for `url`, `lastmod`, and `featured_image`: 17/17;
- FAQ presence/count parity: `001`, `002`, `004`, `008`, and `011` each match KO at 3 items; the other 12 have no FAQ;
- normalized EN/KO character-ratio floor: all exceed 75%; minimum observed was 1.843 for `010`;
- no old `buildEnglishColumnContent` function remains;
- no Japanese locale or `/ja/` implementation was added;
- forbidden `src/data/insights-archive.ts` was not edited.

These checks show full-sized files and structural coverage, but they cannot establish legal fidelity. Finding 1 demonstrates why source-side legal/content review is still required.

## Test execution

Command:

```bash
npx vitest run \
  src/lib/__tests__/columns-en-content.test.ts \
  src/app/__tests__/sitemap.test.ts \
  src/lib/__tests__/columns-faq.test.ts \
  src/lib/builder/__tests__/columns-backend.test.ts
```

Result:

- `columns-en-content.test.ts`: **PASS**, 4/4;
- `columns-faq.test.ts`: **PASS**, 8/8;
- `columns-backend.test.ts`: **PASS**, 4/4;
- `sitemap.test.ts`: **FAIL**, 1/2;
- aggregate: **17 passed, 1 failed** across 18 tests.

The failing sitemap assertion expected 9 English-only noindex fixtures to be removed but observed 8. Counts changed from the expected `112 → 103` to `129 → 121`; `/en/columns/client-alert` is the unfiltered route class.

No metadata test was available to run. No EN-columns Playwright file was available to run. A build or browser completion claim is therefore not supported by this review.

## Whitelist discipline

The identifiable EN implementation files are inside the plan whitelist:

- 17 files under `src/content/columns-en/`;
- `src/lib/columns.ts`;
- `src/app/[locale]/columns/[slug]/page.tsx`;
- `src/app/sitemap.ts`;
- `src/lib/__tests__/columns-en-content.test.ts`.

The plan document is also present. This review document is separately authorized by the final-review request.

The shared worktree contains many unrelated modified/untracked paths from other lanes. They were not edited, reverted, staged, or adopted during this review and are not attributed to this implementation. Within the EN lane, the issue is missing required whitelist deliverables rather than an attributable edit to a forbidden nearby file: the metadata and Playwright tests are absent, and the existing sitemap test was not updated.

## Required changes before re-review

1. Correct and independently source-review every `Harlem Yu` reference in article 016 so the actual Korean-source spouse/heir is identified consistently.
2. Add a canonical file-backed EN slug predicate and make metadata/sitemap indexability fail closed for all other English columns, including builder/Blob records.
3. Render FAQ HTML and FAQPage JSON-LD whenever valid FAQ content exists, including the five EN articles.
4. Map supported locales directly to their content directories and remove all remaining English archive/Korean fallback machinery.
5. Recalculate the nine incorrect read times and normalize the five category values; make `categoryFromString()` recognize the exact controlled values.
6. Implement the planned metadata/sitemap/content assertions and the EN Playwright coverage; rerun the targeted suite until fully green.
7. Obtain designated legal/content-owner review of article 016 and the remaining legal translations before any deploy request.

No translation, product code, test, or sitemap implementation was rewritten during this review. No commit, push, deploy, Blob write, or CMS publish was performed.
