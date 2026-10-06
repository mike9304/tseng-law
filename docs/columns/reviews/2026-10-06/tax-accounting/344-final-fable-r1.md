# T15 final review (Claude Fable 5.1, r1) — taiwan-stamp-tax-contracts-receipts-foreign-companies (ko · ja · en · zh-hant)

Review date: 2026-10-06 (KST; log finished 2026-10-07 00:xx KST after an API-limit pause — all sources were fetched on 2026-10-06 and the saved files were reused).

## Verdict

PASS — all four language files are publishable as they now stand. Every rate, amount, article number, date, procedure and office statement was checked against the official text I opened myself (saved under reviews/T15/sources/, index in sources/README.md). No major issue found. Three minor wording edits applied (listed below); lint OK and variety check OK on all four files after the edits. Image OK.

## Scope checked (official pages opened by me on 2026-10-06)

Statutes (law.moj.gov.tw, single-article pages via fetch_law.py; header dates from LawAll):
- 印花稅法 (G0340091) §1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17, 23, 24 — 修正日期 民國 91 年 05 月 15 日 (2002-05-15); 法規整編資料截止日 民國 115 年 09 月 24 日; still listed as current law
- 印花稅法施行細則 (G0340092) §5 — 修正日期 民國 68 年 02 月 13 日 (1979-02-13)
- 印花稅彙總繳納辦法 (G0340094) §2, 4, 5 — 修正日期 民國 77 年 08 月 12 日 (1988-08-12)
- 現行法規所定貨幣單位折算新臺幣條例 (G0380048) §2 — 公布日期 民國 81 年 07 月 17 日 (1992-07-17)
- 稅捐稽徵法 (G0340001) §20, §48-1 — 修正日期 民國 110 年 12 月 17 日 (2021-12-17)
- law.moj.gov.tw/ENG G0340142 — "The Taxpayer Rights Protection Act" (Amended Date 2025-05-28), title only

MOF eTax portal (財政部稅務入口網 地方稅節稅手冊):
- 貳、印花稅的課徵 (n10kBpY) — 更新日期 115-08-26
- 伍、印花稅之節稅方法 (2DrzRRw) — 更新日期 115-08-26
- 柒、印花稅問答實例 (lPa2Da8) — 更新日期 115-04-09
- 印花稅 貼心小叮嚀 (gmwWBz5) — 更新日期 115-08-26 (reference only)

