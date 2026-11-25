# ISSUE-20261125-05 편집 검수

2026-11-25. `docs/columns/EDITORIAL-VOICE.md`와 공용 문장 다양성 규칙을 적용했다. 직전 영어 이슈 2026-11-24 06(반품 과세연도), 2026-11-24 05(우편 종자), 2026-11-23 06(재택 안전 서비스)의 실제 첫 두 문단을 비교했다. 각각 날짜 대비, 우편 품목, 서비스 광고 질문으로 시작한다. 이번 글은 승인된 싱가포르 회사 지점과 보도된 분쟁으로 시작하고 둘째 문단에 제3국 회사 독자의 사전 분류 질문을 둔다. 첫 문장을 빼면 법인 구조와 초기 허가 사실이 사라져 유지한다. 둘째 문단은 새 정보를 주는 질문이라 유지한다.

| 문제 문장 | 이유 | 수정안 | 의미 보존 |
| --- | --- | --- | --- |
| “That order matters. This sequence matters to a founder…” | 같은 의미 반복 | “The permit comes first. For a founder who has already prepared branch-registration papers, the classification may change the filing route.” | 예. 허가 선행·등록 전 분류 확인 유지. |
| “Who controls your Taiwan branch's parent company…” | 지점은 별도 법인이 없어 parent company가 부정확함(Grok 교차검수) | “Who controls your overseas company when it opens a Taiwan branch?” | 예. 제3국 법인의 지배력 질문 유지. |
| “who directed its technology and operations” / “controlled from mainland China” | 보도의 기술 주도자를 확정하고 지배 행위의 위치를 특정함(Grok) | 기술 지원·두 책임자의 역할·운영상 지배 쟁점으로 제한하고 “mainland persons had effective operational control”로 수정 | 예. 보도 사실·출처 유지. |
| 기술 지원과 두 책임자 역할을 본문에서 반복 / “The activities open to that category” | 반복과 모호한 지시어(Grok) | 반복 문장 삭제, 허용 업종을 “The business lines open to that category…”로 명시 | 예. 업종 확인 유지. |
| “recognition as a foreign company” | 2018년 폐지된 제도를 현재 절차로 적음(Astra 최종 심사) | 현행 [경제부 상업발전서 안내](https://gcis.nat.gov.tw/mainNew/subclassNAction.do?method=getFile&pk=5)에 맞춰 지점 설립 등록 신청 전에 투자심의사 투자 허가를 신청한다고 수정 | 아니오. 법적 절차를 바로잡았다. |
| “mainland persons had effective operational control” | 중국 측 회사와 자연인을 함께 다룬 보도보다 주체가 좁다(Grok 독립 심사) | “the mainland side had effective operational control” | 예. 지배력 쟁점 유지. |
| “Investment Review Department” | 경제부 소속 부서의 공식 영문 명칭과 어순이 다름(Astra 재심사) | FAQ와 본문에서 “Department of Investment Review”로 수정 | 예. 허가 기관과 순서 유지. |

최종 `variety_metrics.py check --lang en`: CV 0.516, 짧은 문장 11.5%, FAIL 0. 5절 점검: 도입은 배치 내 ko 질문·ja 가상 장면과 구분되는 실제 보도 사실형, 아주 짧은 문장 2개 이상, 반복 문단 시작·조문 인용·대비 틀 초과 없음, 인용 없는 문단 있음, 마지막 본문 문단은 운영 결정 기록으로 끝난다. 제목·요약은 보도체가 아니고, 영어 문체는 자연스럽다. 굵은 강조·공개 작성자·전화번호·판촉 문구 없음. 법령의 30% 초과·별도 지배력, 제73조 허가, 제93조의1 금액, 보도 출처·이미지 가상 고지는 수정 후에도 유지했다.

중앙사 보도는 직접 열기 오류가 있었고 검색 색인에 표시된 본문 발췌와 배치 수집 메모를 대조했다. 법령 및 현행 경제부 안내는 공식 사이트에서 확인했다. 판결문 원문·사건번호·확정 여부는 확인하지 않았고 글에 단정하지 않는다.
