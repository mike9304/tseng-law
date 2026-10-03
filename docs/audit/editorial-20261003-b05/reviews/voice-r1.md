# Batch005 독립 문체 검수 R1

검수자: editorial_inventory. 최초 검수 기록: 2026-10-04 KST / 2026-10-03 Asia/Taipei. 도구 확인 시각은 2026-10-03 15:21:37 UTC였다. 소유 파일은 이 검토서뿐이며 원고·evidence·repo·이미지는 변경하지 않았다.

## 먼저 동결된 여섯 편의 판정과 범위

아래 여섯 편을 제목·summary·본문·출처 목록·alt/caption까지 각각 전문으로 읽었다. 모두 문체 APPROVE이며 MUST 0건이다. 회사 장부 글에 비차단 SHOULD S01을 제안했고 root가 채택했다. 이 표는 최초 검수 입력의 해시를 보존하며, 작성자의 변경 후 새 해시는 후속 delta 항목으로 갱신한다. 아직 최종본이 전달되지 않은 KO 글의 승인을 포함하지 않는다.

| 원고 | 문체 판정 | 검수 원고 SHA-256 | 검수 evidence SHA-256 |
|---|---|---|---|
| `zh-hant-annual-leave-dates-employer-scheduling-taiwan.md` | APPROVE | `1604f34edbc7e87dbeaae3138df4496f8292ec907b0e536195227018bc82470f` | `ad66f4c2410d022cf52d3f8f25b36a18e71fb4f84744bbc53d5a84e7e704d2aa` |
| `zh-hant-rental-electricity-average-price-bill-taiwan.md` | APPROVE | `b5f2af0ec42bb8a763e636ac3a314147ac1b12644b8cbd0842dd5ba1170bc1df` | `d284b12ef7d8ee900751218248dd891c8ff85205ce95e44355736c5fcd76aebe` |
| `en-taiwan-personal-data-access-copy-request.md` | APPROVE | `12b95920da8a363e131380e2e1e78cb30bfebdeb3bcb52d9045f597e09d050b9` | `4163a4cf2132611d6360ef9238da977e7b88e5fe46f272d2027a1edf34e752db` |
| `zh-hant-limited-company-shareholder-books-inspection-taiwan.md` | APPROVE — S01 선택 | `03c6a763bc5f3fabc528e84165b22757af4cc0b58df04af90516e46edad08a44` | `dfef9fe93da104008fc059b0d1332ad1fc23674fa03594200da0129d20e336dd` |
| `zh-hant-handwritten-will-typed-print-signature-taiwan.md` | APPROVE | `716d115cdfb37120f7ea36e41b53bdc7a2989a83d8c477e51eb5c142f1e72b3c` | `fabcbd1369aed3bc5139ac6221a1f653362f7cf893c0651e7a7edf2f779c1d40` |
| `ja-taiwan-hotel-typhoon-cancellation-refund-japanese.md` | APPROVE | `ef885b4d15a7e9e5708d3ccdcb9171aaf69689f1de39095156d356f3072c7c12` | `8f5031ca94ec7c7ee1911f3d0cce92e74b2aa571f00cfa7fcdf1b99343493648` |

문체·독자 적합성·구성·의미 보존과 이미지 설명 문구를 검토했다. 법률 출처를 새로 열어 현행성·해석을 승인하거나 PNG 실물을 직접 보거나 웹 화면·테스트·빌드·배포를 검증한 결과가 아니다. 법률·미디어·통합 담당의 해당 검증은 별도다.

## 직접 읽은 기준과 비교 자료

이번 B05 시작 때 현재 checkout의 AGENTS.md, EDITORIAL-VOICE.md 전문, FRAUD-EDITORIAL-POLICY.md 전문, B05 WRITER-WORKORDER.md를 다시 읽었다. TOPIC-BRIEFS의 이번 여섯 주제와 writer evidence의 문체·실물 관찰 기록도 읽었다. 현재 정책의 공개 AI 작성자 이름·프로필·푸터 미표시, 내부 author 및 실제 사람 byline·미디어 AI 고지 보존을 기준으로 삼았다.

실제 변호사 표본 `/Users/son7/Downloads/半導體零組件企業進入台灣市場：在台子公司、分公司與代理商，該如何評估？－20260917.docx`의 OOXML 첫 6문단을 다시 읽었다. SHA-256 `bc5721bdb532ef883986b9caf40c0ebefd0ed78dd7576048d3189483548ffd5d`가 같았다. 고객의 실제 요구에서 역할·계약·조건을 나누는 설명을 참고했고, 이 표본이 신규 글의 변호사 저작·감수를 증명한다고 보지 않았다.

