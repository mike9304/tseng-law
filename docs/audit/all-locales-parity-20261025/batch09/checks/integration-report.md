# B9 local integration handoff — 2026-10-26

NB/NE/PL/RO/SK/SL/SR의 동결 원고 42편과 기존 SK014/877/878 교정 3편을 승인된 바이트 그대로 R에 통합했다. 저장소에 복사한 실제 검사기로 45편 모두 exit 0/FAIL 0을 확인했다. 영향 테스트는 최초 28 suites 중 27개·780 tests가 통과했고, 유일한 NB 캡션 기대값을 정확 6파일에 한정해 보완한 뒤 해당 1 test가 통과했다. 최초 배치의 exit 1은 그대로 보존했다. 현재 검증 범위는 28 suites·781 tests이며, 단일 전수 배치를 다시 돌려 exit 0을 얻었다는 뜻은 아니다.

R은 `/Users/son7/Projects/tseng-law-all-locales-20261025`, BASE는 `/Users/son7/tseng-all-language-columns-20261025/batch09`이다. 시작 clean HEAD `35cc5d32cb5a4394d674f1f767b5f32eedd5cee7`를 확인했고 HEAD는 유지됐다. 원본 dirty worktree, C, 공유 설치, 다른 배치·작업자의 파일을 변경하지 않았다. commit/push/build/deploy는 하지 않았으며 공개 B7/B8/B9 반영 여부를 이 작업에서 새로 확인하지 않았다.

변경 범위는 다음과 같다.

- 신규 42편은 915/916/918/919/920/921 각 7언어다. 현재 6원고씩을 최종 저자·독립 종결 SHA와 연결했고 필수 미종결은 0이다. PL R4의 선택 문체 의견 S-R4-01(양보 접속어)은 미채택 선택 항목으로 유지한다. 선택까지 전부 0이라고 기록하지 않는다.
- 기존 SK014/877/878은 시작 R SHA를 확인한 뒤 정확 8치환과 역복원, frontmatter·FAQ 바이트 보존을 검증하고 승인 사본만 복사했다. 독립 검수자는 별도 manifest를 만들지 않았으므로 `reviews/sk-existing-independent.md`의 SHA와 내장 JSON 영수증을 연결했다. 새 SHA는 014 `631c8e1ba003b6bc0268a09e76e67af95fea57384be4826484850c3399a68ef6`, 877 `60638adf443098093688db12bb8be6374d858783382548fb91afd5a0e963d911`, 878 `f9998228d7d54128519262cc1884a86e8d62906e66db27189b515c9cba7d9da2`다. 실제 현재 검사는 각각 126/.452, 51/.479, 54/.464였다. 014의 기존 metadata 형식과 기존 글의 FAQ 4+3+3을 신규 계약으로 덮어쓰지 않았다.
- 검사기 mirror는 승인 설치 3단계(SK 월명 → PL 지도 → SK/TR 숫자 날짜)를 before/after SHA로 순서대로 연결했다. 기존 파일 8개와 신규 9개, 총 17파일만 복사했다. CS 미설치 후보는 포함하지 않았다. 45개 확장 profile은 현재 설치본과 일치하며, 기존 CS profile은 R 시작 바이트와 같다.
- 테스트 전용 registry/helper와 case test에 7언어를 추가했다. 사례별 실제 언어 29개와 x-default 포함 hreflang 30개, 동일 slug 전환을 확인한다. NB/PL/RO ARC는 10월 25일, NE/SK/SL/SR ARC는 10월 26일을 유지했다. caption test는 B9 BRIEF의 `Fiktiv scene`을 정확 NB 6파일에만 기대한다. 나머지 NB의 `Oppdiktet scene` 기대값은 유지한다.
- PL 자동 탐색용 문장 지도 6개와 이 B9 감사 묶음이다. 운영 runtime/packer/Worker/인프라 변경은 없다.

PL 지도는 원본 6개, 원승인 2개, 근거를 포함한 14개 원자료를 `boundaries/pl/originals`에 바이트 그대로 보존했다. 별도 상대 경로 승인 사본 2개에서는 evidence 경로만, 자동 탐색 지도 6개에서는 approval 경로·해시만 다시 연결했다. source SHA·문단 SHA·전체 233문장·검수자·판정 내용은 그대로다. 원승인 기록을 고치거나 새 인간 승인을 만든 것이 아니다. 실제 R 파일 CLI는 `--sentences` 없이 지도를 자동 탐색했다. 실제 검증에 필요한 20개 파일(원고 6개 포함)을 독립 임시 트리로 복사한 검증에서도 6지도·233문장이 탐색됐다. 이 검증은 artifact 경로 묶음의 이식성을 뜻하며 검사기 코드는 R에서 읽었으므로 다른 기계의 완전 독립 설치 검증으로 확대하지 않는다.

