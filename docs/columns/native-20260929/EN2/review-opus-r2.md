# EN2 중간검수 r2 (Opus 5.5) — `025-taiwan-police-questioning-foreigner-rights`

verdict: REVISE

- P0: 1 / P1: 2 / P2: 6. 셋 다 한 문장짜리 수정이다. 고치면 PASS 가능.
- 검증한 주장 수: 34 (r1 이후 새로 쓰거나 바뀐 주장 전부 + FAQ 3개) / 공식 출처 재확인 수: 33 (조문 26 + MOJ 영문 표제 4 + NPA 1 + LAF 2)
  - 오늘 curl로 받은 law.moj.gov.tw 원문: 刑事訴訟法 71, 71-1, 95, 99, 100-3, 114, 117-1, 133, 138, 156, 158-2, 175, 178, 181, 186, 196-1, 93, 93-1, 101, 31-1 / 入出國及移民法 18, 32, 33, 36 / 提審法 1, 2
  - MOJ 영문판 표제 4건: 提審法 = **"Habeas Corpus Act"** (https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=C0010008), 入出國及移民法 = "Immigration Act", 刑事訴訟法 = "Code of Criminal Procedure", 刑法 = "Criminal Code of the Republic of China". 본문 표기와 모두 일치.
  - npa.gov.tw 권리고지서 페이지, laf.org.tw 2쪽
- 형식: summary 160자, seoTitle 45자("Foreigners' Rights", +suffix 60), 링크 10개(pcode·flno 불변·정상), 금지어 0, em dash 0, 굵은 글씨 0. 본문 1,887 words로 상한 1,900까지 13단어 남음. 아래 수정은 길이 중립이거나 P2-6의 삭감안으로 상쇄해야 한다.

---

## r1 P1 이행 확인

| r1 항목 | 결과 | 확인 근거 (curl 원문) |
|---|---|---|
| P1-1 증인 벌금 범위 | **해결** (32행). 경찰 증인 통지(196-1)에는 178조가 없고, 178조는 검사·판사 소환에만 적용되며, 181조는 양쪽 모두, 186조 고지는 검사·판사로 정확히 나뉨 | 196-1 「…第一百七十五條第二項第一款至第三款、第四項、第一百七十七條第一項、第三項、第一百七十九條至第一百八十二條…準用之」(178·186 없음) / 178 「得科以新臺幣三萬元以下之罰鍰，並得拘提之…由法院裁定之」 |
| P1-2 압수 관련 문장 | **해결** (84행). "request or seizure" 확인 → 물리적 저항 금지 → 이의는 변호사를 통해. 수사 방해로 읽힐 소지 없음. 86행 "risk of tampering or flight when bail is decided"도 101조 1항 1·2호와 맞음 | 133 「得命其提出或交付」 / 138 「無正當理由拒絕提出或交付或抗拒扣押者，得用強制力扣押之」 |
| P1-3 移民法 36조 3항 | **해결** (80행). 퇴거 10일 전 통지, 羈押·拘提·限制出國가 아니면 사건 진행 중에도 퇴거 가능 | 36 「於強制驅逐出國十日前，應通知司法機關。該等外國人除經依法羈押、拘提、管收或限制出國者外，移民署得強制驅逐出國或限令出國」 |
| P1-4 1년 기준 | **해결** (78행, FAQ 3). 확정 1년 이상, 과실범·집행유예 제외, 33조 영주 동일, 18조 입국거부 사유 | 32·33 「三、經判處一年有期徒刑以上之刑確定。但因過失犯罪或經宣告緩刑者，不在此限。」 / 18 「七、在我國或外國有犯罪紀錄。」(「得禁止」이므로 "can be a ground"가 정확) |

