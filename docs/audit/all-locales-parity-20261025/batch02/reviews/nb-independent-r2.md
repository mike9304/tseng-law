# NB 704–706 수정본 R2 독립검수

2026-10-25 KST. 판정: APPROVE — 기존 필수 의미·용어 지적 5건, MONOTONY 2건 및 출처 보존 지적을 현재 수정본에서 닫는다. 이 판정은 아래 SHA의 원고 검수이며, 인간 원어민·변호사 감수나 공개 배포 확인을 뜻하지 않는다.

검수 범위는 `nb-independent.md`의 지적 종결이다. 현재 NB 세 원고를 전문으로 읽고 `/Users/son7/tseng-all-language-columns-20261025/kimi-work/output-nb/` 원본과 전체 diff를 대조했다. 원고를 직접 수정하지 않았으며 이 보고서만 작성했다. 주 에이전트의 `nb-primary-edits.md`를 대신 작성하거나 덮어쓰지 않았다.

## 원본과 수정본 SHA-256

| 글 | Kimi 원본 | 이번 검수 대상 |
|---|---|---|
| 704 | `e5fabde50a16dd23558043c58302a1f84734dbf01df0673bc557dd069a8f7fb2` | `43eae981b3999cf13b943e69d789dcea616ba7519bbcaa97b7b9aa8dffcf5251` |
| 705 | `18b87e92d2717657968e5d2dddfc7c39f457c54c1d2a70a9b0dabfce6e695369` | `12e38bdc71537107ea3667130075331efbc1c4f375ea424fa97a2f0309161571` |
| 706 | `e54089f212709b52ac806babe4e5f7abe7e8ef1b59791c840735ebf06c39a07e` | `fadba2c1f345db167feb99eae18e6f509d9fe419feb71bd13cf1af65d5d4bf03` |

원본 해시는 기존 Kimi provenance와 일치한다. 외부 모델을 다시 실행하거나 자료를 전송하지 않았다.

## 필수 의미·용어 5건의 종결

| 지적 | 기존 문제 → 실제 수정 문장 | 의미 보존 판정 |
|---|---|---|
| NB705-L01 | `utenom ferier` 및 art53 예외 연결 → `Studenter som omfattes av artikkel 50, kan arbeide høyst 20 timer i uken utenom sommer- og vinterferien.` | CLOSED. 적용 학생 범위와 주20시간을 유지하고, 시간 제한 예외를 여름·겨울방학으로 한정했다. 학생 ARC가 근로허가를 대체하지 않는 뒤 문장도 남았다. |
| NB705-L02 | `ikke kan forsørge seg selv` → `voksne barn som på grunn av fysisk eller psykisk funksjonsnedsettelse ikke er i stand til å ta vare på seg selv` | CLOSED. 성년, 신체 OR 정신 장애, 장애로 인한 자기돌봄 불능이 함께 유지된다. 경제적 부양능력만으로 자격을 만들지 않는다. |
| NB705-V01 | `Helsidestudenter` → `Utenlandske heltidsstudenter som søker fra utlandet, kan søke om oppholdsvisum ved en taiwansk utenriksrepresentasjon.` | CLOSED. 외국인 전일제 학생·해외 신청·대만 공관의 거류비자 경로를 표현한다. 다음의 적격 유학 visitor 비자/NIA 직접 신청과 구분한다. |
| NB706-L01 | 추가 고용까지 종전 고용 종료증명 요구 → `Ved overgang til en ny arbeidsgiver må søknaden også dokumentere at det tidligere arbeidsforholdet er avsluttet.` 및 `Dette dokumentkravet gjelder overgangen, ikke arbeid hos flere arbeidsgivere i seg selv.` | CLOSED. 새/추가 고용주의 일반 허가 신청 의무와 이직 시 종료증명을 구분한다. 개인 허가·법정 예외·이주노동자 범주 및 근로 시작 전 허가 조건도 보존했다. |
| NB706-L02 | `Nytt oppholdsvisum fra BOCA innen 15 dager` → 표의 `Søknad om nytt oppholdsvisum til BOCA eller et avdelingskontor innen 15 dager fra hendelsen` 및 본문의 `må søknaden om nytt oppholdsvisum leveres til BOCA eller et avdelingskontor innen 15 dager fra hendelsen` | CLOSED. 사건 발생일 기산15일 안에 신청할 의무와 BOCA/지소→NIA 순서를 명시했다. 15일 안의 발급 보장으로 읽히지 않는다. 주소 변경의 다음 날30일, Art23-1의 발생일30일과 구별된다. |

