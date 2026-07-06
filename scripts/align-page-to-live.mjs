#!/usr/bin/env node
// align-page-to-live.mjs
//
// 빌더 문서(draft)의 노드 rect/스타일을 라이브(tseng-law.com) 실측 지오메트리 spec 에 정합한다.
// dry-run 기본. --apply 시에만 PUT. --publish 시 PUT 후 단건 발행(낙관적 동시성).
//
// 로컬 빌더 서버 경유로만 동작(HTTP Basic auth). blob 토큰 미사용.
// PUT 전 원본 draft 를 파일로 백업.
//
// 계약 참조:
//   GET/PUT /api/builder/site/pages/{pageId}/draft?locale=<locale>   (site/pages/[pageId]/draft/route.ts)
//     PUT body: { siteId, expectedRevision, document }               (envelope 존재시 expectedRevision 필수)
//   POST    /api/builder/site/pages/{pageId}/publish?locale=<locale> (site/pages/[pageId]/publish/route.ts)
//     body:   { siteId, expectedDraftRevision }
//   slug -> pageId 해석: GET /api/builder/site/pages?locale=<locale> 의 pages[] (site.json pages[] 와 동일)
//
// 사용법은 파일 하단 REPORT 와 --help 참고.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const DEFAULT_BASE = 'http://localhost:3000';
const DEFAULT_SITE_ID = 'tseng-law-main-site';
const DEFAULT_LOCALE = 'ko';
const DEFAULT_OUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '.align-backups');
const REQUEST_TIMEOUT_MS = 20_000;

// --- node 매칭/변환 순수 함수 (unit test 대상, export 됨) -------------------------

// spec rect patch 의 w/h alias 를 width/height 로 정규화.
export function normalizeRectPatch(rectPatch) {
  if (!rectPatch || typeof rectPatch !== 'object') return null;
  const out = {};
  for (const [key, value] of Object.entries(rectPatch)) {
    if (value === undefined || value === null) continue;
    const mapped = key === 'w' ? 'width' : key === 'h' ? 'height' : key;
    if (mapped === 'x' || mapped === 'y' || mapped === 'width' || mapped === 'height') {
      if (typeof value !== 'number' || !Number.isFinite(value)) continue;
      out[mapped] = value;
    }
  }
  return out;
}

// 매칭/표시용 텍스트 후보 추출(content 내 주요 텍스트 필드).
export function extractNodeText(node) {
  const c = node?.content;
  if (!c || typeof c !== 'object') return '';
  const parts = [c.text, c.label, c.title, c.alt, c.placeholder, c.heading];
  return parts.filter((p) => typeof p === 'string').join(' ');
}

// 단일 노드가 match 조건을 모두 만족하는지(AND). match 키: id(regex)/kind(exact)/text(substring)
//              /className(substring)/htmlId(substring).
export function matchNode(node, match) {
  if (!match || typeof match !== 'object') return false;
  if (match.id !== undefined) {
    if (typeof node.id !== 'string') return false;
    let re;
    try {
      re = new RegExp(match.id);
    } catch {
      re = null;
    }
    const ok = re ? re.test(node.id) : String(node.id) === String(match.id);
    if (!ok) return false;
  }
  if (match.kind !== undefined) {
    if (node.kind !== match.kind) return false;
  }
  if (match.text !== undefined) {
    const hay = extractNodeText(node);
    if (!hay.includes(String(match.text))) return false;
  }
  if (match.className !== undefined) {
    const cls = node?.content?.className;
    if (typeof cls !== 'string' || !cls.includes(String(match.className))) return false;
  }
  if (match.htmlId !== undefined) {
    const hid = node?.content?.htmlId ?? node?.content?.id;
    if (typeof hid !== 'string' || !hid.includes(String(match.htmlId))) return false;
  }
  return true;
}

// 정합에 안전하게 허용할 content 키 화이트리스트(kind 무관, Zod 통과 가능한 정렬용 필드).
const CONTENT_WHITELIST = new Set([
  'padding', 'maxWidth', 'layoutMode', 'background', 'backgroundColor',
  'borderColor', 'borderWidth', 'borderRadius', 'borderStyle', 'className',
  'fontSize', 'fontWeight', 'fontWeightNumeric', 'fontStyle', 'color', 'align',
  'lineHeight', 'letterSpacing', 'fontFamily', 'gap', 'columns', 'columnGap',
  'opacity', 'verticalAlign', 'textTransform', 'textDecoration', 'label', 'as',
]);