실제 통합 checkout에서 published 내림차순, 같은 날짜는 번호 내림차순으로 최근 같은 언어 3편을 골라 첫 두 문단·모든 소제목·말미 실질 문단을 직접 읽었다. 아래 모두 published는 2026-10-03이다. 이 로컬 비교가 운영 게시 상태의 재검증은 아니다.

| 실제 비교 파일 | 읽은 파일 SHA-256 |
|---|---|
| `columns-zh/164-promissory-note-enforcement-undisbursed-loan-taiwan.md` | `d3bf4ccbc3a4154aea19fafaf6d610676043504c24c09a9b6b2d2ee5de012fba` |
| `columns-zh/163-gym-closure-prepaid-installments-taiwan.md` | `189a397717c2bce86336c35e691fca9bf0abef3fc81a0cca507748b9895398c2` |
| `columns-zh/162-fake-customer-service-cancel-installment-atm-taiwan.md` | `456ea9a8588cf3a344f861b60bc9222dc335c62830ad1bcfc274adfc9f0f6bc7` |
| `columns-en/166-parcel-pickup-job-scam-bank-cards-taiwan.md` | `2a6e5fb2520100eb181fea55b7b2226c445eadc63bdbe4e053e89245c323fa2d` |
| `columns-en/159-immigration-officer-impersonation-arc-taiwan.md` | `72074c977db099759425a3f4879e300e30caa8650e4ffd4fade4e5ba7216c256` |
| `columns-en/142-taiwan-supplier-bank-account-change-bec.md` | `ac8293d32ca6c2c9ba29e31771c949ad21b27f912bd9bb93835756b3e90627bc` |
| `columns-ja/165-taiwan-issued-card-unauthorized-charge-dispute-japanese.md` | `969c5d058233ed73b17e490ce68ddd80fb9e28ab2324d2f9da8b149bbb7dfd25` |
| `columns-ja/158-taiwan-hotel-booking-extra-payment-phishing.md` | `a402ed2491c2d2195b3fce3c95ccf06734ce884eb6f39da96afbffed0a2f739f` |
| `columns-ja/141-taiwan-rental-deposit-before-viewing-fraud.md` | `1660efd3f155d6c73157db3d20bb6d2365234be5f64a5d2418dd6a6984867a33` |

ZH 최신 세 편은 본표 절차·헬스장 분할금·가짜客服다. B05의 특휴는 날짜 결정과 변경·기록, 전기료는 기간·단가·공동 사용량, 회사 장부는 비이사 주주의 자료 접근, 유언은 선택한 작성 방식과 수정·원본으로 각각 전개한다. 사기 경고나 돈 회수의 공통 틀을 옮기지 않았다.

EN 최신 세 편은 소포 수령 구직·ARC 사칭·지급계좌 변경이며, 새 글은 자신에 관한 자료의 요청 범위→사업자의 결정 기간→거절과 불완전한 답변 구별로 이어진다. 영미권 독자를 미국인이나 EU 거주자로 가정하거나 외국법 기한을 가져오지 않는다.

JA 최신 세 편은 카드 부정청구·예약 추가결제 사칭·임대 예약금이다. 이번 태풍 글은 진짜 숙박 예약의 이행불능·통상 취소·합의 변경에 집중하며 은행 신고나 사칭 확인 순서로 끝나지 않는다. 앞서 읽은 B04 수하물 글의 수탁·통지·기간과도 판단이 다르다.

## 첫 두 문단 문장별 삭제 검사

아래는 각 문장을 하나씩 삭제했을 때 빠지는 정보를 직접 확인한 기록이다. 각 행의 모든 문장은 유지한다.

