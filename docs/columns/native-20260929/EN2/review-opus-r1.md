# EN2 중간검수 r1 (Opus 5.5) — `025-taiwan-police-questioning-foreigner-rights`

verdict: REVISE

- P0: 0 / P1: 4 / P2: 14
- 검증한 주장 수: 46 / 공식 출처 재확인 수: 51 (law.moj.gov.tw 조문 47개: 刑事訴訟法 40, 刑法 1, 入出國及移民法 4, 提審法 2 + laf.org.tw 3 + npa.gov.tw 1)
- 조문 원문은 전부 Bash `curl`로 law.moj.gov.tw 원문을 받아 대조함(WebFetch 요약은 LAF 페이지 교차확인에만 씀). 法規整編資料截止日: 民國115年09月18日.
- **링크 10개 전부 정상**: pcode=C0010001(刑事訴訟法) flno=95·99·93-1·93·101·31-1, pcode=C0000001(中華民國刑法) flno=95, pcode=D0080132(入出國及移民法) flno=36 모두 해당 법률의 "第 N 條" 머리글로 열림. LAF `service-project-detail/19`, `service-assistance-des` 둘 다 HTTP 200·내용 일치.
- **요청 중점 확인 결과**: 刑事訴訟法 93·93-1·95·99·31-1·100-3·101·245, 刑法 95, 入出國及移民法 36의 현행 문구와 본문 요약이 대체로 맞음(아래 P1-3의 移民法 36조 3항 서술만 틀림). LAF 24시간 전화 **(02)2559-2119** 확인. 대상 범위(身心障礙로 完全陳述 불가·原住民·最輕本刑3年以上 또는 高等法院管轄第一審 + 第一次接受訊問) 확인. 외국인 원칙상 合法居住 요건 확인.
- 형식: frontmatter 순서가 BRIEF와 같음. title+" | Hovering Law" 107자 → seoTitle 필요. seoTitle 45자(+14=59 ≤60)·title과 다름. summary 160자(상한 딱 맞음)이고 "..."/"…" 없음. 날짜 표기·featured_image 번호 025 정상(EN1=024, EN3=026과 충돌 없음). FAQ 3개가 본문과 모순되지 않음. CTA와 확인일 문장 있음. 전화번호 없음. 금지어 grep 0건(24행 "whether you are a suspect"는 금지 구문 아님). em dash 0, 굵은 글씨 0, 본문 불릿 0. 본문 약 1,845 words라 상한 1,900에 가까움. 아래 수정을 반영하려면 삭감이 필요함(P2-12).

---

## P1 (오해 소지·중요 누락)

### P1-1. 증인 벌금·강제구인 규정이 경찰 증인 통지에도 적용되는 것처럼 읽힘
- 위치 (30행): "A witness who ignores a lawful summons without good reason can be fined up to NT$30,000 and can be brought in by force (Article 178). … and the authorities are supposed to tell you so (Article 186)."
- 문제: 도입부 장면이 "a brown envelope from a police precinct"이고 섹션 제목이 "Which paper did you receive?"라서, **경찰 증인 통지서**를 받은 독자는 불출석하면 3만 NT$ 과태료와 구인을 당한다고 읽는다. 그러나 경찰이 증인을 부르는 근거는 196-1조이고, 이 조문이 준용하는 규정에 178조(과태료·구인)와 186조(거절권 고지 의무)는 들어 있지 않다. 178조는 **검사·법원의 傳票**에만 적용된다. 반대로 181조(자기부죄 거절권)는 경찰 단계에도 준용된다. 현재 문장은 공포를 과장하고 적용 범위를 잘못 알린다.
- 근거:
  - https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=196-1 : 「司法警察官或司法警察…得使用通知書通知證人到場詢問。第七十一條之一第二項、第七十三條、第七十四條、第一百七十五條第二項第一款至第三款、第四項、第一百七十七條第一項、第三項、第一百七十九條至第一百八十二條、第一百八十四條、第一百八十五條及第一百九十二條之規定，於前項證人之通知及詢問準用之。」(178·186 없음, 175조 2항 4호 "得處罰鍰及命拘提" 경고 문구도 준용 안 됨)
  - https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=178 : 「證人經合法傳喚，無正當理由而不到場者，得科以新臺幣三萬元以下之罰鍰，並得拘提之…前項科罰鍰之處分，由法院裁定之。」
  - https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=175 : 증인 傳票 기재사항 「四、無正當理由不到場者，得處罰鍰及命拘提。」
