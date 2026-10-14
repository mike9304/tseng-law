# C4 final review — round 2

Verdict: FIX. The four versions are not publishable as submitted. Five legal-condition/source findings remain below, alongside citation-placement and wording corrections. The requested WebP is absent. No draft was edited by this reviewer.

Reviewed on 2026-10-14, Asia/Seoul. Column: `taiwan-tenant-early-lease-termination-notice-penalty`. This is the current Codex final review, not a claim of lawyer or human native-speaker review.

## Scope and evidence

Read fully: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C4.md`, all four `drafts/C4/{ko,ja,en,zh-hant}.md`, `drafts/C4/facts.md`, and `research/C4-statutes.md`. Also read the available repository `docs/columns/EDITORIAL-VOICE.md`, the 0930 column-voice rule, the shared sentence-variety rule including sections 5–6, and the recurring lessons. `/Users/son7/agent-library/knowledge/editorial-voice.md` is absent; the supplied full editorial brief and available repository copy were used. The user's current final-review authority overrides historical Fable approval requirements.

Checked each language in the requested order: law/facts, citations, hard rules/frontmatter, native prose and variety, image. There are no judgment citations and no judgment `.txt` files in this research directory, so there is no judgment holding or party identity to audit.

Independently fetched 29 official URLs with curl: all 23 cited single-article pages, two Chinese full-law pages for amendment dates, two English full-law pages for official names, and the Executive Yuan page and PDF. All curl requests returned HTTP 200. The web tool separately opened Civil Code Article 95 and Postal Regulations Article 34; its Executive Yuan request timed out, but direct curl succeeded. The full URL/file/status manifest is `evidence-astra-r2/sources.json`.

The 20 cited single articles also reproduced in `research/C4-statutes.md` match the live text after whitespace normalization. Rental Act Article 4, Civil Code Article 95, and Postal Regulations Article 34 were independently read from their official pages. See `evidence-astra-r2/research-live-comparison.json`. The Executive Yuan PDF was extracted and its pages 4 and 6 also visually inspected, including the boxes, point 14, the urgent exception, and point 20. Saved text and renders are in `evidence-astra-r2/`.

The following central propositions are supported, subject to the specific findings below:

- Civil Code Articles 450/453: expiry of a fixed term; no unrestricted ordinary mid-term exit inferred from Article 450(2); advance notice for a contractually permitted early termination; the calendar-period proviso identifies the landlord.
- Rental Act Article 5(1) and Consumer Protection Act Article 17: consumer relationship, Executive Yuan approval before announcement, invalidity of conflicting standard terms, and incorporation of omitted mandatory terms.
- Point 14: the 得/不得 choice, at least one month's advance notice for the permitted route, a maximum of one month's rent for termination without that notice, deposit set-off and shortfall, and prepaid-rent return under the identified route. The drafts do not invent a monetary cap for 不得. Civil Code Articles 250/252 and 454 are correctly identified.
- Rental Act Article 11: the four statutory grounds, the heirs provision, and 30 days' written notice with evidence. Job loss/transfer/departure is not on that list. This is presented as a reading of the list, not a court holding. The Japanese version links the existing deposit article for the four grounds and repair-and-deduct detail; that linked article contains them.
- Point 18 and Civil Code Article 424: the safety/health ground, knowledge/waiver provision, and quoted urgent exception. The exact quotation is present in all four versions. The contradictory ZH gloss is L2 below.
- Rental Act Article 8, Civil Code Articles 423/429/430, and point 9: landlord repair responsibility and exceptions, reasonable repair demand, self-repair/reimbursement/deduction or termination, and reasonable advance notice plus the tenant's justifiable-reason qualification for repair access.
- Rental Act Article 9, point 8, and Civil Code Article 443: written consent for all/part subletting in the covered residential leases. The Civil Code partial-house proviso is not presented as permission to bypass that requirement.
- Joint handover/deemed completion under Article 12/point 15; free government 調處 under Article 16; posting versus arrival under Article 95; the narrow address-change presumption in point 20; the actual definition of 存證信函 under Postal Regulations Article 34.

The Civil Code page's amendment date is ROC 115-08-17, and the Rental Act's is ROC 112-02-08, as the sources lists state. The Civil Code's pending-provision notice concerns Articles 166-1 and 1223, not the provisions used here. The Executive Yuan page and PDF confirm point 18's amendment by Tai-Nei-Di-Zi No. 1140113583 on 2025-04-18, effective that day. The English statutory titles were checked against MOJ English pages. No arithmetic calculation is asserted in these drafts; remaining months and the November event are explicitly fictional examples.

## Legal and factual findings — required, not applied

### L1 — EN: unsupported rule that Chinese contract wording controls

Original — `en.md:26`: “The signed Chinese text controls.”

→ Problem and reason — This states a rule of contractual/language priority without a supporting source or a specified bilingual agreement. Neither the cited point 14 nor the other cited provisions establishes that Chinese wording always prevails. It also sits beside an explanation that mandatory terms can invalidate or supplement signed wording. The intended caution about this article's translation is not what the sentence actually says.

→ Fix required — Remove the unsupported priority claim. If a translation label is useful, say that the opening quotation is an English translation of the official Chinese wording. Do not assert that a signed Chinese lease overrides other agreed wording or mandatory law.

→ Facts preserved — Preserve the point 14 quotation, 得/不得 distinction, source, and date. No change applied; the required correction removes an unsupported proposition rather than substituting a new rule.

### L2 — ZH: blanket exclusion of repair disputes from the urgent exception

Original — `zh-hant.md:72`: “修繕爭議不在免除範圍。”

→ Problem and reason — The immediately preceding official quotation allows no prior notice when the safety/health defect described in the first part of item 3 is urgent. A repair dispute can also involve precisely that urgent defect. The quoted text does not categorically exclude disputes involving repairs. KO says not all repair disputes are exempt; JA and EN likewise use a limited proposition. ZH turns that into an absolute exclusion and contradicts the other languages.

→ Fix required — For example: “並非所有修繕爭議都能免除先期通知；仍須符合第3款前段危及安全或健康且情況危急的要件。” Keep the exact statutory quotation and its [official PDF](https://www.ey.gov.tw/File/43BC094940995CFC?A=C) link.

→ Facts preserved — Preserve the 30-day written-notice/evidence default, item 3 first-part limitation, urgency, and heirs' notice rule. No change applied; the proposed correction restores the exception's actual scope.

### L3 — KO/JA/EN: deposit-return sentence omits termination of the lease

Original — `ko.md:84`: “보증금은 주택을 돌려주고 계약상 채무를 갚은 뒤, 그대로 또는 충당한 나머지로 돌아옵니다.” `ja.md:86`: “押金は、住宅を返還し契約上の債務を弁済したあと、そのまま、または充当した残りが戻ります”. `en.md:82`: “Once the dwelling is returned and the lease debts are paid, the deposit comes back in full or after set-off”.

→ Problem and reason — [Rental Act Article 7(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=7) expressly includes “租賃契約消滅” as well as return of the dwelling and settlement of lease debts. The three versions state an incomplete trigger. This matters particularly in a column explaining that moving out during a fixed term need not end the lease. ZH correctly retains all three conditions: “契約消滅、返還住宅並清償租賃債務時”.

→ Fix required — Restore “the lease has ended” explicitly in KO, JA, and EN, alongside return of the dwelling and debt settlement/set-off. Keep this brief and retain the existing deposit-column link.

→ Facts preserved — Preserve all three conditions, full return or residual return after set-off, Article 7(2), and the same-language internal link. No change applied; this is a legal-condition correction, not an authorized minor style edit.

### L4 — all languages: point 20's agreement is reduced to an exclusive checkbox formality

Original — FAQ 3 in every file (`:19`): KO “계약이 그 칸을 선택한 때에만”; JA “契約がその欄を選んだときに限り”; EN “counts only if the contract selects that box”; ZH “要契約勾了該欄才是通知”. The body repeats this in `ko.md:94`, `ja.md:96`, `en.md:92`, and `zh-hant.md:96`.

→ Problem and reason — [Point 20](https://www.ey.gov.tw/File/43BC094940995CFC?A=C) permits the parties to agree to email, SMS, or messaging-app text: “得經租賃雙方約定”. It provides boxes for recording that agreement. It does not say that physically selecting that particular printed box is the exclusive way to agree or that every notice outside that format is ineffective. The brief asks for the contractually agreed-method limitation; the drafts add an unsupported formality. ZH makes it expressly cumulative with “約定並勾了該欄”.

→ Fix required — State that the parties may agree to those text-based notification methods and should check the agreement recorded in the contract, including the selected fields. Do not make the printed check mark itself an exclusive validity requirement. Do not swing to the opposite unsupported claim that any message is sufficient. Update FAQ and body together.

→ Facts preserved — Preserve the bilateral agreement requirement, all three methods, the address rule and conditional first-mailing presumption, arrival principle, and telephone-only prohibition. No change applied; the correction removes an extra legal condition.

### L5 — KO: management/operation condition omitted from Article 4 exclusions

Original — `ko.md:38`: “정부나 정부가 설립한 전담 법인·기관의 주택, 협동조합의 주택”.

→ Problem and reason — [Article 4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=4) excludes housing operated/managed by the government or its dedicated legal person/institution, and housing operated/managed by a cooperative. The current possessive wording drops “經營管理” and can be read as an ownership or affiliation test. The other languages retain the operation/management element.

→ Fix required — Specify “정부나 정부가 설립한 전담 법인·기관이 운영·관리하는 주택, 협동조합이 운영·관리하는 주택”. Rebalance surrounding prose if necessary to stay below 3,500 characters; do not cut another legal condition to make room.

→ Facts preserved — Preserve the precise public/dedicated-body and cooperative categories, leisure/tourism exclusion, under-30-days exclusion, and Article 4 link. No change applied.

## Citations and hard-rule findings

### C1 — all languages: missing immediate source links for notification-method rules

Original — The two sentences beginning “전자우편, 휴대전화 문자…” / “電子メール、携帯電話…” / “Email, a mobile text…” / “信箱、簡訊…” at the L4 body locations, followed by the telephone-only prohibition. Their paragraph's official link is Postal Regulations Article 34, attached to the later 存證信函 definition.

→ Problem and reason — Article 34 supports the postal definition, not agreed electronic notice or prohibited term 8. Point 20 was linked in an earlier paragraph, with the separate Article 95 paragraph intervening. The required immediate inline citation is missing at these renewed claims. An end sources list does not satisfy the batch's inline rule.

→ Fix required — After correcting L4, place the Executive Yuan terms link immediately with the point 20/prohibited-term-8 claims. Also link the point 14 set-off/shortfall/prepaid-rent paragraph itself (`ko:48`, `ja:50`, `en:46`, `zh-hant:50`). In JA, the opening one-month-cap answer at line 26 needs its immediate point 14 citation and the permitted-termination context, rather than leaving the reader to supply it from later sections.

→ Facts preserved — These additions preserve the official destinations and every rule, amount, condition, and quotation. No citation was changed by the reviewer.

Other citation/format checks passed: all external body URLs appear in the sources sections; pcode/flno targets match the named articles; the dated Executive Yuan page and direct PDF are both present. Every sources section shows the requested check date of 2026-10-13. Same-language internal links exist in the lint inventory: KO 2, JA 3, EN 3, ZH 2. None links to this batch.

Frontmatter keys, topic `litigation`, audience, author `legal-ai-assistant`, dates, H1/title match, literal NNN image path, categories, and three FAQs comply structurally. EN title is 52 characters; its title plus brand suffix requires a seoTitle, which is 39 characters. Its summary is 160 characters and contains none of the forbidden syntax. Read-time values are plausible. FAQ accuracy remains subject to L4. In the English summary, “notice is one month” should also retain the body's more precise “at least one month” when the text is revised, while keeping the 150–160-character limit.

No bold, private-party names, telephone/hotline numbers, street address, LINE/Kakao identifier, lawyer/native-review claim, attorney byline, or outcome guarantee was found. Each language has one short firm/email contact paragraph and one contact-email occurrence. Each fictional example is labelled. The foreign-country sentences assert no foreign-law rule, so there is no unsourced Korean/Japanese/US doctrine to verify.

## Voice findings and minor wording to address

The titles identify the tenant-exit issue without clickbait or imperative framing. Korean remains in 합니다체, Japanese in です・ます. No Mainland vocabulary or simplified characters were found in ZH. Nevertheless, the following compressed or translated phrases need natural wording during the legal revision. These are concrete editorial defects, not an allegation about how the drafts were produced.

- KO `:26`, “1년 주택에서 만기 전에 나갈 때” → “1년 주택” omits what has a one-year duration → required wording: “1년짜리 주택 임대차를 만기 전에 끝낼 때” → preserves the fixed-term residential setting; no edit applied.
- KO `:32`, “칸과 조례의 임차인 통지는 그대로입니다.” → a checkbox cannot itself owe or make notice; the compressed noun chain obscures the tenant's obligation → required wording along the lines of “임차인은 계약과 조례에서 정한 통지 의무를 따릅니다.” → preserves the distinction from the landlord-only proviso; no edit applied.
- KO `:58`, “본사가 주재원을 남은 다섯 달 전에 서울로 부르면” → the time phrase reads as five months before an unspecified event → required wording: “임대차 기간이 다섯 달 남았을 때 본사가 주재원에게 서울 복귀를 명하면” → preserve five remaining months, the employer's recall, and the hypothetical label; no edit applied.
- JA `:76`, “第3項がもう一段を置きます。” → literal and opaque; native prose should state what is added → required wording: “第3項は、修繕のための立入りについて事前通知も求めています。” followed by the existing reasonable-period/justifiable-reason qualifications → preserves the actual repair-access rule and citation; no edit applied.
- JA `:17`, `:72`, `:104`, “状況が急” → unnatural description of urgency and less clear than the legal threshold → required wording: “状況が切迫している” or “緊急を要する状況” in the same conditional sentence → preserve the safety/health and item-3 scope, not general inconvenience; no edit applied.
- EN `:32`, “Notice the tenant owes under the box or the Act remains.” → awkward noun phrase that can initially read as an imperative “Notice…” → required wording: “The tenant must still comply with the contractual and statutory notice requirements.” → preserves whose obligation is being distinguished; no edit applied.
- EN `:84`, “Landlord early ending and its notice are Article 10.” → unidiomatic subject and incorrect equating of rules with an article → required wording: “Article 10 sets out the landlord's grounds for early termination and the required notice.” → preserve the existing link and keep the landlord topic brief; no edit applied.
- ZH `:30`, “一年期走第1項。” → compressed research-note shorthand rather than finished prose → required wording: “一年期租約也適用第1項。” → preserves the article/paragraph and fixed-term point; no edit applied.
- ZH `:70`, “第18點在2025年4月18日再寫一次。” → describes the drafter's copying process and can blur the difference between the version date and when each ground was first introduced → required wording: “2025年4月18日修正的第18點也列有這些事由。” → preserves the date and overlap with Article 11 without inventing amendment history; no edit applied.

The identical last-sentence construction in all versions (“열쇠는 인도 확인 뒤에 넘어갑니다.” / “鍵は点交のあとで渡します。” / “Keys pass after the joint check.” / “鑰匙在點交後交。”) also reads as a manufactured short-sentence ending. Article 12/point 15 describes joint or deemed handover, not a freestanding universal rule about the sequence for returning keys. Required editorial direction: end with the particular example's remaining notice/handover task, or frame key-return recording as practical advice; preserve the earlier no-show/deemed-completion qualification. No edit applied.

### Opening deletion check and comparisons

KO/EN/ZH open with point 14's text and explain the checkbox, which supplies substantive information; removing the quoted condition would lose scope. JA's initial question introduces the cap issue, followed by the official wording, but the answer needs C1's immediate support/context. In the next fixed-term paragraph, “1년 계약도 같습니다.” / “1年契約も同じです。” / “A one-year lease is that case.” / “一年期走第1項。” repeats the application already established by the title and opening; it can be integrated naturally when revising, with the one-year fact retained elsewhere. EN's extra opening sentence about Chinese priority fails L1.

Compared opening types against available C1–C5 drafts in each language: C4's official-quotation opening in KO/EN/ZH and question opening in JA is not reused by the other available drafts in that language. C6 was not available, so the entire six-column batch is not certified. Compared openings/headings/endings with the three most recent same-language files in the available site-content snapshot (522–524; evidence saved in `voice-comparison.json`). This comparison is not a claim to have independently verified their live publication status, nor an endorsement of those articles.

## Sentence-variety gate

Fresh commands were run for every file, not copied from the writer's notes:

```text
python3 /Users/son7/tseng-col-1013-work/lint.py /Users/son7/tseng-col-1013-work/drafts/C4/<lang>.md <lang> taiwan-tenant-early-lease-termination-notice-penalty
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1013-work/drafts/C4/<lang>.md
```

| Language | Lint | Length | Variety exit / FAIL | CV | Very short sentences | Warning |
|---|---|---:|---|---:|---:|---|
| ko | OK | 3,497 characters | 0 / 0 | 0.474 | 12 / 96 | 88% end in 니다 |
| ja | OK | 4,312 characters | 0 / 0 | 0.498 | 16 / 109 | 95% desu-masu |
| en | OK | 1,598 words | 0 / 0 | 0.514 | 24 / 98 | None |
| zh-hant | OK | 2,685 characters | 0 / 0 | 0.517 | 19 / 96 | None |

Manual sections 5–6 check, independently of the automatic green:

| Item | KO | JA | EN | ZH |
|---|---|---|---|---|
| No stock hypothetical opening; distinct within available same-language batch | Met | Met | Met | Met |
| At least two very short sentences; no sustained long-sentence sequence | Met | Met | Met | Met |
| No paragraph-opening word occurs three times | Met | Met | Met | Met |
| No three consecutive claim–citation–caveat paragraphs; at least one citation-free scene/result paragraph | Met | Met | Met | Met |
| At most three contrast templates; no separate invented-rebuttal pattern requiring rejection | Met | Met | Met | Met |
| Closing stays on the column's subject; no copied disclaimer or sales ending | Met, wording note above | Met, wording note above | Met, wording note above | Met, wording note above |
| Required register / no invented personal experience / no imperative checklist headings | Met | Met | Met | Met |
| No fact, number, link, or fictional label lost through reviewer edits | Met: no edits | Met: no edits | Met: no edits | Met: no edits |

No mandatory MONOTONY failure is asserted. The register warnings do not require switching away from 합니다체/です・ます. The legal and native-wording findings still stand; passing a numerical variety gate does not validate meaning or idiom. Every legal revision must rerun both tools, particularly because KO and EN are only three characters/two words below their length ceilings.

## Writer fact-sheet limitations

The sheet is not a reliable description of the current revision. It still contains the removed categorical proposition about shorter-notice clauses being invalid, an obsolete description of the 存證信函 sentence, and notes that precedence between the subletting provisions was left unstated although the current draft now addresses it. Article 95/Article 34 content was therefore checked directly rather than inferred from this sheet. Required housekeeping: reconcile the fact sheet after the legal corrections; do not reintroduce deleted claims just to match it. The research statute transcription itself matched the official articles checked.

## Minor edits applied

None. All four draft files remain byte-for-byte as reviewed. Corrections affecting legal meaning, sources, or conditions were deliberately left for the writer, as instructed. The suggested wording changes above are not represented as completed edits.

Reviewed copies, SHA-256 values, command outputs, source responses, and comparison evidence are saved in `reviews/C4/evidence-astra-r2/`. The draft hashes are:

```text
ko       206c25f6f26c461de2241a0ccdfcb352cbb5f63afe8e8f39fc4aba3926402f55
ja       deae0f9199bf44a13b54de53fbe9dde4e0aae42ffac1648156ca3bde6ff473eb
en       4ba0ea01d8ec9e736037cf04a194208c7def056dcd8235cc3e7661babf8a4770
zh-hant  7dc4b99b67113a2239fe87e6adcdbb91afd8e37e76cdff79a66850b504880466
```

## Image verdict

REDO — delivery artifact missing. `/Users/son7/tseng-col-1013-work/images/C4.webp` does not exist, so the specifically requested hero could not be inspected or approved.

The available `images/C4.jpg` was actually viewed with the image tool. Visual content: OK. It shows an anonymous interior, packed moving boxes, a rolled mat, slippers, and a plant. It suits a tenant-move-out column, is respectful, and has no people/faces, readable text/documents, logos, flags, or identifying details. No real person or property is identifiable from the visible content. Its fictional production provenance cannot be proved from pixels alone; the assessment is of the supplied illustration.

Original — requested `C4.webp` absent; only a 1,280 × 720 JPEG is supplied → problem and reason — the final publication artifact is unavailable for the requested as-is gate → fix required — coordinator to export/provide the intended WebP from the approved scene and inspect the actual resulting file; no need to regenerate the composition → facts preserved — preserve the anonymous, text-free visual content. No image edit or conversion was performed. JPEG SHA-256: `a7a3a129e84172764fa961f5a74924ef9ca9cf0fd296eed00ef73a5ec4066773`.

VERDICT: FIX      (major issues remain; listed in the log)
