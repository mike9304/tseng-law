# ASTRA-PASS — fr / COL-fr-1 (taiwan-business-takeover-shares-or-assets-foreign-buyer)

검수 시각: 2026-10-22 22:26 KST (gate: Claude Code Opus 5.5, Astra limited until 10/27)
2회차 독립 최종 검수. 작성 세션(opus)·교차 검수 세션(grok)·1회차 게이트 세션과 별개인 새 Claude Code 세션이다. 판정: MAJOR 0, MINOR 0. 원고는 수정하지 않았다.
대상 SHA-256: `309706abcd8172d9933d4437891bf3a0cf9b2bccccaec3fcd9a207cbc7b3ab14` (READY에 적힌 값과 같고, 검수 시작과 끝에 다시 계산해도 같았다)

## 확인한 범위

- 교차 검수: `.WROTE-opus`, 비작성자 `.CROSS-grok.md`(MAJOR 3·MINOR 1), `.CROSS-grok-response.md`. 勞退條例 제12조를 신제 연차에만 적용·30일 지급, 구제 연차는 勞基法 제17조·勞退條例 제11조 제2항으로 분리(61행), 「de l'ancien employeur」 삭제와 「누가 지급하는지 조문이 정하지 않는다」(22·57행), 제20조를 事業單位改組或轉讓로 좁히고 설비만 사는 경우는 民法 제484조(59행), 公司法 제99조 「doit payer」(41행)가 원고에 반영돼 있다.
- 1회차 게이트 지적(`.ASTRA-FAIL-fixed-1.md`, MINOR 2): 4행 summary의 民法 제305조 요건(「sauf reprise globale de l'actif et du passif portée à la connaissance des créanciers」), 22행 FAQ 3의 「restent chez le vendeur」·「sans l'accord de ce salarié」 모두 반영됐다. 67행의 같은 뿌리 수정(「hors le cas prévu par l'article 305」)도 조문과 맞다.
- 조문: 이 세션에서 law.moj.gov.tw LawSingle을 새로 열어 대조했다(`reviews/gate-esfr-20261022-r2/law/`, `col1.txt`). 外國人投資條例 제2·4·7·8·10조, 公司法 제12·99·111·393조, 公司登記辦法 제4조, 民法 제305·443·484조, 勞動基準法 제16·17·20조, 勞工退休金條例 제11·12조 — 번호·항·내용이 모두 일치. 출처 목록의 개정일(1997-11-19, 2025-12-26, 2021-04-23, 2026-08-17, 2024-07-31, 2019-05-15)도 LawAll 표시와 같다.
- 판결 인용 없음. 프랑스 제도와의 법 비교 없음(「pas-de-porte」는 頂讓金 풀이). 리옹 출신 부부의 빵집은 「(scène fictive)」로 표시된 가상 장면이다.
- 문체: 원어민 프랑스어 칼럼으로 자연스럽다(「Que vaut une boulangerie sans son local ?」, 「Le point décisif est ailleurs.」). 명령형·체크리스트 소제목·굵은 글씨·이모지 없음. 이 세션 재실행: `tools/esfr_variety.py --lang fr` OK(cv 0.556, short 0.123, run3 0.091, cite_end 0.175, contrast 0), `hygiene_col.py`·`hygiene.py` OK, `links.py` 21개 bad 0.
- 형식: 게시된 columns-es 652와 같은 키·순서(title~author, tags, featured_image_caption), audience ["fr"], featured_image "TBD", 가상 빵집 alt, caption 「Scène fictive」, FAQ 3개에 마크다운 링크 없음, 「## Sources」 첫 줄 「Date de consultation : 22 octobre 2026.」, 출처마다 이름·날짜·URL. 이미지 브리프(인물·로고·글자 없음, AI 표시 없음) 정상.
- 연락: L'avocate Wei Tseng (曾雋崴), Hovering International Law Firm (昊鼎國際法律事務所), mailto 링크, 두 주소(7樓之2, 「19號6樓之1」). 전화번호·바이라인·서명·저자 박스·AI 표시·검토 완료 주장 없음(front matter 내부 토큰 author만).
- 중복: research/EXISTING-TITLES.txt와 라이브 sitemap(fr은 001~018 번역 칼럼뿐). fr 017(물류업 인수와 운송업 허가 승계)·en 515(인수 뒤 엔지니어 고용)·ja 349(일본 기업의 대만 기업 인수 심사·결합신고)와 독자 질문이 다르다. 이 글은 작은 가게를 넘겨받는 외국인 개인이 지분과 영업·자산 중 무엇을 사는지, 그에 따른 동의(公司法 111)·채무(民法 305)·임대차(民法 443)·직원(勞基法 20)을 다룬다. es 세트(1인 유한회사 이사, 보석, 스페인 문서 인증, 치와와, ICEX)와 겹치지 않고 번역이 아니다.

대조 자료: `reviews/gate-esfr-20261022-r2/` (inputs.sha256, law/, col1.txt, tools.out).
