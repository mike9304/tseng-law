# SESSION.md — 현재 세션 인수인계

## 세션: S-03 (className pass-through + container children render + case-results 파일럿 decompose → W06)
## 마지막 업데이트: 2026-04-18 (사전 정찰 후 수정 2)

---

## 🔥 컴퓨터 다시 켜면 바로 할 일

1. **이 파일 읽기** (SESSION.md)
2. **AGENTS.md 읽기**
3. **Wix 체크포인트.md 점수 확인** — 현재 🟢 **4 / 225**
4. **dev 서버 띄우기**: `cd /Users/son7/Projects/tseng-law && npm run dev`
5. **S-03 작업 1 (parentId 인프라) 부터 시작**

---

## 목표 & target

**S-03 target W = W06 (드래그 이동 + 스냅 가이드)** 을 🟢 로 전환.

단 W06 만 따로 고쳐서 green 이 되는 구조가 아니라, **hero 섹션 decompose** 가 선행돼야 "실제 드래그 가능한 원본 페이지 요소" 가 생긴다. 따라서 S-03 은:

1. Container `parentId` 인프라 동작 (현재 "껍데기") — 자식 노드가 부모 container 에 실제로 속하고, flex/grid 레이아웃이 렌더됨.
2. Hero 섹션 파일럿 decompose — HeroSearch composite 을 ~8 노드 트리 (container + 4 text + 1 button + search container + input) 로 변환.
3. 파일럿 hero seed → publish → 브라우저에서 W06 (드래그 이동 + 스냅) 포함 W02/W03/W07/W09 도 부수적으로 검증.

Hero 만 성공하면 S-04/S-05 에서 나머지 8 home 섹션 + 9 서브페이지 propagate. 실패 시 근본 설계 재검토.

---

## 성공 기준 (녹색 조건)

- **W06 🟢** : 브라우저에서 `/ko/admin-builder` 접속 → hero 섹션 내부의 "대만 법률을 한국어로 명확하게" h1 노드 또는 검색 버튼 노드를 **직접 클릭해서 선택** → 마우스로 **드래그해서 위치 이동** → 스냅 가이드 표시 → 이동 완료 → **Draft 저장** → 새로고침 → 이동한 위치 유지.
- Hero 섹션 총 노드 개수 ≥ 6 (builder 로 decompose 됐음을 확인)
- `npx tsc --noEmit` exit 0
- `/ko` 공개 페이지 렌더 여전히 원본과 시각 동일 (회귀 없음)

---

## 금지 범위

- `tree.ts` 건드림 (블랙박스)
- `node.rect` 를 절대 좌표로 되돌리기
- 컴포지트 내부 이벤트 직접 핸들링 — surface-context / overlay 경유
- hero 외 다른 composite 건드림 (S-03 범위 밖)
- `git push --force`, `--no-verify`
- 브라우저 검증 없이 "Green" 선언
- 계획이 계속 바뀌게 하는 충동적 피벗 — 사용자가 명시적으로 target 을 바꾸지 않는 한 W06 만 판다

---

## 실행 계획

### 정찰 결과 반영 (사전 검증 2026-04-18)

- `parentId` 인프라는 types/store/tree 에 이미 있음. **작업 1 스킵**.
- `container/Element.tsx` 가 `{content.label}` 만 렌더 → **자식 미렌더**. 진짜 "껍데기". 공개/에디터 렌더러는 `childrenMap` 로 children 을 Element 의 sibling 으로 그림. flex/grid CSS 는 Element 내부에 있고 children 은 외부 → 레이아웃 안 됨. **수정 필요**.
- Builder kinds (text/heading/button/container) 의 Render 는 className pass-through 없음 — `fontSize/color/background` 등 inline style 만. hero `.hero-title` / `.hero-search-wrapper` translateY 를 쓰려면 className 필수. **추가 필요**.
- `snap.ts` `computeSnap` 이 CanvasContainer 드래그에서 이미 호출 중. W06 snap 조건 OK.
- 파일럿 대상을 **hero → home-case-results** 로 변경. case-results 는 텍스트 4개 + 링크 1개, 특수 CSS 없음 (`.section--dark` 섹션 + inline padding/color 만).

### 작업 1 — Builder kinds 에 className / as="tag" 지원 추가 (Claude 직접)

파일: `src/lib/builder/canvas/types.ts` + `src/components/builder/canvas/elements/TextElement.tsx` + `src/lib/builder/components/{heading,button,container}/Element.tsx`

스키마:
- text/heading/button/container content 에 `className: z.string().max(256).optional()` + `as: z.string().max(32).optional()` 추가 (text: `as` 로 span/p/h1~h6/div 선택)

