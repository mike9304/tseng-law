# Batch 002 — 독립 문체 검수 R1

검수일: 2026-10-03. 담당: editorial_inventory.
소유 파일: 이 검수서만. 원고·evidence·기존 칼럼·이미지·저장소를 수정하지 않는다.

판정은 아래 SHA 본문의 문체·독자 적합성·구조·표현의 오독 가능성에 한정한다. 법률 및 인용 자료의 사실, 이미지 실물, 빌드·배포를 검증했다는 뜻이 아니며 실제 변호사 또는 원어민 검수 표시로 사용할 수 없다. 작성자와 독립하여 준비된 원고 전문을 읽었다.

## 적용 자료와 비교 범위

- `WRITER-WORKORDER.md`, `TOPIC-BRIEFS.md`, checkout의 `docs/columns/EDITORIAL-VOICE.md`, `docs/columns/FRAUD-EDITORIAL-POLICY.md` 전문을 읽었다.
- 원문 표본 `/Users/son7/Downloads/半導體零組件企業進入台灣市場：在台子公司、分公司與代理商，該如何評估？－20260917.docx`의 실제 OOXML P1–P5를 다시 읽었다. SHA-256: `bc5721bdb532ef883986b9caf40c0ebefd0ed78dd7576048d3189483548ffd5d`. P2의 구체적 업무 요구, P3의 담당 주체·역할 구분, P4의 가상 사례·일반 정보 한계가 비교 기준이다. 신규 원고가 해당 변호사의 작성·검토를 받았다는 뜻은 아니다.
- 최근 같은 언어 3편은 검수 시점 checkout에서 published 내림차순, 동률일 때 번호 역순으로 골라 실제 첫 두 문단·소제목·출처 이전 말미를 읽었다. 통합 작업 중 번호가 바뀌어 writer ledger의 이전 번호와 차이가 있다. 아래 slug를 함께 사용한다.
- EN·JA writer evidence 전문을 읽었다. 다른 5편의 첫 snapshot 시점에는 evidence 파일이 아직 없었다. 원고 전문은 모두 읽었으며 writer의 검증 주장을 독립 법률 검증으로 바꾸어 기록하지 않는다.

| 언어 | 직접 비교한 최신 3편 | 관찰 및 새 글의 차이 |
|---|---|---|
| EN | 142 supplier-bank-account-change-bec; 136 export-controls-shtc-entity-list-us-ear-compliance; 122 road-rage-reversing-into-tailgater-no-self-defense | 기존 글은 각각 지급 승인, 대만·미국 수출허가, 실제 판결의 행위 순서로 시작한다. 새 글은 명시적인 가상 ARC 문의에서 시작하고 NIA·1990·165의 질문 종류를 나눈다. 기존 기업 CTA와 판결 결말을 복제하지 않는다. |
| JA | 141 rental-deposit-before-viewing-fraud; 135 japanese-equipment-maker-engineers-taiwan-work-permit; 122 road-rage-reversing-into-tailgater-no-self-defense | 기존 임대의 내견·권한, 취업허가의 활동·기간, 판결 사건의 행동 순서와 구별된다. 새 글은 숙박 예약 조건·발신자·카드정보 노출·취소를 나누며 주택 임대 규정을 가져오지 않는다. |
| KO | 143 unpaid-invoice-fraud-or-contract; 134 national-security-act-core-key-technology-korean-engineers; 122 road-rage-reversing-into-tailgater-no-self-defense | 기존 민형사 구별·준거법, 기술자료 권한, 실제 사건 도입과 달리 새 글은 분실증명·긴급여권·출국 확인의 담당 기관을 구분한다. 기업 거래 글의 구조나 상담 말미가 반복되지 않는다. |
| ZH | 140 fake-lawyer-scam-recovery-fee-taiwan; 139 land-registration-alert-property-fraud-taiwan; 138 cash-investment-courier-receipt-fraud-taiwan | 기존 변호사 조회·접촉자의 차이, 통지 단계, 경찰 공지·영수증의 한계를 비교했다. 새 4편은 음성 연락, 공연표 사용 가능성, 분양계약·대행·수취인, 주문 여부·착불 대납으로 독자와 자료가 달라진다. |

