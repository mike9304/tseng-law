/**
 * Mutation lifecycle controller.
 * Consumers own transport (write/refresh) and presentation callbacks.
 * Identity tokens and operation keys are caller-supplied and compared by identity / Map key.
 * The controller never retries, polls, or treats a refresh payload as proof of a write.
 *
 * Presentation (onAck / onRefresh / onState for write, refresh, adjudication) runs only when
 * the captured owner, edit, epoch, and latest mutation generation are still current.
 * Transport outcomes are tagged {ok:true,value} | {ok:false,reason} so a falsy rejection
 * is never treated as success.
 * The latest observe() id owns the shared observation slot; a stale completion must not replace it.
 */

export function createMutationController(ports) {
  if (!ports || typeof ports.write !== 'function' || typeof ports.refresh !== 'function') {
    throw new TypeError('write and refresh ports are required');
  }
  const onAck = ports.onAck == null ? noop : ports.onAck;
  const onRefresh = ports.onRefresh == null ? noop : ports.onRefresh;
  const onState = ports.onState == null ? noop : ports.onState;
  if (typeof onAck !== 'function' || typeof onRefresh !== 'function' || typeof onState !== 'function') {
    throw new TypeError('presentation ports must be functions');
  }

  let disposed = false;
  let opened = false;
  let owner = undefined;
  let edit = undefined;
  let scopeEpoch = 0;
  let latestGeneration = 0;
  let seq = 0;
  const ops = new Map();
  const faults = [];
  let observation = null;
  let observationSeq = 0;
  let activeObservation = 0;

  function viewState() {
    return {
      disposed,
      opened,
      owner,
      edit,
      epoch: scopeEpoch,
      latestGeneration,
      operations: [...ops.values()]
        .sort((a, b) => a.generation - b.generation)
        .map(viewOp),
      observation: observation ? { ...observation } : null,
      callbackFaults: faults.map((f) => ({ ...f })),
    };
  }

  function scopeMatches(capOwner, capEdit, capEpoch) {
    return opened && !disposed
      && scopeEpoch === capEpoch
      && Object.is(owner, capOwner)
      && Object.is(edit, capEdit);
  }

  function opCurrent(op) {
    return scopeMatches(op.owner, op.edit, op.epoch);
  }

  function presentable(op) {
    return opCurrent(op) && latestGeneration === op.generation;
  }

  function guard(hook, key, fn) {
    try {
      fn();
      return true;
    } catch (error) {
      faults.push({
        hook,
        key: key == null ? null : key,
        message: error && error.message ? error.message : String(error),
      });
      return false;
    }
  }

  function emit(source, key, generation) {
    if (disposed || !opened) return;
    const ctx = { source, key: key == null ? null : key, generation: generation == null ? null : generation };
    guard('onState', key, () => onState(viewState(), ctx));
  }

  function capture(value) {
    try {
      return Promise.resolve(value).then(
        (resolved) => ({ ok: true, value: resolved }),
        (reason) => ({ ok: false, reason }),
      );
    } catch (error) {
      return Promise.resolve({ ok: false, reason: error });
    }
  }

  function releaseUndispatched(op, previousLatest) {
    if (op.sent) return;
    ops.delete(op.key);
    if (latestGeneration === op.generation) latestGeneration = previousLatest;
  }

  function settleWrite(op, tagged) {
    if (op.phase !== 'pending') return;
    const outcome = tagged.ok
      ? classifyResolved(tagged.value)
      : { kind: 'unknown', reason: tagged.reason };
    op.outcome = outcome;
    op.phase = outcome.kind;
    if (!presentable(op)) return;
    const ctx = { source: outcome.kind, key: op.key, generation: op.generation };
    if (outcome.kind === 'ack') {
      guard('onAck', op.key, () => onAck(outcome.value, ctx));
      if (!presentable(op)) return;
      emit('ack', op.key, op.generation);
      if (!presentable(op)) return;
      startRefresh(op);
      return;
    }
    emit(outcome.kind, op.key, op.generation);
  }

  function startRefresh(op) {
    op.refresh = { status: 'pending' };
    let result;
    try {
      result = ports.refresh(op.refreshTarget);
    } catch (error) {
      result = Promise.reject(error);
    }
    capture(result).then((tagged) => finishRefresh(op, tagged));
  }

  function finishRefresh(op, tagged) {
    if (!opCurrent(op) || latestGeneration !== op.generation) {
      op.refresh = { status: 'dropped' };
      return;
    }
    if (!tagged.ok) {
      op.refresh = { status: 'error', error: tagged.reason };
      if (!opCurrent(op) || latestGeneration !== op.generation) return;
      emit('refresh-error', op.key, op.generation);
      return;
    }
    op.refresh = { status: 'ready', snapshot: tagged.value };
    const ctx = { source: 'refresh', key: op.key, generation: op.generation };
    guard('onRefresh', op.key, () => onRefresh(tagged.value, ctx));
    if (!opCurrent(op) || latestGeneration !== op.generation) return;
    emit('refresh', op.key, op.generation);
  }

  function observationCurrent(cap) {
    return cap.id === activeObservation
      && opened && !disposed
      && scopeEpoch === cap.epoch
      && Object.is(owner, cap.owner)
      && Object.is(edit, cap.edit)
      && latestGeneration === cap.generation;
  }

  function finishObserve(cap, tagged) {
    if (cap.id !== activeObservation) return;
    if (!observationCurrent(cap)) {
      observation = { status: 'dropped', generation: cap.generation };
      return;
    }
    if (!tagged.ok) {
      observation = { status: 'error', error: tagged.reason, generation: cap.generation };
      if (!observationCurrent(cap)) return;
      emit('observe-error', null, cap.generation);
      return;
    }
    observation = { status: 'ready', snapshot: tagged.value, generation: cap.generation };
    guard('onRefresh', null, () => onRefresh(tagged.value, { source: 'observe', key: null, generation: cap.generation }));
    if (!observationCurrent(cap)) return;
    emit('observe', null, cap.generation);
  }

  return {
    commit(tokens) {
      if (disposed) return { ok: false, reason: 'disposed' };
      if (!tokens || tokens.owner == null || tokens.edit == null) {
        return { ok: false, reason: 'token-required' };
      }
      owner = tokens.owner;
      edit = tokens.edit;
      opened = true;
      scopeEpoch += 1;
      emit('commit', null, null);
      return { ok: true, epoch: scopeEpoch };
    },

    close() {
      if (disposed) return { ok: false, reason: 'disposed' };
      opened = false;
      scopeEpoch += 1;
      return { ok: true, epoch: scopeEpoch };
    },

    dispose() {
      disposed = true;
      opened = false;
      scopeEpoch += 1;
      return { ok: true };
    },

    issueTicket() {
      if (disposed) return { ok: false, reason: 'disposed' };
      if (!opened) return { ok: false, reason: 'closed' };
      return {
        ok: true,
        ticket: Object.freeze({ owner, edit, epoch: scopeEpoch }),
      };
    },

    submit(ticket, request) {
      if (disposed) return { admitted: false, reason: 'disposed' };
      if (!opened) return { admitted: false, reason: 'closed' };
      if (!ticket || ticket.epoch !== scopeEpoch || !Object.is(ticket.owner, owner) || !Object.is(ticket.edit, edit)) {
        return { admitted: false, reason: 'stale-ticket' };
      }
      const key = request ? request.key : undefined;
      if (key == null) return { admitted: false, reason: 'key-required' };
      if (ops.has(key)) {
        return { admitted: false, reason: 'duplicate', phase: ops.get(key).phase };
      }
      const previousLatest = latestGeneration;
      const generation = ++seq;
      latestGeneration = generation;
      const op = {
        key,
        phase: 'pending',
        generation,
        owner,
        edit,
        epoch: scopeEpoch,
        input: request.input,
        refreshTarget: request.refreshTarget,
        outcome: null,
        refresh: { status: 'idle' },
        adjudicated: false,
        sent: false,
      };
      ops.set(key, op);
      emit('submit', key, generation);
      if (!scopeMatches(op.owner, op.edit, op.epoch)) {
        releaseUndispatched(op, previousLatest);
        return { admitted: false, reason: 'not-dispatched', dispatched: false };
      }
      op.sent = true;
      let writeResult;
      try {
        writeResult = ports.write(op.input);
      } catch (error) {
        writeResult = Promise.reject(error);
      }
      capture(writeResult).then((tagged) => settleWrite(op, tagged));
      return { admitted: true, key, generation };
    },

    adjudicate(key, decision) {
      const op = ops.get(key);
      if (!op) return { ok: false, reason: 'unknown-key', writePerformed: false };
      if (op.phase === 'pending') return { ok: false, reason: 'in-flight', writePerformed: false };
      if (op.phase !== 'unknown') return { ok: false, reason: 'terminal', writePerformed: false };
      if (!decision || (decision.kind !== 'ack' && decision.kind !== 'rejected')) {
        return { ok: false, reason: 'decision-required', writePerformed: false };
      }
      op.adjudicated = true;
      if (decision.kind === 'ack') {
        op.phase = 'ack';
        op.outcome = { kind: 'ack', value: decision.value, adjudicated: true };
        if (presentable(op)) {
          guard('onAck', op.key, () => onAck(decision.value, { source: 'adjudicate', key: op.key, generation: op.generation }));
          if (presentable(op)) emit('adjudicate', op.key, op.generation);
        }
      } else {
        op.phase = 'rejected';
        op.outcome = { kind: 'rejected', reason: decision.reason, adjudicated: true };
        if (presentable(op)) emit('adjudicate', op.key, op.generation);
      }
      return { ok: true, writePerformed: false, retainedKey: key };
    },

    observe(target) {
      if (disposed) return { started: false, causal: false, reason: 'disposed' };
      if (!opened) return { started: false, causal: false, reason: 'closed' };
      const id = ++observationSeq;
      activeObservation = id;
      const cap = { id, owner, edit, epoch: scopeEpoch, generation: latestGeneration };
      observation = { status: 'pending', generation: cap.generation };
      let result;
      try {
        result = ports.refresh(target);
      } catch (error) {
        result = Promise.reject(error);
      }
      capture(result).then((tagged) => finishObserve(cap, tagged));
      return { started: true, causal: false };
    },

    getState() {
      return viewState();
    },
  };
}

function viewOp(op) {
  return {
    key: op.key,
    phase: op.phase,
    generation: op.generation,
    busy: op.phase === 'pending',
    adjudicated: op.adjudicated === true,
    outcome: op.outcome,
    refresh: { ...op.refresh },
  };
}

function classifyResolved(raw) {
  if (raw !== null && typeof raw === 'object' && !Array.isArray(raw)) {
    if (raw.kind === 'ack') return { kind: 'ack', value: raw.value };
    if (raw.kind === 'rejected') return { kind: 'rejected', reason: raw.reason };
    if (raw.kind === 'unknown') return { kind: 'unknown', reason: raw.reason };
  }
  return { kind: 'unknown', reason: { malformed: true } };
}

function noop() {}
