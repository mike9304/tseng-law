# ledger — en 007 (hub.md + part2.md), 선택·이동·삭제만 한 판

표기: `L번호` = repo `src/content/columns-en/007-taiwan-divorce-lawsuit-qna.md` 줄 번호(origin/main 기준, 303줄). `s1·s2` = 그 문단 안 문장 순서. 목록 항목은 줄 번호가 곧 항목.
처리: 유지(hub) / 이동(part2) / 삭제(이유 → 남은 곳). ★ = 남은 곳이 없거나 부분적이라 리드 판단이 필요한 삭제.
측정(inventory.py 방식, 출처 앞까지 단어): 원문 5,595(통계표 5,722 = 출처·안내 포함) → hub 3,171, part2 1,117. 새로 쓴 문구는 connectors.md에 전부 있다(`novel.py` 문장 단위 대조로 확인: 원문에 없는 문장 23개 = connectors 목록).

## 프런트매터
- L2 title, L3 seoTitle, L4 url, L6 date_display, L8–9 categories, L10 featured_image, L11 summary → hub 유지. 제목의 "Property"는 §6 슬롯 문장·링크가 남아 있어 그대로 둠(notes 6).
- L5 lastmod → hub·part2 "2026-10-06". L7 read_time "30 min read" → hub "14 min read"(3,171w ÷ 230), part2 "5 min read"(1,117w ÷ 230).
- FAQ 1(L13–14)·2(L15–16)·3(L17–18)·6(L23–24) → hub 유지(원문 그대로). FAQ 4(L19–20)·5(L21–22) → part2 이동(원문 그대로, hub에서 제거).

## 도입·제목
- L27 H1, L29 이미지 → hub 유지.
- L31 s1·s2 → hub 유지. s2는 part2 도입 문단의 첫 문장으로도 사용(복사, 새 글자 없음).
- L33 s1·s2 → hub 유지.

## §1 경로 → hub §1
- L35 H2, L37, L39, L41, L43 → 유지. L47 H3, L49, L51–55 → 유지.
- L45 s1·s2("These paths must not be blended. Documents, proof, … differ for each path.") → 삭제(반복 유보문·재요약). 남은 곳: hub §2·§3·§4가 경로별 요건을 각각 서술.
- L57 s1–s3 → 삭제(L33 s1·s2와 다섯 질문 목록의 재진술·결론). 남은 곳: hub 도입 L33, 질문 목록 L49–55. ★ s2 "대만 호적 갱신이 다른 나라의 가족관계 기록을 자동 갱신하지 않는다"는 질문 5와 019("Registration in Taiwan also leaves recognition, reporting and enforcement in another country to be handled there")에 부분적으로만 남음.

## §2 협의이혼 → hub §2
- L59 H2 → 유지(번호 2). L63 H3("Article 1050 elements") → 삭제(제목만; L65가 H2 바로 아래 리드가 됨).
- L61 s1–s3(FAQ 1 복사 문단, D-001) → 삭제. 남은 곳: s1 → FAQ 1, hub §1 L39(Civil Code Article 1050 요건)·L65–69; s2 → L39 s2, L69; s3 → §1 질문 2·4·5, L71 s2·s3.
- L65, L67, L68, L69 → 유지.
- L71 s1–s3 → 유지. s4("No single fixed checklist applies unchanged to every cross-border case.") → 삭제(반복 유보문; 남은 곳: s1 "in force at the time of filing and confirmed with the office"). 019 연결 구를 문단 끝에 붙임(connectors C1).
- L73 H3, L75, L77, L79 → 유지(30일·48조의2 포함).
- L81 s1 → 유지. s2("The thirty-day period is the general deadline … not a deadline exclusive to online filing.") → 삭제(L77 s1과 정확한 중복).

## §3 조정·소송 → hub §3
- L83 H2 → 유지(번호 3). L87 H3 → 삭제(제목만; L89가 리드).
- L85 s1–s4(FAQ 2 복사, "No."로 시작, D-001) → 삭제. 남은 곳: FAQ 2, L97·L99.
- L89 s1–s4, L91 s1·s2 → 유지(ko 3.2 s2 복원과 같음: 직접 청구 시 조정신청 간주·예외 문장 포함).
- L93("The time required to resolve a case varies …") → 삭제(법적 조건 아님). 남은 곳 없음 ★(경미).
- L95 H3 → 유지. L97 s1·s2 → 유지, 단 s2에서 ", with the qualifications stated above" 삭제(가리키던 L85가 삭제되어서; 삭제만, connectors J1).
- L99 s1·s2 → 유지. s3("They are neither automatic rights nor automatic prohibitions.") → 삭제(s2의 반복).
- L101 H3 → 유지. L103 s1–s3 → 유지. s4("Calculate the correct route and period …") → 삭제(작성 지시형; 남은 곳: hub 증거 목록 7번 "Link every date … to its precise triggering event").

