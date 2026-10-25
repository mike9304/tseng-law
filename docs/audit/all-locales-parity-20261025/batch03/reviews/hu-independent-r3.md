# HU R3 — 학생 eARC 출력 의무와 26일 공개 메타데이터

검수자: column_deploy. 검사 시각: 2026-10-26 00:09 KST. 범위는 root가 지정한 HU704 한 문장 수정과 B3 21편의 공개 날짜 변경이다. 원고·R·기존 리뷰·기존 62건 브라우저 증거는 수정하지 않았다.

결론: HU704의 선택 가능 표현이 다운로드·출력 의무로 수정됐다. 적용 대상(학생 온라인 절차, 전자 ARC 유효기간 6개월 이하), 납부 후라는 순서, 두 행위 모두를 보존한다. 21편의 날짜 외 변경은 이 문장 한 곳뿐임을 실제 역대조로 확인했다. 이번 확인으로 기존 브라우저 결과를 새 빌드의 결과로 바꾸어 주장하지 않는다.

## 실제 문장과 의미

수정 전:

> Legfeljebb hat hónapos elektronikus ARC esetén fizetés után letölthető és kinyomtatható az okmány.

수정 후, HU704 72행:

> Legfeljebb hat hónapos elektronikus ARC esetén fizetés után le kell tölteni és ki kell nyomtatni az okmányt.

`letölthető és kinyomtatható`는 다운로드·출력할 수 있다는 가능 표현이다. `le kell tölteni és ki kell nyomtatni`는 두 행위를 해야 한다는 의무 표현이며, [NIA 0929 학생 온라인 절차 4(3)(a)](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news)의 납부 후 다운로드·출력 지시와 일치한다. 해당 공식 본문은 같은 세션의 직전 B3 7언어 재확인에서 직접 열었다.

현재 72행 전체도 읽었다. 앞 문장은 학생 온라인 절차의 승인부터 5근무일 내 납부, 다음 문장은 칩 카드의 납부 후 3근무일 뒤 선택한 NIA센터 수령이며 서로 섞이지 않았다. 전자 ARC의 최장 6개월이 일반 ARC의 기간으로 확대되지 않는다. 뒤 문장도 다른 신청자는 자신의 통지에 따른다고 범위를 제한한다. 이 좁은 수정에 새 필수 지적은 없다.

MONOTONY: 수정 문장은 새 반복 문단이나 공허한 단문을 추가하지 않는다. 같은 문장의 두 행위에 같은 의무 동사를 적용한 것은 필요한 병렬 구조다. 수치를 낮추기 위해 의무·기간·납부 순서를 삭제할 이유가 없다.

## 21편 변경 범위의 재현 검증

입력은 `checks/release26-delta.json`이며 SHA256은 `43135d1f03a6ac8080f7b3268ecebe55b1d577de76259762c82b7ed63ebe8b00`이다. 이 기록을 그대로 신뢰하는 데 그치지 않고 Python으로 각 unified diff를 현재 파일에 역적용했다.

- 21개 현재 파일 SHA가 기록의 `afterSHA256`과 일치한다.
- 각 diff의 새 문맥과 추가 행이 실제 현재 파일과 일치한 뒤 역적용됐다. 복원한 21개 이전 바이트의 SHA가 모두 `beforeSHA256`과 일치한다.
- 21개 B3 원고와 R 대응 원고가 바이트 단위로 동일하다.
- frontmatter에서 `published`, `lastmod`, `date_display` 세 줄만 제외한 나머지는 모두 전후 동일하다. 제목·요약·FAQ·이미지·author·audience·태그·read_time도 이 비교에 포함했다.
- 20편은 본문 전체가 동일하다. HU704는 위 이전 문장 한 번을 새 문장으로 치환하면 본문 전체가 정확히 일치한다. 따라서 출처·링크·이미지·확인일 고지 등의 추가 변경은 없다.

날짜는 미게시 B3 21편의 공개일을 2026-10-26으로 맞춘 변경이다. 원문 안의 출처 확인일 24–25일은 그대로 남아 있다. 바이트 역대조는 다른 6언어 전체에 대한 새로운 원어·법률 감수라는 뜻이 아니다.

## HU 최종 SHA와 공유 검사

아래 세 SHA는 검사 시작과 종료 시 동일했다. 공유 원본 CLI를 직접 실행했고 stdout과 exit code를 확인했다.

| 원고 | SHA256 | exit | 문장 | CV | short | run3 | 결과 |
|---|---|---:|---:|---:|---:|---:|---|
| 704 | 96db7ce41b5038c9fce43fd0c1e50f2598202240183a9a8fe5ca76824e9d4ecc | 0 | 67 | .463 | .194 | .015 | FAIL 0 |
| 705 | 59771fe17d126fb32e3426f5cb8ac5956ecbecbbe25aba99f07c10408d787f4e | 0 | 68 | .453 | .191 | .000 | FAIL 0 |
| 706 | 0e2e2791a2233d96a2e01ac0536d8dc9c901d9219b1ec4e977fec539c15ca6d7 | 0 | 90 | .464 | .233 | .045 | FAIL 0 |

실행 형식:

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-all-language-columns-20261025/batch03/src/content/columns-hu/704-taiwan-arc-first-application.md --lang hu
```

705·706도 각 정확한 파일 경로로 동일하게 실행했다. 세 stdout 모두 `OK — no variety limit violated`, stderr는 비어 있었다. 검사 시 도구 SHA256:

- `variety_metrics.py`: `98056d054aadf197d953bbde78cfb4498dded0e11ca5bc724c61286184feb3ad`
- `variety_expansion.py`: `fa68140644c1cb8753fcfcfff081ab76a36d0b8db1f7175cd00afa62da359832`
- `profiles/hu.json`: `cef85b13e94e3fd08f23d3aa4fba80ab51c116adf3c7d30cb8e4e59d00b1279b`

기계검사와 좁은 의미 확인은 각각의 증거다. 인간 원어민·변호사의 승인으로 부르지 않는다. 날짜가 바뀌고 HU704 본문이 수정된 새 정적 산출물의 브라우저·패키지 검증은 root의 후속 빌드 이후 별도 증거가 필요하다.
