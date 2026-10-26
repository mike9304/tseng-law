# ET B7 독립 R1 반영 기록

Root가 승인한 M01·M02와 선택 S01·S02만 반영했다. 세 원고의 정확한 치환은 네 곳이다. S03의 915·921 날짜 문장은 그대로 유지했다. 독립 재확인은 별도로 요청하며 이 기록을 독립 검수나 인간 원어민·법률 감수 승인으로 표시하지 않는다.

기존 `et-author.md`, `et-final-manifest.json`, 독립 R1 보고서·manifest·전체 원고 snapshot을 포함한 20개 기존 기록은 바이트 그대로 보존했다. 현재 상태는 이 R2 기록과 `checks/et-r2-final-manifest.json`으로 연결한다. 이전 manifest를 현재 원고의 SHA인 것처럼 덮어쓰지 않았다.

| 항목 | 실제 수정과 의미 보존 |
|---|---|
| M01, 915 summary | `Seaduslik tee vahekohtusse eeldab...`를 `Dokumentide võrdlemine aitab hinnata, kas lepitus käsitles sama konkreetset vaidlust, mis viiakse vahekohtusse.`로 고쳤다. 서류 비교는 법정 전제에서 실제 분쟁 동일성을 평가하는 방법으로 좁아졌다. 앞 요약 문장과 본문·FAQ는 불변이다. |
| M02, 920 본문 | `Arvesti kuulumine elanikule...`를 `Ühendus elaniku arvestiga ei muutnud seina, lae ja ühise elektrikilbi õiguslikku staatust.`로 고쳤다. 보관 공식 판결 회신 L32–L53을 직접 다시 읽고 계량기로의 연결과 공용 벽·천장·전기함 지위만 서술했다. 계량기 소유권의 반대 결론도 새로 만들지 않았다. |
| S01, 918 본문 | `kiri küsis ostja suhtlust...`를 `Arendaja palus 23. veebruari 2019 kirjas ostjal võtta ühendust laenupangaga ja teatada laenutoimingute edenemisest.`로 고쳤다. 발신자·수신자·날짜·은행 연락과 진행상황 보고 요청은 유지했다. 인도 통지나 즉시 전액 지급 명령을 추가하지 않았다. |
| S02, 920 말미 | `Selle juhtumi keskne dokument...`를 `Vaidluse hindamisel saab paigaldusjoonise kõrvutada olemasolevate otsustega, et selgitada, kas ja millises ulatuses ühiste osade kasutamine lubati.`로 고쳤다. MONOTONY: 추상적인 중심 문서 선언을 도면과 실제 결정을 비교하는 동작으로 바꾸며 허가의 존재·범위를 미리 단정하지 않는다. |

[교정 증거](../checks/et-r2-edits.json)에 정확한 old/new, 전후 전문, 각 단계 SHA와 diff가 있다. 최종본에서 네 치환을 역순으로 복원하면 독립 검수자가 보관한 R1 세 원고와 정확히 일치한다. 916·919·921 세 파일은 R1 그대로다. FAQ17과 모든 외부 URL 순서는 불변이다. 915는 summary만 달라지고 본문 바이트가 같으며, 918·920은 frontmatter 전체가 같다.

## 표적 검사

Node `v24.14.1`을 명시해 본문 변경 파일인 918·920만 실제 공유 `--lang et`로 재실행했다. 둘 다 exit 0 / FAIL 0이다. 요약만 바뀐 915의 본문 지표와 미변경 세 편의 지표는 이전 SHA 증거를 재사용했다. 도구·프로필·임계값 변경은 없다.

| ID | 현재 SHA-256 | CV / 추출 단위 | 증거 사용 |
|---|---|---|---|
| 915 | `71965945cfaaa67695b54df22fff330e988a96a64f8b1416e7be00df3f13ebb2` | .462 / 40 | R1 본문 바이트 불변, CLI 재실행 없음 |
| 916 | `d82fd20cc58e146613730221dacd28948a3f2b1aa92177ce8a916accf8a0b12f` | .465 / 46 | R1 파일 불변 |
| 918 | `7e59a55f865bc4b3617c5d12371546be42aade935b4ab9fa6a775177ea6bcc49` | .493 / 46 | 실제 R2 공유 실행 |
| 919 | `da1ba752fc6193222b844e5be491cb382ab55f49b3a714b49b27b5849825c3aa` | .492 / 39 | R1 파일 불변 |
| 920 | `cc59c5a7212683e20fcdf9fbccdf686ceb870db8de7447303dc4c04c74a8028a` | .472 / 40 | 실제 R2 공유 실행 |
| 921 | `e058c5964d75cfad256f5fd99b6c474b9acbd80408a5e06229652116e3d38094` | .459 / 48 | R1 파일 불변 |

총 259개 추출 단위 중 256개는 텍스트·길이 단위·순서가 같다. 918 #8, 920 #9·#37 세 문장만 바뀌었고 문장 수는 같다. 세 문장과 앞뒤 문장·해당 문단을 직접 읽었다. 날짜 서수점·종결·주체·대명사 연결에 새 경계 문제는 발견하지 않았다. 918의 뒤 문장 `Selles ei öeldud...`는 바뀐 앞 문장의 편지를 계속 받는다. 920 소제목 뒤의 연결 사실과 다음 법11조 조건, 말미의 연락 안내와 확인범위 문장도 그대로 연결된다.

[실제 공유 실행](../checks/et-variety-independent-r2.json), [검증·경계 차이](../checks/et-r2-validation.json), [변경 세 편 구조 검사](../checks/et-r2-structure.json)를 남겼다. 현재 `content-audit.mjs` SHA `3926a274…95faf4b`로 915·918·920만 검사해 오류 0, `REQUIRED` 16개를 유지했다. 미변경 세 편의 이전 16개를 합친 배치 전체 32개 의미 검토 표시는 지우지 않는다. 실제 공개 렌더링·배포 검사는 아니다.

LESSONS 2026-10-26 03:05판 전문을 읽고 적용했다. 현재 SHA는 `9d3af531126f65057fa1ceea9785b6464e512c80ce25d922e822e01438e70486`이다. 원고·증거 범위 밖의 R, shared, 타 언어와 타인 기록은 수정하지 않았다. 커밋·배포도 하지 않았다.
