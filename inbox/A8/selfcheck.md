# A8 selfcheck (2026-10-20)

## Variety check (re-run after Astra r1 fixes, 2026-10-20 21:0x KST)
```
drafts/A8/ko.md [ko] sentences=36 mean=49.1 cv=0.507 short=0.083 run3=0.0 opener_rep=0.0 cite_end=0.167 cite_para=0.727 contrast=0 caveat=0 q=1
  WARN 78% of sentences end in '니다.' — vary endings within the register
drafts/A8/ja.md [ja] sentences=32 mean=55.3 cv=0.518 short=0.156 run3=0.0 opener_rep=0.0 cite_end=0.125 cite_para=0.7 contrast=0 caveat=0 q=0
  WARN 84% of sentences end in 'desu-masu' — vary endings within the register
drafts/A8/en.md [en] sentences=41 mean=21.8 cv=0.597 short=0.171 run3=0.0 opener_rep=0.091 cite_end=0.098 cite_para=0.636 contrast=0 caveat=0 q=1
  OK — no variety limit violated
drafts/A8/zh.md [zh-hant] sentences=32 mean=43.8 cv=0.688 short=0.156 run3=0.0 opener_rep=0.083 cite_end=0.156 cite_para=0.75 contrast=0 caveat=1 q=2
  OK — no variety limit violated
```
FAIL 0 in all four.

## Length
```
drafts/A8/en.md words 906
drafts/A8/ja.md chars_nospace 1896 chars_with_space 1924
drafts/A8/ko.md chars_nospace 1915 chars_with_space 2499
drafts/A8/zh.md chars_nospace 1500 chars_with_space 1535
```

## Duplicate check
Queued angle (complaint, freezing the receiving account, incidental civil action, realistic recovery) is covered: ko 059/064/423, en 059/237, ja 225/272/248, zh 042/059/224/235/236/246/247. Romance-scam column exists only in zh (224, loan vs fraud). Fraud Crime Hazard Prevention Act Arts. 46, 52, 53, 55 are cited by no column; Art. 47 only by zh 235; Art. 54 by ko/en/zh 059, en 237, zh 042/247/235; Art. 11 by several. Chosen narrower angle: recovery tools for many victims of one scam — sentence reduction tied to paying the agreed amount (46/47), prosecutor/court-led mediation (53), sentencing attention to lavish spending (50), group suits via appointed parties (55 + 民訴41), fee/security relief (54), legal-aid notice (52), and the scope limit of Art. 2. zh narrowed further (55, 46, 53, 11) and links to zh 235 for Art. 47 and zh 247 for provisional attachment. Slug `taiwan-fraud-victims-group-suit-settlement-sentence-reduction`: 0 matches.

## Voice self-check
- Openings: ko = reader question, ja = fact about the Act, en = labelled scene, zh = reader question. No prevalence claims; no bold/emoji/checklist headings; ko 합니다체; ja です・ます (WARN 79% desu-masu endings only).

## Open risks
- Resolved (Astra r1): effective date 2026-01-23 and 刑法2 I comparison for earlier conduct now stated in all four, with the Judicial Yuan 司法周刊 report; drafts do not predict the comparison outcome.
- No judgment applying Art. 55 was searched/cited.

## Astra r1 fixes (2026-10-20)
- 11/11 findings applied: summaries split Art.46 (surrender → reduce/exempt) vs Art.47 (confession throughout, clock from first confession in prosecutor's investigation → reduce) (ko/ja/en); headings limited to amended Arts.46–47 + effective 2026-01-23 + 刑法2 I comparison + other provisions still relevant (x4); zh summary 53 得 + 必要時應上訴, zh body '也有角色'; 339-4 categories restored (政府機關, 關於他人, 電磁紀錄) body+FAQ (x4); en paragraph-2 wording (no payment-causes-arrest); Art.11 no longer sequenced before litigation (ko/en/zh); zh descriptive headings; en 'principal grounds supporting their claims or defences' (x3); ko/ja 緩起訴 explained + 刑訴253-1 (en aligned); 'Scope comes first' and equivalents deleted (ko/ja/en); en title 'Fraud Crime Hazard Prevention Act'.
- Extra skeptical-reader pass: closing list fragments rewritten as sentences (ko/ja/zh), ko/ja paragraph-2 phrasing smoothed.

## Astra r2 re-check (2026-10-21 ~00:07 KST)
- variety FAIL 0 (ko/ja/en; zh --lang zh-hant). WARN only: ko 77% 니다 endings, ja 84% desu-masu (pre-existing, not flagged by the gate).
- links.py BAD 0. YAML OK x4; faq 3; featured_image TBD; no 曾雋崴; no bold.
- Lengths (blen.py): en 916 words, ko 1,901 chars without spaces, ja 1,890, zh 1,512.
