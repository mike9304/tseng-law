# Traffic hub publication review — 2026-09-30

Release candidate: `feat/traffic-hub-20260930`, based on `636a65f2`. Production remains unchanged. This records AI editorial/source and implementation reviews, not licensed-attorney approval.

## Content corrections and source basis

- New 049 police-records article: four locales independently reviewed against NPA request timing, national portal eligibility, accident-response duties and representation rules. The canonical [NPA FAQ](https://www.npa.gov.tw/ch/app/faq/view?id=2144&module=faq&serno=A1084129) replaces its intermittently failing CDN address. Country guidance accurately scopes California and separates accident jurisdiction from language.
- Existing 003 Q2: [NFA emergency guidance](https://www.nfa.gov.tw/cht/?code=list&ids=66) distinguishes direct police 110, rescue 119 and mobile 112 routing (0 to police, 9 to rescue) when direct calls cannot connect. Four locales now preserve this distinction.
- Existing 003 Q6: [current consolidated appraisal rules](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040045), Articles 3/10/11, support ordinary application and one-review rules, including the ordinary direct-review period of 30 days from the day after receipt. Judicial referrals need their own route/deadline assessment. [Criminal Procedure Code Article 208](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=208) separately permits qualifying institutional appraisal commissioned by a trial party at that party's expense.
- Research version check: the consolidated appraisal rules still show the 2019 revision. The 2025 Gazette item found in search is a draft; the mvdis PDF contains older text despite recent search metadata. Neither was treated as proof of an enacted 2025 change.
- Existing 003 Japanese Q15: third-party liability is now translated to cover both bodily injury and property, matching the [FSC model policy](https://law.fsc.gov.tw/LawContent.aspx?id=FL047990).
- Existing 003 Q3/Q16–20: limitation-defense wording, prosecution before attached civil proceedings, conditional fine conversion, withdrawal cutoff/no refiling, settlement scope, injury/death scope of fleeing-the-scene offense, and practical insurer/lawyer questions. Removed unsupported typical sentences, insurer stereotypes and result guarantees. Sources are inline and in `taiwan-sources.md`.
- Existing 012: original case narrative appears in imported author content at `46c0f8a3`. Later edits added an unsupported list of findings supposedly considered by the private appraisal. That list and unverified firm-handled assertions are removed in all four languages; the result is explicitly attributed to the original account. The remaining “one omitted signal” sentence now consistently says “any single factor.” The [Article 101](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=101) explanation and general factors remain. This provenance check does not independently verify private case records.

- Existing 003 final corrections: Article 503 explicitly distinguishes acquittal, barring prosecution and declining to entertain; plaintiff-requested civil transfer in these cases carries fees. Q1 says all parties and preserves the duty to move marked vehicles when the statutory conditions apply. Q5 consistently limits the no-refiling rule to the person withdrawing. ZH Q15 says accidents **before** 2026-07-01, avoiding an inclusive boundary-date contradiction.
- Current [FSC benefit standard](https://law.fsc.gov.tw/LawContent.aspx?id=FL006901), Articles 2/3/6/7/9: medical maximum TWD 200,000; disability TWD 80,000–3,000,000; death TWD 3,000,000; combined statutory maximum TWD 3,200,000; amendment effective 2026-07-01. [Compulsory insurance Act Article 27(3)](https://law.fsc.gov.tw/LawContent.aspx?id=FL006889) supports applying revised standards by accident date. Primary agent opened these live official texts on 2026-09-30.

## Independent reviews

- Taiwan research lane: 012 editorial PASS after attribution correction; 003 final Q2/Q6/JA Q15 issues identified and addressed. No other concrete material blocker identified in the reviewed Q1–15 scope.
- International/content lane: hub and 049 in four locales PASS; captions match actual image, no nationwide US rule or foreign-practice promise.
- Implementation review lane: no blocking defect or test weakening identified. Statutory rules, known case sequence, conditional safeguards and corpus/route coverage are retained. Tests now also reject invented appraisal attribution and protect new emergency/deadline distinctions.
- Actual Fable 5.1 review: **APPROVE (editorial text only)** on the targeted final pass. Model identity `claude-fable-5-1`/firstParty verified in CLI `modelUsage`. Rounds 1 and 2 requested changes; their findings were corrected before round 3. See `fable-round1.md`, `fable-round2.md`, `fable-round3.md`. The reviewer did not browse sources or run the application; source checks and runtime checks are separately evidenced here. No licensed-attorney approval is claimed.
- Final implementation review: date-only normalization prevents the new 049 article showing a same-day update. Eight browser journeys verify the new byline, old articles’ 2026-09-30 update labels, and the Q3 deadline anchor popup. No remaining implementation blocker was identified.

## Local validation

- Final full unit suite: **1,352 files / 13,138 tests passed**, 14 skipped, 1 todo; exit 0. Log: `/tmp/traffic-all-tests-candidate.log`. This final run includes all editorial corrections, the Q6 reference range, and normalized article update dates.
- Development browser: **8 journeys / 0 findings**, four locales × desktop/mobile; checked actual navigation, all three article bodies, bylines and update dates, Q3 anchor popup, responsive image decoding, no overflow and React console errors. Reproducible script: `scripts/qa-traffic-hub.mjs`; report: `browser-qa.json`.
- Blender source WebP: **51,090 bytes**. First image transfer at tested local viewports: **14,182 bytes desktop / 4,402 bytes mobile**. No runtime 3D, video or canvas. These are image measurements, not production whole-page performance claims.

- Full ESLint and production build (including TypeScript validation): **PASS**, exit 0. Logs: `/tmp/traffic-lint-candidate.log`, `/tmp/traffic-build-candidate.log`. Only the existing ContactEditorial CSS compatibility warning remains.

## Release and production verification

1. Close final gates on this candidate; record actual Fable result and model identity.
2. Commit only the reviewed traffic scope; use clean committed source for the final release build.
3. Respect project `AGENTS.md` publication instruction: `push 는 사용자 확인 받고`. Approval must concern this concrete candidate.
4. Recheck remote main before a fast-forward publication; resolve intervening changes without overwriting others.
5. Verify four live hub URLs, three article journeys per locale, actual corrected 003/012 text, 049 AI byline, language switching, sitemap/canonical and optimized image requests. Use `TRAFFIC_QA_BASE=https://tseng-law.com node scripts/qa-traffic-hub.mjs`.
6. If production serves a stored override, snapshot published/draft values before any scoped reconciliation; never publish an unrelated draft wholesale. Read-only checks currently show no configured-store override for 003/049. No CMS mutation is planned.

The live site is not complete until deployment and these public checks succeed.
