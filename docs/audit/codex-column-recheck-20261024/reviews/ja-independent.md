# Independent Japanese review — ARC revision

Review date: 2026-10-24. Final result: PASS after one bounded repair pass. The initial REQUEST_CHANGES record is retained below; its five findings are now resolved.

## Final reviewed versions

| Article path | Final SHA-256 | Result |
|---|---|---|
| `src/content/columns-ja/704-taiwan-arc-first-application.md` | `d17b21c9f769d191f6be4908a5c53383fc2432539e134973295830233deace12` | PASS |
| `src/content/columns-ja/705-taiwan-visa-residence-work-study-family.md` | `5f55c4c169670c13a77e22cea55799827c734e0e77c9310cfe73292d8609f6bc` | PASS |
| `src/content/columns-ja/706-taiwan-arc-renewal-changes-reentry.md` | `e4e2938ac4cd9a4fcec677ac4313f5983569bede7031ed1875bf615a326fd7e6` | PASS |

The author applied only the three summary replacements and the two passages at 706 lines 71/73. I read those passages and all three main-body endings again, checked the unchanged Article 16 paragraph at 705 line 71, and independently reran the exact CLI on each final file. Reversing precisely the five assigned replacements in memory reconstructed every initial reviewed SHA-256, proving that no other manuscript bytes changed during this repair.

704's summary now gives the actual deadline and purpose-specific documents/portals; 705's gives conditional direct residence and the distinct study/family criteria; 706 retains its three factual summary sentences without a contents announcement. The review/evidence/non-automatic-continuation rule in 706 is now one connected explanation, and its single pre-expiry inquiry covers both the applicant's category and derivative family status. No legal condition was removed. The ordinary-professional work-in-Taiwan condition, special-professional alternative, sponsor residence/APRC condition and eligible relatives at 705 line 71 are unchanged.

Final independent CLI execution:

```text
704 [ja] sentences=60 mean=39.2 cv=0.452 short=0.117 run3=0.052 opener_rep=0.15 cite_end=0.067 cite_para=0.3 contrast=1 caveat=0 q=0
  WARN 90% of sentences end in 'desu-masu' — vary endings within the register
  exit=0
705 [ja] sentences=50 mean=46.6 cv=0.452 short=0.16 run3=0.083 opener_rep=0.05 cite_end=0.06 cite_para=0.4 contrast=0 caveat=0 q=0
  WARN 92% of sentences end in 'desu-masu' — vary endings within the register
  exit=0
706 [ja] sentences=67 mean=41.7 cv=0.462 short=0.104 run3=0.092 opener_rep=0.12 cite_end=0.075 cite_para=0.52 contrast=0 caveat=0 q=0
  WARN 88% of sentences end in 'desu-masu' — vary endings within the register
  exit=0
```

FAIL 0. Section 5 was rechecked for the affected text: the shortened warnings do not remove the minimum meaningful short sentences, introduce a long-sentence chain or repeated paragraph opening, alter register, or weaken a statutory condition. No unresolved material Japanese editorial/legal-preservation issue remains within this review. Separate final legal review and root's rendering/publication verification remain required; this PASS is not a claim of publication.

## Initial review record — findings resolved above

Reviewer: independent AI Japanese editorial role `/root/review_rev2_ja`. I did not author or edit these manuscripts. I make no claim to be a human native speaker or a licensed lawyer. Only this report was written. Other agents' manuscripts and records were preserved.

The body revisions are materially better than the published originals. They explain the effect of each document and procedure instead of continually telling the reader to check something. There is no identified substantive legal correction in this review. Two residual patterns still require a narrow repair: all three summaries end with the same announcement of what the article will explain, and the retirement/graduation section of 706 repeats review requirements and inquiry instructions. This is not a request to rewrite the three articles again.

## Frozen versions reviewed

Repository: `/Users/son7/tseng-arc-revision-20261024/repo`. Original versions were read in full with `git show 174454bd4bb8d9e05627d71f9ef0af646540b3e4:<path>`; revised versions were read in full, including titles, summaries, FAQ, headings, ending, and source list.

