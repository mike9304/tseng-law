# C2 — final Astra review, round 1

Verdict: PASS after the bounded edits recorded below. Unresolved MAJOR items: 0. Unresolved hard-rule failures: 0. Image: OK.

Reviewer role: independent final reviewer; I did not author the submitted drafts. This review includes only the minimal repairs expressly authorized by the user. It makes no claim of human native-speaker review or review by a licensed lawyer. Review performed on 2026-10-20, Asia/Seoul; the required publication and source-check date, 2026-10-19, remains in the articles.

## Scope checked

Read every submitted column in full, including title, SEO title, summary, three FAQ answers, body and sources: `drafts/C2/ko.md`, `ja.md`, `en.md`, `zh-hant.md`. Read `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C2.md` including its OUT OF SCOPE list, `drafts/C2/facts.md`, `research/C2-statutes.md`, both cited judgment files in full, `SENTENCE-VARIETY-RULE.md`, and the recurring mistakes in `LESSONS.md`. Also checked the existing voice cross-review, batch openings, `topics/LINKS.md`, and three recent snapshot columns per language. The external canonical editorial-voice path referenced by COLUMN-VOICE-RULE is unavailable here; the supplied full `brief-EDITORIAL-VOICE.md` was available and applied.

This is round 1, so there is no preceding Astra-round resolution table. The prior voice pass's legal corrections L1–L11 were independently checked against the sources, not accepted on its assurance. L1 lending rather than transfers, L2 vehicle ownership omitted, L3 contested claim versus undisputed obligation, L4 lender's burden, L5 real-property proviso, L6 invalidity under the chosen law, L7 common domicile, L8 OR factors, L9 internal sharing citation, L10 first-instance labels, and L11 non-dispute versus admission all remain resolved in the reviewed files.

For each language I checked law and facts first, then citations, hard rules, voice and sentence variety; the common hero image was inspected separately. I re-read every changed passage and checked it against the other three versions.

## Official-source verification

Used `curl -L --fail --silent --show-error --connect-timeout 15 --max-time 45` to open all nine unique official URLs used in the columns: seven single-article law pages and the two judgment pages. All nine returned HTTP 200. After stripping only whitespace, the entire substantive text of each saved judgment occurs in the freshly fetched official page. All seven fetched article texts match `research/C2-statutes.md` exactly.

| Source | Claim and conditions checked |
|---|---|
| [Civil Code Article 1023](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1023) | Paragraph 1: each spouse's own debt. Paragraph 2: repayment of the other's debt with one's own property; reimbursement may be claimed even during marriage. The own-property condition has been restored in all four closing service descriptions. |
| [Civil Code Article 1003-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1003-1) | Paragraph 1: unless law or contract provides otherwise; economic capacity, household work or other circumstances. Paragraph 2: only debts arising from those family living expenses are joint and several. Internal sharing and liability to the creditor remain distinct. |
| [Civil Code Article 273](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=273) | Paragraph 1: one, several or all debtors; simultaneously or successively; all or part of performance. No first-sue-the-borrower requirement or unsupported contribution rule was added. |
| [Civil Code Article 1003](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1003) | Daily-household mutual agency; restriction may follow abuse; restriction cannot be asserted against a good-faith third party. No restriction procedure is invented. |
| [Code of Civil Procedure Article 277](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=277) | Favorable-fact burden, including both exceptions: a different statutory rule or manifest unfairness in the circumstances. |
| [Choice-of-law Act Article 47](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=47) and [Article 48](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=48) | Common national law → absent that, common domicile law → absent that, closest connection. Article 48: written choice of either spouse's national or domicile law; no agreement or invalidity under the chosen law; real-property proviso disapplies paragraphs 1–2 where the situs law requires special rules. The safe Taiwan-law example keeps differing nationalities, common Taiwan domicile and no written choice; no assertion decides whether Article 47 or 48 characterizes the household-debt issue. |
| [Keelung District Court, 113年度訴字第602號, 2025-04-07](https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=KLDV%2c113%2c%e8%a8%b4%2c602%2c20250407%2c1) | First instance; June 2021 marriage, two children, November 2023 divorce; NT$669,160 claim and NT$17,000 in five transfers; husband did not dispute borrowing. Household-use admission ineffective for all co-defendants on this issue; lender's burden; unclaimed chat-date loan, unilateral breakdown denied by ex-wife, independent income, shared use of her account, insufficient proof of her own loan. Husband ordered to repay; all claims against ex-wife dismissed. Not a holding that borrowing can never create household debt. |
| [New Taipei District Court, 111年度訴字第1294號, 2024-08-29](https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=PCDV%2c111%2c%e8%a8%b4%2c1294%2c20240829%2c1) | First instance; October 2019 admission and next-day surgery, subsequent stroke, treatment until January 2023; necessary medical care; NT$2,464,623 principal and 5% annual interest. Wife's statutory payment obligation and amount were not denied, but the claim was contested on other grounds. No allegation of malpractice is presented as a fact or used in the column's analysis. |

