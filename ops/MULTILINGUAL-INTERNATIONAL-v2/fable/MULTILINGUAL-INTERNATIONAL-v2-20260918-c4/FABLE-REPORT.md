Verdict: PASS_TECHNICAL_CONTENT

# 재검수 리포트 — MULTILINGUAL-INTERNATIONAL-v2-20260918-c4

> **검증 모델: Claude Opus 5 (`claude-opus-5[1m]`), 세션 son7-a0** — WO 지정 Fable 5.1 대체. c2·c3와 같은 검수자. 인간 검수자·원어민·변호사가 아니며, 언어 판단은 AI 의미 대조다.
> **기술·콘텐츠 통과이며 발행 승인이 아니다.** `human_linguistic_review=PENDING`, `legal_review=PENDING`, `publication_approval=PENDING`, `publish_authorized=false`, `deployed=false`, 성과 `NOT_MEASURED`.
> 앱 소스·v2 파일 무수정, git commit/push/deploy 없음. 이번 라운드는 dev 서버를 띄우지 않아 c3의 부작용(추적 파일 자동 수정)도 없었다.

## 1. 판정 근거 요약

WO가 지정한 두 항목이 모두 해소됐고, **전체 단위 테스트와 프로덕션 빌드가 처음으로 깨끗하다**. 후보 범위 안에 열린 P0/P1은 없다. 남은 것은 P2 6건과 배포 전 절차(변호사 검토·V2-17 main 통합·V2-12 배지/초안 문구)이며, 이들은 요청된 핵심 동작(언어별 두 경로·정보/의뢰 분리·분쟁 동선·다섯 상황·상담언어 고지)에 영향을 주지 않는다.

## 2. 후보 동일성

| 항목 | 값 |
|---|---|
| 후보 | `MULTILINGUAL-INTERNATIONAL-v2-20260918-c4` · `seo/en-international-v1-20260917` · HEAD `90352b02` + 미커밋 |
| 매니페스트 | **80항목 전부 일치**(시작·종료). `fable/` 경로 **0건**, 자기 해시 **0건** → C3-02의 구조 문제 해소 |
| 매니페스트 밖 변경 | 매니페스트 자신 1건뿐 |
| 스냅샷 | `SNAPSHOT-start.sha256` = `SNAPSHOT-end.sha256`(빌드 후 재확인) — 드리프트 없음 |
| c3→c4 소스 변경 | `src/data/intent-pages.ts`, `src/data/__tests__/intent-pages-en.test.ts` 2개뿐. 나머지 제품 파일은 c3와 바이트 동일 → c3에서 해소 확인한 항목 재실행 불요 |

## 3. WO 지정 항목

| # | 요구 | 확인 | 판정 |
|---|---|---|---|
| C3-01 | ZH `taiwan-lawyer` 제목 복원 | `src/data/intent-pages.ts:234` = `台灣律師指南`(라벨은 `諮詢說明` 유지 — V2-08 의도 보존). `npx vitest run src/data/__tests__/intent-pages-en-growth.test.ts` 직접 재실행 **6/6 통과**, 함께 돌린 7파일 **74/74** | **해소** |
| C3-02 | 증거 패키지 | `BASELINE`·`TERMS`·`CONTENT-DIFF`·`LOCALE-SEO-MAP`·`RUNBOOK` 신규 실재(스텁 아님 — 각각 경로·조문·전후 문장·URL별 canonical/hreflang/index·재현 명령 포함), `logs/`(tsc·vitest)·`screens/`(22장) 저장소 내 실재, `QA-BY-LOCALE.md` 후보 ID가 `…-20260918-c4`, 매니페스트 `fable/` 제외 | **해소** |

RUNBOOK이 "새 distDir로 dev 서버를 띄우지 말 것(추적 tsconfig/next-env가 재작성됨)"을 적어 둔 점은 c3 리포트 §6의 부작용을 그대로 반영한 것으로 확인했다.

## 4. 게이트 (이번 라운드 직접 실행)

| 명령 | 결과 |
|---|---|
| `npx tsc -p tsconfig.json --noEmit --incremental false` | **exit 0** (`logs/10-tsc.log`) |
| `npx vitest run` growth + 가드 6파일 + v2 | **74/74 통과** (`logs/12-vitest-c4.log`) |
| `npm run test:unit` | **1296 파일 / 10857 통과 · 실패 0** · 14 skipped · 1 todo (`logs/13-test-unit-full.log`) — c2 6건·c3 1건 회귀가 모두 사라짐 |
| `npm run build` | **exit 0** (`logs/14-build.log`) — c2·c3에서 NOT_TESTED였던 항목 |

