# review-r1 — fact-withdraw-capital-taiwan-company-1 (Claude Fable, 2026-10-12)

Verdict: PASS. The three corrections (拘役 instead of 拘留/구류, the 併科 option for the fine, the addressee 公司負責人 of Art. 9) are each supported by the current text of 公司法 on law.moj.gov.tw, applied consistently in ko / ja / en, and zh-hant was already right. The diffs contain nothing but those sentences and lastmod. Every source link is kept. The test patch only re-anchors pins of this column and the pinned figures still lock the statute's figures. No wording edit was needed.

## What I opened (all with WebFetch on 2026-10-12)

| URL | What I read | Matches verify.md |
| --- | --- | --- |
| https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=9 | 第9條 第1項–第4項 | yes (verbatim) |
| https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080001 | 修正日期 民國114年12月26日; 第9條第1項 penalty clause; 第90條第2項 | yes (verbatim, both readings identical) |
| https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=90 | 第90條 第1項–第2項 | yes |
| https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=8 | 第8條 第1項–第3項 | yes |
| https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=89 | 第89條 第1項–第3項 | yes |
| https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=113 | 第113條 第1項–第2項 | yes |
| https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=334 | 第334條 | yes |
| https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=87 | 第87條 第3項 | yes |
| https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=24 | 第24條 | yes |
| https://law.moj.gov.tw/LawClass/LawAllPara.aspx?pcode=J0080001 | chapter list: 第二章 無限公司 §40 / 第六節 清算 §79; 第三章 有限公司 §98; 第五章 股份有限公司 §128 / 第十二節 清算 §322 | yes |
| https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=J0080001 | last three entries: 114-12-26 (第449條, 增訂第387-1條), 110-12-29 (第172-2、356-8條), 107-08-01 (wide revision) | yes; none of the two latest touches 第8、9、24、87、89、90、113、334條 |
| https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=33 | 刑法 第33條 (拘役：一日以上，六十日未滿) | yes |
| https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080067&flno=19 | 社會秩序維護法 第19條 (拘留：一日以上，三日以下) | yes |
| https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=J0080001 | Amended Date 2025-12-26; Art. 9(1) "…or in lieu thereof or in addition thereto a fine…"; Art. 90(2) "…detention or, singularly or in addition thereto, a fine not exceeding NT$60,000." | yes |
| https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=75 | 所得稅法 第75條 第1項–第3項 | yes |
| https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080020&flno=3 | 公司登記辦法 第3條 第1項–第3項 | yes |
| https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080020&flno=4 | 公司登記辦法 第4條 第1項–第2項 | yes |
| https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=J0080020 | title "Regulations Governing Company Registration", Amended Date 2021-04-23 | yes |
| https://www.etax.nat.gov.tw/…/liquidation-procedure/x6mOPan | 2608, 更新日期 107-08-09: 45日內; 核准之日＝發文日; 自核准日之次日起算; 清算結束之日起30日內 | yes |
| https://serv.gcis.nat.gov.tw/crm/faqAction.do?id=659&method=faqDetlDetl | 「可在停業前後15日內申請，每次最長不得超過1年。…（公司登記辦法§3#3）」 | yes |

Not opened: https://law.moea.gov.tw/LawContent.aspx?id=FL011312 (the column's own link for 公司登記辦法). verify.md reports HTTP 403 for WebFetch; the link is unchanged in every language and its label names the regulation that law.moj.gov.tw pcode=J0080020 contains, so nothing in this job depends on reading it.

## Per issue

### Note 1 — penalty wording of 第9條 / 第90條

