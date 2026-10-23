# VI repair2 기록 — 706 문체 repair1

수정일: 2026-10-24. 상태: STYLE_REPAIR1_READY_FOR_INDEPENDENT_RECHECK. 이번 요청은 중립 프로필의 독립 승인과 VI 측정 지원 설치 후 드러난706의 `len_cv=0.443` 한 항목에 대한 첫 문체 수정이다. 앞선705의 VI-01 법률범위 repair1과 별도다.706의33행 한 곳과 이 보고서 상단만 수정했다.704·705,공용 검사기·프로필·HARD 임계값은 수정하지 않았다. 아래 미지원/과거 해시 기록은 당시 증거로 보존하며 현재706의 해시와 검사 결과는 이 절을 따른다.

## 측정 경계 확인과 수정 이유

`work/vi-measurement/profile-author.md`, `profile-review.md`, `TECHNICAL.md`, `installation-receipt.json` 및 공유 `MULTILINGUAL-METHOD.md`의 VI 추가절을 확인했다. 중립 예문의 독립 승인과247개 fixture,기존1148편 중 변화0이라는 기술 기록은 부모가 수행한 근거이며 저자가 재실행한 결과로 주장하지 않는다. 이 작업에서는 실제706의 추출을 직접 대조했다.

CLI와 같은 `strip_fm` → `body_blocks(..., 'vi')` → `sentences(..., 'vi')` 경로로 수정 전 본문23문단·소제목5개·목록0개·73문장을 추출하고 전부 읽었다. 초기 보조 호출은 frontmatter를 제거하지 않은 직접 `body_blocks` 호출이었으므로 그 출력을 버리고 실제 CLI 경로와 같게 고쳐 확인했다. 엔진 자체의 frontmatter 누출은 아니었다.

본문의 마지막 여행서류 문단까지 보존되고 독립된 `## Nguồn chính thức`부터 출처목록과 그 뒤 확인일·범위 고지가 제외됐다. 의무·예외를 설명하는 본문이 출처로 잘려 나가지 않았다. 이메일·조문번호·세미콜론의 경계에서도 실제 문장과 다른 합침/분리를 발견하지 않았다. `metrics(..., 'vi')['sentences']`도73으로 추출과 일치했다. 따라서 엔진 문제로 보고할 근거가 없었다.

수정 전 다섯째 문단의 문장 길이는21/23/17 표기 단위였다. 학생과 이주노동자가 각각 사용할 공식 안내를 세미콜론 하나로 묶은23단위 문장을 두 문장으로 나눴다. 독자가 자기 절차의 안내를 더 쉽게 찾게 하는 구분이다. 수정 후 같은 문단은21/9/14/17 단위다.9단위 문장을 자동 기준의 “8단위 이하 매우 짧은 문장”이라고 부르지 않는다. 단어 추가·삭제 없이 구두점과 첫 대문자만 바꿨으며,요건·기한·예외 설명을 수치 때문에 줄이지 않았다.

## 정확한 diff와 법률범위 보존

파일: `repo/src/content/columns-vi/706-taiwan-arc-renewal-changes-reentry.md:33`.

```diff
@@ -33 +33 @@
-Theo [hướng dẫn chung của NIA](https://www.immigration.gov.tw/5475/5478/141465/141808/141970), hồ sơ gia hạn cần chứng cứ về mục đích cư trú đang tiếp tục. Sinh viên dùng [hướng dẫn dành cho sinh viên](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/362168/); lao động di trú đối chiếu [hướng dẫn của diện lao động di trú](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/181964/). Giấy xác nhận đang học và giấy xác nhận đang làm việc không thay thế cho nhau.
+Theo [hướng dẫn chung của NIA](https://www.immigration.gov.tw/5475/5478/141465/141808/141970), hồ sơ gia hạn cần chứng cứ về mục đích cư trú đang tiếp tục. Sinh viên dùng [hướng dẫn dành cho sinh viên](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/362168/). Lao động di trú đối chiếu [hướng dẫn của diện lao động di trú](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/181964/). Giấy xác nhận đang học và giấy xác nhận đang làm việc không thay thế cho nhau.
```

실제 변경은 `; lao` → `. Lao` 한 곳이다. 해당 위치를 메모리상 되돌린 전체 파일의 SHA-256은 수정 전 r1 PASS본 `1c73d84fff7aab96960314d6e659e34cd5141ad9d3f4699e1a6e1ffc633a5165`로 정확히 복원됐다. 대소문자를 접은 전체 표기 단위 순서,URL 순서,출처 꼬리 바이트도 모두 같았다. 이는 학생·이주노동자별 안내,갱신사유 증거,재학증명/재직증명의 비대체성뿐 아니라 나머지 모든 조문·수치·예외·상담범위를 보존한 수정이다. 새 법률 주장을 추가하지 않았으므로 출처나 법 시행일을 바꾸지 않았다.

## 실제 검사와 새 해시

동일한 명령을 수정 전후 실행했다.

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/706-taiwan-arc-renewal-changes-reentry.md
```

수정 전 exit1:

```text
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/706-taiwan-arc-renewal-changes-reentry.md [vi] sentences=73 mean=22.0 cv=0.443 short=0.096 run3=0.028 opener_rep=0.13 cite_end=0.0 cite_para=0.435 contrast=3 caveat=0 q=1
  FAIL len_cv=0.443 (limit >= 0.45): sentence-length variation (stdev/mean) too low — mix very short and long sentences
