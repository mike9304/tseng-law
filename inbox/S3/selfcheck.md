# S3 selfcheck

## variety_metrics.py check (2026-10-20)
```
ko.md [ko] sentences=36 mean=43.4 cv=0.472 short=0.139 run3=0.088 opener_rep=0.0 cite_end=0.056 cite_para=0.455 contrast=0 caveat=0 q=1
  WARN 86% of sentences end in '니다.' — vary endings within the register
ja.md [ja] sentences=36 mean=45.8 cv=0.469 short=0.111 run3=0.088 opener_rep=0.091 cite_end=0.056 cite_para=0.455 contrast=0 caveat=1 q=0
  WARN 86% of sentences end in 'desu-masu' — vary endings within the register
en.md [en] sentences=43 mean=18.6 cv=0.48 short=0.14 run3=0.098 opener_rep=0.0 cite_end=0.0 cite_para=0.333 contrast=0 caveat=0 q=1
  OK — no variety limit violated
zh.md [zh-hant] sentences=33 mean=37.3 cv=0.571 short=0.121 run3=0.065 opener_rep=0.182 cite_end=0.061 cite_para=0.455 contrast=0 caveat=0 q=1
  OK — no variety limit violated
```

## length
```
ko.md chars(no space)= 1669 chars(with space)= 2141 en-words= 108
ja.md chars(no space)= 1733 chars(with space)= 1762 en-words= 49
zh.md chars(no space)= 1308 chars(with space)= 1338 en-words= 39
en.md words(whitespace)= 790
```

FAIL 0 in all four files. The WARNs only flag polite-register endings, which the house style requires.

## Self-check (section 5)
2. Openings: ko opens with a quoted sentence from the judgment (「未免速斷」), ja with a factual result (38 years together, then still half), en with a number ("Three years and four months."), and zh with a corrected misconception (years apart do not become a discount). None of them repeats S1 or S2. The hypothetical labels sit inside or after the sentence.
3. Short sentences: ko 14%, ja 11%, en 14%, zh 12%. No two long sentences run back to back.
4. Paragraph openers: in en I fixed "The" appearing 4 times. Every word now opens 2 paragraphs or fewer in all languages.
5. Paragraphs without citations: the scene/hypothetical, the closing, and the Supreme Court explanation paragraph (cited only by the heading paragraph). No paragraph in ko/en/zh begins with a caveat word; ja has 1 (もっとも).
6. Contrast templates: 0 in all four.
7. The last body paragraph ends on the judgments' facts: land bought before separation was still split equally. The contact line is one sentence.
8. Register: ko uses 합니다체 and ja です・ます. No bold, no imperatives. I softened the ko "따져야 합니다" to "쟁점이 됩니다".
9. Figures match facts.md: 2021-01-20, 2012 separate rooms, 3 adult children, 1977 / 2015 / ~38 years, 3 years 4 months, 2-year and 5-year limits.

## First-two-paragraph test
- ko/ja/en/zh P1 (hook: quote, result, number, or misconception): deleting it loses the question the piece answers, so I kept it. P2 states the rule. I kept that too.

## Duplicate check
- Basics, governing law, limits, asset tracing and overseas assets are covered by ko 046/197/275, ja 267/275, en 213/275 and zh 046/106/215. Paragraphs 2–3 appear in those columns only as a one-paragraph paraphrase. No column analyses how courts apply the adjustment, the separation factor, the 2021 amendment's transition rule, or reduction arguments raised by heirs after death.
- Each locale links to its existing governing-law or calculation column (targets verified).

## Slug
taiwan-remaining-property-split-adjustment-separation (0 filename matches).

## Open risks
1. Balance: none of the three cited judgments ends in a confirmed reduction. The Supreme Court remanded for a fuller review but did not reduce the share itself. A Taichung High Court case reported in a secondary source as a one-third reduction could not be opened, so it is not cited. The summary/FAQ wording ("not because of the years alone", "the exception") reflects this. If Astra wants a reduction example, one should be located via FJUD first.
2. Remand outcome of 111台上2561 not checked; drafts only describe the Supreme Court decision.
3. The TPDV judgment is first instance, and its finality was not checked.

