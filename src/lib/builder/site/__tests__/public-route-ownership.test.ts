import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { PUBLIC_FILE_ROUTES, isBuilderOwnedSlug, hasNativeDescendant } from '../public-route-ownership';
describe('current file route ownership',()=>{
 it('catalog exactly covers locale page/route source with route groups removed',()=>{
  const found:string[]=[];
  function walk(dir:string, segments:string[]){for(const item of readdirSync(dir,{withFileTypes:true})){
   if(item.isDirectory())walk(path.join(dir,item.name),[...segments,item.name]);
   else if(/^(page|route)\.tsx?$/.test(item.name)){
    const url=segments.filter(s=>!s.startsWith('(')).join('/');
    if(url.startsWith('[locale]/'))found.push('/'+url.slice('[locale]/'.length).replace(/%5F/gi,'_'));
   }
  }}
  walk(path.join(process.cwd(),'src/app'),[]);
  expect([...PUBLIC_FILE_ROUTES].sort()).toEqual([...new Set(found)].sort());
 });
 it.each(['search','account','reset-password','p','p/a','services/item','columns/item','guides/taiwan-company-setup','store/products/item'])('native %s',slug=>expect(isBuilderOwnedSlug('ko',slug)).toBe(false));
 it.each(['','faq','videos','columns','services','guides','search/help','columns/item/deeper','services/item/deeper'])('builder %s',slug=>expect(isBuilderOwnedSlug('ko',slug)).toBe(true));
 it('wildcard overlap is structural with segment boundaries',()=>{
  expect(hasNativeDescendant('guides')).toBe(true);expect(hasNativeDescendant('services')).toBe(true);
  expect(hasNativeDescendant('search')).toBe(false);expect(hasNativeDescendant('guide')).toBe(false);
  expect(hasNativeDescendant('services/item')).toBe(false);expect(hasNativeDescendant('p/deep')).toBe(true);
 });
});

const deployedNativeCases = [
  ['admin-builder/semiconductor-preview', 'admin-builder/semiconductor-preview/help'],
  ['admin-builder/semiconductor-preview/columns/example', 'admin-builder/semiconductor-preview/columns/example/more'],
  ['ai-intake', 'ai-intake/help'],
  ['design-preview/semiconductor', 'design-preview/semiconductor/help'],
  ['design-preview/semiconductor/columns/example', 'design-preview/semiconductor/columns/example/more'],
  ['llms.txt', 'llms.txt/help'],
  ['semiconductor', 'semiconductor/help'],
  ['taiwan-debt-recovery-lawyer', 'taiwan-debt-recovery-lawyer/help'],
  ['taiwan-semiconductor-supplier-legal', 'taiwan-semiconductor-supplier-legal/help'],
] as const;

it.each(deployedNativeCases)('protects deployed native %s while preserving deeper catch-all %s', (nativeSlug, deeperSlug) => {
  for (const locale of ['ko', 'en', 'zh-hant']) {
    expect(isBuilderOwnedSlug(locale, nativeSlug)).toBe(false);
    expect(isBuilderOwnedSlug(locale, deeperSlug)).toBe(true);
  }
});

it.each(['ja', 'ar', 'is'])('does not expand builder authoring to public locale %s', (locale) => {
  expect(isBuilderOwnedSlug(locale, 'safe-page')).toBe(false);
});

it('retains the staged recovery reservation at exact depth', () => {
  expect(isBuilderOwnedSlug('ko', 'reset-password')).toBe(false);
  expect(isBuilderOwnedSlug('ko', 'reset-password/help')).toBe(true);
});
