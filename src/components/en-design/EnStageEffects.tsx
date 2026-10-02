'use client';

import { useCallback } from 'react';
import { useEnCurtainFallback, useEnHeaderOffset, useEnRun, useEnSaveData, useEnSteps } from './useEnStage';

/** Mounted once inside `#en-home`: header offset, save-data flag, the S0 curtain fallback, the S3 run and the S4 steps. */
export function EnHomeStageEffects() {
  const getRoot = useCallback(() => document.getElementById('en-home'), []);
  const getOpenReel = useCallback(() => document.querySelector<HTMLElement>('#en-home [data-reel="open"]'), []);
  const getRun = useCallback(() => document.querySelector<HTMLElement>('#en-home #practice[data-en-run]'), []);
  const getSteps = useCallback(() => document.querySelector<HTMLElement>('#en-home [data-en-focus-stage]'), []);
  useEnHeaderOffset(getRoot);
  useEnSaveData(getRoot);
  useEnCurtainFallback(getOpenReel);
  useEnRun(getRun);
  useEnSteps(getSteps);
  return null;
}

/** Inner pages: keeps `--en-hdr` equal to the measured header so the local nav sticks right under it. */
export function EnPageStageEffects({ rootId }: { rootId: string }) {
  const getRoot = useCallback(() => document.getElementById(rootId), [rootId]);
  useEnHeaderOffset(getRoot);
  return null;
}
