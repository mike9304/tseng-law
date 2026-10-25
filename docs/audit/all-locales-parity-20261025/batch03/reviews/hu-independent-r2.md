# HU 704–706 독립 재검수 R2

판정: APPROVE — 확인한 세 동결 SHA에서 필수 의미 오류 0, 미해결 MONOTONY 0, 공유 `--lang hu` 실제 exit 0 / FAIL 0.

검수자: `column_live_audit` (AI), 2026-10-25 KST. 사람 헝가리어 원어민 검수·변호사 감수·게시 승인이라는 뜻이 아니다. 검수자는 HU 원고, R, 공유 검사기, 저자 기록을 수정하지 않았다. 출력 소유 파일은 이 보고서뿐이다.

## 동결 대상과 원본 보존

| 파일 | 검수 SHA-256 |
|---|---|
| HU 704 | `85f5e774de55aa774e9a3d1167d8a17d8930ec0f82a210f2fbd75c6b618c5146` |
| HU 705 | `766f08472e4184f4b5d9d96011e1b9c1a4a2f25d38cda28ae50823cfd2d11d16` |
| HU 706 | `36e5d579f34d279f8263e7d8feca990c82db574fcb0183e3a3462e0bbc4f07df` |
| hu-author.md, 최종 후속 기록 포함 | `875f0962e7098d6bff20084118ced7893774dc2a132c35b0e62d8add2c95822b` |
| 보존된 hu-independent.md R1 | `f53462308bcc32c29ac2fded7cce55a10829ec3d179d18e0eb1cab72f6d2f1c3` |

원고 세 편의 프런트매터·FAQ·본문·표·출처 목록을 다시 전문으로 읽었다. 저자 H13–H18과 전후 문자열을 읽고, 역변환은 메모리 안에서만 수행했다. 각 수정 전 SHA가 R1의 704 `9bcb998d…`, 705 `2255891f…`, 706 `1a48f8c4…`와 정확히 일치했다. 변경 증거는 704 7쌍, 705 4쌍, 706 3쌍이며 다른 변경이 숨어 있지 않음을 이 SHA 재구성으로 확인했다. 실제 원고를 되돌리지 않았다.

R1에서 전문으로 읽은 최신 EN·KO·ZH 아홉 정본, facts F01–F24, 프로젝트 문체 정본, 최근 HU 879·880·881의 SHA가 이번에도 동일했다. 원문별 SHA와 첫 검수의 근거는 [R1](hu-independent.md)에 보존되어 있다. 자동 갱신된 `LESSONS.md`는 23:04 KST 판 전문을 새로 읽었고 SHA는 `92c572987cbc3c03eeb934fbfd2de6cf42d7e4b2e441cc39fb009c0e11f0e71a`다. `SENTENCE-VARIETY-RULE.md` 전문도 재독했다.

## 필수·선택 지적 닫기

| 구분 | 실제 문제 문장·이유 | 확인한 수정 문장 | 의미 보존·판정 |
|---|---|---|---|
| 필수 R1 / 705 | `Külföldről jelentkező hallgató ... a megfelelő felsőoktatási képzéshez.`에서 `megfelelő`는 full-time을 명시하지 않는다. | `A teljes idejű felsőoktatási képzésre jelentkező külföldi hallgató külföldről, a tajvani külképviseleten kérhet tartózkodási vízumot.` | 전일제 고등교육, 외국 학생, 해외 공관 신청 가능성을 복원. 입학 신청자를 이미 등록한 학생으로 좁히지 않았다. 바로 뒤 유학 목적 방문비자 경로와 일반 무비자·도착비자·다른 목적 방문비자 제외도 유지. CLOSED. |
| 선택 O1 / 704 | `Határidőn túli vagy hiányos pótlás esetén...`에 무보완을 명시하면 더 분명하다. | `Ha a hiányokat határidőn belül nem vagy nem teljesen pótolják, a kérelmet elutasítják.` | 미보완·불완전 보완 시 기각을 명시. 통지 다음 날 15달력일과 특정 해외 발급자료 3개월 대체기간을 유지. 선택 명확화 반영. |
| 선택 O2 / 706 | `friss végzősként`는 졸업반으로 읽힐 여지가 있다. | `...az NIA-nak frissen végzettként engedélyeznie kell a hosszabbítást.` | 이미 대만 associate degree 이상 취득 AND NIA 신졸업자 연장 승인, 그 승인기간 중 면제를 유지. 선택 용어 보완 반영. |
| 선택 O3 / 704 | `Más kérelmező az ő értesítésében...`의 불필요한 대명사. | `A többi kérelmező a saját értesítésében szereplő átvételi rendet követi.` | 다른 신청자는 자신의 통지를 따른다는 뜻. 학생 전용 납부·수령 기한을 일반화하지 않음. 선택 문체 보완 반영. |

