# A7 selfcheck (2026-10-20)

## Variety check (re-run after Astra r1 fixes, 2026-10-20 20:5x KST)
```
drafts/A7/ko.md [ko] sentences=42 mean=40.0 cv=0.489 short=0.119 run3=0.05 opener_rep=0.083 cite_end=0.262 cite_para=0.667 contrast=1 caveat=1 q=3
  OK — no variety limit violated
drafts/A7/ja.md [ja] sentences=45 mean=40.0 cv=0.532 short=0.156 run3=0.0 opener_rep=0.167 cite_end=0.2 cite_para=0.667 contrast=0 caveat=0 q=0
  OK — no variety limit violated
drafts/A7/en.md [en] sentences=38 mean=23.6 cv=0.544 short=0.211 run3=0.056 opener_rep=0.083 cite_end=0.211 cite_para=0.667 contrast=2 caveat=0 q=2
  OK — no variety limit violated
drafts/A7/zh.md [zh-hant] sentences=30 mean=45.3 cv=0.726 short=0.2 run3=0.0 opener_rep=0.083 cite_end=0.3 cite_para=0.75 contrast=0 caveat=0 q=3
  OK — no variety limit violated
```
FAIL 0 in all four.

## Length
```
drafts/A7/en.md words 885
drafts/A7/ja.md chars_nospace 1948 chars_with_space 1980
drafts/A7/ko.md chars_nospace 1881 chars_with_space 2427
drafts/A7/zh.md chars_nospace 1498 chars_with_space 1530
```

## Duplicate check
Queued angle (dissolution, liquidation, deregistration, tax clearance before repatriation) is covered in all four locales by 002 (capital/assets, incl. suspension), 055 (dissolution/liquidation and remitting remaining cash), 343 (liquidation tax filings, Art. 334 already cited), 632 (creditor claim notice) and 606 (unpaid wages). No column cites Company Act Arts. 10, 89, 397 or 26-2 (grep of pcode=J0080001&flno=…). Chosen narrower angle: a subsidiary left dormant without filings — ordered dissolution (Art. 10), revocation of registration (Art. 397), the liquidation duty that survives (Arts. 24–26, 322, 87, 89, 334, 113), liquidators as responsible persons and de facto directors (Art. 8), and Art. 26-2. Links to 002/055/343 for the formal route. Slug `dormant-taiwan-subsidiary-ordered-dissolution-liquidation-duty`: 0 matches.

## Voice self-check
- Openings: ko = labelled scene, ja = reader question, en = number ("Six months."), zh = fact about the 6-month period. Short sentences present; contrast ≤2; no bold/emoji/checklist headings; ko 합니다체; ja です・ます.

## Open risks
- Resolved before READY: inspection duty now split by company type (Art. 326 for companies limited by shares; Art. 87 I–II via Art. 113 for limited companies).
- Art. 26-2 "presupposes" reading is interpretive.
- No judgment or MOEA statistic cited for how often Art. 10 / 397 are used.

## Astra r1 fixes (2026-10-20)
- 7/7 findings applied: Art.10(3) final-judgment/6-month/authority-deadline conditions + 10(4) pre-order submission exception (ko/ja/en); liquidator default split by company type — 股份有限公司 Art.322 directors, 有限公司 Art.113→79 all shareholders, 81 court appointment (summary, FAQ2, body; all four); Art.397 headings 'may be revoked' + no-timely-objection/insufficient-grounds condition (ko/ja/zh body; en body+FAQ3 aligned); ko checklist heading/fragment removed; line-39 conclusions qualified to 'where the director default applies' (all four); ko 해산 결정 (also ja 裁判所の決定による解散); en 'Article 87(1)–(2), as applied through Article 113' (ko/ja/zh aligned).
- Arts. 10, 79, 81, 113, 322, 397 re-fetched live from LawSingle 2026-10-20 20:4x KST.

## Astra r2 re-check (2026-10-21 ~00:05 KST)
- variety FAIL 0 (ko/ja/en; zh --lang zh-hant). links.py BAD 0. YAML OK x4; faq 3; featured_image TBD; no 曾雋崴; no bold.
- Lengths (blen.py): en 904 words, ko 1,910 chars without spaces, ja 1,978, zh 1,491.

## Astra r3 (2026-10-21)
1. MAJOR Art. 8(3) proviso (x4): re-fetched live (LawSingle J0080001 flno=8: 「但政府為發展經濟、促進社會安定或其他增進公共利益等情形，對政府指派之董事所為之指揮，不適用之」). Each locale now states both limits — the government itself gives the direction, to directors it appointed, for economic development / social stability / other public interest — as a separate sentence after the Art. 8(3) citation.
2. MINOR ja FAQ2: split into 「…その定めや選任に従います。清算人を定められないときは、利害関係人の申請により、裁判所が選任できます」.
3. MINOR ja summary announcement sentence deleted.
4. MINOR Art. 7(1) (x4): inline LawSingle link added and 第7条/제7조/Art. 7/第7條 added to each source list (Art. 7 re-fetched live: 設立登記時或設立登記後三十日內檢送會計師查核簽證文件).
Checks: variety OK ko/ja/en/zh, links BAD 0, YAML OK x4 (faq 3 each), ko 1,949 / ja 2,015 / zh 1,525 chars, en ~930 words; no lawyer name, no bold.
