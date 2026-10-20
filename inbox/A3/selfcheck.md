# A3 selfcheck (2026-10-20)

## Variety check
```
drafts/A3/ko.md [ko] sentences=36 mean=41.8 cv=0.61 short=0.111 run3=0.0 opener_rep=0.0 cite_end=0.139 cite_para=0.636 contrast=1 caveat=1 q=0
  OK — no variety limit violated
drafts/A3/ja.md [ja] sentences=35 mean=45.3 cv=0.522 short=0.114 run3=0.0 opener_rep=0.0 cite_end=0.143 cite_para=0.636 contrast=0 caveat=1 q=0
  OK — no variety limit violated
drafts/A3/en.md [en] sentences=44 mean=17.8 cv=0.529 short=0.205 run3=0.024 opener_rep=0.077 cite_end=0.068 cite_para=0.615 contrast=0 caveat=0 q=1
  OK — no variety limit violated
drafts/A3/zh.md [zh-hant] sentences=32 mean=40.6 cv=0.616 short=0.188 run3=0.0 opener_rep=0.0 cite_end=0.125 cite_para=0.615 contrast=1 caveat=0 q=0
  OK — no variety limit violated
```
FAIL 0 in all four.

## Length
```
drafts/A3/en.md words 804
drafts/A3/facts.md chars_nospace 4652 chars_with_space 5198
drafts/A3/ja.md chars_nospace 1815 chars_with_space 1848
drafts/A3/ko.md chars_nospace 1725 chars_with_space 2195
drafts/A3/selfcheck.md chars_nospace 652 chars_with_space 747
drafts/A3/zh.md chars_nospace 1436 chars_with_space 1476
```

## Duplicate check
Queued angle (renouncing within three months from abroad; debts; limited liability under Art. 1148) is already covered in all four locales: 233 `taiwan-parent-debt-renunciation-heir-in-japan` (ko/ja/en/zh: governing law, cap on liability, start of the 3 months, authentication does not extend it, who inherits next) and zh 060 (inventory, proportional payment, Art. 1163 listed, insurance, pre-2009). ko/ja/en/zh 016 also has a debt/renunciation section.
Narrower fresh angle chosen: handling the deceased's bank deposits before deciding to renounce — criminal exposure (forgery with the seal, ATM offence with the card), how renunciation's retroactive effect and Art. 1163 interact with taking estate money. No existing column in any locale cites 112台上1703, Art. 339-2 in this context, or post-death withdrawals (grep: 1703 / 偽造私文書 / 339-2 / 사망…인출 / 故人…引き出 / 過世…提領 → only zh 236 on a different topic). Recorded in STATUS.md.
Slug `taiwan-deceased-parent-bank-withdrawal-forgery-renunciation`: 0 matches.

## Voice self-check
- Openings: ko = common belief refuted by a result; ja = court's proposition (paraphrased, attributed as 趣旨); en = reader question; zh = appellant's argument (attributed) and result. Different from A1/A2 types per language.
- Short sentences present; contrast ≤1; caveat ≤1; no bold/emoji/checklist headings; ko 합니다체, ja です・ます (opening converted from だ調).
- Pronouns: parties referred to by role; "him" only for the son in the Supreme Court case (judgment states 兒子/其父親).
- Contact once; 曾雋崴; no review claim.

## Open risks
- Taoyuan court's 民法550 narrow exception sits in some tension with the Supreme Court's statement that funeral use does not affect the forgery offence; drafts present both as what each court said, without reconciling.
- "No deemed-acceptance provision" (ko/ja) rests on a keyword scan of the succession book, not on a judgment; drafts limit the claim to the code text.
- Bank documents list is the Taoyuan court's description, not a bank rule; attributed as such.
- Finality of lower-court rulings not checked (stated).
