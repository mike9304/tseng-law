# A6 selfcheck (2026-10-20)

## Variety check
```
drafts/A6/ko.md [ko] sentences=38 mean=35.8 cv=0.525 short=0.132 run3=0.028 opener_rep=0.0 cite_end=0.342 cite_para=0.727 contrast=0 caveat=0 q=1
  OK — no variety limit violated
drafts/A6/ja.md [ja] sentences=34 mean=40 cv=0.476 short=0.088 run3=0.0 opener_rep=0.083 cite_end=0.324 cite_para=0.583 contrast=0 caveat=0 q=0
  OK — no variety limit violated
drafts/A6/en.md [en] sentences=36 mean=20.3 cv=0.479 short=0.111 run3=0.118 opener_rep=0.0 cite_end=0.278 cite_para=0.818 contrast=0 caveat=0 q=1
  OK — no variety limit violated
drafts/A6/zh.md [zh-hant] sentences=31 mean=40.5 cv=0.58 short=0.129 run3=0.103 opener_rep=0.167 cite_end=0.355 cite_para=0.75 contrast=0 caveat=0 q=2
  OK — no variety limit violated
```
FAIL 0 in all four.

## Length
```
drafts/A6/en.md words 722
drafts/A6/facts.md chars_nospace 2283 chars_with_space 2575
drafts/A6/ja.md chars_nospace 1523 chars_with_space 1555
drafts/A6/ko.md chars_nospace 1545 chars_with_space 1962
drafts/A6/selfcheck.md chars_nospace 655 chars_with_space 750
drafts/A6/zh.md chars_nospace 1353 chars_with_space 1385
```

## Duplicate check
- Complaint period / settlement / withdrawal / township mediation (刑法284·287, 刑訴237, 鄉鎮市調解條例31) are already covered in all four locales by 522 → not repeated; linked from ko/en.
- CALI: ja 271 covers benefit basics, item caps, the 2026 amendment and the Special Compensation Fund; zh 102 (passenger recourse) and 103 (uninsured, fund deduction) cover sub-angles; en has no CALI column; ko only a short mention in the 003 Q&A.
- Chosen angles: ko/en = CALI claim overview incl. July 2026 increase and accident-date rule; zh = the 2026 increase itself (what rose, what did not, accident-date rule, claimants, fund, assessment rules) — no zh column states the new amounts; ja = non-NHI (traveler) medical-fee calculation under 給付標準 Art. 2 II ②(二), not covered by 271.
- Slug `taiwan-compulsory-auto-insurance-claim-2026-benefit-increase`: 0 matches.

## Voice self-check
- Openings: ko = number (300만), en = reader question, ja = fact about the cap, zh = number. Contrast ≤1; no bold/emoji/checklist headings; ko 합니다체; ja です・ます.
- Prevalence claims avoided (ja "日本人の多く" removed).

## Open risks
- Traffic columns: FRONTMATTER/TRAFFIC-COLLECTION expects tags ["traffic-accidents", narrower tag] (added) and, for hub-linked columns, a per-column Blender diagram registered in src/data/traffic-still-diagrams.ts — integrator's decision; no diagram fields added.
- NHIA quarterly average-cost figures not quoted (site 403); ja explains the rule only.
- Which insurer a passenger claims from in multi-vehicle accidents is not stated (not verified).
