# Turkish author work note — 861–863

Checked and drafted on 24 October 2026. Assignment retained: 861 B-INV, 862 B-DEF, 863 P-WORK. These are Turkish articles for Turkish exporters, importers and prospective professional workers with a Taiwan connection. No claim of lawyer review or native-speaker review is made.

## Deliverables and counts

| Article | File | Body words | Body characters | Complete Markdown words | Complete Markdown characters |
| --- | --- | ---: | ---: | ---: | ---: |
| 861 | `drafts/tr/861-turkish-exporter-taiwan-unpaid-marble-invoices.md` | 705 | 5,595 | 1,036 | 11,011 |
| 862 | `drafts/tr/862-turkish-importer-taiwan-machine-defect-notice.md` | 791 | 6,277 | 1,095 | 10,547 |
| 863 | `drafts/tr/863-turkish-professionals-taiwan-work-permit-residence.md` | 810 | 6,468 | 1,181 | 11,503 |

Body counts exclude frontmatter and the final Kaynaklar section; they include visible subheadings, table cells and contact text. Markdown link labels count, URL destinations do not. Table separators and Markdown heading markers are removed, and whitespace is normalized to single spaces. Characters are Unicode characters including those spaces. Complete-file counts use whitespace-separated tokens and all Unicode characters, including Markdown, metadata, URLs and newlines. Body counts are the measure used for the brief's 650–950-word target.

## Reading and verification record

Read the complete brief, assignments, image menu, repository `docs/columns/EDITORIAL-VOICE.md`, repository `docs/columns/FRONTMATTER.md`, `rules/SENTENCE-VARIETY-RULE.md`, and `rules/LESSONS.md`. Also read `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md` and the shared sentence-variety and lessons files. The requested `/Users/son7/agent-library/knowledge/editorial-voice.md` was unavailable at that path; the repository editorial-voice text and the available column rules supplied the house-style instructions. The obsolete Fable delegation and fixed review gates were not applied.

The three complete Turkish register comparators were:

- `repo/src/content/columns-tr/008-taiwan-labor-severance-law.md`
- `repo/src/content/columns-tr/009-taiwan-voluntary-resignation-severance.md`
- `repo/src/content/columns-tr/013-taiwan-company-establishment-advanced-1.md`

Read all assigned structural sources:

- B-INV: English 354, French 674, Spanish 689, Hindi 669, Thai 663.
- B-DEF: English 506, Spanish 690, Hindi 670, German 680.
- P-WORK: English 705, 704, 706 and 352.

The country-facts ledger was read, including its source register, version warnings, all rows and supporting excerpts. Identical repeated cells/excerpts were displayed once with lossless reference mappings for the final full-file read. All seven Turkey rows were also inspected directly. Only the verified eVisa/passport fact and the qualified absence from BOCA's complete nationality-based visa-exemption list were used in the articles; both were independently checked on the official pages. Unverified and unrelated country facts were excluded.

Every statute cited in the drafts was fetched and read using the supplied `tools/law.py` before citation. Its hard-coded cache directory would write outside the authorized author locations. Therefore its source was executed with only that cache-path expression changed in memory to `drafts/tr/.law-cache`; the script file, fetch logic and article extraction were unchanged. Temporary cache files were removed after the checked excerpts were recorded here. The equivalent article requests were:

```text
tools/law.py B0000007 20 36
tools/law.py B0000001 127 128 129 130 132 258 354 356 357 358 359 360 361 364 365
tools/law.py B0010001 508 509 511 515 516 519 521 522 523 526
tools/law.py N0090001 43 46
tools/law.py A0030295 4 5 9 15 16
tools/law.py D0080132 22
```

The cache-only adaptation used:

```python
source = Path('tools/law.py').read_text().replace(
    "os.path.expanduser('~/tseng-world-columns-20261024/html')",
    "os.path.abspath('drafts/tr/.law-cache')")
exec(compile(source, 'tools/law.py', 'exec'))
```

Civil Code version check: the tool printed the not-yet-effective banner. It concerns article 166-1, whose commencement is unset, and the 17 August 2026 amendment of article 1223, effective six months after promulgation. Neither provision is used here. The cited prescription and sale provisions were checked against the [official history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001); the pending changes do not replace them. The [foreign-professionals statute history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295) records the 24 September 2025 revision and commencement on 1 January 2026, with the specified later provisions effective on 30 June 2026. The provisions used here are effective by the article check date. All three source sections expressly state the 24 October 2026 legal cut-off.

## 861 — unpaid marble invoices

Reader and trigger: the Turkish export company's accounts or sales manager has a Taiwan buyer's unpaid balance and a deduction for allegedly broken slabs. The opening expressly identifies the shipment dispute as an explanatory hypothetical. No client, litigation outcome or frequency of non-payment is asserted.

