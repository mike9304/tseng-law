# WO-ZH1 — zh-hant 홈 빌더 문서 히어로 패치 스크립트

작성일: 2026-07-21 KST

## 결과

`scripts/patch-zh-hero-2026-07-21.mjs`를 추가했다. 스크립트는 기본이 dry-run이며 `--apply`를 명시한 경우에만 기존 builder-site draft 저장과 `publishPage` 발행 파이프라인을 호출한다. 이번 작업에서는 `--apply`를 실행하지 않았고 Blob/DB에 쓰기를 시도하지 않았다.

핵심 안전 조건:

- zh-hant 홈 published canvas에서 기존 h1 `以韓語清楚說明台灣法律。`가 히어로 h1 역할 노드에 단 하나 있어야 한다. 0개 또는 2개 이상이면 아무것도 저장하지 않고 종료한다.
- 서브타이틀과 타이핑 문구는 히어로 서브트리 안의 정확히 같은 문자열만 교체한다.
- ko 지오메트리는 `home-hero-root`, `home-hero-media`, `home-hero-media-image[-N]` 정확 ID와 kind가 일치할 때만 zh-hant에 반영한다. 역할 후보만 있고 exact ID가 없으면 후보 diff를 출력하고 그 노드는 수정하지 않는다.
- 복사 필드는 desktop/tablet/mobile rect, `style.borderRadius`, 이미지 `content.fit`/`content.focalPoint`로 한정한다. zh-hant `src`, `srcByLocale`, `alt`, 기타 텍스트는 ko에서 복사하지 않는다.
- 새 h1에는 명시적 개행이 없다. zh-hant h1 박스가 ko 박스보다 좁은 경우에만 ko 폭까지 늘려 한 글자 고아 줄바꿈 가능성을 줄인다.
- 각 변경 노드는 `builderCanvasNodeSchema`, 전체 문서는 `builderCanvasDocumentSchema`를 통과해야 한다.
- 적용 전 기존 unpublished draft가 있으면 중단한다. published/draft generation을 다시 확인하고, 백업 후 발행본이 바뀌었으면 draft를 쓰지 않는다.

## 사용법

```bash
# 기본: published zh-hant/ko 홈을 읽고 diff만 출력
node scripts/patch-zh-hero-2026-07-21.mjs

# 사이트 ID 명시
node scripts/patch-zh-hero-2026-07-21.mjs --site=tseng-law-main-site

# Studio의 실제 credential/backend 환경에서만 수동 실행
node scripts/patch-zh-hero-2026-07-21.mjs --apply
```

`--apply` 흐름은 다음과 같다.

1. `readPublishedPageCanvas`로 zh-hant/ko 홈 published canvas를 읽는다.
2. 순수 함수로 copy/geometry 변경 계획을 만들고 노드/문서 스키마를 검증한다.
3. 기존 publish gate를 쓰기 전에 실행한다.
4. 대상 published record, page meta, public 정규화 문서 전체를 `runtime-data/backups/zh-home-<timestamp>.json`에 백업한다.
5. 낡은 draft를 거부하는 generation guard로 패치 문서를 draft에 저장한다.
6. 기존 `publishPage` 파이프라인을 호출해 revision, published canvas, site publish metadata, cache revalidation을 같은 흐름으로 갱신한다.

기본 백업 위치는 요구된 `runtime-data/backups`이다. 격리 검증이 필요한 경우에만 `--backup-dir=<path>`로 변경할 수 있다.

## dry-run 출력 예시

실제 출력은 문서의 현재 값에 따라 달라지며, fixture dry-run에서 확인한 형태는 다음과 같다.

