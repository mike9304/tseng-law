import { rebuildSearchIndexBestEffort } from '@/lib/builder/search/index-runtime';
import { selectBlueprint } from '@/lib/builder/ai-generator/template-selector';
import { createBuilderDynamicItemPageMeta } from '@/lib/builder/dynamic-item-pages';
import { beforeEach, afterEach, it, expect, vi } from 'vitest';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { NextRequest } from 'next/server';
import { POST as createPOST } from '@/app/api/builder/site/pages/route';
import { PATCH as pagePATCH } from '@/app/api/builder/site/pages/[pageId]/route';
import { PATCH as seoPATCH } from '@/app/api/builder/site/pages/[pageId]/seo/route';
import { POST as aiPOST } from '@/app/api/builder/ai-generator/apply/route';
import * as store from '@/lib/builder/site/persistence';
import { createDefaultSiteDocument } from '@/lib/builder/site/types';
import { DEFAULT_BUILDER_SITE_ID as siteId } from '@/lib/builder/constants';
import { generateSiteDraft } from '@/lib/builder/ai-generator/orchestrator';
import { resolveLocaleSlug } from '@/lib/builder/translations/locale-slug';
// Authentication result and external generation/conversion are synthetic; route validation and storage are real.
vi.mock('@/lib/builder/security/guard',()=>({guardMutation:vi.fn(async()=>({username:'synthetic-author'}))}));
vi.mock('next/cache',()=>({revalidatePath:vi.fn()}));
// The deployed writer's existing background index write is outside this handler test.
vi.mock('@/lib/builder/search/index-runtime',()=>({rebuildSearchIndexBestEffort:vi.fn(async()=>undefined)}));
vi.mock('@/lib/builder/ai-generator/orchestrator',()=>({generateSiteDraft:vi.fn(),isSupportedAiGeneratorPromptVersion:()=>true,resolveAiGeneratorPromptVersion:()=> 'synthetic-version'}));
vi.mock('@/lib/builder/ai-generator/canvas-import',()=>({draftToCanvasNodes:()=>[],draftToSitemapPageCanvasNodes:()=>[]}));
vi.mock('@/lib/builder/blog/column-adapter',()=>({listBlogPosts:vi.fn(async()=>[])}));
vi.mock('@/lib/builder/faq/faq-engine',()=>({listFaqSearchDocs:vi.fn(async()=>[])}));
vi.mock('@/lib/builder/portfolio/portfolio-engine',()=>({listPortfolioSearchDocs:vi.fn(async(locale:string)=>locale==='ko'?[{id:'portfolio:ko:synthetic-native',kind:'portfolio',locale:'ko',title:'Native feature',url:'/ko/portfolio/synthetic',body:'Synthetic'}]:[])}));
vi.mock('@/lib/columns',()=>({getAllColumnPosts:vi.fn(()=>[])}));
const spec={industry:'law',companyName:'Synthetic company',goals:['Inform'],desiredPages:['Search'],brandKeywords:['Synthetic'],tone:'professional',colorPreference:'cool',locale:'ko'};
let root:string;let fetchTrap:ReturnType<typeof vi.fn>;
const props=(pageId:string)=>({params:Promise.resolve({pageId})});
const request=(url:string,method:string,body:unknown)=>new NextRequest('https://example.test'+url,{method,headers:{'content-type':'application/json'},body:JSON.stringify(body)});
beforeEach(async()=>{
 vi.clearAllMocks();root=await mkdtemp(path.join(os.tmpdir(),'authoring-route-ownership-'));
 for(const [k,v] of Object.entries({BUILDER_SITE_ROOT:path.join(root,'site'),BUILDER_SITE_BACKEND:'local',BUILDER_RUNTIME_DATA_ROOT:path.join(root,'runtime'),BUILDER_REVISIONS_ROOT:path.join(root,'revisions'),CONSULTATION_LOG_BACKEND:'local',BLOB_READ_WRITE_TOKEN:'',BUILDER_PAGE_CANVAS_CAS_MODE:'legacy'}))vi.stubEnv(k,v);
 fetchTrap=vi.fn(async()=>{throw new Error('unexpected network');});vi.stubGlobal('fetch',fetchTrap);
 const site=createDefaultSiteDocument('ko',siteId);site.pages=[{...site.pages[0],pageId:'home'}];site.navigation=[];await store.writeSiteDocument(site);
 vi.mocked(generateSiteDraft).mockResolvedValue({promptVersion:'synthetic',blueprintVersion:'synthetic',contentVersion:'synthetic',promptChangelog:[],spec,content:{hero:{sectionId:'hero',headline:'Synthetic headline',body:'Synthetic body',ctaLabel:'Read'},sections:[],metaDescription:'Synthetic',source:'openai',stub:false},plan:{visualBrief:{direction:'Synthetic',imagePrompt:'Synthetic',treatment:'Synthetic',composition:'Synthetic'},sitemap:[{title:'Search',slug:'search',purpose:'Synthetic page',sections:['hero']}],contentPlan:[],brandBrief:{audience:'Synthetic',goals:['Inform'],keywords:['Synthetic'],constraints:''}},blueprint:selectBlueprint('law'),palette:{primary:'#123456',secondary:'#234567',accent:'#345678',background:'#ffffff'},generatedAt:new Date().toISOString()} as Awaited<ReturnType<typeof generateSiteDraft>>);
});
afterEach(async()=>{expect(fetchTrap).not.toHaveBeenCalled();vi.unstubAllGlobals();vi.unstubAllEnvs();await rm(root,{recursive:true,force:true});});
it.each(['create','rename','localized','seo','ai-single','ai-sitemap'])('rejects native-owned search before writes through actual %s',async mode=>{
 const page=mode==='rename'||mode==='localized'||mode==='seo'?await store.createPage(siteId,'ko','safe-page','Synthetic title'):null;
 const sitePath=path.join(root,'site',siteId,'site.json');const before=await readFile(sitePath,'utf8');let response:Response;
 if(mode==='create')response=await createPOST(request('/api/builder/site/pages','POST',{siteId,locale:'ko',slug:'search',title:'Synthetic title',addToNavigation:true}));
 else if(mode==='rename')response=await pagePATCH(request('/api/builder/site/pages/'+page!.pageId+'?siteId='+siteId,'PATCH',{slug:'search'}),props(page!.pageId));
 else if(mode==='localized')response=await pagePATCH(request('/api/builder/site/pages/'+page!.pageId+'?siteId='+siteId,'PATCH',{slugByLocale:{en:'search'}}),props(page!.pageId));
 else if(mode==='seo')response=await seoPATCH(request('/api/builder/site/pages/'+page!.pageId+'/seo?siteId='+siteId,'PATCH',{slug:'search'}),props(page!.pageId));
 else response=await aiPOST(request('/api/builder/ai-generator/apply','POST',{spec,slug:'search',scope:mode==='ai-single'?'single':'sitemap',addToNavigation:true}));
 await response.json();const current=(await store.readExistingSiteDocument(siteId))!;const collisions=current.pages.filter(p=>resolveLocaleSlug(p,mode==='localized'?'en':'ko')==='search').map(p=>({pageId:p.pageId,locale:p.locale,slug:p.slug,slugByLocale:p.slugByLocale}));
 expect.soft(rebuildSearchIndexBestEffort).not.toHaveBeenCalled();expect.soft([400,409]).toContain(response.status);expect.soft(collisions).toEqual([]);expect.soft(await readFile(sitePath,'utf8')).toBe(before);
});
it.each(['faq','videos','columns','search/help','columns/example/more','about/team'])('preserves actual valid builder/catchall creation %s',async slug=>{
 const response=await createPOST(request('/api/builder/site/pages','POST',{siteId,locale:'ko',slug,title:'Synthetic '+slug,addToNavigation:true}));const body=await response.json();expect(response.status,JSON.stringify(body)).toBe(200);expect((await store.readExistingSiteDocument(siteId))!.pages.some(p=>p.slug===slug)).toBe(true);
});