The New Taipei reference to Supreme Court authority is presented as that district court's reasoning, with its judgment linked. The columns do not independently cite or invent a Supreme Court docket. Neither district judgment's subsequent finality is claimed.

Also opened the three official history pages: [Civil Code](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001), [choice-of-law Act](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000007), and [Code of Civil Procedure](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0010001). Their headers confirm 2026-08-17, 2010-05-26 and 2023-11-29 respectively. The Civil Code's pending-effect notice concerns Articles 166-1 and 1223, not any article used here; the 2026 amendment to Article 1223 is not silently treated as effective. The columns attach no whole-law amendment date to an individual article. The [official English Act page](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=B0000007) confirms its English title.

Arithmetic checked: 517,000 + (8,490 + 10,530) × 8 = 669,160; the five transfers total 17,000; 2,120,830 + 343,793 = 2,464,623. The column's Korean/Japanese units represent these same amounts. The 5% rate is a report of the medical judgment, not a newly stated general interest rule or a claim that both principal portions start accruing on one date. There are no invented hypothetical amounts, exchange rates, filing periods or procedural deadlines.

## Issues and repairs

All issues below are resolved. Each entry uses Original → problem and reason → fix applied → facts preserved. No substantive reanalysis or new legal authority was needed.
### E1. Korean opening and batch variation

- `ko.md:26` Original: “246만 4,623대만달러. 신베이지방법원이 아내에게 남편과 연대해 갚으라고 명한 남편의 병원비입니다. 남편은 수술 뒤 뇌졸중을 일으켜 3년 넘게 그 병원에서 치료를 받았습니다.” → problem and reason: The number-only opening overlapped with the numeric start of the current C3 Korean draft. Lead with the actual ruling and keep the amount and hospital course in the following sentences. → fix applied: “신베이지방법원은 남편의 병원비 246만 4,623대만달러를 아내도 남편과 연대해 갚으라고 명했습니다. 남편은 수술 뒤 뇌졸중을 일으켰습니다. 그 병원에 3년 넘게 입원했습니다.” → facts preserved: Same court, wife jointly liable with husband, NT$2,464,623, postoperative stroke and over three years at that hospital; original official link retained.

### E2. Four languages: unlinked limitation of the Keelung result

