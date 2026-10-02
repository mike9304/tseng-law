FTV 기사는 대체로 사실과 맞습니다. 다만 형사소송법 Art. 380의 내용을 잘못 설명해 MAJOR 1건이 나왔고, 결과는 FAIL입니다. 지적 사항과 수정본은 아래와 같습니다. 디스크의 파일은 수정하지 않았습니다.

- [MAJOR] 원문: "[Article 380](…flno=380) addresses the statement of appeal reasons."
  → 문제와 이유: 법무부 원문에서 Art. 380은 "除前條情形外，訴訟程序雖係違背法令而顯然於判決無影響者，不得為上訴之理由"입니다. 판결에 영향이 없는 절차 위반은 상고 이유가 되지 못한다는 조문이며, 상고이유서와는 관계가 없습니다. 상고 이유 기재를 정한 조문은 Art. 382입니다(上訴書狀應敘述上訴之理由… 二十日內補提). 제3심의 駁回 근거는 Art. 395입니다. 본문 링크와 최종 출처 목록이 모두 틀린 조문을 가리킵니다.
  → 수정안: Art. 380 대신 Art. 382와 Art. 395를 인용하고, 두 조문 내용을 원문대로 설명합니다. 출처 목록도 같이 고칩니다.

- [MINOR] 원문: "a Judicial Yuan circular warning judges not to generate judgments with AI or adopt AI output without substantive review."
  → 문제와 이유: PChome 기사에서 확인되는 내용은 따로 있습니다. 9월 18일 각 법원에 보낸 공문이고, "人工智慧系統僅得作為審判輔助工具，不得用於生成裁判書"라는 문구가 있으며, 《法官法》·윤리규범 위반 소지가 언급됩니다. "without substantive review"는 기사에서 확인되지 않습니다. 확인되지 않은 내용이 추가된 것입니다.
  → 수정안: 기사에서 확인된 범위로 줄입니다. 날짜(9월 18일), "보조 도구로만 사용", 판결서 생성 금지, Judges Act 위반 소지를 씁니다.

- [MINOR] 원문: "It also will not treat long, formal-looking text as enough." 그리고 FAQ 2 "Polished language and long citations do not replace that statutory requirement."
  → 문제와 이유: 법원은 "구체적으로 지적하라"고만 했습니다. 긴 문장이나 인용 수에 대한 판시는 기사에 없습니다. 그런데 이 문장들이 법원 입장이나 "the same report says"에 이어 놓여 있어서, 필자 해석이 법원 판시처럼 읽힙니다.
  → 수정안: 법원 판시와 필자 논평을 문장 차원에서 분리합니다. 법원이 인용한 문구("can generate text, but not necessarily a lawful third-instance ground")는 출처가 확인되므로 그대로 씁니다.

- [MINOR] 원문: "If your model invents a case name, the blank stays yours after signature."
  → 문제와 이유: "the blank stays yours"는 영어 법률 문장으로 의미가 통하지 않습니다. 오류의 책임이 서명한 당사자에게 남는다는 원래 뜻이 전달되지 않습니다.
  → 수정안: "A case name the model invented remains the signing party's problem; the court will not go looking for the authority that was meant."

- [MINOR] 원문: `read_time: "8 min read"`
  → 문제와 이유: 본문이 약 550단어라서 3분 정도에 읽힙니다. 메타데이터가 실제보다 부풀려져 있습니다.
  → 수정안: `"3 min read"`로 바꿉니다.

- [NIT] 원문: "Party filings and judicial drafting are different layers." / "do not copy-paste the criminal news into those tracks"
  → 문제와 이유: "layers", "tracks", "copy-paste"는 영어 법률 칼럼으로 어색한 은유와 구어입니다.
  → 수정안: "The circular concerns judges, not parties." / "the criminal ruling does not automatically carry over."

- [NIT] 원문: "If headquarters wants 'AI efficiency,' measure it by verified grounds per page, not word count."
  → 문제와 이유: 경구식 문장이라 정보가 없습니다.
  → 수정안: 삭제합니다.

