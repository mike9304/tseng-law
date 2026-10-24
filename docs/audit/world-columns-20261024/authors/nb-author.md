# nb author note — 24 October 2026

Assignment: 843 B-INV, 844 P-WORK, 845 L-TRAFFIC. All three recommended topics retained. Public copy is Norwegian Bokmål. This is an author self-check and source-verification record, not a claim of lawyer or native-speaker review.

## Deliverables and counting method

| Article | File | Main text words | Main text characters | Body including sources: words / characters | Raw complete Markdown: words / characters |
| --- | --- | ---: | ---: | ---: | ---: |
| 843 | `drafts/nb/843-norwegian-seafood-exporter-taiwan-unpaid-invoices.md` | 686 | 5,069 | 737 / 5,412 | 1,000 / 9,754 |
| 844 | `drafts/nb/844-norwegian-professional-taiwan-work-permit-residence.md` | 731 | 5,546 | 784 / 5,980 | 1,038 / 9,528 |
| 845 | `drafts/nb/845-norwegian-traveller-taiwan-traffic-accident-return-home.md` | 699 | 5,332 | 762 / 5,825 | 1,019 / 10,569 |

The main-text count includes the four substantive subheadings and contact paragraph, excludes YAML and the `## Kilder` section, replaces Markdown links with their visible labels, and removes heading markers. Words are whitespace-separated tokens. Characters are Unicode code points, including spaces and retained line breaks, after trimming outer whitespace. The raw count is included so a reviewer can reconcile a different file-counting convention. All main texts meet the brief's 650–950-word range.

## Reading and verification basis

- Read `briefs/BRIEF.md`, `briefs/ASSIGNMENTS.md`, `briefs/IMAGE-MENU.md`, `repo/docs/columns/EDITORIAL-VOICE.md`, `repo/docs/columns/FRONTMATTER.md`, `rules/SENTENCE-VARIETY-RULE.md`, and `rules/LESSONS.md`.
- Also checked `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md` and the shared `SENTENCE-VARIETY-RULE.md` and `LESSONS.md`. The shared variety text matches the repository copy except for its older tool-support description. The shared lessons file is dated 24 October and was read alongside the supplied 22 October copy.
- The requested home canonical path `/Users/son7/agent-library/knowledge/editorial-voice.md` was absent. The full house-style text supplied in `repo/docs/columns/EDITORIAL-VOICE.md` was used, including the later ban on bold and public bylines. The older COLUMN-VOICE pointer did not reinstate the abolished Fable workflow.
- The three complete Bokmål comparison columns were 008, 009 and 012. Their exact category is `Juridisk informasjon om Taiwan`; their date format is `13. september 2025`, and reading time uses `N minutter lesetid`. The new files use that register convention with the batch date. Old bylines, H1s, promotional endings and Korean-reader comparisons were not carried into the new copy.
- Structural references consulted: B-INV — EN354, FR674, ES689, HI669, TH663; P-WORK — EN705, EN704, EN706, EN352; L-TRAFFIC — EN003, EN611, TH662. Relevant internal-link material in NB002 and NB014 was also inspected. Structural references were not treated as a substitute for checking current statutes.
- Checked the Norway rows and verification conventions in `research/country-facts.md`. Only the verified Norwegian visa-exemption fact is used in public copy, with a fresh BOCA check. The driving-licence row remains explicitly UNVERIFIED and is not used as evidence of a driving entitlement.

Every statutory article actually linked in the three drafts was fetched with the supplied `tools/law.py`, with the printed law title and Chinese article text compared against the claim tables below. To honor the write boundary, the unchanged script was executed through `runpy.run_path`; only `os.path.expanduser` for its hard-coded cache directory was redirected to `drafts/nb/.law-cache`. No script or shared cache was edited. Temporary verification cache files are removed after checking.

The title check caught an initial lookup of `G0390067`: that code is the benefit standards, not the Compulsory Automobile Liability Insurance Act. The correct Act is `G0390060`; its articles 7, 13, 27, 28 and 32 were fetched and used. The mistaken code is absent from the drafts.

Version checks:

- The Civil Code tool output warned of provisions not yet effective. Its banner identifies the long-pending article 166-1 and the August 2026 amendment to article 1223, effective six months after promulgation. None is used here. The cited obligation and tort provisions are unaffected. Articles 843 and 845 state that their legal discussion concerns provisions in force on 24 October 2026.
- The Road Traffic Management and Penalty Act also carries a pending-effect banner. Article 62 is outside the pending provisions identified there; the checked third paragraph supplies the accident-scene duties used in 845. No pending driving-licence amendment is relied upon.
- The [Foreign Professionals Act history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295) records the relevant 2025 revision taking effect on 1 January 2026, except specified provisions effective 30 June 2026. Both dates precede this batch. In particular, current articles 9, 15 and 16 were used; an older article number in an administrative guide was not substituted for the current statute.
- NPA's official CDN FAQ could be fetched as actual readable HTML with `curl`, despite one browser fetch returning a 502. The retrieved text contained the seven-day and thirty-day application rules. A successful status code alone was not treated as verification.

## 843 — Norwegian seafood seller and a disputed invoice

### Reader, trigger and Norwegian fit

Reader: the export or finance person at a Norwegian seafood seller, with an unpaid Taiwanese buyer and a quality-related deduction that refers to a different shipment. The opening is explicitly marked `tenkt eksempel`; it is not a client story or a claim about the frequency of these disputes.

Evidence for the reader choice: Taiwan's [MOFA Norway country profile](https://www.mofa.gov.tw/CountryInfo.aspx?CASN=1&n=164&s=194&sms=33) lists fresh/chilled fish among Norway's 2024 exports and documents Taiwan's imports from Norway. Checked excerpts: `主要輸出項目：天然氣、原油、生鮮或冷藏魚` and `2024年我自挪威進口3億6,115萬美元`. This supports the trade setting, not a claimed seafood share of those bilateral imports. Selecting cold-chain documentation as the practical focus is an editorial hypothesis. The article makes no market-size, demand or client-experience assertion.

Existing Bokmål content has company-formation material but no targeted Norwegian trade-debt article. NB002 overlaps only on the distinction between contributed capital and current assets; it supplies the internal navigation link. The new angle is shipment-level reconciliation of a perishable-goods complaint, followed by law selection, limitation and the Taiwanese procedure. It does not transplant the Oregon supplier, amount, deadline or promissory-note advice from EN354.

### Claim → source record

