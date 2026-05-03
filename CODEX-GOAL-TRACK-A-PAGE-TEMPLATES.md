# Codex /goal — Track A: 기존 19 카테고리 페이지 템플릿 quality 향상

## Goal (one-line)

`src/lib/builder/templates/` 의 19 카테고리 (portfolio 제외) × 10 페이지 = 170 파일을 평균 5~6 노드에서 **페이지당 40~70 노드**로 확장. 시각 풍부도 5~10배.

## 마스터 지시서

전체 컨텍스트는 `/Users/son7/Projects/tseng-law/CODEX-GOAL-TEMPLATE-DESIGN-EXPANSION.md`. 본 트랙은 그 § 2 + § 3 의 self-contained 발주판.

## 대상

`src/lib/builder/templates/` 의 다음 19 카테고리:

```
beauty / blog / cafe / consulting / creative / ecommerce / education /
fitness / health / law / music / pet / photography / realestate /
restaurant / startup / travel
```

(portfolio 카테고리는 0개라 본 트랙에서 제외 — Track C 영역)

각 카테고리 폴더 안 10 파일 (예 `law-home.ts / law-about.ts / ... / law-privacy.ts`)을 모두 rewrite.

## 페이지 구조 룰 (모든 페이지 공통, § 2.2)

페이지당 **40~70 노드**, 섹션 **6~7개**. 카테고리 톤(modern / classic / bold / minimal / editorial 중 1)을 정한 뒤 다음 구조로 재작성:

1. **Hero** — title (className hero-title) + subtitle (hero-subtitle) + eyebrow (hero-eyebrow) + CTA 1~2 + background image 또는 그라디언트 액센트
2. **Value props / Features** — 3~4 카드 (icon + title + body, className `card-title` / `card-copy`)
3. **Stats / Counter** — 4 metric (number + label) 또는 logo grid (className `stat-card`)
4. **Showcase** — 카드 / 갤러리 / case study (className `office-card` / `services-detail-card`)
5. **Testimonial / Social proof** — 1~3 quote + avatar + role (className `split-text` / `split-image`)
6. **CTA banner** — 큰 행동 유도
7. **(카테고리 특수)** — pricing / team / FAQ / blog teaser / newsletter / menu / portfolio / classes 등

**헤더/푸터는 인라인 노드로 추가하지 마.** 글로벌 `headerCanvas`/`footerCanvas`가 별도 처리. 페이지 `stageHeight = 마지막 인페이지 섹션 y + height + 80`.

## 디자인 룰 (§ 2)

- 색상: `BuilderTheme.colors` (`primary / secondary / accent / text / background / muted`) 또는 brand-aligned 직접 hex
- 폰트: `--font-heading-ko` / `--font-body` / 이미 등록된 Google Fonts
- spacing rhythm: 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128 px
- borderRadius: 0 / 4 / 8 / 12 / 16 / 24 / 9999 (원형 — Wave3 F3에서 max(9999) 풀림)

## 컴포넌트 사용 룰

**신규 위젯 kind 추가 금지.** 다음 30+ 기존 kind만 사용:

```
container / section / text / heading / image / button / divider / spacer / icon /
columnCard / columnList / attorneyCard / blogPostCard / blogFeed / featuredPosts /
contactForm / formInput / form / formSelect / formTextarea / formCheckbox / formRadio / formSubmit /
ctaBanner / faqList / gallery / map / videoEmbed / customEmbed / bookingWidget
```

helper 함수 (`createContainerNode / createTextNode / createButtonNode / createImageNode`)는 `src/lib/builder/decompose/shared.ts`에서 import. zIndex는 `assignCanvasNodeZIndices`로 자동.

## className hint 활용 (자동 모션)

heuristic-defaults가 다음 className hint 가진 노드에 자동 entrance/hover 적용:

| className hint | 효과 |
|---|---|
| `hero-title / hero-subtitle / hero-eyebrow / section-label / hero-cta` | text/heading slide-up 520ms |
| `office-card / services-detail-card / stat-card / split-text / split-image / split-portrait-badge / card-copy / card-title` | container slide-up 480ms |
| (button kind) | hover lift -2px translateY 자동 |
| (image kind ≥400×240) | fade-in 600ms 자동 |

이 keyword 정확히 사용해서 작성. 오타 시 자동 모션 미발동.

## 이미지 룰

