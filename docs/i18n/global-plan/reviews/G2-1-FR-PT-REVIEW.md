# G2-1 독립검토 — fr·pt 안내 로케일 (커밋 04677e16)

> **닫힘 (2026-09-19):** FIX 16은 `WO-G2-1-R1` → 커밋 `69330894`에서 반영. 지연 도착한 동일 검토를 다시 열지 말 것.

검토자: 독립 리뷰어(구현자 아님) · 프랑스어/유럽 포르투갈어 모어 수준
대상: `04677e16` on `i18n/global-picker-20260918`
워크트리: `/Users/son7/Projects/tseng-law-global-picker-20260918`
기준: `docs/i18n/global-plan/WO-G2-1.txt` · `docs/seo/sea-geo-plan/PROMPT.md` §4 · `docs/seo/reviews/DE-ES-COLUMNS-FABLE51-WO-20260917.md` "제품 잠금"
검토일: 2026-09-18 · 파일 수정 0건 (읽기·grep·git show·지정 vitest 4개 파일만)

---

## (A) 판정

**PASS — 블로킹 0건.**

7개 하드 룰(언어 잠금 / 대만 광고규정 / 사실 충실성 / 여성형 / 격식·정서법 / 기존 팩 불변 / 테스트 유효성) 모두 통과했다. 상담 언어 잠금은 두 로케일 모두 페이지 본문·FAQ·llms.txt·문의 폼 옵션 네 층에서 명시적으로 유지되고, `availableLanguage`는 손대지 않았으며, 기존 7개 로케일 본문은 한 줄도 바뀌지 않았다. 금지 광고 토큰은 fr/pt 전체 문자열에서 0건이다.

