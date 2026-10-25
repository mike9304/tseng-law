# DE704 전자 ARC 출력 단계 보완

확인·수정일: 2026-10-26 KST. 작업자 `/root/column_voice_rules`. R 현행 DE704를 읽고 지정된 전자 ARC 문장만 공식 안내와 대조했다. 수정은 [별도 사본](../existing-corrections/columns-de/704-taiwan-arc-first-application.md)에 적용했으며 R·공유 도구·다른 원고는 수정하지 않았다.

- 문제 문장: `Eine elektronische ARC mit höchstens sechs Monaten Gültigkeit wird nach Zahlung heruntergeladen.`
- 이유: [NIA 0929의 4(3)(a)](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news)를 이번 작업에서 직접 열었다. 2026-08-28 갱신으로 표시된 안내는 학생 온라인 절차의 납부 완료 후 전자 ARC를 다운로드 AND 인쇄하도록 정한다. 원문의 다운로드만 설명하는 문장에는 출력 단계와 의무성이 빠져 있다.
- 수정 문장: `Eine elektronische ARC mit höchstens sechs Monaten Gültigkeit muss nach Zahlung heruntergeladen und ausgedruckt werden.`
- 조건 보존: 앞 문장의 학생 포털 문맥, 납부 후라는 순서, 6개월 이하 전자 ARC 범위를 유지한다. 같은 문단의 납부 5근무일 및 칩 카드 수령 3근무일, 다른 절차의 별도 수령 안내는 그대로다. 학생 경로의 의무를 모든 ARC 신청자에게 확대하지 않았다.

메타데이터에서는 `lastmod`만 `2026-10-24`에서 `2026-10-26`으로 바꿨다. `published: "2026-10-24"`와 `date_display: "24. Oktober 2026"`, FAQ, 제목·요약, 저자·이미지, 본문·말미 출처 링크는 보존했다. 한 항목을 재확인한 것이므로 전체 출처 기준일 문구도 바꾸지 않았다.

원본 SHA-256은 `07b02d98ad6c6e6679d32bb8315391c678fa23bc7eb0c485ba9bf9dc6440a306`, 수정 사본은 `e4088a2d7a48a32b0f63c7642fc4557e537c7db6d840daa69dec09329d200ce2`이다. 두 치환을 되돌려 원본 바이트·SHA와 정확히 일치함을 확인했다. [원본 사본](../checks/de-earc-before.md), [두 변경만 담은 diff](../checks/de-earc-change.patch), [수정 기록](../checks/de-earc-edit.json)을 보존한다.

공유 DE 검사는 다음 명령으로 이 수정본에 한 번 실행했다. 실제 exit0/FAIL0, 60개 추출 단위, CV 0.466, 짧은 단위 비율 0.200이다. 실행 전후 원고 해시는 같다.

```sh
PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH PYTHONDONTWRITEBYTECODE=1 python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check --lang de /Users/son7/tseng-all-language-columns-20261025/batch05/existing-corrections/columns-de/704-taiwan-arc-first-application.md
```

§5의 이번 변경 범위 확인: 도입·결말·문단 시작·인용 배치와 제목은 그대로다. 바뀐 #54 단위와 앞뒤 문장을 읽었고 새 분리·합침은 없다. 나머지 59개 추출 단위는 순서·문자열이 같다. 새 문장은 15개 정서법 단위로 측정되며 굵은 강조·허구 경험·대비식을 추가하지 않았다. 기한·금액·출처를 없애지 않고 공식 인쇄 의무를 복원했다. 문단 시작어 최대2회, 연속 같은 시작1회이며 고정 프로필·8/32·임계값은 수정하지 않았다.

[실제 검사와 경계 기록](../checks/de-earc-variety.json) 및 [최종 manifest](../checks/de-earc-manifest.json)에 해시와 검증 범위를 남겼다. DE705·706 전체 재검수, 사람 원어민·변호사 승인, 공개 배포·렌더 검증은 수행하지 않았다.
