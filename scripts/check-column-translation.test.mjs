import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

import {
  FORBIDDEN_PHRASES,
  checkPair,
  main,
} from './check-column-translation.mjs';

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'check-column-translation.mjs');

const ZWSP = '\u200B';

function sourceDoc(overrides = {}) {
  const body = overrides.body ?? `# Labor heading

![hero](../images/008/featured-01.jpg)

Intro paragraph with 資遣 解僱 員工 年資 勞動.

${ZWSP}

| kind | note |
| --- | --- |
| A | 資遣費 |

> quote one
> quote two

- item one
- item two

See [contact](/ko/contact) and [litigation](/ko/taiwan-litigation-lawyer) and [labor](/ko/services/labor).
`;

  return `---
title: "Source title"
url: "https://example.com/post/labor-severance"
lastmod: "2025-09-18"
date_display: "Sept 13"
read_time: "3 min"
categories:
  - "Labor"
featured_image: "../images/008/featured-01.jpg"
faq:
  - q: "Q1?"
    a: "A1."
  - q: "Q2?"
    a: "A2."
---

${body}`;
}

function targetDoc({ lang = 'vi', body, title = 'Ban dich', faq, extraFrontmatter } = {}) {
  const faqBlock = faq ?? `  - q: "Cau 1?"
    a: "Tra loi 1."
  - q: "Cau 2?"
    a: "Tra loi 2."`;

  const defaultBody = `# Labor heading ${lang}

![hero](../images/008/featured-01.jpg)

Doan mo dau voi 資遣 解僱 員工 年資 勞動.

${ZWSP}

| kind | note |
| --- | --- |
| A | 資遣費 |

> quote one
> quote two

- item one
- item two

See [contact](/${lang}/contact) and [litigation](/ko/taiwan-litigation-lawyer) and [labor](/ko/services/labor).
`;

  return `---
title: "${title}"
url: "https://example.com/post/labor-severance"
lastmod: "2025-09-18"
date_display: "Sept 13"
read_time: "3 min"
categories:
  - "Labor"
featured_image: "../images/008/featured-01.jpg"
faq:
${faqBlock}${extraFrontmatter ?? ''}
---

${body ?? defaultBody}`;
}

function statuses(result) {
  return Object.fromEntries(result.checks.map((check) => [check.id, check.status]));
}

