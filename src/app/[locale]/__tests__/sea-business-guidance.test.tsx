import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { seaBusinessContent } from '@/data/sea-business-guidance';
import { PUBLIC_LOCALES_8, resolveGuidanceMiddlewareRewrite, resolvePublicLanguageSwitchTarget } from '@/lib/public-guidance';
import SeaBusinessLanding, { seaBusinessMetadata } from '@/components/SeaBusinessLanding';
import SeaBusinessLinks from '@/components/SeaBusinessLinks';
import CompanyPage, { generateStaticParams as companyParams } from '../company-setup/page';
import DebtPage, { generateStaticParams as debtParams } from '../debt-collection/page';
vi.mock('next/navigation', () => ({ notFound: () => { throw Error('NOT_FOUND'); } }));
vi.mock('@/lib/columns', () => ({ getAllColumnPosts: () => [
  {slug:'taiwan-company-establishment-basics',title:'Existing native column'},
] }));
const langs=['vi','id','th','fil'] as const,keys=['company-setup','debt-collection'] as const;

describe('SEA business guidance availability and SEO',()=>{
 it('generates exactly eight language/page combinations',()=>{
  expect(companyParams()).toEqual([{locale:'vi'},{locale:'id'},{locale:'th'},{locale:'fil'}]);
  expect(debtParams()).toEqual(companyParams());
 });
 it.each(langs)('%s: renders native copy and reciprocal four-language metadata',async locale=>{
  for(const key of keys){
   const page=seaBusinessContent[locale][key],meta=await seaBusinessMetadata(locale,key);
   expect(meta.alternates?.canonical).toBe(`https://tseng-law.com/${locale}/${key}`);
   expect(meta.alternates?.languages).toEqual({
    vi:`https://tseng-law.com/vi/${key}`,id:`https://tseng-law.com/id/${key}`,
    th:`https://tseng-law.com/th/${key}`,fil:`https://tseng-law.com/fil/${key}`,'x-default':`https://tseng-law.com/vi/${key}`,
   });
   expect(meta.robots).toMatchObject({index:true,follow:true});
   const html=renderToStaticMarkup(<SeaBusinessLanding locale={locale} pageKey={key}/>);
   expect(html).toContain(`lang="${locale}"`);expect(html).toContain(page.intro);
   expect(html).toContain(`href="/${locale}/contact"`);expect(html).toContain(`href="/${locale}/pricing"`);
   expect(html).toContain(key==='company-setup'?'href="/en/taiwan-company-setup-lawyer"':'href="/en/taiwan-litigation-lawyer"');
   expect(html).toContain('BreadcrumbList');expect(html).toContain('LegalService');
   expect(html).not.toContain('"author":');expect(html).not.toMatch(/<(?:strong|b)(?:\s|>)/);
   if(key==='company-setup')expect(html).toContain(`href="/${locale}/columns/taiwan-company-establishment-basics"`);
   else expect(html).not.toContain(`href="/${locale}/columns/taiwan-unpaid-invoice-debt-collection"`);
   const route=key==='company-setup'?CompanyPage:DebtPage;
   expect(renderToStaticMarkup(await route({params:Promise.resolve({locale})}))).toBe(html);
  }
 });
 it('rejects all other 45 locales instead of falling back to Korean or inventing editions',async()=>{
  for(const locale of PUBLIC_LOCALES_8.filter(l=>!(langs as readonly string[]).includes(l)))for(const key of keys){
   await expect(seaBusinessMetadata(locale,key)).rejects.toThrow('NOT_FOUND');
   expect(()=>SeaBusinessLanding({locale,pageKey:key})).toThrow('NOT_FOUND');
   expect(renderToStaticMarkup(<SeaBusinessLinks locale={locale}/>)).toBe('');
  }
 });
 it('lets only the exact eight file routes pass the guidance rewrite guard',()=>{
  for(const locale of langs)for(const key of keys)expect(resolveGuidanceMiddlewareRewrite(`/${locale}/${key}`)).toBeNull();
  for(const locale of ['ar','de','zh-hans','ms'])for(const key of keys)expect(resolveGuidanceMiddlewareRewrite(`/${locale}/${key}`)).toMatchObject({allowed:false});
  expect(resolveGuidanceMiddlewareRewrite('/vi/company-setup/nested')).toMatchObject({allowed:false});
 });
 it('never creates fake business-page links when switching to any of the 49 languages',()=>{
  for(const source of langs)for(const key of keys)for(const target of PUBLIC_LOCALES_8){
   const supported=(langs as readonly string[]).includes(target);
   expect(resolvePublicLanguageSwitchTarget(`/${source}/${key}`,target)).toEqual({
    status:'available',href:supported?`/${target}/${key}`:`/${target}`,fallback:supported?'exact':'home',
   });
  }
 });
 it.each(langs)('%s: gives discovery links real hrefs',locale=>{
  const html=renderToStaticMarkup(<SeaBusinessLinks locale={locale}/>);
  for(const key of keys)expect(html).toContain(`href="/${locale}/${key}"`);
 });
});