| 원고 | 문장별로 빠지는 내용 |
|---|---|
| 특휴 | P1 S1: 근로기준법 적용·근로자의 날짜 결정·긴급 경영상 필요 시 협의. P1 S2: 사용 안내와 일방적 지정/병가 변경의 경계 및 노동부 근거. P2 S1: 의견 수렴인지 실제 차감 통지인지 확인할 대상. P2 S2: 다른 날짜 제안·회신 보존과 이미 차감된 때의 근거/일수 요청이라는 구체 행동. |
| 전기료 | P1 S1: 해당 기간 고지 정보·분계량기 시작/끝·단가·공용 배분의 교차 확인. P1 S2: 2024-07-15 신제 적용·도수 기준·당기 평균 단가 상한. P2 S1: 사용량 자료와 단가 자료의 서로 다른 역할. P2 S2: 여러 방이 하나의 고지서를 쓸 때 공동 사용량 배분이라는 추가 조건. |
| 회사 장부 | P1 S1: 대만 有限公司 비이사 주주의 질문/열람 권리와 대상. P1 S2: 제109·48조의 연결과 소액 출자만으로 배제되지 않는다는 답. P2 S1: 등록명·자신의 이사 여부 확인. P2 S2: 有限公司와 股份有限公司의 법정 구별·이 글의 범위. P2 S3: 비업무집행의 의미를 비이사로 설명하는 공식 FAQ의 귀속. |
| 자필유언 | P1 S1: 타이핑→인쇄→서명이 자필 방식의 요구를 충족하지 않는다는 답. P1 S2: 전문 자필·연월일·직접 서명이라는 세 조건과 근거. P1 S3: 본인이 내용을 정하거나 입력했다는 사실과 직접 썼다는 사실의 차이. P2 S1: 제73조의 형식 위반 효과와 법률상 예외. P2 S2: 다른 유언 방식의 전 요건을 갖춘 경우를 별도로 보아야 하는 범위. |
| EN 개인정보 | P1 S1: 본인 자료에 대한 문의·열람·사본과 법정 예외. P1 S2: 사전 포기·계약 제한 금지. P2 S1: 직접/간접 식별이라는 정의. P2 S2: 이름·연락·재정 정보라는 법정 예. P2 S3: 본인을 식별하는 회원/거래 기록이라는 독자 상황. P2 S4: 회사 전체 문서 열람과 본인 자료 요청의 차이. |
| JA 태풍 숙박 | P1 S1: 쌍방 무귀책 사유의 이행불능·예약금 및 기타 비용·즉시 무이자 전액 반환이라는 조건부 답. P1 S2: 그 답의 관할 공식 규범과 제9항을 찾을 근거. P2 S1: 태풍 발생이나 일본 출발 항공편 취소만으로 일률 환불되지 않는 한계. P2 S2: 태풍 취소를 다룬 공식 FAQ에서도 이행불능 조건을 둔다는 귀속. P2 S3: 실제 날짜·구간·숙소 영업과 예약 일정의 영향이라는 확인 행동. |

첫 두 문단에 빈 상황 도입·목차 예고·가짜 상담 경험·독자의 숨은 의도를 가정하는 문장이 없다. writer가 이미 삭제한 유언 P2의 `這個區別會影響文件的效力，而不只是外觀。`와 JA의 중복 조건 문장은 현재 최종본에 없으며, 그 삭제 이력은 evidence에서 읽었다.

## 개별 문체 판정

### 특휴 — APPROVE

제목의 두 상황은 회사의 날짜 결정권과 이미 신청한 병가 변경으로 연결된다. 도입이 바로 답하고, 연중 예정표·급한 업무상 변경 협의·신청 절차·병가 차감·사용 연도와 결산을 구별한다. 기록 예문은 실제로 인용한 문의 문구가 있으므로 법정 양식이 아니라는 짧은 표시는 기능이 있다. 앞선 B04에서 지적한, 제시하지 않은 표 양식 의무를 해명하는 문장과 다르다.

말미는 근로자 자신의 특휴·임금 기록과 날짜별 차감을 확인하는 행동으로 끝난다. 상담 CTA를 억지로 붙이지 않는다. 30일 통지·사용 연도·6개월·이월 합의·연말/계약 종료 지급의 차이를 줄이거나 부정문을 일괄 삭제할 이유가 없다. MUST·SHOULD 0건.

### 전기료 — APPROVE

한 도당 특정 고정가격을 제시하지 않고 독자가 실제 고지서의 기간·사용량·단가·배분을 맞추도록 쓴다. 표는 자료와 그 용도를 비교하므로 기능이 분명하다. 신계약 적용일·기존 계약·직접 납부·영업용/일부 주거 제외·도수 방식과 비도수 총액·건물 공용/집 안 공동 사용량을 서로 나눈다.

말미의 연락 링크는 여러 달 차액·갱신·배분 해석이 남은 경우 필요한 대조표와 연결된다. 집주인의 속임수나 전기요금 초과 징수를 미리 단정하지 않는다. 제18점의 별도 개정일을 전기료 시행일로 혼동하지 않도록 출처 목록 안에서 구별하는 짧은 설명은 문맥상 유지 가능하다. MUST·SHOULD 0건.

### 회사 장부 — APPROVE, 선택 S01

작은 지분의 비이사 주주라는 독자의 자격과 회사 유형을 시작부터 구분한다. 질문/열람·복사/전사·전문가 위임·답변 부족에 대한 기록 순서가 구체적이다. 감독권을 경영 책임 추궁·회사 문서 반출·임의 답변 기한으로 확대하지 않는다. 말미 CTA도 실제로 빠진 자료와 회사의 이유를 묻는 목적이 있다.

