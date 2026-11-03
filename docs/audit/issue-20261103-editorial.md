# ISSUE-20261103 editorial audit

Date: 2026-11-03, Asia/Seoul. Scope: eight original daily-news articles, eight generated photo scenes with paired WebP/JPEG renditions, and one batch test. This is a local preparation record, not publication or Claude Code shipping approval. No staging, commit or push was performed.

## Exact reviewed manuscripts

| ID | Article | SHA-256 | Opening type |
|---|---|---|---|
| ko-01 | `src/content/issues/ko/ISSUE-20261103-01-taiwan-childcare-working-hours-adjustment-under-three.md` | `997a6fc7ca07188516f19651c5f8dca5330f773f03edd4cde5c9ad9dad467d51` | News event and employer practice |
| ko-02 | `src/content/issues/ko/ISSUE-20261103-02-taiwan-medical-device-vendor-operating-room-support-limits.md` | `d76081b3f8015f41d3c585935960d4a266fb7e84f49e3e1018eaf06bf5fae7b2` | Attributed unresolved allegation |
| ja-03 | `src/content/issues/ja/ISSUE-20261103-03-taiwan-japan-trade-arrangement-domestic-effect.md` | `50bb9d5d17e3e6d930026edab60de1e715d3a8b77825b66f8177152bf8213810` | Reader question tied to reported negotiations |
| ja-04 | `src/content/issues/ja/ISSUE-20261103-04-taiwan-lithium-battery-recycling-importer-registration.md` | `ef4c6cbcb49f1c696a6c3be6a4edcacf5b6912bf607e09f9a1cd4d2f3afd9422` | Future policy target date |
| en-05 | `src/content/issues/en/ISSUE-20261103-05-taiwan-line-call-recording-business-conversation-privacy.md` | `b86688b37dde210671d81970531f400a8991db855724aa39a72614b585680801` | Product-launch report |
| en-06 | `src/content/issues/en/ISSUE-20261103-06-taiwan-job-interview-questionnaire-applicant-privacy.md` | `b83a2bfab762a918924bbb7c48d83425e4e8ddaccedab1060d5fd7b3dccc1150` | Specific form-field list |
| vi-07 | `src/content/issues/vi/ISSUE-20261103-07-taiwan-lost-salary-envelope-finders-reward.md` | `54a8c2f47b9dbc3bf7dcd0dda3d0f69a0bb3307f9a02fb0fd1c6cbd76b39b48b` | Reported recovery scene |
| vi-08 | `src/content/issues/vi/ISSUE-20261103-08-taiwan-companion-care-service-price-worker-wages.md` | `a804fcfe3d67de1fe9c28179a44bc4b41e4005afa7e4bc1ca92588539bd398ae` | Quoted numerical claim being fact-checked |

## Actual editorial repairs

- KO01: summary's “차이를 살펴봅니다” preview became the actual under-30 agreement and pay/personnel-treatment distinction. The second-paragraph “살펴볼 법 조항이 있습니다” signpost became a direct statement about Korean employees, existing law, child age and headcount conditions. Other bytes were independently checked against the initial hash.
- JA03: the opening's expendable reader-interest commentary became a concrete contract-pricing question, while the November 2 attributed negotiation report and tentative timing remained. Treaty/agreement category, authorized organizations and Article 11's limited scope were preserved.
- EN05: replaced the nonstandard storage label ‘Keep notes’ with the official English product label ‘Keep Memo’. Shortened the supplier example by removing the empty ‘that limitation matters’ bridge; the other party's knowledge/consent distinction remains.
- EN06: removed redundant sentences restating that the complaint was not a proven violation and that recruitment-stage requests were covered. Adjacent sourced statements retain both limits.
- VI07/08: corrected image descriptions to match the actual service counter and cardigan-on-chair/folder-on-table composition. Removed VI08's internal-instruction sentence “Phạm vi ấy cần được giữ nguyên.” The adjacent program-coverage qualification remains.

Every locale reviewer applied the first-two-paragraph deletion test and compared three recent same-language local articles. KO comparators: columns 1024, 1023 and 1021. JA: issues 20261103-87, -58 and -54. EN: issues 20261103-88, -59 and -56. VI: issues 20261103-85, -81 and -51. They inspected actual openings, headings and endings; local publication metadata was not represented as independently verified public order.

Final batch opener balance: four of eight are news/fact/list-led; the others are a reader question, a future target date, a reported scene and a quoted numerical claim. No stock hypothetical opener is used. Manual section 5 checks and the per-file automated variety checks found zero FAIL. Korean/Japanese polite-register advisory warnings were assessed without changing the required register.

## Verification and source boundaries

The exact requested three Vitest suites pass 80/80; the new test is scoped to this lane's IDs 01–08 so the existing same-day lanes remain independent. Old September/October tests and the content loader are unchanged. The new test passed scoped ESLint. All 16 images decode at 1536×1024 RGB and show calm fictional scenes without identifiable people, readable text or logos. Featured and social renditions show the same image.

All articles carry internal provenance only, native metadata and three FAQ pairs, inline official sources and a source list. No judgment is cited. News was first published October 28–November 2; two CNA pages have November 3 update stamps. MOJ's displayed consolidation cutoff was October 22; relevant amendment and commencement histories were checked. VI07 cites an opened government-release republication because the original Taipei page timed out.

Author, locale and independent final reports, full source ledger, media provenance, tests, hashes and operator queue are in `/Users/son7/tseng-air-1011/lanes/issues/20261103/`. These are AI editorial reviews, not human native-speaker, lawyer or Claude Code approvals. Browser/full-build/deployment/live-readback checks were not performed for this content-only handoff. The operator's separate Claude Code review gates shipping.
