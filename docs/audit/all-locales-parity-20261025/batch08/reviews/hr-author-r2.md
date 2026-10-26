# HR6 저자 R2 — 독립 R1의 세 국소 교정

2026-10-26. 저자 `/root/column_source_quality`. 상태: 저자 교정 완료·현 원고 동결, 독립 R2 재확인 대기. 원어민 인간 감수·변호사 승인·화면 검수·공개 완료를 뜻하지 않는다.

원래 [저자 기록](hr-author.md), [독립 R1](hr-independent.md), 양쪽 기존 manifest와 최초 실패 증거를 그대로 보존했다. 독립 R1의 필수 M01과 선택 S01·S02를 수용했다. 915·920·921에서 각각 한 문자열만 바꾸었으며 916·918·919는 바이트 단위로 불변이다. R·공유 도구·다른 작성자의 원고와 보고서는 수정하지 않았다.

## 교정과 의미 보존

| 항목 | 문제 문장 → 실제 교정 | 이유와 보존 범위 |
|---|---|---|
| M01 / 920 | `Naknadne sigurnosne mjere nisu otklonile pitanje ovlasti za izvedene radove.` → `Sud je razmatrao i ovlast stanara za izvedene radove.` | 후속 안전조치가 실제 실행됐다는 단정을 제거했다. 앞의 주민 주장 및 `Čak i da su ti navodi točni` 조건과 제거·원상회복 의무는 유지했다. 보관된 판결 원문 L44의 `縱然屬實` 및 중단 여부 추가 조사 불필요라는 이유를 직접 다시 읽었다. FAQ2도 그대로다. |
| S01 / 915 | `Ni svako popravljanje iznosa ili pravnog argumenta nužno ne stvara novi spor; odlučuju stvarne činjenice i sadržaj zahtjeva.` → `Promjena iznosa ili pravnog argumenta ne mora stvoriti novi spor; odlučuju stvarne činjenice i sadržaj zahtjeva.` | 부정의 범위를 명확히 했다. 금액·법률 논거 변경이 언제나 새 분쟁이라는 뜻도, 언제나 중재 가능하다는 뜻도 아니다. 실제 사실 및 청구 내용에 따른 판단, 별도 중재합의·추가 조정 가능성은 유지한다. |
| S02 / 921 | `Njegovi podaci time ne postaju bezvrijedni. Mogu se usporediti s potvrdama o uplati, snimkama i odgovorima službe za podršku.` → `Operatorovi zapisi mogu se usporediti s potvrdama o uplati, snimkama i odgovorima službe za podršku.` | 독자가 제기하지 않은 반박을 없애고 자료 비교 방법을 직접 썼다. 직전의 제공자 기록만을 유일한 판단 근거로 정할 수 없다는 금지 조항은 그대로다. |

세 치환의 정확한 전후 문자열·diff와 R1 원고 전체는 [수정 증거](../checks/hr-review-r2-edits.json)에 있다. 현재 6편을 메모리에서 역치환해 R1의 6개 SHA를 정확히 복원했다. 제목·요약·FAQ17·그 밖의 frontmatter, 숫자 순서, URL 순서는 모두 불변이다. [독립 재현용 proof](../checks/hr-review-r2-proof.json)와 [실행 스크립트](../checks/hr-review-r2-proof.py)를 남겼다.

## 실제 검사와 독해 범위

변경 3편에만 설치된 공유 검사기를 실제 실행했다. 각 exit 0 / FAIL 0이며 915는 38문장·CV .503, 920은 43문장·CV .458, 921은 42문장·CV .453이다. [원출력](../checks/hr-variety-review-r2.json)에 당시 도구 SHA를 저장했다. `variety_metrics.py`는 `5abf02f52e35c45f921084106b6acf3c0caf0ca02f09649de1c1eb6977019b3e`, multilingual module은 `4af341932757be7a6b83f84a56ea24792f963653c9c3d008aacade2b79a084de`였다. 이후 다른 locale 경계 수정이 설치되더라도 이 실행 기록의 도구 버전을 바꾸어 표기하지 않는다.

915·920은 각각 완결 문장 하나가 교체됐고 921은 완결 문장 두 개가 하나가 됐다. 세 변경 구간과 앞뒤 문장을 직접 읽었다. 정상 날짜·서수·조문 표현은 건드리지 않았다. 새 배열과 기존 불변 세 배열을 합친 실제 본문 분절 수는 249개이며, 전체 249개를 새로 재독했다고 주장하지 않는다. 최초 자기검수 전문 독해와 독립 R1을 보존하고 이번에는 바뀐 경계와 인접 문맥을 재확인했다. [병합 배열](../checks/hr-boundaries-review-r2-merged.json)에 현 여섯 SHA가 연결돼 있다.

실제 R content-audit SHA `3926a274bf544fed7e34339aa8b2636d41a4be79c0aaff898f46fc65595faf4b`로 변경 3편을 검사해 오류 0건을 확인했다. [구조 원결과](../checks/hr-review-r2-content-audit.json)의 의미 검토 항목 16건은 지우거나 자동 승인으로 바꾸지 않았다. 정본 세 SHA도 직접 확인했으며, 이번 치환은 그 조문·기산·금액·재판 결과를 변경하지 않는다. 불변 3편의 전체 CLI·구조 검사는 반복하지 않았다.

규칙 §5의 이번 영향 범위도 검토했다. 도입·소제목·끝 문장은 바꾸지 않았고, 915는 부정 범위가 선명해졌다. `MONOTONY: 불필요한 반박 — 921의 “Njegovi podaci time ne postaju bezvrijedni.” — 자료 비교 방법을 직접 진술`은 실제 교정으로 해소했다. 법적 조건이 담긴 필요한 부정문·예외는 삭제하지 않았다.

## 현재 원고 SHA

| 번호 | SHA-256 |
|---|---|
| 915 | `c13d8f57ce5732caf2c21022c7a18513615629612016598441be3a37b756d57f` |
| 916 | `7c90b1dfe5e9cfd0b5111e5296a88fd766a5add1ae191d892c5deeeddb7ce976` |
| 918 | `c9766d01c05e314f6441a4b93b2cd6f0152eeab4f4c4238c1e84f5b2cd62a726` |
| 919 | `3610f15af0275f9a83f962a2ac94929970f5f4cec69881c1d55487084e65dc3d` |
| 920 | `5e59637b831b7c80b424b0e25288b19e8398fdb560f67110a9fd85b91e73a21d` |
| 921 | `0db591eca4c9cb2d659709a3c8a32491924cb6a2a8b939b2c4312be8443a72ef` |

종료 시 원래 저자·독립 R1 기록의 해시도 다시 대조했다. 새 [R2 manifest](../checks/hr-author-r2-manifest.json)에 현재 6편과 증거를 고정한다. 이 저자 기록은 독립 R2 판정을 대신하지 않는다.