| Article path | SHA-256 | Result |
|---|---|---|
| `src/content/columns-ja/704-taiwan-arc-first-application.md` | `376b5c0b69a7e2e5f4e24bbef8443724a39cd6f3ea8510308643b8f55ffc02a4` | REQUEST_CHANGES: summary only |
| `src/content/columns-ja/705-taiwan-visa-residence-work-study-family.md` | `e1a15d542a85ef969ee4e76b409d5b826a5ac0fe76f58ea478823ff28d2567e8` | REQUEST_CHANGES: summary only |
| `src/content/columns-ja/706-taiwan-arc-renewal-changes-reentry.md` | `651e484d18d326fd59ae035ff5e0e2ba9584052332e8eb8e56a14be0cfaf4752` | REQUEST_CHANGES: summary and lines 71, 73 |

Read in full: INDEPENDENT-REVIEW.md, REVISION-BRIEF.md, repository AGENTS.md and EDITORIAL-VOICE.md, COLUMN-VOICE-RULE.md, SENTENCE-VARIETY-RULE.md, LESSONS.md, skill SKILL.md and review-criteria.md, ja-author.md, and source-refresh.md. The retired Fable requirements were not applied.

## Required bounded repairs

All paths in this table are under `src/content/columns-ja/`. These are editorial findings; none changes eligibility, a legal period, amount, exception, or source.

| File:line | Exact sentence or smallest necessary span | Reason | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| `704-taiwan-arc-first-application.md:4` | 「旅券や居留目的の証明に何を添えるのか、専門人材・学生・移住労働者はどこへ申請するのか。写真の規格、手数料、補正通知への対応、カードの受け取りまでを説明します。」 | MONOTONY: summary announcement — the paired question fragments lead into a contents announcement, and all three summaries use the same last verb. The opening factual sentence already supplies a better model. | Keep the first sentence. Replace the quoted remainder with 「提出書類と申請先は居留目的によって異なり、専門人材・学生・移住労働者にはそれぞれのオンライン手続があります。」 The body still retains photos, fees, supplementation and collection. | Yes. It removes a preview, not a substantive condition. |
| `705-taiwan-visa-residence-work-study-family.md:4` | 「専門人材の就職、大学への留学、中国語学習、家族との同居について、使える申請経路と就労許可との関係を説明します。」 | MONOTONY: summary announcement — another list of covered topics followed by the same explanatory promise. | Keep the first sentence. Replace this sentence with 「専門人材には要件を満たせば入国後の直接申請が認められます。留学や家族との同居では、入国時の査証、学校の種類や学習期間、台湾側の家族の資格に応じて申請経路が決まります。」 Author may choose a shorter factual formulation with the same limited scope. | Yes. Each proposition is already qualified in the body; no universal professional or family entitlement is introduced. |
| `706-taiwan-arc-renewal-changes-reentry.md:4` | 「旅券の更新、カードの紛失、一時帰国が重なる場合の手続を説明します。」 | MONOTONY: summary announcement — the third identical ending. The preceding three sentences already form a useful factual summary. | Delete this last sentence; retain the first three. | Yes. The passport, loss and travel sections remain in full. |
| `706-taiwan-arc-renewal-changes-reentry.md:71` | 「適用には審査が必要です。事情を示す証明資料が必要で、居留が自動的に続く制度ではありません。」 | MONOTONY: consecutive warnings — the short review warning, a second “necessary” clause and an automatic-continuation rebuttal reproduce the original mechanical stop/start rhythm. The discretionary exception should remain, expressed once. | 「適用は事情を示す証明資料に基づいて審査されるため、居留が自動的に続くわけではありません。」 Keep the preceding statutory principle, examples, link and 「許可できる」. | Yes. Evidence, examination and absence of automatic continuation all remain; permission stays discretionary. |
| `706-taiwan-arc-renewal-changes-reentry.md:73` | 「全員に同じ求職期間が付く制度ではないため、自分の区分に対応する延長の要件を満たすか、満了前に移民署へ照会します。本人を基礎に家族も居留している場合は、家族の許可についても併せて移民署へ照会します。」 | MONOTONY: repeated action ending — two consecutive sentences end with the same office/inquiry action when one inquiry covers both related questions. | 「全員に同じ求職期間が付く制度ではありません。満了前に移民署へ、自分の区分に対応する延長の要件と、本人を基礎に家族が居留している場合には家族の許可の扱いを、併せて照会します。」 Keep the preceding sentence and Articles 10/11 link. | Yes. The category condition, non-universal period, pre-expiry timing and derivative family status are retained. |