S01 — 비차단 SHOULD, `zh-hant-limited-company-shareholder-books-inspection-taiwan.md:35`:

> 這是查閱過程中保留資料的重要安排。

수정안: 위 마지막 문장만 삭제한다.

이유: 앞의 두 문장에서 기간별 비교·전문가 검토의 필요와 필요시 복사·전사에 회사가 협조해야 한다는 설명이 이미 있다. 마지막 문장은 추가 조건 없이 중요성을 추상적으로 반복한다. 삭제해도 자료 대상·필요성·공식 근거·회사의 협조 의무와 다음 문단의 구체 요청 방식은 그대로 남는다. 현 SHA도 의미 오류나 신뢰 훼손 수준의 문제는 없으므로 MUST로 분류하지 않는다. root는 이 선택안을 채택했으며 새 SHA에서 이 한 문장만의 삭제를 재확인한다.

### 자필유언 — APPROVE

타이핑한 내용을 직접 정했다는 것과 본인이 전문을 썼다는 것을 구분해 제목에 직접 답한다. 다섯 방식의 존재, 자필 형식·수정·다른 방식의 기록과 절차를 좁은 쟁점 안에서 설명한다. 모든 인쇄 문서가 무효라거나 서명·공증만 하면 자동 치유된다는 과장이 없다.

예전 상속 글의 광범위한 분배·친권·특류분으로 넓히지 않고 보관할 원본·수정 상태·여러 버전이라는 판단 자료로 끝낸다. 마지막 페이지의 서명만으로 판단하지 말라는 문구는 완전한 파일·형식 판단이라는 바로 앞 내용에 연결되므로 독자 부정행위를 가정한 훈계로 보지 않는다. MUST·SHOULD 0건.

### EN 개인정보 — APPROVE

평이한 동사로 사업자가 해야 할 응답과 이용자가 특정할 자료를 설명한다. Chinese terms를 영어권 이용자가 요청할 때 연결해 쓸 수 있도록 제시하고, 15일의 결정·필요한 연장·비용·법정 예외를 나눈다. 본인확인 자료의 안전한 전달 방법을 먼저 확인하도록 하되 비밀번호·결제 인증번호는 요청에서 제외한다. 사진 한 장으로 신분확인을 면제하거나 미국/EU 기한을 대입하지 않는다.

표와 세 법정 예외 목록은 실제 병렬 정보다. 말미는 과거 자료가 없는 것인지 보유하지만 제공하지 않은 것인지 구별해 묻는 행동으로 끝나며 광고나 재요약이 없다. 실제 summary는 155자, SEO는 36자이며 사이트 접미사 포함 51자다. 이는 문자 확인이며 저장소 QA 실행 주장이 아니다. MUST·SHOULD 0건.

### JA 태풍 숙박 — APPROVE

자연스러운 です・ます체로 여행자의 통지와 도착 시점을 다룬다. 日本発の便 취소라는 독자의 상황은 있지만 모든 일본 출발 여행자에게 자동 환불권을 만들지 않는다. 통상 취소에서 예약금과 전액 선불, 비례환급과 미리 합의한 사용액 보존을 구별한다. 날짜와 비율은 그 조건에 붙어 있어 번역 문장 축소로 분리하거나 지울 이유가 없다.

3개 본문 소제목은 실제 통지→반환 계산→합의 변경이라는 관계가 있으며 다른 글의 고정 3단계 틀을 재사용한 것이 아니다. 말미는 숙소의 판단 근거·적용한 금액·통지 도착일과 개별 날짜 예약의 범위를 설명한다. 실제 태풍 사례·항공편·환급 결과를 꾸미거나 상담을 강요하지 않는다. MUST·SHOULD 0건.

## 미디어 문구와 표시

여섯 편의 실제 alt/caption, writer의 view_image 관찰 기록, IMAGE-QA.md의 해당 섹션을 대조했다. 이 검수자가 PNG를 직접 보았다는 뜻은 아니다.

- 특휴는 날짜 없는 달력 격자·색 종이표·손을 묘사하며 실제 회사 배정이나 승인으로 부르지 않는다.
- 전기료는 추상 종이와 계량기를 설명하며 실제 요금·사용량·초과 징수의 증거로 읽지 않는다.
- 회사 장부는 격자 페이지·자료철·손을 묘사하며 실제 장부나 주주 신분을 확정하지 않는다.
- 유언은 산수 무늬 종이로 명시하고, 종이가 자필/타이핑 유언이나 실제 서명이라고 하지 않는다.
- JA는 비행기 아이콘·비·여행가방을 설명하며 실제 결항·태풍·환급 결정의 증거로 쓰지 않는다.
- EN은 추상 패널·노트·닫힌 파일철·고양이의 장면이며 실제 개인정보·접수·공식 답변이라고 하지 않는다.

