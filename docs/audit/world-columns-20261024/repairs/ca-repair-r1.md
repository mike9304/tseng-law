# Catalan repair log — Grok r1

Checked on 24 October 2026 against `reviews/grok-ca-r1.md` and `briefs/BRIEF.md`.

The sole MUST finding is accepted and repaired. One small SHOULD correction is applied. Four SHOULD items require no article edit: one acknowledges the reviewer's language-confidence limit, and three expressly request retention if the cited official page supports the wording. ACCEPTED below means the review instruction was followed; it does not imply that every item required a text change. No MUST item was rebutted.

Only `drafts/ca/854-catalan-taiwan-divorce-children-residence.md` and this log were edited. Drafts 852 and 853 are byte-for-byte unchanged. The changes to 854 are its Article 31 sentence, the corresponding part of FAQ 3, and the court actor in its Article 1055-1 sentence. All summaries, filenames, field order, other frontmatter values, headings and source links are preserved.

## 852 — S1 — ACCEPTED, no text change

Reviewer note: “Confiança lingüística limitada … cap error de registre prou clar per proposar un canvi.” This applies to all three articles and identifies no sentence to repair.

Old → new: all article text → identical text. The limited linguistic confidence is acknowledged; neither this repair nor the independent AI check is represented as native-speaker or lawyer review. No statutory proposition was challenged by this item.

## 853 — S1 — ACCEPTED, verified retention

Old → new: the following passages → identical passages:

> Amb passaport ordinari, exigeix almenys sis mesos de vigència en entrar, bitllet de retorn o de continuació confirmat i els requisits d’admissió fronterera. La durada es compta des de l’endemà de l’arribada.

> BOCA també precisa que les activitats sotmeses a autorització continuen requerint-la durant una estada sense visat.

