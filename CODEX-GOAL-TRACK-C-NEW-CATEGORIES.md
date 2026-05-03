# Codex /goal — Track C: 신규 카테고리 +10~15 추가

## Goal (one-line)

`src/lib/builder/templates/` 에 신규 카테고리 ≥ 10개 추가. 19 → **30+ 카테고리**, 페이지 합계 170 → **240+**.

## 마스터 지시서

전체 컨텍스트는 `/Users/son7/Projects/tseng-law/CODEX-GOAL-TEMPLATE-DESIGN-EXPANSION.md`. 본 트랙은 그 § 2 + § 5 의 self-contained 발주판.

## 기존 카테고리 (참고용 — 건드리지 마)

```
beauty / blog / cafe / consulting / creative / ecommerce / education /
fitness / health / law / music / pet / photography / realestate /
restaurant / startup / travel / portfolio (현재 0개)
```

본 트랙은 **신규 카테고리 디렉토리**만 만든다. 기존 19 카테고리 폴더 안 건드림.

## 신규 카테고리 후보 (≥ 10개 선택)

| 카테고리 | 사용 예 | 추천 sub-page set (7~10) |
|---|---|---|
| **agency** | 마케팅/디자인/개발 에이전시 | home / about / services / work / case-study / team / process / contact |
| **saas** | SaaS landing | home / features / pricing / integrations / changelog / customers / contact |
| **nonprofit** | 비영리 단체 | home / mission / programs / donate / volunteer / events / contact |
| **conference** | 컨퍼런스 / 세미나 | home / agenda / speakers / sponsors / venue / register / faq |
| **podcast** | 팟캐스트 | home / episodes / about / hosts / subscribe / contact |
| **magazine** | 매거진 | home / issue / articles / authors / about / subscribe |
| **dental** | 치과 / 의원 | home / about / services / team / booking / insurance / contact |
| **yoga** | 요가 스튜디오 | home / classes / instructors / schedule / pricing / about / contact |
| **portfolio** | 개인 포트폴리오 (현재 빈 폴더) | home / about / work / case-study / process / contact / cv |
| **freelancer** | 프리랜서 | home / services / portfolio / pricing / testimonials / contact |
| **wedding** | 웨딩 / 이벤트 플래너 | home / services / portfolio / pricing / about / contact |
| **carrental** | 렌터카 | home / fleet / locations / pricing / about / contact |
| **eventplanner** | 이벤트 기획 | home / services / portfolio / venues / about / contact |
| **applanding** | 모바일 앱 랜딩 | home / features / screenshots / pricing / faq / download |

**최소 10개 선택**. 권장: 다양성 위해 다른 산업군에서 골고루 (agency / saas / nonprofit / conference / podcast / magazine / dental / yoga / portfolio / wedding 추천).

## 페이지 구조 룰 (모든 페이지 공통, 마스터 § 2.2)

페이지당 **40~70 노드**, 섹션 **6~7개**. 카테고리 톤 정한 후 다음 구조:

1. **Hero** — title (className `hero-title`) + subtitle (`hero-subtitle`) + eyebrow (`hero-eyebrow`) + CTA + bg
2. **Value props / Features** — 3~4 카드 (`card-title` / `card-copy`)
3. **Stats / Counter** — 4 metric (`stat-card`)
4. **Showcase** — 카드 / 갤러리 (`office-card` / `services-detail-card`)
5. **Testimonial / Social proof** — quote (`split-text` / `split-image`)
6. **CTA banner**
7. **(카테고리 특수)** — pricing / team / FAQ / blog teaser / newsletter / agenda / fleet / classes 등

**헤더/푸터는 인라인 노드로 추가하지 마** (글로벌 시스템).

## 디자인 룰 (마스터 § 2)

- 색상: `BuilderTheme.colors` 또는 brand-aligned hex (카테고리 톤에 맞게)
- 폰트: `--font-heading-ko` / `--font-body` / 등록된 Google Fonts
- spacing: 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128
- borderRadius: 0 / 4 / 8 / 12 / 16 / 24 / 9999
- className hint 활용 (자동 entrance/hover):
  - text: `hero-title` / `hero-subtitle` / `hero-eyebrow` / `section-label` / `hero-cta`
  - container: `office-card / services-detail-card / stat-card / split-text / split-image / card-copy / card-title`

## 컴포넌트 사용 룰

**신규 위젯 kind 추가 금지.** 기존 30+ kind만:

```
container / section / text / heading / image / button / divider / spacer / icon /
columnCard / columnList / attorneyCard / blogPostCard / blogFeed / featuredPosts /
contactForm / formInput / form / formSelect / formTextarea / formCheckbox / formRadio / formSubmit /
ctaBanner / faqList / gallery / map / videoEmbed / customEmbed / bookingWidget
```