MOF rulings database (ttc.mof.gov.tw, 印花稅法令彙編 一一一年版, text pulled through the site's own API because the pages are JS-rendered):
- TaxSN 120181 — 財政部74/02/09台財稅第11750號函 (verbatim text saved)
- TaxSN 120270 — 財政部104/07/09台財稅字第10404573930號令 (verbatim text saved)
- Keyword searches of the whole 印花稅法 一一一年版 compilation, repeated by me: 「電子」 4 hits (120223, 120270, 120309, 120403 — only 120270 concerns a contract), 「電子簽章」 1 hit (120270), 「電子郵件」 0, 「傳真」 0, 「網路」 0, 「境外」 0, 「國外」 5 (incl. 120181)

Local tax offices:
- 臺北市稅捐稽徵處 1999常見問答「電子契約是否要繳納印花稅？」 — 資料更新 111-02-18
- 臺北市稅捐稽徵處 本府1999常見問答「雙方均在國外簽訂的合約，要不要繳印花稅？」 — 資料更新 115-01-21
- 臺中市政府地方稅務局「在國外簽訂的承攬合約是否要貼用印花稅票？」 — 更新日期 2024-09-20
- 新竹市稅務局 簡報「印花稅實務暨網路申報」 (PDF, 27 pages) — PDF CreationDate 2025-12-08

Also read: brief-BATCH.md, brief-EDITORIAL-VOICE.md, shared/SENTENCE-VARIETY-RULE.md (§5–6), topics/T15.md (incl. binding R9 notes), research/R9-statutes.md, research/R9-official.md Part 1, research/T15-extra.md, drafts/T15/facts.md (not trusted; used only as a claim list), LINKS.md, lint.py, images/T15.webp. Internal-link targets confirmed on disk in the site repo for all four languages (321-taiwan-business-tax-vat-e-invoice-foreign-subsidiary; 004-taiwan-company-subsidiary-vs-branch).

## 1. Law and facts — result per claim (all four languages)

Every claim below was matched against the saved official text; the language versions agree with each other.

- Scope: only documents 在中華民國領域內書立 (§1) — correct in all four.
- Four taxable categories and the 承攬契據 definition with its examples 工程/印刷/代理加工 (§5) — correct.
- §5(2) proviso: 兼具營業發票性質之銀錢收據 and 兼具銀錢收據性質之營業發票 excluded → 統一發票 carries no receipt stamp tax — correct in body and FAQ (ko/ja/en FAQ 3; zh opening). eTax Q6 confirms.
- Rates (§7, Act last amended 2002-05-15, stated "as of October 2026" in every version): 銀錢收據 4‰ by 立據人; 押標金收據 1‰ by 立據人; 承攬契據 1‰; 不動產契據 1‰; 買賣動產契據 「四元」, all by 立約或立據人 — tables correct in all four.
- NT$12: stated only with §3 (國幣) + conversion act §2 (×3, 公布 1992-07-17) + eTax table 「每件稅額新臺幣 12 元」, exactly as the binding note requires — correct in all four.
- Substance over title; quotation/delivery note used as a contract stamped by nature; mixed natures → higher rate (§13 ¶1, ¶3; eTax Q7(三)) — correct.
- Worked examples (each labelled invented): ko 8m+2m → 10,000 vs 12+2,000=2,012, diff 7,988 ✓; ja 15m+3m → 18,000 vs 3,012, diff 14,988 ✓; en 6m+1.5m → 7,500 vs 1,512, diff 5,988 ✓; zh 9m+1m → 10,000 vs 1,012 ✓. Method matches eTax's elevator example (500萬 → 5,000 vs 1,012) and the Hsinchu slides (600萬 → 6,000 at the higher 承攬 rate).
- Per original: §12 + eTax Q7(一) (both parties are 立據人, each stamps its own copy) — correct.
- Timing 於書立後交付或使用時 (§8 ¶1); performance irrelevant and no refund after termination (eTax Q8(二)); foreign currency converted at the government-prescribed/approved rate at delivery or use (§17) — correct.
- Payment methods: post-office stamps + cancellation across the 騎縫 with a seal (§10; eTax); 繳款書 for large amounts (§8 ¶1), online issue with 自然人憑證/工商憑證 and the 證明聯 pasted on the contract (eTax); 彙總繳納 with approval of the 所在地主管稽徵機關 (§8 ¶2), two-month periods, by the 15th of Jan/Mar/May/Jul/Sep/Nov with the 總繳申報表 in the same deadline (辦法 §5) — correct. zh additionally cites 辦法 §4 (「本憑證印花稅總繳」戳記) and §2 ¶2 (deduct at payment with approval) — both verbatim-supported.
- Cheque/draft/promissory-note receipts stating name and number need no stamps; NT$500,000 cash → NT$2,000 (eTax 節稅方法) — correct.
- §6(3) head office–branch internal documents exempt; 施行細則 §5: 轉投資性質之獨立組織 is not a 分支機構; Hsinchu slides: 母、子公司各為獨立法人 → taxable documents between them bear stamp tax — correct in all four, and parent–subsidiary contracts are presented as taxable (binding note).
- Signed abroad: MOF 74/02/09 台財稅第11750號函 quoted correctly (technical-service 承攬 contract; whichever side signs first, the Taiwan company signs in Taiwan → 境內書立). Taichung (2024-09-20): both parties abroad → outside scope. Taipei (2026-01-21): choosing to sign abroad for a tax benefit, abusing legal form → 納稅者權利保護法 tax avoidance. Each is attributed to its office and dated, as the binding note requires — correct in all four. The en line about a Vietnamese parent signing first in Ho Chi Minh City only applies the ruling's reasoning; no Vietnamese law stated.
- Electronic contracts: all four say exactly what the record shows — one MOF ruling (104/07/09 台財稅字第10404573930號令) on government e-procurement contracts signed by e-signature, repeated by the Taipei FAQ (2022-02-18); no ruling in the 111年版 compilation exempting or taxing private e-mail/e-signature contracts; readers told to ask the local tax office. I re-ran the compilation search myself (see scope) and it confirms the claim. No version says e-contracts are exempt, and none says all e-contracts are taxable.
- Penalties: §23 ¶1 5–15× of the missing tax after making up the stamps; §23 ¶2 late 總繳 → 稅捐稽徵法 §20 (1% per 3 days), after 30 days enforcement + 1–5×; §24 5–10× uncancelled / improperly cancelled, 20–30× reused; 稅捐稽徵法 §48-1 voluntary disclosure before 檢舉/investigation waives the penalty, interest charged — correct in all four. §23 ¶3's 「一千元」 is not converted or stated (binding note; the Hsinchu slides' NT$3,000 figure is noted only here).
- Retention 2 years after rights and obligations end (§4); examples 2027-12-31 → 2029-12-31 (ko/en/zh) and 2027-03-31 → 2029-03-31 (ja) — correct.
- Omitted on purpose and confirmed absent: the 2019 abolition bill (UNVERIFIED), §23(3) NT$ figure, any claim that private e-contracts are exempt or taxable.
- Home-country law: ko and ja say only that the Taiwan Act defines its own taxable documents and rates; en and zh state no US/Vietnamese rule. No tax agreement is discussed (none applies to stamp tax).

