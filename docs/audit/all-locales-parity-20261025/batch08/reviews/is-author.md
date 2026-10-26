# B8 Icelandic six columns — author record

Status: AUTHOR_COMPLETE_FOR_INDEPENDENT_REVIEW. 대상은 batch08의 IS915·916·918·919·920·921 여섯 원고다. 직접 집필·자기검수 단계이며, 독립 의미검수·사람 원어민 검수·변호사 승인·브라우저 표시 확인·공개 게시 완료를 뜻하지 않는다. R, 공용 검사기, 다른 작성자의 원고/기록은 변경하지 않았다.

## 입력과 읽은 범위

B8/BRIEF.md와 참조 B7/BRIEF.md 전문, 동결 B6 canonical6(EN915/916, ZH918/919/920/921), authoring-contract-draft.md, six-source-facts.md, source-register.md, source-freeze.json 및 bundle-manifest를 적용했다. 같은 연속 과제에서 이미 전문을 읽은 동일 SHA는 그 범위를 재사용했고, B8 준비 기록은 checks/is-inputs.json에 남겼다. 다른 언어 초안을 정본으로 번역하지 않았다. 이번 집필/재개 과정에서 사실표, 920/921 정본 전문과 규칙5절을 다시 직접 열람했다.

공통 ~/agent-library/knowledge/editorial-voice.md 경로는 이 환경에서 없었으므로 BRIEF의 R/docs/columns/EDITORIAL-VOICE.md 및 ~/tseng-col-0930-work/COLUMN-VOICE-RULE.md 전문을 사용했다. SENTENCE-VARIETY-RULE.md와 현행 LESSONS 전문을 읽었다. 이전03:05 입력 기록을 보존하고,15:46 재개 전에15:05 LESSONS 전문을 읽은 기록을 is-resume-inputs.json에 별도로 두었다. 최신 LESSONS SHA는 ca642a38c2b0a925c19ded6600b2f06901aed057bed44b71fab9c16f22c2b7ab다. 종료 시44참조 SHA 불일치0(is-inputs-end.json).

공식자료의 실제 조회 상태·범위는 동결 B6 source-register에 따른다. 25일 보관 법원 회신/선택 PDF 구간과26일 연구자료의 현행 법령·정책 확인을 구별했다. 새 법원 사이트 접속 성공,416쪽 PDF 전수 열람 또는 새 법률 검색을 한 것처럼 기재하지 않는다. 원고의26일 자료 기준은 이 연구 묶음에 의존한다.

최근 IS 세 편은 파일번호가 아니라 실제 published=2026-10-26 기준의704–706을 전문으로 읽었다. 704「Fyrsta ARC-dvalarkortið á Taívan: frestur, gögn og afhending」의 조문형 도입,705「Að flytja til Taívan vegna vinnu, náms eða fjölskyldu」의 자격별 비교,706「ARC á Taívan eftir starfslok, flutning eða fyrirhugaða ferð」의 질문형 도입을 비교했다. 기존의 Taívan, má/ber/skal, 날짜 서수 관행을 참고하되 ARC의 조문→안내 순서를 여섯 사건에 반복 복제하지 않았다. 세 SHA와 실제 존재하는 IS004 내부 경로는 입력 기록에 있다.

여섯 원본 이미지는 같은 연속 B6 작업에서 이 작성자가 직접 시각 확인한 자료를 재사용했다. 현재 해시가 그 이미지와 같음을 확인했다. 915 안전모·설계도·바인더·교량 모형,916 토양시료·접이식 탁자·공장,918 새집 문서·봉투·상자,919 빈 원탁회의실·세 의자,920 지하주차장 차량·기둥 충전기·천장 배선,921 컨트롤러·추상화면·토큰·노트에 맞춰 IS alt를 작성했다. caption 여섯 개는 정확히 Skálduð mynd다. 이번에 새 이미지나 실제 고객 장면을 만들지 않았다.

## 현재 원고와 실제 검사

모든 파일은 published/lastmod=2026-10-26, date_display=26. október 2026, audience=[is], 내부 author=legal-ai-assistant다. topic은915/918/920/921 litigation,916 company,919 labor다. 공개 인간 작성자/감수자 표기는 만들지 않았다.

