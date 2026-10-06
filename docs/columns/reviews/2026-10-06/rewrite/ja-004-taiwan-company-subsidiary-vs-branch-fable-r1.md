# Final review r1 — ja-004-taiwan-company-subsidiary-vs-branch (Claude Fable 5.1, 2026-10-06)

Verdict: PASS — publishable as the live replacement. No blocking issue. No edit made to draft.md.

## Scope checked

- Read in full: orig.md, draft.md, guard.txt, notes.md, tests.patch (all 616 lines), claude-tests1.log, p-write.txt, SENTENCE-VARIETY-RULE.md (all, incl. sections 5-6), rules/COLUMN-VOICE-RULE.md, rules/brief-EDITORIAL-VOICE.md, LESSONS.md.
- Ran `variety_metrics.py check draft.md --lang ja`:
  `sentences=228 mean=45.0 cv=0.469 short=0.145 run3=0.035 opener_rep=0.179 cite_end=0.018 cite_para=0.196 contrast=2 caveat=4 q=0` — 0 FAIL, 1 WARN (96% です・ます endings; expected for the register).
- Re-ran `guard.py orig.md draft.md ja taiwan-company-subsidiary-vs-branch --today 2026-10-06`: `GUARD: PASS` (length 12292 -> 11447, 93%; monotony 45.4 -> 15.5; contrast 11 -> 2).
- `diff orig.md draft.md`: changed lines are 4 (lastmod), 6 (read_time) and prose lines only. Untouched: FAQ (lines 10-16), H1, both image lines, both tables (41-47, 63-69), sources list (10 entries), related links (3), `---`, signature. One H2 added, one renumbered (see section 7/8).
- Law was not re-researched (no network). Statute content was compared original vs rewrite only; my own doubts about the original are listed at the end.
- Limit: I am a model reading Japanese, not a native-speaker or lawyer review.

## Front matter

| Item | Result |
| --- | --- |
| lastmod | "2026-07-25" -> "2026-10-06" (expected) |
| read_time | "約18分" -> "約17分" (length 93%; allowed) |
| title, url, date_display, categories, featured_image, 3 FAQ q/a | identical |
| H1, featured image line, img-01 line | identical |

## Fact comparison, section by section

Intro (3 paragraphs)

| Original point | In rewrite | Status |
| --- | --- | --- |
| Foreign companies doing continuous business in Taiwan generally compare subsidiary and branch (一般的) | P1 s3, 「一般に…比べて検討します」 | preserved |
| Both are ways to set up a base; differences: contracting party, who bears debt, third-party investment, procedure for moving profit abroad | P1 s4-5 | preserved |
| Comparing on set-up convenience alone may cause unexpected liability/tax problems (可能性); judge over the whole business period | P1 s6-7 | preserved |
| Subsidiary = independent legal person under Taiwan law; parent may be shareholder; separate bearer of rights/duties | P2 s1-2 | preserved |
| Branch = part of foreign head office, no separate legal personality; 「支社」 vs 「支店」 terminology | P2 s3-5 | preserved |
| Choice depends on 9 listed factors | P3 s1, all 9 | preserved |
| Parent outside Taiwan: home-country accounting/tax and outbound-investment procedure in addition to Taiwan law | P3 s2-3 | preserved |
| Taiwan-Korea treaty is a Korean-parent example; other countries have other treaties | P3 s4-5 | preserved |
| Preview sentence 「以下では…の順に比較します」 | cut | acceptable (preview, no fact) |
| New opener: branch debt = foreign company's debt; subsidiary contract debt in principle stays with subsidiary | P1 s1-2 | not a new fact — both are section 3 statements of the original (and table row 責任主体); 原則として kept on the subsidiary side as in the original |

Section 1 法人格と出資構造

