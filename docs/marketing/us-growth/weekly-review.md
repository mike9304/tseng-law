# Weekly review — US-growth (template)

One copy per week. Proposed labor envelope: **78 hours** (W1–2 = 18h, W3–12 = 6h/week). Confirmed staff availability: **pending**. Case handling is outside the 78h. No outbound sending from this kit. No client identities or case contents. Missing or zero **is not a rate**.

Week starting (YYYY-MM-DD):  
Reviewer:  
Hours this week — attorney: ___ / ops-SEO-content: ___ / **week cap from table below:** ___  
Cumulative hours to date: ___ / 78 proposed

## 0. Missingness (fill before any ratio)

| Denominator | Available this week? | If no |
|---|---|---|
| Google Search Console (EN / US-geo if offered) | **no console access confirmed** (2026-09-07) / yes | Write “no console access”. Do not write 0 impressions. |
| Bing webmaster | yes / **no console access** | same |
| Visit pull `node scripts/pull-visit-metrics.mjs --days 35` | yes / token missing / pull failed | “metrics pull unavailable”; do not invent sessions |
| Intent-route helper `npx --no-install vite-node --config vitest.config.ts scripts/report-intent-routes.ts metrics-local/visits/summary/<YYYY-MM-DD>.json` (uses `src/lib/metrics/intent-route-report.ts`) | ran / not run / not claimed test-pass | implemented in tree, **not deployed**; do not claim tests passed here |
| Report `ratioAllowed` (global over the selected observed rows in that report) | copy from report: true / false | One flag for the whole selected observed set, not a per-row gate. If false, **no intent rates**. Observed population only — not the total visitor population. |
| Inquiry ledger maintained | yes / no | inquiry layer = missing, not 0 demand |
| IP-country on visits | partial / none / present | Label **IP-country**, never nationality |
| Self-reported inquiry country | optional, often empty | Leave unknown; do not backfill from IP |

Pre-registered exposure window (fill **before** judging copy): pages ___; intent queries ___; period ___; tracking gaps ___. If undefined: **measurement uncertain** — no statistical market call.

Public route baseline already measured 2026-09-07 (do not speculative-repair): four EN intent routes + 12 reciprocal locale URLs, HTTP 200, self-canonical, index,follow. Home fourth lane: **implemented locally, awaiting final QA** (Fable ACCEPT; build compiled; regression QA in progress). No deployment. No empirical results.

## 1. Search

Status: **no console access confirmed** / figures attached.

| Item | Value | Notes |
|---|---|---|
| Property / geo / search type used |  | US ranking claims require a US setting. Generic SERP ≠ US rank. |
| Impressions (brand) |  | missing ≠ 0 |
| Impressions (non-brand, if separable) |  | do not estimate AI share from Web totals |
| Clicks |  | |
| Index issues on `/en`, `/en/taiwan-lawyer`, `/en/taiwan-company-setup-lawyer`, `/en/taiwan-litigation-lawyer` |  | Unindexed ≠ defect. Do not reopen canonical/hreflang/robots; baseline `5eb435b9`. |

IndexNow receipts are not growth.

### 1a. US search intent / source observation (optional)

| Date | Query (candidate) | Engine | Location setting | Result type | Our URL visible | Other cited URLs | Treat as US rank? |
|---|---|---|---|---|---|---|---|
|  |  | google / bing / other | US / unset / other | web / maps / AI overview | Y/N/unknown |  | only if US setting documented |

Empty table ≠ 0 rank. Copy durable rows into `channel-candidates.md` search log if kept.

### 1b. AI observation (optional, not share)

| Date | Product/model | Region | Query (no brand/domain) | Grounded search on? | Cited URLs | Our domain cited? |
|---|---|---|---|---|---|---|
|  |  |  |  | Y/N/unknown |  | Y/N |

n is an observation, not share. Skip if it does not fit diagnosis time. Do not derive AI share from GSC Web totals.

## 2. Visit (existing rollup only)

Pull: `node scripts/pull-visit-metrics.mjs --days 35`  
Report (when operator actually runs it): `npx --no-install vite-node --config vitest.config.ts scripts/report-intent-routes.ts metrics-local/visits/summary/<YYYY-MM-DD>.json` for locale `en` and entry paths below. Helper is **in tree, not deployed; tests not claimed here**. If not run, paste `metrics-local/visits/summary/` counts. Omit paths not in the list (do not zero-fill as failures).

| entryPath | sessions | trackedSessions | intentSessions (unique observed sessions with >=1 email-compose click) | byChannel | byCountryIp (IP-country, include `unknown`) |
|---|---:|---:|---:|---|---|
| /en |  |  |  |  |  |
| /en/taiwan-lawyer |  |  |  |  |  |
| /en/taiwan-company-setup-lawyer |  |  |  |  |  |
| /en/taiwan-litigation-lawyer |  |  |  |  |  |

