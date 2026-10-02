## Findings

- [MINOR] 예산 조건이 2026년 접수분에만 붙어 있음 (본문 32행, FAQ 2)
  - 원문: "applications accepted in 2026 will in principle first be paid by the end of January 2027, once the 2027 budget has passed. Applications accepted from January 2027 onward are paid by the end of the following month." FAQ도 "subject to passage of the 2027 budget"를 2026년 접수분에만 붙였습니다.
  - 문제와 이유: 노동부(MOL) 원문은 "今(115)年受理之申請案件…原則於116年1月底前完成首次發給；明(116)年1月以後，受理之申請案件，則於次月底前核發，惟仍須俟116年度預算通過後始得發給"입니다. '惟' 단서는 앞의 두 일정에 모두 걸립니다. 2027년 1월 이후 접수분의 지급도 결국 116년도(2027년) 예산에서 나옵니다. 그런데 기사는 2027년 접수분을 조건 없는 확정 일정처럼 적었습니다. "once … has passed"도 예산 통과를 기정사실처럼 읽힙니다. 조건을 보존하라는 편집 규칙에 어긋납니다.
  - 수정안: "…in principle make the first payments by the end of January 2027. Applications accepted from January 2027 onward are to be paid by the end of the following month. Either way, payment depends on the 2027 central government budget being passed." FAQ 2에도 같은 구조를 적용합니다.

- [MINOR] 파견 직원 문단에서 보조금 청구 자격까지 단정함 (42행)
  - 원문: "That answer, rather than the label on the assignment letter, decides whether the Taiwan entitlement and the subsidy claim apply."
  - 문제와 이유: 출처(MOL 보도자료, BLI 페이지)는 "雇主依法給付…工資後" 신청한다는 점만 확인해 줍니다. 계약 주체 하나로 보조금 자격이 결정된다는 규정은 출처에서 확인되지 않습니다. 요건 요점(要點)의 자격 조문은 이번 검수에서 직접 열어 보지 못했습니다. "decides"는 출처보다 넓은 단정입니다.
  - 수정안: "That answer, rather than the label on the assignment letter, is usually what determines whether the Taiwan entitlement applies. The subsidy is claimed by the employer that actually paid the wages for days 9–14, so a split-payroll arrangement needs to be clear about which entity paid them."

- [NIT] 증빙 서류 문구가 근거 없는 전제를 깔고 있음 (46행)
  - 원문: "proof of marriage required under the work rules"
  - 문제와 이유: 모든 회사의 취업규칙이 혼인 증빙을 요구한다고 전제합니다.
  - 수정안: "any proof of marriage the work rules call for"

- [NIT] Article 43에 인라인 링크가 없음 (40행)
  - 원문: "…issued under Article 43 of the same Act."
  - 문제와 이유: 확인 결과 본문 내용은 정확합니다(규칙 제1조 "依勞動基準法第四十三條規定訂定"). 다만 다른 조문과 달리 링크가 없습니다.
  - 수정안: law.moj.gov.tw의 제43조 링크를 붙입니다.

- [NIT] read_time "7 min read"
  - 문제와 이유: 본문과 FAQ를 합쳐 약 700단어라 실제 읽는 시간은 4분 안팎입니다.
  - 처리: 다른 언어 판과 맞춰야 할 수 있어 수정본에서도 바꾸지 않았습니다.

위 문제 말고 다음 항목은 확인 결과 위반이 없었습니다.
- 굵은 강조 없음, 전화·팩스 번호 없음.
- 인라인 출처가 있고, 마지막 `## Sources` 섹션 뒤에 Checked 날짜 줄만 있음.
- frontmatter 키 정상, FAQ 3개, author는 legal-ai-assistant.
- 내부 작업 메모 없음. 명령형·체크리스트형 소제목과 "this article will explain" 같은 예고 문장도 없음.
- 영어 문장은 자연스러움. 감수(監修) 주장 없음.

## 사실 검증 메모

