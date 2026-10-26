"""Select compact B8 release evidence, retaining bulky originals in BASE."""
from pathlib import Path
import json

B=Path('/Users/son7/tseng-all-language-columns-20261025/batch08')
A=Path('/Users/son7/Projects/tseng-law-all-locales-20261025/docs/audit/all-locales-parity-20261025/batch08')
readiness=json.loads((B/'checks/integration-readiness-manifest.json').read_text())
variety=json.loads((B/'checks/integration-variety-evidence.json').read_text())
LOCALES={x['locale'] for x in readiness['localeEvidence']}
FORCED={Path(x['path']) for x in readiness['directFinalEvidenceReferencesVerified']}
FORCED.update(Path(x['savedCLIRecord']) for x in variety['files'])
for lane in readiness['localeEvidence']:
    FORCED.update(Path(lane[k]['path']) for k in ['authorManifest','independentManifest','authorReport','independentReport'])
SELF_EXCLUDED={'integration-audit-copy-manifest.json','integration-ready-freeze.json'}
LARGE_INTEGRATION={'integration-before.json','integration-before-inventory.json','integration-r-inventory.json','integration-content-audit.json'}
LARGE_TOOL={'INPUT-FREEZE.json','baseline-corpus.json','candidate-corpus.json','baseline-targets.json','candidate-targets.json'}

def in_scope(p):
    rel=p.relative_to(B)
    return not p.name.startswith('capacity-independent') and not any(part.startswith('capacity-independent') for part in rel.parts)

def select(p):
    rel=p.relative_to(B)
    if not in_scope(p) or p.name in SELF_EXCLUDED:
        return False
    if rel==Path('BRIEF.md') or p in FORCED:
        return True
    if rel.parts[0]=='reviews':
        return p.name.split('-')[0] in LOCALES
    if rel.parts[0]=='existing-repairs':
        return True
    if len(rel.parts)==2 and rel.parts[0]=='checks':
        return p.name.startswith('integration-') and p.name not in LARGE_INTEGRATION
    if len(rel.parts)==3 and rel.parts[:2]==('tooling','date-boundaries'):
        return p.name not in LARGE_TOOL
    return False
