# 이메일 시퀀스 초안 — 웰컴 · 재참여 (법무법인 호정 / tseng-law.com, 2026-09-17)

> 작성: Claude Fable 5.1. **모든 문안은 "게이트 통과 후 확정"** — 변호사 검수(§7) 전에는 발송·엔진 등록 금지. 법률 자문 아님. 근거: 코퍼스 `이메일-CRM-리퍼럴-라이프사이클-딥리서치-2026-09-03`(법역 표·실무 절차 A~D), `전문직서비스-마케팅-법률-딥리서치-2026-09-03`, `docs/seo/taiwan-lawyer-ad-rules-2026-08-18.md`, 코드 실측(`PRIORITY-MATRIX-2026-09-17.md` S10).
> 문안 원칙: 정보 80 : 안내 20 · 새 법률 문장 0(기게재 페이지 링크로만) · 승소율·결과·의뢰인·진행 중 사건·최고/유일·"무료"·회신시간 약속 **0** · 상담 언어는 한국어·중국어·영어·일본어 4개 고정.

## 0. 발송 가능 조건 (하나라도 미충족이면 시퀀스 보류)

| # | 조건 | 현재(2026-09-17 실측) |
|---|---|---|
| 1 | 발신 도메인 SPF·DKIM·DMARC + Postmaster Tools | **미충족** — 마케팅 발신 도메인 tseng-law.com(결정①)에 MX·SPF·DKIM·DMARC 전부 없음. 거래성(F0) 발신 hoveringlaw.com.tw도 SPF/DKIM/DMARC 없음 |
| 2 | 옵트인 수집 접점(별도 체크박스) 라이브 | **미충족** — 공개 구독 컴포넌트 0건 |
| 3 | 엔진 법정 표시(§3 푸터·제목·헤더) | **미충족** — 푸터 "Hoyering" 오타, 성명·주소·전화·廣告·(광고)·List-Unsubscribe 없음 |
| 4 | 변호사 문안 검수(§7) | **승인 결정(⑤, 2026-09-17)** — 변호사 검수 서명·일자 기록 대기 |
| 5 | 구독자 분모 | **0 / [미측정]** |
| 6 | 3년 보존 로그(사본·일자·대상) | 캠페인 저장소는 있으나 보존 정책 문서 없음 |

거래성 메일(F0 접수 확인·W0 구독 확인)은 1·3·4 충족 시 먼저 가동 가능. 광고성(W1~W3·R1~R3)은 1~6 전부.

## 1. 법역별 게이트 (수신자 로케일·소재지 기준, 보수적 준수선)

| 항목 | 한국(정보통신망법 §50·시행령·별표6) | 일본(特定電子メール法) | 대만(律師推展業務規範) | 미국(CAN-SPAM) | EU/UK(GDPR·PECR 22) |
|---|---|---|---|---|---|
| 동의 | 명시적 사전 동의(옵트인). 예외: 거래 종료 6개월 내 동종 광고만 | 옵트인(사전 동의·명함 등 통지·거래관계) + 동의 기록 보존 | 이메일 업무추진 허용, 특정인 대상=招攬 | 옵트아웃 모델 | 동의 또는 soft opt-in(기존 고객+매 메일 옵트아웃) |
| 제목 | **`(광고)` 로 시작** | — | — | 광고 식별 | — |
| 본문 표시 | 전송자 명칭·이메일·전화·주소 + 수신거부 안내 **한글+영문** | 송신자 氏名/名称 + 수신거부 메일주소/URL | **律師姓名·事務所名稱·地址·電話** + `廣告` 표기(공식 웹사이트만 면제 → 이메일은 표기) | 물리 주소 | 신원·유효 연락처 |
| 옵트아웃 | 즉시 + 14일 내 처리결과 통지 | 즉시 중단 | — | 10영업일 내, 기제 30일 유지 | 언제든 |
| 주기 의무 | **동의 후 2년마다 재확인** | — | 광고 사본·일시·장소 **3년 보존** | — | — |
| 내용 금지 | 결과 예측·최고/유일·무료 염가·의뢰인 표시(변협, 역외 적용 [미확인]→준수) | — | 승소율·顧問對象·委任人·受任中/過去 事件·과대·**省略**(누락) | 기만적 헤더·제목 | — |
| 광고책임변호사 | 성명 표시(변협 3조②) — 준용 | — | 律師姓名(§2③)로 충족 | — | — |

