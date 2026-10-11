# FINAL REVIEW r1 — ja-048-taiwan-stocks-direct-investment-tax (reviewer: Claude Fable 5.1, 2026-10-12)

## Verdict

PASS. The rewrite preserves every legal claim, qualifier, number, article reference, link, source entry and contact line of the published original. The guard passes, the variety checker has 0 FAIL, and the tests patch only re-anchors the lastmod override. No edits were needed.

## Scope checked

- orig.md vs draft.md, read in full, compared paragraph by paragraph (below).
- Front matter: python diff of the YAML block. Only `lastmod` differs (2026-09-30 -> 2026-10-12). read_time kept at 約7分 (body 99% of original). H1, all 8 H2 headings, featured_image, FAQ, summary identical.
- Links: 43 inline markdown links in each file, sorted sets identical (same anchor text and targets). Sources section and 確認日 line byte-identical.
- Bold: 0 occurrences of `**` in the draft.
- Counts preserved: 21％ (3/3), 10％ (6/7, the extra one is the paragraph opener 「10％は、日本国籍だけで…」 which restates the existing claim), 0.3％, 0.1％, 2015年11月26日, 2017年, 約50銘柄, 2026年12月, 6か月, 第10条 (3/3), 第4条の1 (3/3), 第3条第1号, 第10条第2項, 第9条第8号, 2024年以降, 場合があります (4/4), とは限りません (2/2), ただし (3/3).
- Guard re-run by me: `GUARD: PASS` (length 3629 -> 3593, monotony 28.8 -> 13.3).
- Variety: `variety_metrics.py check draft.md --lang ja` -> sentences=86 cv=0.467 short=0.198 run3=0.024 opener_rep=0.179 cite_end=0.0 contrast=1 caveat=2 q=2; 0 FAIL, 1 WARN (87% です・ます endings, expected for this register).
- tests.patch read; vitest-1.log tail shows 75 files / 1031 tests passed.

## Fact table (original -> rewrite -> status)

### Intro
- Direct holding of TSMC / 0050 spans Taiwan and Japan taxes -> draft para 1 -> preserved.
- Taiwan side: tax at sale + withholding on dividends; then compute Japan-resident filing -> draft para 1 (split into 3 sentences) -> preserved.
- Rakuten: from 2026-12, about 50 Taiwan stocks (cash trading), link; "product notice, not a tax-law basis" -> draft para 2 -> preserved (one sentence split into two).
- Premise: Japan resident holding Taiwan-listed securities directly and non-resident in Taiwan; non-Taiwan-listed products / depositary receipts may differ; long stays -> residency column link; individual Japan filing -> tax accountant / tax office -> draft para 3 -> preserved.

### 台湾の証券口座と名義
- Foreign investors must register with TWSE; basis 華僑及外國人投資證券管理辦法 第10条 (link) -> draft para 1 sentence 1 (basis folded in) -> preserved.
- TWSE guidance: get investor registration number first, then open account at local broker (link) -> draft para 1 sentences 2-3, link in parentheses -> preserved.
- Onshore foreigners register via local broker (onshore link); offshore via agent/representative in Taiwan (offshore link) -> draft para 2, order swapped, each link still attached to the correct case -> preserved. The dropped sentence 「登録の窓口は…異なります」 was a preview with no independent fact.
- KYC / residence documents / account name -> confirm with broker -> preserved.
- Japanese broker app does not mean an own-name account in Taiwan; keep registration docs, account terms, trade history, dividend statements to trace who was paid -> draft para 3 identical -> preserved.

### 台湾では売却益に所得税がなくても、証券取引税はかかる
- Securities transaction tax under 証券取引税条例 (link), on sale amount not profit -> draft para 2 -> preserved.
- 0.3% general stocks (MOF link); 0.1% for qualifying investment trust beneficiary certificates (link) -> draft para 2 -> preserved, "該当する" and "とされています" kept.
- ETFs such as 0050: apply rate per legal classification and special trading rules; seller bears the tax (MOF link) -> draft para 2 (merged) -> preserved.
- 所得税法第4条の1 (link): income tax on securities transaction income suspended; losses not deductible -> draft para 1 -> preserved. The draft adds the Q/A 「かかるのでしょうか？かかりません。」 immediately followed by the statutory wording 「課税を停止しているからです」; same strength as the original H2 「所得税がなくても」 and the original body 「所得税がかからなくても」. Not a shift.
- Even without income tax, the sale itself carries transaction tax -> draft 「それでも証券取引税はかかります」 -> preserved.
- Japan tax does not disappear; keep trade confirmations, fees, FX records -> draft para 3 -> preserved.

