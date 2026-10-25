# PT6 저자 후속 기록 R2

2026-10-26 KST. 독립 R1의 필수 M01과 선택 S01을 반영했다. 현재 변경은920·921의 한 문장씩이며, 나머지4편은 원고와 기존 측정치를 유지한다. 독립 재대조 전 저자 동결 상태다. 인간 원어민·변호사 검수나 발행 승인을 주장하지 않는다.

초기 저자 보고서 `pt-author.md`와 독립 R1 `pt-independent.md`는 변경하지 않았다. R1 저자 manifest는 `checks/pt-author-manifest-r1-preserved.json`에 바이트 그대로 보존했으며 SHA208737441560a31745330d37da46f27537edddbef3c5d7e953793dd83da6cfbe가 같다. 현재 manifest만 이번 최종 원고를 가리키도록 갱신한다.

## 실제 수정

| 지적 | 원문 → 최종 문장 | 이유와 의미 보존 |
|---|---|---|
|M01·920|`Já o ponto quatro do mesmo parágrafo trata ...` → `Já o ponto quatro do parágrafo um do artigo 6 trata ...`|직전 문장의 제3항과 혼동되지 않도록 제6조 제1항 제4호를 명시한다. 제6조 제3항의 협의 후 구제 가능성, 법원의 해당 분류 배척, 단지 규약의 별도 동의·검사 요건은 그대로다.|
|S01·921|`Não recebeu esse reembolso.` → `O tribunal julgou o pedido improcedente.`|확인하지 않은 실제 지급·수령 이력을 암시하지 않고 청구를 받아들이지 않은 재판 결과로 한정한다. NT$243.548은 여전히 청구금액이며 후속 집행 결과를 추가하지 않는다.|

921에는 먼저 제안 그대로 `O tribunal não acolheu esse pedido de reembolso.`를 적용했고, 실제 shared 검사에서 CV .449/exit1이 나왔다. 그 결과를 지우지 않았다. 같은 문장을 직접적인 재판 결과 표현인 `julgou o pedido improcedente`로 다듬고 이미 앞에서 제시한 환급 요청의 중복 수식을 줄였다. 법률 문장·기한·조문·도구 임계값은 추가 변경하지 않았다. R1에서 최종본까지는2곳의 변경이며, 중간 표현을 포함한 실제 치환은3회다.

초기 두 치환과 실패는 `pt-review-r2-edits.json` 및 `pt-review-r2-variety.json`, 한 문장 후속 수정은 `pt-review-r2-prose-followup.json`, 최종 R1→R2의 정확한 diff는 `pt-review-r2-final-edits.json`에 보존했다. 최종 치환을 역적용하면 두 편의 R1 SHA가 정확히 복원되고, 기존7개 저자 수정 내역까지 역적용하면 해당 두 편의 최초 원고 SHA도 정확히 복원된다.

## 범위와 검사

두 편 모두 frontmatter 전체와 FAQ3개씩이 바이트 동일하다. 모든 URL·출현 순서,금액·기산·환급 예외·부정·허구 이미지 표시는 변하지 않았다. 제6조를 명시하기 위한 숫자6만 해당 본문 참조에 추가했다. 조문 내용을 새로 확대하지 않았다.

현재 공유49의 실제 PT profile에서920은41개 구간/CV .459/exit0/FAIL0,921은41개 구간/CV .453/exit0/FAIL0이다.920의 성공 측정은 이후 본문 변경이 없어 그대로 사용했고921만 후속 문장 수정 뒤 재실행했다. 나머지4편을 다시 실행했다고 기록하지 않는다.

`pt-review-r2-final-boundaries.json`에서 R1의 실제 문장 배열과 현재 두 편을 대조했다. 각1문단의1문장만 바뀌었고, 그 외 문단 배열은 완전히 동일하다. 변경된 문단의 전후 모든 실제 구간과 인접 조문 설명을 읽었다.920의 `parágrafo um do artigo 6`는 한 문장 안에 남고,921의 NT$243.548과 판결 식별자도 잘리지 않는다. §5는 동일한 도입·자료별 결말·질문·인용 분포를 유지하며, 두 변경이 새로운 반복 시작이나 기계적인 단문을 만들지 않았음을 확인했다.

설치된 R content-audit SHA3926a274bf544fed7e34339aa8b2636d41a4be79c0aaff898f46fc65595faf4b로 바뀐2편만 실행했다. 정본 언어 zh-hant와 실제 원고 overlay·정본 SHA를 확인했고 오류0,검토항목10개,semanticStatus REVIEW_REQUIRED/publicationReady false다. 정상 포르투갈어 `todo`는 그대로 남아 있다. 초기 TODO 오탐과 부모 후보의 검사 기록은 과거 증거로 보존하며 현재2편 R 검사와 구별한다.

## 최종 원고

- 920: `0e3c9f74b6c48427841020e5381528ce8a7406702352a45a254bbfd403ba4dca`
- 921: `1dba99a240d62a669a3d553e192431d7670faa64c0788f079cede63e7af00af6`

915·916·918·919는 기존 저자/독립 R1 SHA와 동일하며 검사를 반복하지 않았다. 원고·공용 도구·R·다른 언어 파일을 이 수정 범위 밖에서 바꾸지 않았다. 원래 두 지적의 역사와 독립 판정은 R1에 그대로 있고, 수정된 SHA의 의미 확인은 독립 검수자가 수행한다.
