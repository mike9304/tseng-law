# 안내 언어판(45개 locale) 정정 전파 fixspec — 003·006·008·010·017·018 (2026-10-07, 리드 son7-f2)

근거: 이 정정들은 ko/en/zh-hant/ja에 이미 배포됨(4d8fd931 003, 1290b84e 006·008·010·017·018) — 리드가 원문 확인(FINDINGS F-006·F-007·F-011·F-017·F-019~F-021·F-024·F-025). 아래 BEFORE/AFTER는 **en 원문 그대로**. 안내 언어판은 정정 전 en(=ko)을 번역한 것이므로 BEFORE에 해당하는 대상 언어 문장을 찾아 AFTER의 뜻으로 바꾼다.

전파하지 않는 것: 003 축약(블록 74 vs 158), 017·018 FAQ 중복 삭제(D-001), 018 소제목 번호 변경, lastmod 외 frontmatter, read_time.

## 003 taiwan-traffic-accident-procedure (4d8fd931 — 축약과 섞여 있으므로 아래 3건만)

### F-007 민법 §196 물적 손해 (Q7 「손해 항목」 목록의 Property 줄)
BEFORE:
```
- Property: Under Civil Code Article 196, a claimant may seek proven actual property damage, including supported repair expenses or diminution in value.
```
AFTER:
```
- Property: Under Civil Code Article 196, the owner may claim the reduction in the vehicle's value caused by the damage; repair costs serve as the measure only to the extent necessary, and depreciation may be deducted where new parts replace old ones.
```

### F-006 민법 §188② 「피해자가 신청하면」 (Q14 사용자책임)
BEFORE:
```
If the employer proves the preceding defense and the victim cannot recover damages under paragraph 1, Civil Code Article 188, paragraph 2 permits the court to consider the employer's and victim's economic circumstances and order full or partial compensation.
```
AFTER:
```
If the employer proves the preceding defense and the victim cannot recover damages under paragraph 1, Civil Code Article 188, paragraph 2 provides that, if the victim applies, the court may, considering the economic circumstances of the employer and the victim, order the employer to pay all or part of the damages.
```

### F-011 強制汽車責任保險法 §28 면책 (Q15, 제6조 문단 끝에 1문장 추가)
BEFORE(문단 끝):
```
... The Act provides basic no-fault statutory benefits when a person is injured or killed in a motor-vehicle accident, subject to its definitions of passengers and third parties outside the vehicle.
```
AFTER(이 문장을 문단 끝에 추가):
```
The insurer does not pay benefits where the injured person or another claimant caused the accident intentionally or while committing a crime (Article 28).
```
주의: 면책 주체는 **피해자·그 밖의 청구권자**(운전자 아님). 운전자 음주 등은 §29(보험사가 먼저 지급 후 구상) — 이 문장에 넣지 않는다.

## 006 taiwan-massage-history-law (1290b84e)

### F-019 본문  (en diff -55 +55)
BEFORE:
```
This law remained in force until 2003, when police found that Mr. Lin, who ran a barbershop, had hired two employees without visual impairments to provide shampooing and massage services.
```
AFTER:
```
This restriction remained in force until October 31, 2011; in 2003, within that period, police found that Mr. Lin, who ran a barbershop, had hired two employees without visual impairments to provide shampooing and massage services.
```

### F-019 본문(과태료 주체·성격)  (en diff -57 +57)
BEFORE:
```
Under the law at the time, Mr. Lin was fined NT$40,000, while the two employees were fined NT$10,000 and NT$20,000, respectively.
```
AFTER:
```
Under the law at the time, the Taipei City Social Affairs Bureau imposed administrative fines of NT$40,000 on Mr. Lin and NT$10,000 and NT$20,000 on the two employees, respectively.
```

### F-019 본문(釋字649·2011 효력 상실)  (en diff -77 +77)
BEFORE:
```
In the end, the Grand Justices declared the statutory provision allowing only people with visual impairments to engage in the massage business unconstitutional.
```
AFTER:
```
In the end, in Judicial Yuan Interpretation No. 649 of October 31, 2008, the Grand Justices declared the statutory provision allowing only people with visual impairments to engage in the massage business unconstitutional, and the provision ceased to have effect on October 31, 2011, at the end of the three-year grace period the interpretation allowed.
```

