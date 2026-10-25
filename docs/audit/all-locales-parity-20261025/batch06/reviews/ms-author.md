# B6 MS 저자 기록 — 2026-10-26

말레이어 915·916·918·919·920·921을 직접 집필하고 작성자 의미·문체 점검을 마쳤다. 최종 shared `--lang ms`는 6편 모두 exit 0, FAIL 0, WARN 0이다. 구조 오류 0, 현행 runtime 목록 노출 6/6이다. 이는 인간 원어민·변호사의 승인이나 공개 배포 확인이 아니다. 다른 에이전트의 독립 의미 검수와 root의 통합·렌더링 검증은 별도다.

## 입력과 열람 범위

BRIEF, 최종 집필 계약, 여섯 현재 정본의 메타데이터·본문·FAQ·출처, facts·source-register·source-freeze를 전문으로 읽었다. 과거 approved 스냅샷 대신 `current_snapshot`을 사용했다. 계약 SHA는 `b0c6b86677719c8966bcf85af979574fca7c97f6a778d80627eaabc74c246c4e`, facts는 `7f1d32e0aa17706c006f0b4fca8a88653dc7cad4637b1369e00ab6607884462a`다. 최종 919 조율 및 FAQ 정밀화도 반영했다.

R/AGENTS, EDITORIAL-VOICE, COLUMN-VOICE-RULE, SENTENCE-VARIETY-RULE, LESSONS와 연속 작업에서 읽은 FRONTMATTER를 적용했다. 홈 `agent-library/knowledge/editorial-voice.md`는 없었으므로 읽었다고 주장하지 않는다. 허용된 저장소 정본을 사용했다. 최근 MS3편은 발행일 기준 704·705·706이며 모두 전문을 읽었다. 법적 조건으로 시작하는 704·705, 체류기한 질문으로 시작하는 706과 이번 여섯 글의 도입·제목·마무리를 비교했다. 여섯 원본 이미지도 직접 열어 alt를 작성했다.

집필 전 입력 27개의 전체 경로·SHA·실제 읽기 범위는 [ms-inputs.json](../checks/ms-inputs.json)에 있다. 종료 직전 [재대조](../checks/ms-inputs-recheck.json)도 27/27 일치했다. 개인적으로 MOJ 직안법22-2·조달법85-1·회사법154 전문을 공개 웹에서 확인했다. 해당 화면의 데이터 기준은 10월16일이었다.

사건 근거와 현행 자료의 확인을 구분했다. 연구 묶음에서 919·920·915·916은 26일 재접속 실패 후 25일 실제 공식 회신을 보존한 것이며, 새로 법원 전문을 모두 읽었다고 쓰지 않았다. 921·918의 416쪽 PDF 전체를 이번에 새로 검토했다는 주장도 하지 않는다. 919 후속 상소·복직, 920 확정, 916 관련 소송 전체 종결, USTR 협정 전체의 현재 발효를 확인한 것으로 확대하지 않았다. 공개 글의 사건 확인일은25일, 현행 자료 대조일은26일로 구별했다.

## 검사와 규칙 §5

재현 명령은 다음과 같다. `ms-measure.py initial`은 초안을 덮어쓰지 않도록 재실행을 거부한다.

```sh
PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH PYTHONDONTWRITEBYTECODE=1 python3 /Users/son7/tseng-all-language-columns-20261025/batch06/checks/ms-measure.py final
/Users/son7/.nvm/versions/node/v24.14.1/bin/node /Users/son7/tseng-all-language-columns-20261025/batch06/checks/ms-verify.mjs
```

첫 도구 검사에서 918만 PASS였고 나머지5편은 길이 변동계수 FAIL이었다. 실패·원문 SHA·stdout은 [초기 결과](../checks/ms-variety-initial.json), 원문은 [초안 사본](../checks/ms-initial-drafts.json)에 보존했다. 1차 수정 후 모두 PASS였으며, 수동 점검에서 도입 반복과 오해 소지를 추가로 고쳤다. 중간 결과는 [첫 수정 결과](../checks/ms-variety-after-first-edit.json), 최종 전체 문장 배열은 [최종 결과](../checks/ms-variety-final.json)이다.