이미지 alt 필수.

## 작업 단위 (auto-break)

**카테고리 1개 = 1 commit**. 한 카테고리 안에서:

1. 신규 디렉토리 `src/lib/builder/templates/{cat}/` 생성
2. 7~10 페이지 (홈 + 보조) 작성. 각 페이지 40~70 노드.
3. `src/lib/builder/templates/registry.ts`에 import + export 등록
4. `src/lib/builder/templates/metadata.ts`에 `CATEGORY_DEFAULTS`에 카테고리 entry 추가
5. **단위 게이트**:
   ```bash
   npx tsc --noEmit --incremental false
   ```
6. commit

마지막 카테고리 끝나면 추가로:
- `src/lib/builder/templates/__tests__/registry.test.ts` 의 `expect(all).toHaveLength(170)` 를 새 합계로 update
- `expect(cats).toHaveLength(17)` (실제 카테고리 수) 도 새 합계로 update
- registry test 통과 확인

## Commit 메시지 규칙

각 카테고리:
```
templates({cat}): add new category with {N} pages

신규 카테고리 '{cat}' — {sub-page list}.
페이지당 노드 ~{N} (40~70 범위).
registry.ts / metadata.ts 등록.
className hint 활용.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

마지막 (registry.test.ts update):
```
templates(track-c): update registry test counts (170 → {new-total})

신규 카테고리 {N}개 추가 후 합계 업데이트.
expect(all).toHaveLength({new-total}).
expect(cats).toHaveLength({new-cat-count}).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

## Out of scope (이 트랙에서 안 함)

- 기존 19 카테고리 페이지 변경 (Track A 영역)
- Section templates 변경 (Track B 영역)
- 신규 위젯 kind 추가
- 글로벌 헤더/푸터 변경

## 충돌 회피

본 트랙은:
- ✅ 신규 디렉토리 `src/lib/builder/templates/{new-cat}/` 만 create
- ✅ `registry.ts` import/export 추가 (Track A/B와 disjoint)
- ✅ `metadata.ts` `CATEGORY_DEFAULTS` 추가
- ✅ `__tests__/registry.test.ts` count 업데이트 (마지막 1회만)

다른 트랙과 disjoint:
- Track A는 기존 19 카테고리 폴더만
- Track B는 `sections/templates.ts` 만

## Success criteria

- 신규 카테고리 ≥ 10개, 페이지 ≥ 70개 (170 → 240+)
- 각 페이지 노드 ≥ 40
- registry.ts 에 신규 import + export 모두 등록
- metadata.ts CATEGORY_DEFAULTS 에 모든 신규 카테고리 추가
- registry test의 expected count 새 합계로 통과
- `npm run typecheck` ✅
- `npm run test:unit` ✅
- `npm run build` ✅

## 검증 명령

### 단위 (각 카테고리)
```bash
npx tsc --noEmit --incremental false
```

### 트랙 끝
```bash
npm run typecheck && npm run lint && npm run test:unit && \
  npm run security:builder-routes && npm run build
```

### 카테고리 / 페이지 합계 sanity
```bash
ls -d src/lib/builder/templates/*/ | wc -l   # 카테고리 디렉토리
find src/lib/builder/templates -name "*.ts" -not -path "*__tests__*" \
  -not -name "registry.ts" -not -name "types.ts" -not -name "metadata.ts" \
  -not -name "filters.ts" -not -name "design-system.ts" | wc -l  # 페이지 파일 합계
```

## SESSION.md 갱신 (트랙 끝)

```
## YYYY-MM-DD Track C: 신규 카테고리 +N개 완료
- 19 → {new-cat-total} 카테고리
- 페이지 합계 170 → {new-page-total}
- 신규 카테고리: {list}
- registry.test.ts 카운트 새 합계로 update
- 검증: typecheck / lint / test:unit / build 모두 통과
```

## 참조

- `src/lib/builder/templates/types.ts` — PageTemplate 형식
- `src/lib/builder/templates/registry.ts` — import/export 등록 패턴
- `src/lib/builder/templates/metadata.ts` — CATEGORY_DEFAULTS 패턴
- `src/lib/builder/decompose/shared.ts` — node helper
- `src/lib/builder/site/heuristic-defaults.ts` — className hint 매칭
- `src/lib/builder/templates/__tests__/registry.test.ts` — count 통과 기준
- 기존 카테고리 sample (참고): `src/lib/builder/templates/law/law-home.ts`
