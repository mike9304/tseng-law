## 검수 결과: en--ISSUE-20261002-07 (Micron CEO 발언과 桃園 파업 찬반투표)

### 발견 사항

- [MAJOR] 사실 오류: 조정 결렬 날짜
  - 원문: "Mediation between the union and the company had already failed on 22 September, Taiwan News reported." (Sources 목록의 "mediation failure on 22 September 2026"도 같음)
  - 문제와 이유: Taiwan News 기사의 게재 시각이 2026-09-22 20:45입니다. 본문은 조정이 "ended without agreement Monday"라고 씁니다. 2026-09-22는 화요일이므로 결렬일은 월요일인 9월 21일입니다. 같은 내용을 다룬 2차 자료(X 게시물)도 "second mediation meeting failed on September 21"이라고 적었습니다. 기사 게재일을 결렬일로 옮겨 적은 것이고, RULES의 "출처에 없는 날짜 금지"에 걸립니다.
  - 수정안: "on Monday, 21 September"로 고치고 Sources 목록도 함께 고칩니다.

- [MINOR] 회사 제시액의 범위를 넓게 씀
  - 원문: "Micron has offered Taiwan employees fiscal 2026 rewards worth 35 to 68 months of pay."
  - 문제와 이유: Benzinga 요지는 대만 직원 약 15,000명이 FY2026 사상 최대 보상을 받는다는 것입니다. "35 to 68 months"는 생산직 기준이고 "base salary" 기준입니다. 지금 문장은 대만 전 직원에게 해당하는 것처럼 읽히고, "pay"는 기본급보다 넓은 말입니다.
  - 수정안: "Micron has said its Taiwan production staff will receive fiscal 2026 rewards worth 35 to 68 months of base salary."

- [MINOR] 근로쟁의조정법(勞資爭議處理法) 제8조의 적용 범위를 줄여 씀
  - 원문: "Article 8 … adds a separate freeze while arbitration or adjudication is pending"
  - 문제와 이유: 조문은 "勞資爭議在調解、仲裁或裁決期間"입니다. 조정(調解) 기간도 포함됩니다. Taiwan News에 따르면 台中 노조와의 3차 조정이 10월 22일로 잡혀 있어서, 조정을 빼면 실무상 틀린 안내가 됩니다. 조문은 사업장 폐쇄(歇業)·휴업(停工)·해고도 명시합니다.
  - 수정안: "while mediation, arbitration or adjudication is pending: the employer may not close the business, suspend work, dismiss workers or take other adverse action because of that dispute, and the union may not strike over it." 이어서 台中 조정 일정을 한 문장으로 덧붙입니다.

- [MINOR] 노동조합법(工會法) 제35조의 "무효" 효과를 넓혀 읽힘
  - 원문: "A dismissal, demotion or pay cut made in violation of that article is void. Shift changes, transfers or performance warnings aimed at voters during the window carry that risk."
  - 문제와 이유: 제35조 제2항이 무효로 정한 것은 해고·강등·감봉뿐입니다. 근무조 변경·전보·성과 경고는 제1항의 "其他不利之待遇"(그 밖의 불리한 대우), 즉 부당노동행위가 될 수 있는 문제입니다. "that risk"는 직전 문장의 무효 위험을 가리키는 것으로 읽힙니다.
  - 수정안: "Shift changes, transfers or performance warnings aimed at voters during the window can count as other adverse treatment under the same article, which the union can take to the Ministry of Labor’s unfair-labor-practice adjudication process."

- [MINOR] 15% 요구의 출처 표시 범위
  - 원문: "According to Benzinga, the union wants 15% … through quarterly bonuses on a permanent basis."
  - 문제와 이유: 확인한 Benzinga 요지에는 "permanently"만 있고 "quarterly"는 없습니다. "quarterly bonuses"는 Taiwan News에 나옵니다. GATE에는 Benzinga 항목으로 적혀 있지만 원문 전체(403)는 직접 대조하지 못했으므로, 두 매체에 나눠 출처를 다는 편이 안전합니다.
  - 수정안: "According to Benzinga and Taiwan News, …"

