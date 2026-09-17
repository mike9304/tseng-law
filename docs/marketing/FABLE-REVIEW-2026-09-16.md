# Fable review — semiconductor supplier hub (2026-09-16)

Reviewer: Claude Fable (independent, read-only). No product code edited. No commit.
Worktree: `tseng-law-semiconductor-20260916` · branch `seo/semiconductor-hub-20260916`
BASE `0d6ee82e` → HEAD `dd5eac87` (6 commits: e9c37a2c, 92f474ad, 0a9a9c49, 83e8b574, cbb77192, dd5eac87). Worktree clean apart from `node_modules`.
Plan file `docs/marketing/SEMICONDUCTOR-SUPPLY-INFLOW-PLAN-2026-09.md`: **does not exist** in this worktree. Reviewed against `HUB-SEO-REVIEW-2026-09-16.md`, `P0-SOURCE-RESIDUE-2026-09-16.md`, `HUB-COPY-SEMICONDUCTOR-2026-09.md` and the diff.

Goal check: the hub is written for overseas materials/equipment SMEs (EN "overseas", ZH 海外, KO 한국 공급사, JA 日本のサプライヤー). It is not a TSMC-GC page and not a patent boutique — `serviceSlugs` are the four published practice areas only.

---

## 검증 실행 증거

| Check | Result | Evidence |
|---|---|---|
| Specified 6 vitest files | **PASS** 6 files / 97 tests | `npx vitest run src/data/__tests__/intent-pages-semiconductor.test.ts src/data/__tests__/intent-pages-en.test.ts src/data/__tests__/intent-pages-ja.test.ts src/app/__tests__/sitemap.test.ts src/components/__tests__/intent-landing-ja-parity.test.tsx src/data/__tests__/attorney-profiles-ja.test.ts` → `Test Files 6 passed (6) · Tests 97 passed (97)` |
| Full `npx vitest run` (= CI `npm run test:unit`) | **FAIL** 14 files / 21 tests (1120 files / 8665 tests pass) | log `/tmp/fable-vitest-full.log`. 12 of the 14 failing files pass on BASE `0d6ee82e` (verified in a `git archive` scratch copy: `12 passed (12) · 105 passed (105)`) → regressions from this branch. Remaining 2 (`safe-local-fs`, `qa-runtime-attestation`) fail on macOS TMPDIR / 20 s timeout — builder infra, not touched by this diff, not verified at base. |
| `npm run typecheck` | **FAIL** — 1 error, **pre-existing** | `src/app/__tests__/sitemap.test.ts(339,81) TS2322`. `git blame` → commit `3a715018` (2026-09-06), ancestor of BASE. Not this branch. |
| Sitemap matrix for the slug | **PASS** | Temporary vitest dump (deleted afterwards): 4 URLs, each `ko / zh-Hant / en / ja / x-default=https://tseng-law.com/en/taiwan-semiconductor-supplier-legal`, no duplicate URLs. |
| Forbidden-claim grep on `+` lines of the diff (`TSMC / 台積電 / 승소 / win rate / 勝訴 / 最高 / 1위 / 유일 / 唯一 / 科學園區 / science park / サイエンスパーク / export control / 出口管制 / 輸出管理 / 新竹 / Hsinchu / specialist / certif`) | **clean** | Only hits are the forbidden-token list inside the test file itself and the review docs. |
| Secrets / phones / emails in diff | **clean** | No key/token patterns; no phone numbers; no email addresses added. `src/middleware.ts` untouched. |

---

## 치명

없음. Routing, sitemap, hreflang, x-default, locale count, forbidden claims, secrets — no critical defect found.

---

## 높음

### H1. Branch turns CI red: 12 test files (19 tests) that pass on BASE fail on HEAD

`.github/workflows/builder-quality.yml:15-20,43` runs `npm run test:unit` (full vitest) on every PR touching `src/**`. This branch will not merge green.

All 19 are stale content pins or a guard false-positive, not product defects — but they must be fixed on this branch.

