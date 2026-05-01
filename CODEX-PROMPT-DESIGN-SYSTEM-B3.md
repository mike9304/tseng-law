# CODEX 발주 프롬프트 — B3 디자인 시스템 인스펙터 연결

> **발행일**: 2026-04-29
> **분담**: 이 배치는 Codex 담당. 동시에 Claude는 별 트랙으로 B2 (우클릭 메뉴 확장) 작업 중.
> **충돌 방지**: B2가 건드리는 파일은 `CanvasContainer.tsx`, `store.ts` (메뉴 액션 부분), `clipboard.ts`, `group.ts` (신규). B3는 Style/Content 탭 + Theme context + 인스펙터 컴포넌트만 건드리면 충돌 없음.

---

## 1. 목적

호정 사이트 빌더(`/Users/son7/Projects/tseng-law`) 메인 에디터 `/admin-builder` 에 **Wix 수준의 디자인 시스템 UI**를 노드 인스펙터에 연결한다. 코드/데이터는 이미 있으나 노드 편집 화면에서 사용 불가 상태.

현재 상태 (반드시 먼저 읽고 사실 검증):
- `src/components/builder/canvas/SiteSettingsModal.tsx` — 사이트 레벨 theme color 설정 UI 있음 (글로벌 팔레트 정의)
- `src/components/builder/editor/BuilderThemeContext.tsx` — 테마 컨텍스트 존재
- `src/components/builder/canvas/GoogleFontsLoader.tsx` — Google Fonts 로딩 인프라
- `src/lib/builder/canvas/fonts.ts` — Google Fonts URL builder
- `src/lib/builder/canvas/palette.ts` — 팔레트 관련 유틸
- `src/components/builder/editor/StyleTab.tsx` — Style 탭 (background/border/shadow/opacity/radius 편집)
- `src/components/builder/editor/ContentTab.tsx` — Content 탭 (kind별 props)
- `src/lib/builder/components/{text,heading,image,button,container,section}/Inspector.tsx` — 노드 종류별 inspector

**문제**: 글로벌 팔레트가 정의돼도 Style 탭의 색 입력은 raw hex 텍스트 인풋. 폰트도 raw 문자열. 사용자 단위가 Wix 스타일 "테마 텍스트 프리셋" (Title 1/Body 등)을 못 쓰고 px/색을 일일이 만져야 함.

---

## 2. 작업 범위

### 2.1 글로벌 컬러 팔레트 → Style 탭 ColorPicker

**의도 동작**:
- Style 탭의 `background`, `borderColor`, `shadowColor` 입력 필드를 단순 텍스트 인풋에서 **ColorPicker 컴포넌트**로 교체.
- ColorPicker는 다음 두 모드:
  1. **Theme palette 모드** — `BuilderThemeContext`의 5색 팔레트(Primary/Secondary/Accent/Background/Text 또는 사이트가 정의한 5색) 클릭 선택.
  2. **Custom 모드** — HSL/HEX 자유 입력 + 최근 색 히스토리 (localStorage 5개).
- 노드가 팔레트 토큰을 참조하면 (`{ kind: 'token', token: 'primary' }`) 사이트 테마 변경 시 자동 반영. 커스텀 색이면 raw hex 저장.

**스키마 변경** (필요 시):
- `types.ts`의 색 필드 타입을 `string`에서 `string | { token: string }` 유니온으로 확장. 단, **마이그레이션 backward-compat** 필수: 기존 raw hex는 그대로 유효.

**파일**:
- 신규: `src/components/builder/editor/ColorPicker.tsx`
- 수정: `src/components/builder/editor/StyleTab.tsx` (color 인풋 교체), `src/lib/builder/canvas/types.ts` (스키마)
- 참조 only: `BuilderThemeContext.tsx`, `SiteSettingsModal.tsx`, `palette.ts`

### 2.2 Google Fonts → Content/Style 탭 FontPicker

**의도 동작**:
- Text/Heading 노드의 Inspector에서 `fontFamily` 입력을 **FontPicker** 드롭다운으로 교체.
- Picker 카테고리: System (system-ui, sans-serif, serif, monospace) / Site fonts (사이트가 정의한 글로벌 폰트 1~3개) / Google Fonts (인기 30종 + 검색).
- 폰트 미리보기 — 드롭다운 항목에 해당 폰트로 "Aa 안녕하세요 你好 Hello" 렌더.
- 선택 시 `GoogleFontsLoader`가 자동으로 link 태그 추가, autosave/undo/redo 그대로 탐.

**파일**:
- 신규: `src/components/builder/editor/FontPicker.tsx`
- 수정: `src/lib/builder/components/text/Inspector.tsx`, `src/lib/builder/components/heading/Inspector.tsx`, `src/components/builder/canvas/GoogleFontsLoader.tsx` (필요 시 동적 로드 함수 추가)

### 2.3 테마 텍스트 프리셋 (Title 1/2/3, Body, Quote)

**의도 동작**:
- 사이트 설정에 `themeTextPresets: { title1: { fontSize, fontWeight, lineHeight, letterSpacing, color }, title2: ..., body: ..., quote: ... }` 정의 (5종).
- Text/Heading 노드 Inspector 최상단에 "Theme preset" 드롭다운 추가. 선택 시 해당 프리셋 값을 노드에 일괄 적용.
- 프리셋 적용 후에도 개별 필드 수정 가능 (탈락 시 raw 값 저장).
- 사이트 레벨 프리셋 편집 UI는 `SiteSettingsModal`에 "Typography" 탭으로 추가.