Paste `ratioAllowed` from the report output (one global flag for the selected observed rows, not a per-row independent gate): true / false  
If `ratioAllowed` is false, **no intent rates** for this report. Do not compute a manual substitute. Per-row ratios the report leaves null stay null (0 or missing is **not** a rate). Observed population only — not the total visitor population.  
`unattributedEvents` (from the same report, if present): ___  
`intentSessions` = unique observed sessions with >=1 `email_compose` click, **not** raw contact-intent events and **not** received inquiries. Incomplete days stay blank. Do not rank countries from imputed zeros.

## 3. Inquiries (ledger)

Source: `inquiry-ledger.csv`. Cohort = week of `received_at`. Stage timing = `qualified_at` / `capacity_checked_at` / `paid_consult_at` / `engaged_at` / `closed_at`. Preserve `traced_source` and `self_reported_source` even when `source_conflict=Y`.

| Count | N | Notes |
|---|---:|---|
| Rows with `received_at` this week |  | includes test/spam/duplicates |
| `record_kind=real` and `duplicate_of` empty (unique real) |  | |
| unique real `qualified=Y` |  | **primary metric** |
| unique real `qualified=N` |  | |
| unique real `qualified=pending` |  | immature, not a fail |
| `record_kind=test` / `spam` |  | excluded from primary metric |
| rows with `duplicate_of` filled |  | excluded from unique counts |
| `source_conflict=Y` among unique real |  | keep both sources; do not recode |
| `conflict_check=conflict` among unique real qualified Y |  | does not un-qualify |
| `capacity_ok=N` among unique real qualified Y |  | does not un-qualify |
| `paid_consult=Y` dated this week, **named by intake cohort** |  | use `paid_consult_at` |
| `engaged=Y` dated this week, **named by intake cohort** |  | use `engaged_at` |
| `language=en` among unique real qualified Y |  | |
| `matter_area` split among unique real qualified Y |  | formation / litigation / residence assistance / tax-accounting assistance / other |

One qualified inquiry = possibility, not repeatable growth evidence.

## 4. Distribution (activity ≠ acquisition)

From `channel-candidates.md`. No row may say “sent” unless a later **authorized** send happened. This kit: research/draft only.

| Candidate | Status confirmed / unverified / not-fit | Activity this week (research / draft / sent / reply / listed) | Qualified inquiries attributable | Decision |
|---|---|---|---|---|
|  |  |  |  | continue / pause this path / stop (do-not-contact) |

Path-level stop: 2 relevant contacts + 1 allowed follow-up, no substantive reply → pause **that path**. Refusal → stop. Reopen paused paths at W8 only if requirements changed.

## 5. Hours vs 78h proposal

Proposed envelope (not confirmed availability):

| Week | Intended work | Attorney | Ops/SEO/content | Cap |
|---|---|---:|---:|---:|
| W1 | facts 3h, tech diagnosis 2h (cap, not a repair promise), intent/field/draft 2h, measurement 1h, US-contact research 1h | 2 | 7 | 9 |
| W2 | fact confirm 1h, drafts 3h, distribution assets 2h, measurement 1h, review 2h | 2 | 7 | 9 |
| W3 | second pitch + limited execution on **confirmed** contacts 2h, comprehension check 2h, records 1h, attorney 1h | 1 | 5 | 6 |
| W4 | limited distribution 2h, field/search diagnosis 2h, operating decision 1h, attorney 1h | 1 | 5 | 6 |
| W5–W12 each | production weeks ≈ draft 3 + dist 1 + inquiry/measure 1 + attorney 1; non-production ≈ dist 2 + diagnosis 2 + inquiry/decision 1 + attorney 1 | 1 | 5 | 6 |
| **Total** | | **14** | **64** | **78** |

Logged this week: attorney ___ · ops ___ · total ___  
Overrun: cut artifacts, do not silently raise 78h.

### 5a. Paid pilot registration (spend 0 until gated)

| Gate | Value |
|---|---|
| B media budget | unset |
| T period | unset |
| Daily plan cap | B/T when both set |
| C allowed cost per unique qualified inquiry | unset |
| Max loss (does it include labor?) | unset |
| Landing / reply path / tracking / professional-ad rule check | not checked |
| Status | **not started**; spend logged: **0** |

Do not start while B, T, or C is unset. Do not invent CPC, CPA, volume, or ROI. If later approved, either replace a 78h line or get extra capacity approval.

## 6. Decision this week

- Published promise that cannot be performed? (immediate, not a market call)
- Exposure shortage vs pre-registered window (two weekly reviews)? shift hours to distribution/intent diagnosis
- Formation vs litigation production priority (W4): capacity, edit cost, channel, inquiry context — **not** inquiry-share winner
- Continue / reallocate / stop (W12 or earlier if hours or ethics require)

Evidence attached (filenames only):  
Demand call: `not decidable` / `observe` / `do not call`.
