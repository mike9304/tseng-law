# verify — fact-taiwan-company-subsidiary-vs-branch-1 (round 0, restaged from origin/main a0039a0d3)

Column 004 `taiwan-company-subsidiary-vs-branch`, languages ko / ja / en / zh-hant.

All official pages below were opened with WebFetch on 2026-10-06. Each statute article was read twice (single-article page with two different verbatim prompts) and compared with the full-act page (LawAll); the three readings agree character for character. A raw download with curl was not permitted in this session, so the quotations are the WebFetch rendering of the official pages. law.moj.gov.tw footer on that date: 法規整編資料截止日：民國 115 年 09 月 24 日.

Note on this restage: the live ja file changed on origin/main after the first attempt (kept in `old-1006164853/`). The ja text now in `orig-ja.md` is a rewritten column. It was checked from scratch against the statutes below; the earlier ja corrections do not apply to it.

Summary of verdicts

| Issue | ko | ja | en | zh-hant |
| --- | --- | --- | --- | --- |
| 2a — source label vs link (Business Tax Act Art. 10 label on the withholding-standard link) | CONFIRMED-ERROR | ORIGINAL-RIGHT | CONFIRMED-ERROR | ORIGINAL-RIGHT |
| 2b — the withholding entry vs the claim it supports (dividends to a foreign parent company) | PARTLY | ORIGINAL-RIGHT | PARTLY | PARTLY |
| 3 — Company Act Art. 379 effect stated for every branch deregistration | CONFIRMED-ERROR | ORIGINAL-RIGHT | CONFIRMED-ERROR | ORIGINAL-RIGHT |

No URL was removed from any file, so there is no REMOVED-URL line: the old link `…pcode=G0340028&flno=3` stays in ko, en and zh-hant under a label that matches its page.

---

## Issue 2 — source entry label vs link

### Claims in the column

This part of the source list has to support two rates.

- 5% business tax
  - ko: "영업세(營業稅)는 … 일반세율은 5%입니다."
  - ja: "営業税の税率は、法律上5％を下限、10％を上限とする範囲で行政院が定めることになっており（[加値型及非加値型営業税法第10条](…pcode=G0340080&flno=10)）"
  - en: "Business tax is an indirect tax … The general rate is 5%"
  - zh-hant: "營業稅是… 一般稅率為5%"
- 21% domestic withholding on the dividend a Taiwan subsidiary pays to its foreign parent
  - ko (FAQ 2): "대만 자회사가 국외 모회사에 배당할 때 대만 국내법상 원천징수율은 21%"; body: "국외 주주에게 지급하는 배당의 원천징수율은 대만 국내법상 21%입니다."
  - ja (FAQ 2): "総機構が台湾国外にある営利事業への配当には21％が源泉徴収されます（各類所得扣繳率標準第4条）"; body: "子会社が日本の親会社に配当すると、台湾の国内法では配当額の21％が源泉徴収されます（[各類所得扣繳率標準第4条](…pcode=G0340028&flno=4)）"
  - en (FAQ 2): "dividends paid by a Taiwan subsidiary to a foreign parent are subject to 21% withholding"; table: "Dividends to a foreign parent are subject to 21% withholding under domestic law"
  - zh-hant (FAQ 2): "台灣子公司向國外母公司分配股利時，台灣國內法上的扣繳率為21%"; body: "支付給國外股東的股利扣繳率為21%"

Source entries as published:

- ko: `[대만 법무부 법령정보 — 영업세법 제10조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340028&flno=3)`
- en: `[Laws & Regulations Database — Article 10 of the Value-Added and Non-Value-Added Business Tax Act](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340028&flno=3)`
- zh-hant: `[全國法規資料庫—各類所得扣繳率標準第3條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340028&flno=3)`
- ja: `加値型及非加値型営業税法 [第10条](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340080&flno=10)、[第35条](…flno=35)` and `各類所得扣繳率標準 [第4条](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340028&flno=4)`

### Official text

1. https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340028&flno=3 — 各類所得扣繳率標準 第 3 條 (retrieved 2026-10-06). Full regulation https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=G0340028 shows 修正日期：民國 110 年 06 月 30 日, not abolished. The page is not the Business Tax Act.

   > 第 3 條
   > 納稅義務人如為非中華民國境內居住之個人，或在中華民國境內無固定營業場所之營利事業，按下列規定扣繳：
   > 一、非中華民國境內居住之個人，如有公司分配之股利，合作社分配之盈餘，其他法人分配或應分配之盈餘，合夥組織營利事業合夥人每年應分配之盈餘，獨資組織營利事業資本主每年所得之盈餘，按給付額、應分配額或所得數扣取百分之二十一。
   > （第二款至第十二款：薪資、佣金、利息、租金、權利金等，略）

   The dividend item (第1項第1款) covers 非中華民國境內居住之個人 only — non-resident individuals.

