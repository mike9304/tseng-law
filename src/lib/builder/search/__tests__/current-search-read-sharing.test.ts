import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import type { SearchIndex, SearchDoc } from '../types';
const state = vi.hoisted(() => ({site:0, siteIO:0, canvas:0, activeCanvas:0, maxCanvas:0, index:0, stored:null as SearchIndex|null, hold:null as null|{entered:()=>void; release:Promise<void>}}));
vi.mock('../index-storage',()=>({loadSearchIndex:async()=>{state.index++;return state.stored;},saveSearchIndex:async()=>undefined}));
vi.mock('@vercel/blob',()=>({get:()=>{throw Error('provider prohibited');},put:()=>{throw Error('provider prohibited');},list:()=>{throw Error('provider prohibited');}}));
vi.mock('@/lib/builder/blog/column-adapter',()=>({listBlogPosts:async()=>[]}));
vi.mock('@/lib/builder/faq/faq-engine',()=>({listFaqSearchDocs:async()=>[]}));
vi.mock('@/lib/builder/portfolio/portfolio-engine',()=>({listPortfolioSearchDocs:async()=>[]}));
vi.mock('@/lib/columns',()=>({getAllColumnPosts:()=>[]}));
vi.mock('@/lib/builder/storage/local-json-write-lease.mjs',async imp=>{
 const actual=await imp<typeof import('@/lib/builder/storage/local-json-write-lease.mjs')>();
 return {...actual,readLocalJsonFile:async(...args:Parameters<typeof actual.readLocalJsonFile>)=>{if(typeof args[0]==='string' && args[0].endsWith('/site.json'))state.siteIO++;return actual.readLocalJsonFile(...args);}};
});
vi.mock('@/lib/builder/site/persistence',async imp=>{
 const actual=await imp<typeof import('@/lib/builder/site/persistence')>();
 return {...actual,readExistingSiteDocument:async(...args:Parameters<typeof actual.readExistingSiteDocument>)=>{
  state.site++;const hold=state.hold;state.hold=null;const site=await actual.readExistingSiteDocument(...args);if(hold){hold.entered();await hold.release;}return site;
 }};
});
vi.mock('@/lib/builder/site/published-canvas',async imp=>{
 const actual=await imp<typeof import('@/lib/builder/site/published-canvas')>();
 return {...actual,readPublishedPageCanvas:async(...args:Parameters<typeof actual.readPublishedPageCanvas>)=>{state.canvas++;state.activeCanvas++;state.maxCanvas=Math.max(state.maxCanvas,state.activeCanvas);try{return await actual.readPublishedPageCanvas(...args);}finally{state.activeCanvas--;}}};
});
import {searchCurrentPublication} from '../current-search';
import {readCurrentBuilderSearchDoc} from '../source-collector';
import {buildSearchIndex} from '../index-builder';
import {getPublicIntentSearchDocs} from '../public-intent-docs';
import {createDefaultSiteDocument} from '@/lib/builder/site/types';
import {createDefaultCanvasDocument} from '@/lib/builder/canvas/types';
import {DEFAULT_BUILDER_SITE_ID as siteId} from '@/lib/builder/constants';
let root:string;let siteFile:string;
function resetCounts(){state.site=state.siteIO=state.canvas=state.activeCanvas=state.maxCanvas=state.index=0;}
function canvas(text='needle current'){const value=createDefaultCanvasDocument('ko');value.nodes=value.nodes.filter(n=>n.kind==='text').slice(0,1);for(const n of value.nodes)if(n.kind==='text')n.content.text=text;return value;}
async function json(file:string,value:unknown){await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,JSON.stringify(value));}
function doc(i:number):SearchDoc{return {id:`page:ko:audit-${i}`,kind:'page',locale:'ko',title:'needle stale',url:`/ko/audit-${i}`,body:'needle old'};}
async function seed(n:number){const site=createDefaultSiteDocument('ko',siteId);site.pages=Array.from({length:n},(_,i)=>({...site.pages[0],pageId:'audit-'+i,slug:'audit-'+i,isHomePage:false,title:{ko:'needle current '+i,en:'', 'zh-hant':''},publishedAt:new Date().toISOString(),noIndex:false,password:undefined,memberAccess:undefined}));await json(siteFile,site);for(const page of site.pages)await json(path.join(root,'site',siteId,'pages',page.pageId+'.published.json'),canvas());state.stored=buildSearchIndex(site.pages.map((_,i)=>doc(i)));return site;}
const search=()=>searchCurrentPublication({query:'needle',locale:'ko',limit:50,kinds:['page']});
beforeEach(async()=>{root=await fs.mkdtemp(path.join(os.tmpdir(),'search-request-read-'));siteFile=path.join(root,'site',siteId,'site.json');vi.stubEnv('BUILDER_SITE_ROOT',path.join(root,'site'));vi.stubEnv('BUILDER_SITE_BACKEND','local');vi.stubEnv('BLOB_READ_WRITE_TOKEN','');vi.stubEnv('BUILDER_REVISIONS_ROOT',path.join(root,'revisions'));vi.stubGlobal('fetch',()=>{throw Error('unexpected network');});state.hold=null;state.stored=null;resetCounts();});
afterEach(async()=>{vi.unstubAllEnvs();vi.unstubAllGlobals();await fs.rm(root,{recursive:true,force:true});});
it.each([1,10,50])('shares one actual site read for %i targets without reducing canvas reads',async n=>{await seed(n);resetCounts();expect((await search()).hits).toHaveLength(n);expect(state.site).toBe(1);expect(state.siteIO).toBe(1);expect(state.canvas).toBe(n);expect(state.maxCanvas).toBeLessThanOrEqual(4);});
it('empty query has zero index/site/canvas reads',async()=>{await seed(1);resetCounts();expect((await searchCurrentPublication({query:' ',locale:'ko',limit:50})).hits).toEqual([]);expect(state.index+state.site+state.canvas+state.siteIO).toBe(0);});
it('validates every selected identity before the first target IO',async()=>{await seed(10);state.stored=buildSearchIndex([...Array.from({length:10},(_,i)=>doc(i)),{...doc(10),id:'page:ko:../invalid'}]);resetCounts();await expect(search()).rejects.toThrow();expect(state.site+state.siteIO+state.canvas).toBe(0);});
it('fresh next query sees policy/deletion and current canvas changes',async()=>{const site=await seed(5);expect((await search()).hits).toHaveLength(5);site.pages[0].memberAccess={requireLogin:true,allowedRoles:['premium']};site.pages[1].password='synthetic';site.pages[2].noIndex=true;site.pages=site.pages.filter(p=>p.pageId!=='audit-3');await json(siteFile,site);await json(path.join(root,'site',siteId,'pages/audit-4.published.json'),canvas('needle REVISION_B'));resetCounts();const r=await search();expect(r.hits.map(h=>h.doc.id)).toEqual(['page:ko:audit-4']);expect(r.hits[0].doc.body).toContain('REVISION_B');expect(state.site).toBe(1);expect(state.canvas).toBe(1);});
it('missing and rejected site reads never leak across queries or retry inside one query',async()=>{const site=await seed(10);await fs.rm(siteFile);resetCounts();expect((await search()).hits).toEqual([]);expect(state.site).toBe(1);expect(state.canvas).toBe(0);await fs.writeFile(siteFile,'{bad');resetCounts();await expect(search()).rejects.toThrow();expect(state.site).toBe(1);expect(state.canvas).toBe(0);await json(siteFile,site);resetCounts();expect((await search()).hits).toHaveLength(10);expect(state.site).toBe(1);});
it('standalone reader remains fresh between direct calls',async()=>{const site=await seed(1);resetCounts();expect(await readCurrentBuilderSearchDoc(doc(0))).not.toBeNull();site.pages[0].noIndex=true;await json(siteFile,site);expect(await readCurrentBuilderSearchDoc(doc(0))).toBeNull();expect(state.site).toBe(2);});
it('concurrent queries have independent snapshots',async()=>{const site=await seed(1);let release!:()=>void;let entered!:()=>void;const arrived=new Promise<void>(r=>{entered=r;});state.hold={entered,release:new Promise<void>(r=>{release=r;})};const first=search();await arrived;site.pages[0].noIndex=true;await json(siteFile,site);try{expect((await search()).hits).toEqual([]);}finally{release();}expect((await first).hits).toHaveLength(1);expect(state.site).toBe(2);});
it('keeps designated published revision recovery and rejects canvas IO failure',async()=>{const site=await seed(1);site.pages[0].publishedRevisionId='revision-b';await json(siteFile,site);const file=path.join(root,'site',siteId,'pages/audit-0.published.json');await fs.rm(file);await json(path.join(root,'revisions',siteId,'audit-0','revision-b.json'),{...canvas('needle DESIGNATED_B'),_siteId:siteId,_pageId:'audit-0',_revisionId:'revision-b'});expect((await search()).hits[0].doc.body).toContain('DESIGNATED_B');await fs.mkdir(file);await expect(search()).rejects.toThrow();});

