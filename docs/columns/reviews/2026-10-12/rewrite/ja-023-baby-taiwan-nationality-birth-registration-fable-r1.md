# FINAL REVIEW r1 — ja-023 baby-taiwan-nationality-birth-registration (Claude Fable 5.1, 2026-10-12)

## Verdict

PASS. The rewrite preserves every legal claim, condition, deadline, article/link, contact line and notice of the original, adds no new fact, is shorter (1367 → 1365 chars), passes the mechanical guard and the variety checker with 0 FAIL, and reads as natural Japanese です・ます prose. Two tiny wording edits applied by the reviewer (listed below); guard re-run → PASS.

## Scope checked

- orig.md and draft.md read in full, compared paragraph by paragraph.
- guard.txt (GUARD: PASS), notes.md, tests.patch, tests.txt, claude-tests1.log.
- SENTENCE-VARIETY-RULE.md §5–6, COLUMN-VOICE-RULE.md, LESSONS.md skimmed.
- `variety_metrics.py check draft.md --lang ja`: 0 FAIL, 1 WARN (92% です・ます endings; the original has the same WARN at 93%, a register property, not a FAIL).
- Baseline on orig.md: 3 FAIL (len_cv 0.399, short_share 0.048, top_opener_n 4). Draft: cv 0.455, short 0.106, opener_rep OK.
- External check: opened the 移民署 無戶籍國民定居 page (URL as in the column). 注意事項(七) reads 「完成登記後，首次出國應持配賦國民身分證統一編號之我國護照，始可持憑出國。」 and the page lists the two overseas-birth categories (持外國護照入國 / 持我國護照入國, parent 設有戶籍國民 at birth). The rewrite's explicit referent 「移民署の案内の注意事項（七）」 is correct.
- Test file located at `/Users/son7/Projects/tseng-law-rewrite-1006-w1/src/lib/__tests__/family-columns-20260927.test.ts`; only use of the two touched constants is the sitemap lastModified expectation (line 86).

## Front matter

Identical to the original except `lastmod: "2026-09-27"` → `"2026-10-12"`. read_time 約5分 unchanged (length 100%). H1 and featured_image unchanged. FAQ 3 entries byte-identical.

## Claim-by-claim fact table

### Opening (orig ¶1–2 → draft ¶1–2)
| Original point | Rewrite | Status |
|---|---|---|
| Opening question: where to file the Japanese 出生届 for a Taiwan-born baby | ¶1 same question | preserved |
| (answer, moved up) 届出先は日本の市区町村 | ¶1 「届出先は日本の市区町村です。」 | preserved — fact already in orig §2 (「届出先は協会ではなく日本の市区町村」) and §1; not a new fact |
| Hospital 出生証明書 ≠ Japanese filing and Taiwan 戸籍登録; each prepared separately | ¶1 | preserved |
| Born outside Japan + foreign nationality at birth → watch the 国籍留保 deadline | ¶1 | preserved |
| Taiwan vs Japan birthplace → different registration procedures | ¶2 「出産地が台湾か日本かで、登録の手続きは違います。」 | preserved |
| Nationality judged from parents' nationality at birth and legal parent-child relation | ¶2 | preserved |
| 国籍法第2条 (link, pcode D0030001 flno=2): father or mother ROC national at birth 「など」 | ¶2 same link, same wording | preserved |
| Birth in Taiwan alone does not confer nationality on every baby | ¶2 「…取得するわけではありません」 | preserved |

### §1 日本国籍の留保 (heading unchanged)
| Original point | Rewrite | Status |
|---|---|---|
| Source: 法務省「国籍Q&A」 link | same | preserved |
| Born outside Japan, acquires Japanese + foreign nationality by birth → must declare 留保 together with 出生届, otherwise loses Japanese nationality retroactively to birth | ¶1 | preserved |
| Deadline: within 3 months from the day of birth | ¶1 「期限は出生の日から3か月以内です。」 (split into its own sentence) | preserved, start point kept |
| Only children meeting these birthplace/nationality conditions; not all 日台 children regardless of birthplace | ¶2 | preserved (reviewer edit: 「必要になるとは限りません」, same meaning) |
| 留保 filing and later 国籍選択 are separate systems | ¶2 「その後の国籍選択も、留保とは別の制度です。」 | preserved (reviewer restored the explicit 留保 referent) |
| Before birth, contact 本籍地等の市区町村: form, foreign birth certificate + translation conditions, how to fill in 留保 | ¶3 | preserved |
| Mail: what matters is arrival date at the office; do not judge the deadline by the posting date | ¶3 | preserved |

### §2 交流協会 / 台湾側の出生登録 (heading changed: 「日本台湾交流協会へ出生届を出せるか」 → 「出生届の提出先と、台湾側の出生登録」; covers the same two topics)
| Original point | Rewrite | Status |
|---|---|---|
| 交流協会 証明事務案内 link: 出生・婚姻等の戸籍届出 not accepted | ¶1 same link | preserved |
| Even if forms/explanations came from the association, filing goes to the Japanese municipality | ¶1 | preserved (「協会ではなく」 contrast dropped, meaning intact) |
| Taiwan side proceeds separately | ¶2 「台湾側は別に進めます。」 | preserved |
| Hospital certificate vs 戸政事務所 出生登録 are different procedures | ¶2 | preserved |
| Tell 戸政事務所: parents' names, nationality at birth, Taiwan 戸籍 status; ask which registration applies | ¶2 | preserved |
| 戸政司 初設戸籍案内 link distinguishes domestic vs overseas birth | ¶2 same link | preserved |

