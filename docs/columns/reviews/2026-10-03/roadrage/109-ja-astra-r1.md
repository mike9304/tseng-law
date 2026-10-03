# C2 Japanese final review — Astra r1

VERDICT: FIX

Reviewer: GPT-6 Astra (fallback reviewer). Reviewed on 2026-10-03. Four major issues remain (M1–M4); the column is not approved for publication. Only minor language edits were applied. The major passages remain unchanged for the writer to correct.

## Scope checked

Read the complete column, series brief, editorial-voice brief, all three supplied judgments (including the criminal indictment and the separate theft appeal), and `cases/statutes.md` with shell tools. Checked facts first, then citations, series rules, and Japanese voice. Line references below refer to the reviewed column; the minor edits did not change its line count.

- Column: [drafts/C2/ja.md](/Users/son7/tseng-roadrage-20261003/drafts/C2/ja.md).
- Rules: [brief-SERIES.md](/Users/son7/tseng-roadrage-20261003/brief-SERIES.md) and [brief-EDITORIAL-VOICE.md](/Users/son7/tseng-roadrage-20261003/brief-EDITORIAL-VOICE.md).
- Primary civil source: [194.txt](/Users/son7/tseng-roadrage-20261003/cases/jud/194.txt), 臺灣基隆地方法院114年度訴字第502號, 2025-12-04.
- Primary injury source: [347.txt](/Users/son7/tseng-roadrage-20261003/cases/jud/347.txt), 臺灣基隆地方法院114年度易字第159號, 2025-04-09, including the 2025-02-03 indictment.
- Primary source for the passenger/driver distinction: [95.txt](/Users/son7/tseng-roadrage-20261003/cases/jud/95.txt), 臺灣高等法院115年度上易字第1045號, 2026-08-18.
- Local statutes: [statutes.md](/Users/son7/tseng-roadrage-20261003/cases/statutes.md).

`drafts/C2/ja.facts.md` does not exist. No fact sheet was substituted or trusted; the column was checked directly against the sources, as instructed.

The global `/Users/son7/agent-library/knowledge/editorial-voice.md` was unavailable. The complete supplied editorial-voice brief was read and applied. The older local `COLUMN-VOICE-RULE.md` only pointed back to that unavailable global path. This did not prevent the requested document review. The Fable legacy workflow and verification-before-completion skills were used for evidence and change verification; no separate Fable approval was required.

Four cited statutes were absent from the local collection. Only their official single-article pages were fetched:

| Missing provision | Official source | Finding |
|---|---|---|
| Criminal Code 38-2 | [刑法38條之2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=38-2) | Paragraph 2 supports the provision cited by the sentencing court for declining confiscation. |
| Criminal Procedure 273-1 | [刑事訴訟法273條之1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=273-1) | Correct provision for the simplified trial procedure. |
| Civil Procedure 385 | [民事訴訟法385條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=385) | Correct provision for judgment following one party's oral argument when the other does not appear. |
| Labor Standards Act 54 | [勞動基準法54條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=54) | The wording requires the legal-scope correction in M1. |

Judgment URLs were checked against the exact supplied URLs and the identifiers in the local texts. Their live HTTP availability was not tested, in accordance with the network restriction. The full appellate judgment 114年度上易字第1128號 and the four Supreme Court precedents mentioned by the civil court were not supplied or independently fetched.

The most recent three published Japanese columns and their publication order were not supplied or established locally; a comparison against those three publications was not performed. This review assesses the target's own voice and structure, without claiming that comparative check.

## Major issues — required corrections, not applied

### M1 — A case-specific calculation cutoff is described as a statutory compulsory retirement age

Location: [ja.md:79](/Users/son7/tseng-roadrage-20261003/drafts/C2/ja.md:79).

원문/Original → 「労働基準法54条の強制退職年齢である65歳に達する2062年1月9日までの36年と336日です」

Problem & reason → The civil judgment does use age 65 as the endpoint for this claimant's loss calculation. However, calling it the Act's compulsory retirement age without qualification overstates the statute. Article 54 restricts when an employer may force retirement; it does not require every employee to retire at 65. Its second paragraph expressly permits the parties to agree to postpone the age. The article currently moves from the court's particular calculation to an unqualified legal description. This is a legal-scope issue, not a stylistic correction.

Evidence → 194.txt, 貳、三、㈡、⒋、⑵ uses 「依勞動基準法第54條規定勞工強制退休之年齡65歲」 in its computation. The actual [Article 54](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=54) starts 「勞工非有下列情形之一，雇主不得強制其退休」 and allows the age in paragraph 1(1) to be postponed by agreement. Reporting the court's wording must not convert it into a universal retirement obligation.

