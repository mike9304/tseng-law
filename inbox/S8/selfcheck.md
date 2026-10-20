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