| Original point | In rewrite | Status |
| --- | --- | --- |
| Branch has no shareholders; for joint investment consider a subsidiary 等; check liability, voting, funding, licences, tax | P1 | preserved (方法など kept) |
| 会社法第1条 definition; subsidiary is a separate Taiwan legal person; can lease, contract, hold property, sue; claims/debts 原則として with subsidiary; parent control does not merge personalities | P2 | preserved, article attached to the definition |
| Liability depends on company form and conduct; 有限公司 shareholder liable 原則として up to contribution (第99条第1項); exception 第99条第2項 (abuse, specific debt hard to pay, serious, 必要な範囲); guarantee / tort liability separately; limited liability is not a guarantee | P3 | preserved; both paragraph numbers on the right claims |
| Foreign company operating in own name must follow branch rules; no operation without branch registration (第371条); must allocate funds and appoint Taiwan representative (第372条); funds are head-office funds, not shares; appointment does not make branch a company | P4 | preserved; 従わなければなりません／できません／義務づけています keep the duty strength |
| Table (5 rows) | identical | preserved |
| JV: ratio alone insufficient; 11 listed terms; subsidiary allows design in shareholder structure; other lawful structures exist; subsidiary not the only solution | P5 | preserved (11 terms counted) |
| Branch: foreign company is the final legal subject; head office to define 6 items; subsidiary: document articles, organs, shareholder powers, intra-group service/loan/licence contracts (しなければなりません); substance over name | P6 | preserved |
| Licences not decided by legal personality; sector rules may set applicant, minimum capital, staff, premises, FDI review or representative qualification; registrability ≠ permission; confirm contracting party and licence holder per activity first | P7 | preserved (または kept) |

Section 2 税務と利益送金

| Original point | In rewrite | Status |
| --- | --- | --- |
| FAQ-copy paragraph: both generally subject to 営業税5％ / 営利事業所得税20％ | P1 (question + answer) | preserved; 「一般税率に違いはありません」 restates the table's two 一般税率 rows, not a new claim |
| same paragraph: 21％ domestic withholding, treaty cap 10％ if requirements met | dividend paragraph + table | preserved once in prose, once in table |
| same paragraph: branch after-tax remittance is not a dividend, 原則として no additional withholding | remittance paragraph + table | preserved |
| same paragraph: 総機構 outside Taiwan → outside 5％ surtax filing | undistributed-earnings paragraph, 「総機構（本店）」 + table | preserved |
| 営業税: indirect tax; 5％; 通常 2-month period; zero rate / exemption / special rate / input credit vary; same 5％ ≠ same tax paid | P2 | preserved |
| 営利事業所得税: on taxable income; 20％ above statutory threshold; not 20％ of sales; 6 adjustment items; same rate can give different results | P3 | preserved |
| Table (5 rows) | identical | preserved |
| Dividend: separate subjects; 21％; Korean resident AND treaty-covered AND beneficial owner 等 → 10％ cap 検討; not automatic; check certificate, BO, timing, application/refund | P4 | preserved; the three conditions remain cumulative (「で、…となり、…に当たるなどの適用要件を満たせば」) |
| Branch profit is part of head-office profit; after filing/paying, remittance distinguished from dividend, 原則として no additional dividend withholding at branch stage; other payments (interest, royalties, service fees, asset price, third-party payments) judged individually | P5 | preserved; 原則として kept twice |
| Surtax: subsidiary retaining profit → 5％ under 所得税法第66条の9 may be an issue; per MOF guidance head office abroad → excluded from filing; branch activity still taxed; evidence duty for remittance remains | P6 | preserved; article still on the 5％ surtax |
| Look at how profit arises and is used; subsidiary computes on own books; reinvestment / dividend timing / shareholder loans, royalties change the result; branch must separate attributable income/expense and support allocation of common costs; internal dealings | P7 | preserved |
| Transfer pricing may apply to both; documents must match; "head office paid" / "amount in group contract" not enough; keep supporting material | P8 | preserved (ことがあります kept) |
| Korea side: 5 items; initial branch loss treatment depends on Korean law/standards; cannot conclude in advance that a branch lowers the Korean parent's tax; compare 4 items in one sheet | P9 | preserved |

Section 3 債務と法的責任

| Original point | In rewrite | Status |
| --- | --- | --- |
| Branch not a separate person → branch debts are the foreign company's; obligations from contracts lawfully made in the company's name 原則として on head office; liability not limited to allocated funds | P1 | preserved |
| Subsidiary's contracts/debts 原則として its own; 有限公司 (第99条) up to contribution; 股份有限公司 within subscribed shares (基本); matters for high-risk, long-term, many employees/consumers | P2 | preserved |
| Subsidiary does not block all parent risk: guarantee, direct assumption / co-signature, commingling or abuse → 会社法 exception; boundary depends on real decision-making and funding | P3 (question + 「そうとは限りません」) | preserved |
| Directors / managers / Taiwan representative duties; own-act liability not solved by form; sector laws set their own subjects and sanctions; documents must match operations | P4 | preserved |
| Contract clauses (6); insurance vs internal control; 6 control items | P5 | preserved |
| Not "subsidiary safe, branch dangerous"; branch = direct liability; subsidiary = separate personality + limited liability as starting point; overlay guarantee, tort, abuse, regulatory liability, intra-group contracts | P6 | preserved |

