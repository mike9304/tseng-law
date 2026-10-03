# C8 통합 파일·미디어 최종 게이트

검수일: 2026-10-04, KST
검수자: Codex / Astra fallback 최종 게이트
대상: 189번 칼럼, `taiwan-road-rage-driver-stopped-route-66s-fast-lane`, ko / ja / en / zh-hant

사용자가 지정한 다섯 가지 게시 전 검사 항목을 통과했습니다. 이번 검수에서 칼럼·레지스트리·미디어를 수정하지 않았습니다. 필수 수정 사항은 없습니다.

## 범위와 적용 기준

- `brief-SERIES.md`, `brief-EDITORIAL-VOICE.md`, 저장소 `AGENTS.md` 및 `docs/columns/EDITORIAL-VOICE.md`를 읽었습니다.
- 홈 정본 `~/agent-library/knowledge/editorial-voice.md`는 없습니다. 지정된 브리프와 저장소 사본 전문을 읽었습니다. 저장소 사본에는 공개 AI 작성자 표시를 제거하라는 별도 지침이 있지만, 이번 사용자의 명시적 요구인 AI 작성 고지 유지와 시리즈 규칙을 우선했습니다.
- `fable-orchestration-legacy`, `verification-before-completion`의 근거 확인 원칙을 적용했습니다. 사용자의 최신 지시에 따라 Codex가 직접 판정했습니다. Fable 검수, 변호사 검수, 사람 원어민 검수를 했다고 주장하지 않습니다.
- 네 저장소 Markdown 파일 전체와 `src/data/column-generated-videos.ts:616–659`의 해당 슬러그 네 항목을 읽었습니다. 전용 Read 도구 대신 shell의 `cat` / `nl` / `sed`로 읽었습니다.
- 기존 여섯 검수 로그의 판정·지적·수정 결과와 검수본 해시를 확인했습니다. `cases/cases-manifest.json`의 C8 및 `cases/jud/19.txt` 판결·첨부 공소장 전체를 대조했습니다.
- 게시용 1600×900 WebP, 제공된 15장 프레임 시트, KO/EN 포스터를 이미지 뷰어로 직접 보았습니다. 추가로 게시용 JA/ZH 포스터와 EN 게시 MP4에서 추출한 원본 해상도 프레임 15장도 직접 보았습니다.

검수한 저장소 파일:

- `src/content/columns/189-taiwan-road-rage-driver-stopped-route-66s-fast-lane.md`
- `src/content/columns-ja/189-taiwan-road-rage-driver-stopped-route-66s-fast-lane.md`
- `src/content/columns-en/189-taiwan-road-rage-driver-stopped-route-66s-fast-lane.md`
- `src/content/columns-zh/189-taiwan-road-rage-driver-stopped-route-66s-fast-lane.md`

위 경로의 저장소 루트는 `/Users/son7/Projects/tseng-law-roadrage-20261003`입니다.

## 1. 프런트매터와 게시일 — PASS

`js-yaml`로 네 파일의 YAML을 실제 파싱했습니다. 중복 키나 구문 오류가 없으며 아래 항목을 자동 검사하고 원문과 대조했습니다.

| 항목 | 결과 |
|---|---|
| author | 네 파일 모두 `legal-ai-assistant` |
| published / lastmod | 네 파일 모두 `2026-10-04` |
| date_display | KO `2026년 10월 4일`, JA/ZH `2026年10月4日`, EN `October 4, 2026`; 모두 같은 게시일 |
| traffic-accidents 태그 | 네 파일 모두 포함 |
| title / H1 | 각 파일에서 유일한 H1과 title이 정확히 일치 |
| TBD / IMAGE_PATH 등 | 없음 |
| featured_image / social_image | 같은 게시용 WebP를 가리키며 실제 파일 존재 |

본문의 자료 확인일 2026-10-03은 게시일과 역할이 다르므로 유지해도 됩니다. EN의 `seoTitle`은 별도 검색 제목이며 `title`과 H1의 일치를 깨지 않습니다.

## 2. 필수 문서 규칙과 출처 — PASS

- 네 파일 전체에 `**`, `__`, `<b>`, `<strong>`가 없습니다.
- 전화번호, 사적 당사자·증인 실명, 원문 당사자 식별번호·차량번호, 정밀 주소가 없습니다. 원문에 있는 개인 신상·가족관계도 노출하지 않습니다.
- 변호사 검토·원어민 검수 완료라는 주장이 없습니다.
- 각 본문 마지막에 해당 언어의 AI 작성 고지가 있습니다.
- 판결 링크는 KO 15개, JA 17개, EN 15개, ZH 20개, 총 67개입니다. 전부 C8 매니페스트의 아래 printData URL과 문자열 단위로 일치합니다.

