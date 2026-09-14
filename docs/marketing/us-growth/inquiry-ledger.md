# Inquiry ledger — dictionary and independent rules

File: `inquiry-ledger.csv`. Internal operations. **Not a CRM.** Confidential matter files stay in the office matter system. This CSV is the marketing/operations count file. No freeform notes column: nothing in this file is case content, identifiers, or narrative.

Primary business metric (plan §7): **unique `inquiry_id` rows** with `record_kind=real`, empty `duplicate_of`, and `qualified=Y`. Qualification, conflict, and capacity are independent. Later conflict or capacity refusal does **not** unset a qualification already recorded.

## Hard bans

- No client names, emails, phones, companies, court file numbers, or other identifiers.
- No case narrative, allegations, contract clauses, attachment names, or freeform “notes.”
- No passport/ID/bank data.
- Nationality is not a required marketing field. `country_self_reported_optional` is self-reported **location country** only, never labelled nationality, never overwritten by IP-country.
- `contact_intent` / `email_compose` clicks are **not** rows. Observed contact clicks stay in visit reports only.

## Column dictionary

| Column | Allowed values | Meaning |
|---|---|---|
| `inquiry_id` | `INQ-YYYYMMDD-NN` (NN = `01`,`02`,… per office date). Unique; never reused | Opaque join key. Not a court or client number. Assigned only after confidential inbox inspection, never from a VisitTracker session id. |
| `received_at` | ISO `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM+08:00` | When the office **received** the message. Not a mailto click. Cohort week = this timestamp. |
| `record_kind` | `real` `test` `spam` | What the row is. Unique-qualified metric uses `real` only. |
| `duplicate_of` | empty, or another `inquiry_id` | Empty = survivor / unique. Non-empty = this row is a duplicate of that id. Both rows kept. |
| `entry_route_if_known` | live path (`/en`, `/en/taiwan-lawyer`, `/en/taiwan-company-setup-lawyer`, `/en/taiwan-litigation-lawyer`, `/en/services/investment`, `/en/contact`, other live path) or `unknown` | Known landing. Never guessed from IP. |
| `traced_source` | `organic_search` `referral` `partner` `direct` `email` `paid_search` `unknown` | From VisitTracker / UTM / referrer when a path exists. If missing: `unknown`. Never overwrite `self_reported_source`. |
| `self_reported_source` | same enum | What they said, mapped to the enum; if they said nothing or it will not map: `unknown`. Never overwrite `traced_source`. |
| `source_conflict` | `Y` `N` | `Y` when **both** sources are not `unknown` and they differ. Keep **both** cells as-is. `N` otherwise (including both unknown). |
| `country_self_reported_optional` | short location they volunteered, empty, or `unknown` | Optional. Do not backfill from IP. |
| `language` | `en` `ko` `zh-hant` `ja` `other` `unknown` | Inquiry or requested consult language if clearly stated. |
| `matter_area` | `company_formation` `litigation` `residence_permit_assistance` `tax_accounting_assistance` `other_taiwan_law` `not_taiwan_law` `pending` | One primary area. Residence and tax/accounting are **assistance** (owner-confirmed). Do not assume a coordination model. |
| `qualified` | `Y` `N` `pending` | Independent of conflict and capacity. |
| `qualified_at` | empty, or ISO datetime | Set when `qualified` first becomes `Y` or `N`. Leave empty while `pending`. Do not clear later. |
| `conflict_check` | `clear` `conflict` `pending` | Independent. |
| `capacity_ok` | `Y` `N` `pending` | Independent. Area-level monthly capacity is still a pending **number** as of 2026-09-07 — default `pending`. |
| `capacity_checked_at` | empty, or ISO datetime | Set when `capacity_ok` first becomes `Y` or `N`. |
| `paid_consult` | `Y` `N` `pending` `not-offered` | Office rule (actual consult billed/held). Not a click. |
| `paid_consult_at` | empty, or ISO datetime | Required when `paid_consult=Y`. |
| `engaged` | `Y` `N` `pending` | Office rule (actual acceptance/contract). Not a qualified-inquiry proxy. |
| `engaged_at` | empty, or ISO datetime | Required when `engaged=Y`. |
| `closed_at` | empty, or ISO datetime | Set when the marketing row closes. |
| `closed_reason` | empty while open; else `duplicate` `spam` `test` `not_taiwan_law` `out_of_scope` `conflict` `no_capacity` `no_response` `declined_by_client` `engaged_elsewhere` `other` | Close code only. Duplicate also requires `duplicate_of`. |

