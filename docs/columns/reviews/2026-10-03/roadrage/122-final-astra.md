# C3 통합 원고·미디어 최종 게시 전 검수

검수일: 2026-10-03
검수자: Codex, 요청된 Astra fallback 최종 게이트
대상: `taiwan-road-rage-reversing-into-tailgater-no-self-defense`, 116번 칼럼의 ko / ja / en / zh-hant 통합 파일과 미디어.

판정: 경미한 수정 적용 후 PASS. 남은 게시 차단 항목 없음. 이 판정은 아래에 특정한 원고와 미디어에 대한 검수 결과이며, 배포 실행이나 전체 사이트 클린 빌드·브라우저 화면 검증을 했다는 뜻은 아니다.

## 검수 범위와 기준

- `brief-SERIES.md`, `brief-EDITORIAL-VOICE.md`, 저장소 `AGENTS.md` 및 `docs/columns/EDITORIAL-VOICE.md`를 읽고 적용했다. 홈의 `~/agent-library/knowledge/editorial-voice.md`는 없었으며, 지정된 brief와 저장소 문체 사본은 바이트 단위로 일치했다.
- `fable-orchestration-legacy`와 `verification-before-completion` 규약에 따라 현재 Codex가 직접 검수했다. 추가 Fable 승인이나 사람의 원어민 검수를 받았다고 표시하지 않았다.
- 저장소 기준 경로는 `/Users/son7/Projects/tseng-law-roadrage-20261003/`이다. `src/content/columns`, `columns-ja`, `columns-en`, `columns-zh`의 `116-taiwan-road-rage-reversing-into-tailgater-no-self-defense.md` 네 파일을 전문으로 읽었다.
- `src/data/column-generated-videos.ts`의 해당 slug에 대한 네 `column/<lang>/...` 등록값, 공개 hero WebP, 15개 시점의 `video/C3-v3-frames.jpg`, ko/en 지정 포스터 및 추가 ja/zh-hant 포스터를 이미지 도구로 직접 확인했다.
- 공개 영어 MP4에서 0.0 / 5.0 / 10.0 / 14.8초 프레임을 별도로 디코딩하여 원본 크기로 확인했다. 임시 검수 프레임만 `/private/tmp/c3-final-media-4_1upwmr/`에 만들었고 배포 미디어는 수정하지 않았다.
- 기존 en/ja/ko Fable r1 및 zh-hant Astra r1~r3의 판정·지적을 참조했다. 수정 전 네 통합 파일의 본문은 각 `drafts/C3/<lang>.md` 본문과 정확히 일치했다. 기존 통과 판정만으로 승인하지 않고 이번 통합값과 미디어를 직접 대조했다.
- `cases/cases-manifest.json`의 C3 항목, `cases/jud/62.txt`, `cases/jud/346.txt`, `cases/statutes.md`를 이용하여 핵심 수치·인용·법원 판단 범위를 확인했다. 이번 단계는 본문 전체의 법률 사실 검수를 새로 대체하는 작업이 아니라 통합 상태와 주요 사실의 재대조다.

## 1. Frontmatter와 금지 항목

네 파일 모두 실제 사이트 의존성 `gray-matter`로 파싱했으며, PyYAML로도 파싱했다.

| 검사 | ko | ja | en | zh-hant |
|---|---|---|---|---|
| 유효한 YAML, `author: legal-ai-assistant` | PASS | PASS | PASS | PASS |
| `published`·`lastmod` 2026-10-03, 현지어 표시 날짜 일치 | PASS | PASS | PASS | PASS |
| `title`과 유일한 Markdown H1 일치 | PASS | PASS | PASS | PASS |
| `traffic-accidents` 태그 존재 | PASS | PASS | PASS | PASS |
| TBD·IMAGE_PATH 및 굵은 강조 문법 없음 | PASS | PASS | PASS | PASS |
| 전화번호·당사자 실명·변호사/사람 원어민 검수 주장 없음 | PASS | PASS | PASS | PASS |
| 끝줄의 현지어 AI 작성 고지와 확인 날짜 | PASS | PASS | PASS | PASS |
| hero·social 경로 일치 및 공개 파일 존재 | PASS | PASS | PASS | PASS |

`**`, `__`, `<b>`, `<strong>` 우회 표기도 없었다. 당사자는 A/B차 및 역할로만 지칭하며, 구체적인 건강·가족·소득·학력·직업 정보나 정확한 주소를 추가하지 않았다. 검수 과정의 언어 평가는 AI의 판단이며 사람의 원어민 검수로 표시하지 않는다.

최종 원고의 판결 링크 수는 ko 14, ja 15, en 16, zh-hant 47개다. 모든 판결 링크는 manifest의 아래 두 문자열 중 하나와 정확히 일치한다.