## R1 snapshot 판정

첫 전문 검수 후 파일을 다시 읽어 같은 SHA임을 확인했다. APPROVE는 현재 본문에 대한 판정이며 writer의 최종 동결 및 이미지 설명 변경 뒤 해시를 다시 확인한다.

| 파일 | 판정 | SHA-256 |
|---|---|---|
| `en-immigration-officer-impersonation-arc-taiwan.md` | APPROVE | `e56eec40ca7c2a5d78f30ee6ee9ca8eaf941ee07a510fd0f35d9d724bc8b3bfe` |
| `ja-taiwan-hotel-booking-extra-payment-phishing.md` | APPROVE | `58188cdd4e77a0d58e824fd28353de739d36a521c35c2ae5e61b945ad671f3db` |
| `ko-lost-korean-passport-taiwan-return-travel-documents.md` | REQUEST_CHANGES | `18bf0b24a4df5a66d0d244169eaa047c971cea3fe4facfc392c30073edc2d487` |
| `zh-hant-family-voice-impersonation-transfer-taiwan.md` | APPROVE | `b259449a7ec320768e7bb1bfb7eeb16a217f27b7f6e6f93a380b12a09ad65483` |
| `zh-hant-presale-home-payee-developer-agent-taiwan.md` | APPROVE | `8c94053d8bdf341987865c9fe1c54889db40b323701e1f8018aa7e00a399e0d5` |
| `zh-hant-secondhand-concert-ticket-screenshot-taiwan.md` | APPROVE | `60b4a69de952a42493f244506915e61f43942252b103dd8c43484764efb3c87c` |
| `zh-hant-unordered-cash-on-delivery-parcel-taiwan.md` | REQUEST_CHANGES | `29f1fa15fcb3fd8773b2ba4e466d9047fe3eae42b8456ec4a3ce584e67f80431` |

## 필수 수정

### KO-1 — 훈계식 가정 대신 준비할 사진을 직접 안내

대상: `drafts/ko-lost-korean-passport-taiwan-return-travel-documents.md:47`.

원문:

> 이민서가 요구하는 사진과 대표부의 여권 사진은 각 기관에 내는 준비물입니다. 한 곳에 제출한 사진이 다른 기관으로 자동 전달된다고 생각하지 말고 각각 준비합니다.

문제: 사진이 기관 사이에 자동 전달된다고 생각하는 독자를 새로 가정해 훈계한다. 두 문장 모두 기관별 사진 준비라는 같은 사실을 말하므로, 한 문장으로 준비할 사항을 직접 제시하면 된다.

교체문:

> 이민서에 제출할 사진과 대표부의 여권용 사진은 각 기관의 규격과 수량에 맞춰 따로 준비합니다.

보존 의미: 기관별 별도 준비를 유지하고, 28행의 이민서 사진 및 42행의 대표부 사진 규격·수량은 그대로 둔다. 뒤의 두 출처 링크를 보존한다. 신청 요건·사진 수량·법적 강도를 새로 판단하거나 바꾸는 제안이 아니다.

### ZH-COD-1 — 버리고 늦게 찾는 독자를 상상하는 문장을 행동 안내로 교체

대상: `drafts/zh-hant-unordered-cash-on-delivery-parcel-taiwan.md:21`의 마지막 절.

원문:

> 不要先把包裝丟掉，隔了幾天才開始找送件單號。

문제: 독자가 포장을 버리고 며칠 뒤에야 찾는 장면을 덧붙여 훈계하는 어조가 생긴다. 포장·운송장과 조회에 쓸 정보가 필요한 이유를 직접 말하면 충분하다.

교체문:

> 保留包裝與託運單，查詢時一併提供單號及寄件資料。

보존 의미: 실제 배송업체에 신속하게 조회하고 포장·운송장 정보를 남긴다는 목적을 유지한다. 앞 문장의 우편 대금 상태에 따른 구분과 중화우정 링크를 보존한다. 소비자보호법상의 보관 의무를 추가하는 문장이 아니며, 원고 41행의 실무상 증거 보존 권고와 같은 범위다.

