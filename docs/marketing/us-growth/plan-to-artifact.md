# US-growth operating kit — plan-to-artifact map, readiness, runbook

Internal only. Production baseline `5eb435b9`. Do not deploy, contact anyone, or change robots/canonical/hreflang/meta/sitemap/IndexNow from this kit. Measured 2026-09-07: four EN intent routes + 12 reciprocal locale URLs = HTTP 200, self-canonical, index,follow. Home fourth lane **implemented locally, awaiting final QA** (Fable ACCEPT; build compiled; regression QA in progress; not deployed; no empirical results). No speculative SEO repair. No GSC access confirmed.

Reuse VisitTracker, `contact_intent` (`email_compose`), `scripts/pull-visit-metrics.mjs`, and (when an operator actually runs it) `scripts/report-intent-routes.ts`. Do not stand up a CRM. Unknown items stay **pending**. Do not invent named staff, capacity, fees, turnaround, or individual credentials. No assumed coordination model for residence or tax/accounting assistance.

## Implemented in tree (not a test-pass claim; not deployed)

| Path | Notes |
|---|---|
| `src/data/intent-pages.ts` | EN intent copy/data |
| `src/components/IntentLandingPage.tsx` | EN intent landing |
| `src/lib/consultation/public-contact.ts` | EN mailto / public email `wei@hoveringlaw.com.tw` |
| `src/lib/metrics/intent-route-report.ts` | `reportIntentRoutes` over existing `DailySummary` |
| `scripts/report-intent-routes.ts` | CLI helper; run `npx --no-install vite-node --config vitest.config.ts scripts/report-intent-routes.ts metrics-local/visits/summary/<YYYY-MM-DD>.json` |
| Home fourth lane | **implemented locally, awaiting final QA** (Fable ACCEPT; build compiled; not deployed; no empirical results) |
| This ops kit | internal drafts; **not sent**; do not mark market-ready |

## Plan → artifact

| Plan section | Operating artifact | Status of *this* kit |
|---|---|---|
| §1 English scope vs public wording | `source-and-claim-ledger.md` | Drafted for attorney marks. Nothing pending may be published. Not a test-pass. |
| §4 audience / offer / constraint; D5 field choice | ledger + intake block below | Formation vs litigation = **reversible production priority**, not a market-winner score. Both existing EN paths stay live. |
| §5 P0 language/intake fact table | `source-and-claim-ledger.md` | Owner-confirmed Taiwan-law services recorded; named intake owner / capacity / fees / extra credentials pending. |
| §5 search-intent → existing URL | this file + `weekly-review.md` §1a | Candidates only. Not ranked keywords. |
| §5 company-setup / overseas parent intake | this file, **Company-setup intake** | Intake fields; no new URLs. |
| §5 English inquiry path + first reply | `inquiry-ledger.csv` + `inquiry-ledger.md` + `en-first-reply.md` | Templates only. **Not sent.** |
| §5 distribution + 1-pager + AIT; W3 UK | `channel-candidates.md` + `partner-sheet.md` + `pitch-drafts.md` | Drafts. **No outreach.** |
| §6 tech diagnosis | out of marketing-ops edits | Sep7 measurement above. Do not open SEO repair from this kit. |
| §7 measurement | `inquiry-ledger.md` + `weekly-review.md` | Unique real qualified inquiries. Ratios only inside measured cohorts. Contact clicks ≠ inquiries. |
| §8 78h | `weekly-review.md` | Proposed hours, not confirmed availability. |
| §9 paid search | `weekly-review.md` §5a | Spend **0** until B/T/C set. No CPC/CPA/ROI invention. |
| §10 TWBA | ledger + partner sheet | No outcome %, no paid case-introduction, no government endorsement. |
| §11 still-needed business facts | ledger pending rows | Block publication of those rows only; do not freeze research. |

## Existing URLs (do not add slugs)