- https://www.mol.gov.tw/1607/1632/1633/99216/ (2026-09-29): 확인한 내용은 아래와 같습니다.
  - 10월 1일 시행, 혼인휴가 8일에서 14일로 연장.
  - 9~14일차 임금은 고용주가 먼저 지급하고 정부가 전액 보조.
  - 신청 시점: 근로자가 휴가를 다 쓴 뒤, 또는 휴가 도중 계약이 종료된 뒤.
  - 신청 방법: 단위 인증서(單位憑證)로 BLI e화 서비스 시스템에서 온라인 신청, 또는 신청서를 등기우편으로 보내거나 직접 제출.
  - 임금 지급 후 2년 안에 신청.
  - 지급 일정과 '惟仍須俟116年度預算通過' 단서. 이 단서의 위치가 위 MINOR 지적의 근거입니다.
  - 근거 법령 이름: 《勞工請假規則》, 《友善育兒職場婚孕產假薪資補助要點》.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030006&flno=2: 제2조는 여전히 "婚假八日"입니다. 데이터 기준일은 2026-09-24입니다.
- https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0030006: 최종 수정일은 民國114年12月09日(2025-12-09)입니다. 제1조는 노동기준법(勞基法) 제43조를 근거로 합니다.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=1: 제1조 단서 "勞雇雙方所訂勞動條件，不得低於本法所定之最低標準"을 확인했습니다.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=43: 혼인 등 휴가와 임금 최저기준은 중앙주관기관이 정한다는 내용을 확인했습니다.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=70: 30인 이상 고용주는 취업규칙을 주관기관에 보고해 승인(核備)받고 공개 게시해야 합니다. 대상 항목에 휴가(請假)가 포함됩니다.
- https://www.taiwannews.com.tw/news/6448300: 2026-09-29 기사입니다. 14일 연장, 9~14일차 보조, 2년 신청 기한을 확인했습니다.
- https://www.bli.gov.tw/0105467.html: BLI의 友善職場婚孕產育兒專區 페이지이며, 婚假工資補助 항목이 있습니다.
- 확인 필요: 補助要點의 자격 요건 조문(예: 노동보험 가입 여부)은 원문을 열어 보지 못했습니다. 그래서 수정본에는 자격 요건에 관한 단정을 넣지 않았습니다.

VERDICT: FAIL
<<<FIXED_FILE
---
title: "Taiwan’s 14-day marriage leave: payroll and subsidy steps for foreign employers"
seoTitle: "Taiwan 14-day marriage leave for foreign employers"
summary: "From 1 October 2026, marriage leave in Taiwan is 14 paid days. Employers pay the wages, then may claim a full government subsidy for days 9–14 from the Bureau of Labor Insurance, according to the Ministry of Labor. Foreign-invested employers should check work rules, payroll and the claim timeline."
published: "2026-10-02"
lastmod: "2026-10-02"
date_display: "October 2, 2026"
read_time: "7 min read"
categories:
  - "Taiwan Legal Information"
topic: labor
featured_image: "../images/ISSUE-20261002-08-marriage-leave-14-days-foreign-employers/featured-01.webp"
faq:
  - q: "Must the employer pay all 14 days before claiming subsidy?"
    a: "The employer must pay full wages for all 14 days of marriage leave. The subsidy covers only days 9–14, and the Ministry of Labor says the employer applies to the Bureau of Labor Insurance after paying those wages, once the worker has finished the leave or the contract has ended before the leave was completed."
  - q: "When will 2026 subsidy applications be paid?"
    a: "According to the ministry, applications accepted in 2026 will in principle be paid for the first time by the end of January 2027, and applications accepted from January 2027 are to be paid by the end of the following month. In both cases, payment depends on the 2027 budget being passed. Employers must apply within two years after paying the wages."
  - q: "What if our work rules still say eight days?"
    a: "The 14-day entitlement applies from 1 October 2026 even before the rules are revised, because employment terms cannot fall below Labor Standards Act minimums. Employers with 30 or more workers must have work rules approved by the competent authority and publicly displayed under Article 70 of that Act, so the leave clause should be amended and re-filed. A headquarters holiday chart does not reduce the Taiwan entitlement."
audience: ["en"]
author: "legal-ai-assistant"
---

