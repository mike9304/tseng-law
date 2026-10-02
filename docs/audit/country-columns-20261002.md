# 일본·베트남 독립 칼럼 검수 — 2026-10-02

두 독자층에 맞춰 별도 주제로 집필했다. 070은 베트남 노동자의 여권·ARC 반환, 071은 일본 여행자의 대만 가열담배·전자담배 반입이다. 번역본을 만들지 않았다. 기존 063–069와 Grok 작업, 교통사고 허브, son-7.com은 변경하지 않았다.

## 작성·검수 근거

- 집필: 로컬 Codex CLI의 실제 런타임 `gpt-6-astra`(기존 ChatGPT 로그인). 두 초안의 공개 자료 입력과 원고 응답이 있으며 도구 호출은 0회였다.
- 독립 검수·수정: Claude Code `opus` 별칭의 실제 응답 모델 `claude-opus-5-5`(기존 Claude Max 로그인). R1에서 원문 대조와 문장별 수정, R2에서 통합 파일 확인, R3에서 일본어 법적 범위 표현 한 곳의 정확한 보정을 확인했다.
- 새로운 API 키·결제·자동충전 설정, 스케줄 생성은 하지 않았다. 모델 검수를 원어민·변호사 검토로 표시하지 않는다. 모델 응답의 list-price 추정치는 실제 청구액 증거로 사용하지 않는다.
- 작성·검수 프롬프트 모두 `docs/columns/EDITORIAL-VOICE.md` 전문을 포함했다. 문체 규칙 자체는 변경하지 않았다.
- 최종 승인 전 각 파일을 SHA-256으로 계산했고 아래 해시는 검수자가 읽은 입력 파일의 식별자와 일치한다. 모델이 해시를 계산했다고 주장하지 않는다.

| 언어 | 파일 | 승인 SHA-256 |
|---|---|---|
| vi | `src/content/columns-vi/070-taiwan-employer-broker-passport-arc-return.md` | `9340e02fe85b847cc7576f2359e8eb51639e5ab38e3550e65f2e13b3c902e04a` |
| ja | `src/content/columns-ja/071-taiwan-entry-japan-heated-tobacco-vapes-duty-free.md` | `906f7a9d0f43a088611c64f73001d78fbea4813a45c9e69e41d03724912f414a` |

## 원문 대조와 실제 수정

전체 `원문 → 문제 → 수정문 → 보존 조건`은 [검수 원문 기록](./country-columns-20261002-review.json)에 남겼다. 주요 수정은 다음과 같다.

- 베트남어: 고용주의 제57조제8호와 직업소개기관·직원의 제40조제1항제10호를 구분했다. 단순 보관과 위법한 유용 표현, 사용자의 의사 조건, 제67조의 6만–30만 대만달러 행정벌 및 무허가 소개업자 범위를 조문과 대조했다. 행정벌은 노동자에게 지급되는 배상금이 아님을 보존했다.
- 베트남어: 본문 작성 방식을 설명하던 문장과 반복 출처 문장을 삭제했다. 임시 서류 인계의 목적·동의 조건을 남겼고 법정 반환기한이나 정식 신고 필수서류 목록은 만들지 않았다.
- 1955: 최초 연결 자료만으로 베트남어 전화상담을 증명할 수 없다는 지적을 반영해 WDA의 별도 공식 전화상담 소개 페이지를 직접 확인하고 추가했다. 베트남어·24시간·무료 통화 안내가 명시돼 있다. 신고 비밀유지 의무를 절대적인 보복 방지 보장으로 바꾸지 않았다.
- 일본어: 일본 구매 제품은 면세 대상에서 제외되는 정도가 아니라 반입 자체가 금지된다는 점을 명확히 했다. 2026-02-01부터의 승인 제품 200본 예외, 20세 이상·자가사용·네 종류 중 하나라는 조건을 유지했다.
- 일본어: 제26조제2항의 비제조·수입업자 범위, 5만–500만 대만달러 행정상 과료, 기한부 조치와 반복처벌을 확인했다. 가열담배는 「必要な構成部品」로 범위를 정확히 제한했다. 신고가 처벌 면제나 반입 허가를 보장하지 않는다는 조건을 보존했다.
- 두 글 모두 `author: legal-ai-assistant`를 사용한다. 중복 본문 AI 식별자는 제거하고 사이트의 AI 작성자 표시는 유지했다. 제목·요약·본문의 장식용 굵은 강조는 없다.

## 첫 두 문단 삭제 검수와 최근 세 편 비교

### vi

- 원문: Theo [Điều 57, điểm 8 Luật Dịch vụ việc làm (就業服務法)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=57), chủ thuê không được giữ trái phép hoặc chiếm đoạt hộ chiếu, giấy tờ cư trú hay tài sản của người lao động nước ngoài mà mình thuê.
  - 유지 이유: The employer-specific prohibition, its 'unlawful' standard, the covered items (passport, residence documents, property), and the only citation to §57(8).
- 원문: Công ty môi giới việc làm tư nhân và nhân viên của công ty chịu quy định riêng tại [Điều 40, khoản 1, điểm 10](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=40): khi làm dịch vụ việc làm, họ không được giữ giấy phép, giấy tờ tùy thân hoặc giấy tờ liên quan trái ý muốn của người lao động hoặc chủ thuê.
  - 유지 이유: The separate agency/staff rule, its different 'against the will' standard, the employment-service scope, and the only citation to §40(1)(10); without it the penalty paragraph's reference to §40 has no antecedent.

