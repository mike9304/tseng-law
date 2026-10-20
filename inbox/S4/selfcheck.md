# S4 selfcheck

## variety_metrics.py check (2026-10-20)
```
ko.md [ko] sentences=38 mean=37.7 cv=0.494 short=0.132 run3=0.111 opener_rep=0.0 cite_end=0.132 cite_para=0.333 contrast=0 caveat=0 q=2
  WARN 79% of sentences end in '니다.' — vary endings within the register
ja.md [ja] sentences=41 mean=38.0 cv=0.474 short=0.171 run3=0.128 opener_rep=0.083 cite_end=0.122 cite_para=0.333 contrast=0 caveat=0 q=0
  WARN opens with the stock hypothetical ("가령/例えば…とします/Suppose…/假設") — allowed at most 1 in 4 columns; prefer a concrete fact, number, question or scene
  WARN 76% of sentences end in 'desu-masu' — vary endings within the register
en.md [en] sentences=35 mean=20.4 cv=0.486 short=0.171 run3=0.121 opener_rep=0.083 cite_end=0.114 cite_para=0.333 contrast=1 caveat=0 q=1
  OK — no variety limit violated
zh.md [zh-hant] sentences=30 mean=40.2 cv=0.599 short=0.2 run3=0.0 opener_rep=0.0 cite_end=0.1 cite_para=0.308 contrast=0 caveat=0 q=2
  OK — no variety limit violated
```

## length
```
ko.md chars(no space)= 1511 chars(with space)= 1946 en-words= 97
ja.md chars(no space)= 1621 chars(with space)= 1652 en-words= 32
zh.md chars(no space)= 1278 chars(with space)= 1312 en-words= 24
en.md words(whitespace)= 709
```

FAIL 0 in all four files. ja raises one WARN for a scene in the opening paragraph. It is labelled （架空の例です）, and it is the only scene opening among the four ja columns S1–S4 (limit: 1 in 4). The remaining WARNs flag polite-register endings, which the house style requires.

## Self-check (section 5)
2. Openings: ko opens with a question, ja with a labelled scene, en with a fact ("tax authorities will search… if an heir asks"), and zh with a number ("十二類。"). Batch S1–S4 per locale: ko ①④⑥②, ja ②⑤①③, en ⑤③④①, zh ⑥②⑤④. No opening type repeats within a locale.
3. Short sentences: ko 13%, ja 17%, en 17%, zh 20%.
4. Paragraph openers: every word opens 2 or fewer paragraphs.
5. Paragraphs without citations: the opening, the "applying from overseas" and "how the answer arrives" sections (which rest on the directive, cited in sources), and the closing. No caveat-led paragraph sequence.
6. Contrast templates: en 1, others 0.
7. The ending is tied to this column's facts: the 6-month deadline, the time authentication takes, and the search request. The contact line is one sentence.
8. Register: ko and ja are consistent. No bold. No imperatives. I removed frequency claims (ko: "연장 신청을 함께 하는 경우가 많은"; en: "Most heirs abroad"; zh: "往往").
9. Facts and figures (12 types, base date = date of death, Wednesday batch, 10 working days, 30–90 days, 9 months, 6 months + up to 3 months, Arts. 1/6/8/23/26/41/42) match facts.md and are consistent across the four languages.

## Duplicate check
- See STATUS: estate tax basics, amounts and the Sept-2026 amendment (231), foreign decedent (025), foreign heir land registration (026), registration deadline (230), renunciation from Japan (233) and the Korean decedent case (249) are already covered. A grep for 金融遺產/聯合查詢/財產參考清單/금융유산/financial estate inquiry found no column on the single-window inquiry (ko 197 mentions asset tracing only in a divorce context).

## Slug
taiwan-deceased-parent-financial-assets-inquiry-heirs-abroad (0 filename matches).

## Open risks
1. The directive text comes from a New Taipei City tax office copy, not from a MOF law database page (I could not locate one). The version is the 2024-01-01 one. A later amendment was not found but cannot be ruled out.
2. Art. 26: the drafts say "up to three months" and omit the force-majeure exception, which lets the tax office set a longer period. FAQ/body could add it if Astra wants.
3. Online eligibility for heirs abroad: the drafts say only that the listed e-credentials are required, and they make no claim about whether foreigners can obtain them.
4. Art. 42 "public and private enterprises" is applied to banks (a bank is a private enterprise). This is reasonable, but the article's text does not name banks.

## Post-READY revision (2026-10-20, applying Astra r1 lessons from S1-S3)
- Art. 26: added the force-majeure / special-circumstances exception to the 3-month extension (all 4). Added evidence/mof-financial-estate-inquiry-directive.txt (full directive text, MOF order of 2023-12-26).