```

수정 후 exit0, FAIL0:

```text
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/706-taiwan-arc-renewal-changes-reentry.md [vi] sentences=74 mean=21.7 cv=0.453 short=0.095 run3=0.028 opener_rep=0.13 cite_end=0.0 cite_para=0.435 contrast=3 caveat=0 q=1
  OK — no variety limit violated
```

읽기 전용 inline Node 구조검사도 exit0, `STRUCTURE_ERRORS=0`이었다. 필수 frontmatter13개,날짜/topic/author/audience,FAQ3개,본문 H1/굵게/행말공백,내부 링크 실제 파일,본문 외부링크의 출처목록 수록을 확인했다. 출력 `LEXICAL_SEQUENCE_CASEFOLDED_UNCHANGED=true`, `URL_SEQUENCE_UNCHANGED=true`, `SOURCE_TAIL_BYTES_UNCHANGED=true`와 수정 전 해시 복원으로 정확한 변경 범위를 검증했다. 수정 후 추출은23문단·74문장이고 같은 출처 경계를 유지한다. 이 자동 결과는 독립 언어·법률 검수나 게시 확인을 대신하지 않는다.

| 파일 | 현재 SHA-256 | 이번 작업 |
|---|---|---|
| `repo/src/content/columns-vi/706-taiwan-arc-renewal-changes-reentry.md` | `6bdc548381e6d3e55115d7890eaa219771a465fc394b785bf52128a3766d7764` | 33행 구두점·대문자 변경 |
| `repo/src/content/columns-vi/704-taiwan-arc-first-application.md` | `ede9dd40337e817986845c9d848146db4bff12cca637f96eb24c6e0d351144bb` | 미수정,해시 동일 |
| `repo/src/content/columns-vi/705-taiwan-visa-residence-work-study-family.md` | `1c6a9987182ca0902c975145a62ad307b34d09459cc114a032de87b8ded335e8` | 미수정,VI-01 repair1 해시 동일 |

실행 직후 공용 파일 해시는 설치 영수증과 일치했다. `variety_metrics.py`=`69ea04deab5f7988be2eb10d93d2c6eaf75bd4db2de97f3e4cab7712183c6e38`, `variety_multilingual.py`=`bb6bb2e8b18496b4422d291c2d273f119e4038e2d20005e6231e85c4c11b8c8b`, `profiles/vi.json`=`3565e97c189498fc28f07a814d60b1548bb21e2e091d48ef1a926a7068be43df`, `MULTILINGUAL-METHOD.md`=`124c841548f4f425b4ba1017729803496dee7ed55e5667b2d3565a816995ae82`, 공용 규칙=`8e920e820529bb049ac27e67b6233ae369badcc901291909867665e39bb1d616`. 부모가 설치한 승인 프로필을 그대로 썼으며 저자가 측정값을 보고 프로필을 바꾸지 않았다.

## §5 자기 점검 및 다음 단계

1. 현행 VI 지원 CLI에서 위706 수정 후 FAIL0이다. 초기 저자 기록의 미지원·보조 CV는 당시 상태이며 현재 측정 결과로 소급 조작하지 않았다.
2. 첫 문장의 계약·학교·가족 변화 결과 도입은 그대로다.704의 숫자·705의 질문 도입과 구별된다. 가상 사례·1인칭 경험을 넣지 않았다.
3. `Giữ mã tiếp nhận.`와 `Ảnh thẻ chỉ giúp tra cứu.` 등 매우 짧은 문장을 유지했다. 새 분리는 서로 다른 독자가 사용할 안내를 각 문장으로 만드는 의미 있는 구분이다. 상세 법정 조건은 그대로 남았다.
4. 문단은 추가·분리하지 않았으므로 문단 시작 단어는 모두 동일하다. 새 문장은 `Lao`로 시작하며 바로 앞 `Sinh`와 겹치지 않는다. 같은 단어 문단 시작3회 이상 없음과 연속 시작 기준을 다시 확인했다.
5. 인용 없는 접수·서류·여행 단락을 유지했다. 새 분리문은 경로 안내이며 주장→조문→예외3단락 연속을 만들지 않는다.
6. 대비 틀은 새로 추가하지 않았다. 현행 측정의 contrast3과 직접 읽기에서 기존 경계 수준을 유지했다. 예외·부정 조건을 삭제하지 않았다.
7. 본문 마지막은 여권·ARC·재입국허가·복귀일을 대조하는 구체적 내용 그대로다. 판촉 결말을 붙이지 않았다.
8. 문장 첫 글자 대문자는 베트남어 문장 경계에 맞춘 것이다. 성조·용어·본문 H1/굵게 금지·내부 작성자값은 그대로이며 공개 작성자나 상담언어 주장은 추가하지 않았다.
9. 정확한 해시 복원과 표기 단위·URL 보존으로 조문·기간·금액·법률강도·출처가 빠지지 않았음을 확인했다. 첫 두 문단 삭제 시험은 다시 읽어 체류사유 소멸과 변경 사건별 날짜 분리의 정보 손실이 계속 있음을 확인했다. 최근 VI3편 비교는 아래 원래 기록 및 독립 r1에 보존했고 이번 한 곳의 구두점 수정은 도입·구조·결말을 바꾸지 않았다.

706의 위 새 해시와33행을 독립 검수자가 재확인해야 한다. 저자의 자동 PASS·자기점검을 독립 PASS로 표시하지 않는다. commit·push·배포·타인 파일 수정은 하지 않았다.

---

# VI repair1 — VI-01 한정 수정 인계

수정일: 2026-10-24. 상태: REPAIR1_READY_FOR_INDEPENDENT_RECHECK. `work/reviews/vi-locale-r1.md`의 필수 지적 VI-01만 처리했다. 이번 수정 범위는705와 이 보고서의 상단 추가 기록이다. 704·706, 선택적 문체 제안, 공용 검사기는 수정하지 않았다. 아래 기존 저자 인계는 최초 동결본의 역사적 기록으로 보존하며,705의 현행 해시와 검사 결과는 이 repair1 기록을 따른다. 독립 재검수 PASS 또는 게시 승인을 주장하지 않는다.

## 변경 및 원문 확인

705의31행 일반 직접 신청 설명 뒤에 검수자가 제안한 두 문장을 그대로 삽입했다(현재33행). TAC와 시험적 무비자 입국은 해당 직접 신청 경로에서 제외된다는 NIA 안내, 별도 규정 예외, 제16조에 의존하기 전 정확한 입국 프로그램 확인을 한 단락으로 적었다. 현재79행 공식 출처 목록에도 같은 링크를 추가했다. 기존35·59행(현재37·61행)의 전문직·허가/면제·가족 조건과 제16조 번호,FAQ는 그대로 보존했다.

2026-10-24 [NIA 0915 공식 안내](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news)의 §7(1) 원문을 직접 열었다. 게시2024-04-10/갱신2026-04-14로 표시되며, 시험적 무비자·도착비자·동남아 국가의 온라인 사전 심사·ABTC·워킹홀리데이·제한 주석을 열거한 뒤 별도 관련 규정의 예외를 남긴다. 이번 보완은 검수 요청의 TAC·시험적 무비자에 한정했고, TAC의 국적별 발급 자격이나 모든 무비자 입국자의 전환 금지를 추가하지 않았다. 같은 날 [外國專業人才延攬及僱用法 제16조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) 본문도 직접 대조해 전문직 본인과 법정 가족 범위가 유지되는지 확인했다.

이것은 단순 문체 변경이 아니라 독자가 이해하는 직접 신청 범위를 보완한 실질 수정이다. 행정 안내를 법 조문의 문구나 새 법 시행일로 소개하지 않았다. 제16조와 행정 안내의 관계는 최종 법률검수 대상이다. 베트남어 상담·통역·신청대행 등 서비스 주장은 추가하지 않았다.

## 해시 및 최소 변경 증거

| 파일 | repair1 SHA-256 | 상태 |
|---|---|---|
| `repo/src/content/columns-vi/705-taiwan-visa-residence-work-study-family.md` | `1c6a9987182ca0902c975145a62ad307b34d09459cc114a032de87b8ded335e8` | VI-01 단락2문장과 출처1줄만 추가 |
| `repo/src/content/columns-vi/704-taiwan-arc-first-application.md` | `ede9dd40337e817986845c9d848146db4bff12cca637f96eb24c6e0d351144bb` | r1 PASS본과 동일, 미수정 |
| `repo/src/content/columns-vi/706-taiwan-arc-renewal-changes-reentry.md` | `1c73d84fff7aab96960314d6e659e34cd5141ad9d3f4699e1a6e1ffc633a5165` | r1 PASS본과 동일, 미수정 |

읽기 전용 Node 검증에서 새 단락과 출처1줄을 메모리상 제거한705의 SHA-256은 `8d307a5369c222f7d63b06cbd15f698d87d029507b2edc3fd308de8f74cf9dab`로 최초 동결본과 정확히 일치했다. 출력 `PRE_REPAIR_HASH_RESTORED`가 이 값을 확인했으며, 다른 기존 문장·메타·링크를 변경하지 않았음을 바이트 단위로 확인했다.704/706 해시 동일 검사도 각각 `true`였다.

## 구조·§5 자기 점검

repo에서 inline Node로 `gray-matter` 파싱,필수13항목,날짜/topic/author/audience,FAQ3개,본문 H1/굵게/행말공백,내부링크 실제 파일,본문 외부링크의 출처목록 수록을 재검사했다. 결과 `STRUCTURE_ERRORS=0`, exit0. 원고의 기존 최초 두 문단 보존 확인은 `FIRST_TWO_UNCHANGED=true`였다. 첫 두 문단 삭제 시험은 다시 읽어 채용·입학·혼인 증명과 허가의 관계,언어/국적 구분,출발 전 경로 선택이라는 정보 손실이 그대로 있음을 확인했다. 최근 같은 언어3편 비교 근거와 결론은 아래 원래 기록 및 r1에 보존되어 있으며 이번 두 문장 보완으로 비교 대상·도입·결말을 바꾸지 않았다.

공용 규칙의2026-10-24 갱신본 전체와 새 `variety/MULTILINGUAL-METHOD.md`를 읽고 §5를 다시 점검했다.

1. 지정 CLI 실행 결과는 아래 exit2,측정 불가다. FAIL0이나 자동 PASS를 주장하지 않는다.
2. 705의 서류 충분성 질문 도입은 그대로이며704의 숫자,706의 사유변경 결과 도입과 구분된다. 가상 사례나 가공한1인칭 경험을 넣지 않았다.
3. `Thư mời chưa đủ.`와 `Giấy phép phải đúng loại công việc.` 등 짧은 문장을 유지했다. 새 단락은 제외 범위·예외를 한 문장에 보존하고 후속 확인 행동을 별도 문장으로 둔다. 규칙의 법적 정확성 우선에 따라 조건을 삭제하지 않았다.
4. 표시 텍스트 기준 본문 문단 첫 단어를 다시 대조했다. `Thư`2회,`Đối`2회,새 `Theo`1회이며 나머지는 각1회다. 같은 시작3회 이상 없음.
5. 새 단락의 행정 제한 뒤에는 제16조의 대상 설명과 인용 없는 `Thư mời chưa đủ.` 단락이 이어진다. 주장→조문→예외 구조3문단 연속을 새로 만들지 않았다.
6. 새 문장은 입국 프로그램의 실제 제한·예외를 설명하며 A가 아니라B라는 대비 틀을 추가하지 않는다. 기존 명시적 대비 틀3회 이하 자기점검을 유지했다.
7. 마지막 본문은 독자가 선택한 체류 목적을 설명할 수 있는 자료로 끝난다. 판촉 마무리를 추가하지 않았다.
8. 베트남어 성조와 전문적 문체를 대조했다. H1·굵게·공개 AI 표기·허구 작성자·명령형 체크리스트 제목 없음. 내부 `author: legal-ai-assistant` 유지.
9. 제16조 번호와 기존 요건·60일 등 모든 기존 숫자·기한·링크는 최소 변경 해시 복원으로 보존을 확인했다. 새 예외 `trừ khi có quy định riêng`를 남겼다.

## 실제 CLI 결과 — 현재 도구

실행 시 도구 SHA-256은 `0491ce5e3a7bd0c3ebd9bea7aa0ed04ba3ea41c6b56d2707824455eb2ccd10fb`, 공용 규칙 SHA-256은 `6b9d818ea826b90a9b404c2a2db7508ce8287c1ea2927eb8559cf65eae856e35`였다.

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/705-taiwan-visa-residence-work-study-family.md
```

