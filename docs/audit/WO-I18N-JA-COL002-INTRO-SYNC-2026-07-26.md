# WO-I18N-JA-COL002-INTRO-SYNC — 회사 종료 안내 도입부

Date: 2026-07-26 KST
Manager: Codex `/root`
Locale: Japanese (`ja-JP`)
Micro-scope: column 002 introduction only

## 목표

확정된 한국어 column 002 도입부 5문단을 간결하고 자연스러운 일본어
5문단으로 충실하게 번역한다. 현재 일본어판의 짧은 2문단만 교체한다.

이 작업은 **번역 동기화만**을 위한 것이다. 새 법률 조사, 법률 검토,
사실 확인, 해석 보강 또는 조언 추가를 하지 않는다. 아래에 지정한
확정 한국어 원문의 의미만 옮긴다.

## 확정 번역 원문

유일한 번역 원문은 아래 두 자료의 도입부 5문단이다.

1. `src/content/columns/002-withdraw-capital-taiwan-company.md`
   - finalized commit:
     `0ac2a7c963750fdb9bb983870e06f5039a9f956b`
2. `docs/audit/WO-I18N-KO-COL002-COMPANY-EXIT-2026-07-25.md`
   - `## 도입부와 이미지` 계약 및 위 커밋의 도입부 5문단

현재 작업 트리의 한국어 도입부는 위 커밋과 일치한다. 다른 언어판,
외부 자료 또는 구현자의 법률 지식을 사실 원천으로 사용하지 않는다.

## 구현자가 소유하는 파일

구현 단계에서 아래 두 파일만 수정할 수 있다.

1. `src/lib/__tests__/columns-ja-investment-002-intro-sync.test.ts` (new)
2. `src/content/columns-ja/002-withdraw-capital-taiwan-company.md`
   - 아래에 정의한 현재 일본어 도입부 slice만

frontmatter, H1, featured image, immutable prefix와 tail, 기존 테스트,
다른 언어, 공용 코드, 이미지, 검색·아카이브 데이터 및 embeddings를
수정하지 않는다. 일본어 전체 파일을 재작성하지 않는다. stage, add,
commit, push, deploy, publish 또는 공유 서버 조작을 하지 않는다.

## 정확한 바이트 경계

현재 첫 일본어 도입 문장의 아래 marker 직전까지 모든 바이트를 보존한다.

`台湾で設立した会社の事業を終えるとき、株主が払い込んだ出資をどのように回収できるのかは、よく寄せられる質問です。`

- immutable prefix: `2297` UTF-8 bytes
- SHA-256:
  `db5d39499cce6213879785f6e7c3900041dc1f626b99a108a09f79415ce9b041`

위 marker부터 아래 image marker 직전까지의 기존 일본어 2문단만
5문단으로 교체한다.

`![](../images/002-withdraw-capital-taiwan-company/img-01.png)`

image marker와 그 뒤 EOF까지를 글자 단위가 아니라 바이트 단위로
그대로 보존한다.

- immutable tail: `6838` UTF-8 bytes
- SHA-256:
  `26d381e58eb15ae28b6ef05c03065ce393b93855ed31c9086c52e4672d8e3ca0`

교체 slice는 정확히 `P1\n\nP2\n\nP3\n\nP4\n\nP5\n\n` 형식으로
끝나야 한다. 그 직후 immutable tail의 image marker가 와야 하며,
추가 heading, spacer, image, blockquote 또는 다른 콘텐츠를 삽입하지
않는다.

파일 전체에서 위 `img-01.png` image marker는 정확히 한 번만 존재해야
한다. marker를 이동·변경·복제하거나 alt text를 추가하지 않는다.

## 5문단 의미 계약

각 번호는 일본어 결과의 같은 번호 문단에 대응한다. 확정 한국어
원문의 모든 의미를 옮기되, 아래 내용을 넘어서는 사실이나 조언을
추가하지 않는다.

1. 대만에 설립한 회사를 끝내기로 하면 처음 납입한 자본금을 바로
   주주 계좌로 옮길 수 있는지가 먼저 문제 된다는 점을 제시한다.
   출자금이 회사 계좌에 들어가면 회사 재산을 구성하고, 회사 재산은
   회사에 귀속되어 주주의 개인 재산이 아니다. 주주가 회사를 전부
   소유하거나 유일한 이사인 경우에도 이 원칙은 달라지지 않는다.
2. 과거의 출자만을 이유로 회사 예금이나 자산을 자유롭게 인출할 수
   없다고 설명한다. 회사 명의 예금, 매출채권, 장비, 차량, 부동산,
   보증금 및 지식재산권은 회사의 권리·의무 관계 안에서 처리한다.
   회사가 주주에게 부담하는 진정한 채무가 있다면 계약, 송금 내역,
   회계장부와 결의 등을 통해 채무의 존재와 상환 근거를 확인한다.
3. 영구 종료를 위한 해산·청산, 회사를 존속시키며 자본을 줄이는
   감자, 정상적인 사업비용, 이익을 전제로 하는 배당, 회사가 실제로
   부담하는 차입금 상환은 서로 다른 법률·세무 범주라고 구분한다.
   모두 회사 계좌에서 돈이 나가는 모습은 같아도 필요한 결의,
   채권자 보호, 증빙, 회계 처리, 원천징수 및 신고 방식은 같지 않다.