Render 반영:
- TextElement: `React.createElement(node.content.as ?? 'div', { className: node.content.className, style: {...기존...} }, ...)`
- ButtonElement / HeadingElement / ContainerElement 동일 패턴

주의: className 지정 시 기존 inline style 을 deactivate 하지 않고 **둘 다 적용** (inline 이 우선). 사용자가 className 으로 기본 설정하고 inline 으로 오버라이드 가능.

### 작업 2 — Container children 실제 렌더 (Claude 직접)

2 옵션 중 하나:
- **옵션 α**: `component.Render` 가 `children?: ReactNode` prop 을 받게 변경. public-page/CanvasNode 가 childNodes 를 prop 으로 전달. Container Element 는 `{label}` 빼고 `{children}` 렌더.
- **옵션 β**: public-page/CanvasNode 에서 container 노드 outer wrapper 에 `flexToCSS/gridToCSS` 를 적용 (현재 Element 안에만 있음). children 은 position:absolute/relative 를 노드 layoutMode 따라 다르게.

**옵션 α 선택** — 더 깔끔, 범용. BuilderComponentRenderProps 시그니처 확장.

구현:
- `src/lib/builder/components/define.ts` 의 `BuilderComponentRenderProps` 에 `children?: React.ReactNode`
- `src/lib/builder/site/public-page.tsx`: `<component.Render node={node} mode="published">{childNodes.map(...)}</component.Render>` 로 변경. 현재 sibling 으로 렌더하는 부분은 container kind 가 아닐 때만 (backward compat).
- `src/components/builder/canvas/CanvasNode.tsx`: 동일
- `src/lib/builder/components/container/Element.tsx`: `function ContainerElement({ node, children })` 추가, `{label}` 대신 `{children}` 렌더 (label 은 에디터 overlay 용으로 별도 표시)

### 작업 3 — home-case-results 파일럿 decompose (Claude 직접)

**Input**: `HomeCaseResultsSplit.tsx` 구조:
```
<section className="section section--dark split-section split--text-only home-results-panel" id="results" data-tone="dark">
  <div className="split-content home-results-content" data-builder-node-key="copy">
    <div className="section-label home-results-label">RESULTS</div>
    <h2 className="split-title home-results-title">한국 학생 헬스장...<br/>157만 TWD 승소</h2>
    <div className="split-divider" />
    <p className="split-text home-results-text">한국 대학생이...판결을 받았습니다.</p>
    <p className="split-text home-results-text">사실관계 입증...대표 사례입니다.</p>
    <a className="link-underline home-results-link" href="/ko/columns">소송사례 더 보기 →</a>
  </div>
</section>
```

**Output** (노드 트리 — 텍스트/버튼/컨테이너 kind 사용, className pass-through 로 원본 CSS 유지):
```
container#case-results-root
  className: "section section--dark split-section split--text-only home-results-panel"
  id: "results", as: "section"
  layoutMode: absolute (기본) — 자식 절대 위치 유지
  ├─ container#case-results-content
  │   className: "split-content home-results-content"
  │   ├─ text#case-results-label
  │   │   content.text: "RESULTS", className: "section-label home-results-label", as: "div"
  │   ├─ text#case-results-title
  │   │   content.text: "한국 학생 헬스장 부상 사건,\n157만 TWD 승소"
  │   │   className: "split-title home-results-title", as: "h2"
  │   ├─ container#case-results-divider (className: "split-divider")
  │   ├─ text#case-results-desc
  │   │   content.text: "한국 대학생이 대만 헬스장에서...판결을 받았습니다."
  │   │   className: "split-text home-results-text", as: "p"
  │   ├─ text#case-results-summary
  │   │   content.text: "사실관계 입증, 손해 산정...대표 사례입니다."
  │   │   className: "split-text home-results-text", as: "p"
  │   └─ button#case-results-cta
  │       content.text: "소송사례 더 보기 →", href: "/ko/columns"
  │       className: "link-underline home-results-link"
```

`node.rect` 는 local-to-parent. root 의 rect 는 case-results composite 과 같은 정도 (y=위치, w=1280, h=600).

구현:
- 새 파일 `src/lib/builder/canvas/decompose-case-results.ts` — `createCaseResultsDecomposedNodes(rootY: number, locale): BuilderCanvasNode[]`
- `seed-home.ts` 에 hybrid 배열: 일부는 composite spec, home-case-results 만 decomposed 노드 배열. `SEED_VERSION = 'home-seed-v5'`
- 나머지 8 섹션은 composite 유지.

### 작업 3 — Publish + 검증 (Claude)

- `?reseed=1` 으로 force 재시딩 trigger (SEED_VERSION bump 만으로도 트리거)
- curl `/ko` → builder-pub-node 개수 증가 확인 (9 → 더 많이)
- `npx tsc --noEmit` → exit 0
- dev log 에러 없음

