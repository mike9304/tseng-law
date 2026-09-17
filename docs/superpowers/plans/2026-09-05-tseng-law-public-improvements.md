# tseng-law.com 공개 사이트 개선 Implementation Plan

> **For agentic workers:** 구현 시 `superpowers:subagent-driven-development` 또는 `superpowers:executing-plans` 절차를 적용한다. 사용자 지정 구현 모델은 **Grok 4.6**, 필요한 설계·문구 교차 검토는 **Fable 5.1**, 최종 지시·검수·판정은 **Codex**다. 토론·계획 단계를 마쳤으며 실행 상태는 [실행 기록](../../audit/site-debate-20260905/EXECUTION.md)에 남긴다.

**Goal:** 현재 공개 사이트의 읽기 어려운 검색 글자, 상담 안내 불일치, 문의 동선의 불편을 해결하고 실제 화면으로 검증한다.

**Architecture:** 기존 Next.js 사이트와 빌더의 공개 렌더 경로를 유지한다. 공통 상담 문구·이메일 템플릿을 기준으로 legacy 컴포넌트와 builder seed의 중복을 맞추고, 사용자가 저장한 문서는 자동 reseed하지 않는다. 깨끗한 작업 폴더에서 제한된 수정만 묶어 검증한다.

**Tech Stack:** 현재 공유 소스 package.json 기준 Next.js 15.5.21 / React 18 / TypeScript / Vitest / Playwright / axe. 실제 배포 SHA·의존성은 Task 0에서 확인한다.

**Spec:** [3 AI 토론·실측 보고서](../../audit/site-debate-20260905/REPORT.md)

## 공통 제약

- 공개 사이트 개선이 범위다. Wix 전체 완성, 예약 시스템 신설, AI 상담 공개 활성화는 별도 작업이다.
- 2026-09-05 조사 시 공유 폴더 `/Users/son7/Projects/tseng-law`는 HEAD `547cb673`, 초기 dirty 941개였다. 현재 값을 다시 확인하고 타 레인 변경을 채택·되돌리지 않는다.
- `3e7bc021` 검증 폴더는 스냅샷 커밋, feature 폴더 `0a48275a`는 별도 브랜치다. 어느 것도 현재 운영 배포 소스로 추정하지 않는다.
- 구현은 단일 파일 작성자 원칙. Grok에게 수정 허용 파일을 명시하고 Fable/Codex는 읽기 검수한다.
- 공개 메일 `wei@hoveringlaw.com.tw`, 가격, 변호사 자격, 운영 채널을 임의 변경하지 않는다. 이메일 접수와 민감정보 안내를 유지한다.
- 언어 목록의 역할별 차이는 허용하되 접수 가능/직접 상담 가능을 구분한다. 모든 페이지에 같은 단어를 기계적으로 강제하지 않는다.
- Grok 비공개 소스 읽기는 자동 승인 검토에서 외부 전송 우려로 거절됐다. 이번 토론은 공개 자료만으로 해결했다. **구현에서 소스 접근이 필요하면 정확한 파일 범위의 승인 여부를 먼저 해결한다. 이번 공개자료 전용 실행 승인을 소스 전송 승인으로 확대하지 않는다.**
- 푸시·배포는 완성된 diff·검증 결과를 제시한 후 적용 권한을 확인한다. 기존 `AGENTS.md`도 push 사용자 확인을 요구한다.
- 테스트는 임시 데이터 루트를 쓰는 프로젝트 QA 하네스에서 실행한다. 실제 메일 전송, 예약 생성, 운영 Blob/런타임 데이터 변경은 하지 않는다.

## 선택한 접근

| 접근 | 장단점 | 결정 |
|---|---|---|
| 현재 디자인 유지 + 정확성·문의 경로 보완 | 확인된 문제부터 작게 수정 가능, 브랜드 보존 | 채택 |
| 인트로 삭제와 전면 재디자인 | 변경 면적 큼, 현재 진입 동작은 정상, 효과 근거 없음 | 이번 범위에서 채택하지 않음 |
| 새 예약·메신저·AI 문의 시스템 | 접수 선택지는 늘지만 운영·수신·실패경로 검증 필요 | 현 접점 개선 후 별도 평가 |

## Task 0 — 배포 기준과 파일 소유권 확정 (Codex)

**대상:** Git 상태·배포 메타데이터·현재 검증 폴더. 제품 수정 없음.

