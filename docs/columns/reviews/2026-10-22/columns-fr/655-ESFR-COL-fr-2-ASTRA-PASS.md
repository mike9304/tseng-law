# ASTRA-PASS — fr / COL-fr-2 (taiwan-criminal-plea-bargaining-foreign-defendant)

검수 시각: 2026-10-22 22:55 KST (gate: Claude Code Opus 5.5, Astra limited until 10/27)
3회차 독립 최종 검수. 작성 세션(opus), 교차 검수 세션(grok), 1·2회차 게이트 세션과 별개인 새 Claude Code 세션이다. 판정: MAJOR 0, MINOR 0. 원고는 수정하지 않았다. 2회차 지적 파일은 `.ASTRA-FAIL-fixed-2.md`로 이름을 바꿨다.
대상 SHA-256: `5dc989587d78869a4b395afc8e34d22d6e0f032da3a0b6f555bc90ad3272cd9c` (READY에 적힌 값과 같다. 검수 시작과 끝에 다시 계산해도 같았다)

## 확인한 범위

- 교차 검수: `.WROTE-opus`, 비작성자 검수 `.CROSS-grok.md`(MINOR 3), 작성자 응답 `.CROSS-grok-response.md`. 세 건 모두 원고에 반영돼 있다. 455-7의 「coauteurs ou complices (共犯)」(22·51행), 455-10 제3항에 따른 1심 환송(20·59행), 455-6의 「抗告」 불가(47행).
- 1·2회차 게이트 지적: 1회차(`.ASTRA-FAIL-fixed-1.md`)는 최저형 기준과 검사 재량 「peut négocier, sans y être tenu」였고, 2회차(`.ASTRA-FAIL-fixed-2.md`)는 summary 협상 제외 목록의 고등법원 1심 사건이었다. 4행은 2회차가 제시한 문구 그대로 「…celles dont la peine minimale est d'au moins trois ans d'emprisonnement et les affaires que la Haute Cour juge en premier ressort.」이다. 18행 FAQ 1, 35행 본문과도 일치한다.
- 조문: 이 세션에서 LawSingle을 새로 열어 대조했다(`reviews/gate-esfr-20261022-r3/col2-law.txt`).
  - 刑事訴訟法 제4조, 제455조의2 제1~3항(제외 4유형, 기소 또는 簡易判決處刑 청구 뒤 1심 변론 종결 전, 徵詢被害人意見, 法院同意, 審判外, 4개 협상 사항, 2·3호 피해자 동의, 30일), 제455조의3(10일, 罪名·法定刑·喪失權利 고지, 철회·撤回), 제455조의4 제1항 7호, 제2항(緩刑·2년 이하·拘役·罰金), 제4항(3·4호 민사 집행권원)
  - 같은 법 제455조의5(6월 초과·非緩刑·指定辯護, 명시 의사에 반하지 않음), 제455조의6, 제455조의7, 제455조의9(筆錄 대체, 10일 내 판결서 청구), 제455조의10(제1항 단서 1·2·4·6·7호와 제2항 위반, 제2·3항)
  - 中華民國刑法 제41조 제1항(최중본형 5년 이하, 6월 이하, 1,000·2,000·3,000원, 단서), 제74조 제1·2·4항, 제95조(得, 有期徒刑以上), 제277조 제1항, 제320조 제1항(5년 이하·拘役·罰金, 최저 없음)
  - 入出國及移民法 제32조 제3호(1년 이상 확정, 과실·緩刑 제외, 撤銷或廢止 및 註銷)
  - 위 조문 모두 본문·FAQ·summary와 일치한다. 출처 목록의 개정일(刑訴 2026-05-13, 刑法 2026-07-22, 移民法 2023-06-28)도 LawSingle 표시와 같다.
- 판결 인용 없음. 특정 수사·재판 사건 서술 없음(도입의 학생·직원·여행자는 유형 나열). 프랑스 제도 비교 없음.
- 문체: 숫자로 여는 도입(「Deux ans d'emprisonnement.」), 「Encore faut-il que l'action publique soit engagée.」 같은 문장이 자연스러운 프랑스어 법률 해설이다. 소제목 7개는 쟁점을 말하는 평서·질문형이며 명령형·체크리스트형이 없다. 굵은 글씨·이모지 없음.
- 도구(이 세션 재실행, `reviews/gate-esfr-20261022-r3/tools.out`): `esfr_variety.py --lang fr` OK(cv 0.617, short 0.193, run3 0, cite_end 0.228, contrast 0). 공용 `variety_metrics.py`(fr 미지원이라 `--lang en`으로 근사) 위반 없음. `hygiene_col.py`·`hygiene.py` OK. `links.py`는 3편 합계 47개 URL 모두 200, bad 0.
- 형식: columns-es 652·644와 같은 키와 순서다. audience ["fr"], category 「Informations juridiques sur Taïwan」(columns-fr 기존 값), featured_image "TBD", caption 「Scène fictive」. alt는 가상의 법원 복도이며 이미지 브리프·`images/COL-fr-2-hero.jpg`와 맞고, 글자·로고·워터마크가 없다. FAQ 3개에 마크다운 링크 없음. 「## Sources」 첫 줄에 확인일이 있다.
- 연락: 曾雋崴, 昊鼎國際法律事務所, mailto 상담 링크, 두 주소(「19號6樓之1」). 응대 언어 문구는 게시본 columns-es 652·columns-fr 013/015와 같다. 전화번호·바이라인·서명·AI 표시·「검토 완료」 주장 없음.
- 중복·번역: EXISTING-TITLES와 다른 10/21·10/22 배치에 認罪協商 글이 없다. es 세트(COL-es-2 보석)와 질문이 다르고 번역본이 아니다.

대조 자료: `reviews/gate-esfr-20261022-r3/` (inputs.sha256, law/, col2-law.txt, tools.out).
