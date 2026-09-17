# 공개 사이트 개선 — 최종 후보 검수

2026-09-05 KST. **후보 구현·통합 검수 완료. 공개 사이트 반영 전.**

Grok 4.6이 구현했고, Fable 5.1이 초기 토론과 필요한 연락처 설계를 검토했다. Codex가 작업을 지시하고 실제 화면·소스·테스트를 검수했다. 별도의 native Codex 읽기 전용 리뷰도 최종 **Ready: yes**로 판정했다.

[세 AI 토론](REPORT.md) · [실행 계획](../../superpowers/plans/2026-09-05-tseng-law-public-improvements.md) · [상세 실행 기록](EXECUTION.md)

## 변경 결과

| 발견한 문제 | 후보의 동작 |
|---|---|
| 검색 결과 작은 글자의 흰 배경 대비 3.11:1 | 검색 보조글자에만 기존 진한 색 적용, 최종 검색 화면의 대비 위반 없음 |
| 언어판마다 메일 희망 언어에 일본어 누락 | 네 언어 메일의 희망 언어 목록과 상담 안내 정합 보완 |
| 예약 버튼이 실제로는 이메일 작성 | ‘이메일로 상담 일정 문의’ 등 실제 행동을 명시하고 일정은 이메일 확인 후 확정됨을 안내 |
| 연락처 페이지에서 이메일 접근이 늦음 | 제목 다음 첫 화면에 공식 주소·메일 작성·주소 복사·최소정보 안내 배치 |
| 칼럼 소개에 제작 과정 설명 노출 | 고객용 법률정보 소개로 수정. 저장된 홈의 정확한 옛 기본 문구만 렌더 시 보정하고 사용자 편집은 보존 |
| 인트로에서 업무 설명과 연락 경로가 늦음 | 영상·브랜드·본문 진입을 유지하며 업무 설명과 해당 언어 연락처 링크 추가 |

검수 중 확인한 기존 연락처의 사무소/푸터 겹침도 보완했다. 정확한 기본 2노드 연락처 틀에만 내용 높이를 반영하며, 사용자 배치·추가 노드·반응형 편집은 보호한다. 200% 글자 확대에서 기존 이메일과 사무소 탭이 넘치는 문제는 해당 요소의 줄바꿈으로 해결했다.

원래 이메일 주소·금액·사무소 주소·민감정보 안내를 유지했다. 운영 발행 문서를 reseed하거나 저장하지 않았다.

## 검증 결과

- 마지막 수정 WO-11 이후 `npm run qa`: **1135개 파일, 8682 PASS, 14 기존 SKIP**. 타입·린트·보안 경로 검사 통과.
- `npm run build` 및 `git diff --check` 통과. Next 운영 빌드의 490개 정적 페이지 생성 완료.
- 네 언어 × 390/768/1440px × 홈/연락처/비용/검색 **48페이지** 통과. 연락처 수단 첫 화면 노출, 검색 대비, 가로 넘침, 비용 CTA 실제 hit-test, 사무소 뒤 푸터 순서 확인.
- 네 언어의 복사 실패 두 경로와 실제 font-size/line-height 200% 확대 **12경우** 통과. 실패 안내·임시 textarea 정리·포커스 유지 확인. 복사 성공은 48페이지 검사에서도 확인.
- 최종 인트로 링크 두 개 각각 실제 wheel/swipe **4/4** 본문 진입. 새 연락처 클릭·Tab→Enter·뒤로가기·정상 영상 제어·메뉴 **8/8**, 기존 본문 진입 버튼 **8/8** 통과. 최종 동작 검사 pageerror 0.
- 기존 `site-search-app.playwright.ts` **1 PASS**. 프로젝트의 attested 임시 QA 환경에서 생성·검색·삭제했으며 운영 쓰기 없음.
- 최종 QA 서버 종료 시 원본 runtime/audit 체크섬 불변 PASS. 공유 작업 폴더의 다른 레인 WIP는 포함하지 않았다.

별도 테스트 안정화 커밋 `6e7807bb`는 기존 crash-worker fixture가 부모 SIGKILL 전에 자체 종료하던 경쟁을 해결한다. 운영 기준에서도 재현했고, 테스트 자식 프로세스만 kill 시점까지 살아 있도록 했다. 제품·보안 코드 및 기존 assertion·timeout·skip은 바꾸지 않았다.

## 남겨 둔 한계

- 정상 모션의 ZH390 검사에서 React 418을 한 번 관찰했다. 같은 흐름 3회 반복 및 최종 네 언어 8경우에서는 재현되지 않았다. **원인 미확정·후속 미재현**이며 기존 문제 또는 해결 완료로 단정하지 않는다.
- 데스크톱에서 hover 중 Escape만으로 메뉴가 닫히지 않고 포인터를 옮기면 닫히는 동작은 LIVE와 후보가 같았다. 모바일 Escape는 통과했다. 변경하지 않은 헤더의 기존 한계로 기록했다.
- 개발 화면의 Next Image 경고 3개는 운영 기준과 후보에 동일하게 나타났다. 전체 접근성 인증·실제 이메일 수신·전환율·전체 빌더/외부 제공자 검증을 뜻하지 않는다.
- 추가 외부 Fable 코드 리뷰는 자동 승인 검토가 구체적 로컬 diff 전송 승인을 요구해 실행하지 않았다. 기존 실제 Fable 설계 검토와 사용자 지정 Codex 최종 검수로 진행했고, 외부 전송 제한을 우회하지 않았다.

## 공개 반영 절차와 복구 기준

운영 기준은 `fcb128d971a154203b9358090b794ca48f11e220`, 현재 검증한 배포는 `dpl_Fhp9jd7FZd6JCSQoonpDF3i4bp36`이다. 후보 브랜치는 `fix/public-site-improvements-20260905`다.

1. 검증된 소스와 이 검토 문서를 범위 지정해 커밋한다. 원응답 JSON·운영 스냅샷·임시 데이터·의존성 링크는 제외한다.
2. 커밋만으로 만든 깨끗한 release 사본에서 빌드한다. 실제 공개 반영 직전 main 및 운영 배포 변경 여부를 재확인한다.
3. 저장소 `AGENTS.md`의 ‘push 는 사용자 확인 받고’에 따라 완성된 후보의 푸시·공개 반영을 확인받는다.
4. 승인 후 해당 커밋을 공개 반영하고 동일한 공개 URL에서 문구·href·대비·연락처/본문 진입을 재검증한다.
5. 새 회귀가 확인되면 새 배포 승격을 중지하거나 위 운영 배포로 복구한다. 저장 데이터 변경이 없어 콘텐츠 역마이그레이션은 필요하지 않다.

## 로컬 근거

`/private/tmp/tseng-grok-public-implementation-20260905/`:
`final-qa-WO11.log`, `candidate-build-WO11.log`, WO-01~11 결과(실제 `grok-4.6-build` 확인).

`/private/tmp/tseng-public-candidate-qa-20260905/`:
`final-matrix/report.json`, `final-matrix/*.png`, `final-copy-zoom/copy-zoom.json`, `final-copy-zoom/*.png`, `intro-link-input-comparison.json`, `intro-link-input-after-WO11.json`, `postfix-interactions/interactions.json`, `postfix-old-button.json`, `zh-hydration-repeat/interactions.json`, `desktop-menu-comparison.json`, `final-site-search-playwright.log`, `postfix-prod-server.log`.

원응답과 운영 발행 사본은 공개 커밋에 포함하지 않는다. 이 문서는 후보 검수 결과이며 공개 반영 완료 보고가 아니다.
