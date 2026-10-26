# B7 DA — root 채택 S01/S02 후속 저자 기록

Root의 독립 검수는 필수0·선택2건이었다. 지시받은 두 문자열만 수정했다. 기존 `da-author.md`, 독립 보고서, 초기 여섯 원고 스냅샷과 이전 검사 기록은 그대로 두었다. 이 기록은 AI 저자의 변경 확인이며 독립 검수 종료나 인간 감수·공개 배포를 뜻하지 않는다.

## 실제 수정과 의미

| 항목 | 이전 → 현재 | 이유와 의미 보존 |
|---|---|---|
| S01 / 918 본문 | `afviste det yderligere krav` → `gav heller ikke medhold i det yderligere krav` | 추가 청구가 형식적 이유로 각하되었다는 인상을 줄이고 청구 불인용 결과를 설명한다. 전체 문장은 `Den 9. februar 2022 forkastede retten bygherrens anke og gav heller ikke medhold i det yderligere krav, så pligten til at betale renter for forsinkelsen blev opretholdt.`다. 날짜·건설사의 상소 불인용·추가 청구 불인용·지연이자 유지·다음 문장의 상소 불가가 모두 남는다. |
| S02 / 921 summary 마지막 문장 | `De aktuelle tilbagebetalingsregler kræver en særskilt vurdering af saldoens indhold.` → `Betalings- og spilhistorikken kan belyse, hvad saldoen består af, og hvad der kan kræves tilbage.` | 결제·게임 기록이 잔액과 반환 범위를 설명하는 데 도움이 된다는 표현이다. 새 법정 평가 절차나 반환 보장을 만들지 않는다. 본문·FAQ의 미사용 유료 포인트와 미사용 게임요금 양쪽, 필요비, 종료 후30일 또는 합의는 바뀌지 않았다. |

실제 변경 전체와 두 파일의 교정 전 전문, 교정 전후 SHA, 바이트 역복원 결과를 [변경 기록](../checks/da-review-r2-edits.json)에 남겼다. 각 파일에서 한 번의 문자열 치환을 역으로 적용해 root가 검수한 두 SHA를 정확히 재구성했다. FAQ17개와 URL의 등장 순서는 모두 그대로다. 918 frontmatter는 전부 불변이며,921 frontmatter의 변경 키는summary 하나다. 날짜26·audience da·내부 author·허구 캡션·이미지도 보존됐다.

## 필요한 검사만 수행한 결과

918 본문이 바뀌어 실제 공유 `--lang da`를918 한 파일에 실행했다. [원명령·stdout·추출 배열](../checks/da-variety-review-r2.json)에 exit0·FAIL0,43분절,CV .473,짧은 문장 비율 .233을 기록했다. 이전43분절과 현재43분절을 비교하면5번째의 위 한 문장만 다르다. `9. februar 2022`는 문장 안에 남으며 나머지 경계와 실제 문장은 동일하다. 시작·인용·결말과 §5의 다른 항목은 이 한 구절 교정으로 바뀌지 않았다.

921은 summary만 바뀌어 본문 바이트 SHA가 교정 전후 동일하다. 공유 검사기의 frontmatter 제외 처리를 확인했고, 같은 도구/프로필의 기존46분절·CV .454·FAIL0 결과를 연결했다. 새 CLI를 실행한 것으로 표시하지 않는다. 나머지915/916/919/920도 원고 전체와 도구 SHA가 같으므로 기존 실제 결과를 그대로 연결했다. 전체 원고의 반복 CLI·공용 구조검사는 하지 않았다. 기존 구조오류0 영수증과 변경 키·FAQ·URL의 직접 대조를 구별해 [후속 검증](../checks/da-review-r2-verification.json)에 기록했다.

§5 후속: 수정 문장이 일회성 절차 결과를 분명히 하며 반복 대비·질문·정형 결말을 추가하지 않는다. 문단 시작과 인용·조문·날짜는 보존됐다. 921의 자료 활용 문장은 법정 의무처럼 보이는 추상적 요약을 구체화했다. 이전 전체 §5 판단은 바뀌지 않은 나머지 본문에 연결한다. 새 필수 오류나 MONOTONY 반려 사유를 확인하지 못했다.

## 동결 SHA와 보존

| 글 | 현재 SHA |
|---|---|
| 915 | `f0350644b9a9a644a26f7c3cce16a2009651f083ea7b2ff92ea6687d7d6e706c` |
| 916 | `e84f9c194992ef65dfccf4d7b4ecde21adb0fc4f6072d27e560502aa73070b91` |
| 918 | `d299a5c57d3abdae34705a859bfbb56cf68b4a9254c7053dfbb148587261211c` |
| 919 | `733c4ffb57a6f4c77dab0f149d7e2f5b44a0a9a5c9972567bd66e6d132242063` |
| 920 | `1c0bed7a12c7d725a915e7fa72626fc490f4149749edf48f3f7dce5281c8e32f` |
| 921 | `c9215fdddee3e73f4c3b483ba04e012dd123eab95e35bc4f746396b0ecbcf540` |

교정 전 최종 manifest는 [바이트 보존본](../checks/da-author-final-manifest-before-review-r2.json)에 SHA `248eb0e1ba022275adaf370873af3563d8db3a7a6216f660fb15237546284ff0` 그대로 남았다. 기존 저자 보고서 SHA `d79876cbe34c3a1cce51478cd48c7d3399d01313faebeb23d3946aec302e090d`, root 독립 보고서 SHA `c82dc71dc4256a97ede29c33fbfc078a290465f5439d33a9b3d2bdd06f4ef1a4`, 독립 manifest SHA `4250d669c7573dba2bae08b0f122ff8ff0c268f7f51a9c7c866cf1ac27fef962`도 불변이다. 이전 증거12개와 기존 저자 기록의 실제 SHA를 재확인했다.

현재 최종 manifest는 새 두 SHA와 해당 검사 재사용 근거를 가리킨다. Root가 이 두 변경만 확인할 수 있도록 동결한다. R·공유 도구·다른 작성자의 파일·배포 경로는 수정하지 않았다.