- [x] 공유 폴더의 `git status --short`, `git log -5 --oneline`, `git worktree list`를 다시 기록한다.
- [x] 연결된 Vercel 프로젝트의 읽기 전용 배포 메타데이터로 운영 배포의 소스 SHA/브랜치를 확인한다. 확인되지 않으면 후보는 후보로 표시하고 운영 기준이라고 부르지 않는다.
- [x] 그 기준에서 독립 worktree를 만든다. 기존 WIP 전체 복사나 스냅샷 전체 채택은 하지 않는다.
- [x] 이번 수정 파일의 기존 diff와 작성자를 확인한다. 겹치는 파일은 구현 지시에서 제외하거나 소유권을 조정한다.
- [x] Grok 구현에 필요한 소스 접근 범위와 실행 권한을 구체화한다. 승인 검토의 소스 전송 제한을 해결한 뒤 워크오더를 보낸다.

**완료 증거:** baseline SHA, 경로, 소유 파일 목록, 공유 트리 보존 기록. 이것은 사이트 수정 완료가 아니다.

## Task 1 — 검색 결과 명도 대비 (Grok 구현 / Codex 검수)

**Modify:** `src/app/globals.css:3618`의 검색 보조글자 스타일. `src/app/[locale]/search/page.tsx:142`는 렌더 구조 확인용.

**문제:** `--text-caption: #86968b`가 흰 배경의 13.12px 보조글자에 적용되어 3.11:1. PC·모바일 검색에서 13개 요소 재현.

- [x] 같은 검색어 `법인`으로 390/1440px 기준 화면과 axe 결과를 보존한다.
- [x] `.search-results-section .list-meta`, `.search-results-total`, 관련 검색 메타 글자에 기존 `--text-secondary` 등 4.5:1 이상인 색을 선택한다. 공통 토큰을 바꿀 때는 사용 표면 목록을 확인하고 어두운 배경까지 검사한다. 검색에만 필요한 변경이면 선택자를 검색 영역으로 한정한다.
- [x] 적용 후 실제 computed style·배경으로 대비를 계산하고 같은 검색을 재실행한다. CSS 문자열만 확인하는 테스트를 새로 만들지 않는다.

**수락:** KO/EN/JA/ZH-HANT 검색 결과가 보이고 해당 작은 글자가 대비 ≥4.5:1. PC·모바일 기존 13개 위반 제거. 다른 색상·페이지 레이아웃 회귀 없음.

## Task 2 — 상담 언어와 CTA의 실제 의미 정합 (Grok / 필요시 Fable 문구 검토)

**Modify 후보:**

- `src/lib/consultation/public-contact.ts:12` — 4개 언어별 메일 제목·본문.
- `src/components/ConsultationGuideSection.tsx:1` — 접수 언어·상담 안내.
- `src/components/PricingCards.tsx:83` — 실제 `mailto:` 동작에 맞는 CTA.
- `src/lib/builder/canvas/decompose-page-pricing.ts:78` 및 `decompose-page-shared.ts:1624` — 동일 안내의 빌더 seed 경로.
- `src/lib/consultation/__tests__/public-contact.test.ts`, `verified-contact-copy.test.ts` — 기존 의미 검증 확장.

**Consumes:** 확인된 공개 상담 사실. **Produces:** 각 locale의 메일 템플릿과 CTA가 같은 행동·언어를 설명하는 상태.

- [x] KO/EN/ZH-HANT 템플릿에서 빠진 일본어를 현재 공개 일본어 상담 지원과 대조한다. 직접 상담/접수 언어의 구분이 필요한 문장은 기존 확인 자료로 먼저 해결하고, 불명확한 영어 운영 범위는 임의 확정하지 않는다.
- [x] 메일의 희망 언어 목록이 언어판에 따라 누락되지 않도록 수정한다. 가격·프로필의 역할별 설명과 충돌하지 않게 한다.
- [x] KO 가격 CTA는 `이메일로 상담 일정 문의`, EN은 `Email to arrange a consultation`, JA는 `メールで相談日程を問い合わせる`, ZH-HANT는 `以電子郵件洽詢諮詢時間`을 기본안으로 한다. Fable이 자연스러운 문구를 검토한다.
- [x] 메일 작성이 곧 예약 확정이라는 오해를 줄이는 한 문장을 인접 배치한다. 즉시 확정·회신시간을 약속하지 않는다.
- [x] 기존 mailto 생성·인코딩·민감정보 안내 테스트를 실행한다. 빌더 seed와 legacy 렌더를 둘 다 확인한다.

