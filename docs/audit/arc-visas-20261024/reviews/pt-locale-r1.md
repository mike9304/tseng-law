# Independent pt-PT locale review — ARC/visa 704–706

Reviewer: `/root/review_pt`, independent AI European Portuguese editorial reviewer. I did not author these articles. This is not human-native or lawyer certification, a legal opinion, or publication approval. My only writable file is this report; manuscripts and shared materials remain read-only.

Review date: 2026-10-24 KST.

## Exact-hash verdicts

Status: independent content review complete for all three frozen articles. Articles 704 and 705 PASS; article 706 REQUEST_CHANGES for one narrow scope clarification below. This is a bounded editorial verdict, not quantitative pt validation or publication readiness.

The earlier preparation hold was resolved when root supplied the frozen author handoff. I read `work/pt-author.md`, independently ran `shasum -a 256` (exit 0), matched all three listed hashes, and read every complete manuscript including metadata and FAQs. A separate read-only Node check also reproduced these exact hashes.

| Manuscript under `repo/src/content/columns-pt/` | SHA-256 | Verdict |
|---|---|---|
| `704-taiwan-arc-first-application.md` | `8fb040a119c50849c6fe9511d12c3c4c18165e003e9cf39104447055ba51a147` | PASS |
| `705-taiwan-visa-residence-work-study-family.md` | `bb411e5b88654f5d0532256739627cb8f7d15ab96b212b3131ec1973b84e796c` | PASS |
| `706-taiwan-arc-renewal-changes-reentry.md` | `9e40d5778fa669a9b42033fa54591907e5a985d05499a58363658c079107e94b` | REQUEST_CHANGES |

Required findings: 704 = 0; 705 = 0; 706 = 1. No repair round has yet been used. Recheck only the repaired 706 passage, affected conclusions, current hash and exact CLI; the two unaffected articles need not be rewritten.

## Required finding

