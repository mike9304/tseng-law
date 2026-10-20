# C3 independent final review — round 1

Verdict: PASS after the bounded repairs recorded below. No unresolved MAJOR, hard-rule failure, or MONOTONY failure remains.

Reviewer: Codex, assigned the Astra final-review role. I did not write these drafts. I read the originals independently and made the limited repairs expressly authorized in the review request. This review does not claim human native-speaker or lawyer review, and no publication was performed.

## Scope checked

Reviewed all four complete columns, including frontmatter, summary, all three FAQs, body, contact paragraph and sources: `drafts/C3/ko.md`, `ja.md`, `en.md`, `zh-hant.md`. Slug: `taiwan-work-permit-side-gig-other-employer`.

Read in full: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C3.md` including OUT OF SCOPE, `drafts/C3/facts.md`, `research/C3-statutes.md`, and the sole cited judgment `research/judgments/TPBA-111-訴-1020.txt`. Also read `SENTENCE-VARIETY-RULE.md`, skimmed all recurring LESSONS, and read `reviews/C3/voice-xreview.md`. The old canonical voice path named in COLUMN-VOICE-RULE is absent on this machine; the supplied complete `brief-EDITORIAL-VOICE.md` was read and applied. Fable requirements were not applied.

This is final-review round 1; no earlier Astra final log or fixer resolution table existed. The cross-review's L1–L18 were checked against the actual text, not treated as proof. Its source/terminology/holding repairs remain in place. Its open §53(2) scope question was resolved by retaining that exception expressly; L15's shortened medical exception was completed from the existing source and the more complete EN version.

For EACH language the review order was: (1) law and facts; (2) citations; (3) hard rules and frontmatter; (4) voice and sentence variety; (5) the shared image. All final changed passages were read again against the same sources.

Official verification was performed live on 2026-10-20. The batch's required source-check label and publication metadata remain 2026-10-19. With `curl -f -L --max-time 45 -sS`, I opened 17 official pages: ten single-article pages, the Chinese full texts and English full texts of the three laws, and the official judgment. The ten saved article texts MATCH the live pages after whitespace normalization; the entire saved judgment text is contained in the live page after the same normalization. Fetch manifest, HTML, extracted text, originals, diffs and detailed edit records are at `/private/tmp/C3-astra-r1-ve2l6evg` (temporary working evidence).

## Law and fact verification

| Item | Official evidence and result |
|---|---|
| Employer application, exceptions | Employment Service Act [§43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) and [§48(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=48): employer application rule, statutory reservation and all three §48 exceptions retained. Spouse exception keeps both Taiwan household registration and approved residence; university exception keeps Ministry of Education recognition. |
| Second employer | [§53(1)–(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=53): valid-permit period, changing employer OR multiple employers, new employer's mandatory application, departure-from-previous-job proof when changing employers, and paragraph 2 exception retained. Application is not represented as approval. |
| Revocation | [§73(1)–(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=73): mandatory 廢止, other employer and self-initiated unassigned work outside the permit distinguished. No discretionary “may” substitution. This is distinguished from the case's 撤銷 of an unlawfully issued later permit. |
| Departure and future work | [§74(1), (3)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=74): “unless the Act provides otherwise” retained; immediate departure and subsequent-work prohibition not reduced to a three-year ban. Paragraph 3 is described only as an exception to immediate departure. Student regimes receive only a general scope note and internal link. Medical conditions now align across all four versions. |
| Look-back | General qualification standard [§2(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090031&flno=2), [§2-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090031&flno=2-1), and cram-school standard [§6](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090054&flno=6): three years BEFORE APPLICATION, only work within the respective standard, cited grounds presented as examples rather than a complete list. No assertion that three years automatically restores eligibility. |
| Cram-school language teachers | [§3(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090054&flno=3), [§5-1(1)–(4)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090054&flno=5-1): 14-hour baseline, 6 hours for EACH NEW employer under §53(1) during a valid permit, 32-hour combined maximum; full-time foreign-language teaching scope retained. Adult status, college-or-higher graduation, passport-country official language, and extra teacher-training certificate when lacking a bachelor's degree now expressly included in each body. |
| Versions and commencement | Chinese/English law headers match the source lists: Employment Service Act 2025-01-20; general qualification standard 2024-08-01; cram-school standard 2022-10-27. Full-text commencement clauses were inspected. No article-specific amendment date or unsupported new effective date is asserted. Official English statute names match. |
| Judgment identity and result | [Taipei High Administrative Court, 111年度訴字第1020號, 2023-03-30](https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=TPBA%2c111%2c%e8%a8%b4%2c1020%2c20230330%2c1); claim dismissed. Not a district-court judgment. No claim of finality or of a later appeal outcome. |
| Judgment chronology | Contract 2020-11-03, application next day, supplement 11-17, performance 11-20; later employer applied 2021-09-07 and obtained permit that September; administrative decision 2021-12-15, 14 days from receipt/service with employer handling departure; Executive Yuan administrative appeal then court action. All stated dates, actors and sequence match. |
| Arithmetic and money | NT$400 × 68 = NT$27,200. 60% = NT$16,320 and 40% = NT$10,880, but the judgment separately records this band's NT$8,000: the columns do NOT claim NT$8,000 equals the whole 40%. NT$150,000 was imposed on the venue company, not on the teacher. No worker fine is invented. |
| Holding | Work for another employer was established irrespective of the teacher's later receipt from NT$8,000. Unpaid-work and contract-form reasoning is attributed to Ministry interpretations accepted by the court, not invented statutory wording. The later permit was unlawful under the look-back rule; departure/work bar were regulatory measures irrespective of fault, with the court additionally finding the teacher not free of fault. |

## Findings and repairs

### F1 — Paragraph-level judgment citations (all four; applied)

Original → KO “일과 무관한 취미였다는 것입니다.”; JA “台北高等行政法院も請求を棄却しました。”; EN “Music was a hobby outside work.”; all four application-date and concluding case paragraphs, plus the labor-interview passage in the lawyer section.

Problem & reason → Case facts, dates or holdings had no judgment link in their paragraph, or a statute link was doing the work of a missing case citation. A sources-list entry alone does not meet batch rule 2 / precision rule A.

Fix (applied) → Added the EXACT official URL on line 1 of the cited judgment file at each affected claim. Added direct links at the venue-fine statements. Existing citations were kept.

Facts preserved → Court, case number, date, 14-day order, application date, all amounts and all holdings unchanged. The [official judgment](https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=TPBA%2c111%2c%e8%a8%b4%2c1020%2c20230330%2c1) supports each added link. The edit list below identifies each location.

### F2 — Employer-application scope (KO, JA, EN; applied)

Original → “외국인 본인은 신청하지 않습니다.” / “外国人本人が申請するわけではありません。” / “The worker does not file.”; KO “세 경우만 예외”, JA “三つの場合に限られます”.

Problem & reason → These detached absolutes could be read as applying to every permit regime, despite the preceding statutory reservation and the column's employer-specific scope. [§43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43) begins “除本法另有規定外”; [§48](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=48) lists exceptions to its own rule.

Fix (applied) → Kept the employer as applicant for the permit being discussed; JA says “この場合”, EN says “For this employer-specific permit”. KO/JA now say the same paragraph provides three exceptions, without presenting them as an exhaustive inventory of all Taiwan permit regimes.

Facts preserved → Existing employer-specific analysis and mandatory application rule unchanged; no self-application regime was added or analyzed.

### F3 — §53(2) qualifier in body and FAQ (all four; applied)

Original → “고용허가 유효기간 중 … 새 고용주가 허가를 신청해야 합니다”; “許可の有効期間中 … 新しい雇用主が許可を申請しなければなりません”; “the new employer must apply”; “應由新雇主申請許可”. The summaries were already qualified, but the body/FAQ statements omitted the express paragraph 2 reservation.

Problem & reason → Existing [§53(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=53) says: “第五十一條第一項第一款、第三款及第四款規定之外國人已取得中央主管機關許可者，不適用前項之規定。” The cross-review itself identified this scope issue.

Fix (applied) → Added “same article paragraph 2's exception” in each second-job body passage and FAQ 3. This restores the qualification already signaled by the summaries, using an already-fetched paragraph; no §51 categories or new legal analysis were introduced. EN FAQ syntax was then simplified.

Facts preserved → New employer, valid permit, second job/change, mandatory application and required separation proof retained. No promise of approval.

### F4 — Medical exception parity (KO, JA, ZH; EN precision; applied)

Original → KO “위생당국의 동의로 건강검진 재검사에 합격한 경우”; JA “衛生当局の同意を得て健康診断の再検査に合格した人”; ZH “經衛生主管機關同意再檢查而合格的人”. EN already retained the missed/failed periodic examination.

Problem & reason → The three shortened versions omitted the initial non-attendance/failure condition. [§74(3)(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=74): “受聘僱之外國人於受聘僱期間，未依規定接受定期健康檢查或健康檢查不合格，經衛生主管機關同意其再檢查，而再檢查合格。”

Fix (applied) → Aligned KO/JA/ZH with the complete condition in EN and the source; made “during employment” explicit in all four.

Facts preserved → Missed OR failed examination, authority consent AND successful re-examination, employment-period condition, and exception only to immediate departure. No exception to the work prohibition was created.

### F5 — Listed teacher qualifications in the intended scope (all four; applied)

Original → Each body gave the 14/6/32 teaching-hour limits but omitted the accompanying qualifications expressly requested by the topic's must-cover item.

Problem & reason → [§5-1(1)–(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090054&flno=5-1) requires “且應具備下列資格：一、成年。二、大專以上學校畢業。三、教授之語文課程為該外籍教師護照國籍之官方語言。” It adds “未取得學士學位者，另應具有語文師資訓練合格證書。” These passages were already in research and facts.md. The official English translation's “meet one of” is inconsistent with the Chinese conjunctive text; the repairs follow the Chinese text and require ALL three qualifications.

Fix (applied) → Added those qualifications and the conditional teacher-training certificate in the existing hours paragraph, with its existing §5-1 citation. This is direct completion from the already-verified source, not a new eligibility interpretation. No adult-age number was invented.

Facts preserved → Hour limits, each-new-employer condition, permit validity, specialized full-time language-teacher scope, article/paragraph references and mandatory force retained.

### F6 — Hypothetical labels, attribution and language (applied)

Original → KO “대만 회사 … 한국인 디자이너”; JA “台湾の子会社で働く日本人エンジニア”; EN “An evening on a friend's stage … Friends asked you to play”; JA “教学関連”, “外国語教学”, “働いたことになるのか”; KO “한국의 행정심판에 해당”.

Problem & reason → KO/JA examples needed explicit hypothetical cues. The EN opening mixed an unmarked imagined friend-owned stage with actual case facts. Japanese teaching terminology was a Chinese calque and the isolated question slipped from the surrounding polite register. The Korean foreign-law equivalence was unnecessary to explain the Taiwan procedure.

Fix (applied) → Added 가령 / 例えば within the article, not as the first opening sentence; EN now attributes the unpaid/friends argument to the teacher's recorded account and cites the judgment. JA uses 教育関連業務 / 外国語教育 and なるのでしょうか. KO calls 訴願 an 행정 불복 절차.

Facts preserved → Examples remain hypothetical; no actual client or foreign-law practice is invented. Case argument, date, outcome and nature of teaching-related work are retained. No nationality/gender/name was added.

### F7 — Closing tied to this situation (all four; applied)

Original → KO “무엇부터 확인할지 함께 살펴보겠습니다”; JA “何から確かめるべきかを一緒に整理します”; ZH “一起看看先從哪裡確認”; EN ended with only the office address.

Problem & reason → Generic endings did not finish on the permit problem or documents as required by sentence-variety §5(7).

Fix (applied) → KO/JA/ZH now end on the second engagement's permit needs; EN ends on the present permit, proposed terms or revocation letter.

Facts preserved → All required firm names, exact email/address forms, EN “English-speaking lawyer in Taipei”, concrete lawyer tasks and no-result-promise language retained. No claim of guaranteed approval or litigation success.

### F8 — ZH length after condition completion (applied)

Original → “回到那場演出”, “判決裡留著…說的一句話”, “真正被撤銷的，是演出之後才核發的那張許可” and longer introductory phrasing.

Problem & reason → Adding required source conditions had to remain inside the 2,700-character cap. Redundant narrative wording could be removed without deleting any case fact or legal condition.

Fix (applied) → Compressed the opening, prior employer application, quotation lead-in, later-permit sentence and recap. Final length 2,699.

Facts preserved → The venue, band, public-performance application, timing, later permit and consequence remain. The original quotation, every original URL occurrence and all numerical tokens were retained. This was not a monotony repair that sacrificed evidence.

## Applied edits — complete location list

Each entry below is an applied edit; snippets identify the precise passage. Full before/after files and diffs are in the temporary evidence directory. “Facts preserved” for citation/wording edits means the cited proposition and all legal figures/conditions remain; qualification-completion entries add only the explicit existing-source conditions described in F3–F5.

### ko

1. `drafts/C3/ko.md:28` — Original: 소원(訴願, 한국의 행정심판에 해당) → problem & reason: Remove unnecessary Korean-law equivalence → fix (applied): 소원(訴願, 행정 불복 절차) → facts preserved: yes; see F1–F8 for the source and preserved conditions.

2. `drafts/C3/ko.md:30` — Original: 법원은 하나도 받아들이지 않았습니다. 대만 회사 → problem & reason: Cite holding and label hypothetical → fix (applied): 법원은 하나도 받아들이지 않았습니다(판결문〔link〕). /  / 가령 대만 회사 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

3. `drafts/C3/ko.md:36` — Original: 외국인 본인은 신청하지 않습니다. → problem & reason: Keep employer-application scope without absolute denial of personal applications → fix (applied): 신청 주체는 고용주입니다. → facts preserved: yes; see F1–F8 for the source and preserved conditions.

4. `drafts/C3/ko.md:36` — Original: 같은 항 단서가 정한 세 경우만 예외입니다. → problem & reason: Describe Article 48 exceptions without exclusive all-regimes wording → fix (applied): 같은 항 단서는 세 가지 예외를 둡니다. → facts preserved: yes; see F1–F8 for the source and preserved conditions.

5. `drafts/C3/ko.md:46` — Original: 일과 무관한 취미였다는 것입니다. → problem & reason: Add missing judgment citation → fix (applied): 일과 무관한 취미였다는 것입니다(판결문〔link〕). → facts preserved: yes; see F1–F8 for the source and preserved conditions.

6. `drafts/C3/ko.md:50` — Original: 세 번째 학원은 2021년 9월 7일에 신청했습니다. → problem & reason: Cite case application date separately from statute → fix (applied): 세 번째 학원은 2021년 9월 7일에 신청했습니다(판결문〔link〕). → facts preserved: yes; see F1–F8 for the source and preserved conditions.

7. `drafts/C3/ko.md:56` — Original: 위생당국의 동의로 건강검진 재검사에 합격한 경우 → problem & reason: Match EN and Article 74(3)(2) conditions → fix (applied): 고용기간 중 정기 건강검진을 받지 않았거나 불합격한 뒤 위생당국이 허용한 재검사에 합격한 경우 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

8. `drafts/C3/ko.md:58` — Original: 판결에 따르면 공연장 회사는 2021년 5월 → problem & reason: Cite separate employer fine directly → fix (applied): 판결〔link〕에 따르면 공연장 회사는 2021년 5월 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

9. `drafts/C3/ko.md:19` — Original: 취업서비스법 제53조 제1항에 따라 고용허가 → problem & reason: Restore same-article exception in FAQ → fix (applied): 취업서비스법 제53조 제1항에 따라, 같은 조 제2항의 예외가 적용되지 않는 경우 고용허가 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

10. `drafts/C3/ko.md:62` — Original: 고용허가 유효기간 중 고용주를 바꾸거나 → problem & reason: Make Article 53 scope explicit without explaining out-of-scope statuses → fix (applied): 같은 조 제2항의 예외가 적용되지 않는 경우, 고용허가 유효기간 중 고용주를 바꾸거나 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

11. `drafts/C3/ko.md:68` — Original: 대만에서 계속 일할 길까지 막았습니다. → problem & reason: Cite case conclusion → fix (applied): 대만에서 계속 일할 길까지 막았습니다(판결문〔link〕). → facts preserved: yes; see F1–F8 for the source and preserved conditions.

12. `drafts/C3/ko.md:74` — Original: 이 사건에서도 타이베이시 노동력재건운용처가 → problem & reason: Add case source in lawyer-task paragraph → fix (applied): 이 사건〔link〕에서도 타이베이시 노동력재건운용처가 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

13. `drafts/C3/ko.md:76` — Original: 무엇부터 확인할지 함께 살펴보겠습니다. → problem & reason: End on this column’s specific permit question → fix (applied): 두 번째 일에 필요한 허가부터 검토하겠습니다. → facts preserved: yes; see F1–F8 for the source and preserved conditions.

14. `drafts/C3/ko.md:64` — Original: 주 14시간 이상 교육 관련 업무를 해야 합니다(제1항). 유효기간 중 → problem & reason: Retain all Article 5-1(1)-(2) qualifications required by topic, without new source or eligibility analysis → fix (applied): 주 14시간 이상 교육 관련 업무를 해야 합니다(제1항). 성년이고 대학·전문대학 이상을 졸업했으며 가르칠 언어가 여권 국적 국가의 공용어여야 합니다. 학사학위가 없으면 언어교사 양성교육 합격증명서도 필요합니다(제2항). 유효기간 중 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

### ja

1. `drafts/C3/ja.md:30` — Original: 台北高等行政法院も請求を棄却しました。 → problem & reason: Cite decision date/departure and dismissal paragraph → fix (applied): 台北高等行政法院も請求を棄却しました（判決〔link〕）。 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

2. `drafts/C3/ja.md:32` — Original: 台湾の子会社で働く日本人エンジニアにも、 → problem & reason: Explicitly label hypothetical → fix (applied): 例えば、台湾の子会社で働く日本人エンジニアにも、 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

3. `drafts/C3/ja.md:32` — Original: 働いたことになるのか。 → problem & reason: Keep question in desu-masu register → fix (applied): 働いたことになるのでしょうか。 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

4. `drafts/C3/ja.md:36` — Original: 外国人本人が申請するわけではありません。 → problem & reason: Keep employer-specific scope → fix (applied): この場合の申請者は雇用主です。 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

5. `drafts/C3/ja.md:36` — Original: 例外は同じ項のただし書が挙げる三つの場合に限られます。 → problem & reason: Avoid all-regimes exclusive phrasing → fix (applied): 同じ項のただし書は三つの例外を設けています。 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

6. `drafts/C3/ja.md:46` — Original: 仕事とは関係のない趣味だったそうです。 → problem & reason: Add missing judgment citation → fix (applied): 仕事とは関係のない趣味だったそうです（判決〔link〕）。 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

7. `drafts/C3/ja.md:50` — Original: 三つ目の補習班の申請日は2021年9月7日でした。 → problem & reason: Cite application date → fix (applied): 三つ目の補習班の申請日は2021年9月7日でした（判決〔link〕）。 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

8. `drafts/C3/ja.md:56` — Original: 衛生当局の同意を得て健康診断の再検査に合格した人 → problem & reason: Match EN and Article 74(3)(2) conditions → fix (applied): 雇用期間中に定期健康診断を受けなかったか不合格になり、衛生当局の同意を得た再検査に合格した人 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

9. `drafts/C3/ja.md:58` — Original: 同じ判決によれば、会場の会社は2021年5月、 → problem & reason: Cite employer fine directly → fix (applied): 同じ判決〔link〕によれば、会場の会社は2021年5月、 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

10. `drafts/C3/ja.md:19` — Original: 就業服務法第53条第1項により、許可の有効期間中に二以上 → problem & reason: Restore same-article exception in FAQ → fix (applied): 就業服務法第53条第1項により、同条第2項の例外に当たらなければ、許可の有効期間中に二以上 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

11. `drafts/C3/ja.md:62` — Original: 許可の有効期間中に雇用主を変える場合や、 → problem & reason: Make Article 53 scope explicit → fix (applied): 同条第2項の例外に当たらなければ、許可の有効期間中に雇用主を変える場合や、 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

12. `drafts/C3/ja.md:19` — Original: 新しい雇用主ごとの教学関連の時間 → problem & reason: Natural Japanese for teaching-related work; retain hours → fix (applied): 新しい雇用主の下での教育関連業務の時間 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

13. `drafts/C3/ja.md:64` — Original: 専任の外国語教学 → problem & reason: Replace Chinese calque with Japanese → fix (applied): 専任の外国語教育 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

14. `drafts/C3/ja.md:64` — Original: 外国人の教学関連の時間 → problem & reason: Natural Japanese for teaching-related work → fix (applied): 外国人の教育関連業務の時間 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

15. `drafts/C3/ja.md:68` — Original: 台湾で働き続ける道を閉ざしました。 → problem & reason: Cite case conclusion → fix (applied): 台湾で働き続ける道を閉ざしました（判決〔link〕）。 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

16. `drafts/C3/ja.md:74` — Original: この事件でも、台北市労働力重建運用処が → problem & reason: Add case source in lawyer-task paragraph → fix (applied): この事件〔link〕でも、台北市労働力重建運用処が → facts preserved: yes; see F1–F8 for the source and preserved conditions.

17. `drafts/C3/ja.md:76` — Original: 何から確かめるべきかを一緒に整理します。 → problem & reason: End on this column’s permit question → fix (applied): 二つ目の仕事に必要な許可を検討します。 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

18. `drafts/C3/ja.md:64` — Original: 週14時間を下回ってはなりません（第1項）。許可の有効期間中に → problem & reason: Retain all Article 5-1(1)-(2) qualifications required by topic → fix (applied): 週14時間を下回ってはなりません（第1項）。成人で、大学・専科学校以上を卒業し、教える言語が旅券の国籍国の公用語であることも必要です。学士の学位がなければ、語学教師養成の合格証明書も求められます（第2項）。許可の有効期間中に → facts preserved: yes; see F1–F8 for the source and preserved conditions.

### en

1. `drafts/C3/en.md:26` — Original: An evening on a friend's stage doesn't feel like a second job when you already hold a Taiwan work permit. Friends asked you to play. Nobody mentioned money. Those were much the sam… → problem & reason: Attribute opening to the recorded case; remove unmarked invented friend-owned stage → fix (applied): Friends had asked for a performance, and no one had discussed pay. That was an American English teacher's account of a ticketed show on November 20, 2020. The teacher already held … → facts preserved: yes; see F1–F8 for the source and preserved conditions.

2. `drafts/C3/en.md:32` — Original: The worker does not file. → problem & reason: Remove absolute personal-application statement → fix (applied): For this employer-specific permit, the employer applies. → facts preserved: yes; see F1–F8 for the source and preserved conditions.

3. `drafts/C3/en.md:42` — Original: Music was a hobby outside work. → problem & reason: Cite interview paragraph → fix (applied): Music was a hobby outside work (judgment〔link〕). → facts preserved: yes; see F1–F8 for the source and preserved conditions.

4. `drafts/C3/en.md:46` — Original: The third cram school applied on September 7, 2021. → problem & reason: Cite case application date → fix (applied): The third cram school applied on September 7, 2021 (judgment〔link〕). → facts preserved: yes; see F1–F8 for the source and preserved conditions.

5. `drafts/C3/en.md:52` — Original: workers who missed or failed a periodic health check and then passed a re-check the health authority allowed → problem & reason: State employment-period condition consistently → fix (applied): workers who, during employment, missed or failed a periodic health check and then passed a re-check the health authority allowed → facts preserved: yes; see F1–F8 for the source and preserved conditions.

6. `drafts/C3/en.md:54` — Original: According to the same judgment, the Taipei City → problem & reason: Cite employer fine directly → fix (applied): According to the same judgment〔link〕, the Taipei City → facts preserved: yes; see F1–F8 for the source and preserved conditions.

7. `drafts/C3/en.md:19` — Original: Under Article 53, paragraph 1, if you need → problem & reason: Restore same-article exception in FAQ → fix (applied): Under Article 53, paragraph 1, the new employer must apply for a permit if you need to work for two or more employers while your permit is valid, unless paragraph 2's exception app… → facts preserved: yes; see F1–F8 for the source and preserved conditions.

8. `drafts/C3/en.md:58` — Original: The lawful route runs through [Article 53, paragraph 1] → problem & reason: Make Article 53 scope explicit → fix (applied): Subject to the exception in paragraph 2, the lawful route runs through [Article 53, paragraph 1] → facts preserved: yes; see F1–F8 for the source and preserved conditions.

9. `drafts/C3/en.md:64` — Original: along with the right to keep working in Taiwan. → problem & reason: Cite case conclusion → fix (applied): along with the right to keep working in Taiwan (judgment〔link〕). → facts preserved: yes; see F1–F8 for the source and preserved conditions.

10. `drafts/C3/en.md:70` — Original: In the 2023 case, a Taipei City labor office → problem & reason: Add case source in lawyer-task paragraph → fix (applied): In the 2023 case〔link〕, a Taipei City labor office → facts preserved: yes; see F1–F8 for the source and preserved conditions.

11. `drafts/C3/en.md:72` — Original: The office is at 7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City 103, Taiwan. → problem & reason: End with column-specific documents; preserve exact address and consultation phrase → fix (applied): The office is at 7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City 103, Taiwan. Include your current permit and the proposed work terms, or the revocation letter. → facts preserved: yes; see F1–F8 for the source and preserved conditions.

12. `drafts/C3/en.md:60` — Original: Article 3〔link〕, item 2). When that teacher → problem & reason: Retain all Article 5-1(1)-(2) qualifications; Chinese text requires all three, not English translation’s erroneous “one of” → fix (applied): Article 3〔link〕, item 2). The teacher must be an adult, have graduated from college or above, and teach an official language of the country of their passport nationality. Without a… → facts preserved: yes; see F1–F8 for the source and preserved conditions.

### zh-hant

1. `drafts/C3/zh-hant.md:48` — Original: 第三家補習班是在2021年9月7日申請。 → problem & reason: Cite application date → fix (applied): 第三家補習班是在2021年9月7日申請（判決全文〔link〕）。 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

2. `drafts/C3/zh-hant.md:54` — Original: 以及經衛生主管機關同意再檢查而合格的人 → problem & reason: Match EN and Article 74(3)(2) conditions → fix (applied): 以及受聘僱期間未依規定接受定期健康檢查或檢查不合格、經衛生主管機關同意再檢查而合格的人 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

3. `drafts/C3/zh-hant.md:56` — Original: 判決也記載，經營場地的公司在2021年5月 → problem & reason: Cite employer fine directly → fix (applied): 判決〔link〕也記載，經營場地的公司在2021年5月 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

4. `drafts/C3/zh-hant.md:19` — Original: 依就業服務法第53條第1項，聘僱許可有效期間內 → problem & reason: Restore same-article exception in FAQ → fix (applied): 依就業服務法第53條第1項，除同條第2項的例外外，聘僱許可有效期間內 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

5. `drafts/C3/zh-hant.md:60` — Original: ：外國人在聘僱許可有效期間內，需要轉換雇主 → problem & reason: Make Article 53 scope explicit → fix (applied): ：除同條第2項的例外外，外國人在聘僱許可有效期間內，需要轉換雇主 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

6. `drafts/C3/zh-hant.md:66` — Original: 回到那場演出。場地公司確實事先以雇主身分申請了，許可卻沒有下來；沒有許可就上台的那一晚，讓老師失去第三家補習班的聘僱許可，也失去繼續在台灣工作的機會。 → problem & reason: Trim redundant recap wording to retain length after restoring conditions; cite judgment → fix (applied): 場地公司已經申請，卻沒等到許可就安排老師登台。這一晚，讓老師失去第三家補習班的許可及繼續在台灣工作的機會（判決全文〔link〕）。 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

7. `drafts/C3/zh-hant.md:72` — Original: 這件案子裡，臺北市勞動力重建運用處就 → problem & reason: Add case source in lawyer-task paragraph → fix (applied): 這件案子〔link〕裡，臺北市勞動力重建運用處就 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

8. `drafts/C3/zh-hant.md:74` — Original: 一起看看先從哪裡確認。 → problem & reason: End on the concrete permit question → fix (applied): 先核對第二份工作的許可需求。 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

9. `drafts/C3/zh-hant.md:62` — Original: 十四小時（第1項）；許可有效期間內 → problem & reason: Retain all Article 5-1(1)-(2) qualifications required by topic → fix (applied): 十四小時（第1項）。老師須成年、大專以上畢業，且教授語言須為護照國籍的官方語言；未取得學士學位者，還須有語文師資訓練合格證書（第2項）。許可有效期間內 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

10. `drafts/C3/zh-hant.md:26` — Original: 已經有工作許可的外籍老師，受朋友邀請到展演空間上台表演一晚，會出什麼事？ → problem & reason: Tighten opening to preserve length; venue and onstage facts remain in next paragraph → fix (applied): 外籍老師已有工作許可，受朋友邀請演出一晚，會出什麼事？ → facts preserved: yes; see F1–F8 for the source and preserved conditions.

11. `drafts/C3/zh-hant.md:28` — Original: 這位美籍英語老師的聘僱許可，是兩家補習班替他申請的。 → problem & reason: Tighten subject/verb without losing permit/employer/nationality facts → fix (applied): 兩家補習班替這位美籍英語老師申請了聘僱許可。 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

12. `drafts/C3/zh-hant.md:28` — Original: 公司在演出前已經以雇主身分替他申請公開表演的許可。 → problem & reason: Remove redundant wording; keep prior employer application and public performance → fix (applied): 公司事先以雇主身分替他申請了公開表演許可。 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

13. `drafts/C3/zh-hant.md:48` — Original: 真正被撤銷的，是演出之後才核發的那張許可。 → problem & reason: Tighten sentence; preserve sequence and revocation terminology → fix (applied): 被撤銷的是演出後核發的許可。 → facts preserved: yes; see F1–F8 for the source and preserved conditions.

14. `drafts/C3/zh-hant.md:44` — Original: 判決裡留著老師在臺北市勞動力重建運用處談話時說的一句話： → problem & reason: Remove narrative filler before unchanged sourced quotation → fix (applied): 老師在臺北市勞動力重建運用處談話時說： → facts preserved: yes; see F1–F8 for the source and preserved conditions.

## Final checks by language

Commands were run after each edit batch and again on the final content:

```text
python3 /Users/son7/tseng-col-1019-work/lint.py /Users/son7/tseng-col-1019-work/drafts/C3/<lang>.md <lang> taiwan-work-permit-side-gig-other-employer
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1019-work/drafts/C3/<lang>.md
```

| Language | Lint | Length | Variety | CV | Very short | Similar-length run | Contrast |
|---|---|---:|---|---:|---:|---:|---:|
| ko | OK / exit 0 | 3465 chars (no spaces/URLs) | 0 FAIL / exit 0 | 0.491 | 0.082 | 0.014 | 0 |
| ja | OK / exit 0 | 3977 chars (no spaces/URLs) | 0 FAIL / exit 0 | 0.515 | 0.105 | 0.014 | 1 |
| en | OK / exit 0 | 1543 words | 0 FAIL / exit 0 | 0.609 | 0.219 | 0.014 | 1 |
| zh-hant | OK / exit 0 | 2699 chars (no spaces/URLs) | 0 FAIL / exit 0 | 0.61 | 0.105 | 0.036 | 0 |

KO and JA retain only register-frequency WARNs (80% 니다 / 79% desu-masu). These are not FAILs; the required registers are preserved. Very-short sentence counts are KO 6, JA 8, EN 16, ZH 6, all above two. Manual §5–6 check: no stock hypothetical opener; no three paragraphs with the same opening word; no three consecutive claim–statute–caveat paragraphs; each file has an uncited practical/example/contact paragraph; contrast templates within the cap; no invented reader claim is rebutted; closing now ends on the actual permit/documents. MONOTONY: no remaining failure.

Citations/hard rules: all ten cited statutory articles are in `research/C3-statutes.md`; every official body URL appears in that language's sources section; all source sections retain the required 2026-10-19 check date. All three internal links in each language exist in that language in the lint snapshot. No link to this batch was introduced. No original URL occurrence or numerical token was removed, verified by before/after counters. No private-party name, bold markup, phone/hotline, lawyer/native-review claim, invented attorney byline, invented deadline/fee, or outcome guarantee remains. All four keep `author: "legal-ai-assistant"`, dates, category, topic `visa`, locale-only audience, three FAQs, and the literal NNN image path. EN title is 91 characters, seoTitle 33, summary 157; the required seoTitle and summary constraints pass. Exact contact strings were also read manually, beyond lint's looser matching.

Foreign-law explanation was not expanded. Gold Card/APRC/student/engineer links remain boundary pointers. No migrant-worker side-job rules, performer application regime, tax, worker fine, criminal-conviction revocation, or immigration deportation procedure was added. No numeric administrative-appeal deadline was invented.

## Voice comparison and opening deletion test

Compared openings, headings and endings against the three newest dated same-locale columns available in the supplied snapshot, all published 2026-10-18:

| Locale directory | Comparator files |
|---|---|
| `snapshot/src/content/columns` (ko) | `636-taiwan-related-company-loan-permitted-conditions.md`; `635-taiwan-traffic-ticket-other-driver-notice.md`; `634-taiwan-employee-resignation-notice-indefinite-contract.md` |
| `snapshot/src/content/columns-ja` | same three filenames |
| `snapshot/src/content/columns-en` | same three filenames |
| `snapshot/src/content/columns-zh` | same three filenames |

This is a snapshot comparison, not a claim of live-site deployment verification. C3's single-show court narrative differs from the comparators' intercompany-loan, traffic-notice and resignation scenarios. Only the required lawyer/contact section is structurally shared; its substance is specific to permits, investigation and departure. C1/C2/C4's current local opening paragraphs were also inspected: C3 uses KO ticket figures, JA an actual interpretation quoted in the judgment, EN the litigant's argument, and ZH the already-authorized teacher's practical question. KO shares the broad “number opening” category with C2 (two of four, within §2-4's half-batch cap); it does not copy that sentence or scene. No predominant scene template was introduced.

First-two-paragraph deletion test, sentence by sentence: KO's first paragraph supplies the ticket arithmetic, split, band payment, two existing permits and failed performance application; its second supplies the later administrative decision, receipt-based 14 days, employer's role and court result. JA's first paragraph supplies the actual Chinese interpretation, its meaning and judicial attribution; its second supplies the performance facts and permits. EN's revised first paragraph supplies the teacher's claimed no-pay/friends argument and its rejection; its second gives the permits, payment facts, later decision and procedural outcome. ZH's tightened first paragraph gives the reader question plus exact court/date/case; its second gives the concrete transaction and ungranted permit. These are information-bearing openings, not generic previews. No dispensable “this article will explain” sentence remains.

KO reads in 합니다체; JA in です・ます with Japanese teaching vocabulary; EN uses active, plain case narration; ZH uses Taiwan terminology, with no Mainland/Simplified vocabulary. Four versions retain one legal core, while reader examples remain different.

## Reviewed versions

- `drafts/C3/ko.md` — SHA-256 `8b1eec1e5c561aeab8df70b661a552577c1c4378959de1dd49e8aeef61b55c52`
- `drafts/C3/ja.md` — SHA-256 `6a5be8ebc7245ec17b65385809855e758d2758d77474deea05f16572495d8f25`
- `drafts/C3/en.md` — SHA-256 `3cda6c1bf95a69a81d5a30edd09d8a5d0bddd7b58b2904241ae78a5480398f5a`
- `drafts/C3/zh-hant.md` — SHA-256 `9e8be8bcc1b736022fb7c0c6e1b97030311e75f263ac5f03277cdfec97caf68a`

## Image

Image verdict: OK. Viewed `/Users/son7/tseng-col-1019-work/images/C3.webp` directly with the image tool. It is a generic illustrative after-hours work scene: hanging shirt, closed work/delivery-style bag, desk, phone with unreadable screen, lamp and numberless clock. No people/faces, identifying workplace or incident, text, logo, flag or readable document is visible. It can accompany the second-job theme without purporting to depict the actual teacher, venue or proceeding; respectful and non-identifying. No redraw required.

Image SHA-256: `418b14e038272b70b3dcb80d31fbedef5726f908103e7f90badae187dc9122ff`.

## Points for lawyer confirmation

1. 무보수 친교·자원봉사와 취업허가가 필요한 노무 제공의 경계는 구체적 활동과 최신 노동부 해석에 따라 확인할 필요가 있습니다.
2. 제74조의 재취업 제한, 신청일 전 3년 요건, 제53조 제2항 등 개인의 예외 자격이 실제 재신청에서 어떻게 함께 적용되는지 대만 변호사가 확인해야 합니다.
3. 허가 취소 처분을 다투는 동안의 출국 기한 대응과 집행정지 필요성은 처분서·송달일·개별 절차에 맞춰 확인해야 합니다.

VERDICT: PASS     (all four languages publishable now, image OK)
