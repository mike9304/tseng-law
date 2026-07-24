# WO-JA-FULL-SITE — Full Japanese Public-Site Localization Plan

> Date: 2026-07-24 KST
> Repository: `/Users/son7/Projects/tseng-law`
> Predecessor: `docs/audit/WO-JA-FULL-COLUMNS-PLAN-2026-07-24.md`
> Continuity reviews: `docs/audit/WO-JA-FULL-COLUMNS-CODEX-REVIEW-2026-07-24.md` and `docs/audit/WO-JA-FULL-COLUMNS-CODEX-REVIEW-2026-07-24-R2.md`
> Status: **VALIDATED IMPLEMENTATION PLAN ONLY**
> This work order authorizes this plan file only. It does **not** authorize product-code edits, commit, push, deploy, Blob/CMS publication, or production mutation.

## 1. Ten-line executive summary

1. Japanese columns are substantially complete: 17 file-backed articles and the `SiteLocale` value `ja` exist, but that is not a Japanese full-site implementation.
2. `/ja` and most non-column `/ja/*` routes currently collapse through `normalizeLocale()` to KO and can render Korean builder or legacy bodies under Japanese URLs.
3. Public routes must use `normalizeSiteLocale()` and an explicit Japanese route policy; no builder-only resolver may receive `ja` or project a KO page onto `/ja`.
4. Replace the thin `buildJapaneseShellContent(englishSiteContent)` with an exhaustive `buildJapaneseSiteContent(baseSiteContent.ko)` covering the homepage and all public chrome.
5. Add complete JA data to page copy, FAQ, attorney/team profiles, firm introduction, services, contact, pricing/reviews UI, legal pages, videos, and approved landings.
6. Header, Footer, MobileNavDrawer, search, home sections, accessibility labels, metadata, and JSON-LD must receive the real `SiteLocale`, never an EN/KO coercion.
7. Phase 1 delivers `/ja`, chrome, core navigation pages, legal pages, videos, and existing columns; Phase 2 delivers service/lawyer details, search, and all five public landings/guides.
8. `/ja/insights/*` maps to canonical `/ja/columns/*`; unsupported product routes never render KO and their Japanese switch target safely falls back to `/ja/columns`.
9. Translation agents work in non-overlapping scratch shards, with one code integrator and independent Japanese-language and Taiwan-law review gates.
10. Final acceptance requires `/ja` HTTP 200 with a genuinely Japanese homepage and visible Hangul count zero, plus major-route browser smoke, typecheck, Vitest, lint, and isolated build.

## 2. Validated current state and honest gap analysis

### 2.1 What is already done

- `src/content/columns-ja/` contains 17 complete file-backed Japanese articles with canonical filename/slug parity.
- `src/lib/locales.ts` now separates:
  - builder/admin `Locale = ko | zh-hant | en`;
  - public `SiteLocale = Locale | ja`.
- `/ja/columns` and `/ja/columns/<slug>` have explicit file-backed JA branches.
- The root document-language resolver recognizes `/ja` and emits `<html lang="ja">`.
- `src/data/page-copy.ts` has short JA page headings/descriptions.
- Header has a Japanese language option and a minimal columns-oriented JA branch.
- The columns corpus passed the static completeness checks recorded in the prior reviews.

These are useful foundations, not proof of full-site Japanese coverage.

### 2.2 What is missing or unsafe

| Area | Current evidence | Consequence |
| --- | --- | --- |
| Main catch-all | `src/app/[locale]/[[...slug]]/page.tsx` calls `normalizeLocale()` in metadata and render paths | `/ja`, `/ja/about`, `/ja/services`, and other catch-all routes become KO internally |
| Builder projection | Catch-all resolves a published builder page before legacy content | A KO builder page can be projected onto a Japanese URL |
| Homepage data | `buildJapaneseShellContent()` spreads `englishSiteContent` and replaces only `meta` | The Japanese homepage body is English if the route reaches the JA data at all |
| Locale layout | `src/app/[locale]/layout.tsx` maps JA to EN for JSON-LD, Footer, and widgets and contains `locale as never` | Japanese pages emit or display English public chrome/structured data |
| Core data | `faq-content`, `attorney-profiles`, `firm-introduction`, `team-members`, `legal-pages`, `service-details`, `intent-pages`, and contact data remain three-locale | Full Japanese bodies cannot be rendered safely |
| Home/core components | Most accept builder `Locale` and use KO/ZH/EN ternaries or `Record<Locale, ...>` | JA either fails type boundaries or falls into English labels |
| Direct public pages | FAQ, videos, accessibility, search, services detail, lawyer detail, guides, and landings call `normalizeLocale()` | Explicit `/ja/*` routes can silently serve KO data |
| Header/member links | Header still constructs `/ja/login`, `/ja/account`, `/ja/account/premium` and calls the member API with `locale=ja` | Unsupported application routes are advertised as Japanese |
| Footer/mobile | Footer and MobileNavDrawer accept only `Locale`; layout passes EN for JA | Japanese desktop/mobile chrome is incomplete |
| Search | `src/lib/search.ts` requires `insightsArchive[locale]`; server search uses builder locale data | A real JA search surface does not exist |
| Fonts | `ja` currently reuses Noto KR faces | Document language is fixed, but Japanese typography is not intentionally loaded |
| SEO | R2 found JA metadata fixed only partially; layout/list/detail structured data still received EN through `toBuilderLocale()` | Canonical language and JSON-LD can contradict each other |
| Sitemap | Current JA entries cover columns only and are sourced from the KO post loop; tests check aggregate count rather than the JA contract | Full-site JA pages are neither represented nor strongly protected |

