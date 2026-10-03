C4 최종 배포 전 통합 검수 — 2026-10-03

검수: Codex 직접 최종 검수, 요청된 Astra 대체 게이트. Fable 추가 승인을 요구하지 않았다.
대상: 094-taiwan-road-rage-freeway-cut-in-sentence-reduced, ko / ja / en / zh-hant.
저장소: /Users/son7/Projects/tseng-law-roadrage-20261003, 검수 시작 HEAD 9c874dd47.

요청한 콘텐츠·미디어 항목 1–5는 아래 경미 수정을 적용한 상태에서 통과한다. 다만 C4의 신규 칼럼 분류가 테스트 보조 목록 한 곳에 빠져 있어, 이 글 자체가 기존 요약문 검사에 실패한다. 수정할 파일이 허용 범위 밖이므로 최종 배포 게이트는 FIX다. 본문이나 미디어를 다시 제작해야 하는 문제는 발견하지 않았다.

남은 수정: C4 신규 칼럼 분류 누락

위치: [native-locale-columns.ts](/Users/son7/Projects/tseng-law-roadrage-20261003/src/lib/__tests__/native-locale-columns.ts:293)의 EXPERTISE_SLUGS_20260930 초기화 배열.

ROAD_RAGE_COLUMN_FILES_20261003은 같은 파일에 선언되어 있고 sameDayFilesOf와 archiveLeadSlugsFor에는 반영되어 있지만, 이 집합에는 포함되지 않았다. 따라서 다음 호출이 false다.

```ts
isExpertiseColumnFile20260930(
  '094-taiwan-road-rage-freeway-cut-in-sentence-reduced.md',
)
```

[column-summary-frontmatter.test.ts](/Users/son7/Projects/tseng-law-roadrage-20261003/src/lib/__tests__/column-summary-frontmatter.test.ts:189)는 이 함수를 이용해 작성된 summary가 허용되는 새 글을 분류한다. 실제 조건을 C4에만 적용해 재현한 결과:

| C4 파일 | 새 글로 분류 | summary 존재 | 기존 검사 결과 |
|---|---|---|---|
| columns/094-…md | false | 있음 | FAIL |
| columns-ja/094-…md | false | 있음 | FAIL |
| columns-zh/094-…md | false | 있음 | FAIL |

정확한 수정은 EXPERTISE_SLUGS_20260930 안의 배열에 다음 한 줄을 추가하는 것이다. 다른 날짜 목록이나 칼럼 본문에서 summary를 삭제하는 방식으로 해결하면 안 된다.

```ts
    ...Object.values(ROAD_RAGE_COLUMN_FILES_20261003),
```

같은 배열의 Object.values(COUNTRY_COLUMN_FILES_20261002) 다음에 삽입하면 된다. 이 한 줄을 메모리에서만 적용해 TypeScript를 변환하고 함수를 실행했을 때 C4 분류가 true로 바뀌는 것을 확인했다. 저장소의 보조 목록이나 테스트는 편집하지 않았다. 사용자 지시가 네 칼럼 파일과 이 slug의 영상 레지스트리 항목만 편집하도록 제한하기 때문이다.

전체 검사에는 C4 밖의 실패도 남는다. 최종 6개 테스트 파일 실행 결과는 45개 통과, 10개 실패다. 직접 표시된 실패는 EN 092의 seoTitle 누락, KO 091의 새 글 분류 누락, KO/EN/ZH의 기존 칼럼 개수·게시 순서 기대값 불일치다. C4 요약문 실패는 더 앞선 KO 091 실패에 가려져 있어 위와 같이 별도로 재현했다. 배포 담당자는 실제 기존 게시 목록과 대조해 그 목록·날짜 fixture도 갱신하고, EN 092에는 해당 글에 맞는 검색용 제목을 추가해야 한다. 이들 다른 글은 이번 검수에서 수정하지 않았다.

검수 근거와 범위

- brief-SERIES.md와 brief-EDITORIAL-VOICE.md 전문, 네 저장소 칼럼 전문, C4 영상 레지스트리 네 항목을 읽었다.
- 홈의 ~/agent-library/knowledge/editorial-voice.md는 없었다. 저장소 docs/columns/EDITORIAL-VOICE.md와 지정된 brief-EDITORIAL-VOICE.md의 SHA-256은 동일했다.
- 기존 EN r1–r3, KO r1–r2의 지적·해결 기록과 최종 통과 기록, JA r1 및 ZH r1 기록을 확인했다. 이번 수정 전 네 저장소 파일의 본문은 각 drafts/C4/<lang>.md 본문과 일치했다. 매체용 frontmatter 통합 이후 본문 유실은 없었다.
- cases-manifest.json의 C4 항목 및 cases/jud/55.txt, cases/jud/344.txt와 첨부 기소장을 직접 대조했다.
- 게시용 WebP, 제공된 프레임 시트, KO/EN/JA/ZH 포스터를 view_image로 직접 보았다. 게시용 EN MP4에서 0.25초 간격 시트와 5.0초 마지막 프레임도 추출해 직접 보았다.
- 기존에 더해져 있던 컴포넌트·테스트·다른 칼럼 파일은 보존했다. 커밋·배포·외부 메시지 전송은 하지 않았다.

