import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createExperimentAssignmentToken,
  verifyExperimentAssignmentToken,
} from '@/lib/builder/experiments/assignment-token';

describe('experiment assignment tokens', () => {
  beforeEach(() => {
    vi.stubEnv(
      'EXPERIMENT_ASSIGNMENT_SECRET',
      'test-experiment-assignment-secret-with-more-than-thirty-two-bytes',
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('round-trips an assignment bound to its session', () => {
    const token = createExperimentAssignmentToken('exp-1', 'test', 'session-a');

    expect(verifyExperimentAssignmentToken(token, 'session-a')).toEqual({
      experimentId: 'exp-1',
      variantId: 'test',
    });
  });

  it('rejects tampered tokens and tokens replayed in another session', () => {
    const token = createExperimentAssignmentToken('exp-1', 'test', 'session-a');
    const tampered = `${token.slice(0, -1)}${token.endsWith('a') ? 'b' : 'a'}`;

    expect(verifyExperimentAssignmentToken(tampered, 'session-a')).toBeNull();
    expect(verifyExperimentAssignmentToken(token, 'session-b')).toBeNull();
  });

  it('rejects expired tokens', () => {
    const token = createExperimentAssignmentToken(
      'exp-1',
      'test',
      'session-a',
      -1,
    );

    expect(verifyExperimentAssignmentToken(token, 'session-a')).toBeNull();
  });

  it('fails closed in production when no strong server secret is configured', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('EXPERIMENT_ASSIGNMENT_SECRET', '');
    vi.stubEnv('CMS_SESSION_SECRET', '');
    vi.stubEnv('NEXTAUTH_SECRET', '');

    expect(() => createExperimentAssignmentToken(
      'exp-1',
      'test',
      'session-a',
    )).toThrow('EXPERIMENT_ASSIGNMENT_SECRET must be configured');
    expect(verifyExperimentAssignmentToken('invalid.token', 'session-a')).toBeNull();
  });
});
