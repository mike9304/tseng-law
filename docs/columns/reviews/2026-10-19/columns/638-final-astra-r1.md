# C4 independent final review — round 1

Verdict: PASS after the bounded corrections recorded below. Remaining MAJOR findings: 0. Remaining hard-rule failures: 0. Image: OK.

Reviewer role: independent final reviewer. I did not write the submitted drafts. I applied the permitted corrections and reviewed the resulting files; this is not a claim of human lawyer or native-speaker review. Review completed on 2026-10-20 KST. The required editorial publication/source-check date remains 2026-10-19.

## Scope checked

Read in full: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C4.md`, all four `drafts/C4/{ko,ja,en,zh-hant}.md` files, `drafts/C4/facts.md`, `research/C4-statutes.md`, and each of the four cited judgment texts listed below. Read the sentence-variety rule, including sections 5–6, and the recurring lessons. Viewed `images/C4.webp` with the image viewer.

This is round 1; no earlier Astra final-review findings or fixer resolution table were supplied for this round. The writer's fact sheet was checked against the complete judgment texts and official statute pages, rather than treated as authority.

For each language, reviewed in the requested order: law/facts, citations, hard rules, prose, and the common image. The final versions are the versions identified by the SHA-256 table below.

| Language | Law and facts | Citations | Hard rules | Voice and variety | Image |
|---|---|---|---|---|---|
| ko | PASS; Taipei account-user label and withdrawal wording corrected | PASS; 11 existing-source links added | PASS | PASS; campus phrasing repaired; 0 checker FAIL | OK |
| ja | PASS; Taipei account-user label and withdrawal wording corrected | PASS; 11 existing-source links added | PASS | PASS; campus phrasing repaired; 0 checker FAIL | OK |
| en | PASS; account-user label, withdrawal/timing wording and joint-liability terminology corrected | PASS; 12 existing-source links added | PASS | PASS; civil-outcome heading clarified; 0 checker FAIL | OK |
| zh-hant | PASS; unsupported full-withdrawal wording corrected | PASS; 11 existing-source links added | PASS | PASS; Taiwan terminology; 0 checker FAIL | OK |

## Official-source verification

Fetched the six cited single-article pages, the two full-law pages, and all four official judgment URLs with `curl -L --silent --show-error --max-time 25 --retry 1`. All twelve returned HTTP 200 with the expected official page titles. After whitespace normalization, every fetched article text matched `C4-statutes.md`, and the complete substantive text of each saved judgment was found in the corresponding live official response.

The Civil Code's whole-law amendment date is 民國115年08月17日; the Code of Criminal Procedure's is 民國115年05月13日. The Civil Code page's pending-commencement notice concerns Articles 166-1 and 1223, not the five Civil Code articles used here. No draft represents that whole-law date as an amendment or commencement date for an individual cited article.

The ten sources below are present in every language's final sources section. There are no other external factual or foreign-law sources in the drafts.

- [S182](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=182): Civil Code Article 182, paragraphs 1–2: lack of knowledge AND benefit no longer existing; knowledge at receipt or acquired later; the corresponding benefit, interest and damage.
- [S184](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=184): Civil Code Article 184, paragraph 1, first sentence: intent OR negligence, unlawful infringement, and damages.
- [S185](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=185): Civil Code Article 185, paragraphs 1–2: joint tort liability; instigators/helpers deemed joint actors.
- [S197](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=197): Civil Code Article 197, paragraph 1: two years of non-exercise from knowledge of BOTH damage and the liable person; ten years from the tort.
- [S487](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=487): Code of Criminal Procedure Article 487, paragraph 1: the injured person MAY bring an attached civil claim against the defendant and persons liable under the Civil Code.
- [S273](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=273): Civil Code Article 273, paragraph 1: all or part may be demanded from one, several or all liable debtors, simultaneously or successively.
- [J1](https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=TNHV%2c112%2c%e9%87%91%e7%b0%a1%e6%98%93%2c108%2c20240529%2c2): Taiwan High Court, Tainan Branch, 112年度金簡易字第108號, 2024-05-29; Malaysian student; claim dismissed.
- [J2](https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=TNHV%2c112%2c%e9%87%91%e7%b0%a1%e6%98%93%2c108%2c20240626%2c3): Same court and case number, 2024-06-26; other account provider liable jointly for NT$28,985; no liability for the student's NT$149,967; cash mule liable for both amounts; emotional-distress claim rejected.
- [J3](https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=PCDV%2c113%2c%e7%b0%a1%e4%b8%8a%2c499%2c20250520%2c1): Taiwan New Taipei District Court, 113年度簡上字第499號, 2025-05-20; district-court appeal panel; first-instance judgment reversed; NT$100,000 plus interest.
- [J4](https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=TPDV%2c114%2c%e7%b0%a1%e4%b8%8a%2c137%2c20250702%2c2): Taiwan Taipei District Court, 114年度簡上字第137號, 2025-07-02; district-court appeal panel; victim's appeal dismissed; neither tort nor unjust-enrichment recovery against the account user.


The four versions preserve the same legal core: a helper's own intent or negligence and adequate causation; the claimant's burden on the tort elements; fact-specific civil outcomes despite non-prosecution; the student's circumstances as one court's assessment rather than a foreigner exemption; the limited NT$28,985 award in J2 as that case's result rather than a universal cap; both Article 197 periods; and both Article 182(1) conditions. Article 182(2)'s mandatory repayment, interest and damages are retained. Article 487 remains permissive, and the student's fee payment curing the procedural defect is attributed to J1.

J3's non-prosecution decisions concerned other victims' transfers through the account, as the detailed narrative in every version states. Nothing in the drafts says the civil appeal was itself a criminal acquittal. J3 contains an inconsistent closing boilerplate phrase, 「本件上訴為無理由」; its operative order 「原判決廢棄」 and substantive section 四 expressly grant the victim's appeal and payment claim. The drafts correctly follow the operative order and substantive holding.

Amounts checked: 49,989 × 3 = 149,967; 149,967 + 28,985 = 178,952; the requested NT$500,000 is the total claim, not the award or the student's account inflow. J3's NT$100,000 plus interest is correct. ROC 113/114 judgment dates correspond to 2024/2025. No invented case, exchange conversion, hypothetical arithmetic, or unsourced statutory rate was added.

## Findings and disposition

### I1 — Taipei account user confused with the registered holder — APPLIED

Original → ko 「명의인은 … 아버지 명의 계좌를 관리하다가」; ja 「父親名義で … 口座を管理していた名義人」; en “This holder managed an account opened in the holder's father's name”.

Problem & reason → J4 distinguishes the father in whose name the account was opened from the respondent who managed and supplied it. Its undisputed facts state that the account was opened in the father's name and then entrusted to the respondent: 「隨後將系爭帳戶交予被上訴人管理使用」. Calling the respondent 명의인/名義人 is inaccurate; “holder” also obscures that distinction in English. The zh-hant wording 「持有人管理父親名下…的帳戶」 already distinguishes use from registration.

Fix (applied) → Use 계좌 제공자/이 사람, 口座を渡した人/この人, and account user/this person for the Taipei respondent. Correct the linked unjust-enrichment passage and the relevant English synthesis/FAQ wording as well. All exact replacements are listed below.

Facts preserved → The father remains the registered holder; the respondent manages and hands over the online-banking information; the home-loan purpose, trust, absence of payment, doubts, later questioning, evidential burden, lack of proven fault and Article 182 outcome remain unchanged. No liability analysis was rewritten.

### I2 — “All the money was gone” and a precise mailing interval exceeded J1 — APPLIED

Original → zh-hant 「幾分鐘內就被車手領光」; en “Within minutes it was gone”; ko 「돈은 몇 분 만에 빠져나갔습니다」; ja 「お金は数分のうちに引き出されています」. English also said “Days earlier”.

Problem & reason → J1's undisputed facts 三㈣ list three receipts totalling NT$149,967 and repeated withdrawals between 19:09 and 19:13. The listed cash withdrawals total 7 × 20,000 + 9,000 = 149,000, with fee details also mentioned. That does not establish that all NT$149,967 was withdrawn or that the account balance reached zero. The separate second account is expressly described as emptied; that wording cannot be transferred to the student's account. J1 dates the mailing only as 「於111年3月29日前某日」, not a proved number of days before the transfers.

Fix (applied) → Describe repeated withdrawals over minutes without claiming complete depletion in all four languages. Replace “Days earlier” with “Earlier”.

Facts preserved → The three transfers, NT$149,967, March 29, 2022, the evening timing, repeated rapid withdrawals, earlier card mailing and the judgment citation remain. No closing balance is invented, no amount/date is removed, and the judgment's damages outcome is unchanged.

### I3 — Court-derived conclusions and FAQ rules lacked local source links — APPLIED

Original → The comparative paragraph beginning 「세 사람은 모두 불기소 처분을 받았습니다」 / 「三人とも不起訴でした」 / “Prosecutors had declined to charge all three” / 「三個人都獲不起訴」 had no official links. The Article 182 and 197 paragraphs linked statutes but not the judgments supplying their case facts and holdings. FAQ answers named rules and judgments without local links.

Problem & reason → A statute page does not substantiate a particular court's facts, interpretation or result. The sources list and an earlier paragraph do not replace the brief's inline claim/source requirement.

Fix (applied) → Add J1/J3/J4 at the existing court/case references in the comparative paragraphs, J4 at its Article 182 application, and J3 at its actual-knowledge/time-bar analysis. Add the existing statutory and judgment links to each FAQ answer; English FAQ 1 now names Tainan and Taipei to attach both sources unambiguously.

Facts preserved → The citations all come from the supplied research/sources, using the exact official judgment URLs on line 1 of the saved files. No new authority, article, rule, condition, exception, number or outcome was introduced. Each language still uses ten unique official sources, all listed at the end.

### I4 — Bounded translation and legal terminology clarifications — APPLIED

Original → ko 「직장이 아닌 단순한 캠퍼스」; ja 「環境の単純なキャンパス」; en “a simple campus setting”; en “jointly liable” in the Article 185 definition; heading “Two cleared, one ordered to pay”.

Problem & reason → The campus expressions translate 「環境單純之校園」 too literally. “Jointly and severally liable” is the clearer English term for 連帶, already explained by the draft through Article 273. “Cleared” can suggest a criminal outcome in a section comparing civil liability.

Fix (applied) → Express the student's school-centred life and lack of workforce experience naturally, use “jointly and severally liable” in the definition, and change the heading to “Two found not liable, one ordered to pay”.

Facts preserved → J1's school/work distinction, limited experience, individual circumstances and no-negligence conclusion remain; Article 273's scope is unchanged; the heading still reports two civil non-liability outcomes and one payment order.

## Applied-edit inventory

Every individual replacement is listed here. Source-only edits preserve the displayed words and insert the indicated official links. Line numbers refer to the final files. S/J identifiers refer to the official links above.

### ko

- L15: `대만 민법 제184조 제1항` → added S184 inline link(s); wording and facts preserved.
- L15: `2025년 5월 20일 판결에서` → added J3 inline link(s); wording and facts preserved.
- L15: `책임이 부정된 판결이 있으니` → added J1 inline link(s); wording and facts preserved.
- L17: `2024년 6월 26일 판결에서` → added J2 inline link(s); wording and facts preserved.
- L19: `민법 제197조 제1항` → added S197 inline link(s); wording and facts preserved.
- L19: `신베이지방법원 항소부는 '안다'를` → added J3 inline link(s); wording and facts preserved.
- L28: `돈은 몇 분 만에 빠져나갔습니다` → `몇 분간 인출이 이어졌습니다`. Applied for withdrawal wording; legal conditions and outcome preserved.
- L48: `직장이 아닌 단순한 캠퍼스에서 지내` → `직장 생활 없이 학교에서 지내`. Applied for natural phrasing; legal conditions and outcome preserved.
- L54: `다시 명의인 편에 섰습니다` → `계좌 제공자의 손을 들어 주었습니다`. Applied for taipei account user; legal conditions and outcome preserved.
- L54: `명의인은 주택 대출용으로 만든 아버지 명의 계좌를 관리하다가` → `이 사람은 주택 대출용으로 만든 아버지 명의 계좌를 관리하다가`. Applied for taipei account user; legal conditions and outcome preserved.
- L54: `명의인은 처음에 사기가 아닌지` → `제공자는 처음에 사기가 아닌지`. Applied for taipei account user; legal conditions and outcome preserved.
- L54: `생길 수 있음을 명의인이 알았거나` → `생길 수 있음을 제공자가 알았거나`. Applied for taipei account user; legal conditions and outcome preserved.
- L54: `명의인 자신도 속은 사람이었습니다` → `제공자 자신도 속은 사람이었습니다`. Applied for taipei account user; legal conditions and outcome preserved.
- L56: `네 판결 중 타이난분원뿐이고` → added J1 inline link(s); wording and facts preserved.
- L56: `채팅 기록은 타이베이 사건에서는` → added J4 inline link(s); wording and facts preserved.
- L56: `신베이 사건에서는 확인하지 않았다는` → added J3 inline link(s); wording and facts preserved.
- L64: `타이베이 항소부는 명의인이 사기를 몰랐고` → `타이베이 항소부는 제공자가 사기를 몰랐고`; linked J4. Applied for taipei account user and source; legal conditions and outcome preserved.
- L68: `신베이 항소부는 '안다'를` → added J3 inline link(s); wording and facts preserved.

### ja

- L15: `民法第184条第1項` → added S184 inline link(s); wording and facts preserved.
- L15: `2025年5月20日の判決で` → added J3 inline link(s); wording and facts preserved.
- L15: `責任が否定された判決もあり` → added J1 inline link(s); wording and facts preserved.
- L17: `2024年6月26日の判決は` → added J2 inline link(s); wording and facts preserved.
- L19: `民法第197条第1項` → added S197 inline link(s); wording and facts preserved.
- L19: `新北地方法院の控訴審は「知った」を` → added J3 inline link(s); wording and facts preserved.
- L26: `お金は数分のうちに引き出されています。` → `その後、数分間にわたって出金が続きました。`. Applied for withdrawal wording; legal conditions and outcome preserved.
- L46: `留学生は職場で働いていたわけではなく、環境の単純なキャンパスで学んでいたため` → `留学生はまだ社会に出て働く立場ではなく、生活の中心は大学だったため`. Applied for natural phrasing; legal conditions and outcome preserved.
- L52: `再び名義人側の主張を認めました` → `口座を渡した人に賠償責任を認めませんでした`. Applied for taipei account user; legal conditions and outcome preserved.
- L52: `口座を管理していた名義人が` → `口座を管理していた人が`. Applied for taipei account user; legal conditions and outcome preserved.
- L52: `名義人は早い段階で` → `この人は早い段階で`. Applied for taipei account user; legal conditions and outcome preserved.
- L52: `生じうることを名義人が知り` → `生じうることをこの人が知り`. Applied for taipei account user; legal conditions and outcome preserved.
- L54: `4件のうち台南分院だけで` → added J1 inline link(s); wording and facts preserved.
- L54: `台北の事件では疑って` → added J4 inline link(s); wording and facts preserved.
- L54: `新北の事件では確認しなかった` → added J3 inline link(s); wording and facts preserved.
- L62: `台北地方法院の控訴審は、名義人が詐欺を知らず` → `台北地方法院の控訴審は、口座を渡した人が詐欺を知らず`; linked J4. Applied for taipei account user and source; legal conditions and outcome preserved.
- L66: `新北の控訴審は「知った」を` → added J3 inline link(s); wording and facts preserved.

### en

- L15: `Article 184, paragraph 1` → added S184 inline link(s); wording and facts preserved.
- L15: `a judgment of May 20, 2025` → added J3 inline link(s); wording and facts preserved.
- L15: `In two other rulings, account holders` → `In Tainan and Taipei, account providers`; linked J1 / J4. Applied for faq source and account user; legal conditions and outcome preserved.
- L17: `a judgment of June 26, 2024` → added J2 inline link(s); wording and facts preserved.
- L19: `Article 197, paragraph 1` → added S197 inline link(s); wording and facts preserved.
- L19: `The New Taipei appeal panel read` → added J3 inline link(s); wording and facts preserved.
- L26: `Within minutes it was gone` → `Withdrawals followed within minutes`. Applied for withdrawal wording; legal conditions and outcome preserved.
- L26: `Days earlier, answering` → `Earlier, answering`. Applied for unsupported precise timing; legal conditions and outcome preserved.
- L34: `paragraph 1 makes people who jointly and unlawfully infringe another's rights jointly liable` → `paragraph 1 makes people who jointly and unlawfully infringe another's rights jointly and severally liable`. Applied for legal translation; legal conditions and outcome preserved.
- L46: `spent in a simple campus setting rather than at work` → `spent studying on campus rather than in the workforce`. Applied for natural phrasing; legal conditions and outcome preserved.
- L52: `in Taipei sided with the holder` → `in Taipei sided with the account user`. Applied for taipei account user; legal conditions and outcome preserved.
- L52: `This holder managed an account opened in the holder's father's name for a home loan` → `This person managed an account opened in their father's name for a home loan`. Applied for taipei account user; legal conditions and outcome preserved.
- L52: `The holder had voiced doubts` → `The user had voiced doubts`. Applied for taipei account user; legal conditions and outcome preserved.
- L52: `prove that the holder knew or could have known` → `prove that the user knew or could have known`. Applied for taipei account user; legal conditions and outcome preserved.
- L54: `Only the Tainan court counted` → added J1 inline link(s); wording and facts preserved.
- L54: `In Taipei they showed a holder` → `In Taipei they showed someone`; linked J4. Applied for taipei account user and source; legal conditions and outcome preserved.
- L54: `in New Taipei, one who never checked` → added J3 inline link(s); wording and facts preserved.
- L62: `Taipei applied paragraph 1: the holder had not known` → `Taipei applied paragraph 1: the user had not known`; linked J4. Applied for taipei account user and source; legal conditions and outcome preserved.
- L62: `when the holder found out` → `when the user found out`. Applied for taipei account user; legal conditions and outcome preserved.
- L66: `The court read "knows"` → added J3 inline link(s); wording and facts preserved.
- L44: `## Two cleared, one ordered to pay` → `## Two found not liable, one ordered to pay`. Applied for civil outcome wording; legal conditions and outcome preserved.

