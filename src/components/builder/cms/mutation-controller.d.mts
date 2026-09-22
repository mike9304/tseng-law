/**
 * Dependency-free mutation lifecycle.
 *
 * Tokens (`owner`, `edit`) are opaque caller values. Compare with Object.is.
 * Supply a new token object/symbol for every commit, reopen, and edit generation.
 * Do not derive tokens from render text; equal labels are not equal identities.
 *
 * Operation `key` is a stable caller key. The same key is never written twice.
 * An unknown outcome stays on that key across close/reopen until `adjudicate`.
 * A later attempt must use a different key. `adjudicate` does not call `write`.
 *
 * `write` results are only the structured kinds below. Thrown or malformed
 * results are `unknown`, including a falsy rejection reason (null, undefined,
 * false, 0, ''). Status codes are not interpreted. Refresh never changes a
 * mutation phase. `observe` is read-only and is not causal proof.
 *
 * Submit reserves the key, notifies onState, then rechecks owner/edit/epoch/disposed
 * before write. If that notification closes, disposes, or replaces identity, submit
 * returns `{ admitted:false, reason:'not-dispatched', dispatched:false }` and drops
 * the unsent reservation so it is not left pending. A nested duplicate still sees
 * the reservation. Presentation of ack, rejection, unknown, refresh, and adjudication
 * requires the operation generation to still be `latestGeneration` after every callback.
 * Older outcomes stay stored and do not overwrite newer presentation. Concurrent keys
 * are not treated as canceled.
 *
 * Only the latest `observe` owns the shared observation slot. An older or
 * scope-stale completion cannot replace that slot or emit presentation.
 *
 * Limits: no evidence-trust check, no server-idempotency guarantee, no reload
 * persistence, no cross-controller lock, no retries, timers, TTLs, caches, or polling.
 * Caller must pass immutable input and refresh target values.
 */
export type MutationKind = 'ack' | 'rejected' | 'unknown';

export type WriteResult =
  | { kind: 'ack'; value: unknown }
  | { kind: 'rejected'; reason: unknown }
  | { kind: 'unknown'; reason: unknown };

export interface PresentationContext {
  source: string;
  key: unknown;
  generation: number | null;
}

export interface MutationPorts {
  write(input: unknown): Promise<WriteResult> | WriteResult;
  refresh(target: unknown): Promise<unknown> | unknown;
  onAck?(value: unknown, context: PresentationContext): void;
  onRefresh?(snapshot: unknown, context: PresentationContext): void;
  onState?(state: ControllerState, context: PresentationContext): void;
}

export interface IdentityTokens {
  owner: unknown;
  edit: unknown;
}

export interface MutationTicket {
  readonly owner: unknown;
  readonly edit: unknown;
  readonly epoch: number;
}

export interface SubmitRequest {
  key: unknown;
  input: unknown;
  refreshTarget: unknown;
}

export type Admission =
  | { admitted: true; key: unknown; generation: number }
  | { admitted: false; reason: string; phase?: MutationKind | 'pending'; dispatched?: false };

export type AdjudicationDecision =
  | { kind: 'ack'; value: unknown }
  | { kind: 'rejected'; reason: unknown };

export interface OperationView {
  key: unknown;
  phase: MutationKind | 'pending';
  generation: number;
  busy: boolean;
  adjudicated: boolean;
  outcome: (WriteResult & { adjudicated?: boolean }) | null;
  refresh: { status: string; snapshot?: unknown; error?: unknown };
}

export interface ControllerState {
  disposed: boolean;
  opened: boolean;
  owner: unknown;
  edit: unknown;
  epoch: number;
  latestGeneration: number;
  operations: OperationView[];
  observation: { status: string; snapshot?: unknown; error?: unknown; generation?: number } | null;
  callbackFaults: { hook: string; key: unknown; message: string }[];
}

export interface MutationController {
  /** Install caller-supplied owner and edit tokens and open a scope. Invalidates older tickets. */
  commit(tokens: IdentityTokens): { ok: true; epoch: number } | { ok: false; reason: string };
  /** Synchronously invalidate the scope. In-flight writes are not canceled and records are kept. */
  close(): { ok: true; epoch: number } | { ok: false; reason: string };
  /** Unmount: no further presentation. Records stop being shown. */
  dispose(): { ok: true };
  /** Capture the current owner, edit, and epoch. A retained ticket cannot submit after close or recommit. */
  issueTicket(): { ok: true; ticket: MutationTicket } | { ok: false; reason: string };
  /**
   * Reserve `key` synchronously, notify, recheck scope, then call write at most once.
   * Duplicate keys are refused. Input and refreshTarget are the values passed here.
   * If scope dies during the submit notification, nothing is sent and the key is released.
   */
  submit(ticket: MutationTicket, request: SubmitRequest): Admission;
  /**
   * Caller-driven resolution of an `unknown` record. Does not write or retry.
   * Does not delete the record. A new attempt needs a new submit key.
   * UI callbacks run only when this record is still the latest generation.
   */
  adjudicate(key: unknown, decision: AdjudicationDecision): { ok: boolean; reason?: string; writePerformed: false; retainedKey?: unknown };
  /** Read-only refresh. Cannot acknowledge or reject any operation, even if data matches. Latest observe owns the slot. */
  observe(target: unknown): { started: boolean; causal: false; reason?: string };
  getState(): ControllerState;
}

export function createMutationController(ports: MutationPorts): MutationController;
