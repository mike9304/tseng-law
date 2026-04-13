# SESSION.md — 현재 세션 계약서

> 이 파일은 **한 세션 동안만** 유효한 일회용 계약서다.
> 세션이 끝나면 Manager 가 결과를 `AGENTS.md` + 계획서 § 16 Changelog + `Wix 체크포인트.md` 에 반영하고 **이 파일 내용을 템플릿으로 리셋**한다.
>
> **룰**: SESSION.md 에 적힌 target 밖의 작업은 하지 않는다. 범위 밖 아이디어는 `BACKLOG.md` 로 밀어낸다.

---

## 📅 세션 번호: (없음)
## 🎯 Target 체크포인트: (없음)
## 📝 사용자 원문 목표: (없음)

## 성공 기준 (Definition of Done)

사용자가 브라우저에서 다음 플로우를 클릭으로 완결하고, 새로고침 후 상태가 유지되는 것을 확인했을 때 Green:

- (작성 예정)

## 금지 범위 (touch 금지)

이 세션에서 **건드리지 말 것**:

- (작성 예정)

## 실행 계획

1. (작성 예정)
2. ...

## Codex 에게 줄 프롬프트 (있는 경우)

```
(Manager 가 작성해서 사용자에게 제공. 사용자가 Codex 터미널에 복붙.)
```

## Worker agent 발주 로그

- (Manager 가 Agent 호출할 때마다 한 줄 append: 시각, task id, 요약)

## 검증 로그

- (사용자가 브라우저 테스트한 결과: ✅ / ❌ + 스크린샷/에러)

## 세션 종료 체크리스트

- [ ] typecheck / lint 통과
- [ ] 브라우저 검증 완료
- [ ] target 체크포인트 상태 변경 (Wix 체크포인트.md)
- [ ] § 16 Changelog 한 줄 append
- [ ] AGENTS.md "현재 상태" 섹션 갱신
- [ ] commit + push 여부 사용자 확인
- [ ] SESSION.md 를 이 템플릿으로 리셋