- Statute sentences checked: 第9條第1項「公司負責人各處五年以下有期徒刑、拘役或科或併科新臺幣五十萬元以上二百五十萬元以下罰金。」; 第90條第2項「清算人違反前項規定，分派公司財產時，各處一年以下有期徒刑、拘役或科或併科新臺幣六萬元以下罰金。」; 刑法第33條第4款 (拘役 is a principal punishment); 社會秩序維護法第19條第1款 (拘留 is a different sanction).
- ko: CONFIRMED-ERROR, verdict right. Live 「유기징역·구류 또는 … 벌금」 → draft 「유기징역·구역(拘役) 또는 … 벌금을 규정합니다. 벌금은 징역이나 구역과 함께 부과(併科)될 수도 있습니다.」 and, for Art. 90, 「…구역(拘役) 또는 6만 대만달러 이하의 벌금에 처해질 수 있습니다. 이때에도 벌금은 징역이나 구역과 함께 부과될 수 있습니다.」 Terms, amounts and years match the statute. 합니다체 kept; the added sentences read naturally.
- ja: CONFIRMED-ERROR, verdict right. 「拘留」 → 「拘役」 in both passages; 「罰金は、有期刑や拘役に併科されることもあります。」 and 「ここでも、罰金は有期刑や拘役に併科され得ます。」 added. です・ます kept; 併科 is the standard Japanese term. 「有期刑」 left as in the live text (a rendering choice, not a false statement).
- en: PARTLY, verdict right. "detention" is the official translation's word for 拘役 and stays; "That fine may also be imposed together with imprisonment or detention." and "…which may likewise be imposed together with imprisonment or detention (Company Act, Article 90)." state the 併科 option. Plain English, no translationese.
- zh-hant: ORIGINAL-RIGHT, verdict right. Both live sentences already read 「有期徒刑、拘役，或科或併科…罰金」 with the statute's amounts. File unchanged (orig and draft byte-identical).
- Cross-language: all four now state the same three elements (fixed-term imprisonment, 拘役, fine that may be added) with the same figures.

### Note 2 — who is punished under 第9條

- Statute sentence checked: 第9條第1項「…公司負責人各處…」 (and 第8條 for the definition, which the draft correctly does not add).
- ko / ja / en: PARTLY, verdict right. The draft puts the addressee inside the already-corrected sentence: ko 「회사 책임자(公司負責人)에 대하여」, ja 「会社の責任者（公司負責人）を処罰します」, en "The penalty falls on the company’s responsible persons (公司負責人)". This is the statute's own term and the zh-hant version already names it, so it is a correction toward the statute, not a new fact. The word each version uses for 負責人 is the one its own section 5 already uses (책임자 / 責任者 / responsible person).
- zh-hant: ORIGINAL-RIGHT; unchanged.
- Art. 90: all four versions already name the liquidator (청산인 / 清算人 / "a liquidator"); nothing to change.

### Note 3 — 第89條 / 第90條 cited directly

- Statute sentences checked: 第89條第1項「公司財產不足清償其債務時，清算人應即聲請宣告破產。」; chapter list (both articles sit in 第二章 無限公司 第六節 清算); 第113條第2項「…解散及清算，準用無限公司有關之規定。」; 第334條「…第八十九條及第九十條之規定，於股份有限公司之清算準用之。」
- All four languages: ORIGINAL-RIGHT, verdict right. The rule stated is the law for 有限公司 and 股份有限公司 by 準用, and the article numbers given are the articles that contain the rule. Nothing changed.

### Note 4 — 45-day and 30-day tax deadlines

- Statute sentences checked: 所得稅法第75條第1項「…辦理當期決算，於四十五日內…申報…」; 第2項「…清算所得，應於清算結束之日起三十日內…申報…但依其他法律得免除清算程序者，不適用之。」; etax 2608「所稱『主管機關核准之日』係指主管機關核准文書發文日。」「辦理當期決算申報之時限，應自主管機關核准日之次日起算。」; 公司法第24條.
- All four languages: ORIGINAL-RIGHT, verdict right. Figures, start points and the attribution of the 發文日 rule to the linked official guidance all hold. Nothing changed.

### Note 6a / 6b — 15-day suspension registration; name of the regulation

