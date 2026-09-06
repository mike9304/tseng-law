# GOAL — tseng-law.com 디자인 결함 진단·수정 (Fable 5.1, 세션 son7-df)

Updated: 2026-09-06 KST · Owner: Fable 5.1 (son7-df) · 워크트리: `~/Projects/tseng-law-design-audit-20260906` · 브랜치: `design/fable-audit-20260906` (base origin/main 3186ca60 = 라이브)
사용자 지시(2026-09-06): "디자인적으로 tseng-law.com에 부족한 부분을 살펴보고 계획세워서 골기능 켜서 직접 수정해"

## 전제·경계
- 라이브 = origin/main 3186ca60 (Vercel 성공 2026-09-06 21:23 KST). 세 팀(성장 Codex·디자인 Codex V10·기능 Codex) 조정판 `~/cursor-workorders/TSENG_THREE_TEAM_COORDINATION_20260906.md` 존재 → 이 레인은 **별도 워크트리·별도 브랜치**에서만 쓰고, 타 워크트리(design-integrated 등)·공용판은 읽기만 한다.
- KO/ZH 상위 페이지는 빌더 발행본이지만 EN/JA·상세 페이지와 **같은 섹션 컴포넌트·globals.css**를 렌더 → 코드 레벨 수정이 4개 언어에 전파된다. 빌더 데이터 재발행은 이 goal 범위 밖(필요 시 Open에 기록).
- 배포·push 금지(브랜치 로컬 커밋까지). 최종 푸시/배포는 사용자 결정 1회 확인(브리지 ASK).
- 코딩 실행은 워크플로 서브에이전트(하청), Fable은 진단·설계·검수·커밋.

## Done criteria (검증 가능한 것만)
- [x] **M1 감사 정본** ✅사이클 2(ba1b7600): 15관점 감사 → 병합 → 3중 반박검증 → 계획 산출물이 `docs/design/DESIGN-AUDIT-2026-09-06.md`(발견·증거·검증 결과)로 커밋됨. 증거 = 라이브 스크린샷 타일 경로 + facts.json 수치.
- [x] **M2 실행 계획** ✅사이클 2(ba1b7600, 팀 답신 ~/cursor-workorders/TSENG_TEAM_REPLY_DESIGN-AUDIT-FABLE-DF_20260906.md): `docs/design/DESIGN-FIX-PLAN-2026-09-06.md` — 워크아이템별 파일·변경·수용 기준(스크린샷/DOM 프로브/테스트로 확인 가능)·배치 순서. 세 팀 조정판에 레인 답신 파일 작성.
- [ ] **M3 P0/P1 워크아이템 구현**: 각 항목 수용 기준을 로컬 빌드+Playwright 프로브로 통과, 항목별 커밋.
- [ ] **M4 P2 워크아이템 구현**(시간 허용 범위).
- [ ] **M5 회귀 게이트**: `npm run qa`(typecheck+lint+test:unit+security) 그린 + `next build` 성공 + 4언어×주요 페이지 로컬 스크린샷에서 수평 오버플로 0·12px 미만 텍스트 0(수용 기준 항목)·콘솔 오류 0.
- [ ] **M6 적대적 시각 검수**: 변경 전(라이브)/후(로컬) 타일을 독립 에이전트가 비교해 "개선/퇴행/무변화" 판정, 퇴행 0.
- [ ] **M7 인계**: 커밋 목록·검증 증거·남은 항목을 GOAL.md Progress에 기록, 사용자에게 푸시/배포 여부 ASK 1회.

## Non-goals
- 사진·영상 등 새 자산 제작, 문안(법률 내용) 변경, 빌더 데이터 재발행, 배포/푸시, 타 팀 후보 파일 통합.

## Progress
- [사이클 1 · 2026-09-06 23:2x] 정찰: 라이브 144캡처(4언어×18페이지×2뷰포트, 인트로 해제 후 홈 재캡처)+DOM facts, 타일 646장. 빌더/코드 렌더 경계 확정. 디스크 99% 발견→npm 캐시 정리 15GB 확보, `.next-*` 161개(191GB) 삭제는 브리지 ASK로 사용자 대기. 감사 워크플로 wf_2fd0e27e-18d 기동, 기준 빌드 시작.

- [사이클 2 · 2026-09-07 07:4x] 감사 워크플로 결과 복구: 발견 252→영역 병합 94+전역 92. 세션 한도로 3중 검증 중단 → Fable 직접 검증: keep-all 9곳·:root[data-locale] 10곳·#123b63 5곳·저대비 토큰·messenger-card--email 무규칙 확인; "reveal 빈 영역"·"헤더 위치"는 실제 뷰포트 캡처(`fold-en-contact-*.png`)와 사람속도 스크롤 실측(미표시 reveal 0)으로 캡처 산출 오류로 기각. 감사·계획 문서 커밋 ba1b7600. 배치 1(WI-1/5/9/14 globals.css)·배치 4(WI-11 오프닝) 워커 발주. 수용 프로브 스크립트 준비(scratchpad/probe/acceptance.mjs).

## Open
- 디스크: `~/Projects/tseng-law/.next-*` 191GB 삭제 여부(ASK-20260906-disk-full-stale-next-builds-claude).
