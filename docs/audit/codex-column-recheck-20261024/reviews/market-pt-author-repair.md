# 포르투갈어 시장 칼럼 694–697 — 지정 문구 수정 기록

작성일: 2026-10-24. 역할: `/root/market_review_pt/market_pt_repair`, 독립 검수자가 지정한 P1–P5를 반영한 별도 AI 수정 작성자. 이 문서는 독립 승인, 사람 원어민 검수, 변호사 검수 또는 공개 게시의 증거가 아니다.

대상 저장소: `/Users/son7/tseng-arc-revision-20261024/repo`.

## 수정 범위

`work/MARKET-REVIEW-BRIEF.md`, `work/reviews/market-pt-independent.md`, 저장소 `AGENTS.md`와 `docs/columns/EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `SENTENCE-VARIETY-RULE.md`, `LESSONS.md`, `MULTILINGUAL-METHOD.md`, `tseng-law-editorial/SKILL.md`와 `references/review-criteria.md`를 읽고 네 원고 전체를 확인했다. 홈의 `~/agent-library/knowledge/editorial-voice.md`는 이 호스트에 없으므로 저장소의 97줄 문체 정본을 적용했다. 작업 시작의 다섯 원고 SHA는 독립 검수 R1에 기록된 값과 일치했다.

수정한 원고는 아래 네 파일뿐이다. 각각 `lastmod`를 `2026-10-24`로 바꿨다. `published: "2026-10-23"`, `date_display`, 나머지 메타데이터, FAQ 답변, 기존 URL, 출처 목록, 법률 조건, 상담 언어, 이미지 경로·alt·caption은 유지했다. P1의 FAQ 질문만 지정된 문장으로 바꿨다. 697의 기존 `Discuta estas escolhas antes de conferir os poderes.`는 그대로 보존했다. ARC704–706, 698, 이미지, 공유 검사기와 독립 보고서는 수정하지 않았다. 커밋·게시를 실행하지 않았다.

## 정확한 변경

| 지적 / 현재 파일:줄 | 원문 | 반영한 문구 또는 삭제 | 보존한 의미 |
|---|---|---|---|
| P1 / `src/content/columns-pt/694-portugal-exportador-acordo-prestacoes-taiwan.md:22` | `O cliente taiwanês torna obrigatório aplicar direito de Taiwan ao acordo?` | `O facto de o cliente estar em Taiwan obriga a aplicar o direito taiwanês ao acordo?` | 고객의 소재지가 적용법을 자동 결정하는지 묻는 질문. 바로 아래 답변은 변경하지 않았다. |
| P2 / 같은 파일:42 | `A redação deve acompanhar a solução negociada.` | 삭제. 앞의 두 문장은 그대로 유지했다. | 권리 포기만 조건부로 하는 경우와 합의 전체를 조건부로 하는 경우, 지급의무 발생 시점의 차이를 보존했다. |
| P3 / `src/content/columns-pt/695-portugal-fornecedor-taiwan-alteracao-conta-fraude.md:28` | `Serve para reconhecer a situação e preservar a informação necessária à análise.` | 삭제. | PJ의 사기 메커니즘 설명·링크와 그 경고만으로 계약 손해의 부담자를 정할 수 없다는 한계를 보존했다. |
| P4 / `src/content/columns-pt/696-portugal-sentenca-arbitral-bens-taiwan.md:50` | 문단 첫 문장의 `Quanto à oposição da contraparte, o [artigo 50](기존 URL) prevê vinte dias após a receção da notificação do pedido.`와 마지막의 `A data da notificação inicia esse prazo.` | `Quanto à oposição, a contraparte tem vinte dias. O prazo previsto no [artigo 50](기존 URL) conta-se desde a receção da notificação do pedido.`로 문단을 시작하고 중복 꼬리를 삭제했다. | 상대방의 이의 제기 20일, 신청 통지 수령 기산점, 뒤따르는 거절 사유와 분리 가능한 초과 부분에 관한 조건을 모두 보존했다. 두 사유·분리 문장은 바이트 그대로다. |
| P5 / `src/content/columns-pt/697-portugal-mandatario-processo-civil-taiwan.md:28` | `Um mandato amplo pode facilitar determinados atos, mas a sua extensão deve corresponder às instruções efetivamente dadas.` | 삭제. | 앞 문장의 통지 수령·기한 내 의사결정 담당, 뒤 문장의 상대방·분쟁 대상 특정 요건을 보존했다. 특별수권 설명도 변경하지 않았다. |

P4의 실제 링크는 이전과 같은 `https://mojlaw.moj.gov.tw/ENG/LawContentE.aspx?LSID=FL010105&media=print`다. 전체 정확한 수정 전후 diff는 [market-pt-author-support/repair.diff](market-pt-author-support/repair.diff)에 있다.

P4 첫 시도는 검수 제안의 `A contraparte tem vinte dias para deduzir oposição.`였다. 실제 검사에서 `A`로 시작하는 문단이 세 개가 되어 `top_opener_n=3` 한 항목이 실패했다. 다른 문단을 손대지 않고, 동일한 기한·행위 주체를 담은 현재의 여덟 단어 문장으로 바꿨다. 의미 없는 문장 추가, 문장부호 왜곡, 무관한 절 병합은 없었다. 실패 결과도 [variety-first-pass.json](market-pt-author-support/variety-first-pass.json)에 보존했다.

## 최신 SHA256와 실제 CLI 결과

