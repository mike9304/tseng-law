# SESSION.md — 현재 세션 인수인계

## 세션: S-07 (Container auto-layout 실동작 — Codex 주도)
## 마지막 업데이트: 2026-04-20

---

## 🔥 컴퓨터 다시 켜면 바로 할 일

1. **이 파일 읽기** (SESSION.md)
2. **AGENTS.md 읽기** (특히 §"껍데기만 완성" container 항목)
3. **Wix 체크포인트.md 점수 확인** — 현재 🟢 **4 / 225**
4. **dev 서버 띄우기**: `cd /Users/son7/Projects/tseng-law && npm run dev`
5. **S-07 Codex 프롬프트 (§ 하단) 발주** → 결과 검수 → 브라우저 대조

---

## 목표 & target

**S-07 target**: 컨테이너 auto-layout (flex/grid) 이 실제로 자식 배치에 효과를 내도록 렌더러 수정.

**현재 상태**:
- `parentId` schema 존재 (`types.ts:90`)
- Container Element 가 자기 style 에 `flexToCSS`/`gridToCSS` 를 올림 (`container/Element.tsx:25~29`)
- 하지만 `public-page.tsx:157` 과 `CanvasNode.tsx:174` 둘 다 **non-top-level child wrapper 를 `position: absolute` + `left/top = rect.x/y`** 로 감쌈
- 결과: layoutMode='flex'/'grid' 에 **시각 효과 0**. 컨테이너는 시각적 프레임에 그치고 flex/grid 는 작동 안 함.

**S-07 후 상태**:
- 부모 container 의 layoutMode 가 'flex' 또는 'grid' 이면, 자식 wrapper 가 `position: relative` + flow 참여 로 렌더
- 기존 decompose-*.ts 파일은 전부 layoutMode='absolute' (default) → **회귀 없음**
- 새 widget / 새 template 만 flex/grid opt-in

**Wix-parity 임팩트**: 이 fix 가 닫히면 Phase 3 widget library (Wix 스타일 strips / sections / column layouts) 가 올라탈 foundation 이 준비됨.

---

## 성공 기준 (녹색 조건)

- `npx tsc --noEmit` exit 0
- `npm run lint` exit 0 (기존 `<img>` warn 이외 신규 경고 0)
- 기존 모든 페이지 시각 회귀 없음:
  - `/ko`, `/ko/about`, `/ko/services`, `/ko/contact`, `/ko/lawyers`, `/ko/faq`, `/ko/pricing`, `/ko/reviews`, `/ko/privacy`, `/ko/disclaimer`
  - builder-pub-node 개수 S-06 기준 유지 (home 384 / about 193 / services 137 / ...)
- **새 테스트 fixture**: 임시 container 노드에 `layoutMode: 'flex'`, `flexConfig: { direction: 'row', justifyContent: 'center', gap: 24 }` + 2 child text 붙여 published 렌더 시 **flex 로 나란히 배치** (절대좌표 rect.x/y 무시됨을 확인)
- 에디터 canvas 에서도 flex 부모의 자식이 flex flow 로 보임 (editing 기능 유지, 단 rect.x/y 드래그 visual effect 0)

---

## 금지 범위

- `src/lib/builder/canvas/decompose-*.ts` 11 개 기존 파일 **수정 금지** (회귀 위험)
- `src/lib/builder/canvas/seed-home.ts`, `seed-pages.ts` **수정 금지** (SEED_VERSION 변경 금지)
- `types.ts` schema 변경 금지 (parentId 이미 존재, layoutMode 이미 존재)
- `composite/Render.tsx` 의 `legacy-page-*` switch 건드림 금지 (fallback 유지)
- `legacy-*.tsx` 파일 수정 금지
- Phase 2+ 기능 추가 금지
- `git push --force`, `--no-verify`

---

## Codex 발주 프롬프트 (S-07)

````
## 작업: Container auto-layout (flex/grid) 실동작

### 배경
`src/lib/builder/components/container/Element.tsx:25~29` 은 container 의
layoutMode 가 'flex'/'grid' 일 때 `flexToCSS`/`gridToCSS` 를 자기 style
에 적용한다. 하지만 다음 두 렌더러가 **non-top-level child 의 wrapper** 를
`position: absolute` + `left/top = rect.x/y` 로 감싸서 자식이 flex/grid
flow 를 탈출한다:

1. `src/lib/builder/site/public-page.tsx:140~208` `renderPublishedNode`
   - line 157~164: 자식 wrapper 가 absolute
2. `src/components/builder/canvas/CanvasNode.tsx:174` 근처
   - `left: ${node.rect.x}px`, `top: ${node.rect.y}px` 로 자식 위치 찍음

결과: 컨테이너가 "시각적 프레임" 일 뿐, auto-layout 시각 효과 0.

### 목표
렌더러가 **부모 container 의 layoutMode** 를 알아서, 부모가 'flex' 또는
'grid' 이면 자식 wrapper 를 `position: relative` (또는 static) + flow 편입
으로 렌더. 자식의 `rect.x/y` 는 무시하고 `rect.width/height` 만 size hint
로 사용.

### 범위 — 두 파일만
1. `src/lib/builder/site/public-page.tsx`
   - `renderPublishedNode` 시그니처에 `parentLayoutMode?: 'absolute' | 'flex' | 'grid'` 추가
   - top-level composite 재귀 호출은 현행대로 `isTopLevel=true`, parentLayoutMode 없음
   - container 의 children 재귀 호출 시, 해당 container 의 `content.layoutMode` 를 자식들에게 전달
   - 자식 wrapper 스타일:
     - parentLayoutMode 가 'flex' 또는 'grid' → `position: 'relative'`, `left`/`top`/`zIndex` 생략, `width: node.rect.width`, `height: node.rect.height`
     - 그 외 → 현행 동일 (absolute + rect.x/y)
