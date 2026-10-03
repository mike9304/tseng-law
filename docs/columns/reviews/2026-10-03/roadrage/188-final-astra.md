# C7 통합 파일·미디어 최종 게시 전 검수

검수일: 2026-10-04 KST

검수자: Codex, Astra 대체 최종 게이트. 현재 사용자 지시에 따라 직접 판정했다. 아래 PASS는 경미한 영상 설명 수정과 수정 후 검증을 완료한 파일에 대한 판정이다.

## 범위와 근거

- `brief-SERIES.md`, `brief-EDITORIAL-VOICE.md`, 저장소 `docs/columns/EDITORIAL-VOICE.md`를 읽었다. 홈의 `~/agent-library/knowledge/editorial-voice.md`는 존재하지 않았다. 저장소 사본의 공개 AI 작성자 표기 관련 지시와 이번 요청이 다른 부분은, 이번 요청의 명시적 요건인 `author: legal-ai-assistant`와 글 끝 AI 작성 고지 보존을 우선했다.
- 저장소 `src/content/columns`, `columns-ja`, `columns-en`, `columns-zh`의 `168-taiwan-road-rage-started-did-not-matter-driver-blocked.md` 네 파일을 읽고, `src/data/column-generated-videos.ts`의 이 slug에 해당하는 ko / ja / en / zh-hant 네 항목을 확인했다.
- 네 본문은 현재 `drafts/C7/<lang>.md`의 본문과 문자 단위로 동일하다. 기존 검수 기록의 판정과 지적을 참조하고, EN r2에서 해결한 선행행위·강제죄 일반화·조정과 민사배상 구별 및 JA r2의 인용 위치 수정이 통합본에 남아 있음을 확인했다. 이번 판정은 현재 파일을 직접 읽고 검증한 결과다.
- `cases/cases-manifest.json`의 C7 항목과 `cases/jud/18.txt` 원문을 읽어 핵심 사실과 수치를 대조했다. 판결문 본문의 사인 식별정보를 공개 글이나 이 로그에 재기재하지 않았다.
- 이미지 보기 도구로 실제 게시용 WebP, 지정된 15프레임 시트, KO·EN 포스터를 직접 확인했다. JA·ZH 포스터도 추가 확인했다. 게시용 EN MP4의 2.5·3.5·4.5·15.0초 프레임을 원해상도로 추출해 동작·끝 프레임·표기를 확인하고, 히어로와 마지막 프레임의 차량 후면을 확대 확인했다. 검사용 추출물은 임시 디렉터리에만 만들었다.

## 1. Frontmatter와 출처

저장소가 사용하는 `gray-matter`로 네 파일을 파싱했다. 네 파일 모두 유효한 YAML이며 다음 항목이 통과했다.

| 항목 | 결과 |
|---|---|
| 작성자 | 네 파일 모두 `legal-ai-assistant` |
| 날짜 | `published`, `lastmod` 모두 `2026-10-03`; 언어별 `date_display`도 2026년 10월 3일 |
| 제목 | 각 파일의 `title`과 유일한 본문 H1이 정확히 일치 |
| 태그·독자 언어 | `traffic-accidents` 포함, 각 `audience`가 ko / ja / en / zh-hant와 일치 |
| 플레이스홀더 | TBD, IMAGE_PATH, ALT_TBD, CAPTION_TBD, TODO, FIXME 없음 |
| 미디어 경로 | 히어로·소셜 이미지 경로가 실제 1600×900 WebP로 연결됨 |
| 판결 링크 | KO 13개, JA 24개, EN 13개, ZH 22개, 총 72개 모두 manifest의 printData URL과 문자 단위 일치 |

확인한 판결은 [臺灣士林地方法院115年度易字第383號刑事判決, 2026-06-26](https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=SLDM%2C115%2C%E6%98%93%2C383%2C20260626%2C1)이다. 영어 `seoTitle`은 별도의 검색용 제목이며 `title`과 H1의 일치 요건에 영향을 주지 않는다. 법령 링크는 해당 조문을 가리키는 `law.moj.gov.tw` 단일 조문 URL이다.

