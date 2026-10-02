## 리뷰 결과: en--ISSUE-20261002-07 (Micron CEO 발언과 타오위안 파업 찬반투표)

- [MINOR] 원문(32행): "Micron has said its Taiwan production staff will receive fiscal 2026 rewards worth 35 to 68 months of base salary."
  → 문제와 이유: 이 문단은 출처를 "Benzinga and Taiwan News"로만 밝힙니다. 그런데 Taiwan News에는 "35 and 68 months of pay"만 있고, "base salary"와 "production staff"라는 조건은 없습니다. Benzinga는 403 차단으로 열어 보지 못했습니다. Focus Taiwan(CNA, 2026-09-11)의 원 발표 보도도 "35-68 months' pay"이고, 기본급이 아니라 총보상 기준이라고 씁니다. 인용한 출처보다 구체적인 세부(기본급 기준, 생산직 한정)가 출처 없이 들어가 있고, 보도마다 기준 표현도 다릅니다.
  → 수정안: "Micron announced on 11 September that its fiscal 2026 rewards for Taiwan employees will be worth the equivalent of 35 to 68 months of pay ([Focus Taiwan](…202609110009))."로 바꾸고, 출처 목록에 Focus Taiwan을 추가합니다.
  → 보존한 사실: 35~68개월이라는 범위, 2026 회계연도, 대만 직원 대상, 언론 보도라는 단서.

- [MINOR] 원문(38행): "[Article 8] … adds a separate freeze while mediation, arbitration or adjudication is pending … Taiwan News reports that Micron's third mediation round with its Taichung union is scheduled for 22 October."
  → 문제와 이유: 勞資爭議處理法 제8조의 행위 금지는 "調解、仲裁或裁決期間"에만 걸립니다. 타오위안 노조 건은 9월 21일 조정이 불성립으로 끝났으므로, 지금 이 금지는 타오위안 분쟁에 적용되지 않습니다. 이 글은 "the employer may not … while the dispute is open"을 주제로 삼고 있어서, 독자가 제8조의 금지가 지금 타오위안 투표 기간에도 걸린다고 오해할 수 있습니다. 법적 조건(적용 기간)이 빠진 셈입니다.
  → 수정안: 타오위안 건은 조정이 이미 끝나 제8조의 금지가 다시 걸리려면 중재나 재결(裁決)이 새로 시작돼야 한다는 점을 밝힙니다. 이어서 이 조문이 실제로 걸리는 곳은 10월 22일 조정이 예정된 타이중 노조 분쟁이라고 연결합니다.

- [NIT] 원문(28행): "the HQ statements about costs and margins" → 관사와 약어가 겹쳐 어색합니다. 수정안: "statements from headquarters about costs and margins".

- [NIT] 원문(56행): "Send mediation records, current offers, articles, and …" → "articles"만으로는 정관인지 기사인지 모호합니다. 수정안: "articles of incorporation".

- 기계 규칙 점검: 굵은 강조 없음, 전화번호 없음, 본문 내 출처 링크와 마지막 `## Sources` 섹션 및 Checked 줄 있음, frontmatter 키 모두 있음, FAQ 3개, `author: "legal-ai-assistant"`, 내부 작업 메모 없음. 모두 규칙대로입니다.
- 문체: 예고문이나 체크리스트형·명령형 소제목은 없습니다. 영어 문장은 대체로 자연스럽고, 위 NIT 외에 지적할 번역투는 없습니다.

## 사실 검증 메모

