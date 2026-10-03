# C4 최종 배포 전 통합 검수 (Fable 5.1) — 2026-10-03

대상: `099-taiwan-road-rage-freeway-cut-in-sentence-reduced.md` ko / ja / en / zh-hant, 영상 레지스트리 4항목, hero WebP, 프레임 시트, 포스터 4종.
저장소: /Users/son7/Projects/tseng-law-roadrage-20261003
이전 기록: en-astra-r1~r3, en-fable-r4, ko-fable-r1~r2, ja-fable-r1, zh-hant-fable-r1, final-astra(FIX, 당시 파일명 094-…) 확인.

## 결론 요약

본문·미디어·레지스트리 모두 게시 가능. 영문 영상 설명 한 문장만 직접 수정했다(아래). final-astra가 FIX로 남겼던 테스트 보조 목록 누락(`EXPERTISE_SLUGS_20260930`에 `ROAD_RAGE_COLUMN_FILES_20261003` 미포함)은 현재 소스 `src/lib/__tests__/native-locale-columns.ts:346`에 반영되어 있고, 파일명도 099로 통일되어 있다.

## 1. frontmatter

| 항목 | ko | ja | en | zh |
|---|---|---|---|---|
| author | legal-ai-assistant | 동일 | 동일 | 동일 |
| published / lastmod | 2026-10-03 / 2026-10-03 | 동일 | 동일 | 동일 |
| date_display | 2026년 10월 3일 | 2026年10月3日 | October 3, 2026 | 2026年10月3日 |
| tags | traffic-accidents, traffic-liability | 동일 | 동일 | 동일 |
| title == H1 | 일치 | 일치 | 일치 | 일치 |
| TBD / IMAGE_PATH / TODO | 없음 | 없음 | 없음 | 없음 |

- YAML은 모두 큰따옴표 문자열·배열로 구성돼 구조상 문제 없음(인용부호 안 콜론은 ja·en·zh alt에만 있고 따옴표로 감싸져 있음). 저장소 gray-matter 실행은 이 세션의 권한 제한으로 하지 못했고, final-astra 기록이 동일 구조에서 파싱 통과를 확인한 바 있음.
- featured_image / social_image 경로의 파일이 실제로 존재함(`public/images/columns/20261003/…-hero-1600x900.webp`, 75,804 bytes).
- en만 `seoTitle` 보유. 다른 언어는 제목 길이 문제 없음.

## 2. 하드 룰

- 굵은 강조(`**`, `__`, `<b>`, `<strong>`): 4개 파일 grep 결과 0건.
- 전화번호 패턴: 0건.
- 당사자 실명: 판결문의 피고 ○○○·피해자 ○○○, 로마자 표기, 차량번호 패턴 모두 4개 파일과 레지스트리에서 0건. 차량 번호는 판결문 자체가 000-0000으로 익명화.
- 변호사·원어민 검토 주장: 0건. 각 검수 로그도 "AI 검수"로만 표기.
- AI 작성 표기: ko 105행, ja 123행, en 112행, zh 126행에 각 언어 문장으로 존재. 자료 확인일 2026-10-03.
- 판결 링크: 4개 파일에 등장하는 judgment.judicial.gov.tw URL은 manifest C4의 두 printData URL(TPHM 114 上訴 5567 / PCDM 113 審訴 716)과 문자열 단위로 동일하고, 두 판결이 모든 언어에 들어 있음.
- 법령 링크는 모두 law.moj.gov.tw 단일 조문 링크. 제33조·제43조는 "배경 설명, 판결 미적용"으로 표시됨(규칙 5 준수).
- 사생활(규칙 11): 판결의 高職畢業·정신질환·保全/外送員은 4개 파일에 없음. "본인이 밝힌 개인 사정과 생활 형편", "個人與家庭生活狀況", "personal circumstances", "個人的な事情や生活状況"처럼 포괄 표현만 사용. zh의 "家庭生活狀況"은 구체 사실을 담지 않아 허용 범위로 봄.
- "검은색 벤츠 (E200) 택시", "路肩", "30초·1~2분·3~5회"는 모두 고등법원 판결 三㈠의 피고 경찰 진술 인용이며, 4개 언어 모두 "피고 측 설명"임을 명시함.
- 판매 CTA·훈계·체크리스트형 소제목 없음. 독자 참여 문장은 각 언어 1회.

## 3. alt / caption / 영상 문자열

hero(1600×900 WebP)를 직접 보았다: 차 안 앞유리 시점, 바로 앞 흰색 탑차(후미등 적색 점등), 왼쪽 차로 짙은 회색 세단, 오른쪽 차로 흰색 SUV, 원경 고가도로·고층 건물. 4개 언어의 alt는 이 요소만 기술하고 "AI 가상 장면" 선언으로 시작함. caption 4종 모두 "AI 가상 장면 / 실제 사건 사진 아님 / 판결 인정 사실 재현 아님"을 담음. 급제동·자동 제동 등 정지 이미지로 확인 불가한 내용은 없음.

프레임 시트(실제 장면 10칸 + 빈 칸 2칸)와 포스터 4종을 직접 보았다: 흰색 탑차가 처음 왼쪽 차로 경계선에 걸쳐 있다가 오른쪽으로 틀어 카메라 앞 차로로 들어오고, 차간이 줄어 마지막에 화물칸 뒷문이 화면 중앙을 채움. 양옆 세단·SUV는 계속 주행. 레지스트리 4개 title/description은 이 흐름과 일치하며 자동 제동·속도·횟수 등 영상에서 확인 불가한 주장을 하지 않음. "소리 없는 약 5초, 반복 재생"은 final-astra의 ffprobe 기록(5.04초, 오디오 스트림 없음, 1280×720)과 `loop: true`에 부합.