- `ko.md:66` Original: “그렇다고 빌린 돈이 가정생활비용 채무가 될 수 없다는 뜻은 아닙니다. 이 사실관계에서는 빌려준 사람이 증명하지 못했을 뿐입니다.” → problem and reason: This paragraph states a legal proposition about household loans and limits a judgment holding, but carried no inline official source. Add Article 1003-1 and the existing Keelung link in this paragraph. → fix applied: “그렇다고 빌린 돈이 가정생활비용 채무가 될 수 없다는 뜻은 아닙니다. 이 사실관계에서는 빌려준 사람이 증명하지 못했을 뿐입니다.” → facts preserved: No loan category is excluded; the lender failed to prove household use on these facts. No words, numbers or conditions were removed.
- `ja.md:66` Original: “借りたお金が家庭生活費の債務になることはない、と判決が述べたわけではありません。この事実関係のもとで、貸した人が証明できなかったのです。” → problem and reason: This paragraph states a legal proposition about household loans and limits a judgment holding, but carried no inline official source. Add Article 1003-1 and the existing Keelung link in this paragraph. → fix applied: “借りたお金が家庭生活費の債務になることはない、と判決が述べたわけではありません。この事実関係のもとで、貸した人が証明できなかったのです。” → facts preserved: No loan category is excluded; the lender failed to prove household use on these facts. No words, numbers or conditions were removed.
- `en.md:66` Original: “None of this means a loan can never be a household debt. On these facts, the lender did not prove it.” → problem and reason: This paragraph states a legal proposition about household loans and limits a judgment holding, but carried no inline official source. Add Article 1003-1 and the existing Keelung link in this paragraph. → fix applied: “None of this means a loan can never be a household debt. On these facts, the lender did not prove it.” → facts preserved: No loan category is excluded; the lender failed to prove household use on these facts. No words, numbers or conditions were removed.
- `zh-hant.md:66` Original: “這不代表借款永遠不會成為家庭生活費用的債務。只是在這個案子的事實下，出借人沒有證明。” → problem and reason: This paragraph states a legal proposition about household loans and limits a judgment holding, but carried no inline official source. Add Article 1003-1 and the existing Keelung link in this paragraph. → fix applied: “這不代表借款永遠不會成為家庭生活費用的債務。只是在這個案子的事實下，出借人沒有證明。” → facts preserved: No loan category is excluded; the lender failed to prove household use on these facts. No words, numbers or conditions were removed.

### E3. Four languages: case-specific burden beside the statutory rule

- `ko.md:60` Original: “법원의 답은 빌려준 사람이었습니다.” → problem and reason: Article 277 supports the general burden rule, but the sentence describing which party bore the burden in this case also needs the Keelung judgment. Link the court. English now identifies the court as the actor. → fix applied: “법원의 답은 빌려준 사람이었습니다.” → facts preserved: Lender carries the household-use burden on these facts; Article 277 and both of its exceptions remain intact.
- `ja.md:60` Original: “裁判所の答えは、貸した側でした。” → problem and reason: Article 277 supports the general burden rule, but the sentence describing which party bore the burden in this case also needs the Keelung judgment. Link the court. English now identifies the court as the actor. → fix applied: “裁判所の答えは、貸した側でした。” → facts preserved: Lender carries the household-use burden on these facts; Article 277 and both of its exceptions remain intact.
- `en.md:60` Original: “Second, the burden of proof sat with the lender, who had to prove the money was used for the couple's living expenses.” → problem and reason: Article 277 supports the general burden rule, but the sentence describing which party bore the burden in this case also needs the Keelung judgment. Link the court. English now identifies the court as the actor. → fix applied: “Second, the court placed the burden of proof on the lender, who had to prove the money was used for the couple's living expenses.” → facts preserved: Lender carries the household-use burden on these facts; Article 277 and both of its exceptions remain intact.
- `zh-hant.md:60` Original: “法院要出借人舉證。” → problem and reason: Article 277 supports the general burden rule, but the sentence describing which party bore the burden in this case also needs the Keelung judgment. Link the court. English now identifies the court as the actor. → fix applied: “法院要出借人舉證。” → facts preserved: Lender carries the household-use burden on these facts; Article 277 and both of its exceptions remain intact.

### E4. Four languages: judgment citation in the lawyer-services paragraph

- `ko.md:80` Original: “기륭 사건에서는 생활비로 쓰였다는 사실을 채권자가 증명해야 했고” → problem and reason: The closing services paragraph again states the Keelung allocation of the burden. Its existing statute links do not themselves source that case-specific statement. Add the existing judgment URL locally. → fix applied: “기륭 사건에서는 생활비로 쓰였다는 사실을 채권자가 증명해야 했고” → facts preserved: Same burden and same proposed representation work; no guarantee, new procedural rule or client story.
- `ja.md:80` Original: “基隆の事件では、生活費に使われたことを証明する責任は貸した側にありました。” → problem and reason: The closing services paragraph again states the Keelung allocation of the burden. Its existing statute links do not themselves source that case-specific statement. Add the existing judgment URL locally. → fix applied: “基隆の事件では、生活費に使われたことを証明する責任は貸した側にありました。” → facts preserved: Same burden and same proposed representation work; no guarantee, new procedural rule or client story.
- `en.md:80` Original: “where in Keelung the burden of proof lay with the lender” → problem and reason: The closing services paragraph again states the Keelung allocation of the burden. Its existing statute links do not themselves source that case-specific statement. Add the existing judgment URL locally. → fix applied: “where in Keelung the burden of proof lay with the lender” → facts preserved: Same burden and same proposed representation work; no guarantee, new procedural rule or client story.
- `zh-hant.md:80` Original: “基隆案中法院要出借人負舉證責任，答辯就從這裡著手。” → problem and reason: The closing services paragraph again states the Keelung allocation of the burden. Its existing statute links do not themselves source that case-specific statement. Add the existing judgment URL locally. → fix applied: “基隆案中法院要出借人負舉證責任，答辯就從這裡著手。” → facts preserved: Same burden and same proposed representation work; no guarantee, new procedural rule or client story.

