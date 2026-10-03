# Batch003 EN·KO 독립 법률·출처 검수 R1

검수일: 2026-10-03. 검수 대상은 아래 SHA256으로 고정된 두 원고와 각 evidence다. 작성자의 점검 기록과 별개로 공식 원문을 직접 열어 공개 주장과 대조했다. 이 기록은 AI 에이전트의 법률정보·출처 검수이며 변호사의 검토·집필 인증이 아니다.

판정: EN APPROVE / KO APPROVE. 이 검수 범위에서 MUST 0, SHOULD 0. 원고·evidence·저장소는 수정하지 않았다. 승인 범위는 아래 입력에 대한 법률·출처 정확성이며 문체 검수, 이미지의 실제 시각 검수, 빌드·렌더링·게시 승인을 포함하지 않는다.

## 입력 고정 확인

아래 경로는 `/Users/son7/tseng-fraud-editorial-20261003/batch-003/` 기준이다. `shasum -a 256` 실행 결과가 인계된 값과 모두 일치했다.

| 대상 | SHA256 |
|---|---|
| `drafts/en-parcel-pickup-job-scam-bank-cards-taiwan.md` | `802ebb91ffbb2fb6828ce6dc71c71c1f06bfb39d7a8aefa11b0a2eba4f57e900` |
| `evidence/en-parcel-pickup-job-scam-bank-cards-taiwan.md` | `e424ef9f62488a2fc95ddcc0de20b5fea9921e49c1f6f50dfd2dbddaaa96926f` |
| `drafts/ko-taiwan-secondhand-seller-payment-verification-scam-korean.md` | `11e9d7b91d3c37441d783d46c25d5a9c9f3a6c3a6d4ab0d2d8dca2585b6a28b0` |
| `evidence/ko-taiwan-secondhand-seller-payment-verification-scam-korean.md` | `00e188e8be2f09a523b09f0f6eded15e63fd3dc36f96782dd83fa8a7b9b0ed28` |

EN 최종 metadata 차이도 직접 확인했다. 3행의 `seoTitle`만 `Taiwan Parcel Jobs: Bank-Card Scam Risks`로 바뀌었다. 해당 한 줄을 이전 값으로 역치환한 전체 SHA가 최초 검수 입력 `55df4f26722918f877ed8d00d9760ef7eb3aa985b4b638f57a6b8b1e139ec21d`와 일치했다(Python assertion PASS, exit 0). 따라서 본문·미디어·나머지 metadata는 동일하다. 새 제목은 법률 주장을 추가하지 않는다. evidence는 상단의 현재 SEO 수정본 SHA 문단과 마지막 SEO 변경 기록이 추가됐다. 두 부분을 제외한 바이트가 최초 입력 `20b2d8689cc2d9977b982dd15981ab19552b325f04046c89690757ca28f85469`와 일치함을 별도 Python assertion으로 확인했다(PASS, exit 0). 아래 EN 판정은 표의 최종 SHA까지 포함한다.

## EN 판정과 주장 대조

판정: APPROVE. MUST 없음. SHOULD 없음.

대상: `drafts/en-parcel-pickup-job-scam-bank-cards-taiwan.md`.