- [NIT] 제53조 단서 일부 누락
  - 원문: "if the central competent authority has ruled that the employer violated Labor Union Act Article 35"
  - 문제와 이유: 조문은 단체협약법(團體協約法) 제6조 제1항 위반 재결도 함께 규정합니다.
  - 수정안: "or Collective Agreement Act Article 6(1)"을 추가합니다.

- [NIT] 끝 문장 "General information only."
  - 문제와 이유: 전보문처럼 끊긴 문장입니다.
  - 수정안: "This column is general information, not legal advice on a specific case."

자연스러움(영어): 제목과 소제목에 명령형·체크리스트형 표현은 없고, "this article will explain"류 예고문도 없습니다. 내부 작업 메모, 굵은 글씨, 전화번호는 없습니다. frontmatter 키, `author`, FAQ 3개, 마지막 Sources 섹션과 Checked 날짜 줄 모두 규칙에 맞습니다.

### 사실 검증 메모

- Benzinga(62114761): WebFetch는 403으로 실패해 원문 전체는 직접 열지 못했습니다. WebSearch 요지로 다음을 확인했습니다.
  - Mehrotra가 CNBC Jim Cramer 인터뷰(Thursday)에서 "in a record fashion" 발언.
  - Murphy가 incentive compensation을 "the big driver"로 꼽았고, 인센티브·생산 개시 비용 등을 합쳐 FQ1 추가 비용이 약 $1B.
  - 桃園 투표 기간 10월 1~6일, 이익 15%를 영구 분배하라는 요구.
  - 대만 직원 약 15,000명, 생산직 기본급 35~68개월분.
- Taiwan News 6444345(직접 열람): 게재 2026-09-22 20:45. 조정이 "ended without agreement Monday", 즉 9월 21일에 결렬되었습니다. 15%를 분기 보너스로 달라는 요구, 회사가 10월 초 이사회 승인 전에는 보너스안을 공개할 수 없다는 입장, 台中 노조 3차 조정이 10월 22일이라는 내용도 있습니다.
- law.moj.gov.tw 勞資爭議處理法 제53조(직접 열람): 조정 불성립 전 쟁의행위 금지, 권리사항 파업 금지, 工會法 제35조·團體協約法 제6조 제1항 위반 재결 시 예외를 확인했습니다. 페이지 데이터 기준일은 2026-09-24입니다.
- 같은 법 제54조(직접 열람): "直接、無記名投票且經全體過半數同意"를 거쳐야 파업 선언과 피켓라인 설치가 가능합니다. 본문 설명과 일치합니다.
- 같은 법 제8조(직접 열람): "調解、仲裁或裁決期間"으로 조정 기간이 포함됩니다. 본문 서술과 다릅니다.
- 工會法 제35조(직접 열람): 제1항 제4호는 쟁의행위에 참여·지지한 것을 이유로 한 해고·강등·감봉·불리한 대우를 금지하고, 제2항은 해고·강등·감봉만 무효로 정합니다.
- 公司法 제235조의1(직접 열람): 정관에 당해 연도 이익의 정액 또는 비율로 직원 보수를 정해야 하고, 누적 결손은 먼저 보전해야 합니다. 본문 설명과 일치합니다.

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

For a foreign parent company with Taiwan plants, the HQ statements about costs and margins do not change what the Taiwan employer may or may not do while the dispute is open.

## What the union and Micron have put on the table

According to Benzinga and Taiwan News, the union wants 15% of Micron’s operating profit shared with employees through quarterly bonuses on a permanent basis. Micron has said its Taiwan production staff will receive fiscal 2026 rewards worth 35 to 68 months of base salary. Benzinga also reports that a successful vote would authorize a strike rather than start an immediate walkout. These figures come from press reports. They have not been tested in any Taiwan proceeding.

## Strike authorization under Taiwan law

[Article 53](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0020007&flno=53) of the [Act for Settlement of Labor-Management Disputes](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0020007) bars any dispute action until mediation has failed. It also bars strikes over rights disputes, meaning disputes about existing entitlements. A demand for a new profit-sharing scheme is an adjustment dispute, so it can lead to a strike. Article 53 also lets a union take dispute action without mediation if the central competent authority has ruled that the employer violated Labor Union Act Article 35 or Collective Agreement Act Article 6(1). [Article 54](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0020007&flno=54) then requires a direct secret ballot approved by more than half of all union members before the union may declare a strike or set up a picket line. A passed vote gives the union that power. The strike begins only when the union declares it.