### zh-hant

- L15: `民法第184條第1項` → added S184 inline link(s); wording and facts preserved.
- L15: `2025年5月20日的簡易事件二審判決指出` → added J3 inline link(s); wording and facts preserved.
- L15: `也有判決在不起訴之後` → added J1 inline link(s); wording and facts preserved.
- L17: `2024年6月26日的判決` → added J2 inline link(s); wording and facts preserved.
- L19: `民法第197條第1項` → added S197 inline link(s); wording and facts preserved.
- L19: `新北地方法院把「知」解為明知` → added J3 inline link(s); wording and facts preserved.
- L28: `幾分鐘內就被車手領光` → `隨後車手在幾分鐘內接連提款`. Applied for withdrawal wording; legal conditions and outcome preserved.
- L56: `只有臺南分院把外國人身分` → added J1 inline link(s); wording and facts preserved.
- L56: `在臺北案證明持有人起過疑` → added J4 inline link(s); wording and facts preserved.
- L56: `在新北案卻成了` → added J3 inline link(s); wording and facts preserved.
- L64: `臺北地院認為，持有人不知` → added J4 inline link(s); wording and facts preserved.
- L68: `法院把「知」解為明知：` → added J3 inline link(s); wording and facts preserved.

## Hard-rule and citation audit

