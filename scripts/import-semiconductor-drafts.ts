import { importSemiconductorColumnDrafts } from '@/lib/semiconductor-drafts-import';

async function main() {
  const result = await importSemiconductorColumnDrafts();
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