## 008 taiwan-labor-severance-law (1290b84e)

### F-020/F-017① FAQ(frontmatter faq a:)  (en diff -14 +14)
BEFORE:
```
    a: "No. Unlike some jurisdictions, for example Korea, Taiwan requires a company to pay severance only when the company dismisses the employee. If the employee resigns voluntarily, the company does not need to pay severance."
```
AFTER:
```
    a: "No. Unlike some jurisdictions, for example Korea, Taiwan requires a company to pay severance only when the company dismisses the employee. If the employee resigns voluntarily, the company does not need to pay severance. However, if a ground under Article 14 of the Labor Standards Act exists, such as the company failing to pay wages or violating labor laws and regulations, and the employee terminates the contract on that basis, the company must pay severance."
```

### F-017④ FAQ(frontmatter faq a:)  (en diff -16 +16)
BEFORE:
```
    a: "No. If the employee commits an unlawful act, violates company rules, or is absent from work without justification for three consecutive days (Labor Standards Act Article 12), the company may dismiss the employee without prior notice and need not pay severance. By contrast, an economic dismissal under Article 11 requires prior notice and payment of severance."
```
AFTER:
```
    a: "No. If the employee commits an unlawful act, seriously violates the labor contract or company rules, or is absent from work without justification for three consecutive days or six days in one month (Labor Standards Act Article 12), the company may dismiss the employee without prior notice and need not pay severance. By contrast, an economic dismissal under Article 11 requires prior notice and payment of severance."
```

### F-017② FAQ(frontmatter faq a:)  (en diff -18 +18)
BEFORE:
```
    a: "For each full year of service, the employer must pay severance equal to 0.5 months of the employee’s average wages, up to a maximum of six months’ wages. This is the formula for years of service governed by Article 12 of the Labor Pension Act; for years of service governed by Article 17 of the Labor Standards Act, severance is one month of average wages per full year with no cap."
```
AFTER:
```
    a: "For each full year of service, the employer must pay severance equal to 0.5 months of the employee’s average wages, up to a maximum of six months’ wages. This is the formula for years of service governed by Article 12 of the Labor Pension Act; for years of service governed by Article 17 of the Labor Standards Act, severance is one month of average wages per full year with no cap. The Labor Pension Act applies to Taiwanese nationals, foreign nationals who are married to a Taiwanese national and have been granted residence, foreign nationals who have been granted permanent residence, and similar workers (Article 7, Paragraph 1), and, from 2026, to foreign professionals doing professional work (Article 24 of the Act for the Recruitment and Employment of Foreign Professionals); severance for other workers, and for years of service before the Act applied, is calculated under Article 17 of the Labor Standards Act."
```

### F-017① 본문 새 문단(자발적 퇴사 설명 뒤)  (en diff -38,0 +39,2)
BEFORE: (없음 — 새 줄 추가. 위치는 en AFTER 파일의 앞뒤 문단으로 찾는다)
AFTER:
```
However, if a ground under [Article 14 of the Labor Standards Act](/en/columns/taiwan-voluntary-resignation-severance) exists, such as the company failing to pay wages or violating labor laws and regulations, and the employee terminates the contract because of it, the company must pay severance.

```

### F-017④ 본문 목록(중대한 위반)  (en diff -41 +43)
BEFORE:
```
violates company rules,
```
AFTER:
```
seriously violates the labor contract or company rules,
```

### F-017④ 본문 목록(한 달 6일)  (en diff -43 +45)
BEFORE:
```
or is absent from work without justification for three consecutive days,
```
AFTER:
```
or is absent from work without justification for three consecutive days or for six days in one month,
```

### F-017③ 본문 새 문단(§12② 30일)  (en diff -46,0 +49,2)
BEFORE: (없음 — 새 줄 추가. 위치는 en AFTER 파일의 앞뒤 문단으로 찾는다)
AFTER:
```
However, for every ground except item 3 (a final sentence of imprisonment), the company must dismiss the employee within 30 days of learning of the circumstances (Article 12, Paragraph 2 of the Labor Standards Act).

```