- Exact frontmatter keys, language/category/topic, publication/lastmod/date display, realistic reading time, image placeholder, three FAQs and `author: "legal-ai-assistant"` checked. H1 equals title; non-English seoTitles differ from titles. English title/seoTitle/summary length requirements pass.
- No bold, private-party name, scammer alias, account identifier, phone/hotline number, messaging ID, attorney byline, public lawyer-review claim or native-review claim in any final draft.
- Every paragraph stating a legal rule has an inline official source. Judgment reasoning in the synthesis, restitution and limitation paragraphs now has its own judgment link. The remaining citation-free reader-question paragraph and factual consultation closing introduce no additional legal rule.
- All cited statutory articles are in `research/C4-statutes.md`; all judgment URLs equal their saved-file line-1 URLs. All ten external sources are included in each final sources section with the required 2026-10-19 check date.
- Two internal links per language; lint confirmed both target files exist in the same-language snapshot. No batch-column links were used.
- No foreign-law rule is stated. The Japanese caution that Japanese students or working-holiday participants are not necessarily treated identically is an individual-case caution, not a Japanese-law proposition.
- Criminal exposure, warning-account freezes and immigration are not expanded into unsourced adjacent rules. The emotional-distress discussion only reports J2's refusal.
- The last substantive section describes concrete, relevant Taiwan-lawyer tasks. Each contact paragraph has the mandated firm name, email and exact Taipei address; the English version includes “English-speaking lawyer in Taipei”. There is no promised litigation result.
- No fictional client story or hypothetical calculation is used; all described incidents are attributed public judgments. The generic reader questions do not claim a new real case.

