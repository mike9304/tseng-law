"""Select bounded B9 release evidence; preserve original raw corpus in BASE."""
from pathlib import Path
import json
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch09')
A=Path('/Users/son7/Projects/tseng-law-all-locales-20261025/docs/audit/all-locales-parity-20261025/batch09')
r=json.loads((B/'checks/integration-readiness-manifest.json').read_text())
LOCALES={x['locale'] for x in r['localeEvidence']}
FORCED={Path(x['path']) for x in r['directFinalEvidenceReferencesVerified']}
FORCED.update(Path(x['path']) for x in r['toolInstallationReceipts'] if Path(x['path']).is_relative_to(B))
FORCED.update([Path(r['repairClosure']['path']),Path(r['repairAuthorManifest']['path'])])
for lane in r['localeEvidence']:
 FORCED.update(Path(lane[k]['path']) for k in ['authorManifest','independentManifest','authorReport','independentReport'])
SELF_EXCLUDED={'integration-audit-copy-manifest.json','integration-ready-freeze.json'}
LARGE={'integration-before.json','integration-before-inventory.json','integration-r-inventory.json','integration-content-audit.json'}
def select(p):
 rel=p.relative_to(B)
 if p.name in SELF_EXCLUDED:return False
 if rel==Path('BRIEF.md') or p in FORCED:return True
 if rel.parts[0]=='reviews':return p.name.split('-')[0] in LOCALES
 if rel.parts[0]=='existing-repairs':return True
 if len(rel.parts)==2 and rel.parts[0]=='checks':return p.name.startswith('integration-') and p.name not in LARGE
 return False
