# PL6 Kimi R3 독립 표적 검수 — 의미 지적 종료, 경계 도구 후속 확인 대기

2026-10-26. R2 정식 보고서 `pl-independent-r2.md`의 필수 M01–M03과 선택 S01–S06을 실제 R3 변경·정본·문맥으로 대조했다. 세 필수와 여섯 선택은 해소됐다. 새로운 필수 의미 오류는 이 표적 검수 범위에서 발견하지 않았다. 다만 기존 공유 PL 검사기의 `r.` 날짜 약어 분리 두 건은 그대로여서 현재 기계 FAIL 0을 정상 경계의 최종 통과라고 부르지 않는다. 검토한 정상 배열 237문장은 별도 SHA 결속 자료로 제공했으며, 설치될 도구의 실제 검사는 후속 기록으로 남긴다.

## 실제 인수와 보존

Root가 Kimi 실행 session45445의 실제 exit0를 회수했다고 전달했다. 검수자는 새 Kimi 실행을 하지 않았으며 `r3-run-start.json`과 실제 stdout/stderr 파일의 크기·SHA를 보존했다. 최신 내부 LESSONS나 전체 독립 보고서를 외부 모델에 보내지 않았다.

승인된 입력은 최초14개+R2 작업지시/피드백2개+R3 지시1개, 합17개다. 현재 파일의 SHA가 승인 manifest와 모두 일치했다. 원 `author-review.md`, `author-review-r2.md`, `edits-r2.json`, `initial-preserved/`의6원고도 불변이다. 현재 R2 원고는 새 `kimi-pl/r3-r2-snapshot/`에 먼저 보존했다. Kimi의 자체 `r2-preserved/`6개도 독립 R2 동결 SHA와 일치했다.

R3 `edits-r3.json`의 실제12치환은 R2→R3 전체 차이를 정확히 설명한다. 각 old/new는 해당 단계에 한 번씩 존재하고 순방향 적용6/6, 역순 역치환6/6에서 바이트까지 일치했다. 915는 무수정이며 다른5편만 바뀌었다. `kimi-pl/raw-output-r3/`에 실제 출력23파일(현재6, 보고서/치환5, 보존원고12)을 보관하고 현재 원고6을 그대로 복사했다. 숫자와 공식URL 순서는6/6 그대로다.

로컬 인수 스크립트 첫 실행은 마지막 사후 guard에서 의도적으로 변경한 대상920에도 R2 SHA 불변을 요구해 exit1했다. 그 시점에는 사전검증·보존·정확복사가 완료돼 있었다. 오류를 숨기거나 원고를 되돌리지 않고 `pl-intake-r3-attempt-error.json`에 남겼다. 별도 완료 절차에서 원R2 사본·현R3·모든 보호기록·전체 정역복원을 다시 검증했고, 변동을 허용한6대상 외의 기존 참조는 그대로인지 확인했다. 인수 manifest SHA는 `b15c6b2568a6af7c86f8f1f9c9ae6850252e18db1d140720bc691d90dea96ae7`이다.

새 `author-review-r3.md`는 전문 읽었다. 작성자는 R2가 제목의 대문자 `Skazenie`를 놓쳤고 FAQ에서도 실제 철자가 바뀌었다는 점을 바로잡았다. 이번 R3의919 FAQ1 수정도 인정한다. 과거 부정확한 보고서는 고치지 않고 이력을 보존했으므로 현재 결과와 최초 자기주장을 구별할 수 있다. 새 PDF 전문·네트워크 검증을 하지 않았다는 한계도 유지했다.

## 지적별 실제 변경과 의미 보존