## 새 내용 사실검증 결과 (정확)
- 66행 提審: 서면 고지, 24시간 이내, 이해하는 언어, 본인이나 타인이 체포지 지방법원에 청구 가능. 提審法 2조 「以書面告知本人及其指定之親友，至遲不得逾二十四小時…不通曉國語者，第一項之書面應附記其所理解之語文」, 1조 「其本人或他人得向逮捕、拘禁地之地方法院聲請提審」와 일치. 영문 법명 "Habeas Corpus Act"는 MOJ 영문판 표제와 일치.
- 46행 NPA: "16 languages, English included, for officers to show arrested foreigners"가 npa.gov.tw 「英、日、韓…16國語言版本之權利告知書…提供被逮捕或拘提之外籍人士閱覽」와 일치.
- 40행 즉시 신문 요청은 100-3조 2항, 48행 야간 시간 불산입은 93-1조 1항 3호, 42행 침묵 추정 금지는 156조 4항, 158-2조 예외 문구도 모두 정확.
- 74행 "The prosecutor or the court can attach conditions"는 117-1조 「於檢察官依第九十三條第三項但書…逕命具保…準用之」와 일치.
- 54행 LAF: 가족·지인 신청, 聲押庭 포함, 일반 법률부조는 자력심사 대상. 모두 페이지 원문과 일치. 전화 (02)2559-2119 불변.
- 60행 "typed by the officers, not by you", 41/43-1 관계 정확.

---

## P0 (사실 오류)

### P0-1. 114조 질병 요건이 거꾸로 서술됨
- 위치 (74행): "Bail cannot be refused … or for an illness that **cannot be treated outside detention**."
- 문제: 조문은 "구금 밖에서 치료받지 않으면 낫기 어려운 질병", 즉 **밖에서 치료가 필요한 경우**다. 본문은 "구금 밖에서는 치료할 수 없는 질병"이라서 의미가 정반대가 된다. (r1 P2-8 수정안을 줄이는 과정에서 뒤집힌 것으로 보임)
- 근거: https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=114 「三、現罹疾病，非保外治療顯難痊癒者。」
- 수정안 (같은 길이): "…or for an illness that is unlikely to heal without treatment outside detention."

## P1 (오해 소지·본문-FAQ 불일치)

### P1-1. "Look for 犯罪嫌疑人 or 證人"에 검사 소환장의 표기 '被告'가 빠짐 (r1에서 내가 제안한 문장이 불완전했음)
- 위치 (28행): "Look for the words 犯罪嫌疑人 (suspect) or 證人 (witness) on it."
- 문제: 검사가 피의자를 부르는 傳票에는 수사 단계라도 **被告**로 적힌다. 경찰 통지(71-1조)만 犯罪嫌疑人을 쓴다. 제목이 "Summoned by … prosecutors"인데, 검사 소환장을 든 독자는 두 단어 중 어느 것도 찾지 못한다. 기계번역으로 被告 = "defendant"를 보면 이미 기소됐다고 오해할 수 있다.
- 근거: https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=71 「傳喚被告，應用傳票。…傳票，於偵查中由檢察官簽名」(수사 중 검사가 부르는 사람도 '被告'). 71-1 「通知犯罪嫌疑人到場詢問」. 175 「傳喚證人，應用傳票」.
- 수정안 (28행 첫 문장 교체, +14 words 정도):
  > Look at how the paper describes you. 犯罪嫌疑人 on a police notice, or 被告 on a prosecutor's summons, means you are treated as a suspect; at this stage 被告 does not mean you have been charged. 證人 means witness.

### P1-2. FAQ 1이 고친 본문(P1-1)과 어긋남: 경찰 통지 불응 = 구인장 청구로 일반화
- 위치 (15행 FAQ 1): "Ignoring a lawful police notice without a good reason can lead to an arrest warrant request…"
- 문제: 본문 32행은 경찰의 **증인** 통지에는 제재가 없다고 바르게 고쳤다. 그런데 FAQ는 경찰 통지 전반에 구인장 청구가 뒤따른다고 말한다. FAQ는 FAQPage 구조화 데이터로 따로 떼어져 노출되므로 BRIEF의 "본문과 모순 없게"에 걸린다.
- 근거: 71-1 「經合法通知，無正當理由不到場者，得報請檢察官核發拘票」(犯罪嫌疑人 한정) / 196-1 (178조 준용 없음)
- 수정안: "Ignoring a lawful police notice sent to you as a suspect, without a good reason, can lead to a request for an arrest warrant, so it is better to respond and speak to a lawyer first."

