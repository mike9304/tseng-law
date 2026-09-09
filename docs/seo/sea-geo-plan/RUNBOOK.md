# RUNBOOK — 명령 정본 (복붙용)

전제: `export PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH` (homebrew node25 깨짐). `vercel` CLI 불가 → 배포 상태는 `gh api repos/mike9304/tseng-law/commits/<sha>/status`.
변수: `WT=~/Projects/tseng-law-sea-seo-20260909` `P=$WT/docs/seo/sea-geo-plan`

## §1 워크트리 (완료됨 — 재생성 불필요)
`git -C $WT log --oneline -1` 이 6022bdcc 이상이면 OK. `.env.local`은 main의 것에 심링크됨(방문 지표용).

## §2 발주
### Opus 5 (Claude Code 총괄: Agent 툴)
`subagent_type: general-purpose`, `model: opus`, prompt = "Read and execute $P/WO-<N>.txt exactly. Work only inside $WT. No commit/build/full suite. Finish with the WO report format." 완료 알림 → §3.
### Grok 4.6 (백그라운드)
```bash
WT=~/Projects/tseng-law-sea-seo-20260909; P=$WT/docs/seo/sea-geo-plan; N=S1-review
nohup zsh -c "{ echo \"[WO-$N 시작 \$(date)]\"; /Users/son7/.local/bin/cursor-agent -p --trust --force --model cursor-grok-4.6-high --workspace $WT \"\$(cat $P/WO-$N.txt)\" 2>&1; echo \"=== WO-$N 종료 code=\$? \$(date) ===\"; } >> $P/evidence/grok-$N.log" </dev/null > /dev/null 2>&1 &
```
대기: `until grep -q "=== WO-$N 종료" $P/evidence/grok-$N.log; do sleep 30; done` (백그라운드). 25분 무마커 → `pkill -f "cursor-agent.*$N"` → 재발주. 2회 실패 → Opus. Grok는 max-turns 소진 시 diff 0인데 "완료"라 함 → `git diff --stat` 필수. Grok WO에 Bash 검증 요구 금지.
### Cursor Fable 총괄일 때 Opus 발주
`cursor-agent -p --trust --force --model claude-opus-5-thinking-high --workspace $WT "$(cat $P/WO-<N>.txt)"` (위 Grok 명령에서 모델만 교체, 로그 evidence/opus-<N>.log).

## §3 검수 게이트 (순서대로, FAIL → 반려 WO `WO-Sx-R1.txt`)
```bash
export PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH; WT=~/Projects/tseng-law-sea-seo-20260909; P=$WT/docs/seo/sea-geo-plan; cd $WT
git status --short; git diff --stat                                   # ① 허용 파일 밖 변경 → 반려
npm run typecheck 2>&1 | tail -3                                      # ②
npx vitest run src/lib/__tests__/public-guidance.test.ts src/lib/__tests__/seo-faq-jsonld.test.ts src/app/__tests__/sitemap.test.ts "src/app/[locale]/__tests__/llms-discovery.test.tsx" 2>&1 | tail -5   # ③ + WO 신규 테스트
npm run build > $P/evidence/build-$(date +%m%d-%H%M).log 2>&1; tail -3 $P/evidence/build-*.log | tail -3   # ④
PORT=4351 npm run start > /tmp/sea-start.log 2>&1 & sleep 10          # ⑤ 렌더
for l in vi id th fil; do for k in "" /services /faq /contact; do u="http://localhost:4351/$l$k"; c=$(curl -s -o /tmp/p.html -w '%{http_code}' "$u"); echo "$c $u"; grep -o '<link rel="alternate"[^>]*>' /tmp/p.html | head -2; grep -o '<script type="application/ld+json">.\{0,300\}' /tmp/p.html | head -2; done; done > $P/evidence/render-$(date +%m%d-%H%M).txt
curl -s http://localhost:4351/llms.txt | grep -c "/vi/\|/id/\|/th/\|/fil/"   # S2b 후 ≥ 40
lsof -ti :4351 | xargs kill
grep -rn "availableLanguage" src/components/InternationalGuidance.tsx src/lib/llms-txt.ts src/lib/seo.ts | grep -iE "\"(vi|id|th|fil)\"|Vietnamese|Indonesian|Thai|Filipino"   # ⑥ 0건
grep -rniE "勝訴率|승소율|win rate|guarantee|保證" $(git diff --name-only)      # 0건
grep -rn "\[변호사 검수 필요\]" $(git diff --name-only)                          # 있으면 main 금지 표시
```
문서 WO(S0/S1/S5)는 ①·⑥ + WO 완료기준 grep만. 방문 지표: `node scripts/pull-visit-metrics.mjs --days 28 && node scripts/visit-report.mjs --days 28 --md > $P/evidence/visit-28d.md`.
라이브(배포 후만): `node scripts/live-seo-scan.mjs --base=https://tseng-law.com`, `npm run verify:multilingual-live -- --base https://tseng-law.com`. IndexNow: `node scripts/indexnow-submit.mjs --urls <콤마URL> --dry-run` 확인 후 실제.

