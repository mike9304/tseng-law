# S1 selfcheck

## variety_metrics.py check (2026-10-20)
```
/Users/son7/tseng-gapfill-1020/drafts/S1/ko.md [ko] sentences=48 mean=37.0 cv=0.497 short=0.146 run3=0.022 opener_rep=0.0 cite_end=0.083 cite_para=0.615 contrast=0 caveat=0 q=2
  WARN 85% of sentences end in '니다.' — vary endings within the register
/Users/son7/tseng-gapfill-1020/drafts/S1/ja.md [ja] sentences=48 mean=39.8 cv=0.455 short=0.125 run3=0.022 opener_rep=0.0 cite_end=0.125 cite_para=0.615 contrast=0 caveat=0 q=1
  WARN 77% of sentences end in 'desu-masu' — vary endings within the register
/Users/son7/tseng-gapfill-1020/drafts/S1/en.md [en] sentences=51 mean=18.5 cv=0.467 short=0.137 run3=0.02 opener_rep=0.077 cite_end=0.039 cite_para=0.615 contrast=0 caveat=0 q=1
  OK — no variety limit violated
/Users/son7/tseng-gapfill-1020/drafts/S1/zh.md [zh-hant] sentences=47 mean=33.4 cv=0.535 short=0.128 run3=0.022 opener_rep=0.0 cite_end=0.106 cite_para=0.615 contrast=0 caveat=0 q=1
  OK — no variety limit violated
```

## length (visible body text before sources, links unwrapped)
```
ko.md chars(no space)= 1929 chars(with space)= 2489 en-words= 110
ja.md chars(no space)= 2024 chars(with space)= 2057 en-words= 42
en.md chars(no space)= 4630 chars(with space)= 5586 en-words= 947
zh.md chars(no space)= 1672 chars(with space)= 1706 en-words= 43
```

FAIL 0 in all four files. The remaining WARNs are about the share of polite-register endings (합니다체 / です・ます), which the house style requires.

## Self-check (SENTENCE-VARIETY-RULE section 5)
2. Opening: no stock hypothetical formula. Opening types: ko = short fact plus the reason (type 1), ja = reader's question (type 2), en = a misconception corrected by a fact (type 5), zh = a quoted sentence from the judgment (type 6). The hypothetical labels sit after the scene: (가상의 사례입니다) / （架空の例です） / (an invented example) / （虛構情境）.
3. Very short sentences: ko 14.6%, ja 12.5%, en 13.7%, zh 12.8% (each ≥ 8%). No two long sentences run back to back.
4. Paragraph openers read top to bottom: no word opens 3 or more paragraphs. In en I changed "The ..." openers, which earlier appeared 4 times.
5. "Claim (statute) → caveat" paragraphs never run three in a row, and the first sentence of any paragraph starts with 다만/ただし/However/但 zero times. Paragraphs without citations: the scene, the reader's question about the bank, and the closing.
6. Contrast templates: 0 in all four. No sentence rebuts a claim the reader never made.
7. The last body paragraph ends on this column's facts: deleting the chat removes the material for the reporting agency and the civil evidence. The contact line is one short sentence (email plus the Taichung address with 19號6樓之1). No promotional line.
8. ko uses 합니다체 throughout; ja uses です・ます throughout (titles excepted). No bold (grep of ** <strong> <b> = 0), no invented first person, no imperative checklist headings. In en I replaced the imperative "Ask the bank" with a declarative.
9. Article numbers, paragraphs, dates (2025-04-01 cutoff, 2 years plus one extension of 1 year), amounts (NT$13,000; NT$700,176; 5%), and court/case numbers all match facts.md and are consistent across the 4 languages.

## First-two-paragraph deletion test (EDITORIAL-VOICE step 2)
- ko P1 (stalled account + 三方詐騙 = payer is not the buyer): deleting it loses the term and the core mechanism, so I kept it. P2 (labelled scene): deleting it loses the who-paid-whom structure that the later sections depend on, so I kept it.
- ja/en/zh: same result. In zh, P1 is the judgment quote that the judgment section later refers back to ("開頭那句話").

