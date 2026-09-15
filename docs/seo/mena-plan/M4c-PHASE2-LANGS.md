# M4c phase 2 언어 후보 — tr / fa / he / ur (+ ku 참고)

> **초안 · 총괄 미승인 · 제안만**
>
> 권고가 아니다. 채택·순서·보류는 **사용자가 결정**한다.

| 항목 | 값 |
|---|---|
| 작성 | 2026-09-16 · 문서 워커 Grok 4.6 · 총괄 Fable 5.1(son7-db) |
| 범위 | `ar`(phase 1 안내 로케일) **다음으로 검토할** 중동·서아시아 언어 후보. 구현·라우팅·번역 발주 없음 |
| 조회일 | 2026-09-16 (KST). 숫자는 출처 원표 칸값을 그대로 더하거나 옮긴 것만 |

## 0. 계약 · 등급 · 주장하지 않는 것

- 언어 계약: `ar`·본 후보 모두 **안내(guidance) 언어** 후보. 상담 언어는 **English / Chinese / Japanese / Korean** 뿐. 아랍어·터키어·페르시아어·히브리어·우르두어·쿠르드어 **상담·통역 가능 표기 금지**.
- 안내 페이지 키는 코드 기준 10개: `home` · `services` · `about` · `lawyers` · `pricing` · `contact` · `faq` · `privacy` · `disclaimer` · `columns` (`src/lib/public-guidance.ts` `GUIDANCE_PAGE_KEYS`). **필요 문자열 수 = ar와 동일(안내 10페이지).** 시간·단가 추정은 하지 않는다.
- 등급: **A** 대만 이민서·교육부·경제부·재정부·행정원 등 대만 공식. **B** 상대국 정부·주재 대표처·국제 표준/제재 당국. 출처 없는 규모 = **미확인**. 검색량·트래픽·점유율·ROI는 적지 않는다. 승소율·최고·유일 표현 없음.

## 1. 후보 한눈에 (대만 연결 · 검색/AI · 민감도 · RTL · 문자열)

체류·배우자·학생은 내정부 이민서 `外僑居留人數統計表11507.ods`, 자료 기준일 **115년 7월 31일**(2026-07-31), 자료출처 移民事務組. 시트 `07_現持有效居留證(按國籍及職業)`의 男+女. 배우자 시트 `27_現持有效外僑居留證之外籍配偶（按國籍及區域）`의 `合計` 男+女. 移工 소계 행은 원표 병합 칸이 `｜小計`로 읽힌다.