Section 4 資金調達と台湾での上場

| Original point | In rewrite | Status |
| --- | --- | --- |
| FAQ-copy paragraph: branch cannot be the listed entity | P3 | preserved |
| same: subsidiary listing needs 会社法 and exchange requirements | P4, 「会社法の所定要件と、台湾証券取引所の該当市場の基準」 | preserved (merged) |
| same: incentives not decided by form; 第10条の1: 対象投資, 申請期限, 控除方法, 重複適用, 税額上限 to be checked | section 5 P1 (税額上限 added to its list), P3, P4 | preserved |
| Branch has no shares/equity; funds from allocated funds, head-office support, lawful borrowing 等; no equity ≠ no financing; check loans, collateral, guarantee, bank review, FX documents per transaction | P1 | preserved |
| Subsidiary can issue shares / increase capital per form and procedure; local partner, investor rights, class shares, equity compensation; exit, M&A, strategic investment → subsidiary 適する場合; all subject to law, regulation, articles, SHA | P2 | preserved |
| Branch cannot itself be listed; head office's listing is a separate question | P3 | preserved |
| Subsidiary's existence does not give listing eligibility; issuer form + TWSE market standards; 8 requirement items; sector / FDI limits, restructuring, shareholding affect the plan | P4 | preserved (8 items counted) |
| Map future funding and exit over time; 5 questions; short-term vs long-term form may differ | P5 | preserved |

Section 5 投資税額控除

| Original point | In rewrite | Status |
| --- | --- | --- |
| Not decided by the name of the form; 9 check items; credit ≠ taxable-income computation; not a full deduction of spending from tax | P1 (now 10 items with 税額上限 from the cut paragraph) | preserved |
| 産業創新条例第10条の1: investments 2025年1月1日–2029年12月31日; same tax year NT$100万以上 NT$20億以下; 会社 or 有限合夥; statutory requirements and approval; own use (しなければならず); new; actual use | P2 | preserved, digits identical |
| Target fields (smart machinery, 5G, cybersecurity, AI, energy-saving / carbon reduction); not automatic; 7 document types checked individually | P3 | preserved |
| 最大5％ in the year OR 最大3％ over 3年間; annual cap 30％ of that year's tax; with other credits check total cap and overlap; 「30％」 is not an automatic 30％ R&D refund | P4 | preserved (or-choice kept: 「方法か、…方法」) |
| R&D may fall under 第10条 等; do not confuse 第10条 and 第10条の1; decide article, authority/schedule, combination before investing | P5 | preserved |
| Eligibility by statutory applicant and actual investment; subsidiary not guaranteed, branch not categorically excluded; check at planning stage or deadlines/evidence may be missed | P6 | preserved |

Section 6 台湾・韓国所得税協定と恒久的施設（PE）

| Original point | In rewrite | Status |
| --- | --- | --- |
| Signed 2021年11月17日, in force 2023年12月27日, applied from 2024年1月1日; not automatic exemption; 5 check items | P1 | preserved |
| Dividends, interest, royalties cap 10％ each; recipient resident of the other territory AND beneficial owner 等; certificate and application/filing or refund; conduit / PE-connected income need separate review | P2 | preserved (かつ kept) |
| Business profits 原則として exempt without PE; with PE, attributable profits may be taxed; first PE, then attribution | P3 | preserved |
| PE includes fixed place; management place / branch / office; registered branch is 通常 a fixed-place PE, so branch profits not automatically exempt | P4 | preserved (通常 kept) |
| Construction etc. over 6か月; services over 合計183日 in any 12か月間; dependent agent habitually concluding contracts | P5 | preserved, thresholds and 超 direction identical |
| Tests are independent (≤183 days does not exclude fixed place; ≤6 months does not exclude agent PE); 6 factors | P6 | preserved |
| Subsidiary ≠ PE; not a PE merely by being a subsidiary; unless agent authority / parent doing its own business at subsidiary's premises; registration and treaty taxation judged separately | P7 | preserved |
| Keep operational records (7 items); manage both territories' filing calendars; do not miss domestic filing / TP documents | P8 | preserved |

Section 7 形態の変更と撤退 (new H2) and section 8 どちらを選ぶか (old 7)

