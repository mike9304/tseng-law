# Final review r1 — ja-020 taiwanese-spouse-divorce-from-abroad (Claude Fable, 2026-10-12)

VERDICT: PASS

## Scope checked

- orig.md vs draft.md, claim by claim, all sections including front matter, FAQ, contact block and signature.
- guard.txt (GUARD: PASS; length 1378 -> 1312, 95%).
- notes.md (rewriter's notes and two doubts).
- tests.patch (non-empty, 1 file) against the pinned test in /Users/son7/Projects/tseng-law-rewrite-1006-w1/src/lib/__tests__/divorce-columns-20260927.test.ts; tests.txt reports 78/78 test files passing after sync.
- SENTENCE-VARIETY-RULE.md sections 5-6, COLUMN-VOICE-RULE.md, LESSONS.md top items.
- variety_metrics.py check draft.md --lang ja: FAIL 0 (one WARN, see below). Original for comparison: 3 FAIL.
- Source verification of the two statute links (fetched 2026-10-12):
  - mojlaw link with lawNumber=1049 renders 第1049條 and 第1050條 on the same page; 第1050條 text: 兩願離婚，應以書面為之，有二人以上證人之簽名並應向戶政機關為離婚之登記. Matches the column's claim. The rewriter's doubt about the link target is resolved: the link is correct and is the house link used in all 27 sibling columns.
  - law.moj.gov.tw 家事事件法第13條 第1項: 法院處理家事事件，得命當事人或法定代理人本人到場，或依事件之性質，以適當方法命其陳述或訊問之。Matches the paraphrase in both original and rewrite.

## Fact table

### Front matter
| Original | Rewrite | Status |
|---|---|---|
| title, summary, date_display, read_time 約4分, categories, featured_image, faq (2 Q/A), audience, author | identical | preserved |
| lastmod 2026-10-06 | 2026-10-12 | expected change |
| H1 | identical | preserved |

### Opening (para 1-2)
| Original point | Rewrite location | Status |
|---|---|---|
| Can the procedure proceed without going to Taiwan (question) | para 1, now a direct question | preserved |
| Separate what a representative can do from where the person must attend | para 1 | preserved |
| First confirm how far the spouses agree; the path depends on it | para 1 (出発点は…進め方はそこで変わります) | preserved |
| Hypothetical: contact exists, "別れよう" agreed, no cooperation on the written agreement; labelled 仮に…とします | para 2, three short sentences, label kept as （仮の例です） | preserved (label kept) |
| Consent alone does not get you to 離婚登記 | para 2 | preserved |
| If address unknown, information to serve court documents is also needed | para 2, merged into one sentence | preserved |

### 合意はどこまでできているか
| Original point | Rewrite | Status |
|---|---|---|
| Three layers of agreement: divorce itself; written form + registration cooperation; property and children | para 1 | preserved |
| Degree of agreement decides document route vs litigation of contested points | para 1 | preserved |
| 台湾民法第1050条 協議離婚: written form, 2+ witness signatures, 離婚登記 at 戸政機関 (= 日本の市区町村の戸籍窓口) | para 2, article moved to end-of-sentence parentheses, attached to the same claim | preserved |
| Messages alone do not form this type of divorce | para 2 | preserved |
| Requirements checkable at 法務部 link | para 2, same URL | preserved |
| If agreement is hard: judicial divorce grounds and evidence, competent court, 準拠法 (with gloss) | para 3 | preserved |
| Spouse's nationality or mere separation does not decide the outcome | para 3 | preserved |
| Link to /ja/columns/taiwan-divorce-lawsuit-qna | para 3 | preserved |

### 返事がなくても、送達の問題は残る
| Original point | Rewrite | Status |
|---|---|---|
| No reply does not remove the need for service | para 1 (返信がなくても、送達は省けません) | preserved |
| Separate from proving the (judicial) divorce ground, lawful delivery must be planned | para 1 (裁判上の離婚原因 -> 離婚原因; FAQ already uses the shorter form) | preserved, wording shortened, same meaning |
| Last shared address, current address, workplace, phone, email, each with when obtained | para 2 | preserved |
| Distinguish guesses from confirmed facts; keep returned mail and contact history with dates | para 2 | preserved |
| Do not log into the spouse's accounts or track location; confirm lawfulness of collection at consultation | para 3 (split off as own paragraph) | preserved |
| Handling when address unknown depends on investigation, service destination, court decision | para 4 | preserved |
| Duplicate: 返信がないからといって送達を省略できない | removed (already stated in para 1) | repetition cut, no point lost |
| Court examines 公示送達 requirements and decides whether to permit | para 4 | preserved |

### 日本で調停や訴訟が進んでいる場合
| Original point | Rewrite | Status |
|---|---|---|
| Court name, case number, service status on the spouse, current stage | para 1 | preserved |
| If concluded: the document plus proof of finality | para 1 | preserved |
| If divorce is established in Japan, whether a Taiwan divorce is still needed is judged by the effect that divorce has in Taiwan | para 2 (問題になります / 軸になるのは…効力です) | preserved |
| 戸政司 guidance on foreign divorces and authentication/translation, same URL | para 2 | preserved |
| Effect of the Japanese judgment in Taiwan and documents for 離婚登記 are each checked on the actual documents | para 2 | preserved |

### 代理人がいても出席を求められることはある
| Original point | Rewrite | Status |
|---|---|---|
| 家事事件法第13条: court may order the party in person to appear; and may, by the nature of the case, have them state or be questioned by other appropriate means | para 1, link now on the article mention | preserved, verified against statute |
| Appointing a representative does not uniformly exempt personal attendance | para 1 | preserved |
| Separate "条文のとおり" sentence | removed (the link now sits on the article name) | no point lost |
| Travel difficulty, health or safety reasons: tell the representative early, consult on what application can be made to the court about attendance method | para 2 | preserved |
| Original power of attorney made abroad, authentication, sending method | para 2 | preserved |
| Litigation representation vs 戸政機関 registration delegation have different requirements | para 2 | preserved |
| Keep court documents with the envelope; items with deadlines go to the adviser before the next trip | para 3 | preserved |
| While in Japan, know which document arrived when and the deadline | para 3 | preserved |

### 連絡について + signature
| Original point | Rewrite | Status |
|---|---|---|
| What to send on first contact: nationalities and residence, where the marriage was registered, degree of agreement; children / pending litigation | identical except 既に -> すでに | preserved |
| Conflict check, then document route, scope, fees; languages | identical | preserved |
| Email, Taipei address, 広告責任弁護士：曾雋崴, closing disclaimer sentence | identical | preserved |

Nothing added: no new facts, numbers, cases, promises or first-person material. The only new sentences are two rhetorical questions that carry no claim.

## Blocking issues

None.

## MONOTONY

Tool: FAIL 0. WARN "85% of sentences end in desu-masu" (original 89%; WARN is not a FAIL, and the register is deliberately uniform です・ます).

Section 5 self-check:
1. FAIL 0: met.
2. Opener is not a 例えば…とします formula: met. Note only: sibling ja-019 also opens with a reader question (quoted speech), ja-020 with a direct question. Different device, same family. Not counted as unmet.
3. Very short sentences: 連絡は取れています。/ 返信がなくても、送達は省けません。/ 進め方はそこで変わります。 met. No long runs (run3 0.043).
4. Paragraph openers read vertically: no word three times: met.
5. No three consecutive claim -> 但し paragraphs (caveat 1); several paragraphs without citation: met.
6. Contrast templates 0; no straw-man rebuttal: met.
7. Last paragraph is the original's contact/disclaimer block, carried verbatim because it is this column's fact-bound contact line (house format for the 019-021 set). One item arguably unmet, inherited from the original.
8. です・ます throughout, no bold, no emoji, no imperative or checklist headings: met.
9. No article, link, label or figure lost: met.

At most one unmet item, so the voice gate passes. Native reading: rhythm now mixes short declaratives with longer conditionals; no translationese noticed. The （仮の例です） label at the end of the scene is slightly bare but clear and keeps the hypothetical marking.

## Tests

tests.patch: PASS. It moves ja/taiwanese-spouse-divorce-from-abroad from FACT_FIXED_20261006 to REWRITTEN_20261012 and updates the comment. The lastmod assertion still runs for every record and now locks 2026-10-12 for this column; removing the key from the 2026-10-06 set is correct because the 2026-10-12 branch is evaluated first and the old entry would be dead. No it()/test() blocks added or removed, no .skip/.only, no other column's expectation changed. tests.txt: 78 test files pass after one sync round.

## Tiny edits applied

None. draft.md left as delivered; guard.txt PASS stands.

## Original issues (not blocking)

- Lint notes tolerated by guard are house format for this set: office street address in the contact block, no separate sources section with a check date, last ## heading is a content heading. Same as the live page.
- The 1050条 link uses lawNumber=1049 in the URL. Verified today: the page renders 第1049條 and 第1050條 together, so the link is correct; it is the same link used in all 27 sibling columns. No change needed.
- The sentence "裁判上の離婚原因を立証できるか" is shortened in the rewrite to "離婚原因を立証できるかどうか". The FAQ in the front matter (unchanged from the original) already uses the shorter form, so meaning is consistent across the page.