| ID | 초기 CV / exit | 최종 CV | 문장 / 아주 짧은 문장 | 짧은 문장 비율 | 같은 길이 3연속 | 본문 질문 |
|---|---|---:|---:|---:|---:|---:|
| 915 | .421 / 1 | .501 | 43 / 13 | .302 | .049 | 1 |
| 916 | .364 / 1 | .515 | 47 / 12 | .255 | .067 | 2 |
| 918 | .472 / 0 | .483 | 45 / 11 | .244 | .000 | 1 |
| 919 | .413 / 1 | .467 | 43 / 10 | .233 | .000 | 1 |
| 920 | .382 / 1 | .509 | 42 / 11 | .262 | .025 | 2 |
| 921 | .434 / 1 | .472 | 43 / 9 | .209 | .073 | 1 |

1. 정확한 MS profile로 검사했다. 측정 단위는 orthographic words, 짧은 문장 ≤8단어다. 경계 조정용 공백·문장기호·타 언어 profile을 쓰지 않았다.
2. 도입은 사실·결과3편(915·918·919), 질문2편(916·920), 금액1편(921)이다. 가상 인물·가상 인용은 없으며 같은 유형은 절반을 넘지 않는다.
3. 최종 추출 문장263개를 직접 읽었다. 마지막 수동 수정 후 바뀐 문단도 다시 읽었다. `No.` 뒤 판결번호, `NT$243,548`, `NT$44,417,150`, `85-1`, `40(1)(2)`, `6(1)(5)`, 날짜·하이픈 합성어가 오분절되지 않았다. 긴 문장은 문단당 최대1개이며 뒤에 짧은 문장이 온다. 915·918은 다음 문단 첫 문장이 그 역할을 한다.
4. 같은 단어의 문단 시작은 최대2회, 연속 문장 같은 시작은 전편0이다. 문단 시작을 세로로 확인했다.
5. 법적 주장의 출처를 인라인에 유지하면서, 기록 비교·질문·실무 설명에는 인용 없는 문단도 뒀다. 문장 끝 괄호 인용 비율은0이다. 주장→괄호조문→예외를 세 문단 연속 쓰지 않았다.
6. 자동 대비 패턴은915에서1회, 나머지0이다. 직접 읽을 때도 기계적인 반박 틀을 반복하지 않았다. 지급액/청구액, 계약상 기간/현행 기간, 당사자 주장/인정 사실을 구별하는 부정문은 법적 범위를 보존하기 위해 남겼다.
7. 출처·범위 고지 앞 본문은 각각 신청·변경·응답의 순서, 원래 조사결과와 자산이전 승인, 통지 종류, 실제 청취 기록, 설치계약 비용, 충전·전환·사용 기록으로 끝난다. 판촉형 마무리를 쓰지 않았다.
8. 말레이어 서술체와 주제별 명사형 제목을 사용했다. 장식 bold, 공개 author/AI byline, 가공 수임 경험, 새 상담언어 약속은 없다. 이메일은 문의 안내뿐이며 전송하지 않았다.
9. FAQ17개, 표2개, 제목·요약·alt·캡션·출처 목록은 문장 검사 제외 영역이므로 따로 읽었다. 아래 의미 대조와 URL 검사를 함께 수행했다.

최종 측정은 root의 DE 날짜 전용 수정이 이미 설치된 `variety_multilingual.py` SHA `4af341932757be7a6b83f84a56ea24792f963653c9c3d008aacade2b79a084de`에서 실행됐다. 측정 후 checker 4파일 SHA도 모두 동일했다. [ms-shared-guard.json](../checks/ms-shared-guard.json)은 실제 SHA와 root 설치 증거를 기록한다. MS 단위·임계값·분기는 바꾸지 않았다.