| 후보 | 대만 내 연결 (A, 없으면 미확인) | 검색·AI 언어 관행 (B만) | 법률·정치 민감도 (사실만) | RTL | 문자열 |
|---|---|---|---|---|---|
| **ur** 우르두어 (파키스탄) | 유효거류 **1,087**(男738+女349). 學生 **523**. 商務 34·工程師 48·教師 41. 移工 소계 칸 0. 외국인 배우자 **88**. 교육부 국적별 外國學生 표 이번 세션 미확인. 교역·투자 금액 미확인. **신남향 대상국 목록에 파키스탄이 있다**(A, §2) | 파키스탄 헌법 제251조: 국어 Urdu, 공식 용도로 English 사용 가능(B, 국회 PDF). UAE 정부 팩트시트: 공식 언어 Arabic, 표지판 Arabic and English, widely spoken에 **Urdu** 포함(B). **검색창·AI 질의 언어 비율 미확인** | 주파키스탄 대만 대표처 URL(`roc-taiwan.org/pk`) 이번 세션 **404**. 주인도 센터 領務轄區는 네팔·방글라데시·부탄을 적고 파키스탄은 적지 않음(A 페이지 사실, 관할 결론은 내리지 않음) | **RTL**. W3C가 Urdu를 RTL 스크립트 사용 언어로 열거. ar RTL(`dir=rtl`·논리 속성) **재사용 가능**(기술 사실, 공수 추정 아님) | ar와 동일(안내 10페이지) |
| **tr** 터키어 (터키) | 유효거류 **487**(372+115). 學生 **93**. 商務 **78**·工程師 18·教師 12. 移工 소계 칸 0. 외국인 배우자 **190**. 교육부 外國學生 국적 세목 미확인. 교역·투자 금액 미확인. 신남향 목표시장(東協十國·南亞六國·澳紐)에 **터키 없음**(A, §2) | 터키 헌법 MADDE 3: 「Dili Türkçedir」(B, Anayasa Mahkemesi). UAE 팩트시트 widely spoken에 **Turkish** 포함(B). **검색·AI 질의 언어 비율 미확인** | 주안카라 **타이베이경제문화대표단** 사이트 존재(A, 대만 공식). 대사관 명칭이 아님 | **LTR**(라틴 문자). ar RTL 인프라 재사용 대상 아님. SEA 안내 로케일(vi/id/th/fil)과 같은 LTR 축 | ar와 동일(안내 10페이지) |
| **fa** 페르시아어 (이란; 다리어는 별 표기) | 유효거류 **318**(209+109). 學生 **83**. 商務 19·工程師 11·教師 **36**. 移工 소계 칸 0. 외국인 배우자 **53**. 아프가니스탄 유효거류 **4**(商務 2) — 다리어 수요로 연장하지 않음. 교육부 세목·교역·투자 금액 미확인. 신남향 목표시장에 **이란 없음** | UAE 팩트시트 widely spoken에 **Farsi** 포함(B). 이란 헌법 공식 언어 조문 이번 세션 미확인. **검색·AI 질의 언어 비율 미확인** | 미국 OFAC **Iran Sanctions** 프로그램 페이지 존재(B). 대만 `戰略性高科技貨品輸出入管理辦法`(A, 무역법 위임)은 이란을 **국명으로 적지 않음**. 대만–이란 결제·SWIFT 영향 **미확인**. `roc-taiwan.org/ir` **404** | **RTL**. W3C가 Persian을 RTL 스크립트 사용 언어로 열거. ar RTL **재사용 가능** | ar와 동일(안내 10페이지) |
| **he** 히브리어 (이스라엘) | 유효거류 **233**(174+59). 學生 **18**. 商務 **40**·工程師 16. 移工 소계 칸 **1**(移工廚師 1). 외국인 배우자 **51**. 교육부 세목·교역·투자 금액 미확인. 신남향 목표시장에 **이스라엘 없음** | 이스라엘 기본법 *Israel — the Nation State of the Jewish People*(크네세트 비공식 영문) 제4조: Hebrew is the language of the State; Arabic has a special status(B). **검색·AI 질의 언어 비율 미확인** | 주텔아비브 **타이베이경제문화판사처** 사이트 존재(A). 주타이베이 **Israel Economic and Cultural Office in Taipei**(B, 이스라엘 외무부 도메인). 양측 모두 대사관 명칭이 아님. **사이트 톤 판단은 총괄·사용자** — 이 칸은 사실만 | **RTL**. W3C가 Hebrew를 RTL 스크립트(및 그 스크립트 사용 언어)로 열거. ar RTL **재사용 가능** | ar와 동일(안내 10페이지) |
| **ku** 쿠르드어 (참고) | 이민서 국적 칸에 **쿠르드 없음**. 인접 국적 유효거류: 이라크 **26**, 시리아 23, 터키는 위 행. 교역·투자·유학 세목 미확인. 신남향 대상 아님 | 공용어·검색·AI 관행 **미확인**(B 출처 없음) | 단일 로케일로 묶을 국가 단위가 이민서에 없음 | **미확인**. W3C RTL 열거에 Kurdish 없음. 라틴(쿠르만지) / 아랍 문자(소라니)가 갈린다는 점은 이 세션의 A/B 문서로 확인하지 못함 | ar와 동일(안내 10페이지) — 착수 전제 아님 |