### 작업 4 — 브라우저 full flow 검증 (User)

1. `/ko/admin-builder?reseed=1` 접속 → hero 가 "여러 독립 노드" 로 보임 (각 노드 hover 시 outline)
2. "대만 법률을 한국어로 명확하게" h1 클릭 → 선택 (파란 핸들 8개)
3. 마우스로 드래그 → 위치 이동, 스냅 가이드 보임
4. 드롭 → 이동 완료, Draft 저장 인디케이터
5. 새로고침 → 이동한 위치 유지 (draft persist)
6. `/ko` 공개 페이지 → hero 시각 여전히 원본과 같음 (배경·글꼴·정렬 회귀 없음)

---

## 마스터 플랜 스코프 (SESSION 간 불변)

**에디터 1:1 패리티 + Motion 풀 세트 + Wix Bookings** (상담 예약)

체크포인트: W01~W225 (`/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md`)

### Phase 로드맵

| Phase | 범위 | W | 상태 |
|---|---|---|---|
| 0 | F0 메인 사이트 → 빌더 전환 | — | 🟢 composite publish 완료 |
| 1 | 에디터 코어 + 슬롯 편집 | W01~W30 | 🟡 4/30 green, 슬롯 편집 인프라 완성, **S-03 에서 decompose + W06 도전** |
| 2 | 모바일 & 반응형 | W31~W45 | 🔴 |
| 3 | 위젯 라이브러리 70개 | W46~W135 | 🔴 |
| 4 | 폼 빌더 | W136~W150 | 🔴 |
| 5 | Motion | W151~W175 | 🔴 |
| 6 | 디자인 시스템 | W176~W185 | 🔴 |
| 7 | SEO/Publish maturity | W186~W195 | 🔴 |
| 8 | Wix Bookings | W196~W215 | 🔴 |
| 9 | 에디터 고도화 | W216~W225 | 🔴 |

---

## S-02 검증 대기 (별도 처리 — S-03 과 병행 가능)

- **W03 인라인 텍스트 편집** (composite 내부): 브라우저에서 composite 선택 → 내부 텍스트 클릭 → 타이핑 → Enter → 새로고침 유지 확인.
- **W12 Inspector 탭**: 공식 green 승격.
- **서브페이지 시각 1:1 대조**: tseng-law.com/ko/{about,services,...} vs 로컬 비교.

※ 이들은 S-02 인프라 검증용이지 S-03 target 이 아님. 사용자가 편할 때 확인.

---

## 중요 파일 위치 (변경 없음)

- **AGENTS.md**: `/Users/son7/Projects/tseng-law/AGENTS.md`
- **Wix 체크포인트**: `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md`
- **계획서**: `/Users/son7/Desktop/ai memory save 계획/사이트 빌더 계획서.md` (§16 Changelog)

---

## 핵심 코드 이정표 (S-03 관련)

| 파일 | 역할 | 주의 |
|---|---|---|
| `src/lib/builder/canvas/types.ts` | `parentId` 필드 확인/추가. node schemas. | **S-03 작업 1** |
| `src/lib/builder/canvas/tree.ts` | `buildChildrenMap`, `resolveCanvasNodeAbsoluteRect` | **블랙박스 — 건드리지 말 것** |
| `src/lib/builder/canvas/store.ts` | childrenMap state, updateNode | parentId 지원하는지 확인 |
| `src/lib/builder/canvas/decompose-hero.ts` | **신규** — hero composite → 노드 트리 변환기 | S-03 작업 2 |
| `src/lib/builder/canvas/seed-home.ts` | SEED_VERSION v4 → v5, hero 슬롯만 decompose 결과로 교체 | S-03 작업 2 |
| `src/lib/builder/site/public-page.tsx` | `renderPublishedNode` 재귀 — parentId/childrenMap 기반 | 이미 childrenMap 사용 중 (S-02 에서 확인) |
| `src/components/builder/canvas/CanvasNode.tsx` | nestedChildren 렌더 — 확인 | container kind 가 자식 그리는지 |
| `src/lib/builder/components/container/*` | container Render — flex/grid 레이아웃 실제 적용 | 껍데기 상태 해결 |

---

## 역할

- **Claude Opus = Manager / Architect**: SESSION 작성, 직접 코드 (parentId + decompose-hero), 검수, Codex 프롬프트
- **Codex = Worker**: S-03 에서는 필요 시만 소폭 작업 (예: 반복 propagate 자동화). Manager 가 직접 수행이 기본
- **User 예외**: 작업 4 (브라우저 검증) 담당

---

## 한줄 요약

"Hero 섹션 하나를 진짜 builder 노드 트리로 쪼개서 W06 드래그가 실제 원본 페이지 요소에서 돌게 — S-04 에서 나머지 확대."
