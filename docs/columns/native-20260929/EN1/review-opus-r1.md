# EN1 중간검수 r1 (Opus 5.5) — 024-taiwan-exit-ban-foreigners

검수일 2026-09-29. 조문은 전부 law.moj.gov.tw `LawAll.aspx`를 curl로 직접 받아 태그만 제거한 원문으로 대조했다(WebFetch 요약 미사용). 현행 개정일: 刑事訴訟法 115.05.13 / 入出國及移民法 112.06.28 / 稅捐稽徵法 110.12.17 / 強制執行法 108.05.29 / 行政執行法 99.02.03 / 訴願法 101.06.27 / 法律扶助法 104.07.01. 본문의 조문 링크 7개는 모두 해당 조문으로 열리는 것을 curl로 확인했다(pcode·flno 정상).

verdict: **REVISE**

---

## P0 (사실 오류·위험) — 1건

### P0-1. 강제집행 "限制住居"와 출국금지 사이에 공식 근거가 없다고 쓴 부분 → 공식 근거가 있다
- 위치 (본문 "Debts and fines" 첫 문단 끝): "The statute speaks of restricted residence, not exit bans by name, and I have not found an official source that describes how the two are linked in practice, so ask your lawyer to check the file."
- 문제: 強制執行法 제22조 조문 자체에는 "限制出境"이라는 말이 없다. 이 부분은 집필자 말이 맞다. 현행 제22조 제3항은 "前項限制住居及其解除，應通知債務人及有關機關"이고 입국관리기관을 명시하지 않는다. **그러나 공식 출처는 있다.** 司法院이 집행법원에 내린 「辦理強制執行事件應行注意事項」 제11점(三)은 限制住居에 출국금지가 포함되고, 법원이 이 처분을 할 때 입출국 관리기관에 통지해야 한다고 명시한다. 法務部行政執行署의 이의신청 결정들도 行政執行法 제17조의 限制住居를 같은 방식으로 해석해 출국금지(出境·出海)를 실제로 걸고 있다. 지금 문장대로라면 민사 판결 채무자인 독자는 "민사 집행으로는 출국금지가 확실하지 않다"고 받아들인다. 섹션의 핵심 사실이 틀렸다.
- 근거:
  - https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0010004 (제22조 원문): "債務人有前項各款情形之一，而有事實足認顯有逃匿之虞**或其他必要事由**者，執行法院得依債權人聲請或依職權，限制債務人住居於一定之地域。但債務人已提供相當擔保、限制住居原因消滅或執行完結者，應解除其限制。前項限制住居及其解除，應通知債務人及有關機關。"
  - 司法院 「辦理強制執行事件應行注意事項」 https://law.judicial.gov.tw/FLAW/dat02.aspx?lsid=FL001393 제11점(三): "本法第二十二條第二項之限制住居，包括禁止出境在內。執行法院為此處分時，應通知該管戶政、警察機關限制債務人遷徙，通知入出境管理機關限制其出境，並同時通知債務人。解除其限制時，亦同。"
    (검증 방법: 이 기기에서는 law.judicial.gov.tw 연결이 거부되고, legal.judicial.gov.tw는 curl을 bot-defense로 차단한다. 그래서 (a) legal.judicial.gov.tw를 WebFetch로 열어 해당 항목을 원문 그대로 인용받았고, (b) 6laws.net 사본을 curl로 받아 글자 단위로 대조했다. 두 결과가 같다. 집필자는 링크를 넣기 전에 공식 URL이 열리는지 한 번 더 확인할 것.)
  - 法務部行政執行署 결정(行政執行法 제17조 관련 행정 해석) https://mojlaw.moj.gov.tw/LawContentExtentList.aspx?LSID=FL000565&LawNo=17&ExtentType=e : "所謂限制住居，指限制住居於一定地域而言，包括禁止出境及出海在內（辦理強制執行事件應行注意事項第11點《3》及本署92年12月26日行執一字第0926001040號函釋意旨參照）" / "限制出境，依其性質，係執行限制住居方法之一種"
