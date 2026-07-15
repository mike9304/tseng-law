import { link, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  _setSafeLocalFsHookForTests,
  openSafeLocalFsRoot,
  type SafeLocalFsTestHookStage,
} from '../../safe-local-fs';

const [root, marker, stage, overwriteText, action] = process.argv.slice(2);
if (!root || !marker || !stage || !overwriteText) {
  throw new Error('safe local fs crash worker arguments are required');
}

const expectedStage = stage as SafeLocalFsTestHookStage;
const overwrite = overwriteText === 'true';
const safe = await openSafeLocalFsRoot(root);
let matchingStageCount = 0;

_setSafeLocalFsHookForTests(async (currentStage, absolutePath) => {
  if (currentStage !== expectedStage) return;
  matchingStageCount += 1;
  if (action === 'pause-third-match' && matchingStageCount !== 3) return;
  if (
    !action
    && expectedStage !== 'after-exclusive-link-before-cleanup'
    && !path.basename(absolutePath).startsWith('.safe-local-fs-write-')
  ) return;
  if (action === 'link-temp-to-target') {
    await link(absolutePath, path.join(root, 'target.txt'));
  }
  await writeFile(marker, 'ready', 'utf8');
  await new Promise<never>(() => undefined);
});

if (action === 'remove') {
  await safe.removeFile('target.txt');
} else {
  await safe.writeFile('target.txt', 'complete payload', { overwrite });
}