[臺灣桃園地方法院115年度訴字第868號刑事判決, 2026-06-26](https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=TYDM%2C115%2C%E8%A8%B4%2C868%2C20260626%2C1)

법령의 설명은 공식 [형법 제185조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=185), [제41조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=41), [제304조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=304), [제305조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=305) 페이지도 열어 확인했습니다. 판결 printData는 웹 도구로 열리지 않았으므로 실시간 응답 성공을 주장하지 않습니다. 판결 내용은 제공된 원문 전체로 확인했고, 링크의 정확성은 매니페스트로 확인했습니다.

## 3. 이미지·영상 문구와 실제 화면 — PASS

히어로에는 밤의 다차로 도로, 콘크리트 방호벽, 붉은 브레이크등을 켠 짙은 회색 SUV, 뒤차 앞유리 쪽 시점이 보입니다. 네 언어 alt는 이 요소를 설명합니다. 정지 이미지에서 알 수 없는 속도·정차 시간·운전자의 의도·특정 장소를 추가하지 않습니다. 각 캡션은 AI가 만든 가상 장면이며 실제 사진 또는 판결 사건의 재현이 아니라고 명시합니다. alt는 시각적 내용을, 인접 캡션은 생성 사실과 비재현 고지를 담당합니다.

영상의 순서는 앞 SUV와의 간격이 벌어짐 → 브레이크등이 밝아지고 간격이 좁아짐 → 등 밝기가 줄고 주변의 흰색·어두운색 차량들이 지나가는 모습입니다. 도로 배경의 이동도 보입니다. 네 제목·설명은 이 장면을 벗어나지 않습니다. 완전 정차, 운전자 하차, 창문 두드리기, 27대의 감속, 4대의 비상등, 실제 사건의 2분 56초를 이 영상이 보여준다고 주장하지 않습니다.

| 언어 | 제목·설명 | disclosure / 화면 고지 |
|---|---|---|
| ko | 브레이크등 밝기와 차간 거리 변화, 주변 차량 통과를 자연스럽게 서술 | AI 가상 장면, 실제 블랙박스·판결 사실 재현 아님, REC·경과 시간은 효과라고 명시 |
| ja | SUVとの車間 / ブレーキランプ / 通り過ぎます의 관계가 화면과 일치 | 架空の場面, 실제 촬영·판결 재현 아님을 명시 |
| en | brake lights brighten / gap closes / vehicles passing alongside가 화면과 일치 | fictional AI-generated scene, not dashcam footage or a reconstruction을 명시 |
| zh-hant | 車距先拉開再縮短 / 煞車燈變亮後變暗 / 車輛從旁駛過가 화면과 일치 | 虛構場景, 非實錄·非判決事實重現을 명시 |

포스터의 REC, 00:00:01.5 및 각 언어 AI 고지는 읽을 수 있고 잘리지 않습니다. 게시 프레임에서 빨간 녹화 표시와 경과 시간도 확인했습니다. 실제 기록처럼 보일 수 있는 화면 효과를 disclosure가 설명하며, 화면 자체에도 가상 장면임을 표시합니다.

영상에는 차선 형상 변화와 전조등을 정면으로 보이는 차량·후면을 보이는 차량이 섞이는 생성 흔적이 있습니다. 미디어의 가로등도 실제 사건의 무조명 구간과 다릅니다. 이 점을 실제 현장·같은 방향의 정상 교통 흐름·정확한 교통 시뮬레이션으로 인증하지 않습니다. 현재 문구는 이를 주장하지 않고 가상 비재현 장면으로 한정하므로, 요청된 문구 일치·개인정보·AI 고지 검사에서는 차단 사유로 보지 않았습니다.

## 4. 미디어 개인정보·시각 안전 — PASS

직접 본 게시용 히어로, 프레임 시트, 원본 해상도 추출 프레임 15장, 네 포스터에서 다음을 확인했습니다.

- 앞 SUV와 주변 차량의 번호판에 판독 가능한 차량번호가 없습니다. 흐림 또는 빈 밝은 면으로 보입니다.
- 실존 인물·업체·장소를 이름으로 지칭하는 읽을 수 있는 간판·문구가 없습니다.
- 식별 가능한 실제 인물의 얼굴이 없습니다.
- 유혈, 부상, 시신 등 잔혹한 장면이 없습니다.
- 읽을 수 있는 주요 화면 문구는 REC, 경과 시간, AI 가상 장면 고지입니다. 실제 사건 일시나 당사자의 이름을 표시하지 않습니다.

