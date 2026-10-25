# IS ARC 704–706 — independent review R2

검수일: 2026-10-25 KST. 검수자: Codex `/root/column_deploy`. 작성자: `/root/column_live_audit`. 판정: R1 M01·M02 해소, 이번 AI 독립 검수의 미해결 필수/선택 항목0. 사람 원어민·대만 변호사 감수, 빌드·게시 승인으로 부르지 않는다.

이 파일만 새로 작성했다. 원고·R·공유 도구·저자 기록을 수정하지 않았고 R1 `is-independent.md` SHA `fdf7b2186768176a41dd9e504ff2ab84c68f5f8a5cd1bea2c6204b28c3ebb1c7`을 보존했다.

## 고정 원고

아래 파일의 제목·summary·FAQ·본문·출처를 이번 R2에서 세 편 모두 전문 재독했다. 시작·종료 SHA가 동일함을 확인했다. 704/706은 R1과 바이트 동일하며 705만 아래 두 곳이 바뀌었다.

| 파일 | 시작·종료 SHA256 |
|---|---|
| 704-taiwan-arc-first-application.md | b9c21267925b98ec161d911e22232f9c1e43ac6d80b107856828738f559ef0d3 |
| 705-taiwan-visa-residence-work-study-family.md | 57037ffbde3224aaeb8b34dd963a166b232ce43631fa63e60069b01077255da5 |
| 706-taiwan-arc-renewal-changes-reentry.md | ac5b83d0c073e2750fc74ce3bfb51b075e08fd32ade0d0499cbd3bcdc21ed3f7 |
| is-author.md | 1343938ffb976f2d1d581d72354e5741a908c4bf569b6835dfc77d156d761b8f |

정본 EN/KO/ZH9, 사실표 F01–F24, 공식 법령·NIA·BOCA 확인, 문체 정본 및 최근 IS849–851 비교의 입력/해시는 R1에 기록한 것을 사용했다. 앞서 실제 열람한 공식 문서와 같은 세션 내 재검수이며 모든 URL을 이번에 새로 재요청했다고 주장하지 않는다. R1의 최신 LESSONS 23:04판과 공유 §5 기준을 적용했다.

## M01 — 실제 문장 경계 수정 확인, 해소

공유 설치 기록 `tooling/variety-fix-is/root-installation.json`을 읽었고 설치 파일 해시를 직접 계산했다. Root가 Node24 PATH로 44개 단위시험을 PASS한 기록과 초기 Homebrew Node 로딩 오류 기록은 구별했다. 내가 그44개 전체를 다시 실행한 것은 아니다.

| 설치된 구성요소 | SHA256 |
|---|---|
| variety_metrics.py | 69ceb7202a6e716ba1666ec08f4757daea8bc43289448dcffa8446c830ecd6fb |
| variety_multilingual.py | 042037e93c6a78459d1e7ea85b9b6bdb0b8aa1038ca9dc0f54c8239e76d4d6d1 |
| variety_expansion.py | 8fdef830a5e9fea25e956a09426e22cd600450c7996083e385e11517502ad17c |
| profiles/is.json | d0594d70cbdca74a6d5a701665bb1c680f73d36fe8d90e2910f4923db4e00796 |

실제 공유 `sentences` 출력에서 다음 네 경계가 정상임을 직접 확인했다. 원고의 조문 서수·약어 마침표는 그대로다.

- 704: `Atvinnuheimild þarf enn að ná til raunverulegs starfs og vinnuveitanda samkvæmt 43. og 48. gr. laga um vinnumiðlun.` 한 문장.
- 705: `4. og 5. gr. sérfræðingalaganna skilgreina fagstörfin og leyfisferlið.` 한 문장.
- 706: `7. og 9. gr. dvalarreglugerðarinnar ákveða fresti vegna breyttrar dvalarástæðu og framlengingar.` 한 문장.
- 706: `Tilkynning til banka, skóla eða vinnuveitanda uppfyllir ekki skráningarskylduna samkvæmt 31. gr.` 다음에 `Geymdu dagsetta staðfestingu umsóknarinnar.`가 별도 문장.