| ID | 최종 SHA256 | 실제 문장 | CV | 짧은 문장 비율 | 실제 CLI |
|---|---|---:|---:|---:|---|
| 915 | `3ba7ba24c0ec9c31fbfb1b0686032d33c305488acb64d55bb9d1c0f104841f3d` | 41 | 0.471 | 0.220 | exit0 / FAIL0 |
| 916 | `03d2248e93f7bad97d76e622f07575eaaafc2b555641ab68b80a0cdf76e3f5cd` | 42 | 0.525 | 0.286 | exit0 / FAIL0 |
| 918 | `3de83250611c1f1071803fb141c650446c65163ce32a06125485aa27e99b6c60` | 43 | 0.481 | 0.279 | exit0 / FAIL0 |
| 919 | `09bab5c57eea037bd207f536090989cd76ad2e340f654d4ea63d3f3ffeb871ca` | 36 | 0.458 | 0.222 | exit0 / FAIL0 |
| 920 | `b4b41ccba00179a1b54b5425964eebd992aff3076ba8646eafe90440ac9d27f8` | 37 | 0.496 | 0.297 | exit0 / FAIL0 |
| 921 | `af57a32c37bce920c808c59c5264a593d07058f10a87f9e1376d436e5e6103c2` | 45 | 0.458 | 0.222 | exit0 / FAIL0 |

Node24 PATH와 PYTHONDONTWRITEBYTECODE=1을 두고 실제 공용 variety_metrics.py check <원고> --lang is를 실행했다. IS는 지원된 프로필이며 다른 언어로 위장하지 않았다. 검사 단위는 orthographic_words, 경계는 unicode_punctuation_with_locale_abbreviations다. 도구·임계치·프로필을 변경하지 않았다.

초기 실패를 숨기지 않는다. 초기915/916/918은PASS,919 CV.372·920 .420·921 .405는FAIL이었다. 첫 자기수정 후919 .424가 여전히FAIL이어서 조건과 처분 이전 사실을 다시 구성했고 최종.458을 확인했다. 초기→r1→r2→r3→r4의 실제 stdout/exit/SHA는 checks/is-variety-*.json에 보존했다. r3는919 FAQ 문법, r4는921 제목 통화 명시만 바뀌었으므로 본문 수치는 같지만 해당 새 SHA의 CLI를 직접 실행했다. 변하지 않은915를 반복 실행하지 않았다.

최종 is-variety-final.json은 각 현재 SHA와 일치하는 가장 최근 실제 실행을 모았다. 구조검사는 실제 R 런타임과 읽기 전용 symlink overlay, 정확한 full-slug sourceMap, EN2/ZH4 sourceLocale로 실행했다. 자동 오류0, FAQ17, 편별 공식 URL 고유 수 합계23(4/3/4/4/4/4), 본문 및 말미 누락0이다. 메타데이터가 뒤늦게 바뀐919·921만 표적 구조 재검사했다. is-content-audit-final.json은 여섯 현재 SHA에 맞춘 결과이며 semanticStatus와 rendering/published 한계를 그대로 보존했다.

## 법률 의미·본문·FAQ 자기검수