전송 시간: 한국 21~08시 제한은 전자우편 제외(시행령 §61②) — 제약 없음. 발송량: Gmail 스팸률 0.10% 유지·0.30% 도달 회피. 소규모 실패 모드 1위 = "안 보내다 갑자기 보내기".

## 2. 수집 접점 설계 (WO-EM-2)

- 위치 `[결정 필요]`: 칼럼 본문 하단 + 푸터(홈·서비스 제외 — 상담 CTA와 경쟁 금지) / 문의 폼의 **별도 체크박스**(기본 해제, 접수 동의와 분리) / 종결 감사 메일(F2)의 링크.
- 동의 문구(기존 `DEFAULT_MARKETING_CONSENT_TEXT`를 아래로 교체 — 무엇을·얼마나·어떻게 해지를 명시):
  - ko: `법무법인 호정의 대만 법률·제도 안내 뉴스레터(월 1~2회)를 이메일로 받는 것에 동의합니다. 언제든 메일 하단 링크로 수신을 거부할 수 있습니다.`
  - en: `I agree to receive Hovering International Law Firm's newsletter on Taiwan law and procedures (1–2 emails per month). I can unsubscribe at any time via the link in each email.`
  - zh-hant: `我同意收到昊鼎國際法律事務所的台灣法律與制度電子報（每月 1～2 封）。我可隨時透過郵件底部連結取消訂閱。`
  - ja(엔진 지원 후): `昊鼎國際法律事務所の台湾法制度ニュースレター（月1～2回）のメール受信に同意します。各メール下部のリンクからいつでも配信停止できます。`
- 기록: 기존 `buildMarketingConsentRecord`(일시·출처·로케일·IP·UA·문구) 유지 + `consentRenewalDueAt = acceptedAt + 2년`(한국) 필드 추가 `[코드 WO]`.
- 이중 확인(double opt-in, 7일 토큰) 기존 유지. 확인 전 발송 0.

## 3. 공통 규격 (엔진 고정 — template-renderer 교체분)

- From: `법무법인 호정 <newsletter@tseng-law.com>`(결정①; 로케일별 표시명 en `Hovering International Law Firm`, zh-hant `昊鼎國際法律事務所`) · Reply-To: `wei@hoveringlaw.com.tw` — tseng-law.com에 MX가 없어 회신은 기존 사무소 메일함으로 받는다[가정]
- 거래성 메일(F0·F1·F2)은 결정① 범위 밖이라 기존 발신(`forms@hoveringlaw.com.tw`)을 유지한다[가정]. W0(구독 확인)은 마케팅 리스트 절차이므로 tseng-law.com에서 보낸다.
- 제목 규칙: 로케일 ko 수신자 → `(광고) ` 접두 자동. 거래성(W0·F0)은 접두 없음.
- 헤더: `List-Unsubscribe: <https://tseng-law.com/api/marketing/unsubscribe?token=…>`(https만 — tseng-law.com에 수신 메일함이 없으므로 mailto 생략) + `List-Unsubscribe-Post: List-Unsubscribe=One-Click`. (현 unsubscribe 라우트는 GET=확인 페이지·POST=처리 — One-Click POST 호환 확인 `[코드 WO]`)
- 푸터 블록(전 로케일 공통 요소 — 값은 라이브 기게재 사실):