---

## P2 (다듬기·흐름)

### P2-1. "late pregnancy" 부정확
- 74행: 5개월 이상은 "late pregnancy"(보통 임신 후기)가 아니다. 114조 「懷胎五月以上或生產後二月未滿」.
- 수정안: "…from the fifth month of pregnancy until two months after birth, …"

### P2-2. 28행 안내 문장 위치
- "Unless stated otherwise, article numbers below refer to…"가 실무 조언 두 문장 사이에 끼어 흐름을 끊는다. 30행 첫 인용 직후로 옮기거나 28행 문단의 마지막 문장으로 둔다(지금도 마지막이긴 하나, P1-1 수정 뒤에는 별도 줄이 낫다). 가장 간단한 대안: 30행을 "A suspect is invited to a police station with a written notice (通知書) under Article 71-1 of Taiwan's Code of Criminal Procedure (刑事訴訟法), which the article numbers below refer to unless stated otherwise."로 합친다.

### P2-3. 38행 "requires the officer to say"
- 95조는 검사·판사 신문에도 적용되므로 "officer"는 좁다. 수정안: "requires whoever questions you to say…"

### P2-4. 68행 지시어 모호
- "…is not counted, so it is not a countdown to the minute." 수정안: "…so the 24 hours are not a countdown to the minute."

### P2-5. 80행 시점 혼재·예시 누락
- 글 전체가 "you"로 쓰였는데 80행만 "the person / someone / that person / them"이다(r1에서 내가 준 문안 탓). 또 r1 원고에 있던 36조 사유 예시가 빠져서 "falls within Article 36"이 일반 독자에게 불투명하다.
- 수정안: "A pending criminal case does not by itself stop removal. If you fall within a removal ground in [Article 36 of the Immigration Act](…flno=36), such as a revoked permit or activities outside what it allows, the agency must notify the prosecutors or court ten days before removing you, but unless you are detained, under arrest or barred from leaving, it can still remove you or order you to leave."
- 근거: 36조 2항 4호 「從事與許可停留、居留原因不符之活動」, 7·8호 (居留許可 폐지·취소 후 註銷外僑居留證)

### P2-6. 단어 수 상쇄 (P1-1, P2-5 반영 시 약 +25 words → 1,900 초과)
- 삭감 후보: 74행 "; the Code gives no formula"(−5), 74행 두 번째 "(具保)" 중복 병기(68행에 이미 있음), 54행 "According to its page,"(−4), 62행 "rather than arguing about it"(−5), 78행 "Separately,"(−1), 72행 "an answer"(−2). 74행은 bail·조건·114조·출국제한이 한 문단에 몰려 길다. 114조 문장 앞에서 문단을 나누면 가독성이 좋아진다.

---

## 전체 재독: 문체와 흐름
- "Article N" 언급이 35회(r1 시점 내 집계)에서 17회로 줄면서 중간부의 "조문 다이제스트" 느낌이 크게 줄었다. 30~42행과 52~62행은 이제 실무 설명처럼 읽힌다. 도입(갈색 봉투, "come and clarify something"), 筆錄 단락("I saw"→"I did"), "request or a seizure" 문장은 대만 형사 실무 변호사의 목소리로 자연스럽다.
- 남은 AI 티는 거의 없다. 42행 "These rules help after the fact; they do not undo a careless first statement."와 78행 "there is one bright line"은 괜찮은 수준이다. 요약 결론 문단 없이 실용 섹션에서 CTA로 넘어가는 구조도 좋다.
- 윤리: 결과 보장·비교우위 없음. 수사 회피 조언 없음(P1-2 r1 해결). 무료 LAF 안내 유지. CTA가 언어 제공을 약속하지 않음. 모두 BRIEF 준수.
- 통합 메모(r1 P2-14 유지): EN1 `taiwan-exit-ban-foreigners` 내부링크(74행 출국제한 문장), EN 요약 테스트 `toHaveLength(23)` 갱신, 영사 통보는 공식 출처 확인 전까지 미기재 유지.
