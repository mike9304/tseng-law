# Batch003 독립 문체 검수 R1

검수일: 2026-10-03. 검수자: editorial_inventory. 원고·evidence·저장소 파일을 수정하지 않았으며 이 검토서만 작성했다.

## 판정과 범위

7편 모두 전문을 읽었다. 독자와 핵심 쟁점은 구별되며 단순 번역 묶음이 아니다. 아래 13개 문구를 수정한 뒤 동결 SHA로 재검수할 때까지 REQUEST_CHANGES다. 법률 주장·기간·출처를 새로 검증한 승인, 이미지 실물 검수, 빌드·배포 승인은 아니다.

적용 기준은 현재 저장소의 `docs/columns/EDITORIAL-VOICE.md`, `FRAUD-EDITORIAL-POLICY.md`, batch003 `TOPIC-BRIEFS.md`·`WRITER-WORKORDER.md`와 실제 20260917 DOCX 표본이다. DOCX는 이 연속 작업에서 OOXML 본문을 직접 읽었으며 SHA-256은 `bc5721bdb532ef883986b9caf40c0ebefd0ed78dd7576048d3189483548ffd5d`다. 구체적인 당사자·역할·판단 조건을 먼저 설명하는 방식을 기준으로 삼았다. 이를 신규 원고의 변호사 집필·감수 증거로 삼지 않았다.

| 검수한 원고 | R1 판정 | 원고 SHA-256 | evidence SHA-256 |
|---|---|---|---|
| `en-parcel-pickup-job-scam-bank-cards-taiwan.md` | REQUEST_CHANGES | `802ebb91ffbb2fb6828ce6dc71c71c1f06bfb39d7a8aefa11b0a2eba4f57e900` | `e424ef9f62488a2fc95ddcc0de20b5fea9921e49c1f6f50dfd2dbddaaa96926f` |
| `ja-taiwan-issued-card-unauthorized-charge-dispute-japanese.md` | REQUEST_CHANGES | `7478efaafcccf7c43f078568653d9780c11ee544c04edab8f824c78e37746cf8` | `f8d1bc0e7612613b68ede0b86baae336de8258149371e7be128c97a897fefe95` |
| `ko-taiwan-secondhand-seller-payment-verification-scam-korean.md` | REQUEST_CHANGES | `11e9d7b91d3c37441d783d46c25d5a9c9f3a6c3a6d4ab0d2d8dca2585b6a28b0` | `00e188e8be2f09a523b09f0f6eded15e63fd3dc36f96782dd83fa8a7b9b0ed28` |
| `zh-hant-fake-customer-service-cancel-installment-atm-taiwan.md` | REQUEST_CHANGES | `8133ca391b23fac3c26a5f6d8a5487953448ee6ce560bd972fbd6a34b1d0f736` | `53976b5d0e90f61fb7a709658d06c6418896fb79ade7ebd1a2a8a7ca51857eff` |
| `zh-hant-gym-closure-prepaid-installments-taiwan.md` | REQUEST_CHANGES | `059ecba37be82e07255330d9f33c16852e915f179ccb2426f0c78e17c1116000` | `9ddda5b1eadc7aacc427300420d6d5aff7ce0c392ec02f6f21fb34f06981ff0a` |
| `zh-hant-job-scam-payroll-account-atm-card-taiwan.md` | REQUEST_CHANGES | `ebe8660cfeca113d856db1219bc46ec119e00879c22d6209291851e8fc5b7675` | `18493d83f4c975a59b73022a294631a866102554a31555353e28416ac3bf6a1f` |
| `zh-hant-promissory-note-enforcement-undisbursed-loan-taiwan.md` | REQUEST_CHANGES | `3bec7c2b98a2484287db0103b8119c9b7fa290420b3ab19bc102da717f3fff33` | `9ddffa76502b618787de514f6f24df8cbce8c8656cfe04d209c90763e342f8b9` |

행 번호는 위 SHA의 원고 기준이다. 작성자가 이후 수정하면 번호보다 아래 인용문을 함께 사용한다.

## MUST 수정

### V01 — EN summary의 전개 예고

파일: `en-parcel-pickup-job-scam-bank-cards-taiwan.md:5`

