# ES920 후속 독립 감수 — 한 문장 종결

판정: PASS_NARROW_CLOSURE. 현재 수정에서 남은 필수 사항 0건, 새 선택 사항 0건. 기존 r1 전체 6편 감수와 선택 제안 3건은 그대로 보존한다.

검수자: `/root/release_build_prepare` · 기록 시각: `2026-10-29T00:16:16.795459+00:00`. 다음 배치 인수용 한 문장 감수이며, 현재 배포 72편에 추가하거나 원고/R을 수정한 기록이 아니다.

## 현재 바이트와 범위

- 현재 ES920: `/Users/son7/tseng-all-language-columns-20261025/batch12/src/content/columns-es/920-taiwan-apartment-ev-charger-common-area-judgment.md`
- 현재 SHA-256: `d6a190905068c5889ceb9d0022b7f380ab0c4deac91c7311bc7a0a8b7e8b649e`
- 변경 전 SHA-256: `d9bb6af386a6552bed5f37e7b45f7a0425920ef2fa2d3fd1aee17185d2b32545`
- 작성자 기록: `reviews/es-author-r2.md`, `checks/es-author-r2-manifest.json`, `checks/es-author-r2-exact.diff`
- 이전 독립 전체 감수: `reviews/es-independent-r1.md`, `checks/es-independent-r1.json`. 현재 수정 전 원고에 대한 역사 기록으로 보존하며 덮어쓰지 않았다.

작성자 보고서를 직접 읽고, 현재 920의 도입과 수정 문단 및 전후 법률·규약·조건부 진술 문단을 읽었다. B6 정본과 보존 공식 자료 L43을 대조했고, 변경 전후 원본으로 단일 치환을 순·역방향 재생했다. 새 웹 요청, 공유 CLI 재실행, 6편 전체 재감수, 빌드는 수행하지 않았다.

## 문제 문장 · 이유 · 수정안 · 의미 보존

변경 전: `El tribunal consideró comunes esas partes e instalaciones.`

이유: 직전 문장에 `contador propio`가 있어 `esas partes e instalaciones`의 범위에 계량기까지 들어간다고 읽힐 수 있었다. root가 발견해 제안한 이 후속 쟁점은 기존 r1 판정을 지우지 않고 별도로 종결한다.

현재 수정안: `El tribunal consideró comunes la pared, el techo y el cuadro eléctrico utilizados para la instalación.`

의미 보존: PASS. 보존된 공식 판결 L43은 공용 부분인 벽·천장과 공용 시설인 전기함을 구체적으로 구별한다. 계량기 연결은 별도로 서술한다. 새 문장은 그 명시된 세 대상만 공용 판단의 대상으로 삼으므로, 계량기 소유권을 판결했다고 추론하지 않는다. `utilizados para la instalación`도 앞 문장에 적힌 설치 경로를 자연스럽게 받는다. 세 명사를 밝히는 것은 이 사건의 법적 대상 범위를 명확히 하는 데 필요하다.

정본: `/Users/son7/tseng-all-language-columns-20261025/batch06/research/canonical-snapshots/zh-920-taiwan-apartment-ev-charger-common-area-judgment.md` · SHA `59fb9c0ff8d1c5760300cd7e525ef3fd2c8c1bbd4327c589786ba9e4bca2f582`.

보존 공식 자료: `/Users/son7/tseng-all-language-columns-20261025/batch06/research/retained/zh-hant-ev-primary-recovered.md` · SHA `69e09470e7e81edf23c9708e3b942a01c32dfc2e6128c49b353d180634cebbe2` · L43. 이 자료는 기존 확보본이며 이번에 다시 접속한 전문 판결이나 후속 확정 여부 확인으로 표현하지 않는다.

법 제11조의 소유자 회의 결의와 해당 건물 규약 제15조의 관리위원회 허가·전력회사 안전검사 조건은 그대로다. 법 제6조의 절차·범위와 주민이 주장한 잠금·사용 중단에 관한 ‘사실이라고 하더라도’ 판단도 그대로다. 이 한 문장으로 모든 충전기의 절차나 철거 결과를 일반화하지 않는다.

## 정확한 보존 확인

- 920 본문 31행의 한 문장만 1회 치환. 순방향 및 역방향 재생 결과가 각 원본 바이트와 일치하며, 작성자 diff도 같은 단일 hunk다.
- frontmatter 전체가 바이트 단위로 같다. 제목·요약·AI 작성 표기·이미지 메타데이터·FAQ 3개가 모두 보존됐다. 기존 6편 FAQ 합계 17개도 유지된다.
- 숫자 토큰 105개의 순서와 URL 9개의 순서가 정확히 같다.
- 나머지 ES915·916·918·919·921의 현재 SHA는 r1 독립 입력 해시 및 작성자 r2 기록 양쪽과 일치한다.
- r1 handoff가 열거한 독립 감수 산출물 10개의 해시가 모두 그대로다. 원래 r1 보조 검사기의 연락처 상대경로 오판/수정 이력도 보존된다.
- 이번 좁은 판단에 재사용한 규칙·사실표·계약·출처 정본과 ES 공유 검사기 3개 바인딩이 일치한다. 소유권 문서의 이전 행정적 추가는 원고 변경으로 취급하지 않았다.

## 실제 CLI 기록과 §5 / MONOTONY

작성자가 현재 SHA에 대해 실행한 실제 `python3 .../variety_metrics.py check <ES920> --lang es` 기록을 재사용했다. 독립 검수자가 이번에 새로 실행한 것처럼 기재하지 않는다. 명령 대상·현재 SHA·stdout·stderr·exit를 대조했다.

- 실제 보존 exit 0, FAIL 0, WARN 0
- 38문장, CV 0.460, 짧은 문장 비율 0.105, run3 0.0, 도입 반복 0.083
- stderr 비어 있음; `OK — no variety limit violated` 보존

§5 변경 문장 점검: 문장 하나가 문장 하나로 바뀌었으며 `instalación.`에서 끝난다. 날짜·소수점·약어를 문장 경계로 만들거나 가짜 단문·목록을 넣지 않았다. 구체적인 세 대상 열거는 법적 의미 때문에 필요한 병렬이다. 도입·소제목·마무리와 나머지 구조가 불변이므로 새 범용 도입, 정보 없는 강조, 훈계형 마무리 또는 구조 복제를 만들지 않았다.

MONOTONY: 이 변경에서 새 필수 반려 사유 없음. 기존 전체 §5 감수와 선택 제안 3건은 그대로 재사용하며, 선택안을 적용했다고 주장하지 않는다.

독립 종결 영수증: `checks/es-independent-r2-closure.json`. root는 이 현재 SHA를 기준으로 다음 배치 인수의 ES920 보류 1건을 닫을 수 있다. 새 배포 완료나 사람 원어민·변호사 감수 승인을 뜻하지 않는다.