## Astra r1 response (2026-10-20)
1. MAJOR, judgment verification: re-verified all three judgments (HTTP 200). Text copies are in drafts/S3/evidence/ with personal names masked, and the key passages are listed in facts.md.
2. MAJOR, ko/ja summaries mixing up the role of pre-separation acquisition: rewritten. The lower courts are now described separately: one kept the equal split, citing among other things the land's pre-separation acquisition; the other rejected the heirs' short-marriage reduction argument.
3. MAJOR, the condition in paragraph 2: en/ko/ja now read "if a spouse's lack of contribution or collaboration, or other circumstances, makes equal division unfair". zh quotes the statute verbatim.
4. MAJOR, en hypothetical: now describes the lower-surplus spouse's claim to half the difference between the two surpluses, and asks whether the separation allows that share to be cut.
5. MAJOR, en "does not treat a work posting differently": replaced in en with "paragraph 3 lists the length of separation without specifying its reasons, and also requires weighing overall contribution and the other factors". ko/ja/zh were aligned to the same wording.
6. MAJOR, the 2021 amendment's role: summaries and body in all four languages now say the adjustment power existed before 2021, and that the amendment rewrote the standard and added the factors.
7. MINOR ko: "제1항에서 계산에서" changed to "제1항에 따라 계산에서". "평균 분배" changed to "균등 분배" throughout ko.
8. MINOR en: "would empty that rule" changed to "would undermine that exclusion".
featured_image "TBD": same as S1 and S2, kept per TASK.md. The user's decision is pending via the bridge.
Variety after fixes: FAIL 0 in all four files (ko cv 0.483, ja 0.479, en 0.514, zh 0.597). en has 842 words.


## Astra r2 response (2026-10-20 21:11 KST)
1–4. MAJOR, lawyer name: removed in all four contact lines.
5. MAJOR, ja trigger: 「法定財産制が終了するとき」.
6. MAJOR, en "jointly": now "jointly and severally, limited to the inherited estate" (主文 「於繼承…遺產範圍內，連帶給付」).
7. MAJOR, authentication: same method as S1 (official FJUD HTML with SHA-256 + 歷審裁判 endpoint; evidence/README.md).
8. MINOR, en: the "obvious question" sentence was replaced by the question itself.
9. MINOR, ko: the repeated land-acquisition clause was removed from the closing.
Proactive (appeal histories): 最高法院 111台上2561 was followed on remand by 高院 111家上更一22 (2023-07-05), which split the remaining property 30/70 (NT$1,365,199 instead of the NT$2,275,331 claimed), 「兩造均不得上訴」. This is the confirmed reduction example that r1 lacked, and it is now in the body, summary, FAQ 1 and closing of all four locales. 臺南高分院 113重家上3: 最高法院 114台上565 (2025-03-26) rejected the appeal as improper, so the judgment is final. 臺北地院 111重家財訴10 was appealed and settled in mediation at the High Court on 2024-12-03 (terms not public); summary, FAQ 2 and body say so. zh: 茶園→茶廠 (as in the judgment); 「往往就是爭點」→「就可能成為爭點」.

Variety after fixes (FAIL 0 in all four):
    drafts/S3/ko.md [ko] sentences=47 mean=42.5 cv=0.467 short=0.149 run3=0.044 opener_rep=0.0 cite_end=0.043 cite_para=0.5 contrast=0 caveat=0 q=1
    drafts/S3/ja.md [ja] sentences=47 mean=45.1 cv=0.479 short=0.128 run3=0.044 opener_rep=0.167 cite_end=0.043 cite_para=0.5 contrast=0 caveat=1 q=0
    drafts/S3/en.md [en] sentences=51 mean=19.8 cv=0.51 short=0.137 run3=0.041 opener_rep=0.0 cite_end=0.0 cite_para=0.385 contrast=0 caveat=0 q=1
    drafts/S3/zh.md [ko] sentences=38 mean=41.3 cv=0.595 short=0.184 run3=0.056 opener_rep=0.0 cite_end=0.053 cite_para=0.5 contrast=0 caveat=0 q=1