## 실제 수정과 의미 보존

[ms-edits.json](../checks/ms-edits.json)에 실제25개 변경 블록의 전후 전문, 문제·이유, 수정 방향, 의미 보존 판단을 담았다. 최종본에서 변경을 역복원하면 저장한 초안6개의 SHA가 모두 일치한다. 주요 수정은 다음과 같다.

| 문제 문장·구절 | 이유와 실제 수정 | 의미 보존 |
|---|---|---|
| 919 제목 `Hukuman diumumkan sebelum siasatan dinilai` | 조사 평가 완료 전으로 읽힐 수 있어 `Pemecatan kerana buli di Taiwan: hukuman mendahului pertimbangan jawatankuasa`로 바꿨다. | 위원회 심의보다 먼저 처분을 발표한 절차 문제와 면직취소를 유지했다. |
| 921 `selepas menukar baki syiling akaunnya kepada nilai wang` | 실제 환전을 끝낸 것처럼 읽혀 `NT$243,548 dituntut seorang pemain sebagai nilai wang bagi baki syiling dalam akaunnya.`로 고쳤다. | 금화 환산액은 지급액이 아닌 기각된 청구액이다. |
| 921 `memulangkan mata berbayar` | 포인트 현물 반환처럼 읽힐 수 있어 본문·FAQ의 동작을 `membuat bayaran balik` / `Bayaran balik ... mesti dibuat`로 명확히 했다. | 미사용 유료포인트 OR 게임비용, 필요비용 공제, 종료부터30일 OR 쌍방 합의 처리를 보존했다. |
| 921 `Perkara 9 terma wajib dan perkara 6 terma terlarang ... melarang` | 서로 다른 규정 역할을 함께 금지로 읽을 여지가 있어9점은 보존·제공 의무, 금지6점은 독점 판단자료 제한으로 각각 연결했다. | 최소30일 보존과 접수 후7일 제공을 그대로 유지했다. |
| 916 `Laporan alam sekitar sebelum pengambilalihan ...` | 결과형 도입 편중을 줄이기 위해 `Apakah tindakan kumpulan syarikat selepas menerima laporan pencemaran sebelum pengambilalihan kilang?`로 시작했다. | 다음 문장에서 실제 사건의 보고서·통제·인지·자산이전을 모두 설명한다. |

MONOTONY: 중간 길이 설명의 반복 — 초기915·916·919·920·921의 조건·기록 단락 — 짧은 판정과 그 이유를 연결하고, 누적조건·증거 순서는 한 문장 안에서 읽히도록 재작성했다. 915의 중재요건, 916의154조 누적요건, 919의 청취 누락과 복심, 920의 주장과 가정적 판단은 문장 다양성을 위해 생략하지 않았다. 공통 출처 고지의 두 확인일도 각 행위에 맞춰 분리했다.

## 의미·숫자·노출 대조

[구조 결과](../checks/ms-structure.json)는 오류0이다. R을 읽기 전용 symlink 문맥으로 삼아 실제 `filterMarketBoardColumns`·audience·slug 규칙으로6/6 노출을 확인했다. 정본은 현재 스냅샷의 동일 SHA를 원래 파일명으로 참조했다. 미선택 legacy 글은 수정하지 않았다. 26일 발행/수정일, `26 Oktober 2026`, 내부 author, 정확한 topic, `audience: ["ms"]`, 기존 이미지 경로와 `Adegan rekaan`을 확인했다. 공식 URL은 글별4/3/4/4/4/4개이며 정본의 URL과 본문 인용이 최종 출처 목록에 모두 있다. 916의 `/ms/columns/taiwan-company-subsidiary-vs-branch`도 실제 기존004에 연결된다.

