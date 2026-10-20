# A4 selfcheck (2026-10-20)

## Variety check
```
drafts/A4/ko.md [ko] sentences=38 mean=36.1 cv=0.542 short=0.105 run3=0.0 opener_rep=0.0 cite_end=0.184 cite_para=0.75 contrast=0 caveat=0 q=0
  OK — no variety limit violated
drafts/A4/ja.md [ja] sentences=38 mean=38.7 cv=0.537 short=0.132 run3=0.0 opener_rep=0.0 cite_end=0.132 cite_para=0.667 contrast=0 caveat=0 q=0
  WARN opens with the stock hypothetical ("가령/例えば…とします/Suppose…/假設") — allowed at most 1 in 4 columns; prefer a concrete fact, number, question or scene
  WARN 76% of sentences end in 'desu-masu' — vary endings within the register
drafts/A4/en.md [en] sentences=40 mean=17.8 cv=0.607 short=0.25 run3=0.0 opener_rep=0.154 cite_end=0.0 cite_para=0.385 contrast=0 caveat=0 q=1
  OK — no variety limit violated
drafts/A4/zh.md [zh-hant] sentences=35 mean=35 cv=0.587 short=0.114 run3=0.03 opener_rep=0.0 cite_end=0.171 cite_para=0.769 contrast=0 caveat=0 q=2
  OK — no variety limit violated
```
FAIL 0 in all four (ja WARN: labelled hypothetical opener — the only one in this batch for ja).

## Length
```
drafts/A4/en.md words 725
drafts/A4/facts.md chars_nospace 2713 chars_with_space 3079
drafts/A4/ja.md chars_nospace 1633 chars_with_space 1668
drafts/A4/ko.md chars_nospace 1550 chars_with_space 2011
drafts/A4/selfcheck.md chars_nospace 873 chars_with_space 1014
drafts/A4/zh.md chars_nospace 1379 chars_with_space 1413
```

## Duplicate check
- en 034 `foreign-professional-dismissed-taiwan` already covers the queued angle in English (permit revoked, ARC, 6-month extension, new employer permit, Gold Card) → en takes a narrower fresh angle: the family's dependent ARCs and the spouse's work permit when the principal's job ends (034 mentions the spouse only in passing; en 027 covers Gold Card families only).
- ko 168 (Gold Card + job change for Korean engineers), ko/ja/zh 027 (Gold Card), zh 210 (hiring foreign engineers) do not cover employer-tied permit holders leaving a job → ko/ja/zh take the queued angle, written for each reader (ko: employee view; ja: 現地採用 scene; zh: HR/employer view).
- Slug `taiwan-foreign-professional-job-ends-work-permit-arc-extension`: 0 matches.

## Voice self-check
- Openings: ko = number ("3일."), ja = labelled scene, en = framing fact about dependent ARCs, zh = HR question. Differ from A1–A3 per language.
- Lessons from A1 Astra r1 applied: no prevalence claims (removed "퇴사는 … 경우가 많고"), exceptions of 31 IV stated, conditions kept.
- No bold/emoji/checklist headings; ko 합니다체; ja です・ます.

## Open risks
- NIA guide predates the 2026 renumbering; drafts say so. Whether NIA still uses the same document list after 2026-01-01 not confirmed.
- How NIA handles mid-term job loss vs. the Art. 17 extension (timing) is not settled by any source found; drafts tell readers to confirm in writing.

## Astra r1 fix (2026-10-20 ~20:35 KST)
Source: ASTRA-FAIL.md (r1), renamed ASTRA-FAIL-fixed-1.md. All six findings were accepted and verified against live LawSingle and the live NIA guide (details in facts.md).
- MAJOR ko/ja: the 「除另有規定外」 exception was restored in FAQ 2 and the body.
- MAJOR zh: termination is now described as the revocation ground, and the disposition's effective date follows 行政程序法110. ko/ja/en wording aligned.
- MAJOR ja: 就業服務法第56条第2項 and 外國專業人才延攬及僱用法第9条 are now named explicitly.
- MAJOR en: the disability condition (unable to live independently) is restored. ko/ja/zh family lists completed.
- MINOR en: "employment separation certificate".
- MINOR ko/ja/zh: 移民法第21條第1項 now has an inline link and a source-list entry.
Checks: variety FAIL 0 (ko/ja/en; zh --lang zh-hant). The ja WARN (stock hypothetical opener, endings) is unchanged and not a FAIL. Links BAD 0, YAML OK x4. Lengths: en 744 words (en is a narrower angle, see Duplicate check), ko 1,602 chars without spaces, ja 1,706, zh 1,488.

## Astra r2 re-check (2026-10-20 ~23:50 KST)
- variety: ko OK, en OK, zh (--lang zh-hant) OK, ja FAIL 0 (WARN only: stock-hypothetical opener, desu-masu 77%; unchanged from before, not flagged by the gate).
- links.py: BAD 0 (incl. goldcard.nat.gov.tw en/ja/zh 200; internal /en/columns/taiwan-employment-gold-card exists as columns-en/027).
- YAML (ruby safe_load) OK x4; faq 3 each; featured_image TBD; author token only; no 曾雋崴 in any file; no bold.
- Lengths (blen.py): en 863 words, ko 1,706 chars without spaces, ja 1,850, zh 1,557.

## Astra r3 re-check (2026-10-21 ~01:16 KST)
- variety: ko OK, en OK, zh (--lang zh-hant) OK, ja FAIL 0 (WARN only: stock-hypothetical opener, desu-masu 77%; unchanged, not flagged).
- links.py: BAD 0. YAML (ruby safe_load) OK x4, faq 3 each. No 曾雋崴 in drafts, no bold, featured_image TBD.
- Lengths: en 846 words, ko 1,677 chars without spaces, ja 1,850, zh 1,560.