exit2. 실제 출력:

```text
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/705-taiwan-visa-residence-work-study-family.md: ERROR measurement unavailable: cannot infer language for /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/705-taiwan-visa-residence-work-study-family.md; supply --lang
```

명시적 언어 지정도 직접 실행했다.

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/705-taiwan-visa-residence-work-study-family.md --lang vi
```

exit2. 실제 오류:

```text
variety_metrics.py: error: argument --lang: invalid choice: 'vi' (choose from 'ko', 'ja', 'en', 'zh-hant', 'th', 'id', 'hi', 'fr', 'de', 'it', 'es', 'pt', 'ar')
```

초기 저자 기록의 ko 오판정·exit1·KeyError는 당시 실행의 역사적 증거로 그대로 둔다. 현재 출력으로 소급 교체하지 않는다. 영어나 다른 언어로 우회 실행하거나 검사기를 수정하지 않았다. 베트남어 자동 측정은 여전히 미지원이다.

다음 단계는 부모가 위705 repair1 해시를 독립 검수자에게 보내 새33행,기존 전문직·가족 설명,FAQ와79행 출처의 보완을 재확인하는 것이다.704·706의 기존 r1 PASS는 해당 원고 해시가 같은 상태로 인계한다. commit·push·배포·외부 발송은 하지 않았다.

---

# VI 704–706 저자 인계

확인일: 2026-10-24. 상태: DRAFT_FOR_INDEPENDENT_REVIEW. author_vi의 집필·자기점검 기록이며 독립 언어검수, 독립 법률검수 또는 게시 승인이 아니다. 원고 3편과 이 보고서만 수정했다. commit, push, 배포, 외부 발송은 하지 않았다.

## 동결 원고

| 파일 — `repo/src/content/columns-vi/` 기준 | 제목 | SHA-256 |
|---|---|---|
| `704-taiwan-arc-first-application.md` | Xin thẻ ARC lần đầu ở Đài Loan: mốc 30 ngày và hồ sơ theo từng diện | `ede9dd40337e817986845c9d848146db4bff12cca637f96eb24c6e0d351144bb` |
| `705-taiwan-visa-residence-work-study-family.md` | Sang Đài Loan làm việc, học hay đoàn tụ: chọn đường xin cư trú trước khi đi | `8d307a5369c222f7d63b06cbd15f698d87d029507b2edc3fd308de8f74cf9dab` |
| `706-taiwan-arc-renewal-changes-reentry.md` | ARC còn hạn nhưng đã đổi việc, chuyển nhà hoặc sắp về nước | `1c73d84fff7aab96960314d6e659e34cd5141ad9d3f4699e1a6e1ffc633a5165` |

704는 첫 입국자의 서류·기산일·접수창구·수령, 705는 출발 전 취업/학위/중국어학습/가족 경로 선택, 706은 기존 카드의 연장·변경·분실·출국을 맡는다. 베트남어 사용자 전원을 베트남 국적자 또는 이주노동자로 가정하지 않았다. 일반 이주노동자, 전문직, 학생, 대만인 배우자와 외국인 전문직의 가족을 구분했다.

## 읽은 규칙·동결 연구

전문을 읽은 필수 문서: `work/BRIEF.md`, repo `AGENTS.md`, repo `docs/columns/EDITORIAL-VOICE.md`, `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, `/Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md`, `/Users/son7/tseng-lanes-shared/LESSONS.md`, `/Users/son7/.codex/skills/tseng-law-editorial/SKILL.md`, 같은 skill의 `references/review-criteria.md`.

