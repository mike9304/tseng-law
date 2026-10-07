# 최종 원고 독립 재검수 C — r2

판정: APPROVE

검수자: GPT-6 Astra / reasoning max, 독립 검수자 C. 날짜: 2026-10-07 KST.

FINAL-CONTENT-SHA.json의 401~404 × ko/en/ja/zh-hant/vi 20편을 모두 읽고 본인의 r1 지적, 수정으로 생길 수 있는 법률·번역·문체 회귀, 제목·요약·FAQ·이미지 설명을 확인했다. 마지막 수정인 401 VI·JA와 EN 4편의 메타데이터/404 본문도 다시 읽었다. 아래 20개 SHA는 보고서 작성 직전에 파일 바이트와 대조하여 모두 일치했다. 다른 검수자의 보고서를 읽거나 의견을 교환하지 않았고 원고를 수정하지 않았다.

이 판정은 AI의 독립 법률·언어·문체 검수 결과다. 실제 변호사 감수 또는 현지 원어민 검수가 수행됐다는 뜻이 아니다. 게시판 코드·배포·실제 운영 화면 승인은 이 원고 판정과 구분한다.

## 미해결 지적

이 SHA 범위에서 발행을 막을 법률 오류, 법적 강도 오역, FAQ 충돌, 의미 없는 단문으로 인한 반려 사항은 남아 있지 않다. 기존 권고 중 단독 반려 사유가 아니었던 표현을 새 필수 조건으로 확대하지 않았다.

## 원문 → 이유 → 수정 확인 → 보존 조건

| 대상 | 종전 문제와 이유 | 최종 수정 확인 | 보존된 법적 조건 |
| --- | --- | --- | --- |
| 401 제183조 | 원고 일부가 증언거부 이유의 소명만 설명하여 제181조에 관한 具結 대체 예외를 빠뜨림 | 5언어 본문·해당 FAQ에서 권한 있는 기관이 제181조 사유에 대해 선서 진술을 명할 수 있음을 확인 | 제181조에 한정한 대체, 기관의 재량, 출석과 거부 허용의 구별, 수사 중 검사/재판 중 해당 재판장의 판단 |
| 401 해외 증인 | 해외 체류를 자동 면제처럼 오해할 가능성 | 국제형사사법공조에 따른 요청 가능성과 개별 처리 확인을 설명 | 외국 기관 요청에 따른 공조·면책 판단을 자동 면제나 강제 귀국의 일반 명령으로 바꾸지 않음 |
| 401 VI | `người tự truy tố`, 제180조 공범 관련 번역, `hỏi đối chất` | 自訴人을 `người tự tố`로 설명하고, 제180조 제2항의 다른 공동 피고인/공동 자소인 관계를 구별. 제181-1조는 `hỏi chéo (反詰問)`로 수정 | 대질(對質)과 반대신문의 구별, 피고인 외의 자, 주신문에서 진술한 피고인 본인 관련 사항이라는 한정 |
| 401 JA·KO 이미지 | JA 허용/불허 판단 문구 중복, KO 이미지 생성 표시 | JA 중복 제거와 명시적 AI 이미지 설명 확인 | 제183조 결정 주체와 예외, 실제 사건 사진으로 오인시키지 않는 표시 |
| 402 JA | `その効力は他の一人だけの問題ではありません`로 제239조 효과 누락, `判決を待ってからでは遅い場合があります`의 불명확한 비교 | 다른 공범에게도 고소/취소 효력이 미친다는 문장을 복원. 판결 전이라도 1심 변론 종결 뒤에는 늦는다는 설명 확인 | 고소가 소추 요건인 죄, 공범, 고소와 취소 양쪽의 효과, 제1심 변론 종결 전이라는 시점 |
| 402 EN/JA/VI/ZH | `Check the timing.`, `署名の順序が問題です。`, `Thời điểm ký rất đáng lưu ý.`, `也要看其他共犯。`의 빈 강조 | 해당 구호·중복 삭제 후 전체 문단과 다양성 지표 재확인 | 미지급만으로 취소가 되살아나지 않음, 취소한 사람의 재고소 제한, 지급·취소·공범 효과의 구별 |
| 402 VI | `cán bộ tư pháp cảnh sát`의 중국어식 어순 | 사법경찰의 `cảnh sát tư pháp` 표기 확인 | 검사/사법경찰관, 서면·구두 고소, 구두 고소 조서 작성 |
| 403 VI | 수사 완결·재의 이유 있음에도 기소 명령을 `có thể`로 약화 | 완결 시 기소를 명하여야 하는 강도로 복원 | 이유 있음, 수사 완결 여부, 상급 결정권자와 원 검찰서의 역할. 기소 명령을 유죄로 취급하지 않음 |
| 403 JA·KO | `告訴人でしょうか。` / `新しい資料ですか。`의 대상 없는 질문, KO 빈 강조 | JA 질문을 제거하거나 제출 여부를 설명하는 문장으로 바꿈. KO는 수령·번역의 실제 문제로 시작 | 고소인 자격, 기존/새 자료 모두 설명할 수 있음, 새 자료만 필요하다는 새 요건 없음 |
| 403 기간 보완 | 최초 계산일·도착 기준·송달 효력의 실무적 오해 가능성 | 5언어에 수령일 초일 불산입, 보충송달·기탁송달의 법적 효력 확인, 접수처 도착, 휴일·재도기간 검토를 확인 | 실제 나중에 읽거나 번역한 날이 일률적인 기산점이 아님. 우편 발송일만으로 적시 접수가 보장되지 않음. 임의의 해외 가산 일수 없음 |
| 404 EN | `recovery of proceeds`가 追徵을 범죄수익으로 좁힘 | `recovery of equivalent value`로 수정 | 제133조상 증거/몰수 대상 압수와 가액 추징 보전 압수의 구별 |
| 404 KO·EN | `같은 조의 구별을 보존해야 합니다`는 편집자 지시, EN의 새 정보 없는 단문 | KO를 처분/송달에 따른 기산 설명으로 바꿈. EN 빈 단문 삭제와 `Temporary return is discretionary.` 확인 | 제416조 처분을 받은 사람·검사 처분·소속 법원, 처분일부터/송달을 받은 때부터의 구별, 10일·이유서·제417조, 임시 반환의 재량·보관 책임 |

