# Foreign Taiwan matters: acquisition and intake, 2026-09-25

## Decision

Improve the existing four-language `/[locale]/taiwan-lawyer` route before creating more articles or buying traffic. It targets broad “Taiwan lawyer” intent, but its previous first step emphasized email and its service links were dispersed below the introduction. This branch puts six recognizable matter paths near the top and leads to the existing contact form. The form has durable submission handling and a best-effort server-side `inquiry_submitted` event; reconcile event totals with the durable inquiry store. An email click or contact-page visit must not be counted as a received matter.

## Evidence and limits

- Historical internal [weekly log](WEEKLY-LOG.md) records 2026-09-06 GSC 28-day `/en/` 1 click/39 impressions and `/ja/` 0/10. These small counts are a dated baseline, not today's traffic and not evidence of conversion.
- The [SEA plan](../seo/sea-geo-plan/GOAL.md) records a 2026-09-09 28-day six-country baseline of 30 GSC impressions and 2 clicks; the available visit export then covered only 2026-09-01–07 (58 total sessions, 3 SEA sessions, 1 AI-referred session). Its 2026-09-16 weekly check reported 82 impressions and 2 clicks over 7 days, which is a different window. Do not combine these into a growth rate.
- Taiwan's [National Immigration Agency 1990 hotline](https://www.immigration.gov.tw/5475/5478/6928/6940/204896/204917/) covers foreigners' residency, work, legal information and daily-life questions. The [Ministry of Labor's 1955 channel](https://english.mol.gov.tw/21139/21162/21166/21638/) also provides foreign-worker assistance. These establish that general information has public alternatives; they do not measure demand for representation. Focus the firm's offer on a concrete Taiwan-linked matter, deadline and need for legal judgment.
- [Gold Card community rules](https://goldcard.nat.gov.tw/en/community-code-of-conduct/) require respect for privacy and the community. A community presence is not permission for unsolicited case solicitation or posting private facts.
- [Taiwan Bar Association promotion rules](https://www.twba.org.tw/regulation/morale/fc625c0d-4ac2-4e3a-b2df-6de1cd655a24) require lawyer/firm identity and contact details, disallow misleading or exaggerated claims and win-rate claims, and restrict paying someone solely to refer cases. The site and any later distribution should be checked against these rules by the responsible lawyer.

## Audience, offer, route

1. **Time-sensitive individual matters**: work, contract/payment, family and criminal issues with a Taiwan connection. Search intent can be specific and urgent. Offer a clear path to an existing service page and a brief first inquiry, without promising response speed or acceptance.
2. **Foreign founders and companies**: company setup, investment and commercial disputes. Existing investment/civil pages carry the detail; the router clarifies the first click. A later business-specific campaign needs actual search-query and inquiry evidence.
3. **Residence/immigration questions**: ask whether the firm can assist through `/contact`; the repo has no dedicated immigration service. Do not advertise a specialist service or assume every public-information question is a legal case.

The contact flow asks for only an issue summary, Taiwan connection, deadline and reply channel. Suitability and conflicts are checked before scope, fees and consultation are confirmed. Sensitive documents follow attorney instructions. Consultation languages are **English, Chinese, Korean and Japanese**; translated guidance in other languages does not expand that list.

## Changes implemented in this release branch

- Four localized matter routers on `/{en,ja,ko,zh-hant}/taiwan-lawyer`, each with five existing service destinations and a residence/immigration inquiry path.
- A same-language contact-form action in the EN/JA hero and broad lawyer page closing action; official email remains available as a secondary path.
- Clearer first-inquiry copy for Korean and Traditional Chinese closing sections.
- No new public API, form storage or service claim. The existing durable inquiry store is authoritative for received-form counts; the server-side event is best-effort telemetry.

## Two-week operating loop after live release

| Every Monday | Denominator and interpretation | Action |
| --- | --- | --- |
| GSC by page, locale, country and query | Impressions and clicks over the **same** trailing 7/28-day windows. Neither equals a case. | If relevant impressions are absent, inspect indexing and search snippet; if impressions grow but clicks do not, test title/snippet relevance. |
| Visit events for `taiwan-lawyer` and `/contact` | Unique sessions and contact-page views by locale. Navigation is interest, not submission. | If landing traffic exists but contact views are scarce, inspect mobile routing and copy. |
| `contact_intent`, `inquiry_submitted` and inquiry store | Email-compose events versus best-effort submission events versus **durably saved form inquiries**. Reconcile the event count with the store; record email/phone inquiries manually and deduplicate offline. | If contact views exist without received inquiries, check form failure logs and ask whether intake friction is too high. |
| Lawyer-reviewed lead ledger | Received inquiry → Taiwan-linked → in-scope/conflict-cleared → consultation → retained matter. Denominator is each prior stage; no fabricated conversion rate. | Review which matter categories merit more content. Keep case details out of analytics. |

Capture a new live baseline on release day. Run this loop for two weeks before adding pages or paying for ads. Existing plans for directory outreach and SEA authority contacts remain held by the user's earlier instruction; this site change does not send messages or spend money.

This five-stage lead funnel is a **manual operating plan**. The release does not add cross-page attribution or machine-measured qualification stages. For each received email, phone call or form submission, use the existing `docs/marketing/INQUIRY-LEDGER.csv` with a minimal category and qualification status. Keep names, contact details and case facts in the authorized intake system, not this marketing ledger. The lawyer decides suitability, conflicts and engagement terms; marketing counts alone cannot make those decisions.
