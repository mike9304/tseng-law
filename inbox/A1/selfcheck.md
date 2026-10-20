# A1 selfcheck (2026-10-20)

## Variety check (variety_metrics.py check; zh with --lang zh-hant) — re-run after Astra r1 fix
```
drafts/A1/ko.md [ko] sentences=56 mean=39.1 cv=0.511 short=0.161 run3=0.074 opener_rep=0.0 cite_end=0.089 cite_para=0.529 contrast=0 caveat=0 q=1
  WARN 88% of sentences end in '니다.' — vary endings within the register
drafts/A1/ja.md [ja] sentences=43 mean=41.5 cv=0.465 short=0.116 run3=0.049 opener_rep=0.133 cite_end=0.116 cite_para=0.4 contrast=1 caveat=0 q=0
  OK — no variety limit violated
drafts/A1/en.md [en] sentences=61 mean=17.8 cv=0.543 short=0.213 run3=0.085 opener_rep=0.111 cite_end=0.033 cite_para=0.5 contrast=1 caveat=0 q=3
  OK — no variety limit violated
drafts/A1/zh.md [zh-hant] sentences=39 mean=38.4 cv=0.557 short=0.128 run3=0.108 opener_rep=0.0 cite_end=0.103 cite_para=0.5 contrast=0 caveat=0 q=2
  OK — no variety limit violated
```
FAIL 0 in all four. ko WARN (88% '니다.' endings) is inherent to 합니다체; not a hard limit.

## Length (body excl. front matter, H1, sources; research/bin/blen.py) — after r1 fix
```
drafts/A1/en.md words 1090
drafts/A1/ja.md chars_nospace 1945 chars_with_space 1986
drafts/A1/ko.md chars_nospace 2397 chars_with_space 3085
drafts/A1/zh.md chars_nospace 1626 chars_with_space 1669
```
ko counted without spaces (house measure). en 1,090 words (limit 1,100).

## Duplicate check
grep of all four locales in ref/src/content for 洗錢防制法 / 人頭帳戶 / 提供帳戶 / 口座 / account lending:
- ja 218 `japanese-resident-taiwan-account-lending-crime` (criminal liability of lending, interpreter, exit ban, residence) — criminal angle covered in ja.
- zh 161 `job-scam-payroll-account-atm-card-taiwan`, zh 223 `account-lending-prosecutor-summons-money-laundering-taiwan`, zh 534 `taiwan-account-admonition-online-seller-payment-limits` — criminal side / 告誡 restrictions covered in zh.
- ja 272 warning account, ja 225 / zh 246 / zh 247 victim-side procedures — different angle.
- No column in any locale on the account provider's civil liability to scam victims (民法184/185, non-prosecution vs negligence). ko and en had no account-lending column at all.
Decision: ko/en = queued angle (Art. 22 offence + civil liability). ja/zh = narrower civil-liability angle, linking to ja 218 / zh 223 for the criminal side. Recorded in STATUS.md.
Slug `taiwan-bank-account-lending-scam-victim-civil-liability`: 0 matches in ref filenames.

## Voice self-check (SENTENCE-VARIETY-RULE §5)
- Openings: ko = judgment result ("검찰은 기소하지 않았습니다."), en = concrete legal fact, ja = reader question, zh = number ("十五萬元，加上利息。"). No stock hypothetical opener.
- Short sentences ≥2 in each; no 3 paragraphs with same opener (tool); contrast ≤1; caveat openers 0.
- Hypothetical (NT$5,000 sale) labelled in-text in ko/en.
- No bold, no emoji, no checklist headings, ko 합니다체 / ja です・ます throughout. Contact = email + Taichung address once. Lawyer name 曾雋崴. No claim of lawyer review. author legal-ai-assistant.
- Gender: no pronoun inferred for parties (en uses "they"; zh pronoun removed).