Root는 위 두 문체 수정을 적용하도록 writer에게 전달했다. 이 기록 시점에는 수정 후 SHA 확인이 남아 있다.

## 첫 두 문단의 문장별 삭제 검토

각 문단 안의 문장 순서대로 검토한 결과다. 연결된 세부 조건을 임의로 지우지 않았다.

| 원고·행 | 첫 문단 | 둘째 문단 |
|---|---|---|
| EN 22·24 | 1문장: ARC·여권 사본·메신저라는 구체적 가정과 “Suppose” 표지. 2문장: 독립적으로 찾은 NIA 번호와 제출 전 행동. 각각 삭제하면 정보 손실. | 1문장: 기관 자료·날짜 및 연락 내용 기록 권고. 2문장: 전화라는 형식만으로 진위를 단정하지 않는 한계. 각각 보존. |
| JA 19·21 | 1문장: 취소 압박 상황과 원예약 조건 확인. 2문장: 결제 전 별도 연락 경로. 서로 다른 확인이어서 보존. | 1문장: 예약정보 일치의 한계. 2문장: 일본호텔협회의 공개 자료·날짜·수법. 3문장: 대만 당국의 과거 경고·연도. 관할·날짜를 지우지 않고 보존. |
| KO 22·24 | 1문장: 신청 상황과 필요한 두 서류. 2문장: 대표부 신청대상 설명·출처. 3문장: 분실 신고와 여권 발급의 담당 구별. 각각 역할이 있어 보존. | 1문장: 여권 발급과 대만 출국의 차이. 2문장: 해당 규정·조건. 3문장: 대표부·이민서·운항사 일정 고려. 법적 조건과 실제 계획을 분리하므로 보존. |
| ZH family 21·23 | 1문장: 익숙한 연락에도 기존 번호로 재확인할 행동. 2문장: 경찰 권고와 출처. 각각 보존. | 1문장: 합성 음성 및 원계정 탈취에 관한 서로 다른 출처. 2문장: 이번 요청과 과거 대화·음성의 구별. 보존. |
| ZH tickets 21·23 | 1문장: 주문 캡처에 있는 것과 확인되지 않는 것. 2문장: 문화부 자료의 구체적 근거. 보존. | 1문장: 실제 표와 본인의 사용 자격 구별. 2문장: 해당 공연의 공식 규칙 대조. 보존. |
| ZH presale 21·23 | 1문장: 계약·접객·수취인 불일치의 일반 상황. 2문장: 누구의 몇 회차 돈인지 질문. 3문장의 두 절: 이름 불일치로 사기를 단정하지도, 신탁·대행만으로 확인을 생략하지도 않는 한계. 보존. | 1문장: 회사가 다를 수 있다는 역할 구별. 2문장: 대행의 조문상 범위. 3문장: 개별 대금 수령·계좌변경 권한은 별도라는 한계. 보존. |
| ZH COD 21·23 | 1문장: 가족 대납 뒤 발견한 상황과 대금 상태 조회. 2문장: 중화우정의 대금 상태 차이. 마지막 훈계 절은 위 필수 수정으로 교체. | 1문장: 가족·타인의 실제 주문 여부 확인. 2문장: 정확한 주소와 주문 의사의 차이. 3문장: 일반 소비자와 영업 구매의 적용 범위. 범위를 줄이지 않고 보존. |

## 독자·반복 구조·말미 판정

