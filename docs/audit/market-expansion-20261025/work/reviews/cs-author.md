# Czech author handoff — 942 and 943

Date: 2026-10-25. Role: AI Czech-language drafting specialist. These are author self-checks, not independent locale review, attorney approval, human native-speaker review or evidence of publication. Status: repair 1 accepted by the independent locale reviewer; 943 metadata-only topic correction is frozen for review rebinding. Only the locale reviewer's eight named findings were changed; exact before/after text and source hashes are in `cs-author-repair1.json`.

## Files and integrity

| ID | Source | SHA-256 |
|---|---|---|
| 942 | `repo/src/content/columns-cs/942-czech-supplier-taiwan-email-purchase-order-contract.md` | `bec0b9df6b63b0f17f5f9bc2ffac6b2ef23e2b8693475936eaca05ff1cfaa2a3` |
| 943 | `repo/src/content/columns-cs/943-czech-exhibitor-taiwan-patent-disclosure-priority.md` | `67fd481e9ae23009247b50aa53d09f6b3a21e962bf1dd76bbcbaed1de8592bc5` |

Read before writing: repository AGENTS.md and EDITORIAL-VOICE.md; shared COLUMN-VOICE-RULE.md, SENTENCE-VARIETY-RULE.md and LESSONS.md; tseng-law-editorial SKILL.md and review-criteria.md; imagegen SKILL.md; AUTHOR-BRIEF.md; current Czech consultation copy and en-service-scope.ts; east-briefs.md. The retired Fable workflow was not applied.

## Czech reader and market rationale

942 addresses a Czech industrial or technology supplier deciding whether an emailed PO, revised attachment and acknowledgement have already formed a Taiwan-law contract. The current Czech office reports of SEMICON 2026 and the hydrogen forum establish recent industry contact, not measured search volume, signed contract counts or a client pipeline. This evidence guided topic selection; it was not inserted as an ornamental market introduction. The article separates assent, reserved form, signatory identity and evidence.

943 serves Czech exhibitors and research teams reconciling public presentation material with their first patent filing. SEMICON 2026 is actual reported market context. No named participant is called a client, claimant, victim or inventor whose rights were lost. The draft is limited to Taiwan invention patents, two different 12-month clocks, the Article 22 gazette exception and the separate Article 29 procedural deadline. It promises neither PPH treatment nor filing/registration services.

Market research ledger: `work/research/east-briefs.md`; official market pages were also opened by this author. Search volume, traffic, enquiry conversion and Czech-language consultation availability were not established.

## Three existing Czech comparators actually read

All three are dated 2026-10-24 and were read in the current repository, including their body, opening, headings and endings.

1. `repo/src/content/columns-cs/873-czech-company-taiwan-subsidiary-branch-office.md`: opens with a question about which company takes orders, then ownership and signatory preparation; follows entity choice, investment, capital and taxation. 942 addresses formation of one supply contract, not entity formation. 943 does not reuse that progression.
2. `repo/src/content/columns-cs/874-czech-working-holiday-taiwan-work-limits.md`: opens with age 26 and the six-month work limit; ends with the distinct work/stay dates in the calendar. 943 opens with two 12-month periods, but uses technical disclosure and priority rather than a numbered immigration walkthrough. Its table compares legal effects, not eligibility.
3. `repo/src/content/columns-cs/875-czech-buyer-taiwan-defective-machine-claim.md`: opens with an expressly modelled acceptance-test problem and records before adjustment; follows defect notice, repair and remedies. 942 concerns the earlier agreement/version stage from the Czech supplier's position. It does not repeat the defect/remedy checklist. Neither new article invents a case scene.

Both drafts use Czech business terms such as objednávka, příloha, podstatné body, přihláška and právo přednosti. The titles are not translated versions of another locale's assigned pieces. Their narrative structures differ: 942 follows offer → form → signature/evidence; 943 follows disclosure → priority → exhibition records.

## First-two-paragraph deletion test

942 paragraph 1:
- Removing the opening about the absent signature loses the reader's specific cancellation decision.
- Removing the Article 153 sentence loses the Taiwan-law basis and the distinction between express and implied agreement.
- Removing the sentence about several messages loses the practical explanation of why a single unsigned summary cannot be considered in isolation. It is brief and does not announce the article.