### 2.3 Carry-forward blockers from the CODEX reviews

The full-site implementation must close, not obscure, the R2 blockers:

1. Public JSON-LD helpers and callers must receive `ja`, not `toBuilderLocale('ja')`.
2. `/ja` must be a real HTTP-200 Japanese homepage.
3. JA member/account controls and member API calls must be absent while that product is out of scope.
4. `AttorneyAuthorityCard` and its callers must use Japanese UI labels while mapping only truly builder-owned profile access where necessary.
5. JA sitemap entries must come from the matching JA corpus/data and tests must assert URLs, alternates, and language directly.
6. Remove `as never` and similar type suppression at public locale boundaries.

## 3. Target architecture

### 3.1 Keep `SiteLocale` and `Locale` separate

- `Locale` remains exactly `ko | zh-hant | en` for builder/admin schemas, persistence, editor chrome, translation dashboards, booking management, and APIs that are not localized in this work.
- `SiteLocale` remains `ko | zh-hant | en | ja` for public layout, public data, public components, public route metadata, public SEO/JSON-LD, sitemap, and file-backed content.
- `normalizeSiteLocale()` is the only normalizer used by approved public routes.
- `toBuilderLocale()` may be used only at a narrow, documented builder-only call site after the JA path has already branched away. It must not drive:
  - public body selection;
  - public canonical URL or hreflang;
  - public JSON-LD language/name/URL;
  - Header, Footer, MobileNavDrawer, home components, page components, or JA search;
  - Japanese file-backed content selection.

### 3.2 Add one public Japanese route policy

Create `src/lib/public-route-policy.ts` as a pure, edge-safe source of truth for:

- completed JA static paths;
- supported dynamic path predicates;
- canonical `/insights` → `/columns` alias mapping;
- locale-switch behavior;
- known unsupported product prefixes;
- the safe Japanese fallback `/ja/columns`.

`src/lib/path-utils.ts`, Header, Footer, MobileNavDrawer, middleware, and sitemap must consume this policy instead of maintaining separate path guesses.

The policy distinguishes three outcomes:

1. `full`: preserve the path and render the approved JA body;
2. `canonical-redirect`: redirect an old public alias to its approved JA canonical path;
3. `unsupported`: language switching goes to `/ja/columns`, and a direct `/ja/<unsupported>` request is blocked or redirected by the explicit policy, never normalized to KO.

Unknown typo paths still return 404. Do not blanket-redirect every unknown path to columns.

### 3.3 Catch-all behavior

In `src/app/[locale]/[[...slug]]/page.tsx`:

1. Validate the route segment with `isSiteLocale()` and then normalize with `normalizeSiteLocale()`.
2. If `locale === 'ja'`:
   - never call `buildPublishedSitePageMetadata()` or `resolvePublishedSitePage()`;
   - dispatch only approved legacy static slugs to Japanese metadata/body renderers;
   - return `notFound()` for unknown paths;
   - do not run member-access or builder lifecycle logic.
3. If the locale narrows to the three-value builder `Locale`, preserve the current builder-first behavior.
4. Metadata follows the same branch order. A JA metadata request never asks builder persistence for a KO/EN projection.
5. `buildPublishedPath()` and member redirects remain builder-locale-only.

This makes the no-KO-projection guarantee structural rather than dependent on current published data.

### 3.4 Locale layout behavior

In `src/app/[locale]/layout.tsx`:

- validate/normalize with `SiteLocale`;
- pass the real locale to Header, Footer, public JSON-LD, ScrollTopButton, and all public chrome;
- remove `locale as never`;
- remove layout-wide `widgetLocale = toBuilderLocale(locale)`;
- emit Japanese `WebSite` and `LegalService` JSON-LD for JA;
- hide `QuickContactWidget`, member/account UI, and `YearEndEventPopup` on JA unless they receive complete JA work in a separately approved plan;
- do not expose booking, account, or builder links from JA;
- set locale-level metadata fields such as application name, publisher, and Open Graph locale to Japanese values.

## 4. Full Japanese content contract

### 4.1 `buildJapaneseSiteContent`

Replace the current thin shell with:

```ts
function buildJapaneseSiteContent(base: SiteContent): SiteContent
```

and construct JA from `baseSiteContent.ko`, not from `englishSiteContent`.

The implementation must mirror the exhaustive structure of `buildEnglishSiteContent()` and explicitly provide Japanese for every user-visible text leaf in:

- `meta`;
- primary nav, service mega menu, insight mega menu, CTA, search/language labels;
- hero label/title/subtitle, typing phrases, search controls, keywords, quick links, secondary links;
- hero highlights;
- achievements and result summaries;
- stats labels/title/description/item labels;
- major news and firm updates;
- featured content;
- all six service cards, descriptions, details, and related-column titles;
- attorney and case-result homepage blocks;
- updates, case guides, newsletters, and video labels/items;
- warning/notice copy if rendered;
- public quick-contact text only if the widget is later approved for JA;
- contact inquiries, locations, CTA, and homepage contact CTA;
- Footer note, column headings, links, and legal line;
- search title, placeholder, tabs, and suggestions.

