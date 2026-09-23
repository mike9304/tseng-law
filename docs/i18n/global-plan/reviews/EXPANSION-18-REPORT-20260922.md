# 언어 확장 C안 보고 — 18개 로케일 추가(총 49개), 2026-09-22

결정: 손빗 중계 ASK-20260921-1330 → 사용자 확정 C(A+B 18개). 아시아 8: bn·ur·fa·my·ta·ne·km·mn / 유럽 10: sk·bg·hr·sr·sl·lt·lv·et·ca·is. 세르비아어는 라틴 문자, 몽골어는 키릴 문자.

## 1. 방식
1. **스캐폴드(총괄)**: 레지스트리·라우팅·hreflang/og:locale·RTL(ur·fa 추가)·폰트(Noto Sans Bengali/Tamil/Myanmar/Khmer + 기존 아랍/데바나가리/라틴 재사용)·CSS 바인딩·Record 810곳을 템플릿 로케일(hi/ar/th/ru/cs) 복제 + `SCAFFOLD` 표식으로 채워 tsc 0 유지. 팩 4파일 신설(south-asia·southeast-central·central-europe·baltic-atlantic).
2. **체커 확장(총괄)**: 18언어 금지어·국적어·언어언급·천단위·월명(+hr/pl 충돌 오버라이드)·langid 스크립트(벵골·타밀·미얀마·크메르·데바나가리·히브리, 아랍문자 공유 ur/fa, Đ 공유 hr/sr)·숫자 접기(아랍-인도·페르시아·벵골·데바나가리·미얀마·크메르 숫자)·lt/lv 연도선행 날짜·소형 수사 사전·어휘 숫자(제N종·1일로).
3. **번역(Grok 4.6, 로케일당 3 WO)**: 팩+UI 문자열(WO-P) → 칼럼 001–009(WO-N-a) → 010–018(WO-N-b). 규칙집 RULEBOOK-FIX(R2 한국 전제 일반화·R3 광고 완화·R7 블로그체·R8 용어집)를 처음부터 적용, 참조 = 원어민 검수 완료된 자매 로케일.
4. **통합(총괄)**: 워크트리별 검증(표식 0·템플릿 잔존 누락 검사·tsc·최신 체커 18/18·한글 0) → 로케일 키 단위 블록 적용 도구(`scripts/apply-locale-blocks.py`, 인접 hunk 충돌 회피, scripts/ 제외) → 통합 트리 재검증 → 커밋.

## 2. 총괄이 잡은 결함(워커 산출물)
- 템플릿 로케일 경로 누출: answers/홈 경로 표에 `/hi/`·`/th/`·`/ru/`·`/cs/` 링크 70건 → `scripts/fix-template-paths.py`로 정정.
- 워커가 자기 워크트리의 체커를 임의 수정(fa·bg 등) → 통합 시 총괄 체커로 재검사(적용 도구가 scripts/ 무시). 그 재검사에서 hr(Đ 오탐)·bn(단다 오탐)·fa/ta(낱말 수사)·hr 월명 충돌 등 체커 쪽 수정 6건.
- answers 길이 규칙 위반 3건(bn·ta·mn lawyers 39단어) → 보강(안내 언어 미언급 규칙 준수); 미얀마·크메르는 결합문자 계수라 상한 540으로 조정.
- 테스트 핀 갱신: 로케일 수 49·RTL 4·폰트 목 4·관리 클래스 17·디렉터리 맵·인테이크 목록·자국어명·라틴 바인딩 CSS 11·일본어 라우트 alternates 7파일·칼럼 alternates 픽스처·루트 llms.txt 예산 8→16 KiB·answers 용어표 18언어·언어명 토큰 18.

## 3. 결과 (통합 트리 e6f829c2 = origin/main, 3493af64 대비 44커밋 · 524파일 · +71,770줄)
| 항목 | 값 |
|---|---|
| 로케일 | 18/18 통합 (bn ur fa my ta ne km mn sk bg hr sr sl lt lv et ca is), 안내 팩 18 + 칼럼 18×18=324편 |
| 체커 `check-column-translation.mjs` | 18개 언어 모두 PASS 18/18 (총괄 체커로 통합 시 재검) |
| `[변호사 검수 필요]` 마커 · 한글 잔존 · `SCAFFOLD` 표식 | 0 · 0 · 0 |
| 템플릿 동일 문자열(leak-check) | 로케일당 4건(Trend Law Office 등 영문 고유명사)만 — 정당 |
| tsc · lint | 0 · 0 |
| vitest | 1,322파일 · 12,681 통과 · 14 skip · 1 todo |
| `next build` | 성공 |
| 로컬 `next start` 스모크 | sitemap 1,439 URL 전부 200 (기존 935 + 18×28), ur·fa `dir="rtl"`, bn/ta/my/km 전용 폰트 클래스 확인 |
| 워커 로그 | `evidence/grok-P-<loc>.log`·`grok-N-<loc>-{a,b}.log` 54건 (+stdout 사본) |