040, 039 and 038 all open with an imagined scene (late-night domestic violence, a press-machine injury, a frozen bank card) and only then state the law. This piece opens with the two actor-specific rules and no scene. Those three use 7–9 H2 headings ending in 'Nguồn tham khảo chính thức' and close with a long URL list plus a 'Ngày kiểm tra' line, with a generic validity caveat in 040 and 038. This piece has three H2s, cites sources inline, and ends on the substantive point that a document complaint does not replace employer-transfer or residence procedures. One functional overlap remains: like 039 ('Giấy tờ nên giữ…', 'Gọi ai giúp…'), it has a record-keeping passage and a hotline section. Here they are prose tied to the document-return dispute rather than a checklist, so I kept them. All three recent titles use a colon pattern, so the title was changed to a 'Khi…' clause. The earlier VI overstay article is not duplicated; residence is mentioned only to separate it from this dispute.

### ja

- 원문: 日本で購入した加熱式たばこは、台湾の免税枠200本の対象にならず、本数にかかわらず持ち込めません。
  - 유지 이유: The direct answer to the title question, and that the bar is on import itself, not only on duty-free treatment, regardless of quantity.
- 원문: [基隆税関が2026年7月7日に更新した案内](https://web.customs.gov.tw/keelung/singlehtml/179?cntId=a1acc24970b645088e400aa84e3a54dd)は、衛生福利部の承認を受けた加熱式たばことその構成部品は海外では販売されておらず同一の品目もない、という国民健康署の説明を示したうえで、海外で買った加熱式たばこを持ち込まないよう求めています。
  - 유지 이유: The factual basis and date anchor for the opening answer, the attribution to 國民健康署, and customs' express request.
- 원문: 台湾では加熱式たばこは指定たばこ（指定菸品）に当たり、健康リスク評価審査を経て衛生福利部の承認を受けた製品とその必要な構成部品でなければ輸入できません。
  - 유지 이유: The legal category, the approval requirement and authority, and the coverage of necessary components; this explains why non-approval means non-importability.
- 원문: 電子たばことその構成部品は、輸入そのものが禁止されています（[菸害防制法第15条](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=L0070021&flno=15)第1項第2号・第3号）。
  - 유지 이유: The absolute e-cigarette ban (no approval route), distinct from heated tobacco, and the only §15 citation.

067 and 066 both open with a statute citation and its requirements, and 058 opens with a practical step (identify the seller). This piece opens with the direct answer to its title question and puts the §15 rule second. It shares a statute-forward second paragraph with 067 and 066, which suits a prohibition article. 067 has five H2s, 066 four and 058 three, each ending with a reference-list heading (参照した公式資料／参照資料). This piece has two H2s and no source list, since links are inline. Endings: 067 and 066 close with a URL list and 確認日, and 058 with a firm-contact paragraph. This piece ends on the substantive limit that declaring does not guarantee no penalty, with no promotional or consultation line. Titles: 067, 066 and 058 are noun phrases (two with colons). This title is a question that the first sentence answers, so the form is not repeated.

## 출처·검수 범위

공식 조문과 행정기관 공개 안내를 2026-10-02에 직접 확인했다. 국외 제품 안내는 기륭세관의 2026-07-07 갱신 통지를 날짜와 함께 인용하고, 타이베이세관 2026-05-20 통지와 대조했다. 보건당국 심사현황 페이지는 검색 결과를 확인했으나 직접 열기는 시간 초과라 독립적인 최신 심사 완료 검증으로 취급하지 않았다. 현지 변호사·사람 원어민 검수는 받지 않았다.

일본·베트남 공개 칼럼은 파일 기반 경로라 이 작업에서 CMS 로그인이나 CMS 쓰기는 필요하지 않았다. 원격 main 기준본 227편과 시사 게시판을 함께 검색했다. 기존 베트남 체류 시사 글의 짧은 여권 언급과는 서류 반환이라는 질문·대상·절차가 다르다.

## 기술 검증

검수 승인과 게시·배포 성공은 별개다. 최종 기술 검증과 실제 URL 읽기 결과는 작업 완료 인계에 기록한다.
- typecheck: exit 0 (2026-10-02T03:04:45.444319+00:00).
- lint: exit 0 (2026-10-02T03:05:07.529449+00:00).
- focused: exit 0 (2026-10-02T02:55:01.995450+00:00).
- unit: exit 0 (2026-10-02T03:09:22.208157+00:00).
- security: exit 0 (2026-10-02T03:09:22.472992+00:00).
- build: exit 0 (2026-10-02T03:04:49.571913+00:00).

- 전체 검사 최종 결과: Test Files  1370 passed (1370); Tests  13513 passed | 14 skipped | 1 todo (13528); Duration  253.43s (transform 16.01s, setup 1.29s, collect 108.87s, tests 259.85s, environment 143ms, prepare 49.99s).
- 초기 41개 React 검사 실패는 복사된 `node_modules/node_modules` 링크가 원본 저장소를 가리켜 두 React를 로드한 작업본 환경 문제였다. 복사본의 링크만 제거한 뒤 전체 테스트가 통과했다. 패키지 설치나 원본 저장소 변경은 없었다.
- 로컬 프로덕션 PC 1440×1000 및 모바일 390×844의 두 언어, 총 네 화면에서 HTTP 200, 모든 원고 문단 일치, AI byline/작성자 박스, native meta/Article JSON-LD, 자기 언어 hreflang, 이미지·넘침·페이지 오류를 확인했다. 저장된 스크린샷에서 제목·도입·본문의 실제 가독성을 직접 확인했다.
- 기존 공통 베트남 사이드바의 일부 영어 UI와 기존 중립 표지 이미지는 이 글의 작성 범위에서 변경하지 않았다.
