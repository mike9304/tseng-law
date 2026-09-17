# Fable 5.1 최종 검수 게이트

Grok은 이 워크트리의 **구현 워커**다. 최종은 Fable 5.1이다.

- 칼럼·안내 카피·라우팅을 “끝났다”고 말하기 전에 Fable 5.1 WO를 보내고 APPROVE를 받는다.
- 채널: `bridge send --to claude`. 리포트는 `docs/seo/reviews/` (형식: 판정 APPROVE|ITERATE, 파일:줄).
- 검수 전 git commit / push / 배포 금지.
- ITERATE면 워커가 고치고 같은 게이트로 재제출한다.
- 원어민 검수는 Fable 검토가 대체하지 않는다.