Fix (required; not applied) → Attribute the cutoff expressly to this judgment, for example: 「この判決では、労働基準法54条を参照し、65歳に達する2062年1月9日を算定期間の終点としました。」 If explaining the statute itself, add that it concerns when an employer may require retirement and that the age may be postponed by agreement; do not state that retirement automatically occurs at 65. Keep the existing start date, period, discount method, amount, and article link.

Facts/conditions preserved → This court's 65-year cutoff; 2025-02-07 to 2062-01-09; 36 years and 336 days; 12%; the first-payment treatment and 5% Hoffmann discount; the award of 1,284,971 Taiwan dollars. No claim about the victim's actual future retirement is added.

### M2 — The explanation makes “age 26” a calculation input despite inconsistent dates in the judgment

Location: [ja.md:104](/Users/son7/tseng-roadrage-20261003/drafts/C2/ja.md:104), read with lines 79 and 85.

원문/Original → 「最も大きい労働能力の減少額は、事件当時26歳、減少率12%、65歳までという、この被害者の条件から出た数字です。」

Problem & reason → The source does say “26” in its nonpecuniary-damages discussion; that quotation is supported and must not be silently changed to a different age. But its separate loss-of-capacity calculation uses a specific start date and a stated 65th-birthday endpoint that do not reconcile with being 26 on 2024-11-07. A 65th birthday on 2062-01-09 is inconsistent with age 26 on the incident date. The birth-date field and parts of the displayed coefficients appear as zero placeholders. The column therefore cannot present 26 as a verified input that generated the capacity award. This is an unsupported synthesis of two different parts of the judgment.

Evidence → 194.txt, 貳、三、㈡、⒌ says 「於本件事故發生時僅為26歲」 while ⒋、⑵ uses 114年2月7日 through 151年1月9日 and the 36th/37th-year coefficients with 336/365. The age appears in the慰撫金 reasoning, not as the stated numerical input to the loss-of-capacity formula.

Fix (required; not applied) → Describe the actual computation without adding age 26 as its input. For example: 「労働能力の減少による損害は、裁判所が認めた月給に減少率12%を掛けた年額と、判決が採用した2025年2月7日から2062年1月9日までの期間を基に算定されています。」 Keep any mention of 26 limited to what the judgment says in its慰謝料 reasoning. Do not infer or publish a corrected birth date or age.

Facts/conditions preserved → The source's age statement remains a statement attributed to the court; its inconsistency is not “repaired” by invention. The awarded sum, 12% rate, stated dates, retirement cutoff, and privacy restriction on income figures remain intact.

### M3 — The appellate table's date cell claims a date is in a source that supplies no such date

Location: [ja.md:98](/Users/son7/tseng-roadrage-20261003/drafts/C2/ja.md:98).

원문/Original → Under the 「判決日」 heading, the 114年度上易字第1128号 row says 「民事判決に記載（本文は未確認）」.

Problem & reason → The civil judgment reports that appeal's court, case number, dismissal, and the final seven-month sentence. It does not state the appellate judgment's date. Placing “recorded in the civil judgment” in the date column implies date information that the supplied civil text does not contain. The underlying finality statement is supported; the date provenance is not.

Evidence → 194.txt, 貳、三、㈠: 「被告提起上訴，經臺灣高等法院以114年度上易字第1128號判決駁回上訴」. No decision date accompanies this reference.

Fix (required; not applied) → Change the date cell to 「確認資料に記載なし」 or 「未確認」. Preserve the separate explanation that the dismissal and final sentence are reported in the 2025-12-04 civil judgment and that the appeal's full text was not reviewed. Cite that civil judgment; do not invent a direct appeal URL or date.

Facts/conditions preserved → Correct appellate court and case number, dismissal, final seven-month sentence, and the limit of secondary verification.

### M4 — Substantial factual and quoted passages lack the required adjacent, dated judgment citations

Locations: principally [ja.md:28](/Users/son7/tseng-roadrage-20261003/drafts/C2/ja.md:28), [ja.md:34](/Users/son7/tseng-roadrage-20261003/drafts/C2/ja.md:34), [ja.md:38](/Users/son7/tseng-roadrage-20261003/drafts/C2/ja.md:38), [ja.md:46](/Users/son7/tseng-roadrage-20261003/drafts/C2/ja.md:46), [ja.md:50](/Users/son7/tseng-roadrage-20261003/drafts/C2/ja.md:50), [ja.md:67](/Users/son7/tseng-roadrage-20261003/drafts/C2/ja.md:67), [ja.md:77](/Users/son7/tseng-roadrage-20261003/drafts/C2/ja.md:77), [ja.md:87](/Users/son7/tseng-roadrage-20261003/drafts/C2/ja.md:87), and [ja.md:108](/Users/son7/tseng-roadrage-20261003/drafts/C2/ja.md:108).

