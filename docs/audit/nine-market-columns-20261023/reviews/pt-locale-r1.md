# PT locale review r1 — Portugal, 694–698

검수일: 2026-10-23. 검수자 역할: 독립 AI 포르투갈어 편집 검수자. 이 검수자는 다섯 원고를 집필하지 않았고 원고를 수정하지 않았다. 사람 원어민·변호사 검수, 최종 법률 승인 또는 게시 완료를 뜻하지 않는다. 검수 범위는 frozen 원고의 pt-PT 표현, 독자 관점, 법적 의미를 흐리는 번역, 제목·FAQ·연락 안내와 문장 다양성이다.

기준 경로: `/Users/son7/tseng-market-columns-20261023/repo/src/content/columns-pt/`.

최종 locale 결론: 5편 모두 PASS. 696의 초기 L1은 작성자가 한 번 수정한 뒤 아래 최종 SHA에서 독립 재확인하여 닫았다. 이후의 초기 발견·진단 기록은 수리 이력을 보존하기 위한 것이다.

## 판정과 검수 버전

| 원고 | 판정 | SHA-256 |
|---|---|---|
| `694-portugal-exportador-acordo-prestacoes-taiwan.md` | PASS — locale 범위 | `62dd6d3e3e38a388f49be4d259e44abd4d87badd9261e8afd708cffb3567f2f0` |
| `695-portugal-fornecedor-taiwan-alteracao-conta-fraude.md` | PASS — locale 범위 | `dd47581c4629eced1a254eab84cebbe1dc2f2a0da5c5d36c761f9cc308f8f78a` |
| `696-portugal-sentenca-arbitral-bens-taiwan.md` | PASS — L1 수리 후 locale 재확인 | `e495bd598c2c2615e6532b56530f9f708e752dd65503cceba207567b7e8e1aac` |
| `697-portugal-mandatario-processo-civil-taiwan.md` | PASS — locale 범위 | `748c2617ba06689b7d83c9db9bbaf07c5db621f6d1b7b6c288ee1526b78450be` |
| `698-portugal-fim-contrato-taiwan-salarios-em-falta.md` | PASS — locale 범위 | `06120ce9774c4ee9717384fdbe47f8ab9b214b90c388eec1bb4339f3f1844145` |

읽은 기준: `work/BRIEF.md`, skill의 `SKILL.md`와 `references/review-criteria.md`, repo `AGENTS.md`, `docs/columns/EDITORIAL-VOICE.md`, 공유 `SENTENCE-VARIETY-RULE.md` 전문과 `LESSONS.md` 전문. `work/pt-author.md`와 `work/research-iberia-arabic.md`의 범위·한계·PT brief·관련 근거도 읽었다. 작성자 자체 검수를 독립 검수의 증거로 대체하지 않았다.

## 초기 수정 요청 — L1 수리 후 닫힘

