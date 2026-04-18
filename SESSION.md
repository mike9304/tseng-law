# SESSION.md — 현재 세션 인수인계

## 세션: S-04 (병렬: Claude=버튼/링크 편집 UX, Codex=나머지 8 섹션 decompose)
## 마지막 업데이트: 2026-04-18

---

## 🔥 컴퓨터 다시 켜면 바로 할 일

1. **이 파일 읽기** (SESSION.md)
2. **AGENTS.md 읽기**
3. **Wix 체크포인트.md 점수 확인** — 현재 🟢 **4 / 225** (W06 브라우저 검증 후 5 로)
4. **dev 서버 띄우기**: `cd /Users/son7/Projects/tseng-law && npm run dev`
5. **병렬 두 갈래 진행:**
   - Claude 직접: (나) 버튼/링크 편집 UX
   - Codex 발주: (가) 나머지 8 홈 섹션 decompose propagate

---

## 목표 & target

### Claude 직접 (S-04-N) — 버튼/링크 편집 UX

**Target W: W12 부분 승격** (Inspector Content 탭) + **W24/W25 향한 진전**.

1. **Button kind Inspector Content 탭 실제 구현** — 현재 placeholder. 편집 필드:
   - Label (text)
   - Href (URL)
   - Target (_self / _blank)
   - Style variant (primary/secondary/outline/ghost/link)
   - className (read-only, 참고용 표시)
2. **우클릭 컨텍스트 메뉴 확장** — button/link 노드 우클릭 시 "링크 편집" 항목 추가 → Inspector Content 탭 자동 전환 + href 필드 포커스.
3. **인라인 편집** — 버튼 노드를 composite 에서 SurfaceText 패턴으로 클릭하면 label 인라인 편집 가능하게. 이미 case-results-cta 는 decomposed button 이므로 InlineTextEditor 동작 확인.

성공 기준:
- `/ko/admin-builder` 에서 case-results CTA (소송사례 더 보기) 클릭 → Inspector Content 탭 → Href 를 `/ko/test` 로 변경 → 공개 페이지 새로고침 → href 반영
- 버튼 노드 더블클릭 또는 인라인 클릭 → label "소송사례 더 보기" 를 "더보기" 로 수정 → 새로고침 유지

### Codex 발주 (S-04-C) — 나머지 8 홈 섹션 decompose propagate

target W: W01 유지 + **W06 전 홈 섹션 확장 준비**.

8 섹션: hero / insights / services / attorney / stats / faq / offices / contact 를 case-results 와 동일 패턴 (container + text + button + className pass-through) 으로 decompose.

각 섹션마다 `decompose-{section}.ts` 파일, seed-home 의 composite slot 을 decomposed 로 교체. SEED_VERSION home-seed-v6.

동적 리스트 (ServicesBento `services.items.map`, InsightsArchive posts, FAQAccordion items, OfficeMapTabs, HomeStatsSection items) 는 각 item 을 **독립 builder 노드 트리** 로 전개. 큰 loop 반복.

**Codex 프롬프트는 § 하단 "Codex 발주 프롬프트 S-04-C" 참조.**

성공 기준:
- `npx tsc --noEmit` exit 0
- `/ko` 시각이 원본 tseng-law.com 과 100% 동일 (회귀 없음)
- `/ko` 총 builder-pub-node 개수 16 → 150+ (각 섹션 decompose 만큼 증가)
- 에디터에서 각 섹션 내부 요소 (hero title, services item, faq question 등) 개별 클릭 선택 가능

---

## 성공 기준 종합 (S-04 녹색 조건)

- Claude 파트 검증 완료 (case-results CTA href 편집 + label 인라인 편집)
- Codex 파트 검증 완료 (/ko 원본 대비 시각 회귀 없음 + 각 요소 개별 편집)
- `npx tsc --noEmit` exit 0
- 사용자 브라우저 확인 후 W03 / W12 / W06 적절히 녹색 승격

---

## 금지 범위

- `tree.ts` 건드림
- `node.rect` 를 절대 좌표로 되돌리기
- decompose 된 DOM 의 className 변경 (원본 CSS 와 맞춰야 함)
- composite 아닌 다른 렌더 경로 재도입
- `git push --force`, `--no-verify`
- 브라우저 검증 없이 "Green" 선언
- **S-04 범위 밖 작업**: Phase 2 (모바일) / Phase 3 (위젯) / Phase 4 (폼) / Phase 5 (Motion) 등은 이번 세션에 건드리지 말 것. 아이디어가 떠올라도 메모하고 끝.

---

## Codex 발주 프롬프트 (S-04-C)

````
## 작업: 나머지 8 홈 섹션 decompose propagate (S-03 case-results 패턴 확장)

