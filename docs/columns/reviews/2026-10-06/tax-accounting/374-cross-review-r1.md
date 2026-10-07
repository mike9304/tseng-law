# T18 cross-review r1 — taiwan-unpaid-tax-exit-ban-responsible-person-liability

Reviewer: Lane B (Claude Fable 5.1), final gate. Date: 2026-10-07 (KST).
Files reviewed: drafts/T18/ko.md, ja.md, en.md, zh-hant.md, facts.md; research/R10-official.md, R10-statutes.md, T18-extra.md; topics/T18.md; brief-BATCH.md; brief-EDITORIAL-VOICE.md; shared/SENTENCE-VARIETY-RULE.md; images/T18.webp.

## Verdict

PASS — all four languages publishable now; image OK.

No major issue found. Every rate, threshold, date, article number, condition and procedure in the four drafts matches the official text I fetched myself today (see scope). The four language versions state the same law. UNVERIFIED items from the R10 list (non-resident individuals, branch 負責人 under §24/§47, current Administrative Enforcement Agency practice) do not appear as fact in any draft. Five minor wording edits applied (listed below); lint and variety metrics re-run and OK on all four files after the edits.

## Scope checked — official pages I opened (all on 2026-10-07, saved under reviews/T18/cross-sources/)

Statutes (law.moj.gov.tw via fetch_law.py → cross-sources/statutes.md; each law's header date read today):
- 稅捐稽徵法 (G0340001), 修正日期 民國110年12月17日 = 2021-12-17: §24, §39, §41, §42, §43, §47, §48-1
- 行政執行法 (A0030023), 修正日期 民國99年02月03日 = 2010-02-03: §17, §24
- 入出國及移民法 (D0080132), 修正日期 民國112年06月28日 = 2023-06-28: §21
- 公司法 (J0080001), 修正日期 民國114年12月26日 = 2025-12-26: §8, §372 (§372 opened only to confirm the branch question is left out)

MOF directions and pages:
- 限制及解除欠稅人或欠稅營利事業負責人出境規範, https://law-out.mof.gov.tw/LawContent.aspx?id=GL009873 — header 公發布日 103-12-31, 修正日期 111-08-19 (= 2022-08-19), 台財稅字第11104628550號令; full text points 一–六 → cross-sources/GL009873.html + GL009873.txt
- 第四點附表 PDF, https://law-out.mof.gov.tw/Download.ashx?FileID=48960&id=GL009873&type=LAW → cross-sources/GL009873-table.pdf (read as PDF; enterprise rows: 二百萬以上未達六百萬 / 三百萬以上未達九百萬 → 隱匿或移轉財產跡象; 六百萬以上未達二千萬 / 九百萬以上未達三千萬 → 營業狀況異常 / 負責人出國頻繁 / 長期滯留國外 / 行蹤不明 / 隱匿或移轉財產 any one; 二千萬以上 / 三千萬以上 → no further condition)
- 財政部稅務入口網 稅務問與答 0320, https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/tax-collection-act/collection/xY8r6v2 — 更新日期 111-11-08 (= 2022-11-08) → cross-sources/etax-0320.html + .txt
- 財政部各稅法令函釋檢索系統 (ttc.mof.gov.tw, 稅捐稽徵法令彙編 一一三年版 confirmed in the API response), fetched via POST /Api/PostData FunctionID=FB12001 → cross-sources/ttc-rulings.md and ttc-<TaxSN>.json:
  - 131536 財政部68/07/18台財稅第34927號函 (負責人 = 法定代理人; 董事長 or 執行業務而代表公司之股東)
  - 131543 財政部74/02/22台財稅第12122號函 + 104/09/04台財稅字第10404625180號令 (暫繳稅款 no exception)
  - 131574 財政部96/05/22台財稅字第09604518240號函 (法人董事之負責人 not a target)
  - 131578 財政部99/09/01台財稅字第09900156850號函 (all listed tax and fines must be paid)
  - 131579 財政部98/06/11台財稅字第09800243530號令 ("全部" = only amounts reported for the ban)
  - 131925 財政部96/04/11台財稅字第09600142790號函 (company's 營業稅法 §51 fine and 負責人's §41/§47 penalty both apply)
  - 131555 財政部87/08/27台財稅第871958556號函 (not cited by the drafts; opened for context only)
- 內政部移民署「居住臺灣地區設有戶籍國民查詢有無經禁止出國」, https://www.immigration.gov.tw/5385/7244/7250/7254/15553/16511/ — 發布日期 2022-03-22, 更新日期 2022-07-08 → cross-sources/nia-check.html + .txt

Tools run (before and after edits): `python3 lint.py <file> <lang> taiwan-unpaid-tax-exit-ban-responsible-person-liability` → OK ×4 (ko 3,449 chars; ja 3,966; en 1,590 words; zh-hant 2,680). `python3 shared/variety/variety_metrics.py check <file> --lang <lang>` → OK ×4, no FAIL line (ko cv 0.56 short 10.8% opener_rep 0.048; ja cv 0.56 short 9.6%; en cv 0.57 short 20.3%; zh cv 0.60 short 12.2%; contrast 0 in all).

## 1. Law and facts — item-by-item result (all four languages)

| Claim in drafts | Official text | Result |
|---|---|---|
| Exit ban: enterprise in Taiwan, final tax overdue, unpaid tax + final 罰鍰 singly or combined ≥ NT$2M; ≥ NT$3M before administrative remedies end; MOF asks NIA; for an enterprise its 負責人 | 稅捐稽徵法 §24 III (fetched) | ✓ all four |
| Carve-outs: adequate security given, or no prior preservation measure under §24 I(1) first clause / I(2) | §24 III proviso; 規範 pt 二 | ✓ |
| Property equal to the tax already under 禁止處分 → no exit-ban review | 規範 pt 三 III | ✓ |
| Amount: final = 本稅+滯納金+利息+滯報金+怠報金+附徵/代徵之捐+確定罰鍰; non-final excludes 罰鍰 and appeal interest | 規範 pt 五(一) | ✓ |
| 暫繳稅款 no exception | ruling 131543 | ✓ |
| Since 2015-01-01 amount alone suffices only in the top tier | Q&A 0320 (1)(1) | ✓ |
| Three enterprise bands and conditions | 附表 PDF (read directly) | ✓ table cells identical in all four |
| 出國頻繁 = 8 departures within 2 years before the ban is processed, incl. 大陸地區/香港/澳門; 長期滯留國外 = 183 consecutive days within prior year; excused if the person explains spouse/lineal-relative death abroad or other proper reason | 規範 pt 五(二)(三) | ✓ |
| Hypothetical NT$8M final + 9 trips → second band, frequent travel "can/may" satisfy | follows from the table + 五(二); labelled invented in all four | ✓ arithmetic/band correct |
| 負責人 = 法定代理人; 董事長 authorized by board/shareholders' meeting, or 執行業務而代表公司之股東 | ruling 131536 | ✓ |
| 負責人 of a 法人董事 cannot be barred | ruling 131574 | ✓ |
| Foreigners: NIA must bar on notice from 財稅機關; written notice + reason at the check | 入出國及移民法 §21 | ✓ |
| Written notice with reasons and remedies served when MOF requests; max 5 years from NIA's restriction date | §24 III(1)(2) | ✓ |
| Six lifting grounds incl. ground-3 exceptions | §24 IV | ✓ all four list the same six |
| Partial payment insufficient; "all" = amounts reported for the ban | rulings 131578 (2010), 131579 (2009) | ✓ |
| 1/3 of 復查決定 tax or security lifts a ban imposed under 規範 三 II(2); half if transferred to enforcement on or before 110-12-18 (2021-12-18); not if hiding assets | 規範 pt 六 II | ✓ |
| Unpaid 30 days after payment period → enforcement; 復查 suspends transfer | §39 I | ✓ |
| 行政執行法 §17: security + deadline + 限制住居 on listed grounds; not if arrears < NT$100,000 unless left the country twice; §24(4) applies to a company's 負責人 | §17 I, II(1); §24(4) | ✓ statute text only; no claim about current AEA practice (UNVERIFIED item respected) |
| §41: ≤5 yrs + ≤NT$10M; enterprise ≥NT$50M (individual ≥NT$10M) → 1–7 yrs + NT$10M–100M | §41 | ✓ |
| §42: ≤5 yrs, 拘役, or/and ≤NT$60,000 | §42 | ✓ |
| §43: ≤3 yrs + ≤NT$1M; +½ for tax officials, lawyers, CPAs, other agents | §43 I, II | ✓ |
| §47: criminal provisions apply to 公司法 負責人; person actually in charge if different | §47 | ✓ |
| 公司法 §8: 股份有限公司 負責人 = 董事; 經理人 etc. within duties | §8 I, II | ✓ |
| Company's 營業稅法 fine + 負責人's criminal penalty both apply | ruling 131925 | ✓ |
| §48-1: no report, no investigation → §41–§45 and tax-law evasion penalties waived; criminal penalty "may" be waived; daily interest at Post Office 1-yr fixed rate of 1 Jan each year | §48-1 I, III | ✓ |
| NIA: foreigners check in person or by proxy at service stations; free; no lookup of another person without consent/authorization | NIA page (二)(三), 申辦費用 | ✓ |
| Preservation measure released when taxpayer or third party gives adequate security | §24 II(1) 「於其範圍內」 | ✓ after minor edit (ko/ja/zh now carry the "to that extent" qualifier that en already had) |
| Amendment dates in sources sections (2021-12-17 / 2010-02-03 / 2023-06-28 / 2025-12-26 / 規範 2022-08-19 / Q&A 2022-11-08 / NIA 2022-07-08; ruling dates 1979-07-18, 1985-02-22 + 2015-09-04, 2007-04-11, 2007-05-22, 2009-06-11, 2010-09-01) | headers fetched today | ✓ |

Foreign-law statements: ko "한국 세무 전문가와 확인", ja "日本の税理士にご確認ください", en "a question for a US tax adviser" — general cautions only ✓. zh-hant has none ✓. No tax agreement mentioned (none needed for this topic).

UNVERIFIED items (topic brief binding notes) — confirmed absent: no statement about non-resident individuals under §24; no statement that a foreign company's branch 負責人 is covered by §24/§47 (branches appear only inside the title of the linked column 343); no description of current Administrative Enforcement Agency practice (the 2004 decision X5 is not used).

## 2. Citations

- Every statute claim links the correct law.moj.gov.tw LawSingle URL (pcode + flno checked against the fetched articles) ✓.
- 規範 links to law-out GL009873 and the 附表 to the Download.ashx FileID=48960 URL (opened; it is the 第四點附表) ✓.
- Rulings link to ttc.mof.gov.tw/FB/FB120/<TaxSN> and each TaxSN returns the ruling the text attributes to it ✓.
- Sources sections complete; check date stated (ko 확인일: 2026년 10월 7일; ja 確認日：2026年10月7日; en Checked: October 7, 2026; zh 確認日期：2026年10月7日) ✓.
- Internal links: /<lang>/columns/taiwan-tax-audit-reexamination-appeal-deadlines and /<lang>/columns/closing-taiwan-subsidiary-branch-liquidation-tax-filings exist in all four languages per LINKS.md lines 117–140; lint OK confirms existence ✓. No batch-4 links ✓.

## 3. Rules

No bold (grep `**`, `__`, `<b>`, `<strong>` → none; lint OK). No phone, LINE/Kakao, street address (grep + lint). Contact: one soft paragraph per language, firm name + wei@hoveringlaw.com.tw only; offers review of lifting grounds and appeal deadlines (legal work, no bookkeeping/filing/audit) ✓. author: "legal-ai-assistant", audience = file language, topic "tax", tags ["tax-accounting"], categories per brief, featured_image keeps NNN ✓. No lawyer/CPA/native-review claim ✓. Hypotheticals labelled after the scene in all four ✓. en title + " | Hovering Law" > 60 chars → seoTitle present (42 chars) ✓; en summary within 150–160 and clean (lint) ✓; ko/ja/zh seoTitle ≤ 32 and different from title ✓.

## 4. Voice

- ko: 합니다체 throughout (grep for 해라체 endings → only false positives on "다 " inside words). Title names the reader's case and the threshold; first paragraph gives the threshold, the 300만 variant and the 2,000만 condition. "~할 수 있습니다" 3 sentence endings, within the limit. Natural; no translationese found.
- ja: です・ます throughout (metric reports no mixing; grep for だ・である → none). Opening is a fact. 日台租税取決め not relevant here. Natural.
- en: plain, active; opening "NT$2 million." then the rule. No "delve/navigate/it is important to note". Natural.
- zh-hant: Taiwan usage (國稅局、財政部、移民署、營所稅、扣繳義務人、函釋); no simplified characters (grep on common simplified forms → none); 應/得 preserved as in the statute (得函請 / 應禁止 / 應解除). Natural.
- Opening type ① (concrete fact/threshold) in all four, as assigned in topics/T18.md.

## 5. Sentence variety

Tool: OK, no FAIL line, all four files (values above). Self-check items 2–7: opener not a stock hypothetical ✓; ≥2 very short sentences in each ✓ ("두 번째 구간입니다." / "二番目の区分です。" / "That is the second band." / "落在第二級。" etc.); paragraph-start words ≤2 per word after the ko edit (before the edit three ko paragraphs began with 재정부/재정부는 — one item, below the two-item FAIL threshold; fixed anyway); no three consecutive claim-(statute)-caveat paragraphs (caveat count 0–1) and uncited paragraphs present (cite_para ≈ 0.41–0.43) ✓; contrast templates 0 ✓; last paragraph ends on the column's facts (five-year cap + full payment/security) with no copied disclaimer or sales line ✓. No MONOTONY finding.

## Issues found (Original → problem & reason → fix → facts preserved)

None major.

Minor (applied):

1. ko line 59 — "재정부는 이민서에 출국 제한을 요청할 때 이유와 구제 절차를 적은 서면을 당사자에게 함께 송달해야 합니다(제24조 제3항 제1호). 제한 기간은 … 넘지 못합니다. " → three paragraphs began with 재정부(는); trailing space at line end → "이민서에 출국 제한을 요청할 때 재정부는 이유와 구제 절차를 적은 서면을 당사자에게 함께 송달해야 합니다(제24조 제3항 제1호). 제한 기간은 … 넘지 못합니다." → same subject, duty, citation and 5-year figure.
2. ko line 85 — "상당한 담보를 제공하면 해제됩니다(제24조 제2항 제1호)" → §24 II says 應於其範圍內辦理該保全措施之解除; en already said "to that extent", ko did not → "상당한 담보를 제공하면 그 범위에서 해제됩니다(제24조 제2항 제1호)" → citation unchanged; wording now matches the statute and the en version.
3. ja line 85 — "相当の担保を提供すれば解除されます（第24条第2項第1号）" → same reason as 2 → "相当の担保を提供すれば、その範囲で解除されます（第24条第2項第1号）".
4. zh-hant line 81 — "國稅局應解除保全措施（第24條第2項第1款）" → same reason as 2 → "國稅局應在該範圍內解除保全措施（第24條第2項第1款）".
5. en line 33 — "where property equal to the tax has already been frozen" → 規範 pt 三 III refers to 禁止處分 (a ban on transfer/encumbrance), and "frozen" can be read as an account freeze → "where property equal to the tax is already under a transfer ban" → point reference and meaning preserved.

Minor (noted, not applied — outside the wording remit):

- zh-hant line 57 (written notice + five-year cap) carries no parenthetical article pointer, while ko/ja/en give "(제24조 제3항 제1호)" / "（第24条第3項第1号）" / "(Article 24, paragraph 3, item 1)". The §24 link appears in the same section at line 31 and the next paragraph names 第24條第4項, so the claim is sourced; adding "（第24條第3項）" would be a citation change and is left to the writer if wanted.
- FAQ 1 in all four says "an extra condition such as frequent travel" for final debt below NT$20M. In the lowest band (2M–<6M) only signs of hiding/moving assets qualify, which the body table shows; the FAQ phrasing is an example, not a rule, so no change.

## Image

images/T18.webp — RIFF WebP (VP8, 1280×720). Empty airport gate seating in front of a window at dusk, runway lights outside. No faces, text, logos, flags or readable documents; fictional and unidentifiable; calm and respectful; fits "exit ban" without dramatising. Verdict: OK.

## Verification evidence (commands run after edits)

```
python3 lint.py drafts/T18/ko.md ko taiwan-unpaid-tax-exit-ban-responsible-person-liability   → OK [3449 chars]
python3 lint.py drafts/T18/ja.md ja …                                                           → OK [3966 chars]
python3 lint.py drafts/T18/en.md en …                                                           → OK [1590 words]
python3 lint.py drafts/T18/zh-hant.md zh-hant …                                                 → OK [2680 chars]
python3 shared/variety/variety_metrics.py check drafts/T18/ko.md --lang ko       → OK — no variety limit violated
python3 shared/variety/variety_metrics.py check drafts/T18/ja.md --lang ja       → OK — no variety limit violated
python3 shared/variety/variety_metrics.py check drafts/T18/en.md --lang en       → OK — no variety limit violated
python3 shared/variety/variety_metrics.py check drafts/T18/zh-hant.md --lang zh-hant → OK — no variety limit violated
```

VERDICT: PASS