시각 검사는 사용자가 지정한 1초 간격 표본과 추가 원본 해상도 표본을 기준으로 했습니다. 모든 언어 MP4의 361개 프레임을 전수 육안 검사했다고 주장하지 않습니다.

## 5. 네 언어 사실·숫자·결과 — PASS

현재 네 본문과 판결·첨부 공소장을 대조했습니다.

| 항목 | 공통 내용 및 확인 |
|---|---|
| 사건 | 2025-03-10, 타오위안시 양메이구, 타이66선 동쪽 방향 |
| 정차 시각 | 19:47:10–19:50:06 |
| 정차 시간 | 독립 계산 176초 = 2분 56초 |
| 도로 조건 | 제한속도 90 km/h, 해당 구간에 가로등 없음 |
| 주변 차량 | 오른쪽 통과 27대 감속, 그중 4대 비상등 |
| 영상 증거 | 캡처 10장, 검찰의 2025-06-09 검증 조서; 법원의 별도 초 단위 재생 기록이라고 바꾸지 않음 |
| 판결 | 2026-06-26, 臺灣桃園地方法院115年度訴字第868號 |
| 형량 | 징역 3개월; 易科罰金을 적용하는 경우 하루 NT$1,000 환산 |
| 법정형과 환산 | 제185조의 5년·NT$15,000 법정형과 이 사건의 형량·일일 환산액을 구분 |
| 제41조 배경 | 법정 최고형 5년 이하 또는 그보다 가벼운 형, 선고형 6개월 이하 유기징역 또는 구류 및 예외를 유지 |
| 불복 | 판결 수령 후 20일 이내; 확정·실제 납부를 단정하지 않음 |
| 다른 절차 | 행정 제재·민사 배상을 이 형사판결 결과로 추가하지 않음 |

JA/ZH가 일반 환산액 선택지 NT$2,000·3,000을 추가 설명하는 것은 본건 NT$1,000과의 모순이 아닙니다. ZH의 정차 전 60여 km/h도 피고인 진술로 한정되어 있고, 다른 언어가 이를 생략했다고 사실이 달라지지 않습니다. 강제·협박 관련 검사의 판단을 별도 무죄 판결로 바꾸지 않았습니다.

## 승인 본문 보존과 문체

네 저장소 본문은 현재 `drafts/C8/<lang>.md` 본문과 정확히 일치합니다. KO/JA/ZH 초안의 SHA-256도 각 최종 PASS 로그와 일치합니다.

EN은 `en.pre-enseo.md`의 SHA-256이 r2 PASS 로그의 `28361918d271d986e82c1e293ecac0e95411f353c263b4e771c431b1bd389942`와 일치합니다. 그 검수본에서 현재 초안으로의 변경은 `seoTitle` 추가와 summary 축약 두 항목뿐이며 본문은 그대로입니다. 현재 검색 제목과 요약도 이번에 원문과 다시 대조했습니다. 강제 정차, 장소, 야간, 3개월, NT$1,000/일이라는 의미가 보존되어 있습니다.

첫 두 본문 문단을 문장별로 삭제해 보는 방식으로 재검토했습니다.

- KO: 사건 날짜·장소·상향등 계기·급정차 및 출처 귀속, 정차 시각·계산 시간·하차 행동·도로 조건이 각각 추가됩니다.
- JA: 운행 방향·상향등·강제 정차 및 첨부 기소장 귀속, 정차 구간·시간 계산·하차·도로 조건이 각각 추가됩니다.
- EN: 정차 시작·강제 정차·긴급 사유 부재·도로 조건·출처 귀속, 종료 시각·하차·수사 단계의 설명이 각각 추가됩니다.
- ZH: 시각·차로·정차와 하차·도로 조건·첨부 기소장 귀속, 계산 시간·앞선 운행 경위·피고인의 설명이 각각 추가됩니다.

정보 없이 전개를 예고하는 문장은 없습니다. 제목·소제목·마지막 본문·요약·새 미디어 문구도 다시 읽었습니다. 저장소에서 각 언어의 직전 번호 3편(KO 188/187/180, JA 188/185/178, EN 188/186/179, ZH 188/184/183)의 도입·소제목·끝부분과 비교했으며, 같은 틀을 기계적으로 반복한 문제는 발견하지 못했습니다. 이는 저장소 번호 기준 비교이며 운영 사이트의 게시 순서를 별도로 검증한 것은 아닙니다.

이번 검수에서 직접 고친 문장은 없습니다. 따라서 새로 작성할 원문 → 수정안 기록도 없습니다. 기존 검수의 필수 수정은 현재 본문에 유지되어 있습니다.

## 실행 검증

