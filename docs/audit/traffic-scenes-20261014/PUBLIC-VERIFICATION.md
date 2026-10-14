# 교통사고 칼럼 601·602 공개 검증

2026-10-14 18:53 KST, 공개 게시와 영상 재생 확인 완료. Codex 직접 최종 검수.
`https://tseng-law.com/build-info.json`은 브라우저 검증 전후 모두
`b8dc2ce7b2a81a8990e19f9650edb59e313e4710`을 반환했다. 공개 빌드 시각은
2026-10-14 18:08:18 KST이다. MacBook Air가 복귀한 뒤 기존 자동 배포 경로로 반영됐다.

## 공개 게시물

| 사례 | 한국어 | 번체중문 |
|---|---|---|
| 황색 이중선 유턴 | [칼럼](https://tseng-law.com/ko/columns/taiwan-double-yellow-uturn-dashcam-liability) | [칼럼](https://tseng-law.com/zh-hant/columns/taiwan-double-yellow-uturn-dashcam-liability) |
| 빗길 급제동·추돌 | [칼럼](https://tseng-law.com/ko/columns/taiwan-rain-rear-end-braking-dashcam) | [칼럼](https://tseng-law.com/zh-hant/columns/taiwan-rain-rear-end-braking-dashcam) |

## 공개 사이트 검증 결과

- 4개 게시물 × 390px·1440px, 총 8개 화면에서 HTTP 200, 제목·canonical·공식 출처 링크·본문 굵은 강조 없음·표지 AI 캡션을 확인했다. 본문 해시는 검수한 로컬 빌드와 모두 같다.
- 실제 키보드 Space로 재생을 시작했다. 각 화면에서 60초·1280×720 영상, 조작 버튼, loop=false, 재생 시간 증가를 확인했다. 25초·46초로 이동한 뒤 58.8초부터 끝까지 재생하여 ended=true와 60초 종료를 확인했다.
- 영상·표지 이미지가 모두 로드됐다. AI 가상 사고 표시와 다른 시점이 별도 생성이라는 설명을 확인했다. 중단된 본문 요약 영상의 챕터 UI는 없다.
- 브라우저 예외, 실패한 HTTP 요청, `/api/` 호출, 가로 화면 넘침은 0건이다.
- 4개 게시물마다 교통사고 게시판의 영상 필터와 검색 결과에서 실제 링크를 클릭해 정확한 글로 이동했다. 총 8회 이동이며 sitemap에도 새 URL 4개가 있다.
- 공개 R2 영상 4개의 전체 바이트 크기·SHA256이 검수 원본과 일치한다. 모두 `video/mp4`이며 Range 요청은 `206`, 1,024바이트를 반환했다. 포스터 4개와 표지 2개도 원본 바이트와 같다.

실제 공개 화면 중 한국어 모바일 표지, 번체중문 모바일 재생, 번체중문 PC 46초 장면, 한국어 PC 표지를 직접 열어 확인했다. 제목과 캡션이 잘리지 않고, 재생 화면의 AI 표시와 사고 장면을 식별할 수 있다. 화면 경로와 해시는 `public-verification.json`에 남겼다.

증거: `public-browser.json`(13개 검증 항목), `public-assets.json`(10개 미디어 검증), `public-verification.json`(최종 확인).

## 빌드·재생 근거와 범위

통합된 내용 커밋의 클린 정적 빌드는 2,205페이지와 sitemap 2,200개 URL을 확인했고 새 누락 미디어·누락 페이지·깨진 참조·Flight 오류는 0건이었다. 기존 범위 밖 미디어 경고 5개는 `integrated-build.json`에 그대로 기록했다. 로컬에는 Air의 고정 빌더 데이터 사본이 없으므로 사이트 전체가 같은 데이터라고 주장하지 않는다. 이번 공개 글 4개의 본문은 별도로 해시 대조했다.

두 사고 영상은 로컬에서 탐색 없이 각각 약 60초 동안 재생되어 자연 종료한 기록이 있다(`natural-playback.json`). 공개 브라우저 검증은 위와 같이 재생 시작·탐색·종료를 확인한 것이며, 공개 서버에서 60초 전 구간을 다시 기다린 검사로 표시하지 않는다. 공개 파일 해시가 전체 디코딩과 자연 재생을 통과한 원본과 같다.

단위 테스트의 최초 실패와 수정 후 재검증은 `local-checks.json`에 보존했다. 전체 실행에서 남았던 sitemap 목록 실패는 수정 후 해당 파일 36개 검사에서 통과했다. 표지 경로 수정 후 67개, 최신 main 통합 후 121개 관련 검사도 통과했다. 배포 확인 후 바꾼 것은 이 검수 문서와 증거뿐이다.

법률·문체·생성 경로·영상 한계는 `REVIEW.md`와 `media-manifest.json`을 따른다. 실제 사고·실측·판결이나 외부 전문가 검수로 표시하지 않았다.
