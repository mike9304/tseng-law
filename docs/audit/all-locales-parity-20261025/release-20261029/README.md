# Reviewed case expansion — 2026-10-29

This release adds54 complete case columns: six each in Czech, Burmese, Swedish, Tamil, Turkish, Ukrainian, Urdu, Dutch and Lithuanian. It also repairs the existing Czech706 sentence while preserving its legal conditions. The current baseline is8f7624b56423a1dd27590c25e9ca5623631b9057; all24 commits after the previous B9 release are preserved.

Every added manuscript has a closed independent AI meaning/style review and an exact-byte intake record. Root authored Tamil and Dutch and coauthored the final Swedish revision; Kimi3.1Pro authored the Swedish drafts. This is not a claim of human attorney/native-speaker approval. FIL/ID drafts still require changes, HE/TH/VI and B12 are not included.

The five copied Czech checker files reflect the separately reviewed date-boundary correction, with unchanged metrics thresholds. Two existing content-test registries now pin38 real language versions for each case and39 hreflang entries including x-default, plus the correct pre-existing ARC dates. There are no production runtime, capacity-candidate, infrastructure or deployment-setting changes.

Prior B9 publication was verified on the current public commit:42pages,1018bodyblocks and119FAQitems matched their reviewed sources. The present54 additions have not yet been claimed public. Current baseline source inventory is2379professional articles/2112board-visible articles across49locales; the fixed target remains286perlocale without using one locale’s surplus to offset another’s deficit.

Release validation, content commit, authorized non-force main push and live confirmation will be recorded separately. Production remains main→existing MacBookAir automatic static build→existing Sites. Local builds do not reproduce the private Air CMS mirror.

AUDIT-COPY-INDEX.json lists the exact evidence copied here. Historical raw logs and full repeated review trees remain at their recorded paths; their absence from this compact copy is not a claim they were rerun or included. The921 scope note resolves an inconsistent optional-detail classification without changing frozen LT prose or weakening mandatory legal conditions.

Pre-build integration checks:55actual copied-checker CLI passes,90checker tests pass,55structure checks with no final errors and153newFAQ entries. Production-loader counts become2433/2166. Content tests initially returned476PASS of478; the unchanged language-link test timed out under concurrent load, then passed isolated with the original5000ms limit. The caption test exposed12canonical-label mismatches; CS/MY captions were normalized with the body and all other metadata unchanged, and that suite then passed. Historical failures are retained. integration-release.json and caption-normalization.json describe the current55manuscripts; integration-final.json is the preceding pre-caption snapshot. The build release scope is pinned separately to the upcoming content commit.
