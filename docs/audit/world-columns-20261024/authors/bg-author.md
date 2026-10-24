# Bulgarian author note — 885–887

Date: 2026-10-24. Scope: authoring three Bulgarian drafts, not publication. The only filesystem writes by this author are the three files in `drafts/bg/` and this note. No git, installation, repository modification or publication was performed.

## Instructions and reading

- Read `briefs/BRIEF.md` and `briefs/ASSIGNMENTS.md` in full. Assignment: 885 B-INV, 886 P-WORK, 887 L-MARRY; no topic substitution.
- Read `repo/docs/columns/EDITORIAL-VOICE.md`, `repo/docs/columns/FRONTMATTER.md`, `rules/SENTENCE-VARIETY-RULE.md`, `rules/LESSONS.md`, and `briefs/IMAGE-MENU.md`. The two rules files are byte-identical to `/Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md` and `LESSONS.md`, whose contents were also retrieved.
- Read `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`. Its referenced `/Users/son7/agent-library/knowledge/editorial-voice.md` is absent. Read the bundled `/Users/son7/tseng-lanes-shared/rules/EDITORIAL-VOICE.md` as the available fallback, alongside the repository voice file. Current batch requirements control contact details and internal author metadata; retired Fable gates were not applied.
- Read three complete existing Bulgarian comparators: `009-taiwan-voluntary-resignation-severance.md`, `012-taiwan-overtaking-accident-liability.md`, and `015-taiwan-company-setup-pitch-location.md`. All display 13 September 2025 and lastmod 2026-09-10. These are snapshot comparators, not a claim that they are the three latest articles on the live site. The brief's 008/014/016 numbers were examples, not mandatory selections.
- Read all assigned structural sources: English 354; French 674; Spanish 689; Hindi 669; Thai 663; English 705, 704, 706, 352 and 022. Their older narration, H1s, contact addresses, first-email requests and broader assumptions were not copied.
- Reviewed the country ledger's method/version warnings and all seven Bulgaria rows. Only verified positive facts or explicitly qualified list-membership inferences were eligible for use. No unverified driving-licence or land-reciprocity conclusion was used.
- Applied the tseng-law editorial skill's source, voice and independent-review guidance. Independent AI reviewers were assigned read-only Bulgarian editorial and final source review; no claim of human native-speaker or lawyer review is made.

## Verification method and law status

All 27 distinct statute citations actually used in the drafts were checked through the required `tools/law.py` before drafting. Existing cache files exceeded 5,000 bytes, so the helper read them without creating or replacing cache files outside the author's permitted paths. A subsequent parallel, read-only live fetch of all six LawAll pages compared every cited article against that cache: 27/27 normalized texts matched, with no missing or changed article. No live source response was written to disk.

Commands executed:

```text
python3 tools/law.py B0000007 20 36 46
python3 tools/law.py B0000001 127 128 129 130 132 982
python3 tools/law.py B0010001 508 509 511 515 516 519 521 522 523 526
python3 tools/law.py N0090001 43 48 53
python3 tools/law.py A0030295 4 5 9 15 16 35
python3 tools/law.py D0080132 22 23
```

The exploratory request for A0030295 article 35 returned `NOT FOUND`; it is not cited or used. Articles 132 and 515 were read for service/limitation context but not included in the final compact invoice article.

The Civil Code helper output carries `!!! 部分條文尚未生效`. Its status text identifies the uncommenced article 166-1 and the 2026-08-17 amendment to article 1223, effective six months after promulgation (2027-02-17). Neither is relied on. The articles used here are 127–130 and 982; the source sections in 885 and 887 explicitly qualify the account as current on 24 October 2026. The warning was not treated as rendering the entire Civil Code inoperative.

