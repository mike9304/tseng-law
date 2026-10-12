# FINAL REVIEW r1 — ja-021 taiwanese-spouse-divorce-cross-border-parenting (Claude Fable 5.1, 2026-10-12)

## Verdict

PASS. The rewrite keeps every legal statement, qualifier, article number, link, hypothetical label, prohibition and contact item of the published original, adds no new fact, is 1% shorter, and no longer trips the variety checker. No edits were needed.

## Scope checked

- orig.md vs draft.md: full line diff (`diff orig.md draft.md`) plus claim-by-claim reading of every paragraph.
- guard.txt and a fresh run of guard.py (`--today 2026-10-12`): GUARD: PASS, length 1158 -> 1152 (99%), monotony 24.5 -> 8.4. Pre-existing lint notes (street address, no sources section, no check date) are the house format of the original and were not introduced by the rewrite.
- variety_metrics.py check --lang ja on draft: sentences=53 cv=0.484 short=0.226 run3=0.039 opener_rep=0.059 cite_end=0.0 contrast=0 q=1, no FAIL, one WARN (87% です・ます endings; original 91%, inherent to the register). Original scored FAIL on len_cv (0.291) and short_share (0.022).
- notes.md: all twelve points cross-checked against the diff; the two wording shifts the rewriter flagged (それだけで dropped; 明確にします -> 決めておきます) are confirmed meaning-preserving.
- tests.patch (non-empty, 1178 bytes) against the pinned test in the worker worktree; vitest-1.log: 78 files / 1036 tests passed after the patch.
- Rules: SENTENCE-VARIETY-RULE sections 5-6, COLUMN-VOICE-RULE, LESSONS.md skimmed. No bold, no emoji, no imperative/checklist headings (grep for `**`, `<b>`, `<strong>`, `__`: 0 hits).

## Front matter, H1, images

