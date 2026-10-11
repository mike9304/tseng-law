# FINAL REVIEW r1 — ja-019 taiwanese-spouse-divorce-agreement-registration

Reviewer: Claude Fable 5.1 (final gate). Date: 2026-10-12.

## Verdict

PASS. The rewrite preserves every legal statement, condition, qualifier, article number, deadline, link, contact line and disclaimer of the published original. Front matter differs only in lastmod. Guard PASS, variety checker 0 FAIL, all nine self-check items of SENTENCE-VARIETY-RULE section 5 met. tests.patch only re-anchors the lastmod expectation. No tiny edits applied.

## Scope checked

- orig.md vs draft.md, read in full, sentence by sentence.
- guard.txt and a fresh run of guard.py (orig → draft, ja, --today 2026-10-12): GUARD: PASS, length 1362 → 1273 (93%), cv 0.316 → 0.451, short 0.021 → 0.137, cite_end 0.021 → 0.0, contrast 0 → 0.
- variety_metrics.py check --lang ja: sentences=51 mean=39.0 cv=0.451 short=0.137 run3=0.102 opener_rep=0.0 cite_end=0.0 cite_para=0.133 contrast=0 caveat=1 q=0. One WARN only (86% です・ます endings; this is the required register, original was 89%). No FAIL.
- notes.md, tests.patch, tests.txt, claude-tests1.log.
- SENTENCE-VARIETY-RULE.md sections 2, 5, 6; COLUMN-VOICE-RULE.md; LESSONS.md top items.

## Front matter

Identical to the original except lastmod "2026-09-28" → "2026-10-12". title, seoTitle, summary, date_display (2026年9月28日), read_time (約5分), categories, featured_image, both FAQ entries (第1050条 / three requirements / 準拠法; 戸政事務所の承認 + 書面による委任 + "日本に住んでいるというだけで承認されるわけではありません"), audience, author unchanged. H1 identical. No image lines in body in either version.

## Claim-by-claim fact table

### Opening (orig l.22–24 → draft l.22–24)

| Original point | Rewrite | Status |
|---|---|---|
| Reader's quoted question (署名して送ればよいのでしょうか) | l.22, identical quote | preserved |
| 台湾民法の協議離婚は署名だけでは成立しない | l.22 "足りません。" + l.38 "三つがそろうまで、離婚は成立しません。" | preserved (consolidated; also in FAQ) |
| 証人の署名と離婚登記まで済ませてはじめて効力 | l.22 | preserved |
| 合意書の中身の理解と登記までの段取りを並行して考える | l.22 | preserved |
| Illustration: 口頭では支払額、書面に「今後、請求しない」条項 — hypothetical (例えば…とします) | l.24, scene + （仮の例です） label | preserved; hypothetical label kept in a different form, no new fact |
| 離婚への同意と個々の請求の放棄は同じではない | l.24 identical | preserved |
| 帰国日が迫っていても、何を約束する書面か読み取ってから署名 | l.24 identical | preserved |

### 「今後請求しない」は、どの請求を指すのか (orig l.28–34 → draft l.28–34)

| Original point | Rewrite | Status |
|---|---|---|
| 合意書に財産・借入れ・住居・子どもの生活の取り決めが書かれることがある | l.28 | preserved |
| 放棄条項のポイント: 放棄の範囲 + 資料がそろっていない財産の扱い | l.28 | preserved |
| 夫婦間で借入れ負担を決めても第三者(銀行)への責任が変わるかは別途検討 | l.28 | preserved |
| 支払額しか決めないと送金時に通貨・期日・手数料負担で食い違い | l.30 (split into two sentences) | preserved |
| 振込先まで書けばいつ何を支払うかが双方にはっきり | l.30 | preserved |
| 退去日と荷物引取日は同じとは限らない | l.30 | preserved |
| 名義変更への協力内容を書面に残す | l.30 | preserved |
| 子ども: どちらの親と暮らすか、離れて暮らす親との連絡・面会の定めを確認 | l.32 identical | preserved |
| 養育費・学校・医療の判断が日々の生活で守れる内容か | l.32, now a question to the reader; scope (養育費・学校・医療) unchanged | preserved |
| 条項の効力は準拠法（定義付き）や既出の裁判所の決定に照らして判断 | l.32 identical | preserved |
| 配偶者の説明と中国語文面が食い違えば署名前に直し方を話し合う | l.34 (question + てください) | preserved |
| 日中併記: 内容一致の確認 + 食い違い時の優先言語の定めの確認 | l.34 | preserved |

