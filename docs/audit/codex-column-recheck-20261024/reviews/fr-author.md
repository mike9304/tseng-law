# French ARC revision — author / repair report

Date: 2026-10-24. Role: AI French editorial author. This is a self-check and handoff, not an independent review, human native-speaker certification, or legal approval. Publication is owned by root.

Read in full: revision brief; repository AGENTS.md; docs/columns/EDITORIAL-VOICE.md; COLUMN-VOICE-RULE.md; SENTENCE-VARIETY-RULE.md; LESSONS.md; tseng-law-editorial SKILL.md and references/review-criteria.md. Retired Fable instructions were not applied.

## Frozen files

| File under repo/src/content/columns-fr | SHA-256 |
|---|---|
| 704-taiwan-arc-first-application.md | b49070326631172e5070ac517ec55337477df215e934471ee18e7c8f0cbec2f6 |
| 705-taiwan-visa-residence-work-study-family.md | 587e33801e22ff99739529783870ab21bb3eb6c172d31330a815cf09bf10ea71 |
| 706-taiwan-arc-renewal-changes-reentry.md | 5dde9953d4868917c3cc3dcc9cf9a45376115a714f4de99486a3324b71d8deec |

The initial freeze was sent to root before this report was written. After the independent reviewer requested bounded repairs, the hashes above superseded the original 705/706 hashes; they were sent to root/review_rev2_fr for recheck. Article 704 is unchanged. Only the three owned manuscripts and this report were edited. No commits, deployment or shared implementation changes were performed.

## What changed in the prose

The old texts repeatedly told readers to verify their category, warned them not to infer too much from a word, and ended paragraphs with short restatements. The revision gives the concrete rule, its conditions and the next relevant document or institution. Full paragraphs, openings, titles, summaries and all FAQ answers were rewritten. Useful document lists and the table distinguishing the two change-of-purpose deadlines remain.

| Article | Old wording | New wording or treatment | Reason / meaning retained |
|---|---|---|---|
| 704 | « La date d’arrivée ne commande pas tous les dossiers » | « Le délai dépend aussi de la délivrance du visa » | Removes an abstract metaphor; the section still distinguishes arrival-based and domestic-issuance start dates. |
| 704 | « La langue du document ne détermine pas le bureau compétent. Relevez son pays d’émission, l’autorité qui l’a délivré et son usage dans le dossier taïwanais. » | « Avant de commander une traduction d’acte de mariage ou d’un autre justificatif, indiquez à la représentation taïwanaise son pays d’émission, l’autorité qui l’a délivré et la demande à laquelle il est destiné. » | Moves from a warning about language to the actual information needed for authentication. Origin, issuing authority, intended use and competent mission remain. |
| 704 | « Le délai de retrait s’ajoute donc à l’instruction. » | Deleted after retaining the separate instruction, payment and collection deadlines. | Repeated the chronology already explained by the preceding sentences; no deadline was removed. |
| 705 | « Leur dossier ne doit pas être envoyé dans le portail des professionnels par simple traduction du mot “travailleur”. » | « C’est la catégorie portée sur la décision du ministère du Travail qui permet d’orienter le dossier. » | Removes an invented reader mistake about translation. The distinct migrant-worker procedure and limitation of the professional portal remain immediately around it. |
| 705 | « Qui fournit le fondement de la demande familiale ? Relevez son statut exact. » | Replaced by the concrete opening « Lorsque le conjoint rejoint est taïwanais, réside à Taïwan et y est inscrit au registre des ménages… » | Identifies the conditions instead of asking the reader to interpret an abstract “fondement”. The second family category follows in its own paragraph. |
| 705 | « Le statut d’entrée compte. » / « Il s’agit d’un parcours soumis à qualification. » | Deleted; entry restrictions and Gold Card eligibility are stated in the operative sentences. | Removes short recap sentences used as emphasis. No qualification or restriction was dropped. |
| 706 | « Le changement de motif a son propre délai » | « Changer de motif de résidence : deux délais possibles » | The heading describes the actual 30-day/15-day comparison in the table. |
| 706 | « Aucun maintien ne se déduit du seul nom de cette exception. » | « La NIA apprécie le maintien au regard des conditions propres à chaque exception. » | Replaces a warning about reading labels with the authority and conditional nature of continued residence. No entitlement is promised. |
| 706 | « Quel événement a modifié votre droit de résider ? Notez sa date exacte et gardez la pièce qui l’établit… » | « À quelle date votre situation a-t-elle changé ? Une pièce datée établissant la fin d’emploi, l’admission dans une autre formation ou la modification du lien familial permet de calculer le délai de changement de motif. » | Connects the date and supporting document directly to calculating the deadline. The three example events remain. |

