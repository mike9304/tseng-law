# RELEASE-CHECK — i18n/global-picker (안내 로케일 16 + 사이트 4 = 공개 20)

검증자: Opus 5 세션 `son7-51` · 2026-09-19 13:44~13:52 KST
검증 커밋: `fda34f69` (= 브랜치 `93488b36` + `origin/main 06af5b44` 병합 `0ac4569f` + llms.txt 표본 정정)
검증 위치: 격리 워크트리 `~/Projects/tseng-law-picker-verify-20260919` (공유 트리 비접촉)

## 게이트 — 전부 통과
| 항목 | 명령 | 결과 |
| --- | --- | --- |
| typecheck | `npm run typecheck` | exit 0, 오류 0 |
| 단위/통합 | `npx vitest run` | **11514 통과 / 0 실패** (23 skip, 1 todo, 1317파일) |
| lint | `npm run lint` | exit 0 (`--max-warnings=0`) |
| 라우트 가드 | `npm run security:builder-routes` | exit 0, 279파일 중 273 가드 |
| 국가 언급 | `scripts/check-guidance-country-mentions.mjs` | 0 위반 |
| 프로덕션 빌드 | `npm run build` | exit 0 |

**적색 기준선이 사라졌다.** `origin/main 06af5b44`(018 공개 유지 결정 반영)이 낡은 핀 8파일을
갱신해, 이 브랜치는 이제 "기준선 대비 신규 실패 0"이 아니라 **실패 0**이다.
잔여 1건이던 `llms.txt` 404 시험은 표본 `fr`이 실재 로케일이 된 탓이라 `xx`로 고쳤다(`fda34f69`).

## 런타임 실측 (`next start` :3999)
16개 안내 로케일 × 4경로 = 64건 전부 **200**. 무효 로케일 `/xx`는 **404**.

    vi id th fil ar de es fr pt zh-hans ms ru tr it nl pl
    → home 200 · services 200 · faq 200 · columns 200 (전부)

안내 페이지는 `/[locale]/[[...slug]]` 동적 라우트라 사전 생성 HTML이 없다. 정적 파일이 없다고
경로가 없는 것이 아니다 — 위 실측이 근거다.

## 하드 룰 실측 (렌더된 HTML)
- `availableLanguage` = `["en","zh-Hant","ja","ko"]` — it·nl·pl·ru·tr 확인, 4개 고정.
- `inLanguage` = 각 페이지 언어. zh-hans는 `zh-Hans`(BCP-47).
- `[변호사 검수 필요]` 마커: 렌더 HTML에 0건.
- 언어 선택기: 20개 언어 전부 노출(자국어 표기 Italiano·Nederlands·Polski·Türkçe·Русский·Bahasa Melayu·简体中文 확인).

## 배포 전 남은 것
1. **워크트리 이중 총괄 정리** — 공유 트리 `tseng-law-global-picker-20260918`에 Cursor Grok 세션이
   WO-G2-4(hi·sv·da·nb·fi)를 돌리는 중이다. 사용자 판단 대기(브리지 ASK 2건).
2. 이 검증분(`0ac4569f`·`fda34f69`)을 공유 브랜치에 fast-forward — 워커 산출물과 순서 조율 필요.
3. 푸시·배포는 사용자 승인 사항. 지금은 로컬에만 있다.