원문/Original → Examples include 「加害者は控訴しました。後の民事判決によると…有期徒刑7か月は確定しています」; the five-item damages table; the medical, family-care, wage-loss and expert-assessment paragraphs; the criminal sentencing quotations; and 「民事判決には、送達後20日以内に控訴できるとの記載があります」. The repeated judgment links at lines 34 and 87 omit their judgment dates.

Problem & reason → Series hard rule 2 requires a linked court, case number, and judgment date immediately after the supported claims. The opening and final source list identify the three supplied judgments correctly, but they do not provide adjacent support for the long intervening factual passages. Statute links establish legal provisions, not the facts, award, procedural history, or evidence of this case. Some court quotations also have no nearby judgment link. These are mandatory sourcing defects even where the underlying facts are accurate.

Evidence → Comparing every paragraph and table against the three supplied texts confirms the underlying sources listed in the audit below. The omissions are visible in the column: for example, the civil damages table and the ensuing item-by-item analysis have no adjacent civil judgment citation; the appeal-finality paragraph has none; and the sentence and confiscation discussion link only statutes.

Fix (required; not applied) → Add a complete dated judgment citation at the end of each factual paragraph or coherent claim block and immediately after each table, using only the three supplied URLs:

- Criminal findings, indictment evidence and sentencing: 基隆地方法院114年度易字第159号刑事判決、2025年4月9日.
- Civil procedure, all damages findings, quoted precedents, appeal-finality report and civil appeal notice: 基隆地方法院114年度訴字第502号民事判決、2025年12月4日.
- The acquaintance's role, the witness quotation and separate theft acquittal: 台湾高等法院115年度上易字第1045号刑事判決、2026年8月18日.

Restore the date in the two abbreviated judgment-link labels. Under the civil source entry, make the indirect source coverage explicit: 114年度上易字第1128号 and Supreme Court 94年度台上字第1543号, 113年度台上字第528号, 47年度台上字第1221号 and 51年度台上字第223号 are reported or quoted in that civil judgment, not independently reviewed texts. Do not manufacture dates or links for those absent texts.

Facts/conditions preserved → All existing court/case/date identities and URL targets remain valid. The distinction between directly reviewed judgments and precedents or appellate history reported within them must remain visible. Adding source attribution does not authorize changing any claim or amount.

## Factual and legal audit beyond the issues above