### 배경
S-03 에서 home-case-results composite 을 decomposed 노드 트리 (8 노드) 로 전환 완료. 패턴:
- `src/lib/builder/canvas/decompose-case-results.ts` — `createCaseResultsDecomposedNodes(y, locale, zBase): BuilderCanvasNode[]`
- root container: `className="section section--dark ... home-results-panel"`, `as: 'section'`, `htmlId: 'results'`, `dataTone: 'dark'`
- 자식: text/button 노드에 className 직접 지정 (`section-label home-results-label`, `split-title home-results-title` 등)
- `seed-home.ts` 의 `HomeSectionSpec` 유니언에 `{ kind: 'decomposed', builder, height }` 형태로 슬롯 교체
- className pass-through 기반: text/button/container Element 가 className 있을 때 원본 CSS 적용

이번 작업: **남은 8 섹션도 동일 패턴으로 decompose**.
- hero (HeroSearch)
- insights (InsightsArchiveSection)
- services (ServicesBento)
- attorney (HomeAttorneySplit)
- stats (HomeStatsSection)
- faq (FAQAccordion)
- offices (OfficeMapTabs)
- contact (HomeContactCta)

### 원칙
1. **각 섹션당 `src/lib/builder/canvas/decompose-{section}.ts` 파일 신규.** export: `create{Section}DecomposedNodes(y, locale, zBase): BuilderCanvasNode[]` + `export const {SECTION}_ROOT_HEIGHT`.
2. **입력**: 대응하는 React 컴포넌트의 JSX 구조를 그대로 따라가면서 node 트리로 변환. 원본 className/id/data-tone 유지.
3. **동적 리스트는 각 item 을 독립 노드 트리**로 전개. 예: ServicesBento 의 `services.items.map(...)` 6개 서비스 → 각 서비스 카드가 container + title text + description text + link button 등 4~8 노드. 각 item 의 index 를 node id 접미사에 포함 (`services-item-0-title`, `services-item-0-desc`).
4. **parentId 로 트리 구조** 표현. root 는 parentId 없음, 나머지는 직계 부모 id 지정.
5. **layoutMode** 는 기본 `absolute` (children 이 rect.x/rect.y 로 배치). 원본 CSS 가 flex/grid 하는 부분은 container 의 className 에 맡기고 layoutMode 는 absolute 로 두기 (layoutMode:'flex' 는 아직 완전 테스트 안됨).
6. **rect 좌표**: local-to-parent (AGENTS.md lock-in). root 의 rect.y 는 seed-home 에서 주입받고, 자식들은 부모 안에서의 상대 위치.
7. **DOM 태그**: text 는 `as: 'div'|'span'|'p'|'h1~h6'` 중 선택 (원본 JSX 와 일치). button 은 `as: 'a'|'button'`.
8. **locale 별 copy** 는 각 React 컴포넌트에서 그대로 복사. keys: ko / zh-hant / en.

### 작업 절차

1. **각 컴포넌트 JSX 구조 파악** — `src/components/HeroSearch.tsx`, `src/components/ServicesBento.tsx`, 등등.
2. **`decompose-{section}.ts` 파일 9개 생성** (hero, insights, services, attorney, stats, faq, offices, contact, 그리고 home-stats 는 "stats" 단축).
3. **`seed-home.ts` 수정**: `homeSections` 배열에서 각 composite 슬롯을 decomposed 로 교체. `SEED_VERSION = 'home-seed-v6'`.
4. **import 정리** — 사용 안 하는 composite componentKey 는 types.ts `compositeComponentKeys` 에서 제거하지 말 것 (서브페이지가 여전히 사용). composite/Render.tsx switch 도 유지.
5. **타입체크 + curl 검증**.

### 검증

1. `npx tsc --noEmit` exit 0
2. dev 서버 띄우고 `/ko/admin-builder?reseed=1` GET 으로 v6 강제 재시딩
3. `curl -u admin:local-review-2026! http://localhost:3000/ko` → builder-pub-node 개수 크게 증가 (예상 150 이상)
4. 시각 회귀 없음:
   - `curl ... /ko | grep -oE '<section[^>]*id="[^"]*"[^>]*>'` — 각 섹션 id 정상
   - `curl ... /ko | grep -oE 'class="hero"'`, `class="section-title"` 등 원본 CSS 클래스 정상 SSR
5. 특히 까다로운 부분:
   - **Hero 의 검색창** (form/input/button + dropdown quick-menu): HeroSearch 는 client 상태 (`useState`, `useEffect`) 를 사용. form 자체는 decompose 해도 기능 유지 어려움. **대안**: hero 상단 영역 (label/title/subtitle/link) 만 decompose, 검색창은 하나의 container "hero-search-widget" 으로 남겨두거나 아예 기능 빼고 정적 UI 만 모방.
   - **FAQAccordion items**: accordion 열림 상태 (`useState openIndex`). decompose 된 각 FAQ 아이템은 정적으로만 렌더 — 인터랙션 포기. 또는 interactive 만 composite 으로 남기고 static wrapper 만 decompose.
   - **ScrollHighlightText** (stats description): 특수 컴포넌트. description 은 일반 text 노드로 decompose 하되 highlight word 기능 포기.
