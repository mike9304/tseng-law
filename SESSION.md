# SESSION.md — 현재 세션 인수인계

## 세션: S-06 (서브페이지 9 개 decompose propagate — Codex 주도)
## 마지막 업데이트: 2026-04-18

---

## 🔥 컴퓨터 다시 켜면 바로 할 일

1. **이 파일 읽기** (SESSION.md)
2. **AGENTS.md 읽기**
3. **Wix 체크포인트.md 점수 확인** — 현재 🟢 **4 / 225** (S-05 브라우저 검증 대기 8 W 있음)
4. **dev 서버 띄우기**: `cd /Users/son7/Projects/tseng-law && npm run dev`
5. **S-06 Codex 프롬프트 (§ 하단) 발주** → 결과 검수 → 브라우저 대조

---

## 목표 & target

**S-06 target**: 홈 decompose 패턴 (S-03/S-04) 을 9 개 서브페이지 (`about / services / contact / lawyers / faq / pricing / reviews / privacy / disclaimer`) 에 적용.

**현재 상태**: 각 서브페이지는 단일 `legacy-page-*` composite 로 렌더 (S-02). 시각 1:1 은 OK, 편집 불가 (opaque 블록).

**S-06 후 상태**: 각 서브페이지가 수십~수백 builder 노드로 decompose. hero 에서 본 것처럼 각 텍스트/이미지/버튼을 Wix 식으로 개별 선택·편집 가능.

---

## 성공 기준 (녹색 조건)

- `npx tsc --noEmit` exit 0
- `/ko/{about,services,contact,lawyers,faq,pricing,reviews,privacy,disclaimer}` 각각 builder-pub-node 개수 **1 → 수십+** 로 증가
- 각 페이지 시각이 기존 `legacy-*.tsx` 렌더와 동일 (회귀 없음)
- 에디터에서 각 서브페이지 선택 → 캔버스에 개별 노드 트리 표시
- 사용자 육안 확인: tseng-law.com 대비 시각 패리티 유지

---

## 금지 범위

- `src/lib/builder/canvas/tree.ts` 건드림
- 홈 seed-home.ts 건드림
- composite/Render.tsx 의 `legacy-page-*` switch case 유지 (fallback 용)
- 원본 legacy-*.tsx 파일 삭제 금지 (메타데이터 + 기능 포기 없이 fallback 용으로 남김)
- Phase 2+ 기능 추가
- `git push --force`, `--no-verify`

---

## Codex 발주 프롬프트 (S-06)

````
## 작업: 9 서브페이지 decompose propagate (홈 패턴 확장)

### 배경
홈은 S-04-C 에서 composite 9 → decomposed 384 노드로 전환 완료. 이제 서브페이지 9 개도 같은 패턴으로 decompose.

### 참조 패턴
- `src/lib/builder/canvas/decompose-{hero,insights,services,attorney,case-results,stats,faq,offices,contact}.ts` — S-03/S-04 파일럿
- `src/lib/builder/canvas/decompose-home-shared.ts` — 공통 helper
- `src/lib/builder/canvas/seed-home.ts` — HomeSectionSpec union 패턴
- `src/lib/builder/canvas/seed-pages.ts` — 현재 서브페이지 시드 (각 페이지 단일 composite). 이 파일을 수정해서 각 페이지를 decomposed 노드 트리로.
- `src/app/[locale]/(legacy)/legacy-page-bodies.tsx` — 원본 React 컴포넌트 (AboutLegacyPageBody 등). 구조 참고만.

### 대상 9 페이지
| 페이지 | 원본 컴포넌트 |
|---|---|
| about | AboutLegacyPageBody (PageHeader + ContactBlocks + AttorneyProfileSection + FirmIntroductionSection) |
| services | ServicesLegacyPageBody |
| contact | ContactLegacyPageBody |
| lawyers | LawyersLegacyPageBody |
| faq | FaqLegacyPageBody (PageHeader + FAQAccordion) |
| pricing | PricingLegacyPageBody |
| reviews | ReviewsLegacyPageBody |
| privacy | PrivacyLegacyPageBody |
| disclaimer | DisclaimerLegacyPageBody |

### 각 페이지 작업 절차
1. `src/lib/builder/canvas/decompose-page-{name}.ts` 파일 신규:
   - export `create{Name}PageDecomposedNodes(y, locale, zBase): BuilderCanvasNode[]`
   - export `const {NAME}_PAGE_ROOT_HEIGHT: number`
   - 원본 Body 컴포넌트 JSX 구조 그대로 복제 — 사용된 React 컴포넌트들 (PageHeader, ContactBlocks, AttorneyProfileSection 등) 의 JSX 를 열어서 className/as/id/copy 를 노드로 전개
   - parentId 트리, rect local-to-parent, className pass-through