it.each(['page','seo'])('safe rename through %s preserves id but does not redirect native-owned source',async writer=>{
 const page=await store.createPage(siteId,'ko','search','Old collision');
 const url='/api/builder/site/pages/'+page.pageId+(writer==='seo'?'/seo':'')+'?siteId='+siteId;
 const response=await (writer==='seo'?seoPATCH:pagePATCH)(request(url,'PATCH',{slug:'safe-search',createRedirect:true}),props(page.pageId));
 expect(response.status).toBe(200);
 expect(rebuildSearchIndexBestEffort).toHaveBeenCalledOnce();
 const current=(await store.readExistingSiteDocument(siteId))!;
 expect(current.pages.find(p=>p.pageId===page.pageId)?.slug).toBe('safe-search');
 expect(current.redirects?.some(r=>r.from==='/ko/search')).not.toBe(true);
});
it('allows metadata-only edits and incremental repair of unrelated old collisions',async()=>{
 const page=await store.createPage(siteId,'ko','search','Old collision');
 const site=(await store.readExistingSiteDocument(siteId))!;
 site.pages.find(p=>p.pageId===page.pageId)!.slugByLocale={en:'account'};await store.writeSiteDocument(site);
 const url='/api/builder/site/pages/'+page.pageId+'?siteId='+siteId;
 expect((await pagePATCH(request(url,'PATCH',{title:'Updated'}),props(page.pageId))).status).toBe(200);
 expect((await pagePATCH(request(url,'PATCH',{slug:'safe-search'}),props(page.pageId))).status).toBe(200);
 const saved=(await store.readExistingSiteDocument(siteId))!.pages.find(p=>p.pageId===page.pageId)!;
 expect(saved.slug).toBe('safe-search');expect(saved.slugByLocale?.en).toBe('account');
});
it('does not clear a locale override to expose a newly native-owned URL',async()=>{
 const page=await store.createPage(siteId,'ko','search','Old collision');
 const site=(await store.readExistingSiteDocument(siteId))!;site.pages.find(p=>p.pageId===page.pageId)!.slugByLocale={en:'safe-en'};await store.writeSiteDocument(site);
 const before=await readFile(path.join(root,'site',siteId,'site.json'),'utf8');
 const response=await pagePATCH(request('/api/builder/site/pages/'+page.pageId+'?siteId='+siteId,'PATCH',{slugByLocale:{}}),props(page.pageId));
 expect(response.status).toBe(400);expect(await readFile(path.join(root,'site',siteId,'site.json'),'utf8')).toBe(before);
});
it.each(['page','seo'])('%s skips an overlapping wildcard but retains safe exact rename/navigation',async writer=>{
 const page=await store.createPage(siteId,'ko','guides','Guides');
 const site=(await store.readExistingSiteDocument(siteId))!;
 site.pages.find(p=>p.pageId===page.pageId)!.dynamicItem=createBuilderDynamicItemPageMeta({collectionId:'service-areas',locale:'ko',recordSlug:'example'});
 site.navigation=[{id:'guide-link',label:'Guide',pageId:page.pageId,href:'/ko/guides'}];
 await store.writeSiteDocument(site);
 const response=await (writer==='seo'?seoPATCH:pagePATCH)(request('/api/builder/site/pages/'+page.pageId+(writer==='seo'?'/seo':'')+'?siteId='+siteId,'PATCH',{slug:'safe-guides',createRedirect:true}),props(page.pageId));
 expect(response.status).toBe(200);const body=await response.json();expect(body.redirectWarnings.length).toBeGreaterThan(0);
 const current=(await store.readExistingSiteDocument(siteId))!;
 expect(current.pages.find(p=>p.pageId===page.pageId)?.slug).toBe('safe-guides');expect(current.navigation[0].href).toBe('/ko/safe-guides');
 const {findRedirectMatch}=await import('@/lib/builder/site/redirect-match');
 expect(findRedirectMatch('/ko/guides/taiwan-company-setup',current.redirects??[])).toBeNull();
 expect(findRedirectMatch('/ko/guides',current.redirects??[])?.to).toBe('/ko/safe-guides');
});
it('mixed AI sitemap skips native targets using reserved_slug and creates valid targets',async()=>{
 const generated=vi.mocked(generateSiteDraft).getMockImplementation()!;
 const draft=await generated(spec as never);
 draft.plan.sitemap.push({title:'Safe',slug:'safe-ai',purpose:'Synthetic',sections:['hero']});
 vi.mocked(generateSiteDraft).mockResolvedValue(draft);
 const response=await aiPOST(request('/api/builder/ai-generator/apply','POST',{spec,scope:'sitemap',addToNavigation:true}));
 const body=await response.json();expect(response.status,JSON.stringify(body)).toBe(200);
 expect(JSON.stringify(body)).toContain('reserved_slug');
 const current=(await store.readExistingSiteDocument(siteId))!;expect(current.pages.some(p=>p.slug==='search')).toBe(false);expect(current.pages.some(p=>p.slug==='safe-ai')).toBe(true);
});