요청 항목 1: frontmatter

실제 저장소의 gray-matter로 YAML을 파싱했다. 네 파일 모두 author가 legal-ai-assistant이며, published와 lastmod가 2026-10-03이다. 각 언어의 date_display도 같은 날짜다. traffic-accidents 태그, 실제 존재하는 hero/social 이미지 경로를 확인했다. title과 단 하나의 본문 H1은 정확히 일치한다. TBD, IMAGE_PATH 등 자리표시자는 없다.

EN에는 별도 seoTitle을 추가했다. 원래 title은 86자, 사이트 접미사를 합치면 101자로 저장소의 60자 규칙을 넘는다. 새 검색용 제목은 “Linkou Road Rage: Sentence Reduced on Appeal”이며 사이트 접미사 포함 59자다. 본문 제목과 H1은 유지했다. EN summary는 기존 160자를 유지했다.

요청 항목 2: 하드 룰과 출처

네 칼럼 및 해당 영상 문자열에 금지된 굵은 표시, 전화번호, 당사자 실명, 변호사·사람 원어민의 검토 주장, 미완성 표시가 없다. 네 본문 모두 해당 언어의 AI 작성 공개 문장으로 끝난다. 건강·학력·정확한 직업 등 당사자의 구체적 사생활을 노출하지 않는다.

판결 링크는 다음 manifest의 두 printData URL과 문자열 단위로 일치한다. KO 7개, JA 8개, EN 38개, ZH 8개이며 모든 언어에 두 판결이 모두 들어 있다.

- [臺灣高等法院114年度上訴字第5567號, 2026-01-14](https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=TPHM%2C114%2C%E4%B8%8A%E8%A8%B4%2C5567%2C20260114%2C1)
- [臺灣新北地方法院113年度審訴字第716號, 2025-03-06](https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=PCDM%2C113%2C%E5%AF%A9%E8%A8%B4%2C716%2C20250306%2C1)

웹 도구에서는 두 printData 주소를 가져오지 못했다. 링크의 현재 외부 응답 상태까지 인증하는 것은 아니며, 사건 내용과 링크 식별자는 제공된 판결 원문과 manifest로 검증했다. [형법 제33조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=33)와 [도로교통관리처벌조례 제43조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=43)는 공식 현행 페이지도 열어 대조했다.

요청 항목 3–4: 실제 미디어와 문구

게시용 hero는 1600×900이며, 차 안에서 앞유리 너머로 본 흰색 소형 탑차, 켜진 후미등, 옆 차로의 짙은 회색 세단과 흰색 SUV, 고가도로와 고층 건물이 실제로 보인다. 정지 이미지로 급제동이나 자동 제동 작동을 확인할 수는 없으므로 캡션은 보이는 차량과 시점만 설명하도록 다듬었다.

네 언어의 alt에 AI 가상 장면이라는 말을 추가했다. 이 alt는 카드와 소셜 메타데이터에서도 쓰이고 캡션은 그곳에 함께 전달되지 않으므로, 캡션이 없는 표시에서도 생성 이미지임을 알 수 있다. 네 캡션 모두 AI가 만든 허구 장면이며 실제 사건 사진이나 판결 사실의 재현이 아님을 명시한다.

영상은 처음 왼쪽 차로 경계에 걸쳐 보이는 흰색 탑차가 오른쪽으로 방향을 틀어 카메라 앞 차로에 들어오고, 차간 거리가 줄어들어 뒷문이 화면 중앙을 크게 차지하는 흐름이다. 레지스트리의 네 제목·설명과 일치한다. 설명은 후미등이라고 표현하며, 자동 제동 시스템의 작동·실제 속도·실제 사고 횟수를 영상에서 확인했다고 주장하지 않는다.

각 언어의 disclosure는 AI 가상 장면, 실제 블랙박스 기록 아님, 판결 인정 사실의 재현 아님을 명확히 구분한다. 세부 거리·속도·시간은 설명용이라는 제한도 있다. 해당 언어의 문장으로 자연스럽게 읽히며 실명은 없다. 레지스트리는 수정할 필요가 없었다.

