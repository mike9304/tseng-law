# HR R2 독립 표적 재검수

판정: M01·S01·S02 모두 닫힘. 미해결 필수 0, 선택 0. 원래 독립 R1은 수정하지 않고 이번 결과를 별도 기록한다. 인간 원어민·변호사 승인이나 실제 렌더링·공개 배포 판정은 아니다.

원저자 `hr-author-r2.md` 및 R2 manifest를 읽고, 검수자가 R1 때 직접 보존한 `hr-independent-r1-originals.json`의 여섯 전문과 현행 파일을 비교했다. 저자의 새 사본만을 역복원 기준으로 사용하지 않았다. 수정은 915·920·921의 승인된 세 문자열뿐이며, 나머지 세 편은 바이트 동일하다. 역치환은 여섯 R1 SHA를 모두 복원한다. 제목·요약·FAQ17을 포함한 frontmatter, 숫자·URL 순서도 그대로다.

| 항목 | 직접 읽은 현재 문장과 판정 |
|---|---|
| M01 · 920 | `Sud je razmatrao i ovlast stanara za izvedene radove.`로 바뀌었다. 앞의 주민 주장과 `Čak i da su ti navodi točni...` 및 제거·원상회복 의무는 그대로다. 안전조치 시행 여부를 새 사실로 단정하지 않으며, 보관 판결 L44의 조건부 판단과 맞는다. FAQ2는 불변이다. 닫힘. |
| S01 · 915 | `Promjena iznosa ili pravnog argumenta ne mora stvoriti novi spor; odlučuju stvarne činjenice i sadržaj zahtjeva.`가 불필요하게 겹친 부정 범위를 풀었다. 모든 청구변경 허용으로 넓히지 않고 실제 사실·청구 및 별도 중재합의/추가 조정 검토를 남긴다. 닫힘. |
| S02 · 921 | `Operatorovi zapisi mogu se usporediti s potvrdama o uplati, snimkama i odgovorima službe za podršku.`가 불필요한 반박을 직접적인 자료 비교 설명으로 바꿨다. 직전의 사업자 기록만을 유일한 근거로 삼는 약정 금지는 그대로다. MONOTONY 지적 닫힘. |

변경 세 범위와 인접 문장을 직접 읽었다. 공유 함수를 읽기 전용으로 호출해 바뀐 세 파일의 실제 배열을 재추출했고 저자 저장 배열과 일치한다. 915 38→38, 920 43→43, 921 43→42이며 현재 전체는 249분절이다. 전체 249개를 이번 R2에서 새로 재독하거나 전체 CLI를 반복한 것은 아니다. R1 전수 독해에 이 세 변경만 연결한다.

현재 원고 SHA에 연결된 저자의 실제 공유 CLI는 변경 세 편 모두 exit 0 / FAIL 0, CV .503/.458/.453이다. metrics `5abf02…19b3e`, multilingual `4af341…084de`, HR profile `d139e9…cde71` 및 실행 당시 expansion `ea03ab…17975`를 현재 설치와 직접 대조했다. R1 이후 expansion 변경은 root가 명시적으로 설치한 FI 날짜/이스케이프 교정이며, R1 기록의 c8f536 버전을 새 버전으로 덮어쓰지 않았다. 이 HR 세 배열은 설치된 현행 코드에서 일치한다.

R1/R2 관련 증거 32개 해시를 다시 확인했다. 변경 세 편의 구조 오류 0·의미 검토 16개는 저자 원결과에 보존된다. 이번 문장 교정은 조문·기산·금액·국적·이미지·FAQ를 바꾸지 않았고 새 필수 문제가 발견되지 않았다. 다른 원고·저자 기록·R·shared는 수정하지 않았다.

검증 결과는 `checks/hr-independent-r2-proof.json`, 최종 SHA는 `checks/hr-independent-r2-manifest.json`에 있다.
