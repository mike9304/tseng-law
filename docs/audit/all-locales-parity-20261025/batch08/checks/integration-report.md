# B8 local integration handoff — 2026-10-26

B8의 FI/HR/HU/IS/KM/LV/MN 신규 칼럼 42편과 기존 FI704/FI706/IS704 교정 3편을 동결된 승인본 바이트 그대로 R에 통합했다. 실제 영향 테스트 28개 파일·774개 검사와 저장소에 복사한 검사기의 중립 사례 68개가 통과했다. 루트 검토·커밋·빌드 전 단계이며, 이 보고서는 게시 완료를 뜻하지 않는다. 인계 당시 루트 지시상 공개 사이트는 이전 버전이고, B7/B8의 공개 반영을 이 작업에서 새로 주장하지 않는다.

R은 `/Users/son7/Projects/tseng-law-all-locales-20261025`, BASE는 `/Users/son7/tseng-all-language-columns-20261025/batch08`이다. 시작 HEAD `52617670983d522fcf5dd8ed8d7c36ff374a82e5`와 clean 상태를 복사 전에 확인했다. HEAD는 통합 중 유지됐다. 원본 dirty `Projects/tseng-law`, capacity 후보 C, 공유 검사기 설치, B9 및 다른 작업자의 기록은 수정하지 않았다. commit/push/build/deploy를 실행하지 않았다.

변경 범위는 다음과 같다.

- `src/content/columns-{fi,hr,hu,is,km,lv,mn}`의 915/916/918/919/920/921 신규 42파일. 각 언어 최종 저자 manifest와 독립 종결 manifest의 현재 SHA를 모두 대조했다. 필수 지적 미종결 0이며, 7개 저자·독립 보고서와 직접 참조 증거 142개를 해시로 연결했다.
- 기존 FI704/FI706/IS704는 R 시작 SHA를 확인한 뒤 각 승인 치환 한 건을 정확 복사했다. 정방향 치환·역복원과 frontmatter/FAQ 바이트 보존을 검증했다. 새 SHA는 FI704 `5e054633c3f8c2d92ee9404e893a2277255cdcf44b2759ca0bed7c4382f4b172`, FI706 `fe25a6ba9a1a86482f0c46df9ef95fc0b9349385f91a78611763ef01796d76c0`, IS704 `74b7895c6567f66598a847b14ddef5c8359da1ca9b1432f5210754d0b5de9871`이다. 해당 실제 공유 검사 기록은 각각 67/.500, 84/.464, 65/.466이다.
- `tooling/variety/variety_expansion.py`만 설치된 공유본 `c8f5368f…7add82bc`에서 `ea03abaa59249d7d914e1c98a5231a5c1636528dd1ecda326b0d4638edf17975`로 동기화했다. 중립 검사 `run_neutral.py`와 `neutral-fixtures.json` 두 파일도 설치 영수증과 정확히 일치한다. 나머지 production checker 49파일, 임계치와 언어 프로필은 그대로다.
- 테스트 전용 `src/lib/__tests__/native-locale-columns.ts`와 `case-translations-20261026.test.ts`에 7개 언어를 추가했다. 각 사례의 실제 언어 22개, x-default 포함 hreflang 23개, 동일 slug 상호 전환, 원문 날짜, 당일 목록 순서를 검증한다. 운영 runtime/packer/Worker/인프라 변경은 없다.
- 이 B8 감사 묶음. capacity 후보 및 capacity 독립검수 자료는 이번 release audit에 포함하지 않았다.

`integration-readiness-manifest.json`은 42개 최종 원고·7개 저자/독립 종결·3개 기존 교정·설치 영수증을 묶는다. `integration-copy-manifest.json`은 실제 복사 48건의 source/destination SHA를, `integration-source-proof.json`은 최종 45개 원고 SHA와 보존 대조를 담는다. 기존 `src/content` Markdown 2,370개 중 2,367개가 바이트 동일하고 위 3개만 변경됐다. ARC는 49언어 147편을 유지한다. 그중 144개가 동일하고 3개가 승인 교정본이다. 정본 6개, 기존 source/scripts의 나머지 파일, 검사 시점의 입력과 기존 B8 감사 기록 3,120개도 그대로다.

실행 결과와 구분은 다음과 같다.

| 확인 | 결과 | 근거 |
|---|---|---|
| 영향 단위 검사 | 28 files / 774 tests, exit 0 | `integration-unit-execution.json`, 원본 stdout/stderr |
| 복사된 저장소 검사기 | 68/68 neutral, exit 0 | `integration-neutral-execution.json`, `integration-tool-neutral.json` |
| 신규 칼럼 구조 | 42편, 필수 자동 오류 0 | `integration-content-audit-summary.json`; 전체 원본은 BASE에 보존 |
| 메타/FAQ/출처 | 오류 0, FAQ 총 119 | `integration-metadata.json` |
| 현재 원고와 기존 실제 공유 CLI 연결 | 42/42, 현재 파일의 기록된 FAIL 0 | `integration-variety-evidence.json` |
| live source/tool 공백 | tracked 변경 및 untracked 추가 45명령에서 진단 없음 | `integration-whitespace-check.json` |

frontmatter는 실제 파서로 읽었다. 신규 42편은 published/lastmod 2026-10-26, 각 locale audience, 지정 topic·이미지·현지어 alt·정확한 허구장면 caption·FAQ 수를 유지한다. 원문 EN2/ZH4의 2026-10-25 날짜와 공식 source URL 집합을 보존했다. EN 계열 14편에 남은 `/en/contact`는 영어 페이지임을 표시한 실제 현지어 문구를 읽어 확인했다. ZH 계열 28편에는 이 연락 링크를 새로 넣지 않았다. 기존 ARC의 날짜는 FI 2026-10-25, 나머지 B8 6언어 2026-10-26을 유지하며 오늘 날짜로 일괄 덮어쓰지 않았다.

