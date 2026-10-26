# Batch07 — 같은 여섯 사건의 다음 일곱 언어

2026-10-26 KST. 이 묶음은 전체49언어 각각 실질 전문칼럼286편이라는 기존 목표의 다음 단계다. 각 언어의 통합된 칼럼 수와 여섯 주제의 누락을 조사해 bg/bn/ca/da/el/et/fa를 배정했다. 모든 대상은 여섯 글이 아직 없으며 B6의 de/it/ar/pt/hi/ms/ru42편과 겹치지 않는다. 현재 main의 공개 반영 지연과 별개로 집필을 진행한다. 이 BRIEF는 새 사용자 승인 절차나 Fable 고정 게이트를 만들지 않는다.

## 소유권

| 작성자 | 언어 | 정확한 허구 캡션 |
|---|---|---|
| column_source_quality | bg | Измислена сцена |
| column_inventory | bn | কাল্পনিক দৃশ্য |
| column_existing_drafts | ca | Escena fictícia |
| column_live_audit | da | Fiktiv scene |
| column_pipeline | el | Φανταστική σκηνή |
| column_voice_rules | et | Väljamõeldud stseen |
| root | fa | صحنه خیالی |

작가는 `batch07/src/content/columns-<locale>/`의 여섯 원고, 자기 언어의 `reviews/<locale>-author.md`, `checks/<locale>-*`만 소유한다. 다른 작성자·검수자의 파일, R, shared checker와 기존 기록을 수정하거나 되돌리지 않는다. B6 자신의 원고 교정이 배정되어 있다면 그 교정을 먼저 닫고 B7을 시작한다. 커밋·통합·빌드·게시의 권한은 별도 부모 배정에 따른다. Root도 페르시아어 여섯 편을 직접 쓴다.

## 원문과 파일

동결 입력은 `../batch06/research/`다. `source-freeze.json`, `canonical-snapshots/`의 여섯 전문, `authoring-contract-draft.md`, `six-source-facts.md`, `source-register.md`를 읽는다. 이 연구 묶음의 실제 입력·성공/실패 이력과 SHA를 재사용하고, 이미 읽은 동일한 파일을 다시 읽은 횟수를 성과로 기록하지 않는다. B6 BRIEF의 법적 구분·이미지·메타데이터 계약은 아래 언어 배정만 바꾸어 적용한다. B6 다른 언어 초안을 정본 대신 번역하지 않는다.

| 정확한 파일명 | 정본 | topic | FAQ |
|---|---|---|---:|
| 915-taiwan-public-contract-mediation-arbitration-same-claim.md | EN915 | litigation | 2 |
| 916-taiwan-parent-company-pollution-liability-us-investor.md | EN916 | company | 3 |
| 918-taiwan-presale-mortgage-notice-handover-judgment.md | ZH918 | litigation | 3 |
| 919-taiwan-workplace-bullying-investigation-hearing-judgment.md | ZH919 | labor | 3 |
| 920-taiwan-apartment-ev-charger-common-area-judgment.md | ZH920 | litigation | 3 |
| 921-taiwan-online-game-coins-refund-judgment.md | ZH921 | litigation | 3 |

원본 이미지 경로는 `/images/columns/<ID>-case-trends-20261025.webp`다. Root는 여섯 원본 이미지를 실제로 열어915 안전모·도면·바인더·교량 모형,916 토양 용기·노트·접이식 탁자·공장,918 서류·봉투·상자 하나,919 원탁·파일철 하나·의자 셋,920 기둥 부착 충전기·전기차·상부 배선,921 컨트롤러·게임 화면·토큰·노트를 확인했다. alt는 이 내용에 맞게 현지화한다. 다른 작업자의 열람을 자기의 직접 열람으로 표시하지 않는다. 실제 사건 현장으로 소개하지 않는다.

published/lastmod는2026-10-26, date_display는 해당 언어의 자연스러운 같은 날짜다. 기존 DA704의25일을 복사하지 않는다. audience는 정확한 locale 하나, 내부 author는 legal-ai-assistant다. 기존 title/summary/tags/read_time을 영어로 복사하지 않는다. 굵은 강조·strong/b 우회·공개 작성자/검수자 이름·인간 승인 주장은 넣지 않는다. 공식 URL은 정본 전체와 말미 목록에서 보존한다. target 언어에 존재하는 내부 칼럼만 그 언어로 연결하고, 필요하면 기존 영어 문의 페이지임을 링크 문구에 밝힌다. 같은 사이트의 `/en/contact`는 현재 audit tool이 실제 legacy 등록 경로로 인식한다.