| Route | Role |
|---|---|
| https://tseng-law.com/en | EN home, current baseline: multilingual / International Clients. Fourth home lane implemented locally, awaiting final QA; not deployed. |
| https://tseng-law.com/en/taiwan-lawyer | Overseas company / “Taiwan lawyer” intent. |
| https://tseng-law.com/en/taiwan-company-setup-lawyer | Formation / branch vs subsidiary. |
| https://tseng-law.com/en/taiwan-litigation-lawyer | Supplier / commercial dispute. |
| https://tseng-law.com/en/services/investment | Supporting formation/investment page. Confirm live copy against ledger before citing. |
| https://tseng-law.com/en/contact | Public firm name, Taipei address, email. |

Official consultation email: `wei@hoveringlaw.com.tw`. Firm name: Hovering International Law Firm. Taipei Office: 103, 7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City.

## Source–intent map

Queries are **research candidates**, not volume- or rank-confirmed. Record date, engine, location setting, result type (`weekly-review.md` §1a). No US setting → do not label a generic result as a US rank.

| Intent candidate | Existing connection | Judgment info to strengthen (ledger facts only) | Official reference destination (not eligibility advice) |
|---|---|---|---|
| Taiwan lawyer for an overseas company | `/en/taiwan-lawyer` | Taiwan-law scope; English available; Attorney Tseng / Hovering International Law Firm; conflict and capacity review per matter. | — |
| Taiwan company setup lawyer / Taiwan branch vs subsidiary | `/en/taiwan-company-setup-lawyer`, `/en/services/investment` | Overseas parent structure and business goal; Taiwan entity vs activity; remote vs in-person **only if confirmed**; initial documents after attorney instruction. | [Invest Taiwan — Investment Status](https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus01?lang=eng&menuNum=7&search=InvestmentStatus01) |
| Residence / stay with a Taiwan posting | section of an existing page, not a new slug | Residence **permit assistance** (owner-confirmed). Not a grant promise. Not a new credential. No assumed coordination. | [National Immigration Agency](https://www.immigration.gov.tw/5475/5478/141465/141469/) |
| Taiwan tax / accounting help for a profit-seeking enterprise | section of an existing page, not a new slug | Tax/accounting **assistance** (owner-confirmed). No assumed coordination. Individual credential status unknown internally — omit credential sentences. | [eTax — Profit-Seeking Enterprise Income Tax Q&A](https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/profit-seeking-enterprise-income-tax) |
| Taiwan supplier dispute / unpaid invoice Taiwan | `/en/taiwan-litigation-lawyer` | Counterparty, contract, deadlines, initial review scope. No result promise. | [UK overseas business risk: Taiwan](https://www.gov.uk/government/publications/overseas-business-risk-taiwan/overseas-business-risk-taiwan) |
| hire a Taiwan lawyer from the US | section of the chosen existing guide | Confirmed remote/contact method only. Location optional. Do not collect nationality as required. State Taiwan-law scope; omit unconfirmed credentials. | [US State Dept — Taiwan](https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Taiwan.html) |
| Taiwan company setup legal fees / Taiwan litigation consultation | existing pricing/inquiry links first | Fee **decision method** only until amounts are owner-confirmed for marketing reuse. On-site amounts stay published site text. | — |

Do not clone the same EN article per English-speaking country. UK = comparison research; CA/AU/NZ/SG = later hypotheses. IP-country ≠ nationality ≠ preferred language ≠ target market.

## Company-setup intake (internal)

Align EN mailto (`public-contact.ts`, in tree, not deployed, tests not claimed here) and the first human reply. Do not demand full files or sensitive IDs on first contact.

1. Name or company.
2. Reachable email and phone.
3. Matter area (`company_formation` / `litigation` / `residence_permit_assistance` / `tax_accounting_assistance` / `other_taiwan_law` / pending).
4. Taiwan connection (counterparty, entity, property, residence, or other).
5. Deadline or key dates, if any.
6. Brief overview — no case-file dump.
7. Preferred language (English / Korean / Chinese / Japanese).
8. Location and preferred contact method (**optional**; not nationality).

Do not ask at intake: passport/ID numbers, bank details, original identity documents, full contract dumps, or nationality as a required marketing field.

Sensitive-information rule (verbatim public EN warning):

> For an initial inquiry, please provide only a brief matter or business overview and your contact details. Do not send passport or identification numbers, bank account details, or original identity documents by email or through the general inquiry form. Provide sensitive materials only through a secure method after receiving instructions from the attorney.

Attorney judgment prompts (not public copy): overseas parent vs local entity; branch vs subsidiary; formation vs residence assistance vs tax/accounting assistance vs dispute; whether a Taiwan connection exists. Official sites are destinations, not eligibility findings.

## Readiness (D14 = preparation, not market success, not test-pass)

Mark `drafted` / `implemented-in-tree` / `blocked-pending-fact` / `not-started` / `not-deployed`. Do not write `ready` unless a named test run is attached. Missing measurement ≠ 0.

| Gate | Evidence | Artifact |
|---|---|---|
| Fact ledger | Attorney marks each public EN claim | `source-and-claim-ledger.md` (drafted) |
| Intake path | EN mailto fields in `public-contact.ts` | implemented-in-tree; not deployed; tests not claimed here |
| Inquiry ledger | CSV + independent rules; no identifiers; both sources kept | `inquiry-ledger.csv`, `inquiry-ledger.md` |
| Visit pull / intent report | `pull-visit-metrics.mjs`; `report-intent-routes.ts` | implemented-in-tree; run only with token; tests not claimed here |
| First reply | Official email; no SLA/fee/outcome; no unconfirmed credential lines | `en-first-reply.md` — **not sent** |
| Partner 1-pager | Confirmed facts + address + `wei@hoveringlaw.com.tw`; no government endorsement | `partner-sheet.md` |
| AIT / UK drafts | Relevance only; listing window unverified | `pitch-drafts.md` — **not sent** |
| Channel table | `confirmed` / `unverified` / `not-fit`; no fake sends | `channel-candidates.md` |
| Weekly review | Dated sheet; missing shown as missing; optional AI + US-search + paid-pilot blocks | `weekly-review.md` |
| SEO | No marketing-ops edits | measured Sep7 baseline |

Usability check (plan §7): three consenting non-clients. Same misunderstanding by two people → fix copy. Three passes ≠ conversion proof. If unrecruitable: **not performed**.

## Runbook (weekly, no new systems)

1. **Facts first.** Ledger `pending` / `do-not-publish` stays out of replies, pitches, and the partner sheet.
2. **Pull visits** when token exists: `node scripts/pull-visit-metrics.mjs --days 35`. Else “metrics pull unavailable.”
3. **Optional report:** `npx --no-install vite-node --config vitest.config.ts scripts/report-intent-routes.ts metrics-local/visits/summary/<YYYY-MM-DD>.json` (one DailySummary file per run; four EN entry paths). Not a test-pass claim.
4. **Contact clicks ≠ inquiries.** `email_compose` is observed intent. Ledger rows are received messages after `record_kind` + dedup.
5. **Rates only inside measured cohorts.** Per reported row, `sessions === trackedSessions` or **no rate**. Zero/missing → no rate. Not a total-visitor population ratio.
6. **Fill the inquiry ledger** (`inquiry-ledger.md`). Keep `traced_source` and `self_reported_source` even when they conflict. Qualification ≠ conflict ≠ capacity. No freeform case notes.
7. **Fill `weekly-review.md`.** No console access → that phrase, not 0. Optional §1a / §1b / §5a if time exists.
8. **Distribution research only** unless a later authorization exists. Activity ≠ acquisition.
9. **Hours** vs 78h. Case work excluded. Overrun cuts artifacts.
10. **Stop rules** as in plan §7 (demand not decidable if exposure is missing; path-level pause; immediate withdraw of unperformable published promises). W4/W8/W12 decisions without pretending statistical proof.

## What this kit does not do

- Contact AIT, UK posts, AmCham, or any person.
- Deploy, add routes/slugs, or US-only public targeting copy.
- Change fees, invent SLAs, or claim results.
- Publish unconfirmed individual credentials (affirmative or negative) or a government endorsement.
- Put customer identities or case contents into analytics.
- Treat IndexNow receipts, model votes, a single qualified inquiry, or an unimplemented test as growth proof or “ready.”
