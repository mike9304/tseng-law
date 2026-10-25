#!/usr/bin/env python3
"""Audit file-backed columns without importing application side effects.

Defaults to the frozen initial commit. --worktree reads present files, including
untracked articles. --compare baseline.json adds slug/hash/visibility deltas.
Requires the repository's gray-matter and typescript packages and a working Node.
No source files are changed; output is stdout unless --output/--markdown is given.
"""
import argparse
import json
from pathlib import Path
import shutil
import subprocess
import sys

BASELINE = "ef3b24e73d84968eea08ea9d58e991ccbbf83fa8"
NODE = "/Users/son7/.nvm/versions/node/v24.14.1/bin/node"

JS = r"""
const fs = require('fs'), path = require('path'), cp = require('child_process');
const crypto = require('crypto'), vm = require('vm');
const {createRequire} = require('module');
const args = JSON.parse(process.argv[1]);
const repoRequire = createRequire(path.join(args.repo, 'package.json'));
const matter = repoRequire('gray-matter'), ts = repoRequire('typescript');
const git = (a, o = {}) => cp.execFileSync('git', a, {cwd:args.repo, maxBuffer:256*1024*1024, ...o});
const commit = git(['rev-parse', args.worktree ? 'HEAD' : args.ref]).toString().trim();
const snapshot = new Map();
const hash = s => crypto.createHash('sha256').update(s).digest('hex');
function read(p) {
  if (!snapshot.has(p)) snapshot.set(p, args.worktree ? fs.readFileSync(path.join(args.repo,p),'utf8') : git(['show',`${commit}:${p}`]).toString());
  return snapshot.get(p);
}
const publicText = read('src/lib/public-guidance.ts');
const locales = [...publicText.match(/export const PUBLIC_LOCALES_8 = \[([\s\S]*?)\] as const/)[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
const dirText = read('src/lib/column-locales.ts');
const directories = Object.fromEntries([...dirText.matchAll(/^\s+(?:'([^']+)'|([\w-]+)): '(src\/content\/columns[^']*)',/gm)].map(m=>[m[1]||m[2],m[3]]));
if(locales.some(l=>!directories[l])) throw new Error('Locale directory registry is incomplete');
const issueText = read('src/lib/columns.ts');
const issueLocales = [...issueText.match(/export const ISSUE_BOARD_LOCALES = \[([^\]]+)\]/)[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
let files;
if (args.worktree) {
  files = [];
  for (const dir of [...Object.values(directories), ...issueLocales.map(l=>`src/content/issues/${l}`)]) {
    const full = path.join(args.repo,dir);
    if (fs.existsSync(full)) files.push(...fs.readdirSync(full).filter(f=>f.endsWith('.md')).map(f=>`${dir}/${f}`));
  }
  files.sort();
} else {
  const allowed = new Set([...Object.values(directories), ...issueLocales.map(l=>`src/content/issues/${l}`)]);
  files = git(['ls-tree','-r','--name-only',commit,'src/content']).toString().trim().split('\n').filter(p=>p.endsWith('.md') && allowed.has(path.posix.dirname(p))).sort();
  const batch = git(['cat-file','--batch'], {input:files.map(p=>`${commit}:${p}\n`).join('')});
  let offset=0;
  for(const file of files) {
    const end=batch.indexOf(10,offset), header=batch.subarray(offset,end).toString();
    if(!/^[0-9a-f]+ blob \d+$/.test(header)) throw new Error(`Invalid Git blob: ${file}`);
    const size=Number(header.split(' ')[2]);
    snapshot.set(file,batch.subarray(end+1,end+1+size).toString()); offset=end+2+size;
  }
}
// Evaluate only the pure audience and board-policy modules from the same source.
const moduleCache = new Map();
function pureModule(file) {
  if(!['src/lib/column-audience.ts','src/data/market-column-curation.ts'].includes(file)) throw new Error(`Unexpected policy dependency: ${file}`);
  if(moduleCache.has(file)) return moduleCache.get(file).exports;
  const mod={exports:{}}; moduleCache.set(file,mod);
  const js=ts.transpileModule(read(file),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  vm.runInNewContext(`(function(require,module,exports){${js}\n})`,{}, {filename:file})(s=>pureModule(s.replace(/^@\//,'src/')+'.ts'),mod,mod.exports);
  return mod.exports;
}
const {normalizeColumnAudience}=pureModule('src/lib/column-audience.ts');
const {filterMarketBoardColumns,isMarketBoardLocale}=pureModule('src/data/market-column-curation.ts');
const directoryLocales=Object.fromEntries(Object.entries(directories).map(([l,d])=>[d,l]));
const errors=[], records=[];
for(const file of files) {
  try {
    const raw=read(file), {data,content}=matter(raw), dir=path.posix.dirname(file);
    const issue=dir.startsWith('src/content/issues/'), locale=issue?dir.split('/').at(-1):directoryLocales[dir];
    const filename=path.posix.basename(file);
    const slug=filename.replace(/\.md$/,'').replace(issue?/^ISSUE-\d{8}-\d{2}-/:/^\d{3}-/,'');
    records.push({locale,board:issue?'issues':'columns',slug,file,title:typeof data.title==='string'?data.title:'',sha256:hash(raw),bodyCharacters:content.trim().length,audience:normalizeColumnAudience(data.audience),explicitDraft:data.draft===true||data.status==='draft',publishedValue:data.published??null});
  } catch(e) { errors.push({file,error:e.message}); }
}
const columns=records.filter(r=>r.board==='columns'), issues=records.filter(r=>r.board==='issues');
const byLocale=Object.fromEntries(locales.map(l=>[l,columns.filter(r=>r.locale===l)]));
const slugs=Object.fromEntries(locales.map(l=>[l,new Set(byLocale[l].map(r=>r.slug))]));
const core=['ko','zh-hant','en','ja'];
const coreUnion=[...new Set(core.flatMap(l=>[...slugs[l]]))].sort();
const common4=[...slugs.ko].filter(s=>core.every(l=>slugs[l].has(s))).sort();
const corpus=[...new Set(columns.map(r=>r.slug))].sort();
const common49=corpus.filter(s=>locales.every(l=>slugs[l].has(s)));
const benchmark=286;
const rows=locales.map(locale=>{
  const local=byLocale[locale], visible=filterMarketBoardColumns(locale,local);
  const fallbackEligible=!core.includes(locale)&&locale!=='vi'&&!isMarketBoardLocale(locale);
  const notLocalKo=[...slugs.ko].filter(s=>!slugs[locale].has(s)).sort();
  return {locale,directory:directories[locale],localColumnCount:local.length,boardVisibleLocalCount:visible.length,boardHiddenLocalSlugs:local.filter(r=>!visible.includes(r)).map(r=>r.slug).sort(),issueCount:issues.filter(r=>r.locale===locale).length,explicitDraftCount:local.filter(r=>r.explicitDraft).length,sourceLanguageLinkCount: fallbackEligible?notLocalKo.length:0,sourceLanguageLinksCountAsLocal:false,missingToCountBenchmark:Math.max(0,benchmark-local.length),missingToVisibleBenchmark:Math.max(0,benchmark-visible.length),missingVsCommon4:common4.filter(s=>!slugs[locale].has(s)),missingVsEnglish:[...slugs.en].filter(s=>!slugs[locale].has(s)).sort(),missingVsCoreUnion:coreUnion.filter(s=>!slugs[locale].has(s)),slugs:[...slugs[locale]].sort()};
});
const duplicates=records.filter((r,i,a)=>a.findIndex(x=>x.locale===r.locale&&x.board===r.board&&x.slug===r.slug)!==i).map(r=>r.file);
const empty=records.filter(r=>!r.bodyCharacters).map(r=>r.file);
const invalidTitles=records.filter(r=>!r.title).map(r=>r.file);
const output={schemaVersion:1,source:{kind:args.worktree?'working-tree':'git-commit',commit},countBenchmark:{perLocale:benchmark,referenceLocale:'zh-hant',referenceCommit:args.baseline,meaning:'Initial largest primary-language professional collection; substantive local articles and board visibility required; common-four coverage is only a milestone.'},counting:{professional:'Direct .md children of the registered column directory; slug is filename minus exactly three digits and hyphen.',issues:'Separate ISSUE_BOARD_LOCALES directory corpus; not added to professional parity.',draft:'The production Markdown loader does not filter status/draft; explicit flags are reported, not treated as proof of withholding.',board:'Executed normalizeColumnAudience and filterMarketBoardColumns from the same source snapshot. These are file-backed policy counts, not an assertion about deployed HTML or CMS overlays.',fallback:'Source-language links, English fallback pages and external sources are not local columns. Source-link count follows the guidance index condition.',completion:'No automated inventory certifies language quality, unique legal subjects, legal review, deployment or live navigation.'},supportedLocales:locales,issueLocales,totals:{professional:columns.length,issues:issues.length,boardVisibleLocal:rows.reduce((n,r)=>n+r.boardVisibleLocalCount,0),distinctProfessionalSlugs:corpus.length,coreUnion:coreUnion.length,coreCommon:common4.length,allLocaleCommon:common49.length,countDeficitTo286:rows.reduce((n,r)=>n+r.missingToCountBenchmark,0),visibleDeficitTo286:rows.reduce((n,r)=>n+r.missingToVisibleBenchmark,0),other45MissingCoreCommon:rows.filter(r=>!core.includes(r.locale)).reduce((n,r)=>n+r.missingVsCommon4.length,0)},locales:rows,common4,common49,translationMatrix:corpus.map(slug=>({slug,availableLocales:locales.filter(l=>slugs[l].has(slug)),missingLocales:locales.filter(l=>!slugs[l].has(slug)),sourceFiles:Object.fromEntries(columns.filter(r=>r.slug===slug).map(r=>[r.locale,r.file]))})),articles:records,validation:{valid:errors.length===0&&duplicates.length===0&&empty.length===0&&invalidTitles.length===0,parseErrors:errors,duplicateSlugs:duplicates,emptyBodies:empty,missingTitles:invalidTitles},implementationHashes:Object.fromEntries([...snapshot.keys()].filter(p=>p.endsWith('.ts')).sort().map(p=>[p,hash(snapshot.get(p))]))};
process.stdout.write(JSON.stringify(output,null,2)+'\n');
"""


