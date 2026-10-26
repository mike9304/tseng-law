# RO6 저자 R2 — 독립 선택안 2건 반영

Root가 채택한 R1의 O01·O02를 제안 문자열 그대로 적용했다. 저자 단계의 표적 검증을 마쳤으며, 독립 검수자의 변경 구간 종결은 별도다. 사람 원어민·변호사 승인이나 공개 완료를 뜻하지 않는다.

기존 `ro-author.md`, `ro-author-manifest.json`, 독립 R1 보고서·manifest·근거는 보존했다. 수정 전 전체 6편과 당시 RO 증거 해시는 `checks/ro-review-r2-before.json`, 정확한 전후 전문·diff·2치환은 `ro-review-r2-edits.json`에 있다.

## 실제 변경

| 지적 | 전후와 이유 | 의미 보존 |
|---|---|---|
| O01, 920 FAQ2 첫 문장 | `Locatarul a invocat oprirea, încuierea și predarea cheii.` → `Locatarul a invocat oprirea și încuierea echipamentului, precum și disponibilitatea de a preda cheia comitetului.` | 본문에 이미 있던 위원회에 열쇠를 인도할 의향을 FAQ에도 명시했다. 실제 인도 완료로 바꾸지 않는다. 뒤의 ‘설령 참이어도’ 및 제거·원상회복 의무, 해당 사건 한정은 불변이다. |
| O02, 915 ITA 문단 첫 문장 | 자료 링크 뒤 주어·동사 사이 쉼표를 제거하고 `achiziții taiwaneze de energie și rețele`를 `achiziții pentru infrastructura energetică și rețelele electrice din Taiwan`으로 명확히 했다. 정확한 전체 치환은 승인된 findings와 같다. | 2026-09-30 자료, 연말/2027 예정 조달, 미국 공급자 기회, 뒤 두 문장의 전망·특정 입찰/자격/85-1 분류 비보장과 URL을 보존했다. |

수정 전 독립 R1 전문·findings, 현재 문맥 및 공식 보관 응답을 직접 읽었다. O01은 `retained/zh-hant-ev-primary-recovered.md` L32/L44의 열쇠 보관 의향과 조건부 판단, O02는 `recheck/official-04.json` ITA L13–15의 발전설비·전력망·인프라 조달과 대조했다. 새 HTTP 조회로 표시하지 않는다. 문체 정본과 17:05 LESSONS는 앞선 직접 전문 열람의 동일 SHA를 확인해 적용했다.

## 표적 검증

- 두 치환을 정방향 적용하고 현재 6편에서 역방향으로 재생해 R1 6 SHA를 모두 정확히 복원했다. 나머지 4편의 파일 바이트는 불변이다. 전체 6편의 숫자와 링크 등장 순서도 불변이다.
- 915은 frontmatter·FAQ가 바이트 동일하고 본문 한 문장만 바뀌었다. 실제 공유 `--lang ro` 명령 1회: exit0, FAIL0, 39문장, CV .545, 짧은 문장 .205, 동일 시작 연속0. 변경된 34번 문장과 앞 문장·뒤 두 문장을 직접 읽었다. 39개 경계 중38개는 기존과 같고 한 문장만 대체됐다.
- 920은 frontmatter의 `faq.1.a`만 변한다. 본문 전체 바이트·문단·36개 배열·지표가 기존 실제 측정과 같다. 따라서 별도 920 CLI를 반복하지 않고 기존 exit0/CV .450을 동일 본문 근거로 연결했다. 바뀐 FAQ 질문·답변 전체와 본문의 의향·가정적 판단 문단을 직접 다시 읽었다.
- 전체 228개 분절 중227개는 동일하다. 다른 4편의 기계·의미 판정을 새 전수 검수로 표시하지 않는다. 918의 기존 출처 꼬리 변경에 따른 측정 본문 불변 연결도 기존 기록대로 유지한다.
- 실제 구조검사는 영향 915/920 두 편만 실행해 오류0, REQUIRED11을 보존했다. 전체 metadata를 파싱해 FAQ 총17개와 변경 필드가 `920:faq.1.a` 하나뿐임을 확인했다. 날짜26일·저자 식별자·topic·이미지 고지·나머지 FAQ는 그대로다.
- 공유 metrics/multilingual/expansion/ro profile 네 SHA를 저장하고 기존과 같음을 확인했다. 정상 표기·임계값·공유 검사기·R·다른 작성자의 파일은 변경하지 않았다.

MONOTONY: 새 필수 항목0. 915의 문장 길이만 약간 늘었으며 뒤의 짧은 `Sunt perspective de piață.`가 유지된다. 기존 숫자 도입·문단 시작·법정 조건·결말은 변하지 않았다. 920은 FAQ 밖 리듬이 불변이다. §5의 전체 판단은 보존된 저자 R1과 독립 R1에 연결하며 변경 범위에서 회귀를 발견하지 않았다.

보조 읽기에서 존재하지 않는 `checks/ro-audit.mjs`를 한 번 요청해 exit1이었고, `rg`로 실제 `ro-content-audit.mjs`를 찾아 전문을 읽은 뒤 두 편 구조검사를 실행했다. 실패한 읽기에는 파일 변경이나 검사가 없었다. 이 사실은 proof에 구별해 기록했다.

## 현재 동결

| 원고 | R2 SHA-256 |
|---|---|
| 915 | 688c9eaa19ea1fa85cd2940f0294aa1beb6a1a6868fa655207b1053acb122fd2 |
| 916 | a155be35ec16384685cba6654957720f4e3f2bff222dda12e3f775c36d3b28b4 |
| 918 | 3d20ec40f6fdd4ea65f2ec8e58d18c2a0d1c88ff65f9cbd0b58589da6f94bdcb |
| 919 | ac559acc2d867931be628dd9043cf6b26feab5197b16e3f00041d8370fcf2df5 |
| 920 | 80886af9d8ef1327eaabe2fd0a9de1ce44aa9dac2f595e36930e8c04a1807adf |
| 921 | bb70cb4089ad9bf470a52da6b41fd7807a2d56c1ec3ffe2ddbed4224f52bcfc9 |

핵심 근거: `ro-review-r2-proof.json`, `ro-review-r2-metadata.json`, `ro-variety-review-r2.json`, `ro-content-audit-review-r2.json`. 종료 해시는 별도 `ro-author-r2-manifest.json`에 고정한다. 원고는 독립 R2 재확인 중 동결한다.