942 paragraph 2:
- The original first sentence merely previewed the choice-of-law question; the independent locale reviewer identified it as deletable and it was removed in repair 1.
- The paragraph now begins with the Article 20 sentence, which supplies the choice/closest-connection rule.
- The final sentence limits the rest of the article to contracts governed by Taiwan law; it prevents treating the sender's location as decisive.

943 paragraph 1:
- The first sentence establishes that the two identical numerical periods have different triggers.
- The TIPO sentence supplies the explicit non-aggregation rule.
- The final sentence applies that rule to a first filing made after an exhibition; deleting it leaves the precise mistaken calendar calculation unexplained.

943 paragraph 2:
- The opening identifies disclosed technical content as the first factual question.
- The middle sentence distinguishes visible exterior, technical sheet and operating video, which may reveal different content.
- The closing ties each date to a version and preserves the possibility that a website disclosure preceded the exhibition.

Author judgment after repair 1: retain the remaining sentences. The initial author self-check had retained the now-deleted choice-of-law preview; the independent review corrected that judgment. This record is not a self-awarded independent PASS.

## Primary legal source checks

Native web tool responses are preserved, without rewriting their returned text, in `cs-author-opened-sources.json` and `cs-author-supplemental-sources.json`. Date checked: 2026-10-25. All consequential law links used in the body were opened; the two initial access failures below were resolved by opening their official parent link.

942:
- Civil Code 153: express/implied agreement; essential and nonessential points. Article 160(2): changed acceptance as refusal plus new offer. Article 166: presumption of nonformation pending the agreed form, not a universal signature requirement. Article 345: agreement on subject and price for sale. Current database pending-effect notice concerns 166-1 and 1223, not these provisions.
- Cross-border law Article 20: express choice and closest relationship fallback. The article makes no independent determination that every Czech export is governed by Taiwan law.
- Electronic Signatures Act 4, 5, 6 and 8: functional equivalence with conditions; full reproduction/later retrieval; agreed electronic form or reasonable prior opportunity to object with notice of the non-objection presumption; prospective withdrawal; qualifying approved-certificate signature presumption; retention of authentication metadata. Current 2024 full-text revision and its history were opened. The history identifies promulgation on 2024-05-15 and commencement upon promulgation; no future commencement flag affects the cited provisions.
- The signature article does not assert that a copied image, EU certificate, company email address or apparent identity automatically establishes authority or agreement.

943:
- Patent Act 22: industrial applicability, novelty and inventive step; intentional/unintentional applicant-caused disclosure within 12 months; exclusion for intended patent-gazette disclosure caused by an application. Article 22's 2017 amendment took effect on 2017-05-01 according to the official history.
- Article 28: same invention, first lawful eligible-country/WTO filing, 12-month Taiwan filing window, earliest date for multiple priorities and priority's effect on examination. Czech WTO membership checked at WTO.
- Article 29: simultaneous declaration of filing date, jurisdiction and number; certified document within 16 months of earliest priority; the stated omission consequences; non-intentional restoration limited to omitted priority/date/jurisdiction with application, fee and supplied particulars. Article 29's 2019 amendment took effect on 2019-11-01.
- Article 11: foreign applicants without Taiwan domicile/business establishment require an agent; qualification is a separate statutory issue. The firm is not described as holding an unverified patent-practitioner licence.
- Current TIPO priority guidance, sections 1.4–1.6: technical-content comparison, non-retroactive filing date, grace-period effect versus priority, first-to-file risk and no cumulative extension. TIPO grace-period FAQ was checked for earliest disclosure and supporting records. Its page gives a 2025-11-28 update.

Source access limitations: direct opening of the Electronic Signatures Act history and Article 8 initially returned an internal access error; clicking the official links from the full Act returned the pages. No inaccessible page was treated as read on the failed attempt. Official Chinese statutory text controls this author analysis; Czech terminology is editorial prose, not an official statute translation. The source-list URLs correspond to the inline citations. Current live source pages may be cached by the web tool; returned crawl dates and database compilation dates are preserved in the capture.

## Section 5 self-check