이번 R2에서 직접 연 공식 근거:

- [취업서비스법50조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=50): 해당 학생의 주20시간 제한과 여름·겨울방학 예외.
- [취업서비스법53조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=53): 새 고용주의 허가 신청 및 이직 신청의 종료증명, 범주별 예외.
- [외국전문인재법16조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16): 가족의 자기돌봄 조건과 초청자 범주. 두 불릿 및 공통 NIA 거류 OR 영주거류 조건은 그대로다.
- [거류규칙7조](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0080129): 발생일부터30일 NIA 신청 또는15일 BOCA/지소 거류비자 재신청의 구별.

법령 DB가 표시한 정비 기준일은2026-10-16이다. 이후 관보 전수조사를 수행했다고 주장하지 않는다.

## MONOTONY 및 출처 종결

| 지적 | 실제 변경과 검토 | 판정 |
|---|---|---|
| NB705-M01 | `Et … Et … Et …`가 `Besøksvisum gjelder kortere opphold. For lengre opphold brukes oppholdsvisum …`로 정리됐다. 두 조문 연속 시작은 `Hovedregelen om tillatelse står i …`로, `Den` 연속 시작은 `BOCAs ordinære studentordning …`로 바뀌었다. `For familie …`도 `Familieordningen …`로 변경했다. 비자·기관의 역할, 조문 링크, 제외되는 입국방식이 남았다. | CLOSED |
| NB706-M01 | 문단 시작 `Ved`4회 중 고용 문단은 `En ny eller ekstra arbeidsgiver …`, 분실 문단은 `Hvis ARC går tapt eller blir skadet …`로 변경했다. 남은 `Ved`는 이사와 분쟁 상담 문단2개다. 분실 시 증빙의 선택 관계와 경찰신고가 보편 필수가 아니라는 문장을 유지했다. | CLOSED |
| 704·705 source-url-missing | 두 글의 말미 출처에 `https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295`가 복구됐다. 기존 중문 공식 출처도 남아 있다. | CLOSED |
| 706 Art34 URL | 본문과 출처 모두 `?pcode=D0080132&flno=34`로 통일됐다. 조문 의미는 바뀌지 않았다. | CLOSED |
| 706 영어 문의 페이지 | 말미의 불필요한 `https://tseng-law.com/en/contact` 링크가 삭제됐다. 이메일은 한 번 남았고 실제 상담언어 EN/中文/JA/KO만 유지한다. NB 상담을 제공하지 않는다는 추가 단정은 제거됐다. 새 상담언어를 만들지 않았다. | CLOSED |

현재 EN704–706에서 추출한 공식 URL 집합과 해당 NB 원고를 직접 비교했다. 누락은 각0개다. 이 검사는 URL 존재 대조이며 모든 외부 URL의 이번 재접속이나 전체 content-audit 재실행으로 표시하지 않는다. 초기 독립검수의4개 원시 오류는 각각 실제 누락2개, Art34 쿼리 순서, 불필요한 문의 링크였으며 현재 변경으로 모두 해소됐다.

## 변경 후 추가 확인