it.each([['en', 'company'], ['ja', '会社']] as const)('preserves current file-backed %s intent and corporate-anchor results without builder IO', async (locale, query) => {
  state.stored = buildSearchIndex([]);
  const result = await searchCurrentPublication({ query, locale, limit: 50 });
  expect(result.hits.map(hit => hit.doc.url)).toEqual(expect.arrayContaining([
    `/${locale}/taiwan-company-setup-lawyer`, `/${locale}/taiwan-lawyer#corporate-advisory`,
  ]));
  expect(state.site + state.canvas + state.siteIO).toBe(0);
});

it('replaces an exact static identity with current code-backed content and recomputes matching/highlights', async () => {
  const current = getPublicIntentSearchDocs('en').find(value => value.url === '/en/taiwan-company-setup-lawyer')!;
  state.stored = buildSearchIndex([{ ...current, title: 'needle FORGED_STATIC', body: 'needle FORGED_STATIC', summary: 'FORGED_STATIC' }]);
  expect((await searchCurrentPublication({ query: 'needle', locale: 'en', limit: 50 })).hits).toEqual([]);
  const result = await searchCurrentPublication({ query: 'company', locale: 'en', limit: 50 });
  expect(result.hits.find(hit => hit.doc.url === current.url)?.doc).toEqual(current);
  expect(JSON.stringify(result)).not.toContain('FORGED_STATIC');
  expect(state.site + state.canvas).toBe(0);
});

it('static source declarations or shared URLs cannot bypass current builder native/private/unpublished controls', async () => {
  const site = await seed(4);
  for (const page of site.pages) page.locale = 'en';
  site.pages[0].slug = 'taiwan-lawyer';
  delete site.pages[1].publishedAt;
  site.pages[2].memberAccess = { requireLogin: true };
  await json(siteFile, site);
  await json(path.join(root, 'site', siteId, 'pages/audit-3.published.json'), { ...canvas(), locale: 'en' });
  state.stored = buildSearchIndex(site.pages.map((page, i): SearchDoc & { sourceType: string } => ({
    ...doc(i), id: `page:en:${page.pageId}`, locale: 'en', url: `/en/${page.slug}`, sourceType: 'file',
  })));
  resetCounts();
  const result = await searchCurrentPublication({ query: 'needle', locale: 'en', limit: 50 });
  expect(result.hits.map(hit => hit.doc.id)).toEqual(['page:en:audit-3']);
  expect(state.site).toBe(1);
  expect(state.canvas).toBe(1);
});
