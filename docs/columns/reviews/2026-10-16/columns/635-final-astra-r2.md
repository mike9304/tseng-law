# C7 final review — round 2 — 2026-10-16

Verdict: PASS. Round-1 M1 is resolved in all four languages, all 18 earlier direct repairs remain in place, and no new MAJOR or uncorrected hard-rule failure remains. Image: OK. No column edits were necessary in this round. This verdict applies to the exact local files and hashes below; it is not a record of publication.

## Scope checked and independence

Role: independent final reviewer, Astra round 2. I did not write these columns. I first read `reviews/C7/final-astra-r1.md` and `reviews/C7/fix2-notes.md`, then verified their findings against the actual four files before assessing the revised passages. The fixer's resolution table was treated as a claim to verify.

Read in full: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C7.md`, both prior-round records, `drafts/C7/ko.md`, `ja.md`, `en.md`, `zh-hant.md`, `drafts/C7/facts.md`, and `research/C7-statutes.md`. Also read the sentence-variety rule, recurring lessons, editorial review criteria, local instructions, `topics/LINKS.md`, and the image brief. The additional canonical voice path referenced by `COLUMN-VOICE-RULE.md` is absent; the supplied full editorial-voice brief was read and applied. The retired Fable instructions were not applied.

I viewed `images/C7.webp` with the image-viewing tool. No column cites a judgment, foreign-law proposition, non-government report, fee schedule or monetary example. Accordingly, there was no cited judgment text to open and no arithmetic or foreign-law holding to verify. The only internal link is the separate collision-response column in the matching language.

Evidence is saved under `reviews/C7/final-astra-r2-evidence/`: original snapshots, current curl responses and extracted text, research-to-live text comparisons, round-1-to-round-2 diffs, earlier-repair verification, citation/metadata audit, comparison excerpts, variety support, command outputs and final hashes.

## Prior-round findings verified first

### M1 — late service and the printed appearance date: RESOLVED

Original → “The appearance date … can arrive before or after the end of the 30 days counted from receipt,” together with unqualified printed-date consequences in the summaries, FAQ and table.

Problem & reason → That explanation omitted the attendance rule for a notice received with fewer than 30 days remaining or after the stated date. It could make the printed date appear conclusive. [Handling rules Article 15(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080029&flno=15) permits attendance within 30 days after effective service in those circumstances; [Article 36(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080029&flno=36) separately retains the attribution filing language tied to the date stated on the notice. Neither provision, read alone, supports presenting a universal new 30-day attribution deadline.

Fix, applied by fixer and verified here → All four requested components are present:

| Round-1 requirement | Verification in the current files | Result |
|---|---|---|
| Replace the unsupported English opening with the two statutory requirements | `en.md:24` now states Article 85(1)'s attribution submission and Article 9(1)'s separate receipt-based period, then flags late service with both handling-rule links. The previous “before or after” claim is gone. | RESOLVED |
| Fetch Articles 15 and 36, update the fact sheet, and explain late service accurately | Both complete articles are in `research/C7-statutes.md` and match fresh official-page responses. `facts.md` F9 records the limited reading. `ko.md:54`, `ja.md:56`, `en.md:52`, and `zh-hant.md:56` retain both alternative conditions, the permissive attendance rule, the effective-service trigger, the distinct Article 36 filing language and the prompt authority check. | RESOLVED |
| Qualify summaries, FAQ, consequences, deadline comparisons and lawyer closing | Every summary and both FAQ answers address late service. The consequence paragraphs at ko:36, ja:38, en:34, zh-hant:38 and the table deadline/consequence rows use the applicable deadline and direct the reader to the late-service explanation. The lawyer paragraphs at ko:71, ja:73, en:71, zh-hant:73 include service-effect and filing-deadline review. English summary length is 157 characters. | RESOLVED |
| List the new official sources with the check date, without an automatic-extension claim | Each sources section lists D0080029 Articles 15 and 36 and the 2026-10-16 check date. All four lint and variety runs pass. No version says Article 15(2) automatically extends every Article 85 attribution filing. | RESOLVED |

Facts preserved → The cited person's belief that an identifiable other person was responsible; submission to the penalty authority; relevant evidence AND that person's supporting documents; Article 85's statutory before-date wording and noncompliance consequence; mandatory separate notification by the authority; Article 9's distinct receipt-based 30 days; and the lack of any promised acceptance or cancellation. The repeated hypothetical passages continue to explain the ordinary Article 85 rule within the now-qualified article; they do not introduce a late-service scenario or override its express qualification.

The operative source wording was independently read after fetching it with curl:

- Article 15(2): “收受通知單時應到案日期不足三十日或已逾應到案日期者，得於送達生效日後三十日內到案。”
- Article 36(1): “應於通知單記載之應到案日期前，檢附相關證據及足資辨識、通知應歸責人之證明文件，向處罰機關告知應歸責人”.

### Earlier direct repairs 1–18: all preserved

These are confirmations of completed round-1 repairs, not new style objections. I reconstructed the round-1 final files from its saved originals and edit ledger; all four reconstructed SHA-256 values match the round-1 log. Every replacement remains present in the current files. In item 4, the expanded lawyer paragraph also preserves the permitted task.

| ID / current location | Original → problem & reason → fix already applied and verified → facts preserved |
|---|---|
| 1 · ko:32 | “증거와 그 사람에 관한 서류가 함께 갑니다.” → note-like phrasing → “두 종류의 자료가 모두 필요합니다.” remains → both required categories remain. |
| 2 · ko:40 | “실제 운전자를 알리는 서면을 받는 곳은 처벌기관입니다.” without its direct Article 85 basis → recipient citation gap → the immediately preceding Article 85(1) link remains → same recipient and obligation. |
| 3 · ko:52 | “두 서면을 각각의 기한에 맞춰 준비하게 됩니다.” → could impose an unsupported document count → “각 절차의 요건과 기한에 맞춰 자료를 준비해야 합니다.” remains → both procedures and deadlines, without requiring exactly two documents. |
| 4 · ko:71 | “제출하는 일도 맡길 만한 일입니다.” → awkward evaluative wording → “제출하는 일도 맡길 수 있습니다.” remains in the expanded paragraph → preparation and timely submission remain available lawyer tasks, with no outcome promise. |
| 5 · ja:24 | Generic owner-notice declaration → repeated setup → “運転したのは別の人なのに、なぜ車の所有者に通知書が届くのでしょうか。” remains → the recipient question and its statutory answer remain. |
| 6 · ja:24 | “列挙された行為を止めずに取り締まる” → could mean not stopping the conduct → “列挙された違反行為について、車を止めずに取り締まる” remains → listed conduct and absence of a vehicle stop remain. |
| 7 · ja:28 | Nested passive red-light notice sentence → difficult syntax → the notice sentence and “現場で車を止めての取締りはありませんでした。” remain → allegation, no roadside stop, addressee and “架空の例です” remain. |
| 8 · ja:42 | “運転者を知らせる書面の宛先は処罰機関です。” without the direct basis → citation gap → the linked “第85条第1項による運転者の届出先は処罰機関です” remains → same recipient. |
| 9 · ja:50 | “本人抜きで裁決することができます。” → casual phrasing → “本人の出頭を待たずに裁決することができます。” remains → preceding conjunctive conditions and the authority's discretion remain. |
| 10 · ja:54 | “二つの書面をそれぞれの期限に合わせて” → unsupported document-count implication → “それぞれの手続の要件と期限に合わせて” remains → requirements and deadlines preserved. |
| 11 · en:17 | “violation belongs to someone else” → unnatural ownership metaphor → “violation should be attributed to someone else” remains → the belief/attribution condition is unchanged. |
| 12 · en:34 | “after receiving the attribution” → abstract phrasing → “after receiving this information” remains → immediate separate notification remains mandatory. |
| 13 · en:63 | “requires a separate notice to the penalty authority” → could imply a new statutory filing-form requirement → “requires her to identify him to the penalty authority” remains → identity, recipient, both attachments, timing and mandatory force remain. |
| 14 · zh-hant throughout | Fictional nickname “阿凱” → unnecessary personal name → “車主” remains and the nickname is absent → the expressly fictional loan and driver facts remain. |
| 15 · zh-hant:36 | “不能把它當成自動成立的證據” → unnatural repetition → “訊息是否足以說明那次借車，仍要看內容。” remains → no evidentiary sufficiency or acceptance is promised. |
| 16 · zh-hant:42 | Attribution-recipient claim linked only to the Article 8 allocation → incomplete direct basis → Article 85(1) link remains alongside Article 8 → recipient and authority ranges remain. |
| 17 · zh-hant:54 | “兩份文件就要各自趕在自己的期限內” → unsupported document-count implication → “就要分別符合兩項程序的要件與期限” remains → both procedures, their requirements and periods remain. |
| 18 · zh-hant:69 | “一串跟同學借車的訊息” → could reverse the direction of the loan → “一串把車借給同學的對話紀錄” remains → the owner lent the car to the classmate. |

## Law and facts

I fetched all seven cited Chinese single-article pages, both Chinese full-text pages, both legislative histories and the English full-text page with curl. All 12 requests returned HTTP 200 and actual legal text. The full texts of all seven research articles match the fresh single-article texts after whitespace normalization. The fact sheet was checked against those texts rather than used as proof.

| Official provision | Claim and conditions checked in all four languages |
|---|---|
| [Act 7-2(1), items 1 and 7; 7-2(5)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=7-2) | Cannot OR inappropriate to stop; permission limited to listed conduct; red-light/crossing and scientific-instrument grounds are examples; highway authority OR police; identifying vehicle data; owner OR designated main driver; rental-business application AND a term of at least one year for the permissive lessee proviso. |
| [Act 8(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=8) | Articles 12–68 and 92(7)–(8) allocated to the highway authority; 69–84 to police. The inference that issuer and penalty authority need not be identical is supported by Articles 8 and 7-2. It is not a claim about which office handled an actual case. |
| [Act 85(1), (3)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=85) | Conditional attribution duty; correct recipient; before-date language; both categories of attachments; immediate mandatory separate notification; late noncompliance consequence with the service qualification. Negligence remains a presumption, not proof of driver identity. |
| [Act 9(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=9) | Optional payment within 30 days after receipt, under the referenced standard and at the designated place, closing without adjudication. A factual objection within that period is mandatory if the cited facts are disputed. Direct adjudication remains permissive and requires nonattendance AND neither timely payment nor a timely statement. |
| [Act 92(4)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=92) | Rule-making by the Ministry of Transportation and Communications together with the Ministry of the Interior for the stated fine and handling matters. No fine amount, points rule or licence consequence is inferred. |
| [Handling rules 15(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080029&flno=15) and [36(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080029&flno=36) | Both late-service alternatives; permission to attend within 30 days after service takes effect; distinct printed-date attribution wording; prompt confirmation of service and applicable filing deadline. No automatic attribution extension is asserted. |

The [Act's history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=K0040012) confirms the whole-law amendment date of 2026-08-17. Its pending-commencement warning concerns other provisions; it does not make the cited Article 7-2, 8, 9, 85 or 92 provisions prospective. Relevant historical commencement entries were checked. The [handling rules' history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=D0080029) confirms the whole-regulation amendment date of 2026-05-26; the latest change concerns Article 12-2, effective 2026-05-31. The cited Article 15 revision commenced on 2021-03-01 and the Article 36 revision on 2014-03-31. The articles do not confuse any of these with an individual provision's amendment date.

The [English database page](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=K0040012) is dated 2025-05-28 and confirms “Road Traffic Management and Penalty Act.” The English column explicitly uses it for the name only. That page also says the Chinese version prevails in a discrepancy. Current legal analysis was checked against Chinese text.

The hypothetical drivers, locations and trips vary appropriately by audience. None is presented as an actual client or adjudicated case. Messages and identity material are examples to inspect, not a statutory checklist or sufficient evidence by definition. There is no contradiction between languages on legal force, time periods, AND/OR conditions or outcome uncertainty.

## Citations, hard rules and per-language voice

Each rule-bearing prose paragraph has its own relevant official link; FAQ answers are also linked. The comparison table contains the two base article links and the additional late-service links. Every linked article is present in the research file. Each sources list contains every official inline source used and the check date 2026-10-16. The sole internal slug, `taiwan-traffic-accident-procedure`, exists in each corresponding locale in the read-only content checkout; this is filesystem existence verification, as required by lint, not a claim of public URL testing.

All frontmatter keys, topic `other`, dates, locale category/audience, matching H1, literal NNN image path and `author: "legal-ai-assistant"` were checked. There are two FAQ entries per language. English title length is 81, its required different seoTitle is 44, and its summary is 157 characters with no forbidden characters. Reading-time labels are plausible for the measured lengths.

No bold, phone/hotline number, messaging ID, private-party name, attorney byline, public AI byline, lawyer-review claim or native-review claim appears. The one contact paragraph in each version names the prescribed firm and email. Address strings exactly match brief rule 5, including `臺北` in ko/zh-hant, `7F-2` in ja and the full `Taipei City 103, Taiwan` in en. English includes the exact phrase “English-speaking lawyer in Taipei.” Each final section offers concrete notice, evidence, driver-identification, authority, deadline and filing work without promising acceptance or cancellation.

| Language | Law/facts → citations → hard rules → voice → image |
|---|---|
| ko | Core and M1 qualification correct → complete direct official links and existing Korean internal target → metadata/contact/hypothetical rules met → consistent 합니다체; specific recipient question, evidence discussion and concrete closing → OK. |
| ja | Same core, correct duty/permission and M1 qualification → complete links and existing Japanese target → prescribed contact and metadata met → consistent natural です・ます; no regression to the ambiguous no-stop wording or casual adjudication wording → OK. |
| en | Distinct deadlines and late-service explanation correct → correct sources, including the limited English-name source → title/seoTitle/summary limits and exact consultation phrase met → plain prose, direct new opening and case-specific closing → OK. |
| zh-hant | Same core and late-service conditions; loan direction clear → complete links and existing Traditional Chinese target → exact address, author and fictional label met → Taiwan terminology and Traditional Chinese; no mainland wording or personal nickname → OK. |

Scope remains limited to wrong-driver attribution and the related factual objection. Article 8's ranges describe allocation, not the substantive offences. The rental clause is the notice-recipient proviso, not rental-contract analysis. Collision response/compensation receives one separate-regime link sentence. No judicial-appeal procedure, offence fine, insurance, points, licence suspension, criminal rule or police-investigation analysis was added.

## Sentence variety and opening/closing review

Executed on each exact reviewed file:

`python3 /Users/son7/tseng-col-1016-work/lint.py /Users/son7/tseng-col-1016-work/drafts/C7/<lang>.md <lang> taiwan-traffic-ticket-other-driver-notice`

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1016-work/drafts/C7/<lang>.md`

