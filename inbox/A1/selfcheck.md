# A1 selfcheck (2026-10-20)

## Variety check (variety_metrics.py check; zh with --lang zh-hant)
```
drafts/A1/ko.md [ko] sentences=49 mean=38.9 cv=0.464 short=0.122 run3=0.043 opener_rep=0.0 cite_end=0.122 cite_para=0.5 contrast=0 caveat=0 q=1
  WARN 84% of sentences end in '니다.' — vary endings within the register
drafts/A1/ja.md [ja] sentences=41 mean=38.4 cv=0.467 short=0.146 run3=0.077 opener_rep=0.143 cite_end=0.122 cite_para=0.357 contrast=1 caveat=0 q=0
  OK — no variety limit violated
drafts/A1/en.md [en] sentences=56 mean=17.4 cv=0.584 short=0.232 run3=0.093 opener_rep=0.118 cite_end=0.054 cite_para=0.471 contrast=1 caveat=0 q=3
  OK — no variety limit violated
drafts/A1/zh.md [zh-hant] sentences=37 mean=35.8 cv=0.568 short=0.135 run3=0.086 opener_rep=0.067 cite_end=0.135 cite_para=0.467 contrast=0 caveat=0 q=2
  OK — no variety limit violated
```
FAIL 0 in all four. ko WARN (84% '니다.' endings) is inherent to 합니다체; not a hard limit.

## Length (body excl. front matter, H1, sources; research/bin/blen.py)
```
drafts/A1/en.md words 984
drafts/A1/facts.md chars_nospace 6551 chars_with_space 7237
drafts/A1/ja.md chars_nospace 1742 chars_with_space 1781
drafts/A1/ko.md chars_nospace 2114 chars_with_space 2721
drafts/A1/selfcheck.md chars_nospace 842 chars_with_space 970
drafts/A1/zh.md chars_nospace 1464 chars_with_space 1505
```
ko counted without spaces (house measure in SENTENCE-VARIETY-RULE); with spaces it is ~2,720.

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
- Art. 6 of the regulation also has exceptions (utilities, taxes, fines) and a counter-transaction rule, omitted for length.
- ko body is 2,114 chars without spaces / ~2,720 with spaces; if the gate counts spaces, it is above 2,500.