`07` 시트 합계 행 전체 유효거류 **1,183,361**(男585,505+女597,856). 위 네 국적 합은 이 모수의 부분이며, 동남아 안내 4언어 국적(印尼 383,535 등)과 자릿수가 다르다. 그 차이를 수요·ROI로 환산하지 않는다.

## 2. 정책 문서 (A) — 신남향 vs 중동

- **신남향 정책강령**(행정원 전재, 공표 중화민국 105년 8월 16일): 대상 서술을 **「東協、南亞及紐澳」**로 고정. 터키·이란·이스라엘을 적지 않는다. URL: `https://newsouthboundpolicy.trade.gov.tw/Html?nodeID=1206`
- **신남향 정책 추진계획**(105년 9월 5일 PDF): 목표시장 **東協十國 · 南亞六國 · 澳洲、紐西蘭**. 같은 PDF는 「東協十國及南亞六國」을 반복한다. 파일: `https://newsouthboundpolicy.trade.gov.tw/Files/Pages/Attaches/12/新南向政策推動計畫_0905.pdf`
- **신남향 정책 전망** 국가 링크는 파키스탄·인도·방글라데시·네팔·스리랑카·부탄을 남아시아 쪽에 올려 둔다(홈 지도/목록). 터키·이란·이스라엘 링크는 이 홈에 없다. URL: `https://newsouthboundpolicy.trade.gov.tw/`
- **중동 전용** 대만 정부 정책강령(신남향과 동급의 「중동 정책」문서): 이번 세션 **미확인**. 무역서 글로벌 상권 페이지에 「중동지구」필터는 있다(`ListWorld.aspx?areaID=4`). 관세서 상호작용 도표에 무역상대 **「中東」** 범주가 있다. 둘 다 **국별 금액은 정적 HTML에 없어 미확인**.

## 3. 결론 — 근거 등급별 후보 표 · 결정은 사용자

표 순서는 **A급으로 확인된 대만 내 유효거류 합계 내림차순**이다. 채택 권고가 아니다. ku는 참고 행.

| 순서 | 후보 | A로 확인된 것 | B로 확인된 것 | 미확인 | RTL |
|---|---|---|---|---|---|
| 1 | ur | 거류 1,087 · 학생 523 · 배우자 88 · 신남향 국가 목록에 PK | 헌법(Urdu+English) · UAE widely spoken에 Urdu | 교역·투자 금액 · 교육부 外國學生 세목 · 검색/AI 질의 언어 · 주PK 대표처 | RTL, ar 재사용 가능 |
| 2 | tr | 거류 487 · 학생 93 · 배우자 190 · 주안카라 대표단 사이트 · 신남향 목표시장에 없음 | 헌법 「Dili Türkçedir」 · UAE widely spoken에 Turkish | 교역·투자 금액 · 교육부 세목 · 검색/AI 질의 언어 | LTR |
| 3 | fa | 거류 318 · 학생 83 · 배우자 53 · 신남향 목표시장에 없음 · 대만 전략물자 법령에 이란 국명 없음 | OFAC Iran Sanctions 페이지 · UAE widely spoken에 Farsi · W3C Persian RTL | 교역·투자·결제/SWIFT · 이란 헌법 조문 · 검색/AI 질의 언어 · 주이란 대표처 | RTL, ar 재사용 가능 |
| 4 | he | 거류 233 · 학생 18 · 배우자 51 · 주텔아비브 판사처 · 신남향 목표시장에 없음 | 주타이베이 Israel Economic and Cultural Office · 기본법 제4조 히브리어 · W3C Hebrew RTL | 교역·투자 금액 · 교육부 세목 · 검색/AI 질의 언어 · 사이트 톤(판단 안 함) | RTL, ar 재사용 가능 |
| 참고 | ku | 이라크 거류 26 등 인접 국적만 | (없음) | 언어 수요 · 공용어 · RTL 단일성 · 교역 | 미확인 |

