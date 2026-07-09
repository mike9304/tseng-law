# tseng-law 자기개선 시스템 (self-improve) — 운영 런북

> 윅스 빌더(tseng-law.com + 에디터)를 지속 감시·개선하는 자율 시스템. 네이티브 primitive
> (loops · dynamic workflows · routines)로 조립. 상세 상태/교훈은 로컬 `SELF-IMPROVE-LOOP.md`
> (gitignore, 세션 상태) — 이 README는 **커밋되는 운영 계약**이다.

## 자율 경계 (하드 룰 — 코드로 강제)
- **무인 routine**: Detect + Report만. **커밋·푸시·배포 안 함.**
- **세션 내 Fable(대화형)**: 위 + 검증-green **툴링/게이트 커밋**까지.
- **푸시/프로덕션 배포**: **절대 자동 금지.** 변호사검수 + 사용자 push-auth 이중 게이트.

## 틱 (한 사이클)

### 1) 무인 tick — `scripts/self-improve-tick.sh` (report-only, sandbox-free)
LIVE 6축을 돌려 회귀를 감지하고 `.omo/evidence/self-improve-tick-<ts>.md`에 리포트. exit 1 = 발견.
| # | 축 | 스크립트 | 검사 |
|---|---|---|---|
| 1 | routes | `live-routes-scan.mjs` | 24 ko/zh 페이지 200+콘솔0+오버플로0 (1280/1024/390) |
| 2 | handoff | `handoff-blockers-gate.mjs` | 정적자산·admin-auth 경계 code FAIL (fresh artifact 강제) |
| 3 | seo | `live-seo-scan.mjs` | 28 URL: title(유일)·desc·canonical·hreflang·JSON-LD·본문 sentinel |
| 4 | sitemap | `live-sitemap-crawl.mjs` | sitemap.xml 전 `<loc>`(동적 라우트 포함) 200 |
| 5 | a11y | `live-a11y-scan.mjs` (+`a11y-baseline.json`) | axe serious/critical **baseline+delta**(새 위반만) |
| 6 | cwv | `live-cwv-scan.mjs` | LCP/CLS **poor 게이트**(LCP>4s·CLS>0.25, 노이즈 무시) |
| 7 | home-parity | `live-home-parity-scan.mjs` | ko/zh 홈 이미지 무게 파리티(홈 히어로 **디컴포즈-드리프트 가드**; ratio>2x/과대) |

### 2) 스마트 tick — `scripts/self-improve-tick-smart.sh` (감독형, sandbox)
격리 dev 샌드박스 spin → `editor-flow-gate.sh`(자기시딩 columns 생성→편집→미디어→발행→삭제)
→ teardown. 빌더 핵심 authoring 축. 무인엔 부적합(환경 false-fail L22/L23) — 사람이 지켜보는 세션에서.

### 3) 지능형 tick — dynamic workflow (적대적 verify + 자기 Critic)
Detect(축별 병렬) → Verify(아티팩트 기각, L3) → Synthesize → **Critic**(step 13: 자기 커버리지
갭·false-clean 능동 감사 → 개선 백로그 생성). 대화형 세션에서 Workflow로 실행.

## routine (주기 발화)
- **내구(권장)**: `scripts/self-improve.launchd.plist` — 하루 2회 무인 tick.
  ```
  cp scripts/self-improve.launchd.plist ~/Library/LaunchAgents/com.son7.tseng-selfimprove.plist
  launchctl load ~/Library/LaunchAgents/com.son7.tseng-selfimprove.plist   # 해제: unload
  ```
- 발견 확인: `.omo/evidence/self-improve-tick-*.md` (exit 1 = 사람/하청 트리아지).

## 발견 시 절차
1. 리포트의 축·증거 확인 → **적대적 재검증**(L3: +71 같은 샌드박스/캡처 아티팩트, 일시 글리치 기각).
2. 진짜 결함이면: 근본원인 파일:라인 추적 → 수정(하청 GLM/Codex 또는 직접) → 게이트 red재현→green.
3. **커밋은 검증-green 후. 푸시/배포는 변호사검수+사용자 승인 후에만.**

## 검증 도구 (게이트, 발견 판정용)
`watch-gates.sh`(공개축 원커맨드) · `editor-flow-gate.sh`(에디터축) · `parity-report.mjs --gate-height`
(라이브 픽셀 파리티, Δh 드리프트 게이트) · `run-lhci.mjs`(CI 딥 성능).

## 알려진 비차단 항목(디자인/성능 트랙, 자율 미수정)
- a11y **color-contrast 28건** (a11y baseline에 포착 → 회귀는 차단; 실수정=디자인 색상 결정).
- 홈 **LCP ~3.2s** (히어로 heavy-asset; poor 임계 이내라 게이트 통과; 최적화=측정기반 별도 slice).