**파일**:
- 신규 또는 수정: `src/lib/builder/site/theme.ts` (themeTextPresets 스키마)
- 수정: `src/components/builder/canvas/SiteSettingsModal.tsx` (Typography 탭 추가), `src/lib/builder/components/text/Inspector.tsx`, `src/lib/builder/components/heading/Inspector.tsx`
- 참조 only: `BuilderThemeContext.tsx`

### 2.4 Hover 상태 디자인 (선택, 시간 남으면)

**의도 동작**:
- Style 탭 하단에 "Hover state" 토글. 켜면 hover 전용 backgroundColor/borderColor/transform 편집 가능.
- 캔버스에서 마우스 오버 시 hover 스타일 적용 (preview).

**파일**:
- 수정: `src/components/builder/editor/StyleTab.tsx`, `src/lib/builder/canvas/types.ts`, `src/components/builder/canvas/CanvasNode.tsx` (hover state 적용)

---

## 3. 디자인 톤 (Wix 스타일)

- ColorPicker: 8x8 그리드, 12px 정사각, 코너 라운드 4px, 클릭 시 outline highlight.
- FontPicker: 220px 너비 드롭다운, max-height 320px, scroll 가능, 항목 높이 36px.
- Theme preset 드롭다운: 220px 너비, 항목에 미리보기 텍스트 (해당 프리셋 스타일로 렌더된 "제목 텍스트").
- 인스펙터 입력 필드 간격 12px, 그룹 헤더 간격 16px.

---

## 4. 검증 방법

각 서브태스크 완료 후 모두 통과해야 함:

```bash
cd /Users/son7/Projects/tseng-law
npm run lint
npm run build
npx tsc --noEmit --incremental false
```

**브라우저 검증**:
1. `/ko/admin-builder` 진입 (Basic Auth: admin / local-review-2026!)
2. 텍스트 노드 선택 → Inspector → Content 탭 → Theme preset 드롭다운에 5개 옵션, 선택 시 폰트/사이즈/색 즉시 반영
3. Inspector → Content 탭 → Font family 드롭다운, Google Fonts 검색 시 미리보기 보임, 선택 시 캔버스 폰트 변경
4. Inspector → Style 탭 → Background color → ColorPicker 모달, 팔레트 5색 클릭 시 즉시 반영, Custom 탭에서 hex 입력 OK
5. SiteSettingsModal → Typography 탭 → Title 1 폰트사이즈 36→48 변경 → Title 1 적용된 모든 노드 자동 변경
6. 저장 → 새로고침 → 변경 사항 유지

---

## 5. 작업 규칙 (`AGENTS.md` 준수)

- 데이터 파일 직접 수정 금지 (siteContent/insights-archive 외)
- `tree.ts` / `seed-home v` 변경 금지
- composite/Render.tsx legacy 폴백 제거 금지
- legacy-*.tsx 본문 수정 금지
- Phase 2+ 스키마 확장 금지 — 단, 이 배치는 디자인 토큰만이라 Phase 2와 무관
- `git push --force`, `--no-verify` 금지

---

## 6. 완료 기준 (Definition of Done)

- [ ] ColorPicker 컴포넌트 신설 + Style 탭 통합
- [ ] FontPicker 컴포넌트 신설 + Text/Heading Inspector 통합
- [ ] themeTextPresets 스키마 + Typography 탭 + 노드 적용
- [ ] (선택) Hover state 편집 — 시간 남으면
- [ ] lint/build/tsc 모두 통과
- [ ] 브라우저 검증 6가지 단계 모두 OK
- [ ] `SESSION.md`에 완료 commit hash + 완료 항목 추가
- [ ] `사이트 빌더 인수인계.md`에 § 3.1D 신설 → 디자인 시스템 inspector 연결

---

## 7. 인수인계

작업 완료 시:
1. `commit -m "B3 design system inspector — color picker + font picker + theme presets"` (또는 분할 commit)
2. `SESSION.md` 갱신:
   ```
   ## 직전 세션 (S-08) 결과 요약
   **S-08 done (2026-04-29)**: B3 디자인 시스템 인스펙터 연결.
   - ColorPicker 모달 (테마 팔레트 + 커스텀 hex)
   - FontPicker 드롭다운 (System + Site fonts + Google Fonts 30종 + 검색)
   - 테마 텍스트 프리셋 5종 (Title 1/2/3, Body, Quote)
   - 커밋: <hash>
   ```
3. `Wix 체크포인트.md` 의 `W24 ColorPicker`, `W25 FontPicker` 항목 🟢 처리 (브라우저 검증 후)
4. 다음 세션은 Claude가 **B2 우클릭 메뉴 확장** 진행 중일 가능성 높음 → 충돌 회피 위해 메뉴/Group/Distribute 코드는 Claude 트랙으로 남겨둘 것

---

이 프롬프트 자체는 `/Users/son7/Projects/tseng-law/CODEX-PROMPT-DESIGN-SYSTEM-B3.md` 에 있음. Codex에게 던질 때 파일 경로만 언급하면 됨.
