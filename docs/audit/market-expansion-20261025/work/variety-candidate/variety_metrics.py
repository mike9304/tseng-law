#!/usr/bin/env python3
"""Guarded entrypoint for this task-local, independently reviewed extension.

The official shared checker is always tried first for the six new locales.
Its unsupported-language result is not reported as PASS. Existing locales
are sent directly to the official checker. No global files are installed.
"""
from pathlib import Path
import os
import subprocess
import sys

ROOT = Path(__file__).resolve().parent
OFFICIAL = Path('/Users/son7/tseng-lanes-shared/variety/variety_metrics.py')
NEW = ('fil', 'he', 'nl', 'pl', 'cs', 'lt')

args = sys.argv[1:]
child_env = {**os.environ, 'PYTHONDONTWRITEBYTECODE': '1'}
if not args or args[0] != 'check':
    print('TASK-LOCAL extension: only check mode is available through this guarded entrypoint.', file=sys.stderr)
    raise SystemExit(2)
lang = None
for index, value in enumerate(args):
    if value == '--lang' and index + 1 < len(args):
        lang = args[index + 1]
    elif value.startswith('--lang='):
        lang = value.split('=', 1)[1]
if lang not in NEW:
    # No autodetected extension route here: new locales require explicit intent.
    os.execve(sys.executable, [sys.executable, str(OFFICIAL), *args], child_env)
official = subprocess.run([sys.executable, str(OFFICIAL), *args],
                          capture_output=True, text=True, env=child_env)
unsupported = official.returncode == 2 and ('invalid choice' in official.stderr or
                                           'unsupported language' in official.stdout)
if not unsupported:
    sys.stdout.write(official.stdout)
    sys.stderr.write(official.stderr)
    print('Task-local extension withheld: official checker no longer reports this locale unsupported; use its current result.', file=sys.stderr)
    raise SystemExit(2)
print(f'OFFICIAL CHECKER: {lang} unsupported (exit 2; not a measured PASS).', file=sys.stderr)
print('TASK-LOCAL EXTENSION: original HARD thresholds; not installed as the shared checker.', file=sys.stderr)
sys.stderr.flush()
os.execv(sys.executable, [sys.executable, str(ROOT / 'candidate/variety_metrics.py'), *args])
