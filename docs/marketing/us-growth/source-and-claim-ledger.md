# Source-and-claim ledger

Internal fact control for English-language US-growth work. Owner confirmation date: **2026-09-07**. Production baseline: **`5eb435b9`**.

Rule: every public or outreach sentence maps to a row. `pending` and `do-not-publish` are not guessed. Public copy states **confirmed Taiwan-law services**. Individual credential status (any jurisdiction) is **unknown internally** unless a later row says otherwise — omit both affirmative and negative credential claims. Existing EN page prices are **published site text**, not reconfirmed marketing claims. Do not edit those amounts from this kit. No assumed coordination model for residence or tax/accounting assistance.

Status values: `confirmed` | `pending` | `do-not-publish` | `published-site-text-not-reconfirmed`.

## A. Owner-confirmed or public-source (may be stated)

| Claim | Source | Named person / how stated | Status | Public use |
|---|---|---|---|---|
| English-speaking attorneys are available | Owner, 2026-09-07 | Not a named roster beyond the public attorney identity below | confirmed | “English-speaking attorneys are available.” Do not name additional lawyers until listed. |
| Taiwan company formation | Owner, 2026-09-07 | Attorney Tseng / 曾雋崴律師 | confirmed | Taiwan-law formation assistance. Not a days-to-incorporate promise. |
| Litigation across practice areas | Owner, 2026-09-07 | Same | confirmed | Taiwan-law litigation. Each matter still goes through conflict and capacity review (no universal acceptance). Not a result promise. |
| Residence permit **assistance** | Owner, 2026-09-07 | Same | confirmed | Assistance. Not a permit-grant promise. Not a newly obtained individual credential. No assumed coordination model. |
| Tax / accounting **assistance** | Owner, 2026-09-07 | Same | confirmed | Assistance. Not a tax-result promise. No assumed coordination model. |
| No individual **new** credential | Owner, 2026-09-07 | — | confirmed as a non-claim | Do not publish that someone newly obtained a residence or tax credential. |
| No universal case acceptance | Owner, 2026-09-07 | — | confirmed as a non-claim | “Each matter is reviewed for conflict and capacity.” |
| No fee or time promise | Owner, 2026-09-07 | — | confirmed as a non-claim | Omit amounts and SLAs in this kit’s drafts. |
| Firm name Hovering International Law Firm | https://tseng-law.com/en/contact (`site-content.ts` EN contact) | — | confirmed as public | Use this letterhead name. |
| Taipei Office address: 103, 7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City | same | — | confirmed as public | Use on partner sheet. |
| Official consultation email | `src/lib/consultation/public-contact.ts` and /en/contact | mailbox | confirmed | Always `wei@hoveringlaw.com.tw`. |
| Public attorney identity | public-contact + contact page: EN Attorney Tseng; ZH 曾雋崴律師 | Attorney Tseng | confirmed as public label | EN: Attorney Tseng. |
| Current `/en` home is multilingual / International Clients | live public `/en` 2026-09-07 | — | confirmed as current baseline | Do not describe a Korean-centric home defect; that is not the current baseline. |
| Four EN intent routes + 12 reciprocal locale URLs: HTTP 200, self-canonical, index,follow | measured 2026-09-07 | — | confirmed as baseline | Do not speculative-repair robots/canonical/hreflang. Home fourth lane **implemented locally, awaiting final QA**. No deployment. |

## B. Do not publish (unconfirmed, or confirmed non-claims)

| Claim | Why blocked | Status |
|---|---|---|
| A newly obtained individual credential for residence or tax work | Owner: no individual new credential | do-not-publish |
| Universal case acceptance | Owner: no universal acceptance | do-not-publish |
| Affirmative **or negative** individual-credential statements (CPA, US bar, dual qualification, or similar) | Individual credential status is **unknown internally**. Owner did not confirm or deny CPA / US-law ability. Public copy states Taiwan-law services only. | do-not-publish until a confirmed row exists |
| Fee amount / cap / “from NT$…” as a *new* promise in pitches/replies | Owner: no fee promise. On-site FAQ figures stay on-site until a pricing review. | do-not-publish in this kit’s drafts |
| Turnaround / “we reply within n hours or business days” | Owner: no time promise. Who reads EN email is pending. | do-not-publish |
| Outcome, win rate, recovery, permit grant, tax saving | TWBA advertising limits + owner: no outcome promise | do-not-publish |
| Government, AIT, UK, or AmCham endorsement / “recommended by” | No such endorsement | do-not-publish |
| Paid case introduction / bulk directory blasting / auto-comments | Plan §5/§10; not in the default program | do-not-publish |