The proposed versions are repair directions, not reviewed final manuscripts. They must be measured and read in context after the author applies them. No fact should be cut merely to retain a metric.

## Substantive improvement already achieved

- 704 old 「まず旅券を開きます。」 is gone. The new line 33 identifies the passport/entry records and residence-purpose evidence, then explains visa-first versus direct residence. It connects evidence to the choice instead of adding a metric-length filler sentence.
- 704 old 「写真の期限も確認します。」 is replaced at line 50 by the actual distinction between visa and ARC photographs, followed by the six-month and two-year rules. The short 「ARC用は2年以内です。」 now conveys a number the reader needs.
- 705 old 「働く許可はさらに確認します。」「ARCだけでは決まりません。」 become one coherent Article 43 paragraph at line 33: employer permit principle, statutory exception, then the job/employer/period information needed by HR. The work permission has not become an exceptionless prohibition.
- 705 separates university degree study from Mandarin study. This is a useful structural distinction because the study duration and weekday attendance conditions belong to the latter, rather than a generic checklist shared by all students.
- 706 old 「日付だけでは判断できません。」 and 「まずカードの記載を見ます。」 are deleted. The introduction gives the consequence of a changed residence basis; the re-entry section directly states the permission rule and APRC exception.
- Ending paragraphs differ usefully: 704 retains the reference/payment/approval records; 705 supplies nationality, purpose, route, location and dates to the school or employer; 706 gathers the card, passport, change-date evidence and return date. None ends in a generic sales promise.

The です・ます register is consistent. 「照合します」 has not replaced every old 「確認します」 mechanically: most passages were recast around the document or consequence. Existing legal distinctions and actual document tables justify their remaining lists. No invented anecdote, personal credential, public byline, bold emphasis, extra consultation language or promised approval appears.

## First-two-paragraph deletion test

| Article | Sentence-by-sentence result |
|---|---|
| 704 lines 27, 29 | P1S1 must stay: it carries entry on a resident visa, agency, obligation, 30 days and next-day starting point. P1S2 adds that work/school commencement is not that clock; the practical distinction is relevant to this audience. P2S1 must stay: domestic visa issuance has its own issue-date clock. P2S2 must stay: direct residence has eligibility conditions and this is not a universal 30-day conversion window. No content-free opening sentence remains. |
| 705 lines 27, 29 | P1S1 supplies the actual decision—degree admission followed by visa-exempt entry—rather than a generic “what is a visa” introduction. P1S2 answers it with the BOCA restriction. P2S1 defines the permitted short-stay purpose/period; P2S2 separates the resident-visa and NIA residence/ARC offices. Deleting either paragraph would remove a distinct premise needed for the later routes. |
| 706 lines 27, 29 | P1S1 gives an earlier change-registration deadline while a card remains unexpired. P1S2 adds the separate loss-of-basis/cancellation consequence. P2S1 identifies the ordinary renewal window and source. P2S2 prevents treating that window as a post-expiry period and leads to timely submission. All four sentences add relevant information. |

## Independent comparison with three recent Japanese firm articles

I personally read all three current files, including their frontmatter and full bodies, independently of the author's comparison. All three have publication date 2026-10-24. Their live publication was not separately reverified here. They are comparators, not flawless style models or legal targets of this review.