## Voice and sentence variety

First-two-paragraph deletion test: ko's opening quotation adds the intent/negligence distinction; its next paragraph adds the student's real job solicitation and transfer sequence. ja's first paragraph establishes the account handover and non-prosecution; the second adds the attached civil claim and NT$500,000 demand. en's first paragraph supplies the account inflow, withdrawals and job pretext; the second supplies the criminal-appeal setting and civil demand. zh-hant's first paragraph immediately compares the two civil outcomes; the second supplies the student's job-scam chronology. These paragraphs add distinct facts and were retained, subject to the bounded corrections above.

Compared openings, subheads and endings with the three latest same-language snapshot columns: `636-taiwan-related-company-loan-permitted-conditions.md`, `635-taiwan-traffic-ticket-other-driver-notice.md`, and `634-taiwan-employee-resignation-notice-indefinite-contract.md`, each published 2026-10-18, under `snapshot/src/content/columns`, `columns-ja`, `columns-en`, and `columns-zh`. Those comparators lead with corporate-loan rules, traffic-notice responsibility, or an employee's notice scenario. C4 leads with its judgment quotation/actual account handover/transfer amount/comparative court outcomes. The required lawyer/contact ending is shared in function, but C4 ends specifically on the complaint, handover date and non-prosecution papers.

