# C6 통합 최종 검수 — Astra fallback, 192번 재통합본

검수일: 2026-10-04 05:07:56 KST
대상: `taiwan-road-rage-freeway-chase-own-dashcam-too`, KO / JA / EN / ZH-Hant 4개 언어.
판정: PASS. 요청된 항목 1–5에서 남은 필수 수정은 없습니다. 이번 검수에서 원고·registry·미디어·테스트 파일은 수정하지 않았습니다.

이 로그는 2026-10-04 00:12 KST의 161번 통합본 검수를 대체합니다. 그때의 FIX 사유였던 교통사고 목록 필터 테스트는 현재 192번 통합본에서 해결됐고, 아래 명령으로 새로 통과를 확인했습니다. 실제 게시일은 이번 요청대로 2026-10-04입니다.

## 검수 범위와 기준

- `brief-SERIES.md`, `brief-EDITORIAL-VOICE.md`, 저장소 `AGENTS.md`와 `docs/columns/EDITORIAL-VOICE.md`를 읽었습니다. 홈의 `~/agent-library/knowledge/editorial-voice.md`는 없으므로 제공된 전문과 저장소 사본을 적용했습니다. 저장소 사본의 공개 AI 작성자 표시 관련 문구와 이번 요청이 다른 부분은, 이번 요청의 `author: legal-ai-assistant` 및 AI 고지 유지 조건을 우선했습니다.
- `/Users/son7/Projects/tseng-law-roadrage-20261003/src/content/{columns,columns-ja,columns-en,columns-zh}/192-taiwan-road-rage-freeway-chase-own-dashcam-too.md`의 frontmatter·제목·본문·표·출처·말미 고지를 읽었습니다.
- `src/data/column-generated-videos.ts:751`부터 해당 slug의 KO / JA / EN / ZH-Hant 4개 항목을 확인했습니다.
- 이전 언어별 검수 로그 7개의 판정과 주요 지적·수정 이력, 이전 최종 게이트의 미해결 항목을 확인했습니다. 현 본문을 초안과 직접 비교하고, 아래처럼 이전 PASS 원고까지 연결했습니다.
- `cases/cases-manifest.json`의 C6 URL과 `cases/jud/42.txt`, `52.txt`, `345.txt`의 주문·핵심 시각·속도·상고 결과를 대조했습니다. 법령은 공식 단일 조문 페이지도 확인했습니다.
- 이미지 보기 도구로 실제 게시용 1600×900 WebP, 제공된 15장 프레임 시트, KO·EN 포스터를 직접 봤습니다. 게시용 JA·ZH 포스터와 게시용 KO MP4의 3·7·10·14초 프레임도 원래 해상도로 추가 확인했습니다.
- 이번 판정은 요청된 원고·미디어 통합 범위와 아래 관련 테스트에 대한 것입니다. 전체 앱 빌드·전체 테스트·브라우저 실시간 재생·배포는 수행하지 않았습니다. 361프레임 전부를 개별 육안 검수했다는 뜻도 아닙니다.

## 이전 PASS 원고 및 최종 지적과의 연결

4개 저장소 파일의 Markdown 본문은 현재 `drafts/C6/<lang>.md`와 각각 정확히 같습니다.

- KO: 현재 초안 SHA-256 `f001749f21439a583f510aa22a4f996bf4af37717ca77207a0a38438e29a046f`가 `ko-astra-r2.md`의 PASS 해시와 일치합니다.
- ZH-Hant: 현재 초안 SHA-256 `bfe8f482f900bca4308c893eda5337514f125d9e4dd1924f547f4f17fb1b6247`가 `zh-hant-astra-r2.md`의 PASS 해시와 일치합니다.
- JA: 현재 초안은 이전 최종 검수 E1의 한국어 중복 byline 제거만 언어별 PASS 원고와 다릅니다. `著者：法律AIアシスタント`를 이전 byline으로 역치환하면 `ja-astra-r2.md`의 최종 해시 `1c7c827a4f86637b539b6e95b86cb2af8d50ed3b670f445f65cfd5e92bdbfae0`와 일치합니다.
- EN: `en.pre-enseo.md`의 해시 `fc80d6ef77e408143b92013d74cfc452126f399baac956317130d6cccd2d6273`가 `en-astra-r1.md`의 PASS 해시와 일치합니다. 현 초안과의 차이는 summary 단축과 이전 최종 검수 E2의 한국어 중복 byline 제거뿐입니다. 현 summary의 충돌·법률상 상고 이유 부족·유죄 유지 설명을 최고법원 판결과 다시 대조했습니다.

