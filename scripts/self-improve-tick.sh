#!/bin/zsh
# ---------------------------------------------------------------------------
# self-improve-tick.sh — 무인 routine용 REPORT-ONLY 틱 (v2 자기개선 시스템).
#
# 자율 경계(하드): Detect + Report만 한다. 커밋·푸시·배포 절대 안 함.
#   프로덕션 배포는 변호사검수 + 사용자 push-auth 이중 게이트다(SELF-IMPROVE-LOOP.md).
#
# 하는 일: LIVE 검사 축(샌드박스 불필요)을 돌려 회귀/결함을 감지하고 evidence에 리포트.
#   1) live-routes-scan   : ko/zh 24페이지 200 + 콘솔 0 + 오버플로 0 (1280/1024/390)
#   2) handoff-blockers   : 정적자산+auth 경계 code FAIL 여부 (fresh artifact 강제; provider open은 결함 아님)
#   3) live-seo-scan      : 전 페이지 title(유일)·desc·canonical·hreflang·JSON-LD파싱·본문 sentinel(soft-404 방어)
#   4) live-sitemap-crawl : sitemap.xml 전 <loc>(동적 아티클/가이드 포함) 실제 fetch → non-200 탐지
# 종료코드: 0 = 이번 tick converged green, 1 = 실제 발견(사람이 트리아지/하청).
#
# 사용:   scripts/self-improve-tick.sh
# routine: launchd/cron이 이 스크립트를 주기 호출 → exit 1이면 알림.
#   (지능형 tick = adversarial verify 포함 = dynamic workflow, 대화형 세션에서 실행)
# ---------------------------------------------------------------------------
set -uo pipefail
cd "$(dirname "$0")/.."
BASE="${SELF_IMPROVE_BASE:-https://tseng-law.com}"
TS="$(date '+%Y-%m-%dT%H%M%S%z')"
OUT=".omo/evidence/self-improve-tick-${TS}.md"
mkdir -p .omo/evidence
findings=0

{
  echo "# self-improve tick (report-only) ${TS}"
  echo "base=${BASE}"
  echo
} > "$OUT"

echo "[tick] 1/4 routes+console+overflow …"
routes_out="$(node scripts/live-routes-scan.mjs --base="$BASE" 2>&1 | tail -3)"
if print -r -- "$routes_out" | grep -q 'ALL CLEAN'; then
  echo "- routes: CLEAN" >> "$OUT"
else
  echo "- routes: ISSUES" >> "$OUT"; print -r -- "$routes_out" | sed 's/^/    /' >> "$OUT"; findings=$((findings+1))
fi

echo "[tick] 2/4 handoff-blockers readiness …"
rm -f .omo/evidence/handoff-blockers-latest.json   # L24: stale artifact false-clean 방지 — 반드시 fresh만 읽는다
npm run gate:handoff-blockers:json -- --base="$BASE" >/dev/null 2>&1
if [ ! -f .omo/evidence/handoff-blockers-latest.json ]; then
  echo "- handoff: gate가 fresh artifact 미생성 (게이트 실패/미실행) — FINDING" >> "$OUT"; findings=$((findings+1))
else
  fail=$(node -e "try{const r=require(process.cwd()+'/.omo/evidence/handoff-blockers-latest.json');const f=r.counts&&r.counts.fail;console.log(Number.isInteger(f)?f:'BAD')}catch{console.log('BAD')}" 2>/dev/null)
  open=$(node -e "try{const r=require(process.cwd()+'/.omo/evidence/handoff-blockers-latest.json');console.log((r.counts&&r.counts.open)??'?')}catch{console.log('?')}" 2>/dev/null)
  if [ "$fail" = "BAD" ]; then
    echo "- handoff: artifact malformed/no counts.fail — FINDING" >> "$OUT"; findings=$((findings+1))
  elif [ "$fail" != "0" ]; then
    echo "- handoff: code FAIL=$fail (real blocker)" >> "$OUT"; findings=$((findings+1))
  else
    echo "- handoff: no code FAIL (open=$open = customer provider creds only)" >> "$OUT"
  fi
fi

echo "[tick] 3/4 SEO integrity (title·desc·canonical·hreflang·JSON-LD·body sentinel, 28 URL) …"
seo_out="$(node scripts/live-seo-scan.mjs --base="$BASE" 2>&1)"
seo_exit=$?
if [ "$seo_exit" = "0" ] && print -r -- "$seo_out" | grep -q 'ALL CLEAN'; then
  echo "- seo-integrity: CLEAN ($(print -r -- "$seo_out" | tail -1))" >> "$OUT"
else
  echo "- seo-integrity: ISSUES (exit=$seo_exit) — body/title/hreflang/JSON-LD/soft-404 회귀" >> "$OUT"
  print -r -- "$seo_out" | grep '^✗' | sed 's/^/    /' >> "$OUT"
  findings=$((findings+1))
fi

echo "[tick] 4/4 sitemap broken-link crawl …"
crawl_out="$(node scripts/live-sitemap-crawl.mjs --base="$BASE" 2>&1)"
crawl_exit=$?
if [ "$crawl_exit" = "0" ] && print -r -- "$crawl_out" | grep -q 'ALL 200'; then
  echo "- sitemap: ALL 200 ($(print -r -- "$crawl_out" | tail -1))" >> "$OUT"
else
  echo "- sitemap: ISSUES (exit=$crawl_exit) — 깨진 라우트/stale sitemap 항목" >> "$OUT"
  print -r -- "$crawl_out" | grep '^✗' | sed 's/^/    /' >> "$OUT"
  findings=$((findings+1))
fi

echo >> "$OUT"
if [ "$findings" = "0" ]; then
  echo "VERDICT: CONVERGED GREEN (0 findings) — nothing to fix this tick." >> "$OUT"
  echo "[tick] CONVERGED GREEN → $OUT"
  exit 0
else
  echo "VERDICT: $findings axis finding(s) — human/subcontract triage (NO auto-fix/commit/deploy)." >> "$OUT"
  echo "[tick] FINDINGS=$findings → $OUT" >&2
  exit 1
fi