2. `src/components/builder/canvas/CanvasNode.tsx`
   - 동일 로직: 부모 container 의 layoutMode 를 parent-lookup 으로 얻어서 자식 positioning 분기
   - parent-lookup 경로: `nodesById.get(node.parentId)` (이미 store 에 있음) 로 layoutMode 조회
   - 드래그 / 리사이즈 핸들 동작은 그대로 유지 (position 은 flex 가 지배하지만 편집 interaction 은 유지)

### 테스트 fixture (별건 파일, 기존 decompose 건드리지 않음)
신규: `src/lib/builder/canvas/fixtures/flex-test.ts`
  - `createFlexTestDocument(locale)` export
  - 1 container (layoutMode='flex', direction='row', justifyContent='center', gap=24, width 800, height 200)
    + 3 child text 노드 (각 width 200 height 60, rect.x/y 는 의도적으로 엉뚱한 값 넣어서 무시되는지 증명)

그리고 `/api/builder/dev/flex-test` 같은 route 에서 테스트용 published 페이지
한 개 렌더해서 curl 로 확인 가능하게 만듬.
*대안*: route 신규 만들기 귀찮으면 `/[locale]/admin-builder/_dev/flex`
같은 개발용 페이지. 배포 대상 아님.

### 검증
1. `npx tsc --noEmit -p tsconfig.json` exit 0
2. `npm run lint` exit 0 (pre-existing `<img>` warn 만 허용)
3. 기존 페이지 회귀 curl:
   ```
   for p in '' about services contact lawyers faq pricing reviews privacy disclaimer; do
     curl -s -u admin:local-review-2026! "http://localhost:3000/ko/$p" \
       | grep -o 'class="builder-pub-node"' | wc -l
   done
   ```
   숫자 S-06 기준 유지 (home 384, about 193, services 137, contact 123,
   lawyers 123, faq 94, pricing 122, reviews 40, privacy 37, disclaimer 30)
4. 신규 flex-test fixture 렌더 HTML 에서:
   - child wrapper 3개에 `position: relative` (또는 style 에 absolute 없음) 확인
   - 부모 container style 에 `display: flex`, `flex-direction: row`, `justify-content: center`, `gap: 24px` 포함
5. 시각 육안: 3 child 가 row 로 나란히 + 중앙 정렬, rect.x/y 의 엉뚱한 값
   과 무관하게 배치

### 금지
- `src/lib/builder/canvas/decompose-*.ts` (11 파일) 수정 금지
- `seed-home.ts`, `seed-pages.ts` 수정 금지
- `types.ts` schema 변경 금지
- `composite/Render.tsx` `legacy-page-*` switch 제거 금지
- SEED_VERSION 변경 금지
- Phase 2+ 기능
- `git push --force`, `--no-verify`

### 리턴
1. 변경 파일 목록 (2 파일 + 1 fixture + 1 dev route 정도 예상)
2. tsc / lint 결과
3. 기존 9 페이지 + home curl builder-pub-node 카운트 표
4. 신규 flex-test 렌더 HTML 샘플 (child position 스타일 + 부모 flex 스타일 증거)
5. 브라우저 확인 체크리스트
````

---

## 핵심 코드 이정표

| 파일 | 역할 |
|---|---|
| `src/lib/builder/canvas/types.ts:90` | `parentId` schema |
| `src/lib/builder/canvas/layout-modes.ts` | `flexToCSS` / `gridToCSS` / `DEFAULT_FLEX` / `DEFAULT_GRID` |
| `src/lib/builder/components/container/Element.tsx:20~29` | Container 가 자기 layout CSS 적용 (이미 OK) |
| `src/lib/builder/site/public-page.tsx:140~208` | **[S-07 수정 대상]** renderPublishedNode |
| `src/components/builder/canvas/CanvasNode.tsx:174` | **[S-07 수정 대상]** 에디터 canvas child positioning |
| `src/lib/builder/canvas/decompose-*.ts` (11) | 회귀 기준 (건드리지 않음) |

---

## 역할

- **Claude Opus = Manager**: Codex 프롬프트 감독, 결과 검수, 커밋 정리
- **Codex = Worker**: S-07 렌더러 auto-layout 수정 수행
- **User**: 브라우저 시각 대조 (기존 회귀 없음 확인 + 신규 flex-test fixture 시각 확인)

---

## 직전 세션 (S-06) 결과 요약

**S-06 done (2026-04-20)**: 9 서브페이지 decompose propagate.
- about 193 / services 137 / contact 123 / lawyers 123 / faq 94 / pricing 122 / reviews 40 / privacy 37 / disclaimer 30 builder-pub-node
- 자동 검증 올패스 (tsc 0, lint 0, 핵심 legacy className SSR OK, `__next_error__` 0, siteContent 한글 렌더)
- 같은 세션 부수 fix 3: 스키마 `as: 'time'` (`1d42db9`), insights 실사진 복원 (`6ff2aa9`), 서비스 아이콘 SVG 복원 (`2f6bc5d`)
- S-06 본체 commit `7f74641` + docs `ef3f089` + auto-layout 경고 정정 `2da01be`

---

## 한줄 요약

"S-07 = Container auto-layout 실동작. public-page.tsx + CanvasNode.tsx 두 렌더러가 parent layoutMode 전파받아 flex/grid 부모의 자식 wrapper 는 relative flow 로 렌더. decompose 기존 11 파일 건드리지 않음 → 회귀 없음. 끝나면 Phase 3 widget 올라갈 foundation 완성."