| 지적 | 문제와 실제 R3 문장 | 종료 판단·보존 범위 |
|---|---|---|
|M01 ·918|가상 책상·봉투·상자가 사건 증거로 이어지던 도입을 `... nieotwarty karton (scena fikcyjna).`와 `W opisanym poniżej tajwańskim sporze datę wydania ustalano na podstawie treści pism i rzeczywistego stanu lokalu.`로 고쳤다.|해소. 가상 장면과 사건 사실을 분리했다. 뒤의 대출 서신·당시수도/전기·수선/청소 출입·인도판단 및 판결집URL/페이지는 그대로다. 새 장면을 증거로 만들지 않는다.|
|M02 ·916|제목 `Skazenie...`→`Skażenie...`.|해소. 대문자로 시작한 잔존 철자를 실제 고쳤다. 제목의 법적 주장·국가·회사 범위는 그대로이며 이전 보고서의 불완전한 주장은 R3에서 명시 정정했다.|
|M03 ·920|`... zakwalifikował jako obowiązek...`→`Naruszenie art. 11 i regulaminu sąd uznał za niewykonanie obowiązku przestrzegania innych przepisów lub regulaminu z [art. 6 ust. 1 pkt 5]...`.|해소. 위반을 의무 그 자체라고 하던 술어를 의무불이행으로 바로잡았다. 뒤의 정식통지/조율과 계속불이행→6(3) 법원구제 가능, 동일공식URL을 유지한다.|
|S01 ·919|첫 문장 `po jednorazowym nałożeniu dwóch surowych nagan`; FAQ1 `wady obrad, brak odpowiedniej możliwości przedstawienia stanowiska i błędy w ustaleniach faktycznych`.|해소. 중복과 격 불일치를 고쳤다. 일회부과를 underlying사건1개나점수로 바꾸지 않았고 원처분/복심결정 취소·상소가능·괴롭힘전부부존재 아님을 유지했다.|
|S02 ·919|`dochodzenie oraz ewentualne próby uzgodnienia rozwiązania ze stronami`와 `Zgodnie z wolą skarżącego pracodawca może...`.|해소. 協調를 반드시 정식중재자로 하는절차로 좁히지 않는다. 실시되는 조사/조율의 객관성·공정성 기준은 must, 신고자 의사에 따른 시도는 may, 불성립후 조사는 must를 구분했다. 당사자진술/방어·이해충돌·보호/지원도 그대로다.|
|S03 ·920|`Sąd stwierdził, że ta sprawa nie należała do sytuacji objętej tym punktem.` 및 `licznikiem używanym przez mieszkańca`.|해소. 내부집필지시를 없애고 법원의6(1)(4) 비적용 판단만 남겼다. 특정당사자의 미확인 발언이나 계량기소유권 판단을 만들지 않았다.|
|S04 ·921|`Przedsiębiorca musi... co najmniej przez 30 dni, a po otrzymaniu żądania... w ciągu siedmiu dni. Trzydzieści dni to ustawowe minimum. Wczesny wniosek może pomóc...`.|해소. 최소보존30일·신청접수후7일제공과 조언의 가능성을 분리했다. 30일을 상한으로 만들거나 조기신청의 성공을 보장하지 않는다.|
|S05 ·920|설치사실 문장 뒤 `Spór wykraczał poza samo miejsce parkingowe.`를 독립문장으로 썼다.|해소. 실제 경로·공용벽/천장/함·계량기사용·공식URL은 보존하면서 37→43단어 장문연속을 28→6→43으로 바꿨다. 소송결과/날짜/사건번호/철거복구/동의결여도 그대로다.|
|S06 ·916|`W raporcie warto oznaczyć pytania, które nadal wymagają wyjaśnienia.` 및 `... ani nie ocenia odpowiedzialności konkretnego inwestora.`.|해소. 동어반복을 실무조언으로 명료화하고 부정문의 문법을 고쳤다. 법정 보관의무를 새로 만들지 않으며 본문154조누적요건·인지/지배/미개선·자산이전·246/262결과·미국투자맥락은 불변이다.|

`meaning_preserved`는 오류가 있는 R2 표현의 글자 뜻을 고집한다는 의미가 아니라, 지정 정본과 사건·현재법의 정확한 관계를 유지하거나 복원했다는 의미다. 변경10문단을 앞뒤 문맥과 함께 읽었고, 공식URL/기산/수치/FAQ의 불변 부분은 R2 전체검수와 정확한 차이 검증으로 연결했다.

## 문체·§5·실제 경계

실제 공유 PL CLI는 R3 6편 exit0이며 CV는915 .465,916 .522,918 .454,919 .463,920 .545,921 .546이다. 추출수는37/36/43/41/39/43, 합239다. `checks/pl-variety-kimi-r3-provisional.json`에 실제 명령·stdout·stderr·6SHA·정확PL프로필hash·전체배열이 있다. 이 결과는 두 거짓분리를 포함한 잠정 측정이다.

