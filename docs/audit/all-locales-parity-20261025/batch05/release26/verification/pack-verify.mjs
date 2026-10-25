import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import {createHash} from 'node:crypto';
const R='/Users/son7/Projects/tseng-law-all-locales-20261025';
const D='/Users/son7/tseng-all-language-columns-20261025/batch05/release26';
const out=path.resolve(process.argv[2]);
const dist=path.join(D,'pack');
const reportFile=path.join(D,'checks/browser-pack-report.json');
if(fs.existsSync(reportFile))throw new Error('Refusing to overwrite package evidence');
const sha=b=>createHash('sha256').update(b).digest('hex');
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(p,x.name)):[path.join(p,x.name)]).sort();
const skipped=new Set(['.static-site-out','_redirects','_headers','.DS_Store']);
let pages=0,pageBytes=0,pageGzipBytes=0,assets=0,assetBytes=0;
const sourcesVerified=[],failures=[];
for(const source of walk(out)){
 const rel=path.relative(out,source),base=path.basename(source);
 if(skipped.has(base)||base.startsWith('._'))continue;
 const isPage=rel.endsWith('.html');
 const packed=path.join(dist,'client',isPage?'__p':'',rel+(isPage?'.gz':''));
 const raw=fs.readFileSync(source),saved=fs.readFileSync(packed);
 const decoded=isPage?zlib.gunzipSync(saved):saved;
 if(!raw.equals(decoded))failures.push(rel);
 if(isPage){pages++;pageBytes+=raw.length;pageGzipBytes+=saved.length;}else{assets++;assetBytes+=saved.length;}
 sourcesVerified.push({source:rel,packed:path.relative(dist,packed),sha256:sha(raw)});
}
const packedFiles=walk(dist),expandedBytes=packedFiles.reduce((s,f)=>s+fs.statSync(f).size,0),limitBytes=256*1024*1024;
const headersEqual=fs.readFileSync(path.join(out,'_headers')).equals(fs.readFileSync(path.join(dist,'client/_headers')));
if(!headersEqual)failures.push('_headers');
if(expandedBytes>=limitBytes)failures.push('256 MiB expanded limit');
const report={at:new Date().toISOString(),node:process.version,zlib:process.versions.zlib,buildInfo:JSON.parse(fs.readFileSync(path.join(out,'build-info.json'),'utf8')),sourceArtifact:out,packedArtifact:dist,pages,pageBytes,pageGzipBytes,assets,assetBytes,expandedBytes,limitBytes,headroomBytes:limitBytes-expandedBytes,expandedMiB:expandedBytes/1048576,headroomMiB:(limitBytes-expandedBytes)/1048576,packedFileCount:packedFiles.length,gzipHtmlRoundTrips:pages,unchangedAssets:assets,verificationFailures:failures.length,failures,headersEqual,packerSha256:sha(fs.readFileSync(path.join(R,'scripts/static-site/sites-pack.mjs'))),workerTemplateSha256:sha(fs.readFileSync(path.join(R,'scripts/static-site/sites-worker.js'))),packedWorkerSha256:sha(fs.readFileSync(path.join(dist,'server/index.js'))),wranglerSha256:sha(fs.readFileSync(path.join(dist,'server/wrangler.json'))),sourcesVerified};
fs.writeFileSync(reportFile,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,sourcesVerified:undefined},null,2));
if(failures.length)process.exitCode=1;