function runCli(args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [SCRIPT, ...args], {
      cwd,
      env: { ...process.env, LANG: 'C' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', reject);
    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

test('forbidden phrase tables have 5–10 patterns per guidance language', () => {
  for (const lang of ['vi', 'id', 'th', 'fil']) {
    const count = FORBIDDEN_PHRASES[lang].length;
    assert.ok(count >= 5 && count <= 10, `${lang} has ${count} patterns`);
  }
});

test('isomorphic translation PASSes every check', () => {
  const result = checkPair({
    sourceRaw: sourceDoc(),
    targetRaw: targetDoc({ lang: 'vi' }),
    sourcePath: 'src.md',
    targetPath: 'vi.md',
    lang: 'vi',
  });
  assert.equal(result.ok, true, JSON.stringify(result.checks, null, 2));
  for (const check of result.checks) {
    assert.equal(check.status, 'PASS', `${check.id} ${check.status} ${check.details.join('; ')}`);
  }
});

test('FAQ count mismatch FAILs frontmatter', () => {
  const result = checkPair({
    sourceRaw: sourceDoc(),
    targetRaw: targetDoc({
      lang: 'vi',
      faq: `  - q: "Cau 1?"
    a: "Tra loi 1."`,
    }),
    sourcePath: 'src.md',
    targetPath: 'vi.md',
    lang: 'vi',
  });
  assert.equal(result.ok, false);
  assert.equal(statuses(result).frontmatter, 'FAIL');
  assert.match(result.checks.find((check) => check.id === 'frontmatter').details.join('\n'), /faq count 2 → 1/);
});

test('disallowed /{lang}/services/<slug> transform FAILs links', () => {
  const body = `# Labor heading vi

![hero](../images/008/featured-01.jpg)

Doan mo dau voi 資遣 解僱 員工 年資 勞動.

${ZWSP}

| kind | note |
| --- | --- |
| A | 資遣費 |

> quote one
> quote two

- item one
- item two

See [contact](/vi/contact) and [litigation](/ko/taiwan-litigation-lawyer) and [labor](/vi/services/labor).
`;
  const result = checkPair({
    sourceRaw: sourceDoc(),
    targetRaw: targetDoc({ lang: 'vi', body }),
    sourcePath: 'src.md',
    targetPath: 'vi.md',
    lang: 'vi',
  });
  assert.equal(result.ok, false);
  assert.equal(statuses(result).links, 'FAIL');
  const details = result.checks.find((check) => check.id === 'links').details.join('\n');
  assert.match(details, /\/vi\/services\/labor/);
});

test('leftover Hangul in body FAILs hangul with line', () => {
  const body = `# Labor heading vi

![hero](../images/008/featured-01.jpg)

Doan mo dau voi 資遣 解僱 員工 年資 勞動. 퇴직금 leftover.

${ZWSP}

| kind | note |
| --- | --- |
| A | 資遣費 |

> quote one
> quote two

- item one
- item two

See [contact](/vi/contact) and [litigation](/ko/taiwan-litigation-lawyer) and [labor](/ko/services/labor).
`;
  const result = checkPair({
    sourceRaw: sourceDoc(),
    targetRaw: targetDoc({ lang: 'vi', body }),
    sourcePath: 'src.md',
    targetPath: 'vi.md',
    lang: 'vi',
  });
  assert.equal(result.ok, false);
  assert.equal(statuses(result).hangul, 'FAIL');
  assert.match(result.checks.find((check) => check.id === 'hangul').details.join('\n'), /퇴직금/);
});

test('forbidden vi success-rate FAILs with line', () => {
  const body = targetDoc({ lang: 'vi' }).split('---').slice(2).join('---').replace(
    'Doan mo dau voi 資遣 解僱 員工 年資 勞動.',
    'Doan mo dau voi 資遣 解僱 員工 年資 勞動. ty le thanh cong: tỷ lệ thành công cao.',
  );
  const result = checkPair({
    sourceRaw: sourceDoc(),
    targetRaw: targetDoc({ lang: 'vi', body }),
    sourcePath: 'src.md',
    targetPath: 'vi.md',
    lang: 'vi',
  });
  assert.equal(statuses(result).forbidden, 'FAIL');
  assert.match(result.checks.find((check) => check.id === 'forbidden').details.join('\n'), /vi-success-rate/);
});

test('forbidden id cost-guarantee FAILs with line', () => {
  const body = targetDoc({ lang: 'id' }).split(/^---$/m).slice(2).join('---').replace(
    'Doan mo dau voi 資遣 解僱 員工 年資 勞動.',
    'Paragraf dengan 資遣 解僱 員工 年資 勞動. jaminan biaya kemenangan.',
  );
  const result = checkPair({
    sourceRaw: sourceDoc(),
    targetRaw: targetDoc({ lang: 'id', body }),
    sourcePath: 'src.md',
    targetPath: 'id.md',
    lang: 'id',
  });
  assert.equal(statuses(result).forbidden, 'FAIL');
  assert.match(result.checks.find((check) => check.id === 'forbidden').details.join('\n'), /id-cost-guarantee/);
});

test('forbidden th success-rate FAILs with line', () => {
  const body = targetDoc({ lang: 'th' }).split(/^---$/m).slice(2).join('---').replace(
    'Doan mo dau voi 資遣 解僱 員工 年資 勞動.',
    'ย่อหน้า 資遣 解僱 員工 年資 勞動 อัตราความสำเร็จ ของคดี',
  );
  const result = checkPair({
    sourceRaw: sourceDoc(),
    targetRaw: targetDoc({ lang: 'th', body }),
    sourcePath: 'src.md',
    targetPath: 'th.md',
    lang: 'th',
  });
  assert.equal(statuses(result).forbidden, 'FAIL');
  assert.match(result.checks.find((check) => check.id === 'forbidden').details.join('\n'), /th-success-rate/);
});

test('forbidden fil interpreter FAILs with line', () => {
  const body = targetDoc({ lang: 'fil' }).split(/^---$/m).slice(2).join('---').replace(
    'Doan mo dau voi 資遣 解僱 員工 年資 勞動.',
    'Talata 資遣 解僱 員工 年資 勞動. Interpreter provided sa opisina.',
  );
  const result = checkPair({
    sourceRaw: sourceDoc(),
    targetRaw: targetDoc({ lang: 'fil', body }),
    sourcePath: 'src.md',
    targetPath: 'fil.md',
    lang: 'fil',
  });
  assert.equal(statuses(result).forbidden, 'FAIL');
  assert.match(result.checks.find((check) => check.id === 'forbidden').details.join('\n'), /fil-interpreter/);
});

test('forbidden vi interpreter FAILs with line', () => {
  const body = targetDoc({ lang: 'vi' }).split(/^---$/m).slice(2).join('---').replace(
    'Doan mo dau voi 資遣 解僱 員工 年資 勞動.',
    'Doan mo dau voi 資遣 解僱 員工 年資 勞動. Chúng tôi có phiên dịch viên sẵn.',
  );
  const result = checkPair({
    sourceRaw: sourceDoc(),
    targetRaw: targetDoc({ lang: 'vi', body }),
    sourcePath: 'src.md',
    targetPath: 'vi.md',
    lang: 'vi',
  });
  assert.equal(statuses(result).forbidden, 'FAIL');
  assert.match(result.checks.find((check) => check.id === 'forbidden').details.join('\n'), /vi-interpreter/);
});

test('fil leftover English is WARN only and does not fail the pair', () => {
  const english =
    'The company must pay the severance of the employee for that year with the average wage of the worker.';
  const body = targetDoc({ lang: 'fil' }).split(/^---$/m).slice(2).join('---').replace(
    'Doan mo dau voi 資遣 解僱 員工 年資 勞動.',
    english,
  );
  const result = checkPair({
    sourceRaw: sourceDoc(),
    targetRaw: targetDoc({ lang: 'fil', body }),
    sourcePath: 'src.md',
    targetPath: 'fil.md',
    lang: 'fil',
  });
  assert.equal(statuses(result).english, 'WARN', JSON.stringify(result.checks, null, 2));
  assert.equal(result.ok, true);
});

test('CLI isomorphic pair exits 0 and prints PASS table', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'col-tr-pass-'));
  try {
    const sourcePath = join(dir, 'src.md');
    const targetPath = join(dir, 'vi.md');
    await writeFile(sourcePath, sourceDoc());
    await writeFile(targetPath, targetDoc({ lang: 'vi' }));
    const ran = await runCli(['--source', sourcePath, '--target', targetPath, '--lang', 'vi'], dir);
    assert.equal(ran.code, 0, ran.stdout + ran.stderr);
    assert.match(ran.stdout, /frontmatter\s+PASS/);
    assert.match(ran.stdout, /summary\s+PASS/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('CLI FAQ mismatch exits 1', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'col-tr-faq-'));
  try {
    const sourcePath = join(dir, 'src.md');
    const targetPath = join(dir, 'vi.md');
    await writeFile(sourcePath, sourceDoc());
    await writeFile(
      targetPath,
      targetDoc({
        lang: 'vi',
        faq: `  - q: "Cau 1?"
    a: "Tra loi 1."`,
      }),
    );
    const ran = await runCli(['--source', sourcePath, '--target', targetPath, '--lang', 'vi'], dir);
    assert.equal(ran.code, 1, ran.stdout + ran.stderr);
    assert.match(ran.stdout, /frontmatter\s+FAIL/);
    assert.match(ran.stdout, /faq count/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('CLI --dir matches filenames and writes json', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'col-tr-dir-'));
  try {
    const sourceDir = join(dir, 'columns');
    const targetDir = join(dir, 'columns-vi');
    await mkdir(sourceDir);
    await mkdir(targetDir);
    await writeFile(join(sourceDir, '008-labor.md'), sourceDoc());
    await writeFile(join(targetDir, '008-labor.md'), targetDoc({ lang: 'vi' }));
    const jsonPath = join(dir, 'out.json');
    const code = await main(
      ['--dir', targetDir, '--source', sourceDir, '--lang', 'vi', '--json', jsonPath],
      { log() {} },
    );
    assert.equal(code, 0);
    const { readFile } = await import('node:fs/promises');
    const json = JSON.parse(await readFile(jsonPath, 'utf8'));
    assert.equal(json.ok, true);
    assert.equal(json.lang, 'vi');
    assert.equal(json.count, 1);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
