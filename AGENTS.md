# AGENTS.md — 호정국제 사이트 빌더 (Real Wix)

> 이 파일은 Claude Code / Codex / Cursor 등 모든 AI 에이전트가 **세션 시작 시 먼저 읽어야 하는** 최소 오리엔테이션이다.
> 본문 구현 전에 아래 §세션 시작 체크리스트를 반드시 수행한다.

## 목표

호정국제 법률사무소용 **진짜 Wix-class 사이트 빌더**.
스코프: **에디터 1:1 패리티 + Motion 풀 세트 + Wix Bookings (상담 예약)**.

- 에디터 1:1: 픽셀 자유 배치, 임의 페이지, 풀 컴포넌트 라이브러리 (~70 위젯), 반응형, 템플릿, publish 파이프라인까지
- Motion: Entrance/Exit + Scroll effects + Hover + Loop + Timeline 편집기
- Bookings: 상담 예약 전체 플로우 (Service, Staff, availability, 예약 위젯, 캘린더 싱크, 이메일/Zoom 링크)

진행 측정: `Wix 체크포인트.md` W01~W225 스코어카드. 90% (203/225) = Wix parity 달성.

## Canonical 계획 (single source of truth)

- **Wix 체크포인트**: `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` — **100% 카피 목표의 구체 측정표 (W01~W30)**. 세션 목표는 이 중 하나를 green 으로 올리는 것.
- **계획서**: `/Users/son7/Desktop/ai memory save 계획/사이트 빌더 계획서.md` — Phase 설계 + Changelog
- **SESSION.md**: `/Users/son7/Projects/tseng-law/SESSION.md` — 현재 세션 일회용 계약서 (매 세션 리셋)
- **인수인계**: `/Users/son7/Desktop/ai memory save 인수인계/사이트 빌더 인수인계.md`
- **역할 교차 리뷰**: `/Users/son7/Desktop/ai memory 수정안/`

세션 흐름: 사용자가 target W__ 지정 → Manager(Claude Opus)가 SESSION.md 작성 → 워커 agent 발주 / Codex 프롬프트 제공 → 통합 → 브라우저 검증 → Wix 체크포인트.md 갱신 → 계획서 § 16 Changelog 한 줄 → SESSION.md 리셋.

## 현재 상태 (2026-04-20 기준)

- **Wix 체크포인트 점수**: 🟢 **4 / 225** (W01, W05, W13, W16). S-05 W02~W12 8건 브라우저 검증 대기 (녹색 시 12/225). 스코어카드 W01~W225.
- **F0 (메인 사이트 → 빌더)**: 코드 완료 + local 좌표 포지셔닝 버그 fix 완료. `/ko` 384 builder-pub-node 로 홈 decompose (home-seed-v6). `/ko/{about,services,contact,lawyers,faq,pricing,reviews,privacy,disclaimer}` 각각 decompose-page-*.ts 로 30~193 builder-pub-node 렌더 (S-06).
- **S-06 (2026-04-20)**: 9 서브페이지 decompose propagate 완료. 각 페이지가 `legacy-page-*` 단일 composite → 수십~수백 개별 편집 가능 builder 노드 트리로 전환. 라우트 9 per-page → `[locale]/[[...slug]]` catch-all 로 통합. 시각 1:1 패리티는 사용자 브라우저 대조 대기.
- **슬롯 편집 MVP (S-02, 2026-04-18)**: `BuilderSurfaceProvider` Context override + `SurfaceText` wrapper, Inspector 의 composite surface editor (textarea), 캔버스 인라인 contentEditable (Enter/blur commit, Esc revert). 현재 9 composite 의 섹션 헤더 (label/title/description/상단 버튼) 만 SurfaceText 적용. 동적 리스트 (service cards items, FAQ 문항, insights posts, offices, stats, attorney details) 는 미적용.
- **SEED_VERSION**: home `home-seed-v6`, 서브페이지 `site-page-seed-v3`. admin-builder `?reseed=1` 강제 force flag 지원.
- **스키마 safe parse**: `normalizeCanvasDocument` (types.ts) 가 safeParse 실패 시 console.warn 로 첫 3 issue 보고 후 5-node sandbox fallback. 침묵 fallback 으로 에디터가 실제 홈 대신 플레이스홀더 보여주는 버그 반복 방지.
- **역할 고정**: Claude Opus = Manager / Architect. Codex = 워커 (자기 주도 작업 중단, Manager 가 제공하는 프롬프트만 실행).
- **진입점**: `/admin-builder`로 단일화. `/admin-builder/sandbox`는 redirect.
- **새 페이지 기본 포맷**: `canvas-scene-vnext`. 좌표 시스템: `node.rect` 는 **local-to-parent**. 절대 좌표 필요 시 `resolveCanvasNodeAbsoluteRect(node, nodesById)` 경유.
- **legacy fallback**: `(legacy)` route group 에 10 페이지. 빌더 published 가 있으면 빌더 렌더, 없으면 legacy 렌더. 현재 모든 서브페이지는 decompose seed 를 publish 해서 빌더 경로로 감.

## 🚨 "껍데기만 완성" 주의 — 진짜 동작하지 않는 것들

- **Container flex/grid**: `parentId` 는 schema 에 있고 (`types.ts:90`) Container Element 가 `flexToCSS`/`gridToCSS` 를 자기 style 에 적용함. 하지만 `public-page.tsx:157` 의 `renderPublishedNode` 가 non-top-level child wrapper 를 `position: absolute` + `left/top = rect.x/y` 로 감싸서 자식이 flex/grid flow 를 탈출. 결과: layoutMode='flex'/'grid' 가 시각 효과 0. 컨테이너는 **"시각적 프레임"** 일 뿐 auto-layout 실동작 안 함. Phase 3 widget library 전에 해결 필요 (Codex 후보: public-page.tsx 렌더러가 parent layoutMode 를 전파받아 non-absolute 부모의 자식은 relative flow 로 렌더).
- **모바일 반응형**: CSS `@media` 덮어쓰기 훅. 진짜 모바일 에디터 아님.
- **Google Fonts 로더**: 실제로 페이지에 주입되지만 폰트 전체 목록 검증 미진.