### F-017⑦ 표 「의미」 행 셋째 칸  (en diff -52 +56)
BEFORE:
```
| Meaning | When an employer needs to adjust staffing because of business conditions, the reason arises from the employer’s business and is not attributable to the worker. The employer must therefore observe the advance-notice period and pay severance to mitigate the resulting disadvantage to the worker. | When a worker engages in unlawful or improper conduct, the employer may immediately terminate the labor contract without prior notice and need not pay severance. This is an exercise of the employer’s disciplinary authority. | A worker is free to terminate the contract but must observe the notice period applicable to the worker’s length of service, giving the employer time to arrange a handover and find a replacement. |
```
AFTER:
```
| Meaning | When an employer needs to adjust staffing because of business conditions, the reason arises from the employer’s business and is not attributable to the worker. The employer must therefore observe the advance-notice period and pay severance to mitigate the resulting disadvantage to the worker. | When a worker engages in unlawful or improper conduct, the employer may immediately terminate the labor contract without prior notice and need not pay severance. This is an exercise of the employer’s disciplinary authority. | Under a contract with no fixed term, a worker is free to terminate the contract but must observe the notice period applicable to the worker’s length of service, giving the employer time to arrange a handover and find a replacement. |
```

### F-017① 표 「資遣費 지급 여부」 행 + F-017⑤ 법조문 표 §11 4·5호 번역  (en diff -56,2 +60,2)
BEFORE:
```
| Whether the company must pay severance (資遣費) | Required | Not required | Not required |
|  | Taiwan Labor Standards Act Article 11 (勞動基準法第11條): Except in one of the following circumstances, an employer may not terminate a labor contract even after giving the worker prior notice.  1. The employer’s business is suspended or transferred  2. The employer’s business incurs operating losses or undergoes a business contraction  3. Force majeure necessitates suspending business for one month or more  4. A change in the nature of the business makes a workforce reduction necessary, and the terminated employee cannot be reassigned to another suitable position  5. A particular worker is unable to perform the work required for the position satisfactorily | Taiwan Labor Standards Act Article 12 (勞動基準法第12條): An employer may dismiss a worker without prior notice in any of the following circumstances.  1. The worker misrepresents facts when entering into the labor contract, thereby misleading the employer and creating a risk of harm to the business  2. The worker commits violence against or seriously insults the employer, a member of the employer’s family, the employer’s agent, or another coworker  3. The worker receives a final sentence of fixed-term imprisonment or a more severe penalty and is neither granted a suspended sentence nor permitted to commute the sentence to a fine  4. The worker seriously violates the labor contract or work rules  5. The worker intentionally damages or consumes machinery, tools, raw materials, products, or other property owned by the employer, or intentionally discloses the employer’s technical or business secrets, thereby causing damage to the employer  6. The worker is absent without justification for three consecutive days or for six or more days in one month |  |
```
AFTER:
```
| Whether the company must pay severance (資遣費) | Required | Not required | Not required (except where the employee terminates the contract for an Article 14 ground) |
|  | Taiwan Labor Standards Act Article 11 (勞動基準法第11條): Except in one of the following circumstances, an employer may not terminate a labor contract even after giving the worker prior notice.  1. The employer’s business is suspended or transferred  2. The employer’s business incurs operating losses or undergoes a business contraction  3. Force majeure necessitates suspending business for one month or more  4. The nature of the business has changed, staff reduction is necessary, and there is no suitable position to reassign the worker  5. The worker is clearly unable to perform the assigned work | Taiwan Labor Standards Act Article 12 (勞動基準法第12條): An employer may dismiss a worker without prior notice in any of the following circumstances.  1. The worker misrepresents facts when entering into the labor contract, thereby misleading the employer and creating a risk of harm to the business  2. The worker commits violence against or seriously insults the employer, a member of the employer’s family, the employer’s agent, or another coworker  3. The worker receives a final sentence of fixed-term imprisonment or a more severe penalty and is neither granted a suspended sentence nor permitted to commute the sentence to a fine  4. The worker seriously violates the labor contract or work rules  5. The worker intentionally damages or consumes machinery, tools, raw materials, products, or other property owned by the employer, or intentionally discloses the employer’s technical or business secrets, thereby causing damage to the employer  6. The worker is absent without justification for three consecutive days or for six or more days in one month |  |
```

