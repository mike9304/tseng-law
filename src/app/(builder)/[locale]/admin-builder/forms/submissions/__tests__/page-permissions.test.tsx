import { beforeAll, beforeEach, afterAll, expect, it, vi } from 'vitest';
import { mkdtemp, rm } from 'fs/promises';import os from 'os';import path from 'path';
import { __setUserRoleStorageRootForTests, __resetUserRoleStorageRootForTests, upsertUserRole } from '@/lib/builder/security/user-role-store';
import { userHasPermission } from '@/lib/builder/security/resolve-permission';
import Page from '../page';
const data=vi.hoisted(()=>({ids:vi.fn(),rows:vi.fn(),headers:new Headers(),fixture:[{submissionId:'synthetic-submission',formId:'synthetic-form',values:{message:'SYNTHETIC PRIVATE MESSAGE'}}]}));
// Real page helper/auth/role table/storage. Only request context and data inputs
// are synthetic. Client placeholder permits server-returned prop inspection.
vi.mock('next/headers',()=>({headers:async()=>data.headers}));
vi.mock('@/lib/builder/forms/form-engine',()=>({listSubmissionFormIds:data.ids,listSubmissions:data.rows}));
vi.mock('@/components/builder/forms/SubmissionsListView',()=>({default:()=>null}));
let root:string;
function auth(name:string){data.headers=new Headers({authorization:'Basic '+Buffer.from(name+':synthetic-pass').toString('base64')});}
beforeAll(async()=>{
 root=await mkdtemp(path.join(os.tmpdir(),'fn29-page-roles-'));__setUserRoleStorageRootForTests(root);vi.stubEnv('CMS_ADMIN_USERNAME','synthetic-owner');vi.stubEnv('CMS_ADMIN_PASSWORD','synthetic-pass');
 vi.stubEnv('BUILDER_BASIC_AUTH_USERS',JSON.stringify(['editor','client','admin'].map(role=>({username:'synthetic-'+role,password:'synthetic-pass'}))));
 for(const role of ['editor','client','admin'] as const)await upsertUserRole({username:'synthetic-'+role,role,addedBy:'synthetic-owner'});
 vi.stubGlobal('fetch',vi.fn(()=>{throw new Error('Unexpected network');}));
});
beforeEach(()=>{data.ids.mockReset().mockResolvedValue(['first-form','other-form']);data.rows.mockReset().mockResolvedValue(data.fixture);data.headers=new Headers();});
afterAll(async()=>{__resetUserRoleStorageRootForTests();vi.unstubAllEnvs();vi.unstubAllGlobals();await rm(root,{recursive:true,force:true});});
function expectNoLoads(){expect(data.ids).not.toHaveBeenCalled();expect(data.rows).not.toHaveBeenCalled();}
it.each(['editor','client','anonymous'])('denies %s before any form IDs or submission reads',async(role)=>{
 if(role!=='anonymous'){auth('synthetic-'+role);expect(await userHasPermission('synthetic-'+role,'manage-forms')).toBe(false);}
 if(role==='editor')expect(await userHasPermission('synthetic-editor','edit-pages')).toBe(true);
 await expect(Page({params:Promise.resolve({locale:'ko'})})).rejects.toMatchObject({digest:'NEXT_HTTP_ERROR_FALLBACK;404'});expectNoLoads();
});
it.each(['owner','admin'])('allows %s and preserves explicit form and locale',async(role)=>{
 auth('synthetic-'+role);expect(await userHasPermission('synthetic-'+role,'manage-forms')).toBe(true);
 const page=await Page({params:Promise.resolve({locale:'zh-hant'}),searchParams:Promise.resolve({formId:'chosen-form'})});
 expect(page.props.initialSubmissions).toEqual(data.fixture);expect(page.props.locale).toBe('zh-hant');expect(page.props.initialFormId).toBe('chosen-form');expect(data.rows).toHaveBeenCalledWith('chosen-form',100);
});
it('keeps first/default form fallback for allowed users',async()=>{
 auth('synthetic-owner');const first=await Page({params:Promise.resolve({locale:'en'})});expect(first.props.initialFormId).toBe('first-form');
 data.ids.mockResolvedValueOnce([]);const empty=await Page({params:Promise.resolve({locale:'en'})});expect(empty.props.initialFormId).toBe('default-contact');
});
it('preserves allowed submission read failure as empty without swallowing authorization',async()=>{
 auth('synthetic-owner');data.rows.mockRejectedValueOnce(new Error('synthetic read failure'));const page=await Page({params:Promise.resolve({locale:'ko'})});expect(page.props.initialSubmissions).toEqual([]);expect(data.rows).toHaveBeenCalledOnce();
});
it('rechecks role changes for the same authenticated user',async()=>{
 auth('synthetic-admin');await Page({params:Promise.resolve({locale:'ko'})});await upsertUserRole({username:'synthetic-admin',role:'editor',addedBy:'synthetic-owner'});data.ids.mockClear();data.rows.mockClear();
 try{await expect(Page({params:Promise.resolve({locale:'ko'})})).rejects.toMatchObject({digest:'NEXT_HTTP_ERROR_FALLBACK;404'});expectNoLoads();}
 finally{await upsertUserRole({username:'synthetic-admin',role:'admin',addedBy:'synthetic-owner'});}
});