### 合意書への署名だけでは終わらない手続き (orig l.38–42 → draft l.38–42)

| Original point | Rewrite | Status |
|---|---|---|
| 法務部の民法原文 link (mojlaw … lawNumber=1049 …) | l.38, same URL | preserved |
| 第1050条: 書面、2人以上の証人の署名、戸政機関での離婚登記 | l.38 identical | preserved, article attached to the same claim |
| 夫婦が署名した段階では離婚は成立していない | l.38 "三つがそろうまで、離婚は成立しません。" | preserved |
| 証人は名前を貸すだけの存在ではない | l.40 "名前だけの証人では務まりません。" | preserved |
| 内政部 離婚協議書参考書式・注記 link (ris.gov.tw …pdf) | l.40 same URL | preserved |
| 証人は完全な行為能力 + 夫婦双方の離婚の真意を自ら見聞きして確かめた人 | l.40 identical | preserved |
| 確認の方法と署名の日程をあらかじめ決める必要 | l.40 | preserved |
| 準拠法は配偶者が台湾人という理由だけでは決まらない | l.42 ("そもそも" dropped) | preserved |
| 判断要素: 夫婦それぞれの国籍・住所・生活の拠点 | l.42 identical | preserved |
| 婚姻の届出先、進行中の裁判の有無も手続きを見極める材料 | l.42 ("あわせて整理しておきましょう" dropped, filler only) | preserved |
| Internal link /ja/columns/taiwan-divorce-lawsuit-qna | l.42 same | preserved |

### 日本に戻ってから離婚登記ができるか (orig l.46–50 → draft l.46–52)

| Original point | Rewrite | Status |
|---|---|---|
| 内政部戸政司 離婚登記の案内 link (ris.gov.tw …384.html) | l.46 same URL | preserved |
| 協議離婚の登記は夫婦双方が本人で申請するのが原則 | l.46 identical | preserved (原則 kept) |
| 正当な理由 AND 戸政事務所の承認 → 書面委任で代理申請可 | l.46 "正当な理由があり、…承認を受ければ、書面による委任で代理人に申請してもらえます" | preserved (both conditions, same AND) |
| 戸政事務所 = 日本の市区町村の戸籍窓口に相当 | l.46 | preserved |
| 日本に住んでいるというだけでは承認されない | l.46 | preserved |
| 日本で署名する予定なら担当戸政事務所に申請方法を伝え必要書類を確認 | l.48 | preserved |
| 原本と中国語訳に必要な認証は台北駐日経済文化代表処（定義付き）にも問い合わせ（とよいでしょう, advice level) | l.48, moved after the next item | preserved, same advice strength |
| 同じ案内に国外作成文書の認証 + 外国語文書に添える認証済み中国語訳の定め | l.48 "離婚登記の案内には…" (same linked 案内) | preserved |
| 日本で成立済みの離婚を台湾で登記する場合は手続きが異なる | l.50 | preserved |
| 台湾で登記を終えても日本の戸籍への届出は自動では済まない | l.50 | preserved |
| 台湾の方式で成立 → 成立の日から3か月以内 → 離婚を証する書面 + 日本語訳 → 本籍地などの市区町村 (戸籍法第41条) | l.52 "戸籍法第41条によると、…成立の日から3か月以内に、…" | preserved: deadline, starting point, documents, recipient, article all intact; article moved to sentence head |
| 添付書類・具体的な扱いは事前に本籍地の市区町村や法務局に確認 | l.52 identical | preserved |
| "日本側にも期限があります。" | l.52, new lead-in sentence | framing of the existing 41条 deadline only; no new fact |

### 相談先 + signature (orig l.54–56 → draft l.56–58)