- [臺灣新北地方法院113年度訴字第513號, 2025-03-25](https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=PCDM%2C113%2C%E8%A8%B4%2C513%2C20250325%2C1)
- [臺灣高等法院114年度上訴字第3183號, 2025-11-12](https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=TPHM%2C114%2C%E4%B8%8A%E8%A8%B4%2C3183%2C20251112%2C1)

법령 링크는 모두 `statutes.md`에 있는 단일 조문 URL이다. 중국어 블록 인용은 ko 2개, ja 3개, en 2개, zh-hant 2개 모두 판결 원문에 연속 문자열로 존재한다. 인용문은 수정하지 않았다.

## 2. 이미지·영상과 설명의 일치

공개 hero는 1600×900 WebP, 132,278바이트다. 차 안에서 본 밤의 젖은 시내 도로, 가까운 짙은색 세단의 뒷모습과 붉은 제동등이 보인다. 네 언어의 alt는 이 관찰에 부합한다. 접근성 텍스트와 소셜 이미지 alt만 따로 읽어도 생성 이미지임을 알 수 있도록 AI 가상 장면 표기를 추가했다. 캡션은 모두 AI로 생성한 가상 장면이며 실제 사진이나 판결 속 사건의 재현이 아니라고 명시한다.

영상에서는 앞 세단과의 간격이 처음 벌어졌다가 다시 좁아지고, 인접 차로의 차량들이 지나가며, 후반부 전방 신호가 빨간색에서 녹색으로 바뀐다. 네 제목·설명은 이 움직임을 정확히 기술한다. 영상만으로 확정하기 어려운 후진, 실제 충돌, 충돌 횟수, 운전자의 의도, 경적 소리를 설명에 추가하지 않았다. 영상의 젖은 시내 도로를 실제 사건의 도로·기상으로 소개하지도 않는다.

네 disclosure 모두 다음을 현지어로 자연스럽게 구별한다.

- AI로 생성한 가상 장면이며 실제 블랙박스 영상이나 판결 인정 사실의 재현이 아님.
- REC는 후처리 연출이고 카운터는 재생 경과 시간임.
- 거리·속도·동작 시점은 예시이며 실제 사건의 과실 판단 자료가 아님.

ko의 간격 설명, ja의 `車間` 및 신호색 `青`, en의 `widens, then narrows`, zh-hant의 `車距`·`號誌`·`循環播放`가 각각 자연스럽다. 사람 이름이나 기관·장소를 특정하는 생성 장면 설명은 없다.

포스터의 REC / 00:00:01.5 / 현지어 AI 고지는 읽을 수 있고 잘리지 않았다. ja는 `AIで作成した架空の場面・実際の事件の映像ではありません`, zh-hant는 `AI生成的虛構情境・非真實案件影像`로 표시된다. 네 공개 포스터는 제공 작업 폴더의 대응 포스터와 바이트 단위로 일치했다.

히어로, 제공된 1초 간격 프레임 15개, 네 포스터 및 추가 원본 크기 프레임에서 판독 가능한 당사자 번호판이나 실재 대상을 이름으로 특정하는 글자를 발견하지 못했다. 주변 차량도 함께 확인했다. 표지·간판에는 흐리거나 의미를 판독할 수 없는 형태가 있지만 읽을 수 있는 실명·지명·상호는 확인되지 않았다. 식별 가능한 실인물, 상처·유혈·잔혹한 장면은 없다. 이는 열거한 이미지·샘플 프레임의 시각 검수 결과이며, MP4의 모든 프레임을 개별 육안 검사했다는 주장은 아니다.

| 공개 MP4 언어 | 실제 길이 | 크기 | 파일 크기 | 오디오 |
|---|---|---|---|---|
| ko | 15.041667초 | 1280×720, H.264, 24fps | 2,584,669바이트 | 없음 |
| ja | 15.041667초 | 1280×720, H.264, 24fps | 2,589,642바이트 | 없음 |
| en | 15.041667초 | 1280×720, H.264, 24fps | 2,580,109바이트 | 없음 |
| zh-hant | 15.041667초 | 1280×720, H.264, 24fps | 2,579,508바이트 | 없음 |

`ffprobe` 실측과 설명의 “약 15초·무음”이 일치한다. 해당 네 등록값은 실제 공개 파일을 가리킨다. 실제 `ColumnGeneratedVideo` 컴포넌트를 네 언어로 정적 렌더링하여 title/description/disclosure가 모두 출력되고, `controls`, `muted`, `loop`, `preload="none"`이 있으며 `autoplay`는 없음을 확인했다. `aria-describedby`도 실제 캡션 ID와 일치한다. 따라서 “재생 버튼을 누르면 반복”이라는 설명과 맞는다. 이미지 캡션 역시 `ColumnDetailView`에서 출력되고 이미지의 `aria-describedby`에 연결되는 코드를 확인했다. CSS와 브라우저 배치는 이 정적 렌더링 검사의 범위가 아니다.