### E5. Four languages: own-property condition in the closing reimbursement sentence

- `ko.md:80` Original: “배우자의 개인 빚을 이미 대신 갚았다면” → problem and reason: The earlier body accurately states Article 1023(2), but the closing restatement omitted “with one's own property”. Its text is 「夫妻之一方以自己財產清償他方之債務時，雖於婚姻關係存續中，亦得請求償還。」 Restore that already established condition. → fix applied: “배우자의 개인 빚을 자기 재산으로 이미 대신 갚았다면” → facts preserved: The spouse's personal debt, payment with the reader's own property, assessment of reimbursement, and Article 1023(2) link remain; this is not contribution for a shared household debt.
- `ja.md:80` Original: “配偶者の個人的な借金をすでに肩代わりしたのであれば” → problem and reason: The earlier body accurately states Article 1023(2), but the closing restatement omitted “with one's own property”. Its text is 「夫妻之一方以自己財產清償他方之債務時，雖於婚姻關係存續中，亦得請求償還。」 Restore that already established condition. → fix applied: “配偶者の個人的な借金を自分の財産ですでに肩代わりしたのであれば” → facts preserved: The spouse's personal debt, payment with the reader's own property, assessment of reimbursement, and Article 1023(2) link remain; this is not contribution for a shared household debt.
- `en.md:80` Original: “If you have already paid your spouse's personal debt, the lawyer” → problem and reason: The earlier body accurately states Article 1023(2), but the closing restatement omitted “with one's own property”. Its text is 「夫妻之一方以自己財產清償他方之債務時，雖於婚姻關係存續中，亦得請求償還。」 Restore that already established condition. → fix applied: “If you have already paid your spouse's personal debt with your own property, the lawyer” → facts preserved: The spouse's personal debt, payment with the reader's own property, assessment of reimbursement, and Article 1023(2) link remain; this is not contribution for a shared household debt.
- `zh-hant.md:80` Original: “如果已經替配偶還了對方個人的債務” → problem and reason: The earlier body accurately states Article 1023(2), but the closing restatement omitted “with one's own property”. Its text is 「夫妻之一方以自己財產清償他方之債務時，雖於婚姻關係存續中，亦得請求償還。」 Restore that already established condition. → fix applied: “如果已經用自己的財產替配偶還了對方個人的債務” → facts preserved: The spouse's personal debt, payment with the reader's own property, assessment of reimbursement, and Article 1023(2) link remain; this is not contribution for a shared household debt.

### E6. Four languages: final paragraph tied to the case

