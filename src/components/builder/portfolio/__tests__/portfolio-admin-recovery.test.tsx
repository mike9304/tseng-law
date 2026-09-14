import { act, isValidElement, type ComponentProps, type ReactNode, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import Client from '../PortfolioAdminClient';
type Props = ComponentProps<typeof Client>;
type Control = { children?: ReactNode; onClick?: () => void; onSubmit?: (event: { preventDefault: () => void }) => void; onChange?: (event: { target: { value: string } }) => void; [key: string]: unknown };
const project: Props['initialProjects'][number] = { projectId:'p1',slug:'one',title:'Existing',summary:'Summary',description:'',body:'',category:'company-setup',completedAt:'2026-01-01',tags:[],locale:'en',status:'published',featured:false,order:0,gallery:[],createdAt:'2026-01-01',updatedAt:'2026-01-01' };
const roots = new Set<Root>(); const fetchMock = vi.fn<typeof fetch>();
function deferred<T>() { let resolve!: (value:T)=>void; const promise=new Promise<T>(yes=>{resolve=yes;});return {promise,resolve}; }
const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status});
function find(tree:ReactNode,predicate:(e:ReactElement<Control>)=>boolean):ReactElement<Control>|undefined {
 if(Array.isArray(tree)){ for(const child of tree){const result=find(child,predicate);if(result)return result;} }
 else if(isValidElement<Control>(tree)){if(predicate(tree))return tree;return find(tree.props.children,predicate);}return undefined;
}
// Real React lifecycle/hooks; Probe returns null, captured JSX is inspected/SSR rendered.
// Does not emulate browser fieldset disabling, pointer hit testing or host DOM mounting.
async function mount(locale:Props['locale']='en') {
 const document={activeElement:null,addEventListener:vi.fn(),removeEventListener:vi.fn(),documentElement:{namespaceURI:'http://www.w3.org/1999/xhtml'},nodeType:9};
 const container={nodeType:1,nodeName:'DIV',tagName:'DIV',namespaceURI:'http://www.w3.org/1999/xhtml',ownerDocument:document,textContent:'',addEventListener:vi.fn(),removeEventListener:vi.fn(),appendChild:vi.fn(),removeChild:vi.fn()};
 vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT',true);vi.stubGlobal('document',document);vi.stubGlobal('window',{HTMLIFrameElement:function HTMLIFrameElement(){}});
 let tree:ReactNode;let renders=0;
 function Probe(){renders++;tree=Client({locale,siteTitle:'Synthetic',initialProjects:[project],categories:[{id:'company-setup',name:{ko:'회사',en:'Company','zh-hant':'公司'}}]});return null;}
 const root=createRoot(container as unknown as Element);roots.add(root);await act(async()=>root.render(<Probe/>));
 const control=(predicate:(e:ReactElement<Control>)=>boolean)=>{const result=find(tree,predicate);if(!result)throw new Error('Missing control');return result.props;};
 return {html:()=>renderToStaticMarkup(tree), control, renders:()=>renders,
 submit:()=>control(e=>e.type==='form').onSubmit?.({preventDefault:vi.fn()}),
 title:(value:string)=>control(e=>e.type==='input'&&e.props.required===true).onChange?.({target:{value}}),
 button:(label:string)=>control(e=>e.type==='button'&&e.props.children===label),
 retry:()=>control(e=>e.props['data-portfolio-refresh']==='true').onClick?.(),
 fresh:()=>control(e=>e.props['data-portfolio-admin-new-draft']==='true').onClick?.(),
 unmount:async()=>{await act(async()=>root.unmount());roots.delete(root);},};
}
beforeEach(()=>{fetchMock.mockReset();vi.stubGlobal('fetch',fetchMock);});
afterEach(async()=>{for(const root of roots)await act(async()=>root.unmount());roots.clear();vi.unstubAllGlobals();});