disclosure 4종: AI 가상 장면 / 실제 블랙박스 아님 / 판결 사실 재현 아님 / 거리·속도·시간은 예시 — 네 언어 모두 포함. 실명 없음.

직접 수정 1건(허용 범위 내, 레지스트리 en 항목):
- 원문: `A white box truck straddling the line with the left lane angles to the right and moves into the lane directly ahead.`
- 문제: "straddling the line with the left lane"은 영어로 부자연스럽고 어느 선인지 불명확.
- 수정: `A white box truck straddling the line between the lane ahead and the lane to its left angles to the right and moves fully into the lane directly ahead.`
- 보존: 프레임 1의 실제 위치(카메라 차로와 왼쪽 차로 사이 점선 위) 그대로, ko "왼쪽 차로와의 경계선에 걸쳐" 와 동일 의미. 다른 문장·disclosure·loop 값 불변.

ko·ja·zh 문자열은 각 언어로 자연스럽게 읽히며 수정하지 않음.

## 4. 미디어 내 텍스트·식별 요소

- hero: 탑차 번호판은 빈 흰 사각형, SUV 번호판 흐림, 오른쪽 녹색 표지판은 빈 판. 읽히는 글자 없음. 사람 없음. 유혈·충돌 장면 없음.
- 프레임·포스터: 동일. 읽히는 글자는 오버레이의 `REC`, 경과 카운터 `00:00:01.5`, 각 언어 AI 고지(ko "AI로 만든 가상 장면 · 실제 사건 영상이 아닙니다", en "AI-generated fictional scene · not footage of the actual case", ja "AIで作成した架空の場面・実際の事件の映像ではありません", zh "AI生成的虛構情境・非真實案件影像")뿐. 카운터는 사건 시각으로 오인될 형식이 아님. 고지 문구는 잘리지 않음.
- 게시본 대조: `video/out/C4-{ko,ja,en,zh-hant}.{jpg,mp4}`와 저장소 `public/images/column-videos/…`, `public/videos/columns/…`의 바이트 크기가 네 언어 모두 일치(ko 74,499/617,995; ja 77,286/619,711; en 75,330/618,451; zh 74,380/617,078). SHA-256 실행은 권한 제한으로 이번 세션에서 못 했고 final-astra 기록이 동일성을 확인함.

## 5. 4개 언어 핵심 수치 대조 (판결 원문 55.txt·344.txt 재확인)

| 항목 | 원문 | ko | ja | en | zh |
|---|---|---|---|---|---|
| 사건 일시 | 113.2.22 15:10許 | 2024-02-22 15:10쯤 | 동일 | 동일 | 동일(민국 병기) |
| 끼어들기/급제동 | 4次 / 3次 + 併行 | 4회/3회/나란히 | 4回/3回/並走 | four/three/alongside | 4次/3次/併行 |
| 캡처 구간 | 15:07:56~15:08:08許 | 약 12초 | 約12秒 | roughly twelve seconds | 大約12秒 |
| 피고 진술 | 30초·1~2분·3~5회 | 동일 | 동일 | 동일 | 동일 |
| 기소 | 113.9.2, 偵字38619 | 2024-09-02 | 동일 | 동일 | 동일 |
| 1심 | 114.3.6 有期徒刑4月, 1,000元/日 | 2025-03-06, 4개월 | 동일 | 동일 | 동일 |
| 2심 | 115.1.14 刑部分撤銷, 拘役40日, 1,000元/日 | 2026-01-14, 구류 40일 | 동일 | 동일 | 동일 |
| 40일 환산 | — | 4만 TWD | 4万 | NT$40,000 | 4萬 |
| 법정형 185①/304① | 5年/15,000; 3年/9,000 | 185① 기재 | 둘 다 | 185① 기재 | 둘 다 |
| 제43조 배경 | 6,000~36,000, 당장 운전금지, 牌照 6개월 | 동일 | 동일 | 동일 | 동일 |
| 상소 안내 | 송달 후 20일 | 동일 | 동일 | 동일 | 동일 |
| 미합의 | 尚未和解 (양심) | 동일 | 동일 | 동일 | 동일 |
| 감형 사유 | 被害人亦有爭道、互不禮讓, 原審漏未審酌 | 동일 | 동일 | 동일 | 동일 |

유죄 유지·양형 평가와 민사 과실 비율의 구별, 택시 운전자 처벌 미기재, 확정 여부 불명은 네 언어 모두 동일하게 서술.

## 검수 범위와 남은 제한

- 이 세션의 셸 권한 제한으로 vitest·ffprobe·shasum·git status를 실행하지 못했다. 테스트 목록 누락 수정은 소스에서 눈으로 확인했으나(`native-locale-columns.ts:346`), 배포 담당자는 final-astra에 적힌 재검증 명령으로 요약문·게시순서 테스트를 한 번 돌려야 한다. final-astra가 보고한 C4 밖 실패(EN 092 seoTitle, KO 091 분류, 게시 순서 fixture)는 이 검수 범위 밖이며 해결 여부를 확인하지 않았다.
- 외부 URL의 현재 응답 상태는 확인하지 않았다(판결 원문·manifest와의 문자열 일치만 확인).
- 이 검수는 AI 검수이며 변호사·원어민 검수가 아니다.

수정 파일: `src/data/column-generated-videos.ts` en description 1문장. 칼럼 4파일은 수정하지 않음.

VERDICT: PASS