- `ko.md:82` Original: “상담을 원하시면 받은 서류와 함께 혼인한 시기, 빚이 생긴 시기를 적어 호정(昊鼎)국제법률사무소 이메일 wei@hoveringlaw.com.tw로 보내 주십시오. 사무소는 臺北市大同區承德路一段35號7樓之2에 있습니다.” → problem and reason: The contact paragraph ended on the office address. Move the address earlier so the paragraph ends on the received documents and marriage/debt dates, as variety self-check 5.7 requires. → fix applied: “호정(昊鼎)국제법률사무소는 臺北市大同區承德路一段35號7樓之2에 있습니다. 상담을 원하시면 받은 서류와 함께 혼인한 시기, 빚이 생긴 시기를 적어 이메일 wei@hoveringlaw.com.tw로 보내 주십시오.” → facts preserved: Exact firm name, email, full required Taipei address and the English phrase “English-speaking lawyer in Taipei” remain. One soft contact paragraph only; no sales promise.
- `ja.md:82` Original: “ご相談は、昊鼎国際法律事務所へメール（wei@hoveringlaw.com.tw）でお寄せください。届いた書類とあわせて、結婚した時期と借金が生じた時期をお書き添えください。事務所の所在地は台北市大同区承徳路一段35号7F-2です。” → problem and reason: The contact paragraph ended on the office address. Move the address earlier so the paragraph ends on the received documents and marriage/debt dates, as variety self-check 5.7 requires. → fix applied: “昊鼎国際法律事務所の所在地は台北市大同区承徳路一段35号7F-2です。ご相談はメール（wei@hoveringlaw.com.tw）でお寄せください。届いた書類とあわせて、結婚した時期と借金が生じた時期をお書き添えください。” → facts preserved: Exact firm name, email, full required Taipei address and the English phrase “English-speaking lawyer in Taipei” remain. One soft contact paragraph only; no sales promise.
- `en.md:82` Original: “For a consultation with an English-speaking lawyer in Taipei, you can email Hovering International Law Firm at wei@hoveringlaw.com.tw with the papers you received and the dates of your marriage and of the debt. The office is at 7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City 103, Taiwan.” → problem and reason: The contact paragraph ended on the office address. Move the address earlier so the paragraph ends on the received documents and marriage/debt dates, as variety self-check 5.7 requires. → fix applied: “Hovering International Law Firm is at 7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City 103, Taiwan. For a consultation with an English-speaking lawyer in Taipei, you can email wei@hoveringlaw.com.tw with the papers you received and the dates of your marriage and of the debt.” → facts preserved: Exact firm name, email, full required Taipei address and the English phrase “English-speaking lawyer in Taipei” remain. One soft contact paragraph only; no sales promise.
- `zh-hant.md:82` Original: “如需諮詢，可以寫信到昊鼎國際法律事務所（wei@hoveringlaw.com.tw），附上收到的文件，並說明結婚和債務發生的時間。事務所地址：臺北市大同區承德路一段35號7樓之2。” → problem and reason: The contact paragraph ended on the office address. Move the address earlier so the paragraph ends on the received documents and marriage/debt dates, as variety self-check 5.7 requires. → fix applied: “昊鼎國際法律事務所地址：臺北市大同區承德路一段35號7樓之2。如需諮詢，可以寫信到wei@hoveringlaw.com.tw，附上收到的文件，並說明結婚和債務發生的時間。” → facts preserved: Exact firm name, email, full required Taipei address and the English phrase “English-speaking lawyer in Taipei” remain. One soft contact paragraph only; no sales promise.

### E7. Korean and English: long choice-of-law sentences

- `ko.md:70` Original: “섭외민사법률적용법 제47조에 따르면 혼인의 효력은 부부의 공통 본국법, 그것이 없으면 공통 주소지법, 그것도 없으면 혼인과 가장 밀접한 관계가 있는 곳의 법에 따릅니다. 부부재산제를 정한 제48조는 부부가 한쪽의 본국법이나 주소지법을 서면으로 합의했으면 그 법을 따르게 하고(제1항), 합의가 없거나 그 법에 따라 무효이면 제47조와 같은 순서를 밟게 합니다(제2항). 부부의 부동산은 소재지법상 특별한 규정을 따라야 하면 제1항과 제2항이 적용되지 않습니다(제3항).” → problem and reason: Several long conditional sentences followed each other. Split the established sequence and the Article 48 agreement/invalidity rule into ordinary sentences; English “points the effects … to” is replaced with a direct explanation. → fix applied: “섭외민사법률적용법 제47조에 따르면 혼인의 효력은 부부의 공통 본국법을 따릅니다. 공통 본국법이 없으면 공통 주소지법을 적용합니다. 그것도 없으면 혼인과 가장 밀접한 관계가 있는 곳의 법을 따릅니다. 부부재산제를 정한 제48조는 부부가 한쪽의 본국법이나 주소지법을 서면으로 합의했으면 그 법을 따르게 합니다(제1항). 합의가 없거나 그 법에 따라 무효이면 제47조와 같은 순서로 정합니다(제2항). 부부의 부동산은 소재지법상 특별한 규정을 따라야 하면 제1항과 제2항이 적용되지 않습니다(제3항).” → facts preserved: Same law title; Articles 47–48; sequential fallback; written agreement; either spouse's national or domicile law; invalidity under that law; matrimonial-property scope; paragraph 3 exception. Paragraph numbers and both URLs retained.
- `en.md:70` Original: “Article 47 of Taiwan's Act Governing the Choice of Law in Civil Matters Involving Foreign Elements points the effects of marriage to the spouses' common national law, then to the law of their common domicile, then to the law most closely connected with the marriage. Article 48 applies the same ladder to the matrimonial property regime (paragraph 2), unless the spouses chose in writing the national or domicile law of one of them and the choice is valid under that law (paragraph 1). Neither paragr […]” → problem and reason: Several long conditional sentences followed each other. Split the established sequence and the Article 48 agreement/invalidity rule into ordinary sentences; English “points the effects … to” is replaced with a direct explanation. → fix applied: “Article 47 of Taiwan's Act Governing the Choice of Law in Civil Matters Involving Foreign Elements starts with the spouses' common national law for the effects of marriage. Without one, it applies the law of their common domicile. If they share neither, the law most closely connected with the marriage applies. Article 48 allows a written choice of either spouse's national or domicile law for the matrimonial property regime (paragraph 1). Without that agreement, or if it is invalid under the chos […]” → facts preserved: Same law title; Articles 47–48; sequential fallback; written agreement; either spouse's national or domicile law; invalidity under that law; matrimonial-property scope; paragraph 3 exception. Paragraph numbers and both URLs retained.