모든 caption은 AI 가상 장면 고지를 유지한다. 내부 `author: legal-ai-assistant`는 있고 공개 AI 이름·프로필·푸터, 변호사 저작/감수 또는 원어민 승인 주장은 없다. 전문 독해에서 가짜 개인 경험·성과·근거 없는 트렌드·장식용 굵은 강조를 발견하지 못했다.

검수 날짜와 원고의 잠정 게시일은 구별했다. root가 대만 기준 실제 발행일을 확정할 수 있으나 실제 source-check 날짜를 함께 바꾸는 것을 승인한 것은 아니다. 후속 수정·KO 최종본 도착 뒤 그 입력과 변경 범위·최종 해시를 이 파일에 append한다.

## S01 반영 후 회사 장부 글 최종 문체 승인

판정: APPROVE. 회사 장부 글의 선택 SHOULD S01이 해소됐으며, 현재 검수한 여섯 편의 남은 문체 MUST·SHOULD는 모두 0건이다. KO 최종본은 별도 검수 후 추가한다.

- 원고: `zh-hant-limited-company-shareholder-books-inspection-taiwan.md:35`.
- 최종 원고 SHA-256: `bebc7a98a30cace2e31ac9508df5f829d3697fea45710fa2d108b1a0bdf26e4d`.
- 최종 evidence SHA-256: `6c6525ef06780389633f6614cc44ab4b165eff4836f463d13c773fa7c5fa8cfc`.

L35의 `這是查閱過程中保留資料的重要安排。` 한 문장만 삭제됐다. 앞의 비교·전문가 검토 목적과 비이사 주주의 적법한 감독권 행사, 복사/전사 필요·자료 대상·회사의 협조는 그대로다. 문단이 공식 설명에서 끝나도 다음의 구체 요청 방식으로 자연스럽게 이어진다.

최초 snapshot에서 해당 문장만 제거한 전체 원문이 현재 파일과 정확히 일치했고, 이 문장을 다시 넣으면 최초 원고 SHA `03c6a763bc5f3fabc528e84165b22757af4cc0b58df04af90516e46edad08a44`가 복원된다. 변경 행은 L35뿐이며 제목·summary·첫 두 문단·소제목·기타 본문·출처·날짜·이미지 문구·author는 불변이다. 본문의 한 문장이 삭제됐으므로 본문 해시 전체가 같다는 뜻은 아니다.

evidence의 최소 수정 이력을 읽고 이전 evidence 전체가 앞부분에 보존된 것도 확인했다. 최초 R1 검토서 SHA `ac6f4b9a8b8fc137378de8b9edbe0f67e69a94483b71375a2bdddd782876eb91`의 전체 기록을 보존하며 회사 글의 승인 해시만 갱신한다. 나머지 다섯 편 승인과 별도 법률·미디어·통합 검수 범위는 유지한다.


## KO 최종본 문체 검수 및 B05 일곱 편 최종 승인

KO 원고 `ko-taiwan-trademark-nonuse-three-years-korean-brand.md`를 제목·summary·본문·출처·이미지 문구까지 전문으로 읽었다. 판정은 APPROVE, MUST 0건·SHOULD 0건이다. 원고 SHA는 `33a642a2ed842fa7f386debc2b507f94eba528ce1859f642f2b75308b8ff6086`, evidence SHA는 `f76dc78592e44e286a1a307e5cf1d441dbf67283f0a02c3ca2f8982a07ff975b`다.

### 한국어 독자·문장·구성

대만 상표를 이미 등록한 한국 브랜드라는 독자와 한국 본사에는 자료가 없고 유통사가 현지 기록을 보관할 수 있다는 상황에 맞는다. 차분한 합니다체이며, 상표의 사용을 매출 한 수치로 환원하지 않고 상품·도안·허락 관계·지역·시간·자료를 연결한다. 선점 출원 분쟁이나 미수금 회수, 한국의 등록 규정을 설명하는 글로 바꾸지 않는다.

첫 두 문단은 다섯 문장을 각각 삭제해 다음 정보 손실을 확인했다.