## Astra r1 fixes (2026-10-20 KST) — ASTRA-FAIL.md → ASTRA-FAIL-fixed-1.md
1. Art. 26 three-month cap: the force-majeure/special-circumstances exception was already in all four bodies (proactive pass, 19:37). Rechecked, no "3개월까지"-type absolute remains.
2. Download window: corrected to "a 90-day window opening 30 days after the application" in all four (process sheet p.4).
3. Delivery routes: new section in all four. JCIC mails its own credit report (loans/cards) separately by registered post about 5 working days after the weekly pickup; the tax-office reference list shows only its mailing date; the other results come by the route chosen (tax-office registered mail / site download / e-filing software).
4. Art. 8: the body now states the general bar (division, delivery of bequests, transfer registration) together with the proviso (advance consent-to-transfer certificate, exemption certificate, exclusion certificate); en uses "transfers may not be registered" / "registering a transfer of title".
5. Bank "only": added MOF ruling 台財稅第841611225號 (balance ≤ NT$200,000 → no tax certificate needed; the deposit must still be reported) to the body, FAQ 3 and the summary in all four, with the document-waiver vs reporting-duty distinction stated explicitly.
6. Residence: ko/ja (and en/zh for consistency) now use the statutory "經常居住境內" test with Art. 4 linked and explained (2-year domicile, or residence plus >365 days, with the government-hire proviso); the Art. 23(2) filing office is tied to that test.
7. 人身保險: ko 인신보험(人身保險), ja 人身保険, en personal insurance (人身保險). Insurance Act Art. 13 scope added, plus the process-sheet limit (only policies where the deceased was policyholder and not the insured; reserve value) and the statement that a policy on the parent's own life does not appear.
8. Summaries ko/ja/en now state both conditions: a Taiwan national with an ID number, and an heir who has not renounced.
9. en "save months of letters" replaced with "one application can cover inquiries to multiple institutions."
10. ko/ja/zh "all financial institutions" replaced with the bodies/institutions listed in the directive and their members (opening + list paragraph).
11. ja closing: replaced with Astra's sentence "葬儀後の早い段階で照会を申し込むと、申告の準備を進めやすくなります。"
Also proactive: Art. 23(1) proviso (court-appointed administrator → runs from the day after appointment) added x4. Sources sections now cite the MOF regulations database (GL010834), the process sheet, ruling GL006995, Art. 4 and Insurance Act Art. 13.
featured_image "TBD" kept: user decision A via son-bridge (IN-claude-20261020-195011). The integrator adds the image and the 4 alts before deploy.


## 2026-10-20 21:11 KST — no-byline rule (TASK.md 2026-10-20; Astra r2 on S1–S3)
I removed the lawyer's name and title from the contact line in ko/ja/en/zh. The line now gives the firm, wei@hoveringlaw.com.tw and the Taichung address (19號6樓之1) only. This topic cites no court judgments (S6 cites J.Y. Interpretation 726, which has no appeal history). Variety rechecked:
    drafts/S4/ko.md [ko] sentences=53 mean=41.7 cv=0.478 short=0.094 run3=0.039 opener_rep=0.0 cite_end=0.094 cite_para=0.333 contrast=1 caveat=0 q=2
    drafts/S4/ja.md [ja] sentences=56 mean=42.4 cv=0.51 short=0.161 run3=0.111 opener_rep=0.067 cite_end=0.089 cite_para=0.333 contrast=1 caveat=0 q=0
    drafts/S4/en.md [en] sentences=50 mean=21.8 cv=0.521 short=0.12 run3=0.042 opener_rep=0.067 cite_end=0.08 cite_para=0.333 contrast=1 caveat=0 q=1
    drafts/S4/zh.md [ko] sentences=41 mean=44.4 cv=0.602 short=0.171 run3=0.0 opener_rep=0.0 cite_end=0.122 cite_para=0.312 contrast=0 caveat=0 q=2


## Astra r2 response (2026-10-20 21:13 KST)
1–4. MAJOR, lawyer name: removed (x4), as in the 21:11 note.
5. MAJOR, mortgage alternative (FAQ 3, x4): now "real estate that meets Tax Collection Act Art. 11-1, mortgaged to the tax authority", with Art. 11-1 linked inline and in the sources.
6. MAJOR, zh counter route: online application is open to anyone abroad who can use an accepted credential; the counter (in person or through an agent) is for those who cannot. The passport rule applies to counter applicants without a national ID.
7. MAJOR, hypothetical labels: en and zh opening scenes are now labelled.
8. MINOR, ko/ja certificate list: the payment certificate is now named with the others (Art. 42). en gets the same fix.
9. MINOR, ko: statutory residence wording, with the Chinese term in brackets.
10. MINOR, en: "Insurance replies cover a narrow category of policies." Proactively, the ko/ja openers of the same paragraph ("좁게 읽어야", "狭く読む必要") are now descriptive, not instructions.
Variety (FAIL 0):
    drafts/S4/ko.md [ko] sentences=54 mean=41.8 cv=0.486 short=0.093 run3=0.038 opener_rep=0.0 cite_end=0.093 cite_para=0.333 contrast=1 caveat=0 q=2
    drafts/S4/ja.md [ja] sentences=56 mean=43.1 cv=0.501 short=0.143 run3=0.111 opener_rep=0.067 cite_end=0.089 cite_para=0.333 contrast=1 caveat=0 q=0
    drafts/S4/en.md [en] sentences=51 mean=21.5 cv=0.524 short=0.137 run3=0.041 opener_rep=0.067 cite_end=0.098 cite_para=0.333 contrast=1 caveat=0 q=1
    drafts/S4/zh.md [ko] sentences=43 mean=43.0 cv=0.611 short=0.186 run3=0.0 opener_rep=0.0 cite_end=0.116 cite_para=0.312 contrast=0 caveat=0 q=2