- 수정안 (30행 교체):
  > A witness is in a different position, and who is calling you matters. The police can invite a witness with their own notice (Article 196-1), but the fine and forced attendance in Article 178 do not apply to that police notice. They apply when a prosecutor or judge summons you as a witness with a 傳票: ignoring that without good reason can lead to a court-imposed fine of up to NT$30,000 and to being brought in (Article 178). In either setting you may refuse to answer questions that could expose you, or certain close relatives, to prosecution (Article 181), and a prosecutor or judge must tell you so (Article 186).
- 추가 (24행이나 26행 섹션 첫머리): 용의자 통지(71-1조)와 증인 통지(196-1조)는 법적 근거가 다른 별개 문서다. 다음 한 문장을 넣으면 도입부 "nobody has told you whether you are a suspect"와도 이어진다.
  > The paper itself is the first clue: look for 犯罪嫌疑人 (suspect) or 證人 (witness) on it, and if you cannot tell, call the officer or clerk named on it and ask before the date.

### P1-2. "hand over anything … you have not shown a lawyer"가 압수 거부나 수사 방해 조언으로 읽힐 수 있음
- 위치 (84행): "Bring any documents that relate to the events, but do not create, alter or hand over anything on the spot that you have not shown a lawyer."
- 문제: (a) 수사기관은 압수 대상 물건의 소지인에게 제출을 명할 수 있다. 정당한 이유 없이 거부하거나 저항하면 강제로 압수된다. "변호사에게 보여주기 전에는 건네지 말라"는 문장은 압수·제출명령을 거부하라는 뜻으로 읽힐 수 있다. BRIEF 윤리 조항(증거인멸·수사회피 조언 금지)의 위험 구역이다. (b) "관련 서류를 가져가라"와 "건네지 말라"가 한 문장 안에서 부딪친다.
- 근거:
  - https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=133 : 「對於應扣押物之所有人、持有人或保管人，得命其提出或交付。」
  - https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=138 : 「應扣押物之所有人、持有人或保管人無正當理由拒絕提出或交付或抗拒扣押者，得用強制力扣押之。」
- 수정안 (84행 해당 문장 교체):
  > Bring the paper you received and any documents about the events that your lawyer has reviewed with you. If officers ask for your phone or documents, ask calmly whether this is a request or a seizure. Do not physically resist a seizure; your lawyer can raise objections and ask that they be recorded. And do not write up new "evidence" or edit existing files before the interview.
- 같은 문단의 "Never delete messages, coach a witness or leave the country to avoid the process…"는 좋은 문장이니 유지.

### P1-3. 移民法 36조 3항 서술이 틀렸고, 형사사건 진행 중에도 강제퇴거될 수 있다는 핵심이 빠짐
- 위치 (80행): "It also notifies the judicial authorities when it learns a criminal case is under way."
- 문제: 조문 내용은 "사건을 알게 되면 통지한다"가 아니다. **이미 사법절차에 들어간 형사사건이 있는 외국인을 강제퇴거하려면 퇴거 10일 전에 사법기관에 통지해야 한다**는 것이고, 羈押·拘提·管收·限制出國 상태가 아니면 移民署는 **사건 진행 중에도 강제퇴거하거나 출국을 명할 수 있다**. 지금 문장만 보면 "사건이 끝날 때까지 대만에 남는다"거나 "移民署는 통지만 한다"고 오해할 수 있다. 체류자격이 불안정한 독자(초과체류·목적 외 활동)에게는 실제 행동을 바꾸는 정보다.
- 근거: https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=36 : 「移民署於知悉前二項外國人涉有刑事案件已進入司法程序者，於強制驅逐出國十日前，應通知司法機關。該等外國人除經依法羈押、拘提、管收或限制出國者外，移民署得強制驅逐出國或限令出國。」
- 수정안 (해당 문장 교체):
  > A pending criminal case does not by itself stop removal. If the person falls within Article 36, the agency must notify the prosecutors or court ten days before removing someone whose case is already in the justice system, but unless that person is detained, under arrest or barred from leaving, it can still remove them or order them to leave.

### P1-4. 거류허가 취소의 명확한 기준(확정 1년 이상, 과실범·집행유예 제외)이 빠짐
- 위치 (80행): "Cancellation of an ARC, or a later re-entry ban, depends on the outcome and your permit type. Ask about this … because it affects how a plea or settlement should be weighed."
- 문제: 본문은 형량·합의 판단을 체류와 연결해 보라고 하면서 그 판단의 핵심 기준을 빼 두었다. 移民法 32조 3호(거류)와 33조 3호(영주)는 **징역 1년 이상 확정**이면 거류·영주 허가를 취소·폐지하도록 정하고, **과실범과 집행유예는 예외**로 둔다. 조문으로 확인되는 명확한 선이다. 이 기준 없이 "depends"로만 끝내면 상담 동기 부여도 약하다. dossier에도 18조 1항 7호를 읽고 쓰지 않았다고 되어 있다.
- 근거:
  - https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=32 : 「移民署對有下列情形之一者，撤銷或廢止其居留許可，並註銷其外僑居留證：…三、經判處一年有期徒刑以上之刑確定。但因過失犯罪或經宣告緩刑者，不在此限。」
  - https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=33 : 永久居留 3호 같은 문구
  - https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=18 : 「外國人有下列情形之一者，移民署得禁止其入國：…七、在我國或外國有犯罪紀錄。」