### E8. English: services sentence with too many clauses

- `en.md:80` Original: “To answer a "household expense" claim, the lawyer can gather the couple's bank statements, receipts and evidence of the borrowing spouse's own income, reply to the creditor and defend you in court, where in Keelung the burden of proof lay with the lender.” → problem and reason: The sentence combined evidence gathering, reply, court defense and a judgment finding. Separate the gathering sentence from the representation sentence and keep the Keelung link with its finding. → fix applied: “To answer a "household expense" claim, the lawyer can gather the couple's bank statements, receipts and evidence of the borrowing spouse's own income. They can reply to the creditor and defend you in court; in Keelung, the lender bore the burden of proof.” → facts preserved: Bank statements, receipts, borrowing spouse's income, creditor reply, court defense and lender's proof burden all remain.

### E9. English: agency limitation sentence

- `en.md:80` Original: “If your spouse is abusing the household agency, the lawyer can advise on a restriction under Article 1003, paragraph 2, and on its limit: it cannot be asserted against a third party in good faith.” → problem and reason: Split the long sentence after the Article 1003(2) reference, so the good-faith limit is independently readable. → fix applied: “If your spouse is abusing the household agency, the lawyer can advise on a restriction under Article 1003, paragraph 2. Its limit remains: the restriction cannot be asserted against a third party in good faith.” → facts preserved: Abuse condition, possible restriction, lawyer's advisory role and mandatory good-faith third-party limit remain; no suggestion that a restriction defeats all creditors.

## Applied edit list

- ko: E1, E2, E3, E4, E5, E6, E7 — 7 substitutions.
- ja: E2, E3, E4, E5, E6 — 5 substitutions.
- en: E2, E3, E4, E5, E6, E7, E8, E9 — 8 substitutions.
- zh-hant: E2, E3, E4, E5, E6 — 5 substitutions.

Total: 25 bounded substitutions in the four column files. No changes to facts.md, research, image, other columns, publication metadata or external systems. All original distinct URLs and numeric literals are preserved in each language. The frontmatter is byte-for-byte unchanged. Repeated links were added only from the existing research/source inventory. The temporary before/after audit material is in `/private/tmp/c2-final-astra-r1/`; this report is the durable review record.

## Hard-rule and language readback

