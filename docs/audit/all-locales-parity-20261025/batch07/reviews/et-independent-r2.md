# ET B7 R2 표적 독립 검수

기존 필수 M01·M02와 선택 S01·S02는 해결됐다. 승인된 네 치환 외 원고 변화는 없으며, 세 원고의 치환을 역복원하면 독립 R1 원본과 바이트 단위로 일치한다. 미변경 세 편, FAQ 17개, 외부 URL 순서, 숫자 문자열 순서는 모두 유지됐다. 915는 summary만 바뀌고 본문이 같다. 918·920의 frontmatter도 같다.

| 항목 | 확인 문장과 의미 | 판정 |
|---|---|---|
| M01 | `Dokumentide võrdlemine aitab hinnata...`는 서류 비교를 분쟁 동일성을 평가하는 방법으로 설명한다. 새로운 법정 전제는 제거됐다. | 닫힘 |
| M02 | `Ühendus elaniku arvestiga...`는 주민 계량기와 연결되는 사실만 남긴다. 반대 소유권 주장도 추가하지 않았다. | 닫힘 |
| S01 | `Arendaja palus...võtta ühendust...ja teatada...`는 은행 연락·진행상황 회신 요청을 자연스럽게 표현한다. 날짜와 주체가 같다. | 닫힘 |
| S02 | `...kõrvutada olemasolevate otsustega...`는 허가를 미리 단정하지 않고 도면과 결정을 대조한다. MONOTONY의 추상적 중심 문서 선언이 구체 동작으로 바뀌었다. | 닫힘 |

새 필수 M03 한 건은 918 수정 문단의 주변 문장을 읽다 발견했다. R1에서 놓친 부분임을 명시한다. 현재 `Juulikuisel esimesel ülevaatusel ootasid puudused endiselt parandamist ning lift polnud veel paigaldatud.`의 끝은 설치되지 않았다는 상태를 한정 없이 쓴다. 정본 `電梯也未裝好`는 설치 미완료를 말하므로, `ning lifti paigaldamine polnud veel lõpetatud.`로 최소 수정한다. 날짜·결함·인도 판단은 유지되고, 설치가 전혀 시작되지 않았다는 추가 사실을 만들지 않는다. 이 한 문장 외 새로운 필수 지적은 없다.

저자의 실제 R2 공유 검사 두 건(918·920 exit 0)과 동일 도구·원고 SHA를 확인했다. 같은 SHA의 CLI는 다시 실행하지 않았다. 본문 259개 추출 단위 중 256개는 동일하고 바뀐 3개와 앞뒤 문장을 읽었다. 915 요약 교정은 본문 측정 범위 밖임을 구분한다. 변경 세 편의 구조 오류 0/REQUIRED 16 및 전체 32개 의미 검토 표시는 유지된다. 기존 20개 기록의 SHA도 불변이다.

[독립 대조 증거](../checks/et-independent-r2-checks.json)에 직접 계산한 SHA·역복원·문장 차이를 남겼다. 이번 판정은 기존 네 지적 닫힘과 새 M03 미해결을 함께 기록한다. 원어민·법률가 승인, 실제 렌더링 또는 공개 배포 승인으로 확대하지 않는다. 원고와 타인 기록은 수정하지 않았다.