## §4 이혼사유 → hub §4
- L105 H2 → 유지(번호 4). L109 H3 → 삭제(제목만; L111이 리드).
- L107 s1–s3(FAQ 3 복사 문단, D-001) → 삭제. 남은 곳: s1 → L126 s3·FAQ 3; s2 → L128 s2·FAQ 3; s3 → L128 s3·FAQ 3.
- L111 → 유지. L113–L122 → 유지. 단 L116 둘째 문장("The actor and the victim must be identified with care: …") 삭제(첫 문장의 되풀이·지시형; 남은 곳: L116 첫 문장), L119는 사실 정정 F-005(아래).
- L124 H3, L126 s1–s3 → 유지. L128 s1 → 유지하되 확인일만 "2026-07-25" → "2026-10-06"(WO). s2·s3 → 유지.
- L130 s1·s2("Do not state that an at-fault spouse can never petition … / Do not treat marital fault as a mechanical rule …", D-002) → 삭제. 남은 곳: s1의 사실부분 → FAQ 3, L126 s3, L128 s3; s2 → 이동한 L142 s2.
- L132 H3 → 유지. L134 + L136–L138("distinguish three analyses" 세 항목) → 삭제(지시형, L111 목록 5·9호와 L126·L128의 중복). 남은 곳: L111 목록 5·9호, L126, L128.
- L140 s1–s4 → 유지.
- L142 s1·s2 → 유지, 위치만 L128 뒤(원래 L130 자리)로 이동. s3("Each issue is determined under its own requirements …") → 삭제(반복 유보문; 남은 곳: s2). ko는 L142 전체를 삭제했으나 en은 §1–§4 코어 유지 지시에 따라 s1·s2를 남김(notes 1).

## §5 외국 혼인·이혼 → hub §5
- L144 H2 → 유지(번호 5). L146 s1·s2 → 유지(리드).
- L148 H3·L150 s1–s3·L152 s1·s2("Taiwan procedure and foreign procedure are not substitutes") → 삭제(L146 s1·s2와 §1 질문 목록의 재요약). 남은 곳: L146, §1 질문 3·4·5, 108(승인·등록 순서·송달), 020(외국 사건 상태·기록).
- L154 H3·L156 s1–s3 → 삭제(인증·번역은 §2 L71 s2·s3에 같은 문장이 남음; s3은 반복 유보문). 남은 곳: hub L71.
- L158 s1("Documents from mainland China, Hong Kong, and Macao follow verification regimes …") → 유지(ko F3와 같음: 남은 곳 없는 법적 조건). s2("Treat those regimes as separate … tracks rather than as interchangeable …") → 삭제(s1의 반복).
- L160 H3·L162 s1–s3 → 삭제 ★. 남은 곳: 108(미국 판결의 승인·등록 서류·심사), 020. 판결이 아닌 행정 증명서일 때의 구별(s3)은 108의 "state vital-records certificate is a different document" 한 문장에만 부분적으로 남음.
- 108·020 연결 구 추가(connectors C2·C3). 108·020은 링크 전에 열어 대조함(notes 3).

## §6 재산 → part2 §1, hub §6 슬롯
- L164 H2 → part2 H2 1("1. House Title, Premarital Funds, and Residual-Property Distribution"). hub에는 새 H2 6(슬롯 제목, connectors N1).
- L166 s1("No.")·s3·s4(FAQ 4 복사 문단, D-001) → 삭제. 남은 곳: part2 FAQ 4, part2 L176 s1–s3, L180. s2 → hub §6 슬롯 문장 + part2 도입 문단(복사).
- L168 H3 → 삭제(part2는 H3 없이 L170이 리드; 제목만). L170, L172–L174, L176 → part2 이동.
- L178 H3 → part2 이동. L180 s1 → part2 이동하되 F-012 수정문으로 교체(아래). s2·s3 → part2 이동.
- L182 H3, L184 s1·s2, L186 s1–s3 → part2 이동.
- L188 s1("manifestly unfair …") → 삭제, F-001 수정문 2문장으로 교체(아래). s2·s4 → part2 이동. s3("However, specific facts … such as the concealment or disposition of property …") → 삭제(F-001: 재산 은닉·처분은 제3항 요소가 아님; 남은 곳: 수정문 둘째 문장의 6요소).
- L190 s1–s3 → part2 이동.
- 213 연결 구 part2에 추가(C9; 213은 전문 열람).