it('keeps acknowledged save distinct from failed refresh and retries GET only',async()=>{
 fetchMock.mockResolvedValueOnce(reply({ok:true,project:{...project,title:'Created'}} ,201)).mockResolvedValueOnce(reply({ok:false},500));
 const s=await mount();await act(async()=>{s.title('Entered');});await act(async()=>{s.submit();});
 expect(s.html()).toContain('Saved.');expect(s.html()).toContain('Unable to refresh');expect(s.html()).toContain('value="Created"');
 fetchMock.mockResolvedValueOnce(reply({ok:true,projects:[project]}));await act(async()=>{s.retry();});
 expect(fetchMock.mock.calls.map(c=>c[1]?.method??'GET')).toEqual(['POST','GET','GET']);expect(s.html()).not.toContain('Unable to refresh');
});
it('retains ambiguous POST draft through GET and edits, then explicit new task permits a new POST',async()=>{
 fetchMock.mockResolvedValueOnce(new Response('{',{status:201}));const s=await mount();await act(async()=>s.title('Entered'));
 await act(async()=>s.submit());expect(s.html()).toContain('Confirm the server');expect(s.html()).toContain('value="Entered"');
 await act(async()=>s.title('Changed'));await act(async()=>s.submit());expect(fetchMock).toHaveBeenCalledTimes(1);
 fetchMock.mockResolvedValueOnce(reply({ok:true,projects:[]}));await act(async()=>s.retry());expect(s.html()).toContain('Confirm the server');
 await act(async()=>s.submit());expect(fetchMock).toHaveBeenCalledTimes(2);
 await act(async()=>s.fresh());expect(s.html()).not.toContain('Confirm the server');
 fetchMock.mockResolvedValueOnce(reply({ok:true,project},201)).mockResolvedValueOnce(reply({ok:true,projects:[project]}));await act(async()=>s.submit());
 expect(fetchMock.mock.calls.map(c=>c[1]?.method??'GET')).toEqual(['POST','GET','POST','GET']);
});
it('explicit existing selection starts a PATCH task after unknown, without auto matching',async()=>{
 fetchMock.mockResolvedValueOnce(reply({ok:false},500));const s=await mount();await act(async()=>s.submit());
 expect(s.html()).toContain('Confirm the server');await act(async()=>s.button('Edit').onClick?.());expect(s.html()).not.toContain('Confirm the server');
 fetchMock.mockResolvedValueOnce(reply({ok:true,project})).mockResolvedValueOnce(reply({ok:true,projects:[project]}));await act(async()=>s.submit());
 expect(fetchMock.mock.calls[1][1]?.method).toBe('PATCH');
});
it('freezes draft/new/edit/write controls and synchronously suppresses duplicate dispatch',async()=>{
 const pending=deferred<Response>();fetchMock.mockReturnValueOnce(pending.promise);const s=await mount();
 await act(async()=>{s.submit();s.submit();});expect(fetchMock).toHaveBeenCalledTimes(1);
 expect(s.control(e=>e.type==='input'&&e.props.required===true).disabled).toBe(true);
 expect(s.button('Edit').disabled).toBe(true);expect(s.control(e=>e.props['data-portfolio-admin-new-draft']==='true').disabled).toBe(true);
 await act(async()=>{s.fresh();s.button('Edit').onClick?.();});
 await act(async()=>pending.resolve(reply({ok:false},500)));expect(s.html()).toContain('Confirm the server');expect(s.button('Edit').disabled).toBe(false);
});
it('acknowledges deletion before refresh failure and does not repeat DELETE',async()=>{
 fetchMock.mockResolvedValueOnce(reply({ok:true})).mockResolvedValueOnce(reply({ok:false},500));const s=await mount();await act(async()=>s.button('Edit').onClick?.());
 await act(async()=>s.button('Delete').onClick?.());expect(s.html()).toContain('Deleted.');expect(s.html()).toContain('Unable to refresh');expect(s.html()).not.toContain('data-portfolio-admin-project="p1"');
 fetchMock.mockResolvedValueOnce(reply({ok:true,projects:[]}));await act(async()=>s.retry());expect(fetchMock.mock.calls.map(c=>c[1]?.method??'GET')).toEqual(['DELETE','GET','GET']);
});
it('rejects malformed successful DELETE envelope without clearing selected draft',async()=>{
 fetchMock.mockResolvedValueOnce(reply({}));const s=await mount();await act(async()=>s.button('Edit').onClick?.());await act(async()=>s.button('Delete').onClick?.());
 expect(s.html()).toContain('Confirm the server');expect(s.html()).toContain('value="Existing"');expect(fetchMock).toHaveBeenCalledTimes(1);
});
it.each([['en','Confirm the server'],['ko','서버 처리 결과'],['zh-hant','確認伺服器']] as const)('handles rejected mutation in %s without stuck busy',async(locale,label)=>{
 fetchMock.mockRejectedValueOnce(new Error('synthetic failure'));const s=await mount(locale);await act(async()=>s.title('Retained'));await act(async()=>s.submit());expect(s.html()).toContain(label);expect(s.html()).toContain('value="Retained"');expect(s.control(e=>e.type==='input'&&e.props.required===true).disabled).toBe(false);
});
it('does not start follow-up GET or render after unmount',async()=>{
 const pending=deferred<Response>();fetchMock.mockReturnValueOnce(pending.promise);const s=await mount();await act(async()=>s.submit());await s.unmount();const count=s.renders();await act(async()=>pending.resolve(reply({ok:true,project},201)));expect(s.renders()).toBe(count);expect(fetchMock).toHaveBeenCalledTimes(1);
});

it('keeps unknown and server error on failed GET retry, without any write replay',async()=>{
 fetchMock.mockResolvedValueOnce(reply({ok:false,error:'Check the supplied title.'},400));const s=await mount();await act(async()=>s.submit());
 expect(s.html()).toContain('Check the supplied title.');fetchMock.mockResolvedValueOnce(new Response('{',{status:200}));await act(async()=>s.retry());
 expect(s.html()).toContain('Confirm the server');expect(s.html()).toContain('Unable to refresh');expect(fetchMock.mock.calls.map(c=>c[1]?.method??'GET')).toEqual(['POST','GET']);
});
it('does not acknowledge a PATCH response for another project',async()=>{
 fetchMock.mockResolvedValueOnce(reply({ok:true,project:{...project,projectId:'other'}}));const s=await mount();await act(async()=>s.button('Edit').onClick?.());await act(async()=>s.submit());expect(s.html()).toContain('Confirm the server');expect(s.html()).toContain('value="Existing"');expect(fetchMock).toHaveBeenCalledTimes(1);
});
