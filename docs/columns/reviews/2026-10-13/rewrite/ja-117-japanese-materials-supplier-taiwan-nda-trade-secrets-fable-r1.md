# FINAL REVIEW r1 — ja-117 japanese-materials-supplier-taiwan-nda-trade-secrets

Reviewer: Claude Fable 5.1 (final gate). Date: 2026-10-12.
Rewriter: Claude Sonnet (per notes.md).

## Verdict

PASS — publishable as the live replacement. One tiny wording edit applied by the reviewer (listed below); guard re-run PASS.

## Scope checked

- Read in full: orig.md, draft.md, guard.txt, notes.md, tests.patch (32 KB, content diff only), tests.txt, log, meta, vitest-0.log tail.
- Rules read: SENTENCE-VARIETY-RULE.md §5–6, COLUMN-VOICE-RULE.md, LESSONS.md (skimmed).
- Ran: `variety_metrics.py check draft.md --lang ja` (before and after the edit) → 0 FAIL, 1 WARN (91% です・ます endings — within the required register, not a FAIL).
- Ran: `guard.py orig.md draft.md ja japanese-materials-supplier-taiwan-nda-trade-secrets --today 2026-10-12` after the edit → GUARD: PASS (length 5104 → 5075, 99%).
- Script comparison (python3 -I): front matter identical except lastmod; URL set identical (no URL lost, none added); article/number token counts identical except 第7条第1項 appears once in the draft where the original wrote 同条第1項 (same article, same claim); table, contact line, 参考資料 section and italic disclaimer byte-identical; no bold markup.

## Fact table — claim by claim

Legend: P = preserved with same meaning; P* = preserved, wording/position changed; A = added wording only (no new fact).

### Front matter / FAQ
| Original | Rewrite | Status |
|---|---|---|
| title, seoTitle, summary, published, date_display, read_time 約14分, categories, topic, tags, featured_image + alt + caption, 3 FAQ (第2条 three requirements; 專利法第7条第3項 + 營業秘密法第4条; 仲裁法第39条 保全 sequence), audience, author | identical | P |
| lastmod 2026-10-03 | 2026-10-12 | expected change |

### Lead (3 paragraphs)
| Original | Rewrite | Status |
|---|---|---|
| 營業秘密法第2条: secrecy + economic value + owner's reasonable confidentiality measures (link) | L29 sentence 2, same wording, link kept | P |
| NDA with Taiwan customer ≠ settles actual management of who handles which information | L29 sentence 3 「契約書の文言とは別に…実際の管理も問われます」 | P |
| (new first sentence) 「NDAを結んでも、渡した配合表が台湾法上の営業秘密になるとは限りません」 | L29 sentence 1 | A — restates FAQ 1 answer (NDAの締結だけでは決まりません) and §1; not a new legal point |
| JSR release 2026-04-15, checked 2026-10-03; Taiwan subsidiary; 新竹県湖口郷; CMP materials evaluation/process-verification research site; cannot learn NDA/ownership terms from it | L31 | P (「知ることはできません」→「分かりません」) |
| Japanese firms doing similar work must put information protection and outcome ownership into the contract; proposals are general, not any company's contract or dispute; laws = Taiwan provisions checked 2026-10-03 | L33, two sentences merged, all three points present | P* |

### §1 配合表の「社外秘」と、台湾法上の営業秘密
| Original | Rewrite | Status |
|---|---|---|
| 第2条 covers 方法、技術、製造工程、配合 | L37 s1 | P |
| Three requirements, all must be met (not known to persons who normally handle such information; actual or potential economic value from secrecy; reasonable confidentiality measures) | L37 「要件は三つです。…すべて満たさなければなりません」 | P |
| 「未公表」alone insufficient; 開発費 alone insufficient (同条 link) | L37 last two sentences; duplicate 同条 link dropped (第2条 linked in lead and sources) | P* |
| NDA 秘密情報 vs statutory trade secret kept separate; contract wording does not replace the three requirements | L39 | P |
| Narrowing definition to 「営業秘密法で保護される情報」 makes it unclear what was promised for mid-test materials | L39 | P |
| Decide how to identify 配合表、試料、試験条件、分析結果、口頭の調整方法 | L41 | P |
| Marked-documents-only approach needs a way to later fix oral explanations in writing | L41 | P |
| Exclusions (public, lawfully held before receipt, independently developed) with supporting records | L41 | P |
| Legally compelled disclosure distinguished from voluntary third-party provision | L41 | P |

