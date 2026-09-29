# EN3 중간검수 r1 (Opus 5.5) — 026 foreign-professional-dismissed-taiwan

verdict: REVISE

요약: 전체 틀과 문장은 좋다. 조문 번호와 링크(pcode·flno)는 전부 맞고, 1955·WDA·NIA·금카 인용도 원문과 일치한다. 그러나 **퇴직금 전환 설명에 금액을 바꾸는 오류(P0) 1건**이 있고, 체류 기간·적용 범위·화자 목소리에 P1 3건이 있다.

---

## P0 (사실 오류·위험)

### P0-1. 외국 전문인력의 연금제도 전환: 시행일 누락, 이미 끝난 선택기간, 보류 연수(保留年資) 누락 → 퇴직금을 적게 받아들이게 만든다
- 위치(48행): "Foreign professionals were brought into that system by an amendment to the Foreign Professionals Act in August 2025 (Article 24), with a six-month window for those already employed to opt to stay under the old Labor Standards Act pension rules. Under the old rules, Article 17 gives a full month per year with no cap. Ask HR which regime applies to your service years…"
- 문제:
  1. **시행일이 2026-01-01**이다. "2025년 8월"은 입법원 통과일(조문 안의 「114年8月29日修正之條文」)이고, 공포일은 2025-09-24, 시행일은 行政院令으로 **115-01-01**이다. 2025년 9월~12월에 해고된 사람에게는 아직 구 규정이 적용됐다.
  2. 6개월 선택기간은 **2026-06-30에 이미 끝났다**. 초안은 이 기간이 지금도 열려 있는 것처럼 읽힌다.
  3. 결정적 누락: 2026년 전부터 같은 회사에서 일했고 구 제도를 선택하지 않은 사람은 **2026년 전 연수가 보류되고, 해고(勞基法 11조 등) 시 해고 당시 평균임금으로 1년당 1개월(상한 없음)로 지급된다**(勞退條例 11조, 人才專法 24조 3항이 이 조문을 준용). 신제도 산식(0.5개월, 상한 6개월)은 2026-01-01 이후 연수에만 적용된다. 초안만 읽은 독자는 "나는 이제 신제도니까 전체 연수에 0.5개월, 최대 6개월"로 이해하고, 그렇게 계산된 금액을 받아들이게 된다. 지금 해고되는 외국 전문인력은 대부분 2026년 전부터 일한 사람이라 금액 차이가 크다.
  4. 영주권(APRC) 보유자(2019년부터)나 대만인 배우자(2014년부터)는 그전부터 이미 勞退條例 7조 1항 2·4호로 신제도에 있었고, 기준일이 다르다.
- 근거:
  - 人才專法 24조(curl 원문): 「從事專業工作之外國專業人才及外國特定專業人才，適用勞工退休金條例之退休金制度。但其於本法中華民國一百十四年八月二十九日修正之條文施行前已受僱且仍服務於同一事業單位，於修正施行之日起六個月內，以書面向雇主表明繼續適用勞動基準法之退休金規定者，不在此限。…依第一項規定適用勞工退休金條例退休金制度者，其適用前之工作年資依該條例第十一條規定辦理。」 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=24
  - 연혁: 「中華民國一百十四年九月二十四日總統華總一經字第11400095401號令修正公布全文33條…中華民國一百十四年十一月十八日行政院院臺教字第1141030485號令發布第4條第4款第4目後段、第28、29條，定自一百十五年六月三十日施行；其餘條文，定自一百十五年一月一日施行」 https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295
  - 勞退條例 11조: 「…其適用本條例前之工作年資，應予保留。前項保留之工作年資，於勞動契約依勞動基準法第十一條…規定終止時，雇主應依各法規定，以契約終止時之平均工資，計給該保留年資之資遣費或退休金，並於終止勞動契約後三十日內發給。」 12조: 「…適用本條例後之工作年資…每滿一年發給二分之一個月之平均工資…最高以發給六個月平均工資為限」 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030020&flno=11
  - 勞保局 공지(2025-12-29): 「外專法第24條自115年1月1日修正施行…無論是否取得永久居留身分，即適用勞退新制…應自施行之日起6個月內(即115年6月30日前)，以書面向雇主表明」 https://www.bli.gov.tw/0109649.html
  - 勞動部 FAQ(更新 2026-05-22, 영문 병기): Q3 「得於115年6月30日前…表明繼續適用…勞退舊制」, Q7/Q10 「依照勞工退休金條例第11條規定…原先工作年資仍應予保留」 https://www.mol.gov.tw/1607/28690/2282/2302/2316/86977/post
  - 勞退條例 7조(개정 없음, 108-05-15판): 외국인은 「與…國民結婚…獲准居留」「經…許可永久居留」만 열거 → 전문인력 전체 편입은 人才專法 24조가 특별법으로 한 것. 초안의 조문 인용 자체는 맞다.
