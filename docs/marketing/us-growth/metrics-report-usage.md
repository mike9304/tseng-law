# Intent-route metrics report

Local summary reporter for selected intent entry paths. It reads one already-rolled daily summary JSON file. It does not collect events, call the network, read secrets, or estimate qualified leads.

## Command

```bash
npx --no-install vite-node --config vitest.config.ts scripts/report-intent-routes.ts <summary.json>
```

Optional flags:

- `--locale en` — `ko` | `zh-hant` | `en` | `ja` (default `en`)
- `--paths /en,/en/taiwan-lawyer,/en/taiwan-company-setup-lawyer,/en/taiwan-litigation-lawyer`
- `--json` — accepted and redundant; stdout is always JSON
- `--help`

The file argument must be an explicit local JSON file such as `metrics-local/visits/summary/<YYYY-MM-DD>.json`. Arrays (raw events / jsonl) are rejected. Invalid path, missing file, or malformed summary exits non-zero.

Default EN paths:

- `/en`
- `/en/taiwan-lawyer`
- `/en/taiwan-company-setup-lawyer`
- `/en/taiwan-litigation-lawyer`

## Missing data vs absent paths

- `cohortDataStatus: "unavailable"` and `rows: []` means `acquisitionCohorts` was undefined on the summary (legacy / old rollup). That is **not** zero traffic and **not** zero success.
- When cohort data is present, every selected path is listed. `observation: "absent-from-selected-paths"` with zeros means that path had no matching locale+entry cohort that day. That is distinct from missing cohort data.
- Paths not in `--paths` are excluded even if the summary has sessions for them.

## Rates and coverage

- `ratioAllowed` is false when cohort data is missing, when there are no rows, when any row has `trackedSessions !== sessions`, or when every selected path has a zero session denominator. An empty row list is **not** treated as complete (`[].every(...)` would otherwise be true).
- `intentRate` is emitted only when `ratioAllowed` is true **and** that row's session denominator is greater than zero. Otherwise it is `null`.
- `observedTrackingCoverage` is `trackedSessions / sessions` within **observed** sessions only. It is not population coverage. DNT, blocked beacons, and other unobserved sessions are outside this denominator.
- Do not compute an intent rate when `ratioAllowed` is false.

## Fields that are easy to misuse

- `unattributedEvents` is **day-global**, not route-specific (`unattributedEventsScope: "day-global-not-route-specific"`). If `contactIntent` is absent, the value is `null` rather than a fake `0`.
- `byCountryIp` keys are IP-derived country codes from the summary, including `unknown`. They are not nationality.
- Contact email click / `intentSessions` is **not** a qualified inquiry. The JSON includes no qualified-lead estimate. Count received inquiries in the inquiry ledger, not from this report.

## What this command will not do

- Read `.env`, blob tokens, or customer raw event files
- Fetch network data
- Invent zeros for missing rollup fields
- Publish ranking, traffic, or conversion claims
