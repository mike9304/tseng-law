let nowMsFn: () => number = () => Date.now();
let uuidFn: () => string = () => crypto.randomUUID();

export function aiIntakeNowMs(): number {
  return nowMsFn();
}

export function aiIntakeNowSeconds(): number {
  return Math.floor(aiIntakeNowMs() / 1000);
}

export function aiIntakeRandomUuid(): string {
  return uuidFn();
}

export function setAiIntakeNowMsForTests(fn: () => number): void {
  nowMsFn = fn;
}

export function setAiIntakeUuidForTests(fn: () => string): void {
  uuidFn = fn;
}

export function resetAiIntakeClockForTests(): void {
  nowMsFn = () => Date.now();
  uuidFn = () => crypto.randomUUID();
}
