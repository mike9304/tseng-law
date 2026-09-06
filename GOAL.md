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
- [x] **M3 P0/P1 워크아이템 구현** ✅사이클 3(034f76bd·48c48565·65a5c94a·203fd8d9·d8a08734): 각 항목 수용 기준을 로컬 빌드+Playwright 프로브로 통과, 항목별 커밋.
- [x] **M4 P2 워크아이템 구현** ✅사이클 3(WI-12/13/14 포함, 전 항목 구현).
- [x] **M5 회귀 게이트** ✅사이클 3(`npm run qa` exit 0: typecheck·lint·1203파일 9462테스트·security / `next build` 성공 / 수용 프로브 전 항목 통과·콘솔 오류 0·수평 오버플로 0) — 배치 5(716315db) 후 재실행 exit 0(9,462 테스트)·build 성공: `npm run qa`(typecheck+lint+test:unit+security) 그린 + `next build` 성공 + 4언어×주요 페이지 로컬 스크린샷에서 수평 오버플로 0·12px 미만 텍스트 0(수용 기준 항목)·콘솔 오류 0.
- [x] **M6 적대적 시각 검수** ✅사이클 4(데스크톱·모바일 독립 검수 → P1 4종·P2 다수 적발 → 716315db로 수정, 수정 지점 재캡처 확인): 변경 전(라이브)/후(로컬) 타일을 독립 에이전트가 비교해 "개선/퇴행/무변화" 판정, 퇴행 0.
- [x] **M7 인계** ✅사이클 4(ASK-20260907-design-audit-fixes-push-claude 발송, 팀 답신 갱신, 메모리 기록): 커밋 목록·검증 증거·남은 항목을 GOAL.md Progress에 기록, 사용자에게 푸시/배포 여부 ASK 1회.

## Non-goals
- 사진·영상 등 새 자산 제작, 문안(법률 내용) 변경, 빌더 데이터 재발행, 배포/푸시, 타 팀 후보 파일 통합.

## Progress
- [사이클 1 · 2026-09-06 23:2x] 정찰: 라이브 144캡처(4언어×18페이지×2뷰포트, 인트로 해제 후 홈 재캡처)+DOM facts, 타일 646장. 빌더/코드 렌더 경계 확정. 디스크 99% 발견→npm 캐시 정리 15GB 확보, `.next-*` 161개(191GB) 삭제는 브리지 ASK로 사용자 대기. 감사 워크플로 wf_2fd0e27e-18d 기동, 기준 빌드 시작.

- [사이클 2 · 2026-09-07 07:4x] 감사 워크플로 결과 복구: 발견 252→영역 병합 94+전역 92. 세션 한도로 3중 검증 중단 → Fable 직접 검증: keep-all 9곳·:root[data-locale] 10곳·#123b63 5곳·저대비 토큰·messenger-card--email 무규칙 확인; "reveal 빈 영역"·"헤더 위치"는 실제 뷰포트 캡처(`fold-en-contact-*.png`)와 사람속도 스크롤 실측(미표시 reveal 0)으로 캡처 산출 오류로 기각. 감사·계획 문서 커밋 ba1b7600. 배치 1(WI-1/5/9/14 globals.css)·배치 4(WI-11 오프닝) 워커 발주. 수용 프로브 스크립트 준비(scratchpad/probe/acceptance.mjs).

- [사이클 3 · 2026-09-07 08:0x~09:4x] 배치 1(034f76bd) 배치 4(48c48565) 배치 2(65a5c94a) 빌드 블로커 수정(203fd8d9: CSS 모듈 전역 선택자) 배치 3(d8a08734) 순차 완료. QA 1차 실패 1건은 새 워크트리에 gitignore된 `data/audit` 부재(환경) → 생성 후 재실행 exit 0. 수용 프로브(scratchpad/probe/acceptance.mjs) 전 항목 통과. 전후 72페이지 캡처(사람속도 스크롤)→독립 검수 2명(데스크톱·모바일): 개선 확인, 퇴행 P1 4종 적발 — 밝은 배경 H1 섀도 헤일로, `.link-underline` 전역 밑줄이 카드 제목·통계 숫자·화살표 CTA로 누출, 모바일 스크롤톱이 푸터 Sitemap·FAQ 토글 가림, 커진 칼럼 H2에 balance로 JA/ZH 복합어 분리. P2: zh/ko 문의 안내문 버튼 옆 끼임, EN 본문 내 CJK 용어 분리(keep-all 제거 부작용). → 배치 5(R1~R7) 발주·진행 중.

- [사이클 4 · 2026-09-07 09:5x] 배치 5(716315db): R1 밝은 배경 H1 섀도 제거(`.page-header .hero-title{text-shadow:none}`), R2 밑줄 콘텐츠 링크 한정, R3/R7 문의 안내문 `flex:1 1 100%`, R4 EN keep-all 복원·JA/ZH 제목 balance·본문 제목 pretty·모바일 H2 1.35rem, R5 콜아웃 전폭, R6 스크롤톱 푸터 근처 숨김+FAQ 토글 여백. 프로브 전 항목 통과. 최종 `npm run qa` exit 0, build 성공. **GOAL COMPLETE(에이전트 산출 기준)** — push/배포는 사용자 결정 대기.

## Open
- push/배포: ASK-20260907-design-audit-fixes-push-claude 대기(push 시 main 자동 배포 주의, 성장팀 단일 릴리스 순서 옵션).
- 자산/콘텐츠(사용자): About 배너 로고 타사명, 초상 2종, 미디어센터 영상. 통보(성장): privacy AI 초안 문구. 통보(디자인): KO/ZH 빌더 발행본 결함.
- 후속 후보(P2): ko 인터펑트 행두 배치, 문의 페이지 동일 이메일 카드 4개(ContactBlocks 구조), 내비 IA(About/Contact 1차 메뉴·Log in 숨김), 홈 영상 4개 15~17MB·관리자 CSS 공개 번들 분리.
- 디스크: `~/Projects/tseng-law/.next-*` 191GB 삭제 여부(ASK-20260906-disk-full-stale-next-builds-claude).
