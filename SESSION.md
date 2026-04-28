# SESSION.md — 현재 세션 인수인계

## 세션: (다음 세션 대기)
## 마지막 업데이트: 2026-04-28

---

## 🔥 컴퓨터 다시 켜면 바로 할 일

1. **이 파일 읽기** (SESSION.md)
2. **AGENTS.md 읽기**
3. **Wix 체크포인트.md 점수 확인** — 현재 🟢 **4 / 225** (S-05 W02~W12 8건 브라우저 검증 대기)
4. **dev 서버 띄우기**: `cd /Users/son7/Projects/tseng-law && npm run dev`
5. 사용자가 다음 target 지정 → Manager 가 이 파일 덮어쓰기

---

## 직전 세션 (S-07) 결과 요약

**S-07 done (2026-04-28)**: Container auto-layout (flex/grid) 실동작.

- `src/lib/builder/site/public-page.tsx`: `renderPublishedNode` 가 parent layoutMode 전파. flex/grid 부모의 child wrapper → `position: relative` + flow 참여.
- `src/components/builder/canvas/CanvasNode.tsx`: 동일 로직, 에디터 캔버스에서도 자식이 flex flow 따름.
- 신규 fixture: `src/lib/builder/canvas/fixtures/flex-test.ts` + dev 페이지 `src/app/(builder)/[locale]/admin-builder/%5Fdev/flex/page.tsx` (URL: `/ko/admin-builder/_dev/flex`).
- 기존 decompose-*.ts 는 default `layoutMode='absolute'` 유지 → 회귀 0 (10 페이지 카운트 모두 일치).
- 사용자 육안: dashed flex container 안 3 child 가 row/center/gap=24 배치, rect.x/y 의 엉뚱한 값 (720/16/1040, 140/900/-120) 모두 무시되는지 확인.
- Phase 3 widget library 가 올라갈 foundation 완성. AGENTS.md 의 "껍데기 Container flex/grid" 경고 closed.
- 커밋: `76d9981`

---

## 현 시점 가능한 다음 세션 후보

### (a) 사용자 브라우저 검증 묶음 — 점수 4 → 12 가시 범위
- **W02~W12** 8건 (W02, W03, W06, W07, W09, W10, W11, W12) — 코드 감사 OK 마쳤음 (S-05 + 2026-04-28 재감사). 사용자 브라우저 클릭만 남음.
- **S-07 fixture 시각 확인** — `/ko/admin-builder/_dev/flex` 가 의도대로 보이는지.
- 체크리스트: 직전 채팅의 W02~W12 가이드 사용.

### (b) Phase 1 잔여 W 코드 작업 — Codex 발주 후보
- W04 좌측 + Add 패널 카테고리 그리드
- W08 회전 핸들 (코드 일부 있음, UI 검수 필요)
- W14 Pages CRUD (페이지 추가/이름/삭제)
- W18 Navigation editor / W19 Header 글로벌 / W20 Footer 글로벌
- W21 Site Settings / W22 Asset Library / W23 Image crop+filter
- W24 ColorPicker / W25 FontPicker (`BuilderThemeContext` + `ColorPicker.tsx` + `FontPicker.tsx` 이미 있음 — 연결만 검수)
- W26 Version history / W27 SEO panel (이미 SeoPanel.tsx 있음)
- W28 Publish 전 체크 / W29 Ctrl+D 복제 / W30 cross-page 클립보드

### (c) Phase 3 widget library 시작 — S-07 foundation 위에
- Wix 스타일 strips, sections, columns 위젯을 새 파일로 추가
- 기존 decompose-*.ts 건드리지 않고 layoutMode='flex'/'grid' opt-in 패턴

### (d) Phase 2 모바일 스키마 결정 세션
- `/Users/son7/Desktop/ai memory save 계획/Phase 2 모바일 스키마 초안.md` 초안 있음
- `hiddenOnViewports`, viewport-override rect, fontSize override 등 결정 필요. 한 번 잠그면 돌리기 어려움.

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
| 0 | F0 사이트 → 빌더 전환 | — | 🟢 홈 decompose + 서브페이지 decompose (S-06) + container auto-layout (S-07) |
| 1 | 에디터 코어 | W01~W30 | 🟡 4/30 + 8 브라우저 검증 대기 |
| 2~9 | 모바일/위젯/폼/Motion/Design/SEO/Bookings/고도화 | W31~W225 | 🔴 |

---

## 환경 메모

- **포트**: 현재 `npm run dev` 가 3001 로 올라옴 (3000 점유). curl/브라우저 모두 3001 사용.
- **Desktop 폴더 권한**: macOS 가 `/Users/son7/Desktop/...` 접근 차단 중. `Wix 체크포인트.md` / `사이트 빌더 계획서.md` / `사이트 빌더 인수인계.md` 갱신 막힘. 사용자가 System Settings → Privacy & Security → Files & Folders (또는 Full Disk Access) 에서 Claude Code 권한 grant 필요.

---

## 역할

- **Claude Opus = Manager**: Codex 프롬프트 감독, 결과 검수, 커밋 정리
- **Codex = Worker**: Manager 가 제공하는 프롬프트만 실행, 자기 주도 작업 중단
- **User**: target 지정, 브라우저 시각 대조, 녹색 판정

---

## 한줄 요약

"S-07 Container auto-layout 닫음. 다음 후보: (a) 사용자 W02~W12 브라우저 검증 → 점수 4→12, (b) Phase 1 잔여 W Codex 발주, (c) Phase 3 widget library 시작, (d) Phase 2 모바일 스키마 결정."
