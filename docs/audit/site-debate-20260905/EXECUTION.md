# 공개 사이트 개선 실행 기록 — 2026-09-05

현재 상태: 후보 구현·통합 QA 완료, 공개 반영 전. [최종 검수](FINAL-REVIEW.md)가 최신 판정이며 아래 내용은 시간순 기록이다.

## 기준과 소유권

- 실제 production: `dpl_Fhp9jd7FZd6JCSQoonpDF3i4bp36`, `sejong-m515twu00-mike9304s-projects.vercel.app`.
- GitHub 공개 main `fcb128d971a154203b9358090b794ca48f11e220`의 Vercel 성공 상태 URL이 위 deployment와 일치. Vercel inspect에서도 tseng-law.com alias와 Ready production 확인.
- 무인증 GitHub API는 `mike9304/tseng-law`를 `private:false`, `visibility:public`으로 응답. 이전 소스 접근 거절은 비공개 소스 전송 우려였고, 공개 저장소 증거와 제한된 파일 권한을 제시한 후 Grok 소스 구현 실행은 자동 승인 검토를 통과했다. 기존 거절을 우회하거나 비밀정보 전송 권한으로 확대하지 않았다.
- 작업트리: `/Users/son7/Projects/tseng-law-public-improvements-20260905`, 브랜치 `fix/public-site-improvements-20260905`, 위 운영 SHA에서 생성.
- 공유 canonical 및 unified-marketing 레인의 대량 WIP는 채택하거나 되돌리지 않았다.
- 구현 Grok 4.6, 연락처 설계 교차 검토 Fable 5.1, 작업 지시·최종 검수 Codex. CLI 결과에서 실제 요청 모델 사용 확인.
- 의존성은 동일 package-lock인 canonical node_modules를 읽기 전용 참조. symlink는 커밋 대상에서 제외.

## 실행

1. 수정 전 관련 4개 Vitest 파일 65개 테스트 PASS.
2. Grok WO-01: 검색 보조글자 범위만 대비 수정, 메일 희망 언어에 일본어 추가, 비용 CTA를 이메일 문의로 명확화, 칼럼 소개를 고객용 문구로 변경. 11개 허용 파일 범위 확인. 관련 3개 파일 14개 테스트 PASS. 소스 문자열을 되풀이한 추가 테스트는 WO-02에서 제거 지시.
3. Fable 5.1은 published canvas의 contact parity composite와 EN/JA fallback이 ContactLegacyPageBody를 공유함을 확인. 기존 PageHeader children에 compact 이메일 수단을 배치하고 아래 중복 카드만 제거하는 설계 채택. About 기본 이메일 카드는 보존. 고정 composite 높이와 footer 겹침은 실제 화면에서 검증 예정.
4. Grok WO-02 실행: 연락처 첫 화면, 복사 실패 안내/정리, 인트로 서비스 설명·연락처 링크. 아직 검수 전.
5. 현재 발행 문서 13개(홈·연락처·가격·칼럼·소개 및 공통 헤더/푸터)를 공식 Blob get으로 읽기 전용 수집. 조회 2026-09-05T11:40:52Z, site updatedAt 2026-07-28T08:12:40Z. 운영 데이터 쓰기 없음. 토큰 출력/AI 전달 없음. 후보 QA만 이 스냅샷을 사용.
6. 발행 ZH-HANT 홈의 `home-insights-description`에 이전 기본 문구가 남아 있음. seed 변경만으로 발행된 노드는 갱신되지 않으므로, 정확한 기존 기본값에 한정한 렌더 보정 또는 검토 가능한 필드 변경이 필요. 사용자 편집 문구 및 데이터 바인딩은 보존해야 함.

## 초기 시점의 남은 검수

- WO-02 diff·범위·타이핑 검수, 실제 복사 성공/실패·메일 href·인트로 진입.
- 발행 문서의 기존 기본 칼럼 소개 반영 경로 해결.
- `npm run qa`, production build, diff check.
- 프로젝트 격리 QA 하네스에서 4개 언어 390/768/1440 화면, 200% 글자 확대, footer 겹침, 검색 대비, 메뉴/인트로 회귀, 개발 콘솔 검증.
- 검증된 변경과 증거를 묶어 공개 반영 권한 확인, clean build 배포 후 같은 공개 URL 재검증.

