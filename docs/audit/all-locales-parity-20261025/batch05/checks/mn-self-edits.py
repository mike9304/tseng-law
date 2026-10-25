from pathlib import Path
from datetime import datetime,timezone
import hashlib,json
b=Path('/Users/son7/tseng-all-language-columns-20261025/batch05');root=b/'src/content/columns-mn';h=lambda s:hashlib.sha256(s.encode()).hexdigest()
changes={
'704':[
('Цахим хүсэлт үү, оршин суугаа газрын севисийн төв үү','Цахим хүсэлт үү, оршин суугаа газрын үйлчилгээний төв үү','Correct the misspelt loan word to the normal Mongolian term for service center; same filing location.'),
('Хугацаанд нь нөхөөгүй эсвэл дутуу нөхсөн бол хүсэлтийг татгалзана.','Хугацаанд нь нөхөөгүй эсвэл дутуу нөхсөн бол хүсэлтээс татгалзана.','Correct the case governed by татгалзах; retain the rejection consequence for late OR incomplete supplementation.'),
('Гэр бүлийн гишүүн бүр өөрийн оршин суух зөвшөөрлийн маргаашаас тоолно.','Гэр бүлийн гишүүн бүрийн хугацааг NIA түүнд оршин суух зөвшөөрөл олгосон өдрийн маргаашаас тоолно.','Name the family member’s own NIA residence approval date explicitly; not work approval or the sponsor’s date.'),
('Ажлын үндэслэлд холбогдох ажлын зөвшөөрөл болон сүүлийн нэг сарын дотор олгосон ажил эрхэлж буй тодорхойлолт хамаарна. Зөвшөөрлөөс чөлөөлөгдсөн бол тэр үндэслэлд тохирох баримт үзүүлнэ. Сургуульд хараахан бүртгүүлээгүй хүн элсэх эрхийн бичиг, бүртгүүлсэн хүн NIA-ийн шаардлагад нийцсэн сүүлийн нэг сарын суралцаж буй нотолгоо өгнө. Гэр бүлийн хүсэлтэд харилцааг нотлох гэрлэлт, төрсний баримт болон түшиглэж буй гэр бүлийн гишүүний биеийн байцаалт эсвэл оршин суух баримт шаардлагатай.',
'Ажлын үндэслэлд холбогдох ажлын зөвшөөрөл болон сүүлийн нэг сарын дотор олгосон ажил эрхэлж буй тодорхойлолт хамаарна. Зөвшөөрлөөс чөлөөлөгдсөн бол тэр үндэслэлд тохирох баримт үзүүлнэ.\n\nСургуульд хараахан бүртгүүлээгүй хүн элсэх эрхийн бичиг өгнө. Бүртгүүлсэн оюутны хувьд NIA-ийн жагсаалт сүүлийн нэг сарын суралцаж буй нотолгоог дурддаг бөгөөд одоогийн улирлын бүртгэл эсвэл оюутны үнэмлэхийг ч заасан.\n\nГэр бүлийн хүсэлтэд харилцаагаа нотлох тохирох баримт, тухайлбал гэрлэлтийн эсвэл төрсний гэрчилгээ, мөн түшиглэж буй гэр бүлийн гишүүний биеийн байцаалт эсвэл оршин суух баримт шаардлагатай.',
'Separate employment/school/family documents. Express school enrollment OR card without making all records mandatory, and relationship certificate examples as marriage OR birth as appropriate; keep one-month freshness and sponsor identity OR residence proof.')],
'705':[
(' Нийтлэлийг монголоор уншиж байгаа нь эдгээр мэдээллийг орлохгүй.','','Remove an unprompted editorial statement about reading language; the paragraph already names actual nationality, passport, residence and issuing place.' )],
'706':[
('Өөрчлөлт гарсан өдөр картаас эрт хугацаа үүсгэж болно.','Өөрчлөлт гарснаар картын хугацаа дуусахаас өмнө хүсэлт гаргах үүрэг үүсэж болно.','Replace an unclear comparison with the card by the concrete possibility of a filing obligation before card expiry.'),
(' Энэ нь аяллын үргэлжлэх хугацааг тоолж буй хэрэг биш.','','Remove an unnecessary rebuttal about ordinary travel after the exact temporary-stay plus residence limit is already stated; keep max six-month extension and generally two-year combined limit.'),
('Тайваньд бизнесээ үргэлжлүүлэн эрхэлж, шаардлага хангасан хүний [бизнес эрхлэгчийн ARC сунгалт](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/348924/) хугацаа дуусахаас өмнөх дөрвөн сарын дотор нээгдэнэ.','Тайваньд бизнесээ үргэлжлүүлэн эрхэлж, шаардлага хангасан хүний [бизнес эрхлэгчийн ARC сунгалтын хүсэлтийг](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/348924/) хугацаа дуусахаас өмнөх дөрвөн сарын дотор гаргаж болно.','State the permitted filing window directly instead of saying the extension opens sometime during it; keep continuing Taiwan business and qualification conditions.'),
('Нэг удаа нэмж хүсэж, нийт хамгийн ихдээ нэг жил хүргэж болно.','Сунгасан хугацаа дуусахаас өмнө нэг удаа нэмж хүсэж, нийт хамгийн ихдээ нэг жил хүргэж болно.','Clarify that the further professional extension is also applied for before the extended term expires; keep once and total max one year.'),
('Дахин нэг удаа сунгаж, нийт хамгийн ихдээ хоёр жил болгох боломжтой.','Сунгасан хугацаа дуусахаас өмнө дахин нэг удаа хүсэлт гаргаж, нийт хамгийн ихдээ хоёр жил болгох боломжтой.','Clarify the graduate further-extension filing timing, not a pre-expiry approval-completion requirement; keep one extra and total max two years.'),
(' Тодорхойгүй байхад зөвхөн хуулбараар нисэж, нэвтэрч чадна гэж найдахгүй.','','Remove an unprompted airline/photocopy warning after the concrete NIA/mission inquiry with passport, ARC copy if available and return date; no return-entry entitlement is created.')]
}
records=[]
for pre,edits in changes.items():
 p=next(root.glob(pre+'-*.md'));old=p.read_text();t=old;rows=[]
 for i,(a,z,why) in enumerate(edits,1):
  assert t.count(a)==1,(pre,i,t.count(a));off=t.index(a);before=h(t);t=t[:off]+z+t[off+len(a):]
  rows.append({'id':f'{pre}-E{i:02d}','offset':off,'before':a,'after':z,'reason':why,'beforeSHA256':before,'afterSHA256':h(t)})
 inverse=t
 for x in reversed(rows):
  off=x['offset'];assert inverse[off:off+len(x['after'])]==x['after'];inverse=inverse[:off]+x['before']+inverse[off+len(x['after']):]
  assert h(inverse)==x['beforeSHA256']
 assert inverse==old;p.write_text(t);records.append({'file':str(p),'beforeSHA256':h(old),'afterSHA256':h(t),'exactReverseToInitial':True,'edits':rows})
(b/'checks/mn-self-edits.json').write_text(json.dumps({'atUTC':datetime.now(timezone.utc).isoformat(),'records':records},ensure_ascii=False,indent=2)+'\n')
for x in records:print(Path(x['file']).name,len(x['edits']),x['afterSHA256'])