## Duplicate check
- grep across all 4 locales for 警示帳戶/警示口座/경시계좌/watch-list/warning account/衍生管制 found ko/en/zh 064 (general warning-account freeze/lift/return), ja 272 (same, Japanese), ko 535 (bank self-restriction plus FOI complaint), zh 534 (告誡 limits for online sellers), en 237 (victim abroad), and zh 042/161/223/235/246/247 (victim / account lending / confiscation).
- grep for 三方詐/三角詐/假交易/二手/中古/Marketplace/중고/フリマ/不當得利/unjust enrichment found ko 167 (fake "verification fee" scam on a seller, which is not the triangular one), 609 (mistaken transfer, unjust enrichment), and zh 155/217 (ticket screenshot, fake rental listing). No column covers the seller who receives a victim's money in a triangular scam, or the victim's unjust-enrichment suit against that seller.
- Conclusion: the queued general angle is already covered, so this column takes the narrower seller-side angle (recorded in STATUS.md). Each locale links once to its existing general warning-account column for the wider rules (ko/en/zh `/…/columns/taiwan-warning-account-foreigners`, ja `/ja/columns/taiwan-warning-account-frozen-japanese`); the targets exist in ref/src/content and their content was checked (pre-2025-03-31 return procedure is covered there). New material here: the seller-side scenario, the Art. 69 transaction-dispute exclusion, and the two judgments.

## Slug
taiwan-triangular-scam-seller-account-frozen (0 matches for "triangular|seller-account" among existing filenames in all 4 locales).

## Front matter notes
- topic "litigation" with tags ["fraud", ...]: the corpus has no topic value "fraud", and existing fraud columns (064, 167, 237, 534, 535) use "litigation".
- featured_image "TBD". featured_image_alt describes a generic object scene. No caption, so there is no AI label anywhere.
- Lawyer 曾雋崴; email wei@hoveringlaw.com.tw; address includes 19號6樓之1. No claim that a lawyer reviewed the piece.

## Open risks for the Astra gate
1. Both judgments are first instance (one is small claims), and their appellate status was not found. The drafts say "first instance" and do not present either one as settled law.
2. In the 竹東 case the "online purchasing agent" status is the defendant's own statement, and the drafts phrase it as "said/stated" (진술한 / 述べた / 自稱 / said they ran).
3. "三方詐騙" as a popular name: the sources are the parties' wording in the judgments (第三方詐騙, 坊間俗稱之「三角詐騙」), and there is no official police page, which was not reachable or found. If Astra wants an official source for the term, soften it to a descriptive phrase.
4. The art. 3 衍生管制帳戶 definition does not limit itself to the same bank. The drafts say "other deposit accounts opened by the same holder" and make no claim about other banks. Existing ja 272 says "同じ銀行の他の口座". Not touched (out of scope), but flagged.
5. The official English translation of G0380199 dates from 2014. The en text translates the current Chinese text (for example Art. 10(2) 應即解除 → "must lift"), and a note sits in the sources section.

## Astra r1 response (2026-10-20)
1. MAJOR, emergency-notification exception: added to the body (lifting section) and to FAQ 1 in ko/ja/en/zh, citing Art. 3 item 3 (no written notice within 5 business days means the bank contacts the agency and then lifts the listing). In the ko/ja/zh summaries I added the extension limit (2 years from notification, extendable once by up to 1 year) and the 5-day exception.
2. MAJOR, judgments and causal comparison: I re-verified both judgments (HTTP 200, 2026-10-20 19:27 KST). Copies with metadata are in drafts/S1/evidence/ with party names masked. I removed the "what separated them was… records" conclusion, along with the "deleted chat loses evidence" sentence, from all bodies and summaries. Each court's reasoning is now described separately. The closing states only what the New Taipei judgment itself listed as unproved: the wallet owner, the coin acquisition records, and messages with the buyer.
3. MAJOR, `featured_image: "TBD"`: NOT changed. TASK.md (the lane contract) says "Leave featured_image as 'TBD'" and "do not create images; the integrator assigns the image". I asked the user via the son-bridge mailbox (ask/ASK-20261020-192554-claude.md) whether to keep TBD (gate accepts it pending integration) or switch to an image-free front matter. I will apply the answer to all of S1–S8.
4. MINOR, ko title: changed to "판매자 계좌의 거래 정지와 반환 소송" (title + H1). The defined term 경시계좌(警示帳戶) stays in the body.
5. MINOR, ja: replaced "元の通報機関と処理し" (FAQ) and "元の通報機関と話を進め" (body) with "元の通報機関に申し出て対応を求め".
6. MINOR, en: replaced "the account side" with "the company that received the money". I made the matching change in ko/ja/zh (계좌 쪽 / 口座側 / 帳戶一方 → the company that received the money / the account-holding company).
7. MINOR, zh: replaced "在櫃檯解釋再久也沒用。" with "單憑在櫃檯說明交易經過，不能解除警示。"
Variety after fixes: FAIL 0 in all four files (ko cv 0.503, ja 0.464, en 0.499, zh 0.526). Lengths: ko 2,074 chars, ja 2,198, zh 1,786, en 1,002 words, all within range.