- EN은 영어 사용자 개인의 거류 연락을 다루며 미국 국적·미국 기관을 독자 전제로 삼지 않는다. 가정임을 명시하고 실제 ARC 사기 캠페인이나 상담 사례로 꾸미지 않는다. 연락처 표는 실제 질문·기관을 비교하므로 억지 3단계 틀이 아니다. 말미의 문의 링크는 한 번이며 여권 원본 스캔을 처음부터 보내도록 압박하지 않는다.
- JA는 일본에서 예약하거나 대만에 머무르는 단기 여행 독자에게 맞춘다. 원래 결제 조건, 발신자 확인, 카드정보 노출 대응, 양국 연락 경로가 구별된다. 상담 광고 없이 필요한 기관 안내에서 끝난다.
- KO는 한국 여권으로 입국한 여행자의 질문에 집중한다. 사진·접수시간·발급문서·항공사 조건을 기관에 연결한다. 단수여권과 여행증명서, 새 문서와 출국 절차의 구별이 중심이며 단순 사기 글 번역이 아니다. 끝은 분실 신고 후 다시 찾은 여권과 예약 정보다.
- ZH family는 원음·원계정과 현재 연락자의 동일성, 실제 재확인 기록을 구별한다. 연락자·친족·계정 운용자·수취인을 하나로 단정하지 않는 문장으로 끝난다. 상담 CTA가 없다.
- ZH tickets는 주문 화면·수령 정보·실제 입장, 해당 공연 규칙, 가격 규제와 반환을 나눈다. 일반 규칙을 모든 공연에 적용하지 않는 한계가 본문에 있다. 한 번의 문의 링크는 자료와 청구 상대 검토에 연결된다.
- ZH presale은 계약 당사자·대행·수취인·이행 보장 문서를 연결한다. 법정 유형 비교에 필요한 5행 표를 사용하며 다른 글과 동일한 세 가지 목록이 아니다. 다음 회차 대금과 이미 낸 대금 처리라는 실제 질문으로 말미를 맺는다.
- ZH COD는 미주문 여부, 가족 대납, 소비자 규정, 우편 대금 상태를 구분한다. 마지막 공동 수취 안내는 본문 사안을 가족의 다음 행동으로 연결하며 상담 권유가 없다. 첫 문단의 훈계 절만 필수 수정으로 남겼다.

전문을 읽은 범위에서 허구의 개인 상담 경험, 신규 원고에 대한 실제 변호사·원어민 승인 주장, 수임 압박·회수 보장을 발견하지 않았다. 장식용 `**`·`__`·HTML strong/b는 7편 모두 검색 결과 0건이며, 내부 `author: "legal-ai-assistant"`는 7편 모두 있다. 이미지 고지와 내부 작성 이력을 보존한다. 공개 본문에 AI 저자 byline을 추가하라는 제안은 하지 않는다.

## 후속 확인

writer 수정본과 최종 이미지 설명이 도착하면 원고 SHA를 다시 계산한다. 본문 변경은 다시 읽고, alt/caption만 바뀌었을 때도 그 범위를 해시·diff로 확인하여 이 문서에 append한다. 현재 남은 필수 문체 지적은 KO-1과 ZH-COD-1 두 항목이다.


## R2 addendum — 문체 수정 반영본

R1의 두 필수 수정은 실제 파일에서 확인했다. 현재 아래 본문은 7편 모두 문체 APPROVE이며 남은 필수 문체 지적은 없다. 이것은 writer의 최종 동결이나 이미지 확정을 대신하지 않는다. 이후 본문·frontmatter 변경은 다시 대조한다.

| 파일 | R2 본문 판정 | 확인 SHA-256 |
|---|---|---|
| `en-immigration-officer-impersonation-arc-taiwan.md` | APPROVE | `e56eec40ca7c2a5d78f30ee6ee9ca8eaf941ee07a510fd0f35d9d724bc8b3bfe` |
| `ja-taiwan-hotel-booking-extra-payment-phishing.md` | APPROVE | `58188cdd4e77a0d58e824fd28353de739d36a521c35c2ae5e61b945ad671f3db` |
| `ko-lost-korean-passport-taiwan-return-travel-documents.md` | APPROVE | `50da15dcf1614f7efa623c3c03e70d8cf57f1f6da78f996f76c5159934285d2e` |
| `zh-hant-family-voice-impersonation-transfer-taiwan.md` | APPROVE | `b259449a7ec320768e7bb1bfb7eeb16a217f27b7f6e6f93a380b12a09ad65483` |
| `zh-hant-presale-home-payee-developer-agent-taiwan.md` | APPROVE | `8c94053d8bdf341987865c9fe1c54889db40b323701e1f8018aa7e00a399e0d5` |
| `zh-hant-secondhand-concert-ticket-screenshot-taiwan.md` | APPROVE | `60b4a69de952a42493f244506915e61f43942252b103dd8c43484764efb3c87c` |
| `zh-hant-unordered-cash-on-delivery-parcel-taiwan.md` | APPROVE | `cb55b582120efbd6faf10a66c3a76031d0718d27b475b60daf81849dc2c9c248` |