2. `src/lib/builder/canvas/seed-pages.ts` 수정:
   - 각 서브페이지 시드 함수가 단일 `legacy-page-*` composite 대신 decomposed 노드 배열을 return
   - `updatedBy` = `'site-page-seed-v3'` (v2 → v3) 으로 reseed 자동 트리거
3. composite/Render.tsx 의 `legacy-page-*` switch case 는 **유지** (호환성 — 나중에 다시 composite 로 fallback 가능하게)

### 동적 리스트 처리
- LawyersLegacyPageBody 의 team 멤버 리스트: 각 멤버를 독립 노드 트리로
- ServicesLegacyPageBody 의 service 상세 (상위 카드): ServicesBento 처럼 각 서비스당 노드 트리
- FaqLegacyPageBody 의 12 question: 홈 faq decompose (`decompose-faq.ts`) 재사용 또는 page 스코프 버전 분리
- 등등 — 원본에서 `.map()` 하는 곳은 각 item 을 개별 노드로

### 기능 포기 허용 (인터랙션 복잡한 것)
- FAQ accordion 토글
- ContactForm 실제 제출 기능 (form 은 정적 구조만, 액션 포기)
- AttorneyMediaHub 의 미디어 재생

### 검증
1. `npx tsc --noEmit -p tsconfig.json` exit 0
2. 각 서브페이지 `/ko/admin-builder?reseed=1` force reseed 후:
   ```
   for p in about services contact lawyers faq pricing reviews privacy disclaimer; do
     count=$(curl -s -u admin:local-review-2026! "http://localhost:3000/ko/$p" | grep -c 'class="builder-pub-node"')
     echo "$p: $count"
   done
   ```
   각 페이지 1 → 수십+ 로 증가해야 함
3. 주요 CSS class SSR 확인: `class="page-header"`, `class="firm-intro"`, `class="contact-blocks"`, `class="faq-item"` 등
4. typecheck / dev log 에러 없음

### 금지
- `tree.ts` 건드림
- `seed-home.ts` 수정
- 홈 decompose-*.ts 수정
- composite/Render.tsx 의 `legacy-page-*` switch 제거
- `legacy-*.tsx` 파일 내용 수정 (메타데이터 유지)
- Phase 2+ 기능
- `git push --force`, `--no-verify`

### 리턴
1. 페이지별 결과 표:
   ```
   | 페이지 | decompose 파일 | 노드 개수 | 기능 포기 |
   | about | decompose-page-about.ts | 42 | — |
   | services | decompose-page-services.ts | 180 | 카드 toggle |
   ...
   ```
2. 변경/신규 파일 목록
3. typecheck / curl 검증 숫자
4. 브라우저 확인 체크리스트
````

---

## 마스터 플랜 스코프 (SESSION 간 불변)

**에디터 1:1 패리티 + Motion 풀 세트 + Wix Bookings**

체크포인트: W01~W225 (`/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md`)

| Phase | 범위 | W | 상태 |
|---|---|---|---|
| 0 | F0 사이트 → 빌더 전환 | — | 🟢 홈 decompose + 서브페이지 composite |
| 1 | 에디터 코어 | W01~W30 | 🟡 4/30 + 8 브라우저 검증 대기 |
| 2~9 | 모바일/위젯/폼/Motion/Design/SEO/Bookings/고도화 | W31~W225 | 🔴 |

---

## S-05 브라우저 검증 대기 (사용자 확인 시 녹색 승격)

W02, W03, W06, W07, W09, W10, W11, W12 — Codex 코드 감사 + 소수 패치 완료. 사용자 브라우저 테스트 가이드는 지난 응답 참조. 진행되면 녹색 4 → 12 로.

---

## 핵심 코드 이정표

| 파일 | 역할 |
|---|---|
| `src/lib/builder/canvas/decompose-*.ts` (홈 9 섹션) | 홈 decompose builders |
| `src/lib/builder/canvas/decompose-home-shared.ts` | 공통 helper |
| `src/lib/builder/canvas/seed-home.ts` | 홈 seed (v6) |
| `src/lib/builder/canvas/seed-pages.ts` | 서브페이지 seed (**S-06 에서 v3 로 업그레이드 대상**) |
| `src/lib/builder/canvas/decompose-page-*.ts` | **S-06 에서 Codex 가 생성할 파일들** |
| `src/app/[locale]/(legacy)/legacy-page-bodies.tsx` | 서브페이지 Body 컴포넌트 (참고용) |
| `src/lib/builder/components/composite/Render.tsx` | `legacy-page-*` switch case (호환성 fallback, 유지) |

---

## 역할

- **Claude Opus = Manager**: Codex 프롬프트 감독, 결과 검수, 커밋 정리
- **Codex = Worker**: S-06 decompose 작업 수행
- **User**: 브라우저 시각 대조, 녹색 판정

---

## 한줄 요약

"S-06 = 서브페이지 9 개 decompose propagate. 끝나면 사이트 모든 페이지 Wix 식 개별 요소 편집 가능."
