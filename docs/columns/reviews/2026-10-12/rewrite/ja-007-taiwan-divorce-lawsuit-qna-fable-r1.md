# Final review r1 — ja-007-taiwan-divorce-lawsuit-qna (reviewer: Claude Fable 5.1, 2026-10-12)

## Verdict

PASS (after one tiny edit by the reviewer, listed below). Publishable as the live replacement at /ja/columns/taiwan-divorce-lawsuit-qna.

## Scope checked

- orig.md (published, lastmod 2026-10-06) vs draft.md (rewrite by Claude Sonnet), read in full, claim by claim.
- guard.txt (GUARD: PASS; re-run after my edit: GUARD: PASS, length 5650 -> 5466, 97%).
- notes.md (rewriter's notes), tests.patch (37,845 bytes, one file: src/lib/__tests__/columns-ja-family-007.test.ts), tests.txt (vitest 84 files / 1108 tests passed after re-anchor).
- SENTENCE-VARIETY-RULE.md sections 5–6, COLUMN-VOICE-RULE.md, LESSONS.md (skimmed).
- variety_metrics.py check draft.md --lang ja: no FAIL (cv 0.488, short 0.105, run3 0.01, cite_end 0.01, contrast 1, q 2; one WARN "95% desu-masu", which is the required register).
- Bold / emoji grep: none.

## Front matter, H1, image

Lines 1–17 byte-identical except `lastmod: "2026-10-06"` -> `"2026-10-12"`. read_time stays 約8分 (body 97% of original, fine). All three FAQ q/a strings identical. H1 and the featured-image line unchanged. OK.

## Claim-by-claim fact table

Legend: P = preserved with same meaning; P* = preserved, wording note; M = moved; E = reviewer edit.

### Intro (orig L23–25 -> draft L23–25)
| Original point | Rewrite | Status |
|---|---|---|
| Divorce needs separate examination of: ending the marriage, 戸籍 cleanup, foreign effect, marital property, damages, post-divorce spousal support, child matters, child support | L23 same list | P |
| Same facts may serve several claims, but requirements/effects/proof/periods differ per right | L23 | P |
| Families spanning two or more countries (e.g. Japan/Taiwan): cannot decide by one nationality or marriage-registration place alone | L25 | P |
| Check first: current base of life, existing court proceedings and registrations, place documents were made, child's residence, location of assets; reduces duplicated procedures and enforcement gaps | L25 | P* ("不必要な" before 手続の重複 dropped; non-legal) |

### Section 1: three routes (orig L27–45 -> draft L27–43)
| Original point | Rewrite | Status |
|---|---|---|
| "At least three routes" lead-in | Heading 離婚の3つの道筋, lead-in dropped | P* (少なくとも lost; framing only, non-blocking) |
| 協議離婚 = 身分行為 effective only when 民法1050 written form + witnesses + 戸政機関 registration all met; signing a private agreement is not completion | L29 | P |
| Divorce by court mediation or settlement: marriage ends when mediation/settlement is established; register in 戸籍 on the basis of the 調書 | L31 | E — draft had dropped 裁判所の; restored (see Tiny edits) |
| 裁判離婚: on 民法1052 grounds, by court judgment; effect follows the finality requirements of that procedure; private agreement insufficient | L33 | P |
| Foreign elements -> check separately: (1) Taiwan court/agency jurisdiction or authority, (2) governing law for divorce / property / children, (3) recognition or effect of foreign status acts or judgments in Taiwan, (4) Taiwan 戸籍 registration and authentication documents, (5) further registration/recognition/enforcement in other countries | L37–43, numbered 1–5 | P ("5点" = count of the listed items, not a new fact) |

### Section 2: 協議離婚 and 戸籍 (orig L47–67 -> draft L45–57)
| Original point | Rewrite | Status |
|---|---|---|
| 民法1050 requires three separate elements | L47 | P |
| Written form mandatory | L47 | P |
| 2 or more witnesses who directly saw/heard and confirmed both parties' true intent; later formal signature by someone who did not confirm intent is insufficient | L47 | P |
| Registration at 戸政機関 is an effectiveness requirement; without it the agreement is not a completed Taiwan 協議離婚 | L47 | P |
| Actual documents (applicant, proxy, ID/戸籍 records, divorce document) per 内政部戸政司 guidance at time of application and the local 戸政事務所 | L49 | P |
| Foreign-made documents may need authentication by Taiwan overseas missions or other competent bodies depending on type and place; when guidance requires, certified/notarised Chinese translation too | L49 | P |
| Link to taiwanese-spouse-divorce-agreement-registration (waiver clauses, proxy application) | L49 | P |
| After final judgment or court mediation/settlement, in principle either party may apply for divorce registration; governed by 戸籍法, distinct from 1050 effectiveness requirements | L53 | P |
| 戸籍法48: general period 30 days from finality date of judgment or establishment date of mediation/settlement | L55 | P (cited in parentheses after 30日; same attachment) |
| Receipt date of judgment/調書 that merely precedes finality/establishment must not be used uniformly as the start date | L55 | P (same odd original logic kept) |
| Late applications accepted; delay does not undo an effective court divorce | L57 | P |
| After written demand with no applicant, 戸政機関 registers ex officio under 戸籍法48条の2 | L57 | P |
| Online application only within statutory period | L57 | P |

### Section 3: mediation, litigation, appearance, appeals (orig L69–87 -> draft L59–75, child paragraph moved to L122)
| Original point | Rewrite | Status |
|---|---|---|
| Family Act cases: mediation first in principle; exceptions by law / case nature / procedural position; no single immutable path | L61 | P |
| Mediation/settlement ends marriage without a merits judgment on 1052 grounds | L63 | P |
| Litigation proceeds when mediation fails or law allows skipping it; judgment effect per service, finality, procedural rules | L63 | P |
| Reader question added before Article 13 | L67 | Taken from FAQ 2; no new fact |
| 家事事件法13 only matters when court orders personal appearance of party or legal representative | L69 | P |
| Without good cause -> 民訴303 applied mutatis mutandis; first fine ≤ 3万台湾元; repeated sanctions after renewed lawful notice; no 拘引 | L69 | P |
| Appearance order ≠ universal rule that both must sit in the same room | L71 | P (reworded without the 普遍的なルール frame) |
| Remote participation, separated proceedings, representatives, safety measures: decided by court on law and facts; neither automatic right nor automatic ban | L71 | P |
| Appeal routes and periods vary by document type, service, finality, procedural position; no single period for all family rulings; check from the actual document | L75 | P |
| Child matters may remain unresolved after divorce; "divorce first, children later" not recommended as a universal shortcut; identify what is legally open, whether agreement/court decision needed, whether provisional protection for safety/residence/contact/support is needed | Moved to child section, L122 | M, P (meaning intact; 家事非訟事件暫時処分辦法 still in sources) |

### Section 4: 裁判離婚 grounds and the proviso (orig L89–120 -> draft L77–104)
| Original point | Rewrite | Status |
|---|---|---|
| 1052(1) ten grounds, numbered 1–10 | L79–90 | P (items 3 and 10 gained a comma only) |
| Ground 7 note: 「有不治之惡疾」 is old statutory disease wording, not a moral judgment, read as medical/legal standard | L87 | P |
| 1052(2) separate from the ten: other serious grounds making the marriage hard to maintain | L92 | P |
| Proviso: if attributable to one spouse, only the other may petition | L92 | P |
| Reader question before the proviso discussion | L94 | Taken from FAQ 3; no new fact |
| Proviso still in the current text as of 2026-10-06 | L96 | P |
| 憲法法廷112年憲判字第4号 did not delete the proviso wholesale; set no automatic-permit or blanket-ban rule for the responsible spouse | L96 | P |
| Unconstitutional range: ignoring the considerable period since the serious ground arose or continued, completely depriving the solely responsible spouse of divorce, where clearly harsh in the individual case | L98 (verbatim core) | P |
| 2-year legislative period elapsed, no deletion; courts decide 1052(2) petitions individually in light of the ruling | L98 | P |
| Ruling does not rewrite the paragraph-1 grounds | L98 | P* ("すべて" dropped; the ruling concerns only the (2) proviso, so meaning is the same or clearer) |
| Missing/absent spouse: three bases — 生死不明3年超 (1項), continuing 悪意の遺棄 (1項), other serious grounds (2項) with proviso + 112憲判4 where fault is at issue | L102 | P (fault sentence now stands alone after the three; still only meaningful for the 2項 proviso) |
| Police missing-person report: useful evidence, not a universal legal prerequisite | L104 | P |
| Prior 同居義務履行請求 not a required prerequisite in all cases | L104 | P ("とは限りません" = "not necessarily in all cases", equivalent) |
| Months of separation alone ≠ automatic ground | L104 | P |
| Court examines: reason for leaving, justified separation, contact and support, continuity, proof of 生死不明, whether the ground under the relevant paragraph is made out | L104 | P |

### Section 5: foreign marriage/divorce (orig L122–124 -> draft L106–112)
| Original point | Rewrite | Status |
|---|---|---|
| Not reducible to one Taiwan procedure; four separate questions (foreign establishment, Taiwan recognition/effect, Taiwan 戸籍 steps, remaining steps abroad) | L108 | P ("4点" = count of listed items) |
| Mainland China / Hong Kong / Macau documents: different verification system from ordinary foreign authentication | L108 | P |
| Links to japan-kyogi-rikon-recognition-taiwan and taiwanese-spouse-divorce-from-abroad | L110 | P |
| Recognition/effect of foreign divorce or judgment ≠ whether 戸政機関 can record a status entry | L112 | P |

### Section 6: property, damages, support (orig L126–128 -> draft L114–116)
| Original point | Rewrite | Status |
|---|---|---|
| 1030条の1 残余財産差額分配, 1056 damages on 裁判離婚, 1057 hardship support for the faultless spouse, child support: different requirements, calculation, periods | L116 | P |
| Link to taiwan-divorce-property-damages-support | L116 | P |

### Section 7: children (orig L130–132 -> draft L118–124)
| Original point | Rewrite | Status |
|---|---|---|
| 1055 and 1055条の1: best interests of the child standard for rights/duties, contact, other child matters | L120 | P |
| 1116条の2: parental support duty continues after divorce | L120 | P |
| (moved paragraph, see Section 3) | L122 | M, P |
| Link to taiwan-divorce-children-custody-support-visitation covering rights, support, contact, cross-border relocation | L124 | P (heading dropped 国境を越えた転居; body sentence keeps it) |

### Section 8: evidence (orig L134–145 -> draft L126–142)
| Original point | Rewrite | Status |
|---|---|---|
| Evidence prepared for authenticity, completeness, provenance, relevance; needs differ by claim, defence, jurisdiction, governing law, recognition, deadline | L128 | P |
| 1 status/戸籍 records, nationality, domicile/habitual residence basis, current addresses; starting point for jurisdiction, service, 戸籍 | L130 | P (list -> paragraphs, same order) |
| 2 court/service documents list; keep originals or certified copies; record service/finality dates | L132 | P |
| 3 foreign documents, authentication status, Chinese translation, completed/pending recognition and registration steps | L134 | P |
| 4 chronology; lawfully obtained communications, medical/police records where they exist; preserve original media and metadata; no unlawfully manufactured evidence | L136 | P |
| 5 each deadline from the correct trigger (finality, mediation/settlement, knowledge of the property difference, service, etc.); no convenient informal dates | L138 | P |
| 6 privacy: secure identifiers, avoid unnecessary disclosure of the child's private life, preserve fragile evidence lawfully and promptly | L140 | P |
| Not recommended: unlawful surveillance, account/device intrusion, tracking, unlawful recording, exposing the child's private life, retaliation, hiding assets, removing the child contrary to agreement or ruling | L142 | P |

### Sections 9–10, disclaimer, signature (orig L147–172 -> draft L144–167)
| Original point | Rewrite | Status |
|---|---|---|
| Sources verified as of 2026年7月25日; re-check before relying | L146 | P |
| Ten source entries, titles and URLs | L148–157 | P (identical) |
| Three related links | L161–163 | P (lead-in sentence dropped; heading 関連資料) |
| Disclaimer: general educational material, not legal advice | L165 | P ("…解説することを目的とした教育資料" -> "…解説する教育資料", same meaning) |
| Signature 曾雋崴弁護士（Wei Tseng） | L167 | P |

Nothing new was added: the two reader questions are lifted from FAQ 2 and FAQ 3 and carry no fact; "5点", "4点", "3つ" count the original's own list items.

## Blocking issues

None remaining. The one qualifier loss I found (court mediation/settlement) was within the tiny-edit allowance and is fixed below.

## MONOTONY items

None. Section 5 self-check: (2) opening is a plain fact statement, not a stock hypothetical; (3) very short sentences present (拘引はできません。/ 私的な合意だけでは足りません。/ 登記は効力発生の要件です。); (4) paragraph openers read vertically show no word three times except statute-as-subject openers (民法第1050条は / 民法第1052条第1項は / 民法第1030条の1の), which is a permitted opener type and not flagged by the tool; (5) no three consecutive claim-statute-ただし paragraphs, many citation-free paragraphs; (6) contrast template count 1, no straw-man rebuttals; (7) last body paragraph ends on this column's own content (the prohibition list), followed only by the structural tail (sources, links, one-sentence disclaimer, signature); (8) です・ます throughout, no bold, no imperative or checklist headings. Remaining plain negatives (同一ではありません, 別の仕組みです, 普遍的な法定前提ではありません) each carry a legal point from the original and are not template contrasts.

Native-reader notes (non-blocking): "すべての家事事件が動かせない一本の道を通る、とは言えません。" has a slightly spoken comma but reads naturally; "数え始めるのは…です" and "まず身分と戸籍の資料です。" are natural. No translationese found.

## Tests verdict

PASS. tests.patch touches only columns-ja-family-007.test.ts. It re-anchors lastmod/date (2026-10-12), the ten headings, intro paragraphs, the evidence-category anchors (numbered list -> paragraph starts, same six categories in the same order), the frozen body/section SHA-256 values and character counts, and every pinned phrase to the new wording. Every legal lock survives with the new wording: 1050 elements, foreign-document authentication, 30日 with 戸籍法第48条 and its trigger, 48条の2 ex officio registration, online-application limit, 家事事件法13 / 民訴303 / 3万台湾元 / 拘引不可, the ten 1052(1) grounds in order, the proviso and 112憲判4 unconstitutional range, missing-spouse rules, foreign-record distinctions, 1030条の1 / 1056 / 1057, 1055 / 1055条の1 / 1116条の2, both split-column links, the evidence section phrases and the prohibition sentence, the disclaimer and author. The only removed assertion is the count of `^\d+\. ` lines in the evidence section, whose numbered structure was intentionally converted to paragraphs. Topic 8 moved from headings[2] to headings[6] matching the paragraph move. No .skip / .only; no other column's assertions touched. vitest: 84 files, 1108 tests passed.

Note: my tiny edit below changes the body, so the pinned SHA-256 and character-count constants in tests.patch will need the pipeline's post-PASS re-anchor (item.sh finish() re-runs guard and tests when draft.md is newer than .tests-ok).

## Tiny edits applied

1. draft.md L31: "調停や和解による離婚は、" -> "裁判所の調停や和解による離婚は、". Restores the original qualifier 裁判所の (orig L33). Without it, a Japanese reader could take 和解 as a private settlement ending the marriage, contradicting the preceding 協議離婚 paragraph. No fact, number, citation or structure changed.

Guard re-run after the edit: GUARD: PASS (length 5650 -> 5466, 97%). variety_metrics check: no FAIL.

## Original issues (not blocking)

1. orig L63 / draft L55: the sentence about the 受領日 of the judgment or 調書 "merely preceding" finality/establishment is logically odd (a receipt date normally cannot precede finality in a way that tempts someone to use it as a start date). The rewriter kept it literally; worth a check against 戸籍法第48条 in a separate fact pass.
2. The sources were verified on 2026年7月25日 while the proviso status is stated as of 2026年10月6日; two different "as of" dates in one column. Kept as in the original.
3. Non-legal wording drops in the rewrite: 少なくとも (at least three routes) and 不必要な (unnecessary duplication). Neither changes a legal statement.
