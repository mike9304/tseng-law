# Serbian drafts — repair of grok-sr-r1

Checked on 24 October 2026 against `reviews/grok-sr-r1.md` and `briefs/BRIEF.md`. This is a bounded repair record, not a new full-article review or publication approval.

Disposition: the one MUST is ACCEPTED and repaired in 893. The three conditional source-verification SHOULDs are ACCEPTED, checked against their official sources, and require no text change. The remaining SHOULD is a reviewer-confidence disclosure and is acknowledged. No item is REBUTTED.

Only `drafts/sr/893-serbian-resident-taiwan-police-summons-interpreter.md` and this log were written. Drafts 891 and 892 remain byte-identical. All three frontmatter blocks, including summaries and FAQs, remain byte-identical.

## 891 — Serbian professional, work permit and residence

### SHOULD S1 — ACCEPTED: official routing verified; text retained

Old → new: “Za pitanja iz Srbije [zvanični imenik BOCA](https://www.boca.gov.tw/sp-foof-countrycp-01-202-6687c-2.html) upućuje na Tajpejsko predstavništvo u Budimpešti.” → unchanged.

The live BOCA country directory identifies Serbia and says: “Please contact Taipei Representative Office, Budapest, Hungary”. This satisfies the reviewer's condition for retaining the sentence. The corresponding heading also remains supported. No FAQ or summary correction is needed.

### SHOULD S2 — ACCEPTED: visa requirements verified; text retained

Old → new: “U [uputstvu za boravišne vize za stručne radnike](https://www.boca.gov.tw/cp-166-276-48430-2.html) BOCA traži, između ostalog, pasoš, prijavu, fotografije i radnu dozvolu. Preostali period zaposlenja naveden u dozvoli mora pri podnošenju zahteva za ovu vizu biti duži od šest meseci.” → unchanged.

The live BOCA Resident Visas for Foreign White Collar Workers page, updated 1 May 2024, lists the application form, two photographs, passport with a photocopy, and original work permit with a photocopy. It states that the remaining employment period shown on the permit “must be more than 6 months” when applying for the resident visa. Both sentences are supported by the same existing citation. The draft's “između ostalog” correctly presents a non-exhaustive document list. No FAQ or summary correction is needed.

### SHOULD S3 — ACCEPTED: confidence disclosure acknowledged; no correction proposed

Old → new: the article's Serbian wording → unchanged.

The reviewer says “Pouzdanost recenzenta u srpskom je ograničena” and identifies no clear register error. This is a review limitation, not a statutory or textual defect; there is nothing to rebut or rewrite. No claim of human native-speaker or lawyer review is added.

## 892 — Serbian fruit exporter, unpaid invoices

### SHOULD S1 — ACCEPTED: trade claim verified; text retained

Old → new: “Smrznuto voće jeste navedeno među tajvanskim uvozima iz Srbije u [zvaničnom trgovinskom pregledu iz 2023. godine](https://www.trade.gov.tw/Files/PageFile/732206/732206egs3020230427104531.pdf).” → unchanged.

The official PDF's page 7, under “三、臺塞雙邊經貿關係”, lists “冷凍果實” in the row “主要進口項目 (4 位碼)”. This verifies frozen fruit among Taiwan's imports from Serbia in the cited historical report. The existing sentence retains its 2023 qualification; it does not assert current trade volumes.

The web PDF parser failed, but direct HTTPS retrieval from the cited government URL returned HTTP 200. Page 7 was extracted from those bytes in memory with the installed `pdftotext`; no local PDF or cache was written. Retrieved file: 370,776 bytes; SHA256 `10ac3d53d487aa3749ec377c9f203a0207823366400d7368d4ffe3d3001aca69`. No FAQ or summary correction is needed.

## 893 — Police summons and interpreter

### MUST M1 — ACCEPTED: Article 93-2 grounds corrected

Verified with `python3 tools/law.py C0010001 93-2 93-5`, using the existing cache without refreshing it, and independently against the live [Article 93-2 page](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=93-2). The relevant statutory wording is:

> 被告犯罪嫌疑重大，而有下列各款情形之一者，必要時檢察官或法官得逕行限制出境、出海。
>
> 一、無一定之住、居所者。
>
> 二、有相當理由足認有逃亡之虞者。
>
> 三、有相當理由足認有湮滅、偽造、變造證據或勾串共犯或證人之虞者。

The first ground concerns a fixed or determinate domicile/residence, not permanent-residence status. The third ground expressly names destruction, forgery or alteration of evidence and collusion with an accomplice or witness. The reviewer's correction is supported: the old broad evidence phrase and “dogovaranja iskaza” did not expressly preserve those statutory alternatives.

Old → new, within the existing Article 93-2 sentence:

> nepostojanje stalnog prebivališta ili boravišta, osnovanu opasnost od bekstva ili od ometanja dokaza odnosno dogovaranja iskaza.

→

> nepostojanje određenog prebivališta ili boravišta, osnovanu opasnost od bekstva ili osnovanu opasnost od uništenja, falsifikovanja ili izmene dokaza ili od dogovaranja sa saučesnikom ili svedokom.

Only this span changed. The same sentence retains serious suspicion, necessity and the alternative-ground structure, and keeps its inline Article 93-2 link. The following sentence preserves the exclusion for offenses punishable at most by 拘役 or solely by a fine. The adjacent Article 93-5 discussion is unchanged.

FAQ/summary check: the summary addresses the summons, language and procedural status; FAQ 3 tells the reader to check for an existing exit restriction and explains that rescheduling does not revoke it. Neither repeats the defective list of grounds, so neither needs an amendment.

Law-status check: the live [Code of Criminal Procedure history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=C0010001) records the addition of Article 93-2 on 19 June 2019 with commencement six months after promulgation. Its latest listed amendment, 13 May 2026, concerns Article 101-1. The checked sources show no pending-commencement warning for this provision. The MOJ site reports a consolidation cutoff of 16 October 2026; this is the evidence boundary of the live check on 24 October.

## Verification and section 5 self-check

- Exact comparison with the starting manuscript contents: 891 and 892 unchanged; 893 equals the original with only the quoted span replacement. Filenames, frontmatter bytes, headings, source links and all other text are preserved. No bold markup was present or added.
- Structure checks passed for all three drafts: prescribed frontmatter keys/order, three FAQ entries, four substantive H2 headings, no body H1, source-check date, coverage of body source links in the source list, and existing Serbian internal-link targets.
- Ran `PYTHONDONTWRITEBYTECODE=1 python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <file> --lang sr` for each of the three drafts. Each exited 2 with `argument --lang: invalid choice: 'sr'`. Serbian is unsupported. No automated variety PASS or numerical FAIL-0 result is claimed, and no other language was substituted.
- Manual section 5.2–5.4: the openings remain distinct (job/entry question; explicitly hypothetical delivery dispute; explanation of summons labels). Each article has at least two short sentences, such as 891 “Naziv radnog mesta nije dovoljan” and “Uporedite ih sa ponudom”; 892 “Svaka faktura ima svoj red” and “Osporene odbitke prikažite odvojeno”; 893 “Zabeležite odgovor” and “Avionska karta ne ukida zabranu”. The expanded statutory enumeration is framed by shorter sentences. Paragraph-start words occur no more than twice in any article: 891 `Za`/`U`, 892 `Ako`, 893 `Ako`/`Kada`.
- Manual section 5.5–5.8: all drafts retain citation-free practical paragraphs and concrete body questions; no three-paragraph claim/citation/caveat pattern or repeated contrast template was identified. Endings remain tied to each article's documents and reader decision. No invented first-person experience, bold emphasis or imperative checklist headings were introduced. Korean/Japanese register rules do not apply to Serbian.
- Manual section 5.9: the one substantive correction restores the enumerated legal grounds. Article numbers, links, dates, amounts, exceptions and hypothetical labeling remain intact; no broader style rewrite was made.
- Independent AI reviewer `sr_bounded_check` verified the three conditional SHOULD sources and returned PASS for the saved 893 correction, summary/FAQ consistency and absence of a new monotony issue. This is a bounded AI editorial check, not a claim of native-speaker or lawyer review. No further repair was requested.

Final manuscript SHA256 values:

| Draft | SHA256 |
| --- | --- |
| 891 | `caacb03586383f0cb09ba8e78ecfce533b5e0d2a61d2189707d9dbe186f608bb` |
| 892 | `e018fa70eb2d555a6a81f9001ab4524749398175df792d42b47f27c87817d0cb` |
| 893 | `036d8f0e03a9c48a9e7474eb7e581dfbca27781d4bb690c825e16090b1594dc8` |
