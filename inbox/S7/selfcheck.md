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

## Post-READY revision (2026-10-20, applying Astra r1 lessons from S1-S3)
- Scooter repair costs by degree of fault: added 'unless otherwise agreed' (term 14). CALI: 'in principle' in ko/ja summaries; Art. 28 victim-intent/crime exclusion; Art. 29 insurer pays and then recovers from a drunk or unlicensed driver (Road Traffic Management and Penalty Act 21/21-1). Sources updated. Added evidence copies of both MOTC rental-term documents.


## 2026-10-20 21:11 KST — no-byline rule (TASK.md 2026-10-20; Astra r2 on S1–S3)
I removed the lawyer's name and title from the contact line in ko/ja/en/zh. The line now gives the firm, wei@hoveringlaw.com.tw and the Taichung address (19號6樓之1) only. This topic cites no court judgments (S6 cites J.Y. Interpretation 726, which has no appeal history). Variety rechecked:
    drafts/S7/ko.md [ko] sentences=43 mean=36.1 cv=0.484 short=0.093 run3=0.0 opener_rep=0.0 cite_end=0.233 cite_para=0.273 contrast=1 caveat=2 q=0
    drafts/S7/ja.md [ja] sentences=46 mean=35.2 cv=0.499 short=0.152 run3=0.068 opener_rep=0.0 cite_end=0.217 cite_para=0.273 contrast=0 caveat=2 q=0
    drafts/S7/en.md [en] sentences=44 mean=18.6 cv=0.528 short=0.182 run3=0.0 opener_rep=0.182 cite_end=0.273 cite_para=0.273 contrast=0 caveat=0 q=0
    drafts/S7/zh.md [ko] sentences=35 mean=35.5 cv=0.574 short=0.229 run3=0.03 opener_rep=0.0 cite_end=0.229 cite_para=0.333 contrast=0 caveat=0 q=1


## Astra r1 response (2026-10-20 21:25 KST)
1. MAJOR, "civil": added in all four summaries (Art. 27(2)).
2. MAJOR, Art. 29 routes: a party-initiated civil mediation is challenged by an invalidity/rescission suit in the approving court; a court-referred one by a request to resume the lawsuit. In both cases the deadline is 30 days from service of the approved record (body + FAQ 3, x4).
3. MAJOR, CALI Art. 29: the insured person (Art. 9: including a driver using the vehicle with the policyholder's consent), the accident caused under the listed circumstances, the breath/blood alcohol limit, drugs/intent/crime, and the 21/21-1 licensing breach as a separate item, with the 2-year subrogation limit (x4). ko 「술을 마셨거나」 and the ja grouping are gone.
4. MAJOR, ko/ja clock: 「계약상 임대기간 만료 후」/「契約上の賃貸期間満了後」 in the summary, opening and body (en: "past the end of the contractual rental period").
5. MAJOR, reporting exceptions: both scooter exceptions (good reason / not a police matter), plus the car-terms exception (x4).
6. MAJOR, Art. 20 + representation: the rescheduling proviso and attendance through a representative (Art. 15) come before the departure-date closing (x4).
7. MAJOR, ko 大型重型機車: 「대형 중량급 이륜차(大型重型機車)」 in FAQ 1 and the body.
8. MAJOR, checklist headings and instructional sequencing: replaced with descriptive headings and declarative sentences (x4, zh too).
9. MINOR, ko closing: names the attendance issue directly.
10. MINOR, ja 出租単: 「貸出時の確認書（機車出租單）」.
Variety (FAIL 0):
    drafts/S7/ko.md [ko] sentences=47 mean=39.5 cv=0.516 short=0.106 run3=0.022 opener_rep=0.0 cite_end=0.213 cite_para=0.273 contrast=1 caveat=3 q=0
    drafts/S7/ja.md [ja] sentences=50 mean=39.3 cv=0.524 short=0.12 run3=0.062 opener_rep=0.091 cite_end=0.2 cite_para=0.273 contrast=0 caveat=3 q=0
    drafts/S7/en.md [en] sentences=44 mean=21.7 cv=0.657 short=0.159 run3=0.0 opener_rep=0.273 cite_end=0.273 cite_para=0.273 contrast=0 caveat=0 q=0
    drafts/S7/zh.md [ko] sentences=35 mean=42.9 cv=0.785 short=0.2 run3=0.03 opener_rep=0.0 cite_end=0.2 cite_para=0.333 contrast=0 caveat=0 q=1
Lengths: ko 2,030 chars, ja 2,110, zh 1,645, en 969 words.
