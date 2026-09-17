import { beforeAll, beforeEach, afterAll, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { mkdtemp, rm } from 'fs/promises';import os from 'os';import path from 'path';
import { __setUserRoleStorageRootForTests, __resetUserRoleStorageRootForTests, upsertUserRole, listUserRoles } from '@/lib/builder/security/user-role-store';
import { resolveUserRole, userHasPermission } from '@/lib/builder/security/resolve-permission';
import { validateCsrf } from '@/lib/builder/security/csrf';
import Page from '../page';
import { POST } from '@/app/api/builder/security/users/route';
import { PATCH, DELETE } from '@/app/api/builder/security/users/[username]/route';
const fixture=vi.hoisted(()=>({headers:new Headers(),audit:vi.fn()}));
vi.mock('next/headers',()=>({headers:async()=>fixture.headers}));
vi.mock('@/components/builder/users/UsersAdmin',()=>({default:()=>null}));
vi.mock('@/lib/builder/audit/record',()=>({recordSecurityUserEvent:fixture.audit}));
// Spies call the actual implementations. Authentication, role evaluation, guard,
// role storage and notFound are real; no permission result is injected.
vi.mock('@/lib/builder/security/user-role-store',async(importOriginal)=>{const actual=await importOriginal<typeof import('@/lib/builder/security/user-role-store')>();return {...actual,listUserRoles:vi.fn(actual.listUserRoles)};});
vi.mock('@/lib/builder/security/resolve-permission',async(importOriginal)=>{const actual=await importOriginal<typeof import('@/lib/builder/security/resolve-permission')>();return {...actual,resolveUserRole:vi.fn(actual.resolveUserRole)};});
let root:string;
function auth(name:string){fixture.headers=new Headers({authorization:'Basic '+Buffer.from(name+':synthetic-pass').toString('base64'),origin:'http://localhost','content-type':'application/json'});}
beforeAll(async()=>{root=await mkdtemp(path.join(os.tmpdir(),'fn30-page-roles-'));__setUserRoleStorageRootForTests(root);vi.stubEnv('CMS_ADMIN_USERNAME','synthetic-first-owner');vi.stubEnv('CMS_ADMIN_PASSWORD','synthetic-pass');vi.stubEnv('BUILDER_BASIC_AUTH_USERS',JSON.stringify(['owner','client','admin','editor'].map(role=>({username:'synthetic-'+role,password:'synthetic-pass'}))));for(const role of ['client','admin','editor'] as const)await upsertUserRole({username:'synthetic-'+role,role,addedBy:'synthetic-first-owner'});vi.stubGlobal('fetch',vi.fn(()=>{throw new Error('Unexpected network');}));});
beforeEach(()=>{vi.mocked(listUserRoles).mockClear();vi.mocked(resolveUserRole).mockClear();fixture.audit.mockClear();fixture.headers=new Headers();});
afterAll(async()=>{__resetUserRoleStorageRootForTests();vi.unstubAllEnvs();vi.unstubAllGlobals();await rm(root,{recursive:true,force:true});});
it.each(['client','admin','editor','anonymous'])('denies %s before privileged user listing',async(role)=>{
 if(role!=='anonymous'){auth('synthetic-'+role);expect(await userHasPermission('synthetic-'+role,'manage-roles')).toBe(false);}
 await expect(Page({params:Promise.resolve({locale:'ko'})})).rejects.toMatchObject({digest:'NEXT_HTTP_ERROR_FALLBACK;404'});expect(listUserRoles).not.toHaveBeenCalled();
});
it('allows actual owner and resolves the requesting username rather than first stored owner',async()=>{
 auth('synthetic-owner');expect(await userHasPermission('synthetic-owner','manage-roles')).toBe(true);const page=await Page({params:Promise.resolve({locale:'zh-hant'})});expect(page.props.actorRole).toBe('owner');expect(page.props.locale).toBe('zh-hant');expect(page.props.initialUsers[0].username).toBe('synthetic-first-owner');expect(listUserRoles).toHaveBeenCalledOnce();expect(resolveUserRole).toHaveBeenCalledWith('synthetic-owner');expect(resolveUserRole).not.toHaveBeenCalledWith('synthetic-first-owner');expect(page.props.roles).toContain('client');expect(page.props.permissions).toContain('manage-roles');expect(page.props.matrix).toBeDefined();
});
it('denies a downgraded owner on the next authenticated request',async()=>{
 auth('synthetic-owner');await Page({params:Promise.resolve({locale:'ko'})});await upsertUserRole({username:'synthetic-owner',role:'admin',addedBy:'synthetic-first-owner'});vi.mocked(listUserRoles).mockClear();
 try{await expect(Page({params:Promise.resolve({locale:'ko'})})).rejects.toMatchObject({digest:'NEXT_HTTP_ERROR_FALLBACK;404'});expect(listUserRoles).not.toHaveBeenCalled();}
 finally{await upsertUserRole({username:'synthetic-owner',role:'owner',addedBy:'synthetic-first-owner'});}
});
it('keeps real CSRF-valid mutation denials and role records unchanged',async()=>{
 const before=await listUserRoles();auth('synthetic-client');const req=(method:string,body?:unknown)=>new NextRequest('http://localhost/api/builder/security/users/synthetic-client',{method,headers:fixture.headers,...(body?{body:JSON.stringify(body)}:{})});
 const post=req('POST',{username:'synthetic-proposed',role:'owner'});const patch=req('PATCH',{role:'owner'});const del=req('DELETE');for(const request of [post,patch,del])expect(validateCsrf(request)).toBeNull();
 const responses=[await POST(post),await PATCH(patch,{params:Promise.resolve({username:'synthetic-client'})}),await DELETE(del,{params:Promise.resolve({username:'synthetic-client'})})];for(const response of responses){expect(response.status).toBe(403);expect((await response.json()).error).toBe('Missing permission: manage-roles');}
 expect(await listUserRoles()).toEqual(before);expect(fixture.audit).not.toHaveBeenCalled();
});