| 글·사실표 범위 | 실제 문장/구성에서 확인한 보존 내용 |
|---|---|
|915-C1–4/L1–3/P1/M1/O1|NT$44,417,150는 취소된 중재판정액이고 최고법원의 최종 지급액이 아니다.2017-07-12 최고법원106年度台上字第723號 및 해당 취소사건 확정 범위를 유지했다. 표4행에 금전→공기연장→연장 권고·기관 부동의→다시 금전 및 해당 금전 권고 부재의 순서를 보존했다. 불성립 증명서만으로 부재가 보충되지 않으며 기관의 구체 청구 심의 기회를 남겼다.85-1의 공사 OR 기술서비스, 권고 OR 안, 기관 부동의로 불성립이라는 원인, cannot-refuse를 한 조건문으로 썼다.40(1)(2)는 사건의 합의 부존재만 설명해 일반 사유를 불완전하게 열거하지 않았다. 최고법원의 적용법 이유 정정과 취소 결론 유지를 구별했다. ITA 자료는 미국 공급자 대상2026말/2027예정으로 쓰고 현재 입찰/국적별 자격을 만들지 않았다. FAQ2개는 자동 중재권 부정과 모든 금액·법률 논거 변경이 새 분쟁은 아니라는 범위다.|
|916-C1–3/L1–3/P1/M1/O1|2018-08-16 최고법원107年度台上字第267號, 지배·인지·고지/개선 미이행·책임 회피 목적 감자/국외이체를 함께 설명했다. 제목·본문은 소유만으로 책임을 인정하지 않는다.246부분 파기환송,262관련 상고기각이며 소제목도 áfrýjunum varðandi 262로 상고 주체를 단정하지 않았다.262원청구 모두 기각/무배상 또는 모든 관련 소송 종결로 쓰지 않았다.154조 남용→특정채무 AND 명백한 변제곤란 AND 중대성/필요성을 누적 조건으로 연결하고 Þá ber honum að greiða skuldina로 의무를 명시했다. 현재 조문을 역사적 판결 유일 근거로 소급하지 않는다. USTR는 미국·대만의 의향/가능성/적용법 조건이며 지원금·협정 전면발효를 보장하지 않는다. FAQ3개에는 소유만의 책임 부정,집단별 절차결과,실사 후 자료와 보관만으로 준법 아님을 남겼다.|
|918-C1–4/L1–2/M1–2/P1/O|2022-02-09 타이중 고등법원 분원109年度上易字第289號의 항소·추가청구 기각과 지연이자 유지, Ekki var heimilt að áfrýja dóminum áfram라는 명시적 상소불가를 보존했다. 불명확한 재록 금액을 새로 보충하지 않았다.2019-02-23 대출 진행 편지,미연결 물/전기,7월 하자와 lyftunnar의 설치 미완료,8월 목적 제한 출입,11월5일 대출금과11월28일 보증서 인도일을 구분했다. 과거 계약4개월/현재15점6개월은 모두 사용허가 취득 기산의 인도 통지다. 수선·정산·서류 인도 의무와 매수자14점 의무도 남겨 전면 납입중단권으로 바꾸지 않았다.2025계약점검과2026-09-18 CBC현행판은2019사건의 소급 근거가 아니다. FAQ3개 모두 문서 내용·주택 상태,4/6개월·기산,대출 미지급만의 통지무시/일률 지급중단 부정을 유지했다.|
|919-C1–4/L1–3/P1/O1|2026-09-03 타이베이 고등행정법원114年度訴字第869號. Tveir stórir agapunktar, svonefnd 兩大過, ... með einni ákvörðun으로 대만 제도의 두 중대감점이 한 결정이라는 맥락을 명시했다. 원면직 및 복심 취소,발표→상급기관→소속기관 심의,실질 독립 심의 결함,사전 진술 통지/기회 결함,보고서의 증명과 징계 권고 불일치,후속 불복 진술로 치유되지 않음을 모두 남겼다. Áfrýjun var heimil과 후속미확인으로 종료·자동복직을 단정하지 않았다. 민간2026-07-01 신제는 과거 공무원 절차와 별도다.22-2 조사/조율 객관·공정·공평,충분한 진술·답변과 이해충돌 회피를 의무로 썼다. 피해신고 인지 조건 아래 재발방지조치/조사/필요상황별 상담지원보호 의무를 연결하고 피해자 의사에 따른 조율may와 불성립 시 계속조사must를 분리했다. 결과 보장 같은 별도 책임 명제를 덧붙이지 않는다. FAQ3개도 취소≠모든 괴롭힘 없음,조사 중 보호 병행,민간의 공무원절차 복제 금지를 보존한다.|
|920-C1–4/L1–2/M1/P1/O1|2022-06-22 가오슝 분원111年度上字第132號 항소기각/철거·원상회복 유지,후속확정 미확인을 보존했다. 뒤벽/천장 행거/공용함 차단기와 íbúinn notaði라는 계량기 사용 연결을 썼고 법적 소유권 판정으로 확대하지 않았다. 국가11조 구분소유자회의와 해당 규약15조 위원회 허가 AND 전력회사 안전검사를 분리했다.6(1)(5)위반+협의 후 계속 미철거→6(3)제소 가능(gat),6(1)(4)부적용을 중립적으로 설명하고 검증 안 된 발언 주체를 만들지 않았다. 차단/잠금/열쇠 주장은 even-if 범위와 철거 의무를 유지했다.2026Kaohsiung보조는 공공구역 충전 선로 트레이,공고9월30일 마감 경과이며 사용동의 대체가 아니다. FAQ3개는 주차공간/공용부,사후 안전/기존 동의,보조금/공사권한을 각각 보존한다.|
|921-C1–3/L1–4/P1/M1/O1|2021-09-13 지룽지방법원109年度消簡上字第1號,NT$243,548는 청구액이고 지급액이 아니다. hafnaði endurgreiðslukröfunni로 본안 불인용을 나타냈고 형식 각하를 뜻하는 vísað frá를 쓰지 않았다. Frekari áfrýjun var ekki heimil을 보존했다. 미사용 구매점수 없음과 남은 대전 칩 기능,특정 현금교환/도박 이유,본인 종료의사와 사업자 전체 제재 적법성의 구별을 유지했다.2023-01-01현재 규정은2021판결 이후다.18점 anytime통지종료may/미사용 구매포인트 OR 미사용 게임비용/필요비용/계약종료 후30일must OR 쌍방합의 방식,4점 게임시작 후7일 서면 무이유·무비용 해제,9점 최소30일 보존/요청수령 후7일 제공,금지6점 사업자자료만 기준 금지를 구분했다. 실무 기록 비교는 má/geta 권고이며 새 법정 의무가 아니다.2025첫 신고유형2위와 전년대비감소를2026-05-07발표로 한정했다. FAQ3개는 금화명칭,7일해제/언제든종료,사업자기록만 기준금지의 실제 질문을 유지한다.|