Also compared C1–C3's current opening paragraphs in all four languages. C4's ko quotation, ja actual student incident, en transfer amount and zh-hant contrasting civil results are distinct from the corresponding other openings. No stock hypothetical opener is used.

Manual self-check under sections 5–6: at least two very short sentences in every version; no word starts three body paragraphs; no three consecutive claim–statute–caveat paragraphs; citation-free reader-question/consultation material remains; contrast templates remain within the threshold and address the actual non-prosecution/civil-liability issue; the final paragraph is tied to the complaint and handover documents; ko stays in 합니다체 and ja in です・ます apart from the identified translated quotation in ko. No monotony FAIL remains.

The legal-rule paragraphs are necessarily denser than the narrative paragraphs; the actual length variation and very-short-sentence proportions meet the checker. The ko/ja ending-frequency WARNs are non-blocking: register remains consistent, sentence lengths vary, and neither file has a checker FAIL or two unmet manual items.

| Language | Final body length | Lint | Sentences | Length CV | Very short | Run-of-three | Contrast count | Variety |
|---|---:|---|---:|---:|---:|---:|---:|---|
| ko | 3,490 characters | OK | 79 | 0.467 | 10.1% | 2.6% | 1 | 0 FAIL; register-frequency WARN only |
| ja | 4,081 characters | OK | 81 | 0.469 | 13.6% | 7.6% | 1 | 0 FAIL; register-frequency WARN only |
| en | 1,547 words | OK | 74 | 0.516 | 14.9% | 8.3% | 2 | OK |
| zh-hant | 2,674 characters | OK | 60 | 0.604 | 13.3% | 0% | 0 | OK |

