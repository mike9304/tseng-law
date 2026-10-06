# T11 final review — taiwan-representative-office-tax-what-it-may-do (ko · ja · en · zh-hant)

Reviewer: Claude Fable 5.1 (final gate), 2026-10-06. Task: reviews/T11/p-review-r1.txt.

## Verdict

PASS — all four language files are publishable as they now stand (five minor wording/citation edits applied by me, listed below; no fact, number, deadline, article number or legal meaning changed). Image OK.

Checks run after my edits (all four files): `python3 lint.py drafts/T11/<lang>.md <lang> taiwan-representative-office-tax-what-it-may-do` → OK for ko (3,018 chars), ja (3,574), en (1,514 words), zh-hant (2,076). `python3 shared/variety/variety_metrics.py check … --lang …` → no FAIL in any file (ko/ja show only the register WARN "84–85% of sentences end in 니다/です・ます", which is the expected 합니다체/です・ます register, not a limit violation).

## Scope checked — official pages I opened on 2026-10-06 (copies in reviews/T11/sources/, index in sources/README.md)

Statutes (law.moj.gov.tw single-article pages, fetched with fetch_law.py; amendment dates from the LawAll header):
- 公司法 (修正日期 民國114年12月26日 = 2025-12-26): §371, §386 — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=371 / …&flno=386
- 所得稅法 (修正日期 民國115年09月11日 = 2026-09-11): §10, §41, §89, §92 — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=10 / 41 / 89 / 92
- 所得稅法 沿革 — https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=G0340003 (opened because the law carries a 「部分或全部條文尚未生效」 banner; see note A below)
- 加值型及非加值型營業稅法 (民國114年05月28日): §6 — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340080&flno=6
- 稅籍登記規則 (民國111年08月08日): §3 — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340087&flno=3

MOF rulings (law-out.mof.gov.tw, page footer 系統更新日期 115.09.22):
- 台財稅第7558643號, 公發布日 民國75年09月02日 — https://law-out.mof.gov.tw/LawContent.aspx?id=GL002986
- 台財稅第7586964號, 民國76年05月02日 — https://law-out.mof.gov.tw/LawContent.aspx?id=GL002992
- 台財稅第7557083號, 民國75年07月30日 — https://law-out.mof.gov.tw/LawContent.aspx?id=GL006522
- 台財稅第770095360號, 民國77年04月13日 — https://law-out.mof.gov.tw/LawContent.aspx?id=GL006938

MOEA / GCIS:
- 經商字第09202221350號 (92-10-29) and 經商字第09702045080號 (97-04-28): API https://gcis.nat.gov.tw/elawAp/api/getElawConstructionDetail?consCd=7020 / 8791 (aboFlg "0" = not abolished; both carry the editor's note 「107年11月1日施行之公司法…第386條已將…「報備」修正為「登記」」); the human pages https://gcis.nat.gov.tw/elaw/constructionDetail?consCd=7020 / 8791 that the drafts link return HTTP 200.
- 外國公司設立辦事處應附文件及注意事項 (PDF, footer 「1150602 修正」) — https://gcis.nat.gov.tw/mainNew/matterAction.do?method=showFile&fileNo=t70051_p

Tax agreements (official MOF texts):
- Taiwan–Korea, Chinese original — https://www.mof.gov.tw/download/c73d0ce06a654aed88df936485e60a53 ; English original — https://www.mof.gov.tw/download/d1f7663ee1cf4074bd307a87e852d389 (also the consolidated English, …/9679b16a87cd418ca479db4f947a588e)
- Taiwan–Japan, English (authentic: "in the English language", signed Tokyo 2015-11-26) — https://www.mof.gov.tw/download/10462 ; Chinese translation (「本協定以英文繕製」) — https://www.mof.gov.tw/download/10422
- Taiwan–Vietnam, English — https://www.mof.gov.tw/download/66dc13da4e8449698e42d6b818549c52 ; Chinese — https://www.mof.gov.tw/download/6b9255566aab4b9084c085ddc921138e
- 財政部 我國所得稅協定一覽表 (發布/更新日期 2026-09-04) — https://www.mof.gov.tw/singlehtml/191?cntId=63930

Japan / US:
- 国税庁「日台民間租税取決めに定める相互協議手続について」 — https://www.nta.go.jp/taxes/shiraberu/kokusai/nichitai/01.htm
- H.R. 33 (119th): Library of Congress API https://api.congress.gov/v3/bill/119/hr/33 and …/actions (DEMO_KEY), and GPO https://www.govinfo.gov/bulkdata/BILLSTATUS/119/hr/BILLSTATUS-119hr33.xml (updateDate 2026-09-19). The congress.gov HTML page (https://www.congress.gov/bill/119th-congress/house-bill/33) returns a Cloudflare JavaScript challenge to curl, so the status was taken from the two official machine-readable sources; the copies of the challenge pages are kept for the record.