정본의 정확한 축약은 선택 세부를 모두 늘리지 않았다. 예컨대915 취소사유 일반 열거,920예산조기소진 또는919조사조직 규모별 구성은 새 명제 부족만으로 확장하지 않았다. Icelandic 독자의 국적·거주국법·상담언어를 가정하지 않았고 미국 자료를 아이슬란드 사업자 자료로 바꾸지 않았다. IS004 내부 글은 실제 경로를 확인했고 /en/contact에는 ensku samskiptasíðunni라고 표시했다. 이메일에는 사건 요약/회신기한을 안내하며 민감한 전체자료·비밀번호 제출을 요구하지 않는다.

## 규칙5절과 실제 문장 경계

1. 현재 여섯 SHA 모두 실제 shared --lang is exit0/FAIL0다. 기계 수치가 법률·원어민 승인은 아니다.
2. 도입은915금액,916환경조사라는 사실,9182019편지의 시간순 사실,919위원회 실질 권한 질문,920벽·천장·함의 실제 위치,921환급 청구액으로 분산했다. 수치형2·사실형2·질문형1·장면형1로 한 유형3편 초과/장면2편 초과가 없다.920은 판결의 실제 배치 묘사이며 꾸민 현장·실존자 발언을 만들지 않았다. 이미지 허구 캡션은 별도로 유지한다.
3. 최종244개 본문 추출 전체를 읽었다. 초기252개를 실제 출력으로 읽었고,그중 현행220개는 문자열 그대로다. 변경24개는 해당 전체 문단에서 다시 읽었다. 아주 짧은 문장은 편별9/12/12/8/11/10개이고 긴 문장32단어 이상이 한 문단에2개 있거나 연속한 구간은0이다.915의33→10→7,916조건36→의무6,919절차32→후속결과10,921환급33→다음 비용문장7의 실제 호흡을 확인했다.
4. 문단 오프너를 세로로 읽었다. 최대2회(915/918의 Í,921의 Samkvæmt)이고 나머지는 최대1회다. 연속 문장 시작 동일쌍은 모두0이다. 실제 목록은 is-boundary-review.json에 있다.
5. 인용을 도입/조문 주어/본문/말미에 분산했다. 조문 주장→예외의 세 문단 반복이 없으며 각 글에 자료·사건·실무 질문의 인용 없는 문단이 있다. 공식 링크는 삭제하지 않았다. 통계는 표/FAQ/말미 출처를 본문 문장에 넣지 않으므로 이 부분도 따로 읽었다.
6. 자동 contrast는0/0/0/0/1/0이다. 수동으로는 구체적인 청구 동일성,소유만의 책임,통지와 인도,공무원/민간,공용부 동의,게임 포인트 기능의 법적 구별을 검토했다. 반복 반박을 늘리지 않도록919의 결과보장 부정·보호 중복,920의 미제기 계량기 소유권 반박을 제거했다. 법적 예외·불성립 조건은 그대로다.
7. 날짜고지 직전 실질 결말을 따로 읽었다.915시간연장/금전/거절권고 문서,916발견/결정/자산이체,918대출/검사/인도 문서의 요구행위,919통지/답변/증거평가,920동의/실시설계/비용,921입금/전환/사용과 청구액으로 끝난다. 고지와 출처를 마지막 실질 문단으로 잘못 판정하지 않았고 승소·허가·환급 보장이나 복제한 판매형 마무리가 없다.
8. 표준적인 설명형 IS로 썼으며 ko/ja 종결법은 적용 대상이 아니다. 굵은 강조,HTML우회,지어낸1인칭,명령형 체크리스트 제목을 넣지 않았다. 원어민 검수를 받았다는 뜻은 아니다.
9.22개 실제 치환을 역순으로 복원해 최초6SHA가 모두 일치했다. 숫자 토큰 multiset·URL 순서도 초기와 같고,필요한 의미는 별도 수동 대조했다. 기계적 숫자 동일만으로 AND/OR·시점·주체 보존을 주장하지 않는다.

문장 경계에서는44.417.150/243.548천단위 구분점,아이슬란드 날짜 서수,154. grein/2. tölulið/1. málsgreinar/40. greinar,85-1/22-2,중문 사건ID,페이지 범위,링크와 이메일 주변을 실제로 읽었다. 정상 구두점을 점수 때문에 제거하지 않았다. 프로필이 의미나 원어민 문법을 판정한다고 주장하지 않는다.

## 실제 자기수정: 문제 문장 → 이유 → 수정 → 의미 보존

