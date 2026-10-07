# FINAL REVIEW r1 — ja-022-marrying-taiwanese-national-registration-checklist

Reviewer: Claude Fable 5.1 (model review; not a native-speaker or lawyer review)
Date: 2026-10-06
Target: src/content/columns-ja/022-marrying-taiwanese-national-registration-checklist.md (ja, slug marrying-taiwanese-national-registration-checklist)

## Verdict

PASS — publishable as the live replacement. No blocking issue. No edit applied to draft.md.

## Scope checked

- Read in full: orig.md, draft.md, guard.txt, notes.md, tests.patch, tests.txt, vitest-1.log, meta; SENTENCE-VARIETY-RULE.md (all, incl. sections 5–6), rules/COLUMN-VOICE-RULE.md, rules/brief-EDITORIAL-VOICE.md, LESSONS.md.
- Not available: `~/agent-library/knowledge/editorial-voice.md` (file does not exist at that path on this machine); the copy in rules/brief-EDITORIAL-VOICE.md was used instead.
- Commands run by me:
  - `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check …/draft.md --lang ja` → `sentences=47 mean=37.4 cv=0.465 short=0.213 run3=0.022 opener_rep=0.125 cite_end=0.0 cite_para=0.0 contrast=0 caveat=0 q=0`, one WARN (89% です・ます endings), 0 FAIL.
  - `python3 /Users/son7/tseng-rewrite-1006/guard.py orig.md draft.md ja marrying-taiwanese-national-registration-checklist --today 2026-10-06` → `GUARD: PASS` (length 1419 → 1394, 98%; monotony score 31.5 → 9.7). Same tolerated pre-existing lint notes as guard.txt.
  - `diff orig.md draft.md` → front matter differs only at line 5 (lastmod).
  - Link extraction on both files → identical set of 7 targets, once each. Bold/`__`/`<strong>`/`<b>` grep on draft → no match. Plain-form sentence-ending grep (だ。/である。/ない。/する。 etc.) → no match.
- Not done: the official pages (koryu.or.jp, ris.gov.tw, boca.gov.tw) were not re-opened; the law of the original was not re-litigated, per the review brief. The tests were not re-run by me; I rely on vitest-1.log (76 files / 1026 tests passed) and read the patch against the current test file.

## Front matter

Identical except `lastmod: "2026-09-27"` → `"2026-10-06"`. title, seoTitle, summary, date_display, read_time (約5分), categories, featured_image, all three FAQ q/a, audience, author unchanged. H1 unchanged. No image lines in the body in either version.

## Fact table (original → rewrite)

Section order changed: original was 台湾で成立 → 日本で成立した婚姻を台湾に登録 → 交流協会/日本への届出 → 査証・居留. Rewrite is 台湾で成立 → 交流協会/日本への届出 → 日本で成立した婚姻を台湾に登録 → 査証・居留. All four `##` headings and the `###` heading are verbatim. The moved section applies to the 台湾で婚姻した case in both versions, so no claim changed scope.

### Intro

| # | Original point | Rewrite | Status |
|---|---|---|---|
| I1 | 台湾先か日本先かの選択で、最初に相談する窓口と必要な証明が変わる | 「結婚するのは台湾が先か、日本が先か。その順番で…変わります。」 | preserved |
| I2 | もう一方の戸籍へ記録する手続きまで考えると、どの文書をいつ取り寄せるかが分かる | verbatim | preserved |
| I3 | 戸籍謄本だけで婚姻要件を示す証明書の代わりになるとは限らない (hedge) | question 「…足りるでしょうか。」 + 「謄本だけで、…代わりになるとは限りません。」 | preserved; とは限りません kept; 例えば opener dropped, no fact in it |
| I4 | 交流協会の婚姻要件具備証明書は中国語で発行、独身であること AND 日本法上の婚姻年齢に達していることを証明 | same, comma added | preserved |
| I5 | 日本語の戸籍資料などを別に提出する場合、その文書の中国語訳と認証の要否を確かめる | 「…提出するなら、その文書に中国語訳と認証が要るかどうかを確かめます。」 | preserved (still a check, not an assertion that both are required) |
| I6 | 説明は異性間の婚姻が中心 | 「以下の説明は異性間の婚姻が中心です。」 | preserved |
| I7 | 同性婚は日台で制度上の扱いが異なり、日本側の戸籍への届出に同じ説明を一律に当てはめられない | verbatim | preserved |

