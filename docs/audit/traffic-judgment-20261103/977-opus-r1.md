# 977 교통사고 (KO·ZH·EN) — Opus 5.5 최종 검수 r1

- 판정: **FIX** (MUST 0, MINOR 2, NIT 1)
- 검수 대상(sha256 앞16): ko b000d7b56acd39f6 / zh-hant 978525a2c57031db / en d47ee5b2ba023084 (스냅샷 review/_snap/drafts_c_977-*.md.<sha>)
- 판결 대조: FJUD 차단 → **잠정 대조**. 대조본은 특별보상기금(mvacf.org.tw) 공개 PDF. 3개 언어판 본문 링크가 모두 같은 URL이고, 직접 내려받으면 HTTP 200 application/pdf이며 sha256 앞16 `db80f954564f64b7`로 src/pcdv107-2236.pdf와 같음.
- 조문: law.moj LawSingle 원문 대조. 強制汽車責任保險法 6·29·40·42(①②③④)·49(1款 汽車 3,000~15,000, 2款 9,000~32,000), 民法 184(①前段·②)·191-2 → 인용 내용 모두 일치. 976 PASS본과 같은 서술(29조 범위, 42조 제4항 친족 예외)을 유지함.
- 이미지 c977-featured-01.webp(1280×720): 직접 열어 봄. 창밖 차량은 흐리고 번호판 영역·글자가 보이지 않음. 열쇠 태그와 종이는 비어 있고 인물이 없으며 실제 사고 재현도 아님 → PASS. 캡션 가상의 장면 / 虛構情境 / Fictional scene. alt 3개 모두 장면 설명.
- 바이라인·AI 표시·'변호사 검토'·굵은 글씨 없음. 당사자 실명 없음(판결문 許○○·賴○○를 쓰지 않음). 연락처 문단 없음(976과 같은 형식).
- variety: ko FAIL 0(WARN '니다.' 78%), zh·en FAIL 0. 오프닝은 판결문 항변 인용형으로 976(사실형)과 겹치지 않음. 질문 1~2개, 대비 틀 0~1, 마지막 문단은 주문 금액·이자 기산일로 끝남.

## 판결 사실 확인 (원고와 일치)
- 新北地院 107年度訴字第2236號, 2018-11-16, 1심. 상소 기한 '판결 송달 후 20일' 기재. 원고들이 '확정'이라고 쓰지 않았고 "상소 여부는 공개 사본만으로 확인되지 않음"으로 처리함 → 적절.
- 주문: 被告應給付原告 532,995元 및 107.9.12부터 연 5% 이자 → 3개 언어 모두 "운전자에게 53만 2,995와 이자를 기금에 지급하라" 및 이자 2018-09-12(소장 송달 다음 날)로 정확히 씀(976의 MUST 1 같은 문제 없음).
- 사고 2017-11-19(民國106), 新莊區 中正路·公園一路口, 피고 차량 좌회전·피해 오토바이 반대 방향 직진. 初步分析研判表: 피고 '疑不依號誌指示行駛(直行箭頭綠燈號誌左轉彎)', 피해자 '尚未發現肇事原因' → 일치. "초동 분석은 최종 판단이 아님" 단서도 적절.
- 피해자 因傷成殘. 기금 지급 '傷害醫療暨殘廢補償金' 532,995 → '의료비와 장해 보상으로 53만 2,995'(항목별 내역은 판결에 없음, 원고도 쪼개지 않음) → 일치.
- 피고는 진단서·급부 명세·영수증에 이의 없음 → 일치.
- 항변과 판단: 피고 "前開自小客車係伊承租的，因汽車出租公司未依法保強制汽車責任險，才導致賠償那麼多錢". 법원 "特別補償基金之代位權係基於原本之損害賠償請求權所移轉之權利，即繼受原請求權之權利…視為…被告損害賠償金額之一部分，被告前揭抗辯尚無礙原告為本件請求" → 원고의 요약(대위권=피해자 원래 청구권 승계, 42①②)과 일치. 렌터카 회사의 책임은 판단하지 않았다고 3개 언어 FAQ 3과 본문이 명시함 → 과장 없음.
- 성별: 판결은 許○○만 쓰고 성별 정보가 없음. ko·en은 '운전자/the driver'로 중립. zh에 1곳 예외(MINOR 2).

