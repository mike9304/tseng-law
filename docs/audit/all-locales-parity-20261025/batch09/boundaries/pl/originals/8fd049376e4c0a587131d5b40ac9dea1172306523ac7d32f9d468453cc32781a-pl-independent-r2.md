# PL6 Kimi R2 인수·독립 의미/문체 검수

2026-10-26 KST. 검수자 column_existing_drafts. 대상은 Kimi 실제 R2 출력에서 인수한 915/916/918/919/920/921 여섯 원고다. 원고 수정은 R2 출력과의 정확한 바이트 복사만 했고, 아래 교정안은 적용하지 않았다. 판정은 필수 M01–M03 수정 필요, 선택 S01–S06, 검사기 경계 T01 별도 미종결이다. 실제 CLI의 FAIL 0과 구조 errors 0을 의미·문체 최종 승인으로 부르지 않는다.

## 인수와 변경 증거

- Root가 exec session 17293의 실제 종료 코드 0을 회수했다고 전달했다. 이는 root의 실행 관찰을 인용한 것으로, 검수자가 새 Kimi 실행을 한 기록이 아니다. 새 출력이 0이었다는 전달은 stdout/stderr 파일 전체가 비었다는 뜻이 아니다. 실제 두 로그 파일을 해시와 크기로 보존했다.
- `kimi-pl/r2-intake-manifest.json` SHA `ee23ce6892ccd179f20721f68d15e1c0bda0015d9aa40b4482d8a9f24b02a902`. 기존 입력14개와 TASK-R2/공유 피드백2개, 총16개가 기록된 SHA와 일치한다. 원래 `author-review.md`도 불변이다.
- 기존 원고6·저자·입력/실행 기록·초기 검사 결과를 `kimi-pl/r2-initial-snapshot/`에 먼저 보존했다. 실제 출력9개와 그 안의 initial-preserved 원고6개, 합계15파일을 `kimi-pl/raw-output-r2/`에 인수했다. 23개 수정 작업 중 916의 replace_all이9곳이므로 실제 문자열 치환은31곳이다. 정방향/역방향 복원은6/6 정확히 일치한다.
- 원래 915/916/920/921 CV 실패는 지우지 않았다. 잘못 적힌 nb profile provenance와 sourceMap nb 키 문제도 `pl-profile-provenance-correction.json`, `pl-audit-provenance-correction.json`, `pl-content-audit-initial-corrected-map.json`으로 남아 있다. 이번 검사는 수정된 두 스크립트와 정확한 pl profile·EN2/ZH4 정본 별칭을 사용했다.
- Kimi R2 저자 보고서 전문을 읽었다. “FAQ nie zmieniono”는 바이트 불변 주장으로 받아들이지 않는다. FAQ 수/주제는 유지됐지만 916 FAQ1의 질문·답변과 FAQ2 질문의 철자가 바뀌었다. 그 보고서의 “title까지 교정” 주장과 달리 대문자 `Skazenie`는 남았다(M02). R2 저자 기록의 `dwóch surowych nagany`는 보고서 자체의 격 오기이고, 원고는 `nagan`이다. 원본 보고서를 고쳐 덮지 않았다.

## 읽은 범위와 한계

현재 정본6의 메타·본문·FAQ·출처 전문을 이 연속 작업에서 읽은 동일 SHA로 재사용했다. 이번 PL 대조에서 EN916·ZH921, 사실표·계약은 다시 전문으로 읽었다. 연구 source-register/source-freeze/bundle도 실제 읽은 동일 버전이다. 파일별 전체 SHA와 읽기 범위는 `checks/pl-independent-inputs.json`의22참조에 있다.

최근 실제 R의 PL941/940/706을 메타부터 끝까지 새로 읽었다. 세 편은 각각 제품손해·수입자/회수, 이메일 계좌변경/지급, ARC 변경/재입국이며, 신규 사건6편과 범위가 다르다. 새 글에 그 글의 폴란드 국민·기업 전제를 그대로 옮길 필요가 없고, 실제 신규 글에도 일반 독자의 국적/폴란드어 법률상담 보장은 없다.