| Language | Law/facts and citations | Rules and voice |
|---|---|---|
| ko | Same verified statutory conditions and both case holdings; local links repaired at E2–E4; reimbursement condition restored. | Natural 합니다체; specific title; direct court-result opening; no names, bold, phone, human-review claim or invented anecdote. Exact Korean firm name, email and 臺北市大同區承德路一段35號7樓之2 retained. |
| ja | Same legal core; no substitution of Japanese law; both exceptions and the Article 48(3) proviso remain in body/FAQ. | Natural です・ます; no mixed だ・である prose; Taiwan institution names distinguished from Japanese institutions. Exact 昊鼎国際法律事務所, email and 台北市大同区承徳路一段35号7F-2 retained. |
| en | Same legal core, joint-and-several meaning, factual amounts and first-instance limits; clear conditional fallback after E7. | Plain English; title 56 characters, title plus site suffix exceeds 60; seoTitle 41 characters; summary 157 characters with no forbidden symbols. Exact required English firm/address and “English-speaking lawyer in Taipei” retained. |
| zh-hant | Same rules, burden and cases; colloquial summaries do not turn the proof failure into immunity for loans. | Taiwan vocabulary and Traditional Chinese; no Mainland terms, simplified prose, private names or review claims. Exact 昊鼎國際法律事務所, email and 臺北市大同區承德路一段35號7樓之2 retained. |

All four have the prescribed frontmatter keys, family topic, matching H1/title, legal-ai-assistant author, correct audience/category, three FAQ entries, NNN hero path, dates and localized source section. Every statutory rule paragraph has an inline official link; short case-result bridges retain the citation-free breathing space explicitly allowed by the variety rule. FAQ conditions agree with the fully sourced body. Every article cited is in C2-statutes.md; every used official source is in the final source list, with the required check date. Judgment URLs match the first lines of the saved files exactly.

Each language has two valid same-language internal column links, checked by lint against the snapshot: property-regime/property-division article (ko/zh 046; ja 267; en 213) and inheritance article 232. No links to this batch. Guarantor/co-borrower, inheritance and enforcement appear only as separate-topic pointers, with no added substantive rule; no consumer-debt, tax or company-debt analysis. Korean/Japanese/US context is confined to asking the relevant local professional; no foreign court practice is asserted. The lawyer section describes document and evidence review, a response/defense, reimbursement assessment, agency-abuse advice and coordination with related proceedings, without promising a result.

## Opening deletion test and comparison material

For the first two paragraphs, I tested removal of each information-bearing sentence. Korean paragraph 1 supplies the court, medical principal, joint liability and medical course; paragraph 2 supplies the contrasting loan outcome and proof question. Japanese paragraph 1 gives the baseline and exception; paragraph 2 makes the two-court application concrete. English paragraph 1 gives both contrasting outcomes and the medical amount; paragraph 2 identifies the purpose/proof distinction. Traditional Chinese starts with the exact burden-of-proof holding, identifies the lender's unsuccessful joint claim, and contrasts the medical judgment in paragraph 2. These are useful facts or the specific comparison, not a generic announcement of the article's contents. Short connective/result sentences were retained for readable transitions rather than treated as a second introduction.

Compared openings, subheads and final two paragraphs against these recent same-language snapshot articles, all published 2026-10-18:

- ko: `snapshot/src/content/columns/636-taiwan-related-company-loan-permitted-conditions.md`, `635-taiwan-traffic-ticket-other-driver-notice.md`, `634-taiwan-employee-resignation-notice-indefinite-contract.md`.
- ja: the same three filenames under `snapshot/src/content/columns-ja/`.
- en: the same three filenames under `snapshot/src/content/columns-en/`.
- zh-hant: the same three filenames under `snapshot/src/content/columns-zh/`.

The comparators use a company-loan rule/percentage, a traffic-notice rule or reader question, and an employee hypothetical. C2 uses actual contrasting debt judgments and their proof records. Its court/date subheads and medical-versus-loan analysis are specific to this topic. The required lawyer/contact section is shared site structure; its work and requested records here concern the marriage and debt, not the comparators' transactions. This was a local snapshot comparison, not a fresh assertion about the current live site's most recent publication order.

Also inspected C1/C3/C4 openings in each current batch language. Korean E1 changes C2 from a standalone number to the medical ruling, distinguishing C3's ticket-price opening. Japanese starts from the legal rule; English from the different judicial outcomes; zh-hant from the court's burden-of-proof sentence. A quoted judicial holding is distinct from C1's quoted party message inside its rental scene. No stock hypothetical opening appears in C2, and its paragraphs do not copy the other columns' scene openings.

## Sentence variety: sections 5–6