구조 검사에 남은 REQUIRED 의미·공개 출력 검토 항목 225개를 0으로 바꾸지 않았다. 저자·독립 검수 종결은 별도 SHA 체인이고, 빌드·실제 브라우저·원어민 인간·법률 승인·공개 배포 검증을 대신하지 않는다. 총 1,697개 측정 단위를 기존 실제 CLI 증거로 연결했으며 동일 SHA의 전체 CLI를 재실행하지 않았다. 38개는 전체 파일 SHA 일치, 4개는 명시적 본문 또는 측정 추출 연결이다. KM919는 summary-only 본문 동일, MN919/921은 FAQ-only 본문 동일, MN915는 FAQ 및 heading 변경으로 raw body 동일을 주장하지 않고 독립 검수의 측정 추출 동일 증거를 쓴다.

과거 실패와 도구 버전 차이는 보존했다. KM919/921의 개별 OK는 전체 exit 1이었던 초기 배치 기록에서 연결되며 이를 새 exit 0으로 바꾸지 않았다. 당시 c8f 실행은 c8f로 남기고 후속 ea03 추출 호환성 증거와 분리했다. 초기 KM wrapper의 DA profile 해시 기록 오류도 원기록·정정·독립 KM 호환성 근거로 남겼다. 기존 FI 수리의 잘못된 unstripped 수동 배열과 도구 설치 시 `--report` 누락 exit 2 역시 보존돼 있다.

이번 통합 준비에서 `src/scripts` 전체 Markdown을 2,370개로 가정한 guard가 한 번 멈췄다. scripts의 두 문서를 포함하면 2,372개이고 `src/content`만 2,370개인 점을 분리했다. R에 쓰기 전에 멈춘 초기 코드와 오류는 `integration-prepare-initial-error.json`에 있다. 공백 감사 wrapper는 `git diff --no-index`의 exit 1을 오류로 해석해 한 번 멈췄다. 중립 재현에서 내용 차이 exit 1, 공백 진단 동반 exit 3을 확인하고 종료값과 실제 진단을 함께 판정하도록 고쳤다. 최초 실험의 잘못된 exit 기대값도 `integration-whitespace-exit-repro.json`에 보존했다. `integration-package-initial-error.json`의 이전 산출물 해시는 유지한 채 공백 검사만 재개했으며 unit/neutral 전체를 반복하지 않았다.

stderr에는 React `fetchPriority` 3건과 `inert` 1건 경고가 있다. 같은 경고 문구가 B7 원본 테스트 로그에도 있음을 대조했다. 기존 component 코드를 이 통합에서 고치지 않았다. raw 감사 기록 5개에는 patch 문맥 공백·기존 기록의 trailing/EOF 공백 진단이 있으며 바이트를 정리하지 않았다. 이 진단은 live 코드/원고 검사 결과와 별도로 남겼다. no-index의 정상 차이 exit 1도 영수증에서 0으로 변환하지 않았다.

현재 수량은 같은 file-backed loader/audience 정책으로 집계했다. 기준은 계속 각 언어 286편이며 zh-hant 296편의 초과분으로 다른 언어 부족을 상쇄하지 않는다.

| 항목 | 통합 전 | 통합 후 |
|---|---:|---:|
| 전문 칼럼 | 2,235 | 2,277 |
| 해당 언어 목록 노출 | 1,968 | 2,010 |
| 전문 칼럼 부족분 | 11,789 | 11,747 |
| 목록 노출 부족분 | 12,056 | 12,014 |
| 별도 이슈 칼럼 | 131 | 131 |

B8의 각 언어는 24→30편, 목록 노출 19→25편으로 증가했다. 각 언어 전문 부족분은 256편, 목록 노출 부족분은 261편이다. 다른 42언어 수량과 숨긴 기존 slug 목록은 변하지 않았다. `integration-count-reconciliation.json` 및 `integration-r-inventory.md`에 49언어 현재 값이 있다. 전체 원본 inventory 두 개는 BASE에 보존하고 감사 copy manifest로 해시를 색인한다. 42 added / 3 changed / 0 removed와 YAML·중복 slug·빈 본문·제목 누락 0을 확인했다. 별도 loader 밖의 옛 semiconductor draft 4개는 2,412개 전체 Markdown에는 포함되지만 전문·이슈 수량에는 포함하지 않는다. CMS overlay나 실제 배포 HTML 수량으로 해석하면 안 된다.

검토할 diff는 `integration-source-and-tool.patch`(기존 3수리·테스트2·checker 및 중립 파일)와 `integration-new-articles.patch`(신규 42편)이다. 감사 복사 정책은 `integration-audit-selection.py`, 실행은 `integration-copy-audit.py`에 있다. 최종 저자/독립 체인·실제 CLI·구조 요약·실행 로그·재현 코드를 복사하고 큰 raw corpus, 전수 inventory 및 초기 자료는 BASE에 그대로 보존한다. `integration-audit-copy-manifest.json`이 복사·외부 보존 경로/크기/SHA를 모두 구분한다. 일부 재현 코드와 과거 기록은 BASE 절대 경로에 의존하므로 repository audit만으로 모든 raw 증거가 이식 가능하다고 주장하지 않는다.

최종 `integration-ready-freeze.json`은 이 보고서, 전체 입력·출력 연결, 최종 source/tool SHA, audit copy 일치 및 HEAD를 다시 확인하는 인계 영수증이다. 루트의 검토·커밋·정적 빌드·실제 렌더링/공개 확인은 이후 별도 단계다. 49×286 전체 완료나 capacity 해결로 판정하지 않는다.