| 문장 | 삭제하면 빠지는 정보 | 판단 |
|---|---|---|
| P1 S1 | 등록 후·정당 사유 없는 미사용/연속 중단·3년이라는 적용 조건 | 유지 |
| P1 S2 | 3년 경과와 자동 소멸의 차이라는 독자에게 필요한 답 | 유지 |
| P1 S3 | TIPO라는 처분 주체와 직권/신청이라는 경로·근거 | 유지 |
| P2 S1 | 본사의 직접 판매 외에 허락받은 대만 유통사의 지정상품·서비스 사용 기록이라는 경로 | 유지 |
| P2 S2 | 상표·상품·날짜·허락 주체를 실제 자료로 연결해야 한다는 확인 대상 | 유지 |

소제목은 실제 사용 품목·등록 도안→허락 관계와 지역→사용 중단 사유·재개 시점→연결할 자료→답변 통지의 순서다. 3년과 3개월을 같은 의미로 취급하지 않고, 신청을 알게 되어 시작했다는 사정과 신청 전 3개월이라는 기간을 함께 둔다. 지정 기한도 임의의 일수로 만들지 않는다. 문체 단축을 위해 이 조건·예외를 삭제할 필요가 없다.

증거 표는 본사와 유통사가 가진 서로 다른 자료의 연결을 보여 주며, 모든 항목이 법정 필수서류는 아니라는 한 문장은 실제 표의 성격을 설명한다. 마지막은 유통사에 요청할 상표·상품·기간을 특정하는 행동으로 끝난다. 허위 사용을 만들거나 과거 기록을 조작하려는 독자의 의도를 가정하지 않는다. 상담 CTA·상투적 재요약·추상적인 강조·가짜 경험을 추가하지 않았다.

### 최신 KO 세 편 비교

현재 checkout에서 published와 번호 순으로 확인한 아래 세 편의 실제 첫 두 문단·전체 소제목·말미를 읽었다. 모두 published는 2026-10-03이며, 운영 게시 시각의 별도 확인은 아니다.

| 실제 비교 파일 | 읽은 SHA-256 |
|---|---|
| `columns/167-taiwan-secondhand-seller-payment-verification-scam-korean.md` | `6d6db89596128daa09d8b11e58a97a1a9f00c713d5c7bc7a3f8bbc16bf55933e` |
| `columns/160-lost-korean-passport-taiwan-return-travel-documents.md` | `4e70b662751e4bc00258162d0cbfe23d78f4a738783d88099f68ba28895c1f14` |
| `columns/144-taiwan-protection-order-domestic-violence-korean-spouse.md` | `1b776ab0f872157612f5140860e1fc44cd372e1c8bd3aca1399b21b2784ece4d` |

중고 판매 글은 송금 지시 중단과 구매자→가짜 고객센터 기록, 여권 글은 대표부·이민서·항공사의 각 절차, 보호령 글은 신체 안전·보호 조치·거류와 가족 문제로 전개한다. 이번 글은 등록 유지와 상품별 사용의 입증이 중심이므로 그 긴급 대응이나 기관별 방문·상담 결론 틀을 재사용하지 않는다. 기존 세 글의 법률 내용을 이번 글의 근거로 사용한 것은 아니다.

### KO 이미지 설명과 날짜

승인된 retry 이미지에 관한 IMAGE-QA 추가 기록과 writer의 직접 view_image 관찰 기록을 읽었다. alt는 탁자 위 상자 두 개와 사람이 든 한 개를 구별해 총 세 개의 장면을 설명하며, 빈 태그·회색 선의 종이를 실제 판매나 상표 사용의 증거라고 하지 않는다. AI 가상 장면 caption과 내부 author가 유지된다. 거절된 최초 이미지의 분할 화면·저울·결과 기호를 최종 alt에 남기지 않았다.

이 검수자가 이미지를 직접 육안 검사한 것은 아니다. KO의 실제 자료 확인일 2026-10-04 한국시간과 잠정 공개일 2026-10-03은 timezone을 명시해 구별한다. 실제 확인일을 발행일에 맞춰 바꾸라는 제안은 하지 않았다.

### 최종 B05 일곱 편 SHA-256

일곱 편 모두 문체 APPROVE. 채택된 company S01은 해소됐으며 남은 문체 MUST 0건·SHOULD 0건이다. 아래는 최종 파일에서 다시 계산하고 승인 입력과 대조한 값이다.