| Original point | Rewrite | Status |
|---|---|---|
| 初回連絡で伝える事項: 夫婦の国籍と居住地、婚姻の届出先、合意済みの内容 | l.56 identical | preserved |
| 子ども・帰国日が決まっている場合はその状況も | l.56 identical | preserved |
| 希望言語・相談範囲・費用は連絡の際に確認 | l.56 | preserved |
| 詳しい資料は利益相反確認後、事務所が案内する方法で | l.56 (split into two sentences) | preserved |
| メール wei@hoveringlaw.com.tw, 台北所在地 103 臺北市大同區承德路一段35號7樓之2, 広告責任弁護士：曾雋崴 | l.58 identical | preserved |
| 2026年9月27日時点の資料を参照 | l.58 identical | preserved |
| Disclaimer: 個別の準拠法・書面の効力・手続きの結果は実際の資料に基づいて判断 | l.58 ("する必要があります" → "することになります") | preserved, same content |

Nothing added: no new facts, cases, numbers, first-person stories, promises or sales lines. The only non-original text is the hypothetical label （仮の例です）, replacing the 例えば…とします marker, and the lead-in "日本側にも期限があります。" which introduces the existing 戸籍法第41条 point.

## Blocking issues

None.

## MONOTONY items (rule section 5, each checked)

1. Tool: 0 FAIL (WARN on です・ます share only; register is mandatory). Met.
2. Opening: quoted reader question, then a two-word answer; no 例えば…とします formula. Met.
3. Very short sentences: 「足りません。」「通貨、期日、手数料の負担です。」「日本側にも期限があります。」「方法はご案内します。」 Long sentences do not stack; the one long opener is followed by a short scene. Met.
4. Paragraph openers read vertically: 「離婚／口頭／合意書／金銭／子ども／中国語／法務部／名前／準拠法／内政部／署名／既に／日本側／昊鼎／メール. No repeat. Met.
5. No three consecutive claim→caveat paragraphs; several paragraphs carry no citation (scene, money, residence, children, bilingual text). Met.
6. Contrast templates: 「同じではありません」 once, plus 「とは限りません」 and 「手続きが異なります」 at most. Within 3. The rebutted claim is the one the reader actually asked. Met.
7. Last body paragraph: contact section is the house structural tail; the disclaimer names this column's own three items (準拠法・書面の効力・手続きの結果) rather than a generic formula. Met.
8. です・ます throughout, no bold, no emoji, no imperative or checklist headings (all three H2 and the H3 unchanged from the original). Met.
9. No article number, deadline, amount, link or hypothetical label lost. Met.

Native-reader notes (non-blocking): 「足りません。」 as a bare reply to the quoted question is abrupt but idiomatic. 「それでは足りません。」 was considered and not applied, because the current cv is 0.451 against a 0.45 floor and the sentence is acceptable as written. The reordered authentication paragraph (案内の定め → 代表処への問い合わせ) reads more logically than the original.

## Padding check

1362 → 1273 characters (93%). Cuts: the duplicated "署名だけでは成立しない" conclusion (kept once in the body and in the FAQ), the filler 「そもそも」 and 「あわせて整理しておきましょう」, and the two-clause contact wording. No legal point removed.

## Tests verdict

PASS. tests.patch touches only src/lib/__tests__/divorce-columns-20260927.test.ts: adds a REWRITTEN_20261012 set containing only ja/taiwanese-spouse-divorce-agreement-registration and gives it precedence in the sitemap lastModified expectation (2026-10-12), falling through to the existing 2026-10-06 / 2026-09-27 / 2026-09-28 cases unchanged. No assertion removed or loosened, no .skip/.only, no other column's expectation changed; it() count +0 −0. tests.txt records vitest PASS (78 test files) after one sync round.

## Tiny edits applied

None.

## Original issues (not blocking)

- The 法務部 link carries lawNumber=1049 while the text and FAQ cite 第1050条. The rewriter flagged this too. It may be the MOJ print view's paging parameter; worth opening the link once to confirm it lands on or includes 第1050条. Unchanged from the published page.
- 戸籍法第41条 primarily names the Japanese consular post abroad as the recipient of the certificate copy within three months; the column says 「本籍地などの市区町村」. In Taiwan, where there is no Japanese embassy, the route in practice runs through 日本台湾交流協会 or the home municipality, so 「など」 covers it, but a future fact pass could name the route. Unchanged from the published page.
- House-format lint tolerated by the guard: office address in the body and last H2 not a sources section. Both pre-existing.