### 配当の源泉税と日台民間租税取決め
- Domestic law: 21% withholding on dividends paid by a company to a non-resident individual; 各類所得扣繳率標準 第3条第1号 (link) -> draft para 1 -> preserved (rate leads, article follows as subject).
- ETF cash distributions may not take the company-dividend rate depending on payer and content; keep statements showing the withholding breakdown -> preserved.
- Agreement may apply; private counterparts: 公益財団法人交流協会 (JP) / 亜東関係協会 (TW); MOF list shows signing date 2015-11-26 (link) -> draft para 2 -> preserved.
- NTA: Taiwan-domiciled persons receive relief/exemption on certain Japan-source income under 外国居住者等所得相互免除法 (link); applies to payments on/after 2017-01-01; this concerns Japan taxation; Taiwan-side procedure must be checked for dividends received from Taiwan -> draft para 3 -> preserved.
- MOF withholding table: dividend rate under the Japan agreement capped at 10% (link); MOF guidance on Japanese partnerships: Art. 10(2), beneficial owner resident of the other side -> tax not exceeding 10% of gross dividends; documents proving residence and beneficial ownership required (link) -> draft para 4 -> preserved.
- Cap applies to qualifying Japan residents, not automatically by nationality -> draft para 5 (two sentences) -> preserved.
- MOF accepts a residence certificate issued by the other side within 6 months before the application (link) -> preserved.
- Before dividends: confirm certificates, beneficial-owner check, application method with broker and payer; how to get a Japanese residence certificate -> tax office / broker -> draft para 6 -> preserved.
- If already withheld at domestic rate: check refund availability and documents in Taiwan -> draft para 7 (own paragraph) -> preserved.

### 日本での申告と、円への換算
- Non-NISA holders consider Japan filing for dividends and gains; rate and whether withholding account suffices vs tax return depend on account type and other income -> draft para 1 -> preserved.
- Taiwan transaction tax not necessarily deductible from Japan tax; Taiwan suspension does not remove Japan filing; for yen conversion gather trade date, settlement date, fees, FX rate -> draft para 2 (prefixed 「売却については」, consistent with the content) -> preserved.
- Foreign tax credit: resident who paid foreign income-tax-equivalent may deduct within the limit (NTA link); Taiwan dividend withholding may qualify (場合があります kept); attach statement and proof of payment -> draft para 3 (rule first, then application; 「これが外国税額控除です」 is a label, not a new fact) -> preserved.
- NTA: tax that the taxpayer may voluntarily claim back is not creditable foreign income tax; portion withheld above 10% that is refundable in Taiwan needs individual confirmation; keep dividend statements, withholding proof, Taiwan refund/approval documents -> draft para 4 (introduced by 「ただし、控除できない税もあります」, which summarizes the following NTA rule) -> preserved.

### NISAでも残る台湾の源泉税
- NISA exempts Japan tax only; from 2024 dividends and listed-stock capital gains exempt (NTA link); dividend exemption limited to those paid through the NISA broker (株式数比例配分方式) -> draft para 1 -> preserved.
- Taiwan withholding is under Taiwan law; NTA: foreign income tax on dividends inside the NISA account is not eligible for foreign tax credit (link); so Taiwan withholding cannot be credited -> draft para 2 identical -> preserved.
- Whether the 10% cap or refund applies is a Taiwan-side procedure separate from NISA -> draft para 3 -> preserved.
- Rakuten plans NISA growth-quota handling (link); product info, not tax law; availability and handling of Taiwan relief differ by broker -> draft para 4 -> preserved.