TWBA advertising-norm pointer (attorney applies per asset): https://www.twba.org.tw/regulation/morale/fc625c0d-4ac2-4e3a-b2df-6de1cd655a24

## C. Pending — named people, capacity, process (do not invent)

| Unknown | Needed for | Status | If asked before confirmation |
|---|---|---|---|
| Who receives the EN consultation email, and who replies | First-reply signer beyond the mailbox | pending | Mailbox `wei@hoveringlaw.com.tw`; keep `[reviewing attorney]` |
| Phone number | Partner sheet / replies | pending (not sourced on the contact extract used here) | Optional placeholder only; omit if still unsourced. Do not invent. |
| Interpreter / translator staffing model | Extra language-support sentences | pending | Stay with “English-speaking attorneys are available.” |
| In-person and/or video as a standing offer | Reuse of hero/FAQ meeting line | pending | Omit from new drafts |
| Review turnaround | SLA language | pending | Omit |
| Monthly capacity: formation / litigation / residence assistance / tax-accounting assistance | `capacity_ok` | pending | `capacity_ok=pending`; do not advertise openings |
| Individual credential status (any extra license) | Any credential sentence | pending / unknown internally | Omit the sentence |
| Named additional attorneys | Roster | pending | Attorney Tseng as public identity |
| Existing US-related relationships already in hand | Skip cold research | pending | Treat external names as unverified |
| GSC / Bing access | Search layer | **no console access confirmed** 2026-09-07 | Write “no console access”, not 0 |
| Actual hours vs 78h proposal | Schedule | pending | 78h is a proposal |
| Paid-search B, T, C | §9 | pending | Spend 0 until all three are set; no CPC/CPA/ROI invention |

## D. Published EN site text — reuse with care

Report-only versus `/en/pricing` internals (not supplied here). Do not change amounts. Do not paste into partner sheets, pitches, or first replies until reconfirmed.

| Published phrasing | Typical location | Status | Action |
|---|---|---|---|
| Consultations in English, Japanese, and Korean; Chinese also available | EN direct-contact support | English **confirmed**. JA/KO/ZH: existing site fact | New drafts may say English-speaking attorneys are available. Do not add a four-language staffing promise to AIT/UK pitches. |
| NT$3,000 per hour; company setup from NT$50,000 | EN `taiwan-lawyer` / `taiwan-litigation-lawyer` FAQ (as flagged) | published-site-text-not-reconfirmed | Do not copy into this kit’s drafts. |
| “around three months” | EN `taiwan-company-setup-lawyer` FAQ | pending attorney confirm; already hedged on-page | Do not repeat in new drafts. |
| “in person or by video” | EN hero / FAQ | pending owner confirm | Do not repeat in new drafts. |
| “we will tell you plainly when a claim is not worth pursuing” | EN litigation FAQ | pending attorney tone confirm | Do not repeat in new drafts. |
| Korean-case columns via intent `columnSlugs` | intent pages | leave as-is | Do not delete; do not turn into a US win-rate story. |

EN intent pages already address overseas parents/counterparties. Current `/en` is multilingual / International Clients. Do not add US-only targeting copy.

## E. Measurement facts vs non-facts

| Item | Status |
|---|---|
| Complete traffic / inquiry / engagement baseline | not established 2026-09-07 |
| GSC / Bing | no console access confirmed |
| Partial 9/1–4 daily notes from a prior handoff | incomplete; do not impute 0 to rank countries |
| IndexNow receipt count | not ranking or qualified-inquiry evidence |
| `src/data/intent-pages.ts`, `src/components/IntentLandingPage.tsx`, `src/lib/consultation/public-contact.ts`, `src/lib/metrics/intent-route-report.ts`, `scripts/report-intent-routes.ts` | implemented **in tree**; tests not claimed here; **not deployed** |
| Home fourth lane | implemented locally, awaiting final QA (Fable ACCEPT; build compiled; not deployed; no empirical results) |
| Consumer AI / MCP path | observe separately if at all ([Google AI features](https://developers.google.com/search/docs/appearance/ai-features)); not a ranking tactic |

## F. Official reference destinations (not firm claims)

Agency rules, not eligibility advice, not an appointment of this office.

- Invest Taiwan, Investment Status: https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus01?lang=eng&menuNum=7&search=InvestmentStatus01
- National Immigration Agency: https://www.immigration.gov.tw/5475/5478/141465/141469/
- eTax, Profit-Seeking Enterprise Income Tax Q&A: https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/profit-seeking-enterprise-income-tax
- US State Dept, Taiwan: https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Taiwan.html
- UK overseas business risk, Taiwan: https://www.gov.uk/government/publications/overseas-business-risk-taiwan/overseas-business-risk-taiwan
- Firm contact page: https://tseng-law.com/en/contact