Lengths: ko 2,397 chars, ja 2,529, zh 1,942, en 1,099 words.

## zh-hant variety recheck (2026-10-21)

Note: earlier zh.md runs in this file show [ko] because variety_metrics.py guess_lang() maps a file named zh.md to the default (ko). From this round on, zh.md is checked with --lang zh-hant (short-sentence threshold 12 chars).
Variety (2026-10-21, explicit --lang for each file):
    drafts/S4/ko.md [ko] sentences=54 mean=41.8 cv=0.486 short=0.093 run3=0.038 opener_rep=0.0 cite_end=0.093 cite_para=0.333 contrast=1 caveat=0 q=2
      WARN 83% of sentences end in '니다.' — vary endings within the register
    drafts/S4/ja.md [ja] sentences=56 mean=43.1 cv=0.501 short=0.143 run3=0.111 opener_rep=0.067 cite_end=0.089 cite_para=0.333 contrast=1 caveat=0 q=0
      WARN opens with the stock hypothetical ("가령/例えば…とします/Suppose…/假設") — allowed at most 1 in 4 columns; prefer a concrete fact, number, question or scene
      WARN 80% of sentences end in 'desu-masu' — vary endings within the register
    drafts/S4/en.md [en] sentences=51 mean=21.5 cv=0.524 short=0.137 run3=0.041 opener_rep=0.067 cite_end=0.098 cite_para=0.333 contrast=1 caveat=0 q=1
      OK — no variety limit violated
    drafts/S4/zh.md [zh-hant] sentences=43 mean=43.0 cv=0.611 short=0.163 run3=0.0 opener_rep=0.0 cite_end=0.116 cite_para=0.312 contrast=0 caveat=0 q=2
      OK — no variety limit violated
Lengths:
    drafts/S4/ko.md chars(no space)= 2395 chars(with space)= 3083 en-words= 141
    drafts/S4/ja.md chars(no space)= 2529 chars(with space)= 2568 en-words= 44
    drafts/S4/en.md chars(no space)= 5694 chars(with space)= 6804 en-words= 1099
    drafts/S4/zh.md chars(no space)= 1942 chars(with space)= 1984 en-words= 34

## Astra r3 fix (2026-10-21)
1. MAJOR, zh Art 1174: 「要不要拋棄繼承，得在…以書面向法院表示」 implied a court filing either way. Now 「如果要拋棄繼承，須在知悉自己得繼承之時起三個月內，以書面向法院為之」, matching MOJ text 「前項拋棄，應於知悉其得繼承之時起三個月內，以書面向法院為之。」 ko/ja/en checked: they state the renunciation deadline or filing only (en: "Renunciation has to be filed in writing with a court within three months…"), so no change. zh variety (zh-hant) OK.

## Astra r4 re-check (10-21 02:10 KST)
    drafts/S4/ko.md [ko] sentences=55 mean=41.9 cv=0.481 short=0.091 run3=0.038 opener_rep=0.0 cite_end=0.091 cite_para=0.333 contrast=1 caveat=0 q=2
      WARN 84% of sentences end in '니다.' — vary endings within the register
    drafts/S4/ja.md [ja] sentences=58 mean=42.5 cv=0.505 short=0.155 run3=0.107 opener_rep=0.067 cite_end=0.086 cite_para=0.333 contrast=1 caveat=0 q=0
      WARN opens with the stock hypothetical ("가령/例えば…とします/Suppose…/假設") — allowed at most 1 in 4 columns; prefer a concrete fact, number, question or scene
      WARN 81% of sentences end in 'desu-masu' — vary endings within the register
    drafts/S4/en.md [en] sentences=51 mean=21.5 cv=0.543 short=0.157 run3=0.041 opener_rep=0.067 cite_end=0.098 cite_para=0.333 contrast=1 caveat=0 q=1
      OK — no variety limit violated
    drafts/S4/zh.md [zh-hant] sentences=44 mean=43.2 cv=0.6 short=0.159 run3=0.024 opener_rep=0.0 cite_end=0.114 cite_para=0.312 contrast=0 caveat=0 q=2
      OK — no variety limit violated
    drafts/S4/ko.md chars(no space)= 2457 chars(with space)= 3160 en-words= 142
    drafts/S4/ja.md chars(no space)= 2595 chars(with space)= 2634 en-words= 44
    drafts/S4/en.md chars(no space)= 5713 chars(with space)= 6824 en-words= 1099
    drafts/S4/zh.md chars(no space)= 1998 chars(with space)= 2040 en-words= 34
    Open risk: MOF regulations database still displays the 2023 text of the directive (10 bodies); the drafts cite the gazette order for the 2026-10-19 point-2 amendment.