Rules:

- Preserve asset URLs, external destinations, numeric facts, dates, awards, case amounts, office details, and source meaning.
- Every internal JA href must exist in the approved route inventory at that phase.
- No internal `/ko/...` or `/en/...` destination may be hidden behind a Japanese label.
- English brand/product names may remain only where they are official names; surrounding prose must be Japanese.
- Add a recursive key-parity test so JA cannot inherit missing deep fields unnoticed.

### 4.2 Other public content owners

Complete Japanese data in:

- `page-copy.ts`: all page headers and search copy;
- `faq-content.ts`: all public FAQ questions/answers with item-count and order parity;
- `attorney-profiles.ts`: complete profile fields, lists, proof points, FAQs, link labels, and Japanese path labels;
- `firm-introduction.ts`: subtitle, all paragraphs, logo alt, and source label;
- `team-members.ts`: story, names/roles, bios, education, and experience;
- `contact-page-content.ts`: messenger/direct-contact labels;
- `legal-pages.ts`: privacy, disclaimer, and accessibility in full;
- `service-details.ts`: six services, all titles/subtitles/intros/key points;
- `intent-pages.ts`: three intent landing records in full;
- `guides/taiwan-company-setup/content.ts`: full guide, tables, steps, FAQs, resources, and CTA;
- `korean-lawyer-in-taiwan/content.ts`: full landing body, FAQ, office information, and CTA.

`page-copy.ts` already has JA stubs. They are starting material only; they do not satisfy the deeper page-body contract.

### 4.3 `insights-archive.ts` decision

Do **not** add a fourth archive translation to `src/data/insights-archive.ts`.

Reason:

- the canonical public article source is now `src/content/columns-ja`;
- the homepage already maps file-backed columns into `InsightsArchiveSection`;
- translating a second archive would duplicate titles/summaries and create drift.

Instead:

- `/ja/insights` permanently redirects to `/ja/columns`;
- `/ja/insights/<known-slug-or-alias>` permanently redirects to the matching `/ja/columns/<canonical-slug>`;
- JA search indexes `getAllColumnPosts('ja')` directly;
- a regression test proves no JA public consumer requires `insightsArchive.ja`.

If implementation discovers a real non-column consumer that cannot be redirected, stop and revise this plan before editing `insights-archive.ts`.

### 4.4 Japanese translation and factual-fidelity rules

- KO is the content source of truth. ZH-Hant is a Taiwan official-term cross-check. EN is a readability reference only.
- Translate complete structures; do not summarize, omit, combine sections, or add marketing claims.
- Preserve every number, currency amount, percentage, deadline, law/article reference, office address, email, phone, URL, case result, qualification, and uncertainty marker.
- Use `台湾`, `新台湾ドル（TWD）`, and verified Japanese descriptions for Taiwan institutions. Keep the Traditional Chinese official term in parentheses when ambiguity matters.
- Do not substitute Japanese domestic entity or legal concepts for Taiwan concepts.
- Do not invent Japanese readings for personal names. Use an attributable Japanese/Latin/Traditional Chinese form.
- Site-owned JA text must contain no visible Hangul. Immutable URL/href substrings and explicitly identified original-language user submissions are the only exceptions.
- Each substantive JA page/section must contain kana, not only kanji or copied Traditional Chinese.
- Japanese legal-language review and Taiwan-law fidelity review are separate approvals.

## 5. Public component requirements

### 5.1 Header

- Replace the columns-only Japanese nav with the completed JA route inventory.
- Japanese logo links to `/ja`, not `/ja/columns`.
- Add the six main items used by other locales: services, lawyers, pricing, columns, media, directions.
- Add full Japanese service/media/about mega panels.
- Preserve supported current paths in the JA switcher; unsupported paths target `/ja/columns`.
- Hide login/account/premium/logout UI and skip `/api/members/me?locale=ja`.
- Pass `ja` directly to SearchOverlay and MobileNavDrawer.
- Japanese labels must cover skip link, home, menu open/close, search, utility nav, language nav, main nav, and mega-menu accessibility.

### 5.2 Footer

- Change the prop from builder `Locale` to public `SiteLocale`.
- Add Japanese brand, office heading/cities, legal links, follow/social labels, language control, note, columns, and legal line.
- Add a `日本語`/`JA` language entry with correct `aria-current`.
- All Japanese office/legal links stay under approved `/ja` paths.
- Do not show booking/account/admin links.

### 5.3 MobileNavDrawer

- Change the prop to `SiteLocale`.
- Add Japanese close/dialog/nav/brand/search/language labels.
- Show the same completed JA primary nav as desktop.
- Add the JA language chip and route-aware target behavior.
- For JA, render no member/account controls and do not synthesize a login URL.
- Drawer logo links to `/ja`.

### 5.4 Homepage and shared page components

All public components rendered on JA pages must accept `SiteLocale` and have explicit JA labels/data. In particular:

- `HeroSearch`: button, column link, scroll label, keywords, and suggestions;
- `ServicesBento`: six service cards, related-column label, detail link;
- `HomeAttorneySplit`, `HomeCaseResultsSplit`, `HomeStatsSection`, `HomeContactCta`;
- `InsightsArchiveSection`: Japanese author/review labels and `/ja/columns` links;
- `FAQAccordion`: Japanese heading/ARIA copy;
- `OfficeMapTabs`: office/city/address/map/rating/photo-alt/phone/fax labels;
- `ContactBlocks`, `ConsultationGuideSection`, `MessengerChatSection`;
- `AttorneyProfileSection`, `FirmIntroductionSection`, `AttorneyAuthorityCard`;
- `PricingCards`, `ReviewBoard`, `AttorneyMediaHubView`, `VideoChannel`;
- `LegalPageSections`, `SearchOverlay`, and `ScrollTopButton`.

Do not treat the default English branch of a ternary as Japanese support.

For reviews, site chrome and form copy must be Japanese. Unreviewed KO/ZH/EN user-submitted review bodies must not be presented as Japanese translations. Either show only approved Japanese reviews or a Japanese empty state; never machine-translate testimonials silently.

## 6. Route inventory and release behavior

### 6.1 Phase 1 — full JA body

| Path | Body source / rule |
| --- | --- |
| `/ja` | Real Japanese legacy homepage using `siteContent.ja`, JA FAQ, JA attorney profile, and file-backed JA columns; direct HTTP 200 |
| `/ja/about` | JA page copy + firm introduction + team/profile + contact blocks |
| `/ja/services` | JA page copy + six translated service cards |
| `/ja/lawyers` | JA team/profile listing and JA Person/Collection JSON-LD |
| `/ja/pricing` | Full Japanese fee-page copy and cards |
| `/ja/columns` | Existing 17-post file-backed listing; preserve and regression-test |
| `/ja/columns/<17 canonical slugs>` | Existing file-backed article details; close R2 structured-data/link blockers |
| `/ja/videos` | JA page/media copy; bypass builder projection |
| `/ja/faq` | JA file-backed FAQ; bypass builder FAQ/page projection |
| `/ja/contact` | JA consultation/contact/messenger/office body |
| `/ja/reviews` | JA UI; approved JA reviews only or Japanese empty state |
| `/ja/privacy` | Full Japanese legal body |
| `/ja/disclaimer` | Full Japanese legal body |
| `/ja/accessibility` | Full Japanese legal body |

### 6.2 Phase 2 — full JA body

| Path | Body source / rule |
| --- | --- |
| `/ja/services/investment` | File-backed JA service detail; no builder locale projection |
| `/ja/services/civil` | Same |
| `/ja/services/family` | Same |
| `/ja/services/labor` | Same |
| `/ja/services/criminal` | Same |
| `/ja/services/ip` | Same |
| `/ja/lawyers/wei-tseng` | File-backed JA attorney detail; no builder dynamic-template lookup |
| `/ja/taiwan-lawyer` | Full JA intent landing |
| `/ja/taiwan-company-setup-lawyer` | Full JA intent landing |
| `/ja/taiwan-litigation-lawyer` | Full JA intent landing |
| `/ja/guides/taiwan-company-setup` | Full JA guide, tables, FAQ, HowTo, and resources |
| `/ja/korean-lawyer-in-taiwan` | Full JA body; slug remains stable, text is Japanese |
| `/ja/search` | JA UI and a JA index built from approved static pages, services, FAQ, videos, and `columns-ja`; `noindex` remains acceptable |

### 6.3 Canonical redirects

| Incoming path | Result |
| --- | --- |
| `/ja/insights` | Permanent redirect to `/ja/columns` |
| `/ja/insights/<known canonical slug>` | Permanent redirect to `/ja/columns/<canonical slug>` |
| `/ja/insights/<known alias>` | Permanent redirect to resolved `/ja/columns/<canonical slug>` |

### 6.4 Unsupported/safe-fallback paths

The following are not Japanese public-site deliverables in this plan:

- `/ja/events` and `/ja/events/*`;
- `/ja/portfolio` and `/ja/portfolio/*`;
- `/ja/store` and `/ja/store/*`;
- `/ja/p/*` arbitrary builder dynamic pages;
- `/ja/login`, `/ja/account`, `/ja/account/*`;
- `/ja/bookings/manage/*`;
- `/ja/admin-consultation`, `/ja/admin-builder`, and descendants;
- builder fixtures and internal preview routes.

Behavior:

- the JA option shown while visiting an equivalent unsupported KO/ZH/EN path targets `/ja/columns`;
- JA chrome never links to those paths;
- known unsupported direct `/ja/*` requests are blocked or safely redirected to `/ja/columns` by the route policy/middleware;
- admin guards remain fail-closed; do not add `ja` to the builder/admin locale contract;
- unknown paths return 404;
- no unsupported path receives JA canonical/hreflang or sitemap entries.

## 7. Reusable Japanese translation-agent playbook

### 7.1 Operating model

Translation agents do not edit the shared repository. They receive frozen source files and write structured outputs under:

```text
/tmp/tseng-law-ja-full-site-2026-07-24/
  a-home-chrome/
  b-core-pages/
  c-firm-team/
  d-services-contact/
  e-landings-guide/
  f-independent-qa/
```

One integrator owns all TypeScript/TSX edits. No translation worker stages, commits, pushes, deploys, or edits a shared file.

