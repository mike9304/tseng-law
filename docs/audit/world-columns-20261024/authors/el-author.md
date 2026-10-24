# Greek author note — 24 October 2026

Assignment: locale `el`, articles 855–857; B-AWARD, B-INV and P-WORK retained. These are new Greek articles for the stated readers, not translations of a common skeleton. No publishing, installation or git commands were used. Final deliverables are the three Markdown articles in `drafts/el/` and this note.

## Reading and verification record

Read `briefs/BRIEF.md`, `briefs/ASSIGNMENTS.md`, `briefs/IMAGE-MENU.md`, `repo/docs/columns/EDITORIAL-VOICE.md`, `repo/docs/columns/FRONTMATTER.md`, `rules/SENTENCE-VARIETY-RULE.md` and `rules/LESSONS.md` in full. Also read the separately specified `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, `/Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md` and `/Users/son7/tseng-lanes-shared/LESSONS.md`. The local rule bundle and shared copies differ; the brief controls article shape and contacts. The old Fable references were not treated as mandatory delegation or review gates.

`/Users/son7/agent-library/knowledge/editorial-voice.md` does not exist at the supplied path. Its available repository house-style counterpart was read in full and applied. `research/country-facts.md` was absent when checked. No unverified or pending country-facts rows were used. Bridge inbox files were checked for instructions relevant to this batch; the historical directions for other named sessions were not imported into this assignment.

The three complete Greek register samples were:

- `repo/src/content/columns-el/009-taiwan-voluntary-resignation-severance.md`.
- `repo/src/content/columns-el/013-taiwan-company-establishment-advanced-1.md`.
- `repo/src/content/columns-el/015-taiwan-company-setup-pitch-location.md`.

They establish the date pattern `24 Οκτωβρίου 2026`, the reading-time pattern `5 λεπτά ανάγνωσης`, and the existing general category `Νομικές πληροφορίες για την Ταϊβάν` used in 009. The company-specific category in 013/015 was not applied to these litigation and visa articles. The older samples' author narration, Korean comparisons, generic previews, archaic phrasing and promotional endings were not copied.

All structural source columns named for the three selected topics were read in full:

- B-AWARD: English 351, Arabic 700, Portuguese 696.
- B-INV: English 354, French 674, Spanish 689, Hindi 669, Thai 663.
- P-WORK: English 705, 704, 706 and 352.

Every statute used in an article was fetched and its Chinese text read with `tools/law.py` before insertion. To respect the write boundary, the tool was executed through `runpy.run_path`, redirecting only its hard-coded cache directory with an in-process `os.path.expanduser` override to `drafts/el/.law-cache`. The script and shared cache were not edited. Those temporary, author-owned cache files were removed after verification; the checked excerpts and URLs are retained below.

Tool calls covered:

```text
I0020001 47 48 49 50 51
B0000007 20 36
B0000001 127 128 129 130 132
B0010001 508 509 510 511 515 516 519 521 522 523 526
N0090001 43 46 48
A0030295 4 5 7 9 15 16 17 33
D0080132 22
B0010004 7
```

Some checked provisions were omitted to keep the articles focused. The claims tables list the provisions actually used.

Law-version check: the Civil Code tool output warned `部分條文尚未生效`. The displayed banner identifies article 166-1, with an undetermined effective date, and amended article 1223, effective six months after promulgation on 17 August 2026. None of the cited limitation provisions is among these deferred provisions. Article 856 expressly dates its Taiwan-law discussion to 24 October 2026. The [Foreign Professionals Act history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295), fetched directly from MOJ after the browser fetch failed, records the Executive Yuan order of 18 November 2025: `第 4 條第 4 款第 4 目後段、第 28、29 條，定自一百十五年六月三十日施行；其餘條文，定自一百十五年一月一日施行`. All provisions relied on here are in force by the article date. The other tool outputs showed no deferred-effect banner.

## 855 — Greek shipowner and a foreign arbitral award

File: `drafts/el/855-greek-shipowner-arbitral-award-taiwan-enforcement.md`.

Reader and trigger: a Greek shipowner or shipping-company legal/finance team has an award for unpaid freight against a Taiwanese charterer and needs to decide what can be done against assets in Taiwan. The article's London example is expressly hypothetical within its sentence. It is not a reported arbitration or a claim about the firm's cases.

Country fit: Taiwan's International Trade Administration [2025 Greece economic and trade profile](https://www.trade.gov.tw/Files/PageFile/725435/725435zeb2s20250331175735.pdf), printed page 13, lists ships among Taiwan's exports to Greece and describes Taiwanese shipping-company operations there. This supports a real bilateral maritime connection. Demand for an article about a Greek claimant's shipping award is an editorial hypothesis, not an evidenced count of disputes or a statement that Greek companies usually arbitrate in London. No unverified Greek or UK reciprocity claim is made.

Overlap and new angle: the existing Greek 001–018 set has no foreign-award enforcement article. The reviewed structural sources supply the recognition/documents/refusal framework. The new treatment ties it to charterparty recaps, incorporated terms, charterer identity, broker correspondence, corrected awards and the currency of freight claims. It separates the Greek creditor's identity from the award's place and arbitration law, and stops short of advising on vessel arrest or maritime priority.

### Claim → checked source

| Claim in the article | Statute and official URL | Chinese text checked and scope preserved |
|---|---|---|
| Foreign-award classification; recognition gives final-judgment effect between the parties and an enforcement title | Arbitration Act, [47](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0020001&flno=47) | `在中華民國領域外作成之仲裁判斷或在中華民國領域內依外國法律作成之仲裁判斷，為外國仲裁判斷。` / `經聲請法院裁定承認後，於當事人間，與法院之確定判決有同一效力，並得為執行名義。` Recognition precedes use of the award as an enforcement title. |
| Award/agreement originals or authenticated copies; full applicable arbitration-law/rules texts; Chinese translation; authentication bodies and service copies | Arbitration Act, [48](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0020001&flno=48) | `仲裁判斷書之正本或經認證之繕本` / `仲裁協議之原本或經認證之繕本` / `其全文` / `應提出中文譯本` / `駐外使領館、代表處、辦事處或其他經政府授權之機構` / `按應受送達之他方人數，提出繕本`. No assumption that an ordinary foreign notarization or apostille suffices. |
| Mandatory public-policy/non-arbitrability refusal; discretionary non-reciprocity refusal based on award country or arbitration-law country | Arbitration Act, [49](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0020001&flno=49) | `法院應以裁定駁回` for the two first-paragraph grounds; `其判斷地國或判斷所適用之仲裁法規所屬國…不予承認者，法院得以裁定駁回`. The difference between 應 and 得 and the OR country connection are retained. |
| Opponent's twenty days from receipt of notice; capacity/agreement, notice/due process, scope, tribunal/procedure and binding-effect objections; separable remainder | Arbitration Act, [50](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0020001&flno=50) | `他方當事人得於收受通知後二十日內聲請法院駁回其聲請` / `未受適當通知…仲裁欠缺正當程序` / `但除去該部分亦可成立者，其餘部分，不在此限` / `違反當事人之約定；當事人無約定時，違反仲裁地法` / `尚無拘束力或經管轄機關撤銷或停止其效力`. Twenty days is not counted from the award date. |
| A pending annulment/suspension request can lead to a stay on application and security; final annulment requires refusal or revocation on application | Arbitration Act, [51](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0020001&flno=51) | `法院得依聲請，命供相當並確實之擔保，裁定停止其承認或執行之程序` / `經依法撤銷確定者，法院應駁回其承認之聲請或依聲請撤銷其承認`. No automatic stay promised. |
| Territorial court for execution | Compulsory Enforcement Act, [7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010004&flno=7) | `強制執行由應執行之標的物所在地或應為執行行為地之法院管轄。` The article states this affirmative jurisdiction rule, not an exhaustive account of the fallback provisions. |

### First-two-paragraph deletion test

Each sentence was tested separately. No sentence in the final first two paragraphs could be removed without losing reader identification, the procedural gateway or debtor identification; none was retained as an article preview.

| Final sentence | Decision and reason |
|---|---|
| `Έχετε διαιτητική απόφαση για ανεξόφλητο ναύλο, αλλά ο ναυλωτής διαθέτει περιουσία στην Ταϊβάν;` | Keep: identifies the award, freight claim, debtor and Taiwan asset connection. |
| `Για μια ελληνική πλοιοκτήτρια εταιρεία, η επόμενη αίτηση αφορά την αναγνώριση της απόφασης εκεί.` | Keep: supplies the immediate Taiwan procedural step and intended reader. |
| `Το άρθρο 47… επιτρέπει, μετά τη δικαστική αναγνώριση, να χρησιμοποιηθεί αλλοδαπή διαιτητική απόφαση ως εκτελεστός τίτλος.` | Keep: states the legally consequential condition and its source. |
| `Στο ναυλοσύμφωνο και στην απόφαση πρέπει να εντοπιστεί η ίδια οφειλέτρια εταιρεία.` | Keep: ties the contract and title to the intended respondent. |
| `Ο ναυλομεσίτης… ο διαχειριστής του πλοίου και ο συμβαλλόμενος ναυλωτής χρειάζονται χωριστή καταγραφή στον φάκελο.` | Keep: adds the shipping-specific identity problem. |
| `Ποιος ακριβώς υποχρεώθηκε να πληρώσει;` | Keep: directs the identity check to the dispositive award, rather than the contact person's name. |

### Comparison with the three existing Greek samples

| Sample | Opening, headings and ending comparison |
|---|---|
| 009 | Its opening refers back to a prior article and proceeds into a statutory numbered list, ending with broad timing advice and service links. 855 opens with the award creditor's actual question, uses four issue statements and ends with the corrected award/payment reconciliation task. |
| 013 | Its opening announces collected questions and invokes recent successful company formations; the body is a numbered Q&A ending in generic contact text. 855 has no practice-experience claim, no numbered Q&A and no generic promise at the end. |
| 015 | Its opening starts with a parenthetical scope notice and location search; it uses an embedded question and a broad final regulatory caveat. 855 puts jurisdiction into the concrete freight question, gives issue-specific headings and ends on the award file. |

Statements dropped or deliberately not adopted: claims that Taiwan has recognized Greek or UK awards in an identified precedent; automatic reciprocity; a New York Convention shortcut; guaranteed timing or recovery; presumed ownership of a branded vessel; ship-arrest or sister-ship remedies; the structural English source's law-firm address and invitation to send the complete award at first contact. No court decision is represented as checked.

## 856 — Greek olive-oil exporter and an unpaid invoice

File: `drafts/el/856-greek-exporter-taiwan-unpaid-olive-oil-invoices.md`.

Reader and trigger: an exporter in Greece has received a deposit but not the price of olive oil delivered to a Taiwan importer. The opening is explicitly hypothetical. Disputed stock sell-through, delivery of identified lots and agreed credit dates must be reconciled before selecting a collection procedure.

Country fit: the official [2025 Greece trade profile](https://www.trade.gov.tw/Files/PageFile/725435/725435zeb2s20250331175735.pdf), printed page 13, identifies `橄欖油(1509)` among Taiwan's imports from Greece. This verifies the trade link behind the example; the nonpayment scenario and reader demand remain hypotheses. No allegation about a named importer, prevalence of default, current trade value or Greek export-finance rule is included.

Overlap and new angle: the existing Greek set has company-setup and sector-entry articles, but no unpaid-invoice recovery article. French 674 supplied the reconciliation idea; English 354 and the Spanish, Hindi and Thai columns supplied the limitation/payment-order structure. The new angle is traceability from bottled-oil lots to cartons, shipment, receipt, credit terms and claimed deductions. It does not conflate the consignee with the buyer. This article handles a pre-award price claim; 855 handles an existing award.

### Claim → checked source

| Claim in the article | Statute and official URL | Chinese text checked and scope preserved |
|---|---|---|
| Choice of law first; otherwise closest connection and characteristic-performance presumption | Choice of Law Act, [20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20) | `依當事人意思定其應適用之法律` / `當事人無明示之意思或其明示之意思…無效時，依關係最切之法律` / `負擔該債務之當事人行為時之住所地法，推定為關係最切之法律`. No automatic Taiwan-law or Greek-law conclusion. |
| Limitation follows the law governing the underlying relationship | Choice of Law Act, [36](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=36) | `請求權之消滅時效，依該請求權所由發生之法律關係所應適用之法律。` The Taiwan limitation discussion is expressly conditional. |
| Two-year period for the stated goods-price claim | Civil Code, [127, item 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=127) | `因二年間不行使而消滅` / `商人、製造人、手工業人所供給之商品及產物之代價`. The example falls within the merchant/manufacturer subset; no claim that every business debt follows this rule. |
| Start when the claim can be exercised | Civil Code, [128](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=128) | `消滅時效，自請求權可行使時起算。` Applied invoice by invoice, not from discovery by the collection department. |
| Demand, acknowledgment and suit can interrupt; payment-order application has the same effect as suit | Civil Code, [129](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=129) | `一、請求。二、承認。三、起訴。` / `與起訴有同一效力：一、依督促程序，聲請發支付命令。` No assumption that every buyer reply acknowledges debt. |
| Demand interruption is ineffective without suit or a legally equivalent step within six months | Civil Code, [130](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=130) | `若於請求後六個月內不起訴，視為不中斷。` Six months starts after the demand. |
| Payment order for a definite money claim | Code of Civil Procedure, [508](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=508) | `以給付金錢或其他代替物或有價證券之一定數量為標的者，得聲請…支付命令`. The money-claim subset is described. |
| Exclusions for unperformed counter-performance, foreign service or service by publication | Code of Civil Procedure, [509](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=509) | `應為對待給付尚未履行，或…送達應於外國為之，或依公示送達為之者，不得行之。` All three alternatives preserved; creditor residence abroad is not equated with foreign service on the debtor. |
| Application must state facts/performed counter-performance and make a preliminary showing | Code of Civil Procedure, [511](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=511) | `請求之原因事實。其有對待給付者，已履行之情形` / `債權人之請求，應釋明之。` Greek `πιθανολογήσει` preserves the preliminary standard. |
| Twenty days from service; no reasons needed for objection | Code of Civil Procedure, [516](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=516) | `得於送達後二十日之不變期間內，不附理由…提出異議。` No counting from issuance or from the invoice. |
| Timely lawful objection removes effect to the contested extent and treats application as suit/mediation | Code of Civil Procedure, [519](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=519) | `於法定期間合法提出異議者，支付命令於異議範圍內失其效力…視為起訴或聲請調解。` Extent, timeliness and legality preserved. |
| Unopposed order can be an execution title; debtor can sue to dispute the debt | Code of Civil Procedure, [521](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=521) | `未於法定期間合法提出異議者，支付命令得為執行名義` / `主張支付命令上所載債權不存在而提起確認之訴`. The order is not described as determining the merits with final-judgment effect. |
| Provisional attachment for money claims | Code of Civil Procedure, [522](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=522) | `就金錢請求或得易為金錢請求之請求，欲保全強制執行者，得聲請假扣押。` |
| Risk that later execution is impossible or very difficult | Code of Civil Procedure, [523](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=523) | `非有日後不能強制執行或甚難執行之虞者，不得為之。` An unpaid invoice alone is not represented as proving all conditions. |
| Preliminary showing of claim AND attachment reason; security may be required | Code of Civil Procedure, [526](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=526) | `請求及假扣押之原因，應釋明之` / `法院得定相當之擔保` / `雖經釋明，法院亦得命債權人供擔保`. No automatic asset freeze promised upon posting security. |

### First-two-paragraph deletion test

| Final sentence | Decision and reason |
|---|---|
| `Το ελαιόλαδο βρίσκεται ήδη στην αποθήκη… μόνο την προκαταβολή — υποθετικό παράδειγμα.` | Keep: establishes the particular goods, delivery, partial payment, Greek creditor and hypothetical status. |
| `Ο αγοραστής συνδέει την εξόφληση με τις δικές του πωλήσεις… συγκεκριμένη ημερομηνία πληρωμής.` | Keep: introduces the actual inconsistency requiring document review. |
| `Αυτά τα δύο έγγραφα χρειάζονται αντιπαραβολή πριν σταλεί η επόμενη απαίτηση.` | Keep: makes the first preparation step specific to that inconsistency. |
| `Η ημερομηνία παραλαβής, η λήξη της πίστωσης και η τελευταία αναγνώριση του υπολοίπου είναι χωριστά γεγονότα.` | Keep: prevents merging evidence dates with the claim's due date. |
| `Ένας πίνακας ανά τιμολόγιο επιτρέπει… ποιο ποσό ζητά, πότε έγινε απαιτητό και τι ακριβώς αμφισβητεί ο εισαγωγέας.` | Keep: establishes the unit of reconciliation later used in the table. |

No preview or title-restatement sentence was present to cut from these two paragraphs. Later prose was revised to diversify sentence lengths without changing the example.

### Comparison with the three existing Greek samples

| Sample | Opening, headings and ending comparison |
|---|---|
| 009 | Its opening is a backward reference and a general legal proposition; its list dominates the body and its end generalizes about time. 856 uses a labeled delivery/payment scene, a short reconciliation table and a final date attached to the oldest invoice. |
| 013 | Its collected-Q&A opening and numbered questions invite a broad company guide. 856 stays with a single export transaction, uses three sections with only one question heading, and offers no formation-timing or success claim. |
| 015 | Its parenthetical opening and imperative cautions about premises do not fit invoice evidence. 856 supplies the business facts immediately, names delivery/limitation/service in the headings, and ends with pending orders rather than a generic changing-law caveat. |

Statements dropped or deliberately not adopted: every invoice has a two-year deadline; an ambiguous buyer email restarts limitation; reminders preserve a claim indefinitely; Greek export-receipt/reporting requirements; current trade statistics; court filing-fee figures from older columns; a guaranteed fast payment order or automatic freeze. Articles 515 and 132 were checked but the special nonservice/certificate issues were not introduced into this focused overview. No conclusion is made about an actual contract's governing law or forum.

## 857 — Greek professional moving to Taiwan

File: `drafts/el/857-greek-professionals-taiwan-work-permit-residence.md`.

Reader and trigger: a Greek passport holder has a professional job offer and needs to align entry, work permission, residence and the family's applications before choosing a start date. The technical-role discussion is conditional guidance, not an invented client story. Merchant-vessel crew are expressly distinguished from the professional office/technical route.

Country fit: [BOCA's visa-exempt entry page](https://www.boca.gov.tw/fp-149-4486-7785a-1.html), dated 17 July 2026 and opened during this task, lists Greece in the up-to-90-day group. That produces a specific and verified Greek entry-versus-work issue. The [2025 Greece trade profile](https://www.trade.gov.tw/Files/PageFile/725435/725435zeb2s20250331175735.pdf), printed page 13, also identifies Greek investment in information/communications and electrical-equipment manufacturing in Taiwan. The interest of Greek technical professionals is an editorial hypothesis; no migration count, shortage occupation or guaranteed permit eligibility is asserted.

Overlap and new angle: 009 concerns labor-law remedies after employment problems; 013 discusses establishing a company and mixes in immigration claims. 857 focuses on a Greek individual's pre-employment sequence, the correct passport conditions, direct residence under the current article 16, and the limited spouse work-permit category. It does not repeat the generic ARC administration coverage of the source columns or expand into tax, pension or long-term residence calculations.

### Claim → checked source

| Claim in the article | Statute or official URL | Text checked and scope preserved |
|---|---|---|
| Greek nationals: up to 90 days; ordinary passport conditions; six-month remaining validity; onward/return ticket; admission check; next-day counting | [BOCA visa-exempt entry](https://www.boca.gov.tw/fp-149-4486-7785a-1.html) | English source: `duration of stay of up to 90 days`, `Greece`, `at least six months`, `starts from the day after arrival`. The article addresses an ordinary Greek passport and retains the official conditions. No Chinese excerpt is invented for this English source. |
| General prior work-permission requirement subject to lawful exceptions | Employment Service Act, [43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | `除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。` Visa-free entry and an offer are not described as work permission. |
| Specialized/technical category and separate merchant-vessel crew category; qualifications set by the applicable standards | Employment Service Act, [46](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=46) | `一、專門性或技術性之工作` / `七、商船、工作船及其他經交通部特許船舶之船員` / `工作資格及審查標準…由中央主管機關會商中央目的事業主管機關定之`. No universal salary/degree threshold supplied. |
| Employer normally applies to Labor; specified teaching categories to Education | Foreign Professionals Act, [5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=5) | `除本法另有規定外…向勞動部申請許可` / `但聘僱從事…專業工作者…向教育部申請許可`. The exception is not collapsed into a single agency. |
| Specialist professional classification | Foreign Professionals Act, [4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=4) | `外國特定專業人才…具有中央目的事業主管機關公告之我國所需…領域之特殊專長，或經主管機關會商相關中央目的事業主管機關認定具有特殊專長者`. Greek nationality or a degree alone is not treated as qualification. |
| Gold Card direct application, four functions and initial one-to-three-year validity | Foreign Professionals Act, [9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=9) | `得逕向內政部移民署申請核發具工作許可、居留簽證、外僑居留證及重入國許可四證合一之就業金卡` / `有效期間為一年至三年`. Approval is not guaranteed. |
| Gold Card does not require a secured job or employer sponsorship; open work permission | [Official Gold Card overview](https://goldcard.nat.gov.tw/en/about/) | English source, benefits section: `an open work permit` and `require neither pre-confirmed hiring by nor application through any employer`. Only these program features were used; older tax/permanent-residence material on that page was not adopted. |
| Eligible authorized/exempt professionals entering visa-free or as visitors may apply directly for residence; ARC on approval | Foreign Professionals Act, [16(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | `以免簽證或持停留簽證入國，經許可或免經許可…從事專業工作者，得逕向內政部移民署申請居留；經許可者，發給外僑居留證。` Category, authorization and entry conditions all remain. |
| Eligible sponsor already has residence/permanent residence; spouse, minor children, adult children unable to self-care because of disability may apply after qualifying entry | Foreign Professionals Act, [16(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | `經內政部移民署許可居留或永久居留者，其配偶、未成年子女及因身心障礙無法自理生活之成年子女，以免簽證或持停留簽證入國者…`. Parents and unrestricted adult children are not added. |
| Application/document route, authentication, possible Chinese translation and departure if ARC not obtained by stay expiry | [NIA guidelines 0915](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) | Checked document list and notes 7(8)–(9). English excerpts: `must be certified by the overseas embassies`; `shall leave the State within the prescribed period`. Translation is framed as something NIA may request, not an unconditional requirement inferred from the article. |
| First ARC after admission with residence permission: thirty days counted from next day; valid combined-document exception | Immigration Act, [22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) | `取得居留許可者，應於入國後之翌日起算三十日內…申請外僑居留證` / `四證合一之有效證件，或其他已含有外僑居留證功能之證件者，得免申請`. Not presented as a thirty-day entitlement to convert any visitor status. |
| Spouses of specialist/senior professionals with approved dependent residence may apply for individual permission, not exceeding dependent residence | Foreign Professionals Act, [15(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=15) | `外國特定專業人才及外國高級專業人才之配偶…許可在我國依親居留者，得逕向勞動部申請許可…該工作許可期間不得逾其依親居留期間`. This is not extended to every professional's spouse or described as automatic permission. |

### First-two-paragraph deletion test

| Final sentence | Decision and reason |
|---|---|
| `Έως 90 ημέρες χωρίς βίζα προβλέπει για Έλληνες υπηκόους η επίσημη ενημέρωση του BOCA.` | Keep: verified Greek-specific entry fact, not general Taiwan background. |
| `Η μέτρηση αρχίζει την επομένη της άφιξης.` | Keep: supplies the legally significant start point. |
| `Για τον κάτοχο κοινού ελληνικού διαβατηρίου απαιτείται… έξι μηνών… εισιτήριο… επόμενου προορισμού.` | Keep: conditions prevent an unconditional entry promise. |
| `Η τελική αποδοχή εισόδου υπόκειται στον έλεγχο των αρχών.` | Keep: preserves the admission condition in the official source. |
| `Για Έλληνα επαγγελματία με πρόταση εργασίας… ποια άδεια καλύπτει τα συμφωνημένα καθήκοντα.` | Keep: connects the entry rule to the reader's specific employment decision. |
| `Η είσοδος χωρίς βίζα δεν αρκεί.` | Keep: identifies the permission gap directly. |
| `Το άρθρο 43… γενικό κανόνα την προηγούμενη άδεια που ζητά ο εργοδότης, με τις νόμιμες εξαιρέσεις.` | Keep: gives both the legal rule and exception qualification. |

Removed from the first sentence: `όπως ελέγχθηκε στις 24 Οκτωβρίου 2026`. It duplicated the dated sources block and overloaded the numeric opening; the exact check date remains at the end. Added the source's next-day counting sentence, which adds real information. Elsewhere, deleted `Το αποδεικτικό πρέπει να αφορά τον ίδιο.` because it was tautological beside the criterion/evidence explanation.

### Comparison with the three existing Greek samples

| Sample | Opening, headings and ending comparison |
|---|---|
| 009 | Its backward-looking opening and labor exceptions are replaced with a verified entry number and forward-looking work/residence decisions. The end is two dates in a travel calendar, not general advice about time in disputes. |
| 013 | Its company-success preface and numbered broad Q&A are not reused. 857 distinguishes employer permission, individual Gold Card, ARC and family applications in four varied headings without implying company incorporation ensures residence. |
| 015 | Its parenthetical scope preface and premises-search warning are replaced with a country-specific entry rule and its conditions. The final paragraph identifies the work-start and stay-expiry dates rather than announcing that regulations can change. |

Statements dropped or deliberately not adopted: a Greek working-holiday entitlement, a Greece–Taiwan tax treaty, automatic EU-degree recognition, a universal salary threshold, a fixed processing time, automatic visa-free conversion, automatic spouse work permission, unrestricted remote work, crew eligibility under the professional pathway and any promise of Greek-language consultation. No verified evidence was available or needed for those propositions, so they were not asserted.

## Editorial review and section 5 self-check

| Problem sentence or measurement | Reason | Revision | Meaning preservation |
|---|---|---|---|
| 855 FAQ: `ισχύ οριστικής δικαστικής απόφασης` | `οριστική` can fail to convey the final/binding character of 確定判決. | `ισχύ τελεσίδικης δικαστικής απόφασης`; same effect added explicitly in the body. | Corrected precision against article 47; recognition and between-the-parties limits retained. |
| 855: the single long sentence listing all article 50 grounds | Dense enumeration compressed the agreement/default-seat qualification. | Split the paragraph and state the composition/procedure condition and separability in a second paragraph, with its own article 50 link. | Deadline, grounds, applicable hierarchy and separability preserved or clarified. |
| MONOTONY: 856 length variation — initial Greek word-count CV 0.404 — vary actual thought lengths | Too many medium-length sentences; below 0.45. | Split the screenshot/evidence sentence and acknowledgment discussion; state the article 20 presumption precisely. Final CV 0.473. | No dates, obligations or source links removed. Added choice-of-law precision. |
| MONOTONY: 856 paragraph opener — three paragraphs began `Για` — change one natural entry point | Repeated opening beyond the stated two-use limit. | `Για εμφιαλωμένο ελαιόλαδο…` → `Στο εμφιαλωμένο ελαιόλαδο…`. | Same batch-to-document linkage. |
| MONOTONY: 857 paragraph opener — three paragraphs began `Για` — use the actual subject | Repeated opening beyond the stated limit. | `Για εργασία του συζύγου χρειάζεται χωριστός έλεγχος.` → `Εργασία του συζύγου σημαίνει χωριστό έλεγχο.` | Same need for a separate work-permission assessment. |
| 857: `Το αποδεικτικό πρέπει να αφορά τον ίδιο.` | Tautological sentence added no practical criterion. | Deleted. | No legal requirement or cited condition lost. |

The exact shared-checker command requested in the instructions was run on all three files. The installed script supports only `ko`, `ja`, `en` and `zh-hant`. It silently classified the `el` directory as Korean, failed to split ordinary Greek sentences and reported 2, 3 and 3 FAIL items respectively on the initial drafts. Those results are recorded as an unsupported-language failure, not rebranded as a stock-tool pass.

A supplemental run reused the shared script's metric calculation and HARD thresholds in memory, without editing it. The adapter recognizes `Πηγές`, Unicode Greek words, Greek question punctuation `;`/`;`, Greek article references, Greek paragraph starters and Greek contrast/caveat patterns. It uses the space-separated-language limits of 8 words for short sentences and 32 for long sentences. Consecutive starts were checked by the first Greek word, a stricter check than the original English implementation's first two words. Table rows, headings, frontmatter and sources are excluded from sentence metrics. Source links remain intact in the articles.

| Article | Sentences / prose paragraphs | Length CV | Short share | Similar-length runs | Max same paragraph starter | Consecutive same sentence starts | End-parenthesis citation share | Contrast templates | Body questions | Supplemental FAIL |
|---|---|---|---|---|---|---|---|---|---|---|
| 855 | 48 / 17 | 0.471 | 0.167 | 0.043 | 2 | 2 | 0.021 | 0 | 2 | 0 |
| 856 | 51 / 16 | 0.473 | 0.255 | 0.041 | 2 | 0 | 0.098 | 0 | 1 | 0 |
| 857 | 47 / 15 | 0.485 | 0.191 | 0.000 | 2 | 2 | 0.000 | 0 | 1 | 0 |

This adaptation is a transparent author check, not a validated Greek implementation of the shared tool and not native-speaker or lawyer review. The stock-tool Greek-support gap remains a tooling limitation. Manual review covered the parts numerical checks cannot establish.

Section 5 checks completed:

1. Numeric limits: zero FAIL in the Greek-aware supplemental check; stock tool limitation documented above.
2. Distinct openings: 855 reader question, 856 labeled hypothetical transaction, 857 verified entry number. Only one scene among three; no stock “suppose” opener.
3. Each article has at least two very short sentences. Long sentences are not stacked within a paragraph; article 50's legal qualifications were separated rather than removed.
4. No paragraph-start word occurs more than twice in each final article. No article exceeds two consecutive repeated sentence starts.
5. No run of three claim/citation/caveat paragraphs; each article has uncited practical/evidence paragraphs that make no independent statutory claim.
6. No rhetorical “not X but Y” templates. Necessary statutory distinctions and limits are retained.
7. Substantive endings are specific: corrected award/payments, oldest invoice's next-action date, work-start/stay-expiry dates. The sources section is a structural tail.
8. No bold, body H1, author footer, invented lawyer experience or imperative checklist headings. Greek is used throughout the reader text, with official abbreviations explained. Korean/Japanese register tests are inapplicable.
9. Citation links, number/trigger combinations, qualifications, discretionary verbs and the hypothetical label were checked after edits. FAQs preserve the corresponding body conditions.

## Final structural checks and counts

Parsed all frontmatter with the existing PyYAML installation. Verified exact field order, three FAQs, `audience: ["el"]`, internal author provenance, date/category patterns, 3–5 substantive H2 headings, no body H1 or bold, and the required sources ending. Title lengths are 63/64/57 characters; SEO titles 49/42/42; summaries 134/146/147. Each article uses a different permitted image (I03, I01, I12) with a translated description and caption. No restricted contact details or unverified service languages appear.

Every official URL linked in body prose also appears in that article's sources list. Internal column links resolve to the two new Greek slugs or the existing Greek 009 slug; none points to the excluded Korea-oriented slugs. New slugs were checked for collisions across all repository language directories and are unique.

Body counts below measure visible main text including substantive headings and table cell text, excluding frontmatter and the `Πηγές` section. Markdown link destinations, heading markers, table delimiters and separator rows are removed; whitespace is normalized to single spaces. Words are whitespace-separated visible tokens. Characters are Unicode characters including the normalized spaces. Full-file figures are also supplied to remove ambiguity.

| File | Body words | Body characters | Full-file whitespace words | Full-file Unicode characters |
|---|---:|---:|---:|---:|
| `drafts/el/855-greek-shipowner-arbitral-award-taiwan-enforcement.md` | 821 | 5,725 | 1,123 | 9,284 |
| `drafts/el/856-greek-exporter-taiwan-unpaid-olive-oil-invoices.md` | 791 | 5,457 | 1,171 | 10,458 |
| `drafts/el/857-greek-professionals-taiwan-work-permit-residence.md` | 786 | 5,627 | 1,147 | 9,912 |

These counts are within the brief's 650–950-word body target. No independent native-Greek or lawyer review is claimed.
