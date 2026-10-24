# Polish author work note — 24 October 2026

## Scope and status

Completed author drafts for the assigned row `pl`: 870 B-SETUP, 871 P-WHV, 872 B-INV. No topic substitution. These are author drafts, not a claim of publication, lawyer review, human native-speaker review or independent editorial approval. No git, installation, publication or messages to third parties were used. Writes were confined to `drafts/pl/` and this file. Temporary statute caches were routed inside `drafts/pl/` rather than the tool's default shared `html/` directory, then removed after the citation ledger and final checks were completed.

The required shared variety command was run on all three drafts. It returned exit 2 because it cannot infer Polish; explicitly passing `--lang pl` also returned exit 2, listing only `ko, ja, en, zh-hant, th, id, hi, fr, de, it, es, pt, ar, vi`. This is unavailable measurement, not a PASS or “zero FAIL” certification. Section 5 was also checked manually. Supplementary Polish sentence-length calculations are described below and do not replace the unsupported official check. The global tool was not modified or run with a false language label.

`research/country-facts.md` was absent when the prerequisite reads were performed. No unverified or in-progress row was used. Poland-specific facts came from the Taiwanese official sources listed below.

## Required material read

- `briefs/BRIEF.md`, `briefs/ASSIGNMENTS.md`, `briefs/IMAGE-MENU.md`, all in full.
- `repo/docs/columns/EDITORIAL-VOICE.md` and `repo/docs/columns/FRONTMATTER.md`, in full.
- `rules/SENTENCE-VARIETY-RULE.md` and `rules/LESSONS.md`, in full. Their contents were also compared with the required `/Users/son7/tseng-lanes-shared/` originals and found identical.
- `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, in full. Its additional canonical target `/Users/son7/agent-library/knowledge/editorial-voice.md` was missing; the brief's explicitly designated, available repository house style was used. Historical Fable references were not reinstated.
- Three Polish comparators, in full: `008-taiwan-labor-severance-law.md`, `009-taiwan-voluntary-resignation-severance.md`, `015-taiwan-company-setup-pitch-location.md` under `repo/src/content/columns-pl/`. All display 13 September 2025; lastmod is 7 October 2026 for 008 and 10 September 2026 for 009 and 015. These are the brief's same-locale comparison samples, not a claim of checking three live recent publications.
- B-SETUP structural sources, in full: `columns-en/004-taiwan-company-subsidiary-vs-branch.md`, `columns-en/001-taiwan-company-establishment-basics.md`, `columns-es/656-taiwan-one-shareholder-limited-company-director.md`, `columns-en/507-taiwan-investor-company-records-access.md`.
- P-WHV structural source, in full: `columns-fr/654-taiwan-working-holiday-visa-work-insurance-tax.md`.
- B-INV structural sources, in full: `columns-en/354-unpaid-invoices-taiwan-buyer-payment-order-attachment.md`, `columns-fr/674-france-exporter-taiwan-unpaid-invoices-credit-notes-returns.md`, `columns-es/689-spain-exporter-taiwan-unpaid-invoices.md`, `columns-hi/669-indian-supplier-unpaid-taiwan-invoice.md`, `columns-th/663-thai-supplier-taiwan-buyer-unpaid-invoice.md`.
- Applied author-side standards from `tseng-law-editorial/SKILL.md` and its `references/review-criteria.md`. The shared `variety/MULTILINGUAL-METHOD.md` and the tool's routing were read to diagnose the missing Polish profile. This assignment was kept within the author role; no self-check is labelled an independent review.

## Verification method and current-law status

Every statute article cited in a draft was retrieved through the unchanged `tools/law.py` implementation. Since its cache directory is hard-coded outside the assigned write area, the script was executed with `runpy.run_path`, with only `os.path.expanduser('~/tseng-world-columns-20261024/html')` redirected to `drafts/pl/.law-cache`. The source-fetching, article parser and output were unchanged. The `sys.argv` article groups were:

```text
tools/law.py J0080001 1 7 98 99 371 372 386
tools/law.py J0080001 3 380
tools/law.py J0040002 3 7 8 9
tools/law.py N0090001 43
tools/law.py N0090027 4
tools/law.py L0060001 9
tools/law.py G0340003 7 71 71-1
tools/law.py B0000007 20 36
tools/law.py B0000001 127 128 129 130 132
tools/law.py B0010001 508 509 511 515 516 519 521 522 523 526
```

The unused Income Tax Act articles 71 and 71-1 were checked during research but not cited in the draft, which leaves filing-date advice to the actual tax status and departure facts.

The tool reported these titles and current amendment dates: 公司法, 26 December 2025; 外國人投資條例, 19 November 1997; 就業服務法, 20 January 2025; 雇主聘僱外國人許可及管理辦法, 30 December 2025; 全民健康保險法, 28 June 2023; 所得稅法, 11 September 2026; 涉外民事法律適用法, 26 May 2010; 民法, 17 August 2026; 民事訴訟法, 29 November 2023. These are law-level amendment dates, not claims that every cited article changed then.

Two partial-commencement banners were resolved against official history pages:

- [Income Tax Act history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=G0340003): the pending provision is article 43-4, with commencement to be set by the Executive Yuan. The 11 September 2026 amendment concerns articles 17 and 126 and applies from 1 January 2026. Neither affects the cited article 7 residence definition.
- [Civil Code history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001): article 166-1 has an undetermined commencement date; the 17 August 2026 amendment to article 1223 takes effect six months after promulgation. The cited articles 127–130 and 132 are outside those changes. No pending inheritance provision was used. Articles 871 and 872 expressly state the 24 October 2026 applicability date in their source sections.

Direct opening of Invest Taiwan timed out and the SME startup FAQ returned HTTP 403 in the browser fetch. Their official-domain indexed text was retrievable through targeted web search. Only the visible comparison entry “Legal acts and liaison activities” and the explicit minimum-capital exception were used from those pages. Branch structure and remaining foreign-company liabilities were additionally anchored in `law.py` articles 3 and 380; no unobserved guidance was represented as read. The MOF Poland agreement announcement and both BOCA Poland pages were opened successfully.

## 870 — Polish company, first Taiwan operating presence

File: `drafts/pl/870-polish-company-taiwan-subsidiary-branch-office.md`.

Reader and trigger: the person responsible for a Polish company's first Taiwan sales/service presence, before a local lease, customer contract or capital remittance is committed. The practical decision is who will contract, receive money, employ staff and carry debts.

Country fit: a Polish parent and Taiwan operation have an actual income-tax agreement, officially confirmed as effective on 30 December 2016 and applicable from 1 January 2017. Demand for a concise Polish-language formation comparison is an editorial hypothesis, not measured search demand. No industry stereotype, market-size claim or invented firm experience is used. Polish registry documents are described as preparation material, not as a statement of Polish legal requirements or an authentication guarantee.

Overlap/new angle: generic Polish columns 001/004 already concern setup and organizational forms, but were not linked because the brief excludes them. The new piece follows the contracting party and payment recipient through an actual Polish-parent decision and substitutes the verified Poland agreement for Korea-specific tax material. It deliberately omits shareholder-inspection litigation from source 507. The existing 015 premises article is linked only for the separately scoped address issue.

### Claim → source ledger

| Claim in draft | Checked provision / official URL | Chinese text checked or evidence boundary |
|---|---|---|
| Taiwan subsidiary has separate legal personality | [Company Act 1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=1) | 本法所稱公司，謂以營利為目的，依照本法組織、登記、成立之社團法人。 |
| Limited company may have one member | [Company Act 98](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=98) | 有限公司由一人以上股東所組成。 |
| Foreign investor includes a foreign legal person | [Foreign Investment Statute 3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=3) | 本條例所稱外國人包括外國法人。 |
| Contribution limit, with the complete serious-abuse exception | [Company Act 99](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=99) | 以其出資額為限；股東濫用公司之法人地位，致公司負擔特定債務且清償顯有困難，其情節重大而有必要者，該股東應負清償之責。 |
| Branch is subordinate to the head office | [Company Act 3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=3) | 所稱分公司，為受本公司管轄之分支機構。 |
| Foreign company still pays debts left after Taiwan liquidation | [Company Act 380](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=380) | 應就其在中華民國境內營業所生之債權債務清算了結，未了之債務，仍由該外國公司清償之。 |
| Registration before operating in the foreign company's name | [Company Act 371](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=371) | 外國公司非經辦理分公司登記，不得以外國公司名義在中華民國境內經營業務。 |
| Representative office registration | [Company Act 386](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=386) | 未經申請分公司登記而派其代表人在中華民國境內設置辦事處者，應申請主管機關登記。 |
| Office activity compared with a branch's commerce | [Invest Taiwan comparison](https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus01?lang=eng&menuNum=7&search=InvestmentStatus01) | Official English table: representative office “Legal acts and liaison activities”; branch “General trading, domestic sales and manufacturing”. Not a statute quotation. |
| Investment application, plan and changed plan need approval | [Foreign Investment Statute 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=8) | 應填具投資申請書，檢附投資計畫及有關證件，向主管機關申請核准。投資計畫變更時，亦同。 |
| Prohibited/restricted industries remain separate | [Foreign Investment Statute 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=7) | 法律禁止投資之事業；限制投資之事業，應取得目的事業主管機關之許可或同意。 |
| Approved contribution must arrive on time; verification follows | [Foreign Investment Statute 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=9) | 應將所核准之出資於核定期限內全部到達；應向主管機關申請審定投資額。 |
| Capital certification by CPA | [Company Act 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=7) | 公司申請設立登記之資本額，應經會計師查核簽證。 No invented universal certification deadline was added. |
| No general minimum, subject to special licensing law | [MOEA startup capital FAQ](https://startup.sme.gov.tw/home/modules/faq/detial.php?sId=52) | 除許可法令特別規定外，公司申請設立時，最低資本額並不受限制。 |
| Branch operating funds and designated Taiwan responsible person | [Company Act 372](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=372) | 應專撥其營業所用之資金，並指定代表為在中華民國境內之負責人。 |
| Registration/investment is not itself work authorization | [Employment Service Act 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) | 除本法另有規定外，外國人未經雇主申請許可，不得在中華民國境內工作。 The exception is retained. |
| Poland income-tax agreement is in force; relief is income/residence-specific | [MOF entry-into-force announcement](https://www.mof.gov.tw/singlehtml/384fb3077bb349ea973e7fc6f13b6974?cntId=dot72864) | 於105年12月30日生效，自106年1月1日起適用；他方締約國居住者（含人民及企業）取得之各類所得。 No rate or treaty article was quoted. |

### Opening deletion test

- Kept “Czy umowę z tajwańskim klientem ma podpisać polska spółka, czy nowy podmiot zarejestrowany na Tajwanie?” It fixes the contracting-party choice before discussing registration labels.
- Kept “Tę decyzję warto podjąć, zanim w projektach najmu i zamówień pojawią się różne nazwy nabywcy.” It adds timing and the concrete documents affected; the noun was restored after deleting the redundant intervening sentence.
- Kept the second paragraph's actor map: order, invoice, employer and payee; its second sentence adds whether the Taiwan partner is to invest. These facts drive the choice of form.
- Cut “Przy planowaniu lokalnej sprzedaży, serwisu lub zespołu ta decyzja określa stronę przyszłych umów.” It merely explained the question already asked.
- Cut “Taki opis pozwala porównać formy obecności na podstawie rzeczywistych czynności.” It announced the usefulness of the preceding concrete preparation rather than adding a fact.

### Three-comparator review and ending

008 begins with a lawyer introduction and announced topic, uses a large comparison table and client narration, then rights-protection appeals. 009 refers back to a prior piece, proceeds through numbered statutory situations and ends on generalized timing advice. 015 opens with a Taipei restaurant caveat, uses many isolated lines and a question heading, and ends with an announcement that the explanation is over and a contact invitation. This draft instead begins with a contracting-party question, uses four substantive issue headings, continuous paragraphs of varying length, and closes on matching the contracting entity to the recipient of payment. No lawyer persona, Korea comparison, case anecdote or generic closing is copied.

Dropped/unverified: no universal claim that a Polish investor may own every regulated business; no guaranteed apostille/authentication route; no fixed registration/bank timeline; no work-permit capital threshold repackaged as minimum incorporation capital; no treaty dividend/royalty rates, automatic tax relief or conclusion on Polish taxation.

## 871 — Polish Working Holiday participant

File: `drafts/pl/871-polish-working-holiday-taiwan-six-month-work.md`.

Reader and trigger: a Polish national planning the budget for Taiwan Working Holiday, considering a temporary job or a later offer of ongoing employment. The mismatch between a possible year of travel and only six months of temporary work is the central decision.

Country fit: BOCA has specific Chinese and English Poland guidance. Both confirm Polish residence at application, the inclusive age band, no accompanying family, six-month temporary-work limit and no in-country visa change after entry. This is direct country evidence, not a generic French article with the nationality replaced. The size of the Polish young-professional audience and demand for legal help remain editorial hypotheses.

Overlap/new angle: existing Polish 008/009 cover employment separation and severance, not the Poland-specific program. The internal link to 009 is a related issue, not the source for visa or insurance assertions. The French structural source supplied the distinction between a visa deemed a work permit, visitor status, insurance and tax years. No Belgian or Canadian rule was imported as a Polish rule.

### Claim → source ledger

| Claim in draft | Checked provision / official URL | Chinese text checked or evidence boundary |
|---|---|---|
| Polish nationality and Polish residence when applying; ages 18–30 inclusive; one participation; no accompanying family | [BOCA Poland Chinese guidance](https://www.boca.gov.tw/cp-388-53-9d45e-1.html), also [official English](https://www.boca.gov.tw/cp-153-381-c7b09-2.html) | 申請時須為居住於波蘭之波蘭國民；申請時年齡介於18歲(含)至30歲(含)；未曾…來臺；未有配偶、受扶養親屬或攜帶孩童隨行。 |
| Passport issuance/blank pages/validity, tickets, initial funds, in-person application | [BOCA Poland English guidance](https://www.boca.gov.tw/cp-153-381-c7b09-2.html), checked against [Chinese](https://www.boca.gov.tw/cp-388-53-9d45e-1.html) | 不超過10年前核發；至少有2頁空白頁；預計離開臺灣日期算起…至少還有90天；由本人向駐波蘭代表處提出申請。 |
| Temporary work for at most six months, not six months per employer | [BOCA Poland Chinese guidance](https://www.boca.gov.tw/cp-388-53-9d45e-1.html) | 在臺停留期間得從事臨時性工作，且工作期間不得超過6個月。 No employer-reset entitlement appears; the draft does not invent one. |
| Specialized/technical work still needs Taiwan qualifications/registration | [BOCA Poland Chinese guidance](https://www.boca.gov.tw/cp-388-53-9d45e-1.html) | 應符合中華民國相關資格認定及執業證照登記等法令。 |
| Qualifying agreement visa deemed work permit; maximum one year | [Employment-permit regulations 4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=4) | 非以入國工作為主要目的之國際書面協定…入國簽證，視為工作許可；期限，最長為一年。 This ceiling does not displace Poland's shorter work limit. |
| Visa validity, entry stay and first-entry ceiling have different anchors | [BOCA Poland Chinese guidance](https://www.boca.gov.tw/cp-388-53-9d45e-1.html) | 效期：自核發日起算1年；每次入境…最長180天；屆滿前15日內…最多可再延長180天；首次入境日起算…最長不超過1年。 The annotation starts the entry stay the day after arrival. |
| Expired visa cannot be reused; no in-country change after entry | [BOCA Poland Chinese guidance](https://www.boca.gov.tw/cp-388-53-9d45e-1.html) | 因該簽證失效不得再憑以入境；入境後不得在中華民國境內申請改換其他事由之簽證。 |
| Whole-stay insurance includes work accidents, healthcare, hospitalization and medical repatriation | [BOCA Poland English guidance](https://www.boca.gov.tw/cp-153-381-c7b09-2.html), checked against [Chinese](https://www.boca.gov.tw/cp-388-53-9d45e-1.html) | 工作時意外傷害及醫療照護，含停留期間全程之醫療費用、住院費用及醫療後送。 |
| Working Holiday is a visitor visa category | [BOCA Poland Chinese guidance](https://www.boca.gov.tw/cp-388-53-9d45e-1.html) | 類別：多次入境之停留簽證。 The draft distinguishes this from residence documentation for NHI. |
| NHI requires residence documentation as well as one additional qualifying basis | [National Health Insurance Act 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=L0060001&flno=9) | 在臺灣地區領有居留證明文件，並符合下列各款資格之一者…一、在臺居留滿六個月。二、有一定雇主之受僱者。 The draft preserves AND between documentation and a qualifying basis and does not equate employment insurance with NHI. |
| For a person without Taiwan domicile, tax residence at 183 or more days in a tax year | [Income Tax Act 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340003&flno=7) | 在中華民國境內無住所，而於一課稅年度內…居留合計滿一百八十三天者。 |
| Tax year is January–December; short stays do not automatically exempt Taiwan wages | [MOF foreign-individual tax guidance](https://www.etax.nat.gov.tw/etwmain/alien-tax-service/alien-individual-income-tax/15r2N1n) | 同一課稅年度（1月1日至12月31日）；中華民國來源之扣繳所得，由扣繳義務人…就源扣繳。 |

### Opening deletion test

- Kept the six-month sentence: it states the decisive Poland-specific work restriction.
- Kept the linked BOCA distinction from the one-year first-entry ceiling: otherwise the reader could confuse employment and immigration limits.
- Kept the twelve-month salary-budget consequence: it converts the rule into the reader's planning problem.
- Kept the second paragraph's work/travel calendar and rent/transport/insurance during nonworking months: these identify specific spending periods.
- Cut “Sam kalendarz wyjazdu pokaże, czy dostępne oszczędności wystarczą na taki układ.” It repeated the purpose of the preceding budget preparation.

### Three-comparator review and ending

Against 008, the draft removes lawyer self-introduction, anecdotal client authority and admonitions about bad employers. Against 009, it stands alone instead of beginning “Jak wskazano wcześniej” and does not reproduce a statutory numbered list. Against 015, it avoids staccato line breaks, “na tym kończy się omówienie” and a repeated generic caution. Its opening is numerical, its headings mix a document/location phrase, one reader question and specific calendar/insurance issues, and its last body paragraph asks how the proposed job fits the actual remaining authorized time.

Dropped/unverified: no statement that a 31-year-old qualifies; no remaining annual quota count; no minimum EUR 30,000 insurance amount imported from a Polish page; no full-year employment permission; no six-month reset per employer; no automatic NHI, ARC or in-country conversion; no generalized tax exemption for fewer than 183 days; no Polish tax-return conclusion or current withholding-rate illustration. No claim is made about whether a particular visa application will be approved.

## 872 — Polish exporter with unpaid euro invoices

File: `drafts/pl/872-polish-exporter-taiwan-unpaid-euro-invoices.md`.

Reader and trigger: a Polish seller of machine parts facing a partially paid euro invoice and a buyer's demand to deduct repair costs, while the seller's internal accounting expresses the balance in złoty. The scene is expressly hypothetical in its first sentence. It is neither a client story nor evidence of a dominant Polish export sector or invoicing currency.

Country fit: the Polish supplier/euro contract/złoty ledger scenario is a labelled editorial hypothesis aimed at a concrete cross-border reconciliation problem. It does not rely on unverified trade volumes, a bilateral judgment-recognition rule or Polish prescription law. Poland-specific tax and working-holiday evidence supports the overall reader grouping in the other pieces; this piece's transaction facts remain hypothetical.

Overlap/new angle: the generic Polish 001–018 inventory contains setup, work, family, traffic and industry-entry topics, not a dedicated Polish-exporter collection piece. The new article links to its own batch's 870 for entity identity. The structural-source legal path is retained, but the opening and evidence preparation focus on contractual euro balances, internal złoty figures, partial payment and repair deductions. It omits promissory notes, interest arithmetic, fees, foreign-judgment recognition and inventory-return issues that would widen the short piece.

### Claim → source ledger

| Claim in draft | Checked provision / official URL | Chinese text checked |
|---|---|---|
| Party choice; otherwise closest connection and characteristic-performance presumption | [Conflict-of-laws Act 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20) | 依當事人意思定其應適用之法律；依關係最切之法律；負擔該債務之當事人行為時之住所地法，推定為關係最切之法律。 No automatic application of Taiwan law is asserted. |
| Prescription follows law governing the originating legal relationship | [Conflict-of-laws Act 36](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=36) | 請求權之消滅時效，依該請求權所由發生之法律關係所應適用之法律。 |
| Two years for specified merchant/manufacturer/craftsman goods-price claims | [Civil Code 127(8)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=127) | 因二年間不行使而消滅；八、商人、製造人、手工業人所供給之商品及產物之代價。 |
| Clock begins when claim can be exercised | [Civil Code 128](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=128) | 消滅時效，自請求權可行使時起算。 |
| Demand, acknowledgment, suit; payment-order application equivalent to suit | [Civil Code 129](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=129) | 一、請求。二、承認。三、起訴；與起訴有同一效力：一、依督促程序，聲請發支付命令。 |
| Demand interruption lost absent timely suit/equivalent action | [Civil Code 130](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=130) | 若於請求後六個月內不起訴，視為不中斷。 Equivalent-action link is supplied by 129, not invented in 130. |
| Fixed monetary amount can use payment-order application | [Civil Procedure Code 508](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=508) | 以給付金錢或其他代替物或有價證券之一定數量為標的者，得聲請法院…發支付命令。 |
| Application contents, performance of counter-obligation and prima facie showing | [Civil Procedure Code 511](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=511) | 當事人及法定代理人；請求之標的及其數量；請求之原因事實。其有對待給付者，已履行之情形；應發支付命令之陳述；法院；債權人之請求，應釋明之。 |
| Exclusions: own performance incomplete, service abroad or by public notice | [Civil Procedure Code 509](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=509) | 對待給付尚未履行，或支付命令之送達應於外國為之，或依公示送達為之者，不得行之。 Polish creditor location is not itself one of these exclusions. |
| Unreasoned objection within 20 days after service | [Civil Procedure Code 516](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=516) | 於送達後二十日之不變期間內，不附理由…提出異議。 |
| Timely lawful objection invalidates order only within objection scope; suit/mediation follows | [Civil Procedure Code 519](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=519) | 於法定期間合法提出異議者…於異議範圍內失其效力…視為起訴或聲請調解。 |
| No timely lawful objection permits enforcement; declaratory challenge remains possible | [Civil Procedure Code 521](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=521) | 未於法定期間合法提出異議者…得為執行名義；債務人主張…債權不存在而提起確認之訴。 No guaranteed recovery or final-merits effect is promised. |
| Three-month service failure invalidates order | [Civil Procedure Code 515(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=515) | 發支付命令後，三個月內不能送達於債務人者，其命令失其效力。 The draft limits this sentence to paragraph 1 and describes prescription loss as risk; paragraph 2's special erroneous-certificate remedy is not negated. |
| Withdrawal, rejection or loss of order's effect can undo interruption | [Civil Code 132](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=132) | 若撤回聲請，或受駁回之裁判，或支付命令失其效力時，視為不中斷。 Read with 519 and 515, not as a claim that all objections destroy the filing date. |
| Attachment for money claim to secure enforcement | [Civil Procedure Code 522](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=522) | 就金錢請求或得易為金錢請求之請求，欲保全強制執行者，得聲請假扣押。 |
| Risk of inability or serious difficulty enforcing | [Civil Procedure Code 523](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=523) | 非有日後不能強制執行或甚難執行之虞者，不得為之。 Foreign-enforcement presumption is not generalized to a Polish creditor. |
| Claim and reason both require prima facie showing; court may require security | [Civil Procedure Code 526](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=526) | 請求及假扣押之原因，應釋明之；法院亦得命債權人供擔保後為假扣押。 Security is not described as an automatic substitute for all evidence. |

### Opening deletion test

- Kept the explicitly hypothetical first sentence: seller, goods, contractual currency, partial payment and disputed deduction establish the transaction.
- Kept the złoty/euro sentence: it identifies the accounting/contract difference unique to this opening.
- Kept the reconciliation sentence: it states which balance the Taiwan assessment needs.
- Kept the second paragraph's invoice-to-order/delivery/due-date/payment/objection mapping: these are distinct evidence categories, not a preview of the article.
- Kept the distinction between a requested credit and an established adjustment, plus preservation of unfavorable correspondence: both change the evidence packet.
- No opening sentence was cut in this draft. Later phrasing was adjusted to preserve article 511's actual application contents and to avoid three matching endings across the batch.

### Three-comparator review and ending

008's asserted lawyer/client experience was not reused: the first sentence labels this transaction hypothetical. Unlike 009's backward reference and enumerated statutory list, this article follows a specific disputed balance with four issue headings and explanation paragraphs. Unlike 015's notice-style lead and generic invitation at the end, it finishes with two concrete dates next to the oldest unpaid invoice. Compared with the other two new articles, its scene opening is used only once in the batch; the close is an evidence entry rather than a structure diagram or reader question.

Dropped/unverified: no claim that a Polish judgment is automatically recognized in Taiwan; no conclusion about Polish limitation law; no assumption that repair deductions are legally valid; no currency conversion rate; no universal two-year rule for all commercial invoices; no promised court duration, debtor assets, collection success or standard court-security percentage. The optional issue of a particular buyer's assets requires facts not supplied in this assignment.

## Section 5 self-check and packaging

1. Official variety command: unavailable for Polish, exit 2, as recorded above. It was not misreported as a successful “0 FAIL” run. Supplementary figures and exact counts below use the final drafts.
2. Opening distribution: 870 contracting-party question; 871 numerical legal restriction; 872 marked hypothetical transaction. Each type is one third of the batch; scenes do not exceed one third.
3. Each draft has at least two genuinely short sentences. Long conditions are retained where legally necessary and are followed by shorter prose. There is no paragraph consisting of consecutive long legal-condition sentences.
4. Paragraph starting words were checked case-insensitively; no start occurs more than twice within a draft.
5. Citation placement varies between statute-led sentences, inline support and sentence-end references. Each article includes uncited practical preparation paragraphs containing no new statutory entitlement. No run of three “claim → citation → however” paragraphs was found.
6. No repeated “not X but Y” construction. Necessary distinctions concern actual reader choices, not invented misconceptions. Negative statements preserve the legal limits of the program, work permission and payment procedure.
7. Final substantive paragraphs are different: payment recipient on the company diagram, remaining permitted work/presence question, two dates beside the oldest invoice. No summary/conclusion section follows.
8. Polish register is professional and direct. No bold, body H1, lawyer first-person narrator, invented credentials, phone/address, author footer or promise of Polish-language consultation. Image captions are the prescribed neutral illustration notice.
9. Revisions retained every cited condition, article number, exception, date anchor and hypothetical label. The three FAQs per article match their bodies. Articles have four substantive H2 sections plus `Źródła`, one contact paragraph and checked internal slugs. Source lists include every external evidentiary URL used in the body.

Images: 870 I08; 871 I11; 872 I01. Paths are copied exactly from the image menu; image descriptions and captions are Polish. No images were generated, altered or reused twice in this batch.

Measurement convention: word and character counts below refer to visible main text, including H2 wording but excluding YAML/FAQ and the `Źródła` section. Markdown links count by their displayed labels; heading markers are removed and all whitespace is normalized to a single space. Character counts include spaces. Raw-file totals are also supplied for reproducibility. Supplementary sentence measures exclude headings, protect the Polish citation abbreviations `art.`, `ust.` and `pkt.`, and split on sentence-ending punctuation. They are author-side heuristics, not a supported Polish profile or a claim of human language review.

## Final validation and counts

Final packaging checks passed: all 16 frontmatter keys appear in the required order; three FAQs and 3–5 tags are present; dates, audience, author, title/SEO/summary lengths, category strings and four substantive H2s plus Sources meet the brief. Each image is distinct and menu-listed. Every cited official URL is included in Sources, all internal column slugs resolve to the repository or this assigned batch, and no banned generic slug is linked. All 34 distinct statute articles in the drafts were found in the `law.py` retrievals.

| File | Main-text words | Main-text characters with spaces | Characters without spaces | Raw Markdown words | Raw Markdown characters |
|---|---:|---:|---:|---:|---:|
| `drafts/pl/870-polish-company-taiwan-subsidiary-branch-office.md` | 730 | 5604 | 4875 | 1016 | 10546 |
| `drafts/pl/871-polish-working-holiday-taiwan-six-month-work.md` | 775 | 5671 | 4897 | 1071 | 9165 |
| `drafts/pl/872-polish-exporter-taiwan-unpaid-euro-invoices.md` | 775 | 5833 | 5059 | 1091 | 10915 |

Supplementary author calculations (not the unsupported official Polish measurement):

| Article | Sentences | Length CV | Sentences of at most 8 words | Highest repeated paragraph start | Adjacent identical sentence starts | Sentence-end parenthetical statute citations | Maximum consecutive such endings in one paragraph |
|---|---:|---:|---:|---:|---:|---:|---:|
| 870 | 53 | 0.4621 | 10 (18.9%) | 2 | 1 | 0 (0.0%) | 0 |
| 871 | 53 | 0.4513 | 9 (17.0%) | 2 | 0 | 1 (1.9%) | 1 |
| 872 | 53 | 0.4509 | 9 (17.0%) | 2 | 0 | 7 (13.2%) | 2 |

These counts use the displayed link labels, paragraph-based sentence splitting and protected `art.`, `ust.` and `pkt.` abbreviations described above. No paragraph contains more than one sentence of 32 or more whitespace-separated words. Citation endings and adjacent starting words were also read in context. Final edits restored the decision noun in 870 after its opening deletion, split the two treaty dates into separate sentences, made the visitor-visa source explicit in 871, and moved the article 516 citation to the front of its sentence in 872 so the paragraph does not have three consecutive parenthetical statute endings. None altered the legal conditions.

Required shared-command result on the final three manuscripts:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check drafts/pl/870-polish-company-taiwan-subsidiary-branch-office.md drafts/pl/871-polish-working-holiday-taiwan-six-month-work.md drafts/pl/872-polish-exporter-taiwan-unpaid-euro-invoices.md
All three: ERROR measurement unavailable: cannot infer language; exit 2.
Explicit --lang pl: invalid choice; exit 2.
```

The requested official zero-FAIL measurement remains unavailable because the installed tool does not support Polish. This limitation is confined to automated style measurement; it is not concealed by the supplementary calculations or described as a publication approval.

Final manuscript SHA-256 values:

- `870-polish-company-taiwan-subsidiary-branch-office.md`: `851f6ab74ced595afb28ad046a60b868a38e2b0e9b2c3e0accbe355eb8431dd0`
- `871-polish-working-holiday-taiwan-six-month-work.md`: `39786ebba649fff8e6a89f7d671ba655a1c0ad3d43bd2cf4626fa53c1a3d45f7`
- `872-polish-exporter-taiwan-unpaid-euro-invoices.md`: `89833e0873507618b4eadf5b356e06f4cc1908de3f32a10717335abd9db3596c`