1. Actual shared checker is unsupported for Czech, with exit 2 both by inference and explicit `--lang cs`. This is not PASS. The independently accepted task-local Czech extension returns exit 0. The root-approved guarded entrypoint was rerun for the metadata-corrected 943; it first reports the original unsupported result and then measures Czech with unchanged HARD limits. Complete commands, checker SHA and output are in `cs-author-variety.json`.
2. No stock hypothetical opening. 942 begins with a signature-based misconception/cancellation decision; 943 begins with two numerical periods and their different triggers. No invented personal or client experience.
3. Meaningful short sentences are present, including 942 “Datum souboru samo nestačí.” and “Původní zprávy uchovejte včetně hlaviček.”; 943 “Samotné zveřejnění dřívější pořadí nezajistí.” and “Chybějící datum označte jako nezjištěné.” They carry proof/calendar consequences. No filler was inserted to pass a metric.
4. Body paragraph openings were read vertically; no starting word appears three times. Local measurements report opener repetition 0.067 and 0.062.
5. No three consecutive claim/citation/caveat paragraphs. Both have practical record-preservation paragraphs without external legal claims; source references remain attached to legal propositions.
6. No repeated ornamental “not X but Y” construction. Differences between signature and agreement or disclosure and priority serve the actual legal question.
7. Last substantive paragraphs concern the accepted offer/version (942) and comparing the next presentation with the filing/public versions (943), not a promotional recap.
8. Czech professional register throughout; no bold markup, duplicate leading H1, fictional first-person experience, public author claim, phone, LINE, response-time promise or guaranteed legal result. Each has three body-consistent FAQs.
9. Citation numbers, 12/16-month periods, triggers, exceptions and the limitation to Taiwan law/invention patents are preserved. No conclusion about Czech or European patent survival is supplied.

Task-local actual outputs (943 rerun through the approved guarded entrypoint after metadata correction):

```text
942 [cs] sentences=44 mean=15.0 cv=0.455 short=0.159 run3=0.024 opener_rep=0.067 cite_end=0.0 cite_para=0.667 contrast=0 caveat=0 q=1
  OK — no variety limit violated
943 [cs] sentences=44 mean=14.8 cv=0.456 short=0.205 run3=0.024 opener_rep=0.062 cite_end=0.0 cite_para=0.25 contrast=0 caveat=0 q=1
  OK — no variety limit violated
```

## Images and contact

Native image_gen generated one image per call. Both originals and final converted WebPs were actually displayed and visually inspected. The final assets are 1536×1024, contain no faces, readable text, identities, marks, flags or supposed case evidence, and depict different fictional settings. 942 shows a supplier desk, laptop and machined parts; 943 shows a covered exhibition prototype and transport case. Localized alt/captions describe those actual pictures.

- 942 WebP SHA: `fbe6798bf66fccdd74d1cf80421188c1da0fb122de6f0ad77625bf4491f46543` (164852 bytes).
- 943 WebP SHA: `d28c66a04807a5d524c06bd2ee1912a2c23b5bc60a6ebeaa8c6baec5c2ec35d0` (130824 bytes).
- Exact prompts, original paths and both image hashes: `work/images/cs-generation.json`.

CTA checked against current `src/data/international-inquiry-copy.ts` Czech block and `src/data/en-service-scope.ts`: nonconfidential first summary, English/Chinese/Japanese/Korean consultation only, communication scope to be confirmed, no automatic retainer, no initial confidential technical attachments. Each article contains the contact email once. No broad reply-language sentence from /en/contact was reused.

No Git push or publication was performed by this author. Root owns final integration, deployment and public readback.

## Metadata-only correction after locale repair

Root integration found `topic: "ip"` unsupported. For 943 only, changed it to `topic: "company"`. The full body, all other metadata and image bytes are unchanged; the receipt with exact before/after hashes and guarded CLI output is `cs-author-topic-repair.json`. Current source SHA is `67fd481e9ae23009247b50aa53d09f6b3a21e962bf1dd76bbcbaed1de8592bc5`. Locale and final reviewers were asked to bind their records to this actual new file. The shared global checker remains unsupported for Czech; no shared-tool PASS is claimed.
