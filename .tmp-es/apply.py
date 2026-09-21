#!/usr/bin/env python3
"""Targeted, assert-once replacements for the es fix lane."""
import sys, io, os

ROOT = "/Users/son7/Projects/tseng-law-fix-s-20260921"

def apply(relpath, pairs, count_expect=None):
    p = os.path.join(ROOT, relpath)
    s = io.open(p, encoding="utf-8").read()
    total = 0
    for old, new, *rest in pairs:
        n_expected = rest[0] if rest else 1
        n = s.count(old)
        if n != n_expected:
            print(f"!! {relpath}: expected {n_expected} occurrence(s), found {n} for: {old[:90]!r}")
            sys.exit(2)
        s = s.replace(old, new)
        total += n
    io.open(p, "w", encoding="utf-8").write(s)
    print(f"ok {relpath}: {total} replacement(s)")

def apply_slice(relpath, start, end, pairs):
    """Replace only inside the [start,end) line range (1-based, end exclusive)."""
    p = os.path.join(ROOT, relpath)
    lines = io.open(p, encoding="utf-8").read().split("\n")
    head = "\n".join(lines[:start-1])
    mid = "\n".join(lines[start-1:end-1])
    tail = "\n".join(lines[end-1:])
    total = 0
    for old, new, *rest in pairs:
        n_expected = rest[0] if rest else 1
        n = mid.count(old)
        if n != n_expected:
            print(f"!! {relpath}[{start},{end}): expected {n_expected}, found {n} for: {old[:90]!r}")
            sys.exit(2)
        mid = mid.replace(old, new)
        total += n
    io.open(p, "w", encoding="utf-8").write("\n".join([head, mid, tail]))
    print(f"ok {relpath}[{start},{end}): {total} replacement(s)")