Final checker result: zero FAIL lines in every language. Korean and Japanese produce only polite-ending WARNs, compatible with the required register. No MONOTONY rejection remains. Manual check: at least two very short sentences per language; no word opens three prose paragraphs; no three consecutive claim/statute/caveat paragraphs; each language retains the short citation-free Keelung-result paragraph; contrast templates remain at most three with no invented opposing position; contact paragraphs now end on case-specific records/dates; no facts, numbers, official URLs or hypothetical labels were lost. The generic conditional cross-national couple discussion is a legal category, not an invented client story. Japanese questions ending 「でしょうか。」 are present despite the checker's q=0.

| Language | Sentences | CV | Very-short share | Similar-length run share | Contrast count | Result |
|---|---:|---:|---:|---:|---:|---|
| ko | 83 | 0.453 | 0.084 | 0.025 | 0 | 0 FAIL; register WARN only |
| ja | 85 | 0.455 | 0.118 | 0.084 | 0 | 0 FAIL; register WARN only |
| en | 76 | 0.457 | 0.132 | 0.081 | 1 | OK |
| zh-hant | 68 | 0.573 | 0.103 | 0.030 | 0 | OK |

Short-sentence examples: ko “증거는 모자랐습니다.” and “결과는 갈렸습니다.”; ja “結婚しても変わりません。” and “結果は分かれました。”; en “He had to pay.” and “She did not.”; zh-hant “證據不夠。” and “前夫不爭執借款。”

## Reproducible validation and reviewed versions

After every file-edit pass, ran:

```text
python3 /Users/son7/tseng-col-1019-work/lint.py /Users/son7/tseng-col-1019-work/drafts/C2/<lang>.md <lang> taiwan-spouse-debt-family-living-expenses-joint-liability
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1019-work/drafts/C2/<lang>.md
```

Final checks cover ko, ja, en and zh-hant individually. All eight command exits are 0. Lint results and lengths: ko OK / 3,416 characters; ja OK / 3,992 characters; en OK / 1,539 words; zh-hant OK / 2,643 characters. All are within mandatory bounds. They exceed the preferred midpoint because the brief requires two judgments plus the cross-border qualifications; no extra legal regime has been added to fill space.

| Reviewed file | SHA-256 |
|---|---|
| `drafts/C2/ko.md` | `eb50b928ce597bcebaa9034243e3583fdc5bd6aa45d9d1a3deae32afe91ef3f6` |
| `drafts/C2/ja.md` | `052a6b3f3b99cceeb4b5da91df81aebec24ed17cdec99845d2d8a396906afaa6` |
| `drafts/C2/en.md` | `7c4eaf0fdb952fe702f170dd28474d7ec311896686f7792e47eefc8a40cd05d4` |
| `drafts/C2/zh-hant.md` | `a580c333c95eea939949abd13f3dc5010b2ff70de0f2f2f2162021083b8248a7` |

## Image verdict

OK — viewed `/Users/son7/tseng-col-1019-work/images/C2.webp` with the image-viewing tool. It is a respectful, illustrative domestic table scene: two empty chairs/cups, blank envelopes, an unlit unbranded device and children's abstract crayon drawings. No people or faces, readable text/documents, logos or flags are visible; no actual family, litigant or institution is identifiable. The household-expense/creditor-letter association fits the column. No replacement required.

Image SHA-256: `eaaa152ba523beec8008a7c3ddfacdda9daf43e1d995692fea73b62395927798`.

## Points for lawyer confirmation

- 실제 사건의 치료비·차입금이 필요한 가정생활비용에 해당하는 범위와, 생활비 지출을 입증할 자료 및 공동피고 자백의 취급을 확인해 주십시오.
- 국제부부의 공동 주소지 판단, 가정생활비 채무의 제47조·제48조상 성질, 서면 준거법 합의와 부동산 특칙의 영향을 확인해 주십시오.
- 일상가사 대리권 제한의 실무상 통지·입증 방법과 선의의 제3자 보호, 자기 재산으로 대신 갚은 채무의 상환청구 범위를 확인해 주십시오.

These are individual-matter practice questions, not unresolved publication blockers or promises that the statute alone determines a future case. The PASS applies only to the four hashes and image above; it records publishable reviewed content, not an actual publication or deployment.

VERDICT: PASS
