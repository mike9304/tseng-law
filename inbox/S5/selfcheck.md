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


## 2026-10-20 21:11 KST — no-byline rule (TASK.md 2026-10-20; Astra r2 on S1–S3)
I removed the lawyer's name and title from the contact line in ko/ja/en/zh. The line now gives the firm, wei@hoveringlaw.com.tw and the Taichung address (19號6樓之1) only. This topic cites no court judgments (S6 cites J.Y. Interpretation 726, which has no appeal history). Variety rechecked:
    drafts/S5/ko.md [ko] sentences=37 mean=40.3 cv=0.579 short=0.189 run3=0.0 opener_rep=0.0 cite_end=0.081 cite_para=0.538 contrast=0 caveat=0 q=1
    drafts/S5/ja.md [ja] sentences=36 mean=44.1 cv=0.552 short=0.083 run3=0.029 opener_rep=0.077 cite_end=0.111 cite_para=0.538 contrast=0 caveat=1 q=0
    drafts/S5/en.md [en] sentences=38 mean=18.8 cv=0.611 short=0.237 run3=0.0 opener_rep=0.25 cite_end=0.053 cite_para=0.583 contrast=1 caveat=0 q=1
    drafts/S5/zh.md [ko] sentences=30 mean=40.8 cv=0.52 short=0.167 run3=0.036 opener_rep=0.0 cite_end=0.1 cite_para=0.583 contrast=0 caveat=0 q=1