R EDITORIAL-VOICE, COLUMN-VOICE-RULE, SENTENCE-VARIETY, 17:05 최신 LESSONS(`86710ef330b108a916a7bb92a75f1ffa62dea53412e8a75f38472d9fa9b33130`) 전문과 B7/B8/B9 계약을 적용했다. 홈의 `agent-library/knowledge/editorial-voice.md`는 현재 없으므로 읽었다고 주장하지 않는다. 최신 내부 LESSONS나 독립검수 전문은 Kimi에 전송하지 않았다.

이 검수에서 원 판결 PDF416쪽 전체나 새로운 법원 웹 회신을 읽었다고 주장하지 않는다. 정본/공식 연구가 제공한 설명과 지정 페이지 범위를 대조했으며, 실제 공식 회신 재사용과 일부 재접속 실패는 연구의 범위대로 유지한다. Kimi도 제공받은 칼럼을 읽었을 뿐 새로운 원 PDF/웹 조회를 하지 않았다고 구분했다. 이미지 자체를 새로 열지 않았으며 alt는 root가 제공한 이미지 관찰과 비교했다. 인간 원어민·변호사 승인, 앱 렌더링 또는 공개 게시 검증이 아니다.

## 필수 수정

### M01 — 918 본문 가상 장면의 표지와 실제 사건 연결

문장(26행): `Na biurku w nowym domu leżą pismo o kredycie, gładka koperta i dokumenty odbioru; obok stoi jeszcze jeden nieotwarty karton. W tajwańskim sporze żaden z tych elementów nie wystarczył sam do ustalenia dnia wydania.`

이유: 책상·민무늬 봉투·닫힌 박스는 이미지 관찰을 확장한 장면이며 판결 사실로 확인되지 않았다. 본문 가상 표시가 없고, 바로 다음 `żaden z tych elementów`가 박스까지 실제 소송에서 평가한 증거인 것처럼 연결한다. 이미지의 `Scena fikcyjna` 캡션은 본문 장면의 표지를 대신하지 않는다.

최소 수정안: 첫 문장 끝을 `... jeden nieotwarty karton (scena fikcyjna).`로 표시하고, 둘째 문장을 `W opisanym poniżej tajwańskim sporze datę wydania ustalano na podstawie treści pism i rzeczywistego stanu lokalu.`로 바꾼다. 이어지는 실제 대출서신·물/전기·출입허용 설명과 공식 링크는 유지한다. 원하면 가상 두 문장을 삭제하고 검증된 서신 사실로 곧바로 시작하는 것도 가능하지만, 표지+연결문 최소 수정이면 충분하다.

의미 보존: 사실표918-C2/C3의 문서 내용·주택 상태 판단을 보존한다. 가상 물건을 판결 증거에서 분리하며 새로운 사실·의무를 만들지 않는다.

### M02 — 916 제목의 미교정 철자

문장(2행): `title: "Skazenie fabryki na Tajwanie: wiedza i kontrola spółek dominujących"`.

이유: R2의 소문자 replace_all은 대문자 제목을 놓쳤다. 본문·SEO의 `skażenie`와 같은 폴란드어 철자를 써야 하며, root의 명시적 R2 교정 과제가 완전히 닫히지 않았다.

수정안: `Skazenie` → `Skażenie` 한 곳. 의미 보존: 오염이라는 같은 주제이며 법률 명제와 수치는 불변이다. 초기/R2 저자 기록은 보존하고 다음 기록에 이 누락과 실제 수정 사실을 남긴다.

### M03 — 920 위반을 의무 자체로 서술한 법적 술어

문장(38행): `Naruszenie art. 11 i regulaminu sąd zakwalifikował jako obowiązek przestrzegania innych przepisów lub regulaminu z [art. 6 ust. 1 pkt 5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0070118&flno=6).`

