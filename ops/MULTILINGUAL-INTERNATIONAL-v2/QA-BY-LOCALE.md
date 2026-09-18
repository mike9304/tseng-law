# QA-BY-LOCALE — MULTILINGUAL-INTERNATIONAL-v2-20260918-c4

reviewer: Grok 4.6 (implementation evidence; not independent validation)
candidate_id: MULTILINGUAL-INTERNATIONAL-v2-20260918-c4
independent_validation: NOT_TESTED

Status: PASS, FAIL, NOT_TESTED, BLOCKED.

| test_id | locale | page_role | actual_url | status | evidence |
|---|---|---|---|---|---|
| ML01 | all9 | inventory | 9 homes | PASS | `LOCALE-PAGE-MAP.md` |
| ML02 | all9 | policy | — | PASS | `POLICY-MATRIX.md` with file paths; extra MENA copy BLOCKED |
| ML03 | all9 | consultation | 4 languages | PASS | `multilingual-international-v2.test.tsx`; inquiry copy |
| ML04 | tree | preservation | EN-v1 | PASS | EN-v1 files kept; `CONTENT-DIFF.md` |
| ML05 | ja | P03 | column 001 | PASS | `日本企業や個人事業者`; not 韓国企業-as-universal |
| ML06 | ja | P03 treaty | column 001 | PASS | labeled 韓国関連; not renamed Japan treaty |
| ML08 | core | cases | civil | PASS | gym-injury nationality kept |
| ML09 | core | P01 vs P02 | guide vs lawyer | PASS | planHeading ≠ lawyer title |
| ML10 | core | P06 | civil | PASS | CivilCommercialBlock + injury copy |
| ML11 | core4 | P07 | debt-recovery | PASS | five situations; noindex |
| ML12 | all9 | P00 | homes | PASS | `screens/home-*-1440x900.png` and 390×844 |
| ML13 | guidance | inquiry | notices | PASS | four consultation languages |
| ML16 | all | language switch | — | NOT_TESTED | V2-13 leftover; not in C3-01/02 scope |
| ML17 | P07 | noindex | debt-recovery | PASS | robots noindex, empty hreflang |
| ML18 | codes | hreflang | ja/fil | PASS | ja not jp, fil not tl |
| ML19 | all9 | viewport | 1440/390 | PASS | `screens/`; 320px/200% not re-run this c4 |
| ML20 | ar | RTL | `/ar` | PASS | existing dir; extra MENA copy BLOCKED |
| ML21 | routes | P07 | core4 only | PASS | no new locales; guidance P07 404 |
| ML22 | unit | C3-01 | growth test | PASS | `intent-pages-en-growth.test.ts` 16 passed with restored `台灣律師指南` |
| ML23 | review | badges | P07 draft | NOT_TESTED | V2-12 leftover P2 publication-blocking |
| ML24 | candidate | evidence | ops pack | PASS | BASELINE TERMS CONTENT-DIFF LOCALE-SEO-MAP RUNBOOK logs/ screens/; manifest excludes `fable/` |

C3-01: ZH `taiwan-lawyer` title restored to `台灣律師指南` (V2-08 scope was P02/P05 only).
C3-02: required ops files + logs + screens in-repo; QA rewritten for c4.