R1의 필수 근거는 당시 직접 확인한 [BOCA 외국 학생 거류비자 안내](https://www.boca.gov.tw/cp-166-283-c4da3-2.html)의 full-time 범위와 Notice 5다. 이번에는 그 조건이 실제 수정문에 반영되었는지를 대조했다. 모든 공식 URL을 R2에서 새로 전수 접속했다고 주장하지 않는다.

## 수정된 문장 경계와 실제 리듬

공유 경계 수정 전 수치가 최종 PASS를 증명하지 못했다는 R1의 유보를 유지한다. 새 경계로 메모리에서 재구성한 옛 동결 원고를 측정하니 704 CV .405 / 같은 시작 3, 705 .436 / 4, 706 .461 / 3이 나왔다. 저자의 원래 FAIL 기록과 일치한다.

MONOTONY: 완결문장 길이 편중 — 704·705의 실제 CV .405/.436 — 대상과 기산 규칙, 신청 가능성과 그 조건을 붙이고 짧은 결과는 분리했다. 다음 실제 변경을 읽고 조건 보존을 확인했으며 필수 리듬 지적을 닫는다.

- 704의 `vízumot. A BOCA...`를 `vízumot: a BOCA...`로 연결하여, 입국 후 발급된 비자라는 대상과 발급일부터 30일 규칙을 붙였다. 발급일을 다음 날로 바꾸지 않았다.
- 704의 직접 신청과 허가·면제 설명을 `...engedélyezését, ha szakmai munkáját megfelelő engedély vagy alkalmazható mentesség fedi le...`로 연결했다. 적격 외국 전문인재라는 주어와 제16조 근거는 남았다.
- 704의 최초 배우자 ARC를 `Ha a tajvani házastárs Tajvanon él és szerepel ... az első házastársi ARC legfeljebb egy évre szólhat...`로 묶었다. 대만 거주 AND 호적, 최초 배우자 신청, 최장 1년, 가능이라는 한정이 모두 유지된다.
- 704의 일반 10근무일과 제외기간을 한 문장에 두고 `Hiánypótlás után újraindul a számítás.`로 재계산을 분리했다. 제외되는 서류반환·보완·면담 기간이나 학생 5근무일은 삭제하지 않았다.

MONOTONY: 같은 시작 연속 — 705 `Az illetékes... Az aláírt...`, 706 `A bevándorlási törvény... A törvény...` — 705는 고용주 신청과 업무별 관할·예외의 관계를 연결했고, 706은 `Meghatározott helyzetekben ugyanakkor engedélyezhető...`로 예외적 계속 거류의 가능성을 먼저 밝혔다. 대만 기관의 취소·말소 의무를 선택 행위로 약화하지 않았다. 현재 완결문장 기준 같은 시작은 2/2/1로 지적을 닫는다.

검수자가 직접 실행한 명령:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-all-language-columns-20261025/batch03/src/content/columns-hu/704-taiwan-arc-first-application.md /Users/son7/tseng-all-language-columns-20261025/batch03/src/content/columns-hu/705-taiwan-visa-residence-work-study-family.md /Users/son7/tseng-all-language-columns-20261025/batch03/src/content/columns-hu/706-taiwan-arc-renewal-changes-reentry.md --lang hu
```

| 파일 | 문장 | 평균 길이 | CV | 짧은 문장 | 유사길이 3연속 | 동일 시작 연속 | 최다 문단 첫말 | 결과 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| 704 | 67 | 14.2 | .465 | .194 | .031 | 2 | 2 | exit 0 / FAIL 0 |
| 705 | 68 | 14.5 | .453 | .191 | .000 | 2 | 1 | exit 0 / FAIL 0 |
| 706 | 90 | 13.8 | .464 | .233 | .045 | 1 | 1 | exit 0 / FAIL 0 |

실제 `body_blocks` → `sentences(..., 'hu')` 추출도 읽었다. 아래 정상 표기를 지우거나 기호를 바꾸지 않고 각 문장이 완전하게 남았다. 점·숫자·`cikke`만 따로 남는 대상 조각은 없었다.

```text
Munkába állás előtt a tényleges feladatot és munkáltatót az alkalmazható engedélyhez vagy mentességhez kell igazítani a foglalkoztatási szolgáltatásokról szóló törvény 43. és 48. cikke szerint.
A foglalkoztatási törvény 43. és 50. cikke szerinti érintett hallgatói kategóriákban heti legfeljebb 20 óra munka végezhető, a nyári és téli szünet kivételével.
A foglalkoztatási törvény 48. cikke alapján engedélymentesen dolgozhat a külföldi, ha házastársa tajvani háztartási nyilvántartásban szereplő állampolgár, és a külföldi már tartózkodási engedélyt kapott.
Végzés, munkaviszony megszűnése vagy családi változás után csak a bevándorlási törvény 23-1. cikkében felsorolt esetekben használható az ott biztosított jogcímváltás.
```

실측 공유 도구 SHA: metrics `69ceb7202a6e716ba1666ec08f4757daea8bc43289448dcffa8446c830ecd6fb`; multilingual `042037e93c6a78459d1e7ea85b9b6bdb0b8aa1038ca9dc0f54c8239e76d4d6d1`; expansion `f52177c31d0d0d161d78f5b578ede8e6213dc090b116d6ca7dfaf2115e1c49f9`; HU profile `cef85b13e94e3fd08f23d3aa4fba80ab51c116adf3c7d30cb8e4e59d00b1279b`. 중립 fixture와 42개 단위시험은 도구 담당/root의 별도 검증이며, 이 검수자가 재실행한 것처럼 적지 않는다.

## 법적 의미와 FAQ 재대조

| 항목 | 현재 원고에서 확인한 적용 조건 |
|---|---|
| F01–F03·F05–F07 / 최초 신청 | 거류비자 입국과 승인된 거류의 다음 날 30일, 입국 후 비자 발급일부터 30일을 분리. 직접 경로의 적격·입국 제한, 실제 주소·최근 발급 증빙, 학생 등록 전/후 서류, 해외 인증 의무와 요구 가능한 중국어 번역 구분 유지. |
| F04 / 가족 초청자 | `Tajvanon szakmai munkát végző külföldi szakembert, illetve különleges szaktudású külföldi szakembert` 뒤 `Mindkét esetben` NIA 거류 OR 영구거류 승인을 붙임. 특정전문인재에게 전문업무 조건을 일괄 추가하지 않음. 성년 자녀는 장애로 `önmagát ellátni nem képes`, 즉 self-care 불가이며 단순 경제 의존으로 치환하지 않음. |
| F08–F12 / 기간·돈·기산 | 최초 국민 배우자 최장 1년, 일반 최장 3년, 특정전문인재 최장 5년, Gold Card 1–3년. 제8조는 NIA 거류 승인 다음 날이며 가족의 자체 거류 승인도 명시. 연 1,000·미만도 전액·해당 추가 2,200·僑生 반액·재발급 500 유지. 학생 승인 후 5근무일 납부, 납부 뒤 3근무일 IC 수령, 6개월 이하 전자형 구분. |
| F13–F14 / 학업·근로 | 전일제 복원. 어학 4개월 이수 AND 최소 3개월 추가등록·주중 주 15시간·휴가 포함 결석 1/4 이하. 학생 20시간 제한의 예외는 `nyári és téli szünet` 여름·겨울 방학이고 다른 근로 조건은 여전히 적용. 국민 배우자 면제와 전문인재 배우자의 직접 허가 신청 구분. |
| F15–F17 / 변경·연장 | 3개월·4개월은 만료 전 신청창구. 주소·근무처 변경 다음 날 30일, 제23-1조 사유변경 발생일부터 30일, 그 밖 BOCA 발생일부터 15일은 비자 신청이지 수령기한이 아님. 이전 고용 종료증명은 이직(`Átlépéskor`)의 조건이며 모든 추가 고용으로 확대하지 않음. |
| F18–F19 / 사유 소멸·초과거류 | NIA 취소·말소 의무와 조건부 계속 거류 가능 구분. 가정폭력 이혼·미재혼·국민 배우자 대만거주/호적, 호적 미성년자 돌봄 OR 친권·의무 OR 교류, 진행 중인 대만 고용주 상대 소송, 치료 중 산재 유지. 30일 미만 AND 원래 사유 계속·법정 처분 후 신청 가능, 자동 연장 아님, APRC 계산 1년 공제. |
| F20–F21 / 졸업·구직 | 전문인재 6개월+1회·합계 1년과 적격 대만 졸업자 1년+1회·합계 2년 구분, 이전 만료 다음 날부터 계산·만료 전 신청. 취업허가 면제는 이미 대만 전문학사 이상 취득 AND 신졸업자로 NIA 연장 승인·그 기간. |
| F22–F23 / 귀국 | 재입국허가와 ARC 유효성 연동·유효 여권+유효 APRC 예외. 특정 온라인 심사 중 출국 시 심사 중단, 재입국 후 조건 충족자가 재신청할 수 있음(`feltételeit teljesítő személy ismét kérelmezhet`). 접수증을 귀국 서류로 치환하지 않음. |
| F24 / 보완 | 통지 다음 날부터 15달력일; 해당 자료를 해외·중국대륙·홍콩·마카오에서 신청해야 하는 경우 3개월 대체. 신청인이 해외에 있다는 사실만으로 적용하거나 15일에 3개월을 더하지 않음. 무보완·불완전 보완 시 기각을 명시. |

각 FAQ 3개, 총 9개를 본문과 별도로 읽었다. 704의 두 기산일·수수료·근로권, 705의 직접경로·어학 조건·가족 범위, 706의 신청창구·변경신고·접수증 한계는 본문과 일치한다. FAQ가 생략한 세부조건은 일반적인 자동 자격을 주장하는 방식으로 요약되지 않았다.

## §5와 구조 재검사

| §5 | 독립 확인 |
|---|---|
| 1 | 올바른 공유 HU 프로필의 실제 CLI exit 0 / FAIL 0. 숫자 경계 추출과 의미 검수를 분리했다. |
| 2 | 704는 30일 기산 사실, 705는 같은 입국방식의 다른 경로, 706은 사유가 먼저 사라진 경우의 질문. 최근 HU879의 working holiday 계약, HU880의 법인 형태, HU881의 상속기한 도입을 복제하지 않았다. |
| 3 | `Harminc nap áll rendelkezésére.`, `A díj ezt követi.`, `Az aláírt ajánlat még nem engedély.`, `Maga az esemény dátuma is számít.` 등 실제 짧은 문장과 조건을 담은 긴 문장이 공존. 숫자·단위 조각을 짧은 문장으로 세지 않는다. |
| 4 | 모든 문단 첫말을 세로로 읽음. 최다 2/1/1회, 실제 동일 시작 연속 2/2/1. |
| 5 | 인용 문단 비율 .368/.500/.500, 문장 끝 괄호 인용 0. 실제 주소 준비·입국 경로의 결과·서류 준비 같은 비인용 설명 문단이 있으며 세 문단 연속 주장→조문→예외 공식 없음. |
| 6 | 도구 contrast 0만으로 판정하지 않고 근로·체류, 이직·추가고용, 접수증·여행서류의 필요한 구분을 읽었다. 독자가 하지 않은 주장을 만들어 반박하지 않았다. |
| 7 | 고지 직전 실질 결말은 704 만료·변경에 따른 다음 절차, 705 실제 승인에 맞춘 근로·학업 시작일, 706 귀국일에 실제 쓸 수 있는 문서. 필요한 적용범위·확인일 고지는 구조적 꼬리 예외이며 반복만으로 반려하지 않는다. |
| 8 | 일관된 설명체·정중한 지칭. 굵은 강조·본문 H1·공개 작성자란·가짜 사례·판촉형 결말 없음. 언어를 독자 국적으로 간주하지 않음. |
| 9 | 법적 주체·must/may·AND/OR·기산·기간·금액·정상 조문표기·URL·허구 이미지 캡션을 유지. 내용 삭제나 도구 변경으로 수치를 맞추지 않음. |

검수자가 Node 24와 R의 기존 gray-matter로 날짜·audience·내부 author·FAQ·이미지 실재와 EN 일치·캡션·굵은 강조·본문 H1·EN의 공식 URL 포함·내부 링크 실재를 다시 확인했다. 오류 0, 공식 URL 11/15/16개(EN의 9/15/13개 모두 포함), 내부 링크 3/4/3개다. 영어 관련글은 본문에서 영문임을 밝힌다. 내부 `author: legal-ai-assistant`와 `Kitalált jelenet` 캡션을 보존했다.

한계: 이 재검수는 파일과 현재 공유 검사기의 검증이다. 기계 PASS는 언어·법률 품질의 보증이 아니며, 사람이 검수했다는 표시를 부여하지 않는다. HU의 빌드·공개 HTTP·브라우저 표시·실배포는 이 보고서에서 수행하거나 완료로 주장하지 않는다. R1 원본의 유보와 과거 잘못 분할된 수치를 지우지 않고, 현재 SHA의 후속 판정만 이 파일에 기록했다.
