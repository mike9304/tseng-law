# WO-EN-FULL-COLUMNS — Codex R2 Review

> Review date: 2026-07-24 KST  
> Plan: `docs/audit/WO-EN-FULL-COLUMNS-PLAN-2026-07-24.md`  
> Prior review: `docs/audit/WO-EN-FULL-COLUMNS-CODEX-REVIEW-2026-07-24.md`  
> Reviewed repository: `/Users/son7/Projects/tseng-law`  
> Reviewed branch / HEAD: `main` / `ad77d5fca9521ee06c471b0378763dea7ce73ae4`  
> Verdict: **REQUEST_CHANGES**

## Executive verdict

Two requested corrections are verified: article 016 now consistently identifies Koo Jun-yup, matching Korean `구준엽`, and FAQ HTML plus `FAQPage` JSON-LD are now enabled whenever FAQ data exists, including English.

The SEO boundary is still incomplete, however. The sitemap filters the supplied non-file draft fixture, but the detail metadata route still marks that same class of English Blob/builder draft indexable and advertises English as a completed alternate. The new sitemap expectation is also incorrect and the requested Vitest run remains red. Several independent R1 plan blockers were not changed and remain open.

## Blocking findings

### 1. P0 — Non-file English column metadata still fails open

`src/app/[locale]/columns/[slug]/page.tsx:60-65` falls back from the file loader to the Blob/builder-aware reader. After finding any such draft, lines 79-80 unconditionally pass:

```ts
noindex: false,
alternateLocales: ['ko', 'zh-hant', 'en'],
```

Consequently, an English non-file record such as `client-alert` remains `index: true, follow: true` at the detail-page metadata surface and receives KO/ZH/EN hreflang. The new `isFileBackedEnglishColumnPath()` function exists only inside `sitemap.ts`; it is not used by `generateMetadata()`.

The plan requires one shared file-backed EN predicate to fail closed in both metadata and sitemap behavior. For a non-file English detail, metadata must remain noindex and must not advertise EN as a completed translation. KO/ZH dynamic columns without an EN file must also omit the false EN alternate.

### 2. P1 — The requested sitemap Vitest still fails

The exact requested command was run:

```bash
npx vitest run \
  src/lib/__tests__/columns-en-content.test.ts \
  src/app/__tests__/sitemap.test.ts
```

Result:

- `columns-en-content.test.ts`: **PASS**, 4/4;
- `sitemap.test.ts`: **FAIL**, 1/2;
- aggregate: **5 passed, 1 failed** across 6 tests; process exit code 1.

`src/app/__tests__/sitemap.test.ts:103-110` expects `129 → 121` and eight removals. The actual result is `129 → 120` and nine removals, which matches the nine unique paths in `affectedPaths`. The updated expectation is therefore arithmetically wrong.

The test also still lacks the plan's positive assertions for:

- 17 EN detail URLs;
- identical 17-slug KO/ZH/EN sets;
- 51 localized detail entries with reciprocal KO/ZH-Hant/EN/x-default alternates;
- locale-specific `lastModified` values.

### 3. P1 — The sitemap predicate is not actually based on file-backed EN content

`src/app/sitemap.ts:59-67` names the function `isFileBackedEnglishColumnPath()`, but builds its known set from `getAllColumnPosts('ko')`, not `columns-en` filenames or an EN file-backed predicate exported by `src/lib/columns.ts`.

It also accepts short aliases as file-backed paths. The plan authorizes the 17 canonical EN detail slugs, not arbitrary builder sitemap entries whose path happens to resolve through an alias.

`src/app/sitemap.ts:136` additionally loads KO posts once and reuses that array for all three locales at lines 165-173. This does not implement the planned per-locale source generation and cannot prove that an EN file exists before emitting its URL.

The current complete 17/17 corpus makes the KO and EN real-slug sets coincide today, but the implementation itself is fail-open if EN parity is later broken. The predicate should be derived from the EN files and shared with detail metadata.