Before fan-out, the coordinator records:

- source HEAD;
- source-file SHA-256 values or Git blob IDs;
- the exact field/key inventory per shard;
- the approved terminology sheet;
- the route manifest and internal-link allowlist;
- facts/numbers/URLs that must remain unchanged.

### 7.2 File shards

| Agent | Read-only sources | Output responsibility |
| --- | --- | --- |
| A — homepage/chrome | KO `site-content`, Header/Footer/MobileNav, home component labels | Complete JA `SiteContent` leaf map, nav/link map, home UI label map |
| B — core pages | `page-copy`, `faq-content`, `legal-pages`, pricing/review labels | JA page headers, FAQ, legal pages, pricing/review UI |
| C — firm/team | `firm-introduction`, `team-members`, `attorney-profiles` | Names, bios, education/experience, profile FAQ, authority labels |
| D — services/contact/media | `service-details`, contact data/components, videos | Six service records, consultation/contact/office/messenger/media copy |
| E — landings/guide/search | `intent-pages`, company-setup guide, Korean-lawyer landing, search labels | Five complete landing/guide bodies and JA search taxonomy |
| F — independent QA | All source/output manifests, KO primary and ZH terminology reference | Structural diff, number/URL audit, language leakage audit, terminology conflicts |

If a file is shared across shards, agents return field maps only. The integrator alone writes the file.

### 7.3 Reusable prompt template

```text
ROLE
You are a native-level Japanese legal localization specialist for a Taiwan law firm.

SOURCE CONTRACT
- KO is the meaning/source-of-truth text.
- ZH-Hant is only for Taiwan official names and legal terminology.
- EN is a readability reference only.
- Source revision: <HEAD or blob IDs>.

ASSIGNMENT
- Translate only: <exact files, records, and keys>.
- Output to: <scratch path>.
- Do not edit the repository, stage, commit, push, deploy, or call external publishing APIs.

FIDELITY
1. Preserve every field/key, array order, heading, paragraph, list, fact, number,
   amount, percentage, date, deadline, statute/article, address, email, phone,
   URL, image, qualification, and CTA intent.
2. Do not summarize, omit, merge, embellish, correct silently, or invent.
3. Use natural professional Japanese suitable for Japanese-speaking clients
   seeking Taiwan legal services.
4. Do not substitute Japanese law/entity concepts for Taiwan concepts.
5. Retain verified Traditional Chinese official terms in parentheses when useful.
6. Do not invent personal-name readings.

LANGUAGE/LINK RULES
- Visible site-owned text: no Hangul.
- Each substantive output: contains kana.
- Internal /ja links: only <approved route allowlist>.
- Preserve external URLs exactly.
- Flag every unresolved fact/term/link instead of guessing.

RETURN
- Structured JA field map with exact source-key parity.
- Per-file structure checklist.
- Number/date/currency/statute/URL ledger.
- Terminology decisions and unresolved issues.
- Visible Hangul count and kana-presence result.
- Confirmation that no facts or sections were added or removed.
```

### 7.4 Translation quality gates

Each shard must pass:

1. exact recursive key parity;
2. exact array-count/order parity unless a documented route-only list changes;
3. number/date/currency/statute/email/phone/external-URL ledger parity;
4. kana present in each substantive section;
5. visible site-owned Hangul count zero;
6. no inherited full KO/EN string beyond an allowlist of official names/brands;
7. internal link allowlist validation;
8. Japanese editor approval for naturalness, register, particles, punctuation, and calques;
9. Taiwan-law reviewer approval for terms, legal forms, agencies, numbers, and qualifications;
10. independent QA agent comparison against the frozen source revision.

An unresolved legal or naming issue blocks only that route/file, but the route must stay out of JA navigation, sitemap, and hreflang until resolved.

## 8. Exact later-implementation file whitelist

No product file outside this list may be created or modified during implementation. If another dependency is genuinely required, stop, document why, and revise this plan before editing it.

### 8.1 Locale, route policy, SEO, sitemap, and middleware

- `src/lib/locales.ts`
- `src/lib/path-utils.ts`
- `src/lib/public-route-policy.ts` (new)
- `src/lib/search.ts`
- `src/lib/seo.ts`
- `src/middleware.ts`
- `src/app/fonts.ts`
- `src/app/globals.css`
- `src/app/[locale]/layout.tsx`
- `src/app/[locale]/[[...slug]]/page.tsx`
- `src/app/sitemap.ts`

### 8.2 Public data/content owners

- `src/data/site-content.ts`
- `src/data/page-copy.ts`
- `src/data/faq-content.ts`
- `src/data/attorney-profiles.ts`
- `src/data/firm-introduction.ts`
- `src/data/team-members.ts`
- `src/data/contact-page-content.ts`
- `src/data/legal-pages.ts`
- `src/data/service-details.ts`
- `src/data/intent-pages.ts`
- `src/app/[locale]/guides/taiwan-company-setup/content.ts`
- `src/app/[locale]/korean-lawyer-in-taiwan/content.ts`

### 8.3 Legacy homepage/core-page dispatch and metadata

