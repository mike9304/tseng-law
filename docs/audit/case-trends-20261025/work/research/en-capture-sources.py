from pathlib import Path
import urllib.request,urllib.parse,json,subprocess,hashlib,time
out=Path('/Users/son7/tseng-case-trends-20261025/work/research/en-captures');out.mkdir(exist_ok=True)
urls={
'arbitration-110-1563-official.pdf':'https://tps.judicial.gov.tw/tw/dl-86883-af1050e40dca4f7b8233651a305fca3e.html',
'noncompete-114-2211-official.html':'https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=TPSV%2C114%2C%E5%8F%B0%E4%B8%8A%2C2211%2C20260416%2C1',
'noncompete-114-241-official.html':'https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=TCDV%2C114%2C%E5%8B%9E%E8%A8%B4%2C241%2C20260828%2C2',
'judgment-100-42-official.html':'https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=TPSV%2C100%2C%E5%8F%B0%E4%B8%8A%2C42%2C20110113',
}
cache={};results=[]
for name,url in urls.items():
 host=urllib.parse.urlparse(url).hostname
 try:
  if host not in cache:
   q='https://1.1.1.1/dns-query?'+urllib.parse.urlencode({'name':host,'type':'A'})
   req=urllib.request.Request(q,headers={'accept':'application/dns-json'})
   data=json.load(urllib.request.urlopen(req,timeout=20)); cache[host]=next(x['data'] for x in data.get('Answer',[]) if x['type']==1)
  p=out/name
  r=subprocess.run(['curl','--silent','--show-error','--location','--max-time','45','--resolve',f'{host}:443:{cache[host]}','--output',str(p),'--write-out','%{http_code}\t%{content_type}',url],capture_output=True,text=True)
  b=p.read_bytes() if p.exists() else b''
  row={'name':name,'url':url,'transport':r.stdout,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'exit':r.returncode,'error':r.stderr,'retrieved':'2026-10-25'}
 except Exception as e:row={'name':name,'url':url,'error':str(e)}
 results.append(row);print(json.dumps(row,ensure_ascii=False),flush=True)
(out/'capture-log.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