### §2 裁判所が見たのは、誓約書とアクセス制限の組合せ
| Original | Rewrite | Status |
|---|---|---|
| 智慧財產及商業法院112年度民營訴字第1號民事判決, 2024-03-12 (link); company doing materials analysis/QC for electronics; reasonable confidentiality measures recognized | L45 | P |
| Measures listed: employee confidentiality duty, access rights by classification, limits on saving to unauthorized personal devices, account-based viewing by authorized staff only | L45 s2 | P (「具体的に」dropped, list intact) |
| First-instance; claim dismissed because plaintiff failed to prove defendants' infringement | L47 | P |
| Trade-secret finding ≠ finding of who misappropriated | L47 | P |
| Only the published part referenced; finality / later instances not confirmed; cite 理由「貳、四」「五」 (link) | L47 | P |
| Operational suggestion: tie NDA storage to technical-data management; record version + provision date; access/download rights by customer department; review on transfer/end; traceability | L49 (three sentences merged into one example sentence) | P* |
| This is only an operational suggestion based on the judgment; same mechanism does not guarantee the requirement is met | L49 「あくまで運用上の提案です。同じ仕組みを入れれば必ず要件を満たす、という意味ではありません」 | P (「判決を踏まえた」dropped; the paragraph opens with 判決を…, so basis is still stated) |

### §3 商社・分析会社への再提供と、日本本社の利用権限
| Original | Rewrite | Status |
|---|---|---|
| Hypothetical (架空の例) with maker, trading company, Taiwan customer, outside analysis lab | L53 「…が関わります（架空の例です）」 | P — label moved into parenthesis per rule 2-4 |
| NDA only between maker and trading company, no terms for customer → unclear what may be passed for what purpose; same for Japan HQ engineers analyzing returned process data | L53 | P |
| Map contracting party / actual recipient / accessing staff; agree conditions for re-provision to analysis labs and affiliates | L55 | P |
| 營業秘密法第7条 (link): territory, period, content, method left to agreement; licensee may not sublicense without owner's consent | L55 | P |
| Do not treat group-company status alone as including a licence to Japan HQ | L55 | P |
| Distinguish measurements needed for performance evaluation from analysis to infer composition/process | L57 「二つに分けて…」 | P* |
| Blanket analysis ban + spec demanding detailed evaluation → site cannot tell what is allowed; align approved methods, data recipients, sample storage/return across evaluation plan and NDA | L57 | P |
| Residual-information clause caution; test is the wording (does it allow reuse of memorised formulation/process conditions), not the clause name; same restriction must bind the Japanese side as recipient | L59 | P |

### §4 開発費を払う会社と、発明の権利者
| Original | Rewrite | Status |
|---|---|---|
| 專利法第7条第3項 (link): commissioned R&D, application right + patent right per contract; absent agreement → inventor etc.; funder may practise | L63 | P |
| Paying development cost alone does not let the customer monopolize | L63 | P |
| Also check researcher → company ownership. 第7条第1項: service invention → employer, employer pays appropriate remuneration as principle; contract may provide otherwise | L65 (原則 kept; 「ただし」folded into 「…原則で、契約に別の定めがあれば」) | P* |
| 第2項 definition: invention completed as work within employment | L65 | P |
| 第8条 (link): non-service invention → employee; if employer's resources/experience used, employer may practise in that business against reasonable remuneration | L67 | P |
| Employee must notify employer in writing immediately on completion, and explain creation process if needed | L67 | P |
| Employer silent for 6 months from notice → cannot claim service invention | L67 (6か月, 通知を受けてから) | P |
| 第9条 (link): contracts stripping 第8条 rights are void | L67 | P |
| Secondees / Japan HQ researchers: check employer, duties, contribution, applicable law; evaluation in Taiwan alone does not make Taiwan law govern all participants' service inventions; Japan-side rules considered separately | L69 | P |

### §5 「改良成果は共有」では決まらない利用条件
| Original | Rewrite | Status |
|---|---|---|
| Separate pre-existing formulations/processes from new results; table is a hypothetical (架空) categorisation example, not statutory or any company's terms | L73 | P |
| Table (4 rows) | L75–80 byte-identical | P |
| 營業秘密法第4条 (link): commissioned result per contract; absent → 受託者; funder may use in business | L82 | P |
| 第5条 (link): jointly developed trade secret shares per contract; absent → presumed equal | L82 | P |
| 受託者 ≠ 発明者等 wording; lumping as 「知的財産」hides the difference | L82 | P |
| Post-sharing use differs (trade secret vs patent). 第6条 (link): absent agreement, use/disposal of co-owned trade secret needs all co-owners' consent; refusal without just cause not allowed | L84 「営業秘密と特許で扱いが分かれます」 + 第6条 | P* — the original's 「差があります」 followed by これに対し/專利法第64条 already meant this contrast |
| 第7条: licensing to third parties needs all consent, no refusal without just cause | L84 (second inline 第7条 link dropped; linked at L55 and in sources) | P* |
| 專利法第64条 (link): co-owner's own practice excluded from all-consent; licensing etc. needs all consent | L86 | P |
| 第12条 (link): co-owned application right → all co-owners apply together | L86 | P |
| 50/50 share alone does not decide who files, who manufactures, how far third-party use goes | L86 | P |
| Specify improvement vs base technology; negotiate own manufacture / supply to customer / third-party contract manufacture; limit exclusive grants by use, product, territory, period; even with one-sided ownership, other side's use rights and post-abandonment handling remain | L88 (two sentences merged) | P* |

