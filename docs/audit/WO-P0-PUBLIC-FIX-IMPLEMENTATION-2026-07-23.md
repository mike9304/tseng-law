# WO-P0 PUBLIC FIX — Implementation Report (2026-07-23)

Plan: `docs/audit/WO-P0-PUBLIC-FIX-PLAN-2026-07-23.md` (Codex)  
Implementer: Grok 4.5 (this session)  
Status: **partial source completion** for Steps 1–5 on legacy/code paths.  
**Not complete for plan DoD:** Blob patch scripts, Playwright, production Upstash, messenger ownership gate, full sitemap verifier.

## Done (code)

### Step 1 — Trust
- Removed public FAQ marker FAQ object + JSX source notes with `[변호사 검수 필요]`
- Taipei office no longer carries Taichung `04-2326-*` in:
  - `site-content.ts` locations
  - `OfficeMapTabs.tsx` (phone optional; taipei phone removed)
  - `office-locations.ts` presets + `decompose-offices.ts` conditional phone nodes
- Tests updated: remediation content contract

### Step 2 — Contact channels
- Expanded `contact-page-content.ts` SSOT (LINE/Kakao/email/tel)
- `MessengerChatSection` hrefs from SSOT
- `ContactLegacyPageBody` mounts `MessengerChatSection`
- `ContactBlocks` adds semantic mailto/tel/LINE/Kakao anchors

**Human gate remaining:** physical mobile receive test for LINE/Kakao ownership before production confidence.

### Step 3 — Rate limit semantics
- Added `mapPublicRateLimitDenial()` → `backend_unavailable` = **503** `rate_limit_unavailable`, genuine deny = **429** + positive Retry-After
- Wired: search, booking services/staff/availability/book/payment-intent
- Copy strings for KO/ZH/EN

**Ops remaining:** Vercel Production Upstash env must exist for 200 on first visitor request (code alone cannot invent Redis).

### Step 4 — EN home insights
- `home-legacy.tsx` uses `getAllColumnPosts(locale)` (no EN→KO archive force)
- Composite `Render.tsx` falls back to locale archive only in edit/preview; published empty if no posts/dates

### Step 5 — SSR stats
- `HomeStatsSection` initializes counts to targets; animation only after hydrate + intersect
- SSR test asserts `10+ / 500+ / 5 / 4` for all locales

## Not done (plan optional / ops)
- `scripts/patch-taipei-office-2026-07-23.mjs` / contact channel Blob patch (production Blob republish)
- `scripts/verify-public-p0-2026-07-23.mjs` sitemap crawler
- Playwright `public-p0-fixes.playwright.ts`
- Production deploy / Upstash env / messenger receive screenshot evidence

## Verification run locally

```text
vitest: 6 files / 35 tests PASS (primary suite)
+ seed-home-zh-hant-parity, booking staff/book, composite localization PASS
rg "[변호사 검수 필요]" src → 0
```

## Suggested commits (not made)

1. `fix(public): remove review markers and incorrect Taipei contacts`
2. `feat(contact): publish verified direct consultation channels`
3. `fix(api): distinguish rate-limit outages from client throttling`
4. `fix(i18n): serve canonical English home insights`
5. `fix(ssr): render real home statistics without JavaScript`