| ID / File:line | 정확한 문장 | 이유와 근거 | 권장 수정문 | 법적 의미 보존 여부 |
|---|---|---|---|---|
| L1 / `696-portugal-sentenca-arbitral-bens-taiwan.md:50` | `Há uma exceção para a parte excessiva separável sem afetar o restante.` | 무엇이 승인 거절 예외의 대상인지 불분명하다. 초과한 부분 자체가 예외적으로 승인되는 것처럼 읽힐 수 있다. 대만 중재법 제50조 제4호는 문제 부분을 제거해도 나머지가 성립할 때 나머지를 이 거절 사유에서 제외한다. [공식 중국어 제50조](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=I0020001)와 [법무부 공식 영문](https://mojlaw.moj.gov.tw/ENG/LawContentE.aspx?LSID=FL010105&media=print)을 직접 열어 대조했다. | `Se a parte da sentença que excede a convenção puder ser separada sem afetar o restante, esse excesso não impõe, por si só, a recusa do reconhecimento da parte restante.` | 원고가 의도한 분리 가능성은 보존한다. 그러나 예외가 보호하는 대상을 명시하므로 단순 취향 수정이 아닌 법적 의미 명료화다. 나머지 부분의 무조건 승인까지 약속하지 않는다. 작성자 반영 뒤 독립 재확인 필요. |

최종 법률 검수자에게 L1의 수정 문장을 전달할 것. 제50조의 다른 거절 사유·20일 기산점과 제49조의 필요적/재량적 거절 구별은 그대로 보존한다.

## 선택적 문체 의견 — PASS를 막지 않음

| ID / File:line | 정확한 문장 | 이유 | 선택 수정문 | 의미 보존 |
|---|---|---|---|---|
| O1 / `695-portugal-fornecedor-taiwan-alteracao-conta-fraude.md:2` | `O fornecedor de Taiwan mudou a conta por email: a fatura ficou paga?` | 본문은 발신자와 권한이 미확인된 계좌 변경을 다룬다. 제목의 공급자가 변경했다는 문법적 단정을 덜 수 있다. 본문·FAQ가 이미 불확실성을 설명하므로 독립 차단 사유로 보지는 않았다. | `Alteração de conta por email: a fatura ao fornecedor de Taiwan ficou paga?` | 실제 공급자의 변경인지 아직 모른다는 본문 범위에 맞춘다. 결제 효력이라는 질문은 유지한다. |
| O2 / `696-portugal-sentenca-arbitral-bens-taiwan.md:50` | `A data da notificação inicia esse prazo.` | 바로 앞의 `vinte dias após a receção da notificação do pedido`가 이미 기산점을 준다. 법률 정확성을 위해 반복해야 하는 부분은 아니다. | 삭제 가능. | 같은 문단 첫 문장의 기간과 수령 기준을 반드시 남긴다. 짧은 문장 비율 때문에 이 문장을 유지할 필요는 없다. |

## 실제 첫 두 문단 삭제 시험

각 원고의 26행과 28행을 읽고 각 문장을 하나씩 빼 보았다. 제목을 제외해도 유지되어야 할 사실·조건·적용 범위를 기준으로 판단했다. 수정 요구를 만들기 위해 필요한 조건문을 삭제하지 않았다.

| 원고 | 첫 문단: 남길 정보 | 둘째 문단: 남길 정보와 삭제 판단 |
|---|---|---|
| 694 | `Aceitar prestações e renunciar ao saldo na data da assinatura...`는 서명과 실제 수령이 다른 시점이라는 이 글의 위험을 제시한다. 다음 문장의 제737조는 적용법 한정과 권리 소멸 효과를 추가하므로 둘 다 유지. | `Uma venda de Portugal para Taiwan exige, porém, uma verificação prévia da lei aplicável...`는 국경 간 거래라는 적용 범위를 설정한다. 이어지는 선택법/최밀접 관련, 특징적 급부자의 행위 당시 주소 추정은 서로 다른 규칙이다. `A sede do cliente, isoladamente, não basta.`는 독자가 대만 고객만 보고 대만법을 고르는 오류를 막고, `Escolher o tribunal exige análise própria.`는 법 선택과 법원 선택을 구분한다. 모두 정보 역할이 있다. |
| 695 | `Quando o fornecedor reclama uma fatura...`는 장부상 지급과 공급자 청구의 충돌을 특정한다. `Se houve uma alteração de conta por email...`는 발신자/수취인 확인으로 분석을 좁힌다. 둘째 문장은 단순 제목 반복이 아니다. | PJ 경고의 기제를 설명한 첫 문장은 포르투갈의 공식 맥락을 제공한다. `Esse alerta não estabelece quem suporta o prejuízo...`는 경고와 책임 판단의 차이를 보존한다. `Serve para reconhecer a situação e preservar a informação necessária à análise.`는 그 경고를 증거 준비에 어떻게 쓸지 설명하므로 유지 가능. 핵심 첫 문장을 지워도 같아지는 범용 도입은 없다. |
| 696 | 첫 문장의 포르투갈 기업·외국 중재·대만 자산·승인 절차는 독자의 현재 단계를 직접 정한다. 제47조 문장은 승인 후 법적 효력과 집행권원이라는 결과를 추가한다. | `Onde foi proferida a sentença?`는 다음 문장 `A resposta...`의 지시 대상을 제공한다. 그 다음 문장은 중재기관 이름만으로 판정지·적용법·채무자를 알 수 없음을, 마지막 문장은 외국 판정의 두 가지 법정 범주를 제시한다. 어느 문장도 단순 안내 예고가 아니다. |
| 697 | `Pode o advogado aceitar um acordo sem voltar a contactar a empresa em Portugal?`는 수권 범위에 관한 실제 의사결정이다. 제70조 답변과 `A procuração merece uma leitura própria, além do acordo de honorários.`는 특별수권과 보수약정의 차이를 더한다. 유지. | 수령자/기한 내 결정권자, 넓은 위임과 실제 지시의 일치, 상대방/쟁점 식별은 서로 다른 준비 내용이다. 첫 문단의 특별수권을 반복하는 일반론으로만 이루어지지 않는다. |
| 698 | `Cinco anos é o período de conservação dos registos salariais...`는 정확한 증거 보존기간을 준다. `Esses documentos permitem conferir o acerto final.`는 왜 이 숫자로 시작했는지 설명한다. 마지막 문장은 임금 청구기간과 기산점을 구분하므로 유지. | 포르투갈 근로자와 고용주·청구액을 특정한 뒤 임금/연장근로/상여/비용을 나누고, 근로관계·복수국 근무·서비스계약의 적용 범위를 한정한다. 세 문장 모두 다른 정보가 있다. |

오프닝 유형은 694 결과, 695 조건부 지급 분쟁, 696 승인 요건, 697 독자 질문, 698 기록 보존기간이다. 같은 유형이 배치 절반을 넘지 않는다. 허구의 의뢰인 사례나 개인 경험을 만들지 않았다.

## 기존 같은 언어 3편과의 비교

실제 로컬 원고의 날짜·첫 두 본문 문단·소제목·끝부분을 확인했다. 기존 18편 모두 `published`가 없어서 새 게시일을 임의로 만들지 않았다. 아래는 `date_display` 순으로 가장 최근인 두 편과 같은 2025-09-13 표시일군에서 `lastmod`가 가장 늦은 016을 선택한 비교다. 이것이 라이브 사이트의 정확한 직전 게시 순서라는 증거는 없다.

| 비교 원고 | 표시 날짜 / lastmod | 구체 비교 |
|---|---|---|
| `018-taiwan-semiconductor-market-entry.md` | 2026-09-17 / 2026-10-07 | `Quando as operações com clientes taiwaneses começam...`로 운영·재고·인력 조건을 모은 뒤 법인 설립 질문을 던진다. 번호가 붙은 장과 별도 상담 장이 길다. 새 694–698은 한 사건 단계로 바로 들어가며 번호별 대백과 형식을 반복하지 않는다. |
| `011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md` | 2026-02-04 / 2026-07-25 | 첫 두 문단이 수입자·제품등록·PIF·광고를 한꺼번에 열거하고 `A seguir explicam-se em separado...`로 목차를 예고한다. 새 원고에는 이런 예고문과 중국어 용어의 연쇄 삽입이 없다. 기존 긴 교육자료 면책 끝맺음과 달리 새 원고의 마지막 본문은 지급표·수취인·중재 서류·수권·임금표에 연결된다. |
| `016-taiwan-inheritance-custody-analysis.md` | 2025-09-13 / 2026-10-11 | `Quando um membro da família falecer...` 다음에 상속·부부재산·친권·후견을 길게 나열하고 11개 번호 장을 둔다. 새 글은 하나의 금전/수권 질문을 유지한다. 016의 원문 사람 작성자 푸터는 새 글에 복제하지 않았다. 기존 푸터의 실제 공개 렌더링은 이 검수 범위 밖이다. |

## 포르투갈어와 독자 효용

- `fatura`, `ficheiro`, `ecrã`, `contacto`, `equipa`, `registo`, `prémio`, `assiduidade`, `trabalho suplementar`, `sentença arbitral`, `mandatário`, `procuração`를 자연스럽게 사용한다. `arquivo`, `tela`, `contato`, `equipe` 등으로 흔들리거나 CLT/FGTS를 가져오지 않았다. `email`은 현지 일반용례로 허용된다.
- 694의 `transação`는 상거래 일반과 혼동될 수 있는 법률 용어지만 제736조에서 상호 양보로 분쟁을 끝내거나 예방하는 계약임을 즉시 설명한다. `renúncia`, `condição suspensiva`, `título executivo`의 효과가 실무 질문과 연결된다.
- 695는 포르투갈 은행 연락, 원본 이메일·헤더, 공급자/변경 지시자/수취인을 나눈다. 은행 통보를 자동 환급과 동일시하지 않고, 공급자 이메일 침해만으로 전손 책임을 정하지 않는다.
- 696은 기업 국적·판정지·기관을 혼동하지 않는다. 중국어 번역과 대만 승인 주체의 인증을 일반 포르투갈 공증으로 바꾸지 않는다. L1을 고치면 일반 독자가 나머지 판정의 효과까지 따라갈 수 있다.
- 697은 보수계약, 소송대리 수권, 회사 서명권, 각 심급, 송달, 개인 출석을 나눈다. 포르투갈에서 일반적인 apostila 절차를 대만 법원에 기계적으로 적용하거나 여행 불필요를 보장하지 않는다.
- 698은 정기 임금·상여·경비와 해고보상을 나누며, 임금/근태 기록 5년 보존과 청구기간의 근거·기산점을 구분한다. Portugal 복귀일을 새 기산점으로 제시하지 않는다.
- 모든 글의 제목·요약·3개 FAQ를 본문과 대조했다. 새로운 FAQ 수치나 책임 보장은 없다. 이메일은 글마다 한 번이며 최초에는 비민감 요약·상대방·쟁점/날짜를 보내도록 한다. 네 상담 언어를 밝히고 포르투갈어 상담을 약속하지 않는다. 문서 보존 안내를 원본 즉시 제출 지시로 만들지 않았다.

## 문장 다양성 제5절 독립 점검

MONOTONY: 중대한 단조로움 반려 사유 없음. 필요한 법적 구별을 삭제하거나 단문 수를 맞추려고 의미 없는 문장을 만들 것을 요구하지 않는다. O2는 한 문단 내부의 선택적 중복 정리이며 배치 전체를 기계적으로 재작성할 사유는 아니다.

1. 공유 CLI를 다섯 파일에 실제 실행했다. 명령은 `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <각 파일>`. 전부 `ko`로 오판정하여 exit 1을 반환했다. pt-PT 검증 PASS가 아니다. 지원하지 않는 언어에 대한 결과로 기록하며 이 점검을 충족했다고 주장하지 않는다.
2. 위 오프닝 5유형과 삭제 시험 확인. 상투적인 `Suppose`류나 허구 사례 시작은 없다.
3. 실제 짧은 문장은 각 글에 둘 이상 있다. 예: 694 `Quem é o devedor?`; 695 `Mantenha os originais.`; 696 `Onde foi proferida a sentença?`; 697 `Registe a data da notificação processual.`; 698 `Peça o fundamento e o cálculo.`. 긴 조문 설명과 짧은 판단 문장이 교차한다. 연락 안내는 44–55단어로 길지만 문단당 하나이고 필요한 네 언어·민감자료 조건을 담는다.
4. 본문 문단의 시작 단어를 세로로 읽었다. 694의 `Para`, `Na`, `O` 각 2회, 695의 `A`, `Uma`, `O` 각 2회, 696의 `Para`, `A`, `O` 각 2회, 697의 `Para` 2회, 698의 `Para`, `Uma`, `Em` 각 2회로 3회 반복은 없다. 제목·목록·출처 꼬리는 제외했다.
5. 인용 위치가 첫머리·문장 중간에 나뉘며 증거 준비 문단에는 인용 없는 문장도 있다. `주장(조문) → 다만`을 세 문단 연달아 복제하지 않는다.
6. 대조 문장은 민간 합의/집행권원, 실제 수령/이체 명령, 송달/내부 전달, 기록/청구기간처럼 법적 오해를 막는다. 독자가 한 적 없는 주장을 꾸며서 반박하지 않는다. 695 본문 독자 질문이 0개인 이유도 확인했다. 질문형 소제목과 FAQ가 있으나 본문에서는 시간 민감한 은행 연락·증거 보존을 직접 설명하므로 별도 질문을 삽입할 필요가 없다.
7. 마지막 본문은 694 실제 입금일, 695 세 참여 주체, 696 동일 채무자에 연결되는 서류, 697 합의/수령 권한, 698 항목별 기초·기한·수령액으로 끝난다. 판촉형 마무리는 없다.
8. 굵은 강조·새 공개 작성자·원어민/변호사 검수 주장·허구의 1인칭 경험 없음. 일반 정보 고지는 글별 대상에 맞게 한 문장이다.
9. 법적 조건과 수치가 문체 때문에 탈락한 곳은 L1 외에 찾지 못했다. L1은 조건을 삭제하는 수정이 아니라 예외 효과를 명시하는 수정으로 반환한다. 실제 HTML·화면·이미지 시각 검수와 최종 모든 법률 출처 검수는 별도 단계다.

### 실제 CLI 결과와 보조 진단

| 원고 | 공유 CLI 결과 (`ko`, exit 1) | 독립 보조 단어 기반 진단 |
|---|---|---|
| 694 | sentences 43; CV 0.460; short 0.023; `FAIL short_share` | 문장 41; CV 0.466; 8단어 이하 6개 |
| 695 | sentences 38; CV 0.481; short 0; `FAIL short_share` | 문장 36; CV 0.490; 8단어 이하 4개 |
| 696 | sentences 40; CV 0.449; short 0; `FAIL len_cv`, `FAIL short_share` | 문장 39; CV 0.462; 8단어 이하 4개 |
| 697 | sentences 45; CV 0.468; short 0; `FAIL short_share` | 문장 43; CV 0.472; 8단어 이하 3개 |
| 698 | sentences 48; CV 0.454; short 0; `FAIL short_share` | 문장 46; CV 0.449; 8단어 이하 7개 |

보조 진단은 frontmatter/제목/목록/출처 꼬리를 제외하고 링크는 라벨만 남긴 뒤 문장부호와 단어 경계로 센 값이다. 해당 언어의 검증된 점수나 규칙 예외 승인으로 사용하지 않는다. 문장을 읽은 판단을 보조하기 위한 것이며 697 단문 비율 또는 698 경계 CV 수치를 맞추기 위한 삽입을 요구하지 않는다.

## 독립 공식 조문 대조와 최종 검수 전달

이 검수에서 별도로 열어 읽은 자료:

- 중재법 [중국어 현행 전문](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=I0020001)과 [공식 영문 전문](https://mojlaw.moj.gov.tw/ENG/LawContentE.aspx?LSID=FL010105&media=print): 제47–50조 관련 문단, 특히 L1과 20일 기산점. 시행·개정 전체 이력과 국가별 상호승인 판례는 별도 최종 검수 대상이다.
- [민사소송법 제70조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=70): 원고 697의 특별수권·강제집행·쟁송물 수령·제한 기재 범위와 일치한다.
- [민법 제126조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=126), [제128조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=128): 698은 정기 급부별 5년과 권리 행사 가능 시점을 구분한다. 법 전체의 미시행 경고는 제166-1·1223조에 관한 것이므로 이 두 조문을 미시행으로 오독하지 않았다.

민법 제127–130조 관련 원고 오독도 점검했다. 694는 특정 시효기간이나 이메일 독촉의 영구 중단 효과를 주장하지 않으며, 이 짧은 합의 글에 새로운 기간을 억지로 넣을 필요가 없다. 698은 제126·128조의 정기 임금 범위로 한정하고 각 급부·중단 사유의 개별 분석을 남긴다. 제127조의 상품대금 2년을 임금에 옮기거나, 제130조의 6개월 후속조치를 무시한 독촉 효력을 주장하지 않는다.

최종 검수에서는 연구 ledger와 각 링크의 정확한 주장 적합성, 법 상태와 연락처를 모두 확정해야 한다. 이 locale PASS는 그 절차를 대신하지 않는다. 웹 도구가 반환한 공식 페이지를 읽었다는 증거이며 직접 origin HTTP 상태나 실제 공개 사이트 반영을 증명하지 않는다.

## 추가 UI 문구

`Artigos recomendados para leitores de Portugal` — PASS. 포르투갈어로 자연스럽고 독자 범위를 정확히 지칭한다. `portugueses`를 쓰지 않아 포르투갈 국적자만으로 대상이 좁아지지 않는다. 단수/복수 일치가 맞으며 추천 칼럼 섹션 제목으로 적합하다. 코드 변경은 root 소유다.

## 696 한 번의 수리 후 독립 재확인

작성자가 L1 권장문을 반영했다고 알린 뒤, 파일을 직접 다시 읽고 SHA-256을 재계산했다. 최초 `b729ec1f3d26e66c02b0cd524a15f10a26ae9501b540f420b5d1e0c9adf19c62`에서 최종 `e495bd598c2c2615e6532b56530f9f708e752dd65503cceba207567b7e8e1aac`로 바뀌었다. 다른 네 원고의 SHA는 위 표와 일치하여 바이트 변경이 없음을 확인했다.

최종 696:50은 권장문과 정확히 일치한다. 분리 가능한 초과 부분 때문에 나머지의 인정이 그 사유만으로 거절되는 것은 아니라는 의미가 분명하다. 제49조의 필요적/재량적 거절, 제50조 다른 사유와 통지 수령 후 20일, 세 FAQ를 다시 읽었으며 충돌이나 새로운 무조건 승인 보장은 없다. L1 CLOSED, 696 locale PASS. 선택 의견 O1·O2는 적용되지 않았으며 PASS를 막지 않는다.

공유 CLI도 수정 후 다시 실행했다. exit 1, `[ko] sentences=40 mean=102.8 cv=0.439 short=0.0 run3=0.053 opener_rep=0.188 cite_end=0.0 cite_para=0.25 contrast=0 caveat=0 q=2`, `FAIL len_cv`, `FAIL short_share`. 포르투갈어 미지원 한계는 그대로이며 점수 통과나 규칙의 언어 지원 완료를 주장하지 않는다. 수리 문장이 길어졌지만 법적 예외의 대상을 명확히 하는 것이 측정값을 맞추는 것보다 우선한다.

## 남은 범위

필수 locale 수정은 남아 있지 않다. 선택 의견은 저자 판단으로 처리할 수 있으며, 추가 변경이 있으면 그 버전의 영향을 재확인한다. 통과한 글을 임의의 추가 문체 취향 때문에 재작성하지 않는다. 최종 법률 검수, 구조 검사, 빌드, 실제 데스크톱/모바일 확인 및 게시 여부는 root 단계에 남는다.