R2에서는236개 추출 전체를 실제 읽었다. 현재 R3는 그중224개가 순서와 글자 모두 동일하고, 나머지15개 새/교체분절 및 그 문맥10문단을 모두 다시 읽었다. `pl-independent-r3-boundary-delta.json`에 old/new 배열이 있다. 바뀐919 FAQ1도 원문과 다시 대조했다. 메타/FAQ 검사는16개 FAQ 불변,919 FAQ1의문법수정1개,916제목철자1개만의 실제 변화임을 확인했다. 현재구조6/errors0·메타errors0·FAQ17·편별고유공식URL합23이다.

MONOTONY: 920 장문연속 — 첫 긴 설치사실 뒤43단어결과 — 실제6단어범위결론을 넣어 호흡을 분리했다. 921 과밀문장 — 최소보존/제공기한/실무조언43단어 한문장 —21/5/12로 기능을 나누고 법적 조건은 전부 남겼다. 916 미해결질문의 동어반복은 실제후속확인으로 바뀌었다. 의미없는 짧은문장 삭제나 점수만을 위한 날짜표기 변경은 없다.

첫머리 유형과 문단 첫말은 R2에서 확인한 구조를 유지한다.918의 유일한 본문가상장면은 이제 명시돼 있다.919의 질문0은 자동반려 사유가 아니다. 시간순서·절차하자·현재법·증거평가로 질문에 답하는 전체흐름과 짧은보호문장이 있으며, 바뀐 문장은 법적 주체와선택성을 더 분명히 한다. FAQ·표·출처를 기계본문배열로 대신 검수하지 않았다. 고지직전 실제결말도 원R2와동일하고916정정은 자료기록조언/마지막범위고지에한정된다.

남은 경계 T01:

-915 P2의 `... 12 lipca 2017 r.`와 `Sąd Najwyższy...`는 한문장이다. 날짜뒤 주어로이어지는 절이며 앞부분의 `a`를 남겨 따로 끊을수없다.
-918 P10의 `W sierpniu 2025 r.`와 `Rada Ochrony Konsumentów...`도 한문장이다. 첫부분은 시점부사구다.

이 두곳만 직접합친 정상검토배열은36/36/42/41/39/43, 합237문장이다. 모든본문문단·원문SHA·문단SHA·완전한문장배열을 `pl-independent-r3-reviewed-boundaries.json` SHA `75763fa56ec70c53e9263cca7cb9c1e796c8d954c987ebe17ad36ca9636b513f`에저장했다. 합치기 전후글자/순서불변을확인했다. 이 자료는 도구담당자에게 전달했으며 작성자가도구나원고를고쳐모호성을숨기지않았다.

## 현재 동결과 한계

| 번호 | R3 SHA256 |
|---|---|
|915|`a11bd9f70669e74cd046d77364a82468f4a191bb6112922f2208c6d5c68b2791`|
|916|`67e1a4bd4123dd6de01e1a0e66586cf6d22903063ffb568b999a24301b6c536f`|
|918|`8d106bbd5e0328f445cfdcd7cf5255efd498a78422550eb498158381411d32b3`|
|919|`a48b8191ba92a6a386c2108fd12c6966484ef86fd2af8941b40c3ae1a38e9628`|
|920|`1ae0a5c6dd50d985378f533d266248349d164314bd39cfdf13fefd4b26ef5b30`|
|921|`c29911404cc6477949d269efbbc26946512b5fd477ded9ed1a4f655145c3551b`|

공식정본6/연구계약/사실표/현재규칙은 R2에서 읽은 동일입력으로대조했고 최신내부LESSONS는독립검수에만적용했다. 이번표적검수에서 전체판결PDF를새로읽거나원어민·변호사승인을받았다고주장하지않는다. 브라우저렌더링·공개페이지·배포검증도하지않았다. 원고수정은실제Kimi출력의정확복사뿐이며R·공유도구·타인원고는변경하지않았다. 의미지적은종결됐지만PL경계도구의최종실제측정은후속작업으로남아있다.
