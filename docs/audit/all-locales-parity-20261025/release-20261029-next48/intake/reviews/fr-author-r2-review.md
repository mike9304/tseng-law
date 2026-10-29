# FR 작성자 수정 r2 — M01·M02·O01

2026-10-29 KST. 독립 검수 r1 보고서와 manifest를 전문 읽고 root가 수용한 세 수정만 반영했습니다. 필수 M01·M02와 선택 O01을 모두 처리했습니다. 변경 파일 918·919·920에 실제 공유 CLI `--lang fr`를 새 실행해 각각 exit 0, FAIL 0, WARN 0입니다. 이는 작성자의 수정·재검사 기록이며 독립 재검수나 게시 승인이 아닙니다.

[현재 SHA·메타데이터·FAQ·숫자·URL manifest](../checks/fr-author-r2-manifest.json), [정확한 세 old/new와 역복원 증거](../checks/fr-author-r2-edits.json), [실제 세 파일 diff](../checks/fr-author-r2-exact.diff), [CLI 출력](../checks/fr-author-r2-cli.json), [현재 문장 배열](../checks/fr-author-r2-sentences.json)을 보존했습니다. 수정 전 세 파일은 checks/fr-author-r2-before에 있으며, 최초 작성 때의 FAIL과 모든 이전 기록도 그대로입니다. 타인의 fr-independent-r1.md와 manifest는 SHA가 바뀌지 않았습니다.

## M01 — 919 FAQ2의 예방·지원 의무

수정 전:

> Lorsqu’il reçoit la plainte du salarié concerné, il doit empêcher la répétition du harcèlement, proposer les conseils, l’assistance et la protection nécessaires selon les besoins et les circonstances, et enquêter.

수정 후:

> Lorsqu’il reçoit la plainte du salarié concerné, il doit prendre des mesures visant à éviter la répétition du harcèlement, fournir les conseils ou l’assistance et les mesures de protection nécessaires selon les besoins du plaignant et les circonstances, et mener l’enquête.

`empêcher`가 재발 자체를 막는 결과 의무로 읽힐 여지와 `proposer`가 지원 제공을 제안으로 약화할 여지를 인정했습니다. 신고 접수라는 조건, 재발 방지 조치 채택의 의무, 신고인의 필요와 사건 사정에 따른 상담 또는 지원·보호, 조사 의무를 정확히 유지합니다. 본문의 조율 가능성과 불성립 뒤 조사 속행은 바꾸지 않았습니다. 기존 작성자 r1의 FAQ 강도 확인은 이 수정으로 보완됩니다.

본문은 바이트가 동일합니다. FAQ2 답변의 해당 한 문장만 변경했고 질문·FAQ1·FAQ3 및 나머지 메타데이터는 그대로임을 파싱해 확인했습니다. 이 수정은 본문만 측정하는 variety 지표에 영향을 주지 않습니다.

## M02 — 920 보조금 문단의 대명사

수정 전:

> Cette aide visait les infrastructures communes. Il ne constituait ni une aide générale à tout achat de borne ni une autorisation de travaux accordée individuellement à chaque résident.

수정 후:

> Cette aide visait les infrastructures communes. Elle ne constituait ni une aide générale à tout achat de borne ni une autorisation de travaux accordée individuellement à chaque résident.

여성형 주어 `Cette aide`를 받도록 `Il`을 `Elle`로 바꿨습니다. 앞선 작성자 수정에서 문단 첫 주어를 바꾸면서 놓친 문법 연결입니다. 공용 인프라 보조, 일반 충전기 구매 지원으로 확대하지 않는 한계, 개별 공사 허가를 부여하지 않는 한계는 동일합니다.

## O01 — 918의 배상청구 표현

수정 전:

> de suspendre un paiement, de refuser une livraison ou de réclamer un dommage.

수정 후:

> de suspendre un paiement, de refuser une livraison ou de demander réparation d’un dommage.

손해 자체가 아닌 그 손해의 배상을 구한다는 자연스러운 표현으로 바꿨습니다. 다른 매매에서 지급 중단·인도 거절·배상청구를 개별 판단해야 한다는 범위 고지는 유지합니다. 원래의 선택적 지적을 root 지시에 따라 반영했으며, 새로운 청구권을 덧붙이지 않았습니다.

## 현재 검사와 SHA

| ID | 이전 SHA-256 | 현재 SHA-256 | 실제 CLI |
|---|---|---|---|
| 918 | `7140732403fa2b42e508a85a39d334e758547b24dbd7c6a27a6efe47c119ceb7` | `e79c6ed57707b91b4d447c1968ef9f27ccbcfad8f56d9e5f20d59b2a7c6c26e4` | exit 0, CV .468 |
| 919 | `b01e101b016b1669dc93a74f08b263cf7ca092798d68eeb2fdcf421d6eaacc48` | `ac918524db87f8cd5f1ce8928d7f53547cd8e5fe70dc904175cdb21180a74c15` | exit 0, CV .472 |
| 920 | `2ebbc196e784ae7cf301acb4177f03813214876aeadefd96d15ce24c09809837` | `603b00348f4af44ea55160a62bd13db442d9bc4d2bbed53de08d5ec7e11362cc` | exit 0, CV .466 |

각 변경은 정확히 한 번의 문자열 치환이고 역치환하면 수정 전 바이트 전체가 복원됩니다. 세 파일의 숫자 문자열 순서와 링크 문자열 순서는 수정 전후 완전히 같습니다. 정본 공식 URL은 본문·끝 출처 모두에 남고, 기존 숫자·날짜·조문 anchor와 이미지 SHA도 유지됩니다. 918·920의 모든 frontmatter는 동일하고 919는 승인된 FAQ2 답변만 달라졌습니다. 발행일·lastmod·audience·내부 author·캡션과 출처 확인일도 그대로입니다.

915·916·921은 이전 작성자 manifest의 SHA와 바이트가 같아 CLI를 새로 반복하지 않았습니다. 현재 six-file manifest는 이를 새 검사로 표시하지 않고 기존 PASS 증거를 명시합니다. 전체 FAQ는 여전히 17개이며, 이번 변경 세 편의 FAQ는 각각 3개입니다.

현재 실제 배열을 읽어 세 수정이 문장을 잘못 나누지 않는지 확인했습니다. `Sources et portée` 아래의 고지문이 공유 추출기에 포함되는 기존 한계는 그대로이며 헤딩·파서·공백·임계값을 바꾸지 않았습니다. 그래서 O01의 두 단어 추가는 실제 CV에도 반영됩니다. 제목·도입·소제목·실질적인 끝 문단은 변경되지 않았고 §5의 오프닝·문단 시작·인용 리듬·사실에 묶인 마무리 판단도 유지됩니다. 긴 문장이 한 문단에 두 개 이상 몰리지 않음도 실제 배열에서 확인했습니다.

공유 도구와 독립 검수 파일의 SHA는 변하지 않았습니다. 이 수정에서는 새 웹 조회, 빌드, CMS·화면 검수, R/src 수정, 공개 배포를 하지 않았습니다. 독립 검수자의 M01 현행 조문 확인은 해당 보고서의 근거로 구분하며, 작성자가 새 판결문을 열람했다고 주장하지 않습니다. 위 세 diff와 현재 SHA를 독립 검수자에게 돌려줄 수 있는 상태입니다.
