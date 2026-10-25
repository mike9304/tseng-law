#!/usr/bin/env python3
"""Read-only proof of the bounded B4 metadata/test-contract maintenance."""
from pathlib import Path
from datetime import datetime
import hashlib
import json
import re
import subprocess

R = Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
B = Path('/Users/son7/tseng-all-language-columns-20261025/batch04')
BASELINE = '3b5ea95061d61a6b9a0e94eb61438be843fdd63c'
DEST = B / 'release26/checks/test-contract-maintenance-review.json'
inputs = {}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def read(path):
    path = Path(path)
    data = path.read_bytes()
    inputs[str(path)] = sha(data)
    return data


def git(*args):
    return subprocess.check_output(['git', *args], cwd=R)


assert not DEST.exists(), 'Preserve prior evidence: choose a new result path.'
receipt = json.loads(read(B / 'checks/case-topic-normalization.json'))
patch = read(B / 'checks/test-contract-maintenance.patch')
cin = 'src/components/__tests__/cinematic-opening.test.tsx'
helper = 'src/lib/__tests__/native-locale-columns.ts'
changed = git('diff', '--name-only', BASELINE, '--', 'src/app', 'src/components', 'src/lib').decode().splitlines()
assert sorted(changed) == sorted([cin, helper]), changed
untracked = git('ls-files', '--others', '--exclude-standard', '--', 'src/app', 'src/components', 'src/lib').decode().splitlines()
assert untracked == [], untracked
actual_patch = git('diff', BASELINE, '--', cin, helper)
assert actual_patch == patch, 'Saved patch differs from the live worktree delta.'

old_cin = git('show', BASELINE + ':' + cin)
new_cin = read(R / cin)
old_assert = b'    expect(layoutSource).not.toContain("headers } from \'next/headers\'");\n'
new_comment = (b'    // The layout also reads request headers for the static column-language index.\n'
               b'    // Cinematic route selection belongs to the pathname-aware client shell below.\n')
assert old_cin.count(old_assert) == 1
assert old_cin.replace(old_assert, new_comment) == new_cin

old_helper = git('show', BASELINE + ':' + helper)
new_helper = read(R / helper)
addition_locales = ['ru', 'ms', 'fil', 'tr', 'nl', 'zh-hans', 'sv', 'da', 'nb', 'fi', 'pl', 'cs', 'ro', 'uk', 'bg', 'ca', 'el', 'hr', 'hu', 'is', 'sk', 'he', 'bn', 'ur', 'fa', 'my', 'ta', 'ne']
addition = ''.join(f"  '{locale}': ARC_VISA_FILES_20261024,\n" for locale in addition_locales).encode()
expected_helper = old_helper.replace(
    b'/** ARC/visa procedure series, authored for the fourteen requested locales. */',
    b'/** ARC/visa procedure series, expanded to42 authored locales through October26. */')
anchor = b'  ar: ARC_VISA_FILES_20261024,\n'
assert expected_helper.count(anchor) == 1
expected_helper = expected_helper.replace(anchor, anchor + addition)
assert expected_helper == new_helper
registry_text = re.search(rb'export const ARC_VISA_COLUMN_FILES_20261024:[^=]*= \{(.*?)\n\};', new_helper, re.S).group(1).decode()
registry = re.findall(r"^\s*'?([\w-]+)'?: ARC_VISA_FILES_20261024,", registry_text, re.M)
assert len(registry) == len(set(registry)) == 42
arc_files = ['704-taiwan-arc-first-application.md', '705-taiwan-visa-residence-work-study-family.md', '706-taiwan-arc-renewal-changes-reentry.md']
actual_locales = []
partial = []
arc_rows = []
for directory in sorted((R / 'src/content').glob('columns*')):
    if not directory.is_dir():
        continue
    locale = {'columns': 'ko', 'columns-zh': 'zh-hant'}.get(directory.name, directory.name.removeprefix('columns-'))
    present = [filename for filename in arc_files if (directory / filename).is_file()]
    if present:
        if len(present) != 3:
            partial.append({'locale': locale, 'present': present})
        actual_locales.append(locale)
        for filename in present:
            data = read(directory / filename)
            arc_rows.append({'locale': locale, 'file': str((directory / filename).relative_to(R)), 'sha256': sha(data)})
assert not partial, partial
assert sorted(actual_locales) == sorted(registry), {'actual': actual_locales, 'registry': registry}