아래22개는 최초 원고를 먼저 저장한 뒤 실제로 적용한 치환이다. 전체 파일 diff,각 단계 SHA 및 역복원 증거는 is-self-edits-r1/r2/r3/r4.json과 is-integrity-final.json에 있다. FAIL 단계와 원문 스냅샷은 보존했다.

### E01 — 916 / r1

문제 문장·구간: Núverandi ákvæði ætti heldur ekki að setja fram sem einu skýringu dómsins á eldri háttsemi árið 2018;

이유/판단: 법률 근거를 설명하는 대상 명사를 명료화; 현행154조가 역사적 판결의 유일 근거라는 소급 단정 금지 유지.

실제 수정: Núverandi ákvæði ætti heldur ekki að setja fram sem einu lagastoð dómsins um eldri háttsemi árið 2018;

의미 보존: 확인. 정본/사실표에서 해당 조건을 대조했고, 자동 수치 통과만으로 이 판정을 하지 않았다.

### E02 — 916 / r1

문제 문장·구간: Núgildandi ákvæði og fjárfestingarheimildir voru yfirfarin 26. október 2026.

이유/판단: fjárfestingarheimildir가 투자 허가로 읽히지 않게 실제 USTR 정보 자료임을 명시; 자격·권리 추가 없음.

실제 수정: Núgildandi ákvæði og opinberar upplýsingar um fjárfestingu voru yfirfarin 26. október 2026.

의미 보존: 확인. 정본/사실표에서 해당 조건을 대조했고, 자동 수치 통과만으로 이 판정을 하지 않았다.

### E03 — 918 / r1

문제 문장·구간: title: "Lánabréf og aðgangur að íbúð sönnuðu ekki afhendingu á Taívan"

이유/판단: lánabréf의 채권/증서 뜻을 피하고 대출 진행 문의 편지라는 실제 대상을 명시.

실제 수정: title: "Bréf um lán og aðgangur að íbúð sönnuðu ekki afhendingu á Taívan"

의미 보존: 확인. 정본/사실표에서 해당 조건을 대조했고, 자동 수치 통과만으로 이 판정을 하지 않았다.

### E04 — 918 / r1

문제 문장·구간: Við röðun gagnanna nýtist að halda lánabréfi, úttektarboði og afhendingartilkynningu aðgreindum eftir því hvaða athöfn hvert skjal kallaði á.

이유/판단: 동일 용어 명료화를 실질 결말에도 적용; 대출·검사·인도 구분 보존.

실제 수정: Við röðun gagnanna nýtist að halda bréfi um lán, úttektarboði og afhendingartilkynningu aðgreindum eftir því hvaða athöfn hvert skjal kallaði á.

의미 보존: 확인. 정본/사실표에서 해당 조건을 대조했고, 자동 수치 통과만으로 이 판정을 하지 않았다.

### E05 — 919 / r1

문제 문장·구간: Fundargerð sýnir að fundur fór fram. Til að meta sjálfstæða umfjöllun getur þurft að lesa hvað var lagt fyrir nefndina og hvort hún gat í reynd komist að annarri niðurstöðu en þeirri sem þegar hafði verið birt. Fyrirfram tilkynnt refsing getur þannig haft áhrif á mat á síðari málsmeðferðinni.

이유/판단: MONOTONY: 추상적인 회의 개최/독립성 해설을 실제 독자의 질문과 검토 자료로 재구성; 이미 처분이 발표된 순서·독립적 판단 가능성 보존.

실제 수정: Gat nefndin breytt niðurstöðunni? Fundargerðin, gögnin sem lögð voru fram og umræður nefndarmanna geta skýrt hvort sjálfstætt mat fór fram eftir að refsingin hafði þegar verið tilkynnt. Dagsetning fundar ein svarar því ekki.

의미 보존: 확인. 정본/사실표에서 해당 조건을 대조했고, 자동 수치 통과만으로 이 판정을 하지 않았다.

### E06 — 919 / r1

문제 문장·구간: Berist kvörtun frá starfsmanni sem telur sig hafa orðið fyrir einelti ber vinnuveitanda að grípa til ráðstafana gegn endurtekningu og hefja rannsókn. Hann þarf einnig að veita ráðgjöf, aðstoð og vernd eftir þörfum og aðstæðum. Vernd getur hafist meðan rannsókn stendur.

이유/판단: MONOTONY 및 조건 명료화: 한 수령 조건에 재발방지조치·조사·필요상황별 상담지원보호를 연결; 결과보장 아닌 조치 의무와 긴 설명 뒤 실질 단문 보존.

실제 수정: Berist kvörtun frá starfsmanni sem telur sig hafa orðið fyrir einelti ber vinnuveitanda að grípa til ráðstafana gegn endurtekningu, hefja rannsókn og veita ráðgjöf, aðstoð og vernd eftir þörfum og aðstæðum. Vernd getur hafist meðan rannsókn stendur.