| File:line | Exact sentence | Reason and evidence | Proposed bounded rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| `repo/src/content/columns-pt/706-taiwan-arc-renewal-changes-reentry.md:42` — PT706-R1 | “A conclusão dos estudos tem uma via específica. O artigo 11.º do regulamento permite pedir, antes da expiração, uma prorrogação após a graduação: se aprovada, prolonga a residência por um ano a contar do dia seguinte ao termo anterior.” | This immediately follows the Mandarin-course paragraph at line 40. “A conclusão dos estudos” does not identify the qualifying academic route, so a reader finishing Mandarin can read the one-year plus one-year paragraph as their next step. The later associate-degree condition expressly governs work, not the preceding residence extension, and does not cure that ambiguity. [Regulation 11](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080129&flno=11) addresses graduation; [NIA 0902 notes 10(b), 11 and 14](https://www.immigration.gov.tw/5475/5478/141465/141808/141970) distinguish formal academic graduation from non-formal programs and exclude Mandarin-center students from the listed completion-certificate path. This is a local scope clarification, not a request to add another program survey. | Replace only these two opening sentences with: “Quem conclui um programa de ensino formal em Taiwan pode pedir, antes de a residência expirar, a prorrogação prevista no artigo 11.º do regulamento. A simples conclusão de um curso de mandarim não dá acesso a esta via. Se o pedido for aprovado, a residência é prorrogada por um ano a contar do dia seguinte ao termo anterior.” Retain the existing second-extension sentence and the separate associate-degree-or-higher/NIA-approved-extension work condition. Keep the official source link. | Substantive narrowing of an ambiguous eligibility description. The approved one-year period, next-day start, possible second application, two-year maximum and separate work condition are preserved. Do not label the added eligibility boundary as purely stylistic. |

Optional style preferences: none submitted. There is no required MONOTONY finding; the remaining repair concerns legal scope in context, not the unsupported checker's Korean counts.

## Bounded article observations

- 704: the first-card clock, domestic-visa-issuance clock, integrated-document exception, purpose-specific documents, distinct application channels and approval/payment/collection stages are clear. The language does not grant every visitor a conversion right. The fees and processing periods retain their limits. The practical order is usable in pt-PT.
- 705: Portugal's 90-day example is expressly limited to eligible Portuguese passports; Brazilian and other Portuguese-language readers are directed to their own entry. Article 16 uses current numbering and limited professional eligibility. Degree and Mandarin routes, approved Taiwan-spouse residence and the work-permit exception remain distinct. The article does not promise dependent work rights. I read NIA 0915's trial/TAC/ABTC/working-holiday exclusions; the manuscript's qualified legal overview does not purport to establish eligibility for those schemes, so adding their full list is not required here.
- 706: the three-month ordinary window and four-month special windows are separated; the entrepreneur business-based and no-business routes are distinct. Address/workplace and residence-purpose clocks have different starts. Passport updates, overseas loss and pending travel are not presented as automatic permission. The graduate work statement correctly preserves the Taiwan associate-degree-or-higher condition and NIA-approved extension. PT706-R1 is confined to the preceding residence eligibility description.

## Rules and preparation completed

Read in full: `work/LOCALE-REVIEW.md`; editorial SKILL.md and `references/review-criteria.md`; repository AGENTS.md and EDITORIAL-VOICE.md; COLUMN-VOICE-RULE.md; SENTENCE-VARIETY-RULE.md; LESSONS.md; BRIEF.md; research-arc.md; research-paths.md. Read the Portuguese and shared applicable sections of research-europe.md, and the final-core.md source preflight, including its Gold Card/entrepreneur exception sources. The retired Fable requirements and old public bylines do not override current instructions.

The manuscripts use professional pt-PT (`pedido`, `morada`, `entidade empregadora`, `registo`, `levantamento`) and explain Taiwan institutions and legal categories. Portuguese language does not imply Portuguese nationality, Brazilian nationality, or a shared visa-exemption rule. AIMA/Portuguese residence and Brazilian CRNM are not substituted for the Taiwan procedure.

## Three actual same-locale comparators read

I independently read the openings, section headings and endings in the actual local files below. Their dates are local metadata, not independently verified current publication status.

| Local comparator in `repo/src/content/columns-pt/` | Date displayed / lastmod | Concrete comparison baseline |
|---|---|---|
| `018-taiwan-semiconductor-market-entry.md` | 17 September 2026 / 2026-10-07 | Opens with headquarters receiving several operational demands, then asks whether company formation solves them; follows numbered classification sections and long first-contact instructions. New 705 should deal with personal work/residence qualification rather than recreate subsidiary/branch/agent advice. |
| `011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md` | 4 February 2026 / 2026-07-25 | Opens with a long sequence of who imports, when registration finishes, who maintains the PIF and how labels are assessed; second paragraph forecasts the article. New series should give the applicant's concrete decision directly. |
| `016-taiwan-inheritance-custody-analysis.md` | 13 September 2025 / 2026-10-11 | Opens with a family-death event and a multi-issue list, then separates overlapping legal categories; numbered headings and a long educational disclaimer. This is older corpus material, not a 2026 publication. Its public attorney footer is not a pattern to copy. |

The new openings are distinguishable from these comparators and from each other: 704 starts with the first-card deadline, 705 with the effect of visa-exempt entry, and 706 with loss of the residence basis despite the card's date. They do not repeat the older corpus's article forecasts. Their sections follow respectively an application, a choice of residence purpose and changes after issue. The endings give an article-specific next action followed by series links and sources. There is no copied long sales footer or public attorney/AI byline. The 705 company paragraph stays within the residence distinction and does not reproduce comparator 018's corporate-entry advice.

### First-two-paragraph deletion test

| Article / lines | Result after checking each opening sentence's function |
|---|---|
| 704 / 28–30 | Keep. The first paragraph supplies the ARC definition and clock, its controlling statutory source and the integrated-document exception. Removing the source sentence would remove the immediate authority for the stated clock; removing the exception would overstate the rule. The second paragraph's question selects the reader's entry route; the following sentences distinguish legal eligibility, NIA categories and the purpose-based article. None is an interchangeable scene-setting paragraph. |
| 705 / 29–31 | Keep. The first paragraph distinguishes visiting from permission to reside/work and preserves the possibility of a qualifying change. The second supplies the Portuguese-passport example and conditions, then prevents Portuguese-language readers with other passports from applying that example to themselves. Each sentence changes what the reader can safely infer. |
| 706 / 28–30 | Keep. The first paragraph identifies the risk from loss of the residence basis and the existence of fact-dependent exceptions. The second identifies the documents and event date to compare, any NIA notice, and the reason contract, permit and card dates must not be conflated. There is no disposable generic introduction. The required finding at line 42 is separate from this opening test. |

## Live primary-source spot checks actually completed

The following pages were opened in this review, independently of the researchers. MOJ displayed a consolidated-data cutoff of 2026-10-16 and a weekly update notice. Administrative page dates are not treated as statutory commencement dates.

| Source actually opened | Bounded finding checked against the frozen articles |
|---|---|
| [Immigration Act, Article 22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) | First ARC after residence-authorized entry: 30 days from the next day; integrated ARC-function documents have an exception. It is not every visitor's conversion entitlement. |
| [BOCA domestic resident-visa FAQ](https://www.boca.gov.tw/fp-398-723-7b71f-1.html) | Domestic resident-visa issuance uses 30 days from issuance, distinct from the next-day-after-entry clock. |
| [Foreign Professionals Act, Article 16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | The direct NIA route is limited to qualifying authorized/exempt professionals and the specified dependants. |
| [Residence Regulations, Articles 7 and 9](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129) | Eligible reason-change clock begins on the event day; ordinary extension is within three months before expiry. Neither rule is a universal data-change clock or post-expiry grace period. |
| [Immigration Act, Article 31](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31) | Address/workplace change: 30 days from the following day. Loss of the residence basis can lead to revocation despite the printed card date; listed continued-residence grounds need their own facts. |
| [NIA 0929 student guide](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news) | Updated 2026-08-28. Approval, payment within five working days, electronic ARC download and chip-card collection three working days after payment are separate triggers. The guide's English eligibility paragraph says “more than three”; its document paragraph says at least three, consistent with BOCA. |
| [Foreign Professionals Act, Article 15](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=15) | Eligible dependent spouses of specialist/senior professionals may apply to MOL for work permission; a dependent ARC does not automatically grant it to all spouses. |
| [BOCA Mandarin residence guidance](https://www.boca.gov.tw/fp-166-285-041cb-2.html) | Four completed months plus registration for at least another three; qualifying university-affiliated center and entry-purpose conditions. Admission does not itself establish residence approval. |
| [NIA valid-ARC/APRC passport FAQ](https://www.immigration.gov.tw/5385/12162/12197/414977/) | Updated 2026-06-29: valid ARC/APRC holders need a passport valid on arrival, subject to inspection; no universal remaining-six-month rule. |
| [Firm contact page](https://tseng-law.com/en/contact) | `wei@hoveringlaw.com.tw`; explicit consultation languages English, Chinese, Korean and Japanese. Other communication arrangements must be confirmed; no Portuguese consultation guarantee. Initial email excludes passport/ID numbers and original identity documents. |
| [BOCA visa-exempt entry](https://www.boca.gov.tw/cp-149-4486-7785a-2.html) | Updated 2026-07-17. Eligible Portuguese passport holders have the 90-day entry example and the published passport/travel-document conditions. This does not extend to every Portuguese-speaking national or create a general right to convert residence. |
| [Foreign Professionals Act, consolidated English text](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295) and [amendment/commencement history](https://law.moj.gov.tw/ENG/LawClass/LawHistory.aspx?pcode=A0030295) | Articles 9, 12 and 16 checked. Gold Card combines four functions; post-graduation work requires the stated Taiwan associate-degree-or-higher qualification and approved residence extension. The history verifies 1 January 2026 commencement for the relevant provisions, while separately listing the later commencement exceptions. |
| [NIA 0915 foreign-professional guide](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) | Updated 2026-04-14. The professional channel has category-specific proof and exclusions, including trial visa-exemption, TAC, ABTC and working-holiday restrictions unless otherwise provided. 705's qualified summary is not an eligibility conclusion for those schemes. |
| [NIA 0902 ARC/extension guide](https://www.immigration.gov.tw/5475/5478/141465/141808/141970) | Updated 2026-04-14. General and purpose-specific documents; Taiwan-spouse first application; unchanged-address exception; replacement evidence. Notes 10(b), 11 and 14 support the graduation/Mandarin distinction in PT706-R1. |
| [Residence Regulations, Article 11](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080129&flno=11) and [consolidated English regulations](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0080129) | Graduation extension is one year from the day after the previous period ends; a further application, if necessary, is limited to a two-year total. Articles 7 and 9 preserve the change/renewal clocks; Article 20 requires the re-entry arrangement before departure and distinguishes APRC holders. |
| [NIA Gold Card guide](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/406403/) | Updated 2026-02-10. The relevant Gold Card extension window is four months; this is not the ordinary ARC three-month rule. |
| [NIA entrepreneur residence guide](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/348924/) | Updated 2025-02-17. The business-based four-month window and the no-business three-month route are distinct. |
| [Employment Service Act, Article 50](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=50) and [Article 48](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=48) | Covered students' 20-hour weekly limit excludes summer/winter vacations; the Taiwan-spouse work-permit exception requires the stated spouse and residence conditions. Neither is a general ARC work right. |
| [Immigration fees regulations](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080135) | NT$1,000 per year, partial year counted as a year, additional NT$2,200 where applicable, limited overseas-compatriot discount, and NT$500 replacement fee checked. |
| [NIA lost-card guidance](https://www.immigration.gov.tw/5385/7229/7232/368785/) and [NIA personal-data FAQ](https://news.immigration.gov.tw/EasyPack/Detail/DDA469F4-E2D0-4A98-847C-21432DCC040E?lang=EN) | Passport changes require a data update. Loss abroad has different online/representative/document routes; a card image is not a general boarding or re-entry permission. |
| [Immigration Act, Article 23-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=23-1) | The specified residence-purpose-change route is limited to the statutory categories; NIA reassesses the permit and duration. |

Access limits: the NIA FAQ URL with the extra `/5382/` prefix was inaccessible through the web tool; the canonical `/5385/12162/12197/414977/` page above was then successfully opened. The Chinese Foreign Professionals Act history URL was inaccessible, but the official English history was subsequently opened through the consolidated Act's history link and resolved the commencement question. A direct Article 34 request failed; the successful consolidated residence regulations provide the re-entry rule checked here. These are selected source checks, not a claim to have opened every endnote or every agency subpage. No applicant login, application, payment, collection, travel or immigration outcome was tested. Live Portuguese corpus/contact pages were not independently checked.

## Actual shared-checker output

The shared checker supports ko/en/ja/zh-hant; pt is unsupported and defaults to Korean. I ran the prescribed command separately on each frozen manuscript without a language override and without altering the tool. All three returned exit 1. The `[ko]` results below are actual output, not Portuguese quantitative validation. The `short_share` failures alone do not establish a Portuguese prose defect. They remain a recorded validation limitation, not a waived or fabricated quantitative PASS.

```text
$ python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/704-taiwan-arc-first-application.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/704-taiwan-arc-first-application.md [ko] sentences=57 mean=86.1 cv=0.512 short=0.0 run3=0.036 opener_rep=0.1 cite_end=0.0 cite_para=0.2 contrast=0 caveat=0 q=1
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
exit: 1

$ python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/705-taiwan-visa-residence-work-study-family.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/705-taiwan-visa-residence-work-study-family.md [ko] sentences=54 mean=98.4 cv=0.512 short=0.0 run3=0.0 opener_rep=0.211 cite_end=0.0 cite_para=0.368 contrast=0 caveat=0 q=1
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
exit: 1

$ python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/706-taiwan-arc-renewal-changes-reentry.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/706-taiwan-arc-renewal-changes-reentry.md [ko] sentences=63 mean=89.0 cv=0.519 short=0.0 run3=0.0 opener_rep=0.19 cite_end=0.0 cite_para=0.333 contrast=0 caveat=0 q=2
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
exit: 1
```

## Manual §5 and structural checks

| Check | Independent result |
|---|---|
| Actual metrics and language support | Commands and failures preserved above. No English override or invented pt threshold was used. |
| Openings and scenario variety | Three distinct direct openings: initial deadline, entry effect, loss of basis. No stock fictional client, meeting or inbox scenario. The deletion test is recorded separately above. |
| Short/long sentence rhythm | Each has multiple purposeful short sentences among longer statutory explanations. 704: “Guarde uma cópia do processo completo.” and “Confirme qual dos títulos foi autorizado.” 705: “Peça uma cópia da decisão aplicável.” and “É a frequência efetiva que conta.” 706: “Guarde o documento que o demonstra.” and “Aqui, a contagem começa na data do facto.” The manual reading does not show three monotonous long-sentence blocks requiring a rewrite; no quantitative Portuguese share is asserted. |
| Paragraph starters | Read all prose starters before the source lists, aided by a read-only extraction. There is no sequence of three identical starters. Common Portuguese articles occur naturally; changing legal subjects merely to avoid an article would not improve accuracy. |
| Paragraph shapes and caveats | The articles alternate explanation, evidence needed, practical action and appropriately bounded exceptions. Examples of useful paragraphs without a citation/caveat ending include 704 line 70, 705 line 41 and 706 line 50. No three-paragraph claim/caveat template needs a MONOTONY repair. |
| Contrasts | Negative distinctions explain actual eligibility, legal clocks or approval stages. No repeated ornamental “não X, mas Y” template was found. |
| Endings | 704 checks card data and work scope; 705 assembles route-specific information; 706 addresses expired-document contact/evidence. The following related-article links and source sections are structural tails, not copied sales conclusions. |
| Locale and presentation | Professional pt-PT vocabulary and syntax; Taiwan terminology remains identifiable. No body H1, bold, invented first-person experience or public human/AI byline. The numbered list in 704 describes a real submission sequence. |
| Legal preservation | No manuscript was edited by this reviewer. Dates, amounts, qualifying language, exceptions and agency roles were checked. The only required change is PT706-R1's explicit eligibility boundary; its effect is identified as substantive clarification. |

Read-only structural validation used Node with the repository's `gray-matter`, `fs`, `path` and `crypto` modules (exit 0). For all three files the result was: no missing required metadata; three FAQs; `author=legal-ai-assistant`; `audience=[pt]`; `topic=visa`; valid source-date metadata; no body H1, bold or public byline; two same-locale links with zero missing local targets. SHA-256 values matched the table above. Metadata retention is internal authorship provenance, not a public byline claim.

Final source identity check: `shasum -a 256` on the three absolute manuscript paths returned exit 0 and the same three hashes in the verdict table immediately before report completion.

This review covers the frozen source manuscripts. It does not establish browser rendering, live routes, a successful build, deployment, individual applicant eligibility or any immigration outcome. It is neither human-native certification nor a substitute for the final legal/editorial review. Any manuscript edit creates a different hash and requires a bounded fresh verdict for the changed content. No “all checks passed” or quantitative pt PASS claim is made.

Memory was used only to locate current editorial conventions: MEMORY.md:555–557 (rollouts 01a10169-8632-72c2-aea0-63c905035c9f and 01a1209b-61dc-7ab1-b9e8-71a7711315e4). Current task rules and live source readings control the review.

## Repair1 independent re-review — 2026-10-24 KST

This appended section supplies the latest verdicts. The original REQUEST_CHANGES and unsupported `[ko]` CLI results above remain historical evidence; they are not the current article status or current tool-support status. Only this report was appended. I did not change a manuscript, checker, profile, source ledger or another agent's file.

I read the updated `work/pt-author.md` handoff and its Repair1 evidence, independently hashed the actual files, and reread 706's repaired paragraph, adjoining study/renewal paragraphs, FAQs and affected conclusions. The requested PT706-R1 clarification is resolved. No new required finding or regression was found within this bounded re-review. One of the two permitted repair rounds has been used; no second round is needed.

| Current manuscript under `repo/src/content/columns-pt/` | Independently verified current SHA-256 | Current verdict |
|---|---|---|
| `704-taiwan-arc-first-application.md` | `8fb040a119c50849c6fe9511d12c3c4c18165e003e9cf39104447055ba51a147` | PASS retained; source unchanged |
| `705-taiwan-visa-residence-work-study-family.md` | `bb411e5b88654f5d0532256739627cb8f7d15ab96b212b3131ec1973b84e796c` | PASS retained; source unchanged |
| `706-taiwan-arc-renewal-changes-reentry.md` | `b6d5666179d9695d12eac4bce8145e3acb01254ce62708d38328915b47e7f3a1` | PASS after repair1 |

### PT706-R1 closure and legal-condition preservation

The repaired opening at 706:42 now reads:

> Quem conclui um programa de ensino formal em Taiwan pode pedir, antes de a residência expirar, a prorrogação prevista no [artigo 11.º do regulamento](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129). A simples conclusão de um curso de mandarim não dá acesso a esta via. Se o pedido for aprovado, a residência é prorrogada por um ano a contar do dia seguinte ao termo anterior.

This expressly distinguishes formal academic completion from merely finishing Mandarin. It reads naturally in professional pt-PT after the Mandarin paragraph. It preserves application before expiry, conditional approval, a one-year extension starting on the day after the previous period ends, the following possible further application and two-year total cap. The separate work sentence still requires a Taiwan associate degree or higher and the NIA-approved post-graduation extension. It does not grant every graduate or Mandarin student an automatic work right.

For this repair I reopened [Residence Regulations Article 11](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080129&flno=11), [NIA 0902 notes 10(b), 11 and 14](https://www.immigration.gov.tw/5475/5478/141465/141808/141970), and [Foreign Professionals Act Article 12 in the consolidated official text](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295). These support the preserved extension periods, the formal/non-formal program distinction and the separate degree/work condition. All three opened successfully in this round. No broad new legal research or additional program survey was needed.

An independent read-only Python check replaced the new three-sentence span with the exact two original sentences in memory only, then recalculated SHA-256. The result exactly reproduced the original frozen 706 hash. This establishes that all bytes outside that repaired span, including metadata, FAQs, remaining legal conditions, opening, conclusion and links, are unchanged. Actual output, exit 0:

```text
current_sha256=b6d5666179d9695d12eac4bce8145e3acb01254ce62708d38328915b47e7f3a1
reconstructed_r0_sha256=9e40d5778fa669a9b42033fa54591907e5a985d05499a58363658c079107e94b
only_changed_span=line_42_opening_two_sentences_replaced_by_three_with_source_link
OUTSIDE_REPAIRED_SPAN_UNCHANGED=True
```

Manual §5 impact check: the paragraph now starts with `Quem`, following `Os`; the added Mandarin sentence carries the required eligibility boundary rather than serving as numerical filler. Longer conditions remain readable, citation placement remains useful, and no repeated opening/caveat/contrast pattern was introduced. The first-two-paragraph deletion conclusions, comparator conclusions, short-sentence examples and ending assessment above remain applicable. No MONOTONY finding is outstanding.

### Current pt-aware CLI — separately recorded from r0

The current shared checker now routes `columns-pt` to `[pt]`. I read its routing, `profiles/pt.json` and `MULTILINGUAL-METHOD.md`, and independently ran the exact commands below without a language override. Since the checker changed, rerunning the two unchanged manuscripts was appropriate. Each actual command returned exit 0 with no variety limit violated.

```text
$ python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/704-taiwan-arc-first-application.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/704-taiwan-arc-first-application.md [pt] sentences=55 mean=16.4 cv=0.502 short=0.127 run3=0.038 opener_rep=0.105 cite_end=0.0 cite_para=0.263 contrast=0 caveat=0 q=1
  OK — no variety limit violated
exit: 0

$ python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/705-taiwan-visa-residence-work-study-family.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/705-taiwan-visa-residence-work-study-family.md [pt] sentences=51 mean=19.0 cv=0.495 short=0.137 run3=0.0 opener_rep=0.222 cite_end=0.0 cite_para=0.5 contrast=0 caveat=0 q=1
  OK — no variety limit violated
exit: 0

$ python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/706-taiwan-arc-renewal-changes-reentry.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/706-taiwan-arc-renewal-changes-reentry.md [pt] sentences=61 mean=17.3 cv=0.481 short=0.148 run3=0.034 opener_rep=0.15 cite_end=0.0 cite_para=0.45 contrast=0 caveat=0 q=2
  OK — no variety limit violated
exit: 0
```

Independently read execution-time tool hashes:

- `variety_metrics.py`: `0491ce5e3a7bd0c3ebd9bea7aa0ed04ba3ea41c6b56d2707824455eb2ccd10fb`
- `variety_multilingual.py`: `53fe3e3dbf3f151e06e2629672ce0c57ccea9484b14433d220bfd53d4e5c35b4`
- `profiles/pt.json`: `f963d707450b0eb85408e8ca916e11f02d858545eac3b316baa2f4934ed293b9`

The current result resolves the earlier unsupported-pt measurement limitation for these exact executions; it does not retroactively change the original exit-1 output. The method uses orthographic units and heuristic sentence boundaries. A passing metric is not human-native certification, a proof of legal accuracy or publication readiness. The report's source-only, no-deployment and no-individual-immigration-outcome boundaries continue to apply.