Lengths:
    drafts/S3/ko.md chars(no space)= 2125 chars(with space)= 2726 en-words= 147
    drafts/S3/ja.md chars(no space)= 2230 chars(with space)= 2261 en-words= 71
    drafts/S3/en.md chars(no space)= 5068 chars(with space)= 6079 en-words= 1015
    drafts/S3/zh.md chars(no space)= 1674 chars(with space)= 1706 en-words= 60
YAML front matter parses (Ruby YAML.safe_load), 3 FAQ, author token, featured_image "TBD" (user decision, option A). Every URL in the four files returns HTTP 200 (curl, browser User-Agent, 2026-10-20). No bold, no lawyer name, no byline.

## Astra r3 fixes (2026-10-21)
1. MAJOR, 7/25 period (all four locales): the drafts said "7/25 of the marriage". The remand judgment compares the separate-rooms period with the time from the wedding (1995-02-07) to the calculation date (2019-08-15, when the other spouse filed for judicial divorce); the divorce judgment came in 2022. All four locales now say about 7 of roughly 25 years from the 1995 wedding to the 2019-08-15 calculation date, i.e. about 7/25. 30% award unchanged. Quote in facts.md.
2. MINOR, ko: 「협력과 기여를 드러내 보호하려는 것이고」 → 「경제적으로 약한 배우자의 협력과 기여를 인정하고 그 배우자를 보호하기 위한 것이며」.
3. MINOR, ja opening: 「夫婦の剰余財産は、結局半分ずつでした」 → 「夫婦の剰余財産の差額は、結局半分ずつに分配されました」.
4. MINOR, en: "contribution or collaboration to married life" → "contribution to or cooperation in married life".

Note: earlier zh.md runs in this file show [ko] because variety_metrics.py guess_lang() maps a file named zh.md to the default (ko). From this round on, zh.md is checked with --lang zh-hant (short-sentence threshold 12 chars).
Variety (2026-10-21, explicit --lang for each file):
    drafts/S3/ko.md [ko] sentences=49 mean=42.3 cv=0.494 short=0.163 run3=0.043 opener_rep=0.0 cite_end=0.041 cite_para=0.5 contrast=0 caveat=0 q=1
      WARN 88% of sentences end in '니다.' — vary endings within the register
    drafts/S3/ja.md [ja] sentences=49 mean=44.8 cv=0.498 short=0.143 run3=0.043 opener_rep=0.167 cite_end=0.041 cite_para=0.5 contrast=0 caveat=1 q=0
      WARN 88% of sentences end in 'desu-masu' — vary endings within the register
    drafts/S3/en.md [en] sentences=52 mean=20.0 cv=0.517 short=0.154 run3=0.04 opener_rep=0.0 cite_end=0.0 cite_para=0.385 contrast=0 caveat=0 q=1
      OK — no variety limit violated
    drafts/S3/zh.md [zh-hant] sentences=38 mean=42.9 cv=0.681 short=0.105 run3=0.056 opener_rep=0.167 cite_end=0.053 cite_para=0.5 contrast=0 caveat=0 q=1
      OK — no variety limit violated
Lengths:
    drafts/S3/ko.md chars(no space)= 2197 chars(with space)= 2818 en-words= 156
    drafts/S3/ja.md chars(no space)= 2305 chars(with space)= 2336 en-words= 77
    drafts/S3/en.md chars(no space)= 5213 chars(with space)= 6257 en-words= 1048
    drafts/S3/zh.md chars(no space)= 1735 chars(with space)= 1767 en-words= 65
Post-polish recheck (S3 ko/ja subject added, zh sentence split): variety FAIL 0 x4; ko 2,205 / ja 2,317 / zh 1,737 chars.