- `hjemreisen`는 요약과 해외 분실 문단에서 `returen til Taiwan`으로 바뀌었다. 독자의 국적·귀국지를 가정하지 않는다.
- 706 FAQ는 `Arbeid hos en ny arbeidsgiver kan kreve egen arbeidstillatelse`로 고용주의 요구와 법률상 허가를 구별했다.
- 창업가·Gold Card 신청 가능 기간은 `i de fire månedene før utløp`, 사업 종료 뒤 별도 기간은 `i de tre månedene før den nåværende tillatelsen utløper`다. 만료 전 창구라는 점이 명확해졌다.
- `landingvisum`/`avgangsstudent`/`første ARC-trinn`을 `visum ved ankomst`/`nyutdannet`/`veiledningen om første ARC`로 다듬었고, 졸업생의 학위·NIA 승인기간 조건을 유지했다.
- 적용 범위 고지는 출신지가 아니라 중국대륙·홍콩·마카오 주민의 법적 신분으로 명확해졌다.
- F23의 지정 온라인 절차에서 출국 시 심사 종료 및 적격 재입국자의 조건부 재신청 가능성, F10의 NIA 거류승인 다음 날 기산, 대만 거주·호적 국민 배우자 최초 ARC의 최장1년은 변하지 않았다.
- 세 글 모두 FAQ3개, `audience: ["nb"]`, 내부 `author: "legal-ai-assistant"`, 2026-10-25 게시/수정일, 기존 v2 이미지와 `Fiktiv scene`을 유지했다. 본문 H1·굵은 강조·공개 작성자 표시는 없다.

## §5와 실제 기계검사

이번 R2는 수정된 문장·주변 문맥·전체 세 원고와 초기 검수의 최근 NB3편 비교 기록을 대조했다. 최근 NB3편을 다시 전문 검수한 것으로 표시하지 않는다.

1. 올바른 `--lang nb`로 공유 검사기를 직접 실행했고 exit0/FAIL0이었다.
2. 704의30일 기산,705의 입국방식별 효과,706의 카드 효력 질문이라는 도입 차이가 유지됐다. 정형 가상사례 오프닝이 없다.
3. `Fristen regnes fra dagen etter ankomst.` / `NIA fastsetter oppholdsperioden.`, `Andre må ha riktig visum før innreise.` / `Et signert arbeidstilbud er ikke arbeidsgodkjenning.`, `Den forskjellen betyr noe.` / `Erstatningskortet forlenger ikke oppholdet.`처럼 각 글에 짧은 문장이 두 개 이상 남는다.
4. 지적된705 인접 시작 반복과706의 `Ved` 문단 반복이 해소됐다. 수치만 낮추기 위해 법적 제한을 삭제한 diff는 없다.
5. 보관자료·신청 결과·변경 자료를 설명하는 무인용 문단이 유지됐다. 같은 주장→조문→예외 틀을 세 문단 연속하지 않는다.
6. 도구 대비틀 수는1/0/0이다. 필요한 근로허가·재입국·초과거류 제한을 부정문이라는 이유로 삭제하지 않았다.
7. 실질 결말은704의 새 신고기한과 변경 절차,705의 새 목적에 대한 자격판단,706의 실제 귀환일 문서다. 범위·확인일 고지는 구조적 꼬리 예외로 따로 평가했다.
8. `heltidsstudenter` 오류가 고쳐졌다. 새 가짜1인칭·판촉·공개 저자·전문가 승인 주장은 없다.
9. 수정 전후 조문·기산점·기간·금액·FAQ·이미지 가상 표시를 대조했다. 원문 공식 URL은 모두 남았다.

실행 명령: `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <NB704> <NB705> <NB706> --lang nb`

| 글 | 문장 / 평균 / CV | short / run3 / opener_rep | cite_end / cite_para | contrast / caveat / q | 결과 |
|---|---|---|---|---|---|
| 704 | 67 /12.7 /.453 | .284 /.031 /.100 | .000 /.300 |1/0/0 | FAIL0 |
| 705 | 75 /13.7 /.543 | .240 /.068 /.083 | .000 /.500 |0/0/1 | FAIL0 |
| 706 | 92 /13.5 /.476 | .261 /.056 /.083 | .000 /.542 |0/0/1 | FAIL0 |

공유 엔진 SHA-256: `0ff4f2b8d68a71fc16e1e9505c83ebcc22de0b01ad4742d0ad126bf81220f532`. 검사기·프로필을 수정하지 않았다. 기계검사 수치는 언어·법률 전문 감수를 뜻하지 않는다. 새 렌더링·공개 배포는 주 에이전트의 후속 단계다.