### §6 台湾での仲裁、非公開手続と緊急の保全
| Original | Rewrite | Status |
|---|---|---|
| Governing law vs dispute-resolution clause roles; 涉外民事法律適用法第20条 (link): party choice for obligations arising from juristic acts | L92 | P |
| Choosing NDA governing law does not settle Taiwan patent or employment questions; check each | L92 (「ただし」dropped, meaning intact) | P |
| 仲裁法第1条 (link): written agreement for disputes capable of settlement; seat, institution/rules, language, number of arbitrators (1 or odd), covered disputes | L94 | P |
| Different forums across NDA / JDA / supply contract → multiple proceedings; align contracts | L94 | P |
| 第23条 (link): private unless otherwise agreed; contract should fix viewers of test data, confidentiality of translators/experts, storage, post-proceeding handling; both choosing privacy and specifying data handling required | L96 「非公開の手続を選ぶだけでなく…まで定めます」 | P* |
| Cannot always wait for arbitrator appointment | L98 question + 「待てるとは限りません」 | A (question wording only) + P |
| 第39条 (link): 仮差押え・仮処分 under CCP; if ordered before arbitration, court must on respondent's application order applicant to commence arbitration within set period; may instead order suit where lawful; failure → court may on application revoke the order; separate requirements for 保全 | L98, sentence by sentence identical | P |
| 第47条 (link): foreign award recognised by Taiwan court → effect of final judgment, basis for enforcement; 第49条・第50条 (link) refusal grounds; foreign win ≠ automatic enforcement | L100 | P |
| Termination residue: samples, backups, test records, improvements already in production; return/deletion scope, legal-retention exception, interim access limits, duration of confidentiality and licence; naming remaining data and continuing rights helps decide reuse | L104 under new H2 「開発を中止したあとに残るもの」 | P* (structure: new noun-phrase heading, no text lost) |

### Tail
| Original | Rewrite | Status |
|---|---|---|
| Contact line (曾雋崴 / Wei Tseng, email, Taipei address) | byte-identical | P |
| Related-articles link /ja/semiconductor | identical | P |
| 参考資料 (check date, 6 entries with amendment dates) | byte-identical | P |
| Italic disclaimer | byte-identical | P |

Nothing added: no new facts, cases, numbers, first-person stories, promises or sales lines. The two "A" rows are rhetorical restatements of content already in the original.

## Blocking issues

None.

## MONOTONY items

None blocking. Variety check: 0 FAIL. Self-check §5 items 2–7 all met: opener is a misconception-type statement, not a stock hypothetical; very short sentences present (「要件は三つです。」「待てるとは限りません。」「あくまで運用上の提案です。」); no paragraph opener word 3+ times (台湾の ×2, 台湾側 ×1); no three consecutive claim→(statute)→ただし paragraphs (ただし openers 5 → 2); several citation-free paragraphs; contrast frames = 2 by tool; last body paragraph ends on the column's own facts; contact line is one sentence in house format.

Nit (not blocking): 「〜わけではありません」 appears three times (L39, L63, L100) plus 「とは限りません」 twice. Density is no worse than the original and under the rule's cap, but a future pass could vary one of them.

## Tests verdict

tests.patch touches only `src/content/columns-ja/117-japanese-materials-supplier-taiwan-nda-trade-secrets.md` (the column content itself). No test file is modified (tests.txt: it()/test() blocks +0 −0). vitest-0.log: 74 files / 994 tests passed with the new content. No .skip/.only, no other column affected. Tests: OK, nothing to re-anchor.

## Tiny edits applied by reviewer

1. L49: 「判決を材料メーカーの管理に引き寄せると、」 → 「判決を材料メーカーの管理に引き寄せて考えると、」 — bare 引き寄せる read as physical pulling; 引き寄せて考える is the idiomatic form. No fact, number, citation or structure changed. Guard re-run: PASS (length 5104 → 5075, 99%). Variety re-run: 0 FAIL.

## Original issues (not blocking)

- Heading 「誓約書とアクセス制限の組合せ」: the body (both versions) lists the court's measures as employee confidentiality duties, classified access, device limits and account-based viewing; 誓約書 is the original's own framing of the first item. Could not verify offline whether the judgment text names written undertakings. Rewrite did not make it worse.
- Contact line carries a street address and a digit pattern that the house lint flags; this is the published original's format and was kept on instruction.
- JSR release details and statute amendment dates (2020-01-15, 2022-05-04, 2015-12-02) come from the original and were not re-verified online in this review.
