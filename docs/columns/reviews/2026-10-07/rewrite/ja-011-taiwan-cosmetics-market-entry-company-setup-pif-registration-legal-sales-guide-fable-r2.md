# FINAL REVIEW r2 — ja-011 taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide

Reviewer: Claude Fable 5.1 (final gate). Date: 2026-10-06. I did not write the draft or the round-1 fixes.

## Verdict

PASS — publishable as the live replacement. No blocking issue. The round-1 blocker (B1, "必要な事後措置" lost from step 6) and both same-round corrections (S1, S2) are fixed in the current draft, the optional N1 was taken, and tests.patch was re-synced to the fixed draft. I made no edits to draft.md.

## Scope checked

- Read in full: orig.md, draft.md (current, mtime 17:16:36), guard.txt, notes.md (including "fix round review-1"), tests.patch (re-synced 17:21:00), tests.txt, review-r1.md, claude-tests1.log, meta, log, result lines of vitest-1.log.
- Rules read: SENTENCE-VARIETY-RULE.md (all; sections 5–6 applied), rules/COLUMN-VOICE-RULE.md, rules/brief-EDITORIAL-VOICE.md (the full voice rule text; `~/agent-library/knowledge/editorial-voice.md` does not exist at that path, the copy in rules/ was used), LESSONS.md (all 25 items skimmed).
- Commands run by me in this round:
  - `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check …/draft.md --lang ja` → `sentences=113 mean=42.6 cv=0.46 short=0.142 run3=0.09 opener_rep=0.097 cite_end=0.0 cite_para=0.032 contrast=1 caveat=3 q=2`; 0 FAIL; 1 WARN ("96% of sentences end in 'desu-masu'").
  - `python3 /Users/son7/tseng-rewrite-1006/guard.py orig.md draft.md ja <slug> --today 2026-10-06` → `NOTE length 4107 -> 3734 (91%)`, `NOTE monotony score 33.3 -> 14.5; cv 0.339 -> 0.46; short 0.044 -> 0.142; cite_end 0.0 -> 0.0; contrast 7 -> 1; questions 0 -> 2`, `GUARD: PASS` (identical to guard.txt).
  - Python comparison of orig.md and draft.md: lines 1–21 differ only in line 4 (lastmod); img-01 line identical; all 18 markdown links equal as a multiset; the 13 source entries identical line by line; signature identical; no `**`, `__`, `<strong>`, `<b>` in the draft; `事後措置` 1 → 1; `すぐ` occurs once (storage paragraph only).
  - SHA-256 of the current draft against tests.patch: prefix 10,811 bytes = 56efb897…8ad2c5 (ends after "### PIFの更新と保存\n\n"); tail from "\n\n### 検査、是正、過料" = 7,007 bytes, 23d960cf…34393a. Both equal the values in tests.patch.
  - All 44 Japanese string literals added by tests.patch occur in the draft body (0 missing); the four changed regexes of the sync test match the three paragraphs between prefix and tail; the negative regex (第7条 tied to the address) does not match.