- 원문: `A paid parcel-pickup job can involve other people's bank cards. What to check before accepting, how intent matters, and what to preserve if you already collected a package.`
- 문제: 둘째 문장은 글에서 다룰 세 가지를 예고하는 문장 조각이다. 메타 요약에도 적용되는 전개 예고 금지 기준에 맞지 않는다.
- 수정안: `A paid parcel-pickup job can involve other people's bank cards. Original job instructions, messages and delivery records can help establish what you knew and did.`
- 보존 의미: 타인 카드 운반 위험과 당시 인식·행동을 확인하는 자료의 역할을 남긴다. 자동 유죄·면책이나 기록의 확정적 증명력을 추가하지 않는다.

### V02 — JA 접수 범위를 확인하는 직접 표현

파일: `ja-taiwan-issued-card-unauthorized-charge-dispute-japanese.md:25`

- 원문: `停止の連絡だけで、既に発生した請求の調査まで受け付けられたと思い込まず、受付内容と番号を残します。`
- 문제: 독자가 이미 착각했다고 전제하는 `思い込まず`가 불필요하다. 실제로 확인할 접수 범위를 설명하면 충분하다.
- 수정안: `利用停止と併せて、どの請求の調査が受け付けられたのかを確認し、受付内容と番号を残します。`
- 보존 의미: 카드 정지와 기존 청구 조사 접수가 구별된다는 점, 접수 내용·번호 보존을 유지한다. 별도 접수번호 두 개가 반드시 필요하다고 추가하지 않는다.

### V03 — KO 문의에 금융 비밀정보를 넣지 않는다는 안내

파일: `ko-taiwan-secondhand-seller-payment-verification-scam-korean.md:45`

- 원문: `은행 비밀번호나 현재 사용 가능한 인증번호를 문의 내용에 넣을 필요는 없습니다.`
- 문제: ‘필요는 없다’는 선택적으로 넣어도 된다고 읽힐 여지가 있다. 판매글·주문번호·링크·오류 화면과 비밀번호·유효 인증번호를 구별해야 한다.
- 수정안: `문의에는 은행 비밀번호나 현재 사용 가능한 인증번호를 넣지 않습니다.`
- 보존 의미와 강도: 공개할 문의 자료의 범위를 명확히 한다. ‘불필요’에서 ‘포함하지 않음’으로 보안 안내 강도가 바뀌는 제안이다. 법적 의무·책임 요건을 변경하는 제안은 아니다. 앞 문장의 판매글·주문번호·주소·오류 화면은 유지한다.

### V04 — ZH 구직 summary의 글 소개 제거

파일: `zh-hant-job-scam-payroll-account-atm-card-taiwan.md:4`

- 원문 둘째 문장: `說明求職時的帳戶要求、洗錢防制法第22條的例外及處罰條件，以及卡片已寄出後應保存的資料。`
- 문제: 독자에게 필요한 사실 대신 이 글의 목차를 설명한다.
- 수정안(둘째 문장 교체): `洗錢防制法第22條設有例外與不同處罰條件；卡片已寄出時，應向銀行說明交出的資料，並保留求職與寄件紀錄。`
- 보존 의미: 제22조 예외·처벌 조건, 이미 카드를 발송한 경우의 은행 설명·자료 보존이라는 기존 본문 범위를 유지한다. 첫 문장은 그대로 둔다.

### V05 — ZH 구직에서 이미 구별한 동작을 다시 꾸짖는 문장

파일: `zh-hant-job-scam-payroll-account-atm-card-taiwan.md:27`

- 원문: `不要把這些不同動作都包在「辦理薪轉」四個字裡。`
- 문제: 앞 문장의 구체적인 계좌정보·카드·비밀번호·설정변경·재송금 질문만으로 필요한 차이가 전달된다. 마지막 문장은 새 조건 없이 독자의 사고방식을 꾸짖는다.
- 수정안: 이 문장만 삭제한다.
- 보존 의미: 같은 문단의 실제 확인 대상과 다음 문단의 계좌 통제권 설명을 모두 유지한다. 법적 판단 요소 손실이 없다.