## Astra r2 response (2026-10-20 21:20 KST)
1. MAJOR, appellate history: verified on judicial.gov.tw (FJUD data.aspx + official 歷審裁判 endpoint). 新北 111訴1496 was reversed by 臺灣高等法院 112年度上易字第292號 (2023-05-31): judgment set aside, claim dismissed, 「不得上訴」. All four locales now describe the first instance and the appeal separately (body, summary, FAQ 3, closing, sources). The appellate reasoning is given as the court's own: sale of 23,000 USDT accepted on the transaction records + the non-prosecution decision; first-instance screenshots missed the last character of the sender wallet address; directed payment → claim lies against the instructor; same-group question irrelevant. The closing states only the two final outcomes (竹東 and the High Court both dismissed and pointed to the instructor) plus the fact that the High Court first checked the sale records; no cross-case causal claim. 竹東: history count 0, now labelled "first-instance small-claims judgment" without a finality claim.
2–5. MAJOR, lawyer name in contact line: removed in ko/ja/en/zh (and, proactively, in S2–S8). Contact line keeps the firm, email and Taichung address only.
6. MAJOR, authentication: all three judgments retrieved from judgment.judicial.gov.tw (HTTP 200); evidence copies carry Source URL, time, status and SHA-256 of the official HTML; evidence/judgment-history.txt holds the official appeal history; evidence/README.md explains the method. I cannot reproduce the gate's network block from here.
7. MINOR, en antecedent: "The ordinary watch-list period is two years from notification." Same fix in ko (경시 기간은…), ja (警示期限は…), zh (警示期限自通報時起算兩年).
8. MINOR, en opener: the "Here is how it can look" sentence is gone; the road-bike sentence now carries "(an invented example)".

Variety after fixes (FAIL 0 in all four):
    drafts/S1/ko.md [ko] sentences=55 mean=37.7 cv=0.478 short=0.109 run3=0.0 opener_rep=0.0 cite_end=0.091 cite_para=0.643 contrast=0 caveat=0 q=2
    drafts/S1/ja.md [ja] sentences=57 mean=40.3 cv=0.452 short=0.105 run3=0.036 opener_rep=0.0 cite_end=0.123 cite_para=0.643 contrast=0 caveat=0 q=1
    drafts/S1/en.md [en] sentences=56 mean=19.4 cv=0.46 short=0.125 run3=0.019 opener_rep=0.071 cite_end=0.054 cite_para=0.643 contrast=0 caveat=0 q=1
    drafts/S1/zh.md [ko] sentences=51 mean=35.9 cv=0.497 short=0.137 run3=0.02 opener_rep=0.0 cite_end=0.118 cite_para=0.643 contrast=0 caveat=0 q=1
Lengths:
    drafts/S1/ko.md chars(no space)= 2245 chars(with space)= 2894 en-words= 133
    drafts/S1/ja.md chars(no space)= 2429 chars(with space)= 2464 en-words= 52
    drafts/S1/en.md chars(no space)= 5387 chars(with space)= 6488 en-words= 1095
    drafts/S1/zh.md chars(no space)= 1952 chars(with space)= 1988 en-words= 51
YAML front matter parses (Ruby YAML.safe_load), 3 FAQ, author token, featured_image "TBD" (user decision, option A). Every URL in the four files returns HTTP 200 (curl, browser User-Agent, 2026-10-20). No bold, no lawyer name, no byline.