### §3 日本で生まれた子の台湾戸籍 (heading changed: 「…はどう作るか」 → 「…を作るまで」)
| Original point | Rewrite | Status |
|---|---|---|
| Japanese 出生届 does not automatically create a Taiwan 戸籍 | ¶1 reader question + 「自動的には作られません。」 | preserved |
| 移民署 無戸籍国民 定居申請案内 link has application categories for overseas-born children | ¶1 same link | preserved |
| Category decided by parent's Taiwan 戸籍 at birth, child's age, passport used for entry | ¶1 | preserved |
| If applicable: 定居許可 first, then 初設戸籍 at 戸政事務所 | ¶2 | preserved |
| Neither "all children need N years residence" nor "Taiwanese parent → immediate 戸籍" | ¶2 | preserved verbatim |
| Documents made in Japan (birth records, parent-child proof) → authentication by Taiwan's overseas office | ¶3 | preserved |
| Chinese translations → authenticated by overseas office or Taiwan notary | ¶3 | preserved |
| Tell the office about 認知 and 親権者; confirm required documents and whose consent is needed | ¶3 (split into two sentences) | preserved |
| 注意事項（七）: first departure after 初設戸籍 must use ROC passport with assigned 統一番号 | ¶4; 「同案内」 → 「移民署の案内」 | preserved; referent verified against the live page |

### §4 旅券 (heading unchanged)
| Original point | Rewrite | Status |
|---|---|---|
| 領事事務局 初回旅券 本人確認案内 link: applies to applicants with Taiwan 戸籍 | ¶1 same link | preserved |
| Under 14 without 国民身分証: 戸口名簿・戸籍謄本, legal representative consent documents | ¶1 | preserved |
| Do not apply this guide as-is to a child without 戸籍; ask the passport office per age/戸籍 | ¶1 | preserved |
| Taiwan birth registration alone does not yield a passport | ¶2 | preserved |
| Apply counting back from travel date; check name consistency between birth/戸籍 records and passport application | ¶2 (split) | preserved |
| Confirm nationality, run 戸籍登録 and passport separately → avoid "registered but no travel documents" | ¶2 | preserved |

### Contact / closing
| Original point | Rewrite | Status |
|---|---|---|
| H3 「台湾側の家族関係・登録の相談」 | unchanged | preserved |
| 昊鼎国際法律事務所・曾雋崴; what to tell: birthplace, parents' nationality/戸籍, existing certificates/passport, travel plans | 「に相談する場合は」 | preserved |
| Email wei@hoveringlaw.com.tw, address 103 臺北市大同區承德路一段35號7樓之2 | identical | preserved |
| Internal link /ja/columns/marrying-taiwanese-national-registration-checklist | identical | preserved |
| 公式資料の確認日 2026年9月27日; check latest guidance for documents/handling/fees | 「参照してください」 | preserved |

Nothing added: no new facts, examples, numbers, first-person material, promises or sales lines. The only sentence without a direct original counterpart (「届出先は日本の市区町村です。」) restates an original fact.

## Blocking issues

None.

## MONOTONY

No FAIL from the checker. Rule §5 self-check: (1) 0 FAIL; (2) opener is a reader question, not a formula; (3) short sentences present (「届出先は日本の市区町村です。」「自動的には作られません。」「台湾側は別に進めます。」「期限は出生の日から3か月以内です。」); (4) paragraph-initial words: no word three times; (5) no 「ただし」 chain, several paragraphs without citation; (6) contrast templates 0; (7) last body paragraph ends on this column's facts, the 確認日 line is the original's structural notice; (8) です・ます throughout, no bold, no emoji, no imperative/checklist headings; (9) no fact, number, link or label lost. Reads as Japanese, not translationese. Minor, non-blocking: 「〜わけではありません」 now appears twice (orig had three negated-overreach sentences in varied form); reviewer varied one of them (edit 1).

## Tests

tests.patch is acceptable. It touches only `family-columns-20260927.test.ts`: removes `ja/baby-taiwan-nationality-birth-registration` from `UNCHANGED_PASS` and adds it to `REWRITTEN_LASTMOD` with `'2026-10-12'`. The only consumer of both constants is the sitemap `lastModified` expectation (line 86), so the patch re-anchors exactly the lastmod this rewrite changed. No it()/test() block added or removed, no .skip/.only, no assertion about any other column changed, no body/heading/link assertions exist for this column in that file. tests.txt: vitest 78/78 files PASS after one sync round.

## Tiny edits applied by the reviewer (draft.md §1 ¶2)

1. 「同じ留保が必要なわけではありません」 → 「同じ留保が必要になるとは限りません」 (vary the repeated 〜わけではありません ending; same meaning).
2. 「その後の国籍選択も別の制度です」 → 「その後の国籍選択も、留保とは別の制度です」 (restore the explicit comparison target from the original 「留保の届出と、その後の国籍選択も別の制度です」).

Re-run after edits:
```
python3 guard.py orig.md draft.md ja baby-taiwan-nationality-birth-registration --today 2026-10-12
NOTE length 1367 -> 1365 (100%)
NOTE monotony score 28.2 -> 17.2; cv 0.399 -> 0.455; short 0.048 -> 0.106; cite_end 0.0 -> 0.0; contrast 2 -> 0; questions 0 -> 0
GUARD: PASS
variety_metrics.py check draft.md --lang ja: 0 FAIL, WARN 92% desu-masu (same WARN as original)
```

## Original issues (not blocking)

- The guard's pre-existing lint notes (office street address in the contact line; last H2 is not a sources section) are house format of the published original and were left as-is.
- The 移民署 page (checked today) lists the overseas-birth 定居 categories as (一) entering on a foreign passport and (二) entering on an ROC passport, each requiring a parent who was a 設有戶籍 national at birth. The column's generic description (「出生時の親の台湾戸籍、子どもの年齢、入境に使う旅券などで判断」) is consistent with that; no change needed.