| Language | Lint body length | CV | Very short sentences | Similar-length runs | Maximum repeated paragraph opener | Checker contrasts | Result |
|---|---:|---:|---:|---:|---:|---:|---|
| ko | 3258 characters | 0.508 | 9/65; 13.8% | 0.016 | 2 | 0 | lint OK; variety exit 0, FAIL 0 |
| ja | 3637 characters | 0.487 | 9/67; 13.4% | 0.015 | 2 | 2 | lint OK; variety exit 0, FAIL 0 |
| en | 1457 words | 0.495 | 8/60; 13.3% | 0.069 | 2 | 0 | lint OK; variety exit 0, FAIL 0 |
| zh-hant | 2677 characters | 0.507 | 5/52; 9.6% | 0.060 | 2 | 0 | lint OK; variety exit 0, FAIL 0 |

KO and JA have common-register-ending WARNs, not FAILs or mixed-register findings. The English checker counts one address fragment as a short sentence; even disregarding that artefact, seven genuinely short sentences remain. Japanese question sentences ending in `。` are reader questions despite the checker's zero question-mark count.

Manual sections 5–6 checks: no stock hypothetical opener; at least two genuine very short sentences per language; no paragraph opener repeated three times; no three consecutive claim–citation–caveat paragraphs; an uncited, explicitly fictional scene in each version; necessary contrasts stay within the limit and do not rebut an invented reader belief; closing paragraphs end on the appearance date or identified driver; Korean/Japanese registers remain consistent. Some legal sentences are long because they retain the required conditions, but the paragraphs also contain shorter sentences. There are not two unmet self-check items. No MONOTONY failure remains.