### 台湾株の相続
- Inheritance is separate; 遺産・贈与税法第9条第8号 (link): situs of shares = seat of issuer / invested business; shares of a Taiwan-headquartered company may be Taiwan property even if the investor lives in Japan (場合があります kept) -> draft para 1 (one reader question inserted) -> preserved.
- ETF units: check issuer and legal form separately; link to estate-tax column -> draft para 2 -> preserved.

### 台湾での手続きに関するご相談
- Firm can check actual account name, holding form, legal classification, Taiwan-side documents on withholding and inheritance -> draft para 1 -> preserved (「どのような形で証券を保有しているか」 -> 「証券の保有形態」, same meaning).
- Japan filing, foreign tax credit, residence certificate -> with a Japanese tax accountant -> moved into draft para 1 -> preserved.
- First consultation with 弁護士・曾雋崴: send residence, ticker name and code, account terms, trade history, dividend/withholding statements with a short note to wei@hoveringlaw.com.tw; outlook given after reviewing documents; office address 103 臺北市大同區承德路一段35號7樓之2 -> draft para 2 -> preserved.
- No new promise, sales line, disclaimer formula or first-person story added.

### 参照した公式資料 / 確認日
- Byte-identical to the original.

## Blocking issues

None.

## MONOTONY items

None blocking. Rule section 5 self-check, re-verified by me:
1. Tool: 0 FAIL (WARN only on です・ます share, inherent to the register).
2. Opening is not a stock hypothetical; it names the products and the two jurisdictions.
3. Very short sentences present: 「かかりません。」「税法の根拠にはなりません。」「ここまでは台湾の税金です。」「台湾の国内法では21％です。」
4. Paragraph openers read vertically: no word starts 3 paragraphs (台湾の× 2, 日本の× 2, NISA × 2, 楽天証券 × 2).
5. No three consecutive claim-then-ただし paragraphs; several paragraphs carry no citation (broker app paragraph, pre-dividend confirmation, refund paragraph).
6. Contrast template count 1 (利益ではなく売却金額); no rebuttal of a claim the reader did not make.
7. Last body paragraph ends on this column's facts (what to send, address), same as the original house format; no copied sales line.
8. です・ます throughout; no bold; no invented first person; headings unchanged and not imperative/checklist.
9. No article number, deadline, amount, link or label lost (verified above).

Native reading: the rhythm now alternates short answers with longer statutory sentences, the two reader questions sit where a reader would ask them, and the section 21% / 10% openers read like a practitioner's explanation rather than a template. One mildly elliptical sentence (「第3条第1号が、…配当の源泉徴収率として定めています」, object 21％ carried over from the prior sentence) is acceptable Japanese and was left as is.

## Length

3629 -> 3593 chars (99%). Cuts were the two preview/transition sentences (「登録の窓口は…異なります」, 「相続は…別の話です」 shortened) and the merge of the contact section from three paragraphs to two. No legal point removed.

## Tests verdict

PASS. tests.patch touches only `src/lib/__tests__/expertise-columns-20260930.test.ts`: adds `'ja/048': '2026-10-12'` to the `FACT_FIX_LASTMOD` override map and updates the comment above it. No assertion removed, loosened, skipped or focused; no other column's expectations changed. The file has no pins on ja/048 headings, paragraphs or links, so nothing else needed re-anchoring. vitest-1.log: 75 files, 1031 tests passed.

## Tiny edits applied

None. Guard re-run unchanged: GUARD: PASS.

## Original issues (not blocking)

- The two signatory bodies are named as 公益財団法人交流協会 / 亜東関係協会, their names at the 2015 signing. Both have since been renamed (日本台湾交流協会 / 台湾日本関係協会). The sentence is in past tense (結んだのは) so it is historically accurate; a future edit could add the current names. Not verified online in this job.
- 「かかりません」 / 「所得税がなくても」 express the Art. 4-1 suspension (停徵) as "not taxed"; the original already uses this wording in the H2 and body, and the statutory wording (課税を停止) follows immediately. Acceptable as is.
- The office street address trips the house lint; it is part of the original's contact line and was intentionally kept.
