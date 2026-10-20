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

## Astra r1 fix (2026-10-20 ~20:50 KST)
Source: ASTRA-FAIL.md (r1), renamed ASTRA-FAIL-fixed-1.md. All 9 findings were accepted after a live LawSingle re-check (details in facts.md).
- ja/zh: subrogation is now cited as 給付標準 Art. 2(6). The facts.md paragraph numbering was corrected too.
- en/zh: Fund limitation now includes the unauthorized-use trigger (Art. 14(4)③).
- ko: the summary separates injury benefits from survivors' death benefit, and the text now reads 「사망자 1인당」.
- ko: the limitation trigger is knowledge of both the damage and the insurer.
- ko/en/zh: time is excluded only for a claim made before limitation expires (Art. 14(2)); en has this in both places.
- en: the opening scene is labelled "(The scene is an invented example.)". It was first rewritten as "Take an invented example: …", but that drew the stock-hypothetical opener WARN, so the question opener was kept with a trailing label.
- ko: 「청구의 효력이 발생한 때」. 「그대로입니다」 deleted.
- ja: 「救急外来・一般外来を受診した日」.
Checks: variety FAIL 0 and no WARN in en after the opener change (ko/ja/en; zh --lang zh-hant). Links BAD 0, YAML OK x4. Lengths: en 737 words, ko 1,547 chars without spaces, ja 1,521, zh 1,372.

## Astra r2 fix (2026-10-21 ~00:03 KST)
- Duplicate check for the new ja angle: see facts.md r2 log. No column in any locale covers Art. 36 multi-vehicle joint payment or 彰化地院113保險簡上1; ja 271/003 untouched (ref is read-only for this lane).
- Variety: ko OK, ja OK (cv 0.505, short 0.158), en OK, zh (--lang zh-hant) OK. FAIL 0.
- links.py BAD 0 (new: CHDV printData 200, L0060001 Art. 95 200, internal /ja/.../taiwan-traffic-accident-compensation-items-japanese = 271). YAML OK x4; faq 3 each; featured_image TBD; no 曾雋崴; no bold; address once per file.
- Lengths (blen.py): ja 1,876 chars without spaces, ko 1,665, en 798 words, zh 1,467.
- Open risk: the judgment is a 簡易訴訟 appellate ruling of a district court (final, 「不得上訴」); it is one case, presented as such, not as settled practice.

## Astra r3 (2026-10-21)
1. MAJOR ja Art. 31(2): verified live (LawSingle G0390060 flno=31: 「但前項但書之情形，不在此限」). Added 「ただし、請求権者との間で賠償額を保険給付から差し引かないと約定していたときは、この請求はできません。」 after the 同条第2項 sentence. Only ja cites Art. 31 (grep ko/en/zh: none).
2. MINOR en Art. 32 wording → "counts toward the damages the insured owes" (Art. 32 re-fetched: 視為被保險人損害賠償金額之一部分).
3. MINOR ja summary preview sentence deleted.
4. MINOR zh citation rhythm: 「依給付標準第3條，失能給付仍分十五等級……」 (end citation moved forward).
Checks: variety OK ko/ja/en/zh, links BAD 0, YAML OK x4 (faq 3 each), ja 1,926 chars, en 797 words.
