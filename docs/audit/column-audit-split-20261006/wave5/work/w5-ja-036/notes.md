# notes — 036 ja W5 TRIM + F-039

## 읽은 것
WO-W3-TRIM.md 전문, POLICY.md v1.1, EDITORIAL-VOICE.md(w5 repo), SENTENCE-VARIETY-RULE.md·LESSONS.md(studio-tools), reviews/wave3-fable.md(036 해당 절 없음), reports/classify-r1.md 036 절, factcheck/ja-036.md(M-1·M-2), fixspec/036.md(F-039), 원문 ja 036 전문, ja 067 머리말·H2(링크 대상 확인).

## 사실 정정 위치
- F-039 #1(출경 제한 요건이 欠税額 구간별로 다름): 본문 L56 + FAQ3(프런트매터 L19). 구간 값은 fixspec·factcheck M-1(規範 第四點附表 인용)과 대조. connectors C3·C4·C6.
- F-039 #2(行政執行法 §17②1 단서): 본문 L66. connectors C5.
- factcheck 「참고」 3건(L54 행정구제 중 罰鍰 불산입의 출처가 規範 第三點②, 「2015年以降」은 최초 발령 2014-12-31·현행 2022-08-19판, L56 Q&A 출처 귀속)은 fixspec 지시 밖이라 반영하지 않았다. 세 번째는 L56 Q&A 문장 삭제로 부수적으로 해소됨(아래 N2).

## 검증 (실행한 것)
- `python3 trimcheck.py ja <원문> work/w5-ja-036/draft.md`: URLs missing 0, article refs missing [], numbers missing [], front-matter 변경 = lastmod·read_time, H2 8개 동일, bold 0, leaked-instruction 없음. 길이 7,148 → 7,317.
- 원문 대 draft 줄 diff: 변경 줄 = L6(lastmod), L8(read_time), L19(FAQ3), L26, L34, L56, L66 일곱 곳뿐. 나머지는 문자 일치.
- 질문 문장·굵은 글씨·지어낸 1인칭 없음.

## read_time 계산
WO 규칙(ja 600字/分) + 선행 ja 작업(ja-135) 관례(반올림): 본문 7,317字 ÷ 600 = 12.2 → 「約12分」. 원문 「約11分」은 수기값(원문 7,148字 ÷ 600 = 11.9 → 12). 저장소 ja 고정 테스트 공식(한자·가나 ÷ 500 올림)이면 14. 036은 고정 테스트 대상이 아님.

## 문체 지표 (variety_metrics.py, ja)
- 원문 FAIL 2: short_share 0.056, consec_same_start 3. WARN: 합니다체 91%, ただし 5개.
- draft FAIL 2: short_share 0.062, consec_same_start 3(len_cv 0.483 → 0.511). WARN 동일.
- 지시 범위 밖이고 문장 쪼개기 금지라 손대지 않음.

## 애매했던 판단 (리드·검수자 결정)
- N1 L28 마지막 문장 「ここでは、どんな場面で何が起こりうるのかを条文に沿って確認し、就任時・在任中・帰任時にやっておく実務を整理します。」은 전개 예고다. fixspec·classify가 036에서는 지정하지 않았고(035는 예고문 삭제를 지정) WO가 「이것만」이라 두었다. 삭제 시 같은 문단의 금액 단위 문장(「金額は特に断らない限り台湾元…」)은 남긴다. 지우려면 한 문장(57字)이다.
- N2 L56의 「財政部の税務Q&Aは、欠税が2,000万元…審査を経ずに制限の報告ができるとも説明しています。」는 fixspec에 삭제 지시가 없었다. 새 문장(C3)이 같은 사실을 附表 근거로 말해 이중 서술이 되고, factcheck상 링크된 Q&A에는 금액대 설명이 없어 출처가 부정확해서 삭제했다. 살리려면 C3 마지막 문장(「2,000万元以上…問わず対象になります」)을 빼고 원문 문장을 되돌리면 된다.
- N3 C3 중간 구간 문구를 fixspec의 「条件に加わり」 대신 「いずれか一つがあれば」로 바꿨다(附표 「之一」). 리드가 fixspec 원문 그대로를 원하면 C3 세 번째 문장만 바꾸면 된다.
- N4 067(ja)로의 링크: fixspec 「이미 있으면 유지」 — 036 본문에 067 링크가 원래 없어(내부 링크는 taiwan-company-subsidiary-vs-branch·taiwan-company-establishment-basics뿐) 추가하지 않았다. classify의 「036이 067을 링크하는 쪽이 맞음」을 따르려면 §제3자 민사책임(L40) 끝에 링크 1문장을 새로 써야 해서 connectors 항목이 늘어난다.
- N5 附표 PDF URL(Download.ashx?FileID=48960…)은 새 링크로 넣지 않았다(같은 문단의 規範 페이지 링크 GL009873이 부표를 포함). 넣으려면 C3 첫 문장에 링크 1개.
- N6 L26이 이제 문서의 첫 문장이다. 「現地法人の董事長などを兼務すると」가 제목(董事長・経理人)과 겹친다고 보면 「日本の感覚では…」부터 시작하도록 더 줄일 수 있다.
- N7 w5 worktree에서 읽기 전용 작업 중 `git fetch origin` 1회(refs만 갱신, 파일 무변경)를 실행했다.