- 수정안 (해당 문단 전체를 아래로 교체):
  > A creditor holding an enforceable title, such as a final judgment, can trigger a different route. Under [Article 22 of the Compulsory Enforcement Act](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010004&flno=22) (強制執行法), a debtor who plainly could pay but does not, or who is hiding or disposing of assets, can be ordered to provide security or perform by a set date. If there is also good reason to fear flight, or another necessary reason, the enforcement court may restrict the debtor's residence (限制住居). The statute does not say "exit ban", but the Judicial Yuan's [directions to enforcement courts](https://law.judicial.gov.tw/FLAW/dat02.aspx?lsid=FL001393) (point 11(3)) state that restricted residence includes a ban on leaving the country, and that the court must notify the immigration authority when it imposes or lifts one. The court must lift the restriction once you provide adequate security, the reason for it ends, or enforcement is complete. Objections to the enforcement court's order go through Article 12 of the same Act, but filing one does not stop enforcement.
- 行政執行法 문단(같은 섹션)도 맞춰 고칠 것: "The agency may restrict residence in listed situations" → "The Administrative Enforcement Agency (法務部行政執行署) may restrict residence in listed situations, and in its practice that includes an exit ban."
- 링크 수: Judicial Yuan 링크를 더하면 11개가 된다. 10개 이내로 맞추려면 Article 64의 하이퍼링크를 빼고 조문 번호만 남길 것.

---

## P1 (오해 소지·중요 누락) — 3건

### P1-1. 형사 출국금지를 제93-2조만으로 설명함. 제93-6조(신문 뒤 보석 등과 함께 부과) 누락
- 위치: "Where the ban comes from a criminal case, Article 93-2 of the Code of Criminal Procedure is the source."
- 문제: 제93-2조는 "逕行" 즉 **피고인을 먼저 신문하지 않고 바로** 거는 출국금지다. 외국인이 실제로 가장 흔히 겪는 장면은 검찰에 출석해 신문을 받은 뒤 보석(具保)이나 限制住居와 함께 출국금지를 받는 경우다. 근거는 제228조 제4항·제101-2조 + 제93-6조다. 이 경로를 빼면 "경미사건(拘役·罰金만)이면 출국금지가 불가능하다"는 오독도 생긴다. 제93-2조 단서는 '逕行' 부과만 막기 때문이다. 제93-6조 경로에도 제93-3조~제93-5조의 기간·연장·취소 규정이 준용된다.
- 근거 https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=C0010001 :
  - 제93-6조 "依本章以外規定得命具保、責付或限制住居者，亦得命限制出境、出海，並準用第九十三條之二第二項及第九十三條之三至第九十三條之五之規定。"
  - 제228조 제4항 "被告經傳喚、自首或自行到場者，檢察官於訊問後，認有第一百零一條第一項各款或第一百零一條之一第一項各款所定情形之一而無聲請羈押之必要者，得命具保、責付或限制住居。"
  - 제93-2조 제3항 단서 "但於通知前已訊問被告者，應當庭告知，並付與前項之書面。"
- 수정안: 제93-2조 문단 첫 두 문장을 아래로 교체.
  > In a criminal case the ban can arrive in two ways. A prosecutor or judge can impose it directly, even before you have been questioned, under [Article 93-2 of the Code of Criminal Procedure](…93-2) when you are seriously suspected and either have no fixed residence, give good reason to fear flight, or give good reason to fear destruction of evidence or collusion with witnesses. That direct route is not available for offenses punishable at most by short-term detention (拘役) or a fine. A ban can also be added after you are questioned: if the prosecutor or judge releases you on bail or with restricted residence, Article 93-6 allows an exit ban at the same time. Both routes follow the same time limits and remedies.
  
  (주의: "usually/more often" 같은 빈도 표현은 근거가 없으므로 쓰지 말 것. "逕行"을 "even before you have been questioned"로 옮기는 근거는 제93-2조 제3항 구조다. 이 조항은 신문 전 부과를 전제하고, 이미 신문한 경우에만 당정 고지를 요구한다.)
  
  그리고 통지 문장 뒤에 추가: "If you were questioned before the notice was sent, you must be told in the hearing and handed the written decision there."

### P1-2. 입출국법 제31조 제4항 제8호 설명이 틀림(체류 만료 위험)
- 위치: "If you are barred from leaving, your stay does not simply lapse. Article 31, paragraph 4, item 8 allows the NIA to let a foreigner keep a residence permit despite the ban."
- 문제: 제31조 제4항은 **거류 사유가 사라졌을 때**(예: 해고로 취업 거류 사유 소멸) 원래는 거류허가를 폐지해야 하지만, 제21조 제1항에 따라 출국이 금지된 사람은 계속 거류를 허가"할 수 있다"는 규정이다. 출국금지 때문에 허가를 잃는 게 아니다. 출국금지가 계속 거류의 근거가 된다. 또 "your stay does not simply lapse"는 틀린 말이다. 체류·거류 기간은 만료되면 끝나고, 연장은 제31조 제1항에 따라 **만료 전에** 신청해야 한다. 무비자·방문 체류자가 이 문장을 믿으면 오버스테이가 된다(제74-1조 제2항: 1만~5만 대만달러 과태료).
- 근거 https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080132 : 제31조 제1항 "外國人停留或居留期限屆滿前，有繼續停留或居留之必要時，應向移民署申請延期。" / 제4항 "移民署對於外國人於居留期間內，居留原因消失者，廢止其居留許可…但有下列各款情形之一者，得准予繼續居留：…八、依第二十一條第一項規定禁止出國。" / 제74-1조 제2항 "…外國人，逾期停留或居留者，處新臺幣一萬元以上五萬元以下罰鍰。"
- 수정안:
  > A ban does not extend your permission to stay. If you are here as a visitor, apply to the NIA to extend your stay before it runs out (Article 31, paragraph 1). If you hold an ARC and the reason for it ends while you are barred, for example because your employer lets you go, Article 31, paragraph 4, item 8 allows the NIA to let you keep your residence rather than cancel it. Do not let your ARC or visa expire while the matter is open, and do not ask anyone to help you leave anyway: under Article 21-1 no one may help a foreigner under an exit ban leave, and Article 72-1 makes that a crime punishable by one to seven years' imprisonment.

### P1-3. 민사 강제집행 경로에 해제 요건과 불복 방법이 없음
- 위치: "Debts and fines: enforcement offices" 섹션 (형사·조세·행정집행에는 해제와 구제가 있는데 민사 집행에만 없다)
- 문제: 글의 약속은 "누가 걸었는지 찾고 어떻게 푸는지"다. 민사 집행 출국금지에 대해 (1) 제22조 제2항 단서의 필수 해제 사유(상당 담보 제공·사유 소멸·집행 완결)와 (2) 제12조 聲明異議(집행 종료 전, 집행 정지 효과 없음 → 裁定에 抗告)가 빠졌다.
- 근거: 제22조 원문(P0-1 인용), 제12조 "當事人或利害關係人，對於執行法院強制執行之命令…得於強制執行程序終結前，為聲請或聲明異議。但強制執行不因而停止。…不服前項裁定者，得為抗告。"
- 수정안: P0-1 교체 문단의 마지막 두 문장에 이미 반영했다. P0-1 수정안을 그대로 쓰면 이 항목도 해결된다.

---

## P2 (문체·다듬기) — 12건

1. **연구자식 헤지 삭제 (필수)** — "The pages I checked do not say the result will name the authority behind the ban." 근거: NIA 조회 페이지(https://www.immigration.gov.tw/5385/7244/7250/7254/15553/16511/)와 조회 범위 FAQ(https://www.immigration.gov.tw/5382/5385/12162/12191/369486/)에 제한 기관 표시 여부가 나오지 않는 것을 확인했다. 확인할 수 없는 사실이므로 주장하지 말고 변호사 말투로 바꿀 것:
   > Use the check to confirm whether a restriction is on record. To learn who asked for it and why, go back to the written notice and to the authority it names: the prosecutors' office or court for a criminal case, the tax bureau handling your file for tax, the enforcement court or the Administrative Enforcement Agency branch for a debt or fine.

   본문의 1인칭 "I"는 이 문장과 P0-1 문장 두 곳뿐이고, CTA는 "us"를 쓴다. 두 문장을 고치면 목소리가 통일된다.
2. 조회 방법 보충: egate 화면에는 **행동자연인증서(Mobile Citizen Digital Certificate)** 로 조회하는 방법도 있다("Foreign Nationals may use their Mobile Citizen Digital Certificate to check…"). 문장을 "using your UI number, passport number and a Citizen Digital Certificate (card or mobile app)"로 바꿀 것. 선택 사항: 16511 페이지의 "三、通緝中…禁止出國，不在本項目查詢範圍內"는 국민용 안내라서 외국인에게 그대로 적용된다고 단정할 수는 없다. 넣는다면 "a clear result is not a guarantee in every situation" 정도로 쓸 것.
3. 제93-4조 결과 목록 구체화: "acquittal and certain other outcomes" → "acquittal, a suspended sentence, a sentence of a fine only, and certain other outcomes". 원문: "被告受不起訴處分、緩起訴處分，或經諭知無罪、免訴、免刑、緩刑、罰金或易以訓誡…視為撤銷限制出境、出海". 외국인 독자에게 실제 의미가 큰 정보다.
4. FAQ 3이 질문을 피한다. 숫자를 넣을 것:
   > "During an investigation a prosecutor can impose up to eight months, and the court can extend it twice, by four and then two months. At trial each order lasts up to eight months, with a total cap of five years for offenses punishable by up to ten years and ten years for more serious ones. Bring every document you have received so your lawyer can see which stage applies."
5. 조세 보전조치 문장 강화: "the ban is meant to follow a property preservation step" → "the ban cannot be imposed unless the tax office has first taken a preservation step, either barring transfers of your property or obtaining a provisional attachment". 제24조 제3항 단서 "稅捐稽徵機關未實施第一項第一款前段或第二款規定之稅捐保全措施者，不適用之"와 財政部 규범 제2점 "…不得…報財政部函請內政部移民署限制…出境"이 근거다. 이것 자체가 다툴 수 있는 쟁점이다.
6. 財政部 규범의 모호한 표현을 수치로 바꿀 것(https://law-out.mof.gov.tw/LawContent.aspx?id=GL009873 제5점, eTax Q&A 0320 https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/tax-collection-act/collection/xY8r6v2): "frequent trips abroad" = 직전 2년 출국 8회("出境…次數達八次"), "long stay abroad" = 직전 1년 연속 183일("連續達一百八十三天"), "unless the amounts are far higher" = 개인 NT$10 million(미확정 15 million), 영리사업자 NT$20 million(미확정 30 million) 이상("個人欠繳金額達1,000萬元(未確定1,500萬)以上、營利事業欠繳2,000萬元(未確定3,000萬)以上"). 또한 규범 제3점·제5점(一)에 따르면 행정구제 중(미확정) 금액에는 벌금을 넣지 않는다("未確定案件，不計入罰鍰"). 그러니 "NT$1.5 million while an administrative appeal is pending" 뒤에 "(tax only, not fines)"를 붙일 것.
7. 근거 없는 빈도 주장: "This is the ban most often met by foreign managers and business owners." 통계 출처가 없다(BRIEF: 통계를 만들어 쓰지 말 것). → "If you run or direct a company in Taiwan, check this route first."
8. 제93-2조 단서 표현: "It cannot be used on its own where…" → P1-1 수정안의 "That direct route is not available for…"로 대체(P1-1을 반영하면 자동 해결).
9. 행정집행 섹션 보충(선택, 링크 없이): 조세 출국금지(稅捐稽徵法 24)와 행정집행서 출국금지(行政執行法 17)는 별개라서 하나가 풀려도 다른 하나는 남을 수 있다. 근거는 法務部行政執行署 결정(위 mojlaw URL): "二種限制出境規範的案件範圍不同，目的、發動之機關、制度性質、限制出境金額標準、先行程序及解除出境限制條件，均不相同" / "尚不得比附援引，認移送機關已解除其出境之限制，即認行政執行分署亦應解除其出境之限制". 한 문장 제안: "A ban from the Administrative Enforcement Agency is separate from a tax ban, so lifting one does not automatically lift the other."
10. 제25조 예시문 정밀화: "A foreign general manager who resigns before being served may still be affected." 법문은 "法人或非法人團體之負責人、獨資商號之經理人"이고 기준은 "於喪失資格或解任前，具有…限制住居之原因者"이다. 송달 시점이 아니라 **사유가 재직 중에 생겼는지**가 기준이고, 회사에서 누가 "負責人"인지(대표이사·이사 등)는 사안마다 다르다. → "A foreign director or company representative who steps down may still be covered if the grounds arose while they were in office."
11. 공공 지원 문장: 1990 핫라인은 **확인됐다**. NIA 영문 홈(https://www.immigration.gov.tw/5475/): "Foreigners In Taiwan Hotline : Domestic 1990, Overseas 886-800-001990.", 중문 홈: "外來人士在臺生活諮詢服務熱線：國內 1990". 이 회선은 이민 전용이 아니라 생활 상담 회선이다. "for immigration questions" → "for general questions about living in Taiwan". 법률구조: 法律扶助法 제14조 제1항 제1호 "非中華民國國民符合下列情形之一者，本法之扶助規定亦適用之：一、合法居住於中華民國境內之人民。"(https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=A0030157). 이에 맞춰 → "and the Legal Aid Foundation (laf.org.tw) can assist foreign nationals lawfully living in Taiwan who meet its criteria; ask it directly whether you qualify." dossier의 "弱" 표시도 (a)(b) 확인으로 갱신할 것.
12. 형식: 확인일 문장이 CTA 문단 끝에 붙어 있다. 022·023처럼 **별도 마지막 문단**으로 분리할 것.
    > Official sources checked September 29, 2026. What applies to you depends on the authority and the wording of your notice.

### 통합 단계 참고(집필자 수정 대상 아님)
- `src/lib/__tests__/column-summary-frontmatter.test.ts:122`가 `expect(files).toHaveLength(23)`이다. 024를 추가하면 총괄이 이 숫자를 고쳐야 한다.

---

## 형식·윤리 점검 결과 (문제 없음)
- summary 155자(150–160 충족), "..."/"…" 없음. title+" | Hovering Law" = 76자 > 60이므로 seoTitle이 필요하고, seoTitle은 42자(30–45)이며 title과 다르다. 충족.
- frontmatter 필드 순서(title, seoTitle, summary, published, lastmod, date_display, read_time, categories, topic, featured_image, faq)는 BRIEF와 같다. topic "litigation"은 허용값이다.
- 본문 1,588 words(P0·P1 반영 후 약 +200 words 예상, 1,900 이내). 금지어 grep 0건, em dash 0, 굵은 글씨 0, 불릿 0.
- 내부 링크 없음: 관련 EN 칼럼(001–023)이 실제로 없으므로 타당하다.
- CTA는 사무소명, 연락 시 알려줄 정보, 이메일, 주소, 광고책임 변호사 曾雋崴를 모두 갖췄다. 전화번호 없음. 언어는 "Tell us the language you prefer"라서 특정 언어를 약속하지 않는다. 결과 보장·비교 우위 표현 없음. "do not delete messages or files, and do not attempt to leave by another route"는 증거 인멸이나 도주를 막는 방향이라 윤리상 적절하다.

## 검증 대조표(요약)
| 주장 | 결과 |
|---|---|
| 입출국법 21(두 사유·현장 서면 교부), 21-1, 64(외국인 6시간), 6(국민 전용) | 일치 |
| 입출국법 31(4)(8) | 조문은 맞으나 설명 오류 → P1-2 |
| 입출국법 72-1(21-1 위반 1–7년) | 본문 미기재, P1-2 수정안에 반영 |
| 형소법 93-2(요건·서면 5항목·6개월 통지·서면 청구) | 일치(단 신문 시 당정 고지 누락 → P1-1) |
| 형소법 93-3(8월, 20일 전 청구, 4월+2월, 재판 8월·5년/10년, 의견진술) | 일치 |
| 형소법 93-4, 93-5 | 일치(93-4 세부 → P2-3) |
| 형소법 93-6 | 누락 → P1-1 |
| 형소법 404(抗告 대상), 406(10일·송달 후), 409(집행정지 없음), 416(準抗告 10일·처분일/송달일) | 일치 |
| 稅捐稽徵法 24(100만/150만·200만/300만, 負責人, 보전 선행, 서면·송달, 5년, 해제 6사유) | 일치 |
| 財政部 규범 GL009873(보전 선행, 출국빈번 등 요소) + eTax 0320(1,000만/2,000만) | 일치(수치 보강 → P2-6) |
| 訴願法 14(30일) | 일치 |
| 強制執行法 22(限制住居·통지), 25(負責人·퇴임 후) | 조문 일치, "공식 근거 없음" 서술은 오류 → P0-1 |
| 司法院 注意事項 11(3)(限制住居=禁止出境 포함, 입출국기관 통지) | 확인(P0-1 근거) |
| 行政執行法 17(10만 미만 불가·2회 출국 예외), 9(이의·집행 불정지) | 일치 |
| NIA 온라인 조회(統一證號·護照·自然人憑證), 창구·대리·무료·평일 08–17·타인 조회 불가 | 일치(모바일 인증서 추가 → P2-2) |
| NIA 조회 결과의 제한 기관 표시 여부 | 공식 페이지에 없음 → 주장 말고 헤지 제거(P2-1) |
| 1990 Foreigners in Taiwan Hotline | 확인(성격 표현 수정 → P2-11) |
| 法律扶助法 14(합법 거주 외국인) | 확인(P2-11) |

검증한 주장 수: 44 / 공식 출처 재확인 수: 16
(law.moj.gov.tw 조문 원문 7개 법령 — 刑事訴訟法·入出國及移民法·稅捐稽徵法·強制執行法·行政執行法·訴願法·法律扶助法, 本文 링크 7개 flno 확인, 財政部 GL009873, eTax Q&A 0320, NIA 16511·369486·egate 외국인 조회·영문 홈·중문 홈, 司法院 注意事項 FL001393(WebFetch 원문 인용 + 6laws 사본 curl 대조), 法務部 mojlaw 行政執行法 17 해석 목록)