## 3. 언어 간 핵심 사실·수치

| 항목 | 네 언어 및 원문 대조 |
|---|---|
| 사건 날짜·주요 시작 | 2023-01-21, 22:14:02 차로 변경·경적. 22:14:17 첫 급감속으로 15초 차이. |
| 뒤차 행동 | 경적 약 2초, 22:14:22~23 상향등 약 2초 및 경적 1회. |
| 위험 운전 횟수 | 급감속 2회 + 급정지 5회 + 후진 충돌 3회 = 10회. |
| 지속 시간 | 22:14:17~22:17:45 = 208초, 즉 3분 28초. 네 원고의 “3분 넘게”와 일치. |
| 세 번의 후진 충돌 | 22:15:44~45 / 22:17:02~05 / 22:17:37~45. 두 번째 충돌 후 22:17:06 밀기, 22:17:08 후진 종료도 일치. |
| 영상상 마지막 분리 | 22:21:03 A 우회전·B 직진. 완화까지 추격했다는 말은 피고인 주장으로 구별. |
| 법원 영상 검증 | 2024-11-07. 사건일·판결일과 혼동하지 않음. |
| 1심 | 113年度訴字第513號, 2025-03-25. 공중왕래안전방해죄로 징역 5개월, 易科罰金 1일 NT$1,000. |
| 2심 | 114年度上訴字第3183號, 2025-11-12. 항소 기각·1심 유지. |
| 죄수·양형 | 강제·손괴도 성립하되 가장 무거운 죄로 처벌. 세 개 형을 합산했다고 쓰지 않음. |
| 환산 제도 | 법정 최고형 5년 이하, 선고형 6개월 이하 등 조건·예외, 일일 NT$1,000/2,000/3,000 기준을 유지. |
| 상소·확정 | 송달 후 20일 상소 안내. 후속 상소 여부·확정 여부를 단정하지 않음. |
| 민사·행정 | 민사 배상액·견적 금액을 만들지 않음. NT$6,000~36,000, 번호판 6개월 제재는 제43조 배경일 뿐 실제 처분으로 단정하지 않음. |

형법 제185조 벌금 상한 NT$15,000은 en/zh-hant에 명시되고 ko/ja에서는 벌금형 존재만 설명한다. 세부정보의 생략이며 수치 충돌은 아니다. 기존 2심 문장에 기록된 시각으로부터 구한 5초의 선후도 법원의 별도 판단으로 바꾸지 않았다.

현행 금액·제도 교차확인을 위해 공식 법규 사이트의 [형법 제41조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=41), [형법 제185조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=185), [도로교통안전규칙 제94조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=94), [도로교통관리처벌조례 제43조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=43)를 열었다. 이번 원고에서 설명한 조건·금액과 충돌하는 내용을 발견하지 못했다. 후속 재판이나 확정 상태를 새로 조회했다는 뜻은 아니다.

## 4. 직접 적용한 경미한 수정

| 원문 | 문제와 이유 | 적용 수정 | 의미 보존 |
|---|---|---|---|
| ko alt `차 안에서 본 밤의 젖은 시내 도로에…` | alt만 따로 읽으면 생성 장면이라는 정보가 없음. | `AI로 만든 가상의 장면입니다. `를 앞에 추가. | 기존 시각 묘사·캡션 유지. |
| ja alt `車内から見た夜の濡れた市街地の道路で…` | 같은 접근성·소셜 alt 문제. | `AIで生成した架空の場面です。`를 앞에 추가. | 기존 시각 묘사·캡션 유지. |
| en alt `From inside a car, a dark sedan…` | 같은 문제. | `AI-generated fictional scene: from inside a car, a dark sedan…` | 대문자 조정 외 기존 묘사 유지. |
| zh-hant alt `從車內望向夜間潮濕的市區道路…` | 같은 문제. | `AI生成的虛構場景：`를 앞에 추가. | 기존 시각 묘사·캡션 유지. |
| ja `後ろの車が前の車の自由な走行を妨げることは、もともとありえません。` | 뒤차는 언제나 앞차를 방해할 수 없다는 일반론으로 읽힐 여지. | `本件の勘験結果から、裁判所はB車がA車の自由な走行を妨げていたとは認めませんでした。` | 이 사건 증거에 따른 법원 판단으로 귀속. 당사자·결과·근거·정당방위 요건은 그대로. |
| en 영상 검증 소개·횟수 집계·증거 목록·항소 이유 인용 도입·B차 진술·반대 고소 불기소·1심 형량 문단 | 일부 사실 묶음과 직접 인용에서 근거 판결 링크가 멀리 있거나 해당 위치에 없었음. | 기존 manifest URL을 해당 일곱 위치에 추가. | 기존 본문 문구·숫자·인용을 수정하지 않고 출처 위치만 보완. |