| Failing test | What it pins | Evidence (HEAD) | Fix |
|---|---|---|---|
| `src/components/__tests__/ja-footer.test.tsx:70-81` | Exact JA Popular-Topics list | Received list has the extra `/ja/taiwan-semiconductor-supplier-legal` row added in `src/data/site-content.ts:3229` | Add the new row to `expectedTopics`. |
| `src/data/__tests__/firm-introduction-ja.test.ts:29` | Regex `/2024年.*曾雋崴弁護士.*韓国.*日本.*会社設立…/` (Korea-before-Japan order) | `src/data/firm-introduction.ts:78` now reads 「日本および韓国を含む国際クライアント」 | Update regex to the new order (`日本.*韓国`) — the copy change is the intended de-Korea-default. |
| `src/lib/__tests__/columns-ja-investment-004-intro-sync.test.ts:137` | Regex requiring 「韓国…親会社…台湾…進出」 | `src/content/columns-ja/004:29` now says 「台湾国外の親会社が台湾に進出する場合…韓国親会社の例」 | Re-pin to the new sentence. |
| `src/lib/__tests__/columns-en-investment-001.test.ts:349` | Image position relative to an anchor phrase (`expected 131 to be less than -1` = anchor not found) | Anchor was "Korean companies and sole proprietors"; `columns-en/001:25` now "overseas companies…" | Update anchor string. |
| `src/lib/__tests__/columns-en-investment-004.test.ts:382` | Word count 5493 | Now 5505 (`columns-en/004:29` added "Korea is one labeled example…") | Re-pin count/read-time. |
| `src/lib/__tests__/columns-en-investment-005.test.ts:164,263` | Related links `/ko/…` ×3 and word count 546 | `columns-en/005:69-70` now `/en/guides/taiwan-company-setup`, `/en/taiwan-company-setup-lawyer`; count 567 | Re-pin to `/en/` targets (the `/ko/` pin was the leak P0 §2 asked to remove) and new count. |
| `src/lib/__tests__/columns-en-investment-011.test.ts:373` | Word count 2478 | Now 2481 (`columns-en/011:23` "A brand from another country") | Re-pin. |
| `src/lib/__tests__/columns-ja-investment-011-pif-two-paragraph-sync.test.ts:45` | SHA-256 of locked prefix/tail | Hash changed by `columns-ja/011:23` edit | Re-pin hash after confirming the two-paragraph body is unchanged. |
| `src/lib/__tests__/columns-ja-investment-013.test.ts:143,203` | `/ko/` link targets ×3; visible-JA count 1700 | `columns-ja/013:123-124` now `/ja/…` ×2; count 1686 | Re-pin. |
| `src/lib/__tests__/columns-ja-investment-015.test.ts:92,163,~180,~200,240` | 3 related items; `/ko/` targets; **`not.toContain('/ja/')`**; count 990 | `columns-ja/015:75-76` now 2 items, `/ja/…`; count 976 | Re-pin. The `not.toContain('/ja/')` assertion contradicts the same-locale link policy — delete it, do not satisfy it. |
| `src/lib/__tests__/columns-ja-labor-009.test.ts:79,120` | Extractor matches only `]\((\/ko\/[^)]+)\)` and expects 3 hits; body hash | `columns-ja/009:98-99` now `/ja/…` → extractor returns `[]`; hash changed | Change extractor to `/ja/` and expect the 2 new targets; re-pin hash. |
| `src/lib/consultation/__tests__/verified-contact-copy.test.ts` (guard `/KakaoTalk\|\bLINE\b\|line\.me\|lin\.ee/i`) | No public Kakao/LINE claim in `src/data/intent-pages.ts` | `intent-pages.ts:872` "**line** up contracts…", `:881` "finish **line**" match `\bLINE\b` case-insensitively | Reword the two EN strings (e.g. "schedule contracts…", "Treating incorporation as the end of the work…"). Do not weaken the guard. |

### H2. Attorney publish gate is still open on the committed copy

`docs/marketing/HUB-COPY-SEMICONDUCTOR-2026-09.md:3` — `attorney-review-required · do not publish unreviewed`. HUB-SEO-REVIEW G9 = FAIL (publish GATE). Nothing in the six commits records attorney sign-off, and the copy kit's own §13.3 rows G6/G7/G8 (strings it says to strip "unless attorney initials them", §13.6 item 5) are all still in HEAD:

| Copy-kit gap | Committed strings (`src/data/intent-pages.ts`) |
|---|---|
| G6 invented operating model (direct sales / distributor / installation / after-sales) | ko `:252`, `:263` · zh-hant `:551` · en `:870` · ja `:1152`, `:1163` |
| G7 warranty / 하자 책임 / 瑕疵責任 as an offering | ko `:253` · zh-hant `:541` · en `:860` · ja `:1153` |
| G8 "representative office often cannot carry on full commercial activity" (legal conclusion, stronger than live `/services/investment`) | ko `:276` · zh-hant `:564` · en `:883` · ja `:1176` |