## 2. 공통 금지 규칙과 AI 고지

자동 검사와 네 언어 본문의 직접 독해를 함께 수행했다.

- `**`, `__`, `<b>`, `<strong>` 없음.
- 전화번호, 사인 이름, 번호판 식별번호, 정확한 주거 주소, 당사자의 건강·가족·소득·학력·구체적 직업 정보 없음. 사건 관계자는 피고인·고소인·운전자 등 역할로 서술한다.
- 변호사 검토·인간 원어민 검수 완료 주장, 상담 영업 문구, 근거 없는 외국법 비교 없음.
- 네 파일 마지막 줄에 해당 언어의 AI 작성 고지와 자료 확인일이 있다.
- 형사상 두 죄의 성립과 하나의 처벌, 행정처분의 배경 설명, 민사배상이 이 판결에서 정해지지 않았다는 점을 구별한다. 확정 판결이나 실제 벌금 납부로 확대하지 않는다.

## 3. 이미지·영상 설명과 실제 화면

히어로는 낮의 내리막길을 차 안에서 보는 구도다. 회색 세단이 비스듬히 멈춰 있고 앞문이 열려 있으며, 긴 막대를 든 사람이 문 옆에 서 있다. 네 언어 alt는 이 관찰과 맞는다. 실제 사건의 날씨·차종·외모로 연결하거나 막대의 종류를 판결 속 야구방망이로 단정하지 않는다.

네 히어로 캡션은 모두 AI로 생성한 가상 장면이며 사건의 현장 사진이나 재현 이미지가 아니라고 명시한다. alt와 캡션은 화면 설명과 출처 고지의 역할을 나누며, 실제 컴포넌트는 이미지의 `aria-describedby`로 캡션을 연결한다.

영상에서는 같은 구도의 사람이 문 쪽으로 빈손 쪽 팔을 뻗었다가 내리고, 시점이 가까워지며 차와 사람이 커진다. 약 3~4.5초에는 막대를 쥔 팔도 바깥쪽으로 함께 움직인다. 현 설명은 다른 팔이 움직이지 않는다고 하거나, 문을 열고 닫거나 사람·차량을 때린다고 주장하지 않는다. 영상 title·description의 장면 설명에 만들어낸 대사, 사건 시간, 두 번의 차단, 실제 역주행 장면은 없다.

각 영상 disclosure는 AI 가상 장면, 실제 블랙박스/사건 영상이 아님, 판결 사실관계의 재현이 아님을 명시하며 거리·속도·시간 표현으로 실제 사건의 책임을 판단할 수 없다는 한계를 보존한다. 네 언어의 alt·caption·title·description·disclosure를 직접 읽었고, 아래 재생 방식 문구 외에 필수 수정할 번역투나 의미 차이를 찾지 못했다. 인간 원어민 검수로 표시하지 않는다.

게시용 MP4 네 개는 모두 H.264, 1280×720, 24fps, 361프레임, 길이 15.041667초다. 오디오 스트림은 없다. 따라서 ‘약 15초’, ‘무음’이라는 설명은 정확하다. 네 항목 모두 `loop: true`이며 실제 컴포넌트 렌더에도 반복 재생 설정이 전달된다.

게시용 MP4 및 JPG 각각은 해당 `video/out-v3/C7-<lang>` 파일과 SHA-256이 동일했다. 지정 프레임 시트는 15개 장면이며 마지막 16번째 칸의 검정 부분은 배열의 빈 칸이다. 실제 MP4의 마지막 프레임은 정상 장면이다.

## 4. 시각적 식별정보와 표현 수위

