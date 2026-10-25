# Batch06 첫 여섯 정본: 집필 전 근거 묶음

작성 기준일: 2026-10-26 KST. 담당: /root/column_source_quality. 이 디렉터리만 수정했으며 번역 칼럼은 아직 작성하지 않았다.

대상은 ZH919 → ZH921 → ZH920 → ZH918 → EN915 → EN916이다. 다음 집필 우선 언어는 부모 에이전트의 최신 배정대로 de → it → ar → pt → hi → ms → ru다. 여섯 주제×일곱 언어는 42편 후보이며, 전체 고정 목표인 49언어 각286편을 대체하지 않는다.

- [six-source-facts.md](six-source-facts.md): 판결 사실, 현행법, 시장·정책 자료, 사무소 진술, 작성자의 실무적 추론을 구별한 명제표.
- [source-register.md](source-register.md): 실제 열람 범위와 26일 재조회 성공·실패·보관 회신 재사용의 구별.
- [authoring-contract-draft.md](authoring-contract-draft.md): 후속 작가에게 전달할 구체적인 집필 계약 초안.
- [source-freeze.json](source-freeze.json): 여섯 정본의 승인 SHA와 현재 SHA, 현재/승인본 스냅샷, manifest 및 최종 검수의 해시 연결.
- [input-read-scope.json](input-read-scope.json): 읽은 최종 검수·언어 검수·실제 보관 회신의 경로와 SHA. 최종 검수 보고서 및 언어 검수 보고서의 SHA를 각 JSON과 직접 대조했다.
- [bundle-manifest.json](bundle-manifest.json): 연구 묶음 동결 시각·각 산출물 SHA 및 원본/검수 입력의 종료 해시 일치 결과.
- retained/: 25일 실제 공식 회신 중 이번에 읽은 사건 설명과 보관 자료.
- recheck/: 26일 실제 web 도구 회신, 정부 판결집에서 돌아온 관련 행, PDF 화면 열람의 한계.

ZH918·920·921의 기존 승인본 topic civil은 유효한 스키마 값이 아니었다. Root가 topic을 litigation으로, lastmod를26일로 바꾼 두 줄만 독립 역복원하여 기존 승인 SHA가 정확히 복구됨을 확인했다. 본문·FAQ·그 밖의 frontmatter는 같다. 원발행일25일과 기존 검수 이력은 보존했다. 현재본을 쓰되 본문 법률이 새로 변경된 것으로 취급하지 않는다.

중앙은행은 공식 작동규정 목록 및 법령조회 화면에서 2026-09-17 개정/09-18 시행본을 다시 확인했다. 직안법 시행연혁은2026-07-01 시행을, 가오슝 공고는2026-09-30 신청기한을 계속 제시한다. 법원919·915·916 설명과920 판결의26일 재조회는 timeout이어서 25일의 실제 회신을 다시 읽었다. 이는 새 판결문 전체 확보나 후속 상소 결과 확인이 아니다.

이 묶음은 근거와 집필 범위를 정리한 AI 조사 기록이다. 인간 변호사·원어민 승인, 새 번역의 문체 PASS, 공개 배포 또는 전체 목표 완료를 뜻하지 않는다. 기존 manifest의 “Not yet deployed”도 과거 기록의 상태일 뿐 현재 공개 여부 판정으로 사용하지 않는다.