## MINOR
1. '빌린 차'와 '렌터카 회사의 미가입'을 법원이 인정한 사실처럼 씀(3개 언어)
   - 판결에서 '承租'와 '出租公司未依法保強制險'은 **피고의 항변 내용**일 뿐 법원의 사실 인정이 아닙니다. 법원은 이것이 사실이어도 청구에 영향이 없다고만 했고, 차량 소유자가 누구였는지·누가 投保義務人이었는지는 판결에 없습니다. 확정된 사실은 '피고가 운전한 차가 미가입이었다'는 점(원고 주장에 피고가 다투지 않음)뿐입니다.
   - 원문 예: EN 제목 "The rental company had not insured the car." / EN 본문 "The rental company's failure to insure did not change that structure.", "A company that fails to insure faces its own administrative fines" / KO 본문 "운전자는 빌린 승용차로 좌회전하다", "렌터카 회사의 미가입은 이 구조를 바꾸지 못했습니다", 절 제목 "렌터카 회사에 남는 문제"의 "가입하지 않은 회사에는 공법상 제재가 따로 있습니다" / ZH "駕駛開著租來的自小客車", "租車公司沒投保，改變不了這個結構", "沒投保的公司另有行政罰" / summary 3개의 '빌린(租來的, rented) 승용차가…'.
   - 수정안: 항변임을 드러내고 조건문으로 바꿉니다. 예 EN 제목 "The driver blamed the rental company for the missing insurance. A Taiwan court still sent the bill to the driver"; 본문 "the driver, who said the car was rented…", "Even if the rental company had failed to insure, as the driver argued, that did not change the structure."; 과태료 단락 "If the rental company owned the car and was the person obliged to insure, it would face its own fines…". KO "운전자는 렌터카 회사에서 빌린 차였다고 했습니다", "운전자 말대로 회사가 보험을 들지 않았더라도 이 구조는 바뀌지 않았습니다", "회사가 소유자이자 가입 의무자였다면 과태료가 따로 있습니다". ZH도 같은 방향("駕駛表示車是租來的", "即使如駕駛所說是出租公司沒投保", "若租車公司是車主、也是投保義務人"). 숫자·조문·결론은 그대로 둡니다.
2. ZH 39~40행 "沒投保的是公司，為什麼後果要由他承擔？" — 판결에 성별 정보가 없는 당사자를 '他'로 지칭함(976 r1 MUST 2와 같은 기준). "為什麼後果要由自己承擔" 또는 "由駕駛承擔"으로 바꿉니다.

## NIT
3. EN categories "Taiwan Legal Insights"는 976 en과 같아 일관되므로 그대로 두어도 됨. KO alt "탁자"와 EN alt "counter"는 같은 창가 선반을 가리키니 맞추면 좋음(선택).

## 사이트 반영본 대조
- ~/Projects/tseng-law-cols-1103-c HEAD eeb8da6d5(부모 535851dcd = 976 커밋)의 columns/·columns-zh/·columns-en/ 977 파일이 drafts/c/977-*.md와 diff 없음. 대표 이미지 sha256 앞16 578837cee738e5b6가 검수한 c977-featured-01.webp와 같음.
- 내부 링크 /ko|zh-hant|en/columns/taiwan-uninsured-scooter-fund-recourse-after-leaving는 같은 브랜치의 976 파일로 해결됨. 976이 먼저(또는 함께) main에 들어가야 링크가 살아 있음.
- 겹침: origin/main에 같은 판결이나 '무보험 렌터카 구상'을 다룬 칼럼은 없음(렌터카 언급은 961·099·635·ISSUE-20261029-01에 부수적으로만 있음).

## 재검수 조건
MINOR 1·2를 3개 언어 모두에 반영하고 variety FAIL 0을 유지하면 그 부분만 재검수합니다. 교통사고이므로 PASS 뒤 main fast-forward push가 가능합니다(fetch 후 조상 관계를 재확인하고, force push는 금지). push는 cols-c가 하며 cols-review는 하지 않습니다.