First-two-paragraph deletion test: KO paragraph 1 supplies the no-stop trigger, examples, recipient and rental proviso; paragraph 2 establishes the labelled loan and actual-driver facts. JA paragraph 1 supplies the recipient question and no-stop conditions/examples; paragraph 2 supplies and explains the recipient rule and proviso. EN paragraph 1 now supplies both procedures, their different time bases and the late-service qualification; paragraph 2 explains why the owner receives the notice. ZH-HANT paragraph 1 supplies the attribution condition, attachments, recipient and time-base distinction; paragraph 2 explains the no-stop/recipient rule. Removing those paragraphs would lose legal conditions or necessary facts. The previously accepted opening choices were not reopened as style objections.

Current C1–C8 opening snapshots were compared: C7 retains reader questions in ko/ja, the two-deadline explanation in en and the loan/notice-recipient contrast in zh-hant. It does not reuse a stock scene lead. Three recent same-locale files were also compared for openings, headings and endings; dates below are content metadata, not independent publication evidence:

- ko, `src/content/columns/`: `628-taiwan-parked-car-collision-external-video-evidence.md`, `627-taiwan-oneway-wrongway-head-on-collision.md`, `626-taiwan-red-signal-straight-stop-line-collision.md` — all 2026-10-15.
- ja, `src/content/columns-ja/`: `610-taiwan-subsidiary-annual-shareholders-meeting-director-term.md` — 2026-10-15; `609-taiwan-mistaken-bank-transfer-unjust-enrichment.md` and `608-taiwan-false-financial-report-investor-civil-damages.md` — 2026-10-14.
- en, `src/content/columns-en/`: `611-taiwan-scooter-outer-lane-left-turn-dashcam.md` and `610-taiwan-subsidiary-annual-shareholders-meeting-director-term.md` — 2026-10-15; `609-taiwan-mistaken-bank-transfer-unjust-enrichment.md` — 2026-10-14.
- zh-hant, `src/content/columns-zh/`: the same numbered 628, 627 and 626 traffic slugs as ko — all 2026-10-15.

