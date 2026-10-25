# B4 최종 산출물 QA

2026-10-26 KST, column_deploy. Commit `e990fd45165b73724ef870ecc80cd6dd9910cd05`, build-info `2026-10-25T16:49:01.858Z`, `R/out-all-locales-batch04-release26-final`을 검증했다. 결과는 ARC 브라우저 62/62, 별도 ZH 메타데이터 3/3, 패키지 전수 무결성 PASS다. 실제 HE706 모바일 조문번호 줄바꿈도 해결됐다.

이 보고서는 새로 컴파일된 최종 산출물의 결과다. 이전 42f2 실행의 최초 실패, 61/62 해결 상태, 검사기 보완, 가상 DOM 미리보기는 `batch04/release26` 기록에 그대로 보존했다. 가상 미리보기 점수를 최종 결과에 합산하지 않았다.

## 실행 범위

- 신규7언어 he/bn/ur/fa/my/ta/ne의 21편: desktop1440 × 21, mobile390 × 21.
- 느린 HTML 스트림 7편, JavaScript 비활성 7편.
- home49 및 기존 KO0513 언어군3의 desktop/mobile/slow 메뉴6건.
- ARC 상세의 실제 번역군42, 본문 title/summary/FAQ와 모든 Markdown 본문 블록, 이미지 decode/alt/caption, canonical/hreflang, Article/FAQ JSON-LD, footer·열린 언어 메뉴 및 전체 문서 전환을 확인했다.
- HE/UR/FA는 실제 문서·본문·제목·FAQ RTL 방향과 숫자/영문 식별자 좌표를 검사했다. 표 개수는 원문 AST와 맞추며, 표가 있는 글은 RTL 열 순서와 가로 스크롤을 확인했다. 문서와 열린 메뉴에서 폰트 및 네트워크가 안정된 뒤 전환했다.

Node24.14.1, 격리 Chromium1248(156.0.8078.4), 동시 브라우저2를 사용했다. 사용자 브라우저·계정은 사용하지 않았다. 새 62건 전체가 최초 실행에서 PASS, exit0이었다.

## 실제 HE706 최종 화면

42f2→e990의 `src/`, `scripts/`, `public/` 변화는 HE706 한 파일뿐이다. 승인된 두 상황 셀 치환만으로 새 원문이 정확히 재현되며 역복원도 일치한다. Frontmatter·FAQ·기한 셀·출처·나머지 본문은 그대로다. 최종 원고 SHA는 `fa78467ebf94880a503e0549e6f00b73950771324285d92524996f8e09f87b3d`다.

최종 HTML의 mobile390 화면에서 본문 `23-1` 네 곳 모두 visible/LTR/한 줄임을 좌표와 실제 캡처로 확인했다. 모바일 화면을 직접 읽었으며 인접 행에 새 줄바꿈이 생기지 않았다. 이는 임시 DOM 치환 없는 최종 산출물이다.

대표 화면: `browser-screenshots/mobile-he-706-rtl-table.png`, SHA `67238eabe998e358f8da5586eebb2c484c4a32ccd756697980317140dbef0774`. 데스크톱 짝은 `browser-screenshots/desktop-he-706-rtl-table.png`다. 그 밖의 실제 언어별 hero/body/table 화면도 같은 폴더에 있다.

## 별도 ZH3 및 패키지

ZH918/920/921은 각각 실제 zh-hant 단일 언어군으로 검사했다. 원문 주제·수정일 두 필드 역복원, 변경 없는 본문·FAQ, canonical/full slug, 원 발행일25일·ISO 수정일26일, 실제 file loader의 `litigation` 및 브라우저 분류 보드의 `訴訟與糾紛` 카드가 모두 일치한다. 결과3/3 PASS, exit0. `metadata-zh-screenshots/`에 글과 실제 분류 카드 화면을 저장했다.

변경 없는 기존 패키저로 `final-release26/pack`만 생성했다. 결과는 167,300,148B(159.549854MiB), 256MiB 한도까지 101,135,308B(96.450146MiB) 여유다. HTML2,995개의 gzip 복원과 자산2,366개의 바이트, `_headers`가 모두 원본과 일치하며 오류는0이다. 패키저 SHA `c983e275e92ef2aff523f6307069ca54121fc79400e9c247fa02f7c1b73d85e7`도 이전과 같다.

## 동결·보존

종료 snapshot에서 R 전체 Markdown2,229개, 최종 산출물5,364개(466,283,191B), HEAD/build-info, B4 원고21 및 ZH3이 검사 전과 동일했다. 원고 트리 SHA `f59fa3d66d09bfd61b342c6fee52d7c70dcfeea6de996e470483de59429d168d`, 산출물 트리 SHA `e5632b9e3e5e75b22dd04391994c443a45e1daf76e4b59be831df7e082ce7e31`이다.

B3 release26 기록5,465개 및 산출물5,347개, B4 이전 release26 기록5,557개 및 42f2 산출물5,364개, 최초 로컬 미디어 포함 보존본7,510개도 전후 모든 파일 SHA가 동일하다. 종료 시 R git status 출력은 비어 있었다.

전체 증거 목록과 SHA는 `final-verification-summary.json`에 묶었다. 이 파일 SHA는 `81aed8183eed1071c55cb9303fedca6d4b1b57754ce64c948849a9793bed5eee`다. 원 실행 로그·JSON·검증 스크립트·전후 snapshot을 별도 보존했으며 최초 실패 기록을 덮어쓰지 않았다.

이 결과는 로컬 산출물 검증이다. 배포·push·인프라 변경은 수행하지 않았고, 저장소 전체 단위 테스트를 이 검수자가 재실행했다거나 인간 원어민·변호사 승인을 받았다는 의미는 아니다. 공개 배포 및 공개 화면 확인은 Root 담당이다.