다만 **FIX 16건**(프랑스어 문법·타이포그래피 9, 포르투갈어 관용·정확성 5, 테스트·툴링 2)과 **NOTE 8건**이 남는다. FIX는 배포 차단 사유는 아니지만, 원어민 독자에게 즉시 번역 품질로 읽히는 항목(특히 #1 NBSP 전면 누락, #12·#14 포르투갈어 비관용 표현)과 죽은 단정문(#17)을 포함하므로 후속 WO에서 닫아야 한다.

집계: BLOCK 0 · FIX 16 · NOTE 8

---

## (B) 발견 사항

### 프랑스어 — 타이포그래피·문법

| # | 등급 | 파일:줄 | 인용 | 문제 | 수정안 |
|---|---|---|---|---|---|
| 1 | FIX | `src/data/international-guidance-western.ts:986-1472` (58곳) + `-answers.ts:270-296`, `-team.ts:964-1013`, `international-inquiry-copy.ts:626-668`, `llms-txt.ts:568-575` | `'Quelles affaires le cabinet traite-t-il ?'` · `'Langue de consultation : la consultation a lieu…'` · `'la page « Contact » explique…'` | 프랑스어 고정 공백(U+00A0)이 팩 전체에 **0개**. `?` `:` `;` 앞과 `« »` 안쪽이 모두 일반 공백(U+0020) 58곳. 일관성은 있으나(혼용 아님) 렌더링 시 `?`·`:`가 홀로 다음 줄로 넘어갈 수 있는 프랑스어 조판 결함. 레포 전체에 NBSP 선례 없음(`grep -rlP '\xc2\xa0' src/` → 0건)이므로 de/es 승계가 아니라 fr에서 처음 필요해진 항목 | 해당 58곳의 선행 공백을 U+00A0(또는 세공백 U+202F)으로 교체. 예: `'Quelles affaires le cabinet traite-t-il\u00a0?'`, `'Langue de consultation\u00a0: la consultation…'`, `'la page «\u00a0Contact\u00a0» explique…'` |
| 2 | FIX | `international-guidance-western.ts:1109` | `'Nous accompagnons des investisseurs et des entreprises étrangers pour constituer ou exploiter une société à Taïwan : …'` | 혼성 명사 병렬에서 남성 복수 `étrangers`가 여성 명사 `entreprises` 바로 뒤에 붙어 일치 오류로 읽힌다. 독일어 원문은 `ausländische Investoren und Unternehmen`으로 형용사가 선행하므로 이 문제가 없다 | `'Nous accompagnons des entreprises et des investisseurs étrangers pour constituer ou exploiter une société à Taïwan : …'` (어순만 교체) |
| 3 | FIX | `international-guidance-western.ts:1137` | `'Nous accompagnons à l’enquête et devant le tribunal, pour la personne mise en cause ou accusée comme pour la victime, …'` | `accompagner à l’enquête`는 프랑스어에 없는 결합. 독일어 `Wir begleiten im Ermittlungsverfahren`은 목적어 생략이 가능하지만 프랑스어는 목적어 또는 다른 동사가 필요하다 | `'Nous intervenons au stade de l’enquête et devant le tribunal, pour la personne mise en cause ou accusée comme pour la victime, …'` |
| 4 | FIX | `international-guidance-western.ts:1330` | `'… il convient de chercher en parallèle d’autres voies sur votre lieu.'` | `sur votre lieu`는 비문. 독일어 `an Ihrem Ort` / 스페인어 `donde usted se encuentre`를 직역하다 무너졌다 | `'… il convient de chercher en parallèle d’autres voies là où vous vous trouvez.'` |
| 5 | FIX | `international-guidance-western.ts:1145`, `:1427` | `'Déposer une demande ne signifie pas, à soi seul, qu’elle sera accordée.'` · `'Lire cette page, envoyer un formulaire ou un courrier ne crée pas, à soi seul, une relation…'` | 부정사 주어에는 `à lui seul`(또는 `en soi`)이 표준이고 `à soi seul`은 부정 주어에만 쓴다. 같은 팩의 `:1002`·`:1320`은 이미 `à lui seul`을 쓰므로 내부 비일관까지 겹친다 | `:1145` → `'… ne signifie pas, à lui seul, qu’elle sera accordée.'` / `:1427` → `'… ne crée pas, à lui seul, une relation entre avocate ou avocat et client.'` |
| 6 | FIX | `international-guidance-western.ts:1043` | `columnsReviewLabel: 'Relu par l’avocate Wei Tseng'` | `relu`(다시 읽음)는 교정·윤문을 뜻해 법률 검수의 의미를 낮춘다. 독일어 `Geprüft von Rechtsanwältin Wei Tseng`, 스페인어 `Revisado por la abogada Wei Tseng`는 모두 '검토·확인'이다. 변호사 검수 표시는 신뢰성 라벨이므로 의미 축소가 그대로 남으면 안 된다 | `columnsReviewLabel: 'Révisé par l’avocate Wei Tseng'` |
| 7 | FIX | `src/data/international-guidance-answers.ts:280` | `'L’avocate Wei Tseng (曾雋崴) est habilitée à exercer à Taïwan et avocate dirigeante du cabinet ; elle travaille avec…'` | `est habilitée à exercer`(동사구)와 `avocate dirigeante`(명사 술어)를 한 `être`로 병렬해 비문이 됐다. 독일어는 `ist … zugelassen und geschäftsführende Anwältin`으로 가능하지만 프랑스어는 동사 반복이 필요하다. 스페인어(`:248` `está habilitada para ejercer en Taiwán y **es** la abogada directora`)·포르투갈어(`:312` `está habilitada a exercer em Taiwan e **é** a advogada diretora`)는 둘 다 동사를 반복했다 | `'L’avocate Wei Tseng (曾雋崴) est habilitée à exercer à Taïwan et elle est l’avocate dirigeante du cabinet ; elle travaille avec…'` |
| 8 | FIX | `src/data/international-guidance-team.ts:1008` | `'Appuie les échanges entre équipes par des systèmes documentaires et des flux de travail, sur la base de l’informatique.'` | `sur la base de l’informatique`는 프랑스어로 의미가 성립하지 않는다. 스페인어 원문 `con formación en informática`(정보공학 전공 배경)를 독일어 `auf Grundlage der Informatik` 쪽으로 직역한 결과 | `'Appuie les échanges entre équipes par des systèmes documentaires et des flux de travail, avec une formation en informatique.'` |
| 9 | FIX | `src/data/international-guidance-team.ts:996` | `'Paralegal avec de longues années comme paralegal senior dans plusieurs cabinets, chargé de l’appui procédural, du droit des sociétés et de l’investissement étranger.'` | 남성형 `chargé`로 성별을 단정했다. 원 3개 언어는 모두 성 중립(de `zuständig für`, es `a cargo del`, pt `a cargo do`)이고, 대상 인물 張芳瑀(Fang-Yu Chang)의 성별은 `src/data/team-members.ts`에 명시되어 있지 않다(영문 약력도 대명사 없음). 검증되지 않은 성별 단정은 하드 룰 4의 취지에 어긋난다 | `'Paralegal comptant de longues années d’expérience comme paralegal senior dans plusieurs cabinets, en charge de l’appui procédural, du droit des sociétés et de l’investissement étranger.'` (`en charge de`는 성 일치 없음) |

### 포르투갈어 — 유럽 포르투갈어 관용·정확성

| # | 등급 | 파일:줄 | 인용 | 문제 | 수정안 |
|---|---|---|---|---|---|
| 10 | FIX | `international-guidance-western.ts:1828` | `'Descreve o trato dos dados, não uma segurança técnica absoluta.'` | 두 건이 한 줄에 있다. (a) `o trato dos dados`는 스페인어 `el trato de los datos` 차용으로 포르투갈어에서는 오류다. PT에서 `trato`는 '태도·협정'이고 데이터 처리는 `tratamento`(RGPD 표준어)다. (b) 스페인어·독일어 원문은 "기술적 **보증**이 아니다"(`no una garantía técnica` / `nicht eine technische Garantie`)인데 PT는 "**절대적** 기술 보안이 아니다"로 바꿔, 절대적이지 않은 어떤 보안은 제공한다는 함의를 남긴다. 면책 문구의 의미 약화 | `'Descreve o tratamento dos dados, não uma garantia técnica.'` |
| 11 | FIX | `international-guidance-western.ts:1758` | `'… não prometemos uma advogada ou um advogado concreto e não pomos um serviço de interpretação.'` | `não pomos`는 스페인어 `no ponemos intérprete` 직역. 문법은 성립하나 EP에서 서비스 제공에 `pôr`를 쓰지 않는다 | `'… não prometemos uma advogada ou um advogado concreto e não disponibilizamos serviço de interpretação.'` |
| 12 | FIX | `international-guidance-western.ts:1665`, `:1672`, `:1702` | `'… pode ser falado numa das quatro línguas de consulta'` · `'… esse processo deve ser falado diretamente com uma advogada ou um advogado'` · `'… o montante e o modo de cálculo são falados e confirmados consigo'` | 스페인어 `hablarse`를 `ser falado`로 옮겼다. 포르투갈어에서 `falar`는 사안·문서를 목적어로 받지 못한다(`falar um processo` 불가). 3곳 모두 동일 패턴 | `:1665` → `'… pode ser tratado numa das quatro línguas de consulta'` / `:1672` → `'… esse processo deve ser discutido diretamente com uma advogada ou um advogado'` / `:1702` → `'… o montante e o modo de cálculo são discutidos e confirmados consigo'` |
| 13 | FIX | `international-guidance-western.ts:1783` | `'Tratamos seis grupos: … e propriedade intelectual. Se um assunto se aceita ou não decide-se depois de rever o seu conteúdo.'` | 두 번째 문장이 비문이다. 스페인어 원문(`Si un asunto se acepta o no se decide después de revisar su contenido.`) 자체가 이미 망가진 문장인데 그 구조를 그대로 옮겨, PT에서는 대명동사 위치(`decide-se`)까지 더해 더 읽히지 않는다. 독일어 `Ob eine Sache angenommen wird, entscheidet sich nach Prüfung des Inhalts.`가 의도된 뜻 | `'Tratamos seis grupos: … e propriedade intelectual. A aceitação de um assunto decide-se depois de rever o conteúdo.'` (기존 es 팩은 수정 금지 대상이므로 pt만 바로잡는다) |
| 14 | FIX | `src/data/international-inquiry-copy.ts:713` | `unavailableLanguageNotice: 'Esta página não se oferece em {language}.'` | 스페인어 `no se ofrece en`의 직역. EP에서 페이지 가용성은 `estar disponível`로 쓴다. 같은 커밋의 프랑스어(`:663` `'Cette page n’est pas proposée en {language}.'`)는 자연스럽게 처리했다 | `unavailableLanguageNotice: 'Esta página não está disponível em {language}.'` |
| 15 | FIX | `src/data/international-guidance-answers.ts:302, 307, 312, 317, 322, 327` (6키 전부) | `'A consulta realiza-se em inglês, chinês, japonês e coreano.'` | 배타 한정어가 빠졌다. 독일어는 `Die Beratung erfolgt **nur** auf Englisch…`, 같은 커밋의 프랑스어는 `La consultation a lieu **seulement** en anglais…`인데 pt만 무한정. 답변 블록은 생성형 검색이 그대로 인용하는 GEO 표면이어서, 포르투갈어 페이지에서 배타성 없는 문장만 추출될 수 있다. (승인된 es 선례가 동일하게 한정어 없음 → 규정 위반은 아니고, 같은 페이지 본문 `international-guidance-western.ts:1559`·`:1793`와 `llms-txt.ts:578`에는 `apenas`가 있으므로 BLOCK 아님. 그러나 신규 두 로케일이 서로 다르게 처리된 비일관은 닫아야 한다) | 6키 모두 `'A consulta realiza-se apenas em inglês, chinês, japonês e coreano.'` |

### 테스트·툴링

| # | 등급 | 파일:줄 | 인용 | 문제 | 수정안 |
|---|---|---|---|---|---|
| 16 | FIX | `src/lib/__tests__/guidance-fr-pt-content.test.ts:117-123` | `it('does not offer a French-language consultation or interpreter', () => { const text = allText('fr'); expect(text).not.toMatch(/Beratung auf Deutsch/i); …` | fr 블록이 **독일어** 정규식을 검사한다. `guidance-de-es-content.test.ts:62`에서 복사된 죽은 단정문으로, 프랑스어 텍스트에서는 절대 실패할 수 없다. 또한 de/es 테스트에 있는 두 가지가 fr에 없다: 두 번째 금지 표현(de `deutschsprachige Beratung` / es `abogados que hablan español`에 해당하는 fr 형태)과, 통역 부인을 **양성**으로 확인하는 단정(`:72` `expect(text).toMatch(/no (prometemos\|ponemos) intérprete/i)`). pt 블록(`:127`)은 이 양성 단정을 갖고 있어 fr만 비대칭 | `expect(text).not.toMatch(/conseil en français\|avocats? francophones/i);` 로 교체하고 `expect(text).toMatch(/ne promettons pas de service d’interprétation/i);` 를 추가 |
| 17 | FIX | `scripts/check-column-translation.mjs:835-836` | `fr: compilePhrases([]),` / `pt: compilePhrases([]),` | de/es는 `buildDeLexicon()`·`buildEsLexicon()`(`:834`)를 쓰는데 fr/pt는 **빈** 어휘집이다. 철자 수사(`deux`, `dois`…)의 원문 대조가 fr/pt에서 사실상 비활성. `src/content/columns-fr`·`-pt`가 이 커밋에서 비어 있어 지금은 영향 없으나, 후속 칼럼 번역 WO(17편×2)가 수사 충실성 검사 없이 통과하게 된다 | 후속 칼럼 WO 착수 **전에** `buildFrLexicon()`·`buildPtLexicon()`을 de/es와 동일 수준으로 채운다. 지금 채우지 않으려면 WO 문서에 선결 조건으로 명시 |

### NOTE

| # | 등급 | 파일:줄 | 인용 | 관찰 |
|---|---|---|---|---|
| 18 | NOTE | `international-guidance-western.ts:1547` | `'Hovering International Law Firm acompanha clientes do estrangeiro, também quem tem um vínculo com Taiwan, …'` | 스페인어 `también a quienes tienen un vínculo`의 전치사 `a`가 사라져 삽입구가 문장에 걸리지 않는다. `'… clientes do estrangeiro, incluindo quem tem um vínculo com Taiwan, …'`가 자연스럽다. 의미 손실은 없음 |
| 19 | NOTE | `src/lib/__tests__/guidance-fr-pt-content.test.ts:41-42` | `['único', /único/i]` · `['garantido', /garantido/i]` | 포르투갈어 굴절 누락. `/único/`는 `única`·`únicos`·`únicas`를, `/garantido/`는 `garantida`·`garantimos`를 잡지 못한다. 프랑스어 쪽은 `/meilleur/`가 `meilleure`를, `/garanti/`가 `garantie`·`garantissons`를 부분 일치로 잡아 문제없다. 현재 팩은 통과하지만 후속 편집에 구멍 |
| 20 | NOTE | `scripts/check-column-translation.mjs:140` | `{ id: 'pt-always-on', re: /consulta\s*24\s*horas\|24\s*horas/i, … }` | 대안절 `24\s*horas`가 단독이어서 `no prazo de 24 horas` 같은 정당한 기간 표현까지 24/7 광고로 오탐한다. fr 대응 규칙(`:? 24h\/24`)은 한정되어 있다. 후속 칼럼 번역에서 오탐 발생 가능 |
| 21 | NOTE | `src/data/international-guidance-team.ts:970`(fr), `:1029`(pt) | fr `'Elle a représenté un étudiant coréen dans une demande de dommages-intérêts pour une blessure en salle de sport et a obtenu un jugement de première instance de TWD 1.57M.'` / pt `'Representou um estudante coreano numa pretensão de indemnização por uma lesão num ginásio e obteve uma sentença de primeira instância de TWD 1.57M.'` | 개별 사건 결과 + 금액이 든 문장. de(`Sie vertrat … erwirkte ein erstinstanzliches Urteil über TWD 1.57M`)·es 승인 팩과 **의미·수치까지 동일**해 이 커밋이 새로 만든 주장은 아니며, 하드 룰 3(사실 충실성) 기준으로는 정확한 번역이다. 다만 성공 사례 금액 노출은 광고규정 재검토 대상이 될 수 있으므로 de/es/fr/pt 4언어 일괄 판단 사안으로 기록한다(이 WO 범위 밖) |
| 22 | NOTE | `international-guidance-western.ts:1716` | `'… Por isso fixamos primeiro o âmbito do seu assunto e comunicamos-lhe depois os honorários para os avaliar antes de começar.'` | 스페인어 원문의 `en lugar de una lista de tarifas`(요금표 대신) 절이 빠졌다. 독일어 대응 문장(`:251`)에도 이 절이 없고, 같은 섹션 제목이 이미 `'Por que esta página não publica tarifas'`이므로 정보 손실은 없다. 하드 룰 3의 "문장 삭제 금지"에 걸리는 유일한 사례여서 기록만 |
| 23 | NOTE | `src/data/international-guidance-answers.ts:270` vs `international-guidance-western.ts:1084` | 답변 `'… mariage, famille et successions, droit du travail, affaires pénales …'` vs 팩 정본 `'Litiges du travail'` | 6개 그룹 중 네 번째를 답변 블록은 `droit du travail`, 팩·카테고리 정본은 `Litiges du travail`로 부른다. 독일어도 같은 불일치(`Arbeitsrecht` vs `Arbeitsrechtliche Streitigkeiten`)를 갖고 있어 선례 승계다. GEO 인용 시 그룹명 대조가 어긋날 수 있음 |
| 24 | NOTE | `src/lib/llms-txt.ts:633-643` | `const hasMarkdown = fs.existsSync(columnsDir) && fs.readdirSync(columnsDir).some((name) => name.endsWith('.md'));` | 빈 `columns-fr`/`-pt` 폴더를 "번역 없음"으로 통과시키는 WO §2f 요구사항의 올바른 구현이다. 다만 조건이 **전 로케일** 공용이라, 예컨대 `columns-de`의 `.md`가 전부 삭제되면 기존에는 던졌던 오류가 더 이상 나지 않는다. 의도된 완화이나 기존 로케일의 가드가 한 단계 약해진 점을 기록 |
| 25 | NOTE | `src/lib/__tests__/guidance-fr-pt-content.test.ts:81-93` | `packStrings()` 소스 10개 | 금지 토큰 스캔 대상에 `src/lib/public-language-registry.ts`(`LANGUAGE_PICKER_COPY.fr/pt`, `LANGUAGE_REGION_LABELS.fr/pt`)와 `src/components/` 카피가 빠져 있다. 현재 문자열은 짧은 UI 라벨뿐이어서 위험은 낮지만 커버리지 공백 |

---

## (C) 확인하여 정상인 항목

### 하드 룰 1 — 언어 잠금 (fr/pt는 안내 언어)

- `availableLanguage`는 `src/lib/seo.ts:911, 919`에서 `GUIDANCE_CONSULTATION_LANGUAGES`(= `:843` `['en', 'zh-Hant', 'ja', 'ko']`)에 고정돼 있고, 이 커밋의 `seo.ts` diff는 `guidanceOpenGraphLocale`에 `fr: 'fr_FR'`·`pt: 'pt_PT'` 두 줄만 추가했다. JSON-LD 상담 언어 배열은 손대지 않았다.
- 언어 FAQ 답은 두 언어 모두 명확한 부정으로 시작한다.
  - fr (질문 `:1303`, 답 `:1305`): `'La consultation en français est-elle possible ?'` → `'Non. Ces indications sont rédigées en français, mais la consultation avec une avocate ou un avocat a lieu seulement en anglais, en chinois (中文), en japonais et en coréen. Nous ne promettons pas non plus de service d’interprétation. …'`
  - pt (질문 `:1791`, 답 `:1793`): `'Posso ter uma consulta em português?'` → `'Não. Esta orientação está escrita em português, mas a consulta com uma advogada ou um advogado realiza-se apenas em inglês, chinês (中文), japonês e coreano. Também não prometemos serviço de interpretação. …'`
- 페이지 본문에도 별도 섹션으로 잠금이 서술된다: fr `:1069` `heading: 'La langue de la page et la langue de consultation ne sont pas la même chose'` → `:1071` `'… la consultation … a lieu seulement dans les quatre langues de consultation : anglais, chinois (中文), japonais et coréen.'`, pt `:1557` → `:1559` `'… a consulta … realiza-se apenas nas quatro línguas de consulta: inglês, chinês (中文), japonês e coreano.'`. 두 섹션 모두 통역·응답기한·예약 부인을 포함한다.
- `llms.txt` 공지도 배타적이다: `llms-txt.ts:570` fr `'… a lieu seulement en anglais, en chinois (中文), en japonais et en coréen.'`, `:578` pt `'… realiza-se apenas em inglês, chinês (中文), japonês e coreano.'`
- 문의 폼 상담 언어 선택지는 `en`/`zh-hant`/`ja`/`ko`/`needs-method-confirmation` 5개뿐이고 `fr`·`pt` 키가 없다(`international-inquiry-copy.ts:664-670` fr, `:714-720` pt). 테스트가 `not.toHaveProperty('fr')`/`('pt')`로 강제한다.
- 빌더 Locale·SiteLocale 미확대: `guidance-fr-pt-routing.test.ts:26-28`이 `locales === ['ko','zh-hant','en']`, `siteLocales === ['ko','zh-hant','en','ja']`를 고정한다. `intake-language-contract.ts`는 `PUBLIC_INQUIRY_LOCALES`에만 fr/pt를 추가하고 `CONSULTATION_LANGUAGES = ['en','zh-hant','ja','ko']`는 그대로다.

### 하드 룰 2 — 대만 변호사 광고 규정

- fr/pt 전체 문자열(팩·답변·팀·사무소·문의카피·llms·레지스트리)을 정규식 일괄 스캔한 결과 다음 토큰 **0건**: `meilleur`, `garanti*`, `gratuit`, `\bunique\b`, `taux de réussite`, `24h`, `réponse immédiate` / `melhor`, `garantid*`, `gratuito`, `únic*`, `taxa de sucesso`, `24 horas`, `resposta imediata`.
- 무료 상담 부인이 양쪽에 명시돼 있다: fr `:1221` `'Cette page n’affirme pas que le premier entretien est offert, et aucune partie ne doit se lire en ce sens.'`, pt `:1709` `'Esta página não afirma que o primeiro encontro seja oferecido, e nenhuma parte deve ler-se nesse sentido.'` — 두 문장 모두 금지어 `gratuit`/`gratuito`를 쓰지 않고 우회했다.
- 결과 무보장: fr `:1434`, pt `:1922`. 요금 수치 미기재(두 pricing 페이지 모두 금액 0건).
- `[변호사 검수 필요]` 마커 0건.

### 하드 룰 3 — 사실 충실성

- **구조 동형이 테스트로 강제된다.** `guidance-fr-pt-content.test.ts:152-159`의 `shapeOf()`가 fr/pt 팩을 de 팩과 재귀 비교하며, 배열을 `value.map(shapeOf)`로 펼치므로 **섹션 수·문단 수·items 수·faqs 수까지** de와 일치해야 통과한다. 문장 누락·추가가 구조 차원에서 막혀 있다. 실제 실행 결과 통과.
- 사무소 사실 대조: 4개 사무소(Taipei/Kaohsiung/Taichung/Pingtung) — fr `:1064, :1169`, pt `:1552, :1657`. 설립 2016 — fr `:1168`, pt `:1656`. NTU(國立臺灣大學) — fr `:1168`, pt `:1656`. 상담 언어 4개 — 위 하드 룰 1 참조. Pingtung 2017 개설·Hovering Accounting Office 2020·Kaohsiung 기업지배·Taichung 건설/IP/한일 — 4항목 모두 fr `:1169-1170`, pt `:1657-1658`에 보존.
- `guidance-office-facts-sync.test.ts`(28 tests pass)가 fr/pt를 `LOCALES`에 편입해, 사무소를 둘 이상 열거하는 모든 fr/pt 문자열이 `src/data/office-locations.ts`의 사무소 **전부**를 열거하는지 검사한다. 사무소 개수·도시명을 테스트 파일에 적어두지 않고 정본 모듈에서 읽으므로 우회가 어렵다.
- `guidance-disclosure-parity.test.ts`가 11개 면책 요소(대체 소통방식 검토 / 타언어 무보장 / 응답기한 무약속 / 확인단계≠약속 / 통역 무약속 / 전건 수임 불가 / 결과 무약속 / 4개 상담언어 / 상담단계 아님 / 법률자문 아님 / 예약 아님)에 fr·pt 정규식을 추가했다. 4 tests pass.
- 답변 블록 6키: fr `:270-296`, pt `:302-328`. 사무소 4곳·2016·NTU를 모두 유지하고 새 사실을 넣지 않았다. de/es 원문과 대조해 추적 불가한 문장은 없었다(#22의 es 절 1개 누락만 기록).
- 팀 약력 5명 × 2언어: `intro`/`education`/`experience` 항목 수와 내용이 de/es와 일치. 학교·직장·학위 고유명은 영문 원형 유지.

### 하드 룰 4 — Wei Tseng 여성형

- fr 팩 `avocate` 27회, pt 팩 `advogada` 28회. 남성형 오용 0건: `avocat Wei Tseng`·`advogado Wei Tseng` 패턴 검색 결과 없음.
- 직함·역할·자격 문장 전부 여성형:
  - fr `-team.ts:328` `representativeTitle: 'Avocate dirigeante'`, `:337` `keyFactsHeading: 'Avocate Wei Tseng — Indications essentielles'`, `:340` `qualificationSentence: '{name} est avocate habilitée à exercer à Taïwan et avocate dirigeante de {firm}.'`, `:344` `'tseng-junwei': 'Avocate dirigeante à Taïwan (Managing Attorney)'`
  - pt `-team.ts:356` `representativeTitle: 'Advogada diretora'`, `:365` `keyFactsHeading: 'Advogada Wei Tseng — Dados essenciais'`, `:368` `qualificationSentence: '{name} é advogada habilitada a exercer em Taiwan e a advogada diretora de {firm}.'`, `:372` `'tseng-junwei': 'Advogada diretora em Taiwan (Managing Attorney)'`
- 대명사·과거분사 일치: fr `-team.ts:970` `'Elle a représenté un étudiant coréen…'`, `:975` `'Étudiante d’échange à Kobe University et Waseda University'`; pt `:1034` `'Aluna de intercâmbio na Kobe University e na Waseda University'`.
- 성 중립 병기(`une avocate ou un avocat` / `uma advogada ou um advogado`)가 일반 변호사 언급 전체에 일관 적용됐고, 독일어 `eine Anwältin oder ein Anwalt` 선례와 같은 수준이다.
- 남성 동료는 정확히 남성형: fr `'chang-rongxuan': 'Avocat à Taïwan'`, pt `'Advogado em Taiwan'`, fr `'Expert-comptable associé'`, pt `'Contabilista associado'`.

### 하드 룰 5 — 격식·정서법·지명

- **fr 격식**: `vous` 56회 / `votre` 29회, `tu`·`ton`·`ta`·`toi`·`tes` **0회**. 누수 없음.
- **pt 격식**: `você`·`vocês`·`tu`·`teu` **0회**. 3인칭 정중체 일관(`pode`, `envia`, `escreve`) + 여격 `consigo` 5회, `-lhe` 사용. de `Sie` / es `usted`와 동등한 격식 수준.
- **유럽 포르투갈어 정서법 — 브라질형 누수 0건.** 확인한 EP 형태: `contacto`/`contactar`(BP `contato`), `factos`(BP `fatos`), `carácter`(BP `caráter`), `receção`(BP `recepção`), `registo`(BP `registro`), `planeamento`(BP `planejamento`), `sítio`(BP `site`), `pormenor(es)`(BP `detalhe`), `equipa`(BP `equipe`), `historial clínico`(BP `histórico médico`), `comprovativos de pagamento`(BP `comprovantes`), `recibos de vencimento`(BP `holerite`), `sénior`(BP `sênior`), `pré-aviso`, `indemnizações`, `direitos de autor`, `ligações`, `correio eletrónico`(BP `eletrônico`). AO90 표기(`atividade`, `atual`, `efetivo`, `objetos`, `exatamente`, `setores`, `retificação`, `direção`) 일관 적용. BP 형태 `contato`/`fato`/`registro`/`planejamento`/`você`/`equipe`/`caráter`/`recepção` 검색 결과 전부 0건.
- **지명 표기**: fr `Taïwan` 28회, 비악센트 `Taiwan`은 고유명 `National Taiwan University` 1건뿐(정확). pt `Taiwan` 30회, 스페인어 `Taiwán` 누수 0건. 사무소명 `Hovering International Law Firm` 원형 유지. 도시명 fr `Taipei`, pt `Taipé`(EP 관용) 일관.
- **카테고리 정본이 WO 명세와 바이트 일치**(`src/lib/columns.ts:157-158`):
  - fr `{ formation: 'Création de société à Taïwan', legal: 'Informations juridiques sur Taïwan', case: 'Analyse de cas' }`
  - pt `{ formation: 'Constituição de sociedades em Taiwan', legal: 'Informações jurídicas sobre Taiwan', case: 'Análise de casos' }`
  - `FORMATION_CATEGORY_PHRASES`(`:106-107`)·`CASE_CATEGORY_PHRASES`(`:120-121`)에도 동일 문구 등록.
- **오토님**: `PUBLIC_LANGUAGE_AUTONYMS.fr = 'Français'`, `.pt = 'Português'`. 국기·국가명 없음(테스트 `:56-57`이 `/🇫🇷|France|French/`·`/🇵🇹|Portugal|Brazil|Portuguese/` 불일치를 강제).
- **지역 레이블이 WO 명세와 일치**: `public-language-registry.ts` fr `regionLabel: 'France et pays francophones'`, pt `'Portugal e Brasil'`, 양쪽 `region: 'europe'`.
- fr 인용부호는 프랑스식 `« »`, pt는 EP 관용 `« »`로 각각 정확하다(de `„ "`, es `« »` 선례와 정합).

### 하드 룰 6 — 기존 로케일 팩 불변

`git show 04677e16` 삭제 라인 전수 확인 결과, 기존 로케일 **본문 문장 변경 0건**이다.

- `international-guidance-western.ts`: 삭제 라인은 파일 헤더 주석 4줄(`German and Spanish guidance packs…` → `German, Spanish, French and Portuguese guidance packs…`)뿐. `germanGuidanceContent`(`:9-495`)·`spanishGuidanceContent`(`:497-984`) 본문은 한 글자도 바뀌지 않았다.
- `international-guidance-content.ts`: 주석 1줄 + import 2줄 + `GuidanceLocale` 유니온 + `guidanceContent` 맵 2줄만. vi/id/th/fil/ar 본문 무변경.
- `international-guidance-answers.ts`·`-offices.ts`·`-team.ts`·`international-inquiry-copy.ts`·`team-name.ts`·`column-locales.ts`·`columns.ts`·`fonts.ts`·`seo.ts`·`intake-language-contract.ts`·`public-guidance.ts`·`public-language-registry.ts`: 모두 **추가 전용**(+ 주석·유니온·정규식 로케일 목록 확장). 기존 로케일 값 수정 0건.
- WO §4 금지 파일(`intent-pages.ts`, `site-content.ts`, Header/Footer 구조) 미변경 확인.
- 유일한 기존 로케일 영향은 `llms-txt.ts`의 `hasMarkdown` 가드 완화(#24)와 `check-column-translation.mjs`의 `DATE_MONTH_NAMES` 확장(월 이름 추가 전용, 기존 키 유지)이다.

### 하드 룰 7 — 테스트 유효성

실행: `npx vitest run guidance-fr-pt-content guidance-fr-pt-routing guidance-disclosure-parity guidance-office-facts-sync` → **4 files / 59 tests 전부 통과**(0.38s).

의미 있는(동어반복 아닌) 단정으로 확인한 것:

- `shapeOf(guidanceContent.fr) === shapeOf(guidanceContent.de)` — 위 하드 룰 3 참조. 6개 모듈에 대해 구조 동형을 강제하는 이 커밋에서 가장 강한 게이트다. 문단 하나를 지우거나 추가하면 실패한다.
- 언어 FAQ 부정 답: `expect(faq?.answer).toMatch(/^Non\./)` / `/^Não\./` + 4개 상담언어 배타 문구 정규식(`:180-181, 189-190`). 앵커(`^`)를 써서 "어딘가에 Non이 있다"가 아니라 "답이 부정으로 시작한다"를 검사한다.
- 금지 토큰 스캔(`:194-215`)이 문자열을 **경로와 함께** 순회하고(`collectStrings`), 언어 FAQ **질문**에서만 `consultation en français`/`consulta em português`를 면제한다. 면제 조건이 `path.endsWith('.question') && value === LANGUAGE_FAQ_QUESTION[locale]`로 좁아, 답변이나 본문에 같은 문구가 들어오면 잡힌다. 면제를 값 동일성까지 확인하는 점이 특히 견고하다.
- 라우팅: 10개 페이지키 × 2로케일 = **20 자기정규 URL**이 중복 없이 생성되는지(`:101-109`, `new Set(urls).size === 20`), 미들웨어 rewrite가 `columns`를 제외한 코어 경로를 catch-all로 보내는지, `/fr/columns`가 파일 라우트로 빠지는지(`:83-86`), 언어 전환이 `/ko/about → /fr/about`으로 `fallback: 'exact'`를 주는지 검사한다.
- `llms.txt` 빌드(`:111-121`)가 칼럼 없이도 성공하고, 10개 URL이 각각 **정확히 1회** 등장하는지(`body.split(...).length - 1 === 1`) 확인한다. 중복 엔트리를 잡는 단정이다.
- `guidance-office-facts-sync`·`guidance-disclosure-parity`는 위에 서술. 둘 다 사실·면책을 정본 모듈에서 읽어 비교하는 구조여서 테스트 파일만 고쳐 통과시키기 어렵다.
- 기존 기대치 갱신도 실질적이다: `sitemap.test.ts`(+20 URL·alternates 키 수), `llms-discovery.test.tsx`, `fonts.test.ts`, `public-guidance.test.ts`, `public-language-registry.test.ts`, `global-seo-locale-integrity.test.ts`, `column-category-parity.test.ts`, `guidance-column-category-label.test.ts` 등 로케일 수·목록 상수가 fr/pt 포함으로 올라갔다.

동어반복으로 판정한 것은 #16(독일어 정규식) 1건뿐이다.

### 기타 확인

- 폰트: `fonts.ts:136`에서 fr/pt가 `latinExtendedFontClassName`으로 매핑돼 de/es와 동일. `Français`의 `ç`, `Português`의 `ê`, fr `« »`·`’`, pt `ç`·`õ` 모두 Latin Extended 커버리지 안.
- og locale: `fr_FR`·`pt_PT`(WO 명세 일치). x-default=en 불변.
- 빈 칼럼 폴더: `src/content/columns-fr/.gitkeep`·`columns-pt/.gitkeep` 생성, `column-locales.ts`에 디렉터리 등록, 체커·llms 빌더가 빈 폴더를 "번역 없음"으로 통과. WO §2f 요구 충족.
- 언어 선택기 카피: fr `{ open: 'Choisir la région et la langue', title: 'Veuillez choisir votre région et votre langue', close: 'Fermer', current: 'Langue actuelle' }`, pt `{ open: 'Escolher a região e a língua', title: 'Escolha a sua região e a sua língua', close: 'Fechar', current: 'Língua atual' }` — 두 언어 모두 격식 일관, 문법 정상.

---

## 후속 권고

1. **WO-G2-1R1**으로 FIX 16건을 한 번에 닫는다. 파일 4개(`international-guidance-western.ts`, `-answers.ts`, `-team.ts`, `international-inquiry-copy.ts`) + 테스트 1개 + 체커 1개.
2. #1(NBSP)은 기계적 치환이라 별도 커밋으로 분리하면 diff 검수가 쉽다. 치환 후 fr 문자열에서 U+0020 + `[?!:;»]` 패턴이 0이 되는지, `«` + U+0020이 0이 되는지 테스트로 고정할 것을 권한다.
3. #17(fr/pt 수사 어휘집)은 **칼럼 번역 WO-G2-1C 착수 전 선결 조건**으로 명시한다. 지금 열어두면 17편×2의 수사 충실성이 검증 없이 통과한다.
4. #21(TWD 1.57M 사건 결과 금액)은 de/es/fr/pt 4언어 공통 사안이므로, 이 레인이 아니라 광고규정 별건으로 사용자 판단을 받는 것이 맞다.

---

판정 라인: **PASS — 블로킹 0건 (FIX 16 · NOTE 8)**