2. https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340028&flno=4 — 各類所得扣繳率標準 第 4 條 (retrieved 2026-10-06).

   > 第 4 條
   > 總機構在中華民國境外之營利事業，因投資於國內其他營利事業，所獲配或應獲配之股利或盈餘，由扣繳義務人於給付時，按給付額或應分配額扣取百分之二十一。

   This is the rule for a dividend paid to a foreign parent company (a profit-seeking enterprise whose head office is outside Taiwan).

3. https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340080&flno=10 — 加值型及非加值型營業稅法 第 10 條 (retrieved 2026-10-06). Full act https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=G0340080 shows 修正日期：民國 114 年 05 月 28 日.

   > 第 10 條
   > 營業稅稅率，除本法另有規定外，最低不得少於百分之五，最高不得超過百分之十；其徵收率，由行政院定之。

4. Supporting official pages (not statutes), retrieved 2026-10-06:
   - 財政部稅務入口網「Q1：營業稅稅率為何？」 https://www.etax.nat.gov.tw/etwmain/tax-info/innotative-tax-e-reference/filing/business-tax/wMDMRl7 — 「營業稅稅率，除本法另有規定外，最低不得少於5%，最高不得超過10%，由行政院定之。目前稅率為5%。」 The "general rate 5%" in ko / en / zh-hant is right and stays as written.
   - 財政部稅務入口網「1503 營利所得如何辦理扣繳？」 https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/individual-income-tax/withheld-rule/rule/3AmWR0R (already in the ko / en / zh-hant source lists) — 「公司分配股利或合夥事業盈餘給非境內居住的個人或總機構在中華民國境外的營利事業時，於107年1月1日以後，按給付額，依規定扣繳率21%扣取稅款。」 The 21% in the body is right for both kinds of foreign shareholder and stays as written.
   - Official English title of the regulation, used for the en labels: "Standards of Withholding Rates for Various Incomes" (https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=G0340028, amended 2021-06-30). The English Art. 4 there reads "…a profit-seeking enterprise having its head office outside the territory of the Republic of China … shall be withheld at a rate of 21%…".

### Verdict 2a — label vs link

- ko, en: CONFIRMED-ERROR. The entry is labelled Business Tax Act Art. 10, but its link opens 各類所得扣繳率標準 第 3 條. The 5% business-tax statement has no matching link, and the withholding page sits under a wrong name. Correct state: the Business Tax Act Art. 10 label points to `pcode=G0340080&flno=10`, and the existing link `pcode=G0340028&flno=3` stays in the list under its real name. The column states both rates, so both sources are kept and nothing is dropped.
- zh-hant: ORIGINAL-RIGHT. The label 各類所得扣繳率標準第3條 matches its page. The list has no entry that claims to be the Business Tax Act, so there is no mismatch to correct, and the body's 5% statement is itself correct (item 4 above). No Business Tax Act entry was added to zh-hant: a source that was never listed is not an error in the published text.
- ja: ORIGINAL-RIGHT. The live ja text cites 加値型及非加値型営業税法第10条 with `pcode=G0340080&flno=10`, both inline and in the source list, and describes Art. 10 as the statute words it (floor 5%, ceiling 10%, rate set by 行政院). Label, link and statement all match the official text. Left unchanged.

### Verdict 2b — does the withholding entry match the claim it supports

- ko, en, zh-hant: PARTLY. What is right: the label (after 2a in ko / en; already in zh-hant) matches the page, and Art. 3(1)(1) does set 21% on dividends — for non-resident individuals. What is wrong: the claim this entry carries in the column is the dividend a Taiwan subsidiary pays to its foreign parent company (FAQ 2, the tax table, and the paragraph after the table). That payee is a 總機構在中華民國境外之營利事業, and its 21% rate is in Art. 4, not Art. 3. The list therefore cites the individuals' item for a statement about a corporate parent. The rate in the body (21%) is correct and unchanged.
- Correction: add an Art. 4 entry directly after the Art. 3 entry. Art. 3 stays because the body also speaks of foreign shareholders in general (국외 주주 / 國外股東 / "a foreign shareholder"), which includes non-resident individuals, and because no source may be dropped.
- ja: ORIGINAL-RIGHT. The live ja text cites 各類所得扣繳率標準第4条 (`pcode=G0340028&flno=4`) for 「総機構が台湾国外にある営利事業への配当には21％」, in FAQ 2, in the body and in the source list. That is exactly Art. 4. ja was used as the reference for this point and left unchanged.
- Note for the reviewer: the Art. 4 line goes one step past the label/link mismatch as reported. It comes from the same entry and from the request that each entry match "its page and the claim it supports". issues.md describes the flno=3 page as "21% withholding on dividends to non-residents"; the official text shows that this holds only for individuals. The addition is one source-list line per language and touches no body sentence.

