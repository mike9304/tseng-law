# Serbian author record — 891–893

Research and drafting date: 24 October 2026. Locale: `sr`, Serbian Latin script and ekavian usage. Deliverables are local drafts, not a publication. File writes in this run are restricted to the three manuscripts in `drafts/sr/` and this note. No git, installation, publication, repository changes, other-locale edits or newly written law caches.

## Assignment, reading and evidence limits

Read `briefs/BRIEF.md` and `briefs/ASSIGNMENTS.md` in full. The Serbian row assigns 891–893 to P-WORK, B-INV and L-POLICE. None of the recommended topics was replaced.

Required editorial reading: `repo/docs/columns/EDITORIAL-VOICE.md`, `repo/docs/columns/FRONTMATTER.md`, `rules/SENTENCE-VARIETY-RULE.md`, `rules/LESSONS.md`, `briefs/IMAGE-MENU.md`, the Serbian rows and evidence qualifications in `research/country-facts.md`, and the full Serbian 008, 014 and 016 articles. The two local rule files are byte-for-byte identical to the required `/Users/son7/tseng-lanes-shared/` versions. Also read `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`; its linked `~/agent-library/knowledge/editorial-voice.md` is absent. The current repository voice file explicitly named by the batch brief supplied the operative text. Legacy Fable gates and older contact/byline instructions were superseded by the user's current instructions and this brief.

Structural source articles read in full:

- 891: English 705 `taiwan-visa-residence-work-study-family`, 704 `taiwan-arc-first-application`, 706 `taiwan-arc-renewal-changes-reentry`, and 352 `hiring-in-taiwan-without-local-entity-eor-pe-work-permits`.
- 892: English 354 `unpaid-invoices-taiwan-buyer-payment-order-attachment`; French 674 `france-exporter-taiwan-unpaid-invoices-credit-notes-returns`; Spanish 689 `spain-exporter-taiwan-unpaid-invoices`; Hindi 669 `indian-supplier-unpaid-taiwan-invoice`; Thai 663 `thai-supplier-taiwan-buyer-unpaid-invoice`.
- 893: English 033 `taiwan-police-questioning-foreigner-rights`; Italian 688 `italian-business-visitor-taiwan-summons-interpreter-defense`; English 644 `taiwan-criminal-exit-ban-foreign-defendant-temporary-travel`.

The structural sources were drafting aids, not substitutes for current statute checks. Their older public bylines, addresses, phone numbers, generic openings and differing metadata were not copied. The internal author remains `legal-ai-assistant`. No attorney or human native-speaker review is claimed.

The tseng-law editorial skill supplied separate read-only AI research, Serbian editorial review and final legal/source review roles. Reviewer findings are recorded below; only the author changes these four files. The claude-mem observer reported `Claude Code reported the observer as signed out`; the canonical task state was nevertheless updated with the available work-state tool. No durable personal-memory update was requested or made.

## Country evidence and reader fit

| Article | Reader and trigger | Country fit and evidence status | Overlap and new angle |
|---|---|---|---|
| 891 | Serbian passport holder with a Taiwan professional job offer, choosing an entry route and arranging a move with family. | BOCA's complete visa-exempt nationality list omits Serbia; MOFA's working-holiday partner table also omits it. These are explicit list-membership inferences, not claims excluding every special entry route. BOCA's Serbia page expressly directs inquiries to Budapest. Demand for this particular service is a hypothesis, not measured search volume. | Existing Serbian 008/009/014 concern employment rights and departure; 001/018 contain business/work context. This article handles the Serbian passport, Budapest inquiry, employer authorization, individual Gold Card route, ARC trigger and a spouse's separate work permission. |
| 892 | Serbian frozen-fruit exporter whose Taiwanese buyer withholds invoice amounts and alleges cold-chain problems. | Taiwan's official 26 April 2023 Serbia trade profile, page 7, lists `冷凍果實` among imports from Serbia. This is historical product evidence, not a 2026 ranking. The shipment and dispute are expressly hypothetical. There is no claim about Serbian exporters' typical conduct or dispute frequency. | None of the 18 Serbian shared columns is a dedicated unpaid-invoice guide. The new angle connects shipment temperature and warehouse records with accepted quantity, contested deductions, governing law, limitation, service on the Taiwanese debtor and asset preservation. It does not decide a food-safety or defective-goods claim. |
| 893 | Serbian visitor or resident receives a Chinese police/prosecutor document before a planned return to Serbia and cannot confidently give a detailed account in Chinese. | Reader/trigger hypothesis. No evidence was found of unusually frequent Serbian police cases, and no such claim is made. Taiwan procedural status and actual language comprehension determine the relevant safeguards; nationality is not described as creating special criminal rights. | Serbian 003 addresses accidents, and 012 overtaking liability. This article starts with document labels and separates witness/suspect attendance, interpretation, transcript corrections, refusal to testify and a distinct departure restriction. It does not reproduce the first-24-hours guide or the foreign-defendant court anecdotes. |

