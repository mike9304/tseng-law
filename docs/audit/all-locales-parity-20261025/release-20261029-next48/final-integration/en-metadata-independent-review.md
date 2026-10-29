# EN918–921 SEO metadata8 독립 부분 검수

판정: PASS / M0 / 새 선택 제안0. 변경된 `seoTitle`4개와 `summary`4개의 사건 범위·법적 의미에 필수 수정은 없다. 기존 EN/ZH 전체 검수의 선택 제안은 수정하거나 종결하지 않았다. 이번 판정은 현재 아래 SHA4의 메타데이터 변경에 한정한 독립 AI 검수이며 원어민·변호사 감수 또는 게시 승인이 아니다.

검수자 `/root/b12_es_author`. root의 author-manifest와 repair-en-metadata.py, 기존 `batch12/reviews/en-zh-independent-r1.md` 및 handoff를 읽었다. 변경 전후8문구를 현재 원고의 관련 본문·FAQ에 직접 대조했다. 정본918–921, 사실표·출처표·계약과 네 문체 규칙은 같은 연속 작업의 직접 전문 읽기를 재사용하고 SHA를 다시 확인했다. 자동 갱신된 LESSONS만 새2026-10-29 09:37 KST 버전(SHA `a8defe307632975e03d2758a66ee75252b7229f6fd2c157199f0e05774ac2ec6`) 전문을 추가로 읽었다.

## 변경 문구의 의미

| ID | 검토 문구·이유 | 수정안 / 의미 보존 |
| --- | --- | --- |
| 918 | `Taiwan Presale Handover and Mortgage Notices`는 대출 통지와 인도 쟁점을 유지한다. 요약의 `handover notice within six months of occupancy permit receipt`는 현행6개월을 허가 수령 기산 통지기한으로 정확히 표현한다. `This case used a four-month contractual notice period`는 사건 계약4개월과 현행법을 구별한다. | 문제 문장 없음 / 수정 불필요.6개월 안에 실제 인도 전체가 완료되어야 한다거나 과거 계약에 현행 규칙을 소급한다는 뜻으로 바꾸지 않았다. 대출 통지 자체가 적법한 인도 통지라는 주장도 추가하지 않았다. |
| 919 | `Taiwan Bullying Case: Dismissal Set Aside` 및 `a civil servant's dismissal over procedural defects`는 처분취소와 절차 결함을 보존한다. `Private employers must protect complainants and conduct fair investigations`는 민간 사용자의 보호·공정조사 의무를 권고로 약화하지 않는다. | 문제 문장 없음 / 수정 불필요. 공무원 사건과 민간 사용자 설명의 주어가 분리되어 있다. 괴롭힘 전부 부존재·복직 완료·민간 징계의 당연무효를 말하지 않는다. 신고 인지·필요에 따른 지원, 희망에 따른 조정 및 불성립 시 계속 조사는 바뀌지 않은 본문·FAQ에 유지된다. |
| 920 | `Taiwan EV Chargers: Shared Areas and Consent`는 주차칸 밖 공용부분과 동의 쟁점을 유지한다. 요약의 `A Taiwan court ordered an EV charger removed from common areas`는 법원에 의해 유지된 이 사건 철거 결과의 짧은 표현으로, 특정 심급이 처음 명령했다거나 확정됐다는 주장은 아니다. `wiring route, owners' resolution and building bylaws`는 해당 동의체계의 요약이다. | 문제 문장 없음 / 수정 불필요. 소유자 결의가 실제로 취득됐다고 쓰지 않았고, 소유자회의/규약상의 관리위원회 허가·전력회사 검사 구분은 본문 그대로다. 계량기를 공용으로 판단했다거나 모든 충전기에 같은 절차를 적용한다는 범위 확대도 없다. |
| 921 | `Taiwan Game Refunds: Coins and Paid Points`는 구체 쟁점을 유지한다. 제목에서 빠진 `Unused`는 요약의 `unused paid points or game fees`에 남아 있다. `A Taiwan court refused a refund for game coins used as chips`는 본건 칩 기능에 따른 거절로 읽히며 모든 게임 코인의 환급 금지를 선언하지 않는다. | 문제 문장 없음 / 수정 불필요. 현행 조건은 `under termination and refund rules`로 유보되고, 본문·FAQ의 미사용 유료점수 OR 게임비용, 필요비용 공제, 종료 후30일 OR 쌍방 합의가 그대로다. 과거 판결과 현행 규칙을 같은 시점으로 합치지 않았다. |

요약은 사건의 모든 날짜·금액·절차를 반복하지 않지만 남겨진 주장에 필요한 범위와 조건을 왜곡하지 않는다. 금액NT$243,548 등 요약에서 생략한 세부사항은 본문·FAQ에서 삭제되거나 다른 값으로 바뀌지 않았다.

## 독립 검증

`independent-audit.py`를 실제 실행해 terminal exit0을 확인했다. 각 초기 snapshot이 기존 독립 handoff의 SHA와 같고, 정확한8치환을 순재현하면 현재 원고가 되며 역치환하면 초기 전체 바이트가 복원된다. 파싱된 metadata 차이는 각 파일의 `seoTitle`, `summary` 두 키뿐이다. H1용 title, FAQ3씩 총12개, 본문·출처 전체 바이트, 날짜·이미지·저자·audience 및 URL 순서는 모두 동일하다. 현재 B12 후보4와 R4는 각각 전체 바이트가 같다.

| ID | 현재 source = R SHA256 | suffix 포함 SEO 제목 | 요약 |
| --- | --- | ---: | ---: |
| 918 | c8f25c18281cd41a11825f6272c53cffb37db0094641c307751dac146d2f5686 | 59 | 156 |
| 919 | aa8d6d97f375da967d5dbe4683d508c8bf4de13d572957abc68e1c5b3e1bccb6 | 56 | 154 |
| 920 | e4a6f40dc3623ad4d24ada3f2536347f85ab17c4e393334324e217dc1526366a | 59 | 153 |
| 921 | b886fb4c396e5ca0a19b5b49b3542be22fa84d507f5c870b4f577f2faf83ca0e | 57 | 151 |

길이는 ` | Hovering Law` suffix 포함 제목60자 이하, 요약150–160자 계약을 충족한다. author-manifest의 실제 공유 CLI4는 각각 올바른 파일/`--lang en`, 현재 SHA, exit0, 정상 stdout·빈 stderr와 연결된다. 메타데이터만 바뀌어 본문 배열이 바뀌지 않았고, §5 관련 제목의 구체성·요약의 조건 보존·굵은 강조 부재를 확인했다. 전체6의 CLI·웹·빌드를 새로 실행하지 않았다. LLMS 재생성 및 통합 테스트 전체의 통과를 이 검수로 대신 인증하지 않는다.

감사 스크립트 첫 실행은 이미 읽은 LESSONS의 SHA 재사용 가드에서 exit1이었다. 공유 파일의 자동 갱신을 확인하고 새 전문을 읽어 정확한 새 SHA로 결속한 뒤 exit0으로 마쳤다. 최초 스크립트와 실패를 `independent-audit-initial.py.txt`, `independent-initial-failure.json`에 남겼으며 원고 결함이나 CLI 실패로 바꿔 보고하지 않는다.

정확8개 old/new, 현재경로4쌍·SHA, 본문 SHA 및 CLI 연결 증거는 [independent-evidence.json](independent-evidence.json)에 있다. 이 검수자는 소유 `independent*` 기록만 작성했으며 R·원고·root 산출물·공유 도구를 수정하지 않았다.
