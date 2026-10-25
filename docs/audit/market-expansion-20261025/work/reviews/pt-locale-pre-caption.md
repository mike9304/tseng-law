# Brazilian Portuguese independent locale review — 938–939

Reviewer: `/root/expand_locale_pt`, independent of `/root/expand_author_pt_br`. This reviewer did not write or edit either manuscript. Checked on 2026-10-25; the exact UTC time and complete hashes are recorded in `pt-locale.json`. Verdict: PASS for both frozen versions. No unresolved material finding remains. This is AI editorial review, not a claim of human native-speaker or licensed-lawyer review, and it does not certify publication.

| Source | Full-source SHA-256 | Verdict |
|---|---|---|
| `src/content/columns-pt/938-brazil-coffee-taiwan-border-reinspection.md` | `e196bf577e8a7ef27dcc7204347a16d4c473e3a12e143e692518a53b4f860b58` | PASS |
| `src/content/columns-pt/939-brazil-organic-coffee-taiwan-label-certification.md` | `5f684d9d24803677ba3288acc029b5739b8353ce41d9a4e19a13a3980c400a2d` | PASS |

The complete current articles were read, including title, SEO title, summary, dates, categories, tags, image alt/caption, every paragraph, all FAQs and source lists. The review brief, author brief, repository AGENTS, full editorial voice, COLUMN-VOICE-RULE, SENTENCE-VARIETY-RULE, LESSONS and editorial skill/review criteria were read. Relevant research: `work/research/west-briefs.md`, PT 938–939 and the shared consultation boundaries. Current service-language copy was checked in `src/data/international-inquiry-copy.ts` and `src/data/en-service-scope.ts`.

## Requested repair and recheck

| File:line | Exact original span | Reason/evidence | Proposed and applied rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| 938:21, FAQ 2 | `pelo responsável pela inspeção` | In Brazilian Portuguese the phrase can identify the inspector or authority. The official regulation, article 2, distinguishes the importer required to request inspection from the inspection authority. | `pelo importador responsável por solicitar a inspeção` | The intended legal subject is clarified. This is not a merely cosmetic synonym; the deadline and receipt rule are unchanged. |
| 938:42, article 24 paragraph | `atribui ao responsável pela inspeção a destinação` | Same ambiguity would assign the disposition duty to the wrong actor. Articles 23–25 use the defined importer for notification/retest/disposition and the authority for administrative decisions. | `atribui ao importador responsável por solicitar a inspeção a destinação` | The actor now matches the source. The listed options, qualifications and approval requirement are unchanged. |

The finding was returned to the author and root before any PASS. The author changed exactly these two expressions in repair round 1. This reviewer then reread the entire final article, FAQ and related conclusions and reran the original checker. Initial 938 SHA: `603794474433f03f7ff04f30761c3ab45ea3d6fdd43acbb6ffbb22b8826dd460`. Successful repair rounds: 1; unsuccessful repair rounds: 0. No manuscript file was edited by this reviewer.

The author independently removed a redundant opening question from 939 before freezing it and changed a later paragraph opener. The final direct legal-condition opening was read in full and measured; this reviewer does not claim to have authored that repair.

## First two paragraphs: deletion test

938 paragraph 1: removing the first sentence loses the importer, 15-day period, request destination and legal basis. Removing `Só cabe um pedido` loses the one-request limit. Removing the third sentence loses the Brazilian exporter's immediate task: obtain the complete notice and decide with the importer whether the result can be challenged. Retain all three; none is a contents forecast.

938 paragraph 2: its first sentence supplies the electronic-dispatch presumption that controls the deadline. Its second distinguishes a later forwarded copy from a new start date and identifies the system-issuance record that should accompany the notice. Deleting either changes the practical timing guidance. No removable opening padding remains.

939 paragraph 1: the first sentence identifies the Taiwanese two-route requirement for selling Brazilian coffee as organic. The second extends it to labels, display and advertising. Removing either removes scope. The original title-repeating question is absent from the final version.

939 paragraph 2: the first sentence names the actual certificate fields to inspect—issuer, certification place and covered activities. The second puts that review before printing and a distributor commitment. The third confines the effect of the Brazilian organic claim. They add different facts or timing and do not promise admission of a Brazilian certificate.

## Three recent same-language comparators

The latest publication-date group available in the current PT corpus is 2026-10-24. These actual files' opening two paragraphs, headings and endings were compared; hashes are in the JSON. This is a comparison of editorial structure, not a new legal certification of the older articles.

| Comparator and publication date | Concrete comparison |
|---|---|
| `src/content/columns-pt/704-taiwan-arc-first-application.md`, 2026-10-24 | Opens with an ARC deadline and then asks about visa-free/visitor entry; sections follow residence documents, translated certificates, filing and cost. 938 similarly gives an urgent deadline directly, but its progression follows notice, retained sample, disposal and contract costs. Its ending identifies the electronic-notice date, without reusing the ARC documents/renewal ending. |
| `src/content/columns-pt/705-taiwan-visa-residence-work-study-family.md`, 2026-10-24 | Opens with a visa-free residence question, then specifies Portuguese-passport conditions. 939 now starts with the organic-certification rule rather than another generic question. Its decision is certification territory and packaging, not immigration categories. It never applies a Portuguese-passport rule to Brazilians. |
| `src/content/columns-pt/706-taiwan-arc-renewal-changes-reentry.md`, 2026-10-24 | Opens with loss of residence grounds and then renewal timing, later using a procedure table and related-article ending. Both new pieces use product-specific headings and only a genuinely parallel legal list. Their endings identify either the notice date or the coffee stage/certification needed for a nonconfidential inquiry. |