### V06 — ZH 가짜客服의 화면 공유 동기 추정

파일: `zh-hant-fake-customer-service-cancel-installment-atm-taiwan.md:39`

- 원문: `對方要求分享畫面時，不能只看他說「這是驗證」，還要看畫面實際顯示什麼。若正在產生付款或提款資訊，就先停止，不要為了證明自己配合了退款程序，再將完整畫面傳給接洽者。`
- 문제: ‘환불 절차에 협조했음을 증명하려고’라는 동기를 독자에게 부여할 필요가 없다. 실제 화면 용도와 전송 중단만 직접 설명한다.
- 수정안: `對方要求分享畫面時，即使對方說是在驗證，仍應核對畫面實際顯示什麼。若正在產生付款或提款資訊，就先停止操作，也不要將完整畫面傳給接洽者。`
- 보존 의미: 상대방의 설명보다 실제 결제·인출 정보의 기능을 확인하고, 해당 상황에서 조작·화면 전달을 중단한다는 조건을 유지한다.

### V07 — ZH 가짜客服의 은행 설명 도입

파일: `zh-hant-fake-customer-service-cancel-installment-atm-taiwan.md:51`

- 원문 시작: `聯絡銀行時，不要只說「我被騙取消分期」。可以依自己實際做過的動作說明：`
- 문제: 불충분하게 말하는 독자를 먼저 설정한 다음 같은 지시를 반복한다.
- 수정안(도입부만): `聯絡銀行時，可依自己實際做過的動作說明：`
- 보존 의미: 콜론 뒤의 카드번호·효력기간·OTP·통지·ATM/인터넷뱅킹·결제코드/무카드 인출 목록은 전부 보존한다.

### V08 — ZH 가짜客服에서 은행 연락 후 기록 삭제를 가정

파일: `zh-hant-fake-customer-service-cancel-installment-atm-taiwan.md:55`

- 원문: `不要因為已向銀行反映，就把電話、訊息或交易紀錄刪除。`
- 문제: 은행에 연락했으니 기록을 삭제할 것이라는 불필요한 전제가 들어간다.
- 수정안: `向銀行反映後，仍應保存電話、訊息及交易紀錄，供後續報案與查詢使用。`
- 보존 의미: 은행 연락과 별개로 연락·거래 자료를 계속 보존하는 행동, 뒤의 신고·조회에서 쓸 자료라는 목적을 유지한다.

### V09 — ZH 가짜客服 말미의 재차 훈계

파일: `zh-hant-fake-customer-service-cancel-installment-atm-taiwan.md:63`

- 원문 마지막 절: `後續需要討論時，這些紀錄比單純轉述「客服叫我按的」更能呈現爭點。`
- 문제: 앞 문장에서 이미 구체적인 설명·답변 보존을 제시했다. 독자의 짧은 해명을 비교 대상으로 다시 낮춰 말할 필요가 없다.
- 수정안: `這些紀錄可供後續核對授權與通報經過。`
- 보존 의미: OTP 입력만으로 환급 여부를 단정하지 않는 첫 문장과 실제 지시·화면·발견/통보 시점·은행 답변은 유지한다. 결말은 기록의 구체적인 용도로 끝낸다.

### V10 — ZH 헬스장 글의 ‘모두 0원으로 만든다’는 독자 전제

파일: `zh-hant-gym-closure-prepaid-installments-taiwan.md:41`

- 원문 마지막 절: `不能只截取其中一句，就把已用服務、已繳費用及未償餘額全部歸零。`
- 문제: 독자가 규정 한 문장을 떼어 이미 쓴 서비스·납부금·잔액을 전부 0으로 처리하려 한다는 과장된 전제다.
- 수정안: `結算時仍須分別核對已提供的服務、已繳費用及未償餘額。`
- 보존 의미: 앞 문장의 서비스계약·소비대차 종료/해제, 소비자 귀책 시 이미 제공된 서비스의 분할금 조건을 전부 남기고 정산 대상 구별을 유지한다.

### V11 — ZH 본표의 송달일 확인

파일: `zh-hant-promissory-note-enforcement-undisbursed-loan-taiwan.md:29`