Non-blocking observation (no change required): §4's two-year rule is stated accurately; the Hsinchu slides also recall the separate five-year accounting-voucher retention under 商業會計法 §38, which the columns do not contradict (they never say two years is the only retention duty).

## 2. Citations

Inline links sit right after the claims; every statute link points to the correct law.moj.gov.tw single-article URL (pcode/flno checked: G0340091 §1,2(en),3,4,5,6,7,8,10,12,13,17,23,24; G0340092 §5; G0340094 §2(zh),4(zh),5; G0380048 §2; G0340001 §20, §48-1). MOF ruling links go to the official rulings-database pages (120181, 120270); office statements link to the Taipei/Taichung/Hsinchu pages opened above. Each sources section lists every source used with page dates and the check date 2026-10-06 (ko 확인일, ja 確認日, en "Sources checked", zh 資料查證日). Internal links: ko/ja/en → 321 + 004 (both exist), zh → 321 (exists); no batch-3 links; no board link.

## 3. Rules

No bold, no phone, no street address, email-only contact in one short paragraph with the correct firm name per language (호정(昊鼎)국제법률사무소 / 昊鼎国際法律事務所 / Hovering International Law Firm / 昊鼎國際法律事務所); no bookkeeping/filing/audit offer; author legal-ai-assistant; no lawyer/CPA/native-review claim; every hypothetical labelled after the scene ((가상의 예입니다) / （架空の例です） / (an invented example) / （虛構情境）). Frontmatter per brief (topic "tax", tags ["tax-accounting"], audience = file language, NNN featured_image, dates 2026-10-06; en seoTitle 42 chars because title + " | Hovering Law" > 60; en summary 150–160 chars with no forbidden characters). Lengths inside the medium range (ko 2,921 chars; ja 3,400; zh 2,099; en 1,495 words). No judgment cited.

## 4. Voice

- ko: 합니다체 throughout; opening type ⑤ (a common misunderstanding in one line, then the facts); the first two paragraphs carry the subsidiary-is-not-a-branch point and the scope; one reader question in the body; title names the documents and rates; no AI filler or checklist headings. One mistranslation fixed (below).
- ja: natural です・ます; opening type ⑤ on the "electronic = no stamp tax" assumption; 体言止め not overused; no 「〜について解説します」; the 1通/各通 and 罰鍰（行政上の罰金） glosses read naturally for Japanese finance staff.
- en: plain, active; opening type ⑤ on "signed in California"; no "it is important to note"/"navigate"; must/may distinguished; one precision edit (below).
- zh-hant: Taiwan usage throughout (稽徵機關, 統一發票, 彙總繳納, 貼花, 繳款書); no mainland vocabulary or simplified characters (lint); opening type ⑤ on 「我們都開統一發票」; short sentences such as 「看性質，不看名稱。」「子公司不適用。」「繳法有三種。」.
- Titles/summaries do not assert more than the body.

## 5. Sentence variety

