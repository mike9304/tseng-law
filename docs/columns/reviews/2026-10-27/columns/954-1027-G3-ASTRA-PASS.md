PASS (gate runner: Claude Code Opus 5.5, fresh session; Codex Astra usage-limited)

G3 — MAJOR 0, MINOR 0. 6차 게이트 재확인, 2026-10-27 14:25 KST. 대상 drafts/gap/G3/{ko,zh,ja,en,es}.md의 SHA256은 READY 기록(14:21)과 같다.
- ko 2b65602f…
- zh a390a5bb…
- ja c5d409c8…
- en 68afbb40…
- es 35d8b0cd…

작성 세션(opusA)과 별개인 최종 게이트이며 초안은 고치지 않았다.

경위:
- 6차 게이트(14:20)는 다섯 판 전문을 새로 검수했고, MINOR 1건으로 FAIL했다(ASTRA-FAIL-fixed-6.md).
- 작성자가 14:21에 고쳤다. research/opusA-astra6/G3/before/와 diff하면 ja:4(summary) 한 줄만 바뀌었고, 게이트 문안을 그대로 반영했다.
- ko·zh·en·es는 6차 게이트가 전문 검수한 텍스트와 바이트 단위로 같다.

6차 지적 확인: ja:4 summary는 이제 「この法律に基づいて損害賠償を求めるなら、台湾に主たる事務所も営業所もない会社が相手の場合、訴える先は台北の地方法院に限られます。請求権は、損害と賠償義務者を知った時から2年行使しなければ消滅します。」이다.
- 個人資料保護法 33 Ⅰ(依本法規定…損害賠償訴訟)·Ⅲ(中央政府所在地), 30(知有損害及賠償義務人時起二年)과 맞는다.
- 본문 ja:43·ja:47과도 맞고, 다른 네 판 summary의 조건(依個資法求償時 / 이 법으로 청구할 수 있다면 / If it applies / Si la ley se aplica)과도 같아졌다.
- YAML 문자열 안에 큰따옴표가 없다.

교차 검수: 비작성자 opusB의 CROSS-opusB(→ CROSS-fixed-opusA.md)가 있다. MUST 2건이 지금 글에 반영돼 있다.

6차 전문 검수에서 확인한 사항(이번 수정으로 바뀌지 않음):
- 조문(law.moj.gov.tw LawSingle 원문 재조회; 번호·항·조건·숫자 5판 일치):
  - 個人資料保護法 2·12·28·29·30·33·34·51: 현행 제12조로 썼고, 2025 개정 조문은 LawHistory상 시행일 미정이라 다섯 판 모두 '시행 전'으로 썼다.
  - 同法 施行細則 22
  - 消費者保護法 49·50
  - 金融消費者保護法 13
  - 涉外民事法律適用法 관련 조문, 民事訴訟法 41·44-1
  - 숫자: 500~2만, 2년, 5년
- 뉴스·공식 자료:
  - 연합뉴스 10/26(KB국민은행): ko 계기로만 썼다.
  - Reuters·読売(楽天トラベル·タイムズカー): ja 계기로만 썼다.
  - 대만 이용자 피해 규모는 발표되지 않았다고 썼다.
  - JCIC 안내 페이지
- 본국 법: ja의 일본 個人情報保護法 第26条 비교는 e-Gov 원문과 맞고 출처 목록에 있다. 그 밖의 본국 법 주장은 없다.
- 번역 금지: 도입(ko 한국 은행 사례, zh 第51條第2項, ja タイムズカー 금액, en 2년 시효, es 차지백·165), 소제목 순서, FAQ, 변호사 단락, 맺음이 서로 다르다.
- 문체: ko 합니다체, ja です・ます. zh는 대만 어휘를 쓰고, es 문법이 맞다(5차 수정 «al menos dos vías» 포함). 명령형·체크리스트형 소제목과 예고 문장이 없다.
- 기계 점검(수정 뒤 다시 실행):
  - front matter 15키(1026 초안 형식), published·lastmod "2026-10-27", audience 단일 로케일, featured_image "TBD", author 내부 토큰만 있다. FAQ JSON 3개가 유효하고 H1은 1개다.
  - featured_image_alt: images/G3-brief.txt와 hero 실물(어두운 호텔 방, 빛나는 휴대전화, 닫힌 수첩, 무지 카드, 노트북, 열린 여행 가방; 인물·로고·글자 없음)에 맞는다.
  - 표기: 굵은 글씨·이모지·바이라인·저자 줄·AI 표시·'변호사 검토' 표기가 없다. zh:71 「審閱授與文件」은 업무 설명이다.
  - 연락처: wei@hoveringlaw.com.tw와 타이베이 주소(각 언어 관례 표기)가 있다. 전화번호는 없고 타이중 주소는 쓰지 않았다. en에 English-speaking lawyer in Taipei 문장이 있다.
  - variety_metrics: FAIL 0×5(es는 tools/variety_metrics_es.py --lang es).
  - 링크: G1·G3 95개를 라이브로 조회해 non-200 0이었다.
- 중복: 슬러그 taiwan-overseas-company-data-breach-notice-resident-damages-claim는 라이브 sitemap.xml(3,027 URL)과 리포에 없다. 663(회사 쪽 통지 의무), zh 514(업체 통지 지연)와는 독자 질문이 다르고 링크로 처리했다.
- 참고(판정 외): TASK G3의 통신(門號) 명의도용 2차 피해 대응은 공식 절차 자료를 찾지 못해 다섯 판 모두 다루지 않았다(facts.md). 사실 오류가 아닌 범위 문제다.

검수 메모: reviews/gate-work6/G3-findings.md, reviews/gate-work6/BRIEF.md.
