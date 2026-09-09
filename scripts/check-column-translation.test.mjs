import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

import {
  CHECK_IDS,
  FORBIDDEN_PHRASES,
  checkPair,
  main,
} from './check-column-translation.mjs';

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'check-column-translation.mjs');

const ZWSP = '\u200B';

function sourceDoc(overrides = {}) {
  const intro = overrides.intro ?? 'Intro paragraph with 資遣 解僱 員工 年資 勞動.';
  const body = overrides.body ?? `# Labor heading

![hero](../images/008/featured-01.jpg)

${intro}

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

function targetDoc({ lang = 'vi', body, title = 'Ban dich', faq, extraFrontmatter, intro } = {}) {
  const faqBlock = faq ?? `  - q: "Cau 1?"
    a: "Tra loi 1."
  - q: "Cau 2?"
    a: "Tra loi 2."`;

  const introLine = intro ?? 'Doan mo dau voi 資遣 解僱 員工 年資 勞動.';
  const defaultBody = `# Labor heading ${lang}

![hero](../images/008/featured-01.jpg)

${introLine}

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

test('numbers: identical figures PASS', () => {
  const result = checkPair({
    sourceRaw: sourceDoc({
      intro: 'Intro paragraph with 資遣 解僱 員工 年資 勞動. Fine 40000 TWD and article 12.',
    }),
    targetRaw: targetDoc({
      lang: 'vi',
      intro: 'Doan mo dau voi 資遣 解僱 員工 年資 勞動. Fine 40000 TWD and article 12.',
    }),
    sourcePath: 'src.md',
    targetPath: 'vi.md',
    lang: 'vi',
  });
  assert.equal(result.ok, true, JSON.stringify(result.checks, null, 2));
  assert.equal(statuses(result).numbers, 'PASS');
});

test('numbers: Korean man-unit expansion PASS', () => {
  const result = checkPair({
    sourceRaw: sourceDoc({
      intro: 'Intro paragraph with 資遣 解僱 員工 年資 勞動. 과태료 4만 신타이완달러, 157만, 2,000만.',
    }),
    targetRaw: targetDoc({
      lang: 'vi',
      intro: 'Doan mo dau voi 資遣 解僱 員工 年資 勞動. Phat 40.000 TWD, 1.570.000, 20.000.000.',
    }),
    sourcePath: 'src.md',
    targetPath: 'vi.md',
    lang: 'vi',
  });
  assert.equal(statuses(result).numbers, 'PASS', JSON.stringify(result.checks.find((c) => c.id === 'numbers'), null, 2));
  assert.equal(result.ok, true);
});

test('numbers: missing source figure FAILs', () => {
  const result = checkPair({
    sourceRaw: sourceDoc({
      intro: 'Intro paragraph with 資遣 解僱 員工 年資 勞動. Fine 4만 TWD and article 12.',
    }),
    targetRaw: targetDoc({
      lang: 'vi',
      intro: 'Doan mo dau voi 資遣 解僱 員工 年資 勞動. Article 12 only.',
    }),
    sourcePath: 'src.md',
    targetPath: 'vi.md',
    lang: 'vi',
  });
  assert.equal(result.ok, false);
  assert.equal(statuses(result).numbers, 'FAIL');
  const details = result.checks.find((check) => check.id === 'numbers').details.join('\n');
  assert.match(details, /40000/);
});

test('numbers: altered figure FAILs', () => {
  const result = checkPair({
    sourceRaw: sourceDoc({
      intro: 'Intro paragraph with 資遣 解僱 員工 年資 勞動. Fine 4만 TWD.',
    }),
    targetRaw: targetDoc({
      lang: 'vi',
      intro: 'Doan mo dau voi 資遣 解僱 員工 年資 勞動. Phat 50.000 TWD.',
    }),
    sourcePath: 'src.md',
    targetPath: 'vi.md',
    lang: 'vi',
  });
  assert.equal(result.ok, false);
  assert.equal(statuses(result).numbers, 'FAIL');
  const details = result.checks.find((check) => check.id === 'numbers').details.join('\n');
  assert.match(details, /40000/);
});

test('numbers: id thousand-dot grouping PASS', () => {
  const result = checkPair({
    sourceRaw: sourceDoc({
      intro: 'Intro paragraph with 資遣 解僱 員工 年資 勞動. 자본금 100만 대만달러와 1,000,000.',
    }),
    targetRaw: targetDoc({
      lang: 'id',
      intro: 'Doan mo dau voi 資遣 解僱 員工 年資 勞動. Modal 1.000.000 Dolar Taiwan dan 1.000.000.',
    }),
    sourcePath: 'src.md',
    targetPath: 'id.md',
    lang: 'id',
  });
  assert.equal(statuses(result).numbers, 'PASS', JSON.stringify(result.checks.find((c) => c.id === 'numbers'), null, 2));
  assert.equal(result.ok, true);
});

test('numbers: statute 병기 duplicate PASS', () => {
  const result = checkPair({
    sourceRaw: sourceDoc({
      intro: 'Intro paragraph with 資遣 解僱 員工 年資 勞動. 노동기준법 제11조.',
    }),
    targetRaw: targetDoc({
      lang: 'id',
      intro: 'Doan mo dau voi 資遣 解僱 員工 年資 勞動. Pasal 11 Undang-Undang (勞動基準法第11條).',
    }),
    sourcePath: 'src.md',
    targetPath: 'id.md',
    lang: 'id',
  });
  assert.equal(statuses(result).numbers, 'PASS', JSON.stringify(result.checks.find((c) => c.id === 'numbers'), null, 2));
  assert.equal(result.ok, true);
});

const WORD_NUMERAL_FIXTURES = {
  vi: {
    word: ['기한은 15일이고 의결은 3분의 2이며 근속은 1년이다.', 'Thời hạn là mười lăm ngày, nghị quyết hai phần ba, thâm niên một năm.'],
    scale: ['배상액 157만 대만달러.', 'Bồi thường 1.57 triệu Đài tệ.'],
    approx: ['한 번에 10여 개의 업종.', 'khoảng mười ngành nghề.'],
    missing: ['과태료 4만 신타이완달러와 조문 12.', 'Chỉ còn điều 12.'],
    altered: ['과태료 4만 신타이완달러.', 'Phạt 50.000 TWD.'],
  },
  id: {
    word: ['기한은 15일이고 의결은 3분의 2이며 근속은 1년이다.', 'Batasnya lima belas hari, kuorum dua pertiga, masa kerja satu tahun.'],
    scale: ['배상액 157만 대만달러.', 'Ganti rugi 1,57 juta Dolar Taiwan.'],
    approx: ['한 번에 10여 개의 업종.', 'sekitar sepuluh bidang usaha.'],
    missing: ['과태료 4만 신타이완달러와 조문 12.', 'Hanya pasal 12.'],
    altered: ['과태료 4만 신타이완달러.', 'Denda 50.000 TWD.'],
  },
  th: {
    word: ['기한은 15일이고 의결은 3분의 2이며 근속은 1년이다.', 'กำหนดสิบห้าวัน มติสองในสาม อายุงานหนึ่งปี'],
    scale: ['배상액 157만 대만달러.', 'ค่าสินไหม 1.57 ล้านดอลลาร์ไต้หวัน'],
    approx: ['한 번에 10여 개의 업종.', 'ประมาณสิบประเภทกิจการ'],
    missing: ['과태료 4만 신타이완달러와 조문 12.', 'เหลือเพียงมาตรา 12'],
    altered: ['과태료 4만 신타이완달러.', 'ค่าปรับ 50,000 TWD'],
  },
  fil: {
    word: ['기한은 15일이고 의결은 3분의 2이며 근속은 1년이다.', 'Ang taning ay labinlimang araw, ang boto ay dalawang katlo, ang senioridad ay isang taon.'],
    scale: ['배상액 157만 대만달러.', 'Danyos na TWD 1.57 milyon.'],
    approx: ['한 번에 10여 개의 업종.', 'humigit-kumulang sampung uri ng negosyo.'],
    missing: ['과태료 4만 신타이완달러와 조문 12.', 'Tanging artikulo 12 na lang.'],
    altered: ['과태료 4만 신타이완달러.', 'Multa na 50,000 TWD.'],
  },
};

function numbersCheck(lang, sourceTail, targetTail) {
  return checkPair({
    sourceRaw: sourceDoc({
      intro: `Intro paragraph with 資遣 解僱 員工 年資 勞動. ${sourceTail}`,
    }),
    targetRaw: targetDoc({
      lang,
      intro: `Doan mo dau voi 資遣 解僱 員工 年資 勞動. ${targetTail}`,
    }),
    sourcePath: 'src.md',
    targetPath: `${lang}.md`,
    lang,
  });
}

for (const lang of ['vi', 'id', 'th', 'fil']) {
  const fx = WORD_NUMERAL_FIXTURES[lang];

  test(`numbers: ${lang} word numerals PASS`, () => {
    const result = numbersCheck(lang, fx.word[0], fx.word[1]);
    assert.equal(
      statuses(result).numbers,
      'PASS',
      JSON.stringify(result.checks.find((c) => c.id === 'numbers'), null, 2),
    );
    assert.equal(result.ok, true);
  });

  test(`numbers: ${lang} decimal+unit PASS`, () => {
    const result = numbersCheck(lang, fx.scale[0], fx.scale[1]);
    assert.equal(
      statuses(result).numbers,
      'PASS',
      JSON.stringify(result.checks.find((c) => c.id === 'numbers'), null, 2),
    );
    assert.equal(result.ok, true);
  });

  test(`numbers: ${lang} approximate PASS`, () => {
    const result = numbersCheck(lang, fx.approx[0], fx.approx[1]);
    assert.equal(
      statuses(result).numbers,
      'PASS',
      JSON.stringify(result.checks.find((c) => c.id === 'numbers'), null, 2),
    );
    assert.equal(result.ok, true);
  });

  test(`numbers: ${lang} true omission FAIL`, () => {
    const result = numbersCheck(lang, fx.missing[0], fx.missing[1]);
    assert.equal(result.ok, false);
    assert.equal(statuses(result).numbers, 'FAIL');
    const details = result.checks.find((check) => check.id === 'numbers').details.join('\n');
    assert.match(details, /40000/);
  });

  test(`numbers: ${lang} true alteration FAIL`, () => {
    const result = numbersCheck(lang, fx.altered[0], fx.altered[1]);
    assert.equal(result.ok, false);
    assert.equal(statuses(result).numbers, 'FAIL');
    const details = result.checks.find((check) => check.id === 'numbers').details.join('\n');
    assert.match(details, /40000/);
  });
}

test('numbers: fil bare "isa" counts as 1', () => {
  const result = numbersCheck(
    'fil',
    '종업원 1명 이상인 경우에 적용한다.',
    'Nalalapat ito kapag isa pataas ang bilang ng empleyado.',
  );
  assert.equal(statuses(result).numbers, 'PASS', JSON.stringify(result.checks.find((c) => c.id === 'numbers'), null, 2));
  assert.equal(result.ok, true);
});

test('numbers: fil "isang" counts as 1 before a noun outside the unit list', () => {
  const result = numbersCheck(
    'fil',
    '소형 화물차 1대를 사용한다.',
    'Gumagamit ito ng isang small truck.',
  );
  assert.equal(statuses(result).numbers, 'PASS', JSON.stringify(result.checks.find((c) => c.id === 'numbers'), null, 2));
  assert.equal(result.ok, true);
});

test('numbers: fil "isang"/"isa" do not excuse a genuinely dropped number', () => {
  const result = numbersCheck(
    'fil',
    '근속 3년이면 과태료 4만 신타이완달러와 조문 12를 적용한다.',
    'Kung isang taon lamang, artikulo 12 na lang ang nalalapat sa isa.',
  );
  assert.equal(result.ok, false);
  assert.equal(statuses(result).numbers, 'FAIL');
  const details = result.checks.find((check) => check.id === 'numbers').details.join('\n');
  assert.match(details, /missing from translation/);
  assert.match(details, /40000/);
  assert.match(details, /\b3\b/);
});

test('numbers: unknown numeral spelling WARNs 수사 미해석', () => {
  const result = numbersCheck(
    'id',
    'Intro only 資遣 解僱 員工 年資 勞動.',
    'Doan mo dau voi 資遣 解僱 員工 年資 勞動. denda xyz juta.',
  );
  assert.equal(statuses(result).numbers, 'WARN', JSON.stringify(result.checks.find((c) => c.id === 'numbers'), null, 2));
  assert.match(result.checks.find((check) => check.id === 'numbers').details.join('\n'), /수사 미해석/);
  assert.equal(result.ok, true);
});

const ORDINAL_FIXTURES = {
  vi: {
    match: [
      '제1심 변론 종결 전까지 고소를 취하할 수 있고, 1,000원당 1일로 계산한다.',
      'có thể rút yêu cầu trước lúc kết thúc tranh luận tại phiên tòa sơ thẩm, mức tính là TWD 1,000 cho mỗi ngày.',
    ],
    unknown: [
      '제1심 변론 종결 전까지 고소를 취하할 수 있다.',
      'có thể rút yêu cầu trước lúc kết thúc tranh luận tại phiên tòa cấp lạ.',
    ],
  },
  id: {
    match: [
      '제3자와 대만 사업에 공동 출자하려면 건물 등기 제2종 등본이 필요하다.',
      'Untuk menanamkan modal bersama pihak ketiga diperlukan salinan pendaftaran bangunan jenis kedua.',
    ],
    unknown: [
      '제3자와 대만 사업에 공동 출자하려면 검토가 필요하다.',
      'Untuk menanamkan modal bersama pihak asing diperlukan kajian.',
    ],
  },
  th: {
    match: [
      '제1심 법원에서 제1항에 따른 손해배상을 묻고, 1,000원당 1일로 계산한다.',
      'ศาลชั้นต้นพิจารณาค่าเสียหายตามวรรคหนึ่ง และคิด วันละ 1,000.',
    ],
    unknown: [
      '제1항에 따른 손해배상을 청구한다.',
      'เรียกค่าเสียหายตามข้อความที่ไม่ใช่หน่วยบัญญัติ.',
    ],
  },
  fil: {
    match: [
      '제3자가 지원할 수 있고 건물 등기 제2종 등본과 1심 판결을 첨부한다.',
      'Maaaring tumulong ang isang ikatlong partido, at ilakip ang Type II building registration transcript at First Instance judgment.',
    ],
    unknown: [
      '제3자가 지원할 수 있다.',
      'Maaaring tumulong ang ibang tao na hindi partido.',
    ],
  },
};

for (const lang of ['vi', 'id', 'th', 'fil']) {
  const fx = ORDINAL_FIXTURES[lang];

  test(`numbers: ${lang} ordinal/article wording PASS`, () => {
    const result = numbersCheck(lang, fx.match[0], fx.match[1]);
    assert.equal(
      statuses(result).numbers,
      'PASS',
      JSON.stringify(result.checks.find((c) => c.id === 'numbers'), null, 2),
    );
    assert.equal(result.ok, true);
  });

  test(`numbers: ${lang} unmatched ordinal WARNs 수사미해석`, () => {
    const result = numbersCheck(lang, fx.unknown[0], fx.unknown[1]);
    const numbers = result.checks.find((check) => check.id === 'numbers');
    assert.match(
      numbers.details.join('\n'),
      /수사미해석/,
      JSON.stringify(numbers, null, 2),
    );
    assert.notEqual(numbers.status, 'PASS');
  });
}

test('checker includes nationality alongside the existing 9+1 ids', () => {
  assert.deepEqual(CHECK_IDS, [
    'frontmatter',
    'headings',
    'images',
    'blocks',
    'links',
    'hangul',
    'english',
    'forbidden',
    'hanzi',
    'numbers',
    'nationality',
  ]);
});

const NATIONALITY_FIXTURES = {
  vi: { insert: 'Doanh nghiệp Việt Nam phải nộp hồ sơ.', language: 'Hồ sơ có thể soạn bằng tiếng Việt.' },
  id: { insert: 'Perusahaan Indonesia wajib mengajukan berkas.', language: 'Dokumen dapat disusun dalam bahasa Indonesia.' },
  th: { insert: 'คนไทยต้องยื่นเอกสารชุดนี้.', language: 'เอกสารจัดทำเป็นภาษาไทยได้.' },
  fil: { insert: 'Ang kompanya sa Pilipinas ay dapat maghain.', language: 'Maaaring isulat sa wikang Filipino.' },
};

for (const lang of ['vi', 'id', 'th', 'fil']) {
  const fx = NATIONALITY_FIXTURES[lang];

  test(`nationality: ${lang} inserted demonym FAILs with block citation`, () => {
    const result = checkPair({
      sourceRaw: sourceDoc({
        intro: 'Intro paragraph with 資遣 解僱 員工 年資 勞動. 외국인 투자자가 서류를 낸다.',
      }),
      targetRaw: targetDoc({
        lang,
        intro: `Doan mo dau voi 資遣 解僱 員工 年資 勞動. ${fx.insert}`,
      }),
      sourcePath: 'src.md',
      targetPath: `${lang}.md`,
      lang,
    });
    assert.equal(result.ok, false);
    assert.equal(statuses(result).nationality, 'FAIL');
    const details = result.checks.find((check) => check.id === 'nationality').details.join('\n');
    assert.match(details, /block\[/);
    assert.match(details, /src="/);
    assert.match(details, /tgt="/);
  });

  test(`nationality: ${lang} language-name mention PASSes`, () => {
    const result = checkPair({
      sourceRaw: sourceDoc({
        intro: 'Intro paragraph with 資遣 解僱 員工 年資 勞動. 서류를 현지어로 작성할 수 있다.',
      }),
      targetRaw: targetDoc({
        lang,
        intro: `Doan mo dau voi 資遣 解僱 員工 年資 勞動. ${fx.language}`,
      }),
      sourcePath: 'src.md',
      targetPath: `${lang}.md`,
      lang,
    });
    assert.equal(
      statuses(result).nationality,
      'PASS',
      JSON.stringify(result.checks.find((c) => c.id === 'nationality'), null, 2),
    );
  });

  test(`nationality: ${lang} adapt-log evidence WARNs 근거있음`, () => {
    const result = checkPair({
      sourceRaw: sourceDoc({
        intro: 'Intro paragraph with 資遣 解僱 員工 年資 勞動. 외국인 투자자가 서류를 낸다.',
      }),
      targetRaw: targetDoc({
        lang,
        intro: `Doan mo dau voi 資遣 解僱 員工 年資 勞動. ${fx.insert}`,
      }),
      sourcePath: 'src.md',
      targetPath: `${lang}.md`,
      lang,
      adaptLog: `| 2 | 외국인 투자자가 서류를 낸다. | ${fx.insert} | 브리프 1 프레이밍 교체 |\n`,
    });
    assert.equal(
      statuses(result).nationality,
      'WARN',
      JSON.stringify(result.checks.find((c) => c.id === 'nationality'), null, 2),
    );
    assert.match(result.checks.find((check) => check.id === 'nationality').details.join('\n'), /근거있음/);
    assert.equal(result.ok, true);
  });
}

test('nationality: source-block country name is not an insertion', () => {
  const result = checkPair({
    sourceRaw: sourceDoc({
      intro: 'Intro paragraph with 資遣 解僱 員工 年資 勞動. 한국 기업이 대만 시장에 진출한다.',
    }),
    targetRaw: targetDoc({
      lang: 'vi',
      intro: 'Doan mo dau voi 資遣 解僱 員工 年資 勞動. Doanh nghiệp Việt Nam tiến vào thị trường Đài Loan.',
    }),
    sourcePath: 'src.md',
    targetPath: 'vi.md',
    lang: 'vi',
  });
  assert.equal(
    statuses(result).nationality,
    'PASS',
    JSON.stringify(result.checks.find((c) => c.id === 'nationality'), null, 2),
  );
});

test('CLI --check nationality runs that gate and prints it in the table', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'col-tr-nat-'));
  try {
    const sourcePath = join(dir, 'src.md');
    const targetPath = join(dir, 'vi.md');
    await writeFile(sourcePath, sourceDoc({
      intro: 'Intro paragraph with 資遣 解僱 員工 年資 勞動. 외국인 투자자가 서류를 낸다.',
    }));
    await writeFile(targetPath, targetDoc({
      lang: 'vi',
      intro: 'Doan mo dau voi 資遣 解僱 員工 年資 勞動. Doanh nghiệp Việt Nam phải nộp hồ sơ.',
    }));
    const ran = await runCli(
      ['--source', sourcePath, '--target', targetPath, '--lang', 'vi', '--check', 'nationality'],
      dir,
    );
    assert.equal(ran.code, 1, ran.stdout + ran.stderr);
    assert.match(ran.stdout, /nationality\s+FAIL/);
    assert.doesNotMatch(ran.stdout, /frontmatter\s+/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
