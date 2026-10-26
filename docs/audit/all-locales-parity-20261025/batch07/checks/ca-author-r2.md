# CA6 R2 저자 교정 기록

2026-10-26 KST. 독립 R1은 MUST0/선택3이었다. 세 선택을 실제 원문과 대조한 뒤 소유 원고918·921만 최소 수정했다. 원래 reviews/ca-author.md·ca-final-manifest.json·독립 R1 보고서/manifest는 바이트 그대로 남겼다. 현재 후속 저자 기록은 이 파일이며 최종 연결은 ca-final-manifest-r2.json이다.

- S01: `notificar-lo` → `notificar el lliurament`. 사용허가 취득부터6개월의 인도통지 목적어를 명시한다. 매도인 의무·4개월 역사계약·수선/정산/문서·FAQ 그대로.
- S02: `Una decisió unilateral de l’empresa no el substitueix` → `Una decisió unilateral de l’empresa no substitueix l’acord entre les parts`. 쌍방합의의 대상을 명시한다. 종료 후30일 OR 쌍방합의, 미사용포인트와 미사용게임비용, 필요비용 그대로.
- S03 / MONOTONY: 기존 `El tribunal no la va concedir.`를 첫 문단 중간에서 마지막으로 옮겼다. 금액→다툼없는 포인트부재→청구불인용으로 읽으며 다음 판결일 문단과 사이에 기존6단어 문장이 온다.35→32단어 장문연속은35→6→32로 바뀌었다. 금액·사실·출처·문장 자체를 삭제/추가하거나 정상 문장부호를 조작하지 않았다.

정확한3개치환·diff는 ca-review-r1-edits.json, R1 원고 전문은 ca-review-r1-snapshot.json이다. 짧은S01역복원앵커가 이미정확한FAQ와도 일치해 두 차례 사전 guard가 중단됐고, 그때 원고는 쓰지 않았다. 완전한 실제 본문 문단을 고유앵커로 사용한 뒤 적용했다. 최종 실제파일에서 역치환을 다시 실행해 여섯 R1 SHA를 정확히 복원했다. frontmatter 전체/FAQ17과 링크 전체 순서도 동일하다.

현재 실제 영향2편 CLI:918 exit0/FAIL0 CV.523,40단위/짧은.175;921 exit0/FAIL0 CV.456,45단위/짧은.111. Node24와정확한공유--lang ca,도구수정없음. 다른4편은 같은SHA의실제기존결과를재사용했다. 현재 전체249단위 중247문장텍스트불변+새2문장이다. 실제변경4문단10문장을 읽고 순서·기산·목적어·출처 및35→6→32 경계를 확인했다. 추출숫자를 원어민승인으로 해석하지 않는다.

구조 API도 정확히918/921만 EN/ZH 중 해당ZH정본·원래basename/sourceMap으로 실제실행했다. errors0이고 semanticStatus는REVIEW_REQUIRED다. §5의변경영향은 목적어명시와도입호흡뿐이며 새같은시작실패나URL/FAQ손실은없다. 기존의실질결말·나머지§5검토는같은본문에유효하다.

이 기록은 모델 저자 교정이며 인간 원어민·변호사승인, 실제브라우저렌더링/피드/JSON-LD나공개게시가아니다. 후속 독립확인은변경분을대상으로요청한다.

| ID | 현재 SHA-256 |
|---|---|
| 915 | `183c8045ea1d1d443672376af9f8866b3771c2ed429aae6d24f47398eaccb5d9` |
| 916 | `4971777565edde14f6e41cef422d252b251a527d48f7bdcdf62169ede5034506` |
| 918 | `89bc806c446b85e4cd7f8dc7b6231bb74345b6c985124b13af100aaca4deaeb1` |
| 919 | `5047e951b20e1dc6d3914692c69f9a9b62c323e519418221f153bc0a60fa9d2a` |
| 920 | `cd071bb9bda0be5353eb0df7f1ac9a8b892a3dfa4fff701735ce893e43a48999` |
| 921 | `f6b34469c5dcd72ef92ee65d8a857b46ba3333a955c955a0d365cbb3849b0c07` |
