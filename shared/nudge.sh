#!/bin/bash
# every 10 min: if a writer session is idle at its prompt, tell it to continue the PIPELINE loop
M='[자동 재개] PIPELINE.md 루프를 이어서 계속하라. FACTS·HANDOFF·STATUS·다른 작성자 초안의 새 변화를 확인하고 다음 할 일을 하라. 할 일이 정말 없으면 자기 NOTES.md에 대기 사유를 한 줄 적어라.'
for s in threads-grok-1020 threads-opus-goal-1020; do
  p=$(tmux capture-pane -pt $s 2>/dev/null | tail -12)
  echo "$p" | grep -qE 'Waiting for response|esc to interrupt|Thinking|ing…|ing\.\.\.|⇣[0-9]' && continue
  tmux send-keys -t $s -l "$M"; sleep 1; tmux send-keys -t $s Enter; echo "$(date '+%m-%d %H:%M') nudged $s"
done