| ID | 본문·제목·요약·FAQ에서 확인한 의미와 숫자 |
|---|---|
| 915 | NT$44,417,150은 취소된 award. 2017-07-12·106年度台上字第723號와 이 취소 사건의 확정 유지. 금전→공기연장→권고·기관 부동의→금전 복귀 순서, 공사 OR 기술서비스, 권고 OR 안, 기관 부동의 때문에 불성립 조건과 별도 합의 가능성 유지. 40(1)(2)는 합의 부존재라는 사건 근거만 설명. FAQ2개. ITA의2026년 말·2027년은 `penghujung tahun itu ... tahun berikutnya`이며 미국 공급자 대상 전망이다. 원문의2017·85-1 반복 횟수 감소는 해당 값의 삭제가 아니다. |
| 916 | 2018-08-16·107年度台上字第267號,246명 부분 파기환송/262명 관련 상고기각 유지. 소유만으로 책임 없음. 154(2)의 남용→특정채무·명백한 변제곤란·중대성/필요성 누적조건 유지. `perenggan kedua`는 원문의 paragraph2다. USTR의2월 자료는 미국의 지원 가능성·적용법 조건으로 한정했다. 2018 반복 횟수와 현재자료 확인일2026 추가는 별도 근거 문맥으로 확인했다. |
| 918 | 2022-02-09·109年度上易字第289號, 개발사 항소·추가청구 기각 및 상소불가 유지. 2019-02-23 서신, Julai/Ogos,11월5일 지급과28일 보증서상 인도 구별. `empat`/`enam`은 계약4개월/현행6개월이며 모두 사용허가 취득 기산의 통지기간. 14점 지급·협조와15점 통지,2025-08-25 점검,2026-09-18 중앙은행 시행본을 각각 구분. 표준조항 번호·월 이름·173–187 및182–186 쪽수 표기 차이를 대조했다. 새 금액·LTV는 추가하지 않았다. |
| 919 | 114年度訴字第869號·2026-09-03, `dua` 대과, 원처분과 복심결정 취소·상소 가능 유지. 심의·청취·보고서 문제를 모두 설명하며 무괴롭힘·자동복직 결론을 내리지 않는다. 현행제도2026-07-01과 과거 공무원 사건 구별. 中文22條之2는22-2로 표시했다. 보호·조사는 must, 신고인 의사에 따른 조율은 may, 불성립 뒤 조사 속행은 must다. 숫자월은 September/Julai/Jun/Oktober로 현지화했다. |
| 920 | 111年度上字第132號·2022-06-22, 항소기각과 철거·복구 유지, 확정 미확인. 법률11조 소유자회의와 단지규약15조 위원회 허가 AND 전력회사 안전검사 구분.6(1)(5)·6(3)·6(1)(4)는 한자 조문번호를 아라비아 숫자로 표시했다. 정지·잠금·열쇠 주장은 가정적 판단으로 유지. 가오슝2026년5월 공공구역 케이블트레이 보조 및9월30일 기한 경과, 설치 동의와 별개임을 확인했다. |
| 921 | 원문24萬3,548=NT$243,548을 실제 환산해 확인했다.109年度消簡上字第1號·2021-09-13 상소불가, 사용 전 유료포인트가 없다는 다툼 없는 사실 유지. 2023-01-01 시행규정과 과거 판결 구별. `tujuh`일 해제/언제든 종료,30일 환급/쌍방 합의,최소30일 이력보존/접수 후7일 제공을 각각 대조했다.4·9·18·금지6,2025년도 첫 신고유형2위·전년감소 및2026-05-07 발표 유지. 한자 권수二十二→22,140–153·148–152 범위 표기를 확인했다. |

자동 감사의 숫자 차이를 삭제하거나0으로 채우지 않았다. [원시 감사](../checks/ms-content-audit.json)의 `numbers-dates-currencies`와 다른 의미 항목은 전부 `REQUIRED`, 총30개이며 `publicationReady: false`다. 숫자 토큰의 출현 횟수, 한자 수사·월 이름·범위·표기 차이는 위 문맥에서 수동 대조했다. 렌더링된 카드·JSON-LD·피드와 실배포는 여기서 확인하지 않았다.

## 동결 SHA