4. 운영 중단만으로 법인격이나 신고 의무가 사라지지 않는다고
   설명한다. 영구 종료 시 해산등기와 청산을 연결해 계약, 채권,
   채무, 세금 및 잔여재산을 정리한다. 사업 재개 가능성을 남기는
   경우 휴업을 검토할 수 있으나 휴업은 회사의 존재를 끝내는
   절차가 아니다.
5. 이 글이 회사 재산, 납입 주금, 감자, 해산, 청산, 파산 신청,
   잔여재산 분배 및 휴업을 구분해 설명한다는 roadmap을 제시한다.
   실제 순서와 서류는 회사 형태, 정관, 재무상태, 채권자, 인허가,
   근로관계, 외국인투자 및 송금 구조에 따라 달라질 수 있으므로
   각 단계에서 현재 자료를 기준으로 판단한다는 원문의 한계를
   그대로 옮긴다.

용어는 전문적이고 자연스러운 일본어 법률 실무 문체로 통일한다.
그러나 표현을 자연스럽게 다듬는 범위를 넘어 원문 명제를 강화,
약화, 일반화하거나 새 예외·기한·법조문·위험·권유를 추가하지 않는다.

## 금지 콘텐츠

교체 slice 안에는 다음을 넣지 않는다.

- 새 법률 조사나 검토에서 나온 사실, 법조문, 기한, 수치 또는 조언
- 인사말, 변호사 이름, 개인 소개, 1인칭 홍보, 영상 안내, 상담 권유,
  성공 사례 또는 그 밖의 마케팅 문구
- heading, list, blockquote, link, HTML 또는 image
- 한글
- U+200B, U+FEFF, U+00A0, carriage return, trailing whitespace,
  whitespace-only 또는 invisible-only line

기존 일본어 도입의 2문단을 일부 남겨 2문단으로 끝내거나, 여러 의미를
삭제한 채 문단 수만 5개로 맞추는 것도 금지한다.

## 결정론적 RED/GREEN 테스트

새 focused test는 Markdown을 raw bytes로 직접 읽고 독립적으로 선언한
상수만 사용한다. 네트워크 호출, snapshot, production-copy import,
loader-derived expectation 또는 결과물에서 역산한 fixture를 사용하지
않는다.

1. bytes `0..2297`의 길이와 SHA-256을 위 immutable prefix 값으로
   고정한다.
2. exact `img-01.png` marker를 찾아 marker-to-EOF 길이 `6838`과
   SHA-256을 위 immutable tail 값으로 고정한다.
3. offset `2297`과 tail marker 사이만 replaceable intro slice로
   취급한다.
4. slice가 정확히 `P1\n\nP2\n\nP3\n\nP4\n\nP5\n\n`이고,
   비어 있지 않은 일본어 prose paragraph가 정확히 5개인지 검사한다.
5. file 전체에서 exact tail image marker가 정확히 한 번이고, slice
   안에는 image 또는 다른 Markdown block 요소가 없는지 검사한다.
6. 각 문단에서 위 의미 계약을 독립적으로 작성한 제한적 일본어
   literal 또는 명시적인 semantic alternative로 검사한다. 특히
   단독 소유·유일한 이사, 자산 종류와 진정한 채무의 근거, 다섯
   자금처리 범주의 구분, 운영 중단과 법인격·신고 의무, 휴업의 한계,
   전체 roadmap 및 개별화 요소가 누락되지 않아야 한다.
7. slice 안의 한글, 인사말·이름·영상·개인/마케팅 문구, U+200B,
   U+FEFF, U+00A0, CRLF/carriage return, trailing whitespace 및
   whitespace-only/invisible-only line을 거부한다.

RED에서는 두 immutable boundary fixture와 exact image marker 검사가
통과한 상태로, 현재의 짧은 2문단이 5문단 구조와 누락 의미 계약 때문에
실패해야 한다. GREEN에서는 오직 owned intro slice만 교체한 뒤 모든
focused assertion이 통과해야 한다. 테스트를 약화해 GREEN을 만들지
않는다.

## 실행 및 독립 검수 게이트

1. Terra가 focused test를 작성·실행해 결정론적 RED를 증명한다.
2. Grok은 확정 한국어 5문단만 보고 일본어 5문단 초안을 작성한다.
   Grok은 조사하지 않고 파일도 수정하지 않는다.
3. Terra 구현자는 승인된 5문단만 exact slice에 반영하고 GREEN을
   증명한다.
4. 구현자와 다른 Terra 검수자가 한국어 원문과 일본어 결과를 문단별로
   대조해 의미 누락·약화·추가가 없고 새 법률 검토가 섞이지 않았음을
   확인한다.
5. 초안 작성자와 다른 Grok 검수자가 일본어의 간결성, 자연스러움,
   전문 문체, 용어 일관성 및 번역투 부재를 독립 검수한다.
6. Codex가 최종 scoped diff를 직접 읽고 focused test, 기존
   `src/lib/__tests__/columns-ja-investment-002.test.ts`, typecheck,
   scoped lint, `git diff --check` 및 고유 dist directory의 clean
   build를 다시 실행한다.
7. Codex가
   `/ja/columns/withdraw-capital-taiwan-company`를 desktop과 mobile
   실제 브라우저로 검증한다. HTTP 200, 일본어 5문단, exact image
   marker 한 개, immutable tail 시작부 보존, 한글·stale copy 부재,
   console/page error 부재 및 horizontal overflow 부재를 확인한다.

push 또는 deploy는 하지 않는다.