### F-017②⑥ 인용 블록(勞退 §7①·外專法 §24·1년 미만 비례·30일 내 지급)  (en diff -61 +65)
BEFORE:
```
> (Up to a maximum of six months’ wages) This is the formula for years of service governed by Article 12 of the Labor Pension Act; for years of service governed by Article 17 of the Labor Standards Act, severance is one month of average wages per full year with no cap.
```
AFTER:
```
> (Up to a maximum of six months’ wages) This is the formula for years of service governed by Article 12 of the Labor Pension Act; for years of service governed by Article 17 of the Labor Standards Act, severance is one month of average wages per full year with no cap. The Labor Pension Act applies to Taiwanese nationals, foreign nationals who are married to a Taiwanese national and have been granted residence, foreign nationals who have been granted permanent residence, and similar workers (Article 7, Paragraph 1), and, from 2026, to foreign professionals doing professional work ([Article 24 of the Act for the Recruitment and Employment of Foreign Professionals](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=24)); severance for other workers, and for years of service before the Act applied, is calculated under Article 17 of the Labor Standards Act. Service of less than one year is calculated pro rata, and the company must pay the severance within 30 days after the contract ends.
```

## 010 taiwan-gym-injury-lawsuit (1290b84e)

### F-021 지급 의무자(운영회사만)  (en diff -24 +24)
BEFORE:
```
I served as litigation counsel for the plaintiff, the Korean student, in this case. In its first-instance judgment of January 24, 2022, in case 109 Consumer No. 7, the Taichung District Court ordered the defendant to pay [TWD 1,579,589](https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=TCDV,109,%E6%B6%88,7,20220124,1) together with the interest stated in the judgment.
```
AFTER:
```
I served as litigation counsel for the plaintiff, the Korean student, in this case. In its first-instance judgment of January 24, 2022, in case 109 Consumer No. 7, the Taichung District Court ordered the company that operates the gym, one of the defendants, to pay [TWD 1,579,589](https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=TCDV,109,%E6%B6%88,7,20220124,1) together with the interest stated in the judgment.
```

### F-021 消保法 §7③ 연대배상·감경  (en diff -72 +72)
BEFORE:
```
Under [Article 7 of the Taiwan Consumer Protection Act](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=7&pcode=J0170001), when a business operator provides services, it must ensure that the services have the level of safety reasonably expected under the professional or technical standards current at the time they are provided.
```
AFTER:
```
Under [Article 7 of the Taiwan Consumer Protection Act](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=7&pcode=J0170001), when a business operator provides services, it must ensure that the services have the level of safety reasonably expected under the professional or technical standards current at the time they are provided. Paragraph 3 of the same article provides that a business operator that violates these requirements and causes damage to a consumer or a third party is jointly and severally liable for compensation, and that even if the operator proves that it was not at fault, the court may do no more than reduce its liability.
```

## 017 taiwan-logistics-business-setup (1290b84e)

### F-024 就服法 §68 본문  (en diff -123 +115)
BEFORE:
```
Unauthorized work may lead to administrative fines and an order to leave Taiwan. Current directions issued by the National Immigration Agency generally prescribe a three-year bar on entry in unauthorized-work cases, but also identify circumstances in which the bar may be waived or shortened. A third party’s report does not mechanically determine the result; the relevant authorities assess the facts, applicable law, and individual circumstances.
```
AFTER:
```
A foreign national who works without authorization is subject to an administrative fine and must be ordered to leave Taiwan immediately, and may not work in Taiwan again (Article 68 of the Employment Service Act). Current directions issued by the National Immigration Agency generally prescribe a three-year bar on entry in unauthorized-work cases, but also identify circumstances in which the bar may be waived or shortened. A third party’s report does not mechanically determine the result; the relevant authorities assess the facts, applicable law, and individual circumstances.
```

### F-024 출처 목록 항목 추가  (en diff -140,0 +133)
BEFORE: (없음 — 새 줄 추가. 위치는 en AFTER 파일의 앞뒤 문단으로 찾는다)
AFTER:
```
- [Employment Service Act, Article 68 (Laws & Regulations Database)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=68)
```

## 018 taiwan-semiconductor-market-entry (1290b84e)