```text
=== zh-hant home hero patch (DRY RUN) ===
- home-hero-title :: content.text
    "以韓語清楚說明台灣法律。" -> "台灣法律，清楚說明。"
    reason: locked zh-hant h1 replacement
- home-hero-title :: rect.width
    440 -> 780
    reason: avoid zh-hant h1 orphan line using wider ko title box
- home-hero-media-image :: rect.width
    1080 -> 1280
    reason: hero-image-primary geometry from ko
- home-hero-media-image :: content.fit
    "contain" -> "cover"
    reason: hero-image-primary object-fit from ko
Dry-run complete; no persistence write was attempted.
Schema validation: PASS (6 nodes)
```

exact ID가 없으면 다음과 같이 자동 적용 대신 후보만 보여준다.

```text
WARNING: hero-media geometry skipped: exact role-compatible id home-hero-media was not available.
CANDIDATES ONLY: hero-media (zh-hant exact-id node missing)
    ko: [{"id":"home-hero-media",...}]
    zh-hant: [{"id":"zh-hero-media-role","kind":"container","className":"hero-media",...}]
```

## 검증

```text
npx vitest run tests/patch-zh-hero-2026-07-21.test.ts
  Test Files  1 passed (1)
  Tests       7 passed (7)
```

7개 테스트가 확인한 항목:

- h1/서브타이틀/타이핑 문구 교체
- ko 지오메트리·fit·focal point 복사와 zh-hant 이미지 src/alt 보존
- h1 미발견/복수 매칭 fail-closed
- exact ID 불일치 시 후보만 출력하고 geometry 미수정
- locale-owned 홈 페이지 단일성 가드
- `builderCanvasNodeSchema` 실패 차단
- 임시 디렉터리의 실제 로컬 file backend에 사이트/published canvas를 공식 퍼시스턴스 함수로 준비한 후 plain `node` CLI dry-run 실행, published JSON 전후 바이트 동일성

추가 게이트:

```text
node --check scripts/patch-zh-hero-2026-07-21.mjs                 PASS
npx eslint scripts/patch-zh-hero-2026-07-21.mjs \
  tests/patch-zh-hero-2026-07-21.test.ts                           PASS
npx tsc --noEmit --incremental false                              PASS
git diff --check                                                  PASS
```

현재 레포의 기본 local builder-site backend에는 persisted ko/zh-hant 홈 쌍이 없어, 그 데이터를 대상으로 한 실제 변경 diff는 출력할 수 없었다. 대신 격리 로컬 file backend fixture에서 동일 CLI 진입점과 퍼시스턴스 읽기 경로를 끝까지 실행했다.

## 남은 위험과 실행 후 확인 항목

- 실제 production Blob은 읽거나 쓰지 않았다. Studio에서 먼저 기본 dry-run 출력의 노드 ID, old/new 값, candidate-only 경고를 수동 검토해야 한다.
- 이 스크립트는 locale 공유/projection 페이지를 추측해 쓰지 않고, ko와 zh-hant 각각의 locale-owned 홈이 단 하나일 때만 진행한다. production site meta가 다르면 fail-closed 메시지를 보고 해당 데이터 구조를 먼저 확인해야 한다.
- 기존 발행 파이프라인은 revision 저장, published canvas 저장, site meta 저장을 하나의 외부 스토리지 트랜잭션으로 묶지 않는다. 쓰기 전 gate/generation guard와 전체 백업으로 위험을 줄였지만, draft 저장 후 publish 중간 실패 시 패치된 draft가 남을 수 있다. 스크립트가 실패하면 재실행 전 draft 상태를 확인해야 한다.
- h1 줄바꿈은 실제 폰트 로딩과 production viewport에 영향을 받는다. `--apply` 성공 후 `/zh-hant`에서 desktop/tablet/mobile 실화면을 확인해 h1 고아 줄바꿈과 히어로 우측 패널 노출이 없는지 확정해야 한다.
- `publishPage` 호출은 기존 제품 동작에 따라 cache revalidation, search index best-effort rebuild, publish webhook/app hook를 수반할 수 있다. Studio 적용은 이 운영 효과를 예상한 유지보수 창에서 실행해야 한다.