원본 조사/CLI/QA 자료는 `/private/tmp/tseng-public-debate-20260905`, `/private/tmp/tseng-grok-public-implementation-20260905`, `/private/tmp/tseng-public-candidate-qa-20260905`에 있다. 원본 CLI JSON의 내부 생각·비밀정보·운영 문서는 공개 커밋에 포함하지 않는다.

## 21시 이후 검수 업데이트

- WO-02 종료 후 연락처·인트로 관련 검사 76개 중74 PASS/2 FAIL. 둘 모두 가짜 textarea.remove가 parentNode를 해제하지 않는 테스트 모형 오류로 확인했고 Grok 후속 수정. WO-03 통합 관련8개 파일95개 테스트 PASS.
- 개발 서버4853은 환경을 비운 상태에서 임시 발행 사본만 읽음. 390×844 네 언어 모두 이메일·작성·복사·최소정보 안내가 첫 화면 안에 있음. KO 이메일 y356, EN/JA y383, ZH y356. 가로 넘침/해당 연락처 화면 React 오류 없음.
- 새 연락처 label/note 대비4.46:1을 axe로 적발 → Grok이 세 선택자만 text-body로 보완. 재측정 예정.
- 인트로 첫Tab→Enter로/ko/contact 진입, 기존 본문진입 버튼 실제 클릭 모두390/1440 정상. 새 인트로 대비 위반 없음.
- 홈의 Next Image 개발 경고는 변경 없는 운영SHA를 별도4854서버로 띄워 같은 흐름과 비교: 같은3개 경고가 양쪽에 있고 pageerror는0. 새 회귀로 분류하지 않음. 비교 원본 dev-warning-comparison.json.
- Fable 최초 parity anchor 설명은 실제 저장 문서와 달라 정정함. 현재 contact는 as=main인 절대배치 root와 legacy-page-contact child,2개노드·고정3057높이 구조. 공통 ContactLegacyPageBody 통합점은 맞았지만 parity CSS 경로는 쓰이지 않음.
- LIVE PC contact1440에서 officesbottom1205.19,footer609.25(약596px겹침). 후보는약559px. 기존 결함이며 Fable이 절대배치2노드가 내용 높이에 참여하지 않는 원인을 추적. WO-04에서 정확한 기본contact틀만 상대배치/자동높이로 보완 중; 사용자 편집·추가 위젯 있는 canvas는 보존.
- WO-03 첫 실행은18턴 읽기 후한도 종료, 수정0. 같은대화재개 후10턴에서실제구현완료. 모델대체없음.
- 리뷰 잔여: archive 문자열 매핑의 Object 상속키(toString 등) 보호 필요. pricing seed의 기존responsive높이·버튼폭 보정과 새CTA/안내 정합 확인 필요. 제품공개문서는 현재nativepricingcomposite라 이새seed부분은별도확인.

## 21:30 검수 상태

- WO-04 완료. 실제 고정contact틀의 root/composite를 flow로 반영했고, 후보 개발 화면 4locale×390/768/1440=12경우(홈·연락처·비용·검색48페이지) 재검증은 실패0. 원본 `dev-matrix-after-scaffold/report.json`.
- 처음 JA 인트로 검사는 초기화 직전 클릭 타이밍에서 timeout. 운영·기준·후보 단독 비교에서 모두정상, html의 cinematic초기화완료 상태를 기다린 전체재검증도모두정상. 무작정 제품코드를수정하지 않음.
- 모의 clipboard rejection/execCommand throw 네언어 모두실패안내·textarea잔여0·버튼focus보존 확인. 200%root글자확대 시 버튼의가로넘침없음. `copy-zoom.json`.
- WO-04 새테스트29개 중27PASS/2FAIL: 렌더fixture의container.content.background가 누락돼trim에서실패. 실제발행문서에는값있음. fixture보완지시예정.
- 중간tsc에서3타입오류 확인: copy-email detachNode의DOM시그니처, archivefixture의union spread, pricingCTA note의union spread. 모두신규변경부분이며최종보완지시WO-06에기록.
- scaffold가일부사용자responsive수정(부모override없는childwidth500,부모/자식모두mobilex10)을잘못기본틀로분류하는probe재현. WO-06에서효과적viewport좌표로보호조건보완예정.
- WO-05 진행중(archive상속키보호,새pricingseedCTA/안내크기). 후속WO-06 준비됨. 전체QA/production build/최종공개반영전.
- 기준서버4854는작업폴더를검증한뒤정상종료. 후보개발서버4853은검수용으로진행중.