실제 실행 명령은 각 행의 절대 원고 경로에 대해 다음과 같다.

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <absolute manuscript path>
```

| 원고 | 최신 SHA256 | 문장 수 / CV / short / run3 | 실행 결과 |
|---|---|---|---|
| 694 | `3d658de92c0b0ff74e6bcbd3da0ab2d16decf6c994693276b62970982449ebe7` | 40 / 0.454 / 0.125 / 0.000 | exit 0, `OK — no variety limit violated` |
| 695 | `05fb0d2b5305c02e5292dbb1fa3d39951dd7c18c8da2b74dc59a51c4aeaa9e22` | 35 / 0.487 / 0.114 / 0.091 | exit 0, `OK — no variety limit violated` |
| 696 | `96ee165f4ac3392ba2dc487b584489b9acfaa875c1ce263b26d32d671cdd97bc` | 39 / 0.460 / 0.103 / 0.081 | exit 0, `OK — no variety limit violated` |
| 697 | `ebbaff65263b49401cd07d3cc5abe439d2ee5a778010795df52f718e2cb717f0` | 42 / 0.480 / 0.095 / 0.000 | exit 0, `OK — no variety limit violated` |

수정한 네 파일 모두 측정이 실제로 수행됐으며 FAIL 0이다. 원고 SHA, 완전한 명령 배열, stdout/stderr, exit code는 [variety-final.json](market-pt-author-support/variety-final.json)에 기록했다. 이 결과는 작성자의 기계 검사이고 독립 문체 승인과는 구분한다.

미수정 698의 SHA는 `80ebc4b50ebfc0d4d0e62373c2d0ec5b9989091726430d9538f48b6b33e6b549`로 유지했다. 작성자 최종 CLI는 수정한 네 파일에 실행했다. 698의 독립 재검사 결과는 독립 검수자의 보고서에 속한다.

`git diff --check -- <four edited paths>`는 exit 0, 출력 없음이었다. 수정 전 사본과 대조해 모든 다섯 원고의 URL 순서와 이미지 실파일 SHA가 유지됨을 확인했다. 메타데이터는 허용된 `lastmod`와 P1 질문 외에 동일하며, 698은 원고 전체가 동일하다. 근거: [preservation.json](market-pt-author-support/preservation.json), [baseline.json](market-pt-author-support/baseline.json), `market-pt-author-support/before/`.

## 규칙 5절 작성자 자기 점검

1. 수정한 네 파일의 실제 CLI 결과가 모두 exit 0/FAIL 0이다.
2. 네 도입은 각각 채권 소멸 위험, 지급 기록의 불일치, 승인 선행 요건, 수권 질문으로 시작한다. 상투적 가상사례를 추가하지 않았다.
3. 아주 짧은 문장은 각각 5·4·4·4개다. P4의 짧은 문장은 실제 이의 제기 기한을 담고, 다음 문장으로 기산점을 이어 쓴다. 긴 문장을 새로 합치지 않았다.
4. 문단 시작을 확인했고 새 반복은 남기지 않았다. 696의 첫 시도에서 발생한 시작어 반복을 같은 지적 문장 안에서 해소했다.
5. `주장(조문) → 다만` 구조가 세 문단 연속으로 생기지 않았다. 지급 기록, 이메일 원본 보존, 통지·재산 자료, 문서 대응에 관한 비인용 실무 문단을 유지했다.
6. 불필요한 반박·대비 틀을 추가하지 않았다. 실제 법적 구별과 한계는 그대로다.
7. 출처 목록 전 마무리는 각각 실제 입금일, 지급·변경 지시·수취인의 분리, 동일 채무자에 대한 문서 연결, 합의·금액 수령 권한에 귀결된다. 정형 홍보를 추가하지 않았다.
8. 굵은 강조, 가공의 체험·의뢰인, 새 공개 작성자, 원어민·변호사 검수 주장을 넣지 않았다. 한국어·일본어 종결형 항목은 포르투갈어 원고에 적용되지 않는다.
9. 조문 번호·기한·금액·링크·이미지 설명·법률 한계를 대조했다. 수정은 P1–P5의 문체 결함에 한정된다.

695의 본문 질문 0개는 기존 상태다. 제목과 채권자 수권 소제목이 실제 질문을 담고, 이후 증거 순서가 바로 이어져 추가 수사 질문을 넣지 않았다.

## 변경 문구와 관련한 출처 확인

2026-10-24에 두 공식 현행 페이지를 직접 열었다. 이 부분 확인은 독립 검수자의 전체 법률·이미지 검토를 대체하지 않는다.

- [대만 섭외민사법률적용법 제20조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20): 당사자의 적용법 선택과 유효한 명시적 선택이 없을 때의 최밀접 관련법 구조를 확인했다. P1은 질문을 자연스럽게 다듬었고 기존 답변과 본문의 적용법 설명을 유지했다.
- [대만 법무부 중재법 공식 영문, 제50조](https://mojlaw.moj.gov.tw/ENG/LawContentE.aspx?LSID=FL010105&media=print): 상대방의 20일 기간, 신청 통지 수령 기산점, 초과 부분의 분리 조건을 확인했다. P4에 새 기한·사유·효과를 추가하지 않았다.

## 인계

현재 네 SHA를 `/root/market_review_pt`의 독립 재검수에 넘긴다. 작성자 보고서 자체는 승인 결론이 아니다. 공개본·화면·배포 검증은 이 수정 작업에서 수행하지 않았다. 볼트와 인덱스의 종합 결과 갱신은 상위 작업에 인계하며, 본 작성자는 지정된 네 원고와 이 보고서·보조 로그만 썼다.
