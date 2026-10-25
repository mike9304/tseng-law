# B5 통합 준비 상태

확인: 2026-10-26T01:26:02.267226+09:00. 읽기 전용 조사. 21편 모두 root 통합 준비 상태다. KM R2 종료 시각과 세 SHA는 아래 후속 기록에 연결했다. 배포·렌더 완료 또는 사람 원어민/변호사 승인으로 표시하지 않는다.

| 언어 | 편수 | 상태 | 현재 SHA를 승인 기록에 연결하는 근거 |
|---|---:|---|---|
| LT | 3 | 준비 | [R1](lt-independent.md) + [R2 JSON](../checks/lt-independent-r2.json)·[manifest](../checks/lt-independent-r2-manifest.json). 선택 O1/O2 반영 후 새 SHA. |
| MN | 3 | 준비 | [R1 보존 + R2](mn-independent.md)·[R2 manifest](../checks/mn-independent-r2-final-manifest.json). 필수 M01 및 S01/S02 종료. |
| SR | 3 | 준비 | [독립 보고서](sr-independent.md), 필수 0. S01은 선택 의견. |
| ET | 3 | 준비 | [독립 보고서](et-independent.md), 필수 0. O1/O2는 선택 의견이며 기존 동결본 유지. |
| LV | 3 | 준비 | [독립 보고서](lv-independent.md)·[manifest](../checks/lv-independent-manifest.json), 필수 0·저자 동결 SHA 유지. |
| SL | 3 | 준비 | [R1](sl-independent.md) + [R2](../checks/sl-independent-r2.md)·[manifest](../checks/sl-independent-r2-manifest.json). M1/M2a/M2b 및 O1 종료. |
| KM | 3 | 준비 | [R1 보존 + R2](km-independent.md)·[R2 manifest](../checks/km-independent-r2-final-manifest.json). M01 및 S01/S02 종료, 기존 readiness 검사 SHA와 일치. |

21편 전체의 발행·수정일은 2026-10-26이며 현지 날짜 표시, audience, 내부 저자, 이미지·가상 캡션, FAQ 3개를 파싱해 확인했다. 기존 content-audit를 변경 없이 실행한 자동 오류는 0이다. EN 공식 URL 누락 0, 본문 공식 URL의 출처 꼬리 누락 0, 내부 링크 존재 오류 0, F23/F24의 본문·꼬리 지정 URL은 7언어 모두 있다. 내부 링크는 B5+R의 파일 존재 검사이며 공개 HTTP 확인은 아니다.

현행 보드 정책에서는 신규 21편 모두 로컬 표시 대상이다. 정확한 공유49 언어별 CLI도 21편 전부 exit 0 / FAIL 0이었다. KM의 의미 검수 종료는 기계 검사와 별도로 도착한 독립 R2에 근거한다. 각 저자/독립 검수의 문장 경계·§5 근거는 검수된 SHA에 연결했고, 이번 조사에서 21편을 새로 원어민 검수했다고 주장하지 않는다.

원고별 전체 SHA, 현재 저자/독립 보고서 SHA, 후속 증거 및 검사 연결은 [readiness manifest](../checks/integration-readiness-manifest.json)에 있다. [21편 구조 검사](../checks/integration-readiness-content-audit.json)의 `REVIEW_REQUIRED`·`publicationReady:false`는 유지했다. 소유 보고서·검사 출력 이외의 파일은 수정하지 않았다.

## R 실제 인벤토리

기존 inventory.py를 분류 기준과 스크립트 변경 없이 현재 R에 한 번 실행했다. 기준 HEAD는 `3b5ea95061d61a6b9a0e94eb61438be843fdd63c`이고 49언어 전문 칼럼은 2,100편, 로컬 보드 실제 표시 대상은 1,833편, 별도 이슈 글은 125편이다. 파싱·중복 slug·빈 본문·제목 오류는 0이다. 286/언어 기준 부족은 로컬 파일 11,918편, 표시 대상 12,185편이다. 초과분으로 다른 언어 부족을 상쇄하지 않는 기존 언어별 합계이며 source fallback은 로컬 칼럼으로 세지 않았다.

R에는 B5 21편이 아직 없다. ARC 세 slug 각각의 누락 언어는 km/mn/sr/sl/lt/lv/et이며 전49언어 공통 slug는 현재 18개다. 모든 B5 원고가 승인·통합돼 현행 정책이 유지되면 예상값은 전문 2,121편, 로컬 보드 1,854편, 전언어 공통 21개, 표시 부족 12,164편이다. 이는 조건부 계산이며 실제 통합·배포 결과가 아니다. [현재 R 원자료](../checks/integration-readiness-r-inventory.json)에 전체49언어·슬러그·정책 SHA와 최초 baseline 대비 차이가 있다.

이후 필요한 작업은 root의 통합 렌더·실제 게시 확인이다. ARC 세 편 완비는 각 언어 286편 목표의 이정표다.

## KM R2 후속

2026-10-26T01:30:06.098681+09:00에 KM의 현재 세 SHA를 독립 R2 보고서·manifest 및 기존 readiness 검사 스냅샷과 대조해 모두 일치함을 확인했다. 원고 바이트는 추가로 바뀌지 않아 구조·공유 검사·R 인벤토리를 다시 실행하지 않았다. 앞선 18편 준비/3편 대기 기록은 checks의 `integration-readiness-manifest-18-ready.json`과 `integration-readiness-summary-18-ready.md`에 보존했다. [이번 승인 연결 확인](../checks/integration-readiness-km-closure.json)은 통합·배포 완료를 뜻하지 않는다.
