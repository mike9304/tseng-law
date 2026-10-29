# B12 FR6 독립 수정 종결 검수 r2

2026-10-29 KST. 판정: PASS — r1 필수 M01·M02가 해결됐고 선택 O01도 정확히 반영됐다. 필수 잔여 0개다. 이 판정은 r1의 독립 의미 검수에 아래 세 수정의 종결 확인을 더한 것이며, 새 여섯 편 전수검사나 공개 게시 승인을 뜻하지 않는다. 인간 원어민·변호사 검토를 주장하지 않는다.

작성자의 [r2 보고서](fr-author-r2-review.md), [manifest](../checks/fr-author-r2-manifest.json), [diff](../checks/fr-author-r2-exact.diff)를 대조한 뒤 실제 원고에서 수정 문장과 주변 문맥을 확인했다. 작성자 결과만 재인용하지 않고 [독립 스크립트](../checks/fr-independent-r2-audit.py)로 세 변경의 정·역치환, 현재 여섯 SHA와 FAQ, 변경 세 파일의 실제 CLI를 확인했다. [증거 JSON](../checks/fr-independent-r2-evidence.json)과 [독립 생성 diff](../checks/fr-independent-r2-exact.diff)를 보존했다.

## M01 — 919 FAQ2: 종결

수정 전:

> Lorsqu’il reçoit la plainte du salarié concerné, il doit empêcher la répétition du harcèlement, proposer les conseils, l’assistance et la protection nécessaires selon les besoins et les circonstances, et enquêter.

수정 후:

> Lorsqu’il reçoit la plainte du salarié concerné, il doit prendre des mesures visant à éviter la répétition du harcèlement, fournir les conseils ou l’assistance et les mesures de protection nécessaires selon les besoins du plaignant et les circonstances, et mener l’enquête.

`prendre des mesures visant à éviter`는 재발 자체의 결과 보장으로 읽힐 여지를 해소한다. `fournir`는 필요한 제공 의무를 복원한다. 신고 접수 조건, 신고인 필요와 사건 사정, 상담 또는 지원·보호의 연결, 조사 의무가 남아 있고 보호와 조사를 순차적인 단계로 바꾸지 않았다. FAQ의 앞뒤 문장과 본문은 그대로다. r1에서 새로 확인한 직안법22-2와 같은 의미이므로 M01을 종결한다. 이번 r2에서 새 판결문·법령 조회를 했다고 주장하지 않는다.

## M02 — 920 본문: 종결

수정 전:

> Cette aide visait les infrastructures communes. Il ne constituait ni une aide générale à tout achat de borne ni une autorisation de travaux accordée individuellement à chaque résident.

수정 후:

> Cette aide visait les infrastructures communes. Elle ne constituait ni une aide générale à tout achat de borne ni une autorisation de travaux accordée individuellement à chaque résident.

직전 주어 `Cette aide`와 `Elle`의 성이 일치한다. 공용 인프라 지원 범위, 일반 충전기 구입 지원으로 확대하지 않는 한계, 개별 주민의 공사 허가가 아니라는 한계가 그대로다. 실제 배열에서도 6단어 문장과 22단어 문장으로 정상 분리된다. M02를 종결한다.

## O01 — 918 자료 한계 고지: 반영 확인

수정 전:

> de suspendre un paiement, de refuser une livraison ou de réclamer un dommage.

수정 후:

> de suspendre un paiement, de refuser une livraison ou de demander réparation d’un dommage.

손해 자체를 요구하는 어색한 결합이 손해의 배상을 구한다는 자연스러운 표현으로 바뀌었다. 다른 거래의 지급 중단·인도 거절·배상청구권을 이 판결이 정해주지 않는다는 문장 전체의 한계는 유지된다. 선택 O01도 해결됐다.

## 범위·원복·실제 검사

세 파일에서 각 지정 문자열이 한 번만 치환됐다. 현재 원고에 역치환을 적용한 메모리상의 바이트는 독립 r1 SHA와 일치하며, 작성자가 보관한 수정 전 파일과도 완전히 같다. 파일을 실제로 원복하거나 덮어쓰지는 않았다. 독립 생성 diff와 작성자 diff는 바이트 동일하다. 숫자 문자열과 링크 문자열의 순서도 수정 전후 같다. 918·920 frontmatter 전부, 919의 FAQ2 해당 문장을 제외한 모든 frontmatter, 919 본문이 그대로다.

현재 FAQ 합계는 17개다. 발행일·lastmod 2026-10-26, 내부 author, audience, 이미지·캡션, 제목·요약 및 과거 출처 확인일에 추가 변경은 없다. 915·916·921은 독립 r1에서 검수한 SHA와 완전히 같으므로 기존 PASS를 유지하며 CLI를 새로 반복하지 않았다.

| ID | 현재 SHA-256 | FAQ | r2 처리 |
|---|---|---:|---|
| 915 | `0fff59d9dd6730c186d00581f6ffa2c6cc3d3b24c2730f57ccbf97ec5c069a0d` | 2 | r1 그대로 |
| 916 | `d73e0eda5a166c923c262e24135a44087009327260fd1e2c1cec07672bd8bf86` | 3 | r1 그대로 |
| 918 | `e79c6ed57707b91b4d447c1968ef9f27ccbcfad8f56d9e5f20d59b2a7c6c26e4` | 3 | O01 종결, CLI exit 0 |
| 919 | `ac918524db87f8cd5f1ce8928d7f53547cd8e5fe70dc904175cdb21180a74c15` | 3 | M01 종결, CLI exit 0 |
| 920 | `603b00348f4af44ea55160a62bd13db442d9bc4d2bbed53de08d5ec7e11362cc` | 3 | M02 종결, CLI exit 0 |
| 921 | `5cad35537d1cb1f4f384d1067726bf9f2512d731738391f73aec7315732ea506` | 3 | r1 그대로 |

변경 세 파일에 공유 `variety_metrics.py check <file> --lang fr`를 직접 실행했다. 각각 terminal exit 0, FAIL 0, WARN 0이다. 918은 41문장/CV .468, 919는 41문장/.472, 920은 44문장/.466이다. 919의 수정은 frontmatter FAQ에 있어 본문 지표에 영향이 없다. 918의 수정은 검사기에 포함되는 고지문에 있어 실제 CV에 반영된다.

`Sources et portée` 아래 고지문은 여전히 실제 문장 배열에 들어간다. 918 마지막2문장, 919·920 마지막3문장을 직접 확인했다. 파서·헤딩·공백·임계값을 우회하지 않았다. 세 변경은 도입·소제목·문단 오프너·인용 리듬·실질적인 마무리를 바꾸지 않으므로 r1 §5 판단을 유지한다. 새 MONOTONY 반려 사유는 없다.

r1 보고서 SHA `83ad721f93341361d892f3cbf218cb31e74b0544022acb77c5f1410047845bc7`와 manifest SHA `787c5b683e00c7305d70becc15c6a39101509e669a1a34965000cb189a434440`, r1의 증거 네 파일이 모두 그대로다. 공유 검사기 SHA도 그대로다. R HEAD는 `f294a05f2c7003260016fa852dfa16063a1ccfcc`이다. 이번 검수는 자신의 r2 기록만 작성했으며 원고·R·공유 도구·release72를 수정하지 않았고 빌드·배포도 하지 않았다.
