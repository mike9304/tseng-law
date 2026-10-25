from pathlib import Path
import datetime, difflib, hashlib, json, re

b = Path('/Users/son7/tseng-all-language-columns-20261025/batch05')
root = b / 'src/content/columns-mn'
sha = lambda data: hashlib.sha256(data).hexdigest()
expected = {
 '704-taiwan-arc-first-application.md': 'b4132dc5c792f68709a71ba8ff81cf456312f0f58112639a153b985ed010aa1a',
 '705-taiwan-visa-residence-work-study-family.md': 'd54e05e91c9d6e9da6ee536009c01b9d44d34b0a78e74dbe07b2e294dde261ac',
 '706-taiwan-arc-renewal-changes-reentry.md': 'c104ac77d73fe5c4a3de64dc8578498523759428bf7fa81af4152f964c3d4864',
}
report = b / 'reviews/mn-independent.md'
assert sha(report.read_bytes()) == '59fcffbba5d4ce67e1267ee028b416c0651bf50bc656746f446a909a5d39b767'
changes = [
 {'id': 'M01', 'file': '706-taiwan-arc-renewal-changes-reentry.md',
  'before': 'Хүсэлт хүлээн авсан баримтыг шаардлагатай аяллын баримт орлоно гэж тооцож болохгүй.',
  'after': 'Хүсэлт хүлээн авсан баримт шаардлагатай аяллын баримтыг орлохгүй.',
  'reason': 'Correct accusative inversion: the application receipt does not replace required travel documents. The following FAQ conditions remain verbatim.'},
 {'id': 'S01', 'file': '704-taiwan-arc-first-application.md',
  'before': 'Бүртгүүлсэн оюутны хувьд NIA-ийн жагсаалт сүүлийн нэг сарын суралцаж буй нотолгоог дурддаг бөгөөд одоогийн улирлын бүртгэл эсвэл оюутны үнэмлэхийг ч заасан.',
  'after': 'Бүртгүүлсэн оюутан NIA-ийн жагсаалтад нийцсэн, сүүлийн нэг сарын дотор олгосон суралцаж буй нотолгоо өгнө.',
  'reason': 'Summarize qualifying current study evidence without implying cumulative documentation; retain post-registration status, preceding admission-letter alternative, and one-month recency.'},
 {'id': 'S02', 'file': '706-taiwan-arc-renewal-changes-reentry.md',
  'before': 'Сунгалт эсвэл карт дахин олгох ажиллагаа дуусаагүй байхад явах бол бодит аяллынхаа баримтыг NIA-аас урьдчилан тодруулна. Өргөдөл хүлээн авсан баримт аяллын баримтыг автоматаар орлохгүй. Гарах хүртэл шинэ карт бэлэн болохгүй бол буцахдаа ямар баримт ашиглахыг асуух хэрэгтэй.',
  'after': 'Сунгалт эсвэл карт дахин олгох ажиллагаа дуусаагүй байхад явах бол буцаж нэвтрэхэд хэрэгтэй баримтыг NIA-аас урьдчилан тодруулна. Өргөдөл хүлээн авсан баримт аяллын баримтыг автоматаар орлохгүй.',
  'reason': 'Merge duplicate travel-document inquiries while retaining unfinished renewal/reissue, inquiry before departure, reentry documents, and the receipt limitation. Adjacent F23 online procedure is unchanged.'},
]
out = b / 'checks/mn-independent-r1-edits.json'
assert not out.exists()
originals = {name: (root/name).read_bytes() for name in expected}
assert all(sha(data) == expected[name] for name, data in originals.items())
proposed = {name: data.decode('utf-8') for name, data in originals.items()}
for change in changes:
 text = proposed[change['file']]
 assert text.count(change['before']) == 1
 change['offsetBeforeSequentialEdit'] = text.index(change['before'])
 proposed[change['file']] = text.replace(change['before'], change['after'], 1)
records = []
for name, text in proposed.items():
 old = originals[name].decode('utf-8')
 restored = text
 for change in reversed(changes):
  if change['file'] == name:
   assert restored.count(change['after']) == 1
   restored = restored.replace(change['after'], change['before'], 1)
 assert restored.encode('utf-8') == originals[name]
 urls = lambda s: sorted(re.findall(r'https?://[^\s<>)\"]+', s))
 assert urls(old) == urls(text)
 records.append({'file': str(root/name), 'beforeSHA256': sha(originals[name]),
  'afterSHA256': sha(text.encode('utf-8')), 'restoredSHA256': sha(restored.encode('utf-8')),
  'inverseBytesEqual': True, 'URLSequenceUnchanged': urls(old) == urls(text),
  'diff': ''.join(difflib.unified_diff(old.splitlines(True), text.splitlines(True), fromfile=name+'@R1', tofile=name+'@revised'))})
for stem in ['mn-content-audit', 'mn-inputs']:
 source = b / 'checks' / (stem+'.json')
 backup = b / 'checks' / (stem+'-pre-independent-r1.json')
 assert not backup.exists()
 backup.write_bytes(source.read_bytes())
for name, text in proposed.items():
 if text.encode('utf-8') != originals[name]:
  (root/name).write_text(text)
result = {'atUTC': datetime.datetime.now(datetime.timezone.utc).isoformat(),
 'reviewFile': str(report), 'reviewSHA256': sha(report.read_bytes()),
 'changes': changes, 'files': records}
out.write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')
print(json.dumps({'evidence': str(out), 'changes': len(changes), 'files': [{k:v for k,v in x.items() if k!='diff'} for x in records]}, ensure_ascii=False))
