# S5 selfcheck

## variety_metrics.py check (2026-10-20)
```
ko.md [ko] sentences=37 mean=39.3 cv=0.583 short=0.189 run3=0.0 opener_rep=0.0 cite_end=0.081 cite_para=0.538 contrast=0 caveat=0 q=1
  WARN opens with the stock hypothetical ("가령/例えば…とします/Suppose…/假設") — allowed at most 1 in 4 columns; prefer a concrete fact, number, question or scene
  WARN 86% of sentences end in '니다.' — vary endings within the register
ja.md [ja] sentences=36 mean=42.8 cv=0.541 short=0.083 run3=0.029 opener_rep=0.077 cite_end=0.111 cite_para=0.538 contrast=0 caveat=1 q=0
  WARN 81% of sentences end in 'desu-masu' — vary endings within the register
en.md [en] sentences=38 mean=18.9 cv=0.605 short=0.237 run3=0.0 opener_rep=0.25 cite_end=0.053 cite_para=0.583 contrast=1 caveat=0 q=1
  OK — no variety limit violated
zh.md [zh-hant] sentences=30 mean=40.9 cv=0.524 short=0.133 run3=0.036 opener_rep=0.0 cite_end=0.1 cite_para=0.583 contrast=0 caveat=1 q=1
  OK — no variety limit violated
```

## length
```
ko.md chars(no space)= 1523 chars(with space)= 1985 en-words= 105
ja.md chars(no space)= 1584 chars(with space)= 1615 en-words= 42
zh.md chars(no space)= 1274 chars(with space)= 1306 en-words= 28
en.md words(whitespace)= 710
```

FAIL 0 in all four files. ko gets a WARN for a scene opening, but it is the only ko column in S1–S5 that opens with a scene (the allowance is 1 in 4), and the label (가상의 사례입니다) comes after the scene. The other WARNs flag the polite-register endings that house style requires.

## Self-check (section 5)
2. Openings: ko opens with a labelled scene (③), ja with a number ("2年。" ④), en with a reader question (②), and zh with a fact (①). Across S1–S5 no type repeats within a locale except ko ③, which appears once.
3. Short sentences: ko 19%, ja 8.3% (at the threshold), en 24%, zh 13%.
4. Paragraph openers: at most 2 of any word (en "Item" ×2, "The" ×2).
5. One paragraph has no citation: the comparison paragraph mentions 31(4) once, and the scene and closing paragraphs carry no citations. There is no caveat chain.
6. Contrast: en 1, others 0. In ja I removed a "思われがちです" line, which rebutted a belief the reader never stated, and replaced it with a question.
7. The closing ties back to the column's facts: for a marriage under 2 years, contact records with the late spouse's family are the first proof needed. The contact line is one sentence.
8. Register: ko and ja are consistent. No bold. No imperatives.
9. All figures match facts.md and are the same across the 4 languages: 183 days, 3 years, 2 years, <30 days, 2× minimum wage, NT$5 million.

## Duplicate check
- 028 (all locales) covers continued residence (full 31(4) list, 31(5)), the work exemption and APRC. 257 covers naturalization periods, the loss-of-nationality proof and exceptions, but has no widowed/DV/child items (grep of 死亡/亡故/家暴/domestic violence in 257 returns 0). No column covers 國籍法4(1)(2)(3) or 施行細則5-8 for these groups.
- Each locale links to 028 and 257.

## Slug
taiwan-naturalization-after-spouse-death-or-divorce (0 filename matches).

## Open risks
1. "DV proof" (受家庭暴力之證明文件) is not defined in the rules. The drafts do not say what counts as proof (protection order, judgment, etc.).
2. The 2× minimum wage / NT$5 million comparison describes the other route (施行細則7(1)(2)) only as an example.
3. Whether residence as a spouse before the death or divorce and the continued residence after it count together toward the 3 years: the drafts state only the counting rule and the exclusion list, without asserting a combination rule.

## Post-READY revision (2026-10-20, applying Astra r1 lessons from S1-S3)
- Other naturalization routes: now described as 'one of the requirements in Enforcement Rules Art. 7, e.g. income > 2× basic wage or assets > NT$5m' (ko/ja; en already said 'for example'). Domicile now includes the intent-to-stay element (ko/ja).
