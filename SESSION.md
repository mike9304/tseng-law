# SESSION.md — 현재 세션 인수인계

## 세션: (다음 세션 대기)
## 마지막 업데이트: 2026-04-20

---

## 🔥 컴퓨터 다시 켜면 바로 할 일

1. **이 파일 읽기** (SESSION.md)
2. **AGENTS.md 읽기**
3. **Wix 체크포인트.md 점수 확인** — 현재 🟢 **4 / 225** (S-05 브라우저 검증 대기 8 W 있음)
4. **dev 서버 띄우기**: `cd /Users/son7/Projects/tseng-law && npm run dev`
5. 사용자가 다음 target 지정 → Manager 가 이 파일 덮어쓰기

---

## 직전 세션 (S-06) 결과 요약

**S-06 done (구조 검증 기준, 2026-04-20)**: 9 서브페이지 decompose propagate.

- about 193 / services 137 / contact 123 / lawyers 123 / faq 94 / pricing 122 / reviews 40 / privacy 37 / disclaimer 30 builder-pub-node
- 11 decompose-page-*.ts + seed-pages v3 + [locale]/[[...slug]] catch-all
- 자동 검증 올패스 (tsc 0, lint 0 warn-only, legacy className SSR OK, `__next_error__` 0)
- 시각 1:1 패리티는 사용자 브라우저 대조 대기 (tseng-law.com vs /ko/*)
- 커밋: `7f74641` (S-06 + WIP bundle), `6ff2aa9` (칼럼 실사진 복원), `1d42db9` (스키마 `as: 'time'` + safeParse warn guard)

**홈 에디터 이상 동작 1건 해결**: `normalizeCanvasDocument` 가 zod safeParse 실패 시 조용히 5-node sandbox 로 fallback 하던 버그 → decompose-insights 가 `as: 'time'` 을 쓰는데 enum 에 없어서 홈 load 마다 sandbox 로 빠지던 증상. types.ts 에 `'time'` 추가 + warn guard 심음.

**칼럼 이미지 복원**: insights-archive.ts 17 posts 가 placeholder `/images/feature-{1,2,3}.svg` 순환이던 것 → `/public/images/NNN-<slug>/featured-01.*` 실제 featured image 로 매핑.

---

## 다음 세션 후보 (사용자 선택)

### (a) 홈 잔여 회귀 수정 — **Codex 발주 후보 준비됨**
사용자가 본 이슈 3건 중 1건(칼럼 사진)은 해결. 남은 2건:
- **서비스 아이콘이 유니코드 글자** (`serviceIconGlyph` + `⌄`) → 원본 `ServicesBento.tsx` 의 SVG 아이콘으로 복원. Codex 발주 스펙: `decompose-services.ts` 의 아이콘 생성부를 `createHomeImageNode` 기반 SVG 노드로 교체.
- **case-results 제목 `\n` 세로 클리핑** (홈 "한국 학생 헬스장 부상 사건,\n157만 TWD 승소") → text 노드 rect 높이 확장 + whiteSpace 힌트 또는 `\n` split 으로 두 개 text 노드 분리. Codex 발주 가능.

### (b) S-07 = W02~W30 브라우저 검증 세션
S-05 에서 W02, W03, W06, W07, W09, W10, W11, W12 코드 감사 + 소수 패치 완료. 사용자 클릭으로 8 W 가 🟢 으로 승격 가능. 녹색 후 점수 4 → 12.

### (c) Phase 2 모바일 스키마 결정
`/Users/son7/Desktop/ai memory save 계획/Phase 2 모바일 스키마 초안.md` 초안 있음. `hiddenOnViewports`, viewport-override rect, fontSize override 등 결정 필요. 한 번 잠그면 돌리기 어려움.

---

## 목표 & target

사용자가 다음 target 지정 시 이 아래에 기록.

**target**: _대기_

---

## 성공 기준 (녹색 조건)

사용자 target 확정 후 작성.

---

## 금지 범위

- 데이터 파일 직접 수정으로 "시각 일치" 만드는 우회 (siteContent/insights-archive 는 허용, 그 외는 금지)
- tree.ts / seed-home v 변경 (대규모 reseed 유발)
- composite/Render.tsx 의 `legacy-page-*` switch 제거 (호환성 fallback)
- legacy-*.tsx 본문 수정
- Phase 2+ 스키마 확장 (Phase 2 결정 세션 전까지)
- `git push --force`, `--no-verify`

---

## 마스터 플랜 스코프 (SESSION 간 불변)

**에디터 1:1 패리티 + Motion 풀 세트 + Wix Bookings**

체크포인트: W01~W225 (`/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md`)

| Phase | 범위 | W | 상태 |
|---|---|---|---|
| 0 | F0 사이트 → 빌더 전환 | — | 🟢 홈 decompose + 서브페이지 decompose (S-06) |
| 1 | 에디터 코어 | W01~W30 | 🟡 4/30 + 8 브라우저 검증 대기 |
| 2~9 | 모바일/위젯/폼/Motion/Design/SEO/Bookings/고도화 | W31~W225 | 🔴 |

---

## 역할

- **Claude Opus = Manager**: Codex 프롬프트 감독, 결과 검수, 커밋 정리
- **Codex = Worker**: Manager 가 제공하는 프롬프트만 실행, 자기 주도 작업 중단
- **User**: target 지정, 브라우저 시각 대조, 녹색 판정

---

## 한줄 요약

"S-06 구조 녹색 마감, 다음은 (a) 홈 잔여 회귀 Codex 발주 / (b) W02~W30 사용자 검증 / (c) Phase 2 스키마 결정 중 하나."