라이브: §4 참조.

## 4. 배포·라이브 검증
- 09:38 origin/main 3493af64→e6f829c2 fast-forward 푸시(Vercel 자동 배포) → 09:41 라이브 마커 확인(`/km/faq` 200, sitemap 1,439).
- 09:47 라이브 스모크: sitemap 1,439 URL 전부 200. 신규 18개 로케일 `/services`·`/faq` 200, `<html lang>` 18개 정확, ur·fa `dir="rtl"`. 루트 llms.txt 200(10.2 KB), `/km/llms.txt` 200(20.0 KB).
- IndexNow: 신규 로케일 URL 504건 제출 → HTTP 200.
- `scripts/verify-multilingual-live.mjs --base https://tseng-law.com`: 1차 실행 c/f 항목 FAIL 509 → 원인은 검증기 자체의 hreflang 매핑 누락(zh-hans→zh-Hans, 사이트는 정상 BCP47 출력) → 검증기 수정(2038cd7a) 후 재실행 **overall PASS 3,414 / fail 0** (sitemap 1,440·core 490·hreflang 490·안내문 90·privacy 49·칼럼 855).

## 5. 2라운드 — 신규 18개 로케일 원어민 품질 검수·수정 (2026-09-22 10:1x~12:4x)
사용자 지시(9/22 "grok4.7 구현자로 써")에 따라 검수·수정 워커 모두 `grok-4.7-high`(cursor-agent). Cursor 동시 한도로 8레인 동시 실행(18개 동시 기동 시 `resource_exhausted`).

| 단계 | 결과 |
|---|---|
| 검수 WO | `WO-R-<loc>-{a,b}.txt` 36건, 입력 덤프 `reviews/native/input/<loc>-guidance.txt`(365문자열) 18건 |
| Grok 4.7 검수 | 36/36 완료 → `reviews/native/<loc>-{a,b}.md`. 발견 **P1 306 · P2 1,311 · P3 3**. 자연스러움 자가평가: 팩 3~4/5, 칼럼 2~4/5 |
| 대표 결함 | sk 003·007·008 본문이 체코어(템플릿 언어) 그대로 · km 018 §3–5 규정 소실(숫자만 남음) · ta "의뢰인"→"정당원", "퇴직금"→"별거수당" · my 資遣費→"사직 위로금", 林→"남편" · lv 격 일치 22건 · bg/ca ти/vosaltres 어투 혼입 · 18개 공통: 독일어 계산(begleiten·Objektspeicher), 민국 연호 원년 표기, 팀 소개 영문 직함, OOO 이름 가림표, 블로그 어투(003 Q16+·005·006·008·009·013·015) |
| 총괄 판정 | `ACCEPTED-<loc>.md` 18건(326줄) + 규칙집 부록 **R12–R17**(영문 직함, 민국 연호, 숫자 체계, OOO, Hangul url, 자매어 누출) |
| Grok 4.7 수정 레인 | 18/18 완료(로케일당 전용 워크트리 `fix/native-<loc>-20260922`, 20~40분) → 총괄 통합 18/18 |
| 총괄 게이트(통합 후) | 체커 18×18/18 PASS · 마커 0 · 한글 0 · SCAFFOLD 0 · 고정 문구 `TWD 1.57M` 30/30 보존 · tsc 0 · 안내 관련 vitest 통과 · 그리드 라벨 동기화 2건(km 정서법, bg Ви형) |
| 기계 반영 검증 | `scripts/verify-native-fix.mts`(검수 행의 인용문이 콘텐츠에 남아 있는지): **1,587행 중 1,572행 반영(99.1%)**, 잔여 15행 = 규칙상 스킵(Hangul url 5, 천단위 공백/1.57M/민국 연호 표기 요구 8, 단어 하나짜리 표 셀 1, 영문 기관명 1) |
| 변경 규모 | e6f829c2 → 통합: 340파일 ±5,7xx줄(원어민 수정), 커밋 60 |