401~404 모두 topic은 기존 스키마의 litigation이며 criminal-litigation 태그를 보존했다. 내부 author는 legal-ai-assistant, audience는 해당 언어다. 굵은 강조 기호/태그를 사용하지 않는다.

## 법률·공식 출처 확인 범위

각 r1에서 현행 중국어 공식 원문을 직접 열람했고, 최종 추가 조문과 기간 설명은 r2에서 추가 직접 열람했다. 법규자료고 페이지의 자료 정비 기준일은 2026-09-24였다. 모든 관보를 별도 전수 조사했다거나, 실패한 페이지 열람을 성공했다고 기록하지 않는다.

- 401: 형사소송법 제175·178·180·181·183·99·192조와 국제형사사법공조법 제30~32조 대조. 추가된 [제181-1조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=181-1)의 반대신문 한정도 직접 읽었다. [제183조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=183)의 具結 예외와 결정 주체를 보존했다. 사법원 중문·베트남어 용어 자료에서 自訴人과 對質를 별도로 확인하여 반대신문 용어 회귀를 지적·해소했다.
- 402: [제237조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=237)의 고소권자·범인을 안 때·6개월, [제238조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=238)의 1심 변론 종결 전·재고소 제한, 제239·242·252·303조의 공범·접수·절차상 종결을 대조했다. [고검 안내](https://www.tph.moj.gov.tw/4421/4475/632364/886836/post)도 직접 읽었다. 다른 고검 안내(1054056)는 원 URL open이 timeout되어 공식 검색 결과에서 관련 본문을 확인했으며, 전체 페이지 직접 열람 성공으로 보고하지 않는다. 핵심 법률은 현행 조문과 별도로 대조했다.
- 403: [제256조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=256), 제258·258-1·258-3·65·66조 및 제321·323조를 대조했다. r2에서 [제62조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=62), [민법 제120조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=120)·제122조, 민사소송법 제137·138조를 직접 읽었다. [타이베이 지검 재의 안내](https://www.tpc.moj.gov.tw/292885/976681/661783/1088793/post)의 다음 날 계산과 원 처분 검찰서 도착 기준도 원문에서 확인했다. 보충송달/기탁송달의 실제 효력은 별도로 확인하도록 하여 늦은 독해일로 기간이 재시작된다는 오해를 막는다. 재의 후 법원 허가 신청은 별도의 10일·변호사 위임·자격 제한을 유지한다.
- 404: 제133·139·[142조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=142)·[416조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=416)·제417조 및 형법 제38·38-1조를 직접 대조했다. 계속 유치 불필요 시 사건 종결 전 반환 의무, 임시 반환 재량, 신청 주체·보관 책임, 재판 중 사유 있는 복제 신청/비용 선납, 불복 대상·기관·기산 구별이 유지됐다.

## 언어·FAQ·이미지·독자 효용

20편의 FAQ 40개는 본문의 주요 조건과 충돌하지 않는다. 번역문에서 법적 의무를 임의 재량으로 약화하거나 대만의 고소/자소/재의를 각 독자 국가의 절차와 동일시하는 새로운 문장은 발견하지 않았다. 한국·미국·일본 독자에게는 귀국·언어·중국어 문서 문제가, 베트남 독자에게는 대만 절차상 지위 설명이 구체적으로 제시된다. 번체중문은 대만 독자가 실제 서류에서 볼 용어를 사용한다.

EN 4편 최종 summary는 본문 범위를 벗어난 약속을 추가하지 않으며 150~160자 메타데이터 테스트를 통과했다. EN seoTitle은 사이트명 접미사를 포함한 60자 계약을 따르고 401의 불필요 항목은 제거됐다. 해당 두 기존 테스트 파일(14개 테스트)을 이 검수자가 직접 실행하여 통과 출력을 확인했다.

실제 이미지 두 장을 열어 보았다. 401/404는 창가의 빈 테이블·의자, 402/403은 서류 봉투 위의 손이며 대체문구·AI 생성 캡션과 부합한다. 실제 의뢰인 사진이나 압수 현장이라는 주장이 없다. 본문에 변호사/원어민 감수 완료, 성공률, 허구의 수임 경험을 넣지 않았다.

## 문장 다양성 최종 재실행

최종 SHA의 ko/en/ja/zh-hant 16편에 각각 다음 명령을 직접 실행했다. 모두 종료 코드 0, FAIL 0이다. vi 4편은 도구 미지원으로 수동 독해만 했고 다른 언어 옵션으로 통과 판정을 만들지 않았다.

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <파일>`

| 번호 | 언어 | 문장 수 | CV | 짧은 문장 비율 | 유사 길이 3연속 | 결과 |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| 401 | ko | 28 | 0.472 | 0.250 | 0.000 | FAIL 0, 종결 WARN 89% |
| 401 | en | 39 | 0.526 | 0.256 | 0.027 | FAIL 0 |
| 401 | ja | 30 | 0.459 | 0.167 | 0.000 | FAIL 0, 정중체 WARN 93% |
| 401 | zh-hant | 31 | 0.519 | 0.194 | 0.069 | FAIL 0 |
| 402 | ko | 23 | 0.523 | 0.174 | 0.000 | FAIL 0, 종결 WARN 78% |
| 402 | en | 31 | 0.517 | 0.258 | 0.000 | FAIL 0 |
| 402 | ja | 26 | 0.453 | 0.192 | 0.000 | FAIL 0, 정중체 WARN 96% |
| 402 | zh-hant | 25 | 0.472 | 0.120 | 0.087 | FAIL 0 |
| 403 | ko | 30 | 0.462 | 0.133 | 0.036 | FAIL 0, 종결 WARN 87% |
| 403 | en | 34 | 0.569 | 0.294 | 0.000 | FAIL 0 |
| 403 | ja | 33 | 0.478 | 0.273 | 0.065 | FAIL 0, 정중체 WARN 97% |
| 403 | zh-hant | 28 | 0.520 | 0.214 | 0.038 | FAIL 0 |
| 404 | ko | 28 | 0.479 | 0.214 | 0.000 | FAIL 0, 종결 WARN 82% |
| 404 | en | 28 | 0.516 | 0.250 | 0.038 | FAIL 0 |
| 404 | ja | 27 | 0.456 | 0.222 | 0.080 | FAIL 0, 정중체 WARN 93% |
| 404 | zh-hant | 26 | 0.508 | 0.192 | 0.000 | FAIL 0 |

정중체 비율 경고만으로 반말·상체 혼합을 요구하지 않았다. 일본어 질문의 자동 q=0은 실제 でしょうか 문장의 부재를 뜻하지 않는다. §5 수동 확인에서는 문서 식별형 401, 지급·취소의 위험형 402, 번역·수령 시점형 403, 반환 요건형 404로 도입이 구별되고 정형 가상 사례가 없다. 같은 문단 시작의 3회 반복과 주장→조문→다만의 3문단 연속은 발견하지 않았다. 지원 언어는 정보가 있는 짧은 문장을 2개 이상 포함하며 인용 없는 설명 문단도 있다. 종결은 각 주제의 서류·기록·기한 문제로 닫히고 일반 판촉·허구의 1인칭 서사는 없다. 과도한 대비 정형구 및 자동 수치만을 위한 빈 단문은 최종에서 남은 반려 사유가 아니다.

## 최종 SHA-256

| 파일 | SHA-256 |
| --- | --- |
| `src/content/columns/401-taiwan-criminal-witness-summons-refuse-testimony.md` | `25dadb43503a5e2fce65ae5484835808f35d30ebc96cc3c98dd08580ab8dc9e7` |
| `src/content/columns-en/401-taiwan-criminal-witness-summons-refuse-testimony.md` | `5cdd0b07f6328198438958ecb644ecabd0a7a38b7ffb0100e54cf9dc71b3531f` |
| `src/content/columns-ja/401-taiwan-criminal-witness-summons-refuse-testimony.md` | `a48c07d03daace7f447f74c782ac260bcdd7e53f7a2a206601743bd0a3ab2018` |
| `src/content/columns-zh/401-taiwan-criminal-witness-summons-refuse-testimony.md` | `4bab8f3569a1b75fa09b85ad261aec3e3e795bbe9417480a4c4fe92906a953fb` |
| `src/content/columns-vi/401-taiwan-criminal-witness-summons-refuse-testimony.md` | `f6896792468e010d61ab18a97ff0977daad43bd0d5c0a0d981342b34ed3e2412` |
| `src/content/columns/402-taiwan-criminal-settlement-withdraw-complaint.md` | `bba30feaeb8abf4d8216d551642bb7623e0d18de89268ae12d6821bec1cfd518` |
| `src/content/columns-en/402-taiwan-criminal-settlement-withdraw-complaint.md` | `44d187f8d64ff937ddd43e05cc6983ad4edb50aaf2d4c9042ddc832162bba211` |
| `src/content/columns-ja/402-taiwan-criminal-settlement-withdraw-complaint.md` | `89f56503c2693327f52b2759e33b77267bf0a14c5287c55dfb55198acd8e6064` |
| `src/content/columns-zh/402-taiwan-criminal-settlement-withdraw-complaint.md` | `c62114a0d462a54f4fd5b95d0740a6b9a8c393792d444b649f73b6f9a2117571` |
| `src/content/columns-vi/402-taiwan-criminal-settlement-withdraw-complaint.md` | `5dc99c5ac9eff4f782ccd63d6ed1087c1d233a262bd0bc91f6048be0302dfd3d` |
| `src/content/columns/403-taiwan-non-prosecution-reconsideration-deadline.md` | `e896bf24c23e2d05fb2badc1253aaf2b77a071633f7e40c665198b99d739f2e8` |
| `src/content/columns-en/403-taiwan-non-prosecution-reconsideration-deadline.md` | `8057c67d33492cd198c6b96d496d977ba0e6566d930dc11212f19d48f1fa0e0d` |
| `src/content/columns-ja/403-taiwan-non-prosecution-reconsideration-deadline.md` | `834c4c2e83a72875cb8c3062f488d5760cac42367c1559108880fb35f87960a6` |
| `src/content/columns-zh/403-taiwan-non-prosecution-reconsideration-deadline.md` | `ed9dce773a818d51d914d1877a9a65418a004eb7ecd8ab0e7cd3b941e952959c` |
| `src/content/columns-vi/403-taiwan-non-prosecution-reconsideration-deadline.md` | `686c23f361a911a1bc8443bb0029ad0b3a9383a2d335af617f5c82fad22a3c0a` |
| `src/content/columns/404-taiwan-seized-phone-property-return.md` | `a3d5e1469748878c6cf8798697fde8df9c4c5b3eaef72198b1507b6a352a8697` |
| `src/content/columns-en/404-taiwan-seized-phone-property-return.md` | `a69faf9717b737b8b89a814f2ec412841391e4477825168047c2b3649939fb63` |
| `src/content/columns-ja/404-taiwan-seized-phone-property-return.md` | `8d1473b8d285207e6801fee3c0d74c764cf5beed73109f3572cfc45f417a404f` |
| `src/content/columns-zh/404-taiwan-seized-phone-property-return.md` | `08818c6e457849b458268bdc21651c2c59e44ae432cb70206205a053f22c7aac` |
| `src/content/columns-vi/404-taiwan-seized-phone-property-return.md` | `826b5162d6854bc3e7900123e0265f3d96b71257398e1f6757f3b046d6126071` |

이 보고서는 위 파일 바이트에 대한 승인이다. 이후 본문·FAQ·메타데이터가 바뀌면 변경분 확인 없이 이 판정을 자동 승계하지 않는다.
