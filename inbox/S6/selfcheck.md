# S6 selfcheck

## variety_metrics.py check (2026-10-20)
```
ko.md [ko] sentences=35 mean=41.1 cv=0.456 short=0.114 run3=0.0 opener_rep=0.0 cite_end=0.086 cite_para=0.636 contrast=1 caveat=0 q=1
  WARN 86% of sentences end in '니다.' — vary endings within the register
ja.md [ja] sentences=37 mean=40.6 cv=0.473 short=0.162 run3=0.0 opener_rep=0.0 cite_end=0.081 cite_para=0.583 contrast=0 caveat=0 q=0
  WARN 84% of sentences end in 'desu-masu' — vary endings within the register
en.md [en] sentences=39 mean=18.9 cv=0.475 short=0.205 run3=0.0 opener_rep=0.0 cite_end=0.128 cite_para=0.667 contrast=1 caveat=0 q=1
  OK — no variety limit violated
zh.md [zh-hant] sentences=29 mean=40 cv=0.647 short=0.207 run3=0.0 opener_rep=0.0 cite_end=0.172 cite_para=0.727 contrast=1 caveat=0 q=1
  WARN opens with the stock hypothetical ("가령/例えば…とします/Suppose…/假設") — allowed at most 1 in 4 columns; prefer a concrete fact, number, question or scene
```

## length
```
ko.md chars(no space)= 1532 chars(with space)= 1951 en-words= 133
ja.md chars(no space)= 1573 chars(with space)= 1602 en-words= 70
zh.md chars(no space)= 1214 chars(with space)= 1242 en-words= 44
en.md words(whitespace)= 723
```

FAIL 0 in all four files. zh shows a scene-opening WARN; it is the only zh scene opening among S1–S6, and the label sits after the scene. The other WARNs flag the polite-register endings that house style requires.

## Self-check (section 5)
2. Openings: ko opens with a misconception (⑤: "a 'responsibility system' is not a label the company sticks on staff"), ja with a quoted ruling (⑥: J.Y. 726 text), en with a quoted ruling (⑥: "a mandatory regulation"), zh with a labelled scene (③). I changed the ko opening from a scene to avoid two scene openings in a row (S5 ko was a scene).
3. Short sentences: ko 11%, ja 16%, en 21%, zh 21%.
4. Paragraph openers: I fixed en "The" appearing 4 times to "First comes / Next comes / Last is / Before then".
5. Paragraphs without citations: the opening and the closing, plus the court-split paragraph, which cites only by case number. No caveat chain.
6. Contrast templates: 0–1 per file.
7. The closing gives the three questions a manager can ask (list item, written agreement, approval document), tied to the column's facts. The contact line is one sentence.
8. Register: ko and ja are consistent. No bold, no imperative headings. I removed "often" from en.
9. Figures match facts.md and are the same in all four languages: NT$150,000, NT$29,500, 40h, 8h, 12h, 46h, 1/3, 2/3, NT$20,000–1,000,000, 2014-11-21, both case numbers.

## Duplicate check
- zh 062 has a two-paragraph 責任制 section (84-1 text plus the three checks), with no J.Y.726, no 50-1 definitions and no minimum-wage proration. en 221 notes there is no exempt category and points to the MOL list and its "never unlimited hours" line. ko 207 covers shifts and the 46h limit. No column cites 釋字726 (grep = 0) or covers the consequence of missing approval.
- Links: ko→207, en→221, zh→062.

## Slug
taiwan-responsibility-system-overtime-approval-interpretation-726 (0 matches).

## Open risks
1. The NT$150,000 supervisor category also requires meeting 施行細則50-1(1). The drafts state both conditions.
2. Several MOL list categories are paraphrased, so the list is partial. Drafts say the list "includes" these categories.
3. No post-726 court judgment is cited to illustrate. The column relies on the Interpretation itself plus statute and MOL guidance.