- 원문 해당 절: `不能從裁定印出的日期開始猜`
- 문제: `猜`는 독자의 기간 계산을 비하하는 말로 읽힐 수 있다. 무엇이 기산점 자료를 대신할 수 없는지 쓰면 된다.
- 수정안(해당 절만): `裁定上印出的日期不能代替送達日期`
- 보존 의미: 10일 불변기간, 송달·기간 계산 확인, 은행 자료를 모두 기다리지 않는 후속 문구는 그대로 둔다.

### V12 — ZH 본표에서 허위 주장 동기를 독자에게 부여

파일: `zh-hant-promissory-note-enforcement-undisbursed-loan-taiwan.md:51`

- 원문 첫 문장: `若確實是自己簽票，爭執的是借款沒有交付，不能僅為了套用這個20日規定，就把未交付款項寫成簽名偽造。`
- 문제: 독자가 20일 규정을 이용하려고 미교부를 서명 위조로 바꿔 쓸 것이라는 의도를 가정한다.
- 수정안: `若確實是自己簽票，爭執的是借款沒有交付，應區分未交付款項與本票偽造、變造兩種主張。`
- 보존 의미: 자기 서명·미교부라는 독자 상황과 미교부/위조·변조의 구별을 남긴다. 같은 문단 둘째 문장의 제1항 불충족 전제와 제3항 담보·집행정지 조건을 유지한다.
- 법률 reviewer 확인 표시: 이 문장은 절차 구분을 직접 표현하므로, 수정 후에도 제1항과 제3항의 적용 범위를 넓히거나 좁히지 않았는지 법률 담당이 함께 확인해야 한다. 문체 검수로 그 법률 승인을 대신하지 않는다.

### V13 — ZH 본표의 작성자 대상처럼 읽히는 지시

파일: `zh-hant-promissory-note-enforcement-undisbursed-loan-taiwan.md:53`

- 원문 마지막 문장: `也不能反過來把第1項的20日，寫成所有本票債權不存在之訴共同的起訴期限。`
- 문제: 독자보다 법률 설명문 작성자를 향한 `寫成` 지시처럼 읽힌다.
- 수정안: `第1項的20日期間，也不是所有本票債權不存在之訴共同的起訴期限。`
- 보존 의미: 20일을 모든 본표채권 부존재 확인소송의 기한으로 일반화하지 않는 한계를 그대로 설명한다.

## 첫 두 문단 문장별 삭제 검사

문단 단위로만 통과 처리하지 않고 각 문장을 뺀 상태에서 정보 손실을 확인했다. 이 표는 원고 첫 두 문단에 관한 것으로, 위 summary·후반 문장의 수정 요구와 구별한다.

| 원고 | 삭제할 경우 빠지는 구체적인 내용 | 판단 |
|---|---|---|
| EN | P1 S1: 수령 전에 확인할 물건의 소유자·자신을 거치는 이유. P1 S2: 수령 코드와 고용주/업무 신원 확인의 차이. P2 S1: 실제 경찰 안내의 날짜·구직 경고 범위. P2 S2: 정상 배송의 자동 범죄화 제한과 개인 인식·행동 판단. | 네 문장 유지 |
| JA | P1 S1: 카드가 손에 있어도 발급은행 즉시 연락. P1 S2: 실제 은행 안내의 귀속·대상 거래. P1 S3: 도착한 링크 대신 직접 연락처 확인. P2 S1: 정보 도용·모바일 결제 등록이라는 상황. P2 S2: 실제 금관회 안내와 綁定完成 통지. | 다섯 문장 유지 |
| KO | P1 S1: 판매자·구매자 링크·인증금이라는 상황과 즉시 행동. P1 S2: CIB 자료 날짜·외부 메신저/물류 사이트/송금·인출의 연결. P2 S1: 플랫폼 수수료의 정산 공제. P2 S2: 구매자가 지정한 별도 계좌 인증금과 공식 안내의 불일치. | 네 문장 유지 |
| ZH job | P1: 급여 수취와 금융 수단·인증자료 제공의 차이. P2 S1: 경찰 자료 날짜와 구체 수법. P2 S2: 교부를 유보하고 확보하려는 권한을 확인하는 행동. | 세 문장 유지 |
| ZH customer | P1 S1: 전화 지시 중단·원래 주문 경로 확인. P1 S2: 2021년 안내의 귀속과 기존 수법. P2 S1: 분할·중복 청구·처리권한이라는 확인 대상. P2 S2: 주문내용 인지와 진위, 신규 이체와 취소 증명의 차이. | 네 문장 유지 |
| ZH gym | P1 S1: 청구 수취인·계약 근거. P1 S2: 정기 결제/한 번의 카드구매 분할/대출의 구별. P2 S1: 회적·수업·결제 계약과 금액. P2 S2: 실제 서비스 중단 자료. P2 S3: 해당 자료가 거래·서비스 범위를 특정하는 용도. | 다섯 문장 유지 |
| ZH promissory | P1 S1: 본표 집행 허용과 대출 교부 인정의 차이. P1 S2: 법정 집행 근거와 실체 다툼의 소송 처리. P1 S3: 실제 재판자료의 사건번호·날짜·귀속. P2 S1: 미교부 상황에서 송달·대출 경위 확인. P2 S2: 서명 부인과 미교부 주장의 구별. P2 S3: 제195조 정지 조건 차이라는 근거. | 여섯 문장 유지 |

