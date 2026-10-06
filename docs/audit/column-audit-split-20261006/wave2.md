# 칼럼 감사·분할 레인 2차 묶음 — 007 다국어 · 133 · 135 · 137 (2026-10-06)

리드 Opus 5.5(MacBook). 정책 `POLICY.md` v1.1. 판정 근거: Fable 5.1 커버리지 표(`reviews/007-coverage-zh-en-ja.md`), 분할 경계표(`reviews/133-135-137-fable.md`), Sonnet 분류(`reports/classify-r1.md`).

## 007 taiwan-divorce-lawsuit-qna (변호사 명의, 변호사 직접 검토 미경유)
- zh-hant: 허브만. 절마다 zh 전용 칼럼(114·104·106·215·046·198·216·107·105·240·243·068·241)이 같은 깊이로 다뤄 원문 첫 실질 문단 + 링크로 줄였다. 재산·금전편은 분할 하한(1,541字) 미달·전용 칼럼과 중복이라 만들지 않음. FAQ 1–3만 유지. 원문 복원: 인척·제3자는 §1057 부양 의무자가 아니라는 문단, 외국 이혼 승인·효력은 판결/행정증명 등에 따라 다르다는 문장(검수 F1·F2).
- en: 허브 + 275 en판(같은 slug·번호, ko 275와 hreflang 클러스터). 허브 FAQ 1·2·3·6, 275 FAQ 4·5. 작성 지시문 유출 4곳("Do not state…") 제거. §1055-1 열린 목록("all circumstances … with particular attention to", 5·7호 포함).
- ja: 3편 — 허브(FAQ 1–3) / 275 ja판(FAQ 4–5, 267 「日台夫婦の財産」과 상호 보완 링크) / 307 새 ja 칼럼 `taiwan-divorce-children-custody-support-visitation`(FAQ 6, 원문 §8–§10, 242·021 링크). 일본 독자용으로 "韓国と台湾" → "日本と台湾"(독자 지정 1어).
- 공통 사실 정정(원문 확인): F-001 §1030-1 현행 「有失公平」+6요소, F-003 家事 §102①·§107②, F-004 문장 삭제, F-005 §1052①7 「不治之惡疾」, F-012 §1017 두 추정, §1052② 단서 2026-10-06 존속.
- 그림: 275 en/ja는 ko 275 그림 공유(alt·caption 언어별). 307은 새 Grok 정물(아이 신발·가방·노트, 사람·글자 없음).
- 검수: Fable(ja PASS 조건부 → 조건 반영), Sonnet 검수자(en PASS, zh FIX 1·권고 1 → 반영).

## 137 zh-hant → 137 + 308 (AI 작성, legal-ai-assistant)
- 137 「首例判決」 해설(국가안전법 첫 판결: 사실·4개 죄명·법인 벌금·확정 경과) / 308 `taiwan-engineer-leaving-job-trade-secret-risk` 이직 전후 위험(離職 前 출력 사건·합리적 보호조치·營業秘密法 §11 경업금지 만료 후, 107刑智上訴5 28nm 사건 이동).
- 사실 정정: F-014 國安法 §8⑥ 후단 둘째 요건 「或防止國家安全或利益受到重大危害情事者」, F-015 緩刑 불허 이유(3명은 2년 초과로 刑法 §74① 요건 자체 불충족, 1명만 재량), F-016 勞基法 §9-1④ 「逾二年者，縮短為二年」.
- 검수: Fable PASS(조건 번호·alt 반영). 판결 3건(107刑智上訴5·4, 104台上1589)은 원문 미열람 — 본문의 기존 한계 문장 유지.

## 133 zh-hant → 133 + 309
- 133 투자심의·對外投資·産創 §22 신제도(시행일 미정) / 309 `taiwan-semiconductor-core-key-technology-list-trade-secrets` 核心關鍵技術 清單·영업비밀·人員 赴陸. 국가안전법·영업비밀법 형사 설명은 요약 + 137 링크, 수출관제는 214 링크. TSMC 미국·독일 투자 배경(미확인 수치) 삭제.
- 사실 정정: F-013 언론 출처 매체명(두 기사 모두 經濟日報). 國安法 §18② 관할 반 문장 309에 복원.
- 검수: Fable PASS(조건 번호·alt 반영).

## 135 ja → 135 + 310
- 135 履約人員(대만 법인 없는 일본 장비업체의 이행 인력) / 310 `japanese-engineer-hired-by-taiwan-subsidiary-work-permit` 대만 자회사·지점이 일본인 기술자를 고용할 때. ゴールドカード·소득세는 027·212·024 링크.
- 사실 대조 오류 0(68건). 검수 FIX 4건(항목 분리·원문 어조 복원·법령 정식명칭 첫 언급·"91일 이상 구분" 보충) 반영.

## 공통
- 각 새 편: published 2026-10-06, register.py(embeddings-pending·publication-date·COUNTRY_COLUMN_FILES_20261006) 등록, en/ja 275는 언어별 목록에도 등록(068 선례), 영어 기준선 72→73.
- 그림 출처: `image-provenance/*.json`(Grok 4.7 generate_image, Mac Studio grok CLI).