| ID | 사용한 현재 정본 SHA-256 | 최종 MS SHA-256 |
|---|---|---|
| 915 | dbc06e56df75f67e92e9fceef19ad1b7c3db4b9ff9396256d3d2d2e043d1966d | 19c743f3d68a65ac4fb3a5ac25d9861df017ab48afde6bfa87d220bcb89badda |
| 916 | 167addba353f1b6c7cfa3f530bc6aeb34b3c1871b33043de35203e9920817cb1 | e8de772156076b020564e30955075e84a2ba0b6388ffbd99366c304829c38d86 |
| 918 | 43949fd463c3c6a7612dd98d6ffb1007925bc5032a0f3967fe181c1e16fdaa4b | bb55a0db717c9eafbcdc5c8b64a475dfec3f8d208c629e711e8ce8e9a4069ef0 |
| 919 | 9696db15f3510d1f1d5b3f0dda3f0471d2e70a25b1bce625ca2fb3a49cceb390 | b7d5cf0db2af832600b286b0b3634e6f58fb1da81098f407ae007be6143ac549 |
| 920 | 59fb9c0ff8d1c5760300cd7e525ef3fd2c8c1bbd4327c589786ba9e4bca2f582 | aed340902065a8149571f3ca67b74bdfea7d2c64d730ff5295f1316e3c5554b4 |
| 921 | d7783b6cebeb410766a692fa2eebf3bd3b12bff48bd2615f6468cfd09f8b9484 | 39113b45c74664dd0104e20a05837675b4aa1c5e9735e00de4df91a25bd84c2d |

최종 산출물·검사 파일의 SHA 묶음은 [ms-final-manifest.json](../checks/ms-final-manifest.json)에 기록한다. 소유한 MS6편·ms-author·checks/ms-* 외에는 수정하지 않았으며 R·shared·운영 코드·Git·배포를 변경하지 않았다.
<!-- R2 appendix follows the preserved R1 author record. -->

## R2 — 독립 검수 후 최소 교정, 2026-10-26

R1 독립 보고서 SHA `2e7d3f7142149742c66e718e810bd83d20bdae7d47ef0c9a0eda1e3044b342b1`을 전문으로 읽고 필수 M1·M2를 반영했다. 선택 O1–O3도 사건의 직접 쟁점·발표 시점을 정확히 하고 동어반복을 줄이는 개선이어서 채택했다. 원고4개에 정확히6개 치환만 있으며 916·918은 이전 SHA 그대로다. 아래는 저자의 교정 결과이고 독립 R2 승인 또는 공개 배포 주장이 아니다.

| 지적 | 실제 변경과 이유 | 의미 보존 |
|---|---|---|
| M1·920 본문 | `Penghuni bersandar pada perkara 6(1)(4)... Hujah itu ditolak...` 두 문장을 `Perkara 6(1)(4) turut menyentuh... Mahkamah tidak menerima pengelasan itu bagi pemasangan dalam kes ini.`로 교체했다. 보관 공식 L43의 거주자 일반 항변과 L44의 상대방 특정 조문 분류를 재독했다. | 조문 내용·이 사건 분류 배제를 유지하며 특정 조문 주장을 거주자에게 잘못 귀속하지 않는다. 이어지는6(1)(5)/6(3)/11조, 규약15조의 허가 AND 안전검사, 잠금 주장·철거 결과와 FAQ는 그대로다. |
| M2·921 본문·FAQ2 | 두 작동 규칙의 `fi permainan`에 각각 `yang belum digunakan`을 붙였다. 공유 원문과 이번 연속 검수에서 직접 읽은 MODA 제18점의 환급 객체 범위를 따른다. | 유료 포인트 OR 게임비용 모두 미사용 범위를 명시한다. 필요비용 공제, 계약 종료부터30일 must OR 쌍방 합의, 언제든 종료 may, 시작 후7일 권리는 유지한다. 사건을 설명하는 FAQ1을 일괄 치환하지 않았다. |
| O1·915 제목 | `Tuntutan wang bertukar kepada lanjutan masa` → `Tuntutan wang selepas syor lanjutan masa`. | 연장 권고 뒤 금전청구 복귀라는 취소의 직접 쟁점을 제목에 드러낸다. 본문·FAQ의 전체 순서와 금액은 불변이다. |
| O2·919 제목 | `hukuman mendahului` → `pengumuman hukuman mendahului`. | 심의보다 먼저 일어난 것이 처분 발표였음을 명시한다. 원처분/복심 취소, 상소 가능, 민간 현행법 구분은 불변이다. |
| O3·919 본문 | `Jawapan memerlukan perkara yang jelas untuk dijawab.` → `Kandungan notis menentukan perkara yang perlu dijawab.` | 답변/답변할 내용의 동어반복을 통지의 실제 기능으로 바꿨다. 뒤의 통지·인터뷰·판단 비교를 유지하며 새로운 서식·공개 의무를 만들지 않는다. |