| Claim group | Primary support and result |
|---|---|
| Incident on 2024-11-07 at about 18:00 in Keelung's Anle District; quarrel; bat; right ulna and patella fractures | 347.txt, attached indictment, 犯罪事實一; also 194.txt. Supported. The article does not add a street name/number, vehicle model, weather, speed or invented dialogue. |
| Attacker was a passenger; acquaintance drove; separate theft appeal ended in acquittal | 95.txt, 理由四、㈡、⒉ and 主文. Supported. The quoted testimony is exact. The acquittal is clearly the acquaintance's separate theft case, not an acquittal of the assault. |
| Dashcam evidence rather than a described frame-by-frame court inspection | 347.txt, indictment evidence item 5: one disc, eight screenshots, four scene photographs. Supported. The judgment does not identify the dashcam owner or supply second-by-second incident findings. |
| Simplified trial, confession added, indictment adopted | 347.txt, 壹 and 貳一, with Criminal Procedure 273-1. Supported as a description of this case. |
| Injury conviction and seven months | 347.txt, 主文 and 貳二㈠. Supported; no fine or imprisonment-to-fine conversion is invented. |
| Sentencing factors and no settlement/compensation by that sentencing | 347.txt, 貳二㈡. Supported. Personal circumstances are generalized; no specific education, occupation, illness, income or household details are reproduced. |
| Unseized bat; defendant said it had been discarded; no confiscation | 347.txt, 貳二㈢, with Criminal Code 38-2(2). Supported; the defendant's statement is attributed as such. |
| No conversion or suspension stated in the first-instance disposition; Article 41 threshold used as background | 347.txt 主文 and local Article 41. Supported. The article explicitly identifies Article 41 as background and does not invent a conversion rate or promise eligibility. |
| Criminal finality | 194.txt, 貳、三、㈠ reports the seven-month final sentence and dismissal under 114年度上易字第1128號. Supported indirectly, with the full appellate text expressly unreviewed. M3 concerns only the date cell. |
| Attached civil action 114年度附民字第240號; transfer; absent defendant and no written submissions; hearing closed 2025-10-29 | 194.txt opening, 壹, 貳二 and conclusion; Article 385. Supported. Subsequent paragraphs correctly explain the evidence the court examined rather than treating silence as automatic full recovery. |
| Claimed 4,824,227; awarded 2,079,598; five categories | 194.txt, 貳一 and 貳、三、㈡、⒈–⒍. All rows and both totals agree. |
| Medical 83,415 + equipment 12,932 + rehabilitation 2,080 = 98,427 | 194.txt, ⒈. Correct. |
| Family caregiving; full-day need but half-day rate requested; 30 × 1,500 = 45,000 | 194.txt, ⒉. Supported. The family reference explains compensable unpaid care without exposing household composition or personal family circumstances. |
| Three months off work plus three rehabilitation months with four workdays a week/about 20% reduction; 151,200 | 194.txt, ⒊. Supported. Two certificates, labor-insurance evidence and the court's income inquiry are correctly described; the individual salary is not published. |
| Private expert assessment on 2025-09-19; about 12% | 194.txt, ⒋、⑴. Supported. The claimant's “at most 80% recovery” assertion remains distinct from the expert's capacity-loss rate. |
| Capacity loss of 1,284,971; stated period; first-payment exception; Hoffmann calculation | 194.txt, ⒋、⑵. Award and method supported. An independent arithmetic check using the source's annual loss, a 36-year coefficient and 336/365 of the next year gives 1,284,971 after rounding. M1–M2 qualify the legal/age explanation, not the awarded amount. |
| Nonpecuniary damages reduced from 800,000 to 500,000; risk of permanent joint injury | 194.txt, ⒌. Supported. The text preserves risk language and does not turn it into a diagnosis of certain permanent harm. “26” is present in this portion of the source; see M2 for the inconsistent calculation context. |
| Interest from 2025-03-29 at 5%; costs 43%; security 693,000 versus 2,079,598 | 194.txt, 主文 and 四–五. Correct. Annual simple interest on the principal is 103,979.90, correctly rounded in the article to about 104,000. |
| Civil liability under 184(1) first sentence, 193(1), 195(1) first sentence | 194.txt, 貳、三、㈡ and local statutes. Correct for this bodily-injury claim. |
| Article 217 not applied; civil appeal within 20 days of service; payment/finality unconfirmed | 194.txt and local Article 217. Correct; the background label and limits are explicit. |
| No administrative fine/licence/plate disposition reported in the three supplied judgments | Full texts of 194, 347 and 95. Supported as a statement about these texts; it does not assert that no separate administrative proceeding ever existed. |

All existing judgment URL targets match the three required links exactly. All ten cited statute URLs identify the right law and article, including the four fetched provisions. Every URL used in the body also occurs in the source list. The remaining sourcing failures are adjacent attribution and the indirect-source coverage described in M4.

## Series-rule and Japanese-voice checks

No private-party names, exact incident address, phone number, sales pitch, bold syntax, HTML bold tags, lawyer-review claim, human-native-review claim, or foreign-law comparison were found. The author remains `legal-ai-assistant`; the final Japanese AI-disclosure line and verification date are present. Criminal sentence, civil compensation and administrative dispositions remain distinct. Articles 41 and 217 are explicitly background. The reader-engagement question occurs once.

The injury and recovery descriptions are relevant to the award and supported. No unrelated medical conditions or specific private income, occupation, education or household details are included.

`ALT_TBD` and `CAPTION_TBD` were ignored as instructed. The writer brief expressly uses `IMAGE_PATH` for the image fields and says media captions will be added separately; these placeholders were not treated as substantive content defects. No image or video was reviewed, and no caption certification is claimed.

The title is specific to the passenger, bat, sentence and damages; it is not an imperative or clickbait. Headings track the particular proceedings and damages. The “three items” heading describes actual awarded items rather than a reader checklist. The prose uses です・ます, with an identifiable indirect account of the claimant's allegations. Minor translation-like wording and filler were corrected as listed below.

### Sentence-deletion test: first two paragraphs

| Original sentence / position | Information lost if removed | Decision |
|---|---|---|
| Opening sentence: date, approximate time, district, lane setting and quarrel | The concrete incident setting and sequence | Retained; only Chinese-derived wording was naturalized. |
| Opening paragraph, second sentence: bat attack and two fractures | Act and injury outcomes | Retained unchanged. |
| Opening paragraph, third sentence: ROC 114 = 2025 | Explanation of the otherwise unfamiliar case-number year | Retained unchanged. |
| Second paragraph, first sentence: missing trigger, movements and victim transport details | The limits of the available narrative | Retained. |
| Second paragraph, second sentence: civil court's exact 「單純行車糾紛」 label | The court's characterization and its source | Retained; Japanese gloss naturalized. |
| 「分かっていることがもう一つあります。」 | Nothing factual or conditional; it only announces the next sentence | Deleted. |
| 「バットを振るった人物は、ハンドルを握っていませんでした。」 | The passenger/driver distinction central to the story | Retained; the following section supplies the supporting separate judgment, with citation placement still covered by M4. |