**수락:** 4개 locale의 href 디코딩 결과에 일본어 요청이 누락되지 않는다. 버튼은 이메일 작성임이 보이며 수신 주소·프리필·주의문이 유지된다. 이미 저장된 published 문서의 옛 문구가 남는지 검증하고, 필요하면 정확한 필드만 수정하는 별도 변경안을 만든다.

## Task 3 — 연락처 첫 화면에 접수 수단 배치 (Grok / Fable 구성 검토)

**Modify 후보:** `src/components/ContactBlocks.tsx`, `src/app/[locale]/(legacy)/legacy-page-bodies.tsx:83`, `src/components/builder/BuilderContactSectionSurface.tsx`, `src/lib/builder/canvas/decompose-page-contact.ts:190`, `decompose-page-shared.ts:1431`. 등록 문서 구조에 영향이 있으면 해당 contact registry/seed를 먼저 매핑해 워크오더 허용 목록에 추가한다.

**목표 구조:** 페이지 제목 → 짧은 공식 이메일 접수 블록(이메일 작성·주소 복사·최소정보 안내) → 상담 준비/진행 안내 → 문의 종류·사무소 정보.

- [x] 사용 중인 공개 문서가 legacy, section 문서, canvas published 중 어느 경로인지 확인한다.
- [x] 기존 이메일·복사 기능을 상단 요약에 재사용한다. 주소 복사 실패 시 주소를 선택해 직접 복사할 수 있는 설명을 유지한다.
- [x] 기존 준비 안내를 아래로 배치해 보존한다. 비밀문서 제출을 유도하지 않고 ‘개요와 연락처만’ 안내를 메일 버튼 가까이에 둔다.
- [x] builder의 absolute 좌표·모바일 오버라이드·섹션 순서도 새 배치와 맞춘다. 기존 사용자 문서 전체를 reseed하지 않는다.
- [x] 언어별 긴 문구와 200% 글자 확대에서 버튼 겹침·잘림을 검사한다.

**수락:** 390×844에서 연락처 페이지의 공식 이메일, 메일 작성, 복사 수단이 첫 뷰포트 안에 보인다(상단 고정 헤더 고려). 준비 안내는 이후에도 읽을 수 있다. 768/1440에서도 자연스러운 순서. 복사 성공·실패 안내와 키보드 포커스가 작동한다.

## Task 4 — 고객에게 필요한 내용으로 공개 카피 정리 (Grok / Fable 검토)

**Modify:** `src/components/InsightsArchiveSection.tsx:114`, `src/lib/builder/canvas/decompose-insights.ts:18`의 각 locale 문구.

- [x] KO 칼럼 소개 기본안: `대만 회사설립, 투자와 분쟁 대응에 필요한 법률정보를 확인하세요.` 다른 locale도 같은 정보 제공 목적에 맞춘다.
- [x] 본문·이미지·기존 칼럼 순서·법률 주장·SEO URL은 그대로 두고 소개 문구만 변경한다.
- [x] 저장된 공개 문서의 오래된 문구가 override로 남는지 화면에서 확인한다.

**수락:** 제작 과정 설명이 고객 페이지 소개에 남지 않고, 4개 locale의 의미가 맞는다. 기존 칼럼 링크와 슬라이더를 그대로 사용할 수 있다.

**운영 확인 후 별도 항목:** `src/components/YearEndEventPopup.tsx:75`의 이벤트가 실제 진행 중인지·조건이 무엇인지 확인한다. 확인 전 임의 종료·혜택 생성은 하지 않는다. 유지한다면 일반 상담과 구별되는 메일 제목으로 목적을 보존한다.

## Task 5 — 브랜드 인트로 정보 보강 (Grok / Fable 필요시 디자인 검토)

**Modify 후보:** `src/components/CinematicOpening.tsx:493`, `src/components/CinematicRouteShell.tsx`, 해당 `globals.css` 선택자. **Test:** 기존 `src/components/__tests__/cinematic-opening.test.tsx`.

