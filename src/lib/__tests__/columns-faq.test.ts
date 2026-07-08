import { describe, expect, it } from 'vitest';
import { normalizeColumnFaq } from '@/lib/columns';

describe('normalizeColumnFaq', () => {
  it('returns an empty array when the input is not an array', () => {
    expect(normalizeColumnFaq(undefined)).toEqual([]);
    expect(normalizeColumnFaq(null)).toEqual([]);
    expect(normalizeColumnFaq({})).toEqual([]);
    expect(normalizeColumnFaq('not-an-array')).toEqual([]);
    expect(normalizeColumnFaq(42)).toEqual([]);
  });

  it('parses well-formed { q, a } entries', () => {
    const result = normalizeColumnFaq([
      { q: '대만 회사 설립 시 자회사·지사 차이는?', a: '자회사는 독립 법인격이 있습니다.' },
      { q: '비자 발급이 가능한가요?', a: '네, 가능합니다.' },
    ]);

    expect(result).toEqual([
      { q: '대만 회사 설립 시 자회사·지사 차이는?', a: '자회사는 독립 법인격이 있습니다.' },
      { q: '비자 발급이 가능한가요?', a: '네, 가능합니다.' },
    ]);
  });

  it('trims surrounding whitespace from q and a', () => {
    const result = normalizeColumnFaq([{ q: '  질문  ', a: '  답변  ' }]);
    expect(result).toEqual([{ q: '질문', a: '답변' }]);
  });

  it('drops entries that are not objects', () => {
    const result = normalizeColumnFaq([
      'string-entry',
      123,
      null,
      true,
      { q: '유효', a: '유효 답' },
    ]);

    expect(result).toEqual([{ q: '유효', a: '유효 답' }]);
  });

  it('drops entries missing q', () => {
    const result = normalizeColumnFaq([
      { a: '답만 있음' },
      { q: '', a: '빈 질문' },
      { q: '유효 질문', a: '유효 답' },
    ]);

    expect(result).toEqual([{ q: '유효 질문', a: '유효 답' }]);
  });

  it('drops entries missing a', () => {
    const result = normalizeColumnFaq([
      { q: '질문만 있음' },
      { q: '질문', a: '' },
      { q: '유효 질문', a: '유효 답' },
    ]);

    expect(result).toEqual([{ q: '유효 질문', a: '유효 답' }]);
  });

  it('drops entries where q and a are whitespace-only', () => {
    const result = normalizeColumnFaq([
      { q: '   ', a: '답' },
      { q: '질문', a: '\t\n' },
      { q: '유효 질문', a: '유효 답' },
    ]);

    expect(result).toEqual([{ q: '유효 질문', a: '유효 답' }]);
  });

  it('keeps only valid items when mixed with malformed ones', () => {
    const result = normalizeColumnFaq([
      { q: '첫째 질문', a: '첫째 답' },
      'garbage',
      { q: '', a: '버려질 답' },
      { q: '둘째 질문', a: '둘째 답' },
      null,
      { q: '셋째 질문', a: '셋째 답' },
    ]);

    expect(result).toEqual([
      { q: '첫째 질문', a: '첫째 답' },
      { q: '둘째 질문', a: '둘째 답' },
      { q: '셋째 질문', a: '셋째 답' },
    ]);
  });
});