home 포인터가 가리키는 `/Users/son7/agent-library/knowledge/editorial-voice.md`는 없었다. repo의 실제 전체 정본을 읽고 적용했다. 이 누락을 읽은 것으로 보고하지 않는다. 메모리·볼트는 문서 위치와 기존 결정 확인에만 사용했으며 원고의 현행 법률·업무 주장은 아래 공식 원문과 현재 repo를 기준으로 했다. 소유 범위 밖 볼트는 수정하지 않았다.

최종 연구 동결 통지를 받은 뒤 `research-arc.md`의 A01–A16·온라인 수령 보완 및 A03 특례, `research-paths.md`의 경로 원장, `research-asia.md`의 공통 업무범위·VI 절·최종 미확인/TAC 부록을 다시 대조했다. 동결 연구 해시는 다음과 같다.

```text
3bbcaf47776b133e8a7b9d637a10baefad08d7fe2b98d0a1077eb360990e5cb4  work/research-arc.md
9ef30ffe724fa2c7ae6439d79ddc59f8e9167d87c5d24fb395f79e69e8816f4d  work/research-paths.md
0923eaf0116ea5cabb72e4686455aad248b0f7ae921197983885ebbc49d52084  work/research-asia.md
```

## 법률·출처 원장 및 숫자 점검

