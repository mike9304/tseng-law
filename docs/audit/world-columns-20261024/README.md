# World columns — 35 languages, 2026-10-24

User direction (2026-10-24): the site's other languages should get columns that readers in each country would actually look for — adapt existing columns slightly or write new ones — and publish them. Conductor: Claude (Opus 5.5). Workers: Codex GPT-6 Astra on the Mac Studio and on the MacBook Air, Sonnet 5.5, and Grok 4.7 as an additional reviewer. These are AI editorial roles; no human native-speaker or attorney review is claimed.

## What changed

1. 105 new columns, three for each of the 35 guidance locales that until now carried only the shared translations 001–018 (fil and zh-hans also 019–023): fil, zh-hans, ms, my, km, mn, ne, bn, ur, fa, ta, nl, sv, da, nb, fi, is, ca, el, he, tr, ru, uk, pl, cs, sk, hu, ro, bg, hr, sr, sl, lt, lv, et. Numbers 801–905, `audience: ["<locale>"]`, internal author `legal-ai-assistant`, published 2026-10-24. Each article answers a Taiwan-law question tied to that country's actual link with Taiwan (trade, investment, work and study, marriage, inheritance, traffic, police), e.g. Greek shipowners enforcing an arbitral award, mainland heirs under the Cross-Strait Act, Cambodian spouses after Cambodia left the marriage-interview list, Filipino caregivers when the care recipient dies, working-holiday rules for Poland/Czechia/Slovakia/Hungary/Netherlands.
2. Shared columns 007/008/009 in 45 non-core locales: comparisons with Korea removed (89 files; `shared-localization/CHANGES-*.md` records every original and replacement sentence). Taiwan legal statements unchanged.
3. Boards: the 35 locales follow the 2026-10-24 market-board rule (`src/data/market-column-curation.ts` `WORLD_BOARD_LOCALES`): own columns first, the 13 shared translations that do not assume a Korean reader, and no list of untranslated Korean titles. Shared columns 001, 004, 005, 006 and 010 keep their URLs and sitemap entries. Recommended-section titles added for 33 locales (`src/lib/column-audience.ts`). vi is unchanged.

## Process and evidence

- `briefs/`: author brief, per-language assignments (topic codes and structural source columns), image menu (existing repository images only, alt text translated from the listed description), review brief, research and shared-localization tasks.
- `research/country-facts.md`: 40 countries × 7 fact families (visa-free entry, working holiday, tax agreement, overseas marriage interview, Land Act art. 18 reciprocity, migrant-worker source country, licence recognition) with official URLs and quotes, checked 2026-10-24. The conductor re-checked samples against the live BOCA visa-exempt list, the MOFA working-holiday list and the MOF tax-agreement table; all matched.
- `authors/`: each author's claim → statute table with the Chinese text checked, first-two-paragraph deletion test, comparison with existing same-language columns, and statements dropped because they could not be verified.
- `reviews/`: independent cross-model reviews. Sonnet-authored (fil … ta) → Codex reviewer (`codex-*`), which re-fetched every cited article; Codex-authored (nl … et) → Grok 4.7 (`grok-*`), given the statute texts and the country's ledger rows inline. A fresh Sonnet reviewer re-checked two Grok-passed languages (pl, he) as calibration and also passed all six articles (`sonnet-*`).
- `repairs/`: every MUST item answered ACCEPTED (old → new) or REBUTTED. A few single-sentence fixes were applied by the conductor exactly as the reviewer proposed after checking the statute (km 815 Land Act art. 17(2), mn 817 Foreign Professionals Act art. 12, fil 802/803 Permit Regs art. 66(5) and ESA art. 74(2), ms 807 Permit Regs art. 51(2)(1)); they are logged as `*-repair-r2.md`.
- `manifest.json`: sha256 of each published file, whether it equals the reviewed draft, its review and repair files and final status.

Automated gate (task-local `gate.mjs`) on all 105: required frontmatter, audience, topic, categories string identical to the locale's existing columns, three FAQ entries, no bold or H1, slug unique across the site, internal links resolve to existing same-locale columns, every law.moj.gov.tw link's article exists, image file exists, official sources section last, firm email present and no phone numbers.

## Limits

- The shared sentence-variety CLI supports ko/ja/en/zh-hant only; authors used proxy profiles or their own measurements, which are not native-language validation.
- Reviewers' confidence in idiom is limited for several languages (stated in the reviews). Legal citations, numbers and conditions were checked against statute text.
- Some official pages could not be read during research (e.g. Highway Bureau licence-reciprocity list behind a CAPTCHA); articles do not assert facts that depend on them.