- 수정안(48행 문단 교체. 늘어난 분량은 P2-8에 따라 다른 곳에서 줄인다):
  > Severance depends on which pension system covers each year of your service. Under the old Labor Standards Act system, Article 17 gives one month of average wages per year, with no cap. Under the new system, [Article 12 of the Labor Pension Act](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030020&flno=12) gives half a month per year, prorated and capped at six months. Since January 1, 2026, Article 24 of the Foreign Professionals Act has put foreign professionals doing professional work on the new system, whether or not they hold permanent residence. Those already employed on that date had until June 30, 2026 to tell their employer in writing that they wanted to stay under the old rules, and that window has now closed. Switching does not wipe out your earlier years. Under Article 11 of the Labor Pension Act, service with the same employer before the switch is preserved, and on a dismissal under Article 11 of the Labor Standards Act it is paid at the old rate of one month per year, based on your average wage when the contract ends. Only the years from 2026 onward use the half-month formula. If you hold permanent residence or are married to a Taiwanese citizen, your switch may have come earlier. Ask HR for the calculation year by year, in writing; the Ministry of Labor's [Q&A on the change](https://www.mol.gov.tw/1607/28690/2282/2302/2316/86977/post) explains the transition. The broader picture is in our [severance overview](/en/columns/taiwan-labor-severance-law). Severance is due within 30 days after the contract ends.
  - dossier의 해당 행(「amended 2025-08-29」)도 「LY 통과 2025-08-29 / 公布 2025-09-24 / 施行 2026-01-01, 선택기간 ~2026-06-30」과 勞退條例 11조 행 추가로 고칠 것.

---

## P1 (오해 소지·중요 누락·형식)

### P1-1. "정해진 체류 일수는 공식 자료에 없다"는 문장이 틀렸다. 이민법 36조에 10일 출국명령이 있다
- 위치(64행): "The Immigration Act then lets the National Immigration Agency revoke your residence permit… I did not find any official statement of a fixed number of days you may stay after this happens."
- 문제: (a) 31조 4항은 재량이 아니다. 「廢止其居留許可，並註銷其外僑居留證」로 기속이고, 예외가 있을 때만 「得准予繼續居留」다. "lets"라고 쓰면 약하게 읽힌다. (b) 36조 2항 7호는 31조 4항으로 거류가 취소된 경우 이민서가 강제퇴거하거나 **10일 안에 출국하도록 명령**할 수 있다고 정한다. 유예기간이 아니라 출국명령 기한이지만, 공식 수치가 "없다"는 말은 사실과 다르고 독자가 경계를 늦추게 한다.
- 근거: 入出國及移民法 36조 2항(curl 원문) 「外國人有下列情形之一者，移民署得強制驅逐出國，或限令其於十日內出國…七、有第三十一條第四項規定情形，居留原因消失，經廢止居留許可，並註銷外僑居留證。」 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=36 ; 31조 4항 「移民署對於外國人於居留期間內，居留原因消失者，廢止其居留許可，並註銷其外僑居留證。但有下列各款情形之一者，得准予繼續居留」 (…flno=31)
- 수정안:
  > The [Immigration Act](…flno=31) then requires the National Immigration Agency to revoke your residence permit and cancel your ARC once the reason for it has gone, unless an exception applies. The law gives no grace period. Once residence is revoked on this ground, Article 36 allows the Agency to deport you or to order you to leave within 10 days. How soon that happens after your last working day depends on when the employer reports and when the Agency acts, so do not rely on figures repeated online. Go to the Agency service station for your address as soon as you are told, and ask for its instructions in writing.
  - 공식 링크가 이미 10개이니 36조는 링크 없이 인용하거나 다른 링크와 바꾼다(P2-8).