```
ko:
廣告 | 본 메일은 수신 동의하신 분께 법무법인 호정(昊鼎國際法律事務所)이 보냅니다.
변호사 증준외(曾雋崴) · 광고책임변호사: 증준외(曾雋崴)
타이베이 사무소: 103臺北市大同區承德路一段35號7樓之2 · 대표 전화(타이중 사무소): +886-4-2326-1862
이메일: wei@hoveringlaw.com.tw · https://tseng-law.com/ko
수신거부: 아래 링크를 누르시면 즉시 처리되며, 처리 결과를 14일 이내에 알려드립니다. / To unsubscribe, click the link below.
[구독 해지 / Unsubscribe]

en:
Advertisement (廣告) | Sent by Hovering International Law Firm (昊鼎國際法律事務所) to subscribers who opted in.
Attorney Wei Tseng (曾雋崴) · Taipei office: 7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City 103, Taiwan · Main phone (Taichung office): +886-4-2326-1862
wei@hoveringlaw.com.tw · https://tseng-law.com/en
You can unsubscribe at any time: [Unsubscribe]

zh-hant:
廣告 | 本郵件由昊鼎國際法律事務所寄送給已同意訂閱之收件人。
曾雋崴 律師 · 台北所：103臺北市大同區承德路一段35號7樓之2 · 代表電話（台中所）：+886-4-2326-1862
wei@hoveringlaw.com.tw · https://tseng-law.com/zh-hant
如不希望繼續接收：[取消訂閱]
```
- 푸터 영문 주소(`7F-2, No. 35, Sec. 1, Chengde Rd., …`)는 에이전트 번역이다. 발송 전 사무소 공식 영문 표기와 대조한다.
- 대표 전화는 타이중 사무소 번호임을 모든 로케일에서 명기한다(타이베이 주소 옆 무표기 병기 = 오인 표시 위험, 대만 規範 §4).
- 링크: 전부 UTM(`utm_source=newsletter&utm_medium=email&utm_campaign=<seq>-<n>`), 엔진의 서명 트래킹 리다이렉트 유지. 상담 CTA 링크는 `/ko/contact`(이메일 상담 신청).
- 보존: 발송 시 렌더 HTML 사본·발송일시·수신 대상 수·세그먼트를 `campaign-storage`에 불변 저장, 3년 유지 `[코드 WO]`.
- 발송 페이스: 신규 발신 주소는 첫 주 수십 통/일에서 시작. 시퀀스는 트리거형(1:1)이라 대량 발송 없음. 재참여(R)는 1일 `[저자 설계값 30통]` 상한.

## 4. 시퀀스 A — 웰컴 (트리거: double opt-in 확인 완료)

타이밍은 `[저자 설계값]`: W0 즉시 · W1 D+1 · W2 D+4 · W3 D+8. 이후 월 1~2회 정기호(별도).

### W0 — 구독 확인 완료 (거래성 · `(광고)` 없음) — 기존 double opt-in 메일 문안 교체

