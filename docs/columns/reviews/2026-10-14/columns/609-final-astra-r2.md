# C4 final review — round 2

Verdict: FIX. Publication is not approved. The main statutory explanations have been corrected, but the English summary misstates what Article 180 prohibits, some legal-claim paragraphs still lack adjacent citations, and substantial native-prose/repetition problems remain. Image: OK.

Review date: 2026-10-14. Independent final review. No column edits applied. All changes identified below are required unless expressly described as an internal-document follow-up.

## Scope checked

Read in full: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C4.md`, all four `drafts/C4/{ko,ja,en,zh-hant}.md` files including frontmatter and FAQs, `drafts/C4/facts.md`, and `research/C4-statutes.md`. Read the shared `SENTENCE-VARIETY-RULE.md`, including sections 5–6, and skimmed all recurring categories in `LESSONS.md`. Read the legacy operating skill and the 0930 voice-rule pointer. The old `~/agent-library/knowledge/editorial-voice.md` path does not exist here; read the complete supplied voice brief and the repository's `docs/columns/EDITORIAL-VOICE.md` instead. The latest user instruction gives this reviewer final authority without a Fable gate.

The writer's fact sheet was not accepted as verification. Independently opened the following official pages with the web tool and fetched each with curl; also fetched the full-law page with curl:

- [Civil Code Article 179](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=179)
- [Civil Code Article 180](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=180)
- [Civil Code Article 181](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=181)
- [Civil Code Article 182](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=182)
- [Civil Code full text and amendment header](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000001)

Saved HTML, extracted single-article text, reviewed draft snapshots, hashes, and actual checker outputs are in `reviews/C4/source-check-astra-r2/`. All four curl article requests and the full-law request succeeded. The research transcription matches the official article text. The full-law amendment header is 民國115年08月17日, equivalent to 2026-08-17. The pending-effect notices concern Articles 166-1 and 1223, not Articles 179–182. No draft incorrectly assigns that whole-law amendment/effective date to the provisions discussed.

No judgment is cited, so no judgment `.txt` is applicable. The only external authorities cited in the columns are these four statute pages. There are no numerical calculations, monetary examples, interest rates, limitation periods, procedural deadlines, or foreign-law holdings to validate. The body check date and final sources check date are 2026-10-14 in every language.

Checked matching-language internal-link files in the repository used by lint: column 251, `taiwan-small-claims-simplified-civil-procedure`, exists in all four languages; column 264, `taiwan-certified-letter-cunzheng-xinhan-vs-japanese-naiyo-shomei`, exists in JA, the only language linking it. No link points to this batch. Compared available batch openings and the openings/subheads/endings of the three latest preceding dated columns, 522–524, in each language. C6 EN/ZH was not available at the comparison point; this is not certification of the eventual complete batch's opening distribution.

Viewed `images/C4.webp` using the image viewing tool. Finally consulted round 1 to check disposition of its findings, after the independent reading and source checks.

## 1. Law and facts

### L1 — MAJOR, EN summary: the payments themselves are described as barred

Original, `en.md:4`: “Four payments are barred, and knowledge can change the sum.”

→ Problem & reason: The grammatical subject of “are barred” is the payments. Article 180 bars demanding their return in the listed circumstances; it does not prohibit making those payments. This is a legal-scope error in public metadata, even though the body correctly explains the recovery bar. The very compressed wording also makes four categories sound like four individual transactions. The official Article 180 begins “給付，有左列情形之一者，不得請求返還”.

→ Fix required, not applied: Specify that the restriction concerns recovery. One complete 158-character alternative is: “Taiwan law may require return of a mistaken transfer. Four payment categories limit recovery; knowledge and the remaining benefit affect the recipient's duty.” Keep the summary within 150–160 characters and retain the detailed recipient-only exception in the body and FAQ.

→ Facts preserved: Conditional recovery, four Article 180 categories, the distinction between making a payment and reclaiming it, and knowledge/remaining-benefit conditions. No amount, rate, deadline, or new entitlement is introduced.

### Main legal explanations — verified in each language

| Point | KO | JA | EN | ZH-HANT |
|---|---|---|---|---|
| Article 179: benefit, corresponding loss, no legal cause; cause that later disappears | Retained | Retained | Retained | Retained |
| Article 180: all four categories; knowledge when paying under item 3; recipient-only exception under item 4 | Retained | Retained | Body retained; summary L1 | Retained |
| Article 181: original benefit, further acquisition from it, value if return is impossible | Correct | Correct | Correct | Correct |
| Article 182(1): lack of knowledge AND disappearance of benefit; both return/value duties affected | Correct | Correct | Correct | Correct |
| Article 182(2): knowledge at receipt versus later knowledge, corresponding benefit, interest and loss | Correct | Correct | Correct | Correct |
| Bank contact: practical request, no reversal/disclosure entitlement attributed to these articles | Correctly limited | Correctly limited | Correctly limited | Correctly limited |

No substantive contradiction among the four bodies was found in those rules. “Spent the money” is not treated as sufficient by itself for exemption. The literal observation that Article 182 does not supply an interest rate or expressly designate the transfer date is not treated here as a claim that Taiwan law has no interest rules. During revision, keep that observation expressly limited to the cited article; do not turn it into a general denial of interest.

The round-1 legal findings are resolved in the published text: the recipient discussion now distinguishes receipt from the later location of cash; the English closing leaves benefit/knowledge questions open; Article 181 is no longer described as a rule that reduces the return. The example-specific mapping of the credited sum is read as application within the explicitly invented scenario, not proof that account name alone determines every real debtor. Its later qualifications should remain. No new adjudicated outcome is asserted.

### I1 — internal fact sheet is stale; not a separate publication blocker

Original, `facts.md:27`: “볼 것은 이익이 누구에게 남았는지이고”; `facts.md:41`: “제181조·제182조가 범위를 줄이면 액이 달라진다.”

→ Problem & reason: These retain the two formulations corrected in the columns after round 1. The first conflates debtor identification with the later location of the benefit; the second attributes a reduction function to Article 181. They should not be used to reintroduce those errors.

→ Fix required in the internal fact sheet, not applied: Match the revised distinction between the Article 179 recipient and Article 182 timing/remaining-benefit questions, and describe Article 181 as defining benefit/further gain/value rather than as a reduction rule.

→ Facts preserved: The corrected four-language text and the actual functions of Articles 179, 181 and 182. No claim that these obsolete sentences still appear in the column bodies.

## 2. Citations

### C1 — MAJOR batch-rule failure, all languages: remaining legal paragraphs lack adjacent links

Original locations and examples:

- KO 46/48: “도덕상 의무를 이행하는 지급이 첫째입니다.” / “넷째는 불법한 원인으로 한 지급이고, 그 원인이 받은 사람 쪽에만 있으면 이 제한은 적용되지 않습니다.” Neither paragraph has a link.
- JA 48/50: “道徳上の義務を履行するための給付が第一号です。” / “第四号は、不法な原因による給付で、その原因が受領人の側にだけあるときは、この制限は適用されません。” Neither paragraph has a link.
- EN 53/55: “Item 2 is a debtor paying, in order to discharge it, a debt that has not yet matured.” / “The bar does not apply when that unlawful cause exists only on the recipient's side.” These explanatory paragraphs after the table have no link.
- ZH 46/48: “第一款是履行道德上義務的給付。” / “第四款是因不法原因而為給付；不法原因只存在於受領人一方時，這個限制不適用。” Neither paragraph has a link.
- The separate Article 182 mini-paragraphs also make legal assertions without local links: KO 60/62 “몰랐다는 사정만으로 면책이 되지는 않습니다.” / “썼다는 사정만으로 책임이 없어지지는 않습니다.”; JA 62/64; EN 67/69; ZH 60/62 have the same omissions.

→ Problem & reason: These claims are substantively supported by the official text, but the hard rule requires an inline source directly with the claim. The section's opening link or a source-list entry does not supply an adjacent citation to these later, separate explanations. Many round-1 gaps were fixed, including the Article 182(2) and bank paragraphs; the remaining gaps still prevent publication under the same rule. A link integrated into an article-as-subject sentence is acceptable and is not the objection.

→ Fix required, not applied: Attach the Article 180 single-article link to the grouped exclusion statements, and the Article 182 link to the two-condition statements, or combine closely related sentences into coherently sourced paragraphs. Keep the scene/evidence paragraphs citation-free where they make no legal assertion. Preserve all links already present. Do not mechanically append the same parenthesis to every sentence.

→ Facts preserved: Four categories, item 4's recipient-only exception, the cumulative Article 182(1) conditions, official article targets and the check date. These are citation changes, outside the reviewer's minor-wording permission.

All existing statute targets point to the correct article. Final official-source lists include all four external authorities, with the correct date. Matching-language internal links pass the existence checks.

## 3. Rules and format

All four exact lint commands succeeded with exit 0; command arrays and output are saved in `source-check-astra-r2/check-results.json`.

| Language | Body length | Lint | Reading time |
|---|---:|---|---|
| KO | 2,820 characters | OK | 7분 분량 |
| JA | 3,241 characters | OK | 約8分 |
| EN | 1,512 words | OK | 8 min read |
| ZH-HANT | 2,346 characters | OK | 約6分鐘閱讀 |

Frontmatter keys, publication/lastmod/display dates, topic `litigation`, correct categories, single-language audience, `legal-ai-assistant`, three FAQs, title/H1 equality, and literal NNN image paths comply. English title is 56 characters, therefore needs its distinct 36-character seoTitle; the current summary is 157 characters and meets format limits despite L1's meaning error. Other seoTitles are distinct from their titles. Reading times are plausible.

No private-party names, actual account identifiers, bold, phone/hotline numbers, LINE/Kakao IDs, street addresses, attorney bylines, lawyer-review/native-review claims, or fabricated professional first-person experience were found. Each language has one optional firm/email contact paragraph near the end. Hypothetical scenes are labelled. No foreign-law rule is asserted; foreign-court choice-of-law issues are excluded. The topic remains a non-fraud mistaken payment and does not expand into criminal allegations, account-freezing rules, foreign-exchange withdrawals, or Article 183 third-party liability.

## 4. Voice and sentence variety

### V1 — required substantial editorial revision, all languages: repetitive negative commentary and parallel translated structure

Original examples:

- KO 68/70/72: “송금일부터 붙는다는 문장은 이 조에 없습니다.” / “입금 시각을 이자의 기산일로 못 박는 문구는 없습니다.” / “그 날이 곧 인식의 기점이라고 제182조가 정하지는 않습니다.”
- JA 70/72/74: “振込日から付くとは、この条に書いていません。” / “入金時刻を利息の起算日と固定する文言はありません。” / “その日が認識の起点だと、第182条は決めていません。”
- EN 75/77/79: “Interest from the transfer date is not stated in the article.” / “Nothing in the article fixes the transfer time as the day interest starts.” / “Article 182 does not make that day, by itself, the starting point of knowledge.”
- ZH 68/70/72: “條文沒有說利息從匯款日算。” / “入帳時間被訂成利息起算日的句子，條文裡沒有。” / “第182條沒有把到達日寫成起點。”

→ Problem & reason: The first two observations in each language repeat the same absence-of-wording point; the third adds a useful distinction but uses the same editorial refrain. These passages read as a record of what the researcher did not find, repeatedly translated into each language, rather than a concise explanation of the recipient's knowledge and the records to retain. The same sequence recurs throughout the four versions: rule, comment on what the article does not say, then another restatement. Replacing isolated nouns does not repair this multi-paragraph problem. The batch requires native prose and prohibits repetitive templating even when numerical variety checks pass.

→ Fix required, not applied: State the article-specific interest limitation once. Explain the distinct questions of receipt, later knowledge, and evidentiary value of a reply in connected language-specific prose. Preserve the receipt-versus-later-knowledge branches and the warning that a reply date does not conclusively establish knowledge. Retain the check date and all unique qualifications. Do not fill any resulting length gap with repeated negatives, invented bank duties or unsupported legal rules.

→ Facts preserved: Article 182's two knowledge branches, the appropriate benefit in each branch, interest/loss, the limited source coverage, and uncertainty about what the documents prove.

MONOTONY: repeated statute-silence refrain — “Nothing in the article fixes the transfer time as the day interest starts.” and the parallel sentences quoted above — consolidate the duplicated proposition and vary paragraph function through the actual evidence questions, without losing a condition or source. This is an editorial repetition finding; it is not an invented numerical checker FAIL.

### V2 — required language-specific repairs; illustrative exact changes, not applied

These are concrete examples of the broader native-prose problem, not claims of human native-speaker review.

- KO 40, “어느 설명이 재판에서 남을지는 정하지 않습니다.” → “설명이 재판에서 남다” is an unnatural collocation and leaves the subject of “정하지” unclear. → Required: “어느 설명이 재판에서 받아들여질지는 여기서 판단하지 않습니다.” → Facts preserved: no prediction of the court's factual finding.
- KO 86, “확인서는 돈이 들어간 계좌를 남기고, 생활비로 썼다는 답도 함께 보관합니다.” → The sentence makes the confirmation appear to perform the act of storing a reply. → Required: “돈이 들어간 계좌가 적힌 확인서와 생활비로 썼다는 답을 함께 보관합니다.” → Facts preserved: the same two records and the destination account; no stronger evidentiary conclusion.
- JA FAQ 2, “ほかの号に当たれば請求は止まります。” → Unnatural and potentially suggestive of a procedural halt instead of the statutory inability to demand return. → Required: “ほかの号に該当する場合も、返還を請求できません。” → Facts preserved: the Article 180 bar, not a new procedural rule.
- JA 34, “名義人に求める返還と、仕入先へまだ払う代金を、条文は一つに束ねていません。” → Literal metaphor about an article bundling debts; the sentence repeats the preceding limitation without helping the reader. → Required: consolidate into the preceding scope explanation instead of retaining “一つに束ねて”. → Facts preserved: the mistaken-payment return question is not a determination of discharge of the supplier contract.
- JA 88, “この振込では、明細が振込先を残し、生活費に使ったという返信も一緒に保管します。” → Same shifting subject as KO: the statement appears to keep the reply. → Required: “振込先が記載された明細と、生活費に使ったという返信を一緒に保管します。” → Facts preserved: both records and the following unresolved factual questions.
- EN 28, “Return of a benefit received without legal cause, where another person suffers a loss, is what Article 179 of the Civil Code requires.” → Heavy nominal inversion delays the actor and duty. → Required: make Article 179 or the person who received the benefit the subject, preserving the corresponding loss and lack of legal cause. → Facts preserved: all Article 179 elements and the adjacent link.
- EN 40, “Who holds the cash now does not replace those times.” → A person is compared with time points; the literal translation obscures the intended distinction between identifying the recipient and measuring the duty. → Required: state those two distinct inquiries directly, retaining receipt/later-knowledge timing and the warning against automatically transferring liability to the relative. → Facts preserved: identity and timing remain separate; no change to either legal test.
- EN 83, “Amount, time of credit, destination account, name on the account, and the words and date of any reply are what later line up, for this mistaken payment, the person who received the benefit and the question of knowledge.” → Grammatically strained, long and abstract; “line up” does not naturally express evaluating identity and knowledge. → Required: explain that keeping those details together helps examine who benefited and when they learned of the error, without claiming that the records settle either issue. → Facts preserved: every listed record/detail and the evidentiary limitation.
- ZH 70, “明細上的入帳時間說明利益何時過去。” → “利益何時過去” is not natural Taiwanese wording for the time funds were credited and can suggest that the benefit ceased to exist. → Required: describe the 入帳時間 directly; keep that time distinct from 知道欠缺法律上原因的時間. → Facts preserved: time of credit versus time of knowledge; no implication of benefit disappearance.
- ZH 82, “這筆匯款進不進得去，看請求的數額和適用條文。” → “進不進得去” lacks a clear object and sounds like a physical destination. → Required: “這筆返還請求是否適用該程序，要看請求金額和適用條文。” → Facts preserved: procedure depends on the claim and governing provisions; no threshold or guaranteed route added.

Titles are specific and not clickbait or checklist commands. KO maintains 합니다체 and JA maintains です・ます. No mainland vocabulary or simplified characters were identified in ZH. Those positive checks do not cure the quoted constructions.

### Measured variety and manual sections 5–6 audit

Every required `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <file>` completed with exit 0.

| Language | Sentences | CV | Very short share | Similar-length runs | Result |
|---|---:|---:|---:|---:|---|
| KO | 88 | 0.452 | 0.114 | 0.105 | 0 FAIL; 99% 니다 ending WARN |
| JA | 97 | 0.451 | 0.144 | 0.084 | 0 FAIL; 97% desu-masu ending WARN |
| EN | 93 | 0.476 | 0.118 | 0.055 | 0 FAIL, no WARN |
| ZH-HANT | 92 | 0.457 | 0.098 | 0.089 | 0 FAIL, no WARN |

Manual results:

1. No stock hypothetical formula at the start. KO/EN open with a specified mistaken-transfer scene; JA opens with the spending/exemption issue; ZH opens with the statutory rule. Hypothetical labels remain intact. Available batch and recent published openings were compared, subject to the C6 availability limit above.
2. Each language has at least two very short sentences: KO “통장에 남아 있습니다.” / “생활비로 나갔습니다.”; JA “通帳に残っています。” / “生活費に回りました。”; EN “The money is still there.” / “No rate appears.”; ZH “利率沒寫。” / “起算日也沒寫。” Do not preserve ambiguity merely to preserve short-sentence counts.
3. The round-1 EN repeated paragraph starters were changed. No remaining three-paragraph occurrence of the same opening word was identified on the current files after rendering link labels.
4. Every language has a citation-free hypothetical/evidence paragraph. The recipient section nevertheless repeats a rule–citation–limitation pattern across its three paragraphs: beneficiary/type of account, family withdrawal/account name, then Article 182/current cash location. This is one unmet manual rhythm item; adding the missing citations in C1 should not perpetuate it.
5. No more-than-three lexical contrast-template count was found. Explaining that spending or a relative's withdrawal does not automatically settle liability addresses the column's actual issue; it is not labelled a straw-man argument merely because it is negative. The mismatched person/time comparison is separately addressed in V2.
6. Each closing returns to the transfer records and unresolved facts. No copied general disclaimer or sales sentence is the final body paragraph. The KO/JA grammatical problem in the closing is recorded in V2 rather than misclassified as a formulaic-closing violation.
7. Registers, no-bold, hypothetical labels and attribution comply. No fact, number, link or hypothetical label was removed: the reviewer made no draft edits.

MONOTONY: self-check 5, repeated claim–statute–limitation paragraph rhythm — “A shop account or a personal account does not, by that label alone, pick the debtor.” / “it does not make the named account holder liable in every case.” / “Who holds the cash now does not replace those times.” — reorganize the three successive recipient paragraphs so that one establishes the test and the others apply it or identify the records needed. The equivalent KO 36–40, JA 38–42 and ZH 36–40 require the same review, in native prose.

Only one distinct manual threshold item is recorded as unmet; there is no numerical FAIL. Thus this log does not claim that the two-item automatic MONOTONY rejection threshold was reached. L1, C1 and the independent batch native-prose/repetitive-templating requirement are the publication blockers.

First-two-paragraph deletion test: KO's scene supplies destination error, absence of debt/contract, hypothetical status and reply; its next paragraph adds Article 179's two branches, while its repeated classification and comments on what the statute does not list can be consolidated. JA's opening supplies the spending/exemption issue and the second paragraph supplies the invented transaction and reply; preserve that information. EN's scene similarly adds real explanatory premises, while the second paragraph needs the active construction in V2 and less commentary on the research process. ZH's first paragraph gives the legal rule and check date; “條文沒有把事由列成清單” adds no useful condition and can be removed during consolidation. The next paragraph supplies the invented transfer facts. Preserve all unique premises, labels, statutory conditions and the check date during those edits. Comparison with columns 522–524 does not justify copying their contact/disclaimer endings.

## 5. Image verdict

Image: OK. Viewed the 1280 × 720 WebP. Two plain ceramic bowls, one containing unmarked gold-colored discs and the other empty, plus a loose disc, provide an abstract transfer/value illustration. No faces, people, text, logos, flags, readable documents or identifying details are visible. The fictional still life is respectful and relevant; it does not purport to document an actual bank transaction. No redo required.

## Minor edits applied and final state

Minor edits applied: none. Major issues were not silently rewritten. The four column files remain byte-for-byte as reviewed. The writer must correct L1 and C1, complete the focused native-prose revision, then rerun lint and variety for every changed language. An editorial revision must retain the verified legal core and should not restore the stale fact-sheet formulations.

Reviewed SHA-256:

- KO: `44cd20b486dbb1e0f2c1b4d36dc48aeea527e6705204638d802c11b427c64638`
- JA: `44da4f31fa6b89558f530813d1f07a8da43638a38ae3d55c13943daa798e502f`
- EN: `0d7e80be251d76067f4263acd53fa4cb8ac55b411c866bdb72f43177535468aa`
- ZH-HANT: `34676bbf8bc281ae8b0290892e98278a7a64e0bc4332606c32823f3ddb61689b`

VERDICT: FIX      (major issues remain; listed in the log)