| 위치 | 확인한 주장·경계 | 결과 |
|---|---|---|
| `drafts/en-parcel-pickup-job-scam-bank-cards-taiwan.md:22` | 대만에서 소포 수령 일을 제안받은 영어 독자를 대상으로 한다. 미국 국적·미국 신고 절차·취업비자 요건을 임의로 붙이지 않는다. | PASS |
| `drafts/en-parcel-pickup-job-scam-bank-cards-taiwan.md:24` | 창화 경찰의 2025-06-27 경고에 소포 대리 수령과 손쉬운 고수익 일자리 제안이 포함된다. 모든 배송 일이나 경고 신호를 범죄로 단정하지 않는다. [EN-S1](https://www.chpb.gov.tw/jpb/Announcement/C122100?ID=08326175-b0a9-47df-bcb1-a06424020df6&PageType=1) | PASS |
| `drafts/en-parcel-pickup-job-scam-bank-cards-taiwan.md:28` | 업체에 별도로 연락해 채용자를 확인하고 업무 내용을 기록하라는 문장은 작성자의 실무 제안이다. 32행에서 법적 면책 확인표가 아님을 명시한다. | PASS |
| `drafts/en-parcel-pickup-job-scam-bank-cards-taiwan.md:36` | 114年度金訴字第3427、4336號는 실제 타이중 지방법원 사건이다. 편의점·역 보관함에서 다른 사람의 현금카드가 든 소포를 수령해 타이난으로 전달했다는 설명이 공식 발표와 맞는다. [EN-S2](https://www.judicial.gov.tw/tw/cp-1888-1546044-094be-1.html) | PASS |
| `drafts/en-parcel-pickup-job-scam-bank-cards-taiwan.md:38` | 행위 당시 조사국 조사관이라는 경력, 전문 훈련·경험, 비정상적 전달 경로·보수가 판단에 포함됐다. 공동정범 판단과 방조 주장 배척을 구별한다. 1심이며 항소 가능하다는 발표의 한계를 보존한다. [EN-S2](https://www.judicial.gov.tw/tw/cp-1888-1546044-094be-1.html) | PASS |
| `drafts/en-parcel-pickup-job-scam-bank-cards-taiwan.md:40` | 그 피고인의 특수한 경력을 다른 구직자의 인식으로 옮기지 않는다. 자기 계좌를 빌려주지 않아도 타인의 카드 운반이 별도 검토 대상이 될 수 있다는 제한된 함의다. | PASS |
| `drafts/en-parcel-pickup-job-scam-bank-cards-taiwan.md:44` | 형법 제13조의 인식·의욕 및 예견·수용에 따른 고의를 설명한다. 이상 징후만으로 개별 지원자의 고의가 자동 증명된다고 하지 않는다. 영문은 중국어 원문을 풀어 쓴 설명이며 공식 영문 인용으로 표시하지 않는다. [EN-S3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=13) | PASS |
| `drafts/en-parcel-pickup-job-scam-bank-cards-taiwan.md:46` | 제30조의 방조를 공동정범과 별개로 설명하고 인식·실제 역할 검토가 필요하다고 한다. 단순히 배송이라는 명칭을 붙이면 방조 또는 무죄가 된다는 주장은 없다. 감형도 자동 보장하지 않는다. [EN-S4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=30) | PASS |
| `drafts/en-parcel-pickup-job-scam-bank-cards-taiwan.md:48` | 최초 제안과 후속 지시, 의심을 품은 시점을 구분하고 원본을 고치지 말라는 기록 보존 제안이다. 진술을 꾸미거나 자료를 은닉하라는 내용이 없다. | PASS |
| `drafts/en-parcel-pickup-job-scam-bank-cards-taiwan.md:52` | 경찰 경고의 165·경찰 연락 경로를 정확히 귀속한다. 추가 수령 중단, 보관 중임을 밝히고 처리 지침을 묻기, 함부로 개봉·폐기·재전달하지 않기는 자체 실무 제안이다. 경찰의 구체적 소포 처리 규정이라고 표시하지 않는다. [EN-S1](https://www.chpb.gov.tw/jpb/Announcement/C122100?ID=08326175-b0a9-47df-bcb1-a06424020df6&PageType=1) | PASS |
| `drafts/en-parcel-pickup-job-scam-bank-cards-taiwan.md:54` | 광고·연락·수령·전달·수수료 기록 및 중국어 원본 보존을 제안한다. 56행에서 이 자료가 면책이나 특정 결과를 보장하지 않는다고 한다. | PASS |
| `drafts/en-parcel-pickup-job-scam-bank-cards-taiwan.md:60` | 법원 보도자료를 사용했고 이후 항소 경과는 확인하지 않았다고 공개한다. 자료 확인일과 경찰·법원 발표일을 구별한다. | PASS |

### EN 직접 열람 출처

모두 2026-10-03 web open으로 실제 본문을 읽었다. 검색 결과 요약이나 작성자 evidence만으로 대체하지 않았다.

| ID | 기관·직접 URL | 시점·짧은 근거·사용 한계 |
|---|---|---|
| EN-S1 | [창화현 경찰국 채용 사기 경고](https://www.chpb.gov.tw/jpb/Announcement/C122100?ID=08326175-b0a9-47df-bcb1-a06424020df6&PageType=1) | 본문 날짜 114-06-27(2025-06-27). 소포 수령 일, 독립 확인·증거 보존, 의심 시 165·경찰 연락을 확인했다. 사이트 공통 갱신일을 기사 날짜로 바꾸지 않았다. 영어 상담 제공이나 외국인 표적 통계의 근거가 아니다. |
| EN-S2 | [사법원에 게시된 타이중 지방법원 114年度金訴字第3427、4336號 판결 보도자료](https://www.judicial.gov.tw/tw/cp-1888-1546044-094be-1.html) | 게시일 115-05-15(2026-05-15). 직접 읽은 짧은 문구는 “本案得上訴。”이다. 법원이 설명한 판단 경위를 확인했으며 판결 전문·확정 여부·후속 심급은 확보하지 않았다. 원고도 그 범위를 넘지 않는다. |
| EN-S3 | [법무부 전국법규자료고 형법 제13조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=13) | 현행 조문 직접 확인. 고의의 두 형태를 구분한다. 열람 페이지의 자료 정리 기준일은 2026-09-24로 표시된다. 경고 신호의 존재 자체를 고의 성립 규칙으로 정한 조문이 아니다. |
| EN-S4 | [법무부 전국법규자료고 형법 제30조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=30) | 현행 방조 조문과 정범 형에 따른 감경 가능 규정을 확인했다. 자료 정리 기준일 2026-09-24. 원고는 방조의 자동 감형이나 이 사건과 모든 구직자의 책임 동일성을 주장하지 않는다. |

### EN 한계

- 36·38·60행: 실제 사건은 공식 1심 요약에 귀속됐다. 전문 판결과 항소 현황을 확인한 검수로 확대할 수 없다.
- 28·30·32·48·52·54행: 회사 확인·소포 보관·기록 정리는 실무 제안이다. 법률상 요구되는 자료의 완전한 목록이나 경찰의 인수 지침으로 인증하지 않는다.
- 56행: 연결된 기존 경찰 조사 칼럼의 전체 법률 내용을 이 검수에서 다시 확인하지 않았다.
- 16·17행: 가상 AI 이미지 고지는 확인했다. 실제 PNG의 시각·복사 동일성·렌더링은 이 법률 검수 범위 밖이다.

## KO 판정과 주장 대조

판정: APPROVE. MUST 없음. SHOULD 없음.

대상: `drafts/ko-taiwan-secondhand-seller-payment-verification-scam-korean.md`.

| 위치 | 확인한 주장·경계 | 결과 |
|---|---|---|
| `drafts/ko-taiwan-secondhand-seller-payment-verification-scam-korean.md:21` | 독자는 대만에서 중고품을 파는 한국어 생활자다. 구매자 사칭 연락에서 판매자가 돈을 보내게 되는 구조를 다룬다. 일반 구매자의 미배송·환불·청약철회 규칙을 붙이지 않는다. CIB의 2026-04-09 수법 설명이 이를 뒷받침한다. [KO-S1](https://www.cib.npa.gov.tw/ch/app/news/view?id=1887&module=news&serno=26094d36-f617-40b5-9712-67b5199aac8b) | PASS |
| `drafts/ko-taiwan-secondhand-seller-payment-verification-scam-korean.md:23` | 賣貨便의 金流服務費를 정산대금에서 공제하고 별도 납부하지 않는다는 FAQ와 맞는다. 모든 플랫폼·배송비·세금이 무료라는 주장으로 넓히지 않는다. [KO-S2](https://myship.7-11.com.tw/Home/HelpCenter) | PASS |
| `drafts/ko-taiwan-secondhand-seller-payment-verification-scam-korean.md:27` | 구매자 사칭→주문 실패→가짜 고객센터→ATM·인터넷뱅킹 조작·송금 요구의 연결은 賣貨便 2022-12-05 공지와 맞는다. 2026년에 발생한 개별 사건으로 만들지 않는다. [KO-S3](https://myship.7-11.com.tw/Home/NewsList?area=%E8%B3%A3%E8%B2%A8%E4%BE%BF&no=100) | PASS |
| `drafts/ko-taiwan-secondhand-seller-payment-verification-scam-korean.md:29` | 實名認證·金流驗證는 사기 화면에서 제시되는 말의 뜻으로 설명한다. 이체·카드 없는 인출·QR코드·현금카드 요구는 CIB 발표에 있다. 정상 인증 전부를 사기라고 일반화하지 않는다. [KO-S1](https://www.cib.npa.gov.tw/ch/app/news/view?id=1887&module=news&serno=26094d36-f617-40b5-9712-67b5199aac8b) | PASS |
| `drafts/ko-taiwan-secondhand-seller-payment-verification-scam-korean.md:31` | 플랫폼 계정의 오류·제한 주장과 실제 은행 계좌 제한을 구별한다. ‘帳戶凍結’는 조건부 용어 설명이며 CIB의 ‘帳號遭凍結’를 은행의 실제 조치로 옮기지 않는다. | PASS |
| `drafts/ko-taiwan-secondhand-seller-payment-verification-scam-korean.md:35` | 도움말에 이메일 인증·수취계좌 설정 항목이 있다는 범위가 맞는다. 37행의 홈페이지·판매자 앱 경로도 공식 안내에 있다. 한국 국적자의 가입 허용·언어 지원·실제 계정 UI 시험을 주장하지 않는다. [KO-S2](https://myship.7-11.com.tw/Home/HelpCenter) | PASS |
| `drafts/ko-taiwan-secondhand-seller-payment-verification-scam-korean.md:39` | 중국어 문장을 문의용 예시로 명시한다. 실제 고객센터 답변·실제 사건·법정 서식·발송 완료로 표시하지 않는다. 비밀번호·유효 인증번호 전송을 요구하지 않는다. | PASS |
| `drafts/ko-taiwan-secondhand-seller-payment-verification-scam-korean.md:49` | 가짜 사이트에 입력한 카드정보·OTP의 부정결제 위험은 CIB 발표와 맞는다. 은행에 연락하며 제공한 정보를 정리하고 보호조치는 은행 안내를 받도록 한다. 모든 경우에 같은 조치·배상·환급이 된다고 하지 않는다. [KO-S1](https://www.cib.npa.gov.tw/ch/app/news/view?id=1887&module=news&serno=26094d36-f617-40b5-9712-67b5199aac8b) | PASS |
| `drafts/ko-taiwan-secondhand-seller-payment-verification-scam-korean.md:51` | 제28조의 영업시간·예금 취급기관 직접 방문·신원/송금/피해 경위 확인·서약서·165 연락 조건을 보존한다. 은행 전화 상담만으로 창구 신고와 기관 간 통보가 모두 완료된다고 하지 않는다. [KO-S4 제28조](https://law.fsc.gov.tw/LawContent.aspx?id=GL004003) | PASS |
| `drafts/ko-taiwan-secondhand-seller-payment-verification-scam-korean.md:53` | 제30조의 기관 간 통보 후 圈存과 잔액 한계를 설명한다. 제52·53조의 남은 피해금 반환 조건과 제69조의 분쟁·복잡 사건 예외를 구분한다. 신고·임시 동결·최종 반환을 같은 결과로 보장하지 않는다. [KO-S4](https://law.fsc.gov.tw/LawContent.aspx?id=GL004003) | PASS |
| `drafts/ko-taiwan-secondhand-seller-payment-verification-scam-korean.md:57` | 판매글에서 송금까지의 접촉 경로 보존은 실무 제안이다. 59행에서 증거 수집을 위해 사기 사이트에 재접속하거나 인증을 재현하지 않도록 한다. 자료 부재를 신고 불가 요건으로 만들지 않는다. | PASS |
| `drafts/ko-taiwan-secondhand-seller-payment-verification-scam-korean.md:63` | CIB 기사 날짜, FAQ 각 항목 날짜, 2022 사칭 공지, 2026-07-20 개정 및 시행 조문을 구별해 표시한다. 68행의 일반 정보 한계도 개별 결과를 보장하지 않는 본문과 일치한다. | PASS |

### KO 직접 열람 출처

모두 2026-10-03에 직접 확인했다. KO-S3만 web open 오류로 동일 공식 URL의 공개 HTML을 표준 라이브러리 HTTP GET으로 다시 읽었다.

| ID | 기관·직접 URL | 시점·짧은 근거·사용 한계 |
|---|---|---|
| KO-S1 | [내정부 경찰정 형사경찰국 피싱·가짜 물류 경고](https://www.cib.npa.gov.tw/ch/app/news/view?id=1887&module=news&serno=26094d36-f617-40b5-9712-67b5199aac8b) | 公共關係室, 게시·갱신 115-04-09(2026-04-09). 수법 1~4항과 카드·OTP 피싱 문단을 직접 읽었다. 단정적인 제목을 모든 정상 인증에 적용하지 않았다. 사이트 footer 갱신일이나 통계를 원고의 주장으로 사용하지 않는다. |
| KO-S2 | [7-ELEVEN 賣貨便 공식 도움말](https://myship.7-11.com.tw/Home/HelpCenter) | 공식 접속 방법 2026-08-18, 수수료 납부 2026-09-22, 이메일 인증·수취계좌 설정 2021-04-28을 각각 확인했다. 짧은 근거는 “賣家不需另外繳納”이다. 오래된 항목을 최신 UI의 모든 사용자 공통 요건으로 인증하지 않는다. |
| KO-S3 | [7-ELEVEN 賣貨便 공식 공지 목록](https://myship.7-11.com.tw/Home/NewsList?area=%E8%B3%A3%E8%B2%A8%E4%BE%BF&no=100) | 2022-12-05 防詐提醒의 가짜 구매자·고객센터·금융 조작·은행 및 165 확인을 읽었다. 옛 LINE 표장·전화번호를 현재 진위 판별 규칙으로 복사하지 않았다. 2026년 신종 수법·증가 추세의 근거로 쓰지 않는다. |
| KO-S4 | [금융감독관리위원회 현행 사기 방지 준수사항 규정](https://law.fsc.gov.tw/LawContent.aspx?id=GL004003) | 화면상 개정 115-07-20(2026-07-20), 제73조는 공포일부터 시행. 제28·30·52·53·55·69·73조를 직접 읽었다. 기관 간 통보 후 임시 조치와 경시 예금계좌 잔액 반환의 조건을 구분하며, 다른 법령의 압류·보전 우선 규정도 확인했다. |
| KO-S5 보충 | [은행국 공식 출력 페이지](https://law.banking.gov.tw/Chi/FLAW/PrintFLAW01.aspx?beginpos=15&lsid=FL104315) | 실제 출력은 신용카드 제41~44조다. 작성자의 evidence에 적힌 열람 범위와 일치한다. 예금 제28·30·52·53조의 근거로 사용하지 않았고 KO-S4에서 해당 조문을 별도로 확인했다. |

KO-S3 대체 접근 실행 증거: Python `urllib.request.urlopen`으로 TLS 검증을 유지한 공개 GET, HTTP 200, 13,645,576 bytes, 수신 HTML SHA256 `71eb88c6ce012282e390c75d3948fe486c32f44a42629950580b7ddb46feba8a`, 프로세스 exit 0. 2022/12/05 공지 날짜와 그 본문을 메모리에서 파싱해 읽었다. 이 값은 검수자의 이번 응답 기록이며 작성자가 앞서 수신한 동적 HTML의 SHA와 같다고 주장하지 않는다. 파일을 추가 저장하지 않았다.

### KO 한계

- 35·37행: 공식 도움말의 공개 안내를 확인했다. 실제 외국인 판매자 계정 생성·은행 연결·현재 앱 화면을 시험하지 않았다.
- 51·53행: 신고·기관 간 통보·잔액 반환의 요약이다. 제52·53조는 경시 예금계좌에 남은 피해금에 대한 절차이며, 원고의 ‘별도 조건’은 개별 사건의 반환 자격·배분액·실행 시점을 확정하지 않는다. 제55조 등 절차 전체를 설명한 안내문도 아니다.
- 53행: 제30조의 48시간은 기관의 후속 경시 지정·해제 처리 조건이다. 원고는 이를 피해자의 신고 기한·환급 기한으로 옮기지 않았다.
- 63~66행: 2021·2022 자료는 각 날짜와 사용 범위가 공개돼 있다. 모든 안내가 2026년에 신설됐다고 읽히는 주장이나 실시간 서비스 보장이 없다.
- 15·16행: 실제 인물·사건·플랫폼 화면으로 오인시키지 않는 가상 AI 이미지 고지는 확인했다. 실제 PNG의 시각·복사 동일성·렌더링은 이 법률 검수 범위 밖이다.

## 최종 처리

법률·출처 수정 요구 없음. 입력 SHA가 변경되면 변경 내용이 이 판정 범위를 벗어나는지 다시 대조해야 한다. 원고와 evidence의 자체 점검 상태를 검수자가 대신 수정하지 않았으며, 이 문서만 작성했다.

## R2 — 최종 문체 변경분 법률 재확인 (2026-10-03)

최종 판정: EN APPROVE / KO APPROVE. 아래 최신 입력 SHA에 대해 MUST 0, SHOULD 0. 기존 R1의 출처 열람과 한계는 유지하며, 이번에는 `reviews/voice-r1.md`의 V01·V03 및 R2, 변경된 원고와 evidence를 직접 읽고 두 변경분의 법률적 의미를 대조했다.

| 대상 | 최종 SHA256 |
|---|---|
| `drafts/en-parcel-pickup-job-scam-bank-cards-taiwan.md` | `8e38e51d2c9e2916518c5434f20c2870576458214e9f95a748374eaec75351b1` |
| `evidence/en-parcel-pickup-job-scam-bank-cards-taiwan.md` | `5ca9b3b91bf6e17eb28daf3d88c62d320e9fe5c952b24e517cf2868c53e0fe5a` |
| `drafts/ko-taiwan-secondhand-seller-payment-verification-scam-korean.md` | `6d6db89596128daa09d8b11e58a97a1a9f00c713d5c7bc7a3f8bbc16bf55933e` |
| `evidence/ko-taiwan-secondhand-seller-payment-verification-scam-korean.md` | `a2bb3a571b8adb3108fcc9fc18a7133e9c4eb92830ee3d27d80421cb6feb5072` |

| 변경 위치 | 직접 확인한 변경 및 법률 판정 | 결과 |
|---|---|---|
| `drafts/en-parcel-pickup-job-scam-bank-cards-taiwan.md:5` | V01은 summary의 전개 예고를 원래 업무 지시·대화·배송 기록이 당시 인식과 행동 확인에 도움이 된다는 문장으로 바꾼다. `can help establish`는 기록의 확정적 증명력·고의 성립·면책·유무죄를 보장하지 않는다. 본문 44·46·48·54·56행의 개별 인식·역할·원본 기록에 관한 설명 범위와 맞고 새 법적 요건이나 주장도 추가하지 않는다. | APPROVE |
| `drafts/ko-taiwan-secondhand-seller-payment-verification-scam-korean.md:45` | V03은 비밀번호·현재 사용 가능한 인증번호를 문의에 넣을 필요가 없다는 표현을 ‘문의에는 … 넣지 않습니다’로 바꾼다. 문의자료의 안전한 범위를 분명히 하는 실무 안내다. 위반에 대한 법적 의무·책임·환급 제한을 새로 정하지 않으며, 49행의 ‘어떤 종류의 정보를 입력했는지 은행에 알림’과도 모순되지 않는다. 은행에 사용 가능한 비밀값 자체를 보내라는 의미가 아니다. | APPROVE |

독립 실행 증거: Python으로 각 변경 후 문구가 한 번만 존재함을 확인하고 그 한 곳을 이전 문구로 역치환했다. EN 전체 SHA는 직전 승인본 `802ebb91ffbb2fb6828ce6dc71c71c1f06bfb39d7a8aefa11b0a2eba4f57e900`, KO 전체 SHA는 직전 승인본 `11e9d7b91d3c37441d783d46c25d5a9c9f3a6c3a6d4ab0d2d8dca2585b6a28b0`와 각각 일치했다. 두 assertion 모두 PASS, exit 0. 따라서 EN은 summary 외 모든 바이트가, KO는 45행 한 문장 외 모든 바이트가 보존됐다. KO evidence도 V03 기록을 제외한 기존 부분이 이전 evidence SHA와 일치함을 별도로 확인했다.

이번에는 새 공식 출처 조사, 이미지 재열람, 빌드·화면·배포 확인을 수행하지 않았다. 두 문장 밖의 주장과 출처는 R1에서 확인한 내용이 그대로 보존됐으므로 기존 법률·출처 승인을 이 최신 SHA에 이어 적용한다. 원고·evidence·저장소를 수정하지 않았다. 이 검수서의 R1 이전 내용은 SHA `0181ca41ab32a06df2f1888175b48ec33c36a72685f778808542dd6da3d94364` 상태로 보존하고 이 R2만 추가한다. 변호사 검토·집필 인증이나 게시 승인을 뜻하지 않는다.
