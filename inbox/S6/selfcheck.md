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

## Post-READY revision (2026-10-20, applying Astra r1 lessons from S1-S3)
- Art. 32: the overtime cap now includes 54 h/month (≤138 h per 3 months) with union or labor-management consent, plus the disaster/sudden-event exception (all 4). Added evidence copies: J.Y. 726 page text, MOL 84-1 page excerpt, MOL designated-worker list.


## 2026-10-20 21:20 KST — no-byline rule (TASK.md 2026-10-20; Astra r2 on S1–S3)
I removed the lawyer's name and title from the contact line in ko/ja/en/zh. The line now gives the firm, wei@hoveringlaw.com.tw and the Taichung address (19號6樓之1) only. This topic cites no court judgments (S6 cites J.Y. Interpretation 726, which has no appeal history). Variety rechecked:
    drafts/S6/ko.md [ko] sentences=37 mean=40.3 cv=0.466 short=0.108 run3=0.0 opener_rep=0.0 cite_end=0.108 cite_para=0.636 contrast=1 caveat=0 q=1
    drafts/S6/ja.md [ja] sentences=39 mean=39.6 cv=0.487 short=0.154 run3=0.0 opener_rep=0.0 cite_end=0.103 cite_para=0.583 contrast=0 caveat=0 q=0
    drafts/S6/en.md [en] sentences=39 mean=19.4 cv=0.504 short=0.205 run3=0.0 opener_rep=0.0 cite_end=0.128 cite_para=0.667 contrast=1 caveat=0 q=1
    drafts/S6/zh.md [ko] sentences=29 mean=41.9 cv=0.653 short=0.276 run3=0.0 opener_rep=0.0 cite_end=0.172 cite_para=0.727 contrast=0 caveat=0 q=1


## Astra r1 response (2026-10-20 21:55 KST)
1. MAJOR, framing: the ko/en titles and H1s were rewritten (ko 「근로시간을 따로 정해도 연장근로수당은 남는다」; en "\"You're Covered by the Responsibility System\": Taiwan's Article 84-1 and Overtime Pay"). The ja passage 「その説明が法律上通るのは…」 and the zh 「這句話要成立，至少得過三關」 now describe a special-hours arrangement and state that overtime beyond approved normal hours is still paid. The summaries say the same (x4). The en heading "No approval, no exemption" became "When the agreement was never approved".
2. MAJOR, manager test: management duties plus decision power over hiring, dismissal or working conditions (x4).
3. MAJOR, designated engineers: each list item now carries its Art. 50-1 qualification, and the actual duties must fit. The zh hypothetical engineer is tested against 50-1(2). ko/ja closings add the duties test.
4. MAJOR, 8h/40h: the rule is limited to an ordinary schedule; a lawful redistribution under Arts. 30(2)–(3)/30-1 moves the threshold (Enforcement Rules Art. 20-1, added to the sources).
5. MAJOR, consent route: union consent, LMC consent only where there is no union, and the 30-worker reporting duty for the 54-hour extension (x4).
6. MINOR, Art. 49: a current-law note on J.Y. 807 (Art. 49(1) without effect from 2021-08-20) in the body and FAQ 2 (x4), with J.Y. 807 in the sources.
7. MINOR, checklist headings: 「세 가지 조건」/「三つの条件」/"Three conditions, not one label"/「三個條件」 were replaced by issue-specific headings on which jobs and agreements Art. 84-1 covers.
Variety (FAIL 0):
    drafts/S6/ko.md [ko] sentences=43 mean=44.6 cv=0.512 short=0.093 run3=0.049 opener_rep=0.0 cite_end=0.116 cite_para=0.727 contrast=1 caveat=0 q=1
    drafts/S6/ja.md [ja] sentences=45 mean=44.4 cv=0.525 short=0.133 run3=0.023 opener_rep=0.0 cite_end=0.111 cite_para=0.75 contrast=0 caveat=0 q=0
    drafts/S6/en.md [en] sentences=45 mean=21.0 cv=0.577 short=0.178 run3=0.047 opener_rep=0.0 cite_end=0.133 cite_para=0.833 contrast=1 caveat=0 q=1
    drafts/S6/zh.md [ko] sentences=33 mean=47.3 cv=0.634 short=0.182 run3=0.0 opener_rep=0.0 cite_end=0.182 cite_para=0.818 contrast=0 caveat=0 q=1
Lengths: ko 2,070 chars, ja 2,132, zh 1,639, en 951 words.