## 5. 남은 P2와 영향

| ID | 내용 | 핵심 동작 영향 | 처리 |
|---|---|---|---|
| V2-12 | 민사 페이지 기존 검수 배지와 미검수 신규 블록 공존, P07 초안 문구 화면 노출 | 없음(표시 문제) | **발행 전 필수 처리** — 배지 범위 명시 또는 변호사 검수 후 유지, 초안 문구 제거 |
| V2-13 | 안내형 로케일로 언어 전환 시 미번역 고지 없이 홈 이동 | 없음(기존 공통 메커니즘) | 별도 WO 권고 |
| V2-14 | JA 홈 1440×900 가이드 링크 대비 | 없음(두 주 경로 버튼은 대비 충분) | 디자인 조정 |
| C3-03 | EN 가이드 CTA "Attorney Wei Tseng reviews the first enquiry" | 없음 | CLAIM-REGISTER에 등재됨 — **변호사 확인 대상** |
| C3-04 | `en-acquisition-guide-links.test.tsx:104-105` 양의 단언 부재 | 없음(테스트 품질) | 다음 편의 시 보강 |
| C3-05 | JA 칼럼 한정 문구 문체 | 없음(의미는 정확) | **원어민 검수 대상** |
| V2-16 | ZH 투자 페이지 신규 고객군 표기 | 없음 | CLAIM-REGISTER `C-ZH-DUAL` — 변호사 확인 |

## 6. 배포 전 남은 게이트 (이 판정에 포함되지 않음)

1. **V2-17 main 재통합** — 후보 기준 `90352b02`, 현재 origin/main `c4270097`(+48, de/es 로케일·대표 변호사 여성형·반도체). 양측 변경 10파일. 통합 후 tsc·단위·빌드·홈 경로 재검수 필요.
2. **변호사 검토** — 신규·수정 원고 전체(`NEEDS_LAWYER_REVIEW`), 특히 C3-03·V2-16·P07 다섯 유형의 실제 수임 범위.
3. **소유자 발행 승인**과 V2-12 처리.
4. **원어민 검수** — ja/ko/zh-hant 문체(C3-05 포함).

## 7. 상태

`implementation=UNPUBLISHED_CANDIDATE` · `technical_content_validation=PASS_TECHNICAL_CONTENT` · `human_linguistic_review=PENDING` · `legal_review=PENDING` · `publication_approval=PENDING` · `publish_authorized=false` · `deployed=false` · `search/AI/inquiries/retainers=NOT_MEASURED`.

## 부록 A — 라이브 정정과 기준선 상태 (2026-09-18 16:2x, son7-db 통보 + 직접 확인)

**판정은 바뀌지 않는다**(PASS_TECHNICAL_CONTENT). 아래는 배포 전 통합(V2-17)에 직접 영향을 주는 두 사실이다.

### A-1. 협정 발효일이 라이브에서 정정됨 — origin/main `0aa3743c`

`fix(guides): 한국-대만 이중과세 협정 발효일 정정`(2026-09-18 16:14). 직접 확인한 내용: 가이드 비용표의 협정 행이 **4로케일 모두** `2023.12.27 발효 / 2024.1.1 적용`으로 바뀌고 각 블록에 MOF 출처 주석이 붙었다. EN 행도 `Effective 2023-12-02` → `In force 2023-12-27 and effective from 2024-01-01`로 고쳐졌다(내 c2 지적은 KO/ZH만이었고 EN 행은 범위 밖이었다). 회귀 가드 `src/app/[locale]/guides/__tests__/company-setup-treaty-date.test.ts`가 추가됐다.

→ V2-05/C3 계열 사실은 이제 **라이브에도 정정**되어 있다. 후보와 main이 같은 결론(2023-12-27·2024-01-01, MOF 출처)에 도달했다.

### A-2. **통합 시 충돌 예고 (새 발견, P1 for V2-17)**

main의 새 가드는 `guideContent[locale].costRows`에서 `/이중과세|雙重課稅|tax treaty|租税条約/`에 맞는 **협정 행이 4로케일 모두 존재**하고 값에 `2023-12-27`과 `2024-01-01`이 있을 것을 요구한다. 그런데 이 후보는

