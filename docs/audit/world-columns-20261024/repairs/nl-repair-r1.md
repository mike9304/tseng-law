# Dutch column repair log — review r1

Checked on 24 October 2026 against `reviews/grok-nl-r1.md` and `briefs/BRIEF.md`.

Scope: two sentence replacements, in 835 and 836. Column 834 is byte-identical to the starting version. All three frontmatter blocks, filenames, headings, source lists, summaries and FAQs are unchanged.

Disposition: all seven review items ACCEPTED — two substantive MUST repairs and five SHOULD source checks supporting retention. No item is REBUTTED. For a verification-only item, “→ unchanged” accepts the reviewer's conditional instruction to keep the text if the official source supports it; it does not describe an error in the original sentence.

## 834 / S1 — ACCEPTED, verification only

Old → new:

> Verdragsbescherming hangt onder meer af van de fiscale woonplaats en de soort inkomsten; zie [artikelen 1 en 4 van de overeenkomst](https://no06.mofa.gov.tw/mofatreatys/ShowPicOut.aspx?FileFolder=14&FileName=14210_E.PDF).

→ unchanged.

The official English agreement was opened live. Article 1 applies to “residents of one or both of the territories”; article 4 defines treaty residence. Income categories receive separate treatment, including business profits in article 7 and its paragraph 7 reservation for income governed by other articles. The broad sentence is supported; articles 1 and 4 supply its residence component. The [current MOF list](https://www.mof.gov.tw/singlehtml/191?cntId=63930), Netherlands row, and the agreement's first page confirm signature on 27 February 2001 and entry into force on 16 May 2001. No rewrite required.

## 835 / M1 — ACCEPTED, substantive correction

Old:

> De Taiwanese inkomstenbelastingwet kent een vaste bedrijfsplaats en een bedrijfsagent, onder meer bij gewoonlijk uitgeoefende bevoegdheid om zaken te onderhandelen en contracten te sluiten, buiten louter inkoop: [artikel 10](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=10).

→ New:

> De Taiwanese inkomstenbelastingwet kent een vaste bedrijfsplaats en een bedrijfsagent, onder meer wanneer iemand buiten louter inkoop de bevoegdheid heeft om regelmatig namens de onderneming zaken te onderhandelen en contracten te sluiten: [artikel 10](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=10).

Verification: `python3 tools/law.py G0340003 7 8 10`, using the existing cache without writing it, and the [live article 10](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=10). Paragraph 2, subparagraph 1 reads:

> 除代理採購事務外，並有權經常代表其所代理之事業接洽業務，並簽訂契約者。

The reviewer is right: the Dutch sentence must describe authority to regularly negotiate and conclude contracts on the enterprise's behalf, preserving both acts and the procurement exclusion. “Onder meer” continues to leave the other statutory agent grounds open. The amendment removes the imported actual-exercise formulation from this domestic-law sentence.

FAQ/summary check: no change. FAQ 3 expressly addresses article 5 of the treaty, whose paragraph 5 requires “has, and habitually exercises”. Its “gewoonlijk uitgeoefende bevoegdheid” therefore remains correct, as does the treaty paragraph in the body. The summary does not state this statutory test.

## 835 / S1 — ACCEPTED, verification only

Old → new:

> Daarnaast kan dienstverlening via personeel voor hetzelfde of een samenhangend project een vaste inrichting vormen wanneer die activiteiten in Taiwan samen meer dan 183 dagen binnen twaalf maanden duren: [artikel 5, derde lid, onder b](https://no06.mofa.gov.tw/mofatreatys/ShowPicOut.aspx?FileFolder=14&FileName=14210_E.PDF).

→ unchanged.

The [official English agreement](https://no06.mofa.gov.tw/mofatreatys/ShowPicOut.aspx?FileFolder=14&FileName=14210_E.PDF), PDF pages 2–4, supports every treaty point listed by the reviewer:

- Article 5(1): fixed place through which the enterprise's business is carried on.
- Article 5(3)(b): personnel services for the same or a connected project, cumulatively “more than 183 days within any 12-month period”.
- Article 5(4): relevant exclusions, including preparatory/auxiliary activities.
- Article 5(5): authority and habitual exercise, subject to the paragraph 4 restriction.
- Article 5(6): independent agents acting in their ordinary business.
- Article 7(1): taxation of profits attributable to the permanent establishment.

The separate treaty test, conditional wording and nonexclusive grounds remain intact.

## 836 / M1 — ACCEPTED, substantive correction

Old:

> De uitzondering voor maximaal negentig dagen geldt voor een niet-inwoner en beloning van een buitenlandse werkgever; zie [artikel 8, onderdeel 3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=8).

→ New:

> De uitzondering geldt alleen voor een niet-inwoner die in één belastingjaar in totaal niet meer dan negentig dagen in Taiwan verblijft, en alleen voor beloning van een werkgever buiten Taiwan; zie [artikel 8, onderdeel 3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=8).

Verification: the same `law.py` command and the [live article 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=8). Subparagraph 3 states:

> 但非中華民國境內居住之個人，於一課稅年度內在中華民國境內居留合計不超過九十天者，其自中華民國境外僱主所取得之勞務報酬不在此限。

The reviewer is right. The repair restores the single-tax-year boundary and cumulative counting, while retaining nonresident status and identifying the employer as outside Taiwan. The adjacent treaty-priority sentence is unchanged.

FAQ/summary check: neither the summary nor any of the three FAQs describes this tax exception. No consequential amendment is needed.

Commencement check for both MUST items: the live [Income Tax Act history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=G0340003) and article pages identify the pending provision as article 43-4. That banner does not suspend articles 8 or 10. Both articles already place the tax discussion as of 24 October 2026; those date qualifications are preserved.

## 836 / S1 — ACCEPTED, verification only

Old → new:

> De [Nederland-specifieke voorwaarden van BOCA](https://www.boca.gov.tw/fp-153-5491-8dfd1-2.html) verlangen onder meer een paspoort dat nog minstens twaalf maanden geldig is, bewijs van minstens €2.500 aan startmiddelen en een verklaring omtrent het gedrag.

→ unchanged.

[BOCA's Dutch-specific guidance](https://www.boca.gov.tw/fp-153-5491-8dfd1-2.html), application conditions, documents and additional information, confirms twelve-month passport validity, €2,500, conduct certificate, ticket documentation, Netherlands residence, first participation, dependent restrictions and personal submission. It also confirms holiday purpose, the permanent-work restriction and whole-stay accident/health insurance including hospitalization and repatriation. Exact short quotation: “Proof of funds of at least €2,500”.

The corresponding general conditions are corroborated by [MOFA FAQs](https://youthtaiwan.mofa.gov.tw/WorkingholidayEN/cp.aspx?n=6440), questions 1–2, 4, 6, 8–9. The Dutch-specific amount controls over the general FAQ's €2,000. All related passages listed by S1 remain unchanged.

## 836 / S2 — ACCEPTED, verification only

Old → new:

> Het bezoekersvisum voor meerdere binnenkomsten is één jaar geldig vanaf afgifte. Per binnenkomst geldt maximaal 180 dagen verblijf, gerekend vanaf de dag na aankomst, volgens [BOCA's Nederlandse regeling](https://www.boca.gov.tw/fp-153-5491-8dfd1-2.html).

→ unchanged.

[BOCA](https://www.boca.gov.tw/fp-153-5491-8dfd1-2.html), Visa category items 1–4, confirms multiple-entry visitor status, validity for one year from issue, 180 days per entry beginning the following day, an extension request within the preceding fifteen days, and the one-year ceiling from first entry. Short quotation: “DURATION OF STAY STARTS FROM THE NEXT DAY OF ARRIVAL.”

The no-reset conclusion follows from that first-entry ceiling. BOCA and [MOFA FAQ 7](https://youthtaiwan.mofa.gov.tw/WorkingholidayEN/cp.aspx?n=6440) prohibit changing visa type after entry; FAQ 14 identifies the local immigration service centre for extension. Visitor classification, read with [NHI Act article 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=L0060001&flno=9), supports the residence-document explanation. The general MOFA NHI list is not treated as expressly naming Dutch nationals. All related passages listed by S2 remain unchanged.

## 836 / S3 — ACCEPTED, verification only

Old → new:

> Volgens de [fiscale overheidsuitleg](https://www.etax.nat.gov.tw/etwmain/en/announcement/alien-individual-income-tax/instructions) loopt dat jaar van januari tot en met december.

→ unchanged.

The linked [eTax instructions](https://www.etax.nat.gov.tw/etwmain/en/announcement/alien-individual-income-tax/instructions), section I.1(1)A, explicitly say “a taxable year (January 1 to December 31)”. The retained September–August example therefore spans two tax years.

## Verification and editorial limits

- Exact comparison with the starting texts confirms only the two replacements quoted above. Column 834 is unchanged; all frontmatter blocks, FAQ answers, summaries and source lists are byte-identical.
- Ruby YAML parsing confirms the prescribed sixteen fields in order, three FAQ entries, `audience: ["nl"]` and `author: "legal-ai-assistant"` in all three drafts.
- No bold or body H1; four substantive H2 headings per article; all body sources remain in the source list and every internal column link resolves to an existing local Dutch draft/snapshot slug. No git, installation or publication performed.
- A separate AI reviewer checked 836 S1–S3 against live official pages, then reread both actual repaired passages and their FAQ/summary context. Bounded PASS at the final 835/836 hashes below; this is not a claim of human, native-speaker or lawyer review.

The prescribed variety checker was executed with `--lang nl` for all three files and exited 2: Dutch is unsupported. An automated Dutch FAIL-0 result cannot be claimed. The unchanged checker was also run with `--lang en` as a disclosed spacing-based diagnostic, with `PYTHONDONTWRITEBYTECODE=1`: exit 0 and “OK — no variety limit violated” for all three. This diagnostic is not a Dutch-language validation.

Section 5 manual self-check:

1. Dutch-tool limitation and supplementary result are disclosed above.
2. Openings remain distinct: an explicitly fictional contract scenario (834), a hiring question (835), and an official quota (836). No stock hypothetical opener. The first two paragraphs still supply the transaction and documents, hiring sequence and chronology, or quota/eligibility and holiday purpose respectively; the two repairs do not add introductory repetition.
3. Supplementary Unicode word counting, excluding metadata and sources, finds 10/9/18 sentences of at most eight words; no paragraph has more than one sentence of at least 32 words.
4. No paragraph's opening word occurs more than twice within an article.
5. No three consecutive claim–citation–caveat paragraphs; each article has uncited practical-preparation paragraphs.
6. No repeated not-X-but-Y pattern or newly invented reader misconception; the single work/medical-coverage contrast heading is unchanged.
7. Endings remain tied to the contract-party overview, interview/start dates, and pay slip/travel dates respectively.
8. Dutch register remains consistent; no bold, invented experience or imperative checklist heading was introduced. Korean/Japanese register checks do not apply.
9. Only the two substantiated legal formulations change. Citation URLs, amounts, dates, other conditions, exceptions and the hypothetical label are preserved.

Comparison material reread: Dutch snapshot columns 009 (`taiwan-voluntary-resignation-severance`), 013 (`taiwan-company-establishment-advanced-1`) and 015 (`taiwan-company-setup-pitch-location`). The repairs do not import their backward-looking introduction, general Q&A announcement or generic closing. These are repository-snapshot comparators, not a claim about the latest live publications.

Supplementary main-text counts include headings and contact prose, exclude frontmatter and `## Bronnen`, and remove Markdown link destinations. Sentence lengths use Unicode word recognition.

| Column | Main-text words | Sentences | Length CV | Sentences ≤8 words | Maximum repeated paragraph start |
|---|---:|---:|---:|---:|---:|
| 834 | 666 | 46 | 0.479 | 10 | 2 |
| 835 | 863 | 54 | 0.484 | 9 | 2 |
| 836 | 869 | 63 | 0.511 | 18 | 2 |

## Exact versions

| File | Starting SHA-256 | Final SHA-256 |
|---|---|---|
| `834-dutch-company-taiwan-subsidiary-branch-office.md` | `a48099143da3442295e5df3fba06bb426f85db2d778d2da445e3c37c704a2ced` | `a48099143da3442295e5df3fba06bb426f85db2d778d2da445e3c37c704a2ced` |
| `835-dutch-employer-taiwan-first-hire-eor.md` | `36aa70a90bccb6676a85e43db8940f38b6958a17809eb8ab0ccce123686b7ec8` | `acc99ca7a2809d513778d9c5f2187b2dc79d58b331a626d5afb769b769b70250` |
| `836-dutch-working-holiday-taiwan-work-insurance-tax.md` | `253dec033bde5a1df7859396681c58946c96278b7b804af38cd5fe0b8d7a264f` | `a20827f6b136cfae498ca07878486c926b2ec60d6b46ba4fb08460c7e9ddbea4` |

File writes for this repair: the two amended drafts and `work/nl-repair-r1.md`. The existing author ledger and review report were not edited; the hashes above identify the versions to which this repair record applies.