## Minor issues and edits applied

Each entry preserves facts, legal force, existing numbers and citations. No major correction was made.

1. 원문/Original → 「行車トラブル」 (10 occurrences, including title, summary, prose and Japanese translations).
   Problem & reason → A Chinese-derived phrase is repeated where ordinary Japanese is clearer.
   Fix (applied) → 「交通トラブル」.
   Facts/conditions preserved → The same dispute is described; the Chinese original 「行車糾紛」, quotations, case references and factual limits are untouched.

2. 원문/Original → 「ある巷（路地）の前で、行車をめぐるトラブル」 (line 20).
   Problem & reason → 「巷」 and 「行車」 reproduce Chinese wording unnecessarily.
   Fix (applied) → 「ある路地の前で、車の走行をめぐるトラブル」.
   Facts/conditions preserved → Same lane-front location, district, incident time and nature of the dispute; no street address or vehicle movement was added.

3. 원문/Original → 「分かっていることがもう一つあります。」 (line 22).
   Problem & reason → The sentence-deletion test shows no information loss.
   Fix (applied) → Deleted.
   Facts/conditions preserved → The passenger finding and the preceding account of evidentiary limits remain.

4. 원문/Original → 「車内の事情は、この傷害事件とは別の判決に出てきます。」 (line 26).
   Problem & reason → Vague phrasing delays the actual issue: who drove.
   Fix (applied) → 「誰が運転していたかは、この傷害事件とは別の判決に記されています。」
   Facts/conditions preserved → Same separate judgment and driver/passenger distinction; no additional interior scene or dialogue is supplied.

5. 원문/Original → 「加害者の得にしてはならない」 (line 69, Japanese translation).
   Problem & reason → 「得にする」 is awkward in this legal explanation.
   Fix (applied) → 「加害者の利益にしてはならない」.
   Facts/conditions preserved → Unpaid family care must not benefit the tortfeasor; the exact Chinese quote is unchanged.

6. 원문/Original → 「この判決で金額に変わったのは、書類に書かれていたことでした。」 (line 112).
   Problem & reason → An abstract restatement of the heading and the concrete examples that immediately follow.
   Fix (applied) → Deleted.
   Facts/conditions preserved → All evidence descriptions, itemized amounts and the practical conclusion remain.

7. 원문/Original → 「五年以下有期徒刑、拘役或五十萬元以下罰金」 with no Japanese rendering (line 38).
   Problem & reason → The Japanese reader should not have to translate the quoted penalty language.
   Fix (applied) → Added 「（五年以下の有期徒刑、拘役、または五十万台湾元以下の罰金）」 after the unchanged Chinese quote.
   Facts/conditions preserved → Same alternative penalties and maxima; no new interpretation, conversion rate, case sentence or Japanese-law comparison.

8. 원문/Original → `無罪（「不得上訴」と記載）` (line 100).
   Problem & reason → The Chinese no-appeal statement lacked a Japanese gloss.
   Fix (applied) → `無罪（「不得上訴」〔上訴できない〕と記載）`.
   Facts/conditions preserved → Same separate theft acquittal and no-appeal notation; the injury appeal and civil finality remain distinct.

## Change verification

The review's only file mutations are the column and this log. No fact-sheet, judgment, statute file, brief, other draft or other review was changed by this review.

- Original column SHA-256: `c39a22abec22f3bce5b155d04288e69ddfb3a0c0644d68eca4c8b4aa79d94750`.
- Reviewed column SHA-256: `d4c3af4193491271e251927c7f248a7b354cbb18117b593c2246cac0fedc37d5`.
- Read back the edited column and compared it with the in-memory original and the exact intended edits.
- Existing Arabic-number sequence: unchanged. The added Japanese statutory gloss uses the same Chinese-numeral values already quoted.
- All Markdown link labels and URLs: unchanged.
- All Chinese quotations: unchanged.
- Line count, author and final AI disclosure: unchanged.
- No prohibited bold markup introduced.
- Arithmetic independently checked: both damages totals, medical subtotal, annual simple interest and the capacity-loss award.

M1–M4 remain required. Minor language corrections do not constitute publication approval.

VERDICT: FIX