// target.patch 를 단일 노드에 적용. node 는 불변으로 두고 복제본을 반환.
// returns { node: newNode, changes: [{path, before, after}], skipped: [{key, reason}] }
export function applyTargetToNode(node, target) {
  const newNode = { ...node, rect: { ...node.rect }, style: { ...node.style } };
  if (node.content && typeof node.content === 'object') {
    newNode.content = { ...node.content };
  }
  const changes = [];
  const skipped = [];

  const rectPatch = normalizeRectPatch(target?.rect);
  if (rectPatch) {
    for (const [key, value] of Object.entries(rectPatch)) {
      const before = newNode.rect[key];
      if (before !== value) {
        changes.push({ path: `rect.${key}`, before, after: value });
      }
      newNode.rect[key] = value;
    }
  }

  if (target?.style && typeof target.style === 'object') {
    for (const [key, value] of Object.entries(target.style)) {
      if (!(key in newNode.style)) {
        skipped.push({ key: `style.${key}`, reason: 'unknown style key' });
        continue;
      }
      const before = newNode.style[key];
      if (before !== value) changes.push({ path: `style.${key}`, before, after: value });
      newNode.style[key] = value;
    }
  }

  if (target?.content && typeof target.content === 'object' && newNode.content) {
    for (const [key, value] of Object.entries(target.content)) {
      if (!(key in newNode.content) && !CONTENT_WHITELIST.has(key)) {
        skipped.push({ key: `content.${key}`, reason: 'unknown content key for kind' });
        continue;
      }
      const before = newNode.content[key];
      if (before !== value) changes.push({ path: `content.${key}`, before, after: value });
      newNode.content[key] = value;
    }
  }

  return { node: newNode, changes, skipped };
}

// match 로 노드 배열에서 대상을 찾는다.
export function findMatchingNodes(nodes, match) {
  if (!Array.isArray(nodes)) return [];
  return nodes.filter((node) => matchNode(node, match));
}

// spec.items 전체를 document 에 적용(불변). document 는 반드시 복제 후 반환.
// returns { document, results: [{ item, index, matchDesc, matchedIds, changes, skipped }] }
export function alignDocument(document, items) {
  const newDoc = structuredClone(document);
  const nodes = Array.isArray(newDoc.nodes) ? newDoc.nodes : [];
  const results = [];

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index] || {};
    const match = item.match || {};
    const target = item.target || {};
    const matchedIdx = [];
    for (let i = 0; i < nodes.length; i += 1) {
      if (matchNode(nodes[i], match)) matchedIdx.push(i);
    }
    const matchedIds = matchedIdx.map((i) => nodes[i].id);
    const allChanges = [];
    const allSkipped = [];
    for (const i of matchedIdx) {
      const { node: replaced, changes, skipped } = applyTargetToNode(nodes[i], target);
      nodes[i] = replaced;
      allChanges.push({ id: nodes[i].id, changes });
      if (skipped.length) allSkipped.push({ id: nodes[i].id, skipped });
    }
    results.push({
      index,
      matchDesc: describeMatch(match),
      matchedIds,
      changes: allChanges,
      skipped: allSkipped,
    });
  }

  newDoc.nodes = nodes;
  newDoc.updatedAt = new Date().toISOString();
  newDoc.updatedBy = 'align-page-to-live';
  return { document: newDoc, results };
}

function describeMatch(match) {
  const parts = [];
  if (match.id !== undefined) parts.push(`id=/${match.id}/`);
  if (match.kind !== undefined) parts.push(`kind=${match.kind}`);
  if (match.text !== undefined) parts.push(`text~"${match.text}"`);
  if (match.className !== undefined) parts.push(`class~"${match.className}"`);
  if (match.htmlId !== undefined) parts.push(`htmlId~"${match.htmlId}"`);
  return parts.join(' ') || '(no match)';
}

// --- CLI 인프라 ----------------------------------------------------------------

function parseArgs(argv) {
  const out = { flags: new Set(), values: {}, positional: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--') {
      out.positional.push(...argv.slice(i + 1));
      break;
    }
    if (arg.startsWith('--')) {
      const eq = arg.indexOf('=');
      if (eq > -1) {
        out.values[arg.slice(2, eq)] = arg.slice(eq + 1);
      } else {
        const next = argv[i + 1];
        if (next !== undefined && !next.startsWith('--')) {
          out.values[arg.slice(2)] = next;
          i += 1;
        } else {
          out.flags.add(arg.slice(2));
        }
      }
    } else {
      out.positional.push(arg);
    }
  }
  return out;
}