초기 단순 해시 검사에서 JA·EN이 언어별 PASS 해시와 다르게 나왔으나, 위 역치환·백업 diff로 변경 범위를 확인했습니다. 내용이 변하지 않았다고 해시 차이를 무시하지 않았으며, 새 사실 변경은 발견되지 않았습니다.

이전 00:12 최종 검수의 수정 이력 확인:

| 항목 | 이전 문구·문제 | 현재 문구·처리 | 보존된 의미 |
|---|---|---|---|
| E1 JA byline | `著者：법률 AI 어시스턴트（法律AIアシスタント）`: 불필요한 한국어 중복 | `著者：法律AIアシスタント` 반영 확인 | 같은 AI 작성자·말미 고지 유지 |
| E2 EN byline | `By Legal AI Assistant (법률 AI 어시스턴트)`: 불필요한 한국어 중복 | `By Legal AI Assistant` 반영 확인 | 같은 AI 작성자·말미 고지 유지 |
| E3–E6 영상 설명 | 재생 버튼을 눌러야 반복된다는 문구가 페이지의 자동재생 동작을 충분히 설명하지 못함 | 네 언어 모두 무음·약 15초·반복재생만 서술하는 문구 반영 확인 | 영상 길이·무음·반복 여부 유지; 재생 시작 조건을 단정하지 않음 |
| M1 목록 테스트 | 당시 증거 분야 필터의 예상 개수가 C6 추가를 반영하지 못함 | 현재 `traffic-board.test.tsx`는 9개 행과 C6 링크를 함께 검증하며 통과 | C6의 올바른 `traffic-evidence` 태그 유지 |

현재 코퍼스의 예상 개수는 당시의 8개와 다릅니다. 이번 실행은 현재 파일에 대해 9개 행 및 C6 포함을 검증한 결과입니다. 이번 검수에서 테스트를 수정하지 않았습니다.

## 1. Frontmatter 및 2. 필수 규칙

| 항목 | 결과 |
|---|---|
| YAML | 프로젝트 `gray-matter`로 4개 정상 파싱. 별도 PyYAML 검사에서 중복 키 없음 |
| 작성자 | 4개 모두 `legal-ai-assistant` |
| 게시·수정일 | `published`, `lastmod` 모두 `2026-10-04` |
| 표시 날짜 | KO `2026년 10월 4일`, JA/ZH `2026年10月4日`, EN `October 4, 2026`; 모두 같은 게시일 |
| 자료 확인일 | 말미의 2026-10-03 유지; 게시일과 역할이 다름 |
| 제목 | frontmatter title과 유일한 H1이 각 언어에서 정확히 일치 |
| 태그·언어 | 모두 `traffic-accidents`, `traffic-evidence`; audience가 해당 언어와 일치 |
| 자리표시자 | `TBD`, `IMAGE_PATH`, `ALT_TBD`, `CAPTION_TBD` 없음 |
| 굵은 강조 | `**`, `__`, `<b>`, `<strong>` 없음 |
| 개인정보 | 사인 실명·전화번호·정확한 사적 주소·건강·가족·소득·학력·구체적 직업 정보 없음 |
| 검수 주장 | 변호사 검수·인간 원어민 검수 주장 없음 |
| AI 고지 | 각 언어의 본문 마지막 줄에 AI 작성 고지 존재 |
| 이미지 | featured/social image가 지정된 게시용 WebP와 일치하며 파일 존재 |

판결 URL은 모든 발생 위치에서 manifest C6의 정확한 `printData.aspx` 문자열과 일치합니다. 일반 검색 결과 URL이나 다른 사건 URL로 교체된 곳이 없습니다.

| 언어 | 판결 링크 수 | 법령 링크 수 |
|---|---:|---:|
| KO | 49 | 9 |
| JA | 32 | 4 |
| EN | 32 | 6 |
| ZH-Hant | 28 | 4 |

