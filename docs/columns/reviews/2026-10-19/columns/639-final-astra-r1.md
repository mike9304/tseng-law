# C1 final review — Astra r1

Verdict: FIX. All four versions remain blocked by M1 and M2 below. The bounded edits listed here have been applied; the substantive procedure and litigant-role corrections have not. Image: OK.

Reviewer role: independent final reviewer, Astra r1 assignment. I did not author these drafts. This is an AI review, not a claim of lawyer or human native-speaker review. Review performed on 2026-10-20; the requested publication/source-check date of 2026-10-19 remains in each draft. No publication was performed.

## Scope checked

Read in full:

- `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, and `topics/C1.md`, including its OUT-OF-SCOPE list.
- `drafts/C1/ko.md`, `ja.md`, `en.md`, `zh-hant.md`, and `facts.md`. The fact sheet was treated as an assertion list, not as independent evidence.
- `research/C1-statutes.md` and both cited district-court judgment texts: `research/judgments/TPDV-113-簡上-219.txt` and `research/judgments/KLDV-114-基小-407.txt`.
- `SENTENCE-VARIETY-RULE.md`, including sections 5–6, `LESSONS.md`, the editorial skill and its review criteria, and `reviews/C1/voice-xreview.md`.
- Viewed `images/C1.webp` with the image viewer. Also read the changed passages after editing.

This is final-review round 1. There is no earlier Astra final-review log or fixer resolution table for C1. The earlier voice/cross-review is not a substitute for this review. Its added analogy wording, default interest, key-return chronology, statutory conditions and indirect Supreme Court attribution were checked against the judgments; its conclusion that all party roles were correct was not accepted (M2).

For each language the review covered, in order: law/facts; claim-to-source citations; hard rules and metadata; prose/variety; image suitability. The four versions were also compared against one another.

## Official-source verification

Used `curl -L --max-time 45 --retry 1 --compressed -sS` to open all six sources used by the columns, plus the Civil Code full-text and history pages. All eight requests returned HTTP 200. This was content verification, not merely a status check.

- [Civil Code Article 166](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=166): agreed form not completed → presumed not formed.
- [Article 245-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=245-1): paragraph 1, item 3, requires clearly bad-faith negotiating conduct and loss suffered by a counterparty who relied without negligence; paragraph 2 says two years of non-exercise.
- [Article 248](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=248): receipt of 定金 → presumed formation, not conclusive formation.
- [Article 249](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=249): all four items are subject to a different agreement; the payer/recipient/neither attribution conditions and mandatory effects match the saved research.
- [Taipei District Court, 113年度簡上字第219號, 2026-01-21](https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=TPDV%2c113%2c%e7%b0%a1%e4%b8%8a%2c219%2c20260121%2c1) (TP below).
- [Keelung District Court, Keelung summary division, 114年度基小字第407號, 2025-04-29](https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=KLDV%2c114%2c%e5%9f%ba%e5%b0%8f%2c407%2c20250429%2c1) (KL below).

The full saved TP judgment body, 5,804 characters after removing whitespace, and the full saved KL judgment body, 3,080 characters after removing whitespace, occur verbatim in the corresponding live official pages after the same normalization. Court, case number, decision date, reasoning and appeal notices were checked against those bodies. No private-party name is reproduced in this log or in the columns.

The [Civil Code full-text page](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000001) and [history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001) confirm the whole-law latest amendment date of 2026-08-17. The pending-effect notice concerns Articles 166-1 and 1223, not the four provisions used here. The drafts do not mistake that whole-law date for an amendment/effective date of Articles 166, 245-1, 248 or 249. Article 422 is in the research file but is not used in the columns.

Supreme Court 93年度台上字第441號 and 96年度台上字第2565號 appear only as authorities cited by TP/KL. That attribution is supported by the saved and live lower-court texts. I do not certify an independent reading of those Supreme Court judgments or add them as directly researched sources.

There are no additional outside-government or foreign-law sources in C1. The English prose was checked against the Chinese official provisions; it is not represented as the MOJ's official English translation.

## Remaining MAJOR findings

### M1 — all four languages: the small-claims appeal notice omits its legal-error-only restriction

Original:

- `drafts/C1/ko.md:69`: “송달받은 뒤 20일 안에 같은 법원 합의부에 상소할 수 있다는 안내도 있습니다.”
- `drafts/C1/ja.md:69`: “送達から20日以内に同じ法院の合議体へ上訴できると案内しています。”
- `drafts/C1/en.md:68`: “an appeal may be filed within 20 days of service.”
- `drafts/C1/zh-hant.md:69`: “可在送達後20日內上訴。”

→ Problem & reason: these sentences give an affirmative procedural entitlement and deadline but omit the condition limiting this small-claims appeal to a judgment contrary to law. The omission can lead a reader to treat the appeal as a general rehearing of disputed facts. It is a substantive procedural limitation, not a stylistic preference. The same defect occurs in all four versions; agreement between translations does not cure it.

Official source passage, KL's notice after the reasons:

> 對於本件判決如有不服，應於收受送達後20日內向本院提出上訴書狀，上訴於本院合議庭，並按他造當事人之人數附具繕本。當事人之上訴，非以判決違背法令為理由不得為之

→ Fix required, not applied: retain the existing KL link and the service-based 20-day period, but expressly state the restriction. Suitable replacements for the appeal sentence are:

- ko: “판결문은 판결의 법령 위반을 이유로, 송달받은 뒤 20일 안에 같은 법원에 상소장을 내 합의부에 상소할 수 있다고 안내합니다.”
- ja: “判決文は、判決の法令違反を理由とする場合に限り、送達から20日以内に同じ法院へ上訴状を提出し、同院の合議体へ上訴できると案内しています。”
- en: “The judgment permits an appeal only on the ground that it is contrary to law; the appeal must be filed in the same court within 20 days of service, for its collegiate panel to hear.”
- zh-hant: “判決書載明，上訴須以判決違背法令為理由，並於收受送達後20日內向同一法院提出上訴書狀，由該院合議庭審理。”

No new statute citation or excursion into appeal procedure is needed; the cited judgment itself supplies the restriction. This remains for the fixer because it changes the substance of the procedural advice in the body. E07 below repairs only the missing same-paragraph judgment citation, not this omission.

→ Facts preserved by the required correction: KL is a district-court small-claims ruling, no finality is asserted, the period runs from service, and the appeal goes to the same court's collegiate panel. The NT$12,000 dismissal and the unresolved NT$6,000 principal-return question remain unchanged.

### M2 — all four languages: the Keelung narrative merges the intended tenant with the payer/plaintiff

Original:

- ko:63: “세입자는 중개인과 집을 본 다음 날 아침 定金 NT$6,000을 보냈고”; ko:65–67 then attributes refusal and the NT$1,000 costs to “세입자”.
- ja:63: “借り手は仲介業者と内見した翌朝、定金NT$6,000を振り込みました”; ja:65–67 attributes refusal and costs to “借り手”.
- en:62: “The prospective tenant viewed a property with an agent and transferred NT$6,000”; en:66: “the tenant was ordered to bear the NT$1,000 court costs”.
- zh-hant:63: “房客透過仲介看屋，隔天一早就匯了6,000元定金”; zh-hant:67: “訴訟費用1,000元也由房客負擔”.
- Each FAQ 2 also uses the same tenant label when summarizing the plaintiff's refusal.

→ Problem & reason: the intended lessee was the plaintiff's father. The plaintiff was the person who viewed the property, transferred the money, sought the lease draft and sued. On signing day the father attended as the proposed lessee; the plaintiff participated by telephone and the dispute concerned the plaintiff signing the guarantor field. Describing all of these actors simply as the tenant conceals precisely whose guarantee was being requested and attributes the plaintiff's court-cost liability to the intended lessee. That is a material factual/role error in the central case, not an optional naming preference.

Official source passages, KL (private names omitted by selecting name-free passages):

> 於同年10月21日簽約時，只有原告父親到場，原告透過電話表示不願意在「連帶保證人欄」簽名

The above is the landlord's account and must remain attributed as such. The court's reasoning then describes:

> 原告父親以承租人身分當場與被告達成「先支付1年租金即可免連帶保證人」之合意

and expressly notes:

> 原告未爭執上情

The operative costs order is:

> 訴訟費用新臺幣1,000元由原告負擔。

The plaintiff's account at reasons I.1 also says the proposed lease was to be in the plaintiff's father's name. Neither a private name nor an inference about the plaintiff's gender is needed.

→ Fix required, not applied: rewrite the Keelung case paragraphs and the actor references in FAQ 2 to distinguish the payer/plaintiff from the intended lessee/father throughout. A suitable first identification in each version is:

- ko: “원고는 아버지 명의로 집을 빌리려 했습니다. 중개인과 집을 본 다음 날 아침 定金 NT$6,000을 보냈습니다.”
- ja: “原告は父親名義で借りる予定の物件を内見し、翌朝に定金NT$6,000を振り込みました。”
- en: “The plaintiff viewed a property through an agent to arrange a lease in the plaintiff's father's name, then paid NT$6,000 the next morning.”
- zh-hant: “原告為了讓父親承租而透過仲介看屋，隔天一早匯了6,000元定金。”

Then identify the father as the person who attended to sign and discussed prepaying a year's rent; identify the plaintiff as the payer, proposed guarantor who initially refused that signature by phone, person later refusing to proceed, claimant for double return, and person ordered to bear the NT$1,000 costs. Keep the account of the signing-day alternatives attributed to the landlord and not disputed by the plaintiff. Keep the court's two conditional readings; do not turn either substitute agreement into an unconditional established fact. The general reader-facing hypothetical and the Taipei case do not require these role changes.

The source already permits the correction; the fixer must revise the case's factual and legal-role narrative, rather than have the final reviewer silently change who the parties were. `facts.md` C1/C3 and related shorthand should be reconciled by the fixer as well; I did not edit the research or fact sheet.

→ Facts preserved by the required correction: NT$6,000 paid before the draft was requested; approximately two hours between payment and that request; the guarantor disagreement and proposed substitutes; refusal of double NT$12,000; NT$1,000 costs against the plaintiff; no adjudication here of principal return under item 4 or retention under item 2. No private-party names, age or gender should be added.

## Edits applied by this reviewer

The complete before/after changes are in `reviews/C1/final-astra-r1-edits.diff`. Each item below records Original → problem & reason → applied fix → facts preserved. These edits do not resolve M1 or M2.

1. E01, all four, notarization heading. Original: ko “공증을 약속했다면 계약은 아직입니다”; ja “公証を約束していたなら、賃貸借はまだ成立していない”; en “A promise to notarize meant no lease yet”; zh “約好要公證，租約就還沒成立”. → The ko/ja/zh headings turn the body's qualified presumption into an absolute and omit the incomplete-form condition; the English heading can also be more clearly tied to its case. → Applied case-specific headings: “공증을 마치지 않은 타이베이 사건”; “公証が済んでいなかった台北の事案”; “The agreed notarization in the Taipei case”; “臺北案未完成的公證與租賃預約”. → The body already correctly states Articles 166/248 and TP's preliminary-agreement finding; none of that analysis changed.

2. E02, all four, FAQ 2. Original: “세입자가 마지막에 서명을 거부했든” / “借り手が最後に署名しなかった場合も” / “the tenant's final refusal to sign” / “或是房客最後不願簽約”. → The FAQ lost the body's alternative premise that substitute terms had been agreed before the refusal. → Applied that condition and retained the other reading, no guarantor agreement; English was split into two readable sentences. → Both conditional readings, the double-return dismissal and the principal-return caveat remain. Actor labels still require M2; this was only the expressly authorized repair of a condition already correct in the body.

3. E03, en FAQ 3. Original: “The claim lapses after two years.” → Drops the statutory non-exercise condition that the body and other languages already state. → Applied “The claim lapses if not exercised for two years under paragraph 2.” → Article 245-1's period, non-exercise requirement and paragraph reference are explicit; no starting date or tolling doctrine was invented.

4. E04, en summary. Original: “Two Taiwan district courts … who was responsible decided refund, loss or double”. → Can imply that the two actual dispositions decided all three outcomes, despite the body's express KL limitation. → Applied a 158-character general summary: “In Taiwan, a holding deposit paid before signing can be returned, lost or doubled. The parties' agreement and responsibility for the failed lease both matter.” → The contractual-variation and responsibility qualifications remain; the actual court outcomes and article citations remain in the body. This is a precision repair of metadata, not removal of substantive analysis for variety.

5. E05, en visa/job paragraph. Original: “A line sent with the deposit saying what happens to the money in that case would, if proven, take priority over the four rules”; “Since [Article 249] applies …”. → Unlike the other three versions, the English can make proof of one party's message enough, instead of proof of an agreement. The causal connector also obscured the rule. → Applied “If both sides agree in messages … their agreement takes priority … if it can be proven” and “Unless the parties agreed otherwise, a dispute under [Article 249] can turn on whether …”. → Restores the agreement condition from Article 249 and the other versions; the unresolved visa/job attribution question and both item numbers remain.

6. E06, all four, introductory analogy paragraph. Original: the claim “the courts in Taipei and Keelung applied … by analogy” had only an Article 249 link. → The statute does not itself state the pre-contract analogy. → Applied official TP and KL links to the court references in that same paragraph. → All words of the legal rule, statutory link and conclusions preserved; no new authority added.

7. E07, all four, last Keelung paragraph. Original: the paragraph containing the judgment's claim limitation and 20-day appeal notice linked only Article 249. → That article does not establish this judgment's scope or appeal notice. → Added the existing official KL URL on “판결문” / “判決文” / “judgment states” / “判決書” in the same paragraph. → No procedural text changed; M1 remains explicitly unresolved.

8. E08, all four, visa/job paragraph's last sentence. Original: “타이베이 법원이 책임을 가린 근거도 …” / “台北の裁判所が責任の所在を判断した根拠も …” / “The Taipei court, too, settled responsibility …” / “臺北法院認定責任歸屬 …” carried only the statute link earlier in the paragraph. → This is a case finding requiring its own case source in that paragraph. → Linked the court reference to TP. → Message date and the limited responsibility finding unchanged.

9. E09, all four, final contact paragraph. Original final sentences: “사무소는 …에 있습니다” / “事務所は…にあります” / “The office is at …” / “事務所地址是…”. → The closing ended with the shared office template rather than this column's facts (variety self-check 7). → Moved the exact address to the beginning and ended with the transfer records and message screenshots showing why signing failed. → Firm name, exact language-specific address, email, soft consultation offer, and English “English-speaking lawyer in Taipei” all remain. No promised outcome added.

10. E10, zh opening. Original: “「房子不能租出去，說我小叔要用」——傳這則訊息的是房東太太…”. → This repeats C2 zh's quotation-first opening type (variety self-check 2); combined with the original formula ending, it was an initial manual monotony failure. → Began with the paid deposit, keys and fit-out, then retained the exact quotation inside the paragraph. → One month's rent, the wife's key handover, painting/woodwork, unsigned/unnotarized status, refund statement, quotation and TP link are preserved. It does not say work was still underway on December 12.

11. E11, ko opening. Original: “열쇠는 이미 받은 뒤였습니다.” → Deletion test: the following sentence already says the landlord's wife handed over the keys used to admit the contractor. → Deleted only that repeated lead. → Key delivery, payment, fit-out, chronology and source remain, with at least two very short sentences still present elsewhere.

12. E12, ko classification sentence. Original: “입약정금(立約定金)으로 성질을 정했습니다”. → Awkward legal translation. → Applied “입약정금(立約定金)으로 판단했습니다”. → Still TP's classification of this payment; not a new general rule.

13. E13, en, FAQ 2 question and Keelung reasoning paragraph. Original: “joint guarantor”. → An imprecise English label for 連帶保證人 may suggest merely multiple guarantors. → Applied “joint and several guarantor” in both occurrences. → The Chinese term and the judgment's guarantor issue remain; no foreign-law proposition was introduced.

14. E14, ja defense paragraph. Original: “無断で立ち入って塗装をしたせいで契約が壊れた”. → Unnatural description of a contract that was not concluded. → Applied “無断で立ち入って塗装をしたために契約を結べなくなった”. → Remains the landlord's rejected allegation, with the December 11 date, later evidence discussion and TP citation intact.

15. E15, ko first substantive use. Original: “월세 한 달 치를 定金으로 보냈고”. → The unfamiliar Chinese term had no Korean reading at first use. → Applied “월세 한 달 치를 정금(定金)으로 보냈고”. → Only a pronunciation aid; amount, payment purpose and legal term preserved.

## Law, citations and hard rules after the bounded edits

Apart from M1/M2, the legal core agrees across the four versions: Articles 248 and 166 are presumptions; TP found an agreed notarization form incomplete, a preliminary agreement and 立約定金; TP/KL applied Article 249 by analogy; a different agreement comes first; the payer/recipient/neither branches are not interchanged. Article 245-1 keeps both clearly bad-faith conduct and reliance without negligence, the loss requirement and the two-year non-exercise period. The extra payment in TP includes NT$7,500 labor and 5% annual default interest. The column does not generalize the court's costs or interest into a universal charge.

Arithmetic checked:

| Item | Calculation | Result |
|---|---|---|
| TP additional deposit award | 88,000 × 2 − 88,000 already returned | NT$88,000 |
| TP additional principal total | 88,000 + 7,500 | NT$95,500, plus stated interest |
| KL demand and costs | 6,000 × 2 | NT$12,000 denied; NT$1,000 costs against the plaintiff (M2) |
| ko hypothetical | 18,000 × 2 − 18,000 | NT$18,000 more |
| ja hypothetical | 20,000 × 2 | NT$40,000, before any refund |
| en hypothetical | 10,000 × 2 − 10,000 | NT$10,000 more |
| zh hypothetical | 12,000 × 2 − 12,000 | NT$12,000 more |

Hypothetical labels remain explicit in all four versions. The alternative payer/neither branches retain their stated principal amounts. The Taipei space is not described as a residential flat. TP's 2026-01-21 appellate dismissal and no-further-appeal statement are accurately identified; KL's 2025-04-29 small-claims disposition is not called final. Its narrower principal-return scope is retained.

All four used statute articles are in `research/C1-statutes.md`; no extra statute was introduced. All judgment links use the exact URLs on line 1 of the saved files. Sources lists contain the four provisions and both directly used judgments, with check date 2026-10-19. Same-paragraph source additions E06–E08 fix the identified source mismatches; no existing official or internal URL was removed.

Internal links: ko 2; ja/en/zh-hant 3 each. The lint verified every target in the corresponding language's `snapshot/src/content` directory. They do not link to this batch. This verifies the supplied repository snapshot's existence, not a new production deployment check. Out-of-scope topics remain one-sentence referrals without substantive rules; no agent-fee, tax, tenancy-standard-term, penalty-reduction or notarized-enforcement analysis was added.

Frontmatter retains the required keys, `topic: litigation`, the literal NNN image path, language-only audience, three FAQs, date fields and `author: legal-ai-assistant`. English title is 64 characters, so its different 45-character seoTitle is required and valid; the final summary is 158 characters with none of the forbidden characters. Read times remain plausible for the lengths. Exact contact forms and the English consultation phrase are present. No private-party names, bold, phone/hotline numbers, messaging IDs, attorney byline, claimed lawyer/native review, or promised results appear. No foreign-law note is asserted.

## Voice and sentence-variety verification

Titles are specific to the failed lease and deposit question. No imperative checklist heading, invented client experience or generic introductory promise remains. Korean stays in 합니다체; Japanese stays in です・ます prose; Chinese uses Taiwan terms; English uses active, ordinary explanations. The two remaining major findings concern facts/procedure, not preferences about already accepted prose.

Opening deletion check: E11 removes the repeated Korean first sentence. The remaining ko opening adds the premises, payment, key delivery, work and cancellation message; its second paragraph adds the refund, additional award and appeal outcome. The ja result-first opening supplies the appellate context before the payment/work facts. The en date/message opening supplies the reason the deal failed, followed by payment/work and the appeal outcome. The zh revised scene and subsequent result paragraph supply the work-before-signing context, cancellation message, refund and appeal outcome. Removing these substantive passages would lose facts; no generic lead was retained for padding.

Compared openings, headings and closings against the three most recent same-language articles in the supplied snapshot (all dated 2026-10-18):

- ko: `snapshot/src/content/columns/636-taiwan-related-company-loan-permitted-conditions.md`, `635-taiwan-traffic-ticket-other-driver-notice.md`, `634-taiwan-employee-resignation-notice-indefinite-contract.md`.
- ja: the same filenames under `snapshot/src/content/columns-ja/`.
- en: the same filenames under `snapshot/src/content/columns-en/`.
- zh-hant: the same filenames under `snapshot/src/content/columns-zh/`.

Those comparators use a statute/percentage or group-loan rule, traffic-notice question/rule, and employment hypothetical. C1's evidence-led rental dispute is distinct. Shared lawyer-retainer/contact sections are required by the brief; E09 gives this ending a deposit-specific evidence request. This comparison is to supplied snapshot files, not a claim that I checked the live site's latest publication ordering.

Also checked C2–C4 openings in each language. C1 ko is a case scene, ja a case result, en the dated cancellation message, and zh a scene after E10. None begins with a stock hypothetical formula. In particular, E10 removes C1 zh's duplication of C2 zh's quotation-first opener. No edits were made to C2–C4.

Initial manual findings, now fixed:

- MONOTONY: self-check 2, repeated batch opening type — “「房子不能租出去，說我小叔要用」——傳這則訊息的是房東太太” — move the retained quotation after the concrete deposit/key/work scene; applied in E10.
- MONOTONY: self-check 7, formula closing — “事務所地址是臺北市大同區承德路一段35號7樓之2。” and the corresponding office-address endings in ko/ja/en — retain the exact contact details but end with the records showing why this lease was not signed; applied in E09.

Final manual self-check 2–9: no stock/repeated C1 opening type; at least two very short sentences in every version; no paragraph-opening word used three times; no three consecutive claim–statute–caveat paragraphs; the contact paragraph supplies a non-citation paragraph without an unsupported legal claim; contrast templates remain below the limit; closing is tied to the failed lease's records; ko/ja registers are consistent. No variety edit dropped a legal fact, number, source URL or hypothetical label. The deleted Korean key sentence is fully represented by the next sentence; the Chinese quotation is retained verbatim.

## Executed checks on the reviewed files

After each draft mutation, the requested lint command was run on that draft and returned OK. The final actual-file variety command was run in each language. Full command lines and stdout are saved in `reviews/C1/final-astra-r1-checks.txt`.

Commands:

```text
python3 /Users/son7/tseng-col-1019-work/lint.py /Users/son7/tseng-col-1019-work/drafts/C1/<lang>.md <lang> taiwan-rental-holding-deposit-dingjin
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1019-work/drafts/C1/<lang>.md
```

| Language | Lint | Body length | Variety CV | Very short fraction | Variety FAILs |
|---|---|---:|---:|---:|---:|
| ko | OK, exit 0 | 3,442 characters | 0.478 | 0.086 | 0 |
| ja | OK, exit 0 | 4,003 characters | 0.481 | 0.096 | 0 |
| en | OK, exit 0 | 1,489 words | 0.545 | 0.159 | 0 |
| zh-hant | OK, exit 0 | 2,640 characters | 0.613 | 0.154 | 0 |

The checker reports only a Korean 76% 니다 ending WARN and Japanese 78% desu-masu ending WARN. Manual reading confirms consistent required registers, not register mixing. All paragraph/table conditions and relevant links were also inspected manually; passing lint cannot detect M1/M2.

Reviewed SHA-256 values after all applied edits:

```text
ko.md       44fe69a9768d78494f4ade70460d2bcd48fecaa155c9d0ac81cea6b97faf1700
ja.md       6d2de24ba59188755579f94534245562f1537bc2252c6d99a49deccb059d899c
en.md       6d81b178845bf8e4e6af639299336e703a78448d8277623948120958be308bef
zh-hant.md  979065c7f9a11fcb22d864949b37adba4d56348b986a0048d60b6ec5480316cf
```

## Image verdict

OK. Viewed `images/C1.webp` (1280 × 720). The illustrative rental-room scene contains keys, an unmarked envelope and a blank sheet on a table. There are no people/faces, readable writing, logos, flags or identifiable case documents, and no identifiable case party or prominent landmark. It fits a pre-signing rental/deposit dispute and is respectful. It should remain an illustration, not be represented as a photograph of either judgment's actual premises.

Image SHA-256: `069ceef794f6db49b191560e801914246bb0c2eeda5702cd1505ee4fb26d8ec2`.

## Points for lawyer confirmation

- 비자 거절·발령 변경의 귀책을 민법 제249조 제2호와 제4호 중 어디에 둘지, 환불 특약은 유효한지 확인이 필요합니다.
- 민법 제245조의1의 신의성실 위반·무과실 신뢰 요건, 인정되는 공사비 범위와 2년 기간의 기산을 확인해야 합니다.
- 임차 예정자와 정금 지급자가 다를 때 청구권의 주체와 필요한 증거를 실제 약정에 따라 확인해야 합니다.

The next round should first verify M1 and M2 item by item against a fixer resolution table, then review the changed passages and rerun lint/variety. Existing source texts suffice to make the identified corrections; new unsupported law should not be added. The applied E01–E15 edits are not separate unresolved requests.

VERDICT: FIX