| 원고 | 문체 판정 | 최종 원고 SHA-256 | 최종 evidence SHA-256 |
|---|---|---|---|
| `en-taiwan-personal-data-access-copy-request.md` | APPROVE | `12b95920da8a363e131380e2e1e78cb30bfebdeb3bcb52d9045f597e09d050b9` | `4163a4cf2132611d6360ef9238da977e7b88e5fe46f272d2027a1edf34e752db` |
| `ja-taiwan-hotel-typhoon-cancellation-refund-japanese.md` | APPROVE | `ef885b4d15a7e9e5708d3ccdcb9171aaf69689f1de39095156d356f3072c7c12` | `8f5031ca94ec7c7ee1911f3d0cce92e74b2aa571f00cfa7fcdf1b99343493648` |
| `ko-taiwan-trademark-nonuse-three-years-korean-brand.md` | APPROVE | `33a642a2ed842fa7f386debc2b507f94eba528ce1859f642f2b75308b8ff6086` | `f76dc78592e44e286a1a307e5cf1d441dbf67283f0a02c3ca2f8982a07ff975b` |
| `zh-hant-annual-leave-dates-employer-scheduling-taiwan.md` | APPROVE | `1604f34edbc7e87dbeaae3138df4496f8292ec907b0e536195227018bc82470f` | `ad66f4c2410d022cf52d3f8f25b36a18e71fb4f84744bbc53d5a84e7e704d2aa` |
| `zh-hant-handwritten-will-typed-print-signature-taiwan.md` | APPROVE | `716d115cdfb37120f7ea36e41b53bdc7a2989a83d8c477e51eb5c142f1e72b3c` | `fabcbd1369aed3bc5139ac6221a1f653362f7cf893c0651e7a7edf2f779c1d40` |
| `zh-hant-limited-company-shareholder-books-inspection-taiwan.md` | APPROVE | `bebc7a98a30cace2e31ac9508df5f829d3697fea45710fa2d108b1a0bdf26e4d` | `6c6525ef06780389633f6614cc44ab4b165eff4836f463d13c773fa7c5fa8cfc` |
| `zh-hant-rental-electricity-average-price-bill-taiwan.md` | APPROVE | `b5f2af0ec42bb8a763e636ac3a314147ac1b12644b8cbd0842dd5ba1170bc1df` | `d284b12ef7d8ee900751218248dd891c8ff85205ce95e44355736c5fcd76aebe` |

전문 독해와 별도 문자열 검사 결과, 모든 원고에 내부 author가 유지됐고 장식용 굵은 강조·공개 AI 작성자 문구·가짜 사람 저작/감수 주장이 없다. company의 지정 한 문장 삭제 외 앞서 승인한 여섯 원고에는 추가 변화가 없었다. KO도 전달받은 최종 freeze와 일치했다.

이 append 전 검토서 SHA `3d4fc49c31e1dd51687812f75960af64efafe31b1d180a22063a8489bad98587`의 전체 내용과 S01 해소 기록을 보존했다. 승인 범위는 위 SHA의 문체다. 법률·실제 이미지 육안·반응형 렌더링·테스트·빌드·배포 검증을 수행하거나 대신 승인했다는 뜻은 아니다. 원고·evidence·repo·이미지에는 변경을 가하지 않았다.

## 게시 예정일 2026-10-04 변경분 독립 문체 승인

판정: 일곱 편 모두 APPROVE. 이번 검수는 root가 지시한 날짜 세 필드의 변경분에 한정한다. 기존 본문 문체 승인을 유지하며 남은 문체 MUST 0건·SHOULD 0건이다.

root가 정한 게시 예정일은 Asia/Taipei 기준 2026-10-04다. `2026-10-04T00:00:00+08:00` 이전에 게시하지 않는다는 계획을 전제로 날짜 표시를 검수했다. 이 승인이나 새 날짜가 실제 통합·게시 완료를 뜻하지 않는다.

### 입력과 직접 대조 결과

`B05publication-date-delta.json`과 대응 `.md`를 읽었다. JSON의 실제 SHA-256은 전달된 `365c59e3676c7203ec79436ae77dc8e128f12d1cfe1cc5ffceb587f74fde719e`와 일치했다. JSON의 변경 전 원고/evidence 해시는 이 검수자가 앞서 승인한 일곱 편의 해시와 각각 대조했다.

직접 파일을 읽는 Python 검증과 보관한 승인 snapshot의 문자열 대조를 실행했다. 모두 PASS, Python exit 0이었다.