의미 보존: 확인. 정본/사실표에서 해당 조건을 대조했고, 자동 수치 통과만으로 이 판정을 하지 않았다.

### E07 — 919 / r1

문제 문장·구간: Vilji kvartandinn leita samkomulags má reyna þá leið, en náist ekki samkomulag þarf rannsóknin að halda áfram. Skyldan til fyrirbyggjandi ráðstafana er ekki loforð um tiltekna niðurstöðu rannsóknar eða trygging fyrir því að einelti endurtaki sig aldrei. Réttur til andmæla og vernd starfsfólks geta farið saman.

이유/판단: 공식 의무 뒤 덧붙인 불필요한 결과보장 부정과 중복 결론 제거; 피해자의 의사에 따른 조율 가능+불성립 조사 계속 의무 유지. 앞 문단의 보호 의무 그대로.

실제 수정: Vilji kvartandinn leita samkomulags má reyna þá leið. Náist ekki samkomulag þarf rannsóknin að halda áfram.

의미 보존: 확인. 정본/사실표에서 해당 조건을 대조했고, 자동 수치 통과만으로 이 판정을 하지 않았다.

### E08 — 919 / r1

문제 문장·구간: Hér er um skipulagningu rannsóknar að ræða út frá þeim annmörkum sem dómurinn fjallaði um.

이유/판단: 이미 조언형 má인 조사서 작성 안내 뒤 메타 해설 중복 제거; 증거검토·상반자료 고려 등 실질 권고 유지.

실제 수정: (해당 중복/불필요 문장 삭제; 실질 조건은 앞뒤 문장에 유지)

의미 보존: 확인. 정본/사실표에서 해당 조건을 대조했고, 자동 수치 통과만으로 이 판정을 하지 않았다.

### E09 — 920 / r1

문제 문장·구간: Þessi lýsing á tengingu var ekki niðurstaða um lagalegan eignarrétt að mælinum; ágreiningurinn laut að framkvæmdum í sameigninni.

이유/판단: 실제 본문이 íbúinn notaði로 계량기 사용만 기술하므로 독자가 하지 않은 소유권 판결 반박 제거; 연결 사실과 공용부 설치 범위는 앞뒤 문장에 유지.

실제 수정: (해당 중복/불필요 문장 삭제; 실질 조건은 앞뒤 문장에 유지)

의미 보존: 확인. 정본/사실표에서 해당 조건을 대조했고, 자동 수치 통과만으로 이 판정을 하지 않았다.

### E10 — 920 / r1

문제 문장·구간: Stjórnin hafði sent formlegt bréf til að leita lausnar en búnaðurinn var enn á sínum stað. Hún gat þá leitað til dómstóls samkvæmt 3. málsgrein sömu greinar.

이유/판단: MONOTONY: 정식 협의 통지 후 위반 지속이라는 조건과 제6조3항 제소 가능을 하나의 조건문으로 연결; may가 must로 바뀌지 않음.

실제 수정: Þegar búnaðurinn hafði ekki verið fjarlægður eftir að stjórnin sendi formlegt bréf til að leita lausnar gat hún leitað til dómstóls samkvæmt 3. málsgrein sömu greinar.

의미 보존: 확인. 정본/사실표에서 해당 조건을 대조했고, 자동 수치 통과만으로 이 판정을 하지 않았다.

### E11 — 920 / r1

문제 문장·구간: Ekki verður af því leidd sama atkvæðagreiðsla fyrir alla hleðslubúnað í sérhverju húsi.

이유/판단: allan hleðslubúnað 격형 오류를 피하고 사건 한정을 직접적인 문장으로 정리.

실제 수정: Dómurinn setur því ekki eina atkvæðagreiðslureglu fyrir öll hús.

의미 보존: 확인. 정본/사실표에서 해당 조건을 대조했고, 자동 수치 통과만으로 이 판정을 하지 않았다.

### E12 — 920 / r1

문제 문장·구간: Jafnvel þótt þær staðhæfingar væru réttar, að mati dómsins, félli brottnáms- og endurheimtunarskyldan ekki niður. Slökktur búnaður gat enn verið óheimill á þessum stöðum.

이유/판단: 딱딱한 합성명사와 같은 결론 반복을 실제 제거·원상회복 동사로 표현; 주민 주장 even-if 범위와 판결상 의무 유지.

실제 수정: Dómstóllinn taldi að jafnvel þótt þetta væri rétt bæri íbúanum áfram að fjarlægja búnaðinn og færa aðstöðuna í fyrra horf.

의미 보존: 확인. 정본/사실표에서 해당 조건을 대조했고, 자동 수치 통과만으로 이 판정을 하지 않았다.

### E13 — 920 / r1