topic_rows = []
for item in receipt['rows']:
    original = read(item['before_backup'])
    current = read(R / item['file'])
    base = git('show', BASELINE + ':' + item['file'])
    assert original == base
    assert sha(original) == item['before_sha256']
    assert sha(current) == item['after_sha256']
    forward = original
    reverse = current
    for change in item['changes']:
        old, new = change['old'].encode(), change['new'].encode()
        assert forward.count(old) == 1
        forward = forward.replace(old, new)
    for change in reversed(item['changes']):
        old, new = change['old'].encode(), change['new'].encode()
        assert reverse.count(new) == 1
        reverse = reverse.replace(new, old)
    assert forward == current and reverse == original
    old_fm, old_body = original.split(b'---', 2)[1:]
    new_fm, new_body = current.split(b'---', 2)[1:]
    assert old_body == new_body
    reduced = new_fm.replace(b'topic: "litigation"', b'topic: "civil"').replace(b'lastmod: "2026-10-26"', b'lastmod: "2026-10-25"')
    assert reduced == old_fm
    for line in [b'published: "2026-10-25"', 'date_display: "2026年10月25日"'.encode()]:
        assert line in old_fm and line in new_fm
    topic_rows.append({'file': item['file'], 'before_sha256': sha(original), 'after_sha256': sha(current), 'baseline_equals_backup': True, 'exact_forward_and_reverse': True, 'body_unchanged': True, 'all_other_frontmatter_including_FAQ_unchanged': True, 'published_and_display_unchanged': True})

runtime_files = git('ls-tree', '-r', '--name-only', BASELINE, '--', 'src/app', 'src/components', 'src/lib').decode().splitlines()
runtime_rows = []
for name in runtime_files:
    if '/__tests__/' in name or re.search(r'\.(?:test|spec)\.[^/]+$', name):
        continue
    current = read(R / name)
    # git diff above proves equality; record actual bytes for an independently reusable manifest.
    runtime_rows.append({'file': name, 'sha256': sha(current)})
for name in [
    'src/lib/column-topics.ts', 'src/lib/__tests__/column-topics.test.ts',
    'src/lib/__tests__/divorce-columns-20260927.test.ts',
    'src/lib/__tests__/family-columns-20260927.test.ts',
    'src/lib/__tests__/columns-publication-date.test.ts',
]:
    data = read(R / name)
    assert data == git('show', BASELINE + ':' + name)

assert git('diff', '--name-only', BASELINE, '--', 'src/app', 'src/components', 'src/lib').decode().splitlines() == changed
for path, expected in inputs.items():
    assert sha(Path(path).read_bytes()) == expected, 'Input changed during review: ' + path
result = {
    'completed_at': datetime.now().astimezone().isoformat(),
    'baseline_commit': BASELINE,
    'observed_head': git('rev-parse', 'HEAD').decode().strip(),
    'status': 'PASS_read_only_exact_delta_review',
    'tests_executed_by_reviewer': 0,
    'changed_app_components_lib_paths': changed,
    'untracked_app_components_lib_paths': untracked,
    'saved_patch_equals_actual_diff': True,
    'cinematic_change': {'exact_single_assertion_removal_plus_two_comment_lines': True, 'removed_assertion': old_assert.decode().strip(), 'all_other_bytes_unchanged': True, 'before_sha256': sha(old_cin), 'after_sha256': sha(new_cin)},
    'registry_change': {'exact_28_locale_additions_plus_comment': True, 'existing_14_entries_and_all_other_code_unchanged': True, 'registry_count': len(registry), 'actual_complete_locale_count': len(actual_locales), 'registry_equals_actual_complete_locale_set': True, 'partial_locale_sets': partial, 'locales': registry, 'before_sha256': sha(old_helper), 'after_sha256': sha(new_helper), 'arc_files': arc_rows},
    'topic_changes': topic_rows,
    'runtime_paths_byte_identical_to_baseline_count': len(runtime_rows),
    'runtime_manifest': runtime_rows,
    'input_sha256': inputs,
    'all_inputs_unchanged_on_final_read': True,
    'limits': ['No test rerun by this reviewer; root owns test results.', 'No new legal-source refresh; topic suitability assessed from the three complete texts and existing taxonomy.', 'No browser/build/deploy result implied.'],
}
DEST.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'status': result['status'], 'registry_locales': len(registry), 'arc_files': len(arc_rows), 'topic_reverse_proofs': len(topic_rows), 'unchanged_runtime_files': len(runtime_rows), 'stable_inputs': len(inputs), 'report': str(DEST), 'sha256': sha(DEST.read_bytes())}, ensure_ascii=False))
