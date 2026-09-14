import { beforeAll,beforeEach,afterAll,it,expect,vi } from 'vitest';
import { isValidElement,type ReactNode } from 'react';import { mkdtemp,rm } from 'fs/promises';import path from 'path';import os from 'os';
import { __setUserRoleStorageRootForTests,__resetUserRoleStorageRootForTests,upsertUserRole } from '@/lib/builder/security/user-role-store';
import { userHasPermission } from '@/lib/builder/security/resolve-permission';
import List from '../page';import Detail from '../[webhookId]/page';
const data=vi.hoisted(()=>({headers:new Headers(),list:vi.fn(),get:vi.fn(),deliveries:vi.fn(),subscription:{webhookId:'synthetic-hook',url:'https://receiver.example.invalid/path',events:['form.submitted'],secret:'SYNTHETICKEY-SUFFIX',active:true,createdAt:'2026-01-01',updatedAt:'2026-01-01'},delivery:{deliveryId:'synthetic-delivery',webhookId:'synthetic-hook',event:'form.submitted',payload:{message:'SYNTHETIC PRIVATE BODY'},status:'failed',attempts:1,responseSnippet:'SYNTHETIC RESPONSE',createdAt:'2026-01-01'}}));
// No guard/auth/role-result mocks: framework request context and data only.
vi.mock('next/headers',()=>({headers:async()=>data.headers}));
vi.mock('@/lib/builder/webhooks/storage',()=>({listSubscriptions:data.list,getSubscription:data.get,listDeliveriesForWebhook:data.deliveries}));
vi.mock('@/components/builder/webhooks/WebhooksAdmin',()=>({default:()=>null}));vi.mock('@/components/builder/webhooks/WebhookDeliveriesView',()=>({default:()=>null}));
let root:string;
function auth(name:string){data.headers=new Headers({authorization:'Basic '+Buffer.from(name+':synthetic-pass').toString('base64')});}
beforeAll(async()=>{root=await mkdtemp(path.join(os.tmpdir(),'fn32-page-role-'));__setUserRoleStorageRootForTests(root);vi.stubEnv('CMS_ADMIN_USERNAME','synthetic-owner');vi.stubEnv('CMS_ADMIN_PASSWORD','synthetic-pass');vi.stubEnv('BUILDER_BASIC_AUTH_USERS',JSON.stringify(['editor','client','admin'].map(role=>({username:'synthetic-'+role,password:'synthetic-pass'}))));for(const role of ['editor','client','admin'] as const)await upsertUserRole({username:'synthetic-'+role,role,addedBy:'synthetic-owner'});vi.stubGlobal('fetch',vi.fn(()=>{throw new Error('Unexpected provider/network');}));});
beforeEach(()=>{data.headers=new Headers();data.list.mockReset().mockResolvedValue([data.subscription]);data.get.mockReset().mockResolvedValue(data.subscription);data.deliveries.mockReset().mockResolvedValue(Array.from({length:205},(_,i)=>({...data.delivery,deliveryId:'synthetic-'+i})));});
afterAll(async()=>{__resetUserRoleStorageRootForTests();vi.unstubAllEnvs();vi.unstubAllGlobals();await rm(root,{recursive:true,force:true});});
function props(tree:ReactNode,key:string):Record<string,unknown>|undefined{if(Array.isArray(tree)){for(const child of tree){const found=props(child,key);if(found)return found;}}else if(isValidElement<Record<string,unknown>>(tree)){if(key in tree.props)return tree.props;return props(tree.props.children as ReactNode,key);}return undefined;}
const calls=[['list',()=>List({params:Promise.resolve({locale:'ko'})})],['detail',()=>Detail({params:Promise.resolve({locale:'ko',webhookId:'synthetic-hook'})})]] as const;
function noLoads(){expect(data.list).not.toHaveBeenCalled();expect(data.get).not.toHaveBeenCalled();expect(data.deliveries).not.toHaveBeenCalled();}
for(const role of ['editor','client','anonymous']){
 it.each(calls)(`denies ${role} %s before all privileged storage`,async(_name,call)=>{if(role!=='anonymous'){auth('synthetic-'+role);expect(await userHasPermission('synthetic-'+role,'settings')).toBe(false);}await expect(call()).rejects.toMatchObject({digest:'NEXT_HTTP_ERROR_FALLBACK;404'});noLoads();});
}
it.each(['owner','admin'])('allows %s list/detail and preserves mask, locale and cap200',async(role)=>{
 auth('synthetic-'+role);expect(await userHasPermission('synthetic-'+role,'settings')).toBe(true);const list=await List({params:Promise.resolve({locale:'zh-hant'})});const p=props(list,'initialSubscriptions');const rows=p?.initialSubscriptions as Array<Record<string,unknown>>;expect(p?.locale).toBe('zh-hant');expect(rows[0].secret).toBe(data.subscription.secret.slice(0,12)+'…');expect(rows[0].secret).not.toBe(data.subscription.secret);expect(rows[0].url).toBe(data.subscription.url);
 const detail=await Detail({params:Promise.resolve({locale:'en',webhookId:'synthetic-hook'})});expect(detail.props.locale).toBe('en');expect(detail.props.initialDeliveries).toHaveLength(200);expect(detail.props.initialDeliveries[0].payload).toEqual(data.delivery.payload);expect(detail.props.webhookUrl).toBe(data.subscription.url);
});
it.each(calls)('rechecks downgraded admin for %s next request',async(_name,call)=>{
 auth('synthetic-admin');await call();await upsertUserRole({username:'synthetic-admin',role:'editor',addedBy:'synthetic-owner'});data.list.mockClear();data.get.mockClear();data.deliveries.mockClear();
 try{await expect(call()).rejects.toMatchObject({digest:'NEXT_HTTP_ERROR_FALLBACK;404'});noLoads();}finally{await upsertUserRole({username:'synthetic-admin',role:'admin',addedBy:'synthetic-owner'});}
});
it('allowed missing detail returns404 without querying deliveries',async()=>{auth('synthetic-owner');data.get.mockResolvedValueOnce(null);await expect(calls[1][1]()).rejects.toMatchObject({digest:'NEXT_HTTP_ERROR_FALLBACK;404'});expect(data.get).toHaveBeenCalledWith('synthetic-hook');expect(data.deliveries).not.toHaveBeenCalled();});