문제 문장·구간: Tilboð með stæðisnúmeri einu sýnir ekki hvaða sameign framkvæmdir ná til. Teikning frá uppsetningaraðila getur merkt hleðslukassann, leið kapalsins eftir veggjum og lofti og rafmagnskassann sem á að tengjast. Þá má bera leiðina saman við eignarheimildir, reglur hússins og samþykktir sem þegar liggja fyrir.

이유/판단: MONOTONY: 세 중간 길이 설명을 실제 경로 질문·전체 공사 검토 문장·견적의 정보 한계로 재구성; 동의 절차/도면/권리자료/규약/의결을 모두 보존.

실제 수정: Hvar liggur kapallinn? Teikningin getur sýnt hleðslukassann, leiðina eftir veggjum og lofti og rafmagnskassann, svo hægt sé að bera alla framkvæmdina saman við eignarheimildir, reglur hússins og samþykktir sem liggja fyrir. Stæðisnúmer eitt sýnir ekki þessa leið.

의미 보존: 확인. 정본/사실표에서 해당 조건을 대조했고, 자동 수치 통과만으로 이 판정을 하지 않았다.

### E14 — 921 / r1

문제 문장·구간: Samningurinn gerði ráð fyrir að leikmaður keypti punkta og notaði þá síðan til að fá leikjaþjónustu eða vörur. Myntin sem stóð eftir var hins vegar ætluð í viðureignir leikmanna og gegndi hlutverki spilapeninga. Dómstóllinn taldi hana ekki lengur til ónotaðra keyptra punkta samkvæmt endurgreiðsluákvæðinu og heldur ekki til leikgjalda sem rekstraraðilinn hefði innheimt.

이유/판단: MONOTONY: 구매→교환→남은 대전 칩의 법적 분류를 서로 다른 길이의 사건 순서로 서술; 잔여 금화가 모두 소멸/소비됐다는 단정 없음.

실제 수정: Fyrst keypti leikmaðurinn punkta. Þeim mátti samkvæmt samningnum skipta fyrir þjónustu eða vörur í leiknum. Eftirstöðvarnar gegndu öðru hlutverki: þær voru spilapeningar í viðureignum leikmanna, sem dómstóllinn taldi hvorki ónotaða keypta punkta samkvæmt endurgreiðsluákvæðinu né leikgjöld innheimt af rekstraraðilanum.

의미 보존: 확인. 정본/사실표에서 해당 조건을 대조했고, 자동 수치 통과만으로 이 판정을 하지 않았다.

### E15 — 921 / r1

문제 문장·구간: Hlutverk myntarinnar skipti máli.

이유/판단: 반복적인 중요성 단언을 판결이 실제 판단한 현금교환 질문으로 교체.

실제 수정: Var hægt að fá spilapeningana greidda í reiðufé?

의미 보존: 확인. 정본/사실표에서 해당 조건을 대조했고, 자동 수치 통과만으로 이 판정을 하지 않았다.

### E16 — 921 / r1

문제 문장·구간: Rekstraraðili skal endurgreiða ónotaða keypta punkta eða ónotaðan hluta gjalda sem greidd hafa verið fyrir leikinn, að frádregnum nauðsynlegum kostnaði. Fresturinn er 30 dagar frá lokum samnings, nema báðir aðilar semji um aðra tilhögun.

이유/판단: 기간을 의무 문장에 연결해 30일의 기산이 계약 종료임을 한 문장으로 명료화; 두 환불 대상 모두 미사용, 필요비용, 쌍방 합의 대체 방식 보존. 다음 문단 짧은 비용 문장으로 연결.

실제 수정: Rekstraraðili skal innan 30 daga frá lokum samnings endurgreiða ónotaða keypta punkta eða ónotaðan hluta gjalda sem greidd hafa verið fyrir leikinn, að frádregnum nauðsynlegum kostnaði, nema báðir aðilar semji um aðra tilhögun.

의미 보존: 확인. 정본/사실표에서 해당 조건을 대조했고, 자동 수치 통과만으로 이 판정을 하지 않았다.

### E17 — 921 / r1

문제 문장·구간: Rekstraraðila ber að varðveita einstaklingsbundinn leikferil í að minnsta kosti 30 daga.

이유/판단: 제9점이 보존/제공 규정임을 해당 의무 바로 앞에 명시.

실제 수정: Samkvæmt 9. lið ber rekstraraðila að varðveita einstaklingsbundinn leikferil í að minnsta kosti 30 daga.

의미 보존: 확인. 정본/사실표에서 해당 조건을 대조했고, 자동 수치 통과만으로 이 판정을 하지 않았다.

### E18 — 921 / r1

문제 문장·구간: þetta er skýrt í 9. lið skylduákvæða og 6. lið bannaðra skilmála.