이 판단은 R1에서 직접 확인한 [공식 Ritreglur](https://ritreglur.arnastofnun.is/)의 서수·약어·문장 종결 규칙과 맞는다. 특히 문장 끝 `gr.`와 문장 안 조문열을 같은 방식으로 병합하지 않는다.

현재705의 두 수정 문자열을 메모리에서만 원래 문장으로 역변환하면 R1 SHA `1bc84c7a5ba64f10a4159d1a5433107c4ec75c290925ca945a711647cfa99cc8`이 정확히 복원됐다. 그 문자열을 설치된 공유 `metrics(...,'is')`로 계산한 CV는 .438, 최종 원고는 .462였다. 따라서 옛 거짓 PASS를 유지한 채 판정만 바꾸지 않았음을 확인했다. 이 R2에서 원래 원고를 디스크에 복원하거나 원래 파일을 CLI로 다시 실행하지는 않았다.

## M02 — 705 리듬과 의미 보존, 해소

| 위치 | 실제 수정 전 → 수정 후 | 문제·수정 방향·의미 보존 판단 |
|---|---|---|
| 도입 | `Hæfur sérfræðingur getur við ákveðin skilyrði komið án áritunar og sótt um dvöl innanlands. Fyrir námsmann getur sama komuleið útilokað almenna umsókn um dvöl vegna náms á Taívan.` → `Við ákveðin skilyrði getur hæfur sérfræðingur sótt um dvöl innanlands eftir komu án áritunar, en sama komuleið getur útilokað almenna dvalarumsókn námsmanns vegna náms á Taívan.` | MONOTONY: 동일14단어 설명의 연속을 두 집단의 다른 결과를 직접 연결하는 문장으로 정리했다. 적격 전문가·조건부 신청 가능·무비자 입국 이후·일반 학생 국내 거류경로 제한의 가능성을 보존했다. 입학 신청으로 바꾸지 않았다. 다음16조/대학/중국어 과정의 공식 링크 세 개도 그대로다. |
| 전문인재 절차 | `NIA þarf að samþykkja dvölina áður en ARC er gefið út.` → `NIA þarf að samþykkja dvölina. Þá er ARC gefið út.` | 긴 적격조건 문장 뒤에서 NIA 거류 승인 의무와 그 후 ARC 발급 순서를 나눴다. 승인의 대상은 거류이며, 취업허가나 신청서 접수로 바뀌지 않았다. `þarf`의 의무와 `Þá`의 순서를 읽어 확인했다. 의미 없는 단문을 덧붙이거나 자격요건을 삭제한 수정이 아니다. |

역변환 비교에서 frontmatter 전체 바이트(제목·summary·FAQ 포함), 링크 값/순서, 숫자열이 모두 동일했다. 변화가 위 두 문자열 외에 없다는 것은 복원 SHA로 확인했다. 수치 일치만을 법률 의미 보존으로 취급하지 않고 위 문장을 직접 읽었다.

## 실제 공유 CLI

다음 명령을 직접 실행했으며 exit0, 세 편 FAIL0이다.

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check \
 /Users/son7/tseng-all-language-columns-20261025/batch03/src/content/columns-is/704-taiwan-arc-first-application.md \
 /Users/son7/tseng-all-language-columns-20261025/batch03/src/content/columns-is/705-taiwan-visa-residence-work-study-family.md \
 /Users/son7/tseng-all-language-columns-20261025/batch03/src/content/columns-is/706-taiwan-arc-renewal-changes-reentry.md --lang is
```

| 파일 | 문장 | 평균 단어 | CV | short | run3 | opener_rep | cite_para | 결과 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| 704 | 65 | 14.0 | .463 | .215 | .016 | .053 | .316 | FAIL0 |
| 705 | 76 | 13.6 | .462 | .250 | .041 | .043 | .435 | FAIL0 |
| 706 | 79 | 15.1 | .451 | .177 | .078 | .043 | .565 | FAIL0 |

세 편 모두 cite_end/contrast/caveat0, 본문 질문1이다. 이 CLI PASS와 문장·법률 의미 검토는 별도 근거이다.

## 전체 재독에서 보존 확인

704의 입국 다음 날30일/국내 발급일부터30일, 통합증명 예외,2년 사진·1개월 서류, 배우자 대만 거주+호적 및 최초 최장1년, 의무 인증/요구 가능 번역, F24 통지 다음 날15달력일·해당 해외 발급자료3개월·완전 보완 의무, 승인연도 수수료와 특정전문인재의 NIA 승인 다음 날 기산을 다시 읽었다.

705의 F04 `(일반 전문인재 AND 대만 전문업무) OR 특정전문인재`와 양쪽 모두 이미 승인된 거류 OR 영주, 장애 성년자녀 예외,60일 허용체류 요건, 학업·중국어의 입국 제한/4+3개월/주15시간/휴가 포함 결석≤1/4, 학생20시간의 여름·겨울 예외, 국민 배우자의 승인거류 면제와 전문가 배우자의 별도 노동부 신청을 다시 대조했다. 수정한 도입이 이러한 뒤의 조건을 완화하지 않는다.

706의 일반3개월/창업계속4개월/사업중단3개월/Gold Card4개월 신청창구, 사유변경 사실일부터30/15일의 신청과 주소 다음 날30일, 사유 소멸 취소 의무·법정 예외, `<30일 AND 원래 사유 계속 AND 처벌 후`, 전문인재6+6개월/졸업1+1년, 새 졸업·대만 associate 이상·NIA 승인 연장기간, APRC 예외, 특정 온라인 절차 F23의 처리 종료와 재입국 후 `may+if`를 다시 읽었다. FAQ9개와 본문 간 새 모순은 발견하지 않았다.

§5 재점검: 도입은 조문/경로 비교/질문으로 유지되고 최근849–851의 도입·결말과 구체적 소재가 다르다. 유효한 짧은 문장2개 이상, 문단 시작의 허용범위, 인용 없는 서류·결과 문단, 사실에 묶인 실질 결말을 확인했다. 비자/허가·15일/3개월 등 필요한 법적 대비를 점수 때문에 삭제하지 않았다. 지어낸1인칭·판촉 결말·공개 byline·H1·장식 bold는 없다. 남은 MONOTONY 반려 문장은 발견하지 않았다.

R `gray-matter` 실제 파싱 결과: 날짜 두 필드2026-10-25, audience `[is]`, 내부 author `legal-ai-assistant`, FAQ각3개. v2 원본 이미지 경로 일치/파일 존재와 `Skálduð mynd` caption 유지. 공식 URL 집합11/16/14개, EN의9/15/13개 중 누락0을 직접 재확인했다. 내부 링크 값은 R1과 동일하며 R1에서 실제 대상 존재를 확인한 범위를 유지한다. IS 새 페이지의 렌더링·배포·공개 상태를 여기서 승인하지 않는다.