---

## Issue 3 — Company Act Art. 379 effect stated for all branch deregistrations

### Claims in the column (exit-procedure part)

- ko: "지점등기를 말소해도 채권자의 권리와 외국회사의 의무는 달라지지 않습니다. 회사법 제379조의 내용입니다."
- en: "Under Article 379 of the Company Act, cancellation of a branch registration does not affect creditors’ rights or the foreign company’s obligations."
- zh-hant: "主管機關依《公司法》第379條第1項廢止分公司登記時，依同條第2項，也不影響債權人之權利及外國公司之義務。"
- ja: "撤退するときは、支店なら登記の廃止を申請します。廃止の前に負った責任や債務は、廃止によって免れません（会社法第378条）。主管機関が職権で登記を廃止する場合も、債権者の権利と外国会社の義務には影響しません（第379条）。"

In ko, en and zh-hant the paragraph just before covers the voluntary application under Art. 378 (ko: "…회사법 제378조에 따라 지점등기 말소를 신청해야 합니다. … 신청 전에 생긴 채무 … 가 신청으로 사라지지는 않기 때문입니다").

### Official text

1. https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=379 — 公司法 第 379 條 (retrieved 2026-10-06)

   > 第 379 條
   > 有下列情事之一者，主管機關得依職權或利害關係人之申請，廢止外國公司在中華民國境內之分公司登記：
   > 一、外國公司已解散。
   > 二、外國公司已受破產之宣告。
   > 三、外國公司在中華民國境內之分公司，有第十條各款情事之一。
   > 前項廢止登記，不影響債權人之權利及外國公司之義務。

2. https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=378 — 公司法 第 378 條 (retrieved 2026-10-06)

   > 第 378 條
   > 外國公司在中華民國境內設立分公司後，無意在中華民國境內繼續營業者，應向主管機關申請廢止分公司登記。但不得免除廢止登記以前所負之責任或債務。

3. https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080001 — 公司法, 修正日期：民國 114 年 12 月 26 日 (retrieved 2026-10-06). Art. 378 and Art. 379 there are identical to the single-article pages. Art. 380 was read for context only (no issue reported):

   > 第 380 條
   > 外國公司在中華民國境內設立之所有分公司，均經撤銷或廢止登記者，應就其在中華民國境內營業所生之債權債務清算了結，未了之債務，仍由該外國公司清償之。
   > 前項清算，除外國公司另有指定清算人者外，以外國公司在中華民國境內之負責人或分公司經理人為清算人，並依外國公司性質，準用本法有關各種公司之清算程序。

### Verdict

- ko, en: CONFIRMED-ERROR. Art. 379(2) says 「前項廢止登記」: it attaches only to the cancellation in Art. 379(1), which the competent authority (主管機關) makes ex officio or on an interested party's application in the three listed cases. Both versions give that effect to Art. 379 for any cancellation of a branch registration, including the voluntary application of Art. 378 described in the paragraph before. The voluntary case has its own rule, the proviso of Art. 378 (「但不得免除廢止登記以前所負之責任或債務」), which that preceding paragraph already reflects. Correct statement: when the competent authority cancels the branch registration under Art. 379(1), that cancellation does not affect creditors' rights or the foreign company's obligations, under Art. 379(2).
- zh-hant: ORIGINAL-RIGHT. The sentence is already limited to 「主管機關依《公司法》第379條第1項廢止分公司登記時，依同條第2項…」. Left unchanged and used as the reference for ko and en.
- ja: ORIGINAL-RIGHT. The live ja text gives the voluntary application its own rule with Art. 378 (earlier responsibilities and debts are not relieved — the Art. 378 proviso) and limits Art. 379 to cancellation by the competent authority. Both attributions match the statute. Left unchanged.
  - Observation, not an error: ja says 「主管機関が職権で登記を廃止する場合も」, which names only the ex officio route; Art. 379(1) also allows cancellation on an interested party's application (利害關係人之申請). The sentence states nothing false — Art. 379(2) does apply to an ex officio cancellation — and it does not say that this is the only route. Under the rule for this job (correct only what the statute shows to be wrong) it stays as published.
