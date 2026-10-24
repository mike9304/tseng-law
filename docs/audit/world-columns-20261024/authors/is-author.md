# Icelandic author note — 849–851

Checked and written on 24 October 2026. Locale: `is`. Assignment retained: 849 P-WORK, 850 L-TRAFFIC, 851 B-INV. These are AI-authored drafts and an author self-check; no lawyer review or native-speaker review is claimed.

## Reading and scope

Read `briefs/BRIEF.md`, `briefs/ASSIGNMENTS.md`, `briefs/IMAGE-MENU.md`, `repo/docs/columns/EDITORIAL-VOICE.md`, `repo/docs/columns/FRONTMATTER.md`, `repo/docs/columns/TRAFFIC-COLLECTION.md`, `rules/SENTENCE-VARIETY-RULE.md`, and `rules/LESSONS.md`. Read the shared sentence-variety rules and lessons and `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`. The separately requested `/Users/son7/agent-library/knowledge/editorial-voice.md` was absent; the full repository editorial voice was available and applied. The user's abolition of automatic Fable orchestration supersedes legacy delegation/review clauses. No subagents were used.

Read existing Icelandic columns 008, 014 and 016 in full. Read the assigned structural sources: P-WORK en/705, en/704, en/706, en/352; L-TRAFFIC en/003, en/611, th/662; B-INV en/354, fr/674, es/689, hi/669, th/663. Their legal issue structure was useful; their older promotional, first-person, broad nationality or deadline wording was not imported.

Read `research/country-facts.md`, including its source register, version qualifications, seven fact families and unresolved-fact list. The large ledger's repeated cells and `<br>` entries were also read with exact duplicates removed, preserving every distinct text entry. Iceland's relevant rows were inspected in their table context. Only its verified visa/working-holiday findings were used, with independent BOCA verification of entry conditions. The driving-licence and land-reciprocity rows remain unverified and were not used as affirmative or negative rules.

All task writes were confined to `drafts/is/` and this note. No repository edits, git operations, installation, publication or contact with third parties was performed. The three images are distinct, exact entries I12, I23 and I01 from the supplied menu. Alt text translates only the menu descriptions; each caption discloses an illustration. The snapshot has no `repo/public/` directory, so image-binary existence and visual rendering could not be checked locally. Menu matching is not reported as image inspection.

## Statute-check method and effective dates

Every one of the 39 distinct statute/article pairs appearing in the drafts was printed and read through the supplied `tools/law.py`. Titles, article text and amendment banners were checked. The script's default cache path is outside the user's author-only write boundary. It was therefore executed unchanged with `runpy`; only the expansion of its exact cache pathname was redirected to `drafts/is/.law-cache`. No source script was edited. Temporary fetched HTML was removed after checks; the checked excerpts and official URLs are retained below.

Reproducible invocation pattern, using the desired pcode and article list:

```python
import os, runpy, sys
from pathlib import Path
cache = Path('drafts/is/.law-cache').resolve()
cache.mkdir(parents=True, exist_ok=True)
original_expanduser = os.path.expanduser
os.path.expanduser = lambda p: (
    str(cache) if p == '~/tseng-world-columns-20261024/html'
    else original_expanduser(p)
)
sys.argv = ['tools/law.py', 'N0090001', '43']
runpy.run_path('tools/law.py', run_name='__main__')
```

Checked sets: N0090001: 43; A0030295: 4, 5, 9, 15, 16; D0080132: 22; K0040012: 62; G0390060: 13, 27; C0000001: 284, 287; C0010001: 236-1, 237, 238; B0000001: 127, 128, 129, 130, 132, 184, 193, 197, 217, 736, 737; B0000007: 20, 36; B0010001: 70, 508, 509, 511, 515, 516, 519, 521, 522, 523, 526.

