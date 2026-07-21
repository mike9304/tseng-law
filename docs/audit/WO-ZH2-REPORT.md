# WO-ZH2 — zh-hant 홈 히어로 이미지 교체·풀블리드 패치 스크립트

작성일: 2026-07-22 KST

## 결과

`scripts/patch-zh-hero-image-2026-07-22.mjs`를 추가했다. 스크립트는 기본이 dry-run이며 `--apply`를 명시한 경우에만 백업, guarded draft 저장, 기존 `publishPage` 발행 파이프라인을 순서대로 수행한다. 이번 작업에서는 `--apply`를 실행하지 않았고, production Blob/DB를 읽거나 쓰지 않았다.

핵심 동작과 안전 조건:

- zh-hant 홈 published canvas에 `home-hero-root`, `home-hero-media`, `home-hero-media-image`, `home-hero-media-image-2`, `home-hero-media-image-3` 정확 ID가 각각 단 하나씩 존재해야 한다.
- root/media는 container, 세 image는 image kind여야 하며 `root > media > images` 직접 부모 구조가 다르면 원본 문서를 그대로 반환하고 무수정 종료한다.
- 세 image의 `content.src`를 모두 `/images/hero-bg-taipei-night.webp`로 교체한다. `srcByLocale`가 존재하면 `zh-hant` override도 같은 값으로 교체하고 다른 locale key는 보존한다.
- `fit`이 존재하면 `cover`, `focalPoint`가 존재하면 중앙 `{x:50,y:50}`로 맞춘다.
- `alt`를 `台北101夜景城市天際線`로 교체한다. `altByLocale`가 존재하면 `zh-hant` override도 같은 값으로 교체하고 다른 locale key는 보존한다.
- media와 세 image의 desktop/tablet/mobile 유효 폭이 각 breakpoint의 root 유효 폭보다 좁을 때만 `x=0`, `width=root width`로 늘린다. root보다 같거나 넓은 기하는 수정하지 않고, y/height 및 기타 responsive 필드는 보존한다.
- 변경 전 published 문서와 변경 계획 문서 모두에 `builderCanvasNodeSchema`/`builderCanvasDocumentSchema`를 적용한다.
- 적용 전 unpublished draft 충돌을 거부하고, published/draft generation을 재확인한다. 백업 후 published generation이 바뀌었으면 draft를 쓰지 않는다.
- 변경이 0건이면 `--apply`에서도 백업/draft/publish 쓰기를 시작하지 않는다.

WO-ZH1의 공용 조각인 `findHomePageMeta`와 `validatePatchedDocument`를 import해 재사용했다. persistence, published canvas, publish, schema 모듈도 기존 제품 경로를 dynamic import하며 저장 포맷을 별도로 복제하지 않았다.

## 사용법

```bash
# 기본: zh-hant published 홈을 읽고 스키마 검증 후 old -> new 계획만 출력
node scripts/patch-zh-hero-image-2026-07-22.mjs

# 사이트 ID 명시
node scripts/patch-zh-hero-image-2026-07-22.mjs --site=tseng-law-main-site

# production credential/backend이 있는 발주자 환경에서만 수동 실행
node scripts/patch-zh-hero-image-2026-07-22.mjs --apply
```

`--apply` 흐름:

1. zh-hant 홈 published canvas와 published/draft generation을 읽는다.
2. 원본 스키마를 검증하고, 순수 함수로 변경 계획을 생성한 뒤 결과 스키마를 다시 검증한다.
3. 기존 publish gate를 통과한다.
4. `runtime-data/backups/zh-home-image-<timestamp>.json`에 page meta, published record, 전체 resolved published document를 기록한다.
5. generation guard를 다시 통과한 후 draft를 저장한다.
6. 기존 `publishPage` 파이프라인으로 revision/published canvas/site metadata/cache revalidation을 갱신한다.

## dry-run 출력 예시

아래는 단위 테스트 fixture에서 검증한 대표 형태다. production 실제 old 값과 변경 목록은 문서 상태에 따라 달라진다.

