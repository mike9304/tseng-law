import { beforeAll, beforeEach, afterAll, expect, it, vi } from 'vitest';
import { mkdtemp, rm } from 'fs/promises';
import os from 'os'; import path from 'path';
import { __setUserRoleStorageRootForTests, __resetUserRoleStorageRootForTests, upsertUserRole } from '@/lib/builder/security/user-role-store';
import { resolveUserRole, userHasPermission } from '@/lib/builder/security/resolve-permission';
import Portfolio from '../portfolio/page';
import Events from '../events/page';
const fixture=vi.hoisted(()=>({headers:new Headers(),rows:[{projectId:'synthetic-private',eventId:'synthetic-private',title:'SYNTHETIC DRAFT',locale:'ko',status:'draft',order:0,completedAt:'2026-01-01'}],site:vi.fn(),portfolio:vi.fn(),events:vi.fn()}));
// Only request context/storage data/client imports are injected. The actual read
// guard, Basic authentication, role store and permission table are not mocked.
vi.mock('next/headers',()=>({headers:async()=>fixture.headers}));
vi.mock('@/lib/builder/site/persistence',()=>({readSiteDocument:fixture.site}));
vi.mock('@/lib/builder/portfolio/portfolio-engine',()=>({DEFAULT_PORTFOLIO_CATEGORIES:[],filterProjectsByLocale:(rows:typeof fixture.rows,locale:string)=>rows.filter(row=>row.locale===locale),sortProjects:(rows:typeof fixture.rows)=>rows,listProjects:fixture.portfolio}));
vi.mock('@/lib/builder/events/events-engine',()=>({listEvents:fixture.events}));
vi.mock('@/components/builder/portfolio/PortfolioAdminClient',()=>({default:()=>null}));
vi.mock('@/components/builder/events/EventsAdminClient',()=>({default:()=>null}));
let root:string;
function authenticate(username:string){fixture.headers=new Headers({authorization:'Basic '+Buffer.from(username+':synthetic-password').toString('base64')});}
beforeAll(async()=>{
 root=await mkdtemp(path.join(os.tmpdir(),'fn27-page-role-'));__setUserRoleStorageRootForTests(root);
 vi.stubEnv('CMS_ADMIN_USERNAME','synthetic-owner');vi.stubEnv('CMS_ADMIN_PASSWORD','synthetic-password');vi.stubEnv('BUILDER_BASIC_AUTH_USERS',JSON.stringify([{username:'synthetic-client',password:'synthetic-password'},{username:'synthetic-editor',password:'synthetic-password'}]));
 vi.stubGlobal('fetch',vi.fn(()=>{throw new Error('Unexpected network access');}));
 await upsertUserRole({username:'synthetic-client',role:'client',addedBy:'synthetic-owner'});await upsertUserRole({username:'synthetic-editor',role:'editor',addedBy:'synthetic-owner'});
});
beforeEach(()=>{fixture.site.mockReset().mockResolvedValue({name:'Synthetic'});fixture.portfolio.mockReset().mockResolvedValue(fixture.rows);fixture.events.mockReset().mockResolvedValue(fixture.rows);fixture.headers=new Headers();});
afterAll(async()=>{__resetUserRoleStorageRootForTests();vi.unstubAllEnvs();vi.unstubAllGlobals();await rm(root,{recursive:true,force:true});});
const pages=[['portfolio',Portfolio,'initialProjects'],['events',Events,'initialEvents']] as const;
function expectNoLoaders(){expect(fixture.site).not.toHaveBeenCalled();expect(fixture.portfolio).not.toHaveBeenCalled();expect(fixture.events).not.toHaveBeenCalled();}
it.each(pages)('denies authenticated client before any %s data loader',async(_name,Page)=>{
 authenticate('synthetic-client');expect(await resolveUserRole('synthetic-client')).toBe('client');expect(await userHasPermission('synthetic-client','edit-pages')).toBe(false);
 await expect(Page({params:Promise.resolve({locale:'ko'})})).rejects.toMatchObject({ digest: 'NEXT_HTTP_ERROR_FALLBACK;404' });expectNoLoaders();
});
it.each(pages)('denies anonymous access before any %s loader',async(_name,Page)=>{
 await expect(Page({params:Promise.resolve({locale:'ko'})})).rejects.toMatchObject({ digest: 'NEXT_HTTP_ERROR_FALLBACK;404' });expectNoLoaders();
});
for(const username of ['synthetic-owner','synthetic-editor']){
 it.each(pages)(`allows ${username} %s output and retains locale filtering`,async(name,Page,prop)=>{
 authenticate(username);expect(await userHasPermission(username,'edit-pages')).toBe(true);
 const page=await Page({params:Promise.resolve({locale:'ko'})});expect(page.props[prop]).toEqual(fixture.rows);
 const localized=await Page({params:Promise.resolve({locale:'zh-hant'})});expect(localized.props[prop]).toEqual([]);
 if(name==='portfolio'){expect(fixture.site).toHaveBeenCalledTimes(2);expect(fixture.portfolio).toHaveBeenCalledTimes(2);expect(fixture.events).not.toHaveBeenCalled();}
 else{expect(fixture.events).toHaveBeenCalledTimes(2);expect(fixture.site).not.toHaveBeenCalled();expect(fixture.portfolio).not.toHaveBeenCalled();}
 });
}
it.each(pages)('rechecks changed role on each %s request',async(_name,Page)=>{
 await upsertUserRole({username:'synthetic-editor',role:'editor',addedBy:'synthetic-owner'});authenticate('synthetic-editor');await Page({params:Promise.resolve({locale:'ko'})});
 await upsertUserRole({username:'synthetic-editor',role:'client',addedBy:'synthetic-owner'});fixture.site.mockClear();fixture.portfolio.mockClear();fixture.events.mockClear();
 try{await expect(Page({params:Promise.resolve({locale:'ko'})})).rejects.toMatchObject({ digest: 'NEXT_HTTP_ERROR_FALLBACK;404' });expectNoLoaders();}
 finally{await upsertUserRole({username:'synthetic-editor',role:'editor',addedBy:'synthetic-owner'});}
});
