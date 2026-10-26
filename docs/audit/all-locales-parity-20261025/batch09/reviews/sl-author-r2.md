# B9 SL 저자 R2 — 선택 명료화 두 곳

2026-10-26T18:28:07.907728+09:00

Root가 독립 R1의 O01/O02를 채택하여 해당 두 곳만 최소 교정했습니다. R1은 필수0·선택2였으며 이 작업을 필수 법률 오류 수정으로 재분류하지 않습니다. 원 `reviews/sl-author.md`, `checks/sl-final-manifest.json`, 독립 R1 보고서·manifest·findings는 바이트 그대로 보존했습니다. 실제 읽고 적용한 독립 R1 보고서 SHA는 `a52d61c75547b82f1ba3d9a8b27341cd354b90622610a635dc3173bb3109a505`입니다.

## 정확한 두 치환

O01,916: 기존 USTR 가능성 요약을 두 문장으로 바꾸어 ‘적절한 경우 지원을 고려’, ‘대만의 핵심 분야’, ‘미국 민간 파트너와 협력’, ‘적용 법규’를 직접 나타냈습니다. 현재 EN 정본과 같은 요약이었던 기존 문장을 허위나 모든 투자자의 자격 보장으로 판정하지 않습니다. 세부 명료화를 root가 선택한 것입니다.

현재 변경 문장:

> Informativni list USTR iz februarja 2026 opisuje namere ZDA in Tajvana glede čezmejnih naložb. Ameriška stran je napovedala, da bo, kadar je to primerno, razmislila o podpori financiranju naložb v ključnih sektorjih na Tajvanu v sodelovanju z ameriškimi zasebnimi partnerji in po veljavnih predpisih.

뒤의 개별 승인 아님·협정 전체 발효 증거 아님 두 문장은 그대로입니다. [공식 USTR 자료](https://ustr.gov/about/policy-offices/press-office/fact-sheets/2026/february/fact-sheet-us-taiwan-agreement-reciprocal-trade)의 보관 응답 `batch06/research/recheck/official-04.json` SHA `151502199d4109a8aecb1e4a95b755f1e8171b96550e86b1753d9b0cfb7f9d58`, L23을 실제로 다시 읽고 이 제한과 대조했습니다. 새 외부 HTTP 조회를 한 것은 아닙니다.

O02,920: `Tudi pogodba z monterjem lahko določi, ali sme delo začeti pred pridobitvijo soglasij in kdo nosi stroške, če je prošnja zavrnjena.`를 다음으로 바꿨습니다.

> Tudi pogodba z monterjem lahko začetek del veže na pridobitev potrebnih soglasij in določi, kdo nosi stroške, če je prošnja zavrnjena.

후속 `Tak dogovor ne nadomesti odločitve pristojnega organa stavbe.`는 그대로입니다. 사적 계약의 착공 조건을 필요한 동의에 연결하는 조언이며, 모든 설치에 새 동의 절차를 일률적으로 강제하지 않습니다. 원문도 허가 없는 착공을 승인한 것은 아니지만 분리해 읽을 때 생길 수 있는 혼동을 줄였습니다.

`checks/sl-review-r1-edits.json`에 exact old/new·위치·실제 diff·전후 SHA를 기록했습니다. 두 치환을 역으로 적용해 R1 여섯 파일의 SHA를 모두 재현했습니다. 다른 네 파일은 처음부터 바이트가 같았습니다. Frontmatter/FAQ17 전체 바이트, 모든 URL 값·순서, 숫자 토큰·순서는 R1과 같습니다. 출처 링크·날짜·가상 캡션·AI 표기를 변경하지 않았습니다.

## 영향 파일의 실제 검사와 경계

공유 명령은 기존과 같이 Node24 PATH를 두고 실제 `--lang sl`로 실행했습니다. `sl-variety-review-r2.json`과 파일별 로그는916·920만 대상으로 새로 실행한 결과이며 두 파일 모두 exit0/FAIL0입니다. 구조 검사도 정확한 EN916/ZH920 source map으로 영향2편만 실행하여 errors0입니다. 다른 네 편의 같은 SHA 실제 결과는 재사용했습니다.

| ID | 현재 문장 | CV | 이번 실행 | 현재 SHA |
|---|---:|---:|---|---|
| 915 | 41 | 0.527 | 같은 SHA 기존 actual 결과 재사용 | `649eaa92c45bf3f3a708805011aa7f28f88553c70b8dd13985e03b2c4f964f0f` |
| 916 | 43 | 0.470 | 새 실제 CLI exit0 / FAIL0 | `a6589e8395d4f32408c1c194a26f54a9b87f5aaa944db14e6a1f7f1d64858957` |
| 918 | 43 | 0.479 | 같은 SHA 기존 actual 결과 재사용 | `78ddaf97bff0d6eb30dad29ed60be5292363744fefd3eb0266ff8316ced5f858` |
| 919 | 41 | 0.462 | 같은 SHA 기존 actual 결과 재사용 | `cbc5c8726046e43b8438f4c4147938cb3c53806a6c234e9c6d6f2f3ba991a98c` |
| 920 | 41 | 0.478 | 새 실제 CLI exit0 / FAIL0 | `dbe66f18a0c146e1f6dbfba0addbf78585cc0c6be8c5d246a5d04bd0cb2bb55e` |
| 921 | 43 | 0.468 | 같은 SHA 기존 actual 결과 재사용 | `96ce40ffc9daf2c997e2698a0c6ba8ef9ebc3a9a5f253313c9053bae0f5a9281` |

전체 현재252문장 중249개는 R1과 같고, 기존 두 문장을 대신하는 새3문장을 포함한 두 문단7문장을 앞뒤와 함께 다시 읽었습니다. 916의14→30→5→12단어 흐름에서 USTR의 조건과 두 한계가 연결되고,920의21→8→8단어 흐름에서 계약 조언·공동체 권한·비용을 구별합니다. 문장부호를 점수에 맞춰 왜곡하지 않았습니다. 바뀐 두 편만 실제 ReactMarkdown/remarkGfm으로 다시 렌더했고, 같은 SHA의 다른 네 편 결과를 재사용하여 현재252문장 문자열이 모두 표시문 추출과 일치함을 확인했습니다. `sl-review-r2-integrity.json`에 정확한 delta·FM/FAQ/URL/숫자·역복원·경계 증거가 있습니다.

§5의 도입·문단 시작·본문 질문·고지 전 실질 결말은 두 수정으로 바뀌지 않습니다. 한 문단에 긴 문장이 추가로 몰리지 않으며 새 문장은 USTR의 구체적 조건 설명과 계약상 착공 조건입니다. 기존 MONOTONY 개선을 되돌리지 않았습니다. 17:05 LESSONS 및 정본·규칙 입력23과 이미지6 SHA도 동일합니다.

## 상태와 한계

저자 R2 동결이며 기존 독립 검수자에게 변경분 표적 재확인을 요청합니다. 원고 외 수정 범위는 소유 sl-* 검사 증거와 이 보고서뿐입니다. R·공유 도구·다른 언어·독립 R1을 변경하지 않았습니다. 실제 CLI/구조 통과는 사람 원어민·변호사 승인이나 통합·배포 확인이 아니고, 이번에는 브라우저 화면·카드·JSON-LD·feed를 검증하지 않았습니다.
