# 기존 FI704·706 국소 수정 독립 검토

2026-10-26, 검수자 `column_pipeline`, 수정자 root. 두 치환의 의미·문체 검토를 종결한다. 미해결 필수 0, 선택 0. 이 판정은 아래 격리 원고 SHA에 한정하며, 저장소 통합·공개 배포·인간 원어민 또는 변호사 승인을 뜻하지 않는다.

| 글 | 기존 R SHA | 격리 수정본 SHA | 현재 실제 CLI |
| --- | --- | --- | --- |
| 704 | `ab3d0231a3f1bf8c22c7bf22ef48142b9d2e9eb72d0e422082bec6fb076b395d` | `5e054633c3f8c2d92ee9404e893a2277255cdcf44b2759ca0bed7c4382f4b172` | exit0 / 67단위 / CV .500 |
| 706 | `9d8378231e7c024bfa49689cada7a7406837b5afed540fab217bd99f0e5a97ea` | `fe25a6ba9a1a86482f0c46df9ef95fc0b9349385f91a78611763ef01796d76c0` | exit0 / 84단위 / CV .464 |

기존 전문은 FI6의 최근글 비교 단계에서 모두 읽었고, 이번에는 수정본 본문·FAQ 및 두 변경 문단과 전후 문맥을 재독했다. F12·F24(일반 심사기간·보완), F14·F15(업무 허가와 등록)를 보관 `arc-source-facts.md`와 다시 대조했다. 기존 공식 조사 내용을 재사용하며 새 공식 서버 접속을 주장하지 않는다. LESSONS 17:05 전문도 읽었다.

704의 이전 `Yleisen menettelyn ilmoitettu käsittelyaika on kymmenen työpäivää.`에서 시작하는 네 문장은 보완 상황·제외 기간·재기산을 같은 길이로 차례차례 설명했다. 수정은 `Jos NIA pyytää puuttuvia asiakirjoja ... alkaa uudelleen vasta, kun hakija on toimittanut pyydetyt täydennykset`로 원인과 시점을 연결한다. 일반 10근무일은 남으며 보완 요구만 받은 때부터가 아니라 요청된 보완을 제출한 뒤 다시 시작한다. 서류 반환·보완·면담 기간 제외, 처리기간 추정과 특정 여행일 발급 보장 부재를 유지했다. 앞의 보완 통지 다음 날 15일·해외 발급 필요 시 3개월, 뒤의 학생 별도 5근무일도 그대로다.

706의 이전 `Työnantajan vaihtuminen tai lisätyö voi vaatia uuden luvan ennen työn alkua.`부터 세 문장은 새 문단에서 직종별 53조 조건과 허가 범위를 연결했다. `voi edellyttää`는 여전히 경우에 따라 필요하다는 뜻이다. 모든 직종에 예외 없는 신규허가 의무를 만들지 않는다. 새 고용주 또는 추가 업무, 업무 시작 전, 해당 업무에 적용되는 허가 또는 면제 조건이 남고 `NIA:n rekisterimuutos ei yksin anna työnteko-oikeutta.`가 등록만으로 근로권이 생기지 않음을 명확히 한다. 주소·서비스처소 등록과 체류 근거 변경의 각 기산은 인접 표와 FAQ에서 그대로다.

MONOTONY: 같은 길이의 분리 설명 — 704의 심사기간·제외·재기산, 706의 새 고용·53조·허가 범위 — 실제 조건을 한 인과 문장으로 연결하고 짧은 결과 문장을 둔 수정으로 해결했다. 접속사를 늘리기 위해 다른 법적 조건을 새로 묶은 것은 아니다. 도입·제목·질문·인용·끝맺음은 손대지 않았고, 변경 문장과 앞뒤 분절을 직접 확인했다. 긴 문장 연속 또는 새 가상 장면을 만들지 않았다.

`fi-root-edits.json`의 정확히 한 치환씩을 직접 순·역적용했다. 각 현재 전문과 최초 사본·현재 R의 두 원문 SHA가 모두 맞는다. frontmatter 전체와 FAQ, 숫자 문자열 순서, URL 순서, 제목·목록은 불변이다. 원본 R 두 파일이 아직 그대로임을 확인했으며 B7 ARC147 전체를 새로 검수했다는 주장은 하지 않는다.

현재 도구로 frontmatter를 제거한 뒤 두 원문·수정본을 독립 추출했다. 저자의 `fi-boundary-review.json` 전체 배열과 지표가 일치한다. 날짜 교정 후 원문의 실제 CV .441/.444, 수정본 .500/.464를 구별했다. 초기 수동 추출의 frontmatter 미제거 준비 오류는 `fi-boundary-review-unstripped-input.json`에 남아 있고, 이를 실제 CLI 결과로 인용하지 않았다. 실제 CLI `fi-shared-r1-execution.json`·stdout는 올바른 body 처리의 exit0다. 동일 SHA의 전체 CLI를 반복하지 않고 네 도구 SHA와 현재 원고를 대조했다.

근거는 `fi-independent-proof.json` 및 `fi-independent-manifest.json`이다. 원고·저자 증거·R·공유 도구는 수정하지 않았다.
