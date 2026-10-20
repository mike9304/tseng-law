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

## Astra r1 response (2026-10-20)
1. MAJOR, registration vs validity: in ko/ja/en/zh the summary, FAQ 1 and the opening now say that registration records the divorce on the household register but does not cure missing formalities, and that where Taiwan law governs, validity can still be challenged (Arts. 1049–1050, 73).
2. MAJOR, governing law: added a premise paragraph at the start of the "how a divorce is made" section in all four languages. The column covers divorces governed by Taiwan law and made in Taiwan form, with choice-of-law Arts. 50 and 16 cited and added to sources. The "foreign spouse too" sentence is now qualified with "where Taiwan law governs".
3. MAJOR, Art. 988-1(2): the body and FAQ 3 in all four languages now state that a remaining-property distribution or agreement already made controls and cannot be reopened. This comes before the 2-year/5-year limits.
4. MAJOR, judgment verification: all four judgments were re-verified (HTTP 200). Copies are in drafts/S2/evidence/. The conviction passage and the "need not decide Art. 87" passages are quoted in facts.md. The Art. 87 sentence was narrowed: two judgments expressly did not need to reach it, and the other two did not mention it.
5. MINOR ko/ja/zh, "nobody confirmed": narrowed to "that witness did not personally confirm the foreign spouse's intent". en was changed the same way.
6. MINOR ja, the Taitung sentence: now reads 「（2025年1月9日）でも、離婚は無効とされました。」
7. MINOR en: now reads "Both spouses' convictions for uttering forged private documents had become final."
8. MINOR ko sources: added 민사소송법 제247조·제277조, plus 섭외민사법률적용법 제16조·제50조.
Also: titles no longer generalize. ko "무효 판결을 가른 것은 증인이었다", ja 「無効の判断を分けたのは証人だった」, en "The Witnesses Decided Which Ones Were Void", zh 「判決無效的關鍵在證人」. The en H1 now matches its title exactly (quote style).
featured_image "TBD": same as S1. It is kept per TASK.md, and the user decision is pending via bridge (ASK-20261020-192554-claude.md).
Variety after fixes: FAIL 0 in all four files (ko cv 0.466, ja 0.485, en 0.551, zh 0.612). Lengths: ko 1,971 chars, ja 2,163, zh 1,657, en 915 words.


## Astra r2 response (2026-10-20 21:20 KST)
1. MAJOR, lawyer name: removed in all four contact lines.
2. MAJOR, en summary: "If the divorce is void for failure to satisfy the witness requirement, the marriage never ended". The summary also says "lacked two qualified witnesses" and that the Taoyuan dismissal was upheld on appeal.
3. MAJOR, zh summary: 「三件因未具備兩名適格證人而認定離婚無效」. The same correction is made in ko/ja/en (New Taipei: only one witness failed).
4. MAJOR, zh Taitung: the car-side questioning is now the witnesses' testimony (證人到庭證稱…). It is followed by the court's doubt (the order of signing contradicted the wife's own account → 「是否真實，殊值懷疑」) and the finding that neither witness knew the husband or checked his identity. ko/ja/en now match.
5. MAJOR, zh frequency claim: 「判決書裡常見…法官先翻開的往往是…」 replaced with 「本文引用的四件判決都涉及假離婚的主張，其中三件因證人要件欠缺而認定離婚無效。」 Same bounded wording in ko/ja/en, whose openings had similar generalisations.
6. MINOR, ja: 「登記をしても、法定の方式の不備が補われるわけではない」.
Proactive (appeal histories checked for every cited judgment, as in the S1 r2 finding): 新北 113婚455 appeal withdrawn 2025-05-27; 桃園 112婚449 affirmed by 高院 114家上95 (2025-10-22); 臺東 113婚27 affirmed by 花蓮分院 114家上6 (2025-12-24), then a third-instance appeal was rejected as improper by 最高法院 115台上756 (2026-05-07); 高院 114家上28 third-instance appeal rejected as improper on 2025-06-25. Each is in the body and the sources, and FAQ 1 carries the Taoyuan appeal. Closing: the repeated "three void on witnesses" clause was removed, because the opening now states it.

Variety after fixes (FAIL 0 in all four):
    drafts/S2/ko.md [ko] sentences=61 mean=35.6 cv=0.45 short=0.131 run3=0.034 opener_rep=0.0 cite_end=0.115 cite_para=0.643 contrast=1 caveat=2 q=2
    drafts/S2/ja.md [ja] sentences=59 mean=40.5 cv=0.45 short=0.136 run3=0.035 opener_rep=0.071 cite_end=0.119 cite_para=0.643 contrast=0 caveat=2 q=0
    drafts/S2/en.md [en] sentences=55 mean=19.3 cv=0.517 short=0.109 run3=0.019 opener_rep=0.143 cite_end=0.091 cite_para=0.643 contrast=1 caveat=0 q=0
    drafts/S2/zh.md [ko] sentences=49 mean=34.4 cv=0.554 short=0.184 run3=0.021 opener_rep=0.0 cite_end=0.102 cite_para=0.643 contrast=0 caveat=0 q=1
Lengths:
    drafts/S2/ko.md chars(no space)= 2364 chars(with space)= 3019 en-words= 153
    drafts/S2/ja.md chars(no space)= 2569 chars(with space)= 2602 en-words= 66
    drafts/S2/en.md chars(no space)= 5233 chars(with space)= 6296 en-words= 1077
    drafts/S2/zh.md chars(no space)= 1894 chars(with space)= 1928 en-words= 64
YAML front matter parses (Ruby YAML.safe_load), 3 FAQ, author token, featured_image "TBD" (user decision, option A). Every URL in the four files returns HTTP 200 (curl, browser User-Agent, 2026-10-20). No bold, no lawyer name, no byline.
