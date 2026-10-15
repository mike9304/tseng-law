# 625–628 교통 가상사례 게시 전 검증

상태: 원고·미디어 통합 및 로컬 검증 PASS. main push와 공개 후 검증 예정. 검수일: 2026-10-15. 최종 검수: Codex.

원고 작성·독립 대조·최종 미디어 확인·사이트 통합 검증을 구분해 기록합니다. 최종 Codex는 본문 8개와 실제 영상 추출 프레임·포스터·대표 페이지 화면을 직접 읽고 확인했습니다. 세부 증빙의 로컬 기준 경로는 `/Users/son7/tseng-traffic-action-next-20261015/`입니다. 배포 후 검증은 해당 경로의 `VERIFICATION.md`와 `qa/verification-state.json`에 이어 기록합니다.

## 대상과 미디어의 범위

625–628에 한국어·대만 번체중문 각 1편씩, 총 8편을 연결합니다. ID·slug는 root가 원격 main과 로컬 최대 ID 624를 확인한 뒤 배정했습니다. 아래 길이는 `root-qa/final-assembly-decisions.json`의 2026-10-15T12:28:00.900213+00:00 기록과 일치합니다. 네 영상의 `ACCEPTED_FOR_INTEGRATION`은 저장소 통합을 허용한 상태이며 공개 완료가 아닙니다.

| ID | 사례와 slug | 최종 길이 | 설명에 남긴 관찰 한계 |
|---|---|---:|---|
| 625 / N1 | 무신호 회전교차로 / `taiwan-unsignalized-roundabout-entry-collision` | 20.25초 | 한 번의 전면–측면 접촉과 맞닿은 정지. 명확한 새 손상·강한 반동·분리를 확인했다고 쓰지 않음. |
| 626 / N2 | 적색신호 직진 충돌 / `taiwan-red-signal-straight-stop-line-collision` | 21.25초 | 자기 방향 적색과 정지선 통과를 연속 대조. 접촉은 앞모서리 부근이며 파랑 후드의 들린 형상은 접촉 전부터 존재. 먼 정지선의 전폭 배치 등 생성 시설의 한계가 남음. |
| 627 / N3 | 일방통행 역방향 접근 / `taiwan-oneway-wrongway-head-on-collision` | 19.5초 | 전면 접촉·후드 변형 지속·맞닿은 정지. 진입금지 표지를 통과한 장면은 채택되지 않았고, 강한 반동·분리·운전자 고의는 확인하지 않음. |
| 628 / N4 | 주차차량 충돌 / `taiwan-parked-car-collision-external-video-evidence` | 22.75초 | 한 번의 코너 접촉·주차차량 밀림·흰 차 전면 국부 변형. 차내 휴대전화 화면 조작은 별도로 생성한 삽입이며, 주행 중 사용·실제 인과·메시지 내용과 전송을 입증하지 않음. |

제작은 이미지 생성 도구로 기준 이미지를 만든 뒤 Grok CLI의 `grok-4.7` director가 `reference_to_video`를 호출한 흐름입니다. 영상 backend 모델명은 노출되지 않았으므로 “Grok 4.7 영상 엔진”으로 인증하지 않습니다. 프롬프트·생성 원본·receipt·부모 이미지/파생 프레임의 관계는 각 제작 폴더에 보존했습니다. 근거: `n1-roundabout/provenance.json`, `n1-roundabout/handoff.json`, `n2-red-signal/qa/n2-core-d-generation.json`, `n3-oneway/qa/n3-core-a02-generation.json`, `n4-parked-car/qa/final-lineage-and-call-audit.json`.

영상은 독립적으로 생성한 시점과 시간 생략을 연결한 AI 가상 설명 자료입니다. 동일한 실제 주행의 동기화된 다중 카메라 기록으로 취급하지 않습니다. 시점 사이 차량 세부·노면의 차이가 남으며, 실제 사고·판결·속도·충격량·신체손상·과실비율을 재구성한 결과가 아닙니다. 초기 45–60초 목표를 달성했다고 기록하지 않습니다. 선택된 길이는 위 표와 같습니다. 공개 미디어의 AI 고지는 유지하고 내부 `author: legal-ai-assistant`와 공개 작성자 표시를 구분합니다. 공개 AI 이름·프로필·푸터를 추가하지 않습니다.

