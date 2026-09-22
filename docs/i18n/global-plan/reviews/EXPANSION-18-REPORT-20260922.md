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

## 5. 후속
- 신규 18개 언어 원어민 검수(Grok 4.6 a/b) → 총괄 판정 → Opus 5 수정 → 재배포: 기존 27개와 동일 파이프라인으로 2라운드 진행 예정.
- 원어민 서명 검수는 여전히 미실시(사용자 전제 유지).