각 언어에 세 판결이 모두 있고, 법원·사건번호·선고일과 출처 목록의 대응이 유지됩니다. 날짜·사건번호를 전화번호로 잘못 분류하지 않고 실제 문맥도 읽었습니다. 형사형, 조건부 易科罰金, 행정 제재, 민사 배상을 구별합니다.

## 3. 미디어 문구와 4. 실제 화면

대표 이미지의 alt는 네 언어 모두 실제 보이는 해 질 녘의 고가도로 분기점, 왼쪽 흰 세단, 오른쪽 흰 빗금 구역 가장자리에 비스듬히 걸친 검은 세단, 앞유리 너머 시점을 서술합니다. 촬영 장소·차종·속도·운전자의 의도를 추가하지 않습니다. 각 caption은 AI가 만든 가상 장면이며 사건 사진이나 재현이 아니라는 점을 명시합니다.

영상의 네 언어 제목·설명도 검은 세단이 빗금 구역 가장자리에서 왼쪽 차로로 들어온 다음 오른쪽으로 이동하고, 왼쪽 차로의 흰 세단과 나란히 달리는 흐름과 일치합니다. 주변에 다른 차들이 있다는 점과 모순되지 않으며, 영상에 없는 충돌·위협 의도·정밀 속도·41B라는 실제 장소를 주장하지 않습니다. 본문의 실제 정오 사건과 미디어의 일몰 장면은 가상 장면 고지로 구별됩니다.

네 언어 disclosure 모두 AI 생성 가상 장면, 실제 블랙박스 영상 아님, 판결 사실의 재현 아님을 명시합니다. REC는 연출, 오른쪽 위 숫자는 날짜·속도가 아닌 경과 시간이라는 설명도 포스터와 추출 프레임에 맞습니다. 네 언어 포스터의 현지어 AI 고지는 잘리지 않고 읽을 수 있습니다. 말투와 용어는 각 언어에서 자연스럽고 사인 실명은 없습니다.

직접 확인한 WebP·프레임 시트·추출 프레임·포스터에서 판독 가능한 번호판, 실재 인명·지명·상호를 적은 글자, 식별 가능한 실제 인물, 유혈·신체 훼손은 발견하지 못했습니다. 도로 표지판은 비어 있고 번호판은 비어 있거나 판독할 수 없습니다. 차량 엠블럼 모양은 있으나 판독 가능한 실제 브랜드명·차종명 글자는 확인되지 않았습니다. REC·경과 시간·AI 고지는 장면 속 실재 대상을 명명하는 텍스트가 아닙니다.

기술 검사:

- 게시용 MP4 4개 모두 H.264, 1280×720, 24fps, 361프레임, 15.041667초. 오디오 스트림 없음. 따라서 ‘무음·약 15초’ 설명이 정확합니다.
- `ffmpeg -v error -xerror -i <각 MP4> -f null -`: 4개 모두 exit 0, 오류 출력 없음.
- TypeScript AST와 실제 registry 모듈을 확인했습니다. 해당 언어별 키 4개가 각각 한 번 존재하고, `getColumnGeneratedVideo()`가 올바른 파일·포스터·크기·문구·`loop: true`를 반환합니다. 같은 slug의 `issue`와 미등록 언어는 null입니다.
- 언어별 `src`·`poster` 파일이 모두 존재합니다. `video/out-v3/C6-<lang>.jpg`와 게시용 포스터는 4개 언어 모두 바이트 단위로 같습니다.
- 직접 미디어를 생성·수정하지 않았습니다. 육안 확인 범위 밖의 모든 중간 프레임에 대한 OCR 보증은 하지 않습니다.

## 5. 언어 간 사실·숫자·결론 대조

