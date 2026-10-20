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
