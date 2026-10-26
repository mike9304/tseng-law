# SR 저자 R2 — 916 S01 선택 명료화

2026-10-26T09:45:32.160339+00:00. Root가 독립 R1의 선택 S01을 채택하여 정확히 한 문자열만 바꿨다. 원 독립 R1·저자·manifest·기존 검사 기록을 그대로 보존했고, 기존 문장을 필수 오류로 재분류하지 않는다. 사람 원어민·변호사 감수 표시는 아니다.

## 실제 수정과 의미

전: `razmatranje podrške finansiranju tajvanskih privatnih ulaganja uz američke privatne partnere`

후: `razmatranje američke podrške finansiranju privatnih ulaganja na Tajvanu u saradnji sa američkim privatnim partnerima`

전체 변경 문장:

> Kancelarija američkog trgovinskog predstavnika, USTR, u [informativnom dokumentu iz februara 2026.](https://ustr.gov/about/policy-offices/press-office/fact-sheets/2026/february/fact-sheet-us-taiwan-agreement-reciprocal-trade) opisuje nameru SAD i Tajvana da podstiču prekogranična ulaganja, kao i razmatranje američke podrške finansiranju privatnih ulaganja na Tajvanu u saradnji sa američkim privatnim partnerima i u skladu sa merodavnim pravom.

미국이 금융지원을 고려하는 주체이고 투자 대상지는 대만이라는 점을 명시했다. `tajvanskih privatnih ulaganja`를 대만 투자자의 투자로 읽을 가능성을 줄였다. 미국 민간 파트너와 협력·적용법 조건을 보존하며 지원금 지급이나 개별 투자권을 보장하지 않는다. 다음 `Reč je o nameri i mogućoj podršci.`와 `Dokument ne daje svakom pojedinačnom investitoru pravo na finansiranje.`도 그대로다. 영문 상담 페이지 안내 역시 불변이며 세르비아어 상담 보장을 추가하지 않았다.

B6 동결 EN916과 공식 USTR 보관 응답 `research/recheck/official-04.json`의 L23을 실제 다시 읽어 미국 측 지원 고려·대만 투자·미국 민간 파트너·적용법의 관계를 대조했다. 새 HTTP 조회나 협정 발효 확인을 했다는 뜻은 아니다. 공통 규칙/문체 정본/정본6은 같은 SHA에서 계속 작업하며 전문을 읽은 기록을 재사용했고, 현재 LESSONS17:05 SHA `86710ef330b108a916a7bb92a75f1ffa62dea53412e8a75f38472d9fa9b33130`도 확인했다.

## 실제 바이트와 검사

916 전 SHA `8784312ab5e99542024568fde997318bb6ab6b1bdada863a39c499d505fce6bb` → 후 SHA `9e9d09b14055817298fb1fe594c968745cd819ecf121d4ae98999a7a9979c3b8`.

`sr-review-r1-edits.json`에 전체 전후 텍스트·exact 위치·diff·역복원·원R1 해시를 남겼다. 수정 후 실제파일에서 한 구절을 되돌리면 이전916 SHA가 정확히 복원되며 다른5편은 바이트 불변이다.6편의 원R1 SHA를 모두 재현했다. Frontmatter/FAQ17, URL 값·등장 순서, 숫자 토큰·순서는 그대로다.

Node24 PATH와 실제 공유 `--lang sr`로916만 실행했다. exit0/FAIL0,38문장, CV.518, short.158, run3.028이다. 직전916 CV.504가 .518로 바뀌었지만 수치를 위한 추가 문장 조작은 하지 않았다. 원고의 정확한 선택 문구를 한 번 적용한 결과다. 구조도916만 검사하여 errors0, semanticStatus REVIEW_REQUIRED를 보존했다.

실제 ReactMarkdown/remarkGfm 렌더도916만 새로 실행했다. 메타데이터·FAQ3·그림/캡션/공식 URL·굵은 강조/내부 저자 노출 검사는 오류0이다. 표시문을 독립 파싱하여 실제38개 배열을 다시 합친 문단과 비교했고 모두 같다. 다른5편의 같은 SHA 검사·렌더 근거는 재사용했다. 특히921의 실제 근거는 초기 배치 exit1 안에서 해당파일 개별 OK였음을 유지하고, 별도921 exit0 실행을 새로 주장하지 않는다.

전체238분절 중237개가 그대로이고916의 한 문장만 바뀌었다. 변경 문단3문장과 앞뒤 문맥을 직접 읽었다.42/7/9단위의 흐름으로 한 긴 조건 문장 뒤에 짧은 의향/가능성 문장과 개별권리 제한이 이어진다. `2026.`의 날짜 마침표가 문장을 나누지 않는 기존 실제 경계도 유지했다. §5의 도입·질문·실질 결말·문단 시작·숫자·출처·가상 표시를 바꾸지 않았다. MONOTONY: 새 반려 사유0; 해당 문단에 긴 문장은1개다.

원저자 SHA `0520baa492ca270252fa4161faa9f399dd0ddfa33a3ff76a79a160f68c3a1f41`, 원manifest `3679a1bb60e2606dc9a4c38022ea6b55bd35ca0f0d23cc746a0808a1a780dc07`, 독립R1 `ca68e8e54a6e0e5430676ce528c6549295dbae4e958c6a4e9efb66dd30dba03f`는 불변이다. 현재 증거는 `sr-review-r2-proof.json` SHA `be560872fedf7aa0faf8f3feb7fb29a53a149e313cda1ee9dac28640cdcf6489`와 새 최종manifest로 연결했다.

독립 검수자에게 이 한 변경의 표적 종결을 요청한다. R·공유 도구·타인 파일은 수정하지 않았으며 공개 브라우저·카드·JSON-LD·feed·빌드·배포를 새로 확인하지 않았다.