Official country sources checked:

| Claim | Official URL | Text or scope checked |
|---|---|---|
| No ordinary nationality-based exemption listed for Serbia | [BOCA visa exemption](https://www.boca.gov.tw/fp-149-4486-7785a-1.html), page dated 17 July 2026 | Complete eligibility lists checked; Serbia absent. Absence does not exclude a separately established conditional route or a different passport. |
| Serbia inquiries go to Budapest | [BOCA Serbia entry](https://www.boca.gov.tw/sp-foof-countrycp-01-202-6687c-2.html) | `Country: Serbia`; `Please contact Taipei Representative Office, Budapest, Hungary`. No unsupported claim that every application must be lodged personally there. |
| No Serbian working-holiday program listed | [MOFA inbound partner table](https://youthtaiwan.mofa.gov.tw/workingholidayen/cp.aspx?n=6426) | Serbia absent from the full table. Researcher fetched readable HTML via curl; web-tool access failed. No partner count quoted because the introduction and suspended-Israel row need different treatment. |
| Frozen fruit has a documented bilateral trade connection | [BOFT Serbia profile, 26 April 2023](https://www.trade.gov.tw/Files/PageFile/732206/732206egs3020230427104531.pdf), p. 7 | Taiwan imports list includes `洗滌製劑、玻璃器、調製動物飼料、電動機及發電機、腳踏車零組件、新橡膠氣胎、菸及菸葉、成衣、冷凍果實`. Researcher read the complete PDF text; screenshot request failed. |
| Corroboration of Taiwan imports from Serbia, not used as a manuscript statistic | [MOFA Serbia profile](https://www.mofa.gov.tw/CountryInfo.aspx?CASN=1&n=164&s=96&sms=33) | `我自該國輸入：13,223,889美元（2023年資料）`. No current-volume or growth claim drawn from it. |

Observed search evidence was limited: the researcher's `Tajvan viza državljani Srbije Budimpešta posao` query surfaced Serbian visa/travel material and an older visa discussion; invoice and police queries mostly returned unrelated Serbian customs/legal content and the firm's Serbian pages. These results are not evidence of search volume, conversions or demand. No such quantities were invented.

## Statute verification method and effective dates

Before drafting any statutory statement, ran the actual `tools/law.py` for the following groups. A wrapper first asserted that the existing `html/<PCODE>.html` file existed and exceeded 5,000 bytes, so the script used its established cache without creating or changing it. The script's Chinese title, provision and banner output were read in full.

```text
python3 tools/law.py N0090001 43 46 48
python3 tools/law.py A0030295 4 5 9 15 16 33
python3 tools/law.py D0080132 22
python3 tools/law.py B0000007 20 36
python3 tools/law.py B0000001 127 128 129 130
python3 tools/law.py B0010001 508 509 510 511 515 516 519 521 522 523 526
python3 tools/law.py C0010001 27 41 43-1 71 71-1 75 93-2 93-5 95 99 100-2 175 178 180 181 183 192 196-1 245
```

Then fetched every one of these seven laws anew from the official `LawAll.aspx?pcode=...` endpoint into memory using curl, parsed each article and compared the Chinese text with the corresponding cached text. All substantive provisions selected for the articles matched; none returned `NOT FOUND`. No live responses were saved to a cache. Additional background provisions checked but not cited in the articles are distinguished from the claim tables below.

- Civil Code (`B0000001`) displayed `!!! 部分條文尚未生效`. The [official history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001) identifies the pending provisions as article 166-1, with commencement undetermined, and the 17 August 2026 amendment to article 1223, effective six months after promulgation. Neither is used. Articles 127–130 were compared against the live text and are not those pending amendments. Article 892 explicitly dates its effective-law statement to 24 October 2026.
- The [foreign-professional statute history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295) records the 18 November 2025 Executive Yuan commencement order: the revised act generally entered into force on 1 January 2026; the specified part of article 4(4)(4), and articles 28–29, on 30 June 2026. Both dates precede the check date. No pending measure is presented as operative.
- The [Immigration Act history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=D0080132) places revised article 22 in the group effective 1 January 2024.
- The [criminal-procedure history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=C0010001) shows the latest 13 May 2026 amendment concerned article 101-1. The delayed 2019 exit-restriction and 2020 interpretation provisions are already effective by the check date. No uncommenced text was used.
- The MOJ database displays a consolidation cutoff of 16 October 2026. This note records what the official source supplied when checked on 24 October, not a guarantee that an unpublished or not-yet-consolidated development cannot exist.

### 891 — claim-to-source table

| Manuscript claim | Checked source | Chinese excerpt checked / scope |
|---|---|---|
| Employer permission must actually be obtained, unless an exception applies | [Employment Service Act, article 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | `除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。` The phrase is not reduced to merely filing an application. |
| Professional-work categories and specialist status are statutory categories | [Foreign Professionals Act, article 4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=4) | `外國專業人才：指得在我國從事專業工作之外國人。` / `具有…特殊專長` / `專業工作：指下列工作`. No blanket eligibility based on a job title or a Serbian degree. |
| Employer application ordinarily goes to MOL; specified teaching categories go to MOE | [Article 5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=5) | `除本法另有規定外…向勞動部申請許可` / `但…向教育部申請許可`. Exception retained. |
| Gold Card is a direct application, four permissions in one, one-to-three-year validity | [Article 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=9) | `得逕向內政部移民署申請核發具工作許可、居留簽證、外僑居留證及重入國許可四證合一之就業金卡` / `有效期間為一年至三年`. Approval, not entitlement, and separate eligibility retained. |
| First ARC after residence admission: 30 days from the next day; combined-document exception | [Immigration Act, article 22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) | `入國後之翌日起算三十日內` / `其他已含有外僑居留證功能之證件者，得免申請外僑居留證`. Not applied to every visitor or every residence application. |
| Qualifying professional admitted on a visitor visa may apply directly for residence after work authorization/exemption | [Foreign Professionals Act, article 16(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | `以免簽證或持停留簽證入國，經許可或免經許可…從事專業工作者，得逕向…申請居留；經許可者，發給外僑居留證。` The manuscript uses the visitor-visa branch relevant to a Serbian passport. |
| Specified family members of qualifying approved resident professionals may apply | [Article 16(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | `經…許可居留或永久居留者，其配偶、未成年子女及因身心障礙無法自理生活之成年子女` / entry requirements / `經許可者，發給外僑居留證`. No general sponsorship right for parents or all adult children. |
| Specialist/senior professional's spouse with approved dependent residence may apply directly for work permission | [Article 15(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=15) | `外國特定專業人才及外國高級專業人才之配偶，經…許可…依親居留者，得逕向勞動部申請許可` / `該工作許可期間不得逾其依親居留期間`. Approved dependent residence belongs to the spouse. A separate permit is required. |
| Overseas professional resident-visa checklist and remaining employment over six months | [BOCA professional-worker resident visas](https://www.boca.gov.tw/cp-166-276-48430-2.html) | Official English page: passport, application, photographs, original/copy work approval; remaining employment on the permit must be more than six months at resident-visa application. Not a universal rule for all visa categories. |
| Gold Card does not require a prearranged job or employer sponsorship | [Official Gold Card description](https://goldcard.nat.gov.tw/en/about/) | `Applicants can apply online without sponsorship` and open work-permit description. No fee, guaranteed processing time, tax entitlement or permanent-residence promise copied from the page. |
| NIA categories and entry restrictions must be checked before relying on in-country residence | [NIA guide, updated 14 April 2026](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) | Specific eligible categories and excluded entry arrangements; the draft does not claim every visitor can convert or that a filing receipt grants work/residence. |

### 892 — claim-to-source table

| Manuscript claim | Checked source | Chinese excerpt checked / scope |
|---|---|---|
| Contract law choice; closest connection absent an effective express choice | [Choice-of-law Act, article 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20) | `依當事人意思定其應適用之法律` / `無明示之意思或…無效時，依關係最切之法律`. Characteristic-performance presumptions remain acknowledged; Taiwan buyer location alone is insufficient. |
| Limitation follows the law of the underlying legal relationship | [Article 36](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=36) | `請求權之消滅時效，依該請求權所由發生之法律關係所應適用之法律。` No assertion of Serbian limitation law. |
| Two years for specified goods-price claims if Taiwan law applies | [Civil Code, article 127(8)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=127) | `因二年間不行使而消滅` / `商人、製造人、手工業人所供給之商品及產物之代價`. Not extended to every commercial debt. |
| Start when the claim can be exercised | [Article 128](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=128) | `消滅時效，自請求權可行使時起算。` Each invoice's proved maturity matters. |
| Demand, acknowledgment and suit interrupt; listed steps have suit-equivalent effect | [Article 129](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=129) | `一、請求。二、承認。三、起訴。` / `聲請發支付命令` / `聲請調解或提付仲裁`. No assertion that every buyer reply is an acknowledgment. |
| Demand interruption is undone absent suit within six months | [Article 130](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=130) | `若於請求後六個月內不起訴，視為不中斷。` Article 129 suit-equivalent steps retained in body and FAQ. |
| Payment order available for a specified monetary sum | [Code of Civil Procedure, article 508](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=508) | `給付金錢或其他代替物或有價證券之一定數量…得聲請…支付命令`. Draft selects the money branch. |
| Applicant must state cause, amount and performance; preliminary showing needed | [Article 511](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=511) | `請求之原因事實。其有對待給付者，已履行之情形` / `債權人之請求，應釋明之。` No claim that an invoice alone establishes the debt. |
| Unperformed counter-performance, overseas service or public-notice service exclude this procedure | [Article 509](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=509) | `對待給付尚未履行` / `送達應於外國為之` / `依公示送達為之者，不得行之`. The creditor's Serbian location is not equated with service on the debtor abroad. |
| Failure to serve within three months after issuance defeats the order | [Article 515(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=515) | `發支付命令後，三個月內不能送達於債務人者，其命令失其效力。` The exceptional mistaken-finality-certificate rule is not used. |
| Debtor may object without reasons within 20 days after service | [Article 516](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=516) | `送達後二十日之不變期間內，不附理由…提出異議`. Issuance and service are not conflated. |
| Valid timely objection removes effect to the contested extent and continues as suit/mediation | [Article 519](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=519) | `於異議範圍內失其效力` / `視為起訴或聲請調解`. |
| Unopposed order supplies an enforcement title; debt-nonexistence suit remains possible | [Article 521](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=521) | `未於法定期間合法提出異議者，支付命令得為執行名義` / `主張…債權不存在而提起確認之訴`. No res judicata or guaranteed-recovery claim. |
| Monetary attachment route | [Article 522](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=522) | `就金錢請求或得易為金錢請求之請求，欲保全強制執行者，得聲請假扣押。` |
| Future nonexecution or serious execution difficulty required | [Article 523](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=523) | `非有日後不能強制執行或甚難執行之虞者，不得為之。` Ordinary late payment is not presented as automatic proof. |
| Preliminary showing of both claim and attachment grounds; creditor security may be required | [Article 526](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=526) | `請求及假扣押之原因，應釋明之` / `雖經釋明，法院亦得命債權人供擔保`. May remains discretionary; security is not a guaranteed substitute for absent grounds. |

### 893 — claim-to-source table

| Manuscript claim | Checked source | Chinese excerpt checked / scope |
|---|---|---|
| Formal accused-person summons, including investigation-stage prosecutor summons | [Code of Criminal Procedure, article 71](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=71) | `傳喚被告，應用傳票` / `於偵查中由檢察官簽名`. `被告` is not rendered as proof of conviction or necessarily an indictment. |
| Formal witness summons has its own specified content | [Article 175](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=175) | `傳喚證人，應用傳票` / `待證之事由` / `應到之日、時、處所`. |
| Police suspect notice: lawful notice plus unjustified nonattendance may lead to requested warrant | [Article 71-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=71-1) | `經合法通知，無正當理由不到場者，得報請檢察官核發拘票。` All conditions and discretionary force retained. |
| Formal accused-person summons and unjustified nonattendance | [Article 75](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=75) | `被告經合法傳喚，無正當理由不到場者，得拘提之。` |
| Properly summoned witness without just cause may be fined up to NT$30,000 and brought in | [Article 178](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=178) | `經合法傳喚，無正當理由而不到場者，得科以新臺幣三萬元以下之罰鍰，並得拘提之` / fine `由法院裁定之`. Not a mandatory fine or general police-notice penalty. |
| Police witness notice does not import article 178 sanctions | [Article 196-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=196-1) | `得使用通知書通知證人到場詢問` / enumerated incorporated provisions omit article 178. Draft does not turn this distinction into a recommendation to ignore police. |
| Interpretation when language is not understood; written procedure when needed; other persons and special-law reservation | [Article 99](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=99) | `語言不通者，應由通譯傳譯之；必要時，並得以文字訊問或命以文字陳述` / `其他受訊問或詢問人準用之。但法律另有規定者，從其規定。` Advance notice is organizational advice, not a precondition. |
| Defendant-questioning chapter applies to police suspects | [Article 100-2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=100-2) | `於司法警察官或司法警察詢問犯罪嫌疑人時，準用之。` |
| Interpretation provision applies to witness questioning | [Article 192](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=192) | `第九十九條…於證人之訊問準用之。` Police-witness incorporation is additionally through article 196-1. |
| Transcript read/provided for review; corrections requested are appended | [Article 41](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=41) | `朗讀或令其閱覽，詢以記載有無錯誤` / `請求將記載增、刪、變更者，應將其陳述附記於筆錄`. No promise that every request must replace the original wording. |
| Transcript rule applies to police inquiries | [Article 43-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=43-1) | `第四十一條、第四十二條…於…司法警察官、司法警察行詢問…準用之。` |
| Suspect/accused warnings, silence, defense, favorable evidence, qualified legal aid; pause after lawyer-selection statement unless consent to continue | [Article 95](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=95) | `犯罪嫌疑及所犯所有罪名` / `得保持緘默` / `得選任辯護人` / `得請求調查有利之證據` / `表示已選任辯護人時，應即停止訊問。但被告同意續行訊問者，不在此限。` No automatic free-lawyer entitlement for Serbian nationality. |
| Counsel may be chosen at police-investigation stage | [Article 27](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=27) | `被告得隨時選任辯護人。犯罪嫌疑人受司法警察官或司法警察調查者，亦同。` |
| Witness self-incrimination protection includes statutory relationships beyond simple close family | [Article 181](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=181) | `自己或與其有前條第一項關係之人受刑事追訴或處罰者，得拒絕證言。` Article 180 was also read in full to avoid incorrectly limiting the cross-reference to blood relatives. |
| Grounds must be made plausible; sworn substitute possible; prosecutor/court decides | [Article 183](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=183) | `應將拒絕之原因釋明之。但於第一百八十一條情形，得命具結以代釋明` / `偵查中由檢察官命令之，審判中由審判長或受命法官裁定之`. Police are not identified as the authority deciding under this article. |
| Direct exit restraint: serious suspicion, necessity, one listed ground, minor-penalty exclusion | [Article 93-2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=93-2) | `犯罪嫌疑重大` / `必要時` / `無一定之住、居所` or supported flight/evidence/collusion risk / `最重本刑為拘役或專科罰金…不得逕行限制之`. Distinction between short detention penalty and procedural detention retained with Chinese `拘役`. |
| Accused and counsel may request revocation/change | [Article 93-5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=93-5) | `被告及其辯護人得向檢察官或法院聲請撤銷或變更限制出境、出海。` No promise of approval, automatic vacation of a ban or right to skip an appearance. |

## Three Serbian comparator articles

All three files display 13 September 2025 as the original date. Their current `lastmod` values and concrete stylistic features differ:

| Comparator | Opening | Headings and ending | Effect on the new drafts |
|---|---|---|---|
| `repo/src/content/columns-sr/008-taiwan-labor-severance-law.md`; lastmod 2026-10-07 | Introduces a named lawyer and announces what the article explains; later uses a first-person client anecdote. | Long table, many single-line fragments, admonitory closing about protecting rights, then related links. | Kept only the exact category, date and reading-time conventions. No borrowed experience, Korean comparison, promotional warning or repetitive fragment layout. 891 opens with a Serbian-passport timing question. |
| `repo/src/content/columns-sr/014-taiwan-mandatory-employment-period.md`; lastmod 2026-07-25 | Dense definition followed by four preview questions and a paragraph about separating issues. | Eleven numbered sections, two long checklists, formal disclaimer and lawyer footer. | 891 uses four unnumbered issue headings and a narrow relocation decision; 892 uses the shipment/accounting chronology, not a taxonomy or repeated checklist. Public footer omitted. |
| `repo/src/content/columns-sr/016-taiwan-inheritance-custody-analysis.md`; lastmod 2026-10-11 | Broad family-death overview listing many interacting proceedings; previews a general sequence. | Eleven numbered sections and a preparation list; long disclaimer and named-lawyer footer. | 893 starts with concrete Chinese document labels; its final sentence records interpretation language and appearance date. It does not open with a general explanation of Taiwan or end by recapping all rights. |

Cross-article openings are deliberately different: 891 a reader's timing question, 892 a specifically marked hypothetical shipment dispute, 893 a document-label explanation. One of three is a scene. Headings follow respectively migration sequence, invoice/limitation/service/assets, and procedural status/language/statement/travel. Endings point respectively to each family member's status table, the oldest invoice's proved maturity, and the confirmed language/appearance date. The one restrained contact paragraph in each is required by the brief; it does not replace the topic-specific ending.

## Opening deletion test and unsupported claims

The deletion test was repeated after the independent Serbian editorial repairs. It asks whether each opening sentence adds a fact, legal condition or usable preparation detail, not whether it can be made shorter at the cost of meaning.

| Article | Kept information in the first two paragraphs | Removed or avoided wording |
|---|---|---|
| 891 | Reader's signed-offer timing question; Serbian omission from the dated exemption list; appropriate visa and special-route caveat; actual permission requirement and exception; aligning the contractual start with approved status. | Deleted `Početak rada zahteva dodatnu proveru.` because the following statutory sentence already supplies the rule. Avoided a Taiwan-economy introduction, automatic Serbian visa-free entitlement, a promise of instant residence conversion, and invented Serbian-language consultations. |
| 892 | Explicitly hypothetical refrigerated shipment and disputed deduction; what the exporter still needs to establish; historical official product connection with its 2023 date. | Deleted `Taj istorijski podatak objašnjava izbor primera; ne pokazuje učestalost sporova.` as author-facing rationale and an unnecessary rebuttal. Deleted `Kod konkretnog potraživanja potrebno je povezati ugovor, fakturu i dokaze o toj pošiljci.` as a preview already supplied by the surrounding evidence discussion. |
| 893 | Chinese witness/accused labels and investigation-stage scope; formal summons distinction; issuing authority, procedural status, number and appearance date; envelope/transmission evidence; why a title-only translation is insufficient. | No generic warning that foreign visitors do not know the law; no imagined crime, presumed guilt, Serbian consular protection promise or guaranteed availability of a Serbian interpreter. |

Sentence-by-sentence retention record for the final first two paragraphs:

| Article / sentence | Retained sentence, identified by its wording | Information lost if deleted |
|---|---|---|
| 891 P1 S1 | `Možete li sa srpskim pasošem da otputujete na Tajvan čim potpišete ponudu za posao?` | Concrete timing question: signed offer versus lawful relocation. |
| 891 P1 S2 | `Srbija nije navedena na ... spisku ... proverenom 24. oktobra 2026.` | Country-specific source finding and check date. |
| 891 P1 S3 | `Zato plan dolaska mora da uključi odgovarajuću vizu, uz proveru eventualnog posebnog osnova ulaska.` | Practical consequence, while leaving special entry grounds open. |
| 891 P2 S1 | `Član 43 ... zabranjuje rad stranca bez dozvole koju poslodavac zatraži i dobije, osim kada postoji zakonski izuzetak.` | Actual approval requirement and exception; a job offer/application alone is insufficient. |
| 891 P2 S2 | `Dogovoreni datum u ugovoru zato treba uskladiti sa stvarno odobrenim statusom.` | The reader's concrete action before accepting a start date. |
| 892 P1 S1 | `Hladnjača na Tajvanu ... — to je hipotetički primer.` | Shipment, Serbia–Taiwan direction, unpaid portion, cold-chain objection and fictional marking. |
| 892 P1 S2 | `Izvoznik ima potvrdu isporuke, ali još treba da razjasni količinu ... osporeni iznos i dokument ...` | The evidence gaps that drive this particular claim. |
| 892 P2 S1 | `Smrznuto voće jeste navedeno ... u ... pregledu iz 2023. godine.` | Verified historical trade connection; avoids an ungrounded country/product substitution. |
| 893 P1 S1 | `Oznaka 證人 znači svedok, dok 被告 ... uključujući fazu istrage.` | Usable Chinese labels and distinction between procedural status and a later indictment/conviction. |
| 893 P1 S2 | `Članovi 71 i 175 ... razlikuju te formalne pozive ...` | Official basis for the two forms and their contents. |
| 893 P2 S1 | `Ako pred povratak u Srbiju dobijete dokument na kineskom, proverite ...` | Serbian return trigger plus issuer, role, case number and appointment. Rewritten from an awkward nominal construction without changing the action. |
| 893 P2 S2 | `Sačuvajte kovertu ili poruku kojom je stigao.` | Transmission evidence, distinct from the paper's contents. |
| 893 P2 S3 | `Prevod samo naslova ne pokazuje ... policijskom obaveštenju ili formalnom pozivu ...` | Practical warning against treating different procedural acts identically. |

Claims deliberately dropped for lack of adequate verified support or because they exceeded this assignment:

- Any Serbia-specific visa-free period, working-holiday quota, automatic work right, general permission to work remotely, or promised visa-processing time.
- A Serbian university degree's automatic recognition, a universal salary threshold for all professional categories, and automatic spouse work authorization.
- Current frozen-fruit trade rankings, shipment volumes, nonpayment rates, or cold-chain liability conclusions. Temperature records are suggested evidence, not a statutory rule deciding the buyer's deduction.
- Serbian limitation law, Serbia–Taiwan judgment reciprocity, tax-treaty relief, banking-reporting rules and foreign-law advice. Serbia tax-treaty, marriage, land and driving rows were not needed. Land reciprocity and driving recognition were marked unverified in the country ledger and were not asserted.
- A police telephone call's automatic equivalence to every formal summons, automatic sanctions for police witness notices, a witness's unrestricted right to silence, an automatic release clock, guaranteed free counsel or guaranteed permission to return to Serbia.

## Validation and review record

The prescribed command was run for all three drafts:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check drafts/sr/<file>.md
```

Each returned exit 2: `ERROR measurement unavailable: cannot infer language ...; supply --lang`. Repeating with explicit `--lang sr` also returned exit 2 because `sr` is not a supported choice. It was not relabeled as Croatian or English to manufacture a result. Consequently, the requested official zero-FAIL measurement cannot be claimed. Manual section 5 checks and clearly labeled supplemental measurements are recorded after the final edits.

An initial YAML check found Python's optional PyYAML absent. No package was installed. The existing system Ruby YAML parser successfully parsed all three frontmatter blocks. Initial checks confirmed exact field order, three FAQ entries, title/SEO/summary lengths, category, internal targets, no bold/H1 and complete external source-list coverage. Final values are recorded below after independent review.

Image paths exactly match the required image menu: I04 for 891, I01 for 892 and I19 for 893, with different images and translated descriptions/captions. The read-only snapshot has no corresponding files under `repo/public`; live GET checks on the three supplied `https://tseng-law.com/images/...` paths returned HTTP 404 with HTML bodies. These supplied paths were preserved as instructed. They require publisher-side asset verification before publication; this draft task did not authorize editing assets or replacing the menu. No successful image rendering or publication is claimed.

### Independent Serbian editorial review

Reviewer: `/root/sr_locale_review`, a separate AI reviewer who did not author these manuscripts and made no file writes. Initial result: REQUEST_CHANGES for 891 and 892; 893 locale PASS with optional wording improvements. Final bounded reread: PASS for all three hashes listed below.

Repairs applied:

- 891 article 15 FAQ/body now explicitly say the approved dependent residence belongs to the spouse, preserving both professional categories, permission to apply and the permit-duration limit.
- Deleted the generic second-paragraph lead-in from 891 and both dispensable sentences from 892's second paragraph, as recorded above.
- `MONOTONY: §5(4)` addressed: four `Za` paragraph starts in 891 became two; three in 892 became one. The revised 893 opening was balanced by changing another opening to `Kada`, leaving no first word more than twice.
- Removed 891's author-facing clause `ovde se procenjuje priprema statusa za početak rada`; changed 892 `privremeno zaplenjivanje` to the more idiomatic `privremena zaplena` without changing its provisional purpose.
- 893 interpretation FAQ now uses concrete Serbian wording; the document-reading sentence directly addresses the reader; the transcript paragraph asks for explanations of what is not understood.
- Varied sentence length through connected legal clauses and short practical sentences, without dropping the choice/default-law condition or the lawful-summons/unjustified-absence/discretionary-sanction conditions. The reviewer rechecked these additional changes and accepted them.

### Manual sentence-variety section 5 check

| Required check | 891 | 892 | 893 |
|---|---|---|---|
| 1. Prescribed automated measurement | Unavailable, exit 2, unsupported `sr`; no automated PASS | Same | Same |
| 2. Distinct opening; no stock hypothetical formula | Passport/start-date question | One marked hypothetical scene, label in first sentence | Chinese document labels; no invented event |
| 3. At least two short sentences; no successive long sentences | Examples: `Naziv radnog mesta nije dovoljan.` / `Uporedite ih sa ponudom.` | `Svaka faktura ima svoj red.` / `Osporene odbitke prikažite odvojeno.` One longer choice-of-law sentence followed by a short sentence. | `Zabeležite odgovor.` / `Nejasnu reč razjasnite tokom razgovora.` |
| 4. Paragraph openings varied | Maximum two of a first word; no identical adjacent sentence openings in supplemental segmentation | Maximum two; no identical adjacent sentence openings | Maximum two; one identical adjacent sentence opening pair |
| 5. No three repeated claim–citation–caveat paragraphs; citation-free practical paragraph present | Employment-document preparation and status calendar | Invoice rows and full correspondence | Scheduling/response and evidence preservation |
| 6. Contrast patterns at most three; no invented rebuttal | Conditions and exceptions do substantive work; no repeated not-X-but-Y template | Removed the trade-frequency rebuttal; no repeated rhetorical contrast template | Status and travel distinctions remain necessary; no repeated not-X-but-Y template |
| 7. Ending tied to article facts | One status/date row for every arriving family member | Oldest unpaid invoice and proof of maturity | Requested language and confirmed appointment before return |
| 8. Register and forbidden forms | Serbian Latin ekavian; no bold, public author footer, invented first-person experience or imperative checklist heading | Same | Same |
| 9. Legal meaning preserved | Spouse condition clarified; citations and 30-day starting point retained | Governing-law qualification, two-year/six-month rules, three-month service and 20-day objection retained | Proper notice, unjustified absence, discretionary fine and special witness rules retained |

Supplemental measurements are diagnostic only, not a Serbian implementation of the prescribed checker. Method: exclude frontmatter, source list and headings; replace Markdown links with visible labels; protect Serbian ordinal dates before sentence splitting at `.?!`; count whitespace-separated words, with a short sentence at eight words or fewer; CV is population standard deviation divided by the mean. Three-sentence runs count triples whose lengths all fall within 25% of their triple mean. This is not a claim of semantic equivalence across languages.

| Article | Sentences | Short sentences | Short share | CV | Similar-length triples | Maximum repeated paragraph opener | Body questions |
|---|---:|---:|---:|---:|---:|---:|---:|
| 891 | 49 | 12 | 24.5% | 0.471 | 10/47 (21.3%) | 2 | 2 |
| 892 | 47 | 9 | 19.1% | 0.459 | 6/45 (13.3%) | 2 | 1 |
| 893 | 50 | 12 | 24.0% | 0.452 | 13/48 (27.1%) | 2 | 1 |

Citation placement was checked manually: statutory subject/front-of-sentence links, inline explanatory links and occasional parenthetical references are mixed; no paragraph contains more than two successive sentence-final parenthetical citations. The majority of sentences do not end with a parenthetical citation. This assessment preserves, rather than removes, all consequential legal-source links.

### Final packaging measurements

System Ruby YAML parsing and the read-only packaging checks passed on these versions: exact 16 fields in the required order; three FAQs each; dates/audience/author/category correct; title, SEO and summary lengths within the requested ranges; four issue headings plus `## Izvori`; no body H1 or bold; 3–5 tags and `criminal-litigation` on 893; unique 4–9-word country-cued slugs; valid internal target files; all external body source URLs represented in the sources section. All 40 distinct cited statutory provisions are included in the checked source tables. The three distinct image choices match the supplied menu, subject to the separate live asset limitation above.

Body counts below include visible issue headings, practical closing and contact paragraph, exclude frontmatter and the sources section, replace links with visible labels, and normalize whitespace to a single space. Characters include spaces. The additional full Markdown column includes every original character, including frontmatter, URLs and line breaks.

| File | Body words | Body characters | Body plus sources words / characters | Full Markdown words / characters | SHA-256 |
|---|---:|---:|---:|---:|---|
| `drafts/sr/891-serbian-professional-taiwan-work-permit-residence.md` | 728 | 5,019 | 809 / 5,561 | 1,093 / 9,569 | `caacb03586383f0cb09ba8e78ecfce533b5e0d2a61d2189707d9dbe186f608bb` |
| `drafts/sr/892-serbian-fruit-exporter-taiwan-unpaid-invoices.md` | 719 | 4,774 | 802 / 5,293 | 1,086 / 10,006 | `e018fa70eb2d555a6a81f9001ab4524749398175df792d42b47f27c87817d0cb` |
| `drafts/sr/893-serbian-resident-taiwan-police-summons-interpreter.md` | 766 | 5,121 | 841 / 5,572 | 1,102 / 10,172 | `414615469efb5e69152bece69909c74696ef83b44576d4e5d473dea016149952` |

Frontmatter lengths (title / SEO title / summary, Unicode characters): 891 = 56 / 49 / 144; 892 = 58 / 46 / 150; 893 = 54 / 42 / 157. Reading-time convention is `5 min čitanja`; display date is `24. oktobra 2026.`.

### Independent final legal/source review

Reviewer: `/root/sr_final_legal_review`, a separate AI reviewer who did not author these manuscripts and made no manuscript or cache writes. Final disposition: PASS for 891, PASS for 892 and PASS for 893 at the exact frozen hashes in the table above. No material legal/factual defect or mandatory style finding remains within this review's scope. The reviewer independently reproduced the body counts of 728 / 5,019, 719 / 4,774 and 766 / 5,121 words / characters.

The reviewer reran all 40 cited statutory provisions through `tools/law.py` after asserting that the required caches already existed, then compared them against fresh official LawAll responses. All normalized texts matched. Commencement histories were checked; the pending Civil Code articles 166-1 and 1223 are not used. The reviewer also fetched and extracted page 7 of the historical official trade PDF, confirming `冷凍果實`, and checked the BOCA Serbia/Budapest and visa-exemption pages, working-holiday partner table, Gold Card and NIA pages, and live firm contact/services pages. FAQ conditions, opening deletions, manual rhythm checks and the three Serbian comparators were accepted.

This is independent AI editorial and legal-evidence review, not human legal certification or publication authority. The official database displayed a consolidation cutoff of 16 October 2026 when checked on 24 October 2026; the verification does not assert the absence of later unpublished developments. The prescribed checker independently returned exit 2 because Serbian is unsupported, so no automated zero-FAIL result is claimed. The three required image URLs returned HTTP 404 and still require publisher-side asset verification. No publication or successful production rendering is claimed.
