# A2 selfcheck (2026-10-20)

## Variety check (after Astra r1 fixes)
```
drafts/A2/ko.md [ko] sentences=44 mean=37.9 cv=0.462 short=0.114 run3=0.048 opener_rep=0.083 cite_end=0.159 cite_para=0.583 contrast=0 caveat=0 q=1
  OK — no variety limit violated
drafts/A2/ja.md [ja] sentences=44 mean=41.2 cv=0.457 short=0.114 run3=0.095 opener_rep=0.077 cite_end=0.182 cite_para=0.615 contrast=0 caveat=0 q=0
  OK — no variety limit violated
drafts/A2/en.md [en] sentences=45 mean=18.9 cv=0.519 short=0.2 run3=0.023 opener_rep=0.154 cite_end=0.067 cite_para=0.538 contrast=0 caveat=0 q=1
  OK — no variety limit violated
drafts/A2/zh.md [zh-hant] sentences=38 mean=38.0 cv=0.505 short=0.158 run3=0.0 opener_rep=0.0 cite_end=0.132 cite_para=0.538 contrast=0 caveat=0 q=2
  OK — no variety limit violated
```
FAIL 0 in all four.

## Length
```
drafts/A2/en.md words 827
drafts/A2/facts.md chars_nospace 2470 chars_with_space 2703
drafts/A2/ja.md chars_nospace 1968 chars_with_space 2005
drafts/A2/ko.md chars_nospace 1853 chars_with_space 2402
drafts/A2/selfcheck.md chars_nospace 658 chars_with_space 753
drafts/A2/zh.md chars_nospace 1466 chars_with_space 1503
```

## Duplicate check
Queued angle (custody, visitation, taking a child out of Taiwan after separation) is broadly covered: ko 021/245/007, ja 021/242/307/007, en 021/095/007, zh 021/107/240/243/244/007; the outbound exit ban is covered in zh 241 (2024 Taoyuan/Taipei rulings, Passport Act Art. 16, Judicial Yuan FAQ) and mentioned in en 095 / ko 245 as one provisional-order type.
Narrower fresh angle chosen: exit-ban provisional orders against a parent who already holds sole custody, and how such a ban is lifted (家事事件法第88條), built on two 2026 rulings not used in any existing column (PCDU 115家暫205, TPDU 115家聲抗42). ko/ja/en also explain the separation-stage rules (民法1089/1089-1) and the passport rule; zh focuses on lifting and links to zh 241 for the granting side. Recorded in STATUS.md.
Slug `taiwan-child-exit-ban-sole-custody-provisional-order`: 0 matches.

## Voice self-check
- Openings: ko = reader question; ja = concrete fact (passport); en = scene labelled "(an invented example)" placed after the scene; zh = quoted court sentence. Different from A1 types per language.
- Contrast templates 0; caveat openers 0; short sentences present; no bold/emoji/checklist headings; ko 합니다체, ja です・ます.
- No gendered pronouns for parties (en "they/theirs", ko/ja/zh role nouns).
- Contact: email + Taichung address once; 曾雋崴; no lawyer-review claim.

## Open risks
- Finality of both rulings not checked (stated). TPDU states re-appeal only on 適用法規顯有錯誤.
- New Taipei facts on loss of contact are the applicant's assertions; drafts attribute them; the court's own findings (no visits, three solo returns) are stated as findings.
- Which paragraph of 入出國及移民法第6條 the immigration agency applies to family-court exit bans was not verified; drafts rely only on the Judicial Yuan FAQ for the notification point.
- The FAQ page is dated 2019-10-22; no newer contrary guidance found, but not exhaustively searched.

## Astra r1 (2026-10-20)
All 8 findings accepted and fixed (see facts.md fix log). No rebuttal. Variety FAIL 0 after fixes; links BAD 0.

## Astra r2 fix (2026-10-20 ~20:20 KST)
Source: ASTRA-FAIL.md (r2), renamed ASTRA-FAIL-fixed-2.md. Details and sources are in facts.md under "Astra r2 fix log".
1. MAJOR ja/en, Art. 88: the "has become improper" wording is gone. It now reads "is considered improper or no longer necessary" / 「不当と認められる／もはや必要がないと認められる」 in FAQ 3 and the body. The provisional order must still be final first. ko body aligned.
2. MAJOR ko/ja/zh, Art. 89(3): the text now separates two cases. If the main petition is dismissed by a final ruling or withdrawn, the whole order lapses. If a final ruling grants the main petition, or a mediation or settlement is concluded, only the inconsistent portion lapses. en FAQ aligned.
3. MAJOR ko/ja/en, governing law: new paragraph on 涉外民事法律適用法 Art. 55 (child's national law) and Art. 2 (multiple nationalities). The Civil Code explanation is stated to assume Taiwan law, separately from the provisional-order procedure. Joint exercise is described as the general rule. zh got the same qualifier. Source lists updated in all four.
4. MAJOR all, ruling verification blocker: both rulings were re-opened live via printData (identical to cache, hashes in facts.md). The zh quote was found verbatim and every description was confirmed. One zh detail was corrected: the children were questioned by the 原審 judge. Reviewer-environment explanation is in rebuttal.md.
5. MINOR ko FAQ 1: 「본안 청구의 목적을 확보할 수 없는」.
6. MINOR en: "In practice that can be hard to show." deleted. Related generalisations in ko and the ja heading were neutralised too.
Checks: variety FAIL 0 (ko/ja/en; zh --lang zh-hant), links BAD 0, YAML OK x4 (3 FAQ each), no bold. Lengths: en 957 words, ko 2,139 chars without spaces, ja 2,272, zh 1,707.