```text
=== zh-hant home hero image patch (DRY RUN) ===
- home-hero-media :: rect.x
    200 -> 0
    reason: full-bleed desktop x aligned to hero root
- home-hero-media :: rect.width
    1080 -> 1280
    reason: full-bleed desktop width expanded to hero root
- home-hero-media-image :: content.src
    "/images/old-0.webp" -> "/images/hero-bg-taipei-night.webp"
    reason: replace hero image source
- home-hero-media-image :: content.fit
    "contain" -> "cover"
    reason: cover the full-bleed hero frame
- home-hero-media-image :: content.focalPoint
    {"x":35,"y":45} -> {"x":50,"y":50}
    reason: keep the replacement image centered
- home-hero-media-image-3 :: content.alt
    "old alt 2" -> "台北101夜景城市天際線"
    reason: replace zh-hant hero alt text
Dry-run complete; no persistence write was attempted.
Schema validation: PASS (5 nodes)
```

정확 ID가 하나라도 없으면 다음 형태로 exit 1 종료하며 저장을 시작하지 않는다.

```text
ABORT: Required exact node is missing: home-hero-media-image-3
No persistence write was attempted.
```

## 검증

```text
npx vitest run tests/patch-zh-hero-image-2026-07-22.test.ts
  Test Files  1 passed (1)
  Tests       3 passed (3)
```

3개 fixture 케이스:

- 정상 매치: 세 image의 src/zh-hant locale src, alt/zh-hant locale alt, fit, focal point 변경; media/image desktop/tablet/mobile 풀블리드 확장; y/height 보존; 원본 불변; 노드/문서 스키마 PASS.
- image 노드 누락: 원본 문서와 변경 목록을 보존하는 fail-closed.
- 이미 풀블리드: 이미지 콘텐츠만 교체하고 desktop/tablet/mobile 기하 변경 0건.

추가 게이트:

```text
node --check scripts/patch-zh-hero-image-2026-07-22.mjs           PASS
npx eslint scripts/patch-zh-hero-image-2026-07-22.mjs \
  tests/patch-zh-hero-image-2026-07-22.test.ts                    PASS
npx tsc --noEmit --incremental false                             PASS
git diff --check                                                 PASS
```

빈 임시 로컬 backend를 지정해 plain `node` CLI dry-run을 시연했다. 결과는 예상대로 안전 중단이었고 생성된 파일은 없었다.

```text
zh-hant hero image patch aborted: Published zh-hant home canvas was not found.
exit=1
```

## 남은 위험과 적용 후 확인

- production 문서를 읽지 않았으므로 실제 old -> new 목록, node 크기, responsive override 구성은 발주자 환경의 기본 dry-run으로 먼저 확인해야 한다.
- 스크립트는 `srcByLocale`/`altByLocale`의 `zh-hant` key만 교체하고 다른 locale override를 보존한다. production 자료가 이와 다른 의미로 locale override를 사용한다면 dry-run에서 반드시 검토해야 한다.
- responsive 폭은 스키마의 desktop -> tablet -> mobile cascade를 따라 유효 값을 비교한다. root보다 좁은 경우만 override를 추가/교체하므로, 기존에 root보다 넓은 오버플로우가 있어도 이 스크립트가 축소하지는 않는다.
- 기존 발행 파이프라인은 revision 저장, published canvas 저장, site meta 저장을 하나의 외부 스토리지 트랜잭션으로 묶지 않는다. draft 저장 후 publish 중간 실패 시 패치된 draft가 남을 수 있으므로 재실행 전 draft 상태를 확인해야 한다.
- `publishPage`는 기존 제품 동작에 따라 cache revalidation, search index best-effort rebuild, publish webhook/app hook를 수반할 수 있다. 운영 적용은 이 효과를 허용한 유지보수 창에서 수행해야 한다.
- `--apply` 성공 후 `/zh-hant`를 desktop/tablet/mobile에서 열어 우측 빈틈, 로테이션 정지 시각, cover crop, 중앙 focal point, 대체 텍스트를 실화면으로 확정해야 한다.