- [NIT] 원문: `## Official sources`
  → 문제와 이유: 목록 대부분이 언론 보도라서 "Official"은 맞지 않습니다.
  → 수정안: `## Sources`로 바꾸고 CTWANT 원문 링크를 추가합니다.

- 확인 결과 문제 없는 항목:
  - bold 없음
  - 전화·팩스 번호 없음
  - 연락처와 주소가 GATE와 같음
  - 내부 작업 메모 없음
  - FAQ 3개
  - frontmatter 키, `author: legal-ai-assistant`, 변호사 검토 주장 없음

사실 검증 메모
- `https://www.ftvnews.com.tw/news/detail/2026A01W0148`: HTTP 403이라 직접 열지 못했습니다. curl 재시도는 승인되지 않아 실행하지 못했습니다. 대신 같은 기사 번호의 미러로 확인했습니다.
- `https://finance.ftvnews.com.tw/news/detail/2026A01W0148`(FTV 재경망, 2026-10-01, 출처 CTWANT)로 다음을 확인했습니다.
  - 刑七庭이 2026년 9월에 사건을 처리했고, 피고인은 사기 사건의 李모 車手입니다.
  - 1·2심 모두 징역 1년 2개월이었고, 상고가 기각되어 형이 확정됐습니다.
  - AI 사용 자체는 기각 사유가 아니지만, 원판결의 위법을 구체적으로 지적해야 합니다.
  - 법원은 AI 환각을 고쳐 줄 의무가 없습니다.
  - "可以生成文字，但未必寫得出一個合法的第三審上訴理由"라는 판시 문구가 있습니다.
- `https://www.ctwant.com/article/500371/`(CTWANT 원문)로 다음을 확인했습니다.
  - "上訴人親自撰寫、或委由他人代擬、甚至是全部或部分使用生成式人工智慧工具協助製作"와 "依法提出並簽名或蓋章"라는 문구가 있습니다.
  - 照料義務의 범위는 사실·법원·재판·卷證 오인용 수정, 卷證 보충, 상고이유 재구성입니다.
  - 최고법원 판결에서 이 문제를 다룬 "首件"이라고 보도했습니다.
- `https://news.pchome.com.tw/…/index-79081355078513361002.html`(周刊王/CTWANT, 2026-10-01)로 다음을 확인했습니다.
  - 사법원이 9월 18일 각 법원에 공문을 보냈습니다.
  - 공문 문구는 "僅得作為審判輔助工具，不得用於生成裁判書"입니다.
  - 《法官法》·윤리규범 위반 소지가 언급됩니다.
  - "unreviewed AI content" 부분은 확인되지 않았습니다.
- `law.moj.gov.tw` C0010001 Art. 377, 380, 382, 395 원문을 대조했습니다.
  - Art. 377: 第三審 상고는 判決違背法令을 이유로 해야 합니다. 본문 설명과 맞습니다.
  - Art. 380: 판결에 영향이 없는 절차 위반에 관한 조문입니다. 본문 설명과 다릅니다.
  - Art. 382: 상고 이유를 기재해야 하고, 상고 후 20일 안에 원심법원에 보충할 수 있습니다.
  - Art. 395: Art. 384 사유가 있거나 이유서를 제출하지 않으면 판결로 駁回합니다.

VERDICT: FAIL
<<<FIXED_FILE
---
title: "Can you file an AI-drafted appeal in Taiwan? The Supreme Court’s first published answer"
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
  - q: "Is AI use automatically illegal for a Taiwan appeal?"
    a: "According to FTV’s 1 October 2026 report of the Supreme Court Criminal Division 7 decision, using generative AI for all or part of an appellate brief is not, by itself, a reason to dismiss the appeal."
  - q: "What still gets an appeal dismissed?"
    a: "The same report says the brief must specifically point out where the judgment violated the law. Under the Code of Criminal Procedure, a third-instance appeal can rest only on a violation of law, and a brief that does not identify one is dismissed however it was drafted."
  - q: "Will the court fix AI hallucinations?"
    a: "FTV quotes the court as saying it has no duty to correct fabricated or erroneous citations of facts, law, precedents, or record materials produced with AI, to fill gaps in the record, or to rebuild appeal grounds for the party."
