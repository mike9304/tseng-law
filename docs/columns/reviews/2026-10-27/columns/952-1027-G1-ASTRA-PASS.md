PASS (gate runner: Claude Code Opus 5.5, fresh session; Codex Astra usage-limited)

G1 — MAJOR 0, MINOR 0. 6차 게이트 재확인, 2026-10-27 14:25 KST. 대상 drafts/gap/G1/{ko,zh,ja,en,es}.md의 SHA256은 READY 기록(14:20)과 같다.
- ko 80ac7e57…
- zh 26999f10…
- ja 5750aaf8…
- en a441a6e6…
- es cce2a281…

작성 세션(opusA)과 별개인 최종 게이트이며 초안은 고치지 않았다.

경위:
- 6차 게이트(14:19)는 다섯 판 전문을 새로 검수했고, MINOR 3건으로 FAIL했다(ASTRA-FAIL-fixed-6.md).
- 작성자가 14:20에 고쳤다. research/opusA-astra6/G1/before/와 diff하면 바뀐 줄은 ko 2, ja 1, en 5, es 1, zh 0이다. 모두 게이트 문안 또는 그 권고를 그대로 반영한 것이다.
- 나머지 본문은 6차 게이트가 전문 검수한 텍스트와 같다.

6차 지적 확인:
1. 紅利: ko:69 「상여와 이익배분(紅利)」, en:71 "employee profit-sharing (紅利)", en FAQ 셋째 답 "employee profit-sharing"으로 고쳐졌다. 권고했던 ko:37 「이익배분(紅利)」, en:43 "profit-sharing (紅利)"도 반영됐다.
   - 所得稅法 14 第三類 四 「獎金、紅利」, 공식 영역 "cash awards, bonuses"와 맞는다.
   - en에 남은 "dividends"(FAQ 둘째 답, en:35)는 勞基法 29 「提列股息」의 주주 배당이라 맞다.
   - FAQ JSON 3개가 유효하다.
2. 施行細則 7-3: ja:57 「1か月あたりの補償額が…50%を下回らないことが、判断要素の一つです」, en:63 "compensation per month of at least 50 percent"로 고쳐졌다.
   - 7-3 Ⅰ①(每月補償金額)과 Ⅱ(지급 방식은 별개 항)에 맞는다.
   - 다른 판(ko:75·zh:61·es:63)과도 같아졌다.
3. 勞基法 16: en:51 "once service reaches three months", es:49 «Si el trabajador lleva al menos tres meses en la empresa, esta debe avisar…»로 고쳐졌다.
   - 16 Ⅰ 一~三(繼續工作三個月以上부터)과 맞는다.
   - 다섯 판 전수 검색에서 10일 하한을 단정한 문장이 더 없다. zh:41 「年資三年以上是三十日」, ko:53·ja:39 '최장 30일'은 하한을 말하지 않는다.

교차 검수: 비작성자 opusB의 CROSS-opusB(→ CROSS-fixed-opusA.md)가 있다. MUST 3건(번역형 단락, 평균임금 6개월 조건, ja의 출처 없는 일본 비교 삭제)이 지금 글에 반영돼 있다. rebuttal.md의 판결 범위 판단도 유지된다.

6차 전문 검수에서 확인한 사항(이번 수정으로 바뀌지 않음):
- 조문(law.moj.gov.tw LawSingle 원문 대조; 번호·항·조건·숫자 5판 일치):
  - 勞動基準法 2③④·9-1·11·14·16·17·22·29
  - 施行細則 7-1·7-3·10
  - 公司法 235-1·167-2
  - 勞動事件法 16·37
  - 就業服務法 73③
  - 外國專業人才延攬及僱用法 4·9·24(LawHistory: 115-01-01 시행, 6개월 선택 기간 2026-06-30 종료로 과거형)
  - 勞工退休金條例 7·11·12
  - 所得稅法 14
- 뉴스·공식 자료:
  - 뉴시스 2026-10-27(마이크론): ko 계기로만 썼고, 보상 수치는 쓰지 않았다.
  - 勞動部 Q&A 7171: 평균임금 산입은 지급일이 아니라 일한 기간 기준이다.
  - 國發會 就業金卡 FAQ
- 판결: ja:29(台北地院 114勞訴257, 1심, 확정은 115司他277로 기록), en:25(高院 112重勞上14, 이후 상소 여부 미확인으로 기술)는 라이브 ja 910·en 914의 범위 안에 있다. FJUD는 이번에도 시간 초과였다.
- 본국 법 주장이 없다. en의 Delaware 준거법 언급은 계약 조항 설명이다.
- 번역 금지: 도입(ko 뉴시스, zh 3월 결의·5월 지급 가상 사례, ja 5월 말 퇴사 가상 사례, en 'two promisors', es 6월 질문과 세 가지 퇴사 경로), 소제목 순서, FAQ, 변호사 단락이 서로 다르다.
- 기계 점검(수정 뒤 다시 실행):
  - front matter 15키(1026 초안 형식), published·lastmod "2026-10-27", audience 단일 로케일, featured_image "TBD", author 내부 토큰만 있다. FAQ JSON 3개가 유효하고 H1은 1개다.
  - featured_image_alt: images/G1-brief.txt와 hero 실물(공업단지가 보이는 창가 책상, 흰 안전모, 남색 서류철과 펜, 추상 화면의 노트북, 커피; 인물·로고·글자 없음)에 맞는다.
  - 표기: 굵은 글씨·이모지·바이라인·저자 줄·AI 표시·'변호사 검토' 표기가 없다.
  - 연락처: wei@hoveringlaw.com.tw와 타이베이 주소(臺北市大同區承德路一段35號7樓之2, 각 언어 관례 표기)가 있다. 전화번호는 없고 타이중 주소는 쓰지 않았다. en에 English-speaking lawyer in Taipei 문장이 있다.
  - variety_metrics: FAIL 0×5(es는 tools/variety_metrics_es.py --lang es).
  - 링크: G1·G3 95개를 라이브로 조회해 non-200 0이었다.
- 중복: 슬러그 taiwan-employee-compensation-bonus-rsu-leaving-before-payout는 라이브 sitemap.xml(3,027 URL)과 리포에 없다. 경업금지(ja 202, ko 226, hi 671), 주식보상 과세, en 914와는 독자 질문이 다르고 링크로 처리했다.

검수 메모: reviews/gate-work6/G1-findings.md, reviews/gate-work6/BRIEF.md.