## 최신 같은 언어 3편과 구조 대조

현재 통합 checkout에서 `published` 내림차순, 동일 날짜는 파일 번호 내림차순으로 뽑았다. 12편 모두 도입 두 문단·전체 소제목·말미 실질 문단을 실제로 읽었다. 이는 현재 로컬 corpus의 비교이며 운영사이트의 게시 시각을 별도로 확인한 순위는 아니다. 작성자들이 자체 검수 때 본 이전 순서와 다를 수 있다.

| 언어 | 실제 읽은 비교 파일 | 이번 7편과의 차이 |
|---|---|---|
| KO | `columns/160-lost-korean-passport-taiwan-return-travel-documents.md`, `144-taiwan-protection-order-domestic-violence-korean-spouse.md`, `143-taiwan-unpaid-invoice-fraud-or-contract.md` | 여권은 기관별 서류·출국, 보호령은 안전·가족·체류, 미수금은 출하 시 설명·준거법으로 시작한다. 신규 글은 물건을 파는 사람이 왜 자기 돈을 보내게 되는지로 시작하고, 구매자→가짜 고객센터 연결 기록으로 끝낸다. 중국어 문의 예시는 한국어 생활자에게 기능이 있다. |
| JA | `columns-ja/158-taiwan-hotel-booking-extra-payment-phishing.md`, `141-taiwan-rental-deposit-before-viewing-fraud.md`, `135-japanese-equipment-maker-engineers-taiwan-work-permit.md` | 호텔은 여행 예약 추가 청구, 임대는 내견·권한, 기술자는 입국·취업허가의 차이다. 신규 글은 대만 발급 개인 카드의 청구 발견 후 발급은행 처리·申訴/評議 날짜로 좁힌다. 일본 발급 카드·데빗으로 범위를 넓히지 않고 일본어 독자가 마주치는 대만 용어를 설명한다. |
| EN | `columns-en/159-immigration-officer-impersonation-arc-taiwan.md`, `142-taiwan-supplier-bank-account-change-bec.md`, `136-taiwan-export-controls-shtc-entity-list-us-ear-compliance.md` | 행정기관 사칭의 가정, 이메일 승인, 실제 수출목록 발표와 다른 도입이다. 신규 글은 수령 전 업무 관계 확인에서 시작하고 중간에 공개 재판 요약을 제한적으로 배치한다. 끝은 소포 취급 문의·개인 인식 자료·조사 안내 링크다. ZH 구직과 달리 본인 계좌 교부가 아닌 타인 카드 운반자의 질문이다. |
| ZH 4편 | `columns-zh/157-unordered-cash-on-delivery-parcel-taiwan.md`, `156-presale-home-payee-developer-agent-taiwan.md`, `155-secondhand-concert-ticket-screenshot-taiwan.md` | 이전 글은 미주문 택배·분양 수취권한·공연표 효력이다. 신규 구직은 계좌 통제권, 客服는 원주문/추가 금융기능, 헬스장은 지급 관계·미제공 서비스 정산, 본표는 집행 문서·미교부·절차 조건으로 각각 전개한다. 3개 항목 목록은 구직 글의 실제 법정 선택조건에만 쓰이며 네 글에 공통 체크리스트를 강요하지 않았다. |