### 台湾で婚姻を成立させるための証明と登録

| # | Original point | Rewrite | Status |
|---|---|---|---|
| T1 | 交流協会の国際結婚案内 (koryu.or.jp/faq/international/) が婚姻する場所ごとに相談先を示す | 「相談先は、[…]が婚姻する場所ごとに示しています。」 same link | preserved |
| T2 | 台湾での提出先は戸政事務所 | verbatim | preserved |
| T3 | 同協会の「日本人と台湾人の結婚手続き」(PDF link) に沿って日本人の婚姻要件具備証明書などを準備 | reordered, same link, など kept | preserved |
| T4 | 戸政司の婚姻登録案内 (ris.gov.tw link) に従い、外国籍配偶者の婚姻状況を示す資料 AND 中国語氏名の申告書を提出、外国語文書には認証済みの中国語訳を添える | reordered, same link, both documents, 認証済みの中国語訳 kept | preserved |
| T5 | 認証の扱いは交流協会発行の証明書か日本国内発行の文書かによっても異なる | verbatim | preserved |
| T6 | 文書名と発行機関を戸政事務所に伝えれば、原本と訳文に必要な手続きを確認できる | 「提出する」 dropped before 文書名; otherwise same | preserved (context makes the documents clear) |
| T7 | 書類同士で漢字・ローマ字の氏名表記と生年月日が一致するか確かめる | 「提出する」 dropped; otherwise same | preserved |
| T8 | 台湾で成立させる場合: 書面に2人以上の証人が署名または押印 AND 当事者双方が戸政機関で婚姻登録を行う必要 | 「台湾で婚姻を成立させるには、…行う必要があります。」 | preserved (2人以上, 署名または押印, 当事者双方, 戸政機関, 必要 all kept) |
| T9 | 挙式や書面の作成だけでは成立しない | 「挙式だけでは成立しません。書面を作っただけでも同じです。」 | preserved; with T8 immediately before, 挙式+書面 without 登録 is still covered |
| T10 | そのため登録日と結婚式の日が異なることもある | 「そのため、登録日と結婚式の日が異なることもあります。」 | preserved (こともあります kept) |

### 交流協会で証明書をもらえば、日本への届出も済むか

| # | Original point | Rewrite | Status |
|---|---|---|---|
| K1 | 台湾で婚姻した場合、日本の戸籍にその事実を反映する届出が必要 | 「日本の戸籍には、台湾で婚姻した事実を反映する届出が必要です。」 | preserved (condition carried inside the clause; 必要 kept) |
| K2 | 期限は婚姻成立の日から3か月以内 | 「期限があります。婚姻成立の日から3か月以内です。」 | preserved (starting point and number kept) |
| K3 | 必要書類と郵送方法は提出先の市区町村に事前に問い合わせる | moved to the end of the next paragraph, same wording | preserved |
| K4 | 交流協会の証明事務の案内 (koryu.or.jp/consul/proof/): 婚姻・出生等の戸籍の届出は取り扱わず、届出義務者が直接本籍地の長に届け出るとされている | same link and wording; 「日本台湾交流協会の」→「交流協会の」 (full name stays on the first link; the original itself uses 交流協会 in the intro) | preserved |
| K5 | 証明書の発行と婚姻届の受理は別 | 「証明書の発行と婚姻届の受理は別です。」 | preserved |

### 日本で成立した婚姻を台湾に登録する場合

