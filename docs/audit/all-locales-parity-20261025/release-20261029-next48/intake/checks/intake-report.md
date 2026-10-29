# 승인36편 R 인수 완료

2026-10-29 KST. VI·TH·KO·JA·ES·FR 각6편, 합계36편을 R의 정확한 새 경로에 원문 바이트 그대로 복사했다. 각 언어의 ID는915·916·918·919·920·921이다. 필수 미종결0이며 FAQ는102개다.

|언어|최종 후보와 감수 연결|R 대상 디렉터리|
|---|---|---|
|VI|B11 current src6 + vi-root-r2-closure|src/content/columns-vi/|
|TH|B11 checks/th-author-r2/manuscripts6 + th-independent-r2-final|src/content/columns-th/|
|KO|B12 r5 + ko-independent-current|src/content/columns/|
|JA|B12 current6 + ja-independent-r2-handoff|src/content/columns-ja/|
|ES|B12 current920 r2 + other5 r1, es-independent-r2-handoff|src/content/columns-es/|
|FR|B12 currentr2 + fr-independent-r2-manifest|src/content/columns-fr/|

현재 종결 manifest·보고서의 SHA, 실제 CLI의 대상SHA·exit0·FAIL0, 메타데이터·FAQ·정본 공식 URL과 최종 출처 목록·금지 강조·정확한 가상 캡션·이미지6 원본 SHA를 확인했다. 기존 검사 영수증은 현재 바이트에 연결해 재사용했다. TH의 과거 src 원고는 인수하지 않았다. 최종36개 모두 복사 전 대상 부재, exclusive-create, 복사 후 source/destination SHA 및 바이트 일치를 확인했다. 기존 R 파일은 덮어쓰지 않았다.

[scope36-manifest.json](scope36-manifest.json)에36개 source/destination 절대경로·전체SHA·route·감수/CLI영수증·이미지SHA를 담았다. [24편 복사 영수증](ko-ja-es-fr-copy-receipt.json)과 [TH·VI12편 복사 영수증](th-vi-copy-receipt.json)은 복사 전후의 실제 상태를 각각 기록한다. 최종 재확인 시 관찰된 다른 R 경로는 manifest extraRObservedPaths에 별도로 남겼다. 타인 변경은 수정하지 않았다.

초기 로컬 확인 코드가 선택필드 seoTitle을 필수로 오인해 ES4편을 표시한 결과는 별도 보존했다. 계약대로 선택값으로 바로잡았고 원고는 수정하지 않았다. 첫 복사 스크립트는 구문오류로 실행 전에 실패했으며, 당시 R 변경은 없었다. 이 실패도 숨기지 않고 기록했다. 수정된 스크립트의 두 실제 복사 실행은 각각24/12편을 마쳤다.

새 CLI·production loader·빌드·커밋·푸시·배포는 실행하지 않았다. ZH-HANS6와 EN4/ZH-HANT2는 이번 인수에서 제외했다. registry/tests 및 최종48편 loader·배포는 root 범위다. 이 보고서는 원어민·사람·변호사의 새 내용 승인이나 공개 배포 완료를 뜻하지 않는다.
