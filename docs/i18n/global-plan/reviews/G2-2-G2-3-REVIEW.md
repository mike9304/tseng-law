# G2-2 · G2-3 독립 검토 — zh-hans · ms · ru · tr / it · nl · pl

검토자: Opus 5 세션 `son7-51` (Claude Code) · 2026-09-19 13:4x KST
대상 커밋: `f82be715`(G2-2) · `7a138084`+`6bb3e839`(G2-3) · 병합 `f3559135` · 수습 `0f23a6e6`
판정: **PASS** (차단 결함 0). 아래 1건은 이번 검토 중 고쳐서 `0f23a6e6`에 포함했다.

## 1. 상담 언어 계약 (하드 룰)
- `GUIDANCE_CONSULTATION_LANGUAGES`(src/lib/seo.ts:850) · `CONSULTATION_LANGUAGES`(intake-language-contract.ts:27) 모두 불변: en·zh-Hant·ja·ko.
- 안내 로케일 16개 전부 상담 문구가 네 언어를 자국어로 명시한다. 실제 문자열을 뽑아 확인했다.
  정규식 합집합 시험은 단어가 빠진 로케일을 조용히 통과시키므로, 로케일별 기대 토큰 표로 시험을 바꿨다
  (`src/components/__tests__/multilingual-international-v2.test.tsx`).
- JSON-LD `availableLanguage`는 16개 로케일 전부 4개 고정 — `guidance-jsonld.test.ts` 통과.
- 언어 FAQ 답은 it·nl·pl 모두 "아니오 — 영어·중국어(中文)·일본어·한국어만" 형태다.

## 2. 대만 변호사 광고규정 / 금지 약속
자동 스캔(무료 상담·24/7·보장·승소율·통역 제공·즉시 응답·최고/유일)을 9개 언어 어휘로 돌렸다. 적중 56건은
**전부 부정문 안**이었다. 예: it "Questa pagina non dice che il primo colloquio è gratuito",
nl "Wij beloven geen tolk", pl "Nie obiecujemy tłumacza ustnego", tr "Tercüman vaat etmeyiz",
es "No prometemos intérprete". 긍정 약속 0건.
- 예외 1건은 이미 조치됨: it·nl·pl에만 있던 "문의 전송도 무료" 긍정 문장을 `6bb3e839`에서 삭제했다.
  기존 8개 언어는 무료를 부정문으로만 쓴다.

## 3. 대표 변호사 성별 (曾雋崴 Wei Tseng — 여성)
언어별 관례에 맞는지 한 줄씩 확인했다.
- 여성형 명시: it `Avvocata dirigente` · fr `Avocate dirigeante` · pt `Advogada diretora` ·
  de `Geschäftsführende Anwältin` · es `Abogada directora` · ar `المحامية المديرة` · fil `Namamahalang abogada`
- 문법상 남성형이 없는(공성) 직함 + 여성 일치: ru `уполномочена`(여성형 술어) · pl `Adwokat kierująca` ·
  nl `Leidinggevend advocaat`(네덜란드어 advocaat는 공성) · ms `Peguam` · tr `Avukat` · zh-hans `主持律师`
- 남성 단정 표현 0건. 9/17 de·es 오류(`766363b3`)의 재발 없음.

## 4. 게이트 (병합 후 기준)
| 항목 | 결과 |
| --- | --- |
| typecheck | 0 |
| vitest 전체(1317파일) | 실패 집합이 `origin/main c7800348` 기준선과 동일 (8파일/15건) |
| eslint(변경 파일) | 0 |
| guidance-country-mentions | 0 위반 |
| `[변호사 검수 필요]` 마커 | 69 (= main 동수, 신규 0) |

판정 기준은 "전부 그린"이 아니라 **"기준선 대비 신규 실패 0"**이다. main이 018 반도체 칼럼 게재 이후
낡은 핀 때문에 상시 빨간 상태이기 때문이다(`docs/seo/mena-plan/GOAL.md` B14와 같은 기준).

## 5. 남은 것
- 라이브 200 확인은 배포 후에만 가능하다. 지금은 정적으로 16개 로케일 전부 `services`·`faq` 팩과
  경로(`/<locale>/services`·`/<locale>/faq`)가 있음을 확인했다.
- 칼럼 번역(G2-C)은 이 검토 범위 밖이다. 안내 팩만 다뤘다.