ffprobe 결과 네 게시용 영상 모두 H.264, 1280×720, 24fps, 121프레임, 5.041667초다. 오디오 스트림이 없어 “무음 약 5초” 설명이 맞다. 네 MP4와 네 JPG 모두 video/out의 대응 파일과 SHA-256이 같아, 검수한 산출물이 게시 경로의 산출물과 일치한다. loop: true와 재생 후 반복 설명도 컴포넌트 출력과 일치하며 자동 재생은 없다.

제공된 C4-v1-frames.jpg는 4×3칸 중 실제 장면 10칸과 빈 검은 칸 2칸이었다. 요청문의 “12프레임”을 실제 검수 수로 계산하지 않았다. 게시용 MP4의 추가 시트와 마지막 프레임으로 끝부분까지 보강했다. 시트의 빈 칸은 영상의 검은 종료 장면이 아니다.

확인한 이미지·프레임에 읽을 수 있는 실제 이름·지명 표지·번호판, 식별할 수 있는 사람, 유혈·그래픽한 부상은 없다. 차량 번호판은 흐려져 있고 도로 표지의 실제 지명도 읽히지 않는다. 읽을 수 있는 영상 글자는 REC, 경과 카운터, 현지화된 AI 고지다. 카운터는 사건 날짜나 증거 타임스탬프로 설명되지 않는다. 네 포스터의 고지는 잘리지 않고 읽힌다.

요청 항목 5: 네 언어 핵심 사실 대조

| 항목 | 네 언어 공통 내용과 원문 대조 |
|---|---|
| 사건 일시 | 2024-02-22 약 15:10 |
| 장소·진입 | 린커우, 화물차 좌회전·택시 우회전, 북행 진입로와 안쪽 차로 표지 |
| 고속도로 행위 | 택시 차로에 4회 끼어들기, 앞에서 3회 급제동, 병주, 택시 자동 제동 |
| 캡처 구간 | 약 15:07:56–15:08:08, 약 12초 |
| 운전자 진술 | 약 30초, 1–2분, 3–5회. 진술 내용과 법원이 인정한 범위를 구별 |
| 기소 | 2024-09-02, 113年度偵字第38619號 |
| 1심 | 2025-03-06, 유기징역 4개월 |
| 항소심 | 2026-01-14, 형 부분만 파기, 구류 40일 |
| 환산 | 양심 모두 하루 NT$1,000, 40일 전부 환산 시 NT$40,000. 실제 납부액으로 단정하지 않음 |
| 감형 이유 | 택시도 차로를 다투고 양보하지 않았다는 사정을 원심이 누락 |
| 양형·책임 구별 | 유죄 판단 유지, 피해자의 일부 책임은 양형 평가. 택시의 별도 유죄나 민사 과실 비율을 만들지 않음 |
| 행정 배경 | NT$6,000–36,000, 현장 운전 금지, 번호판 6개월. 본건 형사판결의 실제 부과 처분으로 서술하지 않음 |
| 상소·확정 | 송달 후 20일 안내. 이후 상소나 확정 여부를 단정하지 않음 |

본문의 숫자 토큰과 모든 URL의 순서·내용은 이번 수정 전후 정확히 같다. 중국어 직접 인용과 각 판결의 결과도 보존했다.

직접 적용한 경미 수정과 의미 보존

| 위치 | 원문·문제와 이유 | 적용한 수정 | 보존 여부 |
|---|---|---|---|
| 네 언어 featured_image_alt | 보이는 장면만 기술해 alt만 재사용될 때 생성 사실이 전달되지 않음 | KO “AI로 만든 가상 장면입니다.”, JA “AIで生成した架空の場面です。”, EN “AI-generated fictional scene:”, ZH “AI生成的虛構畫面：” 추가 | 기존 차량·색상·도로·건물 묘사 보존 |
| 네 언어 featured_image_caption | 끼어들기·급제동의 “유형” 설명은 정지 이미지의 관찰 내용과 기사 상황을 혼합할 수 있음. JA “状況の類型”도 딱딱함 | 흰색 탑차와 주변 차량을 차 안에서 본 AI 장면으로 기술 | 가상 장면·실제 사건 아님·재현 아님을 모두 보존 |
| KO 제33조 문장·출처 | 형의 범위를 설명하면서 배경 규정임을 명시하지 않음 | “두 형의 구분에 관한 배경 규정인”, “원칙적으로” 및 두 판결의 조문 번호 미기재 설명 추가 | 기간·실제 선고·제41조 조건과 단서 보존 |
| JA 제33조 문장·출처 | 동일 | “参考までに”, “通常の範囲” 및 두 판결의 조문 번호 미기재 설명 추가 | 기간·선고·환산 조건 보존 |
| ZH 제33조 문장 | 기본 범위가 예외 없는 범위처럼 읽힐 여지 | 유기징역·구류 설명 각각 “原則上” 추가 | 원문 직접 인용·기간 보존. EN의 기존 ordinarily와도 일치 |
| KO 자동 제동 한 문장 | “위험이 실제로 생긴 모습으로”는 판결이 별도로 붙이지 않은 평가 | “법원이 인정한 사실관계에 포함되지만”으로 변경 | 작동 사실과 확인 방법 미기재를 보존. 기존 JA 검수에서 같은 이유로 수정한 문장과도 일치 |
| EN seoTitle | 긴 title에 별도 검색용 제목 없음 | “Linkou Road Rage: Sentence Reduced on Appeal” 추가 | title/H1·핵심 사실·요약·작성자 유지 |

