# SL 704–706 좁은 재검수 R2

검수일: 2026-10-26 KST. 검수자 `/root/column_voice_rules`. [R1](../reviews/sl-independent.md)의 M1·M2a·M2b와 선택 O1 반영, 변경 문장과 주변 조건, 문단 시작어만 재확인했다. R1과 원고·저자 기록·R·공유 도구는 수정하지 않았다.

판정: 요청한 네 변경이 반영됐고 이 범위에 남은 필수·선택 지적은 없다. 704는 바이트 그대로이며, 705는 소제목 하나, 706은 본문 세 문장만 달라졌다. 사람 원어민 승인이나 대만 변호사 법률 승인이 아니다. 검수자가 SL 프로필을 구현했으므로 도구 자체의 독립 인증으로도 표현하지 않는다.

## 변경 문장과 의미 보존

| 항목 | 실제 변경과 판정 |
|---|---|
| M1 / 706 65행 | `pogoj je tudi, da se tuji prosilec po razvezi zaradi tega nasilja ni ponovno poročil.`로 바뀌었다. 외국인 신청자가 가정폭력 때문에 이혼한 뒤 재혼하지 않은 상태를 조건으로 표현한다. 대만인 상대의 거주·호적등록과 다음 문단의 NIA 재량은 그대로다. 해결. |
| M2a / 706 75행 | `Pisarni Hovering International Law Firm lahko … pošljete prvo vprašanje …`로 사무소를 앞세웠다. 이메일, 사건·중요 날짜·비민감 요약, 뒤의 개인정보 제한·네 상담언어·관계 성립 제한이 보존됐다. 해결. |
| M2b / 706 89행 | `NIA v določenem spletnem postopku … po odhodu prosilca med prijavo obravnave ne nadaljuje.`로 기관을 앞세웠다. 특정 온라인 경로의 심사 중단 효과와 다음 문장의 재입국 후 IF 적격 THEN MAY 새 신청은 그대로다. 전면 출국 금지로 확대되지 않았다. 해결. |
| O1 / 705 36행 | `Začetek dela zahteva dovoljenje ali zakonsko izjemo`로 바뀌었다. 허가 OR 법정 예외가 필요한 대상을 실제 근로 시작으로 명확히 했고, 바로 아래의 채용 제안만으로 일을 시작할 수 없다는 설명과 일치한다. 선택 제안 반영 완료. |

M1은 이번 R2에서도 법무부 [현행 이민법 전문 제31조 제4항 제2호](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080132)를 직접 다시 열어 `且未再婚` 및 앞의 계속거류 재량 문구와 대조했다. 전체 출처 목록을 다시 모두 열었다는 뜻은 아니다.

## 정확한 변경 범위와 실제 검사

저자의 `sl-independent-fixes.json`에 적힌 네 치환을 검수자가 역으로 적용해 R1의 705·706 SHA와 정확히 일치함을 확인했다. 프런트매터·FAQ 및 URL 다중집합도 불변이다. 저자 manifest의 정본 아홉 편·최근 SL 세 편·대상 세 편 해시와 갱신된 저자 기록을 실제 파일과 대조했다.

Node 24.14.1 PATH, Python 3.12.0, `PYTHONDONTWRITEBYTECODE=1`로 공유 `variety_metrics.py check --lang sl <file>`을 세 편 모두 직접 실행했다. 실행 전후 해시도 같다.

| 항목 | 704 | 705 | 706 |
|---|---:|---:|---:|
| exit / FAIL | 0 / 0 | 0 / 0 | 0 / 0 |
| 본문 추출 단위 | 60 | 69 | 82 |
| 길이 CV | 0.577 | 0.480 | 0.490 |
| 같은 시작어 문단 최대 | 2 | 2 | 2 |
| R1과 다른 추출 단위 | 0 | 0 | 3 |

705 소제목은 본문 추출 대상 밖이므로 본문 배열 전체가 그대로다. 706은 #41·#56·#73만 달라졌으며, 해당 세 문장과 앞뒤 문장 및 관련 문단을 직접 읽었다. 총 211개 단위 중 나머지 208개는 순서·문자열이 같고, 변경 때문에 새로 분리되거나 합쳐진 경계는 없다. 문단 시작 배열에서도 `Za`·`Pri`가 각각 두 번으로 줄었고 새로 세 번 등장하는 시작어는 없다. §5 수동 시작어 지적이 해소됐으며, R1의 다른 점검 결과는 변경하지 않은 내용에 적용된다.

고정 8/32 및 정서법 단위 정의와 공유 코드는 그대로다. 수치 통과와 위 의미 대조는 별개의 결과다. 새 선택 확장이나 다른 본문에 대한 두 번째 전체 검수는 하지 않았다.

## 현재 동결 SHA-256

| 대상 | SHA-256 |
|---|---|
| 704 | `a87a3ac1137b0012120a56629dccc0e0d64dcbb55a2e2a6110e2be213cde6bd6` |
| 705 | `90d5e07a124a7b1c6aeb46a5be8293a44007a58f6e2dad2593c96b1067834932` |
| 706 | `d5b7581f6dcff33cdcb5b65e1b46bd0654e050acb94434bbdaab68222c0aca5b` |
| 갱신된 `sl-author.md` | `2bd2d8702a749f7a5b9a6b0c0ad8572c3cade153c0bcfdfa8d9420cbcb3b52fa` |
| 보존된 R1 보고서 | `8ae2309049efe1452759d8beab110d6ef0c0184093abae3188683a59c47b7721` |

실제 명령·stdout·전체 추출 배열·변경 전후·검수 입력 해시는 [R2 JSON](sl-independent-r2.json), 종료 해시 재확인과 산출물 묶음은 [R2 manifest](sl-independent-r2-manifest.json)에 있다. 공개 HTTP·렌더·배포 검증은 이 재검수의 범위가 아니다.