- 히어로와 확인한 영상 프레임·포스터에서 번호판은 비어 있거나 흐려져 있어 읽을 수 없다. 멀리 있는 차량 번호도 판독되지 않는다.
- 도로 표지판에는 읽을 수 있는 지명이나 실제 명칭이 없다. 확대 확인한 차량 후면의 작은 문자 모양도 실제 브랜드·모델명을 명확히 읽을 수 있는 표기가 아니다.
- 인물은 주로 뒷모습이며, 실제 개인을 식별할 수 있는 얼굴이나 이름이 보이지 않는다. 피고인이나 피해자의 실제 모습이라고 연결하는 문구도 없다.
- 피, 상처, 타격, 충돌 등 잔혹한 장면이 없다.
- 읽히는 영상 오버레이는 `REC`, 상대 경과 시간, 각 언어의 AI 가상 장면/실제 사건 영상 아님 고지다. 실제 사건의 날짜나 장소를 표시하지 않는다. KO·EN의 지정 포스터와 추가 확인한 JA·ZH 포스터 모두 고지가 화면 안에 선명히 들어간다.

시각 검수는 지정된 전체 구간 1초 간격 프레임 시트와 추가 원해상도 표본을 기준으로 했다. 모든 프레임을 개별 육안 검수했다고 주장하지 않는다. 전체 네 MP4의 디코딩은 오류 없이 완료했다.

## 5. 네 언어 핵심 사실·수치 대조

| 대조 항목 | KO / JA / EN / ZH 공통 결과 |
|---|---|
| 사건·선고일 | 士林地方法院 115年度易字第383號, 2026-06-26 |
| 두 장면 사이 | 고소인이 계속 운전한 6분. 길을 막고 있던 지속시간으로 쓰지 않음 |
| 첫 장면의 물건 | 정체가 특정되지 않은 막대 모양 물체 |
| 두 번째 장면의 물건 | 나무 야구방망이 |
| 증거 수량 | 광디스크 1장, 캡처 10장 |
| 인정된 죄 | 형법 304조 1항 강제죄 및 305조 협박죄. 더 무거운 강제죄로 처벌; 협박 무죄 아님 |
| 선고형 | 유기징역 3개월 |
| 易科罰金 | 1일 NT$1,000 환산. 납부 총액이나 실제 납부 여부를 만들어내지 않음 |
| 몰수 | 압수된 방망이 1개 |
| 상소 | 송달 후 20일. 실제 상소·확정 여부는 알 수 없다고 한정 |
| 민사·행정 결과 | 민사배상액 및 실제 교통 행정처분을 이 판결의 결과로 쓰지 않음 |

법령 배경의 분량은 언어마다 다르지만 수치 충돌은 없다. KO·EN의 도로교통관리처벌조례 43조 설명은 이 판결에서 적용한 처분이 아닌 배경임을 표시한다. 해당 [공식 43조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=43)를 추가 조회해 NT$6,000~36,000, 현장 운전 금지, 번호판 6개월 영치가 설명과 일치함을 확인했다. 네 언어의 환산 제도 설명도 [공식 형법 41조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=41)의 요건·세 가지 일일 환산액·예외와 맞는다.

## 경미한 수정 — 적용 완료

대상: `src/data/column-generated-videos.ts`의 이 slug 네 항목 `description` 마지막 문장만 수정했다. 다른 slug와 속성은 변경하지 않았다.

문제와 이유: 원문은 모두 독자가 재생 버튼을 누른 뒤 반복 재생된다고 설명했다. 그러나 실제 칼럼은 교통 칼럼에 `autoPlay={isTrafficColumn}`을 전달하고(`ColumnDetailView.tsx:127`), 영상이 보이면 자동 재생을 시도한다. 브라우저 정책이나 동작 줄이기 설정에 따라 수동 재생이 필요할 수 있으므로, 시작 방식을 단정하지 않고 길이·무음·반복 여부만 설명하도록 고쳤다.

| 언어 | 원문 | 수정안 |
|---|---|---|
| KO | 소리 없는 약 15초 영상으로, 재생 버튼을 누르면 반복 재생됩니다. | 소리 없는 약 15초 영상이 반복 재생됩니다. |
| JA | 約15秒の無音動画で、再生ボタンを押すと繰り返し再生されます。 | 約15秒の無音動画が繰り返し再生されます。 |
| EN | This silent clip lasts about 15 seconds and loops after you press play. | This silent clip lasts about 15 seconds and plays on a loop. |
| ZH | 這段無聲影片長約15秒，按下播放鍵後會循環播放。 | 這段無聲影片長約15秒，會循環播放。 |