Country fit: Taiwan's International Trade Administration [Türkiye economic and trade report of 17 April 2026, page 6](https://www.trade.gov.tw/Files/PageFile/721527/721527upc0e20260417161307.pdf) lists marble among Taiwan's principal imports from Türkiye in 2025. This supports choosing marble for the example; it does not establish that a particular shipment failed or that disputes are common. The document text was retrieved; no claim is made that its page image was visually verified.

Overlap and new angle: existing Turkish 013 addresses establishing a company; 008 and 009 address employment termination. None resolves an overseas seller's invoice file. The assigned collection sources supply the legal sequence, but this article follows a Turkish marble shipment through crate identification, rejected slabs, credit adjustments, different warehouse/customer identities, individual invoice maturity dates, Taiwan service and attachment evidence. Its internal link to 862 explains the buyer's defect-notice issue without turning this into a second defects article.

### 861 claim → source checks

All Chinese excerpts below were checked against the tool output on 24 October 2026. Ellipses indicate omitted text, not a continuous quotation.

| Claim in article | Checked official provision | Chinese excerpt and scope check |
| --- | --- | --- |
| The contract's governing law must be identified; a valid express choice precedes the closest-connection rule. | [Choice-of-law Act 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20) | 法律行為發生債之關係者，其成立及效力，依當事人意思定其應適用之法律。 / 當事人無明示之意思或其明示之意思依所定應適用之法律無效時，依關係最切之法律。 |
| Prescription follows the law governing the underlying legal relationship. | [Choice-of-law Act 36](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=36) | 請求權之消滅時效，依該請求權所由發生之法律關係所應適用之法律。 |
| When Taiwan law applies, the price of goods supplied by merchants/manufacturers is within the two-year category. | [Civil Code 127(8)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=127) | 左列各款請求權，因二年間不行使而消滅：…八、商人、製造人、手工業人所供給之商品及產物之代價。 Not stated as a universal period for every commercial debt. |
| The period starts when the claim can be exercised. | [Civil Code 128](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=128) | 消滅時效，自請求權可行使時起算。 |
| Demand, acknowledgment and suit interrupt prescription; payment-order and mediation applications are suit-equivalent events. | [Civil Code 129](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=129) | 消滅時效，因左列事由而中斷：一、請求。二、承認。三、起訴。 / 左列事項，與起訴有同一效力：一、依督促程序，聲請發支付命令。二、聲請調解或提付仲裁。 |
| Demand alone needs timely follow-through within six months. | [Civil Code 130](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=130) | 時效因請求而中斷者，若於請求後六個月內不起訴，視為不中斷。 Read together with article 129's statutory equivalents. |
| A payment-order application can cease to interrupt prescription. | [Civil Code 132](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=132) | 時效因聲請發支付命令而中斷者，若撤回聲請，或受駁回之裁判，或支付命令失其效力時，視為不中斷。 |
| A payment order is available for a definite monetary claim. | [Code of Civil Procedure 508](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=508) | 債權人之請求，以給付金錢或其他代替物或有價證券之一定數量為標的者，得聲請法院依督促程序發支付命令。 |
| Unperformed counter-performance, foreign service or service by publication excludes this procedure. | [Code of Civil Procedure 509](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=509) | 督促程序，如聲請人應為對待給付尚未履行，或支付命令之送達應於外國為之，或依公示送達為之者，不得行之。 The creditor's Turkish location alone is not one of these exclusions. |
| Identify the parties, amount, cause and performance and make a prima-facie showing. | [Code of Civil Procedure 511](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=511) | 三、請求之原因事實。其有對待給付者，已履行之情形。 / 債權人之請求，應釋明之。 |
| Failure to serve within three months after issuance makes the order ineffective. | [Code of Civil Procedure 515(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=515) | 發支付命令後，三個月內不能送達於債務人者，其命令失其效力。 Article 515's distinct mistaken-finality-certificate procedure is not summarized as an ordinary extension. |
| A debtor can object without reasons within twenty days of service. | [Code of Civil Procedure 516](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=516) | 得於送達後二十日之不變期間內，不附理由向發命令之法院提出異議。 |
| A lawful timely objection removes effect in its scope and treats the application as suit or mediation. | [Code of Civil Procedure 519](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=519) | 支付命令於異議範圍內失其效力，以債權人支付命令之聲請，視為起訴或聲請調解。 |
| Without lawful timely objection the order may be an enforcement title; an action denying the debt remains possible. | [Code of Civil Procedure 521](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=521) | 支付命令得為執行名義。 / 債務人主張支付命令上所載債權不存在而提起確認之訴者… No automatic final merits judgment is asserted. |
| Attachment may secure a money claim's future enforcement. | [Code of Civil Procedure 522](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=522) | 債權人就金錢請求或得易為金錢請求之請求，欲保全強制執行者，得聲請假扣押。 |
| Future inability or serious difficulty in enforcement is required. | [Code of Civil Procedure 523](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=523) | 假扣押，非有日後不能強制執行或甚難執行之虞者，不得為之。 |
| The claim and attachment ground need prima-facie evidence; security may be ordered. | [Code of Civil Procedure 526](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=526) | 請求及假扣押之原因，應釋明之。 / 請求及假扣押之原因雖經釋明，法院亦得命債權人供擔保後為假扣押。 No fixed security percentage is invented. |
| Marble is an actual Turkey–Taiwan trade item. | [Trade Administration report, page 6](https://www.trade.gov.tw/Files/PageFile/721527/721527upc0e20260417161307.pdf) | The 2025 import-products passage includes 大理石. This is country-fit evidence, not evidence of the hypothetical debt. |

### 861 deletion test and comparison

| First two paragraphs: sentence or change | Decision and reason | Meaning preserved? |
| --- | --- | --- |
| “Türkiye’den gönderilen mermer kasaları…” through “açıklama amacıyla kurulmuş bir örnektir.” | Keep: identifies goods, direction of trade, non-payment trigger and hypothetical status in the same sentence. | Yes; the explicit hypothetical label remains. |
| “İhracatçının elindeki teslim belgesi…” | Keep: connects the buyer's deduction to the seller's delivery evidence. | Yes. |
| “Tahsilat dosyası bu bağlantıyı göstermelidir.” | Cut: repeats the preceding question without adding a document, condition or consequence. | Yes; no legal proposition removed. |
| “Sipariş, ticari fatura ve teslim kaydını…” | Keep: tells the reader which documents identify the liable company. | Yes. |
| “Depoyu işleten şirket, malı isteyen çalışan…” | Keep: supplies the concrete identity mismatch that makes the prior sentence useful. | Yes. |
| “Tayvan’daki tarafın Çince kayıtlı unvanını…” | Keep: adds the Taiwan name/service-address issue and the Turkish seller's full contracting identity. | Yes; practical preparation, not an invented universal filing rule. |

| Turkish comparator | Opening / sections / ending observed | 861's departure |
| --- | --- | --- |
| 008 | Preview “aşağıda anlatılır”; fragmented prose and a broad comparison table, no H2s; admonitory rights-protection ending. | A labelled shipment scene and a matching-evidence question; four issue-specific H2s; ends with the oldest invoice, delivery record and demand date. |
| 009 | General difficulty of obtaining severance and Korea comparison; numbered statutory grounds, no H2s; general statement about preparation and timing. | No country-law comparison or complete numbered catalogue; dates are attached to invoice maturities, service and interruption. |
| 013 | “pek çok kişi vardır” and a preview; five numbered questions, no H2s; general contact invitation. | No prevalence assertion; only one question heading; the contact paragraph precedes the concrete file-preparation ending. |

Dropped or excluded for lack of verification: any claim that Taiwan routinely recognizes Turkish judgments; a Turkey-specific enforcement treaty or automatic reciprocity; collection success rates, fixed court/attachment costs, customary security percentages and a real marble dispute. Turkish substantive law is not stated. Verified trade evidence is not presented as demand research. Body count: 705 words / 5,595 characters.

## 862 — defective Taiwan machinery in Türkiye

Reader and trigger: the Turkish importer or factory team is commissioning a Taiwan-supplied lathe and a test does not meet the agreed tolerance. The article answers whether it can wait for the final technical report before notifying the seller. This is a conditional reader question, not a claim about a real machine or client.

Country fit: the same [Trade Administration report, page 6](https://www.trade.gov.tw/Files/PageFile/721527/721527upc0e20260417161307.pdf) lists metalworking machinery and metal-cutting lathes among 2025 exports from Taiwan to Türkiye, including the terms 金屬工機 and 切削金屬用車床. The choice of machinery is evidence-based; the particular commissioning problem and expected readership are editorial hypotheses. The public article does not assert market size, dispute incidence or an actual defective shipment.

Overlap and new angle: the assigned defect sources supply inspection/notice, distant-delivery custody, remedies and time limits. This version follows evidence held in Türkiye: serial numbers, receiving versus installation dates, original settings, local test files, agreed drawing versions, removed parts and contact with an intermediary versus the contractual Taiwanese seller. Existing Turkish 008/009 concern employment, and 013 company formation; their law and scenarios are not imported. The cross-link to 861 lets a buyer understand the collection procedure if payment is withheld.

### 862 claim → source checks

| Claim in article | Checked official provision | Chinese excerpt and scope check |
| --- | --- | --- |
| Taiwan sale-law analysis is conditional on the governing law. | [Choice-of-law Act 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20) | 依當事人意思定其應適用之法律。 / 當事人無明示之意思或其明示之意思依所定應適用之法律無效時，依關係最切之法律。 A mixed design/installation contract is not automatically classified as a sale. |
| Warranty concerns the condition at risk transfer, ordinary/agreed utility and guaranteed quality; insignificant reduction is excluded. | [Civil Code 354](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=354) | 但減少之程度，無關重要者，不得視為瑕疵。 / 出賣人並應擔保其物於危險移轉時，具有其所保證之品質。 The full first paragraph's value and use conditions were also checked. |
| Inspect promptly in the ordinary manner suited to the goods; notify immediately of a seller-responsibility defect. | [Civil Code 356(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=356) | 買受人應按物之性質，依通常程序從速檢查其所受領之物。如發見有應由出賣人負擔保責任之瑕疵時，應即通知出賣人。 No invented fixed inspection-day period. |
| Latent defects require immediate notice on discovery; neglected notice can deem acceptance. | [Civil Code 356(2)–(3)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=356) | 除依通常之檢查不能發見之瑕疵外，視為承認其所受領之物。 / 不能即知之瑕疵，至日後發見者，應即通知出賣人，怠於為通知者，視為承認其所受領之物。 |
| Article 356 does not apply when the seller intentionally fails to disclose the defect. | [Civil Code 357](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=357) | 前條規定，於出賣人故意不告知瑕疵於買受人者，不適用之。 Mere technical disagreement is not equated with intentional concealment. |
| Rejected goods delivered from elsewhere require temporary custody if the seller has no local agent; immediate appropriate proof matters. | [Civil Code 358(1)–(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=358) | 如出賣人於受領地無代理人，買受人有暫為保管之責。 / 如買受人不即依相當方法證明其瑕疵之存在者，推定於受領時為無瑕疵。 Both prerequisites remain in the article. |
| Rescission or price reduction is available where the seller bears defect warranty; manifest unfairness limits rescission. | [Civil Code 359](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=359) | 買受人得解除其契約或請求減少其價金。但依情形，解除契約顯失公平者，買受人僅得請求減少價金。 |
| The statutory replacement route is limited to goods specified by kind. | [Civil Code 364](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=364) | 買賣之物，僅指定種類者，如其物有瑕疵，買受人得不解除契約或請求減少價金，而即時請求另行交付無瑕疵之物。 Not generalized to all bespoke machinery. |
| Missing guaranteed quality or intentional nondisclosure can support non-performance damages instead of rescission/reduction. | [Civil Code 360](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=360) | 買賣之物，缺少出賣人所保證之品質者…請求不履行之損害賠償；出賣人故意不告知物之瑕疵者亦同。 All asserted downtime or repair costs are not promised automatically. |
| Six months after article 356 notice and five years from delivery limit rescission/reduction; concealment removes only the six-month rule. | [Civil Code 365](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=365) | 於買受人依第三百五十六條規定為通知後六個月間不行使或自物之交付時起經過五年而消滅。 / 前項關於六個月期間之規定，於出賣人故意不告知瑕疵者，不適用之。 These are not described as the notice deadline or the period for every damages claim. |
| Exercising rescission requires a declaration to the other party. | [Civil Code 258](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=258) | 解除權之行使，應向他方當事人以意思表示為之。 A fault report is not automatically treated as this declaration. |
| A seller may set a reasonable period for the buyer to decide on rescission; failure to rescind loses that right. | [Civil Code 361](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=361) | 出賣人得定相當期限，催告買受人於其期限內是否解除契約。 / 買受人於前項期限內不解除契約者，喪失其解除權。 Repair discussions are not said to suspend the periods automatically. |

### 862 deletion test and comparison

| First two paragraphs: sentence | Decision and reason | Meaning preserved? |
| --- | --- | --- |
| “Türkiye’de devreye aldığınız Tayvan üretimi torna…” | Keep: concrete conditional reader question; distinguishes sending notice from waiting for a final report. | Yes; no real event asserted. |
| “Tayvan satış hukuku uygulanıyorsa…” | Keep: immediate answer, governing-law condition and exact statutory source. | Yes. |
| “Fabrika içindeki arıza kaydı…” | Keep: a local technical log and a notice to the seller perform different functions. | Yes. |
| “Bu kural, işletmeler arasındaki…” | Keep: limits the discussion to commercial sales governed by Taiwan law. | Yes; not a generic scene-setting line. |
| “Uygulanacak hukuk…” | Keep: explains why the Taiwan-law condition cannot be assumed. | Yes. |
| “Tasarım, kurulum…” | Keep: mixed-contract classification can change the analysis. | Yes. |
| “Türkiye’deki ithalat ve ürün güvenliği…” | Keep: identifies the home-country matters outside this Taiwan-law column. | Yes. |

No sentence in the final first two paragraphs was removable without losing a trigger, answer, scope condition or evidence distinction. The deletion test did not require an arbitrary cut.

| Turkish comparator | Opening / sections / ending observed | 862's departure |
| --- | --- | --- |
| 008 | Generic preview; table-led comparison and fragmented paragraphs; rights-protection admonition. | Starts with the final-report decision; four task-specific H2s and one compact deadline table; ends on the location of a removed part and its matching test result. |
| 009 | Broad difficulty statement; numbered exceptions; generalized timing/preparation ending. | Gives the notice answer immediately; separates inspection, custody, remedy selection and exercise periods without reproducing a numbered legal catalogue. |
| 013 | Company-formation background and numbered Q&A; general contact ending. | No generic background; question and noun-phrase headings are mixed, with physical evidence as the final fact after contact information. |

Dropped or excluded for lack of verification: a uniform inspection period; a rule that every defective machine must be replaced; six months to send the first notice; guaranteed recovery of every Turkish customer's deduction or production loss; automatic deadline suspension during repair discussions; Turkish product-safety or import-law conclusions. Body count: 791 words / 6,277 characters.

## 863 — professional work, entry and family residence

Reader and trigger: a Turkish citizen has a Taiwan job offer or is considering a Gold Card and needs to coordinate passport type, actual work authorization, first residence documentation and family travel. The existence or size of a particular Turkish professional community is not asserted.

Country fit: BOCA expressly lists ordinary and special Turkish passports for eVisa eligibility. Türkiye is absent from the complete nationality-based visa-exemption list checked on 24 October 2026. The latter is a list-membership finding, not a claim that every special entry route is legally impossible. This makes advice copied from a 90-day visa-exempt nationality unsuitable. The possibility of Turkish readers moving with a spouse or children is a labelled editorial audience hypothesis; the applicable residence and spouse-work rules are independently verified.

Overlap and new angle: English 705/704/706 supply the separation of entry, work and residence and the ARC-document sequence; English 352 contributes the employer/work-permit distinction. Turkish 013 mentions company establishment and residence, while 008/009 concern termination. This article instead begins with Turkish passport eligibility, does not suggest company formation as a prerequisite, distinguishes employer sponsorship from Gold Card eligibility and addresses nationality-sensitive family documentation. It links to existing 009 only for the later employment-termination issue.

### 863 claim → source checks

| Claim in article | Checked official provision/page | Chinese excerpt or checked official fact and scope |
| --- | --- | --- |
| eVisa eligibility is limited to ordinary and special Turkish passports. | [BOCA eVisa eligibility](https://www.boca.gov.tw/cp-181-8051-69fbd-2.html) | “Türkiye: Only holders of ordinary passports and special passports are eligible for an eVisa.” Page updated 18 August 2026; independently checked. No length-of-stay or processing-time promise is added. |
| Türkiye is not on the nationality-based visa-exemption list as checked. | [BOCA visa exemption](https://www.boca.gov.tw/fp-384-4485-149c7-1.html) | Complete 90-, 30- and 14-day lists and trial entries checked; 土耳其/Türkiye/Turkey is absent. This is explicitly an absence-from-list inference. |
| Work needs the appropriate permit or a statutory exception; eVisa eligibility alone does not authorize work. | [Employment Service Act 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | 除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。 |
| Job categories and qualification review matter. | [Employment Service Act 46](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=46) | 一、專門性或技術性之工作。 / 其工作資格及審查標準，除其他法律另有規定外，由中央主管機關會商中央目的事業主管機關定之。 Job titles alone are not claimed to establish eligibility. |
| The law defines professional work and foreign special professionals. | [Foreign-professionals Act 4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=4) | 外國專業人才：指得在我國從事專業工作之外國人。 / 外國特定專業人才…具有…特殊專長… The complete definition and professional-work categories were read. |
| Employer applications ordinarily go to MOL; the specified education categories go to MOE. | [Foreign-professionals Act 5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=5) | 應檢具相關文件，向勞動部申請許可…但聘僱從事就業服務法第四十六條第一項第三款及前條第四款第四目、第五目之專業工作者…向教育部申請許可。 The education exception is preserved. |
| Gold Card is a direct NIA route for qualifying foreign special professionals; four functions and one-to-three-year validity. | [Foreign-professionals Act 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=9) | 得逕向內政部移民署申請核發具工作許可、居留簽證、外僑居留證及重入國許可四證合一之就業金卡。 / 有效期間為一年至三年。 |
| No prior job offer or employer sponsor is required for Gold Card; professional eligibility remains necessary. | [Official Gold Card explanation](https://goldcard.nat.gov.tw/en/about/) | Official description checked for the open work permit, application without sponsorship and assessment against the selected professional field. No guaranteed approval or universal salary threshold is asserted. |
| Overseas professional-worker resident-visa applications go through the Taiwan mission; remaining employment authorization must exceed six months at application. | [BOCA resident-visa guide](https://www.boca.gov.tw/cp-166-276-48430-2.html) | Guide's required work-permit and remaining-employment-duration conditions checked. Total original permit duration is not substituted for remaining duration. |
| Qualifying professionals entering visa-free or on a visitor visa with permission/exemption for professional work may apply directly for residence. | [Foreign-professionals Act 16(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | 以免簽證或持停留簽證入國，經許可或免經許可在我國從事專業工作者，得逕向內政部移民署申請居留。 Actual entry arrangements and visa limitations must also be considered. |
| Entry restrictions prevent treating every visitor/eVisa case as an automatic in-country conversion. | [NIA 0915 residence guide](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) | Eligibility and note 7(1) checked: exclusions include specified trial visa-exempt/landing/TAC/ABTC/working-holiday and restrictive-notation situations, subject to exceptions. The guide is not turned into an unsupported blanket assertion that every Turkish eVisa can, or cannot, convert. |
| First ARC application after entry with residence permission is due within thirty days starting the next day; integrated ARC documents can be exempt. | [Immigration Act 22(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) | 應於入國後之翌日起算三十日內，向移民署申請外僑居留證。 / 四證合一之有效證件，或其他已含有外僑居留證功能之證件者，得免申請外僑居留證。 |
| A resident visa issued after arrival has a different thirty-day trigger. | [BOCA resident-visa guide](https://www.boca.gov.tw/cp-166-276-48430-2.html) | The guide specifies thirty days from issuance for an in-Taiwan resident visa. This is kept separate from the next-day-after-entry rule in the body and FAQ. |
| Basic residence documents include form/photo, passport/visa, purpose and address evidence; foreign documents need authentication and Chinese translation may be requested. | [NIA 0902 guide](https://www.immigration.gov.tw/5475/5478/141465/141808/141970) | Required-document and foreign-document notes checked, including overseas-mission authentication and properly authenticated or Taiwan-notarized Chinese translations when required. Updated 14 April 2026. |
| The direct family route has sponsor-status, family-relationship and entry conditions. | [Foreign-professionals Act 16(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | 外國專業人才在我國從事專業工作及外國特定專業人才…許可居留或永久居留者，其配偶、未成年子女及因身心障礙無法自理生活之成年子女，以免簽證或持停留簽證入國者… Retains the ordinary professional's working condition and the limited adult-child category. |
| Some dependent health-certificate exemptions depend on nationality-based visa exemption. | [NIA 0915 guide](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) | Health-certificate exemption categories checked, including the non-trial visa-exempt-nationality condition for the specified dependants. No claim that every Turkish applicant has identical health requirements. |
| Spouses of foreign special or senior professionals with approved dependent residence may apply directly for their own MOL work permit. | [Foreign-professionals Act 15(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=15) | 外國特定專業人才及外國高級專業人才之配偶，經內政部移民署許可在我國依親居留者，得逕向勞動部申請許可…該工作許可期間不得逾其依親居留期間。 Not generalized to every worker's spouse or an automatic exemption. |

### 863 deletion test and comparison

| First two paragraphs: sentence or change | Decision and reason | Meaning preserved? |
| --- | --- | --- |
| “Türkiye’nin umuma mahsus veya hususi pasaportunu…” | Keep: independently verified nationality/passport fact gives the reader a concrete starting point. | Yes; both eligible passport types remain. |
| “Türkiye, 24 Ekim 2026 itibarıyla…” | Keep: dates and qualifies absence from the specific visa-free list. | Yes; does not assert a universal prohibition. |
| “Tayvan’dan iş teklifi aldıysanız…” | Keep: connects the passport fact to the actual job-start decision. | Yes. |
| “E-vize uygunluğu işe başlama yetkisi sağlamaz.” | Keep: short answer to a consequential misconception that the opening documents can create. | Yes; directly supported by the next sentence. |
| “İstihdam Hizmetleri Kanunu madde 43…” | Keep: supplies the legal rule and statutory-exception qualification. | Yes. |
| “İmzalı teklif, başvurunun yapıldığını…” | Keep: identifies three real document stages rather than repeating a general warning. | Yes. |
| “Başlangıç tarihini belirlerken bunlardan hangisinin gerçekten elinizde olduğuna bakın.” | Cut: repeats the preceding document-stage distinction as a generic imperative. | Yes; the documents and permission condition remain. |

| Turkish comparator | Opening / sections / ending observed | 863's departure |
| --- | --- | --- |
| 008 | Preview and Korea comparison; fragmented prose/table without H2s; rights-protection admonition. | Opens with verified Turkish passport eligibility; three subject-specific H2s; ends with each family member's documents and dates on one calendar. |
| 009 | General severance difficulty; numbered statutory grounds; general timing/preparation ending. | Uses document stages and concrete entry/ARC triggers, without a long numbered exception list or summary conclusion. |
| 013 | Broad statement linking company formation and residence; numbered Q&A; general contact invitation. | Distinguishes employee-sponsored and Gold Card routes without requiring company formation; noun-phrase headings and a factual family-calendar ending. |

Dropped or excluded for lack of verification: 90-day visa-free entry for Turkish citizens; an ordinary-passport landing-visa promise; automatic eVisa-to-residence conversion; a universal spouse work exemption; Turkish driver-licence recognition; nationality-wide restrictions inferred from the blue-collar source-country list; residence outcomes, approval times or Turkish community statistics. The ledger's tax-treaty and historical land-reciprocity rows are irrelevant to this article and were not turned into additional claims. Body count: 810 words / 6,468 characters.

## Editorial revision record

| Problem sentence or passage | Reason | Final treatment | Meaning preserved? |
| --- | --- | --- | --- |
| 861: “Tahsilat dosyası bu bağlantıyı göstermelidir.” | Repeats the preceding delivery/deduction question. | Deleted, as recorded above. | Yes. |
| 861 invoice-account paragraph and payment-order introduction | Similar medium-length sentences flattened the rhythm; the figures and evidence belonged together. | A linked longer sentence identifies account components; “Toplam tek başına yetmez.” provides a short pivot. Payment-order eligibility and prima-facie requirements share a sentence, followed by “Teslim kaydı faturaya eklenir.” | Yes; every amount category, legal condition and source retained. |
| 861: “Üç ay içinde borçluya tebliğ edilemeyen emir…” | The three-month starting event was insufficiently explicit. | “Verildikten sonra üç ay içinde…” | Yes; precision improved to match article 515(1). |
| 862 receiving/installation/test evidence paragraph | Repeated similarly sized documentary instructions. | One sentence connects chronology with the records; “Sonraki müdahaleler de kaydedilir.” adds a short, distinct evidence point. | Yes; serial/test/setting evidence elsewhere remains. |
| 862 later paragraph beginning “Madde 356…” | The opening citation was distant from the later latent-defect/notice explanation. | Added the same official article link at that paragraph's start. | Yes; legal rule unchanged. |
| 863: “Başlangıç tarihini belirlerken…” | Generic imperative repeats the immediately preceding document comparison. | Deleted, as recorded above. | Yes. |
| 863 diploma/experience/job-description passage | Parallel medium sentences obscured the connection between evidence and the proposed role. | Combined that connection; added the short employer-name comparison and the specific company-identity question. | Yes; no new eligibility threshold asserted. |
| 863 family-residence wording | A broad reference to a professional's residence could omit the ordinary professional's actual Taiwan-work condition. | Expressly retained working in Taiwan, approved residence/permanent residence, the defined children and the family member's entry route. | Yes; statutory scope narrowed accurately. |

## Sentence-variety check and section 5 self-review

The requested unmodified command was run on all three files:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check drafts/tr/861-turkish-exporter-taiwan-unpaid-marble-invoices.md drafts/tr/862-turkish-importer-taiwan-machine-defect-notice.md drafts/tr/863-turkish-professionals-taiwan-work-permit-residence.md
```

Tool limitation: this version supports only `ko`, `ja`, `en` and `zh-hant`. It guesses `ko` for the `tr` directory and reports a short-sentence-share failure for each Turkish article using Korean character thresholds. Explicit `--lang tr` instead raises `KeyError: 'tr'`. Thus the unmodified tool did not pass; its output is not represented as a valid Turkish assessment.

For an applicable numerical check, the same script was loaded read-only with `runpy`. Only language parsing was adapted in memory: Turkish/Unicode word boundaries and sentence-initial letters; `Kaynaklar` as the source boundary; Turkish paragraph openers and article/caveat/contrast markers. The existing word-based `en` threshold route and every `HARD` threshold were left unchanged. The consecutive-start comparison was made stricter by comparing the first word. The script's `check` function then returned zero failures for each draft. This is an author adaptation plus manual review, not native support in the shared tool.

| Draft | Sentences | Length CV ≥ .45 | Short share ≥ .08 | Equal-length triple share ≤ .30 | Most repeated paragraph opener | Consecutive same-start pairs ≤ 2 | Citation-ending share ≤ .45 | Contrast templates ≤ 3 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 861 | 49 | .471 | .245 | .085 | 1 | 0 | .224 | 0 |
| 862 | 57 | .486 | .211 | .109 | 2 | 0 | .035 | 0 |
| 863 | 56 | .457 | .214 | .130 | 1 | 0 | .018 | 0 |

Reproducible adapted check, run from the workspace root without writing a helper file:

```python
import runpy, re
from pathlib import Path
ns = runpy.run_path('/Users/son7/tseng-lanes-shared/variety/variety_metrics.py', run_name='variety_for_tr')
g = ns['metrics'].__globals__
g['SRC_HEAD'] = re.compile(r'^#{2,3}\s*Kaynaklar', re.I)
def words(s):
    return re.findall(r"[^\W_]+(?:['’\-][^\W_]+)*", s, re.UNICODE)
def sentences(p, lang):
    return [s.strip() for s in re.split(r'(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜ0-9“])', g['unlink'](p)) if s.strip()]
g['sentences'] = sentences
g['slen'] = lambda s, lang: len(words(s))
g['opener'] = lambda p, lang: (words(g['unlink'](p)) or [''])[0].casefold()
g['ending'] = lambda s, lang: (words(s) or [''])[-1].casefold()
g['CITE'] = re.compile(r'law\.moj\.gov\.tw|madde\s+\d+|\d+\.?\s*madd', re.I)
g['CONTRAST']['en'] = [r'\bdeğil(?:dir)?\s*[,;]?\s*(?:ama|aksine|fakat)\b', r'\bziyade\b']
g['CAVEAT']['en'] = r'^(Ancak|Fakat|Bununla birlikte)\b'
g['HYPO']['en'] = r'^(Varsayalım|Hayal edin|Örneğin)\b'
g['FORMULA_CLOSE']['en'] = r'^(Sonuç olarak|Bu yazı genel)'
base = g['metrics']
def metrics(text, lang):
    m = base(text, lang)
    _, body = g['strip_fm'](text)
    paras, _, _ = g['body_blocks'](body)
    starts = [(words(s) or [''])[0].casefold() for p in paras for s in sentences(p, lang)]
    m['consec_same_start'] = sum(a == b for a, b in zip(starts, starts[1:]))
    m['long_paras_over_one'] = sum(sum(len(words(s)) >= 32 for s in sentences(p, lang)) > 1 for p in paras)
    return m
g['metrics'] = metrics
rc = 0
for p in sorted(Path('drafts/tr').glob('*.md')):
    rc |= g['check'](str(p), 'en')
raise SystemExit(rc)
```

| Rule section 5 item | Manual result across the three articles |
| --- | --- |
| 1. Numerical limits | Adapted Turkish check: zero FAILs, as above. Native shared-checker support remains unavailable and is disclosed. |
| 2. Opening types | 861 uses one expressly labelled concrete shipment hypothetical without a stock introductory phrase; 862 starts with a reader's conditional technical question; 863 starts with a sourced passport fact. No repeated opening template. |
| 3. Short/long sentences | At least two very short sentences in each: 861 “Toplam tek başına yetmez.” and “Her vade ayrı hesaplanır.”; 862 “Güvenlik önceliklidir.” and “Sonraki müdahaleler de kaydedilir.”; 863 “İşveren adı da karşılaştırılır.” and “Başlangıç olayı farklıdır.” No paragraph has two sentences at or above the 32-word long-sentence threshold. |
| 4. Paragraph starters | No opener appears three times. Maximum counts are 1, 2, 1 respectively; 862's repeated opener is “Madde”. |
| 5. Claim/caveat rhythm | No three consecutive paragraphs use a claim-plus-caveat mould. All articles include uncited documentary or practical paragraphs. 861 has one caveat opener, 862 zero, 863 one under the adapted check. |
| 6. Contrast | No X-not-Y-but-Z template detected. Necessary distinctions answer the invoice, notice, permit or deadline issue rather than inventing a reader's opposing argument. |
| 7. Ending | Before sources, 861 ends with the oldest invoice and delivery/demand records, 862 with the removed part and matching test, 863 with family-specific documents and dates. Contact/disclaimer language is not the final paragraph. |
| 8. Register/format | Turkish explanatory register throughout; no bold, body H1, invented first-person lawyer narration, author footer or imperative checklist headings. Korean/Japanese register rules are not applicable. |
| 9. Accuracy after edits | Rechecked article numbers, statutory alternatives, start events, six-month/five-year distinction, twenty-day objection, three-month service, thirty-day ARC triggers, sources and the explicit hypothetical label. No legal condition was sacrificed for rhythm. |

Final checks: exact frontmatter field order; correct author/audience/date/category; three consistent FAQs per article; SEO titles of 53/51/51 characters and summaries of 142/150/153 characters; five/five/four H2s including Kaynaklar; all body sources repeated in the source section; valid same-language internal targets; unique country-cued slugs. Images are distinct menu entries I01/I05/I04 with faithful Turkish descriptions and the required illustration caption. Asset URLs were checked against the authorized image menu; image binaries are not present in this read-only content snapshot, so no local image-rendering claim is made. Only the three draft files and this work note are retained as author deliverables.