이유: 현재 문장은 법원이 “제11조·규약 위반을 준수 의무로 분류했다”는 관계다. 사실표920-L2/C의 관계는 그러한 설치가 다른 법령·규약을 준수할 의무의 불이행에 해당한다는 것이다. 뒤 문장의 불이행 설명으로 독자가 추론할 수 있어도 법적 주어·술어 자체를 바로잡아야 한다.

수정안: `Naruszenie art. 11 i regulaminu sąd uznał za niewykonanie obowiązku przestrzegania innych przepisów lub regulaminu z [art. 6 ust. 1 pkt 5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0070118&flno=6).`

의미 보존: 위반→준수 의무의 불이행으로 연결하며, 뒤의 정식 서신·조율 시도 AND 계속된 불이행→제6조3항 법원 구제 가능을 그대로 유지한다. 전국 일률 철거 의무나 새로운 자동제재를 추가하지 않는다.

## 선택 개선

S01 — 919 격과 중복. 첫 문장 `po nałożeniu dwóch surowych nagan nałożonych jednorazowo`는 부과 동사가 반복된다. `Zwolnienie kierownika po jednorazowym nałożeniu dwóch surowych nagan zostało uchylone razem z decyzją po ponownym rozpatrzeniu.`가 간결하다. “한 사건”이 아닌 “한 차례 부과”와 두 처분 취소를 보존한다. FAQ1의 `wady obrad, braku odpowiedniej możliwości przedstawienia stanowiska i ustaleń faktycznych`는 명사 병렬의 격이 어긋난다. `wady obrad, brak odpowiedniej możliwości przedstawienia stanowiska i błędy w ustaleniach faktycznych`로 고치면 같은 세 하자가 직접 드러난다. 법적 결론을 바꾸는 수정은 아니다.

S02 — 919 조율 용어 정밀화. `dochodzenia lub mediacji` 및 `można podjąć mediację`는 일상적인 분쟁 조율의 뜻으로 읽을 수 있고, 뒤에서 조사 must/조율 may/실패시 조사계속 must가 정확하므로 곧바로 법률 필수 오류로 판정하지 않았다. 다만 사실표의 協調를 정식 중재자/법정 조정 절차로 좁히지 않으려면 첫 설명은 `... wymaga, by dochodzenie oraz ewentualne próby uzgodnienia rozwiązania ze stronami prowadzono obiektywnie, bezstronnie i rzetelnie.`로, 선택 경로는 `Zgodnie z wolą skarżącego pracodawca może podjąć ze stronami próbę uzgodnienia rozwiązania sprawy.`로 명확히 할 수 있다. 후속 조사계속 의무 문장은 유지한다.

S03 — 920 독립검수 지시가 본문에 남은 표현. `Sąd neutralnie stwierdził, że ta sprawa nie należała do sytuacji objętej tym punktem; nie trzeba przypisywać nikomu dodatkowego stanowiska, którego orzeczenie nie podaje.`는 독자에게 판결을 서술하는 법을 가르친다. `Sąd stwierdził, że ta sprawa nie należała do sytuacji objętej tym punktem.`로 직접 서술해도 귀속 없는 비적용 판단을 온전히 보존한다. 첫 문단의 `własnym licznikiem`을 `licznikiem używanym przez mieszkańca`로 하면 이용과 소유를 더 명확히 분리한다. 현 본문은 이미 미터 소유권을 판단하지 않았다고 밝혀, 이 단어만으로 새 소유권 판결을 단정한 필수 오류로 보지는 않는다.

S04 — 921 최소 보존기간과 연결된 장문. 현재43단위 문장은 `co najmniej przez 30 dni`를 보존하므로 법정 상한을 명시한 오류가 아니다. 다만 `dlatego przy ograniczonym okresie przechowywania danych`까지 한 문장에 붙여 최소·조회 응답·실무 조언을 무겁게 연결한다. 수정안: `Przedsiębiorca musi przechowywać osobistą historię gry co najmniej przez 30 dni, a po otrzymaniu żądania udostępnić ją w ciągu siedmiu dni. Trzydzieści dni to ustawowe minimum. Wczesny wniosek może pomóc uzyskać dane, których końcowy zrzut salda nie pokazuje.` 최소30일, 신청 접수 후7일, 조기조회 조언을 보존한다.