| # | Original point | Rewrite | Status |
|---|---|---|---|
| J1 | 日本で先に婚姻するなら、提出先の市区町村に台湾人配偶者の婚姻要件や身分についてどの証明書が必要かを問い合わせる | clause order changed only | preserved |
| J2 | 成立後、その婚姻を台湾の戸籍へ記録する手続きに進む | verbatim | preserved |
| J3 | 日本で成立済みの婚姻を証明する文書が必要 | verbatim | preserved |
| J4 | 台湾の在外窓口で認証され AND 婚姻成立地の法律に適合する旨の注記がある場合、別途の婚姻状況証明の添付を省略できる | verbatim | preserved |
| J5 | 日本で発行された文書の原本には台湾の在外窓口による認証が必要 | 「認証は原本にも訳文にも必要です。」 + 「…原本は台湾の在外窓口が…認証します。」 | preserved (必要 explicit, actor kept) |
| J6 | 中国語訳には在外窓口の認証 OR 台湾の公証人による認証が必要 | 「中国語訳は在外窓口または台湾の公証人が認証します。」 under the same 必要 lead-in | preserved (OR kept) |
| J7 | アポスティーユだけで台湾向けの認証に代えられると考えず、提出先の認証要件に沿って準備 | 「…代えられるとは考えず、提出先の認証要件に沿って準備します。」 | preserved |
| J8 | 離婚や死別の記録がある場合、前の婚姻が終わっていることを示す資料が必要になることがある (hedge) | 「…記録があると、…必要になることがあります。」 | preserved (ことがあります kept) |
| J9 | 日本の戸籍や台湾人配偶者の戸籍、過去の離婚・死別を示す資料をもとに、追加で必要な証明書を提出先に確認 | reordered, same elements | preserved |

### 台湾で暮らすための査証・居留

| # | Original point | Rewrite | Status |
|---|---|---|---|
| V1 | 台湾領事事務局の外国籍配偶者の居留査証案内 (boca.gov.tw link) が婚姻に関する提出資料などを説明 | moved to third sentence, same link, など kept | preserved |
| V2 | 結婚の成立だけで査証・居留・国籍の手続きがすべて終わるものではない | 「…すべて終わるわけではありません。」 preceded by the question 「結婚すれば台湾に住めるでしょうか。」 | preserved; the question restates FAQ 3 and adds no fact |
| V3 | 台湾人配偶者の戸籍状況、自分の入境資格 AND 現在の滞在期限を伝える | same three items | preserved |
| V4 | 査証は領事事務局や在外窓口、居留は移民署へ問い合わせる | 「査証は領事事務局や在外窓口に、居留は移民署に問い合わせ…」 | preserved (who-handles-what unchanged) |
| V5 | 結婚後に台湾で暮らす予定なら、この準備も日程に入れる必要がある | verbatim | preserved |
| V6 | お子さんの出生は internal link /ja/columns/baby-taiwan-nationality-birth-registration | same sentence and link, now its own paragraph | preserved |

### 婚姻記録と台湾の登録に関する相談 (contact)

| # | Original point | Rewrite | Status |
|---|---|---|---|
| C1 | 以前の離婚記録・名前の違い・複数国の婚姻証明がある場合、台湾の婚姻登録のために過去の婚姻や離婚をどの資料で証明する必要があるか、書類を取り寄せる前に相談できる | 「…がある場合は、台湾の婚姻登録で過去の婚姻や離婚をどの資料で証明する必要があるかを、書類を取り寄せる前に相談できます。」 | preserved |
| C2 | 昊鼎国際法律事務所の弁護士・曾雋崴へ連絡する際は、国籍、婚姻予定地、台湾戸籍の有無と滞在状況を簡潔に伝える | verbatim | preserved |
| C3 | メール wei@hoveringlaw.com.tw (mailto), 台北所在地 103 臺北市大同區承德路一段35號7樓之2 | verbatim | preserved |
| C4 | 公式資料の確認日は2026年9月27日; 実際の提出条件、期限と手数料は申請先の最新案内に従う | verbatim | preserved |

### Additions check

Sentences that exist only in the rewrite: 「戸籍謄本を取り寄せて台湾へ行けば足りるでしょうか。」 (question form of I3), 「期限があります。」 (K2 split), 「書面を作っただけでも同じです。」 (T9 split), 「認証は原本にも訳文にも必要です。」 (J5/J6 lead-in), 「結婚すれば台湾に住めるでしょうか。」 (question form of V2/FAQ 3). None carries a new fact, number, example, case, first-person statement, promise or sales line.

Numbers: 2人以上, 3か月以内, 2026年9月27日, postal 103 and the address numerals — all present, each attached to the same claim. No article numbers or judgment citations exist in either version. The original has no sources section and none was added; all five official URLs, the internal link and the mailto remain inline, once each.