def comparison(previous, current):
    old = {(r['locale'], r['board'], r['slug']): r for r in previous['articles']}
    new = {(r['locale'], r['board'], r['slug']): r for r in current['articles']}
    old_rows = {r['locale']: r for r in previous['locales']}
    return {
        'against': previous['source'],
        'added': [new[k]['file'] for k in sorted(new.keys() - old.keys())],
        'removed': [old[k]['file'] for k in sorted(old.keys() - new.keys())],
        'changed': [new[k]['file'] for k in sorted(new.keys() & old.keys()) if new[k]['sha256'] != old[k]['sha256']],
        'localeDeltas': [{
            'locale': r['locale'],
            'localColumnCount': r['localColumnCount'] - old_rows.get(r['locale'], {}).get('localColumnCount', 0),
            'boardVisibleLocalCount': r['boardVisibleLocalCount'] - old_rows.get(r['locale'], {}).get('boardVisibleLocalCount', 0),
            'issueCount': r['issueCount'] - old_rows.get(r['locale'], {}).get('issueCount', 0),
        } for r in current['locales']],
    }


def markdown(report):
    t = report['totals']
    lines = [
        '# All-language column inventory — 2026-10-25', '',
        f"Source commit: `{report['source']['commit']}`; mode: `{report['source']['kind']}`.", '',
        'The completion benchmark is at least 286 substantive professional columns in each of the 49 supported languages, matching the largest initial primary-language collection (zh-hant). The 135 subjects shared by the four primary languages are a first milestone, not the completion target.', '',
        f"This snapshot contains {t['professional']:,} professional articles and {t['issues']} separate issue articles. It lacks {t['countDeficitTo286']:,} local articles to reach the count benchmark and {t['visibleDeficitTo286']:,} board-visible local articles to reach the same visible benchmark. These numbers are scope measures, not permission to publish duplicate or unsuitable articles.", '',
        f"There are {t['distinctProfessionalSlugs']} distinct professional slugs, {t['coreUnion']} in the primary-language union, {t['coreCommon']} common to ko/zh-hant/en/ja, and {t['allLocaleCommon']} common to all languages. Other languages lack {t['other45MissingCoreCommon']:,} translations of the primary common set.", '',
        '| Locale | Local professional | Board-visible local | Hidden from board | Issues | Gap to 286 | Visible gap |',
        '|---|---:|---:|---:|---:|---:|---:|',
    ]
    for r in report['locales']:
        lines.append(f"| {r['locale']} | {r['localColumnCount']} | {r['boardVisibleLocalCount']} | {len(r['boardHiddenLocalSlugs'])} | {r['issueCount']} | {r['missingToCountBenchmark']} | {r['missingToVisibleBenchmark']} |")
    lines += ['', '## Counting and limits', '']
    lines.extend(f'- {value}' for value in report['counting'].values())
    lines += [
        f"- Records explicitly marked draft by `draft: true` or `status: draft`: {sum(r['explicitDraft'] for r in report['articles'])}. `published` means a publication date, not a publication switch. The old `src/content/semiconductor-drafts` package (three Korean articles and one service draft) is outside these loaders and totals.",
        f"- The local-language board policy is evaluated from the same snapshot as the content. Hidden shared articles retain direct URLs and sitemap entries. The guidance policy reports {sum(r['sourceLanguageLinkCount'] for r in report['locales'])} untranslated Korean-source link entries; these are excluded from local totals. Vietnamese has its own board, and market-curated guidance boards suppress that source listing.",
        '- Core ko/zh-hant/en can receive builder/CMS overlays at runtime. This file inventory does not count or inspect those overlays; actual static delivery must be checked separately.',
        '- A shared slug identifies a translation cluster. A numeric prefix alone does not: match the full slug and legal subject. No inventory can certify that different slugs are substantively distinct.',
        '', '## Source and registration paths', '',
        '- `src/lib/public-guidance.ts`: the 49-member `PUBLIC_LOCALES_8` registry (historical name).',
        '- `src/lib/column-locales.ts`: locale-to-directory mapping.',
        '- `src/lib/columns.ts`: direct Markdown loading; exactly three numeric prefix digits removed for professional slugs.',
        '- `src/lib/column-audience.ts`, `src/data/market-column-curation.ts`: recommendations and actual file-backed board visibility.',
        '- `src/lib/column-language-links.ts`: same-slug language switch and alternate cluster.',
        '- `src/app/[locale]/columns/page.tsx`, `[slug]/page.tsx`, `src/app/sitemap.ts`: index, article and sitemap consumers.',
        f"- The JSON report stores every article path/hash, all {t['distinctProfessionalSlugs']} translation clusters with available/missing locales, and per-locale common-four/English/core-union missing slug lists.",
        '', '## Reproduction and present-state comparison', '', '```bash',
        'python3 docs/audit/all-locales-parity-20261025/inventory.py > /tmp/tseng-column-baseline-reproduced.json',
        'cmp docs/audit/all-locales-parity-20261025/baseline.json /tmp/tseng-column-baseline-reproduced.json',
        'python3 docs/audit/all-locales-parity-20261025/inventory.py --worktree --compare docs/audit/all-locales-parity-20261025/baseline.json > /tmp/tseng-column-current.json',
        '```', '',
        '`--ref SHA` audits another immutable commit. `--worktree` includes untracked current articles and reads the current policy modules; partial writes or malformed frontmatter are reported. `--output FILE` and `--markdown FILE` are explicit report outputs. The script does not modify repository content, fetch, stage, commit or deploy. It requires the repository gray-matter and TypeScript packages and defaults to the verified NVM Node runtime.', '',
        f"Validation: {len(report['validation']['parseErrors'])} YAML parse errors; {len(report['validation']['duplicateSlugs'])} duplicate slugs within a locale and board; {len(report['validation']['emptyBodies'])} empty bodies; {len(report['validation']['missingTitles'])} missing titles. Editorial, legal and deployed-page review remain separate.", '',
    ]
    return '\n'.join(lines)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', type=Path, default=Path(__file__).resolve().parents[3])
    source = parser.add_mutually_exclusive_group()
    source.add_argument('--ref', default=BASELINE)
    source.add_argument('--worktree', action='store_true')
    parser.add_argument('--node', default=NODE if Path(NODE).exists() else shutil.which('node'))
    parser.add_argument('--compare', type=Path)
    parser.add_argument('--output', type=Path)
    parser.add_argument('--markdown', type=Path)
    args = parser.parse_args()
    if not args.node:
        parser.error('A working Node runtime is required; pass --node PATH')
    options = dict(repo=str(args.repo.resolve()), ref=args.ref, worktree=args.worktree, baseline=BASELINE)
    try:
        raw = subprocess.check_output([args.node, '-e', JS, json.dumps(options)], cwd=args.repo, text=True)
        report = json.loads(raw)
    except (subprocess.CalledProcessError, json.JSONDecodeError) as exc:
        print(f'Inventory failed: {exc}', file=sys.stderr)
        return 2
    if args.compare:
        report['comparison'] = comparison(json.loads(args.compare.read_text()), report)
    serialized = json.dumps(report, ensure_ascii=False, indent=2) + '\n'
    if args.output:
        args.output.write_text(serialized)
    else:
        sys.stdout.write(serialized)
    if args.markdown:
        args.markdown.write_text(markdown(report))
    return 0 if report['validation']['valid'] else 1


if __name__ == '__main__':
    raise SystemExit(main())