S05 — MONOTONY: 920 도입 장문 연속 — `Ponieważ mieszkaniec zamontował ...`37단위 다음에 `Oddział Tajwańskiego Sądu Wysokiego ...`43단위 — 앞 문단의 배선 설명과 판결 결과를 순서대로 읽을 때 접속어 누적이 무겁다. 문단 경계와 뒤10단위 문장이 있어 이 한 지적만으로 전체 필수 문체 반려를 만들지는 않았다. 첫 문단은 사실/출처 문장 다음에 `Spór wykraczał poza samo miejsce parkingowe.`라는 구체 결론으로 나눌 수 있다. 또는 두 번째 장문에서 판결 결과와 그 이유를 분리하되, 날짜·사건번호·철거/복구·공용부분·동의부재를 모두 유지한다. 임의 세미콜론·의미 없는 단문 추가는 제안하지 않는다.

S06 — 916 추상적 반복과 문법. `Nierozwiązane pytania powinny pozostać oznaczone jako nierozwiązane.` → `W raporcie warto oznaczyć pytania, które nadal wymagają wyjaśnienia.`로 실제 기록 행위를 쓸 수 있다. 근거를 덧붙이는 법정 작성 의무가 아닌 실무 조언이다. 끝 고지의 `nie przedstawia historii każdej powiązanej sprawy ani ocenia odpowiedzialności konkretnego inwestora`는 `... ani nie ocenia odpowiedzialności konkretnego inwestora`로 동사를 맞출 수 있다. 원문의 사건 범위 제한은 그대로다.

## T01 — 실제 검사와 문장 경계의 한계

정확한 현재6파일에 corrected wrapper로 shared `--lang pl`을 직접 실행했다. 전체 exit0/FAIL0이며 CV/추출수는 다음과 같다.

| ID | CV | 실제 도구 분절수 | 짧은 문장 비율 | 질문수 |
|---|---:|---:|---:|---:|
|915|0.465|37|0.108|1|
|916|0.526|36|0.167|1|
|918|0.453|43|0.256|1|
|919|0.460|41|0.244|0|
|920|0.550|38|0.132|1|
|921|0.582|41|0.220|1|

236개 실제 배열 전부, 소제목 및 표를 읽었다. 다만 그236은 다음 거짓 경계2개를 포함하므로 “정상 문장236개”로 쓰지 않는다.

- 915 p2: `Podmiot zamawiający wystąpił o uchylenie wyroku, a 12 lipca 2017 r.` / `Sąd Najwyższy oddalił ...`로 분리됐다. 문중 날짜 뒤의 대문자 기관명이다.
- 918 p10: `W sierpniu 2025 r.` / `Rada Ochrony Konsumentów opublikowała wyniki kontroli umów.`로 분리됐다. 첫 조각은 독립 문장이 아니다.

원문·실배열·4도구SHA는 `checks/pl-independent-boundary-issues-r2.json`에 저장했고 root가 PL 전용 격리 후보 진단을 맡았다. 날짜와 정상 구두점을 점수 때문에 바꾸지 않는다. 표의 수치는 실제 구버전 관찰을 보존하는 것이며, 경계 보완 후 영향편 실측이 필요하다. 그 외 `art.`, `ust.`, `pkt`, `85-1`, `22-2`, 사건번호, 날짜/금액, 링크 제거 뒤 문장은 읽은 범위에서 의미를 잃는 분리를 찾지 않았다. 기계상 본문 contrast0/1/0/0/0/2는 모든 폴란드어 반박 틀을 잡는다는 보장이 없어 실제 문장도 따로 읽었다.

## 법률·FAQ 대조 결과