- 수정안 (해당 두 문장 교체):
  > For residence permits there is one bright line: a final sentence of one year's imprisonment or more leads the agency to revoke the permit and cancel the ARC, unless the offence was one of negligence or the sentence was suspended (Article 32 of the Immigration Act; Article 33 has the same rule for permanent residence). A criminal record can also be a ground for refusing entry later (Article 18). That is why the immigration question belongs in your first meeting with a lawyer: it changes how a plea, a settlement or a request for a suspended sentence should be weighed.
- FAQ 3 답변에도 한 문장을 넣으면 좋다: "A final sentence of one year or more, unless suspended or for a negligence offence, leads to revocation of a residence permit."

---

## P2 (정확도 다듬기·문체)

### P2-1. 筆錄 작성자와 41/43-1조 적용 관계
- 위치 (58행): "it is written by the questioner. Under Article 41, applied to police and prosecutor questioning by Article 43-1"
- 문제: 43-1조 2항은 경찰 조서를 **질문자가 아닌 다른 사람이** 작성하도록 한다. 또 41조는 검사 신문에 바로 적용되고, 43-1조는 검찰사무관과 경찰로 적용을 넓히는 조문이다.
- 근거: https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=43-1 : 「第四十一條、第四十二條之規定，於檢察事務官、司法警察官、司法警察行詢問…時，準用之。前項犯罪嫌疑人詢問筆錄之製作，應由行詢問以外之人為之。」
- 수정안: "The transcript (筆錄) is the record of what you said, but it is typed by the officers, not by you. Article 41 governs it, and Article 43-1 extends the same rules to police questioning."

### P2-2. 야간신문: 본인이 원하면 즉시 신문해야 한다는 규정과, 야간 시간이 24시간에서 빠진다는 점
- 위치 (38행). 100-3조 2항 「犯罪嫌疑人請求立即詢問者，應即時為之。」, 93-1조 1항 3호(100-3조 때문에 신문할 수 없는 시간은 24시간에 넣지 않음).
- 근거: https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=100-3 , …flno=93-1
- 수정안 (38행 첫 문장 뒤에 추가): "If you would rather be questioned straight away, you can ask, and the police must then go ahead. Time lost to the night-time rule is also left out of the 24-hour count discussed below."

### P2-3. 158-2조 "narrow exceptions" 표현
- 예외 요건은 "위반이 악의가 아니었고 진술이 자유의사였음"이다. 실무에서 좁다고 단정할 근거가 없다.
- 근거: https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=158-2 「但經證明其違背非出於惡意，且該自白或陳述係出於自由意志者，不在此限。」
- 수정안: "…can be excluded from evidence unless the authorities show the breach was not in bad faith and the statement was still voluntary (Article 158-2)."

### P2-4. 침묵을 유죄 추정 근거로 쓸 수 없다는 조항(156조 4항) 추가 권장
- 외국인 독자가 흔히 걱정하는 "침묵하면 불리하지 않나"에 답이 된다.
- 근거: https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=156 「被告未經自白，又無證據，不得僅因其拒絕陳述或保持緘默，而推斷其罪行。」
- 수정안 (40행에 추가): "Silence alone cannot be used to infer guilt (Article 156)."

### P2-5. 경찰청의 16개 언어 권리고지서, 실무 신뢰도를 높이는 공식 정보
- 근거: https://www.npa.gov.tw/ch/app/eform/view?module=eform&id=2248&serno=A1097547 「…目前已有英、日、韓、西、泰、印、馬、阿、越、法、德、土、荷、俄、柬及緬甸16國語言版本之權利告知書…涉外刑事案件處理員警得於當場下載使用，提供被逮捕或拘提之外籍人士閱覽」
- 수정안 (44행 Language 섹션에 추가): "The National Police Agency publishes the rights notice (權利告知書) in 16 languages, including English, for officers to hand to arrested foreigners. Ask for it."