This report does not claim that replacing particular words is enough to remove an AI-like style. The remaining conditional language often carries legal scope and was deliberately kept.

## First-two-paragraph deletion test

704:
- First sentence retains the eligible entry/residence situation, the application duty, the thirty-day limit and article 22. Removing it loses the actual rule.
- Second sentence supplies the next-day starting point. It cannot be deleted without changing the practical calculation.
- Paragraph two defines ARC and NIA, states that the work permit does not replace the residence-card application, and preserves the separate work-authorisation/exemption question under article 43. Each sentence contributes a distinct fact.

705:
- The opening question supplies the visa-exempt-entry situation to which “cette demande” in the following sentence refers. The answer states the permitted professional category, article 16, the NIA recipient and the authorisation/exemption condition.
- Paragraph two explains the different study-entry rule and why later admission alone cannot validate the route. Removed the draft’s extra sentence « Le document d’entrée se prépare donc avec le projet d’études », which repeated the practical implication without adding a condition.
- A long-sentence pair at the paragraph boundary was flagged during the initial author freeze. The independent reviewer/root requested the bounded shortening, now applied: « Pour un cursus à temps plein, le [Bureau des affaires consulaires (BOCA)](same existing URL) distingue l’entrée avec un visa d’études de l’entrée sans visa ou pour un autre motif. » The following sentence now explicitly names obtaining residence after visa-exempt/other-purpose entry instead of the ambiguous « passer de l’un à l’autre ».

706:
- Paragraph one explains cancellation before the printed expiry and conditional continued residence under article 31. The draft’s sentence urging action at the end of the contract was removed as a restatement; the FAQ still answers the concrete timing question.
- Paragraph two provides the address-change deadline, its next-day starting point, its application to the declared workplace, and its independence from renewal. These are separate operative details.

## Three recent French comparators

All were actually read in full and were published on 2026-10-23:

1. `repo/src/content/columns-fr/676-french-supplier-taiwan-distributor-termination-stock-online-accounts.md`
   - Opening: a concrete three-month statutory notice period, then a distinction between agent and reseller.
   - Headings: contract termination date, stock, and account ownership are separate issues.
   - Ending: after contact/service language, returns to allocating each batch and pending order to a date.
   - Revision comparison: 704 opens with an actual application deadline but follows the application chronology; it does not reproduce the contract/stock/account structure or add a promotional ending.
2. `repo/src/content/columns-fr/677-france-resident-heir-taiwan-bank-property-documents.md`
   - Opening: the concrete powers to close a bank account and collect money, followed by the deceased’s nationality.
   - Headings: bank evidence, French legalisation, land registration, and original-document handling.
   - Ending: every original must have an identified recipient and purpose.
   - Revision comparison: 705 opens with the visa-exempt-entry question and compares actual residence grounds; it avoids turning every section into a document-preparation instruction.
3. `repo/src/content/columns-fr/678-french-employee-taiwan-unpaid-wages-employer-closure.md`
   - Opening: a six-month wage-coverage period and foreign-worker eligibility.
   - Headings: payroll evidence, closure evidence, limits, and return to France.
   - Ending: dated payroll and closure evidence remain the practical starting points.
   - Revision comparison: 706 opens with the effect of employment ending on an otherwise valid card, then handles the particular event and travel problem. Its final paragraph concerns ARC/change/travel dates, without copied contact or disclaimer prose.

These comparators are not treated as perfect models. Two begin with a numerical period, and all retain substantial “il faut”/negative-limit language. The revision uses three different opening functions (deadline, reader question, consequence of an event) rather than copying that rhythm.

