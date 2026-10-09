# Korean publication development record — 2026-10-08

Owner: `/root/market_kr`. Role: Korean editorial specialist AI; no human native-speaker identity or attorney qualification is claimed. This record is author evidence, not independent approval. Parent supplies independent language and legal/publication review.

## Scope and inputs

Only the two new Korean publication manuscripts and this record were changed. No Git mutation, repository edit, deployment, external submission, or contact was performed.

Original drafts were read and preserved byte-for-byte:

- `outputs/four-market-columns/kr/01-taiwan-equipment-engineer-work-permit.ko.md`: SHA256 `0320ef0126dac91e68fe9d7cf8ffc89d888fe878c2dad7b83c4350ff857b9106`
- `outputs/four-market-columns/kr/02-taiwan-ai-distributor-contract.ko.md`: SHA256 `a515191f699f949103b1d85c57715124df7772977b47264092b9a1d6cc47ca17`

Applied instructions: full `/Users/son7/.codex/agents/tseng-editor-ko.toml`, `/Users/son7/.codex/skills/tseng-law-editorial/SKILL.md`, its review criteria, and full current `origin/main:docs/columns/EDITORIAL-VOICE.md`. Current read-only comparison commit: `58e184f648f966438c83b9ce95f0a268323e4894`. Internal `author: legal-ai-assistant` is retained. Publication integrator owns schema conversion and public presentation; no AI author footer or fictitious attorney review was added.

## What the publication revisions improve

### KR01 — equipment/AI engineers

Reader: Korean equipment supplier or manufacturing AI company with a planned Taiwan installation, commissioning, adjustment or support visit. Immediate decision: identify actual work, contract route and applicant before committing personnel and on-site dates.

- Linked supplier, actual employer and dispatching entity instead of assuming the equipment sales contract covers another company's personnel.
- Kept the statutory actor wording “대만 측과 해외 측 계약 당사자”; avoided ambiguous “국내외”.
- Separated Article 5's stay ≤30 deemed-permit rule from Article 12's application within 30 days after entry for its 31–90-day category. A 45-day hypothetical illustrates preparing before departure; it does not promise permission to perform any work immediately.
- Added a separate 60+45=105-day hypothetical to explain the preceding year plus current application aggregate. No assertion that the three alternative qualifications in Standards Article 5(1),(2),(4) must all be held. No conflation of qualification relaxation with work permit exemption.
- Connected documents to the real contract/task plan and possible overseas authentication, then explained change/extension as a fresh scope check rather than an automatic entitlement.
- Added the practical distinction between the application date under labor rules and issuance date under BOCA's contract-performance visa conversion rule. No processing time guarantee or invented immigration deadline.
- Preserved separation from 183-day tax and existing Korean tax article. No broad restatement of already-published tax advice.

### KR02 — AI distribution

Reader: Korean manufacturing AI vendor considering Taiwan exclusivity. Immediate decision: negotiate rights before signing a distributor's draft.

- Moved from a general exclusivity warning to choices between customer location, contracting entity and installation location, including global-HQ procurement.
- Specified reserved existing accounts, subsidiaries/new factories/expansion/renewal; direct sales can coexist with separately negotiated local support compensation.
- Distinguished product versions and future modules, installation rights, modification/embedding and downstream resale. These are negotiation recommendations, not assertions of mandatory statutory clauses.
- Made target measurement and post-shortfall choices concrete without asserting they automatically validate exclusivity.
- Distinguished wholesale supply price, independent resale price and genuine HQ direct-customer pricing. Preserved justifiable-reason exception and services coverage of FTC Article 19; preserved competition-restraint condition and fact-dependent assessment under Article 20(5).
- Reworked continuity around remaining customer obligations, HQ/new-distributor support choice, compensation/prepayments, customer consent where needed, access control and a workable technical handover.
- Kept the corrected actors “한국 본사와 대만 총판” for data-transfer agreement. Distinguished service continuity data from new-marketing use and made transfer scope/permissions/remaining copies an operational choice subject to privacy and customer obligations. Did not assert that all transfers require consent or that a distributor agreement alone establishes a PDPA ground.

## Current official sources reopened during this publication run

All dates below are access/review date 2026-10-08 unless a source's own date is stated. A source's website update date is not treated as proof that its law was amended on that date.

