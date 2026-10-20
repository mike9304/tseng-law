# S4 selfcheck

## variety_metrics.py check (2026-10-20)
```
ko.md [ko] sentences=38 mean=37.7 cv=0.494 short=0.132 run3=0.111 opener_rep=0.0 cite_end=0.132 cite_para=0.333 contrast=0 caveat=0 q=2
  WARN 79% of sentences end in '니다.' — vary endings within the register
ja.md [ja] sentences=41 mean=38.0 cv=0.474 short=0.171 run3=0.128 opener_rep=0.083 cite_end=0.122 cite_para=0.333 contrast=0 caveat=0 q=0
  WARN opens with the stock hypothetical ("가령/例えば…とします/Suppose…/假設") — allowed at most 1 in 4 columns; prefer a concrete fact, number, question or scene
  WARN 76% of sentences end in 'desu-masu' — vary endings within the register
en.md [en] sentences=35 mean=20.4 cv=0.486 short=0.171 run3=0.121 opener_rep=0.083 cite_end=0.114 cite_para=0.333 contrast=1 caveat=0 q=1
  OK — no variety limit violated
zh.md [zh-hant] sentences=30 mean=40.2 cv=0.599 short=0.2 run3=0.0 opener_rep=0.0 cite_end=0.1 cite_para=0.308 contrast=0 caveat=0 q=2
  OK — no variety limit violated
```

## length
```
ko.md chars(no space)= 1511 chars(with space)= 1946 en-words= 97
ja.md chars(no space)= 1621 chars(with space)= 1652 en-words= 32
zh.md chars(no space)= 1278 chars(with space)= 1312 en-words= 24
en.md words(whitespace)= 709
```

FAIL 0 in all four files. ja raises one WARN for a scene in the opening paragraph. It is labelled （架空の例です）, and it is the only scene opening among the four ja columns S1–S4 (limit: 1 in 4). The remaining WARNs flag polite-register endings, which the house style requires.

## Self-check (section 5)
2. Openings: ko opens with a question, ja with a labelled scene, en with a fact ("tax authorities will search… if an heir asks"), and zh with a number ("十二類。"). Batch S1–S4 per locale: ko ①④⑥②, ja ②⑤①③, en ⑤③④①, zh ⑥②⑤④. No opening type repeats within a locale.
3. Short sentences: ko 13%, ja 17%, en 17%, zh 20%.
4. Paragraph openers: every word opens 2 or fewer paragraphs.
5. Paragraphs without citations: the opening, the "applying from overseas" and "how the answer arrives" sections (which rest on the directive, cited in sources), and the closing. No caveat-led paragraph sequence.
6. Contrast templates: en 1, others 0.
7. The ending is tied to this column's facts: the 6-month deadline, the time authentication takes, and the search request. The contact line is one sentence.
8. Register: ko and ja are consistent. No bold. No imperatives. I removed frequency claims (ko: "연장 신청을 함께 하는 경우가 많은"; en: "Most heirs abroad"; zh: "往往").
9. Facts and figures (12 types, base date = date of death, Wednesday batch, 10 working days, 30–90 days, 9 months, 6 months + up to 3 months, Arts. 1/6/8/23/26/41/42) match facts.md and are consistent across the four languages.

## Duplicate check
- See STATUS: estate tax basics, amounts and the Sept-2026 amendment (231), foreign decedent (025), foreign heir land registration (026), registration deadline (230), renunciation from Japan (233) and the Korean decedent case (249) are already covered. A grep for 金融遺產/聯合查詢/財產參考清單/금융유산/financial estate inquiry found no column on the single-window inquiry (ko 197 mentions asset tracing only in a divorce context).

## Slug
taiwan-deceased-parent-financial-assets-inquiry-heirs-abroad (0 filename matches).

## Open risks
1. The directive text comes from a New Taipei City tax office copy, not from a MOF law database page (I could not locate one). The version is the 2024-01-01 one. A later amendment was not found but cannot be ruled out.
2. Art. 26: the drafts say "up to three months" and omit the force-majeure exception, which lets the tax office set a longer period. FAQ/body could add it if Astra wants.
3. Online eligibility for heirs abroad: the drafts say only that the listed e-credentials are required, and they make no claim about whether foreigners can obtain them.
4. Art. 42 "public and private enterprises" is applied to banks (a bank is a private enterprise). This is reasonable, but the article's text does not name banks.

## Post-READY revision (2026-10-20, applying Astra r1 lessons from S1-S3)
- Art. 26: added the force-majeure / special-circumstances exception to the 3-month extension (all 4). Added evidence/mof-financial-estate-inquiry-directive.txt (full directive text, MOF order of 2023-12-26).