# Taiwan’s 14-day marriage leave: payroll and subsidy steps for foreign employers

The [Ministry of Labor announced on 29 September 2026](https://www.mol.gov.tw/1607/1632/1633/99216/) that marriage leave under the Regulations on Leave-Taking of Workers (勞工請假規則) extends from 8 to 14 days from 1 October 2026. Alongside the amendment, the ministry issued a wage-subsidy program (友善育兒職場婚孕產假薪資補助要點) under which the government reimburses in full the wages employers pay for days 9–14. [Taiwan News](https://www.taiwannews.com.tw/news/6448300) carried an English summary of the same change.

## Who pays, and when the employer can claim

Marriage leave remains fully paid leave, and the employer pays the wages for all 14 days. For the six added days (days 9–14), the employer can claim the wages back from the Bureau of Labor Insurance (BLI) once the worker has finished the leave, or once the employment contract has ended before the leave was completed. The ministry lists two channels: online through the BLI e-service system, logging in with the employer’s digital certificate, or a paper application form sent by registered mail or delivered to the BLI.

The ministry says applications accepted in 2026 will in principle be paid for the first time by the end of January 2027, and applications accepted from January 2027 onward are to be paid by the end of the following month. In both cases, the ministry adds, payment can be made only after the 2027 budget has been passed. The employer must file within two years after paying the marriage-leave wages.

## The national laws database has not caught up

As of 2 October 2026, [Article 2 of the leave regulations](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030006&flno=2) on the national laws database still read “eight days” of marriage leave, and the [full regulation page](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0030006) showed 9 December 2025 as its latest amendment date. The ministry’s announcement sets 1 October 2026 as the effective date of the 14-day rule, so payroll systems and HR policies that copy the statutory text from the database may still carry the old figure.

## Foreign staff and home-country policies

A worker’s nationality does not take them outside the leave regulations. If a foreign national is employed by a Taiwan entity and covered by the Labor Standards Act, the 14-day entitlement applies. [Article 1 of the Act](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=1) provides that employment terms agreed between employer and worker may not fall below its minimum standards, and the leave regulations are issued under [Article 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=43) of the same Act. A home-country policy can add days on top of that minimum but cannot reduce it.

For seconded staff, the starting question is which entity actually holds the employment contract and pays wages in Taiwan. That answer, rather than the label on the assignment letter, is usually what determines whether the Taiwan entitlement applies. The subsidy is claimed by the employer that actually paid the wages for days 9–14, so a split-payroll arrangement needs to be clear about which entity paid them.

## Records for the subsidy claim

The claim is easier to support if the employer keeps the worker’s leave dates, any proof of marriage the work rules call for, payroll records showing payment for days 9–14, and the termination date where the contract ended before the leave was completed. Online submission records or mailing receipts show when the claim was filed for the two-year deadline. Where headquarters publishes an English leave FAQ, it should match the Taiwan entity’s Chinese work rules so that managers are not still quoting eight days.

## How Hovering can help

Hovering International Law Firm can review Taiwan work-rule amendments and marriage-leave subsidy claims for foreign-invested employers.

Email Attorney Wei Tseng (曾雋崴) at [wei@hoveringlaw.com.tw](mailto:wei@hoveringlaw.com.tw), with the current leave clause and a sample payroll calendar attached. Office: 7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City 103, Taiwan (103 臺北市大同區承德路一段35號7樓之2). This column is general information only.

## Sources

- [Ministry of Labor, press release, 29 September 2026](https://www.mol.gov.tw/1607/1632/1633/99216/)
- [Taiwan News, 29 September 2026](https://www.taiwannews.com.tw/news/6448300)
- [Regulations on Leave-Taking of Workers (勞工請假規則), national laws database](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0030006)
- [Labor Standards Act, Article 1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=1)
- [Labor Standards Act, Article 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=43)
- [Labor Standards Act, Article 70](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=70)
- [Bureau of Labor Insurance, family-friendly workplace subsidies page](https://www.bli.gov.tw/0105467.html)

Checked: October 2, 2026
FIXED_FILE>>>