| Official source | Relevant confirmation | Currency / limitation |
| --- | --- | --- |
| [MOL Employment Service Act](https://laws.mol.gov.tw/FLAW/FLAWDAT0201.aspx?id=FL015128) and [MOJ history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=N0090001) | Article 43 basic permit rule; Article 51(3) foreign corporation's contract-performance route and applicant when no Taiwan branch/representative office. | MOL currently labels 2025-01-20 amendment. MOJ history shows latest amendment concerns Article 46; not a new change to the cited 43/51. MOL data cutoff 2026-09-30. |
| [MOL employment permit/management regulations](https://laws.mol.gov.tw/FLAW/FLAWDAT0201.aspx?id=FL028065) | Articles 5, 9 and 12 reread in Chinese. Article 12 says 入國後三十日內. Article 9 includes preceding-year aggregate graduation-document exception and possible foreign-document authentication. | Current amendment label 2025-12-30; MOL cutoff 2026-09-30. Direct standard-certificate curl read succeeded after web parser timeout / Python certificate-validation issue; TLS verification was not disabled. |
| [MOL qualifications/review standards](https://laws.mol.gov.tw/FLAW/FLAWDAT0201.aspx?id=FL028069) | Article 7's covered contract-performance work ≤90, preceding year + current work-period aggregate >90 proviso, and Article 5 alternative qualifications. | Current amendment label 2024-08-01; MOL cutoff 2026-09-30. No unsupported claim about universal academic/work-experience requirements or exemptions under other professional-talent routes. |
| [WDA contract-performance personnel](https://ezworktaiwan.wda.gov.tw/cp.aspx?n=79363C2C4E607E24) | Confirms professional/technical or statutory management work within the contract and links to qualifications/documents. | Its page's own update is 2018-08-10; used with fresh MOL statutes, not as proof of all 2026 details. |
| [BOCA visa-exempt entry](https://www.boca.gov.tw/fp-149-4486-7785a-1.html) | Korea up to90-day visa-exempt category; activities needing permits still need them. Contract-performance work permit issuance before or within30 days of entry is a condition in the relevant work-visa conversion route. | Page dated 2026-07-17. Article does not generalize to all foreign passports and does not reproduce ambiguous English wording about the precise 8-working-day application cutoff. |
| [FTC current Fair Trade Act of2017](https://www.ftc.gov.tw/internet/english/doc/docDetail.aspx?uid=644&docid=15182) and [MOJ history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=J0150002) | Articles19 and20(5), service application, justifiable reason, likely restraint of competition. Latest2017 change concerned11. | Reached through current agency “Fair Trade Act” index, which lists2017 edition. Older agency id18 is2015 and was not used as the sole current-law source. |
| [FTC suggested resale prices](https://www.ftc.gov.tw/internet/english/doc/docDetail.aspx?docid=14458&uid=1444) | Suggested price alone vs enforced fixed price/discount prohibition. | Own update2026-05-22, agency footer2026-10-07. |
| [FTC territorial restrictions](https://www.ftc.gov.tw/internet/english/doc/docDetail.aspx?docid=14468&uid=1445) | Not per se prohibited; purpose/market position and structure/product/effects. | Own update2026-05-29; statutory restraint-of-competition condition retained. |
| [PDPC current statutory text](https://law.pdpc.gov.tw/LawContent.aspx?id=FL010627), [PDPC history](https://law.pdpc.gov.tw/LawContentSource.aspx?id=FL010627), [MOJ19](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0050021&flno=19), [MOJ20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0050021&flno=20) | Specific purpose and applicable ground for non-government collection/processing; necessity within specific purpose or statutory exception for other use. | PDPC history:19/20 amended2015-12-30, effective2016-03-15. 2025-11-11 amendments did not amend19/20; affected provisions remain flagged awaiting effective date in source. No claim that all2025 amendments are effective. PDPC system updated2026-09-29. |

MOJ footer cutoff is2026-09-24. This run therefore independently read MOL (cutoff9/30), FTC live current law/FAQ pages and PDPC agency text/history. Searches scoped to October2026 amendment announcements returned no relevant new amendment, but search silence is not proof none exists. Do not describe the database retrieval as exhaustive government-gazette clearance through10/8; final reviewer may escalate if a later official announcement is identified.

Manuscript links point to precise MOJ clauses near claims, with current agency corroboration recorded here. The internal tax article and contact destination were already confirmed live during the prior independent Korean review. No fictional new service page was added.

## Fresh comparison with three latest Korean articles

Read-only enumeration used `published` date and descending filename as the tie-breaker. All three are dated2026-10-08 at the current commit above; their full manuscript bodies were read.

| Comparator | Observed writing choice | Application to these two articles |
| --- | --- | --- |
|428 “대만에서 휴대전화·지갑이 없어졌을 때: 도난 신고와 분실 접수”|Starts with concrete document terms and action; explains different procedures without an industry preface.|KR01 starts with actual on-site tasks and connects employer/contract/applicant. It uses examples only when arithmetic or procedure differs.|
|427 “대만 성폭력 피해 후 병원과 경찰에서 받을 수 있는 지원”|Immediate reader situation, narrow principle/exception, practical next action without invented experience.|KR01 preserves scope and exceptions before schedule decisions; KR02 presents negotiation options as options, not legal guarantees.|
|426 “대만 가게 후기와 온라인 댓글, 명예훼손·모욕은 어디서 갈리나”|Distinguishes legally different acts, cites authority near the claim, explains evidence context.|KR02 distinguishes pricing relationships and account handover from lawful data use, with nearby19/20 references. Neither new article copies the comparator question opening or fixed subsection pattern.|

No existing-tax duplication: KR01 does not repeat238/371's183-day/PE analysis. No general-market-entry or110 supplier warranty/payment duplication. KR02's core is channel authority, price and customer continuity, not generic AI IP ownership or unpaid invoices.

## Opening deletion test — sentence level

KR01 paragraph1: sentence1 supplies Korean supplier, Taiwan fab and hands-on task trigger; sentence2 supplies permit default and legal source; sentence3 explains mixed itinerary classification. Deleting any loses a distinct premise. Replaced the earlier generic “현장에서 수행할 업무와 적용 가능한 예외를 먼저 구별해야 합니다” with a specific mixed-itinerary sentence.

KR01 paragraph2: sentence1 ties own employee dispatch to a contractual obligation; sentence2 defines Article51(3)'s work/contract route; sentence3 prevents a factory-work blanket reading. Each materially narrows the route. No “AI/semiconductor industry is growing” preface.

KR02 paragraph1: sentence1 identifies existing and inbound customers as the signing decision; sentence2 names renewal/global procurement/future-product ambiguities. Both are needed to establish what “Taiwan exclusive” leaves open.

KR02 paragraph2: sentence1 identifies the customer contracting entity; sentence2 separates resale and genuine introduction/direct contracting; sentence3 links concrete documents to price/payment/support negotiations; sentence4 prevents name-based classification. Kept concise and did not add abstract “risk management” framing.

## Author checks and frozen handoff

- Full manuscripts self-read after editing; standard Korean 합니다체; short substantive subheadings; no bold or invented client/attorney experience.
- Each has one verified `/ko/contact` CTA. First inquiry asks only product/parties/tasks/schedule and limits premature passport/customer/model transmission.
- Draft frontmatter and H1 retained. Internal provenance retained; no independent-review result asserted by author.
- Body character counts excluding URLs: KR01 3,201; KR02 3,553. Expansion is tied to actual reader decisions and legal qualifications, not filler or forced lists.
- Original input hashes rechecked and unchanged.
- Ready for independent language and legal review; not independently approved or deployed by this lane.

Frozen publication SHA256:

- `outputs/publication-20261008/articles/ko/01-taiwan-equipment-engineer-work-permit.md`: `ee233cc8bf40618569e6487bc0b4d4eddc7bc3a78d2158989a2553c4592ac237`
- `outputs/publication-20261008/articles/ko/02-taiwan-ai-distributor-contract.md`: `69f6be978c425b8289d289ff8ceb2e0d277accd16cc5cddbfe2bde2b1cd0a3f9`

## Bounded independent-review repair — 2026-10-08

Independent Korean reviewer identified an ambiguous timing actor in the integrated KR01/497 example. Only “신청자가 입국 후 30일 이내에 제출할 수 있도록” was changed to “신청자가 해당 인력의 입국 후 30일 이내에 제출할 수 있도록”. The added words clarify whose entry starts the period; the 30-day deadline and all other article text are unchanged. Exact reverse substitution restores the pre-repair bytes and their recorded hash. Original drafts and KR02 remain untouched. Publication integrator alone owns propagation into the repository target. The revised KR01 hash above is frozen for review.