### F-025 발기인(주주 아님)  (en diff -70 +70)
BEFORE:
```
The capital of a company limited by shares is divided into shares. In principle two or more shareholders are required, but the government or a juristic person may form one alone, and a foreign juristic person may hold 100% of the shares. Shares are in principle freely transferable, subject to statutory exceptions, and special shares and employee stock options may be designed under law. The form therefore suits companies that expect investors, share transactions, employee equity incentives, or a future merger, acquisition, or listing or emerging-market registration; it is not limited to large companies. As to governance, a non-public company may, by its articles, not have a board and may have only one or two directors. A company with a single government or corporate shareholder may also, by its articles, not have a supervisor. Not every company limited by shares must obtain an annual financial-statement audit. For an ordinary company the main audit thresholds are paid-in capital of NT$30 million, or, below that capital, operating revenue of NT$100 million or 100 employees enrolled in labor insurance. Public companies follow the securities laws.
```
AFTER:
```
The capital of a company limited by shares is divided into shares. In principle two or more promoters are required, but the government or a juristic person may form one alone, and a foreign juristic person may hold 100% of the shares. Shares are in principle freely transferable, subject to statutory exceptions, and special shares and employee stock options may be designed under law. The form therefore suits companies that expect investors, share transactions, employee equity incentives, or a future merger, acquisition, or listing or emerging-market registration; it is not limited to large companies. As to governance, a non-public company may, by its articles, not have a board and may have only one or two directors. A company with a single government or corporate shareholder may also, by its articles, not have a supervisor. Not every company limited by shares must obtain an annual financial-statement audit. For an ordinary company the main audit thresholds are paid-in capital of NT$30 million, or, below that capital, operating revenue of NT$100 million or 100 employees enrolled in labor insurance. Public companies follow the securities laws.
```

### F-025 公司法 §387-1 노동권익 강습(새 문장)  (en diff -74 +74)
BEFORE:
```
When a foreign company forms a Taiwan subsidiary, it generally pre-clears the company name and then applies to the Investment Commission of the Ministry of Economic Affairs for investment approval. After approval it remits funds, completes determination of the investment amount and CPA capital verification, and then completes company formation and tax registration.
```
AFTER:
```
When a foreign company forms a Taiwan subsidiary, it generally pre-clears the company name and then applies to the Investment Commission of the Ministry of Economic Affairs for investment approval. After approval it remits funds, completes determination of the investment amount and CPA capital verification, and then completes company formation and tax registration. After applying for formation registration, the company must take part in labor-rights courses run by government agencies at any level or by non-profit organizations they designate (Article 387-1 of the Company Act, effective June 2026).
```

### F-025 거류증 신청 주체=외국인  (en diff -82 +82)
BEFORE:
```
Completing company registration in Taiwan does not mean that employees of the overseas head office may automatically work in Taiwan. A foreign national working in Taiwan must have a lawful work permit and, for a longer stay, a residence permit. In principle the employer applies for the foreign employee’s work permit and the corresponding residence permit.
```
AFTER:
```
Completing company registration in Taiwan does not mean that employees of the overseas head office may automatically work in Taiwan. A foreign national working in Taiwan must have a lawful work permit and, for a longer stay, a residence permit. In principle the employer applies for the foreign employee’s work permit, and the foreign national applies to the National Immigration Agency for the corresponding residence permit.
```

### F-025 審查標準 §39 첫 1명부터·§38②  (en diff -84 +84)
BEFORE:
```
It is relatively easier for a manager of a foreign company’s Taiwan subsidiary or branch to obtain a work permit. To apply for a work permit for a second or further foreign national, however, the Ministry of Labor requires, depending on the industry, that the company meet capital, revenue, or similar thresholds. If you plan to have foreign staff work in Taiwan, confirm before forming the Taiwan company whether the planned capital meets the applicable threshold.
```
AFTER:
```
It is relatively easier for a manager of a foreign company’s Taiwan subsidiary (a company approved for investment in which foreign nationals hold more than one-third of the shares) or branch to obtain a work permit. Even when hiring the first foreign national, however, the employer must meet one of the criteria in Article 39 of the Qualifications and Review Standards for foreign nationals’ work. For a company less than one year old, the criteria include paid-in capital (for a branch, operating funds in Taiwan) of at least NT$500,000 or revenue of at least NT$3 million; for a company one year old or more, they include average revenue over the most recent one year or three years of at least NT$3 million. If the employer hires two or more foreign nationals of the same type, those foreign nationals and the employer must meet the general standards of Chapter 2 (Article 38, paragraph 2). If you plan to have foreign staff work in Taiwan, confirm before forming the Taiwan company whether the planned capital meets the applicable threshold.
```
