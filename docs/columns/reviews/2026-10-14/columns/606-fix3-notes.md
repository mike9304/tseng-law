# C1 fix 3 notes

Round 2 review: `reviews/C1/final-astra-r2.md` (VERDICT: FIX). Official pages already saved in `reviews/C1/source-check-astra-r2/` were used before the legal edits: BLI application note https://www.bli.gov.tw/0007239.html (updated 2023-12-19), section III(5) 債權證明; BLI FAQ 7 https://www.bli.gov.tw/0015125.html (updated 2023-11-28); 勞動基準法施行細則 Article 2, pcode N0030002, amendment 民國113年3月27日 / 2024-03-27, Chinese single-article page and the official English full text. Chinese statutory text controls. No judgment is cited. `research/judgments/` has no `.txt`.

Lint after this revision, each command printed OK:

- ko: 3500 chars (the ceiling)
- ja: 3842 chars
- en: 1540 words (summary left at 157 characters)
- zh-hant: 2698 chars

Variety checker: 0 FAIL on all four. Contrast count 0. ko warns that 98% of sentences end in 니다; ja warns that 99% end in です・ます. Both registers were kept. Breaking them to silence the warning would violate the voice rule.

Frontmatter keys, titles, seo titles, featured_image path (`../images/NNN-taiwan-unpaid-wages-insolvent-employer-payment-fund/featured-01.webp`), author `legal-ai-assistant`, and the one email were not changed. No bold, phone, street address, party name, or lawyer-review claim. Opening types stayed distinct: KO the three statutory triggers, JA the reader's full-payment question, EN Article 28, ZH the payroll-ledger scene. Stock openers (가령 / 例えば…とします / Suppose / 假設 as the first sentence) were not used. The four bodies are no longer sentence-for-sentence parallel.

## L1 — Court papers when the employer cannot be found or will not sign

Changed in all four. The employer-missing or refusal condition stays. Court papers are one way to prove the debt, not the only Bureau requirement.