## Blocking issues

None.

## AI voice / monotony

Tool: 0 FAIL, 1 WARN (89% です・ます endings; the register requires です・ます, and the endings do vary: 〜ます / 〜です / 〜ません / 〜でしょうか / 〜できます).

Section 5 items 2–7:
- 2 (opener formula): met. First sentence is the reader's own choice (台湾が先か、日本が先か); the original's 「例えば、…」 in paragraph 2 is gone.
- 3 (short sentences): met. 10 of 47 sentences are short, e.g. 「台湾での提出先は戸政事務所です。」「挙式だけでは成立しません。」「期限があります。」
- 4 (paragraph starts): met. 結婚… ×2 (intro, 査証), 日本… ×2; nothing three times.
- 5 (claim → citation → caveat chains): met. No parenthetical citations at all; several paragraphs carry no link.
- 6 (contrast templates): met. One 「別です」, zero ではなく, nothing rebutting a claim the reader did not make.
- 7 (closing): met. The last paragraph is the original's column-specific contact, check date and 最新案内 sentence, kept verbatim as the brief requires; it is not the stock 「一般的な説明であり…」 disclaimer.

MONOTONY items: none. Zero unmet items of section 5.

Native-reader read: です・ます throughout, no だ・である sentence, no bold, no emoji, headings are noun phrases or one real question (unchanged from the original). The reordered link sentences (「相談先は、…が婚姻する場所ごとに示しています」「婚姻に関する提出資料などは、…が説明しています」) read naturally and remove the original's link-as-subject openers. 「届出が必要です。期限があります。婚姻成立の日から3か月以内です。」 is three short sentences in a row; it reads as deliberate emphasis on the one deadline in the column and I left it. The two 〜でしょうか questions are questions a reader actually has (the second is FAQ 3).

## Length

1419 → 1394 characters (98%). Not padded. Cuts are wording only (例えば, repeated 提出する, 〜してもらうこと); no legal point removed.

## Tests verdict

tests.patch: acceptable. It touches one file, `src/lib/__tests__/family-columns-20260927.test.ts`, and only the sitemap `lastModified` expectation: `ja/marrying-taiwanese-national-registration-checklist` leaves `UNCHANGED_PASS` (which pinned 2026-09-27) and enters a new `REWRITTEN_LASTMOD` map pinned to 2026-10-06. Every other locale/slug still resolves through the unchanged `UNCHANGED_PASS ? '2026-09-27' : '2026-09-28'` expression, so no other column's assertion is weakened. No `.skip`/`.only`, no it()/test() block added or removed. The content assertions for this column (publicationDate 2026-09-27, mailto, 曾雋崴, no phone number, featured image path, summary length 150–160, ≥2 https sources, ≥2 FAQ, category) are untouched and the draft still satisfies them. vitest-1.log: 76 files / 1026 tests passed with the patch.

## Tiny edits applied

None. draft.md is unchanged by this review; the guard result above is for the file as delivered.

## Original issues (not blocking; unchanged by the rewrite)

1. No statute is cited for the 3か月 deadline, the 2人以上の証人 + 登録 requirement, or the 在外窓口/公証人 authentication rules; they rest on the linked agency pages only. The guard lists "no law.moj.gov.tw citation" as tolerated house format.
2. The contact line carries the street address 承德路一段35號7樓之2. The guard's lint says only 「19號6樓之1」 is allowed (or no address) and tolerates this as pre-existing. Which address is current is 確認 필요 by the site owner; the rewrite kept the original verbatim as instructed.
3. The column has no sources section; the last `##` is 査証・居留 with the contact `###` nested under it. Pre-existing structure, tolerated by the guard.
4. FAQ 1 says 「本籍地などの市区町村」 while the body quotes 「本籍地の長」 from the 交流協会 page. Not contradictory, but slightly different wording; unchanged.
5. `date_display` stays 2026年9月27日 and the body's 確認日 stays 2026年9月27日 while lastmod becomes 2026-10-06. This is correct for a style-only rewrite (sources were not re-checked on 2026-10-06).

VERDICT: PASS