The current Foreign Professionals Act was promulgated on 2025-09-24. [NDC's official introduction](https://foreigntalentact.ndc.gov.tw/en/Content_List.aspx?n=6501F7D3D7CCA8A0) verifies commencement on 2026-01-01 except the latter portion of article 4(4)(4) and articles 28–29, commencing 2026-06-30. Both dates precede the batch date. The drafts use no future pension or national-health-insurance promise.

Official nonstatute pages were opened live: BOCA visa exemption, household-registration marriage guidance, BOCA foreign-spouse visa FAQ, the 2026-08-24 marriage-interview attachment, and the official Gold Card description. The English MOFA working-holiday table could not be opened with the web tool; its verified ledger row was not needed and no working-holiday assertion was added.

## 885 — unpaid invoice

File: `drafts/bg/885-bulgarian-exporter-taiwan-unpaid-invoice.md`.

Reader and trigger: the Bulgarian exporter or accounts manager has received an advance but the Taiwan buyer withholds the balance for an alleged shortage; a warehouse recipient differs from the contractual buyer. The opening explicitly labels this example hypothetical.

Country fit: the assignment identifies Bulgarian exporters as a likely audience. This is an editorial hypothesis, not measured demand or an assertion about a dominant Bulgarian industry, trade volume, or actual client. The cross-border file is assembled from Bulgaria, without assuming that buyer location alone selects Taiwanese law. No inference about Bulgarian limitation periods, EU enforcement instruments, Bulgarian judgment recognition or treaty rights is made.

Overlap and new angle: the existing Bulgarian 001–018 snapshot covers company formation, employment, family and accidents, with no dedicated B-INV article. The structure borrows the governing-law / limitation / payment-order / attachment distinctions from the assigned sources. Its actual document problem is the advance, shortage allegation and warehouse/buyer identity chain. It omits the French source's credit-note/returns case and the US source's promissory-note and enforcement-certificate discussion.

### Claim → source ledger

| Claim used | Exact source | Chinese text checked / scope |
| --- | --- | --- |
| Party choice matters; without a valid express choice use closest connection | [B0000007, art. 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20) | `依當事人意思定其應適用之法律`; `當事人無明示之意思或其明示之意思…無效時，依關係最切之法律`. The article's characteristic-performance presumption was checked but not overcompressed into an automatic Bulgarian-law conclusion. |
| Limitation follows the underlying legal relationship's applicable law | [B0000007, art. 36](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=36) | `請求權之消滅時效，依該請求權所由發生之法律關係所應適用之法律`. |
| Two years for the merchant/manufacturer goods-price category, only if Taiwan law applies | [B0000001, art. 127, item 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=127) | `因二年間不行使而消滅`; `商人、製造人、手工業人所供給之商品及產物之代價`. Not generalized to every invoice, service or damage claim. |
| Start when the claim can be exercised | [B0000001, art. 128](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=128) | `消滅時效，自請求權可行使時起算`. Each due date is kept separate. |
| Demand, acknowledgment and suit interrupt; payment-order application has suit-equivalent effect | [B0000001, art. 129](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=129) | `一、請求。二、承認。三、起訴`; `與起訴有同一效力：一、依督促程序，聲請發支付命令`. An ambiguous email is not automatically treated as acknowledgment. |
| Demand interruption lapses without timely suit/equivalent action | [B0000001, art. 130](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=130), read with art. 129 | `若於請求後六個月內不起訴，視為不中斷`. Six months runs from the demand. |
| Specified monetary claim; factual statement and preliminary showing | [B0010001, art. 508](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=508), [art. 511](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=511) | `給付金錢…之一定數量`; `請求之原因事實。其有對待給付者，已履行之情形`; `債權人之請求，應釋明之`. |
| No payment-order procedure if creditor's reciprocal performance is outstanding, foreign service, or public-notice service | [B0010001, art. 509](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=509) | `應為對待給付尚未履行，或…送達應於外國為之，或依公示送達為之者，不得行之`. Bulgarian creditor location is not itself one of these listed exclusions; no broader jurisdiction guarantee. |
| Debtor may object without reasons within twenty days after service | [B0010001, art. 516](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=516) | `於送達後二十日之不變期間內，不附理由…提出異議`. |
| Valid timely opposition defeats only contested part; application becomes suit/mediation | [B0010001, art. 519](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=519) | `於法定期間合法提出異議者`; `於異議範圍內失其效力`; `視為起訴或聲請調解`. |
| Without valid timely opposition order can be enforcement title; separate negative-declaration suit remains available | [B0010001, art. 521](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=521) | `支付命令得為執行名義`; `債務人主張…債權不存在而提起確認之訴者`. No final-judgment equivalence or successful recovery claimed. |
| Monetary preservation measure needs risk of impossible/very difficult future execution | [B0010001, art. 522](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=522), [art. 523](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=523) | `就金錢請求或得易為金錢請求之請求，欲保全強制執行者`; `非有日後不能強制執行或甚難執行之虞者，不得為之`. |
| Preliminary showing of debt and preservation reason; court may require security | [B0010001, art. 526](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=526) | `請求及假扣押之原因，應釋明之`; `法院亦得命債權人供擔保後為假扣押`. No fixed security percentage or guaranteed order. |

### First-two-paragraph deletion test

1. Keep `Български износител е получил аванса… — хипотетичен пример.` It establishes the advance/shortage trigger and protects against a fabricated client story.
2. Keep `В товарителницата фигурира склад…` It introduces the warehouse versus debtor discrepancy used below.
3. Keep `Преди да се претендира неплатената сума…` It identifies the three records needed to resolve that discrepancy, not a preview of article sections.
4. Keep `Досието може да се подготви от България…` It gives the remote exporter a document set and includes adverse correspondence.
5. Keep `Отделна справка показва…` It supplies currency, due-date and balance fields absent from the first paragraph.
6. Keep `Така авансът не се отчита два пъти.` It explains the reconciliation's concrete purpose in a short sentence.

No generic introduction survived to cut; the deletion test does not invent a revision history. Later, two adjacent governing-law sentences were joined with a semicolon to preserve their logical relationship and vary sentence length.

### Same-language comparison

- 009 begins with a reference to the writer's earlier explanation, uses no substantive H2 headings, and finishes with generic preparation advice and an author footer. 885 opens with an explicitly hypothetical payment discrepancy, uses transaction-specific headings, and ends on the oldest invoice's due date.
- 012 opens with general overtaking risk, has a rule/case/check structure, and ends in a long general disclaimer. 885 uses neither accident narrative nor a claim of firm case experience; the actual deadline remains the last substantive point.
- 015 opens with a territorial caveat, uses many isolated sentences and a question label, and ends with contact plus a generic change-in-rules caution. 885 uses connected paragraphs and one restrained contact paragraph; no table or checklist is forced into the article.

Dropped/unverified: no sector stereotype, trade statistics, measured Bulgarian search demand, Bulgarian-law conclusion, automatic recognition of Bulgarian judgments, fixed collection timing, universal two-year rule, fixed security percentage, or promise of a successful recovery. Court fees and service-lapse detail were omitted for scope, not asserted without verification.

## 886 — work and residence

File: `drafts/bg/886-bulgarian-professional-taiwan-work-permit-residence.md`.

Reader and trigger: a Bulgarian professional has an offer or is considering a visit to meet a prospective Taiwan employer and needs to identify the first lawful workday, an ARC route and accompanying-family status.

Country fit: BOCA expressly lists Bulgaria for up to 90 days of visa-exempt entry. This verified entry convenience creates the relevant distinction between visiting and starting work. Demand for a professional/family planning article is an editorial hypothesis, not measured recruitment volume. No automatic benefit from EU citizenship is asserted, and no working-holiday route is presumed.

Overlap and new angle: Bulgarian 008/009/014 already concern dismissal, voluntary resignation and minimum-service periods. The new article addresses pre-employment authorization, professional category, Gold Card, direct NIA residence and family work rights. It links to existing 009 only for a separate exit dispute, without importing that article's Korean comparisons or adopting its legal propositions as evidence.

### Claim → source ledger

| Claim used | Exact source | Checked text / scope |
| --- | --- | --- |
| Bulgarian ordinary-passport holders may qualify for up to 90 days; six-month passport validity, onward/return ticket, next-day count | [BOCA visa exemption](https://www.boca.gov.tw/fp-149-4486-7785a-1.html); corresponding [Chinese page](https://www.boca.gov.tw/fp-384-4485-149c7-1.html) in verified ledger | Chinese ledger excerpts: `90天免簽證適用國家` and `保加利亞(Bulgaria)`. Live English page explicitly supplies the six-month passport condition, confirmed departure booking, immigration-admissibility condition and next-day start. Other conditions are retained; no guaranteed entry. |
| Ordinary work needs employer-applied permission unless an exception applies | [N0090001, art. 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | `除本法另有規定外，外國人未經雇主申請許可，不得…工作`. |
| Professional work has defined scope; employer usually applies to MOL, specified teaching categories to MOE | [A0030295, art. 4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=4), [art. 5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=5) | `外國專業人才：指得在我國從事專業工作之外國人`; `應檢具相關文件，向勞動部申請許可`; named teaching exception `向教育部申請許可`. No universal salary or experience requirement invented. |
| Visa-free admission does not remove activity-specific permission | [BOCA visa exemption, remarks](https://www.boca.gov.tw/fp-149-4486-7785a-1.html) | English primary source: activities which require a permit `must still obtain such a permit`. The draft treats a job's actual duties as facts requiring classification, without declaring every meeting or interview to be work. |
| Ordinary employer-linked permission needs a new employer application when changing employers, subject to exceptions | [N0090001, art. 53](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=53) | `如需轉換雇主或受聘僱於二以上之雇主者，應由新雇主申請許可`; article's exemptions checked. Explicitly scoped away from open-work permission. |
| Gold Card for specialist professionals combines four permissions, one-to-three-year validity | [A0030295, art. 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=9) | `工作許可、居留簽證、外僑居留證及重入國許可四證合一`; `有效期間為一年至三年`. Eligibility and approval remain necessary. |
| Gold Card may be applied for individually without prior job/employer sponsorship; open work rights | [Official Gold Card description](https://goldcard.nat.gov.tw/en/about/) | English primary source, checked as English: `requires neither pre-confirmed hiring ... nor application through any employer`; supported by article 9's `得逕向內政部移民署申請`. No automatic qualification from Bulgarian nationality. |
| Qualifying professional/specialist with work permission/exemption may apply directly to NIA after visa-exempt/visitor entry | [A0030295, art. 16, para. 1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | `以免簽證或持停留簽證入國，經許可或免經許可…從事專業工作者，得逕…申請居留；經許可者，發給外僑居留證`. |
| Entering with residence permission starts first ARC thirty-day period next day; combined document exception | [D0080132, art. 22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) | `取得居留許可者…入國後之翌日起算三十日內`; `四證合一之有效證件，或其他已含有外僑居留證功能之證件者，得免申請`. Not applied to every visa-free visitor. |
| Family route: professional actually doing professional work, or specialist; approved residence/permanence; specified relatives and entry status | [A0030295, art. 16, para. 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | `外國專業人才在我國從事專業工作及外國特定專業人才…許可居留或永久居留者`; `配偶、未成年子女及因身心障礙無法自理生活之成年子女`; `以免簽證或持停留簽證入國`. Parents are not in this list. |
| Dependent spouse of specialist/senior professional may apply directly for work permission; duration capped by dependent residence | [A0030295, art. 15, para. 1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=15) | `外國特定專業人才及外國高級專業人才之配偶…許可…依親居留者，得逕向勞動部申請許可`; `不得逾其依親居留期間`. Not an exemption and not all foreign professionals' spouses. |

### First-two-paragraph deletion test

1. Keep the 90-day/Bulgaria sentence: it supplies the nationality-specific entry fact.
2. Keep passport validity, departure booking and other conditions: removal would overstate eligibility.
3. Keep next-day counting: it identifies the beginning of the stay period.
4. Cut `Работата има отделно основание.` following independent review: the immediately following statutory sentence already supplies the work-authorization distinction and its conditions.
5. Keep article 43 and its exception: it is the legal reason an offer alone cannot authorize work.
6. Keep the comparison of offer with actual permission before the first working day: it applies the rule to the reader's decision.

No generic preview or title-restatement was retained. The family paragraph was clarified during author self-check to preserve the actual-professional-work condition for an ordinary professional sponsor.

### Same-language comparison

- 009's backward reference and Korea comparison are replaced by a verified Bulgarian passport rule. The separate internal link provides a path to employment disputes without retelling that article.
- 012's legal-rule / past-case / general-check ending is not reused. 886 moves from an offer to optional Gold Card, then residence and family eligibility; there is no alleged real case.
- 015's list-like broken paragraphs and repeated general cautions are replaced by different-length connected paragraphs. The last substantive sentence asks for the actual permit's number, scope and validity before agreeing a start date.

Dropped/unverified: working holiday is not discussed; no salary threshold, regulated-profession eligibility, automatic job qualification, processing-time promise, blanket in-country conversion, automatic spouse work right, universal no-permit rule for permanent residents, Bulgarian taxation or tax-treaty statement. Scope is professional employment rather than every migrant-worker category.

## 887 — marriage and residence

File: `drafts/bg/887-bulgarian-taiwanese-marriage-registration-residence.md`.

Reader and trigger: a Bulgarian citizen and Taiwanese partner must decide whether to register a new marriage in Taiwan or submit a marriage already validly concluded in Bulgaria, then arrange the foreign spouse's residence.

Country fit: Bulgarian-origin documents and their names/translations are the actual administrative link. BOCA's current nationality-specific interview attachment does not list Bulgaria; this is a qualified list-membership inference, not a promise of no individual interview. The need for the article is an editorial hypothesis; no marriage-volume, client-experience or foreign-law fact is asserted.

Overlap and new angle: existing Bulgarian 007 concerns divorce and 016 inheritance/custody, not the first marriage-registration file. English 022 supplied the registration/document/residence distinction. The US affidavit/AIT discussion was removed entirely; no imaginary Bulgarian certificate, apostille shortcut or consular competence was substituted.

### Claim → source ledger

| Claim used | Exact source | Chinese text checked / scope |
| --- | --- | --- |
| Formation conditions follow each party's national law; form has alternative validation rules | [B0000007, art. 46](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=46) | `婚姻之成立，依各該當事人之本國法`; `結婚之方式依當事人一方之本國法或依舉行地法者，亦為有效`. Bulgarian substantive requirements referred to Bulgarian authority/counsel, not supplied here. |
| Taiwan marriage: writing, at least two witnesses' signatures, both parties' registration | [B0000001, art. 982](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=982) | `結婚應以書面為之，有二人以上證人之簽名，並應由雙方當事人向戶政機關為結婚之登記`. No universal remote-registration claim. |
| Foreign party: identity, Chinese-name declaration, authenticated marital-status evidence; six months from issuing authority | [Household-registration marriage guidance](https://www.ris.gov.tw/documents/html/2/3/1/383.html), documents 3–4 | `外籍配偶取用中文姓名聲明書`; `經駐外館處驗證之婚姻狀況證明文件`; `於原核發機關核發之日起6個月內有效`. Exact Bulgarian document to be confirmed. |
| Already-valid foreign marriage: authenticated marriage record; proper local-law endorsement may dispense with marital-status evidence | [Same guidance](https://www.ris.gov.tw/documents/html/2/3/1/383.html), documents 4 | `在國外結婚已生效者…經我駐外館處…驗證之結婚證明`; `加註「符合行為地法」字樣者，並得免附婚姻狀況證明文件`. May, conditional; not a blanket exemption for all Bulgarian certificates. |
| Foreign documents authenticated; foreign-language record needs Chinese translation verified by mission or notarized in Taiwan | [Same guidance](https://www.ris.gov.tw/documents/html/2/3/1/383.html), documents 5 | `在國外作成者，應經我駐外館處驗證`; `另檢附經駐外館處驗證或國內公證人認證之中文譯本`. Original and translation requirements kept separate. |
| Bulgaria absent from specific nationality list, not from all individual scrutiny | [BOCA current attachment](https://www.boca.gov.tw/dl-5210-6c88eaff0b5449078bfca7b720878eb0.html) | `修訂日期：115年8月24日`; complete table checked: Thailand, Indonesia, Vietnam, Philippines, Myanmar, Senegal, Nigeria/Cameroon/Ghana/Gambia, Pakistan, India/Nepal/Bhutan/Sri Lanka/Bangladesh. No `保加利亞` entry. Absence is explicitly an inference. |
| Visa evidence includes registered Taiwan household record, home-country marriage record, criminal record and health evidence; individual interviews possible | [BOCA foreign-spouse visa FAQ](https://www.boca.gov.tw/fp-398-696-550e9-1.html) | `已載有結婚登記…戶口名簿或全戶戶籍謄本`; `申請人本國政府所核發之結婚登記證明`; `無犯罪紀錄證明或良民證`; `健康檢查合格證明`; `特定國家人士或因個案需要者尚須…面談`. This is a selected core of the checklist, not a complete universal list. |
| Taiwan-national spouse route under article 23 requires qualifying visa, at least sixty days, no listed restrictions | [D0080132, art. 23, para. 1 and item 1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=23) | `持停留期限在六十日以上，且未經簽證核發機關加註限制不准延期或其他限制之有效簽證入國`; `配偶為現在在臺灣地區居住且設有戶籍…之我國國民`. Narrowed to resident household-registered Taiwan spouse; no general visa-exempt conversion. |
| Work-permit exemption requires marriage to household-registered Taiwan national AND granted residence | [N0090001, art. 48, para. 1 item 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=48) | `外國人與在中華民國境內設有戶籍之國民結婚，且獲准居留者`. Both elements preserved in body and FAQ. |

### First-two-paragraph deletion test

1. Keep the question about intended Taiwan marriage versus an existing Bulgarian marriage: the answer selects the document route.
2. Keep the official-document distinction: it explains what the answer changes.
3. Cut `Тайванското международно частно право също разграничава условията и формата.` following independent review: the two specific statutory sentences already explain that distinction.
4. Keep article 46's national-law condition: the text cannot imply that satisfying Taiwan paperwork resolves both parties' eligibility.
5. Keep the alternative form rule: it prevents implying that all Bulgarian-concluded marriages must satisfy only Taiwan's form.
6. Keep the Bulgaria-authority/counsel referral: it marks the foreign-law boundary.

No generic background or title echo was added. The introduction carries a real procedural question rather than another fictional scene or a second numerical opener.

### Same-language comparison

- 009's first-person explanation and final author footer are absent. 887 begins with the reader's procedural fork and retains no claimed personal legal experience.
- 012's statute/case/check outline is replaced by two marriage-document routes, the nationality-specific interview issue and the subsequent residence file. It makes no claim about a decided case or firm result.
- 015's repeated instructions and generic warning about changing rules are avoided. The ending asks which original goes to which receiving authority, a document-control issue specific to this article. The initial interview heading was corrected so it no longer suggests Bulgaria is included in the special list.

Dropped/unverified: no Bulgarian-law account of marriage capacity, certificate name or issuing office, apostille sufficiency, exact Taiwan mission handling Bulgarian documents, guaranteed recognition in Bulgaria, automatic ARC, immediate work right from the wedding, or categorical exemption from interviews. Same-sex/public-policy issues, prior-divorce recognition and ROC nationals without household registration require individual analysis and are not decided by this general document guide.

## Cross-batch shape, images and final checks

The three opening types differ: 885 a labelled hypothetical payment discrepancy; 886 a verified nationality-specific number; 887 a procedural question. Only one is a scene. Headings are unnumbered and topic-specific, with one question heading in 885, an option-based work/residence structure in 886, and document-route headings in 887. All have four substantive H2 headings plus `Източници`.

Images: I01 for 885, I04 for 886, I24 for 887. Paths copied exactly from IMAGE-MENU; descriptions translated without adding flags, people, logos or actual case claims. The same translated illustrative-image disclaimer is used as required, separate from author provenance.

Packaging checks: exact sixteen frontmatter fields and order; three FAQ entries each; dates and exact category `Правна информация за Тайван`; `read_time` style `5 мин`; country-cued ASCII slugs of 4–9 words; no slug collision with existing Bulgarian columns; title/SEO/summary lengths within requested ranges; no bold, H1, author footer or prohibited contact details. Ruby's YAML parser successfully parsed all three files. Every external source linked in the body appears in the final source list. Internal related-reading links are valid existing or assigned-new Bulgarian slugs, not legal sources; contact links are not counted as evidentiary sources.

### Required variety tool and section 5 self-check

Executed the prescribed command separately for each draft:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check drafts/bg/885-bulgarian-exporter-taiwan-unpaid-invoice.md
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check drafts/bg/886-bulgarian-professional-taiwan-work-permit-residence.md
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check drafts/bg/887-bulgarian-taiwanese-marriage-registration-residence.md
```

All returned exit 2, `ERROR measurement unavailable: cannot infer language ...; supply --lang`. Explicit retry with `--lang bg` returned exit 2: `invalid choice: 'bg'`. Supported languages end with `... ar, vi`; Bulgarian is unsupported. This is NOT an official PASS or a verified zero-FAIL measurement. No tool or shared rule was modified and no English-language mode was misrepresented as Bulgarian support.

Supplementary author diagnostics use whitespace word lengths after converting Markdown links to visible labels, stripping metadata/sources/headings for sentence analysis, and splitting at sentence-ending punctuation. Bulgarian prose uses full `член` rather than an abbreviation that would corrupt segmentation. These are transparent approximate checks, not a substitute implementation of the official checker.

Manual section 5 checks completed: distinct openers; at least two very short sentences per article; no repeated paragraph opener more than twice after bounded repairs; no paragraph containing multiple sentences above 32 words; no run of three claim/citation/caveat paragraphs; nonlegal preparation paragraphs without citations; no repeated contrast template; topic-specific last substantive sentences; no invented first-person/client scene, bold or imperative checklist headings. Bulgarian professional explanatory register used; ko/ja register rules are inapplicable. Legal links, numeric conditions, hypothetical label and Taiwan jurisdiction were retained through repairs.

## Final counts and review state

Main-text counting includes visible subsection headings and contact/general-information paragraphs, but excludes YAML and the source section. Markdown URLs are replaced by their labels, and whitespace is collapsed to single spaces; characters include spaces. Full-file characters include all Markdown, YAML and line breaks.

| File | Main-text words | Main-text characters with spaces | Full-file characters |
| --- | ---: | ---: | ---: |
| `drafts/bg/885-bulgarian-exporter-taiwan-unpaid-invoice.md` | 700 | 4,855 | 9,528 |
| `drafts/bg/886-bulgarian-professional-taiwan-work-permit-residence.md` | 795 | 5,738 | 9,681 |
| `drafts/bg/887-bulgarian-taiwanese-marriage-registration-residence.md` | 780 | 5,518 | 9,403 |

Supplementary measurements on the final versions (not an official Bulgarian-checker PASS):

| Article | Sentences | Length CV | Short sentences, at most 8 whitespace words | Similar-length triples | Maximum repeated paragraph opener |
| --- | ---: | ---: | ---: | ---: | ---: |
| 885 | 48 | 0.455 | 10 / 48 (20.8%) | 0.0% | 2 |
| 886 | 53 | 0.544 | 15 / 53 (28.3%) | 3.9% | 2 |
| 887 | 47 | 0.474 | 7 / 47 (14.9%) | 2.2% | 2 |

For this supplementary measure a similar-length triple means its maximum word count is no more than 1.25 times its minimum, divided by all available triples. None of the final articles has adjacent sentences with the same first word within a paragraph, multiple sentences over 32 words in one paragraph, or more than three digit groups in a sentence. These diagnostics support, but do not replace, the manual reading or the unsupported prescribed measurement.

### Independent reviews and repair record

Independent Bulgarian AI editorial reviewer `/root/bg_locale_review` initially requested bounded changes and then returned PASS for all three final versions. Independent source/legal reviewer `/root/bg_legal_review` also returned PASS for all three final versions, after live source checks and the repair recheck. Neither reviewer authored or wrote the files. Their reports were delivered through collaboration messages; no extra report files were created outside the permitted deliverables.

Material source clarification: 886's ambiguous `при предвидените изключения` was replaced by `освен ако е приложимо законово изключение`. This restores the general new-employer application rule with statutory exceptions under Employment Service Act article 53; it is recorded as a substantive clarification, not a purely cosmetic edit. Both reviewers checked the corrected sentence.

Other bounded repairs: natural Bulgarian instructions for a first inquiry (`кратко описание без чувствителни данни` and explicitly agreeing the consultation language), complete identity-document terminology and conflict-of-interest wording, an enforcement-risk heading and ordinary Bulgarian term for the preservation ground, a clear household-register document description, visa-entry conditions instead of an English calque, explicit BOCA/ARC/NIA expansions, and an interview heading that does not imply Bulgaria is listed. Two redundant opening sentences were deleted as recorded above. The first ARC sentence in 887 now expressly links separate approval to Immigration Act article 23; the legal reviewer rechecked it.

| Article | Independent locale | Independent legal/source | Final SHA-256 |
| --- | --- | --- | --- |
| 885 | PASS | PASS | `66c1ad99f8246021ea22d3aa994dc76e1b220126440938c49db7a62c5e343641` |
| 886 | PASS | PASS | `abcb4287845c7d67b643a24a084aeaf38d4316c927db57a85bd9d179fc91b310` |
| 887 | PASS | PASS | `cabbbb831fec95b6d0b3658068ee76402ba9c0669cc9cdaf6fef50905c1e1774` |

Final status: author assignment complete; three draft manuscripts and this evidence note saved. No unresolved material finding in the independent AI reviews. The required variety tool remains unavailable for Bulgarian (exit 2); an official zero-FAIL result is not claimed. These are drafts, not published articles, and the AI reviews are not human native-speaker or lawyer certification.
