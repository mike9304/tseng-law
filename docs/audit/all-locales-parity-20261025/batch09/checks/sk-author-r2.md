# SK6 저자 R2 — 독립 M01·O01·O02 표적 교정

독립 R1 `reviews/sk-independent.md`(48cbc86564f575411666d3bda1b03ae45fd8c5c6a4a7a95e4eba52fdd6843025) 전문과 정확한 지적 파일을 읽었다. 필수 M01과 선택 O01·O02를 모두 수용했다. 원 저자 보고서·manifest·독립 R1을 수정하지 않고 `checks/sk-review-r1-snapshot/`에 원고6과 기존 증거를 보존한 뒤 세 치환만 실행했다.

| 항목 | 문제→실제 수정 | 의미 보존 |
|---|---|---|
|M01,920 본문|`Prísľub budúceho odpojenia neriešil pôvodný nedostatok súhlasu.`→`Tvrdené nepoužívanie zariadenia chýbajúci súhlas nenahradilo.`|미래 분리 약속이라는 근거 없는 시점·행위를 없애고 실제 사용중지 주장으로 되돌렸다. 확정사실로 바꾸지 않으며 앞 문단의 ‘설령 사실이어도’ 철거·복구 의무가 남는다는 설명을 유지했다.|
|O01,920 FAQ2|`... nepoužíva, uzamkol ho a môže odovzdať kľúč.`→`... nepoužíva a uzamkol ho, a ponúkal odovzdanie kľúča výboru.`|가능성을 인도 의향으로 명료화하고 위원회라는 수령인을 밝혀 정확한 본문과 맞췄다. 이미 넘겼다고 하지 않는다. FAQ의 가정적 판단과 일반화 제한은 그대로다.|
|O02,921 본문|양자합의 요구를 두 문장으로 재진술한 부분→`Jednostranné oznámenie prevádzkovateľa takú dohodu nenahrádza.`|바로 앞의 양측합의 대안을 유지하고 일방 통지로 대체할 수 없다는 구체적 한계만 남겼다. 미사용 두 환급대상 OR·필요비용·종료 후30일·must는 변경하지 않았다.|

MONOTONY: 921 같은 양자합의 조건의 연속 재진술을 정리했다. 단문 수를 늘리기 위한 반복을 유지하지 않았고 법적 조건은 앞 문장에 온전히 남아 있다. 920은 리듬과 관계없이 잘못된 사건 묘사를 고쳤다.

실제 old/new·전체 diff·각 변경의 이유·전후 SHA는 `sk-review-r1-edits.json`이다. 순방향과 역방향을 직접 재구성해6/6 일치했고 나머지 네 원고는 바이트 그대로다. 숫자·공식URL 순서도6/6 불변이다. 원저자/독립R1/기존최종측정 파일은 바이트 그대로 보존했다.

새로 바뀐920/921만 공유 실제 CLI `--lang sk`로 검사했다. 두 편 모두 실제exit0/FAIL0, 각45문장, CV .453/.459다. 같은 SHA의 다른 네 편은 반복하지 않고 앞의 설치후 실제CLI 결과와 연결했다. frozen 정본 구조검사는 영향2편/errors0이며 메타검사는6/errors0·FAQ17·공식URL합23이다. R1 대비 FAQ 변화는920 FAQ2 하나다. 초기초안 대비916제목/FAQ2 변화는 앞 단계의 이력으로 구별했다.

현재 전체259문장 중257개는 R1에서 읽은 문장이 그대로다. 새 두 문장과 앞뒤 문단,920 FAQ2를 다시 읽었다. `sk-review-r2-boundary-delta.json`에 정확한 배열 차이가 있고, 정상 날짜·조문·URL 경계를 바꾼 편집은 없다. §5의 도입/문단 첫말/소제목/실질 결말은 그대로이고 새 중복·장문연속을 만들지 않았다.

현재920 SHA `ecf263bf7b469ba2e3de619460d7e3945a0275dd9dd72d5261298bc58937f576`,921 SHA `1d3574bf42e024b1c9a6c2bd3005d1ed452dbb13fc5015ba0a6e7556f15c1b6a`로 동결한다. 원고·저자 R2 증거를 독립검수자에게 전달해 변경분만 확인받는다. 이 기록은 AI 자기 교정이며 인간 원어민·변호사 승인이나 공개 배포 검증이 아니다. R·공유도구·다른 언어·독립보고서를 수정하지 않았다.