Internal links: lint confirmed /{lang}/columns/taiwan-company-subsidiary-vs-branch and /{lang}/columns/taiwan-company-establishment-basics exist in all four languages in ~/Projects/tseng-law-tax-board-20261006.

## 1. Law and facts — what I verified, per claim (all four languages unless noted)

- 公司法 §386 ¶1 quoted verbatim (ko/ja/en) / paraphrased (zh) — matches the current text. §386 ¶2 (廢止登記) matches. The 2018-11-01 報備→登記 change is exactly the GCIS editor's note. ✔
- 2003 MOEA ruling: 「業務上之法律行為」 = 簽約、投標、報價、採購 + 議價; 營業 (pre-2018 §371 ¶2 wording) = 經常性、反覆性之商業活動. All four say exactly this and ko/ja/en/zh correctly flag that the 營業 reading is of the pre-amendment wording. ✔
- GCIS checklist: POA must state the kinds of legal acts, examples 簽訂契約、報價、議價、投標、採購; applicant = the representative in Taiwan (ja/en); fee NT$1,000; "1150602 修正" = 2026-06-02 / 115年6月2日. ✔ "Market research" is not listed anywhere (binding note respected). ✔
- 公司法 §371: no business in the foreign company's name without branch registration; 一年以下有期徒刑、拘役或科或併科新臺幣十五萬元以下罰金, 並自負民事責任 (en adds the civil liability; the other three omit it, which is a shorter statement, not a contradiction). ✔
- 2008 MOEA ruling: branch and office cannot coexist, office must be withdrawn first; drafts mark it as a ruling on the pre-2018 text. ✔
- MOF 1986-09-02 (7558643): 聯絡處 buying for the head office, no 對外營業 → 免營業登記; remittances 不屬營業稅課徵範圍, 免徵營利事業所得稅; reason 說明二 (not a sale of services; remittance is not the office's 銷售額). ✔
- MOF 1987-05-02 (7586964): 採購、驗貨及連絡通訊; 仍應向該管稽徵機關報備, 收付款項記帳, 依法取得外來憑證或辦理扣繳; 營業外收入 → 結算申報. Opening paragraph, FAQ 1 and body in all four match. ✔ The drafts say the rulings are "still listed" (ko 지금도 실려 있습니다 / ja いまも掲載 / en still listed as of October 2026 / zh 目前仍收錄) — accurate and no stronger than the database shows. ✔
- MOF 1986-07-30 (7557083) foreign bank 代表人辦事處 (ko/ja/en only). ✔
- MOF 1988-04-13 (770095360): 日商高雄辦事處 sold services, Japanese head office collected in Japan from a Japanese buyer, 統一發票 within 10 days of collection. ✔ ja's gloss 「台湾の事務所の販売として扱われた」 follows the ruling's own 「國內銷售勞務營業人」. ✔ No private party is named (the ruling itself anonymises 日本○○株式會社). ✔
- 所得稅法 §10 ¶1 (事務所 in 固定營業場所; carve-out 專為採購貨品用之倉棧或保養場所，其非用以加工製造貨品者) ✔; §10 ¶2 items 1 and 3 (ko/ja/en) / item 1 verbatim (zh) ✔; §41 ✔.
- 所得稅法 §89 ¶1(2) (薪資、租金…; 扣繳義務人 機關、行政法人、團體、學校、事業…; 納稅義務人 = 取得所得者) ✔; §89 ¶3 免扣繳憑單 by end-January ✔; §92 ¶1 (10th of next month; 扣繳憑單 by end-January; 填發 by Feb 10; 3+ consecutive national holidays in January → Feb 5 / Feb 15) ✔; §92 ¶2 non-resident individual: within 10 days of withholding, 申報核驗 then 發給 ✔. FAQ 2 in all four matches §92 ¶1 exactly. ✔
  Note A (version check): the law shows 「部分或全部條文尚未生效，最後生效日期：未定」. The 沿革 page shows §88, 89, 92… were amended on 113-08-07 with the effective date left to the Executive Yuan, and the 行政院 113-08-27 院臺財字第1131022789號令 set them in force from 114-01-01 (2025-01-01). The 115-09-11 amendment changed only §17 and §126 (from 115-01-01). The outstanding "未定" item is §43-4 (105年). So the §89/§92 text the drafts cite is the in-force text. ✔
- 稅籍登記規則 §3 ¶3 (連絡處、辦事處… 如對外營業，應於開始營業前…申請稅籍登記) ✔; 營業稅法 §6(3) ✔.
- Korea agreement (ko body + FAQ 3; zh table): Art 5(2)(三)辦事處 ✔; Art 5(4) is the associated-enterprise aggregation rule, hence the exclusion is Art 5(5) ✔ (ko's explanation of the shifted numbering is right); 5(5)(四) quoted verbatim ✔, (五)(六) paraphrased correctly ✔; Art 5(6) dependent agent 「有權並經常…以該企業名義簽訂契約」 with the 前項 exception ✔; Art 7(4) mere purchase ✔; MOF list: signed 2021/11/17, in force 2023/12/27 ✔ (ko states only the in-force date, correctly).
- Japan agreement (ja body + FAQ 3; zh table; en number only): Art 5(2)(c) office ✔; 5(4)(d) quoted verbatim in English ✔, (e)(f) paraphrased ✔; 5(5) dependent agent with the paragraph-4 exception ✔; 7(5) mere purchase ✔; drafted in English ✔; signed 2015-11-26 between 公益財団法人交流協会 and 亜東関係協会 as a 民間取決め, renamed 2017 (NTA 注2: 2017-01-01 / 2017-05-17) ✔; MOF list in force 2016/06/13 ✔ (NTA: 平成28年6月発効, consistent). ja uses 日台民間租税取決め throughout ✔.
- Vietnam agreement (en; zh table): signed 1998/04/06, in force 1998/05/06 ✔; Art 5(2)(c) office ✔; 5(3)(d) quoted verbatim, (e) "of a preparatory or auxiliary character" verbatim, (f) paraphrased ✔; 5(4) "has and habitually exercises … an authority to conclude contracts in the name of the enterprise" with the paragraph-3 exception ✔; 7(5) "by reason of the mere purchase" ✔; Chinese text heads Art 5 「固定營業場所」 ✔ (zh note correct).
- zh-hant table (臺日 5(2)/5(4)/5(5)/7(5); 臺韓 5(2)/5(5)/5(6)/7(4); 臺越 5(2)/5(3)/5(4)/7(5); 美國 none) — every cell matches the texts. ✔
- US (en FAQ 3 + body; zh FAQ 3 + table): MOF list (更新日期 2026-09-04) has the US only in the 海空運 S&A table, 1988/05/31; no comprehensive agreement ✔. H.R. 33: passed the House 2025-01-15 (423–1); latest action 2025-01-16 "Received in the Senate and Read twice and referred to the Committee on Finance"; govinfo record (updated 2026-09-19) has no enacted-law entry → "not enacted as of October 6, 2026" ✔.
- Home-country notes are general cautions only (ko 한국 세무 전문가와 확인 / ja 日本の税理士にご確認 / en a US tax adviser can confirm); no foreign-law outcome is stated. ✔
- Arithmetic: no worked numbers beyond statutory amounts/dates; nothing to recompute. Cross-language: the four versions state the same law; the only differences are scope (bank ruling omitted in zh; civil liability stated in en only; agreement sections per reader), none contradictory. ✔
- Binding research notes honoured: current §386 text only; fee NT$1,000 from the GCIS PDF; no "market research"; no procedure or ID type for the 報備/扣繳 registration (each language says only that the rulings do not name a form or number and suggests asking the local 國稅局); PE article numbers JP 5(4) / KR 5(5) / VN 5(3); US no agreement. ✔

## 2. Citations

Inline statute links all point to the correct single-article URLs; agreement links point to the official MOF texts; MOEA links to the GCIS ruling pages / checklist PDF; sources sections list every source used and carry the check date (ko 확인일: 2026년 10월 6일; ja 確認日：2026年10月6日; en Checked: October 6, 2026; zh 資料確認日：2026年10月6日). Two small gaps found and fixed (items 4 and 5 below).

## 3. Rules

No bold, no phone, no address, email-only contact once (wei@hoveringlaw.com.tw, firm named in the page language), no bookkeeping/filing/audit offer (the contact line offers to look at the registered scope against actual activity — a legal review), author legal-ai-assistant, no lawyer/CPA/native-review claim, no invented client story (no hypothetical scene is used; all examples are the official rulings, with no private party named), frontmatter per brief (topic tax, tags ["tax-accounting"], audience = file language, categories, featured_image NNN path, FAQ 3 items consistent with body; en title + " | Hovering Law" > 60 → seoTitle 39 chars; en summary 150–160 with no forbidden characters). Lint OK on all four. ✔

## 4. Voice

Opening type ⑤ (one-line common misunderstanding, then the facts) in all four; no stock hypothetical opener; first paragraph delivers the rule and the exception at once. Headings are column-specific nouns/questions, not imperative checklists. ko reads as calm 합니다체 by a Korean practitioner; ja is consistent です・ます with natural phrasing (「手続はゼロにはなりません」「身近な先例もあります」); en is plain and active; zh-hant uses Taiwan practice terms (國稅局、營所稅、扣繳義務人、統一發票、商工行政服務入口網) with no mainland vocabulary or simplified characters (lint). No translationese found that needed changing beyond item 1–3 below.

## 5. Sentence variety

Tool: 0 FAIL in all four (see verdict). Self-check items 2–7: opener not formulaic and not a scene (2 ✔); very short sentences ko 6/61, ja 9/66, en 19/76, zh 4/38 (3 ✔); paragraph-start repetition within limits, opener_rep 0.0 / 0.10 / 0.095 / 0.067 (4 ✔); no three consecutive claim-(statute)-caveat paragraphs (caveat 0/1/0/0) and each file has an uncited paragraph (the "no form or ID number is named" paragraph) (5 ✔); contrast templates 0 in all four and no rebuttal of an unmade claim (6 ✔); last paragraph ends on the January 扣繳憑單 deadline — this column's own fact — with no copied disclaimer or sales line (7 ✔). No MONOTONY finding.

## Issues (Original → problem & reason → fix → facts preserved)

1. ko line 43: 「…가공·제조에는 쓰지 않는 창고·관리 장소(倉棧或保養場所)는 제외합니다.」 → 保養場所 means a maintenance/servicing place; 「관리 장소」 reads as "management place", a loose rendering of a statutory term (所得稅法 §10 ¶1 「專為採購貨品用之倉棧或保養場所」). Minor wording. → Applied: 「창고·정비 장소(倉棧或保養場所)」. → Carve-out condition (purchasing-only, not used for processing/manufacturing), article and link unchanged.
2. ja line 43: 「…倉庫や保管場所（倉棧或保養場所）を除いています。」 → 保管場所 (storage place) duplicates 倉庫 and drops the "maintenance" sense of 保養場所. Minor wording. → Applied: 「倉庫や整備場所（倉棧或保養場所）」. → Same condition, article and link unchanged.
3. en line 45: "…leaves out a warehouse or similar place used solely for purchasing goods…" → "similar place" is vaguer than the statute's 保養場所 (maintenance facility). Minor wording. → Applied: "a warehouse or maintenance facility used solely for purchasing goods and not for processing or manufacturing them". → Condition and citation unchanged.
4. zh-hant line 33: 「代表人能做什麼？經濟部92年10月29日經商字第09202221350號函說，…」 → the sentence that states what the 2003 ruling held had no inline link (the same page was linked only for the editor's note in the previous paragraph and in the sources list); brief rule 2 asks for the link right after the claim. → Applied: wrapped 「經商字第09202221350號函」 with https://gcis.nat.gov.tw/elaw/constructionDetail?consCd=7020 (the URL already used in the file). → Text of the claim unchanged.
5. en line 69 and sources: "Taiwan's agreements with Japan and Korea carry the same exclusion as Article 5(4) and Article 5(5) respectively." → an agreement-term claim with no link, and the Japan/Korea texts were absent from the en sources list. → Applied: linked "Japan" to https://www.mof.gov.tw/download/10462 and "Korea" to https://www.mof.gov.tw/download/d1f7663ee1cf4074bd307a87e852d389 (both verified above: JP 5(4)(d)–(f), KR 5(5)(d)–(f)), and added both English texts to the en "Official sources" line. → Article numbers and wording unchanged.

No major issue. Nothing required of the writer.

## Minor edits applied (complete list)

- drafts/T11/ko.md: 「창고·관리 장소」 → 「창고·정비 장소」 (§10 ¶1 paragraph).
- drafts/T11/ja.md: 「倉庫や保管場所」 → 「倉庫や整備場所」 (§10 ¶1 paragraph).
- drafts/T11/en.md: "a warehouse or similar place" → "a warehouse or maintenance facility" (§10 ¶1 paragraph); inline links added on "Japan" and "Korea" in the Vietnam section; Taiwan–Japan and Taiwan–Korea English texts appended to the MOF sources line.
- drafts/T11/zh-hant.md: inline link added on 「經商字第09202221350號函」 (2003 ruling paragraph).
- After the edits: lint OK ×4; variety 0 FAIL ×4 (outputs above). Lengths unchanged except zh-hant 2,074 → 2,076 chars.

## Image

images/T11.webp — a plain desk by a window with a closed folder, a potted plant and a jacket over the chair, a blurred rooftop view outside. Fits a small liaison office; fictional, no faces, no readable text, no logos, no flags, no readable documents; respectful. Verdict: OK.

VERDICT: PASS