## §7 손해배상·부양 → part2 §2, hub §6 슬롯
- L192 H2 → part2 H2 2. L196 H3("Article 1056, Article 1057, and child support") → 삭제(제목만; part2는 H2 바로 아래 L198).
- L194 s1("No.")·s3(FAQ 5 복사 문단, D-001) → 삭제. 남은 곳: part2 FAQ 5, part2 L190 s2(2년/5년이 1030-1에만 적용). s2 → hub §6 슬롯 문장.
- L198 → part2 이동. L200, L202, L204 → part2 이동(한 문단으로 묶음; 같은 문단 시작 단어 반복을 줄이려는 형식 변경).
- L206 H3 → part2 이동. L208 s1·s2 → 이동. s3("Do not treat every cohabiting couple as married, and do not promise recovery in the abstract.", D-002) → 삭제(남은 곳: s1).
- L210 s1–s3 → part2 이동.

## §8 자녀 → hub §7
- L212 H2 → 유지(번호 7). L216 H3 → 삭제(제목만; L218이 리드).
- L214 s1–s3(FAQ 6 복사 문단, D-001) → 삭제. 남은 곳: FAQ 6, L224 s1–s3.
- L218 s1–s3, L220 s1–s4 → 유지(§1055 협의→법원 결정→불리하면 법원이 고침, 변경 심사 포함).
- L222 H3 → 유지. L224 s1 → 유지하되 M-1(아래)로 수정. s2·s3 → 유지. 095 연결 구 추가(C5).
- L226 H3, L228 s1–s3 → 유지(ko는 §3 끝으로 옮겼으나 en은 §8 코어 유지라 제자리).

## §9 양육비·면접교섭 → hub §8
- L230 H2 → 유지(번호 8). L232 s1·s2·s3·s5 → 유지(리드). s4("Do not treat the two claims as interchangeable, and do not use the Article 1030-1 … limitation period as a universal deadline for child support.", D-002) → 삭제. 남은 곳: s3(두 청구는 별개), part2 L190 s2(2년/5년은 1030-1에만).
- L232 뒤에 F-003 문장(connectors F3) + 068 연결 구(C6) 추가.
- L234 H3, L236 s1–s4("Modification of child support") → 삭제. s1은 F-004 대상(예측 불가 사건 요건 부정)이라 삭제 필수. s3 후반("unforeseeability is not the sole legal threshold")도 같은 취지라 삭제. 남은 곳: F-003 문장(변경 요건). ★ s2("The reviewing court examines the child's current needs …")·s4("Preserve expense records …")는 남은 곳이 부분적: s4 → hub 증거 목록 6번(child-support payment records and actual expenses).
- L238 H3, L240 s1–s4 → 유지(가사사건법 제194조 문단).
- L242 s1 → 유지. s2("The sequence and method of enforcement should be determined …") → 삭제(L240 s3의 반복; 남은 곳: L240 s3). s3("Interim protection may be necessary …") → 삭제 ★(남은 곳: 095의 provisional orders — 연결 구 C7, L240 s2 "appropriate interim measure").
- L244 s3·s4 → 유지(ko 9.5 복원과 같음). s1·s2 → 삭제(s1: 집행권원 문언·지급기일은 068; s2: 접촉 방식·조건이 구체적이어야 한다는 문장은 남은 곳 없음 ★ 경미).
- L246 H3, L248 → 삭제(남은 곳: 증거 목록 2·6번).