- alt 텍스트 **필수** (publish-gate가 빈 alt 차단)
- 경로 패턴: `/public/images/{slug}/featured-XX.jpg` 또는 기존 다른 템플릿이 사용 중인 unsplash URL 패턴 (한 카테고리 내 일관)

## Out of scope (이 트랙에서 안 함)

- 신규 카테고리 추가 (Track C)
- 신규 위젯 kind 추가
- Section templates 추가 (Track B)
- 글로벌 헤더/푸터 변경
- 다국어 콘텐츠 (현재 ko 콘텐츠 위주, en/zh-hant는 별도)

## 충돌 회피

다른 트랙과 disjoint:
- Track B는 `src/lib/builder/sections/templates.ts` 단일 파일만 (이 트랙 안 건드림)
- Track C는 `src/lib/builder/templates/{new-cat}/` 신규 디렉토리만 (기존 19 카테고리 안 건드림)

→ 본 트랙은 **`src/lib/builder/templates/{기존-cat}/*.ts` 만 수정**. 그 외 파일 만지지 마.

## 작업 단위 (auto-break)

**카테고리 1개 = 1 commit** (총 17 단위). 한 카테고리 안에서:

1. 카테고리 폴더 10 파일 모두 read
2. 카테고리 톤 정의 (modern / classic / bold / minimal / editorial)
3. 10 페이지 모두 위 페이지 구조 룰로 재작성
4. 단위 게이트 (자동):
   ```bash
   npx tsc --noEmit --incremental false
   npm run test:unit -- src/lib/builder/templates/__tests__/registry.test.ts
   ```
5. 카테고리 commit (메시지 §아래)

자동으로 다음 카테고리로 넘어감. 17 카테고리 = 17 commit.

## Commit 메시지 규칙

```
templates({cat}): expand 10 pages to 40~70 node Wix-grade quality

- {cat} 10 페이지 모두 hero+value+stats+showcase+testimonial+cta 구조
- 톤: {modern|classic|bold|minimal|editorial}
- 평균 노드 ~{N} (이전 ~5~6)
- className hint 활용으로 heuristic entrance/hover 자동 적용
- registry test 통과 (170 templates 그대로)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

## Success criteria

- 모든 17 카테고리 작업 후 `npm run test:unit` 통과 (XFAIL 0)
- `npm run build` 통과
- 평균 노드 수 ≥ 40 (각 카테고리 별 측정)
- 새 import / 새 위젯 kind 추가 0
- registry export count 그대로 170 + 0개 (제거 / 추가 0)
- registry test의 `expect(all).toHaveLength(170)` 통과 (변경 없음)

## 검증 명령

### 카테고리 단위 (각 commit 전)
```bash
npx tsc --noEmit --incremental false
npm run test:unit -- src/lib/builder/templates
```

### 트랙 끝 (전체 게이트)
```bash
npm run typecheck && npm run lint && npm run test:unit && \
  npm run security:builder-routes && npm run build
```

### 노드 수 평균 측정 (sanity check)
```bash
for cat in beauty blog cafe consulting creative ecommerce education \
           fitness health law music pet photography realestate \
           restaurant startup travel; do
  total=0
  for f in src/lib/builder/templates/$cat/*.ts; do
    n=$(grep -cE "^\s*createContainerNode|^\s*createTextNode|^\s*createButtonNode|^\s*createImageNode|^\s*heading\(" "$f" 2>/dev/null)
    total=$((total + n))
  done
  echo "$cat avg ~$((total / 10)) nodes/page"
done
```

## SESSION.md 갱신 (트랙 끝)

`SESSION.md` 끝에 다음 한 줄 추가:

```
## YYYY-MM-DD Track A: 기존 19 카테고리 페이지 quality 향상 완료
- 17 카테고리 × 10 페이지 = 170 파일 rewrite
- 평균 노드 5~6 → ~50 (시각 풍부도 +9배)
- className hint 활용으로 heuristic 자동 entrance/hover 자동 적용
- 검증: typecheck / lint / test:unit / build 모두 통과
```

## 참조

- `src/lib/builder/templates/types.ts` — PageTemplate 형식
- `src/lib/builder/decompose/shared.ts` — createContainerNode 등 helper
- `src/lib/builder/site/heuristic-defaults.ts` — className hint 매칭 룰
- `src/lib/builder/templates/__tests__/registry.test.ts` — 통과 기준
- `WIX-PARITY-ROADMAP.md` — 마스터 플랜