**ko** 제목: `구독이 확인되었습니다 — 법무법인 호정 대만 법률 안내`
프리헤더: `앞으로 받으실 내용과 수신 거부 방법을 안내드립니다.`
본문:
```
안녕하세요. 법무법인 호정(昊鼎國際法律事務所)입니다.
대만 법률·제도 안내 뉴스레터 구독이 확인되었습니다.

앞으로 받으실 내용
- 대만 회사설립·계약·노무·소송 등 절차와 제도 변경 해설 (월 1~2회)
- 사무소 소식과 상담 안내

받고 싶지 않으시면 모든 메일 하단의 [구독 해지] 링크로 언제든 수신을 거부하실 수 있습니다.
궁금한 점은 이 메일에 회신하시면 됩니다.

법무법인 호정 · 변호사 증준외(曾雋崴)
```
**en** 제목: `Your subscription is confirmed — Hovering International Law Firm`
프리헤더: `What you'll receive, and how to unsubscribe.`
본문:
```
Hello, this is Hovering International Law Firm (昊鼎國際法律事務所).
Your subscription to our newsletter on Taiwan law and procedures is confirmed.

What you'll receive
- Explanations of procedures and legal changes in Taiwan: company setup, contracts, employment, disputes (1–2 emails per month)
- Firm news and consultation information

You can unsubscribe at any time using the link at the bottom of every email.
Questions? Just reply to this email.

Hovering International Law Firm · Attorney Wei Tseng (曾雋崴)
```
**zh-hant** 제목: `已確認訂閱 — 昊鼎國際法律事務所 台灣法律資訊`
본문(요지): 訂閱已確認 · 內容（每月 1～2 封：公司設立、契約、勞動、訴訟等程序與制度變更說明；事務所消息）· 隨時可由郵件底部連結取消訂閱 · 回覆本郵件即可提問 · 曾雋崴 律師
**ja**(엔진 지원 후) 제목: `ご登録が完了しました — 昊鼎國際法律事務所 台湾法務ニュースレター`

### W1 (D+1) — "무엇을 도와드릴 수 있는지" (광고성)

근거: 리퍼럴·방문자 탈락 1위 원인 "어떻게 도울 수 있는지 이해하지 못함" 43.6%(Hinge 2015, 단일 벤더 [추정]).
**ko** 제목: `(광고) 대만에서 한국어로 변호사와 직접 이야기할 수 있는 일들`
프리헤더: `회사설립부터 소송까지, 어떤 상황에서 저희를 찾으시는지 정리했습니다.`
본문:
```
안녕하세요. 법무법인 호정 변호사 증준외입니다.
첫 메일에서는 저희가 어떤 일을 하는지, 어떤 상황에서 상담을 시작하시는지 짧게 정리해 드립니다.

이런 상황에서 상담을 시작하십니다
- 대만에 법인·지사·개인사업자를 세우려는데 절차와 서류가 막막할 때 → 회사설립 안내: https://tseng-law.com/ko/guides/taiwan-company-setup
- 대만 거래처와 계약·미수금·품질 분쟁이 생겼을 때 → 소송·분쟁: https://tseng-law.com/ko/taiwan-litigation-lawyer
- 대만 직원 채용·해고·퇴직금 문제 → 노무: https://tseng-law.com/ko/services/labor
- 대만 거주 중 가족·상속·교통사고 문제 → 가사·민사: https://tseng-law.com/ko/services/family

저희가 다른 점
- 대만 변호사가 한국어·일본어·영어·중국어로 직접 상담합니다.
- 타이베이·타이중·가오슝·핑둥 네 곳 사무소에서 대면 또는 화상으로 진행합니다.

상담 방식과 비용은 안내 페이지에 그대로 적혀 있습니다: https://tseng-law.com/ko/pricing
다음 메일에서는 가장 자주 받는 질문 세 가지를 정리해 드리겠습니다.
```
**en** 제목: `What we can help you with in Taiwan — in English`
프리헤더: `From company setup to disputes: when people usually start a consultation.`
본문:
```
Hello, I'm Wei Tseng, attorney at Hovering International Law Firm.
In this first email I'll briefly explain what we do and when clients typically reach out.

Typical starting points
- You're setting up a company, branch or sole proprietorship in Taiwan and the paperwork is unclear → Company setup guide: https://tseng-law.com/en/guides/taiwan-company-setup
- A contract, unpaid invoice or quality dispute with a Taiwanese counterparty → Litigation & disputes: https://tseng-law.com/en/taiwan-litigation-lawyer
- Hiring, dismissal or severance questions for staff in Taiwan → Employment: https://tseng-law.com/en/services/labor
- Family, inheritance or traffic-accident matters while living in Taiwan → https://tseng-law.com/en/services/family

What's different
- A Taiwan-qualified attorney consults directly in English, Japanese, Korean and Mandarin.
- Four offices (Taipei, Taichung, Kaohsiung, Pingtung); in person or by video call.

Consultation format and fees are listed as-is on our pricing page: https://tseng-law.com/en/pricing
Next time: the three questions we're asked most often.
```
**zh-hant** 제목: `廣告｜在台灣，您可以直接與律師討論的事`
본문(요지): 常見諮詢起點 4항(公司設立指南 /zh-hant/guides/taiwan-company-setup · 訴訟與爭議 · 勞動 · 家事) · 差異點(律師直接以中·英·日·韓文諮詢；四所) · 費用依定價頁 · 下封預告
**ja** 제목(엔진 지원 후): `広告｜台湾で日本語のまま弁護士に相談できること`