The live [BOCA Visa-Exempt Entry page](https://www.boca.gov.tw/fp-149-4486-7785a-1.html) confirms the requirements, the start of the stay period and the continuing permit requirement. Its Requirements section specifies “at least six months”, a “confirmed return air/sea ticket” or the specified onward-travel documentation, and admission eligibility. Duration of stay uses “day after arrival”; Remarks says regulated activities “must still obtain such a permit”. Spain and Andorra remain in the list allowing up to 90 days. The article's nationality qualification and “fins a noranta dies” are retained, as requested. Neither the FAQ nor the summary needs a related change.

## 853 — S2 — ACCEPTED, verified retention

Old → new:

> El portal oficial de la Gold Card explica que ofereix un permís obert sense patrocini d’un ocupador ni oferta prèvia.

→ Identical text, including the existing portal link.

The live [official Gold Card page](https://goldcard.nat.gov.tw/en/about/) says “Applicants can apply online without sponsorship” and “You don’t need to have already secured a job in Taiwan.” Its Work Permit description allows free employment-seeking and job changes; the Benefits section expressly describes an open work permit without pre-confirmed hiring or an employer application. Those are portal-supported claims, not claims that Article 9 alone supplies every detail. [Article 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=9), also checked with `python3 tools/law.py A0030295 9`, supports the preceding direct-application, four-document and one-to-three-year statements. No FAQ or summary change is needed.

## 854 — M1 — ACCEPTED, body and FAQ repaired

Verification: `python3 tools/law.py D0080132 31` and the live [Immigration Act Article 31](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31), paragraph 4, subparagraph 2:

> 外國人為居住臺灣地區設有戶籍國民之配偶，因遭受家庭暴力離婚，且未再婚。

The reviewer is right: the applicant must have suffered the violence. The repair also preserves the causal requirement in 因遭受家庭暴力離婚, the former spouse's Taiwan residence and household registration, and the applicant's not having remarried. The preceding statutory discretion, 得准予繼續居留, remains “permet autoritzar”; no entitlement or automatic approval is added. The proposed review wording was adjusted only to retain the causal connection explicitly.

Body, old:

> Entre aquests hi ha el divorci per violència familiar d’una persona casada amb un nacional resident a Taiwan amb registre familiar, sempre que no s’hagi tornat a casar.

→ New:

> Entre aquests hi ha qui s’ha divorciat d’un nacional resident a Taiwan amb registre familiar per haver patit violència familiar, sempre que no s’hagi tornat a casar.

FAQ 3, affected sentence, old:

> Entre aquests hi ha determinades situacions de violència familiar o de relació amb fills menors inscrits al registre familiar de Taiwan, amb les condicions de cada supòsit.

→ New:

> Entre aquests hi ha qui s’ha divorciat d’un nacional resident a Taiwan amb registre familiar per haver patit violència familiar i no s’ha tornat a casar, o determinades situacions de relació amb fills menors inscrits al registre familiar de Taiwan, amb les condicions de cada supòsit.

The rest of FAQ 3 is unchanged, including the warning that continuation cannot be presumed. The separate children-related route remains an alternative. The summary makes no domestic-violence eligibility claim, so it is unchanged.

## 854 — S1 — ACCEPTED, verified retention

Old → new: the opening's “aquest divorci produeix efecte amb la inscripció”, the paragraph requiring both spouses in principle and approved written representation for a justified reason, and its overseas-document authentication and Chinese-translation wording → identical text. FAQ 1's “Aquest divorci produeix efecte amb la inscripció” is also unchanged.

The live [Ministry of the Interior divorce-registration guide](https://www.ris.gov.tw/documents/html/2/3/1/384.html) supplies the evidence that was missing from the reviewer's materials:

- Applicants for consensual divorce: “雙方當事人”. Written representation: “有正當理由並經戶政事務所核准者，得以書面委託他人辦理。”
- Required documents, item 6: “應備證件在國外作成者，應經我駐外館處驗證”; foreign-language documents require “經駐外館處驗證或國內公證人認證之中文譯本”. The article concerns the Taiwan consensual-divorce route and documents prepared abroad; it does not extend that procedure to recording a divorce already effective abroad.
- Notes, item 1: “兩願離婚，應向戶政機關為離婚之登記，始生效力。” This directly supports the body and FAQ 1.

`python3 tools/law.py B0000001 1050 1055 1055-1` additionally confirms [Article 1050](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1050): “兩願離婚，應以書面為之，有二人以上證人之簽名並應向戶政機關為離婚之登記。” The guide is already linked in the opening, procedural paragraph and Sources. The review expressly permits retention when the guide confirms these statements; no redundant FAQ link or new text was necessary.

## 854 — S2 — ACCEPTED, small body correction

Verification: the same Civil Code command and the live [Article 1055-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1055-1):

> 法院為前條裁判時，應依子女之最佳利益，審酌一切情狀

Old, with the existing Article 1055-1 link preserved:

> exigeix decidir segons l’interès superior del menor, valorant totes les circumstàncies.

→ New:

> exigeix que el tribunal decideixi segons l’interès superior del menor, valorant totes les circumstàncies.

This identifies the court as the statutory actor, in the sentence already discussing Article 1055. It does not attribute this particular decision duty to every private agreement. FAQ 2 and the summary do not make the overbroad actor statement and remain unchanged.

## Source status and verification

All three law commands used existing caches; the tool and cache files were not modified. The relevant statute text was also opened live on the official Ministry of Justice site. The Civil Code's pending-commencement banner was checked against its [official history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001): it concerns Article 166-1 and the 17 August 2026 amendment to Article 1223, not Articles 1050, 1055 or 1055-1. The existing 24 October 2026 effective-law qualification in 854's Sources is retained. The official database displayed a consolidation cutoff of 16 October 2026; this is a check of the official text available on the review date, not a claim of coverage beyond that cutoff.

Read the current repository voice rules, FRONTMATTER guidance, the legacy COLUMN-VOICE-RULE pointer, and the shared sentence-variety and lessons files. The workspace copies of the latter two match the shared originals by SHA-256. The legacy pointer's `~/agent-library/knowledge/editorial-voice.md` target is absent; the current full repository `repo/docs/columns/EDITORIAL-VOICE.md` was available and read. Retired Fable instructions were not applied.

The prescribed variety command was run on all three files, with bytecode writes disabled:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check drafts/ca/<filename>.md
```

Each run returned exit 2: `ERROR measurement unavailable: cannot infer language ...; supply --lang`. Explicit `--lang ca` also returned exit 2 because Catalan is not supported. No automated FAIL-0 or numeric variety PASS is claimed.

Section 5 manual self-check:

- The three openings remain distinct: a labelled Girona brand example, a work-authorisation question, and the two-witness divorce requirement. None begins with the prohibited stock hypothetical formula. The opening facts and first-two-paragraph context were preserved during this bounded repair.
- Each article has at least two short sentences. Supplemental Unicode-word and punctuation heuristics counted 9, 6 and 5 sentences of eight words or fewer in 852, 853 and 854 respectively; these are diagnostics, not a validated Catalan measurement. The repairs did not introduce adjacent long sentences into the changed body paragraph.
- Reading paragraph openings vertically found no starting word used more than twice in any article; the same supplemental token check agrees. No three-paragraph claim/citation/caveat pattern was introduced. All three articles retain uncited practical or question paragraphs.
- No repeated rhetorical contrast or unsupported reader assertion was introduced. Each final prose paragraph remains tied to its subject: the launch dossier, employment and residence dates, or residence between divorce and departure.
- No bold, invented first-person experience or imperative checklist headings are present. Korean/Japanese register checks are inapplicable. No existing article number, deadline, amount, source link, nationality condition or hypothetical label was removed.

Comparators read: `repo/src/content/columns-ca/009-taiwan-voluntary-resignation-severance.md`, `012-taiwan-overtaking-accident-liability.md` and `015-taiwan-company-setup-pitch-location.md` (each displays 13 September 2025). The repaired articles preserve their different openings, issue-specific headings and concrete endings; they do not import the comparators' general closing cautions or instructional scaffolding. This is a bounded repair check, not a renewed claim of native review or a fresh publication audit.

Exact replacement comparison passed: 854 equals its pre-repair text with only the three replacements recorded above. Drafts 852/853, all summaries, all link sequences, the original review, brief, author note, statute tool and three used caches are unchanged. The existing restricted frontmatter syntax was checked using Python's standard-library JSON parser for its quoted scalar/array values and explicit field/FAQ structure checks; PyYAML was unavailable and nothing was installed. Field order, three FAQs, provenance, audience, no bold, four issue headings per article, Sources coverage and existing internal-link targets passed. Main prose counts, excluding metadata, headings and Sources, are 693 / 735 / 759 whitespace-delimited words for 852 / 853 / 854.

An independent `tseng-editor-final` AI reviewer, who did not author these articles or apply the repairs, returned PASS for the bounded manuscript repairs and all six review dispositions at the hashes below. It independently confirmed the victim/causation and other Article 31 conditions, the court actor, FAQ/summary consistency and the official-page retention decisions. This is not a full new legal audit or publication approval.

| File | Final SHA-256 | Article change |
|---|---|---|
| `852-catalan-brand-taiwan-trademark-distributor.md` | `694874421a8d9f7b3dcb75e42bd6646b90d0c2cacaae2b196420521a471b895f` | None |
| `853-catalan-professional-taiwan-work-permit-residence.md` | `59f437a70c1cc3ca375531404b167a4f872b247ba7844c2d3497afe2481fc886` | None |
| `854-catalan-taiwan-divorce-children-residence.md` | `3add035975d9b1276c8ab7d0a558219d9ad8ec603c9cd986590c6e9fc5ec572c` | M1 body + FAQ 3; S2 body |