## 21:40 인계

WO-05 완료: 상속키 문제 Map.get으로 보완, 가격 CTA/안내 seed의 반응형 치수 보완. 새 배치 테스트5개 PASS. 기존 baseline 테스트2개는 의도적으로 커진 CTA 치수의 옛 기대값만 실패(나머지26PASS). 독립 seed실행으로 ZH container636,wrap89,button x479/w220/h47,note y57/h32 확인; root875/stage1450 보존. WO-06은 이 기대값 및 앞서 확인한 타입·fixture·사용자responsive보호 조건을 최종 수정 중이다. 활성 실행 정보는 임시 WORKORDER 디렉터리의 RUN-STATE.json에 남겼다. 공개 반영은 아직 수행하지 않았다.

## 最終 통합 검수 진행 — 2026-09-05 22:08 KST

- WO-06 종료: DOM copy helper 타입, archive fixture, contact responsive custom-layout 보호, ZH 가격 CTA 기대값을 보완. WO-07에서 CTA 노드의 discriminated union 오류를 좁혀진 if 블록의 대입으로 해결. 실제 모델은 두 작업 모두 grok-4.6-build로 확인.
- 첫 전체 QA는 타입 오류1건에서 중단. WO-07 이후 타입 검사·린트 통과, 전체 테스트8679 PASS/3 FAIL. 두 건은 새 렌더 테스트가 CSS 문자열의 data-node-id를 실제 태그로 오인한 helper 오류. WO-08은 openingTag만 보완했고 기존 모든 assertion 보존; 이어서 신규 회귀 전부 통과(전체8681 PASS/1 FAIL).
- 마지막 기존 격리 테스트는 새 checkout의 data/audit 누락 및 env-i로 TMPDIR가 없어 macOS /tmp symlink로 향한 환경 문제. 기준 SHA의 분리 checkout에서도 디렉터리 누락 실패 재현. 검증용 빈 data/audit 생성 및 TMPDIR=/private/tmp를 지정하며 보안 검사 코드는 수정하지 않음.
- Next 개발 서버4853은 해당 listener cwd를 확인한 뒤 종료. typecheck가 next-env.d.ts를 원래 .next-build 참조로 복구했으며 이 파일 변경 없음.
- Fable 최종 추가 코드 리뷰는 **실행되지 않음**. 자동 승인 검토가 외부 서비스로 보낼 구체적 로컬 diff 승인이 없다는 사유로 거부. 인증 없는 GitHub API의 public/private:false 증거 및 비밀키·토큰6종 패턴0건 결과를 제출해 재심사했으나 재차 거부. 우회 실행하지 않음. 기존 Fable 두 설계/리뷰는 완료된 상태이며 Codex 로컬 검토/QA는 계속함. 추가 외부 코드 리뷰를 유지하려면 해당 payload에 대한 사용자 승인이 필요.
- 생산 코드의 최종 변경은 Grok 수행. Codex는 검증 스크립트·환경 준비·diff검토·작업 기록을 담당. 새 기본 글자 200% 검사는 root font만 늘리던 한계를 수정하여 각 실제 computed font-size/line-height를2배로 측정하도록 준비. 이전 root-font 결과를 완전한 글자 확대 검증으로 확대 해석하지 않음.

## 2026-09-05 22:36 KST — 전체 QA와 운영 빌드 검증