### P1-2. 적용 범위: "teachers and managers"를 독자로 부르면서 勞基法이 적용되지 않는 두 집단을 알리지 않는다
- 위치(26행): "This is a common scene for engineers, teachers and managers on Taiwan work permits"; 그 뒤 해고 사유·예고·퇴직금 분석은 모두 勞基法 적용을 전제로 한다.
- 문제: (a) 勞動部 입장으로는 사립 각급 학교의 교사(編制內, 그리고 編制外라도 가르치기만 하는 교사)는 勞基法 적용 대상이 아니다. 공립학교 교사도 마찬가지다. 학교 교사의 허가는 教育部 소관이다(人才專法 5조 단서). 따라서 11조·16조·17조와 WDA 처리기간이 그대로 적용되지 않는다. (b) 회사법에 따라 **위임**된 (총)경리는 勞基法상 근로자가 아니다. 외국인 지사장·GM에게 흔한 상황이다. 勞基法이 적용되는 보습반(短期補習班) 교사와 혼동하기 쉽다.
- 근거: 勞動部 FAQ(更新 2021-10-20) 「私立各級學校除編制內之教師、職員及編制外僅從事教學工作之教師不適用勞動基準法外，其餘工作者均有勞動基準法之適用」 https://www.mol.gov.tw/1607/28690/2282/2284/2286/7086/post ; 勞動部 FAQ(更新 2026-04-15) 「依公司法『委任』之經理、總經理不屬勞動基準法所稱之勞工，故其退休及其他勞動條件等權利義務事項，由其與事業單位自行約定。」 https://www.mol.gov.tw/1607/28690/2282/2284/2286/7088/ ; 人才專法 5조 1항 단서 「聘僱從事就業服務法第四十六條第一項第三款…之專業工作者，應檢具相關文件，向教育部申請許可」
- 수정안: 26행의 "teachers"를 "cram-school teachers"로 바꾸고, "Is the ground a lawful one?" 첫머리에 다음을 넣는다.
  > Two groups should first check whether the Labor Standards Act applies to them at all. The Ministry of Labor treats teachers at private schools and universities who only teach as outside the Act, and a general manager appointed under the Company Act on a mandate, rather than hired as an employee, is not a "worker" under it either. Their exit terms come from the Teachers' Act or from the contract itself, so the rest of this section may not fit.

### P1-3. 변호사 광고 칼럼에 연구 메모식 1인칭 "I could not confirm/verify / I found no / I did not find"가 5회 나온다. 이 중 1건은 공식 답이 있다
- 위치: 34행 "I could not confirm what an employer files…", 42행 "I found no separate probation rule in the Act", 60행 "I did not find a short statutory deadline", 64행 "I did not find any official statement…"(P1-1), 68행 "What I could not verify is how this works…"
- 문제: BRIEF는 "대만에서 외국인 사건을 오래 해 온 변호사가 의뢰인에게 설명하듯" 쓰라고 한다. 광고책임 변호사 이름이 걸린 글에서 "찾지 못했다"를 반복하면 조사 로그처럼 읽혀 신뢰와 상담 전환을 깎는다. 불확실성은 숨기지 말되 실무가의 말로 바꾼다. 수습기간은 勞動部 공식 답이 있어 "찾지 못했다"고 할 이유도 없다.
- 근거(수습): 勞動部 FAQ(發布 2025-08-13) 「雇主於該試用期間內或屆期時欲終止勞動契約，仍需有勞動基準法第11條、第12條或第13條但書規定之情事始得終止契約，尚不得以試用為由訂定定期勞動契約或與勞工約定得任意隨時終止契約…雇主應按年資辦理資遣預告、給付資遣費與謀職假」 https://www.mol.gov.tw/1607/28162/28296/81778/81781/82213/post ; 就服法 56조 「…聘僱關係終止之情事，雇主應於三日內以書面載明相關事項通知當地主管機關、入出國管理機關及警察機關」
- 수정안:
  - 34행: "That form is not a reason for you to sign. The employer's duty to report the end of your employment under Article 56 of the Employment Service Act does not depend on your signature, so get advice, from a lawyer or the 1955 hotline, before you sign anything."
  - 42행: "The Act has no probation clause, and the Ministry of Labor's guidance is that an employer ending the contract during or at the end of probation still needs a ground under Article 11 or 12, with notice and severance where they apply."
  - 60행: "The statutes set no short deadline for challenging a dismissal, but limitation periods apply to money claims and evidence goes stale, so do not wait a year to see what happens."
  - 68행: "The practical problem is timing. The extension is framed as an application made before your current residence expires, while the employer's report can lead to the ARC being cancelled first. Ask the Agency in the first week which application it will accept in your situation, and get the answer in writing."