## Legal/source/numeric preservation

The initial editorial repair intended to preserve legal substance. The final EUROPE reviewer then required an expressly substantive Article 16(2) sponsor-scope clarification, documented below; this correction is now part of the current 705 hash. The following details were checked against the pre-revision articles:

- 704: residence visa plus residence permission; 30 days from the day after arrival; domestic resident-visa issuance starts at issuance; direct NIA eligibility remains category-dependent; current permitted-stay time still matters; photo under two years; employment certificate under one month and required seals; admission versus later registration; family-link and sponsor documents; Taiwan-resident/household-registered Taiwanese spouse conditions, accompaniment and first one-year card; foreign-document authentication and possible Chinese authenticated/notarised translation; distinct student requirements; online professional fifteen-day threshold and counter referral below it; colour files up to 512 Ko; originals and completion requests; NT$1,000 per year including part-year charging; NT$2,200 additional fee for visitor/visa-exempt entry; limited 僑生 reduction; general ten working days with exclusions/restart, student five working days; payment within five working days after approval; collection three working days after payment with printed receipt; electronic ARC six months or less; Gold Card integration exception in FAQ.
- 705: resident-visa projects exceeding six months; article 43 work-authorisation principle and exceptions; article 16 professional/special-professional route and work authorisation or exemption; migrant-worker procedure; study-entry restrictions and full-time study documents; appropriate mandarin visa, four completed months, three additional registered months, fifteen weekday class hours, absence limit of one quarter including leave; Taiwanese spouse resident/household-registration condition and visitor visa of at least sixty days without restrictive annotations; article 16 spouse/minor children/disabled dependent adult children, sponsoring residence approval and visa-free/visitor entry; article 48 spouse exemption only once residence is authorised; Gold Card four functions and one-to-three-year validity; entrepreneurial residence separate from incorporation; PVT main-holiday purpose, nationality scope and post-entry limits.
- 706: possible cancellation before expiry and conditional exceptions; address/workplace thirty days from the following day; ordinary renewal in the three months before expiry; entrepreneur continuation four months versus cessation-related three months; Gold Card four months; updated application documents and distinct portals; NT$1,000/year with rules on duration/reduction; mandarin extension no more than six months; work permission/exemption distinct from NIA change; article 23-1 eligibility; change-of-purpose thirty days from event day versus BOCA fifteen days from event day outside those categories; no automatic extension; conditional family/labour/injury continued-residence situations; passport update without inventing an address-based deadline; lost/damaged-card NT$500; online/representative overseas replacement, authentication differences and older migrant-card exception; re-entry authorisation before departure with permanent-residence exception; e-Gate does not confer residence; pending student visitor-entry case closure and professional online case closure on departure; expiry remedies only in specified circumstances after sanction, no grace period.

All original Markdown destination URLs were compared with `git show HEAD:<file>`:

| Article | Distinct official HTTPS URLs preserved | Missing URLs | Added Markdown destinations | Missing visible numeric tokens |
|---|---:|---:|---:|---:|
| 704 | 12 | 0 | 0 | 0 |
| 705 | 15 | 0 | 0 | 0 |
| 706 | 18 | 0 | 0 | 0 |

Internal links remain identical. The added visible numeric tokens are `20261024` in the image paths and, after the final legal clarification, `2` identifying Article 16(2). Number words, qualifications, start dates and exceptions were manually checked as listed above; a token comparison alone cannot certify legal equivalence.

As a bounded author check, the NIA 0902 page, the BOCA full-time-student resident-visa page, and Immigration Act article 31 were reopened live on 2026-10-24. Their claim relationships remain intact. The separate source researcher owns the full refresh. The researcher’s caution about the current article 12 graduate work-permit exemption was received; no blanket prohibition on work during a graduate extension or blanket employer-permission requirement was added.

## Images and metadata

Each article now has the exact root-assigned `/images/columns/...-20261024-v2.webp` path and localized French alt/caption text. The descriptions match the planned text-free still lifes. Captions identify an illustration, not an actual identity card, application, official document or named person. No inline duplicate image was added.

