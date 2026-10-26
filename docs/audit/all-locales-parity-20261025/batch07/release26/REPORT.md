B7 최초 산출물은 FA 조문번호 표시 문제 때문에 아직 전체 통과 상태가 아니다. 내용 커밋은 `5848aa6c9494b09590b39ca5b0c117dd295e9beb`이며, 원래 결과와 산출물은 후속 수정본으로 덮어쓰지 않는다.

| 검증 | 실제 결과 |
| --- | --- |
| Node24 전체 정적 빌드 | exit 0, 142초 |
| 산출물 | 5,505파일 / 484,597,431바이트 / 3,136 HTML |
| 수집·사이트맵 | crawl2,944 / sitemap2,939중2,939 |
| 깨진 참조·초과크기·누락·Flight 오류 | 모두0 |
| 기존 미디어 origin | 2,164파일 분리 / 참조1,346 / 누락0 |
| 사례별15언어 정적 검증 | 90/90 PASS, 본문 블록2,164개 |
| ARC49언어 회귀 | 147/147 PASS, 본문 블록6,553개 |
| 주 브라우저 | 104건 중98 PASS / 6 FAIL, exit1 |
| 별도 HE706 모바일 회귀 | 1/1 PASS |
| 기본 패키지 | 171,588,752바이트 = 163.6398MiB |
| 256MiB 한도 여유 | 96,846,704바이트 = 92.3602MiB |
| 패키지 무결성 | HTML3,136 gzip 역복원 동일 / 다른 자산2,366 동일 / 실패0 |

실패6건은 FA915의 desktop/mobile/slow/nojs 네 경우와 FA919의 desktop/mobile 두 경우다. 각각 두 링크의 `۸۵-۱` 또는 `۲۲-۲`가 숫자 묶음 사이에서 RTL 순서로 배치된다. 각 숫자 묶음 내부는 LTR이고 줄바꿈·가림은 없다. 이 두 법령ID의 원문 글자·공식URL은 정확히 보존되어 있지만, 전체 ID를 왼쪽부터 보면 `۱-۸۵` 또는 `۲-۲۲` 순서가 된다. 다른 본문·FAQ·메타데이터·표·이미지·전환 검사는 실패하지 않았다. page/console/HTTP/자산/RSC 오류는 모두0이며, JavaScript를 꺼서 발생한 로컬 script preload CSP 차단7건은 별도 기록했다.

104건의 실제 구성은 신규42편 desktop1440px와 mobile390px 각각42건, slow7건, no-JavaScript7건, home49/기존KO0513의3언어 메뉴6건이다. FA 여섯 글의 RTL 방향·숫자·식별자·표는 실제 DOM Range 좌표로 검사했다. article과 열린 언어 메뉴 모두 폰트 준비 및 network idle을 기다렸다. 본문 표 수는 원문AST에 따랐다. 기존HE706은 별도 모바일1건이며 두 표 행의 `23-1`이 단일 줄로 읽히는 화면을 확인했다.

정적 검증은 신규42편, B6의42편, 정본6편을 각각 자신의 원고와 비교했다. 실제15언어 클러스터·footer·hreflang·sitemap, 모든 본문 블록, FAQ, 제목/요약/이미지, 날짜를 확인했다. 정본의 발행일25일, 번역의발행·수정일26일을 확인했고 정본의 이미 승인된 수정일26일은 그대로 따랐다. ARC147편은 각49언어 클러스터와 원문 메타데이터·본문을 별도 비교했다.

기본 packer 및 Worker 소스 해시는 B6와 동일하다. emitted Worker, Wrangler설정, ASSETS바인딩, 보안 헤더를 같은 산출물 입력으로 재생성한 값과 비교했다. 패키지5,506파일의 전체 해시는 `83bd161cd5639e2017f0f1c75cc539252f51ae4e8ed509537f211d61c6bb25f0`이다. 용량 후보의 shared-gzip 코드는 이 빌드나 패키지에 포함하지 않았다.

전후 동결에서는 신규42편, 정본6편, 전체 원고2,370개, 산출물 전체와 원래 build baseline의 tracked src/scripts가 동일했다. 산출물 전체 해시는 `12fbd1c3776bc1574f63d32fd5c99f20fc2a6732b56b46daaed6867a34df1684`, 원고 전체 해시는 `8677aa9b34121952ce1d89329b8668cfd720ddef5417002757882b7cdcfb86b9`이다. 빌드 완료 시 R은 clean이었다. snapshot-after 시 root가 별도로 추가한 bidi 테스트1파일은 경로·SHA를 따로 기록했다. 이후 root가 수정하는 renderer는 이 최초 산출물에 들어 있지 않다.

문제번호만 임시 DOM의 `<bdi dir="ltr">`로 감싼 가상 실험에서는 1440px/390px, 각2글의 링크2개씩 총8관측 모두 글자 순서가 원문과 같은 LTR이며 한 줄이었다. body textContent, 모든 href, 원고와 산출물 바이트는 변하지 않았다. 이 실험은 가설 확인이며, 실제 수정본의 통과로 집계하지 않는다. 검사기를 완화하거나 최초6실패를 지우지 않았다. 상세 근거는 [FA 진단](checks/fa-identifier-diagnosis.md), 실제 좌표·글자·URL은 [원본](checks/fa-identifier-diagnostic/observations.json)과 [가상 미리보기](checks/fa-identifier-preview/observations.json)에 있다.

대표 화면: [FA85-1 원본](checks/fa-identifier-diagnostic/390-fa-915-link1.png), [FA85-1 가상 미리보기](checks/fa-identifier-preview/390-fa-915-link1.png), [FA22-2 원본](checks/fa-identifier-diagnostic/390-fa-919-link1.png), [FA22-2 가상 미리보기](checks/fa-identifier-preview/390-fa-919-link1.png), [기존HE706 표](checks/browser-screenshots/mobile-he-706-rtl-table.png). 모두 실제 격리 Chromium의 화면을 직접 열어 확인했다.

기계 판정과 SHA 묶음은 [initial-qa-summary.json](checks/initial-qa-summary.json), 실행 명령은 verification의 래퍼와 각 command 영수증에 있다. 이전 B6 하네스·산출물·capacity 후보는 변경하지 않았다. 이 작업자는 R 코드·원고·공유도구를 수정하거나 commit/push/deploy하지 않았다. 데이터 모드는 `--data`를 생략한 local fallback으로, Air의 production CMS mirror와의 일치를 증명하지 않는다. 이 패키지가 한도 내라는 결과를 최종49×286편의 용량 입증으로 확대하지 않는다. 원어민 또는 법률 감수 승인을 주장하지 않는다.
