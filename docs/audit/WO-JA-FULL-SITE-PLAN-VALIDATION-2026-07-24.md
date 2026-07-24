# WO-JA-FULL-SITE — Phase 1 Progress Validation

> Date: 2026-07-24 KST  
> Repository: `/Users/son7/Projects/tseng-law`  
> Validated plan: `docs/audit/WO-JA-FULL-SITE-PLAN-2026-07-24.md`  
> Scope: read-only implementation review plus this validation note  
> Prohibited and not performed: commit, push, deploy, CMS/Blob write, production mutation

## Verdict

**Plan status: APPROVED — no plan revision is required.**

**Implementation status: PARTIAL PHASE 1 — Phase 1 exit is not approved yet.**

The implemented direction matches the plan's central architecture: public `SiteLocale` is
kept separate from builder `Locale`, Japanese catch-all rendering avoids builder projection,
the homepage has a substantial Japanese `SiteContent`, and the existing 17 Japanese columns
remain file-backed. The remaining failures are implementation gaps already anticipated by the
plan, not evidence that the plan is wrong.

The three controlling facts remain consistent with the plan:

1. The requested product is a Japanese homepage **and the whole public site**, with a
   dedicated Japanese translation-agent workflow. The plan still covers both Phase 1 core
   pages and Phase 2 detail/landing/search pages; completing only the homepage or columns
   would not satisfy the request.
2. `docs/audit/WO-JA-AIR-SEARCH-EVIDENCE-2026-07-24.md:8-38` records that the Air had no
   reusable JA corpus: no `columns-ja`, no JA locale, and no Japanese law-column candidates.
   The plan is therefore correct to treat non-column full-site JA as net-new translation,
   not an import/review exercise.
3. The 17 Japanese columns were completed before this Phase 1 start. The focused test still
   proves 17 file-backed JA posts, full bodies, kana, no Hangul, and FAQ parity where expected
   (`src/lib/__tests__/columns-ja-content.test.ts:18-60`). The plan is correct to preserve this
   corpus as completed input instead of reopening it.

`docs/audit/JA-TRANSLATION-AGENT-PLAYBOOK.md` is a useful dedicated-agent operating contract:
it identifies KO as source, defines non-overlapping shards, assigns one integrator, and
specifies fidelity gates. Its existence satisfies the workflow setup portion of the request,
but it is not evidence that the remaining page shards received independent Japanese-language
or Taiwan-law review.

## Validated progress

| Plan area | Current validation | Evidence |
| --- | --- | --- |
| Public locale boundary | Materially implemented | `src/lib/locales.ts:1-29` keeps `Locale` at three values and adds `SiteLocale`; `src/app/[locale]/[[...slug]]/page.tsx:38-43` validates a public locale. |
| JA no-builder catch-all | Implemented for the catch-all branch | `src/app/[locale]/[[...slug]]/page.tsx:53-61` and `:83-100` return before either builder metadata or builder page resolution for JA. |
| Public route policy | Created, but only partially integrated | `src/lib/public-route-policy.ts:3-60` defines Phase 1 static paths, unsupported prefixes, fallback, and switch behavior. Header and explicit public routes do not yet consistently consume it. |
| Full homepage data object | Substantial implementation | `buildJapaneseSiteContent(baseSiteContent.ko)` exists and `siteContent.ja` uses it at `src/data/site-content.ts:2406-3153`; this replaces the previous thin EN shell. |
| Homepage route and SEO | Materially implemented | `/ja` is classified as full; `renderLegacyPage('', 'ja')` reaches `HomeLegacyPage`; JA home SEO is present at `src/app/[locale]/(legacy)/home-legacy.tsx:42-58`. |
| Homepage columns | Implemented | `src/app/[locale]/(legacy)/home-legacy.tsx:101-119` maps `getAllColumnPosts(locale)`, so JA uses the completed file-backed corpus. |
| FAQ translation data | Implemented at the data level | `faqContent.ja` contains 13 items in KO order at `src/data/faq-content.ts:228-301`. The standalone `/ja/faq` route is not wired to it yet. |
| Header | Partial | Six JA primary links and JA accessibility labels exist, but the logo, utility links, member UI/API, mega panels, language switching, search, and mobile drawer remain incomplete. |
| Footer | Partial | JA brand, offices, legal labels, and social aria labels exist; the bottom locale switch omits JA and the visible follow label falls back to English. |
| Homepage components | Partial but substantial | Hero, insights, services, attorney, results, stats, FAQ data, and contact content accept/use `SiteLocale` in several components. Residual EN fallbacks and builder-locale coercions remain. |
| Dedicated translation-agent workflow | Documented, not completed | The playbook exists, but no shard manifests or independent JA/Taiwan-law approval records were found for the new full-site copy. |
| Phase 1 verification tests | Mostly missing | Of the plan's JA full-site tests, only the pre-existing columns test and an EN/KO home-column mapping test are present. |