---

## P2 (문체·다듬기·보강)

1. 40행 12조: 12조 해고에는 예고수당과 퇴직금이 없다(18조 1호). 사용자가 "misconduct"로 부르는 이유가 여기 있다. 30일 제한은 1·2·4~6호에만 걸린다(3호 형사판결 제외). 수정안: "…within 30 days of learning of the conduct (for most of the listed grounds). A dismissal under Article 12 carries no notice pay or severance, which is why the label matters: if your employer calls it misconduct, ask which rule and which date."
2. 58행 勞動事件法 16조: 행정 조정이 이미 결렬됐으면 법원 조정 전치의 예외가 된다(16조 1항 1호 → 民訴 406조 1항 2호 「經其他法定調解機關調解未成立者」). 독자가 조정을 두 번 해야 한다고 오해하지 않게 한 줄 넣는다: "If mediation at the labor bureau has already failed, the court can skip its own mediation."
3. 56행 "treated as a contract": 勞資爭議處理法 59조에 따라 조정 성립 후 상대가 이행하지 않으면 법원에 강제집행 허가 결정을 신청할 수 있다(裁判費 暫免). "just a contract"보다 강하다. 수정안: "…treated as a contract between you and the employer, and if the employer does not pay, you can ask the court for an enforcement order (Article 59)."
4. 58행 49조: 요건 「雇主繼續僱用非顯有重大困難」을 빠뜨렸다. 선택 사항으로, 외국인은 명령이 나와도 취업허가 문제가 따로 남는다는 한 줄도 실무적으로 유익하다.
5. 70행 처리기간 7/12 근무일: 수치는 맞다. 다만 인용 근거는 2025 FAQ보다 현행 勞動部 공고(2026-04-13, 勞動發事字第1150504126號 「規定網路傳輸方式申請：自本部系統收件次日起7個工作日…書面送件申請：…12個工作日」, https://ezworktaiwan.wda.gov.tw/News_Content.aspx?n=C4CEA4239AC85576&sms=02F991407E934D54&s=024795A3D2DC9D14)로 dossier를 갱신한다.
6. 72~76행 금카: 이민법 31조 마지막 항 「外國人於居留期間，變更居留住址或服務處所時，應於事實發生之翌日起算三十日內，向移民署申請辦理變更登記」에 따라, 고용주를 바꾼 금카 소지자도 근무처 변경을 30일 안에 등록해야 한다. 금카 절의 실무 팁으로 한 문장 넣을 만하다. APRC 소지자는 취업허가가 필요 없으므로(人才專法 7조 2항) 체류 문제가 없다는 한 줄도 독자층에 맞다.
7. FAQ2 "an extension of residence for job-seeking": 規則 10조는 목적을 명시하지 않는다. 본문 표현("a six-month extension of residence")과 맞추거나 "commonly used to look for new work"로 쓴다.
8. 분량과 링크 수: P0/P1 수정 후에도 본문 1,300–1,900 words(현재 약 1,770)와 공식 링크 5–10개(현재 law.moj 10개)를 지켜야 한다. 제안: 32행 민법 92조 링크는 텍스트 인용만 남기고 링크를 勞動部 전환 FAQ로 바꾼다. 26행 마지막 문장 "Most articles cover only the first one."(검증 불가 일반화)과 54행 1955 설명 한 문장을 줄여 분량을 맞춘다.
9. 34행 "That may be one reason HR wants a signature quickly.": 사용자 동기를 추측하는 문장이다. P1-3 수정안처럼 "서명이 법적으로 필요하지 않다"는 사실로 바꾸는 편이 낫다.
10. 24행 "an ARC that lists this company as your employer": 현행 ARC 양식에 고용주명이 인쇄되는지 확인 필요하다. 안전하게 "an ARC issued because of this job"으로 쓴다.
11. (선택, 확인 후) 勞資爭議處理法 6조 3항은 소송을 내는 근로자를 中央主管機關이 扶助할 수 있다고 정한다(法扶 위탁 勞工訴訟扶助). BRIEF의 "무료 공공 지원을 알려 주라"에 부합한다. 외국인 자격 요건을 laf.org.tw에서 확인한 뒤에만 넣는다.

---

## 형식·기타 확인 결과 (문제 없음)
- frontmatter 필드와 순서가 BRIEF와 일치한다. title+suffix 104자이므로 seoTitle이 필요하고, 현재 45자(+suffix 60자)로 title과 다르다. summary 159자, 말줄임표 없음. read_time 9 min. FAQ 3개(각 2–3문장)는 본문과 모순이 없다. CTA 블록(사무소명, 알려 줄 정보, 이메일, 주소, 광고책임 변호사)과 확인일 문장이 022 형식과 같다. 금지어 grep 0건, em dash 0, bold 0, 불릿 0.
- 내부 링크 `/en/columns/taiwan-voluntary-resignation-severance`(009)와 `/en/columns/taiwan-labor-severance-law`(008)는 실제 파일이 있다. 008/009는 반복하지 않고 링크로 한 번씩만 가리킨다. 008 FAQ의 "years of service governed by…" 표현과는 P0 수정 후 오히려 더 잘 맞는다.
- law.moj 링크 10개의 pcode·flno가 모두 해당 법령·조문을 가리킨다(A0030295=人才專法, N0030020=勞退條例, N0030001=勞基法, N0090001=就服法, D0080132=移民法, D0080129=停留居留辦法, N0020007=勞資爭議處理法, B0010064=勞動事件法, B0000001=民法).
- 참고(통합 단계용): featured_image `026-…/featured-01.webp`는 아직 없다. `column-seo-title-frontmatter.test.ts`가 EN 파일 수 23을 고정하고 있어 024–026을 추가할 때 테스트 갱신이 필요하다.

## 원문 대조로 확인된 주장 (요약)
勞基法 9(定期 요건)·11(5개 사유)·12(30일, 1·2·4~6호)·16(10/20/30일, 주 2일 구직휴가, 예고수당)·17(1개월/년, 30일 내)·18(자진퇴사·기간만료 무퇴직금)·19(服務證明書) / 就服法 43·46 3항(8~10호만 정기계약 강제)·53(신 고용주 신청+離職證明)·56(3일 서면통보 3기관)·73(廢止) / 移民法 31조 4항 5호 원문 「外國人與本國雇主發生勞資爭議，正在進行爭訟程序」(행정조정 포함 여부는 법문상 불명확하다. 초안의 "Agency에 확인" 처리가 적절) / 停留居留辦法 10(6개월+1회, 총 1년, 「於居留期限屆滿前」)·9(3개월 전 신청) / 人才專法 9(4證合一, 1–3년)·17(6개월+1회, 최대 1년, 금카 포함)·25(就保는 영주권자) / 勞資爭議處理法 9·11·12(3일/7일)·23 / 勞動事件法 12(裁判費 2/3 暫免)·16·24(3개월·3회)·26·49 / 民法 92·93(1년) / WDA FAQ(第一類 外國人 解聘 서류에 「勞雇雙方同意解約證明文件」, 更新 114-09-01) / WDA FAQ(7/12 근무일, 空窗期 경고) / NIA 送件須知(更新 2026-01-19: 「一個月內核發之離職證明」, 「居留期限屆滿前三個月內申請」, 6+6개월) / 금카 공식 사이트(「四證合一的個人工作許可證…自由尋職、就職及轉換工作」, 「不需要。就業金卡本身已包含個人工作許可」) / 1955(勞動部 2014: 24시간·무료, 臺北市勞動局 2025-06-23: 화이트·블루칼라, 영·태·인니·베트남어).

검증한 주장 수: 41 / 공식 출처 재확인 수: 법령 원문 curl 11종(조문 44개, 연혁 1) + 기관 페이지 16건(勞保局 2, 勞動部 FAQ 4, 勞動部 1955 보도 1, 勞動部 공고 1, WDA FAQ 2, NIA 1, 금카 4, 臺北市勞動局 1)