일부 중문에서 `不能只…`와 독자의 잘못을 가정하는 경고가 누적된 문제는 V05–V13으로 좁혀 제안했다. 법적 예외·한계에 필요한 부정 표현 전체를 없애라는 지시는 아니다. 본표의 연락 링크 한 개는 준비할 문서와 검토할 문제를 명시하며 결과 보장·불안 유도 광고가 아니다. 나머지 글에도 상담 권유를 끝에 일률적으로 붙이지 않았다.

## 이미지 문구·작성 이력·기계적 표시

7편의 alt/caption을 전문에서 읽고 `IMAGE-QA.md`의 각 장면 관찰과 대조했다. 이 검수자가 이미지를 다시 열어 육안 검사한 것은 아니다.

- ZH job은 봉투·닫힌 카드 케이스·뒤집힌 휴대전화만 묘사한다. 실제 카드를 보냈다고 하지 않는다.
- ZH customer는 ATM 옆 스마트폰과 조작하지 않는 손의 장면이다. 실제 이체·비밀번호 입력을 주장하지 않는다.
- ZH gym은 닫힌 유리문·기구·서류를 묘사하며 실제 업소 폐업 사진이라고 하지 않는다.
- ZH promissory는 문서·봉투·펜·목록 형태의 화면이다. 실제 본표·법원 문서·은행 거래 기록이 아니라는 caption이 있다.
- JA는 명세서 형태의 종이와 스마트폰을 든 장면이며 실제 은행·이용자·거래 명세를 찍은 사진이 아님을 명시한다.
- EN은 뒷모습·닫힌 소포·보관함을 묘사하며 소포 속에 실제 카드가 있다고 추정하지 않는다.
- KO는 카메라·포장재·상자·대화 형태 화면·지갑을 설명하며 특정 플랫폼·실제 거래 화면으로 만들지 않는다.

7편 모두 내부 `author: legal-ai-assistant`와 AI 가상 이미지 고지가 유지된다. 신규 원고를 변호사·원어민이 작성/승인했다는 공개 문구, 수임 경험·실제 의뢰인 주장, 장식용 `**`·`__`·HTML bold를 발견하지 않았다. 금칙어 검사만으로 판단하지 않고 위 전문 읽기와 병행했다.

## EN SEO delta

EN의 `seoTitle`은 `Taiwan Parcel Jobs: Bank-Card Scam Risks`로 40자, 사이트 접미사 포함 55자다. 현재 원고에서 그 한 줄을 수정 전 `Taiwan Parcel-Pickup Jobs and Bank-Card Scam Risks`로 바꾸면 최초 고정 SHA `55df4f26722918f877ed8d00d9760ef7eb3aa985b4b638f57a6b8b1e139ec21d`의 원문과 정확히 일치했다. 이번 SEO 변경 자체는 문체상 적절하다. V01은 별개로 남은 summary 예고 수정이다.

## 후속 검수 조건

Writer는 배정된 원고와 evidence에 수정 전→후 및 보존 조건을 기록하고 최종 SHA를 전달한다. 검수자는 이 R1을 보존해 수정 구간과 예상 외 변경을 읽고 승인 여부·최종 해시를 append한다. V03의 보안 문장 강도 변경과 V12의 법률 적용 범위 확인 표시는 통합 담당에게 전달했다.

## R2 — 13개 수정 후 최종 동결 재검수 (2026-10-03)

최종 문체 판정: 7편 모두 APPROVE. R1의 V01–V13은 모두 지정 문구와 정확히 일치하게 반영됐으며, 남은 문체 MUST 0건·SHOULD 0건이다. 원고·evidence는 수정하지 않았다.