## Can the homepage legitimately show a Japanese body now?

**Yes — at code level `/ja` can now render a materially Japanese homepage body.**

The evidence chain is structural:

1. `''` is a full JA path (`src/lib/public-route-policy.ts:4-18`).
2. The JA catch-all branch does not call `resolvePublishedSitePage()` and sends the empty slug
   to `renderLegacyPage` (`src/app/[locale]/[[...slug]]/page.tsx:83-100`).
3. Empty-slug dispatch passes the real `SiteLocale` to `HomeLegacyPage`
   (`src/app/[locale]/(legacy)/index.tsx:48-52`).
4. `HomeLegacyPage` passes `ja` to the principal home sections, selects `faqContent.ja`, and
   loads `getAllColumnPosts('ja')`
   (`src/app/[locale]/(legacy)/home-legacy.tsx:61-123`).
5. `siteContent.ja` is produced by the new exhaustive Japanese builder rather than by
   spreading the English site content (`src/data/site-content.ts:2406-3153`).

This is enough to answer “can it show Japanese body content?” with **yes**. It is **not** enough
to claim “the full homepage is accepted”:

- `OfficeMapTabs` is still called with `toBuilderLocale('ja')`, which is `en`
  (`home-legacy.tsx:92`; `locales.ts:27-29`), so its visible section is English.
- The home attorney data and Person JSON-LD are also derived through the EN builder locale
  (`home-legacy.tsx:124-143`).
- Hero “View Columns” and scroll aria text still fall through to English
  (`HeroSearch.tsx:93-101,145-149`).
- Service detail/related-column controls fall through to English
  (`ServicesBento.tsx:81-85`).
- The FAQ section heading falls through to English even though its 13 item bodies are JA
  (`FAQAccordion.tsx:29-31`).
- The contact CTA headline and description fall through to English
  (`HomeContactCta.tsx:14-21`).
- Layout-level WebSite/LegalService JSON-LD is explicitly projected to EN
  (`src/app/[locale]/layout.tsx:44-50`).
- No live HTTP/browser render was run in this validation, so direct status 200, extracted
  visible text, console health, glyph clipping, and mobile layout are still unproved.

Therefore the honest state is: **Japanese homepage body is real; full-Japanese homepage
acceptance is still open.**

## Phase 1 remaining gaps against the approved plan

### 1. Core Phase 1 routes still project JA to EN or KO

The catch-all guard is correct, but the legacy dispatcher maps JA through
`toBuilderLocale('ja') === 'en'` for about, services, contact, lawyers, pricing, reviews,
privacy, and disclaimer (`src/app/[locale]/(legacy)/index.tsx:15-18,25-42,52-69`). Those URLs
therefore do not yet have the intended JA bodies.

FAQ, videos, and accessibility have more specific App Router pages, so they bypass the
catch-all's safe JA branch. Those files still call `normalizeLocale(params.locale)`, which
maps `ja` to KO. The completed `faqContent.ja` is consequently not proof that `/ja/faq`
renders JA.

The route policy alone also does not protect every unsupported direct route. Existing
specific account/login/store/event routes can match before the catch-all and normalize JA to
a builder locale. Middleware and those boundaries still need the plan's fail-closed policy.

### 2. Phase 1 deep content owners are not translated/wired

The following plan-owned data remains three-locale or is consumed through a builder-locale
adapter:

- attorney profiles and team content;
- firm introduction;
- contact/messenger content;
- privacy, disclaimer, and accessibility bodies;
- pricing and reviews UI/data;
- video/media page data and metadata.

`pageCopy.ja` and `siteContent.ja` are useful shell and homepage inputs, but they do not replace
these deeper page owners.

### 3. Public chrome is not yet a complete JA surface

Header gaps:

- JA logo still links to `/ja/columns`, not `/ja` (`Header.tsx:491-498`);
- the JA language switch preserves only columns instead of using
  `jaLanguageSwitchTarget()` (`Header.tsx:277-290`);
- JA utility links and utility aria label fall through to EN (`Header.tsx:247-261,440-447`);
- `/api/members/me?locale=ja` is still called and JA login/account links are still rendered
  (`Header.tsx:292-294,387-418,452-471`);
- only a columns mega panel exists for JA;
- SearchOverlay and MobileNavDrawer are passed EN through `toBuilderLocale(locale)`
  (`Header.tsx:631-643`).

