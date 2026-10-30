PASS (gate runner: Codex GPT-6 Astra max, fresh session)

검수 시각: 2026-10-29 14:20:15 KST
대상: G2 — ko.md · zh.md · ja.md · en.md · es.md
판정: MAJOR 0, MINOR 0.

작성 세션 astraA·opusB와 독립된 이번 세션에서 출처를 새로 열고 전체 원고를 검수했다. 이전 PASS나 작성자 확인만으로 판정하지 않았다.

## 이 항목의 확인 내용

- 작성자는 opusB, 비작성자 astraA의 [CROSS-fixed-astraA.md](CROSS-fixed-astraA.md)에 원 지적과 반영 기록이 있다. 스페인어의 대만 민법 제474조 적용 조건, 외국법 증명의 당사자·법원 인지 조건, 제203조의 이자 발생 전제, 일본 관할 단정, 뉴스 사건·미검증 외국 이율 삭제, 반복 맺음 삭제를 현재 파일에서 확인했다. 마지막 ASTRA-FAIL-fixed-4.md의 es 요약·FAQ2 및 en 본문 조건도 반영됐다.
- 인용 URL 49개(그중 LawSingle 34개)를 열었다. 涉外民事法律適用法 제8·20·36조, 香港澳門關係條例 제38조의 類推適用과 제42조의 準用, 民事訴訟法의 관할·외국법 증명·병행 소송·소송비용 담보·증명책임·외국판결 승인·가압류, 強制執行法 제4·4-1조를 원문과 대조했다. 대만 민법의 15년·5년 시효, 연 5%·16%, 지체이자 설명은 대만법이 적용되는 경우로 한정돼 있다. 근거: [준거법 제20조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20), [외국법 증명 제283조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=283), [법정이율 제203조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=203).
- ko는 한국 회사의 사내대여·미정 준거법, zh는 마카오 채권의 최초 대만 제소·공서양속, ja는 일본 회사와 대만 대리점의 전속관할 문구, en은 미국 채권자의 선택법·비용 담보, es는 멕시코 개인 간 대여·송금과 메시지·대만 거주에 따른 담보 차이를 중심으로 썼다. 공통 법리를 다른 언어에 같은 이야기와 순서로 옮긴 원고로 보이지 않는다. 마카오 관련 설명은 회수 분쟁의 법적 위험에 한정되고 도박이나 대출을 권하지 않는다.
- 가까운 기존 030(외국 확정판결 승인·집행), 518/스페인 수출업자 미수금, 605(대만 개인대여)와 대조했다. 이 글의 중심은 외국에서 생긴 채권을 외국판결 없이 대만에서 처음 소송할 때의 준거법·관할·외국법 자료다.
- 이미지: [brief](../../../images/G2-brief.txt), [hero](../../../images/G2-hero.webp). 항구가 보이는 밝은 사무실의 서류·영수증·꺼진 노트북 장면.

## 공통 게이트 확인

- ko.md, zh.md(zh-hant), ja.md, en.md, es.md 전문과 title·seoTitle·summary·FAQ·출처 목록을 검수했다. 다섯 언어판을 나란히 읽어 법적 조건과 숫자를 대조하고, 독자별 도입·예시·전개·맺음이 독립적으로 구성됐는지 확인했다.
- 법령은 실제 인용된 law.moj.gov.tw LawSingle 원문을 새로 열어 대조했다. HTTP 200만으로 사실 확인을 대신하지 않았다. 원문 HTML·본문·URL·인용 위치는 [출처 기록](../../../research/astra-fresh-final-20261029/sources.json)에 있다.
- 공개 판결의 사건번호·판결문 인용이나 미확정 형사사건에 대한 유죄 단정은 없다. 외국의 법률 효과를 공식 출처 없이 단정하는 비교도 없다. 법령 초안을 확정법처럼 설명한 부분은 없다.
- published와 lastmod는 2026-10-29, audience는 각 언어 배열이며 es는 ["es"]다. [라이브 스페인어 칼럼](https://tseng-law.com/es/columns), 1028 배포본, 허용된 ship 사본의 FRONTMATTER.md와 형식을 대조했다. 내부 author 필드는 TASK.md가 지정한 배포본 형식이며, 공개 바이라인·서명·저자 박스·AI 표기·변호사 검토 완료 주장은 없다. 굵은 글씨·이모지·권유 명령문·체크리스트형 제목도 없다.
- 다섯 판 모두 현지 언어로 타이베이 사무소 주소 台北市大同區承德路一段35號7樓之2 및 wei@hoveringlaw.com.tw를 안내한다. 전화번호나 잘못된 타이중 주소는 없다. 잘못 표기한 변호사 이름도 없다.
- 아래 공용 images 경로는 TASK.md의 배치 기준이다. brief와 실제 1280×720 hero를 함께 확인했다. 실존 인물·로고·읽히는 글자 없는 일반적 가상 장면이며 각 featured_image_alt와 맞는다. featured_image: "TBD"는 이번 게이트에서 허용된 값이다.
- 다섯 판 variety 검사 FAIL 0. 한국어·일본어의 정중체 종결 집중 WARN은 수동으로 함께 검토했다. SENTENCE-VARIETY-RULE.md §5의 도입 삭제 시험, 짧고 긴 문장의 배치, 문단 시작, 인용 위치, 대비 표현, 맺음 중복을 확인했으며 남은 MONOTONY 지적은 없다. [검사 결과](../../../research/astra-fresh-final-20261029/variety.json).
- [라이브 사이트맵](https://tseng-law.com/sitemap.xml) 3,167개 URL 중 개별 칼럼·이슈 2,594개를 로컬 비교 자료와 연결했다. 1021·1022·1023·1026·1027·1028(958~963), tseng-es-fr-1022, tseng-gapfill-1020, 현재 tseng-issues-* 8개 작업 폴더, 허용된 ~/Projects/tseng-law-cols1029-ship/src/content를 포함한 2,864개 문서의 제목·요약·주제·소제목을 대조하고 가까운 글의 본문을 읽었다. 동일 slug 및 같은 중심 질문의 중복은 발견하지 못했다. [비교 색인](../../../research/astra-fresh-final-20261029/existing-index.json), [사이트맵 URL](../../../research/astra-fresh-final-20261029/sitemap-urls.json). 매핑에서 남은 7개 URL은 언어별 이슈 목록 페이지이며 개별 글 누락이 아니다.

## 검수한 원고 SHA-256

| 파일 | SHA-256 |
|---|---|
| ko.md | `14d7a1d7652ca30a1f001074163c6ff965e3bdf0a7fa055251d125e2034ae557` |
| zh.md | `853ad6dd97a75c8357edef6ff051056a2cc14b8f2536a6ad798d864f671d9616` |
| ja.md | `b3486e842921e34c0986be9cdd87507940e5c07b0a818a54fea66fc305f5b741` |
| en.md | `4eacf574e06a23d0cebbe9bc246600982f66269446093deed345d7484f971816` |
| es.md | `d60069f979350d4b2d7c7acc22c04af6aaec80e8a6b4f97b5eb5ec5231f9e8f4` |

위 해시와 판정 직전 파일의 일치를 확인했다. 원고·이미지는 수정하지 않았고 READY는 유지했다. 이 파일은 Astra 최종 검수 판정만 기록한다.