첫 두 문단의 문장별 삭제 검토에서는 날짜·위치·진행 방향·회전·표지·끼어들기·횟수·자동 제동 등 서로 다른 정보가 빠지므로 삭제할 범용 도입문이 없었다. 저장소 게시일·동일 날짜 파일 순서 기준 선행 세 글과도 도입·소제목·끝맺음을 비교했다: KO 091/063/064, JA 066/067/071, EN 092/063/064, ZH 085/086/087. C4는 구체적 사건 진행과 양형 쟁점으로 시작하며 선행 글의 체크리스트·세무·은행 절차 틀을 반복하지 않는다. 실제 운영 사이트의 게시 이력까지 별도로 인증한 것은 아니다. 자연스러움 검수는 AI 검수이며 사람 원어민 검수로 표시하지 않았다.

실행 검증

- 최종 gray-matter 파싱·TypeScript 레지스트리 로딩 검사: KO 22개, JA 22개, EN 23개, ZH 22개 검증 항목 모두 통과. 메타데이터, 단일 H1, 금지 패턴, 링크, 실제 자산 존재, 레지스트리 키 중복 부재, AI 표기, 수정 전후 숫자·URL 보존 포함.
- 미디어·날짜 관련 기존 테스트 3파일, 29개 통과: column-generated-video.test.tsx 21개, column-image-descriptions.test.ts 2개, column-native-date-display.test.ts 6개. C4 네 언어의 수동 재생·반복·고지 렌더 검사 포함.
- 요약·검색용 제목·게시 순서 검사까지 포함한 최종 실행: 6파일, 45개 통과 / 10개 실패. 실패를 숨기거나 전체 테스트가 통과했다고 판정하지 않았다.
- C4에만 적용한 기존 요약문 조건: KO/JA/ZH 3개 실패 재현. 제안한 보조 목록 한 줄 수정은 메모리 검증 통과.
- git diff --check 통과. 영상 레지스트리는 이번 검수 시작 시점과 바이트 단위로 같다.
- 시스템 Homebrew node는 llhttp 라이브러리 부재로 시작하지 못했다. 설치된 /Users/son7/.nvm/versions/node/v24.14.1/bin/node로 파싱과 테스트를 실행했다. 시스템 환경은 수정하지 않았다.
- 전체 빌드·브라우저 페이지 QA·배포는 실행하지 않았다. 실제 미디어를 직접 본 결과와 정적 렌더 테스트를 브라우저 전체 페이지 검증으로 부풀리지 않는다.

재검증 명령:

```sh
cd /Users/son7/Projects/tseng-law-roadrage-20261003
/Users/son7/.nvm/versions/node/v24.14.1/bin/node node_modules/vitest/vitest.mjs run src/components/__tests__/column-generated-video.test.tsx src/lib/__tests__/column-image-descriptions.test.ts src/lib/__tests__/column-summary-frontmatter.test.ts src/lib/__tests__/column-native-date-display.test.ts src/lib/__tests__/columns-publication-date.test.ts src/lib/__tests__/column-seo-title-frontmatter.test.ts
```

검증 산출물은 /tmp/c4-final-gate-8NlRJW/의 before.json, final-checks.json, focused-tests.log, integration-tests-final.log에 있다. 이 로그가 영속 검수 기록이며 /tmp 자료의 영속성은 보장하지 않는다.

검수 완료 파일 SHA-256:

| 파일 | SHA-256 |
|---|---|
| columns/094-…md | 7c16428506ff276505257233fcc85293109fbaf0844c080f231898fe7b66e768 |
| columns-ja/094-…md | ad324cbf7315ba584f8f87c5f59b8289d1a204050256f716d95305ffb6878e50 |
| columns-en/094-…md | 04332d52cd4c679df4659d7c857faae1eb945f704e30415fa40a9728c62d77f6 |
| columns-zh/094-…md | 3c37f55761438d6384bc8c4df299ed1ff2bd1ad16642cc26649ddd31073da765 |
| src/data/column-generated-videos.ts, 미수정 | 4e1df3e4e9be6f3bdbe7ff18161d87cda8d7e4d47772c546c7db2f521c3950b5 |

VERDICT: FIX