One accepted set is an original payment order or civil judgment, each with its certificate of finality, plus a copy of the payment-order application or the civil complaint. The certificate is no longer attached only to the judgment. The BLI application note (https://www.bli.gov.tw/0007239.html), 債權證明欄, is linked at that paragraph and names the other listed choices: after a concluded labor mediation or arbitration, the court ruling permitting compulsory execution together with its certificate of finality, plus a copy of the mediation record or the arbitral award; and, when compulsory execution produces nothing, the original creditor's certificate from the execution court. FAQ 7 stays, and is described as the shorter list (payment order or judgment plus the certificate of finality), not as the full list.

The separate duty to lodge the claim with the liquidator or the bankruptcy administrator stays in the Article 9 sentence, apart from this court-paper paragraph. Joint filing with the Bureau of Labor Insurance stays.

ZH is compressed for the 2700-character ceiling. It says 支付命令聲請狀 and 起訴狀, without repeating 民事 on the complaint. The page's longer label is 民事聲請支付命令狀. The documents are the same. Restoring 民事 would have pushed the file over 2700.

## L2 — Average wage and Enforcement Rules Article 2

Changed in all four, inline and in the sources list. Article 2(4) remains the basic rule: total wages in the six months before the event day, divided by the total number of days in that period, or by the days of service if service is shorter than six months. The denominator was not replaced with days actually worked. No monthly conversion was added. The 60% floor still uses actual working days and still applies only to day, hour, or piece-rate pay.

The actual calculation excludes the dates and periods listed in Enforcement Rules Article 2, and the wages of those periods. Named examples are the event day, occupational-injury medical treatment, ordinary sick leave, and unpaid leave (留職停薪). The sentence says the same article lists other periods. A full leave-law list was not copied. The distinction from days actually worked stays, as the review said that distinction remains valid.

Reading of the two official texts: the Chinese article says the listed 期日或期間 are not counted in. The official English of the same article says wages and the number of days of those periods are not included. All four drafts state both (the listed days or periods, and the wages of those periods). That is the English page's reading, not a rewrite of the denominator into actual workdays.

## C1 — Claim-level official links

Added, without dropping links that were already correct.

- The three claims and the two limits (wage time-slice versus the combined money cap on the retirement-pay and severance advance) now sit next to an Article 28 link. Paragraph 1 still does not carry that money cap. The table has one linked introduction: KO "아래는 제28조…", JA "次の表は…" after the Article 28 sentence, EN "The table sets the rank…" after the Article 28 sentence, ZH the Article 28 sentence immediately above the table (a separate "下表" sentence was cut for length; the linked sentence is the introduction).
- Average wage links Article 2(4) and Enforcement Rules Article 2 in the calculation paragraph. The 60% sentence points back to the same item 4.
- Foreign-worker eligibility and the excluded mandate roles (person in charge, statutory agent, directors and supervisors of a company limited by shares) link the BLI guidance in that paragraph.

Repeated sentences were not each given a new citation.

## V1 — Native prose

The reviewer was followed. Legal conditions were not dropped to make the sentence shorter.

- KO "대지급은 기금을 청구…": the advance is now the fund paying within paragraph 2 after the worker has demanded payment from the employer and has not been paid. FAQ 1 uses the same subject.
- KO "신청은 열립니다" / "체불로 돌아봅니다" / "보족": now 신청할 수 있습니다, 대지급 대상으로 둡니다, and 밀린 분담을 나중에 납부. Summary and FAQ 1–2 match. "보족" is gone.
- JA repeated "見ます" for the legal rule: FAQ 2 now says その期間としています; the body states the wage window and the application condition directly. "返事がない請求は、その条件の入口です。書類は別です。" is now 返事がないことは、請求しても弁済を受けていないという点までです。廃業の証明と債権の証明は、別に要ります。 The scene still uses 口座を見ると for the engineer looking at the account. That is the ordinary verb, not the legal "見ます".
- EN "Foreign status alone does not make a worker. Neither does the label contractor.": removed. The paragraph states the hiring, the wages, and subordination, then says a contractor label leaves those facts to be decided. "Nationality is not part of the definition." The same direct test is in KO, JA, and ZH. The four "foreign status alone" rebuttals are gone.
- EN "Wages come first" / "The arithmetic sits": removed. Wages are named as the first listed category inside the three-claim paragraph. The severance link is "the column on severance pay".
- EN "opens an application" / "Silence answers…" / "will not sign to the arrears": a later payment of missed contributions lets the worker apply; the missing reply shows the demand went unpaid, and closure proof and debt proof are still required; the employer "will not sign a confirmation of the arrears".
- ZH "不從那些擔保債權的前面起算": 起算 was removed. Equal rank is stated once, and one clause keeps the legal point that the order is not placed ahead of the secured claims (順序不排在那些擔保債權之前). Dropping that clause would have changed the rank the column already states. KO, JA, and EN keep the same "not ahead" sentence once. It is not written as 不是…而是 / not…but.
- ZH "單憑外籍身分不會變成勞工" and "沒有回覆，只走到…文件是另一件事。": the first is gone; the employment test is the hiring, wages, and subordination sentence. The reply sentence is 沒有回覆，只表示已經請求、還沒有拿到。歇業證明和債權證明還要另附。

Shared repetition:

- "한도는 둘입니다 / 上限は二つです / Two limits / 上限有兩道" and "같은 한도일까요?" are gone. Both limits remain once in prose, next to an Article 28 link, and again in the table, which is the comparison. The closing returns to the same two limits as facts of the hypothetical, not as a new announcement that there are two limits.
- The rate paragraph no longer adds a separate "Article 28 does not state decision days." Paragraph 4 still states only the 15 per 10,000 (萬分之十五) ceiling as of 2026-10-14, and that the collected figure is not in that paragraph. The advance procedure, collection and management, the set amount, and the committee rules stay with the central competent authority. Paragraph 5 still says the employer repays within the prescribed period (規定期限), and that the paragraph gives no day count. That day-count sentence is the useful limit, stated once beside the repayment duty. The collected rate 萬分之二．五 (regulation Article 3), regulation Article 12's 30 days plus up to 20, and the BLI 7-day reimbursement figure were not added.
- The opening "empty account / 沒入帳, so the fund does not open" sentence was removed. The operating-business / late-pay limitation stays in the trigger paragraph. The scene still has the empty account or the missing month, the fictional label, the employer named on the contract, and the assumption that the labor contract is covered by the Act.

KO and ZH closings no longer repeat that whether the wage debt and the severance debt exist depends on the contract and the payment provisions. That sentence remains earlier: paragraph 1 does not create the severance debt, and closure alone does not create severance. JA and EN closings still say it. The cut was length, not a deleted condition. KO is at 3500 characters and ZH at 2698, two characters under 2700.

KO and ZH have no question mark in the body (variety q=0). Both files are at the length ceiling. The scene and the FAQ still carry the reader's questions. A question was not added, because an equal cut would have removed a legal condition. JA and EN each keep one body question.

JA sentence-length cv is 0.455, just above the 0.45 floor. Long sentences were not added on top of that.

## Where the reviewer was not followed, and why

R1 asked for an update to `drafts/C1/facts.md`. Not edited. This assignment said not to edit any file other than the four drafts and this note. The sheet is stale. Its "Deliberately left out" list still says the application venue, joint filing, signature or payment-order evidence, the contribution condition, and the Bureau's look-back are absent, and it still has a branch / head-office assertion that round 2 removed from the text. The next reviewer should not use that list to sign off. The four drafts are the claim inventory. Correct statutory quotations already in the sheet were left as they are.

"Paragraph 1 does not state the six-month money cap" was kept once in prose and in the table. That is the placement of the cap (paragraph 2), not a rebuttal of a claim the reader made.

"Days actually worked are not the denominator" was kept, including ZH 分母不是只留實際出勤日. The review said that distinction remains valid. The variety contrast counter is 0; the sentence is not the banned 不是…而是 pattern.

## Left out on purpose

- Regulation Article 3's collected rate, Article 12's decision period, and the BLI 7-day reimbursement figure.
- A branch with independent personnel and finance as a closure path. The examples are local companies. FAQ 3 is about a shareholding parent.
- 重整. The temporary-stoppage sentence is 停工 only.
- 承攬 and training contracts as a separate exclusion, beyond the existing sentence that a contractor label is decided by hiring, wages, and subordination, and beyond the mandate-role exclusion.
- The Bureau of Labor Funds. Regulation Article 2 assigns collection and advances to the Bureau of Labor Insurance, which is what the column states.

## Checks

`python3 /Users/son7/tseng-col-1014-work/lint.py` on each language file with slug `taiwan-unpaid-wages-insolvent-employer-payment-fund`: OK, lengths above.

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check` on each file: 0 FAIL. ko cv 0.504, short 0.126, cite_end 0, contrast 0, q=0, 니다 WARN. ja cv 0.455, short 0.136, contrast 0, q=1, ですます WARN. en cv 0.513, short 0.228, contrast 0, q=1, OK. zh-hant cv 0.577, short 0.149, contrast 0, q=0, OK. One allowed consecutive-start pair remains in ZH (a sentence starting 第28 and the next paragraph starting 第2). The limit is two.