- [x] 기존 영상·로고·진입 버튼을 유지한 채 짧은 설명과 연락처 링크를 추가한 PC·모바일 시안을 만든다.
- [x] KO 문구 기본안: `대만 법률 상담 · 한국어·일본어 소통`. 연락처 링크는 `/{locale}/contact`로 연결한다. 기존 본문 H1을 유지하고 H1 중복을 만들지 않는다.
- [x] 390px에서 기존 하단 진입 버튼·영상 컨트롤과 겹치지 않도록 배치한다. reduced-motion은 이미 정적 포스터를 제공하는지 확인해 유지한다. 인트로 의무 스킵으로 해석하지 않는다.
- [x] 클릭, Tab→Enter, 휠·터치, 뒤로가기, 첫 진입과 재진입을 확인한다.

**수락:** 첫 화면에 대만 법률 업무 설명과 연락처 진입이 보인다. 기존 본문 진입·메뉴·키보드·영상 제어 회귀가 없다. 이 변경의 전환 개선 효과는 측정 전 단정하지 않는다.

## Task 6 — 통합 검수와 공개 반영 준비 (Codex 최종 판정)

- [x] diff를 실제로 읽어 허용 파일, 중복 seed, 사용자 저장 문서 경로, 테스트 약화 여부를 확인한다.
- [x] 깨끗한 후보에서 `npm run qa`, `npm run build`, `git diff --check`를 실행한다. 실패를 기존 문제라고 뭉뚱그리지 않고 기준 SHA와 비교한다.
- [x] 테스트가 쓰는 데이터 루트는 기존 `playwright.config.ts`의 격리 하네스를 사용한다. 운영 URL을 mutation 테스트의 base로 넣지 않는다.
- [x] 후보 서버에서 기존 `site-search-app.playwright.ts`, 관련 공개 contact·cinematic 회귀와 변경된 테스트를 실행한다. 전체 빌더 테스트를 통과한 것으로 확대 보고하지 않는다.
- [x] 실제 화면에서 아래 표를 검증한다. diff·테스트·빌드·화면 모두 통과하기 전 완료 판정하지 않는다.
- [ ] 검증된 커밋·스크린샷·한계·복구 기준을 묶어 배포 검토 자료를 만든다. 사용자 반영 권한이 확인된 범위에서만 clean build를 공개 적용한다.
- [ ] 적용 후 같은 공개 URL에서 문구·href·대비·진입을 재확인한다. 후보 수정만으로 ‘사이트 수정 완료’라고 하지 않는다.

| 범위 | 확인 기준 |
|---|---|
| 4개 locale, 390/768/1440px | 정상 렌더, 가로 넘침 없음, contact 상단 수단 가시성 |
| 홈 | 인트로·본문·메뉴·키보드 진입, reduced-motion/기본 모션 |
| 검색 | 검색어 입력→결과, 대비 ≥4.5:1, 기존 결과/필터 동작 |
| 비용·연락처·프로필 | 언어 역할 설명과 mailto 일관성, 금액·주소 보존 |
| 메일·복사 | 실제 href·프리필 확인, 복사 피드백, 메일 미설정 상황 설명. 실제 전송은 별도 권한·수신 확인 필요 |
| 개발·운영 빌드 | dev console React 경고 점검, prod 렌더·asset 오류 점검 |
| 공개 저장 문서 | legacy 수정이 published override에 가려지지 않는지 확인, 사용자 편집 보존 |

## 운영 사실 확인 항목 — 병렬 진행 가능

직접 영어 상담과 직원 접수 범위, 타이베이 전화 운영, 리뷰 점수의 기준일, 이벤트 유효 여부·조건, 회신 소요시간. 확인 전 새 사실을 게시하지 않는다. 대비·명확한 CTA·연락처 재배치와 칼럼 소개 개선은 이 답변 전체를 기다릴 필요가 없다.

## 이번 단계 완료 기준과 다음 단계

- [x] Grok 4.6·Fable 5.1·Codex 독립 진단과 상호 검토 완료.
- [x] 주요 의견 충돌을 공개 화면·키보드·실측으로 판정.
- [x] 사실 결함·설계 개선·운영 사실 확인을 구분한 계획 작성.
- [x] Grok 구현과 Codex 통합 QA 완료.
- [ ] 검증된 커밋의 clean release build 및 공개 적용 승인.
- [ ] 공개 적용 및 같은 URL의 적용 후 검증.

토론·계획에 이어 후보 구현과 통합 QA를 마쳤다. 공개 사이트 반영은 아직 하지 않았다. 현재 판정과 제한은 [최종 검수](../../audit/site-debate-20260905/FINAL-REVIEW.md)를 따른다.