- `npm run qa` PASS (`final-qa-complete.log`):1135파일,8682 PASS/14 SKIP; typecheck/lint/security279route·273mutationguard 모두통과. 전체테스트가반복실패한 기존crash fixture는 부모SIGKILL전에자식이ready marker후자체exit0하는경쟁이었다. 기준코드도같은suite의다른SIGKILL항목에서timeout. 직접4회실행모두자체종료로원인확인. WO-09가testfixture의미해결Promise에참조된interval을추가해실제kill까지생존보장; 재probe는SIGKILL(-9)까지정상대기. 보안/제품코드·assertion·timeout/skip변경없음.
- `npm run build` 네트워크허용후PASS (`candidate-build-network.log`). 첫sandbox시도실패는GoogleFonts다운로드차단. env-i및실제운영키없는ownworktree로실행.
- 운영빌드4855의4locale×3width×4page=48페이지PASS (`prod-matrix/report.json`); 정상가로폭·검색대비·pricing메일버튼hit-test·contact최초화면·footer순서·홈본문진입·pageerror0 확인.
- `site-search-app.playwright.ts` 1PASS (`site-search-playwright.log`):프로젝트의attested임시runtime에서만검색앱/테스트포트폴리오/발행테스트페이지생성·검색·삭제. 운영쓰기없음.
- 실제font-size/line-height200%에서새상단controls4언어모두28.8px및viewport안에존재,footer는offices끝보다120px아래. EN본문의옛이메일링크(4개)와사무소탭단어가넘침. 후보브라우저CSS실험으로contact-list mailto max-width/overflow-wrap와offices탭overflow-wrap두규칙만으로document399→390px·메일링크right437.7→347.4px 검증. WO-10가해당두규칙만적용했고새build진행중.
- 데스크톱메뉴 hover중Escape단독으로닫히지않고pointeraway에서닫히는현상은공개LIVE와후보동일함 (`desktop-menu-comparison.json`). 헤더코드는변경하지않았으며이번인트로변경의새회귀로분류하지않음. 최종동작보고서에서Escape결과를기록하고hover해제닫기도검증하며이기존한계를숨기지않음.
- 4855첫하네스종료checksum FAIL은그서버와병행한전체unit테스트가**own 후보checkout**의 runtime-data/builder-commerce/billing-documents/numbering.json을변경했기때문. mtime22:21:57은unit실행구간과일치,발행snapshot13개SHA는전부일치. 실제canonical레포/운영Blob은사용하지않음. 최종하네스는모든unit/build종료후시작하고추가unit병행금지,종료checksumPASS확인예정. 이경고를단순PASS로덮지않음.


## 최종 후보 검수 — WO-11 이후

- WO-10 이후 전체48페이지 및 실제font-size/line-height200% 확대12경우 모두PASS. 초기RootFont 확대 검사를 대체하는 최종 결과는 `final-copy-zoom/copy-zoom.json`이다.
- native Codex 교차 소스 리뷰가 새 anchor 입력 예외를 지적했고, 실제 LIVE/후보 비교에서 기존scroll·신규contact 링크 위 wheel/swipe가 후보만 intro=true에 머무는 회귀를 확인. WO-11 Grok4.6이 기본 form-control 선택자의 `a, `만 제거했다. 최종 입력 처리 코드는 운영 기준과 동일하며, 추가 테스트의 제목만 좁히고 assertion은 유지했다.
- WO-11 이후 `npm run qa` exit0:1135파일·8682PASS·14기존SKIP; typecheck/lint/security PASS. `npm run build` exit0. `git diff --check` PASS.
- 수정 후 실제 휠/터치4경우 모두intro=false/mainVisible=true/scrollHeight12976. 네 언어×390/1440의 새contact 실제클릭·Tab→Enter·뒤로가기·영상재생/일시정지·메뉴8경우 모두PASS, pageerror0. 기존 본문진입 버튼도 같은8경우 실제클릭PASS.
- 앞선 정상모션 검사에서 ZH390 React418을 한 번 관찰했다. 같은흐름3반복 및 최종8경우에는 재현되지 않았고, 소스리뷰에서도 새SSR불일치 원인을 확정하지 못했다. 기존문제 또는 해결완료라고 단정하지 않으며 제한으로 남긴다.
- 최종 추가 외부 Fable코드리뷰는 자동승인거부로 실행하지 않았다. 사용자 지정 Codex 최종검수 범위에서 native Codex 읽기전용 리뷰로 대체했다. 기존 실제 Fable설계검토는 완료했고 외부CLI 거절을 우회하지 않았다.
- 모든unit/build 종료 후 가동한 마지막 QA하네스4855를 정상종료했다. `postfix-prod-server.log` 종료기록은 canonical runtime/audit checksums unchanged PASS. 공유원본·운영Blob 변경 없음.