### P2-6. 체포 시 提審 서면고지(이해하는 언어로), 외국인에게 직접 관련됨
- 근거: https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010008&flno=2 「…得依本法聲請提審之意旨，以書面告知本人及其指定之親友，至遲不得逾二十四小時。…本人或其親友不通曉國語者，第一項之書面應附記其所理解之語文…」 ; flno=1 「其本人或他人得向逮捕、拘禁地之地方法院聲請提審」
- 수정안 (64행에 추가): "You and the person you name must also be told in writing, within 24 hours and in a language you understand, that you or anyone else can ask the local district court to review the arrest (提審, Article 2 of the Habeas Corpus Act)." (영문 법명은 통합 전에 MOJ 영문판 표기로 다시 확인할 것)

### P2-7. 보석 조건은 검사가 명한 보석에도 적용됨
- 위치 (74행) "The court can also attach conditions". 117-1조에 따라 검사가 93조 3항으로 바로 명한 具保·責付·限制住居와 법원이 101-2조로 명한 보석에도 116-2조 조건이 준용된다. 외국인 사건에서 가장 흔한 결론이 검사의 交保 + 여권 제출 + 出境·出海 제한이라 중요하다.
- 근거: https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=117-1 「前二條之規定，於檢察官依第九十三條第三項但書…逕命具保、責付、限制住居，或法院依第一百零一條之二逕命具保…之情形，準用之。」
- 수정안: "The prosecutor or the court can attach conditions to bail, and for a foreigner the important ones are…"

### P2-8. 114조 요약 보완
- "pregnancy of five months or more" 뒤에 "or within two months after giving birth"를 넣는다. "serious illness"는 "an illness unlikely to heal without treatment outside detention"으로 바꾼다.
- 근거: …flno=114 「二、懷胎五月以上或生產後二月未滿者。三、現罹疾病，非保外治療顯難痊癒者。」
- 76행은 108조(羈押期間)와 114조(보석 거절 금지)가 한 문단에 섞여 있다. 114조 문장을 74행 보석 문단 끝으로 옮기는 편이 흐름이 좋다.

### P2-9. 95조 권리 목록의 법률부조 문구
- 95조 1항 3호에는 「如為低收入戶、中低收入戶、原住民或其他依法令得請求法律扶助者，得請求之」가 있다. 36행에 "and, if eligible, ask for legal aid"를 넣으면 52행 LAF 단락과 이어진다.

### P2-10. LAF 단락 보완 (전화번호·범위는 정확함)
- (a) 일반 법률부조는 **자력(資力) 심사**가 있다. "legal aid may still be possible" 뒤에 "subject to a means test"를 넣는다. 근거: https://www.laf.org.tw/service-assistance-des 「法律扶助基金會基本上需審查申請人的「資力」（即財力）和「案情」」
- (b) 가족·지인도 전화할 수 있다. 도입부의 "a friend was arrested" 독자에게 직접 쓸모 있다. 근거: service-project-detail/19 「經本人、親友、社工或訊問機關撥打 (02)2559-2119」
- (c) 3번 범주는 警詢·偵訊과 **聲押庭**까지 포함한다. 근거: 같은 페이지 「需同時符合左欄二要件，才能就「警詢、偵訊、聲押庭」申請」
- 수정안: "…with a 24-hour line, (02) 2559-2119, which a family member or friend can also call. … who are being questioned for the first time, and for them it also covers the detention hearing. Outside those categories, ordinary legal aid may still be possible, subject to a means test…"
- 54행 "hire the lawyer"는 무료 LAF 변호사와 맞지 않는다. "Whoever you call, get a lawyer involved before you sign a statement, not after."로 바꾼다.

### P2-11. 중국어 병기와 기관 공식 영문명
- BRIEF는 핵심 용어를 처음 나올 때 한 번 중국어로 병기하라고 한다. 다음이 빠져 있다: Code of Criminal Procedure(刑事訴訟法, 28행 첫 등장), 출국제한(限制出境、出海), 責付, 限制住居, 移民署. "the Immigration Agency"는 공식 영문명 "the National Immigration Agency (移民署)"로 쓴다.
- 28행 첫 등장 뒤에 "Unless stated otherwise, article numbers below refer to this Code."를 한 번 넣으면 이후 괄호 인용의 모호함(특히 80행 刑法 95조와 CPA 95조)이 없어진다.