it('current builder search excludes native collisions but preserves safe published base and non-builder docs',async()=>{
 const {createDefaultCanvasNodeStyle}=await import('@/lib/builder/canvas/types');
 const {collectAllSearchDocs,readCurrentBuilderSearchDoc}=await import('@/lib/builder/search/source-collector');
 const collision=await store.createPage(siteId,'ko','search','Collision');
 const site=(await store.readExistingSiteDocument(siteId))!;
 site.pages.find(p=>p.pageId===collision.pageId)!.publishedAt=new Date().toISOString();await store.writeSiteDocument(site);
 await store.writePageCanvas(siteId,collision.pageId,'published',{version:1,locale:'ko',updatedAt:new Date().toISOString(),updatedBy:'synthetic',stageWidth:1280,stageHeight:720,nodes:[{id:'image',kind:'image',rect:{x:0,y:0,width:100,height:100},style:createDefaultCanvasNodeStyle(),zIndex:0,rotation:0,locked:false,visible:true,content:{src:'/test.png',alt:'Synthetic public content',fit:'contain'}}]});
 const candidate={id:`page:ko:${collision.pageId}`,kind:'page' as const,locale:'ko' as const,title:'Collision',url:'/ko/search',body:'Old'};
 expect(await readCurrentBuilderSearchDoc(candidate,siteId)).toBeNull();
 expect((await collectAllSearchDocs(siteId)).some(d=>d.id===candidate.id)).toBe(false);
 const response=await pagePATCH(request('/api/builder/site/pages/'+collision.pageId+'?siteId='+siteId,'PATCH',{slug:'safe-search'}),props(collision.pageId));expect(response.status).toBe(200);
 expect(await readCurrentBuilderSearchDoc(candidate,siteId)).toMatchObject({id:candidate.id,url:'/ko/safe-search',body:expect.stringContaining('Synthetic public content')});
 expect((await collectAllSearchDocs(siteId)).find(d=>d.id==='portfolio:ko:synthetic-native')).toMatchObject({url:'/ko/portfolio/synthetic',kind:'portfolio'});
});

it.each(['page','seo'])('%s raw base change preserves safe effective navigation and creates no raw redirect',async writer=>{
 const page=await store.createPage(siteId,'ko','safe-base','Overrides');
 const site=(await store.readExistingSiteDocument(siteId))!;
 site.pages.find(p=>p.pageId===page.pageId)!.slugByLocale={ko:'safe-ko',en:'safe-en','zh-hant':'safe-zh'};
 site.navigation=[{id:'localized-link',label:'Localized',pageId:page.pageId,href:'/ko/safe-ko'}];await store.writeSiteDocument(site);
 const response=await (writer==='seo'?seoPATCH:pagePATCH)(request('/api/builder/site/pages/'+page.pageId+(writer==='seo'?'/seo':'')+'?siteId='+siteId,'PATCH',{slug:'search',createRedirect:true}),props(page.pageId));
 expect(response.status).toBe(200);const current=(await store.readExistingSiteDocument(siteId))!;
 expect(current.pages.find(p=>p.pageId===page.pageId)?.slug).toBe('search');
 expect(current.navigation[0].href).toBe('/ko/safe-ko');expect(current.redirects??[]).toEqual([]);
 const body=await response.json();expect(JSON.stringify(body)).not.toContain('/ko/search');
});
