# S7 selfcheck

## variety_metrics.py check (2026-10-20)
```
ko.md [ko] sentences=40 mean=35.7 cv=0.471 short=0.1 run3=0.0 opener_rep=0.0 cite_end=0.2 cite_para=0.273 contrast=1 caveat=1 q=0
  WARN 78% of sentences end in '니다.' — vary endings within the register
ja.md [ja] sentences=43 mean=34.4 cv=0.468 short=0.163 run3=0.073 opener_rep=0.0 cite_end=0.186 cite_para=0.273 contrast=0 caveat=1 q=0
  WARN 81% of sentences end in 'desu-masu' — vary endings within the register
en.md [en] sentences=42 mean=17.9 cv=0.487 short=0.19 run3=0.0 opener_rep=0.182 cite_end=0.238 cite_para=0.273 contrast=0 caveat=0 q=0
  OK — no variety limit violated
zh.md [zh-hant] sentences=34 mean=33.6 cv=0.542 short=0.147 run3=0.031 opener_rep=0.0 cite_end=0.206 cite_para=0.333 contrast=0 caveat=1 q=1
  OK — no variety limit violated
```

## length
```
ko.md chars(no space)= 1543 chars(with space)= 1987 en-words= 109
ja.md chars(no space)= 1571 chars(with space)= 1602 en-words= 42
zh.md chars(no space)= 1241 chars(with space)= 1275 en-words= 35
en.md words(whitespace)= 746
```

FAIL 0 in all four files. Remaining WARNs flag only the polite-register endings that the house style requires.

## Self-check (section 5)
2. Openings: ko opens with a number ("50%." ④), ja with a fact (①), en with a labelled scene (③), and zh with a reader question (②).
3. Short sentences: ko 10%, ja 16%, en 19%, zh 15%.
4. Paragraph openers: at most 2 of any word.
5. The scene and closing paragraphs carry no citations. The column has one caveat sentence.
6. Contrast templates: 0–1 per file.
7. The closing turns on the column's own fact: missing a mediation session (Art. 20) can push a settlement into a lawsuit. The contact line is one sentence.
8. Register is consistent throughout. No bold. Two unsupported frequency claims were removed (ja "見落とされがちです", en "quick and cheap").
9. Numbers match facts.md in all languages: 50/40% ≤15 days, 25% ≤30 days, 70/60/50% ≤20 days, 20% depreciation cap, 10 days, 30 days, at least 5 minutes, 2022-01-01.

## Duplicate check
- No rental-vehicle accident column exists. zh 086 is about the cost of a replacement car while one's own car is repaired. Township mediation's core effect (Art. 27) appears in zh 082/522, but those columns cover rescission and complaint withdrawal, not rental disputes. zh links to 082.

## Front matter
- topic "litigation" with tags ["traffic-accidents", "traffic-compensation"], following FRONTMATTER.md (traffic board) and how existing traffic columns are tagged.
- No `diagram`/`diagram_after` field: I was told not to create images, and a diagram id has to be registered in src/data/traffic-still-diagrams.ts. FRONTMATTER.md says each traffic hub column links one diagram, and `traffic-diagrams.test.tsx` checks hub-linked columns. The integrator must either assign a diagram or confirm that the tag alone does not trigger the hub test.

## Slug
taiwan-rental-scooter-car-accident-repair-loss-of-use-mediation (0 matches).

## Open risks
1. Car-rental terms: the only version I found is the 2015 amendment (EY site). A later revision was not found but cannot be ruled out.
2. Rental terms are mandatory content for standard-form contracts. An individual contract that departs from them raises a consumer-protection question, and the drafts do not analyse its validity in detail.
3. Diagram requirement for traffic-tagged columns (see above).