| 원고 | 대조한 구체 조건과 판정 |
|---|---|
|915|기관이 취소소송, 시공사가 상고, 44,417,150NTD는 취소된 중재판정액, 최고법원106台上723·2017-07-12·해당 취소사건 확정. 금전→공기연장→권고/부동의→금전의 표 순서, 구체 청구에 관한 권고 또는 안+기관 부동의로 조정실패, 공사 또는 기술서비스, 별도 합의, 현행40(1)(2)의 부존재 요약 모두 보존. FAQ의 `dla robót... i usług...`는 두 범주를 열거하고 본문 `lub`가 분명해 동시충족으로 확대하지 않았다. ITA는 미국 공급자의 대만 조달 전망이며 미국 국내 사업이나 폴란드 업체 자격으로 바뀌지 않았다.|
|916|2018-08-16·107台上267의 인지·지배·미고지/미개선·회피 목적 자산이전,246관련부분 파기환송·262관련 상고기각, 전체 소송과 개별 부분의 범위, 현행154의 남용→특정채무·현저한 변제곤란 AND 중대성/책임필요성 보존. 상고를 제기한 주체를262명으로 한정하지 않는다. 현행154를 과거 사건의 유일한 이유로 쓰지 않고 USTR 미국 민간파트너·적용법·의향·가능성도 유지한다. FAQ3개 의미는 모두 맞고 철자 보완은 M02와 별도다.|
|918|2022-02-09·109上易289의 본안 불인용, 추가청구 불인용, 상소불가 보존.2019-02-23대출서신·당시미연결·7월미완성설치·8월청소/수선출입·11월5대출/28보증서인도 구분.4개월계약과6개월현행은 통지기간이며 현행 기산을 사용허가 취득으로 명시. 지급/서류 협조의무,2025불리한 기간제외조항,2026-09-18CBC 비소급 보존. 과거4개월 기산도 FAQ2 질문의 허가 후 문맥과 사실표로 대조했고 새 일반납부중지권은 없다. 도입의 가상/사실 혼합만 M01이다.|
|919|일회 부과2대과, 공무원 원처분·복심결정 모두 취소,2026-09-03·114訴869·상소가능·실제복직미확인. 선발표/상급선심의/청취결함/보고서모순/후속복심치유불가 보존. 민간법2026-07-01시행은 역사사건과 구별. 신고 후 조치·필요에 따른 지원/보호·조사 must, 신고자 의사에 따른 조율 may, 실패시 계속 must. S01/S02가 표현을 개선하나 현재 명제를 반대로 만들지는 않는다. FAQ의 보호 병행/공무원 절차의 직접이식 불가도 보존.|
|920|2022-06-22·111上132 본안 항소불인용·철거/복구, 후속 확정미확인. 공용벽/천장/함,11조회의와 사건규약15조위원회 AND 전력사검사 구별.6(1)(5) 준수 의무의 관계는 M03 교정 필요하며 조율 후 계속불이행→6(3) 가능이라는 다음 문맥은 맞다.6(1)(4)비적용 귀속은 특정 당사자에게 만들지 않음. 중지/잠금/열쇠는 설령 사실이어도라는 조건,5월보조=공용선로트레이/9월30경과/설치동의별도 모두 본문FAQ에 유지.|
|921|2021-09-13·109消簡上1·상소불가,243,548NTD청구와 무인용 구별. 남은 금화의 칩 기능을 전량소진으로 바꾸지 않음. 본인종료의사와 업체전체제재 적법성 구별.2023시행본을2021준거로 소급하지 않음. 제18점 언제든종료/미사용포인트 OR 미사용게임비용/필요비용/종료후30일 OR 양측합의, 제4점 개시후7일서면의 별도경로, 최소30보존/신청접수후7일제공, 사업자자료만 제한금지,2025첫신고2위·건수감소 보존.7일조항에서 사실표의 무이유·무비용 세부를 추가하지 않았지만 정확한 ZH정본 요약과 같아 이를 새로운 필수 누락으로 만들지 않았다.17FAQ 중 해당3개도 같은 범위다.|

## §5 실제 문체·구조 판단

