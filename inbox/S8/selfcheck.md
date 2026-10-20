# S8 selfcheck

## variety_metrics.py check (2026-10-20)
```
ko.md [ko] sentences=34 mean=38.1 cv=0.501 short=0.088 run3=0.031 opener_rep=0.0 cite_end=0.176 cite_para=0.385 contrast=0 caveat=1 q=0
  WARN 76% of sentences end in '니다.' — vary endings within the register
ja.md [ja] sentences=33 mean=39.9 cv=0.476 short=0.182 run3=0.0 opener_rep=0.0 cite_end=0.182 cite_para=0.385 contrast=0 caveat=0 q=0
  OK — no variety limit violated
en.md [en] sentences=41 mean=17.1 cv=0.503 short=0.195 run3=0.051 opener_rep=0.0 cite_end=0.049 cite_para=0.462 contrast=1 caveat=0 q=1
  OK — no variety limit violated
zh.md [zh-hant] sentences=29 mean=37.3 cv=0.566 short=0.103 run3=0.0 opener_rep=0.0 cite_end=0.103 cite_para=0.462 contrast=0 caveat=0 q=1
  OK — no variety limit violated
```

## length
```
ko.md chars(no space)= 1512 chars(with space)= 1932 en-words= 130
ja.md chars(no space)= 1509 chars(with space)= 1549 en-words= 72
zh.md chars(no space)= 1213 chars(with space)= 1254 en-words= 62
en.md words(whitespace)= 703
```

FAIL 0 in all four files. The remaining WARNs flag polite-register endings only.

## Self-check (section 5)
2. Openings: ko uses a fact (①: "severance is retirement income"), ja a number (④: "20万6,000台湾ドル。"), en a reader question (②), and zh a quotation of the statute text (⑥).
3. Short sentences: ko 9%, ja 18%, en 20%, zh 10%.
4. Paragraph openers: in en I fixed "A" appearing 3 times. Otherwise no word opens more than 2 paragraphs.
5. The opening, the example, and the "month you leave" lines carry no citations. There is no caveat chain.
6. Contrast templates: 0 or 1 per file.
7. The closing points to the documents to collect before leaving (Art. 92) and the tax-only scope, both facts specific to this column. The contact line is one sentence.
8. Register is consistent throughout. No bold. In en I removed the unsupported "Less than many departing employees fear" and replaced a vague "allowances can absorb much" with a factual sentence.
9. All figures match the MOF announcement and statutes in all four languages: 206,000 / 414,000 / 894,000; 6% / 18%; 183 days; 10 days; Feb 10; 5–40%; 610,000; 101,000 (ko/en/zh mention the exemption, ja the bracket only).

## Duplicate check
- 024 covers residency for mid-year arrival and departure (183 days, 31 days plus centre of life, filing before departure). 322 covers payroll withholding (18%/6%, 90 days). Neither covers 退職所得. A grep for 退職所得/퇴직소득/retirement income turned up only incidental en 344/253 mentions. The 2026 thresholds appear in no column.
- Links go to 024 and 322 in each locale.

## Slug
taiwan-severance-retirement-income-tax-foreign-employees-183-days (0 matches).

## Open risks
1. I did not compute the withholding base for the half-taxed band ("給付額減除定額免稅後之餘額") because it was not confirmed. The drafts state the rule verbatim and give no worked withholding figure.
2. Whether a particular "goodwill/transition" payment counts as 離職金/退職金 depends on the facts. The drafts say it "may" fall within the list.
3. The income-source question (service partly abroad for a group company) is not discussed.

## Post-READY revision (2026-10-20, applying Astra r1 lessons from S1-S3)
- Art. 71-1(2): added the proviso that a resident spouse staying in Taiwan files jointly. Art. 92: added the 5-day extension for 3+ consecutive holidays and the Feb 15 extension. Added evidence/mof-2026-amounts-announcement.txt (gazette text).


## 2026-10-20 21:11 KST — no-byline rule (TASK.md 2026-10-20; Astra r2 on S1–S3)
I removed the lawyer's name and title from the contact line in ko/ja/en/zh. The line now gives the firm, wei@hoveringlaw.com.tw and the Taichung address (19號6樓之1) only. This topic cites no court judgments (S6 cites J.Y. Interpretation 726, which has no appeal history). Variety rechecked:
    drafts/S8/ko.md [ko] sentences=36 mean=38.3 cv=0.48 short=0.083 run3=0.029 opener_rep=0.0 cite_end=0.167 cite_para=0.385 contrast=0 caveat=2 q=0
    drafts/S8/ja.md [ja] sentences=35 mean=40.3 cv=0.46 short=0.171 run3=0.03 opener_rep=0.0 cite_end=0.171 cite_para=0.385 contrast=0 caveat=1 q=0
    drafts/S8/en.md [en] sentences=43 mean=17.2 cv=0.498 short=0.186 run3=0.049 opener_rep=0.0 cite_end=0.047 cite_para=0.462 contrast=1 caveat=0 q=1
    drafts/S8/zh.md [ko] sentences=30 mean=38.4 cv=0.631 short=0.1 run3=0.0 opener_rep=0.0 cite_end=0.1 cite_para=0.462 contrast=0 caveat=0 q=1