function authHeader() {
  const username =
    process.env.BUILDER_SMOKE_USERNAME || process.env.CMS_ADMIN_USERNAME || 'admin';
  const password =
    process.env.BUILDER_SMOKE_PASSWORD || process.env.CMS_ADMIN_PASSWORD || 'local-review-2026!';
  return `Basic ${Buffer.from(`${username}:${password}`, 'utf8').toString('base64')}`;
}

function originOf(baseUrl) {
  try {
    const u = new URL(baseUrl);
    return `${u.protocol}//${u.host}`;
  } catch {
    return baseUrl;
  }
}

async function fetchJson(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    const text = await res.text();
    let json = null;
    if (text) {
      try {
        json = JSON.parse(text);
      } catch {
        /* non-json body kept as text */
      }
    }
    return { status: res.status, ok: res.ok, json, text };
  } finally {
    clearTimeout(timer);
  }
}

async function apiGet(baseUrl, pathName) {
  return fetchJson(pathName.startsWith('http') ? pathName : `${baseUrl}${pathName}`, {
    method: 'GET',
    headers: { accept: 'application/json', authorization: authHeader() },
    redirect: 'manual',
  });
}

async function apiWrite(baseUrl, method, pathName, payload) {
  return fetchJson(pathName.startsWith('http') ? pathName : `${baseUrl}${pathName}`, {
    method,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: authHeader(),
      origin: originOf(baseUrl),
    },
    body: JSON.stringify(payload),
    redirect: 'manual',
  });
}

// slug -> pageId (또는 pageId 그대로). 사이트 pages 목록 API 경유.
async function resolvePageId(baseUrl, siteId, locale, page) {
  const res = await apiGet(baseUrl, `/api/builder/site/pages?locale=${encodeURIComponent(locale)}`);
  if (!res.ok || !Array.isArray(res.json?.pages)) {
    throw new Error(
      `페이지 목록 조회 실패 (${res.status}): ${res.text?.slice(0, 200) || 'no body'}`,
    );
  }
  const pages = res.json.pages;
  const byId = pages.find((p) => p.pageId === page);
  if (byId) return { pageId: page, meta: byId };
  // slug 매칭(빈 slug = 홈). 요청 locale 의 페이지 우선.
  const bySlug = pages
    .filter((p) => p.slug === page || p.slugByLocale?.[locale] === page)
    .sort((a, b) => (a.locale === locale ? -1 : 1) - (b.locale === locale ? -1 : 1));
  if (bySlug.length === 0) {
    throw new Error(
      `페이지를 찾을 수 없음: "${page}" (pageId 도, slug 도 아님). site=${siteId} locale=${locale}`,
    );
  }
  return { pageId: bySlug[0].pageId, meta: bySlug[0] };
}

function tsStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function backupDraft(outDir, pageId, payload) {
  mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `${pageId}.draft.${tsStamp()}.json`);
  writeFileSync(file, JSON.stringify(payload, null, 2));
  return file;
}

function fmtVal(v) {
  if (v === undefined) return '\u2205';
  if (typeof v === 'string') return v.length > 28 ? `${v.slice(0, 25)}...` : v;
  return JSON.stringify(v);
}

function printSummary(results, dryRun) {
  const title = dryRun ? 'DRY RUN (변경 미적용)' : 'APPLY (PUT 예정/완료)';
  console.log(`\n=== 정합 요약 [${title}] ===`);
  for (const r of results) {
    const head = `#${r.index} ${r.matchDesc}`;
    if (r.matchedIds.length === 0) {
      console.log(`${head}\n    \u26a0 매칭 없음 — 건드리지 않음`);
      continue;
    }
    console.log(`${head}  (${r.matchedIds.length}개 노드)`);
    for (const id of r.matchedIds) {
      const entry = r.changes.find((c) => c.id === id);
      const changes = entry?.changes ?? [];
      const skip = r.skipped.find((s) => s.id === id)?.skipped ?? [];
      if (changes.length === 0 && skip.length === 0) {
        console.log(`    - ${id}: 변경 없음`);
        continue;
      }
      for (const ch of changes) {
        console.log(`    - ${id}: ${ch.path}  ${fmtVal(ch.before)} -> ${fmtVal(ch.after)}`);
      }
      for (const s of skip) {
        console.log(`    - ${id}: \u26a0 건너뜀 ${s.key} (${s.reason})`);
      }
    }
  }
}