이들을 "Wix 패리티 완료" 로 세면 드리프트. 점수에 포함시키지 말 것.

## 아키텍처 lock-in (건드리지 말 것)

- 데이터 모델: `BuilderCanvasNode` discriminated union (types.ts). Legacy `BuilderPageDocument` + `section-snapshot-v1` 은 home 전용 호환성.
- State: `useBuilderCanvasStore` (Zustand + immer).
- Storage: Vercel Blob + file backend fallback (`persistence.ts`).
- Auth: 모든 mutation API는 `guardMutation()` (auth + CSRF + rate-limit) 통과 필수.
- Editor 진입점: `/admin-builder` 하나. 새 entry 만들지 말 것.

## 세션 시작 체크리스트 (Manager 전용 — 다른 에이전트는 SESSION.md 만 봄)

1. 이 파일(`AGENTS.md`) 읽기
2. `Wix 체크포인트.md` 현재 점수 확인
3. `git log --oneline -10` 으로 직전 세션 작업 확인
4. 사용자가 제시한 target W__ 확인 (한 줄 응답으로 받음)
5. `SESSION.md` 작성 — 목표, 성공 기준, 금지 범위, 실행 계획, (필요시) Codex 프롬프트
6. 사용자 승인 → 실행 시작
7. 금지사항 재확인: `git push --force`, SESSION.md 범위 밖 작업, 브라우저 검증 없이 "done" 선언, `--no-verify`

## 워커 에이전트 발주 원칙

- Manager 는 **task 를 스펙으로 쪼개서** 워커에게 발주. "기능 만들어" 금지.
- 스펙 포함: input, output, 파일 경로, 패턴 출처, 금지 범위
- 워커 반환 후 Manager 가 grep/read/typecheck 로 검수 → merge 또는 reject
- Codex 는 사용자 터미널을 통해 실행되므로, Manager 가 **그대로 복붙 가능한 프롬프트 블록** 을 사용자에게 제공해야 함

## 세션 종료 체크리스트

1. 변경 파일 typecheck/lint 통과 확인
2. **브라우저 검증 완료** — 사용자 클릭으로 target 플로우 완주 확인. 검증 없으면 Green 카운트 안 됨.
3. `Wix 체크포인트.md` 상태 열 + 마지막 검증 열 갱신
4. 계획서 §16 Changelog 한 줄 append (날짜, 에이전트, W__ 번호, 요약, 검증 여부)
5. AGENTS.md "현재 상태" 갱신
6. 큰 결정 있으면 계획서 §4 에 추가
7. SESSION.md 를 템플릿으로 리셋
8. 커밋 (push 는 사용자 확인 받고)

## Phase 로드맵 (마스터 플랜)

| Phase | 범위 | 체크포인트 | 현재 |
|---|---|---|---|
| **0** | F0 메인 사이트 → 빌더 전환 | — (전처리) | 🟡 코드 완, 브라우저 검증 대기 |
| **1** | 에디터 코어 (드래그/편집/publish 등) | W01~W30 | 🟡 3 Green, 나머지 검증 필요 |
| **2** | 모바일 & 반응형 | W31~W45 | 🔴 미시작 |
| **3** | 위젯 라이브러리 (~70 위젯, 10 카테고리) | W46~W135 | 🔴 미시작 |
| **4** | 폼 빌더 | W136~W150 | 🔴 미시작 |
| **5** | Motion (entrance/scroll/hover/loop/timeline) | W151~W175 | 🔴 미시작 |
| **6** | 디자인 시스템 (color/font sets, themes) | W176~W185 | 🔴 미시작 |
| **7** | SEO + Publish maturity | W186~W195 | 🔴 부분 존재 |
| **8** | **Wix Bookings** (상담 예약 전체) | W196~W215 | 🔴 미시작 |
| **9** | 에디터 고도화 (rulers/layers/단축키/align) | W216~W225 | 🔴 미시작 |

우선순위 가이드: Phase 1 완주 → Phase 2 (반응형 먼저 맞춰야 위젯 재작업 최소) → Phase 3 위젯 → Phase 4 Forms → Phase 8 Bookings (Forms 인프라 의존). Phase 5 Motion 은 cross-cutting 이라 어느 시점이든 병렬 가능.

## 다음 큰 블로커 (우선순위)

1. **F0 브라우저 검증**: `/ko`, `/ko/about` 등 실제 렌더 확인 + `/admin-builder` 드래그/스냅/그룹 정상 동작 확인 (포지셔닝 fix 수반 refactor 때문)
2. **W02~W30 검증 세션**: 코드는 다 있음. 사용자 클릭으로 30/30 Green 확정 후에 Phase 2 로 이동
3. **Phase 2 모바일 스키마 결정**: `hiddenOnViewports`, viewport-override rect, fontSize 등. 한 번 결정하면 돌리기 어려움
4. **Rate limit 를 Upstash 로 이관**: 현재 in-memory (Phase 7 편입)

## 레포 / 운영 환경

- 레포: `/Users/son7/Projects/tseng-law`
- 프레임워크: Next.js 14 App Router (`(builder)` route group)
- 런타임: Node.js 18+, Vercel 배포
- 주요 의존: Zustand, immer, @dnd-kit, TipTap, @vercel/blob, bcryptjs, zod
