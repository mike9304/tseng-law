import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, rm, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { renderToStaticMarkup } from 'react-dom/server';
import { NextRequest } from 'next/server';
import SearchPage from '../page';
import { GET } from '@/app/api/search/route';
import { PATCH, DELETE } from '@/app/api/builder/site/pages/[pageId]/route';
import { PATCH as seoPATCH } from '@/app/api/builder/site/pages/[pageId]/seo/route';
import * as persistence from '@/lib/builder/site/persistence';
import { createDefaultSiteDocument } from '@/lib/builder/site/types';
import { createDefaultCanvasNodeStyle, type BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import * as collector from '@/lib/builder/search/source-collector';
import { recordRevision } from '@/lib/builder/site/publish';
import { resolvePublishedSitePage } from '@/lib/builder/site/public-page';
import { findPageMetaForLocaleWithDynamicContext } from '@/lib/builder/site/page-resolution';
import { createBuilderDynamicItemPageMeta } from '@/lib/builder/dynamic-item-pages';
import { collectAllSearchDocs } from '@/lib/builder/search/source-collector';
import { buildSearchIndex } from '@/lib/builder/search/index-builder';
import { loadSearchIndex, saveSearchIndex } from '@/lib/builder/search/index-storage';
vi.mock('@/lib/builder/search/index-storage', () => ({loadSearchIndex:vi.fn(),saveSearchIndex:vi.fn(async()=>undefined),appendQueryLog:vi.fn(async()=>undefined)}));
vi.mock('@/lib/builder/security/guard',()=>({guardMutation:vi.fn(async()=>({username:'alice'}))}));
vi.mock('@/lib/builder/security/rate-limit',()=>({checkRateLimit:vi.fn(async()=>({allowed:true}))}));
vi.mock('next/cache',()=>({revalidatePath:vi.fn()}));
// Deployed writer background rebuild is outside this query-read contract.
vi.mock('@/lib/builder/search/index-runtime', async original => ({...await original<object>(), rebuildSearchIndexBestEffort:vi.fn(async()=>undefined)}));
vi.mock('@/lib/builder/blog/column-adapter',()=>({listBlogPosts:vi.fn(async()=>[])}));
vi.mock('@/lib/builder/faq/faq-engine',()=>({listFaqSearchDocs:vi.fn(async()=>[])}));
vi.mock('@/lib/builder/portfolio/portfolio-engine',()=>({listPortfolioSearchDocs:vi.fn(async()=>[])}));
vi.mock('@/lib/columns',()=>({getAllColumnPosts:vi.fn(()=>[])}));
const siteId=DEFAULT_BUILDER_SITE_ID;
const at='2026-09-14T00:00:00.000Z';
const canvas:BuilderCanvasDocument={version:1,locale:'ko',updatedAt:at,updatedBy:'synthetic',stageWidth:1280,stageHeight:720,nodes:[{id:'search-image',kind:'image',rect:{x:0,y:0,width:100,height:100},style:createDefaultCanvasNodeStyle(),zIndex:0,rotation:0,locked:false,visible:true,content:{src:'/test.png',alt:'currentsearchtoken public body',fit:'contain'}}]};
const render=(q='currentsearchtoken')=>SearchPage({params:Promise.resolve({locale:'ko'}),searchParams:Promise.resolve({q})}).then(renderToStaticMarkup);
const api=()=>GET(new NextRequest('https://example.test/api/search?q=currentsearchtoken&locale=ko'));
describe('actual legacy publication mutations bind SSR and API search',()=>{
 let root:string;
 beforeEach(async()=>{
  vi.clearAllMocks();root=await mkdtemp(path.join(os.tmpdir(),'search-binding-'));
  vi.stubEnv('BUILDER_SITE_ROOT',path.join(root,'site'));vi.stubEnv('BUILDER_SITE_BACKEND','local');vi.stubEnv('BUILDER_SCHEDULED_OPERATION_MODE','legacy');vi.stubEnv('BLOB_READ_WRITE_TOKEN','');vi.stubEnv('CONSULTATION_LOG_BACKEND','local');vi.stubEnv('BUILDER_RUNTIME_DATA_ROOT',path.join(root,'runtime'));vi.stubEnv('BUILDER_REVISIONS_ROOT',path.join(root,'revisions'));
  const site=createDefaultSiteDocument('ko',siteId);site.pages=[{...site.pages[0],pageId:'landing'}, {...site.pages[0],pageId:'search-page',locale:'ko',isHomePage:false,slug:'search-visible',title:{ko:'currentsearchtoken title',en:'Title','zh-hant':'Title'},publishedAt:at}];
  await persistence.writeSiteDocument(site);await persistence.writePageCanvas(siteId,'search-page','published',canvas);
  vi.mocked(loadSearchIndex).mockResolvedValue(buildSearchIndex(await collectAllSearchDocs()));
 });
 afterEach(async()=>{vi.restoreAllMocks();vi.unstubAllEnvs();await rm(root,{recursive:true,force:true});});
 it.each(['member','noIndex','delete'])('fresh and expired SSR/API suppress actual %s mutation',async control=>{
  expect(await render()).toContain('href="/ko/search-visible"');expect(await (await api()).json()).toMatchObject({total:1});
  const params={params:Promise.resolve({pageId:'search-page'})};const url=`https://example.test/api/builder/site/pages/search-page?siteId=${siteId}`;
  const response=control==='delete'?await DELETE(new NextRequest(url,{method:'DELETE'}),params):control==='member'?await PATCH(new NextRequest(url,{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({memberAccess:{requireLogin:true,allowedRoles:['premium']}})}),params):await seoPATCH(new NextRequest(url+'&locale=ko',{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({seo:{noIndex:true}})}),params);
  expect(response.status).toBe(200);
  const html=await render();expect(html).not.toContain('href="/ko/search-visible"');expect(html).not.toContain('currentsearchtoken title');expect(html).not.toContain('currentsearchtoken public body');expect(await (await api()).json()).toMatchObject({total:0,hits:[]});
  const old=await loadSearchIndex();vi.mocked(loadSearchIndex).mockResolvedValue({...old!,builtAt:new Date(Date.now()-301000).toISOString()});
  expect(await render()).not.toContain('href="/ko/search-visible"');expect(await (await api()).json()).toMatchObject({total:0,hits:[]});expect(saveSearchIndex).toHaveBeenCalled();
 });
 it('empty SSR and API queries do no index or published storage work',async()=>{
  const read=vi.spyOn(persistence,'readPageCanvas');const site=vi.spyOn(persistence,'readSiteDocument');vi.mocked(loadSearchIndex).mockClear();
  await render('   ');await GET(new NextRequest('https://example.test/api/search?q='));expect(loadSearchIndex).not.toHaveBeenCalled();expect(read).not.toHaveBeenCalled();expect(site).not.toHaveBeenCalled();expect(saveSearchIndex).not.toHaveBeenCalled();
 });
 it('strict site outage fails closed on SSR and API rather than returning cached results',async()=>{
  await writeFile(path.join(root,'site',siteId,'site.json'),'{corrupt');
  await expect(render()).rejects.toThrow();expect((await api()).status).toBe(500);
 });
 it('unpublished current page is not discovered by title alone',async()=>{
  await persistence.writePageCanvas(siteId,'search-page','draft',{...canvas,updatedBy:'must-not-fallback'});
  await persistence.deletePageCanvasRecord(siteId,'search-page','published');expect((await collectAllSearchDocs()).filter(d=>d.kind==='page')).toEqual([]);expect(await render()).not.toContain('href="/ko/search-visible"');expect(await (await api()).json()).toMatchObject({total:0});
 });


 it('password-protected current page suppresses fresh cached SSR and API snippets',async()=>{
  const site=(await persistence.readExistingSiteDocument(siteId))!;site.pages.find(p=>p.pageId==='search-page')!.password='synthetic';await persistence.writeSiteDocument(site);
  expect(await render()).not.toContain('href="/ko/search-visible"');expect(await (await api()).json()).toMatchObject({total:0,hits:[]});
 });
 it('missing site cannot revive cached results from default metadata',async()=>{
  await rm(path.join(root,'site',siteId,'site.json'));expect(await render()).not.toContain('href="/ko/search-visible"');expect(await (await api()).json()).toMatchObject({total:0,hits:[]});
 });
 it.each(['ko','en','zh-hant','ja'] as const)('empty %s SSR skips both index reads and writes',async locale=>{
  vi.mocked(loadSearchIndex).mockClear();vi.mocked(saveSearchIndex).mockClear();const siteRead=vi.spyOn(persistence,'readExistingSiteDocument');const canvasRead=vi.spyOn(persistence,'readPageCanvas');
  await SearchPage({params:Promise.resolve({locale}),searchParams:Promise.resolve({q:'  '})});expect(loadSearchIndex).not.toHaveBeenCalled();expect(saveSearchIndex).not.toHaveBeenCalled();expect(siteRead).not.toHaveBeenCalled();expect(canvasRead).not.toHaveBeenCalled();
 });

 it('actual SSR and API coalesce expired collection while save failure retains results',async()=>{
  const stale=await loadSearchIndex();vi.mocked(loadSearchIndex).mockResolvedValue({...stale!,builtAt:new Date(Date.now()-301000).toISOString()});
  const real=collector.collectAllSearchDocs;let release!:()=>void;let entered!:()=>void;
  const gate=new Promise<void>(r=>{release=r;});const started=new Promise<void>(r=>{entered=r;});
  const collect=vi.spyOn(collector,'collectAllSearchDocs').mockImplementation(async id=>{entered();await gate;return real(id);});
  vi.mocked(saveSearchIndex).mockRejectedValueOnce(new Error('synthetic save failure'));
  const first=render();await started;const second=api();await Promise.resolve();await Promise.resolve();release();
  const [html,response]=await Promise.all([first,second]);expect(html).toContain('href="/ko/search-visible"');expect(await response.json()).toMatchObject({total:1});expect(collect).toHaveBeenCalledTimes(1);expect(saveSearchIndex).toHaveBeenCalledTimes(1);
 });
 it('actual stored candidates deduplicate seven targets and bound concurrency to four despite unrelated pages',async()=>{
  const ids=['search-page'];
  for(let i=0;i<26;i++){
   const page=await persistence.createPage(siteId,'ko','extra-'+i,'unrelated');
   if(i<6){ids.push(page.pageId);await persistence.writePageCanvas(siteId,page.pageId,'published',canvas);}
  }
  const populated=(await persistence.readExistingSiteDocument(siteId))!;for(const page of populated.pages)if(ids.includes(page.pageId))page.publishedAt=at;await persistence.writeSiteDocument(populated);
  expect((await persistence.readExistingSiteDocument(siteId))!.pages.length).toBe(28);
  const doc={id:'page:ko:search-page',kind:'page' as const,locale:'ko' as const,title:'currentsearchtoken old',url:'/old',body:'currentsearchtoken old'};
  vi.mocked(loadSearchIndex).mockResolvedValue(buildSearchIndex([doc,doc,...ids.slice(1).map(id=>({...doc,id:'page:ko:'+id}))]));
  const real=persistence.readPageCanvas;let active=0,peak=0;const reads:string[]=[];
  vi.spyOn(persistence,'readPageCanvas').mockImplementation(async(site,id,variant)=>{reads.push(id);active++;peak=Math.max(peak,active);try{await new Promise(r=>setTimeout(r,3));return await real(site,id,variant);}finally{active--;}});
  const siteReads=vi.spyOn(persistence,'readExistingSiteDocument');const response=await api();expect(await response.json()).toMatchObject({total:7});expect(reads).toHaveLength(7);expect(new Set(reads)).toEqual(new Set(ids));expect(siteReads).toHaveBeenCalledTimes(1);expect(peak).toBeLessThanOrEqual(4);expect(peak).toBeGreaterThan(1);
 });
 it('current published content regenerates URL title body highlights and count',async()=>{
  const site=(await persistence.readExistingSiteDocument(siteId))!;const page=site.pages.find(p=>p.pageId==='search-page')!;page.title.ko='currentsearchtoken new';page.slug='new-public-path';await persistence.writeSiteDocument(site);
  await persistence.writePageCanvas(siteId,page.pageId,'published',{...canvas,nodes:canvas.nodes.map(n=>n.kind==='image'?{...n,content:{...n.content,alt:'currentsearchtoken replacement body'}}:n)});
  const html=await render();expect(html).toContain('href="/ko/new-public-path"');expect(html).toContain('currentsearchtoken new');expect(html).not.toContain('currentsearchtoken title');expect(html).not.toContain('currentsearchtoken public body');
  const payload=await(await api()).json();expect(payload.total).toBe(1);expect(payload.hits[0]).toMatchObject({title:'currentsearchtoken new',url:'/ko/new-public-path'});expect(JSON.stringify(payload)).toContain('replacement body');expect(JSON.stringify(payload)).not.toContain('currentsearchtoken public body');
 });
 it('malformed builder candidate fails before metadata or canvas read',async()=>{
  vi.mocked(loadSearchIndex).mockResolvedValue(buildSearchIndex([{id:'page:ko:../escape',kind:'page',locale:'ko',title:'currentsearchtoken',url:'/bad',body:'currentsearchtoken'}]));
  const metadata=vi.spyOn(persistence,'readExistingSiteDocument');const data=vi.spyOn(persistence,'readPageCanvas');expect((await api()).status).toBe(500);expect(metadata).not.toHaveBeenCalled();expect(data).not.toHaveBeenCalled();await expect(render()).rejects.toThrow('search_current_data_unavailable');
 });

 it('published dynamic base resolves its default record and remains indexed in actual SSR/API',async()=>{
  const site=(await persistence.readExistingSiteDocument(siteId))!;const page=site.pages.find(p=>p.pageId==='search-page')!;
  page.dynamicItem=createBuilderDynamicItemPageMeta({collectionId:'columns',locale:'ko',recordSlug:'fixture-record'});await persistence.writeSiteDocument(site);
  const stored=(await persistence.readExistingSiteDocument(siteId))!;const match=findPageMetaForLocaleWithDynamicContext(stored.pages,'ko','search-visible');
  expect(match?.page.pageId).toBe('search-page');expect(match?.dynamicItemRecordSlug).toBeUndefined();expect(match?.page.dynamicItem?.defaultRecordSlug).toBe('fixture-record');
  expect((await resolvePublishedSitePage('ko','search-visible'))?.pageMeta.pageId).toBe('search-page');
  const docs=await collectAllSearchDocs();expect(docs.filter(d=>d.id==='page:ko:search-page').map(d=>d.url)).toEqual(['/ko/search-visible']);
  expect(await render()).toContain('href="/ko/search-visible"');expect(await(await api()).json()).toMatchObject({total:1,hits:[{url:'/ko/search-visible'}]});
 });
 it('removed current publication marker cannot expose a retained canvas through refreshed SSR/API',async()=>{
  expect((await resolvePublishedSitePage('ko','search-visible'))?.pageMeta.pageId).toBe('search-page');
  const site=(await persistence.readExistingSiteDocument(siteId))!;const page=site.pages.find(p=>p.pageId==='search-page')!;delete page.publishedAt;delete page.publishedSavedAt;
  await writeFile(path.join(root,'site',siteId,'site.json'),JSON.stringify(site));expect(await persistence.readPageCanvas(siteId,page.pageId,'published')).not.toBeNull();
  expect(await resolvePublishedSitePage('ko','search-visible')).toBeNull();
  expect((await collectAllSearchDocs()).some(d=>d.id==='page:ko:search-page')).toBe(false);expect(await render()).not.toContain('href="/ko/search-visible"');expect(await(await api()).json()).toMatchObject({total:0,hits:[]});
 });

 it('current designated published revision recovery matches actual renderer without reading distinct draft',async()=>{
  const revisionCanvas={...canvas,nodes:canvas.nodes.map(n=>n.kind==='image'?{...n,content:{...n.content,alt:'currentsearchtoken REVISION_PUBLIC_ONLY'}}:n)};
  const revision=await recordRevision(siteId,'search-page',{revision:1,savedAt:at,document:revisionCanvas},{source:'publish'});
  const site=(await persistence.readExistingSiteDocument(siteId))!;site.pages.find(p=>p.pageId==='search-page')!.publishedRevisionId=revision.revisionId;await persistence.writeSiteDocument(site);
  expect((await persistence.readExistingSiteDocument(siteId))!.pages.find(p=>p.pageId==='search-page')!.publishedRevisionId).toBe(revision.revisionId);
  await persistence.writePageCanvas(siteId,'search-page','draft',{...canvas,nodes:canvas.nodes.map(n=>n.kind==='image'?{...n,content:{...n.content,alt:'DRAFT_PRIVATE_ONLY'}}:n)});
  await unlink(path.join(root,'site',siteId,'pages','search-page.published.json'));expect(await persistence.readPageCanvas(siteId,'search-page','published')).toBeNull();
  const resolved=await resolvePublishedSitePage('ko','search-visible');expect(resolved?.pageMeta.pageId).toBe('search-page');expect(JSON.stringify(resolved?.canvas)).toContain('REVISION_PUBLIC_ONLY');expect(JSON.stringify(resolved?.canvas)).not.toContain('DRAFT_PRIVATE_ONLY');
  const current=await collector.readCurrentBuilderSearchDoc({id:'page:ko:search-page',kind:'page',locale:'ko',title:'stale',url:'/stale',body:'currentsearchtoken'});
  const collected=await collectAllSearchDocs();const html=await render();const body=await(await api()).json();
  expect(current?.body).toContain('REVISION_PUBLIC_ONLY');expect(collected.find(d=>d.id==='page:ko:search-page')?.body).toContain('REVISION_PUBLIC_ONLY');expect(html).toContain('href="/ko/search-visible"');expect(body.total).toBe(1);expect(JSON.stringify({current,html,body})).not.toContain('DRAFT_PRIVATE_ONLY');
 });
});