- Statute sentences checked: 公司登記辦法第3條第1項「…應於停止營業前或停止營業之日起十五日內申請為停業之登記…但已依加值型及非加值型營業稅法規定申報核備者，不在此限。」; 第3項「…每次最長不得超過一年。」; 第4條第1項 (15 days for change registration); gcis FAQ.
- All four languages: ORIGINAL-RIGHT, verdict right. 「休業開始後15日以内」 and 「休業開始日から15日以内」 both count from the start day, as the regulation does. The two names in ja (会社登記弁法 / 会社登記規則) and en (Regulations Governing Company Registration / Company Registration Regulations) denote one instrument with the right article and proviso; making them uniform is an editorial change outside a fact fix. Nothing changed.

## Scope

- `diff orig-ko draft-ko`: lastmod 2026-10-06→2026-10-12, body lines 39 and 43 (the two penalty sentences). Nothing else.
- `diff orig-ja draft-ja`: lastmod 2026-10-06→2026-10-12, body lines 41 and 47. Nothing else.
- `diff orig-en draft-en`: body lines 39 and 41 only. The live en file already carries lastmod "2026-10-12" (orig-en.md line 5), so no lastmod line changed.
- `diff orig-zh-hant draft-zh-hant`: identical; lastmod stays 2026-10-06.
- FAQ answers, summary, headings, images, numbers and all source entries (ko 5, ja 4, en 5, zh-hant 5) unchanged; no URL added or removed, so no REMOVED-URL line is required.
- factguard re-run by me: `python3 …/factguard.py …/withdraw-capital-taiwan-company-1 2026-10-12` → ko 95 chars (1.1%), ja 64 (0.7%), en 191 (0.8%), zh-hant unchanged, FACTGUARD: PASS. (guard.txt says the same.)

## Language

The edited sentences read natively: ko 합니다체 throughout; ja です・ます with 併科 / 科され得ます; en plain sentences; zh-hant untouched. No bold markup. Variety metrics (`variety_metrics.py check --lang …`): ja OK before and after (cv 0.472→0.478); en OK before and after (cv 0.46→0.469); ko carries the same two pre-existing FAIL lines as the live text (len_cv 0.344→0.363, short_share 0.012 unchanged), none added — a fact fix may not rewrite the surrounding sentences, so these stay for a normal edit.

## Tests

Verdict: PASS.

- tests.patch touches five test files and only re-anchors pins of this column: the Art. 9 and Art. 90 paragraphs (en, ja ×2, ko), the two ja `toContain` phrases (拘留→拘役), lastmod/date 2026-10-06→2026-10-12 (ja, ko), the ja immutable-prefix sha256, the en visible/prose word counts (3,234/3,105→3,260/3,131) and the ko eojeol count (1,803→1,821).
- Every added literal is present verbatim in the corresponding draft (checked against draft-ko/ja/en line by line). The statute figures (five years, NT$500,000–2.5 million, one year, NT$60,000, Art. 9, Art. 90) remain pinned in every language.
- The new ja sha256 `c98a249a…5af1` equals sha256 of the first 2,666 bytes of draft-ja.md (computed here); the old value `93378af0…2611` equals the same prefix of orig-ja.md. The change is the lastmod line inside the pinned prefix.
- The en word counts were reproduced here with the test's own regex pipeline: orig 3,234/3,105, draft 3,260/3,131. read_time "14 min read" still follows (3,131/230 → 14).
- No `.skip`, `.only` or `.todo` in the patch (grep). No assertion loosened; no source or column file touched by the patch.
- vitest-1.log: 78 files / 1,025 tests passed on the worktree with the draft text in place (claude-tests1.log, p-tests1.txt). The worktree `/Users/son7/Projects/tseng-law-rewrite-1006-wfix` has since been reset to origin/main (its column and test files show the live text again), and it lies outside this session's allowed directories, so I could not re-run vitest there myself. The patch-to-draft checks above are my independent evidence.

## Blocking issues

None.

## Tiny edits

None. No draft file was modified in this review.

VERDICT: PASS