All comparator paths are under `/Users/son7/Projects/tseng-law-columns-20261016/`; full paths and excerpts are in `comparators.json`. The ko/zh examples concern vehicle movement, road direction and signal timing. The ja examples concern terms of office, mistaken transfers and financial reports. The en examples use a collision scene, a three-year figure and a mistaken-payment scene. C7's notice-attribution headings and driver/deadline ending are specific to its own issue. No new formula or duplication problem was introduced by the repair.

## Edits applied in this round

None. The articles, fact sheet, research file and image were not modified by this reviewer. The only writes were this review log and its evidence files. `applied-edits.json` is an empty list. Final hash checks confirm that the four article files are unchanged since the successful lint/variety runs; no redundant rerun was needed.

## Image verdict

Image: OK. Viewed `images/C7.webp` directly, 1280 × 720 WebP. It shows an unbranded parked scooter and two plain helmets in a quiet shaded lane. No people, faces, readable plate, lettering, logo, flag, screen or document is visible. The plate area is blank. The supplied generation brief specifies a fictional, unidentifiable scene, and the visible image is consistent with that brief. It respectfully suggests a shared vehicle and driver-identity question without depicting a real offence or accusing anyone.

## Points for lawyer confirmation

1. 통지서가 늦게 도착한 사건에서 송달 효력 발생일과 제85조 귀책자 고지의 실제 접수 마감일을 해당 처벌기관이 어떻게 산정하는지 확인이 필요합니다.
2. 외국인 운전자를 식별하고 통지하기에 충분한 증명서류의 범위와 서류 보완 접수 방식을 확인하면 좋습니다.
3. 제85조 고지와 제9조 의견 진술을 함께 제출할 때 해당 기관이 요구하는 접수 방식과 구분을 확인하면 좋습니다.

These are case-specific practice points, not unresolved assertions of automatic extension, document sufficiency or filing acceptance in the column.

## Reviewed versions

| File | SHA-256 |
|---|---|
| `drafts/C7/ko.md` | `9edf8c566a8b12be7b6847f11c4baebc99e5577d2828678a727db8035d9accaa` |
| `drafts/C7/ja.md` | `0237847c5a0be9548dfad0a149f0519ccb0f925d9870b28ebebf606bdf344ca8` |
| `drafts/C7/en.md` | `f8a38f43a94b2c65a8b7e4381ba914dd086d7fad74db8e325000dbdb0cce3f58` |
| `drafts/C7/zh-hant.md` | `9f47e5e5952b7274b9e169dd4c6d85e519fbf113d0594e338b341c1972ec7d8f` |
| `images/C7.webp` | `72642566ac596498d5e6f3d015f6e95f45e7398aa3dc30f508a3c05595e54fa6` |

VERDICT: PASS
