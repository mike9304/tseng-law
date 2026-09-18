# LOCALE-PAGE-MAP — MULTILINGUAL-INTERNATIONAL-v2

Cells are existing URL, integrated section, GAP, or BLOCKED. Prefix substitution was not used to invent URLs.

| locale | role | actual_url | source_path | page_kind | status |
|---|---|---|---|---|---|
| en | P00 | `/en` | `HeroSearch` + `LocaleHomePathNav` | existing | unpublished candidate paths |
| en | P01 | `/en/guides/taiwan-company-setup` | `guides/taiwan-company-setup/content.ts` | existing | EN-v1 preserved |
| en | P02 | `/en/taiwan-company-setup-lawyer` | `src/data/intent-pages.ts` | existing | engagement |
| en | P03 | `/en/columns/taiwan-company-establishment-basics` | `src/content/columns-en/001-…md` | existing | EN-v1 preserved |
| en | P04 | `/en/services/investment` | `src/data/service-details.ts` + page | existing | info/engagement links |
| en | P05 | `/en/taiwan-litigation-lawyer` | `IntentLandingPage` situation nav | existing | P07 link |
| en | P06 | `/en/services/civil` | `CivilCommercialBlock` | existing + section | commercial + injury |
| en | P07 | `/en/taiwan-debt-recovery-lawyer` | `taiwan-debt-recovery-lawyer/` | unpublished | noindex |
| ja | P00 | `/ja` | `LocaleHomePathNav` | existing | two consult paths |
| ja | P01 | `/ja/guides/taiwan-company-setup` | guide `ja` + country-specific | existing | info vs 相談 |
| ja | P02 | `/ja/taiwan-company-setup-lawyer` | intent-pages ja | existing | engagement |
| ja | P03 | `/ja/columns/taiwan-company-establishment-basics` | `columns-ja/001-…md` | existing | Japanese-reader intro; DTA labeled 韓国関連 |
| ja | P04 | `/ja/services/investment` | `service-details-ja.ts` | existing | Korea remittance as exception |
| ja | P05 | `/ja/taiwan-litigation-lawyer` | IntentLandingPage | existing | P07 link |
| ja | P06 | `/ja/services/civil` | CivilCommercialBlock | existing + section | injury/traffic preserved |
| ja | P07 | `/ja/taiwan-debt-recovery-lawyer` | `debtRecoveryByLocale.ja` | unpublished | one review version |
| ko | P00 | `/ko` | LocaleHomePathNav | existing | two consult paths |
| ko | P01 | `/ko/guides/taiwan-company-setup` | guide `ko` | existing | Korean strengths kept |
| ko | P02 | `/ko/taiwan-company-setup-lawyer` | intent-pages ko | existing | 의뢰 |
| ko | P03 | `/ko/columns/taiwan-company-establishment-basics` | `src/content/columns/` | existing | unchanged Korean-reader column |
| ko | P04 | `/ko/services/investment` | service-details ko | existing | Korean-client intro kept |
| ko | P05 | `/ko/taiwan-litigation-lawyer` | IntentLandingPage | existing | P07 link |
| ko | P06 | `/ko/services/civil` | CivilCommercialBlock | existing + section | gym-injury case kept |
| ko | P07 | `/ko/taiwan-debt-recovery-lawyer` | `debtRecoveryByLocale.ko` | unpublished | one review version |
| zh-hant | P00 | `/zh-hant` | LocaleHomePathNav | existing | two consult paths |
| zh-hant | P01 | `/zh-hant/guides/taiwan-company-setup` | guide zh-hant | existing | 台灣本地 vs 外國投資人 |
| zh-hant | P02 | `/zh-hant/taiwan-company-setup-lawyer` | intent-pages | existing | 諮詢 |
| zh-hant | P03 | `/zh-hant/columns/…` | `columns-zh/` | existing | unchanged |
| zh-hant | P04 | `/zh-hant/services/investment` | service-details zh-hant | existing | dual-track intro |
| zh-hant | P05 | `/zh-hant/taiwan-litigation-lawyer` | IntentLandingPage | existing | P07 link |
| zh-hant | P06 | `/zh-hant/services/civil` | CivilCommercialBlock | existing + section | 韓國留學生案 kept |
| zh-hant | P07 | `/zh-hant/taiwan-debt-recovery-lawyer` | `debtRecoveryByLocale['zh-hant']` | unpublished | one review version |
| vi | P00 | `/vi` | GuidanceHomeBody | existing | two info paths |
| vi | P01 | `/vi/services` | international-guidance-content vi | integrated | no new route |
| vi | P02–P07 | GAP | inquiry `/vi/contact`; no P07 | GAP | no new P07 |
| id | P00 | `/id` | GuidanceHomeBody | existing | two info paths |
| id | P01 | `/id/services` | guidance content | integrated | no new route |
| id | P02–P07 | GAP | existing | GAP | no new P07 |
| th | P00 | `/th` | GuidanceHomeBody | existing | two info paths |
| th | P01 | `/th/services` | guidance content | integrated | no new route |
| th | P02–P07 | GAP | existing | GAP | no new P07 |
| fil | P00 | `/fil` | GuidanceHomeBody | existing | two info paths |
| fil | P01 | `/fil/services` | guidance content | integrated | no new route |
| fil | P02–P07 | GAP | existing | GAP | no new P07 |
| ar | P00 | `/ar` | GuidanceHomeBody + existing `dir` | existing | two info paths; RTL inventory |
| ar | P01 | `/ar/services` | existing ar pack | integrated | no new route |
| ar | P02–P07 | GAP | existing | GAP | extra MENA legal copy BLOCKED |

hreflang: `fil` stays `fil` (not `tl`); `ja` stays `ja` (not `jp`); `zh-hant` → `zh-Hant`.
de/es: not in this branch HEAD; 404 here. Reintegration is V2-17 (pre-deploy).