| 대조 항목 | 확인 결과 |
|---|---|
| 사건 | 2023-07-03, 국도 1호 남쪽 방향, 타이산–린커우·구이산 구간 |
| 시속 151km | 흑색 차의 블랙박스 표시. 백색 차의 독립적인 정밀 측정값으로 쓰지 않음 |
| 백색 차 자체 영상 | 11:57:05의 125km/h를 자기 영상의 기록으로 네 언어 모두 설명 |
| 충돌 직전 | 백색 차 영상의 12:00:00 89km/h, 이어 101→123km/h, 12:00:09 충돌. ZH는 중간 101 값을 생략하지만 89·123 및 무감속 경과는 일치 |
| 시각 차이 | JA의 흑색 영상 12:00:07 / 백색 영상 12:00:09 설명은 다른 언어의 백색 영상 기준 09초와 모순되지 않음 |
| 출구 | 41B, 50km/h 표지 옆 흑색 차 103km/h, 출구로 내려가지 않고 남쪽 주행을 계속했다는 핵심 일치 |
| 1심 | 新北地方法院 113年度訴字第756號, 2025-04-30. 두 운전자 각각 징역 5개월, 환산 시 하루 NT$1,000 |
| 2심 | 臺灣高等法院 114年度上訴字第5220號, 2026-02-25. 두 항소 기각, 1심 유지 |
| 최고법원 | 最高法院 115年度台上字第2709號, 2026-08-27. 백색 차 운전자의 상고는 법률상 방식에 맞지 않아 기각; 흑색 차 형은 이미 확정됐다는 기록 유지 |
| 판결 범위 | 실제 환산금 납부·행정 제재 확정 결과·민사 배상액·과실비율을 새로 추정하지 않음 |

법령의 핵심 조건·숫자도 공식 조문에 부합합니다. [형법 제185조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=185)의 법정형, [제41조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=41)의 환산 조건·예외, [형사소송법 제377조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=377)의 법률 위반 상고 요건을 확인했습니다.

KO에만 있는 NT$30,000–90,000·면허 취소·번호판 6개월 제재 설명은 [도로교통관리처벌조례 제43조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=43)의 내용과 맞고, 이 사건에서 실제 내려진 행정 처분이라고 단정하지 않습니다.

## 문체 확인 및 수정 여부

제목·요약·소제목·첫 두 문단·끝부분·미디어 문구를 확인했습니다. 이 글 고유의 쟁점인 두 차량의 기록 출처와 상고 범위를 제목과 본문이 유지합니다. 새 수정이 필요한 문장은 발견하지 않았습니다.

첫 두 본문 문단의 문장별 삭제 검사는 아래 정보가 사라지는지 확인하는 방식으로 수행했습니다. 실제 삭제는 하지 않았습니다.

| 언어 | 첫 문단에서 각 문장 삭제 시 손실 | 둘째 문단에서 각 문장 삭제 시 손실 |
|---|---|---|
| KO | 날짜·구간·31초 진입 / 32초 추월 / 33·35초 제동과 차로 변경 중단 / 자체 영상의 시각별 속도 | 자체 제출 영상이라는 출처 / 양보를 근거로 한 운전자 주장 / 고등법원의 직접 검증 / 분쟁 발생에 관한 법원 판단 |
| EN | 날짜·구간·40초 제동 / 41초 재제동 / 급제동·근접 위험 / 지속된 추격이라는 법원 판단 | 흑색 차 151 / 상대 데이터 사용에 대한 이의 / 상고 기각 / 자기 영상도 증거였다는 전환 |
| JA | 날짜·노선 / 차량 전후 관계 / 89·101 기록 / 차로 변경과 방향지시 / 무감속·123 / 08·09초 경과 / 1심의 검증 출처 | 상고 논거 / 경쟁 의사 추론이라는 쟁점 / 두 기록과 위치 변화라는 법원 근거 |
| ZH-Hant | 날짜·구간·89 / 두 차의 좌측 이동 / 무감속·123 / 08초 이동·09초 충돌 / 1심이 구별한 두 운전자의 행위 | 영상이 상고 쟁점이 된 맥락 / 흑색 차 숫자 사용에 대한 이의 / 자체 영상이 근거였다는 고등법원 설명 |

같은 언어의 저장소 내 직전 번호 글 세 편의 도입·소제목·끝부분도 비교했습니다: KO 191·188·187, JA 191·188·185, EN 191·188·186, ZH 191·190·189. 이는 저장소 비교이며 실서비스 게시 순서까지 확인한 것으로 쓰지 않습니다. C6는 두 카메라, 41B 출구, 기록값과 추론의 차이를 따라 전개돼 범용 도입·기계적인 목록·반복 상담 권유가 없습니다.

