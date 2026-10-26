# Batch08 — FI/HR/HU/IS/KM/LV/MN 각 여섯 사건

2026-10-26. 기존49언어 각각 실질 전문 칼럼286편 목표의 다음42편이다. 현재 R에는 B6까지 전문2163/보드1896편이 통합됐으며 B7의42편은 별도 검수 중이다. 아래7언어는 각각 현재24개 Markdown이 있고 목표915/916/918/919/920/921은 모두 없다. B7 준비행렬의 다음순서와 실제 R 파일을 확인했다. 이를 공개 게시 완료 숫자로 부르지 않는다.

이 BRIEF와 [B7 공통 집필 계약](../batch07/BRIEF.md)을 함께 읽는다. B7 문서의 배정·경로만 아래 내용으로 대체하고, 정본/법률/이미지/메타데이터/문체/실제검사 계약은 그대로 적용한다. 새 Fable 게이트나 승인 절차를 만들지 않는다.

| 작성자 | locale | 정확한 허구 캡션 |
|---|---|---|
| root | fi | Kuvitteellinen kohtaus |
| column_source_quality | hr | Izmišljena scena |
| column_inventory | hu | Kitalált jelenet |
| column_existing_drafts | is | Skálduð mynd |
| column_live_audit | km | ឈុតឆាកប្រឌិត |
| column_pipeline | lv | Izdomāta aina |
| column_voice_rules | mn | Зохиомол дүр зураг |

각 작성자는 `batch08/src/content/columns-<locale>/` 원고6개, `reviews/<locale>-author.md`, `checks/<locale>-*`만 소유한다. B7에 배정받은 독립검수와 자기 언어의 교정이 있으면 먼저 마무리하고 새 집필을 시작한다. 독립검수자가 수신했다는 답변을 기다릴 필요는 없지만, 전달된 실제 필수교정은 방치하지 않는다. 다른 사람도 동시에 작업 중이므로 R·공유 검사기·타인 원고/검수/이전 기록을 수정하거나 되돌리지 않는다. root가 FI6을 직접 쓴다.

원문은 `batch06/research`의 동결 EN915/916 및 ZH918/919/920/921이다. 다른 언어 초안을 정본 대신 번역하지 않는다. 정본 전문·source-freeze·six-source-facts·authoring-contract-draft·source-register를 읽고 같은 SHA로 이미 읽은 것은 그 범위를 정직하게 재사용한다. 새 법원 접속 성공이나 전체416쪽 PDF 열람을 꾸미지 않는다.

| 정확한 파일명 | topic | FAQ 수 |
|---|---|---:|
| 915-taiwan-public-contract-mediation-arbitration-same-claim.md | litigation | 2 |
| 916-taiwan-parent-company-pollution-liability-us-investor.md | company | 3 |
| 918-taiwan-presale-mortgage-notice-handover-judgment.md | litigation | 3 |
| 919-taiwan-workplace-bullying-investigation-hearing-judgment.md | labor | 3 |
| 920-taiwan-apartment-ev-charger-common-area-judgment.md | litigation | 3 |
| 921-taiwan-online-game-coins-refund-judgment.md | litigation | 3 |

published/lastmod는2026-10-26이고 date_display는 같은 날짜를 현지화한다. 내부 author는legal-ai-assistant, audience는각locale하나다. 기존 원본 이미지 `/images/columns/<ID>-case-trends-20261025.webp`를 사용한다. alt는 실제 장면과 맞추고 이미지 열람 여부를 남긴다. 굵은 강조·공개 작성자/감수자·꾸민1인칭·국적 또는 상담언어 추정은 금지다. 제목·요약·태그·FAQ·출처명도 자연스러운 현지어로 쓴다.

공통 문체 정본, COLUMN-VOICE-RULE, SENTENCE-VARIETY-RULE, 현행 LESSONS를 적용한다. LESSONS는03:05 자동 재생성됐으며 root가 새 전문을 읽었다. 초기 SHA는 `checks/initial-lessons.json`에 있다. 과거 파일에 Fable 이름이 남아 있어도 사용자 결정에 따라 필수 하청·고정 절차를 부활시키지 않는다. 최근 비교글3편은 번호 크기가 아니라 실제 published 기준으로 선정하고 목록/기준을 기록한다. 현재 이7언어는 ARC704–706이 대상이다.

법적 구분은 B7 계약을 전부 따른다. 추가로 918의 엘리베이터는 설치 미완료라는 범위를 유지하고, 919 두 중대감점은 공개 보도에 있는 일회 처분의 맥락을 보존한다. 920의 ‘주민 계량기’ 연결을 계량기의 법적 소유권 판결로 넓히지 않는다. 921 제목은 법원이 환불청구를 받아들이지 않았다는 확인 범위에서 쓴다. 요약에서도 실무적 기록 대조 조언을 별도 법정 의무로 만들지 않는다. 상소/추가청구 기각의 현지 법률용어가 형식 각하와 본안 불인용을 혼동시키지 않게 한다.

독자의 실제 질문, 금액, 문서의 내용, 구체 장면을 섞어 여섯 도입을 설계한다. 같은 배치에서 사실·결과형 등 한 유형이3편을 넘지 않으며 장면형은2편을 넘지 않게 한다. 글마다 사실을 다시 강조하려고 ‘다르다/별개/아니다’ 틀을 계속 늘리지 않는다. 정확한 조건·예외의 설명은 남기고 중복 반박을 줄인다.

Node24를 PATH 앞에 둔 실제 공유 `variety_metrics.py check <파일> --lang <locale>`로 FAIL0과5절 자기검수를 남긴다. KM은 설치된 ICU 분절을 사용하고 임의 공백·다른 언어 프로필로 우회하지 않는다. 정상 구두점·기간·금액·출처를 점수 때문에 바꾸지 않는다. 실패는 보존하고 변경된 파일만 다시 검사한다. 현행 shared multilingual SHA는4af341932757be7a6b83f84a56ea24792f963653c9c3d008aacade2b79a084de, content-audit는3926a274bf544fed7e34339aa8b2636d41a4be79c0aaff898f46fc65595faf4b다.

구조검사는 실제 basename별 동결 정본 별칭과 ZH4/EN2 sourceLocale을 사용한다. `/en/contact`는 현재 등록된 경로이고 영어 페이지라는 링크 문구를 쓴다. `mailto:wei@hoveringlaw.com.tw`도 기존 허용 연락처다. 같은 언어의 실제 존재하는 내부 글만 연결한다. 본문 및 말미 공식 URL 보존, FAQ17개·이미지·날짜·원고SHA를 최종 기록에 묶는다. 저자 기록은 문제 문장·이유·수정안·의미 보존을 포함하고, 구조/문체PASS가 독립 의미·실제 표시·공개 게시를 뜻하지 않도록 구별한다.
