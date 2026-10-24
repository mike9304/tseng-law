# G4 CROSS-astraA

판정: REQUEST_CHANGES — MINOR 3. 법률의 수치·기산·주요 조건 오류는 발견하지 않았다.

## G4-A-01 — MINOR — ZH 제목의 명령형 꼬리

위치: zh.md title 및 H1.
문제 문장: 「外籍配偶要離台，欠稅限制出境如何解除：先辨認通知書上的法條」.
이유: 「先辨認」가 독자에게 행동을 명령하는 제목이다. 사용자 문체 규칙의 명령조 제목 금지에 해당한다.
수정안: 「外籍配偶要離台，欠稅限制出境如何解除」 또는 처분 근거 차이를 설명하는 평서형 제목.
의미 보존: 외국인 배우자·출국·체납·해제라는 범위와 본문의 근거 조문 구분을 유지한다.

## G4-A-02 — MINOR — EN 첫 두 문장의 같은 정보 반복

문제 문장: “Moving back to the United States may bring forward the deadline for a Taiwan tax return.” 다음 “For someone ending a Taiwan assignment, the current year’s return may become due before leaving.”
이유: 두 문장이 모두 귀국 때문에 신고 기한이 앞당겨진다는 정보다. 첫 문장을 지워도 미국 독자라는 표시 외 정보가 거의 줄지 않는다.
수정안: “For an American ending a Taiwan assignment, the current year’s tax return may become due before departure.”처럼 합치거나 미국 독자의 구체적 서류 문제로 한 문장만 쓴다. 이어지는 제한 해제 문제는 보존한다.
의미 보존: 의무를 단정하지 않는 may와 현재 연도·출국 전 신고라는 의미를 유지한다.

## G4-A-03 — MINOR — ES 관련 칼럼·서비스 내부 링크 누락

현재 /es/contact만 연결되어 있다. 200은 확인되지만 이는 사용자가 요청한 관련 기존 칼럼·서비스 페이지가 아니다. /es/services는 일반 법인 세무를 포함하나 개인 체납 서비스로 오인시키면 안 된다.
수정안: 알맞은 기존 es 칼럼 또는 서비스 페이지를 문맥에 맞게 추가한다. 확인 가능한 후보는 /es/columns/taiwan-criminal-exit-ban-foreign-defendant-temporary-travel (이번 실행 200, 본문 확인). 이 링크를 쓰면 형사 절차의 출국 제한은 별도로 다루는 글임을 분명히 하고, 세금 제한 해제 근거인 것처럼 연결하지 않는다. 대안으로 실제 관련 서비스 범위를 확인해 연결해도 된다.
의미 보존: 현재 세금 법리를 변경하거나 형사 제한 기준을 본문에 새로 확장하지 않는다.

## 사실·중복·독립 구성

所得稅法7·71·71-1·72·73, 稅捐稽徵法24, 재정부 GL009873 및 稅務入口網 원문을 직접 대조했다. 183일 외 주소+상시거주 경로, 배우자 예외, 개인100만/구제 중150만, 상당 담보·선행 보전·고지, 이민서 제한일부터 최대5년, 취소 후 재처분 및 해제 예외를 보존한다. 제72조 별도 제한과 행정집행 가능성을 제24조 금액의 예외처럼 섞지 않았다.

기존 024는 거주자·신고, 374는 회사 책임자의 체납 제한, S8은 퇴직금 과세다. 이번은 개인 체납과 해제 근거·별도72조를 중심으로 범위를 좁혔다. KO 귀국 전 신고, ZH 외국인 배우자의 통지서와 잔류 배우자, JA 귀임과 납부 이후 처리, EN 명령서의 법적 근거와 해제, ES 신고 대리와 개인 체납으로 흐름이 다르다.

규칙 5절: 5판 FAIL0, 짧은 문장·오프너·인용·대비·말미·ko/ja 문체 충족. G4-A-02 외 첫 두 문단은 조건이나 절차 정보가 사라져 유지한다. EN은 질문을 억지로 추가하지 않고 처분 근거부터 설명하는 구성이라 본문 질문0을 허용했다.

## 검수 범위와 증거

2026-10-23 09:55 KST, reviewer=astraA / writer=astraB. ko·zh·ja·en·es의 본문·FAQ·메타데이터를 직접 읽고 조문 번호·문구·숫자·조건·출처 목록을 대조했다. 본문은 수정하지 않았으며 작성자가 지적 반영 후 READY를 만든다. 최종 새 Astra(max) 게이트는 별도다.

- 자동 검사: 각 5판 FAIL 0. ko·zh-hant·ja·en은 지정 원본, es는 원본 미지원으로 로컬 tools/variety_metrics_es.py를 사용했다. WARN과 명령 전문은 reviews/astraA-cross/files.json에 보존했다. 원어민 검수라는 표시는 하지 않는다.
- 형식: reviews/astraA-cross/package.json. 날짜·FAQ3·audience·author 내부 토큰·TBD·가상 alt·H1·연락 이메일과 Taipei 35號7樓之2·Taichung 19號6樓之1, en 상담 문구를 확인했다. 굵은 강조·공개 저자/AI표시·전화번호 없음. 이미지 brief는 1280×720 가상 장면이다.
- 원문: research/astraA-cross/fetch.json 및 각 HTML/TXT. 원고가 인용한 법령·공개 결정·재정부 자료를 새로 수신해 읽었다. 내부 링크 15개 모두 200. 48 URL 중 CNA만 직접 GET 403이며, 원작성자의 원문 HTML과 이번 web 검색에서 제공된 동일 CNA 원문 전체를 대조했다. 나머지는 200.
- 중복: 라이브 sitemap 전 로케일 2,425 URL 및 지정 1020·1021·1022·es/fr·이슈 원고 제목과 인접 원고 본문을 대조. 새 slug 충돌 없음. 관련 ref 023·024·054·169·374·532·533과 비교했다. 동일 법조문 자체를 중복으로 판정하지 않고 새 독자 질문을 기준으로 검토했다.

## 검수한 파일 SHA256

- ko.md: `b4f2ca04acc7d4533379b9fb6f45ce3a85e29c4410dbff2f16a4673b683987d3`
- zh.md: `14fb8e001528cd4539b1a54c324ad8254cd89b9dfdb951b60bc8623ae343e366`
- ja.md: `141441e5798021e0ece972e35e7cde42636acf406d7337580f7ff515576b2aff`
- en.md: `9c612f30d0a6d1d8a90c2afd64cb0aff20f25413b539c51b83437bb13a7ec01e`
- es.md: `bc3083a95f50f884c7cd18dacba269afc91dfcc463352a8eeef80b48cd504b35`