1. 실제 CLI는 위 표처럼0이지만 T01 때문에 경계 최종승인 보류. 구조 EN2/ZH4 automatic errors0, 의미 REVIEW_REQUIRED와 분리한다. 독립 메타검사도 errors0/FAQ17/공식URL23(4/3/4/4/4/4)이며 모든 인라인 공식URL은 끝 목록에 있다.
2. 도입은915금액,916구체 사실,918장면,919결과,920독자질문,921청구사실이다. 사실/결과3/6, 장면1/6. 상투적 가정 도입은 없지만918가상표시 M01 미해결이다.
3. 아주 짧은 실제 문장은 모든 편에2개 이상 있다. T01의 허위 단문을 근거로 삼지 않아도915의 `Przyczyna niepowodzenia ma zatem znaczenie.`/`Kwalifikacja kontraktu pozostaje odrębnym pytaniem.` 등이 남는다.920장문 연속과921장문 연결은 S04/S05로 기록했다.
4. 문단 첫말을 세로로 읽었다. 공유의 top_opener 한도 위반은 없고, 구체 주어·법규·시간·질문을 번갈아 쓴다. 기계 결과를 대신해 어미·접속어도 읽었다.
5. 세 문단 연속 주장→인용→다만 틀은 보이지 않는다.915의 절차 표,916의 자료연결,918의 문서상태,919의 청취,920의 경로,921의 계정이력 등 출처 인용 없는 설명도 있다.
6. 조건·오해 방지의 부정문은 필요한 범위를 보존한다.920의 검수자 지시문은 S03,916의 동어반복은 S06,921의 최소보존 설명은 S04로 구체 제안했다. 길이를 늘리기 위한 법률조건 삭제는 제안하지 않았다.
7. 실제 마지막 실질문단을 고지와 출처 목록 직전에서 평가했다.915신청·변경·답변 연속,916원조사/결정/이전승인,918대출/검사/인도서신의 날짜,919청취·증거평가,920동의된경로/공사비,921입금/사용기록으로 끝난다. 같은 판촉 결론 복사는 없다.920마지막의 대조가 다소 훈계형이지만 특정 설치비 위험에 연결돼 필수로 확대하지 않았다.
8. 표준 폴란드어 문어이며 폴란드 국적·현지법·폴란드어 상담 자격을 새로 전제하지 않는다. M02/S01/S06의 국소 문법·철자를 별도로 적었다. 본문H1/굵은 강조/인간 저자·감수 주장·꾸민1인칭은 없다.919질문0은 소제목 질문과 별도 계산했고, 시간순서와 청취·조사 논리가 답을 구성하므로 자동반려 사유로 만들지 않았다.
9. 실제 R2 전후 숫자·공식URL 순서는 불변이다. 메타 바뀜은916 SEO/summary/FAQ 철자와921summary 내용뿐.17FAQ의 주제/수, 날짜26일, 자기locale, 내부author, 이미지와caption은 보존됐다. R2의 FAQ 철자 변화는 원 보고서 불변 주장과 구분했다.

## 현재 고정 SHA

| ID | SHA-256 |
|---|---|
|915|a11bd9f70669e74cd046d77364a82468f4a191bb6112922f2208c6d5c68b2791|
|916|26a51d48c0db0e4e1a4eb7ac421ddc61f3f6ba7108bdf709aafa6c6ecf236da7|
|918|5a96879936dc4fa4e61226afd0cacd0b089177044945f8cc85cf996bf374c567|
|919|effc9883d2591a5ecd11ed8764279e7d815575db49bbd9dec0faeb56f81b62e7|
|920|452cb645981a3c790542f9c219c65eea879bf3d1ba584bd2f22f3edcb1aaf2da|
|921|bdebbbdd5368437bd80c9630f8b5ca3abd9272dec4c2757e0c3ea739dcd61fae|

이 보고서와 실제 인수/CLI/구조/경계/입력 증거는 `checks/pl-independent-final-manifest-r2.json`으로 묶는다. M01–M03 수정 및 root 담당 T01의 설치·영향 검사 뒤 변경 부분을 다시 대조할 수 있다. 새 Kimi 실행이나 원고 자체 교정은 이 검수에서 하지 않았다.
