#!/bin/bash
# Sync this machine's owned dirs to branch threads-collab-1020 on mike9304/tseng-law (not site content), pull the other machine's dirs.
cd "$(dirname "$0")"; L=$PWD; B=threads-collab-1020; G=$L/.sync-git
. $L/MACHINE.env   # OWN="astra opus grok STATUS.md HANDOFF-studio.md ..." ; NAME=studio|air
if [ ! -d $G/.git ]; then mkdir -p $G; cd $G; git init -q -b $B; git remote add origin https://github.com/mike9304/tseng-law.git; fi
cd $G; git fetch -q --depth 1 origin $B:refs/remotes/origin/$B && git reset -q --hard origin/$B || exit 1
for o in $OWN; do [ -e $L/$o ] || continue; if [ -d $L/$o ]; then mkdir -p $o; rsync -a --delete --exclude '*.jsonl' $L/$o/ $o/; else cp $L/$o $o; fi; git add -A $o; done
git diff --cached --quiet || { git commit -qm "threads-collab: $NAME sync $(date '+%m-%d %H:%M')"; for k in 1 2 3; do git push -q origin HEAD:$B && { echo "$(date) pushed"; break; }; git fetch -q --depth 5 origin $B:refs/remotes/origin/$B; git rebase -q origin/$B; done; }
for p in $(ls -A | grep -v '^\.git$'); do case " $OWN " in *" $p "*) continue;; esac; [ "$p" = README.md ] && continue
  if [ -d $p ]; then mkdir -p $L/$p; rsync -a --delete $p/ $L/$p/; else cp $p $L/$p; fi; done
