# S2 selfcheck

## variety_metrics.py check (2026-10-20)
```
ko.md [ko] sentences=43 mean=35.2 cv=0.476 short=0.163 run3=0.049 opener_rep=0.0 cite_end=0.116 cite_para=0.615 contrast=0 caveat=1 q=2
  WARN 81% of sentences end in '니다.' — vary endings within the register
ja.md [ja] sentences=43 mean=39.2 cv=0.514 short=0.163 run3=0.049 opener_rep=0.077 cite_end=0.116 cite_para=0.615 contrast=0 caveat=1 q=0
  WARN 81% of sentences end in 'desu-masu' — vary endings within the register
en.md [en] sentences=45 mean=16.9 cv=0.517 short=0.178 run3=0.0 opener_rep=0.154 cite_end=0.067 cite_para=0.615 contrast=1 caveat=0 q=0
  OK — no variety limit violated
zh.md [zh-hant] sentences=40 mean=31.8 cv=0.655 short=0.25 run3=0.026 opener_rep=0.077 cite_end=0.075 cite_para=0.615 contrast=0 caveat=1 q=1
  OK — no variety limit violated
```

## length (visible body before sources, links unwrapped)
```
ko.md chars(no space)= 1639 chars(with space)= 2091 en-words= 102
ja.md chars(no space)= 1795 chars(with space)= 1826 en-words= 42
zh.md chars(no space)= 1408 chars(with space)= 1440 en-words= 40
en.md words(whitespace)= 751
```

FAIL 0 in all four files. The only WARNs are about the polite-register endings that the house style requires.

## Self-check (SENTENCE-VARIETY-RULE section 5)
2. Opening types differ from S1 and from each other. ko opens with a number/result (a divorce found void 14 years after registration). ja opens with a misconception (the law has no "paper divorce" category). en opens with a scene labelled "(an invented example)", not a "Suppose" opener. zh opens with the reader's question. Hypothetical labels sit after the scene (가상의 사례입니다 / 架空の例です / an invented example). zh has no invented couple.
3. Very short sentences: ko 16%, ja 16%, en 18%, zh 25%. No two long sentences run back to back.
4. Paragraph openers: no word opens 3 or more paragraphs. In en I fixed a triple "The". In zh I fixed a triple "臺灣…" (court names), and court names now appear mid-sentence.
5. No three "claim (statute) → caveat" paragraphs in a row. There is one paragraph-initial 다만/ただし/However-type sentence in ko/ja/zh (the High Court's judicial divorce, caveat=1). Paragraphs without citations: the opening, the scene, and the closing.
6. Contrast templates: ko 0, ja 0, en 1, zh 0. No sentence rebuts a claim the reader never made.
7. The last body paragraph ends on this column's facts: the challenge runs through a confirmation suit and turns on what the two witnesses saw and heard. The contact line is one short sentence. No promotional line.
8. ko uses 합니다체 and ja uses です・ます throughout. In ja I removed "…とします" from the scene. No bold (grep = 0), no invented first person, no imperative headings.
9. Every number (2010 → 2024 = 14 years, the dates of 4 judgments, Art. 988-1's 2-year/5-year limits) matches facts.md and is the same in all 4 languages.

## First-two-paragraph deletion test
- ko P1 (a registered divorce found void 14 years later): deleting it loses the hook that the 新北 paragraph picks up again ("첫머리의 사건"). Kept. P2 (motives found in judgments + labelled scene): this is where the reader's question is posed. Kept.
- ja P1 states the legal premise (no "paper divorce" category; a registered divorce counts). Kept. en P1/P2: P2 ("In the cases below, the motive was not what decided them.") states the thesis in one line. Kept. zh P1 is the question and P2 gives the motives plus the thesis. Kept.

## Duplicate check
- The queued angle is fully covered: 019 (all 4 locales: governing law, witnesses, registration, proxy filing, home-country reporting), zh 114 (witness rule with 最高法院112台上511, unregistered agreement, change of mind, waiver), ko 094 / ja 115 / en 108 (foreign divorce → Taiwan register), 007 Q&A (court mediation, appearance, video).
- grep 假離婚/通謀虛偽/虛偽離婚/위장이혼/가장이혼/偽装離婚/sham divorce/paper divorce across all locales: no column on a registered divorce later attacked as fake. Hits were unrelated ("on paper" in en tax/labour pieces; zh 257 naturalization).
- Overlap with zh 114: the witness standard is restated only as far as this piece needs, and zh links to 114 for detail. New material: four 2024–2025 judgments on paper-divorce claims (three void on witnesses, one valid on burden of proof), Art. 87 not reached, standing under 民訴247, the Art. 988(3) proviso / 988-1 consequences for remarriage.

## Slug
taiwan-paper-divorce-witnesses-void (0 filename matches for "paper-divorce").

## Front matter notes
- topic "family" (an existing corpus value). featured_image "TBD". The alt text describes a generic object scene. No caption. author legal-ai-assistant.

## Open risks for the Astra gate
1. The High Court case (114家上28) concerns public figures. The drafts omit profession and business details and keep only the place/year of marriage, the witnesses' relation, the conviction and the outcomes. If Astra considers even this identifying, drop the mainland-China detail.
2. Of the four judgments, three are first instance and one is second instance. Finality was not checked, and the drafts make no claim of finality.
3. Statements like "courts mostly checked the formalities" are limited to the four judgments read (summary/FAQ say "in these cases" or similar). Astra may want even softer wording in the summary.
4. FAQ 3 / body on remarriage covers only the Taiwan Civil Code rule. The drafts flag that the law governing a remarriage abroad is a separate question, and this is not analysed.