최종 미디어 근거는 `selections/N1.json`–`N4.json` 및 `root-qa/final-assembly-decisions.json`입니다. N1/N3는 각각 `root-qa/n1-rendered-review/REVIEW.md`, `root-qa/n3-rendered-review/REVIEW.md`, N4는 `root-qa/n4-rendered-review/final-review.md`에 연결됩니다. N2도 `root-qa/n2-rendered-review/REVIEW.md`에서 최종 양언어 PASS입니다. 네 편 모두 실제 1배속 끝 재생과 구간 이동을 확인했습니다.

## 공식 법령과 보존한 조건

각 작성자와 독립 검수자가 2026-10-15 공식 현행 조문을 열어 대조한 기록을 취합했습니다. 각 본문의 인라인 링크와 말미 목록은 두 언어가 같은 고유 URL 집합을 갖습니다(N1 5개, N2 6개, N3 6개, N4 7개). 근거: `articles-n1-n3/qa/SOURCES.md`, `articles-n2/qa/SOURCES.md`, `articles-n4/qa/SOURCES.md`와 아래 독립 검수 기록입니다.

| 대상 | 공식 1차 출처 | 빠뜨리지 않은 법적 조건·예외 |
|---|---|---|
| N1 | [道路交通安全規則 102](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=102), [93](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=93) | 제102조 제1항 제9호의 무신호 회전교차로·이미 진입한 차량에 대한 양보. 제10호 다차로 조건을 단일 차로 사례와 구별. 신호·지휘가 함께 있으면 지휘 우선, 특별 표지·표시 고려. 제93조 제1항 제2호의 감속·서행과 정지 준비. |
| N2 | [標誌標線號誌設置規則 170](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040014&flno=170), [206](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040014&flno=206), [安全規則 102](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=102) | 정지선 기준은 차체 앞쪽 돌출부를 포함. 적색은 정지선 통과·교차로 진입 금지이며 동시 녹색 화살표는 해당 방향만 허용. 녹색도 다른 금지·지시를 전제로 하며 교통지휘 우선. 충돌 뒤 신호색만으로 진입 때 신호를 확정하지 않음. |
| N3 | [標誌標線號誌設置規則 63](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040014&flno=63), [安全規則 96](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=96), [90](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=90) | 표지의 지정 방향과 실제 접근 경로 대조. 제96조의 快車道 및 가장자리선 제한을 보존. 起駛·準備停車·臨時停車 예외는 가장자리선 밖 진행에 관한 것이며 역방향 주행을 일반 허용하지 않음. 당시 임시 통제 자료도 확인 대상으로 둠. |
| N4 | [安全規則 90](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=90), [휴대전화 실시방법 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040036&flno=2), [處罰條例 3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=3), [安全規則 112](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=112) | 운전 중 손에 든 사용 금지와 표시장치 규정을 구분. 제90조 제2항의 임무상 필요·다른 법령 허용 예외는 제1항 제3호에 한정. 실시방법의 주차/법률상 임시정차 및 안정된 정지 조건을 보존. 임시정차는 승하차·상하차 목적, 3분 미만, 즉시 주행 가능 상태를 함께 요구. 구획 안에 있다는 이유만으로 적법 주차를 확정하지 않음. |

네 글 모두 [安全規則 제94조 제3항](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=94)의 전방·병행 간격 주의와 필요한 안전조치를 보존합니다. [민법 제184조 제1항](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=184)의 책임 요건을 사실자료와 대조하며, [제217조 제1항](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=217)은 피해자 과실의 손해 발생·확대 기여를 조건으로 법원이 감액하거나 면제할 수 있다는 뜻까지 유지합니다. 고정 벌금·과실비율·자동 면책을 추가하지 않았습니다.

## 문체·첫 두 문단·다양성 검수

