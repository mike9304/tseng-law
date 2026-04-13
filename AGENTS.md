# AGENTS.md — 호정국제 사이트 빌더 (Real Wix)

> 이 파일은 Claude Code / Codex / Cursor 등 모든 AI 에이전트가 **세션 시작 시 먼저 읽어야 하는** 최소 오리엔테이션이다.
> 본문 구현 전에 아래 §세션 시작 체크리스트를 반드시 수행한다.

## 목표

호정국제 법률사무소용 **진짜 Wix-class freeform canvas 사이트 빌더**. 픽셀 자유 배치, 임의 페이지, 풀 컴포넌트 라이브러리, 반응형, 템플릿, publish 파이프라인까지 1:1 이상.

## Canonical 계획 (single source of truth)

- **계획서**: `/Users/son7/Desktop/ai memory save 계획/사이트 빌더 계획서.md`
  - §0A.6 현재 상태 snapshot
  - §5 Phase 진행 상태
  - §11 작업 큐 (task board)
  - §16 Changelog (append 전용)
- **인수인계**: `/Users/son7/Desktop/ai memory save 인수인계/사이트 빌더 인수인계.md`
- **역할 교차 리뷰**: `/Users/son7/Desktop/ai memory 수정안/`

모든 작업은 계획서 §11에서 task를 집어서 시작하고, 끝나면 §16에 한 줄, §0A.6 snapshot 갱신.

## 현재 상태 (2026-04-13 기준)

- **Wix parity**: 직전 Codex 공식 평가 50/100 (A09 후). 이후 통합+보안+publish로 체감 55~58 추정, **객관 측정 없음**.
- **진입점**: `/admin-builder`로 단일화 완료. `/admin-builder/sandbox`는 redirect.
- **새 페이지 기본 포맷**: `canvas-scene-vnext` (legacy `section-snapshot-v1` 은 home 에만 남아있음).
- **Publish 경로**: `PublishModal → /api/builder/site/pages/[pageId]/publish → publishPageWithChecks → /[locale]/p/[slug]` 코드상 연결. **브라우저 E2E 검증 0회**.

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

## 세션 시작 체크리스트 (모든 에이전트)

1. 이 파일(`AGENTS.md`) 읽기
2. 계획서 §0A.6 snapshot + §5 Phase 진행 상태 확인
3. `git log --oneline -10` 으로 직전 세션 작업 확인
4. §11 task board 또는 사용자 지시에서 당면 task 픽업
5. 금지사항 재확인: `git push --force`, 계획 없는 schema 변경, 테스트 없이 mass refactor, `--no-verify`

## 세션 종료 체크리스트

1. 변경 파일 typecheck/build 통과 확인
2. 계획서 §16 Changelog 한 줄 append (날짜, 에이전트, task ID, 요약)
3. 계획서 §0A.6 snapshot 필요 시 갱신
4. 큰 결정 있으면 §4 핵심 결정에 추가
5. 커밋 (push는 사용자 확인 받고)

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