Limitation: these comparators predominantly use European Portuguese (`morada`, `regresso`, `comprovativo`, `artigo 22.º`) and address residence. They demonstrate the site's recent form but cannot serve as proof of Brazilian idiom. The new articles were reviewed directly for Brazilian usage: `registro`, `coleta`, `laudo`, `torrefadora`, `gráfica`, `varejo`, `rótulo`, `reteste` and cardinal article references are appropriate in this business context. They are Brazil-specific export decisions, not Portugal texts with a country name replaced.

## Section 5 substantive review

1. Both current source files pass the original shared CLI with explicit `--lang pt`, actual exit 0 and zero FAIL. No local profile substitute was used. Actual commands and output are preserved in `pt-locale-variety.txt`.
2. Neither opening is a stock hypothetical or contents preview. 938 starts from a notice recipient and a deadline; 939 starts from eligibility to sell/label as organic. There is no invented client case, quotation or first-person practice claim.
3. 938: 36 sentences, CV 0.515, short share 0.25. Examples with real content include `Só cabe um pedido` and `São escolhas contratuais`. 939: 37 sentences, CV 0.454, short share 0.189; short clauses supply a question about changed label information or clarify certification coverage. Neither relies on empty short slogans. Long legal conditions are followed by explanation or a shorter factual sentence.
4. Paragraph openings were read vertically. The ordinary articles/prepositions do not create an excessive repeated opener pattern; no three-step numbered recipe or repeated teaching introduction dominates. Metrics: opener_rep 0.077 and 0.231, both within the original rule; run3 0.000 and 0.029.
5. Citations occur in legal sentences and source lists; there are also uncited practical paragraphs about obtaining the notice, linking expense records and approving a packaging version. No three-paragraph repeated claim/caveat structure was found.
6. Neither manuscript uses an ornamental `not X but Y` template. The negative qualifications have specific legal jobs: a fresh Brazilian sample does not replace the retained sample; a forwarded notice does not restart the deadline; foreign accreditation or a small package is not a general exemption. No unsupported reader belief is invented for rebuttal.
7. 938 ends its substantive discussion with the electronic-notice date; 939 with the product type, Brazilian process stage and existing certification. Email appears once per article, with four actual consultation languages, a nonconfidential first summary and no automatic-retainer promise.
8. No bold markup, public authorship claim, fake review claim, imperative checklist heading or foreign-law licensure claim appears. FAQs retain the same legal strength as the body. Metadata dates, pt audience and internal author are consistent with the brief.
9. The repair preserved 15 days, one request, original laboratory/sample, electronic-service presumption, the limited corrective routes and the separation of costs from administrative conditions. 939 preserves the territorial AND conditions, the approval document in the equivalence route, three months from a label-information change, ingredient/origin exceptions and authority-announced relief.

## Images

Both final WebP files were opened through `view_image`, not merely checked for existence.

| Article | Actual observation | SHA-256 |
|---|---|---|
| 938 | Cool inspection counter, sealed transparent container of green beans, metal sampling scoop, plain jute sack. No people, legible writing, logo, flag or identifying document. Alt matches; caption says fictional. | `46b814b548cea916f4e74b646645eac4b34926f257ed0ef4a01ef99bf34366a2` |
| 939 | Warm wooden packaging surface, two blank kraft pouches, roasted beans and blank paper samples. No certification mark, people, readable writing, logo or flag. The scene is distinct from the inspection image and matches its alt/fictional caption. | `a80c077de19d2b485b7897723fbe7ab9531f7b193d37957bc94f83bc4b029451` |

## Sources and limits

The official [import-inspection regulation](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0040017), including its actor definition and articles 23–25/29, was opened directly for the terminology finding. The official [Organic Agriculture Promotion Act](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=M0030093), articles 13 and 16–19, was also read directly. The [AFA equivalence list](https://www.afa.gov.tw/cht/index.php?code=list&ids=548) and [accredited-entity table](https://www.afa.gov.tw/cht/index.php?article_id=22184&code=list&flag=detail&ids=546) opened successfully: the country list does not list Brazil, and the table separates activities, territory and validity. No particular certifier is declared eligible for Brazil.

Initial individual-article MOJ opens failed. Successful official full-text responses and the failures are both preserved in `pt-locale-source-opens.json`; AFA responses are in `pt-locale-afa-opens.json`. This locale review does not replace the separate final legal reviewer, does not measure search demand, does not certify Brazilian regulatory compliance and did not perform public browser/rendering QA. No unresolved material locale issue remains at the hashes above.

Author handoff cross-check: the complete `pt-author.md` and `pt-author.json` were read after their frozen handoff. Their manuscript SHAs, actual CLI output, image SHAs, comparator dates, opening-deletion notes and source-access limitations match this review. Their file hashes are bound in `pt-locale.json`.

Metadata-only final rebind: after the prose review, the author found that `business` is absent from `COLUMN_TOPICS`. The final topics are `litigation` for 938 and `company` for 939. This reviewer directly read `src/lib/column-topics.ts`, verified both allowed values, and proved that replacing only these topic values with `business` exactly reproduces each previously reviewed whole-file SHA. All other bytes, including body, FAQ, dates and image metadata, are unchanged. The original CLI was rerun on both current files: exit 0, zero FAIL. Earlier locale evidence is retained in `pt-locale-pre-topic.json`; current author evidence binds the new hashes.