## Astra r1 response (2026-10-20 21:17 KST)
1. MAJOR, widow eligibility: zh opening and en summary now give both conditions (not remarried + continuing contact with the late spouse's relatives, contact waived if the marriage lasted 2+ years). ko/ja/zh summaries match.
2. MAJOR, criminal record: in all four locales it now means a criminal case on the police criminal record certificate, kept separate from the conduct requirement (Art. 3(1)(3)).
3. MAJOR, en Art. 7(1)(2): "more than" NT$5 million, Taiwan income averaged over the most recent year, property in Taiwan. The comparison is limited to routes covered by 7(1)(2) (e.g. the general five-year route).
4. MAJOR, certificate issuer: "issued by a Taiwan government agency" (x4). Other evidence is listed as a separate option assessed by the MOI.
5. MAJOR, zh: the substantive requirement is separated from the proof; APRC holders may omit the proof (Art. 9(3)). The same sentence is added in ko/ja/en.
6. MINOR, child category: summaries and FAQ 2 use the capacity wording and all three alternatives (x4).
7. MINOR, closing: the "lapse" sentence is replaced by "the certificate must be valid when you apply" (x4).
8. MINOR, sequence: the application is filed at the domicile's household registration office and goes through the city/county government to the MOI (Art. 2(2)), with the review and record checks under Art. 8 (x4). Art. 2 and 9 are added to the sources.
Variety (FAIL 0):
    drafts/S5/ko.md [ko] sentences=39 mean=42.2 cv=0.644 short=0.179 run3=0.0 opener_rep=0.0 cite_end=0.154 cite_para=0.538 contrast=0 caveat=0 q=1
    drafts/S5/ja.md [ja] sentences=39 mean=45.7 cv=0.634 short=0.103 run3=0.027 opener_rep=0.0 cite_end=0.179 cite_para=0.538 contrast=0 caveat=1 q=0
    drafts/S5/en.md [en] sentences=39 mean=20.9 cv=0.658 short=0.179 run3=0.0 opener_rep=0.25 cite_end=0.103 cite_para=0.583 contrast=2 caveat=0 q=1
    drafts/S5/zh.md [ko] sentences=31 mean=44.5 cv=0.54 short=0.097 run3=0.0 opener_rep=0.0 cite_end=0.194 cite_para=0.583 contrast=0 caveat=0 q=1
Lengths: ko 1,746+ chars, ja 1,860, zh 1,472, en 820 words (all in range).

## zh-hant variety recheck (2026-10-21)

Note: earlier zh.md runs in this file show [ko] because variety_metrics.py guess_lang() maps a file named zh.md to the default (ko). From this round on, zh.md is checked with --lang zh-hant (short-sentence threshold 12 chars).
Variety (2026-10-21, explicit --lang for each file):
    drafts/S5/ko.md [ko] sentences=39 mean=42.2 cv=0.644 short=0.179 run3=0.0 opener_rep=0.0 cite_end=0.154 cite_para=0.538 contrast=0 caveat=0 q=1
      WARN opens with the stock hypothetical ("가령/例えば…とします/Suppose…/假設") — allowed at most 1 in 4 columns; prefer a concrete fact, number, question or scene
      WARN 80% of sentences end in '니다.' — vary endings within the register
    drafts/S5/ja.md [ja] sentences=39 mean=45.7 cv=0.634 short=0.103 run3=0.027 opener_rep=0.0 cite_end=0.179 cite_para=0.538 contrast=0 caveat=1 q=0
      OK — no variety limit violated
    drafts/S5/en.md [en] sentences=39 mean=20.9 cv=0.658 short=0.179 run3=0.0 opener_rep=0.25 cite_end=0.103 cite_para=0.583 contrast=2 caveat=0 q=1
      OK — no variety limit violated
    drafts/S5/zh.md [zh-hant] sentences=31 mean=44.5 cv=0.54 short=0.097 run3=0.0 opener_rep=0.0 cite_end=0.194 cite_para=0.583 contrast=0 caveat=0 q=1
      OK — no variety limit violated
Lengths:
    drafts/S5/ko.md chars(no space)= 1746 chars(with space)= 2275 en-words= 120
    drafts/S5/ja.md chars(no space)= 1862 chars(with space)= 1893 en-words= 51
    drafts/S5/en.md chars(no space)= 4156 chars(with space)= 4975 en-words= 820
    drafts/S5/zh.md chars(no space)= 1471 chars(with space)= 1503 en-words= 35

## Astra r2 fixes (2026-10-21)
1. MAJOR ko/ja/en (+zh proactive): Immigration Act 31(4)(3) comparison now says 'minor child with household registration in Taiwan' (在臺灣地區已設有戶籍) and lists all three alternatives (actual upbringing / exercising-bearing rights and duties / contact). zh already had 設籍 but lacked 行使負擔權利義務; added. Each locale adds that Nationality Act 4(1)(3) defines the child by nationality + capacity, not household registration (MOJ text checked 2026-10-21).
2. MINOR ja: 行為能力がない、または行為能力が制限されている台湾籍の子 (summary, FAQ2, body).
3. MINOR en summary: 'foreigners whose Taiwanese spouse has died, if they have not remarried and remain in contact...' with conditions kept.
4. MINOR ko: redundant second opening paragraph deleted.
5. MINOR zh: 「國籍法把這條路留給了幾種『已經不是配偶』的人。」 deleted.
Variety (2026-10-21, explicit --lang):
    ko.md [ko] sentences=39 mean=43.0 cv=0.637 short=0.154 run3=0.0 opener_rep=0.0 cite_end=0.154 cite_para=0.583 contrast=1 caveat=1 q=1
      WARN opens with the stock hypothetical ("가령/例えば…とします/Suppose…/假設") — allowed at most 1 in 4 columns; prefer a concrete fact, number, question or scene
      WARN 80% of sentences end in '니다.' — vary endings within the register
    ja.md [ja] sentences=41 mean=45.3 cv=0.631 short=0.098 run3=0.026 opener_rep=0.0 cite_end=0.171 cite_para=0.538 contrast=1 caveat=2 q=0
      WARN 76% of sentences end in 'desu-masu' — vary endings within the register
    en.md [en] sentences=39 mean=21.6 cv=0.666 short=0.179 run3=0.0 opener_rep=0.25 cite_end=0.103 cite_para=0.583 contrast=2 caveat=0 q=1
      OK — no variety limit violated
    zh.md [zh-hant] sentences=30 mean=46.8 cv=0.522 short=0.1 run3=0.0 opener_rep=0.0 cite_end=0.2 cite_para=0.583 contrast=0 caveat=0 q=1
      OK — no variety limit violated