Diff of lines 1-19: only line 4 changes (lastmod "2026-09-27" -> "2026-10-12"). title, summary, date_display, read_time (約4分, length 99%), categories, featured_image, both FAQ entries, audience, author identical. H1 identical. The body has no image lines in either version. The three section headings (## 日々の世話と、居住地を決める権限 / ## これまでの養育を、次の生活につなげる / ## 会うための段取りと、支払うお金の目的 / ### 家族関係の相談) are verbatim.

## Claim-by-claim fact table

### Opening (orig L21-23 -> draft L21-23)

| Original point | Rewrite | Status |
|---|---|---|
| Divorce agreed, but whether the child may go to Japan not yet discussed -> confirm who can decide the child's residence before fixing housing/flights | L21 sentence 2 (条件 "まだ話せていないなら" + same instruction) | preserved |
| Consent to divorce alone does not settle an overseas move | L21 sentence 1 (moved to the front, "決まったことにはなりません") | preserved |
| Hypothetical: living at parents' home in Japan, childcare before school starts undecided | L23 "…未定という場合を例にします" (label kept, formula opener removed) | preserved |
| Family who can help exists, but care during their working hours must also be planned | L23 "支援を頼める家族はいるでしょうか。その家族が仕事をしている時間の世話も…" (question form; "も" keeps the "in addition" sense) | preserved (practical point, not a legal claim) |
| Concrete daily care makes the post-move support easier to explain in negotiation and in the court plan | L23 last sentence | preserved |

### Section 1: 日々の世話と、居住地を決める権限 (orig L27-31 -> draft L27-33)

| Original point | Rewrite | Status |
|---|---|---|
| Fact of sole daily care vs legal authority to decide residence are separate | L27 s1 | preserved |
| Even if one parent holds 親権/監護 authority, that alone does not satisfy all conditions for a cross-border move ("とは限りません") | L27 s2 ("持っていても…とは限りません"; それだけで dropped, concessive carries it) | preserved |
| Read the agreement / court decision for residence, parental rights and duties, travel and relocation restrictions | L27 s3-4 | preserved |
| Needed information: child's nationality and passport, current residence and school, care history | L29 s1 | preserved |
| Which court can hear it and which law governs are examined separately | L29 "どの裁判所で扱えるか。判断はどの法律によるのか。この二つは別々に検討します" | preserved |
| Check what effect existing agreements/judgments have in Japan and Taiwan and whether enforceable | L29 last sentence | preserved |
| Do not unilaterally take the child back before confirming required consents and procedures | L31 s1 (own paragraph) | preserved |
| If there is a safety emergency, consult on protective measures before ordinary relocation prep | L31 s2 ("より先に" = "に先立って") | preserved |
| Related links: 離婚手続Q&A (/ja/columns/taiwan-divorce-lawsuit-qna) and 台湾の相続・子どもに関する解説 (/ja/columns/taiwan-inheritance-custody-analysis) | L33 byte-identical | preserved |

### Section 2: これまでの養育を、次の生活につなげる (orig L35-39 -> draft L37-45)

| Original point | Rewrite | Status |
|---|---|---|
| Qualifier "台湾法が適用される場合" | L37 opening | preserved |
| 民法第1055条 covers who exercises/bears rights and duties toward the minor child and parent-child contact | L37 (article made the subject) | preserved, same article on same claim |
| Court considers the child's best interests under 第1055条の1 | L39 s2 | preserved, same article on same claim |
| Factors: age, health, wishes and development, parents' caregiving ability and attitude, emotional bond, など | L39 s2 (same list, same order) | preserved |
| Income or responsibility for the breakdown alone does not decide | L39 s3 verbatim | preserved |
| Link 法務部の民法原文 (mojlaw URL) holds the criteria | L39 s4, same URL | preserved |
| Reader question "収入が多い親に養育が任されるのでしょうか？" | L39 s1, new sentence | added question only, worded exactly as FAQ q2 in the front matter; no new fact |
| Explaining who handled school runs and medical visits shows the support needed after the move | L41 s1 | preserved |
| Language change -> learning support; under treatment -> handover of medical information | L41 s2-3 (one sentence split in two) | preserved |
| Undecided items (childcare from the opening) -> the court plan explains the preparation and timing for securing them | L41 s4 | preserved |
| All of this is information for judging whether past care can continue after the move | L41 s5 ("どれも" added as a summary word) | preserved |
| Do not make the child reject a parent or coach answers for the dispute | L43 (own paragraph) | preserved |
| The life plan helps the relocation decision but is not itself legal permission | L45 (two sentences) | preserved |

### Section 3: 会うための段取りと、支払うお金の目的 (orig L43-49 -> draft L49-55)

| Original point | Rewrite | Status |
|---|---|---|
| "いつでも会える" alone may not let anyone book flights or leave | L49 s1 verbatim | preserved |
| Fix online call times, holiday visit place and length, handover method -> both sides know what to prepare | L49 s2 (明らかになります -> はっきりします) | preserved |
| If the accompanying adult cannot get leave, travel on the wished date may fail | L49 s3 | preserved |
| Discuss passport timing and who pays flights and accompaniment, to keep visits on schedule | L49 s4 verbatim | preserved |
| Agree contact method for illness/cancellation -> can notify changes and reschedule | L51 s1 | preserved |
| Share school and health information | L51 s2 verbatim | preserved |
| Safety concerns -> adjust method, consider protective measures | L51 s3 verbatim | preserved |
| Cross-border effect and enforceability of such agreements need separate review | L51 s4 | preserved |
| Child support: sort categories (daily life, education, medical), then split monthly payment vs separately negotiated outlays | L53 s1-3 | preserved |
| Fix currency, payment date, who bears remittance fees, to avoid disputes at payment | L53 s4-5 (明確にします -> 決めておきます + purpose sentence) | preserved |
| Lumping marital property settlement with child support blurs what a payment was for | L53 s6 verbatim | preserved |
| A cost list alone does not fix the legal amount; setting/changing the amount and foreign payment/enforcement are judged by the applicable law, family circumstances and existing documents | L55 (two sentences merged with 決まらず) | preserved |

### Contact section (orig L51-55 -> draft L57-61)

| Original point | Rewrite | Status |
|---|---|---|
| Heading ### 家族関係の相談 | verbatim | preserved |
| What to tell the firm: nationalities and residences, child's age and care situation, existing agreements/judgments, travel plans, briefly | L59 s1 verbatim | preserved |
| State preferred language; ask about available languages, scope and fees | L59 s2 verbatim | preserved |
| Detailed materials only after conflict check, by the method the firm indicates | L59 s3-4 ("送るのは利益相反の確認後です。方法は事務所から案内します") | preserved |
| Email, Taipei address, 広告責任弁護士：曾雋崴 | L61 byte-identical | preserved |

Nothing added beyond the FAQ-mirrored question; no new example, number, case, first-person line, promise or sales line. No disclaimer content existed in the original to lose.

## Blocking issues

None.

## MONOTONY items

None blocking. Section 5 self-check against the draft:

1. Tool: FAIL 0 (WARN only, register-inherent).
2. Opener is a fact-first sentence; the 例えば…とします formula is gone, the hypothetical label survives as "…という場合を例にします".
3. Very short sentences present: 日常生活、教育、医療です / 支払時の食い違いを防ぐためです / 見るのは合意書や裁判所の決定です / それ自体は法的な許可になりません. No run of long sentences.
4. Paragraph first words read vertically: 離婚 / 日本 / 一人 / 子ども / 必要 / 制度 / 台湾 / 収入 / 送迎 / 子ども / この / 「いつでも / 病気 / 養育費 / 費用 / 昊鼎 / メール. Max repeat 2.
5. No claim-(article)-ただし chain; most paragraphs carry no citation.
6. Contrast template count 0 (original 1). No rebuttal of an unmade claim.
7. Last body paragraph ends on this column's facts (適用法と家族の事情、既存の文書に即して判断します); contact section is the structural tail the original already had, no stock disclaimer, no sales line.
8. です・ます throughout. The two plain-form question fragments (どの裁判所で扱えるか。判断はどの法律によるのか。) are rhetorical listing, not a だ・である slip; the checker did not flag mixing.
9. No article number, link, label or qualifier lost (see tables).

Native-reader note: the text reads as Japanese prose, not translationese. The full-width space after "でしょうか？" mid-paragraph is standard typesetting. One soft spot, not a defect: "支援を頼める家族はいるでしょうか。その家族が…" asks a question and then presupposes its answer; it is comprehensible and matches the original's practical point, so I left it.

## Padding check

Length 1158 -> 1152 (lint measure, 99%). Cuts were connective words only (そのような場合 / 例えば / に加え / ですが). No legal point removed; the two prohibitions and the "not legal permission" caveat each gained their own paragraph.

## Tests verdict

tests.patch: OK. It touches only src/lib/__tests__/divorce-columns-20260927.test.ts and only the lastmod expectation for this column:

- removes 'ja/taiwanese-spouse-divorce-cross-border-parenting' from UNCHANGED_PASS (which pinned lastmod 2026-09-27) and adds it to REWRITTEN_20261012 (lastmod 2026-10-12), updating the comment to record that date_display stays 2026年9月27日 for 021.
- REDATED_PUBLICATION is untouched, so publicationDate for ja/021 is still asserted as 2026-09-27, matching the unchanged date_display.
- The content assertions (mailto link, 曾雋崴, no phone number, featured image path, FAQ >= 2, content > 800) are unchanged and still pass against the rewrite.
- No .skip/.only/.todo; no other column's expectation changed; +4/-3 lines, 0 it() blocks added or removed. vitest-1.log: 78 files, 1036 tests passed.

## Tiny edits applied

None.

## Original issues (not blocking)

- House-format lint notes carried over unchanged: street address in the contact line, no sources section with a source-check date, last ## heading is not a sources section. Out of scope for a style rewrite.
- The 法務部の民法原文 link carries lawNumber=1049 while the text cites 第1055条 and 第1055条の1; the URL is byte-identical to the published original and was not opened in this review (no network use), so whether it lands on the cited articles is unverified. Flag for a later source pass.
- The description of 第1055条 / 第1055条の1 matches the statute as I know it (court decides on the child's best interests, listing age, health, wishes and personality development, parents' caregiving will and attitude, parent-child emotional ties among others); not re-litigated here.