### 4. P1 — R1 loader fail-closed requirements remain unaddressed

`src/lib/columns.ts:61-69` still checks directory existence and silently falls back to the Korean directory. Lines 154-168 and 207-217 retain the archive ID map, English date/read-time fallback helpers, and `insightsArchive` overlay path.

The plan and R1 review require direct supported-locale directory selection and removal of this Korean/archive fallback machinery so a missing EN directory fails visibly instead of leaking Korean content.

### 5. P1 — R1 content-contract and coverage blockers remain open

The previously identified frontmatter issues are unchanged:

- nine `read_time` values do not match the required final-English-body calculation at 200 words/minute: `001`, `002`, `003`, `004`, `009`, `010`, `011`, `013`, and `016`;
- five category values remain outside the controlled vocabulary: `001`, `002`, `003`, `010`, and `011`;
- `categoryFromString()` still does not recognize the required exact `Case Analysis` value.

The required files are still absent:

- `src/app/[locale]/columns/[slug]/__tests__/metadata.test.ts`;
- `tests/builder-editor/en-columns-full-content.playwright.ts`.

The existing content-integrity test still uses a 35% raw body-length floor and omits the previously listed frontmatter, structure, internal-link, controlled-category, read-time, and shared file-backed-predicate assertions. These are plan acceptance gates, not optional nits.

## Verified fixes

### Article 016 name correction — PASS

- `Harlem Yu` has zero matches in `src/content/columns-en`.
- Article 016 uses `Koo Jun-yup` in the title, H1, heir allocation, residual-property analysis, testamentary parental-rights example, litigation succession, and closing litigation scenario.
- These occurrences align with Korean `구준엽` at the corresponding source passages.

This verifies the named-person correction. It does not replace the plan's designated legal/content-owner review of the full article.

### English FAQ rendering — PASS

`src/app/[locale]/columns/[slug]/page.tsx:122-125` now derives `showFaq` only from valid FAQ content:

```ts
const faqItems = post.faq ?? [];
const showFaq = faqItems.length > 0;
const faqJsonLd = showFaq ? buildFaqJsonLd(faqItems, locale) : null;
```

The existing render branches use the same value for the visible FAQ section and `FAQPage` JSON-LD, so translated English FAQs are no longer locale-blocked.

There is a non-blocking cleanup nit: the preceding comment at lines 118-121 still says English uses a Korean-frontmatter overlay and is skipped. It now contradicts the code and should be removed or rewritten.

### Sitemap draft filtering — PARTIAL PASS

The current sitemap logic does remove `/en/columns/client-alert` and removes its EN hreflang from KO/ZH entries. The test's observed nine removals confirms the supplied non-file fixture is filtered.

This is only a sitemap-surface pass. It does not satisfy the detail metadata boundary or the EN-file-derived predicate requirement described above.

## Additional checks

- `git diff --check` on the EN-column implementation/test paths: **PASS**.
- No `Harlem Yu` occurrence remains under `src/content/columns-en`.
- The shared worktree remains dirty with unrelated lanes; none were reverted, staged, or adopted by this review.
- No product source, translation, or test file was edited during this review.

## Required changes before R3

1. Export one canonical EN-file-backed slug predicate from `src/lib/columns.ts`, derive it from `columns-en`, and use it in both detail metadata and sitemap filtering.
2. Make non-file EN details noindex and remove false EN hreflang from nontranslated dynamic column metadata.
3. Correct the sitemap expected counts to the observed nine removals and add the planned positive 17/51-entry, reciprocal-alternate, and locale-date assertions.
4. Remove the supported-locale Korean/archive fallback machinery.
5. Correct the outstanding read-time/category contract violations and add the missing metadata/content assertions and Playwright coverage.
6. Rerun the targeted Vitest command until both files pass.

No commit, push, deploy, Blob write, CMS publish, or production mutation was performed.