### W2 (D+4) — 가장 자주 받는 질문 3가지 (광고성 · 정보 중심)

핵심 사실은 **기게재 페이지 링크로만** 전달. 본문에 새 수치·기한을 쓰지 않는다(변호사 검수에서 추가 가능).
**ko** 제목: `(광고) 대만 회사설립, 가장 자주 받는 질문 3가지`
프리헤더: `형태 선택, 절차와 서류, 설립 후 첫 달에 해야 할 일`
본문:
```
안녕하세요. 법무법인 호정입니다.
상담에서 가장 자주 나오는 질문 세 가지를 골라, 답이 정리된 페이지로 안내드립니다.

1. 유한공사·주식회사·지사·개인사업자 중 무엇으로 시작해야 하나요?
   → 자회사 vs 지사 비교: https://tseng-law.com/ko/columns/taiwan-company-subsidiary-vs-branch
2. 설립 절차는 어떤 순서이고 서류는 무엇이 필요한가요?
   → 회사설립 기본: https://tseng-law.com/ko/columns/taiwan-company-establishment-basics
   → 종합 가이드: https://tseng-law.com/ko/guides/taiwan-company-setup
3. 설립 뒤 첫 달에 놓치기 쉬운 것은 무엇인가요?
   → 자본금 인출 절차: https://tseng-law.com/ko/columns/withdraw-capital-taiwan-company
   → 세무·회계는 파트너와 함께 지원합니다(변호사가 직접 기장하지 않습니다).

여기에 없는 질문이 있으면 이 메일에 회신해 주세요. 다음 메일에서는 상담이 어떻게 진행되는지 안내드립니다.
```
**en** 제목: `Taiwan company setup: the 3 questions we hear most`
본문(구조 동일, 링크는 /en/columns/… 동일 슬러그, /en/guides/taiwan-company-setup) — 세무·회계는 "supported together with our accounting partner; the attorney does not do bookkeeping".
**zh-hant** 제목: `廣告｜台灣公司設立，最常被問到的三個問題` — 링크 /zh-hant/… 동일 슬러그.
**ja** 제목(엔진 지원 후): `広告｜台湾会社設立、よくある質問3つ`

### W3 (D+8) — 상담은 이렇게 진행됩니다 (광고성 · CTA)

**ko** 제목: `(광고) 상담은 이렇게 진행됩니다 — 준비하시면 좋은 자료`
프리헤더: `이메일로 접수 → 사건 유형 확인 → 대면 또는 화상 상담`
본문:
```
안녕하세요. 법무법인 호정입니다.
상담을 생각하고 계신 분을 위해 진행 방식과 준비물을 정리했습니다.

진행 흐름
1) 이메일로 문의를 접수합니다: https://tseng-law.com/ko/contact
2) 사건 유형과 긴급도를 먼저 확인하고, 필요한 경우 추가 자료를 요청드립니다.
3) 타이베이 대면 상담 또는 Zoom·Google Meet 화상 상담으로 진행합니다. (한국어·중국어·영어·일본어)

미리 준비하시면 좋은 자료
- 계약서, 견적서, 공문, 이메일·메신저 대화 등 핵심 문서
- 회사명 또는 당사자 정보, 사건 발생일, 현재 진행 상태
- 사진, 영상, 판결문, 신고서 등 사실관계 자료

비용
- 일반 법률상담 NT$3,000(대면·화상). 사건 진행 비용은 상담 후 서면 견적으로 안내드립니다. 자세한 기준: https://tseng-law.com/ko/pricing

상담 신청: https://tseng-law.com/ko/contact
```
**en** 제목: `How a consultation works — and what to prepare`
본문(동일 구조; 진행 흐름·준비 자료·비용 "General legal consultation NT$3,000 (in person or video); case fees are quoted in writing after the consultation" · CTA /en/contact)
**zh-hant** 제목: `廣告｜諮詢如何進行、建議準備的資料` — 費用 NT$3,000 · CTA /zh-hant/contact
**ja** 제목(엔진 지원 후): `広告｜ご相談の流れと、ご用意いただきたい資料`