총괄이 직접 고친 것: 체커에 **자매어 누출 검사(neighbour)** 추가(체코어 기능어 3종 이상이면 FAIL; sk 003/007/008을 재현 검출, 수정 후 PASS) · 라이브 검증기 zh-Hans 매핑 · 그리드 라벨 2건 · 사용자 지시 "번체 중국어에 타이완 표기" → `繁體中文（台灣）` / `Traditional Chinese (Taiwan)`(자국어명 테스트 2건 zh-hant 예외 명시, 인테이크 이메일 골든은 원복).

운영 사고 2건(복구 완료): ① 큐 러너를 Monitor 태스크로 돌리다 정지 시 자식 워커 8개가 함께 종료 → 데몬(nohup) + 이벤트 파일 tail 구조로 교체, 재발주. ② 디스크 3.2 GiB까지 소진(레인 워크트리마다 node_modules 1.3 GB) → 통합 완료 레인 워크트리 즉시 삭제로 11 GiB 확보. lv 레인은 재발주 경쟁으로 커밋이 고아가 됐다가 `git branch -f`로 복구·통합.

## 6. 배포 2차 (2라운드 반영)
- 최종 게이트(통합 트리 7d29f1ff): vitest 1,322파일 12,681 통과 · lint 0 · tsc 0 · `next build` 성공(fa llms.txt 빌드 실패 1회 → ZWNJ 허용 수정 후 성공; next/font 일시 오류 1회 재시도) · 로컬 `next start` 1,439 URL 전부 200.
- 12:53 origin/main aeffd10a→7d29f1ff fast-forward 푸시 → 12:55 라이브 마커 확인(`/en`에 `繁體中文（台灣）`).
- 13:02 라이브 스모크: sitemap 1,439 URL 전부 200 · `/fa/llms.txt` 200(ZWNJ 유지) · sk 007 체코어 잔존 0 · km 018 §3–5 복원 확인.
- IndexNow: 갱신된 18개 로케일 URL 504건 재제출 → HTTP 200.
- `verify-multilingual-live.mjs --base https://tseng-law.com`: **overall PASS 3,414 / fail 0** (sitemap 1,440 · core 490 · hreflang 490 · 안내문 90 · privacy 49 · 칼럼 855).

## 7. 후속
- 원어민 서명 검수는 여전히 미실시(사용자 전제 유지). 27개 기존 로케일의 팀 소개 영문 기관명(R12)은 이번 18개에만 적용 — 필요 시 27개에도 확장.
- 검수가 남긴 P2 잔여 15행(위 표)은 규칙상 의도된 스킵.
- fa 칼럼에 원 번역부터 있던 U+200B(제로폭 공백) 87건 — 정서법상 ZWNJ(U+200C)여야 할 자리로 보이나 이번 라운드 검수 행에 없어 미수정(후속 후보).

## 8. 5라운드 원어민 캠페인 (2026-09-22 13:49 ~ 09-23 12:38, 45개 안내 로케일)

사용자 지시(9/22 13:2x) 「ai 원어민 5회 전체 검수하고 수정해, 그룩 4.7 적극 사용」. 45개 안내 로케일(ko/en/ja/zh-hant 원문 제외)에 대해 [검수 a/b → 수정 → 게이트·머지]를 5회 반복. 운영은 데몬 `scratchpad/rounds/native_rounds.py`(nohup, 상태 `state.json`, 이벤트 `events.log`, `PAUSE` 파일, `mark.sh` 오버라이드 채널), 라운드 경계마다 총괄이 수동 게이트·배포.