각 최종 원고를 다시 읽어 변경된 문장과 앞뒤 문맥을 확인하고, R1 원문에 지정한 치환만 적용한 예상 원문과 파일 전체를 비교했다. 일곱 편 모두 전체 문자열이 정확히 일치했다. 따라서 지정 구간 외의 첫 두 문단·제목·소제목·법률 조건·숫자·출처·이미지 메타데이터에는 예상 외 변경이 없다. 본문 수정이 있는 글을 두고 본문 전체가 불변이라고 주장하지 않는다.

| 원고 | 반영 항목·실제 변경 | 재독 판정 |
|---|---|---|
| EN | V01, L5 summary만 교체 | 목차 예고가 삭제되고 원래 지시·대화·배송 기록의 역할이 남는다. 본문·40자 SEO·이미지 문구는 불변이다. |
| JA | V02, L25 마지막 문장 | 카드 정지와 청구 조사 접수 범위를 확인하는 자연스러운 설명이다. 접수번호 두 개라는 조건을 만들지 않는다. |
| KO | V03, L45 마지막 문장 | 문의자료와 비밀번호·유효 인증번호를 명확히 구별한다. 은행에 노출된 정보의 종류를 알리는 뒤 문단과도 모순되지 않는다. 새 법적 의무를 선언한 문장은 아니다. |
| ZH job | V04 summary 둘째 문장 교체, V05 L27 한 문장 삭제 | 예고와 재차 훈계를 제거했다. 구체적인 금융 동작 확인과 계좌 통제권·예외·처벌 요건 설명은 남는다. |
| ZH customer | V06–V09, L39·51·55·63 | 독자의 동기·불충분한 설명·기록 삭제를 가정하는 틀을 제거했다. 실제 결제/인출 기능, 은행 설명 목록, 연락 후 기록 보존과 승인·통보 경위가 이어진다. |
| ZH gym | V10, L41 마지막 절 | 전체 금액을 0원으로 만든다는 과장 대신 정산할 대상을 직접 쓴다. 바로 앞 소비자 귀책·제공 서비스 조건, 앞 문단의 보장 예외는 그대로다. |
| ZH promissory | V11–V13, L29·51·53 | 기산점·미교부와 위조/변조의 구별·20일의 한계를 직접 설명한다. 허위 주장 의도를 독자에게 부여하지 않으며 앞뒤 제195조 제1–3항의 문장은 보존됐다. |

V03의 보안 안내 강도 변화와 V12의 제195조 적용 범위는 R1에서 표시한대로 법률 담당에게도 전달돼 있다. 위 APPROVE는 문체 변경분 승인이다. 법률 담당의 별도 최신 해시 재승인을 이 검수서로 대신하지 않는다.

### 최종 7편 SHA-256

| 원고 | 문체 판정 | 최종 원고 SHA-256 | 최종 evidence SHA-256 |
|---|---|---|---|
| `en-parcel-pickup-job-scam-bank-cards-taiwan.md` | APPROVE | `8e38e51d2c9e2916518c5434f20c2870576458214e9f95a748374eaec75351b1` | `5ca9b3b91bf6e17eb28daf3d88c62d320e9fe5c952b24e517cf2868c53e0fe5a` |
| `ja-taiwan-issued-card-unauthorized-charge-dispute-japanese.md` | APPROVE | `969c5d058233ed73b17e490ce68ddd80fb9e28ab2324d2f9da8b149bbb7dfd25` | `e0a2eb8672fe87b61ea6d3ecbcc2984a62eea1d370efd8b06c477f74c3a9c39d` |
| `ko-taiwan-secondhand-seller-payment-verification-scam-korean.md` | APPROVE | `6d6db89596128daa09d8b11e58a97a1a9f00c713d5c7bc7a3f8bbc16bf55933e` | `a2bb3a571b8adb3108fcc9fc18a7133e9c4eb92830ee3d27d80421cb6feb5072` |
| `zh-hant-fake-customer-service-cancel-installment-atm-taiwan.md` | APPROVE | `456ea9a8588cf3a344f861b60bc9222dc335c62830ad1bcfc274adfc9f0f6bc7` | `d5f3a0c907f3f4ccb7906fec9d2edc1cb31e2c75a34b5e122e618fa8d0fef671` |
| `zh-hant-gym-closure-prepaid-installments-taiwan.md` | APPROVE | `189a397717c2bce86336c35e691fca9bf0abef3fc81a0cca507748b9895398c2` | `ff98e15785535085d5667fb687e4dd20734aeead48e71094c67438ed41abe6c6` |
| `zh-hant-job-scam-payroll-account-atm-card-taiwan.md` | APPROVE | `66625557243f6b931b6a063d533ed29072f76213156f304ffde97363e1994e71` | `dd94371222db7ff1e9042af114f5bc782d0a1136f06b4baf9940deba02576174` |
| `zh-hant-promissory-note-enforcement-undisbursed-loan-taiwan.md` | APPROVE | `d3bf4ccbc3a4154aea19fafaf6d610676043504c24c09a9b6b2d2ee5de012fba` | `b06cac80a21170a00db04051e8ae1d1dbf4058c7f6c7a192f796005bcfd5a328` |