## §4 커밋·배포
a) `git add <파일명>` → `git commit -m "seo(sea): <내용>" -m "구현: <워커> · 검수: <총괄>" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"`. SHA를 GOAL.md에 기록하고 GOAL.md도 함께 커밋.
b) 배포(ASK 승인 후만): `git fetch origin && git rebase origin/main`(충돌 시 중단·ASK) → ②~⑥ 재실행 → `git push origin seo/sea-geo-20260909:main` → `gh api repos/mike9304/tseng-law/commits/$(git rev-parse HEAD)/status | grep -m1 state` success → 라이브 스캔 → IndexNow. 롤백 `git revert`. 강제 push 금지.

## §5 ASK
`~/.local/share/son-bridge/ask/ASK-<YYYYMMDD-HHMM>-sea-seo-<주제>-claude.md`
```
status: waiting
question: (한 줄)
context: (두 줄 이내)
options: (실제 선택지)
```
답: `ls ~/.local/share/son-bridge/in/ | grep -v '\.done$' | grep sea-seo`. 손빗이 SendMessage로 직접 중계하기도 함. 답 전 추측 진행 금지. 재질문 금지: 交流協会·유료광고.

## §6 승계 체크리스트 (새 총괄 첫 10분)
1. PROMPT.md §2 → GOAL.md §A 첫 미완·§B 미결
2. `ls -t $P/evidence/*.log` 종료 마커 없는 로그 = 진행 중 워커 → `ps aux | grep -E 'cursor-agent|codex'`
3. `git -C $WT status --short; git -C $WT log --oneline origin/main..HEAD` → 미커밋 diff는 워커 산출물 → §3 게이트부터
4. `ls ~/.local/share/son-bridge/in/ | grep -v '\.done$' | grep sea-seo` → 답 반영
5. GOAL.md §D 로그 1줄 + 상단 총괄 이력 추가 → 커밋

## §7 총괄 승계: Cursor Fable 5 기동 (Claude Code Fable 5.1 토큰 소진 시, 사용자 지시 9/9)
모델: `cursor-agent --list-models | grep fable` → `claude-fable-5-thinking-high`. 워크스페이스는 워크트리(계획 정본이 레포 안에 있으므로 충분).
대화형(권장): `cd ~/Projects/tseng-law-sea-seo-20260909 && /Users/son7/.local/bin/cursor-agent --trust --model claude-fable-5-thinking-high --workspace ~/Projects/tseng-law-sea-seo-20260909` → 첫 메시지: `docs/seo/sea-geo-plan/PROMPT.md 전문을 읽고 총괄로 GOAL.md 보드 첫 미완 항목부터. RUNBOOK §6 먼저.`
헤드리스 1사이클: `nohup zsh -c "{ echo '[LEAD $(date)]'; /Users/son7/.local/bin/cursor-agent -p --trust --force --model claude-fable-5-thinking-high --workspace $WT \"\$(cat $P/LEAD-CYCLE.txt)\" 2>&1; echo \"=== LEAD 종료 \$? \$(date) ===\"; } >> $P/evidence/lead-cursor-fable.log" </dev/null &` — 종료 후 `git status`·GOAL.md diff로 실제 진행 확인. 25분 무출력 kill.
