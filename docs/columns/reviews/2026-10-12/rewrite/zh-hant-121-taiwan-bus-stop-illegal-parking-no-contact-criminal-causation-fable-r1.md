# FINAL REVIEW r1 — zh-hant-121 taiwan-bus-stop-illegal-parking-no-contact-criminal-causation

Reviewer: Claude Fable 5.1 (final gate). Date: 2026-10-12.

## Verdict

PASS. One tiny wording edit applied by the reviewer (listed below); guard re-run PASS, variety re-run OK, tests.patch re-anchored to the edited draft's hash.

## Scope checked

- orig.md vs draft.md, all 16 body paragraphs, claim by claim (table below).
- Front matter, H1, intro two lines (資料查核日 / 整編截止日).
- guard.txt (GUARD: PASS, re-run after edit: PASS, length 2893 -> 2811 = 97%).
- variety_metrics.py check --lang zh-hant: OK, no FAIL (cv 0.478, short 0.106, run3 0.036, opener_rep 0.059, cite_end 0.012, contrast 1, q 4).
- SENTENCE-VARIETY-RULE §5–6, COLUMN-VOICE-RULE, LESSONS.md top items (judgment, wrong-citation, monotony-contrast, deadline-amount, zh-native, bold).
- tests.patch + the test it touches (src/lib/__tests__/traffic-ambulance-taxi-causation.test.ts) + vitest-1.log (78 files / 1371 tests passed with the rewriter's patch).
- Confirmed the live repo file in the worktree is byte-identical to orig.md.

## Front matter

Identical to the original except lastmod "2026-10-03" -> "2026-10-12". read_time unchanged ("約6分鐘閱讀", appropriate at 97% length). H1, featured_image, alt, caption, social_image unchanged. Intro lines (本文依官方裁判及法條撰寫… / 資料查核日 2026-10-03；整編截止日 2026-09-24) unchanged.

## Claim-by-claim fact check (original → rewrite → status)

P1 (事故經過, 高院108交上訴69 理由二㈡⒈、二㈢⒉)
- 2017-09-19 晚間、新北中和、公車停靠區內停著計程車 → P1 same → preserved.
- 公車無法駛入、停在計程車左側；後方載客機車左移與相鄰車道大貨車碰撞；後座乘客死亡 → P1 (split into short sentences, 進不去 = 無法駛入) → preserved.
- 計程車未直接碰撞卻被判過失致死；法院追問靜止車輛如何改變通行空間 → P1 → preserved. Citation and link same.

P2 (規則第111條 / 刑訴第154條 / 計程車一審107交訴40)
- 現行道路交通安全規則第111條第1項第2款：公共汽車招呼站10公尺內不得臨時停車 → P2 first sentence, link now inline on the article name → preserved (article still attached to this claim).
- 違停罰單不能直接證明過失致死 → preserved verbatim.
- 須具體證明 注意義務違反、預見可能性、行為與死亡結果間因果歸責關聯 → preserved verbatim.
- 犯罪事實證明須排除合理懷疑（刑訴154；一審 事實欄二、四㈢⒉） → preserved; both citations present in parentheses.
- 不能因後果嚴重便倒推有罪 → "後果嚴重，不能倒推有罪。" → preserved.

P3 (一、二審分歧)
- 新北地院 2019-01-09：騎士有反應時間、貿然左切為獨立原因、違停與死亡間仍有合理懷疑 → preserved.
- 高院 2020-01-22 撤銷原判、改判有期徒刑1年2月 → preserved.
- 分歧核心＝騎士過失是否足以排除前方障礙的影響 → rephrased as a question + "分歧就在這裡" → preserved. Citations (一審 事實欄四㈣、五；高院 主文、理由四) same.

P4 (高院勘驗)
- 六個角度行車紀錄器（貨車右側、前方、上方；公車左側、右側、前側） → preserved; citation 理由二㈢⒈至⒉ moved to after the first sentence.
- 本文依判決記載整理，未觀看原始影像 → preserved verbatim.
- 計程車阻止公車進站；公車併排後外側車道完全受阻並占用相鄰車道約1/4至1/5；機車為閃避公車左移、與貨車距離過近而碰撞 → preserved.

P5 (澎科大鑑定, 理由二㈢⒋⑵)
- 鑑定對駕駛有利：違規但無肇事因素 → preserved.
- 高院未直接接受：前提3.9公尺 vs 現場圖/截圖3.3公尺；即使3.9，扣公車寬度與合理間距後剩0.9，不足容納0.7公尺機車＋合理間隔 → preserved, all four numbers in same roles.
- 法院認鑑定未充分處理實際通行空間；此為檢驗鑑定前提，不能抽離現場當一般間距標準 → preserved. Citation same.

P6 (最高法院109台上5121 理由三㈡)
- 另一不明小客車略占停靠區、其餘違停車在區外 → preserved; judgment link now on the judgment name with (理由三㈡).
- 駕駛主張移走計程車公車仍無法進站；最高法院依相對位置認若無此計程車公車尚能進站 → preserved.
- 確認原因力、未認定為唯一原因 → preserved.

P7 (規範保護目的, 5121 理由三㈠至㈡)
- 禁止占用是為讓公車進站、避免停在外側阻塞、其他用路人閃避致險 → preserved.
- 本案認定經過＝停靠區受阻→公車停外側→後車左移碰撞 → preserved.
- 風險持續作用並在死亡結果中實現，落在規範要防止的危險範圍 → preserved; citation given as "（同判決理由三㈠至㈡）" text (link is in P6, same judgment) → acceptable.
- Original topic sentence "停靠區的用途，也說明了刑責為何可能及於未碰撞的車輛" removed → this was a preview/transition sentence; its legal content (protective purpose → liability without contact) is still carried by the paragraph's last sentence and the H1. Not a lost legal point. Noted, not blocking.

P8 (第三人過失不切斷因果, 5121 理由三㈠至㈡)
- 騎士有過失不自動切斷關聯 → preserved verbatim.
- 客觀歸責：第三人須創造並單獨實現獨立危險，使先前行為無法繼續作用於結果，才可能中斷歸責 → preserved verbatim.
- 後車因阻塞變換車道屬可預見發展、無重大因果偏離 → preserved.
- 騎士未盡注意義務與計程車可預見障礙可同時成立 → preserved. Citation as "在同一判決（理由三㈠至㈡）" → acceptable.

P9 (程序結果)
- 最高法院 2020-12-31 認上訴不合法律上之程式駁回、並非重新審判事實（理由一、三、四） → preserved.
- 2021-08-11 110台抗1289 裁定（理由一至三）記載高院判決已確定、駁回針對再審聲請遭否准所提抗告 → preserved (split into three sentences; link kept on the 裁定 name).

P10 (騎士、公車與貨車駕駛)
- 2018-11-23 同案號另一判決：騎士有期徒刑5月、緩刑2年、諭知「如易科罰金」折算標準；不能據此說已繳罰金 → preserved; citation 主文、理由三至四 same.
- 公車與貨車駕駛不起訴處分確定、並非法院判決無罪（高院 理由二㈡⒋） → preserved.
- 各人結果各有證據與責任判斷 → preserved.

P11 (刑法第276條修正, 高院理由三㈠、五; 刑法2; 刑法276)
- 1年2月非固定刑度 → preserved.
- 2019-05-29 修正公布、05-31 施行；刪除業務過失致死獨立規定 → preserved (reviewer smoothed one clause, see edits).
- 高院比較原應適用的業務過失條文；新法增加選科罰金、不再設併科罰金，對被告較有利，故適用新法 → preserved verbatim.
- 現行第276條：5年以下有期徒刑、拘役或新臺幣50萬元以下罰金 → preserved. All three links same.

P12 (民事 112簡上389, 事實及理由貳、五㈢⒉)
- 2025-03-12 新北地院；騎士50% / 計程車駕駛30% / 不明違停車20% → preserved.
- 本文尚未確認該民事判決是否確定 → preserved.
- 騎士為後座乘客的使用人，依民法第217條使父母請求適用過失相抵 → preserved (original's "法院將騎士認為是" was ungrammatical; rewrite says 法院認為騎士是, same meaning).
- 非認定乘客自己違規、比例不可套用他案 → preserved.

P13 (民法184/185/281)
- 計程車駕駛依184負侵權責任、不能主張只賠30% → preserved.
- 185＝共同侵權對外連帶；281＝清償後內部求償 → preserved, articles attached to same claims.
- 家屬依法減額、扣除已受償款項後仍可就尚存連帶債務向其中一人請求；內部分擔比例≠對外上限 → preserved. Citation same.

P14 (民法188, 公車方駁回)
- 靠行契約與指揮監督關係→事實上僱用關係→188連帶 → preserved.
- 公車駕駛及客運公司之賠償請求在此次上訴遭駁回；屬本案空間限制與風險歸責判斷，不能推成公車遇違停一律免責 → preserved. Citation (主文三至四、五㈠⒉、五㈡) same.

P15 (金額計算, 五㈢⒈至⒋、六)
- 母親可請求 172,602元及利息＝扣抵後餘額 → preserved.
- 損害 3,672,602 → 過失相抵 1,836,301 → 扣強制險100萬 → 836,301 → preserved, same order ("其" correctly rendered as 母親).
- 父母各已實收騎士調解款250萬；母親部分超過騎士內部分擔額之 663,699 使其他連帶債務人同免責任 → 172,602 → preserved ("這樣算下來" replaces 再…才得出; no arithmetic added).
- 餘額非全部損失、非父母總獲賠額 → preserved.

P16 (結語, 5121 理由三㈠至㈡; 一審 事實欄二)
- 刑責界線在具體因果流程；靜止車輛可持續占用空間但違停本身不足證明犯罪 → preserved.
- 兩個問句（拿掉障礙公車能否進站；可預見通行危險是否延續到碰撞與死亡） → preserved verbatim.
- 不能排除合理懷疑時，不得僅憑違停與事故並存課以過失致死責任 → preserved (僅憑 → 只因為). Both citations same.

Additions check: no new facts, examples, numbers, cases, first-person, promises or sales lines. Nothing added.

Citations: all 15 distinct URLs of the original are present in the draft (guard URL check PASS). Three citations (P7, P8, P9 first sentence) are now text-only pointers to the 109台上5121 judgment linked in P6 ("同判決" / "同一判決"); the referent is unambiguous because P6–P9 discuss only that judgment until the 1289 裁定 is introduced with its own link. Every 理由/事實欄 pinpoint of the original survives.

## Blocking issues

None.

## MONOTONY (rule §5 self-check, re-verified by reviewer)

1. Tool: OK, no FAIL.
2. Opener: scene/date opener, not 假設/例如 formula. OK.
3. Very short sentences ≥2: "後座乘客死亡。" "分歧就在這裡。" "高院沒有直接接受。" No run of long sentences (run3 0.036). OK.
4. Paragraph first words: 2017年 / 現行的 / 兩審 / 高院 / 澎湖 / 現場 / 停靠區 / 騎士 / 最高法院 / 2018年 / 計程車 / 賠償 / 依民法 / 該判決 / 母親 / 回到. No word three times. OK.
5. No three consecutive "claim (statute) → 但" paragraphs; P7 and P8 carry no link. OK.
6. 不是…也不是 contrast: 1 (P15, carried from original). The many "並非 / 不能推成 / 不等於" sentences are legal qualifiers from the original that must be preserved; none added. OK.
7. Last paragraph ends on the case's own questions and the 合理懷疑 standard; no copied disclaimer or contact block (house format of this column has none). OK.
8. zh-hant Taiwan register throughout (進不去 / 容不下 / 就算 / 扣掉 / 這樣算下來); no bold, no emoji, no headings, no first person. OK.
9. No article number, date, amount, link or label lost (table above). OK.

Unmet items: 0. Native reading: citation blocks no longer end every paragraph; sentence length now varies; the two 一審/高院 paragraphs and the 刑法276 paragraph read like a practitioner summarising a file rather than a template. Residual tell: the high density of "this does not mean…" qualifiers, but every one is a legal point in the original and the brief forbids dropping them.

## Not padded

2893 → 2811 characters (97%). Cuts: the P7 preview sentence, "本案一、二審正是…" framing, "到了賠償問題…" framing, redundant 其 / 已 / 曾 / 則. No legal point removed.

## Tests verdict

tests.patch: OK (after re-anchoring, see below). The only test touching this column is a whole-body byte lock: it reverts two approved edits (AI author line, image block) and compares the sha256 of the reconstructed manuscript with a pinned value. The only possible re-anchor to new wording is a new hash, which is what the patch does. Verified independently:
- Reconstruction of orig.md → 56019b0d… = the currently pinned value (method matches the test).
- Reconstruction of the rewriter's draft → 19948d8b… = the value in the rewriter's patch.
- Reconstruction of the draft after my edit → 13b7663e…; tests.patch updated to this value.
No it()/test() added or removed, no .skip/.only, no other column's entry touched; the test still asserts heroAlt, heroCaption, author field and absence of AI-author line / bold. vitest-1.log: 78 files, 1371 tests passed with the rewriter's version of the patch. Note for the publisher: the final patch now carries the post-edit hash; apply the draft and the patch together.

## Tiny edits applied by reviewer

1. P11: "原有業務過失致死的獨立規定，也在這次刪除。" → "原有業務過失致死的獨立規定，在這次修正中刪除。" (unnatural 也…刪除 clause; meaning unchanged: the separate business-negligence provision was removed by this amendment). Guard re-run: PASS (length 2811, 97%). Variety re-run: OK.
2. tests.patch: sourceManuscriptSha256 for article 121 changed 19948d8b… → 13b7663e… to match edit 1 (verified by recomputation as above).

## Original issues (not blocking)

- P9: "那是針對再審聲請遭否准而提起的。" is a slightly colloquial stand-alone sentence; understandable, left as is.
- P2 "一張違停罰單" and the 第111條第1項第2款 text were carried from the original; rewriter did not re-verify against the current statute text (notes.md item 3). Within the original's 資料查核日 statement; not introduced by the rewrite.
- P15 arithmetic (836,301 − 663,699 = 172,602) is consistent but, as in the original, the subtraction is not spelled out.
- Citations in P7/P8/P9 are text pointers ("同判決") rather than hyperlinks; the linked judgment is in the immediately preceding paragraph. Acceptable, flagged for awareness only.