Footer gaps:

- the locale switch has KO/ZH/EN only (`Footer.tsx:159-169`);
- the visible follow label falls through to `Follow` (`Footer.tsx:171-173`).

### 4. Locale output, SEO, structured data, fonts, and sitemap remain open

- `src/app/[locale]/layout.tsx:49-50` sends JA JSON-LD through EN and `:56,64` uses
  `locale as never`, both explicit plan blockers.
- JA columns list/detail still use `toBuilderLocale(locale)` for breadcrumbs,
  CollectionPage/Article/FAQ structured data, templates, profiles, and some links.
- The sitemap's JA detail loop uses the KO `columns` variable
  (`src/app/sitemap.ts:134-188`) rather than obtaining matching JA posts directly. It also
  advertises four-locale alternates before reciprocal full-page completion.
- The font resolver recognizes `ja`, but intentionally reuses Noto KR
  (`src/app/fonts.ts:48-60`) instead of implementing the dedicated JP faces required by
  Phase 1.

### 5. Required regression and real-surface gates are not in place

Missing or not found from the approved Phase 1 suite:

- JA public route-policy tests;
- deep `siteContent` parity/leakage/link tests;
- JA public chrome tests;
- JA homepage localization tests;
- JA public metadata/JSON-LD tests;
- explicit FAQ/videos/accessibility JA route tests;
- strong sitemap assertions based on the JA corpus;
- desktop/mobile browser route matrix and `/ja` visible-text inspection.

The present `home-legacy-localization.test.tsx` checks EN and KO column mapping only; it does
not test JA homepage rendering or leakage.

## Requested verification results

Both requested focused gates passed in the current shared worktree:

```text
npm run typecheck
PASS — exit 0; tsc -p tsconfig.json --noEmit --incremental false

npx vitest run src/lib/__tests__/columns-ja-content.test.ts
PASS — 1 file, 5 tests, 29 ms test time, 216 ms total
```

These results prove type consistency and preserve the completed 17-column corpus. They do not
prove Phase 1 route behavior, Japanese visible-text purity, or browser rendering.

Repository-state caveat: `main` was three commits behind `origin/main`, and the shared
worktree contained a large set of unrelated modified/untracked files, including booking,
search, builder, and remediation work. No unrelated change was reverted or adopted. Because
the gates ran against that shared WIP rather than an isolated JA-only workspace, final
release evidence still needs the plan's isolated clean-build/browser pass.

## Next five integrator tasks

1. **Close every Phase 1 route boundary.** Make the legacy core-page dispatcher and bodies
   accept `SiteLocale`; give `/ja/faq`, `/ja/videos`, and `/ja/accessibility` explicit JA
   branches that bypass builder resolution; enforce the route policy at middleware/specific
   route boundaries so unsupported `/ja/*` cannot normalize to KO/EN.
2. **Integrate the remaining Japanese content shards.** Add reviewed JA attorney/team,
   firm, contact/messenger, pricing/reviews, legal, accessibility, and video data; have the
   dedicated JA translation agent return non-overlapping shards, followed by separate
   Japanese-language and Taiwan-law fidelity review records.
3. **Finish homepage and chrome localization.** Remove homepage EN fallbacks, add JA office
   data, make the Header logo `/ja`, consume `jaLanguageSwitchTarget`, hide member/API product
   chrome, pass JA to MobileNavDrawer, and either hide search until Phase 2 or provide the
   approved JA behavior; add JA Footer language/follow labels.
4. **Close SEO/R2/sitemap/font blockers.** Widen public SEO/JSON-LD helpers to `SiteLocale`,
   remove `as never` and public-output `toBuilderLocale`, fix JA column structured data and
   safe internal links, source sitemap entries from `getAllColumnPosts('ja')`, publish
   hreflang only for complete reciprocal bodies, and load intentional Japanese fonts.
5. **Add the missing gates and verify the real surface.** Implement the planned JA
   route/content/chrome/metadata/sitemap Vitest suite, then run typecheck, lint, isolated
   build, and desktop + 390 px browser smoke. Phase 1 can exit only after `/ja` is a direct
   HTTP 200 with Japanese Header/body/Footer, kana present, no site-owned Hangul or inherited
   EN homepage fingerprints, correct JSON-LD/canonical/hreflang, and no console/network
   errors.

## Final validation statement

Keep the original plan **APPROVED**. Do not rewrite it to treat the current partial homepage
work as a full-site completion, and do not reopen the already completed 17-column corpus
except for regression/R2 integration fixes. The next implementation pass should finish the
Phase 1 route/data/chrome boundaries above before any Phase 1 completion or deployment claim.