const HELP = `align-page-to-live.mjs — 빌더 draft 를 라이브 실측 spec 에 정합

사용:
  node scripts/align-page-to-live.mjs \\
    --page=<slug|pageId> \\
    --base=<builder server URL> \\
    --spec=<JSON 경로> \\
    [--locale=ko|en|zh-hant] [--site=<siteId>] \\
    [--apply] [--publish] [--out=<백업 dir>]

옵션:
  --page      필수. 페이지 slug(예: about, "" 또는 home = 홈) 또는 pageId.
  --base      빌더 서버 URL(기본 ${DEFAULT_BASE}).
  --spec      정합 spec JSON 경로. 형식은 하단 REPORT 참고.
  --locale    기본 ko.
  --site      siteId(기본 ${DEFAULT_SITE_ID}).
  --apply     실제 PUT 수행. 없으면 dry-run(기본).
  --publish   --apply 와 함께 사용. PUT 성공 후 단건 발행(expectedDraftRevision 검증).
  --out       PUT 전 draft 백업 디렉토리(기본 ${DEFAULT_OUT_DIR}).

인증(env):
  BUILDER_SMOKE_USERNAME / CMS_ADMIN_USERNAME  (기본 admin)
  BUILDER_SMOKE_PASSWORD / CMS_ADMIN_PASSWORD  (기본 local-review-2026!)
로컬 서버 경유 HTTP Basic 만 사용. blob 토큰 미사용.`;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.flags.has('help') || args.flags.has('h')) {
    console.log(HELP);
    return;
  }

  const page = args.values.page;
  const baseUrl = (args.values.base || DEFAULT_BASE).replace(/\/+$/, '');
  const specPath = args.values.spec;
  const locale = args.values.locale || DEFAULT_LOCALE;
  const siteId = args.values.site || DEFAULT_SITE_ID;
  const outDir = args.values.out || DEFAULT_OUT_DIR;
  const dryRun = !args.flags.has('apply');
  const doPublish = args.flags.has('publish');

  if (!page) {
    console.error('오류: --page 가 필요합니다. (--help 참고)');
    process.exit(2);
  }
  if (!specPath) {
    console.error('오류: --spec 가 필요합니다. (--help 참고)');
    process.exit(2);
  }
  if (doPublish && dryRun) {
    console.error('오류: --publish 는 --apply 와 함께 사용해야 합니다.');
    process.exit(2);
  }

  let spec;
  try {
    spec = JSON.parse(readFileSync(specPath, 'utf8'));
  } catch (error) {
    console.error(`오류: spec JSON 읽기 실패 (${specPath}): ${error.message}`);
    process.exit(2);
  }
  const items = Array.isArray(spec?.items) ? spec.items : [];
  if (items.length === 0) {
    console.error('오류: spec.items 가 비어 있거나 없습니다.');
    process.exit(2);
  }

  // 1) slug -> pageId
  const { pageId, meta } = await resolvePageId(baseUrl, siteId, locale, page);
  console.log(`대상: pageId=${pageId} slug=${meta?.slug ?? ''} locale=${locale} site=${siteId}`);

  // 2) draft GET
  const draftPath = `/api/builder/site/pages/${pageId}/draft?locale=${encodeURIComponent(locale)}`;
  const getRes = await apiGet(baseUrl, draftPath);
  if (!getRes.ok || !getRes.json?.ok) {
    console.error(
      `오류: draft GET 실패 (${getRes.status}): ${getRes.text?.slice(0, 240) || getRes.json?.message || 'no body'}`,
    );
    process.exit(1);
  }
  const { document, draft, recoveredFrom } = getRes.json;
  const expectedRevision = typeof draft?.revision === 'number' ? draft.revision : 0;
  console.log(
    `draft GET ok: recoveredFrom=${recoveredFrom} revision=${draft?.revision ?? '(없음, published 복구)'} nodes=${document?.nodes?.length ?? 0}`,
  );

  // 3) 정합 적용(불변)
  const { document: aligned, results } = alignDocument(document, items);
  printSummary(results, dryRun);

  const changedCount = results.reduce(
    (acc, r) => acc + r.changes.reduce((a, c) => a + (c.changes.length ? 1 : 0), 0),
    0,
  );
  if (changedCount === 0) {
    console.log('\n변경사항 없음 — PUT 생략.');
    return;
  }

  if (dryRun) {
    console.log('\ndry-run 완료. 실제 적용하려면 --apply 추가. (--publish 시 발행까지)');
    return;
  }

  // 4) 백업 후 PUT
  const backupFile = backupDraft(outDir, pageId, { revision: expectedRevision, draft, document });
  console.log(`\n백업: ${backupFile}`);

  const putBody = { siteId, expectedRevision, document: aligned };
  const putRes = await apiWrite(baseUrl, 'PUT', draftPath, putBody);
  if (!putRes.ok || !putRes.json?.ok) {
    console.error(
      `오류: draft PUT 실패 (${putRes.status}): ${putRes.text?.slice(0, 300) || putRes.json?.message || 'no body'}`,
    );
    if (putRes.json?.current) console.error(`현재 revision=${putRes.json.current.revision}`);
    console.error(`백업은 보존됨: ${backupFile}`);
    process.exit(1);
  }
  const newRevision = putRes.json.draft?.revision;
  console.log(`draft PUT ok: 새 revision=${newRevision}`);

  // 5) (옵션) 발행 — 단건 publish, expectedDraftRevision 로 낙관적 동시성
  if (doPublish) {
    const pubPath = `/api/builder/site/pages/${pageId}/publish?locale=${encodeURIComponent(locale)}`;
    const pubRes = await apiWrite(baseUrl, 'POST', pubPath, {
      siteId,
      expectedDraftRevision: newRevision,
    });
    if (!pubRes.ok || !pubRes.json?.ok) {
      console.error(
        `오류: publish 실패 (${pubRes.status}): ${pubRes.text?.slice(0, 300) || pubRes.json?.errorMessage || pubRes.json?.error || 'no body'}`,
      );
      process.exit(1);
    }
    console.log(
      `publish ok: publishedRevision=${pubRes.json.publishedRevision} id=${pubRes.json.publishedRevisionId}`,
    );
  }

  console.log('\n완료.');
}

