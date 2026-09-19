# CLAIM-REGISTER — MULTILINGUAL-INTERNATIONAL-v2

Status of new/substantive copy: `NEEDS_LAWYER_REVIEW`. Existing review badges are not inherited.

| claim_id | kind | claim | applies | exception | locales | source | confirmed |
|---|---|---|---|---|---|---|---|
| C-CONSULT-4 | consultation-language | Office consultations: English, Chinese, Japanese, Korean | all public pages | page language ≠ consultation language | all 9 | `src/lib/consultation/intake-language-contract.ts` | 2026-09-17 |
| C-TW-ENTITY | Taiwan-law fact | Subsidiary / branch / representative office are distinct Taiwan forms | general company-setup info | none | en/ja/ko/zh-hant | existing columns 001 | in-repo |
| C-TW-KR-DTA | country exception | Taiwan–Korea income tax agreement in force 2023-12-27, applies 2024-01-01; 10% cap for qualifying dividends/interest/royalties | Korean-related facts only | not a Japan treaty | ja column 001 §1/§5 (labeled 韓国関連); ja/ko/zh-hant guide | MOF https://www.mof.gov.tw/eng/singlehtml/f48d641f159a4866b1d31c0916fbcc71?cntId=e1e57a4211474ff9b5d63a83b30dcf10 | 2026-09-17 (Fable/Opus 5) |
| C-KR-REMIT | country exception | Korean-bank remittance / outbound-investment reporting | funds from Korea | not a worldwide remittance rule | ko guide (kept); ja/zh-hant countrySpecific | existing public columns | in-repo |
| C-CASE-GYM | case | Korean student gym injury first-instance TWD 1,579,589 | that case | nationality not rewritten | ko/zh-hant/en civil | existing service-details | in-repo |
| C-P07-FIVE | business process | Five commercial situations: unpaid, prepaid-undelivered, defective/inspection, delay/breach, silence | unpublished P07 | no auto-fraud, guaranteed win, recovery %, full remote | en/ja/ko/zh-hant | `debtRecoveryByLocale` | 2026-09-17 |
| C-ZH-DUAL | reader premise | ZH-Hant investment page names Taiwan-domestic firms and foreign investors (including Korean companies) | ZH-Hant P04 | does not delete Korean-language capability elsewhere | zh-hant | `service-details.ts` | needs lawyer review (V2-16) |
| C-NO-GUARANTEE | process | No promised win, recovery rate, interpretation, SLA, or booking confirmation | all new copy | — | all | tests `FORBIDDEN_GUARANTEE_PATTERNS` | 2026-09-17 |

English is not the legal original. Taiwan official sources + lawyer review remain the resolution path.