- Node.js 24.14.1에서 읽기 전용 검사: YAML 파싱, 날짜, author, tags, title/H1, 금지 표현, 출처 URL, 마지막 AI 고지, 미디어 파일 존재, 승인 초안 본문과의 일치 모두 통과.
- TypeScript AST 파싱: 레지스트리 구문 오류 0, 해당 키는 언어별 정확히 1개씩 총 4개. 우선 조회되는 `traffic-column-films.json`에 이 슬러그를 덮어쓰는 항목 없음.
- 네 MP4를 각각 `ffprobe`로 확인: 1280×720, 24 fps, 361프레임, 15.041667초, 오디오 스트림 없음. 레지스트리의 약 15초·무음·`loop: true`와 일치.
- 네 게시용 포스터는 각각 `video/out-v3/C8-<lang>.jpg`와 바이트 단위 일치.
- `git diff --check -- <대상 네 Markdown> src/data/column-generated-videos.ts` 통과. 새 Markdown은 추가로 직접 파싱했습니다.
- 다음 기존 테스트 3개 파일, 341개 테스트 모두 통과(2026-10-04 04:15 KST, exit 0):

```text
src/components/__tests__/column-generated-video.test.tsx      280 passed
src/lib/__tests__/columns-publication-date.test.ts              12 passed
src/lib/__tests__/column-category-parity.test.ts                49 passed
```

실행 명령:

```sh
PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH /Users/son7/.nvm/versions/node/v24.14.1/bin/node node_modules/vitest/vitest.mjs run --project unit --no-cache src/components/__tests__/column-generated-video.test.tsx src/lib/__tests__/columns-publication-date.test.ts src/lib/__tests__/column-category-parity.test.ts
```

테스트 성공을 실제 브라우저·배포 검증으로 확대 해석하지 않습니다. 이번 판정은 지정한 C8 파일·미디어의 다섯 항목에 관한 게이트이며, 전체 앱의 클린 빌드·배포·운영 화면 검사를 실행했다는 뜻은 아닙니다.

## 검수 스냅샷

2026-10-04 04:18 KST에 네 Markdown, 레지스트리, 네 MP4와 네 포스터 총 13개 파일이 검수 중 변경되지 않았음을 SHA-256으로 재확인했습니다.

| 칼럼 | SHA-256 |
|---|---|
| ko | `1f7c40f0d31ab80049ad2b30e99f9de4bc4ea2333917969c23b151b53739861a` |
| ja | `497f0ff5175b86e369608d22e69d40962f7bb2cd7a0d4838cc7912ad5e97e338` |
| en | `810704b34298c455db7fa6caca3157c8860769f2be9d2372775092c32ddf89c4` |
| zh-hant | `171a1b90c8cf5aa9a5684382b2ff7d72589e76fb06083445ca66c6e1dce137a1` |

레지스트리: `613d781d58a93b73dd4cdd206f8d13649e87541a78e85ea4c5f4005632093707`
게시용 히어로: `229470edff223c675dc0e3a572640e2052ac2efffeb78bb14c980d408425312a`
제공 프레임 시트: `9e3b68442c2558d58afaa9d2910f3630d51eb2a2474610cc2e48f598c3ecde21`

| 미디어 | SHA-256 |
|---|---|
| ko MP4 | `315a5aab92104f080a02149ad8b401db5c35358adc9085ab8d94df638fb707e8` |
| ko poster | `9258ee4907208d6f558117d6c85d9c6dc6b0bbb0e41a8a27850fcdd381f2fe8a` |
| ja MP4 | `a9ca4b6ca08afbffd27da1ee467fc4b9b32c08087de52a1f2ed7c26ef3ce4869` |
| ja poster | `73e13c1ec69d7a59ca104d90f949dfa5b9b2ade79daebb7e86ecd10c6c6aa0cf` |
| en MP4 | `f3d2dabaec3ee675621216eb4565f3bdf2acd75b8d932f5ca7d0b1b4354ed8b5` |
| en poster | `8d4db5b0a8680b7a76446a0eee85280a9fa1fbbcf9b1e798feeda3979201228c` |
| zh-hant MP4 | `fe44856b027da0780ad51404eb670e4ede9ee892f1561ec75248625e18a5c7ae` |
| zh-hant poster | `850906ff7c67520b5db8b0b10ac834a2bf8056bc1fa1b4002222d84245fbcea2` |

영속 작업 산출물은 이 로그뿐입니다. 프레임 추출은 임시 디렉터리에 수행했습니다. 기존의 다른 레인 변경과 테스트 파일은 수정하지 않았고, 커밋·배포도 실행하지 않았습니다.

VERDICT: PASS
