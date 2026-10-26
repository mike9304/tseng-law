B9 로컬 full build와 최종 QA를 완료했다. 검증 커밋은 `89206d10a5d3beb7223207f0ca2f3d34889b19ed`이며 종료 때 R은 clean, 원고·정본·산출물은 검사 시작 바이트와 같았다. 원고/runtime/shared 도구를 수정하거나 commit/push/deploy하지 않았다.

| 실제 범위 | 결과 |
| --- | --- |
| Node24 full build | exit0, 148.29초, crawl3,028 |
| 정적 산출물 | 5,593파일 / 496,233,237B / 3,220HTML |
| 사이트맵 | 3,023/3,023; broken/missing/oversize/Flight0 |
| 사례 칼럼 | 174/174; 각 사례29언어, hreflang29+x-default |
| ARC | 147/147; 주제별49언어 |
| 기존 SK 교정 | 014/877/878 3/3; 실제 클러스터49/1/1 |
| 전체 선택 본문 | 10,870개 순서 있는 본문 블록, FAQ944개, 링크쌍7,402개 |
| 신규42편 브라우저 | desktop42+mobile42+slow7+no-JS7+home/legacy6=104/104 |
| 변경·RTL 회귀 | SK3양화면6+FA915/919mobile2+HE706mobile1=9/9 |
| 기본 패키지 | 174,462,193B / 166.380113MiB; 여유89.619887MiB |
| 패키지 무결성 | HTMLgzip3,220복원+자산2,370바이트동일; 5,594파일 전수해시 |

실제 명령은 `node scripts/static-site/build.mjs --out=out-all-locales-batch09-release26 --port=4643 --media-origin=https://media.tseng-law.com`이다. `--skip-build` 없이 전체 컴파일했고, `--data`를 생략한 local fallback이다. Air의 prod-mirror 재현으로 확대하지 않는다. 기존 media origin으로 2,164개를 분리했고 참조1,346개의 로컬 원본 누락은0이다.

초기 sandbox에서 두 port preflight가 EPERM/exit1로 멈췄으며 빌드는 시작되지 않았다. 이 기록을 보존한 뒤 같은 승인된 로컬 명령을 도구 검토로 실행해 full build exit0을 받았다. 기존 CSS autoprefixer 경고와 원로그도 보존했다. 검사 기준을 낮추거나 실패 증거를 덮어쓰지 않았다.

174사례+147ARC+기존SK3의 자기 원문 제목·요약·FAQ·본문 순서·표 수·링크href/문구·이미지/alt/caption·Article날짜·canonical·HTML/footer/sitemap 클러스터를 실제 새 산출물과 대조했다. 기존 mailto 렌더가 같은 수신자와 fragment를 보존하며 subject/body만 보태는 경우만 명시 허용한다. 기사 내용의 새 법률·원어민 재승인이나 외부 출처 전체 재접속을 수행한 것은 아니다.

SK014는 옛 원문에 published/summary/alt/hero caption이 없으므로 현행 getColumnPost와 실제 renderer 계약으로 검사했다. 제목·중복H1/이미지 제거·이미지경로 정규화·요약 추출·title alt fallback은 기존 동작이며 변경하지 않았다. 표시일 `13. septembra 2025`와 Article datePublished의 기존 lastmod fallback `2026-07-25` 차이는 그대로 기록한다. SK877/878의 단일 언어 메뉴는 실제 자기 링크1개를 확인했고, 존재하지 않는 번역으로 전환하지 않았다. 신규26일 날짜/캡션 계약을 기존 글에 강제하지 않았다.

격리 Chromium1248에서 최초113건 모두 통과했고 console/page/HTTP-asset/RSC 오류는0이다. no-JS7건의 알려진 script preload 차단7개는 원자료에 별도 보존했다. 원문 AST가 실제 표 수를 정하고 폰트와 메뉴 폰트 안정화 뒤 문서 이동을 확인했다. FA 법령 식별자 `۸۵-۱`/`۲۲-۲`의 실제 bdi dir=ltr와 문자 좌표, HE706 `23-1`의 같은 줄 LTR 순서를 확인했다. DOM/CSS/bidi 문자를 주입하지 않았다.

대표 화면8개를 직접 열어 글자/캡션/줄바꿈을 확인했다. [NE mobile](checks/browser-screenshots/mobile-ne-919-body.png), [PL desktop](checks/browser-screenshots/desktop-pl-915-body.png), [SR mobile](checks/browser-screenshots/mobile-sr-920-body.png), [SK014 mobile](checks/browser-screenshots/mobile-sk-014-body.png), [HE mobile 표](checks/browser-screenshots/mobile-he-706-rtl-table.png), [FA mobile 표](checks/browser-screenshots/mobile-fa-915-rtl-table.png). 모든 화면 전체를 시각 검수한 것은 아니다. 기존 공통 UI의 전면 현지화도 범위에 넣지 않는다.

이전 B8와 Markdown 차이는 승인 신규42개와 기존SK교정3개뿐이며 전체 2,454원고·정본6·선택42+3·산출물이 검사 전후 동일하다. 이전 배치의 산출물·증거는 변경하지 않았다. 기본packer/Worker는 B8와 같은 SHA이며 capacity 후보를 사용하지 않았다. 이번 작업은 관련 단위검사를 다시 돌리지 않았으며 통합 단계의 최초780/781과 NB보완 후1PASS를 전체 재실행 PASS로 바꾸지 않는다.

- 원고 트리: `1a0cfbb7acf1792606267fdbce72c2b038f20dec4e629f27c18aceefc48cfcde`
- 산출물 트리: `e1c757945cca22bb6965417f895b7804be48358dc71ee4d0ec5066631a6e4fbe`
- 패키지 트리: `a0380745c77751b7047eff6bd6c5a7503be2c5943ccaaacaef763f8528924901`
- [실제 명령·판정](checks/FINAL.json), [종료 스냅샷](checks/snapshot-after.json), [패키지 목록](checks/pack-manifest.json), [시각 검수](checks/visual-review.json)

이 결과는 root의 로컬 릴리스 검토용이다. 공개 watcher의 최근 별도 관측은 21:02KST f66daa9f…/remote35cc5d32…였으며 B9 공개 반영을 뜻하지 않는다. 전체49×286 완성, 전체 목표 용량 입증, 실제 Sites importer/production Worker CPU·native peak 검증이나 인간 원어민·변호사 승인을 주장하지 않는다.