Actual generated-image inspection and asset availability are root’s responsibility; this author has not seen or certified the final images. Routing filenames, publication date, internal `author: legal-ai-assistant`, topic and audience remain. There are three FAQ entries in each file. No public author, human/native/lawyer review claim, or consultation-language expansion was added. The articles had no consultation CTA, and none was introduced.

## CLI results and section 5 self-check

Commands run on the frozen files:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-fr/704-taiwan-arc-first-application.md
[fr] sentences=60 mean=16.2 cv=0.46 short=0.183 run3=0.017 opener_rep=0.158 cite_end=0.0 cite_para=0.211 contrast=0 caveat=0 q=1
OK — no variety limit violated; exit 0

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-fr/705-taiwan-visa-residence-work-study-family.md
[fr] sentences=56 mean=19.3 cv=0.466 short=0.161 run3=0.037 opener_rep=0.1 cite_end=0.0 cite_para=0.4 contrast=0 caveat=0 q=2
OK — no variety limit violated; exit 0

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-fr/706-taiwan-arc-renewal-changes-reentry.md
[fr] sentences=62 mean=17.4 cv=0.458 short=0.129 run3=0.033 opener_rep=0.136 cite_end=0.0 cite_para=0.5 contrast=0 caveat=0 q=2
OK — no variety limit violated; exit 0
```

Also executed: repository `gray-matter` parsing of all three actual files (exit 0; date, three FAQ entries, image path and internal author read back); `git diff --check -- <the three files>` (exit 0, no output); source/destination/numeric comparison; SHA-256 calculation. Bold-marker scan found no `**`, `__`, `<strong>` or `<b>` in these manuscripts.

Section 5 manual audit:

1. CLI FAIL 0 for each article; no shared checker/rule modification.
2. No stock hypothetical opening. 704 = application deadline; 705 = reader question; 706 = residence consequence of ending employment. No invented scene or experience.
3. At least two meaningful short sentences in each file, such as the next-day start, a lease as evidence, an attendance certificate, the no-extension rule and preservation of filing proof. No new filler sentences were inserted as padding. The 705 paragraph-boundary long-sentence pair was shortened in the bounded repair requested by the independent reviewer/root. No filler sentence was added to compensate for metrics.
4. Actual paragraph opening words were read vertically and counted; each exact starter occurs no more than twice in the body of each article. There is no sequence of identical imperative heading templates.
5. No three consecutive “claim plus parenthetical source, then caveat” paragraph pattern; practical document, filing and dated-event paragraphs without inline citations remain. Citation links were retained, not removed to improve rhythm.
6. Repetitive rhetorical rebuttals were removed. The remaining entry, permit and deadline distinctions carry legal substance. CLI reports zero recognised contrast templates; this is not a claim that all negative sentences disappeared.
7. Final substantive paragraphs concern card details and renewal (704), the document supporting the residence ground and current expiry (705), and exact travel/change/ARC dates (706). No copied promotional close was added. The source/scope tail remains structural.
8. Professional French throughout; no Korean/Japanese register claim is applicable. No bold, invented first-person practice experience or command/checklist heading series.
9. Original article references, URLs, fees, durations, starting points and conditional scope preserved as documented. No new fictional case was introduced.

## Remaining scope

The manuscripts are frozen for the independent reviewer’s recheck and root’s final legal/editorial review. The identified 705 opening rhythm point and the reviewer’s precise wording/attachment/repetition findings have been repaired. Full legal-source refresh, independent acceptance, final image inspection, rendering and publication are not certified by this report. No outstanding substantive change or missing original source was identified by this author.


## Bounded repair requested by independent reviewer

Root relayed REQUEST_CHANGES and expressly authorised only these repairs; no further broad rewrite was made.

| Passage | Applied repair | Meaning / check |
|---|---|---|
| 705 opening study paragraph | Shortened the BOCA comparison sentence; replaced « passer de l’un à l’autre » with « obtenir la résidence après une entrée sans visa ou pour un autre motif ». | Resolves ambiguous entry-mode referents and preserves the BOCA URL and conditional admission limitation. |
| 705 mandarin paragraph | « Il faut d’abord suivre quatre mois de cours dans un centre de mandarin rattaché à un établissement supérieur reconnu. Une inscription pour au moins trois mois supplémentaires peut ensuite permettre de demander la résidence. » | Restores explicit attachment of the recognised university-centre condition to the four completed months as well as the continuing three-month registration. Fifteen weekly hours, Monday–Friday, quarter-absence limit including leave, and the BOCA URL remain. |
| 706 pending-application travel paragraph | Deleted only « Avant le voyage, demandez donc à la NIA de préciser les conséquences sur votre dossier et les titres utilisables au retour. » | Removes repetition of the later specific instruction to give NIA the ARC/change/departure/return dates. Student and professional case-closure rules, document limitations, and the detailed closing instruction remain. |

Final 705 and 706 CLI runs both returned exit 0 with the metrics printed above. The actual repaired passages were reread, original URL sets and numeric-token sets were compared again, and the final hashes were provided to `/root/review_rev2_fr`. This author does not issue the reviewer’s acceptance decision.


### Final bounded FAQ repair

The independent French reviewer accepted the three preceding repairs and requested one final change to FAQ 705. Only its last sentence was replaced:

- Before: « Avant de partir, rapprochez donc les fonctions prévues et vos conditions d’entrée de cette catégorie : une offre d’emploi seule ne permet pas de conclure. »
- After: « Une offre d’emploi ne suffit pas : les fonctions prévues et les conditions d’entrée doivent répondre aux critères de cette voie. »

This removes an abstract instruction while retaining the conditions and the insufficiency of a job offer alone. The body and all source URLs are unchanged. The variety CLI was rerun and returned exit 0 with unchanged body metrics (55 sentences, cv 0.465, short 0.145, run3 0.038). SHA-256 after this FAQ repair, before the final legal clarification: `e93a251154f54095e34a4aef0e9576325e1e38b122e9059c40750228f4ad9868`. The 704 and 706 hashes remain as in the current table. Independent acceptance is for the reviewer to record.


## Final EUROPE legal correction — Article 16(2) sponsor scope

Root authorised this bounded correction through `/root/final_rev2_europe`. It is a substantive scope clarification, not merely a style edit. The former phrase « un professionnel étranger remplissant les conditions de l’article 16 et déjà autorisé à résider » did not expressly distinguish the two sponsor branches or the permanent-residence alternative.

The current [official Article 16(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) was reopened by this author on 2026-10-24, in addition to the independent final reviewer’s source check. It distinguishes (a) an ordinary foreign professional carrying out professional work in Taiwan and (b) a foreign specialist professional. Both require existing NIA approval of residence or permanent residence. The current paragraph now states those two alternatives explicitly:

> Selon l’article 16, alinéa 2, la famille d’un professionnel étranger qui exerce une activité professionnelle à Taïwan ou d’un professionnel étranger spécialisé peut demander directement la résidence. Dans les deux cas, la NIA doit déjà avoir autorisé la résidence ou la résidence permanente de la personne rejointe.

The following paragraph preserves the spouse, minor children and adult children unable to live independently because of physical or mental disability; visa-exempt/visitor-visa entry; and NIA approval before ARC issuance. An inline link to the already existing Article 16 URL now attaches directly to this proposition. No distinct official URL was removed or added.

All earlier independent-review corrections remain present: explicit study-entry/residence wording, recognised university-centre condition on the four completed months and the further three months, concise FAQ 705, and removal of duplicate generic travel advice in 706. Articles 704 and 706 were not edited in this legal correction.

Actual 705 variety check: exit 0, FAIL 0, sentences=56 mean=19.3 cv=0.466 short=0.161 run3=0.037 opener_rep=0.1 cite_end=0.0 cite_para=0.4 contrast=0 caveat=0 q=2. The revised two paragraphs were read for modifier attachment and OR/AND scope; neither sponsor branch can bypass the existing NIA residence/permanent-residence approval requirement. No filler was added. Current 705 SHA-256: `587e33801e22ff99739529783870ab21bb3eb6c172d31330a815cf09bf10ea71`. This supersedes the prior FAQ-only hash; the current complete table at the start of this report is authoritative.