## 5. 시퀀스 B — 재참여

두 대상을 **분리**한다. 뉴스레터 동의가 없는 과거 문의자·의뢰인에게 광고성 메일은 보내지 않는다(한국 §50 예외는 "거래 종료 6개월 내 동종 광고"뿐 — 문의만 한 사람은 예외 아님 [코퍼스 결론 2·6, 적용은 논증 추정]).

### B-1. 휴면 구독자 (status=subscribed · 최근 90일 오픈·클릭 0 `[저자 설계값]`) — 재확인형, 소배치(1일 30통 상한)

**R1 (D0) — 계속 받으시겠어요?** (광고성; 한국 2년 재확인 의무 겸용 — 동의일+22개월 도래자는 무조건 대상)
ko 제목: `(광고) 법무법인 호정 뉴스레터, 계속 받으시겠어요?`
프리헤더: `한 번만 눌러 주시면 됩니다. 응답이 없으면 발송을 멈춥니다.`
본문:
```
안녕하세요. 법무법인 호정입니다.
한동안 메일을 열어보지 않으신 것 같아, 계속 받으실지 여쭙습니다.

[계속 받기]   [구독 해지]

응답이 없으시면 2주 뒤부터 발송을 멈추겠습니다. 언제든 https://tseng-law.com/ko 에서 다시 구독하실 수 있습니다.
```
en 제목: `Would you like to keep receiving our Taiwan law updates?` / 본문: 동일 구조 [Keep receiving] [Unsubscribe] · "If we don't hear from you, we'll stop sending in two weeks."
zh-hant 제목: `廣告｜是否繼續接收昊鼎國際法律事務所的電子報？` / [繼續接收] [取消訂閱]
※ [계속 받기] = 동의 갱신 엔드포인트(`consentRenewedAt` 기록) `[코드 WO]`.

**R2 (D+7, R1 무응답자만) — 최근 변경 1편** (광고성; 내용은 제도·절차 해설 1건만, 사례·후기 0)
ko 제목: `(광고) 최근 바뀐 대만 제도 한 가지 — 그리고 마지막 확인`
본문 골격:
```
안녕하세요. 법무법인 호정입니다.
지난 메일에 응답이 없으셔서 한 번 더 인사드립니다.

이번 달 해설: [변호사 지정 — 기게재 칼럼 1편 제목 + 링크]
(예: 대만 의무 근속기간 약정 — https://tseng-law.com/ko/columns/taiwan-mandatory-employment-period)

계속 받으시려면 [계속 받기]를, 아니면 [구독 해지]를 눌러 주세요. 응답이 없으면 다음 메일이 마지막입니다.
```
en/zh-hant: 동일 골격, 칼럼 링크 로케일별.