evidence의 해당 수정 이력과 최종 전달 해시를 읽고 현재 파일에서 해시를 다시 계산했다. EN은 summary 변경과 별도로 앞서 승인한 SEO 한 줄 변경이 유지된다. 일곱 편 모두 R1 때 읽은 AI 가상 장면 caption·alt와 내부 author를 유지하며, 새 경험·변호사/원어민 검수 주장·광고·장식용 굵은 강조를 추가하지 않았다.

R1 본문을 정확히 보존했다. R2 직전 R1 파일 SHA-256은 `416860437f84d6aa10ba0519079045668dc80ba43609dee93e02e68c9a33551e`다. 이번 확인에는 새 공식 출처 검색, 이미지 실물 재검사, 렌더링·테스트·빌드·배포 검증이 포함되지 않는다.

## R3 — EN summary 길이 조정 후 최종 문체 승인 (2026-10-03)

문체 판정: APPROVE. 남은 MUST 0건·SHOULD 0건이다. 앞선 R1·R2를 보존하고 EN의 최종 승인 해시만 아래 값으로 갱신한다. 나머지 여섯 편의 승인은 그대로다.

- 원고: `en-parcel-pickup-job-scam-bank-cards-taiwan.md:5`.
- 최종 원고 SHA-256: `2a6e5fb2520100eb181fea55b7b2226c445eadc63bdbe4e053e89245c323fa2d`.
- 최종 evidence SHA-256: `bcd86ffbe2b2b981b678ce9f916b719b7895cf6283f49043d378935815513bf6`.

새 summary:

> A paid parcel-pickup job can involve other people's bank cards. Job instructions, messages and delivery records can help establish what you knew and did.

`Original job instructions`를 `Job instructions`로 줄인 한 구절뿐이다. 162자였던 summary는 153자다. 소포 수령 업무의 위험과 당시 인식·행동을 판단할 자료의 역할을 자연스럽게 설명하고, 목차 예고·결과 보장·새 법적 주장을 만들지 않는다. 원본 기록을 보존하라는 본문 안내는 그대로 있으므로 이 요약의 수식어 삭제가 그 안내를 약화시키지 않는다.

이전 snapshot에 이 치환만 적용한 원문과 현재 파일 전체가 정확히 일치했다. 변경 행은 L5뿐이고, 역치환한 전체 SHA는 이전 승인본 `8e38e51d2c9e2916518c5434f20c2870576458214e9f95a748374eaec75351b1`이다. raw body SHA `d146d43400bb1def38d4bb269aad29cedae511a06a674c2602f80313dbc424dd`가 유지된다. 본문·제목·SEO·날짜·author·이미지 문구·외부 출처·기타 metadata에는 변화가 없다. 작성자 evidence의 QA92364938 사유와 변경 기록도 읽었다.

이 append 전 검토서 SHA `0f5b8f403e052df904f7f1b6f0cb41e13e8c6b004f9f8a5942ce3d13939454ac`의 전체 내용을 보존했다. 원고·evidence·repo는 수정하지 않았다. 이 승인은 좁은 문체 delta와 파일 대조 결과이며 전체 QA 재실행·빌드·배포나 새로운 법률/이미지 검수를 뜻하지 않는다.