| 라운드 | 기간 | 검수 P1/P2 행 | 전 라운드 대비 | 인용문 잔존(반영률) | 배포(origin/main) | 총괄 개입 |
|---|---|---|---|---|---|---|
| r1 | 9/22 13:49→19:14 | 4,021 | — | 26행(99.3%) | 19:5x | th 미추적 파일 충돌, fr 고정 문구 30건, zh-hans llms 안내문, ne 그리드 라벨(동기화 스크립트), is answers 충돌(apply-locale-blocks) |
| r2 | 19:5x→00:12 | 2,931 | −27% | 11행(99.6%) | 00:2x | ar llms 'llms.txt' 토큰(규칙 추가), nb 테스트 인접 줄 충돌, ms-b 워커 4h45m 정지(STALL 킬러 도입) |
| r3 | 00:2x→05:53 | 2,610 | −11% | 5행(99.8%) | 06:0x | es 설명문 괄호(규칙), tr fast-forward+revert로 통합분 소실 → revert-of-revert, 이후 `--no-ff` |
| r4 | 06:0x→09:02 | 2,206 | −16% | 2행(99.9%) | 09:1x(4f332844) | 디스크 2 GiB 가드 2회 → 캐시·구 cursor-agent·Cursor 채팅(사용자 결정 A) 정리 |
| r5 | 08:35→12:38 | 3,007 | +36%* | 3행(99.9%) | 12:51(0df6c9d4) | 10:43 Grok 4.7 한도 소진 → 사용자 결정 A: 27개 로케일을 Opus 5 서브에이전트로(검수 47파일·수정 27레인), da 타임아웃(`--testTimeout=60000`) |

\* r5 증가는 리뷰어 교체 효과: 같은 Grok 4.7이 r4·r5 모두 검수한 43파일은 1,059→937(−12%), Opus 5로 바뀐 47파일은 1,147→2,070. 동일 콘텐츠를 더 엄격한 리뷰어가 본 결과이며, r5 수정 레인이 그 2,070행도 99.9% 반영했으므로 최종 상태는 r4보다 개선.

**합계**: 검수 450파일(Grok 4.7 403 + Opus 5 47), 수정 레인 225(Grok 4.7 198 + Opus 5 27, 생략 0), P1/P2 누적 14,775행 처리, 라운드 경계 배포 5회(모두 ff 푸시·라이브 마커·1,439 URL 스모크·IndexNow). 매 라운드 게이트는 동일: 체커 45×18/18 PASS · 마커 0 · 한글 0(ko 블록 제외) · 고정 문구 ≥30 · 안내 vitest 세트, 라운드 경계에 전체 vitest(1,330파일; 실패 2건은 origin/main 타 세션 기존 실패 `column-012-native-search-sync`·`home-case-results-editorial`) · `npm run lint` · tsc · `next build` · 로컬 `next start` 1,439 URL 200.

**r5 최종 배포 검증(0df6c9d4)**: 12:51 main 푸시 → 13:0x `/et` "Lehe keel"(구 "Kuva keel" 0) · `/et/contact` "büroo poole" 6건 → 라이브 스모크 sitemap 1,439/1,439 200(재시도 포함) → IndexNow 1,260 URL(45개 안내 로케일 전량) HTTP 200 → `verify-multilingual-live.mjs --base https://tseng-law.com`: **overall PASS 3,414 / fail 0** (sitemap·core·hreflang·안내문·privacy·칼럼).

**리뷰어가 매 라운드 반복 지적했으나 로케일 수정으로 풀 수 없는 항목(소스·체커 결정 필요)**
- U+200B(제로폭 공백) 줄과 003 Q16~Q20 `##` 헤딩 소실, 005·006·008·009·013·015 문단 조각화: 한국어 원문이 같은 문자·블록 구조를 갖고 체커 `blocks`가 ZWSP·블록 수를 고정 → 원문에서 한 번에 고쳐야 45개 로케일에 반영됨.
- 004 출처 라벨 "영업세법 제10조"(flno=3 URL과 불일치): 한국어 원문 문제, 체커 `numbers`가 10을 셈.
- 팀 소개 `TWD 1.57M`: 테스트로 바이트 고정(R14). 로케일 숫자 표기(공백 천단위·소수점 쉼표)도 R14/ACCEPTED-ROUND로 의도된 스킵.
- 체커 숫자 어휘 공백: lv/et 월명은 주격만 등록(격변화형 "jūlija/juulist"는 월 탈락), sl/sr/fi/cs/is 낱말 수사는 1~3만, is는 ASCII `\b` 경계로 낱말 인식 실패, sl `english` 검사가 in/to/čas를 영어 불용어로 오탐(ter→in 전환을 제한). 수정하려면 `scripts/check-column-translation.mjs` 어휘 확장.
- 운영: 빌더 API가 병렬 스모크 부하에서 일시 500(EPIPE, 재시도 200) · iCloud CloudDocs 64→77.5 GB 성장으로 디스크 가드 발동 · Cursor Grok 4.7 한도(9/23 10:43 소진).
- 원어민(사람) 서명 검수는 캠페인 전체에서 미실시(사용자 전제 유지).