- KO 47행은 제안한 문장으로 교체됐으며 기관별 사진의 수량·규격과 두 출처 링크가 보존됐다.
- ZH COD 21행은 “保留包裝與託運單，查詢時一併提供單號及寄件資料。”로 바뀌었다. 대납 상황, 대금 상태에 따른 처리 구분, 중화우정 링크가 보존됐다. 문장 연결도 세미콜론 대신 마침표로 정리됐다.
- KO는 22·24행 도입, 53행 소제목, 65·67행 확인 안내, 69행 여권 분실신고 범위, 77행 기관명도 바뀌어 수정본 전문을 다시 읽었다. 글의 전개 예고 없이 담당 기관·행동을 제시하며, 회수·발급·탑승 보장이나 개인 경험을 새로 넣지 않았다.
- 수정된 KO 첫 문단의 두 문장은 신청 상황·필요 서류와 대상 설명을 각각 담고, 둘째 문단의 두 문장은 대만 출국 규정과 기관별 확인을 각각 담는다. 삭제하면 해당 조건·행동이 사라져 유지할 근거가 있다.
- KO 69행은 한국 여권 담당 기관에 한 신고와 대만 경찰에 한 신고를 구분한 의미 변경이다. root에게 법률 검수 담당도 이 SHA를 확인하도록 전달했다. 이 문체 검수에서 법적 효과의 정확성을 독립 확인한 것은 아니다.
- 나머지 다섯 원고 본문은 R1 SHA와 같았다. ZH family·tickets의 evidence가 도착하여 독자·가정 구분·최근 글 비교·자기 수정 기록 부분을 추가로 읽었고, 문체 판정을 바꿀 근거는 없었다.

R1 최초 기록은 그대로 두고 이 결과를 덧붙였다. 최종 이미지 alt/caption 및 이후 법률 수정 때문에 SHA가 달라지면 변경 범위를 확인해 별도 addendum을 남긴다.

R2 종료 readback: writer가 통지한 KO `50da15dc…`, ZH presale `8c94053d…`, ZH COD `cb55b582…` 동결값은 위 표와 일치했다. 일곱 원고 모두 파일에서 다시 계산한 SHA가 위 R2 표와 일치하며, 이 시점에는 일곱 evidence 파일도 존재한다. evidence 파일의 존재를 독립 법률 승인으로 간주하지 않는다. 최종 미디어 문구 변경 전의 본문 판정은 일곱 편 모두 APPROVE다.


## R3 FINAL — 이미지 문구 변경 대조 및 최종 7편 동결

검수일: 2026-10-03. 최종 판정: 아래 7편 모두 문체 APPROVE. 남은 필수 문체 수정 없음.

R2에서 보관한 원문과 현재 파일을 직접 대조했다. 각 파일의 `featured_image_alt`와 `featured_image_caption`만 R2 값으로 역치환하면 전체 파일이 R2 원문과 정확히 일치한다. 따라서 본문, 제목, summary, 조문·수치·조건·링크, 이미지 공개 경로, 내부 author 및 기타 metadata는 변하지 않았다. 바뀐 부분은 EN·JA·ZH presale·ZH COD의 alt/caption 각 2줄, KO·ZH family·ZH tickets의 alt 각 1줄뿐이다.

### 최종 원고·근거표 SHA-256

파일명은 `drafts/`와 `evidence/`에서 같다. SHA는 각 파일의 실제 bytes로 계산했다.