**결정은 사용자.** 이 문서는 후보와 출처만 정리한다. phase 2 로케일을 열지, 하나만 열지, 보류할지는 총괄 검수와 사용자 승인 뒤에만 간다.

## 4. 출처

| # | 등급 | 출처 | URL | 조회일 | 쓴 값 |
|---|---|---|---|---|---|
| S1 | A | 대만 내정부 이민서 『外僑居留人數統計表11507』, 시트 07 | 목록 `https://www.immigration.gov.tw/5385/7344/7350/外僑居留/?alias=settledown` · 파일 `https://www.immigration.gov.tw/media/121153/外僑居留人數統計表11507.ods` | 2026-09-16 | §1 거류·직업(학생·상무 등) |
| S2 | A | 같은 파일 시트 27 | (S1과 동일) | 2026-09-16 | §1 외국인 배우자 |
| S3 | A | 신남향 정책강령 | `https://newsouthboundpolicy.trade.gov.tw/Html?nodeID=1206` | 2026-09-16 | 東協、南亞及紐澳 |
| S4 | A | 신남향 정책 추진계획 PDF | `https://newsouthboundpolicy.trade.gov.tw/Files/Pages/Attaches/12/新南向政策推動計畫_0905.pdf` | 2026-09-16 | 東協十國·南亞六國·澳紐 |
| S5 | A | 신남향 정책 전망 | `https://newsouthboundpolicy.trade.gov.tw/` | 2026-09-16 | 홈 국가 목록에 파키스탄 |
| S6 | A | 전략적 고기술 물품 수출입 관리 방법 | `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0090013` | 2026-09-16 | 이란 국명 없음 · 수출허가 일반 규정 |
| S7 | A | 주텔아비브 타이베이경제문화판사처 | `https://www.roc-taiwan.org/il/index.html` | 2026-09-16 | 기관명 |
| S8 | A | 주안카라 타이베이경제문화대표단 | `https://www.roc-taiwan.org/tr/index.html` | 2026-09-16 | 기관명 |
| S9 | B | Israel Economic and Cultural Office in Taipei | `https://embassies.gov.il/taipei/en` | 2026-09-16 | 기관명 |
| S10 | A | 주인도 타이베이경제문화센터(領務轄區) | `https://www.roc-taiwan.org/in/index.html` | 2026-09-16 | 네팔·방글라데시·부탄. 파키스탄 미기재 |
| S11 | B | 터키 헌법 MADDE 3 | `https://www.anayasa.gov.tr/tr/mevzuat/anayasa/` | 2026-09-16 | Dili Türkçedir |
| S12 | B | 이스라엘 기본법(비공식 영문) 제4조 | `https://main.knesset.gov.il/EN/activity/Documents/BasicLawsPDF/BasicLawNationState.pdf` | 2026-09-16 | Hebrew is the language of the State |
| S13 | B | 파키스탄 헌법 제251조 | `https://na.gov.pk/uploads/documents/1333523681_951.pdf` | 2026-09-16 | National language Urdu; English may be used for official purposes |
| S14 | B | UAE 정부 팩트시트 | `https://u.ae/en/about-the-uae/fact-sheet` | 2026-09-16 | Arabic official; signs Arabic and English; widely spoken에 Urdu·Turkish·Farsi |
| S15 | B | W3C Structural markup and right-to-left text in HTML | `https://www.w3.org/International/questions/qa-html-dir` | 2026-09-16 | Hebrew·Persian·Urdu를 RTL 스크립트 사용 언어로 열거 |
| S16 | B | US OFAC Iran Sanctions | `https://ofac.treasury.gov/sanctions-programs-and-country-information/iran-sanctions` | 2026-09-16 | 이란 제재 프로그램 페이지 존재(금액·결제 경로 세부는 미인용) |

교육부 대전과 외국학생 국적별 원표, 경제부 투자심의 국별, 재정부 관세 국별 금액은 조회를 시도했으나 이 문서에 쓸 칸값을 확인하지 못했다 → **미확인**(워커 보고서).