6. 브라우저 육안 — RESULTS 섹션처럼 각 섹션도 원본과 같은 비주얼.

### 금지

- `tree.ts` 건드림
- composite/Render.tsx 의 기존 switch case 제거 (서브페이지가 사용 중)
- `SEED_VERSION` 을 v4 / v3 등 과거 값으로 변경
- `git push --force`, `--no-verify`

### 리턴 포맷

- 변경 파일 목록 + 각 파일 한 줄 요약
- typecheck 결과
- curl 검증: builder-pub-node 개수, 주요 섹션 id/class grep 결과
- 동적 리스트 (services items, insights posts 등) 각각 몇 노드로 decompose 됐는지
- 기능 포기한 부분 명시 (hero search interactive, faq accordion 등)
- 사용자 브라우저 확인 필요 항목 체크리스트
````

---

## 마스터 플랜 스코프 (SESSION 간 불변)

**에디터 1:1 패리티 + Motion 풀 세트 + Wix Bookings** (상담 예약)

체크포인트: W01~W225 (`/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md`)

### Phase 로드맵

| Phase | 범위 | W | 상태 |
|---|---|---|---|
| 0 | F0 메인 사이트 → 빌더 전환 | — | 🟢 composite + 1 decomposed pilot |
| 1 | 에디터 코어 + 슬롯 편집 | W01~W30 | 🟡 4/30 green, S-04 에서 W03/W06/W12 확대 목표 |
| 2~9 | 모바일/위젯/폼/Motion/Design/SEO/Bookings/고도화 | W31~W225 | 🔴 |

---

## S-02 / S-03 검증 대기 (별도 처리)

- W03 인라인 텍스트 편집: Inspector 경로 OK, 캔버스 contentEditable + decompose 된 text 노드의 InlineTextEditor 모두 녹색 승격 대기
- W06 드래그: case-results-title 노드 드래그 + snap 가이드 + persist 확인됨 (사용자 "되는거 같아" 보고) → 녹색 승격 대기
- W12 Inspector: Layout/Style/Content/A11y/Seo 탭 기본 동작 확인 대기

---

## 중요 파일 위치

- **AGENTS.md**: `/Users/son7/Projects/tseng-law/AGENTS.md`
- **Wix 체크포인트**: `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md`
- **계획서 §16 Changelog**: `/Users/son7/Desktop/ai memory save 계획/사이트 빌더 계획서.md`

---

## 핵심 코드 이정표

| 파일 | 역할 | 주의 |
|---|---|---|
| `src/lib/builder/canvas/types.ts` | className / as / htmlId / dataTone pass-through 스키마 (S-03) | |
| `src/lib/builder/canvas/decompose-case-results.ts` | S-03 파일럿 — 8 노드 decompose 패턴 예시 | S-04 propagate 원본 |
| `src/lib/builder/canvas/decompose-{hero,insights,...}.ts` | S-04 Codex 생성 예정 | |
| `src/lib/builder/canvas/seed-home.ts` | HomeSectionSpec union (composite | decomposed), SEED_VERSION | S-04 후 v6 |
| `src/lib/builder/components/container/Element.tsx` | children 렌더 + className/as/htmlId 지원 | S-03 |
| `src/components/builder/canvas/elements/TextElement.tsx` | className 경로 + as 태그 선택 | S-03 |
| `src/components/builder/canvas/elements/ButtonElement.tsx` | className 경로 + as=a/button + href | S-03 |
| `src/lib/builder/components/define.ts` | BuilderComponentRenderProps.children 추가 | S-03 |
| `src/lib/builder/site/public-page.tsx` | container kind 은 children prop, 그외 sibling | S-03 |
| `src/components/builder/canvas/CanvasNode.tsx` | container kind 은 children prop, 그외 sibling | S-03 |
| `src/lib/builder/components/button/Inspector.tsx` | **S-04-N 확장** — label/href/target/style 편집 필드 | |
| `src/components/builder/canvas/CanvasContainer.tsx` | context menu — S-04-N 에서 "링크 편집" 항목 추가 | |

---

## 역할

- **Claude Opus = Manager / Architect**: SESSION 작성 + S-04-N (버튼/링크 편집 UX) 직접 구현 + Codex 산출물 검수
- **Codex = Worker**: S-04-C (8 섹션 decompose propagate) 실행. 위 Codex 프롬프트 그대로 받아서 수행
- **User**: 브라우저 검증 + W 녹색 승격 최종 판정

---

## 한줄 요약

"S-04 병렬: Claude 는 버튼 Inspector/우클릭/href 편집을 완성하고, Codex 는 case-results 패턴을 나머지 8 홈 섹션에 propagate 한다. 끝나면 홈 전체가 decomposed + 링크 편집 가능."