- Checked, no error, not changed: the Art. 378 paragraph in ko / en / zh-hant (voluntary application; earlier obligations do not disappear) is consistent with the Art. 378 proviso; the Art. 380 paragraph is consistent with Art. 380(1); ja's 清算人 sentence matches Art. 380(2). The follow-up sentences of the Art. 379 paragraph in ko / en (creditors keep rights arising before the cancellation; the foreign company stays liable) hold under Art. 379(2) and are untouched. No FAQ answer, summary or table in any language states the Art. 379 effect.

---

## Checks run (2026-10-06)

- `python3 /Users/son7/tseng-rewrite-1006/factfix/factguard.py <job> 2026-10-06` → FACTGUARD: PASS. Output: ko body characters changed 275 (1.9%); ja unchanged; en 467 (1.2%); zh-hant 94 (0.9%). URLs added: `G0340080&flno=10` and `G0340028&flno=4` in ko and en, `G0340028&flno=4` in zh-hant. No original URL missing.
- `diff orig-<lang>.md draft-<lang>.md`: ko — the Art. 379 line and the source list (1 line → 3 lines); en — lastmod, the Art. 379 line and the source list (1 line → 3 lines); zh-hant — lastmod and one added source line; ja — identical.
- `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check` on each orig/draft pair: ko 0 FAIL before and after (cv 0.466 → 0.467). en shows the same four FAIL lines in the live file and in the draft (len_cv 0.332 → 0.333, short_share 0.01, top_opener_n 7, contrast 4); zh-hant shows the same three FAIL lines in both (len_cv 0.376, short_share 0.015, contrast 4). These come from the published text. The edits add none, and they were left alone because a fact fix may not rewrite other sentences.
- No bold markup added. ko 합니다체 kept in the edited sentences; 「주무기관」 is the term the ko column already uses in its closing notice; the en paragraph citation follows the column's own "Article 99(1)" form.

---

## Changes

### ko — draft-ko.md

- Body, exit procedure (Art. 379 paragraph): "지점등기를 말소해도 채권자의 권리와 외국회사의 의무는 달라지지 않습니다. 회사법 제379조의 내용입니다." → "주무기관이 회사법 제379조 제1항에 따라 지점등기를 말소하는 경우에도 채권자의 권리와 외국회사의 의무는 달라지지 않습니다. 같은 조 제2항의 내용입니다."
- Sources: "[대만 법무부 법령정보 — 영업세법 제10조](…pcode=G0340028&flno=3)" → "[대만 법무부 법령정보 — 영업세법 제10조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340080&flno=10)" (label kept, link corrected)
- Sources, added after it: "[대만 법무부 법령정보 — 각종 소득 원천징수율 표준(各類所得扣繳率標準) 제3조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340028&flno=3)" (the existing link, now under a label that matches its page)
- Sources, added: "[대만 법무부 법령정보 — 각종 소득 원천징수율 표준(各類所得扣繳率標準) 제4조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340028&flno=4)"
- lastmod: already "2026-10-06" in the live file; unchanged.

### ja — draft-ja.md

- no change (already correct). Issue 2: 営業税法第10条 → `G0340080&flno=10` and 各類所得扣繳率標準第4条 → `G0340028&flno=4` both match their pages and the statements they support. Issue 3: Art. 378 and Art. 379 are attributed separately and correctly.
- lastmod stays "2026-07-25" because the file was not changed.

### en — draft-en.md

- Body, exit procedure (Art. 379 paragraph): "Under Article 379 of the Company Act, cancellation of a branch registration does not affect creditors’ rights…" → "Where the competent authority cancels a branch registration under Article 379(1) of the Company Act, Article 379(2) provides that the cancellation does not affect creditors’ rights…" (rest of the sentence unchanged)
- Sources: "[Laws & Regulations Database — Article 10 of the Value-Added and Non-Value-Added Business Tax Act](…pcode=G0340028&flno=3)" → same label with "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340080&flno=10" (label kept, link corrected)
- Sources, added after it: "[Laws & Regulations Database — Article 3 of the Standards of Withholding Rates for Various Incomes](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340028&flno=3)" (the existing link, now under a label that matches its page)
- Sources, added: "[Laws & Regulations Database — Article 4 of the Standards of Withholding Rates for Various Incomes](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340028&flno=4)"
- lastmod: "2026-07-25" → "2026-10-06"

### zh-hant — draft-zh-hant.md

- Issue 2a: no change (already correct — the label matches its page).
- Issue 3: no change (already correct — the sentence is limited to Art. 379(1)/(2)).
- Issue 2b — Sources, added after the Art. 3 entry: "[全國法規資料庫—各類所得扣繳率標準第4條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340028&flno=4)"
- lastmod: "2026-07-25" → "2026-10-06"

FAQ answers and the en summary do not mention Art. 379 or any source label, so no front-matter text changed in any language.