- **JA**: 협정 행을 비용표에서 **삭제**하고 `countrySpecificItems`로 옮겼다(c2 V2-02②에서 그 사유로 `intent-pages-ja` 핀을 KO−1로 바꿨다).
- **EN**: 행 제목을 `Korea-specific tax agreement`, 값을 "아래 국가별 절 참조"로 바꿔 **날짜가 없다**(정규식에도 걸리지 않는다).

따라서 후보를 `0aa3743c` 위로 재통합하면 이 가드는 **ja·en에서 실패**할 전망이다[추정 — 재통합 후 실행으로 확정할 것]. 해결 선택지는 셋이다.

1. 후보의 JA/EN 비용표에 협정 행을 되살리고 날짜 두 개를 병기(국가별 절과 중복되지만 가드 충족).
2. main 가드를 "행이 있으면 날짜가 맞아야 한다"로 완화하고, 국가별 절에 날짜가 있는지 별도 단언(후보 설계 유지).
3. 가드를 KO/ZH로 한정하고 JA/EN은 `countrySpecificItems` 대상 단언을 추가.

어느 쪽이든 **main 소유자와 v2 레인이 함께 정해야 한다**. 이 결정 전에는 V2-17 재통합을 완료로 보지 않는다.

### A-3. origin/main 기준선이 빨간 상태

`4152e1c6` 기준 단위 테스트 **8파일 15건 실패**를 이 세션이 독립적으로 확인했다(내 마케팅 브랜치의 base 내보내기에서 동일 실패 재현). son7-db도 자기 변경을 되돌린 클린 체크아웃에서 같은 결과를 보고했다. 실패군: `insights-archive-order`(ko/zh-hant/en), `home-insights-publication-order`(3), `column-category-parity`, `column-embeddings-content-sync`, `public-intent-search`, `semiconductor-drafts`, `semiconductor-drafts-import`, `llms.txt route`(vi/id/th/fil). 반도체 018 칼럼·게시판 공개가 칼럼 수·홈 인사이트 순서·임베딩 동기화 기대치와 어긋난 것으로 보인다[추정 — 실패 메시지 기반, 원인 확정은 해당 레인 몫].

→ 이 후보 자체는 영향받지 않는다(후보 기준 `90352b02`에서 전체 10857건 통과). 다만 **V2-17 재통합 시점에는 main의 이 15건이 먼저 정리되어야** 통합 후 "신규 실패 0"을 판정할 수 있다.

### A-3 보강 — 기준선 적색의 원인 확정 (son7-51 분석 + son7-a0 직접 확인, 2026-09-18 16:3x)

son7-51이 격리 워크트리에서 원인을 콘텐츠 버그가 아니라 **가드 테스트의 낡은 고정값**으로 지목했고, 아래는 이 세션이 직접 확인한 값이다.

| 실측 | 값 |
|---|---|
| 실제 칼럼 수 | `src/content/columns{,-en,-ja,-zh}` **각 18편**(018 `taiwan-semiconductor-market-entry` 추가) |
| `column-category-parity.test.ts:24` | `expect(english.size).toBe(17)` — 18과 불일치 (`:48`도 `posts.length === 17` 가정) |
| `llms.txt/__tests__/route.test.ts:270-271` | `toBe(17)` ×2 — vi/id/th/fil 4건 실패의 직접 원인 |
| `insights-archive.ts:36` | `homeFeaturedIds` 선두가 `semiconductor-market-entry` |
| `insights-archive-order.test.ts:13` | `getFeaturedInsights(locale)[0]?.id`가 `cosmetics-market-entry`이길 요구 — ko/zh-hant/en 3건 |

여기까지 12건은 **18편 공개에 맞춰 기대값을 갱신하면 해소**된다(콘텐츠 수정 불요).

남은 3건은 성격이 다르므로 분리해 기록한다. `semiconductor-drafts.test.ts:83`은 "초안이 공개 칼럼에 새지 않는다"를 단언하는데, 018이 **의도적으로 공개**되면서 실패한다(`expected [ …(18) ] to not include 'taiwan-semiconductor-market-entry'`). `semiconductor-drafts-import.test.ts`는 `Refusing to overwrite published column …`으로 실패한다. 즉 이 둘은 낡은 숫자가 아니라 **"018은 초안"이라는 이전 전제와 "018을 공개한다"는 현재 결정의 충돌**이다. 어느 쪽이 정본인지는 반도체 레인의 결정 사항이며, 기대값만 바꾸면 "초안 비공개" 가드 자체가 사라진다는 점을 함께 판단해야 한다. (`column-embeddings-content-sync`·`public-intent-search`·`home-insights-publication-order`는 같은 유형으로 보이나 이 세션에서 개별 확인하지 않았다.)