// CLI 가 직접 실행될 때만 main() 동작(import 시에는 실행 않음 — unit test 호환).
const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  main().catch((error) => {
    console.error(`\n치명적 오류: ${error?.stack || error?.message || error}`);
    process.exit(1);
  });
}

// --- REPORT (한국어, 사용법 예시) ------------------------------------------------
/*
[정합 스크립트 — align-page-to-live.mjs]

목적: 빌더 draft 문서의 노드 rect/스타일을 라이브(tseng-law.com) 실측 지오메트리에 정합.
      빌더 렌더/편집은 그대로 유지하되 데이터만 보정. 재사용 가능 도구.

spec JSON 형식:
  {
    "items": [
      {
        "match": { "id": "^home-hero-root$", "kind": "container" },
        "target": {
          "rect":   { "x": 0, "y": 0, "w": 1280, "h": 820 },
          "style":  { "backgroundColor": "#0f172a" },
          "content":{ "padding": 32, "layoutMode": "absolute" }
        }
      },
      {
        "match": { "text": "상담 예약", "kind": "text" },
        "target": { "rect": { "w": 240, "h": 56 }, "content": { "fontSize": 18 } }
      }
    ]
  }

match 키(모두 AND 결합; 명시한 것만 사용):
  - id        : 노드 id 정규식(가장 권장, 가장 좁은 매칭)
  - kind      : 노드 kind 정확 일치(text/container/section/image/button ...)
  - text      : content.text/label/title/alt 부분문자열 일치
  - className : content.className 부분문자열 일치
  - htmlId    : content.htmlId 부분문자열 일치
  매칭된 노드가 0개면 해당 항목은 리포트에만 남기고 문서를 건드리지 않는다.

target 키:
  - rect    : { x, y, w|h, width|height } 제공한 키만 병합(w/h = width/height alias)
  - style   : backgroundColor / borderColor / borderWidth / borderRadius / shadow계열 / opacity 등
              (스키마에 없는 키는 건너뛰고 경고)
  - content : padding/maxWidth/layoutMode/fontSize/color/align/gap ... (종류별 content 필드.
              화이트리스트 또는 이미 존재하는 키만 적용, 그 외는 건너뛰고 경고)

사용 예시:
  # 1) dry-run(기본) — 변경 요약만 출력
  node scripts/align-page-to-live.mjs \
    --page=about --base=http://localhost:3000 --spec=align-about.json

  # 2) 실제 적용 + 백업 + 발행
  node scripts/align-page-to-live.mjs \
    --page=page-1782736343488-1 \
    --spec=align-about.json --apply --publish

  # 3) 홈 페이지(slug 빈 문자열 = home)
  node scripts/align-page-to-live.mjs --page=home --spec=align-home.json --apply

안전:
  - dry-run 기본. --apply 시에만 PUT.
  - PUT 전 원본 draft( document + revision )를 <out>/<pageId>.draft.<ISO>.json 으로 백업.
  - 로컬 서버 경유 HTTP Basic 만 사용 — blob 토큰/직접 파일 쓰기 없음.
  - PUT 은 expectedRevision 낙관적 동시성 검증(409/428 시 백업 보존 후 종료).
  - 발행(--publish)은 단건 publish API + expectedDraftRevision 검증.
*/