The old section 7 had ten blocks: overview, prompt, 8 bullets, scenarios, conversion, 第378条, 第379条, 第380条, subsidiary dissolution, final choice. The rewrite moves conversion + the four exit paragraphs into a new "7. 形態の変更と撤退" and keeps the rest as "8. どちらを選ぶか". All ten blocks are present; nothing was dropped by the move. The new heading names the content and is neither a checklist nor an imperative heading (allowed by the rewrite brief).

| Original point | In rewrite | Status |
| --- | --- | --- |
| Changing form mid-operation involves counterparty consent, labour, licences, asset transfer, tax, FX (ことがあります); cannot assume a simple rename; design assignment clauses / IP rights in advance | 7 P1 | preserved |
| Branch ceasing business must apply to cancel registration (会社法第378条); prior debts and tax / labour / contract / regulatory duties do not lapse by applying; 6 wind-down steps in order | 7 P2 | preserved; しなければなりません kept on the statutory duty |
| 会社法第379条: cancellation does not affect creditors' rights or the foreign company's obligations; creditors may still claim; check disputes, guarantees, audit periods, record keeping | 7 P3 | preserved |
| All Taiwan branches cancelled → must liquidate rights/obligations from Taiwan business and branches (会社法第380条); unpaid debts stay with the foreign company; same-entity principle also at exit; liquidator, creditor notice, filings, residual funds | 7 P4 | preserved; 「すべての台湾支店が抹消されるとき」 keeps the "all branches" condition |
| Subsidiary: dissolution/liquidation under 会社法, not branch cancellation; 5 items; parent cannot pull funds ignoring personality and creditors; the two procedures are not the same | 7 P5 | preserved |
| Neither form is always better; subsidiary / branch each 適している場合; "can be set up" vs "efficient through operation, tax, exit" | 8 P1 | preserved |
| Recommendation + 8 bullets | 8 P2 + 8 bullets (および → 、; 「どのように」→「どう」) | preserved, every item present |
| Early stage: still reflect future plans; 4 scenarios; table of funds, after-tax cash, liability, document/filing costs | 8 P3 | preserved |
| Final choice with Taiwan and home-country professionals on the same facts; 7 inputs; periodic check after set-up | 8 P4 | preserved |

Tail

| Original point | In rewrite | Status |
| --- | --- | --- |
| 公式資料 (10 links) | identical | preserved |
| 関連案内 (3 links incl. お問い合わせ) | identical | preserved |
| Disclaimer: educational, not individual legal/tax advice; depends on location, business, flows, treaty requirements, authority practice; check latest official materials and own circumstances before set-up / investment / contract / dividend or remittance | same content in 3 sentences | preserved |
| Signature 曾雋崴弁護士（Wei Tseng） | identical | preserved |

Additions check: no new fact, number, case, example, first-person story, promise or sales line. New sentences are the opener (from section 3), three reader questions with answers already in the original, and short connecting sentences (「例外もあります。」「上限もあります。」「支店は扱いが異なります。」 etc.).

Modal strength spot check (notes item 5): statutory duties keep duty wording (第371条, 第372条, 第378条, 第380条, own-use requirement, treaty certificate/procedure, licence and documentation duties). The softened ones (〜します／〜しておきます／〜が欠かせません／〜ことになります) are the original's advisory "you should check / plan" sentences, not statutory duties. No qualifier (原則として, 通常, 一般に, 〜得ます, 〜ことがあります, 〜場合があります) was dropped.

## Blocking issues

None.

## MONOTONY

Tool: 0 FAIL. Rule section 5 items 2-7: all met.
- 2 opener: concrete-fact opener, not the 例えば…とします formula.
- 3 short sentences: 14.5% (well over 2).
- 4 paragraph openers read vertically: no word three times (台湾 ×2, 子会社 ×2, 独立した法人である子会社 ×2, 恒久的施設 ×2, 上場 ×2).
- 5 no three consecutive "claim (statute) → ただし" paragraphs; most paragraphs carry no citation; ただし ×2, もっとも ×2.
- 6 ではなく ×2 in prose. The remaining "A and B are not the same" sentences (登記 vs 許認可, 子会社 vs PE, 第10条 vs 第10条の1) are legal distinctions of the original and had to stay.
- 7 last body paragraph ends on this column's own inputs and follow-up; the disclaimer is the original's content, shortened, no sales line.
- Register: です・ます throughout, no だ・である, no bold, no emoji. 〜ことができます ×0, 〜必要があります ×3 in the body.