- Limits: the repository worktrees are outside the directories this session may read, so the two test files were judged from the patch hunks, claude-tests1.log and vitest-1.log (78 files, 1373 tests passed at 17:20:39, i.e. after the last change to draft.md), plus the hash/phrase checks above. I did not re-run vitest. The statutes were not re-opened (the brief says not to re-litigate the original's law).

## Round-1 findings — status

| r1 item | Current draft | Status |
|---|---|---|
| B1 step 6 lost 「必要な事後措置」 | 「検査や是正要求、苦情・安全性情報、必要な事後措置への対応手続も、運用しておきます。」 | fixed |
| S1 「すぐに」 added to the inspection obligation sentence | 「完全で最新の資料を検索して示せる状態を、常に保っておかなければなりません。」 | fixed |
| S2 scope words 「表示・宣伝・広告が」 dropped | 「表示・宣伝・広告が虚偽・誇大か、医療的効能の標榜かは、特定の一語では決まりません。」 | fixed |
| N1 (optional) doubled は | 「現在の担当機関は、経済部投資審議司です。」 | taken; 現在 and the agency name kept |
| tests.patch tail/prefix locks stale after the fixes | re-locked (hashes verified above) | fixed |

## Front matter

Identical except `lastmod: "2026-10-06"`. `read_time` "約6分" unchanged (body is 91% of the original). title, url, date_display, categories, featured_image, the three FAQ Q/A, the H1 and both image lines are byte-identical.

## Fact check, section by section (original point → place in rewrite → status)

### Intro

| Original | Rewrite | Status |
|---|---|---|
| To distribute in Taiwan, the brand must settle: to whom import is entrusted, when registration is completed, who manages the PIF and where, by which standard labelling and advertising are checked (定める必要があります) | Intro P1: 誰が輸入するのか／製品登録をいつ終えるのか／PIFを誰がどこで管理するのか／表示と広告をどの基準で確認するのか — 決めなければなりません | preserved (four items; same strength) |
| A local importer or an own Taiwan business are both possible, so setting up a company alone does not complete sales preparation | Intro P1: 任せる方法があり、自ら…運営する方法もあります。…設立だけでは、販売準備は整いません。 | preserved |
| (FAQ 1 / old section-1 lead) establishment is not necessarily required | Intro P1: question + 必ずしも設立する必要はありません | preserved (moved; 必ずしも kept) |
| Obligations may differ (ことがあります) by product type and manufacturing site, actual import form, distribution method, advertising content | Intro P2: 変わることがあります | preserved, hedge kept |
| "以下では…区別して説明します" | dropped | acceptable: roadmap sentence, no legal content |
| Before fixing the supply schedule, re-check current law and authority guidance product by product | Intro P2: 製品ごとに確認し直さなければなりません | preserved |

### 1. Entry form and importer

| Original | Rewrite | Status |
|---|---|---|
| Lead: importer may also be the distributor | 任せる場合 P1: 販売代理店が輸入業者を兼ねることもあれば、別の輸入業者が加わることもあります | preserved |
| Lead: subsidiary and branch differ in 設立・登記, 責任, 税務 | 自ら P1: 設立・登記の手続、法人格と本店の責任、会計・税務処理、…が、それぞれ変わります | preserved (設立・登記 carried into the list) |
| Lead: time for investment approval and company/branch registration varies with the case and corrections | 自ら P2 (six steps, five factors incl. 補正の有無) | preserved |
| Lead: first settle the business model and the entity responsible as 化粧品製造・輸入業者 | Section 1 lead: 最初に決めるのは、… | preserved |
| If a Taiwan importer or distributor handles import and sales, the brand need not have its own subsidiary/branch | 任せる場合 P1: 置かなくても構いません | preserved |
| Contract labels (代理店, 総代理店, 流通業者) alone do not decide where legal responsibility lies | P1: 契約上の呼び名だけでは、法的責任の帰属は決まりません | preserved (だけ kept) |
| First confirm who imports and registers, and who prepares/updates/keeps the PIF | P2 first sentence | preserved (phrased as まず確認するのは…です; practical step, not a statutory duty) |
| Assign persons for label check, distribution records, complaints and safety information, inspections and document requests | P2 | preserved, all four |
| Check that the statutory duties of the manufacturer/importer and the contractual split agree | P2: ずれていないかも、併せて確認しなければなりません | preserved |
| Contract: scope of IP use; provision/translation/supplementing of manufacturer documents for registration and PIF; management of latest documents; handover at termination (具体的に定めることが適切) | P3, sentences 1–2 | preserved |
| May also include: prior ad check and correction authority; passing on complaints and adverse-effect information; cooperation in necessary recalls; cost of testing/translation/storage | P3: 盛り込めます | preserved |
| To avoid documents remaining with one party only, set scope and deadline of return or copies in advance | P3: 返還や写しの提供の範囲と期限 | preserved |
| Subsidiary = separate legal person under Taiwan law; branch = registered as part of the foreign head office; not the same organisation | 自ら P1 | preserved |
| Differences in legal personality and head-office liability, accounting/tax, profit transfer, representation, internal control; do not choose by control over sales alone | 自ら P1 | preserved, all items; だけ kept |
| If a foreign-investment procedure is needed, check the guidance of the current authority, 経済部投資審議司 | 自ら P2, sentences 1–2 | preserved (condition 必要なとき kept) |
| 投資許可、資金の送金、会社または支店の登記、銀行口座の開設、税籍登録、輸入資格の取得 vary by 投資家、業種、組織形態、提出資料、補正の有無 | 自ら P2 | preserved, 6 + 5 items |
| Do not fix the launch date on an assumed fixed period; first check which procedures apply and the latest filing requirements | 自ら P2 | preserved |
| Whatever the form, the central responsible party under cosmetics regulation is the 化粧品製造・輸入業者 | 自ら P3 | preserved |
| Document work and safety assessment may be outsourced, but outsourcing alone does not transfer legal responsibility | 自ら P3: 任せられます。ただ、任せただけで…移ることはありません | preserved |
| Separating the contractual split from the statutory responsible party is the starting point | 自ら P3: 分けて考えます。ここが出発点です。 | preserved |

### 2. Product registration and PIF

| Original | Rewrite | Status |
|---|---|---|
| Lead: registration and PIF are not the same procedure; registration is a separate procedure on the TFDA platform | Section 2 lead: question + いいえ + 別の手続です | preserved |
| Lead: PIF = file compiling quality, safety, composition, claimed function, manufacturing method, test results, safety assessment etc.; prepared/updated/kept by the manufacturer/importer; not filed with TFDA in advance | Section 2 lead | preserved (seven items, who-does-what, 事前に提出する制度ではありません) |
| Lead: from 2026-07-01 in principle all cosmetics; solid handmade soap from a factory-registration-exempt site is the exception | PIF P2 | preserved (moved; 原則として kept) |
| Registration is made on the TFDA platform | Section 2 lead (stated once) | preserved; duplicate removed |
| The manufacturer/importer must complete registration before supplying, selling, giving away, publicly displaying, or providing for consumer trial | 製品登録 P1 | preserved, five acts, 完了しなければなりません |
| Not paid sales only: promotional gifts and trial schedules are managed with the registration timing | P1 | preserved |
| Validity 3 years; to continue supply, apply for extension within 3 months before expiry | P2: 有効期間は3年です。…その満了前3か月以内に延長を申請しなければなりません | preserved (number, window, starting point, duty) |
| Changes to name, use, dosage form, ingredients, manufacturing site etc.: check whether a procedure is needed for the change | P2 | preserved |
| Registration = declaring prescribed items on the platform; completion is neither confirmation that the PIF documents are complete nor a finding that labelling/advertising is lawful | P3 (two sentences) | preserved, both negations |
| Run registration schedule, PIF management and labelling/advertising check as separate compliance items | P3 | preserved |
| PIF = set of documents built so that quality and safety can be explained continuously | PIF P1 | preserved |
| Besides the seven items, basic information on product and manufacturer and supporting material such as labels; organise per product (しなければなりません) | PIF P1 | preserved |
| 管理弁法 divides the required documents into 16 categories; check each category's documents and signature/qualification requirements by product type | PIF P1 | preserved (16) |
| Applied in phases by product group; from 2026-07-01 the remaining cosmetics are included | PIF P2 | preserved |
| Exception limited to the soap; being handmade or using the name "soap" is not enough; both solid form AND factory-registration exemption of the site must be checked | PIF P2: 例外は一つだけです。…双方を確認します。 | preserved, AND kept |
| Qualified and competent third parties may support PIF work incl. safety assessment | PIF P3 | preserved (必要な資格と能力を備えた) |
| Even with third-party drafting support or storage services, legal responsibility stays with the manufacturer/importer | PIF P3: 法的責任は残ります | preserved |
| Set up a system so original manufacturer, test laboratory, safety assessor and Taiwan-side operator pass on change information and the latest signed documents | PIF P3 | preserved, four parties |
| When raw materials/formula, manufacturing method/site, labelling incl. label, claimed function, or safety information change, review and update the affected PIF documents | 更新 P1: …のどれかが変わったら、…更新しなければなりません | preserved (OR kept as どれか) |
| Consider whether complaints, adverse events, new test results affect the existing assessment; change control continues after first preparation | 更新 P1 | preserved |
| Retention period: 管理弁法 第7条; from the day after the product was last supplied to the market; at least 5 years | 更新 P2, sentences 1–2 | preserved; article attached to the period, starting point and 最低 kept |
| Place: 同弁法 第8条; the labelled address of the manufacturer/importer under 管理法 第7条第1項第7号 (管理しなければなりません) | 更新 P2, sentence 3 | preserved; mapping unchanged |
| Keep the period article and the place article apart in operation | 更新 P2: 期間と場所は、別の条文です。運用でも分けて扱います。 | preserved |
| Even if the original manufacturer holds the originals or secure electronic/cloud storage is used, the manufacturer/importer must be able to access the complete file | 更新 P3 | preserved |
| Set access rights, backup, version control, file format, person in charge so documents can be retrieved and shown promptly on the authority's request | 更新 P3: すぐ検索して示せるよう | preserved (速やかに → すぐ) |
| After a partner/provider contract ends, the file must still be kept for the statutory retention period; handover scope/method and whether access continues are set by contract (重要) | 更新 P3 | preserved (purpose clause became a reason clause stating the same retention duty; no new fact) |
| Inspection: in principle notice by 7 days before the inspection date; under statutory exceptions inspection without prior notice is possible | 検査 P1 | preserved (原則として, 7日前, ただし exception) |
| Regardless of notice, always keep complete and current documents retrievable and presentable | 検査 P1 | preserved (S1 fixed) |
| False information in registration or in the PIF: may be subject to an administrative fine of 1万～100万新台湾ドル（NT$） | 検査 P2 | preserved (ことがあります; both triggers) |
| Incomplete PIF: usually (通常) a correction order with a deadline; the fine arises when not corrected within it | 検査 P2 (two sentences) | preserved, 通常 kept |
| Do not tie false information and curable deficiencies to the same result | 検査 P2 | preserved |
| Recall/destruction does not automatically follow every PIF deficiency | 検査 P3: どのPIF資料の不備にも自動的に伴うわけではありません | preserved (partial negation) |
| Judge separately: product safety, nature of the violation, state of correction, statutory requirements of each measure | 検査 P3 | preserved, four items |
| Consider measures for a confirmed safety problem and requests to supplement documents separately; respond according to the authority's notice and the applicable provisions | 検査 P3: …進めなければなりません | preserved |

### 3. Labelling, promotion, advertising

| Original | Rewrite | Status |
|---|---|---|
| Lead: advertising is judged on the whole expression — name, text, image, symbol, sound etc. — not wording alone | 一語では P1, sentence 1 | preserved (moved) |
| Lead: false/exaggerated expressions and medical-efficacy claims are prohibited | Section 3 lead, sentences 1–2 | preserved |
| Lead: acne treatment, anti-inflammatory, sterilising claims need particular care | 一語では P2: 特に注意が必要です | preserved |
| Fines: false/exaggerated advertising NT$4万～NT$20万; medical-efficacy claim NT$60万～NT$500万 | Section 3 lead, sentence 3 | preserved; each range on the right violation |
| Ranges differ by violation type; before publication compare the whole advertising expression with the supporting material | Section 3 lead, sentences 4–5 | preserved (照合しなければなりません → 突き合わせなければなりません) |
| Lead: influencer posts that are in substance advertising are checked by the same standard | インフルエンサー P1 (実質的に広告と判断されることがあります) + 販売準備 (協業投稿は、表現全体を基準に見ます) + FAQ 3 (verbatim, on the same page) | preserved; the one-sentence form now lives in the FAQ only, the body keeps both halves |
| Whether 表示・宣伝・広告 is false/exaggerated or claims medical efficacy is not decided by one word | 一語では P1, sentence 2 | preserved (S2 fixed) |
| Considered together: product name, text, image, symbol, sound, context, overall consumer impression | 一語では P1, sentence 3 | preserved, seven items |
| Small-print qualifiers do not automatically cancel the impression created by the main expression; check both individual wording and the final work | 一語では P1 | preserved (当然には kept) |
| "Treats acne / has anti-inflammatory effect / sterilises" may amount to a medical-efficacy claim | 一語では P2: 当たることがあり | preserved, hedge kept |
| Also check: linking disease names to the product, before/after images, staging that suggests medical staff, context tying ingredient description to therapeutic effect | 一語では P2 | preserved, four items |
| Posts by influencers, reviewers, sales partners may be judged advertising depending on content and commercial context | インフルエンサー P1 | preserved (three actors; ことがあります) |
| Factors: payment, product provision, sales link, brand's posting instruction, repeated collaboration | P1 | preserved, five |
| Not every personal post is automatically the brand's advertising; check relationship, content, degree of brand involvement | P1 | preserved |
| Collaboration contract and guidelines can set permitted expressions and supporting material, pre-publication check, correction/removal procedure | P2: 定められます | preserved |
| Comments, oral statements in live streams and short videos, mismatch between sales page and label should be managed | P2 | preserved |
| Drafts, approval history, correction requests, final posts must be kept for later fact-finding | P2: 保存しなければなりません | preserved |
| Step 1: own subsidiary/branch or local importer | 販売準備, sentence 1 | preserved |
| Step 2: entity legally responsible as manufacturer/importer, and contractual persons in charge | sentence 1 | preserved |
| Step 3: complete registration before supply/sale/gift/public display or consumer trial | sentence 2 | preserved |
| Step 4: PIF per product, update changes, keep for the statutory period and at the statutory place | sentence 3 | preserved |
| Step 5: labels, sales pages, advertising, collaboration posts checked on the whole expression | sentence 4 | preserved |
| Step 6: procedures for inspections and correction requests, complaints and safety information, necessary post-market measures | sentence 5 | preserved (B1 fixed) |
| Checking in this order reduces the risk of confusing different regimes | sentence 6 | preserved |
| Internal-link sentence (three links) | same three links, same targets | preserved |

### Sources, disclaimer, signature

- 公式資料: 13 entries, labels and URLs identical.
- Disclaimer: educational/general explanation of the regime; not a legal opinion on individual products or advertising; no guarantee of permit/registration, saleability or processing time; confirm entry form, product documents, labelling/advertising content and the authority's latest practice case by case. All four elements present, now in three sentences. No contact line in either version.
- Signature 「曾雋崴弁護士（Wei Tseng）」 identical.

### Additions and strength

- No new fact, number, example, case, first-person statement, promise or sales line. The two reader questions restate FAQ 1 and FAQ 2. Connective sentences (「どちらを選んでも」「例外は一つだけです」「通知があってもなくても同じです」「ここが出発点です」) restate what the original says.
- Obligation strength: every statutory duty keeps 「なければなりません」 (registration before supply, extension application, PIF update, storage at the labelled address, access to the complete file, retrievable state, following the authority's notice, record keeping). Ten practical "check/manage/consider" sentences moved from 「必要があります／しなければなりません」 to plain 「〜します」 (e.g. 「登録時期とあわせて管理します」「双方を確認します」「分けて判断します」「併せて見ます」). In Japanese procedural prose this reads as an instruction, none of them is a statutory duty of its own, and the duty each depends on is stated with 「なければなりません」 in the same paragraph. Not a change of legal meaning.
- 「または」 → 「や／、」 in three enumerations (返還や写し; 安全な電子保存、クラウドストレージ; the three ad expressions): inclusive lists, no AND/OR shift. The one real AND (soap exception) is explicit (双方).

## Blocking issues

None.

## MONOTONY / voice

Tool: 0 FAIL (cv 0.46 ≥ 0.45; short 14.2% ≥ 8%; run3 9% ≤ 30%; cite_end 0; contrast 1 ≤ 3; no register mix). One WARN (96% です・ます endings), which is not a FAIL.

Section 5 items:
- 2 opener: the reader's own question, no stock hypothetical formula. Met. (Overlap with other columns of the batch cannot be checked from this item folder.)
- 3 short sentences: 16 of 113 (いいえ。／有効期間は3年です。／例外は一つだけです。／ここが出発点です。 …); no run of long sentences. Met.
- 4 paragraph starts: 「PIFは」×2, 「まず」×2, 「化粧品」×2; nothing three times. Met.
- 5 citation rhythm: one paragraph with article citations, ただし ×2. Met.
- 6 contrast frames: 「ではなく」 6 → 0, tool count 1. Met. Remark, not a MONOTONY item: five former 「XではなくY」 became 「Xではありません。Y…」 pairs (有償販売の日だけが基準ではありません。／決まった期間を前提に…適切ではありません。／…名称だけでは、対象外になりません。／…確認されたことにはなりません。／個人の投稿がすべて…わけではありません。), and one pair is new in form (初回の作成で終わりではありません。). Each denies something the original also denies, so none rebuts a claim the reader did not make and none can be cut without losing a qualifier. The density is at the upper edge of what reads naturally; it does not read as a template.
- 7 closing: last body paragraph ends on this column's own sequence; the disclaimer is specific to this column and carries no contact or sales line, as in the original. Met.
- 8 register: です・ます throughout; one deliberate plain-form enumeration of ad claims (「…殺菌作用がある。こうした表現は…」). No bold, no emoji, no first person, no imperative or checklist headings. Met.
- 9 nothing lost: met (B1 restored).

MONOTONY items: none.

Native-reader reading: the roadmap sentence, the three verbatim FAQ repeats, the duplicated fines paragraph and the numbered checklist are gone; sentence length varies; the text reads as a practitioner's explanation in natural です・ます. Wording notes, none worth an edit:
- 「設立・登記の手続、…内部統制の方法が、それぞれ変わります。」 — 「異なります」 would be the more usual verb; meaning is clear.
- 「現在の担当機関は、経済部投資審議司です。」 opens its paragraph before "foreign investment" is mentioned; the next sentence supplies it.
- 「？」 is followed directly by the next sentence in two places; usual in web text, and the second one is pinned literally by the tests.

## Length / padding

4107 → 3734 (91%). Cuts: roadmap sentence, FAQ-verbatim section leads, repeated fines paragraph, repeated "registration is done on the TFDA platform" sentence. All repetition; no legal point removed. Not padded.

## Tests verdict

tests.patch is acceptable.

- Two files only, both for ja 011: `columns-ja-investment-011-pif-two-paragraph-sync.test.ts` and `columns-ja-investment-011.test.ts`. No `.skip` / `.only` / `.todo`; it()/test() blocks +0 −0; no other column's assertions touched.
- Sync test: prefix length/SHA, tail marker (renamed heading 「検査、是正、過料」) and tail length/SHA re-locked to the fixed draft — I recomputed both hashes and they match. Four regexes widened only to admit the new wording (変わ／作成で終わりではありません…変更を管理し続ける手続が要／すぐ…示せ). The 第7条 → 第8条 ordering regex allows one sentence in between but still requires 保存期間…第7条 before 保存場所…第8条; the negative assertion (第7条 must not be tied to the address) is untouched and still holds.
- Main test: lastmod/date re-anchored to 2026-10-06; two headings re-anchored; required phrases replaced one for one, each still locking the same fact in the new wording: 3年, 満了前3か月以内, 16の区分, 2026年7月1日 + 原則として, the single soap exception, 第7条, 最後に供給した日の翌日 + 最低5年間, 表示住所, 原則として + 7日前, the statutory exception, 1万～100万新台湾ドル（NT$）, 通常 + correction order, both advertising fine ranges in one sentence, the influencer qualification, 現在の担当機関 + 経済部投資審議司.
- One structural lock changed on purpose: the three section leads no longer equal `faq[i].a` (the rewrite removed that verbatim duplication); they are pinned literally and a `sharedWithFaq` list requires the key facts to appear in both the lead and the FAQ answer. The two removed `toEqual(bodyContracts)` lines are replaced by `toEqual(expectedBodyContracts)`. The FAQ constant itself is unchanged.
- Step 6 (「必要な事後措置」) has no phrase lock of its own; it sits inside the SHA-locked tail, which is sufficient.
- vitest-1.log: 78 files, 1373 tests passed, run after the last change to draft.md.

## Tiny edits applied

None. draft.md is unchanged by this review (prefix and tail are SHA-locked by tests.patch, and nothing needed correcting).

## Original issues (not blocking, not made worse by the rewrite)

- No contact e-mail and no source-check date in the sources section; the sources block is a ### under "## 3." rather than its own last ## section. The guard tolerates these as the original's house format; the rewriter did not invent a date.
- Only 管理弁法 第7条・第8条 and 管理法 第7条第1項第7号 are cited inline. The registration timing, the 3-year validity / 3-month extension window, the 7-day inspection notice and the three fine ranges carry no article number in the original, and none was added. These figures were carried over unchanged and were not re-checked against the statutes in this job; the 3-year validity / extension rule in particular deserves a look against the current 化粧品製品登録弁法 at the next content audit.
- Heading 「検査、是正、過料」 is narrower than its section, which also covers recall and destruction (original: 行政上の措置). Heading only; the content is intact, and the heading is the tail marker of the sync test.