Stage dates support cohort and maturity: a row is **immature** while `qualified=pending`, or while `qualified=Y` and `closed_at` is empty and later stages are still `pending`. Do not treat immature rows as demand failure. Paid consult / engagement this week is reported **by intake cohort** (`received_at` week), using `paid_consult_at` / `engaged_at` for when the stage happened.

## Dedup (exact)

1. Every row has a unique `inquiry_id`. Never reuse. Never take the id from VisitTracker.
2. Confidential inbox decides whether two messages are the same person/thread. This file stores only ids.
3. First surviving **real** inquiry of a thread: `record_kind=real`, `duplicate_of` empty. That id is the unique inquiry.
4. Extra rows for the same thread (mis-keys, follow-ups logged by mistake): **still insert** with a new unique `inquiry_id`, set `duplicate_of` to the survivor, keep `record_kind` of the underlying message. Unique counts **exclude** any row with `duplicate_of` filled.
5. A follow-up on the same matter is not a new unique inquiry: no row, or a row with `duplicate_of` set.
6. Two different people: two unique ids, both `duplicate_of` empty. `conflict_check` may later record `conflict`.
7. Outbound mail we send is not a row.
8. `record_kind=test` or `spam`: unique `inquiry_id`; `duplicate_of` empty unless it duplicates another test/spam row. They never enter the unique-qualified metric, even if someone set `qualified` in error (if that happens, set `qualified=N` and `closed_reason=test` or `spam`).
9. Unique-qualified metric = rows where `record_kind=real` AND `duplicate_of` is empty AND `qualified=Y`.

## Source pair (preserve both)

- Always fill `traced_source` and `self_reported_source` (use `unknown` rather than blank).
- If they differ and neither is `unknown`: `source_conflict=Y`. **Do not** drop, merge, or overwrite either value. Do not store the conflict “elsewhere.”
- Email-compose clicks are visit `contact_intent` events. They do not create rows and they are not received inquiries. A later received email may have `traced_source` from the visit path and a different `self_reported_source`; keep both.

## Qualification (independent of conflict and capacity)

`qualified=Y` only when **all** are true:

1. `record_kind=real` and `duplicate_of` empty.
2. The request concerns **Taiwan law** in a matter area this office’s confirmed services cover (formation, litigation, residence-permit assistance, tax/accounting assistance, or other Taiwan-law work on the ledger).
3. There is a Taiwan connection, or enough facts to see one is claimed (counterparty, entity, property, residence, or other). No Taiwan-law connection → `N` and `matter_area=not_taiwan_law` or `closed_reason=out_of_scope` as fits.
4. A working follow-up channel exists. Missing nationality does **not** disqualify.

Insufficient facts → `pending` (leave `qualified_at` empty), not a guessed `Y`. Do not require budget, citizenship, US residency, or a document set.

`conflict_check=conflict` or `capacity_ok=N` may close the row (`closed_reason=conflict` or `no_capacity`) while leaving `qualified=Y` and `qualified_at` unchanged.

## Conflict (independent)

Default `pending` until the reviewing attorney records `clear` or `conflict` on the confidential file. No conflict facts in this CSV.

## Capacity (independent)

Default `capacity_ok=pending` until an attorney records that this matter can or cannot be taken this period; then set `capacity_checked_at`. `capacity_ok=N` is a resource decision, not a demand-failure. Do not publish a monthly “we are taking new X clients” line while area capacity is still pending as a number.

## VisitTracker vs this CSV

| Signal | What it is | What it is not |
|---|---|---|
| pageview on an EN intent path | visit | inquiry |
| `contact_intent` `email_compose` | observed contact click | received inquiry |
| `pull-visit-metrics.mjs` / `reportIntentRoutes` | visit rollup; `country` = **IP-country** | nationality; not a ledger row |
| this CSV | identity-stripped received matters | analytics event stream |

Ratios: equality of `sessions` and `trackedSessions` is judged **per measured acquisition-cohort row**, not against the total visitor population. Zero or missing on a row → **no rate** for that row (do not write 0%).