| 파일 | 문체 판정 | 최종 draft SHA-256 | 최종 evidence SHA-256 |
|---|---|---|---|
| `en-immigration-officer-impersonation-arc-taiwan.md` | APPROVE | `b686efffeaec7f25e1f2d3567e57f14d67092eb4468754c5e146b9691c22ea37` | `11ed16ebd45aa98e101378d9af532b96b666068c71354a569417cd074fa06a2e` |
| `ja-taiwan-hotel-booking-extra-payment-phishing.md` | APPROVE | `a402ed2491c2d2195b3fce3c95ccf06734ce884eb6f39da96afbffed0a2f739f` | `4e0c2cd2712084e8efed89e82375e78aa5883242c3a494e89d4500d4dd6c5a87` |
| `ko-lost-korean-passport-taiwan-return-travel-documents.md` | APPROVE | `4e70b662751e4bc00258162d0cbfe23d78f4a738783d88099f68ba28895c1f14` | `b2f3be0a086c8d717ac9e9d1ca135aaff07737ee237c8bdea2cfd97fc007142c` |
| `zh-hant-family-voice-impersonation-transfer-taiwan.md` | APPROVE | `489b8568d76ed6b13e8bcd015097a07ea5fa1a36b713ba569c3b5ba66f30f030` | `1f624b6c63e3ada1a4e08a60b7a9cc8e73d506fdc02db61e2932330b78765ea9` |
| `zh-hant-presale-home-payee-developer-agent-taiwan.md` | APPROVE | `bb5901db9103cf702315284207e09962e1e89ba6c5cdfd9b8d47253e08664dda` | `9d6caab6dfaaa167c79de67808784f19e084ec25a7de6595789f726c4c71aa5e` |
| `zh-hant-secondhand-concert-ticket-screenshot-taiwan.md` | APPROVE | `27cf9d54e7c56439edeed89de9a8c58f6776c4898e8054c3370d6298b7d32d64` | `bbc2d34627ce906f77e574db96823bf8bd978077c4448d4dfe4bb98a3c244a3d` |
| `zh-hant-unordered-cash-on-delivery-parcel-taiwan.md` | APPROVE | `b0bfb5a29b2b4326451f067625752aeea8d14a764df760d43517cd6c978c2180` | `f69ae14d9fee792a1e0d5c36d89bfb5f6fefabb65b3d3a7f32e00de624481ffb` |

### 최종 이미지 문구 판정

`IMAGE-QA.md` 전문과 `IMAGE-MANIFEST.json`의 선택 파일·관찰·공개 경로·해시 항목을 읽고 대조했다. 이 검수자가 7개 이미지를 다시 육안 검사한 것은 아니다. 실제 장면의 근거는 image-packaging 담당과 각 writer가 `view_image`로 확인하여 남긴 관찰 기록이다. 선택된 PNG 7개의 실제 해시는 manifest의 해시와 모두 일치하고, 원고의 이미지 경로도 manifest의 해당 공개 경로와 일치했다.

| 원고 | 변경 문구 확인 및 의미 |
|---|---|
| EN | 수화기·서류철·노트북 연락 아이콘을 묘사한다. 화면을 실제 NIA 웹사이트나 서류를 실제 ARC로 부르지 않는다. caption은 AI 가상 장면과 실제 거주자·정부 웹페이지·신분서류·사건이 아님을 명시한다. |
| JA | 객실에서 종이 자료와 스마트폰을 비교하는 손을 묘사한다. 수정 전 이미지의 ‘수화기를 들고 있음’을 현재 장면에 덧붙이지 않는다. caption의 架空·AI生成과 실제 인물·시설·예약 화면·피해 사례 배제를 유지한다. |
| KO | 빈 짙은 녹색 여권 케이스와 주변 짐·종이·휴대전화의 설명이다. 이를 유효한 여권이나 여행서류로 지칭하지 않는다. 원래의 AI 설명용 이미지·실제 사건 재현 아님 고지를 유지한다. |
| ZH family | 집 전화 수화기·음성 파형·흐린 사진을 묘사한다. 파형이 실제 사기 음성이라는 주장이나 신원을 특정하는 설명을 넣지 않는다. 기존 AI示意·실제 친족/통화기록/사건 아님 caption을 유지한다. |
| ZH tickets | 가상 티켓 화면과 종이 티켓 형태, 흐린 무대 조명을 묘사한다. 기존 caption이 표와 화면 모두 허구이며 실제 공연표·아티스트·사건이 아니라고 명시한다. QR 같은 무늬의 유효성·스캔 가능 여부는 검사하지 않았고 문구도 이를 주장하지 않는다. |
| ZH presale | 주택 모형·도면·문서를 살피는 장면이다. 삭제된 지급 흐름도를 설명에 되살리지 않았고 법정 지급 절차라고 지칭하지 않는다. AI虛構 장면, 실제 인물·건안·계약 아님 고지가 있다. |
| ZH COD | 문 앞 상자·휴대전화·닫힌 지갑과 두 사람의 손을 묘사한다. 현금 지급 완료, 물류업체 신원 또는 범죄자라는 설명이 없다. AI 가상 수취 장면과 실제 수취인·택배·거래기록 아님을 명시한다. |