완전한 변경 전후 문장, 이유, 실제 unified diff와 역복원은 `checks/ms-r2-edits.json`에 있다. 네 원고 모두 역치환한 바이트의 SHA가 독립 검수 대상 R1과 일치한다. R1 author manifest는 `checks/ms-r1-author-manifest.json`에 원래 바이트 그대로 보관했다. 원고 밖의 R1 독립 기록·정본·계약·공유 도구 등20개 guard는 모두 일치한다.

변경 파일4개만 정확한 shared CLI를 `--lang ms`로 다시 실행했다:915 CV.501,919 .467,920 .502,921 .480; 모두 exit0/FAIL0. 검사는 `checks/ms-r2-variety.json`에 명령·출력·원고SHA·실제 추출 배열로 남겼다. 171개 단위 중167개는 R1 배열과 동일하고 새로운4개를 직접 읽었다. 6(1)(4)가 한 문장에 유지되고 게임비용 한정 문장은 분리되지 않는다. 제목2개와 FAQ2의 실제 수정 문장은 본문 점수 밖이므로 별도 읽었다.

§5 재점검: 도입·실질 결말·인용 배치는 불변이다. 제목은 명령형으로 바뀌지 않았고, 같은 문단 첫말 최대2회·동일 시작 연속0·문단당 긴 문장 최대1개다. 920의 짧은 문장 비율은 .238,921은 .209로 실제 내용 수정 후에도 기준을 충족한다. O3는 점수를 맞추는 분절이 아니라 구체적 주어를 되찾은 변경이다. FAQ의 환급 객체·must/may·기산·AND/OR를 다시 읽었고 다른 숫자·조건을 지우지 않았다.

Root 승인 현행 감사기 SHA `3926a274bf544fed7e34339aa8b2636d41a4be79c0aaff898f46fc65595faf4b`로 변경4편을 다시 검사한 결과 자동 오류0·실제 목록 필터4/4 노출이다. 새 감사의 의미검토 REQUIRED20개를0으로 바꾸지 않았다. 기존 미변경2편의 REQUIRED10개·PASS는 정확한 동일 SHA의 R1 증거를 유지한다. 새 `ms-r2-structure.json`에는 오류·필수 검토 상태·숫자 차이 배열을 보존하되 전체 원문을 반복 복제하지 않았다.

URL과 숫자열의 전후 순서가 정확히 같고, 이미지·alt·`Adegan rekaan`·26일 발행/수정 메타·25/26일 출처 설명도 불변이다. 변경4편 FAQ는2/3/3/3개이며, 전체17개에서 답변1개만 위 범위로 수정했다. DE 날짜 수정이 반영된 shared `variety_multilingual.py` SHA `4af341932757be7a6b83f84a56ea24792f963653c9c3d008aacade2b79a084de`와 나머지 공유 파일은 변하지 않았다. 현재 원고 SHA는 갱신한 `checks/ms-final-manifest.json`을 따른다. 독립 R1 보고서와 도구·R·다른 언어는 수정하지 않았다.