- 원고마다 `published`·`lastmod`·`date_display` 세 필드만 바뀌었다. EN은 L6·7·8, 나머지 여섯 편은 L5·6·7이다.
- 새 `published`와 `lastmod`는 모두 `2026-10-04`다. date_display는 ZH/JA `2026年10月4日`, EN `October 4, 2026`, KO `2026년 10월 4일`로 기존 언어별 형식을 유지한다.
- 세 필드를 원래 줄로 역치환한 전체 SHA가 각 변경 전 승인 SHA와 일치했다. 그 역치환 원문은 단지 해시만 일치한 것이 아니라 이 검수자가 저장한 각 승인 원문 전체와도 정확히 같았다.
- `bytes.split(b'---', 2)[2]`로 읽은 본문 전체와 날짜 세 줄 외 frontmatter가 불변이다. 제목·summary·SEO·첫 두 문단·법률 조건·기간·출처·source-check 날짜·내부 author·이미지 경로와 alt/caption 모두 변경되지 않았다.
- 일곱 evidence의 기존 바이트 수만큼 읽은 prefix SHA가 각각 변경 전 승인 evidence SHA와 일치했다. 추가 부분의 해시·길이와 날짜 변경 설명도 읽어 확인했다. 과거 원문·법률/문체 검수·미디어 이력은 보존됐다.
- 일곱 패키지 PNG의 실제 파일 SHA를 날짜 delta 기록의 이전 이미지 SHA와 대조해 모두 같음을 확인했다. 이미지 바이트 보존 검증이며, 새로운 육안 이미지 검수는 아니다.

본문의 실제 자료 확인일은 예정 게시일과 별개로 남아 있다. ZH·JA·EN의 10월3일 및 KO의 10월4일 한국시간 표기를 새 게시일에 맞춰 일괄 바꾸지 않았다. company S01의 한 문장 삭제도 이미 승인한 상태 그대로다. 이번에는 변경되지 않은 법률·문체의 전면 재검토나 새 출처 조회를 하지 않았다.

### 날짜 변경 후 최종 일곱 편 SHA-256

아래 표가 앞의 10월3일 메타데이터를 가진 최종 표를 갱신한다. 앞선 표·판정·company S01 수정 기록은 역사로 보존한다.

| 원고 | 문체 판정 | 날짜 변경 후 원고 SHA-256 | 날짜 변경 후 evidence SHA-256 |
|---|---|---|---|
| `zh-hant-annual-leave-dates-employer-scheduling-taiwan.md` | APPROVE | `20a552849dfdac6059e5421f9da59d73d24e80641a98a95649538eaf944324b8` | `de70adc56afc49c931a417055c75e2e4dfd147b269039a1e4cdfea89a19df143` |
| `zh-hant-rental-electricity-average-price-bill-taiwan.md` | APPROVE | `8c138752c9cac8efddb137a1a2d3c797219ef518142e114068fe44306a0f2696` | `39fc6a7b2fb01aa1358ca8b12ad63da7fdc38b71f126ce5e06c88cdd41d37270` |
| `zh-hant-limited-company-shareholder-books-inspection-taiwan.md` | APPROVE | `f090d3efa295ffef10c7e67c526df936d859a2b932612de594518d35b3732519` | `9582fbc251ff2293b35e8f530de3d8a711526d1fba018db9c7f26b8754a41cc5` |
| `zh-hant-handwritten-will-typed-print-signature-taiwan.md` | APPROVE | `85a70f86d213090db354fd6ddc21d2965c2b6c34df7f99f830178309c41ae2ad` | `dc23dd613fab607cf476931749f4ae3755a9ea64424bf064b222729b40643483` |
| `ja-taiwan-hotel-typhoon-cancellation-refund-japanese.md` | APPROVE | `3198cd71bceb934cd87721d1272e37899bea058059f5ac9f351851cba75c9934` | `5bfe1afdbc652a11caa6c13d9a7a4b3eaa0aabfc5a33bbe3728a081c578d1cb0` |
| `en-taiwan-personal-data-access-copy-request.md` | APPROVE | `b9eaae0327cd4099ef922df690ae3b8dc42103c4ddabd04ff405b20f6aabc668` | `8e2759d725d1fedde5e844284611a0ecd784980e63fd40f56053a33f384d36f9` |
| `ko-taiwan-trademark-nonuse-three-years-korean-brand.md` | APPROVE | `5c9b97aa5d6351a0857ac3ea111b28b0edb7a03f4eaffd6feaa74a496b431ef1` | `6b41fc1cd25c23585e56b3e10f2957c5606cccc6d4a237d691c0d70b456b33a5` |

이 append 전 검토서 SHA `7fb400c5913b8dd2e7f8e0533eccd01dbfa90cff141d95f6d7fd11bc0f6ecd4d`의 전체 내용을 그대로 보존했다. 이 검수자는 이 검토서 외 파일을 수정하지 않았다. 원고·evidence·미디어·repo·Git 변경, 준비 패킷 갱신, 테스트·빌드·실제 게시 또는 운영 확인을 수행한 것으로 기록하지 않는다.