alt는 화면 설명으로 읽히고 caption은 가상성을 밝힌다. 새 개인 경험·작성자 신분·변호사 또는 원어민 승인·법률 결론·압박 광고를 추가한 문구는 없다. 장식용 굵은 강조도 추가되지 않았다.

대조에 사용한 기록:
- `IMAGE-QA.md` SHA-256: `7a5a83ac12a43032dc5575588c0c7e09ca19ae69f550c82fa3799c4039ea730d`.
- `IMAGE-MANIFEST.json` SHA-256: `4c4606c621ece29017d61676124ee44bc74a690cf467108dcc7a0886970ba431`.

R1·R2 본문은 보존하고 이 최종 결과만 append했다. 승인 범위는 위 동결 SHA의 문체와 이번 이미지 문구 변경이다. 새 법률 자료 조회·법률 재검증·이미지 제작/편집·브라우저·빌드·배포 검수는 수행하지 않았다.

## R4 — EN SEO 제목 한 줄 변경 최종 재검수 (2026-10-03)

판정: APPROVE. 다른 여섯 편의 R3 승인은 유지한다. 이번 변경은 `en-immigration-officer-impersonation-arc-taiwan.md:3`의 `seoTitle` 한 줄이다.

최종 문구는 `Taiwan ARC Scam Calls: Verify the Caller`이다. 실제 NIA 기관 자체를 의심하는 것으로 읽힐 수 있는 중간 문구 `Verify the NIA`를 사용하지 않고, 신분을 주장하는 발신자 확인이라는 본문의 의미를 보존한다. 제목은 40자, 전달받은 사이트 접미사 ` | Hovering Law`를 포함하면 55자다. 이 계산은 길이 검증이며 통합 SEO 테스트 실행을 뜻하지 않는다.

현재 원고를 직접 읽어 최종 SEO 한 줄을 R3 문구로 역치환했을 때 R3 전체 원문과 정확히 일치함을 확인했다. 본문·공개 title/H1·summary·이미지 메타데이터와 나머지 frontmatter는 변경되지 않았다. 본문 SHA-256은 `3bc0ffdff2043874e48bad0d7b345fcaf5c918db6269ba737e5208df7e565dac`다. 나머지 여섯 편은 원고와 evidence 모두 R3 해시와 일치했다.

| 원고 | 판정 | 최종 원고 SHA-256 | 최종 evidence SHA-256 |
|---|---|---|---|
| `en-immigration-officer-impersonation-arc-taiwan.md` | APPROVE | `72074c977db099759425a3f4879e300e30caa8650e4ffd4fade4e5ba7216c256` | `a9b132bb09d70f366b6d50f9a505a5752576645cbcc44435004be4241865cf0d` |

위 원고 해시가 EN의 최종 통합 대상이며, `861612c9…` 중간본과 `b686efff…` R3본을 대체한다. R1–R3 기록은 수정하지 않았다. 법률·이미지 실물·빌드·배포 재검수는 이번 범위에 포함하지 않았다.