- law.moj.gov.tw 勞資爭議處理法 제53조: 조정 불성립 전 쟁의행위 금지, 권리사항 파업 금지, 工會法 §35 및 團體協約法 §6Ⅰ 위반으로 재결된 경우의 예외. 본문 서술과 일치합니다.
- 같은 법 제54조 제1항: "直接、無記名投票且經全體過半數同意" 없이는 파업 선언과 피켓라인 설치를 못 합니다. 본문의 "more than half of all union members"와 일치합니다.
- 같은 법 제8조: 조정·중재·재결 기간에 사용자와 노조 양쪽의 행위를 제한합니다. 조문 자체는 정확히 옮겼고, 적용 시점만 위 MINOR로 지적했습니다.
- 工會法 제35조: 제1항 4호(쟁의행위 참여·지지를 이유로 한 해고·강등·감봉·기타 불이익)와 제2항(해고·강등·감봉은 무효)을 확인했습니다. 본문과 일치합니다.
- 公司法 제235-1조: 정관에 당해 연도 이익의 정액 또는 비율로 직원 보수를 정해야 하고, 누적 결손이 있으면 먼저 메워야 합니다. 본문과 일치합니다.
- Taiwan News 6444345(2026-09-22): Monday 조정 결렬, 타오위안·타이중 노조의 영구적 영업이익 15% 분기 보너스 요구, 35~68개월 "pay", 타이중 3차 조정 10월 22일을 확인했습니다. 기사일인 9월 22일이 화요일이므로 "Monday"는 9월 21일입니다. Yahoo Finance 기사도 9월 21일 결렬을 명시합니다.
- Benzinga 원문: WebFetch 두 번(직접, r.jina.ai 경유) 모두 403이었고, curl 우회는 권한 승인을 받지 못해 실행하지 않았습니다. 대신 검색 결과 요약으로 다음을 간접 확인했습니다: Mehrotra가 목요일(10/1) CNBC Jim Cramer 인터뷰에서 "in a record fashion", "does impact our gross margin"이라고 말한 점, 인센티브·생산 시작 비용 등으로 FQ1 추가 비용 약 10억 달러, 타오위안 투표 10/1~6, 15% 요구. "Murphy", "big driver", "투표는 파업권 승인일 뿐"이라는 부분은 원문으로 확인하지 못했고, GATE 기록에 의존했습니다.
- Focus Taiwan 202609110009(2026-09-11): FY2026 보상이 "35-68 months' pay"(총보상 기준)라고 확인했습니다. 수정안의 근거입니다.
- 참고: Yahoo Finance(sg) 기사는 "35 to 68 months of base salary for production staff"라고 써서 보도마다 표현이 다릅니다. 그래서 수정안은 CNA 표현을 따랐습니다.

VERDICT: FAIL
<<<FIXED_FILE
---
title: "Micron’s record bonuses and the Taoyuan strike vote: what earnings talk does not change under Taiwan labor law"
seoTitle: "Micron CEO bonuses and Taiwan strike vote"
summary: "Micron’s CEO told CNBC that record incentives weigh on margins, while members of Micron’s Taoyuan union vote on strike authorization from 1 to 6 October 2026. For foreign employers, earnings commentary and Taiwan dispute-procedure duties are separate matters."
published: "2026-10-02"
lastmod: "2026-10-02"
date_display: "October 2, 2026"
read_time: "8 min read"
categories:
  - "Taiwan Legal Information"
topic: labor
featured_image: "../images/ISSUE-20261002-07-micron-ceo-margins-taoyuan-strike-vote/featured-01.webp"
faq:
  - q: "Has the Taoyuan strike vote already passed?"
    a: "As of the Benzinga report on 1 October 2026, the authorization vote runs through 6 October. No final tally had been published at that point."
  - q: "If workers approve the vote, does the plant stop that day?"
    a: "No. Under Article 54 of the Act for Settlement of Labor-Management Disputes, the ballot is what allows the union to declare a strike. The strike itself starts only when the union declares it, and the timing is the union’s decision within the statutory rules."
  - q: "Do CEO margin comments change Taiwan profit-sharing law?"
    a: "No. Public remarks about incentive costs do not replace the Taiwan entity’s work rules, the employee-compensation clause in its articles of incorporation under the Company Act, or its bargaining records."
audience: ["en"]
author: "legal-ai-assistant"
---

# Micron’s record bonuses and the Taoyuan strike vote: what earnings talk does not change under Taiwan labor law