수정 후 ko/zh-hant 본문은 기존 통과 초안과 여전히 동일하다. ja 본문은 위 한 문장만 달라졌다. en 본문은 추가된 판결 인용을 제거하면 기존 통과 초안과 정확히 같다. 네 이미지 캡션과 네 영상 등록값은 변경하지 않았다.

첫 두 문단은 사건 시각·A/B 역할·행동 순서·지속 시간·도로 구성·차량 손상 등을 각각 추가하므로, 정보 없이 반복되는 범용 도입문을 발견하지 못했다. 현지어 제목·소제목·끝맺음도 읽었으며, 기계적 체크리스트나 상담 권유를 추가하지 않았다. 저장소의 직전 게시일/번호 순 세 글과 도입·소제목을 비교했다: ko 110/109/099, ja 115/111/109, en 112/109/108, zh-hant 114/113/109. 실제 서비스의 실시간 정렬을 확인했다는 뜻은 아니다.

## 5. 실행 검증

아래 관련 테스트는 기존 NVM Node v24.14.1로 실행하여 5개 파일, 306개 테스트 모두 통과했다.

```sh
/Users/son7/.nvm/versions/node/v24.14.1/bin/node node_modules/vitest/vitest.mjs run \
  src/lib/__tests__/column-category-parity.test.ts \
  src/lib/__tests__/columns-publication-date.test.ts \
  src/lib/__tests__/traffic-collection.test.ts \
  'src/app/[locale]/traffic-accidents/__tests__/traffic-board.test.tsx' \
  src/components/__tests__/column-generated-video.test.tsx --reporter=dot
```

추가 일회성 검사에서 네 YAML·제목·날짜·작성자·태그·금지 표기·판결 URL·법령 URL·미디어 존재·네 C3 영상 컴포넌트 출력이 전부 통과했다. 레지스트리 TypeScript 전환 진단은 0건이었다. 해당 파일들의 `git diff --check`도 통과했다. 새 칼럼 파일이 untracked인 점을 고려해 위 본문 대조와 파일 직접 검사를 별도로 수행했다.

초기 기본 `node`는 Homebrew의 `libllhttp.9.3.dylib` 누락으로 실행되지 않아 이미 설치된 NVM Node를 명시했다. 시스템 런타임은 고치지 않았다. 일회성 검수 도구의 최초 JSON default import 설정 오류는 `esModuleInterop`을 맞춰 해소한 뒤 다시 실행했으며, 위 결과는 성공한 최종 실행의 결과다.

이번에 직접 편집한 배포 소스는 지정된 네 Markdown 파일뿐이다. 기존 미커밋 레지스트리·테스트·임베딩 장부와 미디어는 그대로 두었다. 커밋·스테이징·배포는 수행하지 않았다.

## 최종 파일 SHA-256

| 파일 | SHA-256 |
|---|---|
| 116 ko | `b0025a337a766cd4f879ff921f68010879e125b94ce40673be2033a74a0b9783` |
| 116 ja | `593d152ca6e69b3b392bcb256fce288cc1cb999d49ebe78534157dd0595db515` |
| 116 en | `50f6974dde7ac078849dc907566f9b807bb6675c22414ffcd131e5fe18a866f3` |
| 116 zh-hant | `46fc1f700ae93f48ab6ac3bad67804d3f7d8a8b6a901e714287ce78e46012d54` |
| `src/data/column-generated-videos.ts` (검수 전후 동일) | `0b056accd5dadfbed390553aeb9347343a0f561fcd41438c8c3851f55df67d58` |
| 공개 hero WebP | `3687ec8e8fe20cbea49a6ea6843019731dee674f85685ce24150920b4d40e32d` |
| 공개 v3 ko MP4 | `ea100a07322372312ba17f6d98a556e8c85b97596c7559c56765e78f31211e90` |
| 공개 v3 ja MP4 | `650204be88457458845de076bad262b8ae087bdf47d62a246927064ce5b4983a` |
| 공개 v3 en MP4 | `1bc76a1ab70dc6d663661ececeb7495f76a49d74a8f033f0edcbecb7f2cb0b56` |
| 공개 v3 zh-hant MP4 | `bffb089b0d9741d4a9472739cc068a44df6b64990598bec01ffa64892be65d86` |

VERDICT: PASS