- `src/app/[locale]/(legacy)/index.tsx`
- `src/app/[locale]/(legacy)/home-legacy.tsx`
- `src/app/[locale]/(legacy)/legacy-page-bodies.tsx`
- `src/app/[locale]/(legacy)/about-legacy.tsx`
- `src/app/[locale]/(legacy)/services-legacy.tsx`
- `src/app/[locale]/(legacy)/lawyers-legacy.tsx`
- `src/app/[locale]/(legacy)/pricing-legacy.tsx`
- `src/app/[locale]/(legacy)/reviews-legacy.tsx`
- `src/app/[locale]/(legacy)/contact-legacy.tsx`
- `src/app/[locale]/(legacy)/faq-legacy.tsx`
- `src/app/[locale]/(legacy)/privacy-legacy.tsx`
- `src/app/[locale]/(legacy)/disclaimer-legacy.tsx`

### 8.4 Explicit public routes

- `src/app/[locale]/faq/page.tsx`
- `src/app/[locale]/videos/page.tsx`
- `src/app/[locale]/accessibility/page.tsx`
- `src/app/[locale]/search/page.tsx`
- `src/app/[locale]/insights/page.tsx`
- `src/app/[locale]/insights/[slug]/page.tsx`
- `src/app/[locale]/services/[slug]/page.tsx`
- `src/app/[locale]/lawyers/[slug]/page.tsx`
- `src/app/[locale]/taiwan-lawyer/page.tsx`
- `src/app/[locale]/taiwan-company-setup-lawyer/page.tsx`
- `src/app/[locale]/taiwan-litigation-lawyer/page.tsx`
- `src/app/[locale]/guides/taiwan-company-setup/page.tsx`
- `src/app/[locale]/korean-lawyer-in-taiwan/page.tsx`
- `src/app/[locale]/columns/page.tsx`
- `src/app/[locale]/columns/[slug]/page.tsx`

### 8.5 Public chrome, home, and core-page components

- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/MobileNavDrawer.tsx`
- `src/components/SearchOverlay.tsx`
- `src/components/ScrollTopButton.tsx`
- `src/components/HeroSearch.tsx`
- `src/components/ServicesBento.tsx`
- `src/components/HomeAttorneySplit.tsx`
- `src/components/HomeCaseResultsSplit.tsx`
- `src/components/HomeStatsSection.tsx`
- `src/components/HomeContactCta.tsx`
- `src/components/InsightsArchiveSection.tsx`
- `src/components/FAQAccordion.tsx`
- `src/components/OfficeMapTabs.tsx`
- `src/components/ContactBlocks.tsx`
- `src/components/FirmIntroductionSection.tsx`
- `src/components/AttorneyProfileSection.tsx`
- `src/components/ConsultationGuideSection.tsx`
- `src/components/MessengerChatSection.tsx`
- `src/components/PricingCards.tsx`
- `src/components/ReviewBoard.tsx`
- `src/components/AttorneyMediaHubView.tsx`
- `src/components/VideoChannel.tsx`
- `src/components/LegalPageSections.tsx`
- `src/components/IntentLandingPage.tsx`
- `src/components/AttorneyAuthorityCard.tsx`

### 8.6 Tests and browser evidence

- `src/lib/__tests__/columns-ja-content.test.ts`
- `src/lib/__tests__/site-locales-ja.test.ts` (new if not already present)
- `src/lib/__tests__/ja-public-route-policy.test.ts` (new)
- `src/data/__tests__/ja-full-site-content.test.ts` (new)
- `src/components/__tests__/ja-public-chrome.test.tsx` (new)
- `src/app/[locale]/(legacy)/__tests__/home-legacy-localization.test.tsx`
- `src/app/[locale]/__tests__/ja-public-metadata.test.ts` (new)
- `src/app/[locale]/services/[slug]/__tests__/ja-content.test.ts` (new)
- `src/app/[locale]/lawyers/[slug]/__tests__/ja-content.test.ts` (new)
- `src/app/[locale]/videos/__tests__/page.test.tsx`
- `src/app/[locale]/guides/taiwan-company-setup/__tests__/content.test.ts`
- `src/app/[locale]/korean-lawyer-in-taiwan/__tests__/content.test.ts`
- `src/app/__tests__/sitemap.test.ts`
- `src/middleware.test.ts`
- `tests/builder-editor/ja-full-site.playwright.ts` (new)

### 8.7 Explicitly not whitelisted

- `src/content/columns-ja/**` and the other column corpora: the 17 JA articles are treated as completed input, not reopened by this plan;
- `src/data/insights-archive.ts`: canonical redirect/file-backed decision above;
- all `src/app/(builder)/**`, `src/components/builder/**`, and builder/admin schemas, persistence, translations, and UI;
- booking APIs, booking widgets, booking management, account/member pages, checkout, payments, and provider integrations;
- events, portfolio, store, and arbitrary published `/p/*` product modules;
- review API/data-model changes;
- package manifests and lockfiles;
- Wix checkpoint, canonical project plan, handoff, and `SESSION.md`;
- any commit, push, deploy, Blob/CMS write, credential use, or production mutation.

## 9. Delivery phases and gates

### Phase 0 — freeze and failing tests

- Record HEAD, dirty worktree, active lanes, source hashes, and route manifest.
- Use an isolated implementation workspace; do not reset or absorb the current dirty tree.
- Add failing tests for route preservation, deep Japanese content, chrome, metadata/JSON-LD, and sitemap.
- Exit: tests fail only for the documented missing JA implementation.

### Phase 1 — homepage, chrome, core pages, and column regression closure

Implement:

- locale/route policy and catch-all no-projection branch;
- full `buildJapaneseSiteContent`;
- JA FAQ/profile/team/firm/contact/legal/core page data;
- Header/Footer/MobileNavDrawer and all homepage/core components;
- `/ja`, about, services list, lawyers list, pricing, contact, FAQ, videos, reviews, privacy, disclaimer, accessibility;
- R2 column structured-data, link, authority-card, and sitemap fixes;
- dedicated JP fonts.

Phase 1 exit:

- every Phase 1 path returns the intended Japanese body;
- `/ja` returns 200 directly;
- visible site-owned Hangul is zero on `/ja`;
- no JA page resolves a builder page or uses `toBuilderLocale()` for public output;
- chrome/home/core Vitest and representative browser tests pass;
- only Phase 1-complete paths receive JA sitemap/hreflang.

### Phase 2 — dynamic details, landings, guide, and search

Implement:

- six file-backed JA service detail pages;
- file-backed `wei-tseng` attorney detail;
- three intent landings, company-setup guide, Korean-lawyer landing;
- JA search index/page/overlay;
- `/ja/insights/*` canonical redirects;
- final full-route sitemap/hreflang.

Phase 2 exit:

- every route in section 6.2 has a full JA body;
- service/lawyer JA routes bypass builder source/dynamic-template projection;
- search returns only approved JA routes/content;
- all completed paths have correct canonical, reciprocal hreflang, Open Graph locale, and JSON-LD;
- full browser route matrix passes.

Do not call the site fully localized after Phase 1. Phase 1 is an independently useful release candidate; final Definition of Done requires Phase 2.

## 10. Verification specification

### 10.1 Static content tests

`ja-full-site-content.test.ts` must:

1. recursively compare every `SiteContent` key and array shape across KO and JA;
2. ensure every JA text-bearing field is explicitly owned, not the same KO/EN string except an exact allowlist;
3. require kana in every substantive page/section;
4. require visible site-owned Hangul count zero;
5. compare all numbers, currencies, dates, email addresses, phone numbers, and external URLs;
6. validate every internal JA link against the route policy;
7. assert complete JA FAQ/profile/team/legal/service/intent/guide records;
8. assert six service records and all approved landing records;
9. assert `insightsArchive` is not required for JA;
10. print a field/path-specific failure, not only an aggregate count.

### 10.2 Route and locale tests

Assert:

- `normalizeSiteLocale('ja') === 'ja'`;
- builder `normalizeLocale('ja')` remains KO-compatible internally but is never used by JA public paths;
- public route policy classifies every section 6 path correctly;
- `/ja` is `full`, not fallback;
- unsupported locale-switch targets are `/ja/columns`;
- unknown paths remain 404;
- JA catch-all metadata/render branches never call builder page resolution;
- no `as never` hides a public locale mismatch.

### 10.3 Metadata, JSON-LD, and sitemap tests

For homepage, a core page, a service detail, a lawyer detail, a landing, columns listing, and a column detail, assert:

- canonical URL uses `/ja`;
- `content-language`/`inLanguage` is `ja`;
- Open Graph locale is `ja_JP`;
- organization/site names are Japanese;
- publisher/profile URLs stay under approved JA routes;
- breadcrumbs use Japanese labels and `/ja` paths;
- FAQ/HowTo/Article/CollectionPage/Person/LegalService JSON-LD is Japanese;
- no EN/KO URL or publisher leaks through `toBuilderLocale()`.

Sitemap assertions:

- every completed JA route exists exactly once;
- 17 JA column details come from `getAllColumnPosts('ja')`;
- the six services and one attorney detail exist only after their JA data gates pass;
- reciprocal alternates are exactly `ko`, `zh-Hant`, `en`, `ja`, and `x-default` where all bodies exist;
- incomplete/unsupported routes have no JA alternate;
- JA `lastModified` comes from matching JA content where applicable;
- no test relies only on one brittle aggregate total.

### 10.4 Browser verification

Run desktop Chromium and a 390px mobile viewport.

All Phase 1 routes and all Phase 2 routes must pass a status/body smoke. Deep-check at minimum:

1. `/ja`;
2. `/ja/about`;
3. `/ja/services`;
4. `/ja/services/investment`;
5. `/ja/lawyers`;
6. `/ja/lawyers/wei-tseng`;
7. `/ja/pricing`;
8. `/ja/contact`;
9. `/ja/faq`;
10. `/ja/videos`;
11. `/ja/taiwan-lawyer`;
12. `/ja/guides/taiwan-company-setup`;
13. `/ja/privacy`;
14. `/ja/columns`;
15. one FAQ-bearing JA column detail;
16. `/ja/search?q=会社設立`.

For `/ja` specifically:

- final response is HTTP 200 with no redirect to columns;
- `<html lang="ja">`;
- Japanese H1/hero, services, attorney, results, stats, columns, FAQ, offices, CTA, Header, and Footer are present;
- visible extracted text contains kana;
- visible extracted text contains zero Hangul after removing script/style, URL attributes, and non-visible metadata;
- no known English-home fingerprint survives;
- no horizontal overflow or clipped Japanese glyphs;
- no page error, hydration error, or serious console error.

For every sampled page:

- H1/body language is Japanese;
- Header, mobile drawer, Footer, and accessibility labels are Japanese;
- internal links resolve to approved `/ja` pages;
- language switch preserves supported paths and safely falls back otherwise;
- canonical/hreflang/JSON-LD agree;
- ordinary pointer clicks are used; no forced or JS-dispatched click;
- same-origin failed requests and console errors are zero.

### 10.5 Verification commands

Run later implementation gates from an isolated workspace containing only whitelisted changes:

```bash
git diff --name-only
# expected: exact whitelist only

npx vitest run \
  src/lib/__tests__/columns-ja-content.test.ts \
  src/lib/__tests__/site-locales-ja.test.ts \
  src/lib/__tests__/ja-public-route-policy.test.ts \
  src/data/__tests__/ja-full-site-content.test.ts \
  src/components/__tests__/ja-public-chrome.test.tsx \
  'src/app/[locale]/(legacy)/__tests__/home-legacy-localization.test.tsx' \
  'src/app/[locale]/__tests__/ja-public-metadata.test.ts' \
  'src/app/[locale]/services/[slug]/__tests__/ja-content.test.ts' \
  'src/app/[locale]/lawyers/[slug]/__tests__/ja-content.test.ts' \
  'src/app/[locale]/videos/__tests__/page.test.tsx' \
  'src/app/[locale]/guides/taiwan-company-setup/__tests__/content.test.ts' \
  'src/app/[locale]/korean-lawyer-in-taiwan/__tests__/content.test.ts' \
  src/app/__tests__/sitemap.test.ts \
  src/middleware.test.ts
# expected: all pass

npm run typecheck
# expected: exit 0, no as-never locale suppression

npm run lint
# expected: exit 0 with no new whitelist warnings

NEXT_DIST_DIR=.next-ja-full-site npm run build
# expected: isolated production build exits 0

npx playwright test \
  --config=playwright.config.ts \
  tests/builder-editor/ja-full-site.playwright.ts \
  --project=chromium-builder \
  --workers=1
# expected: desktop/mobile route matrix passes

git diff --check
# expected: exit 0

git status --short
# expected: no staged files, no commit, no unrelated files adopted
```

Recommended leakage checks:

```bash
rg -n "buildJapaneseShellContent|ja: buildJapaneseShellContent" src/data/site-content.ts
# expected: no matches

rg -n "toBuilderLocale\\(locale\\)|locale as never|normalizeLocale\\(params\\.locale\\)" \
  'src/app/[locale]' src/components
# expected: no match in approved JA public branches; remaining builder-only uses individually reviewed

rg -n "'/ja/(login|account|bookings|admin-builder|admin-consultation|events|portfolio|store)" \
  src/components src/data
# expected: no generated JA chrome/content links
```

Runtime visible-text language checks should be implemented in Playwright rather than by grepping TSX source.

## 11. Definition of Done

The full-site Japanese work is done only when all of the following are true:

1. `/ja` returns HTTP 200 and renders the complete Japanese homepage, not a redirect, EN shell, KO body, or builder projection.
2. Every path in sections 6.1 and 6.2 has a complete Japanese body and public chrome.
3. `/ja/insights/*` canonicalizes to the file-backed Japanese columns surface.
4. Known unsupported product paths never render KO/EN under `/ja` and are absent from JA navigation, sitemap, and hreflang.
5. `buildJapaneseSiteContent()` explicitly covers the full `SiteContent` shape.
6. All deep content owners have reviewed JA data; no component relies on an English default branch for Japanese.
7. Header, Footer, MobileNavDrawer, home components, contact/office UI, search, and accessibility labels are Japanese.
8. JA public metadata and every emitted JSON-LD object identify the real JA URL/language/organization.
9. The JA sitemap/hreflang set contains only complete translations and uses matching locale data.
10. Site-owned visible Hangul is zero on `/ja`; no KO/EN homepage fingerprint remains.
11. Japanese editor and Taiwan-law reviewer have approved all substantive copy, facts, names, and terminology.
12. Typecheck, focused/full relevant Vitest, lint, isolated build, diff check, and desktop/mobile browser gates pass.
13. The implementation diff contains only the exact whitelist and does not widen builder/admin `Locale`.
14. No commit, push, deploy, Blob/CMS write, credential use, or production mutation occurs without a separate user authorization.

## 12. Out of scope

- Japanese localization of admin-builder, admin-consultation, editor chrome, CMS authoring, translation dashboards, or builder persistence schemas;
- Japanese booking flow, booking management, calendar/payment/provider emails, account/member/auth, premium content, checkout, or billing;
- events, portfolio, store/e-commerce, or arbitrary builder-published pages;
- design redesign, layout geometry changes, new homepage sections, or information-architecture changes;
- rewriting the completed 17 JA columns;
- new legal claims, statutes, case results, credentials, reviews, testimonials, guarantees, or marketing assertions;
- automatic translation provider integration;
- commit, push, deploy, production credentials, Blob/CMS publish, or any production mutation.

This plan localizes the public law-firm information site. It deliberately does not claim that the Wix-class builder or its application products are Japanese-localized.