| Claim used | Official source checked | Chinese excerpt checked and retained condition |
| --- | --- | --- |
| Party choice of law; otherwise closest connection, including characteristic-performance presumption and domicile at transaction time | [Choice of Law Act art. 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20) | `依當事人意思定其應適用之法律`; `依關係最切之法律`; `負擔該債務之當事人行為時之住所地法，推定為關係最切之法律`. Taiwan buyer location is not presented as conclusive. |
| Limitation follows the law governing the underlying relationship | [Choice of Law Act art. 36](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=36) | `請求權之消滅時效，依該請求權所由發生之法律關係所應適用之法律`. Norwegian limitation law is left to Norwegian advice. |
| Two years for the specified goods-price claims, if Taiwan law applies | [Civil Code art. 127(8)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=127) | `因二年間不行使而消滅`; `商人、製造人、手工業人所供給之商品及產物之代價`. Not generalized to all invoices or business claims. |
| Starting point is when the claim can be exercised | [Civil Code art. 128](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=128) | `消滅時效，自請求權可行使時起算`. Individual maturity and contractual conditions remain relevant. |
| Demand, acknowledgment and suit; specified steps have the effect of suit | [Civil Code art. 129](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=129) | `一、請求。二、承認。三、起訴`; `聲請發支付命令`; `聲請調解或提付仲裁`. A buyer email is not automatically labeled an acknowledgment. |
| A demand alone loses its interruption effect without timely follow-up | [Civil Code art. 130](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=130) | `若於請求後六個月內不起訴，視為不中斷`. The six months start after the demand. |
| A fixed monetary claim may support a payment-order application | [Code of Civil Procedure art. 508](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=508) | `以給付金錢或其他代替物或有價證券之一定數量為標的者，得聲請`. The article discusses money without claiming this is the statute's exhaustive scope. |
| Application identifies the claim and its facts and makes a preliminary showing | [Code of Civil Procedure art. 511](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=511) | `其有對待給付者，已履行之情形`; `債權人之請求，應釋明之`. Shipment proof is practical preparation for these requirements. |
| Unperformed counter-performance, overseas service or public-notice service exclude this procedure | [Code of Civil Procedure art. 509](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=509) | `應為對待給付尚未履行，或支付命令之送達應於外國為之，或依公示送達為之者，不得行之`. Foreign creditor location is not confused with service abroad on the debtor. |
| Debtor may object without reasons within twenty days after service | [Code of Civil Procedure art. 516(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=516) | `於送達後二十日之不變期間內，不附理由`. Service, not issuance or receipt of an invoice, starts this period. |
| Valid timely objection removes the order's effect to the contested extent and carries the application into suit or mediation | [Code of Civil Procedure art. 519(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=519) | `於異議範圍內失其效力`; `視為起訴或聲請調解`. Partial objection is not described as destroying every part. |
| Unopposed order is enforceable; debtor may still sue over existence of the debt | [Code of Civil Procedure art. 521](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=521) | `未於法定期間合法提出異議者，支付命令得為執行名義`; `主張支付命令上所載債權不存在而提起確認之訴`. No claim of final adjudication of the merits. |
| Monetary claims may be secured by provisional attachment | [Code of Civil Procedure art. 522](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=522) | `欲保全強制執行者，得聲請假扣押`. Filing is possible, approval is not promised. |
| Attachment requires risk of impossible or very difficult future enforcement | [Code of Civil Procedure art. 523](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=523) | `非有日後不能強制執行或甚難執行之虞者，不得為之`. An unpaid invoice alone is not asserted to satisfy the test. |
| Preliminary showing of claim and attachment grounds; security may be required | [Code of Civil Procedure art. 526](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=526) | `請求及假扣押之原因，應釋明之`; `法院亦得命債權人供擔保後為假扣押`. Security is discretionary, not a guaranteed purchase of an order. |

### First-two-paragraph deletion test

| Sentence tested | Decision and information that would be lost |
| --- | --- |
| `En norsk sjømateksportør har fått betalt ... kjølelageret (tenkt eksempel).` | Kept: identifies the Norwegian seller, different payments and cold-chain objection; keeps the hypothetical label in the same sentence. |
| `Partinummeret i klagen gjelder den første leveransen.` | Kept: establishes why two invoices cannot be treated as one disputed balance. |
| `Hvilket beløp bestrider kjøperen egentlig?` | Kept: the operational question is the scope of the disputed amount, not merely whether payment is late. |
| `Samlet saldo skjuler dette skillet.` | Kept as a short link from the example to reconciliation. Initial `En samlet saldo` was revised because `En` was an overused paragraph opening. |
| `Faktura, transportdokument, mottakskvittering og klage bør kunne følges gjennom samme vareparti.` | Kept: names the actual evidence chain. |
| `For kjølevarer er også temperaturregistreringer ... klagen er grunnløs.` | Kept: adds the sector-specific evidence and preserves unfavorable material. |

No entire introductory sentence was deleted; none merely announced the article. The initial phrase `ved mottak` was made more concrete as arrival at the cold store within the same fictional example.

### Comparison and editorial changes

- NB008 opens with the lawyer and a preview, uses fragmented warning paragraphs and ends with exhortation. Article 843 starts with a marked, shipment-specific hypothetical and ends with the oldest invoice's own due date.
- NB009 starts with a backward reference and a Korean comparison, then moves through an enumerated exception list. Article 843 has a self-contained opening and four issue headings, with a single question heading rather than a six-item checklist.
- NB012 opens with a general road-risk statement and later recounts a firm case. Article 843 does not borrow the firm's experience and does not close with a copied general disclaimer.

| Original / issue | Reason | Revision | Meaning preserved? |
| --- | --- | --- | --- |
| `En samlet saldo skjuler dette skillet.` | MONOTONY: paragraph starts — `En` occurred three times — vary the natural subject opening. | `Samlet saldo skjuler dette skillet.` | Yes; no legal condition or example fact changed. |
| `Loven presumerer blant annet tilknytning til parten ...` | Too imprecise about which law and relevant time. | Expressly connects the characteristic performer to domicile law at contract formation. | Legal meaning clarified against art. 20; no Norwegian-law conclusion added. |
| `ved mottak` in the hypothetical | Less specific about the cold-chain handover being disputed. | `da varene kom fram til kjølelageret` | Yes; still a marked fictional example, not an invented actual case. |

Dropped or not asserted: a Norwegian limitation period; automatic recognition of a Norwegian judgment; the assumption that every commercial invoice has a two-year period; fees, interest calculations and promissory-note rules not needed for this focused piece; a claimed Norwegian seafood share of Taiwan imports; and automatic attachment based on nonpayment alone.

## 844 — Norwegian professional arranging work and residence

### Reader, trigger and Norwegian fit

Reader: a Norwegian professional offered work in Taiwan, possibly accompanying a Norwegian project or moving with family. Trigger: proposed work starts while employer paperwork is still being discussed. The article separates activity, authorization, entry and residence without assuming every expatriate is in the same professional category.

The Norway `visa_free` ledger row is verified as up to 90 days; this was checked again against [BOCA's current visa-exemption page](https://www.boca.gov.tw/fp-149-4486-7785a-1.html). The country row does not establish working rights. The choice to cover family planning is an editorial hypothesis about practical reader needs, not a population statistic. Norway's absence from the working-holiday partner table was not converted into an unsupported blanket prohibition on work, and no working-holiday entitlement was claimed.

NB008, NB009 and NB014 cover employment rights or contract conditions, not this Norwegian entry-to-work decision. NB014 is linked for binding-time provisions; no part of its legal analysis is restated as an unverified claim. The new article adds Norwegian passport conditions, the distinction between employer and individual applications, and the narrower scope of dependent-spouse work rights.

### Claim → source record

| Claim used | Official source checked | Chinese excerpt or official page evidence checked |
| --- | --- | --- |
| General employer permit requirement before work, subject to exceptions | [Employment Service Act art. 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | `除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作`. Entry permission is not substituted for work authorization. |
| Professional and specialist categories depend on statutory definitions and work | [Foreign Professionals Act art. 4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=4) | `外國專業人才：指得在我國從事專業工作之外國人`; specialist definition requires the announced/recognized `特殊專長`. No nationality-based automatic classification. |
| Employer applications ordinarily go to Labor; listed teaching categories to Education | [Foreign Professionals Act art. 5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=5) | `除本法另有規定外 ... 向勞動部申請許可`; `但聘僱從事 ... 之專業工作者 ... 向教育部申請許可`. The exception is retained. |
| Individual Gold Card application; four functions; one to three years | [Foreign Professionals Act art. 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=9) | `得逕向內政部移民署申請核發具工作許可、居留簽證、外僑居留證及重入國許可四證合一之就業金卡`; `有效期間為一年至三年`. Approval and qualifying specialist status remain necessary. |
| Eligible specialists' or senior professionals' resident dependent spouses may apply directly for a work permit | [Foreign Professionals Act art. 15(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=15) | `外國特定專業人才及外國高級專業人才之配偶 ... 許可在我國依親居留者，得逕向勞動部申請許可`; `不得逾其依親居留期間`. Not generalized to all professional spouses; not automatic work permission. |
| Eligible professionals may seek residence after visa-free or visitor entry; qualifying family categories | [Foreign Professionals Act art. 16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | `以免簽證或持停留簽證入國，經許可或免經許可 ... 從事專業工作者`; `經許可者，發給外僑居留證`; family text: `外國專業人才在我國從事專業工作及外國特定專業人才 ... 其配偶、未成年子女及因身心障礙無法自理生活之成年子女`. Professional work and approved sponsor residence are retained. |
| Thirty-day first-card rule for entry with residence permission; combined-document exception | [Immigration Act art. 22(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) | `取得居留許可者，應於入國後之翌日起算三十日內`; `其他已含有外僑居留證功能之證件者，得免申請`. Not a universal conversion deadline for visitors. |
| Norwegian ordinary-passport entry for up to 90 days and stated conditions | [BOCA visa-exemption guidance](https://www.boca.gov.tw/fp-149-4486-7785a-1.html) | English official list includes Norway; passport validity at least six months; confirmed departure arrangements and eligibility at inspection; stay counted from the day after arrival. Page also retains permits for activities requiring them and separate contract-performance rules. |
| Gold Card is an open work route without employer sponsorship | [NDC Gold Card overview](https://goldcard.nat.gov.tw/en/about/) | Official overview states open-work rights and individual application without sponsorship; statutory category qualification is retained alongside this description. |
| Particular entry arrangements do not support the ordinary direct residence procedure | [NIA guide, note 7(1)](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) | Guide expressly lists ABTC and specified restricted arrangements and retains `unless otherwise provided by relevant regulations`. Draft avoids treating the Norwegian ordinary exemption as a trial scheme. |

### First-two-paragraph deletion test

| Sentence tested | Decision and information that would be lost |
| --- | --- |
| `Kan du reise inn med norsk pass ... ordner papirene?` | Kept: the concrete timing problem is commencing actual work before authorization, not simply visiting Taiwan. |
| `Hovedregelen i sysselsettingsloven artikkel 43 ... lovbestemte unntak.` | Kept: answers the opening question immediately, with the exception preserved. |
| `Norske statsborgere med ordinært pass ... BOCA.` | Kept: supplies the nationality-specific entry route and maximum stay. |
| `Blant vilkårene er minst seks måneders passgyldighet ... reisedokumenter.` | Kept: avoids presenting nationality alone as sufficient admission. |
| `Innreise avgjøres ved grensekontrollen.` | Kept: short qualification against a promise of admission; replaces the awkward `Innreisekontrollen avgjør opptaket.` |
| `Oppholdstiden regnes fra dagen etter ankomst ... fortsatt denne.` | Kept: preserves both the counting start and the separate activity-permit condition. |

No entire introductory sentence was cut. The title's initial `Norsk jobbtilbud` could mean an offer originating in Norway; it became `Jobb i Taiwan med norsk pass`.

### Comparison and editorial changes

- Against NB008: no lawyer introduction, invented professional experience or warning-based employment story. Opening is the worker's own timing question; the ending is a family document-and-travel plan.
- Against NB009: no backward reference, Korean comparison or numbered statutory exception list. A single genuine question heading is mixed with three descriptive issue headings.
- Against NB012: no generalized risk introduction or case narrative. The article compares two work-authorization routes and then addresses the family's distinct status.

| Original / issue | Reason | Revision | Meaning preserved? |
| --- | --- | --- | --- |
| `For ...` opened five paragraphs | MONOTONY: paragraph starts — `For familien ...` / `For en første avklaring ...` — use the actual subject or actor. | Openings now include `Familieordningen`, `Du` and `En felles familieoversikt`. | Yes; country, consultation rules and family conditions preserved. |
| `Søknaden fremmes av personen selv.` | Unnecessary passive construction. | `Du søker selv.` | Yes; individual Gold Card application under art. 9. |
| `kvalifiserende fagfolk med godkjent opphold` | Did not expose the sponsor's professional-work condition clearly enough. | Art. 16 paragraph expressly states professional work in Taiwan for the ordinary professional category and approved residence for the sponsor. | Legal precision improved; no broader dependent eligibility. |
| `Innreisekontrollen avgjør opptaket.` | Awkward Norwegian word choice. | `Innreise avgjøres ved grensekontrollen.` | Yes; admission is not guaranteed. |

Dropped or not asserted: automatic Norwegian working-holiday eligibility; a universal salary threshold imported from EN352; Norwegian tax or social-insurance treatment; unrestricted remote-work permission from visa-free entry; automatic work rights for every dependent spouse; and a single thirty-day residence rule for all arrival categories. The first-card rule is scoped to residence permission already obtained at entry.

## 845 — Injured Norwegian traveler following the case from home

### Reader, trigger and Norwegian fit

Reader: a Norwegian visitor or resident injured in a Taiwanese scooter/car collision, with a return trip before all police material can be requested. Trigger: continuing medical treatment in Norway while Taiwanese evidence and deadlines remain relevant.

Country fit is an editorial hypothesis based on the assignment's resident/traveler readership and Norway's verified short-visit route, not a claim about accident frequency or scooter habits. Norway-specific preparation includes continuity between Taiwanese and Norwegian treatment, amounts in the original currency, and actual income-loss evidence. No Norwegian substantive insurance rule is asserted. The ledger's unverified driving-licence recognition entry is deliberately not turned into permission to rent or drive.

NB003 already covers the broad accident procedure, and NB012 covers overtaking liability. The new angle is evidence arriving after the homeward flight and treatment continuing in Norway. It links to NB003 instead of reproducing its fifteen-question structure or its specific court cases. TH662 supplied the distinction between document-application dates and claim deadlines; Thai calendar details and migration assumptions were not translated into Norwegian copy.

### Claim → source record

| Claim used | Official source checked | Chinese excerpt checked and retained condition |
| --- | --- | --- |
| Driver's immediate aid, police notification and preservation duties; agreed movement after marking in injury cases | [Road Traffic Management and Penalty Act art. 62(3)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=62) | `應即採取救護措施及依規定處置，並通知警察機關處理，不得任意移動`; `肇事致人受傷案件當事人均同意時 ... 標繪後，移置不妨礙交通之處所`. Injury/death duty and the injury-only consent exception are not merged. |
| Tort liability for intentional/negligent unlawful infringement | [Civil Code art. 184(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=184) | `因故意或過失，不法侵害他人之權利者，負損害賠償責任`. The Norwegian sentence names intent/negligence rather than hiding them in an abstract reference to an unspecified liability basis. |
| Loss/reduction of earning capacity and increased needs from injury | [Civil Code art. 193(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=193) | `因此喪失或減少勞動能力或增加生活上之需要時，應負損害賠償責任`. Receipts are not described as automatic proof of recoverability. |
| Non-pecuniary damages for the relevant infringement | [Civil Code art. 195(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=195) | `不法侵害他人之身體、健康 ... 雖非財產上之損害，亦得請求賠償相當之金額`. No fixed compensation range. |
| Two-year knowledge-based tort limit and ten-year outer limit | [Civil Code art. 197(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=197) | `知有損害及賠償義務人時起，二年間`; `自有侵權行為時起，逾十年者亦同`. Both knowledge elements and the different outer-limit trigger are retained. |
| Victim's contributing fault allows reduction or exemption | [Civil Code art. 217(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=217) | `損害之發生或擴大，被害人與有過失者，法院得減輕賠償金額，或免除之`. Judicial discretion and possible full exemption both retained. |
| Settlement extinguishes waived rights | [Civil Code art. 737](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=737) | `使當事人所拋棄之權利消滅` and the rights stated in the agreement. Not described as automatically waiving every conceivable claim. |
| Compulsory insurance benefits do not require tortfeasor fault | [Compulsory Automobile Liability Insurance Act art. 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0390060&flno=7) | `不論加害人有無過失 ... 得依本法規定 ... 請求保險給付`. Statutory conditions retained. |
| Covered accident concerns passengers and third parties outside the vehicle | [Compulsory Automobile Liability Insurance Act art. 13](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0390060&flno=13) | `使用或管理汽車致乘客或車外第三人傷害或死亡之事故`. Single-vehicle driver exclusion is explicitly limited to that vehicle's compulsory cover. |
| Benefits concern injury medical costs, disability and death, not vehicle repair | [Compulsory Automobile Liability Insurance Act art. 27](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0390060&flno=27) | `一、傷害醫療費用給付。二、失能給付。三、死亡給付`. Optional property/driver coverage remains a policy-specific matter. |
| Intent/criminal-act exclusion linked to the victim or claimant causing the accident | [Compulsory Automobile Liability Insurance Act art. 28](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0390060&flno=28) | `受害人或其他請求權人 ... 致 ... 發生汽車交通事故`; `故意行為所致`; `從事犯罪行為所致`. The draft describes exceptions without claiming that one claimant's act necessarily defeats every other claimant's entitlement. |
| Compulsory insurance payment counts toward the insured's damages | [Compulsory Automobile Liability Insurance Act art. 32](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0390060&flno=32) | `視為被保險人損害賠償金額之一部分`; `得扣除之`. Deduction is not extended to every Norwegian insurance product. |
| Negligent bodily injury is a criminal offense | [Criminal Code art. 284](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=284) | `因過失傷害人者`; separate aggravated result for serious injury. No sentencing prediction or penalty amount is used. |
| Article 284 offenses require a complaint | [Criminal Code art. 287](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=287) | `第二百八十四條之罪，須告訴乃論`. The article does not generalize this to negligent homicide or all traffic offenses. |
| Six months from the complainant knowing the offender | [Code of Criminal Procedure art. 237(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=237) | `自得為告訴之人知悉犯人之時起，於六個月內為之`. Not measured from departure or the later police analysis. |
| A complaint may be filed through an agent; personal appearance can still be ordered | [Code of Criminal Procedure art. 236-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=236-1) | `得委任代理人行之`; `檢察官或司法警察官認為必要時，得命本人到場`. No guarantee that remote representation avoids a return trip. |
| Registration form at scene; diagram/photos after seven days; preliminary analysis after thirty days | [NPA official FAQ](https://wwwcdn.npa.gov.tw/ch/app/faq/view?id=2144&module=faq&serno=A1084129) | `於事故現場得申請提供`; `於事故7日後得申請閱覽或提供「現場圖」、「現場照片」`; `於事故30日後得申請提供「道路交通事故初步分析研判表」`. These are request dates, not guaranteed delivery dates. |

### First-two-paragraph deletion test

| Sentence tested | Decision and information that would be lost |
| --- | --- |
| `Tretti dager etter ulykken ... ulykkesanalyse i Taiwan.` | Kept: opens with the actual document timing that conflicts with a short visit. |
| `Politiets dokumentveiledning angir ... ikke en garantert utleveringsdato.` | Kept: prevents confusion between eligibility to request and guaranteed issuance. |
| `Hjemreisen til Norge kan ligge før dette tidspunktet.` | Kept: connects the administrative timing to this reader's travel decision, without inventing an actual travel booking. |
| `Da trenger du en plan ... etter avreise.` | Kept: identifies the unresolved task rather than promising automatic online access. |
| `Behandlingen kan også fortsette hos lege i Norge.` | Kept: introduces the second cross-border evidence chain. |
| `Bevar forbindelsen mellom ... utgiftene du vil kreve dekket.` | Kept: states what the later records must explain. |

No entire opening sentence was cut; none is a title restatement or a preview of the article.

### Comparison and editorial changes

- NB008's lawyer-led opening and admonitory ending were replaced with a number-led documentary issue and a concrete handoff before departure.
- NB009's backward-looking introduction and six numbered conditions were not reused. Article 845 has four descriptive headings, one actual question in prose, and no repeated question-and-answer headings.
- NB012's overtaking narrative and firm-experience framing were not reused. The overlap is limited to preserving motion evidence; article 845 concentrates on later documents, medical continuity, insurance and deadlines.

| Original / issue | Reason | Revision | Meaning preserved? |
| --- | --- | --- | --- |
| `Retten kan redusere eller bortfalle erstatningsansvaret ...` | Incorrect Norwegian verb construction. | `Retten kan sette ned erstatningen eller frita den ansvarlige ...` | Yes; art. 217 discretion, reduction and exemption preserved. |
| `det nødvendige ansvarsgrunnlaget` | Abstract legal shorthand did not tell the reader what liability basis is being discussed. | Names intentional or negligent unlawful infringement under art. 184. | Meaning clarified against the checked statute. |
| Short photo sentence listing only intersection, lanes, signs and damage | MONOTONY: sentence-length variation — the evidence instruction could carry its factual purpose more clearly. | Includes vehicle positions, the regulating signs and the purpose of later reconstructing movement, followed by `Sikre den uredigerte kamerafilen.` | Practical detail added; no new scene, fault allocation or legal rule invented. |

Dropped or not asserted: recognition of Norwegian licences or international permits; a guaranteed right to depart despite proceedings; automatic acceptance of Norwegian medical expenses; automatic inability to proceed after departure; percentages of fault; current statutory benefit amounts unnecessary to the question; any named court case; and guaranteed Norwegian travel-insurance coverage.

## Final checks and limitations

Frontmatter uses the required field order, exactly three FAQs, `audience: ["nb"]`, internal `author: "legal-ai-assistant"`, the established Bokmål category, the batch dates, and three distinct menu images I01/I12/I23. The traffic file carries the required traffic collection tags and `criminal-litigation` because it discusses complaint-based criminal injury. Titles, SEO titles and summaries satisfy the brief's length targets. Image descriptions translate only the objects listed in the menu; captions use the requested illustrative-image disclosure.

All official URLs linked in each body are also in its source list. Internal column links exist in `repo/src/content/columns-nb/`; none uses the excluded 001/004/005/006/010 group. Each draft has four issue subheadings plus `Kilder`, no body H1, no bold, no public author footer, a single contact paragraph, the approved email and contact page, the four actual consultation languages, a prior language-arrangement statement, a limited first-inquiry request and a no-engagement-by-email statement. Sensitive initial attachments are not requested.

### Sentence-variety tool

The installed shared checker supports `ko`, `ja`, `en`, and `zh-hant`, not `nb`. Its default path guess would treat `drafts/nb/` as Korean. I therefore ran the supplied tool using its English spacing-based profile and separately checked Bokmål prose with whitespace word counts and sentence starts including Æ/Ø/Å. The English-profile result is a numerical proxy, not native Bokmål validation; its tokenization of accented letters and citation recognition are not reported as linguistically exact.

Command, executed after the final article edits:

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check \
  drafts/nb/843-norwegian-seafood-exporter-taiwan-unpaid-invoices.md \
  drafts/nb/844-norwegian-professional-taiwan-work-permit-residence.md \
  drafts/nb/845-norwegian-traveller-taiwan-traffic-accident-return-home.md --lang en
```

Result: exit 0, zero FAIL entries for each file.

| Article | Tool CV / short share / equal-length runs | Bokmål numeric CV / short share / equal-length runs | Maximum repeated paragraph starter | Repeated consecutive sentence starts | Paragraphs with multiple 32+-word sentences |
| --- | --- | --- | ---: | ---: | ---: |
| 843 | 0.521 / 0.273 / 0.019 | 0.468 / 0.269 / 0.040 | 2 | 1 | 0 |
| 844 | 0.467 / 0.222 / 0.077 | 0.455 / 0.245 / 0.078 | 2 | 1 | 0 |
| 845 | 0.489 / 0.241 / 0.077 | 0.455 / 0.269 / 0.040 | 2 | 1 | 0 |

The additional numeric check strips Markdown links to labels, excludes YAML, headings and sources from sentence statistics, treats `nr.` as an abbreviation, splits at sentence punctuation followed by a capital including Æ/Ø/Å, and counts whitespace-separated words. These figures are editing diagnostics, not an external review or a claim that the general checker has acquired Norwegian support.

### Section 5 self-check

1. Supplied tool: zero FAIL with the disclosed profile; the separate Bokmål numeric checks meet CV ≥ 0.45, short sentences ≥ 8%, equal-length runs ≤ 30%, and starter limits.
2. Openings differ: 843 marked concrete hypothetical; 844 actual reader question; 845 a document-request interval. Only one of the three is a scene, and no stock hypothetical opener is used.
3. Each has substantially more than two sentences of eight words or fewer. Manual review found no paragraph containing two long sentences.
4. Paragraph starters were read vertically; no word starts more than two paragraphs. Initial repetitions were corrected in 843 and 844.
5. No three-paragraph sequence repeats claim/citation/caveat. Each article contains evidence-preparation prose without a legal citation; every consequential legal statement has an inline official reference.
6. No repeated `ikke X, men Y` contrast pattern or invented assertion attributed to the reader. Necessary boundaries between permissions, claims and insurance remain explicit.
7. Final substantive paragraphs stay with the oldest invoice, the family's application/travel calendar, and the accident document/medical handoff respectively. None is a summary or sales conclusion.
8. Bokmål register stays consistent; no bold, invented first-person lawyer experience or imperative checklist headings. Safety and actual preparation instructions remain where useful.
9. Source links, legal conditions, time triggers, numbers, hypothetical label and internal AI provenance were compared after editing. FAQ answers retain the same boundaries as the body.

No publication, git operation, installation, repository edit or other-locale edit was performed. The only final written deliverables are the three files in `drafts/nb/` and this note.
