#!/bin/zsh
# W1 주간 측정 실행 스크립트 (2026-09-16 화 이후 실행). 총괄이 직접 실행.
export PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH
WT=~/Projects/tseng-law-sea-seo-20260909; P=$WT/docs/seo/sea-geo-plan; cd $WT
# 1) 손빗 ASK 발송 (한 번만)
ls ~/.local/share/son-bridge/ask ~/.local/share/son-bridge/answered 2>/dev/null | grep -q "sea-seo-w1" || cp $P/ASK-S6-W1-TEMPLATE.md ~/.local/share/son-bridge/ask/ASK-$(date +%Y%m%d-%H%M)-sea-seo-w1-claude.md
# 2) 방문 7일 리포트
node scripts/pull-visit-metrics.mjs --days 14 && node scripts/visit-report.mjs --days 7 --md > $P/evidence/visit-W1.md
grep -A8 "국가 톱10" $P/evidence/visit-W1.md; grep -A4 "AI 경유" $P/evidence/visit-W1.md | head -6
# 3) 손빗 파일 도착 후: docs/seo/FROM-GROK-BOT-SEA-W1.md 확인 → metrics-log.md SEA 표에 W1 행 추가 → GOAL.md W1 [x] → 커밋
echo "다음: FROM-GROK-BOT-SEA-W1.md 도착 확인 → metrics-log 행 → GOAL W1 [x] → 커밋"