아래 링크의 해당 본문은 저자가 웹 도구로 열었다. 연구 원장의 시행일 확인은 연구자가 열어 본 공식 연혁에 근거하며, 저자가 모든 연혁 페이지를 별도로 다시 성공 조회했다는 뜻은 아니다. 행정 안내의 게시/업데이트일과 법 시행일을 원고에서 혼동하지 않았다. 초안·입법예고·시행 전 규정을 현행으로 소개하지 않았다.

| 원고·주장 | 직접 대조한 공식 근거와 제한 |
|---|---|
| 704 입국 후 30일 | [入出國及移民法 22조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22). 거류허가 입국의 다음 날부터 30일. 취업개시/기숙사 입주일 아님. 유효한 ARC 기능 통합증 예외 포함. A01의 해당 조항 시행일 2024-01-01. |
| 704 국내 거류비자 발급 | [BOCA FAQ](https://www.boca.gov.tw/fp-398-723-7b71f-1.html), 게시 2024-01-02. 국내에서 거류비자로 바꿔 발급받은 경로는 발급일부터 30일. 다음 날로 바꾸지 않았다. 별도 직접 NIA 경로에 이 순서를 강요하지 않았다. |
| 704 공통 서류·사진·외국문서 | [居留辦法 5조](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129), [NIA 일반 안내](https://www.immigration.gov.tw/5475/5478/141465/141808/141970), 업데이트 2026-04-14. 사진 최근 2년, 원본/사본, 주소·목적 증명. 비자 단계 사진과 구분. 외국 문서 인증·중문 번역은 경로별 확인. 모든 사람에게 동일한 건강/범죄경력 자료를 요구하지 않았다. |
| 704 목적별 자료·창구 | 위 NIA 일반 안내와 [학생 안내](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/362168/), [이주노동자 안내](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/181964/). 전문직 재직·학생 재학 증명 최근 1개월, 해당 학생 경로의 건강자료 최근 3개월. 이주노동자 고용허가 미발급 시 모집허가 대체를 해당 안내 범위에 한정. 첫 대만인 배우자 ARC 동행·1년. |
| 704 실제 포털 | [학생](https://coa.immigration.gov.tw/coa-frontend/student/entry), [전문직/가족](https://coa.immigration.gov.tw/coa-frontend/foreign-white-collar), [이주노동자](https://coa.immigration.gov.tw/coa-frontend/foreign-labor)의 공개 화면 열람. 이주노동자 포털의 고용주/기관 계정과 中階技術人力 제외·서면 접수 안내를 반영. 로그인·신청·결제는 실행하지 않았다. |
| 704 수수료·처리기간 | [수수료 규정 3조](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080135): 보통 1년당 NT$1,000, 1년 미만 1년분, 방문/무비자 입국 후 직접 거류 NT$2,200 가산. 僑生 감면을 모든 유학생에게 확대하지 않음. 제3조 시행 2024-03-01. 일반 NIA 10근무일은 반환·보완·면담 제외, 보완 후 재계산. 모든 온라인 절차·수령 보장으로 확대하지 않음. |
| 705 전문직·가족 직접 거류 | [外國專業人才延攬及僱用法 16조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16). 전문직 허가/면제와 해당 입국 상태 조건; 가족은 법정 전문가의 허가된 거류/영주, 배우자·미성년 자녀·장애로 자립 불가 성년 자녀. P01 연혁: 2025-09-24 공포, 여기 쓰인 조문 2026-01-01 시행. 모든 외국인 노동자나 모든 가족에게 확대하지 않음. |
| 705 이주노동·취업권 | 위 이주노동자 NIA 안내, [就業服務法 43조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43)·[48조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=48). ARC 자체를 보편 취업허가로 쓰지 않음. 대만 호적 국민 배우자 취업허가 예외에는 혼인+허가된 거류 조건을 남김. |
| 705 유학·중국어학습 | [BOCA 정규학생](https://www.boca.gov.tw/cp-166-283-c4da3-2.html), 업데이트 2024-05-01; [중국어 방문비자](https://www.boca.gov.tw/fp-158-260-9690c-2.html), 게시 2025-10-14; [중국어 거류](https://www.boca.gov.tw/fp-166-285-041cb-2.html). 입국 목적 일치·전환 제한, 4개월 수학+3개월 이상 계속 등록, 주중 15시간, 허가 결석 포함 1/4 초과 금지. 수강료 납부일을 실제 수학일로 대체하지 않음. |
| 705 가족·혼인 | [移民法 23조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=23), NIA 일반 안내. 60일 이상 방문비자/제한 주석 요건, 대만 호적, 특정 노동자 초청자 제외를 명시. 혼인 효력일·등록일·증명서 발급일 구분. 베트남 혼인법이나 공관별 인증 세부요건은 새로 단정하지 않음. |
| 705 소수 경로 | [Gold Card 공식 소개](https://goldcard.nat.gov.tw/en/about/)의 4증 통합, [BOCA 창업가 안내 목록](https://www.boca.gov.tw/lp-154-2.html)만 짧게 연결. 급여·투자·영주 숫자나 14언어 공통 자격을 만들지 않음. 일반 거류비자 안내는 [BOCA](https://www.boca.gov.tw/cp-165-1878-1ff5e-2.html), 업데이트 2026-08-13. |
| 706 일반 갱신·별도 프로그램 | [居留辦法 9조](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129)의 만료 전 3개월은 일반 절차. A03의 제9조 시행일 2024-01-01, 최신 일부 조항 개정 시행일 2026-01-01과 구별. [Gold Card 안내](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/406403/) 주의(6), 게시/수정 2026-02-10: 4개월. [창업가 안내](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/348924/) 주의3·6, 수정 2025-02-17: 사업 기반 연장4개월, 사업 소멸 뒤 별도 경로3개월. 이를 FAQ·소제목·본문에 반영. |
| 706 주소·근무장소 변경 | [移民法 31조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31) 마지막 항: 발생 다음 날부터30일. 고용허가 변경 또는 새 고용주 취업 시작을 자동 허용하지 않음. |
| 706 체류사유 변경 | [移民法 23-1조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=23-1), [居留辦法 7조](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129): 해당 그룹은 발생일부터30일. 제23-1조1항 밖의 경로는 발생일부터15일 내 BOCA 거류비자 재신청 후 NIA. 주소변경의 다음 날과 혼동하지 않음. |
| 706 사유 소멸·기한 경과 | 위31조: 사유 소멸 시 취소/말소, 예외 개별심사. 가정폭력 이혼·미재혼·대만 거주 호적 국민 배우자 조건과 대만 고용주와의 진행 중 노동쟁송 조건을 남김. 만료 후30일 미만 규정은 기존 사유 존속·처벌 후 재신청, 허용된 유예가 아님. |
| 706 여권·분실·재발급 | [NIA 여권 FAQ](https://news.immigration.gov.tw/EasyPack/Detail/DDA469F4-E2D0-4A98-847C-21432DCC040E?lang=EN), [국내/해외 분실 안내](https://www.immigration.gov.tw/5385/7229/7232/368785/), 게시2024-05-17. 경찰 신고서만 유일 필수라고 쓰지 않고 진술서 대안을 보존. 새 카드 수령 시 구카드 반환. [수수료7조](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080135) NT$500은 분실/훼손 재발급. 모든 주소/여권번호 변경에500 또는30일을 확대하지 않음. |
| 706 출국·재입국 | [移民法 전체본문34조](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080132), [전문직/가족 온라인 안내](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/) 및 학생 안내. 사전 재입국허가·APRC 예외, 심사 중 출국의 경로별 영향. 사진/접수증의 탑승·입국 보장 없음. 해외 분실은 NIA/공관 확인으로 범위 제한. |
| 706 현지어 실무·CTA | [WDA 베트남어 갱신 안내](https://fw.wda.gov.tw/wda-employer/home/file/2c95efb38d75b733018d78214fd00590)에서 중개 위임 후 처리시점 확인 취지를 반영. 저자 열람 화면은 게시2024-02-06/업데이트2026-10-19였으며 연구자의2025-04-10 표시와 차이를 전달함. 기사에서 업데이트일을 주장하지 않음. [사무소 contact](https://tseng-law.com/en/contact)·[about](https://tseng-law.com/en/about)로 이메일과 중국어/영어/일본어/한국어 상담만 확인. 베트남어 상담·통역·접수대행·허가 보장은 약속하지 않음. |

## 최근 같은 언어 실제 비교 3편

3편 모두 현재 repo의 전체 원문을 읽었다. `published`/`lastmod`는 2026-10-08이다. 공개 URL도 각각 열기를 시도했지만 웹 도구는 `not accessible via this tool`을 반환했다. 이것은 404나 미게시 증거가 아니며, 이번 비교가 공개 화면까지 확인된 비교라는 주장은 하지 않는다.

| 비교 파일 — `repo/src/content/columns-vi/` | 구체적 비교 증거 | 신규 원고에 적용한 차별점 |
|---|---|---|
| `442-taiwan-police-interview-vietnamese-interpreter-lawyer.md` | 26행은 일상 중국어와 “cố ý”, “nhận hộ” 같은 조사 단어 차이로 시작한다. 30행 소제목 `Giấy hẹn ghi gì, cơ quan nào đang hỏi?`; 60행은 실제 알고 있는 사실과 자료로 끝난다. | 704는 통역·경찰 상황을 복제하지 않고 숫자 기한으로 시작. 서류 단계와 본인 기록 확보라는 행동 중심만 유지. |
| `443-taiwan-sexual-assault-report-vietnamese-workers-residents.md` | 26행 `Bạn có thể tìm hỗ trợ y tế và an toàn...`, 28행 통역 요청. 48행 배우자 사건의 기한, 64행 안전하게 통지받을 장소와 다음 일정으로 마무리. | 705는 피해사례를 만들지 않고 출발 전 허가 경로 선택이라는 실제 결정에 집중. 통역·안전 서비스의 제공 주체를 사무소로 옮기지 않음. |
| `444-taiwan-short-sentence-fine-suspension-residence.md` | 26행 `Trên bản án, 罰金 là hình phạt tiền.`로 법률 용어 세 가지를 나눈다. 58행 `Cư trú và giấy phép làm việc sau bản án`; 66행 판결·납부영수증·ARC·취업허가를 대조하며 각 기한을 분리. | 706은 형사판결 효과를 다시 다루지 않고 계약종료·이사·여권·여행을 출발점으로 삼음. 카드 인쇄 기한과 허가 사유를 구분하고, 마지막은 실제 여행 서류와 복귀일에 귀착. |

기존 070은 여권/ARC 반환 분쟁, 040은 가정폭력 이혼 후 체류를 맡으므로 해당 글로 연결했다. VI의 기존 Gold Card/일반 배우자/APRC 동번호 글은 확인되지 않아 존재하지 않는 링크를 만들지 않았다. 학생 주소변경 이슈글과 달리706은 만료·사유·여권·재입국까지 다룬다.

## 첫 두 문단 삭제 시험

각 원고의23·25행을 생략하고 첫 소제목부터 읽는 비파괴 삭제 시험을 했다. 유지한 각 문장은 아래 정보 손실이 있어 필요하다. 자체 판정이며 독립 검수자가 다시 확인해야 한다.

| 원고 | 삭제하면 없어지는 정보 | 조치 |
|---|---|---|
| 704 | 입국 다음 날부터30일이라는 핵심 기산점, 취업일/입주일과의 구별, ARC 한 번 설명, 단기입국자에게 자동전환권이 없다는 범위. 첫 소제목은 국내 거류비자 발급일의 다른 기산점으로 이동하므로 앞부분 없이 읽으면 두 경로를 혼동할 수 있음. | 일반적인 “각 경로의 조건은 다르다” 문장을 삭제했고 목적별 경로 링크를 실제 단기입국 조건 문장에 붙임. 현재 두 문단 유지. |
| 705 | 구인·입학·혼인 증명과 허가의 관계, 취업허가라는 별도 단계, 언어와 국적의 구별, 출발 전 해외비자/직접NIA 선택. 첫 소제목만 남기면 독자의 세 가지 증명서와 허가 판단이 연결되지 않음. | 첫 질문의 `Tôi`를 제거해 가공한 1인칭 경험처럼 읽힐 여지를 없앰. 실제 의사결정 질문을 유지. |
| 706 | 인쇄된 만료일보다 먼저 체류사유가 없어질 수 있다는 경고와 예외, 변경 사건별 날짜 분리. 첫 소제목부터 시작하면 일반 갱신 글로만 읽혀 계약/학교/가족 변경의 긴급성을 놓침. | 짧은 결론 `Một lần xin gia hạn không tự giải quyết tất cả những thay đổi này.`를 유지. 기한표를 서두에 반복하지 않음. |

## 문장 다양성 §5 직접 점검

1. 지정 CLI는 세 파일 모두 실행했으나 vi 미지원으로 통과하지 않았다. 실제 출력은 아래에 보존한다. 영어로 바꾸어 돌리거나 검사기를 수정하지 않았다.
2. 704의 숫자 기산일, 705의 증명서 충분성 질문, 706의 계약·학교·가족 변경 결과로 시작해 같은 배치의 도입을 구별했다. 가상 인물·고객 경험·상담 실적을 만들지 않았다.
3. 매우 짧은 문장 예: 704 `Ghi lại ngày nhập cảnh.` / `Giữ lại mã hồ sơ.`; 705 `Thư mời chưa đủ.` / `Giấy phép phải đúng loại công việc.`; 706 `Giữ mã tiếp nhận.` / `Ảnh thẻ chỉ giúp tra cứu.`. 긴 법정 조건 문장 뒤에 구체적 짧은 행동 문장을 배치했다. 모든 문장을 같은 길이로 자르지 않았다.
4. 링크를 읽히는 텍스트로 바꾼 뒤 본문 문단의 첫 단어를 세로로 대조했다. 마지막 수정에서706의 `Đối` 3회를2회 이하로 줄였다. 최종 본문에 같은 첫 단어3회 이상 없음. 표·소제목·출처목록을 본문 문단과 분리한 보조 진단에서도 동일하다. 지정 검사기의705 `top_opener_n=3`은 아래 실패 기록 그대로 남긴다.
5. 조문→예외 단락3연속 여부를 직접 읽었다. 서류 준비·접수번호·입학/등록 실제 날짜·여행서류 등 인용 없는 단락이 각 글에 존재한다. 법정 예외는 문체를 위해 삭제하지 않았다.
6. 명시적 A가 아니라B/대신 틀은 각 글3회 이하로 점검했다. ARC가 모든 취업을 허용한다는 오해, 입국일·발급일·실제 수학일의 혼동처럼 해당 절차에서 필요한 구별만 남겼다. 부정문 전체를 대비 틀 숫자와 동일시하지 않았다.
7. 본문 마지막은704의 확인된 카드와 본인 보관본,705의 실제 목적을 설명하는 한 장의 자료,706의 복귀일·여권·재입국허가로 끝난다. 출처목록 뒤의 날짜·관할 범위 고지는 법률정보 범위를 밝히는 별도 문장으로 두었으며 판촉 결론을 복사하지 않았다.
8. 전문적인 베트남어와 온전한 성조를 사용했다. 본문 H1·굵은 글씨·공개 AI 작성자 표기·가공한 사람의 서명·명령형 체크리스트 제목 없음. 내부 frontmatter `author: legal-ai-assistant` 유지. 한국어/일본어 문체 규칙은 이 언어에 기계적으로 적용하지 않았다.
9. 수정 중 입국 다음 날/국내 발급일/주소 다음 날/사유 발생일,30일·15일·3개월·4개월,NT$1,000·2,200·500,조문번호와링크를 대조했다. A03 일반/Gold Card/창업가 보완은 실질 법률범위 수정이므로 최종 법률검수 대상이다. 가정폭력 예외의 미재혼 조건도 명시적으로 남겼다.

## 실제 검사 명령·결과

아래 명령을 각각 실행했다. 최종 원고의 출력이며 세 명령 모두 exit1이다. `[ko]`는 베트남어를 한국어로 판정한 검사기 출력이다. 이 결과를 베트남어 스타일 FAIL0 또는 통과로 바꾸어 보고하지 않는다.

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/704-taiwan-arc-first-application.md
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/705-taiwan-visa-residence-work-study-family.md
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/706-taiwan-arc-renewal-changes-reentry.md
```

```text
704 [ko] sentences=50 mean=79.8 cv=0.542 short=0.02 run3=0.021 opener_rep=0.105 cite_end=0.0 cite_para=0.211 contrast=0 caveat=0 q=1
  FAIL short_share=0.02 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
705 [ko] sentences=60 mean=87.2 cv=0.48 short=0.017 run3=0.052 opener_rep=0.15 cite_end=0.0 cite_para=0.2 contrast=0 caveat=0 q=2
  FAIL short_share=0.017 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
  FAIL top_opener_n=3 (limit <= 2): too many paragraphs start with the same word (max 2, or paragraphs/8 for long columns)
706 [ko] sentences=66 mean=87.3 cv=0.49 short=0.0 run3=0.078 opener_rep=0.125 cite_end=0.0 cite_para=0.292 contrast=0 caveat=0 q=1
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
```

명시적 언어 지정도 실제 실행했다.

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/704-taiwan-arc-first-application.md --lang vi
```

exit1, `variety_metrics.py:104`의 `short_th = {'ko': 15, 'ja': 18, 'zh-hant': 12, 'en': 8}[lang]`에서 `KeyError: 'vi'`. 검증 도구가 vi를 지원하지 않는다는 제한이 실제로 남아 있다.

추가로 repo 디렉터리에서 읽기 전용 inline Node 명령(`node <<'NODE'`)을 실행했다. 설치된 `gray-matter`로 세 파일을 파싱하고 필수 frontmatter13개, 날짜,topic/author/audience,FAQ3개(q/a 포함),본문 H1/굵게/행말공백,내부9링크의 실제 파일 존재,본문 외부링크의 출처목록 수록을 확인했다. 출력 `STRUCTURE_ERRORS=0`, exit0. 위 SHA-256은 같은 실행에서 `crypto.createHash('sha256')`로 실제 원고 바이트에 대해 구했다. 이 구조검사는 법률·언어 검수 통과를 뜻하지 않는다.

문장 시작을 직접 확인하기 위한 별도 보조 진단은 `Intl.Segmenter('vi', {granularity:'sentence'})`와 공백 단위를 사용했다. 표·목록·소제목·출처목록을 제외하고 링크는 표시 텍스트로 바꿨다. 베트남어의 공백 단위는 검증된 단어 길이 기준이 아니며 이 수치를 지정 variety 게이트의 대체 PASS로 쓰지 않는다.

| 파일 | 본문 문단 | 문장 | 평균 공백 단위 | CV | 8단위 이하 문장/비율 | 동일 첫 단어3회 이상 |
|---|---:|---:|---:|---:|---|---|
| 704 | 18 | 50 | 21.52 | 0.496 | 5 / 0.100 | 없음 |
| 705 | 19 | 62 | 22.79 | 0.452 | 6 / 0.097 | 없음 |
| 706 | 23 | 73 | 21.97 | 0.440 | 7 / 0.096 | 없음 |

706 보조 CV0.440은 공유규칙의0.45보다 낮다. 지원되지 않는 측정방법으로 수치 통과를 주장하지 않았고, 필요한 법정 조건·기간 설명을 수치 맞추기 위해 자르지 않았다. 독립 베트남어 검수자는 실제 호흡과 단조로움을 다시 판단해야 한다.

## 남은 사항과 다음 단계

- 부모가 저자와 다른 검수자에게 위 해시의 베트남어3편 및 법률·출처·업무범위를 검토하도록 배정한다. 본 보고서는 PASS가 아니다.
- 공유 variety의 vi 미지원은 미해결이다. 자동 FAIL0 충족을 주장할 수 없으며, 이 한계와 수동 검토 결과를 최종 인계에서도 유지해야 한다.
- 공개 비교3편은 도구로 열리지 않아 로컬 실제 원고 비교로 한정했다. 직접 서면신청의 모든 우편/대리수령 방식과 베트남 공관별 인증 세부요건을 보편 규칙으로 확정하지 않았다.
- 사무소 contact의 일반적인 “작성 언어로 회신” 문구보다 명시된4개 상담언어 제한을 적용했다. 베트남어 초기문의 가능성과 베트남어 변호사 상담·통역·베트남법 자격은 같지 않다.
- 기사 본문·frontmatter 또는 링크를 변경하면 새 해시와 해당 검사를 다시 기록해야 한다. 현재 파일은 미게시 초안이다.
