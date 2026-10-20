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