### A-2 보강 — 협정 가드 충돌 권고

son7-51은 (b)를 권고했고 이 세션도 같은 의견이다. 가드의 목적은 "`2023.12.2` 오기 재발 방지"이지 "비용표에 행이 있을 것"이 아니다. (a)처럼 JA/EN 비용표에 협정 행을 되살리면 v2가 고친 문제(한국 전용 협정이 모든 독자의 공통 조건처럼 읽히던 것)가 되돌아간다. 따라서 **가드를 "협정 날짜가 어디에 나오든 2023-12-27·2024-01-01이어야 하고, 비용표에 행이 없으면 국가별 절에 있어야 한다"로 완화**하는 편이 사실 보호와 국가 한정 표기를 모두 지킨다. 후보의 JA·EN 국가별 절에는 이미 두 날짜가 들어 있다. 최종 결정은 main 소유자와 v2 레인의 몫이다.

### A-2 종결 — 통합 충돌 해소 확인 (origin/main `81f055f6`)

main 소유자(son7-db)가 가드를 레이아웃 비의존으로 다시 썼다. 이 세션이 **실제로 실행해 확인**했다: 후보 트리 사본(HEAD 아카이브 + 후보 변경분 덮어쓰기)에 `81f055f6`의 `company-setup-treaty-date.test.ts`를 넣고 실행 → **14/14 통과**. 따라서 A-2의 P1 경고는 해소됐고, 후보가 JA 행을 국가별 절로 옮기고 EN 행에서 날짜를 뺀 설계를 유지한 채 재통합할 수 있다.

son7-db 요청 확인 사항(후보 쪽 결손 여부)도 실측했다: EN 국가별 절 `27 December 2023` + `1 January 2024`, JA 국가별 절 `2023年12月27日` + `2024年1月1日` 모두 실재하고, 후보 가이드 전체에 잘못된 날짜는 0건이다. KO·ZH 비용표 행도 두 날짜를 병기한다.

**남은 소견(비차단, main 가드 쪽)**: `TREATY_MENTION` 정규식에 영어 표현이 `tax treaty`만 있어서, 후보 EN처럼 `income tax agreement`로만 쓰는 로케일은 규칙 ②(발효일 명시)가 **건너뛰어진다**(EN 블록 매칭 실패를 확인). 잘못된 날짜 자체는 규칙 ①이 네 로케일 모두에서 막으므로 위험은 낮지만, `income tax agreement|소득세 협정` 등을 패턴에 추가하면 EN도 실제로 검사된다. main 소유자 판단 사항이다.

### A-3 종결 — 018 결정 보류 (2026-09-18, 사용자 스킵)

`ASK-claude-20260918-semiconductor-018`에 대해 사용자가 질문을 스킵했다. 확정 내용: **① 018 공개/철회, ② 홈 대표글 1순위 — 둘 다 결정 아님, 어느 쪽으로도 바꾸지 말 것.** 기대값·임베딩·게이트·푸시를 이 결정에 묶어 진행하지 않는다. 재질문 금지.

따라서 origin/main의 적색 15건은 **현 상태로 둔다**. 낡은 고정값 9건도 지금 17→18로 갱신하면 ①이 "공개 유지"로 결정된 것을 전제하게 되므로 함께 보류한다. 이 보류는 c4 판정에 영향을 주지 않는다(후보 기준 `90352b02`에서 전체 10857건 통과). 다만 **배포 전 V2-17 재통합 시점에는 main이 여전히 적색일 수 있으므로**, 그때 "신규 실패 0" 판정은 main의 기존 실패 목록을 기준선으로 분리해 읽어야 한다(이 리포트 A-3 보강의 파일·줄 목록을 기준선으로 사용할 것).

`/ko/services#investment` 링크 패리티 건(7로케일 35파일)은 ①·②와 무관한 별건이므로 이 보류에 묶이지 않았고, son7-51의 `6d406e28`이 체리픽되어 **`fdde5c4b`로 origin/main에 반영·라이브**(Vercel 16:31)되었다. son7-a0 직접 확인: `git grep 'ko/services#investment' origin/main -- src/content/**` 0건, `fdde5c4b`는 origin/main 조상.