These are not science-park / export-control / TSMC inventions (none found), but they are new legal-service claims with no published source page. Also new for the KO locale: FAQ5 「통상적인 대만 회사설립은 NT$50,000부터」 (`:310`); the figure is published in `src/components/PricingCards.tsx:57ff` for all locales, but HUB-SEO-REVIEW §4 flags 변협 제4조 10호 최저-표방 proximity — attorney call.

Fix: either (a) attorney marks HUB-COPY §3–§6 / §13 accepted, or (b) strip/qualify the G6–G8 strings per §13.6 before deploy. This is a process gate, not a code defect; the deploy verdict below depends on it.

---

## 중간

### M1. Column 008 (labor severance) still ships Korea-as-default-reader in EN body and in both JA/EN FAQ answers

The branch rewrote the JA 008 body (`columns-ja/008:29` 「比較のため、韓国の退職金制度に触れると…」) but left:

- `src/content/columns-en/008-taiwan-labor-severance-law.md:29-31` — "Many of you may already be familiar with how severance works in Korea. In Korea, a company must pay severance when an employee leaves." (EN body untouched by this branch; same sentence class that was fixed in JA.)
- `columns-ja/008:12` frontmatter FAQ — 「台湾は韓国と異なり…」; `columns-en/008:12` — "Unlike Korea, Taiwan requires…". Frontmatter FAQ renders on-page **and** in FAQPage JSON-LD (`src/app/[locale]/columns/[slug]/page.tsx:177-232`), so the residue is visible and machine-readable.

P0-SOURCE-RESIDUE §1 lists JA 008 as P0; the fix landed only on the body. Fix: mirror the JA body rewrite into EN 008 (`:29-31`) and rephrase both FAQ answers to a labeled comparison ("Unlike some jurisdictions, for example Korea, …" / 「例えば韓国と異なり」). Re-pin the corresponding column tests (`columns-en-labor-008` / `columns-ja-labor-008` if present).

### M2. `columns/[slug]/page.tsx` related-links map has no path to the new hub

`src/app/[locale]/columns/[slug]/page.tsx:159-165` maps column categories to intent pages (`taiwan-litigation-lawyer`, `taiwan-lawyer`, …). Company-setup columns linked **from** the hub do not link **back** to it; inbound links today are footer Popular Topics only (`site-content.ts:962, 1712, 2468, 3229`). Orphan rule is met (footer), so this is not a crawl defect; it is the P2 in HUB-SEO-REVIEW ("one relatedResource on `taiwan-company-setup-lawyer` → hub after index"). Fix: after attorney sign-off, add one descriptive link from the company-setup intent page or the company-setup column category to the hub. Not a blocker.

---

## 낮음

### L1. EN/JA sitemap `lastModified` is earlier than the page's creation

`src/app/sitemap.ts:41` `EN_JA_PUBLIC_LASTMOD = '2026-09-06'`, applied at `:46` to every EN/JA static path. Dump shows `/en/…` and `/ja/…semiconductor…` with `lastModified: "2026-09-06"`; the page was created 2026-09-16 (`92f474ad`). KO/ZH rows carry no lastmod. Inaccurate lastmod is ignored by Google rather than penalised, so low. Fix: per-path lastmod map, or bump the constant on this deploy.

### L2. Shared CTA copy names family disputes on a supplier hub

`src/components/IntentLandingPage.tsx:47, 73, 99, 125` — `ctaText` ("…investment, litigation, and family disputes…") is template chrome rendered on every intent page including this one. Topical mismatch only. Fix: per-slug `ctaText` override (P3 in HUB-SEO-REVIEW).

### L3. Sitemap test covers the new slug weaker than `/about`

`src/app/__tests__/sitemap.test.ts:291-297` only asserts the JA entry is published once. The full five-key matrix (ko/zh-Hant/en/ja/x-default) is proven only by my manual dump, not by CI. Fix: add the same five-key `toEqual` used for `/about` for this slug.

### L4. External SEO snapshot script does not know the hub

`scripts/seo-external-snapshot.mjs:29-32` lists `/ko/taiwan-litigation-lawyer` and siblings; the new slug is absent, so the snapshot tool will not track it. Fix: add the four hub URLs.

### L5. Residual labeled Korea-origin examples still ship in EN/JA columns (accepted trade-off, listing for completeness)