이유/판단: 사업자 자료만 기준으로 하는 약정 금지의 직접 근거를 금지사항 제6점으로 한정; 제9점은 해당 보존 문장으로 이동하여 정확한 연결 유지.

실제 수정: þetta er skýrt í 6. lið bannaðra skilmála.

의미 보존: 확인. 정본/사실표에서 해당 조건을 대조했고, 자동 수치 통과만으로 이 판정을 하지 않았다.

### E19 — 916 / r2

문제 문장·구간: sem einu lagastoð dómsins

이유/판단: lagastoð 앞 eina의 목적격 여성형 문법 교정. 유일 역사적 근거로 제시하지 않는 한정 불변.

실제 수정: sem eina lagastoð dómsins

의미 보존: 확인. 정본/사실표에서 해당 조건을 대조했고, 자동 수치 통과만으로 이 판정을 하지 않았다.

### E20 — 919 / r2

문제 문장·구간: Starfsmaðurinn fékk ekki lögmæta og fullnægjandi tilkynningu um að tjá sig. Í skýrslunni sem refsingin studdist við fór mat á því hvort einelti hefði verið sannað ekki saman við tillöguna um viðurlög. Síðara færi til að svara við stjórnsýslukæru bætti ekki úr skortinum á andmælarétti á fyrra stigi, að mati dómsins.

이유/판단: MONOTONY: 11/21/19단어 비슷한 설명을 처분 이전 절차·기초 보고서의 모순을 잇는 한 문장과 사후 불복에서 치유되지 않은 결과로 재구성; 적법·충분한 진술 통지, 사실인정/징계제안 모순, 후속 진술 기회 불치유 보존.

실제 수정: Starfsmaðurinn hafði ekki fengið lögmæta og fullnægjandi boðun til andmæla áður en ákveðin var refsing sem studdist við skýrslu þar sem mat á sönnun eineltis og tillaga um viðurlög fóru ekki saman. Færi til andmæla við síðari stjórnsýslukæru bætti ekki úr því.

의미 보존: 확인. 정본/사실표에서 해당 조건을 대조했고, 자동 수치 통과만으로 이 판정을 하지 않았다.

### E21 — 919 / r3

문제 문장·구간: Dómstóllinn benti á annmarka á málsmeðferð, færi til andmæla og ákvörðun atvika og felldi úr gildi bæði brottvikninguna og ákvörðun stjórnsýslukærunnar.

이유/판단: FAQ1의 ákvörðun atvika 직역 명사구를 mat á málsatvikum(사실평가)으로, 어색한 andmæla 목적 관계를 충분한 진술기회 결여로 자연화. 절차·사실평가·방어권 문제와 원처분/복심 모두 취소라는 범위 유지.

실제 수정: Dómstóllinn benti á annmarka á málsmeðferð og mati á málsatvikum, auk ónógs færis til andmæla, og felldi úr gildi bæði brottvikninguna og ákvörðun stjórnsýslukærunnar.

의미 보존: 확인. 정본/사실표에서 해당 조건을 대조했고, 자동 수치 통과만으로 이 판정을 하지 않았다.

### E22 — 921 / r4

문제 문장·구간: title: "243.548 dalir krafðir fyrir leikmynt: hvers vegna endurgreiðslan fékkst ekki"

이유/판단: 제목에 청구액 통화를 taívanskir dalir로 명시. 본문 NT$243,548과 같으며 지급·인용액으로 바꾸지 않음.

실제 수정: title: "243.548 taívanskir dalir krafðir fyrir leikmynt: hvers vegna endurgreiðslan fékkst ekki"

의미 보존: 확인. 정본/사실표에서 해당 조건을 대조했고, 자동 수치 통과만으로 이 판정을 하지 않았다.

## 한계와 다음 상태

저자 자기검수로 현재 남은 필수 의미 오류를 발견하지 못했지만, 독립 검수 전 상태다. 이번 작업에서 사람 아이슬란드어 원어민이나 대만 변호사의 감수를 받지 않았다. 특히 agapunktar/兩大過 등 타 법제 용어는 원문의 한 차례 처분 맥락을 설명한 표현으로, 아이슬란드 제도의 공인 대응어라는 주장이 아니다.

실제 브라우저 렌더링,색인,공개 URL 응답,게시 여부는 여기서 검증하지 않았다. 파일은 B8에만 있고 R복사/commit/push/배포/외부전송을 하지 않았다. 독립검수자는 현재 manifest의 SHA를 기준으로 본문·FAQ·표·법률 범위와 자연스러움을 검토할 수 있다. 새 지적이 오면 동결 증거를 보존하고 실제 영향분만 수정·검증한다.

저자 기록 생성 UTC: 2026-10-26T07:35:57.096044+00:00