| 확인 | 실제 결과 | 근거 |
|---|---|---|
| 최초 영향 단위 검사 | 27/28 suites, 780/781 tests, exit 1 | `integration-unit-execution.json`, 원본 stdout/stderr |
| NB 기대값 보완 후 영향 suite | 1/1 suite, 1/1 test, exit 0 | `integration-caption-r2-execution.json` |
| 복사된 checker unit | 88/88, exit 0 | `integration-checker-execution.json` |
| 복사된 checker neutral | 68/68, exit 0 | `integration-neutral-execution.json` |
| 실제 R 원고 CLI | 45편 exit 0, FAIL 0, 1,944단위 | `integration-variety.json` |
| 신규 구조/메타 | 42편 오류 0, FAQ 119 | `integration-content-audit-summary.json`, `integration-metadata.json` |
| live source/tool 공백 | 52명령, 진단 없음 | `integration-whitespace-check.json` |

신규 42편의 published/lastmod는 2026-10-26이며 EN2/ZH4 정본의 2026-10-25 날짜는 그대로다. 실제 frontmatter 파싱으로 제목·요약·topic·audience·이미지·caption·FAQ·공식 URL 집합을 대조했다. 915/916의 각 7편에는 `/en/contact`가 영어 페이지임을 현지어로 명시했고, 다른 28편에는 이 링크를 새로 넣지 않았다. 구조 검사 REQUIRED 224개는 의미·공개 출력 검토 항목으로 남겼다. 독립 검수 종결 및 FAIL 0은 원어민 인간·법률 승인이나 실제 브라우저·배포 검증이 아니다. 이번 통합에서 1,944개 문장을 새로 의미 재검수했다고 주장하지 않는다. 동일 원고의 저자/독립 종결과 실제 새 검사 배열을 연결했다.

`integration-readiness-manifest.json`은 7개 최종 체인과 직접 증거 217개, canonical6, 기존 3수리와 설치 3영수증을 묶는다. `integration-copy-manifest.json`은 원고/도구 실제 복사 62건의 SHA다. `integration-source-proof-r2.json`은 tracked 18,799개 중 변경 14개·불변 18,785개, 기존 Markdown 2,412개 중 승인 교정 3개·불변 2,409개를 확인한다. 모든 ARC 49언어 147편, 정본 6개, 기존 B9 원고·감사 기록 9,287개가 그대로다. 파일 추가 42, 기존 변경 3, 제거 0이며 숨겨진 기존 목록과 이슈 수량도 유지했다.

설치 전 R은 FI/HU 단계였으므로 PL 설치 직전 SHA와 직접 맞추려던 최초 guard가 R 쓰기 전에 멈췄다. 이 오류·원코드는 `integration-prepare-initial-error.json`에 보존했다. 이후 누락돼 있던 SK 월명 단계부터 세 영수증을 연결했다. 과거 외부 입력 참조 22건의 현재 SHA 차이는 LESSONS와 검사기 5경로의 승인 버전 변화로 구분했고, 과거 기록의 해시를 현재 값으로 바꾸지 않았다. 통합 시 LESSONS 19:05 전문 SHA `56120b79d5f6a483f760f2a470dab7753ca7d14d1c727ce8e8bbd721da773f97`를 읽었다. 홈 공통 editorial 파일은 부재를 기록하고 저장소 정본 및 공유 규칙을 적용했다.

원본 로그의 React `fetchPriority` 3건·`inert` 1건 경고는 B8 로그에도 같은 문구가 있다. NB 캡션 최초 실패, 기존 CLI 실패·교정 기록, 원본 Kimi 로그·영수증은 바꾸지 않았다. raw 감사 자료 6개에는 patch 문맥·기존 로그·EOF 공백 진단이 있으며 live 코드와 분리해 보존했다. `git diff --no-index`의 내용 차이 exit 1을 PASS로 변환하지 않고, 진단 없는 exit 0/1만 정상으로 해석했다.

| file-backed 수량 | 통합 전 | 통합 후 |
|---|---:|---:|
| 전문 칼럼 | 2,277 | 2,319 |
| 해당 언어 목록 노출 | 2,010 | 2,052 |
| 전문 칼럼 부족분 | 11,747 | 11,705 |
| 목록 노출 부족분 | 12,014 | 11,972 |
| 별도 이슈 | 131 | 131 |

각 locale 기준은 286편이다. PL은 전문 32/목록 27편(부족 254/259), 다른 B9 6언어는 30/25편(부족 256/261)이다. 다른 언어의 초과분으로 부족을 상쇄하지 않는다. `integration-r-inventory.md`와 `integration-count-reconciliation-r2.json`에 49언어 수량이 있다. CMS overlay·현재 공개 HTML 수량으로 해석하지 않는다.

루트가 볼 변경은 `integration-source-and-tool.patch`(기존 3수리·테스트 3개·검사기 17파일)와 `integration-new-articles.patch`(신규 42편)다. `integration-audit-copy-manifest.json`은 복사한 최종 체인과 BASE에 그대로 둔 raw corpus·전수 inventory·기타 원기록을 모두 경로/크기/SHA로 구분한다. PL 실제 사용 경로는 상대 경로로 재연결했지만 역사 기록·재현 스크립트는 BASE 절대 경로를 유지하므로 전체 감사 원자료가 완전 이식 가능하다고 주장하지 않는다.

`integration-ready-freeze.json`은 최종 source/tool/test SHA, 원자료 불변, diff, audit copy 및 HEAD를 다시 확인한 인계 영수증이다. 이후 루트의 검토·커밋·빌드·브라우저·공개 확인이 필요하다. capacity 후보는 미포함이고 49×286 전체 목표는 미완료다.
