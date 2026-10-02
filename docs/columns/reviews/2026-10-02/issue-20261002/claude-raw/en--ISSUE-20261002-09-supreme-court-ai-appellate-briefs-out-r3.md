## 최종 검수: en--ISSUE-20261002-09-supreme-court-ai-appellate-briefs.md

MAJOR나 MINOR는 없어 이대로 게시해도 됩니다. 사실관계는 모두 출처와 맞고, 기계 규칙(굵은 강조, 전화번호, 출처 목록, frontmatter, author)도 모두 지켜졌습니다. 아래 NIT은 반영하지 않아도 되는 다듬기 제안입니다.

### NIT

- [NIT] 제목 "the Supreme Court's first ruling on form and grounds" → 콜론 앞부분과 떼어 읽으면 대법원이 '형식과 이유'에 관해 처음 판결한 것처럼 보입니다. CTWANT가 말한 '첫 사건(首件)'은 AI로 쓴 상고장을 다룬 첫 사건이라는 뜻입니다. → 수정안: "AI-drafted criminal appeals in Taiwan: the Supreme Court's first judgment on an AI-written brief". 보존한 사실: 형사 7부, 첫 사건, 판결.
- [NIT] 본문 "Taiwan's Supreme Court Criminal Division 7" → 영어 법률 문장에서는 "the Supreme Court's Seventh Criminal Division"이 더 자연스럽습니다. 의미는 같습니다.
- [NIT] "what matters is that the appellant files it as the law requires and signs or seals it" → 사실과는 맞습니다. 다만 판결의 논리는 서명이나 날인이 있으면 상소인이 서면 내용을 받아들인 것으로 본다(足認其已採納書狀內容)는 것입니다. 이 점을 덧붙이면 아래 서명자 책임 문단과 이어집니다. → 수정안: "...signs or seals it, which shows the appellant has adopted its contents as their own appeal."
- [NIT] "the court will not go looking for the authority that was meant" → 판결은 "法院固應辨識當事人之法律主張"이라고도 했습니다. 법원이 당사자의 법률상 주장이 무엇인지는 파악한다는 뜻입니다. 이 단서를 함께 쓰면 더 정확합니다. → 수정안: "The court will still try to identify what legal argument a party is making, but a case name the model invented remains the signing party's problem."
- [NIT] 소제목 "Criminal Procedure anchors", 본문의 "a human pass", "it helps to keep" → 조금 막연하거나 은어 같은 표현입니다. → 수정안: "What the Code of Criminal Procedure requires", "a lawyer's review", "keeping ... lets each reference be checked ..."

### 사실 검증 메모

- FTV (ftvnews.com.tw/news/detail/2026A01W0148): HTTP 403으로 열지 못했습니다. FTV가 인용한 원문인 CTWANT 기사로 대신 확인했습니다.
- CTWANT (ctwant.com/article/500371): 아래 내용을 확인했습니다.
  - 기자 項程鎮, 2026-10-01 08:04 게재.
  - 대법원 형사 7부가 9월에 낸 판결이며, 대법원의 첫 AI 상고장 사건(首件)입니다.
  - 사기 조직 인출책 이씨가 AI로 상고장을 쓴 것으로 의심된 사건이며, 형이 1년 2개월로 확정됐습니다(臺南地院·臺南高分院 거침).
  - "依法提出並簽名或蓋章…就符合上訴的形式要件"
  - 상고장 전부나 일부를 AI로 써도 상고 기각 사유가 되지 않지만, 원판결의 법령 위반을 구체적으로 지적해야 합니다.
  - AI 환각을 고쳐 줄 의무, 빠진 기록을 채울 의무, 상고 이유를 다시 구성해 줄 의무가 법원에 없습니다.
- PChome/CTWANT (news.pchome.com.tw/…79081355078513361002): 사법원이 2026-09-18 전국 법원에 공문을 보낸 사실을 확인했습니다. AI는 재판 보조로만 쓸 수 있고 판결문을 생성하는 데 쓰면 안 되며, 위반하면 법관법(法官法)상 의무 위반이 될 수 있다는 내용입니다.
- law.moj.gov.tw 刑事訴訟法 (자료 기준일 115.09.24)
  - §377: 제3심 상소는 판결의 법령 위반만 이유로 할 수 있습니다.
  - §382: 상소장에 이유를 적지 않았으면 상소 후 20일 안에 원심 법원에 이유서를 낼 수 있습니다.
  - §384: §395가 가리키는 사유(不合法律上之程式 등)를 대조했습니다.
  - §395: 본문 서술과 일치합니다.

VERDICT: PASS