audience: ["en"]
author: "legal-ai-assistant"
---

# Can you file an AI-drafted appeal in Taiwan? The Supreme Court’s first published answer

[FTV reported on 1 October 2026](https://www.ftvnews.com.tw/news/detail/2026A01W0148), carrying a [CTWANT story](https://www.ctwant.com/article/500371/), that Taiwan’s Supreme Court Criminal Division 7 had dealt with a fraud defendant’s appellate brief that appeared to be written with generative AI. The division dismissed the appeal in September 2026, leaving his sentence of one year and two months final, and used the judgment to state principles: AI drafting does not itself make the appeal improper, but the brief still fails if it does not specifically identify how the judgment violated the law.

The same day, [PChome, carrying a CTWANT report](https://news.pchome.com.tw/society/m00361/20261001/index-79081355078513361002.html), described a 18 September Judicial Yuan circular telling courts that AI systems may serve only as an aid to adjudication and may not be used to generate judgments, with possible consequences under the Judges Act. The circular concerns judges, not the parties who file briefs.

## Form versus third-instance grounds

According to the reports, the court said an appeal brief may be written by the appellant personally, drafted by someone else, or produced in whole or in part with generative AI tools; what matters is that the appellant files it as the law requires and signs or seals it. AI use alone does not make the appeal unlawful.

The court also said that generative AI can produce text but will not necessarily produce a lawful third-instance ground of appeal, and that it can help with drafting but cannot take over the party’s responsibility for the filing. In practice, a brief can be long and formally phrased and still be dismissed if it never says where the judgment went wrong in law.

## Criminal Procedure anchors

[Code of Criminal Procedure Article 377](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=377) allows an appeal to the third instance only on the ground that the judgment violated the law. [Article 382](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=382) requires the appeal brief to state its reasons; if it does not, the reasons may be filed with the original court within 20 days after the appeal is lodged. [Article 395](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=395) directs the third-instance court to dismiss by judgment an appeal that is not in proper legal form, or one whose reasons were never filed before the court decides.

Foreign counsel who send an AI draft to Taiwan local counsel should still expect a human pass that ties each ground to the judgment and the record. Civil and administrative appeals are governed by their own codes, and this criminal ruling does not automatically carry over to them.

## No court duty to repair hallucinations

FTV reports that the court has no duty to correct AI hallucinations (fabricated or mis-cited facts, statutes, precedents, or record materials), to supply missing record materials, or to reconstruct appeal grounds. A case name the model invented remains the signing party’s problem; the court will not go looking for the authority that was meant.

## Keeping a record across borders

Keep the judgment, prior briefs, the AI draft, the human final, and screenshots or links for every cited article and precedent. Record who has authority to sign the brief.

## How Hovering can help

Hovering International Law Firm can review whether a Taiwan third-instance draft states concrete violations of law and whether its citations match the record. We do not certify AI tools.

Email Attorney Wei Tseng (曾雋崴) at [wei@hoveringlaw.com.tw](mailto:wei@hoveringlaw.com.tw). Send the judgment, deadline, and draft brief. Office: 7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City 103, Taiwan (103 臺北市大同區承德路一段35號7樓之2). General information only.

## Sources

- [FTV, 1 October 2026](https://www.ftvnews.com.tw/news/detail/2026A01W0148).
- [CTWANT, 1 October 2026](https://www.ctwant.com/article/500371/).
- [PChome / CTWANT, 1 October 2026](https://news.pchome.com.tw/society/m00361/20261001/index-79081355078513361002.html).
- [Code of Criminal Procedure Arts. 377](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=377), [382](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=382) and [395](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=395).

Checked: October 2, 2026
FIXED_FILE>>>

검색에 사용한 출처:
- [民視財經網 (FTV)](https://finance.ftvnews.com.tw/news/detail/2026A01W0148)
- [CTWANT 500371](https://www.ctwant.com/article/500371/)
