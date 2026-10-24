# Danish repair log — independent review r1

Checked on 24 October 2026 against `reviews/grok-da-r1.md` and `briefs/BRIEF.md`. Scope: the three existing Danish drafts and this log only.

All three MUST findings are accepted. Four SHOULD items receive small substantive additions; three official-page verification requests and three language-review limitations are accepted without changing the corresponding text. All 13 review items are addressed below. The proposed wording for 840 S1 is qualified where it adds an unsupported deadline for the authority's decision.

## 840 — danish-company-taiwan-subsidiary-branch-project-office

### MUST M1 — ACCEPTED

Old:

> Begrænsede brancher kan desuden kræve sektormyndighedens tilladelse efter [artikel 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=7).

→ New:

> For brancher, hvor investering er begrænset, skal investoren efter [artikel 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=7) indhente sektormyndighedens tilladelse eller samtykke. Visse brancher er efter samme artikel helt lukket for investering.

Evidence: [Foreign Investment Statute article 7(1)–(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=7), checked with `python3 tools/law.py J0040002 7` and the official page:

> 下列事業禁止投資人投資：
> 一、對國家安全、公共秩序、善良風俗或國民健康有不利影響之事業。
> 二、法律禁止投資之事業。
> 投資人申請投資於法律或基於法律授權訂定之命令而限制投資之事業，應取得目的事業主管機關之許可或同意。

The restricted-sector permission or consent is mandatory; paragraph 1 separately prohibits specified investments. This corrects legal strength and scope, not merely style. FAQ 1 already requires the relevant investment approval and examination of sector restrictions; it does not repeat the optional-permission error. The summary makes no contrary assertion. Both remain unchanged.

### SHOULD S1 — ACCEPTED, with the proposed extension wording corrected

Old:

> [Artikel 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=9) kræver, at den godkendte kapital tilføres inden den fastsatte frist, og at investeringsbeløbet efterfølgende godkendes ved kontrol.

→ New:

> [Artikel 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=9) kræver, at hele det godkendte indskud tilføres inden den fastsatte frist, og at tilførslen anmeldes til myndighedens kontrol. Godkendelsen tilbagekaldes ved fristens udløb for den del, der ikke er indbetalt. En forlængelse kræver gyldig grund, en ansøgning inden fristens udløb og myndighedens godkendelse. Efter indbetalingen skal investoren ansøge om fastsættelse af investeringsbeløbet.

Evidence: [Foreign Investment Statute article 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=9), checked with `python3 tools/law.py J0040002 9` and fresh official LawAll text:

> 投資人應將所核准之出資於核定期限內全部到達，並將到達情形報請主管機關查核。
> 投資人經核准投資後，在核定期限內未實行全部或一部出資者，其未實行之出資於期限屆滿時撤銷之。但有正當理由者，應於期限屆滿前，申請主管機關核准延展。
> 投資人於實行出資後，應向主管機關申請審定投資額；其審定辦法，由主管機關定之。

The replacement distinguishes full contribution, reporting for checking, revocation of the unperformed portion, and the later application to determine the investment amount. It states that the approval relating to the unpaid portion is revoked, rather than suggesting money already paid disappears.

The review's proposed phrase “medmindre udsættelse forinden er godkendt” is not adopted. The statute requires an application before expiry — “應於期限屆滿前，申請主管機關核准延展” — and authority approval of the extension; it does not expressly require the approval decision itself before expiry. The final wording preserves both requirements without inventing that decision deadline. The FAQ on capital sufficiency and full payment contains no inconsistent deadline statement.

### SHOULD S2 — ACCEPTED as a verification request; wording retained

Old → new:

- “Invest Taiwans sammenligning beskriver forskellen mellem de tre etableringsformer.” → unchanged.
- “Rækkefølgen for datterselskabet omfatter normalt navneafklaring, investeringsgodkendelse, indbetaling og kontrol af investeringsbeløbet samt selskabs- og skatteregistrering” → unchanged.
- “Selskabskapitalen har ikke et generelt lovbestemt minimum. Myndighedens vejledning kræver dog tilstrækkelig kapital til rimelige etableringsomkostninger og tager forbehold for særlige branchekrav.” → unchanged.

The linked [Invest Taiwan establishment guide](https://investtaiwan.nat.gov.tw/showBusinessPagejpnInvestmentStatus01?lang=cht&search=InvestmentStatus01) contains the company/branch/representative-office comparison, the name/investment/remittance-and-amount-review/company/tax registration sequence, and the capital guidance. Its capital text includes “無最低資本額要求” and “足夠支應合理的開辦成本”, with a separate exception for specially licensed businesses. These are agency-guidance claims supported by that page; they are not inferred solely from the Company Act. FAQ 3 remains supported. No unrelated tax or governance statements from the large comparison table were imported.

### SHOULD S3 — ACCEPTED as a review limitation; no text change

Old → new: existing Danish register and all frontmatter → unchanged. The reviewer proposes no wording correction. This repair does not claim native-speaker or lawyer review.

## 841 — danish-buyer-taiwan-wind-components-defect-notice

### MUST M1 — ACCEPTED

Old:

> Ubetydelig værdiforringelse eller nedsat anvendelighed falder uden for bestemmelsens almindelige mangelbegreb.

→ New:

> Kun en ubetydelig forringelse af værdien eller anvendeligheden falder uden for bestemmelsens almindelige mangelbegreb.

Evidence: [Civil Code article 354(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=354), checked with `python3 tools/law.py B0000001 354` and the official page:

> 物之出賣人對於買受人，應擔保其物依第三百七十三條之規定危險移轉於買受人時無滅失或減少其價值之瑕疵，亦無滅失或減少其通常效用或契約預定效用之瑕疵。但減少之程度，無關重要者，不得視為瑕疵。

The exception concerns an insignificant degree of diminution; reduced usability is not excluded generally. The unchanged preceding sentence still covers risk transfer and guaranteed qualities. Neither the FAQs nor the summary repeats the erroneous exclusion.

### MUST M2 — ACCEPTED

Old:

> Retten til en mangelfri erstatningsvare efter [artikel 364](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=364) gælder varer, der alene er bestemt efter art. Den kan ikke uden videre overføres til enhver individuelt specificeret maskine.

→ New:

> Er varerne alene bestemt efter art, kan køberen efter [artikel 364](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=364) straks kræve en mangelfri erstatningsleverance i stedet for ophævelse eller prisafslag. Denne ret kan ikke uden videre overføres til enhver individuelt specificeret maskine.

Evidence: [Civil Code article 364(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=364), checked with `python3 tools/law.py B0000001 364` and the official page:

> 買賣之物，僅指定種類者，如其物有瑕疵，買受人得不解除契約或請求減少價金，而即時請求另行交付無瑕疵之物。

The original already described a right rather than a duty. The substantive omissions were immediacy and replacement as an alternative to rescission or reduction of the price. The repair explicitly retains the buyer's option, the generic-goods limitation, and the preceding seller-liability condition. “Den” becomes “Denne ret” only to preserve its referent after the sentence changes. The FAQs concern notice, rescission/price-reduction periods, and damages; none states a contrary replacement rule.

### SHOULD S1 — ACCEPTED

Old:

> [Lovvalgsreglen i artikel 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20) følger parternes lovvalg og, uden et gyldigt udtrykkeligt valg, den nærmeste tilknytning.

→ New:

> [Lovvalgsreglen i artikel 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20) følger parternes lovvalg og, uden et gyldigt udtrykkeligt valg, den nærmeste tilknytning. Hvis en ydelse kendetegner aftalen, formodes loven på den ydende parts hjemsted ved aftalens indgåelse at have den nærmeste tilknytning. For aftaler om fast ejendom formodes loven på ejendommens beliggenhedssted.

Evidence: [Choice of Law Act article 20(3)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20), checked with `python3 tools/law.py B0000007 20` and the official page:

> 法律行為所生之債務中有足為該法律行為之特徵者，負擔該債務之當事人行為時之住所地法，推定為關係最切之法律。但就不動產所為之法律行為，其所在地法推定為關係最切之法律。

The original general rule remains intact. Two sentences add the characteristic-performance presumption, the time of contracting, and the real-property presumption. “Formodes” preserves a presumption rather than a conclusive rule. The surrounding warning that the supplier's address does not alone settle applicable law remains. No FAQ or summary changes follow.

### SHOULD S2 — ACCEPTED as a review limitation; no text change

Old → new: existing Danish register and all frontmatter → unchanged. No separate register correction was proposed; no native-speaker or lawyer certification is claimed.

## 842 — danish-engineer-taiwan-work-permit-family-residence

MUST: none.

### SHOULD S1 — ACCEPTED as a verification request; wording retained

Old → new:

- “kræver blandt andet mindst seks måneders pasgyldighed ved indrejse samt bekræftet hjem- eller vidererejse og eventuelt nødvendigt visum til næste destination” → unchanged.
- “Opholdet regnes fra dagen efter ankomsten.” → unchanged.
- “BOCA tillader visumfrie besøg til blandt andet forretningsformål, der ikke kræver særlig tilladelse, men fastholder tilladelseskravet for aktiviteter, som er reguleret.” → unchanged.
- “særskilte visumtrin for personer, der kommer visumfrit for at udføre kontraktarbejde i mere end seks måneder og søger ophold” → unchanged.

The [official BOCA Visa-Exempt Entry page](https://www.boca.gov.tw/fp-149-4486-7785a-1.html), displayed publication date 17 July 2026, supports each claim: requirements 1 and 3, duration item 1, remarks item 1, and the contract-work note under duration item 2. Relevant brief excerpts are “at least six months”, “starts from the day after arrival”, “more than 6 months”, “must still obtain such a permit” and “confirmed seat reservation”. Denmark is on the up-to-90-day list. The existing text keeps entry permission, work permission, and contract workers' residence route distinct. No FAQ change is needed.

### SHOULD S2 — ACCEPTED as a verification request; wording retained

Old:

> Programmets officielle vejledning beskriver en åben arbejdstilladelse uden krav om et jobtilbud på forhånd.

→ New: unchanged.

The linked [official Gold Card introduction](https://goldcard.nat.gov.tw/en/about/) describes free job seeking and changes of employment and states: “You don’t need to have already secured a job in Taiwan.” Article 9 is separately cited for personal application, the qualifying category, the four combined documents and one-to-three-year validity; the job-offer statement is attributed to the program page, not inferred from article 9. The qualifying-category caution remains in the article.

### SHOULD S3 — ACCEPTED

Old:

> Et gyldigt kombinationsdokument med opholdskortfunktion er undtaget.

→ New:

> Et gyldigt kombinationsdokument med opholdskortfunktion eller et andet dokument, der allerede fungerer som opholdskort, er undtaget.

Evidence: [Immigration Act article 22(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22), checked with `python3 tools/law.py D0080132 22` and the official page:

> 但申請取得工作許可、居留簽證、外僑居留證及重入國許可四證合一之有效證件，或其他已含有外僑居留證功能之證件者，得免申請外僑居留證。

The exception includes other documents already incorporating ARC functionality. The original requirement for the combined document to have that function stays explicit. The 30-day period counted from the day after entry is unchanged. No FAQ or summary asserts that only the combined card qualifies.

### SHOULD S4 — ACCEPTED

Old:

> Bestemmelsen angår nærmere afgrænset kontraktarbejde efter artikel 46, stk. 1, nr. 1 eller 2.

→ New:

> Bestemmelsen angår kontrakter om entreprise, køb, teknisk samarbejde og lignende, når arbejdet falder under artikel 46, stk. 1, nr. 1 eller 2. Tilladelsen skal søges efter forskrifterne udstedt i medfør af [artikel 48, stk. 2 og 3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=48).

Evidence: [Employment Service Act article 51(3)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=51), checked with `python3 tools/law.py N0090001 51 48` and fresh official LawAll text:

> 外國法人為履行承攬、買賣、技術合作等契約之需要，須指派外國人在中華民國境內從事第四十六條第一項第一款或第二款契約範圍內之工作，於中華民國境內未設立分公司或代表人辦事處者，應由訂約之事業機構或授權之代理人，依第四十八條第二項及第三項所發布之命令規定申請許可。

The existing preceding sentence already identifies the foreign business without a Taiwan branch or representative office and the contracting enterprise/authorized agent application route, so it is preserved. The repair supplies the contract examples, keeps “og lignende” because 等 is not exhaustive, and adds the delegated-regulation basis. [Article 48(2)–(3)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=48) was also checked directly. The new inline article 48 link is added to the existing Employment Service Act source-list entry:

Old:

> [46](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=46) og [51](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=51).

→ New:

> [46](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=46), [48](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=48) og [51](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=51).

FAQ 2 already warns against automatically applying the ordinary professional route to contract personnel. It remains consistent and unchanged.

### SHOULD S5 — ACCEPTED as a review limitation; no text change

Old → new: existing Danish register and all frontmatter → unchanged. No separate register correction was proposed. No human native-speaker or lawyer review is represented.

## Verification

Statutory checks used the existing, unchanged `html/` files through the requested tool:

```text
python3 tools/law.py J0040002 7 9
python3 tools/law.py B0000001 354 364
python3 tools/law.py B0000007 20
python3 tools/law.py D0080132 22
python3 tools/law.py N0090001 51 48
python3 tools/law.py A0030295 9
```

All nine provisions were also compared with freshly retrieved official LawAll HTML using curl with TLS verification enabled: all matched the cached article text. No cache file was created or changed. Two web-tool LawSingle opens failed, and Python urllib encountered a certificate-validation error; the secure curl readbacks succeeded without disabling certificate verification.

The Civil Code pending-effect banner concerns article 166-1 and the 17 August 2026 amendment to article 1223, not articles 354 or 364. The draft's existing “den 24. oktober 2026” qualification is retained. The other checked laws showed no pending-effect banner. The fresh MOJ pages displayed a consolidation cutoff of 16 October 2026; this log records the official text available on the checking date, not a guarantee of same-day consolidation.

Preservation checks:

- Exactly eight replacement spans implement seven reviewed text corrections; the eighth is the corresponding article 48 source-list addition.
- Each saved article exactly matches its captured original plus those replacements.
- All frontmatter is byte-identical to the captured originals, including summaries, all nine FAQ entries, field order, dates, images and internal author provenance.
- YAML parses; each article has three FAQ entries and the existing headings. No bold, body H1, byline or footer was introduced.
- Existing source links, internal links, contact paragraphs, filenames and hypothetical labels are preserved. The added statute is linked inline and in the source list.
- No repository, review, original author-note, other-locale, tool or shared-rule file was edited. No git, installation or publication command was run.

### Sentence variety and section 5 self-check

The required command was run:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check drafts/da/*.md
```

It returned exit 2 for all three files: language could not be inferred. Inspection of the installed tool confirms that Danish is not a supported language. This is unavailable measurement, not a Danish PASS or a completed automatic FAIL-0 check.

A supplemental run with `--lang en` returned exit 0 and zero FAILs on all three saved files. This mode has English tokenization and contrast patterns and does not recognize the Danish source heading, so it is only a mechanical proxy:

| Article | Proxy sentences | Length CV | Short share | Similar-length runs |
|---|---:|---:|---:|---:|
| 840 | 55 | 0.478 | 0.182 | 0.038 |
| 841 | 63 | 0.497 | 0.175 | 0.033 |
| 842 | 60 | 0.557 | 0.250 | 0.017 |

A separate read-only Unicode-word diagnostic excluded frontmatter, headings and `Kilder`, protected Danish abbreviations `stk.`, `nr.`, `art.` and `jf.`, and recognized æ/ø/å:

| Article | Sentences | Length CV | Short share | Short sentences | Similar-length runs | Maximum paragraph-opener count | Consecutive same first word | Paragraphs with multiple sentences of 32+ words |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 840 | 55 | 0.454 | 0.236 | 13 | 0.057 | 2 | 2 | 0 |
| 841 | 62 | 0.496 | 0.290 | 18 | 0.050 | 2 | 0 | 0 |
| 842 | 55 | 0.494 | 0.309 | 17 | 0.000 | 2 | 0 | 0 |

These supplemental diagnostics are not a validated Danish tokenizer or native-speaker assessment.

Section 5 manual checks:

1. Automatic Danish measurement remains unavailable as disclosed above; the proxy and Unicode diagnostic introduce no new measured failure.
2. The openings retain three different forms: a contracting-party question (840), one labelled hypothetical component defect (841), and the verified Danish visa-exemption duration (842).
3. Each article retains at least two very short sentences; the supplementary diagnostic found no paragraph with multiple 32-word sentences.
4. No paragraph-opening word occurs more than twice in the Danish Unicode check.
5. Citation placement varies, practical paragraphs without legal citations remain, and no three consecutive paragraphs repeat a claim/citation/caveat pattern.
6. The edits add no stock “not X but Y” formula or invented opposing claim. Existing legal scope distinctions remain necessary.
7. The final substantive paragraphs still concern the service contract, the identifiable component sample and the first authorized working day.
8. Danish explanatory register is retained. No bold, invented first-person experience or imperative checklist heading was added. Korean/Japanese ending checks do not apply.
9. Changed clauses were compared with their statutes; modalities, exceptions, time references and sources are preserved or explicitly corrected above. All other dates, amounts, deadlines, citations and the hypothetical label are unchanged.

The opening deletion check retains concrete contracting facts, the component/notice example and applicable-law threshold, and entry-versus-work conditions. The 841 addition supplies the omitted presumptions rather than a roadmap. The three unchanged same-locale comparison articles remain 008, 014 and 016; this bounded repair does not import their generic introductions, numbered checklist structures or standard closing footers.

An independent AI final reviewer, who did not author or modify these drafts, returned PASS on all seven bounded repairs at the three hashes below. The reviewer independently reran eight relevant statutory provisions and matched them against fresh official MOJ text, checked FAQ/summary consistency and source coverage, and found no further required repair. The log itself was not part of that independent review; its item coverage and exact old/new text were checked by the repairing agent.

### Saved versions

| Article | Original SHA-256 | Repaired SHA-256 | Main-text words |
|---|---|---|---:|
| 840 | f689e462ab14e718a61d41e5a65c3f53b4f40f3d14b1f5bdacdf34af20feb505 | 63e44f22808a60df145f2d3ebffa4219dda719faa6af85e47b9850e31bbb5a33 | 760 |
| 841 | b40aacc63783f6aee068535f3cc86658d2e0b380aa941f970c9dae4e32ced3df | 5f9acc0cf86338ad04a8c7bbf82b96b9995fd96f8dd5f6d2b2ad7971e81c91e9 | 778 |
| 842 | 090efa05e1396d26b50300ee454c015a005a40d22630b609af1205c5623a8a63 | 518f3b631256ca43e18527aa578bee7c416be54b069656e0c69538f6126fb4ad | 785 |

Main-text words are whitespace-separated after replacing Markdown links with their visible text; substantive heading text is included, frontmatter and the source section excluded. These remain local drafts; publication and human professional review are not claimed.