## §10 국제이주 → hub §9
- L250 H2 → 유지(번호 9). L252 s1·s2 → 유지. L254, L255(1·2호) → 유지.
- L256–L260(3~7호) → 삭제 ★. 남은 곳: 3호(연락·방문 계획) → 021; 5호(기존 명령의 승인·집행)·7호(긴급 보호·임시처분·출국금지) → 095; 6호(실제 비용·한국 생활비) → L252 s1 "not decided by Korean living costs"와 021 부분. 4호(여권·출입국·등록) 남은 곳 없음.
- L262 s1 → 평서문으로 변환(D-002, connectors D1). s2("Cross-border removal, retention, and return questions require advice … cannot be reduced to a treaty label …") → 삭제(L252 s1과 중복). s3 → 유지.
- 021·095 연결 구 추가(C8a·C8b).

## §11 증거 → hub §10
- L264 H2 → 유지(번호 10). L266 s1·s2 → 삭제(s2는 "nine categories"가 항목 수와 달라져 거짓; s1은 목록 도입). 남은 곳 없음(조언).
- L268(항목 1) → 첫 문장("Identity, status, and addresses. Organize proof of marriage …")만 유지, 둘째 문장("Note any discrepancy …") 삭제(남은 곳 없음, 증거 정리 조언).
- L269, L270 → 유지(항목 2·3). L271(항목 4 부부재산) → 삭제(남은 곳: part2 L176·L180 입증 자료 열거).
- L272 s1·s2 → 유지(항목 4로 재번호), s3("Distinguish speculation from directly verified facts.") → 삭제(남은 곳 없음).
- L273 → 항목 5, L274 → 항목 6 유지. L275 → 항목 7로 유지하되 s4를 평서문으로 변환(D-002, D2). L276 → 항목 8 유지.
- L278 s1 → 유지. s2("Retaliation against the other party, concealment or sham transfer of assets, and moving a child …") 삭제 ★(자녀 이동은 §9 L262 s3; 보복·재산 은닉은 남은 곳 없음). s3("If it is unclear whether material may lawfully be obtained …") 삭제(반복 유보문; 남은 곳: s1).

## §12 출처 → hub §11, part2 §3
- L280 H2, L282 s1–s3, L284–L293 → hub 유지(기준일 2026-07-25 그대로: 모든 링크를 오늘 재확인하지 않음). part2에는 L280 H2(번호 3)·L282(기준일 "2026-10-06")·L284–285(민법 두 링크).

## §13 관련 안내·맺음 → hub §12, part2 §4
- L295 H2, L297–L299 → hub 유지(3개). part2에는 L297·L299 두 개만(ko 275 선례; 소송 변호사 안내는 허브용, notes 2).
- L301 s1 → hub 유지. part2는 같은 문장에서 "and minor children"만 "and financial claims on divorce"로 변경(connectors P6). s2·s3 → 삭제(포괄 면책 반복). 남은 곳: s2 → L282 s2·s3, s3 → hub 증거 목록 7번.
- L303 서명 → hub·part2 유지.

## 사실 정정·D-002 변환 (WO 지시)
- F-001(1030-1②③): part2 §1 — L188 s1 교체. "manifestly unfair" 삭제, 6요소 문장 추가, "concealment or disposition of property" 삭제(L188 s3). part2·hub에 "manifestly unfair" 없음(hub·part2 grep 확인; FAQ 3·L128의 "manifestly harsh/harsh"는 헌판 112-4 본문 어휘).
- F-003(가사사건법 §102①·§107②): hub §8 리드 끝(connectors F3). 대상은 확정재판·법원에서 성립한 화해에 한정, 사적 합의서로 넓히지 않음.
- F-004: L236 s1·s3 삭제(hub·part2 어디에도 없음).
- F-005(1052①7): hub 목록 7호 "An incurable loathsome disease (不治之惡疾)." "serious illness" 없음.
- F-012(1017): part2 §1 L180 s1 교체(connectors F12).
- M-1(1055-1): hub §7 L224 s1에 "all circumstances in light of the child's best interests, with particular attention to", 5호 "or between the child and others who live with the child", 7호 "the traditional customs, culture, and values of each ethnic group" 삽입; "and"의 위치만 조정(connectors M1).
- 1052② 단서 확인일: hub L128 "2026-07-25" → "2026-10-06".
- D-002: L130·L232 s4·L208 s3·L103 s4·L116 둘째 문장 삭제, L262 s1·L275 s4 평서문 변환. trimcheck leaked-instruction 0건.
- 리드 반영(18:3x): 검수 지적 원문 문장 복원(zh-007 F1·F2 / en-007 N1·N2 / 133 part2 §18② 반 문장).