Executed after edits for each language:

```text
python3 /Users/son7/tseng-col-1019-work/lint.py /Users/son7/tseng-col-1019-work/drafts/C4/<lang>.md <lang> taiwan-account-provider-scam-victim-civil-damages
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1019-work/drafts/C4/<lang>.md
```

Both commands exited 0 for all four languages. After the final English heading edit, both commands were run again on en and remained OK. All digit sequences outside URLs and every pre-existing external source URL were preserved. The final files introduce no new statute or factual source.

## Image verdict

OK. Viewed `images/C4.webp` directly: a blank card, an unlit phone, a closed notebook and a glass on a desk beside a window. Suitable as a fictional, nonidentifying illustration of an account-information problem. No person/face, text, logo, flag or readable document is visible; nothing purports to identify a party or depict the actual dispute. The tone is restrained and respectful.

## Reviewed file versions

| File | Submitted SHA-256 | Final SHA-256 |
|---|---|---|
| `drafts/C4/ko.md` | `dfdb971c8b425f77d2efd24c605a9e938f17da6a066e9776c6cb97e8d0e0a112` | `409af64425d2df7186cd9f81169ac31dcee426ab1f70ad100aea7fab76fdb134` |
| `drafts/C4/ja.md` | `8b1703d68c6514f9ff9ac0155a15ecbc41e8337ac2cdd2b00bd9fb555314043a` | `d031394e62615568775e2f292c50041b525ddfbbef186f5ea904faa5c32f70ec` |
| `drafts/C4/en.md` | `593578d153238c418a83f77524d205d6a753fda994fd2da9560718d5f63e04cc` | `655551f63725b88dc7ede9fad7caa8a46f7e75377f79da5aa2a4a079bf42fdfa` |
| `drafts/C4/zh-hant.md` | `a2f005b982123fae0ca46db6176c327b94aed4f5e7b6fb96f232222340d1cd9d` | `cc359a3aae07399ebdf5912760564b47b23ed385920011406f091a4471f22ac2` |

Image SHA-256: `6d9942c8195002601700a30b8a68deb213b5b7e1598f634ab1e0587551bf0414`.


Official fetches, original copies, diffs and command output were retained during this review under `/private/tmp/c4-final-astra-r1-official` and `/private/tmp/c4-final-astra-r1`. The checked legal content and permanent review conclusions are recorded above. Publication/deployment was not performed by this reviewer.

## Points for lawyer confirmation

1. 새 사건에서 계좌 제공자의 경험·관계·확인행위가 과실과 상당인과관계에 어떻게 평가되는지, 인용 판결 이후 실무도 함께 확인할 것.
2. 민법 제197조의 실제 인지 시점과 개별 사건의 시효 중단·정지 사유, 소 제기 방식이 청구권 행사에 미치는 영향을 확인할 것.
3. 계좌 명의자와 실제 관리자가 다른 경우 부당이득의 수익자와 현존 이익을 누구 기준으로 판단하는지 확인할 것.

These are questions for applying the column to an individual matter, not unresolved publication defects.

VERDICT: PASS     (all four languages publishable now, image OK)