### P2-12. 문체: 실무가 글보다 "조문 요약집"에 가까운 구간 (AI 티의 주원인)
- 본문 약 1,850단어에 "Article N" 언급이 35회다(괄호 인용 21회 + 링크 포함 괄호 4회 = 25회). 26~76행은 거의 모든 문장이 "(Article N)"으로 끝나서 조문 다이제스트처럼 읽힌다. 도입부(갈색 봉투, "come and clarify something")와 筆錄 단락("I saw"→"I did", "maybe"→"yes")은 실무가의 목소리다. 중간부도 그 톤을 유지해야 한다.
- 권장: 링크 10개는 유지하고 괄호 인용은 15개 안팎으로 줄인다. 삭감 후보(단어 수 확보용): 101-1조 문장(70행), 93조 分卷 문장(70행), 176-1조 문장(30행), 108조 문장을 한 구절로 압축.
- AI 티 나는 문장과 대체안:
  - 38행 "Some other rules you can rely on." (목록 도입용 파편문) → 삭제하고 바로 "Police may not question a suspect at night…"로 시작.
  - 40행 "None of that is a reason to test the system. It is a reason to speak calmly, with counsel, from the beginning." (대구형 경구) → "These rules help after the fact; they do not undo a careless first statement. Speak calmly, and with a lawyer, from the start."
  - 46행 "The interpreter has a real effect on timing." → "Waiting for an interpreter also changes the clock."
  - 60행 "For a foreigner this means a few concrete habits." → 삭제하고 바로 "Ask for the transcript to be interpreted back to you sentence by sentence."
  - 60행 "Ask for corrections in writing rather than arguing." → "Ask for each correction to be written into the transcript before you sign, rather than arguing about it."

### P2-13. 마무리 확인일 문장
- 92행 "confirm the current text and your own deadlines with the authority that issued your paper"는 피의자에게 수사기관에 확인하라고 권하는 모양이 어색하다. 기존 칼럼 022의 형식을 따라 바꾼다: "Official sources checked September 29, 2026. Statutes change; check the current text and your own dates with a lawyer or with the office named on your paper."

### P2-14. 통합 단계 메모 (집필자 조치 불필요, 총괄 참고)
- EN1 `taiwan-exit-ban-foreigners`(024)가 출국제한을 다룬다. 둘 다 게시되면 74행 93-2조 문장에서 `/en/columns/taiwan-exit-ban-foreigners`로 내부링크를 거는 것을 권장한다. EN2의 출국제한 서술은 지금처럼 짧게 유지해서 중복을 피한다.
- `src/lib/__tests__/column-summary-frontmatter.test.ts`는 EN 칼럼 수를 `toHaveLength(23)`으로 고정하고 있어서 통합할 때 갱신이 필요하다.
- 영사 통보: 비공식 사본(6laws.net의 警察偵查犯罪手冊)에서 "逮捕·拘提된 외국인을 그 나라 駐華使領館 또는 代表機構에 통지(본인이 명시적으로 반대하면 제외)"라는 조항을 봤다. 공식 출처(npa.gov.tw 警察法規)에서 확인되면 추가할 가치가 크다. **확인 전에는 넣지 말 것**(dossier의 누락 판단은 적절함).
- seoTitle "Foreigner's Rights"보다 "Foreigners' Rights"가 자연스럽다(45자 그대로).

---

## 윤리 점검
- 결과 보장·승소율·최상급 표현 없음. 타 로펌 언급 없음. 공포 조장 대체로 없음(P1-1로 과장된 부분 교정).
- 수사 회피·증거인멸 조언: 84행 "hand over" 문장 1건이 오독될 수 있어 P1-2로 올림. "Never delete messages, coach a witness or leave the country…"는 오히려 적절한 반대 방향의 경고다. 32행 "say you want to speak to a lawyer"와 50행 "what to say and what not to"는 묵비권·변호인 조력권 행사이므로 문제없음.
- 무료 공공지원(LAF 24시간)을 숨기지 않고 제시함. BRIEF 취지에 부합.

## 검증 요약 (46개 주장)
정확: 71-1, 71, 176-1, 181, 95(1)(2), 100-2, 100-1, 245(2), 156, 99, 93-1(5)(6), 27, LAF 전화·범위·외국인 요건, 41(2)(3)(4), 89, 93(1)(2)(3)·分卷, 101(1)(3)(4), 101-1, 31-1, 110, 111, 116-2(5)(6), 93-2, 108(1)(5), 114(요약 수준), 刑法 95, 移民法 36(2)(4)(5), FAQ 1–3.
수정 필요: 178·186의 적용 범위(P1-1), 移民法 36(3)(P1-3), 43-1(2) 조서 작성자(P2-1), 158-2 예외 표현(P2-3).
누락 보완: 移民法 32(3)/33(3)(P1-4), 100-3(2), 156(4), NPA 다국어 권리고지서, 提審法 2, 117-1, 95(1)(3) 법률부조 문구, LAF 자력심사·가족 신청·聲押庭.