[Labor Union Act Article 35](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0020001&flno=35) prohibits dismissal, demotion, pay cuts or other adverse treatment of workers because they take part in union activities or support dispute action. A dismissal, demotion or pay cut made in violation of that article is void. Shift changes, transfers or performance warnings aimed at voters during the window can count as other adverse treatment under the same article, which the union can take to the Ministry of Labor’s unfair-labor-practice adjudication process. [Article 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0020007&flno=8) of the dispute act adds a separate freeze while mediation, arbitration or adjudication is pending: the employer may not close the business, suspend work, dismiss workers or take other adverse action because of that dispute, and the union may not strike over it. Taiwan News reports that Micron’s third mediation round with its Taichung union is scheduled for 22 October.

## Company Act employee compensation is not the union’s 15% ask

For a Taiwan-incorporated company, [Company Act Article 235-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=235-1) requires the articles of incorporation to set employee compensation as a fixed amount or percentage of the year’s profit, after any accumulated losses are made up. It does not require a quarterly pool of 15% of operating profit. The statutory employee-compensation clause, the bonus plan and a bargaining proposal are separate documents with separate legal effects. They should be kept apart when the parent company answers investor questions.

## What the CEO’s margin remarks do not authorize

Remarks made on CNBC or to investors describe consolidated costs. They do not let Taiwan managers reduce bonuses already promised in writing or treat voters differently. When Taiwan employees ask about “record bonuses,” the answer should rest on the Taiwan entity’s written plans and the dispute record, not on television quotes.

## The file worth keeping during the vote window

The file should hold the mediation outcome notice, the current written profit-sharing or bonus offer, the articles of incorporation on employee compensation, the work rules, any union ballot notices, and a list of who may speak for the Taiwan employer. Internal statements that the vote “failed” or “passed” can wait until the union publishes the result.

## How Hovering can help

Hovering International Law Firm reviews Taiwan strike-authorization and mediation files, unfair-labor-practice risk, and how parent-company communications interact with local employer duties.

Email Attorney Wei Tseng (曾雋崴) at [wei@hoveringlaw.com.tw](mailto:wei@hoveringlaw.com.tw). Send mediation records, current offers, articles, and any planned staffing changes during 1–6 October. Office: 7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City 103, Taiwan (103 臺北市大同區承德路一段35號7樓之2). This column is general information, not legal advice on a specific case.

## Sources

- [Benzinga, 1 October 2026](https://www.benzinga.com/markets/prediction-markets/26/10/62114761/micron-employee-bonuses-margin-outlook): CEO and CFO remarks on incentives and margins; Taoyuan vote window; union demand and company bonus figures.
- [Taiwan News, 22 September 2026](https://www.taiwannews.com.tw/news/6444345): mediation ended without agreement on Monday, 21 September 2026; quarterly-bonus demand; Taichung mediation on 22 October.
- [Act for Settlement of Labor-Management Disputes](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0020007) Arts. [8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0020007&flno=8), [53](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0020007&flno=53), [54](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0020007&flno=54).
- [Labor Union Act Art. 35](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0020001&flno=35).
- [Company Act Art. 235-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=235-1).

Checked: October 2, 2026
FIXED_FILE>>>

검색 출처: [Benzinga](https://www.benzinga.com/markets/prediction-markets/26/10/62114761/micron-employee-bonuses-margin-outlook), [Taiwan News](https://www.taiwannews.com.tw/news/6444345), [X 게시물 (HyperTechInvest)](https://x.com/HyperTechInvest/status/2102313405214503248)

참고:
- Benzinga 원문은 403으로 막혀 검색 요지로만 확인했습니다.
- 9월 21일이 월요일이라는 것은 직접 계산한 결과입니다. 확인하려던 `date` 명령은 승인을 받지 못해 실행하지 못했습니다.
- 디스크의 파일은 수정하지 않았습니다.