이번 직접 수정: 없음. 위 E1–E6는 기존 반영 상태의 재확인이며 이번에 새로 적용한 변경이 아닙니다. 사실·숫자·조건·인용·출처·AI 고지는 그대로 보존됐습니다.

## 실행 검증

기본 Homebrew Node는 `libllhttp.9.3.dylib` 누락으로 실행되지 않았습니다. 시스템을 변경하지 않고 이미 설치된 `/Users/son7/.nvm/versions/node/v24.14.1/bin/node`로 모든 Node 검사를 실행했습니다.

작업 디렉터리: `/Users/son7/Projects/tseng-law-roadrage-20261003`.

```sh
PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH /Users/son7/.nvm/versions/node/v24.14.1/bin/node node_modules/vitest/vitest.mjs run src/components/__tests__/column-generated-video.test.tsx src/components/__tests__/column-video-autoplay.test.ts src/lib/__tests__/column-image-descriptions.test.ts src/lib/__tests__/column-category-parity.test.ts src/lib/__tests__/columns-publication-date.test.ts src/lib/__tests__/traffic-collection.test.ts 'src/app/[locale]/traffic-accidents/__tests__/traffic-board.test.tsx'
```

결과: 2026-10-04 05:01:19 KST 시작, 7개 파일 모두 통과, 376개 테스트 모두 통과, exit 0. 이전 FIX의 `applies URL filters and offers clear-all and an empty state` 테스트도 포함합니다.

추가 검사도 새로 실행했습니다.

- 프로젝트 `gray-matter` 파싱, TypeScript AST/registry 실제 반환값: PASS.
- 4개 원고의 날짜·title/H1·작성자·태그·고지·금지 마크업·판결 URL·미디어 경로 및 초안 본문 일치: PASS, 0 failures.
- 4개 MP4의 `ffprobe` 속성과 전체 디코딩: PASS.
- 지정 원고와 registry 대상 `git diff --check`: exit 0.
- 검수 중 4개 원고와 registry의 SHA-256 불변 확인: PASS.

검수된 자산의 SHA-256:

| 파일 | SHA-256 |
|---|---|
| `src/content/columns/192-taiwan-road-rage-freeway-chase-own-dashcam-too.md` | `49248a8abf4f7b20ea9fef27549591a20c2e196d6f79eea0925ae48c3943d5dc` |
| `src/content/columns-ja/192-taiwan-road-rage-freeway-chase-own-dashcam-too.md` | `1a6166935fe7c58d957941ed0d9431c101793190c84320b4db1458b29c7ed45f` |
| `src/content/columns-en/192-taiwan-road-rage-freeway-chase-own-dashcam-too.md` | `90991f491152cc99204798d5a7a6548e094c25e54d35123447721b5da2246515` |
| `src/content/columns-zh/192-taiwan-road-rage-freeway-chase-own-dashcam-too.md` | `d6d8a8802638997d6c63d109ed198a2b027ede058cc8611cd963f6b80a6b44cd` |
| `src/data/column-generated-videos.ts` | `afb7b89b9a2705cce4af2a8458e8872f30c94cb8b5ba67ec805bd1ad5a6cb5cd` |
| 게시용 hero WebP | `8b1eefd8b58097771e07523af4fa1ea646d26cdfa0a8e25fc3134827d06389e6` |
| 게시용 v3 KO MP4 | `29b70fb4aefdc11037ec6863b44e3aacfa4f21befcf040a22383c59239b7f970` |
| 게시용 v3 JA MP4 | `d7932f266db76337414f1d7d0f8f6e3aacf15059aeed964419f504ba990a7a9e` |
| 게시용 v3 EN MP4 | `18ca74aacedfdd1b5d6d871bdc2d0e3e017506529f9b7ebf0535fc065c078e3b` |
| 게시용 v3 ZH MP4 | `781f5600d6dc9cb5bda7244cea7b44e563b5215c3bcde4c25e6f653554a96ba3` |

지정된 검수 로그만 갱신했습니다. 검수용 추출 프레임은 임시 디렉터리에만 만들었습니다. 남은 필수 수정은 없습니다.

VERDICT: PASS