The Civil Code and Road Traffic Management and Penalty Act carried pending-amendment banners. The Civil Code banner identified 166-1 (commencement not set) and the 2026-08-17 amendment to 1223 (six months after promulgation). The traffic banner identified 18-1(6), 35(6)/(13), 92-2 and the 2026-08-17 amendments to 21, 21-1, 35, 67, 73, 85-2 and 85-3. None is cited in these drafts. Article 62 and all cited Civil Code provisions are outside those pending lists. The other cited laws displayed no pending banner. The 2025-09-24 foreign-professionals amendment was additionally checked against the [NDC commencement announcement](https://www.ndc.gov.tw/nc_14813_39648), which states implementation from 1 January 2026. Each article's source section explicitly dates the account to 24 October 2026 and provisions then in force.

Icelandic statute names are descriptive translations. The official Chinese law titles and pcodes below identify the actual enactments; they are not Icelandic legislation.

## 849 — Icelandic professional with a Taiwan job offer

File: `drafts/is/849-icelandic-professional-taiwan-work-permit-residence.md`.

Reader and trigger: an Icelandic passport holder has a job offer and proposed start date, possibly travelling with a spouse and children. The immediate issue is whether the first workday, entry route and lawful stay line up.

Country fit: the professional/family reader profile is an editorial hypothesis from the assignment, not a claim about migration volumes. BOCA expressly lists Iceland for a stay of up to 90 days without a visa. Iceland is absent from the complete MOFA working-holiday partner table reproduced in the verified ledger. This makes the distinction between an ordinary short visit, employer-sponsored work and a Gold Card useful. No Icelandic working-holiday route or general prohibition on Icelanders working is inferred.

New angle and overlap: existing 008 explains employment termination and 014 minimum-service clauses, while the assigned English sources supply work/residence structure. This draft follows an Icelandic offer-holder from the proposed start date through entry, direct ARC application and separate family applications. The internal link to `/is/columns/taiwan-mandatory-employment-period` supplies contract context without re-explaining severance or minimum service. It does not link the excluded Korea-oriented columns.

### Claim → checked source

| Claim used | Official source | Original-language excerpt checked / qualification |
|---|---|---|
| Work generally requires the employer's permit application and approval unless law provides otherwise. | 就業服務法 [43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | 「除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。」 Offer or filing acknowledgment alone is not described as permission. |
| Ordinary, special and senior foreign professionals are different categories. | 外國專業人才延攬及僱用法 [4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=4) | 「一、外國專業人才：指得在我國從事專業工作之外國人。」; 「三、外國高級專業人才：指入出國及移民法所定為我國所需之高級專業人才。」 The full special-professional definition and professional-work list were also read. |
| Employer normally applies to MOL; specified teaching work goes to MOE. | Same Act [5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=5) | 「除本法另有規定外，應檢具相關文件，向勞動部申請許可」; 「應檢具相關文件，向教育部申請許可。」 The teaching proviso's referenced categories were checked; the draft says specified teaching work, not all teaching. |
| Eligible special professionals may apply for a four-in-one Gold Card, valid one to three years. | Same Act [9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=9) | 「工作許可、居留簽證、外僑居留證及重入國許可四證合一之就業金卡」; 「前項就業金卡有效期間為一年至三年」。 This is an application route, not an entitlement based on nationality. |
| Spouses of special/senior professionals with approved dependent residence may apply directly to MOL; work permission cannot outlast that residence. | Same Act [15(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=15) | 「外國特定專業人才及外國高級專業人才之配偶，經內政部移民署許可在我國依親居留者，得逕向勞動部申請許可」; 「該工作許可期間不得逾其依親居留期間。」 Ordinary professional spouses are not silently included. |
| Eligible professional entrants with work permission or exemption may apply directly to NIA; eligible family members have a separate direct application route. | Same Act [16(1)–(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | 「以免簽證或持停留簽證入國，經許可或免經許可在我國從事專業工作者，得逕向內政部移民署申請居留」; family sponsor: 「外國專業人才在我國從事專業工作及外國特定專業人才」; relatives: 「其配偶、未成年子女及因身心障礙無法自理生活之成年子女」。 Sponsor residence/permanent residence, entry route and NIA approval are retained. |
| Entry with residence permission normally triggers a 30-day ARC application period, counted from the day after entry; integrated ARC documents have an exception. | 入出國及移民法 [22(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) | 「應於入國後之翌日起算三十日內，向移民署申請外僑居留證」; 「或其他已含有外僑居留證功能之證件者，得免申請外僑居留證」。 The draft does not make this a universal visitor conversion deadline. |
| Iceland's ordinary-passport visa exemption, six-month passport validity, confirmed onward/return travel, inspection and next-day counting. | [BOCA visa-exempt entry](https://www.boca.gov.tw/fp-149-4486-7785a-1.html) | Original English checked: “Iceland”; “at least six months as of the date of entry”; “starts from the day after arrival and is not extendable.” Read the full requirements and exceptions; 90-day country list membership was checked directly. |
| No current Iceland working-holiday program listed. | [MOFA partner table](https://youthtaiwan.mofa.gov.tw/workingholidayen/cp.aspx?n=6426) | Verified ledger's complete table names Canada, UK, Belgium, Ireland, France, Germany, Luxembourg, Austria, Poland, Czech Republic, Slovakia, Hungary, Korea, Japan, Australia, New Zealand, Netherlands and suspended Israel. Iceland is absent. This is explicitly a list-membership finding; the table's count, not its inconsistent introductory total, was used. |
| Gold Card does not need prior employment sponsorship. | [Official Gold Card overview](https://goldcard.nat.gov.tw/en/about/) | “Applicants can apply online without sponsorship.”; “You don’t need to have already secured a job in Taiwan.” Qualifications still require assessment. Unrelated tax benefits on this page were not imported. |
| Entry-route limits, overseas-document authentication, possible authenticated/notarized Chinese translation, and timely departure if ARC is not obtained. | [NIA residency guidelines](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news), updated 2026-04-14 | Read points 4 and 7(1), 7(8). English excerpts: “verified by the overseas missions or notarized by a domestic notary public”; “shall leave the State within the prescribed period”. Trial-exemption and restrictive-visa exceptions are not presented as Iceland-specific bans. |

### First-two-paragraph deletion test

Sentence labels refer to the final prose, with link markup omitted here.

| Sentence | Keep/cut and reason |
|---|---|
| P1.1 “Má íslenskur ríkisborgari byrja í nýju starfi á Taívan meðan atvinnuleyfið er enn í vinnslu?” | Keep: concrete start-date question, nationality and pending-application fact. |
| P1.2 “Samkvæmt 43. gr. laga um vinnumiðlun má útlendingur almennt ekki vinna þar án leyfis sem vinnuveitandi hefur sótt um, nema lög heimili annað.” | Keep: sourced answer with the statutory exception. |
| P1.3 “Undirritað atvinnutilboð nægir því ekki.” | Keep: applies the rule to the offer the reader actually holds. |
| P2.1 “Fyrir brottför frá Íslandi þarf að liggja fyrir hvaða fyrirtæki ræður þig, hvert starfið er og hvaða heimild á að ná yfir það.” | Keep: identifies information needed for preparation, rather than general travel background. |
| P2.2 “Berðu fyrirhugaðan fyrsta vinnudag saman við gildistíma leyfisins.” | Keep: gives the comparison that resolves the opening question. |
| P2.3 “Geymdu staðfestinguna sjálfa ásamt samningnum; tölvupóstur um að umsókn hafi verið send segir aðeins hvar ferlið stendur.” | Keep: distinguishes the evidence of permission from an application-status email. |

No generic introduction was written; none of these final six sentences was cut. Their distinct functions were checked rather than counting a cosmetic deletion as improvement.

### Comparison with three existing Icelandic columns

| Existing column | Opening, headings, ending difference in 849 |
|---|---|
| 008 `taiwan-labor-severance-law` | Replaces its broad explanatory/first-person framing with the pending-permit question. Uses four route/family headings rather than repeated evidence reminders. Ends on two dates to show the employer, without a lawyer persona or general rights recap. |
| 014 `taiwan-mandatory-employment-period` | Avoids a dense definition-led opening and an extended numbered sequence. Links that separate contract issue once. Ends with the actual work/stay calendar rather than a disclaimer/signature. |
| 016 `taiwan-inheritance-custody-analysis` | Avoids an inventory of general family problems and a preview of the whole article. Family content is confined to the professional's dependants and their documents. No generic family-law conclusion. |

Dropped or excluded for lack of verification: any Iceland-specific Gold Card success rate, salary shortcut, working-holiday entitlement, guaranteed processing time, automatic work rights for every dependant, a rule that a pending ARC application extends stay, and claims about Icelandic document legalization law. No demand or migration statistics were invented.

## 850 — Accident records after returning to Iceland

File: `drafts/is/850-icelandic-traveller-taiwan-accident-return-home.md`.

Reader and trigger: a traveller injured in a Taiwan car/scooter accident is returning to Iceland before all police records or the extent of treatment are known. Police pickup authority, continuing medical evidence and different time limits become the immediate concerns.

Country fit: this traveller profile is an explicitly labelled editorial hypothesis from the assignment; no claim is made about accident frequency among Icelanders or flight routes. The local adaptation is a Taiwan-to-Iceland treatment timeline, original TWD/ISK costs and arrangements to obtain documents after departure. No Icelandic health-insurance entitlement, Icelandic procedural rule or licence recognition is asserted.

New angle and overlap: existing 003 supplies general Taiwan accident context; en/611 supplies evidence discipline, and th/662 supplies injury/insurance structure. This draft centres the return-home evidence gap and prevents the police-record schedule, complaint deadline, tort limitation and insurance claim from being merged. Internal link: `/is/columns/taiwan-traffic-accident-procedure`.

### Claim → checked source

| Claim used | Official source | Chinese excerpt checked / qualification |
|---|---|---|
| Diagram/photos requests after seven days; preliminary analysis after 30; online system requires police attendance plus injury/death; nonparty pickup requires authorization. | [NPA accident-record application instructions](https://tm2.npa.gov.tw/NM105-505ClientRWD2/TM01A01Q_01.jsp) | 「事故七日後」; 「事故三十日後」; 「委託書」。 Read all of items 1–2, including the application number and identity-document requirements. These are request thresholds, not guaranteed delivery dates. |
| Drivers must aid/handle/report an injury or fatal accident and preserve vehicles/traces; the all-party-consent exception for injury cases requires marking and moving vehicles out of traffic. | 道路交通管理處罰條例 [62(3)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=62) | 「應即採取救護措施及依規定處置，並通知警察機關處理，不得任意移動肇事汽車及現場痕跡證據」; 「但肇事致人受傷案件當事人均同意時，應將肇事汽車標繪後，移置不妨礙交通之處所。」 Both mandatory duties and the exception are retained. |
| Intentional/negligent unlawful infringement can establish tort compensation liability. | 民法 [184(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=184) | 「因故意或過失，不法侵害他人之權利者，負損害賠償責任。」 No automatic award merely because an accident happened. |
| Bodily/health injury can involve diminished earning capacity and increased living needs. | 民法 [193(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=193) | 「喪失或減少勞動能力或增加生活上之需要時，應負損害賠償責任。」 Records are preparation advice, not a promise that each expense is recoverable. |
| Court may reduce or remove damages for the injured person's contributory fault in causing/increasing loss. | 民法 [217(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=217) | 「損害之發生或擴大，被害人與有過失者，法院得減輕賠償金額，或免除之。」 “Getur” preserves discretion. |
| Compulsory motor insurance's accident definition concerns passengers/outside third parties; benefits are injury medical costs, disability and death. | 強制汽車責任保險法 [13](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0390060&flno=13), [27](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0390060&flno=27) | 「致乘客或車外第三人傷害或死亡之事故」; 「一、傷害醫療費用給付。二、失能給付。三、死亡給付。」 Thus no promised rental-car repair benefit or automatic own-driver cover in a single-vehicle crash. No benefit caps are stated. |
| Negligent injury is a complaint-dependent offence. | 中華民國刑法 [284](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=284), [287](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=287) | 「因過失傷害人者」; 「第二百七十七條第一項、第二百八十一條及第二百八十四條之罪，須告訴乃論。」 The draft addresses negligent injury, not negligent death or every traffic offence. |
| Six-month complaint period starts when an eligible complainant knows the offender. | 刑事訴訟法 [237(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=237) | 「其告訴應自得為告訴之人知悉犯人之時起，於六個月內為之。」 It is not dated automatically from the accident, medical completion or flight home. |
| General tort claim: two years from knowledge of damage and liable person; ten years from tort. | 民法 [197(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=197) | 「自請求權人知有損害及賠償義務人時起，二年間不行使而消滅，自有侵權行為時起，逾十年者亦同。」 The draft does not apply this automatically to an insurer claim; paragraph 2's unjust-enrichment route is not described or denied. |
| A complaint agent does not remove possible personal-attendance requirements. | 刑事訴訟法 [236-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=236-1) | 「告訴，得委任代理人行之。但檢察官或司法警察官認為必要時，得命本人到場。」 No promise of unrestricted departure or wholly remote completion. |
| Settlement compromises disputed rights and extinguishes waived rights. | 民法 [736](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=736), [737](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=737) | 「互相讓步，以終止爭執或防止爭執發生之契約」; 「使當事人所拋棄之權利消滅及使當事人取得和解契約所訂明權利之效力」。 Interim payment and final release wording should be distinguished. |
| Complaint withdrawal before first-instance argument closes bars a new complaint by the withdrawer. | 刑事訴訟法 [238](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=238) | 「告訴人於第一審辯論終結前，得撤回其告訴。」; 「撤回告訴之人，不得再行告訴。」 No claim that settlement automatically withdraws a complaint. |
| Civil litigation agents need special authorization to settle. | 民事訴訟法 [70(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=70) | 「但捨棄、認諾、撤回、和解、提起反訴、上訴或再審之訴及選任代理人，非受特別委任不得為之。」 This is expressly limited to the civil-litigation representative, not every possible administrative agent. |

### First-two-paragraph deletion test

| Sentence | Keep/cut and reason |
|---|---|
| P1.1 “Þrjátíu dagar þurfa að líða frá umferðarslysi áður en hægt er að óska eftir frummati lögreglu, samkvæmt upplýsingasíðu lögreglunnar á Taívan.” | Keep: one official timing fact establishes the return-home problem. |
| P1.2 “Ferðamaður á leið aftur til Íslands getur því þurft að skipuleggja gagnaöflun eftir heimkomu.” | Keep: applies that timing to this reader, without inventing a flight or promising travel permission. |
| P1.3 “Afhendingarumboð getur sparað nýja ferð.” | Keep: introduces the concrete pickup arrangement explained below, with “can” rather than a guaranteed saving. |
| Earlier P1.3 “Flugdagurinn og rannsóknin fylgjast ekki að.” | Cut/replaced: repeated the timing implication but supplied no document or action. |
| P2.1 “Á vettvangi slyss með meiðslum eða dauðsfalli ber ökumanni samkvæmt 62. gr. laga um viðurlög vegna umferðarlagabrota að grípa til björgunarráðstafana, sinna lögboðnum viðbrögðum og tilkynna lögreglu.” | Keep: immediate driver duties, with the injury/death trigger and source. |
| P2.2 “Ekki má færa ökutæki eða ummerki að geðþótta.” | Keep: preservation duty that the following exception qualifies. |
| P2.3 “Við meiðslaslys mega aðilar þó allir samþykkja að ökutækin séu færð úr umferð eftir að staða þeirra hefur verið merkt; þá skal gera það.” | Keep: consent is unanimous, injury-only condition retained, marking precedes movement, and movement is mandatory once the proviso applies. |
| Earlier P2.4 “Brottfararáætlun bíður meðan brýn aðstoð er veitt.” | Cut: admonitory restatement of the emergency duty, not additional legal information. |

### Comparison with three existing Icelandic columns

| Existing column | Opening, headings, ending difference in 850 |
|---|---|
| 008 `taiwan-labor-severance-law` | Opens with a single police-record timing rather than a broad problem announcement or lawyer story. Four headings follow pickup, Iceland treatment, time limits and settlement. Ends on the first post-return medical appointment. |
| 014 `taiwan-mandatory-employment-period` | Avoids definition-first prose and a numbered checklist. One question heading and three concrete subject headings do not repeat its heading pattern. Contact information is followed by a case-specific sentence, not a signature/disclaimer close. |
| 016 `taiwan-inheritance-custody-analysis` | Does not preview many legal topics or create general family scenarios. The evidence chain stays with one returning traveller. The final sentence connects two sets of treatment records rather than summarizing the law. |

Dropped or excluded for lack of verification: Icelandic IDP recognition and licence-exchange rights (ledger is expressly unverified); Icelandic health-system reimbursement; guaranteed collection of all records before departure; an assertion that a preliminary police analysis conclusively allocates civil liability; automatic freedom to leave Taiwan; guaranteed handling entirely through an agent; and insurer deadlines or benefit amounts not separately verified.

## 851 — Icelandic export invoice with a disputed balance

File: `drafts/is/851-icelandic-exporter-taiwan-unpaid-shipment-invoice.md`.

Reader and trigger: an Icelandic small exporter has shipped goods, received only part of the price and encountered a defect/set-off allegation from a Taiwanese buyer. The reader needs to reconcile the balance before choosing a collection procedure.

Country fit: small exporter is an editorial hypothesis, not verified market demand. The opening is expressly fictional in its first sentence. EUR payment, ISK bookkeeping and a disputed deduction are scenario facts, not a claim that Icelandic exporters generally trade in euros or must keep a particular form of accounts. No seafood, machinery, industry volume or bilateral trade statistic is invented. Icelandic-law analysis is referred to counsel in Iceland if that law governs.

New angle and overlap: the assigned B-INV columns supplied the choice-of-law → limitation → payment-order → attachment issue structure. This draft begins with an exporter reconciling mixed-currency documents and separates bookkeeping conversion from the contractual balance. Existing Icelandic company/logistics columns address establishment, not this creditor's existing sale. The internal link to new column 849 is limited to staff visiting the buyer for on-site work; it does not imply that a Taiwanese company must be established to collect a debt.

### Claim → checked source

| Claim used | Official source | Chinese excerpt checked / qualification |
|---|---|---|
| Party choice governs contractual formation/effect; absent valid express choice, closest connection applies, including the characteristic-obligation presumption. | 涉外民事法律適用法 [20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20) | 「其成立及效力，依當事人意思定其應適用之法律」; 「依關係最切之法律」; 「負擔該債務之當事人行為時之住所地法，推定為關係最切之法律」。 Taiwan buyer address alone is not treated as conclusive. |
| Limitation follows the law governing the underlying legal relationship. | Same Act [36](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=36) | 「請求權之消滅時效，依該請求權所由發生之法律關係所應適用之法律。」 No foreign limitation period is invented. |
| If Taiwan law applies, certain merchants'/manufacturers'/craftsmen's goods-price claims have a two-year limitation. | 民法 [127(8)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=127) | 「因二年間不行使而消滅」; 「八、商人、製造人、手工業人所供給之商品及產物之代價。」 Not generalized to every invoice or service contract. |
| Limitation starts when the claim can be exercised, usually the due date in this sale scenario. | 民法 [128](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=128) | 「消滅時效，自請求權可行使時起算。」 “Usually” preserves the need to examine the actual payment terms. |
| Demand can interrupt limitation; specified procedures have the same effect as suit. | 民法 [129](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=129) | 「一、請求。二、承認。三、起訴。」; 「左列事項，與起訴有同一效力」, including payment-order, mediation and arbitration applications. The article does not promise that any email is a legally sufficient demand. |
| Demand interruption is treated as nonexistent without timely suit/equivalent action within six months. | 民法 [130](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=130) | 「若於請求後六個月內不起訴，視為不中斷。」 Repeated reminders are not portrayed as indefinite preservation. |
| Withdrawal, rejection or loss of payment-order effect can undo the application-based interruption. | 民法 [132](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=132) | 「若撤回聲請，或受駁回之裁判，或支付命令失其效力時，視為不中斷。」 Draft connects this to non-service, while separately explaining timely-objection conversion under CPC 519. |
| Payment orders may be sought for a specified monetary demand. | 民事訴訟法 [508](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=508) | 「以給付金錢或其他代替物或有價證券之一定數量為標的者，得聲請法院依督促程序發支付命令。」 Draft describes the money subset, not an exhaustive list of all statutory subjects. |
| Unperformed reciprocal performance, foreign service or publication service excludes this procedure. | Same Code [509](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=509) | 「如聲請人應為對待給付尚未履行，或支付命令之送達應於外國為之，或依公示送達為之者，不得行之。」 The exclusion is based on service/performance, not the creditor's foreign nationality. |
| Application needs parties, demand, facts, performance particulars where relevant, request/court and a prima facie showing. | Same Code [511](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=511) | 「當事人及法定代理人」; 「請求之標的及其數量」; 「請求之原因事實。其有對待給付者，已履行之情形」; 「債權人之請求，應釋明之。」 Draft says “among other things”, not a closed filing checklist. |
| General three-month non-service lapse, counted from issuance. | Same Code [515(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=515) | 「發支付命令後，三個月內不能送達於債務人者，其命令失其效力。」 Read paragraph 2's special erroneous-finality-certificate mechanism; do not suggest every exceptional case is exhausted by the short overview. |
| Debtor can object within 20 days after service without reasons. | Same Code [516(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=516) | 「得於送達後二十日之不變期間內，不附理由向發命令之法院提出異議。」 Both service trigger and absence of a reasons requirement are retained. |
| Timely valid objection causes loss of order effect within its scope and converts the application to suit/mediation. | Same Code [519(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=519) | 「支付命令於異議範圍內失其效力，以債權人支付命令之聲請，視為起訴或聲請調解。」 Partial objection is not described as automatic loss of the entire order. |
| Without timely valid objection, order may be an enforcement title. | Same Code [521(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=521) | 「未於法定期間合法提出異議者，支付命令得為執行名義。」 Not described as a merits judgment with guaranteed recovery or proof of assets. |
| Provisional attachment can preserve enforcement of a monetary claim. | Same Code [522](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=522) | 「債權人就金錢請求或得易為金錢請求之請求，欲保全強制執行者，得聲請假扣押。」 It is an application to preserve assets, not payment. |
| Attachment requires risk that later enforcement will be impossible or very difficult. | Same Code [523(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=523) | 「非有日後不能強制執行或甚難執行之虞者，不得為之。」 Ordinary nonpayment is not treated as proof of that risk. |
| Claim and attachment grounds require a prima facie showing; security is discretionary and can be required despite adequate evidence. | Same Code [526(1)–(3)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=526) | 「請求及假扣押之原因，應釋明之」; 「法院得定相當之擔保」; 「請求及假扣押之原因雖經釋明，法院亦得命債權人供擔保後為假扣押。」 Offering security is not a guarantee of approval; no fixed percentage is invented. |

### First-two-paragraph deletion test

| Sentence | Keep/cut and reason |
|---|---|
| P1.1 “Íslenskt smáfyrirtæki sendir vörur til kaupanda á Taívan, fær hluta kaupverðsins í evrum og bíður eftir afganginum (skáldað dæmi).” | Keep: goods, partial payment, currency and both parties are concrete; fictional status appears in this sentence. |
| P1.2 “Kaupandinn vísar til galla í sendingunni.” | Keep: supplies the actual defence, so the example is not a bare overdue bill. |
| P1.3 “Í bókhaldi seljandans birtist eftirstöðin í krónum, en tölvupóstarnir nefna mismunandi frádrátt.” | Keep: establishes the reconciliation problem without making an Icelandic accounting-law claim. |
| P1.4 “Fyrsta verkefnið er að gera eina rekjanlega kröfuyfirlitstöflu.” | Keep: names the useful output of reconciliation. |
| P2.1 “Taflan tengir hvern reikning við pöntun, afhendingargögn, samþykktan gjaldmiðil, gjalddaga, greiðslur og umdeildan frádrátt.” | Keep: specifies the evidence relationships the table must show. |
| P2.2 “Reikningsnúmer er ekki nóg.” | Keep: short bridge from invoice identification to debtor identification; does not replace the detailed evidence sentence. |
| P2.3 “Nafn taívanska fyrirtækisins á kínversku og skráningarnúmer þess hjálpa til við að greina kaupandann frá flutningsaðila eða tengdu fyrirtæki sem tók við vörunni.” | Keep: identifies concrete counterparty evidence and a practical recipient/obligor distinction. |
| Earlier P2.4 “Sá munur skiptir máli þegar ákveða þarf gegn hverjum krafan beinist.” | Cut: merely restated why the preceding debtor-identification sentence mattered. |

### Comparison with three existing Icelandic columns

| Existing column | Opening, headings, ending difference in 851 |
|---|---|
| 008 `taiwan-labor-severance-law` | Uses one explicitly fictional exporter document problem, not a lawyer's purported client history. Headings name currency, governing law, payment-order opposition and endangered assets. Ends on the missing link between balance, due date and buyer. |
| 014 `taiwan-mandatory-employment-period` | Avoids a definition-led opening and long numbered sequence. Only one heading is a question; the rest identify this sale's issues. The close asks for a specific missing fact rather than repeating a general disclaimer. |
| 016 `taiwan-inheritance-custody-analysis` | Replaces the broad issue catalogue with one shipment and a disputed balance. There is no multi-country legal survey or advance article outline. The final question returns to the opening documents. |

Dropped or excluded for lack of verification: Icelandic export-volume/industry claims, a presumption that all Iceland–Taiwan sales use Taiwan law, Icelandic limitation periods, automatic recognition of an Icelandic judgment, a universal two-year invoice deadline, a universal attachment-security percentage, guaranteed payment-order speed and any claim that a successful application proves collectable assets.

## Editorial corrections and meaning preservation

| Article / problem wording | Reason | Revision | Meaning preserved? |
|---|---|---|---|
| 849: one link labelled “4. og 5. gr.” pointed only to article 4. | A reader could not inspect the distinct application rule at the labelled article. | Separate article-4 and article-5 labels/links. | Yes; both propositions remain, with exact citations. |
| 849: “Þegar viðeigandi sérfræðingur …” in the family paragraph. | “Appropriate professional” hid the ordinary-professional work condition and the special-professional category. | State both sponsor categories, the ordinary professional's work condition, residence status and NIA approval. | Legal meaning made more exact; no broader eligibility retained. |
| 850: “Flugdagurinn og rannsóknin fylgjast ekki að.” and “Brottfararáætlun bíður …” | Repetition and an admonitory sentence added no document or rule. | First replaced by pickup authorization's practical use; second deleted. | Yes; official request timing and emergency duties remain. |
| 850: “Frummatið kemur síðar í ferlinu.” | Repeated the opening's 30-day point. | Deleted. | Yes; request timing remains in opening and FAQ. |
| 850: a long sentence combined saving original videos, timestamps and provenance. | Three useful instructions were compressed into one rhythm. | “Geymdu frumskrár myndskeiða.” followed by timestamp/provenance sentence; explain that a clip can omit the lead-up. | Yes; all evidence tasks remain. |
| 850: “leigubíll” used for a rental vehicle. | In Icelandic that word normally denotes a taxi. | “bílaleigubíll” in body and FAQ. | Intended rental-car meaning corrected; inaccurate taxi wording not preserved. |
| 851: “Í skálduðu dæmi …” at the start. | Stock hypothetical opener, despite a necessary fictional label. | Start with the exporter and put “(skáldað dæmi)” within the first sentence. | Yes; fictional status and all scenario facts remain. |
| 851: “kaupverðskrafa” after “á” in an early draft. | Incorrect inflection and cumbersome legal phrasing. | “kröfu seljanda um kaupverð” in FAQ; explicit claim-holder categories in body. | Yes, with the statute's goods-price scope clarified. |
| 851: adjacent short general cross-border introduction and article-20 definition. | Uniform sentence lengths and duplicated setup. | Join the concrete Icelandic/Taiwanese contract context to the sourced formation/effect rule. | Yes; valid express choice and closest-connection fallback remain. |
| 851: “Ekki má heldur missa sjónar á birtingunni.” | Generic admonition. | “Hefur úrskurðurinn verið birtur?” | Yes; service event becomes the reader's concrete question. |
| All: external full stop after a link label ending in “gr.” | Rendered as a doubled period. | Remove only the extra period. | Yes; citation numbers, links and sentence meaning unchanged. |

MONOTONY findings resolved: 850's long evidence sentence was split without losing provenance; 851's repeated medium-length legal exposition was varied through a connected choice-of-law sentence and a concrete service question. No unresolved monotony rejection is concealed behind the automated results.

## Variety rule §5 self-check

The installed shared checker recognizes only Korean, Japanese, English and Traditional Chinese. It has no Icelandic tokenizer and defaults this directory to Korean. Therefore the requested shared command was run with explicit `--lang en` as a space-separated-language proxy, not presented as native Icelandic validation. Final command:

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check drafts/is/849-icelandic-professional-taiwan-work-permit-residence.md drafts/is/850-icelandic-traveller-taiwan-accident-return-home.md drafts/is/851-icelandic-exporter-taiwan-unpaid-shipment-invoice.md --lang en
```

All three returned `OK — no variety limit violated`; combined exit status 0, zero FAIL lines. Because its ASCII word counting splits accented Icelandic letters and it does not recognize `Heimildir`, the proxy figures are not used as Icelandic word counts.

| Article | Proxy sentences | Length CV | Very short share | Similar-length run share | Citation-ending share |
|---|---:|---:|---:|---:|---:|
| 849 | 47 | 0.535 | 0.170 | 0.022 | 0.000 |
| 850 | 49 | 0.487 | 0.082 | 0.043 | 0.000 |
| 851 | 50 | 0.601 | 0.120 | 0.042 | 0.000 |

Supplemental Unicode-aware measurement used only prose before `## Heimildir`, removed link destinations, recognized Icelandic capitals, protected nonterminal `gr.` plus `tölul.`/`sbr.`, and counted Unicode words with internal hyphens/apostrophes. Sentence boundaries were inspected around article numbers. It is an author measurement, not a certified Icelandic language model or external review.

| Article | Sentences | Length CV | Sentences ≤8 words | Similar-length triples | Max identical paragraph opening | Consecutive identical two-word starts | Body questions |
|---|---:|---:|---:|---:|---:|---:|---:|
| 849 | 52 | 0.488 | 0.308 | 0.020 | 2 | 0 | 2 |
| 850 | 51 | 0.480 | 0.235 | 0.082 | 1 | 0 | 0 |
| 851 | 53 | 0.468 | 0.189 | 0.039 | 2 | 0 | 2 |

1. All numeric hard thresholds passed in the shared proxy and the applicable supplemental Unicode measures. Citations occur inline rather than in closing parenthetical blocks. No paragraph contains two sentences of 32 or more Unicode words.
2. Opening types are distinct: 849 a pending-permit question; 850 one official timing fact; 851 a single marked fictional document scenario. Only one of three is a scene. The fiction label is inside the first sentence, not a stock introductory announcement.
3. Each has more than two very short, substantive sentences. No consecutive block of long sentences was retained merely to meet a count.
4. No word opens three prose paragraphs. Identical consecutive two-word sentence starts: zero in all three.
5. No three-paragraph “claim + closing statute + caveat” pattern. Each draft has practical, nonlegal preparation paragraphs without unnecessary citations. Consequential legal propositions keep their official links.
6. No repeated “not X but Y” template. Ordinary legal negatives retain necessary scope and exceptions. There are no rebuttals to invented reader beliefs.
7. Final prose is specific: start/stay dates for 849; the Iceland follow-up appointment for 850; the missing balance/due-date/buyer connection for 851. Required contact information is placed before these endings.
8. Icelandic register was checked by the author for terminology and inflection, not certified by a native speaker. No bold, fabricated first-person lawyer experience, public author footer, imperative checklist heading or sales close appears. The zero body-question count in 850 is deliberate: its official timing opening and evidence sequence already carry the decision, and the pickup question is in a heading; an artificial question was not added for a score.
9. The final edit retained all statutory numbers, time-limit triggers, conditional language, source links and the fictional label. FAQ conditions were compared with their body paragraphs: no automatic work/dwelling right, request timing not promised delivery, injury-insurance scope not property cover, Taiwan limitation conditional on applicable law, and attachment not automatic on security.

## Counts and final checks

Counting convention: Markdown frontmatter excluded; link labels retained and destinations removed; heading/bullet markers removed; whitespace normalized to one space. “Main body” includes the four section headings and excludes the `Heimildir` section. Character counts include those single spaces. “Prose only” also excludes headings. “All body” includes the localized source section but still excludes frontmatter/FAQ metadata.

| File | Main-body words | Main-body characters | Prose-only words | All-body words | All-body characters |
|---|---:|---:|---:|---:|---:|
| `849-icelandic-professional-taiwan-work-permit-residence.md` | 703 | 4,997 | 678 | 768 | 5,412 |
| `850-icelandic-traveller-taiwan-accident-return-home.md` | 718 | 4,904 | 691 | 785 | 5,313 |
| `851-icelandic-exporter-taiwan-unpaid-shipment-invoice.md` | 750 | 5,232 | 731 | 810 | 5,553 |

Programmatic checks passed for YAML parsing and exact field order, dates, category, topic, audience/internal author, title/SEO/summary lengths, three FAQs, tag counts, four substantive H2s plus sources, no H1/bold, contact links, unique country-specific slugs, valid Icelandic internal-link targets, full body-official-URL coverage in source lists, and distinct exact image-menu paths. Each prose-only count is within 650–950 words. All 39 cited statute/article pairs occur in the law.py-fetched official text. The traffic article includes `traffic-accidents` and `traffic-evidence`.

Final draft SHA-256 values:

```text
849 435ec8687670d1b0cd29bdf68925acfad985ff29a156d0ca072d2871d838a9cd
850 4d3e9a69dbeb0f9f302ce039d807b9f581780639f6c9bbdcf77b91caf91ab5d1
851 0947ab01127e014ff30358c7b70e92737e6b8fc7c7d48cd1dd2ce4664007c2d8
```

Limits: no site build, publishing check, local image inspection, native-speaker review or licensed-lawyer review was performed. The user requested isolated drafts, and the provided repository snapshot lacks its public image tree. These limitations do not change the checked statute excerpts or the exact supplied image-menu selections.