| Path under `src/content/columns-ja/` | Concrete comparison |
|---|---|
| `718-taiwan-customer-reorganization-bankruptcy-japanese-supplier-claims.md` | Opens with a shortest ten-day claim-filing period and then company eligibility; 「次の出荷を止められるか」 names a supplier's decision. The practical close names invoices, shipment records and receipt evidence. 704 similarly starts with an operative deadline, while 705's question and 706's changed circumstances avoid repeating a numerical opener for all three. The comparator's 「短い期間です。」 and 「救済の余地は小さいものです。」 add little and are not a reason to accept fillers in ARC articles. |
| `719-taiwan-promissory-note-security-court-ruling-enforcement-japanese.md` | Opens with an explicitly fictional security-note transaction and a concrete question. Headings move from validity to issuer liability, enforcement, dispute and limitation. It closes around the physical original and transfer from Japan. The ARC series needs no fictional vignette; its procedure/document endings are more direct. The comparator's 「相手を選ぶ手続です。」 repeats the preceding issuer-only rule and was not treated as desirable brevity. |
| `720-taiwan-supplement-health-food-advertising-rules-japanese-brands.md` | Opens with a specific prohibited advertising claim and sanction; the body distinguishes medical efficacy, misleading statements and the regulated “health food” category. It closes with a Japanese/Chinese comparison table for actual advertising copy. The ARC study subsections likewise need their own eligibility-based structure. The comparator's 「審査の物差しが違います。」 is an abstract restatement, which reinforces the need to remove the residual review-warning chain in 706. |

## Numbers, links and law

Independent script comparison against the base found 17 / 19 / 21 unique linked URLs respectively, with no URL removed or added. The source sections are byte-for-byte unchanged. Numeric-token sets after removing link destinations have no missing original token. These are bounded mechanical checks; the manual checks below establish relationships and conditions.

- 704: 30 days remains next-day after arrival versus issue-date after a domestic resident visa; integrated valid documents remain an exception. ARC photo two years and visa photo six months remain distinct. One-month employment/enrolment evidence, Taiwan household registration and resident spouse, spouse attendance and first-grant one-year ceiling remain. The employment/student/migrant portals remain qualified; the student payment/collection clocks (five business days after approval; three after payment; electronic ARC up to six months) are not universal processing guarantees. NT$1,000/year including part-year and the NT$2,200 direct-route addition remain; overseas compatriot reduction is not generalized to all foreign students.
- 705: direct professional residence keeps visa-exempt/visitor entry plus professional-work permission or exemption, and the trial/TAC exclusion with its separate-rule exception. The four completed months, at least three further months, 15 weekday hours and absence including leave no more than one quarter are preserved for Mandarin study. Degree-study and Mandarin-study restricted entry routes remain distinct. The Taiwan-spouse path retains residence/household registration, Taiwan marriage registration and the qualified 60-day visitor-visa conditions. Article 16(2) correctly attaches actual professional work in Taiwan to ordinary foreign professionals and separately names special professionals; the residence/APRC sponsor condition applies to both. The spouse, minor child and qualifying disabled adult child categories remain, with no parent entitlement. The Taiwan-spouse employment exemption is not extended to every foreign couple.
- 706: three months remains pre-expiry; Gold Card and entrepreneur guidance remain separate. Change of address/workplace is next-day +30, residence-ground change is occurrence-day +30, and the qualified BOCA alternative is occurrence-day +15. Reissue/reassessment, cancellation with individually assessed exceptions, and non-universal job-search extension remain. Passport registration has no invented universal deadline. Loss declaration OR police proof, damaged-card surrender and NT$500 remain. Overseas proxy/authentication and legacy migrant single-entry distinctions remain. Re-entry permission/APRC exception and receipt insufficiency remain; less-than-30-day overstay plus continued original grounds allows reapplication after disposition, not automatic extension.

I directly reopened these official pages in this review, in addition to reading the source refresher's complete ledger:

- [Foreign Professionals Act Article 16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16), [full text](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=A0030295) and [history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295): the sponsor distinction in 705 line 71 matches paragraph 2. The history separately records the 2025-09-24 promulgation and 2026-01-01 commencement for this provision; later commencement applies to separately listed provisions.
- [Immigration Act Article 31](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31): the 30-day next-day change registration, cancellation/continuation exceptions and limited post-expiry reapplication remain qualified.
- [Residence Regulations full text](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129), Articles 7 and 9, and its [history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=D0080129): occurrence-day clocks and ordinary pre-expiry renewal were read from current text. A direct single-Article-7 URL initially failed; the full official text was available. The legal history was accessed through its official full-text link after a direct history request failed.
- [NIA 0902](https://www.immigration.gov.tw/5475/5478/141465/141808/141970): evidence, collection/processing and spouse conditions were checked as administrative guidance, not new legislation.
- [BOCA domestic resident-visa ARC deadline FAQ](https://www.boca.gov.tw/fp-398-723-7b71f-1.html): the issue-date clock is preserved separately from arrival-next-day.

No claim is made that this locale review freshly opened every retained URL; the remaining official refresh evidence is `work/research/source-refresh.md`, and the separate final legal reviewer owns the full cross-language/current-law judgment. The relevant official database displayed a compilation cutoff of 2026-10-16. This is not a search of every gazette after that cutoff. The source refresher's Article 12 graduate-work exception is not contradicted: 705's student work paragraph is within degree study, and 706 makes no blanket prohibition on work by graduates.

## Images and presentation text

I opened all three actual WebP files with `view_image`, not only their filenames. They depict illustrated still lifes, each with Taipei visible through a window. 704 contains a blank blue travel booklet, document folder/papers, plain card and pen. 705 contains a closed laptop, books, two mugs and booklet. 706 contains a blank open notebook, booklet, plain card, keys and travel bag. No visible person, readable document text, official card replica, flag or logo appears.

The Japanese alt text accurately describes the principal visible objects. It need not enumerate every background object or the pen/bag to be accurate. The captions correctly indicate illustrative scenes rather than actual IDs or an applicant's belongings. No author attribution is embedded. Actual responsive rendering and deployed image delivery remain root's integration task.

## Actual variety CLI and section 5 review

Executed independently for each file:

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <absolute article path>`

```text
704 [ja] sentences=60 mean=39.2 cv=0.452 short=0.117 run3=0.052 opener_rep=0.15 cite_end=0.067 cite_para=0.3 contrast=1 caveat=0 q=0
  WARN 90% of sentences end in 'desu-masu' — vary endings within the register
  exit=0
705 [ja] sentences=50 mean=46.6 cv=0.452 short=0.16 run3=0.083 opener_rep=0.05 cite_end=0.06 cite_para=0.4 contrast=0 caveat=0 q=0
  WARN 92% of sentences end in 'desu-masu' — vary endings within the register
  exit=0
706 [ja] sentences=68 mean=41.2 cv=0.466 short=0.118 run3=0.091 opener_rep=0.12 cite_end=0.074 cite_para=0.52 contrast=0 caveat=0 q=0
  WARN 88% of sentences end in 'desu-masu' — vary endings within the register
  exit=0
```

1. FAIL 0 on all three; no checker changes. Metrics alone do not resolve the findings above.
2. Openers are a filing obligation, a reader's degree-study question, and a change-before-expiry consequence. No stock hypothetical.
3. There are multiple meaningful short sentences about photo age, partial-year fees, attendance, spouse attendance and applicant identity. The residual unnecessary warning stop in 706 line 71 is specifically requested for repair. Necessary figures should not be removed for rhythm.
4. Vertical paragraph-start reading finds no threefold identical opening word. No excessive repeat of 台湾では/台湾の.
5. No three successive claim/citation/ただし paragraphs. Practical paragraphs without a new legal claim supply a citation-free change of rhythm. Line 71's warning cluster remains a smaller but real editorial issue.
6. Contrast measurements are 1/0/0; the important direct-residence, work-permission and expiry distinctions remain legally justified. No invented reader position is used as a broad rhetorical opponent.
7. Main-body endings are article-specific and do not promise outcomes or append the same contact pitch. The separate source scope/date section is not treated as the main-body close.
8. Consistent です・ます; no bold, invented first-person experience, public author or claimed human/lawyer review. 705 and 706 contain natural 「でしょうか。」 questions; the punctuation-based q=0 does not mean they lack a reader question. 704 needs no artificial body question in addition to its factual procedure and FAQ.
9. Original URLs, sources, figures and manually checked legal conditions remain. No substantive legal repair is being smuggled into a fluency change.

## Initial repair request — completed in the final recheck above

The requested repair was limited to the three summaries and 706 lines 71/73, followed by final hashes and the unchanged variety checker. That repair and my independent recheck are complete, as recorded at the top. No other Japanese body rewrite is requested. This report does not certify final legal review, rendering, image delivery or publication.
