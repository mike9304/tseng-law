# POLICY-MATRIX — MULTILINGUAL-INTERNATIONAL-v2

| Policy | In-repo source | Clause / scope | This candidate |
|---|---|---|---|
| Public locales (9) | `src/lib/public-guidance.ts` `PUBLIC_LOCALES_8` | Routing / chrome | Inventory only; no new locale |
| Core site locales (4) | `src/lib/locales.ts` `siteLocales` | Full pages | EN preserved; JA/KO/ZH-Hant copy + unpublished P07 |
| Guidance locales | `GUIDANCE_LOCALES_4` = vi/id/th/fil/ar | Guidance voice | Two information paths on existing `/services` and `/faq`; no new routes |
| Consultation languages | `src/lib/consultation/intake-language-contract.ts` `CONSULTATION_LANGUAGES` | Inquiry / office | Unchanged: en, zh-hant, ja, ko |
| Inquiry notices | `src/data/international-inquiry-copy.ts` | All inquiry locales | Four-language notice kept; no interpreter/SLA/booking confirmation |
| AR RTL | `src/app/layout.tsx` `dir={direction}`; `RTL_PUBLIC_LOCALES`; `src/lib/__tests__/ar-routing-tier.test.ts` | `/ar` | Regression. Path labels only |
| AR copy range | `src/data/international-guidance-content.ts` `ar` block (WO-M3B published guidance pack) | Existing `/ar` home/services/faq voice | Two path labels matching vi/id/th/fil destinations. **No new MENA country, remittance, or religious-law rules** |
| MENA country rules | `docs/seo/mena-plan/AR-LOCALE-INVENTORY.md`, `docs/seo/geo-mena-baseline-2026-09.md` | Historical MENA lane | Extra country-specific AR legal copy remains **BLOCKED** |
| Preview noindex | `src/lib/seo-visibility.ts` `isGloballyNoindexPath('/taiwan-debt-recovery-lawyer')` | P07 | Globally noindex; empty `alternateLocales` |
| D11/D12 | Home AGENTS / pack | Secrets, live submit | Not touched |
| Agent allowlist | Consultation intake contract | Marketing agents | Not widened |

EN-INTERNATIONAL-v1 “EN-only edit” is replaced, for this project, by the v2 locale table in `/Users/son7/Downloads/tseng-law-multilingual-v2/01_MULTILINGUAL_PLAN.md` §3.
