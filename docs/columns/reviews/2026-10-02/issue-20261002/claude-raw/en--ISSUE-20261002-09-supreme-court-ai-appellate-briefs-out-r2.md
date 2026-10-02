FTV 원문은 403으로 열리지 않았지만, 같은 기사의 원 출처인 CTWANT 기사, PChome 기사, 형사소송법 3개 조문으로 사실 확인을 마쳤습니다. 결과를 정리합니다.

## Findings

- [MINOR] 제목·H1 `Can you file an AI-drafted appeal in Taiwan? The Supreme Court’s first published answer`
  → 판결은 최고법원 형사 제7정의 형사 제3심 상고장 사건입니다. 본문 40행도 민사·행정 상소에는 자동으로 적용되지 않는다고 적고 있습니다. 그런데 제목은 대만의 상소 전반에 대한 답처럼 읽혀 본문과 출처보다 넓습니다. 또한 CTWANT는 「首件直球對決AI上訴狀」이라고 썼을 뿐, "published"(공간된 판례)라는 표현은 출처에 없습니다.
  → 수정안: `AI-drafted criminal appeals in Taiwan: the Supreme Court’s first ruling on form and grounds` (제목과 H1을 똑같이 고침)

- [MINOR] 26행 `leaving his sentence of one year and two months final`
  → CTWANT는 「李姓車手」라고만 적었고 성별을 밝히지 않았습니다. "his"는 출처에 없는 추정입니다.
  → 수정안: `leaving the defendant’s sentence of one year and two months final`

- [MINOR] 28행 `described a 18 September Judicial Yuan circular`
  → 관사 오류입니다. eighteen은 모음 소리로 시작하므로 "an"이 맞습니다.
  → 수정안: `described an 18 September Judicial Yuan circular`

- [MINOR] 46–48행 `## Keeping a record across borders` / `Keep the judgment, prior briefs, the AI draft, the human final, and screenshots or links for every cited article and precedent. Record who has authority to sign the brief.`
  → 출처 근거 없이 명령형 보관 체크리스트만 나열한 단락입니다. EDITORIAL-VOICE와 RULES 6에서 금지한 체크리스트형 소제목·지시형 구성에 해당합니다.
  → 수정안: 소제목을 없애고, 환각 단락 끝에 이유를 붙인 서술문으로 합칩니다. 예: "Because the court will not repair a bad citation, it helps to keep the AI draft, the human final and a link to every cited article or precedent, so that each reference can be checked against the judgment and record before the brief is signed."

- [NIT] FAQ 1·3, 44행은 출처를 FTV로만 적고 있습니다. FTV는 CTWANT 기사를 실은 것이므로, 실제로 확인된 원 출처에 맞춰 "FTV and CTWANT"로 표기를 맞추면 더 정확합니다. 수정본에 반영했습니다.

- [NIT] 52행 `We do not certify AI tools.`는 맥락 없이 끼어든 문장이라 어색합니다. 수정본에서 삭제했습니다.

## 사실 검증 메모

- https://www.ftvnews.com.tw/news/detail/2026A01W0148: WebFetch로 두 번 시도했지만 둘 다 HTTP 403이었습니다. curl 실행은 승인되지 않아 직접 열지 못했습니다. 이 기사의 내용은 GATE 문서의 CONFIRMED 기록과 아래 CTWANT 원문으로 대신 확인했습니다.
- https://www.ctwant.com/article/500371/ (2026-10-01): 다음을 확인했습니다.
  - 최고법원 형사 제7정, 「首件直球對決AI上訴狀」
  - 「李姓車手」, 공동사기취재죄, 징역 1년 2월, 9월 상고 기각
  - 상고장을 본인이 쓰든, 타인이 대신 쓰든, 생성형 AI로 전부 또는 일부를 쓰든 그 자체로는 기각 사유가 아님. 단, 상고인이 법에 따라 제출하고 서명·날인해야 함
  - 원판결의 어느 부분이 법령에 위배되는지 구체적으로 지적해야 함
  - AI 오류 수정, 기록 자료 보충, 상고 이유 재구성에 대한 「照料義務」가 법원에 없음
  - 피고인의 성별은 기재되어 있지 않음
- https://news.pchome.com.tw/society/m00361/20261001/index-79081355078513361002.html (周刊王CTWANT, 2026-10-01): 다음을 확인했습니다.
  - 사법원이 9월 18일 전국 법원에 공문을 보냄
  - 내용: 「人工智慧系統僅得作為審判輔助工具，不得用於生成裁判書」, 실질 심사 없이 AI 결과물을 채택하는 것도 금지
  - 위반 시 법관법과 법관윤리규범상 의무 위반이 될 수 있음
- law.moj.gov.tw 형사소송법 (DB 기준일 2026-09-24):
  - 제377조: 제3심 상고는 판결이 법령에 위배된다는 이유로만 가능
  - 제382조: 상고장에 이유를 적어야 하며, 적지 않았으면 상고 후 20일 안에 원심법원에 보충 제출할 수 있음
  - 제395조: 제384조에 해당하는 경우, 또는 제382조 제1항의 기간이 지나고 판결 전까지도 이유서를 내지 않은 경우 판결로 기각
  - 세 조문 모두 본문의 서술과 맞습니다.
- 기계 규칙: 굵은 강조·전화번호·내부 메모가 없고, 본문 인라인 출처, 마지막 Sources 섹션, Checked 줄, `author: "legal-ai-assistant"`, FAQ 3개 모두 이상 없습니다.