[Benzinga reported on 1 October 2026](https://www.benzinga.com/markets/prediction-markets/26/10/62114761/micron-employee-bonuses-margin-outlook) that Micron CEO Sanjay Mehrotra told CNBC the company had rewarded employees in record fashion and that those bonuses affect gross margin. CFO Mark Murphy called incentive compensation the big driver of the fiscal Q1 gross-margin outlook, with incentives, manufacturing start-up costs and other items adding roughly $1 billion of costs in the quarter. The same day, members of Micron’s union in Taoyuan began a six-day strike-authorization vote. Mediation between the union and the company had already ended without agreement on Monday, 21 September, [Taiwan News reported](https://www.taiwannews.com.tw/news/6444345).

For a foreign parent company with Taiwan plants, statements from headquarters about costs and margins do not change what the Taiwan employer may or may not do while the dispute is open.

## What the union and Micron have put on the table

According to Benzinga and Taiwan News, the union wants 15% of Micron’s operating profit shared with employees through quarterly bonuses on a permanent basis. Micron announced on 11 September that its fiscal 2026 rewards for Taiwan employees will be worth the equivalent of 35 to 68 months of pay, [Focus Taiwan reported](https://focustaiwan.tw/business/202609110009). Benzinga also reports that a successful vote would authorize a strike rather than start an immediate walkout. These figures come from press reports. They have not been tested in any Taiwan proceeding.

## Strike authorization under Taiwan law

[Article 53](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0020007&flno=53) of the [Act for Settlement of Labor-Management Disputes](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0020007) bars any dispute action until mediation has failed. It also bars strikes over rights disputes, meaning disputes about existing entitlements. A demand for a new profit-sharing scheme is an adjustment dispute, so it can lead to a strike. Article 53 also lets a union take dispute action without mediation if the central competent authority has ruled that the employer violated Labor Union Act Article 35 or Collective Agreement Act Article 6(1). [Article 54](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0020007&flno=54) then requires a direct secret ballot approved by more than half of all union members before the union may declare a strike or set up a picket line. A passed vote gives the union that power. The strike begins only when the union declares it.

[Labor Union Act Article 35](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0020001&flno=35) prohibits dismissal, demotion, pay cuts or other adverse treatment of workers because they take part in union activities or support dispute action. A dismissal, demotion or pay cut made in violation of that article is void. Shift changes, transfers or performance warnings aimed at voters during the window can count as other adverse treatment under the same article, which the union can take to the Ministry of Labor’s unfair-labor-practice adjudication process. [Article 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0020007&flno=8) of the dispute act adds a separate freeze that applies only while mediation, arbitration or adjudication is pending: the employer may not close the business, suspend work, dismiss workers or take other adverse action because of that dispute, and the union may not strike over it. Because the Taoyuan mediation has already failed, that freeze no longer covers the Taoyuan dispute unless arbitration or adjudication is opened. It still matters for the Taichung union. Taiwan News reports that Micron’s third mediation round with its Taichung union is scheduled for 22 October, and while that mediation is pending, Article 8 restricts both sides over the Taichung dispute.

## Company Act employee compensation is not the union’s 15% ask

For a Taiwan-incorporated company, [Company Act Article 235-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=235-1) requires the articles of incorporation to set employee compensation as a fixed amount or percentage of the year’s profit, after any accumulated losses are made up. It does not require a quarterly pool of 15% of operating profit. The statutory employee-compensation clause, the bonus plan and a bargaining proposal are separate documents with separate legal effects. They should be kept apart when the parent company answers investor questions.

## What the CEO’s margin remarks do not authorize

Remarks made on CNBC or to investors describe consolidated costs. They do not let Taiwan managers reduce bonuses already promised in writing or treat voters differently. When Taiwan employees ask about “record bonuses,” the answer should rest on the Taiwan entity’s written plans and the dispute record, not on television quotes.

## The file worth keeping during the vote window

The file should hold the mediation outcome notice, the current written profit-sharing or bonus offer, the articles of incorporation on employee compensation, the work rules, any union ballot notices, and a list of who may speak for the Taiwan employer. Internal statements that the vote “failed” or “passed” can wait until the union publishes the result.

## How Hovering can help

Hovering International Law Firm reviews Taiwan strike-authorization and mediation files, unfair-labor-practice risk, and how parent-company communications interact with local employer duties.

Email Attorney Wei Tseng (曾雋崴) at [wei@hoveringlaw.com.tw](mailto:wei@hoveringlaw.com.tw). Send mediation records, current offers, the articles of incorporation, and any planned staffing changes during 1–6 October. Office: 7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City 103, Taiwan (103 臺北市大同區承德路一段35號7樓之2). This column is general information, not legal advice on a specific case.

## Sources

- [Benzinga, 1 October 2026](https://www.benzinga.com/markets/prediction-markets/26/10/62114761/micron-employee-bonuses-margin-outlook): CEO and CFO remarks on incentives and margins; Taoyuan vote window; union demand and company bonus figures.
- [Taiwan News, 22 September 2026](https://www.taiwannews.com.tw/news/6444345): mediation ended without agreement on Monday, 21 September 2026; quarterly-bonus demand; Taichung mediation on 22 October.
- [Focus Taiwan, 11 September 2026](https://focustaiwan.tw/business/202609110009): Micron’s fiscal 2026 rewards equivalent to 35 to 68 months of pay.
- [Act for Settlement of Labor-Management Disputes](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0020007) Arts. [8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0020007&flno=8), [53](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0020007&flno=53), [54](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0020007&flno=54).
- [Labor Union Act Art. 35](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0020001&flno=35).
- [Company Act Art. 235-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=235-1).

Checked: October 2, 2026
FIXED_FILE>>>
