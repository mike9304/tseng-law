# AGENTS.md — 호정국제 사이트 빌더 (Real Wix)

> 이 파일은 Claude Code / Codex / Cursor 등 모든 AI 에이전트가 **세션 시작 시 먼저 읽어야 하는** 최소 오리엔테이션이다.
> 본문 구현 전에 아래 §세션 시작 체크리스트를 반드시 수행한다.

## 목표

호정국제 법률사무소용 **진짜 Wix-class freeform canvas 사이트 빌더**. 픽셀 자유 배치, 임의 페이지, 풀 컴포넌트 라이브러리, 반응형, 템플릿, publish 파이프라인까지 1:1 이상.

## Canonical 계획 (single source of truth)

- **Wix 체크포인트**: `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` — **100% 카피 목표의 구체 측정표 (W01~W30)**. 세션 목표는 이 중 하나를 green 으로 올리는 것.
- **계획서**: `/Users/son7/Desktop/ai memory save 계획/사이트 빌더 계획서.md` — Phase 설계 + Changelog
- **SESSION.md**: `/Users/son7/Projects/tseng-law/SESSION.md` — 현재 세션 일회용 계약서 (매 세션 리셋)
- **인수인계**: `/Users/son7/Desktop/ai memory save 인수인계/사이트 빌더 인수인계.md`
- **역할 교차 리뷰**: `/Users/son7/Desktop/ai memory 수정안/`

세션 흐름: 사용자가 target W__ 지정 → Manager(Claude Opus)가 SESSION.md 작성 → 워커 agent 발주 / Codex 프롬프트 제공 → 통합 → 브라우저 검증 → Wix 체크포인트.md 갱신 → 계획서 § 16 Changelog 한 줄 → SESSION.md 리셋.

## 현재 상태 (2026-04-13 기준)

- **Wix 체크포인트 점수**: 🟢 **0 / 30**. 과거 "완료" 로 기록된 것 대부분은 WIP 재분류. 이유: 브라우저 검증이 없었음.
- **역할 고정**: Claude Opus = Manager / Architect. Codex = 워커 (자기 주도 작업 중단, Manager 가 제공하는 프롬프트만 실행).
- **진입점**: `/admin-builder`로 단일화. `/admin-builder/sandbox`는 redirect.
- **새 페이지 기본 포맷**: `canvas-scene-vnext` (legacy `section-snapshot-v1` 은 home 에만 남아있음).
- **다음 필수 결정**: `section-snapshot-v1` vs `canvas-scene-vnext` 중 하나 완전 폐기. 병렬 유지는 드리프트 원인 1순위.

## 🚨 "껍데기만 완성" 주의 — 진짜 동작하지 않는 것들

- **Container flex/grid**: Inspector UI는 있지만 `parentId` 필드 없어서 자식이 실제로 컨테이너 안에 들어가지 않음. 껍데기.
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

## 다음 큰 블로커 (우선순위)

1. **브라우저 E2E 검증**: 새 페이지 → 편집 → 발행 → /p/slug 에서 렌더 확인 실제로 1회.
2. **parentId / 부모-자식 데이터 모델**: Container flex/grid가 진짜 의미를 가지려면 필요. 큰 schema 변경이므로 별도 Phase로.
3. **Text/Image/Button Inspector 심화**: Wix 1:1 옵션 채우기 (그림자 프리셋, 필터, 타이포 디테일, 링크 타겟 등).
4. **모바일 전용 편집 모드**: viewport 별 오버라이드 저장.
5. **Rate limit 를 Upstash 로 이관**: 현재 in-memory.

## 레포 / 운영 환경

- 레포: `/Users/son7/Projects/tseng-law`
- 프레임워크: Next.js 14 App Router (`(builder)` route group)
- 런타임: Node.js 18+, Vercel 배포
- 주요 의존: Zustand, immer, @dnd-kit, TipTap, @vercel/blob, bcryptjs, zod
