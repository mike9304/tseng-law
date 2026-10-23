import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const root='/Users/son7/tseng-arc-visas-20261024';
const repo=path.join(root,'repo');
const require=createRequire(path.join(repo,'package.json'));
const React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const matter=require('gray-matter');
const {default:ReactMarkdown}=await import(pathToFileURL(require.resolve('react-markdown')).href);
const {default:remarkGfm}=await import(pathToFileURL(require.resolve('remark-gfm')).href);
const audit=JSON.parse(fs.readFileSync(path.join(root,'work/checks/content-audit.json'),'utf8'));
const names={ko:'한국어',en:'English',ja:'日本語',vi:'Tiếng Việt','zh-hant':'繁體中文',th:'ไทย',id:'Bahasa Indonesia',hi:'हिन्दी',fr:'Français',de:'Deutsch',it:'Italiano',es:'Español',pt:'Português',ar:'العربية'};
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const css=':root{color-scheme:light}body{margin:0;background:#f5f3ef;color:#242b2a;font:17px/1.85 system-ui,sans-serif}main{max-width:860px;margin:40px auto;padding:32px 44px;background:white;border:1px solid #ddd8cf;border-radius:10px}h1{font-size:2rem;line-height:1.4}h2{margin-top:2em;font-size:1.4rem}a{color:#245f65;overflow-wrap:anywhere}p,li{overflow-wrap:anywhere}table{border-collapse:collapse;font-size:.94rem;width:100%}td,th{border:1px solid #d9d9d3;padding:10px;text-align:start;vertical-align:top}th{background:#f3f4ef}.notice{font-size:14px;color:#695d49;border-bottom:1px solid #ddd8cf;padding-bottom:16px}.summary{color:#59615b}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 32px}.grid section{min-width:0}@media(max-width:640px){main{margin:0;padding:22px 18px;border:0;border-radius:0}.grid{display:block}h1{font-size:1.6rem}table{font-size:.85rem}}';
const shell=(lang,title,body)=>'<!doctype html><html lang="'+esc(lang)+'" dir="'+(lang==='ar'?'rtl':'ltr')+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>'+esc(title)+'</title><style>'+css+'</style></head><body><main>'+body+'</main></body></html>';
const out=path.join(root,'outputs/preview');
fs.mkdirSync(out,{recursive:true});
const grouped=new Map();
const previewPaths=new Map(audit.articles.map(article=>[article.route,`${article.locale}-${article.file.replace(/\.md$/,'.html')}`]));
for(const article of audit.articles){
 const {data,content}=matter(fs.readFileSync(path.join(repo,article.path),'utf8'));
 const file=`${article.locale}-${article.file.replace(/\.md$/,'.html')}`;
 const rendered=renderToStaticMarkup(React.createElement(ReactMarkdown,{children:content,remarkPlugins:[remarkGfm],components:{a:({href,children})=>React.createElement('a',{href:previewPaths.get(href)??(href?.startsWith('/')?'https://tseng-law.com'+href:href)},children)}}));
 const faqs=(data.faq??[]).map(item=>`<details><summary>${esc(item.q)}</summary><p>${esc(item.a)}</p></details>`).join('');
 const body='<nav class="notice"><a href="index.html">42편 목록</a> · 미게시 원고 미리보기 · 실제 사이트 화면 검증과 별개</nav><h1>'+esc(data.title)+'</h1><p class="summary">'+esc(data.summary)+'</p>'+rendered+'<h2>FAQ</h2>'+faqs;
 fs.writeFileSync(path.join(out,file),shell(article.locale,data.title,body));
 const list=grouped.get(article.locale)??[]; list.push({file,title:data.title});grouped.set(article.locale,list);
}
const items=[...grouped].map(([locale,rows])=>'<section><h2>'+esc(names[locale])+'</h2><ol>'+rows.map(x=>'<li><a href="'+x.file+'" lang="'+locale+'">'+esc(x.title)+'</a></li>').join('')+'</ol></section>').join('');
fs.writeFileSync(path.join(out,'index.html'),shell('ko','대만 ARC·비자 다국어 칼럼 42편','<p class="notice">미게시 원고 미리보기 · tseng-law.com</p><h1>대만 ARC·비자 안내</h1><p>14개 언어로 첫 신청, 취업·유학·가족 체류 경로, 연장·변경·재입국을 각각 다룹니다. 이 파일은 원고를 읽기 위한 별도 미리보기입니다. 검수와 배포 상태는 결과 보고서에서 확인하세요.</p><div class="grid">'+items+'</div>'));
console.log(JSON.stringify({previewArticles:audit.articles.length,index:path.join(out,'index.html')}));