**R3 (D+14, 여전히 무응답) — 발송 중단 안내** (광고성 최소; 사실상 종료 통지)
ko 제목: `(광고) 오늘 이후 뉴스레터 발송을 멈춥니다`
본문:
```
안녕하세요. 법무법인 호정입니다.
응답이 없으셔서 오늘 이후 뉴스레터 발송을 멈춥니다. 다시 받고 싶으시면 언제든 https://tseng-law.com/ko 에서 구독해 주세요.
상담이 필요하실 때는 wei@hoveringlaw.com.tw 로 연락 주시면 됩니다.
```
처리: R3 후 7일 내 반응 없으면 status를 `unsubscribed`(사유 `inactive-90d`)로 전환, 재구독은 double opt-in부터. (Egan: 3~6개월 미반응 주소 제거 [추정])

### B-2. 과거 문의자·의뢰인 (뉴스레터 동의 없음) — 거래성·서비스 관련만

**F0 — 문의 접수 확인** (트리거: 폼·AI 인테이크 제출 즉시 · 거래성 · WO-EM-1) — 현재 **존재하지 않음**(사무소로만 통지)
ko 제목: `[법무법인 호정] 문의가 접수되었습니다 (접수번호 {{intakeId}})`
본문:
```
안녕하세요. 법무법인 호정(昊鼎國際法律事務所)입니다.
보내주신 문의가 접수되었습니다. 내용을 확인한 뒤 이 이메일 주소로 회신드리겠습니다.

접수 내용 요약
- 접수번호: {{intakeId}}
- 상담 언어: {{preferredLanguage}}
- 문의 유형: {{category}}

회신을 더 빨리 준비하려면 아래 자료를 미리 준비해 주시면 도움이 됩니다.
- 계약서·견적서·공문·메신저 대화 등 핵심 문서
- 당사자 정보, 사건 발생일, 현재 진행 상태

문의 내용은 상담 접수 목적으로만 처리됩니다. 급한 사안은 이 메일에 회신해 알려 주세요.

법무법인 호정 · 변호사 증준외(曾雋崴)
타이베이 사무소: 103臺北市大同區承德路一段35號7樓之2 · 대표 전화(타이중 사무소): +886-4-2326-1862 · wei@hoveringlaw.com.tw
```
en 제목: `[Hovering International Law Firm] We received your inquiry (ref. {{intakeId}})` — 동일 구조. "We'll review it and reply to this email address." (회신 시한 문구 없음)
zh-hant 제목: `【昊鼎國際法律事務所】已收到您的諮詢（編號 {{intakeId}}）`
ja 제목: `【昊鼎國際法律事務所】お問い合わせを受け付けました（受付番号 {{intakeId}}）`
금지: 서비스 홍보·가격·"무료"·회신 시한. 광고 요소 0 → 거래성 유지(CAN-SPAM 예외·한국 (광고) 불요·일본 付随的 광고 불요).

**F1 (D+3, 사무소 회신 후 문의자 무응답 시 · 거래성 · 수동 발송 권장)** — 추가 자료 안내
ko 제목: `[법무법인 호정] 보내드린 회신 확인 부탁드립니다 (접수번호 {{intakeId}})`
본문: "지난 {{repliedDate}} 회신드린 내용을 확인하셨는지 여쭙니다. 추가로 필요한 자료나 일정이 있으면 이 메일에 회신해 주세요." — 1회만. 이후 발송 없음.

**F2 (사건 종결 시 · 거래성 + 동의 수집 접점)** — 감사 + 뉴스레터 **별도 동의** 링크 (리뷰 요청은 변호사 판단 후 — 무대가·전원 동일·게이팅 금지)
ko 제목: `[법무법인 호정] 사건 종결 안내와 감사 인사`
본문 골격:
```
{{clientName}} 님, 맡겨주신 사건이 종결되었습니다. 진행 과정에 협조해 주셔서 감사합니다.
관련 서류 보관과 이후 연락 창구: [담당자·이메일]

(선택) 대만 법률·제도 안내 뉴스레터(월 1~2회)를 받고 싶으시면 아래에서 동의해 주세요. 동의하지 않으셔도 사건 처리와 무관합니다.
[뉴스레터 받기 — 동의 페이지 링크]
```
※ F2에 광고성 문장을 섞지 않는다(동의 링크 안내만). 한국 §50 6개월 예외를 쓰는 동종 서비스 안내(F3)는 **변호사 판단 후 옵션** — 기본 보류.