Observations, not blocking (below the threshold; leave as is unless the column is touched again):
- The three reader questions share one shape, 「〜のでしょうか。」 + a one-line answer (section 2 P1, section 2 P5, section 3 P3).
- Short signpost sentences are used about six times to break rhythm (「例外もあります。」「上限もあります。」「この税率には条件があります。」「支店は扱いが異なります。」「事業利得条項は、順に検討します。」「韓国側の確認も要ります。」).
- Section 3 P1 「支店の債務は、外国会社の債務です。」 repeats the opening sentence almost word for word.
- Section 1 P4 「…変わらず、指定は、台湾で…」 is a little stiff. Not edited, because tests.patch pins this paragraph verbatim and the sentence is correct.

## Not padded

93% of the original. Cuts: the preview sentence, the two FAQ-duplicate paragraphs at the head of sections 2 and 4 (each fact kept once in prose and in the tables), connectives (したがって／結局／別途). No legal point was removed. The FAQ itself is still shown on the page: `src/app/[locale]/columns/[slug]/page.tsx` renders `post.faq` and its JSON-LD from the front matter, which is unchanged.

## Tests verdict (tests.patch) — OK

- Files touched: only `columns-ja-investment-004-intro-sync.test.ts` and `columns-ja-investment-004.test.ts`. No `.skip` / `.only` / `.todo`. `it()` blocks +4 −3 (old section 7 test split into section 7 and section 8 tests). vitest-1.log: 92 files, 1193 tests passed.
- Front matter: lastmod / post.date → 2026-10-06, read_time → 約17分, prefix SHA updated (same 2,356-byte length); FAQ q/a assertions unchanged.
- Exact-paragraph pins for sections 1-8 and the disclaimer were re-pinned to the new text; I compared them with draft.md and they match the draft wording.
- Fact locks still present with new wording: 営業税5％, 営利事業所得税20％, 源泉徴収率は21％, 協定上の上限税率10％ (was 上限10％), 2か月, 所得税法第66条の9, 2025年1月1日から2029年12月31日まで, 100万…以上、NT$20億以下, 自己使用の目的 / 新品 / 実際の使用状況, 30％までです, 第10条 vs 第10条の1, treaty dates, 6か月, 183日, PE categories, 第378条・第379条・第380条 (moved to the new section 7 test), 8 bullets, sources, related links, author line.
- Removed assertions, each tied to an intentional structural cut: `section4OverviewParagraph` (FAQ-duplicate paragraph removed; its facts stay locked by the section 4 listing paragraph and section 5 P1), three roadmap regexes 法人格／責任／投資税額控除 for intro P3 (preview sentence removed; the four concepts P3 still names stay asserted), the old 9-paragraph count for section 7 (replaced by 5 + 4 with full paragraph equality).
- Regex loosening in intro-sync only adds the new wording alternatives (移す, 手軽さ, 比べ, 判断, 独立の法人, 法的な関係, どちらも…拠点) and adds two new assertions for the new opening sentences.

## Tiny edits applied

None. draft.md is unchanged, so the earlier guard and test results stand.

## Original issues (not blocking; the rewrite did not make them worse)

1. Sources entry 「営業税法第10条」 links to `LawSingle.aspx?pcode=G0340028&flno=3`, i.e. the Article 3 page (read from the URL; not opened).
2. The body attributes "cancellation does not affect creditors' rights or the foreign company's obligations" to 会社法第379条 in general. From memory that wording is 第379条第2項 (cancellation by the authority), and the voluntary-cancellation proviso is in 第378条. 確認必要 — not checked against the live text in this review.
3. This ja column explains the Taiwan–Korea treaty and 「韓国側」 filings. It flags itself as a Korean-parent example, but a Japanese parent falls under a different arrangement; a ja-specific treatment would serve the ja reader better.
4. Section 5 P4 「この「30％」は、研究開発費の30％が…という意味ではありません」 rebuts a reading the reader has not been shown (rule 2-6). It is a caution of the original and was correctly kept.
5. Pre-existing house-format lint: no contact email, no source-check date, last H2 is 関連案内.

Process notes: notes.md item 2 says the FAQ-duplicate paragraph of section 1 was cut; it actually survives, reworded, as section 1 P1 (harmless). p-tests1.txt described the rewrite to the test syncer as "Claude-Fable-reviewed" before this review existed.

VERDICT: PASS
