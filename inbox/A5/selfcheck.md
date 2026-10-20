# A5 selfcheck (2026-10-20)

## Variety check
```
drafts/A5/ko.md [ko] sentences=34 mean=41.3 cv=0.548 short=0.118 run3=0.062 opener_rep=0.0 cite_end=0.147 cite_para=0.636 contrast=0 caveat=0 q=0
  OK — no variety limit violated
drafts/A5/ja.md [ja] sentences=34 mean=44.0 cv=0.538 short=0.088 run3=0.031 opener_rep=0.0 cite_end=0.176 cite_para=0.727 contrast=0 caveat=0 q=0
  OK — no variety limit violated
drafts/A5/en.md [en] sentences=39 mean=19.8 cv=0.564 short=0.128 run3=0.081 opener_rep=0.0 cite_end=0.103 cite_para=0.727 contrast=0 caveat=0 q=0
  OK — no variety limit violated
drafts/A5/zh.md [zh-hant] sentences=30 mean=44.6 cv=0.68 short=0.133 run3=0.036 opener_rep=0.0 cite_end=0.133 cite_para=0.75 contrast=0 caveat=0 q=0
  OK — no variety limit violated
```
FAIL 0 in all four.

## Length
```
drafts/A5/en.md words 785
drafts/A5/facts.md chars_nospace 3289 chars_with_space 3623
drafts/A5/ja.md chars_nospace 1641 chars_with_space 1671
drafts/A5/ko.md chars_nospace 1570 chars_with_space 2017
drafts/A5/selfcheck.md chars_nospace 655 chars_with_space 750
drafts/A5/zh.md chars_nospace 1438 chars_with_space 1470
```

## Duplicate check
Dismissal/severance in general is covered (008/009 all locales, ja 037 subsidiary dismissal, en 034 foreign professional dismissed). The queued "probation myths" part is not covered anywhere: grep for 試用期/試用/probation/수습 finds only unrelated uses (criminal probation 524, cosmetics, AI). Chosen angle for all four: probation is not a free-exit period — MOL guidance + Supreme Court 113台上101 + 2026 High Court rulings (one upheld, one invalid), notice/severance math incl. the 2026 change for foreign professionals (攬才法24). Slug `taiwan-probation-period-dismissal-grounds-severance`: 0 matches.

## Voice self-check
- Openings: ko = real-case timeline (Pingtung driver), ja = common belief refuted, en = dated fact (1997 deletion), zh = dated fact in Taiwanese terms. ko/ja/en/zh differ from A1–A4 types per language except zh/en sharing "fact" type with A4/A1 respectively (different content).
- Short sentences present; contrast 0; no bold/emoji/checklist headings; ko 합니다체, ja です・ます.
- No prevalence claims; MOL statements attributed; court holdings attributed.

## Open risks
- 2nd-instance judgments' finality not checked (stated).
- Severance formula for foreign professionals with mixed pre/post-2026 service (勞退條例11) not detailed; drafts state only the Art. 24 rule.
- MOL "試用期之約定" page dated 2021-11-24; FAQ updated 2026-09-03 — both current on the site as of check date.

## Astra r1 fix (2026-10-20 ~20:45 KST)
Source: ASTRA-FAIL.md (r1), renamed ASTRA-FAIL-fixed-1.md. All 11 findings were accepted and verified against live LawSingle and the live judgment texts; details are in facts.md.
- Contact line without the lawyer's name, all 4. The same change was made in A1–A8 because of the 2026-10-20 no-byline rule.
- Art. 24(5) and (3) added (FAQ 3 and body, all 4).
- Severance FAQ limited to severance-bearing grounds, with the Art. 12/18 exclusion (all 4).
- en heading "Dismissal during a labor dispute".
- Kaohsiung post-accident handling finding added (all 4).
- zh 92 chronology and 環保局.
- ko 해고수당(資遣費).
- ja 「おおむね職務を遂行できない」.
- en notice bands.
- zh title, H1 and summary.
- Verification blocker: four judgments re-opened via printData and the official PDFs (rebuttal.md).
Checks: variety FAIL 0 (ko/ja/en; zh --lang zh-hant). Links BAD 0. YAML OK x4. Lengths: en 884 words, ko 1,811 chars without spaces, ja 1,865, zh 1,642.

## Astra r2 re-check (2026-10-20 ~23:58 KST)
- variety: ko OK (short 0.103), ja OK (short 0.081), en OK, zh (--lang zh-hant) OK. FAIL 0.
- links.py BAD 0; YAML (ruby safe_load) OK x4; faq 3 each; featured_image TBD; no 曾雋崴, no bold.
- Lengths (blen.py): en 918 words, ko 1,896 chars without spaces, ja 1,919, zh 1,721.