적용 정본은 저장소 `docs/columns/EDITORIAL-VOICE.md`, `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, `/Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md`, `LESSONS.md`입니다. 홈 공통 문서가 없음을 확인한 뒤 최신 사용자 지시가 반영된 저장소 사본을 사용한 기록이 있습니다. 한국어 합니다체, 대만 번체 용어, 굵은 강조 금지, 가공 상담·사례·변호사 경험 금지, 법적 조건·인용·미디어 AI 고지 보존을 점검했습니다. 실제 변호사·원어민·사람 검수 완료를 뜻하지 않습니다.

| 대상 | 완료된 원고 검수 근거 | 기록된 variety 결과 |
|---|---|---|
| N1/N3 4편 | `articles-n1-n3/qa/EDITORIAL-REVIEW.md`, `root-qa/articles-n1-n3-review/REVIEW.md` | 현재 네 본문 모두 FAIL 0. 독립 재실행 기록 있음. |
| N2 2편 | `articles-n2/qa/EDITORIAL-REVIEW.md`, `root-qa/articles-n2-n4-review/N2-REVIEW.md` | 현재 두 본문 모두 FAIL 0. 독립 재실행 기록 있음. |
| N4 최신 2편 | `articles-n4/qa/CABIN-B-REVISION.md`, `articles-n4/qa/EDITORIAL-REVIEW.md`, `articles-n4/qa/variety-results.json`, `root-qa/final-article-checks.json` | 차내 삽입 수정 뒤 두 본문 FAIL 0 및 규칙 5절 재점검. root가 최신 본문을 수용. 이전 독립 `root-qa/articles-n2-n4-review/N4-REVIEW.md`의 PASS는 수정 전 바이트에만 적용. |

한국어의 ‘니다.’ 비중 경고(N1 83%, N2 86%, N3 93%, 최신 N4 87%)는 WARN이며 FAIL이 아닙니다. 요청된 합니다체를 유지하면서 문장 기능·길이·시작말·인용 위치를 읽어 확인한 기록이 있습니다. 각 `qa/EDITORIAL-REVIEW.md`에 규칙 5절 9개 항목과 실제 수정표가 있고, `opening-deletion-tests.json`에는 첫 두 문단의 문장별 삭제 시험과 유지 이유가 남아 있습니다. 통합된 최종 8개 파일에서도 지정 variety CLI를 재실행해 FAIL 0을 확인했습니다(`qa/integrated-variety.json`).

`integration-prep/OPENING-INPUTS.json`과 `OPENING-COMPARISON.md`는 기존 621–624 및 이번 8편의 실제 첫 두 문단·SHA를 읽기 전용으로 대조한 보충 기록입니다. 같은 날짜의 초 단위 게시 시각은 확정하지 않고 배정 순서에 따른 직전 세 편을 비교했습니다.

| 새 글의 양언어 도입 | 같은 언어 직전 세 편 | 비교 결과 |
|---|---|---|
| 625: 접촉 사진 한 장으로 진입 순서를 판단하는 한계 | 624·623·622 | 장면형·규칙형·우측차 질문과 구별. 두 번째 문단이 선진입/진입 경로와 접촉 범위를 보완. |
| 626: 충돌 뒤 적색에서 진입 때 신호를 추정하는 질문 | 625·624·623 | 시간 관계가 쟁점이며 뒤 문단에서 각 차량의 신호와 접촉을 구체화. |
| 627: 일방통행 표지의 방향과 실제 접근 경로 | 626·625·624 | 규칙형 도입. 주차 목적을 영상에 없는 주장으로 먼저 부여하던 도입을 제거. |
| 628: 충돌 뒤 밀림에서 충돌 전 출발을 추정하는 질문 | 627·626·625 | N2와 질문 구조가 비슷함을 기록. 서로 다른 사실 쟁점이고 N3가 사이에 있어 root가 두 질문을 유지하기로 판단. |

범용 예고·가공 상담 도입은 확인되지 않았습니다. 두 번째 문단들의 AI 사례 고지는 필요한 사실 표시로 유지했습니다. N4 차내 수정은 첫 두 문단을 바꾸지 않았으며 비교 기록의 SHA만 최신 본문에 맞췄습니다. root의 유지 판단은 `root-qa/final-article-checks.json`의 `openingComparison`에 있습니다.

## 실제 수정 사례와 의미 보존

아래는 제안만 한 문구가 아니라 기존 검수 기록과 현재 본문을 대조한 채택 사례 3건입니다.

| 문제 문장 | 이유 | 채택된 수정 | 의미 보존·근거 |
|---|---|---|---|
| N3 KO “출발하거나 주차·임시주차를 준비하는 경우” | 제96조의 臨時停車까지 ‘준비’로 묶으면 예외 범위가 달라짐. | “출발·주차 준비·임시주차의 경우” | 起駛·準備停車·臨時停車를 각각 보존. 가장자리선 예외의 범위를 넓히지 않음. `articles-n1-n3/qa/EDITORIAL-REVIEW.md`, 현재 `articles-n1-n3/N3.ko.md` 제96조 문단. |
| N3 KO “생성 영상의 고정된 외부 시점”, ZH “生成影片採固定外部視角” | 별도 접근 시점이 포함되어 전체 영상이 고정 외부 시점이라는 표현은 넓음. | KO “충돌 장면의 고정된 외부 시점”, ZH “碰撞片段採固定外部視角” | 운전석 시야를 대신할 수 없다는 한계는 유지하고 적용 구간만 좁힘. `articles-n1-n3/qa/EDITORIAL-REVIEW.md`, `root-qa/articles-n1-n3-review/scope-revision.json`, 현재 두 `N3` 본문. |
| N4 KO “주행 중 휴대전화를 손에 들고 메시지를 조작했다는 설정”, ZH “在行駛中手持手機操作訊息” | 차내 B가 추가되었지만 화면 내용·전송은 확인하지 못함. 외부 영상의 증명 한계와 별도 삽입을 함께 설명할 필요. | KO “별도로 생성한 차내 장면은 손에 든 휴대전화의 화면 조작을 표현합니다. 주행 중 사용은 가상 설정입니다.” ZH “另行生成的車內片段，呈現手持手機操作螢幕的動作。行駛中使用是虛構設定。” | 같은 주행의 연속 촬영이 아니며 실제 사용·인과를 입증하지 못한다는 뒤 문장과 법률상 금지·예외를 보존. `articles-n4/qa/before-cabin-b/N4.*.md`, `articles-n4/qa/CABIN-B-REVISION.md`, `articles-n4/qa/cabin-b-revision.json`, 현재 두 `N4` 본문. |

## 본문 바이트와 최신 N4 변경

다음 8개 원고의 SHA-256을 다시 계산하고 통합 본문과 대조했습니다. 이는 원고 바이트 확인이며 영상 source SHA 또는 공개 복사본 검증을 대신하지 않습니다.

| 파일 | SHA-256 |
|---|---|
| `articles-n1-n3/N1.ko.md` | `969ce43b4215e85db09be868f0180388568ab3d5810d162474ae7bdabe8fe3b1` |
| `articles-n1-n3/N1.zh-hant.md` | `6c5aa6d3f335ffd39a16f0332623144c99ab164467625a74ad820512587a2432` |
| `articles-n2/N2.ko.md` | `192b124f8abe3dd123830994c49d3bd4ac6562175b2067e1434df1c61636f493` |
| `articles-n2/N2.zh-hant.md` | `09f2c7e33be8ecbd432a9a597b055b018239957777b265386a37b01277783a12` |
| `articles-n1-n3/N3.ko.md` | `eb17f7af33de324d9bbaf3f1cc7e4a3df11f0e951f7e21123639e4d6cfe5fb6b` |
| `articles-n1-n3/N3.zh-hant.md` | `15533635655192ddd4515eb02be715965d2d30e3749449a675ebd56bf70c6d37` |
| `articles-n4/N4.ko.md` | `89f40b8604bcbf9a8c5bbb697fb43e5833d622d4eebee10b25bfb8143e3688bf` |
| `articles-n4/N4.zh-hant.md` | `34f29d33c3a45cf6a1819818621d9cd718dc1dd7eec1afd444ee5da4c7013f4d` |

N4는 휴대전화 설명 한 문단과 메타데이터의 요약·FAQ 1·caption 등을 좁게 보완했습니다. 법률 문단·7개 출처·FAQ 2/3·도입·맺음은 유지한 기록이 있습니다. 최신 metadata SHA는 KO `44407eb58609bd0419f37cad05240e7b438b7b98d5d0279aaca30fcb7949b94b`, ZH `f159a7206b5ce1804da234dbefea7edeb949e59576f90aefcc28c07dd37a669a`이며 `articles-n4/qa/cabin-b-revision.json`과 `integration-prep/N4-INPUT-REVISION.json`에 연결됩니다. root의 최신 본문 수용은 `root-qa/final-article-checks.json`에 별도로 기록되어 있습니다.

## 최종 통합·실행 결과

| 검증 | 결과와 근거 |
|---|---|
| 원고·미디어 통합 | 8개 본문 원본 바이트 보존, 8 MP4·8 JPG·4 WebP 연결. `integration-prep/execution/final-media-manifest.json`. 아래 동봉 매니페스트에 게시 대상 SHA를 기록. |
| 기존 미디어 보존 | 기존 4개 registry SHA가 통합 전후 동일. 새 registry만 추가하고 기존 항목을 덮어쓰지 않음. |
| 선택과 실제 파일 | source·selection·final MP4·cover SHA 대조, 실제 ffprobe 24fps/1280×720/H.264/무음/프레임 수와 길이 일치. 모든 전체 디코드 정상. 대표 cover와 video poster는 별개 역할로 검증. |
| 문체 | 최종 8개 파일 variety FAIL 0. 규칙 5절 직접 점검과 도입 비교 기록을 함께 확인. |
| 관련 테스트 | 12개 파일 415개 테스트 범위 통과. 최초 게시판의 두 기대값이 이전 글 수53으로 남아 실패했고, 새4개 링크와57개 기대값으로 갱신한 해당 파일9개를 재실행해 PASS. `qa/targeted-tests.log`, `qa/traffic-board-retest.log`. |
| lint·타입 | 전체 src lint와 typecheck PASS. 마지막 수정한 SSR 테스트 파일 lint도 별도 PASS. 생성된 next-env 경로 변경은 원래대로 복원. |
| 정적 빌드 | 2,264페이지 crawl, 2,456 HTML, 사이트맵2,259개. broken refs·oversize·crawl missing·Flight errors 모두0. `qa/static-site-report.json`. |
| 기존 누락 경고 | 기존 선택 미디어5개: `images/004-taiwan-employment-contract-guide/featured-01.jpg`, `images/hover.jpg`, `images/video-poster.jpg`, `videos/builder-background.mp4`, `videos/intro.mp4`. 새20개 미디어 파일과 무관하며 이 변경에서 만들지 않은 경고. |
| Sites 묶음 | 159,203,877bytes, 256MiB 한도 이하. `qa/sites-pack.log`. 묶음 생성만 했으며 직접 Sites 게시 없음. |
| 로컬 페이지 브라우저 | 25검사 PASS/오류0: 8개 글×390/1440폭16회, 게시판·검색 실제 클릭8회, 사이트맵1회. H1·canonical·공식출처·굵은강조 없음·이미지·재생·seek·끝도달·가로넘침 없음·API 요청 없음 확인. `qa/static-browser/results.json`(2026-10-15T12:32:43.792Z). |
| 시각 대조 | 네 글 각각 KO 모바일 및 ZH 데스크톱 대표 화면8장을 root가 직접 열람. 제목·표지·영상·가상 고지·본문이 정상 표시. |
| 배포 경로 | 기존 main→MacBook Air 자동 배포기만 사용. `build-info.json`의 목표 commit과 공개 미디어20개 SHA/MIME/MP4 Range, 공개 브라우저25검사는 push 뒤 확인할 예정. |

로컬 빌드는 저장소 fallback 데이터로 실행했으며 Air는 자체 `prod-mirror`를 사용합니다. 따라서 로컬 검증으로 공개 셸이나 게시 완료를 대신하지 않습니다. 공개 URL의 본문 SHA는 이번 로컬 브라우저 결과와 다시 대조합니다. 이미지·영상의 모델 생성 오류로 제외한 후보는 게시하지 않았고, 원본·receipt·검수 기록은 별도로 보존합니다. 원음은 청취·의미 검수하지 않았으며 공개 파일은 무음입니다.

게시 대상의 정확한 파일 SHA·미디어 길이·source 구간은 [동봉 매니페스트](traffic-action-next-625-628-20261015-manifest.json)에 있습니다. 사용자 승인 범위에 따라 최종 Codex가 검수했으며, 실제 변호사나 사람 원어민의 검수를 받았다고 표시하지 않습니다.