VERDICT: FAIL
<<<FIXED_FILE
---
title: "AI-drafted criminal appeals in Taiwan: the Supreme Court’s first ruling on form and grounds"
seoTitle: "Taiwan Supreme Court AI appellate briefs"
summary: "FTV and CTWANT reported that Taiwan’s Supreme Court Criminal Division 7 said using generative AI in an appellate brief is not itself a ground to dismiss, but the brief still must specifically point out how the judgment violated the law. Foreign counsel should treat AI drafts as drafting aids, not as a substitute for record-tied grounds."
published: "2026-10-02"
lastmod: "2026-10-02"
date_display: "October 2, 2026"
read_time: "3 min read"
categories:
  - "Taiwan Legal Information"
topic: litigation
featured_image: "../images/ISSUE-20261002-09-supreme-court-ai-appellate-briefs/featured-01.webp"
faq:
  - q: "Is AI use automatically illegal for a Taiwan criminal appeal?"
    a: "According to FTV and CTWANT’s 1 October 2026 reports of the Supreme Court Criminal Division 7 decision, using generative AI for all or part of an appellate brief is not, by itself, a reason to dismiss the appeal."
  - q: "What still gets an appeal dismissed?"
    a: "The same reports say the brief must specifically point out where the judgment violated the law. Under the Code of Criminal Procedure, a third-instance appeal can rest only on a violation of law, and a brief that does not identify one is dismissed however it was drafted."
  - q: "Will the court fix AI hallucinations?"
    a: "According to FTV and CTWANT, the court said it has no duty to correct fabricated or erroneous citations of facts, law, precedents, or record materials produced with AI, to fill gaps in the record, or to rebuild appeal grounds for the party."
audience: ["en"]
author: "legal-ai-assistant"
---

# AI-drafted criminal appeals in Taiwan: the Supreme Court’s first ruling on form and grounds

[FTV reported on 1 October 2026](https://www.ftvnews.com.tw/news/detail/2026A01W0148), carrying a [CTWANT story](https://www.ctwant.com/article/500371/), that Taiwan’s Supreme Court Criminal Division 7 had dealt with a fraud defendant’s appellate brief that appeared to be written with generative AI. The division dismissed the appeal in September 2026, leaving the defendant’s sentence of one year and two months final, and used the judgment to state principles: AI drafting does not itself make the appeal improper, but the brief still fails if it does not specifically identify how the judgment violated the law.

The same day, [PChome, carrying a CTWANT report](https://news.pchome.com.tw/society/m00361/20261001/index-79081355078513361002.html), described an 18 September Judicial Yuan circular telling courts that AI systems may serve only as an aid to adjudication and may not be used to generate judgments, with possible consequences under the Judges Act. The circular concerns judges, not the parties who file briefs.

## Form versus third-instance grounds

According to the reports, the court said an appeal brief may be written by the appellant personally, drafted by someone else, or produced in whole or in part with generative AI tools; what matters is that the appellant files it as the law requires and signs or seals it. AI use alone does not make the appeal unlawful.

The court also said that generative AI can produce text but will not necessarily produce a lawful third-instance ground of appeal, and that it can help with drafting but cannot take over the party’s responsibility for the filing. In practice, a brief can be long and formally phrased and still be dismissed if it never says where the judgment went wrong in law.

## Criminal Procedure anchors

[Code of Criminal Procedure Article 377](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=377) allows an appeal to the third instance only on the ground that the judgment violated the law. [Article 382](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=382) requires the appeal brief to state its reasons; if it does not, the reasons may be filed with the original court within 20 days after the appeal is lodged. [Article 395](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=395) directs the third-instance court to dismiss by judgment an appeal that is not in proper legal form, or one whose reasons were never filed before the court decides.

Foreign counsel who send an AI draft to Taiwan local counsel should still expect a human pass that ties each ground to the judgment and the record. Civil and administrative appeals are governed by their own codes, and this criminal ruling does not automatically carry over to them.

## No court duty to repair hallucinations

FTV and CTWANT report that the court has no duty to correct AI hallucinations (fabricated or mis-cited facts, statutes, precedents, or record materials), to supply missing record materials, or to reconstruct appeal grounds. A case name the model invented remains the signing party’s problem; the court will not go looking for the authority that was meant.

Because the court will not repair a bad citation, it helps to keep the AI draft, the human final and a link to every cited article or precedent, so that each reference can be checked against the judgment and the record before the brief is signed.

## How Hovering can help

Hovering International Law Firm can review whether a Taiwan third-instance draft states concrete violations of law and whether its citations match the record.

Email Attorney Wei Tseng (曾雋崴) at [wei@hoveringlaw.com.tw](mailto:wei@hoveringlaw.com.tw). Send the judgment, deadline, and draft brief. Office: 7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City 103, Taiwan (103 臺北市大同區承德路一段35號7樓之2). General information only.

## Sources

- [FTV, 1 October 2026](https://www.ftvnews.com.tw/news/detail/2026A01W0148).
- [CTWANT, 1 October 2026](https://www.ctwant.com/article/500371/).
- [PChome / CTWANT, 1 October 2026](https://news.pchome.com.tw/society/m00361/20261001/index-79081355078513361002.html).
- [Code of Criminal Procedure Arts. 377](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=377), [382](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=382) and [395](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=395).

Checked: October 2, 2026
FIXED_FILE>>>