variety_metrics.py check, run after the edits — no FAIL line in any file:
- ko: sentences=50 cv=0.464 short=0.18 run3=0.042 opener_rep=0.062 cite_end=0.14 contrast=1 caveat=0 q=1 — OK
- ja: sentences=56 cv=0.489 short=0.179 run3=0.037 opener_rep=0.0 cite_end=0.143 contrast=0 caveat=0 q=0 — OK
- en: sentences=65 cv=0.6 short=0.2 run3=0.048 opener_rep=0.0 cite_end=0.2 contrast=0 caveat=0 q=1 — OK
- zh-hant: sentences=41 cv=0.591 short=0.122 run3=0.026 opener_rep=0.0 cite_end=0.317 contrast=0 caveat=0 q=1 — OK
Self-check items 2–7 (§5 of the rule): no stock opener and the assigned type ⑤ is used in all four; at least two very short sentences in each; no three paragraphs starting with the same word; no three consecutive claim-(statute)-caveat paragraphs and at least one paragraph without a citation in each; contrast templates ≤ 1; the last paragraph ends on this column's facts (§4 retention and a concrete date) with the contact line before it, worded differently per language. No MONOTONY finding.

## 6. Issues (Original → problem & reason → fix → facts preserved)

Issue 1 (ko, minor, applied)
- Original: 「…[인지세법 시행세칙 제5조]는 재투자(轉投資) 성격의 독립 조직을 분지기구로 보지 않습니다.」
- Problem & reason: 「재투자」 means reinvestment in Korean; 轉投資 in 施行細則 §5 (「其屬於轉投資性質之獨立組織，不得視為分支機構」) means a company's equity investment in another company, i.e. a subsidiary. 「분지기구」 also lacked its Chinese gloss for Korean readers.
- Fix (applied): 「…는 출자(轉投資)로 세운 독립 조직을 분지기구(分支機構)로 보지 않습니다.」
- Facts preserved: same article, same link, same legal meaning (a separately invested independent entity is not a branch for the §6(3) exemption).

Issue 2 (en, minor precision, applied)
- Original: "…cancel each one with a seal or signature across the edge of the stamp and the paper ([Article 10]…)"
- Problem & reason: §10 reads 「應由納稅義務人於每枚稅票與原件紙面騎縫處，加蓋圖章註銷之，個人得以簽名或畫押代替圖章」 — only an individual may substitute a signature; a company must cancel with its seal. "seal or signature" let a corporate reader think a signature suffices. (ko, ja and zh already say seal only.)
- Fix (applied): "…cancel each one with the company seal across the edge of the stamp and the paper; only an individual may sign instead of sealing ([Article 10]…; eTax portal)."
- Facts preserved: Article 10 citation and link, post-office purchase, cancellation across the edge; now matches the statute's condition exactly.

Issue 3 (en, minor wording, applied)
- Original: "[Article 3] denominates the Act's amounts in the old national currency, and …"
- Problem & reason: §3 says 「以國幣為單位」; "old" is an editorial gloss not in the text, and the official English reads "national currency (yuan)".
- Fix (applied): "[Article 3] denominates the Act's amounts in the national currency (國幣), and …"
- Facts preserved: §3 citation, the ×3 conversion under the 1992 act, NT$12 result.

No major issues. Nothing unsupported, overstated, outdated or mixed up was found in any version; the four versions do not contradict each other on law.

## Minor edits applied

1. drafts/T15/ko.md line 27: 「재투자(轉投資) 성격의 독립 조직을 분지기구로」 → 「출자(轉投資)로 세운 독립 조직을 분지기구(分支機構)로」.
2. drafts/T15/en.md line 58: "with a seal or signature across the edge of the stamp and the paper" → "with the company seal across the edge of the stamp and the paper; only an individual may sign instead of sealing".
3. drafts/T15/en.md line 42: "in the old national currency" → "in the national currency (國幣)".

After the edits: lint.py OK for ko (2,921 chars), ja (3,400), en (1,495 words), zh-hant (2,099); variety check OK on all four (figures in §5). ja.md and zh-hant.md were not edited.

## Image verdict

images/T15.webp — OK. A wooden hand stamp lying on a dark wooden desk beside a red ink pad and a blank cream sheet of paper. Fits the column (stamps are cancelled by sealing across the edge of the revenue stamp and the paper). Fictional and unidentifiable: no faces, no text, no logos, no flags, no readable document. Respectful, calm.

VERDICT: PASS