## 6. 측정 · 판정

| 지표 | 정의 | 소스 | 주기 | 지지 | 반증 |
|---|---|---|---|---|---|
| 구독 완료 | verify 성공 수 | admin subscribers | 주간 | 접점 배포 8주 ≥10(이진) | 0 → 접점 위치·문구 교체 |
| 스팸 신고율 | Postmaster | 주간 | — | <0.10% | ≥0.30% 즉시 중단 |
| 수신거부율 | unsubscribed/발송 | 엔진 stats | 캠페인별 | <`[저자 설계값 2%]` | 주간 5% 초과 → 시퀀스 재검토 |
| 클릭→상담 | W3 CTA 클릭 · 원장 "뉴스레터" 경로 문의 | 엔진 click + 원장 | 주간 | 12주 문의 ≥1(이진) | 구독 ≥10인데 문의 0 → 내용 재설계 |
| R1 응답률 | 계속받기+해지 / 발송 | 엔진 | 배치별 | 방향만 | — |
| F0 도달 | 테스트 문의 수신함 실물 | 수동 | 배포 시 1회 + 월 1 | PASS | 스팸함 → T0 재점검 |

오픈률은 보조 지표(이미지 프록시로 왜곡)이며 판정에 쓰지 않는다. 소분모에서는 이진 지표만.

## 7. 발송 전 체크리스트 (게이트 — 전 항목 PASS 후 엔진 등록)

- [ ] SPF·DKIM·DMARC PASS 캡처(메일 원본) · Postmaster 등록
- [ ] 발신 도메인 tseng-law.com(결정①) 발송 서비스 연결 · From `newsletter@tseng-law.com` / Reply-To `wei@hoveringlaw.com.tw` 실제 발송 헤더 확인 · 신규 발신 도메인 워밍 계획
- [ ] ko 제목 `(광고)` 접두(광고성만) · 거래성(W0·F0·F1·F2)에는 없음
- [ ] 푸터: 律師姓名·事務所名稱·地址·電話·`廣告`·수신거부(한·영)·광고책임변호사 — 4언어 렌더 스냅샷
- [ ] List-Unsubscribe / One-Click POST 동작 확인
- [ ] 카피 전수 grep: 승소율·보장·결과·최고·유일·1위·무료·사건명·의뢰인·"24시간"·"영업일 내" = 0건
- [ ] 새 법률 문장 0 — 링크 대상 페이지가 라이브·검수 완료인지 확인
- [ ] 세무·회계 표현은 "지원·파트너"만
- [ ] 변호사 검수 서명·일자
- [ ] 발송 사본·일시·대상 수 보존(3년) 경로 확인
- [ ] 동의 기록(일시·출처·문구·IP) 존재 · 2년 재확인 스케줄 등록(한국)
- [ ] 소배치 상한(재참여 30통/일) · 테스트 발송 1통(자기 주소) 실물 확인

## 8. 미확인 · 결정 대기

- ~~발신 주소(①)·대표 전화(②)·광고책임변호사(③)~~ → 2026-09-17 확정·반영. 남은 것: 발송 서비스 선택·비용, 푸터 영문 주소의 공식 표기 대조
- 구독자·CRM 연락처 분모(admin 미열람)
- 대만 이메일 `廣告` 표기 위치의 실무 관행(조문은 "明顯處"), 일본 省令 세부, 한국 변협 규정 역외 적용
- 캠페인 엔진 ja 로케일 지원 시점(현재 ja→en 폴백)
- F2 리뷰 요청 문구·F3(6개월 예외 안내) 사용 여부 — 변호사 판단