문체 정본·COLUMN-VOICE-RULE·SENTENCE-VARIETY-RULE·LESSONS와 목표 언어의 최근 칼럼3편을 읽는다. 연속 작업에서 이미 읽은 동일 규칙은 불필요하게 재독하지 않는다. 홈 editorial-voice.md가 없으면 그 사실을 기록하고 실제 프로젝트 문체 정본을 적용한다. 독자의 언어를 국적·체류국으로 치환하거나 상담 언어를 새로 약속하지 않는다.

## 앞선 독립검수에서 확인된 번역 주의점

- 919의 의무는 재발 방지 조치를 취하는 것이다. 결과적으로 괴롭힘이 절대로 재발하지 않도록 보장할 의무로 강화하지 않는다. 신고인의 뜻에 따른 조율 가능성과 합의 불성립 후 조사 속행을 보존한다.
- 921의 남은 금화는 대결용 칩이라는 기능이 핵심이다. 남아 있는 칩이 이미 전부 사용되었다는 사실을 추가하지 않는다. 미사용 조건이 유료 포인트와 게임비용 두 반환 대상에 모두 걸리도록 현지어 문법상 명확히 쓴다.30일 반환 또는 쌍방 합의 대안을 보존한다.
- 918의 사건4개월과 현행6개월 비교는 작성자의 현행법 대조다. 과거 법원이2026년 규정까지 비교했다고 요약하지 않는다. 預售屋는 미완공 주택이며 반드시 착공 전인 주택으로 좁히지 않는다. 상소 불가는 ‘상소 안내가 없다’가 아니라 실제 불가라는 결론으로 옮긴다.
- 920의 제6조 제1항 제4호를 직전의 제3항과 혼동하지 않는다. 특정 조문 논거를 확인 없이 주민에게 귀속하지 말고 법원의 적용 판단을 중립적으로 기술한다. 법11조와 단지 규약15조는 서로 다른 근거다. 법명을 설명적으로 번역하는 경우 공식 번역 표제라고 주장하지 않는다.
- 요약과 FAQ도 본문과 같은 강도로 쓴다. 기록을 비교하면 도움이 된다는 실무 설명을 현행법의 의무로 만들지 않는다. 준비 조언이 분쟁을 반드시 예방한다는 결과 보장으로 바뀌지 않도록 한다.

사실표의 중요한 조건은 계속 적용한다. 915는 공사 또는 기술서비스·해당 분쟁의 권고 또는 안·기관 부동의로 인한 조정 불성립과 별도 중재합의 가능성,916은154조 누적 요건과246명 환송/262명 관련 상고기각,920은 당사자 주장에 대한 가정적 판단·보조 기한 경과·확정 미확인을 보존한다. 미국 자료의 원래 국적·조건부 의향을 새 언어 국가로 바꾸지 않는다.

26일 연구에서 재접근에 실패한 법원 자료와 실제25일 회신 재사용,26일 현행법·정책 확인을 구별한다. 새 웹 확인을 하지 않고26일 판결 전체를 새로 보았다고 쓰지 않는다. 새 오류나 불안정한 현행 사실이 있으면 공식 근거로 확인하고 실제 조회 범위를 기록한다.

## 제출과 필요한 검증

각 원고를 완결된 현지어 설명문으로 직접 쓴다. 정본의 문장 길이·소제목·문장 순서를 기계적으로 복제하지 않는다. 실제 문제 문장·이유·수정안·의미 보존을 저자 기록에 남기고 초기 실패를 보존한다. 최신 R audit tool은 `3926a274bf544fed7e34339aa8b2636d41a4be79c0aaff898f46fc65595faf4b`, 공유 multilingual module은 `4af341932757be7a6b83f84a56ea24792f963653c9c3d008aacade2b79a084de`다. 후자는 DE 날짜만 고친 것으로 이 일곱 언어의 규칙·단위·임계값은 바뀌지 않았다.

Node24를 PATH 앞에 둔 실제 공유 검사 `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <파일> --lang <locale>`를 실행해 FAIL0과5절 자가검수를 남긴다. 추출 경계를 실제 읽고 조문·금액·날짜·약어를 확인한다. 검사 오류를 피하려고 정상 구두점·법적 조건·출처를 삭제하거나 다른 언어로 우회하지 않는다. 원고가 바뀌지 않은 전체 검사나 동일 회귀 검사를 관성적으로 반복하지 않는다.

구조 검사에는 실제 canonical basename과 sourceMap을 사용한다. 연구 스냅샷의 `zh-`·`en-` 접두사가 slug를 바꾸지 않도록 읽기 전용 별칭을 만들거나 R의 SHA일치 원문 경로를 사용한다. 원문 ZH4/EN2의 sourceLocale을 명시해 의미 검수 항목이 맞는 언어로 남도록 한다. 같은 수치·FAQ 수·공식 URL·이미지·본문과 최종SHA를 묶어 제출한다. 구조 PASS와 저자 검수가 독립 의미 검수·실제 렌더링·공개 배포를 대신하지 않는다.