## Astra r1 response (2026-10-20 21:28 KST)
1. MAJOR, 71-1(2): the departure filing applies to a resident who gives up a Taiwan domicile or residence and leaves; the resident-spouse exception is kept (x4).
2. MAJOR, proration: the annual amounts are marked as annual, and Art. 17-1 proration for departure returns is explained; the spouse's Art. 71 joint return is distinguished (17-1 is written for 71-1 returns) without stating more than the text says.
3. MAJOR, en salary deduction: it applies only in calculating salary income (not below zero), so it does not reduce retirement income.
4. MAJOR, en "So are refunds": deleted (Art. 94 refunds over-withheld tax).
5. MAJOR, NT$2,000 withholding exemption for residents (Withholding Standards Art. 13): added in the body (with "not tax-free"), the summaries and FAQ 3 (x4).
6. MAJOR, certificate delivery: Art. 92(1) filing/issuing deadlines incl. the holiday extensions; Art. 94-1 lets issuers skip delivery to residents in qualifying cases, but they must issue on request (x4).
7. MINOR, en: "Article 3 of the Withholding Standards" is named.
8. MINOR, headings: now about when the withholding statement is issued (x4).
9. MINOR, ja: 「税務当局に申告し、確認を受けてから」.
Variety (FAIL 0):
    drafts/S8/ko.md [ko] sentences=42 mean=39.1 cv=0.459 short=0.095 run3=0.075 opener_rep=0.0 cite_end=0.214 cite_para=0.385 contrast=0 caveat=3 q=0
    drafts/S8/ja.md [ja] sentences=40 mean=42.7 cv=0.45 short=0.15 run3=0.132 opener_rep=0.0 cite_end=0.2 cite_para=0.385 contrast=0 caveat=2 q=0
    drafts/S8/en.md [en] sentences=46 mean=19.7 cv=0.543 short=0.152 run3=0.023 opener_rep=0.0 cite_end=0.087 cite_para=0.462 contrast=1 caveat=0 q=1
    drafts/S8/zh.md [ko] sentences=32 mean=42.8 cv=0.662 short=0.094 run3=0.033 opener_rep=0.0 cite_end=0.156 cite_para=0.462 contrast=0 caveat=0 q=1
Lengths: ko 1,890 chars, ja 1,930, zh 1,530, en 926 words.

## zh-hant variety recheck (2026-10-21)

Note: earlier zh.md runs in this file show [ko] because variety_metrics.py guess_lang() maps a file named zh.md to the default (ko). From this round on, zh.md is checked with --lang zh-hant (short-sentence threshold 12 chars).
Variety (2026-10-21, explicit --lang for each file):
    drafts/S8/ko.md [ko] sentences=42 mean=39.1 cv=0.459 short=0.095 run3=0.075 opener_rep=0.0 cite_end=0.214 cite_para=0.385 contrast=0 caveat=3 q=0
      OK — no variety limit violated
    drafts/S8/ja.md [ja] sentences=40 mean=42.7 cv=0.45 short=0.15 run3=0.132 opener_rep=0.0 cite_end=0.2 cite_para=0.385 contrast=0 caveat=2 q=0
      OK — no variety limit violated
    drafts/S8/en.md [en] sentences=46 mean=19.7 cv=0.543 short=0.152 run3=0.023 opener_rep=0.0 cite_end=0.087 cite_para=0.462 contrast=1 caveat=0 q=1
      OK — no variety limit violated
    drafts/S8/zh.md [zh-hant] sentences=32 mean=42.8 cv=0.662 short=0.094 run3=0.033 opener_rep=0.0 cite_end=0.156 cite_para=0.462 contrast=1 caveat=1 q=1
      OK — no variety limit violated
Lengths:
    drafts/S8/ko.md chars(no space)= 1890 chars(with space)= 2420 en-words= 163
    drafts/S8/ja.md chars(no space)= 1932 chars(with space)= 1972 en-words= 95
    drafts/S8/en.md chars(no space)= 4417 chars(with space)= 5340 en-words= 926
    drafts/S8/zh.md chars(no space)= 1530 chars(with space)= 1571 en-words= 79