- `columns-en/005:20-30, 56` and `columns-ja/005:24-36, 70` keep Q1 "remitting capital from Korea" and Q5 "employ Korean nationals", now prefixed with a "Korea-origin example" disclaimer instead of a rewrite. Acceptable, but P0 doc §1 had rated it P0.
- `columns-en/003:267`, `columns-en/008:207`, `columns-en/009:102` still link to `/en/korean-lawyer-in-taiwan` from generic EN columns (dedicated page is KEEP per P0 doc; the link itself is a mild default-reader signal).
- `columns-ja/008:3`, `columns-ja/009:3` frontmatter `url:` contains Hangul source-post URLs; `column-post.ts` does not render `url` on the page (grep: no `frontmatter.url` consumer), so not visible — metadata only.

### L6. Pre-existing typecheck failure (not this branch)

`src/app/__tests__/sitemap.test.ts:339` TS2322, from `3a715018` (before BASE). CI step `npm run typecheck` (`builder-quality.yml:41`) is already red on BASE. Not introduced here, but it means the branch cannot show a green CI run even after H1 is fixed unless this is fixed too.

---

## 확인 완료 (no issue)

- **Routing**: dedicated route `src/app/[locale]/taiwan-semiconductor-supplier-legal/page.tsx` mirrors `taiwan-lawyer/page.tsx` exactly; `[locale]/layout.tsx:22,39-40` `dynamicParams=false` + `generateStaticParams` from `siteLocales` (4) → only ko/zh-hant/en/ja are built; no 9-locale clone; `publicLocalesForPath` returns the same four.
- **HTML hreflang**: `buildSeoMetadata({ alternateLocales: siteLocales })` → `getLanguageAlternates` (`src/lib/seo.ts:200-216`), `HREFLANG_X_DEFAULT_LOCALE='en'` (`:105`); slug is not in `isEnglishNoindexPath` (`src/lib/seo-visibility.ts:20-32`), so EN alternate and en x-default are emitted.
- **Sitemap**: `STATIC_PATHS` + dedicated JA `createEntry` (`sitemap.ts:27, 280-285`); 4 URLs × 5 keys, no duplicates (dump above); counts in `sitemap.test.ts:110-112` updated (171/162).
- **JA language switch**: `JA_DEDICATED_ROUTE_PATHS` includes the slug (`src/lib/public-route-policy.ts:43`); `LocaleFlagSwitcher.localeFlagHref` (`:48-53`) → `/ja/taiwan-semiconductor-supplier-legal`; other locales path-preserve.
- **Links**: `relatedResources` hrefs (`IntentLandingPage.tsx:250-287`) resolve to existing routes (`lawyers/[slug]`, `taiwan-company-setup-lawyer`, `taiwan-litigation-lawyer`, `guides/taiwan-company-setup`); all four `columnSlugs` exist in `columns`, `columns-en`, `columns-ja`, `columns-zh`; rewritten column related links (`/en/…`, `/ja/…`) point at existing routes; JA parity test "links every related column under /ja/columns" passes for the new slug.
- **Existing page stuffing (HUB-SEO-REVIEW G6b)**: reverted in `83e8b574`. Semiconductor tokens in `intent-pages.ts` occur only inside the four new blocks (lines 226-318, 514-606, 833-925, 1126-1218); `taiwan-company-setup-lawyer` blocks are byte-identical to BASE in the cumulative diff.
- **Hub JA/EN copy**: EN mentions Korea only as a consultation language; JA has no Hangul, no `/ko/`, no 韓国 audience framing (tests + manual read). JA profile keywords drop 「韓国語対応の台湾弁護士」 (`attorney-profiles.ts:309-310`); JA firm intro re-ordered to 「日本および韓国を含む国際クライアント」.
- **Fee / timeline facts**: NT$3,000 per hour, four languages, in-person/video, ~3 months, NT$50,000 standard setup all pre-exist on `taiwan-lawyer` / `taiwan-company-setup-lawyer` (BASE `intent-pages.ts:488, 698`) and `PricingCards.tsx`.
- **Security**: no secrets, no new API surface, `middleware.ts` unchanged, footer links are static `<a href>` to same-origin paths.

---

## Deploy verdict

**NO-SHIP as-is.** Two blockers, both fixable on this branch without touching the SEO wiring:

1. **H1** — bring `npm run test:unit` back to green (re-pin the 11 column/footer/intro tests to the intended same-locale links and new counts; reword the two "line" strings in EN hub copy). Pre-existing **L6** typecheck error also has to be cleared for CI to pass at all.
2. **H2** — attorney sign-off on HUB-COPY §3–§6 / §13, or strip the G6–G8 strings before publishing.

Once H1 and H2 are closed: **SHIP** the four locales together (hreflang cluster must go 200 at the same time). M1 (EN 008 body + both 008 FAQ answers) should ride the same deploy if the column tests are being re-pinned anyway; M2/L1–L5 can follow.