## Open risks
- Finality of the two judgments not checked (stated in each sources list). Both are second-instance; amounts suggest no further appeal, but this is not asserted.
- Taipei judgment: holder's age 21 and "loan" story are the holder's assertions; drafts present them as claims.
- Art. 503 summarized for acquittal only (statute also covers 免訴/不受理).
- Art. 6 of the regulation: exceptions (utilities, taxes, 罰金, 罰鍰, 滯納金) and the payment/transfer scope of the e-banking ban now stated (r1). Debit-purchase aggregation, counter-justification rule and e-payment-account limits still omitted for length.
- ko body is 2,397 chars without spaces / ~3,085 with spaces; if the gate counts spaces, it is above 2,500.
- Both judgment texts end with 不得上訴; drafts keep the conservative 'finality not separately checked' line (unchanged in r1).

## Astra r1 fix (2026-10-20)
Source: ASTRA-FAIL.md (r1) → renamed ASTRA-FAIL-fixed-1.md. All points verified against live law.moj.gov.tw LawSingle pages and the two printData judgments (see facts.md).
1. MAJOR ja — Taipei judgment does not mention transfer to another account → replaced with cash withdrawal on the day of deposit and handover. Same inaccuracy also fixed in ko (다른 계좌로 보내는), en ("forwarding"), zh (轉走).
2. MAJOR ja/zh — negligence alone presented as sufficient, loss unbounded → added fault + adequate causation requirement (Hualien quoting 最高法院110年度台上字第204號; Taipei applied same test) and "loss caused by that tort". Applied to ko/en as well for consistency; Taipei paragraph in all four now records the court's causation finding.
3. MAJOR ko/en — Art. 6 restrictions unconditional → added utility/tax/罰金/罰鍰/滯納金 exceptions; e-banking ban described as payments/transfers via online/mobile/telephone banking or payment-platform-linked accounts.
4. MAJOR all — Art. 487 eligibility → body and FAQ in all four now require that the victim's loss arose from the crime charged.
5. MAJOR all — prevalence claims about scammers' names → conditional formulation in all four (ja/zh headings adjusted too).
6. featured_image "TBD" — expected per TASK.md; left as is.
Links: research/bin/links.py → BAD total 0.

## Astra r2 fix (2026-10-20 ~20:10 KST)
Source: ASTRA-FAIL.md (r2) → renamed ASTRA-FAIL-fixed-2.md. Statutes re-fetched live (刑訴487/488/503, 洗錢防制法22: text identical to facts.md quotes).
1. MAJOR ko/zh, Art. 487: the holder's own indictment is no longer stated as a condition. Body and FAQ 3 now say the action is filed inside a pending criminal case, against the defendant and anyone liable under the Civil Code (「對於被告及依民法負賠償責任之人」), and that the loss must arise from the crime charged in that case. The same r1 wording was also in ja/en, so the fix was applied to all four.
2. MAJOR en, "Requests for an account rarely say what they are." Deleted. The three requests are now introduced as "three illustrative requests, none from a real case". "Taiwan's courts ask…" became "Each raises two separate questions under Taiwan law".
3. MAJOR all, judgment verification blocker: both judgments were re-opened live through printData (identical to cache) and through the official open-data PDFs (HTTP 200, SHA-256 in facts.md). Every case description was confirmed and no text changed. The reviewer-environment explanation is in rebuttal.md.
4. MINOR ko: "…요구를 과실의 근거로 들었습니다." The preceding question became "법원은 어디에서 과실을 찾았을까요?" so the wording doesn't repeat.
5. MINOR en: "negligent assistance with an adequate causal link to the victim's loss."
6. MINOR zh: 洗錢防制法第22條 linked in the body, plus a reference-list entry 「全國法規資料庫・洗錢防制法：第22條」.
facts.md: corrected an arithmetic slip in the notes only (the six Taipei withdrawals add up to 15萬元, not 13萬5,000). No draft ever stated a total.
Checks after the fix: variety FAIL 0 (ko/ja/en; zh --lang zh-hant). ko WARN on '니다.' endings is unchanged. Links BAD 0. YAML OK x4 with 3 FAQ each. Lengths: en 1,097 words, ko 2,452 chars without spaces, ja 1,984, zh 1,668.
