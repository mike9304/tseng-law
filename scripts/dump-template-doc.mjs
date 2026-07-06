// Dump a template document to JSON for preview rendering. Run via vite-node.
// Usage: node_modules/.bin/vite-node scripts/dump-template-doc.mjs -- <templateId> <outJson>
import { promises as fs } from 'node:fs';
import { getTemplateById } from '../src/lib/builder/templates/registry.ts';

const id = process.argv[process.argv.length - 2];
const out = process.argv[process.argv.length - 1];
const t = getTemplateById(id);
if (!t) { console.error('template not found:', id); process.exit(1); }
await fs.writeFile(out, JSON.stringify(t.document, null, 0));
console.log('dumped', id, '->', out, `(${t.document.nodes.length} nodes)`);