의미 보존: 장면·동작·영상 길이·음성 유무·반복 설정·AI 고지는 유지했다. 판결 관련 사실·조건·수치·인용·법적 강도는 바꾸지 않았다. 네 칼럼 파일과 미디어는 수정하지 않았다.

## 수정 후 검증과 판정 범위

- TypeScript를 메모리에서 컴파일하고 실제 `getColumnGeneratedVideo()`를 호출해 네 언어의 정확한 자산 선택, 중복 없는 키, 파일 존재, 반복 설정을 확인했다. 같은 slug의 `issue` 항목으로 잘못 선택되지 않는 것도 확인했다.
- 실제 `ColumnGeneratedVideo`를 네 언어로 SSR 렌더해 src·poster, title·수정된 description·disclosure, `loop`, `controls`, `muted`, `aria-describedby`, AI 고지가 출력됨을 확인했다.
- 수정 후 관련 기존 테스트 5개 파일, 302개 테스트 통과: `column-generated-video.test.tsx`, `column-video-autoplay.test.ts`, `column-seo-title-frontmatter.test.ts`, `column-native-date-display.test.ts`, `column-emphasis.test.ts`.
- 실행 명령: `/Users/son7/.nvm/versions/node/v24.14.1/bin/node node_modules/vitest/vitest.mjs run src/components/__tests__/column-generated-video.test.tsx src/components/__tests__/column-video-autoplay.test.ts src/lib/__tests__/column-seo-title-frontmatter.test.ts src/lib/__tests__/column-native-date-display.test.ts src/lib/__tests__/column-emphasis.test.ts` — exit 0. 기본 Homebrew Node는 llhttp 라이브러리 문제로 실행되지 않아 이미 설치된 NVM Node를 사용했다. 시스템 설정은 변경하지 않았다.
- `ffprobe`로 네 영상 속성을 확인했고 `ffmpeg -v error -i <게시용 MP4> -f null -`은 네 파일 모두 exit 0, 오류 출력 없음.
- 검수 시작 시 저장한 registry와 대조한 diff는 C7의 네 description 한 줄씩뿐이다. 네 칼럼 파일의 SHA-256은 검수 시작과 동일하다. 지정 파일에 대한 `git diff --check`도 exit 0이다.
- 이번 작업의 저장소 수정은 위 네 문구뿐이다. 본 검수 로그 외의 작업 자료는 임시 디렉터리에만 만들었다. 기존 다른 변경 파일은 건드리지 않았다.
- 전체 사이트 빌드·실브라우저 페이지 검수·배포는 이번 파일/미디어 검수의 실행 범위가 아니며 수행했다고 주장하지 않는다. 이 판정은 아래 버전의 통합 콘텐츠와 미디어에 대한 게시 전 게이트다.

최종 파일 SHA-256:

| 대상 | SHA-256 |
|---|---|
| KO 칼럼 | `fa7c53d5916d5bcf5c0da459a419c88aafb428f16416c999491e56d91e1a5fef` |
| JA 칼럼 | `f215a5e2e1521392701169926e517c0ce6b02525bd839108b214d73e9657c0ef` |
| EN 칼럼 | `88e525035a69f7a6e902139be82e9c4914cc04c5e8f944c220edf75f4b71ff1d` |
| ZH 칼럼 | `898d9d897ee5369ba8b5948a9e35bed094ec7da1f222aaa9431316ff52392534` |
| 영상 registry 전체 | `521b3b0996e0583680dc8e7d08db8b7de004eb81c92fdbe5161b4cd32211934f` |
| 게시용 hero WebP | `b2d1c0ea91bcdbc946e55cbccd09765d0179c296e79764c2b46da4efff263f80` |

남은 필수 수정 사항: 없음. 경미한 재생 설명 수정은 적용·재검증 완료.

VERDICT: PASS
